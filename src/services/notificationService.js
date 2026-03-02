/**
 * Server-driven Notification Service
 *
 * Connects to the Go backend via WebSocket for real-time cross-device
 * notifications.  Sends notifications through the REST API so the server
 * can broadcast them to every connected client.
 *
 * Reconnection uses exponential back-off with jitter (1 s → 30 s cap).
 */

const API_BASE = import.meta.env.VITE_API_URL || '';
const WS_BASE =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

class NotificationService {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.connectionListeners = [];
    this.channel = null;
    this.connected = false;
    this._reconnectTimer = null;
    this._reconnectAttempt = 0;
    this._maxReconnectAttempts = 20;
    this._intentionalClose = false;
  }

  // -------------------------------------------------------------------------
  // Connection lifecycle
  // -------------------------------------------------------------------------

  /**
   * Open a WebSocket to the notification channel.
   * @param {string} [channel='default']
   */
  connect(channel = 'default') {
    this.channel = channel;
    this._intentionalClose = false;
    this._open();
  }

  /** Cleanly disconnect and stop reconnecting. */
  disconnect() {
    this._intentionalClose = true;
    clearTimeout(this._reconnectTimer);
    if (this.ws) {
      this.ws.close(1000, 'client disconnect');
      this.ws = null;
    }
    this._setConnected(false);
  }

  /**
   * Switch to a different channel. Disconnects + reconnects automatically.
   * @param {string} channel
   */
  setChannel(channel) {
    if (channel === this.channel) return;
    this.disconnect();
    this.connect(channel);
  }

  getChannel() {
    return this.channel;
  }

  isConnected() {
    return this.connected;
  }

  // -------------------------------------------------------------------------
  // Send notifications (REST)
  // -------------------------------------------------------------------------

  /**
   * Post a notification to the server which broadcasts it to all connected
   * clients on the same channel.
   *
   * @param {Object} notification
   * @returns {Promise<Object>} server response
   */
  async sendNotification(notification) {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...notification, channel: this.channel }),
    });
    if (!res.ok) throw new Error(`Send failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  /**
   * Fetch recent notifications stored on the server for the current channel.
   * @returns {Promise<Object[]>}
   */
  async fetchRecent() {
    const res = await fetch(
      `${API_BASE}/api/notifications?channel=${encodeURIComponent(this.channel || 'default')}`,
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const body = await res.json();
    return body.notifications || [];
  }

  /**
   * Get live connection stats from the server.
   * @returns {Promise<Object>}
   */
  async getStatus() {
    const res = await fetch(`${API_BASE}/api/notifications/status`);
    return res.json();
  }

  // -------------------------------------------------------------------------
  // Event subscriptions
  // -------------------------------------------------------------------------

  /**
   * Subscribe to incoming notifications.
   * @param {(notification: Object) => void} cb
   * @returns {() => void} unsubscribe function
   */
  subscribe(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  /**
   * Subscribe to connection-state changes.
   * @param {(connected: boolean) => void} cb
   * @returns {() => void} unsubscribe function
   */
  onConnectionChange(cb) {
    this.connectionListeners.push(cb);
    return () => {
      this.connectionListeners = this.connectionListeners.filter((l) => l !== cb);
    };
  }

  /** Tear down everything. */
  destroy() {
    this.disconnect();
    this.listeners = [];
    this.connectionListeners = [];
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  _open() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    const url = `${WS_BASE}/ws/notifications?channel=${encodeURIComponent(this.channel || 'default')}`;

    try {
      this.ws = new WebSocket(url);
    } catch (err) {
      console.error('[ws] construction failed', err);
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this._reconnectAttempt = 0;
      this._setConnected(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const envelope = JSON.parse(event.data);
        if (envelope.type === 'notification') {
          const notif = typeof envelope.data === 'string'
            ? JSON.parse(envelope.data)
            : envelope.data;
          this._emit(notif);
        }
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onclose = () => {
      this._setConnected(false);
      if (!this._intentionalClose) this._scheduleReconnect();
    };

    this.ws.onerror = () => {
      // onclose fires right after onerror, which triggers reconnect
    };
  }

  _scheduleReconnect() {
    if (this._reconnectAttempt >= this._maxReconnectAttempts) return;
    const base = Math.min(1000 * Math.pow(2, this._reconnectAttempt), 30000);
    const jitter = Math.random() * 1000;
    const delay = base + jitter;
    this._reconnectAttempt++;
    this._reconnectTimer = setTimeout(() => this._open(), delay);
  }

  _setConnected(val) {
    if (this.connected === val) return;
    this.connected = val;
    this.connectionListeners.forEach((cb) => {
      try { cb(val); } catch { /* */ }
    });
  }

  _emit(notification) {
    this.listeners.forEach((cb) => {
      try { cb(notification); } catch { /* */ }
    });
  }
}

export const notificationService = new NotificationService();

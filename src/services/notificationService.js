/**
 * Enhanced Notification Service
 * Handles cross-tab and cross-device communication for real-time notifications
 * - BroadcastChannel API for same-device tabs
 * - Shared session mechanism for cross-device communication (demo)
 */

class NotificationService {
  constructor() {
    this.channel = null;
    this.listeners = [];
    this.sessionId = null;
    this.pollInterval = null;
    this.pollIntervalMs = 500; // Poll every 500ms for cross-device
    this.lastNotificationId = null;
    this.init();
  }

  init() {
    // Initialize BroadcastChannel for same-device tabs
    try {
      this.channel = new BroadcastChannel('notification_channel');
      
      this.channel.onmessage = (event) => {
        if (event.data.type === 'NEW_NOTIFICATION') {
          this.notifyListeners(event.data.notification);
        }
      };
    } catch (error) {
      console.warn('BroadcastChannel not supported, falling back to localStorage events');
      window.addEventListener('storage', (event) => {
        if (event.key === 'notification_broadcast' && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            if (data.type === 'NEW_NOTIFICATION') {
              this.notifyListeners(data.notification);
            }
          } catch (e) {
            console.error('Error parsing notification broadcast:', e);
          }
        }
      });
    }

    // Initialize cross-device polling
    this.initCrossDevicePolling();
  }

  /**
   * Initialize or get session ID from URL or generate new one
   */
  getSessionId() {
    if (this.sessionId) return this.sessionId;

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    
    if (sessionParam) {
      this.sessionId = sessionParam;
      // Store in sessionStorage for persistence
      sessionStorage.setItem('notification_session', sessionParam);
    } else {
      // Check sessionStorage
      const stored = sessionStorage.getItem('notification_session');
      if (stored) {
        this.sessionId = stored;
      } else {
        // Generate new session ID
        this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('notification_session', this.sessionId);
      }
    }

    return this.sessionId;
  }

  /**
   * Initialize cross-device polling mechanism
   * Uses a shared storage key based on session ID
   */
  initCrossDevicePolling() {
    const sessionId = this.getSessionId();
    const storageKey = `notification_cross_device_${sessionId}`;

    // Poll for cross-device notifications
    this.pollInterval = setInterval(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const data = JSON.parse(stored);
          
          // Check if this is a new notification
          if (data.notification && data.notification.id !== this.lastNotificationId) {
            this.lastNotificationId = data.notification.id;
            
            // Notify listeners
            this.notifyListeners(data.notification);
            
            // Clear the storage after reading (to prevent duplicate notifications)
            // But keep it for a short time to ensure all devices get it
            setTimeout(() => {
              localStorage.removeItem(storageKey);
            }, 2000);
          }
        }
      } catch (e) {
        console.error('Error polling cross-device notifications:', e);
      }
    }, this.pollIntervalMs);
  }

  /**
   * Send a notification to all tabs and devices
   * @param {Object} notification - Notification object
   */
  broadcastNotification(notification) {
    const message = {
      type: 'NEW_NOTIFICATION',
      notification: {
        ...notification,
        id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: notification.timestamp || new Date().toISOString(),
        isRead: false,
      },
    };

    // Broadcast to same-device tabs
    if (this.channel) {
      this.channel.postMessage(message);
    } else {
      // Fallback to localStorage for same-device
      localStorage.setItem('notification_broadcast', JSON.stringify(message));
      localStorage.removeItem('notification_broadcast');
    }

    // Broadcast to cross-device (using shared session storage)
    const sessionId = this.getSessionId();
    const storageKey = `notification_cross_device_${sessionId}`;
    
    // Store notification with timestamp
    const crossDeviceMessage = {
      ...message,
      timestamp: Date.now(),
      sessionId: sessionId,
    };
    
    localStorage.setItem(storageKey, JSON.stringify(crossDeviceMessage));
    this.lastNotificationId = message.notification.id;
  }

  /**
   * Subscribe to notification events
   * @param {Function} callback - Callback function to receive notifications
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners
   * @param {Object} notification - Notification object
   */
  notifyListeners(notification) {
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  /**
   * Set session ID manually (for device pairing)
   * @param {string} sessionId - Session ID to use
   */
  setSessionId(sessionId) {
    this.sessionId = sessionId;
    sessionStorage.setItem('notification_session', sessionId);
  }

  /**
   * Get current session ID
   * @returns {string} Current session ID
   */
  getCurrentSessionId() {
    return this.getSessionId();
  }

  /**
   * Generate QR code data for session pairing
   * @returns {string} URL with session ID
   */
  getPairingUrl() {
    const sessionId = this.getSessionId();
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?session=${sessionId}`;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    this.listeners = [];
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

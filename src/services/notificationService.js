/**
 * Notification Service
 * Handles cross-tab communication for real-time notifications
 * Uses BroadcastChannel API for modern browser support
 */

class NotificationService {
  constructor() {
    this.channel = null;
    this.listeners = [];
    this.init();
  }

  init() {
    try {
      // Create a BroadcastChannel for cross-tab communication
      this.channel = new BroadcastChannel('notification_channel');
      
      // Listen for messages from other tabs
      this.channel.onmessage = (event) => {
        if (event.data.type === 'NEW_NOTIFICATION') {
          this.notifyListeners(event.data.notification);
        }
      };
    } catch (error) {
      console.warn('BroadcastChannel not supported, falling back to localStorage events');
      // Fallback to storage events for older browsers
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
  }

  /**
   * Send a notification to all tabs
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

    if (this.channel) {
      // Use BroadcastChannel (modern browsers)
      this.channel.postMessage(message);
    } else {
      // Fallback to localStorage (older browsers)
      localStorage.setItem('notification_broadcast', JSON.stringify(message));
      localStorage.removeItem('notification_broadcast');
    }
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
   * Cleanup
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
    }
    this.listeners = [];
  }
}

// Export singleton instance
export const notificationService = new NotificationService();


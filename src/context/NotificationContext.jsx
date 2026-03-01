import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

const CHANNEL_KEY = 'notification_channel';

function getInitialChannel() {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get('channel') ||
    sessionStorage.getItem(CHANNEL_KEY) ||
    'default'
  );
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toastNotification, setToastNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannelState] = useState(getInitialChannel);

  // Connect to the WebSocket on mount, reconnect when channel changes.
  useEffect(() => {
    sessionStorage.setItem(CHANNEL_KEY, channel);
    notificationService.connect(channel);

    const unsubNotif = notificationService.subscribe((notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        const updated = [notification, ...prev];

        setToastNotification(notification);
        setTimeout(() => setToastNotification(null), 5000);

        return updated;
      });
    });

    const unsubConn = notificationService.onConnectionChange(setIsConnected);

    // Fetch recent notifications so the user sees history on load.
    notificationService.fetchRecent().then((recent) => {
      if (recent.length) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const fresh = recent.filter((n) => !existingIds.has(n.id));
          return [...prev, ...fresh];
        });
      }
    }).catch(() => {
      // Backend may not be running yet; that's OK.
    });

    return () => {
      unsubNotif();
      unsubConn();
      notificationService.disconnect();
    };
  }, [channel]);

  const setChannel = useCallback((ch) => {
    setChannelState(ch);
  }, []);

  const addNotification = useCallback((notification) => {
    const n = {
      ...notification,
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: notification.timestamp || new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [n, ...prev]);
    setToastNotification(n);
    setTimeout(() => setToastNotification(null), 5000);
  }, []);

  const toggleReadStatus = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value = {
    notifications,
    toastNotification,
    setToastNotification,
    addNotification,
    toggleReadStatus,
    markAllAsRead,
    markAsRead,
    unreadCount,
    isConnected,
    channel,
    setChannel,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

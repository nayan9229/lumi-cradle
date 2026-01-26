import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import notificationsData from '../data/notifications.json';

/**
 * Notification Context
 * Manages global notification state and real-time updates
 */
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    // Load from localStorage or use default data
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return notificationsData;
      }
    }
    return notificationsData;
  });

  const [toastNotification, setToastNotification] = useState(null);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Listen for real-time notifications
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotification) => {
      // Check if notification already exists using a ref or by checking state
      setNotifications(prev => {
        const exists = prev.some(n => n.id === newNotification.id);
        if (!exists) {
          // Add new notification
          const updated = [newNotification, ...prev];
          
          // Show toast
          setToastNotification(newNotification);
          
          // Auto-hide toast after 5 seconds
          setTimeout(() => {
            setToastNotification(null);
          }, 5000);
          
          return updated;
        }
        return prev;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array - only subscribe once

  // Add notification manually
  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: notification.timestamp || new Date().toISOString(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    setToastNotification(newNotification);
    
    setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  }, []);

  // Toggle read status
  const toggleReadStatus = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  }, []);

  // Mark as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value = {
    notifications,
    toastNotification,
    setToastNotification,
    addNotification,
    toggleReadStatus,
    markAllAsRead,
    markAsRead,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to use notification context
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}


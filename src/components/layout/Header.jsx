import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, User, AlertCircle, Heart, Baby, Moon, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';

/**
 * Header component with search and notifications
 * @param {Object} props
 * @param {Function} props.onMenuClick - Handler for mobile menu toggle
 */
export default function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();
  
  // Get unread notifications count
  const notificationCount = unreadCount;
  
  // Separate new (unread) and old (read) notifications
  const newNotifications = notifications.filter(n => !n.isRead);
  const oldNotifications = notifications.filter(n => n.isRead);
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'cry':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'health':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'milestone':
        return <Baby className="w-4 h-4 text-blue-500" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'feed':
        return <Utensils className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationMenu(!showNotificationMenu);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <motion.span
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              <AnimatePresence>
                {showNotificationMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotificationMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-w-[calc(100vw-1rem)] sm:max-w-none bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-[calc(100vh-5rem)] sm:max-h-[600px] overflow-hidden flex flex-col"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                          {notificationCount > 0 && (
                            <span className="text-xs text-gray-500">
                              {notificationCount} new
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowNotificationMenu(false);
                              navigate('/notifications');
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View All
                          </button>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="overflow-y-auto flex-1">
                        {/* New Notifications */}
                        {newNotifications.length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                                New ({newNotifications.length})
                              </p>
                            </div>
                            <div className="divide-y divide-gray-100">
                              {newNotifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  onClick={() => {
                                    setShowNotificationMenu(false);
                                    navigate(`/notifications?id=${notification.id}`);
                                  }}
                                  className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-blue-500"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                      {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold text-gray-900">
                                          {notification.title}
                                        </p>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                          {formatTime(notification.timestamp)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-1">
                                        {notification.message}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Old Notifications */}
                        {oldNotifications.length > 0 && (
                          <div>
                            {newNotifications.length > 0 && (
                              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Earlier ({oldNotifications.length})
                                </p>
                              </div>
                            )}
                            <div className="divide-y divide-gray-100">
                              {oldNotifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  onClick={() => {
                                    setShowNotificationMenu(false);
                                    navigate(`/notifications?id=${notification.id}`);
                                  }}
                                  className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer opacity-75"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                      {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-gray-700">
                                          {notification.title}
                                        </p>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                          {formatTime(notification.timestamp)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {notification.message}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {notifications.length === 0 && (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No notifications</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotificationMenu(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="User menu"
              >
                <Avatar src={user?.avatarUrl} alt={user?.name || 'User'} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


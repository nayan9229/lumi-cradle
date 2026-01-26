import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  X, 
  AlertCircle, 
  Heart, 
  Baby, 
  Moon, 
  Utensils,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useNotifications } from '../context/NotificationContext';

/**
 * Notifications page with search, filters, pagination, and detail view
 */
export default function Notifications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const { notifications, toggleReadStatus, markAllAsRead, unreadCount } = useNotifications();
  const notificationRefs = useRef({});
  const itemsPerPage = 10;
  
  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || notification.type === selectedType;
      const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
      const matchesStatus = 
        selectedStatus === 'all' || 
        (selectedStatus === 'read' && notification.isRead) ||
        (selectedStatus === 'unread' && !notification.isRead);
      
      return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });
  }, [notifications, searchQuery, selectedType, selectedPriority, selectedStatus]);

  // Handle notification ID from URL
  useEffect(() => {
    const notificationId = searchParams.get('id');
    if (notificationId) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        // Find which page the notification is on
        const index = filteredNotifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          const page = Math.ceil((index + 1) / itemsPerPage);
          setCurrentPage(page);
          
          // Set highlighted and open detail after a short delay to allow page to render
          setTimeout(() => {
            setHighlightedId(notificationId);
            setSelectedNotification(notification);
            
            // Scroll to the notification
            const ref = notificationRefs.current[notificationId];
            if (ref) {
              ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              setHighlightedId(null);
            }, 3000);
          }, 100);
        }
      }
    }
  }, [searchParams, filteredNotifications, notifications, itemsPerPage]);

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'cry':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'health':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'milestone':
        return <Baby className="w-5 h-5 text-blue-500" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'feed':
        return <Utensils className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      relative: formatRelativeTime(timestamp)
    };
  };

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  // Notification types
  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'cry', label: 'Cry Events' },
    { value: 'health', label: 'Health' },
    { value: 'milestone', label: 'Milestones' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'feed', label: 'Feeding' },
  ];

  // Priorities
  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  // Statuses
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => {
                    setSelectedPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        {paginatedNotifications.length > 0 ? (
          <>
            <div className="space-y-2">
              {paginatedNotifications.map((notification) => {
                const timestamp = formatTimestamp(notification.timestamp);
                const isHighlighted = highlightedId === notification.id;
                return (
                  <motion.div
                    key={notification.id}
                    ref={(el) => {
                      if (el) {
                        notificationRefs.current[notification.id] = el;
                      }
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isHighlighted ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      isHighlighted
                        ? 'bg-yellow-50 border-yellow-400 border-2 shadow-lg ring-2 ring-yellow-300'
                        : notification.isRead 
                          ? 'bg-white border-gray-200 opacity-75' 
                          : 'bg-blue-50 border-blue-200 border-l-4'
                    }`}
                    onClick={() => {
                      setSelectedNotification(notification);
                      if (!notification.isRead) {
                        toggleReadStatus(notification.id);
                      }
                      // Clear URL param when clicking
                      setSearchParams({});
                      setHighlightedId(null);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                            <Badge variant={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReadStatus(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                          >
                            {notification.isRead ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className={`text-sm mb-2 ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timestamp.relative}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {timestamp.date} at {timestamp.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredNotifications.length)} of {filteredNotifications.length} notifications
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">No notifications found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
          </div>
        )}
      </Card>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
            >
              <motion.div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(selectedNotification.type)}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h2>
                      <p className="text-sm text-gray-500">{formatTimestamp(selectedNotification.timestamp).date} at {formatTimestamp(selectedNotification.timestamp).time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    {/* Message */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Message</h3>
                      <p className="text-gray-600">{selectedNotification.message}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(selectedNotification.priority)}>
                        {selectedNotification.priority} priority
                      </Badge>
                      <Badge variant={selectedNotification.isRead ? 'info' : 'warning'}>
                        {selectedNotification.isRead ? 'Read' : 'Unread'}
                      </Badge>
                      <Badge variant="info">
                        {selectedNotification.type}
                      </Badge>
                    </div>

                    {/* Details */}
                    {selectedNotification.details && (
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Details</h3>
                        <div className="space-y-3">
                          {Object.entries(selectedNotification.details).map(([key, value]) => (
                            <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2">
                              <span className="text-sm font-medium text-gray-600 capitalize min-w-[120px]">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-sm text-gray-800 flex-1">
                                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      toggleReadStatus(selectedNotification.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {selectedNotification.isRead ? 'Mark as unread' : 'Mark as read'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNotification(null);
                      // Clear URL param when closing
                      setSearchParams({});
                      setHighlightedId(null);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


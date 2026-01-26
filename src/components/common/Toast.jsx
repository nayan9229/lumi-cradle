import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Heart, Baby, Moon, Utensils, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

/**
 * Toast notification component
 * Shows real-time notifications and allows navigation to details
 */
export default function Toast() {
  const { toastNotification, setToastNotification, markAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!toastNotification) return null;

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
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleClick = () => {
    markAsRead(toastNotification.id);
    setToastNotification(null);
    navigate(`/notifications?id=${toastNotification.id}`);
  };

  return (
    <AnimatePresence>
      {toastNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 max-w-md w-full mx-4"
        >
          <div
            className={`${getPriorityColor(toastNotification.priority)} border-2 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow`}
            onClick={handleClick}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {getNotificationIcon(toastNotification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {toastNotification.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToastNotification(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {toastNotification.message}
                </p>
                <p className="text-xs text-gray-500">
                  Click to view details
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


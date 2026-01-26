import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, AlertCircle, Heart, Baby, Moon, Utensils, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

/**
 * Mobile-first Toast notification component
 * - Mobile: Bottom slide-in with swipe-to-dismiss
 * - Desktop: Top-right corner with fade-in
 */
export default function Toast() {
  const { toastNotification, setToastNotification, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -100], [1, 0]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset dismissed state when notification changes
  useEffect(() => {
    setDismissed(false);
  }, [toastNotification?.id]);

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
    if (dismissed) return;
    markAsRead(toastNotification.id);
    setToastNotification(null);
    navigate(`/notifications?id=${toastNotification.id}`);
  };

  const handleDismiss = (e) => {
    e?.stopPropagation();
    setDismissed(true);
    setToastNotification(null);
  };

  const handleDragEnd = (event, info) => {
    if (isMobile && info.offset.y > 50) {
      // Swiped down enough to dismiss
      handleDismiss();
    }
  };

  // Mobile: Bottom slide-in
  if (isMobile) {
    return (
      <AnimatePresence>
        {toastNotification && !dismissed && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-3 pointer-events-none"
            style={{ 
              y, 
              opacity,
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
              paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
              paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))'
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`${getPriorityColor(toastNotification.priority)} border-2 rounded-t-2xl rounded-b-lg shadow-2xl p-3 sm:p-4 cursor-pointer active:scale-[0.98] transition-transform pointer-events-auto touch-manipulation`}
              onClick={handleClick}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {getNotificationIcon(toastNotification.type)}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-1 break-words">
                      {toastNotification.title}
                    </h4>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-400 active:text-gray-600 transition-colors flex-shrink-0 p-1 -mr-1 -mt-1 touch-manipulation"
                      aria-label="Dismiss"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed break-words line-clamp-2">
                    {toastNotification.message}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <p className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                      Tap to view
                    </p>
                    <div className="w-8 sm:w-12 h-1 bg-gray-300 rounded-full flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: Top-right corner
  return (
    <AnimatePresence>
      {toastNotification && !dismissed && (
        <motion.div
          initial={{ opacity: 0, x: 400, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 400, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full sm:max-w-sm pointer-events-none"
        >
          <div
            className={`${getPriorityColor(toastNotification.priority)} border-2 rounded-lg shadow-2xl p-4 cursor-pointer hover:shadow-3xl hover:scale-[1.02] transition-all pointer-events-auto`}
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
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 -mr-1 -mt-1"
                    aria-label="Dismiss"
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

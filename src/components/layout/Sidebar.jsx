import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Settings,
  Video,
  X 
} from 'lucide-react';
import Avatar from '../common/Avatar';
import userData from '../../data/user.json';

/**
 * Sidebar navigation component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether sidebar is open (mobile)
 * @param {Function} props.onClose - Close handler for mobile
 */
export default function Sidebar({ isOpen = true, onClose }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/live-streaming', label: 'Live Streaming', icon: Video },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col"
        initial={false}
        animate={{ 
          // On desktop, always show (x: 0)
          // On mobile, animate based on isOpen state
          x: isDesktop ? 0 : (isOpen ? 0 : -256),
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-600">Baby Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">AI-Powered Care</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={onClose}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar src={userData.avatarUrl} alt={userData.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{userData.role}</p>
            </div>
          </div>
        </div>

        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.aside>
    </>
  );
}


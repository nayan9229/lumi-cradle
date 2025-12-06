import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Header component with search and notifications
 * @param {Object} props
 * @param {Function} props.onMenuClick - Handler for mobile menu toggle
 */
export default function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const notificationCount = 3; // Static for now

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

          {/* Notifications */}
          <div className="relative">
            <button
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
          </div>
        </div>
      </div>
    </header>
  );
}


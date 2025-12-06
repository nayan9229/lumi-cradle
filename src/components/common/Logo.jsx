import { motion } from 'framer-motion';
import { Baby, Sparkles } from 'lucide-react';

/**
 * LullabAI Logo Component
 * Displays the application logo with icon and text
 * @param {Object} props
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} props.showIcon - Whether to show the icon (default: true)
 * @param {string} props.className - Additional CSS classes
 */
export default function Logo({ size = 'md', showIcon = true, className = '' }) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-xl',
      sparkle: 'w-3 h-3',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-2xl',
      sparkle: 'w-4 h-4',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-4xl',
      sparkle: 'w-6 h-6',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {showIcon && (
        <div className="relative">
          {/* Main Baby Icon */}
          <div className={`${sizeConfig.icon} bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg`}>
            <Baby className="w-1/2 h-1/2 text-white" strokeWidth={2.5} />
          </div>
          
          {/* Sparkle decoration */}
          <motion.div
            className={`absolute -top-1 -right-1 ${sizeConfig.sparkle} text-yellow-400`}
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-full h-full" fill="currentColor" />
          </motion.div>
        </div>
      )}
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`${sizeConfig.text} font-bold`}>
          <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Lullab
          </span>
          <span className="text-primary-600">AI</span>
        </span>
        {size === 'lg' && (
          <span className="text-xs text-gray-500 font-medium">AI-Powered Baby Care</span>
        )}
      </div>
    </motion.div>
  );
}


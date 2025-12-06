import { motion } from 'framer-motion';

/**
 * Button component with tap feedback
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Style variant: 'primary', 'secondary', 'outline'
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  };

  return (
    <motion.button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}


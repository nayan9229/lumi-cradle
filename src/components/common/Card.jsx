import { motion } from 'framer-motion';

/**
 * Reusable Card component with hover animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover scale effect (default: true)
 */
export default function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm p-6 ${className}`}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}


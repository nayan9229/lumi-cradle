/**
 * Tag component for categorizing items
 * @param {Object} props
 * @param {string} props.children - Tag text
 * @param {string} props.color - Color: 'pink', 'yellow', 'teal', 'blue'
 * @param {string} props.className - Additional CSS classes
 */
export default function Tag({ children, color = 'blue', className = '' }) {
  const colors = {
    pink: 'bg-pastel-pink text-pink-800',
    yellow: 'bg-pastel-yellow text-yellow-800',
    teal: 'bg-pastel-teal text-teal-800',
    blue: 'bg-pastel-blue text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}


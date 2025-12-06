/**
 * Avatar component for user profile images
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text
 * @param {string} props.size - Size: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} props.className - Additional CSS classes
 */
export default function Avatar({ src, alt = 'Avatar', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}


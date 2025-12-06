import { motion } from 'framer-motion';
import Card from '../common/Card';

/**
 * Metric card component for displaying key statistics
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main metric value
 * @param {string} props.subtitle - Optional subtitle or description
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {string} props.color - Accent color: 'blue', 'pink', 'yellow', 'teal'
 */
export default function MetricCard({ title, value, subtitle, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-pastel-blue text-blue-600',
    pink: 'bg-pastel-pink text-pink-600',
    yellow: 'bg-pastel-yellow text-yellow-600',
    teal: 'bg-pastel-teal text-teal-600',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}


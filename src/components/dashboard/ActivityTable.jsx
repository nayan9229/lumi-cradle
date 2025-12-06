import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Activity table component for displaying recent events
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {Array} props.data - Array of activity items
 * @param {number} props.limit - Maximum number of items to display (default: 5)
 */
export default function ActivityTable({ title, data = [], limit = 5 }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          No recent activity
        </div>
      </Card>
    );
  }

  const displayData = data.slice(0, limit);

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Determine badge variant based on classification/type
  const getBadgeVariant = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('hunger') || typeLower.includes('feed')) return 'warning';
    if (typeLower.includes('distress') || typeLower.includes('alert')) return 'danger';
    if (typeLower.includes('sleep') || typeLower.includes('sleepy')) return 'info';
    if (typeLower.includes('discomfort') || typeLower.includes('diaper')) return 'warning';
    return 'primary';
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Details</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, index) => (
              <motion.tr
                key={item.id || index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {item.classification || item.type || 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {item.aiLabel || item.details || item.suggestedAction || '-'}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={getBadgeVariant(item.classification || item.type)}>
                    {item.status || 'Active'}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


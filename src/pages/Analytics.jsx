import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import analyticsData from '../data/analytics.json';

/**
 * Analytics page with comprehensive data visualization
 * Displays cry patterns, sleep trends, health metrics, and activity frequency
 */
export default function Analytics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Color palette for charts
  const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Comprehensive insights and trends for your baby's monitoring data.
        </p>
      </motion.div>

      {/* Weekly Summary Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        <Card>
          <p className="text-xs text-gray-500 mb-1">Total Cry Events</p>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.weeklySummary.totalCryEvents}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Avg Cry Duration</p>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.weeklySummary.avgCryDuration}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Total Sleep</p>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.weeklySummary.totalSleepHours}h</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Sleep Quality</p>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.weeklySummary.avgSleepQuality}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Routine Score</p>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.weeklySummary.routineConsistency}%</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Health Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.weeklySummary.healthAlerts}</p>
        </Card>
      </motion.div>

      {/* Cry Patterns by Hour */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cry Patterns by Hour of Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.cryPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cry Classification Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cry Classification Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.cryClassificationDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.cryClassificationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {analyticsData.cryClassificationDistribution.map((item, index) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Activity Frequency */}
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Frequency (This Week)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.activityFrequency} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="activity" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Sleep Trends */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Trends (7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.sleepTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalSleep" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  name="Total Sleep (hrs)"
                  dot={{ fill: '#6366F1', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="deepSleep" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Deep Sleep (hrs)"
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Quality Score"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Health Metrics Trend */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.healthMetricsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#EC4899" 
                  strokeWidth={2}
                  name="Temperature (°F)"
                  dot={{ fill: '#EC4899', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Insights Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Peak Cry Hours:</span> Most cry events occur between 7-8 AM and 11 AM-12 PM, 
                typically associated with hunger patterns.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Sleep Improvement:</span> Sleep quality has improved by 10% over the past week, 
                with deeper sleep sessions increasing.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Activity Pattern:</span> Feeding and diaper changes are the most frequent activities, 
                averaging 4-5 times per day respectively.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

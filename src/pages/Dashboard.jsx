import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  Clock, 
  Moon, 
  TrendingUp,
  Activity,
  Video,
  Mic,
  Bell,
  Volume2,
  Thermometer,
  Home
} from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import LineChartCard from '../components/dashboard/LineChartCard';
import ActivityTable from '../components/dashboard/ActivityTable';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Tag from '../components/common/Tag';
import Button from '../components/common/Button';

// Import JSON data
import userData from '../data/user.json';
import summaryMetrics from '../data/summaryMetrics.json';
import cryEvents from '../data/cryEvents.json';
import sleepData from '../data/sleepData.json';
import healthMetrics from '../data/healthMetrics.json';
import milestones from '../data/milestones.json';
import logbook from '../data/logbook.json';
import monitorStatus from '../data/monitorStatus.json';

/**
 * Main Dashboard page component
 * Displays comprehensive overview of baby monitoring system with:
 * - Key metrics cards
 * - Growth chart
 * - Recent activity table
 * - AI cry detection insights
 * - Sleep coaching data
 * - Health metrics
 * - Milestones
 * - Monitor status widgets
 */
export default function Dashboard() {
  // Combine recent activities from multiple sources for the activity table
  const recentActivities = [
    ...cryEvents.slice(0, 2).map(event => ({
      id: `cry-${event.id}`,
      timestamp: event.timestamp,
      classification: event.classification,
      aiLabel: event.aiLabel,
      suggestedAction: event.suggestedAction,
      status: 'Active',
    })),
    ...logbook.slice(0, 3).map(entry => ({
      id: `log-${entry.id}`,
      timestamp: entry.timestamp,
      type: entry.type,
      details: `${entry.details} (${entry.user})`,
      status: 'Completed',
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Get latest sleep data
  const latestSleep = sleepData[0] || {};
  const latestHealthAlert = healthMetrics.find(m => m.alert) || null;
  const latestMilestone = milestones[0] || null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userData.name} 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your baby monitor today.
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <MetricCard
          title="Active Alerts Today"
          value={summaryMetrics.activeAlertsToday}
          subtitle="Requires attention"
          icon={<AlertCircle className="w-6 h-6" />}
          color="pink"
        />
        <MetricCard
          title="Average Cry Duration"
          value={summaryMetrics.averageCryDuration}
          subtitle="Last 24 hours"
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
        <MetricCard
          title="Sleep Quality Score"
          value={summaryMetrics.sleepQualityScore}
          subtitle="Out of 100"
          icon={<Moon className="w-6 h-6" />}
          color="teal"
        />
        <MetricCard
          title="Routine Consistency"
          value={`${summaryMetrics.routineConsistencyScore}%`}
          subtitle="This week"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
      </motion.div>

      {/* Charts and Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Growth Chart - Takes 2 columns on large screens */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <LineChartCard
            title="Monthly Active Sessions"
            data={summaryMetrics.monthlyUserGrowth}
            dataKey="value"
          />
        </motion.div>

        {/* Monitor Status Widget */}
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitor Status</h3>
            <div className="space-y-4">
              {/* Live Streaming */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Live Stream</span>
                </div>
                <Badge variant={monitorStatus.liveStreaming.status === 'online' ? 'success' : 'danger'}>
                  {monitorStatus.liveStreaming.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>

              {/* Audio Monitoring */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Audio Monitoring</span>
                </div>
                <Badge variant={monitorStatus.audioMonitoring.status === 'active' ? 'success' : 'danger'}>
                  {monitorStatus.audioMonitoring.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Instant Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Instant Alerts</span>
                </div>
                <Badge variant={monitorStatus.instantAlerts.status === 'enabled' ? 'success' : 'warning'}>
                  {monitorStatus.instantAlerts.status === 'enabled' ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {/* Two-Way Audio */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Two-Way Audio</span>
                </div>
                <Badge variant={monitorStatus.twoWayAudio.status === 'enabled' ? 'success' : 'warning'}>
                  {monitorStatus.twoWayAudio.status === 'enabled' ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {/* Environmental Sensors */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Environment</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Temp: {monitorStatus.environmentalSensors.roomTemperature}°{monitorStatus.environmentalSensors.unit}</div>
                  <div>Humidity: {monitorStatus.environmentalSensors.humidity}%</div>
                </div>
              </div>

              {/* Smart Home Integration */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Smart Home</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(monitorStatus.smartHomeIntegration).map(([key, value]) => (
                    value === 'linked' && (
                      <Tag key={key} color="blue">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Tag>
                    )
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AI Cry Detection Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI-Driven Cry & Distress Translator</h3>
            <Badge variant="info">AI-Powered</Badge>
          </div>
          <div className="space-y-4">
            {cryEvents.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag color={event.classification === 'Hunger' ? 'yellow' : event.classification === 'Distress' ? 'pink' : 'teal'}>
                        {event.classification}
                      </Tag>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">{event.aiLabel}</p>
                    <p className="text-xs text-gray-600">
                      Duration: {event.duration} • Confidence: {event.confidence}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Suggested action:</span> {event.suggestedAction}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Sleep Coaching & Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sleep Coaching */}
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Coaching Insights</h3>
            {latestSleep.qualityScore && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Sleep Quality Score</span>
                    <span className="text-2xl font-bold text-primary-600">{latestSleep.qualityScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${latestSleep.qualityScore}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Sleep</p>
                    <p className="text-lg font-semibold text-gray-900">{latestSleep.totalSleep}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Deep Sleep</p>
                    <p className="text-lg font-semibold text-gray-900">{latestSleep.deepSleep}</p>
                  </div>
                </div>
                {latestSleep.routineChanges && latestSleep.routineChanges.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Routine Suggestions:</p>
                    {latestSleep.routineChanges.map((change, idx) => (
                      <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">{change.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Health Anomaly Detection */}
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Monitoring</h3>
            {latestHealthAlert ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Recent Alert</span>
                  </div>
                  <p className="text-sm text-yellow-700">{latestHealthAlert.alert}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {new Date(latestHealthAlert.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {healthMetrics.slice(0, 2).map((metric) => (
                    <div key={metric.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">{metric.type}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {metric.value ? `${metric.value}°F` : 'N/A'}
                      </p>
                      <Badge variant={metric.status === 'normal' ? 'success' : 'warning'} className="mt-1">
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">All health metrics normal</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Milestones Section */}
      {latestMilestone && (
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Milestones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.slice(0, 3).map((milestone) => (
                <motion.div
                  key={milestone.id}
                  className="p-4 bg-gradient-to-br from-pastel-blue to-pastel-teal rounded-lg border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Tag color="blue">{milestone.category}</Tag>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(milestone.timestamp).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity Table */}
      <motion.div variants={itemVariants}>
        <ActivityTable
          title="Recent Activity"
          data={recentActivities}
          limit={8}
        />
      </motion.div>
    </motion.div>
  );
}


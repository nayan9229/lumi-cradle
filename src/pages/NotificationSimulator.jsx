import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertCircle, 
  Heart, 
  Baby, 
  Moon, 
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Info,
  Send,
  Zap,
  Settings,
  Copy,
  QrCode,
  Smartphone,
  Check
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { notificationService } from '../services/notificationService';

/**
 * Notification Simulator Page
 * Hidden page for demo purposes to simulate real-time notifications
 * Opens in separate tab and broadcasts notifications to main app
 */
export default function NotificationSimulator() {
  const [selectedType, setSelectedType] = useState('cry');
  const [selectedPriority, setSelectedPriority] = useState('high');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [lastSent, setLastSent] = useState(null);
  const [sentCount, setSentCount] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [pairingUrl, setPairingUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [manualSessionId, setManualSessionId] = useState('');

  // Initialize session
  useEffect(() => {
    const currentSession = notificationService.getCurrentSessionId();
    setSessionId(currentSession);
    setPairingUrl(notificationService.getPairingUrl());
  }, []);

  // Copy pairing URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pairingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Set manual session ID
  const handleSetSession = () => {
    if (manualSessionId.trim()) {
      notificationService.setSessionId(manualSessionId.trim());
      setSessionId(manualSessionId.trim());
      setPairingUrl(notificationService.getPairingUrl());
      setManualSessionId('');
    }
  };

  // Predefined notification templates
  const notificationTemplates = {
    cry: {
      title: 'Cry Event Detected',
      message: 'Hunger cry detected - Time since last feed: 3 hours',
      type: 'cry',
      priority: 'high',
      details: {
        duration: '3 minutes',
        classification: 'Hunger',
        confidence: 92,
        aiLabel: 'Hunger Signature: Time since last feed: 3 hours.',
        suggestedAction: 'Offer feed immediately',
        location: 'Nursery',
        audioLevel: 'High'
      }
    },
    health: {
      title: 'Health Alert',
      message: 'Temperature spike detected: 99.2°F',
      type: 'health',
      priority: 'high',
      details: {
        temperature: 99.2,
        unit: '°F',
        status: 'elevated',
        previousReading: 98.6,
        recommendation: 'Monitor closely. If temperature continues to rise, consider consulting pediatrician.',
        location: 'Nursery',
        sensorId: 'TEMP-001'
      }
    },
    milestone: {
      title: 'New Milestone',
      message: 'Baby rolled over for the first time!',
      type: 'milestone',
      priority: 'medium',
      details: {
        category: 'Physical Development',
        description: 'Baby successfully rolled from back to tummy for the first time. This is a significant motor skill development milestone.',
        age: '4 months',
        videoUrl: '/videos/milestone-rollover.mp4',
        thumbnailUrl: '/images/milestone-rollover.jpg'
      }
    },
    sleep: {
      title: 'Sleep Pattern Update',
      message: 'Sleep quality improved by 15 minutes',
      type: 'sleep',
      priority: 'low',
      details: {
        totalSleep: '14.5 hours',
        deepSleep: '8.2 hours',
        qualityScore: 85,
        improvement: '+15 minutes',
        routineChange: 'Moving bath time 30 minutes earlier improved deep sleep by 15 minutes.',
        impact: 'positive'
      }
    },
    feed: {
      title: 'Feeding Reminder',
      message: 'Time for next feeding - Last feed was 2.5 hours ago',
      type: 'feed',
      priority: 'low',
      details: {
        lastFeedTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        lastFeedAmount: '6 oz',
        feedingType: 'Formula',
        averageInterval: '3 hours',
        recommendation: 'Prepare 6 oz formula. Baby typically feeds well at this time.'
      }
    },
    success: {
      title: 'Action Completed',
      message: 'Notification system is working perfectly!',
      type: 'success',
      priority: 'low',
      details: {
        action: 'System Test',
        status: 'Success',
        timestamp: new Date().toISOString()
      }
    },
    warning: {
      title: 'Attention Required',
      message: 'Monitor connection quality is below optimal',
      type: 'warning',
      priority: 'medium',
      details: {
        issue: 'Connection Quality',
        severity: 'Moderate',
        recommendation: 'Check network connection and device proximity.'
      }
    },
    info: {
      title: 'System Update',
      message: 'New features available in your dashboard',
      type: 'info',
      priority: 'low',
      details: {
        updateType: 'Feature Release',
        version: '2.1.0',
        features: ['Enhanced notifications', 'Improved analytics']
      }
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'cry':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'health':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'milestone':
        return <Baby className="w-5 h-5 text-blue-500" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'feed':
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Send notification
  const sendNotification = () => {
    const template = notificationTemplates[selectedType];
    const notification = {
      ...template,
      priority: selectedPriority,
      title: customTitle || template.title,
      message: customMessage || template.message,
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Broadcast to all tabs
    notificationService.broadcastNotification(notification);
    
    setLastSent(notification);
    setSentCount(prev => prev + 1);
    
    // Reset custom fields after a delay
    setTimeout(() => {
      setCustomTitle('');
      setCustomMessage('');
    }, 2000);
  };

  // Quick send with template
  const quickSend = (type) => {
    setSelectedType(type);
    const template = notificationTemplates[type];
    const notification = {
      ...template,
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    notificationService.broadcastNotification(notification);
    setLastSent(notification);
    setSentCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Notification Simulator</h1>
              <p className="text-gray-400">Demo tool for real-time notification testing</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="info" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              <Bell className="w-4 h-4 mr-1" />
              {sentCount} notifications sent
            </Badge>
            {lastSent && (
              <Badge variant="success" className="bg-green-500/20 text-green-300 border-green-500/50">
                Last sent: {lastSent.title}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Device Pairing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Cross-Device Pairing</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Session ID
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm font-mono break-all">
                    {sessionId}
                  </code>
                  <button
                    onClick={handleCopyUrl}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pairing URL (Open this on mobile device)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pairingUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm"
                  />
                  <div className="p-2 bg-gray-700/50 border border-gray-600 rounded-lg">
                    <QrCode className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Open this URL on your mobile device to receive notifications in real-time
                </p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Manual Session ID Entry
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={manualSessionId}
                    onChange={(e) => setManualSessionId(e.target.value)}
                    placeholder="Enter session ID from mobile device"
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSetSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Connect
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Use this if you want to use a session ID from another device
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(notificationTemplates).map(([type, template]) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => quickSend(type)}
                    className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getNotificationIcon(type)}
                      <span className="text-sm font-medium text-white capitalize">{type}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{template.message}</p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Custom Notification Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Custom Notification</h2>
              </div>
              <div className="space-y-4">
                {/* Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(notificationTemplates).map(type => (
                      <option key={type} value={type} className="bg-gray-800">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high" className="bg-gray-800">High</option>
                    <option value="medium" className="bg-gray-800">Medium</option>
                    <option value="low" className="bg-gray-800">Low</option>
                  </select>
                </div>

                {/* Custom Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={notificationTemplates[selectedType].title}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={notificationTemplates[selectedType].message}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Send Button */}
                <Button
                  onClick={sendNotification}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Notification
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="font-semibold text-white mb-2">Same-Device (Multiple Tabs):</p>
              <p>1. Open your main app in another browser tab on the same device</p>
              <p>2. Click any quick action button or create a custom notification</p>
              <p>3. The notification will appear in real-time in the main app tab</p>
              
              <p className="font-semibold text-white mt-4 mb-2">Cross-Device (Desktop → Mobile):</p>
              <p>1. Copy the pairing URL above</p>
              <p>2. Open the URL on your mobile device (or scan QR code if implemented)</p>
              <p>3. Both devices are now paired with the same session ID</p>
              <p>4. Send notifications from this simulator - they'll appear on mobile instantly</p>
              <p>5. On mobile, tap the notification to view details</p>
              
              <p className="mt-4 text-yellow-400 font-medium">
                ⚠️ This page is for demo purposes only and should not be accessible to end users
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Last Sent Preview */}
        {lastSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Last Sent Notification</h3>
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(lastSent.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{lastSent.title}</h4>
                      <Badge variant={lastSent.priority === 'high' ? 'danger' : lastSent.priority === 'medium' ? 'warning' : 'info'}>
                        {lastSent.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{lastSent.message}</p>
                    <p className="text-xs text-gray-500">
                      Sent at: {new Date(lastSent.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}


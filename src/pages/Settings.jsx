import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Volume2, 
  Home, 
  Shield, 
  Monitor, 
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import settingsData from '../data/settings.json';

/**
 * Settings page with comprehensive configuration options
 * Includes user profile, monitor settings, alerts, audio, smart home, and privacy
 */
export default function Settings() {
  const [settings, setSettings] = useState(settingsData);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSave = () => {
    // Simulate save functionality
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (section, key, nestedKey = null) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      if (nestedKey) {
        newSettings[section][nestedKey][key] = !newSettings[section][nestedKey][key];
      } else {
        newSettings[section][key] = !newSettings[section][key];
      }
      return newSettings;
    });
  };

  const handleSliderChange = (section, key, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      if (section === 'audioSettings' && key === 'soothingSounds') {
        newSettings[section][key].volume = value;
      } else {
        newSettings[section][key] = value;
      }
      return newSettings;
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'monitor', label: 'Monitor', icon: Monitor },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'smarthome', label: 'Smart Home', icon: Home },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your account, monitor, and notification preferences.
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
            disabled={saved}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Profile</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={settings.userProfile.name}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      userProfile: { ...prev.userProfile, name: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.userProfile.email}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      userProfile: { ...prev.userProfile, email: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.userProfile.phone}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      userProfile: { ...prev.userProfile, phone: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Preferences
                </label>
                <div className="space-y-3">
                  {Object.entries(settings.userProfile.notificationPreferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">{key}</span>
                      <button
                        onClick={() => handleToggle('userProfile', key, 'notificationPreferences')}
                        className="text-primary-600"
                      >
                        {value ? (
                          <ToggleRight className="w-8 h-8" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Monitor Settings */}
      {activeTab === 'monitor' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monitor Configuration</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio Sensitivity: {settings.monitorSettings.audioSensitivity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.monitorSettings.audioSensitivity}
                  onChange={(e) => handleSliderChange('monitorSettings', 'audioSensitivity', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                {Object.entries(settings.monitorSettings)
                  .filter(([key]) => typeof settings.monitorSettings[key] === 'boolean')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => handleToggle('monitorSettings', key)}
                        className="text-primary-600"
                      >
                        {value ? (
                          <ToggleRight className="w-8 h-8" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature Alert Threshold: {settings.monitorSettings.temperatureAlertThreshold}°F
                </label>
                <input
                  type="range"
                  min="98"
                  max="102"
                  step="0.1"
                  value={settings.monitorSettings.temperatureAlertThreshold}
                  onChange={(e) => handleSliderChange('monitorSettings', 'temperatureAlertThreshold', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Alert Settings */}
      {activeTab === 'alerts' && (
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Alert Preferences</h3>
            <div className="space-y-6">
              {Object.entries(settings.alertSettings).map(([category, config]) => (
                <div key={category} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()} Alerts
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(config).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {typeof value === 'boolean' ? (
                          <button
                            onClick={() => handleToggle('alertSettings', key, category)}
                            className="text-primary-600"
                          >
                            {value ? (
                              <ToggleRight className="w-8 h-8" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-gray-400" />
                            )}
                          </button>
                        ) : (
                          <Badge variant="info">{value}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Audio Settings */}
      {activeTab === 'audio' && (
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Audio Configuration</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Two-Way Audio</span>
                <button
                  onClick={() => handleToggle('audioSettings', 'twoWayAudio')}
                  className="text-primary-600"
                >
                  {settings.audioSettings.twoWayAudio ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microphone Sensitivity: {settings.audioSettings.microphoneSensitivity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.audioSettings.microphoneSensitivity}
                  onChange={(e) => handleSliderChange('audioSettings', 'microphoneSensitivity', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker Volume: {settings.audioSettings.speakerVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audioSettings.speakerVolume}
                  onChange={(e) => handleSliderChange('audioSettings', 'speakerVolume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Soothing Sounds</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Enabled</span>
                    <button
                      onClick={() => handleToggle('audioSettings', 'enabled', 'soothingSounds')}
                      className="text-primary-600"
                    >
                      {settings.audioSettings.soothingSounds.enabled ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume: {settings.audioSettings.soothingSounds.volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.audioSettings.soothingSounds.volume}
                      onChange={(e) => handleSliderChange('audioSettings', 'soothingSounds', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Track</label>
                    <select
                      value={settings.audioSettings.soothingSounds.defaultTrack}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          audioSettings: {
                            ...prev.audioSettings,
                            soothingSounds: {
                              ...prev.audioSettings.soothingSounds,
                              defaultTrack: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>Ocean Waves</option>
                      <option>White Noise</option>
                      <option>Lullaby</option>
                      <option>Rain Sounds</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Smart Home Settings */}
      {activeTab === 'smarthome' && (
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Smart Home Integration</h3>
              <button
                onClick={() => handleToggle('smartHomeIntegration', 'enabled')}
                className="text-primary-600"
              >
                {settings.smartHomeIntegration.enabled ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
            {settings.smartHomeIntegration.enabled && (
              <div className="space-y-4">
                {settings.smartHomeIntegration.devices.map((device) => (
                  <div key={device.name} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{device.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{device.type}</p>
                      </div>
                      <Badge variant={device.connected ? 'success' : 'danger'}>
                        {device.connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto Mode</span>
                      <button
                        onClick={() => {
                          setSettings((prev) => ({
                            ...prev,
                            smartHomeIntegration: {
                              ...prev.smartHomeIntegration,
                              devices: prev.smartHomeIntegration.devices.map((d) =>
                                d.name === device.name ? { ...d, autoMode: !d.autoMode } : d
                              ),
                            },
                          }));
                        }}
                        className="text-primary-600"
                        disabled={!device.connected}
                      >
                        {device.autoMode ? (
                          <ToggleRight className="w-8 h-8" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy & Data</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Retention: {settings.privacySettings.dataRetention} days
                </label>
                <input
                  type="range"
                  min="30"
                  max="365"
                  step="30"
                  value={settings.privacySettings.dataRetention}
                  onChange={(e) => handleSliderChange('privacySettings', 'dataRetention', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                {Object.entries(settings.privacySettings)
                  .filter(([key]) => key !== 'dataRetention')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => handleToggle('privacySettings', key)}
                        className="text-primary-600"
                      >
                        {value ? (
                          <ToggleRight className="w-8 h-8" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={settings.displaySettings.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      displaySettings: { ...prev.displaySettings, theme: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.displaySettings.timezone}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      displaySettings: { ...prev.displaySettings, timezone: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

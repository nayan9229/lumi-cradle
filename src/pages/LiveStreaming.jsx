import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Play,
  Pause,
  Square,
  Camera,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Settings,
  Download,
  Trash2,
  Users,
  Radio,
  XCircle,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import streamingData from '../data/liveStreaming.json';

/**
 * Live Streaming page with video controls, recording, and camera settings
 */
export default function LiveStreaming() {
  const [streamStatus, setStreamStatus] = useState(streamingData.streamStatus);
  const [cameraSettings, setCameraSettings] = useState(streamingData.cameraSettings);
  const [recording, setRecording] = useState(streamingData.recording);
  const [audioControls, setAudioControls] = useState(streamingData.audioControls);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

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

  const toggleStream = () => {
    setStreamStatus((prev) => ({ ...prev, isLive: !prev.isLive }));
    setIsPlaying((prev) => !prev);
  };

  const toggleRecording = () => {
    setRecording((prev) => ({ ...prev, isRecording: !prev.isRecording }));
  };

  const toggleMute = () => {
    setAudioControls((prev) => ({ ...prev, mute: !prev.mute }));
  };

  const toggleMicrophone = () => {
    setAudioControls((prev) => ({ ...prev, microphoneEnabled: !prev.microphoneEnabled }));
  };

  const takeSnapshot = () => {
    alert('Snapshot captured! (This is a demo)');
  };

  const handleZoom = (direction) => {
    setCameraSettings((prev) => ({
      ...prev,
      zoom: direction === 'in' ? Math.min(prev.zoom + 0.1, 2.0) : Math.max(prev.zoom - 0.1, 1.0),
    }));
  };

  const formatStorage = (used, total) => {
    const usedNum = parseFloat(used);
    const totalNum = parseFloat(total);
    const percentage = ((usedNum / totalNum) * 100).toFixed(1);
    return { used: usedNum, total: totalNum, percentage };
  };

  const storage = formatStorage(
    recording.storageUsed.replace(' GB', ''),
    recording.storageTotal.replace(' GB', '')
  );

  return (
    <motion.div
      className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Live Streaming</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Monitor your baby in real-time with HD video streaming.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={streamStatus.isLive ? 'success' : 'danger'} className="flex items-center gap-1 text-xs sm:text-sm">
              {streamStatus.isLive ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Offline
                </>
              )}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Video Area */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            {/* Video Placeholder */}
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
              {streamStatus.isLive ? (
                <>
                  {/* Simulated video feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50" />
                  <div className="relative z-10 text-center px-4">
                    <Video className="w-12 h-12 sm:w-16 sm:h-16 text-white/50 mx-auto mb-2" />
                    <p className="text-white/70 text-xs sm:text-sm">Live Stream Active</p>
                    <p className="text-white/50 text-xs mt-1 break-words">
                      {streamStatus.quality} • {streamStatus.resolution} • {streamStatus.fps} FPS
                    </p>
                  </div>
                  
                  {/* Camera Controls Overlay */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleZoom('in')}
                      className="bg-white/90 hover:bg-white p-1.5 sm:p-2"
                    >
                      <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleZoom('out')}
                      className="bg-white/90 hover:bg-white p-1.5 sm:p-2"
                    >
                      <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(!showSettings)}
                      className="bg-white/90 hover:bg-white p-1.5 sm:p-2"
                    >
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>

                  {/* Night Vision Indicator */}
                  {cameraSettings.nightVision && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                      <Badge variant="info" className="flex items-center gap-1 text-xs">
                        <Moon className="w-3 h-3" />
                        <span className="hidden sm:inline">Night Vision</span>
                      </Badge>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {recording.isRecording && (
                    <motion.div
                      className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Badge variant="danger" className="flex items-center gap-1 text-xs">
                        <Square className="w-3 h-3" />
                        <span className="hidden sm:inline">Recording</span>
                      </Badge>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">Stream Offline</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={toggleStream}
                    variant={streamStatus.isLive ? 'secondary' : 'primary'}
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    {streamStatus.isLive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Start Stream</span>
                        <span className="sm:hidden">Start</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={toggleRecording}
                    variant={recording.isRecording ? 'danger' : 'outline'}
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2"
                    disabled={!streamStatus.isLive}
                  >
                    <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{recording.isRecording ? 'Stop Recording' : 'Record'}</span>
                    <span className="sm:hidden">{recording.isRecording ? 'Stop' : 'Record'}</span>
                  </Button>
                  <Button
                    onClick={takeSnapshot}
                    variant="outline"
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2"
                    disabled={!streamStatus.isLive}
                  >
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Snapshot</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    className="flex items-center justify-center p-2 sm:p-2.5"
                    disabled={!streamStatus.isLive}
                    title="Toggle Mute"
                  >
                    {audioControls.mute ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                  <Button
                    onClick={toggleMicrophone}
                    variant={audioControls.microphoneEnabled ? 'primary' : 'outline'}
                    className="flex items-center justify-center p-2 sm:p-2.5"
                    disabled={!streamStatus.isLive}
                    title="Toggle Microphone"
                  >
                    {audioControls.microphoneEnabled ? (
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Camera Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 sm:mt-4"
              >
                <Card>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Camera Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Brightness</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cameraSettings.brightness}
                        onChange={(e) =>
                          setCameraSettings((prev) => ({ ...prev, brightness: parseInt(e.target.value) }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Contrast</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cameraSettings.contrast}
                        onChange={(e) =>
                          setCameraSettings((prev) => ({ ...prev, contrast: parseInt(e.target.value) }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Zoom: {cameraSettings.zoom.toFixed(1)}x</label>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          onClick={() => handleZoom('out')}
                          className="flex-1 text-xs"
                        >
                          <ZoomOut className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleZoom('in')}
                          className="flex-1 text-xs"
                        >
                          <ZoomIn className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="nightVision"
                        checked={cameraSettings.nightVision}
                        onChange={(e) =>
                          setCameraSettings((prev) => ({ ...prev, nightVision: e.target.checked }))
                        }
                        className="rounded"
                      />
                      <label htmlFor="nightVision" className="text-sm text-gray-700">
                        Night Vision
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoFocus"
                        checked={cameraSettings.autoFocus}
                        onChange={(e) =>
                          setCameraSettings((prev) => ({ ...prev, autoFocus: e.target.checked }))
                        }
                        className="rounded"
                      />
                      <label htmlFor="autoFocus" className="text-sm text-gray-700">
                        Auto Focus
                      </label>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
          {/* Stream Status */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Stream Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quality</span>
                <span className="font-semibold text-gray-900">{streamStatus.quality}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Resolution</span>
                <span className="font-semibold text-gray-900">{streamStatus.resolution}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frame Rate</span>
                <span className="font-semibold text-gray-900">{streamStatus.fps} FPS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bitrate</span>
                <span className="font-semibold text-gray-900">{streamStatus.bitrate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Latency</span>
                <Badge variant="success">{streamStatus.latency}</Badge>
              </div>
            </div>
          </Card>

          {/* Active Viewers */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              Active Viewers
            </h3>
            <div className="space-y-3">
              {streamingData.viewers.map((viewer) => (
                <div
                  key={viewer.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{viewer.name}</p>
                    <p className="text-xs text-gray-500">{viewer.role}</p>
                  </div>
                  {viewer.connected ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      {viewer.connectionTime}
                    </Badge>
                  ) : (
                    <Badge variant="danger">
                      <XCircle className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Storage */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Storage</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Used</span>
                <span className="font-semibold text-gray-900">
                  {storage.used} GB / {storage.total} GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${storage.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{storage.percentage}% used</p>
            </div>
          </Card>

          {/* Recent Recordings */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Recordings</h3>
            <div className="space-y-2 sm:space-y-3">
              {recording.recentRecordings.map((rec) => (
                <div
                  key={rec.id}
                  className="p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-16 sm:w-24 sm:h-18 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                      <img
                        src={rec.thumbnail}
                        alt={`Recording ${rec.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs text-gray-500 truncate">
                          {new Date(rec.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-gray-900">{rec.duration}</p>
                        <p className="text-xs text-gray-500">{rec.size}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="outline" className="p-1.5 sm:p-1" title="Download">
                          <Download className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </Button>
                        <Button variant="outline" className="p-1.5 sm:p-1 text-red-600" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Snapshots */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Snapshots</h3>
            <div className="grid grid-cols-3 gap-2">
              {streamingData.snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                >
                  <img
                    src={snapshot.thumbnail}
                    alt={`Snapshot ${snapshot.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center hidden">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}


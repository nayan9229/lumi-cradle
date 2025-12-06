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
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Streaming</h1>
            <p className="text-gray-600">
              Monitor your baby in real-time with HD video streaming.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={streamStatus.isLive ? 'success' : 'danger'} className="flex items-center gap-1">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            {/* Video Placeholder */}
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
              {streamStatus.isLive ? (
                <>
                  {/* Simulated video feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50" />
                  <div className="relative z-10 text-center">
                    <Video className="w-16 h-16 text-white/50 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Live Stream Active</p>
                    <p className="text-white/50 text-xs mt-1">
                      {streamStatus.quality} • {streamStatus.resolution} • {streamStatus.fps} FPS
                    </p>
                  </div>
                  
                  {/* Camera Controls Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleZoom('in')}
                      className="bg-white/90 hover:bg-white"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleZoom('out')}
                      className="bg-white/90 hover:bg-white"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(!showSettings)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Night Vision Indicator */}
                  {cameraSettings.nightVision && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="info" className="flex items-center gap-1">
                        <Moon className="w-3 h-3" />
                        Night Vision
                      </Badge>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {recording.isRecording && (
                    <motion.div
                      className="absolute top-4 left-1/2 transform -translate-x-1/2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Badge variant="danger" className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        Recording
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
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleStream}
                    variant={streamStatus.isLive ? 'secondary' : 'primary'}
                    className="flex items-center gap-2"
                  >
                    {streamStatus.isLive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Stream
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={toggleRecording}
                    variant={recording.isRecording ? 'danger' : 'outline'}
                    className="flex items-center gap-2"
                    disabled={!streamStatus.isLive}
                  >
                    <Square className="w-4 h-4" />
                    {recording.isRecording ? 'Stop Recording' : 'Record'}
                  </Button>
                  <Button
                    onClick={takeSnapshot}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!streamStatus.isLive}
                  >
                    <Camera className="w-4 h-4" />
                    Snapshot
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!streamStatus.isLive}
                  >
                    {audioControls.mute ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={toggleMicrophone}
                    variant={audioControls.microphoneEnabled ? 'primary' : 'outline'}
                    className="flex items-center gap-2"
                    disabled={!streamStatus.isLive}
                  >
                    {audioControls.microphoneEnabled ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
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
                className="mt-4"
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Settings</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Stream Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Status</h3>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage</h3>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recordings</h3>
            <div className="space-y-3">
              {recording.recentRecordings.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">
                        {new Date(rec.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-gray-900">{rec.duration}</p>
                      <p className="text-xs text-gray-500">{rec.size}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" className="p-1" title="Download">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" className="p-1 text-red-600" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Snapshots */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Snapshots</h3>
            <div className="grid grid-cols-3 gap-2">
              {streamingData.snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}


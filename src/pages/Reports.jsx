import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, TrendingUp, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import reportsData from '../data/reports.json';

/**
 * Reports page with daily, weekly, and monthly summaries
 * Includes export functionality and detailed insights
 */
export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

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

  const handleExport = (type) => {
    // Simulate export functionality
    alert(`Exporting ${type} report... (This is a demo - no actual file will be downloaded)`);
  };

  const getCurrentReport = () => {
    switch (selectedPeriod) {
      case 'daily':
        return reportsData.dailyReports[0];
      case 'weekly':
        return reportsData.weeklyReport;
      case 'monthly':
        return reportsData.monthlyReport;
      default:
        return reportsData.dailyReports[0];
    }
  };

  const currentReport = getCurrentReport();

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">
              View and export detailed reports of your baby's monitoring data.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport(selectedPeriod)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Period Selector */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                selectedPeriod === period
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Report Summary Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
      >
        {Object.entries(currentReport.summary).map(([key, value]) => (
          <Card key={key} hover={false}>
            <p className="text-xs text-gray-500 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </Card>
        ))}
      </motion.div>

      {/* Daily Reports List */}
      {selectedPeriod === 'daily' && (
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Reports</h3>
              <Button
                variant="outline"
                onClick={() => handleExport('all-daily')}
                className="flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
            <div className="space-y-4">
              {reportsData.dailyReports.map((report, index) => (
                <motion.div
                  key={report.date}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">
                          {new Date(report.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Cry Events:</span>
                          <span className="ml-2 font-semibold text-gray-900">{report.summary.cryEvents}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sleep Hours:</span>
                          <span className="ml-2 font-semibold text-gray-900">{report.summary.sleepHours}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sleep Quality:</span>
                          <span className="ml-2 font-semibold text-gray-900">{report.summary.sleepQuality}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Feeds:</span>
                          <span className="ml-2 font-semibold text-gray-900">{report.summary.feeds}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleExport(`daily-${report.date}`)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                  {report.highlights && report.highlights.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Highlights:</p>
                      <ul className="space-y-1">
                        {report.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.recommendations && report.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {report.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Weekly/Monthly Report Details */}
      {(selectedPeriod === 'weekly' || selectedPeriod === 'monthly') && (
        <>
          {/* Trends */}
          {currentReport.trends && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  Trends
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(currentReport.trends).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            value === 'improving' || value === 'excellent'
                              ? 'success'
                              : value === 'stable'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {value}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Insights */}
          {currentReport.insights && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Key Insights
                </h3>
                <div className="space-y-3">
                  {currentReport.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className="text-sm text-blue-800">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Top Insights for Monthly */}
          {currentReport.topInsights && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Insights</h3>
                <div className="space-y-3">
                  {currentReport.topInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className="text-sm text-gray-800 font-medium">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Export Options */}
      <motion.div variants={itemVariants}>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleExport('pdf')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-semibold text-gray-900">Export as PDF</p>
              <p className="text-xs text-gray-500 mt-1">Download report as PDF document</p>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-semibold text-gray-900">Export as CSV</p>
              <p className="text-xs text-gray-500 mt-1">Download data as CSV file</p>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-semibold text-gray-900">Export as JSON</p>
              <p className="text-xs text-gray-500 mt-1">Download raw data as JSON</p>
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

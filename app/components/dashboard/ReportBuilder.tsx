'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

interface ReportConfig {
  type: 'analytics' | 'projects' | 'team' | 'financial' | 'custom';
  title: string;
  description?: string;
  date_range: {
    start: string;
    end: string;
  };
  metrics: string[];
  filters?: Record<string, unknown>;
  format: 'json' | 'csv' | 'pdf';
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ReportBuilderProps {
  userId: string;
  onReportGenerated?: (report: ReportData | { format: 'csv', title: string }) => void;
}

interface ReportData {
  summary: {
    key_metrics: Record<string, number | string>;
  };
  data: Record<string, number | string>[];
}

export default function ReportBuilder({ userId, onReportGenerated }: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'analytics',
    title: '',
    description: '',
    date_range: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
      end: new Date().toISOString().split('T')[0] || ''
    },
    metrics: [],
    filters: {},
    format: 'json',
    groupBy: '',
    sortBy: '',
    sortOrder: 'desc'
  });

  const [availableMetrics, setAvailableMetrics] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ReportData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Define available metrics for each report type
  const metricsOptions = {
    analytics: [
      'page_views',
      'unique_visitors',
      'bounce_rate',
      'avg_session_duration',
      'conversion_rate',
      'traffic_sources',
      'top_pages',
      'user_demographics'
    ],
    projects: [
      'total_projects',
      'active_projects',
      'completed_projects',
      'project_status_distribution',
      'budget_utilization',
      'timeline_adherence',
      'team_productivity',
      'milestone_completion'
    ],
    team: [
      'team_size',
      'task_completion_rate',
      'productivity_score',
      'collaboration_metrics',
      'skill_distribution',
      'workload_balance',
      'performance_ratings',
      'training_progress'
    ],
    financial: [
      'revenue',
      'expenses',
      'profit_margin',
      'cash_flow',
      'budget_variance',
      'cost_per_acquisition',
      'lifetime_value',
      'roi_metrics'
    ],
    custom: [
      'custom_metric_1',
      'custom_metric_2',
      'custom_metric_3',
      'custom_kpi',
      'business_goal_progress',
      'user_defined_metric'
    ]
  };

  useEffect(() => {
    setAvailableMetrics(metricsOptions);
  }, []);

  const handleConfigChange = <T extends keyof ReportConfig>(field: T, value: ReportConfig[T]) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset metrics when report type changes
    if (field === 'type') {
      setConfig(prev => ({
        ...prev,
        metrics: []
      }));
    }
  };

  const handleMetricToggle = (metric: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setConfig(prev => ({
      ...prev,
      date_range: {
        ...prev.date_range,
        [field]: value
      }
    }));
  };

  const validateConfig = (): string | null => {
    if (!config.title.trim()) {
      return 'Report title is required';
    }

    if (config.metrics.length === 0) {
      return 'At least one metric must be selected';
    }

    const startDate = new Date(config.date_range.start);
    const endDate = new Date(config.date_range.end);

    if (startDate >= endDate) {
      return 'Start date must be before end date';
    }

    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 365) {
      return 'Date range cannot exceed 365 days';
    }

    return null;
  };

  const handlePreview = async () => {
    const validationError = validateConfig();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      // Generate a preview with limited data
      const previewConfig = {
        ...config,
        date_range: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      };

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewConfig),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate preview');
      }

      setPreviewData(result.data);
      setShowPreview(true);

      await logActivity({
        action: 'report_preview_generated',
        description: `Generated preview for ${config.type} report: ${config.title}`,
        metadata: { 
          report_type: config.type,
          metrics_count: config.metrics.length
        }
      });

    } catch (err) {
      console.error('Error generating preview:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    const validationError = validateConfig();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (config.format === 'csv') {
        // Handle CSV download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        await logActivity({
          action: 'report_downloaded',
          description: `Downloaded ${config.type} report as CSV: ${config.title}`,
          metadata: { 
            report_type: config.type,
            format: 'csv',
            metrics_count: config.metrics.length
          }
        });

        if (onReportGenerated) {
          onReportGenerated({ format: 'csv', title: config.title });
        }
      } else {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to generate report');
        }

        await logActivity({
          action: 'report_generated',
          description: `Generated ${config.type} report: ${config.title}`,
          metadata: { 
            report_type: config.type,
            format: config.format,
            metrics_count: config.metrics.length,
            records_count: result.data?.data?.length || 0
          }
        });

        if (onReportGenerated) {
          onReportGenerated(result.data);
        }
      }

    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const getQuickDateRange = (days: number): { start: string; end: string } => {
    const end = new Date().toISOString().split('T')[0] || '';
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '';
    return { start, end };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="report-builder-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Builder</h3>
        <p className="text-gray-600">Create custom reports with the metrics and date ranges you need.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" id="report-builder-error">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6" id="report-config-panel">
          {/* Basic Info */}
          <div id="report-basic-info">
            <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter report title"
                  id="report-title-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => handleConfigChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter report description"
                  rows={3}
                  id="report-description-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type *
                </label>
                <select
                  value={config.type}
                  onChange={(e) => handleConfigChange('type', e.target.value as ReportConfig['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="report-type-select"
                >
                  <option value="analytics">Analytics</option>
                  <option value="projects">Projects</option>
                  <option value="team">Team Performance</option>
                  <option value="financial">Financial</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div id="report-date-range">
            <h4 className="font-medium text-gray-900 mb-3">Date Range</h4>
            
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleConfigChange('date_range', getQuickDateRange(7))}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  id="quick-range-7d"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => handleConfigChange('date_range', getQuickDateRange(30))}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  id="quick-range-30d"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => handleConfigChange('date_range', getQuickDateRange(90))}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  id="quick-range-90d"
                >
                  Last 90 days
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={config.date_range.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="start-date-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={config.date_range.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="end-date-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div id="report-format">
            <h4 className="font-medium text-gray-900 mb-3">Output Format</h4>
            
            <div className="flex gap-4">
              {['json', 'csv', 'pdf'].map((format) => (
                <label key={format} className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={config.format === format}
                    onChange={(e) => handleConfigChange('format', e.target.value as ReportConfig['format'])}
                    className="mr-2"
                    id={`format-${format}`}
                  />
                  <span className="text-sm text-gray-700">{format.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Selection */}
        <div id="report-metrics-panel">
          <h4 className="font-medium text-gray-900 mb-3">Select Metrics *</h4>
          
          {availableMetrics[config.type] && (
            <div className="space-y-2 max-h-64 overflow-y-auto" id="metrics-list">
              {availableMetrics[config.type]?.map((metric) => (
                <label key={metric} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={config.metrics.includes(metric)}
                    onChange={() => handleMetricToggle(metric)}
                    className="mr-3"
                    id={`metric-${metric}`}
                  />
                  <span className="text-sm text-gray-700">
                    {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            {config.metrics.length} metric{config.metrics.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4" id="report-actions">
        <button
          onClick={handlePreview}
          disabled={isGenerating || config.metrics.length === 0}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          id="preview-report-button"
        >
          {isGenerating ? 'Generating...' : 'Preview'}
        </button>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || config.metrics.length === 0 || !config.title.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          id="generate-report-button"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="preview-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Report Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
                id="close-preview-button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4" id="preview-content">
              <div>
                <h4 className="font-medium text-gray-900">Summary</h4>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(previewData.summary.key_metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-600">{key.replace(/_/g, ' ')}</div>
                      <div className="text-lg font-semibold">{typeof value === 'number' ? value.toLocaleString() : String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Sample Data ({previewData.data.length} records)</h4>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {previewData.data.length > 0 && Object.keys(previewData.data[0]!).map((key) => (
                          <th key={key} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.data.slice(0, 5).map((row: Record<string, number | string>, index: number) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value: string | number, cellIndex: number) => (
                            <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
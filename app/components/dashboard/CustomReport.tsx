'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

interface ReportData {
  id: string;
  title: string;
  type: string;
  data: any[];
  metadata: {
    generated_at: string;
    date_range: {
      start: string;
      end: string;
    };
    total_records: number;
    filters_applied: Record<string, any>;
  };
  summary: {
    key_metrics: Record<string, number>;
    trends: Record<string, number>;
    insights: string[];
  };
}

interface CustomReportProps {
  reportData: ReportData;
  userId: string;
  onExport?: (format: 'csv' | 'pdf') => void;
  onShare?: () => void;
  onSchedule?: () => void;
}

export default function CustomReport({ 
  reportData, 
  userId, 
  onExport, 
  onShare, 
  onSchedule 
}: CustomReportProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'insights'>('overview');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Log report view
    logActivity({
      action: 'custom_report_viewed',
      description: `Viewed custom report: ${reportData.title}`,
      metadata: {
        report_id: reportData.id,
        report_type: reportData.type,
        total_records: reportData.metadata.total_records
      }
    });
  }, [reportData, userId]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    await logActivity({
      action: 'report_export_requested',
      description: `Requested ${format.toUpperCase()} export for report: ${reportData.title}`,
      metadata: {
        report_id: reportData.id,
        export_format: format
      }
    });

    if (onExport) {
      onExport(format);
    }
  };

  const handleShare = async () => {
    await logActivity({
      action: 'report_share_requested',
      description: `Requested share for report: ${reportData.title}`,
      metadata: {
        report_id: reportData.id
      }
    });

    if (onShare) {
      onShare();
    }
  };

  const handleSchedule = async () => {
    await logActivity({
      action: 'report_schedule_requested',
      description: `Requested schedule for report: ${reportData.title}`,
      metadata: {
        report_id: reportData.id
      }
    });

    if (onSchedule) {
      onSchedule();
    }
  };

  // Filter and sort data
  const filteredData = reportData.data.filter(item => {
    if (!filterText) return true;
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatValue = (value: any, key: string) => {
    if (typeof value === 'number') {
      if (key.includes('rate') || key.includes('percentage')) {
        return `${(value * 100).toFixed(2)}%`;
      }
      if (key.includes('amount') || key.includes('revenue') || key.includes('cost')) {
        return `$${value.toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return (
        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend < 0) {
      return (
        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" id="custom-report-container">
      {/* Report Header */}
      <div className="p-6 border-b border-gray-200" id="report-header">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{reportData.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Type: {reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)}</span>
              <span>Generated: {new Date(reportData.metadata.generated_at).toLocaleString()}</span>
              <span>Records: {reportData.metadata.total_records.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Date Range: {new Date(reportData.metadata.date_range.start).toLocaleDateString()} - {new Date(reportData.metadata.date_range.end).toLocaleDateString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2" id="report-actions">
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              id="export-csv-button"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              id="export-pdf-button"
            >
              Export PDF
            </button>
            {onShare && (
              <button
                onClick={handleShare}
                className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                id="share-report-button"
              >
                Share
              </button>
            )}
            {onSchedule && (
              <button
                onClick={handleSchedule}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                id="schedule-report-button"
              >
                Schedule
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200" id="report-tabs">
        <nav className="flex space-x-8 px-6">
          {['overview', 'data', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id={`tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6" id="report-content">
        {activeTab === 'overview' && (
          <div className="space-y-6" id="overview-tab">
            {/* Key Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(reportData.summary.key_metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4" id={`metric-${key}`}>
                    <div className="text-sm text-gray-600 mb-1">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatValue(value, key)}
                    </div>
                    {reportData.summary.trends[key] && (
                      <div className="flex items-center mt-2">
                        {getTrendIcon(reportData.summary.trends[key])}
                        <span className={`text-sm ml-1 ${
                          reportData.summary.trends[key] > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {reportData.summary.trends[key] > 0 ? '+' : ''}
                          {reportData.summary.trends[key].toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Chart Placeholder */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Overview</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center" id="chart-placeholder">
                <svg className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-600">Chart visualization would appear here</p>
                <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4" id="data-tab">
            {/* Data Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Filter data..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="data-filter-input"
                />
                <span className="text-sm text-gray-600">
                  Showing {paginatedData.length} of {sortedData.length} records
                </span>
              </div>
            </div>

            {/* Data Table */}
            {paginatedData.length > 0 ? (
              <div className="overflow-x-auto" id="data-table-container">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(paginatedData[0]).map((key) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key)}
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                          id={`header-${key}`}
                        >
                          <div className="flex items-center gap-1">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            {sortConfig?.key === key && (
                              <span className="text-blue-600">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50" id={`row-${index}`}>
                        {Object.entries(row).map(([key, value], cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                            {formatValue(value, key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500" id="no-data-message">
                <p>No data matches your filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between" id="pagination-controls">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    id="prev-page-button"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    id="next-page-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6" id="insights-tab">
            {/* AI Insights */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              {reportData.summary.insights.length > 0 ? (
                <div className="space-y-3">
                  {reportData.summary.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg" id={`insight-${index}`}>
                      <div className="p-1 bg-blue-100 rounded-full">
                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500" id="no-insights-message">
                  <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p>No insights available for this report</p>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg" id="recommendation-1">
                  <div className="p-1 bg-green-100 rounded-full">
                    <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Consider scheduling this report to run automatically to track trends over time.</p>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg" id="recommendation-2">
                  <div className="p-1 bg-yellow-100 rounded-full">
                    <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Share this report with relevant team members to ensure everyone has access to the latest data.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { SEOReport } from '../../types/dashboard';


interface SEOHistorySectionProps {
  className?: string;
}

interface SEOReportsResponse {
  reports: SEOReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SEOHistorySection({ className = '' }: SEOHistorySectionProps) {
  const [reports, setReports] = useState<SEOReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchUrl, setSearchUrl] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'score' | 'url'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchReports = async (page: number = 1, url: string = '', sort: string = 'created_at', order: string = 'desc') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: sort,
        sortOrder: order,
      });

      if (url.trim()) {
        params.append('url', url.trim());
      }

      const response = await fetch(`/api/seo-reports?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch SEO reports');
      }

      const data: SEOReportsResponse = await response.json();
      setReports(data.reports);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching SEO reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage, searchUrl, sortBy, sortOrder);
  }, [currentPage, searchUrl, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports(1, searchUrl, sortBy, sortOrder);
  };

  const handleSort = (field: 'created_at' | 'score' | 'url') => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this SEO report?')) {
      return;
    }

    try {
      const response = await fetch(`/api/seo-reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete SEO report');
      }

      // Refresh the reports list
      fetchReports(currentPage, searchUrl, sortBy, sortOrder);
    } catch (err) {
      console.error('Error deleting SEO report:', err);
      alert('Failed to delete SEO report. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  const getScoreBadgeColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading && reports.length === 0) {
    return (
      <div id="seo-history-loading" className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="seo-history-section" className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div id="seo-history-header" className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">SEO Report History</h2>
            <p className="text-sm text-gray-600 mt-1">
              View and manage your SEO analysis reports
            </p>
          </div>
          
          <form id="seo-search-form" onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by URL..."
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>

        {/* Sort Controls */}
        <div id="seo-sort-controls" className="flex gap-2 mt-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => handleSort('created_at')}
            className={`text-sm px-2 py-1 rounded ${
              sortBy === 'created_at' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Date {sortBy === 'created_at' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('score')}
            className={`text-sm px-2 py-1 rounded ${
              sortBy === 'score' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Score {sortBy === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('url')}
            className={`text-sm px-2 py-1 rounded ${
              sortBy === 'url' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            URL {sortBy === 'url' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      <div id="seo-history-content" className="p-6">
        {error && (
          <div id="seo-history-error" className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {reports.length === 0 && !loading ? (
          <div id="seo-history-empty" className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No SEO reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchUrl ? 'Try adjusting your search criteria.' : 'Get started by analyzing your first website.'}
            </p>
          </div>
        ) : (
          <>
            <div id="seo-reports-list" className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  id={`seo-report-${report.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {report.url}
                        </h3>
                        {report.score !== null && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(report.score)}`}>
                            Score: {report.score}/100
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Analyzed on {formatDate(report.created_at)}
                      </p>
                      {report.improvements && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">
                            {Object.keys(report.improvements).length} improvement suggestions available
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => window.open(`/seo-analyzer/report?id=${report.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Report
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div id="seo-history-pagination" className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {loading && reports.length > 0 && (
          <div id="seo-history-loading-overlay" className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
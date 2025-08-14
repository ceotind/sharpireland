'use client';

import React, { useState, useEffect } from 'react';
import AnalyticsCard from './AnalyticsCard';
import { AnalyticsSnapshot } from '../../types/dashboard';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';

interface AnalyticsSectionProps {
  className?: string;
}

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  trends: {
    visitors: Array<{ date: string; value: number }>;
    pageViews: Array<{ date: string; value: number }>;
  };
  topPages: Array<{ page: string; views: number; change: number }>;
  sources: Array<{ source: string; visitors: number; percentage: number }>;
}

export default function AnalyticsSection({ className = '' }: AnalyticsSectionProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/overview?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data.analytics || generateMockData());
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      // Use mock data as fallback
      setAnalyticsData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): AnalyticsData => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const visitors = [];
    const pageViews = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      visitors.push({
        date: dateStr,
        value: Math.floor(Math.random() * 500) + 100
      });
      
      pageViews.push({
        date: dateStr,
        value: Math.floor(Math.random() * 1200) + 300
      });
    }

    return {
      overview: {
        totalVisitors: 12543,
        pageViews: 45678,
        bounceRate: 34.5,
        avgSessionDuration: 245
      },
      trends: { visitors, pageViews },
      topPages: [
        { page: '/dashboard', views: 8934, change: 12.5 },
        { page: '/projects', views: 6721, change: -3.2 },
        { page: '/analytics', views: 4532, change: 8.7 },
        { page: '/billing', views: 3421, change: 15.3 },
        { page: '/support', views: 2876, change: -1.8 }
      ],
      sources: [
        { source: 'Direct', visitors: 5234, percentage: 41.7 },
        { source: 'Google', visitors: 3456, percentage: 27.6 },
        { source: 'Social Media', visitors: 2134, percentage: 17.0 },
        { source: 'Referral', visitors: 1234, percentage: 9.8 },
        { source: 'Email', visitors: 485, percentage: 3.9 }
      ]
    };
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div id="analytics-section-loading" className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div id="analytics-section-error" className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div id="analytics-section" className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div id="analytics-header" className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
          
          {/* Time Range Selector */}
          <div id="analytics-time-range" className="flex space-x-1">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div id="analytics-overview" className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Total Visitors"
            value={analyticsData.overview.totalVisitors}
            change={{ value: 12.5, period: 'last month' }}
            trend="up"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
          
          <AnalyticsCard
            title="Page Views"
            value={analyticsData.overview.pageViews}
            change={{ value: 8.3, period: 'last month' }}
            trend="up"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          
          <AnalyticsCard
            title="Bounce Rate"
            value={`${analyticsData.overview.bounceRate}%`}
            change={{ value: -2.1, period: 'last month' }}
            trend="up"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          
          <AnalyticsCard
            title="Avg. Session"
            value={formatDuration(analyticsData.overview.avgSessionDuration)}
            change={{ value: 5.7, period: 'last month' }}
            trend="up"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Charts */}
      <div id="analytics-charts" className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitors Trend */}
          <div id="visitors-chart-container" className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visitors Trend</h3>
            <LineChart
              data={analyticsData.trends.visitors}
              color="#3B82F6"
              height={200}
            />
          </div>

          {/* Page Views Chart */}
          <div id="pageviews-chart-container" className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Page Views</h3>
            <BarChart
              data={analyticsData.trends.pageViews.map(item => ({
                label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: item.value
              }))}
              height={200}
              colors={['#10B981']}
            />
          </div>
        </div>
      </div>

      {/* Top Pages and Traffic Sources */}
      <div id="analytics-details" className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div id="top-pages-section">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Pages</h3>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div
                  key={page.page}
                  id={`top-page-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div id={`top-page-info-${index}`}>
                    <div className="font-medium text-gray-900">{page.page}</div>
                    <div className="text-sm text-gray-600">{page.views.toLocaleString()} views</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    page.change > 0 ? 'text-green-600' : page.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {page.change > 0 ? '+' : ''}{page.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div id="traffic-sources-section">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {analyticsData.sources.map((source, index) => (
                <div
                  key={source.source}
                  id={`traffic-source-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div id={`traffic-source-info-${index}`}>
                    <div className="font-medium text-gray-900">{source.source}</div>
                    <div className="text-sm text-gray-600">{source.visitors.toLocaleString()} visitors</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {source.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
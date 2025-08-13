'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  sent_at: string | null;
  scheduled_at: string | null;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  spam_complaints: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  created_at: string;
}

interface EmailMetrics {
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_bounce_rate: number;
  list_growth_rate: number;
  subscriber_count: number;
}

interface EmailCampaignStatsProps {
  userId: string;
}

export default function EmailCampaignStats({ userId }: EmailCampaignStatsProps) {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in a real app, this would come from email service APIs
  const mockCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'Weekly Newsletter #45',
      subject: 'Your weekly dose of industry insights 📧',
      status: 'sent',
      sent_at: '2024-01-15T09:00:00Z',
      scheduled_at: null,
      recipients: 5420,
      delivered: 5380,
      opened: 1615,
      clicked: 324,
      bounced: 40,
      unsubscribed: 12,
      spam_complaints: 2,
      open_rate: 30.0,
      click_rate: 6.0,
      bounce_rate: 0.7,
      unsubscribe_rate: 0.2,
      created_at: '2024-01-14T15:30:00Z'
    },
    {
      id: '2',
      name: 'Product Launch Announcement',
      subject: '🚀 Introducing our latest innovation!',
      status: 'sent',
      sent_at: '2024-01-12T14:00:00Z',
      scheduled_at: null,
      recipients: 8950,
      delivered: 8890,
      opened: 3200,
      clicked: 896,
      bounced: 60,
      unsubscribed: 28,
      spam_complaints: 5,
      open_rate: 36.0,
      click_rate: 10.0,
      bounce_rate: 0.7,
      unsubscribe_rate: 0.3,
      created_at: '2024-01-11T10:15:00Z'
    },
    {
      id: '3',
      name: 'Holiday Sale Campaign',
      subject: '🎉 Limited time: 50% off everything!',
      status: 'sent',
      sent_at: '2024-01-08T08:00:00Z',
      scheduled_at: null,
      recipients: 12300,
      delivered: 12180,
      opened: 4260,
      clicked: 1230,
      bounced: 120,
      unsubscribed: 45,
      spam_complaints: 8,
      open_rate: 35.0,
      click_rate: 10.0,
      bounce_rate: 1.0,
      unsubscribe_rate: 0.4,
      created_at: '2024-01-07T16:45:00Z'
    },
    {
      id: '4',
      name: 'Customer Survey Request',
      subject: 'Help us improve - 2 minute survey',
      status: 'scheduled',
      sent_at: null,
      scheduled_at: '2024-01-20T10:00:00Z',
      recipients: 6800,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      spam_complaints: 0,
      open_rate: 0,
      click_rate: 0,
      bounce_rate: 0,
      unsubscribe_rate: 0,
      created_at: '2024-01-15T11:20:00Z'
    },
    {
      id: '5',
      name: 'Welcome Series - Part 1',
      subject: 'Welcome to our community! 👋',
      status: 'draft',
      sent_at: null,
      scheduled_at: null,
      recipients: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      spam_complaints: 0,
      open_rate: 0,
      click_rate: 0,
      bounce_rate: 0,
      unsubscribe_rate: 0,
      created_at: '2024-01-16T09:30:00Z'
    }
  ];

  useEffect(() => {
    const loadEmailData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCampaigns(mockCampaigns);

        // Calculate metrics from sent campaigns
        const sentCampaigns = mockCampaigns.filter(c => c.status === 'sent');
        const totalSent = sentCampaigns.reduce((sum, c) => sum + c.recipients, 0);
        const totalDelivered = sentCampaigns.reduce((sum, c) => sum + c.delivered, 0);
        const totalOpened = sentCampaigns.reduce((sum, c) => sum + c.opened, 0);
        const totalClicked = sentCampaigns.reduce((sum, c) => sum + c.clicked, 0);

        const calculatedMetrics: EmailMetrics = {
          total_campaigns: mockCampaigns.length,
          total_sent: totalSent,
          total_delivered: totalDelivered,
          total_opened: totalOpened,
          total_clicked: totalClicked,
          avg_open_rate: sentCampaigns.length > 0 ? sentCampaigns.reduce((sum, c) => sum + c.open_rate, 0) / sentCampaigns.length : 0,
          avg_click_rate: sentCampaigns.length > 0 ? sentCampaigns.reduce((sum, c) => sum + c.click_rate, 0) / sentCampaigns.length : 0,
          avg_bounce_rate: sentCampaigns.length > 0 ? sentCampaigns.reduce((sum, c) => sum + c.bounce_rate, 0) / sentCampaigns.length : 0,
          list_growth_rate: 8.5, // Mock growth rate
          subscriber_count: 15420 // Mock subscriber count
        };

        setMetrics(calculatedMetrics);

        await logActivity({
          action: 'email_campaign_stats_viewed',
          description: 'Viewed email campaign statistics',
          metadata: { 
            campaigns_count: mockCampaigns.length,
            time_range: timeRange
          }
        });

      } catch (err) {
        console.error('Error loading email data:', err);
        setError('Failed to load email campaign statistics');
      } finally {
        setLoading(false);
      }
    };

    loadEmailData();
  }, [timeRange, userId]);

  const handleStatusChange = async (status: string) => {
    setSelectedStatus(status);
    
    await logActivity({
      action: 'email_status_filter_changed',
      description: `Filtered email campaigns by status: ${status}`,
      metadata: { status }
    });
  };

  const handleTimeRangeChange = async (range: '7d' | '30d' | '90d') => {
    setTimeRange(range);
    
    await logActivity({
      action: 'email_timerange_changed',
      description: `Changed email campaign time range to ${range}`,
      metadata: { time_range: range }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (rate: number, type: 'open' | 'click' | 'bounce') => {
    switch (type) {
      case 'open':
        if (rate >= 25) return 'text-green-600';
        if (rate >= 15) return 'text-yellow-600';
        return 'text-red-600';
      case 'click':
        if (rate >= 5) return 'text-green-600';
        if (rate >= 2) return 'text-yellow-600';
        return 'text-red-600';
      case 'bounce':
        if (rate <= 2) return 'text-green-600';
        if (rate <= 5) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getFilteredCampaigns = () => {
    if (selectedStatus === 'all') return campaigns;
    return campaigns.filter(campaign => campaign.status === selectedStatus);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6" id="email-campaign-loading">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" id="email-campaign-error">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Email Campaign Stats</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <div className="space-y-6" id="email-campaign-stats-container">
      {/* Controls */}
      <div className="flex items-center justify-between" id="email-campaign-controls">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="status-selector"
            >
              <option value="all">All Campaigns</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email-timerange-selector"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Campaign
        </button>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="email-metrics">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="total-campaigns-metric">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{metrics.total_campaigns}</h3>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-xs text-green-600">{formatNumber(metrics.subscriber_count)} subscribers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="avg-open-rate-metric">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-2xl font-bold ${getPerformanceColor(metrics.avg_open_rate, 'open')}`}>
                  {metrics.avg_open_rate.toFixed(1)}%
                </h3>
                <p className="text-sm text-gray-600">Avg Open Rate</p>
                <p className="text-xs text-gray-500">{formatNumber(metrics.total_opened)} total opens</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="avg-click-rate-metric">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-2xl font-bold ${getPerformanceColor(metrics.avg_click_rate, 'click')}`}>
                  {metrics.avg_click_rate.toFixed(1)}%
                </h3>
                <p className="text-sm text-gray-600">Avg Click Rate</p>
                <p className="text-xs text-gray-500">{formatNumber(metrics.total_clicked)} total clicks</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="list-growth-metric">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-green-600">+{metrics.list_growth_rate.toFixed(1)}%</h3>
                <p className="text-sm text-gray-600">List Growth</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="email-campaigns-list">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Email Campaigns ({filteredCampaigns.length})
        </h3>
        
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p>No campaigns found for the selected status</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4" id={`campaign-${campaign.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                        {campaign.status.toUpperCase()}
                      </span>
                      {campaign.sent_at && (
                        <span>Sent: {new Date(campaign.sent_at).toLocaleDateString()}</span>
                      )}
                      {campaign.scheduled_at && (
                        <span>Scheduled: {new Date(campaign.scheduled_at).toLocaleDateString()}</span>
                      )}
                      <span>Recipients: {formatNumber(campaign.recipients)}</span>
                    </div>
                  </div>
                </div>

                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{formatNumber(campaign.delivered)}</div>
                      <div className="text-xs text-gray-600">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(campaign.open_rate, 'open')}`}>
                        {campaign.open_rate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(campaign.click_rate, 'click')}`}>
                        {campaign.click_rate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(campaign.bounce_rate, 'bounce')}`}>
                        {campaign.bounce_rate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Bounce Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{campaign.unsubscribed}</div>
                      <div className="text-xs text-gray-600">Unsubscribed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{campaign.spam_complaints}</div>
                      <div className="text-xs text-gray-600">Spam Reports</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
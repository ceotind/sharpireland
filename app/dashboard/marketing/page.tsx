'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import { logActivity } from '../../utils/activity-logger-client';
import CampaignCard from '../../components/dashboard/CampaignCard';
import SocialMediaMetrics from '../../components/dashboard/SocialMediaMetrics';
import EmailCampaignStats from '../../components/dashboard/EmailCampaignStats';

interface User {
  id: string;
  email?: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface MarketingMetrics {
  total_campaigns: number;
  active_campaigns: number;
  total_budget: number;
  total_spent: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  avg_ctr: number;
  avg_conversion_rate: number;
  roi: number;
}

export default function MarketingDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<MarketingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'social' | 'email'>('overview');

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        setUser(user);
        
        if (user) {
          await loadMarketingData();
          await logActivity({
            action: 'marketing_dashboard_visited',
            description: 'Visited marketing dashboard',
            metadata: { page: 'marketing' }
          });
        }
      } catch (err) {
        console.error('Error getting user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase]);

  const loadMarketingData = async () => {
    try {
      // Mock data - in a real app, this would come from APIs
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Summer Sale Email Campaign',
          type: 'email',
          status: 'active',
          budget: 5000,
          spent: 3200,
          impressions: 45000,
          clicks: 2250,
          conversions: 180,
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Social Media Brand Awareness',
          type: 'social',
          status: 'active',
          budget: 8000,
          spent: 6400,
          impressions: 120000,
          clicks: 3600,
          conversions: 240,
          start_date: '2024-01-01',
          end_date: '2024-02-15',
          created_at: '2024-01-01'
        },
        {
          id: '3',
          name: 'Google Ads PPC Campaign',
          type: 'ppc',
          status: 'paused',
          budget: 10000,
          spent: 8500,
          impressions: 85000,
          clicks: 4250,
          conversions: 340,
          start_date: '2023-12-01',
          end_date: '2024-01-15',
          created_at: '2023-12-01'
        },
        {
          id: '4',
          name: 'Content Marketing Initiative',
          type: 'content',
          status: 'completed',
          budget: 3000,
          spent: 2800,
          impressions: 25000,
          clicks: 1500,
          conversions: 95,
          start_date: '2023-11-01',
          end_date: '2023-12-31',
          created_at: '2023-11-01'
        }
      ];

      setCampaigns(mockCampaigns);

      // Calculate metrics
      const totalBudget = mockCampaigns.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = mockCampaigns.reduce((sum, c) => sum + c.spent, 0);
      const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0);
      const totalClicks = mockCampaigns.reduce((sum, c) => sum + c.clicks, 0);
      const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0);

      const calculatedMetrics: MarketingMetrics = {
        total_campaigns: mockCampaigns.length,
        active_campaigns: mockCampaigns.filter(c => c.status === 'active').length,
        total_budget: totalBudget,
        total_spent: totalSpent,
        total_impressions: totalImpressions,
        total_clicks: totalClicks,
        total_conversions: totalConversions,
        avg_ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        avg_conversion_rate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
        roi: totalSpent > 0 ? ((totalConversions * 50 - totalSpent) / totalSpent) * 100 : 0 // Assuming $50 per conversion
      };

      setMetrics(calculatedMetrics);

    } catch (err) {
      console.error('Error loading marketing data:', err);
      setError('Failed to load marketing data');
    }
  };

  const handleTimeRangeChange = async (range: '7d' | '30d' | '90d' | '1y') => {
    setSelectedTimeRange(range);
    
    if (user) {
      await logActivity({
        action: 'marketing_timerange_changed',
        description: `Changed marketing dashboard time range to ${range}`,
        metadata: { time_range: range }
      });
    }
  };

  const handleTabChange = async (tab: 'overview' | 'campaigns' | 'social' | 'email') => {
    setActiveTab(tab);
    
    if (user) {
      await logActivity({
        action: 'marketing_tab_changed',
        description: `Switched to ${tab} tab in marketing dashboard`,
        metadata: { tab }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" id="marketing-dashboard-loading">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" id="marketing-dashboard-error">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Marketing Dashboard</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" id="marketing-dashboard-unauthorized">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h2>
            <p className="text-yellow-600">Please log in to access the marketing dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" id="marketing-dashboard-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8" id="marketing-dashboard-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Dashboard</h1>
              <p className="text-gray-600">
                Track your marketing campaigns, analyze performance, and optimize your strategy.
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-2" id="time-range-selector">
              <span className="text-sm text-gray-600">Time Range:</span>
              <select
                value={selectedTimeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value as typeof selectedTimeRange)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="marketing-metrics">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="total-campaigns-metric">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{metrics.total_campaigns}</h3>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                  <p className="text-xs text-green-600">{metrics.active_campaigns} active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="total-budget-metric">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">${metrics.total_budget.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-xs text-gray-500">${metrics.total_spent.toLocaleString()} spent</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="total-impressions-metric">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{metrics.total_impressions.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Total Impressions</p>
                  <p className="text-xs text-blue-600">{metrics.avg_ctr.toFixed(2)}% CTR</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="total-conversions-metric">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{metrics.total_conversions.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Total Conversions</p>
                  <p className="text-xs text-green-600">{metrics.roi.toFixed(1)}% ROI</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8" id="marketing-navigation-tabs">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'campaigns', label: 'Campaigns', icon: '🎯' },
              { id: 'social', label: 'Social Media', icon: '📱' },
              { id: 'email', label: 'Email Marketing', icon: '📧' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as 'overview' | 'campaigns' | 'social' | 'email')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                id={`${tab.id}-tab`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div id="marketing-tab-content">
          {activeTab === 'overview' && (
            <div className="space-y-8" id="overview-tab-content">
              {/* Campaign Performance Chart Placeholder */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance Overview</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600">Performance chart would appear here</p>
                  <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
                </div>
              </div>

              {/* Recent Campaigns */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} userId={user.id} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6" id="campaigns-tab-content">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Campaigns</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Campaign
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} userId={user.id} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <SocialMediaMetrics userId={user.id} />
          )}

          {activeTab === 'email' && (
            <EmailCampaignStats userId={user.id} />
          )}
        </div>
      </div>
    </div>
  );
}
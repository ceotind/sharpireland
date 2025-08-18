'use client';

import { useState } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

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

interface CampaignCardProps {
  campaign: Campaign;
  userId: string;
  onEdit?: (campaign: Campaign) => void;
  onPause?: (campaignId: string) => void;
  onResume?: (campaignId: string) => void;
  onDelete?: (campaignId: string) => void;
}

export default function CampaignCard({ 
  campaign, 
  userId, 
  onEdit, 
  onPause, 
  onResume, 
  onDelete 
}: CampaignCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'social':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        );
      case 'ppc':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'content':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const calculateCTR = () => {
    return campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  };

  const calculateConversionRate = () => {
    return campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
  };

  const calculateBudgetUsed = () => {
    return campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
  };

  const handleAction = async (action: string) => {
    await logActivity({
      action: `campaign_${action}`,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} campaign: ${campaign.name}`,
      metadata: {
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        campaign_type: campaign.type
      }
    }, { userId: userId });

    switch (action) {
      case 'edit':
        onEdit?.(campaign);
        break;
      case 'pause':
        onPause?.(campaign.id);
        break;
      case 'resume':
        onResume?.(campaign.id);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete the campaign "${campaign.name}"?`)) {
          onDelete?.(campaign.id);
        }
        break;
    }
    setShowActions(false);
  };

  const isActive = campaign.status === 'active';
  const isPaused = campaign.status === 'paused';
  const isCompleted = campaign.status === 'completed';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
      id={`campaign-card-${campaign.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4" id={`campaign-header-${campaign.id}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {getTypeIcon(campaign.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{campaign.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{campaign.type} Campaign</p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            id={`campaign-actions-${campaign.id}`}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleAction('edit')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit Campaign
              </button>
              {isActive && (
                <button
                  onClick={() => handleAction('pause')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Pause Campaign
                </button>
              )}
              {isPaused && (
                <button
                  onClick={() => handleAction('resume')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Resume Campaign
                </button>
              )}
              <button
                onClick={() => handleAction('delete')}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete Campaign
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
          {campaign.status.toUpperCase()}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4" id={`campaign-metrics-${campaign.id}`}>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {campaign.impressions.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Impressions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {campaign.clicks.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Clicks</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {calculateCTR().toFixed(2)}%
          </div>
          <div className="text-xs text-gray-600">CTR</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {campaign.conversions.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Conversions</div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="mb-4" id={`campaign-budget-${campaign.id}`}>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Budget Used</span>
          <span className="font-medium text-gray-900">
            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              calculateBudgetUsed() > 90 ? 'bg-red-500' : 
              calculateBudgetUsed() > 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(calculateBudgetUsed(), 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {calculateBudgetUsed().toFixed(1)}% used
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="flex items-center justify-between text-sm" id={`campaign-performance-${campaign.id}`}>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Conversion Rate:</span>
          <span className={`font-medium ${
            calculateConversionRate() > 5 ? 'text-green-600' : 
            calculateConversionRate() > 2 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {calculateConversionRate().toFixed(2)}%
          </span>
        </div>
        
        <div className="text-gray-500">
          {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
        </div>
      </div>

      {/* Campaign Timeline */}
      {!isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-100" id={`campaign-timeline-${campaign.id}`}>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Started {new Date(campaign.start_date).toLocaleDateString()}</span>
            <span>Ends {new Date(campaign.end_date).toLocaleDateString()}</span>
          </div>
          
          {/* Timeline Progress */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="h-1 rounded-full bg-blue-500"
                style={{ 
                  width: `${Math.min(
                    ((Date.now() - new Date(campaign.start_date).getTime()) / 
                     (new Date(campaign.end_date).getTime() - new Date(campaign.start_date).getTime())) * 100,
                    100
                  )}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Click overlay to close actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        ></div>
      )}
    </div>
  );
}
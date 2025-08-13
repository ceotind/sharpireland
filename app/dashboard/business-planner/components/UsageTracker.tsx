'use client';

import React from 'react';
import { BusinessPlannerUsage } from '@/app/types/business-planner';
import { FREE_CONVERSATIONS_LIMIT, PAID_CONVERSATIONS_COUNT } from '@/app/utils/business-planner/constants';

interface UsageTrackerProps {
  usage: BusinessPlannerUsage;
  onUpgrade: () => void;
  showDetails?: boolean;
}

/**
 * UsageTracker Component
 * Displays user's conversation usage with visual progress bars
 * Shows free/paid tier status and upgrade prompts
 */
const UsageTracker: React.FC<UsageTrackerProps> = ({
  usage,
  onUpgrade,
  showDetails = false
}) => {
  const freeUsed = usage.free_conversations_used;
  const paidUsed = usage.paid_conversations_used;
  const freeRemaining = Math.max(0, FREE_CONVERSATIONS_LIMIT - freeUsed);
  const paidRemaining = Math.max(0, PAID_CONVERSATIONS_COUNT - paidUsed);
  
  const freePercentage = Math.min(100, (freeUsed / FREE_CONVERSATIONS_LIMIT) * 100);
  const paidPercentage = usage.subscription_status === 'paid' 
    ? Math.min(100, (paidUsed / PAID_CONVERSATIONS_COUNT) * 100)
    : 0;

  const isNearLimit = freeRemaining <= 2 && usage.subscription_status === 'free';
  const needsUpgrade = freeRemaining === 0 && usage.subscription_status === 'free';

  const resetDate = new Date(usage.last_reset_date);
  const nextResetDate = new Date(resetDate);
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);

  return (
    <div id="usage-tracker-container" className="space-y-6">
      {/* Subscription Status */}
      <div id="subscription-status-section">
        <div id="subscription-status-header" className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Subscription Status</h3>
          <span
            id="subscription-badge"
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              usage.subscription_status === 'paid'
                ? 'bg-green-100 text-green-800'
                : usage.subscription_status === 'expired'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {usage.subscription_status === 'paid' ? 'Paid Plan' : 
             usage.subscription_status === 'expired' ? 'Expired' : 'Free Plan'}
          </span>
        </div>
      </div>

      {/* Free Conversations Usage */}
      <div id="free-usage-section">
        <div id="free-usage-header" className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Free Conversations</span>
          <span className="text-sm text-gray-500">
            {freeUsed} / {FREE_CONVERSATIONS_LIMIT}
          </span>
        </div>
        <div id="free-usage-progress-container" className="w-full bg-gray-200 rounded-full h-2">
          <div
            id="free-usage-progress-bar"
            className={`h-2 rounded-full transition-all duration-300 ${
              needsUpgrade ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${freePercentage}%` }}
          />
        </div>
        <div id="free-usage-remaining" className="mt-1 text-xs text-gray-500">
          {freeRemaining > 0 ? `${freeRemaining} conversations remaining` : 'No free conversations remaining'}
        </div>
      </div>

      {/* Paid Conversations Usage (if applicable) */}
      {usage.subscription_status === 'paid' && (
        <div id="paid-usage-section">
          <div id="paid-usage-header" className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Paid Conversations</span>
            <span className="text-sm text-gray-500">
              {paidUsed} / {PAID_CONVERSATIONS_COUNT}
            </span>
          </div>
          <div id="paid-usage-progress-container" className="w-full bg-gray-200 rounded-full h-2">
            <div
              id="paid-usage-progress-bar"
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
          <div id="paid-usage-remaining" className="mt-1 text-xs text-gray-500">
            {paidRemaining} conversations remaining
          </div>
        </div>
      )}

      {/* Usage Details */}
      {showDetails && (
        <div id="usage-details-section" className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Usage Details</h4>
          <div id="usage-details-grid" className="space-y-2">
            <div id="total-tokens-detail" className="flex justify-between text-sm">
              <span className="text-gray-600">Total Tokens Used:</span>
              <span className="font-medium text-gray-900">
                {usage.total_tokens_used.toLocaleString()}
              </span>
            </div>
            <div id="reset-date-detail" className="flex justify-between text-sm">
              <span className="text-gray-600">Last Reset:</span>
              <span className="font-medium text-gray-900">
                {resetDate.toLocaleDateString()}
              </span>
            </div>
            <div id="next-reset-detail" className="flex justify-between text-sm">
              <span className="text-gray-600">Next Reset:</span>
              <span className="font-medium text-gray-900">
                {nextResetDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {(needsUpgrade || isNearLimit) && usage.subscription_status === 'free' && (
        <div id="upgrade-cta-section" className="pt-4 border-t border-gray-200">
          <div
            id="upgrade-cta-card"
            className={`rounded-lg p-4 ${
              needsUpgrade ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <div id="upgrade-cta-content" className="flex items-start">
              <div id="upgrade-cta-icon" className="flex-shrink-0">
                <svg
                  className={`w-5 h-5 ${needsUpgrade ? 'text-red-400' : 'text-yellow-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div id="upgrade-cta-text" className="ml-3 flex-1">
                <h3
                  className={`text-sm font-medium ${
                    needsUpgrade ? 'text-red-800' : 'text-yellow-800'
                  }`}
                >
                  {needsUpgrade ? 'Upgrade Required' : 'Upgrade Recommended'}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    needsUpgrade ? 'text-red-700' : 'text-yellow-700'
                  }`}
                >
                  {needsUpgrade
                    ? 'You\'ve used all your free conversations. Upgrade to continue planning.'
                    : `Only ${freeRemaining} free conversations left. Upgrade for unlimited access.`}
                </p>
                <div id="upgrade-cta-actions" className="mt-3">
                  <button
                    onClick={onUpgrade}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      needsUpgrade
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message for Paid Users */}
      {usage.subscription_status === 'paid' && paidRemaining > 10 && (
        <div id="paid-success-section" className="pt-4 border-t border-gray-200">
          <div id="paid-success-card" className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div id="paid-success-content" className="flex items-start">
              <div id="paid-success-icon" className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div id="paid-success-text" className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  You're all set!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  You have {paidRemaining} paid conversations remaining. Keep planning!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageTracker;
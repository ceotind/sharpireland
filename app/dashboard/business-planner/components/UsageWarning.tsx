import React from 'react';
import { BusinessPlannerUsage } from '@/app/types/business-planner';

interface UsageWarningProps {
  usage: BusinessPlannerUsage;
}

const UsageWarning: React.FC<UsageWarningProps> = React.memo(({ usage }) => {
  const hasUsageRemaining = () => {
    const freeRemaining = Math.max(0, 10 - usage.free_conversations_used);
    
    return freeRemaining > 0 || (usage.subscription_status === 'paid' && usage.paid_conversations_used < 50);
  };

  const freeRemaining = Math.max(0, 10 - usage.free_conversations_used);
  const paidRemaining = usage.subscription_status === 'paid'
    ? Math.max(0, 50 - usage.paid_conversations_used)
    : 0;
  
  if (!hasUsageRemaining()) {
    return (
      <div id="usage-limit-warning" className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Conversation limit reached</h3>
            <p className="text-sm text-red-700 mt-1">
              You've used all your available conversations. Upgrade to continue planning.
            </p>
            <a
              href="/dashboard/billing"
              className="inline-flex items-center mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (freeRemaining <= 2 && usage.subscription_status === 'free') {
    return (
      <div id="usage-warning" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Running low on conversations</h3>
            <p className="text-sm text-yellow-700 mt-1">
              You have {freeRemaining} free conversations remaining. Consider upgrading for unlimited access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

export default UsageWarning;
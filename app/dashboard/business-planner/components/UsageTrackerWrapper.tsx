'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UsageTracker from './UsageTracker';
import { BusinessPlannerUsage } from '@/app/types/business-planner';

interface UsageTrackerWrapperProps {
  usage: BusinessPlannerUsage;
  showDetails?: boolean;
}

/**
 * UsageTrackerWrapper Component
 * Client Component wrapper that handles event logic for UsageTracker
 * This prevents passing event handlers from Server Components
 */
const UsageTrackerWrapper: React.FC<UsageTrackerWrapperProps> = ({
  usage,
  showDetails = false
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/dashboard/business-planner/billing');
  };

  return (
    <UsageTracker
      usage={usage}
      onUpgrade={handleUpgrade}
      showDetails={showDetails}
    />
  );
};

export default UsageTrackerWrapper;
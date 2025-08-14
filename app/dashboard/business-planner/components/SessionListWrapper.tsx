'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SessionList from './SessionList';
import { BusinessPlannerSession } from '@/app/types/business-planner';

interface SessionListWrapperProps {
  sessions: BusinessPlannerSession[];
  activeSession?: BusinessPlannerSession;
  isLoading?: boolean;
}

/**
 * SessionListWrapper Component
 * Client Component wrapper that handles event logic for SessionList
 * This prevents passing event handlers from Server Components
 */
const SessionListWrapper: React.FC<SessionListWrapperProps> = ({
  sessions,
  activeSession,
  isLoading = false
}) => {
  const router = useRouter();

  const handleSessionSelect = (session: BusinessPlannerSession) => {
    router.push(`/dashboard/business-planner/chat?session=${session.id}`);
  };

  const handleSessionDelete = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/business-planner/sessions?session_id=${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh the page to update the sessions list
        router.refresh();
      } else {
        console.error('Failed to delete session');
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      // You could add toast notification here
    }
  };

  return (
    <SessionList
      sessions={sessions}
      activeSession={activeSession}
      onSessionSelect={handleSessionSelect}
      onSessionDelete={handleSessionDelete}
      isLoading={isLoading}
    />
  );
};

export default SessionListWrapper;
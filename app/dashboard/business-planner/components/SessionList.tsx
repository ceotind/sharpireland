'use client';

import React, { useState } from 'react';
import { BusinessPlannerSession } from '@/app/types/business-planner';

interface SessionListProps {
  sessions: BusinessPlannerSession[];
  activeSession?: BusinessPlannerSession | undefined;
  onSessionSelect: (session: BusinessPlannerSession) => void;
  onSessionDelete: (sessionId: string) => void;
  isLoading?: boolean;
}

/**
 * SessionList Component
 * Displays a list of business planning sessions with management options
 * Includes search, filter, and action capabilities
 */
const SessionList: React.FC<SessionListProps> = ({
  sessions,
  activeSession,
  onSessionSelect,
  onSessionDelete,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Filter sessions based on search and status
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      (session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       session.context?.business_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       session.context?.challenge?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteClick = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirm(sessionId);
  };

  const handleDeleteConfirm = (sessionId: string) => {
    onSessionDelete(sessionId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div id="session-list-loading" className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} id={`session-skeleton-${index}`} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id="session-list-container" className="space-y-4">
      {/* Search and Filter Controls */}
      <div id="session-list-controls" className="space-y-3">
        <div id="search-container">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="session-search-input"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div id="filter-container" className="flex space-x-2">
          {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
            <button
              key={status}
              id={`filter-${status}`}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div id="sessions-list" className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div id="no-sessions-message" className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start your first business planning conversation.'}
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              id={`session-item-${session.id}`}
              className={`relative bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                activeSession?.id === session.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => onSessionSelect(session)}
            >
              <div id={`session-content-${session.id}`} className="flex items-start justify-between">
                <div id={`session-info-${session.id}`} className="flex-1 min-w-0">
                  <div id={`session-header-${session.id}`} className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {session.title || 'Business Planning Session'}
                    </h3>
                    <span
                      id={`session-status-${session.id}`}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
                    >
                      {session.status}
                    </span>
                  </div>
                  
                  {session.context && (
                    <div id={`session-context-${session.id}`} className="space-y-1 mb-2">
                      {session.context.business_type && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Business:</span> {session.context.business_type}
                        </p>
                      )}
                      {session.context.challenge && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          <span className="font-medium">Challenge:</span> {session.context.challenge}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div id={`session-meta-${session.id}`} className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Created {formatDate(session.created_at)}</span>
                    <span>Updated {formatDate(session.updated_at)}</span>
                  </div>
                </div>

                <div id={`session-actions-${session.id}`} className="flex items-center space-x-2 ml-4">
                  {activeSession?.id === session.id && (
                    <span id={`active-indicator-${session.id}`} className="inline-flex items-center text-xs text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                      Active
                    </span>
                  )}
                  
                  <button
                    id={`delete-button-${session.id}`}
                    onClick={(e) => handleDeleteClick(session.id, e)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete session"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm === session.id && (
                <div id={`delete-confirm-${session.id}`} className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center">
                  <div id={`delete-confirm-content-${session.id}`} className="text-center p-4">
                    <svg className="mx-auto h-8 w-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm text-gray-900 mb-3">Delete this session?</p>
                    <div id={`delete-confirm-actions-${session.id}`} className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDeleteConfirm(session.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleDeleteCancel}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredSessions.length > 0 && (
        <div id="session-list-summary" className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Showing {filteredSessions.length} of {sessions.length} sessions
        </div>
      )}
    </div>
  );
};

export default SessionList;
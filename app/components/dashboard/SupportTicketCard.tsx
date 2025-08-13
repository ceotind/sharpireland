'use client';

import React, { useState } from 'react';
import { SupportTicket } from '../../types/dashboard';

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onUpdate?: (ticketId: string, updates: Partial<SupportTicket>) => void;
  onDelete?: (ticketId: string) => void;
  onViewDetails?: (ticketId: string) => void;
  className?: string;
}

export default function SupportTicketCard({ 
  ticket, 
  onUpdate, 
  onDelete, 
  onViewDetails,
  className = '' 
}: SupportTicketCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleStatusChange = async (newStatus: string) => {
    if (!onUpdate || isUpdating) return;

    setIsUpdating(true);
    try {
      await onUpdate(ticket.id, { status: newStatus as any });
    } catch (error) {
      console.error('Error updating ticket status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    
    if (confirm('Are you sure you want to delete this support ticket? This action cannot be undone.')) {
      onDelete(ticket.id);
    }
  };

  const getMessageCount = () => {
    // Extract message count from metadata if available
    return ticket.metadata?.messages?.length || 0;
  };

  return (
    <div id={`support-ticket-${ticket.id}`} className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div id={`ticket-header-${ticket.id}`} className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {ticket.subject}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('-', ' ')}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            
            {ticket.category && (
              <div className="flex items-center gap-1 mb-2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm text-gray-600">{ticket.category}</span>
              </div>
            )}

            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {ticket.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Created: {formatDate(ticket.created_at)}</span>
              {ticket.updated_at !== ticket.created_at && (
                <span>Updated: {formatDate(ticket.updated_at)}</span>
              )}
              {getMessageCount() > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {getMessageCount()} message{getMessageCount() !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id={`ticket-actions-${ticket.id}`} className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ticket.status !== 'closed' && onUpdate && (
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}

            {ticket.status === 'resolved' && !ticket.satisfaction_rating && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Rate:</span>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onUpdate?.(ticket.id, { satisfaction_rating: rating })}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {ticket.satisfaction_rating && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Rating:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <svg
                      key={rating}
                      className={`h-4 w-4 ${rating <= ticket.satisfaction_rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(ticket.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                View Details
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {ticket.resolved_at && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Resolved on {formatDate(ticket.resolved_at)}
            </p>
          </div>
        )}
      </div>

      {isUpdating && (
        <div id={`ticket-loading-${ticket.id}`} className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
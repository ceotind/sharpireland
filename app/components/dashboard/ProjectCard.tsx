'use client';

import React from 'react';
import { Project } from '../../types/dashboard';

interface ProjectActivity {
  id: string;
  activity_type: string;
  description?: string;
  created_at: string;
}

interface ProjectWithActivity extends Project {
  project_activity?: ProjectActivity[];
}

interface ProjectCardProps {
  project: ProjectWithActivity;
  onEdit?: (project: ProjectWithActivity) => void;
  onDelete?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
}

export default function ProjectCard({ 
  project, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isOverdue = (endDate: string | null) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date() && project.status !== 'completed';
  };

  return (
    <div 
      id={`project-card-${project.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div id={`project-header-${project.id}`} className="flex items-start justify-between mb-4">
        <div id={`project-title-section-${project.id}`} className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        
        {/* Actions Menu */}
        <div id={`project-actions-${project.id}`} className="flex items-center space-x-2 ml-4">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(project.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              title="View Details"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              title="Edit Project"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
              title="Delete Project"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div id={`project-badges-${project.id}`} className="flex items-center space-x-3 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {project.status.replace('_', ' ').toUpperCase()}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
          {project.priority.toUpperCase()} PRIORITY
        </span>
        {isOverdue(project.end_date) && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            OVERDUE
          </span>
        )}
      </div>

      {/* Project Details */}
      <div id={`project-details-${project.id}`} className="grid grid-cols-2 gap-4 text-sm">
        <div id={`project-budget-${project.id}`}>
          <span className="text-gray-500">Budget:</span>
          <span className="ml-2 font-medium text-gray-900">
            {formatCurrency(project.budget_allocated)}
          </span>
        </div>
        <div id={`project-deadline-${project.id}`}>
          <span className="text-gray-500">End Date:</span>
          <span className={`ml-2 font-medium ${isOverdue(project.end_date) ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(project.end_date)}
          </span>
        </div>
        <div id={`project-created-${project.id}`}>
          <span className="text-gray-500">Created:</span>
          <span className="ml-2 font-medium text-gray-900">
            {formatDate(project.created_at)}
          </span>
        </div>
        <div id={`project-updated-${project.id}`}>
          <span className="text-gray-500">Updated:</span>
          <span className="ml-2 font-medium text-gray-900">
            {formatDate(project.updated_at)}
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      {project.project_activity && project.project_activity.length > 0 && (
        <div id={`project-activity-${project.id}`} className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
          <div id={`project-activity-list-${project.id}`} className="space-y-1">
            {project.project_activity.slice(0, 2).map((activity, index) => (
              <div 
                key={activity.id}
                id={`project-activity-item-${project.id}-${index}`}
                className="text-xs text-gray-600"
              >
                <span className="font-medium">{activity.activity_type}:</span>
                <span className="ml-1">{activity.description || 'No description'}</span>
                <span className="ml-2 text-gray-400">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React from 'react';


interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  onClick?: () => void;
}

export default function AnalyticsCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className = '',
  onClick
}: AnalyticsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div
      id={`analytics-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div id={`analytics-card-header-${title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center justify-between mb-4">
        <div id={`analytics-card-title-${title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center space-x-2">
          {icon && (
            <div className="text-gray-400">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
      </div>

      {/* Value */}
      <div id={`analytics-card-value-${title.toLowerCase().replace(/\s+/g, '-')}`} className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
      </div>

      {/* Change Indicator */}
      {change && (
        <div id={`analytics-card-change-${title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center space-x-1">
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
          </div>
          <span className="text-sm text-gray-500">
            vs {change.period}
          </span>
        </div>
      )}
    </div>
  );
}
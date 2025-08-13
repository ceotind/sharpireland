'use client';

import React, { useState, useEffect } from 'react';
import { Subscription } from '../../types/dashboard';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit?: (subscription: Subscription) => void;
  onCancel?: (subscriptionId: string) => void;
  onViewUsage?: (subscriptionId: string) => void;
}

interface UsageData {
  utilization: Record<string, number>;
  current_usage: Record<string, any>;
  usage_limit: Record<string, any>;
}

export default function SubscriptionCard({ 
  subscription, 
  onEdit, 
  onCancel, 
  onViewUsage 
}: SubscriptionCardProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    if (subscription.status === 'active') {
      fetchUsageData();
    }
  }, [subscription.id, subscription.status]);

  const fetchUsageData = async () => {
    try {
      setLoadingUsage(true);
      const response = await fetch(`/api/subscriptions/${subscription.id}/usage`);
      if (response.ok) {
        const data = await response.json();
        setUsageData({
          utilization: data.usage.current_period.utilization || {},
          current_usage: data.usage.current_period.usage || {},
          usage_limit: data.usage.current_period.limits || {}
        });
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoadingUsage(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getBillingCycleLabel = (cycle: string | null) => {
    switch (cycle) {
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'one-time':
        return 'One-time';
      default:
        return 'Custom';
    }
  };

  const isExpiringSoon = () => {
    if (!subscription.next_renewal) return false;
    const renewalDate = new Date(subscription.next_renewal);
    const now = new Date();
    const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilRenewal <= 7 && daysUntilRenewal > 0;
  };

  const isExpired = () => {
    if (!subscription.next_renewal) return false;
    return new Date(subscription.next_renewal) < new Date();
  };

  const renderUsageBar = (metric: string, current: number, limit: number) => {
    const percentage = Math.min((current / limit) * 100, 100);
    const isNearLimit = percentage >= 80;
    const isOverLimit = percentage >= 100;

    return (
      <div key={metric} id={`usage-bar-${subscription.id}-${metric}`} className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700 capitalize">{metric.replace('_', ' ')}</span>
          <span className={`${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-600'}`}>
            {current.toLocaleString()} / {limit.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {percentage.toFixed(1)}% used
        </div>
      </div>
    );
  };

  return (
    <div 
      id={`subscription-card-${subscription.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div id={`subscription-header-${subscription.id}`} className="flex items-start justify-between mb-4">
        <div id={`subscription-title-section-${subscription.id}`} className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {subscription.plan_name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
              {subscription.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {subscription.service_type}
          </p>
        </div>
        
        {/* Actions Menu */}
        <div id={`subscription-actions-${subscription.id}`} className="flex items-center space-x-2 ml-4">
          {onViewUsage && (
            <button
              onClick={() => onViewUsage(subscription.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              title="View Usage"
            >
              Usage
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(subscription)}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              title="Edit Subscription"
            >
              Edit
            </button>
          )}
          {onCancel && subscription.status === 'active' && (
            <button
              onClick={() => onCancel(subscription.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
              title="Cancel Subscription"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {(isExpiringSoon() || isExpired()) && (
        <div id={`subscription-alerts-${subscription.id}`} className="mb-4">
          {isExpired() && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    This subscription has expired and needs renewal.
                  </p>
                </div>
              </div>
            </div>
          )}
          {isExpiringSoon() && !isExpired() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    This subscription expires soon. Renewal date: {formatDate(subscription.next_renewal)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subscription Details */}
      <div id={`subscription-details-${subscription.id}`} className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div id={`subscription-price-${subscription.id}`}>
          <span className="text-gray-500">Price:</span>
          <span className="ml-2 font-medium text-gray-900">
            {formatCurrency(subscription.price)}
            {subscription.billing_cycle && subscription.price && (
              <span className="text-gray-500">/{subscription.billing_cycle === 'monthly' ? 'mo' : subscription.billing_cycle === 'yearly' ? 'yr' : 'once'}</span>
            )}
          </span>
        </div>
        <div id={`subscription-billing-${subscription.id}`}>
          <span className="text-gray-500">Billing:</span>
          <span className="ml-2 font-medium text-gray-900">
            {getBillingCycleLabel(subscription.billing_cycle)}
          </span>
        </div>
        <div id={`subscription-renewal-${subscription.id}`}>
          <span className="text-gray-500">Next Renewal:</span>
          <span className={`ml-2 font-medium ${isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-yellow-600' : 'text-gray-900'}`}>
            {formatDate(subscription.next_renewal)}
          </span>
        </div>
        <div id={`subscription-created-${subscription.id}`}>
          <span className="text-gray-500">Created:</span>
          <span className="ml-2 font-medium text-gray-900">
            {formatDate(subscription.created_at)}
          </span>
        </div>
      </div>

      {/* Usage Information */}
      {subscription.status === 'active' && usageData && Object.keys(usageData.usage_limit).length > 0 && (
        <div id={`subscription-usage-${subscription.id}`} className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Current Usage</h4>
          {loadingUsage ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div id={`usage-bars-${subscription.id}`}>
              {Object.entries(usageData.usage_limit).map(([metric, limit]) => {
                const current = usageData.current_usage[metric] || 0;
                if (typeof limit === 'number' && limit > 0) {
                  return renderUsageBar(metric, current, limit);
                }
                return null;
              })}
            </div>
          )}
        </div>
      )}

      {/* Features */}
      {subscription.features && Object.keys(subscription.features).length > 0 && (
        <div id={`subscription-features-${subscription.id}`} className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
          <div id={`features-list-${subscription.id}`} className="flex flex-wrap gap-2">
            {Object.entries(subscription.features).map(([feature, enabled]) => (
              <span
                key={feature}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {enabled && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
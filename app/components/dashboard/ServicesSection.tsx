'use client';

import React, { useState, useEffect } from 'react';
import SubscriptionCard from './SubscriptionCard';
import { Subscription } from '../../types/dashboard';

interface ServicesSectionProps {
  onNewSubscription?: () => void;
  onEditSubscription?: (subscription: Subscription) => void;
  onCancelSubscription?: (subscriptionId: string) => void;
  onViewUsage?: (subscriptionId: string) => void;
  className?: string;
}

export default function ServicesSection({
  onNewSubscription,
  onEditSubscription,
  onCancelSubscription,
  onViewUsage,
  className = ''
}: ServicesSectionProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'cancelled' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'plan_name' | 'created_at' | 'next_renewal' | 'price'>('created_at');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Update subscription status in local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' as const, updated_at: new Date().toISOString() }
            : sub
        )
      );
      
      if (onCancelSubscription) {
        onCancelSubscription(subscriptionId);
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (filter === 'all') return true;
    return subscription.status === filter;
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case 'plan_name':
        return a.plan_name.localeCompare(b.plan_name);
      case 'price':
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceB - priceA;
      case 'next_renewal':
        if (!a.next_renewal && !b.next_renewal) return 0;
        if (!a.next_renewal) return 1;
        if (!b.next_renewal) return -1;
        return new Date(a.next_renewal).getTime() - new Date(b.next_renewal).getTime();
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const getStatusCounts = () => {
    return {
      all: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      inactive: subscriptions.filter(s => s.status === 'inactive').length,
      cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
      expired: subscriptions.filter(s => s.status === 'expired').length,
    };
  };

  const getTotalMonthlySpend = () => {
    return subscriptions
      .filter(s => s.status === 'active' && s.billing_cycle === 'monthly' && s.price)
      .reduce((total, s) => total + (s.price || 0), 0);
  };

  const getTotalYearlySpend = () => {
    return subscriptions
      .filter(s => s.status === 'active' && s.billing_cycle === 'yearly' && s.price)
      .reduce((total, s) => total + (s.price || 0), 0);
  };

  const getExpiringSoon = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return subscriptions.filter(s => 
      s.status === 'active' && 
      s.next_renewal && 
      new Date(s.next_renewal) <= sevenDaysFromNow &&
      new Date(s.next_renewal) > now
    ).length;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div id="services-section-loading" className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="services-section-error" className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Subscriptions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSubscriptions}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="services-section" className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div id="services-header" className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Service Subscriptions</h2>
          {onNewSubscription && (
            <button
              onClick={onNewSubscription}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Subscription</span>
            </button>
          )}
        </div>

        {/* Summary Stats */}
        {subscriptions.length > 0 && (
          <div id="services-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-blue-600 font-medium">Monthly Spend</div>
              <div className="text-lg font-semibold text-blue-900">
                ${getTotalMonthlySpend().toFixed(2)}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-600 font-medium">Yearly Spend</div>
              <div className="text-lg font-semibold text-green-900">
                ${getTotalYearlySpend().toFixed(2)}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-sm text-yellow-600 font-medium">Expiring Soon</div>
              <div className="text-lg font-semibold text-yellow-900">
                {getExpiringSoon()}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-600 font-medium">Active Services</div>
              <div className="text-lg font-semibold text-purple-900">
                {statusCounts.active}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div id="services-controls" className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Status Filter */}
          <div id="services-filter" className="flex flex-wrap gap-1">
            {(['all', 'active', 'inactive', 'cancelled', 'expired'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} 
                <span className="ml-1 text-xs">({statusCounts[status]})</span>
              </button>
            ))}
          </div>

          {/* Sort Control */}
          <div id="services-sort" className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-sm text-gray-600">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'plan_name' | 'created_at' | 'next_renewal' | 'price')}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at">Date Added</option>
              <option value="plan_name">Plan Name</option>
              <option value="price">Price</option>
              <option value="next_renewal">Next Renewal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div id="services-list" className="p-6">
        {sortedSubscriptions.length === 0 ? (
          <div id="services-empty" className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No subscriptions yet' : `No ${filter} subscriptions`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'Start by adding your first service subscription to track usage and billing.'
                : `You don't have any ${filter} subscriptions at the moment.`
              }
            </p>
            {onNewSubscription && filter === 'all' && (
              <button
                onClick={onNewSubscription}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Your First Subscription
              </button>
            )}
          </div>
        ) : (
          <div id="services-grid" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSubscriptions.map(subscription => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={onEditSubscription}
                onCancel={handleCancelSubscription}
                onViewUsage={onViewUsage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
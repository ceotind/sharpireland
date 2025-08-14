'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import { logActivity } from '../../utils/activity-logger-client';

interface MetricData {
  id: string;
  metric_name: string;
  current_value: number;
  previous_value: number;
  timestamp: string;
  change_percentage: number;
}

interface RealTimeMetricsProps {
  userId: string;
}

export default function RealTimeMetrics({ userId }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    const setupRealtimeConnection = async () => {
      try {
        // Initial data fetch
        const { data: initialMetrics, error: fetchError } = await supabase
          .from('real_time_metrics')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(10);

        if (fetchError) {
          throw fetchError;
        }

        setMetrics(initialMetrics || []);
        setLoading(false);

        // Setup realtime subscription
        channel = supabase
          .channel('real-time-metrics')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'real_time_metrics',
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              console.log('Real-time update received:', payload);
              
              if (payload.eventType === 'INSERT') {
                setMetrics(prev => [payload.new as MetricData, ...prev.slice(0, 9)]);
              } else if (payload.eventType === 'UPDATE') {
                setMetrics(prev => 
                  prev.map(metric => 
                    metric.id === payload.new.id ? payload.new as MetricData : metric
                  )
                );
              }
            }
          )
          .subscribe((status: string) => {
            console.log('Realtime subscription status:', status);
            setIsConnected(status === 'SUBSCRIBED');
          });

        await logActivity({
          action: 'real_time_metrics_connected',
          description: 'Connected to real-time metrics',
          metadata: { component: 'RealTimeMetrics', connection_status: 'connected' }
        });

      } catch (err) {
        console.error('Error setting up realtime connection:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to real-time metrics');
        setLoading(false);
      }
    };

    setupRealtimeConnection();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, supabase]);

  const getMetricIcon = (metricName: string) => {
    switch (metricName.toLowerCase()) {
      case 'active_users':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case 'page_views':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      case 'conversion_rate':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatMetricName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatValue = (value: number, metricName: string) => {
    if (metricName.includes('rate') || metricName.includes('percentage')) {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="real-time-metrics-loading">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Metrics</h3>
        </div>
        <div className="space-y-4" id="metrics-loading-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse" id={`metric-skeleton-${i}`}>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6" id="real-time-metrics-error">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-red-600">Real-Time Metrics</h3>
        </div>
        <div className="text-red-600" id="metrics-error-message">
          <p>Error loading real-time metrics: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            id="metrics-retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="real-time-metrics-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Metrics</h3>
        </div>
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
          id="connection-status-badge"
        >
          {isConnected ? 'Live' : 'Disconnected'}
        </span>
      </div>

      {metrics.length === 0 ? (
        <div className="text-center py-8 text-gray-500" id="no-metrics-message">
          <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <p>No real-time metrics available</p>
          <p className="text-sm">Metrics will appear here as they are generated</p>
        </div>
      ) : (
        <div className="space-y-4" id="metrics-list">
          {metrics.map((metric, index) => (
            <div 
              key={metric.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              id={`metric-item-${index}`}
            >
              <div className="flex items-center gap-3" id={`metric-info-${index}`}>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  {getMetricIcon(metric.metric_name)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {formatMetricName(metric.metric_name)}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right" id={`metric-values-${index}`}>
                <div className="text-2xl font-bold text-gray-900">
                  {formatValue(metric.current_value, metric.metric_name)}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {metric.change_percentage > 0 ? (
                    <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : metric.change_percentage < 0 ? (
                    <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : null}
                  <span 
                    className={
                      metric.change_percentage > 0 
                        ? 'text-green-600' 
                        : metric.change_percentage < 0 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }
                  >
                    {metric.change_percentage > 0 ? '+' : ''}
                    {metric.change_percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
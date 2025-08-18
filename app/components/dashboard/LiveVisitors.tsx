'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { logActivity } from '../../utils/activity-logger-client';

interface VisitorData {
  id: string;
  session_id: string;
  user_agent: string;
  ip_address: string;
  location: {
    country?: string;
    city?: string;
    region?: string;
  } | null;
  current_page: string;
  referrer: string | null;
  is_active: boolean;
  last_seen: string;
  created_at: string;
}

interface LiveVisitorsProps {
  userId: string;
}

export default function LiveVisitors({ userId }: LiveVisitorsProps) {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupRealtimeConnection = async () => {
      try {
        // Initial data fetch for active visitors
        const { data: activeVisitors, error: fetchError } = await supabase
          .from('live_visitors')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('last_seen', { ascending: false })
          .limit(20);

        if (fetchError) {
          throw fetchError;
        }

        setVisitors(activeVisitors || []);
        setTotalVisitors(activeVisitors?.length || 0);
        setLoading(false);

        // Setup realtime subscription
        channel = supabase
          .channel('live-visitors')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'live_visitors',
              filter: `user_id=eq.${userId}`,
            },
            (payload: RealtimePostgresChangesPayload<VisitorData>) => {
              console.log('Live visitor update received:', payload);
              
              if (payload.eventType === 'INSERT') {
                const newVisitor = payload.new as VisitorData;
                if (newVisitor.is_active) {
                  setVisitors(prev => [newVisitor, ...prev.slice(0, 19)]);
                  setTotalVisitors(prev => prev + 1);
                }
              } else if (payload.eventType === 'UPDATE') {
                const updatedVisitor = payload.new as VisitorData;
                setVisitors(prev => 
                  prev.map(visitor => 
                    visitor.id === updatedVisitor.id ? updatedVisitor : visitor
                  ).filter(visitor => visitor.is_active)
                );
                
                if (!updatedVisitor.is_active) {
                  setTotalVisitors(prev => Math.max(0, prev - 1));
                }
              } else if (payload.eventType === 'DELETE') {
                setVisitors(prev => 
                  prev.filter(visitor => visitor.id !== payload.old.id)
                );
                setTotalVisitors(prev => Math.max(0, prev - 1));
              }
            }
          )
          .subscribe((status: string) => {
            console.log('Live visitors subscription status:', status);
            setIsConnected(status === 'SUBSCRIBED');
          });

        await logActivity({
          action: 'live_visitors_connected',
          description: 'Connected to live visitors tracking',
          metadata: { component: 'LiveVisitors', connection_status: 'connected' }
        });

      } catch (err) {
        console.error('Error setting up live visitors connection:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to live visitors');
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

  const getLocationString = (location: VisitorData['location']) => {
    if (!location) return 'Unknown';
    const parts = [location.city, location.region, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Unknown';
  };

  const getBrowserFromUserAgent = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="live-visitors-loading">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Live Visitors</h3>
        </div>
        <div className="space-y-4" id="visitors-loading-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse" id={`visitor-skeleton-${i}`}>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6" id="live-visitors-error">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-600">Live Visitors</h3>
        </div>
        <div className="text-red-600" id="visitors-error-message">
          <p>Error loading live visitors: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            id="visitors-retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="live-visitors-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Live Visitors</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{totalVisitors}</div>
            <div className="text-sm text-gray-500">Active now</div>
          </div>
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
            id="visitors-connection-status"
          >
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {visitors.length === 0 ? (
        <div className="text-center py-8 text-gray-500" id="no-visitors-message">
          <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <p>No active visitors</p>
          <p className="text-sm">Visitors will appear here when they visit your site</p>
        </div>
      ) : (
        <div className="space-y-3" id="visitors-list">
          {visitors.map((visitor, index) => (
            <div 
              key={visitor.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              id={`visitor-item-${index}`}
            >
              <div className="flex items-center gap-3" id={`visitor-info-${index}`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {getLocationString(visitor.location)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {getBrowserFromUserAgent(visitor.user_agent)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>On: </span>
                    <span className="font-mono text-xs bg-gray-200 px-1 rounded">
                      {visitor.current_page}
                    </span>
                  </div>
                  {visitor.referrer && (
                    <div className="text-xs text-gray-500">
                      From: {visitor.referrer}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-500" id={`visitor-time-${index}`}>
                <div>{getTimeAgo(visitor.last_seen)}</div>
                <div className="text-xs">
                  Session: {visitor.session_id.slice(0, 8)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {visitors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200" id="visitors-summary">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{totalVisitors}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {new Set(visitors.map(v => getLocationString(v.location))).size}
              </div>
              <div className="text-xs text-gray-500">Locations</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {new Set(visitors.map(v => v.current_page)).size}
              </div>
              <div className="text-xs text-gray-500">Pages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
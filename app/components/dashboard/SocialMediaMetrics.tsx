'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  followers: number;
  following: number;
  posts: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  growth_rate: number;
  last_updated: string;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  posted_at: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement_rate: number;
  media_type: 'text' | 'image' | 'video' | 'carousel';
}

interface SocialMediaMetricsProps {
  userId: string;
}

export default function SocialMediaMetrics({ userId }: SocialMediaMetricsProps) {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [recentPosts, setRecentPosts] = useState<SocialPost[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in a real app, this would come from social media APIs
  const mockPlatforms: SocialPlatform[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      followers: 12500,
      following: 450,
      posts: 156,
      engagement_rate: 3.2,
      reach: 45000,
      impressions: 125000,
      clicks: 2800,
      shares: 340,
      comments: 890,
      likes: 4200,
      growth_rate: 8.5,
      last_updated: new Date().toISOString()
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      followers: 8900,
      following: 320,
      posts: 89,
      engagement_rate: 4.8,
      reach: 32000,
      impressions: 89000,
      clicks: 1900,
      shares: 180,
      comments: 650,
      likes: 3100,
      growth_rate: 12.3,
      last_updated: new Date().toISOString()
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      followers: 5600,
      following: 890,
      posts: 234,
      engagement_rate: 2.1,
      reach: 18000,
      impressions: 56000,
      clicks: 1200,
      shares: 450,
      comments: 320,
      likes: 1800,
      growth_rate: 5.7,
      last_updated: new Date().toISOString()
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      followers: 3400,
      following: 150,
      posts: 45,
      engagement_rate: 5.2,
      reach: 12000,
      impressions: 28000,
      clicks: 890,
      shares: 120,
      comments: 180,
      likes: 950,
      growth_rate: 15.2,
      last_updated: new Date().toISOString()
    }
  ];

  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'facebook',
      content: 'Excited to announce our new product launch! 🚀',
      posted_at: '2024-01-15T10:00:00Z',
      likes: 245,
      comments: 32,
      shares: 18,
      reach: 3200,
      engagement_rate: 9.2,
      media_type: 'image'
    },
    {
      id: '2',
      platform: 'instagram',
      content: 'Behind the scenes of our latest photoshoot ✨',
      posted_at: '2024-01-14T15:30:00Z',
      likes: 189,
      comments: 24,
      shares: 12,
      reach: 2800,
      engagement_rate: 8.0,
      media_type: 'carousel'
    },
    {
      id: '3',
      platform: 'twitter',
      content: 'Just shared some insights on industry trends. What do you think?',
      posted_at: '2024-01-14T09:15:00Z',
      likes: 67,
      comments: 15,
      shares: 23,
      reach: 1200,
      engagement_rate: 8.8,
      media_type: 'text'
    },
    {
      id: '4',
      platform: 'linkedin',
      content: 'Thrilled to share our company milestone! Thank you to our amazing team.',
      posted_at: '2024-01-13T11:45:00Z',
      likes: 156,
      comments: 28,
      shares: 34,
      reach: 2100,
      engagement_rate: 10.4,
      media_type: 'text'
    }
  ];

  useEffect(() => {
    const loadSocialData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPlatforms(mockPlatforms);
        setRecentPosts(mockPosts);

        await logActivity({
          action: 'social_media_metrics_viewed',
          description: 'Viewed social media metrics',
          metadata: { 
            platforms_count: mockPlatforms.length,
            time_range: timeRange
          }
        });

      } catch (err) {
        console.error('Error loading social media data:', err);
        setError('Failed to load social media metrics');
      } finally {
        setLoading(false);
      }
    };

    loadSocialData();
  }, [timeRange, userId]);

  const handlePlatformChange = async (platform: string) => {
    setSelectedPlatform(platform);
    
    await logActivity({
      action: 'social_platform_selected',
      description: `Selected ${platform} platform`,
      metadata: { platform }
    });
  };

  const handleTimeRangeChange = async (range: '7d' | '30d' | '90d') => {
    setTimeRange(range);
    
    await logActivity({
      action: 'social_timerange_changed',
      description: `Changed social media time range to ${range}`,
      metadata: { time_range: range }
    });
  };

  const getTotalMetrics = () => {
    return platforms.reduce((totals, platform) => ({
      followers: totals.followers + platform.followers,
      posts: totals.posts + platform.posts,
      engagement: totals.engagement + platform.engagement_rate,
      reach: totals.reach + platform.reach,
      impressions: totals.impressions + platform.impressions
    }), { followers: 0, posts: 0, engagement: 0, reach: 0, impressions: 0 });
  };

  const getFilteredPosts = () => {
    if (selectedPlatform === 'all') return recentPosts;
    return recentPosts.filter(post => post.platform === selectedPlatform);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return 'text-green-600';
    if (rate >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) {
      return (
        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" id="social-media-loading">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" id="social-media-error">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Social Media Metrics</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totalMetrics = getTotalMetrics();
  const filteredPosts = getFilteredPosts();

  return (
    <div className="space-y-6" id="social-media-metrics-container">
      {/* Controls */}
      <div className="flex items-center justify-between" id="social-media-controls">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="platform-selector"
            >
              <option value="all">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="timerange-selector"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="platform-overview">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all ${
              selectedPlatform === platform.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:shadow-md'
            }`}
            onClick={() => handlePlatformChange(platform.id)}
            id={`platform-card-${platform.id}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{platform.icon}</span>
                <h3 className="font-semibold text-gray-900">{platform.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(platform.growth_rate)}
                <span className={`text-sm ${platform.growth_rate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {platform.growth_rate > 0 ? '+' : ''}{platform.growth_rate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Followers</span>
                <span className="font-semibold text-gray-900">{formatNumber(platform.followers)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Posts</span>
                <span className="font-semibold text-gray-900">{platform.posts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement</span>
                <span className={`font-semibold ${getEngagementColor(platform.engagement_rate)}`}>
                  {platform.engagement_rate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reach</span>
                <span className="font-semibold text-gray-900">{formatNumber(platform.reach)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="social-summary-stats">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedPlatform === 'all' ? 'Total Performance' : `${platforms.find(p => p.id === selectedPlatform)?.name} Performance`}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(totalMetrics.followers)}</div>
            <div className="text-sm text-gray-600">Total Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalMetrics.posts}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(totalMetrics.reach)}</div>
            <div className="text-sm text-gray-600">Total Reach</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(totalMetrics.impressions)}</div>
            <div className="text-sm text-gray-600">Total Impressions</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getEngagementColor(totalMetrics.engagement / platforms.length)}`}>
              {(totalMetrics.engagement / platforms.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Engagement</div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="recent-posts">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No posts found for the selected platform</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4" id={`post-${post.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {platforms.find(p => p.id === post.platform)?.icon}
                    </span>
                    <span className="font-medium text-gray-900">
                      {platforms.find(p => p.id === post.platform)?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.posted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(post.engagement_rate)} bg-gray-100`}>
                    {post.engagement_rate.toFixed(1)}% engagement
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{post.content}</p>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{post.likes}</div>
                    <div className="text-gray-600">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{post.comments}</div>
                    <div className="text-gray-600">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{post.shares}</div>
                    <div className="text-gray-600">Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{formatNumber(post.reach)}</div>
                    <div className="text-gray-600">Reach</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
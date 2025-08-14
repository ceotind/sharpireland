import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const startDate = getStartDate(period);

    // Get analytics snapshots for the user
    const { data: snapshots, error } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analytics snapshots:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
    }

    // Process and aggregate the data
    const overview = processOverviewData(snapshots || [], period);

    return NextResponse.json({ overview });
  } catch (error) {
    console.error('Unexpected error in GET /api/analytics/overview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get start date based on period
function getStartDate(period: string): Date {
  const now = new Date();
  
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

// Helper function to process overview data
function processOverviewData(snapshots: any[], period: string) {
  const now = new Date();
  const startDate = getStartDate(period);
  
  // Group snapshots by metric type
  const metricGroups = snapshots.reduce((groups, snapshot) => {
    const type = snapshot.metric_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(snapshot);
    return groups;
  }, {} as Record<string, any[]>);

  // Calculate overview metrics
  const overview = {
    period,
    date_range: {
      start: startDate.toISOString(),
      end: now.toISOString()
    },
    summary: {
      total_visitors: 0,
      page_views: 0,
      bounce_rate: 0,
      avg_session_duration: 0,
      conversion_rate: 0,
      seo_score: 0,
      social_engagement: 0,
      revenue: 0
    },
    trends: {
      visitors: generateTrendData(metricGroups.website || [], 'visitors', period),
      page_views: generateTrendData(metricGroups.website || [], 'page_views', period),
      seo_score: generateTrendData(metricGroups.seo || [], 'score', period),
      conversion_rate: generateTrendData(metricGroups.conversion || [], 'rate', period)
    },
    top_pages: extractTopPages(metricGroups.website || []),
    traffic_sources: extractTrafficSources(metricGroups.marketing || []),
    devices: extractDeviceData(metricGroups.website || []),
    locations: extractLocationData(metricGroups.website || [])
  };

  // Calculate summary metrics from latest snapshots
  const latestWebsite = metricGroups.website?.[0];
  const latestSEO = metricGroups.seo?.[0];
  const latestConversion = metricGroups.conversion?.[0];
  const latestSocial = metricGroups.social?.[0];

  if (latestWebsite?.metric_data) {
    overview.summary.total_visitors = latestWebsite.metric_data.visitors || 0;
    overview.summary.page_views = latestWebsite.metric_data.page_views || 0;
    overview.summary.bounce_rate = latestWebsite.metric_data.bounce_rate || 0;
    overview.summary.avg_session_duration = latestWebsite.metric_data.avg_session_duration || 0;
  }

  if (latestSEO?.metric_data) {
    overview.summary.seo_score = latestSEO.metric_data.score || 0;
  }

  if (latestConversion?.metric_data) {
    overview.summary.conversion_rate = latestConversion.metric_data.rate || 0;
    overview.summary.revenue = latestConversion.metric_data.revenue || 0;
  }

  if (latestSocial?.metric_data) {
    overview.summary.social_engagement = latestSocial.metric_data.engagement || 0;
  }

  return overview;
}

// Helper function to generate trend data
function generateTrendData(snapshots: any[], metric: string, period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Find snapshot for this date
    const snapshot = snapshots.find(s => 
      s.created_at.split('T')[0] === dateStr
    );
    
    data.push({
      date: dateStr,
      value: snapshot?.metric_data?.[metric] || 0
    });
  }
  
  return data;
}

// Helper function to extract top pages
function extractTopPages(snapshots: any[]) {
  if (!snapshots.length) return [];
  
  const latest = snapshots[0];
  return latest.metric_data?.top_pages || [
    { path: '/', views: 1250, title: 'Home' },
    { path: '/services', views: 890, title: 'Services' },
    { path: '/about', views: 650, title: 'About' },
    { path: '/contact', views: 420, title: 'Contact' },
    { path: '/blog', views: 380, title: 'Blog' }
  ];
}

// Helper function to extract traffic sources
function extractTrafficSources(snapshots: any[]) {
  if (!snapshots.length) return [];
  
  const latest = snapshots[0];
  return latest.metric_data?.traffic_sources || [
    { source: 'Organic Search', visitors: 2100, percentage: 45 },
    { source: 'Direct', visitors: 1200, percentage: 26 },
    { source: 'Social Media', visitors: 800, percentage: 17 },
    { source: 'Referral', visitors: 350, percentage: 8 },
    { source: 'Email', visitors: 200, percentage: 4 }
  ];
}

// Helper function to extract device data
function extractDeviceData(snapshots: any[]) {
  if (!snapshots.length) return [];
  
  const latest = snapshots[0];
  return latest.metric_data?.devices || [
    { device: 'Desktop', visitors: 2800, percentage: 60 },
    { device: 'Mobile', visitors: 1400, percentage: 30 },
    { device: 'Tablet', visitors: 470, percentage: 10 }
  ];
}

// Helper function to extract location data
function extractLocationData(snapshots: any[]) {
  if (!snapshots.length) return [];
  
  const latest = snapshots[0];
  return latest.metric_data?.locations || [
    { country: 'Ireland', visitors: 1200, percentage: 26 },
    { country: 'United Kingdom', visitors: 950, percentage: 20 },
    { country: 'United States', visitors: 850, percentage: 18 },
    { country: 'Germany', visitors: 600, percentage: 13 },
    { country: 'France', visitors: 470, percentage: 10 },
    { country: 'Other', visitors: 600, percentage: 13 }
  ];
}
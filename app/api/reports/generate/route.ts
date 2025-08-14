import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../utils/activity-logger';

interface ReportConfig {
  type: 'analytics' | 'projects' | 'team' | 'financial' | 'custom';
  title: string;
  description?: string;
  date_range: {
    start: string;
    end: string;
  };
  metrics: string[];
  filters?: Record<string, any>;
  format: 'json' | 'csv' | 'pdf';
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ReportData {
  id: string;
  title: string;
  type: string;
  data: any[];
  metadata: {
    generated_at: string;
    date_range: {
      start: string;
      end: string;
    };
    total_records: number;
    filters_applied: Record<string, any>;
  };
  summary: {
    key_metrics: Record<string, number>;
    trends: Record<string, number>;
    insights: string[];
  };
}

// POST /api/reports/generate - Generate a new report
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const config: ReportConfig = body;

    // Validate required fields
    if (!config.type || !config.title || !config.date_range || !config.metrics || !config.format) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, date_range, metrics, format' },
        { status: 400 }
      );
    }

    // Validate date range
    const startDate = new Date(config.date_range.start);
    const endDate = new Date(config.date_range.end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Generate report based on type
    let reportData: any[] = [];
    let keyMetrics: Record<string, number> = {};
    let trends: Record<string, number> = {};
    let insights: string[] = [];

    switch (config.type) {
      case 'analytics':
        reportData = await generateAnalyticsReport(supabase, user.id, config);
        keyMetrics = calculateAnalyticsMetrics(reportData);
        trends = calculateAnalyticsTrends(reportData);
        insights = generateAnalyticsInsights(reportData, keyMetrics, trends);
        break;

      case 'projects':
        reportData = await generateProjectsReport(supabase, user.id, config);
        keyMetrics = calculateProjectsMetrics(reportData);
        trends = calculateProjectsTrends(reportData);
        insights = generateProjectsInsights(reportData, keyMetrics, trends);
        break;

      case 'team':
        reportData = await generateTeamReport(supabase, user.id, config);
        keyMetrics = calculateTeamMetrics(reportData);
        trends = calculateTeamTrends(reportData);
        insights = generateTeamInsights(reportData, keyMetrics, trends);
        break;

      case 'financial':
        reportData = await generateFinancialReport(supabase, user.id, config);
        keyMetrics = calculateFinancialMetrics(reportData);
        trends = calculateFinancialTrends(reportData);
        insights = generateFinancialInsights(reportData, keyMetrics, trends);
        break;

      case 'custom':
        reportData = await generateCustomReport(supabase, user.id, config);
        keyMetrics = calculateCustomMetrics(reportData, config.metrics);
        trends = calculateCustomTrends(reportData);
        insights = generateCustomInsights(reportData, keyMetrics, trends);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    // Create report record
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const report: ReportData = {
      id: reportId,
      title: config.title,
      type: config.type,
      data: reportData,
      metadata: {
        generated_at: new Date().toISOString(),
        date_range: config.date_range,
        total_records: reportData.length,
        filters_applied: config.filters || {}
      },
      summary: {
        key_metrics: keyMetrics,
        trends: trends,
        insights: insights
      }
    };

    // Save report to database
    const { error: saveError } = await supabase
      .from('generated_reports')
      .insert({
        id: reportId,
        user_id: user.id,
        title: config.title,
        type: config.type,
        config: config,
        data: report,
        format: config.format,
        status: 'completed'
      });

    if (saveError) {
      console.error('Error saving report:', saveError);
      // Continue anyway, return the generated report
    }

    // Log the activity
    await logActivity(
      {
        action: 'report.generate',
        entity_type: 'report',
        entity_id: reportId,
        description: `Generated ${config.type} report: ${config.title}`,
        metadata: { 
          report_type: config.type,
          report_title: config.title,
          format: config.format,
          metrics_count: config.metrics.length,
          records_count: reportData.length
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    // Format response based on requested format
    if (config.format === 'csv') {
      const csv = convertToCSV(reportData);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${config.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv"`
        }
      });
    } else if (config.format === 'pdf') {
      // In a real implementation, you would generate a PDF here
      return NextResponse.json({
        message: 'PDF generation not implemented yet',
        report_id: reportId,
        download_url: `/api/reports/${reportId}/download`
      });
    }

    return NextResponse.json({
      data: report,
      message: 'Report generated successfully'
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/reports/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for generating different types of reports
async function generateAnalyticsReport(supabase: any, userId: string, config: ReportConfig) {
  // Mock analytics data - in a real app, this would query actual analytics tables
  const mockData = [
    { date: '2024-01-01', page_views: 1250, unique_visitors: 890, bounce_rate: 0.35, avg_session_duration: 180 },
    { date: '2024-01-02', page_views: 1340, unique_visitors: 920, bounce_rate: 0.32, avg_session_duration: 195 },
    { date: '2024-01-03', page_views: 1180, unique_visitors: 850, bounce_rate: 0.38, avg_session_duration: 165 },
    { date: '2024-01-04', page_views: 1420, unique_visitors: 980, bounce_rate: 0.29, avg_session_duration: 210 },
    { date: '2024-01-05', page_views: 1380, unique_visitors: 950, bounce_rate: 0.31, avg_session_duration: 200 }
  ];

  return mockData.filter(item => {
    const itemDate = new Date(item.date);
    const startDate = new Date(config.date_range.start);
    const endDate = new Date(config.date_range.end);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

async function generateProjectsReport(supabase: any, userId: string, config: ReportConfig) {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', config.date_range.start)
    .lte('created_at', config.date_range.end);

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return projects || [];
}

async function generateTeamReport(supabase: any, userId: string, config: ReportConfig) {
  // Mock team data
  const mockData = [
    { member_name: 'John Doe', role: 'Developer', tasks_completed: 15, hours_logged: 120, productivity_score: 0.85 },
    { member_name: 'Jane Smith', role: 'Designer', tasks_completed: 12, hours_logged: 100, productivity_score: 0.90 },
    { member_name: 'Mike Johnson', role: 'Manager', tasks_completed: 8, hours_logged: 80, productivity_score: 0.75 }
  ];

  return mockData;
}

async function generateFinancialReport(supabase: any, userId: string, config: ReportConfig) {
  // Mock financial data
  const mockData = [
    { date: '2024-01-01', revenue: 5000, expenses: 2000, profit: 3000, margin: 0.6 },
    { date: '2024-01-02', revenue: 5500, expenses: 2200, profit: 3300, margin: 0.6 },
    { date: '2024-01-03', revenue: 4800, expenses: 1900, profit: 2900, margin: 0.6 }
  ];

  return mockData;
}

async function generateCustomReport(supabase: any, userId: string, config: ReportConfig) {
  // For custom reports, return mock data based on requested metrics
  const mockData = config.metrics.map((metric, index) => ({
    metric: metric,
    value: Math.floor(Math.random() * 1000) + 100,
    change: (Math.random() - 0.5) * 0.2,
    date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));

  return mockData;
}

// Helper functions for calculating metrics and insights
function calculateAnalyticsMetrics(data: any[]) {
  const totalPageViews = data.reduce((sum, item) => sum + item.page_views, 0);
  const totalVisitors = data.reduce((sum, item) => sum + item.unique_visitors, 0);
  const avgBounceRate = data.reduce((sum, item) => sum + item.bounce_rate, 0) / data.length;
  const avgSessionDuration = data.reduce((sum, item) => sum + item.avg_session_duration, 0) / data.length;

  return {
    total_page_views: totalPageViews,
    total_unique_visitors: totalVisitors,
    average_bounce_rate: avgBounceRate,
    average_session_duration: avgSessionDuration
  };
}

function calculateAnalyticsTrends(data: any[]) {
  if (data.length < 2) return {};

  const firstDay = data[0];
  const lastDay = data[data.length - 1];

  return {
    page_views_trend: ((lastDay.page_views - firstDay.page_views) / firstDay.page_views) * 100,
    visitors_trend: ((lastDay.unique_visitors - firstDay.unique_visitors) / firstDay.unique_visitors) * 100,
    bounce_rate_trend: ((lastDay.bounce_rate - firstDay.bounce_rate) / firstDay.bounce_rate) * 100
  };
}

function generateAnalyticsInsights(data: any[], metrics: any, trends: any) {
  const insights = [];

  if (trends.page_views_trend > 10) {
    insights.push('Page views are trending upward significantly (+' + trends.page_views_trend.toFixed(1) + '%)');
  } else if (trends.page_views_trend < -10) {
    insights.push('Page views are declining (-' + Math.abs(trends.page_views_trend).toFixed(1) + '%)');
  }

  if (metrics.average_bounce_rate > 0.5) {
    insights.push('Bounce rate is high (' + (metrics.average_bounce_rate * 100).toFixed(1) + '%), consider improving page content');
  }

  if (metrics.average_session_duration > 300) {
    insights.push('Users are highly engaged with average session duration of ' + Math.floor(metrics.average_session_duration / 60) + ' minutes');
  }

  return insights;
}

// Similar helper functions for other report types (simplified for brevity)
function calculateProjectsMetrics(data: any[]) {
  return {
    total_projects: data.length,
    active_projects: data.filter(p => p.status === 'active').length,
    completed_projects: data.filter(p => p.status === 'completed').length,
    average_budget: data.reduce((sum, p) => sum + (p.budget_allocated || 0), 0) / data.length
  };
}

function calculateProjectsTrends(data: any[]) {
  return { completion_rate: data.filter(p => p.status === 'completed').length / data.length * 100 };
}

function generateProjectsInsights(data: any[], metrics: any, trends: any) {
  const insights = [];
  if (trends.completion_rate > 80) {
    insights.push('High project completion rate (' + trends.completion_rate.toFixed(1) + '%)');
  }
  return insights;
}

function calculateTeamMetrics(data: any[]) {
  return {
    total_members: data.length,
    total_tasks_completed: data.reduce((sum, m) => sum + m.tasks_completed, 0),
    average_productivity: data.reduce((sum, m) => sum + m.productivity_score, 0) / data.length
  };
}

function calculateTeamTrends(data: any[]) {
  return { productivity_trend: 5.2 }; // Mock trend
}

function generateTeamInsights(data: any[], metrics: any, trends: any) {
  return ['Team productivity is above average'];
}

function calculateFinancialMetrics(data: any[]) {
  return {
    total_revenue: data.reduce((sum, item) => sum + item.revenue, 0),
    total_expenses: data.reduce((sum, item) => sum + item.expenses, 0),
    total_profit: data.reduce((sum, item) => sum + item.profit, 0)
  };
}

function calculateFinancialTrends(data: any[]) {
  return { profit_margin_trend: 2.1 }; // Mock trend
}

function generateFinancialInsights(data: any[], metrics: any, trends: any) {
  return ['Revenue is growing steadily'];
}

function calculateCustomMetrics(data: any[], metrics: string[]) {
  const result: Record<string, number> = {};
  metrics.forEach(metric => {
    result[metric] = data.reduce((sum, item) => sum + (item.value || 0), 0);
  });
  return result;
}

function calculateCustomTrends(data: any[]) {
  return { overall_trend: 3.5 }; // Mock trend
}

function generateCustomInsights(data: any[], metrics: any, trends: any) {
  return ['Custom metrics show positive trends'];
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}
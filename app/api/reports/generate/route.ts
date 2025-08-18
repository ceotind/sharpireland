import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
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
  filters?: Record<string, unknown>;
  format: 'json' | 'csv' | 'pdf';
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
interface AnalyticsReportItem {
  date: string;
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
}

interface Project {
  status: string;
  budget_allocated?: number;
}

interface TeamReportItem {
  member_name: string;
  role: string;
  tasks_completed: number;
  hours_logged: number;
  productivity_score: number;
}

interface FinancialReportItem {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
}

interface CustomReportItem {
  metric: string;
  value: number;
  change: number;
  date: string;
}

interface ReportData {
  id: string;
  title: string;
  type: string;
  data: unknown[];
  metadata: {
    generated_at: string;
    date_range: {
      start: string;
      end: string;
    };
    total_records: number;
    filters_applied: Record<string, unknown>;
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
    let reportData: unknown[] = [];
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
async function generateAnalyticsReport(_supabase: SupabaseClient, _userId: string, config: ReportConfig): Promise<unknown[]> {
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

async function generateProjectsReport(supabase: SupabaseClient, userId: string, config: ReportConfig): Promise<unknown[]> {
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

async function generateTeamReport(_supabase: SupabaseClient, _userId: string, _config: ReportConfig): Promise<unknown[]> {
  // Mock team data
  const mockData = [
    { member_name: 'John Doe', role: 'Developer', tasks_completed: 15, hours_logged: 120, productivity_score: 0.85 },
    { member_name: 'Jane Smith', role: 'Designer', tasks_completed: 12, hours_logged: 100, productivity_score: 0.90 },
    { member_name: 'Mike Johnson', role: 'Manager', tasks_completed: 8, hours_logged: 80, productivity_score: 0.75 }
  ];

  return mockData;
}

async function generateFinancialReport(_supabase: SupabaseClient, _userId: string, _config: ReportConfig): Promise<unknown[]> {
  // Mock financial data
  const mockData = [
    { date: '2024-01-01', revenue: 5000, expenses: 2000, profit: 3000, margin: 0.6 },
    { date: '2024-01-02', revenue: 5500, expenses: 2200, profit: 3300, margin: 0.6 },
    { date: '2024-01-03', revenue: 4800, expenses: 1900, profit: 2900, margin: 0.6 }
  ];

  return mockData;
}

async function generateCustomReport(_supabase: SupabaseClient, _userId: string, config: ReportConfig): Promise<unknown[]> {
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
function calculateAnalyticsMetrics(data: unknown[]) {
  const analyticsData = data as AnalyticsReportItem[];
  const totalPageViews = analyticsData.reduce((sum, item) => sum + item.page_views, 0);
  const totalVisitors = analyticsData.reduce((sum, item) => sum + item.unique_visitors, 0);
  const avgBounceRate = analyticsData.reduce((sum, item) => sum + item.bounce_rate, 0) / analyticsData.length;
  const avgSessionDuration = analyticsData.reduce((sum, item) => sum + item.avg_session_duration, 0) / analyticsData.length;

  return {
    total_page_views: totalPageViews,
    total_unique_visitors: totalVisitors,
    average_bounce_rate: avgBounceRate,
    average_session_duration: avgSessionDuration
  };
}

function calculateAnalyticsTrends(data: unknown[]) {
  const analyticsData = data as AnalyticsReportItem[];
  if (analyticsData.length < 2) return {};

  const firstDay = analyticsData[0];
  const lastDay = analyticsData[analyticsData.length - 1];

  return {
    page_views_trend: ((lastDay!.page_views - firstDay!.page_views) / firstDay!.page_views) * 100,
    visitors_trend: ((lastDay!.unique_visitors - firstDay!.unique_visitors) / firstDay!.unique_visitors) * 100,
    bounce_rate_trend: ((lastDay!.bounce_rate - firstDay!.bounce_rate) / firstDay!.bounce_rate) * 100
  };
}

function generateAnalyticsInsights(_data: unknown[], metrics: Record<string, number>, trends: Record<string, number>) {
  
  const insights = [];

  if (trends.page_views_trend !== undefined && trends.page_views_trend > 10) {
    insights.push('Page views are trending upward significantly (+' + trends.page_views_trend.toFixed(1) + '%)');
  } else if (trends.page_views_trend !== undefined && trends.page_views_trend < -10) {
    insights.push('Page views are declining (-' + Math.abs(trends.page_views_trend).toFixed(1) + '%)');
  }

  if (metrics.average_bounce_rate !== undefined && metrics.average_bounce_rate > 0.5) {
    insights.push('Bounce rate is high (' + (metrics.average_bounce_rate * 100).toFixed(1) + '%), consider improving page content');
  }

  if (metrics.average_session_duration !== undefined && metrics.average_session_duration > 300) {
    insights.push('Users are highly engaged with average session duration of ' + Math.floor(metrics.average_session_duration / 60) + ' minutes');
  }

  return insights;
}

// Similar helper functions for other report types (simplified for brevity)
function calculateProjectsMetrics(data: unknown[]) {
  const projectsData = data as Project[];
  return {
    total_projects: projectsData.length,
    active_projects: projectsData.filter(p => p.status === 'active').length,
    completed_projects: projectsData.filter(p => p.status === 'completed').length,
    average_budget: projectsData.reduce((sum, p) => sum + (p.budget_allocated || 0), 0) / projectsData.length
  };
}

function calculateProjectsTrends(data: unknown[]) {
  const projectsData = data as Project[];
  return { completion_rate: projectsData.filter(p => p.status === 'completed').length / projectsData.length * 100 };
}

function generateProjectsInsights(_data: unknown[], _metrics: Record<string, number>, trends: Record<string, number>) {
  
  const insights = [];
  if (trends.completion_rate !== undefined && trends.completion_rate > 80) {
    insights.push('High project completion rate (' + trends.completion_rate.toFixed(1) + '%)');
  }
  return insights;
}

function calculateTeamMetrics(data: unknown[]) {
  const teamData = data as TeamReportItem[];
  return {
    total_members: teamData.length,
    total_tasks_completed: teamData.reduce((sum, m) => sum + m.tasks_completed, 0),
    average_productivity: teamData.reduce((sum, m) => sum + m.productivity_score, 0) / teamData.length
  };
}

function calculateTeamTrends(_data: unknown[]) {

  return { productivity_trend: 5.2 }; // Mock trend
}

function generateTeamInsights(_data: unknown[], _metrics: Record<string, number>, _trends: Record<string, number>) {

  return ['Team productivity is above average'];
}

function calculateFinancialMetrics(data: unknown[]) {
  const financialData = data as FinancialReportItem[];
  return {
    total_revenue: financialData.reduce((sum, item) => sum + item.revenue, 0),
    total_expenses: financialData.reduce((sum, item) => sum + item.expenses, 0),
    total_profit: financialData.reduce((sum, item) => sum + item.profit, 0)
  };
}

function calculateFinancialTrends(_data: unknown[]) {
  
  return { profit_margin_trend: 2.1 }; // Mock trend
}

function generateFinancialInsights(_data: unknown[], _metrics: Record<string, number>, _trends: Record<string, number>) {
  
  return ['Revenue is growing steadily'];
}

function calculateCustomMetrics(data: unknown[], metrics: string[]) {
  const customData = data as CustomReportItem[];
  const result: Record<string, number> = {};
  metrics.forEach(metric => {
    result[metric] = customData.reduce((sum, item) => sum + (item.value || 0), 0);
  });
  return result;
}

function calculateCustomTrends(_data: unknown[]) {
  
  return { overall_trend: 3.5 }; // Mock trend
}

function generateCustomInsights(_data: unknown[], _metrics: Record<string, number>, _trends: Record<string, number>) {
  
  return ['Custom metrics show positive trends'];
}

function convertToCSV(data: unknown[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = (row as Record<string, unknown>)[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../utils/activity-logger';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const url = searchParams.get('url');

    // Build query
    let query = supabase
      .from('seo_reports')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Add URL filter if provided
    if (url) {
      query = query.ilike('url', `%${url}%`);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Error fetching SEO reports:', error);
      return NextResponse.json({ error: 'Failed to fetch SEO reports' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'seo_reports.list',
        description: `Viewed SEO reports list (page ${page})`
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      reports: reports || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/seo-reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, score, report_data, improvements } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Validate score if provided
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
      return NextResponse.json({ error: 'Score must be a number between 0 and 100' }, { status: 400 });
    }

    // Create new SEO report
    const { data: report, error } = await supabase
      .from('seo_reports')
      .insert({
        user_id: user.id,
        url: url.trim(),
        score: score || null,
        report_data: report_data || null,
        improvements: improvements || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating SEO report:', error);
      return NextResponse.json({ error: 'Failed to create SEO report' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'seo_reports.create',
        entity_type: 'seo_report',
        entity_id: report.id,
        description: `Created SEO report for ${url}`,
        metadata: { url, score }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/seo-reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
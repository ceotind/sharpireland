import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../utils/activity-logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid report ID format' }, { status: 400 });
    }

    // Get the SEO report
    const { data: report, error } = await supabase
      .from('seo_reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'SEO report not found' }, { status: 404 });
      }
      console.error('Error fetching SEO report:', error);
      return NextResponse.json({ error: 'Failed to fetch SEO report' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'seo_reports.view',
        entity_type: 'seo_report',
        entity_id: report.id,
        description: `Viewed SEO report for ${report.url}`,
        metadata: { url: report.url, score: report.score }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Unexpected error in GET /api/seo-reports/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid report ID format' }, { status: 400 });
    }

    // First, get the report to log the deletion
    const { data: report, error: fetchError } = await supabase
      .from('seo_reports')
      .select('url, score')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'SEO report not found' }, { status: 404 });
      }
      console.error('Error fetching SEO report for deletion:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch SEO report' }, { status: 500 });
    }

    // Delete the SEO report
    const { error: deleteError } = await supabase
      .from('seo_reports')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting SEO report:', deleteError);
      return NextResponse.json({ error: 'Failed to delete SEO report' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'seo_reports.delete',
        entity_type: 'seo_report',
        entity_id: id,
        description: `Deleted SEO report for ${report.url}`,
        metadata: { url: report.url, score: report.score }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ message: 'SEO report deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/seo-reports/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { url, score, report_data, improvements } = body;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid report ID format' }, { status: 400 });
    }

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }
    }

    // Validate score if provided
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
      return NextResponse.json({ error: 'Score must be a number between 0 and 100' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {};
    if (url !== undefined) updateData.url = url.trim();
    if (score !== undefined) updateData.score = score;
    if (report_data !== undefined) updateData.report_data = report_data;
    if (improvements !== undefined) updateData.improvements = improvements;

    // Only proceed if there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update the SEO report
    const { data: report, error } = await supabase
      .from('seo_reports')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'SEO report not found' }, { status: 404 });
      }
      console.error('Error updating SEO report:', error);
      return NextResponse.json({ error: 'Failed to update SEO report' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'seo_reports.update',
        entity_type: 'seo_report',
        entity_id: report.id,
        description: `Updated SEO report for ${report.url}`,
        metadata: { 
          url: report.url, 
          score: report.score,
          updated_fields: Object.keys(updateData)
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Unexpected error in PUT /api/seo-reports/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
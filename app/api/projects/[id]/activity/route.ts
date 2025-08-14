import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // First verify the project belongs to the user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error verifying project ownership:', projectError);
      return NextResponse.json({ error: 'Failed to verify project' }, { status: 500 });
    }

    // Get project activity from activity_logs
    const { data: activities, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', 'project')
      .eq('entity_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching project activity:', error);
      return NextResponse.json({ error: 'Failed to fetch project activity' }, { status: 500 });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('entity_type', 'project')
      .eq('entity_id', id);

    if (countError) {
      console.error('Error counting project activity:', countError);
      return NextResponse.json({ error: 'Failed to count project activity' }, { status: 500 });
    }

    return NextResponse.json({
      activities,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/projects/[id]/activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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
    const { activity_type, description, metadata } = body;

    // Validate required fields
    if (!activity_type || !description) {
      return NextResponse.json(
        { error: 'Activity type and description are required' },
        { status: 400 }
      );
    }

    // First verify the project belongs to the user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error verifying project ownership:', projectError);
      return NextResponse.json({ error: 'Failed to verify project' }, { status: 500 });
    }

    // Create project activity in activity_logs
    const { data: activity, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: activity_type,
        entity_type: 'project',
        entity_id: id,
        description,
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project activity:', error);
      return NextResponse.json({ error: 'Failed to create project activity' }, { status: 500 });
    }

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/projects/[id]/activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
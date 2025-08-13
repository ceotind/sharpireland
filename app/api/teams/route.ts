import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../utils/activity-logger';

// GET /api/teams - Get all teams for the authenticated user
export async function GET(request: NextRequest) {
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

    // Get teams where user is owner or member
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select(`
        *,
        team_members!inner(
          id,
          role,
          joined_at
        )
      `)
      .eq('team_members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'teams.list',
        description: 'Retrieved teams list',
        metadata: { teams_count: teams?.length || 0 }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: teams || [],
      count: teams?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/teams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
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
    const { name, description, settings } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Team name must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        owner_id: user.id,
        settings: settings || null
      })
      .select()
      .single();

    if (teamError) {
      console.error('Error creating team:', teamError);
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      );
    }

    // Add the creator as the first team member with owner role
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
        permissions: {
          can_manage_members: true,
          can_manage_projects: true,
          can_view_analytics: true,
          can_manage_settings: true
        }
      });

    if (memberError) {
      console.error('Error adding team owner as member:', memberError);
      // Try to clean up the team if member creation failed
      await supabase.from('teams').delete().eq('id', team.id);
      return NextResponse.json(
        { error: 'Failed to create team membership' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'teams.create',
        entity_type: 'team',
        entity_id: team.id,
        description: `Created team: ${team.name}`,
        metadata: { team_name: team.name }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: team,
      message: 'Team created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/teams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
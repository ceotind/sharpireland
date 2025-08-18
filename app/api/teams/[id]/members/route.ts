import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../../utils/activity-logger';

// GET /api/teams/[id]/members - Get all members of a team
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const teamId = params.id;

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a member of this team
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role, permissions')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Access denied. You are not a member of this team.' },
        { status: 403 }
      );
    }

    // Get all team members with user profiles
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        permissions,
        joined_at,
        user_profiles!inner(
          id,
          username,
          full_name,
          avatar_url,
          company,
          role as user_role
        )
      `)
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'teams.members.list',
        entity_type: 'team',
        entity_id: teamId,
        description: 'Retrieved team members list',
        metadata: { members_count: members?.length || 0 }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: members || [],
      count: members?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/teams/[id]/members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/teams/[id]/members - Add a new member to the team
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const teamId = params.id;

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to manage members
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role, permissions')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Access denied. You are not a member of this team.' },
        { status: 403 }
      );
    }

    // Check if user can manage members
    const canManageMembers = membership.role === 'owner' || 
      (membership.permissions && membership.permissions.can_manage_members);

    if (!canManageMembers) {
      return NextResponse.json(
        { error: 'Access denied. You do not have permission to manage team members.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, role = 'member', permissions } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['member', 'admin', 'owner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: member, admin, owner' },
        { status: 400 }
      );
    }

    // Only owners can add other owners
    if (role === 'owner' && membership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only team owners can add other owners' },
        { status: 403 }
      );
    }

    // Find user by email
    const { data: targetUser, error: userError } = await supabase
      .from('user_profiles')
      .select('id, username, full_name, avatar_url')
      .ilike('username', email) // Assuming username is email or we need to add email field
      .single();

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: 'User not found with that email' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const { data: existingMember, error: _existingError } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', targetUser.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this team' },
        { status: 409 }
      );
    }

    // Set default permissions based on role
    let defaultPermissions = {
      can_manage_members: false,
      can_manage_projects: false,
      can_view_analytics: true,
      can_manage_settings: false
    };

    if (role === 'admin') {
      defaultPermissions = {
        can_manage_members: true,
        can_manage_projects: true,
        can_view_analytics: true,
        can_manage_settings: false
      };
    } else if (role === 'owner') {
      defaultPermissions = {
        can_manage_members: true,
        can_manage_projects: true,
        can_view_analytics: true,
        can_manage_settings: true
      };
    }

    // Add the new member
    const { data: newMember, error: addError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: targetUser.id,
        role,
        permissions: permissions || defaultPermissions
      })
      .select(`
        id,
        role,
        permissions,
        joined_at,
        user_profiles!inner(
          id,
          username,
          full_name,
          avatar_url,
          company,
          role as user_role
        )
      `)
      .single();

    if (addError) {
      console.error('Error adding team member:', addError);
      return NextResponse.json(
        { error: 'Failed to add team member' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'teams.members.add',
        entity_type: 'team',
        entity_id: teamId,
        description: `Added ${targetUser.full_name || targetUser.username} to team as ${role}`,
        metadata: { 
          added_user_id: targetUser.id,
          added_user_name: targetUser.full_name || targetUser.username,
          role 
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: newMember,
      message: 'Team member added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/teams/[id]/members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/[id]/members - Remove a member from the team
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const teamId = params.id;

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get member ID from query params
    const { searchParams } = new URL(request.url);
    const memberUserId = searchParams.get('userId');

    if (!memberUserId) {
      return NextResponse.json(
        { error: 'Member user ID is required' },
        { status: 400 }
      );
    }

    // Check if user has permission to manage members
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role, permissions')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Access denied. You are not a member of this team.' },
        { status: 403 }
      );
    }

    // Get the target member's info
    const { data: targetMember, error: targetError } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        user_profiles!inner(
          id,
          username,
          full_name
        )
      `)
      .eq('team_id', teamId)
      .eq('user_id', memberUserId)
      .single();

    if (targetError || !targetMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const canManageMembers = membership.role === 'owner' || 
      (membership.permissions && membership.permissions.can_manage_members);

    // Users can remove themselves (leave team)
    const isSelfRemoval = user.id === memberUserId;

    if (!canManageMembers && !isSelfRemoval) {
      return NextResponse.json(
        { error: 'Access denied. You do not have permission to remove team members.' },
        { status: 403 }
      );
    }

    // Prevent removing the last owner
    if (targetMember.role === 'owner') {
      const { data: ownerCount, error: ownerCountError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('role', 'owner');

      if (ownerCountError || (ownerCount && ownerCount.length <= 1)) {
        return NextResponse.json(
          { error: 'Cannot remove the last owner of the team' },
          { status: 400 }
        );
      }
    }

    // Remove the member
    const { error: removeError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', memberUserId);

    if (removeError) {
      console.error('Error removing team member:', removeError);
      return NextResponse.json(
        { error: 'Failed to remove team member' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: isSelfRemoval ? 'teams.members.leave' : 'teams.members.remove',
        entity_type: 'team',
        entity_id: teamId,
        description: isSelfRemoval 
          ? 'Left the team'
          : `Removed ${(() => {
              const profile = targetMember.user_profiles && targetMember.user_profiles.length > 0 ? targetMember.user_profiles[0] : undefined;
              return profile ? (profile.full_name ?? profile.username ?? 'unknown user') : 'unknown user';
            })()} from team`,
        metadata: { 
          removed_user_id: memberUserId,
          removed_user_name: (() => {
              const profile = targetMember.user_profiles && targetMember.user_profiles.length > 0 ? targetMember.user_profiles[0] : undefined;
              return profile ? (profile.full_name ?? profile.username ?? 'unknown user') : 'unknown user';
            })(),
          is_self_removal: isSelfRemoval
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      message: isSelfRemoval ? 'Successfully left the team' : 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/teams/[id]/members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
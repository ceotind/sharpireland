import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { ProjectActivityLogger } from '../../../utils/activity-logger';

interface ProjectUpdateData {
  updated_at?: string;
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  budget?: number;
  deadline?: string | null;
}

export async function GET(
  _request: NextRequest,
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

    // Get project by ID for the user
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project:', error);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Unexpected error in GET /api/projects/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  _request: NextRequest,
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
    const body = await _request.json();
    const { name, description, status, priority, budget, deadline } = body;

    // Get current project to check ownership and for logging
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project for update:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }

    // Prepare update data
    const updateData: ProjectUpdateData = {
      updated_at: new Date().toISOString()
    };

    const updatedFields: string[] = [];

    if (name !== undefined && name !== currentProject.name) {
      updateData.name = name;
      updatedFields.push('name');
    }
    if (description !== undefined && description !== currentProject.description) {
      updateData.description = description;
      updatedFields.push('description');
    }
    if (status !== undefined && status !== currentProject.status) {
      updateData.status = status;
      updatedFields.push('status');
    }
    if (priority !== undefined && priority !== currentProject.priority) {
      updateData.priority = priority;
      updatedFields.push('priority');
    }
    if (budget !== undefined && budget !== currentProject.budget) {
      updateData.budget = budget;
      updatedFields.push('budget');
    }
    if (deadline !== undefined) {
      const newDeadline = deadline ? new Date(deadline).toISOString() : null;
      if (newDeadline !== currentProject.deadline) {
        updateData.deadline = newDeadline;
        updatedFields.push('deadline');
      }
    }

    // If no fields to update, return current project
    if (updatedFields.length === 0) {
      return NextResponse.json({ project: currentProject });
    }

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating project:', updateError);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    // Log activity
    await ProjectActivityLogger.logProjectUpdate(
      user.id,
      id,
      updatedProject.name,
      updatedFields
    );

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Unexpected error in PUT /api/projects/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
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

    // Get project to check ownership and for logging
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project for deletion:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }

    // Delete project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    // Log activity
    await ProjectActivityLogger.logProjectDelete(user.id, id, project.name);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/projects/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
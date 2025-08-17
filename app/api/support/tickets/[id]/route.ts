import { NextRequest, NextResponse } from 'next/server';

interface SupportTicketUpdateData {
  subject?: string;
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: string | null;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  satisfaction_rating?: number;
  resolved_at?: string;
  updated_at?: string;
}
import { createClient } from '../../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../../utils/activity-logger';

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
      return NextResponse.json({ error: 'Invalid ticket ID format' }, { status: 400 });
    }

    // Get the support ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
      }
      console.error('Error fetching support ticket:', error);
      return NextResponse.json({ error: 'Failed to fetch support ticket' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.view',
        entity_type: 'support_ticket',
        entity_id: ticket.id,
        description: `Viewed support ticket: ${ticket.subject}`,
        metadata: { subject: ticket.subject, status: ticket.status }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Unexpected error in GET /api/support/tickets/[id]:', error);
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
    const { subject, description, priority, category, status, satisfaction_rating } = body;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid ticket ID format' }, { status: 400 });
    }

    // Build update object
    const updateData: SupportTicketUpdateData = {};
    
    // Validate and add subject if provided
    if (subject !== undefined) {
      if (subject.length < 5 || subject.length > 200) {
        return NextResponse.json({ 
          error: 'Subject must be between 5 and 200 characters' 
        }, { status: 400 });
      }
      updateData.subject = subject.trim();
    }

    // Validate and add description if provided
    if (description !== undefined) {
      if (description.length < 10 || description.length > 5000) {
        return NextResponse.json({ 
          error: 'Description must be between 10 and 5000 characters' 
        }, { status: 400 });
      }
      updateData.description = description.trim();
    }

    // Validate and add priority if provided
    if (priority !== undefined) {
      const validPriorities = ['low', 'normal', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json({ 
          error: 'Invalid priority. Must be one of: low, normal, high, urgent' 
        }, { status: 400 });
      }
      updateData.priority = priority;
    }

    // Validate and add category if provided
    if (category !== undefined) {
      if (category && (category.length < 2 || category.length > 50)) {
        return NextResponse.json({ 
          error: 'Category must be between 2 and 50 characters' 
        }, { status: 400 });
      }
      updateData.category = category?.trim() || null;
    }

    // Validate and add status if provided
    if (status !== undefined) {
      const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: 'Invalid status. Must be one of: open, in-progress, resolved, closed' 
        }, { status: 400 });
      }
      updateData.status = status;
      
      // Set resolved_at timestamp if status is resolved or closed
      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }
    }

    // Validate and add satisfaction rating if provided
    if (satisfaction_rating !== undefined) {
      if (typeof satisfaction_rating !== 'number' || satisfaction_rating < 1 || satisfaction_rating > 5) {
        return NextResponse.json({ 
          error: 'Satisfaction rating must be a number between 1 and 5' 
        }, { status: 400 });
      }
      updateData.satisfaction_rating = satisfaction_rating;
    }

    // Only proceed if there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Update the support ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
      }
      console.error('Error updating support ticket:', error);
      return NextResponse.json({ error: 'Failed to update support ticket' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.update',
        entity_type: 'support_ticket',
        entity_id: ticket.id,
        description: `Updated support ticket: ${ticket.subject}`,
        metadata: { 
          subject: ticket.subject, 
          status: ticket.status,
          updated_fields: Object.keys(updateData).filter(key => key !== 'updated_at')
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Unexpected error in PUT /api/support/tickets/[id]:', error);
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
      return NextResponse.json({ error: 'Invalid ticket ID format' }, { status: 400 });
    }

    // First, get the ticket to log the deletion
    const { data: ticket, error: fetchError } = await supabase
      .from('support_tickets')
      .select('subject, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
      }
      console.error('Error fetching support ticket for deletion:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch support ticket' }, { status: 500 });
    }

    // Delete the support ticket
    const { error: deleteError } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting support ticket:', deleteError);
      return NextResponse.json({ error: 'Failed to delete support ticket' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.delete',
        entity_type: 'support_ticket',
        entity_id: id,
        description: `Deleted support ticket: ${ticket.subject}`,
        metadata: { subject: ticket.subject, status: ticket.status }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ message: 'Support ticket deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/support/tickets/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../../../utils/activity-logger';

interface TicketMessage {
  id: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
  user_id: string;
}

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

    // Get the support ticket with messages from metadata
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('id, subject, metadata')
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

    // Extract messages from metadata or return empty array
    const messages: TicketMessage[] = ticket.metadata?.messages || [];

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.messages.list',
        entity_type: 'support_ticket',
        entity_id: ticket.id,
        description: `Viewed messages for ticket: ${ticket.subject}`,
        metadata: { subject: ticket.subject, message_count: messages.length }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Unexpected error in GET /api/support/tickets/[id]/messages:', error);
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
    const { message } = body;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid ticket ID format' }, { status: 400 });
    }

    // Validate message
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.trim().length < 1 || message.trim().length > 2000) {
      return NextResponse.json({ 
        error: 'Message must be between 1 and 2000 characters' 
      }, { status: 400 });
    }

    // Get the current ticket
    const { data: ticket, error: fetchError } = await supabase
      .from('support_tickets')
      .select('id, subject, metadata, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
      }
      console.error('Error fetching support ticket:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch support ticket' }, { status: 500 });
    }

    // Check if ticket is closed
    if (ticket.status === 'closed') {
      return NextResponse.json({ 
        error: 'Cannot add messages to a closed ticket' 
      }, { status: 400 });
    }

    // Create new message
    const newMessage: TicketMessage = {
      id: crypto.randomUUID(),
      message: message.trim(),
      is_staff_reply: false,
      created_at: new Date().toISOString(),
      user_id: user.id
    };

    // Get existing messages or initialize empty array
    const existingMessages: TicketMessage[] = ticket.metadata?.messages || [];
    const updatedMessages = [...existingMessages, newMessage];

    // Update ticket metadata with new message
    const updatedMetadata = {
      ...ticket.metadata,
      messages: updatedMessages
    };

    const { data: updatedTicket, error: updateError } = await supabase
      .from('support_tickets')
      .update({
        metadata: updatedMetadata,
        updated_at: new Date().toISOString(),
        // If ticket was resolved, reopen it when user adds a message
        status: ticket.status === 'resolved' ? 'in-progress' : ticket.status
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating support ticket with message:', updateError);
      return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.messages.create',
        entity_type: 'support_ticket',
        entity_id: ticket.id,
        description: `Added message to ticket: ${ticket.subject}`,
        metadata: { 
          subject: ticket.subject, 
          message_preview: message.trim().substring(0, 100),
          total_messages: updatedMessages.length
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ 
      message: newMessage,
      ticket: updatedTicket
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/support/tickets/[id]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
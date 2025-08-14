import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../utils/activity-logger';

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
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Add filters
    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: tickets, error, count } = await query;

    if (error) {
      console.error('Error fetching support tickets:', error);
      return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.list',
        description: `Viewed support tickets list (page ${page})`
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      tickets: tickets || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/support/tickets:', error);
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
    const { subject, description, priority, category } = body;

    // Validate required fields
    if (!subject || !description) {
      return NextResponse.json({ 
        error: 'Subject and description are required' 
      }, { status: 400 });
    }

    // Validate subject length
    if (subject.length < 5 || subject.length > 200) {
      return NextResponse.json({ 
        error: 'Subject must be between 5 and 200 characters' 
      }, { status: 400 });
    }

    // Validate description length
    if (description.length < 10 || description.length > 5000) {
      return NextResponse.json({ 
        error: 'Description must be between 10 and 5000 characters' 
      }, { status: 400 });
    }

    // Validate priority if provided
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json({ 
        error: 'Invalid priority. Must be one of: low, normal, high, urgent' 
      }, { status: 400 });
    }

    // Validate category length if provided
    if (category && (category.length < 2 || category.length > 50)) {
      return NextResponse.json({ 
        error: 'Category must be between 2 and 50 characters' 
      }, { status: 400 });
    }

    // Create new support ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        description: description.trim(),
        priority: priority || 'normal',
        category: category?.trim() || null,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating support ticket:', error);
      return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
    }

    // Log activity
    const { ipAddress, userAgent } = getRequestInfo(request);
    await logActivity(
      {
        action: 'support.tickets.create',
        entity_type: 'support_ticket',
        entity_id: ticket.id,
        description: `Created support ticket: ${subject}`,
        metadata: { subject, priority: priority || 'normal', category }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/support/tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
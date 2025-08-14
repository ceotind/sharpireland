import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import { Notification, ApiResponse, PaginatedResponse } from '../../types/dashboard';

// GET /api/notifications - Get user notifications with pagination and filtering
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedResponse<Notification>>>> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 per page
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');

    try {
      // Build query
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Apply filters
      if (unreadOnly) {
        query = query.eq('read', false);
      }
      if (type) {
        query = query.eq('type', type);
      }
      if (priority) {
        query = query.eq('priority', priority);
      }

      // Apply pagination and ordering
      const offset = (page - 1) * limit;
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: notifications, error: fetchError, count } = await query;

      if (fetchError) {
        // Check if the error is due to missing table
        if (fetchError.code === 'PGRST205') {
          console.error('Notifications table not found, using mock data:', fetchError);
          
          // Return mock notifications data
          const mockNotifications: Notification[] = [
            {
              id: '1',
              user_id: user.id,
              type: 'info',
              priority: 'normal',
              title: 'Welcome to the dashboard',
              message: 'This is a mock notification since the notifications table is not available.',
              action_url: null,
              action_label: null,
              read: false,
              read_at: null,
              metadata: null,
              created_at: new Date().toISOString()
            }
          ];
          
          return NextResponse.json({
            data: {
              data: mockNotifications,
              count: mockNotifications.length,
              page,
              limit,
              total_pages: 1
            }
          });
        }
        
        console.error('Error fetching notifications:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch notifications' },
          { status: 500 }
        );
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return NextResponse.json({
        data: {
          data: notifications || [],
          count: count || 0,
          page,
          limit,
          total_pages: totalPages
        }
      });
    } catch (error) {
      console.error('Error querying notifications:', error);
      
      // Return mock notifications as fallback
      const mockNotifications: Notification[] = [
        {
          id: '1',
          user_id: user.id,
          type: 'info',
          priority: 'normal',
          title: 'Welcome to the dashboard',
          message: 'This is a mock notification since the notifications table is not available.',
          action_url: null,
          action_label: null,
          read: false,
          read_at: null,
          metadata: null,
          created_at: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({
        data: {
          data: mockNotifications,
          count: mockNotifications.length,
          page,
          limit,
          total_pages: 1
        }
      });
    }

  } catch (error) {
    console.error('Unexpected error in GET /api/notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification (admin/system use)
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Notification>>> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    let notificationData;
    try {
      notificationData = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!notificationData.type || !notificationData.title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    // Validate type and priority
    const validTypes = ['info', 'success', 'warning', 'error', 'system', 'billing', 'project'];
    const validPriorities = ['low', 'normal', 'high', 'urgent'];

    if (!validTypes.includes(notificationData.type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    if (notificationData.priority && !validPriorities.includes(notificationData.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      );
    }

    // Create the notification
    const newNotification = {
      user_id: user.id,
      type: notificationData.type,
      priority: notificationData.priority || 'normal',
      title: notificationData.title,
      message: notificationData.message || null,
      action_url: notificationData.action_url || null,
      action_label: notificationData.action_label || null,
      metadata: notificationData.metadata || null
    };

    const { data: notification, error: insertError } = await supabase
      .from('notifications')
      .insert(newNotification)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating notification:', insertError);
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
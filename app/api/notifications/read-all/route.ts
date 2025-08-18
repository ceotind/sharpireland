import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { ApiResponse } from '../../../types/dashboard';

// PUT /api/notifications/read-all - Mark all notifications as read
export async function PUT(_request: NextRequest): Promise<NextResponse<ApiResponse<{ updated_count: number }>>> {
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

    // Mark all unread notifications as read
    const { data, error: updateError } = await supabase
      .from('notifications')
      .update({ 
        read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .eq('read', false)
      .select('id');

    if (updateError) {
      console.error('Error marking all notifications as read:', updateError);
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      );
    }

    const updatedCount = data?.length || 0;

    return NextResponse.json({
      data: { updated_count: updatedCount },
      message: `${updatedCount} notifications marked as read`
    });

  } catch (error) {
    console.error('Unexpected error in PUT /api/notifications/read-all:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
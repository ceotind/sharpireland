import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import { BillingActivityLogger } from '../../utils/activity-logger';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    // Apply status filter if provided
    if (status && ['active', 'inactive', 'cancelled', 'expired'].includes(status)) {
      query = query.eq('status', status);
    }

    // Apply pagination and ordering
    const { data: subscriptions, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting subscriptions:', countError);
      return NextResponse.json({ error: 'Failed to count subscriptions' }, { status: 500 });
    }

    return NextResponse.json({
      subscriptions,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/subscriptions:', error);
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
    const {
      service_type,
      plan_name,
      status = 'active',
      billing_cycle,
      price,
      next_renewal,
      usage_limit,
      current_usage,
      features
    } = body;

    // Validate required fields
    if (!service_type || !plan_name) {
      return NextResponse.json(
        { error: 'Service type and plan name are required' },
        { status: 400 }
      );
    }

    // Create new subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        service_type,
        plan_name,
        status,
        billing_cycle,
        price,
        next_renewal: next_renewal ? new Date(next_renewal).toISOString() : null,
        usage_limit,
        current_usage: current_usage || {},
        features,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }

    // Log activity
    await BillingActivityLogger.logSubscriptionChange(
      user.id,
      subscription.id,
      'created',
      plan_name
    );

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/subscriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
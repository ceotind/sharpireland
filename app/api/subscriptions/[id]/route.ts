import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { BillingActivityLogger } from '../../../utils/activity-logger';

interface Subscription {
  id: string;
  user_id: string;
  service_type: string;
  plan_name: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  billing_cycle: string;
  price: number;
  next_renewal: string | null;
  usage_limit: number;
  current_usage: number;
  features: unknown;
  updated_at: string;
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

    // Get subscription by ID for the user
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      console.error('Error fetching subscription:', error);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Unexpected error in GET /api/subscriptions/[id]:', error);
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
    const {
      service_type,
      plan_name,
      status,
      billing_cycle,
      price,
      next_renewal,
      usage_limit,
      current_usage,
      features
    } = body;

    // Get current subscription to check ownership and for logging
    const { data: currentSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      console.error('Error fetching subscription for update:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    // Prepare update data
    const updateData: Partial<Subscription> = {
      updated_at: new Date().toISOString()
    };

    const updatedFields: string[] = [];

    if (service_type !== undefined && service_type !== currentSubscription.service_type) {
      updateData.service_type = service_type;
      updatedFields.push('service_type');
    }
    if (plan_name !== undefined && plan_name !== currentSubscription.plan_name) {
      updateData.plan_name = plan_name;
      updatedFields.push('plan_name');
    }
    if (status !== undefined && status !== currentSubscription.status) {
      updateData.status = status;
      updatedFields.push('status');
    }
    if (billing_cycle !== undefined && billing_cycle !== currentSubscription.billing_cycle) {
      updateData.billing_cycle = billing_cycle;
      updatedFields.push('billing_cycle');
    }
    if (price !== undefined && price !== currentSubscription.price) {
      updateData.price = price;
      updatedFields.push('price');
    }
    if (next_renewal !== undefined) {
      const newRenewal = next_renewal ? new Date(next_renewal).toISOString() : null;
      if (newRenewal !== currentSubscription.next_renewal) {
        updateData.next_renewal = newRenewal;
        updatedFields.push('next_renewal');
      }
    }
    if (usage_limit !== undefined) {
      updateData.usage_limit = usage_limit;
      updatedFields.push('usage_limit');
    }
    if (current_usage !== undefined) {
      updateData.current_usage = current_usage;
      updatedFields.push('current_usage');
    }
    if (features !== undefined) {
      updateData.features = features;
      updatedFields.push('features');
    }

    // If no fields to update, return current subscription
    if (updatedFields.length === 0) {
      return NextResponse.json({ subscription: currentSubscription });
    }

    // Update subscription
    const { data: updatedSubscription, error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    // Log activity if status changed
    if (updatedFields.includes('status')) {
      const actionMap: { [key: string]: 'created' | 'updated' | 'cancelled' } = {
        'active': 'updated',
        'inactive': 'updated',
        'cancelled': 'cancelled',
        'expired': 'updated'
      };
      
      await BillingActivityLogger.logSubscriptionChange(
        user.id,
        id,
        actionMap[updateData.status as string] || 'updated',
        updatedSubscription.plan_name
      );
    }

    return NextResponse.json({ subscription: updatedSubscription });
  } catch (error) {
    console.error('Unexpected error in PUT /api/subscriptions/[id]:', error);
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

    // Get subscription to check ownership and for logging
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      console.error('Error fetching subscription for deletion:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    // Instead of deleting, mark as cancelled (soft delete)
    const { data: cancelledSubscription, error: cancelError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (cancelError) {
      console.error('Error cancelling subscription:', cancelError);
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }

    // Log activity
    await BillingActivityLogger.logSubscriptionChange(
      user.id,
      id,
      'cancelled',
      subscription.plan_name
    );

    return NextResponse.json({ 
      subscription: cancelledSubscription,
      message: 'Subscription cancelled successfully' 
    });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/subscriptions/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
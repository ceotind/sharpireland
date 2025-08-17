import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

interface Subscription {
  id: string;
  user_id: string;
  current_usage: Record<string, unknown>;
  usage_limit: Record<string, number>;
  service_type: string;
  plan_name: string;
  billing_cycle: string | null;
  status: string;
  next_renewal: string;
  features: Record<string, unknown>;
  price: number;
  updated_at: string;
}

interface UsageStats {
  subscription_id: string;
  service_type: string;
  plan_name: string;
  billing_cycle: string | null;
  current_period: {
    start_date: string;
    end_date: string;
    usage: Record<string, unknown>;
    limits: Record<string, number>;
    utilization: Record<string, number>;
  };
  status: string;
  next_renewal: string;
  features: Record<string, unknown>;
  price: number;
  historical?: Array<{ period: string; usage: Record<string, unknown> }>;
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
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'current'; // current, last_month, last_3_months

    // First verify the subscription belongs to the user
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (subscriptionError) {
      if (subscriptionError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      console.error('Error verifying subscription ownership:', subscriptionError);
      return NextResponse.json({ error: 'Failed to verify subscription' }, { status: 500 });
    }

    // Calculate usage data based on subscription type and current usage
    const currentUsage = subscription.current_usage || {};
    const usageLimit = subscription.usage_limit || {};

    // Generate usage statistics
    const usageStats: UsageStats = {
      subscription_id: id,
      service_type: subscription.service_type,
      plan_name: subscription.plan_name,
      billing_cycle: subscription.billing_cycle,
      current_period: {
        start_date: getCurrentPeriodStart(subscription.billing_cycle),
        end_date: getCurrentPeriodEnd(subscription.billing_cycle),
        usage: currentUsage,
        limits: usageLimit,
        utilization: calculateUtilization(currentUsage, usageLimit)
      },
      status: subscription.status,
      next_renewal: subscription.next_renewal,
      features: subscription.features || {},
      price: subscription.price
    };

    // Add historical data if requested
    if (period !== 'current') {
      usageStats.historical = generateHistoricalUsage(subscription, period);
    }

    return NextResponse.json({ usage: usageStats });
  } catch (error) {
    console.error('Unexpected error in GET /api/subscriptions/[id]/usage:', error);
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
    const { usage_data, increment = false } = body;

    if (!usage_data || typeof usage_data !== 'object') {
      return NextResponse.json(
        { error: 'Usage data is required and must be an object' },
        { status: 400 }
      );
    }

    // First verify the subscription belongs to the user
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (subscriptionError) {
      if (subscriptionError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      console.error('Error verifying subscription ownership:', subscriptionError);
      return NextResponse.json({ error: 'Failed to verify subscription' }, { status: 500 });
    }

    // Update usage data
    let newUsage = usage_data;
    
    if (increment && subscription.current_usage) {
      // Increment existing usage
      newUsage = { ...subscription.current_usage };
      for (const [key, value] of Object.entries(usage_data)) {
        if (typeof value === 'number') {
          newUsage[key] = (newUsage[key] || 0) + value;
        } else {
          newUsage[key] = value;
        }
      }
    }

    // Update subscription with new usage data
    const { data: updatedSubscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        current_usage: newUsage,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription usage:', updateError);
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 });
    }

    // Calculate updated utilization
    const utilization = calculateUtilization(newUsage, subscription.usage_limit || {});

    return NextResponse.json({
      subscription: updatedSubscription,
      usage: newUsage,
      utilization,
      message: 'Usage updated successfully'
    });
  } catch (error) {
    console.error('Unexpected error in PUT /api/subscriptions/[id]/usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function getCurrentPeriodStart(billingCycle: string | null): string {
  const now = new Date();
  
  switch (billingCycle) {
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    case 'yearly':
      return new Date(now.getFullYear(), 0, 1).toISOString();
    default:
      // For one-time or null, use current month
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
}

function getCurrentPeriodEnd(billingCycle: string | null): string {
  const now = new Date();
  
  switch (billingCycle) {
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    case 'yearly':
      return new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString();
    default:
      // For one-time or null, use end of current month
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  }
}

function calculateUtilization(usage: Record<string, unknown>, limits: Record<string, number>): Record<string, number> {
  const utilization: Record<string, number> = {};
  
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof limit === 'number' && limit > 0) {
      const currentUsage = usage[key] || 0;
      if (typeof currentUsage === 'number') {
        utilization[key] = Math.min((currentUsage / limit) * 100, 100);
      }
    }
  }
  
  return utilization;
}

function generateHistoricalUsage(subscription: Subscription, period: string): Array<{ period: string; usage: Record<string, unknown> }> {
  // This is a placeholder for historical usage data
  // In a real implementation, you would query historical usage from a separate table
  const historical = [];
  const now = new Date();
  
  let months = 1;
  if (period === 'last_3_months') months = 3;
  else if (period === 'last_month') months = 1;
  
  for (let i = months; i > 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    historical.push({
      period: date.toISOString().substring(0, 7), // YYYY-MM format
      usage: (subscription.current_usage || {}) as Record<string, unknown>,
      // In real implementation, this would be actual historical data
    });
  }
  
  return historical;
}
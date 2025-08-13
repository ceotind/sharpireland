/**
 * Business Planner Usage API Endpoint
 * Handles usage tracking and statistics for the business planner feature
 * 
 * @fileoverview Usage statistics and subscription management endpoint
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { 
  BusinessPlannerUsage,
  BusinessPlannerApiResponse,
  UsageStatusResponse
} from '@/app/types/business-planner';
import { 
  FREE_CONVERSATIONS_LIMIT,
  PAID_CONVERSATIONS_COUNT,
  ERROR_CODES,
  SUCCESS_MESSAGES
} from '@/app/utils/business-planner/constants';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get or create user usage record
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns Usage record
 */
async function getOrCreateUsage(
  supabase: any,
  userId: string
): Promise<BusinessPlannerUsage | null> {
  try {
    // Try to get existing usage record
    const { data: existingUsage, error: fetchError } = await supabase
      .from('business_planner_usage')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching usage record:', fetchError);
      return null;
    }
    
    if (existingUsage) {
      return existingUsage;
    }
    
    // Create new usage record
    const newUsage = {
      user_id: userId,
      free_conversations_used: 0,
      paid_conversations_used: 0,
      total_tokens_used: 0,
      last_reset_date: new Date().toISOString().split('T')[0],
      subscription_status: 'free' as const
    };
    
    const { data: createdUsage, error: createError } = await supabase
      .from('business_planner_usage')
      .insert(newUsage)
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating usage record:', createError);
      return null;
    }
    
    return createdUsage;
  } catch (error) {
    console.error('Unexpected error in getOrCreateUsage:', error);
    return null;
  }
}

/**
 * Calculate usage statistics and limits
 * @param usage - User usage record
 * @returns Usage statistics
 */
function calculateUsageStats(usage: BusinessPlannerUsage): {
  remainingFree: number;
  remainingPaid: number;
  totalUsed: number;
  totalAvailable: number;
  canContinue: boolean;
  needsUpgrade: boolean;
  usagePercentage: number;
  nextResetDate: string;
} {
  const remainingFree = Math.max(0, FREE_CONVERSATIONS_LIMIT - usage.free_conversations_used);
  const remainingPaid = usage.subscription_status === 'paid' 
    ? Math.max(0, PAID_CONVERSATIONS_COUNT - usage.paid_conversations_used)
    : 0;
  
  const totalUsed = usage.free_conversations_used + usage.paid_conversations_used;
  const totalAvailable = FREE_CONVERSATIONS_LIMIT + (usage.subscription_status === 'paid' ? PAID_CONVERSATIONS_COUNT : 0);
  const totalRemaining = remainingFree + remainingPaid;
  
  const canContinue = totalRemaining > 0;
  const needsUpgrade = remainingFree <= 0 && usage.subscription_status === 'free';
  const usagePercentage = totalAvailable > 0 ? Math.round((totalUsed / totalAvailable) * 100) : 0;
  
  // Calculate next reset date (monthly reset)
  const lastReset = new Date(usage.last_reset_date);
  const nextReset = new Date(lastReset);
  nextReset.setMonth(nextReset.getMonth() + 1);
  
  return {
    remainingFree,
    remainingPaid,
    totalUsed,
    totalAvailable,
    canContinue,
    needsUpgrade,
    usagePercentage,
    nextResetDate: nextReset.toISOString().split('T')[0] || ''
  };
}

/**
 * Get usage history and trends
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns Usage trends data
 */
async function getUsageTrends(
  supabase: any,
  userId: string
): Promise<{
  conversationsThisMonth: number;
  tokensThisMonth: number;
  averageTokensPerConversation: number;
  mostActiveDay: string | null;
} | null> {
  try {
    // Get conversations from this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data: conversations, error } = await supabase
      .from('business_planner_conversations')
      .select('tokens_used, created_at')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());
    
    if (error) {
      console.error('Error fetching usage trends:', error);
      return null;
    }
    
    const conversationsThisMonth = conversations?.length || 0;
    const tokensThisMonth = conversations?.reduce((sum: number, conv: any) => sum + (conv.tokens_used || 0), 0) || 0;
    const averageTokensPerConversation = conversationsThisMonth > 0 ? Math.round(tokensThisMonth / conversationsThisMonth) : 0;
    
    // Find most active day (simplified - just return today's date if there are conversations)
    const mostActiveDay: string | null = conversationsThisMonth > 0 ? (new Date().toISOString().split('T')[0] || null) : null;
    
    return {
      conversationsThisMonth,
      tokensThisMonth,
      averageTokensPerConversation,
      mostActiveDay
    };
  } catch (error) {
    console.error('Unexpected error in getUsageTrends:', error);
    return null;
  }
}

/**
 * Check if usage needs to be reset (monthly reset)
 * @param usage - Current usage record
 * @returns Whether reset is needed
 */
function needsUsageReset(usage: BusinessPlannerUsage): boolean {
  const lastReset = new Date(usage.last_reset_date);
  const now = new Date();
  
  // Reset if it's a new month
  return lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();
}

/**
 * Reset monthly usage counters
 * @param supabase - Supabase client
 * @param usage - Current usage record
 * @returns Updated usage record
 */
async function resetMonthlyUsage(
  supabase: any,
  usage: BusinessPlannerUsage
): Promise<BusinessPlannerUsage | null> {
  try {
    const updates = {
      free_conversations_used: 0,
      paid_conversations_used: 0,
      last_reset_date: new Date().toISOString().split('T')[0]
    };
    
    const { data: updatedUsage, error } = await supabase
      .from('business_planner_usage')
      .update(updates)
      .eq('id', usage.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error resetting usage:', error);
      return null;
    }
    
    return updatedUsage;
  } catch (error) {
    console.error('Unexpected error in resetMonthlyUsage:', error);
    return null;
  }
}

// =============================================================================
// API HANDLERS
// =============================================================================

/**
 * GET /api/business-planner/usage - Get user usage statistics
 */
export async function GET(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<UsageStatusResponse>>> {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { 
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'Authentication required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }
    
    // Get or create usage record
    let usage = await getOrCreateUsage(supabase, user.id);
    
    if (!usage) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to fetch usage data',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Check if usage needs monthly reset
    if (needsUsageReset(usage)) {
      const resetUsage = await resetMonthlyUsage(supabase, usage);
      if (resetUsage) {
        usage = resetUsage;
      }
    }
    
    // Calculate usage statistics
    const stats = calculateUsageStats(usage);
    
    // Get usage trends (optional - don't fail if this fails)
    const trends = await getUsageTrends(supabase, user.id);
    
    // Parse query parameters for additional data
    const { searchParams } = new URL(request.url);
    const includeTrends = searchParams.get('include_trends') === 'true';
    const includeHistory = searchParams.get('include_history') === 'true';
    
    // Prepare response data
    const responseData: UsageStatusResponse = {
      usage,
      remaining_free_conversations: stats.remainingFree,
      remaining_paid_conversations: stats.remainingPaid,
      can_continue: stats.canContinue,
      needs_upgrade: stats.needsUpgrade
    };
    
    // Add additional data if requested
    const additionalData: any = {
      statistics: {
        total_used: stats.totalUsed,
        total_available: stats.totalAvailable,
        usage_percentage: stats.usagePercentage,
        next_reset_date: stats.nextResetDate
      }
    };
    
    if (includeTrends && trends) {
      additionalData.trends = trends;
    }
    
    if (includeHistory) {
      // Could add conversation history here if needed
      additionalData.history = {
        last_reset: usage.last_reset_date,
        subscription_since: usage.created_at
      };
    }
    
    return NextResponse.json({
      data: {
        ...responseData,
        ...additionalData
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/business-planner/usage:', error);
    
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Internal server error',
          details: {},
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/business-planner/usage - Update subscription status
 */
export async function POST(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<BusinessPlannerUsage>>> {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { 
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'Authentication required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }
    
    // Parse request body
    let requestData: { action: string; subscription_status?: string };
    try {
      requestData = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid JSON in request body',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate action
    if (!requestData.action || !['update_subscription', 'reset_usage'].includes(requestData.action)) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid action',
            details: { allowedActions: ['update_subscription', 'reset_usage'] },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Get current usage
    const usage = await getOrCreateUsage(supabase, user.id);
    
    if (!usage) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to fetch usage data',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    let updatedUsage: BusinessPlannerUsage | null = null;
    let message = '';
    
    if (requestData.action === 'update_subscription') {
      // Validate subscription status
      if (!requestData.subscription_status || !['free', 'paid', 'expired'].includes(requestData.subscription_status)) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.INVALID_INPUT,
              message: 'Invalid subscription status',
              details: { allowedStatuses: ['free', 'paid', 'expired'] },
              timestamp: new Date().toISOString()
            }
          },
          { status: 400 }
        );
      }
      
      // Update subscription status
      const { data: updated, error: updateError } = await supabase
        .from('business_planner_usage')
        .update({ subscription_status: requestData.subscription_status })
        .eq('id', usage.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.DATABASE_ERROR,
              message: 'Failed to update subscription status',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
      
      updatedUsage = updated;
      message = 'Subscription status updated successfully';
      
    } else if (requestData.action === 'reset_usage') {
      // Reset usage counters
      updatedUsage = await resetMonthlyUsage(supabase, usage);
      
      if (!updatedUsage) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.DATABASE_ERROR,
              message: 'Failed to reset usage counters',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
      
      message = SUCCESS_MESSAGES.USAGE_RESET;
    }
    
    return NextResponse.json({
      data: updatedUsage!,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `usage_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/business-planner/usage:', error);
    
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Internal server error',
          details: {},
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// METHOD NOT ALLOWED HANDLERS
// =============================================================================

/**
 * Handle unsupported HTTP methods
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'PUT method not supported for this endpoint',
        details: { allowedMethods: ['GET', 'POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'DELETE method not supported for this endpoint',
        details: { allowedMethods: ['GET', 'POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}
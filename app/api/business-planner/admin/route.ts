/**
 * Business Planner Admin API Endpoint
 * Handles administrative functions for business planner management
 * 
 * @fileoverview Admin endpoint for business planner feature management
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { 
  BusinessPlannerUsage,
  BusinessPlannerProfile,
  BusinessPlannerSession,
  BusinessPlannerApiResponse,
  BusinessPlannerPaginatedResponse
} from '@/app/types/business-planner';
import { checkRateLimit, updateRateLimit, resetRateLimit } from '@/app/utils/business-planner/rate-limiter';
import { 
  ERROR_CODES,
  SUCCESS_MESSAGES,
  FREE_CONVERSATIONS_LIMIT,
  PAID_CONVERSATIONS_COUNT,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT
} from '@/app/utils/business-planner/constants';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Admin user overview data
 */
interface AdminUserOverview {
  user_id: string;
  email?: string;
  profile?: BusinessPlannerProfile;
  usage: BusinessPlannerUsage;
  total_sessions: number;
  total_conversations: number;
  last_activity?: string;
}

/**
 * Grant conversations request
 */
interface GrantConversationsRequest {
  user_id: string;
  conversations_count: number;
  reason?: string;
}

/**
 * Update user limits request
 */
interface UpdateUserLimitsRequest {
  user_id: string;
  subscription_status?: 'free' | 'paid' | 'expired';
  reset_usage?: boolean;
  block_user?: boolean;
  unblock_user?: boolean;
}

/**
 * Admin statistics
 */
interface AdminStatistics {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  total_conversations: number;
  total_tokens_used: number;
  free_users: number;
  paid_users: number;
  blocked_users: number;
  average_conversations_per_user: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if user is admin
 * @param supabase - Supabase client
 * @param userId - User ID to check
 * @returns Whether user is admin
 */
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  try {
    // Check if user has admin role in profiles table or custom admin table
    // This is a simplified check - in production you'd have a proper admin role system
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }
    
    // For now, check if user email is in admin list
    // In production, you'd have a proper admin roles table
    const adminEmails = [
      'admin@sharpireland.com',
      'dilshad@sharpireland.com'
    ];
    
    return adminEmails.includes(user.user?.email || '');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get client IP address from request
 * @param request - Next.js request object
 * @returns IP address string
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  
  return realIP || remoteAddr || 'unknown';
}

/**
 * Get admin statistics
 * @param supabase - Supabase client
 * @returns Admin statistics
 */
async function getAdminStatistics(supabase: any): Promise<AdminStatistics | null> {
  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('business_planner_usage')
      .select('*', { count: 'exact', head: true });
    
    // Get active users today
    const today = new Date().toISOString().split('T')[0];
    const { count: activeToday } = await supabase
      .from('business_planner_conversations')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', today);
    
    // Get active users this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: activeWeek } = await supabase
      .from('business_planner_conversations')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());
    
    // Get total conversations
    const { count: totalConversations } = await supabase
      .from('business_planner_conversations')
      .select('*', { count: 'exact', head: true });
    
    // Get usage statistics
    const { data: usageStats } = await supabase
      .from('business_planner_usage')
      .select('subscription_status, total_tokens_used, free_conversations_used, paid_conversations_used');
    
    let totalTokens = 0;
    let freeUsers = 0;
    let paidUsers = 0;
    let totalUserConversations = 0;
    
    if (usageStats) {
      usageStats.forEach((usage: any) => {
        totalTokens += usage.total_tokens_used || 0;
        totalUserConversations += (usage.free_conversations_used || 0) + (usage.paid_conversations_used || 0);
        
        if (usage.subscription_status === 'free') {
          freeUsers++;
        } else if (usage.subscription_status === 'paid') {
          paidUsers++;
        }
      });
    }
    
    // Get blocked users count
    const { count: blockedUsers } = await supabase
      .from('business_planner_rate_limits')
      .select('*', { count: 'exact', head: true })
      .not('blocked_until', 'is', null)
      .gt('blocked_until', new Date().toISOString());
    
    return {
      total_users: totalUsers || 0,
      active_users_today: activeToday || 0,
      active_users_week: activeWeek || 0,
      total_conversations: totalConversations || 0,
      total_tokens_used: totalTokens,
      free_users: freeUsers,
      paid_users: paidUsers,
      blocked_users: blockedUsers || 0,
      average_conversations_per_user: totalUsers ? Math.round(totalUserConversations / totalUsers) : 0
    };
  } catch (error) {
    console.error('Error getting admin statistics:', error);
    return null;
  }
}

/**
 * Get users overview with pagination
 * @param supabase - Supabase client
 * @param page - Page number
 * @param limit - Items per page
 * @returns Paginated users overview
 */
async function getUsersOverview(
  supabase: any,
  page: number = 1,
  limit: number = DEFAULT_PAGINATION_LIMIT
): Promise<BusinessPlannerPaginatedResponse<AdminUserOverview> | null> {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const { count: totalCount } = await supabase
      .from('business_planner_usage')
      .select('*', { count: 'exact', head: true });
    
    // Get usage records with pagination
    const { data: usageRecords, error: usageError } = await supabase
      .from('business_planner_usage')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (usageError) {
      console.error('Error fetching usage records:', usageError);
      return null;
    }
    
    const usersOverview: AdminUserOverview[] = [];
    
    for (const usage of usageRecords || []) {
      // Get profile
      const { data: profile } = await supabase
        .from('business_planner_profiles')
        .select('*')
        .eq('user_id', usage.user_id)
        .single();
      
      // Get session count
      const { count: sessionCount } = await supabase
        .from('business_planner_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', usage.user_id);
      
      // Get conversation count
      const { count: conversationCount } = await supabase
        .from('business_planner_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', usage.user_id);
      
      // Get last activity
      const { data: lastConversation } = await supabase
        .from('business_planner_conversations')
        .select('created_at')
        .eq('user_id', usage.user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      usersOverview.push({
        user_id: usage.user_id,
        profile: profile || undefined,
        usage,
        total_sessions: sessionCount || 0,
        total_conversations: conversationCount || 0,
        last_activity: lastConversation?.created_at
      });
    }
    
    const totalPages = Math.ceil((totalCount || 0) / limit);
    
    return {
      data: usersOverview,
      count: totalCount || 0,
      page,
      limit,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1
    };
  } catch (error) {
    console.error('Error getting users overview:', error);
    return null;
  }
}

// =============================================================================
// MAIN API HANDLERS
// =============================================================================

/**
 * GET /api/business-planner/admin - Get admin overview and statistics
 */
export async function GET(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<{
  statistics: AdminStatistics;
  users: BusinessPlannerPaginatedResponse<AdminUserOverview>;
}>>> {
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
    
    // Check admin permissions
    const userIsAdmin = await isAdmin(supabase, user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: 'Admin access required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || DEFAULT_PAGINATION_LIMIT.toString()), MAX_PAGINATION_LIMIT);
    
    const clientIP = getClientIP(request);
    
    // Check rate limits (more lenient for admins)
    const rateLimitResult = await checkRateLimit(user.id, clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: {
            code: rateLimitResult.errorCode || ERROR_CODES.RATE_LIMIT_EXCEEDED,
            message: rateLimitResult.errorMessage || 'Rate limit exceeded',
            details: {
              currentCount: rateLimitResult.currentCount,
              maxRequests: rateLimitResult.maxRequests,
              windowReset: rateLimitResult.windowReset.toISOString()
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 429 }
      );
    }
    
    // Get admin statistics
    const statistics = await getAdminStatistics(supabase);
    if (!statistics) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to fetch admin statistics',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Get users overview
    const usersOverview = await getUsersOverview(supabase, page, limit);
    if (!usersOverview) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to fetch users overview',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Update rate limit
    await updateRateLimit({
      userId: user.id,
      ipAddress: clientIP
    });
    
    return NextResponse.json({
      data: {
        statistics,
        users: usersOverview
      },
      message: 'Admin data retrieved successfully',
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `admin_get_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/business-planner/admin:', error);
    
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
 * POST /api/business-planner/admin - Grant free conversations to user
 */
export async function POST(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<{ 
  updated_usage: BusinessPlannerUsage;
}>>> {
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
    
    // Check admin permissions
    const userIsAdmin = await isAdmin(supabase, user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: 'Admin access required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }
    
    // Parse request body
    let requestData: GrantConversationsRequest;
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
    
    const { user_id, conversations_count, reason } = requestData;
    
    // Validate input
    if (!user_id || !conversations_count || conversations_count <= 0) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Valid user_id and positive conversations_count required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Get user's current usage
    const { data: currentUsage, error: usageError } = await supabase
      .from('business_planner_usage')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (usageError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'User not found',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      );
    }
    
    // Grant conversations by reducing used count
    const newFreeUsed = Math.max(0, currentUsage.free_conversations_used - conversations_count);
    
    const { data: updatedUsage, error: updateError } = await supabase
      .from('business_planner_usage')
      .update({
        free_conversations_used: newFreeUsed
      })
      .eq('user_id', user_id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Failed to grant conversations',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Log admin action (you might want to create an admin_actions table)
    console.log(`Admin ${user.id} granted ${conversations_count} conversations to user ${user_id}. Reason: ${reason || 'No reason provided'}`);
    
    return NextResponse.json({
      data: {
        updated_usage: updatedUsage
      },
      message: `Successfully granted ${conversations_count} conversations to user`,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `admin_grant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/business-planner/admin:', error);
    
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
 * PUT /api/business-planner/admin - Update user limits and settings
 */
export async function PUT(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<{ 
  updated_usage: BusinessPlannerUsage;
  message: string;
}>>> {
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
    
    // Check admin permissions
    const userIsAdmin = await isAdmin(supabase, user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: 'Admin access required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }
    
    // Parse request body
    let requestData: UpdateUserLimitsRequest;
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
    
    const { user_id, subscription_status, reset_usage, block_user, unblock_user } = requestData;
    
    // Validate input
    if (!user_id) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'user_id is required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    let actionMessage = '';
    
    // Update usage if subscription status is provided
    if (subscription_status) {
      const updates: Partial<BusinessPlannerUsage> = {
        subscription_status
      };
      
      if (reset_usage) {
        updates.free_conversations_used = 0;
        updates.paid_conversations_used = 0;
        const resetDate = new Date().toISOString().split('T')[0];
        if (resetDate) {
          updates.last_reset_date = resetDate;
        }
        actionMessage += 'Usage reset. ';
      }
      
      const { error: updateError } = await supabase
        .from('business_planner_usage')
        .update(updates)
        .eq('user_id', user_id);
      
      if (updateError) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.DATABASE_ERROR,
              message: 'Failed to update user limits',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
      
      actionMessage += `Subscription status updated to ${subscription_status}. `;
    }
    
    // Handle blocking/unblocking
    if (block_user || unblock_user) {
      if (block_user) {
        // Block user for 24 hours
        const blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        const { error: blockError } = await supabase
          .from('business_planner_rate_limits')
          .upsert({
            user_id,
            ip_address: null,
            request_count: 999,
            window_start: new Date().toISOString(),
            blocked_until: blockUntil.toISOString(),
            suspicious_activity_count: 10
          });
        
        if (blockError) {
          console.error('Error blocking user:', blockError);
        } else {
          actionMessage += 'User blocked for 24 hours. ';
        }
      }
      
      if (unblock_user) {
        const resetSuccess = await resetRateLimit(user_id);
        if (resetSuccess) {
          actionMessage += 'User unblocked and rate limits reset. ';
        }
      }
    }
    
    // Get updated usage
    const { data: updatedUsage, error: fetchError } = await supabase
      .from('business_planner_usage')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (fetchError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Failed to fetch updated usage',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Log admin action
    console.log(`Admin ${user.id} updated user ${user_id}: ${actionMessage}`);
    
    return NextResponse.json({
      data: {
        updated_usage: updatedUsage,
        message: actionMessage.trim() || 'User updated successfully'
      },
      message: 'User limits updated successfully',
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `admin_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in PUT /api/business-planner/admin:', error);
    
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
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'DELETE method not supported for this endpoint',
        details: { allowedMethods: ['GET', 'POST', 'PUT'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}
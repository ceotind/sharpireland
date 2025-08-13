/**
 * Business Planner Sessions API Endpoint
 * Handles session management for business planning conversations
 * 
 * @fileoverview Session CRUD operations for business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { 
  BusinessPlannerSession,
  BusinessPlannerApiResponse,
  BusinessPlannerPaginatedResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  BusinessPlannerSessionContext
} from '@/app/types/business-planner';
import { validateOnboardingData } from '@/app/utils/business-planner/validators';
import businessPlannerValidator from '@/app/utils/business-planner/validators';
import { 
  ERROR_CODES,
  SUCCESS_MESSAGES,
  DEFAULT_SESSION_TITLE,
  MAX_ACTIVE_SESSIONS_PER_USER,
  MAX_TOTAL_SESSIONS_PER_USER,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT
} from '@/app/utils/business-planner/constants';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get sessions with pagination and filtering
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @param status - Filter by status
 * @returns Paginated sessions result
 */
async function getPaginatedSessions(
  supabase: any,
  userId: string,
  page: number = 1,
  limit: number = DEFAULT_PAGINATION_LIMIT,
  status?: string
): Promise<{
  sessions: BusinessPlannerSession[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
} | null> {
  try {
    // Build query
    let query = supabase
      .from('business_planner_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
    
    // Add status filter if provided
    if (status && ['active', 'completed', 'archived'].includes(status)) {
      query = query.eq('status', status);
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: sessions, error, count } = await query;
    
    if (error) {
      console.error('Error fetching sessions:', error);
      return null;
    }
    
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      sessions: sessions || [],
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  } catch (error) {
    console.error('Unexpected error in getPaginatedSessions:', error);
    return null;
  }
}

/**
 * Count user sessions by status
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns Session counts
 */
async function getSessionCounts(
  supabase: any,
  userId: string
): Promise<{
  total: number;
  active: number;
  completed: number;
  archived: number;
} | null> {
  try {
    const { data: sessions, error } = await supabase
      .from('business_planner_sessions')
      .select('status')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error counting sessions:', error);
      return null;
    }
    
    const counts = {
      total: sessions?.length || 0,
      active: 0,
      completed: 0,
      archived: 0
    };
    
    sessions?.forEach((session: any) => {
      if (session.status === 'active') counts.active++;
      else if (session.status === 'completed') counts.completed++;
      else if (session.status === 'archived') counts.archived++;
    });
    
    return counts;
  } catch (error) {
    console.error('Unexpected error in getSessionCounts:', error);
    return null;
  }
}

/**
 * Validate session limits
 * @param counts - Current session counts
 * @param newSessionStatus - Status of new session being created
 * @returns Validation result
 */
function validateSessionLimits(
  counts: { total: number; active: number },
  newSessionStatus: string = 'active'
): { allowed: boolean; errorCode?: string; errorMessage?: string } {
  if (counts.total >= MAX_TOTAL_SESSIONS_PER_USER) {
    return {
      allowed: false,
      errorCode: ERROR_CODES.SESSION_LIMIT_EXCEEDED,
      errorMessage: `Maximum ${MAX_TOTAL_SESSIONS_PER_USER} sessions allowed per user`
    };
  }
  
  if (newSessionStatus === 'active' && counts.active >= MAX_ACTIVE_SESSIONS_PER_USER) {
    return {
      allowed: false,
      errorCode: ERROR_CODES.SESSION_LIMIT_EXCEEDED,
      errorMessage: `Maximum ${MAX_ACTIVE_SESSIONS_PER_USER} active sessions allowed per user`
    };
  }
  
  return { allowed: true };
}

// =============================================================================
// API HANDLERS
// =============================================================================

/**
 * GET /api/business-planner/sessions - List user sessions
 */
export async function GET(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<BusinessPlannerPaginatedResponse<BusinessPlannerSession>>>> {
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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(MAX_PAGINATION_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || DEFAULT_PAGINATION_LIMIT.toString())));
    const status = searchParams.get('status') || undefined;
    
    // Get paginated sessions
    const result = await getPaginatedSessions(supabase, user.id, page, limit, status);
    
    if (!result) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to fetch sessions',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Prepare paginated response
    const totalPages = Math.ceil(result.totalCount / limit);
    const paginatedResponse: BusinessPlannerPaginatedResponse<BusinessPlannerSession> = {
      data: result.sessions,
      count: result.totalCount,
      page,
      limit,
      total_pages: totalPages,
      has_next: result.hasNext,
      has_prev: result.hasPrev
    };
    
    return NextResponse.json({
      data: paginatedResponse,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `sessions_list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/business-planner/sessions:', error);
    
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
 * POST /api/business-planner/sessions - Create new session
 */
export async function POST(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<CreateSessionResponse>>> {
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
    let requestData: CreateSessionRequest;
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
    
    // Validate context data (required for new sessions)
    if (!requestData.context) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Session context is required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate context using onboarding data validation
    const contextValidation = validateOnboardingData(requestData.context as unknown as Record<string, unknown>);
    if (!contextValidation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid session context',
            details: { errors: contextValidation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate title if provided
    let sessionTitle = DEFAULT_SESSION_TITLE;
    if (requestData.title) {
      const titleValidation = businessPlannerValidator.validateSessionTitleInput(requestData.title);
      if (!titleValidation.isValid) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.INVALID_INPUT,
              message: 'Invalid session title',
              details: { errors: titleValidation.errors },
              timestamp: new Date().toISOString()
            }
          },
          { status: 400 }
        );
      }
      sessionTitle = titleValidation.sanitizedData || DEFAULT_SESSION_TITLE;
    }
    
    // Check session limits
    const sessionCounts = await getSessionCounts(supabase, user.id);
    if (!sessionCounts) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to check session limits',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    const limitsCheck = validateSessionLimits(sessionCounts);
    if (!limitsCheck.allowed) {
      return NextResponse.json(
        {
          error: {
            code: limitsCheck.errorCode!,
            message: limitsCheck.errorMessage!,
            details: {
              currentTotal: sessionCounts.total,
              currentActive: sessionCounts.active,
              maxTotal: MAX_TOTAL_SESSIONS_PER_USER,
              maxActive: MAX_ACTIVE_SESSIONS_PER_USER
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 409 }
      );
    }
    
    // Create new session
    const newSession = {
      user_id: user.id,
      title: sessionTitle,
      context: contextValidation.sanitizedData as BusinessPlannerSessionContext,
      status: 'active' as const
    };
    
    const { data: createdSession, error: createError } = await supabase
      .from('business_planner_sessions')
      .insert(newSession)
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating session:', createError);
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Failed to create session',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Prepare response
    const responseData: CreateSessionResponse = {
      session: createdSession,
      message: SUCCESS_MESSAGES.SESSION_CREATED
    };
    
    return NextResponse.json({
      data: responseData,
      message: SUCCESS_MESSAGES.SESSION_CREATED,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `session_create_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/business-planner/sessions:', error);
    
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
 * PUT /api/business-planner/sessions - Update session status
 */
export async function PUT(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<BusinessPlannerSession>>> {
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
    let requestData: { session_id: string; status?: string; title?: string };
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
    
    // Validate session ID
    if (!requestData.session_id || typeof requestData.session_id !== 'string') {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Session ID is required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate status if provided
    if (requestData.status && !['active', 'completed', 'archived'].includes(requestData.status)) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid session status',
            details: { allowedStatuses: ['active', 'completed', 'archived'] },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate title if provided
    let updatedTitle: string | undefined;
    if (requestData.title) {
      const titleValidation = businessPlannerValidator.validateSessionTitleInput(requestData.title);
      if (!titleValidation.isValid) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.INVALID_INPUT,
              message: 'Invalid session title',
              details: { errors: titleValidation.errors },
              timestamp: new Date().toISOString()
            }
          },
          { status: 400 }
        );
      }
      updatedTitle = titleValidation.sanitizedData;
    }
    
    // Prepare updates
    const updates: Partial<BusinessPlannerSession> = {};
    if (requestData.status) {
      updates.status = requestData.status as 'active' | 'completed' | 'archived';
    }
    if (updatedTitle) {
      updates.title = updatedTitle;
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'No valid updates provided',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Update session
    const { data: updatedSession, error: updateError } = await supabase
      .from('business_planner_sessions')
      .update(updates)
      .eq('id', requestData.session_id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating session:', updateError);
      
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.NOT_FOUND,
              message: 'Session not found',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Failed to update session',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data: updatedSession,
      message: 'Session updated successfully',
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `session_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in PUT /api/business-planner/sessions:', error);
    
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
 * DELETE /api/business-planner/sessions - Archive session
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<{ message: string }>>> {
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
    
    // Get session ID from query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Session ID is required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Archive session (soft delete)
    const { data: archivedSession, error: archiveError } = await supabase
      .from('business_planner_sessions')
      .update({ status: 'archived' })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (archiveError) {
      console.error('Error archiving session:', archiveError);
      
      if (archiveError.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.NOT_FOUND,
              message: 'Session not found',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Failed to archive session',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data: { message: SUCCESS_MESSAGES.SESSION_ARCHIVED },
      message: SUCCESS_MESSAGES.SESSION_ARCHIVED,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `session_archive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in DELETE /api/business-planner/sessions:', error);
    
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
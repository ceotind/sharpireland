/**
 * Business Planner Chat API Endpoint
 * Handles chat interactions with OpenAI integration, rate limiting, and usage tracking
 * 
 * @fileoverview Main chat endpoint for business planning conversations
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { 
  BusinessPlannerChatRequest,
  BusinessPlannerChatResponse,
  BusinessPlannerApiResponse,
  BusinessPlannerSession,
  BusinessPlannerConversation,
  BusinessPlannerUsage,
  BusinessPlannerSessionContext
} from '@/app/types/business-planner';
import { validateUserInput } from '@/app/utils/business-planner/validators';
import { createChatCompletionWithRetry } from '@/app/utils/business-planner/openai';
import { checkRateLimit, updateRateLimit, detectSuspiciousActivity } from '@/app/utils/business-planner/rate-limiter';
import { 
  FREE_CONVERSATIONS_LIMIT,
  PAID_CONVERSATIONS_COUNT,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  DEFAULT_SESSION_TITLE
} from '@/app/utils/business-planner/constants';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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
 * Check if user has remaining conversations
 * @param usage - User usage record
 * @returns Usage check result
 */
function checkUsageLimits(usage: BusinessPlannerUsage): {
  canContinue: boolean;
  needsUpgrade: boolean;
  remainingFree: number;
  remainingPaid: number;
  errorCode?: string;
  errorMessage?: string;
} {
  const remainingFree = Math.max(0, FREE_CONVERSATIONS_LIMIT - usage.free_conversations_used);
  const remainingPaid = usage.subscription_status === 'paid' 
    ? Math.max(0, PAID_CONVERSATIONS_COUNT - usage.paid_conversations_used)
    : 0;
  
  const totalRemaining = remainingFree + remainingPaid;
  
  if (totalRemaining <= 0) {
    return {
      canContinue: false,
      needsUpgrade: usage.subscription_status === 'free',
      remainingFree,
      remainingPaid,
      errorCode: usage.subscription_status === 'free' 
        ? ERROR_CODES.FREE_LIMIT_EXCEEDED 
        : ERROR_CODES.PAID_LIMIT_EXCEEDED,
      errorMessage: usage.subscription_status === 'free'
        ? 'Free conversation limit exceeded. Please upgrade to continue.'
        : 'Paid conversation limit exceeded. Please purchase more conversations.'
    };
  }
  
  return {
    canContinue: true,
    needsUpgrade: remainingFree <= 0 && usage.subscription_status === 'free',
    remainingFree,
    remainingPaid
  };
}

/**
 * Update usage after successful conversation
 * @param supabase - Supabase client
 * @param usage - Current usage record
 * @param tokensUsed - Tokens consumed in this conversation
 * @returns Updated usage record
 */
async function updateUsageAfterConversation(
  supabase: any,
  usage: BusinessPlannerUsage,
  tokensUsed: number
): Promise<BusinessPlannerUsage | null> {
  try {
    const updates: Partial<BusinessPlannerUsage> = {
      total_tokens_used: usage.total_tokens_used + tokensUsed
    };
    
    // Determine which conversation type to increment
    if (usage.subscription_status === 'paid' && usage.paid_conversations_used < PAID_CONVERSATIONS_COUNT) {
      updates.paid_conversations_used = usage.paid_conversations_used + 1;
    } else {
      updates.free_conversations_used = usage.free_conversations_used + 1;
    }
    
    const { data: updatedUsage, error } = await supabase
      .from('business_planner_usage')
      .update(updates)
      .eq('id', usage.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating usage:', error);
      return null;
    }
    
    return updatedUsage;
  } catch (error) {
    console.error('Unexpected error in updateUsageAfterConversation:', error);
    return null;
  }
}

/**
 * Get or create session for the conversation
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param sessionId - Session ID (optional)
 * @param context - Session context (for new sessions)
 * @returns Session record
 */
async function getOrCreateSession(
  supabase: any,
  userId: string,
  sessionId?: string,
  context?: BusinessPlannerSessionContext
): Promise<BusinessPlannerSession | null> {
  try {
    // If session ID provided, try to get existing session
    if (sessionId) {
      const { data: existingSession, error: fetchError } = await supabase
        .from('business_planner_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return null;
      }
      
      return existingSession;
    }
    
    // Create new session
    if (!context) {
      console.error('Context required for new session');
      return null;
    }
    
    const newSession = {
      user_id: userId,
      title: DEFAULT_SESSION_TITLE,
      context,
      status: 'active' as const
    };
    
    const { data: createdSession, error: createError } = await supabase
      .from('business_planner_sessions')
      .insert(newSession)
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating session:', createError);
      return null;
    }
    
    return createdSession;
  } catch (error) {
    console.error('Unexpected error in getOrCreateSession:', error);
    return null;
  }
}

/**
 * Save conversation message to database
 * @param supabase - Supabase client
 * @param sessionId - Session ID
 * @param userId - User ID
 * @param role - Message role
 * @param content - Message content
 * @param tokensUsed - Tokens used
 * @returns Saved conversation record
 */
async function saveConversationMessage(
  supabase: any,
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed: number = 0
): Promise<BusinessPlannerConversation | null> {
  try {
    const conversationData = {
      session_id: sessionId,
      user_id: userId,
      role,
      content,
      tokens_used: tokensUsed
    };
    
    const { data: savedConversation, error } = await supabase
      .from('business_planner_conversations')
      .insert(conversationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving conversation:', error);
      return null;
    }
    
    return savedConversation;
  } catch (error) {
    console.error('Unexpected error in saveConversationMessage:', error);
    return null;
  }
}

/**
 * Get conversation history for context
 * @param supabase - Supabase client
 * @param sessionId - Session ID
 * @param limit - Maximum number of messages to retrieve
 * @returns Conversation history
 */
async function getConversationHistory(
  supabase: any,
  sessionId: string,
  limit: number = 10
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  try {
    const { data: conversations, error } = await supabase
      .from('business_planner_conversations')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
    
    return conversations || [];
  } catch (error) {
    console.error('Unexpected error in getConversationHistory:', error);
    return [];
  }
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================

/**
 * POST /api/business-planner/chat - Handle chat messages
 */
export async function POST(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<BusinessPlannerChatResponse>>> {
  const startTime = Date.now();
  
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
    let requestData: BusinessPlannerChatRequest;
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
    
    // Validate input
    const validation = validateUserInput(requestData as unknown as Record<string, unknown>);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid input data',
            details: { errors: validation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    const { message, session_id, context } = validation.sanitizedData!;
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check for suspicious activity
    const suspiciousActivity = await detectSuspiciousActivity(
      user.id,
      clientIP,
      userAgent,
      requestData
    );
    
    // Check rate limits
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
              windowReset: rateLimitResult.windowReset.toISOString(),
              isBlocked: rateLimitResult.isBlocked,
              blockedUntil: rateLimitResult.blockedUntil?.toISOString()
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 429 }
      );
    }
    
    // Get or create usage record
    const usage = await getOrCreateUsage(supabase, user.id);
    if (!usage) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to check usage limits',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Check usage limits
    const usageCheck = checkUsageLimits(usage);
    if (!usageCheck.canContinue) {
      return NextResponse.json(
        {
          error: {
            code: usageCheck.errorCode!,
            message: usageCheck.errorMessage!,
            details: {
              remainingFree: usageCheck.remainingFree,
              remainingPaid: usageCheck.remainingPaid,
              needsUpgrade: usageCheck.needsUpgrade
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 402 }
      );
    }
    
    // Get or create session
    const session = await getOrCreateSession(supabase, user.id, session_id, context);
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to create or retrieve session',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Get conversation history for context
    const conversationHistory = await getConversationHistory(supabase, session.id);
    
    // Save user message
    const userMessage = await saveConversationMessage(
      supabase,
      session.id,
      user.id,
      'user',
      message
    );
    
    if (!userMessage) {
      console.warn('Failed to save user message, continuing with AI request');
    }
    
    // Create AI chat completion
    let aiResponse;
    try {
      aiResponse = await createChatCompletionWithRetry({
        message,
        context: session.context || context!,
        conversationHistory,
        maxTokens: 2000,
        temperature: 0.7
      });
    } catch (aiError: any) {
      console.error('AI completion error:', aiError);
      
      return NextResponse.json(
        {
          error: {
            code: aiError.code || ERROR_CODES.AI_SERVICE_ERROR,
            message: aiError.message || 'AI service temporarily unavailable',
            details: { retryable: aiError.retryable || false },
            timestamp: new Date().toISOString()
          }
        },
        { status: 503 }
      );
    }
    
    // Save AI response
    const assistantMessage = await saveConversationMessage(
      supabase,
      session.id,
      user.id,
      'assistant',
      aiResponse.message,
      aiResponse.tokensUsed
    );
    
    if (!assistantMessage) {
      console.warn('Failed to save assistant message');
    }
    
    // Update usage statistics
    const updatedUsage = await updateUsageAfterConversation(
      supabase,
      usage,
      aiResponse.tokensUsed
    );
    
    // Update rate limit
    await updateRateLimit({
      userId: user.id,
      ipAddress: clientIP,
      incrementSuspicious: suspiciousActivity.isSuspicious
    });
    
    // Calculate remaining conversations
    const finalUsage = updatedUsage || usage;
    const remainingFree = Math.max(0, FREE_CONVERSATIONS_LIMIT - finalUsage.free_conversations_used);
    const remainingPaid = finalUsage.subscription_status === 'paid'
      ? Math.max(0, PAID_CONVERSATIONS_COUNT - finalUsage.paid_conversations_used)
      : 0;
    
    // Prepare response
    const responseData: BusinessPlannerChatResponse = {
      message: aiResponse.message,
      session_id: session.id,
      tokens_used: aiResponse.tokensUsed,
      remaining_free_conversations: remainingFree,
      remaining_paid_conversations: remainingPaid,
      needs_upgrade: remainingFree <= 0 && finalUsage.subscription_status === 'free'
    };
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      data: responseData,
      message: SUCCESS_MESSAGES.MESSAGE_SENT,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/business-planner/chat:', error);
    
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
// METHOD NOT ALLOWED HANDLER
// =============================================================================

/**
 * Handle unsupported HTTP methods
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET method not supported for this endpoint',
        details: { allowedMethods: ['POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'PUT method not supported for this endpoint',
        details: { allowedMethods: ['POST'] },
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
        details: { allowedMethods: ['POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}
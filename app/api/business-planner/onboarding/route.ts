/**
 * Business Planner Onboarding API Endpoint
 * Handles user onboarding data collection and profile creation
 * 
 * @fileoverview Onboarding endpoint for business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  BusinessPlannerOnboardingData,
  BusinessPlannerProfile,
  BusinessPlannerApiResponse,
  BusinessPlannerSessionContext,
  BusinessPlannerSession,
  BusinessPlannerUsage
} from '@/app/types/business-planner';
import { validateOnboardingData } from '@/app/utils/business-planner/validators';
import { checkRateLimit, updateRateLimit } from '@/app/utils/business-planner/rate-limiter';
import {
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
 * Create or update business planner profile
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param onboardingData - Onboarding form data
 * @returns Created/updated profile
 */
async function createOrUpdateProfile(
  supabase: SupabaseClient,
  userId: string,
  onboardingData: BusinessPlannerOnboardingData
): Promise<BusinessPlannerProfile | null> {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('business_planner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const profileData = {
      user_id: userId,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      business_type: onboardingData.business_type,
      business_stage: onboardingData.business_stage,
      industry: onboardingData.industry
    };
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing profile:', fetchError);
      return null;
    }
    
    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('business_planner_profiles')
        .update(profileData)
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return null;
      }
      
      return updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('business_planner_profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }
      
      return newProfile;
    }
  } catch (error) {
    console.error('Unexpected error in createOrUpdateProfile:', error);
    return null;
  }
}

/**
 * Create initial session with onboarding context
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param onboardingData - Onboarding form data
 * @returns Created session
 */
async function createInitialSession(
  supabase: SupabaseClient,
  userId: string,
  onboardingData: BusinessPlannerOnboardingData
): Promise<BusinessPlannerSession | null> {
  try {
    const sessionContext: BusinessPlannerSessionContext = {
      business_type: onboardingData.business_type,
      target_market: onboardingData.target_market,
      challenge: onboardingData.challenge,
      created_at: new Date().toISOString()
    };
    
    // Add additional_context only if it exists
    if (onboardingData.additional_context) {
      sessionContext.additional_context = onboardingData.additional_context;
    }
    
    const sessionData = {
      user_id: userId,
      title: DEFAULT_SESSION_TITLE,
      context: sessionContext,
      status: 'active' as const
    };
    
    const { data: newSession, error: createError } = await supabase
      .from('business_planner_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating initial session:', createError);
      return null;
    }
    
    return newSession;
  } catch (error) {
    console.error('Unexpected error in createInitialSession:', error);
    return null;
  }
}

/**
 * Get or create user usage record
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns Usage record
 */
async function getOrCreateUsage(supabase: SupabaseClient, userId: string): Promise<BusinessPlannerUsage | null> {
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
  } catch (error: unknown) {
    console.error('Unexpected error in getOrCreateUsage:', error);
    return null;
  }
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================

/**
 * POST /api/business-planner/onboarding - Handle onboarding data submission
 */
export async function POST(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<{ 
  profile: BusinessPlannerProfile; 
  session: BusinessPlannerSession;
  session_id: string;
}>>> {
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
    let requestData: BusinessPlannerOnboardingData;
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
    
    // Validate onboarding data
    const validation = validateOnboardingData(requestData as unknown as Record<string, unknown>);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid onboarding data',
            details: { errors: validation.errors },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    const clientIP = getClientIP(request);
    
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
    
    const sanitizedData = validation.onboardingData!;
    
    // Create or update business planner profile
    const profile = await createOrUpdateProfile(supabase, user.id, sanitizedData);
    if (!profile) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to create or update profile',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Create initial session with context
    const session = await createInitialSession(supabase, user.id, sanitizedData);
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.DATABASE_ERROR,
            message: 'Unable to create initial session',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }
    
    // Ensure usage record exists
    const usage = await getOrCreateUsage(supabase, user.id);
    if (!usage) {
      console.warn('Failed to create usage record for user:', user.id);
    }
    
    // Update rate limit
    await updateRateLimit({
      userId: user.id,
      ipAddress: clientIP
    });
    
    const duration = Date.now() - startTime;
    console.log(`[API] /api/business-planner/onboarding completed in ${duration}ms`);
    return NextResponse.json({
      data: {
        profile,
        session,
        session_id: session.id
      },
      message: SUCCESS_MESSAGES.ONBOARDING_COMPLETED,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/business-planner/onboarding:', error);
    
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
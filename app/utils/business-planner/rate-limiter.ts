/**
 * Business Planner Rate Limiter
 * Implements rate limiting and suspicious activity detection for the business planner feature
 * 
 * @fileoverview Rate limiting utilities with database integration for security and abuse prevention
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { createClient } from '@/app/utils/supabase/server';
import { BusinessPlannerRateLimit } from '@/app/types/business-planner';
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  MAX_SUSPICIOUS_ACTIVITY_COUNT,
  SUSPICIOUS_ACTIVITY_BLOCK_MS,
  ERROR_CODES
} from './constants';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Current request count in the window */
  currentCount: number;
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Time when the current window started */
  windowStart: Date;
  /** Time when the window will reset */
  windowReset: Date;
  /** Remaining requests in the current window */
  remainingRequests: number;
  /** Whether user is currently blocked */
  isBlocked: boolean;
  /** Time when block expires (if blocked) */
  blockedUntil?: Date;
  /** Error code if request is denied */
  errorCode?: string;
  /** Human-readable error message */
  errorMessage?: string;
}

/**
 * Rate limit update parameters
 */
export interface RateLimitUpdateParams {
  /** User ID */
  userId: string;
  /** IP address */
  ipAddress?: string;
  /** Whether to increment suspicious activity counter */
  incrementSuspicious?: boolean;
  /** Whether to reset the rate limit window */
  resetWindow?: boolean;
}

/**
 * Suspicious activity detection result
 */
export interface SuspiciousActivityResult {
  /** Whether activity is considered suspicious */
  isSuspicious: boolean;
  /** Current suspicious activity count */
  suspiciousCount: number;
  /** Whether user should be blocked */
  shouldBlock: boolean;
  /** Reasons for suspicious activity detection */
  reasons: string[];
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

/**
 * Get or create rate limit record for a user
 * @param userId - User ID
 * @param ipAddress - IP address (optional)
 * @returns Rate limit record
 */
async function getRateLimitRecord(
  userId: string,
  ipAddress?: string
): Promise<BusinessPlannerRateLimit | null> {
  try {
    const supabase = await createClient();
    
    // Try to get existing record
    const { data: existingRecord, error: fetchError } = await supabase
      .from('business_planner_rate_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('ip_address', ipAddress || null)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching rate limit record:', fetchError);
      return null;
    }
    
    if (existingRecord) {
      return existingRecord;
    }
    
    // Create new record if none exists
    const newRecord = {
      user_id: userId,
      ip_address: ipAddress || null,
      request_count: 0,
      window_start: new Date().toISOString(),
      blocked_until: null,
      suspicious_activity_count: 0
    };
    
    const { data: createdRecord, error: createError } = await supabase
      .from('business_planner_rate_limits')
      .insert(newRecord)
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating rate limit record:', createError);
      return null;
    }
    
    return createdRecord;
  } catch (error) {
    console.error('Unexpected error in getRateLimitRecord:', error);
    return null;
  }
}

/**
 * Update rate limit record in database
 * @param recordId - Rate limit record ID
 * @param updates - Updates to apply
 * @returns Updated record
 */
async function updateRateLimitRecord(
  recordId: string,
  updates: Partial<BusinessPlannerRateLimit>
): Promise<BusinessPlannerRateLimit | null> {
  try {
    const supabase = await createClient();
    
    const { data: updatedRecord, error } = await supabase
      .from('business_planner_rate_limits')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating rate limit record:', error);
      return null;
    }
    
    return updatedRecord;
  } catch (error) {
    console.error('Unexpected error in updateRateLimitRecord:', error);
    return null;
  }
}

// =============================================================================
// RATE LIMITING LOGIC
// =============================================================================

/**
 * Check if the current time window has expired
 * @param windowStart - Start time of the current window
 * @returns Whether the window has expired
 */
function isWindowExpired(windowStart: string): boolean {
  const windowStartTime = new Date(windowStart).getTime();
  const currentTime = Date.now();
  const windowAge = currentTime - windowStartTime;
  
  return windowAge >= RATE_LIMIT_WINDOW_MS;
}

/**
 * Calculate window reset time
 * @param windowStart - Start time of the current window
 * @returns Reset time
 */
function calculateWindowReset(windowStart: string): Date {
  const windowStartTime = new Date(windowStart).getTime();
  const resetTime = windowStartTime + RATE_LIMIT_WINDOW_MS;
  return new Date(resetTime);
}

/**
 * Check if user is currently blocked
 * @param blockedUntil - Block expiry time (if any)
 * @returns Whether user is blocked
 */
function isUserBlocked(blockedUntil: string | null): boolean {
  if (!blockedUntil) {
    return false;
  }
  
  const blockExpiry = new Date(blockedUntil).getTime();
  const currentTime = Date.now();
  
  return currentTime < blockExpiry;
}

/**
 * Check rate limit for a user
 * @param userId - User ID
 * @param ipAddress - IP address (optional)
 * @returns Rate limit check result
 */
export async function checkRateLimit(
  userId: string,
  ipAddress?: string
): Promise<RateLimitResult> {
  try {
    // Get rate limit record
    const record = await getRateLimitRecord(userId, ipAddress);
    
    if (!record) {
      return {
        allowed: false,
        currentCount: 0,
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowStart: new Date(),
        windowReset: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
        remainingRequests: 0,
        isBlocked: false,
        errorCode: ERROR_CODES.DATABASE_ERROR,
        errorMessage: 'Unable to check rate limit'
      };
    }
    
    // Check if user is blocked
    if (isUserBlocked(record.blocked_until)) {
      return {
        allowed: false,
        currentCount: record.request_count,
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowStart: new Date(record.window_start),
        windowReset: calculateWindowReset(record.window_start),
        remainingRequests: 0,
        isBlocked: true,
        blockedUntil: new Date(record.blocked_until!),
        errorCode: ERROR_CODES.USER_BLOCKED,
        errorMessage: 'User is temporarily blocked due to suspicious activity'
      };
    }
    
    // Check if window has expired and needs reset
    if (isWindowExpired(record.window_start)) {
      // Reset the window
      const now = new Date().toISOString();
      const updatedRecord = await updateRateLimitRecord(record.id, {
        request_count: 0,
        window_start: now,
        blocked_until: null
      });
      
      if (updatedRecord) {
        return {
          allowed: true,
          currentCount: 0,
          maxRequests: RATE_LIMIT_MAX_REQUESTS,
          windowStart: new Date(now),
          windowReset: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
          remainingRequests: RATE_LIMIT_MAX_REQUESTS,
          isBlocked: false
        };
      }
    }
    
    // Check if rate limit is exceeded
    if (record.request_count >= RATE_LIMIT_MAX_REQUESTS) {
      return {
        allowed: false,
        currentCount: record.request_count,
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowStart: new Date(record.window_start),
        windowReset: calculateWindowReset(record.window_start),
        remainingRequests: 0,
        isBlocked: false,
        errorCode: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        errorMessage: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per ${RATE_LIMIT_WINDOW_MS / 60000} minutes.`
      };
    }
    
    // Rate limit check passed
    return {
      allowed: true,
      currentCount: record.request_count,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowStart: new Date(record.window_start),
      windowReset: calculateWindowReset(record.window_start),
      remainingRequests: RATE_LIMIT_MAX_REQUESTS - record.request_count,
      isBlocked: false
    };
    
  } catch (error) {
    console.error('Error in checkRateLimit:', error);
    return {
      allowed: false,
      currentCount: 0,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowStart: new Date(),
      windowReset: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
      remainingRequests: 0,
      isBlocked: false,
      errorCode: ERROR_CODES.INTERNAL_ERROR,
      errorMessage: 'Internal error checking rate limit'
    };
  }
}

/**
 * Update rate limit after a request
 * @param params - Rate limit update parameters
 * @returns Updated rate limit result
 */
export async function updateRateLimit(
  params: RateLimitUpdateParams
): Promise<RateLimitResult> {
  try {
    const { userId, ipAddress, incrementSuspicious = false, resetWindow = false } = params;
    
    // Get current record
    const record = await getRateLimitRecord(userId, ipAddress);
    
    if (!record) {
      return {
        allowed: false,
        currentCount: 0,
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowStart: new Date(),
        windowReset: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
        remainingRequests: 0,
        isBlocked: false,
        errorCode: ERROR_CODES.DATABASE_ERROR,
        errorMessage: 'Unable to update rate limit'
      };
    }
    
    // Prepare updates
    const updates: Partial<BusinessPlannerRateLimit> = {};
    
    if (resetWindow) {
      updates.request_count = 1;
      updates.window_start = new Date().toISOString();
      updates.blocked_until = null;
    } else {
      updates.request_count = record.request_count + 1;
    }
    
    if (incrementSuspicious) {
      const newSuspiciousCount = record.suspicious_activity_count + 1;
      updates.suspicious_activity_count = newSuspiciousCount;
      
      // Block user if suspicious activity threshold is reached
      if (newSuspiciousCount >= MAX_SUSPICIOUS_ACTIVITY_COUNT) {
        const blockUntil = new Date(Date.now() + SUSPICIOUS_ACTIVITY_BLOCK_MS);
        updates.blocked_until = blockUntil.toISOString();
      }
    }
    
    // Update the record
    const updatedRecord = await updateRateLimitRecord(record.id, updates);
    
    if (!updatedRecord) {
      return {
        allowed: false,
        currentCount: record.request_count,
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowStart: new Date(record.window_start),
        windowReset: calculateWindowReset(record.window_start),
        remainingRequests: 0,
        isBlocked: false,
        errorCode: ERROR_CODES.DATABASE_ERROR,
        errorMessage: 'Unable to update rate limit'
      };
    }
    
    // Return updated result
    const isBlocked = isUserBlocked(updatedRecord.blocked_until);
    const remainingRequests = Math.max(0, RATE_LIMIT_MAX_REQUESTS - updatedRecord.request_count);
    
    const result: RateLimitResult = {
      allowed: !isBlocked && updatedRecord.request_count <= RATE_LIMIT_MAX_REQUESTS,
      currentCount: updatedRecord.request_count,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowStart: new Date(updatedRecord.window_start),
      windowReset: calculateWindowReset(updatedRecord.window_start),
      remainingRequests,
      isBlocked
    };
    
    if (updatedRecord.blocked_until) {
      result.blockedUntil = new Date(updatedRecord.blocked_until);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in updateRateLimit:', error);
    return {
      allowed: false,
      currentCount: 0,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowStart: new Date(),
      windowReset: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
      remainingRequests: 0,
      isBlocked: false,
      errorCode: ERROR_CODES.INTERNAL_ERROR,
      errorMessage: 'Internal error updating rate limit'
    };
  }
}

// =============================================================================
// SUSPICIOUS ACTIVITY DETECTION
// =============================================================================

/**
 * Detect suspicious activity patterns
 * @param userId - User ID
 * @param ipAddress - IP address
 * @param userAgent - User agent string
 * @param requestData - Request data for analysis
 * @returns Suspicious activity result
 */
export async function detectSuspiciousActivity(
  userId: string,
  ipAddress?: string,
  userAgent?: string,
  requestData?: any
): Promise<SuspiciousActivityResult> {
  const reasons: string[] = [];
  let isSuspicious = false;
  
  try {
    // Get current rate limit record
    const record = await getRateLimitRecord(userId, ipAddress);
    const suspiciousCount = record?.suspicious_activity_count || 0;
    
    // Check for bot-like user agents
    if (userAgent) {
      const botPatterns = [
        /bot|crawler|spider|scraper/i,
        /curl|wget|python|php/i,
        /postman|insomnia|httpie/i
      ];
      
      if (botPatterns.some(pattern => pattern.test(userAgent))) {
        reasons.push('Bot-like user agent detected');
        isSuspicious = true;
      }
    }
    
    // Check for rapid successive requests (if we have timing data)
    if (record && record.request_count > 0) {
      const windowAge = Date.now() - new Date(record.window_start).getTime();
      const requestRate = record.request_count / (windowAge / 1000); // requests per second
      
      if (requestRate > 2) { // More than 2 requests per second
        reasons.push('Unusually high request rate');
        isSuspicious = true;
      }
    }
    
    // Check for suspicious content patterns in request data
    if (requestData && typeof requestData === 'object') {
      const requestString = JSON.stringify(requestData).toLowerCase();
      
      const suspiciousPatterns = [
        /script|javascript|eval|function/,
        /select|insert|update|delete|drop/,
        /union|or\s+1=1|and\s+1=1/,
        /<script|<iframe|<object|<embed/
      ];
      
      if (suspiciousPatterns.some(pattern => pattern.test(requestString))) {
        reasons.push('Suspicious content patterns detected');
        isSuspicious = true;
      }
    }
    
    // Check if user has exceeded suspicious activity threshold
    const shouldBlock = suspiciousCount >= MAX_SUSPICIOUS_ACTIVITY_COUNT - 1;
    
    return {
      isSuspicious,
      suspiciousCount,
      shouldBlock,
      reasons
    };
    
  } catch (error) {
    console.error('Error in detectSuspiciousActivity:', error);
    return {
      isSuspicious: false,
      suspiciousCount: 0,
      shouldBlock: false,
      reasons: []
    };
  }
}

/**
 * Check if user is currently blocked
 * @param userId - User ID
 * @param ipAddress - IP address (optional)
 * @returns Whether user is blocked and block details
 */
export async function isBlocked(
  userId: string,
  ipAddress?: string
): Promise<{
  blocked: boolean;
  blockedUntil?: Date;
  reason?: string;
}> {
  try {
    const record = await getRateLimitRecord(userId, ipAddress);
    
    if (!record || !record.blocked_until) {
      return { blocked: false };
    }
    
    const blocked = isUserBlocked(record.blocked_until);
    
    const result: { blocked: boolean; blockedUntil?: Date; reason?: string } = {
      blocked
    };
    
    if (blocked && record.blocked_until) {
      result.blockedUntil = new Date(record.blocked_until);
      result.reason = 'Temporary block due to suspicious activity';
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in isBlocked:', error);
    return { blocked: false };
  }
}

/**
 * Reset rate limit for a user (admin function)
 * @param userId - User ID
 * @param ipAddress - IP address (optional)
 * @returns Whether reset was successful
 */
export async function resetRateLimit(
  userId: string,
  ipAddress?: string
): Promise<boolean> {
  try {
    const record = await getRateLimitRecord(userId, ipAddress);
    
    if (!record) {
      return false;
    }
    
    const updates = {
      request_count: 0,
      window_start: new Date().toISOString(),
      blocked_until: null,
      suspicious_activity_count: 0
    };
    
    const updatedRecord = await updateRateLimitRecord(record.id, updates);
    return !!updatedRecord;
    
  } catch (error) {
    console.error('Error in resetRateLimit:', error);
    return false;
  }
}

// =============================================================================
// EXPORT GROUPED FUNCTIONS
// =============================================================================

/**
 * All rate limiting functions
 */
export const RateLimiter = {
  checkRateLimit,
  updateRateLimit,
  resetRateLimit
} as const;

/**
 * All security functions
 */
export const SecurityUtils = {
  detectSuspiciousActivity,
  isBlocked
} as const;
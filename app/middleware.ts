/**
 * Next.js Middleware
 * Handles security, rate limiting, and request processing for the application
 * 
 * @fileoverview Global middleware with enhanced security for business planner routes
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, analyzeUserAgent } from '@/app/utils/business-planner/security';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Rate limiting configuration per route pattern
 */
const RATE_LIMITS = {
  '/api/business-planner/chat': { requests: 10, window: 60 }, // 10 requests per minute
  '/api/business-planner/onboarding': { requests: 5, window: 300 }, // 5 requests per 5 minutes
  '/api/business-planner/export': { requests: 3, window: 300 }, // 3 requests per 5 minutes
  '/api/business-planner/admin': { requests: 20, window: 60 }, // 20 requests per minute for admins
  '/api/business-planner/sessions': { requests: 15, window: 60 }, // 15 requests per minute
  '/api/business-planner/usage': { requests: 30, window: 60 }, // 30 requests per minute
  '/api/business-planner/payment': { requests: 5, window: 300 }, // 5 requests per 5 minutes
  default: { requests: 100, window: 60 } // Default: 100 requests per minute
};





/**
 * Blocked user agents patterns
 */
const BLOCKED_USER_AGENTS = [
  /sqlmap|nikto|nmap|burp|scanner/i,
  /hack|exploit|attack|malware/i,
  /bot.*bot|crawler.*crawler/i // Aggressive bot patterns
];

/**
 * Blocked IP addresses (example - in production, this would come from a database)
 */
const BLOCKED_IPS = new Set<string>([
  // Add known malicious IPs here
]);

/**
 * Countries to block (ISO country codes)
 */
const BLOCKED_COUNTRIES = new Set<string>([
  // Add country codes to block if needed
  // 'CN', 'RU', etc.
]);

// =============================================================================
// UTILITY FUNCTIONS
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
 * Get country from request headers (Vercel provides this)
 * @param request - Next.js request object
 * @returns Country code or null
 */
function getCountryCode(request: NextRequest): string | null {
  return request.headers.get('x-vercel-ip-country') || 
         request.headers.get('cf-ipcountry') || 
         null;
}

/**
 * Check if IP is blocked
 * @param ip - IP address to check
 * @returns Whether IP is blocked
 */
function isIPBlocked(ip: string): boolean {
  return BLOCKED_IPS.has(ip);
}

/**
 * Check if country is blocked
 * @param countryCode - Country code to check
 * @returns Whether country is blocked
 */
function isCountryBlocked(countryCode: string | null): boolean {
  return countryCode ? BLOCKED_COUNTRIES.has(countryCode.toUpperCase()) : false;
}

/**
 * Check if user agent is blocked
 * @param userAgent - User agent string
 * @returns Whether user agent is blocked
 */
function isUserAgentBlocked(userAgent: string): boolean {
  if (!userAgent) return true; // Block requests without user agent
  
  return BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent));
}

/**
 * Get rate limit for path
 * @param pathname - Request pathname
 * @returns Rate limit configuration
 */
function getRateLimitForPath(pathname: string): { requests: number; window: number } {
  // Find the most specific matching pattern
  const matchingPath = Object.keys(RATE_LIMITS).find(path => 
    path !== 'default' && pathname.startsWith(path)
  );
  
  return matchingPath ? RATE_LIMITS[matchingPath as keyof typeof RATE_LIMITS] : RATE_LIMITS.default;
}

/**
 * Simple in-memory rate limiter (in production, use Redis or similar)
 */
class SimpleRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  /**
   * Check if request is allowed
   * @param key - Rate limit key (usually IP + path)
   * @param limit - Request limit
   * @param windowMs - Time window in milliseconds
   * @returns Whether request is allowed and current count
   */
  isAllowed(key: string, limit: number, windowMs: number): { allowed: boolean; count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.requests.get(key);
    
    if (!existing || now > existing.resetTime) {
      // New window or expired window
      const resetTime = now + windowMs;
      this.requests.set(key, { count: 1, resetTime });
      return { allowed: true, count: 1, resetTime };
    }
    
    if (existing.count >= limit) {
      // Rate limit exceeded
      return { allowed: false, count: existing.count, resetTime: existing.resetTime };
    }
    
    // Increment count
    existing.count++;
    this.requests.set(key, existing);
    return { allowed: true, count: existing.count, resetTime: existing.resetTime };
  }
  
  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Global rate limiter instance
const rateLimiter = new SimpleRateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

// =============================================================================
// MIDDLEWARE FUNCTIONS
// =============================================================================

/**
 * Security checks middleware
 * @param request - Next.js request object
 * @returns Response if blocked, null if allowed
 */
function securityChecks(request: NextRequest): NextResponse | null {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const countryCode = getCountryCode(request);
  
  // Check blocked IP
  if (isIPBlocked(ip)) {
    console.log(`Blocked request from IP: ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Check blocked country
  if (isCountryBlocked(countryCode)) {
    console.log(`Blocked request from country: ${countryCode}, IP: ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Check blocked user agent
  if (isUserAgentBlocked(userAgent)) {
    console.log(`Blocked request with user agent: ${userAgent}, IP: ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Analyze user agent for suspicious patterns
  const userAgentAnalysis = analyzeUserAgent(userAgent);
  if (userAgentAnalysis.riskLevel === 'high' && userAgentAnalysis.isSuspicious) {
    console.log(`Suspicious user agent detected: ${userAgent}, IP: ${ip}, Reasons: ${userAgentAnalysis.reasons.join(', ')}`);
    // For high-risk suspicious agents, we might want to block or add additional verification
    // For now, we'll log and continue, but you could return a 403 here
  }
  
  return null; // Allow request
}

/**
 * Rate limiting middleware
 * @param request - Next.js request object
 * @returns Response if rate limited, null if allowed
 */
function rateLimitingMiddleware(request: NextRequest): NextResponse | null {
  const ip = getClientIP(request);
  const pathname = request.nextUrl.pathname;
  const rateLimit = getRateLimitForPath(pathname);
  
  const key = `${ip}:${pathname}`;
  const windowMs = rateLimit.window * 1000; // Convert to milliseconds
  
  const result = rateLimiter.isAllowed(key, rateLimit.requests, windowMs);
  
  if (!result.allowed) {
    const resetTime = new Date(result.resetTime).toISOString();
    console.log(`Rate limit exceeded for IP: ${ip}, Path: ${pathname}, Count: ${result.count}/${rateLimit.requests}`);
    
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': rateLimit.requests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTime,
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
      }
    });
  }
  
  // Add rate limit headers to successful responses
  const remaining = rateLimit.requests - result.count;
  const resetTime = new Date(result.resetTime).toISOString();
  
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', rateLimit.requests.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', resetTime);
  
  return response;
}

/**
 * Add security headers to response
 * @param response - Next.js response object
 * @param pathname - Request pathname
 * @returns Response with security headers
 */
function addSecurityHeaders(response: NextResponse, pathname: string): NextResponse {
  const securityHeaders = getSecurityHeaders({
    allowInlineStyles: pathname.startsWith('/dashboard/'), // Allow inline styles for dashboard
    allowInlineScripts: false, // Never allow inline scripts
    allowedOrigins: ["'self'", 'https://api.openai.com'] // Allow OpenAI API
  });
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });
  
  // Add additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  return response;
}

/**
 * Log suspicious activity
 * @param request - Next.js request object
 * @param reason - Reason for logging
 */
function logSuspiciousActivity(request: NextRequest, reason: string): void {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  
  console.warn(`Suspicious activity detected:`, {
    reason,
    ip,
    userAgent,
    pathname,
    method,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries())
  });
  
  // In production, you might want to:
  // 1. Send alerts to monitoring system
  // 2. Store in database for analysis
  // 3. Update IP reputation scores
  // 4. Trigger additional security measures
}

// =============================================================================
// MAIN MIDDLEWARE FUNCTION
// =============================================================================

/**
 * Main middleware function
 * @param request - Next.js request object
 * @returns Response or continues to next middleware/route
 */
export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  
  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  try {
    // 1. Security checks
    const securityResponse = securityChecks(request);
    if (securityResponse) {
      logSuspiciousActivity(request, 'Security check failed');
      return securityResponse;
    }
    
    // 2. Rate limiting (only for API routes and sensitive paths)
    if (pathname.startsWith('/api/') || pathname.startsWith('/dashboard/')) {
      const rateLimitResponse = rateLimitingMiddleware(request);
      if (rateLimitResponse) {
        if (rateLimitResponse.status === 429) {
          logSuspiciousActivity(request, 'Rate limit exceeded');
        }
        return addSecurityHeaders(rateLimitResponse, pathname);
      }
    }
    
    // 3. Business planner specific checks
    if (pathname.startsWith('/api/business-planner/')) {
      // Additional validation for business planner API routes
      const contentType = request.headers.get('content-type');
      
      // Ensure POST/PUT requests have proper content type
      if ((method === 'POST' || method === 'PUT') && 
          contentType && 
          !contentType.includes('application/json')) {
        logSuspiciousActivity(request, 'Invalid content type for business planner API');
        return new NextResponse('Bad Request', { status: 400 });
      }
      
      // Check for suspicious request patterns
      const userAgent = request.headers.get('user-agent') || '';
      const userAgentAnalysis = analyzeUserAgent(userAgent);
      
      if (userAgentAnalysis.riskLevel === 'high') {
        logSuspiciousActivity(request, `High-risk user agent: ${userAgentAnalysis.reasons.join(', ')}`);
        // Could add additional verification here
      }
    }
    
    // 4. Create response and add security headers
    const response = NextResponse.next();
    return addSecurityHeaders(response, pathname);
    
  } catch (error) {
    console.error('Middleware error:', error);
    logSuspiciousActivity(request, `Middleware error: ${error}`);
    
    // Return a generic error response
    const errorResponse = new NextResponse('Internal Server Error', { status: 500 });
    return addSecurityHeaders(errorResponse, pathname);
  }
}

// =============================================================================
// MIDDLEWARE CONFIGURATION
// =============================================================================

/**
 * Middleware configuration
 * Specifies which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
    '/dashboard/:path*',
    '/business-planner/:path*'
  ]
};

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default middleware;
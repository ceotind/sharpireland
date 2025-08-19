import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      const entry = this.store[key];
      if (entry && entry.resetTime < now) {
        delete this.store[key];
      }
    });
  }

  private getClientId(request: NextRequest): string {
    // Try to get real IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    let clientIp = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
    
    // Fallback to user agent if IP is not available (for development)
    if (clientIp === 'unknown' || clientIp === '::1' || clientIp === '127.0.0.1') {
      const userAgent = request.headers.get('user-agent') || 'unknown';
      clientIp = `${clientIp}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`;
    }
    
    return clientIp;
  }

  public isRateLimited(request: NextRequest): {
    isLimited: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number | undefined;
  } {
    const clientId = this.getClientId(request);
    const now = Date.now();
    
    // Initialize or reset if window has passed
    if (!this.store[clientId] || this.store[clientId].resetTime < now) {
      this.store[clientId] = {
        count: 0,
        resetTime: now + this.windowMs
      };
    }
    
    const clientData = this.store[clientId];
    clientData.count++;
    
    const remaining = Math.max(0, this.maxRequests - clientData.count);
    const isLimited = clientData.count > this.maxRequests;
    const retryAfter = isLimited ? Math.ceil((clientData.resetTime - now) / 1000) : undefined;
    
    return {
      isLimited,
      remaining,
      resetTime: clientData.resetTime,
      retryAfter
    };
  }
}

// Create singleton instance with more appropriate limits for performance metrics
const rateLimiter = new RateLimiter(
  process.env.NODE_ENV === 'production'
    ? parseInt(process.env.RATE_LIMIT_MAX || '20') // Increased from 5 to 20 for performance metrics
    : 50, // More lenient in development
  parseInt(process.env.RATE_LIMIT_WINDOW || '900000') // 15 minutes
);

export default rateLimiter;
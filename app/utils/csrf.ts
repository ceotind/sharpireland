import { NextRequest } from 'next/server';
import crypto from 'crypto';

class CSRFProtection {
  private secret: string;

  constructor() {
    this.secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
  }

  // Generate CSRF token
  public generateToken(): string {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const payload = `${timestamp}:${randomBytes}`;
    
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(payload);
    const signature = hmac.digest('hex');
    
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  // Verify CSRF token
  public verifyToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const [timestamp, randomBytes, signature] = decoded.split(':');
      
      if (!timestamp || !randomBytes || !signature) {
        return false;
      }

      // Check if token is not older than 1 hour
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (now - tokenTime > oneHour) {
        return false;
      }

      // Verify signature
      const payload = `${timestamp}:${randomBytes}`;
      const hmac = crypto.createHmac('sha256', this.secret);
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch {
      return false;
    }
  }

  // Extract CSRF token from request
  public getTokenFromRequest(request: NextRequest): string | null {
    // Check header first
    const headerToken = request.headers.get('x-csrf-token');
    if (headerToken) {
      return headerToken;
    }

    // Check body for form submissions
    return null;
  }

  // Validate request has valid CSRF token
  public async validateRequest(request: NextRequest, body?: { csrfToken?: string }): Promise<boolean> {
    // Skip CSRF for GET requests
    if (request.method === 'GET') {
      return true;
    }

    // Get token from header or body
    let token = this.getTokenFromRequest(request);
    
    if (!token && body && body.csrfToken) {
      token = body.csrfToken;
    }

    if (!token) {
      return false;
    }

    return this.verifyToken(token);
  }
}

// Create singleton instance
const csrfProtection = new CSRFProtection();

export default csrfProtection;
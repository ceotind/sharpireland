import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../utils/rate-limit';

interface ErrorLogData {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for error logging
    const rateLimitResult = rateLimiter.isRateLimited(request);
    if (rateLimitResult.isLimited) {
      return NextResponse.json(
        { success: false, message: 'Too many error reports' },
        { status: 429 }
      );
    }

    // Parse request body
    let errorData: ErrorLogData;
    try {
      const text = await request.text();
      if (text.length > 50000) { // 50KB limit for error logs
        throw new Error('Error log too large');
      }
      
      // Handle empty or malformed JSON
      if (!text.trim()) {
        return NextResponse.json(
          { success: false, message: 'Empty request body' },
          { status: 400 }
        );
      }
      
      try {
        errorData = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return NextResponse.json(
          { success: false, message: 'Invalid JSON format' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error reading request body:', error);
      return NextResponse.json(
        { success: false, message: 'Error reading request body' },
        { status: 400 }
      );
    }

    // Validate required fields with more detailed error messages
    if (!errorData) {
      return NextResponse.json(
        { success: false, message: 'Missing error data' },
        { status: 400 }
      );
    }
    
    if (!errorData.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required field: message' },
        { status: 400 }
      );
    }
    
    if (!errorData.timestamp) {
      return NextResponse.json(
        { success: false, message: 'Missing required field: timestamp' },
        { status: 400 }
      );
    }

    // Get client information
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Enhanced error log with server-side information
    const enhancedErrorLog = {
      ...errorData,
      serverTimestamp: new Date().toISOString(),
      clientIp,
      headers: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        acceptLanguage: request.headers.get('accept-language'),
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    };

    // Log to console (in production, you'd send to external service)
    console.error('Client Error Report:', JSON.stringify(enhancedErrorLog, null, 2));

    // In production, you would send this to your error tracking service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to external logging service
      // await sendToLoggingService(enhancedErrorLog);
    }

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully'
    });

  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}
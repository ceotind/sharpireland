/**
 * Business Planner Export API Endpoint
 * Handles exporting conversation sessions in various formats
 * 
 * @fileoverview Export endpoint for business planner conversations
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { 
  BusinessPlannerSession,
  BusinessPlannerConversation,
  BusinessPlannerApiResponse
} from '@/app/types/business-planner';
import { checkRateLimit, updateRateLimit } from '@/app/utils/business-planner/rate-limiter';
import { 
  ERROR_CODES,
  SUCCESS_MESSAGES
} from '@/app/utils/business-planner/constants';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Export format options
 */
type ExportFormat = 'markdown' | 'json' | 'txt';

/**
 * Export request parameters
 */
interface ExportParams {
  session_id?: string;
  format?: ExportFormat;
  include_metadata?: boolean;
}

/**
 * Exported conversation data
 */
interface ExportedConversation {
  session: BusinessPlannerSession;
  conversations: BusinessPlannerConversation[];
  metadata: {
    exported_at: string;
    total_messages: number;
    total_tokens: number;
    session_duration?: string;
  };
}

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
 * Get session with conversations
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param sessionId - Session ID (optional, if not provided exports all sessions)
 * @returns Session data with conversations
 */
async function getSessionData(
  supabase: any,
  userId: string,
  sessionId?: string
): Promise<ExportedConversation[]> {
  try {
    let sessionsQuery = supabase
      .from('business_planner_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (sessionId) {
      sessionsQuery = sessionsQuery.eq('id', sessionId);
    }
    
    const { data: sessions, error: sessionsError } = await sessionsQuery;
    
    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return [];
    }
    
    if (!sessions || sessions.length === 0) {
      return [];
    }
    
    const exportedData: ExportedConversation[] = [];
    
    for (const session of sessions) {
      // Get conversations for this session
      const { data: conversations, error: conversationsError } = await supabase
        .from('business_planner_conversations')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      
      if (conversationsError) {
        console.error('Error fetching conversations for session:', session.id, conversationsError);
        continue;
      }
      
      // Calculate metadata
      const totalTokens = conversations?.reduce((sum: number, conv: BusinessPlannerConversation) => sum + (conv.tokens_used || 0), 0) || 0;
      const sessionStart = new Date(session.created_at);
      const sessionEnd = conversations && conversations.length > 0 
        ? new Date(conversations[conversations.length - 1].created_at)
        : sessionStart;
      
      const durationMs = sessionEnd.getTime() - sessionStart.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      
      exportedData.push({
        session,
        conversations: conversations || [],
        metadata: {
          exported_at: new Date().toISOString(),
          total_messages: conversations?.length || 0,
          total_tokens: totalTokens,
          session_duration: `${durationMinutes} minutes`
        }
      });
    }
    
    return exportedData;
  } catch (error) {
    console.error('Unexpected error in getSessionData:', error);
    return [];
  }
}

/**
 * Format data as Markdown
 * @param data - Exported conversation data
 * @param includeMetadata - Whether to include metadata
 * @returns Markdown formatted string
 */
function formatAsMarkdown(data: ExportedConversation[], includeMetadata: boolean = true): string {
  let markdown = '# Business Planner Conversations Export\n\n';
  
  if (includeMetadata) {
    markdown += `**Exported on:** ${new Date().toLocaleString()}\n`;
    markdown += `**Total Sessions:** ${data.length}\n\n`;
  }
  
  data.forEach((sessionData, index) => {
    const { session, conversations, metadata } = sessionData;
    
    markdown += `## Session ${index + 1}: ${session.title || 'Untitled Session'}\n\n`;
    
    if (includeMetadata) {
      markdown += `**Created:** ${new Date(session.created_at).toLocaleString()}\n`;
      markdown += `**Status:** ${session.status}\n`;
      markdown += `**Messages:** ${metadata.total_messages}\n`;
      markdown += `**Tokens Used:** ${metadata.total_tokens}\n`;
      markdown += `**Duration:** ${metadata.session_duration}\n\n`;
      
      if (session.context) {
        markdown += '### Business Context\n\n';
        markdown += `**Business Type:** ${session.context.business_type}\n`;
        markdown += `**Target Market:** ${session.context.target_market}\n`;
        markdown += `**Challenge:** ${session.context.challenge}\n`;
        if (session.context.additional_context) {
          markdown += `**Additional Context:** ${session.context.additional_context}\n`;
        }
        markdown += '\n';
      }
    }
    
    markdown += '### Conversation\n\n';
    
    conversations.forEach((conv, convIndex) => {
      const timestamp = new Date(conv.created_at).toLocaleString();
      const role = conv.role === 'user' ? '**You**' : '**AI Assistant**';
      
      markdown += `#### ${role} (${timestamp})\n\n`;
      markdown += `${conv.content}\n\n`;
      
      if (includeMetadata && conv.tokens_used > 0) {
        markdown += `*Tokens used: ${conv.tokens_used}*\n\n`;
      }
    });
    
    markdown += '---\n\n';
  });
  
  return markdown;
}

/**
 * Format data as plain text
 * @param data - Exported conversation data
 * @param includeMetadata - Whether to include metadata
 * @returns Plain text formatted string
 */
function formatAsText(data: ExportedConversation[], includeMetadata: boolean = true): string {
  let text = 'BUSINESS PLANNER CONVERSATIONS EXPORT\n';
  text += '=====================================\n\n';
  
  if (includeMetadata) {
    text += `Exported on: ${new Date().toLocaleString()}\n`;
    text += `Total Sessions: ${data.length}\n\n`;
  }
  
  data.forEach((sessionData, index) => {
    const { session, conversations, metadata } = sessionData;
    
    text += `SESSION ${index + 1}: ${session.title || 'Untitled Session'}\n`;
    text += '='.repeat(50) + '\n\n';
    
    if (includeMetadata) {
      text += `Created: ${new Date(session.created_at).toLocaleString()}\n`;
      text += `Status: ${session.status}\n`;
      text += `Messages: ${metadata.total_messages}\n`;
      text += `Tokens Used: ${metadata.total_tokens}\n`;
      text += `Duration: ${metadata.session_duration}\n\n`;
      
      if (session.context) {
        text += 'BUSINESS CONTEXT:\n';
        text += '-'.repeat(20) + '\n';
        text += `Business Type: ${session.context.business_type}\n`;
        text += `Target Market: ${session.context.target_market}\n`;
        text += `Challenge: ${session.context.challenge}\n`;
        if (session.context.additional_context) {
          text += `Additional Context: ${session.context.additional_context}\n`;
        }
        text += '\n';
      }
    }
    
    text += 'CONVERSATION:\n';
    text += '-'.repeat(20) + '\n\n';
    
    conversations.forEach((conv, convIndex) => {
      const timestamp = new Date(conv.created_at).toLocaleString();
      const role = conv.role === 'user' ? 'YOU' : 'AI ASSISTANT';
      
      text += `[${role}] (${timestamp})\n`;
      text += `${conv.content}\n`;
      
      if (includeMetadata && conv.tokens_used > 0) {
        text += `(Tokens used: ${conv.tokens_used})\n`;
      }
      
      text += '\n';
    });
    
    text += '\n' + '='.repeat(50) + '\n\n';
  });
  
  return text;
}

/**
 * Get appropriate content type for format
 * @param format - Export format
 * @returns Content type string
 */
function getContentType(format: ExportFormat): string {
  switch (format) {
    case 'markdown':
      return 'text/markdown';
    case 'json':
      return 'application/json';
    case 'txt':
    default:
      return 'text/plain';
  }
}

/**
 * Get appropriate file extension for format
 * @param format - Export format
 * @returns File extension
 */
function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'markdown':
      return 'md';
    case 'json':
      return 'json';
    case 'txt':
    default:
      return 'txt';
  }
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================

/**
 * GET /api/business-planner/export - Export conversation sessions
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id') || undefined;
    const format = (searchParams.get('format') as ExportFormat) || 'markdown';
    const includeMetadata = searchParams.get('include_metadata') !== 'false';
    
    // Validate format
    if (!['markdown', 'json', 'txt'].includes(format)) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid export format. Supported formats: markdown, json, txt',
            details: { supportedFormats: ['markdown', 'json', 'txt'] },
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
    
    // Get session data
    const exportData = await getSessionData(supabase, user.id, sessionId);
    
    if (exportData.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: sessionId ? 'Session not found' : 'No sessions found to export',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      );
    }
    
    // Update rate limit
    await updateRateLimit({
      userId: user.id,
      ipAddress: clientIP
    });
    
    // Format data based on requested format
    let responseData: string;
    let contentType: string;
    let filename: string;
    
    const timestamp = new Date().toISOString().split('T')[0];
    const sessionPart = sessionId ? `session-${sessionId.slice(0, 8)}` : 'all-sessions';
    
    switch (format) {
      case 'json':
        responseData = JSON.stringify(exportData, null, 2);
        contentType = getContentType(format);
        filename = `business-planner-${sessionPart}-${timestamp}.json`;
        break;
      case 'txt':
        responseData = formatAsText(exportData, includeMetadata);
        contentType = getContentType(format);
        filename = `business-planner-${sessionPart}-${timestamp}.txt`;
        break;
      case 'markdown':
      default:
        responseData = formatAsMarkdown(exportData, includeMetadata);
        contentType = getContentType(format);
        filename = `business-planner-${sessionPart}-${timestamp}.md`;
        break;
    }
    
    const responseTime = Date.now() - startTime;
    
    // Return formatted data with appropriate headers
    return new NextResponse(responseData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Export-Format': format,
        'X-Sessions-Count': exportData.length.toString(),
        'X-Response-Time': `${responseTime}ms`
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/business-planner/export:', error);
    
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
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'POST method not supported for this endpoint',
        details: { allowedMethods: ['GET'] },
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
        details: { allowedMethods: ['GET'] },
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
        details: { allowedMethods: ['GET'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}
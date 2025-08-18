/**
 * Business Planner Helper Functions
 * Utility functions for formatting, calculations, and common operations
 * 
 * @fileoverview Helper utilities for the business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */


import {
  BusinessPlannerSession,
  BusinessPlannerConversation,
  BusinessPlannerUsage,
  BusinessPlannerSessionContext
} from '@/app/types/business-planner';
import {
  FREE_CONVERSATIONS_LIMIT,
  PAID_CONVERSATIONS_COUNT,
  PAYMENT_AMOUNT,
  PAYMENT_CURRENCY
} from './constants';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Formatted conversation for export
 */
export interface FormattedConversation {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens_used: number;
  formatted_timestamp: string;
}

/**
 * Usage statistics
 */
export interface UsageStatistics {
  free_used: number;
  free_remaining: number;
  free_percentage: number;
  paid_used: number;
  paid_remaining: number;
  paid_percentage: number;
  total_used: number;
  total_available: number;
  total_percentage: number;
  needs_upgrade: boolean;
  can_continue: boolean;
}

/**
 * Business context summary
 */
export interface BusinessContextSummary {
  business_type: string;
  target_market: string;
  challenge: string;
  additional_context?: string;
  formatted_summary: string;
}

/**
 * Usage alert configuration
 */
export interface UsageAlert {
  type: 'warning' | 'critical' | 'info';
  message: string;
  threshold: number;
  current_usage: number;
  action_required: boolean;
}

/**
 * Subscription expiry check result
 */
export interface SubscriptionExpiryResult {
  is_expired: boolean;
  expires_at?: Date;
  days_remaining?: number;
  needs_renewal: boolean;
  grace_period_active: boolean;
}

// =============================================================================
// CONVERSATION FORMATTING
// =============================================================================

/**
 * Format conversation for export
 * @param conversations - Array of conversation records
 * @param includeMetadata - Whether to include metadata
 * @returns Formatted conversations
 */
export function formatConversationForExport(
  conversations: BusinessPlannerConversation[],
  includeMetadata: boolean = true
): FormattedConversation[] {
  return conversations.map(conv => {
    const timestamp = new Date(conv.created_at);
    
    return {
      id: conv.id,
      role: conv.role,
      content: conv.content,
      timestamp: conv.created_at,
      tokens_used: includeMetadata ? conv.tokens_used : 0,
      formatted_timestamp: timestamp.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      })
    };
  });
}

/**
 * Format conversation as markdown string
 * @param conversations - Array of conversation records
 * @param session - Session information
 * @param includeMetadata - Whether to include metadata
 * @returns Markdown formatted string
 */
export function formatConversationAsMarkdown(
  conversations: BusinessPlannerConversation[],
  session?: BusinessPlannerSession,
  includeMetadata: boolean = true
): string {
  let markdown = '';
  
  if (session) {
    markdown += `# ${session.title || 'Business Planning Session'}\n\n`;
    
    if (includeMetadata) {
      markdown += `**Created:** ${new Date(session.created_at).toLocaleString()}\n`;
      markdown += `**Status:** ${session.status}\n`;
      markdown += `**Messages:** ${conversations.length}\n\n`;
      
      if (session.context) {
        const contextSummary = formatBusinessContext(session.context);
        markdown += `## Business Context\n\n${contextSummary.formatted_summary}\n\n`;
      }
    }
    
    markdown += '## Conversation\n\n';
  }
  
  const formattedConversations = formatConversationForExport(conversations, includeMetadata);
  
  formattedConversations.forEach((conv, index) => {
    const role = conv.role === 'user' ? '**You**' : '**AI Assistant**';
    markdown += `### ${role}\n`;
    
    if (includeMetadata) {
      markdown += `*${conv.formatted_timestamp}*\n\n`;
    }
    
    markdown += `${conv.content}\n\n`;
    
    if (includeMetadata && conv.tokens_used > 0) {
      markdown += `*Tokens used: ${conv.tokens_used}*\n\n`;
    }
    
    if (index < formattedConversations.length - 1) {
      markdown += '---\n\n';
    }
  });
  
  return markdown;
}

/**
 * Format conversation as plain text
 * @param conversations - Array of conversation records
 * @param session - Session information
 * @param includeMetadata - Whether to include metadata
 * @returns Plain text formatted string
 */
export function formatConversationAsText(
  conversations: BusinessPlannerConversation[],
  session?: BusinessPlannerSession,
  includeMetadata: boolean = true
): string {
  let text = '';
  
  if (session) {
    text += `${session.title || 'Business Planning Session'}\n`;
    text += '='.repeat(50) + '\n\n';
    
    if (includeMetadata) {
      text += `Created: ${new Date(session.created_at).toLocaleString()}\n`;
      text += `Status: ${session.status}\n`;
      text += `Messages: ${conversations.length}\n\n`;
      
      if (session.context) {
        const contextSummary = formatBusinessContext(session.context);
        text += `Business Context:\n${contextSummary.formatted_summary}\n\n`;
      }
    }
    
    text += 'Conversation:\n';
    text += '-'.repeat(20) + '\n\n';
  }
  
  const formattedConversations = formatConversationForExport(conversations, includeMetadata);
  
  formattedConversations.forEach((conv, index) => {
    const role = conv.role === 'user' ? 'YOU' : 'AI ASSISTANT';
    text += `[${role}]`;
    
    if (includeMetadata) {
      text += ` (${conv.formatted_timestamp})`;
    }
    
    text += '\n';
    text += conv.content + '\n';
    
    if (includeMetadata && conv.tokens_used > 0) {
      text += `(Tokens used: ${conv.tokens_used})\n`;
    }
    
    text += '\n';
  });
  
  return text;
}

// =============================================================================
// USAGE CALCULATIONS
// =============================================================================

/**
 * Calculate usage percentage and statistics
 * @param usage - User usage record
 * @returns Usage statistics
 */
export function calculateUsagePercentage(usage: BusinessPlannerUsage): UsageStatistics {
  const freeUsed = usage.free_conversations_used;
  const freeRemaining = Math.max(0, FREE_CONVERSATIONS_LIMIT - freeUsed);
  const freePercentage = Math.round((freeUsed / FREE_CONVERSATIONS_LIMIT) * 100);
  
  const paidUsed = usage.paid_conversations_used;
  const paidLimit = usage.subscription_status === 'paid' ? PAID_CONVERSATIONS_COUNT : 0;
  const paidRemaining = Math.max(0, paidLimit - paidUsed);
  const paidPercentage = paidLimit > 0 ? Math.round((paidUsed / paidLimit) * 100) : 0;
  
  const totalUsed = freeUsed + paidUsed;
  const totalAvailable = FREE_CONVERSATIONS_LIMIT + paidLimit;
  const totalPercentage = totalAvailable > 0 ? Math.round((totalUsed / totalAvailable) * 100) : 0;
  
  const totalRemaining = freeRemaining + paidRemaining;
  const needsUpgrade = freeRemaining <= 0 && usage.subscription_status === 'free';
  const canContinue = totalRemaining > 0;
  
  return {
    free_used: freeUsed,
    free_remaining: freeRemaining,
    free_percentage: freePercentage,
    paid_used: paidUsed,
    paid_remaining: paidRemaining,
    paid_percentage: paidPercentage,
    total_used: totalUsed,
    total_available: totalAvailable,
    total_percentage: totalPercentage,
    needs_upgrade: needsUpgrade,
    can_continue: canContinue
  };
}

/**
 * Generate usage alert based on current usage
 * @param usage - User usage record
 * @returns Usage alert or null if no alert needed
 */
export function generateUsageAlert(usage: BusinessPlannerUsage): UsageAlert | null {
  const stats = calculateUsagePercentage(usage);
  
  // Critical alert - no conversations remaining
  if (!stats.can_continue) {
    return {
      type: 'critical',
      message: stats.needs_upgrade 
        ? 'You have used all your free conversations. Upgrade to continue.'
        : 'You have used all your conversations. Please purchase more to continue.',
      threshold: 100,
      current_usage: stats.total_percentage,
      action_required: true
    };
  }
  
  // Warning alert - approaching limit
  if (stats.total_percentage >= 80) {
    const remaining = stats.total_available - stats.total_used;
    return {
      type: 'warning',
      message: `You have ${remaining} conversation${remaining === 1 ? '' : 's'} remaining (${100 - stats.total_percentage}% left).`,
      threshold: 80,
      current_usage: stats.total_percentage,
      action_required: stats.needs_upgrade
    };
  }
  
  // Info alert - halfway point for free users
  if (usage.subscription_status === 'free' && stats.free_percentage >= 50 && stats.free_percentage < 80) {
    return {
      type: 'info',
      message: `You have used ${stats.free_used} of ${FREE_CONVERSATIONS_LIMIT} free conversations. Consider upgrading for more conversations.`,
      threshold: 50,
      current_usage: stats.free_percentage,
      action_required: false
    };
  }
  
  return null;
}

// =============================================================================
// SUBSCRIPTION MANAGEMENT
// =============================================================================

/**
 * Check subscription expiry status
 * @param usage - User usage record
 * @param gracePeriodDays - Grace period in days (default: 7)
 * @returns Subscription expiry result
 */
export function checkSubscriptionExpiry(
  usage: BusinessPlannerUsage,
  gracePeriodDays: number = 7
): SubscriptionExpiryResult {
  // For now, we don't have expiry dates in the schema
  // This is a placeholder implementation that could be extended
  // when subscription expiry dates are added to the database
  
  const isExpired = usage.subscription_status === 'expired';
  const needsRenewal = usage.subscription_status === 'expired' || 
    (usage.subscription_status === 'paid' && usage.paid_conversations_used >= PAID_CONVERSATIONS_COUNT);
  
  return {
    is_expired: isExpired,
    needs_renewal: needsRenewal,
    grace_period_active: false // Would be calculated based on expiry date
  };
}

/**
 * Send usage alert (placeholder for email/notification system)
 * @param userId - User ID
 * @param alert - Usage alert to send
 * @returns Promise indicating success
 */
export async function sendUsageAlert(userId: string, alert: UsageAlert): Promise<boolean> {
  try {
    // This is a placeholder implementation
    // In a real application, you would integrate with an email service
    // or notification system like SendGrid, AWS SES, or push notifications
    
    console.log(`Usage alert for user ${userId}:`, {
      type: alert.type,
      message: alert.message,
      threshold: alert.threshold,
      current_usage: alert.current_usage,
      action_required: alert.action_required,
      timestamp: new Date().toISOString()
    });
    
    // Here you would typically:
    // 1. Send email notification
    // 2. Create in-app notification
    // 3. Send push notification
    // 4. Log to analytics system
    
    return true;
  } catch (error) {
    console.error('Error sending usage alert:', error);
    return false;
  }
}

// =============================================================================
// BUSINESS CONTEXT FORMATTING
// =============================================================================

/**
 * Format business context for display
 * @param context - Business planner session context
 * @returns Formatted business context summary
 */
export function formatBusinessContext(context: BusinessPlannerSessionContext): BusinessContextSummary {
  const summary = [
    `**Business Type:** ${context.business_type}`,
    `**Target Market:** ${context.target_market}`,
    `**Main Challenge:** ${context.challenge}`
  ];
  
  if (context.additional_context) {
    summary.push(`**Additional Context:** ${context.additional_context}`);
  }
  
  const result: BusinessContextSummary = {
    business_type: context.business_type,
    target_market: context.target_market,
    challenge: context.challenge,
    formatted_summary: summary.join('\n')
  };
  
  if (context.additional_context) {
    result.additional_context = context.additional_context;
  }
  
  return result;
}

// =============================================================================
// DATE AND TIME UTILITIES
// =============================================================================

/**
 * Format date for display
 * @param date - Date string or Date object
 * @param format - Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    
    case 'relative':
      return getRelativeTime(dateObj);
    
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date - Date to compare
 * @returns Relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  } else {
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  }
}

// =============================================================================
// PRICING AND PAYMENT UTILITIES
// =============================================================================

/**
 * Format price for display
 * @param amount - Price amount
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency: string = PAYMENT_CURRENCY): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Calculate conversation value
 * @param conversationCount - Number of conversations
 * @returns Value information
 */
export function calculateConversationValue(conversationCount: number): {
  total_value: number;
  per_conversation: number;
  formatted_total: string;
  formatted_per_conversation: string;
} {
  const perConversation = PAYMENT_AMOUNT / PAID_CONVERSATIONS_COUNT;
  const totalValue = conversationCount * perConversation;
  
  return {
    total_value: totalValue,
    per_conversation: perConversation,
    formatted_total: formatPrice(totalValue),
    formatted_per_conversation: formatPrice(perConversation)
  };
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate session ID format
 * @param sessionId - Session ID to validate
 * @returns Whether the session ID is valid
 */
export function isValidSessionId(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }
  
  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId);
}

/**
 * Validate user ID format
 * @param userId - User ID to validate
 * @returns Whether the user ID is valid
 */
export function isValidUserId(userId: string): boolean {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  
  // Check if it's a valid UUID format (Supabase auth uses UUIDs)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
}

// =============================================================================
// EXPORT GROUPED FUNCTIONS
// =============================================================================

/**
 * All conversation formatting functions
 */
export const ConversationFormatting = {
  formatConversationForExport,
  formatConversationAsMarkdown,
  formatConversationAsText
} as const;

/**
 * All usage calculation functions
 */
export const UsageCalculations = {
  calculateUsagePercentage,
  generateUsageAlert,
  sendUsageAlert
} as const;

/**
 * All subscription management functions
 */
export const SubscriptionManagement = {
  checkSubscriptionExpiry
} as const;

/**
 * All business context functions
 */
export const BusinessContext = {
  formatBusinessContext
} as const;

/**
 * All date and time utilities
 */
export const DateTimeUtils = {
  formatDate,
  getRelativeTime
} as const;

/**
 * All pricing utilities
 */
export const PricingUtils = {
  formatPrice,
  calculateConversationValue
} as const;

/**
 * All validation utilities
 */
export const ValidationUtils = {
  isValidSessionId,
  isValidUserId
} as const;
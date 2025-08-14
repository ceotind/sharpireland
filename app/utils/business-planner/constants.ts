/**
 * Business Planner Constants
 * Contains all constants used throughout the business planner feature
 * 
 * @fileoverview Centralized constants for limits, pricing, models, and configuration
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { BusinessType, Industry } from '@/app/types/business-planner';

// =============================================================================
// USAGE LIMITS AND PRICING
// =============================================================================

/**
 * Number of free conversations allowed per user
 */
export const FREE_CONVERSATIONS_LIMIT = 10;

/**
 * Number of conversations included with paid subscription
 */
export const PAID_CONVERSATIONS_COUNT = 50;

/**
 * Price for paid subscription (in USD)
 */
export const PAYMENT_AMOUNT = 5.00;

/**
 * Currency code for payments
 */
export const PAYMENT_CURRENCY = 'USD';

/**
 * Default payment method
 */
export const DEFAULT_PAYMENT_METHOD = 'wire';

// =============================================================================
// RATE LIMITING CONSTANTS
// =============================================================================

/**
 * Maximum requests per time window for rate limiting
 */
export const RATE_LIMIT_MAX_REQUESTS = 20;

/**
 * Rate limiting time window in minutes
 */
export const RATE_LIMIT_WINDOW_MINUTES = 15;

/**
 * Rate limiting time window in milliseconds
 */
export const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

/**
 * Maximum suspicious activity count before blocking
 */
export const MAX_SUSPICIOUS_ACTIVITY_COUNT = 5;

/**
 * Block duration in minutes for suspicious activity
 */
export const SUSPICIOUS_ACTIVITY_BLOCK_MINUTES = 60;

/**
 * Block duration in milliseconds for suspicious activity
 */
export const SUSPICIOUS_ACTIVITY_BLOCK_MS = SUSPICIOUS_ACTIVITY_BLOCK_MINUTES * 60 * 1000;

// =============================================================================
// TOKEN LIMITS AND AI MODEL CONFIGURATION
// =============================================================================

/**
 * Maximum tokens allowed per user message
 */
export const MAX_USER_MESSAGE_TOKENS = 1000;

/**
 * Maximum tokens for AI response
 */
export const MAX_AI_RESPONSE_TOKENS = 2000;

/**
 * Maximum total tokens per conversation
 */
export const MAX_CONVERSATION_TOKENS = 8000;

/**
 * OpenAI model name for business planning
 * Uses environment variable or falls back to default
 */
export const OPENAI_MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

/**
 * Fallback model if primary model is unavailable
 */
export const FALLBACK_MODEL_NAME = 'gpt-3.5-turbo';

/**
 * Temperature setting for AI responses (creativity level)
 */
export const AI_TEMPERATURE = 0.7;

/**
 * Maximum number of retries for AI API calls
 */
export const AI_MAX_RETRIES = 3;

/**
 * Timeout for AI API calls in milliseconds
 */
export const AI_TIMEOUT_MS = 30000;

// =============================================================================
// MESSAGE AND INPUT VALIDATION
// =============================================================================

/**
 * Minimum length for user messages
 */
export const MIN_MESSAGE_LENGTH = 5;

/**
 * Maximum length for user messages
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Minimum length for business type input
 */
export const MIN_BUSINESS_TYPE_LENGTH = 2;

/**
 * Maximum length for business type input
 */
export const MAX_BUSINESS_TYPE_LENGTH = 100;

/**
 * Minimum length for target market description
 */
export const MIN_TARGET_MARKET_LENGTH = 10;

/**
 * Maximum length for target market description
 */
export const MAX_TARGET_MARKET_LENGTH = 500;

/**
 * Minimum length for challenge description
 */
export const MIN_CHALLENGE_LENGTH = 10;

/**
 * Maximum length for challenge description
 */
export const MAX_CHALLENGE_LENGTH = 1000;

/**
 * Maximum length for session title
 */
export const MAX_SESSION_TITLE_LENGTH = 255;

/**
 * Maximum length for additional context
 */
export const MAX_ADDITIONAL_CONTEXT_LENGTH = 1000;

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

/**
 * Maximum number of active sessions per user
 */
export const MAX_ACTIVE_SESSIONS_PER_USER = 5;

/**
 * Maximum number of total sessions per user
 */
export const MAX_TOTAL_SESSIONS_PER_USER = 50;

/**
 * Default session title when none provided
 */
export const DEFAULT_SESSION_TITLE = 'Business Planning Session';

/**
 * Session inactivity timeout in minutes
 */
export const SESSION_INACTIVITY_TIMEOUT_MINUTES = 60;

/**
 * Session inactivity timeout in milliseconds
 */
export const SESSION_INACTIVITY_TIMEOUT_MS = SESSION_INACTIVITY_TIMEOUT_MINUTES * 60 * 1000;

/**
 * Maximum number of messages per session
 */
export const MAX_MESSAGES_PER_SESSION = 100;

// =============================================================================
// BUSINESS TYPES AND INDUSTRIES
// =============================================================================

/**
 * Available business types for onboarding
 */
export const BUSINESS_TYPES: BusinessType[] = [
  'E-commerce',
  'SaaS',
  'Consulting',
  'Restaurant',
  'Retail',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Real Estate',
  'Financial Services',
  'Technology',
  'Marketing Agency',
  'Other'
];

/**
 * Available industries for onboarding
 */
export const INDUSTRIES: Industry[] = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Food & Beverage',
  'Transportation',
  'Entertainment',
  'Agriculture',
  'Construction',
  'Energy',
  'Government',
  'Non-profit',
  'Other'
];

/**
 * Business stage options
 */
export const BUSINESS_STAGES = [
  'idea',
  'startup',
  'growth',
  'established'
] as const;

// =============================================================================
// SECURITY AND VALIDATION PATTERNS
// =============================================================================

/**
 * Patterns to detect potential spam or malicious content
 */
export const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|poker|lottery|winner|congratulations)\b/i,
  /\b(click here|visit now|act now|limited time|free money|get rich quick)\b/i,
  /\b(make money fast|work from home|guaranteed income|no experience needed)\b/i,
  /(http|https):\/\/[^\s]+/gi, // URLs in messages
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card patterns
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email addresses
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
];

/**
 * Patterns to detect SQL injection attempts
 */
export const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
  /(--|\/\*|\*\/|;|'|")/,
  /(\bOR\b|\bAND\b).*[=<>]/i,
  /\b(SCRIPT|JAVASCRIPT|VBSCRIPT|ONLOAD|ONERROR)\b/i
];

/**
 * Patterns to detect XSS attempts
 */
export const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi
];

/**
 * Bot user agent patterns
 */
export const BOT_USER_AGENT_PATTERNS = [
  /bot|crawler|spider|scraper/i,
  /curl|wget|python|php/i,
  /postman|insomnia|httpie/i
];

// =============================================================================
// API AND RESPONSE CONFIGURATION
// =============================================================================

/**
 * Default pagination limit
 */
export const DEFAULT_PAGINATION_LIMIT = 20;

/**
 * Maximum pagination limit
 */
export const MAX_PAGINATION_LIMIT = 100;

/**
 * API request timeout in milliseconds
 */
export const API_REQUEST_TIMEOUT_MS = 10000;

/**
 * Maximum number of API retries
 */
export const API_MAX_RETRIES = 3;

/**
 * Retry delay in milliseconds
 */
export const API_RETRY_DELAY_MS = 1000;

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

/**
 * Cache TTL for user profiles in seconds
 */
export const PROFILE_CACHE_TTL_SECONDS = 300; // 5 minutes

/**
 * Cache TTL for usage data in seconds
 */
export const USAGE_CACHE_TTL_SECONDS = 60; // 1 minute

/**
 * Cache TTL for sessions in seconds
 */
export const SESSION_CACHE_TTL_SECONDS = 600; // 10 minutes

// =============================================================================
// ERROR CODES
// =============================================================================

/**
 * Business planner specific error codes
 */
export const ERROR_CODES = {
  // Validation errors
  INVALID_INPUT: 'BP_INVALID_INPUT',
  MESSAGE_TOO_LONG: 'BP_MESSAGE_TOO_LONG',
  MESSAGE_TOO_SHORT: 'BP_MESSAGE_TOO_SHORT',
  INVALID_BUSINESS_TYPE: 'BP_INVALID_BUSINESS_TYPE',
  INVALID_INDUSTRY: 'BP_INVALID_INDUSTRY',
  INVALID_BUSINESS_STAGE: 'BP_INVALID_BUSINESS_STAGE',
  
  // Usage limit errors
  FREE_LIMIT_EXCEEDED: 'BP_FREE_LIMIT_EXCEEDED',
  PAID_LIMIT_EXCEEDED: 'BP_PAID_LIMIT_EXCEEDED',
  SESSION_LIMIT_EXCEEDED: 'BP_SESSION_LIMIT_EXCEEDED',
  MESSAGE_LIMIT_EXCEEDED: 'BP_MESSAGE_LIMIT_EXCEEDED',
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: 'BP_RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'BP_SUSPICIOUS_ACTIVITY',
  USER_BLOCKED: 'BP_USER_BLOCKED',
  
  // AI service errors
  AI_SERVICE_ERROR: 'BP_AI_SERVICE_ERROR',
  AI_TIMEOUT: 'BP_AI_TIMEOUT',
  AI_QUOTA_EXCEEDED: 'BP_AI_QUOTA_EXCEEDED',
  
  // Session errors
  SESSION_NOT_FOUND: 'BP_SESSION_NOT_FOUND',
  SESSION_EXPIRED: 'BP_SESSION_EXPIRED',
  SESSION_ARCHIVED: 'BP_SESSION_ARCHIVED',
  
  // Payment errors
  PAYMENT_REQUIRED: 'BP_PAYMENT_REQUIRED',
  PAYMENT_FAILED: 'BP_PAYMENT_FAILED',
  INVALID_PAYMENT: 'BP_INVALID_PAYMENT',
  
  // General errors
  UNAUTHORIZED: 'BP_UNAUTHORIZED',
  FORBIDDEN: 'BP_FORBIDDEN',
  NOT_FOUND: 'BP_NOT_FOUND',
  INTERNAL_ERROR: 'BP_INTERNAL_ERROR',
  DATABASE_ERROR: 'BP_DATABASE_ERROR'
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

/**
 * Success messages for various operations
 */
export const SUCCESS_MESSAGES = {
  ONBOARDING_COMPLETED: 'Onboarding completed successfully',
  SESSION_CREATED: 'New planning session created',
  MESSAGE_SENT: 'Message sent successfully',
  SESSION_ARCHIVED: 'Session archived successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  USAGE_RESET: 'Usage counters reset successfully'
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Feature flags for business planner functionality
 */
export const FEATURE_FLAGS = {
  ENABLE_RATE_LIMITING: true,
  ENABLE_SPAM_DETECTION: true,
  ENABLE_USAGE_TRACKING: true,
  ENABLE_PAYMENT_PROCESSING: true,
  ENABLE_SESSION_CACHING: true,
  ENABLE_AI_FALLBACK: true,
  ENABLE_DETAILED_LOGGING: true,
  ENABLE_ANALYTICS: true
} as const;

// =============================================================================
// EXPORT GROUPED CONSTANTS
// =============================================================================

/**
 * All limits grouped together
 */
export const LIMITS = {
  FREE_CONVERSATIONS: FREE_CONVERSATIONS_LIMIT,
  PAID_CONVERSATIONS: PAID_CONVERSATIONS_COUNT,
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
  MAX_SESSIONS_PER_USER: MAX_TOTAL_SESSIONS_PER_USER,
  MAX_MESSAGES_PER_SESSION,
  RATE_LIMIT_REQUESTS: RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW: RATE_LIMIT_WINDOW_MINUTES
} as const;

/**
 * All AI configuration grouped together
 */
export const AI_CONFIG = {
  MODEL: OPENAI_MODEL_NAME,
  FALLBACK_MODEL: FALLBACK_MODEL_NAME,
  TEMPERATURE: AI_TEMPERATURE,
  MAX_TOKENS: MAX_AI_RESPONSE_TOKENS,
  TIMEOUT: AI_TIMEOUT_MS,
  MAX_RETRIES: AI_MAX_RETRIES
} as const;

/**
 * All validation patterns grouped together
 */
export const VALIDATION_PATTERNS = {
  SPAM: SPAM_PATTERNS,
  SQL_INJECTION: SQL_INJECTION_PATTERNS,
  XSS: XSS_PATTERNS,
  BOT_USER_AGENTS: BOT_USER_AGENT_PATTERNS
} as const;
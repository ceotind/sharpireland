/**
 * Business Planner TypeScript Types and Interfaces
 * These types correspond to the database schema defined in 002_business_planner_schema.sql
 * 
 * @fileoverview Contains all TypeScript interfaces and types for the business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

// =============================================================================
// DATABASE ENTITY TYPES
// =============================================================================

/**
 * Business Planner Profile - Stores user onboarding data and business context
 * Corresponds to business_planner_profiles table
 */
export interface BusinessPlannerProfile {
  /** Unique identifier for the profile */
  id: string;
  /** Reference to the user in auth.users */
  user_id: string;
  /** Whether the user has completed onboarding */
  onboarding_completed: boolean;
  /** Timestamp when onboarding was completed */
  onboarding_completed_at: string | null;
  /** Type of business (e.g., "E-commerce", "SaaS", "Consulting") */
  business_type: string | null;
  /** Current stage of business development */
  business_stage: 'idea' | 'startup' | 'growth' | 'established' | null;
  /** Industry sector */
  industry: string | null;
  /** Profile creation timestamp */
  created_at: string;
  /** Profile last update timestamp */
  updated_at: string;
}

/**
 * Business Planner Session - Stores conversation sessions with context
 * Corresponds to business_planner_sessions table
 */
export interface BusinessPlannerSession {
  /** Unique identifier for the session */
  id: string;
  /** Reference to the user in auth.users */
  user_id: string;
  /** Human-readable title for the session */
  title: string | null;
  /** JSONB context storing onboarding questions and answers */
  context: BusinessPlannerSessionContext | null;
  /** Current status of the session */
  status: 'active' | 'completed' | 'archived';
  /** Session creation timestamp */
  created_at: string;
  /** Session last update timestamp */
  updated_at: string;
}

/**
 * Business Planner Conversation - Individual messages within sessions
 * Corresponds to business_planner_conversations table
 */
export interface BusinessPlannerConversation {
  /** Unique identifier for the conversation message */
  id: string;
  /** Reference to the parent session */
  session_id: string;
  /** Reference to the user in auth.users */
  user_id: string;
  /** Role of the message sender */
  role: 'user' | 'assistant';
  /** Message content */
  content: string;
  /** Number of OpenAI tokens used for this message */
  tokens_used: number;
  /** Message creation timestamp */
  created_at: string;
}

/**
 * Business Planner Usage - Tracks user usage limits and subscription status
 * Corresponds to business_planner_usage table
 */
export interface BusinessPlannerUsage {
  /** Unique identifier for the usage record */
  id: string;
  /** Reference to the user in auth.users */
  user_id: string;
  /** Number of free conversations used in current period */
  free_conversations_used: number;
  /** Number of paid conversations used from purchased credits */
  paid_conversations_used: number;
  /** Total number of tokens consumed */
  total_tokens_used: number;
  /** Date when usage counters were last reset */
  last_reset_date: string;
  /** Current subscription status */
  subscription_status: 'free' | 'paid' | 'expired';
  /** Usage record creation timestamp */
  created_at: string;
  /** Usage record last update timestamp */
  updated_at: string;
}

/**
 * Business Planner Payment - Payment records for subscriptions
 * Corresponds to business_planner_payments table
 */
export interface BusinessPlannerPayment {
  /** Unique identifier for the payment */
  id: string;
  /** Reference to the user in auth.users */
  user_id: string;
  /** Reference to the invoice (if applicable) */
  invoice_id: string | null;
  /** Payment amount in decimal format */
  amount: number;
  /** Number of conversations purchased with this payment */
  conversations_purchased: number;
  /** Payment method used */
  payment_method: string;
  /** Current payment status */
  payment_status: 'pending' | 'completed' | 'failed';
  /** Unique reference for wire transfer identification */
  payment_reference: string | null;
  /** Timestamp when payment was completed */
  paid_at: string | null;
  /** Payment record creation timestamp */
  created_at: string;
  /** Payment record last update timestamp */
  updated_at: string;
}

/**
 * Business Planner Rate Limits - Rate limiting and security tracking
 * Corresponds to business_planner_rate_limits table
 */
export interface BusinessPlannerRateLimit {
  /** Unique identifier for the rate limit record */
  id: string;
  /** Reference to the user in auth.users */
  user_id: string;
  /** IP address for rate limiting */
  ip_address: string | null;
  /** Number of requests in current time window */
  request_count: number;
  /** Start time of current rate limiting window */
  window_start: string;
  /** Timestamp until which user is blocked (if applicable) */
  blocked_until: string | null;
  /** Counter for suspicious activity detection */
  suspicious_activity_count: number;
  /** Rate limit record creation timestamp */
  created_at: string;
  /** Rate limit record last update timestamp */
  updated_at: string;
}

// =============================================================================
// CONTEXT AND SESSION TYPES
// =============================================================================

/**
 * Session context structure for storing onboarding questions and answers
 */
export interface BusinessPlannerSessionContext {
  /** Business type from onboarding */
  business_type: string;
  /** Target market description */
  target_market: string;
  /** Main business challenge */
  challenge: string;
  /** Additional context or notes */
  additional_context?: string;
  /** Timestamp when context was created */
  created_at: string;
}

/**
 * Onboarding form data structure
 */
export interface BusinessPlannerOnboardingData {
  /** Type of business */
  business_type: string;
  /** Current stage of business */
  business_stage: 'idea' | 'startup' | 'growth' | 'established';
  /** Industry sector */
  industry: string;
  /** Target market description */
  target_market: string;
  /** Main business challenge */
  challenge: string;
  /** Additional context */
  additional_context?: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Chat request payload
 */
export interface BusinessPlannerChatRequest {
  /** User's message */
  message: string;
  /** Session ID (optional for new sessions) */
  session_id?: string;
  /** Session context for new sessions */
  context?: BusinessPlannerSessionContext;
}

/**
 * Chat response payload
 */
export interface BusinessPlannerChatResponse {
  /** AI assistant's response */
  message: string;
  /** Session ID */
  session_id: string;
  /** Tokens used for this response */
  tokens_used: number;
  /** Remaining free conversations */
  remaining_free_conversations: number;
  /** Remaining paid conversations */
  remaining_paid_conversations: number;
  /** Whether user needs to upgrade */
  needs_upgrade: boolean;
}

/**
 * Session creation request
 */
export interface CreateSessionRequest {
  /** Session title */
  title?: string;
  /** Session context */
  context: BusinessPlannerSessionContext;
}

/**
 * Session creation response
 */
export interface CreateSessionResponse {
  /** Created session */
  session: BusinessPlannerSession;
  /** Success message */
  message: string;
}

/**
 * Usage status response
 */
export interface UsageStatusResponse {
  /** Current usage data */
  usage: BusinessPlannerUsage;
  /** Remaining free conversations */
  remaining_free_conversations: number;
  /** Remaining paid conversations */
  remaining_paid_conversations: number;
  /** Whether user can make more requests */
  can_continue: boolean;
  /** Whether user needs to upgrade */
  needs_upgrade: boolean;
}

// =============================================================================
// FORM AND VALIDATION TYPES
// =============================================================================

/**
 * Validation result structure
 */
export interface BusinessPlannerValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Array of validation errors */
  errors: string[];
  /** Sanitized data (if validation passed) */
  sanitizedData?: any;
}

/**
 * User input validation data
 */
export interface BusinessPlannerUserInput {
  /** User's message */
  message: string;
  /** Session ID (optional) */
  session_id?: string;
}

/**
 * Business type validation options
 */
export type BusinessType = 
  | 'E-commerce'
  | 'SaaS'
  | 'Consulting'
  | 'Restaurant'
  | 'Retail'
  | 'Manufacturing'
  | 'Healthcare'
  | 'Education'
  | 'Real Estate'
  | 'Financial Services'
  | 'Technology'
  | 'Marketing Agency'
  | 'Other';

/**
 * Industry validation options
 */
export type Industry =
  | 'Technology'
  | 'Healthcare'
  | 'Finance'
  | 'Education'
  | 'Retail'
  | 'Manufacturing'
  | 'Real Estate'
  | 'Food & Beverage'
  | 'Transportation'
  | 'Entertainment'
  | 'Agriculture'
  | 'Construction'
  | 'Energy'
  | 'Government'
  | 'Non-profit'
  | 'Other';

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

/**
 * Business Planner Chat component props
 */
export interface BusinessPlannerChatProps {
  /** Current session (if any) */
  session?: BusinessPlannerSession;
  /** User's usage data */
  usage: BusinessPlannerUsage;
  /** Callback when message is sent */
  onMessageSent: (message: string) => void;
  /** Callback when session is created */
  onSessionCreated: (session: BusinessPlannerSession) => void;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Onboarding component props
 */
export interface BusinessPlannerOnboardingProps {
  /** Callback when onboarding is completed */
  onComplete: (data: BusinessPlannerOnboardingData) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Initial data (for editing) */
  initialData?: Partial<BusinessPlannerOnboardingData>;
}

/**
 * Session list component props
 */
export interface BusinessPlannerSessionListProps {
  /** Array of user sessions */
  sessions: BusinessPlannerSession[];
  /** Currently active session */
  activeSession?: BusinessPlannerSession;
  /** Callback when session is selected */
  onSessionSelect: (session: BusinessPlannerSession) => void;
  /** Callback when session is deleted */
  onSessionDelete: (sessionId: string) => void;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Usage display component props
 */
export interface BusinessPlannerUsageProps {
  /** User's usage data */
  usage: BusinessPlannerUsage;
  /** Callback when upgrade is requested */
  onUpgrade: () => void;
  /** Show detailed breakdown */
  showDetails?: boolean;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

/**
 * Business Planner specific error
 */
export interface BusinessPlannerError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Timestamp when error occurred */
  timestamp: string;
}

/**
 * Rate limiting error
 */
export interface RateLimitError extends BusinessPlannerError {
  /** When rate limit resets */
  reset_at: string;
  /** Number of requests remaining */
  remaining_requests: number;
}

/**
 * Usage limit error
 */
export interface UsageLimitError extends BusinessPlannerError {
  /** Current usage count */
  current_usage: number;
  /** Maximum allowed usage */
  limit: number;
  /** Subscription status */
  subscription_status: 'free' | 'paid' | 'expired';
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Generic API response wrapper
 */
export interface BusinessPlannerApiResponse<T> {
  /** Response data */
  data?: T;
  /** Error information */
  error?: BusinessPlannerError;
  /** Success message */
  message?: string;
  /** Response metadata */
  meta?: {
    /** Request timestamp */
    timestamp: string;
    /** Request ID for tracking */
    request_id: string;
  };
}

/**
 * Paginated response for lists
 */
export interface BusinessPlannerPaginatedResponse<T> {
  /** Array of items */
  data: T[];
  /** Total count of items */
  count: number;
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of pages */
  total_pages: number;
  /** Whether there are more pages */
  has_next: boolean;
  /** Whether there are previous pages */
  has_prev: boolean;
}

/**
 * Search and filter options
 */
export interface BusinessPlannerSearchFilters {
  /** Search query */
  query?: string;
  /** Session status filter */
  status?: ('active' | 'completed' | 'archived')[];
  /** Date range filter */
  date_range?: {
    start: string;
    end: string;
  };
  /** Business type filter */
  business_type?: BusinessType[];
  /** Industry filter */
  industry?: Industry[];
}

/**
 * Sort options
 */
export interface BusinessPlannerSortOptions {
  /** Field to sort by */
  field: 'created_at' | 'updated_at' | 'title' | 'status';
  /** Sort direction */
  direction: 'asc' | 'desc';
}
/**
 * OpenAI Integration for Business Planner
 * Handles all OpenAI API interactions with proper error handling and rate limiting
 * 
 * @fileoverview OpenAI client and chat completion functions for business planning
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 * 
 * TODO: Install openai package: npm install openai
 * Then uncomment the import and update the placeholder implementations
 */

// TODO: Uncomment when openai package is installed
// import OpenAI from 'openai';

import { BusinessPlannerSessionContext } from '@/app/types/business-planner';
import { formatSystemPrompt } from './prompts';
import {
  OPENAI_MODEL_NAME,
  FALLBACK_MODEL_NAME,
  AI_TEMPERATURE,
  AI_MAX_RETRIES,
  AI_TIMEOUT_MS,
  MAX_AI_RESPONSE_TOKENS,
  MAX_CONVERSATION_TOKENS,
  ERROR_CODES
} from './constants';

// =============================================================================
// PLACEHOLDER TYPES (Replace with actual OpenAI types when package is installed)
// =============================================================================

interface OpenAIClient {
  chat: {
    completions: {
      create: (params: any) => Promise<any>;
    };
  };
}

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * OpenAI chat completion request parameters
 */
export interface ChatCompletionRequest {
  /** User's message */
  message: string;
  /** Session context for system prompt */
  context: BusinessPlannerSessionContext;
  /** Previous conversation history (optional) */
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  /** Maximum tokens for response */
  maxTokens?: number;
  /** Temperature for creativity */
  temperature?: number;
}

/**
 * OpenAI chat completion response
 */
export interface ChatCompletionResponse {
  /** AI assistant's response message */
  message: string;
  /** Number of tokens used in the request */
  tokensUsed: number;
  /** Model used for the response */
  model: string;
  /** Whether fallback model was used */
  usedFallback: boolean;
  /** Response metadata */
  metadata: {
    /** Request timestamp */
    timestamp: string;
    /** Response time in milliseconds */
    responseTime: number;
    /** Finish reason from OpenAI */
    finishReason: string | null;
  };
}

/**
 * Token counting result
 */
export interface TokenCountResult {
  /** Estimated token count */
  tokenCount: number;
  /** Whether count is estimated or exact */
  isEstimate: boolean;
}

/**
 * OpenAI error with additional context
 */
export interface OpenAIError extends Error {
  /** Error code from OpenAI or custom */
  code?: string;
  /** HTTP status code */
  status?: number;
  /** Whether error is retryable */
  retryable?: boolean;
  /** Original OpenAI error */
  originalError?: any;
}

// =============================================================================
// OPENAI CLIENT INITIALIZATION
// =============================================================================

/**
 * Initialize OpenAI client with proper configuration
 * @returns Configured OpenAI client instance
 */
function initializeOpenAIClient(): OpenAIClient {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  // TODO: Replace with actual OpenAI client when package is installed
  // return new OpenAI({
  //   apiKey,
  //   timeout: AI_TIMEOUT_MS,
  //   maxRetries: AI_MAX_RETRIES,
  // });

  // Placeholder implementation
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          throw new Error('OpenAI package not installed. Please run: npm install openai');
        }
      }
    }
  };
}

// Singleton OpenAI client instance
let openaiClient: OpenAIClient | null = null;

/**
 * Get or create OpenAI client instance
 * @returns OpenAI client instance
 */
function getOpenAIClient(): OpenAIClient {
  if (!openaiClient) {
    openaiClient = initializeOpenAIClient();
  }
  return openaiClient;
}

// =============================================================================
// TOKEN COUNTING FUNCTIONS
// =============================================================================

/**
 * Estimate token count for text using a simple approximation
 * This is a rough estimate - actual token count may vary
 * @param text - Text to count tokens for
 * @returns Estimated token count
 */
export function estimateTokenCount(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Rough approximation: 1 token ≈ 4 characters for English text
  // This is conservative and may overestimate slightly
  const charCount = text.length;
  const estimatedTokens = Math.ceil(charCount / 4);
  
  return estimatedTokens;
}

/**
 * Count tokens for a complete conversation
 * @param messages - Array of conversation messages
 * @returns Token count result
 */
export function countConversationTokens(
  messages: Array<{ role: string; content: string }>
): TokenCountResult {
  let totalTokens = 0;
  
  // Count tokens for each message
  messages.forEach(message => {
    totalTokens += estimateTokenCount(message.content);
    // Add overhead for role and formatting (approximately 4 tokens per message)
    totalTokens += 4;
  });
  
  // Add overhead for conversation structure
  totalTokens += 10;
  
  return {
    tokenCount: totalTokens,
    isEstimate: true
  };
}

/**
 * Check if conversation is within token limits
 * @param messages - Conversation messages
 * @param additionalTokens - Additional tokens to account for (e.g., new message)
 * @returns Whether conversation is within limits
 */
export function isWithinTokenLimits(
  messages: Array<{ role: string; content: string }>,
  additionalTokens: number = 0
): boolean {
  const { tokenCount } = countConversationTokens(messages);
  const totalTokens = tokenCount + additionalTokens;
  
  return totalTokens <= MAX_CONVERSATION_TOKENS;
}

// =============================================================================
// ERROR HANDLING FUNCTIONS
// =============================================================================

/**
 * Create a standardized OpenAI error
 * @param message - Error message
 * @param code - Error code
 * @param originalError - Original error object
 * @returns Formatted OpenAI error
 */
function createOpenAIError(
  message: string,
  code: string,
  originalError?: any
): OpenAIError {
  const error = new Error(message) as OpenAIError;
  error.code = code;
  error.originalError = originalError;
  
  // Determine if error is retryable
  error.retryable = [
    'rate_limit_exceeded',
    'server_error',
    'timeout',
    'network_error'
  ].includes(code);
  
  // Extract status code if available
  if (originalError?.status) {
    error.status = originalError.status;
  }
  
  return error;
}

/**
 * Handle OpenAI API errors and convert to standardized format
 * @param error - Original error from OpenAI
 * @returns Standardized OpenAI error
 */
function handleOpenAIError(error: any): OpenAIError {
  console.error('OpenAI API Error:', error);
  
  // Handle different types of OpenAI errors
  if (error?.error?.type) {
    switch (error.error.type) {
      case 'insufficient_quota':
        return createOpenAIError(
          'OpenAI API quota exceeded',
          ERROR_CODES.AI_QUOTA_EXCEEDED,
          error
        );
      
      case 'rate_limit_exceeded':
        return createOpenAIError(
          'OpenAI API rate limit exceeded',
          ERROR_CODES.RATE_LIMIT_EXCEEDED,
          error
        );
      
      case 'invalid_request_error':
        return createOpenAIError(
          'Invalid request to OpenAI API',
          ERROR_CODES.INVALID_INPUT,
          error
        );
      
      default:
        return createOpenAIError(
          'OpenAI API error occurred',
          ERROR_CODES.AI_SERVICE_ERROR,
          error
        );
    }
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return createOpenAIError(
      'OpenAI API request timed out',
      ERROR_CODES.AI_TIMEOUT,
      error
    );
  }
  
  // Handle network errors
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return createOpenAIError(
      'Network error connecting to OpenAI API',
      'network_error',
      error
    );
  }
  
  // Generic error
  return createOpenAIError(
    error.message || 'Unknown OpenAI API error',
    ERROR_CODES.AI_SERVICE_ERROR,
    error
  );
}

// =============================================================================
// CHAT COMPLETION FUNCTIONS
// =============================================================================

/**
 * Build messages array for OpenAI chat completion
 * @param request - Chat completion request
 * @returns Messages array for OpenAI API
 */
function buildMessagesArray(request: ChatCompletionRequest): Array<{
  role: 'system' | 'user' | 'assistant';
  content: string;
}> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  
  // Add system prompt
  const systemPrompt = formatSystemPrompt(request.context);
  messages.push({
    role: 'system',
    content: systemPrompt
  });
  
  // Add conversation history if provided
  if (request.conversationHistory && request.conversationHistory.length > 0) {
    request.conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      });
    });
  }
  
  // Add current user message
  messages.push({
    role: 'user',
    content: request.message
  });
  
  return messages;
}

/**
 * Create chat completion with OpenAI API
 * @param request - Chat completion request parameters
 * @returns Chat completion response
 */
export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const startTime = Date.now();
  let usedFallback = false;
  let model = OPENAI_MODEL_NAME;
  
  try {
    const client = getOpenAIClient();
    
    // Build messages array
    const messages = buildMessagesArray(request);
    
    // Check token limits
    const estimatedTokens = countConversationTokens(messages);
    if (estimatedTokens.tokenCount > MAX_CONVERSATION_TOKENS) {
      throw createOpenAIError(
        'Conversation exceeds maximum token limit',
        ERROR_CODES.MESSAGE_LIMIT_EXCEEDED
      );
    }
    
    // Prepare completion parameters
    const completionParams = {
      model,
      messages,
      max_tokens: request.maxTokens || MAX_AI_RESPONSE_TOKENS,
      temperature: request.temperature || AI_TEMPERATURE,
      stream: false,
    };
    
    let completion: any;
    
    try {
      // Try with primary model
      completion = await client.chat.completions.create(completionParams);
    } catch (primaryError) {
      console.warn('Primary model failed, trying fallback:', primaryError);
      
      // Try with fallback model
      completionParams.model = FALLBACK_MODEL_NAME;
      model = FALLBACK_MODEL_NAME;
      usedFallback = true;
      
      try {
        completion = await client.chat.completions.create(completionParams);
      } catch (fallbackError) {
        throw handleOpenAIError(fallbackError);
      }
    }
    
    // Extract response data
    const choice = completion.choices[0];
    if (!choice || !choice.message || !choice.message.content) {
      throw createOpenAIError(
        'No response content from OpenAI API',
        ERROR_CODES.AI_SERVICE_ERROR
      );
    }
    
    const responseTime = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;
    
    return {
      message: choice.message.content.trim(),
      tokensUsed,
      model,
      usedFallback,
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime,
        finishReason: choice.finish_reason
      }
    };
    
  } catch (error) {
    // If it's already a formatted OpenAI error, re-throw it
    if (error instanceof Error && 'code' in error) {
      throw error;
    }
    
    // Otherwise, handle and format the error
    throw handleOpenAIError(error);
  }
}

/**
 * Create chat completion with retry logic
 * @param request - Chat completion request parameters
 * @param maxRetries - Maximum number of retries (default: 3)
 * @returns Chat completion response
 */
export async function createChatCompletionWithRetry(
  request: ChatCompletionRequest,
  maxRetries: number = AI_MAX_RETRIES
): Promise<ChatCompletionResponse> {
  let lastError: OpenAIError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await createChatCompletion(request);
    } catch (error) {
      lastError = error as OpenAIError;
      
      // Don't retry if error is not retryable
      if (!lastError.retryable) {
        throw lastError;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.warn(`OpenAI request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate OpenAI API configuration
 * @returns True if configuration is valid
 */
export function validateOpenAIConfig(): boolean {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    return !!(apiKey && apiKey.startsWith('sk-'));
  } catch {
    return false;
  }
}

/**
 * Test OpenAI API connection
 * @returns Promise that resolves if connection is successful
 */
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const client = getOpenAIClient();
    
    // Make a minimal request to test the connection
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL_NAME,
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
      temperature: 0
    });
    
    return !!(response && response.choices && response.choices.length > 0);
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
}

/**
 * Get OpenAI model information
 * @returns Object with model information
 */
export function getModelInfo() {
  return {
    primary: OPENAI_MODEL_NAME,
    fallback: FALLBACK_MODEL_NAME,
    maxTokens: MAX_AI_RESPONSE_TOKENS,
    temperature: AI_TEMPERATURE,
    timeout: AI_TIMEOUT_MS,
    maxRetries: AI_MAX_RETRIES
  };
}

// =============================================================================
// EXPORT GROUPED FUNCTIONS
// =============================================================================

/**
 * All token-related functions
 */
export const TokenUtils = {
  estimateTokenCount,
  countConversationTokens,
  isWithinTokenLimits
} as const;

/**
 * All chat completion functions
 */
export const ChatCompletion = {
  createChatCompletion,
  createChatCompletionWithRetry
} as const;

/**
 * All utility functions
 */
export const OpenAIUtils = {
  validateOpenAIConfig,
  testOpenAIConnection,
  getModelInfo
} as const;
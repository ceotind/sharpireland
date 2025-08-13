/**
 * Business Planner Input Validation Functions
 * Contains all validation logic for user inputs, security checks, and data sanitization
 * 
 * @fileoverview Comprehensive validation utilities for the business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import {
  BusinessPlannerValidationResult,
  BusinessPlannerUserInput,
  BusinessPlannerOnboardingData,
  BusinessType,
  Industry
} from '@/app/types/business-planner';
import {
  MIN_MESSAGE_LENGTH,
  MAX_MESSAGE_LENGTH,
  MIN_BUSINESS_TYPE_LENGTH,
  MAX_BUSINESS_TYPE_LENGTH,
  MIN_TARGET_MARKET_LENGTH,
  MAX_TARGET_MARKET_LENGTH,
  MIN_CHALLENGE_LENGTH,
  MAX_CHALLENGE_LENGTH,
  MAX_SESSION_TITLE_LENGTH,
  MAX_ADDITIONAL_CONTEXT_LENGTH,
  BUSINESS_TYPES,
  INDUSTRIES,
  BUSINESS_STAGES,
  SPAM_PATTERNS,
  SQL_INJECTION_PATTERNS,
  XSS_PATTERNS,
  BOT_USER_AGENT_PATTERNS,
  ERROR_CODES
} from './constants';

// =============================================================================
// CORE VALIDATION CLASS
// =============================================================================

/**
 * Business Planner Input Validator
 * Handles all validation logic for the business planner feature
 */
export class BusinessPlannerValidator {
  
  /**
   * Sanitize HTML content by removing all tags and attributes
   * @param input - Raw input string
   * @returns Sanitized string
   */
  private sanitizeHtml(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard'
    });
  }

  /**
   * Validate and sanitize user message input
   * @param message - User's message
   * @returns Validation result with sanitized message
   */
  private validateMessage(message: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!message || typeof message !== 'string') {
      return { isValid: false, error: 'Message is required' };
    }

    const sanitized = this.sanitizeHtml(message.trim());
    
    if (sanitized.length < MIN_MESSAGE_LENGTH) {
      return { 
        isValid: false, 
        error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters long` 
      };
    }

    if (sanitized.length > MAX_MESSAGE_LENGTH) {
      return { 
        isValid: false, 
        error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` 
      };
    }

    // Check for empty message after sanitization
    if (sanitized.trim().length === 0) {
      return { isValid: false, error: 'Message cannot be empty' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate business type input
   * @param businessType - Business type string
   * @returns Validation result with sanitized business type
   */
  private validateBusinessTypeInput(businessType: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!businessType || typeof businessType !== 'string') {
      return { isValid: false, error: 'Business type is required' };
    }

    const sanitized = this.sanitizeHtml(businessType.trim());
    
    if (sanitized.length < MIN_BUSINESS_TYPE_LENGTH) {
      return { 
        isValid: false, 
        error: `Business type must be at least ${MIN_BUSINESS_TYPE_LENGTH} characters long` 
      };
    }

    if (sanitized.length > MAX_BUSINESS_TYPE_LENGTH) {
      return { 
        isValid: false, 
        error: `Business type must be less than ${MAX_BUSINESS_TYPE_LENGTH} characters` 
      };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate target market description
   * @param targetMarket - Target market description
   * @returns Validation result with sanitized target market
   */
  private validateTargetMarketInput(targetMarket: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!targetMarket || typeof targetMarket !== 'string') {
      return { isValid: false, error: 'Target market description is required' };
    }

    const sanitized = this.sanitizeHtml(targetMarket.trim());
    
    if (sanitized.length < MIN_TARGET_MARKET_LENGTH) {
      return { 
        isValid: false, 
        error: `Target market description must be at least ${MIN_TARGET_MARKET_LENGTH} characters long` 
      };
    }

    if (sanitized.length > MAX_TARGET_MARKET_LENGTH) {
      return { 
        isValid: false, 
        error: `Target market description must be less than ${MAX_TARGET_MARKET_LENGTH} characters` 
      };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate challenge description
   * @param challenge - Challenge description
   * @returns Validation result with sanitized challenge
   */
  private validateChallengeInput(challenge: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!challenge || typeof challenge !== 'string') {
      return { isValid: false, error: 'Challenge description is required' };
    }

    const sanitized = this.sanitizeHtml(challenge.trim());
    
    if (sanitized.length < MIN_CHALLENGE_LENGTH) {
      return { 
        isValid: false, 
        error: `Challenge description must be at least ${MIN_CHALLENGE_LENGTH} characters long` 
      };
    }

    if (sanitized.length > MAX_CHALLENGE_LENGTH) {
      return { 
        isValid: false, 
        error: `Challenge description must be less than ${MAX_CHALLENGE_LENGTH} characters` 
      };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate session title
   * @param title - Session title
   * @returns Validation result with sanitized title
   */
  private validateSessionTitle(title: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return { isValid: true }; // Title is optional
    }

    const sanitized = this.sanitizeHtml(title.trim());
    
    if (sanitized.length > MAX_SESSION_TITLE_LENGTH) {
      return { 
        isValid: false, 
        error: `Session title must be less than ${MAX_SESSION_TITLE_LENGTH} characters` 
      };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate additional context
   * @param context - Additional context string
   * @returns Validation result with sanitized context
   */
  private validateAdditionalContext(context: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!context || typeof context !== 'string' || context.trim().length === 0) {
      return { isValid: true }; // Additional context is optional
    }

    const sanitized = this.sanitizeHtml(context.trim());
    
    if (sanitized.length > MAX_ADDITIONAL_CONTEXT_LENGTH) {
      return { 
        isValid: false, 
        error: `Additional context must be less than ${MAX_ADDITIONAL_CONTEXT_LENGTH} characters` 
      };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Check for spam patterns in text
   * @param text - Text to check
   * @returns Array of detected spam patterns
   */
  private detectSpamPatterns(text: string): string[] {
    const detectedPatterns: string[] = [];
    
    SPAM_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(text)) {
        detectedPatterns.push(`Spam pattern ${index + 1} detected`);
      }
    });

    return detectedPatterns;
  }

  /**
   * Check for SQL injection patterns
   * @param text - Text to check
   * @returns Array of detected SQL injection patterns
   */
  private detectSQLInjection(text: string): string[] {
    const detectedPatterns: string[] = [];
    
    SQL_INJECTION_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(text)) {
        detectedPatterns.push(`SQL injection pattern ${index + 1} detected`);
      }
    });

    return detectedPatterns;
  }

  /**
   * Check for XSS patterns
   * @param text - Text to check
   * @returns Array of detected XSS patterns
   */
  private detectXSSPatterns(text: string): string[] {
    const detectedPatterns: string[] = [];
    
    XSS_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(text)) {
        detectedPatterns.push(`XSS pattern ${index + 1} detected`);
      }
    });

    return detectedPatterns;
  }

  /**
   * Perform comprehensive security checks on input
   * @param text - Text to check
   * @returns Array of security issues found
   */
  private performSecurityChecks(text: string): string[] {
    const securityIssues: string[] = [];
    
    // Check for spam patterns
    const spamIssues = this.detectSpamPatterns(text);
    securityIssues.push(...spamIssues);

    // Check for SQL injection
    const sqlIssues = this.detectSQLInjection(text);
    securityIssues.push(...sqlIssues);

    // Check for XSS
    const xssIssues = this.detectXSSPatterns(text);
    securityIssues.push(...xssIssues);

    return securityIssues;
  }

  // =============================================================================
  // PUBLIC VALIDATION METHODS
  // =============================================================================

  /**
   * Validate user input for chat messages
   * @param data - User input data
   * @returns Validation result with sanitized data
   */
  public validateUserInput(data: Record<string, unknown>): BusinessPlannerValidationResult {
    const errors: string[] = [];
    const sanitizedData: Partial<BusinessPlannerUserInput> = {};

    // Validate message
    const messageResult = this.validateMessage(data.message);
    if (!messageResult.isValid) {
      errors.push(messageResult.error!);
    } else {
      sanitizedData.message = messageResult.sanitized!;
      
      // Perform security checks on message
      const securityIssues = this.performSecurityChecks(messageResult.sanitized!);
      if (securityIssues.length > 0) {
        errors.push('Message contains suspicious content');
      }
    }

    // Validate session_id (optional)
    if (data.session_id) {
      if (typeof data.session_id !== 'string' || !validator.isUUID(data.session_id)) {
        errors.push('Invalid session ID format');
      } else {
        sanitizedData.session_id = data.session_id;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData as BusinessPlannerUserInput : undefined
    };
  }

  /**
   * Validate business type selection
   * @param businessType - Business type to validate
   * @returns Validation result
   */
  public validateBusinessType(businessType: unknown): BusinessPlannerValidationResult {
    const errors: string[] = [];

    if (!businessType || typeof businessType !== 'string') {
      errors.push('Business type is required');
    } else if (!BUSINESS_TYPES.includes(businessType as BusinessType)) {
      errors.push('Invalid business type selected');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? businessType : undefined
    };
  }

  /**
   * Validate target market description
   * @param targetMarket - Target market to validate
   * @returns Validation result
   */
  public validateTargetMarket(targetMarket: unknown): BusinessPlannerValidationResult {
    const errors: string[] = [];
    let sanitizedData: string | undefined;

    const result = this.validateTargetMarketInput(targetMarket);
    if (!result.isValid) {
      errors.push(result.error!);
    } else {
      sanitizedData = result.sanitized!;
      
      // Perform security checks
      const securityIssues = this.performSecurityChecks(result.sanitized!);
      if (securityIssues.length > 0) {
        errors.push('Target market description contains suspicious content');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Validate challenge description
   * @param challenge - Challenge to validate
   * @returns Validation result
   */
  public validateChallenge(challenge: unknown): BusinessPlannerValidationResult {
    const errors: string[] = [];
    let sanitizedData: string | undefined;

    const result = this.validateChallengeInput(challenge);
    if (!result.isValid) {
      errors.push(result.error!);
    } else {
      sanitizedData = result.sanitized!;
      
      // Perform security checks
      const securityIssues = this.performSecurityChecks(result.sanitized!);
      if (securityIssues.length > 0) {
        errors.push('Challenge description contains suspicious content');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Validate complete onboarding data
   * @param data - Onboarding form data
   * @returns Validation result with sanitized onboarding data
   */
  public validateOnboardingData(data: Record<string, unknown>): BusinessPlannerValidationResult {
    const errors: string[] = [];
    const sanitizedData: Partial<BusinessPlannerOnboardingData> = {};

    // Validate business type
    const businessTypeResult = this.validateBusinessTypeInput(data.business_type);
    if (!businessTypeResult.isValid) {
      errors.push(businessTypeResult.error!);
    } else {
      sanitizedData.business_type = businessTypeResult.sanitized!;
    }

    // Validate business stage
    if (!data.business_stage || typeof data.business_stage !== 'string') {
      errors.push('Business stage is required');
    } else if (!BUSINESS_STAGES.includes(data.business_stage as any)) {
      errors.push('Invalid business stage selected');
    } else {
      sanitizedData.business_stage = data.business_stage as any;
    }

    // Validate industry
    if (!data.industry || typeof data.industry !== 'string') {
      errors.push('Industry is required');
    } else if (!INDUSTRIES.includes(data.industry as Industry)) {
      errors.push('Invalid industry selected');
    } else {
      sanitizedData.industry = data.industry;
    }

    // Validate target market
    const targetMarketResult = this.validateTargetMarketInput(data.target_market);
    if (!targetMarketResult.isValid) {
      errors.push(targetMarketResult.error!);
    } else {
      sanitizedData.target_market = targetMarketResult.sanitized!;
      
      // Security check
      const securityIssues = this.performSecurityChecks(targetMarketResult.sanitized!);
      if (securityIssues.length > 0) {
        errors.push('Target market contains suspicious content');
      }
    }

    // Validate challenge
    const challengeResult = this.validateChallengeInput(data.challenge);
    if (!challengeResult.isValid) {
      errors.push(challengeResult.error!);
    } else {
      sanitizedData.challenge = challengeResult.sanitized!;
      
      // Security check
      const securityIssues = this.performSecurityChecks(challengeResult.sanitized!);
      if (securityIssues.length > 0) {
        errors.push('Challenge description contains suspicious content');
      }
    }

    // Validate additional context (optional)
    const contextResult = this.validateAdditionalContext(data.additional_context);
    if (!contextResult.isValid) {
      errors.push(contextResult.error!);
    } else if (contextResult.sanitized) {
      sanitizedData.additional_context = contextResult.sanitized;
      
      // Security check
      const securityIssues = this.performSecurityChecks(contextResult.sanitized);
      if (securityIssues.length > 0) {
        errors.push('Additional context contains suspicious content');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData as BusinessPlannerOnboardingData : undefined
    };
  }

  /**
   * Sanitize input by removing HTML and trimming whitespace
   * @param input - Raw input string
   * @returns Sanitized string
   */
  public sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    return this.sanitizeHtml(input.trim());
  }

  /**
   * Check if user agent indicates bot activity
   * @param userAgent - User agent string
   * @returns True if bot detected
   */
  public isBotUserAgent(userAgent: string): boolean {
    if (!userAgent || typeof userAgent !== 'string') {
      return false;
    }

    return BOT_USER_AGENT_PATTERNS.some(pattern => pattern.test(userAgent));
  }

  /**
   * Validate session title
   * @param title - Session title to validate
   * @returns Validation result
   */
  public validateSessionTitleInput(title: unknown): BusinessPlannerValidationResult {
    const errors: string[] = [];
    let sanitizedData: string | undefined;

    const result = this.validateSessionTitle(title);
    if (!result.isValid) {
      errors.push(result.error!);
    } else if (result.sanitized) {
      sanitizedData = result.sanitized;
      
      // Security check
      const securityIssues = this.performSecurityChecks(result.sanitized);
      if (securityIssues.length > 0) {
        errors.push('Session title contains suspicious content');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Perform comprehensive security validation on any text input
   * @param input - Text input to validate
   * @param fieldName - Name of the field being validated
   * @returns Validation result with security issues
   */
  public performSecurityValidation(input: string, fieldName: string = 'input'): BusinessPlannerValidationResult {
    const errors: string[] = [];
    
    if (typeof input !== 'string') {
      errors.push(`${fieldName} must be a string`);
      return { isValid: false, errors };
    }

    const securityIssues = this.performSecurityChecks(input);
    if (securityIssues.length > 0) {
      errors.push(`${fieldName} contains suspicious content`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? this.sanitizeInput(input) : undefined
    };
  }
}

// =============================================================================
// SINGLETON INSTANCE AND EXPORTED FUNCTIONS
// =============================================================================

/**
 * Singleton instance of the validator
 */
const businessPlannerValidator = new BusinessPlannerValidator();

export default businessPlannerValidator;

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Validate user input for chat messages
 * @param data - User input data
 * @returns Validation result
 */
export function validateUserInput(data: Record<string, unknown>): BusinessPlannerValidationResult {
  return businessPlannerValidator.validateUserInput(data);
}

/**
 * Validate business type selection
 * @param businessType - Business type to validate
 * @returns Validation result
 */
export function validateBusinessType(businessType: unknown): BusinessPlannerValidationResult {
  return businessPlannerValidator.validateBusinessType(businessType);
}

/**
 * Validate target market description
 * @param targetMarket - Target market to validate
 * @returns Validation result
 */
export function validateTargetMarket(targetMarket: unknown): BusinessPlannerValidationResult {
  return businessPlannerValidator.validateTargetMarket(targetMarket);
}

/**
 * Validate challenge description
 * @param challenge - Challenge to validate
 * @returns Validation result
 */
export function validateChallenge(challenge: unknown): BusinessPlannerValidationResult {
  return businessPlannerValidator.validateChallenge(challenge);
}

/**
 * Sanitize input string
 * @param input - Raw input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return businessPlannerValidator.sanitizeInput(input);
}

/**
 * Validate complete onboarding data
 * @param data - Onboarding form data
 * @returns Validation result
 */
export function validateOnboardingData(data: Record<string, unknown>): BusinessPlannerValidationResult {
  return businessPlannerValidator.validateOnboardingData(data);
}

/**
 * Check if user agent indicates bot activity
 * @param userAgent - User agent string
 * @returns True if bot detected
 */
export function isBotUserAgent(userAgent: string): boolean {
  return businessPlannerValidator.isBotUserAgent(userAgent);
}

/**
 * Perform security validation on text input
 * @param input - Text input to validate
 * @param fieldName - Name of the field being validated
 * @returns Validation result
 */
export function performSecurityValidation(input: string, fieldName?: string): BusinessPlannerValidationResult {
  return businessPlannerValidator.performSecurityValidation(input, fieldName);
}
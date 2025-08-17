/**
 * Business Planner Security Utilities
 * Enhanced security functions for input sanitization, validation, and protection
 * 
 * @fileoverview Comprehensive security utilities for the business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import crypto from 'crypto';
import { NextRequest } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';
import {
  SPAM_PATTERNS,
  SQL_INJECTION_PATTERNS,
  XSS_PATTERNS,
  BOT_USER_AGENT_PATTERNS
} from './constants';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Security validation result
 */
export interface SecurityValidationResult {
  /** Whether the input is safe */
  isValid: boolean;
  /** Array of security issues found */
  issues: string[];
  /** Sanitized input (if valid) */
  sanitizedInput?: string;
  /** Risk level (low, medium, high, critical) */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Request signature verification result
 */
export interface SignatureVerificationResult {
  /** Whether the signature is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
  /** Computed signature for comparison */
  computedSignature?: string;
}

/**
 * CSRF token validation result
 */
export interface CSRFValidationResult {
  /** Whether the token is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
  /** Token expiry time */
  expiresAt?: Date;
}

/**
 * Security headers configuration
 */
export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'Strict-Transport-Security'?: string;
  'X-XSS-Protection'?: string;
}

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Enhanced HTML sanitization with strict rules
 * @param input - Raw HTML input
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlStrict(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return sanitizeHtml(input, {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    allowedSchemes: [],
    allowedSchemesAppliedToAttributes: [],
    allowProtocolRelative: false,
    enforceHtmlBoundary: true
  });
}

/**
 * Sanitize input for database storage
 * @param input - Raw input string
 * @returns Sanitized string safe for database
 */
export function sanitizeForDatabase(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = sanitizeHtmlStrict(input);
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Escape potential SQL injection characters
  sanitized = sanitized.replace(/['"\\]/g, (match) => '\\' + match);
  
  return sanitized;
}

/**
 * Sanitize JSON input
 * @param input - Raw JSON string
 * @returns Sanitized and parsed JSON object
 */
export function sanitizeJsonInput(input: string): unknown {
  try {
    // First sanitize the string
    const sanitized = sanitizeHtmlStrict(input);
    
    // Parse JSON
    const parsed = JSON.parse(sanitized);
    
    // Recursively sanitize object values
    return sanitizeObjectValues(parsed);
  } catch (error) {
    throw new Error('Invalid JSON input');
  }
}

/**
 * Recursively sanitize object values
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
function sanitizeObjectValues(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeHtmlStrict(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectValues);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeHtmlStrict(key);
      sanitized[sanitizedKey] = sanitizeObjectValues(value);
    }
    return sanitized;
  }
  
  return obj;
}

// =============================================================================
// SECURITY PATTERN DETECTION
// =============================================================================

/**
 * Comprehensive security validation
 * @param input - Input string to validate
 * @param fieldName - Name of the field being validated
 * @returns Security validation result
 */
export function validateInputSecurity(input: string, fieldName: string = 'input'): SecurityValidationResult {
  const issues: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

  if (typeof input !== 'string') {
    return {
      isValid: false,
      issues: [`${fieldName} must be a string`],
      riskLevel: 'medium'
    };
  }

  // Check for SQL injection patterns
  const sqlIssues = detectSQLInjectionPatterns(input);
  if (sqlIssues.length > 0) {
    issues.push(...sqlIssues.map(issue => `SQL injection risk: ${issue}`));
    riskLevel = 'critical';
  }

  // Check for XSS patterns
  const xssIssues = detectXSSPatterns(input);
  if (xssIssues.length > 0) {
    issues.push(...xssIssues.map(issue => `XSS risk: ${issue}`));
    if (riskLevel !== 'critical') riskLevel = 'high';
  }

  // Check for spam patterns
  const spamIssues = detectSpamPatterns(input);
  if (spamIssues.length > 0) {
    issues.push(...spamIssues.map(issue => `Spam pattern: ${issue}`));
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  // Check for suspicious file extensions
  const fileExtensionIssues = detectSuspiciousFileExtensions(input);
  if (fileExtensionIssues.length > 0) {
    issues.push(...fileExtensionIssues);
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  // Check for encoded payloads
  const encodingIssues = detectEncodedPayloads(input);
  if (encodingIssues.length > 0) {
    issues.push(...encodingIssues);
    if (riskLevel !== 'critical' && riskLevel !== 'high') riskLevel = 'medium';
  }

  const isValid = issues.length === 0;
  const sanitizedInput = isValid ? sanitizeHtmlStrict(input) : undefined;

  const result: SecurityValidationResult = {
    isValid,
    issues,
    riskLevel
  };
  
  if (sanitizedInput !== undefined) {
    result.sanitizedInput = sanitizedInput;
  }
  
  return result;
}

/**
 * Detect SQL injection patterns
 * @param input - Input string to check
 * @returns Array of detected issues
 */
function detectSQLInjectionPatterns(input: string): string[] {
  const issues: string[] = [];
  
  SQL_INJECTION_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(input)) {
      issues.push(`SQL pattern ${index + 1}`);
    }
  });

  // Additional SQL injection checks
  const additionalPatterns = [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bALTER\b.*\bTABLE\b)/i,
    /(\bCREATE\b.*\bTABLE\b)/i,
    /(\bEXEC\b|\bEXECUTE\b)/i,
    /(benchmark|sleep|waitfor|delay)\s*\(/i,
    /(\bOR\b|\bAND\b)\s+\d+\s*[=<>]/i
  ];

  additionalPatterns.forEach((pattern, index) => {
    if (pattern.test(input)) {
      issues.push(`Advanced SQL pattern ${index + 1}`);
    }
  });

  return issues;
}

/**
 * Detect XSS patterns
 * @param input - Input string to check
 * @returns Array of detected issues
 */
function detectXSSPatterns(input: string): string[] {
  const issues: string[] = [];
  
  XSS_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(input)) {
      issues.push(`XSS pattern ${index + 1}`);
    }
  });

  // Additional XSS checks
  const additionalPatterns = [
    /data:\s*text\/html/i,
    /vbscript:/i,
    /livescript:/i,
    /mocha:/i,
    /charset\s*=/i,
    /window\s*\[\s*["']eval["']\s*\]/i,
    /base64\s*,/i,
    /fromCharCode/i,
    /innerHTML/i,
    /outerHTML/i
  ];

  additionalPatterns.forEach((pattern, index) => {
    if (pattern.test(input)) {
      issues.push(`Advanced XSS pattern ${index + 1}`);
    }
  });

  return issues;
}

/**
 * Detect spam patterns
 * @param input - Input string to check
 * @returns Array of detected issues
 */
function detectSpamPatterns(input: string): string[] {
  const issues: string[] = [];
  
  SPAM_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(input)) {
      issues.push(`Spam pattern ${index + 1}`);
    }
  });

  return issues;
}

/**
 * Detect suspicious file extensions
 * @param input - Input string to check
 * @returns Array of detected issues
 */
function detectSuspiciousFileExtensions(input: string): string[] {
  const issues: string[] = [];
  
  const suspiciousExtensions = [
    /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|app|deb|pkg|dmg)(\s|$)/i,
    /\.(php|asp|aspx|jsp|cgi|pl|py|rb|sh)(\s|$)/i,
    /\.(htaccess|htpasswd|ini|conf|cfg)(\s|$)/i
  ];

  suspiciousExtensions.forEach((pattern, index) => {
    if (pattern.test(input)) {
      issues.push(`Suspicious file extension detected`);
    }
  });

  return issues;
}

/**
 * Detect encoded payloads
 * @param input - Input string to check
 * @returns Array of detected issues
 */
function detectEncodedPayloads(input: string): string[] {
  const issues: string[] = [];
  
  // Check for various encoding schemes
  const encodingPatterns = [
    /%[0-9a-f]{2}/i, // URL encoding
    /&#x?[0-9a-f]+;/i, // HTML entity encoding
    /\\u[0-9a-f]{4}/i, // Unicode encoding
    /\\x[0-9a-f]{2}/i, // Hex encoding
    /\+/g // Plus encoding (common in URLs)
  ];

  // Decode and check for malicious patterns
  try {
    let decoded = input;
    
    // URL decode
    if (encodingPatterns[0] && encodingPatterns[0].test(input)) {
      decoded = decodeURIComponent(input);
      if (decoded !== input) {
        const decodedIssues = detectSQLInjectionPatterns(decoded).concat(detectXSSPatterns(decoded));
        if (decodedIssues.length > 0) {
          issues.push('Encoded malicious payload detected');
        }
      }
    }
    
    // HTML entity decode
    if (encodingPatterns[1] && encodingPatterns[1].test(input)) {
      decoded = input.replace(/&#x?([0-9a-f]+);/gi, (match, code) => {
        return String.fromCharCode(parseInt(code, code.startsWith('x') ? 16 : 10));
      });
      if (decoded !== input) {
        const decodedIssues = detectXSSPatterns(decoded);
        if (decodedIssues.length > 0) {
          issues.push('HTML entity encoded payload detected');
        }
      }
    }
  } catch (error) {
    // Decoding failed, might be malicious
    issues.push('Malformed encoding detected');
  }

  return issues;
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

/**
 * Generate CSRF token
 * @param userId - User ID
 * @param sessionId - Session ID (optional)
 * @returns CSRF token
 */
export function generateCSRFToken(userId: string, sessionId?: string): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const payload = `${userId}:${sessionId || 'no-session'}:${timestamp}:${randomBytes}`;
  
  const secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

/**
 * Validate CSRF token
 * @param token - CSRF token to validate
 * @param userId - Expected user ID
 * @param sessionId - Expected session ID (optional)
 * @param maxAge - Maximum age in milliseconds (default: 1 hour)
 * @returns Validation result
 */
export function validateCSRFToken(
  token: string,
  userId: string,
  sessionId?: string,
  maxAge: number = 60 * 60 * 1000
): CSRFValidationResult {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    
    if (parts.length !== 5) {
      return { isValid: false, error: 'Invalid token format' };
    }
    
    const [tokenUserId, tokenSessionId, timestamp, randomBytes, signature] = parts;
    
    // Verify user ID
    if (tokenUserId !== userId) {
      return { isValid: false, error: 'Token user mismatch' };
    }
    
    // Verify session ID if provided
    if (sessionId && tokenSessionId !== sessionId) {
      return { isValid: false, error: 'Token session mismatch' };
    }
    
    // Check token age
    const tokenTime = parseInt(timestamp || '0');
    const now = Date.now();
    if (now - tokenTime > maxAge) {
      return { isValid: false, error: 'Token expired' };
    }
    
    // Verify signature
    const payload = `${tokenUserId}:${tokenSessionId}:${timestamp}:${randomBytes}`;
    const secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    if (signature !== expectedSignature) {
      return { isValid: false, error: 'Invalid token signature' };
    }
    
    return {
      isValid: true,
      expiresAt: new Date(tokenTime + maxAge)
    };
  } catch (error) {
    return { isValid: false, error: 'Token parsing failed' };
  }
}

// =============================================================================
// REQUEST SIGNATURE VERIFICATION
// =============================================================================

/**
 * Generate request signature
 * @param method - HTTP method
 * @param path - Request path
 * @param body - Request body
 * @param timestamp - Request timestamp
 * @param secret - Signing secret
 * @returns Request signature
 */
export function generateRequestSignature(
  method: string,
  path: string,
  body: string,
  timestamp: string,
  secret: string
): string {
  const payload = `${method.toUpperCase()}:${path}:${body}:${timestamp}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify request signature
 * @param request - Next.js request object
 * @param secret - Signing secret
 * @param maxAge - Maximum age in milliseconds (default: 5 minutes)
 * @returns Verification result
 */
export async function verifyRequestSignature(
  request: NextRequest,
  secret: string,
  maxAge: number = 5 * 60 * 1000
): Promise<SignatureVerificationResult> {
  try {
    const signature = request.headers.get('x-signature');
    const timestamp = request.headers.get('x-timestamp');
    
    if (!signature || !timestamp) {
      return { isValid: false, error: 'Missing signature or timestamp headers' };
    }
    
    // Check timestamp age
    const requestTime = parseInt(timestamp);
    const now = Date.now();
    if (now - requestTime > maxAge) {
      return { isValid: false, error: 'Request timestamp too old' };
    }
    
    // Get request body
    const body = await request.text();
    const method = request.method;
    const path = new URL(request.url).pathname;
    
    // Compute expected signature
    const expectedSignature = generateRequestSignature(method, path, body, timestamp, secret);
    
    if (signature !== expectedSignature) {
      return {
        isValid: false,
        error: 'Invalid signature',
        computedSignature: expectedSignature
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Signature verification failed' };
  }
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

/**
 * Get security headers for responses
 * @param options - Security options
 * @returns Security headers object
 */
export function getSecurityHeaders(options: {
  allowInlineStyles?: boolean;
  allowInlineScripts?: boolean;
  allowedOrigins?: string[];
} = {}): SecurityHeaders {
  const {
    allowInlineStyles = false,
    allowInlineScripts = false,
    allowedOrigins = ["'self'"]
  } = options;

  const stylesSrc = allowInlineStyles ? "'self' 'unsafe-inline'" : "'self'";
  const scriptsSrc = allowInlineScripts ? "'self' 'unsafe-inline'" : "'self'";
  const connectSrc = allowedOrigins.join(' ');

  return {
    'Content-Security-Policy': [
      `default-src 'self'`,
      `script-src ${scriptsSrc}`,
      `style-src ${stylesSrc}`,
      `img-src 'self' data: https:`,
      `font-src 'self'`,
      `connect-src ${connectSrc}`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-XSS-Protection': '1; mode=block'
  };
}

// =============================================================================
// USER AGENT ANALYSIS
// =============================================================================

/**
 * Analyze user agent for security risks
 * @param userAgent - User agent string
 * @returns Analysis result
 */
export function analyzeUserAgent(userAgent: string): {
  isBot: boolean;
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
} {
  const reasons: string[] = [];
  let isBot = false;
  let isSuspicious = false;
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  if (!userAgent || typeof userAgent !== 'string') {
    return {
      isBot: false,
      isSuspicious: true,
      riskLevel: 'medium',
      reasons: ['Missing or invalid user agent']
    };
  }

  // Check for bot patterns
  if (BOT_USER_AGENT_PATTERNS.some(pattern => pattern.test(userAgent))) {
    isBot = true;
    reasons.push('Bot user agent detected');
    riskLevel = 'medium';
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /python|curl|wget|postman|insomnia|httpie/i,
    /scanner|exploit|hack|attack/i,
    /sqlmap|nikto|nmap|burp/i,
    /^.{0,10}$/, // Very short user agent
    /^.{500,}$/ // Very long user agent
  ];

  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(userAgent)) {
      isSuspicious = true;
      reasons.push('Suspicious user agent pattern');
      riskLevel = 'high';
    }
  });

  // Check for missing common browser indicators
  const browserIndicators = ['Mozilla', 'Chrome', 'Safari', 'Firefox', 'Edge'];
  const hasValidBrowserIndicator = browserIndicators.some(indicator => 
    userAgent.includes(indicator)
  );

  if (!hasValidBrowserIndicator && !isBot) {
    isSuspicious = true;
    reasons.push('No valid browser indicators');
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  return {
    isBot,
    isSuspicious,
    riskLevel,
    reasons
  };
}

// =============================================================================
// EXPORT GROUPED FUNCTIONS
// =============================================================================

/**
 * All sanitization functions
 */
export const Sanitization = {
  sanitizeHtmlStrict,
  sanitizeForDatabase,
  sanitizeJsonInput,
  sanitizeObjectValues
} as const;

/**
 * All validation functions
 */
export const Validation = {
  validateInputSecurity,
  detectSQLInjectionPatterns,
  detectXSSPatterns,
  detectSpamPatterns
} as const;

/**
 * All CSRF protection functions
 */
export const CSRF = {
  generateCSRFToken,
  validateCSRFToken
} as const;

/**
 * All signature verification functions
 */
export const Signature = {
  generateRequestSignature,
  verifyRequestSignature
} as const;

/**
 * All security header functions
 */
export const Headers = {
  getSecurityHeaders
} as const;

/**
 * All user agent analysis functions
 */
export const UserAgent = {
  analyzeUserAgent
} as const;
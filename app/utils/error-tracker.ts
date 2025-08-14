/**
 * Error Tracking Utility
 * 
 * Provides comprehensive error tracking, logging, and monitoring capabilities
 * with support for multiple error tracking services and custom analytics.
 */

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  buildVersion?: string;
  environment?: string;
  [key: string]: any;
}

interface ErrorEvent {
  id: string;
  message: string;
  stack?: string;
  type: 'javascript' | 'unhandled_rejection' | 'network' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: ErrorContext;
  fingerprint?: string;
  tags?: Record<string, string>;
  breadcrumbs?: Breadcrumb[];
  user?: UserInfo | null;
}

interface Breadcrumb {
  timestamp: number;
  message: string;
  category: 'navigation' | 'user' | 'http' | 'console' | 'custom';
  level: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

interface ErrorTrackerConfig {
  apiEndpoint?: string;
  apiKey?: string;
  environment?: string;
  buildVersion?: string;
  enableConsoleLogging?: boolean;
  enableBreadcrumbs?: boolean;
  maxBreadcrumbs?: number;
  enableAutoCapture?: boolean;
  enablePerformanceMonitoring?: boolean;
  beforeSend?: (event: ErrorEvent) => ErrorEvent | null;
  onError?: (event: ErrorEvent) => void;
}

/**
 * Error Tracker Class
 */
export class ErrorTracker {
  private config: ErrorTrackerConfig;
  private breadcrumbs: Breadcrumb[] = [];
  private user: UserInfo | null = null;
  private context: ErrorContext = {};
  private isInitialized = false;

  constructor(config: ErrorTrackerConfig = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableBreadcrumbs: true,
      maxBreadcrumbs: 50,
      enableAutoCapture: true,
      enablePerformanceMonitoring: false,
      environment: process.env.NODE_ENV || 'development',
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown',
      ...config
    };

    this.initialize();
  }

  /**
   * Initialize error tracker
   */
  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Set up global error handlers
    if (this.config.enableAutoCapture) {
      this.setupGlobalErrorHandlers();
    }

    // Set up breadcrumb collection
    if (this.config.enableBreadcrumbs) {
      this.setupBreadcrumbCollection();
    }

    // Set up performance monitoring
    if (this.config.enablePerformanceMonitoring) {
      this.setupPerformanceMonitoring();
    }

    // Initialize context
    this.updateContext({
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      buildVersion: this.config.buildVersion
    });

    this.isInitialized = true;
    this.addBreadcrumb('Error tracker initialized', 'custom', 'info');
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        type: 'javascript',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          type: 'unhandled_rejection',
          severity: 'high'
        }
      );
    });

    // Network errors (fetch)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.captureMessage(
            `HTTP ${response.status}: ${response.statusText}`,
            'warning',
            {
              type: 'network',
              context: {
                url: args[0],
                status: response.status,
                statusText: response.statusText
              }
            }
          );
        }
        
        return response;
      } catch (error) {
        this.captureException(error as Error, {
          type: 'network',
          severity: 'medium',
          context: { url: args[0] }
        });
        throw error;
      }
    };
  }

  /**
   * Set up breadcrumb collection
   */
  private setupBreadcrumbCollection(): void {
    // Console logs
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    console.log = (...args) => {
      this.addBreadcrumb(args.join(' '), 'console', 'info');
      originalConsole.log(...args);
    };

    console.warn = (...args) => {
      this.addBreadcrumb(args.join(' '), 'console', 'warning');
      originalConsole.warn(...args);
    };

    console.error = (...args) => {
      this.addBreadcrumb(args.join(' '), 'console', 'error');
      originalConsole.error(...args);
    };

    // Navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      globalErrorTracker.addBreadcrumb(
        `Navigation to ${args[2]}`,
        'navigation',
        'info',
        { url: args[2] }
      );
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      globalErrorTracker.addBreadcrumb(
        `Navigation replaced to ${args[2]}`,
        'navigation',
        'info',
        { url: args[2] }
      );
      return originalReplaceState.apply(this, args);
    };

    // Click events
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.addBreadcrumb(
          `Clicked ${target.tagName.toLowerCase()}: ${target.textContent?.trim() || target.id || 'unknown'}`,
          'user',
          'info',
          {
            tagName: target.tagName,
            id: target.id,
            className: target.className
          }
        );
      }
    });
  }

  /**
   * Set up performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.addBreadcrumb(
                `Long task detected: ${entry.duration}ms`,
                'custom',
                'warning',
                { duration: entry.duration, startTime: entry.startTime }
              );
            }
          });
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  /**
   * Capture an exception
   */
  captureException(
    error: Error,
    options: {
      type?: ErrorEvent['type'];
      severity?: ErrorEvent['severity'];
      context?: Record<string, any>;
      tags?: Record<string, string>;
      fingerprint?: string;
    } = {}
  ): string {
    const errorId = this.generateErrorId();
    
    const errorEvent: ErrorEvent = {
      id: errorId,
      message: error.message,
      ...(error.stack && { stack: error.stack }),
      type: options.type || 'javascript',
      severity: options.severity || 'medium',
      context: {
        ...this.context,
        ...options.context
      },
      ...(options.tags && { tags: options.tags }),
      fingerprint: options.fingerprint || this.generateFingerprint(error),
      breadcrumbs: [...this.breadcrumbs],
      user: this.user
    };

    this.processError(errorEvent);
    return errorId;
  }

  /**
   * Capture a message
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    options: {
      type?: ErrorEvent['type'];
      context?: Record<string, any>;
      tags?: Record<string, string>;
    } = {}
  ): string {
    const errorId = this.generateErrorId();
    
    const errorEvent: ErrorEvent = {
      id: errorId,
      message,
      type: options.type || 'custom',
      severity: level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low',
      context: {
        ...this.context,
        ...options.context
      },
      ...(options.tags && { tags: options.tags }),
      breadcrumbs: [...this.breadcrumbs],
      user: this.user
    };

    this.processError(errorEvent);
    return errorId;
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(
    message: string,
    category: Breadcrumb['category'] = 'custom',
    level: Breadcrumb['level'] = 'info',
    data?: Record<string, any>
  ): void {
    if (!this.config.enableBreadcrumbs) return;

    const breadcrumb: Breadcrumb = {
      timestamp: Date.now(),
      message,
      category,
      level,
      ...(data && { data })
    };

    this.breadcrumbs.push(breadcrumb);

    // Keep only the most recent breadcrumbs
    if (this.breadcrumbs.length > (this.config.maxBreadcrumbs || 50)) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.config.maxBreadcrumbs!);
    }
  }

  /**
   * Set user information
   */
  setUser(user: UserInfo): void {
    this.user = user;
    this.addBreadcrumb(`User set: ${user.email || user.id}`, 'custom', 'info');
  }

  /**
   * Update context
   */
  updateContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Set tag
   */
  setTag(key: string, value: string): void {
    if (!this.context.tags) {
      this.context.tags = {};
    }
    this.context.tags[key] = value;
  }

  /**
   * Process error event
   */
  private async processError(errorEvent: ErrorEvent): Promise<void> {
    // Apply beforeSend filter
    if (this.config.beforeSend) {
      const filteredEvent = this.config.beforeSend(errorEvent);
      if (!filteredEvent) return;
      errorEvent = filteredEvent;
    }

    // Console logging
    if (this.config.enableConsoleLogging) {
      console.error('Error tracked:', errorEvent);
    }

    // Call onError callback
    if (this.config.onError) {
      this.config.onError(errorEvent);
    }

    // Send to API
    if (this.config.apiEndpoint) {
      try {
        await this.sendToAPI(errorEvent);
      } catch (error) {
        console.error('Failed to send error to API:', error);
      }
    }

    // Store locally for offline support
    this.storeLocally(errorEvent);
  }

  /**
   * Send error to API
   */
  private async sendToAPI(errorEvent: ErrorEvent): Promise<void> {
    const response = await fetch(this.config.apiEndpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify(errorEvent)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
  }

  /**
   * Store error locally
   */
  private storeLocally(errorEvent: ErrorEvent): void {
    try {
      const stored = localStorage.getItem('error-tracker-events');
      const events = stored ? JSON.parse(stored) : [];
      
      events.push(errorEvent);
      
      // Keep only the most recent 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('error-tracker-events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store error locally:', error);
    }
  }

  /**
   * Generate error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate error fingerprint for grouping
   */
  private generateFingerprint(error: Error): string {
    const message = error.message.replace(/\d+/g, 'X'); // Replace numbers
    const stack = error.stack?.split('\n')[0] || '';
    return btoa(`${message}:${stack}`).substr(0, 16);
  }

  /**
   * Get stored errors
   */
  getStoredErrors(): ErrorEvent[] {
    try {
      const stored = localStorage.getItem('error-tracker-events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to get stored errors:', error);
      return [];
    }
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors(): void {
    try {
      localStorage.removeItem('error-tracker-events');
    } catch (error) {
      console.warn('Failed to clear stored errors:', error);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: number;
  } {
    const errors = this.getStoredErrors();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    const stats = {
      total: errors.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      recent: 0
    };

    errors.forEach(error => {
      // Count by type
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      
      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      
      // Count recent errors
      const errorTime = new Date(error.context.timestamp || 0).getTime();
      if (errorTime > oneHourAgo) {
        stats.recent++;
      }
    });

    return stats;
  }
}

// Global error tracker instance
let globalErrorTracker: ErrorTracker;

/**
 * Initialize global error tracker
 */
export function initializeErrorTracker(config: ErrorTrackerConfig = {}): ErrorTracker {
  if (!globalErrorTracker) {
    globalErrorTracker = new ErrorTracker({
      apiEndpoint: '/api/log-error',
      enableAutoCapture: true,
      enableBreadcrumbs: true,
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      ...config
    });
  }
  return globalErrorTracker;
}

/**
 * Get global error tracker instance
 */
export function getErrorTracker(): ErrorTracker {
  if (!globalErrorTracker) {
    globalErrorTracker = initializeErrorTracker();
  }
  return globalErrorTracker;
}

/**
 * Utility functions for common error tracking patterns
 */
export const ErrorTrackerUtils = {
  /**
   * Track API errors
   */
  trackAPIError: (endpoint: string, error: Error, statusCode?: number) => {
    getErrorTracker().captureException(error, {
      type: 'network',
      severity: statusCode && statusCode >= 500 ? 'high' : 'medium',
      tags: {
        endpoint,
        ...(statusCode && { statusCode: statusCode.toString() })
      },
      context: { endpoint, statusCode }
    });
  },

  /**
   * Track user actions
   */
  trackUserAction: (action: string, data?: Record<string, any>) => {
    getErrorTracker().addBreadcrumb(`User action: ${action}`, 'user', 'info', data);
  },

  /**
   * Track performance issues
   */
  trackPerformanceIssue: (metric: string, value: number, threshold: number) => {
    if (value > threshold) {
      getErrorTracker().captureMessage(
        `Performance issue: ${metric} (${value}ms > ${threshold}ms)`,
        'warning',
        {
          type: 'custom',
          tags: { metric, performance: 'slow' },
          context: { value, threshold }
        }
      );
    }
  },

  /**
   * Track business logic errors
   */
  trackBusinessError: (operation: string, error: string, context?: Record<string, any>) => {
    getErrorTracker().captureMessage(
      `Business error in ${operation}: ${error}`,
      'error',
      {
        type: 'custom',
        tags: { operation, category: 'business' },
        ...(context && { context })
      }
    );
  }
};

// Initialize error tracker on import (browser only)
if (typeof window !== 'undefined') {
  initializeErrorTracker();
}

export default ErrorTracker;
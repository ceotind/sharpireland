/**
 * Performance Monitor Utility
 *
 * Provides comprehensive performance monitoring including Web Vitals,
 * custom metrics, resource timing, and performance budgets.
 */

// Define MemoryInfo interface for browsers that support it
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge' | 'histogram';
  tags?: Record<string, string> | undefined;
}

interface WebVitalsMetrics {
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  TTFB?: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  startTime: number;
  responseEnd: number;
}

interface PerformanceBudget {
  metric: string;
  budget: number;
  warning: number;
  current?: number;
  status: 'good' | 'warning' | 'exceeded';
}

interface PerformanceReport {
  timestamp: number;
  webVitals: WebVitalsMetrics;
  customMetrics: PerformanceMetric[];
  resourceTimings: ResourceTiming[];
  memoryUsage?: MemoryInfo;
  budgets: PerformanceBudget[];
  recommendations: string[];
}

/**
 * Performance monitoring class with Web Vitals and custom metrics
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private webVitals: WebVitalsMetrics = {};
  private budgets: PerformanceBudget[] = [];
  private observers: PerformanceObserver[] = [];
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    
    if (this.isClient) {
      this.initializeWebVitals();
      this.initializeResourceObserver();
      this.initializeLongTaskObserver();
    }
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals(): void {
    // First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.webVitals.FCP = entry.startTime;
          this.recordMetric('FCP', entry.startTime, 'timing');
        }
      });
    });

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.webVitals.LCP = lastEntry.startTime;
        this.recordMetric('LCP', lastEntry.startTime, 'timing');
      }
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        this.webVitals.FID = fid;
        this.recordMetric('FID', fid, 'timing');
      });
    });

    // Cumulative Layout Shift
    this.observePerformanceEntry('layout-shift', (entries) => {
      let cls = 0;
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      this.webVitals.CLS = cls;
      this.recordMetric('CLS', cls, 'gauge');
    });

    // Time to First Byte
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const ttfb = timing.responseStart - timing.navigationStart;
      this.webVitals.TTFB = ttfb;
      this.recordMetric('TTFB', ttfb, 'timing');
    }
  }

  /**
   * Initialize resource timing observer
   */
  private initializeResourceObserver(): void {
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach((entry: any) => {
        this.recordMetric(`resource.${entry.initiatorType}.duration`, entry.duration, 'timing', {
          name: entry.name,
          type: entry.initiatorType
        });
      });
    });
  }

  /**
   * Initialize long task observer
   */
  private initializeLongTaskObserver(): void {
    this.observePerformanceEntry('longtask', (entries) => {
      entries.forEach((entry) => {
        this.recordMetric('longTask.duration', entry.duration, 'timing');
        console.warn(`Long task detected: ${entry.duration}ms`);
      });
    });
  }

  /**
   * Generic performance observer helper
   */
  private observePerformanceEntry(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${entryType} not supported:`, error);
    }
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(
    name: string,
    value: number,
    type: 'timing' | 'counter' | 'gauge' | 'histogram' = 'gauge',
    tags?: Record<string, string>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type,
      ...(tags && { tags })
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Start timing a custom operation
   */
  startTiming(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'timing');
      return duration;
    };
  }

  /**
   * Measure function execution time
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const endTiming = this.startTiming(name);
    try {
      const result = fn();
      endTiming();
      return result;
    } catch (error) {
      endTiming();
      throw error;
    }
  }

  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const endTiming = this.startTiming(name);
    try {
      const result = await fn();
      endTiming();
      return result;
    } catch (error) {
      endTiming();
      throw error;
    }
  }

  /**
   * Set performance budget
   */
  setBudget(metric: string, budget: number, warning: number = budget * 0.8): void {
    const existingBudget = this.budgets.find(b => b.metric === metric);
    if (existingBudget) {
      existingBudget.budget = budget;
      existingBudget.warning = warning;
    } else {
      this.budgets.push({
        metric,
        budget,
        warning,
        status: 'good'
      });
    }
  }

  /**
   * Check performance budgets
   */
  checkBudgets(): PerformanceBudget[] {
    return this.budgets.map(budget => {
      const latestMetric = this.getLatestMetric(budget.metric);
      const current = latestMetric?.value || 0;
      
      let status: 'good' | 'warning' | 'exceeded' = 'good';
      if (current > budget.budget) {
        status = 'exceeded';
      } else if (current > budget.warning) {
        status = 'warning';
      }

      return {
        ...budget,
        current,
        status
      };
    });
  }

  /**
   * Get latest metric by name
   */
  getLatestMetric(name: string): PerformanceMetric | null {
    const filtered = this.metrics.filter(m => m.name === name);
    return filtered.length > 0 ? filtered[filtered.length - 1] || null : null;
  }

  /**
   * Get metrics by name and time range
   */
  getMetrics(
    name?: string,
    startTime?: number,
    endTime?: number
  ): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (startTime) {
      filtered = filtered.filter(m => m.timestamp >= startTime);
    }

    if (endTime) {
      filtered = filtered.filter(m => m.timestamp <= endTime);
    }

    return filtered;
  }

  /**
   * Get resource timing data
   */
  getResourceTimings(): ResourceTiming[] {
    if (!this.isClient || !window.performance) return [];

    const entries = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return entries.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      transferSize: entry.transferSize || 0,
      encodedBodySize: entry.encodedBodySize || 0,
      decodedBodySize: entry.decodedBodySize || 0,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd
    }));
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage(): MemoryInfo | null {
    if (!this.isClient || !(window.performance as any).memory) return null;
    return (window.performance as any).memory;
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const budgetResults = this.checkBudgets();

    // Check Web Vitals
    if (this.webVitals.LCP && this.webVitals.LCP > 2500) {
      recommendations.push('Largest Contentful Paint is slow. Consider optimizing images and reducing server response times.');
    }

    if (this.webVitals.FID && this.webVitals.FID > 100) {
      recommendations.push('First Input Delay is high. Consider reducing JavaScript execution time.');
    }

    if (this.webVitals.CLS && this.webVitals.CLS > 0.1) {
      recommendations.push('Cumulative Layout Shift is high. Ensure images and ads have dimensions set.');
    }

    if (this.webVitals.FCP && this.webVitals.FCP > 1800) {
      recommendations.push('First Contentful Paint is slow. Consider optimizing critical rendering path.');
    }

    // Check budgets
    budgetResults.forEach(budget => {
      if (budget.status === 'exceeded') {
        recommendations.push(`Performance budget exceeded for ${budget.metric}: ${budget.current}ms > ${budget.budget}ms`);
      } else if (budget.status === 'warning') {
        recommendations.push(`Performance budget warning for ${budget.metric}: ${budget.current}ms > ${budget.warning}ms`);
      }
    });

    // Check resource timings
    const resourceTimings = this.getResourceTimings();
    const slowResources = resourceTimings.filter(r => r.duration > 1000);
    if (slowResources.length > 0) {
      recommendations.push(`${slowResources.length} resources are loading slowly (>1s). Consider optimizing or lazy loading.`);
    }

    // Check memory usage
    const memory = this.getMemoryUsage();
    if (memory && memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
      recommendations.push('High memory usage detected. Consider optimizing JavaScript and reducing memory leaks.');
    }

    return recommendations;
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport(): PerformanceReport {
    const memoryUsage = this.getMemoryUsage();
    return {
      timestamp: Date.now(),
      webVitals: { ...this.webVitals },
      customMetrics: [...this.metrics],
      resourceTimings: this.getResourceTimings(),
      ...(memoryUsage && { memoryUsage }),
      budgets: this.checkBudgets(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.generateReport(), null, 2);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.webVitals = {};
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
    this.clearMetrics();
  }
}

/**
 * Performance decorator for methods
 */
export function performanceMonitor(metricName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const name = metricName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = function (...args: any[]) {
      const monitor = getPerformanceMonitor();
      return monitor.measureFunction(name, () => method.apply(this, args));
    };
  };
}

/**
 * Async performance decorator
 */
export function asyncPerformanceMonitor(metricName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const name = metricName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const monitor = getPerformanceMonitor();
      return monitor.measureAsyncFunction(name, () => method.apply(this, args));
    };
  };
}

/**
 * Performance utilities
 */
export const PerformanceUtils = {
  /**
   * Measure component render time
   */
  measureRender(componentName: string, renderFn: () => void): void {
    const monitor = getPerformanceMonitor();
    monitor.measureFunction(`render.${componentName}`, renderFn);
  },

  /**
   * Measure API call performance
   */
  async measureApiCall<T>(endpoint: string, apiCall: () => Promise<T>): Promise<T> {
    const monitor = getPerformanceMonitor();
    return monitor.measureAsyncFunction(`api.${endpoint}`, apiCall);
  },

  /**
   * Set default performance budgets
   */
  setDefaultBudgets(): void {
    const monitor = getPerformanceMonitor();
    
    // Web Vitals budgets
    monitor.setBudget('LCP', 2500, 2000); // Largest Contentful Paint
    monitor.setBudget('FID', 100, 80);    // First Input Delay
    monitor.setBudget('CLS', 0.1, 0.05);  // Cumulative Layout Shift
    monitor.setBudget('FCP', 1800, 1500); // First Contentful Paint
    monitor.setBudget('TTFB', 800, 600);  // Time to First Byte

    // Custom budgets
    monitor.setBudget('api.response', 1000, 800);
    monitor.setBudget('render.component', 16, 12); // 60fps = 16ms per frame
  },

  /**
   * Log performance summary
   */
  logPerformanceSummary(): void {
    const monitor = getPerformanceMonitor();
    const report = monitor.generateReport();
    
    console.group('🚀 Performance Summary');
    console.log('Web Vitals:', report.webVitals);
    console.log('Budget Status:', report.budgets);
    console.log('Recommendations:', report.recommendations);
    console.groupEnd();
  },

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    const monitor = getPerformanceMonitor();
    const budgets = monitor.checkBudgets();
    return budgets.every(budget => budget.status !== 'exceeded');
  }
};

// Global performance monitor instance
let globalPerformanceMonitor: PerformanceMonitor | null = null;

/**
 * Get or create global performance monitor
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
  }
  return globalPerformanceMonitor;
}

// Initialize default budgets on first load
if (typeof window !== 'undefined') {
  PerformanceUtils.setDefaultBudgets();
}

export default PerformanceMonitor;
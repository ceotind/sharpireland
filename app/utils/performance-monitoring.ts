/**
 * Performance monitoring utilities for tracking component render times and other metrics
 */

/**
 * Starts performance measurement for a component
 * @param componentName Name of the component being measured
 */
export const startComponentRender = (componentName: string): void => {
  if (typeof window === 'undefined' || !('performance' in window)) return;
  
  try {
    const markName = `${componentName}-render-start`;
    performance.mark(markName);
  } catch (error) {
    console.error(`Error starting performance measurement for ${componentName}:`, error);
  }
};

/**
 * Ends performance measurement for a component and logs the result
 * @param componentName Name of the component being measured
 * @param logResults Whether to log the results to console (default: true)
 * @returns Duration in milliseconds or undefined if measurement failed
 */
export const endComponentRender = (
  componentName: string, 
  logResults = true
): number | undefined => {
  if (typeof window === 'undefined' || !('performance' in window)) return;
  
  try {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    const measureName = `${componentName}-render-duration`;
    
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const entries = performance.getEntriesByName(measureName);
    let duration: number | undefined;
    
    if (entries.length > 0 && entries[0]) {
      duration = entries[0].duration;
      if (logResults) {
        console.log(`${componentName} render time: ${duration.toFixed(2)}ms`);
      }
    }
    
    // Clean up marks and measures to avoid memory leaks
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
    
    return duration;
  } catch (error) {
    console.error(`Error ending performance measurement for ${componentName}:`, error);
    return undefined;
  }
};

/**
 * Hook for measuring component render time
 * @param componentName Name of the component being measured
 * @returns Cleanup function to be used in useEffect
 */
export const useComponentPerformance = (componentName: string) => {
  startComponentRender(componentName);
  
  return () => {
    endComponentRender(componentName);
  };
};

/**
 * Reports Core Web Vitals metrics to analytics
 * This is a placeholder for actual implementation that would send data to an analytics service
 */
export const reportWebVitals = (metric: {
  id: string;
  name: string;
  value: number;
  label: string;
  startTime: number;
  duration: number;
}): void => {
  // In a real implementation, this would send the metrics to an analytics service
  console.log('Web Vitals:', metric);
  
  // Example implementation for sending to Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', name, {
  //     event_category: 'Web Vitals',
  //     event_label: id,
  //     value: Math.round(name === 'CLS' ? value * 1000 : value),
  //     non_interaction: true,
  //   });
  // }
};

/**
 * Monitors Largest Contentful Paint (LCP) for a specific element
 * @param elementId ID of the element to monitor for LCP
 */
export const monitorLCP = (elementId: string): void => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Create a PerformanceObserver to monitor LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        console.log(`LCP for ${elementId}:`, lastEntry);
      }
    });
    
    // Start observing LCP
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Disconnect after 10 seconds to avoid memory leaks
    setTimeout(() => {
      lcpObserver.disconnect();
    }, 10000);
  } catch (error) {
    console.error(`Error monitoring LCP for ${elementId}:`, error);
  }
};

/**
 * Monitors Cumulative Layout Shift (CLS) for the page
 */
export const monitorCLS = (): void => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    let clsValue = 0;
    
    // Create a PerformanceObserver to monitor CLS
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log('Current CLS:', clsValue);
    });
    
    // Start observing CLS
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    // Report final CLS value when the page is unloaded
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        console.log('Final CLS:', clsValue);
        clsObserver.disconnect();
      }
    });
  } catch (error) {
    console.error('Error monitoring CLS:', error);
  }
};
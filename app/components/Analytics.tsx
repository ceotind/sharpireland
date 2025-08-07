'use client';

import { useCallback, useEffect } from 'react';
import Script from 'next/script';

// Define missing types
type PerformanceEventTiming = PerformanceEntry & {
  processingStart: number;
  startTime: number;
};

type LayoutShift = PerformanceEntry & {
  value: number;
  hadRecentInput: boolean;
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    trackEvent?: (eventName: string, parameters?: Record<string, unknown>) => void;
    trackPageView?: (url: string, title?: string) => void;
  }
}

interface AnalyticsProps {
  gaId?: string | undefined;
  gtmId?: string | undefined;
}

export default function Analytics({ gaId, gtmId }: AnalyticsProps) {
  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track page load performance
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ttfb: navigation.responseStart - navigation.requestStart,
            download: navigation.responseEnd - navigation.responseStart,
            domInteractive: navigation.domInteractive - navigation.fetchStart,
            domComplete: navigation.domComplete - navigation.fetchStart,
            loadComplete: navigation.loadEventEnd - navigation.fetchStart
          };

          // Log performance metrics
          console.log('Performance Metrics:', metrics);

          // Send to analytics if available
          if (window.gtag && gaId) {
            window.gtag('event', 'page_performance', {
              custom_map: {
                metric1: 'ttfb',
                metric2: 'dom_interactive',
                metric3: 'load_complete'
              },
              ttfb: Math.round(metrics.ttfb),
              dom_interactive: Math.round(metrics.domInteractive),
              load_complete: Math.round(metrics.loadComplete)
            });
          }
        }
      });

      // Track Core Web Vitals with Web Vitals API
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (lastEntry && window.gtag && gaId) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'LCP',
              value: Math.round(lastEntry.startTime),
              non_interaction: true
            });
          }
        });

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch {
          console.warn('LCP observer not supported');
        }

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const eventEntry = entry as PerformanceEventTiming;
            if (window.gtag && gaId && 'processingStart' in eventEntry) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'FID',
                value: Math.round(eventEntry.processingStart - eventEntry.startTime),
                non_interaction: true
              });
            }
          });
        });

        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch {
          console.warn('FID observer not supported');
        }

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const layoutEntry = entry as LayoutShift;
            if ('hadRecentInput' in layoutEntry && 'value' in layoutEntry && !layoutEntry.hadRecentInput) {
              clsValue += layoutEntry.value;
            }
          });

          if (window.gtag && gaId) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000),
              non_interaction: true
            });
          }
        });

        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch {
          console.warn('CLS observer not supported');
        }
      }
    }
  }, [gaId]);

  // Track custom events
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, unknown>) => {
    if (window.gtag && gaId) {
      window.gtag('event', eventName, parameters);
    }
  }, [gaId]);

  // Track page views
  const trackPageView = useCallback((url: string, title?: string) => {
    if (window.gtag && gaId) {
      window.gtag('config', gaId, {
        page_location: url,
        page_title: title
      });
    }
  }, [gaId]);

  // Expose tracking functions globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as { trackEvent?: typeof trackEvent }).trackEvent = trackEvent;
      (window as { trackPageView?: typeof trackPageView }).trackPageView = trackPageView;
    }
  }, [trackEvent, trackPageView]);

  return (
    <>
      {/* Google Analytics */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_location: window.location.href,
                page_title: document.title,
                send_page_view: true,
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Privacy-compliant tracking notice */}
      {(gaId || gtmId) && (
        <div id="analytics-div-1" style={{ display: 'none' }}>
          This site uses analytics to improve user experience while respecting privacy.
        </div>
      )}
    </>
  );
}

// Custom hook for tracking events
export function useAnalytics() {
  const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.trackEvent) {
      window.trackEvent(eventName, parameters);
    }
  };

  const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.trackPageView) {
      window.trackPageView(url, title);
    }
  };

  const trackFormSubmission = (formName: string, success: boolean) => {
    trackEvent('form_submission', {
      form_name: formName,
      success: success,
      timestamp: new Date().toISOString()
    });
  };

  const trackButtonClick = (buttonName: string, location: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      location: location,
      timestamp: new Date().toISOString()
    });
  };

  const trackScrollDepth = (depth: number) => {
    trackEvent('scroll_depth', {
      depth_percentage: depth,
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackFormSubmission,
    trackButtonClick,
    trackScrollDepth
  };
}
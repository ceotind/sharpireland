'use client';

import { useEffect } from 'react';
import reportWebVitals from '@/app/utils/reportWebVitals';
import { performanceLogger } from '@/app/utils/performanceLogger';

export default function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals(metric => {
      performanceLogger({
        name: metric.name,
        value: metric.value,
        unit: 'ms', // Web Vitals are typically in milliseconds
        tags: {
          id: metric.id, // unique ID for the metric
          navigationType: metric.navigationType, // 'navigate', 'reload', 'back_forward', or 'prerender'
          ...(metric.delta !== undefined && { delta: String(metric.delta) }), // Only include if defined
        },
        details: {
          entries: metric.entries, // raw performance entries
        },
      });
    });
  }, []);

  return null; // This component doesn't render anything
}
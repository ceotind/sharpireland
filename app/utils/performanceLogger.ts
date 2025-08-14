interface PerformanceMetric {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
  details?: Record<string, any>;
}

export const performanceLogger = async (metric: PerformanceMetric) => {
  try {
    const response = await fetch('/api/performance-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metric),
    });

    if (!response.ok) {
      console.error('Failed to send performance metric:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending performance metric:', error);
  }
};

// Function to log errors to the same endpoint, or a dedicated error endpoint
export const errorLogger = async (error: Error, context: string, details?: Record<string, any>) => {
  try {
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      details,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch('/api/log-error', { // Assuming an existing /api/log-error endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      console.error('Failed to send error log:', response.statusText);
    }
  } catch (logError) {
    console.error('Error sending error log:', logError);
  }
};
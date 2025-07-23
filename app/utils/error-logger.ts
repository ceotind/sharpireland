const API_BASE_URL = (() => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
})();

function constructApiUrl(path: string): string {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

export interface ErrorContext {
  operation: string;
  source: 'api' | 'local';
  slug?: string;
  url?: string;
  filePath?: string;
}

export interface ErrorLog {
  timestamp: string;
  error: string;
  context: ErrorContext & {
    environment?: string;
    buildPhase?: string;
    apiBaseUrl?: string;
  };
}

export function logError(error: Error, context: ErrorContext): ErrorLog {
  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    context: {
      ...context,
      environment: process.env.NODE_ENV || 'development',
      buildPhase: process.env.NEXT_PHASE || 'runtime',
      apiBaseUrl: API_BASE_URL
    }
  };
  
  console.error('Content Loading Error:', log);
  sendErrorLogToApi(log); // Send to API endpoint
  return log;
}

async function sendErrorLogToApi(log: ErrorLog) {
  try {
    const apiUrl = constructApiUrl('/api/log-error');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      console.error(`Failed to send error log to API: ${response.status} ${response.statusText}`);
    }
  } catch (apiError) {
    console.error('Error sending log to API:', apiError);
  }
}
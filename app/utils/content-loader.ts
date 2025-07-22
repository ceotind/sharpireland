import { Industry } from '@/app/types/content';
import { loadIndustryContentLocal, getAllIndustriesLocal } from './server-content-loader';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';

function constructApiUrl(path: string): string {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

interface ErrorContext {
  operation: string;
  source: 'api' | 'local';
  slug?: string;
  url?: string;
  filePath?: string;
}

interface ErrorLog {
  timestamp: string;
  error: string;
  context: ErrorContext & {
    environment: string;
    apiBaseUrl: string;
  };
}

function logError(error: Error, context: ErrorContext): ErrorLog {
  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    context: {
      ...context,
      environment: process.env.NODE_ENV,
      apiBaseUrl: API_BASE_URL
    }
  };
  
  console.error('Content Loading Error:', log);
  return log;
}

export async function loadIndustryContent(slug: string): Promise<Industry | null> {
  return await loadIndustryContentLocal(slug);
}

export async function getAllIndustries(): Promise<Industry[]> {
  let apiUrl: string = ''; // Declare apiUrl outside try block
  try {
    // First try API
    apiUrl = constructApiUrl('/api/industries');
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (apiError) {
    if (apiError instanceof Error) {
      logError(apiError, {
        operation: 'getAllIndustries',
        source: 'api',
        url: apiUrl
      });
    }
    
    // Fallback to local files
    return await getAllIndustriesLocal();
  }
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {
  let apiUrl: string = ''; // Declare apiUrl outside try block
  try {
    // First try API with specific industry endpoint
    apiUrl = constructApiUrl(`/api/industries/${slug}`);
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (apiError) {
    if (apiError instanceof Error) {
      logError(apiError, {
        operation: 'getIndustryBySlug',
        source: 'api',
        slug,
        url: apiUrl
      });
    }
    
    // Fallback to local file
    return await loadIndustryContentLocal(slug);
  }
}
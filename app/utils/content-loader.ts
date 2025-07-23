import { Industry } from '@/app/types/content';
import { loadIndustryContentLocal, getAllIndustriesLocal } from './server-content-loader';
import { logError } from './error-logger';

interface FetchOptions extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

function constructApiUrl(path: string): string {
  const API_BASE_URL = (() => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
  })();
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export async function loadIndustryContent(slug: string): Promise<Industry | null> {
  // During build, prioritize local files to avoid unnecessary network requests
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return await loadIndustryContentLocal(slug);
  }
  
  // For runtime, try API first, then fall back to local files
  let apiUrl: string = '';
  try {
    apiUrl = constructApiUrl(`/api/industries/${slug}`); // Assuming a similar API endpoint for single industry
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    } as FetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request for industry slug '${slug}' failed with status ${response.status}. Response: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (apiError) {
    if (apiError instanceof Error) {
      logError(apiError, {
        operation: 'loadIndustryContent',
        source: 'api',
        slug,
        url: apiUrl
      });
    }
    
    // Fallback to local file
    return await loadIndustryContentLocal(slug);
  }
}

export async function getAllIndustries(): Promise<Industry[]> {
  // During build, prioritize local files to avoid unnecessary network requests
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return await getAllIndustriesLocal();
  }
  
  // For runtime, try API first, then fall back to local files
  let apiUrl: string = '';
  try {
    apiUrl = constructApiUrl('/api/industries');
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    } as FetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request for all industries failed with status ${response.status}. Response: ${await response.text()}`);
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
  // During build, prioritize local files to avoid unnecessary network requests
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return await loadIndustryContentLocal(slug);
  }
  
  // For runtime, try API first, then fall back to local files
  let apiUrl: string = '';
  try {
    apiUrl = constructApiUrl(`/api/industries/${slug}`);
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    } as FetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request for industry slug '${slug}' failed with status ${response.status}. Response: ${await response.text()}`);
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
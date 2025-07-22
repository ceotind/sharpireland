'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { Industry } from '@/app/types/content';

// Assuming logError is defined elsewhere or needs to be passed/imported
// For now, I'll define a placeholder logError or assume it's imported from content-loader.ts
// Let's assume it's imported from content-loader.ts for consistency.
// However, to avoid circular dependencies, it's better to define it here or in a common utility.
// For simplicity, I'll duplicate it for now, but a better solution would be a shared logging utility.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';

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

export async function loadIndustryContentLocal(slug: string): Promise<Industry | null> {
  try {
    const filePath = path.join(process.cwd(), 'app/content/industries', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const industry = JSON.parse(content) as Industry;
    industry.slug = slug;
    return industry;
  } catch (error) {
    if (error instanceof Error) {
      logError(error, {
        operation: 'loadIndustryContentLocal',
        source: 'local',
        slug,
        filePath: path.join(process.cwd(), 'app/content/industries', `${slug}.json`)
      });
    }
    return null;
  }
}

export async function getAllIndustriesLocal(): Promise<Industry[]> {
  try {
    const contentDir = path.join(process.cwd(), 'app/content/industries');
    const files = await fs.readdir(contentDir);
    const industries = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const slug = file.replace('.json', '');
          return loadIndustryContentLocal(slug);
        })
    );
    
    const validIndustries = industries.filter((industry: Industry | null): industry is Industry => industry !== null);
    
    if (validIndustries.length === 0) {
      throw new Error('No valid industry content found in local files');
    }
    
    return validIndustries;
  } catch (localError) {
    if (localError instanceof Error) {
      logError(localError, {
        operation: 'getAllIndustriesLocal',
        source: 'local',
      });
    }
    return [];
  }
}
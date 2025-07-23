'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { Industry } from '@/app/types/content';

import { logError } from './error-logger';

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
      throw new Error(`No valid industry content found in local files in directory: ${contentDir}`);
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
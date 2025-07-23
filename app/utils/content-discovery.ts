import fs from 'fs';
import path from 'path';
import { loadIndustryContent } from './content-loader';

// Base directory for industry content files
const CONTENT_DIR = path.join(process.cwd(), 'app/content/industries');

// Priority mapping for different industries (for sitemap)
const INDUSTRY_PRIORITIES: Record<string, number> = {
  // Higher priority industries
  'construction': 0.8,
  'dental': 0.8,
  'healthcare': 0.8,
  'legal': 0.8,
  'finance': 0.8,
  'education': 0.8,
  'real-estate': 0.8,
  
  // Medium priority industries
  'hospitality': 0.7,
  'retail': 0.7,
  'manufacturing': 0.7,
  'technology': 0.7,
  
  // Default priority for other industries
  'default': 0.6
};

/**
 * Gets the SEO priority for an industry
 * @param industry The industry identifier
 * @returns Priority value between 0.0 and 1.0
 */
export function getIndustryPriority(industry: string): number {
  return INDUSTRY_PRIORITIES[industry] || INDUSTRY_PRIORITIES.default || 0.6;
}

/**
 * Discovers all available industry content files
 * @returns Array of industry identifiers
 */
export function discoverIndustries(): string[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(CONTENT_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error discovering industries:', error);
    return [];
  }
}

/**
 * Gets metadata for all available industries
 * @returns Array of objects with industry and metadata
 */
export async function getAllIndustriesMetadata(): Promise<Array<{
  industry: string;
  title: string;
  description: string;
  priority: number;
}>> {
  const industries = discoverIndustries();
  const result = [];

  for (const industry of industries) {
    const content = await loadIndustryContent(industry);
    if (content) {
      result.push({
        industry,
        title: content.metadata.title,
        description: content.metadata.description,
        priority: getIndustryPriority(industry)
      });
    }
  }

  return result;
}
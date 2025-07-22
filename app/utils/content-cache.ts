import { IndustryContent } from '../types/content';

// In-memory cache for industry content
const contentCache: Record<string, IndustryContent> = {};

/**
 * Gets content from the cache for the specified industry
 * @param industry The industry identifier
 * @returns The cached content or null if not found
 */
export function getContentCache(industry: string): IndustryContent | null {
  return contentCache[industry] || null;
}

/**
 * Sets content in the cache for the specified industry
 * @param industry The industry identifier
 * @param content The content to cache
 */
export function setContentCache(industry: string, content: IndustryContent): void {
  contentCache[industry] = content;
}

/**
 * Clears the cache for the specified industry
 * @param industry The industry identifier
 */
export function clearContentCache(industry: string): void {
  delete contentCache[industry];
}

/**
 * Clears the entire content cache
 */
export function clearAllContentCache(): void {
  Object.keys(contentCache).forEach(key => {
    delete contentCache[key];
  });
}
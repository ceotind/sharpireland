/**
 * Advanced sitemap generation utilities for Sharp Digital Ireland
 * Provides additional sitemap functionality beyond Next.js built-in sitemap
 */

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  news?: SitemapNews[];
}

export interface SitemapImage {
  url: string;
  caption?: string;
  geoLocation?: string;
  title?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnailUrl: string;
  title: string;
  description: string;
  contentUrl?: string;
  playerUrl?: string;
  duration?: number;
  expirationDate?: Date;
  rating?: number;
  viewCount?: number;
  publicationDate?: Date;
  familyFriendly?: boolean;
  restriction?: string;
  platform?: string;
  requiresSubscription?: boolean;
  uploader?: string;
  live?: boolean;
}

export interface SitemapNews {
  publicationName: string;
  publicationLanguage: string;
  title: string;
  keywords?: string;
  stockTickers?: string;
  publicationDate: Date;
}

/**
 * Validates sitemap entries according to Google's guidelines
 */
export function validateSitemapEntry(entry: SitemapEntry): string[] {
  const errors: string[] = [];

  // URL validation
  if (!entry.url) {
    errors.push('URL is required');
  } else {
    try {
      const url = new URL(entry.url);
      if (!url.protocol.startsWith('http')) {
        errors.push('URL must use HTTP or HTTPS protocol');
      }
      if (url.href.length > 2048) {
        errors.push('URL must be less than 2048 characters');
      }
    } catch {
      errors.push('Invalid URL format');
    }
  }

  // Priority validation
  if (entry.priority < 0 || entry.priority > 1) {
    errors.push('Priority must be between 0.0 and 1.0');
  }

  // Change frequency validation
  const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (!validFrequencies.includes(entry.changeFrequency)) {
    errors.push('Invalid change frequency');
  }

  // Last modified validation
  if (!(entry.lastModified instanceof Date) || isNaN(entry.lastModified.getTime())) {
    errors.push('Invalid lastModified date');
  }

  return errors;
}

/**
 * Generates XML sitemap string from entries
 */
export function generateXMLSitemap(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => {
    let urlXml = '  <url>\n';
    urlXml += `    <loc>${escapeXml(entry.url)}</loc>\n`;
    urlXml += `    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n`;
    urlXml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
    urlXml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;

    // Add image entries if present
    if (entry.images && entry.images.length > 0) {
      entry.images.forEach(image => {
        urlXml += '    <image:image>\n';
        urlXml += `      <image:loc>${escapeXml(image.url)}</image:loc>\n`;
        if (image.caption) urlXml += `      <image:caption>${escapeXml(image.caption)}</image:caption>\n`;
        if (image.title) urlXml += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
        if (image.license) urlXml += `      <image:license>${escapeXml(image.license)}</image:license>\n`;
        if (image.geoLocation) urlXml += `      <image:geo_location>${escapeXml(image.geoLocation)}</image:geo_location>\n`;
        urlXml += '    </image:image>\n';
      });
    }

    // Add video entries if present
    if (entry.videos && entry.videos.length > 0) {
      entry.videos.forEach(video => {
        urlXml += '    <video:video>\n';
        urlXml += `      <video:thumbnail_loc>${escapeXml(video.thumbnailUrl)}</video:thumbnail_loc>\n`;
        urlXml += `      <video:title>${escapeXml(video.title)}</video:title>\n`;
        urlXml += `      <video:description>${escapeXml(video.description)}</video:description>\n`;
        if (video.contentUrl) urlXml += `      <video:content_loc>${escapeXml(video.contentUrl)}</video:content_loc>\n`;
        if (video.playerUrl) urlXml += `      <video:player_loc>${escapeXml(video.playerUrl)}</video:player_loc>\n`;
        if (video.duration) urlXml += `      <video:duration>${video.duration}</video:duration>\n`;
        if (video.expirationDate) urlXml += `      <video:expiration_date>${video.expirationDate.toISOString()}</video:expiration_date>\n`;
        if (video.rating) urlXml += `      <video:rating>${video.rating}</video:rating>\n`;
        if (video.viewCount) urlXml += `      <video:view_count>${video.viewCount}</video:view_count>\n`;
        if (video.publicationDate) urlXml += `      <video:publication_date>${video.publicationDate.toISOString()}</video:publication_date>\n`;
        if (video.familyFriendly !== undefined) urlXml += `      <video:family_friendly>${video.familyFriendly ? 'yes' : 'no'}</video:family_friendly>\n`;
        if (video.restriction) urlXml += `      <video:restriction relationship="allow">${escapeXml(video.restriction)}</video:restriction>\n`;
        if (video.platform) urlXml += `      <video:platform relationship="allow">${escapeXml(video.platform)}</video:platform>\n`;
        if (video.requiresSubscription !== undefined) urlXml += `      <video:requires_subscription>${video.requiresSubscription ? 'yes' : 'no'}</video:requires_subscription>\n`;
        if (video.uploader) urlXml += `      <video:uploader>${escapeXml(video.uploader)}</video:uploader>\n`;
        if (video.live !== undefined) urlXml += `      <video:live>${video.live ? 'yes' : 'no'}</video:live>\n`;
        urlXml += '    </video:video>\n';
      });
    }

    // Add news entries if present
    if (entry.news && entry.news.length > 0) {
      entry.news.forEach(news => {
        urlXml += '    <news:news>\n';
        urlXml += '      <news:publication>\n';
        urlXml += `        <news:name>${escapeXml(news.publicationName)}</news:name>\n`;
        urlXml += `        <news:language>${escapeXml(news.publicationLanguage)}</news:language>\n`;
        urlXml += '      </news:publication>\n';
        urlXml += `      <news:publication_date>${news.publicationDate.toISOString()}</news:publication_date>\n`;
        urlXml += `      <news:title>${escapeXml(news.title)}</news:title>\n`;
        if (news.keywords) urlXml += `      <news:keywords>${escapeXml(news.keywords)}</news:keywords>\n`;
        if (news.stockTickers) urlXml += `      <news:stock_tickers>${escapeXml(news.stockTickers)}</news:stock_tickers>\n`;
        urlXml += '    </news:news>\n';
      });
    }

    urlXml += '  </url>';
    return urlXml;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n${urlsetClose}`;
}

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates entire sitemap according to Google's guidelines
 */
export function validateSitemap(entries: SitemapEntry[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check sitemap size limits
  if (entries.length > 50000) {
    errors.push('Sitemap cannot contain more than 50,000 URLs');
  }

  // Estimate uncompressed size (rough calculation)
  const estimatedSize = entries.reduce((size, entry) => {
    return size + entry.url.length + 200; // Rough estimate for XML overhead
  }, 0);

  if (estimatedSize > 50 * 1024 * 1024) { // 50MB limit
    errors.push('Sitemap size cannot exceed 50MB uncompressed');
  }

  // Validate each entry
  entries.forEach((entry, index) => {
    const entryErrors = validateSitemapEntry(entry);
    entryErrors.forEach(error => {
      errors.push(`Entry ${index + 1}: ${error}`);
    });
  });

  // Check for duplicate URLs
  const urls = entries.map(entry => entry.url);
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate URLs found: ${duplicates.join(', ')}`);
  }

  // Warnings for best practices
  const highPriorityCount = entries.filter(entry => entry.priority >= 0.8).length;
  if (highPriorityCount > entries.length * 0.2) {
    warnings.push('More than 20% of URLs have high priority (0.8+). Consider adjusting priorities.');
  }

  const alwaysChangeFreq = entries.filter(entry => entry.changeFrequency === 'always').length;
  if (alwaysChangeFreq > 0) {
    warnings.push('Using "always" change frequency is rarely appropriate and may be ignored by search engines.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generates sitemap index for multiple sitemaps
 */
export function generateSitemapIndex(sitemaps: { url: string; lastModified: Date }[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexClose = '</sitemapindex>';

  const sitemapEntries = sitemaps.map(sitemap => {
    return `  <sitemap>\n    <loc>${escapeXml(sitemap.url)}</loc>\n    <lastmod>${sitemap.lastModified.toISOString()}</lastmod>\n  </sitemap>`;
  }).join('\n');

  return `${xmlHeader}\n${sitemapIndexOpen}\n${sitemapEntries}\n${sitemapIndexClose}`;
}
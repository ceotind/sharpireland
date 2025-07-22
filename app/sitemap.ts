import { MetadataRoute } from 'next'
import { getAllIndustriesMetadata } from './utils/content-discovery'

/**
 * Google-compliant sitemap for Sharp Digital Ireland
 *
 * Best practices implemented:
 * - Only includes actual pages, not fragments (#sections)
 * - Uses proper priority hierarchy (0.0 to 1.0)
 * - Includes accurate lastModified dates
 * - Uses appropriate changeFrequency values
 * - Follows Google's sitemap protocol standards
 * - Excludes external URLs (they belong in their own sitemaps)
 * - Includes only indexable content
 * - Dynamically includes industry-specific pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sharpdigital.ie'
  const currentDate = new Date()
  
  // Use build time for static content that doesn't change frequently
  const buildDate = new Date('2025-01-15T00:00:00.000Z')
  
  // Get all industry metadata for dynamic routes
  const industriesMetadata = await getAllIndustriesMetadata()
  
  // Create industry-specific sitemap entries
  const industryEntries = industriesMetadata.map(({ industry, priority }) => ({
    url: `${baseUrl}/${industry}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: priority,
  }))
  
  // Base sitemap entries
  const baseEntries = [
    // Homepage - Maximum priority for main landing page
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    
    // Color system showcase page - Lower priority utility page
    {
      url: `${baseUrl}/colors`,
      lastModified: buildDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    
    // Future pages structure - uncomment and modify when adding new pages
    /*
    // Service pages - High priority for business content
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/react-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/nextjs-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/typescript-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    
    // Portfolio/Projects - High priority for showcasing work
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    
    // About page - Medium-high priority for company info
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    
    // Contact page - High priority for lead generation
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    
    // Blog/Articles - Medium priority, frequent updates
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    
    // Case studies - High priority for business credibility
    {
      url: `${baseUrl}/case-studies`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    
    // Pricing page - High priority for business conversion
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    
    // Privacy policy and legal pages - Low priority but necessary
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: buildDate,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: buildDate,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    */
  ]
  
  // Combine base entries with industry entries and return
  return [...baseEntries, ...industryEntries]
}

/**
 * Priority Guidelines:
 * 1.0 - Homepage (most important)
 * 0.9 - Main service pages, portfolio
 * 0.8 - Individual service pages, contact, case studies, pricing, industry pages
 * 0.7 - About page, secondary industry pages
 * 0.6 - Blog/news section, tertiary industry pages
 * 0.3 - Utility pages (colors, tools)
 * 0.2 - Legal pages
 * 0.1 - API endpoints (if publicly accessible)
 *
 * Change Frequency Guidelines:
 * - 'always' - Only for pages that change every time they're accessed
 * - 'hourly' - News sites, live data
 * - 'daily' - Blog, frequently updated content
 * - 'weekly' - Homepage, portfolio, industry pages (if updated regularly)
 * - 'monthly' - Service pages, about page, contact
 * - 'yearly' - Legal pages, rarely updated content
 * - 'never' - Archived content
 */
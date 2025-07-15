import { MetadataRoute } from 'next'

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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sharpdigital.in'
  const currentDate = new Date()
  
  // Use build time for static content that doesn't change frequently
  const buildDate = new Date('2025-01-15T00:00:00.000Z')
  
  return [
    // Homepage - Maximum priority for main landing page
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    
    // Color system showcase page - Lower priority utility page
    {
      url: `${baseUrl}/colors`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    
    // Future pages structure - uncomment and modify when adding new pages
    /*
    // Service pages - High priority for business content
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/react-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/nextjs-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/typescript-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Portfolio/Projects - High priority for showcasing work
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // About page - Medium-high priority for company info
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    
    // Contact page - High priority for lead generation
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Blog/Articles - Medium priority, frequent updates
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    
    // Case studies - High priority for business credibility
    {
      url: `${baseUrl}/case-studies`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Pricing page - High priority for business conversion
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Privacy policy and legal pages - Low priority but necessary
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    */
  ]
}

/**
 * Priority Guidelines:
 * 1.0 - Homepage (most important)
 * 0.9 - Main service pages, portfolio
 * 0.8 - Individual service pages, contact, case studies, pricing
 * 0.7 - About page
 * 0.6 - Blog/news section
 * 0.3 - Utility pages (colors, tools)
 * 0.2 - Legal pages
 * 0.1 - API endpoints (if publicly accessible)
 *
 * Change Frequency Guidelines:
 * - 'always' - Only for pages that change every time they're accessed
 * - 'hourly' - News sites, live data
 * - 'daily' - Blog, frequently updated content
 * - 'weekly' - Homepage, portfolio (if updated regularly)
 * - 'monthly' - Service pages, about page, contact
 * - 'yearly' - Legal pages, rarely updated content
 * - 'never' - Archived content
 */
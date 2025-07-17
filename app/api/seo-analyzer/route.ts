import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface SEOReport {
  url: string;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  links: {
    internal: number;
    external: number;
  };
  score: number;
  recommendations: string[];
}

function calculateSEOScore(report: Omit<SEOReport, 'score' | 'recommendations'>): { score: number; recommendations: string[] } {
  let score = 0;
  const recommendations: string[] = [];

  // Title tag scoring (25 points)
  if (report.title) {
    if (report.titleLength >= 50 && report.titleLength <= 60) {
      score += 25;
    } else if (report.titleLength >= 30 && report.titleLength <= 70) {
      score += 15;
      recommendations.push('Consider optimizing your title tag length to 50-60 characters for better search results.');
    } else {
      score += 5;
      recommendations.push('Your title tag should be between 50-60 characters long for optimal SEO.');
    }
  } else {
    recommendations.push('Add a title tag to your page. This is crucial for SEO.');
  }

  // Meta description scoring (20 points)
  if (report.metaDescription) {
    if (report.metaDescriptionLength >= 150 && report.metaDescriptionLength <= 160) {
      score += 20;
    } else if (report.metaDescriptionLength >= 120 && report.metaDescriptionLength <= 180) {
      score += 12;
      recommendations.push('Consider optimizing your meta description length to 150-160 characters.');
    } else {
      score += 5;
      recommendations.push('Your meta description should be between 150-160 characters long.');
    }
  } else {
    recommendations.push('Add a meta description to improve click-through rates from search results.');
  }

  // H1 tag scoring (20 points)
  if (report.headings.h1.length === 1) {
    score += 20;
  } else if (report.headings.h1.length === 0) {
    recommendations.push('Add an H1 tag to your page. Each page should have exactly one H1 tag.');
  } else {
    score += 10;
    recommendations.push('Use only one H1 tag per page for better SEO structure.');
  }

  // H2 tags scoring (10 points)
  if (report.headings.h2.length >= 2) {
    score += 10;
  } else if (report.headings.h2.length === 1) {
    score += 5;
    recommendations.push('Consider adding more H2 tags to improve content structure.');
  } else {
    recommendations.push('Add H2 tags to structure your content better.');
  }

  // Images alt text scoring (15 points)
  if (report.images.total > 0) {
    const altTextRatio = report.images.withAlt / report.images.total;
    if (altTextRatio === 1) {
      score += 15;
    } else if (altTextRatio >= 0.8) {
      score += 10;
      recommendations.push('Add alt text to all images for better accessibility and SEO.');
    } else if (altTextRatio >= 0.5) {
      score += 5;
      recommendations.push('Many images are missing alt text. Add descriptive alt text to all images.');
    } else {
      recommendations.push('Most images are missing alt text. This is important for accessibility and SEO.');
    }
  }

  // Internal links scoring (10 points)
  if (report.links.internal >= 3) {
    score += 10;
  } else if (report.links.internal >= 1) {
    score += 5;
    recommendations.push('Consider adding more internal links to improve site navigation and SEO.');
  } else {
    recommendations.push('Add internal links to help users navigate your site and improve SEO.');
  }

  // Additional recommendations based on overall analysis
  if (score < 60) {
    recommendations.push('Your page needs significant SEO improvements. Focus on title tags, meta descriptions, and heading structure.');
  } else if (score < 80) {
    recommendations.push('Your page has good SEO basics but could benefit from fine-tuning.');
  }

  return { score: Math.min(100, score), recommendations };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let validUrl: string;
    try {
      validUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(validUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(validUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the webpage' }, { status: 400 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract SEO data
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract headings
    const h1Tags: string[] = [];
    const h2Tags: string[] = [];
    const h3Tags: string[] = [];

    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Tags.push(text);
    });

    $('h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h2Tags.push(text);
    });

    $('h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h3Tags.push(text);
    });

    // Analyze images
    const images = $('img');
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;

    images.each((_, el) => {
      const alt = $(el).attr('alt');
      if (alt && alt.trim()) {
        imagesWithAlt++;
      } else {
        imagesWithoutAlt++;
      }
    });

    // Analyze links
    const links = $('a[href]');
    let internalLinks = 0;
    let externalLinks = 0;
    const domain = extractDomain(validUrl);

    links.each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        if (href.startsWith('http')) {
          const linkDomain = extractDomain(href);
          if (linkDomain === domain) {
            internalLinks++;
          } else {
            externalLinks++;
          }
        } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
          internalLinks++;
        }
      }
    });

    // Build report
    const reportData = {
      url: validUrl,
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      headings: {
        h1: h1Tags,
        h2: h2Tags,
        h3: h3Tags,
      },
      images: {
        total: images.length,
        withAlt: imagesWithAlt,
        withoutAlt: imagesWithoutAlt,
      },
      links: {
        internal: internalLinks,
        external: externalLinks,
      },
    };

    // Calculate score and recommendations
    const { score, recommendations } = calculateSEOScore(reportData);

    const report: SEOReport = {
      ...reportData,
      score,
      recommendations,
    };

    return NextResponse.json(report);

  } catch (error) {
    console.error('SEO analysis error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timeout - the website took too long to respond' }, { status: 408 });
      }
      if (error.message.includes('fetch')) {
        return NextResponse.json({ error: 'Unable to access the website. Please check if the URL is correct and accessible.' }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: 'Internal server error during analysis' }, { status: 500 });
  }
}
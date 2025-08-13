import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface CoreWebVitals {
  lcp: {
    value: number;
    status: 'good' | 'needs-improvement' | 'poor';
    recommendation: string;
  };
  fid: {
    value: number;
    status: 'good' | 'needs-improvement' | 'poor';
    recommendation: string;
  };
  cls: {
    value: number;
    status: 'good' | 'needs-improvement' | 'poor';
    recommendation: string;
  };
}

export interface EnhancedSEOReport extends SEOReport {
  coreWebVitals: CoreWebVitals;
  contentQuality: {
    wordCount: number;
    readabilityScore: number;
    keywordAnalysis: {
      primaryKeyword: string;
      density: number;
      distribution: number;
    };
  };
  security: {
    https: boolean;
    securityHeaders: string[];
    mixedContent: boolean;
  };
  structuredData: {
    schemaTypes: string[];
    qualityScore: number;
  };
  competitors: {
    serpFeatures: string[];
    estimatedBacklinks: number;
  };
}

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

// Function to estimate Core Web Vitals
function estimateCoreWebVitals($: ReturnType<typeof cheerio.load>): CoreWebVitals {
  // These are estimates based on static analysis - in a real implementation,
  // you would use PageSpeed Insights or Lighthouse for accurate metrics
  
  // Estimate LCP based on image loading and above-the-fold content
  const images = $('img');
  
  // Since we can't determine position with cheerio, we'll estimate based on image count and size
  const largeImages = images.filter((_, el) => {
    const width = parseInt($(el).attr('width') || '0');
    const height = parseInt($(el).attr('height') || '0');
    return width > 300 || height > 300;
  });
  
  const lcpValue = Math.min(100, 20 + (largeImages.length * 15));
  const lcpStatus = lcpValue < 50 ? 'good' : lcpValue < 80 ? 'needs-improvement' : 'poor';
  const lcpRecommendation = lcpStatus === 'good' 
    ? 'Good LCP score - page loads quickly' 
    : 'Optimize largest contentful paint by compressing images and using modern formats';
  
  // Estimate FID based on JavaScript complexity
  const scripts = $('script');
  const inlineScripts = scripts.filter((_, el) => {
    const html = $(el).html();
    return html !== null && html.trim().length > 0;
  });
  const externalScripts = scripts.filter((_, el) => {
    const src = $(el).attr('src');
    return src !== undefined && src.trim().length > 0;
  });
  
  const fidValue = Math.min(100, 10 + (inlineScripts.length * 5) + (externalScripts.length * 3));
  const fidStatus = fidValue < 50 ? 'good' : fidValue < 80 ? 'needs-improvement' : 'poor';
  const fidRecommendation = fidStatus === 'good' 
    ? 'Good FID score - page is responsive' 
    : 'Reduce JavaScript execution time by minimizing main thread work';
  
  // Estimate CLS based on layout shifts
  // We'll estimate based on elements with absolute or fixed positioning
  const elementsWithPosition = $('*').filter((_, el) => {
    const style = $(el).attr('style') || '';
    return style.includes('position: absolute') || style.includes('position: fixed');
  });
  
  const clsValue = Math.min(100, elementsWithPosition.length * 2);
  const clsStatus = clsValue < 30 ? 'good' : clsValue < 70 ? 'needs-improvement' : 'poor';
  const clsRecommendation = clsStatus === 'good' 
    ? 'Good CLS score - minimal layout shifts' 
    : 'Reduce layout shifts by setting dimensions on media elements and avoiding inserting content above existing content';
  
  return {
    lcp: {
      value: lcpValue,
      status: lcpStatus,
      recommendation: lcpRecommendation
    },
    fid: {
      value: fidValue,
      status: fidStatus,
      recommendation: fidRecommendation
    },
    cls: {
      value: clsValue,
      status: clsStatus,
      recommendation: clsRecommendation
    }
  };
}

// Function to analyze content quality
function analyzeContentQuality($: ReturnType<typeof cheerio.load>): {
  wordCount: number;
  readabilityScore: number;
  keywordAnalysis: {
    primaryKeyword: string;
    density: number;
    distribution: number;
  };
} {
  // Extract text content
  const textContent = $('p, h1, h2, h3, h4, h5, h6, li, td, th').text();
  const words = textContent.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Simple readability score (Flesch-Kincaid approximation)
  const sentenceCount = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const syllableCount = words.reduce((count, word) => {
    // Very rough syllable estimation
    return count + Math.max(1, Math.floor(word.length / 4));
  }, 0);
  
  // Flesch-Kincaid Grade Level approximation
  const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount))));
  
  // Simple keyword analysis (find most frequent non-stop word)
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can']);
  const wordFrequency: { [key: string]: number } = {};
  
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  const primaryKeyword = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  
  const keywordCount = wordFrequency[primaryKeyword] || 0;
  const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
  
  // Simple distribution score (0-100)
  const distribution = Math.min(100, keywordCount * 2);
  
  return {
    wordCount,
    readabilityScore,
    keywordAnalysis: {
      primaryKeyword,
      density,
      distribution
    }
  };
}

// Function to analyze security aspects
function analyzeSecurity(response: Response, $: ReturnType<typeof cheerio.load>): {
  https: boolean;
  securityHeaders: string[];
  mixedContent: boolean;
} {
  const https = response.url.startsWith('https');
  
  // Check security headers
  const securityHeaders: string[] = [];
  const headers = response.headers;
  
  if (headers.get('strict-transport-security')) {
    securityHeaders.push('HSTS');
  }
  if (headers.get('content-security-policy')) {
    securityHeaders.push('CSP');
  }
  if (headers.get('x-content-type-options')) {
    securityHeaders.push('X-Content-Type-Options');
  }
  if (headers.get('x-frame-options')) {
    securityHeaders.push('X-Frame-Options');
  }
  
  // Check for mixed content
  const mixedContent = $('img[src^="http://"], script[src^="http://"], link[href^="http://"]').length > 0;
  
  return {
    https,
    securityHeaders,
    mixedContent
  };
}

// Function to detect structured data
function detectStructuredData($: ReturnType<typeof cheerio.load>): {
  schemaTypes: string[];
  qualityScore: number;
} {
  const schemaTypes: string[] = [];
  
  // Check for JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '{}');
      if (json['@type']) {
        schemaTypes.push(json['@type']);
      } else if (Array.isArray(json)) {
        json.forEach(item => {
          if (item['@type']) {
            schemaTypes.push(item['@type']);
          }
        });
      }
    } catch (e) {
      // Invalid JSON
    }
  });
  
  // Check for microdata
  $('[itemscope][itemtype]').each((_, el) => {
    const itemType = $(el).attr('itemtype');
    if (itemType) {
      const type = itemType.split('/').pop() || itemType;
      if (!schemaTypes.includes(type)) {
        schemaTypes.push(type);
      }
    }
  });
  
  // Quality score based on schema completeness
  const qualityScore = Math.min(100, schemaTypes.length * 20);
  
  return {
    schemaTypes,
    qualityScore
  };
}

// Function to estimate competitor insights
function estimateCompetitorInsights($: ReturnType<typeof cheerio.load>): {
  serpFeatures: string[];
  estimatedBacklinks: number;
} {
  const serpFeatures: string[] = [];
  
  // Check for common SERP features
  if ($('h1').length > 0) serpFeatures.push('Title');
  if ($('meta[name="description"]').attr('content')) serpFeatures.push('Meta Description');
  if ($('[itemscope]').length > 0) serpFeatures.push('Structured Data');
  if ($('img[alt]').length > 3) serpFeatures.push('Good Alt Text');
  
  // Estimate backlinks based on external references (simplified)
  const externalLinks = $('a[href^="http"]').filter((_, el) => {
    try {
      const url = new URL($(el).attr('href') || '', 'http://example.com');
      return url.hostname !== 'example.com';
    } catch {
      return false;
    }
  });
  
  const estimatedBacklinks = Math.min(100, externalLinks.length);
  
  return {
    serpFeatures,
    estimatedBacklinks
  };
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

    // Perform enhanced analysis
    const coreWebVitals = estimateCoreWebVitals($);
    const contentQuality = analyzeContentQuality($);
    const security = analyzeSecurity(response, $);
    const structuredData = detectStructuredData($);
    const competitors = estimateCompetitorInsights($);

    const enhancedReport: EnhancedSEOReport = {
      ...reportData,
      score,
      recommendations,
      coreWebVitals,
      contentQuality,
      security,
      structuredData,
      competitors
    };

    return NextResponse.json(enhancedReport);

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
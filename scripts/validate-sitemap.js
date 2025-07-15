#!/usr/bin/env node

/**
 * Sitemap validation script for Sharp Digital Ireland
 * Validates the sitemap against Google's requirements and best practices
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = 'https://sharpdigital.in/sitemap.xml';
const ROBOTS_URL = 'https://sharpdigital.in/robots.txt';

/**
 * Fetches content from a URL
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Validates sitemap XML structure
 */
function validateSitemapXML(xmlContent) {
  const errors = [];
  const warnings = [];
  
  // Check for XML declaration
  if (!xmlContent.includes('<?xml version="1.0"')) {
    errors.push('Missing XML declaration');
  }
  
  // Check for proper namespace
  if (!xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push('Missing or incorrect sitemap namespace');
  }
  
  // Check for urlset tags
  if (!xmlContent.includes('<urlset') || !xmlContent.includes('</urlset>')) {
    errors.push('Missing urlset tags');
  }
  
  // Extract URLs and validate
  const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
  
  console.log(`Found ${urls.length} URLs in sitemap`);
  
  // Validate each URL
  urls.forEach((url, index) => {
    try {
      new URL(url);
      if (url.length > 2048) {
        errors.push(`URL ${index + 1} exceeds 2048 character limit: ${url.substring(0, 50)}...`);
      }
    } catch (e) {
      errors.push(`Invalid URL format at position ${index + 1}: ${url}`);
    }
  });
  
  // Check for duplicates
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate URLs found: ${duplicates.join(', ')}`);
  }
  
  // Check sitemap size limits
  if (urls.length > 50000) {
    errors.push('Sitemap contains more than 50,000 URLs');
  }
  
  const sitemapSize = Buffer.byteLength(xmlContent, 'utf8');
  if (sitemapSize > 50 * 1024 * 1024) {
    errors.push(`Sitemap size (${Math.round(sitemapSize / 1024 / 1024)}MB) exceeds 50MB limit`);
  }
  
  // Check for proper date formats
  const lastModMatches = xmlContent.match(/<lastmod>(.*?)<\/lastmod>/g) || [];
  lastModMatches.forEach((match, index) => {
    const dateStr = match.replace(/<\/?lastmod>/g, '');
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      errors.push(`Invalid date format in lastmod at position ${index + 1}: ${dateStr}`);
    }
  });
  
  // Check priority values
  const priorityMatches = xmlContent.match(/<priority>(.*?)<\/priority>/g) || [];
  priorityMatches.forEach((match, index) => {
    const priority = parseFloat(match.replace(/<\/?priority>/g, ''));
    if (isNaN(priority) || priority < 0 || priority > 1) {
      errors.push(`Invalid priority value at position ${index + 1}: ${priority}`);
    }
  });
  
  // Check change frequency values
  const changeFreqMatches = xmlContent.match(/<changefreq>(.*?)<\/changefreq>/g) || [];
  const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  changeFreqMatches.forEach((match, index) => {
    const freq = match.replace(/<\/?changefreq>/g, '');
    if (!validFrequencies.includes(freq)) {
      errors.push(`Invalid change frequency at position ${index + 1}: ${freq}`);
    }
  });
  
  // Warnings for best practices
  const highPriorityCount = priorityMatches.filter(match => {
    const priority = parseFloat(match.replace(/<\/?priority>/g, ''));
    return priority >= 0.8;
  }).length;
  
  if (highPriorityCount > urls.length * 0.2) {
    warnings.push(`${highPriorityCount} URLs have high priority (0.8+). Consider adjusting priorities.`);
  }
  
  const alwaysFreqCount = changeFreqMatches.filter(match => 
    match.includes('>always<')
  ).length;
  
  if (alwaysFreqCount > 0) {
    warnings.push(`${alwaysFreqCount} URLs use "always" change frequency, which is rarely appropriate.`);
  }
  
  return { urls, errors, warnings, sitemapSize };
}

/**
 * Validates robots.txt for sitemap reference
 */
function validateRobotsTxt(robotsContent) {
  const errors = [];
  const warnings = [];
  
  if (!robotsContent.toLowerCase().includes('sitemap:')) {
    errors.push('robots.txt does not contain sitemap reference');
  } else {
    const sitemapLines = robotsContent.split('\n').filter(line => 
      line.toLowerCase().startsWith('sitemap:')
    );
    
    sitemapLines.forEach(line => {
      const sitemapUrl = line.split(':', 2)[1]?.trim();
      if (sitemapUrl) {
        try {
          new URL(sitemapUrl);
        } catch (e) {
          errors.push(`Invalid sitemap URL in robots.txt: ${sitemapUrl}`);
        }
      }
    });
  }
  
  return { errors, warnings };
}

/**
 * Tests URL accessibility
 */
async function testUrlAccessibility(urls) {
  const results = [];
  const maxConcurrent = 5;
  
  console.log(`Testing accessibility of ${urls.length} URLs...`);
  
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const promises = batch.map(async (url) => {
      try {
        const response = await fetchUrl(url);
        return {
          url,
          statusCode: response.statusCode,
          accessible: response.statusCode >= 200 && response.statusCode < 400
        };
      } catch (error) {
        return {
          url,
          statusCode: null,
          accessible: false,
          error: error.message
        };
      }
    });
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Progress indicator
    process.stdout.write(`\rTested ${Math.min(i + maxConcurrent, urls.length)}/${urls.length} URLs`);
  }
  
  console.log(); // New line after progress
  return results;
}

/**
 * Main validation function
 */
async function validateSitemap() {
  console.log('🔍 Validating Sharp Digital Ireland Sitemap...\n');
  
  try {
    // Fetch sitemap
    console.log('📥 Fetching sitemap...');
    const sitemapResponse = await fetchUrl(SITEMAP_URL);
    
    if (sitemapResponse.statusCode !== 200) {
      console.error(`❌ Sitemap not accessible: HTTP ${sitemapResponse.statusCode}`);
      return;
    }
    
    console.log('✅ Sitemap fetched successfully');
    
    // Validate sitemap structure
    console.log('🔍 Validating sitemap structure...');
    const sitemapValidation = validateSitemapXML(sitemapResponse.data);
    
    // Fetch and validate robots.txt
    console.log('📥 Fetching robots.txt...');
    try {
      const robotsResponse = await fetchUrl(ROBOTS_URL);
      if (robotsResponse.statusCode === 200) {
        const robotsValidation = validateRobotsTxt(robotsResponse.data);
        sitemapValidation.errors.push(...robotsValidation.errors);
        sitemapValidation.warnings.push(...robotsValidation.warnings);
      } else {
        sitemapValidation.warnings.push('robots.txt not accessible or not found');
      }
    } catch (error) {
      sitemapValidation.warnings.push(`Could not fetch robots.txt: ${error.message}`);
    }
    
    // Test URL accessibility (optional, can be slow)
    if (process.argv.includes('--test-urls')) {
      const accessibilityResults = await testUrlAccessibility(sitemapValidation.urls);
      const inaccessibleUrls = accessibilityResults.filter(result => !result.accessible);
      
      if (inaccessibleUrls.length > 0) {
        sitemapValidation.errors.push(`${inaccessibleUrls.length} URLs are not accessible`);
        inaccessibleUrls.forEach(result => {
          sitemapValidation.errors.push(`  - ${result.url} (${result.statusCode || 'Error'})`);
        });
      }
    }
    
    // Display results
    console.log('\n📊 Validation Results:');
    console.log(`   URLs found: ${sitemapValidation.urls.length}`);
    console.log(`   Sitemap size: ${Math.round(sitemapValidation.sitemapSize / 1024)}KB`);
    
    if (sitemapValidation.errors.length === 0) {
      console.log('\n✅ Sitemap validation passed!');
    } else {
      console.log('\n❌ Sitemap validation failed:');
      sitemapValidation.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
    
    if (sitemapValidation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      sitemapValidation.warnings.forEach(warning => {
        console.log(`   • ${warning}`);
      });
    }
    
    // Google Search Console submission reminder
    console.log('\n💡 Next Steps:');
    console.log('   1. Submit sitemap to Google Search Console');
    console.log('   2. Submit sitemap to Bing Webmaster Tools');
    console.log('   3. Monitor indexing status regularly');
    console.log('   4. Update sitemap when adding new pages');
    
    process.exit(sitemapValidation.errors.length === 0 ? 0 : 1);
    
  } catch (error) {
    console.error(`❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  validateSitemap();
}

module.exports = { validateSitemap, validateSitemapXML, validateRobotsTxt };
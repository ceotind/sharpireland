import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import rateLimiter from '../../utils/rate-limit';
import csrfProtection from '../../utils/csrf';

// Logging utility
function logError(message: string, error?: unknown, request?: NextRequest) {
  const timestamp = new Date().toISOString();
  const ip = request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown';
  const userAgent = request?.headers.get('user-agent') || 'unknown';
  
  console.error(`[${timestamp}] ${message}`, {
    ip,
    userAgent,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined
  });
}

function logInfo(message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data);
}

// Create transporter using existing SMTP configuration
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Interface for detailed SEO report request
interface DetailedSEOReportData {
  name: string;
  website: string;
  email: string;
  currentReportUrl?: string | undefined;
}

// Generate admin notification email HTML
function generateAdminNotificationEmail(data: DetailedSEOReportData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detailed SEO Report Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #555555; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; padding: 10px; background: #ffffff; border-left: 4px solid #2563eb; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .priority { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Detailed SEO Report Request</h1>
          <p>New inquiry from Sharp Digital Ireland SEO Analyzer</p>
        </div>
        <div class="content">
          <div class="priority">
            <strong>⚡ Priority Request:</strong> Client is interested in comprehensive SEO analysis services
          </div>
          
          <div class="field">
            <div class="label">👤 Client Name:</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email Address:</div>
            <div class="value">${data.email}</div>
          </div>
          
          <div class="field">
            <div class="label">🌐 Website URL:</div>
            <div class="value">${data.website}</div>
          </div>
          
          ${data.currentReportUrl ? `
          <div class="field">
            <div class="label">📊 Current Report URL:</div>
            <div class="value">${data.currentReportUrl}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">📅 Request Date:</div>
            <div class="value">${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}</div>
          </div>
          
          <div class="priority">
            <strong>📋 Next Steps:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Review the website: ${data.website}</li>
              <li>Prepare comprehensive SEO analysis</li>
              <li>Contact client within 24 hours</li>
              <li>Provide detailed report with actionable recommendations</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>Sharp Digital Ireland - SEO Analyzer Tool</p>
          <p>This is an automated notification from the detailed SEO report request system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate client confirmation email HTML
function generateClientConfirmationEmail(data: DetailedSEOReportData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Detailed SEO Report Request - Sharp Digital Ireland</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #555555; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .highlight { background: #ffffff; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .contact-info { background: #ffffff; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
        .cta { background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You, ${data.name}! 🎉</h1>
          <p>Your detailed SEO report request has been received</p>
        </div>
        <div class="content">
          <p>Thank you for your interest in a comprehensive SEO analysis from Sharp Digital Ireland. We're excited to help you unlock your website's full potential!</p>
          
          <div class="highlight">
            <h3>🚀 What You'll Receive:</h3>
            <ul>
              <li><strong>Comprehensive Website Audit</strong> - Technical SEO, on-page optimization, and performance analysis</li>
              <li><strong>Competitor Analysis</strong> - See how you stack up against your competition</li>
              <li><strong>Keyword Opportunities</strong> - Discover high-value keywords you're missing</li>
              <li><strong>Actionable Recommendations</strong> - Step-by-step guide to improve your rankings</li>
              <li><strong>Performance Metrics</strong> - Core Web Vitals, page speed, and user experience insights</li>
            </ul>
          </div>

          <div class="highlight">
            <h3>⏰ What Happens Next?</h3>
            <ol>
              <li>Our SEO experts will analyze your website: <strong>${data.website}</strong></li>
              <li>We'll prepare a detailed, personalized report</li>
              <li>You'll receive your comprehensive analysis within <strong>24 hours</strong></li>
              <li>We'll include a complimentary consultation call to discuss the findings</li>
            </ol>
          </div>

          <div class="contact-info">
            <h3>📞 Contact Information</h3>
            <p><strong>Email:</strong> dilshad@sharpdigital.in</p>
            <p><strong>Website:</strong> https://sharpdigital.ie</p>
            <p><strong>Specialties:</strong> SEO, Web Development, Digital Marketing</p>
          </div>

          <p>We're committed to helping Irish businesses succeed online. Your detailed SEO report will provide you with the insights and strategy needed to improve your search engine visibility and drive more organic traffic.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://sharpdigital.ie" class="cta">Visit Our Website</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>Sharp Digital Ireland</strong> - Crafting Digital Experiences</p>
          <p>This is an automated confirmation email. We'll be in touch soon with your detailed SEO report!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Validate detailed SEO report form data
function validateDetailedSEOReportForm(data: Record<string, unknown>): { isValid: boolean; errors: string[]; sanitizedData?: DetailedSEOReportData } {
  const errors: string[] = [];
  
  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  // Website validation
  if (!data.website || typeof data.website !== 'string') {
    errors.push('Website URL is required');
  } else {
    try {
      const url = new URL(data.website.startsWith('http') ? data.website : `https://${data.website}`);
      if (!url.hostname.includes('.')) {
        errors.push('Please provide a valid website URL');
      }
    } catch {
      errors.push('Please provide a valid website URL');
    }
  }
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email address is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address');
    }
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // At this point, we know the data is valid based on our checks above
  const name = data.name as string;
  const website = data.website as string;
  const email = data.email as string;
  
  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      name: name.trim(),
      website: website.trim(),
      email: email.trim().toLowerCase(),
      currentReportUrl: (typeof data.currentReportUrl === 'string' ? data.currentReportUrl : undefined)
    }
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting check
    const rateLimitResult = rateLimiter.isRateLimited(request);
    if (rateLimitResult.isLimited) {
      logInfo('Rate limit exceeded for detailed SEO report request', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        retryAfter: rateLimitResult.retryAfter
      });
      
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
            'X-RateLimit-Limit': process.env.RATE_LIMIT_MAX || '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      );
    }

    // Parse request body with size limit
    let body;
    try {
      const text = await request.text();
      if (text.length > 5000) { // 5KB limit
        throw new Error('Request body too large');
      }
      body = JSON.parse(text);
    } catch (error) {
      logError('Invalid request body for detailed SEO report', error, request);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format'
        },
        { status: 400 }
      );
    }

    // CSRF protection (skip in development)
    if (process.env.NODE_ENV === 'production') {
      const isValidCSRF = await csrfProtection.validateRequest(request, body);
      if (!isValidCSRF) {
        logError('CSRF validation failed for detailed SEO report', null, request);
        return NextResponse.json(
          {
            success: false,
            message: 'Security validation failed'
          },
          { status: 403 }
        );
      }
    }

    // Input validation and sanitization
    const validation = validateDetailedSEOReportForm(body);
    if (!validation.isValid) {
      logInfo('Validation failed for detailed SEO report', { errors: validation.errors });
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    const formData = validation.sanitizedData!;

    // Create transporter
    const transporter = createTransporter();

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (error) {
      logError('SMTP connection failed for detailed SEO report', error, request);
      return NextResponse.json(
        {
          success: false,
          message: 'Email service temporarily unavailable. Please try again later.'
        },
        { status: 500 }
      );
    }

    // Send admin notification email
    const adminEmailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: formData.email,
      subject: `🎯 Detailed SEO Report Request - ${formData.name}`,
      html: generateAdminNotificationEmail(formData),
      text: `
Detailed SEO Report Request

Client Name: ${formData.name}
Email: ${formData.email}
Website: ${formData.website}
${formData.currentReportUrl ? `Current Report URL: ${formData.currentReportUrl}` : ''}

Request Date: ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}

Next Steps:
- Review the website: ${formData.website}
- Prepare comprehensive SEO analysis
- Contact client within 24 hours
- Provide detailed report with actionable recommendations
      `.trim()
    };

    // Send client confirmation email
    const clientEmailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: formData.email,
      subject: 'Your Detailed SEO Report Request - Sharp Digital Ireland',
      html: generateClientConfirmationEmail(formData),
      text: `
Thank you for your interest in a detailed SEO report, ${formData.name}!

We've received your request for a comprehensive SEO analysis of ${formData.website}.

What You'll Receive:
- Comprehensive Website Audit
- Competitor Analysis  
- Keyword Opportunities
- Actionable Recommendations
- Performance Metrics

What Happens Next:
1. Our SEO experts will analyze your website
2. We'll prepare a detailed, personalized report
3. You'll receive your analysis within 24 hours
4. We'll include a complimentary consultation call

Contact Information:
Email: dilshad@sharpdigital.in
Website: https://sharpdigital.ie

Sharp Digital Ireland - Crafting Digital Experiences
      `.trim()
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(clientEmailOptions)
    ]);

    const processingTime = Date.now() - startTime;
    logInfo('Detailed SEO report request submitted successfully', {
      email: formData.email,
      website: formData.website,
      processingTime: `${processingTime}ms`
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your request! We\'ll send you a detailed SEO report within 24 hours.'
    });

  } catch (error) {
    logError('Detailed SEO report request error', error, request);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}
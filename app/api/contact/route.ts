import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import rateLimiter from '../../utils/rate-limit';
import csrfProtection from '../../utils/csrf';
import inputValidator, { ContactFormData } from '../../utils/validation';

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

// Create transporter
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

// Generate notification email HTML
function generateNotificationEmail(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #10b981; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>Sharp Digital Ireland Website</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Project Description:</div>
            <div class="value">${data.description.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the Sharp Digital Ireland contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate confirmation email HTML
function generateConfirmationEmail(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting Sharp Digital Ireland</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .highlight { background: white; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .contact-info { background: white; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You, ${data.name}!</h1>
          <p>We've received your message</p>
        </div>
        <div class="content">
          <p>Thank you for contacting Sharp Digital Ireland. We've received your project inquiry and will get back to you within 24 hours.</p>
          
          <div class="highlight">
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your project requirements</li>
              <li>We'll prepare a detailed proposal tailored to your needs</li>
              <li>You'll receive a response within 24 hours</li>
              <li>We'll schedule a consultation call to discuss your project</li>
            </ul>
          </div>

          <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> dilshad@sharpdigital.in</p>
            <p><strong>Website:</strong> https://sharpdigital.ie</p>
            <p><strong>Services:</strong> Web Development, SEO, Digital Marketing</p>
          </div>

          <p>We're excited to help bring your digital vision to life!</p>
        </div>
        <div class="footer">
          <p>Sharp Digital Ireland - Crafting Digital Experiences</p>
          <p>This is an automated confirmation email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting check
    const rateLimitResult = rateLimiter.isRateLimited(request);
    if (rateLimitResult.isLimited) {
      logInfo('Rate limit exceeded', {
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
      if (text.length > 10000) { // 10KB limit
        throw new Error('Request body too large');
      }
      body = JSON.parse(text);
    } catch (error) {
      logError('Invalid request body', error, request);
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
        logError('CSRF validation failed', null, request);
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
    const validation = inputValidator.validateContactForm(body);
    if (!validation.isValid) {
      logInfo('Validation failed', { errors: validation.errors });
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    // Security checks
    const userAgent = request.headers.get('user-agent');
    const securityErrors = inputValidator.performSecurityChecks(body, userAgent || undefined);
    if (securityErrors.length > 0) {
      logError('Security check failed', { errors: securityErrors }, request);
      return NextResponse.json(
        {
          success: false,
          message: 'Security validation failed'
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
      logError('SMTP connection failed', error, request);
      return NextResponse.json(
        {
          success: false,
          message: 'Email service temporarily unavailable. Please try again later.'
        },
        { status: 500 }
      );
    }

    // Send notification email to Sharp Digital team
    const notificationEmailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: formData.email,
      subject: `New Contact Form Submission - ${formData.name}`,
      html: generateNotificationEmail(formData),
      text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Project Description: ${formData.description}

Submitted: ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}
      `.trim()
    };

    // Send confirmation email to user
    const confirmationEmailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: formData.email,
      subject: 'Thank you for contacting Sharp Digital Ireland',
      html: generateConfirmationEmail(formData),
      text: `
Thank you for contacting Sharp Digital Ireland, ${formData.name}!

We've received your project inquiry and will get back to you within 24 hours.

What happens next?
- Our team will review your project requirements
- We'll prepare a detailed proposal tailored to your needs
- You'll receive a response within 24 hours
- We'll schedule a consultation call to discuss your project

Contact Information:
Email: dilshad@sharpdigital.in
Website: https://sharpdigital.ie

We're excited to help bring your digital vision to life!

Sharp Digital Ireland - Crafting Digital Experiences
      `.trim()
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(notificationEmailOptions),
      transporter.sendMail(confirmationEmailOptions)
    ]);

    const processingTime = Date.now() - startTime;
    logInfo('Contact form submitted successfully', {
      email: formData.email,
      processingTime: `${processingTime}ms`
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    logError('Contact form error', error, request);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while sending your message. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests - return CSRF token for form
export async function GET(request: NextRequest) {
  try {
    // Rate limiting for GET requests too
    const rateLimitResult = rateLimiter.isRateLimited(request);
    if (rateLimitResult.isLimited) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.'
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900'
          }
        }
      );
    }

    const csrfToken = csrfProtection.generateToken();
    
    return NextResponse.json({
      success: true,
      csrfToken,
      message: 'CSRF token generated'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    logError('CSRF token generation failed', error, request);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to generate security token'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'GET, POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'GET, POST' } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'GET, POST' } }
  );
}
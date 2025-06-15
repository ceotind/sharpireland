import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Interface for form data
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  description: string;
}

// Validation function
function validateFormData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
    errors.push('Project description is required and must be at least 10 characters long');
  }

  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please provide a valid phone number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
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
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate form data
    const validation = validateFormData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    const formData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      description: body.description.trim()
    };

    // Create transporter
    const transporter = createTransporter();

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP connection failed:', error);
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

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while sending your message. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
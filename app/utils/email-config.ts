// Email configuration utility
import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export function createEmailTransporter(): nodemailer.Transporter {
  const config: EmailConfig = {
    host: process.env.EMAIL_SERVER_HOST || '',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
    secure: process.env.EMAIL_SERVER_PORT === '465',
    auth: {
      user: process.env.EMAIL_SERVER_USER || '',
      pass: process.env.EMAIL_SERVER_PASSWORD || '',
    },
    from: process.env.EMAIL_FROM || '',
  };

  // Validate required environment variables
  const requiredEnvVars = [
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_FROM'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required email configuration: ${missingVars.join(', ')}`);
  }

  return nodemailer.createTransport(config);
}

export function validateEmailConfig(): boolean {
  try {
    createEmailTransporter();
    return true;
  } catch (error) {
    console.error('Email configuration validation failed:', error);
    return false;
  }
}

export const emailTemplates = {
  bookingConfirmation: {
    subject: 'Booking Confirmed - Sharp Digital Ireland',
    from: process.env.EMAIL_FROM || 'noreply@sharpireland.com',
  },
  adminNotification: {
    subject: 'New Booking Notification - Sharp Digital Ireland',
    from: process.env.EMAIL_FROM || 'noreply@sharpireland.com',
  },
};
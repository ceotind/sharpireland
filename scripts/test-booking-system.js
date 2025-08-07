#!/usr/bin/env node

/**
 * Booking System Test Script
 * 
 * This script tests the booking system functionality including:
 * - Email configuration
 * - Booking confirmation emails
 * - Admin notification emails
 * - Cal.com webhook simulation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Check if required environment variables are set
function checkEnvironment() {
  logInfo('Checking environment variables...');
  
  const requiredVars = [
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_FROM'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logError('Missing required environment variables:');
    missingVars.forEach(varName => logError(`  - ${varName}`));
    return false;
  }
  
  logSuccess('All required environment variables are set');
  return true;
}

// Test email configuration
async function testEmailConfig() {
  logInfo('Testing email configuration...');
  
  try {
    const { createEmailTransporter } = await import('../app/utils/email-config.js');
    const transporter = createEmailTransporter();
    
    await transporter.verify();
    logSuccess('Email server connection verified');
    return true;
  } catch (error) {
    logError(`Email configuration test failed: ${error.message}`);
    return false;
  }
}

// Test booking emails
async function testBookingEmails() {
  logInfo('Testing booking emails...');
  
  try {
    const { sendBookingConfirmation, sendAdminNotification } = await import('../app/utils/booking-email.js');
    
    const testData = {
      id: 'test-booking-123',
      userName: 'Test User',
      userEmail: process.env.TEST_EMAIL || 'test@example.com',
      adminName: 'Sharp Digital Admin',
      adminEmail: process.env.ADMIN_EMAIL || 'admin@sharpireland.com',
      date: 'Monday, January 15, 2025',
      time: '2:00 PM',
      duration: '30 minutes',
      purpose: 'Website Development Consultation',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructions: 'Please bring your current website URL and any specific requirements.',
      eventType: 'created',
      startTime: '2025-01-15T14:00:00Z',
      endTime: '2025-01-15T14:30:00Z',
      additionalInfo: 'Initial consultation for new website project',
      email: process.env.TEST_EMAIL || 'test@example.com'
    };
    
    // Test booking confirmation
    await sendBookingConfirmation(testData);
    logSuccess('Booking confirmation email sent');
    
    // Test admin notification
    await sendAdminNotification(testData);
    logSuccess('Admin notification email sent');
    
    return true;
  } catch (error) {
    logError(`Booking email test failed: ${error.message}`);
    return false;
  }
}

// Test webhook endpoint
async function testWebhookEndpoint() {
  logInfo('Testing webhook endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/booking/webhook', {
      method: 'GET'
    });
    
    if (response.ok) {
      const data = await response.json();
      logSuccess('Webhook endpoint is accessible');
      logInfo(`Supported events: ${data.supportedEvents.join(', ')}`);
      return true;
    } else {
      logError(`Webhook endpoint test failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Webhook endpoint test failed: ${error.message}`);
    return false;
  }
}

// Simulate Cal.com webhook
async function simulateCalWebhook() {
  logInfo('Simulating Cal.com webhook...');
  
  const webhookPayload = {
    triggerEvent: 'BOOKING_CREATED',
    createdAt: new Date().toISOString(),
    payload: {
      uid: 'simulated-booking-456',
      title: 'Test Booking via Webhook',
      description: 'This is a test booking from webhook simulation',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      attendees: [{
        email: process.env.TEST_EMAIL || 'test@example.com',
        name: 'Webhook Test User',
        timeZone: 'Europe/Dublin'
      }],
      organizer: {
        email: process.env.ADMIN_EMAIL || 'admin@sharpireland.com',
        name: 'Sharp Digital Admin',
        timeZone: 'Europe/Dublin'
      },
      location: 'https://meet.google.com/webhook-test'
    }
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/booking/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cal-Signature-256': 'test-signature'
      },
      body: JSON.stringify(webhookPayload)
    });
    
    if (response.ok) {
      const result = await response.json();
      logSuccess('Webhook simulation successful');
      logInfo(`Response: ${JSON.stringify(result, null, 2)}`);
      return true;
    } else {
      const error = await response.text();
      logError(`Webhook simulation failed: ${response.status} ${error}`);
      return false;
    }
  } catch (error) {
    logError(`Webhook simulation failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log(`${colors.bright}${colors.cyan}🔧 Sharp Ireland Booking System Test Suite${colors.reset}`);
  log(`${colors.dim}Testing booking system functionality...${colors.reset}\n`);
  
  const results = {
    environment: false,
    emailConfig: false,
    bookingEmails: false,
    webhookEndpoint: false,
    webhookSimulation: false
  };
  
  // Check environment
  results.environment = checkEnvironment();
  
  if (!results.environment) {
    logError('Environment check failed. Please set required environment variables.');
    process.exit(1);
  }
  
  // Test email configuration
  results.emailConfig = await testEmailConfig();
  
  if (results.emailConfig) {
    // Test booking emails
    results.bookingEmails = await testBookingEmails();
    
    // Test webhook endpoint
    results.webhookEndpoint = await testWebhookEndpoint();
    
    // Test webhook simulation
    results.webhookSimulation = await simulateCalWebhook();
  }
  
  // Display results
  log(`\n${colors.bright}📊 Test Results:${colors.reset}`);
  log(`Environment: ${results.environment ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}`);
  log(`Email Config: ${results.emailConfig ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}`);
  log(`Booking Emails: ${results.bookingEmails ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}`);
  log(`Webhook Endpoint: ${results.webhookEndpoint ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}`);
  log(`Webhook Simulation: ${results.webhookSimulation ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    log(`\n${colors.bright}${colors.green}🎉 All tests passed! Your booking system is ready.${colors.reset}`);
  } else {
    log(`\n${colors.bright}${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}`);
  }
  
  return allPassed;
}

// CLI interface
if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  
  runTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      logError(`Test runner error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runTests };
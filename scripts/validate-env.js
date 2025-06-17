#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Validates that all required environment variables are set for Sharp Ireland
 */

const fs = require('fs');
const path = require('path');

// Required environment variables for the application to function
const REQUIRED_VARS = [
  'SMTP_HOST',
  'SMTP_PORT', 
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'FROM_NAME',
  'TO_EMAIL',
  'NEXT_PUBLIC_SITE_URL',
  'NODE_ENV',
  'CSRF_SECRET',
  'RATE_LIMIT_MAX',
  'RATE_LIMIT_WINDOW'
];

// Optional but recommended variables
const OPTIONAL_VARS = [
  'NEXT_PUBLIC_GA_ID',
  'NEXT_PUBLIC_GTM_ID',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'REPLY_TO_EMAIL',
  'NEXT_PUBLIC_SITE_NAME',
  'NEXT_PUBLIC_SITE_DESCRIPTION',
  'NEXT_PUBLIC_SITE_KEYWORDS',
  'NEXT_PUBLIC_SITE_AUTHOR'
];

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.log('💡 Copy .env.example to .env.local and configure your values');
    process.exit(1);
  }

  // Simple .env parser
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  return envVars;
}

function validateEnvironment() {
  console.log('🔍 Validating Sharp Ireland environment configuration...\n');

  const envVars = loadEnvFile();
  const missing = [];
  const empty = [];
  const warnings = [];

  // Check required variables
  console.log('📋 Required Variables:');
  REQUIRED_VARS.forEach(varName => {
    if (!(varName in envVars)) {
      missing.push(varName);
      console.log(`  ❌ ${varName} - MISSING`);
    } else if (!envVars[varName] || envVars[varName].trim() === '') {
      empty.push(varName);
      console.log(`  ⚠️  ${varName} - EMPTY`);
    } else {
      console.log(`  ✅ ${varName} - SET`);
    }
  });

  // Check optional variables
  console.log('\n📋 Optional Variables:');
  OPTIONAL_VARS.forEach(varName => {
    if (!(varName in envVars) || !envVars[varName] || envVars[varName].trim() === '') {
      console.log(`  ⚪ ${varName} - NOT SET`);
    } else {
      console.log(`  ✅ ${varName} - SET`);
    }
  });

  // Specific validations
  console.log('\n🔧 Configuration Validation:');

  // Validate NODE_ENV
  if (envVars.NODE_ENV) {
    if (!['development', 'production'].includes(envVars.NODE_ENV)) {
      warnings.push('NODE_ENV should be either "development" or "production"');
      console.log('  ⚠️  NODE_ENV - Invalid value (should be development or production)');
    } else {
      console.log(`  ✅ NODE_ENV - ${envVars.NODE_ENV}`);
    }
  }

  // Validate SMTP_PORT
  if (envVars.SMTP_PORT) {
    const port = parseInt(envVars.SMTP_PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      warnings.push('SMTP_PORT should be a valid port number (1-65535)');
      console.log('  ⚠️  SMTP_PORT - Invalid port number');
    } else {
      console.log(`  ✅ SMTP_PORT - ${port}`);
    }
  }

  // Validate URL format
  if (envVars.NEXT_PUBLIC_SITE_URL) {
    try {
      new URL(envVars.NEXT_PUBLIC_SITE_URL);
      console.log(`  ✅ NEXT_PUBLIC_SITE_URL - Valid URL`);
    } catch {
      warnings.push('NEXT_PUBLIC_SITE_URL should be a valid URL');
      console.log('  ⚠️  NEXT_PUBLIC_SITE_URL - Invalid URL format');
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ['FROM_EMAIL', 'TO_EMAIL', 'REPLY_TO_EMAIL'].forEach(emailVar => {
    if (envVars[emailVar] && !emailRegex.test(envVars[emailVar])) {
      warnings.push(`${emailVar} should be a valid email address`);
      console.log(`  ⚠️  ${emailVar} - Invalid email format`);
    } else if (envVars[emailVar]) {
      console.log(`  ✅ ${emailVar} - Valid email`);
    }
  });

  // Summary
  console.log('\n📊 Validation Summary:');
  
  if (missing.length > 0) {
    console.log(`❌ ${missing.length} required variables are missing:`);
    missing.forEach(varName => console.log(`   - ${varName}`));
  }

  if (empty.length > 0) {
    console.log(`⚠️  ${empty.length} required variables are empty:`);
    empty.forEach(varName => console.log(`   - ${varName}`));
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} configuration warnings:`);
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  const hasErrors = missing.length > 0 || empty.length > 0;
  
  if (hasErrors) {
    console.log('\n❌ Environment validation FAILED');
    console.log('💡 Please fix the issues above before deploying');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('\n⚠️  Environment validation completed with warnings');
    console.log('💡 Consider addressing the warnings above');
    process.exit(0);
  } else {
    console.log('\n✅ Environment validation PASSED');
    console.log('🚀 Ready for deployment!');
    process.exit(0);
  }
}

// Run validation
validateEnvironment();
#!/usr/bin/env node

/**
 * Business Planner Setup Script
 * 
 * This script performs the following setup tasks:
 * 1. Check environment variables
 * 2. Verify database connection
 * 3. Run migrations
 * 4. Create admin user if needed
 * 5. Test OpenAI connection
 * 6. Display setup status
 */

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Logging functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  step: (msg) => console.log(`${colors.magenta}→${colors.reset} ${msg}`)
};

// Configuration
const config = {
  requiredEnvVars: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'NEXTAUTH_SECRET',
    'CSRF_SECRET'
  ],
  optionalEnvVars: [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'BUSINESS_PLANNER_ENABLED',
    'BUSINESS_PLANNER_FREE_SESSIONS',
    'OPENAI_MODEL'
  ],
  databaseTables: [
    'business_planner_sessions',
    'business_planner_messages',
    'business_planner_plans',
    'business_planner_usage',
    'business_planner_payments'
  ]
};

// Global variables
let supabase;
let openai;
let setupResults = {
  envVars: false,
  database: false,
  migrations: false,
  adminUser: false,
  openaiConnection: false,
  overall: false
};

/**
 * Load environment variables
 */
function loadEnvironment() {
  log.step('Loading environment variables...');
  
  // Try to load .env.local first, then .env
  const envFiles = ['.env.local', '.env'];
  let envLoaded = false;
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      require('dotenv').config({ path: envFile });
      log.info(`Loaded environment from ${envFile}`);
      envLoaded = true;
      break;
    }
  }
  
  if (!envLoaded) {
    log.warning('No .env file found. Using system environment variables.');
  }
}

/**
 * Check required environment variables
 */
function checkEnvironmentVariables() {
  log.header('1. Checking Environment Variables');
  
  const missing = [];
  const present = [];
  
  // Check required variables
  config.requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
      log.success(`${varName} is set`);
    } else {
      missing.push(varName);
      log.error(`${varName} is missing`);
    }
  });
  
  // Check optional variables
  config.optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      log.info(`${varName} is set (optional)`);
    } else {
      log.warning(`${varName} is not set (optional)`);
    }
  });
  
  if (missing.length > 0) {
    log.error(`Missing required environment variables: ${missing.join(', ')}`);
    log.error('Please check your .env.local file and ensure all required variables are set.');
    return false;
  }
  
  log.success(`All ${present.length} required environment variables are set`);
  setupResults.envVars = true;
  return true;
}

/**
 * Verify database connection
 */
async function verifyDatabaseConnection() {
  log.header('2. Verifying Database Connection');
  
  try {
    log.step('Initializing Supabase client...');
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    log.step('Testing database connection...');
    const { data, error } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    log.success('Database connection successful');
    setupResults.database = true;
    return true;
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    log.error('Please check your Supabase configuration and ensure the database is accessible.');
    return false;
  }
}

/**
 * Check if required tables exist
 */
async function checkDatabaseTables() {
  log.header('3. Checking Database Tables');
  
  try {
    const missingTables = [];
    const existingTables = [];
    
    for (const tableName of config.databaseTables) {
      log.step(`Checking table: ${tableName}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          missingTables.push(tableName);
          log.warning(`Table ${tableName} does not exist`);
        } else {
          throw error;
        }
      } else {
        existingTables.push(tableName);
        log.success(`Table ${tableName} exists`);
      }
    }
    
    if (missingTables.length > 0) {
      log.warning(`Missing tables: ${missingTables.join(', ')}`);
      log.warning('Please run database migrations to create missing tables.');
      log.info('You can run migrations using: supabase db push');
      return false;
    }
    
    log.success(`All ${existingTables.length} required tables exist`);
    setupResults.migrations = true;
    return true;
  } catch (error) {
    log.error(`Table check failed: ${error.message}`);
    return false;
  }
}

/**
 * Create admin user if needed
 */
async function createAdminUser() {
  log.header('4. Checking Admin User');
  
  try {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      log.warning('No admin email configured. Skipping admin user creation.');
      log.info('Set SUPER_ADMIN_EMAIL or ADMIN_EMAIL environment variable to create an admin user.');
      setupResults.adminUser = true; // Not required, so mark as success
      return true;
    }
    
    log.step(`Checking for admin user: ${adminEmail}`);
    
    // Check if admin user exists
    const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw userError;
    }
    
    const adminUser = existingUser.users.find(user => user.email === adminEmail);
    
    if (adminUser) {
      log.success(`Admin user ${adminEmail} already exists`);
      
      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', adminUser.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      if (!profile || profile.role !== 'admin') {
        log.step('Updating user role to admin...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: adminUser.id,
            email: adminEmail,
            role: 'admin',
            updated_at: new Date().toISOString()
          });
        
        if (updateError) {
          throw updateError;
        }
        
        log.success('Admin role assigned successfully');
      } else {
        log.success('User already has admin role');
      }
    } else {
      log.warning(`Admin user ${adminEmail} does not exist`);
      log.info('Please create the admin user manually through Supabase Auth or your application.');
      log.info('The setup will continue without creating an admin user.');
    }
    
    setupResults.adminUser = true;
    return true;
  } catch (error) {
    log.error(`Admin user setup failed: ${error.message}`);
    log.warning('Continuing setup without admin user...');
    setupResults.adminUser = true; // Not critical for basic functionality
    return true;
  }
}

/**
 * Test OpenAI connection
 */
async function testOpenAIConnection() {
  log.header('5. Testing OpenAI Connection');
  
  try {
    log.step('Initializing OpenAI client...');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    log.step('Testing API connection...');
    const response = await openai.models.list();
    
    if (!response || !response.data) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    log.success(`OpenAI API connection successful (${response.data.length} models available)`);
    
    // Test the specific model we'll use
    const modelToUse = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    const availableModel = response.data.find(model => model.id === modelToUse);
    
    if (availableModel) {
      log.success(`Model ${modelToUse} is available`);
    } else {
      log.warning(`Model ${modelToUse} is not available. Available models:`);
      response.data.slice(0, 5).forEach(model => {
        log.info(`  - ${model.id}`);
      });
    }
    
    // Test a simple completion
    log.step('Testing chat completion...');
    const testCompletion = await openai.chat.completions.create({
      model: availableModel ? modelToUse : 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello, this is a test message.' }
      ],
      max_tokens: 10
    });
    
    if (testCompletion && testCompletion.choices && testCompletion.choices.length > 0) {
      log.success('Chat completion test successful');
      log.info(`Response: ${testCompletion.choices[0].message.content.trim()}`);
    }
    
    setupResults.openaiConnection = true;
    return true;
  } catch (error) {
    log.error(`OpenAI connection failed: ${error.message}`);
    
    if (error.code === 'invalid_api_key') {
      log.error('Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.');
    } else if (error.code === 'insufficient_quota') {
      log.error('OpenAI API quota exceeded. Please check your billing and usage limits.');
    } else if (error.code === 'rate_limit_exceeded') {
      log.error('OpenAI API rate limit exceeded. Please try again later.');
    }
    
    return false;
  }
}

/**
 * Display setup summary
 */
function displaySetupSummary() {
  log.header('Setup Summary');
  
  const results = [
    { name: 'Environment Variables', status: setupResults.envVars },
    { name: 'Database Connection', status: setupResults.database },
    { name: 'Database Tables', status: setupResults.migrations },
    { name: 'Admin User', status: setupResults.adminUser },
    { name: 'OpenAI Connection', status: setupResults.openaiConnection }
  ];
  
  results.forEach(result => {
    if (result.status) {
      log.success(result.name);
    } else {
      log.error(result.name);
    }
  });
  
  const successCount = results.filter(r => r.status).length;
  const totalCount = results.length;
  
  setupResults.overall = successCount === totalCount;
  
  console.log('\n' + '='.repeat(50));
  
  if (setupResults.overall) {
    log.success(`Setup completed successfully! (${successCount}/${totalCount})`);
    log.info('Your Business Planner feature is ready to use.');
    log.info('You can now start the application with: npm run dev');
  } else {
    log.warning(`Setup completed with issues (${successCount}/${totalCount})`);
    log.warning('Please resolve the issues above before using the Business Planner feature.');
  }
  
  console.log('='.repeat(50) + '\n');
}

/**
 * Display usage information
 */
function displayUsageInfo() {
  log.header('Usage Information');
  
  log.info('Business Planner Configuration:');
  log.info(`  - Free Sessions: ${process.env.BUSINESS_PLANNER_FREE_SESSIONS || '3'}`);
  log.info(`  - OpenAI Model: ${process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'}`);
  log.info(`  - Max Tokens: ${process.env.OPENAI_MAX_TOKENS || '4000'}`);
  log.info(`  - Feature Enabled: ${process.env.BUSINESS_PLANNER_ENABLED || 'true'}`);
  
  if (process.env.STRIPE_SECRET_KEY) {
    log.info('  - Payment Integration: Enabled (Stripe)');
  } else {
    log.warning('  - Payment Integration: Disabled (No Stripe configuration)');
  }
  
  log.info('\nNext Steps:');
  log.info('1. Start your development server: npm run dev');
  log.info('2. Visit: http://localhost:3000/dashboard/business-planner');
  log.info('3. Test the onboarding flow');
  log.info('4. Monitor usage in the admin panel');
  
  if (!setupResults.overall) {
    log.warning('\nTroubleshooting:');
    log.info('- Check the DEPLOYMENT.md file for detailed setup instructions');
    log.info('- Verify all environment variables in .env.local');
    log.info('- Run database migrations: supabase db push');
    log.info('- Check OpenAI API key and billing status');
  }
}

/**
 * Main setup function
 */
async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                Business Planner Setup Script                ║');
  console.log('║                                                              ║');
  console.log('║  This script will verify your configuration and setup       ║');
  console.log('║  the Business Planner feature for your application.         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);
  
  // Load environment
  loadEnvironment();
  
  // Run setup steps
  const steps = [
    checkEnvironmentVariables,
    verifyDatabaseConnection,
    checkDatabaseTables,
    createAdminUser,
    testOpenAIConnection
  ];
  
  for (const step of steps) {
    try {
      const success = await step();
      if (!success && step === checkEnvironmentVariables) {
        // Critical failure - stop setup
        log.error('Critical setup failure. Cannot continue without required environment variables.');
        process.exit(1);
      }
    } catch (error) {
      log.error(`Setup step failed: ${error.message}`);
      if (step === checkEnvironmentVariables) {
        process.exit(1);
      }
    }
  }
  
  // Display results
  displaySetupSummary();
  displayUsageInfo();
  
  // Exit with appropriate code
  process.exit(setupResults.overall ? 0 : 1);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled rejection at ${promise}: ${reason}`);
  process.exit(1);
});

// Run the setup
if (require.main === module) {
  main().catch(error => {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  main,
  checkEnvironmentVariables,
  verifyDatabaseConnection,
  checkDatabaseTables,
  createAdminUser,
  testOpenAIConnection
};
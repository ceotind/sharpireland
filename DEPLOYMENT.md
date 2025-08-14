# Business Planner Feature - Deployment Guide

This guide provides comprehensive instructions for deploying the Business Planner feature to production.

## Prerequisites and Requirements

### System Requirements
- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher (via Supabase)
- Vercel CLI (for deployment)

### Required Services
- **Supabase**: Database and authentication
- **OpenAI**: GPT-4 API access for business plan generation
- **Vercel**: Hosting platform (recommended)
- **Payment Gateway**: Stripe or similar (for premium features)

### Development Tools
- Git
- VS Code or similar IDE
- Postman or similar API testing tool

## Environment Variables Setup

### Required Environment Variables

Copy the `.env.example` file to `.env.local` and configure the following variables:

```bash
# Copy environment template
cp .env.example .env.local
```

### Core Configuration
```bash
# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4000

# Business Planner Configuration
BUSINESS_PLANNER_ENABLED=true
BUSINESS_PLANNER_FREE_SESSIONS=3
BUSINESS_PLANNER_PREMIUM_SESSIONS=unlimited
BUSINESS_PLANNER_SESSION_TIMEOUT=3600000

# Payment Configuration
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Security Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
CSRF_SECRET=your-csrf-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Migration Instructions

### 1. Supabase Setup

1. **Create Supabase Project**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref your-project-ref
   ```

2. **Run Database Migrations**:
   ```bash
   # Apply migrations
   supabase db push
   
   # Verify migrations
   supabase db diff
   ```

### 2. Required Database Tables

The following tables should be created via Supabase migrations:

- `business_planner_sessions` - User chat sessions
- `business_planner_messages` - Chat messages
- `business_planner_plans` - Generated business plans
- `business_planner_usage` - Usage tracking
- `business_planner_payments` - Payment records

### 3. Row Level Security (RLS)

Ensure RLS policies are enabled:

```sql
-- Enable RLS on all business planner tables
ALTER TABLE business_planner_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_planner_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_planner_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_planner_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_planner_payments ENABLE ROW LEVEL SECURITY;
```

## OpenAI API Key Configuration

### 1. Obtain API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Set usage limits and billing

### 2. Configure API Settings
```bash
# Set in environment variables
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.7
```

### 3. Test API Connection
```bash
# Run setup script to test connection
npm run setup:business-planner
```

## Deployment Steps for Vercel/Production

### 1. Pre-deployment Checklist
```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build test
npm run build

# Validate environment
npm run validate-env

# Run setup script
node scripts/setup-business-planner.js
```

### 2. Vercel Deployment

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all other environment variables
```

#### Option B: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments
4. Push to main branch to trigger deployment

### 3. Domain Configuration
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS records
# A record: @ -> 76.76.19.61
# CNAME record: www -> cname.vercel-dns.com
```

## Testing Checklist

### 1. Pre-deployment Testing
- [ ] Environment variables are set correctly
- [ ] Database connection is working
- [ ] OpenAI API is responding
- [ ] Authentication flow works
- [ ] Payment integration is functional
- [ ] Rate limiting is active
- [ ] CSRF protection is enabled

### 2. Post-deployment Testing
- [ ] Application loads without errors
- [ ] Business planner onboarding works
- [ ] Chat functionality is operational
- [ ] Plan generation is working
- [ ] Export functionality works
- [ ] Payment flow is complete
- [ ] Admin panel is accessible
- [ ] Usage tracking is accurate

### 3. Load Testing
```bash
# Install load testing tool
npm install -g artillery

# Run load tests
artillery run load-test-config.yml
```

### 4. Security Testing
- [ ] API endpoints are protected
- [ ] Rate limiting is effective
- [ ] Input validation is working
- [ ] SQL injection protection
- [ ] XSS protection is active
- [ ] CSRF tokens are validated

## Monitoring Setup

### 1. Application Monitoring
```bash
# Add monitoring environment variables
MONITORING_ENABLED=true
LOG_LEVEL=info
ERROR_REPORTING_ENABLED=true
```

### 2. Performance Monitoring
- Set up Vercel Analytics
- Configure Core Web Vitals tracking
- Monitor API response times
- Track database query performance

### 3. Error Tracking
```javascript
// Add to your error boundary
if (process.env.NODE_ENV === 'production') {
  // Initialize error tracking service
  // e.g., Sentry, LogRocket, etc.
}
```

### 4. Health Checks
```bash
# Health check endpoint
curl -f https://your-domain.com/api/health

# Business planner specific health check
curl -f https://your-domain.com/api/business-planner/health
```

## Troubleshooting Guide

### Common Issues

#### 1. OpenAI API Errors
**Problem**: API key not working or rate limits exceeded
**Solution**:
```bash
# Check API key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Check usage limits
# Visit OpenAI dashboard to monitor usage
```

#### 2. Database Connection Issues
**Problem**: Cannot connect to Supabase
**Solution**:
```bash
# Test database connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('business_planner_sessions').select('count').then(console.log);
"
```

#### 3. Environment Variable Issues
**Problem**: Environment variables not loading
**Solution**:
```bash
# Check environment variables
npm run validate-env

# Verify Vercel environment variables
vercel env ls
```

#### 4. Payment Integration Issues
**Problem**: Stripe webhooks not working
**Solution**:
```bash
# Test webhook endpoint
stripe listen --forward-to localhost:3000/api/business-planner/payment/webhook

# Verify webhook secret
echo $STRIPE_WEBHOOK_SECRET
```

#### 5. Performance Issues
**Problem**: Slow response times
**Solution**:
- Check OpenAI API response times
- Monitor database query performance
- Review rate limiting settings
- Optimize API endpoints

### Debug Mode
```bash
# Enable debug logging
DEBUG=business-planner:* npm run dev

# Check application logs
vercel logs --follow
```

### Support Contacts
- **Technical Issues**: Create GitHub issue
- **OpenAI API**: OpenAI Support
- **Supabase**: Supabase Support
- **Vercel**: Vercel Support

## Security Best Practices

### 1. API Security
- Always validate input data
- Use rate limiting on all endpoints
- Implement proper authentication
- Sanitize user inputs
- Use HTTPS only

### 2. Environment Security
- Never commit `.env` files
- Use strong secrets
- Rotate API keys regularly
- Monitor API usage

### 3. Database Security
- Enable Row Level Security
- Use service role key only on server
- Implement proper access controls
- Regular security audits

## Maintenance

### Regular Tasks
- Monitor API usage and costs
- Update dependencies monthly
- Review security logs weekly
- Backup database regularly
- Test disaster recovery procedures

### Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Deploy updates
vercel --prod
```

---

For additional support or questions, please refer to the project documentation or create an issue in the repository.
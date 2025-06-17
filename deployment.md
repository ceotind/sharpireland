# Sharp Ireland - Production Deployment Guide

## Pre-Deployment Checklist

### Environment Setup
- [ ] Configure production environment variables in `.env.local`
- [ ] Set up SMTP credentials for contact form
- [ ] Configure analytics IDs (Google Analytics, GTM)
- [ ] Set up error monitoring service (optional)
- [ ] Configure CSRF secret key
- [ ] Set rate limiting parameters

### Security Verification
- [ ] Verify all security headers are configured
- [ ] Test CSRF protection
- [ ] Validate rate limiting functionality
- [ ] Check input sanitization
- [ ] Verify error handling doesn't expose sensitive data

### Performance Testing
- [ ] Run bundle analyzer: `npm run build:analyze`
- [ ] Test Core Web Vitals
- [ ] Verify image optimization
- [ ] Check font loading performance
- [ ] Test mobile responsiveness

### Code Quality
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Fix any security vulnerabilities: `npm run audit:security`
- [ ] Test production build: `npm run test:build`

## Environment Variables Setup

### Step-by-Step Configuration

1. **Copy Environment Template**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure SMTP Settings (REQUIRED)**
   - Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - For Gmail: Use App Password (not regular password)
   - Generate Gmail App Password: https://myaccount.google.com/apppasswords
   - For other providers: Update host/port accordingly

3. **Set Email Configuration (REQUIRED)**
   - `FROM_EMAIL`: Should match your domain
   - `FROM_NAME`: Display name for outgoing emails
   - `TO_EMAIL`: Where contact form submissions are sent
   - `REPLY_TO_EMAIL`: Reply-to address (optional)

4. **Configure Security Settings (REQUIRED)**
   - Generate CSRF secret: `openssl rand -base64 32`
   - Set rate limiting parameters based on expected traffic

5. **Set Environment Variables (REQUIRED)**
   - `NODE_ENV=production` for live deployment
   - `NEXT_PUBLIC_SITE_URL`: Your live website URL

### Required Variables
```bash
# SMTP Configuration (Contact Form)
SMTP_HOST=smtp.hostinger.com              # Your SMTP server
SMTP_PORT=465                             # SMTP port (465 for SSL)
SMTP_SECURE=true                          # Use SSL/TLS
SMTP_USER=your-email@yourdomain.com       # SMTP username
SMTP_PASS=your-smtp-password              # SMTP password/app password

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com         # Sender email address
FROM_NAME=Your Company Name               # Sender display name
TO_EMAIL=contact@yourdomain.com           # Recipient for contact forms
REPLY_TO_EMAIL=reply@yourdomain.com       # Reply-to address (optional)

# Application Settings
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description for SEO
NEXT_PUBLIC_SITE_KEYWORDS=keyword1, keyword2, keyword3
NEXT_PUBLIC_SITE_AUTHOR=Author Name

# Security Configuration
CSRF_SECRET=your-secure-random-string-here    # Generate with: openssl rand -base64 32
RATE_LIMIT_MAX=5                              # Max requests per window
RATE_LIMIT_WINDOW=900000                      # Time window (15 minutes)

# Environment
NODE_ENV=production                           # Set to 'production' for live deployment
```

### Optional Variables
```bash
# Analytics Tracking
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX               # Google Analytics 4 ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX               # Google Tag Manager ID

# Error Monitoring
SENTRY_DSN=https://your-dsn@sentry.io/project # Server-side error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project # Client-side error tracking
```

### Environment Variable Validation

Before deployment, use our comprehensive validation script:

```bash
# Validate all environment variables
npm run validate-env

# This script checks:
# - All required variables are present and not empty
# - Email addresses have valid format
# - URLs are properly formatted
# - Port numbers are valid ranges
# - NODE_ENV is set correctly
# - Provides detailed feedback on any issues
```

**Manual validation (alternative):**
```bash
# Check if all required variables are present
node -e "
const required = [
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
  'FROM_EMAIL', 'FROM_NAME', 'TO_EMAIL',
  'NEXT_PUBLIC_SITE_URL', 'NODE_ENV', 'CSRF_SECRET'
];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing required environment variables:', missing);
  process.exit(1);
} else {
  console.log('All required environment variables are set ✓');
}
"
```

### Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` for security
2. **Use strong passwords** - Especially for SMTP and CSRF secrets
3. **Rotate secrets regularly** - Update passwords and secrets periodically
4. **Use App Passwords** - For Gmail, use App Passwords instead of account passwords
5. **Validate environment** - Always test configuration before going live

### Common SMTP Providers

#### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate at: https://myaccount.google.com/apppasswords
```

#### Hostinger
```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
```

#### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## Deployment Steps

### 1. Environment Validation
```bash
# Validate all environment variables are properly configured
npm run validate-env

# This will check:
# - All required variables are present and not empty
# - Email addresses are valid format
# - URLs are properly formatted
# - Port numbers are valid
# - NODE_ENV is set correctly
```

### 2. Pre-Deployment Check
```bash
# Run complete pre-deployment validation
npm run pre-deploy

# This combines:
# - Environment validation (npm run validate-env)
# - Type checking (npm run type-check)
# - Linting (npm run lint)
# - Production build test (npm run build)
```

### 3. Build Verification (Alternative)
```bash
# Clean previous builds
npm run clean

# Install dependencies
npm ci

# Run individual checks
npm run type-check
npm run lint
npm run validate-env

# Build for production
npm run build
```

### 2. Security Configuration
- Ensure all environment variables are set
- Verify security headers in `next.config.ts`
- Test rate limiting endpoints
- Validate CSRF protection

### 3. Performance Optimization
- Verify bundle size with analyzer
- Check image optimization settings
- Confirm font preloading
- Test Core Web Vitals

### 4. Monitoring Setup
- Configure error logging
- Set up analytics tracking
- Test health check endpoint: `/api/health`
- Verify error boundaries

## Post-Deployment Verification

### Functional Testing
- [ ] Contact form submission works
- [ ] Email delivery functions correctly
- [ ] Theme switching operates properly
- [ ] All animations load correctly
- [ ] Mobile responsiveness verified

### Security Testing
- [ ] Rate limiting prevents abuse
- [ ] CSRF protection blocks invalid requests
- [ ] Input validation sanitizes data
- [ ] Error pages don't expose sensitive info

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals in green
- [ ] Images load optimally
- [ ] Fonts render without flash

### Monitoring Verification
- [ ] Analytics tracking works
- [ ] Error logging functions
- [ ] Health check endpoint responds
- [ ] Performance metrics collected

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Review analytics monthly
- Update dependencies quarterly
- Security audit semi-annually

### Performance Monitoring
- Track Core Web Vitals
- Monitor bundle size growth
- Check error rates
- Review user feedback

### Security Updates
- Keep dependencies updated
- Monitor security advisories
- Review access logs
- Update rate limiting as needed

## Troubleshooting

### Common Issues

#### Contact Form Not Working
1. Check SMTP credentials
2. Verify environment variables
3. Check rate limiting settings
4. Review error logs

#### Performance Issues
1. Run bundle analyzer
2. Check image optimization
3. Review Core Web Vitals
4. Optimize critical resources

#### Security Concerns
1. Verify security headers
2. Check CSRF implementation
3. Review input validation
4. Monitor error logs

### Health Check Endpoint
Monitor application health at `/api/health`:
- Returns 200 for healthy status
- Shows memory usage and uptime
- Validates environment configuration
- Provides system information

### Error Monitoring
- Client errors logged to `/api/log-error`
- Server errors logged to console
- Production errors can be sent to external services
- Error boundaries catch React component errors

## Scaling Considerations

### Traffic Growth
- Monitor rate limiting effectiveness
- Consider CDN for static assets
- Implement caching strategies
- Scale server resources as needed

### Feature Additions
- Follow established patterns
- Maintain security standards
- Update documentation
- Test thoroughly before deployment

This deployment guide ensures Sharp Ireland is production-ready with proper security, performance, and monitoring in place.
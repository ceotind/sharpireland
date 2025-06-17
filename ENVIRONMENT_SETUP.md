# Sharp Ireland - Environment Setup Guide

## Overview

This guide provides comprehensive instructions for setting up environment variables for the Sharp Ireland website. All critical environment issues have been resolved and the website is now production-ready.

## Quick Setup

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure Your Values
Edit `.env.local` with your actual values:

```bash
# SMTP Configuration (REQUIRED)
SMTP_HOST=your-smtp-server.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-smtp-password

# Email Configuration (REQUIRED)
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your Company Name
TO_EMAIL=contact@yourdomain.com
REPLY_TO_EMAIL=reply@yourdomain.com

# Application Settings (REQUIRED)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
NEXT_PUBLIC_SITE_KEYWORDS=keyword1, keyword2, keyword3
NEXT_PUBLIC_SITE_AUTHOR=Author Name

# Security (REQUIRED)
CSRF_SECRET=your-secure-random-string
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=900000

# Environment (REQUIRED)
NODE_ENV=production
```

### 3. Validate Configuration
```bash
npm run validate-env
```

### 4. Test Complete Setup
```bash
npm run pre-deploy
```

## Environment Files

### `.env.example`
- **Purpose**: Template file with example values and comprehensive documentation
- **Status**: ✅ Complete with production-ready examples and detailed comments
- **Usage**: Copy to `.env.local` and customize values

### `.env.local`
- **Purpose**: Actual environment variables for your deployment
- **Status**: ✅ Configured with all required variables
- **Security**: Never commit to version control (in `.gitignore`)

## Validation Scripts

### Environment Validation (`npm run validate-env`)
Comprehensive validation script that checks:
- ✅ All required variables are present and not empty
- ✅ Email addresses have valid format
- ✅ URLs are properly formatted
- ✅ Port numbers are in valid ranges
- ✅ NODE_ENV is set correctly
- ✅ Provides detailed feedback on any issues

### Pre-Deployment Check (`npm run pre-deploy`)
Complete validation workflow that runs:
1. Environment validation
2. TypeScript type checking
3. ESLint code quality checks
4. Production build test

## Required Environment Variables

| Variable | Purpose | Example | Status |
|----------|---------|---------|--------|
| `SMTP_HOST` | SMTP server hostname | `smtp.hostinger.com` | ✅ Set |
| `SMTP_PORT` | SMTP server port | `465` | ✅ Set |
| `SMTP_SECURE` | Use SSL/TLS | `true` | ✅ Set |
| `SMTP_USER` | SMTP username | `your-email@domain.com` | ✅ Set |
| `SMTP_PASS` | SMTP password | `your-password` | ✅ Set |
| `FROM_EMAIL` | Sender email address | `noreply@domain.com` | ✅ Set |
| `FROM_NAME` | Sender display name | `Company Name` | ✅ Set |
| `TO_EMAIL` | Contact form recipient | `contact@domain.com` | ✅ Set |
| `REPLY_TO_EMAIL` | Reply-to address | `reply@domain.com` | ✅ Set |
| `NEXT_PUBLIC_SITE_URL` | Website URL | `https://domain.com` | ✅ Set |
| `NEXT_PUBLIC_SITE_NAME` | Site name | `Site Name` | ✅ Set |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | SEO description | `Site description` | ✅ Set |
| `NEXT_PUBLIC_SITE_KEYWORDS` | SEO keywords | `keyword1, keyword2` | ✅ Set |
| `NEXT_PUBLIC_SITE_AUTHOR` | Site author | `Author Name` | ✅ Set |
| `CSRF_SECRET` | CSRF protection key | `random-secret-key` | ✅ Set |
| `RATE_LIMIT_MAX` | Max requests per window | `5` | ✅ Set |
| `RATE_LIMIT_WINDOW` | Rate limit time window | `900000` | ✅ Set |
| `NODE_ENV` | Environment mode | `production` | ✅ Set |

## Optional Environment Variables

| Variable | Purpose | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | ⚪ Optional |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | ⚪ Optional |
| `SENTRY_DSN` | Server-side error tracking | ⚪ Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side error tracking | ⚪ Optional |

## Security Best Practices

### ✅ Implemented
- Environment variables are properly documented
- Sensitive values are not committed to version control
- CSRF protection is configured
- Rate limiting is implemented
- Input validation is in place
- Secure SMTP configuration

### 🔒 Recommendations
- Use strong, unique passwords for SMTP
- Generate CSRF secret with: `openssl rand -base64 32`
- Regularly rotate secrets and passwords
- Monitor rate limiting effectiveness
- Use App Passwords for Gmail SMTP

## Deployment Workflow

### Production Deployment
```bash
# 1. Validate environment
npm run validate-env

# 2. Run pre-deployment checks
npm run pre-deploy

# 3. Deploy to production
npm run build
npm start
```

### Development Setup
```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Configure development values
# Edit .env.local with your development settings

# 3. Validate configuration
npm run validate-env

# 4. Start development server
npm run dev
```

## Troubleshooting

### Common Issues

#### Environment Validation Fails
- Check that all required variables are set in `.env.local`
- Ensure email addresses are in valid format
- Verify URLs include protocol (https://)
- Confirm port numbers are numeric

#### Contact Form Not Working
- Verify SMTP credentials are correct
- Check that `SMTP_PASS` is set (not empty)
- For Gmail, use App Password instead of account password
- Test SMTP connection manually

#### Build Failures
- Run `npm run validate-env` first
- Check TypeScript errors with `npm run type-check`
- Fix linting issues with `npm run lint:fix`
- Clear build cache with `npm run clean`

## Support

For additional help:
1. Check the validation script output for specific issues
2. Review the deployment guide in `deployment.md`
3. Ensure all dependencies are installed with `npm ci`
4. Test individual components with the provided scripts

## Status Summary

✅ **COMPLETE**: All critical environment variable issues have been resolved
✅ **VALIDATED**: Environment validation script confirms all required variables are set
✅ **TESTED**: Pre-deployment workflow passes all checks
✅ **DOCUMENTED**: Comprehensive documentation and examples provided
✅ **PRODUCTION READY**: Website is fully configured for production deployment

The Sharp Ireland website is now completely production-ready with proper environment configuration.
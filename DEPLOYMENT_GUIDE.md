# Sharp Ireland - VPS Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Sharp Ireland on a VPS (Virtual Private Server) running Ubuntu or Debian. The automated deployment script handles the entire setup process, from system configuration to application startup.

## Prerequisites

### Server Requirements
- **Operating System**: Ubuntu 18.04+ or Debian 10+
- **RAM**: Minimum 1GB, recommended 2GB+
- **Storage**: Minimum 10GB free space
- **Network**: Public IP address with port 3000 accessible

### Local Requirements
- Git installed on your local machine
- SSH access to your VPS
- Basic command line knowledge

## Pre-Deployment Setup

### 1. Server Access
Ensure you can SSH into your VPS:
```bash
ssh username@your-server-ip
```

### 2. Update System (Optional)
While the deployment script handles this, you may want to update first:
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Create Application User (Recommended)
For security, create a dedicated user for the application:
```bash
sudo adduser sharpireland
sudo usermod -aG sudo sharpireland
su - sharpireland
```

## Deployment Process

### Step 1: Clone Repository
```bash
git clone https://github.com/sharpdigital/sharp-ireland.git
cd sharp-ireland
```

### Step 2: Environment Configuration
Copy and configure environment variables:
```bash
cp .env.example .env.local
nano .env.local  # Edit with your actual values
```

**Required Environment Variables:**
```env
# SMTP Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Sharp Digital Ireland
TO_EMAIL=hello@sharpdigital.in

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Sharp Digital Ireland
NEXT_PUBLIC_SITE_DESCRIPTION=Premier Web Development Agency in Ireland
NEXT_PUBLIC_SITE_KEYWORDS=web development Ireland, React development Dublin
NEXT_PUBLIC_SITE_AUTHOR=Sharp Digital Ireland

# Security
CSRF_SECRET=your-random-32-character-string
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Optional Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Step 3: Run Deployment Script
Execute the automated deployment:
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. ✅ Install Node.js 18+ and essential packages
2. ✅ Install PM2 process manager
3. ✅ Validate project structure
4. ✅ Install dependencies
5. ✅ Run pre-deployment checks
6. ✅ Build production bundle
7. ✅ Configure PM2 ecosystem
8. ✅ Start application in cluster mode
9. ✅ Perform health checks

## Post-Deployment

### Verify Deployment
Check if the application is running:
```bash
pm2 status
curl http://localhost:3000/api/health
```

### Access Application
- **Local**: http://localhost:3000
- **External**: http://YOUR_SERVER_IP:3000

### Configure Firewall
Allow port 3000 through the firewall:
```bash
sudo ufw allow 3000
sudo ufw enable
```

## Process Management with PM2

### Essential PM2 Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs sharp-ireland

# Restart application
pm2 restart sharp-ireland

# Stop application
pm2 stop sharp-ireland

# Delete application from PM2
pm2 delete sharp-ireland

# Monitor resources
pm2 monit
```

### PM2 Configuration
The deployment creates an `ecosystem.config.js` file with optimized settings:
- **Cluster mode**: Utilizes all CPU cores
- **Memory limit**: 1GB per instance
- **Log rotation**: Automatic log management
- **Auto-restart**: On crashes or memory limit

## Production Optimizations

### 1. Reverse Proxy Setup (Nginx)
For production, set up Nginx as a reverse proxy:

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/sharp-ireland
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/sharp-ireland /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Automatic Updates
Set up automatic PM2 startup:
```bash
pm2 startup
pm2 save
```

## Monitoring and Maintenance

### Log Management
Logs are stored in the `logs/` directory:
- `logs/out.log` - Application output
- `logs/err.log` - Error logs
- `logs/combined.log` - Combined logs

### Performance Monitoring
```bash
# CPU and memory usage
pm2 monit

# Application metrics
pm2 show sharp-ireland

# System resources
htop
df -h
```

### Updates and Maintenance
To update the application:
```bash
git pull origin main
npm ci --only=production
npm run build
pm2 restart sharp-ireland
```

## Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use
```bash
sudo lsof -i :3000
sudo kill -9 PID_NUMBER
```

#### 2. Permission Errors
```bash
sudo chown -R $USER:$USER /path/to/sharp-ireland
```

#### 3. Build Failures
Check Node.js version:
```bash
node -v  # Should be 18+
npm -v
```

#### 4. PM2 Issues
```bash
pm2 kill
pm2 start ecosystem.config.js
```

### Log Analysis
```bash
# View recent logs
pm2 logs sharp-ireland --lines 100

# Follow logs in real-time
pm2 logs sharp-ireland -f

# Check system logs
sudo journalctl -u nginx -f
```

## Security Considerations

### 1. Firewall Configuration
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Regular Updates
```bash
sudo apt update && sudo apt upgrade -y
npm audit fix
```

### 3. Environment Variables
- Never commit `.env.local` to version control
- Use strong, unique passwords
- Rotate secrets regularly

## Performance Optimization

### 1. Node.js Optimization
The deployment script sets optimal Node.js flags:
- `--max-old-space-size=1024` - Memory limit
- Cluster mode for CPU utilization

### 2. Caching
Consider implementing:
- Redis for session storage
- CDN for static assets
- Browser caching headers

### 3. Database Optimization
If using a database:
- Connection pooling
- Query optimization
- Regular maintenance

## Support

For deployment issues:
1. Check the deployment logs
2. Verify environment variables
3. Test individual components
4. Contact Sharp Digital Ireland support

**Contact Information:**
- Email: hello@sharpdigital.in
- Website: https://sharpdigital.in

---

This deployment guide ensures a smooth, secure, and optimized deployment of Sharp Ireland on your VPS infrastructure.
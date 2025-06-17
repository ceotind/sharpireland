#!/bin/bash

# Sharp Ireland VPS Deployment Script
# Automated setup for Ubuntu/Debian VPS with Node.js 18+ and production build

set -e  # Exit on any error

echo "🚀 Starting Sharp Ireland VPS Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y ca-certificates curl gnupg lsb-release git build-essential

# Install Node.js 18+ (using NodeSource repository)
print_status "Installing Node.js 18+..."
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    print_status "Adding NodeSource repository..."
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt update
    sudo apt install -y nodejs
    print_success "Node.js $(node -v) installed successfully"
else
    print_success "Node.js $(node -v) already installed"
fi

# Verify Node.js and npm versions
print_status "Verifying Node.js and npm versions..."
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install PM2 for process management (optional but recommended)
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 for process management..."
    sudo npm install -g pm2
    print_success "PM2 installed successfully"
else
    print_success "PM2 already installed"
fi

# Check if we're in the project directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the project root directory."
    print_status "Expected project structure:"
    echo "  - package.json"
    echo "  - next.config.ts"
    echo "  - app/ directory"
    exit 1
fi

# Check if this is the Sharp Ireland project
if ! grep -q '"name": "sharpireland"' package.json; then
    print_error "This doesn't appear to be the Sharp Ireland project."
    print_error "Expected package name 'sharpireland' in package.json"
    exit 1
fi

# Validate project structure
print_status "Validating project structure..."
required_files=("package.json" "next.config.ts" "app/layout.tsx" "app/page.tsx")
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done
print_success "Project structure validated"

# Install ALL dependencies including dev dependencies for build
print_status "Installing project dependencies (including dev dependencies for build)..."
if [[ -f "package-lock.json" ]]; then
    npm ci
else
    npm install
fi
print_success "All dependencies installed successfully"

# Validate environment variables
print_status "Validating environment variables..."
if [[ -f "scripts/validate-env.js" ]]; then
    npm run validate-env
    print_success "Environment variables validated"
else
    print_warning "Environment validation script not found. Please ensure all required environment variables are set."
fi

# Run pre-deployment checks
print_status "Running pre-deployment checks..."
if npm run pre-deploy; then
    print_success "Pre-deployment checks passed"
else
    print_error "Pre-deployment checks failed"
    exit 1
fi

# Build the project for production
print_status "Building project for production..."
export NODE_ENV=production
if npm run build; then
    print_success "Production build completed successfully"
else
    print_error "Production build failed"
    exit 1
fi

# Clean up development dependencies to reduce disk usage AFTER build
print_status "Cleaning up development dependencies..."
npm prune --production

# Set up PM2 ecosystem file for production
print_status "Setting up PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sharp-ireland',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Wait for application to start
print_status "Waiting for application to start..."
sleep 10

# Health check
print_status "Performing health check..."
if npm run health-check; then
    print_success "Health check passed - Application is running correctly"
else
    print_warning "Health check failed - Application may not be fully ready"
    print_status "Checking PM2 status..."
    pm2 status
fi

# Display final status
echo ""
echo "================================================"
print_success "Sharp Ireland deployment completed!"
echo "================================================"
echo ""
echo "📊 Deployment Summary:"
echo "  • Node.js version: $(node -v)"
echo "  • npm version: $(npm -v)"
echo "  • Application: Running on port 3000"
echo "  • Process manager: PM2"
echo "  • Environment: Production"
echo ""
echo "🔧 Useful Commands:"
echo "  • Check status: pm2 status"
echo "  • View logs: pm2 logs sharp-ireland"
echo "  • Restart app: pm2 restart sharp-ireland"
echo "  • Stop app: pm2 stop sharp-ireland"
echo ""
echo "🌐 Access your application:"
echo "  • Local: http://localhost:3000"
echo "  • External: http://YOUR_SERVER_IP:3000"
echo ""
print_status "Don't forget to configure your firewall to allow port 3000!"
print_status "Consider setting up a reverse proxy (nginx) for production use."
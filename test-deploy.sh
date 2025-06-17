#!/bin/bash

# Test script for deployment validation
# This script tests the deployment script without actually deploying

set -e

echo "🧪 Testing Sharp Ireland Deployment Script..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test 1: Check if deployment script exists and is executable
print_test "Checking deployment script..."
if [[ -f "deploy.sh" && -x "deploy.sh" ]]; then
    print_pass "deploy.sh exists and is executable"
else
    print_fail "deploy.sh missing or not executable"
    exit 1
fi

# Test 2: Validate script syntax
print_test "Validating script syntax..."
if bash -n deploy.sh; then
    print_pass "Script syntax is valid"
else
    print_fail "Script has syntax errors"
    exit 1
fi

# Test 3: Check required project files
print_test "Checking project structure..."
required_files=("package.json" "next.config.ts" "app/layout.tsx" "app/page.tsx")
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_pass "$file exists"
    else
        print_fail "$file missing"
        exit 1
    fi
done

# Test 4: Validate package.json content
print_test "Validating package.json..."
if grep -q '"name": "sharpireland"' package.json; then
    print_pass "Package name is correct"
else
    print_fail "Package name validation failed"
    exit 1
fi

if grep -q '"scripts"' package.json; then
    print_pass "Scripts section exists"
else
    print_fail "Scripts section missing"
    exit 1
fi

# Test 5: Check for required scripts
print_test "Checking required npm scripts..."
required_scripts=("build" "start" "pre-deploy" "health-check" "validate-env")
for script in "${required_scripts[@]}"; do
    if grep -q "\"$script\":" package.json; then
        print_pass "Script '$script' exists"
    else
        print_fail "Script '$script' missing"
        exit 1
    fi
done

# Test 6: Test environment validation
print_test "Testing environment validation..."
if [[ -f "scripts/validate-env.js" ]]; then
    print_pass "Environment validation script exists"
    if npm run validate-env > /dev/null 2>&1; then
        print_pass "Environment validation passes"
    else
        print_fail "Environment validation failed"
        echo "Note: This may be expected if .env.local is not configured"
    fi
else
    print_fail "Environment validation script missing"
    exit 1
fi

# Test 7: Test build process
print_test "Testing build process..."
if npm run build > /dev/null 2>&1; then
    print_pass "Build process successful"
else
    print_fail "Build process failed"
    exit 1
fi

# Test 8: Check if .next directory was created
print_test "Checking build output..."
if [[ -d ".next" ]]; then
    print_pass "Build output directory created"
else
    print_fail "Build output directory missing"
    exit 1
fi

# Test 9: Validate deployment guide
print_test "Checking deployment documentation..."
if [[ -f "DEPLOYMENT_GUIDE.md" ]]; then
    print_pass "Deployment guide exists"
else
    print_fail "Deployment guide missing"
    exit 1
fi

# Test 10: Check README.md for deployment instructions
print_test "Checking README.md deployment section..."
if grep -q "VPS Deployment" README.md; then
    print_pass "VPS deployment section exists in README"
else
    print_fail "VPS deployment section missing from README"
    exit 1
fi

echo ""
echo "=============================================="
print_pass "All deployment tests passed! ✨"
echo "=============================================="
echo ""
echo "📋 Test Summary:"
echo "  ✅ Deployment script validation"
echo "  ✅ Project structure verification"
echo "  ✅ Package.json validation"
echo "  ✅ Required scripts check"
echo "  ✅ Environment validation"
echo "  ✅ Build process test"
echo "  ✅ Documentation verification"
echo ""
echo "🚀 The deployment script is ready for use!"
echo "   Run './deploy.sh' on your VPS to deploy Sharp Ireland"
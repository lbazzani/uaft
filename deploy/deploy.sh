#!/bin/bash

###############################################################################
# UAFT Deployment Script
#
# This script deploys the UAFT application to production
#
# Usage:
#   sudo ./deploy/deploy.sh
#
# Prerequisites:
#   - Node.js 18+ installed
#   - TLS certificates in place
#   - DNS records configured
###############################################################################

set -e  # Exit on error

echo "🚀 UAFT Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configuration
APP_DIR="/var/www/uaft"
APP_USER="www-data"
APP_GROUP="www-data"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root or with sudo"
    exit 1
fi

# 1. Pre-deployment checks
print_step "Running pre-deployment checks..."

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm"
    exit 1
fi

# 2. Create application directory
print_step "Setting up application directory..."

mkdir -p $APP_DIR
mkdir -p $APP_DIR/uploads
mkdir -p /var/log/uaft

# 3. Build application
print_step "Building Next.js application..."

cd "$(dirname "$0")/.."  # Go to project root

npm ci --production=false
npm run build

# 4. Copy files
print_step "Copying files to production directory..."

rsync -av --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude '.next/cache' \
    ./ $APP_DIR/

# 5. Install production dependencies
print_step "Installing production dependencies..."

cd $APP_DIR
npm ci --production

# 6. Set permissions
print_step "Setting file permissions..."

chown -R $APP_USER:$APP_GROUP $APP_DIR
chmod -R 755 $APP_DIR
chmod 700 $APP_DIR/.env.production || true
chmod 755 $APP_DIR/uploads
chmod 755 /var/log/uaft

# 7. Copy systemd service
print_step "Installing systemd service..."

cp $APP_DIR/deploy/systemd/uaft-web.service /etc/systemd/system/

systemctl daemon-reload

# 8. Enable and start service
print_step "Enabling and starting service..."

systemctl enable uaft-web
systemctl restart uaft-web

# 9. Check service status
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment completed!"
echo ""
echo "Service Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

systemctl status uaft-web --no-pager -l | head -10

echo ""
echo "📚 Useful Commands:"
echo "  - View web logs:    sudo journalctl -u uaft-web -f"
echo "  - Restart web:      sudo systemctl restart uaft-web"
echo ""

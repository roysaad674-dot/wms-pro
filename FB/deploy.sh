#!/bin/bash

# Facebook Ads Dashboard - Hostinger Deployment Script
# Run this on your Hostinger server after uploading the project

set -e

echo "🚀 Facebook Ads Dashboard - Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# Step 1: Install Node.js if not present
echo -e "${YELLOW}Step 1: Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt install -y nodejs
    echo -e "${GREEN}Node.js installed${NC}"
else
    echo -e "${GREEN}Node.js already installed: $(node --version)${NC}"
fi

# Step 2: Install PM2 if not present
echo -e "${YELLOW}Step 2: Checking PM2 installation...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    pm2 startup
    pm2 save
    echo -e "${GREEN}PM2 installed${NC}"
else
    echo -e "${GREEN}PM2 already installed${NC}"
fi

# Step 3: Install Nginx if not present
echo -e "${YELLOW}Step 3: Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo -e "${GREEN}Nginx installed and started${NC}"
else
    echo -e "${GREEN}Nginx already installed${NC}"
fi

# Step 4: Install project dependencies
echo -e "${YELLOW}Step 4: Installing project dependencies...${NC}"
npm install
npm install --prefix backend
echo -e "${GREEN}Dependencies installed${NC}"

# Step 5: Build Next.js
echo -e "${YELLOW}Step 5: Building Next.js application...${NC}"
npm run build
echo -e "${GREEN}Build completed${NC}"

# Step 6: Create logs directory
mkdir -p logs

# Step 7: Stop existing PM2 apps
echo -e "${YELLOW}Step 6: Stopping any existing PM2 apps...${NC}"
pm2 delete all 2>/dev/null || true

# Step 8: Start application with PM2
echo -e "${YELLOW}Step 7: Starting application with PM2...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
echo -e "${GREEN}Application started${NC}"

# Step 9: Configure Nginx
echo -e "${YELLOW}Step 8: Configuring Nginx...${NC}"

# Get domain from user
read -p "Enter your domain (e.g., example.com): " DOMAIN

# Create Nginx config
cat > /etc/nginx/sites-available/facebook-ads-dashboard << EOF
upstream frontend {
    server localhost:3000;
}

upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 100M;

    # API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/facebook-ads-dashboard /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo -e "${GREEN}Nginx configured${NC}"

# Step 10: Set up SSL
echo -e "${YELLOW}Step 9: Setting up SSL certificate...${NC}"
read -p "Setup Let's Encrypt SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d $DOMAIN -d www.$DOMAIN
    echo -e "${GREEN}SSL certificate installed${NC}"
else
    echo -e "${YELLOW}Skipping SSL setup${NC}"
fi

# Step 11: Set up database
echo -e "${YELLOW}Step 10: Database setup${NC}"
read -p "Have you created the MySQL database? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Run these commands to set up your database:${NC}"
    echo ""
    echo "mysql -u root -p"
    echo ""
    echo "CREATE DATABASE facebook_ads_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "CREATE USER 'facebook_user'@'localhost' IDENTIFIED BY 'your_secure_password';"
    echo "GRANT ALL PRIVILEGES ON facebook_ads_db.* TO 'facebook_user'@'localhost';"
    echo "FLUSH PRIVILEGES;"
    echo "EXIT;"
fi

# Step 12: Create environment file
echo -e "${YELLOW}Step 11: Creating environment files...${NC}"
if [ ! -f backend/.env ]; then
    cat > backend/.env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=facebook_user
DB_PASSWORD=your_secure_password
DB_NAME=facebook_ads_db
EOF
    echo -e "${YELLOW}⚠️  Edit backend/.env with your database credentials${NC}"
fi

chmod 600 backend/.env

# Final status
echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "🎉 Your app is now running!"
echo ""
echo "Frontend: http://$DOMAIN"
echo "API: http://$DOMAIN/api"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your database password"
echo "2. Verify database is created"
echo "3. Visit https://$DOMAIN to access your app"
echo ""
echo "📊 Useful commands:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs            - View application logs"
echo "  pm2 restart all     - Restart all apps"
echo "  pm2 stop all        - Stop all apps"
echo ""
echo "📖 For more help, see HOSTINGER_DEPLOYMENT.md"

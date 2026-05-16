# Hostinger Deployment Guide

## Prerequisites

- Hostinger VPS or Business Hosting plan with Node.js support
- SSH access to your server
- Domain name pointing to your server
- MySQL database (Hostinger provides this)

## Step 1: Prepare Your Server

### Connect via SSH
```bash
ssh root@your_server_ip
```

### Update System
```bash
apt update
apt upgrade -y
```

### Install Node.js (v18+ recommended)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
node --version
npm --version
```

### Install PM2 (Process Manager)
```bash
npm install -g pm2
pm2 startup
pm2 save
```

### Install Nginx (Reverse Proxy)
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## Step 2: Set Up Project Structure

```bash
cd /home/username
git clone <your-repo-url> facebook-ads-dashboard
cd facebook-ads-dashboard
```

Or if uploading manually:
```bash
# Create directory
mkdir -p /home/username/facebook-ads-dashboard
cd /home/username/facebook-ads-dashboard

# Upload files via SFTP/FTP
# Then run:
npm install
npm install --prefix backend
```

---

## Step 3: Configure Environment Variables

### Create .env files

**Frontend: `.env.production`**
```bash
nano .env.production
```
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
```

**Backend: `backend/.env`**
```bash
nano backend/.env
```
```
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=facebook_user
DB_PASSWORD=your_secure_password
DB_NAME=facebook_ads_db
```

### Set Correct Permissions
```bash
chmod 600 .env.production
chmod 600 backend/.env
```

---

## Step 4: Set Up MySQL Database

### Connect to MySQL
```bash
mysql -u root -p
```

### Create Database and User
```sql
CREATE DATABASE facebook_ads_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'facebook_user'@'localhost' IDENTIFIED BY 'your_secure_password';

GRANT ALL PRIVILEGES ON facebook_ads_db.* TO 'facebook_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

---

## Step 5: Build and Deploy

### Install Dependencies
```bash
cd /home/username/facebook-ads-dashboard

npm install
npm install --prefix backend
npm run build
```

### Update ecosystem.config.js
```bash
nano ecosystem.config.js
```

Replace the env values:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  DB_HOST: 'localhost',
  DB_USER: 'facebook_user',
  DB_PASSWORD: 'your_secure_password',
  DB_NAME: 'facebook_ads_db',
}
```

---

## Step 6: Configure Nginx

### Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/facebook-ads-dashboard
```

```nginx
upstream frontend {
    server localhost:3000;
}

upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 100M;

    # API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/facebook-ads-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 7: Set Up SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Answer prompts and choose to redirect HTTP to HTTPS.

---

## Step 8: Start the Application

### Start with PM2
```bash
cd /home/username/facebook-ads-dashboard
pm2 start ecosystem.config.js --env production
pm2 save
```

### Verify Running
```bash
pm2 status
pm2 logs
```

---

## Step 9: Set Up Automatic Backups

### Create Backup Script
```bash
nano /home/username/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/username/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="facebook_ads_db"

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u facebook_user -p'your_password' $DB_NAME > $BACKUP_DIR/db_$TIMESTAMP.sql

# Backup uploads (if any)
tar -czf $BACKUP_DIR/app_$TIMESTAMP.tar.gz /home/username/facebook-ads-dashboard

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### Make Executable and Schedule
```bash
chmod +x /home/username/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add this line:
```
0 2 * * * /home/username/backup.sh
```

---

## Maintenance Commands

### View Logs
```bash
pm2 logs
pm2 logs fb-ads-frontend
pm2 logs fb-ads-backend
```

### Restart Application
```bash
pm2 restart all
```

### Stop Application
```bash
pm2 stop all
```

### Update Code
```bash
cd /home/username/facebook-ads-dashboard
git pull origin main
npm install
npm run build
pm2 restart all
```

### Monitor Resources
```bash
pm2 monit
```

---

## Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
```bash
mysql -u facebook_user -p -h localhost facebook_ads_db
```

### Nginx Errors
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check PM2 Logs
```bash
pm2 logs --lines 100
```

---

## Security Checklist

- ✅ Change all default passwords
- ✅ Set up SSL/TLS (Let's Encrypt)
- ✅ Enable firewall (UFW)
- ✅ Restrict SSH access
- ✅ Regular backups
- ✅ Keep software updated
- ✅ Use environment variables for secrets

```bash
# Enable firewall
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## Performance Optimization

### Nginx Caching
```nginx
# Add to location / block
proxy_cache_valid 200 1h;
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

### Enable Gzip
```bash
nano /etc/nginx/nginx.conf
```

Uncomment:
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
```

---

## Monitoring

### Install Node.js Monitoring
```bash
pm2 install pm2-auto-pull
pm2 save
```

### Set Up Alerts
```bash
pm2 web  # Access via port 9615
```

---

## Support

For Hostinger-specific help:
- Hostinger Control Panel: https://hpanel.hostinger.com
- SSH Port: 22
- File Manager: Use Hostinger File Manager or SFTP

---

**Deployment Complete! 🎉**

Your app is now running on: `https://your-domain.com`
- Frontend: Port 3000 (via Nginx)
- Backend API: Port 5000 (via Nginx)
- Database: MySQL locally hosted

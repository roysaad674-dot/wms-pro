# Hostinger Quick Start Guide

## 🚀 Quick Deployment (5 Minutes)

### 1. Upload Your Project
- Use Hostinger File Manager or SFTP
- Upload all files to `/home/username/facebook-ads-dashboard`

### 2. Connect via SSH
```bash
ssh root@your_server_ip
cd /home/username/facebook-ads-dashboard
```

### 3. Run Deployment Script
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will automatically:
- ✅ Install Node.js
- ✅ Install PM2
- ✅ Install Nginx
- ✅ Build your app
- ✅ Start all services
- ✅ Configure SSL

---

## 📋 Manual Setup (If Script Fails)

### Step 1: Install Dependencies
```bash
npm install
npm install --prefix backend
npm run build
```

### Step 2: Configure Environment
```bash
# Edit frontend
nano .env.production
# Add: NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Edit backend
nano backend/.env
# Add database credentials
```

### Step 3: Start Services
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
```

### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/facebook-ads-dashboard
# Paste the Nginx config (see HOSTINGER_DEPLOYMENT.md)

sudo ln -s /etc/nginx/sites-available/facebook-ads-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Hostinger Control Panel Setup

### 1. Point Domain to Server
- Go to Hostinger hPanel
- DNS → Point your domain to server IP

### 2. Create Database
- hPanel → MySQL → Create Database
  - Database: `facebook_ads_db`
  - User: `facebook_user`
  - Password: Generate strong password

### 3. Upload Files
- File Manager → Upload project files
- Or use SFTP credentials provided in hPanel

---

## 📊 Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
```

### View Live Logs
```bash
pm2 logs
```

### Restart Application (After Code Changes)
```bash
cd /home/username/facebook-ads-dashboard
git pull origin main
npm run build
pm2 restart all
```

### View Resource Usage
```bash
pm2 monit
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 🔒 Security Setup

### 1. Enable SSL (Automatic with deploy.sh)
```bash
sudo certbot --nginx -d your-domain.com
```

### 2. Set Firewall Rules
```bash
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

### 3. Secure SSH
```bash
sudo nano /etc/ssh/sshd_config
# Change: PermitRootLogin no
# Change: PasswordAuthentication no
sudo systemctl restart sshd
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart all
```

### Database Connection Error
```bash
# Test connection
mysql -u facebook_user -p -h localhost facebook_ads_db

# If error, check credentials in backend/.env
```

### Nginx Not Working
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### App Not Starting with PM2
```bash
pm2 logs  # See full error
pm2 delete all
pm2 start ecosystem.config.js --env production
```

### Check Node.js Version
```bash
node --version  # Should be v18+
npm --version
```

---

## 📈 Performance Optimization

### 1. Enable Compression
```bash
# Already configured in Nginx by deploy script
gzip on;
gzip_types text/plain text/css text/javascript application/json;
```

### 2. Cache Static Files
```bash
# Add to Nginx location / block
expires 1h;
add_header Cache-Control "public, immutable";
```

### 3. Database Optimization
```bash
# Connect to MySQL
mysql -u facebook_user -p facebook_ads_db

# Optimize tables
OPTIMIZE TABLE users;
OPTIMIZE TABLE campaigns;
OPTIMIZE TABLE wallet_methods;
```

### 4. Monitor Memory Usage
```bash
pm2 start ecosystem.config.js --env production
pm2 monit  # Watch memory/CPU
```

---

## 📅 Backup & Recovery

### Manual Backup Database
```bash
mysqldump -u facebook_user -p facebook_ads_db > backup.sql
```

### Restore Database
```bash
mysql -u facebook_user -p facebook_ads_db < backup.sql
```

### Auto-Backup (Scheduled Daily)
```bash
# Create backup script
nano /home/username/backup.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u facebook_user -p'password' facebook_ads_db > /home/username/backups/db_$DATE.sql

# Make executable
chmod +x /home/username/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/username/backup.sh
```

---

## 🆘 Getting Help

### Check System Logs
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -xe
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Backend crashed - check `pm2 logs` |
| Connection timeout | Check firewall rules with `sudo ufw status` |
| Database error | Verify credentials in `backend/.env` |
| SSL not working | Run `sudo certbot renew --dry-run` |
| High memory usage | Restart with `pm2 restart all` |

---

## ✅ Deployment Checklist

- [ ] Hostinger account with VPS/Business plan
- [ ] Domain registered and pointing to server
- [ ] SSH access verified
- [ ] Project uploaded to server
- [ ] Node.js v18+ installed
- [ ] PM2 installed globally
- [ ] Nginx installed and configured
- [ ] MySQL database created
- [ ] Environment variables set (.env files)
- [ ] Application built (`npm run build`)
- [ ] PM2 apps running (`pm2 status`)
- [ ] SSL certificate installed
- [ ] Domain accessible via HTTPS
- [ ] First user created via admin panel
- [ ] Backups scheduled

---

## 🎉 Success!

Your Facebook Ads Dashboard is now live on Hostinger!

**Access your app:**
- 🌐 https://your-domain.com
- 📊 API: https://your-domain.com/api

**Login with:**
- Email: roy@example.com (demo)
- Password: password123

---

## 📞 Support Resources

- **Hostinger Help**: https://support.hostinger.com
- **Node.js Docs**: https://nodejs.org/docs
- **Nginx Docs**: https://nginx.org/docs
- **PM2 Docs**: https://pm2.keymetrics.io
- **Next.js Docs**: https://nextjs.org/docs

# Deployment Guide - Hostinger Ready 🚀

Your Facebook Ads Dashboard is now optimized for production deployment on Hostinger!

## 📚 Documentation Files

1. **HOSTINGER_QUICK_START.md** - Start here! 5-minute quick setup
2. **HOSTINGER_DEPLOYMENT.md** - Detailed step-by-step guide
3. This file - Overview and getting started

---

## 🎯 What's New for Deployment

✅ **Environment Configuration**
- `.env.local` - Development environment
- `.env.production` - Production environment
- `backend/.env` - Backend database config

✅ **Process Management**
- `ecosystem.config.js` - PM2 configuration for both frontend and backend
- Automatic restart on crash
- Log rotation and monitoring

✅ **Build Optimization**
- Production build scripts
- Nginx reverse proxy configuration
- SSL/TLS support

✅ **Database**
- Environment-based connection settings
- Secure credentials via .env files

✅ **Scripts**
- `deploy.sh` - One-click deployment script
- GitHub Actions CI/CD (optional)

---

## 🚀 Quick Start (Choose One)

### Option 1: Automatic Setup (Recommended)
```bash
# 1. Upload project to Hostinger server
# 2. SSH into your server
ssh root@your_server_ip

# 3. Run deployment script
cd /home/username/facebook-ads-dashboard
chmod +x deploy.sh
./deploy.sh

# 4. Follow prompts
# - Enter your domain
# - Setup SSL (Let's Encrypt)
# - Verify database
```

**Time: ~5-10 minutes** ⚡

### Option 2: Manual Setup
Follow detailed steps in **HOSTINGER_DEPLOYMENT.md**

**Time: ~30-45 minutes** (more control)

---

## 📋 Pre-Deployment Checklist

Before you deploy, ensure:

- [ ] Hostinger account with VPS/Business plan
- [ ] Domain registered (e.g., yourdomain.com)
- [ ] SSH access enabled in Hostinger Control Panel
- [ ] Hostinger file manager or SFTP access ready
- [ ] At least 2GB RAM on your server

---

## 🔧 Configuration Before Deployment

### 1. Update API URL
```bash
nano .env.production
```
Change:
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 2. Generate Database Password
Use a strong password generator. Example:
```
SecurePass123!@#$%^&*()
```

### 3. Update Backend Config Template
```bash
nano backend/.env.example
```
(This becomes `backend/.env` on server)

---

## 📊 Project Structure

```
facebook-ads-dashboard/
├── .env.local                 # Development
├── .env.production            # Production (Hostinger)
├── ecosystem.config.js        # PM2 process manager
├── deploy.sh                  # Automatic deployment
├── HOSTINGER_DEPLOYMENT.md    # Full guide
├── HOSTINGER_QUICK_START.md   # Quick reference
├── app/                       # Next.js frontend
├── backend/                   # Express backend
│   ├── database.js
│   ├── routes.js
│   ├── server.js
│   └── .env                   # Database credentials (server only)
├── components/                # React components
├── lib/                       # Utilities
├── store/                     # Zustand state management
└── types/                     # TypeScript types
```

---

## 🔐 Security Reminders

### Required Security Setup

1. **Change Default Passwords**
   - MySQL root password
   - SSH key-based authentication

2. **Enable Firewall**
   ```bash
   sudo ufw enable
   sudo ufw allow 22,80,443/tcp
   ```

3. **SSL Certificate**
   - Automatic via Let's Encrypt (deploy.sh)
   - Free & automatic renewal

4. **Environment Variables**
   - Keep `.env` files secure (chmod 600)
   - Never commit `.env` files to git
   - Use `.gitignore` (already configured)

5. **Database Security**
   - Strong passwords for database users
   - Limited user permissions
   - Regular backups

---

## 🎬 Deployment Steps Summary

### Phase 1: Preparation (Local - 10 min)
```bash
# Install dependencies
npm install
npm install --prefix backend

# Build production version
npm run build

# Verify build
npm run build:all
```

### Phase 2: Server Setup (Hostinger - 10 min)
```bash
# SSH into server
ssh root@your_ip

# Upload project (via SFTP or git clone)
# Navigate to project directory
cd /home/username/facebook-ads-dashboard

# Run setup script
chmod +x deploy.sh
./deploy.sh
```

### Phase 3: Configuration (Hostinger - 5 min)
- Enter domain name
- Setup SSL certificate
- Create database
- Set environment variables

### Phase 4: Verification (5 min)
```bash
# Check services
pm2 status

# View logs
pm2 logs

# Access app
https://your-domain.com
```

---

## 📝 Default Login Credentials

After deployment, login with:
```
Email: roy@example.com
Password: password123
```

⚠️ **Change these immediately after first login!**

---

## 🛠️ Post-Deployment Tasks

### 1. Create Admin User
- Go to Users page
- Create your admin account
- Delete demo account (optional)

### 2. Configure Application
- Update dashboard settings
- Set up payment methods (if needed)
- Configure business managers

### 3. Verify Database
```bash
mysql -u facebook_user -p facebook_ads_db

# Check tables
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

### 4. Set Up Monitoring
```bash
# Enable PM2 web dashboard
pm2 web

# Access at http://localhost:9615
```

---

## 🔄 Updating Your App

After deployment, update with:

```bash
# SSH into server
ssh root@your_ip
cd /home/username/facebook-ads-dashboard

# Pull latest code
git pull origin main

# Rebuild
npm run build

# Restart services
pm2 restart all
```

Or enable automatic deployment with GitHub Actions (see `.github/workflows/deploy-to-hostinger.yml`)

---

## 📊 Monitoring Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Real-time monitoring
pm2 monit

# Web dashboard
pm2 web  # Then visit http://server-ip:9615

# Check Nginx
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🆘 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| 502 Bad Gateway | Check `pm2 logs` for backend errors |
| Page blank | Check browser console for errors |
| API errors | Verify database connection in `backend/.env` |
| SSL issues | Run `sudo certbot renew` |
| High memory | Restart with `pm2 restart all` |
| Cannot connect | Check firewall with `sudo ufw status` |

---

## 📞 Support

### Resources
- **Hostinger Support**: https://support.hostinger.com
- **PM2 Docs**: https://pm2.keymetrics.io
- **Nginx Docs**: https://nginx.org
- **Next.js Docs**: https://nextjs.org

### Debug Commands
```bash
# Full system status
pm2 status
pm2 logs
pm2 monit

# Network status
curl http://localhost:3000   # Frontend
curl http://localhost:5000   # Backend API
curl http://localhost:5000/health

# Database status
mysql -u facebook_user -p facebook_ads_db

# Nginx status
sudo nginx -t
sudo systemctl status nginx
```

---

## ✅ Deployment Success Checklist

After deployment, verify:

- [ ] Domain loads without SSL errors
- [ ] Frontend accessible at https://your-domain.com
- [ ] API accessible at https://your-domain.com/api
- [ ] Can login with demo credentials
- [ ] Can create new users
- [ ] Can create campaigns
- [ ] Database connection working
- [ ] PM2 services running (`pm2 status`)
- [ ] Logs clean (no errors in `pm2 logs`)
- [ ] SSL certificate valid
- [ ] Backups scheduled

---

## 🎉 Congratulations!

Your Facebook Ads Dashboard is now live on Hostinger!

**Your app is running at:** `https://your-domain.com`

### What's Next?
1. Create your admin account
2. Add your business data
3. Configure integrations
4. Set up backups
5. Monitor performance

---

## 📖 Documentation Index

- **Quick Start** → `HOSTINGER_QUICK_START.md`
- **Full Guide** → `HOSTINGER_DEPLOYMENT.md`
- **API Docs** → Check `lib/api.ts`
- **Database Schema** → Check `backend/database.js`

---

**Happy Deployment! 🚀**

For any issues, refer to HOSTINGER_DEPLOYMENT.md or contact Hostinger support.

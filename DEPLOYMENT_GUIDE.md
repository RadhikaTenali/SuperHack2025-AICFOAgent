# 🚀 AI CFO Agent - Deployment Guide

## 📋 Deployment Options

### 🎯 **Recommended: Railway.app (Full-Stack)**
**Best for**: Complete solution, easy setup, cost-effective

### 🔄 **Alternative: Vercel + Railway (Hybrid)**
**Best for**: Maximum performance, separate frontend/backend scaling

### ☁️ **Enterprise: AWS Elastic Beanstalk**
**Best for**: AWS ecosystem integration, enterprise requirements

---

## 🚀 **Option 1: Railway.app Deployment (Recommended)**

### Prerequisites
- GitHub account
- Railway.app account (free tier available)

### Step 1: Prepare Your Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. **Visit**: [Railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project" → "Deploy from GitHub repo"
4. **Select** your `SuperHack2025-AICFOAgent` repository
5. **Railway will automatically detect** the Dockerfile and deploy

### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:

```env
# Application Settings
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secret-key-here

# CORS Settings (Railway will provide your domain)
CORS_ORIGINS=https://your-app.railway.app

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend API URL (Railway will provide this)
REACT_APP_API_URL=https://your-app.railway.app
```

### Step 4: Access Your Application
- **Frontend**: `https://your-app.railway.app`
- **API Docs**: `https://your-app.railway.app/docs`
- **Health Check**: `https://your-app.railway.app/health`

---

## 🔄 **Option 2: Vercel + Railway (Hybrid)**

### Deploy Backend to Railway
1. Follow **Option 1** steps for backend deployment
2. Note your Railway backend URL

### Deploy Frontend to Vercel
1. **Visit**: [Vercel.com](https://vercel.com)
2. **Import** your GitHub repository
3. **Configure**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `src/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variable**:
   ```env
   REACT_APP_API_URL=https://your-railway-backend.railway.app
   ```

5. **Deploy** and get your Vercel frontend URL

### Update Railway CORS
In Railway environment variables:
```env
CORS_ORIGINS=https://your-vercel-frontend.vercel.app
```

---

## 🐳 **Option 3: Local Docker Deployment**

### Prerequisites
- Docker Desktop installed
- Git

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd SuperHack2025-AICFOAgent

# Copy environment variables
cp env.example .env
# Edit .env with your actual values

# Deploy with Docker Compose
docker-compose up -d

# Check status
curl http://localhost:8000/health
```

### Access Points
- **Frontend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## ⚙️ **Environment Variables Reference**

### Required Variables
```env
ENVIRONMENT=production
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-domain.com
REACT_APP_API_URL=https://your-api-domain.com
```

### Optional Variables (for full functionality)
```env
# AWS Services
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SuperOps Integration
SUPEROPS_API_KEY=your-superops-api-key

# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Database (for production)
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## 🔧 **Post-Deployment Configuration**

### 1. Verify Deployment
```bash
# Check health endpoint
curl https://your-app.railway.app/health

# Test API endpoints
curl https://your-app.railway.app/dashboard/overview
```

### 2. Configure Email Service
1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate app password
   - Use app password in `SMTP_PASSWORD`

2. **Test Email**:
   - Visit your deployed app
   - Go to Weekly Report section
   - Send test email

### 3. Set Up AWS Services (Optional)
1. **AWS Bedrock**: For AI reasoning
2. **AWS S3**: For file storage
3. **Configure** AWS credentials in environment variables

### 4. Configure SuperOps Integration (Optional)
1. **Get API Key** from SuperOps
2. **Add** to environment variables
3. **Test** integration endpoints

---

## 🚨 **Troubleshooting**

### Common Issues

#### 1. CORS Errors
```bash
# Check CORS configuration
curl -H "Origin: https://your-frontend.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-backend.railway.app/
```

#### 2. Environment Variables Not Loading
- Check Railway/Vercel dashboard
- Ensure variable names match exactly
- Restart deployment after adding variables

#### 3. Frontend Not Loading
- Check `REACT_APP_API_URL` environment variable
- Verify backend is running and accessible
- Check browser console for errors

#### 4. Database Connection Issues
- Verify `DATABASE_URL` format
- Check database service is running
- Review connection logs

### Debug Commands
```bash
# Check application logs
docker-compose logs -f ai-cfo-agent

# Check specific service logs
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build -d
```

---

## 📊 **Performance Optimization**

### 1. Enable Caching
- Add Redis for session storage
- Configure CDN for static assets

### 2. Database Optimization
- Add database indexes
- Configure connection pooling

### 3. Monitoring
- Set up application monitoring
- Configure alerting for errors

---

## 🔐 **Security Considerations**

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique secret keys
- Rotate API keys regularly

### 2. HTTPS
- Railway and Vercel provide HTTPS by default
- Ensure all API calls use HTTPS

### 3. CORS
- Configure CORS origins properly
- Avoid using wildcard (`*`) in production

---

## 🎉 **Success Checklist**

- [ ] Application deployed and accessible
- [ ] Health check endpoint responding
- [ ] Frontend loading correctly
- [ ] API endpoints working
- [ ] Environment variables configured
- [ ] Email service working (optional)
- [ ] AWS services connected (optional)
- [ ] SuperOps integration active (optional)

---

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify environment variables
4. Test endpoints individually

**Your AI CFO Agent is now ready for production! 🚀**

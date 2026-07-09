# Deployment Guide - GrowEasy CSV Importer

This guide provides step-by-step instructions for deploying the application to production using Vercel (frontend) and Railway/Render (backend).

## Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- Railway account (https://railway.app) or Render account (https://render.com)
- Anthropic API key (from https://console.anthropic.com/)

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Client Browser              │
└────────────┬────────────────────────┘
             │ HTTPS
             ↓
┌─────────────────────────────────────┐
│  Frontend (Next.js on Vercel)       │
│  - Static/dynamic pages              │
│  - Client-side CSV parsing           │
│  - API calls to backend              │
└────────────┬────────────────────────┘
             │ HTTPS API calls
             ↓
┌─────────────────────────────────────┐
│  Backend (Express on Railway/Render) │
│  - CSV parsing                       │
│  - AI extraction (Claude API)        │
│  - Batch processing                  │
└─────────────────────────────────────┘
```

## Step 1: Prepare GitHub Repository

### Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `groweasy-csv-importer`
3. Make it public (for easy sharing)
4. Do NOT initialize with README (we have one)

### Push Code to GitHub

```bash
cd /path/to/Assignment
git init
git add .
git commit -m "Initial commit: AI-powered CSV importer for GrowEasy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/groweasy-csv-importer.git
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### Using Railway Dashboard

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select `groweasy-csv-importer` repository

3. **Configure Backend Service**
   - Add a new service → GitHub repo
   - Select the repo
   - It should auto-detect `backend` as root directory
   - Click "Deploy"

4. **Set Environment Variables**
   - In Railway dashboard, go to your project
   - Click on the backend service
   - Go to "Variables" tab
   - Add the following variables:

   ```
   ANTHROPIC_API_KEY=your_api_key_here
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   MAX_FILE_SIZE=10485760
   BATCH_SIZE=50
   ```

5. **Get Backend URL**
   - Railway will generate a public URL (e.g., `https://groweasy-backend-xxx.railway.app`)
   - Save this URL for the frontend configuration

### Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create project
railway init

# Add environment variables
railway variables add ANTHROPIC_API_KEY=your_key_here
railway variables add NODE_ENV=production
railway variables add CORS_ORIGIN=https://your-frontend.vercel.app

# Deploy
railway up
```

## Step 3: Deploy Frontend to Vercel

### Using Vercel Dashboard

1. **Sign In to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Search for `groweasy-csv-importer`
   - Click "Import"

3. **Configure Frontend**
   - Project name: `groweasy-csv-importer`
   - Framework preset: Next.js
   - Root directory: `./frontend`

4. **Set Environment Variables**
   - In the configuration step, add:
   
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   
   (Use the Railway backend URL from Step 2)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - You'll get a public URL (e.g., `https://groweasy-csv-importer.vercel.app`)

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts and set environment variables
```

## Step 4: Update Backend CORS

After deploying the frontend to Vercel, update the backend's CORS configuration:

1. In Railway/Render dashboard
2. Go to backend service variables
3. Update `CORS_ORIGIN` to your Vercel frontend URL
4. Redeploy

## Step 5: Alternative Deployment - Render

If using Render instead of Railway:

### Create Render Service

1. Go to https://render.com
2. Connect GitHub account
3. Create new "Web Service"
4. Select your repository
5. Configure:
   - Name: `groweasy-csv-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Region: Choose closest to you

6. Add Environment Variables:
   - Go to "Environment" tab
   - Add all the same variables as Railway

## Verification Checklist

After deployment:

- [ ] Frontend loads at `https://your-frontend.vercel.app`
- [ ] Backend /health endpoint responds: `https://your-backend.com/health`
- [ ] CORS headers are correct (try uploading a file)
- [ ] No console errors in browser DevTools
- [ ] API requests complete successfully
- [ ] Results display properly

### Test API Endpoint

```bash
# Test health endpoint
curl https://your-backend.com/health

# Should respond with:
# {"status":"ok","timestamp":"2026-07-09T..."}
```

## Monitoring & Logs

### Railway Logs
- Dashboard → Project → Service → Logs tab
- Real-time log streaming available

### Render Logs
- Services → Your service → Logs
- All deployment and runtime logs visible

### Vercel Logs
- Deployments tab → Select deployment → Logs
- Function logs for API routes

## Environment Variables Reference

### Backend (.env)
```
PORT=3001                              # Server port
NODE_ENV=production                    # Environment
ANTHROPIC_API_KEY=sk-ant-...          # Claude API key
CORS_ORIGIN=https://frontend-url.com  # Frontend domain
MAX_FILE_SIZE=10485760                # Max upload: 10MB
BATCH_SIZE=50                         # AI batch size
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://backend-url.com  # Backend API URL
```

## Troubleshooting

### "CORS error" or "Failed to fetch API"
- Check CORS_ORIGIN in backend environment variables
- Ensure it matches your frontend domain
- Redeploy backend after updating

### "API key not found"
- Verify ANTHROPIC_API_KEY is set in backend environment
- Check if key is valid (test in local dev first)

### "Deploy failed: Port already in use"
- Railway/Render handle port automatically
- Don't specify PORT in production (remove if hardcoded)

### "Cold start timeout"
- First request might be slow (5-30 seconds)
- Subsequent requests are fast
- Consider keeping server warm with health checks

## Performance Optimization

### Frontend
- Next.js automatically optimizes with Turbopack
- Images automatically optimized
- Code splitting handled by Next.js

### Backend
- Batch processing prevents API rate limits
- File uploads streamed to memory (10MB limit)
- Consider adding caching for repeated imports

### Database (Future)
```bash
# If adding PostgreSQL to Railway:
# - Add PostgreSQL addon in Railway
# - Railway automatically injects DATABASE_URL
# - Update backend code to use database
```

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Cost Estimation

### Monthly Costs (Approximate)

**Vercel Frontend:**
- Free tier: $0 (for reasonable traffic)
- Pro tier: $20/month

**Railway Backend:**
- Free tier: $5 included, then $0.50/GB-hr
- Typical usage: $5-20/month

**Anthropic API (Claude):**
- Depends on usage
- ~$0.01-0.05 per CSV import
- ~$1-5/month for 100-500 imports

**Total:** $10-25/month for production setup

## Backup & Recovery

### GitHub as Backup
- All code is on GitHub
- Can redeploy anytime from git history

### Environment Variables
- Write down or store securely
- Cannot be recovered from Railway/Render

### Data
- Currently stateless (no database)
- Consider adding PostgreSQL for audit logs

## Next Steps

1. Add unit tests
2. Set up error monitoring (Sentry)
3. Add analytics (Vercel Analytics)
4. Implement database persistence
5. Add user authentication
6. Create API documentation (Swagger/OpenAPI)

---

For issues, check logs in Railway/Render/Vercel dashboards or contact Anthropic support for API-related issues.

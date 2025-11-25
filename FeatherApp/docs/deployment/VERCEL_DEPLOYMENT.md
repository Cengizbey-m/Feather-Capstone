# 🚀 Vercel Deployment Guide

This guide will help you deploy the Feather frontend to Vercel and set up the backend on a separate platform.

## 📋 Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier works)
- Backend deployment platform account (Railway, Render, or Fly.io)

---

## 🎯 Deployment Strategy

Since this is a full-stack application:
- **Frontend (React)**: Deploy to Vercel
- **Backend (FastAPI)**: Deploy to Railway/Render/Fly.io (separate service)

---

## 🌐 Step 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `Cengizbey-m/Feather-Capstone`
   - Vercel will auto-detect it's a Vite project

3. **Configure Project Settings**
   - **Root Directory**: Set to `FeatherApp/frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add the following environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual backend URL after deploying the backend)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your frontend will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd FeatherApp/frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Link to existing project or create new
   - Set root directory to `frontend`
   - Confirm build settings

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_BASE_URL
   # Enter your backend URL when prompted
   ```

6. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

---

## 🔧 Step 2: Deploy Backend to Railway/Render

### Option A: Railway (Recommended - Easiest)

1. **Go to Railway**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - **Root Directory**: `FeatherApp/backend`
   - **Build Command**: (leave empty, Railway auto-detects)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   Add these in Railway dashboard:
   ```
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///./feather.db
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Go to Render**
   - Visit https://render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `feather-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   Add the same variables as Railway

5. **Deploy**
   - Render will deploy automatically
   - Get your backend URL

---

## 🔗 Step 3: Connect Frontend to Backend

1. **Update Frontend Environment Variable**
   - Go to Vercel dashboard
   - Navigate to your project → Settings → Environment Variables
   - Update `VITE_API_BASE_URL` with your backend URL
   - Redeploy the frontend

2. **Update Backend CORS**
   - In your backend platform (Railway/Render)
   - Update `CORS_ORIGINS` environment variable:
     ```
     CORS_ORIGINS=https://your-frontend.vercel.app
     ```
   - Restart the backend service

---

## ✅ Step 4: Verify Deployment

1. **Test Frontend**
   - Visit your Vercel URL
   - Check if the app loads correctly

2. **Test Backend**
   - Visit `https://your-backend-url/docs`
   - Check if API documentation loads

3. **Test Connection**
   - Try logging in from the frontend
   - Check browser console for any CORS errors

---

## 🔄 Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:
- **Vercel**: Automatically deploys on push to main branch
- **Railway/Render**: Automatically deploys on push to main branch

To disable auto-deploy or configure branches:
- Vercel: Project Settings → Git
- Railway: Project Settings → Deployments
- Render: Service Settings → Auto-Deploy

---

## 🐛 Troubleshooting

### Frontend Issues

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

**Environment Variables Not Working:**
- Variables must start with `VITE_` to be accessible in Vite
- Redeploy after adding environment variables
- Check variable names match exactly

**API Connection Errors:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend is running and accessible
- Check CORS settings in backend

### Backend Issues

**Build Fails:**
- Check Python version (should be 3.11+)
- Verify all dependencies in `requirements.txt`
- Check build logs in Railway/Render dashboard

**Database Issues:**
- SQLite works for development but consider PostgreSQL for production
- For Railway: Add PostgreSQL service and update `DATABASE_URL`
- For Render: Use PostgreSQL addon

**CORS Errors:**
- Verify `CORS_ORIGINS` includes your frontend URL
- Check backend logs for CORS-related errors
- Ensure backend is accessible (not blocked by firewall)

---

## 📊 Recommended Production Setup

### Frontend (Vercel)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Preview deployments for PRs

### Backend (Railway/Render)
- ✅ Automatic deployments
- ✅ Environment variable management
- ✅ Logs and monitoring
- ✅ PostgreSQL database (recommended)

### Database
For production, use PostgreSQL instead of SQLite:
- **Railway**: Add PostgreSQL service
- **Render**: Add PostgreSQL addon
- **Supabase**: Free PostgreSQL option
- Update `DATABASE_URL` environment variable

---

## 🔐 Security Checklist

- [ ] Use strong `SECRET_KEY` in production
- [ ] Set proper `CORS_ORIGINS` (no wildcards in production)
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Review and restrict API endpoints if needed
- [ ] Set up monitoring and error tracking

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🎉 Success!

Once deployed, your Feather app will be live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app` (or Render URL)
- **API Docs**: `https://your-backend.railway.app/docs`

Happy deploying! 🚀


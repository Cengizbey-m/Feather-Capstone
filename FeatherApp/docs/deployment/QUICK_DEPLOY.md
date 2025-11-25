# ⚡ Quick Deploy to Vercel

## 🚀 Fastest Way to Deploy

### 1. Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New..." → "Project"**
4. **Select your repo**: `Cengizbey-m/Feather-Capstone`
5. **Configure**:
   - **Root Directory**: `FeatherApp/frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
6. **Add Environment Variable**:
   - Key: `VITE_API_BASE_URL`
   - Value: `http://localhost:8000` (update after backend deploy)
7. **Click "Deploy"**

✅ Your frontend will be live in ~2 minutes!

### 2. Deploy Backend to Railway (5 minutes)

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repo**
5. **Configure**:
   - **Root Directory**: `FeatherApp/backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. **Add Environment Variables**:
   ```
   SECRET_KEY=your-secret-key-change-this
   DATABASE_URL=sqlite:///./feather.db
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
7. **Deploy** - Railway auto-deploys!

✅ Your backend will be live in ~3 minutes!

### 3. Connect Frontend to Backend

1. **Get your backend URL** from Railway (e.g., `https://your-app.railway.app`)
2. **Update Vercel environment variable**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `VITE_API_BASE_URL` with your Railway backend URL
3. **Redeploy** frontend (or wait for auto-deploy)

### 4. Update Backend CORS

1. **In Railway**, update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
2. **Restart** the service

## 🎉 Done!

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API Docs**: `https://your-app.railway.app/docs`

## 📝 Notes

- Frontend auto-deploys on every push to main
- Backend auto-deploys on every push to main
- Update environment variables as needed
- Check logs in both platforms if issues occur

For detailed instructions, see `VERCEL_DEPLOYMENT.md`


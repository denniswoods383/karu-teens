# 🚀 Deploy Karu Teens Social Platform

## Quick Deploy to Vercel (Recommended)

### 1. **Create Vercel Account**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub/Google

### 2. **Deploy via GitHub**
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to vercel.com dashboard
   - Click "New Project"
   - Import from GitHub
   - Select your repository

### 3. **Environment Variables**
Add these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://mmeqccelfchvnbvhqmws.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZXFjY2VsZmNodm5idmhxbXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjk4NTAsImV4cCI6MjA3MDQwNTg1MH0.Fp0hMjfza356JAHwUcLWBkmjxkIRGv_XzX2IoRjtTSw
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqvgzpkgr
```

### 4. **Deploy**
- Vercel will auto-deploy
- Get your live URL (e.g., `https://your-app.vercel.app`)

## Alternative: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `frontend` folder
3. Add environment variables in site settings
4. Get your live URL

## Alternative: Railway

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

## 🎯 After Deployment

Your platform will be live at:
- **Vercel:** `https://your-app.vercel.app`
- **Netlify:** `https://your-app.netlify.app`

### Features that work:
✅ User registration/login
✅ Real-time messaging
✅ Photo uploads (Cloudinary)
✅ Profile management
✅ Posts and comments
✅ Notifications
✅ Mobile responsive

### Share with users:
Send them the live URL and they can:
1. Register an account
2. Create their profile
3. Start posting and messaging!

## 🔧 Quick Commands

```bash
# Build for production
npm run build

# Start production server locally
npm start

# Check for errors
npm run lint
```
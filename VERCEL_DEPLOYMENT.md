# Vercel Deployment Guide

Deploy your Reaction Time Trainer PWA to Vercel for fast, global distribution with automatic HTTPS and custom domains.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub first
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)

## Step 1: Prepare Your Project

✅ **Already Done**: I've created the necessary `vercel.json` configuration file for optimal deployment.

## Step 2: Deploy via Vercel Dashboard

### Option A: Import from GitHub (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click **"Sign Up"** or **"Login"**
   - Choose **"Continue with GitHub"** for seamless integration

2. **Import Repository**
   - Click **"Add New..."** → **"Project"**
   - Find your `reaction-time-trainer` repository
   - Click **"Import"**

3. **Configure Project Settings**
   - **Project Name**: `reaction-time-trainer` (or customize)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `.` (leave as default)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `dist` (should auto-fill)
   - **Install Command**: `npm install` (should auto-fill)

4. **Environment Variables** (Optional)
   - For now, no environment variables needed
   - The app works with in-memory storage by default

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build completion
   - Your app will be live at `https://your-project-name.vercel.app`

### Option B: Vercel CLI (Advanced)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: reaction-time-trainer
# - Directory: ./
# - Want to override settings? No
```

## Step 3: Custom Domain (Optional)

1. **Go to Project Settings**
   - Navigate to your project dashboard
   - Click **"Settings"** → **"Domains"**

2. **Add Custom Domain**
   - Click **"Add"**
   - Enter your domain (e.g., `reactiontrainer.com`)
   - Follow DNS configuration instructions
   - Vercel provides free SSL certificates

## Step 4: Configure PWA Settings

Your PWA will work automatically on Vercel with:

✅ **HTTPS by default** (required for PWA features)
✅ **Service Worker** will register properly
✅ **Install prompts** will appear on mobile devices
✅ **Offline functionality** through cached assets

## Step 5: Automatic Deployments

Once connected to GitHub:

- **Auto-deploy on push**: Every commit to main branch triggers deployment
- **Preview deployments**: Pull requests get preview URLs
- **Rollback capability**: Easy rollback to previous deployments

## Performance Optimizations

Vercel automatically provides:

- **Global CDN**: Fast loading worldwide
- **Image optimization**: Automatic image compression
- **Edge functions**: Server-side rendering at the edge
- **Analytics**: Performance insights (upgrade required)

## Monitoring Your App

1. **Vercel Dashboard**
   - View deployment logs
   - Monitor function executions
   - Check performance metrics

2. **Real User Monitoring**
   - Vercel Analytics (paid feature)
   - Google Analytics integration possible

## Troubleshooting Common Issues

### 404 NOT_FOUND Error
If you get a 404 error after deployment:

1. **Check Build Logs**: Look for warnings about unused build settings
2. **Update vercel.json**: The corrected configuration should use:
   ```json
   {
     "buildCommand": "vite build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "framework": null,
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. **Redeploy**: Push the updated vercel.json to trigger a new deployment

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### PWA Not Installing
- Ensure HTTPS is working (automatic on Vercel)
- Check service worker registration in browser console
- Verify manifest.json is accessible

### Performance Issues
- Use Vercel Analytics to identify bottlenecks
- Optimize images and assets
- Enable compression in build settings

## Production Checklist

Before going live:

- [ ] Test PWA installation on mobile devices
- [ ] Verify all reaction time tests work correctly
- [ ] Check data export functionality
- [ ] Test offline capabilities
- [ ] Validate performance on different devices
- [ ] Review and update About section with current information

## Deployment URLs

After deployment, your app will be available at:

- **Production**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)
- **Preview**: Unique URLs for each pull request

## Next Steps After Deployment

1. **Share Your App**
   - Add the Vercel URL to your GitHub repository description
   - Share with the volleyball and sports science community
   - Submit to PWA directories

2. **Monitor Usage**
   - Set up analytics to track user engagement
   - Monitor reaction time data patterns
   - Gather feedback from athletes and researchers

3. **Continuous Improvement**
   - Regular updates based on user feedback
   - Performance optimizations
   - New features and research integration

Your scientific reaction time trainer is ready for global use! 🚀

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **PWA Checklist**: [web.dev/pwa-checklist](https://web.dev/pwa-checklist)
- **Performance Monitoring**: Vercel Analytics dashboard
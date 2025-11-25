# Deployment Guide for Maartly

This guide covers deploying Maartly to various platforms.

## 📦 Prerequisites

Before deploying, ensure you have:
- Built the project locally: `npm run build`
- Tested the production build: `npm run preview`
- All environment variables configured

## 🚀 Deployment Options

### 1. Vercel (Recommended - Easiest)

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Via Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "Import Project"
3. Connect your Git repository
4. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

**Environment Variables:**
- Add in Vercel Dashboard → Settings → Environment Variables
- No environment variables needed for demo version

### 2. Netlify

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Via Netlify Dashboard:**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import existing project"
3. Connect your Git repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

**Update vite.config.ts:**
```typescript
export default defineConfig({
  base: '/repository-name/', // Replace with your repo name
  // ... rest of config
});
```

### 4. AWS S3 + CloudFront

**Step 1: Build**
```bash
npm run build
```

**Step 2: Create S3 Bucket**
- Go to AWS S3 Console
- Create bucket with public access
- Enable static website hosting

**Step 3: Upload Files**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

**Step 4: Create CloudFront Distribution**
- Point to S3 bucket
- Set default root object: `index.html`
- Set error pages: 404 → `/index.html` (for SPA routing)

### 5. Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and Run:**
```bash
# Build image
docker build -t maartly .

# Run container
docker run -p 80:80 maartly
```

### 6. Traditional Web Hosting (cPanel, etc.)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload files:**
   - Upload all files from `dist` folder to your hosting
   - Place them in `public_html` or `www` directory

3. **Configure .htaccess** (for Apache):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## 🔧 Post-Deployment Configuration

### 1. Custom Domain Setup

**Vercel:**
- Dashboard → Settings → Domains
- Add your domain and follow DNS instructions

**Netlify:**
- Dashboard → Domain settings → Add custom domain

### 2. SSL Certificate

Most platforms (Vercel, Netlify) provide automatic SSL. For others:
- Use Let's Encrypt: https://letsencrypt.org/
- Or use Cloudflare for free SSL

### 3. Performance Optimization

**Enable Gzip/Brotli Compression:**
Most platforms enable this by default. For Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
```

**CDN Configuration:**
- Enable CDN on your hosting platform
- Configure cache headers

### 4. Monitoring

**Recommended Tools:**
- Google Analytics for user tracking
- Sentry for error tracking
- Vercel Analytics (if using Vercel)

## 🔐 Security Checklist

Before deploying to production:

- [ ] Remove all console.log statements
- [ ] Configure proper CORS headers
- [ ] Set up Content Security Policy
- [ ] Enable HTTPS only
- [ ] Implement rate limiting
- [ ] Add authentication for admin features
- [ ] Sanitize all user inputs
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates

## 📊 Performance Checklist

- [ ] Enable production build
- [ ] Minify and compress assets
- [ ] Enable lazy loading
- [ ] Optimize images
- [ ] Use CDN for static assets
- [ ] Enable browser caching
- [ ] Implement service worker
- [ ] Monitor Core Web Vitals

## 🐛 Troubleshooting

**404 Errors on Refresh:**
- Configure server to serve index.html for all routes
- See platform-specific routing configurations above

**Blank Page After Deployment:**
- Check browser console for errors
- Verify base URL in vite.config.ts
- Check if all assets are loading correctly

**Slow Loading:**
- Enable compression
- Use CDN
- Optimize images
- Check bundle size: `npm run build -- --analyze`

## 📱 Progressive Web App (PWA)

To make Maartly installable:

1. Install vite-plugin-pwa:
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. Update vite.config.ts:
   ```typescript
   import { VitePWA } from 'vite-plugin-pwa';
   
   plugins: [
     react(),
     tailwindcss(),
     VitePWA({
       registerType: 'autoUpdate',
       manifest: {
         name: 'Maartly Inventory',
         short_name: 'Maartly',
         description: 'Inventory Management System',
         theme_color: '#030213',
         icons: [
           {
             src: '/icon-192.png',
             sizes: '192x192',
             type: 'image/png'
           },
           {
             src: '/icon-512.png',
             sizes: '512x512',
             type: 'image/png'
           }
         ]
       }
     })
   ]
   ```

## 🔄 Continuous Deployment

**GitHub Actions Example:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review build logs for errors
3. Test locally with `npm run preview`
4. Check browser console for runtime errors

---

**Last Updated:** October 2024

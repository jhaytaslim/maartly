# 🔧 Separating Frontend and Backend Projects

This guide explains how to split the Maartly system into two separate deployable projects.

## 📁 Current Structure

```
maartly-complete-system/
├── backend/           # NestJS API
├── frontend files/    # React app (root level)
└── docs/             # Documentation
```

## 🎯 Goal: Two Separate Projects

```
maartly-backend/        # Standalone backend
└── (backend files)

maartly-frontend/       # Standalone frontend
└── (frontend files)
```

---

## 🚀 Method 1: Copy and Organize (Recommended)

### Step 1: Create Two Project Folders

```bash
# Create project folders
mkdir maartly-backend
mkdir maartly-frontend
```

### Step 2: Setup Backend Project

```bash
# Copy backend files
cp -r backend/* maartly-backend/
cd maartly-backend

# Initialize git
git init
git add .
git commit -m "Initial backend setup"

# Create .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
*.log
.DS_Store
EOF

# Install and test
npm install
npm run start:dev
```

### Step 3: Setup Frontend Project

```bash
# Copy frontend files (from root)
cd ..
cp -r !(backend|maartly-backend|maartly-frontend|node_modules) maartly-frontend/
cd maartly-frontend

# Initialize git
git init
git add .
git commit -m "Initial frontend setup"

# Create .env.local
cat > .env.local << EOF
VITE_API_URL=http://localhost:3001/api/v1
EOF

# Install and test
npm install
npm run dev
```

### Step 4: Update Configuration

**Frontend `vite.config.ts`:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

**Backend CORS Configuration:**

In `backend/src/main.ts`, update CORS:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',  // Development
    'https://your-frontend.vercel.app',  // Production
  ],
  credentials: true,
});
```

---

## 🚀 Method 2: Git Subtree (Advanced)

### Split Using Git Subtree

```bash
# Backend
git subtree split --prefix=backend -b backend-branch
mkdir maartly-backend
cd maartly-backend
git init
git pull ../your-repo backend-branch

# Frontend  
git subtree split --prefix=. --rejoin -b frontend-branch
mkdir maartly-frontend
cd maartly-frontend
git init
git pull ../your-repo frontend-branch
```

---

## 📦 Deployment Configurations

### Backend Deployment

**Dockerfile (backend):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run prisma:generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

**Railway/Render:**

```yaml
# railway.toml or render.yaml
[build]
  builder = "NIXPACKS"
  
[deploy]
  startCommand = "npm run start:prod"
  
[env]
  NODE_ENV = "production"
```

### Frontend Deployment

**Dockerfile (frontend):**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Vercel Configuration:**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.railway.app/api/:path*"
    }
  ]
}
```

---

## 🔗 Connecting Frontend to Backend

### Development

**Frontend `.env.local`:**

```env
VITE_API_URL=http://localhost:3001/api/v1
```

**Frontend API Service (`lib/api.ts`):**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const api = {
  async get(endpoint: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

### Production

**Environment Variables:**

Backend:
```env
NODE_ENV=production
APP_URL=https://your-frontend.vercel.app
API_URL=https://your-backend.railway.app
DATABASE_URL=mongodb+srv://...
REDIS_HOST=redis-cloud-url
```

Frontend:
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## 📋 Deployment Checklist

### Backend Deployment

- [ ] MongoDB Atlas setup with connection string
- [ ] Redis Cloud setup with credentials
- [ ] Environment variables configured
- [ ] JWT secret set (strong, random)
- [ ] Email service configured (SendGrid/Mailgun)
- [ ] SMS service configured (Twilio)
- [ ] Payment gateways configured (Stripe/Paystack)
- [ ] CORS origins updated
- [ ] Health check endpoint working
- [ ] Database migrations run
- [ ] Backup strategy in place

**Deploy to:**
- Railway (recommended)
- Render
- Heroku
- AWS/GCP/Azure
- DigitalOcean

### Frontend Deployment

- [ ] API URL environment variable set
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] API proxy configured (if needed)
- [ ] Custom domain setup
- [ ] SSL certificate configured
- [ ] CDN enabled
- [ ] Error tracking setup (Sentry)

**Deploy to:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

---

## 🔄 Development Workflow

### Running Both Projects

**Terminal 1 (Backend):**
```bash
cd maartly-backend
npm run start:dev
# Running on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd maartly-frontend
npm run dev
# Running on http://localhost:5173
```

### Shared Development

**Option 1: Monorepo with Workspaces**

```json
// package.json (root)
{
  "private": true,
  "workspaces": [
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces"
  }
}
```

**Option 2: Separate Git Repositories**

```bash
# Backend repo
https://github.com/your-org/maartly-backend

# Frontend repo
https://github.com/your-org/maartly-frontend
```

---

## 🌐 Production URLs Structure

### Recommended Setup

```
Backend API:     https://api.maartly.com
Frontend App:    https://app.maartly.com
Marketing Site:  https://maartly.com
Documentation:   https://docs.maartly.com
```

### DNS Configuration

```
A Record:        maartly.com → Landing page server
CNAME:           app.maartly.com → Vercel
CNAME:           api.maartly.com → Railway
CNAME:           docs.maartly.com → Vercel/GitBook
```

---

## 🔐 Security for Separated Projects

### API Authentication

1. **JWT Tokens** stored in localStorage
2. **Refresh Tokens** in httpOnly cookies
3. **CORS** properly configured
4. **Rate Limiting** on API
5. **HTTPS** enforced on both

### Communication Security

```typescript
// Frontend API calls
const response = await fetch(`${API_URL}/endpoint`, {
  credentials: 'include',  // Send cookies
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

---

## 📊 Monitoring Separated Projects

### Backend Monitoring

- Health checks: `/api/v1/health`
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Log aggregation (LogDNA)

### Frontend Monitoring

- Error tracking (Sentry)
- Performance monitoring (Lighthouse CI)
- Analytics (Google Analytics/Plausible)
- User feedback (Hotjar)

---

## ✅ Verification Steps

### Test Separated Projects

1. **Backend alone:**
```bash
curl https://api.maartly.com/api/v1/health
```

2. **Frontend alone:**
```bash
# Visit https://app.maartly.com
# Should load landing page
```

3. **Integration:**
```bash
# Login from frontend
# Should call backend API
# Check Network tab in DevTools
```

---

## 🆘 Troubleshooting

### CORS Errors

```typescript
// Backend: src/main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### API Connection Failed

```typescript
// Frontend: Check .env.local
VITE_API_URL=http://localhost:3001/api/v1  // Development
# or
VITE_API_URL=https://your-backend.railway.app/api/v1  // Production
```

### Build Errors

```bash
# Backend
rm -rf node_modules dist
npm install
npm run build

# Frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 Recommended Project Structure

### maartly-backend/

```
maartly-backend/
├── src/
├── prisma/
├── test/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
├── README.md
└── SETUP.md
```

### maartly-frontend/

```
maartly-frontend/
├── src/
├── components/
├── lib/
├── styles/
├── public/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.ts
├── Dockerfile
├── README.md
└── SETUP.md
```

---

## 🎉 Success!

You now have:
- ✅ Separate backend project (deployable)
- ✅ Separate frontend project (deployable)
- ✅ Independent development
- ✅ Independent deployment
- ✅ Scalable architecture

**Next Steps:**
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel/Netlify
3. Configure production environment variables
4. Set up custom domains
5. Enable monitoring

---

**Maartly** - Smart Sales. Simple Control. 🚀

*Now with fully separated, independently deployable projects!*

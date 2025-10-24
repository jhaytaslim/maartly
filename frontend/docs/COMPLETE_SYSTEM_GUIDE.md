# 🎯 Martly - Complete System Guide v2.0

**Smart Sales. Simple Control.**

A comprehensive, production-ready inventory management system with complete backend API, role-based access control, offline support, and multi-tenant architecture.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Role-Based Access Control](#role-based-access-control)
4. [Getting Started](#getting-started)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Deployment](#deployment)
8. [API Documentation](#api-documentation)
9. [Offline Mode](#offline-mode)
10. [Payment Integration](#payment-integration)

---

## 🎯 System Overview

Martly is an enterprise-grade point-of-sale and inventory management system designed for modern businesses. The system supports multi-tenancy, offline operations, and comprehensive role-based permissions.

### Key Features

✅ **Multi-Tenant Architecture** - Separate data for each business  
✅ **4 User Roles** - SuperAdmin, TenantAdmin, StoreManager, Cashier  
✅ **Complete RBAC** - Fine-grained permission system  
✅ **Offline Support** - Queue-based sync when offline  
✅ **Email Verification** - Secure signup flow  
✅ **Payment Gateways** - Stripe & Paystack integration  
✅ **Real-time Analytics** - Role-based dashboards  
✅ **Redis Caching** - High-performance data access  
✅ **Mobile Responsive** - Works on all devices  
✅ **Professional Branding** - Martly design system  

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- NestJS (Node.js framework)
- Prisma ORM
- MongoDB (Database)
- Redis (Caching)
- JWT (Authentication)
- Argon2 (Password hashing)
- Nodemailer (Email)
- Twilio (SMS)

**Frontend:**
- React 18.3
- TypeScript
- Tailwind CSS v4
- Vite (Build tool)
- ShadcN UI Components
- Recharts (Analytics)

### Project Structure

```
martly-complete-system/
├── backend/                 # NestJS API
│   ├── prisma/             # Database schema
│   ├── src/
│   │   ├── auth/           # Authentication & RBAC
│   │   ├── users/          # User management
│   │   ├── tenants/        # Tenant management
│   │   ├── products/       # Product module
│   │   ├── orders/         # Order processing
│   │   ├── offline-sync/   # Offline sync
│   │   └── ...             # Other modules
│   ├── .env.example
│   └── package.json
│
├── frontend/               # React app (current directory)
│   ├── components/
│   ├── lib/
│   ├── styles/
│   └── ...
│
└── docs/                   # Documentation
```

---

## 🔐 Role-Based Access Control

### 1. SuperAdmin (Martly Internal Staff)

**Full Platform Control**

Access:
- ✅ Tenant Management (view all, disable, modify plans)
- ✅ Pricing Plans (create, edit, disable)
- ✅ Payment Methods (configure, enable/disable globally)
- ✅ Platform Analytics
- ✅ System Settings

Cannot Access:
- ❌ Individual store operations
- ❌ POS transactions

Use Cases:
- Monitor tenant usage
- Adjust subscription pricing
- Enable new payment gateways
- Platform maintenance

---

### 2. TenantAdmin (Business Owner)

**Company-Wide Management**

Access:
- ✅ Dashboard (all stores)
- ✅ Products (all stores)
- ✅ Categories & Suppliers
- ✅ Product Transfers (approve/reject)
- ✅ Low Stock Alerts (all stores)
- ✅ Orders (all stores)
- ✅ Tax Management
- ✅ Employees (all stores)
- ✅ Customers (company-wide)
- ✅ Debt Management (all stores)
- ✅ Settings (company-wide)
- ✅ Payment Methods (enable from available list)
- ✅ Subscription Management (upgrade/downgrade plans)

Cannot Access:
- ❌ Other tenants' data
- ❌ Global payment method configuration
- ❌ Platform pricing plans

Use Cases:
- Manage multiple store locations
- Approve product transfers between stores
- View consolidated reports
- Manage company employees
- Configure payment options for the business

---

### 3. StoreManager

**Single Store Management**

Access:
- ✅ Dashboard (own store only)
- ✅ Products (own store)
- ✅ Categories & Suppliers
- ✅ Low Stock Alerts (own store)
- ✅ Orders (own store)
- ✅ Tax Management
- ✅ Employees (own store - add/view/edit)
- ✅ Customers
- ✅ Debt Management (own store)
- ✅ Product Transfer Requests (must be approved by TenantAdmin)
- ✅ Settings (password, appearance, language, offline mode)

Cannot Access:
- ❌ Other stores' data
- ❌ Approve product transfers
- ❌ Company-wide settings
- ❌ Payment method configuration

Use Cases:
- Daily store operations
- Request stock from other stores
- Monitor store performance
- Manage store staff
- Track store-specific debts

---

### 4. Cashier/Teller

**Point of Sale Operations**

Access:
- ✅ Point of Sale (POS)
- ✅ Dashboard (personal performance only)
- ✅ Debt Management (own transactions only)
- ✅ Stock Alerts (own store)
- ✅ Personal Performance Reports
- ✅ Settings (password, appearance, language)

Cannot Access:
- ❌ Product management
- ❌ Employee management
- ❌ Other cashiers' transactions
- ❌ Store settings
- ❌ Company data

Use Cases:
- Process sales
- Manage customer credit/debt for own sales
- View own performance metrics
- Check stock availability

---

## 🚀 Getting Started

### System Requirements

- **Node.js**: 18.0 or higher
- **MongoDB**: 6.0 or higher
- **Redis**: 7.0 or higher
- **npm** or **yarn**
- **Git**

### Quick Start (Development)

```bash
# 1. Clone repository
git clone <repository-url>
cd martly-complete-system

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run prisma:generate
npm run prisma:push
npm run start:dev

# 3. Setup Frontend (in new terminal)
cd frontend
npm install
npm run dev

# 4. Access Application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001/api/v1
# API Docs: http://localhost:3001/api/docs
```

---

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/martly"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Email (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
EMAIL_FROM="noreply@martly.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Paystack
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."

# App URLs
APP_URL="http://localhost:5173"
API_URL="http://localhost:3001"
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to MongoDB
npm run prisma:push

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Start Backend

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Backend will run on: `http://localhost:3001`

---

## 💻 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend  # (or stay in root if backend is separate)
npm install
```

### 2. Configure API Endpoint

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

### 3. Fix Imports

```bash
# Mac/Linux
chmod +x fix-imports.sh
./fix-imports.sh

# Windows
powershell -ExecutionPolicy Bypass -File fix-imports.ps1
```

### 4. Start Frontend

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📱 User Flow

### New Tenant Registration

1. Visit landing page
2. Click "Get Started"
3. Fill registration form:
   - Business Name
   - Full Name
   - Email
   - Phone
   - Select Plan (Starter/Professional/Enterprise)
4. Click "Start Free Trial"
5. Check email for verification link
6. Click verification link
7. Set password
8. Automatically logged in

### User Login

1. Click "Login" on landing page
2. Enter email and password
3. System checks:
   - Valid credentials
   - Email verified
   - Account active
   - Role-based access
4. Redirect to appropriate dashboard

### Dashboard Views (by Role)

**SuperAdmin:**
- Platform overview
- All tenants list
- Usage statistics
- Revenue metrics

**TenantAdmin:**
- Multi-store analytics
- Sales trends (all stores)
- Inventory levels (all stores)
- Employee performance (all stores)

**StoreManager:**
- Single store analytics
- Store sales
- Store inventory
- Store employees

**Cashier:**
- Personal performance
- Today's sales
- Own engagement time
- Own transaction history

---

## 🌐 API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "businessName": "My Store",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "plan": "professional"
}
```

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "your-password"
}

Response:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "...",
    "role": "TENANT_ADMIN",
    "tenant": {...},
    "store": {...}
  }
}
```

### Protected Endpoints

All protected endpoints require JWT token:

```http
GET /api/v1/products
Authorization: Bearer your-jwt-token
```

### Role-Based Filtering

The API automatically filters data based on user role:

- **SuperAdmin**: Sees all tenants
- **TenantAdmin**: Sees all stores in their tenant
- **StoreManager**: Sees only their store
- **Cashier**: Sees only relevant POS data

---

## 📴 Offline Mode

### How It Works

1. **Cache Essential Data**
   - Products (with prices)
   - Inventory levels
   - Recent customers
   - Store settings

2. **Queue Operations**
   - Sales transactions
   - Inventory updates
   - Customer changes

3. **Auto-Sync**
   - Detects when online
   - Processes queue
   - Updates cache
   - Resolves conflicts

### Implementation

**Frontend (IndexedDB):**

```typescript
// Store offline transaction
await offlineDB.transactions.add({
  id: generateId(),
  type: 'sale',
  data: orderData,
  timestamp: Date.now(),
  synced: false
});

// Sync when online
if (navigator.onLine) {
  const pending = await offlineDB.transactions
    .where('synced').equals(false)
    .toArray();
    
  for (const item of pending) {
    await api.post('/offline-sync/queue', item);
    await offlineDB.transactions.update(item.id, { synced: true });
  }
}
```

**Backend (Redis Queue):**

```typescript
// Queue for processing
POST /api/v1/offline-sync/queue
{
  "entity": "orders",
  "operation": "create",
  "data": {...}
}

// Process queue
POST /api/v1/offline-sync/process
```

### Conflict Resolution

- **Last Write Wins**: Recent update takes precedence
- **Quantity Conflicts**: Sum operations (inventory)
- **Validation**: Server validates before applying

---

## 💳 Payment Integration

### Stripe (International)

```typescript
// Configure in backend
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

// Process payment
POST /api/v1/payments/stripe
{
  "amount": 10000,  // in cents
  "currency": "usd",
  "orderId": "...",
  "paymentMethodId": "pm_..."
}
```

### Paystack (Africa)

```typescript
// Configure in backend
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...

// Process payment
POST /api/v1/payments/paystack
{
  "amount": 10000,  // in kobo
  "email": "customer@example.com",
  "orderId": "..."
}
```

### Payment Flow

1. Customer selects payment method
2. Frontend initiates payment
3. Payment gateway processes
4. Webhook confirms payment
5. Order status updated
6. Receipt generated

---

## 🚀 Deployment

### Backend Deployment

**Option 1: Docker**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

```bash
docker build -t martly-backend .
docker run -p 3001:3001 --env-file .env martly-backend
```

**Option 2: Railway/Render/Heroku**

1. Connect GitHub repository
2. Set environment variables
3. Deploy backend folder
4. Configure MongoDB and Redis add-ons

---

### Frontend Deployment

**Option 1: Vercel (Recommended)**

```bash
cd frontend
npm install -g vercel
vercel
```

**Option 2: Netlify**

```bash
npm run build
# Upload dist/ folder to Netlify
```

**Option 3: Docker**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Environment Variables for Production

**Backend:**
- Use strong `JWT_SECRET` (min 32 characters)
- Use production MongoDB (Atlas recommended)
- Use production Redis (Redis Cloud)
- Configure real SMTP server
- Use live payment API keys
- Enable HTTPS
- Set `NODE_ENV=production`

**Frontend:**
- Update `VITE_API_URL` to production API
- Configure CDN for assets
- Enable gzip compression
- Set up custom domain

---

## 📊 Monitoring & Analytics

### Health Checks

```http
GET /api/v1/health

Response:
{
  "status": "ok",
  "database": "connected",
  "redis": "connected",
  "uptime": 123456
}
```

### Logging

- Winston logger configured
- Logs saved to files
- Error tracking
- Performance metrics

### Analytics

Each role sees different analytics:

- **SuperAdmin**: Platform-wide metrics
- **TenantAdmin**: Company metrics
- **StoreManager**: Store metrics
- **Cashier**: Personal metrics

---

## 🔒 Security Best Practices

✅ **Password Hashing**: Argon2 (more secure than bcrypt)  
✅ **JWT Tokens**: Short expiry, refresh tokens  
✅ **Rate Limiting**: Prevent brute force  
✅ **Input Validation**: All endpoints validated  
✅ **SQL Injection**: Prisma prevents by default  
✅ **XSS Protection**: Helmet middleware  
✅ **CORS**: Configured origins  
✅ **HTTPS**: Enforced in production  
✅ **Email Verification**: Required before access  
✅ **Role Validation**: Every endpoint checks permissions  

---

## 🆘 Troubleshooting

### Backend Won't Start

```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ping')"

# Check Redis connection
redis-cli ping

# Regenerate Prisma client
npm run prisma:generate

# Check environment variables
cat .env
```

### Frontend Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Fix imports
./fix-imports.sh

# Check API connection
curl http://localhost:3001/api/v1/health
```

### Database Issues

```bash
# Reset database (CAUTION: deletes all data)
npm run prisma:push --force-reset

# View database in Prisma Studio
npm run prisma:studio
```

---

## 📚 Additional Resources

- **API Docs**: http://localhost:3001/api/docs (Swagger)
- **Prisma Docs**: https://www.prisma.io/docs
- **NestJS Docs**: https://docs.nestjs.com
- **React Docs**: https://react.dev

---

## 🎉 Success Checklist

- [ ] MongoDB installed and running
- [ ] Redis installed and running
- [ ] Backend .env configured
- [ ] Database schema pushed
- [ ] Backend running on :3001
- [ ] Frontend dependencies installed
- [ ] Imports fixed
- [ ] Frontend running on :5173
- [ ] Can register new tenant
- [ ] Email verification works
- [ ] Can login with all roles
- [ ] POS system works
- [ ] Offline mode tested
- [ ] Payments configured

---

**Martly v2.0** - Smart Sales. Simple Control. 🚀

*Enterprise-grade inventory management for modern businesses.*

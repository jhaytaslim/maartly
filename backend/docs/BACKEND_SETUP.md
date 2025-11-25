# 🚀 Maartly Backend - Quick Setup Guide

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ MongoDB 6.0+ installed or MongoDB Atlas account
- ✅ Redis 7.0+ installed or Redis Cloud account
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

## 🎯 Quick Start (5 Minutes)

```bash
# 1. Install Dependencies (2 min)
npm install

# 2. Setup Environment
cp .env.example .env
# Edit .env with your credentials (see below)

# 3. Setup Database (1 min)
npm run prisma:generate
npm run prisma:push

# 4. Start Development Server (30 sec)
npm run start:dev

# ✅ Done! Backend running on http://localhost:3001
```

## ⚙️ Environment Configuration

### Minimum Required Configuration

Edit `.env` file:

```env
# Database (REQUIRED)
DATABASE_URL="mongodb://localhost:27017/maartly"

# JWT (REQUIRED - Change this!)
JWT_SECRET="CHANGE-THIS-TO-A-SECURE-RANDOM-STRING-MIN-32-CHARS"
JWT_EXPIRES_IN="7d"

# Redis (REQUIRED for caching)
REDIS_HOST="localhost"
REDIS_PORT=6379

# Application
NODE_ENV="development"
PORT=3001
APP_URL="http://localhost:5173"
```

### Email Configuration (For signup verification)

**Using Gmail:**

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"  # Not your regular password!
EMAIL_FROM="noreply@maartly.com"
```

**Get Gmail App Password:**
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate
4. Copy 16-character password to `SMTP_PASS`

### SMS Configuration (Optional)

```env
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Payment Gateways (Optional for testing)

**Stripe:**
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**Paystack:**
```env
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

**Install MongoDB:**

```bash
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**Connection String:**
```env
DATABASE_URL="mongodb://localhost:27017/maartly"
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update .env:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/maartly?retryWrites=true&w=majority"
```

### Option 3: Docker

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Connection string
DATABASE_URL="mongodb://localhost:27017/maartly"
```

## 🔴 Redis Setup

### Option 1: Local Redis

**Install Redis:**

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Test
redis-cli ping  # Should return PONG
```

### Option 2: Redis Cloud (Recommended for Production)

1. Create account at https://redis.com/cloud
2. Create database
3. Get connection details
4. Update .env:

```env
REDIS_HOST="redis-12345.c123.us-east-1.redislabs.com"
REDIS_PORT=12345
REDIS_PASSWORD="your-redis-password"
```

### Option 3: Docker

```bash
# Run Redis in Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Test
docker exec -it redis redis-cli ping
```

## 🔧 Development Commands

```bash
# Development
npm run start:dev          # Start with hot-reload

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:push        # Push schema to database
npm run prisma:studio      # Open database GUI

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Test coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 📡 Verify Installation

### 1. Check Backend is Running

```bash
curl http://localhost:3001/api/v1/health

# Expected response:
# {"status":"ok","database":"connected","redis":"connected"}
```

### 2. View API Documentation

Open browser: http://localhost:3001/api/docs

### 3. Test Endpoints

```bash
# Test signup
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Store",
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@example.com",
    "phone": "+1234567890",
    "plan": "professional"
  }'
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

```bash
# Check MongoDB is running
mongosh  # or mongo

# If not running:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Check connection string in .env
echo $DATABASE_URL
```

### "Cannot connect to Redis"

```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# If not running:
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### "Prisma Client not generated"

```bash
# Regenerate Prisma client
npm run prisma:generate

# If that fails, delete and reinstall
rm -rf node_modules
npm install
npm run prisma:generate
```

### "Port 3001 already in use"

```bash
# Find process using port
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=3002
```

### "Email not sending"

```bash
# Test email configuration
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── auth/               # Authentication & RBAC
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── guards/         # JWT, Local, Roles guards
│   │   ├── strategies/     # Passport strategies
│   │   └── decorators/     # Custom decorators
│   ├── users/              # User management
│   ├── tenants/            # Tenant management
│   ├── products/           # Products module
│   ├── orders/             # Orders module
│   ├── offline-sync/       # Offline sync
│   ├── notifications/      # Email/SMS
│   ├── prisma/             # Prisma service
│   ├── app.module.ts       # Root module
│   └── main.ts             # Bootstrap
├── .env.example            # Environment template
├── .env                    # Your environment (create this)
├── package.json
└── tsconfig.json
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string (32+ characters)
- [ ] Use production database (MongoDB Atlas)
- [ ] Use production Redis (Redis Cloud)
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Use real email service (not Gmail for production)
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Use live payment API keys (not test keys)

## 📊 Database Schema

The system includes:

- **Users** - System users with roles (SuperAdmin, TenantAdmin, StoreManager, Cashier)
- **Tenants** - Companies/businesses with subscription plans
- **Stores** - Physical store locations
- **Products** - Products with inventory tracking
- **Inventory** - Stock levels per store per product
- **Orders** - Sales transactions
- **Customers** - Customer database
- **OfflineSync** - Queue for offline operations

View schema: `backend/prisma/schema.prisma`

## 🚀 Next Steps

1. ✅ Backend running? Great!
2. 📱 Now setup the frontend (see `/COMPLETE_SYSTEM_GUIDE.md`)
3. 🧪 Test API with Swagger docs: http://localhost:3001/api/docs
4. 📧 Configure email for signup flow
5. 💳 Add payment gateway credentials (optional)
6. 🚀 Deploy to production

## 🆘 Need Help?

- **API Documentation**: http://localhost:3001/api/docs
- **Prisma Studio**: `npm run prisma:studio`
- **Logs**: Check console output for errors
- **Database**: View with Prisma Studio or MongoDB Compass

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Redis Documentation](https://redis.io/documentation)

---

**Backend setup complete!** 🎉

Now start the frontend and begin building your business with Maartly.

*Smart Sales. Simple Control.*

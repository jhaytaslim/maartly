# 🚀 Maartly Backend - Quick Start Guide

Get your Maartly backend up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB, Redis, and RabbitMQ (or Docker)

## Option 1: Quick Start with Docker (Recommended)

### Step 1: Start Services

```bash
cd backend
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Redis on port 6379
- RabbitMQ on ports 5672 (AMQP) and 15672 (Management UI)
- Mongo Express on port 8081 (Database UI)

### Step 2: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and update these lines for Docker:
# DATABASE_URL="mongodb://maartly:maartly_password@localhost:27017/maartly?authSource=admin"
# REDIS_PASSWORD=maartly_redis_password
# RABBITMQ_URL=amqp://maartly:maartly_rabbitmq_password@localhost:5672/maartly
```

### Step 3: Install & Run

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Initialize database
npx prisma db push

# Start development server
npm run start:dev
```

✅ **Backend running at:** `http://localhost:3000/api/v1`

### Step 4: Test API

```bash
# Linux/Mac
chmod +x test-api.sh
./test-api.sh

# Windows PowerShell
.\test-api.ps1
```

---

## Option 2: Manual Setup (Without Docker)

### Step 1: Install Services

**MongoDB:**
- Download from https://www.mongodb.com/try/download/community
- Start: `mongod`

**Redis:**
- Download from https://redis.io/download
- Start: `redis-server`

**RabbitMQ:**
- Download from https://www.rabbitmq.com/download.html
- Start: `rabbitmq-server`

### Step 2: Setup Environment

```bash
cp .env.example .env
```

Default `.env` values should work for local installation.

### Step 3: Install & Run

```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

---

## 🧪 Testing

### Run Test Script

```bash
# Linux/Mac
./test-api.sh

# Windows
.\test-api.ps1
```

### Manual Test

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register admin
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maartly.com",
    "password": "SecurePassword123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "superAdmin"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maartly.com",
    "password": "SecurePassword123!"
  }'
```

---

## 🌐 Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Backend API | http://localhost:3000/api/v1 | - |
| RabbitMQ Management | http://localhost:15672 | maartly / maartly_rabbitmq_password |
| Mongo Express | http://localhost:8081 | admin / admin123 |

---

## 📝 Common Commands

```bash
# Development with hot reload
npm run start:dev

# Production build
npm run build

# Start production server
npm run start:prod

# View logs (if using PM2)
pm2 logs maartly-backend

# Stop all Docker services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View Docker logs
docker-compose logs -f

# Restart a specific service
docker-compose restart mongodb
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change PORT in .env
```

### Cannot Connect to MongoDB

```bash
# Check if MongoDB is running
docker ps  # If using Docker
ps aux | grep mongo  # If local installation

# Test connection
mongosh mongodb://localhost:27017
```

### Prisma Errors

```bash
# Clear and regenerate
rm -rf node_modules
npm install
npx prisma generate
npx prisma db push
```

### RabbitMQ Connection Failed

```bash
# Check RabbitMQ status
docker logs maartly-rabbitmq  # Docker
rabbitmqctl status  # Local installation

# Verify credentials in .env match docker-compose.yml
```

---

## 📚 Next Steps

1. ✅ Backend is running
2. 📖 Read [BACKEND_INTEGRATION_COMPLETE.md](../BACKEND_INTEGRATION_COMPLETE.md) for full documentation
3. 🔗 Connect frontend to backend
4. 🧪 Run integration tests
5. 🚀 Deploy to production

---

## 🆘 Need Help?

- Review [BACKEND_INTEGRATION_COMPLETE.md](../BACKEND_INTEGRATION_COMPLETE.md)
- Check logs: `docker-compose logs -f` or `npm run start:dev`
- Verify all services are running: `docker ps`
- Test individual endpoints with curl or Postman

---

## 🎉 Success!

If you can:
- ✅ Access http://localhost:3000/api/v1/health
- ✅ Login and get an access token
- ✅ Create products, orders, etc.

You're ready to integrate with the frontend! 🚀

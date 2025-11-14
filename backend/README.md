# Maartly Backend API

**Smart Sales. Simple Control.** - Production-ready NestJS backend with MongoDB, Prisma, Redis caching, and comprehensive RBAC.

## 🚀 Features

- ✅ **NestJS** - Scalable server-side framework
- ✅ **Prisma + MongoDB** - Type-safe database access
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Argon2** - Password hashing
- ✅ **RBAC** - Role-based access control (4 roles)
- ✅ **Redis Caching** - High-performance caching
- ✅ **Email** - Nodemailer integration
- ✅ **SMS** - Twilio integration
- ✅ **Payment Gateways** - Stripe & Paystack
- ✅ **Offline Sync** - Queue-based sync system
- ✅ **Swagger** - Auto-generated API docs
- ✅ **Rate Limiting** - DDoS protection
- ✅ **Security** - Helmet, CORS, validation

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Redis 7.0+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Update .env with your credentials

# 4. Generate Prisma client
npm run prisma:generate

# 5. Push database schema
npm run prisma:push

# 6. Start development server
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3001/api/v1
- **Docs**: http://localhost:3001/api/docs

## 🔐 User Roles & Permissions

### SuperAdmin (Maartly Internal)
- Manage all tenants
- Configure pricing plans
- Enable/disable payment methods
- View platform analytics
- Adjust tenant limits

### TenantAdmin (Business Owner)
- Full access to company data
- Manage all stores
- Configure payment methods (from enabled list)
- Manage employees & customers
- View all reports
- Change subscription plan

### StoreManager
- Manage single store
- Products, inventory, orders
- Manage store employees
- Request product transfers (requires approval)
- View store reports

### Cashier/Teller
- Point of Sale operations
- View personal performance
- Manage customer debts (for own transactions)
- View stock alerts
- Basic settings

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/signup          - Register new tenant
POST   /api/v1/auth/login           - Login
POST   /api/v1/auth/verify-email    - Verify email & set password
POST   /api/v1/auth/forgot-password - Request password reset
POST   /api/v1/auth/reset-password  - Reset password
```

### Users
```
GET    /api/v1/users                - List users (role-based)
GET    /api/v1/users/:id            - Get user details
POST   /api/v1/users                - Create user
PATCH  /api/v1/users/:id            - Update user
DELETE /api/v1/users/:id            - Delete user
```

### Products
```
GET    /api/v1/products             - List products
GET    /api/v1/products/:id         - Get product
POST   /api/v1/products             - Create product
PATCH  /api/v1/products/:id         - Update product
DELETE /api/v1/products/:id         - Delete product
POST   /api/v1/products/:id/qr      - Generate QR code
```

### Orders
```
GET    /api/v1/orders               - List orders
GET    /api/v1/orders/:id           - Get order
POST   /api/v1/orders               - Create order
PATCH  /api/v1/orders/:id           - Update order
DELETE /api/v1/orders/:id           - Cancel order
```

### Offline Sync
```
POST   /api/v1/offline-sync/queue   - Queue offline data
POST   /api/v1/offline-sync/process - Process sync queue
GET    /api/v1/offline-sync/cached-data - Get cached data
```

For complete API documentation, visit: http://localhost:3001/api/docs

## 🗄️ Database Schema

### Key Models

- **User** - System users with roles
- **Tenant** - Companies/businesses
- **Store** - Physical store locations
- **Product** - Products with inventory tracking
- **Inventory** - Stock levels per store
- **Order** - Sales transactions
- **Customer** - Customer management
- **OfflineSync** - Offline operation queue

See `/backend/prisma/schema.prisma` for complete schema.

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/maartly"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
PAYSTACK_SECRET_KEY="sk_test_..."
```

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build image
docker build -t maartly-backend .

# Run container
docker run -p 3001:3001 --env-file .env maartly-backend
```

### Traditional Hosting

```bash
# Build
npm run build

# Start production
npm run start:prod
```

### Environment Setup

1. **MongoDB**: Use MongoDB Atlas or self-hosted
2. **Redis**: Use Redis Cloud or self-hosted
3. **Email**: Configure SMTP (Gmail, SendGrid, etc.)
4. **SMS**: Setup Twilio account
5. **Payments**: Get API keys from Stripe/Paystack

## 📚 Additional Modules

The following modules are stubbed and ready for implementation:

- `users` - User management
- `tenants` - Tenant/company management  
- `products` - Product CRUD
- `categories` - Category management
- `suppliers` - Supplier management
- `stores` - Store management
- `inventory` - Inventory tracking
- `orders` - Order processing
- `payments` - Payment gateway integration
- `customers` - Customer CRM
- `employees` - Employee management
- `debts` - Debt tracking
- `transfers` - Product transfers
- `taxes` - Tax management
- `dashboard` - Analytics & reports

Each module follows the same pattern:
- Module file
- Service (business logic)
- Controller (routes)
- DTOs (validation)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Performance

### Caching Strategy

- **Redis** caches frequently accessed data
- **Offline data** cached for 1 hour
- **User sessions** cached
- **Product lists** cached per store

### Optimizations

- Database indexes on frequently queried fields
- Pagination for list endpoints
- Lazy loading of relations
- Connection pooling
- Compression middleware

## 🔒 Security

- **Helmet** - Security headers
- **CORS** - Configured cross-origin requests
- **Rate Limiting** - Prevent abuse
- **Validation** - Input sanitization
- **JWT** - Secure authentication
- **Argon2** - Strong password hashing
- **HTTPS** - Enforced in production

## 📈 Monitoring

### Health Check

```
GET /api/v1/health
```

### Metrics

- Request rate
- Response time
- Error rate
- Database connections
- Cache hit rate

## 🛠️ Development

### Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── auth/               # Authentication module
│   ├── users/              # User management
│   ├── tenants/            # Tenant management
│   ├── products/           # Product module
│   ├── orders/             # Order processing
│   ├── offline-sync/       # Offline sync
│   ├── notifications/      # Email/SMS
│   ├── prisma/             # Database service
│   ├── app.module.ts       # Root module
│   └── main.ts             # Bootstrap file
├── .env.example            # Environment template
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

### Adding a New Module

```bash
# Generate module
nest g module module-name

# Generate service
nest g service module-name

# Generate controller
nest g controller module-name
```

## 🤝 Contributing

1. Follow NestJS best practices
2. Add tests for new features
3. Update API documentation
4. Follow TypeScript strict mode

## 📝 License

MIT License - see LICENSE file

## 🆘 Support

- **Docs**: http://localhost:3001/api/docs
- **Issues**: GitHub issues
- **Email**: support@maartly.com

---

**Maartly Backend v2.0** - Smart Sales. Simple Control. 🚀

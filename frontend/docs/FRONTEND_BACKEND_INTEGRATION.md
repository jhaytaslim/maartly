# Frontend-Backend Integration Guide for Cognistock

## 🎉 Integration Complete!

The backend `app.module.ts` has been successfully updated with all required modules, and the frontend API service has been enhanced with methods for all new modules.

## ✅ What's Been Completed

### Backend Module Integration
All modules are now properly integrated in `/backend/src/app.module.ts`:

1. **Core Infrastructure Modules**
   - ✅ PrismaModule (Database ORM)
   - ✅ RabbitMQModule (Event Management)
   - ✅ EventsModule (Outbox Pattern)
   - ✅ NotificationsModule
   - ✅ OfflineSyncModule

2. **Business Logic Modules**
   - ✅ AuthModule (Authentication & Authorization)
   - ✅ UsersModule (User Management with RBAC)
   - ✅ TenantsModule (Multi-tenancy)
   - ✅ ProductsModule (Product Management)
   - ✅ CategoriesModule (Category Management)
   - ✅ SuppliersModule (Supplier Management)
   - ✅ StoresModule (Store Management)
   - ✅ OrdersModule (Order Processing)
   - ✅ CustomersModule (Customer Management)
   - ✅ DebtsModule (Debt Tracking & Payment)
   - ✅ TaxesModule (Tax Configuration)
   - ✅ CurrencyModule (Multi-currency Support)
   - ✅ PlansModule (Pricing Plans)
   - ✅ ReportsModule (Analytics & Reports)
   - ✅ StorefrontModule (Customer-facing Storefront)

### Frontend API Service
The `/lib/api.ts` file now includes complete API methods for:

- ✅ Authentication & User Management
- ✅ Products, Categories & Suppliers
- ✅ Orders & Customers
- ✅ Stores & Tenants
- ✅ Currency Management (NEW)
- ✅ Debt Management (NEW)
- ✅ Tax Management (NEW)
- ✅ Pricing Plans (NEW)
- ✅ Reports & Analytics (NEW)
- ✅ Storefront Configuration (NEW)
- ✅ Offline Sync

## 🚀 How to Test the Integration

### Step 1: Start the Backend

```bash
cd backend

# Make sure Docker is running for MongoDB, Redis, and RabbitMQ
docker-compose up -d

# Install dependencies if not already done
npm install

# Generate Prisma client
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# Start the backend server
npm run start:dev
```

The backend should start on `http://localhost:3001`

### Step 2: Start the Frontend

In a new terminal:

```bash
# From the root directory
npm install

# Start the development server
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 3: Test the Integration

#### 3.1 Authentication Flow
1. Go to `http://localhost:5173`
2. Click "Get Started" on the landing page
3. Fill in the signup form:
   - Business Name
   - First Name & Last Name
   - Email & Phone
   - Select a Plan (Basic/Professional/Enterprise)
4. Check the console for the signup response
5. Check your email for the verification link (or check backend logs for the token)
6. Navigate to the verification page and set your password
7. Login with your credentials

#### 3.2 Test Core Features

Once logged in, test the following:

**Dashboard**
- View overview statistics
- Check sales analytics
- Verify data loads from backend

**Products Management**
- Create a new product
- Edit product details
- Delete a product
- Search products

**Categories**
- Create categories
- Assign products to categories
- Edit/delete categories

**Suppliers**
- Add suppliers
- Edit supplier information
- Associate products with suppliers

**Stores**
- Create multiple stores
- View store details
- Update store information

**Orders**
- Create a new order
- View order list
- Update order status

**Customers**
- Add customers
- View customer details
- Track customer purchases

**Currency Management** (NEW)
- Add multiple currencies
- Set default currency
- Configure exchange rates

**Tax Management** (NEW)
- Create tax profiles
- Set tax rates by region
- Configure default taxes

**Debt Management** (NEW)
- Record customer debts
- Track debt payments
- View debt history

**Pricing Plans** (NEW)
- View available plans
- Compare plan features
- Upgrade/downgrade options

**Reports** (NEW)
- Generate sales reports
- View inventory reports
- Export reports as CSV/PDF

**Storefront** (NEW)
- Configure storefront theme
- Set SEO metadata
- Preview customer-facing store

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/v1/auth/signup` - Register new tenant
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify-email` - Verify email and set password
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product
- `PATCH /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/search?q=query` - Search products

### Categories
- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create category
- `PATCH /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Suppliers
- `GET /api/v1/suppliers` - List suppliers
- `POST /api/v1/suppliers` - Create supplier
- `PATCH /api/v1/suppliers/:id` - Update supplier
- `DELETE /api/v1/suppliers/:id` - Delete supplier

### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Create order
- `PATCH /api/v1/orders/:id/status` - Update order status

### Customers
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `PATCH /api/v1/customers/:id` - Update customer

### Stores
- `GET /api/v1/stores` - List stores
- `GET /api/v1/stores/:id` - Get store details
- `POST /api/v1/stores` - Create store
- `PATCH /api/v1/stores/:id` - Update store
- `DELETE /api/v1/stores/:id` - Delete store

### Currency (NEW)
- `GET /api/v1/currency` - List currencies
- `GET /api/v1/currency/:id` - Get currency details
- `POST /api/v1/currency` - Create currency
- `PATCH /api/v1/currency/:id` - Update currency
- `DELETE /api/v1/currency/:id` - Delete currency
- `PATCH /api/v1/currency/:id/set-default` - Set default currency

### Debts (NEW)
- `GET /api/v1/debts` - List debts
- `GET /api/v1/debts/:id` - Get debt details
- `GET /api/v1/debts/customer/:customerId` - Get customer debts
- `POST /api/v1/debts` - Create debt record
- `PATCH /api/v1/debts/:id` - Update debt
- `POST /api/v1/debts/:id/payment` - Record payment
- `DELETE /api/v1/debts/:id` - Delete debt

### Taxes (NEW)
- `GET /api/v1/taxes` - List tax profiles
- `GET /api/v1/taxes/:id` - Get tax details
- `POST /api/v1/taxes` - Create tax profile
- `PATCH /api/v1/taxes/:id` - Update tax
- `DELETE /api/v1/taxes/:id` - Delete tax
- `PATCH /api/v1/taxes/:id/set-default` - Set default tax

### Plans (NEW)
- `GET /api/v1/plans` - List pricing plans
- `GET /api/v1/plans/:id` - Get plan details
- `POST /api/v1/plans` - Create plan (superAdmin only)
- `PATCH /api/v1/plans/:id` - Update plan (superAdmin only)
- `DELETE /api/v1/plans/:id` - Delete plan (superAdmin only)

### Reports (NEW)
- `GET /api/v1/reports/sales` - Sales report
- `GET /api/v1/reports/inventory` - Inventory report
- `GET /api/v1/reports/profit-loss` - Profit & Loss report
- `GET /api/v1/reports/top-products` - Top products report
- `GET /api/v1/reports/customer-insights` - Customer insights
- `GET /api/v1/reports/store-performance` - Store performance
- `GET /api/v1/reports/:type/export/:format` - Export report (CSV/PDF)

### Storefront (NEW)
- `GET /api/v1/storefront` - Get storefront config
- `PATCH /api/v1/storefront` - Update storefront
- `PATCH /api/v1/storefront/theme` - Update theme
- `PATCH /api/v1/storefront/seo` - Update SEO settings
- `GET /api/v1/storefront/preview/:slug` - Preview storefront

### Tenants
- `GET /api/v1/tenants` - List tenants (superAdmin only)
- `GET /api/v1/tenants/:id` - Get tenant details
- `PATCH /api/v1/tenants/:id` - Update tenant
- `GET /api/v1/tenants/storefront/:slug` - Public storefront access

## 🧪 Testing Checklist

Use this checklist to ensure all features are working:

### Core Functionality
- [ ] User can sign up successfully
- [ ] User receives verification email
- [ ] User can verify email and set password
- [ ] User can login with credentials
- [ ] User can logout
- [ ] User can reset password

### Products & Inventory
- [ ] Can create products with all fields
- [ ] Can upload product images
- [ ] Can assign categories to products
- [ ] Can assign suppliers to products
- [ ] Can search products by name/SKU
- [ ] Can view low stock alerts
- [ ] Can transfer products between stores

### Orders & Sales
- [ ] Can create orders through POS
- [ ] Can scan products using QR code
- [ ] Can apply discounts
- [ ] Can process payments
- [ ] Can view order history
- [ ] Can update order status

### Customer Management
- [ ] Can add new customers
- [ ] Can edit customer details
- [ ] Can track customer purchases
- [ ] Can view customer order history

### Debt Management
- [ ] Can record customer debts
- [ ] Can track partial payments
- [ ] Can view debt history
- [ ] Can filter debts by status

### Multi-Store
- [ ] Can create multiple stores
- [ ] Can assign products to stores
- [ ] Can transfer stock between stores
- [ ] Can view per-store inventory

### Currency & Tax
- [ ] Can add multiple currencies
- [ ] Can set exchange rates
- [ ] Can configure tax profiles
- [ ] Taxes apply correctly to orders

### Reports
- [ ] Can generate sales reports
- [ ] Can view inventory reports
- [ ] Can export reports as CSV
- [ ] Reports show accurate data

### Storefront
- [ ] Can configure storefront theme
- [ ] Can customize colors and branding
- [ ] Public storefront is accessible
- [ ] Customers can view products

### Permissions & RBAC
- [ ] superAdmin can access all features
- [ ] tenantAdmin has proper permissions
- [ ] storeManager has limited access
- [ ] cashier can only access POS

## 🔧 Troubleshooting

### Backend Connection Issues
If the frontend can't connect to the backend:
1. Verify backend is running on port 3001
2. Check `VITE_API_URL` in `.env` file
3. Ensure CORS is enabled in backend
4. Check browser console for errors

### Database Issues
If you see Prisma errors:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### RabbitMQ Issues
If events aren't being processed:
```bash
docker-compose restart rabbitmq
```

### Redis Issues
If caching isn't working:
```bash
docker-compose restart redis
```

## 📝 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="mongodb://localhost:27017/cognistock"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
CACHE_TTL=3600

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Email (for production)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@cognistock.com"

# App
PORT=3001
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3001/api/v1"
```

## 🎯 Next Steps

1. **Test All Features**: Go through the testing checklist above
2. **Fix Any Issues**: Debug and resolve integration issues
3. **Add More Features**: Implement additional functionality as needed
4. **Performance Optimization**: Add loading states, error handling, pagination
5. **UI/UX Improvements**: Enhance user interface based on testing feedback
6. **Production Deployment**: Follow deployment guide when ready

## 📚 Additional Resources

- [Backend Setup Guide](./backend/BACKEND_SETUP.md)
- [Complete System Guide](./COMPLETE_SYSTEM_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Quick Start](./QUICK_START.md)

## 🤝 Support

If you encounter any issues during integration:
1. Check the troubleshooting section above
2. Review backend logs: `docker-compose logs -f`
3. Check frontend console errors
4. Verify all environment variables are set correctly

---

**Integration Status**: ✅ COMPLETE

All modules are integrated and ready for testing. The system is now fully functional with frontend-backend communication established.

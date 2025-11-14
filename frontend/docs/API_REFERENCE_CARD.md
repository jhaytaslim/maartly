# 📡 Maartly API Reference Card

Quick reference for all available API endpoints.

**Base URL**: `http://localhost:3001/api/v1`

---

## 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new tenant | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/verify-email` | Verify email & set password | ❌ |
| POST | `/auth/verify-token` | Verify token validity | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |

---

## 👥 Users

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/users` | List all users | All |
| GET | `/users/:id` | Get user by ID | All |
| POST | `/users` | Create user | Admin |
| PATCH | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

---

## 🏢 Tenants

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/tenants` | List tenants | SuperAdmin |
| GET | `/tenants/:id` | Get tenant | Admin |
| PATCH | `/tenants/:id` | Update tenant | Admin |
| GET | `/tenants/storefront/:slug` | Public storefront | ❌ Public |

---

## 📦 Products

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/products` | List products | All |
| GET | `/products/:id` | Get product | All |
| GET | `/products/search?q=query` | Search products | All |
| POST | `/products` | Create product | Manager+ |
| PATCH | `/products/:id` | Update product | Manager+ |
| DELETE | `/products/:id` | Delete product | Manager+ |

---

## 🏷️ Categories

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/categories` | List categories | All |
| POST | `/categories` | Create category | Manager+ |
| PATCH | `/categories/:id` | Update category | Manager+ |
| DELETE | `/categories/:id` | Delete category | Manager+ |

---

## 🚚 Suppliers

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/suppliers` | List suppliers | All |
| POST | `/suppliers` | Create supplier | Manager+ |
| PATCH | `/suppliers/:id` | Update supplier | Manager+ |
| DELETE | `/suppliers/:id` | Delete supplier | Manager+ |

---

## 🏪 Stores

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/stores` | List stores | All |
| GET | `/stores/:id` | Get store | All |
| POST | `/stores` | Create store | Admin |
| PATCH | `/stores/:id` | Update store | Admin |
| DELETE | `/stores/:id` | Delete store | Admin |

---

## 🛒 Orders

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/orders` | List orders | All |
| GET | `/orders/:id` | Get order | All |
| POST | `/orders` | Create order | Cashier+ |
| PATCH | `/orders/:id/status` | Update status | Manager+ |
| POST | `/orders/customer` | Customer order | ❌ Public |

---

## 👤 Customers

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/customers` | List customers | All |
| POST | `/customers` | Create customer | Cashier+ |
| PATCH | `/customers/:id` | Update customer | Manager+ |

---

## 💰 Currency

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/currency` | List currencies | All |
| GET | `/currency/:id` | Get currency | All |
| POST | `/currency` | Create currency | Admin |
| PATCH | `/currency/:id` | Update currency | Admin |
| DELETE | `/currency/:id` | Delete currency | Admin |
| PATCH | `/currency/:id/set-default` | Set default | Admin |

---

## 💳 Debts

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/debts` | List debts | All |
| GET | `/debts/:id` | Get debt | All |
| GET | `/debts/customer/:id` | Customer debts | All |
| POST | `/debts` | Create debt | Cashier+ |
| PATCH | `/debts/:id` | Update debt | Manager+ |
| DELETE | `/debts/:id` | Delete debt | Manager+ |
| POST | `/debts/:id/payment` | Record payment | Cashier+ |

---

## 💸 Taxes

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/taxes` | List taxes | All |
| GET | `/taxes/:id` | Get tax | All |
| POST | `/taxes` | Create tax | Admin |
| PATCH | `/taxes/:id` | Update tax | Admin |
| DELETE | `/taxes/:id` | Delete tax | Admin |
| PATCH | `/taxes/:id/set-default` | Set default | Admin |

---

## 💎 Plans

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/plans` | List plans | All |
| GET | `/plans/:id` | Get plan | All |
| POST | `/plans` | Create plan | SuperAdmin |
| PATCH | `/plans/:id` | Update plan | SuperAdmin |
| DELETE | `/plans/:id` | Delete plan | SuperAdmin |

---

## 📊 Reports

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/reports/sales` | Sales report | Manager+ |
| GET | `/reports/inventory` | Inventory report | Manager+ |
| GET | `/reports/profit-loss` | P&L report | Admin |
| GET | `/reports/top-products` | Top products | Manager+ |
| GET | `/reports/customer-insights` | Customer insights | Manager+ |
| GET | `/reports/store-performance` | Store performance | Admin |
| GET | `/reports/:type/export/:format` | Export report | Manager+ |

---

## 🎨 Storefront

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/storefront` | Get config | Admin |
| PATCH | `/storefront` | Update config | Admin |
| PATCH | `/storefront/theme` | Update theme | Admin |
| PATCH | `/storefront/seo` | Update SEO | Admin |
| GET | `/storefront/preview/:slug` | Preview | Admin |

---

## 🔄 Offline Sync

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/offline-sync/queue` | Queue operation | All |
| POST | `/offline-sync/process` | Process queue | System |
| GET | `/offline-sync/cached-data` | Get cached data | All |

---

## 📋 Query Parameters

### Common Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=20` |
| `sort` | string | Sort field | `?sort=createdAt` |
| `order` | string | Sort order | `?order=desc` |
| `search` | string | Search query | `?search=product` |
| `status` | string | Filter by status | `?status=active` |

### Reports Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `startDate` | date | Start date | `?startDate=2025-01-01` |
| `endDate` | date | End date | `?endDate=2025-12-31` |
| `storeId` | string | Filter by store | `?storeId=123` |
| `categoryId` | string | Filter by category | `?categoryId=456` |
| `period` | string | Time period | `?period=month` |

---

## 📤 Request Body Examples

### Signup
```json
{
  "businessName": "My Store",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "plan": "professional",
  "slug": "my-store"
}
```

### Login
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Create Product
```json
{
  "name": "Product Name",
  "sku": "PROD001",
  "description": "Product description",
  "price": 99.99,
  "costPrice": 50.00,
  "stock": 100,
  "minStock": 10,
  "categoryId": "cat123",
  "supplierId": "sup123",
  "storeId": "store123",
  "unit": "piece",
  "barcode": "1234567890"
}
```

### Create Order
```json
{
  "items": [
    {
      "productId": "prod123",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "customerId": "cust123",
  "storeId": "store123",
  "paymentMethod": "card",
  "discount": 10.00,
  "notes": "Rush order"
}
```

### Create Currency
```json
{
  "code": "USD",
  "name": "US Dollar",
  "symbol": "$",
  "exchangeRate": 1.0,
  "isDefault": true
}
```

### Create Tax
```json
{
  "name": "VAT",
  "rate": 20.0,
  "type": "percentage",
  "region": "UK",
  "isDefault": true
}
```

### Record Debt Payment
```json
{
  "amount": 50.00,
  "paymentMethod": "cash",
  "notes": "Partial payment"
}
```

---

## 📥 Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Product Name",
    "createdAt": "2025-10-22T10:00:00Z"
  },
  "message": "Product created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Product name is required",
  "statusCode": 400
}
```

### List Response
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## 🔐 Authentication Headers

### Authorization
```
Authorization: Bearer <JWT_TOKEN>
```

### Content Type
```
Content-Type: application/json
```

---

## 🚦 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate entry |
| 500 | Server Error - Internal error |

---

## 👥 User Roles & Permissions

| Role | Access Level |
|------|--------------|
| **superAdmin** | Platform administration, all tenants |
| **tenantAdmin** | Full tenant access, all features |
| **storeManager** | Store management, reports, products |
| **cashier** | POS, orders, customers (view only) |

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Products (with auth)
```bash
curl -X GET http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Product
```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST001",
    "price": 99.99,
    "stock": 100
  }'
```

---

## 📱 Frontend API Usage

### Using the API Service

```typescript
import { api } from './lib/api';

// Login
const result = await api.login('email@example.com', 'password');

// Get products
const products = await api.getProducts();

// Create product
const newProduct = await api.createProduct({
  name: 'Product',
  sku: 'PROD001',
  price: 99.99
});

// Create order
const order = await api.createOrder({
  items: [{ productId: '123', quantity: 2 }],
  paymentMethod: 'card'
});

// Get reports
const salesReport = await api.getSalesReport({
  startDate: '2025-01-01',
  endDate: '2025-12-31'
});
```

---

## 🔗 Useful Links

- **Backend Setup**: [backend/BACKEND_SETUP.md](./backend/BACKEND_SETUP.md)
- **Integration Guide**: [FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)
- **Testing Guide**: [START_TESTING_NOW.md](./START_TESTING_NOW.md)

---

## 💡 Tips

1. **Always include Authorization header** for protected endpoints
2. **Use proper Content-Type** for JSON requests
3. **Check response status codes** for error handling
4. **Implement retry logic** for network errors
5. **Cache responses** when appropriate
6. **Use pagination** for large datasets
7. **Validate input** before sending requests

---

**Last Updated**: October 22, 2025  
**API Version**: v1  
**Documentation**: [Full Guide](./FRONTEND_BACKEND_INTEGRATION.md)

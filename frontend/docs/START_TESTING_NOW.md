# 🚀 START TESTING NOW - Maartly

## ⚡ Quick Start (3 Steps)

### Step 1: Start the Backend (2 minutes)

```bash
cd backend

# Start Docker services (MongoDB, Redis, RabbitMQ)
docker-compose up -d

# Install dependencies (first time only)
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start backend server
npm run start:dev
```

✅ Backend should be running on `http://localhost:3001`

---

### Step 2: Start the Frontend (1 minute)

Open a **new terminal** window:

```bash
# Make sure you're in the root directory
cd ..  # if you're still in /backend

# Install dependencies (first time only)
npm install

# Start frontend development server
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

---

### Step 3: Test the Integration (1 minute)

Open a **third terminal** window:

```bash
# Linux/Mac
chmod +x test-integration.sh
./test-integration.sh

# OR Windows PowerShell
.\test-integration.ps1
```

✅ You should see all tests passing!

---

## 🎯 Test the Application

### 1. Open Your Browser
Navigate to: **http://localhost:5173**

### 2. Sign Up for an Account
1. Click "Get Started"
2. Fill in the form:
   - **Business Name**: Test Store
   - **First Name**: John
   - **Last Name**: Doe
   - **Email**: test@example.com
   - **Phone**: +1234567890
   - **Plan**: Select any plan
3. Click "Create Account"

### 3. Verify Your Email
Check the backend console for the verification token:
```
Verification URL: http://localhost:5173/verify-account?token=YOUR_TOKEN_HERE
```

Copy the token and go to the verification page, or check your email if you configured SMTP.

### 4. Set Your Password
On the verification page:
1. Enter a strong password
2. Confirm password
3. Click "Verify & Continue"

### 5. Login
1. Enter your email
2. Enter your password
3. Click "Sign In"

---

## 🧪 Test Key Features

Once logged in, test these features:

### ✅ Dashboard
- View overview statistics
- Check recent orders
- See sales trends

### ✅ Products
1. Click "Products" in sidebar
2. Click "Add Product"
3. Fill in product details:
   - Name: "Test Product"
   - SKU: "TEST001"
   - Price: 99.99
   - Stock: 100
4. Click "Save"
5. Verify product appears in list

### ✅ Categories
1. Click "Categories"
2. Add a new category
3. Edit category
4. Delete category

### ✅ Point of Sale (POS)
1. Click "POS" in sidebar
2. Search for a product
3. Add to cart
4. Process payment
5. Generate receipt

### ✅ Orders
1. Click "Orders"
2. View order list
3. Click on an order to see details
4. Update order status

### ✅ Customers
1. Click "Customers"
2. Add a new customer
3. View customer details
4. Edit customer info

### ✅ Stores (Multi-Store)
1. Click "Stores"
2. Add a new store
3. View store details
4. Assign products to store

### ✅ Currency Management (NEW)
1. Click "Settings"
2. Go to "Currency" tab
3. Add a new currency (e.g., EUR, GBP)
4. Set exchange rates
5. Set default currency

### ✅ Tax Management (NEW)
1. Click "Tax Management"
2. Create a new tax profile
3. Set tax rate (e.g., 10%)
4. Configure regions
5. Set as default

### ✅ Debt Management (NEW)
1. Click "Debt Management"
2. Record a customer debt
3. Record a payment
4. View payment history

### ✅ Reports (Coming Soon)
- Sales reports
- Inventory reports
- Profit/Loss statements

---

## 🔍 What to Look For

### ✅ Check API Connections
Open browser DevTools (F12) → Network tab:
- Look for API calls to `http://localhost:3001/api/v1/*`
- Verify successful responses (Status 200/201)
- Check for any errors (Status 400/500)

### ✅ Check Console
Open browser DevTools (F12) → Console tab:
- Should see no errors
- May see informational logs

### ✅ Check Backend Logs
In the terminal where backend is running:
- Should see incoming requests
- Should see successful responses
- No errors should appear

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Won't Start
**Error**: `Cannot connect to MongoDB`

**Solution**:
```bash
docker-compose restart mongodb
# Wait 10 seconds, then
npm run start:dev
```

### Issue 2: Frontend Can't Connect
**Error**: `Failed to fetch` or `Network Error`

**Solution**:
1. Check backend is running on port 3001
2. Check `.env` file has correct API URL:
   ```
   VITE_API_URL=http://localhost:3001/api/v1
   ```
3. Restart frontend: Press `Ctrl+C`, then `npm run dev`

### Issue 3: Database Schema Issues
**Error**: Prisma errors about models

**Solution**:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### Issue 4: Port Already in Use
**Error**: `Port 3001 already in use`

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change port in backend/.env
```

---

## 📊 System Health Check

Run this quick health check:

### 1. Docker Services
```bash
docker ps
```
Should show 3 running containers:
- MongoDB
- Redis
- RabbitMQ

### 2. Backend Health
```bash
curl http://localhost:3001/api/v1/health
```
Should return: `{"status":"ok"}`

### 3. Frontend Health
Open: `http://localhost:5173`
Should show the Maartly landing page

---

## 📈 Performance Metrics

Expected response times:
- ✅ Authentication: < 500ms
- ✅ Product list: < 200ms
- ✅ Product create: < 300ms
- ✅ Dashboard load: < 500ms
- ✅ Report generation: < 1s

---

## 🎓 Learning Resources

### API Documentation
All endpoints are documented in:
- `FRONTEND_BACKEND_INTEGRATION.md` - Complete API reference

### Architecture
System architecture explained in:
- `COMPLETE_SYSTEM_GUIDE.md` - Full system overview
- `backend/BACKEND_SETUP.md` - Backend details

### Testing
Full testing checklist in:
- `FRONTEND_BACKEND_INTEGRATION.md` - Section "Testing Checklist"

---

## 📞 Get Help

### Check These Files First:
1. **FRONTEND_BACKEND_INTEGRATION.md** - Integration guide
2. **INTEGRATION_COMPLETED.md** - What's been completed
3. **backend/BACKEND_SETUP.md** - Backend setup
4. **TROUBLESHOOTING.md** - Common issues (if exists)

### Debugging Steps:
1. Check browser console for errors
2. Check backend terminal for logs
3. Check Docker container status: `docker ps`
4. Check API connectivity with test script
5. Verify environment variables are set

---

## ✅ Testing Checklist

Use this checklist to track your testing:

### Basic Functionality
- [ ] Can access landing page
- [ ] Can sign up for account
- [ ] Can verify email
- [ ] Can login
- [ ] Can logout
- [ ] Can reset password

### Product Management
- [ ] Can view products
- [ ] Can create product
- [ ] Can edit product
- [ ] Can delete product
- [ ] Can search products
- [ ] Can filter by category

### Order Management
- [ ] Can create order (POS)
- [ ] Can view orders
- [ ] Can update order status
- [ ] Receipt generation works

### Multi-Store
- [ ] Can create stores
- [ ] Can view store details
- [ ] Can assign products to stores
- [ ] Can transfer products

### Customer Management
- [ ] Can add customers
- [ ] Can view customer details
- [ ] Can edit customer info
- [ ] Can track customer orders

### Currency & Tax
- [ ] Can add currencies
- [ ] Can set exchange rates
- [ ] Can create tax profiles
- [ ] Taxes apply to orders correctly

### Debt Management
- [ ] Can record debts
- [ ] Can record payments
- [ ] Can view debt history
- [ ] Payment calculations correct

### Reports
- [ ] Dashboard shows data
- [ ] Can filter by date range
- [ ] Data is accurate
- [ ] Export works (if implemented)

---

## 🎉 Success Criteria

Your integration is working if:

✅ All API endpoints respond correctly  
✅ User can sign up and login  
✅ Products can be created and managed  
✅ Orders can be processed  
✅ Data persists after refresh  
✅ No errors in browser console  
✅ No errors in backend logs  
✅ All Docker services running  
✅ Frontend-backend communication works  

---

## 🚀 What's Next?

After testing, you can:

1. **Customize**: Modify colors, branding, features
2. **Extend**: Add more features based on needs
3. **Deploy**: Follow deployment guide for production
4. **Scale**: Add more stores, products, users
5. **Integrate**: Connect payment gateways, shipping

---

## 💡 Pro Tips

### Speed Up Development
- Keep backend running during frontend changes
- Use hot reload for instant updates
- Install React DevTools browser extension
- Use Redux DevTools for state debugging

### Better Testing
- Test with multiple user roles
- Try edge cases (empty data, large numbers)
- Test offline mode
- Test on different browsers
- Test mobile responsiveness

### Performance
- Monitor backend response times
- Check Redis cache effectiveness
- Optimize database queries if slow
- Use pagination for large lists

---

## 📝 Take Notes

As you test, note down:
- Features that work well ✅
- Issues you encounter 🐛
- Ideas for improvements 💡
- Questions you have ❓

This will help with debugging and future development!

---

## 🎯 Your Mission

**Goal**: Test all major features and verify everything works!

**Time**: 30-60 minutes

**Outcome**: Fully functional Maartly system ready for production!

---

# Ready? Let's Go! 🚀

```bash
# Terminal 1: Start Backend
cd backend && docker-compose up -d && npm run start:dev

# Terminal 2: Start Frontend
npm run dev

# Terminal 3: Test Integration
./test-integration.sh
```

Open browser → http://localhost:5173 → Start Testing!

**Happy Testing!** 🎉

---

**Last Updated**: October 22, 2025  
**Version**: 2.0  
**Status**: ✅ READY FOR TESTING

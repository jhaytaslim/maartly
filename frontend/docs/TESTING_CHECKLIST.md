# ✅ Cognistock Testing Checklist

Use this checklist to systematically test all features of the Cognistock system.

**Testing Date**: _____________  
**Tester Name**: _____________  
**Environment**: Development / Staging / Production

---

## 🚀 Setup & Configuration

### Backend Setup
- [ ] Docker services started (MongoDB, Redis, RabbitMQ)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Backend server running on port 3001
- [ ] No errors in backend console

### Frontend Setup
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running on port 5173
- [ ] No errors in frontend console
- [ ] Environment variables configured

### Integration Test
- [ ] `test-integration.sh` or `test-integration.ps1` passed
- [ ] All API endpoints responding
- [ ] Docker services healthy

---

## 🔐 Authentication & Authorization

### User Registration
- [ ] Can access landing page
- [ ] Signup form displays correctly
- [ ] Can fill in all required fields
- [ ] Validation works for invalid inputs
- [ ] Can select a pricing plan
- [ ] Signup request succeeds
- [ ] Verification email sent (check logs)
- [ ] Verification link is generated

### Email Verification
- [ ] Can access verification page
- [ ] Token is validated correctly
- [ ] Can set password
- [ ] Password validation works
- [ ] Account activation succeeds
- [ ] Redirect to login page works

### Login
- [ ] Login form displays correctly
- [ ] Can enter credentials
- [ ] Validation works for invalid inputs
- [ ] Login succeeds with correct credentials
- [ ] Login fails with wrong credentials
- [ ] JWT token is stored
- [ ] User data is stored in localStorage
- [ ] Redirect to dashboard works

### Password Reset
- [ ] Can access forgot password page
- [ ] Can enter email address
- [ ] Reset email sent (check logs)
- [ ] Can access reset password page with token
- [ ] Can set new password
- [ ] Password reset succeeds
- [ ] Can login with new password

### Logout
- [ ] Logout button works
- [ ] JWT token is cleared
- [ ] User data is cleared
- [ ] Redirect to landing page works

---

## 🏠 Dashboard

### Overview Statistics
- [ ] Dashboard loads successfully
- [ ] Total sales displays
- [ ] Total orders displays
- [ ] Total customers displays
- [ ] Total products displays
- [ ] Statistics are accurate

### Charts & Graphs
- [ ] Sales chart displays
- [ ] Data is visualized correctly
- [ ] Chart is interactive
- [ ] Date filters work

### Recent Activity
- [ ] Recent orders display
- [ ] Recent products display
- [ ] Data is up-to-date
- [ ] Click actions work

---

## 📦 Product Management

### View Products
- [ ] Products page loads
- [ ] Product list displays
- [ ] Product data is accurate
- [ ] Pagination works
- [ ] Sorting works
- [ ] Filtering works

### Search Products
- [ ] Search bar is functional
- [ ] Search by name works
- [ ] Search by SKU works
- [ ] Search by barcode works
- [ ] Results are accurate
- [ ] No results message displays

### Create Product
- [ ] Add product button works
- [ ] Product form displays
- [ ] All fields are present
- [ ] Validation works
- [ ] Can upload image
- [ ] Can generate QR code
- [ ] Can assign category
- [ ] Can assign supplier
- [ ] Can set stock levels
- [ ] Create succeeds
- [ ] Success message displays
- [ ] Product appears in list

### Edit Product
- [ ] Edit button works
- [ ] Form pre-fills with data
- [ ] Can modify all fields
- [ ] Validation works
- [ ] Update succeeds
- [ ] Success message displays
- [ ] Changes reflect in list

### Delete Product
- [ ] Delete button works
- [ ] Confirmation dialog appears
- [ ] Delete succeeds
- [ ] Success message displays
- [ ] Product removed from list

---

## 🏷️ Categories

### View Categories
- [ ] Categories page loads
- [ ] Category list displays
- [ ] Data is accurate

### Create Category
- [ ] Add category button works
- [ ] Form displays correctly
- [ ] Validation works
- [ ] Create succeeds
- [ ] Success message displays

### Edit Category
- [ ] Edit button works
- [ ] Form pre-fills
- [ ] Update succeeds

### Delete Category
- [ ] Delete button works
- [ ] Confirmation works
- [ ] Delete succeeds

---

## 🚚 Suppliers

### View Suppliers
- [ ] Suppliers page loads
- [ ] Supplier list displays
- [ ] Data is accurate

### Create Supplier
- [ ] Add supplier button works
- [ ] Form displays correctly
- [ ] All fields present
- [ ] Validation works
- [ ] Create succeeds

### Edit Supplier
- [ ] Edit button works
- [ ] Form pre-fills
- [ ] Update succeeds

### Delete Supplier
- [ ] Delete button works
- [ ] Confirmation works
- [ ] Delete succeeds

---

## 🏪 Store Management

### View Stores
- [ ] Stores page loads
- [ ] Store list displays
- [ ] Data is accurate

### Create Store
- [ ] Add store button works
- [ ] Form displays correctly
- [ ] All fields present
- [ ] Can set location
- [ ] Can set capacity
- [ ] Validation works
- [ ] Create succeeds

### Edit Store
- [ ] Edit button works
- [ ] Form pre-fills
- [ ] Update succeeds

### View Store Details
- [ ] Store details page loads
- [ ] Inventory displays
- [ ] Store stats display

### Delete Store
- [ ] Delete button works
- [ ] Confirmation works
- [ ] Delete succeeds

---

## 💰 Point of Sale (POS)

### POS Interface
- [ ] POS page loads
- [ ] Product grid displays
- [ ] Search bar works
- [ ] Category filter works
- [ ] Cart displays

### Product Selection
- [ ] Can click products to add
- [ ] Can scan barcode
- [ ] Can search by SKU
- [ ] Product details display
- [ ] Price displays correctly

### Cart Management
- [ ] Products add to cart
- [ ] Quantity can be adjusted
- [ ] Can remove items
- [ ] Subtotal calculates
- [ ] Tax calculates
- [ ] Total calculates

### Customer Selection
- [ ] Can select existing customer
- [ ] Can create new customer
- [ ] Customer info displays

### Payment Processing
- [ ] Payment method selection works
- [ ] Can enter amount paid
- [ ] Change calculates correctly
- [ ] Can apply discount
- [ ] Can add notes

### Order Completion
- [ ] Order creation succeeds
- [ ] Receipt generates
- [ ] Receipt is printable
- [ ] Cart clears after order
- [ ] Order appears in orders list

---

## 📋 Order Management

### View Orders
- [ ] Orders page loads
- [ ] Order list displays
- [ ] Data is accurate
- [ ] Pagination works
- [ ] Filtering works (by status, date)

### View Order Details
- [ ] Order details page loads
- [ ] Customer info displays
- [ ] Items list displays
- [ ] Payment info displays
- [ ] Total is accurate

### Update Order Status
- [ ] Status dropdown works
- [ ] Can change status
- [ ] Update succeeds
- [ ] Status reflects in list

### Print Receipt
- [ ] Print button works
- [ ] Receipt displays correctly
- [ ] Print dialog opens

---

## 👤 Customer Management

### View Customers
- [ ] Customers page loads
- [ ] Customer list displays
- [ ] Data is accurate
- [ ] Search works

### Create Customer
- [ ] Add customer button works
- [ ] Form displays correctly
- [ ] All fields present
- [ ] Validation works
- [ ] Create succeeds

### Edit Customer
- [ ] Edit button works
- [ ] Form pre-fills
- [ ] Update succeeds

### View Customer Details
- [ ] Customer details display
- [ ] Purchase history shows
- [ ] Debt information displays

---

## 💳 Debt Management

### View Debts
- [ ] Debt management page loads
- [ ] Debt list displays
- [ ] Outstanding balances correct
- [ ] Filter by status works
- [ ] Filter by customer works

### Create Debt Record
- [ ] Add debt button works
- [ ] Form displays correctly
- [ ] Can select customer
- [ ] Can enter amount
- [ ] Can add description
- [ ] Create succeeds

### Record Payment
- [ ] Payment button works
- [ ] Payment form displays
- [ ] Can enter amount
- [ ] Can select payment method
- [ ] Remaining balance calculates
- [ ] Payment records successfully

### View Debt History
- [ ] Payment history displays
- [ ] All payments listed
- [ ] Amounts are accurate
- [ ] Dates are correct

---

## 💰 Currency Management

### View Currencies
- [ ] Settings → Currency loads
- [ ] Currency list displays
- [ ] Default currency marked

### Add Currency
- [ ] Add currency button works
- [ ] Form displays correctly
- [ ] Can enter code (USD, EUR, etc.)
- [ ] Can enter symbol
- [ ] Can set exchange rate
- [ ] Create succeeds

### Edit Currency
- [ ] Edit button works
- [ ] Can update exchange rate
- [ ] Update succeeds

### Set Default Currency
- [ ] Set default button works
- [ ] Default changes correctly
- [ ] Only one default at a time

### Delete Currency
- [ ] Delete button works
- [ ] Cannot delete default
- [ ] Delete succeeds

---

## 💸 Tax Management

### View Taxes
- [ ] Tax management page loads
- [ ] Tax profiles display
- [ ] Default tax marked

### Create Tax Profile
- [ ] Add tax button works
- [ ] Form displays correctly
- [ ] Can enter tax name
- [ ] Can set tax rate
- [ ] Can select type (percentage/fixed)
- [ ] Can set region
- [ ] Create succeeds

### Edit Tax
- [ ] Edit button works
- [ ] Form pre-fills
- [ ] Update succeeds

### Set Default Tax
- [ ] Set default button works
- [ ] Default changes correctly

### Apply Tax to Order
- [ ] Tax applies in POS
- [ ] Calculation is correct
- [ ] Tax shows on receipt

---

## 💎 Pricing Plans

### View Plans
- [ ] Pricing plans page loads
- [ ] All plans display
- [ ] Features are listed
- [ ] Prices are correct

### Current Plan
- [ ] Current plan is highlighted
- [ ] Plan details are accurate
- [ ] Usage stats display (if applicable)

### Change Plan (if implemented)
- [ ] Upgrade button works
- [ ] Downgrade button works
- [ ] Confirmation required
- [ ] Plan changes successfully

---

## 📊 Reports & Analytics

### Sales Reports
- [ ] Sales report page loads
- [ ] Can select date range
- [ ] Report generates
- [ ] Data is accurate
- [ ] Charts display correctly
- [ ] Export to CSV works
- [ ] Export to PDF works

### Inventory Reports
- [ ] Inventory report loads
- [ ] Current stock accurate
- [ ] Low stock items highlighted
- [ ] Can filter by category
- [ ] Can filter by store
- [ ] Export works

### Profit & Loss Report
- [ ] P&L report loads
- [ ] Revenue calculated correctly
- [ ] Costs calculated correctly
- [ ] Profit calculated correctly
- [ ] Date range filter works

### Top Products Report
- [ ] Top products report loads
- [ ] Products ranked correctly
- [ ] Sales data accurate
- [ ] Can filter by date range

### Customer Insights
- [ ] Customer insights load
- [ ] Top customers identified
- [ ] Purchase patterns shown
- [ ] Data is accurate

### Store Performance
- [ ] Store performance loads
- [ ] All stores listed
- [ ] Sales by store accurate
- [ ] Comparison is fair

---

## 🎨 Storefront Management

### Storefront Configuration
- [ ] Storefront settings load
- [ ] Current config displays
- [ ] Can edit business info
- [ ] Can edit contact details
- [ ] Update succeeds

### Theme Customization
- [ ] Theme editor loads
- [ ] Can change colors
- [ ] Can upload logo
- [ ] Can customize fonts
- [ ] Preview works
- [ ] Changes save correctly

### SEO Settings
- [ ] SEO settings load
- [ ] Can edit meta title
- [ ] Can edit meta description
- [ ] Can edit keywords
- [ ] Update succeeds

### Public Storefront
- [ ] Can access public URL
- [ ] Products display correctly
- [ ] Theme is applied
- [ ] Images load
- [ ] Add to cart works (if implemented)

---

## 👥 User Management (Admin)

### View Users
- [ ] Users page loads (tenantAdmin+)
- [ ] User list displays
- [ ] Roles are shown
- [ ] Filter by role works

### Create User
- [ ] Add user button works
- [ ] Form displays correctly
- [ ] Can assign role
- [ ] Can assign to store
- [ ] Validation works
- [ ] Create succeeds

### Edit User
- [ ] Edit button works
- [ ] Can change role
- [ ] Can change store assignment
- [ ] Update succeeds

### Deactivate User
- [ ] Deactivate button works
- [ ] Confirmation required
- [ ] User deactivated
- [ ] Cannot login when deactivated

---

## 🔄 Offline Sync (if implemented)

### Offline Mode
- [ ] App works offline
- [ ] Operations are queued
- [ ] UI indicates offline status

### Sync Process
- [ ] Reconnection detected
- [ ] Queued operations sync
- [ ] Success message displays
- [ ] Data is consistent

---

## 🔔 Notifications

### Email Notifications
- [ ] Signup email sent
- [ ] Verification email sent
- [ ] Password reset email sent
- [ ] Low stock alerts sent (if configured)

### In-App Notifications (if implemented)
- [ ] Notifications display
- [ ] Can mark as read
- [ ] Can dismiss

---

## 🔐 Security & Permissions

### Role-Based Access Control

#### SuperAdmin
- [ ] Can access all features
- [ ] Can manage all tenants
- [ ] Can manage plans

#### TenantAdmin
- [ ] Can access all tenant features
- [ ] Can manage users
- [ ] Can manage stores
- [ ] Can view all reports
- [ ] Cannot access other tenants

#### StoreManager
- [ ] Can manage assigned store
- [ ] Can manage products
- [ ] Can view reports
- [ ] Cannot manage users
- [ ] Cannot access other stores

#### Cashier
- [ ] Can access POS
- [ ] Can create orders
- [ ] Can view customers
- [ ] Cannot edit products
- [ ] Cannot view reports
- [ ] Cannot manage users

### Data Isolation
- [ ] Users see only their tenant's data
- [ ] Cannot access other tenant's data
- [ ] API enforces tenant isolation

---

## ⚡ Performance

### Page Load Times
- [ ] Landing page < 1s
- [ ] Dashboard < 2s
- [ ] Product list < 1s
- [ ] POS < 1s

### API Response Times
- [ ] Auth < 500ms
- [ ] Product list < 300ms
- [ ] Order creation < 500ms
- [ ] Report generation < 2s

### Large Datasets
- [ ] Pagination works with 1000+ products
- [ ] Search is fast
- [ ] Filtering is responsive

---

## 📱 Responsiveness

### Desktop (1920x1080)
- [ ] Layout is correct
- [ ] All features accessible
- [ ] No horizontal scroll

### Laptop (1366x768)
- [ ] Layout adapts
- [ ] No content cutoff
- [ ] Usable

### Tablet (768x1024)
- [ ] Layout is responsive
- [ ] Touch targets adequate
- [ ] Navigation works

### Mobile (375x667)
- [ ] Layout is mobile-friendly
- [ ] Sidebar collapses
- [ ] Touch targets large enough
- [ ] Forms are usable

---

## 🌐 Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

---

## 🐛 Error Handling

### Network Errors
- [ ] Graceful handling
- [ ] Error messages display
- [ ] User can retry

### Validation Errors
- [ ] Field-level validation
- [ ] Clear error messages
- [ ] Error styling

### 404 Errors
- [ ] 404 page displays
- [ ] Can navigate back

### 500 Errors
- [ ] Error message displays
- [ ] User can retry
- [ ] Support info shown

---

## 💡 User Experience

### Navigation
- [ ] Sidebar navigation clear
- [ ] Active page highlighted
- [ ] Breadcrumbs (if present)

### Feedback
- [ ] Success messages display
- [ ] Error messages display
- [ ] Loading states shown
- [ ] Confirmations for destructive actions

### Forms
- [ ] Labels are clear
- [ ] Placeholders helpful
- [ ] Validation is immediate
- [ ] Required fields marked

### Tables
- [ ] Data is readable
- [ ] Headers are clear
- [ ] Actions are accessible
- [ ] Pagination is clear

---

## 📝 Notes & Issues

### Issues Found
1. ________________________________
2. ________________________________
3. ________________________________
4. ________________________________
5. ________________________________

### Suggestions for Improvement
1. ________________________________
2. ________________________________
3. ________________________________
4. ________________________________
5. ________________________________

### Additional Comments
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________

---

## ✅ Final Sign-off

### Testing Summary
- **Total Tests**: _____
- **Passed**: _____
- **Failed**: _____
- **Blocked**: _____

### Overall Assessment
- [ ] Ready for production
- [ ] Needs minor fixes
- [ ] Needs major fixes
- [ ] Not ready

### Tester Sign-off
**Name**: _____________________  
**Date**: _____________________  
**Signature**: _____________________

---

**Testing completed on**: _______________  
**Environment**: Development / Staging / Production  
**Version**: 2.0

---

## 📞 Report Issues

If you find any issues during testing:
1. Document the issue clearly
2. Include steps to reproduce
3. Note the expected vs actual behavior
4. Include screenshots if possible
5. Report to development team

---

**Happy Testing!** 🎉

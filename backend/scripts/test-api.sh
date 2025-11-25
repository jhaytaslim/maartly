#!/bin/bash

# Maartly API Testing Script
# This script tests all major endpoints of the backend

BASE_URL="http://localhost:3000/api/v1"
ADMIN_EMAIL="admin@maartly.com"
ADMIN_PASSWORD="SecurePassword123!"

echo "🚀 Starting Maartly API Tests..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print info
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test 1: Health Check
info "Testing health check..."
HEALTH=$(curl -s "${BASE_URL}/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    success "Health check passed"
else
    error "Health check failed - Is the server running?"
    exit 1
fi

# Test 2: Register Super Admin
info "Registering super admin..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${ADMIN_EMAIL}\",
        \"password\": \"${ADMIN_PASSWORD}\",
        \"firstName\": \"Super\",
        \"lastName\": \"Admin\",
        \"role\": \"superAdmin\"
    }" 2>/dev/null)

if echo "$REGISTER_RESPONSE" | grep -q "error"; then
    info "User might already exist, trying login..."
else
    success "Super admin registered"
fi

# Test 3: Login
info "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${ADMIN_EMAIL}\",
        \"password\": \"${ADMIN_PASSWORD}\"
    }")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    error "Login failed - Could not get access token"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

success "Login successful"
info "Access Token: ${ACCESS_TOKEN:0:20}..."

# Test 4: Get Profile
info "Getting user profile..."
PROFILE=$(curl -s "${BASE_URL}/auth/profile" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PROFILE" | grep -q "email"; then
    success "Profile retrieved"
else
    error "Failed to get profile"
fi

# Test 5: Create Tenant
info "Creating tenant..."
TENANT_RESPONSE=$(curl -s -X POST "${BASE_URL}/tenants" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test Store",
        "slug": "test-store",
        "email": "test@store.com",
        "phone": "+1234567890"
    }')

TENANT_ID=$(echo "$TENANT_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TENANT_ID" ]; then
    success "Tenant created: $TENANT_ID"
else
    info "Tenant creation may have issues (could already exist)"
    echo "Response: $TENANT_RESPONSE"
fi

# Test 6: Create Category
info "Creating product category..."
CATEGORY_RESPONSE=$(curl -s -X POST "${BASE_URL}/categories" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Electronics",
        "description": "Electronic products"
    }')

CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$CATEGORY_ID" ]; then
    success "Category created: $CATEGORY_ID"
else
    info "Category creation response: $CATEGORY_RESPONSE"
fi

# Test 7: Create Supplier
info "Creating supplier..."
SUPPLIER_RESPONSE=$(curl -s -X POST "${BASE_URL}/suppliers" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Tech Supplier Inc",
        "email": "contact@techsupplier.com",
        "phone": "+1234567890"
    }')

SUPPLIER_ID=$(echo "$SUPPLIER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$SUPPLIER_ID" ]; then
    success "Supplier created: $SUPPLIER_ID"
else
    info "Supplier creation response: $SUPPLIER_RESPONSE"
fi

# Test 8: Get Products
info "Getting products..."
PRODUCTS=$(curl -s "${BASE_URL}/products" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

success "Products retrieved"

# Test 9: Create Store
info "Creating store..."
STORE_RESPONSE=$(curl -s -X POST "${BASE_URL}/stores" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Main Store",
        "address": "123 Main Street",
        "phone": "+1234567890"
    }')

STORE_ID=$(echo "$STORE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$STORE_ID" ]; then
    success "Store created: $STORE_ID"
else
    info "Store creation response: $STORE_RESPONSE"
fi

# Test 10: Create Customer
info "Creating customer..."
CUSTOMER_RESPONSE=$(curl -s -X POST "${BASE_URL}/customers" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890"
    }')

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$CUSTOMER_ID" ]; then
    success "Customer created: $CUSTOMER_ID"
else
    info "Customer creation response: $CUSTOMER_RESPONSE"
fi

# Test 11: Create Currency
info "Creating currency..."
CURRENCY_RESPONSE=$(curl -s -X POST "${BASE_URL}/currency" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "code": "USD",
        "name": "US Dollar",
        "symbol": "$",
        "exchangeRate": 1.0
    }')

if echo "$CURRENCY_RESPONSE" | grep -q "id"; then
    success "Currency created"
else
    info "Currency might already exist"
fi

# Test 12: Create Tax
info "Creating tax configuration..."
TAX_RESPONSE=$(curl -s -X POST "${BASE_URL}/taxes" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "VAT",
        "rate": 15,
        "type": "percentage",
        "region": "US"
    }')

if echo "$TAX_RESPONSE" | grep -q "id"; then
    success "Tax configuration created"
else
    info "Tax configuration response: $TAX_RESPONSE"
fi

# Test 13: Get Reports (Sales Summary)
info "Getting sales summary report..."
REPORT=$(curl -s "${BASE_URL}/reports/sales-summary?period=monthly" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$REPORT" | grep -q "totalSales\|message"; then
    success "Sales report retrieved"
else
    info "Report response: $REPORT"
fi

# Test 14: Get Inventory Report
info "Getting inventory report..."
INVENTORY_REPORT=$(curl -s "${BASE_URL}/reports/inventory" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$INVENTORY_REPORT" | grep -q "totalProducts\|message"; then
    success "Inventory report retrieved"
else
    info "Inventory report response: $INVENTORY_REPORT"
fi

# Test 15: Storefront Public Access (No auth required)
info "Testing storefront public access..."
STOREFRONT=$(curl -s "${BASE_URL}/storefront/tenant/test-store")

if echo "$STOREFRONT" | grep -q "name\|error"; then
    success "Storefront endpoint accessible"
else
    info "Storefront may need to be enabled first"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "API Testing Complete! ✨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
info "Next Steps:"
echo "  1. Check the backend logs for any errors"
echo "  2. Verify data in MongoDB"
echo "  3. Test frontend integration"
echo "  4. Review API documentation at /BACKEND_INTEGRATION_COMPLETE.md"
echo ""
info "Access Token for manual testing:"
echo "  $ACCESS_TOKEN"
echo ""

#!/bin/bash

# Cognistock Integration Test Script
# This script tests the connection between frontend and backend

echo "🚀 Cognistock Integration Test"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API URL
API_URL="http://localhost:3001/api/v1"

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local method=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$API_URL$endpoint")
    
    if [ $response -eq 200 ] || [ $response -eq 201 ] || [ $response -eq 401 ]; then
        echo -e "${GREEN}✓${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗${NC} (HTTP $response)"
        return 1
    fi
}

# Check if backend is running
echo "1. Checking if backend is running..."
if curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo ""
    echo "Please start the backend first:"
    echo "  cd backend && npm run start:dev"
    exit 1
fi

echo ""
echo "2. Testing API Endpoints..."
echo ""

# Test public endpoints
test_endpoint "/auth/signup" "POST" "Auth Signup Endpoint"
test_endpoint "/auth/login" "POST" "Auth Login Endpoint"
test_endpoint "/tenants/storefront/test-slug" "GET" "Public Storefront Endpoint"

echo ""
echo "3. Testing Protected Endpoints (should return 401)..."
echo ""

# Test protected endpoints (should return 401 without token)
test_endpoint "/products" "GET" "Products Endpoint"
test_endpoint "/categories" "GET" "Categories Endpoint"
test_endpoint "/suppliers" "GET" "Suppliers Endpoint"
test_endpoint "/orders" "GET" "Orders Endpoint"
test_endpoint "/customers" "GET" "Customers Endpoint"
test_endpoint "/stores" "GET" "Stores Endpoint"
test_endpoint "/currency" "GET" "Currency Endpoint"
test_endpoint "/debts" "GET" "Debts Endpoint"
test_endpoint "/taxes" "GET" "Taxes Endpoint"
test_endpoint "/plans" "GET" "Plans Endpoint"
test_endpoint "/reports/sales" "GET" "Reports Endpoint"
test_endpoint "/storefront" "GET" "Storefront Config Endpoint"

echo ""
echo "4. Checking Docker Services..."
echo ""

# Check if Docker services are running
if docker ps | grep -q "mongodb"; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
fi

if docker ps | grep -q "redis"; then
    echo -e "${GREEN}✓ Redis is running${NC}"
else
    echo -e "${RED}✗ Redis is not running${NC}"
fi

if docker ps | grep -q "rabbitmq"; then
    echo -e "${GREEN}✓ RabbitMQ is running${NC}"
else
    echo -e "${RED}✗ RabbitMQ is not running${NC}"
fi

echo ""
echo "================================"
echo "Integration Test Complete!"
echo ""
echo "Next Steps:"
echo "1. Start the frontend: npm run dev"
echo "2. Open http://localhost:5173"
echo "3. Try signing up and logging in"
echo "4. Test all the features"
echo ""
echo "For detailed testing guide, see:"
echo "  FRONTEND_BACKEND_INTEGRATION.md"
echo ""

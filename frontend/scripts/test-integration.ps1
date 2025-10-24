# Cognistock Integration Test Script (PowerShell)
# This script tests the connection between frontend and backend

Write-Host "🚀 Cognistock Integration Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# API URL
$API_URL = "http://localhost:3001/api/v1"

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Method,
        [string]$Description
    )
    
    Write-Host "Testing $Description... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri "$API_URL$Endpoint" -Method $Method -UseBasicParsing -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200 -or $statusCode -eq 201 -or $statusCode -eq 401) {
            Write-Host "✓ (HTTP $statusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ (HTTP $statusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "✓ (HTTP $statusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ (HTTP $statusCode)" -ForegroundColor Red
            return $false
        }
    }
}

# Check if backend is running
Write-Host "1. Checking if backend is running..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-WebRequest -Uri "$API_URL/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the backend first:"
    Write-Host "  cd backend && npm run start:dev"
    exit 1
}

Write-Host ""
Write-Host "2. Testing API Endpoints..." -ForegroundColor Yellow
Write-Host ""

# Test public endpoints
Test-Endpoint -Endpoint "/auth/signup" -Method "POST" -Description "Auth Signup Endpoint"
Test-Endpoint -Endpoint "/auth/login" -Method "POST" -Description "Auth Login Endpoint"
Test-Endpoint -Endpoint "/tenants/storefront/test-slug" -Method "GET" -Description "Public Storefront Endpoint"

Write-Host ""
Write-Host "3. Testing Protected Endpoints (should return 401)..." -ForegroundColor Yellow
Write-Host ""

# Test protected endpoints (should return 401 without token)
Test-Endpoint -Endpoint "/products" -Method "GET" -Description "Products Endpoint"
Test-Endpoint -Endpoint "/categories" -Method "GET" -Description "Categories Endpoint"
Test-Endpoint -Endpoint "/suppliers" -Method "GET" -Description "Suppliers Endpoint"
Test-Endpoint -Endpoint "/orders" -Method "GET" -Description "Orders Endpoint"
Test-Endpoint -Endpoint "/customers" -Method "GET" -Description "Customers Endpoint"
Test-Endpoint -Endpoint "/stores" -Method "GET" -Description "Stores Endpoint"
Test-Endpoint -Endpoint "/currency" -Method "GET" -Description "Currency Endpoint"
Test-Endpoint -Endpoint "/debts" -Method "GET" -Description "Debts Endpoint"
Test-Endpoint -Endpoint "/taxes" -Method "GET" -Description "Taxes Endpoint"
Test-Endpoint -Endpoint "/plans" -Method "GET" -Description "Plans Endpoint"
Test-Endpoint -Endpoint "/reports/sales" -Method "GET" -Description "Reports Endpoint"
Test-Endpoint -Endpoint "/storefront" -Method "GET" -Description "Storefront Config Endpoint"

Write-Host ""
Write-Host "4. Checking Docker Services..." -ForegroundColor Yellow
Write-Host ""

# Check if Docker services are running
$dockerPs = docker ps 2>&1

if ($dockerPs -match "mongodb") {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "✗ MongoDB is not running" -ForegroundColor Red
}

if ($dockerPs -match "redis") {
    Write-Host "✓ Redis is running" -ForegroundColor Green
} else {
    Write-Host "✗ Redis is not running" -ForegroundColor Red
}

if ($dockerPs -match "rabbitmq") {
    Write-Host "✓ RabbitMQ is running" -ForegroundColor Green
} else {
    Write-Host "✗ RabbitMQ is not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Integration Test Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Start the frontend: npm run dev"
Write-Host "2. Open http://localhost:5173"
Write-Host "3. Try signing up and logging in"
Write-Host "4. Test all the features"
Write-Host ""
Write-Host "For detailed testing guide, see:"
Write-Host "  FRONTEND_BACKEND_INTEGRATION.md"
Write-Host ""

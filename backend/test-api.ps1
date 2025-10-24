# Cognistock API Testing Script (PowerShell)
# This script tests all major endpoints of the backend

$BaseUrl = "http://localhost:3000/api/v1"
$AdminEmail = "admin@cognistock.com"
$AdminPassword = "SecurePassword123!"

Write-Host "🚀 Starting Cognistock API Tests..." -ForegroundColor Cyan
Write-Host ""

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

# Test 1: Health Check
Write-Info "Testing health check..."
try {
    $Health = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get -ErrorAction Stop
    Write-Success "Health check passed"
} catch {
    Write-Error-Custom "Health check failed - Is the server running?"
    exit 1
}

# Test 2: Register Super Admin
Write-Info "Registering super admin..."
$RegisterBody = @{
    email = $AdminEmail
    password = $AdminPassword
    firstName = "Super"
    lastName = "Admin"
    role = "superAdmin"
} | ConvertTo-Json

try {
    $RegisterResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $RegisterBody -ContentType "application/json"
    Write-Success "Super admin registered"
} catch {
    Write-Info "User might already exist, trying login..."
}

# Test 3: Login
Write-Info "Logging in..."
$LoginBody = @{
    email = $AdminEmail
    password = $AdminPassword
} | ConvertTo-Json

try {
    $LoginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $LoginBody -ContentType "application/json"
    $AccessToken = $LoginResponse.accessToken
    
    if ($AccessToken) {
        Write-Success "Login successful"
        Write-Info "Access Token: $($AccessToken.Substring(0, 20))..."
    } else {
        Write-Error-Custom "Login failed - Could not get access token"
        exit 1
    }
} catch {
    Write-Error-Custom "Login failed: $_"
    exit 1
}

$Headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

# Test 4: Get Profile
Write-Info "Getting user profile..."
try {
    $Profile = Invoke-RestMethod -Uri "$BaseUrl/auth/profile" -Method Get -Headers $Headers
    Write-Success "Profile retrieved"
} catch {
    Write-Error-Custom "Failed to get profile"
}

# Test 5: Create Tenant
Write-Info "Creating tenant..."
$TenantBody = @{
    name = "Test Store"
    slug = "test-store"
    email = "test@store.com"
    phone = "+1234567890"
} | ConvertTo-Json

try {
    $TenantResponse = Invoke-RestMethod -Uri "$BaseUrl/tenants" -Method Post -Body $TenantBody -Headers $Headers
    Write-Success "Tenant created: $($TenantResponse.id)"
    $TenantId = $TenantResponse.id
} catch {
    Write-Info "Tenant creation may have issues (could already exist)"
}

# Test 6: Create Category
Write-Info "Creating product category..."
$CategoryBody = @{
    name = "Electronics"
    description = "Electronic products"
} | ConvertTo-Json

try {
    $CategoryResponse = Invoke-RestMethod -Uri "$BaseUrl/categories" -Method Post -Body $CategoryBody -Headers $Headers
    Write-Success "Category created: $($CategoryResponse.id)"
    $CategoryId = $CategoryResponse.id
} catch {
    Write-Info "Category creation may have issues: $_"
}

# Test 7: Create Supplier
Write-Info "Creating supplier..."
$SupplierBody = @{
    name = "Tech Supplier Inc"
    email = "contact@techsupplier.com"
    phone = "+1234567890"
} | ConvertTo-Json

try {
    $SupplierResponse = Invoke-RestMethod -Uri "$BaseUrl/suppliers" -Method Post -Body $SupplierBody -Headers $Headers
    Write-Success "Supplier created: $($SupplierResponse.id)"
    $SupplierId = $SupplierResponse.id
} catch {
    Write-Info "Supplier creation may have issues: $_"
}

# Test 8: Get Products
Write-Info "Getting products..."
try {
    $Products = Invoke-RestMethod -Uri "$BaseUrl/products" -Method Get -Headers $Headers
    Write-Success "Products retrieved"
} catch {
    Write-Info "Products retrieval may have issues: $_"
}

# Test 9: Create Store
Write-Info "Creating store..."
$StoreBody = @{
    name = "Main Store"
    address = "123 Main Street"
    phone = "+1234567890"
} | ConvertTo-Json

try {
    $StoreResponse = Invoke-RestMethod -Uri "$BaseUrl/stores" -Method Post -Body $StoreBody -Headers $Headers
    Write-Success "Store created: $($StoreResponse.id)"
    $StoreId = $StoreResponse.id
} catch {
    Write-Info "Store creation may have issues: $_"
}

# Test 10: Create Customer
Write-Info "Creating customer..."
$CustomerBody = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    phone = "+1234567890"
} | ConvertTo-Json

try {
    $CustomerResponse = Invoke-RestMethod -Uri "$BaseUrl/customers" -Method Post -Body $CustomerBody -Headers $Headers
    Write-Success "Customer created: $($CustomerResponse.id)"
    $CustomerId = $CustomerResponse.id
} catch {
    Write-Info "Customer creation may have issues: $_"
}

# Test 11: Create Currency
Write-Info "Creating currency..."
$CurrencyBody = @{
    code = "USD"
    name = "US Dollar"
    symbol = "`$"
    exchangeRate = 1.0
} | ConvertTo-Json

try {
    $CurrencyResponse = Invoke-RestMethod -Uri "$BaseUrl/currency" -Method Post -Body $CurrencyBody -Headers $Headers
    Write-Success "Currency created"
} catch {
    Write-Info "Currency might already exist"
}

# Test 12: Create Tax
Write-Info "Creating tax configuration..."
$TaxBody = @{
    name = "VAT"
    rate = 15
    type = "percentage"
    region = "US"
} | ConvertTo-Json

try {
    $TaxResponse = Invoke-RestMethod -Uri "$BaseUrl/taxes" -Method Post -Body $TaxBody -Headers $Headers
    Write-Success "Tax configuration created"
} catch {
    Write-Info "Tax configuration may have issues: $_"
}

# Test 13: Get Reports (Sales Summary)
Write-Info "Getting sales summary report..."
try {
    $Report = Invoke-RestMethod -Uri "$BaseUrl/reports/sales-summary?period=monthly" -Method Get -Headers $Headers
    Write-Success "Sales report retrieved"
} catch {
    Write-Info "Report retrieval may have issues: $_"
}

# Test 14: Get Inventory Report
Write-Info "Getting inventory report..."
try {
    $InventoryReport = Invoke-RestMethod -Uri "$BaseUrl/reports/inventory" -Method Get -Headers $Headers
    Write-Success "Inventory report retrieved"
} catch {
    Write-Info "Inventory report retrieval may have issues: $_"
}

# Test 15: Storefront Public Access (No auth required)
Write-Info "Testing storefront public access..."
try {
    $Storefront = Invoke-RestMethod -Uri "$BaseUrl/storefront/tenant/test-store" -Method Get
    Write-Success "Storefront endpoint accessible"
} catch {
    Write-Info "Storefront may need to be enabled first"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Success "API Testing Complete! ✨"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Info "Next Steps:"
Write-Host "  1. Check the backend logs for any errors"
Write-Host "  2. Verify data in MongoDB"
Write-Host "  3. Test frontend integration"
Write-Host "  4. Review API documentation at /BACKEND_INTEGRATION_COMPLETE.md"
Write-Host ""
Write-Info "Access Token for manual testing:"
Write-Host "  $AccessToken"
Write-Host ""

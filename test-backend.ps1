# ------------------------------
# Тест backend магазина одежды
# Полностью на английском, чтобы PowerShell не падал
# ------------------------------

chcp 65001
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

# 1️⃣ Регистрация
$registerBody = @{
    email = "user1@test.com"
    password = "123456"
} | ConvertTo-Json

Write-Host "Registering user..."
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Register response:" ($registerResponse | ConvertTo-Json)
} catch {
    Write-Host "Error in registration: $_"
}
Write-Host "-------------------------------"

# 2️⃣ Login
$loginBody = @{
    email = "user1@test.com"
    password = "123456"
} | ConvertTo-Json

Write-Host "Logging in..."
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $userToken = $loginResponse.token
    Write-Host "User token:" $userToken
} catch {
    Write-Host "Login error: $_"
}
Write-Host "-------------------------------"

# 3️⃣ Get all products
Write-Host "Getting all products..."
try {
    $products = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method GET
    Write-Host ($products | ConvertTo-Json)
} catch {
    Write-Host "Error getting products: $_"
}
Write-Host "-------------------------------"

# Use first product for test
$productId = $products[0].id
Write-Host "Using productId for order test:" $productId
Write-Host "-------------------------------"

# 4️⃣ Create order
$orderBody = @{
    items = @(@{productId = $productId; quantity = 2})
} | ConvertTo-Json

Write-Host "Creating order..."
try {
    $orderResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method POST -Headers @{Authorization="Bearer $userToken"} -Body $orderBody -ContentType "application/json"
    Write-Host "Order response:" ($orderResponse | ConvertTo-Json)
} catch {
    Write-Host "Order creation error: $_"
}
Write-Host "-------------------------------"

# 5️⃣ Get user orders
Write-Host "Getting user orders..."
try {
    $userOrders = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method GET -Headers @{Authorization="Bearer $userToken"}
    Write-Host ($userOrders | ConvertTo-Json)
} catch {
    Write-Host "Error getting orders: $_"
}
Write-Host "-------------------------------"

Write-Host "All tests done ✅"
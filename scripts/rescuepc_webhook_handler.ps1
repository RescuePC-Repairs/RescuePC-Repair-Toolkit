# 🔧 RESCUEPC REPAIRS - ENHANCED WEBHOOK HANDLER
# Automatically detects package type and generates correct licenses

param(
    [Parameter(Mandatory=$false)]
    [string]$TestWebhook,
    
    [Parameter(Mandatory=$false)]
    [string]$WebhookData,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowStatus
)

# Configuration paths
$configDir = "configuration"
$packageConfigFile = "$configDir/package_config.json"
$stripeConfigFile = "$configDir/stripe_config.json"
$customerDbFile = "$configDir/rescuepc_customers.json"
$licenseDir = "$configDir/licenses"
$emailDir = "emails"
$logsDir = "logs/webhook"

# Create directories if they don't exist
$directories = @($configDir, $licenseDir, $emailDir, $logsDir)
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Load configuration
function Get-PackageConfig {
    if (Test-Path $packageConfigFile) {
        $config = Get-Content $packageConfigFile | ConvertFrom-Json
        return $config
    }
    return $null
}

function Get-StripeConfig {
    if (Test-Path $stripeConfigFile) {
        $config = Get-Content $stripeConfigFile | ConvertFrom-Json
        return $config
    }
    return $null
}

# Generate license key
function New-LicenseKey {
    param(
        [string]$PackageType,
        [int]$Quantity = 1
    )
    
    $config = Get-PackageConfig
    $licenseConfig = $config.license_generation
    
    $licenses = @()
    
    for ($i = 1; $i -le $Quantity; $i++) {
        $random = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count $licenseConfig.random_length | ForEach-Object {[char]$_})
        $licenseKey = $licenseConfig.format -replace "{prefix}", $licenseConfig.prefix -replace "{year}", $licenseConfig.year -replace "{package}", $PackageType -replace "{random}", $random
        $licenses += $licenseKey
    }
    
    return $licenses
}

# Detect package from Stripe webhook data
function Get-PackageFromWebhook {
    param($WebhookData)
    
    $config = Get-PackageConfig
    if (!$config) {
        Write-Host "❌ Package configuration not found" -ForegroundColor Red
        return $null
    }
    
    # Try to detect package by payment link
    if ($WebhookData.data.object.charges.data[0].receipt_url) {
        $receiptUrl = $WebhookData.data.object.charges.data[0].receipt_url
        foreach ($packageKey in $config.packages.PSObject.Properties.Name) {
            $package = $config.packages.$packageKey
            if ($package.stripe_payment_link -and $receiptUrl -like "*$($package.stripe_payment_link)*") {
                return @{
                    package_key = $packageKey
                    package = $package
                }
            }
        }
    }
    
    # Try to detect by price ID
    if ($WebhookData.data.object.line_items.data[0].price.id) {
        $priceId = $WebhookData.data.object.line_items.data[0].price.id
        foreach ($packageKey in $config.packages.PSObject.Properties.Name) {
            $package = $config.packages.$packageKey
            if ($package.stripe_price_id -and $priceId -eq $package.stripe_price_id) {
                return @{
                    package_key = $packageKey
                    package = $package
                }
            }
        }
    }
    
    # Try to detect by amount
    $amount = $WebhookData.data.object.amount / 100  # Convert from cents
    foreach ($packageKey in $config.packages.PSObject.Properties.Name) {
        $package = $config.packages.$packageKey
        if ($package.price -eq $amount) {
            return @{
                package_key = $packageKey
                package = $package
            }
        }
    }
    
    Write-Host "❌ Could not detect package from webhook data" -ForegroundColor Red
    return $null
}

# Generate email content
function Get-EmailContent {
    param(
        [string]$PackageName,
        [string]$LicenseType,
        [string]$LicenseQuantity,
        [array]$Licenses,
        [string]$CustomerEmail,
        [string]$CustomerName
    )
    
    $emailContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your RescuePC Repairs License</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .license-box { background: white; border: 2px solid #2563eb; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .step { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #2563eb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 RescuePC Repairs</h1>
            <h2>Your $PackageName is Ready!</h2>
        </div>
        
        <div class="content">
            <p>Hello $CustomerName,</p>
            
            <p>Thanks for choosing RescuePC Repairs — your all-in-one solution for cybersecurity and performance repair. You're now just a few steps away from a cleaner, safer, faster PC.</p>
            
            <h3>📦 Your Package Details:</h3>
            <ul>
                <li><strong>Package:</strong> $PackageName</li>
                <li><strong>License Type:</strong> $LicenseType</li>
                <li><strong>Quantity:</strong> $LicenseQuantity</li>
            </ul>
            
            <h3>🔑 Your License Key(s):</h3>
"@

    foreach ($license in $Licenses) {
        $emailContent += @"
            <div class="license-box">
                <strong>License Key:</strong> $license
            </div>
"@
    }

    $emailContent += @"
            
            <h3>🚀 Here's how to get started:</h3>
            
            <div class="step">
                <h4>🔽 Step 1: Download 7-Zip</h4>
                <p>You'll need 7-Zip to open your RescuePC Repairs toolkit.</p>
                <p>👉 <a href="https://www.microsoft.com/store/apps/9NBLGGH388N8">Download 7-Zip from Microsoft store</a></p>
            </div>
            
            <div class="step">
                <h4>📦 Step 2: Extract Your Toolkit</h4>
                <ul>
                    <li>Open the 7-Zip app.</li>
                    <li>Navigate to your downloaded RescuePC Repairs zip file.</li>
                    <li>Right-click the file > "Open with 7-Zip" > Click Extract.</li>
                    <li>Enter this password when prompted: <strong>FixMyPC!2025</strong></li>
                </ul>
            </div>
            
            <div class="step">
                <h4>🛠️ Step 3: Launch & Activate</h4>
                <ul>
                    <li>Open the newly extracted RescuePC Repairs folder.</li>
                    <li>Double-click rescuepcrepairs.exe to start the program.</li>
                    <li>When prompted, enter your license key(s) from above.</li>
                </ul>
            </div>
            
            <p>If you run into any issues, we're here for you. You can always reply to this email or visit us at <a href="https://rescuepcrepairs.com">rescuepcrepairs.com</a>.</p>
            
            <p>Thanks again for trusting us with your PC's health. Here's to smooth performance and peace of mind.</p>
            
            <p>Best,<br>
            Tyler Keesee<br>
            CEO, RescuePC Repairs</p>
        </div>
        
        <div class="footer">
            <p>📧 <a href="mailto:***REMOVED***">***REMOVED***</a><br>
            🌐 <a href="https://rescuepcrepairs.com">rescuepcrepairs.com</a></p>
        </div>
    </div>
</body>
</html>
"@

    return $emailContent
}

# Save license to file
function Save-License {
    param(
        [string]$CustomerEmail,
        [string]$PackageName,
        [array]$Licenses,
        [string]$LicenseType
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $licenseFile = "$licenseDir/license_$($CustomerEmail.Replace('@', '_').Replace('.', '_'))_$timestamp.json"
    
    $licenseData = @{
        customer_email = $CustomerEmail
        package_name = $PackageName
        license_type = $LicenseType
        licenses = $Licenses
        generated_date = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        expires_date = if ($LicenseType -eq "lifetime") { "Never" } else { (Get-Date).AddYears(1).ToString("yyyy-MM-dd HH:mm:ss") }
    }
    
    $licenseData | ConvertTo-Json -Depth 10 | Set-Content $licenseFile
    return $licenseFile
}

# Update customer database
function Update-CustomerDatabase {
    param(
        [string]$CustomerEmail,
        [string]$CustomerName,
        [string]$PackageName,
        [array]$Licenses,
        [decimal]$Amount
    )
    
    $customerDb = if (Test-Path $customerDbFile) {
        Get-Content $customerDbFile | ConvertFrom-Json
    } else {
        @{
            customers = @()
            totalRevenue = 0
            totalLicenses = 0
            lastUpdated = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
    }
    
    $newCustomer = @{
        email = $CustomerEmail
        name = $CustomerName
        package = $PackageName
        licenses = $Licenses
        amount = $Amount
        purchase_date = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        license_count = $Licenses.Count
    }
    
    $customerDb.customers += $newCustomer
    $customerDb.totalRevenue += $Amount
    $customerDb.totalLicenses += $Licenses.Count
    $customerDb.lastUpdated = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    
    $customerDb | ConvertTo-Json -Depth 10 | Set-Content $customerDbFile
}

# Process webhook
function Process-Webhook {
    param($WebhookData)
    
    try {
        Write-Host "🔍 Processing webhook..." -ForegroundColor Yellow
        
        # Extract customer information
        $customerEmail = $WebhookData.data.object.customer_details.email
        $customerName = $WebhookData.data.object.customer_details.name
        $amount = $WebhookData.data.object.amount / 100
        
        Write-Host "📧 Customer: $customerEmail" -ForegroundColor Cyan
        Write-Host "💰 Amount: $amount" -ForegroundColor Cyan
        
        # Detect package
        $packageInfo = Get-PackageFromWebhook -WebhookData $WebhookData
        if (!$packageInfo) {
            Write-Host "❌ Could not detect package" -ForegroundColor Red
            return $false
        }
        
        $package = $packageInfo.package
        $packageKey = $packageInfo.package_key
        
        Write-Host "📦 Package: $($package.name)" -ForegroundColor Green
        Write-Host "🔑 License Type: $($package.license_type)" -ForegroundColor Green
        Write-Host "📊 Quantity: $($package.license_quantity)" -ForegroundColor Green
        
        # Generate licenses
        $licenseQuantity = if ($package.license_quantity -eq "unlimited") { 1 } else { $package.license_quantity }
        $licenses = New-LicenseKey -PackageType $packageKey -Quantity $licenseQuantity
        
        Write-Host "🔑 Generated $($licenses.Count) license(s)" -ForegroundColor Green
        
        # Save license
        $licenseFile = Save-License -CustomerEmail $customerEmail -PackageName $package.name -Licenses $licenses -LicenseType $package.license_type
        Write-Host "💾 License saved to: $licenseFile" -ForegroundColor Green
        
        # Generate email content
        $emailContent = Get-EmailContent -PackageName $package.name -LicenseType $package.license_type -LicenseQuantity $package.license_quantity -Licenses $licenses -CustomerEmail $customerEmail -CustomerName $customerName
        
        # Save email
        $emailFile = "$emailDir/email_$($customerEmail.Replace('@', '_').Replace('.', '_'))_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').html"
        $emailContent | Set-Content $emailFile
        Write-Host "📧 Email saved to: $emailFile" -ForegroundColor Green
        
        # Update customer database
        Update-CustomerDatabase -CustomerEmail $customerEmail -CustomerName $customerName -PackageName $package.name -Licenses $licenses -Amount $amount
        Write-Host "📊 Customer database updated" -ForegroundColor Green
        
        # Log success
        $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - SUCCESS - $customerEmail - $($package.name) - $($licenses.Count) licenses"
        Add-Content -Path "$logsDir/webhook_success.log" -Value $logEntry
        
        Write-Host "✅ Webhook processed successfully!" -ForegroundColor Green
        return $true
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-Host "❌ Error processing webhook: $errorMsg" -ForegroundColor Red
        
        # Log error
        $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - ERROR - $errorMsg"
        Add-Content -Path "$logsDir/webhook_errors.log" -Value $logEntry
        
        return $false
    }
}

# Test webhook with sample data
function Test-WebhookProcessing {
    Write-Host "🧪 Testing webhook processing..." -ForegroundColor Yellow
    
    $testWebhookData = @{
        data = @{
            object = @{
                customer_details = @{
                    email = "test@example.com"
                    name = "Test Customer"
                }
                amount = 49999  # $499.99 in cents
                charges = @{
                    data = @(
                        @{
                            receipt_url = "https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01"
                        }
                    )
                }
                line_items = @{
                    data = @(
                        @{
                            price = @{
                                id = "price_lifetime_enterprise_id_here"
                            }
                        }
                    )
                }
            }
        }
    }
    
    $result = Process-Webhook -WebhookData $testWebhookData
    if ($result) {
        Write-Host "✅ Test webhook processing successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Test webhook processing failed!" -ForegroundColor Red
    }
}

# Show system status
function Show-WebhookStatus {
    Write-Host "📊 RESCUEPC REPAIRS - WEBHOOK SYSTEM STATUS" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Cyan
    
    # Check configuration files
    $configs = @(
        @{Path=$packageConfigFile; Name="Package Configuration"},
        @{Path=$stripeConfigFile; Name="Stripe Configuration"},
        @{Path=$customerDbFile; Name="Customer Database"}
    )
    
    foreach ($config in $configs) {
        if (Test-Path $config.Path) {
            Write-Host "✅ $($config.Name)" -ForegroundColor Green
        } else {
            Write-Host "❌ $($config.Name)" -ForegroundColor Red
        }
    }
    
    # Show package information
    $packageConfig = Get-PackageConfig
    if ($packageConfig) {
        Write-Host ""
        Write-Host "📦 Available Packages:" -ForegroundColor Yellow
        foreach ($packageKey in $packageConfig.packages.PSObject.Properties.Name) {
            $package = $packageConfig.packages.$packageKey
            Write-Host "   $($package.name) - $($package.price) - $($package.license_quantity) licenses" -ForegroundColor White
        }
    }
    
    # Show recent activity
    if (Test-Path "$logsDir/webhook_success.log") {
        Write-Host ""
        Write-Host "📈 Recent Activity:" -ForegroundColor Yellow
        $recentLogs = Get-Content "$logsDir/webhook_success.log" | Select-Object -Last 5
        foreach ($log in $recentLogs) {
            Write-Host "   $log" -ForegroundColor White
        }
    }
}

# Main execution
try {
    if ($TestWebhook) {
        Test-WebhookProcessing
    }
    elseif ($ShowStatus) {
        Show-WebhookStatus
    }
    elseif ($WebhookData) {
        $webhookJson = $WebhookData | ConvertFrom-Json
        Process-Webhook -WebhookData $webhookJson
    }
    else {
        Write-Host "🔧 RESCUEPC REPAIRS - ENHANCED WEBHOOK HANDLER" -ForegroundColor Cyan
        Write-Host "=" * 60 -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage:" -ForegroundColor Yellow
        Write-Host "  .\rescuepc_webhook_handler.ps1 -TestWebhook" -ForegroundColor White
        Write-Host "  .\rescuepc_webhook_handler.ps1 -ShowStatus" -ForegroundColor White
        Write-Host "  .\rescuepc_webhook_handler.ps1 -WebhookData '{\"webhook\":\"data\"}'" -ForegroundColor White
        Write-Host ""
        Show-WebhookStatus
    }
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 
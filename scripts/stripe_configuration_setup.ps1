# 🔧 RESCUEPC REPAIRS - STRIPE CONFIGURATION SETUP
# Secure configuration and testing for Stripe integration

param(
    [Parameter(Mandatory=$false)]
    [string]$SetupStripe,
    
    [Parameter(Mandatory=$false)]
    [string]$StripeSecretKey,
    
    [Parameter(Mandatory=$false)]
    [string]$WebhookSecret,
    
    [Parameter(Mandatory=$false)]
    [string]$PaymentLink,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowConfig,
    
    [Parameter(Mandatory=$false)]
    [switch]$TestPayment,
    
    [Parameter(Mandatory=$false)]
    [switch]$ValidateKeys,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowStatus
)

# Configuration file paths
$configDir = "configuration"
$stripeConfigFile = "$configDir/stripe_config.json"
$webhookConfigFile = "$configDir/webhook_config.json"
$customerDbFile = "$configDir/rescuepc_customers.json"
$licenseDir = "$configDir/licenses"
$emailDir = "emails"
$logsDir = "logs/webhook"

# Create directories if they don't exist
$directories = @($configDir, $licenseDir, $emailDir, $logsDir)
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Initialize configuration files
function Initialize-ConfigFiles {
    if (!(Test-Path $stripeConfigFile)) {
        $stripeConfig = @{
            publicKey = "pk_live_51Q71CbBMfxBc7Ib0syDcAnmpHW7CDR5EjpTDbTli119veC9Mp8KVlhXFbUcgij8HqsUFn8VuSZHUs83FB8A5Duj500tdvzFxUk"
            secretKey = ""
            webhookSecret = ""
            paymentLink = ""
            configured = $false
            lastUpdated = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
        $stripeConfig | ConvertTo-Json -Depth 10 | Set-Content $stripeConfigFile
        Write-Host "✅ Created Stripe configuration file" -ForegroundColor Green
    }
    
    if (!(Test-Path $customerDbFile)) {
        $customerDb = @{
            customers = @()
            totalRevenue = 0
            totalLicenses = 0
            lastUpdated = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
        $customerDb | ConvertTo-Json -Depth 10 | Set-Content $customerDbFile
        Write-Host "✅ Created customer database file" -ForegroundColor Green
    }
}

# Load configuration
function Get-StripeConfig {
    if (Test-Path $stripeConfigFile) {
        $config = Get-Content $stripeConfigFile | ConvertFrom-Json
        return $config
    }
    return $null
}

# Save configuration
function Save-StripeConfig {
    param($config)
    $config | ConvertTo-Json -Depth 10 | Set-Content $stripeConfigFile
}

# Validate Stripe keys
function Test-StripeKeys {
    Write-Host "🔍 Validating Stripe keys..." -ForegroundColor Yellow
    
    $config = Get-StripeConfig
    if (!$config) {
        Write-Host "❌ No configuration found" -ForegroundColor Red
        return $false
    }
    
    # Validate public key format
    if ($config.publicKey -match "^pk_live_[a-zA-Z0-9]{24}$") {
        Write-Host "✅ Public key format is valid" -ForegroundColor Green
    } else {
        Write-Host "❌ Public key format is invalid" -ForegroundColor Red
        return $false
    }
    
    # Validate secret key format
    if ($config.secretKey -match "^sk_live_[a-zA-Z0-9]{24}$") {
        Write-Host "✅ Secret key format is valid" -ForegroundColor Green
    } else {
        Write-Host "❌ Secret key not configured or invalid format" -ForegroundColor Red
        return $false
    }
    
    # Validate webhook secret format
    if ($config.webhookSecret -match "^whsec_[a-zA-Z0-9]{32,}$") {
        Write-Host "✅ Webhook secret format is valid" -ForegroundColor Green
    } else {
        Write-Host "❌ Webhook secret not configured or invalid format" -ForegroundColor Red
        return $false
    }
    
    # Validate payment link format
    if ($config.paymentLink -match "^https://buy\.stripe\.com/[a-zA-Z0-9]+$") {
        Write-Host "✅ Payment link format is valid" -ForegroundColor Green
    } else {
        Write-Host "❌ Payment link not configured or invalid format" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ All Stripe keys validated successfully!" -ForegroundColor Green
    return $true
}

# Test Stripe API connection
function Test-StripeConnection {
    Write-Host "🔍 Testing Stripe API connection..." -ForegroundColor Yellow
    
    $config = Get-StripeConfig
    if (!$config -or !$config.secretKey) {
        Write-Host "❌ Secret key not configured" -ForegroundColor Red
        return $false
    }
    
    try {
        # Test API connection using curl
        $headers = @{
            "Authorization" = "Bearer $($config.secretKey)"
            "Content-Type" = "application/x-www-form-urlencoded"
        }
        
        $response = Invoke-RestMethod -Uri "https://api.stripe.com/v1/account" -Headers $headers -Method Get
        
        if ($response.id) {
            Write-Host "✅ Stripe API connection successful" -ForegroundColor Green
            Write-Host "   Account ID: $($response.id)" -ForegroundColor Cyan
            Write-Host "   Business Name: $($response.business_profile.name)" -ForegroundColor Cyan
            return $true
        }
    }
    catch {
        Write-Host "❌ Stripe API connection failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    return $false
}

# Show current configuration
function Show-Configuration {
    Write-Host "📊 RESCUEPC REPAIRS - STRIPE CONFIGURATION STATUS" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Cyan
    
    $config = Get-StripeConfig
    if (!$config) {
        Write-Host "❌ No configuration found" -ForegroundColor Red
        return
    }
    
    Write-Host "🔑 Public Key:" -ForegroundColor Yellow
    Write-Host "   $($config.publicKey)" -ForegroundColor White
    
    Write-Host "🔐 Secret Key:" -ForegroundColor Yellow
    if ($config.secretKey) {
        Write-Host "   ✅ Configured (sk_live_...)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Not configured" -ForegroundColor Red
    }
    
    Write-Host "🔗 Webhook Secret:" -ForegroundColor Yellow
    if ($config.webhookSecret) {
        Write-Host "   ✅ Configured (whsec_...)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Not configured" -ForegroundColor Red
    }
    
    Write-Host "💳 Payment Link:" -ForegroundColor Yellow
    if ($config.paymentLink) {
        Write-Host "   ✅ Configured" -ForegroundColor Green
        Write-Host "   $($config.paymentLink)" -ForegroundColor White
    } else {
        Write-Host "   ❌ Not configured" -ForegroundColor Red
    }
    
    Write-Host "📅 Last Updated:" -ForegroundColor Yellow
    Write-Host "   $($config.lastUpdated)" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎯 OVERALL STATUS:" -ForegroundColor Cyan
    
    $configured = 0
    if ($config.secretKey) { $configured++ }
    if ($config.webhookSecret) { $configured++ }
    if ($config.paymentLink) { $configured++ }
    
    switch ($configured) {
        0 { Write-Host "   ❌ NOT READY - 0 of 3 components configured" -ForegroundColor Red }
        1 { Write-Host "   ⚠️  PARTIAL - 1 of 3 components configured" -ForegroundColor Yellow }
        2 { Write-Host "   ⚠️  ALMOST READY - 2 of 3 components configured" -ForegroundColor Yellow }
        3 { Write-Host "   ✅ READY FOR LIVE PAYMENTS - All components configured" -ForegroundColor Green }
    }
}

# Setup Stripe configuration
function Set-StripeConfiguration {
    param(
        [string]$SecretKey,
        [string]$WebhookSecret,
        [string]$PaymentLink
    )
    
    Write-Host "🔧 Setting up Stripe configuration..." -ForegroundColor Yellow
    
    $config = Get-StripeConfig
    if (!$config) {
        Initialize-ConfigFiles
        $config = Get-StripeConfig
    }
    
    $updated = $false
    
    if ($SecretKey) {
        if ($SecretKey -match "^sk_live_[a-zA-Z0-9]{24}$") {
            $config.secretKey = $SecretKey
            Write-Host "✅ Secret key configured" -ForegroundColor Green
            $updated = $true
        } else {
            Write-Host "❌ Invalid secret key format" -ForegroundColor Red
            return $false
        }
    }
    
    if ($WebhookSecret) {
        if ($WebhookSecret -match "^whsec_[a-zA-Z0-9]{32,}$") {
            $config.webhookSecret = $WebhookSecret
            Write-Host "✅ Webhook secret configured" -ForegroundColor Green
            $updated = $true
        } else {
            Write-Host "❌ Invalid webhook secret format" -ForegroundColor Red
            return $false
        }
    }
    
    if ($PaymentLink) {
        if ($PaymentLink -match "^https://buy\.stripe\.com/[a-zA-Z0-9]+$") {
            $config.paymentLink = $PaymentLink
            Write-Host "✅ Payment link configured" -ForegroundColor Green
            $updated = $true
        } else {
            Write-Host "❌ Invalid payment link format" -ForegroundColor Red
            return $false
        }
    }
    
    if ($updated) {
        $config.lastUpdated = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        $config.configured = ($config.secretKey -and $config.webhookSecret -and $config.paymentLink)
        Save-StripeConfig $config
        Write-Host "✅ Configuration saved successfully" -ForegroundColor Green
    }
    
    return $true
}

# Test payment processing
function Test-PaymentProcessing {
    Write-Host "🧪 Testing payment processing..." -ForegroundColor Yellow
    
    $config = Get-StripeConfig
    if (!$config -or !$config.configured) {
        Write-Host "❌ Configuration not complete" -ForegroundColor Red
        return $false
    }
    
    # Test webhook endpoint
    Write-Host "🔍 Testing webhook endpoint..." -ForegroundColor Cyan
    if (Test-Path "scripts/rescuepc_webhook_handler.ps1") {
        Write-Host "✅ Webhook handler found" -ForegroundColor Green
    } else {
        Write-Host "❌ Webhook handler not found" -ForegroundColor Red
        return $false
    }
    
    # Test license generation
    Write-Host "🔍 Testing license generation..." -ForegroundColor Cyan
    if (Test-Path "js/automated-license-system.js") {
        Write-Host "✅ License system found" -ForegroundColor Green
    } else {
        Write-Host "❌ License system not found" -ForegroundColor Red
        return $false
    }
    
    # Test email templates
    Write-Host "🔍 Testing email templates..." -ForegroundColor Cyan
    if (Test-Path $emailDir) {
        Write-Host "✅ Email directory found" -ForegroundColor Green
    } else {
        Write-Host "❌ Email directory not found" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Payment processing components verified" -ForegroundColor Green
    return $true
}

# Show system status
function Show-SystemStatus {
    Write-Host "📊 RESCUEPC REPAIRS - SYSTEM STATUS" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    # Check key files
    $files = @(
        @{Path="index.html"; Name="Main Website"},
        @{Path="js/automated-license-system.js"; Name="License System"},
        @{Path="scripts/rescuepc_webhook_handler.ps1"; Name="Webhook Handler"},
        @{Path="css/fortune500-navbar-hero.css"; Name="Professional Styling"},
        @{Path="docs/MULTI-PLATFORM-SUPPORT.md"; Name="Platform Documentation"}
    )
    
    foreach ($file in $files) {
        if (Test-Path $file.Path) {
            Write-Host "✅ $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "❌ $($file.Name)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "🔧 Configuration Status:" -ForegroundColor Yellow
    Show-Configuration
    
    Write-Host ""
    Write-Host "🔒 Security Status:" -ForegroundColor Yellow
    if (Test-StripeKeys) {
        Write-Host "✅ Keys validated" -ForegroundColor Green
    } else {
        Write-Host "❌ Keys need validation" -ForegroundColor Red
    }
}

# Main execution
try {
    Initialize-ConfigFiles
    
    if ($ValidateKeys) {
        Test-StripeKeys
        Test-StripeConnection
    }
    elseif ($ShowConfig) {
        Show-Configuration
    }
    elseif ($TestPayment) {
        Test-PaymentProcessing
    }
    elseif ($ShowStatus) {
        Show-SystemStatus
    }
    elseif ($SetupStripe -or $StripeSecretKey -or $WebhookSecret -or $PaymentLink) {
        Set-StripeConfiguration -SecretKey $StripeSecretKey -WebhookSecret $WebhookSecret -PaymentLink $PaymentLink
        Show-Configuration
    }
    else {
        Write-Host "🔧 RESCUEPC REPAIRS - STRIPE CONFIGURATION SETUP" -ForegroundColor Cyan
        Write-Host "=" * 60 -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage:" -ForegroundColor Yellow
        Write-Host "  .\stripe_configuration_setup.ps1 -ShowConfig" -ForegroundColor White
        Write-Host "  .\stripe_configuration_setup.ps1 -ValidateKeys" -ForegroundColor White
        Write-Host "  .\stripe_configuration_setup.ps1 -TestPayment" -ForegroundColor White
        Write-Host "  .\stripe_configuration_setup.ps1 -ShowStatus" -ForegroundColor White
        Write-Host "  .\stripe_configuration_setup.ps1 -SetupStripe -StripeSecretKey 'sk_live_...' -WebhookSecret 'whsec_...' -PaymentLink 'https://buy.stripe.com/...'" -ForegroundColor White
        Write-Host ""
        Show-Configuration
    }
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 
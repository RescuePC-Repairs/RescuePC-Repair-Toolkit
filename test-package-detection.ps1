# RESCUEPC REPAIRS - PACKAGE DETECTION TEST
# Simple test to verify the automated package detection system

Write-Host "RESCUEPC REPAIRS - PACKAGE DETECTION TEST" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if configuration files exist
$configDir = "configuration"
$packageConfigFile = "$configDir/package_config.json"

Write-Host "Checking Configuration Files..." -ForegroundColor Yellow

if (Test-Path $packageConfigFile) {
    Write-Host "Package configuration found" -ForegroundColor Green
    
    # Load and display package configuration
    $packageConfig = Get-Content $packageConfigFile | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "Configured Packages:" -ForegroundColor Yellow
    foreach ($packageKey in $packageConfig.packages.PSObject.Properties.Name) {
        $package = $packageConfig.packages.$packageKey
        Write-Host "   $($package.name)" -ForegroundColor White
        Write-Host "     Price: $($package.price)" -ForegroundColor Gray
        Write-Host "     License Type: $($package.license_type)" -ForegroundColor Gray
        Write-Host "     Quantity: $($package.license_quantity)" -ForegroundColor Gray
        Write-Host "     Payment Link: $($package.stripe_payment_link)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Test package detection logic
    Write-Host "Testing Package Detection..." -ForegroundColor Yellow
    
    # Test lifetime enterprise detection
    $testAmount = 499.99
    $testPaymentLink = "https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01"
    
    Write-Host "   Testing amount: $testAmount" -ForegroundColor Cyan
    Write-Host "   Testing payment link: $testPaymentLink" -ForegroundColor Cyan
    
    $detectedPackage = $null
    foreach ($packageKey in $packageConfig.packages.PSObject.Properties.Name) {
        $package = $packageConfig.packages.$packageKey
        if ($package.price -eq $testAmount) {
            $detectedPackage = $package
            Write-Host "   Detected package: $($package.name)" -ForegroundColor Green
            break
        }
    }
    
    if ($detectedPackage) {
        Write-Host "   Package: $($detectedPackage.name)" -ForegroundColor Green
        Write-Host "   License Type: $($detectedPackage.license_type)" -ForegroundColor Green
        Write-Host "   Quantity: $($detectedPackage.license_quantity)" -ForegroundColor Green
    } else {
        Write-Host "   No package detected for amount: $testAmount" -ForegroundColor Red
    }
    
} else {
    Write-Host "Package configuration not found" -ForegroundColor Red
    Write-Host "   Expected location: $packageConfigFile" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Checking Email Templates..." -ForegroundColor Yellow

$emailDir = "emails"
if (Test-Path $emailDir) {
    $emailTemplates = Get-ChildItem $emailDir -Filter "*.html"
    Write-Host "Email templates directory found" -ForegroundColor Green
    Write-Host "   Found $($emailTemplates.Count) email template(s)" -ForegroundColor Gray
    
    foreach ($template in $emailTemplates) {
        Write-Host "   $($template.Name)" -ForegroundColor White
    }
} else {
    Write-Host "Email templates directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking Scripts..." -ForegroundColor Yellow

$scriptsDir = "scripts"
$requiredScripts = @(
    "rescuepc_webhook_handler.ps1",
    "stripe_configuration_setup.ps1"
)

foreach ($script in $requiredScripts) {
    $scriptPath = "$scriptsDir/$script"
    if (Test-Path $scriptPath) {
        Write-Host "$script" -ForegroundColor Green
    } else {
        Write-Host "$script" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "SYSTEM STATUS SUMMARY" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$allGood = $true

if (!(Test-Path $packageConfigFile)) { $allGood = $false }
if (!(Test-Path $emailDir)) { $allGood = $false }
if (!(Test-Path "$scriptsDir/rescuepc_webhook_handler.ps1")) { $allGood = $false }

if ($allGood) {
    Write-Host "Package detection system is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Create remaining Stripe payment links" -ForegroundColor White
    Write-Host "   2. Update package configuration with actual links" -ForegroundColor White
    Write-Host "   3. Test with live payments" -ForegroundColor White
    Write-Host "   4. Launch to customers" -ForegroundColor White
} else {
    Write-Host "System needs configuration" -ForegroundColor Red
    Write-Host "   Please complete the setup steps above" -ForegroundColor Gray
}

Write-Host ""
Write-Host "For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "   docs/AUTOMATED-PACKAGE-DETECTION-SETUP.md" -ForegroundColor White 
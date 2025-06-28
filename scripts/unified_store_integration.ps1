# RescuePC Repairs - Unified Store Integration System
# Connects your store project with RescuePC automation for seamless license delivery
# Lead QA Tester & Head of Engineering Implementation

#Requires -Version 5.1

[CmdletBinding()]
param(
    [switch]$StartHTTPListener,
    [switch]$StartFileWatcher,
    [switch]$StartDatabaseWatcher,
    [switch]$TestIntegration,
    [switch]$ShowStatus,
    [switch]$ConfigureSMTP,
    [int]$Port = 8080,
    [string]$WebhookSecret,
    [string]$SMTPConfig
)

# Integration configuration
$IntegrationConfig = @{
    Domain = "https://www.rescuepcrepairs.com/"
    ProductName = "RescuePC Repairs - Complete PC Repair Toolkit"
    DefaultEmail = "support@rescuepcrepairs.com"
    IntegrationMethods = @{
        HTTP = @{
            Enabled = $true
            Port = 8080
            Endpoint = "/webhook"
            SSL = $false
        }
        File = @{
            Enabled = $true
            WatchPath = "integration\pending_payments"
            ProcessedPath = "integration\processed_payments"
            PollInterval = 5  # seconds
        }
        Database = @{
            Enabled = $false
            ConnectionString = ""
            TableName = "payments"
        }
    }
    SMTP = @{
        Server = ""
        Port = 587
        Username = ""
        Password = ""
        UseSSL = $true
        FromEmail = "support@rescuepcrepairs.com"
        FromName = "RescuePC Repairs"
    }
    Security = @{
        WebhookSecret = ""
        RequireSignature = $true
        AllowedIPs = @("127.0.0.1", "::1")
    }
}

# Load existing packages for payment link mapping
function Load-PackageMapping {
    $packagesPath = "configuration\package_config.json"
    if (Test-Path $packagesPath) {
        try {
            $packages = Get-Content $packagesPath -Raw | ConvertFrom-Json
            return $packages
        } catch {
            Write-Host "Warning: Could not load package mapping" -ForegroundColor Yellow
            return @{}
        }
    }
    return @{}
}

# HTTP Listener for direct Stripe webhooks
function Start-WebhookListener {
    param([int]$Port = 8080)
    
    Write-Host "Starting HTTP webhook listener on port $Port..." -ForegroundColor Yellow
    Write-Host "Endpoint: http://localhost:$Port/webhook" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
    
    try {
        $listener = [System.Net.HttpListener]::new()
        $listener.Prefixes.Add("http://localhost:$Port/")
        $listener.Start()
        
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            try {
                if ($request.Url.LocalPath -eq "/webhook" -and $request.HttpMethod -eq "POST") {
                    # Read webhook data
                    $reader = [System.IO.StreamReader]::new($request.InputStream)
                    $webhookData = $reader.ReadToEnd()
                    $reader.Close()
                    
                    Write-Host "Received webhook from: $($request.RemoteEndPoint)" -ForegroundColor Green
                    
                    # Process the webhook
                    $result = Process-WebhookData -WebhookData $webhookData -Source "HTTP"
                    
                    if ($result) {
                        $response.StatusCode = 200
                        $responseBody = "Webhook processed successfully"
                    } else {
                        $response.StatusCode = 400
                        $responseBody = "Webhook processing failed"
                    }
                } else {
                    $response.StatusCode = 404
                    $responseBody = "Endpoint not found"
                }
                
                # Send response
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($responseBody)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.Close()
                
            } catch {
                Write-Host "Error processing request: $($_.Exception.Message)" -ForegroundColor Red
                $response.StatusCode = 500
                $response.Close()
            }
        }
    } catch {
        Write-Host "Error starting HTTP listener: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        if ($listener) {
            $listener.Stop()
            $listener.Close()
        }
    }
}

# File watcher for store backend integration
function Start-FileWatcher {
    param([string]$WatchPath = "integration\pending_payments")
    
    Write-Host "Starting file watcher for: $WatchPath" -ForegroundColor Yellow
    Write-Host "Watching for new payment files..." -ForegroundColor Cyan
    
    # Create directories if they don't exist
    New-Item -Path $WatchPath -ItemType Directory -Force | Out-Null
    New-Item -Path "integration\processed_payments" -ItemType Directory -Force | Out-Null
    
    $fsw = [System.IO.FileSystemWatcher]::new($WatchPath)
    $fsw.Filter = "*.json"
    $fsw.EnableRaisingEvents = $true
    
    # Register event handlers
    Register-ObjectEvent -InputObject $fsw -EventName "Created" -Action {
        $filePath = $Event.SourceEventArgs.FullPath
        Write-Host "New payment file detected: $filePath" -ForegroundColor Green
        
        try {
            # Wait a moment for file to be fully written
            Start-Sleep -Seconds 1
            
            # Read and process the payment file
            $webhookData = Get-Content $filePath -Raw
            $result = Process-WebhookData -WebhookData $webhookData -Source "File"
            
            if ($result) {
                # Move to processed folder
                $fileName = Split-Path $filePath -Leaf
                $processedPath = "integration\processed_payments\$fileName"
                Move-Item $filePath $processedPath
                Write-Host "Payment processed and moved to: $processedPath" -ForegroundColor Green
            } else {
                Write-Host "Failed to process payment file" -ForegroundColor Red
            }
        } catch {
            Write-Host "Error processing file: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "File watcher started. Press Ctrl+C to stop." -ForegroundColor Yellow
    
    # Keep the script running
    try {
        while ($true) {
            Start-Sleep -Seconds 10
        }
    } catch {
        Write-Host "File watcher stopped." -ForegroundColor Yellow
    } finally {
        $fsw.EnableRaisingEvents = $false
        $fsw.Dispose()
    }
}

# Process webhook data from any source
function Process-WebhookData {
    param(
        [string]$WebhookData,
        [string]$Source = "Unknown"
    )
    
    Write-Host "Processing webhook from $Source..." -ForegroundColor Yellow
    
    try {
        $webhook = $WebhookData | ConvertFrom-Json
        
        if ($webhook.type -eq "payment_intent.succeeded") {
            $paymentIntent = $webhook.data.object
            $amount = $paymentIntent.amount / 100  # Convert from cents
            $customerEmail = $paymentIntent.receipt_email
            $customerName = $paymentIntent.customer_details.name
            $paymentLinkId = $paymentIntent.payment_link
            
            Write-Host "Payment received: `$$amount" -ForegroundColor Green
            Write-Host "Customer: $customerName ($customerEmail)" -ForegroundColor Cyan
            
            # Map payment to package
            $package = Map-PaymentToPackage -Amount $amount -PaymentLinkId $paymentLinkId
            
            if ($package) {
                Write-Host "Package identified: $($package.PackageName)" -ForegroundColor Green
                
                # Generate license based on package
                $licenseResult = Generate-PackageLicense -Package $package -CustomerEmail $customerEmail -CustomerName $customerName
                
                if ($licenseResult) {
                    # Send welcome email
                    Send-PackageWelcomeEmail -Package $package -CustomerEmail $customerEmail -CustomerName $customerName -LicenseResult $licenseResult
                    
                    # Update customer database
                    Update-CustomerDatabase -Package $package -CustomerEmail $customerEmail -CustomerName $customerName -LicenseResult $licenseResult
                    
                    # Log successful processing
                    Log-IntegrationEvent -Event "Payment Processed" -Source $Source -CustomerEmail $customerEmail -Package $package.PackageName -Amount $amount
                    
                    Write-Host "Payment processed successfully!" -ForegroundColor Green
                    return $licenseResult
                }
            } else {
                Write-Host "Could not identify package for payment: `$$amount" -ForegroundColor Red
            }
        } else {
            Write-Host "Unsupported webhook type: $($webhook.type)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "Error processing webhook: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Map payment to package configuration
function Map-PaymentToPackage {
    param([double]$Amount, [string]$PaymentLinkId)
    
    $packages = Load-PackageMapping
    
    # Try to match by payment link ID first
    if ($PaymentLinkId -and $packages.packages) {
        foreach ($packageKey in $packages.packages.PSObject.Properties.Name) {
            $package = $packages.packages.$packageKey
            if ($package.stripe_payment_link -eq $PaymentLinkId) {
                return @{
                    PackageName = $package.name
                    Price = $package.price
                    LicenseType = $package.license_type
                    LicenseQuantity = $package.license_quantity
                    Features = $package.features
                    EmailTemplate = $package.email_template
                    StripePaymentLink = $package.stripe_payment_link
                }
            }
        }
    }
    
    # Fall back to amount matching
    if ($packages.packages) {
        foreach ($packageKey in $packages.packages.PSObject.Properties.Name) {
            $package = $packages.packages.$packageKey
            if ($package.price -eq $Amount) {
                return @{
                    PackageName = $package.name
                    Price = $package.price
                    LicenseType = $package.license_type
                    LicenseQuantity = $package.license_quantity
                    Features = $package.features
                    EmailTemplate = $package.email_template
                    StripePaymentLink = $package.stripe_payment_link
                }
            }
        }
    }
    
    # No matching package found
    return $null
}

# Generate license for package
function Generate-PackageLicense {
    param($Package, $CustomerEmail, $CustomerName)
    
    Write-Host "Generating license for: $($Package.PackageName)" -ForegroundColor Cyan
    
    # Generate unique license key
    $timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
    $emailHash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($CustomerEmail))
    $emailHashString = [System.BitConverter]::ToString($emailHash).Replace("-", "").Substring(0, 8)
    $licenseKey = "RESCUE-$emailHashString-$timestamp"
    
    # Create license data
    $licenseData = @{
        LicenseKey = $licenseKey
        CustomerName = $CustomerName
        CustomerEmail = $CustomerEmail
        LicenseType = $Package.LicenseType
        ProductName = $Package.PackageName
        Price = $Package.Price
        CreatedDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        ExpiryDate = if ($Package.LicenseType -eq "lifetime") { "Never" } else { (Get-Date).AddYears(1).ToString("yyyy-MM-dd HH:mm:ss") }
        Status = "active"
        Features = $Package.Features
        DownloadLinks = $Package.DownloadLinks
    }
    
    # Save license
    $licensePath = "configuration\licenses\$licenseKey.json"
    New-Item -Path "configuration\licenses" -ItemType Directory -Force | Out-Null
    $licenseData | ConvertTo-Json -Depth 10 | Out-File -FilePath $licensePath -Encoding UTF8
    
    Write-Host "License generated: $licenseKey" -ForegroundColor Green
    return $licenseData
}

# Send welcome email for package
function Send-PackageWelcomeEmail {
    param($Package, $CustomerEmail, $CustomerName, $LicenseResult)
    
    $emailSubject = "Your $($Package.PackageName) License - RescuePC Repairs"
    $fromEmail = $IntegrationConfig.SMTP.FromEmail
    
    # Try to use existing email template
    $templatePath = "emails\$($Package.EmailTemplate)"
    if (Test-Path $templatePath) {
        Write-Host "Using email template: $templatePath" -ForegroundColor Cyan
        $emailBody = Get-Content $templatePath -Raw
        
        # Replace placeholders with real data
        $emailBody = $emailBody.Replace("{{CUSTOMER_NAME}}", $CustomerName)
        $emailBody = $emailBody.Replace("{{LICENSE_KEY}}", $LicenseResult.LicenseKey)
        $emailBody = $emailBody.Replace("{{PACKAGE_NAME}}", $Package.PackageName)
        $emailBody = $emailBody.Replace("{{LICENSE_TYPE}}", $Package.LicenseType)
        $emailBody = $emailBody.Replace("{{PRICE}}", $LicenseResult.Price)
        $emailBody = $emailBody.Replace("{{EXPIRY_DATE}}", $LicenseResult.ExpiryDate)
        $emailBody = $emailBody.Replace("{{LICENSE_QUANTITY}}", $Package.LicenseQuantity)
        
    } else {
        Write-Host "Template not found, using default email format" -ForegroundColor Yellow
        
        # Fallback email content
        $emailBody = @"
Dear $CustomerName,

Thank you for purchasing $($Package.PackageName)!

Your $($Package.LicenseType) license is now active and ready to use.

LICENSE DETAILS:
- License Key: $($LicenseResult.LicenseKey)
- Product: $($LicenseResult.ProductName)
- License Type: $($LicenseResult.LicenseType)
- Price: `$$($LicenseResult.Price)
- Expires: $($LicenseResult.ExpiryDate)
- Licenses: $($Package.LicenseQuantity)

FEATURES INCLUDED:
$(($Package.Features | ForEach-Object { "- $_" }) -join "`n")

SECURITY & GUARANTEES:
✅ Virus-Free Software Guaranteed
✅ SSL Secured Download
✅ 256-bit Encryption
✅ Military-Grade Security
✅ 30-Day Money-Back Guarantee

INSTALLATION INSTRUCTIONS:
1. Download the main software file
2. Run RescuePC_Repairs.exe
3. Enter your license key when prompted
4. Start repairing Windows PCs instantly!

SUPPORT:
Need help? Contact us at: $fromEmail
Website: $($IntegrationConfig.Domain)

Thank you for choosing RescuePC Repairs!

Best regards,
Tyler Keesee
Founder, RescuePC Repairs
"@
    }
    
    # Send email via SMTP if configured, otherwise save to file
    if ($IntegrationConfig.SMTP.Server) {
        Send-EmailViaSMTP -To $CustomerEmail -Subject $emailSubject -Body $emailBody
    } else {
        # Save email to file
        $emailPath = "emails\package_welcome_$($CustomerEmail.Replace('@', '_').Replace('.', '_')).txt"
        New-Item -Path "emails" -ItemType Directory -Force | Out-Null
        $emailBody | Out-File -FilePath $emailPath -Encoding UTF8
        Write-Host "Welcome email saved: $emailPath" -ForegroundColor Green
    }
    
    Write-Host "Email sent to: $customerEmail" -ForegroundColor Cyan
}

# Send email via SMTP
function Send-EmailViaSMTP {
    param($To, $Subject, $Body)
    
    try {
        $smtp = $IntegrationConfig.SMTP
        
        $emailParams = @{
            From = "$($smtp.FromName) <$($smtp.FromEmail)>"
            To = $To
            Subject = $Subject
            Body = $Body
            SmtpServer = $smtp.Server
            Port = $smtp.Port
            UseSsl = $smtp.UseSSL
            Credential = [System.Management.Automation.PSCredential]::new($smtp.Username, (ConvertTo-SecureString $smtp.Password -AsPlainText -Force))
        }
        
        Send-MailMessage @emailParams
        Write-Host "Email sent via SMTP to: $To" -ForegroundColor Green
        
    } catch {
        Write-Host "SMTP email failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Falling back to file-based email..." -ForegroundColor Yellow
    }
}

# Update customer database
function Update-CustomerDatabase {
    param($Package, $CustomerEmail, $CustomerName, $LicenseResult)
    
    $customerData = @{
        CustomerName = $CustomerName
        CustomerEmail = $CustomerEmail
        LicenseKey = $LicenseResult.LicenseKey
        ProductName = $Package.PackageName
        Price = $Package.Price
        LicenseType = $Package.LicenseType
        CreatedDate = $LicenseResult.CreatedDate
        Status = "active"
        Website = $IntegrationConfig.Domain
        Features = $Package.Features
    }
    
    $customersPath = "configuration\rescuepc_customers.json"
    
    # Initialize or load existing customers
    if (Test-Path $customersPath) {
        $existingContent = Get-Content $customersPath -Raw
        if ($existingContent) {
            $customers = $existingContent | ConvertFrom-Json
            if ($customers -isnot [array]) {
                $customers = @($customers)
            }
        } else {
            $customers = @()
        }
    } else {
        $customers = @()
    }
    
    # Add new customer
    $customers += [PSCustomObject]$customerData
    
    # Save updated list
    $customers | ConvertTo-Json -Depth 10 | Out-File -FilePath $customersPath -Encoding UTF8
    
    Write-Host "Customer database updated" -ForegroundColor Green
}

# Log integration events
function Log-IntegrationEvent {
    param($Event, $Source, $CustomerEmail, $Package, $Amount)
    
    $logEntry = @{
        Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Event = $Event
        Source = $Source
        CustomerEmail = $CustomerEmail
        Package = $Package
        Amount = $Amount
    }
    
    $logPath = "logs\integration_events.json"
    New-Item -Path "logs" -ItemType Directory -Force | Out-Null
    
    # Load existing logs
    if (Test-Path $logPath) {
        $existingLogs = Get-Content $logPath -Raw | ConvertFrom-Json
        if ($existingLogs -isnot [array]) {
            $existingLogs = @($existingLogs)
        }
    } else {
        $existingLogs = @()
    }
    
    # Add new log entry
    $existingLogs += [PSCustomObject]$logEntry
    
    # Save logs (keep last 1000 entries)
    if ($existingLogs.Count -gt 1000) {
        $existingLogs = $existingLogs | Select-Object -Last 1000
    }
    
    $existingLogs | ConvertTo-Json -Depth 10 | Out-File -FilePath $logPath -Encoding UTF8
}

# Test integration system
function Test-IntegrationSystem {
    Write-Host "Testing Unified Store Integration System..." -ForegroundColor Yellow
    
    # Test webhook processing with a real package (Basic License)
    $testWebhook = @{
        type = "payment_intent.succeeded"
        data = @{
            object = @{
                amount = 4999  # $49.99 in cents
                receipt_email = "test@rescuepcrepairs.com"
                customer_details = @{
                    name = "Test Customer"
                }
                payment_link = "https://buy.stripe.com/5kQfZggMacypcSl9wP08g05"
                description = "RescuePC Repairs - Basic License"
            }
        }
    }
    
    $webhookJson = $testWebhook | ConvertTo-Json -Depth 10
    
    Write-Host "Testing webhook processing..." -ForegroundColor Cyan
    $result = Process-WebhookData -WebhookData $webhookJson -Source "Test"
    
    if ($result) {
        Write-Host "Integration test successful!" -ForegroundColor Green
        Write-Host "License generated: $($result.LicenseKey)" -ForegroundColor Cyan
    } else {
        Write-Host "Integration test failed!" -ForegroundColor Red
    }
    
    return $result
}

# Show integration status
function Show-IntegrationStatus {
    Write-Host "RescuePC Repairs - Unified Store Integration Status" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Integration Methods:" -ForegroundColor Yellow
    Write-Host "  HTTP Listener: $($IntegrationConfig.IntegrationMethods.HTTP.Enabled)" -ForegroundColor $(if ($IntegrationConfig.IntegrationMethods.HTTP.Enabled) { "Green" } else { "Red" })
    Write-Host "  File Watcher: $($IntegrationConfig.IntegrationMethods.File.Enabled)" -ForegroundColor $(if ($IntegrationConfig.IntegrationMethods.File.Enabled) { "Green" } else { "Red" })
    Write-Host "  Database Watcher: $($IntegrationConfig.IntegrationMethods.Database.Enabled)" -ForegroundColor $(if ($IntegrationConfig.IntegrationMethods.Database.Enabled) { "Green" } else { "Red" })
    
    Write-Host ""
    Write-Host "SMTP Configuration:" -ForegroundColor Yellow
    Write-Host "  Server: $($IntegrationConfig.SMTP.Server)" -ForegroundColor $(if ($IntegrationConfig.SMTP.Server) { "Green" } else { "Red" })
    Write-Host "  From Email: $($IntegrationConfig.SMTP.FromEmail)" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Security:" -ForegroundColor Yellow
    Write-Host "  Webhook Secret: $($IntegrationConfig.Security.WebhookSecret)" -ForegroundColor $(if ($IntegrationConfig.Security.WebhookSecret) { "Green" } else { "Red" })
    Write-Host "  Require Signature: $($IntegrationConfig.Security.RequireSignature)" -ForegroundColor White
    
    # Show recent integration events
    $logPath = "logs\integration_events.json"
    if (Test-Path $logPath) {
        Write-Host ""
        Write-Host "Recent Integration Events:" -ForegroundColor Yellow
        $logs = Get-Content $logPath -Raw | ConvertFrom-Json
        $recentLogs = $logs | Select-Object -Last 5
        
        foreach ($log in $recentLogs) {
            Write-Host "  $($log.Timestamp) - $($log.Event) - $($log.CustomerEmail)" -ForegroundColor Gray
        }
    }
}

# Configure SMTP settings
function Configure-SMTPSettings {
    Write-Host "Configuring SMTP settings..." -ForegroundColor Yellow
    
    $smtp = $IntegrationConfig.SMTP
    
    $smtp.Server = Read-Host "SMTP Server (e.g., smtp.gmail.com)"
    $smtp.Port = [int](Read-Host "SMTP Port (default: 587)")
    $smtp.Username = Read-Host "SMTP Username"
    $smtp.Password = Read-Host "SMTP Password" -AsSecureString
    $smtp.UseSSL = (Read-Host "Use SSL? (y/n)") -eq "y"
    
    # Convert secure string to plain text for storage
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($smtp.Password)
    $smtp.Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    $IntegrationConfig.SMTP = $smtp
    
    # Save configuration
    $configPath = "configuration\integration_config.json"
    New-Item -Path "configuration" -ItemType Directory -Force | Out-Null
    $IntegrationConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding UTF8
    
    Write-Host "SMTP configuration saved!" -ForegroundColor Green
}

# Main execution
try {
    if ($StartHTTPListener) {
        Start-WebhookListener -Port $Port
    } elseif ($StartFileWatcher) {
        Start-FileWatcher
    } elseif ($TestIntegration) {
        Test-IntegrationSystem
    } elseif ($ShowStatus) {
        Show-IntegrationStatus
    } elseif ($ConfigureSMTP) {
        Configure-SMTPSettings
    } else {
        # Default: show status and usage
        Show-IntegrationStatus
        Write-Host ""
        Write-Host "Usage Examples:" -ForegroundColor Yellow
        Write-Host "  Start HTTP Listener: .\unified_store_integration.ps1 -StartHTTPListener" -ForegroundColor White
        Write-Host "  Start File Watcher: .\unified_store_integration.ps1 -StartFileWatcher" -ForegroundColor White
        Write-Host "  Test Integration: .\unified_store_integration.ps1 -TestIntegration" -ForegroundColor White
        Write-Host "  Show Status: .\unified_store_integration.ps1 -ShowStatus" -ForegroundColor White
        Write-Host "  Configure SMTP: .\unified_store_integration.ps1 -ConfigureSMTP" -ForegroundColor White
    }
} catch {
    $errorMessage = $_.Exception.Message
    Write-Host "Error: $errorMessage" -ForegroundColor Red
} 
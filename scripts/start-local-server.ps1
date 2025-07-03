# RescuePC Repairs - Local Development Server
# This script starts a local HTTP server for testing

Write-Host "Starting local server for RescuePC Repairs..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start a simple HTTP server on localhost:8000" -ForegroundColor Yellow
Write-Host "You can then access the site at: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Try Python first
try {
    $pythonVersion = python --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Using Python HTTP server..." -ForegroundColor Green
        python -m http.server 8000
        exit
    }
} catch {
    # Python not available
}

# Try Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Using Node.js HTTP server..." -ForegroundColor Green
        npx http-server -p 8000
        exit
    }
} catch {
    # Node.js not available
}

# Try PHP
try {
    $phpVersion = php --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Using PHP HTTP server..." -ForegroundColor Green
        php -S localhost:8000
        exit
    }
} catch {
    # PHP not available
}

# Fallback: Use PowerShell's built-in web server
Write-Host "No external server found. Using PowerShell web server..." -ForegroundColor Yellow
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

Write-Host "Server started at http://localhost:8000/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Cyan
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
        
        if ($localPath -eq "/" -or $localPath -eq "") {
            $filePath = Join-Path $PSScriptRoot "index.html"
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = Get-Content $filePath -Raw
            $extension = [System.IO.Path]::GetExtension($filePath)
            
            # Set content type based on extension
            switch ($extension) {
                ".html" { $contentType = "text/html" }
                ".css" { $contentType = "text/css" }
                ".js" { $contentType = "application/javascript" }
                ".png" { $contentType = "image/png" }
                ".jpg" { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".gif" { $contentType = "image/gif" }
                ".ico" { $contentType = "image/x-icon" }
                default { $contentType = "text/plain" }
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentType = $contentType
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $notFoundContent = "File not found: $localPath"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFoundContent)
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
} 
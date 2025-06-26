@echo off
echo Starting local server for RescuePC Repairs...
echo.
echo This will start a simple HTTP server on localhost:8000
echo You can then access the site at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python HTTP server...
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Node.js HTTP server...
    npx http-server -p 8000
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using PHP HTTP server...
    php -S localhost:8000
    goto :end
)

echo No suitable server found. Please install Python, Node.js, or PHP.
echo.
echo Alternative: Open the index.html file directly in your browser.
echo.

:end
pause 
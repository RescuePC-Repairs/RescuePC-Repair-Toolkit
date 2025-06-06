<?php
// Security Initialization File
// This file should be included at the very top of your PHP files

// Prevent direct access to this file
if (!defined('SECURE_ACCESS')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access to this file is forbidden.');
}

// Load configuration
$config = require_once __DIR__ . '/security-config.php';

// Force HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

// Initialize security features only for admin/dashboard access
$isAdminPage = strpos($_SERVER['REQUEST_URI'], 'security-dashboard.php') !== false;

if ($isAdminPage) {
    // Verify admin access
    session_start();
    if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
        header('HTTP/1.0 403 Forbidden');
        exit('Access denied');
    }

    // Load all security features for admin pages
    require_once __DIR__ . '/session-security.php';
    require_once __DIR__ . '/request-sanitizer.php';
    require_once __DIR__ . '/request-validator.php';
    require_once __DIR__ . '/file-integrity.php';
    require_once __DIR__ . '/bot-protection.php';
    require_once __DIR__ . '/security-headers.php';
} else {
    // For non-admin pages, only load essential security features
    require_once __DIR__ . '/security-headers.php';
    require_once __DIR__ . '/request-sanitizer.php';
}

// Set security headers
$headers = new SecurityHeaders($config);
$headers->setHeaders();

// Initialize request sanitizer
$sanitizer = new RequestSanitizer($config);
$sanitizer->sanitizeRequest();

// For admin pages, initialize additional security features
if ($isAdminPage) {
    // Initialize session security
    $sessionSecurity = new SessionSecurity($config);
    $sessionSecurity->validateSession();
    
    // Initialize request validator
    $validator = new RequestValidator($config);
    $validator->validateRequest();
    
    // Initialize file integrity checker
    $integrityChecker = new FileIntegrityChecker($config);
    $integrityChecker->checkIntegrity();
    
    // Initialize bot protection
    $botProtection = new BotProtection($config);
    $botProtection->checkRequest();
}

// Performance optimization
if (function_exists('opcache_reset')) {
    opcache_reset();
}

// Set error reporting for production
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Set memory limit
ini_set('memory_limit', '256M');

// Set execution time limit
set_time_limit(30);

// Enable output buffering for better performance
ob_start(); 
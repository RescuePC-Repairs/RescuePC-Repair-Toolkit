<?php
// Security Initialization File
// This file should be included at the very top of your PHP files

// Prevent direct access to this file
if (!defined('SECURE_ACCESS')) {
    die('Direct access not permitted');
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
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// Set memory limit
ini_set('memory_limit', '256M');

// Set execution time limit
set_time_limit(30);

// Enable output buffering for better performance
ob_start();

// Set secure PHP defaults
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_lifetime', 0);
ini_set('session.gc_maxlifetime', 1800); // 30 minutes
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Strict');

// Set secure headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.google-analytics.com https://www.googletagmanager.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' https://www.google-analytics.com; frame-ancestors \'none\'; form-action \'self\'; base-uri \'self\'; object-src \'none\';');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()');

// Remove sensitive headers
header_remove('X-Powered-By');
header_remove('Server');
header_remove('X-AspNet-Version');
header_remove('X-AspNetMvc-Version');

// Set secure file permissions
umask(0027);

// Create required directories if they don't exist
$directories = [
    __DIR__ . '/../logs',
    __DIR__ . '/../config'
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0750, true);
    }
}

// Initialize security logging
function logSecurityEvent($event_type, $details) {
    $log_file = __DIR__ . '/../logs/security.log';
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $event_type,
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        'details' => $details
    ];
    
    file_put_contents(
        $log_file,
        json_encode($log_entry) . "\n",
        FILE_APPEND
    );
}

// Function to sanitize input
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
}

// Function to validate CSRF token
function validateCSRFToken($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        logSecurityEvent('csrf_attempt', [
            'provided_token' => $token,
            'expected_token' => $_SESSION['csrf_token'] ?? 'not_set'
        ]);
        return false;
    }
    return true;
}

// Generate CSRF token
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Set secure session parameters
session_name('RESCUEPC_SECURE_SESSION');
session_start();

// Regenerate session ID periodically
if (!isset($_SESSION['last_regeneration']) || 
    time() - $_SESSION['last_regeneration'] > 300) { // 5 minutes
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
} 
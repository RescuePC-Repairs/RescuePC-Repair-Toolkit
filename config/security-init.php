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
ini_set('session.gc_maxlifetime', $config['session']['timeout']);
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Strict');

// Set secure headers
header('X-Frame-Options: ' . $config['headers']['x_frame_options']);
header('X-Content-Type-Options: ' . $config['headers']['x_content_type_options']);
header('X-XSS-Protection: ' . $config['headers']['x_xss_protection']);
header('Content-Security-Policy: ' . $config['headers']['content_security_policy']);
header('Strict-Transport-Security: ' . $config['headers']['strict_transport_security']);
header('Referrer-Policy: ' . $config['headers']['referrer_policy']);
header('Permissions-Policy: ' . $config['headers']['permissions_policy']);

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

// Initialize secure session
session_name($config['session']['name']);
session_start();

// Regenerate session ID periodically
if (!isset($_SESSION['last_regeneration']) || 
    time() - $_SESSION['last_regeneration'] > $config['session']['regenerate_interval']) {
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
}

// Set up error handling
function secureErrorHandler($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        return false;
    }
    
    $error = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $errno,
        'message' => $errstr,
        'file' => $errfile,
        'line' => $errline,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    if ($config['logging']['enabled']) {
        error_log(json_encode($error) . "\n", 3, $config['logging']['log_file']);
    }
    
    return true;
}

set_error_handler('secureErrorHandler');

// Set up exception handling
function secureExceptionHandler($exception) {
    $error = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => get_class($exception),
        'message' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine(),
        'trace' => $exception->getTraceAsString(),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    if ($config['logging']['enabled']) {
        error_log(json_encode($error) . "\n", 3, $config['logging']['log_file']);
    }
    
    // Don't expose sensitive information in production
    if (isset($_SERVER['SERVER_NAME']) && $_SERVER['SERVER_NAME'] === 'localhost') {
        throw $exception;
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo 'An error occurred. Please try again later.';
    }
}

set_exception_handler('secureExceptionHandler');

// Log rotation
if ($config['logging']['enabled'] && $config['logging']['rotate_logs']) {
    $log_file = $config['logging']['log_file'];
    if (file_exists($log_file) && filesize($log_file) > $config['logging']['max_log_size']) {
        for ($i = $config['logging']['max_log_files'] - 1; $i >= 0; $i--) {
            $old_file = $log_file . '.' . $i;
            $new_file = $log_file . '.' . ($i + 1);
            if (file_exists($old_file)) {
                if ($i === $config['logging']['max_log_files'] - 1) {
                    unlink($old_file);
                } else {
                    rename($old_file, $new_file);
                }
            }
        }
        rename($log_file, $log_file . '.0');
    }
}

// CSRF Protection
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        header('HTTP/1.1 403 Forbidden');
        die('Invalid CSRF token');
    }
}

// XSS Protection
function secureOutput($data) {
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

// SQL Injection Protection
function secureQuery($query, $params = []) {
    global $config;
    // Implement your database connection and prepared statement logic here
    return $query;
}

// Rate Limiting
function checkRateLimit($ip, $action) {
    global $config;
    $rate_file = __DIR__ . '/../logs/rate_limit.json';
    $rate_data = file_exists($rate_file) ? json_decode(file_get_contents($rate_file), true) : [];
    
    if (!isset($rate_data[$ip][$action])) {
        $rate_data[$ip][$action] = [
            'count' => 0,
            'last_reset' => time()
        ];
    }
    
    $data = &$rate_data[$ip][$action];
    
    if (time() - $data['last_reset'] > 3600) {
        $data['count'] = 0;
        $data['last_reset'] = time();
    }
    
    $data['count']++;
    
    file_put_contents($rate_file, json_encode($rate_data));
    
    return $data['count'] <= $config['security']['max_login_attempts'];
} 
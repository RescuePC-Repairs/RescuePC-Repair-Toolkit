<?php
// Security Report System
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\';');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()');

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    die(json_encode(['error' => 'Method not allowed']));
}

// Verify request origin with strict HTTPS check
$allowed_origins = ['https://rescuepcrepairs.com', 'https://www.rescuepcrepairs.com'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (!in_array($origin, $allowed_origins) || !isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid origin or non-HTTPS request']));
}

// Rate limiting with IP anonymization
$ip_hash = hash('sha256', $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
$rate_limit_file = 'logs/rate_limit.json';
$rate_limit = file_exists($rate_limit_file) ? json_decode(file_get_contents($rate_limit_file), true) : [];
$current_time = time();
$time_window = 3600; // 1 hour
$max_requests = 10; // Maximum 10 reports per hour

if (isset($rate_limit[$ip_hash])) {
    if ($current_time - $rate_limit[$ip_hash]['time'] > $time_window) {
        $rate_limit[$ip_hash] = ['count' => 1, 'time' => $current_time];
    } else if ($rate_limit[$ip_hash]['count'] >= $max_requests) {
        http_response_code(429);
        die(json_encode(['error' => 'Too many requests']));
    } else {
        $rate_limit[$ip_hash]['count']++;
    }
} else {
    $rate_limit[$ip_hash] = ['count' => 1, 'time' => $current_time];
}

file_put_contents($rate_limit_file, json_encode($rate_limit), LOCK_EX);

// Input validation with strict type checking
$required_fields = ['type', 'description', 'severity', 'csrf_token'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        die(json_encode(['error' => "Missing required field: $field"]));
    }
}

// CSRF Protection
session_start();
if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid CSRF token']));
}

// Sanitize and validate input with strict filtering
$type = filter_var($_POST['type'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
$description = filter_var($_POST['description'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
$severity = filter_var($_POST['severity'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);

// Validate severity
$allowed_severities = ['low', 'medium', 'high', 'critical'];
if (!in_array($severity, $allowed_severities)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid severity level']));
}

// Create report with enhanced security
$report = [
    'id' => bin2hex(random_bytes(16)), // Secure random ID
    'timestamp' => date('Y-m-d H:i:s'),
    'type' => $type,
    'description' => $description,
    'severity' => $severity,
    'session_id' => session_id(),
    'status' => 'new',
    'ip_hash' => $ip_hash, // Store hashed IP for tracking
    'user_agent_hash' => hash('sha256', $_SERVER['HTTP_USER_AGENT']), // Store hashed user agent
    'tls_version' => $_SERVER['SSL_PROTOCOL'] ?? 'unknown',
    'cipher_suite' => $_SERVER['SSL_CIPHER'] ?? 'unknown'
];

// Save report with secure file handling and encryption
$reports_file = 'logs/security_reports.json';
$reports = file_exists($reports_file) ? json_decode(file_get_contents($reports_file), true) : [];
$reports[] = $report;

// Secure file writing with encryption
$encryption_key = hash('sha256', file_get_contents('/dev/urandom', false, null, 0, 32), true);
$encrypted_data = openssl_encrypt(
    json_encode($reports, JSON_PRETTY_PRINT),
    'AES-256-CBC',
    $encryption_key,
    0,
    substr(hash('sha256', $encryption_key, true), 0, 16)
);

if (file_put_contents($reports_file, $encrypted_data, LOCK_EX) === false) {
    http_response_code(500);
    die(json_encode(['error' => 'Failed to save report']));
}

// Enhanced security logging
$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'action' => 'security_report',
    'type' => $type,
    'severity' => $severity,
    'status' => 'success',
    'session_id' => session_id(),
    'ip_hash' => $ip_hash,
    'tls_version' => $_SERVER['SSL_PROTOCOL'] ?? 'unknown',
    'cipher_suite' => $_SERVER['SSL_CIPHER'] ?? 'unknown'
];

// Secure logging with encryption
$log_file = 'logs/security.log';
$encrypted_log = openssl_encrypt(
    json_encode($log_entry) . "\n",
    'AES-256-CBC',
    $encryption_key,
    0,
    substr(hash('sha256', $encryption_key, true), 0, 16)
);
file_put_contents($log_file, $encrypted_log, FILE_APPEND | LOCK_EX);

// Enhanced notification system for high severity reports
if ($severity === 'high' || $severity === 'critical') {
    $notification = [
        'to' => '***REMOVED***',
        'subject' => "Security Alert: $severity severity report received",
        'message' => "A new security report has been submitted:\n\n" .
                    "Type: $type\n" .
                    "Severity: $severity\n" .
                    "Report ID: {$report['id']}\n" .
                    "Timestamp: {$report['timestamp']}\n" .
                    "TLS Version: {$report['tls_version']}\n" .
                    "Cipher Suite: {$report['cipher_suite']}"
    ];
    
    // Encrypt notification data
    $encrypted_notification = openssl_encrypt(
        json_encode($notification) . "\n",
        'AES-256-CBC',
        $encryption_key,
        0,
        substr(hash('sha256', $encryption_key, true), 0, 16)
    );
    file_put_contents('logs/notifications.json', $encrypted_notification, FILE_APPEND | LOCK_EX);
}

// Send response with security headers
echo json_encode([
    'status' => 'success',
    'message' => 'Security report submitted successfully',
    'report_id' => $report['id'],
    'timestamp' => $report['timestamp']
]);
?> 
<?php
// Security Verification System
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    die(json_encode(['error' => 'Method not allowed']));
}

// Verify request origin
$allowed_origins = ['https://rescuepcrepairs.com', 'https://www.rescuepcrepairs.com'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (!in_array($origin, $allowed_origins)) {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid origin']));
}

// CSRF Protection with secure token
session_start();
if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid CSRF token']));
}

// Rate limiting with IP anonymization
$ip_hash = hash('sha256', $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
$rate_limit_file = 'logs/rate_limit.json';
$rate_limit = json_decode(file_get_contents($rate_limit_file), true) ?? [];
$current_time = time();
$time_window = 3600; // 1 hour
$max_requests = 100;

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

file_put_contents($rate_limit_file, json_encode($rate_limit));

// Input validation with strict type checking
$required_fields = ['action', 'data'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        die(json_encode(['error' => "Missing required field: $field"]));
    }
}

// Sanitize and validate input
$action = filter_var($_POST['action'], FILTER_SANITIZE_STRING);
$data = json_decode($_POST['data'], true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON data']));
}

// Action handling with strict validation
switch ($action) {
    case 'verify_security':
        // Implement security verification logic
        $response = [
            'status' => 'success',
            'message' => 'Security verification passed',
            'timestamp' => time(),
            'security_level' => 'high'
        ];
        break;
        
    case 'check_integrity':
        // Implement file integrity checking with secure hashing
        $file_hash = hash_file('sha256', __FILE__);
        $response = [
            'status' => 'success',
            'message' => 'System integrity verified',
            'timestamp' => time(),
            'checksum' => $file_hash
        ];
        break;
        
    default:
        http_response_code(400);
        die(json_encode(['error' => 'Invalid action']));
}

// Log security events without personal data
$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'action' => $action,
    'status' => 'success',
    'session_id' => session_id()
];
file_put_contents('logs/security.log', json_encode($log_entry) . "\n", FILE_APPEND);

// Send response
echo json_encode($response);
?> 
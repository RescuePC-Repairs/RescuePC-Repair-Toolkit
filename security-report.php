<?php
// Security Report System
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');

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

// Input validation with strict type checking
$required_fields = ['type', 'description', 'severity'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        die(json_encode(['error' => "Missing required field: $field"]));
    }
}

// Sanitize and validate input
$type = filter_var($_POST['type'], FILTER_SANITIZE_STRING);
$description = filter_var($_POST['description'], FILTER_SANITIZE_STRING);
$severity = filter_var($_POST['severity'], FILTER_SANITIZE_STRING);

// Validate severity
$allowed_severities = ['low', 'medium', 'high', 'critical'];
if (!in_array($severity, $allowed_severities)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid severity level']));
}

// Create report with anonymized data
$report = [
    'id' => bin2hex(random_bytes(16)), // Secure random ID
    'timestamp' => date('Y-m-d H:i:s'),
    'type' => $type,
    'description' => $description,
    'severity' => $severity,
    'session_id' => session_id(),
    'status' => 'new'
];

// Save report with secure file handling
$reports_file = 'logs/security_reports.json';
$reports = file_exists($reports_file) ? json_decode(file_get_contents($reports_file), true) : [];
$reports[] = $report;

// Secure file writing
if (file_put_contents($reports_file, json_encode($reports, JSON_PRETTY_PRINT), LOCK_EX) === false) {
    http_response_code(500);
    die(json_encode(['error' => 'Failed to save report']));
}

// Log security event without personal data
$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'action' => 'security_report',
    'type' => $type,
    'severity' => $severity,
    'status' => 'success',
    'session_id' => session_id()
];
file_put_contents('logs/security.log', json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);

// Send notification for high severity reports without exposing data
if ($severity === 'high' || $severity === 'critical') {
    $notification = [
        'to' => '***REMOVED***',
        'subject' => "Security Alert: $severity severity report received",
        'message' => "A new security report has been submitted:\n\n" .
                    "Type: $type\n" .
                    "Severity: $severity\n" .
                    "Report ID: {$report['id']}\n" .
                    "Timestamp: {$report['timestamp']}"
    ];
    file_put_contents('logs/notifications.json', json_encode($notification) . "\n", FILE_APPEND | LOCK_EX);
}

// Send response
echo json_encode([
    'status' => 'success',
    'message' => 'Security report submitted successfully',
    'report_id' => $report['id']
]);
?> 
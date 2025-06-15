<?php
// Ensure this script is only accessed via HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header('HTTP/1.1 403 Forbidden');
    exit('Access denied');
}

// Set secure headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Get the request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit;
}

// Log the violation
$logFile = __DIR__ . '/logs/security-violations.log';
$timestamp = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];

$logMessage = sprintf(
    "[%s] [%s] [%s] [%s] %s: %s\n",
    $timestamp,
    $data['type'] ?? 'unknown',
    $ip,
    $userAgent,
    $data['url'] ?? 'unknown',
    $data['timestamp'] ?? 'unknown'
);

error_log($logMessage, 3, $logFile);

// Send response
echo json_encode(['status' => 'logged']); 
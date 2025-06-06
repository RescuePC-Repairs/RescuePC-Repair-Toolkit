<?php
// Security Report Handler
header('Content-Type: application/json');

// Log file path
$logFile = 'security-reports.log';

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate the report
if (!$data || !isset($data['csp-report'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid report format']);
    exit;
}

// Format the report
$report = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
    'report' => $data['csp-report']
];

// Log the report
$logEntry = json_encode($report) . "\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Send response
http_response_code(204);
?> 
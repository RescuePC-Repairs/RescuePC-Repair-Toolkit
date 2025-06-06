<?php
// Security Status Check
$config = require_once __DIR__ . '/security-config.php';

function checkSecurityStatus() {
    $status = [
        'timestamp' => date('Y-m-d H:i:s'),
        'checks' => []
    ];
    
    // Check log file
    $logFile = __DIR__ . '/../security-reports.log';
    $status['checks']['log_file'] = [
        'exists' => file_exists($logFile),
        'size' => file_exists($logFile) ? filesize($logFile) : 0,
        'writable' => is_writable($logFile)
    ];
    
    // Check backup directory
    $backupDir = __DIR__ . '/../backups/security';
    $status['checks']['backup_dir'] = [
        'exists' => file_exists($backupDir),
        'writable' => is_writable($backupDir)
    ];
    
    // Check session security
    $status['checks']['session'] = [
        'secure' => ini_get('session.cookie_secure') === '1',
        'httponly' => ini_get('session.cookie_httponly') === '1',
        'samesite' => ini_get('session.cookie_samesite') === 'Strict'
    ];
    
    // Check security headers
    $headers = getallheaders();
    $status['checks']['headers'] = [
        'x_frame_options' => isset($headers['X-Frame-Options']),
        'x_xss_protection' => isset($headers['X-XSS-Protection']),
        'x_content_type_options' => isset($headers['X-Content-Type-Options']),
        'content_security_policy' => isset($headers['Content-Security-Policy'])
    ];
    
    // Check file permissions
    $status['checks']['permissions'] = [
        'config_dir' => substr(sprintf('%o', fileperms(__DIR__)), -4),
        'log_file' => file_exists($logFile) ? substr(sprintf('%o', fileperms($logFile)), -4) : 'N/A',
        'backup_dir' => file_exists($backupDir) ? substr(sprintf('%o', fileperms($backupDir)), -4) : 'N/A'
    ];
    
    // Save status to file
    $statusFile = __DIR__ . '/../security-status.json';
    file_put_contents($statusFile, json_encode($status, JSON_PRETTY_PRINT));
    
    return $status;
}

// Run status check
$status = checkSecurityStatus();

// Send alert if any critical checks fail
$criticalIssues = [];
foreach ($status['checks'] as $check => $results) {
    if (is_array($results)) {
        foreach ($results as $key => $value) {
            if ($value === false) {
                $criticalIssues[] = "$check: $key failed";
            }
        }
    }
}

if (!empty($criticalIssues)) {
    require_once __DIR__ . '/security-alerts.php';
    sendSecurityAlert('security_status', [
        'issues' => $criticalIssues,
        'status' => $status
    ]);
} 
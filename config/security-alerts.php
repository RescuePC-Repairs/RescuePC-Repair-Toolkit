<?php
// Security Alert System
$config = require_once __DIR__ . '/security-config.php';

function sendSecurityAlert($type, $details) {
    global $config;
    
    if (!$config['security']['notification']['enable_alerts']) {
        return;
    }

    $email = $config['security']['notification']['email'];
    $subject = "Security Alert: $type";
    
    $message = "Security Alert\n\n";
    $message .= "Type: $type\n";
    $message .= "Time: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $message .= "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n\n";
    $message .= "Details:\n" . print_r($details, true);
    
    $headers = "From: security@rescuepcrepairs.com\r\n";
    $headers .= "Reply-To: security@rescuepcrepairs.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    mail($email, $subject, $message, $headers);
}

function checkAlertThresholds($type, $count) {
    global $config;
    
    $thresholds = $config['security']['alert_thresholds'];
    
    if (isset($thresholds[$type]) && $count >= $thresholds[$type]) {
        sendSecurityAlert($type, [
            'count' => $count,
            'threshold' => $thresholds[$type]
        ]);
    }
}

// Example usage:
// checkAlertThresholds('xss_attempts', 3);
// checkAlertThresholds('sql_injection_attempts', 2);
// checkAlertThresholds('failed_logins', 5); 
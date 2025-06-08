<?php
// Security verification script
header('Content-Type: application/json');

$security_checks = [
    'https' => false,
    'hsts' => false,
    'csp' => false,
    'xss_protection' => false,
    'content_type_options' => false,
    'frame_options' => false,
    'referrer_policy' => false,
    'permissions_policy' => false,
    'tls_version' => false,
    'cipher_suite' => false
];

// Check HTTPS
$security_checks['https'] = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';

// Check security headers
$headers = getallheaders();
$security_checks['hsts'] = isset($headers['Strict-Transport-Security']);
$security_checks['csp'] = isset($headers['Content-Security-Policy']);
$security_checks['xss_protection'] = isset($headers['X-XSS-Protection']);
$security_checks['content_type_options'] = isset($headers['X-Content-Type-Options']);
$security_checks['frame_options'] = isset($headers['X-Frame-Options']);
$security_checks['referrer_policy'] = isset($headers['Referrer-Policy']);
$security_checks['permissions_policy'] = isset($headers['Permissions-Policy']);

// Check TLS version and cipher suite
if (isset($_SERVER['SSL_PROTOCOL'])) {
    $security_checks['tls_version'] = version_compare($_SERVER['SSL_PROTOCOL'], 'TLSv1.3', '>=');
}
if (isset($_SERVER['SSL_CIPHER'])) {
    $security_checks['cipher_suite'] = strpos($_SERVER['SSL_CIPHER'], 'ECDHE') !== false;
}

// Log security status
$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
    'security_status' => $security_checks
];

file_put_contents(
    __DIR__ . '/logs/security-verify.log',
    json_encode($log_entry) . "\n",
    FILE_APPEND
);

// Return security status
echo json_encode([
    'status' => 'success',
    'timestamp' => date('Y-m-d H:i:s'),
    'security_checks' => $security_checks,
    'recommendations' => array_filter([
        !$security_checks['https'] ? 'Enable HTTPS' : null,
        !$security_checks['hsts'] ? 'Enable HSTS' : null,
        !$security_checks['csp'] ? 'Enable Content Security Policy' : null,
        !$security_checks['xss_protection'] ? 'Enable XSS Protection' : null,
        !$security_checks['content_type_options'] ? 'Enable X-Content-Type-Options' : null,
        !$security_checks['frame_options'] ? 'Enable X-Frame-Options' : null,
        !$security_checks['referrer_policy'] ? 'Enable Referrer Policy' : null,
        !$security_checks['permissions_policy'] ? 'Enable Permissions Policy' : null,
        !$security_checks['tls_version'] ? 'Upgrade to TLS 1.3' : null,
        !$security_checks['cipher_suite'] ? 'Use strong cipher suites' : null
    ])
]);
?> 
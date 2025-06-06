<?php
// Security Configuration
return [
    'admin' => [
        'username' => 'admin',
        'password' => 'Ljames23!!!$'
    ],
    'allowed_ips' => [
        '127.0.0.1',  // Localhost
        '::1',        // IPv6 localhost
        // Add your IP here
    ],
    'session' => [
        'name' => 'SECURE_SESSION',
        'timeout' => 1800, // 30 minutes
        'regenerate_id' => true
    ],
    'security' => [
        'max_login_attempts' => 5,
        'lockout_time' => 900, // 15 minutes
        'log_rotation' => [
            'max_size' => 10485760, // 10MB
            'max_files' => 5,
            'compress' => true
        ],
        'alert_thresholds' => [
            'xss_attempts' => 3,
            'sql_injection_attempts' => 2,
            'failed_logins' => 5
        ],
        'notification' => [
            'email' => '***REMOVED***',
            'enable_alerts' => true
        ]
    ],
    'headers' => [
        'X-Frame-Options' => 'SAMEORIGIN',
        'X-XSS-Protection' => '1; mode=block',
        'X-Content-Type-Options' => 'nosniff',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
    ]
]; 
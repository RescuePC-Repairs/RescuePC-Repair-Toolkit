<?php
// Security Configuration
return [
    'session' => [
        'name' => 'RESCUEPC_SECURE_SESSION',
        'timeout' => 1800, // 30 minutes
        'regenerate_id' => true,
        'regenerate_interval' => 300 // 5 minutes
    ],
    'admin' => [
        'username' => 'admin',
        'password_hash' => password_hash('your-secure-password-here', PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ])
    ],
    'allowed_ips' => [
        // Add your allowed IPs here
        '127.0.0.1'
    ],
    'security' => [
        'max_login_attempts' => 5,
        'lockout_time' => 300, // 5 minutes
        'session_lifetime' => 86400, // 24 hours
        'password_min_length' => 12,
        'require_special_chars' => true,
        'require_numbers' => true,
        'require_uppercase' => true,
        'require_lowercase' => true
    ],
    'logging' => [
        'enabled' => true,
        'log_file' => __DIR__ . '/../logs/security.log',
        'max_log_size' => 10485760, // 10MB
        'rotate_logs' => true,
        'max_log_files' => 5
    ],
    'headers' => [
        'x_frame_options' => 'DENY',
        'x_content_type_options' => 'nosniff',
        'x_xss_protection' => '1; mode=block',
        'content_security_policy' => "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';",
        'strict_transport_security' => 'max-age=31536000; includeSubDomains; preload',
        'referrer_policy' => 'strict-origin-when-cross-origin',
        'permissions_policy' => 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()'
    ]
]; 
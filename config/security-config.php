<?php
// Security Configuration
return [
    'session' => [
        'name' => 'RESCUEPC_SECURE_SESSION',
        'timeout' => 1800, // 30 minutes
        'regenerate_id' => true,
        'regenerate_interval' => 300, // 5 minutes
        'cookie_lifetime' => 0,
        'cookie_path' => '/',
        'cookie_domain' => '',
        'cookie_secure' => true,
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict'
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
        'require_lowercase' => true,
        'password_history' => 5, // Remember last 5 passwords
        'max_password_age' => 90, // Days
        'min_password_age' => 1, // Days
        'password_reset_timeout' => 3600, // 1 hour
        'remember_me_lifetime' => 2592000, // 30 days
        'max_concurrent_sessions' => 1
    ],
    'logging' => [
        'enabled' => true,
        'log_file' => __DIR__ . '/../logs/security.log',
        'max_log_size' => 10485760, // 10MB
        'rotate_logs' => true,
        'max_log_files' => 5,
        'log_level' => 'error', // debug, info, warning, error
        'log_format' => 'json', // json, text
        'log_retention' => 90, // Days
        'log_compression' => true
    ],
    'headers' => [
        'x_frame_options' => 'DENY',
        'x_content_type_options' => 'nosniff',
        'x_xss_protection' => '1; mode=block',
        'content_security_policy' => "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';",
        'strict_transport_security' => 'max-age=31536000; includeSubDomains; preload',
        'referrer_policy' => 'strict-origin-when-cross-origin',
        'permissions_policy' => 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()',
        'x_download_options' => 'noopen',
        'x_permitted_cross_domain_policies' => 'none',
        'cross_origin_embedder_policy' => 'require-corp',
        'cross_origin_opener_policy' => 'same-origin',
        'cross_origin_resource_policy' => 'same-origin'
    ],
    'encryption' => [
        'algorithm' => 'aes-256-gcm',
        'key_length' => 32,
        'iv_length' => 12,
        'tag_length' => 16,
        'key_rotation' => 30, // Days
        'key_storage' => 'file', // file, database
        'key_file' => __DIR__ . '/../config/encryption.key'
    ],
    'rate_limiting' => [
        'enabled' => true,
        'window' => 3600, // 1 hour
        'max_requests' => [
            'default' => 1000,
            'login' => 5,
            'api' => 100
        ],
        'storage' => 'file', // file, redis, memcached
        'storage_file' => __DIR__ . '/../logs/rate_limit.json'
    ],
    'backup' => [
        'enabled' => true,
        'frequency' => 'daily',
        'retention' => 30, // Days
        'compression' => true,
        'encryption' => true,
        'location' => __DIR__ . '/../backups'
    ],
    'monitoring' => [
        'enabled' => true,
        'check_interval' => 300, // 5 minutes
        'alert_threshold' => 3,
        'alert_methods' => ['email', 'log'],
        'metrics' => [
            'cpu_usage',
            'memory_usage',
            'disk_usage',
            'error_rate',
            'response_time'
        ]
    ]
]; 
<?php
// Project-wide Security Configuration
return [
    'security' => [
        'headers' => [
            'X-Frame-Options' => 'SAMEORIGIN',
            'X-Content-Type-Options' => 'nosniff',
            'X-XSS-Protection' => '1; mode=block',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Permissions-Policy' => 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()',
            'Content-Security-Policy' => "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; require-trusted-types-for 'script';",
            'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains; preload',
            'Cross-Origin-Resource-Policy' => 'same-origin',
            'Cross-Origin-Opener-Policy' => 'same-origin',
            'Cross-Origin-Embedder-Policy' => 'require-corp'
        ],
        'session' => [
            'name' => 'SECURE_SESSION_' . bin2hex(random_bytes(8)),
            'lifetime' => 1800,
            'path' => '/',
            'domain' => '',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ],
        'allowed_file_types' => [
            'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            'documents' => ['pdf', 'doc', 'docx'],
            'scripts' => ['js'],
            'styles' => ['css']
        ],
        'blocked_extensions' => [
            'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'phps', 'pht', 'phar',
            'inc', 'log', 'sql', 'bak', 'old', 'swp', 'swo', 'tmp', 'temp',
            'env', 'config', 'ini', 'json', 'lock', 'git', 'svn', 'htaccess'
        ]
    ],
    'monitoring' => [
        'log_violations' => true,
        'alert_threshold' => 5,
        'block_duration' => 3600,
        'log_file' => __DIR__ . '/../logs/security.log'
    ],
    'rate_limiting' => [
        'enabled' => true,
        'max_requests' => 100,
        'time_window' => 60,
        'block_duration' => 300
    ]
]; 
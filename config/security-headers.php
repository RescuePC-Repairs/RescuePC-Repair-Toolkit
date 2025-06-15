<?php
// Enhanced Security Headers
class SecurityHeaders {
    private $config;
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function setHeaders() {
        // Basic security headers
        $this->setBasicHeaders();
        
        // Content Security Policy
        $this->setCSP();
        
        // Feature Policy
        $this->setFeaturePolicy();
        
        // Permissions Policy
        $this->setPermissionsPolicy();
        
        // Additional security headers
        $this->setAdditionalHeaders();
    }
    
    private function setBasicHeaders() {
        // Prevent clickjacking
        header('X-Frame-Options: SAMEORIGIN');
        
        // Enable XSS protection
        header('X-XSS-Protection: 1; mode=block');
        
        // Prevent MIME type sniffing
        header('X-Content-Type-Options: nosniff');
        
        // Strict Transport Security
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        
        // Referrer Policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Clear-Site-Data (on logout)
        if (isset($_GET['logout'])) {
            header('Clear-Site-Data: "cache", "cookies", "storage"');
        }
    }
    
    private function setCSP() {
        $csp = "default-src 'self'; ";
        $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ";
        $csp .= "style-src 'self' 'unsafe-inline'; ";
        $csp .= "img-src 'self' data: https:; ";
        $csp .= "font-src 'self' data:; ";
        $csp .= "connect-src 'self'; ";
        $csp .= "frame-ancestors 'self'; ";
        $csp .= "form-action 'self'; ";
        $csp .= "base-uri 'self'; ";
        $csp .= "object-src 'none'; ";
        $csp .= "require-trusted-types-for 'script'; ";
        $csp .= "upgrade-insecure-requests;";
        
        header("Content-Security-Policy: " . $csp);
    }
    
    private function setFeaturePolicy() {
        $features = [
            'accelerometer' => "'none'",
            'camera' => "'none'",
            'geolocation' => "'none'",
            'gyroscope' => "'none'",
            'magnetometer' => "'none'",
            'microphone' => "'none'",
            'payment' => "'none'",
            'usb' => "'none'"
        ];
        
        $policy = [];
        foreach ($features as $feature => $value) {
            $policy[] = "$feature $value";
        }
        
        header('Feature-Policy: ' . implode('; ', $policy));
    }
    
    private function setPermissionsPolicy() {
        $permissions = [
            'accelerometer' => '()',
            'camera' => '()',
            'geolocation' => '()',
            'gyroscope' => '()',
            'magnetometer' => '()',
            'microphone' => '()',
            'payment' => '()',
            'usb' => '()'
        ];
        
        $policy = [];
        foreach ($permissions as $permission => $value) {
            $policy[] = "$permission=$value";
        }
        
        header('Permissions-Policy: ' . implode(', ', $policy));
    }
    
    private function setAdditionalHeaders() {
        // Prevent caching of sensitive pages
        if (strpos($_SERVER['REQUEST_URI'], 'security-dashboard.php') !== false) {
            header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
            header('Pragma: no-cache');
            header('Expires: 0');
        }
        
        // X-Permitted-Cross-Domain-Policies
        header('X-Permitted-Cross-Domain-Policies: none');
        
        // Cross-Origin-Opener-Policy
        header('Cross-Origin-Opener-Policy: same-origin');
        
        // Cross-Origin-Embedder-Policy
        header('Cross-Origin-Embedder-Policy: require-corp');
        
        // Cross-Origin-Resource-Policy
        header('Cross-Origin-Resource-Policy: same-origin');
    }
}

// Initialize and set headers
$config = require_once __DIR__ . '/security-config.php';
$headers = new SecurityHeaders($config);
$headers->setHeaders(); 
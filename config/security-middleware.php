<?php
// Security Middleware
class SecurityMiddleware {
    private $config;
    private $rateLimits = [];
    
    public function __construct() {
        $this->config = require __DIR__ . '/project-security.php';
        $this->initializeSecurity();
    }
    
    private function initializeSecurity() {
        // Set secure session parameters
        $this->setSecureSession();
        
        // Set security headers
        $this->setSecurityHeaders();
        
        // Check for security violations
        $this->checkSecurityViolations();
        
        // Apply rate limiting
        $this->applyRateLimiting();
    }
    
    private function setSecureSession() {
        $sessionConfig = $this->config['security']['session'];
        
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', 1);
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.use_strict_mode', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_lifetime', 0);
        ini_set('session.gc_maxlifetime', $sessionConfig['lifetime']);
        
        session_name($sessionConfig['name']);
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    private function setSecurityHeaders() {
        foreach ($this->config['security']['headers'] as $header => $value) {
            header("$header: $value");
        }
    }
    
    private function checkSecurityViolations() {
        // Check for XSS attempts
        $this->checkXSSAttempts();
        
        // Check for SQL injection attempts
        $this->checkSQLInjectionAttempts();
        
        // Check for file inclusion attempts
        $this->checkFileInclusionAttempts();
        
        // Check for directory traversal attempts
        $this->checkDirectoryTraversalAttempts();
    }
    
    private function checkXSSAttempts() {
        $input = array_merge($_GET, $_POST, $_COOKIE);
        foreach ($input as $key => $value) {
            if (is_string($value) && $this->containsXSS($value)) {
                $this->logViolation('xss_attempt', [
                    'input' => $key,
                    'value' => $value
                ]);
                $this->blockRequest();
            }
        }
    }
    
    private function checkSQLInjectionAttempts() {
        $input = array_merge($_GET, $_POST);
        $patterns = [
            '/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b/i',
            '/[\'";]/',
            '/--/',
            '/\/\*.*\*\//'
        ];
        
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        $this->logViolation('sql_injection_attempt', [
                            'input' => $key,
                            'value' => $value
                        ]);
                        $this->blockRequest();
                    }
                }
            }
        }
    }
    
    private function checkFileInclusionAttempts() {
        $input = array_merge($_GET, $_POST);
        foreach ($input as $key => $value) {
            if (is_string($value) && $this->containsFileInclusion($value)) {
                $this->logViolation('file_inclusion_attempt', [
                    'input' => $key,
                    'value' => $value
                ]);
                $this->blockRequest();
            }
        }
    }
    
    private function checkDirectoryTraversalAttempts() {
        $input = array_merge($_GET, $_POST);
        foreach ($input as $key => $value) {
            if (is_string($value) && $this->containsDirectoryTraversal($value)) {
                $this->logViolation('directory_traversal_attempt', [
                    'input' => $key,
                    'value' => $value
                ]);
                $this->blockRequest();
            }
        }
    }
    
    private function containsXSS($string) {
        $patterns = [
            '/<script\b[^>]*>/i',
            '/javascript:/i',
            '/on\w+\s*=/i',
            '/data:/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $string)) {
                return true;
            }
        }
        return false;
    }
    
    private function containsFileInclusion($string) {
        return strpos($string, 'include') !== false ||
               strpos($string, 'require') !== false ||
               strpos($string, 'file_get_contents') !== false;
    }
    
    private function containsDirectoryTraversal($string) {
        return strpos($string, '../') !== false ||
               strpos($string, '..\\') !== false;
    }
    
    private function applyRateLimiting() {
        if (!$this->config['rate_limiting']['enabled']) {
            return;
        }
        
        $ip = $_SERVER['REMOTE_ADDR'];
        $now = time();
        
        if (!isset($this->rateLimits[$ip])) {
            $this->rateLimits[$ip] = [
                'count' => 0,
                'first_request' => $now
            ];
        }
        
        $limit = $this->rateLimits[$ip];
        
        if ($now - $limit['first_request'] > $this->config['rate_limiting']['time_window']) {
            $this->rateLimits[$ip] = [
                'count' => 1,
                'first_request' => $now
            ];
        } else {
            $limit['count']++;
            
            if ($limit['count'] > $this->config['rate_limiting']['max_requests']) {
                $this->logViolation('rate_limit_exceeded', [
                    'ip' => $ip,
                    'count' => $limit['count']
                ]);
                $this->blockRequest();
            }
        }
    }
    
    private function logViolation($type, $data) {
        if (!$this->config['monitoring']['log_violations']) {
            return;
        }
        
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'type' => $type,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'data' => $data
        ];
        
        $logFile = $this->config['monitoring']['log_file'];
        file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND);
    }
    
    private function blockRequest() {
        header('HTTP/1.1 403 Forbidden');
        exit('Access Denied');
    }
}

// Initialize security middleware
$security = new SecurityMiddleware(); 
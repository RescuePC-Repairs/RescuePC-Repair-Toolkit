<?php
// Request Sanitizer
class RequestSanitizer {
    private $config;
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function sanitizeRequest() {
        // Sanitize GET parameters
        $_GET = $this->sanitizeArray($_GET);
        
        // Sanitize POST parameters
        $_POST = $this->sanitizeArray($_POST);
        
        // Sanitize COOKIE parameters
        $_COOKIE = $this->sanitizeArray($_COOKIE);
        
        // Sanitize REQUEST parameters
        $_REQUEST = $this->sanitizeArray($_REQUEST);
    }
    
    private function sanitizeArray($array) {
        $sanitized = [];
        
        foreach ($array as $key => $value) {
            // Sanitize key
            $key = $this->sanitizeKey($key);
            
            // Sanitize value
            if (is_array($value)) {
                $value = $this->sanitizeArray($value);
            } else {
                $value = $this->sanitizeValue($value);
            }
            
            $sanitized[$key] = $value;
        }
        
        return $sanitized;
    }
    
    private function sanitizeKey($key) {
        // Remove any non-alphanumeric characters except underscore
        $key = preg_replace('/[^a-zA-Z0-9_]/', '', $key);
        
        // Convert to lowercase
        $key = strtolower($key);
        
        return $key;
    }
    
    private function sanitizeValue($value) {
        // Convert to string if not already
        $value = (string) $value;
        
        // Remove null bytes
        $value = str_replace(chr(0), '', $value);
        
        // Remove control characters
        $value = preg_replace('/[\x00-\x1F\x7F]/', '', $value);
        
        // HTML encode special characters
        $value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        // Remove potential SQL injection patterns
        $value = $this->removeSQLInjection($value);
        
        // Remove potential XSS patterns
        $value = $this->removeXSS($value);
        
        // Remove potential command injection patterns
        $value = $this->removeCommandInjection($value);
        
        return $value;
    }
    
    private function removeSQLInjection($value) {
        $patterns = [
            '/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b/i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+/i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+\s*--/i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+\s*#/i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+\s*\/\*/i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+\s*\*\//i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+\s*;/i',
            '/\b(OR|AND)\s+\d+\s*=\s*\d+\s*$/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value)) {
                $this->logViolation('sql_injection_attempt', [
                    'value' => $value,
                    'pattern' => $pattern
                ]);
                return '';
            }
        }
        
        return $value;
    }
    
    private function removeXSS($value) {
        $patterns = [
            '/<script\b[^>]*>(.*?)<\/script>/is',
            '/<iframe\b[^>]*>(.*?)<\/iframe>/is',
            '/<object\b[^>]*>(.*?)<\/object>/is',
            '/<embed\b[^>]*>(.*?)<\/embed>/is',
            '/<applet\b[^>]*>(.*?)<\/applet>/is',
            '/<style\b[^>]*>(.*?)<\/style>/is',
            '/<link\b[^>]*>(.*?)<\/link>/is',
            '/<meta\b[^>]*>(.*?)<\/meta>/is',
            '/<base\b[^>]*>(.*?)<\/base>/is',
            '/<form\b[^>]*>(.*?)<\/form>/is',
            '/<input\b[^>]*>(.*?)<\/input>/is',
            '/<button\b[^>]*>(.*?)<\/button>/is',
            '/<select\b[^>]*>(.*?)<\/select>/is',
            '/<textarea\b[^>]*>(.*?)<\/textarea>/is',
            '/<option\b[^>]*>(.*?)<\/option>/is',
            '/<optgroup\b[^>]*>(.*?)<\/optgroup>/is',
            '/<fieldset\b[^>]*>(.*?)<\/fieldset>/is',
            '/<legend\b[^>]*>(.*?)<\/legend>/is',
            '/<label\b[^>]*>(.*?)<\/label>/is',
            '/<output\b[^>]*>(.*?)<\/output>/is',
            '/<progress\b[^>]*>(.*?)<\/progress>/is',
            '/<meter\b[^>]*>(.*?)<\/meter>/is',
            '/<datalist\b[^>]*>(.*?)<\/datalist>/is',
            '/<keygen\b[^>]*>(.*?)<\/keygen>/is'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value)) {
                $this->logViolation('xss_attempt', [
                    'value' => $value,
                    'pattern' => $pattern
                ]);
                return '';
            }
        }
        
        return $value;
    }
    
    private function removeCommandInjection($value) {
        $patterns = [
            '/[;&|`\$]/',
            '/\b(cat|chmod|curl|wget|nc|netcat|bash|sh|zsh|ksh|csh|tcsh|dash|rbash|rksh|rzsh|rcsh|rtcsh|rdash|rm|cp|mv|mkdir|rmdir|touch|chown|chgrp|ln|find|grep|sed|awk|perl|python|ruby|php|node|npm|yarn|composer)\b/i',
            '/\b(echo|printf|sprintf|fprintf|vprintf|snprintf|vsnprintf|asprintf|vasprintf)\b/i',
            '/\b(system|exec|shell_exec|passthru|proc_open|popen|pcntl_exec|expect_popen|expect_expectl|expect_expectv|expect_expectu|expect_expecti|expect_expects|expect_expectp|expect_expectf|expect_expectd|expect_expectc|expect_expectb|expect_expecta|expect_expectz|expect_expecty|expect_expectx|expect_expectw|expect_expectv|expect_expectu|expect_expectt|expect_expects|expect_expectr|expect_expectq|expect_expectp|expect_expecto|expect_expectn|expect_expectm|expect_expectl|expect_expectk|expect_expectj|expect_expecti|expect_expecth|expect_expectg|expect_expectf|expect_expecte|expect_expectd|expect_expectc|expect_expectb|expect_expecta)\b/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value)) {
                $this->logViolation('command_injection_attempt', [
                    'value' => $value,
                    'pattern' => $pattern
                ]);
                return '';
            }
        }
        
        return $value;
    }
    
    private function logViolation($type, $details = []) {
        $logFile = __DIR__ . '/../security-reports.log';
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'type' => $type,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'data' => $details
        ];
        
        file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND);
        
        // Send alert if enabled
        if ($this->config['security']['notification']['enable_alerts']) {
            require_once __DIR__ . '/security-alerts.php';
            sendSecurityAlert($type, $details);
        }
    }
}

// Initialize and run sanitizer
$config = require_once __DIR__ . '/security-config.php';
$sanitizer = new RequestSanitizer($config);
$sanitizer->sanitizeRequest(); 
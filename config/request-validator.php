<?php
// Request Validator
class RequestValidator {
    private $config;
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function validateRequest() {
        // Validate request method
        if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST', 'HEAD'])) {
            $this->logViolation('invalid_method', [
                'method' => $_SERVER['REQUEST_METHOD']
            ]);
            return false;
        }
        
        // Validate request headers
        if (!$this->validateHeaders()) {
            return false;
        }
        
        // Validate request parameters
        if (!$this->validateParameters()) {
            return false;
        }
        
        return true;
    }
    
    private function validateHeaders() {
        $requiredHeaders = [
            'User-Agent',
            'Accept',
            'Accept-Language'
        ];
        
        foreach ($requiredHeaders as $header) {
            if (!isset($_SERVER['HTTP_' . strtoupper(str_replace('-', '_', $header))])) {
                $this->logViolation('missing_header', [
                    'header' => $header
                ]);
                return false;
            }
        }
        
        return true;
    }
    
    private function validateParameters() {
        // Check for suspicious patterns in GET parameters
        foreach ($_GET as $key => $value) {
            if ($this->containsSuspiciousPattern($value)) {
                $this->logViolation('suspicious_get_param', [
                    'param' => $key,
                    'value' => $value
                ]);
                return false;
            }
        }
        
        // Check for suspicious patterns in POST parameters
        foreach ($_POST as $key => $value) {
            if ($this->containsSuspiciousPattern($value)) {
                $this->logViolation('suspicious_post_param', [
                    'param' => $key,
                    'value' => $value
                ]);
                return false;
            }
        }
        
        return true;
    }
    
    private function containsSuspiciousPattern($value) {
        $patterns = [
            '/<script/i',
            '/javascript:/i',
            '/on\w+\s*=/i',
            '/data:/i',
            '/vbscript:/i',
            '/expression\s*\(/i',
            '/eval\s*\(/i',
            '/document\./i',
            '/window\./i',
            '/\.\.\//',
            '/\.\.\\/',
            '/union\s+select/i',
            '/select\s+from/i',
            '/insert\s+into/i',
            '/update\s+set/i',
            '/delete\s+from/i',
            '/drop\s+table/i',
            '/exec\s+\(/i',
            '/exec\s+sp_/i',
            '/xp_cmdshell/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value)) {
                return true;
            }
        }
        
        return false;
    }
    
    private function logViolation($type, $details) {
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

// Initialize and run validator
$config = require_once __DIR__ . '/security-config.php';
$validator = new RequestValidator($config);
$validator->validateRequest(); 
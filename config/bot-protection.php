<?php
// Bot Protection System
class BotProtection {
    private $config;
    private $suspiciousPatterns = [
        'bot',
        'crawler',
        'spider',
        'scraper',
        'curl',
        'wget',
        'python-requests',
        'java',
        'perl',
        'ruby',
        'go-http',
        'node-fetch',
        'axios',
        'postman',
        'insomnia'
    ];
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function checkRequest() {
        // Check User-Agent
        if (!$this->validateUserAgent()) {
            return false;
        }
        
        // Check request patterns
        if (!$this->validateRequestPatterns()) {
            return false;
        }
        
        // Check rate limiting
        if (!$this->checkRateLimit()) {
            return false;
        }
        
        return true;
    }
    
    private function validateUserAgent() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        // Check for empty or suspicious User-Agent
        if (empty($userAgent)) {
            $this->logViolation('empty_user_agent');
            return false;
        }
        
        // Check for known bot patterns
        foreach ($this->suspiciousPatterns as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                $this->logViolation('suspicious_user_agent', [
                    'user_agent' => $userAgent,
                    'pattern' => $pattern
                ]);
                return false;
            }
        }
        
        return true;
    }
    
    private function validateRequestPatterns() {
        // Check for rapid requests
        $ip = $_SERVER['REMOTE_ADDR'];
        $cacheFile = sys_get_temp_dir() . '/request_cache_' . md5($ip) . '.json';
        
        $requestData = [];
        if (file_exists($cacheFile)) {
            $requestData = json_decode(file_get_contents($cacheFile), true);
        }
        
        $now = time();
        $requestData[] = $now;
        
        // Keep only last 60 seconds of requests
        $requestData = array_filter($requestData, function($timestamp) use ($now) {
            return $timestamp > ($now - 60);
        });
        
        file_put_contents($cacheFile, json_encode($requestData));
        
        // Check request frequency
        if (count($requestData) > 30) { // More than 30 requests per minute
            $this->logViolation('high_frequency_requests', [
                'count' => count($requestData),
                'timeframe' => '60 seconds'
            ]);
            return false;
        }
        
        return true;
    }
    
    private function checkRateLimit() {
        $ip = $_SERVER['REMOTE_ADDR'];
        $cacheFile = sys_get_temp_dir() . '/rate_limit_' . md5($ip) . '.json';
        
        $rateData = [
            'count' => 0,
            'reset_time' => time() + 3600 // 1 hour
        ];
        
        if (file_exists($cacheFile)) {
            $rateData = json_decode(file_get_contents($cacheFile), true);
            
            if (time() > $rateData['reset_time']) {
                $rateData = [
                    'count' => 0,
                    'reset_time' => time() + 3600
                ];
            }
        }
        
        $rateData['count']++;
        file_put_contents($cacheFile, json_encode($rateData));
        
        // Limit to 1000 requests per hour
        if ($rateData['count'] > 1000) {
            $this->logViolation('rate_limit_exceeded', [
                'count' => $rateData['count'],
                'timeframe' => '1 hour'
            ]);
            return false;
        }
        
        return true;
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

// Initialize and run protection
$config = require_once __DIR__ . '/security-config.php';
$protection = new BotProtection($config);
$protection->checkRequest(); 
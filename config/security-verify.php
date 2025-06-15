<?php
// Security Verification Script
class SecurityVerifier {
    private $config;
    private $results = [];
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function verifyAll() {
        // Test HTTPS enforcement
        $this->verifyHTTPS();
        
        // Test security headers
        $this->verifySecurityHeaders();
        
        // Test file access restrictions
        $this->verifyFileAccess();
        
        // Test session security
        $this->verifySessionSecurity();
        
        // Test request sanitization
        $this->verifyRequestSanitization();
        
        // Test bot protection
        $this->verifyBotProtection();
        
        // Test file integrity
        $this->verifyFileIntegrity();
        
        // Test security monitoring
        $this->verifySecurityMonitoring();
        
        return $this->results;
    }
    
    private function verifyHTTPS() {
        $this->results['https'] = [
            'status' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
            'message' => 'HTTPS is ' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'enabled' : 'disabled')
        ];
    }
    
    private function verifySecurityHeaders() {
        $requiredHeaders = [
            'Content-Security-Policy',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Strict-Transport-Security'
        ];
        
        $headers = headers_list();
        $this->results['security_headers'] = [
            'status' => true,
            'details' => []
        ];
        
        foreach ($requiredHeaders as $header) {
            $found = false;
            foreach ($headers as $h) {
                if (stripos($h, $header) === 0) {
                    $found = true;
                    break;
                }
            }
            $this->results['security_headers']['details'][$header] = $found;
            if (!$found) {
                $this->results['security_headers']['status'] = false;
            }
        }
    }
    
    private function verifyFileAccess() {
        $sensitiveFiles = [
            '.htaccess',
            'config/security-config.php',
            'logs/security-reports.log'
        ];
        
        $this->results['file_access'] = [
            'status' => true,
            'details' => []
        ];
        
        foreach ($sensitiveFiles as $file) {
            $accessible = @file_get_contents($file) !== false;
            $this->results['file_access']['details'][$file] = !$accessible;
            if ($accessible) {
                $this->results['file_access']['status'] = false;
            }
        }
    }
    
    private function verifySessionSecurity() {
        $this->results['session_security'] = [
            'status' => true,
            'details' => []
        ];
        
        // Check session cookie settings
        $this->results['session_security']['details']['httponly'] = ini_get('session.cookie_httponly') === '1';
        $this->results['session_security']['details']['secure'] = ini_get('session.cookie_secure') === '1';
        $this->results['session_security']['details']['samesite'] = ini_get('session.cookie_samesite') === 'Lax' || ini_get('session.cookie_samesite') === 'Strict';
        
        if (!$this->results['session_security']['details']['httponly'] || 
            !$this->results['session_security']['details']['secure'] || 
            !$this->results['session_security']['details']['samesite']) {
            $this->results['session_security']['status'] = false;
        }
    }
    
    private function verifyRequestSanitization() {
        $testInput = '<script>alert("xss")</script>';
        $_GET['test'] = $testInput;
        $_POST['test'] = $testInput;
        
        require_once __DIR__ . '/request-sanitizer.php';
        $sanitizer = new RequestSanitizer($this->config);
        $sanitizer->sanitizeRequest();
        
        $this->results['request_sanitization'] = [
            'status' => true,
            'details' => [
                'get' => $_GET['test'] !== $testInput,
                'post' => $_POST['test'] !== $testInput
            ]
        ];
        
        if ($this->results['request_sanitization']['details']['get'] || 
            $this->results['request_sanitization']['details']['post']) {
            $this->results['request_sanitization']['status'] = false;
        }
    }
    
    private function verifyBotProtection() {
        $_SERVER['HTTP_USER_AGENT'] = 'havij';
        
        require_once __DIR__ . '/bot-protection.php';
        $botProtection = new BotProtection($this->config);
        $result = $botProtection->checkRequest();
        
        $this->results['bot_protection'] = [
            'status' => $result === false,
            'message' => $result === false ? 'Bot protection is working' : 'Bot protection failed'
        ];
    }
    
    private function verifyFileIntegrity() {
        require_once __DIR__ . '/file-integrity.php';
        $integrityChecker = new FileIntegrityChecker($this->config);
        $result = $integrityChecker->checkIntegrity();
        
        $this->results['file_integrity'] = [
            'status' => $result === true,
            'message' => $result === true ? 'File integrity check passed' : 'File integrity check failed'
        ];
    }
    
    private function verifySecurityMonitoring() {
        $logFile = __DIR__ . '/../logs/security-reports.log';
        $this->results['security_monitoring'] = [
            'status' => true,
            'details' => [
                'log_file_exists' => file_exists($logFile),
                'log_file_writable' => is_writable($logFile)
            ]
        ];
        
        if (!$this->results['security_monitoring']['details']['log_file_exists'] || 
            !$this->results['security_monitoring']['details']['log_file_writable']) {
            $this->results['security_monitoring']['status'] = false;
        }
    }
}

// Run verification
$config = require_once __DIR__ . '/security-config.php';
$verifier = new SecurityVerifier($config);
$results = $verifier->verifyAll();

// Output results
header('Content-Type: application/json');
echo json_encode($results, JSON_PRETTY_PRINT); 
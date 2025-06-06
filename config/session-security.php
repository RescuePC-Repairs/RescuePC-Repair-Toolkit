<?php
// Advanced Session Security
class SessionSecurity {
    private $config;
    
    public function __construct($config) {
        $this->config = $config;
        $this->initializeSession();
    }
    
    private function initializeSession() {
        // Set secure session parameters
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', 1);
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.use_strict_mode', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_lifetime', 0);
        ini_set('session.gc_maxlifetime', $this->config['session']['timeout']);
        
        // Set custom session name
        session_name($this->config['session']['name']);
        
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Regenerate session ID periodically
        if (!isset($_SESSION['last_regeneration']) || 
            time() - $_SESSION['last_regeneration'] > 300) { // Every 5 minutes
            $this->regenerateSession();
        }
    }
    
    public function validateSession() {
        // Check if session exists
        if (!isset($_SESSION['created'])) {
            $this->logViolation('session_not_found');
            return false;
        }
        
        // Check session age
        if (time() - $_SESSION['created'] > $this->config['session']['timeout']) {
            $this->logViolation('session_expired');
            $this->destroySession();
            return false;
        }
        
        // Validate session fingerprint
        if (!$this->validateFingerprint()) {
            $this->logViolation('session_fingerprint_mismatch');
            $this->destroySession();
            return false;
        }
        
        // Check for concurrent sessions
        if (!$this->checkConcurrentSessions()) {
            $this->logViolation('concurrent_session_detected');
            $this->destroySession();
            return false;
        }
        
        return true;
    }
    
    private function regenerateSession() {
        // Save old session data
        $oldSession = $_SESSION;
        
        // Regenerate session ID
        session_regenerate_id(true);
        
        // Restore session data
        $_SESSION = $oldSession;
        
        // Update regeneration timestamp
        $_SESSION['last_regeneration'] = time();
        
        // Update session fingerprint
        $this->updateFingerprint();
    }
    
    private function validateFingerprint() {
        if (!isset($_SESSION['fingerprint'])) {
            return false;
        }
        
        $currentFingerprint = $this->generateFingerprint();
        return hash_equals($_SESSION['fingerprint'], $currentFingerprint);
    }
    
    private function updateFingerprint() {
        $_SESSION['fingerprint'] = $this->generateFingerprint();
    }
    
    private function generateFingerprint() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $salt = $this->config['session']['name'];
        
        return hash('sha256', $userAgent . $ip . $salt);
    }
    
    private function checkConcurrentSessions() {
        if (!isset($_SESSION['user_id'])) {
            return true;
        }
        
        $sessionFile = sys_get_temp_dir() . '/session_' . $_SESSION['user_id'] . '.json';
        $currentSessionId = session_id();
        
        if (file_exists($sessionFile)) {
            $data = json_decode(file_get_contents($sessionFile), true);
            
            if ($data['session_id'] !== $currentSessionId) {
                return false;
            }
        }
        
        file_put_contents($sessionFile, json_encode([
            'session_id' => $currentSessionId,
            'last_activity' => time()
        ]));
        
        return true;
    }
    
    public function destroySession() {
        // Clear session data
        $_SESSION = array();
        
        // Destroy session cookie
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
        
        // Destroy session
        session_destroy();
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

// Initialize session security
$config = require_once __DIR__ . '/security-config.php';
$sessionSecurity = new SessionSecurity($config);

// Validate session on each request
$sessionSecurity->validateSession(); 
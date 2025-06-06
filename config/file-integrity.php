<?php
// File Integrity Checker
class FileIntegrityChecker {
    private $config;
    private $hashFile;
    
    public function __construct($config) {
        $this->config = $config;
        $this->hashFile = __DIR__ . '/../.file-integrity.json';
    }
    
    public function checkIntegrity() {
        $currentHashes = $this->generateFileHashes();
        $storedHashes = $this->loadStoredHashes();
        
        if (!$storedHashes) {
            // First run - store hashes
            $this->storeHashes($currentHashes);
            return true;
        }
        
        $violations = [];
        
        // Check for modified files
        foreach ($currentHashes as $file => $hash) {
            if (isset($storedHashes[$file]) && $storedHashes[$file] !== $hash) {
                $violations[] = [
                    'type' => 'file_modified',
                    'file' => $file,
                    'old_hash' => $storedHashes[$file],
                    'new_hash' => $hash
                ];
            }
        }
        
        // Check for new files
        foreach ($currentHashes as $file => $hash) {
            if (!isset($storedHashes[$file])) {
                $violations[] = [
                    'type' => 'file_added',
                    'file' => $file,
                    'hash' => $hash
                ];
            }
        }
        
        // Check for deleted files
        foreach ($storedHashes as $file => $hash) {
            if (!isset($currentHashes[$file])) {
                $violations[] = [
                    'type' => 'file_deleted',
                    'file' => $file
                ];
            }
        }
        
        if (!empty($violations)) {
            $this->logViolations($violations);
            return false;
        }
        
        return true;
    }
    
    private function generateFileHashes() {
        $hashes = [];
        $excludeDirs = ['.git', 'node_modules', 'backups'];
        $excludeFiles = ['.file-integrity.json', 'security-reports.log'];
        
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(__DIR__ . '/..')
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $path = $file->getPathname();
                $relativePath = str_replace(__DIR__ . '/../', '', $path);
                
                // Skip excluded directories and files
                $skip = false;
                foreach ($excludeDirs as $dir) {
                    if (strpos($relativePath, $dir . '/') === 0) {
                        $skip = true;
                        break;
                    }
                }
                
                if ($skip || in_array($relativePath, $excludeFiles)) {
                    continue;
                }
                
                $hashes[$relativePath] = hash_file('sha256', $path);
            }
        }
        
        return $hashes;
    }
    
    private function loadStoredHashes() {
        if (!file_exists($this->hashFile)) {
            return null;
        }
        
        $content = file_get_contents($this->hashFile);
        return json_decode($content, true);
    }
    
    private function storeHashes($hashes) {
        file_put_contents($this->hashFile, json_encode($hashes, JSON_PRETTY_PRINT));
    }
    
    private function logViolations($violations) {
        $logFile = __DIR__ . '/../security-reports.log';
        
        foreach ($violations as $violation) {
            $logEntry = [
                'timestamp' => date('Y-m-d H:i:s'),
                'type' => $violation['type'],
                'ip' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'data' => $violation
            ];
            
            file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND);
            
            // Send alert if enabled
            if ($this->config['security']['notification']['enable_alerts']) {
                require_once __DIR__ . '/security-alerts.php';
                sendSecurityAlert($violation['type'], $violation);
            }
        }
    }
}

// Initialize and run checker
$config = require_once __DIR__ . '/security-config.php';
$checker = new FileIntegrityChecker($config);
$checker->checkIntegrity(); 
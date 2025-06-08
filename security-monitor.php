<?php
// Security Monitoring Script
define('SECURE_ACCESS', true);
require_once __DIR__ . '/config/security-init.php';

class SecurityMonitor {
    private $config;
    private $metrics = [];
    private $alerts = [];
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function checkSystemHealth() {
        // CPU Usage
        if (function_exists('sys_getloadavg')) {
            $load = sys_getloadavg();
            $this->metrics['cpu_usage'] = $load[0];
            if ($load[0] > 80) {
                $this->addAlert('High CPU usage detected: ' . $load[0]);
            }
        }
        
        // Memory Usage
        if (function_exists('memory_get_usage')) {
            $memory_usage = memory_get_usage(true);
            $memory_limit = ini_get('memory_limit');
            $this->metrics['memory_usage'] = $memory_usage;
            if ($memory_usage > 0.8 * $this->parseMemoryLimit($memory_limit)) {
                $this->addAlert('High memory usage detected: ' . $this->formatBytes($memory_usage));
            }
        }
        
        // Disk Usage
        $disk_free = disk_free_space(__DIR__);
        $disk_total = disk_total_space(__DIR__);
        $disk_usage = ($disk_total - $disk_free) / $disk_total * 100;
        $this->metrics['disk_usage'] = $disk_usage;
        if ($disk_usage > 90) {
            $this->addAlert('High disk usage detected: ' . round($disk_usage, 2) . '%');
        }
        
        // Error Rate
        $error_log = $this->config['logging']['log_file'];
        if (file_exists($error_log)) {
            $errors = $this->countRecentErrors($error_log);
            $this->metrics['error_rate'] = $errors;
            if ($errors > 10) {
                $this->addAlert('High error rate detected: ' . $errors . ' errors in the last hour');
            }
        }
        
        // Response Time
        $start_time = microtime(true);
        $this->metrics['response_time'] = microtime(true) - $start_time;
        if ($this->metrics['response_time'] > 1) {
            $this->addAlert('Slow response time detected: ' . round($this->metrics['response_time'], 2) . 's');
        }
        
        // Check for suspicious activities
        $this->checkSuspiciousActivities();
        
        // Save metrics
        $this->saveMetrics();
        
        // Send alerts if needed
        if (count($this->alerts) >= $this->config['monitoring']['alert_threshold']) {
            $this->sendAlerts();
        }
    }
    
    private function checkSuspiciousActivities() {
        // Check for failed login attempts
        $rate_file = $this->config['rate_limiting']['storage_file'];
        if (file_exists($rate_file)) {
            $rate_data = json_decode(file_get_contents($rate_file), true);
            foreach ($rate_data as $ip => $actions) {
                if (isset($actions['login']) && $actions['login']['count'] >= $this->config['security']['max_login_attempts']) {
                    $this->addAlert('Suspicious login attempts from IP: ' . $ip);
                }
            }
        }
        
        // Check for unusual file modifications
        $this->checkFileIntegrity();
    }
    
    private function checkFileIntegrity() {
        $critical_files = [
            __DIR__ . '/config/security-config.php',
            __DIR__ . '/config/security-init.php',
            __DIR__ . '/security-dashboard.php'
        ];
        
        foreach ($critical_files as $file) {
            if (file_exists($file)) {
                $current_hash = hash_file('sha256', $file);
                $stored_hash = $this->getStoredFileHash($file);
                
                if ($stored_hash && $current_hash !== $stored_hash) {
                    $this->addAlert('File modification detected: ' . basename($file));
                }
            }
        }
    }
    
    private function getStoredFileHash($file) {
        $hash_file = __DIR__ . '/config/file_hashes.json';
        if (file_exists($hash_file)) {
            $hashes = json_decode(file_get_contents($hash_file), true);
            return $hashes[basename($file)] ?? null;
        }
        return null;
    }
    
    private function countRecentErrors($log_file) {
        $errors = 0;
        $one_hour_ago = time() - 3600;
        
        if (file_exists($log_file)) {
            $handle = fopen($log_file, 'r');
            while (($line = fgets($handle)) !== false) {
                $log_entry = json_decode($line, true);
                if ($log_entry && isset($log_entry['timestamp'])) {
                    $log_time = strtotime($log_entry['timestamp']);
                    if ($log_time >= $one_hour_ago) {
                        $errors++;
                    }
                }
            }
            fclose($handle);
        }
        
        return $errors;
    }
    
    private function addAlert($message) {
        $this->alerts[] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'message' => $message
        ];
    }
    
    private function saveMetrics() {
        $metrics_file = __DIR__ . '/logs/metrics.json';
        $metrics_data = [
            'timestamp' => date('Y-m-d H:i:s'),
            'metrics' => $this->metrics
        ];
        
        file_put_contents($metrics_file, json_encode($metrics_data) . "\n", FILE_APPEND);
    }
    
    private function sendAlerts() {
        foreach ($this->config['monitoring']['alert_methods'] as $method) {
            switch ($method) {
                case 'email':
                    $this->sendEmailAlert();
                    break;
                case 'log':
                    $this->logAlert();
                    break;
            }
        }
    }
    
    private function sendEmailAlert() {
        // Implement email sending logic here
        // You can use PHPMailer or other email libraries
    }
    
    private function logAlert() {
        $alert_log = __DIR__ . '/logs/alerts.log';
        foreach ($this->alerts as $alert) {
            file_put_contents($alert_log, json_encode($alert) . "\n", FILE_APPEND);
        }
    }
    
    private function parseMemoryLimit($limit) {
        $unit = strtolower(substr($limit, -1));
        $value = (int)$limit;
        
        switch ($unit) {
            case 'g':
                $value *= 1024;
            case 'm':
                $value *= 1024;
            case 'k':
                $value *= 1024;
        }
        
        return $value;
    }
    
    private function formatBytes($bytes) {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        return round($bytes / pow(1024, $pow), 2) . ' ' . $units[$pow];
    }
}

// Initialize and run the monitor
$monitor = new SecurityMonitor($config);
$monitor->checkSystemHealth(); 
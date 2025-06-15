<?php
// Security Backup System
$config = require_once __DIR__ . '/security-config.php';

function backupSecurityLogs() {
    $logFile = __DIR__ . '/../security-reports.log';
    $backupDir = __DIR__ . '/../backups/security';
    $date = date('Y-m-d_H-i-s');
    
    // Create backup directory if it doesn't exist
    if (!file_exists($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    // Create backup file
    $backupFile = $backupDir . '/security_log_' . $date . '.log';
    
    if (file_exists($logFile)) {
        // Copy current log file
        copy($logFile, $backupFile);
        
        // Compress backup
        $gzFile = $backupFile . '.gz';
        $fp = gzopen($gzFile, 'w9');
        gzwrite($fp, file_get_contents($backupFile));
        gzclose($fp);
        
        // Remove uncompressed backup
        unlink($backupFile);
        
        // Clean old backups (keep last 30 days)
        $files = glob($backupDir . '/*.gz');
        $now = time();
        
        foreach ($files as $file) {
            if (is_file($file)) {
                if ($now - filemtime($file) >= 30 * 24 * 60 * 60) { // 30 days
                    unlink($file);
                }
            }
        }
        
        return true;
    }
    
    return false;
}

// Run backup
backupSecurityLogs(); 
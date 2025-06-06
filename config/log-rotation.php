<?php
// Log Rotation Script
$config = require_once __DIR__ . '/security-config.php';
$logFile = __DIR__ . '/../security-reports.log';

function rotateLogs($logFile, $config) {
    if (!file_exists($logFile)) {
        return;
    }

    $maxSize = $config['security']['log_rotation']['max_size'];
    $maxFiles = $config['security']['log_rotation']['max_files'];
    $compress = $config['security']['log_rotation']['compress'];

    // Check if current log file exceeds max size
    if (filesize($logFile) > $maxSize) {
        // Rotate existing log files
        for ($i = $maxFiles - 1; $i >= 0; $i--) {
            $oldFile = $i === 0 ? $logFile : $logFile . '.' . $i;
            $newFile = $logFile . '.' . ($i + 1);
            
            if (file_exists($oldFile)) {
                if ($i === $maxFiles - 1) {
                    // Delete oldest log file
                    unlink($oldFile);
                } else {
                    // Move to next number
                    rename($oldFile, $newFile);
                    
                    // Compress if enabled
                    if ($compress && $i > 0) {
                        $gzFile = $newFile . '.gz';
                        $fp = gzopen($gzFile, 'w9');
                        gzwrite($fp, file_get_contents($newFile));
                        gzclose($fp);
                        unlink($newFile);
                    }
                }
            }
        }
        
        // Create new empty log file
        file_put_contents($logFile, '');
    }
}

// Run log rotation
rotateLogs($logFile, $config); 
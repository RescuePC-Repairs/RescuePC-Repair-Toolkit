<?php
class Backup {
    private $backupDir;
    private $dbConfig;
    private $logger;
    
    public function __construct($backupDir = 'backups', $dbConfig = [], $logger = null) {
        $this->backupDir = $backupDir;
        $this->dbConfig = $dbConfig;
        $this->logger = $logger;
        
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }
    }
    
    public function createFullBackup() {
        try {
            $timestamp = date('Y-m-d_H-i-s');
            $backupPath = $this->backupDir . '/backup_' . $timestamp;
            mkdir($backupPath, 0755, true);
            
            // Backup files
            $this->backupFiles($backupPath);
            
            // Backup database
            if (!empty($this->dbConfig)) {
                $this->backupDatabase($backupPath);
            }
            
            // Create archive
            $this->createArchive($backupPath);
            
            // Clean up old backups
            $this->cleanupOldBackups();
            
            if ($this->logger) {
                $this->logger->info('Full backup completed successfully', ['path' => $backupPath]);
            }
            
            return true;
        } catch (Exception $e) {
            if ($this->logger) {
                $this->logger->error('Backup failed', ['error' => $e->getMessage()]);
            }
            throw $e;
        }
    }
    
    private function backupFiles($backupPath) {
        $filesPath = $backupPath . '/files';
        mkdir($filesPath, 0755, true);
        
        // Exclude directories
        $excludeDirs = [
            'backups',
            'node_modules',
            '.git',
            'logs'
        ];
        
        // Create file backup
        $this->recursiveCopy('.', $filesPath, $excludeDirs);
    }
    
    private function backupDatabase($backupPath) {
        if (empty($this->dbConfig)) {
            return;
        }
        
        $dbPath = $backupPath . '/database';
        mkdir($dbPath, 0755, true);
        
        $filename = $dbPath . '/database.sql';
        $command = sprintf(
            'mysqldump -h %s -u %s -p%s %s > %s',
            escapeshellarg($this->dbConfig['host']),
            escapeshellarg($this->dbConfig['username']),
            escapeshellarg($this->dbConfig['password']),
            escapeshellarg($this->dbConfig['database']),
            escapeshellarg($filename)
        );
        
        exec($command, $output, $returnVar);
        
        if ($returnVar !== 0) {
            throw new Exception('Database backup failed');
        }
    }
    
    private function createArchive($backupPath) {
        $archiveName = $backupPath . '.zip';
        $zip = new ZipArchive();
        
        if ($zip->open($archiveName, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            $this->addDirToZip($backupPath, $zip);
            $zip->close();
            
            // Remove the uncompressed backup directory
            $this->recursiveRemove($backupPath);
        } else {
            throw new Exception('Failed to create backup archive');
        }
    }
    
    private function cleanupOldBackups() {
        $maxBackups = 5; // Keep last 5 backups
        $backups = glob($this->backupDir . '/backup_*.zip');
        
        if (count($backups) > $maxBackups) {
            usort($backups, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
            
            $oldBackups = array_slice($backups, $maxBackups);
            foreach ($oldBackups as $backup) {
                unlink($backup);
            }
        }
    }
    
    private function recursiveCopy($src, $dst, $excludeDirs = []) {
        $dir = opendir($src);
        @mkdir($dst);
        
        while (($file = readdir($dir)) !== false) {
            if ($file != '.' && $file != '..') {
                $srcFile = $src . '/' . $file;
                $dstFile = $dst . '/' . $file;
                
                if (is_dir($srcFile)) {
                    if (!in_array($file, $excludeDirs)) {
                        $this->recursiveCopy($srcFile, $dstFile, $excludeDirs);
                    }
                } else {
                    copy($srcFile, $dstFile);
                }
            }
        }
        
        closedir($dir);
    }
    
    private function recursiveRemove($dir) {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (is_dir($dir . "/" . $object)) {
                        $this->recursiveRemove($dir . "/" . $object);
                    } else {
                        unlink($dir . "/" . $object);
                    }
                }
            }
            rmdir($dir);
        }
    }
    
    private function addDirToZip($dir, $zip, $basePath = '') {
        $files = scandir($dir);
        
        foreach ($files as $file) {
            if ($file != '.' && $file != '..') {
                $filePath = $dir . '/' . $file;
                $zipPath = $basePath . '/' . $file;
                
                if (is_dir($filePath)) {
                    $this->addDirToZip($filePath, $zip, $zipPath);
                } else {
                    $zip->addFile($filePath, $zipPath);
                }
            }
        }
    }
}

// Usage example:
// $dbConfig = [
//     'host' => 'localhost',
//     'username' => 'user',
//     'password' => 'pass',
//     'database' => 'dbname'
// ];
// $logger = new Logger();
// $backup = new Backup('backups', $dbConfig, $logger);
// $backup->createFullBackup();
?> 
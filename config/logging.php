<?php
class Logger {
    private $logFile;
    private $logLevel;
    
    const ERROR = 'ERROR';
    const WARNING = 'WARNING';
    const INFO = 'INFO';
    const DEBUG = 'DEBUG';
    
    public function __construct($logFile = 'logs/app.log', $logLevel = self::INFO) {
        $this->logFile = $logFile;
        $this->logLevel = $logLevel;
        
        // Create logs directory if it doesn't exist
        $logDir = dirname($logFile);
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
    }
    
    public function log($message, $level = self::INFO, $context = []) {
        if ($this->shouldLog($level)) {
            $logEntry = $this->formatLogEntry($message, $level, $context);
            $this->writeLog($logEntry);
        }
    }
    
    private function shouldLog($level) {
        $levels = [
            self::DEBUG => 0,
            self::INFO => 1,
            self::WARNING => 2,
            self::ERROR => 3
        ];
        
        return $levels[$level] >= $levels[$this->logLevel];
    }
    
    private function formatLogEntry($message, $level, $context) {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? json_encode($context) : '';
        return sprintf(
            "[%s] %s: %s %s\n",
            $timestamp,
            $level,
            $message,
            $contextStr
        );
    }
    
    private function writeLog($logEntry) {
        file_put_contents(
            $this->logFile,
            $logEntry,
            FILE_APPEND | LOCK_EX
        );
    }
    
    public function error($message, $context = []) {
        $this->log($message, self::ERROR, $context);
    }
    
    public function warning($message, $context = []) {
        $this->log($message, self::WARNING, $context);
    }
    
    public function info($message, $context = []) {
        $this->log($message, self::INFO, $context);
    }
    
    public function debug($message, $context = []) {
        $this->log($message, self::DEBUG, $context);
    }
}

// Usage example:
// $logger = new Logger();
// $logger->error('Database connection failed', ['error' => $e->getMessage()]);
// $logger->info('User logged in', ['user_id' => $userId]);
?> 
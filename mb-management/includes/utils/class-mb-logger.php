<?php
class MB_Logger {
    private $log_directory;

    public function __construct() {
        $upload_dir = wp_upload_dir();
        $this->log_directory = $upload_dir['basedir'] . '/mb-logs';
        
        if (!file_exists($this->log_directory)) {
            wp_mkdir_p($this->log_directory);
        }
    }

    public function info($message) {
        $this->log('INFO', $message);
    }

    public function error($message) {
        $this->log('ERROR', $message);
    }

    public function warning($message) {
        $this->log('WARNING', $message);
    }

    public function debug($message) {
        if (WP_DEBUG) {
            $this->log('DEBUG', $message);
        }
    }

    private function log($level, $message) {
        $timestamp = current_time('mysql');
        $user_id = get_current_user_id();
        $log_entry = sprintf(
            "[%s] [%s] [User: %d] %s\n",
            $timestamp,
            $level,
            $user_id,
            $message
        );

        $filename = $this->log_directory . '/' . date('Y-m-d') . '.log';
        error_log($log_entry, 3, $filename);
    }

    public function get_logs($date = null, $level = null) {
        if ($date === null) {
            $date = date('Y-m-d');
        }

        $filename = $this->log_directory . '/' . $date . '.log';
        if (!file_exists($filename)) {
            return [];
        }

        $logs = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($level === null) {
            return $logs;
        }

        return array_filter($logs, function($log) use ($level) {
            return strpos($log, "[$level]") !== false;
        });
    }
} 
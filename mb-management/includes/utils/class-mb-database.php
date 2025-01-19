<?php
class MB_Database {
    private $logger;

    public function __construct() {
        $this->logger = new MB_Logger();
    }

    public function begin_transaction() {
        global $wpdb;
        return $wpdb->query('START TRANSACTION');
    }

    public function commit() {
        global $wpdb;
        return $wpdb->query('COMMIT');
    }

    public function rollback() {
        global $wpdb;
        return $wpdb->query('ROLLBACK');
    }

    public function safe_query($query, $args = []) {
        global $wpdb;
        
        try {
            if (!empty($args)) {
                $query = $wpdb->prepare($query, $args);
            }
            
            $result = $wpdb->query($query);
            
            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }
            
            return $result;
        } catch (Exception $e) {
            $this->logger->error('Database query failed: ' . $e->getMessage());
            return false;
        }
    }

    public function get_results($query, $args = [], $output = OBJECT) {
        global $wpdb;
        
        try {
            if (!empty($args)) {
                $query = $wpdb->prepare($query, $args);
            }
            
            $results = $wpdb->get_results($query, $output);
            
            if ($results === null) {
                throw new Exception($wpdb->last_error);
            }
            
            return $results;
        } catch (Exception $e) {
            $this->logger->error('Database get_results failed: ' . $e->getMessage());
            return false;
        }
    }
} 
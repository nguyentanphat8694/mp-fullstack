<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Customer extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_customers';
        $this->fillable = array(
            'name' => [true, 'string'],
            'phone' => [true, 'string'],
            'source' => [true, 'enum', ['facebook', 'tiktok', 'youtube', 'walk_in']],
            'assigned_to' => [false],
            'status' => [true, 'enum', ['new', 'contacted', 'appointment', 'contracted', 'completed']],
            'created_at' => [false],
            'created_by' => [false]
        );
    }
}
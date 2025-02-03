<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Notification extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_notifications';
        $this->fillable = array(
            'user_id' => [false],
            'type' => [true, 'string'],
            'title' => [true, 'string'],
            'content' => [true, 'string'],
            'read_at' => [false],
            'created_at' => [false],
        );
    }
}
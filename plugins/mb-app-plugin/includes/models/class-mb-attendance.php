<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Attendance extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_attendance';
        $this->fillable = array(
            'user_id' => [false],
            'check_in' => [true, 'datetime'],
            'check_out' => [true, 'datetime'],
            'ip_address' => [true, 'string'],
            'wifi_name' => [true, 'string'],
            'created_at' => [false],
        );
    }
}
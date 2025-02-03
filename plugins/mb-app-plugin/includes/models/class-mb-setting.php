<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Setting extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_settings';
        $this->fillable = array(
            'setting_name' => [true, 'string'],
            'setting_value' => [true, 'string'],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
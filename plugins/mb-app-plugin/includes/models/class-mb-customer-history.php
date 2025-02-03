<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Customer_History extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_customer_history';
        $this->fillable = array(
            'customer_id' => [false],
            'action' => [true, 'string'],
            'note' => [true, 'string'],
            'created_at' => [false],
            'created_by' => [false]
        );
    }
}
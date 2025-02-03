<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Contract extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contracts';
        $this->fillable = array(
            'customer_id' => [false],
            'type' => [true, 'enum', ['dress_rental', 'wedding_photo', 'pre_wedding_photo']],
            'total_amount' => [true, 'decimal'],
            'paid_amount' => [true, 'decimal'],
            'start_date' => [true, 'datetime'],
            'end_date' => [true, 'datetime'],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Contract_Payment extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_payments';
        $this->fillable = array(
            'contract_id' => [false],
            'amount' => [true, 'decimal'],
            'payment_date' => [true, 'datetime'],
            'payment_method' => [true, 'string'],
            'created_at' => [false],
            'created_by' => [false],
        );
    }
}
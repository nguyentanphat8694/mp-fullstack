<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Transaction extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_transactions';
        $this->fillable = array(
            'type' => [true, 'enum', ['income', 'expense']],
            'amount' => [true, 'decimal'],
            'description' => [true, 'string'],
            'contract_id' => [false],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
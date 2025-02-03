<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Contract_Product_Inspection extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_product_inspections';
        $this->fillable = array(
            'contract_id' => [false],
            'product_id' => [false],
            'status' => [true, 'enum', ['pending', 'checked', 'approved']],
            'issues' => [true, 'string'],
            'created_note' => [true, 'string'],
            'checked_note' => [true, 'string'],
            'approved_note' => [true, 'string'],
            'created_by' => [false],
            'created_at' => [false],
            'checked_by' => [false],
            'checked_at' => [false],
            'approved_by' => [false],
            'approved_at' => [false],
        );
    }
}
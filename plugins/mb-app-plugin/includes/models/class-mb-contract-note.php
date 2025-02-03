<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Contract_Note extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_notes';
        $this->fillable = array(
            'contract_id' => [false],
            'note' => [true, 'string'],
            'status' => [true, 'enum', ['pending', 'approved', 'rejected']],
            'approved_by' => [false],
            'created_at' => [false],
            'created_by' => [false],
        );
    }
}
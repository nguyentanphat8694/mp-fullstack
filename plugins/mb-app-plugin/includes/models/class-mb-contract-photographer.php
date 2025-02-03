<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Contract_Photographer extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_photographers';
        $this->fillable = array(
            'contract_id' => [false],
            'photographer_id' => [false],
            'start_date' => [true, 'datetime'],
            'end_date' => [true, 'datetime'],
            'created_at' => [false],
            'created_by' => [false],
        );
    }
}
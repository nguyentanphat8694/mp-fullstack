<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Contract_Product extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_products';
        $this->fillable = array(
            'contract_id' => [false],
            'product_id' => [false],
            'rental_start' => [true, 'datetime'],
            'rental_end' => [true, 'datetime'],
            'created_at' => [false],
            'created_by' => [false],
        );
    }
}
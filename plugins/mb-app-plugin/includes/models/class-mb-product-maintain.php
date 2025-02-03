<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Product_Maintain extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_product_maintain';
        $this->fillable = array(
            'product_id' => [false],
            'status' => [true, 'enum', ['pending', 'processing', 'done']],
            'created_at' => [false],
            'created_by' => [false],
            'maintain_start_at' => [true, 'datetime'],
            'maintain_end_at' => [true, 'datetime'],
            'maintain_by' => [false],
        );
    }
}
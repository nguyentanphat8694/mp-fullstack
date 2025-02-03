<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Product extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_products';
        $this->fillable = array(
            'code' => [true, 'string'],
            'name' => [true, 'string'],
            'category' => [true, 'enum', ['wedding_dress', 'vest', 'accessories', 'ao_dai']],
            'description' => [true, 'string'],
            'images' => [true, 'string'],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
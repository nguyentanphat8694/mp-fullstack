<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Reward extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_rewards';
        $this->fillable = array(
            'user_id' => [false],
            'type' => [true, 'enum', ['reward', 'penalty']],
            'amount' => [true, 'decimal'],
            'title' => [true, 'string'],
            'reason' => [true, 'string'],
            'status' => [true, 'enum', ['pending', 'approved', 'rejected']],
            'approved_by' => [false],
            'approved_at' => [false],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
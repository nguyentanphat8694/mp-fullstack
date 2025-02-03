<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Task extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_tasks';
        $this->fillable = array(
            'title' => [true, 'string'],
            'description' => [true, 'string'],
            'assigned_to' => [false],
            'status' => [true, 'enum', ['pending', 'in_progress', 'completed']],
            'due_date' => [true, 'datetime'],
            'created_by' => [false],
            'created_at' => [false],
            'updated_at' => [false],
        );
    }
}
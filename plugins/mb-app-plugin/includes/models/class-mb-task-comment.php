<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Task_Comment extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_task_comments';
        $this->fillable = array(
            'task_id' => [true, 'int'],
            'comment' => [true, 'string'],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
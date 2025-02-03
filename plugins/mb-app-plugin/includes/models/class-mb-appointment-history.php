<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Appointment_History extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_appointment_history';
        $this->fillable = array(
            'appointment_id' => [false],
            'appointment_date' => [true, 'datetime'],
            'action' => [true, 'string'],
            'note' => [true, 'string'],
            'created_by' => [false],
            'created_at' => [false],
        );
    }
}
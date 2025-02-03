<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Appointment extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_appointments';
        $this->fillable = array(
            'customer_id' => [false],
            'appointment_date' => [true, 'datetime'],
            'status' => [true, 'enum', ['scheduled', 'receiving', 'completed', 'cancelled']],
            'assigned_to' => [false],
            'created_at' => [false],
            'created_by' => [false]
        );
    }
}
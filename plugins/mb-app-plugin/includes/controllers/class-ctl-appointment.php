<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Appointment_Controller {
    private $appointment_model;
    private $appointment_history_model;

    public function __construct() {
        $this->appointment_model = new MB_Appointment();
        $this->appointment_history_model = new MB_Appointment_History();
    }

    public function create_appointment($data) {
        try {
            $this->appointment_model->db->begin_transaction();

            // Validate required fields
            if (empty($data['customer_id']) || empty($data['appointment_date'])) {
                return new WP_Error('missing_required_fields', 'Missing required fields');
            }

            // Prepare appointment data
            $appointment_data = array(
                'customer_id' => absint($data['customer_id']),
                'appointment_date' => sanitize_text_field($data['appointment_date']),
                'status' => 'scheduled',
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            // Create appointment
            $appointment_id = $this->appointment_model->create($appointment_data);
            if (is_wp_error($appointment_id)) {
                throw new Exception($appointment_id->get_error_message());
            }

            // Create history record
            $history_data = array(
                'appointment_id' => $appointment_id,
                'appointment_date' => $appointment_data['appointment_date'],
                'action' => 'created',
                'note' => 'Appointment scheduled',
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            $this->appointment_model->db->commit();
            return $this->get_appointment($appointment_id);
        } catch (Exception $e) {
            $this->appointment_model->db->rollback();
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_appointment($id) {
        try {
            $result = $this->appointment_model->get($id);
            if (!$result) {
                return new WP_Error('not_found', 'Appointment not found');
            }
            return $result;
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_appointments($args = array()) {
        try {
            $query_args = array(
                'where' => array(),
                'limit' => isset($args['limit']) ? absint($args['limit']) : 20,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0
            );

            // Filter by appointment date
            $date = isset($args['date']) ? $args['date'] : current_time('Y-m-d');
            $query_args['where_raw'] = "DATE(appointment_date) = DATE('" . sanitize_text_field($date) . "')";

            // Additional filters
            if (isset($args['status'])) {
                $query_args['where']['status'] = sanitize_text_field($args['status']);
            }
            if (isset($args['assigned_to'])) {
                $query_args['where']['assigned_to'] = absint($args['assigned_to']);
            }

            return $this->appointment_model->get_all($query_args);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_appointment($id, $data) {
        try {
            $this->appointment_model->db->begin_transaction();

            // Check if appointment exists
            $appointment = $this->get_appointment($id);
            if (is_wp_error($appointment)) {
                return $appointment;
            }

            // Prepare update data
            $update_data = array();
            $allowed_fields = array('appointment_date', 'status');
            foreach ($allowed_fields as $field) {
                if (isset($data[$field])) {
                    $update_data[$field] = sanitize_text_field($data[$field]);
                }
            }

            if (empty($update_data)) {
                return new WP_Error('update_error', 'No valid fields to update');
            }

            // Update appointment
            $result = $this->appointment_model->update($id, $update_data);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            // Create history record
            $history_data = array(
                'appointment_id' => $id,
                'appointment_date' => $update_data['appointment_date'] ?? $appointment->appointment_date,
                'action' => 'updated',
                'note' => 'Appointment updated',
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            $this->appointment_model->db->commit();
            return $this->get_appointment($id);
        } catch (Exception $e) {
            $this->appointment_model->db->rollback();
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function assign_appointment($id, $is_receiving) {
        try {
            $this->appointment_model->db->begin_transaction();

            // Check if appointment exists
            $appointment = $this->get_appointment($id);
            if (is_wp_error($appointment)) {
                return $appointment;
            }

            $current_user_id = get_current_user_id();
            $update_data = array();

            if ($is_receiving) {
                $update_data['assigned_to'] = $current_user_id;
                $action_note = 'Appointment assigned to user';
            } else {
                // Only allow unassign if currently assigned to the same user
                if ($appointment->assigned_to == $current_user_id) {
                    $update_data['assigned_to'] = null;
                    $action_note = 'Appointment unassigned';
                } else {
                    return new WP_Error('unauthorized', 'Cannot unassign appointment not assigned to you');
                }
            }

            // Update appointment
            $result = $this->appointment_model->update($id, $update_data);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            // Create history record
            $history_data = array(
                'appointment_id' => $id,
                'appointment_date' => $appointment->appointment_date,
                'action' => $is_receiving ? 'assigned' : 'unassigned',
                'note' => $action_note,
                'created_by' => $current_user_id,
                'created_at' => current_time('mysql')
            );

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            $this->appointment_model->db->commit();
            return $this->get_appointment($id);
        } catch (Exception $e) {
            $this->appointment_model->db->rollback();
            return new WP_Error('assign_error', $e->getMessage());
        }
    }

    public function delete_appointment($id) {
        try {
            $result = $this->appointment_model->delete($id);
            if (is_wp_error($result)) {
                return $result;
            }
            return true;
        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }
} 
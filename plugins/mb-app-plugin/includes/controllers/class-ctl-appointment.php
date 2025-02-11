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
                'note' => isset($data['note']) ? $data['note'] : '',
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            return $appointment_id;
        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_appointment($id) {
        try {
            global $wpdb;
            
            $query = $wpdb->prepare(
                "SELECT 
                    a.customer_id,
                    a.appointment_date,
                    ah.note
                FROM mb_appointments a
                LEFT JOIN (
                    SELECT appointment_id, note
                    FROM mb_appointment_history
                    WHERE id IN (
                        SELECT MAX(id)
                        FROM mb_appointment_history
                        GROUP BY appointment_id
                    )
                ) ah ON a.id = ah.appointment_id
                WHERE a.id = %d",
                $id
            );

            $result = $wpdb->get_row($query);
            
            if ($wpdb->last_error) {
                throw new Exception($wpdb->last_error);
            }

            if (!$result) {
                return new WP_Error('not_found', 'Appointment not found');
            }

            return array(
                'customer_id' => (int)$result->customer_id,
                'appointment_date' => $result->appointment_date,
                'note' => $result->note
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_appointments($args = array()) {
        try {
            global $wpdb;

            $where_conditions = array();
            $where_values = array();

            // Filter by appointment date
            $date = isset($args['date']) ? $args['date'] : current_time('Y-m-d');
            $where_conditions[] = "DATE(a.appointment_date) = DATE(%s)";
            $where_values[] = sanitize_text_field($date);

            // Additional filters
            if (isset($args['status'])) {
                $where_conditions[] = "a.status = %s";
                $where_values[] = sanitize_text_field($args['status']);
            }
            if (isset($args['assigned_to'])) {
                $where_conditions[] = "a.assigned_to = %d";
                $where_values[] = absint($args['assigned_to']);
            }

            $where_clause = !empty($where_conditions) 
                ? "WHERE " . implode(" AND ", $where_conditions)
                : "";

            $limit = isset($args['limit']) ? absint($args['limit']) : 20;
            $offset = isset($args['offset']) ? absint($args['offset']) : 0;

            $query = $wpdb->prepare(
                "SELECT 
                    c.name as customer_name,
                    c.phone as customer_phone,
                    a.status,
                    a.appointment_date,
                    u.display_name as assigned_to_name,
                    a.created_at,
                    ah.note
                FROM mb_appointments a
                JOIN mb_customers c ON a.customer_id = c.id
                LEFT JOIN {$wpdb->users} u ON a.assigned_to = u.ID
                LEFT JOIN (
                    SELECT appointment_id, note
                    FROM mb_appointment_history
                    WHERE id IN (
                        SELECT MAX(id)
                        FROM mb_appointment_history
                        GROUP BY appointment_id
                    )
                ) ah ON a.id = ah.appointment_id
                {$where_clause}
                ORDER BY a.appointment_date ASC
                LIMIT %d OFFSET %d",
                array_merge($where_values, array($limit, $offset))
            );

            $results = $wpdb->get_results($query);
            
            if ($wpdb->last_error) {
                throw new Exception($wpdb->last_error);
            }

            return array_map(function($row) {
                return array(
                    'customer_name' => $row->customer_name,
                    'customer_phone' => $row->customer_phone,
                    'status' => $row->status,
                    'appointment_date' => $row->appointment_date,
                    'assigned_to_name' => $row->assigned_to_name,
                    'created_at' => $row->created_at,
                    'note' => $row->note
                );
            }, $results);

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_appointment($id, $data) {
        try {
            // Check if appointment exists
            $appointment = $this->get_appointment($id);
            if (is_wp_error($appointment)) {
                return $appointment;
            }

            // Prepare update data
            $update_data = array();
            $allowed_fields = array('appointment_date', 'status', 'note');
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
                'appointment_date' => isset($update_data['appointment_date']) ? $update_data['appointment_date'] : $appointment['appointment_date'],
                'action' => 'updated',
                'note' => isset($update_data['note']) ? $update_data['note'] : '',
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            if (isset($data['note'])) {
                $history_data['note'] = $data['note'];
            }

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            return $id;
        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function assign_appointment($id, $type) {
        try {
            // Check if appointment exists
            $appointment = $this->get_appointment($id);
            if (is_wp_error($appointment)) {
                return $appointment;
            }

            $current_user_id = get_current_user_id();
            $update_data = array();

            if ($type) {
                $update_data['assigned_to'] = $current_user_id;
                $action_note = 'Appointment assigned to user';
            } else {
                // Only allow unassign if currently assigned to the same user
                if ($appointment['assigned_to'] == $current_user_id) {
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
                'appointment_date' => $appointment['appointment_date'],
                'action' => $type ? 'assigned' : 'unassigned',
                'note' => $action_note,
                'created_by' => $current_user_id,
                'created_at' => current_time('mysql')
            );

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            return $id;
        } catch (Exception $e) {
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

    public function complete_appointment($id, $type, $note = '') {
        try {
            // Check if appointment exists
            $appointment = $this->get_appointment($id);
            if (is_wp_error($appointment)) {
                return $appointment;
            }

            // Prepare update data
            $update_data = array(
                'status' => $type ? 'completed' : 'cancelled'
            );

            // Update appointment
            $result = $this->appointment_model->update($id, $update_data);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            // Create history record
            $history_data = array(
                'appointment_id' => $id,
                'appointment_date' => $appointment['appointment_date'],
                'action' => $type ? 'completed' : 'cancelled',
                'note' => $note,
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            $history_id = $this->appointment_history_model->create($history_data);
            if (is_wp_error($history_id)) {
                throw new Exception($history_id->get_error_message());
            }

            return $id;

        } catch (Exception $e) {
            return new WP_Error('complete_error', $e->getMessage());
        }
    }
} 
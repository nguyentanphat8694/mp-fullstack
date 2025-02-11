<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Customer_Controller {
    private $customer_model;
    private $customer_history_model;
    private $notification_model;

    public function __construct() {
        $this->customer_model = new MB_Customer();
        $this->customer_history_model = new MB_Customer_History();
        $this->notification_model = new MB_Notification();
    }

    public function create_customer($data) {
        try {
            // Prepare customer data
            $customer_data = array(
                'name' => isset($data['name']) ? $data['name'] : null,
                'phone' => isset($data['phone']) ? $data['phone'] : null,
                'source' => isset($data['source']) ? $data['source'] : 'facebook',
                'status' => isset($data['status']) ? $data['status'] : 'new',
                'assigned_to' => isset($data['assigned_to']) ? intval($data['assigned_to']) : null,
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            // Create customer
            $customer_id = $this->customer_model->create($customer_data);
            if (is_wp_error($customer_id)) {
                return $customer_id;
            }

            // Create customer history
            $history_data = array(
                'customer_id' => $customer_id,
                'action' => 'Tạo mới khách hàng',
                'note' => isset($data['note']) ? $data['note'] : null,
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );
            $customer_history_id = $this->customer_history_model->create($history_data);
            if (is_wp_error($customer_history_id)) {
                return $customer_history_id;
            }
            return $customer_id;
        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_customer($id) {
        try {
            $result = $this->customer_model->get($id);
            if (!$result) {
                return new WP_Error('not_found', 'Customer not found');
            }
            return $result;
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_customers($args = array()) {
        try {
            $query_args = array(
                'orderby' => 'created_at',
                'limit' => 20,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0,
                'where' => array(),
                'search' => isset($args['search']) ? sanitize_text_field($args['search']) : '',
                'search_fields' => array('name', 'phone')
            );

            // Add filters to where clause
            $allowed_filters = array('source', 'status', 'assigned_to', 'created_by');
            if (isset($args['where'])) {
                foreach ($allowed_filters as $filter) {
                    if (isset($args[$filter])) {
                        $query_args['where'][$filter] = sanitize_text_field($args[$filter]);
                    }
                }
            }
            return $this->customer_model->get_all($query_args);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_customer($id, $data) {
        try {
            // Prepare customer data
            $customer_data = array(
                'name' => isset($data['name']) ? $data['name'] : null,
                'phone' => isset($data['phone']) ? $data['phone'] : null,
                'source' => isset($data['source']) ? $data['source'] : null,
                'status' => isset($data['status']) ? $data['status'] : null,
                'assigned_to' => isset($data['assigned_to']) ? intval($data['assigned_to']) : null,
            );
            
            // Remove null values
            $customer_data = array_filter($customer_data, function($value) {
                return $value !== null;
            });

            $result = $this->customer_model->update($id, $customer_data);
            if (is_wp_error($result)) {
                return $result;
            }
            return $this->get_customer($id);
        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_customer($id) {
        try {
            $result = $this->customer_model->delete($id);
            if (is_wp_error($result)) {
                return $result;
            }
            return true;
        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }

    public function assign_customer($customer_id, $user_id) {
        try {
            $update_data = array(
                'assigned_to' => $user_id,
            );
            
            $result = $this->customer_model->update($customer_id, $update_data);
            if (is_wp_error($result)) {
                return $result;
            }
            $notification_data = array(
                'user_id' => $user_id,
                'type' => 'assign_customer',
                'title' => "Khách hàng mới",
                'content' => "Khách hàng mới đã được gán vào danh sách của bạn.",
                'created_at' => current_time('mysql')
            );
            $result_notification = $this->notification_model->create($notification_data);
            if (is_wp_error($result)) {
                return $result_notification;
            }
            return $result;
        } catch (Exception $e) {
            return new WP_Error('assign_error', $e->getMessage());
        }
    }

    public function get_customer_history($customer_id) {
        try {
            $query_args = array(
                'orderby' => 'created_at',
                'limit' => 30,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0,
                'where' => array('customer_id' => $customer_id),
            );
            return $this->customer_history_model->get_all($query_args);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_customer_status($customer_id, $status, $note = '') {
        try {
            // Validate status
            $valid_statuses = array('new', 'contacted', 'appointment', 'contracted', 'completed');
            if (!in_array($status, $valid_statuses)) {
                return new WP_Error('get_error', 'Invalid status value');
            }
            // Update customer status
            $update_data = array(
                'status' => $status,
            );
            $result = $this->customer_model->update($customer_id, $update_data);
            if (is_wp_error($result)) {
                return $result;
            }
            // Create customer history
            $history_data = array(
                'customer_id' => $customer_id,
                'action' => 'status_update',
                'note' => $note,
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );
            $history_result = $this->customer_history_model->create($history_data);
            if (is_wp_error($history_result)) {
                return $history_result;
            }
            return $customer_id;
        } catch (Exception $e) {
            return new WP_Error('status_update_error', $e->getMessage());
        }
    }
}

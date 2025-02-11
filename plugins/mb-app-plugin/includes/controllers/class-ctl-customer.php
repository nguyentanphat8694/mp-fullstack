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
            $user_id = get_current_user_id();
            // Prepare customer data
            $customer_data = array(
                'name' => isset($data['name']) ? $data['name'] : null,
                'phone' => isset($data['phone']) ? $data['phone'] : null,
                'source' => isset($data['source']) ? $data['source'] : 'facebook',
                'status' => 'new',
                'assigned_to' => isset($data['assigned_to']) ? intval($data['assigned_to']) : null,
                'created_by' => $user_id,
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
                'action' => 'Tạo khách hàng mới',
                'note' => isset($data['note']) ? $data['note'] : null,
                'created_by' => $user_id,
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
            global $wpdb;

            $query = $wpdb->prepare(
                "SELECT 
                    c.id,
                    c.name,
                    c.phone,
                    c.source,
                    c.status,
                    c.created_at,
                    c.assigned_to,
                    assigned.display_name as assigned_to_name,
                    creator.display_name as created_by_name
                FROM mb_customers c
                LEFT JOIN {$wpdb->users} assigned ON c.assigned_to = assigned.ID 
                JOIN {$wpdb->users} creator ON c.created_by = creator.ID
                WHERE c.id = %d",
                $id
            );

            $customer = $wpdb->get_row($query);
            
            if (!$customer) {
                return new WP_Error('not_found', 'Customer not found');
            }

            return array(
                'id' => (int)$customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'source' => $customer->source,
                'status' => $customer->status,
                'assigned_to' => $customer->assigned_to ? (int)$customer->assigned_to : null,
                'assigned_to_name' => $customer->assigned_to_name,
                'created_by_name' => $customer->created_by_name,
                'created_at' => $customer->created_at
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_customers($args = array()) {
        try {
            global $wpdb;

            // Default arguments
            $defaults = array(
                'search' => '',
                'source' => '',
                'status' => '',
                'assigned_to' => '',
                'created_by' => '',
                'orderby' => 'created_at',
                'order' => 'DESC',
                'limit' => 20,
                'offset' => 0
            );

            // Parse incoming args with defaults
            $args = wp_parse_args($args, $defaults);

            // Build query parts
            $where = array('1=1');
            $values = array();

            // Handle search
            if (!empty($args['search'])) {
                $search_term = '%' . $wpdb->esc_like($args['search']) . '%';
                $where[] = "(c.name LIKE %s OR c.phone LIKE %s)";
                $values[] = $search_term;
                $values[] = $search_term;
            }

            // Handle filters
            if (!empty($args['source'])) {
                $where[] = "c.source = %s";
                $values[] = sanitize_text_field($args['source']);
            }

            if (!empty($args['status'])) {
                $where[] = "c.status = %s";
                $values[] = sanitize_text_field($args['status']);
            }

            if (!empty($args['assigned_to'])) {
                $where[] = "c.assigned_to = %d";
                $values[] = absint($args['assigned_to']);
            }

            if (!empty($args['created_by'])) {
                $where[] = "c.created_by = %d";
                $values[] = absint($args['created_by']);
            }

            // Build WHERE clause
            $where = implode(' AND ', $where);

            // Get total records for pagination
            $count_query = "SELECT COUNT(*) FROM mb_customers c WHERE {$where}";
            $total_items = $wpdb->get_var($wpdb->prepare($count_query, $values));

            // Handle orderby
            $allowed_orderby = array(
                'created_at' => 'c.created_at',
                'name' => 'c.name',
                'status' => 'c.status'
            );
            $orderby = isset($allowed_orderby[$args['orderby']]) ? $allowed_orderby[$args['orderby']] : 'c.created_at';
            
            // Handle order
            $order = strtoupper($args['order']) === 'ASC' ? 'ASC' : 'DESC';

            // Build final query
            $query = $wpdb->prepare(
                "SELECT 
                    c.id,
                    c.name,
                    c.phone,
                    c.source,
                    c.status,
                    c.created_at,
                    c.assigned_to,
                    assigned.display_name as assigned_to_name,
                    creator.display_name as created_by_name
                FROM mb_customers c
                LEFT JOIN {$wpdb->users} assigned ON c.assigned_to = assigned.ID 
                JOIN {$wpdb->users} creator ON c.created_by = creator.ID
                WHERE {$where}
                ORDER BY {$orderby} {$order}
                LIMIT %d OFFSET %d",
                array_merge(
                    $values,
                    array($args['limit'], $args['offset'])
                )
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array(
                'data' => array_map(function($row) {
                    return array(
                        'id' => (int)$row->id,
                        'name' => $row->name,
                        'phone' => $row->phone, 
                        'source' => $row->source,
                        'assigned_to_name' => $row->assigned_to_name,
                        'status' => $row->status,
                        'created_by_name' => $row->created_by_name,
                        'created_at' => $row->created_at
                    );
                }, $results),
                'total_data' => (int)$total_items
            );

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
                // 'status' => isset($data['status']) ? $data['status'] : null,
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
            return $id;
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
            global $wpdb;

            $query = $wpdb->prepare(
                "SELECT 
                    h.*,
                    c.name as customer_name,
                    u.display_name as created_by_name
                FROM mb_customer_history h
                JOIN mb_customers c ON h.customer_id = c.id
                JOIN {$wpdb->users} u ON h.created_by = u.ID
                WHERE h.customer_id = %d
                ORDER BY h.created_at DESC
                LIMIT 50",
                $customer_id
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array_map(function($row) {
                    return array(
                        'id' => (int)$row->id,
                        'customer_name' => $row->customer_name,
                        'action' => $row->action,
                        'note' => $row->note,
                        'created_by_name' => $row->created_by_name,
                        'created_at' => $row->created_at
                    );
                }, $results);

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_customer_status($customer_id, $status, $note, $action_name) {
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
                'action' => $action_name,
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

    public function get_customers_select($args = array()) {
        try {
            global $wpdb;

            $where = array('1=1');
            $values = array();

            // Handle search
            if (!empty($args['search'])) {
                $search_term = '%' . $wpdb->esc_like($args['search']) . '%';
                $where[] = "(c.name LIKE %s OR c.phone LIKE %s)";
                $values[] = $search_term;
                $values[] = $search_term;
            }

            // Build WHERE clause
            $where = implode(' AND ', $where);

            // Build query
            $query = $wpdb->prepare(
                "SELECT 
                    c.id,
                    c.name
                FROM mb_customers c
                WHERE {$where}
                ORDER BY c.created_at DESC
                LIMIT 20",
                $values
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array_map(function($row) {
                return array(
                    'id' => (int)$row->id,
                    'name' => $row->name
                );
            }, $results);

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }
}

<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Transaction_Controller {
    private $transaction_model;

    public function __construct() {
        $this->transaction_model = new MB_Transaction();
    }

    public function create_transaction($data) {
        try {
            $current_user_id = get_current_user_id();

            // Prepare transaction data
            $transaction_data = array(
                'type' => sanitize_text_field($data['type']),
                'amount' => floatval($data['amount']),
                'description' => sanitize_textarea_field($data['description']),
                'created_by' => $current_user_id,
                'created_at' => current_time('mysql')
            );

            return $this->transaction_model->create($transaction_data);

        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_transactions($args = array()) {
        try {
            global $wpdb;

            $query_args = array(
                'where' => array(),
                'where_raw' => array(),
                'limit' => isset($args['limit']) ? absint($args['limit']) : 50,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0
            );

            // Filter by type
            if (!empty($args['type'])) {
                $query_args['where']['t.type'] = sanitize_text_field($args['type']);
            }

            // Filter by month and year
            if (!empty($args['month']) && !empty($args['year'])) {
                $month = absint($args['month']);
                $year = absint($args['year']);
                $query_args['where_raw'][] = $wpdb->prepare(
                    "MONTH(t.created_at) = %d AND YEAR(t.created_at) = %d",
                    $month,
                    $year
                );
            }

            // Build where clause
            $where_conditions = array();
            $where_values = array();

            foreach ($query_args['where'] as $field => $value) {
                $where_conditions[] = "$field = %s";
                $where_values[] = $value;
            }

            if (!empty($query_args['where_raw'])) {
                $where_conditions = array_merge($where_conditions, $query_args['where_raw']);
            }

            $where_clause = !empty($where_conditions) 
                ? "WHERE " . implode(" AND ", $where_conditions)
                : "";

            // Get total records
            $count_query = "SELECT COUNT(*) FROM mb_transactions t {$where_clause}";
            $total_items = $wpdb->get_var($wpdb->prepare($count_query, $where_values));

            // Build final query
            $query = $wpdb->prepare(
                "SELECT 
                    t.*,
                    u.display_name as created_by_name
                FROM mb_transactions t
                JOIN {$wpdb->users} u ON t.created_by = u.ID
                {$where_clause}
                ORDER BY t.created_at DESC
                LIMIT %d OFFSET %d",
                array_merge(
                    $where_values,
                    array($query_args['limit'], $query_args['offset'])
                )
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array(
                'data' => array_map(function($row) {
                    return array(
                        'id' => (int)$row->id,
                        'type' => $row->type,
                        'amount' => (float)$row->amount,
                        'description' => $row->description,
                        'created_by_name' => $row->created_by_name,
                        'created_at' => $row->created_at,
                        'contract_payment_id' => $row->contract_payment_id ? (int)$row->contract_payment_id : null
                    );
                }, $results),
                'total_data' => (int)$total_items
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_transaction($id) {
        try {
            global $wpdb;
            
            $query = $wpdb->prepare(
                "SELECT 
                    t.*,
                    u.display_name as created_by_name
                FROM mb_transactions t
                JOIN {$wpdb->users} u ON t.created_by = u.ID
                WHERE t.id = %d",
                $id
            );

            $transaction = $wpdb->get_row($query);
            
            if (!$transaction) {
                return new WP_Error('not_found', 'Transaction not found');
            }

            return array(
                'id' => (int)$transaction->id,
                'type' => $transaction->type,
                'amount' => (float)$transaction->amount,
                'description' => $transaction->description,
                'created_by_name' => $transaction->created_by_name,
                'created_at' => $transaction->created_at
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_transaction($id, $data) {
        try {
            // Check if transaction exists
            $transaction = $this->get_transaction($id);
            if (is_wp_error($transaction)) {
                return $transaction;
            }

            // Prepare update data
            $update_data = array();
            $allowed_fields = array('type', 'amount', 'description');
            
            foreach ($allowed_fields as $field) {
                if (isset($data[$field])) {
                    switch ($field) {
                        case 'amount':
                            $update_data[$field] = floatval($data[$field]);
                            break;
                        default:
                            $update_data[$field] = sanitize_text_field($data[$field]);
                    }
                }
            }

            if (empty($update_data)) {
                return new WP_Error('update_error', 'No data to update');
            }

            $result = $this->transaction_model->update($id, $update_data);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            return $id;

        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_transaction($id) {
        try {
            // Check if transaction exists
            $transaction = $this->get_transaction($id);
            if (is_wp_error($transaction)) {
                return $transaction;
            }

            return $this->transaction_model->delete($id);

        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }

    public function get_transactions_summary($args) {
        try {
            global $wpdb;

            $month = absint($args['month']);
            $year = absint($args['year']);

            $query = $wpdb->prepare(
                "SELECT 
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
                FROM mb_transactions 
                WHERE MONTH(created_at) = %d AND YEAR(created_at) = %d",
                $month,
                $year
            );

            $result = $wpdb->get_row($query);

            return array(
                'total_income' => (float)($result->total_income == null ? 0 : $result->total_income),
                'total_expense' => (float)($result->total_expense == null ? 0 : $result->total_expense)
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }
} 
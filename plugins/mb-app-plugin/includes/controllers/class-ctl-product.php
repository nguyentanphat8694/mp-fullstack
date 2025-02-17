<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Product_Controller {
    private $product_model;

    public function __construct() {
        $this->product_model = new MB_Product();
    }

    public function create_product($data) {
        try {
            // Prepare product data
            $product_data = array(
                'code' => isset($data['code']) ? sanitize_text_field($data['code']) : null,
                'name' => isset($data['name']) ? sanitize_text_field($data['name']) : null,
                'category' => isset($data['category']) ? sanitize_text_field($data['category']) : null,
                'description' => isset($data['description']) ? sanitize_textarea_field($data['description']) : null,
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );
            $image_file = $data['images'];
//            if (!empty($image_file)) {
//                require_once( ABSPATH . 'wp-admin/includes/file.php' );
//                $upload = wp_handle_upload($image_file, array('test_form' => false));
//                if (isset($upload['file'])) {
//                    $image_path = $upload['file'];
////                    $image_url = $upload['url'];
//                    $product_data['images'] = $image_path;
//                } else {
//                    return new WP_Error('upload_failed', 'Image upload failed', array('status' => 400));
//                }
//            } else {
//                $product_data['images'] = null;
//            }

            return $this->product_model->create($product_data);
        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_product($id) {
        try {
            $result = $this->product_model->get($id);
            if (!$result) {
                return new WP_Error('not_found', 'Product not found');
            }
            return $result;
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_products($args = array()) {
        try {
            global $wpdb;

            // Default arguments
            $defaults = array(
                'search' => '',
                'category' => '',
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
                $where[] = "(p.code LIKE %s OR p.name LIKE %s)";
                $values[] = $search_term;
                $values[] = $search_term;
            }

            // Handle category filter
            if (!empty($args['category'])) {
                $where[] = "p.category = %s";
                $values[] = sanitize_text_field($args['category']);
            }

            // Build WHERE clause
            $where = implode(' AND ', $where);

            // Get total records for pagination
            $count_query = "SELECT COUNT(*) FROM mb_products p WHERE {$where}";
            $total_items = $wpdb->get_var($wpdb->prepare($count_query, $values));

            // Handle orderby
            $allowed_orderby = array(
                'created_at' => 'p.created_at',
                'name' => 'p.name',
                'code' => 'p.code'
            );
            $orderby = isset($allowed_orderby[$args['orderby']]) ? $allowed_orderby[$args['orderby']] : 'p.created_at';
            
            // Handle order
            $order = strtoupper($args['order']) === 'ASC' ? 'ASC' : 'DESC';

            // Build final query
            $query = $wpdb->prepare(
                "SELECT 
                    p.id,
                    p.code,
                    p.name,
                    p.category
                FROM mb_products p
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
                        'code' => $row->code,
                        'name' => $row->name,
                        'category' => $row->category
                    );
                }, $results),
                'total_data' => (int)$total_items
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_product($id, $data) {
        try {
            // Prepare update data
            $update_data = array();
            $allowed_fields = array('code', 'name', 'category', 'description');
            
            foreach ($allowed_fields as $field) {
                if (isset($data[$field])) {
                    $update_data[$field] = $field === 'description' 
                        ? sanitize_textarea_field($data[$field])
                        : sanitize_text_field($data[$field]);
                }
            }

            if (empty($update_data)) {
                return new WP_Error('update_error', 'No valid fields to update');
            }

            $image_file = $data['images'];
            if (!empty($image_file)) {
                $upload = wp_handle_upload($image_file, array('test_form' => false));
                if (isset($upload['file'])) {
                    $image_path = $upload['file'];
                    $update_data['images'] = $image_path;
                } else {
                    return new WP_Error('upload_failed', 'Image upload failed', array('status' => 400));
                }
            }

            $result = $this->product_model->update($id, $update_data);
            if (is_wp_error($result)) {
                return $result;
            }

            return $this->get_product($id);
        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_product($id) {
        try {
            $result = $this->product_model->delete($id);
            if (is_wp_error($result)) {
                return $result;
            }
            return true;
        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }

    public function get_products_select($args = array()) {
        try {
            $query_args = array(
                'orderby' => 'created_at',
                'order' => 'DESC',
                'limit' => 20,
                'offset' => 0,
                'select' => array('id', 'code', 'name'),
                'where' => array(),
                'search' => isset($args['search']) ? sanitize_text_field($args['search']) : '',
                'search_fields' => array('code', 'name')
            );

            return $this->product_model->get_all($query_args);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_product_history($product_id) {
        try {
            global $wpdb;
            
            $query = $wpdb->prepare(
                "SELECT 
                    cp.contract_id,
                    cp.rental_start,
                    cp.rental_end,
                    c.name as customer_name
                FROM mb_contract_products cp
                JOIN mb_contracts ct ON cp.contract_id = ct.id
                JOIN mb_customers c ON ct.customer_id = c.id
                WHERE cp.product_id = %d
                ORDER BY cp.rental_start DESC",
                $product_id
            );

            $results = $wpdb->get_results($query);
            
            if ($wpdb->last_error) {
                throw new Exception($wpdb->last_error);
            }

            return array_map(function($row) {
                return array(
                    'contract_id' => (int)$row->contract_id,
                    'rental_start' => $row->rental_start,
                    'rental_end' => $row->rental_end,
                    'customer_name' => $row->name
                );
            }, $results);

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function check_product_availability($product_id, $args = array()) {
        try {
            global $wpdb;
            
            $where_conditions = array();
            $where_values = array($product_id);
            
            // Build date range conditions
            if (!empty($args['start_date'])) {
                $where_conditions[] = "(cp.rental_start <= %s AND cp.rental_end >= %s)";
                $where_values[] = $args['start_date'];
                $where_values[] = $args['start_date'];
            }
            
            if (!empty($args['end_date'])) {
                $where_conditions[] = "(cp.rental_start <= %s AND cp.rental_end >= %s)";
                $where_values[] = $args['end_date'];
                $where_values[] = $args['end_date'];
            }

            $date_condition = !empty($where_conditions) 
                ? "AND (" . implode(" OR ", $where_conditions) . ")"
                : "";
                
            $query = $wpdb->prepare(
                "SELECT 
                    cp.contract_id,
                    cp.rental_start,
                    cp.rental_end,
                    c.name as customer_name
                FROM mb_contract_products cp
                JOIN mb_contracts ct ON cp.contract_id = ct.id
                JOIN mb_customers c ON ct.customer_id = c.id
                WHERE cp.product_id = %d
                {$date_condition}
                ORDER BY cp.rental_start ASC",
                $where_values
            );

            $results = $wpdb->get_results($query);
            
            if ($wpdb->last_error) {
                throw new Exception($wpdb->last_error);
            }

            return array_map(function($row) {
                return array(
                    'contract_id' => (int)$row->contract_id,
                    'rental_start' => $row->rental_start,
                    'rental_end' => $row->rental_end,
                    'customer_name' => $row->name
                );
            }, $results);

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }
} 
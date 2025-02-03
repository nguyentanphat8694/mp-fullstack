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
                'images' => isset($data['images']) ? sanitize_text_field($data['images']) : null,
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

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
            $query_args = array(
                'orderby' => 'code',
                'order' => 'DESC',
                'limit' => 20,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0,
                'where' => array(),
                'search' => isset($args['search']) ? sanitize_text_field($args['search']) : '',
                'search_fields' => array('code', 'name')
            );

            // Add filters to where clause
            $allowed_filters = array('category');
            foreach ($allowed_filters as $filter) {
                if (isset($args[$filter])) {
                    $query_args['where'][$filter] = sanitize_text_field($args[$filter]);
                }
            }

            return $this->product_model->get_all($query_args);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_product($id, $data) {
        try {
            // Prepare update data
            $update_data = array();
            $allowed_fields = array('code', 'name', 'category', 'description', 'images');
            
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
} 
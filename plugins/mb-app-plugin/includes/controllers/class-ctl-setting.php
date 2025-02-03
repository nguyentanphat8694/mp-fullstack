<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Setting_Controller {
    private $setting_model;

    public function __construct() {
        $this->setting_model = new MB_Setting();
    }

    public function create_setting($data) {
        try {
            // Validate required fields
            if (empty($data['setting_name']) || !isset($data['setting_value'])) {
                return new WP_Error('missing_required_fields', 'Missing required fields');
            }

            // Prepare setting data
            $setting_data = array(
                'setting_name' => sanitize_text_field($data['setting_name']),
                'setting_value' => sanitize_text_field($data['setting_value']),
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            return $this->setting_model->create($setting_data);
        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_setting($id) {
        try {
            $result = $this->setting_model->get($id);
            if (!$result) {
                return new WP_Error('not_found', 'Setting not found');
            }
            return $result;
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_settings($args = array()) {
        try {
            $query_args = array(
                'orderby' => 'id',
                'order' => 'DESC',
                'limit' => 20,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0,
                'where' => array(),
                'search' => isset($args['search']) ? sanitize_text_field($args['search']) : '',
                'search_fields' => array('setting_name', 'setting_value')
            );

            return $this->setting_model->get_all($query_args);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_setting($id, $data) {
        try {
            // Check if setting exists
            $setting = $this->get_setting($id);
            if (is_wp_error($setting)) {
                return $setting;
            }

            // Prepare update data
            $update_data = array();
            if (isset($data['setting_name'])) {
                $update_data['setting_name'] = sanitize_text_field($data['setting_name']);
            }
            if (isset($data['setting_value'])) {
                $update_data['setting_value'] = sanitize_text_field($data['setting_value']);
            }

            if (empty($update_data)) {
                return new WP_Error('update_error', 'No valid fields to update');
            }

            return $this->setting_model->update($id, $update_data);
        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_setting($id) {
        try {
            $result = $this->setting_model->delete($id);
            if (is_wp_error($result)) {
                return $result;
            }
            return true;
        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }
} 
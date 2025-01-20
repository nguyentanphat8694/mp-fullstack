<?php

/**
 * Product Maintenance Management API endpoints
 */
class MB_Maintenance_API extends MB_API {
    private $product_controller;

    public function __construct() {
        parent::__construct();
        $this->product_controller = new MB_Product_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Create maintenance request
        register_rest_route(
            $this->namespace,
            '/products/maintenance-request',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_maintenance_request'),
                'permission_callback' => array($this, 'check_create_maintenance_request_permission'),
            )
        );
    }

    /**
     * Create maintenance request
     */
    public function create_maintenance_request($request) {
        try {
            $data = $this->validate_maintenance_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            // Sử dụng update_status từ product controller để chuyển trạng thái sản phẩm sang maintenance
            $result = $this->product_controller->update_status(
                $data['product_id'],
                'maintenance',
                $data['description']
            );

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_create_maintenance_request_permission() {
        return current_user_can('mb_update_product_status');
    }

    /**
     * Validate maintenance request data
     */
    private function validate_maintenance_data($data) {
        $required_fields = array('product_id', 'description');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        return $this->sanitize_input($data, array(
            'product_id' => 'int',
            'description' => 'text'
        ));
    }
} 
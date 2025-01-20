<?php

/**
 * Product Inspection Management API endpoints
 */
class MB_Inspection_API extends MB_API {
    private $inspection_controller;

    public function __construct() {
        parent::__construct();
        $this->inspection_controller = new MB_Inspection_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Create/Get inspections
        register_rest_route(
            $this->namespace,
            '/inspections',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_inspections'),
                    'permission_callback' => array($this, 'check_view_inspections_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_inspection'),
                    'permission_callback' => array($this, 'check_create_inspection_permission'),
                )
            )
        );

        // Get/Update specific inspection
        register_rest_route(
            $this->namespace,
            '/inspections/(?P<id>\d+)',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_inspection'),
                    'permission_callback' => array($this, 'check_view_inspections_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => array($this, 'update_inspection'),
                    'permission_callback' => array($this, 'check_update_inspection_permission'),
                )
            )
        );

        // Check inspection
        register_rest_route(
            $this->namespace,
            '/inspections/(?P<id>\d+)/check',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'check_inspection'),
                'permission_callback' => array($this, 'check_update_inspection_permission'),
            )
        );

        // Approve inspection
        register_rest_route(
            $this->namespace,
            '/inspections/(?P<id>\d+)/approve',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'approve_inspection'),
                'permission_callback' => array($this, 'check_approve_inspection_permission'),
            )
        );

        // Get inspection history
        register_rest_route(
            $this->namespace,
            '/inspections/(?P<id>\d+)/history',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_inspection_history'),
                'permission_callback' => array($this, 'check_view_inspections_permission'),
            )
        );

        // Upload inspection images
        register_rest_route(
            $this->namespace,
            '/inspections/(?P<id>\d+)/images',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'upload_images'),
                'permission_callback' => array($this, 'check_update_inspection_permission'),
            )
        );
    }

    /**
     * Get inspections list
     */
    public function get_inspections($request) {
        try {
            $status = $request->get_param('status');
            
            // Note: Controller chưa có method get_pending_inspections
            // Cần bổ sung vào controller theo function-controllers.md
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create inspection
     */
    public function create_inspection($request) {
        try {
            $data = $this->validate_inspection_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->inspection_controller->create_inspection($data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get specific inspection
     */
    public function get_inspection($request) {
        try {
            $inspection_id = absint($request['id']);
            
            // Note: Controller chưa có method get_inspection
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update inspection
     */
    public function update_inspection($request) {
        try {
            $inspection_id = absint($request['id']);
            $data = $this->validate_inspection_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->inspection_controller->update_status($inspection_id, $data['status'], $data['note']);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Check inspection
     */
    public function check_inspection($request) {
        try {
            $inspection_id = absint($request['id']);
            $data = $this->validate_inspection_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->inspection_controller->check_inspection($inspection_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Approve inspection
     */
    public function approve_inspection($request) {
        try {
            $inspection_id = absint($request['id']);
            $data = $this->validate_inspection_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->inspection_controller->approve_inspection($inspection_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get inspection history
     */
    public function get_inspection_history($request) {
        try {
            $inspection_id = absint($request['id']);
            
            $result = $this->inspection_controller->get_inspection_history($inspection_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Upload inspection images
     */
    public function upload_images($request) {
        try {
            $inspection_id = absint($request['id']);
            $files = $request->get_file_params();
            
            // Note: Controller chưa có method upload_images
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_inspections_permission() {
        return current_user_can('mb_view_products');
    }

    private function check_create_inspection_permission() {
        return current_user_can('mb_create_inspections');
    }

    private function check_update_inspection_permission() {
        return current_user_can('mb_create_inspections');
    }

    private function check_approve_inspection_permission() {
        return current_user_can('mb_approve_inspections');
    }

    /**
     * Validate inspection data
     */
    private function validate_inspection_data($data, $is_update = false) {
        if (!$is_update) {
            // Validate required fields for new inspection
            $required_fields = array('product_id', 'description');
            $validation = $this->validator->validate_required($data, $required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        // Validate status if provided
        if (isset($data['status'])) {
            $valid_statuses = array('pending', 'checked', 'approved');
            if (!in_array($data['status'], $valid_statuses)) {
                return new WP_Error('invalid_status', 'Invalid inspection status');
            }
        }

        return $this->sanitize_input($data, array(
            'product_id' => 'int',
            'description' => 'text',
            'status' => 'string',
            'note' => 'text'
        ));
    }
} 
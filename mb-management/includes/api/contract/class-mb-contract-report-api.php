<?php

/**
 * Contract Report Management API endpoints
 */
class MB_Contract_Report_API extends MB_API {
    private $contract_controller;

    public function __construct() {
        parent::__construct();
        $this->contract_controller = new MB_Contract_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Create inspection report
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/reports',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_report'),
                'permission_callback' => array($this, 'check_create_report_permission'),
            )
        );

        // Get inspection report
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/reports',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_report'),
                'permission_callback' => array($this, 'check_view_report_permission'),
            )
        );
    }

    /**
     * Create inspection report
     */
    public function create_report($request) {
        try {
            $contract_id = absint($request['id']);
            $data = $this->validate_report_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->create_inspection_report($contract_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get inspection report
     */
    public function get_report($request) {
        try {
            $contract_id = absint($request['id']);
            
            // Note: Controller chưa có method get_inspection_report
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_create_report_permission() {
        return current_user_can('mb_create_inspection_reports');
    }

    private function check_view_report_permission() {
        return current_user_can('mb_view_inspection_reports');
    }

    /**
     * Validate report data
     */
    private function validate_report_data($data) {
        $required_fields = array('items', 'status');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Validate status
        $valid_statuses = array('good', 'damaged', 'lost');
        if (!in_array($data['status'], $valid_statuses)) {
            return new WP_Error('invalid_status', 'Invalid report status');
        }

        return $this->sanitize_input($data, array(
            'items' => 'array',
            'status' => 'string',
            'description' => 'text',
            'images' => 'array'
        ));
    }
} 
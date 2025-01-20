<?php

/**
 * Purchase Request Management API endpoints
 */
class MB_Purchase_API extends MB_API {
    private $finance_controller;

    public function __construct() {
        parent::__construct();
        $this->finance_controller = new MB_Finance_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Create purchase requests
        register_rest_route(
            $this->namespace,
            '/finances/purchase-requests',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_purchase_requests'),
                    'permission_callback' => array($this, 'check_view_purchase_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_purchase_request'),
                    'permission_callback' => array($this, 'check_create_purchase_permission'),
                )
            )
        );

        // Get purchase request summary
        register_rest_route(
            $this->namespace,
            '/finances/purchase-requests/summary',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_purchase_summary'),
                'permission_callback' => array($this, 'check_view_purchase_permission'),
            )
        );

        // Approve/Reject purchase request
        register_rest_route(
            $this->namespace,
            '/finances/purchase-requests/(?P<id>\d+)/(?P<action>approve|reject)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'process_purchase_request'),
                'permission_callback' => array($this, 'check_approve_purchase_permission'),
            )
        );
    }

    /**
     * Get purchase requests
     */
    public function get_purchase_requests($request) {
        try {
            $status = $request->get_param('status');
            $result = $this->finance_controller->get_purchase_requests($status);
            
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get purchase request summary
     * Note: Requires implementation of get_purchase_request_summary() in Finance Controller
     */
    public function get_purchase_summary($request) {
        try {
            // Note: Controller chưa có method get_purchase_request_summary
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create purchase request
     */
    public function create_purchase_request($request) {
        try {
            $data = $this->validate_purchase_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->finance_controller->create_purchase_request($data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Process (approve/reject) purchase request
     */
    public function process_purchase_request($request) {
        try {
            $purchase_id = absint($request['id']);
            $action = $request['action'];
            $note = $request->get_param('note');

            $result = $this->finance_controller->approve_purchase_request(
                $purchase_id,
                $action === 'approve' ? 'approved' : 'rejected',
                $note
            );

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_purchase_permission() {
        return current_user_can('mb_view_purchases');
    }

    private function check_create_purchase_permission() {
        return current_user_can('mb_create_purchases');
    }

    private function check_approve_purchase_permission() {
        return current_user_can('mb_approve_purchases');
    }

    /**
     * Validate purchase request data
     */
    private function validate_purchase_data($data) {
        $required_fields = array('title', 'description', 'amount', 'reason');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        if (!is_numeric($data['amount']) || $data['amount'] <= 0) {
            return new WP_Error('invalid_amount', 'Amount must be a positive number');
        }

        return $this->sanitize_input($data, array(
            'title' => 'text',
            'description' => 'text',
            'amount' => 'decimal',
            'reason' => 'text',
            'priority' => 'text'
        ));
    }
} 
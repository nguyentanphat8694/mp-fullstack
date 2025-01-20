<?php

/**
 * Financial Management API endpoints
 */
class MB_Finance_API extends MB_API {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Income management
        register_rest_route(
            $this->namespace,
            '/finances/income',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_income'),
                    'permission_callback' => array($this, 'check_view_finance_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_income'),
                    'permission_callback' => array($this, 'check_edit_finance_permission'),
                )
            )
        );

        // Expense management
        register_rest_route(
            $this->namespace,
            '/finances/expense',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_expense'),
                    'permission_callback' => array($this, 'check_view_finance_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_expense'),
                    'permission_callback' => array($this, 'check_edit_finance_permission'),
                )
            )
        );

        // Financial reports
        register_rest_route(
            $this->namespace,
            '/finances/reports',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_reports'),
                'permission_callback' => array($this, 'check_view_finance_permission'),
            )
        );

        // Purchase requests
        register_rest_route(
            $this->namespace,
            '/finances/purchase-requests',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_purchase_requests'),
                    'permission_callback' => array($this, 'check_view_finance_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_purchase_request'),
                    'permission_callback' => array($this, 'check_edit_finance_permission'),
                )
            )
        );

        // Approve purchase request
        register_rest_route(
            $this->namespace,
            '/finances/purchase-requests/(?P<id>\d+)/approve',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'approve_purchase_request'),
                'permission_callback' => array($this, 'check_approve_finance_permission'),
            )
        );
    }

    // Implementation of endpoint methods...
    public function get_income($request) {
        try {
            // Note: Controller chưa có method get_transaction_by_type
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    // ... Similar implementations for other endpoints ...

    /**
     * Permission checks
     */
    private function check_view_finance_permission() {
        return current_user_can('mb_view_finances');
    }

    private function check_edit_finance_permission() {
        return current_user_can('mb_edit_finances');
    }

    private function check_approve_finance_permission() {
        return current_user_can('mb_approve_finances');
    }

    /**
     * Validate finance data
     */
    private function validate_finance_data($data) {
        $required_fields = array('amount', 'description', 'type');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        if (!is_numeric($data['amount']) || $data['amount'] <= 0) {
            return new WP_Error('invalid_amount', 'Amount must be a positive number');
        }

        return $this->sanitize_input($data, array(
            'amount' => 'decimal',
            'description' => 'text',
            'type' => 'text',
            'reference' => 'text',
            'date' => 'date'
        ));
    }
} 
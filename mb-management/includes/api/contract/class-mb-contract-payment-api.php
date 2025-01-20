<?php

/**
 * Contract Payment Management API endpoints
 */
class MB_Contract_Payment_API extends MB_API {
    private $contract_controller;
    private $finance_controller;

    public function __construct() {
        parent::__construct();
        $this->contract_controller = new MB_Contract_Controller();
        $this->finance_controller = new MB_Finance_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Add/Get payments
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/payments',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_payments'),
                    'permission_callback' => array($this, 'check_view_payments_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'add_payment'),
                    'permission_callback' => array($this, 'check_add_payment_permission'),
                )
            )
        );

        // Get overdue contracts
        register_rest_route(
            $this->namespace,
            '/contracts/overdue',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_overdue_contracts'),
                'permission_callback' => array($this, 'check_view_payments_permission'),
            )
        );
    }

    /**
     * Get contract payments
     */
    public function get_payments($request) {
        try {
            $contract_id = absint($request['id']);
            
            $result = $this->contract_controller->get_contract_payments($contract_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Add payment
     */
    public function add_payment($request) {
        try {
            $contract_id = absint($request['id']);
            $data = $this->validate_payment_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->update_payment($contract_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            // Create income transaction
            $income_data = array(
                'amount' => $data['amount'],
                'type' => 'contract_payment',
                'reference_id' => $contract_id,
                'note' => isset($data['note']) ? $data['note'] : ''
            );
            $this->finance_controller->create_income($income_data);

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get overdue contracts
     */
    public function get_overdue_contracts($request) {
        try {
            $result = $this->finance_controller->get_overdue_contracts();
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
    private function check_view_payments_permission() {
        return current_user_can('mb_view_contract_payments');
    }

    private function check_add_payment_permission() {
        return current_user_can('mb_add_contract_payments');
    }

    /**
     * Validate payment data
     */
    private function validate_payment_data($data) {
        $required_fields = array('amount', 'payment_method');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        if (!$this->validator->validate_decimal($data['amount'], 0)) {
            return new WP_Error('invalid_amount', 'Amount must be a positive number');
        }

        return $this->sanitize_input($data, array(
            'amount' => 'decimal',
            'payment_method' => 'string',
            'note' => 'text'
        ));
    }
} 
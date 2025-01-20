<?php

/**
 * Contract Management API endpoints
 */
class MB_Contract_API extends MB_API {
    private $contract_controller;

    public function __construct() {
        parent::__construct();
        $this->contract_controller = new MB_Contract_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Create contracts
        register_rest_route(
            $this->namespace,
            '/contracts',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_contracts'),
                    'permission_callback' => array($this, 'check_view_contracts_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_contract'),
                    'permission_callback' => array($this, 'check_create_contract_permission'),
                )
            )
        );

        // Get/Update specific contract
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_contract'),
                    'permission_callback' => array($this, 'check_view_contracts_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => array($this, 'update_contract'),
                    'permission_callback' => array($this, 'check_update_contract_permission'),
                )
            )
        );

        // Add payment
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/payments',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'add_payment'),
                'permission_callback' => array($this, 'check_update_contract_permission'),
            )
        );

        // Get contract items
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/items',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_contract_items'),
                'permission_callback' => array($this, 'check_view_contracts_permission'),
            )
        );

        // Get contract payments
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/payments',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_contract_payments'),
                'permission_callback' => array($this, 'check_view_contracts_permission'),
            )
        );

        // Get contracts by type
        register_rest_route(
            $this->namespace,
            '/contracts/by-type',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_contracts_by_type'),
                'permission_callback' => array($this, 'check_view_contracts_permission'),
            )
        );

        // Get overdue contracts
        register_rest_route(
            $this->namespace,
            '/contracts/overdue',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_overdue_contracts'),
                'permission_callback' => array($this, 'check_view_contracts_permission'),
            )
        );

        // Get photographer schedule
        register_rest_route(
            $this->namespace,
            '/photographers/(?P<id>\d+)/schedule',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_photographer_schedule'),
                'permission_callback' => array($this, 'check_view_contracts_permission'),
            )
        );
    }

    /**
     * Create contract
     */
    public function create_contract($request) {
        try {
            $data = $this->validate_contract_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->create_contract($data['contract'], $data['items']);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update contract
     */
    public function update_contract($request) {
        try {
            $contract_id = absint($request['id']);
            $data = $this->validate_contract_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->update_contract_status($contract_id, $data['status']);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
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

            return $this->success_response(null, $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get contract items
     */
    public function get_contract_items($request) {
        try {
            $contract_id = absint($request['id']);
            
            $result = $this->contract_controller->get_contract_items($contract_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get contract payments
     */
    public function get_contract_payments($request) {
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
     * Get contracts by type
     */
    public function get_contracts_by_type($request) {
        try {
            $type = $request->get_param('type');
            if (empty($type)) {
                return $this->error_response('Contract type is required');
            }

            // Note: Controller chưa có method get_contract_by_type
            // Cần bổ sung vào controller theo function-controllers.md
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get photographer schedule
     */
    public function get_photographer_schedule($request) {
        try {
            $photographer_id = absint($request['id']);
            $date = $request->get_param('date');

            // Note: Controller chưa có method get_photographer_schedule
            // Cần bổ sung vào controller theo function-controllers.md
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_contracts_permission() {
        return current_user_can('mb_view_contracts');
    }

    private function check_create_contract_permission() {
        return current_user_can('mb_create_contracts');
    }

    private function check_update_contract_permission() {
        return current_user_can('mb_update_contracts');
    }

    /**
     * Validate contract data
     */
    private function validate_contract_data($data, $is_update = false) {
        if (!$is_update) {
            // Validate required fields for new contract
            $required_fields = array('customer_id', 'type', 'items');
            $validation = $this->validator->validate_required($data, $required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        // Validate contract type
        if (isset($data['type'])) {
            $valid_types = array('wedding_dress', 'wedding_photo', 'pre_wedding_photo');
            if (!in_array($data['type'], $valid_types)) {
                return new WP_Error('invalid_type', 'Invalid contract type');
            }
        }

        return $this->sanitize_input($data, array(
            'customer_id' => 'int',
            'type' => 'string',
            'items' => 'array',
            'status' => 'string',
            'note' => 'text'
        ));
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
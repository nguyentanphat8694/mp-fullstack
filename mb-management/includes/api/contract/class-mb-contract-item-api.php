<?php

/**
 * Contract Items Management API endpoints
 */
class MB_Contract_Item_API extends MB_API {
    private $contract_controller;

    public function __construct() {
        parent::__construct();
        $this->contract_controller = new MB_Contract_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get contract items
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/items',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_items'),
                    'permission_callback' => array($this, 'check_view_contract_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'add_item'),
                    'permission_callback' => array($this, 'check_edit_contract_permission'),
                )
            )
        );

        // Delete contract item
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<contract_id>\d+)/items/(?P<item_id>\d+)',
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'remove_item'),
                'permission_callback' => array($this, 'check_edit_contract_permission'),
            )
        );
    }

    /**
     * Get contract items
     */
    public function get_items($request) {
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
     * Add item to contract
     */
    public function add_item($request) {
        try {
            $contract_id = absint($request['id']);
            $data = $this->validate_item_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->add_contract_item($contract_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Remove item from contract
     */
    public function remove_item($request) {
        try {
            $item_id = absint($request['item_id']);
            
            $result = $this->contract_controller->remove_contract_item($item_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_contract_permission() {
        return current_user_can('mb_view_contracts');
    }

    private function check_edit_contract_permission() {
        return current_user_can('mb_edit_contracts');
    }

    /**
     * Validate item data
     */
    private function validate_item_data($data) {
        $required_fields = array('product_id', 'rental_period');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Validate rental period
        if (!empty($data['rental_period'])) {
            if (empty($data['rental_period']['start']) || empty($data['rental_period']['end'])) {
                return new WP_Error('invalid_rental_period', 'Rental period must include start and end dates');
            }

            if (!strtotime($data['rental_period']['start']) || !strtotime($data['rental_period']['end'])) {
                return new WP_Error('invalid_date_format', 'Invalid date format in rental period');
            }

            if (strtotime($data['rental_period']['end']) <= strtotime($data['rental_period']['start'])) {
                return new WP_Error('invalid_date_range', 'End date must be after start date');
            }
        }

        return $this->sanitize_input($data, array(
            'product_id' => 'int',
            'rental_period' => 'array',
            'quantity' => 'int',
            'note' => 'text'
        ));
    }
} 
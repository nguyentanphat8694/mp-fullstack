<?php

/**
 * Customer Management API endpoints
 */
class MB_Customer_API extends MB_API {
    private $customer_controller;

    public function __construct() {
        parent::__construct();
        $this->customer_controller = new MB_Customer_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Create customers
        register_rest_route(
            $this->namespace,
            '/customers',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_customers'),
                    'permission_callback' => array($this, 'check_view_customers_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_customer'),
                    'permission_callback' => array($this, 'check_create_customer_permission'),
                )
            )
        );

        // Get customers by source
        register_rest_route(
            $this->namespace,
            '/customers/by-source',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_customers_by_source'),
                'permission_callback' => array($this, 'check_view_customers_permission'),
            )
        );

        // Update specific customer
        register_rest_route(
            $this->namespace,
            '/customers/(?P<id>\d+)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_customer'),
                'permission_callback' => array($this, 'check_update_customer_permission'),
            )
        );

        // Assign customer
        register_rest_route(
            $this->namespace,
            '/customers/(?P<id>\d+)/assign',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'assign_customer'),
                'permission_callback' => array($this, 'check_assign_customer_permission'),
            )
        );
    }

    /**
     * Get customers
     */
    public function get_customers($request) {
        try {
            $filters = $request->get_params();
            $customers = $this->customer_controller->get_customers($filters);
            
            if (!$customers['success']) {
                return $this->error_response($customers['message']);
            }

            return $this->success_response($customers['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create customer
     */
    public function create_customer($request) {
        try {
            $data = $this->validate_customer_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }
            $data['created_by'] = get_current_user_id();
            $result = $this->customer_controller->create_customer($data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get customers by source
     */
    public function get_customers_by_source($request) {
        try {
            $source = $request->get_param('source');
            if (empty($source)) {
                return $this->error_response('Source parameter is required');
            }

            $customers = $this->customer_controller->get_customers(['source' => $source]);
            if (!$customers['success']) {
                return $this->error_response($customers['message']);
            }

            return $this->success_response($customers['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update customer
     */
    public function update_customer($request) {
        try {
            $customer_id = absint($request['id']);
            $data = $this->validate_customer_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->customer_controller->update_customer_status(
                $customer_id,
                $data['status'],
                isset($data['note']) ? $data['note'] : ''
            );

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Assign customer to user
     */
    public function assign_customer($request) {
        try {
            $customer_id = absint($request['id']);
            $user_id = absint($request->get_param('user_id'));
            
            if (empty($user_id)) {
                return $this->error_response('User ID is required');
            }

            $result = $this->customer_controller->assign_customer($customer_id, $user_id);
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
    private function check_view_customers_permission() {
        return current_user_can('mb_view_customers') || 
               current_user_can('mb_view_assigned_customers');
    }

    private function check_create_customer_permission() {
        return current_user_can('mb_create_customers');
    }

    private function check_update_customer_permission() {
        return current_user_can('mb_manage_customers');
    }

    private function check_assign_customer_permission() {
        return current_user_can('mb_assign_customers');
    }

    /**
     * Validate customer data
     */
    private function validate_customer_data($data, $is_update = false) {
        $required_fields = array('name', 'phone', 'source');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Validate source
        $valid_sources = array('facebook', 'tiktok', 'youtube', 'walk_in');
        if (!in_array($data['source'], $valid_sources)) {
            return new WP_Error('invalid_source', 'Invalid customer source');
        }

        return $this->sanitize_input($data, array(
            'name' => 'string',
            'phone' => 'string',
            'source' => 'string',
            'status' => 'string'
        ));
    }
} 
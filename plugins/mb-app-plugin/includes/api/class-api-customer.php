<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Customer_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Customer_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/customer', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_customer'),
                'permission_callback' => array($this, 'create_customer_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/customers', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'get_customers'),
                'permission_callback' => array($this, 'get_customers_permissions_check'),
            )
        ));


        register_rest_route($this->namespace, '/customer/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_customer'),
                'permission_callback' => array($this, 'get_customer_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_customer'),
                'permission_callback' => array($this, 'update_customer_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_customer'),
                'permission_callback' => array($this, 'delete_customer_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/customer/assign', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'assign_customer'),
                'permission_callback' => array($this, 'assign_customer_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/customer/history/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_customer_history'),
                'permission_callback' => array($this, 'get_customer_history_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/customer/status', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'update_customer_status'),
                'permission_callback' => array($this, 'update_customer_status_permissions_check'),
            )
        ));
    }

    public function create_customer($request) {
        $params = $request->get_params();
        
        // Create customer through controller
        $result = $this->controller->create_customer($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Customer created successfully');
    }

    public function get_customers($request) {
        $params = $request->get_params();
        $result = $this->controller->get_customers($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Customers retrieved successfully');
    }

    public function get_customer($request) {
        $id = $request['id'];
        $result = $this->controller->get_customer($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Customer retrieved successfully');
    }

    public function update_customer($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        $result = $this->controller->update_customer($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Customer updated successfully');
    }

    public function delete_customer($request) {
        $id = $request['id'];
        $result = $this->controller->delete_customer($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Customer deleted successfully');
    }

    public function assign_customer($request) {
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['customer_id']) || !isset($params['user_id'])) {
            return $this->error_response(
                'Missing required parameters: customer_id and user_id',
                $this->http_bad_request,
                'missing_params'
            );
        }

        $customer_id = absint($params['customer_id']);
        $user_id = absint($params['user_id']);
        
        $result = $this->controller->assign_customer($customer_id, $user_id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Customer assigned successfully');
    }

    public function get_customer_history($request) {
        $customer_id = absint($request['id']);
        $result = $this->controller->get_customer_history($customer_id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Customer history retrieved successfully');
    }

    public function update_customer_status($request) {
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['customer_id']) || !isset($params['status'])) {
            return $this->error_response(
                'Missing required parameters: customer_id and status',
                $this->http_bad_request,
                'missing_params'
            );
        }

        $customer_id = absint($params['customer_id']);
        $status = sanitize_text_field($params['status']);
        $note = isset($params['note']) ? sanitize_text_field($params['note']) : '';
        
        $result = $this->controller->update_customer_status($customer_id, $status, $note);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Customer status updated successfully');
    }

    public function create_customer_permissions_check($request) {
//        $required_capability = 'mb_create_customers';
//        return $this->check_capability($required_capability);
        return true;
    }

    public function get_customers_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_customer_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_customer_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function delete_customer_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function assign_customer_permissions_check($request) {
        return true; // Implement proper permission check for mb_assign_customers capability
    }

    public function get_customer_history_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_customer_status_permissions_check($request) {
        return true; // Implement proper permission check
    }
}

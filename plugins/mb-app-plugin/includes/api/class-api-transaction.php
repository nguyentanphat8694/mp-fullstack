<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Transaction_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Transaction_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/finance', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_transaction'),
                'permission_callback' => array($this, 'create_transaction_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_transactions'),
                'permission_callback' => array($this, 'get_transactions_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/finance/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_transaction'),
                'permission_callback' => array($this, 'get_transaction_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_transaction'),
                'permission_callback' => array($this, 'update_transaction_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_transaction'),
                'permission_callback' => array($this, 'delete_transaction_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/finance/summary', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_transactions_summary'),
                'permission_callback' => array($this, 'get_transactions_summary_permissions_check'),
            )
        ));
    }

    public function create_transaction($request) {
        $params = $request->get_params();
        
        // Validate required parameters
        $required_fields = array('type', 'amount', 'description');
        foreach ($required_fields as $field) {
            if (!isset($params[$field])) {
                return $this->error_response(
                    sprintf('Missing required parameter: %s', $field),
                    $this->http_bad_request,
                    'missing_params'
                );
            }
        }

        // Validate transaction type
        $allowed_types = array('income', 'expense');
        if (!in_array($params['type'], $allowed_types)) {
            return $this->error_response(
                'Invalid transaction type. Allowed values: ' . implode(', ', $allowed_types),
                $this->http_bad_request,
                'invalid_type'
            );
        }

        // Check if user has permission to create transactions
        $current_user = wp_get_current_user();
        $user_roles = $current_user->roles;
        
        if (!array_intersect(['administrator', 'accountant'], $user_roles)) {
            return $this->error_response(
                'You do not have permission to create transactions',
                $this->http_forbidden,
                'permission_denied'
            );
        }

        $result = $this->controller->create_transaction($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Transaction created successfully');
    }

    public function get_transactions($request) {
        $params = $request->get_params();
        $result = $this->controller->get_transactions($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Transactions retrieved successfully');
    }

    public function get_transaction($request) {
        $id = $request['id'];
        $result = $this->controller->get_transaction($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Transaction retrieved successfully');
    }

    public function update_transaction($request) {
        $id = $request['id'];
        $params = $request->get_params();

        // Validate transaction type if provided
        if (isset($params['type'])) {
            $allowed_types = array('income', 'expense');
            if (!in_array($params['type'], $allowed_types)) {
                return $this->error_response(
                    'Invalid transaction type. Allowed values: ' . implode(', ', $allowed_types),
                    $this->http_bad_request,
                    'invalid_type'
                );
            }
        }

        // Check if user has permission to update transactions
        $current_user = wp_get_current_user();
        $user_roles = $current_user->roles;
        
        if (!array_intersect(['administrator', 'accountant'], $user_roles)) {
            return $this->error_response(
                'You do not have permission to update transactions',
                $this->http_forbidden,
                'permission_denied'
            );
        }
        
        $result = $this->controller->update_transaction($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Transaction updated successfully');
    }

    public function delete_transaction($request) {
        $id = $request['id'];

        // Check if user has permission to delete transactions
        $current_user = wp_get_current_user();
        $user_roles = $current_user->roles;
        
        if (!array_intersect(['administrator'], $user_roles)) {
            return $this->error_response(
                'You do not have permission to delete transactions',
                $this->http_forbidden,
                'permission_denied'
            );
        }

        $result = $this->controller->delete_transaction($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Transaction deleted successfully');
    }

    public function get_transactions_summary($request) {
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['month']) || !isset($params['year'])) {
            return $this->error_response(
                'Missing required parameters: month and year',
                $this->http_bad_request,
                'missing_params'
            );
        }

        $result = $this->controller->get_transactions_summary($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Transaction summary retrieved successfully');
    }

    // Permission checks
    public function create_transaction_permissions_check($request) {
        return true; // Basic permission check, detailed check in handler
    }

    public function get_transactions_permissions_check($request) {
        return true;
    }

    public function get_transaction_permissions_check($request) {
        return true;
    }

    public function update_transaction_permissions_check($request) {
        return true; // Basic permission check, detailed check in handler
    }

    public function delete_transaction_permissions_check($request) {
        return true; // Basic permission check, detailed check in handler
    }

    public function get_transactions_summary_permissions_check($request) {
        return true;
    }
} 
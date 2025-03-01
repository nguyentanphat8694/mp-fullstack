<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Product_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Product_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/product', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_product'),
                'permission_callback' => array($this, 'create_product_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_products'),
                'permission_callback' => array($this, 'get_products_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/product/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_product'),
                'permission_callback' => array($this, 'get_product_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_product'),
                'permission_callback' => array($this, 'update_product_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_product'),
                'permission_callback' => array($this, 'delete_product_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/product/select', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_products_select'),
                'permission_callback' => array($this, 'get_products_select_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/product/(?P<id>\d+)/history', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_product_history'),
                'permission_callback' => array($this, 'get_product_history_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/product/(?P<id>\d+)/check', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'check_product_availability'),
                'permission_callback' => array($this, 'check_product_availability_permissions_check'),
            )
        ));
    }

    public function create_product($request) {
        $params = $request->get_params();
        
        // Validate required parameters
        $required_fields = array('code', 'category');
        foreach ($required_fields as $field) {
            if (!isset($params[$field])) {
                return $this->error_response(
                    sprintf('Missing required parameter: %s', $field),
                    $this->http_bad_request,
                    'missing_params'
                );
            }
        }

        $result = $this->controller->create_product($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Product created successfully');
    }

    public function get_products($request) {
        $params = $request->get_params();
        $result = $this->controller->get_products($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Products retrieved successfully');
    }

    public function get_product($request) {
        $id = $request['id'];
        $result = $this->controller->get_product($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Product retrieved successfully');
    }

    public function update_product($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        $result = $this->controller->update_product($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Product updated successfully');
    }

    public function delete_product($request) {
        $id = $request['id'];
        $result = $this->controller->delete_product($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Product deleted successfully');
    }

    public function create_product_permissions_check($request) {
        return true; // Implement proper permission check for mb_create_products
    }

    public function get_products_permissions_check($request) {
        return true; // Implement proper permission check for mb_read_products
    }

    public function get_product_permissions_check($request) {
        return true; // Implement proper permission check for mb_read_products
    }

    public function update_product_permissions_check($request) {
        return true; // Implement proper permission check for mb_update_products
    }

    public function delete_product_permissions_check($request) {
        return true; // Implement proper permission check for mb_delete_products
    }

    public function get_products_select($request) {
        $params = $request->get_params();
        $result = $this->controller->get_products_select($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Products retrieved successfully');
    }

    public function get_products_select_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_product_history($request) {
        $id = $request['id'];
        $result = $this->controller->get_product_history($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Product history retrieved successfully');
    }

    public function get_product_history_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function check_product_availability($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        // Validate date parameters
        if (isset($params['start_date']) && !strtotime($params['start_date'])) {
            return $this->error_response(
                'Invalid start_date format',
                $this->http_bad_request,
                'invalid_date'
            );
        }
        if (isset($params['end_date']) && !strtotime($params['end_date'])) {
            return $this->error_response(
                'Invalid end_date format',
                $this->http_bad_request,
                'invalid_date'
            );
        }

        $result = $this->controller->check_product_availability($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Product availability checked successfully');
    }

    public function check_product_availability_permissions_check($request) {
        return true; // Implement proper permission check
    }
} 
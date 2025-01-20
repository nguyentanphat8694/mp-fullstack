<?php

/**
 * Product Management API endpoints
 */
class MB_Product_API extends MB_API {
    private $product_controller;

    public function __construct() {
        parent::__construct();
        $this->product_controller = new MB_Product_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Create products
        register_rest_route(
            $this->namespace,
            '/products',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_products'),
                    'permission_callback' => array($this, 'check_view_products_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_product'),
                    'permission_callback' => array($this, 'check_create_product_permission'),
                )
            )
        );

        // Get products by category
        register_rest_route(
            $this->namespace,
            '/products/by-category',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_products_by_category'),
                'permission_callback' => array($this, 'check_view_products_permission'),
            )
        );

        // Update/Get specific product
        register_rest_route(
            $this->namespace,
            '/products/(?P<id>\d+)',
            array(
                array(
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => array($this, 'update_product'),
                    'permission_callback' => array($this, 'check_update_product_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_product'),
                    'permission_callback' => array($this, 'check_view_products_permission'),
                )
            )
        );

        // Check product availability
        register_rest_route(
            $this->namespace,
            '/products/(?P<id>\d+)/availability',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'check_availability'),
                'permission_callback' => array($this, 'check_view_products_permission'),
            )
        );

        // Get product history
        register_rest_route(
            $this->namespace,
            '/products/(?P<id>\d+)/history',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_history'),
                'permission_callback' => array($this, 'check_view_products_permission'),
            )
        );

        // Get maintenance history
        register_rest_route(
            $this->namespace,
            '/products/(?P<id>\d+)/maintenance',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_maintenance_history'),
                'permission_callback' => array($this, 'check_view_products_permission'),
            )
        );

        // Create maintenance request
        register_rest_route(
            $this->namespace,
            '/products/maintenance-request',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_maintenance_request'),
                'permission_callback' => array($this, 'check_create_maintenance_request_permission'),
            )
        );
    }

    /**
     * Get products
     */
    public function get_products($request) {
        try {
            // Lấy các filters từ request
            $filters = array();
            
            // Thêm các filters nếu có
            $possible_filters = array('category', 'status');
            foreach ($possible_filters as $filter) {
                $value = $request->get_param($filter);
                if (!empty($value)) {
                    $filters[$filter] = $value;
                }
            }

            // Sử dụng get_contract_items từ controller nếu có contract_id
            $contract_id = $request->get_param('contract_id');
            if (!empty($contract_id)) {
                $result = $this->product_controller->get_contract_items($contract_id);
            } else {
                // Nếu không có contract_id, lấy tất cả sản phẩm theo filter
                // Note: Cần bổ sung method get_products vào controller
                return $this->error_response('Method not implemented');
            }

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get products by category
     */
    public function get_products_by_category($request) {
        try {
            $category = $request->get_param('category');
            if (empty($category)) {
                return $this->error_response('Category is required');
            }

            // Validate category
            $valid_categories = array('wedding_dress', 'vest', 'accessories', 'ao_dai');
            if (!in_array($category, $valid_categories)) {
                return $this->error_response('Invalid category');
            }

            // Note: Controller chưa có method get_product_by_category
            // Cần bổ sung vào controller theo function-controllers.md
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create product
     */
    public function create_product($request) {
        try {
            $data = $this->validate_product_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->product_controller->create_product($data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update product
     */
    public function update_product($request) {
        try {
            $product_id = absint($request['id']);
            $data = $this->validate_product_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->product_controller->update_product($product_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Check availability
     */
    public function check_availability($request) {
        try {
            $product_id = absint($request['id']);
            $start_date = $request->get_param('start_date');
            $end_date = $request->get_param('end_date');

            if (empty($start_date) || empty($end_date)) {
                return $this->error_response('Start date and end date are required');
            }

            $result = $this->product_controller->check_availability($product_id, $start_date, $end_date);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get product history
     */
    public function get_history($request) {
        try {
            $product_id = absint($request['id']);
            
            $result = $this->product_controller->get_rental_history($product_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get maintenance history
     */
    public function get_maintenance_history($request) {
        try {
            $product_id = absint($request['id']);
            
            // Note: Controller chưa có method get_maintenance_history
            // Cần bổ sung vào controller theo function-controllers.md
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create maintenance request
     */
    public function create_maintenance_request($request) {
        try {
            $data = $this->validate_maintenance_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            // Add note for product status change
            $result = $this->product_controller->update_status(
                $data['product_id'],
                'maintenance',
                $data['description']
            );

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_products_permission() {
        return current_user_can('mb_view_products');
    }

    private function check_create_product_permission() {
        return current_user_can('mb_manage_products');
    }

    private function check_update_product_permission() {
        return current_user_can('mb_manage_products') || 
               current_user_can('mb_update_product_status');
    }

    private function check_create_maintenance_request_permission() {
        return current_user_can('mb_update_product_status');
    }

    /**
     * Validate product data
     */
    private function validate_product_data($data, $is_update = false) {
        if (!$is_update) {
            // Validate required fields for new product
            $required_fields = array('code', 'name', 'category');
            $validation = $this->validator->validate_required($data, $required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        // Validate category if provided
        if (isset($data['category'])) {
            $valid_categories = array('wedding_dress', 'vest', 'accessories', 'ao_dai');
            if (!in_array($data['category'], $valid_categories)) {
                return new WP_Error('invalid_category', 'Invalid product category');
            }
        }

        // Validate status if provided
        if (isset($data['status'])) {
            $valid_statuses = array('available', 'rented', 'maintenance');
            if (!in_array($data['status'], $valid_statuses)) {
                return new WP_Error('invalid_status', 'Invalid product status');
            }
        }

        return $this->sanitize_input($data, array(
            'code' => 'string',
            'name' => 'string',
            'category' => 'string',
            'status' => 'string',
            'description' => 'text',
            'images' => 'text'
        ));
    }

    /**
     * Validate maintenance request data
     */
    private function validate_maintenance_data($data) {
        $required_fields = array('product_id', 'description');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        return $this->sanitize_input($data, array(
            'product_id' => 'int',
            'description' => 'text'
        ));
    }
} 
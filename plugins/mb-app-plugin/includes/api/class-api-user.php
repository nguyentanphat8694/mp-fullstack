<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_User_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_User_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/user', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_user'),
                'permission_callback' => array($this, 'create_user_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE, 
                'callback' => array($this, 'get_users'),
                'permission_callback' => array($this, 'get_users_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/user/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_user'),
                'permission_callback' => array($this, 'get_user_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_user'),
                'permission_callback' => array($this, 'update_user_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_user'),
                'permission_callback' => array($this, 'delete_user_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/user/role', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_users_by_roles'),
                'permission_callback' => array($this, 'get_users_by_roles_permissions_check'),
            )
        ));
    }

    public function create_user($request) {
        $params = $request->get_params();
        $result = $this->controller->create_user($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'User created successfully');
    }

    public function get_user($request) {
        $user_id = $request['id'];
        $result = $this->controller->get_user($user_id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'User retrieved successfully');
    }

    public function update_user($request) {
        $user_id = $request['id'];
        $params = $request->get_params();
        $result = $this->controller->update_user($user_id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'User updated successfully');
    }

    public function delete_user($request) {
        $user_id = $request['id'];
        $result = $this->controller->delete_user($user_id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'User deleted successfully');
    }

    public function get_users($request) {
        $params = $request->get_params();
        $result = $this->controller->get_users($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Users retrieved successfully');
    }

    public function get_users_by_roles($request) {
        $params = $request->get_params();
        
        // Validate role parameter
        if (empty($params['role'])) {
            return $this->error_response(
                'Missing required parameter: role',
                $this->http_bad_request,
                'missing_params'
            );
        }

        $result = $this->controller->get_users_by_roles($params['role']);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Users retrieved successfully');
    }

    // Permission checks
    public function create_user_permissions_check($request) {
        return true; // Implement proper permission check for mb_manage_users
    }

    public function get_user_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_user_permissions_check($request) {
        return true; // Implement proper permission check for mb_manage_users
    }

    public function delete_user_permissions_check($request) {
        return true; // Implement proper permission check for mb_manage_users
    }

    public function get_users_permissions_check($request) {
        return true;
    }

    public function get_users_by_roles_permissions_check($request) {
        return true;
    }
}

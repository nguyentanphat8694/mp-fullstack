<?php

/**
 * User Management API endpoints
 */
class MB_User_API extends MB_API {
    private $user_controller;

    public function __construct() {
        parent::__construct();
        $this->user_controller = new MB_User_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get current user
        register_rest_route(
            $this->namespace,
            '/users/current',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_current_user'),
                'permission_callback' => '__return_true',
            )
        );

        // Get all users
        register_rest_route(
            $this->namespace,
            '/users',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_users'),
                    'permission_callback' => array($this, 'check_list_users_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_user'),
                    'permission_callback' => array($this, 'check_create_user_permission'),
                )
            )
        );

        // Get users by role
        register_rest_route(
            $this->namespace,
            '/users/by-role/(?P<role>[a-zA-Z_-]+)',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_users_by_role'),
                'permission_callback' => array($this, 'check_list_users_permission'),
            )
        );

        // Update/Delete specific user
        register_rest_route(
            $this->namespace,
            '/users/(?P<id>\d+)',
            array(
                array(
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => array($this, 'update_user'),
                    'permission_callback' => array($this, 'check_update_user_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => array($this, 'delete_user'),
                    'permission_callback' => array($this, 'check_delete_user_permission'),
                )
            )
        );

        // Update profile (limited fields)
        register_rest_route(
            $this->namespace,
            '/users/(?P<id>\d+)/profile',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_profile'),
                'permission_callback' => array($this, 'check_update_profile_permission'),
            )
        );
    }

    /**
     * Get current logged in user
     */
    public function get_current_user() {
        try {
            $result = $this->user_controller->get_current_user();
            if (is_wp_error($result)) {
                return $this->error_response($result->get_error_message());
            }
            return $this->success_response($result);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get all users
     */
    public function get_users($request) {
        try {
            if (!current_user_can('list_users')) {
                return $this->error_response('Permission denied', $this->http_forbidden);
            }

            $args = array(
                'orderby' => 'display_name',
                'fields' => array('ID', 'user_login', 'user_email', 'display_name', 'roles')
            );
            
            $users = get_users($args);
            return $this->success_response($users);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get users by role
     */
    public function get_users_by_role($request) {
        try {
            $role = $this->sanitizer->sanitize_string($request['role']);
            $result = $this->user_controller->get_users_by_role($role);
            if (is_wp_error($result)) {
                return $this->error_response($result->get_error_message());
            }
            return $this->success_response($result);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create new user
     */
    public function create_user($request) {
        try {
            $data = $this->validate_user_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $userdata = array(
                'user_login' => $data['user_login'],
                'user_email' => $data['user_email'],
                'user_pass' => $data['user_pass'],
                'role' => $data['role']
            );

            if (isset($data['display_name'])) {
                $userdata['display_name'] = $data['display_name'];
            }

            $user_id = wp_insert_user($userdata);
            if (is_wp_error($user_id)) {
                return $this->error_response($user_id->get_error_message());
            }

            return $this->success_response(array('id' => $user_id), $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update user
     */
    public function update_user($request) {
        try {
            $user_id = absint($request['id']);
            $data = $this->validate_user_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $data['ID'] = $user_id;
            $result = wp_update_user($data);
            if (is_wp_error($result)) {
                return $this->error_response($result->get_error_message());
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update user profile
     */
    public function update_profile($request) {
        try {
            $user_id = absint($request['id']);
            $data = $this->validate_profile_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->user_controller->update_profile($user_id, $data);
            if (is_wp_error($result)) {
                return $this->error_response($result->get_error_message());
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Delete user
     */
    public function delete_user($request) {
        try {
            $user_id = absint($request['id']);
            
            if (!current_user_can('delete_users')) {
                return $this->error_response('Permission denied', $this->http_forbidden);
            }

            $result = wp_delete_user($user_id);
            if (!$result) {
                return $this->error_response('Failed to delete user');
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    public function check_list_users_permission() {
        return current_user_can('list_users');
    }

    public function check_create_user_permission() {
        return $this->check_capability('create_users');
    }

    public function check_update_user_permission() {
        return $this->check_capability('edit_users');
    }

    public function check_delete_user_permission() {
        return $this->check_capability('delete_users');
    }

    public function check_update_profile_permission($request) {
        $user_id = absint($request['id']);
        return current_user_can('edit_user', $user_id) || get_current_user_id() === $user_id;
    }

    /**
     * Validate user data
     */
    private function validate_user_data($data, $update = false) {
        // Validate required fields for new user
        if (!$update && (!isset($data['ID']) || !isset($data['user_login']) || !isset($data['user_email']) || !isset($data['role']))) {
            $required_fields = array('user_login', 'user_email', 'role');
            $validation = $this->validator->validate_required($data, $required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        // Validate email format
        if (isset($data['user_email']) && !is_email($data['user_email'])) {
            return new WP_Error('invalid_email', 'Invalid email format');
        }

        // Validate role
        if (isset($data['role'])) {
            $valid_roles = array('admin', 'manager', 'accountant', 'telesale', 'facebook', 
                               'sale', 'photo-wedding', 'photo-pre-wedding', 'tailor');
            if (!in_array($data['role'], $valid_roles)) {
                return new WP_Error('invalid_role', 'Invalid user role');
            }
        }

        // Sanitize data
        return $this->sanitize_input($data, array(
            'user_login' => 'string',
            'user_email' => 'string',
            'user_pass' => 'string',
            'display_name' => 'string',
            'role' => 'string'
        ));
    }

    /**
     * Validate profile update data
     */
    private function validate_profile_data($data) {
        // Validate at least one field is present
        $allowed_fields = array('user_email', 'display_name', 'user_pass');
        $has_fields = false;
        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $has_fields = true;
                break;
            }
        }

        if (!$has_fields) {
            return new WP_Error('invalid_data', 'No valid fields to update');
        }

        // Sanitize data
        return $this->sanitize_input($data, array(
            'user_email' => 'string',
            'display_name' => 'string',
            'user_pass' => 'string'
        ));
    }
} 
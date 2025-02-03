<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Setting_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Setting_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/setting', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_setting'),
                'permission_callback' => array($this, 'create_setting_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_settings'),
                'permission_callback' => array($this, 'get_settings_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/setting/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_setting'),
                'permission_callback' => array($this, 'get_setting_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_setting'),
                'permission_callback' => array($this, 'update_setting_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_setting'),
                'permission_callback' => array($this, 'delete_setting_permissions_check'),
            )
        ));
    }

    public function create_setting($request) {
        $params = $request->get_params();
        $result = $this->controller->create_setting($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Setting created successfully');
    }

    public function get_settings($request) {
        $params = $request->get_params();
        $result = $this->controller->get_settings($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Settings retrieved successfully');
    }

    public function get_setting($request) {
        $id = $request['id'];
        $result = $this->controller->get_setting($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Setting retrieved successfully');
    }

    public function update_setting($request) {
        $id = $request['id'];
        $params = $request->get_params();
        $result = $this->controller->update_setting($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Setting updated successfully');
    }

    public function delete_setting($request) {
        $id = $request['id'];
        $result = $this->controller->delete_setting($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Setting deleted successfully');
    }

    // Permission checks
    public function create_setting_permissions_check($request) {
        return true; // Implement proper permission check for mb_manage_settings
    }

    public function get_settings_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_setting_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_setting_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function delete_setting_permissions_check($request) {
        return true; // Implement proper permission check
    }
} 
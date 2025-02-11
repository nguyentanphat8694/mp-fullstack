<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Task_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Task_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/task', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_task'),
                'permission_callback' => array($this, 'create_task_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_tasks'),
                'permission_callback' => array($this, 'get_tasks_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/task/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_task'),
                'permission_callback' => array($this, 'get_task_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_task'),
                'permission_callback' => array($this, 'update_task_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_task'),
                'permission_callback' => array($this, 'delete_task_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/task/(?P<id>\d+)/comment', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_task_comment'),
                'permission_callback' => array($this, 'create_task_comment_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/task/(?P<id>\d+)/status', array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_task_status'),
                'permission_callback' => array($this, 'update_task_status_permissions_check'),
            )
        ));
    }

    public function create_task($request) {
        $params = $request->get_params();
        
        // Validate required parameters
        $required_fields = array('title', 'due_date');
        foreach ($required_fields as $field) {
            if (!isset($params[$field])) {
                return $this->error_response(
                    sprintf('Missing required parameter: %s', $field),
                    $this->http_bad_request,
                    'missing_params'
                );
            }
        }

        $result = $this->controller->create_task($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Task created successfully');
    }

    public function get_tasks($request) {
        $params = $request->get_params();
        $result = $this->controller->get_tasks($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Tasks retrieved successfully');
    }

    public function get_task($request) {
        $id = $request['id'];
        $result = $this->controller->get_task($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Task retrieved successfully');
    }

    public function update_task($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        $result = $this->controller->update_task($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Task updated successfully');
    }

    public function delete_task($request) {
        $id = $request['id'];
        $result = $this->controller->delete_task($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Task deleted successfully');
    }

    public function create_task_comment($request) {
        $task_id = $request['id'];
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['comment'])) {
            return $this->error_response(
                'Missing comment parameter',
                $this->http_bad_request,
                'missing_parameter'
            );
        }

        $result = $this->controller->create_task_comment($task_id, $params['comment']);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Comment created successfully');
    }

    public function update_task_status($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['status'])) {
            return $this->error_response(
                'Missing status parameter',
                $this->http_bad_request,
                'missing_parameter'
            );
        }

        // Validate status value
        $allowed_statuses = array('pending', 'in_progress', 'completed');
        if (!in_array($params['status'], $allowed_statuses)) {
            return $this->error_response(
                'Invalid status value. Allowed values: ' . implode(', ', $allowed_statuses),
                $this->http_bad_request,
                'invalid_status'
            );
        }

        $result = $this->controller->update_task_status($id, $params['status']);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Task status updated successfully');
    }

    // Permission checks
    public function create_task_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_tasks_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_task_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_task_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function delete_task_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function create_task_comment_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_task_status_permissions_check($request) {
        return true; // Implement proper permission check
    }
} 
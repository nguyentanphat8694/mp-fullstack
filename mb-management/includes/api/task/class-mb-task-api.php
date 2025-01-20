<?php

/**
 * Task Management API endpoints
 */
class MB_Task_API extends MB_API {
    private $task_controller;

    public function __construct() {
        parent::__construct();
        $this->task_controller = new MB_Task_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Create tasks
        register_rest_route(
            $this->namespace,
            '/tasks',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_tasks'),
                    'permission_callback' => array($this, 'check_view_tasks_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_task'),
                    'permission_callback' => array($this, 'check_create_task_permission'),
                )
            )
        );

        // Update task
        register_rest_route(
            $this->namespace,
            '/tasks/(?P<id>\d+)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_task'),
                'permission_callback' => array($this, 'check_edit_task_permission'),
            )
        );

        // Get assigned tasks
        register_rest_route(
            $this->namespace,
            '/tasks/assigned',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_assigned_tasks'),
                'permission_callback' => array($this, 'check_view_tasks_permission'),
            )
        );

        // Assign task
        register_rest_route(
            $this->namespace,
            '/tasks/(?P<id>\d+)/assign',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'assign_task'),
                'permission_callback' => array($this, 'check_assign_task_permission'),
            )
        );

        // Get task history
        register_rest_route(
            $this->namespace,
            '/tasks/(?P<id>\d+)/history',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_task_history'),
                'permission_callback' => array($this, 'check_view_tasks_permission'),
            )
        );
    }

    /**
     * Get tasks
     */
    public function get_tasks($request) {
        try {
            $result = $this->task_controller->get_assigned_tasks(get_current_user_id());
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create task
     */
    public function create_task($request) {
        try {
            $data = $this->validate_task_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->task_controller->create_task($data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update task status
     */
    public function update_task($request) {
        try {
            $task_id = absint($request['id']);
            $status = $request->get_param('status');

            $result = $this->task_controller->update_status($task_id, $status);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get assigned tasks
     */
    public function get_assigned_tasks($request) {
        try {
            $user_id = get_current_user_id();
            $result = $this->task_controller->get_assigned_tasks($user_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Assign task to user
     */
    public function assign_task($request) {
        try {
            $task_id = absint($request['id']);
            $user_id = absint($request->get_param('user_id'));

            $result = $this->task_controller->assign_task($task_id, $user_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get task history
     * Note: Requires implementation of get_task_history() in MB_Task_Controller
     */
    public function get_task_history($request) {
        try {
            // Note: Controller chưa có method get_task_history
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_tasks_permission() {
        return current_user_can('mb_view_tasks');
    }

    private function check_create_task_permission() {
        return current_user_can('mb_create_tasks');
    }

    private function check_edit_task_permission() {
        return current_user_can('mb_edit_tasks');
    }

    private function check_assign_task_permission() {
        return current_user_can('mb_assign_tasks');
    }

    /**
     * Validate task data
     */
    private function validate_task_data($data) {
        $required_fields = array('title', 'description', 'due_date');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        if (!empty($data['due_date']) && !strtotime($data['due_date'])) {
            return new WP_Error('invalid_date', 'Invalid due date format');
        }

        return $this->sanitize_input($data, array(
            'title' => 'text',
            'description' => 'text',
            'due_date' => 'date',
            'priority' => 'text',
            'assigned_to' => 'int'
        ));
    }
} 
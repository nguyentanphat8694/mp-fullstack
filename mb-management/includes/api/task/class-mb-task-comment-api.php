<?php

/**
 * Task Comment Management API endpoints
 */
class MB_Task_Comment_API extends MB_API {
    private $task_controller;

    public function __construct() {
        parent::__construct();
        $this->task_controller = new MB_Task_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Add comments
        register_rest_route(
            $this->namespace,
            '/tasks/(?P<id>\d+)/comments',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_comments'),
                    'permission_callback' => array($this, 'check_view_comments_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'add_comment'),
                    'permission_callback' => array($this, 'check_add_comment_permission'),
                )
            )
        );
    }

    /**
     * Get task comments
     */
    public function get_comments($request) {
        try {
            $task_id = absint($request['id']);
            
            $result = $this->task_controller->get_task_comments($task_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Add comment to task
     */
    public function add_comment($request) {
        try {
            $task_id = absint($request['id']);
            $data = $this->validate_comment_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->task_controller->add_comment($task_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_comments_permission() {
        return current_user_can('mb_view_task_comments');
    }

    private function check_add_comment_permission() {
        return current_user_can('mb_add_task_comments');
    }

    /**
     * Validate comment data
     */
    private function validate_comment_data($data) {
        $required_fields = array('content');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        return $this->sanitize_input($data, array(
            'content' => 'text',
            'attachment' => 'url'
        ));
    }
} 
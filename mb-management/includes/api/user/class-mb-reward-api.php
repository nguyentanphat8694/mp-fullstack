<?php

/**
 * Reward Management API endpoints
 */
class MB_Reward_API extends MB_API {
    private $reward_controller;

    public function __construct() {
        parent::__construct();
        $this->reward_controller = new MB_Reward_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/rewards',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_rewards'),
                    'permission_callback' => array($this, 'check_view_rewards_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_reward'),
                    'permission_callback' => array($this, 'check_create_reward_permission'),
                )
            )
        );

        register_rest_route(
            $this->namespace,
            '/rewards/(?P<id>\d+)/(?P<status>approved|rejected)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'approve_reward'),
                'permission_callback' => array($this, 'check_process_reward_permission'),
            )
        );

        register_rest_route(
            $this->namespace,
            '/users/(?P<id>\d+)/rewards',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_user_rewards'),
                'permission_callback' => array($this, 'check_view_user_rewards_permission'),
            )
        );

        register_rest_route(
            $this->namespace,
            '/users/(?P<id>\d+)/monthly-summary',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_monthly_summary'),
                'permission_callback' => array($this, 'check_view_summary_permission'),
            )
        );
    }

    /**
     * Get rewards list
     */
    public function get_rewards($request) {
        try {
            $user_id = $request->get_param('user_id');
            $start_date = $request->get_param('start_date');
            $end_date = $request->get_param('end_date');
            $status = $request->get_param('status');
            
            $result = $this->reward_controller->get_rewards($user_id, $start_date, $end_date, $status);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }
            
            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create new reward
     */
    public function create_reward($request) {
        try {
            $data = $this->validate_reward_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->reward_controller->create_reward($data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Approve/Reject reward
     */
    public function approve_reward($request) {
        try {
            $reward_id = absint($request['id']);
            $status = $this->sanitizer->sanitize_string($request['status']);
            
            $result = $this->reward_controller->approve_reward($reward_id, $status);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content, $result['message']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get user rewards
     */
    public function get_user_rewards($request) {
        try {
            $user_id = absint($request['id']);
            $start_date = $request->get_param('start_date');
            $end_date = $request->get_param('end_date');
            $status = $request->get_param('status');
            
            $result = $this->reward_controller->get_rewards($user_id, $start_date, $end_date, $status);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }
            
            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get monthly summary
     */
    public function get_monthly_summary($request) {
        try {
            $user_id = absint($request['id']);
            $month = $request->get_param('month');
            $year = $request->get_param('year');

            if (!empty($month) && (!$this->validator->validate_decimal($month, 1) || $month > 12)) {
                return $this->error_response('Invalid month parameter');
            }

            if (!empty($year) && !$this->validator->validate_decimal($year, 2000)) {
                return $this->error_response('Invalid year parameter');
            }

            $result = $this->reward_controller->get_monthly_summary($user_id, $month, $year);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    public function check_view_rewards_permission() {
        return $this->check_capability('mb_manage_users') || $this->check_capability('mb_approve_rewards');
    }

    public function check_create_reward_permission() {
        return $this->check_capability('mb_manage_users');
    }

    public function check_process_reward_permission() {
        return $this->check_capability('mb_approve_rewards');
    }

    public function check_view_user_rewards_permission($request) {
        $user_id = absint($request['id']);
        return $this->check_capability('mb_manage_users') || get_current_user_id() === $user_id;
    }

    public function check_view_summary_permission($request) {
        $user_id = absint($request['id']);
        return $this->check_capability('mb_manage_users') || get_current_user_id() === $user_id;
    }

    /**
     * Validate reward data
     */
    private function validate_reward_data($data) {
        // Validate required fields
        $required_fields = array('user_id', 'type', 'amount', 'reason');
        $validation = $this->validator->validate_required($data, $required_fields);
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Validate specific fields
        if (!$this->validator->validate_enum($data['type'], array('reward', 'penalty'))) {
            return new WP_Error('invalid_type', 'Invalid reward type');
        }

        if (!$this->validator->validate_decimal($data['amount'], 0)) {
            return new WP_Error('invalid_amount', 'Amount must be a positive number');
        }

        // Sanitize data using parent's sanitize_input method
        return $this->sanitize_input($data, array(
            'user_id' => 'string',
            'type' => 'string',
            'amount' => 'decimal',
            'reason' => 'string'
        ));
    }
} 
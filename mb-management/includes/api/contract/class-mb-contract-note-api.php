<?php

/**
 * Contract Note Management API endpoints
 */
class MB_Contract_Note_API extends MB_API {
    private $contract_controller;

    public function __construct() {
        parent::__construct();
        $this->contract_controller = new MB_Contract_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Add/Get notes
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<id>\d+)/notes',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_contract_notes'),
                    'permission_callback' => array($this, 'check_view_contracts_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'add_note'),
                    'permission_callback' => array($this, 'check_update_contract_permission'),
                )
            )
        );

        // Update note
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<contract_id>\d+)/notes/(?P<note_id>\d+)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_note'),
                'permission_callback' => array($this, 'check_update_contract_permission'),
            )
        );

        // Process note (approve/reject)
        register_rest_route(
            $this->namespace,
            '/contracts/(?P<contract_id>\d+)/notes/(?P<note_id>\d+)/process',
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'process_note'),
                'permission_callback' => array($this, 'check_approve_note_permission'),
            )
        );
    }

    /**
     * Get contract notes
     */
    public function get_contract_notes($request) {
        try {
            $contract_id = absint($request['id']);
            
            $result = $this->contract_controller->get_contract_notes($contract_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Add note
     */
    public function add_note($request) {
        try {
            $contract_id = absint($request['id']);
            $data = $this->validate_note_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->add_note($contract_id, $data);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update note
     */
    public function update_note($request) {
        try {
            $contract_id = absint($request['contract_id']);
            $note_id = absint($request['note_id']);
            $data = $this->validate_note_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->contract_controller->process_note($note_id, 'update');
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Process note
     */
    public function process_note($request) {
        try {
            $contract_id = absint($request['contract_id']);
            $note_id = absint($request['note_id']);
            $action = $request->get_param('action');

            if (!in_array($action, array('approve', 'reject'))) {
                return $this->error_response('Invalid action');
            }

            $result = $this->contract_controller->approve_contract_note(
                $note_id,
                $action === 'approve' ? 'approved' : 'rejected',
                get_current_user_id()
            );
            
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_contracts_permission() {
        return current_user_can('mb_view_contracts');
    }

    private function check_update_contract_permission() {
        return current_user_can('mb_update_contracts');
    }

    private function check_approve_note_permission() {
        return current_user_can('mb_approve_contract_notes');
    }

    /**
     * Validate note data
     */
    private function validate_note_data($data, $is_update = false) {
        if (!$is_update) {
            $required_fields = array('content');
            $validation = $this->validator->validate_required($data, $required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        return $this->sanitize_input($data, array(
            'content' => 'text',
            'status' => 'string'
        ));
    }
} 
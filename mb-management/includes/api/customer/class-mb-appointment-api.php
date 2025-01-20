<?php

/**
 * Appointment Management API endpoints
 */
class MB_Appointment_API extends MB_API {
    private $customer_controller;

    public function __construct() {
        parent::__construct();
        $this->customer_controller = new MB_Customer_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get/Create appointments
        register_rest_route(
            $this->namespace,
            '/appointments',
            array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_appointments'),
                    'permission_callback' => array($this, 'check_view_appointments_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'create_appointment'),
                    'permission_callback' => array($this, 'check_create_appointment_permission'),
                )
            )
        );

        // Get today's appointments
        register_rest_route(
            $this->namespace,
            '/appointments/today',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_today_appointments'),
                'permission_callback' => array($this, 'check_view_appointments_permission'),
            )
        );

        // Update appointment
        register_rest_route(
            $this->namespace,
            '/appointments/(?P<id>\d+)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_appointment'),
                'permission_callback' => array($this, 'check_update_appointment_permission'),
            )
        );

        // Take appointment
        register_rest_route(
            $this->namespace,
            '/appointments/(?P<id>\d+)/take',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'take_appointment'),
                'permission_callback' => array($this, 'check_take_appointment_permission'),
            )
        );
    }

    /**
     * Get all appointments
     */
    public function get_appointments($request) {
        try {
            $date = $request->get_param('date');
            $appointments = $this->customer_controller->get_appointments_by_date($date);
            
            if (!$appointments['success']) {
                return $this->error_response($appointments['message']);
            }

            return $this->success_response($appointments['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Create new appointment
     */
    public function create_appointment($request) {
        try {
            $data = $this->validate_appointment_data($request->get_params());
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->customer_controller->create_appointment(
                $data['customer_id'],
                $data
            );

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data'], $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get today's appointments
     */
    public function get_today_appointments($request) {
        try {
            $today = date('Y-m-d');
            $appointments = $this->customer_controller->get_appointments_by_date($today);
            
            if (!$appointments['success']) {
                return $this->error_response($appointments['message']);
            }

            return $this->success_response($appointments['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Update appointment
     */
    public function update_appointment($request) {
        try {
            $appointment_id = absint($request['id']);
            $data = $this->validate_appointment_data($request->get_params(), true);
            if (is_wp_error($data)) {
                return $this->error_response($data->get_error_message());
            }

            $result = $this->customer_controller->update_customer_status(
                $data['customer_id'],
                'appointment',
                isset($data['note']) ? $data['note'] : ''
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
     * Take appointment by sale
     */
    public function take_appointment($request) {
        try {
            $appointment_id = absint($request['id']);
            $result = $this->customer_controller->take_appointment($appointment_id);
            
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
    private function check_view_appointments_permission() {
        return current_user_can('mb_view_appointments');
    }

    private function check_create_appointment_permission() {
        return current_user_can('mb_create_appointments');
    }

    private function check_update_appointment_permission() {
        return current_user_can('mb_update_appointments');
    }

    private function check_take_appointment_permission() {
        return current_user_can('mb_update_appointments');
    }

    /**
     * Validate appointment data
     */
    private function validate_appointment_data($data, $is_update = false) {
        if (!$is_update) {
            $required_fields = array('customer_id', 'appointment_date');
            $validation = $this->validator->validate_required($data, $required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        return $this->sanitize_input($data, array(
            'customer_id' => 'int',
            'appointment_date' => 'datetime',
            'status' => 'string',
            'note' => 'string'
        ));
    }
} 
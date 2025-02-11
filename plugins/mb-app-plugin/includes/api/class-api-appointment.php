<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Appointment_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Appointment_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/appointment', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_appointment'),
                'permission_callback' => array($this, 'create_appointment_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_appointments'),
                'permission_callback' => array($this, 'get_appointments_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/appointment/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_appointment'),
                'permission_callback' => array($this, 'get_appointment_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_appointment'),
                'permission_callback' => array($this, 'update_appointment_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_appointment'),
                'permission_callback' => array($this, 'delete_appointment_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/appointment/(?P<id>\d+)/assign', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'assign_appointment'),
                'permission_callback' => array($this, 'assign_appointment_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/appointment/(?P<id>\d+)/completed', array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'complete_appointment'),
                'permission_callback' => array($this, 'complete_appointment_permissions_check'),
            )
        ));
    }

    public function create_appointment($request) {
        $params = $request->get_params();
        $result = $this->controller->create_appointment($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Appointment created successfully');
    }

    public function get_appointments($request) {
        $params = $request->get_params();
        $result = $this->controller->get_appointments($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Appointments retrieved successfully');
    }

    public function get_appointment($request) {
        $id = $request['id'];
        $result = $this->controller->get_appointment($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Appointment retrieved successfully');
    }

    public function update_appointment($request) {
        $id = $request['id'];
        $params = $request->get_params();
        $result = $this->controller->update_appointment($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Appointment updated successfully');
    }

    public function assign_appointment($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        if (!isset($params['type'])) {
            return $this->error_response(
                'Missing isReceiving parameter',
                $this->http_bad_request,
                'missing_parameter'
            );
        }

        $result = $this->controller->assign_appointment($id, (bool)$params['type']);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Appointment assignment updated successfully');
    }

    public function delete_appointment($request) {
        $id = $request['id'];
        $result = $this->controller->delete_appointment($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Appointment deleted successfully');
    }

    public function complete_appointment($request) {
        $id = $request['id'];
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['type'])) {
            return $this->error_response(
                'Missing type parameter',
                $this->http_bad_request,
                'missing_parameter'
            );
        }

        $result = $this->controller->complete_appointment(
            $id, 
            (bool)$params['type'],
            isset($params['note']) ? $params['note'] : ''
        );

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(
            $result, 
            $this->http_ok, 
            'Appointment status updated successfully'
        );
    }

    // Permission checks
    public function create_appointment_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_appointments_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_appointment_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_appointment_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function assign_appointment_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function delete_appointment_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function complete_appointment_permissions_check($request) {
        return true; // Implement proper permission check
    }
} 
<?php

/**
 * Base API class for MB Management plugin
 * Handles common API functionality including response formatting and permissions
 */
class MB_API {
    /**
     * API namespace
     */
    protected $namespace = 'mb/v1';

    /**
     * Response codes
     */
    protected $http_ok = 200;
    protected $http_created = 201;
    protected $http_no_content = 204;
    protected $http_bad_request = 400;
    protected $http_unauthorized = 401;
    protected $http_forbidden = 403;
    protected $http_not_found = 404;
    protected $http_server_error = 500;

    /**
     * Sanitizer instance
     */
    protected $sanitizer;

    public function __construct() {
        $this->sanitizer = new MB_Sanitizer();
    }

    /**
     * Register routes for the API
     */
    public function register_routes() {
        // To be implemented by child classes
    }

    /**
     * Check if user has required capability
     *
     * @param string $capability
     * @return bool|WP_Error
     */
    protected function check_capability($capability) {
        if (!current_user_can($capability)) {
            return new WP_Error(
                'rest_forbidden',
                'You do not have permission to perform this action',
                ['status' => $this->http_forbidden]
            );
        }
        return true;
    }

    /**
     * Format success response
     */
    protected function success_response($data = null, $status_code = null, $message = '') {
        if ($status_code === null) {
            $status_code = $this->http_ok;
        }

        $response = array(
            'success' => true
        );

        if ($data !== null) {
            $response['data'] = $data;
        }

        if (!empty($message)) {
            $response['message'] = $message;
        }

        if ($status_code === $this->http_no_content) {
            $response = null;
        }

        return new WP_REST_Response($response, $status_code);
    }

    /**
     * Format error response
     */
    protected function error_response($message, $status_code = null, $code = '', $additional_data = array()) {
        if ($status_code === null) {
            $status_code = $this->http_bad_request;
        }

        $error = array(
            'success' => false,
            'error' => array(
                'message' => $message,
                'code' => !empty($code) ? $code : 'general_error'
            )
        );

        if (!empty($additional_data)) {
            $error['error']['data'] = $additional_data;
        }

        return new WP_REST_Response($error, $status_code);
    }

    /**
     * Format validation error response
     *
     * @param array $validation_errors Array of validation errors
     * @return WP_REST_Response
     */
    protected function validation_error_response(array $validation_errors) {
        return $this->error_response(
            'Validation failed',
            $this->http_bad_request,
            'validation_error',
            ['validation_errors' => $validation_errors]
        );
    }

    /**
     * Format pagination response
     */
    protected function pagination_response($items, $total_items, $pagination) {
        return $this->success_response(array(
            'items' => $items,
            'meta' => array(
                'total' => $total_items,
                'page' => $pagination['page'],
                'per_page' => $pagination['per_page'],
                'total_pages' => ceil($total_items / $pagination['per_page'])
            )
        ));
    }
}
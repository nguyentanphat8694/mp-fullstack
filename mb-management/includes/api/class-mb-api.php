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
     * Validator instance
     */
    protected $validator;

    /**
     * Sanitizer instance
     */
    protected $sanitizer;

    public function __construct() {
        $this->validator = new MB_Validator();
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
     * Validate required fields
     */
    protected function validate_required($data, $required_fields) {
        return $this->validator->validate_required($data, $required_fields);
    }

    /**
     * Validate phone number
     */
    protected function validate_phone($phone) {
        return $this->validator->validate_phone($phone);
    }

    /**
     * Validate date
     */
    protected function validate_date($date, $format = 'Y-m-d') {
        return $this->validator->validate_date($date, $format);
    }

    /**
     * Validate datetime
     */
    protected function validate_datetime($datetime) {
        return $this->validator->validate_datetime($datetime);
    }

    /**
     * Validate decimal number
     */
    protected function validate_decimal($number, $min = 0) {
        return $this->validator->validate_decimal($number, $min);
    }

    /**
     * Validate enum value
     */
    protected function validate_enum($value, $allowed_values) {
        return $this->validator->validate_enum($value, $allowed_values);
    }

    /**
     * Validate contract type
     */
    protected function validate_contract_type($type) {
        return $this->validator->validate_contract_type($type);
    }

    /**
     * Validate product category
     */
    protected function validate_product_category($category) {
        return $this->validator->validate_product_category($category);
    }

    /**
     * Sanitize string
     */
    protected function sanitize_string($string) {
        return $this->sanitizer->sanitize_string($string);
    }

    /**
     * Sanitize HTML
     */
    protected function sanitize_html($html) {
        return $this->sanitizer->sanitize_html($html);
    }

    /**
     * Sanitize phone number
     */
    protected function sanitize_phone($phone) {
        return $this->sanitizer->sanitize_phone($phone);
    }

    /**
     * Sanitize decimal number
     */
    protected function sanitize_decimal($number) {
        return $this->sanitizer->sanitize_decimal($number);
    }

    /**
     * Sanitize date
     */
    protected function sanitize_date($date) {
        return $this->sanitizer->sanitize_date($date);
    }

    /**
     * Sanitize datetime
     */
    protected function sanitize_datetime($datetime) {
        return $this->sanitizer->sanitize_datetime($datetime);
    }

    /**
     * Get pagination parameters from request
     */
    protected function get_pagination_params($request) {
        return array(
            'page' => (int) $request->get_param('page') ?: 1,
            'per_page' => min((int) $request->get_param('per_page') ?: 10, 100),
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

    /**
     * Validate WiFi connection for attendance
     *
     * @return bool|WP_Error
     */
    protected function validate_company_wifi() {
        $wifi_service = new MB_Wifi_Service();
        $wifi_name = $this->sanitizer->sanitize_string($_SERVER['REMOTE_ADDR']);
        $ip_address = $this->sanitizer->sanitize_string($_SERVER['REMOTE_ADDR']);
        
        return $wifi_service->validate_wifi($wifi_name, $ip_address);
    }

    /**
     * Sanitize input data
     *
     * @param array $data Input data to sanitize
     * @param array $fields_config Key-value pairs of field name and sanitize type
     * @return array
     */
    protected function sanitize_input($data, $fields_config) {
        $clean_data = array();
        
        foreach ($fields_config as $field => $type) {
            if (!isset($data[$field])) {
                continue;
            }
            
            switch ($type) {
                case 'string':
                    $clean_data[$field] = $this->sanitizer->sanitize_string($data[$field]);
                    break;
                case 'html':
                    $clean_data[$field] = $this->sanitizer->sanitize_html($data[$field]);
                    break;
                case 'phone':
                    $clean_data[$field] = $this->sanitizer->sanitize_phone($data[$field]);
                    break;
                case 'decimal':
                    $clean_data[$field] = $this->sanitizer->sanitize_decimal($data[$field]);
                    break;
                case 'date':
                    $clean_data[$field] = $this->sanitizer->sanitize_date($data[$field]);
                    break;
                case 'datetime':
                    $clean_data[$field] = $this->sanitizer->sanitize_datetime($data[$field]);
                    break;
                default:
                    $clean_data[$field] = $this->sanitizer->sanitize_string($data[$field]);
            }
        }
        
        return $clean_data;
    }

//    /**
//     * Check if response is an error
//     *
//     * @param array $response Response array
//     * @return bool
//     */
//    protected function is_error($response) {
//        if (!is_array($response) || !isset($response['success'])) {
//            return true;
//        }
//        return !$response['success'];
//    }
//
//    /**
//     * Get error message from response array
//     *
//     * @param array $response Response array
//     * @return string
//     */
//    protected function get_error_message($response) {
//        if (!is_array($response)) {
//            return '';
//        }
//
//        if (isset($response['message'])) {
//            return $response['message'];
//        }
//
//        return '';
//    }
} 
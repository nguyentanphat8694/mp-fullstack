<?php

/**
 * Attendance Management API endpoints
 */
class MB_Attendance_API extends MB_API {
    private $attendance_controller;

    public function __construct() {
        parent::__construct(); // Gọi constructor của MB_API để khởi tạo validator và sanitizer
        $this->attendance_controller = new MB_Attendance_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/users/attendance',
            array(
                array(
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => array($this, 'check_in'),
                    'permission_callback' => array($this, 'check_attendance_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => array($this, 'check_out'),
                    'permission_callback' => array($this, 'check_attendance_permission'),
                )
            )
        );

        register_rest_route(
            $this->namespace,
            '/users/(?P<id>\d+)/attendance',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_attendance'),
                'permission_callback' => array($this, 'check_view_attendance_permission'),
            )
        );
    }

    /**
     * Check in attendance
     */
    public function check_in($request) {
        try {
            // Validate company WiFi
            $wifi_validation = $this->validate_company_wifi();
            if (is_wp_error($wifi_validation)) {
                return $this->error_response($wifi_validation->get_error_message());
            }

            // Prepare and sanitize data
            $data = $this->sanitize_input(
                array(
                    'user_id' => get_current_user_id(),
                    'ip_address' => $_SERVER['REMOTE_ADDR'],
                    'wifi_name' => $_SERVER['REMOTE_ADDR'], // Thay bằng hàm lấy wifi name thực tế
                    'check_in_time' => current_time('mysql')
                ),
                array(
                    'user_id' => 'string',
                    'ip_address' => 'string',
                    'wifi_name' => 'string',
                    'check_in_time' => 'datetime'
                )
            );

            $this->attendance_controller->check_in($data);
            return $this->success_response(null, $this->http_created);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Check out attendance
     */
    public function check_out($request) {
        try {
            // Validate company WiFi
            $wifi_validation = $this->validate_company_wifi();
            if (is_wp_error($wifi_validation)) {
                return $this->error_response($wifi_validation->get_error_message());
            }

            // Prepare and sanitize data
            $data = $this->sanitize_input(
                array(
                    'user_id' => get_current_user_id(),
                    'check_out_time' => current_time('mysql')
                ),
                array(
                    'user_id' => 'string',
                    'check_out_time' => 'datetime'
                )
            );

            $this->attendance_controller->check_out($data);
            return $this->success_response(null, $this->http_no_content);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get attendance records
     */
    public function get_attendance($request) {
        try {
            $user_id = absint($request['id']);
            
            // Validate and sanitize date parameters
            $month = $request->get_param('month');
            $year = $request->get_param('year');

            if (!empty($month)) {
                if (!$this->validate_decimal($month, 1) || $month > 12) {
                    return $this->error_response('Invalid month parameter');
                }
            }

            if (!empty($year)) {
                if (!$this->validate_decimal($year, 2000)) {
                    return $this->error_response('Invalid year parameter');
                }
            }

            $attendance = $this->attendance_controller->get_monthly_report($user_id, $month, $year);
            return $this->success_response($attendance);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    public function check_attendance_permission() {
        return is_user_logged_in();
    }

    public function check_view_attendance_permission($request) {
        $user_id = absint($request['id']);
        return current_user_can('mb_manage_users') || get_current_user_id() === $user_id;
    }
} 
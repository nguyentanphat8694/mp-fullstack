<?php

/**
 * Customer History API endpoints
 */
class MB_Customer_History_API extends MB_API {
    private $customer_controller;

    public function __construct() {
        parent::__construct();
        $this->customer_controller = new MB_Customer_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get customer history
        register_rest_route(
            $this->namespace,
            '/customers/(?P<id>\d+)/history',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_history'),
                'permission_callback' => array($this, 'check_view_customer_history_permission'),
            )
        );
    }

    /**
     * Get customer history
     */
    public function get_history($request) {
        try {
            $customer_id = absint($request['id']);
            
            // Check if user can view this customer's history
            if (!$this->can_view_customer($customer_id)) {
                return $this->error_response('Permission denied', $this->http_forbidden);
            }

            // Sử dụng get_customers với filter customer_id
            $customer = $this->customer_controller->get_customers(['customer_id' => $customer_id]);
            if (!$customer['success']) {
                return $this->error_response($customer['message']);
            }

            // Nếu không tìm thấy customer
            if (empty($customer)) {
                return $this->error_response('Customer not found', $this->http_not_found);
            }

            // Lấy lịch sử appointments của customer
            $appointments = $this->customer_controller->get_appointments_by_date(null, $customer_id);
            if (!$appointments['success']) {
                return $this->error_response($appointments['message']);
            }

            $history = array(
                'customer' => $customer['data'][0], // Lấy customer đầu tiên vì filter theo ID
                'appointments' => $appointments['data']
            );

            return $this->success_response($history);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_customer_history_permission() {
        return current_user_can('mb_view_customers') || 
               current_user_can('mb_view_assigned_customers');
    }

    /**
     * Check if user can view specific customer
     */
    private function can_view_customer($customer_id) {
        if (current_user_can('mb_view_customers')) {
            return true;
        }

        if (current_user_can('mb_view_assigned_customers')) {
            // Kiểm tra xem customer có được assign cho user hiện tại không
            $customers = $this->customer_controller->get_assigned_customers(get_current_user_id());
            if (!$customers['success']) {
                return false;
            }
            
            foreach ($customers as $customer) {
                if ($customer['id'] == $customer_id) {
                    return true;
                }
            }
        }

        return false;
    }
} 
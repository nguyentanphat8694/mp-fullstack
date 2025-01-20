<?php

/**
 * Financial Reports API endpoints
 */
class MB_Report_API extends MB_API {
    private $finance_controller;

    public function __construct() {
        parent::__construct();
        $this->finance_controller = new MB_Finance_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get transaction summary
        register_rest_route(
            $this->namespace,
            '/finances/reports/transactions',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_transaction_summary'),
                'permission_callback' => array($this, 'check_view_reports_permission'),
            )
        );

        // Get transactions by type
        register_rest_route(
            $this->namespace,
            '/finances/reports/transactions/by-type',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_transactions_by_type'),
                'permission_callback' => array($this, 'check_view_reports_permission'),
            )
        );

        // Get contract transactions
        register_rest_route(
            $this->namespace,
            '/finances/reports/contracts/(?P<id>\d+)/transactions',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_contract_transactions'),
                'permission_callback' => array($this, 'check_view_reports_permission'),
            )
        );

        // Get overdue contracts
        register_rest_route(
            $this->namespace,
            '/finances/reports/contracts/overdue',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_overdue_contracts'),
                'permission_callback' => array($this, 'check_view_reports_permission'),
            )
        );
    }

    /**
     * Get transaction summary
     */
    public function get_transaction_summary($request) {
        try {
            $start_date = $request->get_param('start_date');
            $end_date = $request->get_param('end_date');
            
            $result = $this->finance_controller->get_transaction_summary($start_date, $end_date);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get transactions by type
     * Note: Requires implementation of get_transaction_by_type() in Finance Controller
     */
    public function get_transactions_by_type($request) {
        try {
            // Note: Controller chưa có method get_transaction_by_type
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get contract transactions
     */
    public function get_contract_transactions($request) {
        try {
            $contract_id = absint($request['id']);
            
            $result = $this->finance_controller->get_contract_transactions($contract_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get overdue contracts
     */
    public function get_overdue_contracts() {
        try {
            $result = $this->finance_controller->get_overdue_contracts();
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
    private function check_view_reports_permission() {
        return current_user_can('mb_view_financial_reports');
    }
} 
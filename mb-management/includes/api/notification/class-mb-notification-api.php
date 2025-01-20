<?php

/**
 * Notification Management API endpoints
 */
class MB_Notification_API extends MB_API {
    private $notification_controller;

    public function __construct() {
        parent::__construct();
        $this->notification_controller = new MB_Notification_Controller();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get notifications
        register_rest_route(
            $this->namespace,
            '/notifications',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_notifications'),
                'permission_callback' => array($this, 'check_view_notifications_permission'),
            )
        );

        // Mark as read
        register_rest_route(
            $this->namespace,
            '/notifications/(?P<id>\d+)',
            array(
                array(
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => array($this, 'mark_as_read'),
                    'permission_callback' => array($this, 'check_edit_notifications_permission'),
                ),
                array(
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => array($this, 'delete_notification'),
                    'permission_callback' => array($this, 'check_edit_notifications_permission'),
                )
            )
        );
    }

    /**
     * Get notifications
     */
    public function get_notifications($request) {
        try {
            $unread_only = $request->get_param('unread_only') === 'true';
            $result = $this->notification_controller->get_user_notifications(
                get_current_user_id(),
                $unread_only
            );

            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Mark notification as read
     */
    public function mark_as_read($request) {
        try {
            $notification_id = absint($request['id']);
            
            $result = $this->notification_controller->mark_as_read($notification_id);
            if (!$result['success']) {
                return $this->error_response($result['message']);
            }

            return $this->success_response($result['data']);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Delete notification
     */
    public function delete_notification($request) {
        try {
            // Note: Controller chưa có method delete_notification
            // Cần bổ sung vào controller
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_notifications_permission() {
        return current_user_can('mb_view_notifications');
    }

    private function check_edit_notifications_permission() {
        return current_user_can('mb_edit_notifications');
    }
} 
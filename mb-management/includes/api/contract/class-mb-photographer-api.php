<?php

/**
 * Photographer Management API endpoints
 */
class MB_Photographer_API extends MB_API {
    public function __construct() {
        parent::__construct();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get photographer schedule
        register_rest_route(
            $this->namespace,
            '/photographers/(?P<id>\d+)/schedule',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_schedule'),
                'permission_callback' => array($this, 'check_view_schedule_permission'),
            )
        );

        // Get all photographers
        register_rest_route(
            $this->namespace,
            '/photographers',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_photographers'),
                'permission_callback' => array($this, 'check_view_photographers_permission'),
            )
        );
    }

    /**
     * Get photographer schedule
     */
    public function get_schedule($request) {
        try {
            $photographer_id = absint($request['id']);
            $date = $request->get_param('date');

            // Validate date
            if (empty($date) || !strtotime($date)) {
                return $this->error_response('Invalid date format');
            }

            // Note: Controller chưa có method get_photographer_schedule
            // Cần bổ sung vào controller theo function-controllers.md
            return $this->error_response('Method not implemented');
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Get all photographers
     */
    public function get_photographers($request) {
        try {
            // Get users with photographer roles
            $args = array(
                'role__in' => array('photo-wedding', 'photo-pre-wedding'),
                'orderby' => 'display_name',
                'order' => 'ASC'
            );

            $photographers = get_users($args);
            $data = array();

            foreach ($photographers as $photographer) {
                $data[] = array(
                    'id' => $photographer->ID,
                    'name' => $photographer->display_name,
                    'email' => $photographer->user_email,
                    'role' => $photographer->roles[0],
                    'avatar' => get_avatar_url($photographer->ID)
                );
            }

            return $this->success_response($data);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_schedule_permission() {
        return current_user_can('mb_view_photographer_schedule');
    }

    private function check_view_photographers_permission() {
        return current_user_can('mb_view_photographers');
    }

    /**
     * Validate schedule data
     */
    private function validate_schedule_data($data) {
        if (empty($data['date']) || !strtotime($data['date'])) {
            return new WP_Error('invalid_date', 'Invalid date format');
        }

        return $this->sanitize_input($data, array(
            'date' => 'date',
            'photographer_id' => 'int'
        ));
    }
} 
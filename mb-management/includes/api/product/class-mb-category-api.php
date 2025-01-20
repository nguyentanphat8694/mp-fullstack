<?php

/**
 * Product Category Management API endpoints
 */
class MB_Category_API extends MB_API {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Register routes
     */
    public function register_routes() {
        // Get categories
        register_rest_route(
            $this->namespace,
            '/categories',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_categories'),
                'permission_callback' => array($this, 'check_view_categories_permission'),
            )
        );
    }

    /**
     * Get categories
     */
    public function get_categories() {
        try {
            // Return predefined categories from database schema
            $categories = array(
                array(
                    'id' => 'wedding_dress',
                    'name' => 'Wedding Dress',
                    'description' => 'Wedding dresses and related items'
                ),
                array(
                    'id' => 'vest',
                    'name' => 'Vest',
                    'description' => 'Vests and suits'
                ),
                array(
                    'id' => 'accessories',
                    'name' => 'Accessories',
                    'description' => 'Wedding accessories'
                ),
                array(
                    'id' => 'ao_dai',
                    'name' => 'Áo Dài',
                    'description' => 'Traditional Vietnamese dress'
                )
            );

            return $this->success_response($categories);
        } catch (Exception $e) {
            return $this->error_response($e->getMessage());
        }
    }

    /**
     * Permission checks
     */
    private function check_view_categories_permission() {
        return current_user_can('mb_view_products');
    }
} 
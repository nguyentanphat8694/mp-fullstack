<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_App_Auth {
    public function init() {
        add_filter('jwt_auth_token_before_dispatch', [$this, 'add_user_role_to_token'], 10, 2);
    }

    /**
     * Add user role to JWT token response
     *
     * @param array $data Response data
     * @param WP_User $user WordPress user object
     * @return array Modified response data
     */
    public function add_user_role_to_token($data, $user) {
        // Get user roles
        $roles = $user->roles;

        // Get first role as primary role
        $primary_role = !empty($roles) ? $roles[0] : '';

        // Add roles to response
        $data['roles'] = $roles;
        $data['primary_role'] = $primary_role;

        // Add capabilities
        $data['capabilities'] = array_keys(array_filter($user->allcaps));

        return $data;
    }
}
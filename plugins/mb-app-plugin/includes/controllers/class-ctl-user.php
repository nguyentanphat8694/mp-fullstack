<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_User_Controller {
    public function create_user($data) {
        try {
            // Validate required fields
            if (empty($data['username']) || empty($data['password']) || empty($data['email']) || empty($data['role']) || empty($data['last_name']) || empty($data['first_name'])) {
                return new WP_Error('missing_required_fields', 'Missing required fields');
            }

            // Validate role
            $valid_roles = array('manager', 'accountant', 'telesale', 'facebook', 'sale', 'photo_wedding', 'photo_pre_wedding', 'tailor');
            if (!in_array($data['role'], $valid_roles)) {
                return new WP_Error('invalid_role', 'Invalid role specified');
            }

            // Create user
            $userdata = array(
                'user_login' => sanitize_user($data['username']),
                'user_pass' => $data['password'],
                'user_email' => sanitize_email($data['email']),
                'role' => $data['role'],
                'last_name' => sanitize_text_field($data['last_name']),
                'first_name' => sanitize_text_field($data['first_name']),
                'display_name' => sanitize_text_field($data['last_name']) . ' ' . sanitize_text_field($data['first_name'])
            );

            return wp_insert_user($userdata);
        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_user($user_id) {
        try {
            $user = get_user_by('id', $user_id);
            if (!$user) {
                return new WP_Error('not_found', 'User not found');
            }

            return array(
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->roles[0],
                'created_at' => $user->user_registered
            );
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_user($user_id, $data) {
        try {
            // Check if user exists
            $user = get_user_by('id', $user_id);
            if (!$user) {
                return new WP_Error('not_found', 'User not found');
            }

            $userdata = array('ID' => $user_id);

            // Update fields if provided
            if (!empty($data['email'])) {
                $userdata['user_email'] = sanitize_email($data['email']);
            }
            if (!empty($data['password'])) {
                $userdata['user_pass'] = $data['password'];
            }

            // Handle first_name and last_name
            $update_display_name = false;
            $first_name = $user->first_name;
            $last_name = $user->last_name;

            if (!empty($data['first_name'])) {
                $userdata['first_name'] = sanitize_text_field($data['first_name']);
                $first_name = $userdata['first_name'];
                $update_display_name = true;
            }
            if (!empty($data['last_name'])) {
                $userdata['last_name'] = sanitize_text_field($data['last_name']);
                $last_name = $userdata['last_name'];
                $update_display_name = true;
            }

            // Update display_name if first_name or last_name changed
            if ($update_display_name) {
                $userdata['display_name'] = trim($last_name . ' ' . $first_name);
            }

            // Update role if provided
            if (!empty($data['role'])) {
                $valid_roles = array('manager', 'accountant', 'telesale', 'facebook', 'sale', 'photo_wedding', 'photo_pre_wedding', 'tailor');
                if (!in_array($data['role'], $valid_roles)) {
                    return new WP_Error('invalid_role', 'Invalid role specified');
                }
                $user->set_role($data['role']);
            }

            $result = wp_update_user($userdata);
            if (is_wp_error($result)) {
                return $result;
            }

            return $this->get_user($user_id);
        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_user($user_id) {
        try {
            if (!get_user_by('id', $user_id)) {
                return new WP_Error('not_found', 'User not found');
            }

            $result = wp_delete_user($user_id);
            if (!$result) {
                return new WP_Error('delete_error', 'Failed to delete user');
            }

            return true;
        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }

    public function get_users($args = array()) {
        try {
            global $wpdb;

            // Default arguments
            $defaults = array(
                'search' => '',
                'role' => '',
                'orderby' => 'user_registered',
                'order' => 'DESC',
                'limit' => 20,
                'offset' => 0
            );

            // Parse incoming args with defaults
            $args = wp_parse_args($args, $defaults);

            // Build query parts
            $where = array('1=1');
            $values = array();

            // Handle search
            if (!empty($args['search'])) {
                $search_term = '%' . $wpdb->esc_like($args['search']) . '%';
                $where[] = "(u.display_name LIKE %s OR u.first_name LIKE %s OR u.last_name LIKE %s)";
                $values[] = $search_term;
                $values[] = $search_term;
                $values[] = $search_term;
            }

            // Handle role filter
            if (!empty($args['role'])) {
                $where[] = "um.meta_value LIKE %s";
                $values[] = '%' . $wpdb->esc_like($args['role']) . '%';
            }

            // Build WHERE clause
            $where = implode(' AND ', $where);

            // Get total records for pagination
            $count_query = "SELECT COUNT(DISTINCT u.ID) 
                FROM {$wpdb->users} u
                LEFT JOIN {$wpdb->usermeta} um ON u.ID = um.user_id AND um.meta_key = '{$wpdb->prefix}capabilities'
                WHERE {$where}";
            $total_items = $wpdb->get_var($wpdb->prepare($count_query, $values));

            // Handle orderby
            $allowed_orderby = array(
                'user_registered' => 'u.user_registered',
                'display_name' => 'u.display_name',
                'user_login' => 'u.user_login'
            );
            $orderby = isset($allowed_orderby[$args['orderby']]) ? $allowed_orderby[$args['orderby']] : 'u.user_registered';
            
            // Handle order
            $order = strtoupper($args['order']) === 'ASC' ? 'ASC' : 'DESC';

            // Build final query
            $query = $wpdb->prepare(
                "SELECT DISTINCT 
                    u.ID,
                    u.user_login as username,
                    u.user_email as email,
                    u.display_name as display_name,
                    u.user_registered as created_at
                FROM {$wpdb->users} u
                LEFT JOIN {$wpdb->usermeta} um ON u.ID = um.user_id AND um.meta_key = '{$wpdb->prefix}capabilities'
                WHERE {$where}
                ORDER BY {$orderby} {$order}
                LIMIT %d OFFSET %d",
                array_merge(
                    $values,
                    array($args['limit'], $args['offset'])
                )
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array(
                'data' => array_map(function($row) {
                    return array(
                        'id' => (int)$row->ID,
                        'username' => $row->username,
                        'email' => $row->email,
                        'display_name' => $row->display_name,
                        'created_at' => $row->created_at
                    );
                }, $results),
                'total_data' => (int)$total_items
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_users_by_roles($roles) {
        try {
            global $wpdb;

            // Convert single role to array if needed
            if (!is_array($roles)) {
                $roles = array($roles);
            }

            // Sanitize roles
            $roles = array_map('sanitize_text_field', $roles);

            // Build role conditions
            $role_conditions = array();
            $values = array();

            foreach ($roles as $role) {
                $role_conditions[] = "um.meta_value LIKE %s";
                $values[] = '%' . $wpdb->esc_like($role) . '%';
            }

            $role_where = implode(' OR ', $role_conditions);

            // Build query
            $query = $wpdb->prepare(
                "SELECT DISTINCT 
                    u.ID as id,
                    u.display_name
                FROM {$wpdb->users} u
                JOIN {$wpdb->usermeta} um ON u.ID = um.user_id 
                WHERE um.meta_key = '{$wpdb->prefix}capabilities'
                AND ({$role_where})
                ORDER BY u.display_name ASC",
                $values
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array_map(function($row) {
                return array(
                    'id' => (int)$row->id,
                    'display_name' => $row->display_name
                );
            }, $results);

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

}

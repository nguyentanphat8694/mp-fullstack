<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_User_Controller {
    public function create_user($data) {
        try {
            // Validate required fields
            if (empty($data['username']) || empty($data['password']) || empty($data['email']) || empty($data['role'])) {
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
                'role' => $data['role']
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
                'display_name' => $user->display_name,
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
            if (!empty($data['display_name'])) {
                $userdata['display_name'] = sanitize_text_field($data['display_name']);
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

    public function get_users_by_role($role) {
        try {
            $valid_roles = array('manager', 'accountant', 'telesale', 'facebook', 'sale', 'photo_wedding', 'photo_pre_wedding', 'tailor');
            if (!in_array($role, $valid_roles)) {
                return new WP_Error('invalid_role', 'Invalid role specified');
            }

            $users = get_users(array('role' => $role));
            return array_map(function($user) {
                return array(
                    'id' => $user->ID,
                    'display_name' => $user->display_name
                );
            }, $users);
        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }
}

<?php
class MB_User_Controller {
    private $logger;

    public function __construct() {
        $this->logger = new MB_Logger();
    }

    /**
     * Lấy thông tin user hiện tại
     */
    public function get_current_user() {
        $user = wp_get_current_user();
        if (!$user->ID) {
            return new WP_Error('not_logged_in', 'Bạn chưa đăng nhập.');
        }

        return [
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'roles' => $user->roles,
            'capabilities' => $user->allcaps
        ];
    }

    /**
     * Lấy danh sách nhân viên theo role
     */
    public function get_users_by_role($role) {
        if (!current_user_can('list_users')) {
            return new WP_Error('forbidden', 'Bạn không có quyền xem danh sách nhân viên.');
        }

        $args = [
            'role' => $role,
            'orderby' => 'display_name',
            'fields' => ['ID', 'user_login', 'user_email', 'display_name']
        ];

        return get_users($args);
    }

    /**
     * Cập nhật thông tin cá nhân
     */
    public function update_profile($user_id, $data) {
        // Chỉ admin hoặc chính user đó mới được cập nhật
        if (!current_user_can('edit_user', $user_id) && get_current_user_id() != $user_id) {
            return new WP_Error('forbidden', 'Bạn không có quyền cập nhật thông tin này.');
        }

        $userdata = [
            'ID' => $user_id
        ];

        // Cập nhật các trường được phép
        $allowed_fields = ['user_email', 'display_name', 'user_pass'];
        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $userdata[$field] = $data[$field];
            }
        }

        $result = wp_update_user($userdata);
        if (is_wp_error($result)) {
            $this->logger->error("Failed to update user profile: " . $result->get_error_message());
            return $result;
        }

        return true;
    }
} 
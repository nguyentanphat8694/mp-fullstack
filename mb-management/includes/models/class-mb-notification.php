<?php
class MB_Notification extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_notifications';
        $this->fillable = [
            'user_id',
            'type',
            'title',
            'content',
            'read_at',
            'created_at'
        ];
        $this->required_fields = [
            'user_id',
            'type',
            'title',
            'content'
        ];
        $this->datetime_fields = ['read_at', 'created_at'];
    }

    /**
     * Lấy danh sách thông báo của user
     */
    public function get_user_notifications($user_id = null, $unread_only = false) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        $args = [
            'where' => ['user_id' => $user_id],
            'orderby' => 'created_at',
            'order' => 'DESC'
        ];

        if ($unread_only) {
            $args['where']['read_at'] = null;
        }

        return $this->get_all($args);
    }

    /**
     * Đánh dấu thông báo đã đọc
     */
    public function mark_as_read($id) {
        $notification = $this->get($id);
        if (is_wp_error($notification)) {
            return $notification;
        }

        // Chỉ user được gửi thông báo mới có thể đánh dấu đã đọc
        if ($notification->user_id != get_current_user_id()) {
            return new WP_Error('forbidden', 'Bạn không có quyền đánh dấu thông báo này.');
        }

        return $this->update($id, [
            'read_at' => current_time('mysql')
        ]);
    }

    /**
     * Đánh dấu tất cả thông báo của user đã đọc
     */
    public function mark_all_as_read($user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        try {
            global $wpdb;
            $query = $wpdb->prepare(
                "UPDATE {$this->table_name} 
                SET read_at = %s 
                WHERE user_id = %d 
                AND read_at IS NULL",
                current_time('mysql'),
                $user_id
            );

            return $wpdb->query($query);
        } catch (Exception $e) {
            $this->logger->error("Failed to mark all notifications as read: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể cập nhật trạng thái thông báo.');
        }
    }

    /**
     * Đếm số thông báo chưa đọc
     */
    public function count_unread($user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        try {
            global $wpdb;
            $query = $wpdb->prepare(
                "SELECT COUNT(*) FROM {$this->table_name} 
                WHERE user_id = %d AND read_at IS NULL",
                $user_id
            );

            return $wpdb->get_var($query);
        } catch (Exception $e) {
            $this->logger->error("Failed to count unread notifications: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể đếm thông báo chưa đọc.');
        }
    }
} 
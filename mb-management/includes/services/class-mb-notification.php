<?php
class MB_Notification_Service {
    private $logger;

    public function __construct() {
        $this->logger = new MB_Logger();
    }

    public function create_notification($user_id, $type, $title, $content) {
        global $wpdb;
        
        try {
            $result = $wpdb->insert('mb_notifications', [
                'user_id' => $user_id,
                'type' => $type,
                'title' => $title,
                'content' => $content,
                'created_at' => current_time('mysql')
            ]);

            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }

            $this->send_notification($user_id, $title, $content);
            return $wpdb->insert_id;
        } catch (Exception $e) {
            $this->logger->error('Failed to create notification: ' . $e->getMessage());
            return false;
        }
    }

    public function send_notification($user_id, $title, $content) {
        // Gửi thông báo qua email
        $user = get_user_by('ID', $user_id);
        if ($user) {
            wp_mail($user->user_email, $title, $content);
        }

        // Có thể thêm các kênh thông báo khác: push notification, SMS...
    }

    public function mark_as_read($notification_id, $user_id) {
        global $wpdb;
        
        try {
            return $wpdb->update(
                'mb_notifications',
                ['read_at' => current_time('mysql')],
                ['id' => $notification_id, 'user_id' => $user_id]
            );
        } catch (Exception $e) {
            $this->logger->error('Failed to mark notification as read: ' . $e->getMessage());
            return false;
        }
    }
} 
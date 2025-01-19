<?php
class MB_Notification_Controller {
    private $notification_model;

    public function __construct() {
        $this->notification_model = new MB_Notification();
    }

    /**
     * Lấy danh sách thông báo của user
     */
    public function get_user_notifications($user_id = null, $unread_only = false) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }
        
        $result = $this->notification_model->get_user_notifications($user_id, $unread_only);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'data' => $result,
            'unread_count' => $this->notification_model->count_unread($user_id)
        ];
    }

    /**
     * Đánh dấu thông báo đã đọc
     */
    public function mark_as_read($notification_id) {
        $result = $this->notification_model->mark_as_read($notification_id);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Đã đánh dấu thông báo là đã đọc'
        ];
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     */
    public function mark_all_as_read($user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        $result = $this->notification_model->mark_all_as_read($user_id);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Đã đánh dấu tất cả thông báo là đã đọc'
        ];
    }

    /**
     * Tạo thông báo cho các sự kiện cụ thể
     */
    public function create_event_notification($event_type, $data) {
        $result = null;
        switch ($event_type) {
            case 'task_overdue':
                $result = $this->notification_model->create([
                    'user_id' => $data['user_id'],
                    'type' => 'task_overdue',
                    'title' => 'Task quá hạn',
                    'content' => "Task '{$data['task_title']}' đã quá hạn",
                    'created_at' => current_time('mysql')
                ]);
                break;

            case 'appointment_reminder':
                $result = $this->notification_model->create([
                    'user_id' => $data['user_id'],
                    'type' => 'appointment_reminder',
                    'title' => 'Nhắc nhở lịch hẹn',
                    'content' => "Có lịch hẹn với khách hàng {$data['customer_name']} vào ngày mai",
                    'created_at' => current_time('mysql')
                ]);
                break;

            case 'contract_due':
                $result = $this->notification_model->create([
                    'user_id' => $data['user_id'],
                    'type' => 'contract_due',
                    'title' => 'Hợp đồng sắp đến hạn',
                    'content' => "Hợp đồng #{$data['contract_id']} sẽ đến hạn vào ngày mai",
                    'created_at' => current_time('mysql')
                ]);
                break;
        }

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Gửi thông báo theo role
     */
    public function create_role_notification($roles, $data) {
        $users = get_users(['role__in' => $roles]);
        $results = [];

        foreach ($users as $user) {
            $result = $this->notification_model->create([
                'user_id' => $user->ID,
                'type' => $data['type'],
                'title' => $data['title'],
                'content' => $data['content'],
                'created_at' => current_time('mysql')
            ]);

            if (is_wp_error($result)) {
                $results[] = [
                    'user_id' => $user->ID,
                    'success' => false,
                    'message' => $result->get_error_message()
                ];
            } else {
                $results[] = [
                    'user_id' => $user->ID,
                    'success' => true,
                    'data' => $result
                ];
            }
        }

        return [
            'success' => true,
            'data' => $results
        ];
    }
} 
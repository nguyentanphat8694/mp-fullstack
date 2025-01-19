<?php
class MB_Task_Comment extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_task_comments';
        $this->fillable = [
            'task_id',
            'comment',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'task_id',
            'comment',
            'created_by'
        ];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Override create để thêm kiểm tra quyền với task
     */
    public function create($data) {
        // Kiểm tra quyền với task
        $task = new MB_Task();
        $task_info = $task->get($data['task_id']);
        if (is_wp_error($task_info)) {
            return $task_info;
        }

        // Chỉ người được gán task, người tạo task và admin/manager mới có thể comment
        $current_user_id = get_current_user_id();
        if ($task_info->assigned_to != $current_user_id && 
            $task_info->created_by != $current_user_id && 
            !current_user_can('administrator') && 
            !current_user_can('manager')) {
            return new WP_Error('forbidden', 'Bạn không có quyền comment trong task này.');
        }

        $data['created_at'] = current_time('mysql');
        $result = parent::create($data);

        if (!is_wp_error($result)) {
            // Tạo thông báo cho người liên quan đến task
            $notification = new MB_Notification();
            $notify_users = array_unique([
                $task_info->assigned_to,
                $task_info->created_by
            ]);

            foreach ($notify_users as $user_id) {
                if ($user_id && $user_id != $current_user_id) {
                    $notification->create([
                        'user_id' => $user_id,
                        'type' => 'task_comment',
                        'title' => 'Có comment mới trong task',
                        'content' => "Task: {$task_info->title} có comment mới",
                        'created_at' => current_time('mysql')
                    ]);
                }
            }
        }

        return $result;
    }

    /**
     * Lấy danh sách comment của một task
     */
    public function get_task_comments($task_id) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT c.*, u.display_name as created_by_name
            FROM {$this->table_name} c
            LEFT JOIN {$wpdb->users} u ON c.created_by = u.ID
            WHERE c.task_id = %d
            ORDER BY c.created_at ASC",
            $task_id
        );

        return $wpdb->get_results($query);
    }
} 
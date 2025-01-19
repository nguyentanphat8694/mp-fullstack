<?php
class MB_Task extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_tasks';
        $this->fillable = [
            'title',
            'description',
            'assigned_to',
            'status',
            'due_date',
            'created_by',
            'created_at',
            'updated_at'
        ];
        $this->required_fields = [
            'title',
            'description',
            'due_date',
            'created_by'
        ];
        $this->enum_fields = ['status'];
        $this->enum_values = [
            'status' => ['pending', 'in_progress', 'completed']
        ];
        $this->datetime_fields = ['due_date', 'created_at', 'updated_at'];
    }

    /**
     * Lấy danh sách task được gán cho user
     */
    public function get_assigned_tasks($user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        return $this->get_all([
            'where' => ['assigned_to' => $user_id],
            'orderby' => 'due_date',
            'order' => 'ASC'
        ]);
    }

    /**
     * Lấy danh sách task quá hạn
     */
    public function get_overdue_tasks() {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        return $wpdb->get_results(
            "SELECT t.*, u.display_name as assigned_to_name 
            FROM {$this->table_name} t
            LEFT JOIN {$wpdb->users} u ON t.assigned_to = u.ID
            WHERE t.status != 'completed'
            AND t.due_date < NOW()"
        );
    }

    /**
     * Cập nhật trạng thái task
     */
    public function update_status($id, $status) {
        // Kiểm tra quyền cập nhật
        $task = $this->get($id);
        if (is_wp_error($task)) {
            return $task;
        }

        // Chỉ người được gán task hoặc người tạo task mới có thể cập nhật
        $current_user_id = get_current_user_id();
        if ($task->assigned_to != $current_user_id && 
            $task->created_by != $current_user_id && 
            !current_user_can('administrator') && 
            !current_user_can('manager')) {
            return new WP_Error('forbidden', 'Bạn không có quyền cập nhật trạng thái task này.');
        }

        return $this->update($id, [
            'status' => $status,
            'updated_at' => current_time('mysql')
        ]);
    }

    /**
     * Gán task cho nhân viên
     */
    public function assign_task($id, $user_id) {
        $permission = $this->check_permission('update');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Kiểm tra user tồn tại
        $user = get_user_by('ID', $user_id);
        if (!$user) {
            return new WP_Error('invalid_user', 'Người dùng không tồn tại.');
        }

        $result = $this->update($id, [
            'assigned_to' => $user_id,
            'updated_at' => current_time('mysql')
        ]);

        if (!is_wp_error($result)) {
            // Tạo thông báo cho người được gán
            $notification = new MB_Notification();
            $notification->create([
                'user_id' => $user_id,
                'type' => 'task_assigned',
                'title' => 'Bạn được gán một công việc mới',
                'content' => "Bạn được gán công việc: " . $this->get($id)->title,
                'created_at' => current_time('mysql')
            ]);
        }

        return $result;
    }
} 
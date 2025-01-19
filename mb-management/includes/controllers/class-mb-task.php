<?php
class MB_Task_Controller {
    private $task_model;
    private $task_comment_model;
    private $notification_model;

    public function __construct() {
        $this->task_model = new MB_Task();
        $this->task_comment_model = new MB_Task_Comment();
        $this->notification_model = new MB_Notification();
    }

    /**
     * Tạo task mới
     */
    public function create_task($data) {
        $result = $this->task_model->create($data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Thông báo cho người được gán
        if (!empty($data['assigned_to'])) {
            $this->notification_model->create([
                'user_id' => $data['assigned_to'],
                'type' => 'task_assigned',
                'title' => 'Bạn được gán công việc mới',
                'content' => "Bạn được gán công việc: {$data['title']}",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Cập nhật trạng thái task
     */
    public function update_status($task_id, $status) {
        $result = $this->task_model->update_status($task_id, $status);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Thông báo cho người tạo task
        $task = $this->task_model->get($task_id);
        $this->notification_model->create([
            'user_id' => $task->created_by,
            'type' => 'task_status_updated',
            'title' => 'Trạng thái công việc được cập nhật',
            'content' => "Công việc #{$task_id} đã được cập nhật sang trạng thái: $status",
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công'
        ];
    }

    /**
     * Thêm comment cho task
     */
    public function add_comment($task_id, $comment) {
        $result = $this->task_comment_model->create([
            'task_id' => $task_id,
            'comment' => $comment,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Thông báo cho người được gán task
        $task = $this->task_model->get($task_id);
        if ($task->assigned_to) {
            $this->notification_model->create([
                'user_id' => $task->assigned_to,
                'type' => 'task_comment_added',
                'title' => 'Có comment mới trong công việc',
                'content' => "Công việc #{$task_id} có comment mới",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'message' => 'Thêm comment thành công'
        ];
    }

    /**
     * Kiểm tra các task quá hạn
     */
    public function check_overdue_tasks() {
        $overdue_tasks = $this->task_model->get_overdue_tasks();
        foreach ($overdue_tasks as $task) {
            // Thông báo cho người được gán và người tạo
            $users = array_unique([$task->assigned_to, $task->created_by]);
            foreach ($users as $user_id) {
                $this->notification_model->create([
                    'user_id' => $user_id,
                    'type' => 'task_overdue',
                    'title' => 'Công việc quá hạn',
                    'content' => "Công việc #{$task->id} đã quá hạn nhưng chưa hoàn thành",
                    'created_at' => current_time('mysql')
                ]);
            }
        }
    }

    /**
     * Lấy danh sách task được gán
     */
    public function get_assigned_tasks($user_id) {
        $result = $this->task_model->get_assigned_tasks($user_id);
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
     * Lấy comments của task
     */
    public function get_task_comments($task_id) {
        $result = $this->task_comment_model->get_task_comments($task_id);
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
     * Gán task cho nhân viên
     */
    public function assign_task($task_id, $user_id) {
        $result = $this->task_model->assign_task($task_id, $user_id);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Gán công việc thành công'
        ];
    }
} 
<?php
class MB_Reward_Controller {
    private $reward_model;
    private $notification_model;
    private $attendance_model;

    public function __construct() {
        $this->reward_model = new MB_Reward();
        $this->notification_model = new MB_Notification();
        $this->attendance_model = new MB_Attendance();
    }

    /**
     * Lấy danh sách thưởng/phạt
     */
    public function get_rewards($user_id, $start_date = null, $end_date = null, $status = null) {
        $start_date = $start_date ?: date('Y-m-01');
        $end_date = $end_date ?: date('Y-m-t');

        $result = $this->reward_model->get_user_rewards($user_id, $start_date, $end_date, $status);
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
     * Tạo thưởng/phạt mới với thông báo
     */
    public function create_reward($data) {
        if (!current_user_can('administrator') && !current_user_can('manager')) {
            return [
                'success' => false,
                'message' => 'Bạn không có quyền tạo thưởng/phạt.'
            ];
        }

        $result = $this->reward_model->create($data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Tạo thông báo cho nhân viên
        $this->notification_model->create([
            'user_id' => $data['user_id'],
            'type' => 'reward_created',
            'title' => $data['type'] === 'reward' ? 'Bạn có khoản thưởng mới' : 'Bạn có khoản phạt mới',
            'content' => "Số tiền: {$data['amount']} - Lý do: {$data['reason']}",
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Duyệt thưởng/phạt
     * Yêu cầu: mb_approve_rewards
     */
    public function approve_reward($id, $status) {
        $result = $this->reward_model->approve($id, get_current_user_id(), $status);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Lấy thông tin reward để tạo thông báo
        $reward = $this->reward_model->get($id);
        $this->notification_model->create([
            'user_id' => $reward->user_id,
            'type' => 'reward_' . $status,
            'title' => 'Thưởng/phạt đã được ' . ($status === 'approved' ? 'duyệt' : 'từ chối'),
            'content' => "Số tiền: {$reward->amount} - Lý do: {$reward->reason}",
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công'
        ];
    }

    /**
     * Tính tổng thưởng/phạt
     */
    public function calculate_total_rewards($user_id, $start_date = null, $end_date = null) {
        $start_date = $start_date ?: date('Y-m-01');
        $end_date = $end_date ?: date('Y-m-t');

        $result = $this->reward_model->calculate_total($user_id, $start_date, $end_date);
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
     * Tổng hợp thưởng phạt và chấm công theo tháng
     */
    public function get_monthly_summary($user_id, $month, $year) {
        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime("$year-$month-01"));

        // Lấy thông tin chấm công
        $attendance = $this->attendance_model->get_user_attendance(
            $user_id,
            $start_date,
            $end_date
        );

        // Lấy thông tin thưởng phạt
        $rewards = $this->reward_model->calculate_total(
            $user_id,
            $start_date,
            $end_date
        );

        return [
            'success' => true,
            'data' => [
                'attendance' => $attendance,
                'rewards' => $rewards,
                'total_working_days' => count($attendance),
                'total_amount' => (isset($rewards->total_reward) ? $rewards->total_reward : 0) - (isset($rewards->total_penalty) ? $rewards->total_penalty : 0)
            ]
        ];
    }
} 
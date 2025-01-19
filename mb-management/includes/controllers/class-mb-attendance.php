<?php
class MB_Attendance_Controller {
    private $attendance_model;
    private $reward_model;

    public function __construct() {
        $this->attendance_model = new MB_Attendance();
        $this->reward_model = new MB_Reward();
    }

    /**
     * Check in - thêm kiểm tra thời gian và tạo penalty nếu đi muộn
     */
    public function check_in($data) {
        // Validate WiFi và IP
        if (empty($data['wifi_name']) || empty($data['ip_address'])) {
            return [
                'success' => false,
                'message' => 'Thiếu thông tin WiFi hoặc IP.'
            ];
        }

        $check_in_data = [
            'user_id' => get_current_user_id(),
            'check_in' => current_time('mysql'),
            'wifi_name' => sanitize_text_field($data['wifi_name']),
            'ip_address' => sanitize_text_field($data['ip_address'])
        ];

        $result = $this->attendance_model->check_in($check_in_data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Kiểm tra đi muộn và tạo penalty
        $check_in_time = strtotime($check_in_data['check_in']);
        if (date('H:i', $check_in_time) > '08:30') {
            $this->reward_model->create([
                'user_id' => get_current_user_id(),
                'type' => 'penalty',
                'amount' => 50000, // Số tiền phạt đi muộn
                'reason' => 'Đi muộn ' . date('d/m/Y H:i', $check_in_time),
                'created_by' => get_current_user_id()
            ]);
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Check out - thêm kiểm tra về sớm và tạo penalty
     */
    public function check_out() {
        $result = $this->attendance_model->check_out(get_current_user_id());
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Kiểm tra về sớm và tạo penalty
        $check_out_time = strtotime(current_time('mysql'));
        if (date('H:i', $check_out_time) < '17:30') {
            $this->reward_model->create([
                'user_id' => get_current_user_id(),
                'type' => 'penalty',
                'amount' => 50000, // Số tiền phạt về sớm
                'reason' => 'Về sớm ' . date('d/m/Y H:i', $check_out_time),
                'created_by' => get_current_user_id()
            ]);
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Lấy báo cáo chấm công theo tháng
     */
    public function get_monthly_report($user_id, $month, $year) {
        $start_date = date('Y-m-01', strtotime("$year-$month-01"));
        $end_date = date('Y-m-t', strtotime("$year-$month-01"));

        $attendance_records = $this->attendance_model->get_user_attendance(
            $user_id,
            $start_date,
            $end_date
        );

        if (is_wp_error($attendance_records)) {
            return $attendance_records;
        }

        // Tính toán thống kê
        $stats = [
            'total_days' => 0,
            'on_time' => 0,
            'late' => 0,
            'early_leave' => 0,
            'records' => $attendance_records
        ];

        foreach ($attendance_records as $record) {
            $stats['total_days']++;
            
            // Kiểm tra đi muộn (sau 8:30)
            $check_in_time = strtotime($record->check_in);
            if (date('H:i', $check_in_time) > '08:30') {
                $stats['late']++;
            } else {
                $stats['on_time']++;
            }

            // Kiểm tra về sớm (trước 17:30)
            if ($record->check_out) {
                $check_out_time = strtotime($record->check_out);
                if (date('H:i', $check_out_time) < '17:30') {
                    $stats['early_leave']++;
                }
            }
        }

        return $stats;
    }

    /**
     * Lấy danh sách chấm công của phòng ban theo ngày
     */
    public function get_department_attendance($department_role, $date) {
        // Lấy danh sách nhân viên theo role
        $users = get_users(['role' => $department_role]);
        $attendance_list = [];

        foreach ($users as $user) {
            $attendance = $this->attendance_model->get_user_attendance(
                $user->ID,
                $date,
                $date
            );

            $attendance_list[] = [
                'user_id' => $user->ID,
                'display_name' => $user->display_name,
                'attendance' => $attendance ? $attendance[0] : null
            ];
        }

        return $attendance_list;
    }
} 
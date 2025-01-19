<?php
class MB_Attendance extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_attendance';
        $this->fillable = [
            'user_id',
            'check_in',
            'check_out',
            'ip_address',
            'wifi_name',
            'created_at'
        ];
        $this->required_fields = [
            'user_id',
            'check_in',
            'ip_address',
            'wifi_name'
        ];
        $this->datetime_fields = [
            'check_in',
            'check_out',
            'created_at'
        ];
    }

    /**
     * Lấy thông tin chấm công của user trong khoảng thời gian
     */
    public function get_user_attendance($user_id, $start_date, $end_date) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT * FROM {$this->table_name} 
            WHERE user_id = %d 
            AND DATE(check_in) BETWEEN %s AND %s 
            ORDER BY check_in DESC",
            $user_id,
            $start_date,
            $end_date
        );

        return $wpdb->get_results($query);
    }

    /**
     * Kiểm tra user đã check in trong ngày chưa
     */
    public function get_today_attendance($user_id) {
        global $wpdb;
        $today = date('Y-m-d');
        
        $query = $wpdb->prepare(
            "SELECT * FROM {$this->table_name} 
            WHERE user_id = %d 
            AND DATE(check_in) = %s",
            $user_id,
            $today
        );

        return $wpdb->get_row($query);
    }

    /**
     * Check in
     */
    public function check_in($data) {
        // Kiểm tra đã check in chưa
        $existing = $this->get_today_attendance($data['user_id']);
        if ($existing) {
            return new WP_Error('already_checked_in', 'Bạn đã check in hôm nay rồi.');
        }

        // Validate WiFi
        $wifi_service = new MB_Wifi_Service();
        $wifi_validation = $wifi_service->validate_wifi($data['wifi_name'], $data['ip_address']);
        if (is_wp_error($wifi_validation)) {
            return $wifi_validation;
        }

        $data['created_at'] = current_time('mysql');
        return $this->create($data);
    }

    /**
     * Check out
     */
    public function check_out($user_id) {
        $existing = $this->get_today_attendance($user_id);
        if (!$existing) {
            return new WP_Error('not_checked_in', 'Bạn chưa check in hôm nay.');
        }

        if ($existing->check_out) {
            return new WP_Error('already_checked_out', 'Bạn đã check out hôm nay rồi.');
        }

        return $this->update($existing->id, [
            'check_out' => current_time('mysql')
        ]);
    }
} 
<?php
class MB_Reward extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_rewards';
        $this->fillable = [
            'user_id',
            'type',
            'amount',
            'reason',
            'status',
            'approved_by',
            'approved_at',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'user_id',
            'type',
            'amount',
            'reason',
            'created_by'
        ];
        $this->decimal_fields = ['amount'];
        $this->datetime_fields = ['approved_at', 'created_at'];
        $this->enum_fields = ['type', 'status'];
        $this->enum_values = [
            'type' => ['reward', 'penalty'],
            'status' => ['pending', 'approved', 'rejected']
        ];
    }

    /**
     * Lấy thưởng phạt của user trong khoảng thời gian
     */
    public function get_user_rewards($user_id, $start_date, $end_date, $status = null) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = "SELECT r.*, 
                    c.display_name as created_by_name,
                    a.display_name as approved_by_name
                 FROM {$this->table_name} r
                 LEFT JOIN {$wpdb->users} c ON r.created_by = c.ID
                 LEFT JOIN {$wpdb->users} a ON r.approved_by = a.ID
                 WHERE r.user_id = %d 
                 AND DATE(r.created_at) BETWEEN %s AND %s";
        
        $params = [$user_id, $start_date, $end_date];

        if ($status) {
            $query .= " AND r.status = %s";
            $params[] = $status;
        }

        $query .= " ORDER BY r.created_at DESC";
        
        return $wpdb->get_results($wpdb->prepare($query, $params));
    }

    /**
     * Tạo thưởng/phạt mới
     */
    public function create($data) {
        $data['status'] = 'pending';
        $data['created_at'] = current_time('mysql');
        return parent::create($data);
    }

    /**
     * Duyệt thưởng/phạt
     */
    public function approve($id, $user_id, $status) {
        $permission = $this->check_permission('approve');
        if (is_wp_error($permission)) {
            return $permission;
        }

        if (!in_array($status, ['approved', 'rejected'])) {
            return new WP_Error('invalid_status', 'Trạng thái không hợp lệ.');
        }

        return $this->update($id, [
            'status' => $status,
            'approved_by' => $user_id,
            'approved_at' => current_time('mysql')
        ]);
    }

    /**
     * Tính tổng thưởng/phạt của user trong khoảng thời gian
     */
    public function calculate_total($user_id, $start_date, $end_date) {
        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT 
                SUM(CASE WHEN type = 'reward' THEN amount ELSE 0 END) as total_reward,
                SUM(CASE WHEN type = 'penalty' THEN amount ELSE 0 END) as total_penalty
            FROM {$this->table_name}
            WHERE user_id = %d 
            AND status = 'approved'
            AND DATE(created_at) BETWEEN %s AND %s",
            $user_id,
            $start_date,
            $end_date
        );

        return $wpdb->get_row($query);
    }
} 
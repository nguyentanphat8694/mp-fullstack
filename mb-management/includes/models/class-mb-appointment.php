<?php
class MB_Appointment extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_appointments';
        $this->fillable = [
            'customer_id',
            'appointment_date',
            'status',
            'assigned_to',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'customer_id',
            'appointment_date',
            'created_by'
        ];
        $this->datetime_fields = [
            'appointment_date',
            'created_at'
        ];
        $this->enum_fields = ['status'];
        $this->enum_values = [
            'status' => ['scheduled', 'completed', 'cancelled']
        ];
    }

    /**
     * Tạo lịch hẹn mới và thêm vào lịch sử khách hàng
     */
    public function create($data) {
        $data['created_at'] = current_time('mysql');
        $data['status'] = 'scheduled';

        $appointment_id = parent::create($data);
        if (is_wp_error($appointment_id)) {
            return $appointment_id;
        }

        // Thêm vào lịch sử khách hàng
        $customer_history = new MB_Customer_History();
        $history_data = [
            'customer_id' => $data['customer_id'],
            'action' => 'create_appointment',
            'note' => sprintf(
                'Đặt lịch hẹn ngày %s',
                wp_date('d/m/Y H:i', strtotime($data['appointment_date']))
            ),
            'created_by' => $data['created_by'],
            'created_at' => current_time('mysql')
        ];
        $customer_history->create($history_data);

        return $appointment_id;
    }

    /**
     * Cập nhật trạng thái lịch hẹn
     */
    public function update_status($id, $status, $note = '') {
        $result = $this->update($id, ['status' => $status]);
        if (is_wp_error($result)) {
            return $result;
        }

        // Lấy thông tin lịch hẹn
        $appointment = $this->get($id);
        if (is_wp_error($appointment)) {
            return $appointment;
        }

        // Thêm vào lịch sử khách hàng
        $customer_history = new MB_Customer_History();
        $history_data = [
            'customer_id' => $appointment->customer_id,
            'action' => 'update_appointment',
            'note' => sprintf(
                'Cập nhật trạng thái lịch hẹn thành: %s%s',
                $status,
                $note ? " - $note" : ''
            ),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ];
        return $customer_history->create($history_data);
    }

    /**
     * Phân công sale phụ trách lịch hẹn
     */
    public function assign_sale($id, $sale_id) {
        $result = $this->update($id, ['assigned_to' => $sale_id]);
        if (is_wp_error($result)) {
            return $result;
        }

        // Lấy thông tin lịch hẹn
        $appointment = $this->get($id);
        if (is_wp_error($appointment)) {
            return $appointment;
        }

        // Thêm vào lịch sử khách hàng
        $customer_history = new MB_Customer_History();
        $sale_user = get_userdata($sale_id);
        $history_data = [
            'customer_id' => $appointment->customer_id,
            'action' => 'assign_appointment',
            'note' => sprintf(
                'Phân công nhân viên sale %s phụ trách lịch hẹn',
                $sale_user->display_name
            ),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ];
        return $customer_history->create($history_data);
    }

    /**
     * Lấy danh sách lịch hẹn trong ngày của sale
     */
    public function get_today_appointments($sale_id = null) {
        $args = [
            'where' => [
                'status' => 'scheduled'
            ]
        ];

        if ($sale_id) {
            $args['where']['assigned_to'] = $sale_id;
        }

        // Thêm điều kiện ngày
        $today = wp_date('Y-m-d');
        $args['where_raw'] = "DATE(appointment_date) = '$today'";

        return $this->get_all($args);
    }

    /**
     * Lấy danh sách lịch hẹn chưa được phân công
     */
    public function get_unassigned_appointments() {
        return $this->get_all([
            'where' => [
                'status' => 'scheduled',
                'assigned_to' => null
            ]
        ]);
    }

    /**
     * Kiểm tra xem khách hàng đã có lịch hẹn trong ngày chưa
     */
    public function check_existing_appointment($customer_id, $appointment_date) {
        // Kiểm tra quyền xem lịch hẹn
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $date = wp_date('Y-m-d', strtotime($appointment_date));
        
        $query = $wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_name}
            WHERE customer_id = %d
            AND DATE(appointment_date) = %s
            AND status = 'scheduled'",
            $customer_id,
            $date
        );

        return (int) $wpdb->get_var($query) > 0;
    }
} 
<?php
class MB_Customer_Controller {
    private $customer_model;
    private $notification_model;
    private $customer_history_model;
    private $appointment_model;

    public function __construct() {
        $this->customer_model = new MB_Customer();
        $this->notification_model = new MB_Notification();
        $this->customer_history_model = new MB_Customer_History();
        $this->appointment_model = new MB_Appointment();
    }

    /**
     * Lấy danh sách khách hàng
     */
    public function get_customers($filters = []) {
        $result = $this->customer_model->get_all($filters);
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
     * Tạo khách hàng mới
     */
    public function create_customer($data) {
        $result = $this->customer_model->create($data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử tạo khách hàng
        $this->customer_history_model->create([
            'customer_id' => $result,
            'action' => 'create',
            'note' => 'Tạo khách hàng mới',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'data' => $this->customer_model->get($result)
        ];
    }

    /**
     * Phân công khách hàng
     */
    public function assign_customer($customer_id, $user_id) {
        // Sử dụng update thay vì assign vì không có method assign trong model
        $result = $this->customer_model->update($customer_id, [
            'assigned_to' => $user_id,
            'status' => 'contacted'
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử phân công
        $assigned_user = get_user_by('ID', $user_id);
        $this->customer_history_model->create([
            'customer_id' => $customer_id,
            'action' => 'assign',
            'note' => sprintf('Phân công cho nhân viên %s', $assigned_user->display_name),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        // Tạo thông báo cho nhân viên được phân công
        $this->notification_model->create([
            'user_id' => $user_id,
            'type' => 'customer_assigned',
            'title' => 'Bạn được phân công khách hàng mới',
            'content' => 'Vui lòng kiểm tra và liên hệ với khách hàng',
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Phân công khách hàng thành công'
        ];
    }

    /**
     * Cập nhật trạng thái khách hàng
     */
    public function update_customer_status($customer_id, $status, $note = '') {
        $result = $this->customer_model->update($customer_id, [
            'status' => $status,
            'updated_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử cập nhật trạng thái
        $this->customer_history_model->create([
            'customer_id' => $customer_id,
            'action' => 'update_status',
            'note' => sprintf('Cập nhật trạng thái thành %s. %s', $status, $note),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công'
        ];
    }

    /**
     * Lấy danh sách khách hàng được phân công
     */
    public function get_assigned_customers($user_id) {
        $result = $this->customer_model->get_all([
            'where' => ['assigned_to' => $user_id]
        ]);
        
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
     * Tạo lịch hẹn cho khách hàng
     */
    public function create_appointment($customer_id, $appointment_data) {
        // Validate appointment data
        if (empty($appointment_data['appointment_date'])) {
            return [
                'success' => false,
                'message' => 'Vui lòng nhập ngày hẹn'
            ];
        }

        $data = [
            'customer_id' => $customer_id,
            'appointment_date' => $appointment_data['appointment_date'],
            'status' => 'scheduled', // Theo enum trong schema: scheduled, completed, cancelled
            'assigned_to' => null, // Sẽ được cập nhật khi sale tiếp nhận
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ];

        $result = $this->appointment_model->create($data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử tạo lịch hẹn
        $this->customer_history_model->create([
            'customer_id' => $customer_id,
            'action' => 'create_appointment',
            'note' => sprintf('Tạo lịch hẹn ngày %s', 
                date('d/m/Y', strtotime($data['appointment_date']))
            ),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        // Cập nhật trạng thái khách hàng
        $this->customer_model->update($customer_id, [
            'status' => 'appointment',
            'updated_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Tạo lịch hẹn thành công',
            'data' => $result
        ];
    }

    /**
     * Lấy danh sách lịch hẹn theo ngày
     */
    public function get_appointments_by_date($date) {
        $result = $this->appointment_model->get_all([
            'where' => [
                'appointment_date' => $date,
                'status' => 'scheduled' // Chỉ lấy các lịch hẹn chưa hoàn thành
            ]
        ]);

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
     * Sale tiếp nhận khách hàng từ lịch hẹn
     */
    public function take_appointment($appointment_id) {
        // Lấy thông tin lịch hẹn
        $appointment = $this->appointment_model->get($appointment_id);
        if (is_wp_error($appointment)) {
            return [
                'success' => false,
                'message' => $appointment->get_error_message()
            ];
        }

        // Cập nhật trạng thái lịch hẹn
        $result = $this->appointment_model->update($appointment_id, [
            'status' => 'completed',
            'assigned_to' => get_current_user_id()
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử tiếp nhận khách
        $this->customer_history_model->create([
            'customer_id' => $appointment->customer_id,
            'action' => 'take_appointment',
            'note' => 'Tiếp nhận khách từ lịch hẹn',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        // Cập nhật trạng thái khách hàng
        $this->customer_model->update($appointment->customer_id, [
            'assigned_to' => get_current_user_id(),
            'status' => 'contacted',
            'updated_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Tiếp nhận khách hàng thành công'
        ];
    }
} 
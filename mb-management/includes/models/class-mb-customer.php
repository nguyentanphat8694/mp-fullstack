<?php
class MB_Customer extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_customers';
        $this->fillable = [
            'name',
            'phone',
            'source',
            'assigned_to',
            'status',
            'created_by',
            'created_at',
            'updated_at'
        ];
        $this->required_fields = [
            'name',
            'phone',
            'source',
            'created_by'
        ];
        $this->datetime_fields = [
            'created_at',
            'updated_at'
        ];
        $this->enum_fields = ['source', 'status'];
        $this->enum_values = [
            'source' => ['facebook', 'tiktok', 'youtube', 'walk_in'],
            'status' => ['new', 'contacted', 'appointment', 'contracted', 'completed']
        ];
    }

    /**
     * Tạo khách hàng mới
     */
    public function create($data) {
        $data['created_at'] = current_time('mysql');
        $data['updated_at'] = current_time('mysql');
        $data['status'] = 'new';

        $customer_id = parent::create($data);
        if (is_wp_error($customer_id)) {
            return $customer_id;
        }

//        // Tạo lịch sử
//        $history = new MB_Customer_History();
//        $history_data = [
//            'customer_id' => $customer_id,
//            'action' => 'create',
//            'note' => 'Tạo mới khách hàng',
//            'created_by' => $data['created_by'],
//            'created_at' => current_time('mysql')
//        ];
//        $history->create($history_data);

        return $customer_id;
    }

    /**
     * Cập nhật khách hàng với lịch sử
     */
    public function update($id, $data) {
        $old_data = $this->get($id);
        if (is_wp_error($old_data)) {
            return $old_data;
        }

        $data['updated_at'] = current_time('mysql');
        $result = parent::update($id, $data);
        if (is_wp_error($result)) {
            return $result;
        }

        // Tạo lịch sử cho các thay đổi
        $changes = [];
        foreach ($data as $key => $value) {
            if (isset($old_data->$key) && $old_data->$key !== $value) {
                $changes[] = "$key: {$old_data->$key} -> $value";
            }
        }

        if (!empty($changes)) {
            $history = new MB_Customer_History();
            $history_data = [
                'customer_id' => $id,
                'action' => 'update',
                'note' => 'Cập nhật thông tin: ' . implode(', ', $changes),
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            ];
            $history->create($history_data);
        }

        return true;
    }

    /**
     * Phân công khách hàng cho nhân viên
     */
    public function assign($id, $assigned_to) {
        return $this->update($id, [
            'assigned_to' => $assigned_to,
            'status' => 'contacted'
        ]);
    }

    /**
     * Lấy danh sách khách hàng được phân công cho nhân viên
     */
    public function get_assigned_customers($user_id) {
        return $this->get_all([
            'where' => ['assigned_to' => $user_id]
        ]);
    }

    /**
     * Cập nhật trạng thái khách hàng
     */
    public function update_status($id, $status, $note = '') {
        $result = $this->update($id, ['status' => $status]);
        if (is_wp_error($result)) {
            return $result;
        }

        // Tạo lịch sử
        $history = new MB_Customer_History();
        $history_data = [
            'customer_id' => $id,
            'action' => 'status_change',
            'note' => "Thay đổi trạng thái sang: $status" . ($note ? " - $note" : ''),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ];
        return $history->create($history_data);
    }
} 
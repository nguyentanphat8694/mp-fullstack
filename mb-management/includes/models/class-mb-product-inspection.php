<?php
class MB_Product_Inspection extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_product_inspections';
        $this->fillable = [
            'contract_id',
            'product_id',
            'status',
            'condition_report',
            'issues',
            'recommendations',
            'created_by',
            'created_at',
            'checked_by',
            'checked_at',
            'approved_by',
            'approved_at',
            'notes'
        ];
        $this->required_fields = [
            'contract_id',
            'product_id',
            'condition_report',
            'created_by'
        ];
        $this->enum_fields = ['status'];
        $this->enum_values = [
            'status' => ['pending', 'checked', 'approved']
        ];
        $this->datetime_fields = ['created_at', 'checked_at', 'approved_at'];
    }

    /**
     * Kiểm tra và cập nhật trạng thái inspection
     */
    public function check_inspection($id, $data) {
        $permission = $this->check_permission('approve');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Kiểm tra inspection tồn tại
        $inspection = $this->get($id);
        if (is_wp_error($inspection)) {
            return $inspection;
        }

        // Chỉ cho phép kiểm tra khi đang ở trạng thái pending
        if ($inspection->status !== 'pending') {
            return new WP_Error(
                'invalid_status',
                'Chỉ có thể kiểm tra báo cáo đang ở trạng thái chờ kiểm tra.'
            );
        }

        $update_data = [
            'status' => 'checked',
            'checked_by' => get_current_user_id(),
            'checked_at' => current_time('mysql')
        ];

        if (!empty($data['notes'])) {
            $update_data['notes'] = $data['notes'];
        }

        $result = $this->update($id, $update_data);
        if (is_wp_error($result)) {
            return $result;
        }

        // Tạo lịch sử
        $history = new MB_Product_Inspection_History();
        $history->create([
            'inspection_id' => $id,
            'action' => 'check',
            'status_from' => 'pending',
            'status_to' => 'checked',
            'note' => isset($data['notes']) ? $data['notes'] : null,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return true;
    }

    /**
     * Phê duyệt inspection
     */
    public function approve_inspection($id, $data) {
        $permission = $this->check_permission('approve');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Kiểm tra inspection tồn tại
        $inspection = $this->get($id);
        if (is_wp_error($inspection)) {
            return $inspection;
        }

        // Chỉ cho phép duyệt khi đã được kiểm tra
        if ($inspection->status !== 'checked') {
            return new WP_Error(
                'invalid_status',
                'Chỉ có thể duyệt báo cáo đã được kiểm tra.'
            );
        }

        $update_data = [
            'status' => 'approved',
            'approved_by' => get_current_user_id(),
            'approved_at' => current_time('mysql')
        ];

        if (!empty($data['notes'])) {
            $update_data['notes'] = $data['notes'];
        }

        $result = $this->update($id, $update_data);
        if (is_wp_error($result)) {
            return $result;
        }

        // Tạo lịch sử
        $history = new MB_Product_Inspection_History();
        $history->create([
            'inspection_id' => $id,
            'action' => 'approve',
            'status_from' => 'checked',
            'status_to' => 'approved',
            'note' => isset($data['notes']) ? $data['notes'] : null,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return true;
    }
} 
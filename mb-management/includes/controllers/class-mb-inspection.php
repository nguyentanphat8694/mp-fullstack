<?php
class MB_Inspection_Controller {
    private $inspection_model;
    private $inspection_history_model;
    private $notification_model;

    public function __construct() {
        $this->inspection_model = new MB_Product_Inspection();
        $this->inspection_history_model = new MB_Product_Inspection_History();
        $this->notification_model = new MB_Notification();
    }

    /**
     * Tạo báo cáo kiểm tra mới
     */
    public function create_inspection($data) {
        $result = $this->inspection_model->create($data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử
        $this->inspection_history_model->create([
            'inspection_id' => $result,
            'action' => 'create',
            'status_from' => null,
            'status_to' => $data['status'],
            'note' => 'Tạo báo cáo kiểm tra mới',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        // Thông báo cho quản lý
        $managers = get_users(['role__in' => ['administrator', 'manager']]);
        foreach ($managers as $manager) {
            $this->notification_model->create([
                'user_id' => $manager->ID,
                'type' => 'inspection_created',
                'title' => 'Có báo cáo kiểm tra mới',
                'content' => "Sản phẩm {$data['product_id']} cần được kiểm tra",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Cập nhật trạng thái kiểm tra
     */
    public function update_status($inspection_id, $status, $note = '') {
        $inspection = $this->inspection_model->get($inspection_id);
        if (is_wp_error($inspection)) {
            return [
                'success' => false,
                'message' => $inspection->get_error_message()
            ];
        }

        $old_status = $inspection->status;
        $result = $this->inspection_model->update($inspection_id, [
            'status' => $status,
            'updated_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử
        $this->inspection_history_model->create([
            'inspection_id' => $inspection_id,
            'action' => 'update_status',
            'status_from' => $old_status,
            'status_to' => $status,
            'note' => $note,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        // Thông báo cho người tạo inspection
        if ($inspection->created_by != get_current_user_id()) {
            $this->notification_model->create([
                'user_id' => $inspection->created_by,
                'type' => 'inspection_updated',
                'title' => 'Báo cáo kiểm tra đã được cập nhật',
                'content' => "Trạng thái mới: $status",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công'
        ];
    }

    /**
     * Lấy lịch sử kiểm tra của sản phẩm
     */
    public function get_product_inspections($product_id) {
        $result = $this->inspection_model->get_all([
            'where' => ['product_id' => $product_id],
            'orderby' => 'created_at',
            'order' => 'DESC'
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
     * Lấy lịch sử thay đổi của một inspection
     */
    public function get_inspection_history($inspection_id) {
        $result = $this->inspection_history_model->get_inspection_history($inspection_id);
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
     * Kiểm tra báo cáo inspection
     */
    public function check_inspection($inspection_id, $data) {
        $result = $this->inspection_model->check_inspection($inspection_id, $data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Kiểm tra báo cáo thành công'
        ];
    }

    /**
     * Phê duyệt báo cáo inspection
     */
    public function approve_inspection($inspection_id, $data) {
        $result = $this->inspection_model->approve_inspection($inspection_id, $data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Phê duyệt báo cáo thành công'
        ];
    }
} 
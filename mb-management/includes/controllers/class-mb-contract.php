<?php
class MB_Contract_Controller {
    private $contract_model;
    private $contract_item_model;
    private $contract_note_model;
    private $contract_payment_model;
    private $notification_model;
    private $product_inspection_model;

    public function __construct() {
        $this->contract_model = new MB_Contract();
        $this->contract_item_model = new MB_Contract_Item();
        $this->contract_note_model = new MB_Contract_Note();
        $this->contract_payment_model = new MB_Contract_Payment();
        $this->notification_model = new MB_Notification();
        $this->product_inspection_model = new MB_Product_Inspection();
    }

    /**
     * Tạo hợp đồng mới
     */
    public function create_contract($data, $items) {
        $result = $this->contract_model->create_with_items($data, $items);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Thông báo cho các bên liên quan
        $this->notify_contract_created($result);

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Cập nhật thanh toán hợp đồng
     */
    public function update_payment($contract_id, $payment_data) {
        $result = $this->contract_payment_model->create($payment_data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Kiểm tra nếu quá hạn thanh toán
        $this->check_overdue_payment($contract_id);

        return [
            'success' => true,
            'message' => 'Cập nhật thanh toán thành công'
        ];
    }

    /**
     * Thêm ghi chú cho hợp đồng
     */
    public function add_note($contract_id, $note_data) {
        $result = $this->contract_note_model->create([
            'contract_id' => $contract_id,
            'note' => $note_data['note'],
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Thông báo cho kế toán duyệt note
        $accountants = get_users(['role' => 'accountant']);
        foreach ($accountants as $accountant) {
            $this->notification_model->create([
                'user_id' => $accountant->ID,
                'type' => 'contract_note_pending',
                'title' => 'Có ghi chú hợp đồng cần duyệt',
                'content' => "Hợp đồng #$contract_id có ghi chú mới cần được duyệt",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'message' => 'Thêm ghi chú thành công'
        ];
    }

    /**
     * Duyệt/từ chối ghi chú hợp đồng
     */
    public function process_note($note_id, $action) {
        $result = $action === 'approve' 
            ? $this->contract_note_model->approve($note_id)
            : $this->contract_note_model->reject($note_id);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => $action === 'approve' ? 'Duyệt ghi chú thành công' : 'Từ chối ghi chú thành công'
        ];
    }

    /**
     * Kiểm tra các hợp đồng quá hạn thanh toán
     */
    private function check_overdue_payment($contract_id) {
        $overdue_contracts = $this->contract_model->get_overdue_contracts();
        foreach ($overdue_contracts as $contract) {
            // Thông báo cho quản lý và kế toán
            $users = get_users(['role__in' => ['administrator', 'manager', 'accountant']]);
            foreach ($users as $user) {
                $this->notification_model->create([
                    'user_id' => $user->ID,
                    'type' => 'contract_overdue',
                    'title' => 'Hợp đồng quá hạn thanh toán',
                    'content' => "Hợp đồng #$contract->id quá hạn nhưng chưa thanh toán đủ",
                    'created_at' => current_time('mysql')
                ]);
            }
        }
    }

    /**
     * Thông báo khi tạo hợp đồng mới
     */
    private function notify_contract_created($contract_id) {
        // Thông báo cho quản lý và kế toán
        $users = get_users(['role__in' => ['administrator', 'manager', 'accountant']]);
        foreach ($users as $user) {
            $this->notification_model->create([
                'user_id' => $user->ID,
                'type' => 'contract_created',
                'title' => 'Có hợp đồng mới được tạo',
                'content' => "Hợp đồng #$contract_id vừa được tạo",
                'created_at' => current_time('mysql')
            ]);
        }
    }

    /**
     * Lấy danh sách items của hợp đồng
     */
    public function get_contract_items($contract_id) {
        $result = $this->contract_item_model->get_contract_items($contract_id);
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
     * Thêm item vào hợp đồng
     */
    public function add_contract_item($contract_id, $item_data) {
        $item_data['contract_id'] = $contract_id;
        $result = $this->contract_item_model->create($item_data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Thêm sản phẩm vào hợp đồng thành công'
        ];
    }

    /**
     * Xóa item khỏi hợp đồng
     */
    public function remove_contract_item($item_id) {
        $result = $this->contract_item_model->delete($item_id);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Xóa sản phẩm khỏi hợp đồng thành công'
        ];
    }

    /**
     * Lấy danh sách ghi chú của hợp đồng
     */
    public function get_contract_notes($contract_id) {
        $result = $this->contract_note_model->get_contract_notes($contract_id);
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
     * Lấy lịch sử thanh toán của hợp đồng
     */
    public function get_contract_payments($contract_id) {
        $result = $this->contract_payment_model->get_contract_payments($contract_id);
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
     * Phê duyệt/từ chối ghi chú hợp đồng
     */
    public function approve_contract_note($note_id, $status, $user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        if (!in_array($status, ['approved', 'rejected'])) {
            return [
                'success' => false,
                'message' => 'Trạng thái không hợp lệ'
            ];
        }

        $result = $this->contract_note_model->update($note_id, [
            'status' => $status,
            'approved_by' => $user_id
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái ghi chú thành công'
        ];
    }

    /**
     * Tạo báo cáo kiểm tra trang phục sau khi kết thúc hợp đồng
     */
    public function create_inspection_report($contract_id, $data) {
        $result = $this->product_inspection_model->create([
            'contract_id' => $contract_id,
            'product_id' => $data['product_id'],
            'condition_report' => $data['condition_report'],
            'issues' => isset($data['issues']) ? $data['issues'] : null,
            'recommendations' => isset($data['recommendations']) ? $data['recommendations'] : null,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Tạo thông báo cho quản lý
        $managers = get_users(['role__in' => ['administrator', 'manager']]);
        foreach ($managers as $manager) {
            $this->notification_model->create([
                'user_id' => $manager->ID,
                'type' => 'inspection_report',
                'title' => 'Báo cáo kiểm tra trang phục mới',
                'content' => "Có báo cáo kiểm tra mới cho hợp đồng #$contract_id",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Cập nhật trạng thái hợp đồng
     */
    public function update_contract_status($contract_id, $status) {
        $result = $this->contract_model->update($contract_id, [
            'status' => $status,
            'updated_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái hợp đồng thành công'
        ];
    }
} 
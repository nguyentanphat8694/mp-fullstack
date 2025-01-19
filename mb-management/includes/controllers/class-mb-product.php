<?php
class MB_Product_Controller {
    private $product_model;
    private $product_history_model;
    private $contract_item_model;

    public function __construct() {
        $this->product_model = new MB_Product();
        $this->product_history_model = new MB_Product_History();
        $this->contract_item_model = new MB_Contract_Item();
    }

    /**
     * Tạo sản phẩm mới
     */
    public function create_product($data) {
        $result = $this->product_model->create($data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử
        $this->product_history_model->create([
            'product_id' => $result,
            'action' => 'create',
            'note' => 'Tạo sản phẩm mới',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'data' => $result
        ];
    }

    /**
     * Cập nhật thông tin sản phẩm
     */
    public function update_product($id, $data) {
        $result = $this->product_model->update($id, $data);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        // Ghi lịch sử
        $this->product_history_model->create([
            'product_id' => $id,
            'action' => 'update',
            'note' => 'Cập nhật thông tin sản phẩm',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return [
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công'
        ];
    }

    /**
     * Kiểm tra tình trạng available của sản phẩm
     */
    public function check_availability($product_id, $start_date, $end_date) {
        $result = $this->product_model->check_availability($product_id, $start_date, $end_date);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'data' => [
                'available' => $result,
                'start_date' => $start_date,
                'end_date' => $end_date
            ]
        ];
    }

    /**
     * Lấy lịch sử thuê của sản phẩm
     */
    public function get_rental_history($product_id) {
        $result = $this->contract_item_model->get_all([
            'where' => ['product_id' => $product_id],
            'orderby' => 'rental_start',
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
     * Lấy lịch sử thay đổi của sản phẩm
     */
    public function get_history($product_id) {
        $result = $this->product_history_model->get_product_history($product_id);
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
     * Cập nhật trạng thái sản phẩm
     */
    public function update_status($product_id, $status, $note = '') {
        $result = $this->product_model->update_status($product_id, $status, $note);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Cập nhật trạng thái sản phẩm thành công'
        ];
    }

    /**
     * Thêm ghi chú cho sản phẩm
     */
    public function add_note($product_id, $note) {
        $result = $this->product_history_model->add_note($product_id, $note);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Thêm ghi chú thành công'
        ];
    }

    /**
     * Lấy danh sách items của một hợp đồng
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
} 
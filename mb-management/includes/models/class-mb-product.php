<?php
class MB_Product extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_products';
        $this->fillable = [
            'code',
            'name',
            'category',
            'status',
            'description',
            'images',
            'created_at',
            'updated_at'
        ];
        $this->required_fields = [
            'code',
            'name',
            'category'
        ];
        $this->enum_fields = ['category', 'status'];
        $this->enum_values = [
            'category' => ['wedding_dress', 'vest', 'accessories', 'ao_dai'],
            'status' => ['available', 'rented', 'maintenance']
        ];
        $this->datetime_fields = ['created_at', 'updated_at'];
    }

    /**
     * Kiểm tra sản phẩm có available trong khoảng thời gian
     */
    public function check_availability($product_id, $start_date, $end_date) {
        // Kiểm tra quyền xem sản phẩm
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Kiểm tra sản phẩm tồn tại
        $product = $this->get($product_id);
        if (is_wp_error($product)) {
            return $product;
        }

        // Kiểm tra sản phẩm có đang trong trạng thái maintenance không
        if ($product->status === 'maintenance') {
            return false;
        }

        global $wpdb;
        
        $query = $wpdb->prepare(
            "SELECT COUNT(*) FROM mb_contract_items ci
            WHERE ci.product_id = %d
            AND (
                (ci.rental_start BETWEEN %s AND %s)
                OR (ci.rental_end BETWEEN %s AND %s)
                OR (%s BETWEEN ci.rental_start AND ci.rental_end)
            )",
            $product_id,
            $start_date,
            $end_date,
            $start_date,
            $end_date,
            $start_date
        );

        return (int) $wpdb->get_var($query) === 0;
    }

    /**
     * Cập nhật trạng thái sản phẩm
     */
    public function update_status($id, $status, $note = '') {
        $result = $this->update($id, [
            'status' => $status,
            'updated_at' => current_time('mysql')
        ]);

        if (is_wp_error($result)) {
            return $result;
        }

        // Tạo lịch sử
        $history = new MB_Product_History();
        return $history->create([
            'product_id' => $id,
            'action' => 'status_change',
            'note' => "Thay đổi trạng thái sang: $status" . ($note ? " - $note" : ''),
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);
    }

    /**
     * Override create để thêm timestamps và lịch sử
     */
    public function create($data) {
        $data['created_at'] = current_time('mysql');
        $data['updated_at'] = current_time('mysql');
        
        $product_id = parent::create($data);
        if (is_wp_error($product_id)) {
            return $product_id;
        }

        // Tạo lịch sử
        $history = new MB_Product_History();
        $history->create([
            'product_id' => $product_id,
            'action' => 'create',
            'note' => 'Tạo sản phẩm mới',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return $product_id;
    }

    /**
     * Override update để thêm timestamps và lịch sử
     */
    public function update($id, $data) {
        $data['updated_at'] = current_time('mysql');
        
        $result = parent::update($id, $data);
        if (is_wp_error($result)) {
            return $result;
        }

        // Tạo lịch sử
        $history = new MB_Product_History();
        $history->create([
            'product_id' => $id,
            'action' => 'update',
            'note' => 'Cập nhật thông tin sản phẩm',
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        return true;
    }
} 
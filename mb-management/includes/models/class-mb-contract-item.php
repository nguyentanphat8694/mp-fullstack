<?php
class MB_Contract_Item extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_items';
        $this->fillable = [
            'contract_id',
            'product_id',
            'rental_start',
            'rental_end',
            'created_at'
        ];
        $this->required_fields = [
            'contract_id',
            'product_id',
            'rental_start',
            'rental_end'
        ];
        $this->date_fields = ['rental_start', 'rental_end'];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Override create để thêm validation đặc biệt
     */
    public function create($data) {
        // Kiểm tra sản phẩm có available không
        $product = new MB_Product();
        $is_available = $product->check_availability(
            $data['product_id'],
            $data['rental_start'],
            $data['rental_end']
        );

        if (is_wp_error($is_available)) {
            return $is_available;
        }

        if (!$is_available) {
            return new WP_Error(
                'product_unavailable',
                'Sản phẩm không khả dụng trong thời gian này.'
            );
        }

        // Thêm thời gian tạo
        $data['created_at'] = current_time('mysql');

        return parent::create($data);
    }

    /**
     * Lấy danh sách items của một hợp đồng
     */
    public function get_contract_items($contract_id) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT ci.*, p.name as product_name, p.code as product_code
            FROM {$this->table_name} ci
            LEFT JOIN mb_products p ON ci.product_id = p.id
            WHERE ci.contract_id = %d",
            $contract_id
        );

        return $wpdb->get_results($query);
    }
} 
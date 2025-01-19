<?php
class MB_Product_History extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_product_history';
        $this->fillable = [
            'product_id',
            'action',
            'note',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'product_id',
            'action',
            'created_by'
        ];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Lấy lịch sử của một sản phẩm
     */
    public function get_product_history($product_id, $limit = 20, $offset = 0) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT h.*, 
                u.display_name as created_by_name
            FROM {$this->table_name} h
            LEFT JOIN {$wpdb->users} u ON h.created_by = u.ID
            WHERE h.product_id = %d
            ORDER BY h.created_at DESC
            LIMIT %d OFFSET %d",
            $product_id,
            $limit,
            $offset
        );

        return $wpdb->get_results($query);
    }

    /**
     * Thêm ghi chú cho sản phẩm
     */
    public function add_note($product_id, $note) {
        return $this->create([
            'product_id' => $product_id,
            'action' => 'note',
            'note' => $note,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);
    }
} 
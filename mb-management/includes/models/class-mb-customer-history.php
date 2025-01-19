<?php
class MB_Customer_History extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_customer_history';
        $this->fillable = [
            'customer_id',
            'action',
            'note',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'customer_id',
            'action',
            'created_by'
        ];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Lấy lịch sử của một khách hàng
     */
    public function get_customer_history($customer_id, $limit = 20, $offset = 0) {
        // Kiểm tra quyền xem lịch sử khách hàng
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        
        // Kiểm tra quyền xem tất cả hoặc chỉ xem được khách hàng được phân công
        $additional_where = '';
        if (!current_user_can('mb_view_customers') && current_user_can('mb_view_assigned_customers')) {
            $current_user_id = get_current_user_id();
            $customer_model = new MB_Customer();
            $customer = $customer_model->get($customer_id);
            
            if (is_wp_error($customer)) {
                return $customer;
            }
            
            // Chỉ cho phép xem lịch sử của khách hàng được phân công
            if ($customer->assigned_to != $current_user_id) {
                return new WP_Error(
                    'forbidden',
                    'Bạn không có quyền xem lịch sử của khách hàng này.'
                );
            }
        }

        $query = $wpdb->prepare(
            "SELECT h.*, 
                u.display_name as created_by_name
            FROM {$this->table_name} h
            LEFT JOIN {$wpdb->users} u ON h.created_by = u.ID
            WHERE h.customer_id = %d
            ORDER BY h.created_at DESC
            LIMIT %d OFFSET %d",
            $customer_id,
            $limit,
            $offset
        );

        return $wpdb->get_results($query);
    }

    /**
     * Thêm ghi chú cho khách hàng
     */
    public function add_note($customer_id, $note) {
        return $this->create([
            'customer_id' => $customer_id,
            'action' => 'note',
            'note' => $note,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);
    }
} 
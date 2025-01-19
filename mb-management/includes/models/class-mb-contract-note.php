<?php
class MB_Contract_Note extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_notes';
        $this->fillable = [
            'contract_id',
            'note',
            'status',
            'approved_by',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'contract_id',
            'note',
            'created_by'
        ];
        $this->enum_fields = ['status'];
        $this->enum_values = [
            'status' => ['pending', 'approved', 'rejected']
        ];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Lấy danh sách ghi chú của một hợp đồng
     */
    public function get_contract_notes($contract_id) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT n.*, 
                c.display_name as created_by_name,
                a.display_name as approved_by_name
            FROM {$this->table_name} n
            LEFT JOIN {$wpdb->users} c ON n.created_by = c.ID
            LEFT JOIN {$wpdb->users} a ON n.approved_by = a.ID
            WHERE n.contract_id = %d
            ORDER BY n.created_at DESC",
            $contract_id
        );

        return $wpdb->get_results($query);
    }

    /**
     * Phê duyệt ghi chú
     */
    public function approve($id) {
        $permission = $this->check_permission('approve');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Kiểm tra role accountant
        if (!current_user_can('accountant')) {
            return new WP_Error('forbidden', 'Chỉ kế toán mới có thể phê duyệt ghi chú hợp đồng.');
        }

        return $this->update($id, [
            'status' => 'approved',
            'approved_by' => get_current_user_id()
        ]);
    }

    /**
     * Từ chối ghi chú
     */
    public function reject($id) {
        $permission = $this->check_permission('approve');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Kiểm tra role accountant
        if (!current_user_can('accountant')) {
            return new WP_Error('forbidden', 'Chỉ kế toán mới có thể từ chối ghi chú hợp đồng.');
        }

        return $this->update($id, [
            'status' => 'rejected',
            'approved_by' => get_current_user_id()
        ]);
    }
} 
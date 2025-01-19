<?php
class MB_Product_Inspection_History extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_product_inspection_history';
        $this->fillable = [
            'inspection_id',
            'action',
            'status_from',
            'status_to',
            'note',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'inspection_id',
            'action',
            'status_from',
            'status_to',
            'created_by'
        ];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Lấy lịch sử của một inspection
     */
    public function get_inspection_history($inspection_id, $limit = 20, $offset = 0) {
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
            WHERE h.inspection_id = %d
            ORDER BY h.created_at DESC
            LIMIT %d OFFSET %d",
            $inspection_id,
            $limit,
            $offset
        );

        return $wpdb->get_results($query);
    }
} 
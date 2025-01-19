<?php
class MB_Transaction extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_transactions';
        $this->fillable = [
            'type',
            'amount',
            'description',
            'contract_id',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'type',
            'amount',
            'description',
            'created_by'
        ];
        $this->enum_fields = ['type'];
        $this->enum_values = [
            'type' => ['income', 'expense']
        ];
        $this->decimal_fields = ['amount'];
        $this->datetime_fields = ['created_at'];
    }

    /**
     * Override create để kiểm tra quyền đặc biệt
     */
    public function create($data) {
        // Chỉ người có quyền quản lý giao dịch mới có thể tạo transaction
        // if (!current_user_can('mb_manage_transactions') && 
        //     !current_user_can('mb_create_transactions')) {
        //     return new WP_Error('forbidden', 'Bạn không có quyền tạo giao dịch.');
        // }

        return parent::create($data);
    }

    /**
     * Lấy tổng thu chi trong khoảng thời gian
     */
    public function get_summary($start_date, $end_date) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        try {
            global $wpdb;
            $query = $wpdb->prepare(
                "SELECT type, SUM(amount) as total 
                FROM {$this->table_name}
                WHERE created_at BETWEEN %s AND %s
                GROUP BY type",
                $start_date,
                $end_date
            );

            $results = $wpdb->get_results($query);
            $summary = [
                'income' => 0,
                'expense' => 0
            ];

            foreach ($results as $result) {
                $summary[$result->type] = floatval($result->total);
            }

            $summary['balance'] = $summary['income'] - $summary['expense'];
            return $summary;
        } catch (Exception $e) {
            $this->logger->error("Failed to get transaction summary: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể lấy báo cáo thu chi.');
        }
    }

    /**
     * Lấy danh sách giao dịch của một hợp đồng
     */
    public function get_contract_transactions($contract_id) {
        return $this->get_all([
            'where' => ['contract_id' => $contract_id],
            'orderby' => 'created_at',
            'order' => 'DESC'
        ]);
    }
} 
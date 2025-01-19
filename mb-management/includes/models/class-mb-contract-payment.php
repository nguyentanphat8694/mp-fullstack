<?php
class MB_Contract_Payment extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contract_payments';
        $this->fillable = [
            'contract_id',
            'amount',
            'payment_date',
            'payment_method',
            'created_by',
            'created_at'
        ];
        $this->required_fields = [
            'contract_id',
            'amount',
            'payment_date',
            'payment_method',
            'created_by'
        ];
        $this->decimal_fields = ['amount'];
        $this->datetime_fields = ['payment_date', 'created_at'];
    }

    /**
     * Override create để cập nhật paid_amount trong contract
     */
    public function create($data) {
        try {
            $this->db->begin_transaction();

            // Tạo payment record
            $payment_id = parent::create($data);
            if (is_wp_error($payment_id)) {
                throw new Exception($payment_id->get_error_message());
            }

            // Cập nhật paid_amount trong contract
            $contract = new MB_Contract();
            $result = $contract->update_payment($data['contract_id'], $data['amount']);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            // Tạo transaction record
            $transaction = new MB_Transaction();
            $trans_result = $transaction->create([
                'type' => 'income',
                'amount' => $data['amount'],
                'description' => 'Thanh toán hợp đồng #' . $data['contract_id'],
                'contract_id' => $data['contract_id'],
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            ]);
            if (is_wp_error($trans_result)) {
                throw new Exception($trans_result->get_error_message());
            }

            $this->db->commit();
            return $payment_id;

        } catch (Exception $e) {
            $this->db->rollback();
            $this->logger->error("Failed to create payment: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể tạo thanh toán mới.');
        }
    }

    /**
     * Lấy lịch sử thanh toán của một hợp đồng
     */
    public function get_contract_payments($contract_id) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT p.*, u.display_name as created_by_name
            FROM {$this->table_name} p
            LEFT JOIN {$wpdb->users} u ON p.created_by = u.ID
            WHERE p.contract_id = %d
            ORDER BY p.payment_date DESC",
            $contract_id
        );

        return $wpdb->get_results($query);
    }
} 
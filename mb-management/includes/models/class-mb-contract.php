<?php
class MB_Contract extends MB_Model {
    public function __construct() {
        parent::__construct();
        $this->table_name = 'mb_contracts';
        $this->fillable = [
            'customer_id',
            'type',
            'total_amount',
            'paid_amount',
            'status',
            'start_date',
            'end_date',
            'photographer_id',
            'created_by',
            'created_at',
            'updated_at'
        ];
        $this->required_fields = [
            'customer_id',
            'type',
            'total_amount',
            'start_date',
            'end_date'
        ];
        $this->enum_fields = ['type', 'status'];
        $this->enum_values = [
            'type' => ['dress_rental', 'wedding_photo', 'pre_wedding_photo'],
            'status' => ['draft', 'pending', 'active', 'completed', 'cancelled']
        ];
        $this->date_fields = ['start_date', 'end_date'];
        $this->datetime_fields = ['created_at', 'updated_at'];
        $this->decimal_fields = ['total_amount', 'paid_amount'];
    }

    /**
     * Tạo hợp đồng mới với các items
     */
    public function create_with_items($data, $items = []) {
        // Validate items nếu là hợp đồng váy cưới
        if ($data['type'] === 'dress_rental' && empty($items)) {
            return new WP_Error(
                'invalid_items',
                'Hợp đồng váy cưới phải có ít nhất một sản phẩm.'
            );
        }

        try {
            $this->db->begin_transaction();

            // Tạo hợp đồng
            $contract_id = parent::create(array_merge($data, [
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql'),
                'paid_amount' => 0,
                'status' => 'draft'
            ]));

            if (is_wp_error($contract_id)) {
                throw new Exception($contract_id->get_error_message());
            }

            // Thêm items nếu có
            if (!empty($items)) {
                $contract_item = new MB_Contract_Item();
                foreach ($items as $item) {
                    $item['contract_id'] = $contract_id;
                    $result = $contract_item->create($item);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                }
            }

            $this->db->commit();
            return $contract_id;

        } catch (Exception $e) {
            $this->db->rollback();
            $this->logger->error("Failed to create contract: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể tạo hợp đồng mới.');
        }
    }

    /**
     * Cập nhật thanh toán hợp đồng
     */
    public function update_payment($id, $amount) {
        // Lấy thông tin hợp đồng
        $contract = $this->get($id);
        if (is_wp_error($contract)) {
            return $contract;
        }

        // Kiểm tra số tiền thanh toán
        $new_paid_amount = $contract->paid_amount + $amount;
        if ($new_paid_amount > $contract->total_amount) {
            return new WP_Error(
                'invalid_amount',
                'Số tiền thanh toán vượt quá tổng giá trị hợp đồng.'
            );
        }

        return $this->update($id, [
            'paid_amount' => $new_paid_amount,
            'updated_at' => current_time('mysql')
        ]);
    }

    /**
     * Kiểm tra các hợp đồng quá hạn chưa thanh toán đủ
     */
    public function get_overdue_contracts() {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        global $wpdb;
        return $wpdb->get_results(
            "SELECT * FROM {$this->table_name}
            WHERE status = 'active'
            AND end_date < CURDATE()
            AND paid_amount < total_amount"
        );
    }
} 
<?php
class MB_Finance_Controller {
    private $transaction_model;
    private $contract_model;
    private $contract_payment_model;
    private $task_model;
    private $notification_model;

    public function __construct() {
        $this->transaction_model = new MB_Transaction();
        $this->contract_model = new MB_Contract();
        $this->contract_payment_model = new MB_Contract_Payment();
        $this->task_model = new MB_Task();
        $this->notification_model = new MB_Notification();
    }

    /**
     * Tạo giao dịch thu
     */
    public function create_income($data) {
        $data['type'] = 'income';
        $result = $this->transaction_model->create($data);
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
     * Tạo giao dịch chi
     */
    public function create_expense($data) {
        $data['type'] = 'expense';
        $result = $this->transaction_model->create($data);
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
     * Lấy báo cáo tổng hợp giao dịch
     */
    public function get_transaction_summary($start_date, $end_date) {
        $result = $this->transaction_model->get_summary($start_date, $end_date);
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
     * Lấy danh sách giao dịch của hợp đồng
     */
    public function get_contract_transactions($contract_id) {
        $result = $this->transaction_model->get_contract_transactions($contract_id);
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
     * Lấy danh sách thanh toán của hợp đồng
     */
    public function get_contract_payments($contract_id) {
        $result = $this->contract_payment_model->get_contract_payments($contract_id);
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
     * Lấy danh sách hợp đồng quá hạn thanh toán
     */
    public function get_overdue_contracts() {
        $result = $this->contract_model->get_overdue_contracts();
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
     * Cập nhật thanh toán hợp đồng
     */
    public function update_contract_payment($contract_id, $amount) {
        $result = $this->contract_model->update_payment($contract_id, $amount);
        if (is_wp_error($result)) {
            return [
                'success' => false,
                'message' => $result->get_error_message()
            ];
        }

        return [
            'success' => true,
            'message' => 'Cập nhật thanh toán hợp đồng thành công'
        ];
    }

    /**
     * Tạo báo cáo xin sửa chữa/mua sắm
     */
    public function create_purchase_request($data) {
        // Tạo task cho yêu cầu mua sắm
        $task_data = [
            'title' => $data['title'],
            'description' => $data['description'],
            'due_date' => date('Y-m-d H:i:s', strtotime('+1 week')),
            'status' => 'pending',
            'assigned_to' => null, // Sẽ được manager phân công sau
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ];

        $task_result = $this->task_model->create($task_data);
        if (is_wp_error($task_result)) {
            return [
                'success' => false,
                'message' => $task_result->get_error_message()
            ];
        }

        // Thông báo cho admin và manager
        $managers = get_users(['role__in' => ['administrator', 'manager']]);
        foreach ($managers as $manager) {
            $this->notification_model->create([
                'user_id' => $manager->ID,
                'type' => 'purchase_request',
                'title' => 'Yêu cầu mua sắm mới',
                'content' => "Có yêu cầu mua sắm mới: {$data['title']}",
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'data' => $task_result
        ];
    }

    /**
     * Duyệt báo cáo xin sửa chữa/mua sắm
     */
    public function approve_purchase_request($task_id, $status, $note = '') {
        // Cập nhật trạng thái task
        $task_update = $this->task_model->update($task_id, [
            'status' => $status,
            'updated_at' => current_time('mysql')
        ]);

        if (is_wp_error($task_update)) {
            return [
                'success' => false,
                'message' => $task_update->get_error_message()
            ];
        }

        // Thêm comment vào task
        $task_comment = new MB_Task_Comment();
        $comment_result = $task_comment->create([
            'task_id' => $task_id,
            'comment' => $note,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        ]);

        // Nếu được duyệt, tạo giao dịch chi
        if ($status === 'completed') {
            $task = $this->task_model->get($task_id);
            if (!is_wp_error($task)) {
                $transaction_result = $this->transaction_model->create([
                    'type' => 'expense',
                    'amount' => floatval($task->description), // Giả sử số tiền được ghi trong description
                    'description' => "Chi phí cho yêu cầu: {$task->title}",
                    'created_by' => get_current_user_id(),
                    'created_at' => current_time('mysql')
                ]);

                if (is_wp_error($transaction_result)) {
                    return [
                        'success' => false,
                        'message' => $transaction_result->get_error_message()
                    ];
                }
            }
        }

        // Thông báo cho người tạo yêu cầu
        $task = $this->task_model->get($task_id);
        if (!is_wp_error($task)) {
            $this->notification_model->create([
                'user_id' => $task->created_by,
                'type' => 'purchase_request_' . $status,
                'title' => 'Cập nhật yêu cầu mua sắm',
                'content' => "Yêu cầu mua sắm '{$task->title}' đã được " . 
                            ($status === 'completed' ? 'phê duyệt' : 'từ chối'),
                'created_at' => current_time('mysql')
            ]);
        }

        return [
            'success' => true,
            'message' => 'Cập nhật yêu cầu mua sắm thành công'
        ];
    }

    /**
     * Lấy danh sách yêu cầu mua sắm
     */
    public function get_purchase_requests($status = null) {
        $args = [];
        if ($status) {
            $args['where'] = ['status' => $status];
        }
        
        $result = $this->task_model->get_all($args);
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
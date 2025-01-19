# Controllers và Functions

## 1. MB_Contract_Controller
### Methods:
- `create_contract($data, $items)`: Tạo hợp đồng mới
- `update_payment($contract_id, $payment_data)`: Cập nhật thanh toán
- `get_contract_items($contract_id)`: Lấy danh sách items của hợp đồng
- `add_contract_item($contract_id, $item_data)`: Thêm item vào hợp đồng
- `remove_contract_item($item_id)`: Xóa item khỏi hợp đồng
- `get_contract_notes($contract_id)`: Lấy danh sách ghi chú
- `get_contract_payments($contract_id)`: Lấy lịch sử thanh toán
- `approve_contract_note($note_id, $status, $user_id)`: Phê duyệt/từ chối ghi chú
- `create_inspection_report($contract_id, $data)`: Tạo báo cáo kiểm tra
- `update_contract_status($contract_id, $status)`: Cập nhật trạng thái

### Chức năng đã đầy đủ theo yêu cầu

## 2. MB_Task_Controller
### Methods:
- `create_task($data)`: Tạo task mới
- `update_status($task_id, $status)`: Cập nhật trạng thái
- `add_comment($task_id, $comment)`: Thêm comment
- `get_task_comments($task_id)`: Lấy comments của task
- `assign_task($task_id, $user_id)`: Gán task cho nhân viên

### Chức năng đã đầy đủ theo yêu cầu

## 3. MB_Notification_Controller
### Methods:
- `get_user_notifications($user_id, $unread_only)`: Lấy danh sách thông báo
- `mark_as_read($notification_id)`: Đánh dấu đã đọc
- `mark_all_as_read($user_id)`: Đánh dấu tất cả đã đọc
- `create_event_notification($event_type, $data)`: Tạo thông báo theo sự kiện
- `create_role_notification($roles, $data)`: Gửi thông báo theo role

### Chức năng đã đầy đủ theo yêu cầu

## 4. MB_Finance_Controller
### Methods:
- `create_income($data)`: Tạo giao dịch thu
- `create_expense($data)`: Tạo giao dịch chi
- `get_transaction_summary($start_date, $end_date)`: Lấy báo cáo tổng hợp
- `get_contract_transactions($contract_id)`: Lấy giao dịch của hợp đồng
- `get_contract_payments($contract_id)`: Lấy thanh toán của hợp đồng
- `get_overdue_contracts()`: Lấy hợp đồng quá hạn thanh toán
- `update_contract_payment($contract_id, $amount)`: Cập nhật thanh toán
- `create_purchase_request($data)`: Tạo yêu cầu mua sắm
- `approve_purchase_request($task_id, $status, $note)`: Duyệt yêu cầu mua sắm
- `get_purchase_requests($status)`: Lấy danh sách yêu cầu mua sắm

### Chức năng đã đầy đủ theo yêu cầu

## 5. MB_Customer_Controller
### Methods:
- `create_customer($data)`: Tạo khách hàng mới
- `update_customer($id, $data)`: Cập nhật thông tin khách
- `assign_customer($id, $user_id)`: Phân công khách hàng
- `get_customer_history($id)`: Lấy lịch sử chăm sóc
- `create_appointment($data)`: Tạo lịch hẹn
- `update_appointment($id, $data)`: Cập nhật lịch hẹn

### Chức năng đã đầy đủ theo yêu cầu

## 6. MB_Product_Controller
### Methods:
- `create_product($data)`: Tạo sản phẩm mới
- `update_product($id, $data)`: Cập nhật sản phẩm
- `check_availability($id, $start_date, $end_date)`: Kiểm tra tình trạng
- `get_product_history($id)`: Lấy lịch sử cho thuê
- `update_status($id, $status)`: Cập nhật trạng thái

### Chức năng đã đầy đủ theo yêu cầu

## 7. MB_Attendance_Controller
### Methods:
- `check_in($data)`: Chấm công vào
- `check_out($user_id)`: Chấm công ra
- `get_user_attendance($user_id, $start_date, $end_date)`: Xem báo cáo chấm công
- `get_monthly_summary($user_id, $month, $year)`: Tổng kết công tháng

### Chức năng đã đầy đủ theo yêu cầu

## 8. MB_Reward_Controller
### Methods:
- `create_reward($data)`: Tạo thưởng/phạt
- `approve_reward($id)`: Duyệt thưởng/phạt
- `get_user_rewards($user_id, $start_date, $end_date)`: Xem thưởng phạt
- `get_monthly_summary($user_id, $month, $year)`: Tổng kết thưởng phạt tháng

### Chức năng đã đầy đủ theo yêu cầu

## 9. MB_Inspection_Controller
### Methods:
- `create_inspection($data)`: Tạo báo cáo kiểm tra
- `approve_inspection($id)`: Duyệt báo cáo
- `get_inspection_history($product_id)`: Xem lịch sử kiểm tra
- `update_status($id, $status)`: Cập nhật trạng thái

### Chức năng đã đầy đủ theo yêu cầu
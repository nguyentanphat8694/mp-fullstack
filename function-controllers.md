# Controllers và Functions

## 1. MB_Contract_Controller
### Methods:
- `create_contract($data, $items)`: Tạo hợp đồng mới
- `update_payment($contract_id, $payment_data)`: Cập nhật thanh toán
- `add_note($contract_id, $note_data)`: Thêm ghi chú
- `process_note($note_id, $action)`: Xử lý ghi chú
- `get_contract_items($contract_id)`: Lấy danh sách items của hợp đồng
- `add_contract_item($contract_id, $item_data)`: Thêm item vào hợp đồng
- `remove_contract_item($item_id)`: Xóa item khỏi hợp đồng
- `get_contract_notes($contract_id)`: Lấy danh sách ghi chú
- `get_contract_payments($contract_id)`: Lấy lịch sử thanh toán
- `approve_contract_note($note_id, $status, $user_id)`: Phê duyệt/từ chối ghi chú
- `create_inspection_report($contract_id, $data)`: Tạo báo cáo kiểm tra
- `update_contract_status($contract_id, $status)`: Cập nhật trạng thái
- `check_overdue_payment($contract_id)`: Kiểm tra quá hạn thanh toán (private)
- `notify_contract_created($contract_id)`: Thông báo tạo hợp đồng mới (private)

### Chức năng đã đầy đủ theo yêu cầu

## 2. MB_Task_Controller
### Methods:
- `create_task($data)`: Tạo task mới
- `update_status($task_id, $status)`: Cập nhật trạng thái
- `add_comment($task_id, $comment)`: Thêm comment
- `get_assigned_tasks($user_id)`: Lấy danh sách task được gán cho nhân viên
- `get_task_comments($task_id)`: Lấy comments của task
- `assign_task($task_id, $user_id)`: Gán task cho nhân viên
- `check_overdue_tasks()`: Kiểm tra các task quá hạn

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
- `get_customers($filters)`: Lấy danh sách khách hàng
- `create_customer($data)`: Tạo khách hàng mới
- `assign_customer($id, $user_id)`: Phân công khách hàng
- `update_customer_status($customer_id, $status, $note)`: Cập nhật trạng thái
- `get_assigned_customers($user_id)`: Lấy khách hàng được phân công
- `create_appointment($customer_id, $appointment_data)`: Tạo lịch hẹn
- `get_appointments_by_date($date)`: Lấy lịch hẹn theo ngày
- `take_appointment($appointment_id)`: Sale tiếp nhận khách từ lịch hẹn

### Chức năng đã đầy đủ theo yêu cầu

## 6. MB_Product_Controller
### Methods:
- `create_product($data)`: Tạo sản phẩm mới
- `update_product($id, $data)`: Cập nhật sản phẩm
- `check_availability($product_id, $start_date, $end_date)`: Kiểm tra tình trạng
- `get_rental_history($product_id)`: Lấy lịch sử cho thuê
- `get_history($product_id)`: Lấy lịch sử thay đổi của sản phẩm
- `update_status($product_id, $status, $note)`: Cập nhật trạng thái
- `add_note($product_id, $note)`: Thêm ghi chú cho sản phẩm
- `get_contract_items($contract_id)`: Lấy danh sách items của hợp đồng

### Chức năng đã đầy đủ theo yêu cầu

## 7. MB_Attendance_Controller
### Methods:
- `check_in($data)`: Chấm công vào, tự động tạo penalty nếu đi muộn
- `check_out()`: Chấm công ra, tự động tạo penalty nếu về sớm
- `get_monthly_report($user_id, $month, $year)`: Xem báo cáo chấm công tháng
- `get_department_attendance($department_role, $date)`: Xem chấm công theo phòng ban

### Chức năng đã đầy đủ theo yêu cầu

## 8. MB_Reward_Controller
### Methods:
- `get_rewards($user_id, $start_date, $end_date, $status)`: Lấy danh sách thưởng/phạt
- `create_reward($data)`: Tạo thưởng/phạt mới với thông báo
- `approve_reward($id, $status)`: Duyệt thưởng/phạt
- `calculate_total_rewards($user_id, $start_date, $end_date)`: Tính tổng thưởng/phạt
- `get_monthly_summary($user_id, $month, $year)`: Tổng hợp thưởng phạt và chấm công theo tháng

### Chức năng đã đầy đủ theo yêu cầu

## 9. MB_Inspection_Controller
### Methods:
- `create_inspection($data)`: Tạo báo cáo kiểm tra
- `update_status($inspection_id, $status, $note)`: Cập nhật trạng thái
- `get_product_inspections($product_id)`: Lấy danh sách kiểm tra của sản phẩm
- `get_inspection_history($inspection_id)`: Lấy lịch sử thay đổi của inspection
- `check_inspection($inspection_id, $data)`: Kiểm tra báo cáo inspection
- `approve_inspection($inspection_id, $data)`: Phê duyệt báo cáo inspection

### Chức năng đã đầy đủ theo yêu cầu

## 10. MB_Notification_Controller
### Methods:
- `get_user_notifications($user_id, $unread_only)`: Lấy danh sách thông báo
- `mark_as_read($notification_id)`: Đánh dấu đã đọc
- `mark_all_as_read($user_id)`: Đánh dấu tất cả đã đọc
- `create_event_notification($event_type, $data)`: Tạo thông báo theo sự kiện (task_overdue, appointment_reminder, contract_due)
- `create_role_notification($roles, $data)`: Gửi thông báo theo role

### Chức năng đã đầy đủ theo yêu cầu

# Hiện chưa có, cần bổ sung nếu có yêu cầu
## 4. MB_Finance_Controller
### Methods thêm:
- `get_purchase_request_summary($start_date, $end_date)`: Tổng hợp báo cáo mua sắm
- `get_transaction_by_type($type, $start_date, $end_date)`: Lấy giao dịch theo loại (thu/chi)

## 6. MB_Product_Controller
### Methods thêm:
- `get_product_by_category($category)`: Lấy sản phẩm theo danh mục
- `get_maintenance_history($product_id)`: Lấy lịch sử bảo trì/sửa chữa

## 9. MB_Inspection_Controller
### Methods thêm:
- `get_pending_inspections()`: Lấy danh sách kiểm tra chờ duyệt
- `get_inspection_by_contract($contract_id)`: Lấy báo cáo kiểm tra theo hợp đồng

## 1. MB_Contract_Controller
### Methods thêm:
- `get_contract_by_type($type)`: Lấy hợp đồng theo loại
- `get_photographer_schedule($photographer_id, $date)`: Lấy lịch của thợ chụp ảnh
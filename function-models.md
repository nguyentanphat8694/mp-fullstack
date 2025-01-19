# Models và Functions

## 1. MB_Attendance
- `__construct()`: Khởi tạo model với table mb_attendance
- `get_user_attendance($user_id, $start_date, $end_date)`: Lấy thông tin chấm công của user trong khoảng thời gian
- `get_today_attendance($user_id)`: Kiểm tra user đã check in trong ngày chưa
- `check_in($data)`: Thực hiện check in với validation WiFi
- `check_out($user_id)`: Thực hiện check out

## 2. MB_Contract
- `__construct()`: Khởi tạo model với table mb_contracts
- `create_with_items($data, $items)`: Tạo hợp đồng mới với các items
- `update_payment($id, $amount)`: Cập nhật thanh toán hợp đồng
- `get_overdue_contracts()`: Kiểm tra các hợp đồng quá hạn chưa thanh toán đủ

## 3. MB_Contract_Item
- `__construct()`: Khởi tạo model với table mb_contract_items
- `create($data)`: Override create để thêm validation đặc biệt
- `get_contract_items($contract_id)`: Lấy danh sách items của một hợp đồng

## 4. MB_Contract_Note
- `__construct()`: Khởi tạo model với table mb_contract_notes
- `get_contract_notes($contract_id)`: Lấy danh sách ghi chú của một hợp đồng
- `approve($id)`: Phê duyệt ghi chú
- `reject($id)`: Từ chối ghi chú

## 5. MB_Contract_Payment
- `__construct()`: Khởi tạo model với table mb_contract_payments
- `create($data)`: Override create để cập nhật paid_amount trong contract
- `get_contract_payments($contract_id)`: Lấy lịch sử thanh toán của một hợp đồng

## 6. MB_Customer
- `__construct()`: Khởi tạo model với table mb_customers
- `create($data)`: Tạo khách hàng mới với lịch sử
- `update($id, $data)`: Cập nhật khách hàng với lịch sử
- `assign($id, $assigned_to)`: Phân công khách hàng cho nhân viên
- `get_assigned_customers($user_id)`: Lấy danh sách khách hàng được phân công
- `update_status($id, $status, $note)`: Cập nhật trạng thái khách hàng

## 7. MB_Notification
- `__construct()`: Khởi tạo model với table mb_notifications
- `get_user_notifications($user_id, $unread_only)`: Lấy danh sách thông báo của user
- `mark_as_read($id)`: Đánh dấu thông báo đã đọc
- `mark_all_as_read($user_id)`: Đánh dấu tất cả thông báo của user đã đọc
- `count_unread($user_id)`: Đếm số thông báo chưa đọc

## 8. MB_Product_History
- `__construct()`: Khởi tạo model với table mb_product_history
- `get_product_history($product_id, $limit, $offset)`: Lấy lịch sử của một sản phẩm
- `add_note($product_id, $note)`: Thêm ghi chú cho sản phẩm

## 9. MB_Product_Inspection_History
- `__construct()`: Khởi tạo model với table mb_product_inspection_history
- `get_inspection_history($inspection_id, $limit, $offset)`: Lấy lịch sử của một inspection

## 10. MB_Reward
- `__construct()`: Khởi tạo model với table mb_rewards
- `get_user_rewards($user_id, $start_date, $end_date, $status)`: Lấy thưởng phạt của user
- `create($data)`: Tạo thưởng/phạt mới
- `approve($id, $user_id, $status)`: Duyệt thưởng/phạt
- `calculate_total($user_id, $start_date, $end_date)`: Tính tổng thưởng/phạt

## 11. MB_Task
- `__construct()`: Khởi tạo model với table mb_tasks
- `get_assigned_tasks($user_id)`: Lấy danh sách task được gán cho user
- `get_overdue_tasks()`: Lấy danh sách task quá hạn
- `update_status($id, $status)`: Cập nhật trạng thái task
- `assign_task($id, $user_id)`: Gán task cho nhân viên

## 12. MB_Task_Comment
- `__construct()`: Khởi tạo model với table mb_task_comments
- `create($data)`: Override create để thêm kiểm tra quyền với task
- `get_task_comments($task_id)`: Lấy danh sách comment của một task

## 13. MB_Transaction
- `__construct()`: Khởi tạo model với table mb_transactions
- `create($data)`: Override create để kiểm tra quyền đặc biệt
- `get_summary($start_date, $end_date)`: Get summary of transactions
- `get_contract_transactions($contract_id)`: Lấy danh sách giao dịch của một hợp đồng 

## 14. MB_Customer_History
- `__construct()`: Khởi tạo model với table mb_customer_history
- `get_customer_history($customer_id, $limit, $offset)`: Lấy lịch sử của một khách hàng với phân trang
- `add_note($customer_id, $note)`: Thêm ghi chú cho khách hàng

## 15. MB_Product
- `__construct()`: Khởi tạo model với table mb_products
- `check_availability($product_id, $start_date, $end_date)`: Kiểm tra sản phẩm có available trong khoảng thời gian
- `update_status($id, $status, $note)`: Cập nhật trạng thái sản phẩm và tạo lịch sử
- `create($data)`: Override create để thêm timestamps và lịch sử
- `update($id, $data)`: Override update để thêm timestamps và lịch sử

## 16. MB_Appointment
- `__construct()`: Khởi tạo model với table mb_appointments
- `create($data)`: Override create để thêm vào lịch sử khách hàng
- `update_status($id, $status, $note)`: Cập nhật trạng thái lịch hẹn
- `assign_sale($id, $sale_id)`: Phân công sale phụ trách lịch hẹn
- `get_today_appointments($sale_id)`: Lấy danh sách lịch hẹn trong ngày của sale
- `get_unassigned_appointments()`: Lấy danh sách lịch hẹn chưa được phân công
- `check_existing_appointment($customer_id, $appointment_date)`: Kiểm tra khách hàng đã có lịch hẹn trong ngày chưa

## 17. MB_Product_Inspection
- `__construct()`: Khởi tạo model với table mb_product_inspections
- `check_inspection($id, $data)`: Kiểm tra và cập nhật trạng thái inspection
- `approve_inspection($id, $data)`: Phê duyệt inspection 
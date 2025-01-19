# Wedding Management System APIs

## 1. Authentication APIs
- POST /wp-json/jwt-auth/v1/token - Login để lấy JWT token
- POST /wp-json/jwt-auth/v1/token/validate - Validate JWT token

## 2. User Management APIs
- GET /wp-json/mb/v1/users - Lấy danh sách users
- POST /wp-json/mb/v1/users - Tạo user mới
- PUT /wp-json/mb/v1/users/{id} - Cập nhật thông tin user
- DELETE /wp-json/mb/v1/users/{id} - Xóa user
- POST /wp-json/mb/v1/users/attendance - Chấm công (yêu cầu WiFi công ty)
- GET /wp-json/mb/v1/users/{id}/attendance - Xem thông tin chấm công
- GET /wp-json/mb/v1/users/{id}/rewards - Xem thông tin thưởng phạt
- POST /wp-json/mb/v1/rewards - Tạo thưởng/phạt mới (status mặc định là pending)
- GET /wp-json/mb/v1/rewards - Lấy danh sách thưởng/phạt (có filter theo status)
- PUT /wp-json/mb/v1/rewards/{id}/approve - Duyệt thưởng/phạt (chỉ admin/manager)
- PUT /wp-json/mb/v1/rewards/{id}/reject - Từ chối thưởng/phạt (chỉ admin/manager)
- GET /wp-json/mb/v1/users/{id}/monthly-summary - Tổng hợp chấm công và thưởng phạt theo tháng

## 3. Customer Management APIs
- GET /wp-json/mb/v1/customers - Lấy danh sách khách hàng
- POST /wp-json/mb/v1/customers - Thêm khách hàng mới
- PUT /wp-json/mb/v1/customers/{id} - Cập nhật thông tin khách hàng
- DELETE /wp-json/mb/v1/customers/{id} - Xóa khách hàng
- POST /wp-json/mb/v1/customers/{id}/assign - Phân công khách hàng cho nhân viên
- GET /wp-json/mb/v1/customers/{id}/history - Xem lịch sử chăm sóc khách hàng
- POST /wp-json/mb/v1/appointments - Tạo lịch hẹn
- GET /wp-json/mb/v1/appointments - Xem danh sách lịch hẹn
- PUT /wp-json/mb/v1/appointments/{id} - Cập nhật lịch hẹn
- GET /wp-json/mb/v1/customers/by-source - Lấy danh sách khách theo nguồn
- GET /wp-json/mb/v1/customers/appointments/today - Lấy lịch hẹn trong ngày
- PUT /wp-json/mb/v1/appointments/{id}/take - Sale tiếp nhận khách từ lịch hẹn

## 4. Product Management APIs
- GET /wp-json/mb/v1/products - Lấy danh sách sản phẩm
- POST /wp-json/mb/v1/products - Thêm sản phẩm mới
- PUT /wp-json/mb/v1/products/{id} - Cập nhật thông tin sản phẩm
- DELETE /wp-json/mb/v1/products/{id} - Xóa sản phẩm
- GET /wp-json/mb/v1/products/{id}/availability - Kiểm tra tình trạng có sẵn
- GET /wp-json/mb/v1/products/{id}/history - Xem lịch sử cho thuê
- GET /wp-json/mb/v1/products/by-category - Lấy sản phẩm theo danh mục
- GET /wp-json/mb/v1/products/{id}/maintenance - Lấy lịch sử bảo trì/sửa chữa
- POST /wp-json/mb/v1/products/maintenance-request - Tạo yêu cầu bảo trì/sửa chữa

## 5. Contract Management APIs
- GET /wp-json/mb/v1/contracts - Lấy danh sách hợp đồng
- POST /wp-json/mb/v1/contracts - Tạo hợp đồng mới
- PUT /wp-json/mb/v1/contracts/{id} - Cập nhật hợp đồng
- GET /wp-json/mb/v1/contracts/{id} - Xem chi tiết hợp đồng
- POST /wp-json/mb/v1/contracts/{id}/notes - Thêm ghi chú
- PUT /wp-json/mb/v1/contracts/{id}/notes/{note_id} - Cập nhật ghi chú
- GET /wp-json/mb/v1/contracts/{id}/notes - Xem lịch sử ghi chú
- POST /wp-json/mb/v1/contracts/{id}/reports - Tạo báo cáo sau hợp đồng
- POST /wp-json/mb/v1/contracts/{id}/payments - Thêm thanh toán
- GET /wp-json/mb/v1/contracts/by-type - Lấy hợp đồng theo loại
- GET /wp-json/mb/v1/contracts/overdue - Lấy hợp đồng quá hạn thanh toán
- GET /wp-json/mb/v1/photographers/{id}/schedule - Lấy lịch của thợ chụp ảnh

## 6. Task Management APIs
- GET /wp-json/mb/v1/tasks - Lấy danh sách công việc
- POST /wp-json/mb/v1/tasks - Tạo công việc mới
- PUT /wp-json/mb/v1/tasks/{id} - Cập nhật công việc
- POST /wp-json/mb/v1/tasks/{id}/comments - Thêm comment
- GET /wp-json/mb/v1/tasks/{id}/history - Xem lịch sử công việc

## 7. Notification APIs
- GET /wp-json/mb/v1/notifications - Lấy danh sách thông báo
- PUT /wp-json/mb/v1/notifications/{id} - Đánh dấu đã đọc
- DELETE /wp-json/mb/v1/notifications/{id} - Xóa thông báo

## 8. Financial Management APIs
- GET /wp-json/mb/v1/finances/income - Xem danh sách thu
- POST /wp-json/mb/v1/finances/income - Thêm khoản thu
- GET /wp-json/mb/v1/finances/expense - Xem danh sách chi
- POST /wp-json/mb/v1/finances/expense - Thêm khoản chi
- GET /wp-json/mb/v1/finances/reports - Xem báo cáo tài chính
- GET /wp-json/mb/v1/finances/purchase-requests - Lấy danh sách yêu cầu mua sắm
- POST /wp-json/mb/v1/finances/purchase-requests - Tạo yêu cầu mua sắm mới
- PUT /wp-json/mb/v1/finances/purchase-requests/{id}/approve - Duyệt yêu cầu mua sắm

## 9. Product Inspection APIs
- POST /wp-json/mb/v1/inspections - Tạo báo cáo kiểm tra sản phẩm mới
- GET /wp-json/mb/v1/inspections - Lấy danh sách báo cáo kiểm tra (có filter theo status)
- GET /wp-json/mb/v1/inspections/{id} - Xem chi tiết báo cáo kiểm tra
- PUT /wp-json/mb/v1/inspections/{id} - Cập nhật báo cáo kiểm tra
- POST /wp-json/mb/v1/inspections/{id}/check - Xác nhận đã kiểm tra (chuyển status thành checked)
- POST /wp-json/mb/v1/inspections/{id}/approve - Duyệt báo cáo kiểm tra (chuyển status thành approved)
- GET /wp-json/mb/v1/inspections/{id}/history - Xem lịch sử thay đổi của báo cáo
- POST /wp-json/mb/v1/inspections/{id}/images - Upload ảnh cho báo cáo 
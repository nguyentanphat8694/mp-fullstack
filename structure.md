# MB Management Plugin Structure

mb-management/
├── mb-management.php                 # Plugin main file
├── README.md                         # Plugin documentation
│
├── includes/                         # Core plugin files
│   ├── class-mb-management.php       # Main plugin class
│   ├── class-mb-activator.php        # Plugin activation handler
│   ├── class-mb-deactivator.php      # Plugin deactivation handler
│   │
│   ├── api/                          # REST API endpoints
│   │   ├── class-mb-api.php          # Base API class
│   │   ├── class-mb-user-api.php     # User management endpoints
│   │   ├── class-mb-attendance-api.php   # Attendance management endpoints
│   │   ├── class-mb-reward-api.php      # Reward/Penalty management endpoints
│   │   ├── class-mb-customer-api.php # Customer management endpoints
│   │   ├── class-mb-product-api.php  # Product management endpoints
│   │   ├── class-mb-contract-api.php # Contract management endpoints
│   │   ├── class-mb-task-api.php     # Task management endpoints
│   │   ├── class-mb-notification-api.php  # Notification endpoints
│   │   ├── class-mb-finance-api.php  # Financial management endpoints
│   │   └── class-mb-inspection-api.php    # Product inspection endpoints
│   │
│   ├── models/                       # Database models
│   │   ├── class-mb-model.php        # Base model class
│   │   ├── class-mb-attendance.php   # Attendance model
│   │   ├── class-mb-reward.php       # Reward model
│   │   ├── class-mb-customer.php     # Customer model
│   │   ├── class-mb-customer-history.php # Customer history model
│   │   ├── class-mb-appointment.php  # Appointment model
│   │   ├── class-mb-product.php      # Product model
│   │   ├── class-mb-product-history.php # Product history model
│   │   ├── class-mb-product-inspection.php # Product inspection model
│   │   ├── class-mb-product-inspection-history.php # Inspection history model
│   │   ├── class-mb-contract.php     # Contract model
│   │   ├── class-mb-contract-item.php # Contract item model
│   │   ├── class-mb-contract-note.php # Contract note model
│   │   ├── class-mb-contract-payment.php # Contract payment model
│   │   ├── class-mb-task.php         # Task model
│   │   ├── class-mb-task-comment.php # Task comment model
│   │   ├── class-mb-notification.php # Notification model
│   │   └── class-mb-transaction.php  # Financial transaction model
│   │
│   ├── controllers/                  # Business logic controllers
│   │   ├── class-mb-user.php         # User management
│   │   ├── class-mb-attendance.php   # Attendance management
│   │   ├── class-mb-reward.php       # Reward/Penalty management
│   │   ├── class-mb-customer.php     # Customer management
│   │   ├── class-mb-product.php      # Product management
│   │   ├── class-mb-inspection.php   # Product inspection management
│   │   ├── class-mb-contract.php     # Contract management
│   │   ├── class-mb-task.php         # Task management
│   │   ├── class-mb-notification.php # Notification management
│   │   └── class-mb-finance.php      # Financial management
│   │
│   ├── services/                     # Service classes
│   │   ├── class-mb-wifi.php         # WiFi validation service
│   │   ├── class-mb-notification.php # Notification service
│   │   └── class-mb-upload.php       # File upload service
│   │
│   └── utils/                        # Utility classes
│       ├── class-mb-database.php     # Database utilities
│       ├── class-mb-validator.php    # Data validation
│       ├── class-mb-sanitizer.php    # Data sanitization
│       └── class-mb-logger.php       # Logging utilities

Chi tiết chức năng từng thành phần:

1. API Classes (api/):
- class-mb-api.php: Base class cho tất cả API, xử lý authentication và response format
- class-mb-user-api.php: Quản lý user và roles
- class-mb-attendance-api.php: API chấm công qua WiFi, xem báo cáo chấm công
- class-mb-reward-api.php: API quản lý thưởng phạt, duyệt và báo cáo
- class-mb-customer-api.php: Quản lý khách hàng, lịch hẹn và lịch sử chăm sóc
- class-mb-product-api.php: Quản lý sản phẩm, tình trạng và lịch sử cho thuê
- class-mb-contract-api.php: Quản lý hợp đồng, thanh toán và ghi chú
- class-mb-task-api.php: Quản lý công việc và theo dõi tiến độ
- class-mb-notification-api.php: Quản lý thông báo hệ thống
- class-mb-finance-api.php: Quản lý thu chi, báo cáo tài chính
- class-mb-inspection-api.php: Quản lý kiểm tra sản phẩm sau thuê

2. Model Classes (models/):
- class-mb-model.php: Base model với các phương thức CRUD cơ bản
- class-mb-attendance.php: Xử lý dữ liệu chấm công
- class-mb-reward.php: Xử lý dữ liệu thưởng phạt
- class-mb-customer.php + history: Xử lý dữ liệu khách hàng và lịch sử
- class-mb-appointment.php: Xử lý dữ liệu lịch hẹn
- class-mb-product.php + history: Xử lý dữ liệu sản phẩm và lịch sử
- class-mb-product-inspection.php + history: Xử lý dữ liệu kiểm tra sản phẩm
- class-mb-contract.php + items/notes/payments: Xử lý dữ liệu hợp đồng và các thành phần
- class-mb-task.php + comments: Xử lý dữ liệu công việc và bình luận
- class-mb-notification.php: Xử lý dữ liệu thông báo
- class-mb-transaction.php: Xử lý dữ liệu thu chi

3. Controller Classes (controllers/):
- class-mb-user.php: Logic quản lý user và phân quyền
- class-mb-attendance.php: Logic chấm công và báo cáo
- class-mb-reward.php: Logic thưởng phạt và duyệt
- class-mb-customer.php: Logic quản lý khách hàng và chăm sóc
- class-mb-product.php: Logic quản lý sản phẩm và cho thuê
- class-mb-inspection.php: Logic kiểm tra và báo cáo sản phẩm
- class-mb-contract.php: Logic quản lý hợp đồng và thanh toán
- class-mb-task.php: Logic quản lý công việc
- class-mb-notification.php: Logic xử lý và gửi thông báo
- class-mb-finance.php: Logic quản lý tài chính

4. Service Classes (services/):
- class-mb-wifi.php: Kiểm tra và xác thực WiFi công ty
- class-mb-notification.php: Xử lý gửi thông báo
- class-mb-upload.php: Xử lý upload files

5. Utility Classes (utils/):
- class-mb-database.php: Các hàm tiện ích thao tác database
- class-mb-validator.php: Kiểm tra dữ liệu đầu vào
- class-mb-sanitizer.php: Làm sạch dữ liệu
- class-mb-logger.php: Ghi log hệ thống
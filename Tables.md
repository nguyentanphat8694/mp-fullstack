# Wedding Management System Database Tables

## 1. Quản lý nhân viên
### mb_attendance
- id (bigint) - Primary Key
- user_id (bigint) - FK to wp_users
- check_in (datetime)
- check_out (datetime)
- ip_address (varchar)
- wifi_name (varchar)
- created_at (datetime)

### mb_rewards
- id (bigint) - Primary Key
- user_id (bigint) - FK to wp_users
- type (enum) - 'reward' or 'penalty'
- amount (decimal)
- reason (text)
- status (enum) - 'pending', 'approved', 'rejected'
- approved_by (bigint) - FK to wp_users (nullable)
- approved_at (datetime) (nullable)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

## 2. Quản lý khách hàng
### mb_customers
- id (bigint) - Primary Key
- name (varchar)
- phone (varchar)
- source (enum) - 'facebook', 'tiktok', 'youtube', 'walk_in'
- assigned_to (bigint) - FK to wp_users (nullable)
- status (enum)
- created_by (bigint) - FK to wp_users
- created_at (datetime)
- updated_at (datetime)

### mb_customer_history
- id (bigint) - Primary Key
- customer_id (bigint) - FK to mb_customers
- action (varchar)
- note (text)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

### mb_appointments
- id (bigint) - Primary Key
- customer_id (bigint) - FK to mb_customers
- appointment_date (datetime)
- status (enum) - 'scheduled', 'completed', 'cancelled'
- assigned_to (bigint) - FK to wp_users (nullable)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

## 3. Quản lý sản phẩm
### mb_products
- id (bigint) - Primary Key
- code (varchar)
- name (varchar)
- category (enum) - 'wedding_dress', 'vest', 'accessories', 'ao_dai'
- status (enum) - 'available', 'rented', 'maintenance'
- description (text)
- images (text) - JSON chứa đường dẫn ảnh sản phẩm (nullable)
- created_at (datetime)
- updated_at (datetime)

### mb_product_history
- id (bigint) - Primary Key
- product_id (bigint) - FK to mb_products
- action (varchar)
- note (text)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

### mb_product_inspections
- id (bigint) - Primary Key
- contract_id (bigint) - FK to mb_contracts
- product_id (bigint) - FK to mb_products
- status (enum) - 'pending', 'checked', 'approved'
- condition_report (text) - Báo cáo tình trạng sản phẩm
- issues (text) - Các vấn đề phát hiện (nullable)
- recommendations (text) - Đề xuất xử lý (nullable)
- created_by (bigint) - FK to wp_users - Người tạo báo cáo
- created_at (datetime)
- checked_by (bigint) - FK to wp_users (nullable) - Người kiểm tra
- checked_at (datetime) (nullable)
- approved_by (bigint) - FK to wp_users (nullable) - Người duyệt cuối cùng
- approved_at (datetime) (nullable)
- notes (text) (nullable) - Ghi chú thêm

### mb_product_inspection_history
- id (bigint) - Primary Key
- inspection_id (bigint) - FK to mb_product_inspections
- action (varchar) - Hành động thực hiện
- status_from (varchar) - Trạng thái trước
- status_to (varchar) - Trạng thái sau
- note (text) (nullable)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

## 4. Quản lý hợp đồng
### mb_contracts
- id (bigint) - Primary Key
- customer_id (bigint) - FK to mb_customers
- type (enum) - 'dress_rental', 'wedding_photo', 'pre_wedding_photo'
- total_amount (decimal)
- paid_amount (decimal)
- status (enum)
- start_date (date)
- end_date (date)
- photographer_id (bigint) - FK to wp_users (nullable)
- created_by (bigint) - FK to wp_users
- created_at (datetime)
- updated_at (datetime)

### mb_contract_items
- id (bigint) - Primary Key
- contract_id (bigint) - FK to mb_contracts
- product_id (bigint) - FK to mb_products
- rental_start (date)
- rental_end (date)
- created_at (datetime)

### mb_contract_notes
- id (bigint) - Primary Key
- contract_id (bigint) - FK to mb_contracts
- note (text)
- status (enum) - 'pending', 'approved', 'rejected'
- approved_by (bigint) - FK to wp_users (nullable)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

### mb_contract_payments
- id (bigint) - Primary Key
- contract_id (bigint) - FK to mb_contracts
- amount (decimal)
- payment_date (datetime)
- payment_method (varchar)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

## 5. Quản lý công việc
### mb_tasks
- id (bigint) - Primary Key
- title (varchar)
- description (text)
- assigned_to (bigint) - FK to wp_users (nullable)
- status (enum) - 'pending', 'in_progress', 'completed'
- due_date (datetime)
- created_by (bigint) - FK to wp_users
- created_at (datetime)
- updated_at (datetime)

### mb_task_comments
- id (bigint) - Primary Key
- task_id (bigint) - FK to mb_tasks
- comment (text)
- created_by (bigint) - FK to wp_users
- created_at (datetime)

## 6. Quản lý thông báo
### mb_notifications
- id (bigint) - Primary Key
- user_id (bigint) - FK to wp_users
- type (varchar)
- title (varchar)
- content (text)
- read_at (datetime)
- created_at (datetime)

## 7. Quản lý tài chính
### mb_transactions
- id (bigint) - Primary Key
- type (enum) - 'income', 'expense'
- amount (decimal)
- description (text)
- contract_id (bigint) - FK to mb_contracts (nullable)
- created_by (bigint) - FK to wp_users
- created_at (datetime) 
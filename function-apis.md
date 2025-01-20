# MB Management API Documentation

## Contract APIs

### Get Contracts
- Endpoint: `/wp-json/mb/v1/contracts`
- Method: GET
- Permission: mb_view_contracts
- Query params: page, per_page, status, customer_id

### Create Contract
- Endpoint: `/wp-json/mb/v1/contracts`
- Method: POST
- Permission: mb_create_contracts
- Payload: customer_id, type (dress_rental|wedding_photo|pre_wedding_photo), total_amount, start_date, end_date, photographer_id (optional), items (array of product_id, rental_start, rental_end)

### Get Contract by Type
- Endpoint: `/wp-json/mb/v1/contracts/by-type`
- Method: GET
- Permission: mb_view_contracts
- Query params: type (dress_rental|wedding_photo|pre_wedding_photo)

### Get Overdue Contracts
- Endpoint: `/wp-json/mb/v1/contracts/overdue`
- Method: GET
- Permission: mb_view_contracts

### Get Photographer Schedule
- Endpoint: `/wp-json/mb/v1/photographers/{id}/schedule`
- Method: GET
- Permission: mb_view_contracts

## Contract Items APIs

### Get Contract Items
- Endpoint: `/wp-json/mb/v1/contracts/{id}/items`
- Method: GET
- Permission: mb_view_contracts

### Add Contract Item
- Endpoint: `/wp-json/mb/v1/contracts/{id}/items`
- Method: POST
- Permission: mb_edit_contracts
- Payload: product_id, rental_period (start, end), quantity (optional), note (optional)

### Update Contract Item
- Endpoint: `/wp-json/mb/v1/contracts/{contract_id}/items/{item_id}`
- Method: PUT
- Permission: mb_edit_contracts
- Payload: rental_period (start, end), quantity (optional), note (optional)

### Delete Contract Item
- Endpoint: `/wp-json/mb/v1/contracts/{contract_id}/items/{item_id}`
- Method: DELETE
- Permission: mb_edit_contracts

## Contract Notes APIs

### Get Contract Notes
- Endpoint: `/wp-json/mb/v1/contracts/{id}/notes`
- Method: GET
- Permission: mb_view_contracts

### Add Contract Note
- Endpoint: `/wp-json/mb/v1/contracts/{id}/notes`
- Method: POST
- Permission: mb_edit_contracts
- Payload: content, status (pending|approved|rejected)

### Update Contract Note
- Endpoint: `/wp-json/mb/v1/contracts/{contract_id}/notes/{note_id}`
- Method: PUT
- Permission: mb_edit_contracts
- Payload: content, status (pending|approved|rejected)

### Process Note
- Endpoint: `/wp-json/mb/v1/contracts/{contract_id}/notes/{note_id}/process`
- Method: POST
- Permission: mb_approve_contract_notes
- Payload: action (approve|reject)

## Contract Payments APIs

### Get Contract Payments
- Endpoint: `/wp-json/mb/v1/contracts/{id}/payments`
- Method: GET
- Permission: mb_view_contract_payments

### Add Payment
- Endpoint: `/wp-json/mb/v1/contracts/{id}/payments`
- Method: POST
- Permission: mb_add_contract_payments
- Payload: amount, payment_method, note (optional)

## Product Inspection APIs

### Get Inspections
- Endpoint: `/wp-json/mb/v1/inspections`
- Method: GET
- Permission: mb_view_inspections
- Query params: status

### Create Inspection
- Endpoint: `/wp-json/mb/v1/inspections`
- Method: POST
- Permission: mb_create_inspections
- Payload: product_id, description, status (pending|checked|approved), note (optional)

### Get Inspection
- Endpoint: `/wp-json/mb/v1/inspections/{id}`
- Method: GET
- Permission: mb_view_inspections

### Update Inspection
- Endpoint: `/wp-json/mb/v1/inspections/{id}`
- Method: PUT
- Permission: mb_update_inspections
- Payload: description, status (pending|checked|approved), note (optional)

### Get Inspection History
- Endpoint: `/wp-json/mb/v1/inspections/{id}/history`
- Method: GET
- Permission: mb_view_inspections

### Upload Inspection Images
- Endpoint: `/wp-json/mb/v1/inspections/{id}/images`
- Method: POST
- Permission: mb_update_inspections
- Payload: files (multipart/form-data)

## Product Maintenance APIs

### Create Maintenance Request
- Endpoint: `/wp-json/mb/v1/products/maintenance-request`
- Method: POST
- Permission: mb_update_product_status
- Payload: product_id, description

## Task APIs

### Get Tasks
- Endpoint: `/wp-json/mb/v1/tasks`
- Method: GET
- Permission: mb_view_tasks

### Create Task
- Endpoint: `/wp-json/mb/v1/tasks`
- Method: POST
- Permission: mb_create_tasks
- Payload: title, description, due_date, priority (optional), assigned_to (optional)

### Update Task
- Endpoint: `/wp-json/mb/v1/tasks/{id}`
- Method: PUT
- Permission: mb_edit_tasks
- Payload: status

### Get Assigned Tasks
- Endpoint: `/wp-json/mb/v1/tasks/assigned`
- Method: GET
- Permission: mb_view_assigned_tasks

## Task Comments APIs

### Get Task Comments
- Endpoint: `/wp-json/mb/v1/tasks/{id}/comments`
- Method: GET
- Permission: mb_view_task_comments

### Add Task Comment
- Endpoint: `/wp-json/mb/v1/tasks/{id}/comments`
- Method: POST
- Permission: mb_add_task_comments
- Payload: content, attachment (optional)

## Finance APIs

### Get Income
- Endpoint: `/wp-json/mb/v1/finances/income`
- Method: GET
- Permission: mb_view_finances

### Create Income
- Endpoint: `/wp-json/mb/v1/finances/income`
- Method: POST
- Permission: mb_edit_finances
- Payload: amount, description, type, reference (optional), date (optional)

### Get Purchase Requests
- Endpoint: `/wp-json/mb/v1/finances/purchase-requests`
- Method: GET
- Permission: mb_view_purchases

### Create Purchase Request
- Endpoint: `/wp-json/mb/v1/finances/purchase-requests`
- Method: POST
- Permission: mb_create_purchases
- Payload: title, description, amount, reason, priority (optional)

### Process Purchase Request
- Endpoint: `/wp-json/mb/v1/finances/purchase-requests/{id}/process`
- Method: POST
- Permission: mb_approve_purchases
- Payload: action (approve|reject), note (optional)

## Notification APIs

### Get Notifications
- Endpoint: `/wp-json/mb/v1/notifications`
- Method: GET
- Permission: mb_view_notifications

### Mark Notification as Read
- Endpoint: `/wp-json/mb/v1/notifications/{id}/read`
- Method: POST
- Permission: mb_edit_notifications

### Delete Notification
- Endpoint: `/wp-json/mb/v1/notifications/{id}`
- Method: DELETE
- Permission: mb_edit_notifications

## Category APIs

### Get Categories
- Endpoint: `/wp-json/mb/v1/categories`
- Method: GET
- Permission: mb_view_products 

## Contract Report APIs

### Create Contract Report
- Endpoint: `/wp-json/mb/v1/contracts/{id}/reports`
- Method: POST
- Permission: mb_create_inspection_reports
- Payload: items (array), status (good|damaged|lost), description, images (array)

### Get Contract Reports
- Endpoint: `/wp-json/mb/v1/contracts/{id}/reports`
- Method: GET
- Permission: mb_view_inspection_reports

## Finance APIs

### Get Expense
- Endpoint: `/wp-json/mb/v1/finances/expense`
- Method: GET
- Permission: mb_view_finances

### Create Expense
- Endpoint: `/wp-json/mb/v1/finances/expense`
- Method: POST
- Permission: mb_edit_finances
- Payload: amount, description, type, reference (optional), date (optional)

## Purchase Request APIs

### Get Purchase Requests Summary
- Endpoint: `/wp-json/mb/v1/finances/purchase-requests/summary`
- Method: GET
- Permission: mb_view_purchases

### Approve Purchase Request
- Endpoint: `/wp-json/mb/v1/finances/purchase-requests/{id}/approve`
- Method: PUT
- Permission: mb_approve_purchases
- Payload: action (approve|reject), note (optional)

## Financial Report APIs

### Get Transactions
- Endpoint: `/wp-json/mb/v1/finances/reports/transactions`
- Method: GET
- Permission: mb_view_financial_reports

### Get Transactions by Type
- Endpoint: `/wp-json/mb/v1/finances/reports/transactions/by-type`
- Method: GET
- Permission: mb_view_financial_reports

### Get Contract Transactions
- Endpoint: `/wp-json/mb/v1/finances/reports/contracts/{id}/transactions`
- Method: GET
- Permission: mb_view_financial_reports

## Product Inspection APIs

### Get Products
- Endpoint: `/wp-json/mb/v1/inspections`
- Method: GET
- Permission: mb_view_products
- Query params: status

### Create Product
- Endpoint: `/wp-json/mb/v1/inspections`
- Method: POST
- Permission: mb_create_inspections
- Payload: product_id, description, status (optional)

### Get Product
- Endpoint: `/wp-json/mb/v1/inspections/{id}`
- Method: GET
- Permission: mb_view_products

### Update Product
- Endpoint: `/wp-json/mb/v1/inspections/{id}`
- Method: PUT
- Permission: mb_create_inspections
- Payload: description, status

### Approve Product
- Endpoint: `/wp-json/mb/v1/inspections/{id}/approve`
- Method: PUT
- Permission: mb_approve_inspections
- Payload: status, note (optional)

### Get Product History
- Endpoint: `/wp-json/mb/v1/inspections/{id}/history`
- Method: GET
- Permission: mb_view_products

### Upload Product Images
- Endpoint: `/wp-json/mb/v1/inspections/{id}/images`
- Method: POST
- Permission: mb_create_inspections
- Payload: files (multipart/form-data)

## Product Maintenance APIs

### Create Maintenance Request
- Endpoint: `/wp-json/mb/v1/products/maintenance-request`
- Method: POST
- Permission: mb_update_product_status
- Payload: product_id, description

## Task APIs

### Get Tasks
- Endpoint: `/wp-json/mb/v1/tasks`
- Method: GET
- Permission: mb_view_tasks

### Create Task
- Endpoint: `/wp-json/mb/v1/tasks`
- Method: POST
- Permission: mb_create_tasks
- Payload: title, description, due_date, priority (optional), assigned_to (optional)

### Update Task
- Endpoint: `/wp-json/mb/v1/tasks/{id}`
- Method: PUT
- Permission: mb_edit_tasks
- Payload: status

### Get Assigned Tasks
- Endpoint: `/wp-json/mb/v1/tasks/assigned`
- Method: GET
- Permission: mb_view_tasks

### Assign Task
- Endpoint: `/wp-json/mb/v1/tasks/{id}/assign`
- Method: PUT
- Permission: mb_assign_tasks
- Payload: user_id

## Task Comment APIs

### Get Task Comments
- Endpoint: `/wp-json/mb/v1/tasks/{id}/comments`
- Method: GET
- Permission: mb_view_task_comments

### Add Task Comment
- Endpoint: `/wp-json/mb/v1/tasks/{id}/comments`
- Method: POST
- Permission: mb_add_task_comments
- Payload: content, attachment (optional) 
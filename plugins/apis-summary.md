# API Summary

##x Customer APIs
- `POST /mb/v1/customer` - Create a new customer(name, phone, source enum('facebook','tiktok','youtube','walk_in'), assigned_to)
- `GET /mb/v1/customer` - Get all customers ('search' (search theo 'name', 'phone')'source', 'status', 'assigned_to', 'created_by','offset') {data: [{id, name, phone, source, assigned_to_name, status, created_by_name, created_at}], total_data}
- `GET /mb/v1/customer/{id}` - Get a specific customer () {id, name, phone, source, assigned_to_name, status, created_by_name, created_at}
- `PUT /mb/v1/customer/{id}` - Update a customer (name, phone, source enum('facebook','tiktok','youtube','walk_in'))
- `DELETE /mb/v1/customer/{id}` - Delete a customer ()
- `POST /mb/v1/customer/assign` - Assign a customer to a user (customer_id, user_id)
- `GET /mb/v1/customer/history/{id}` - Get customer history by customer ID () ([{id, customer_name, action, note, created_by_name, created_at}])
- `POST /mb/v1/customer/status` - Update customer status (customer_id, status, action_name, note)
-xx `GET /mb/v1/customer/select` - Option for customer status (search) ([{id, name}]}

##x Product APIs
- `POST /mb/v1/product` - Create a new product (code, name, category enum('wedding_dress','vest','accessories','ao_dai'), description, images)
- `GET /mb/v1/product` - Get all products (search, offset, category) {data: [{id, code, name, category}], total_data}
- `GET /mb/v1/product/{id}` - Get a specific product () {id, code, name, category, description, images, created_at, created_by}
- `PUT /mb/v1/product/{id}` - Update a product (code, name, category enum('wedding_dress','vest','accessories','ao_dai'), description, images)
- `DELETE /mb/v1/product/{id}` - Delete a product () [{id, code, name}]
-xx `GET /mb/v1/product/select` - Get products by name for select (search)
-xx `GET /mb/v1/product/{id}/history` - Get a specific product history (limit, offset) [{contract_id, rental_start, rental_end, customer_name}]
-xx `GET /mb/v1/product/{id}/check` - Get a check params (start_date, end_date) ([{contract_id: 1, customer_name: 'Ong A', rental_start: 'dd/MM/yyyy HH:mm:ss', rental_end: 'dd/MM/yyyy HH:mm:ss'}])

## User APIs
- `POST /mb/v1/user` - Create a new user (username, password, email, role, last_name, first_name)
- `GET /mb/v1/user` - Get a list user (search (search theo first_name, last_name, display_name), role, offset) {data: [{(id, username, email, first_name, last_name, created_at)}], total_data}
- `GET /mb/v1/user/{id}` - Get a specific user () (id, username, email, first_name, last_name, created_at)
- `PUT /mb/v1/user/{id}` - Update a user (username, email, role, last_name, first_name)
- `DELETE /mb/v1/user/{id}` - Delete a user
-xx `GET /mb/v1/user/role` - Get users by role (role (array string)) ([{id: 1, display_name: 'Nguyen Van A'}])

## Setting APIs
- `POST /mb/v1/setting` - Create a new setting (setting_name, setting_value)
- `GET /mb/v1/setting` - Get all settings (id, setting_name, setting_value)
- `GET /mb/v1/setting/{id}` - Get a specific setting
- `PUT /mb/v1/setting/{id}` - Update a setting
- `DELETE /mb/v1/setting/{id}` - Delete a setting

##x Appointment APIs
- `POST /mb/v1/appointment` - Create a new appointment (customer_id, appointment_date, note) 
-xx `GET /mb/v1/appointment` - Get all appointments (date, status, assigned_to) ({data: [{customer_name, customer_phone, status enum('scheduled','receiving','completed','cancelled'), appointment_date, assigned_to_name, created_at, note}], total_data)
- `GET /mb/v1/appointment/{id}` - Get a specific appointment () ({customer_id, apointment_date, note})
- `PUT /mb/v1/appointment/{id}` - Update an appointment (customer_id, appointment_date, note) 
- `DELETE /mb/v1/appointment/{id}` - Delete an appointment ()
-xx `PUT /mb/v1/appointment/{id}/assign` - Assign/unassign an appointment {type: bool}
-xx `PUT /mb/v1/appointment/{id}/completed` - Complete or cancelled an appointment {type: bool, note: string}

## Task APIs
-xx `POST /mb/v1/task` - Create a new task (title, description, assigned_to, due_date)
-xx `GET /mb/v1/task` - Get all task (search (search theo field title, description), assigned_to, created_at, status) ({data: {id, title, description, created_at, due_date status, user_name (của assigned_to)Ư, total_data})
-xx `DELETE /mb/v1/task/{id}` - Delete a specific task ()
-xx `GET /mb/v1/task/{id}` - Get a specific task ({id: 'id', title: 'title', description: 'description', 'status', user_name: 'display name, due_date: date_time, comments: [{user_name: 'Nguyen Van A', created_at: created_at, comment: 'comment content'}]})
-xx `PUT /mb/v1/task/{id}` - Update a task (title, description, assigned_to, due_date)
-xx `POST /mb/v1/task/{id}/comment` - Create a new task comment (comment) (user_name, created_at, comment)
-xx `PUT /mb/v1/task/{id}/status` - Update a status task (status)

## Contract APIs
-xx `GET /mb/v1/contract` - Get list contract (search, type, month, year, offset) {data: [{id, customer_name, type, start_date, end_date, total_amout}], total_data}
-xx `POST /mb/v1/contract` - Create a new contract ({main: {customer_id, type, start_date, end_date, total_amout}, note:{note}, payment:{amount, payment_date, payment_method}, product:{rental_start, rental_end}, photographer: {start_date, end_date})
-xx `PUT /mb/v1/contract/{id}` - Edit a contract ({main: {customer_id, type, start_date, end_date, total_amout}, note:{id, note}, payment:{id, amount, payment_date, payment_method}, product:{id, rental_start, rental_end}, photographer: {id, start_date, end_date})
-xx `GET /mb/v1/contract/{id}` () {main: {id, customer_name, type, start_date, end_date, total_amout, paid_amount}, note:[{id, note, user_created_by_name, status}], payment:[{id, amount, payment_date, payment_method}], product:[{id, product_code, product_id, product_name, rental_start, rental_end}], photographer: [{photographer_name, start_date, end_date}]}
-xx `GET /mb/v1/contract/{id}/note/approve` Approve a note (isApprove: bool, contract_note_id)

## Finance APIs
-xx `GET /mb/v1/finance` - Get list transaction (type, month, year, limit, offset) {data: [{id, type, amount, description, created_by_name, created_at, contract_payment_id}], total_data: count_total_record}
-xx `GET /mb/v1/finance/summary` - Get summary finance (month, year) {total_income, total_expense}
-xx `POST /mb/v1/finance` - Create a new transaction (type, amount, description) 
-xx `PUT /mb/v1/finance/{id}` - Edit a transaction (type, amount, description)
-xx `GET /mb/v1/finance/{id}` - Get a transaction () {id, type, amount, description, created_by_name, created_at}
-xx `DELETE /mb/v1/finance/{id}` - Delete transaction

## Common Response Formats
- Success responses include: `success`, `data`, and `message` fields
- Error responses include: `success`, `error.message`, `error.code`, and optional `error.data.validation_errors` 

hãy tạo file useContractListQuery.js cho API GET /mb/v1/contract với query params search, type, month, year, limit, offset (limit, offset cho pagination), result có dạng [{id:int,customer:{id, name},type:enum('dress_rental','wedding_photo','pre_wedding_photo'),start_date,end_date,total_amount}], sau đó áp dụng cho list file @index.jsx (thêm phần pagination cho list này), sau đó comment lại code integration và mock dữ liệu giả để hiển thị
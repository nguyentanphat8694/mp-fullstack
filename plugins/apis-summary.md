# API Summary

## Customer APIs
- `POST /mb/v1/customer` - Create a new customer
- `POST /mb/v1/customers` - Get all customers
- `GET /mb/v1/customer/{id}` - Get a specific customer
- `PUT /mb/v1/customer/{id}` - Update a customer
- `DELETE /mb/v1/customer/{id}` - Delete a customer
- `POST /mb/v1/customer/assign` - Assign a customer to a user
- `GET /mb/v1/customer/history/{id}` - Get customer history by customer ID
- `POST /mb/v1/customer/status` - Update customer status
-x `GET /mb/v1/customer/select` - Option for customer status (search) ([{id, name}]}

## Product APIs
- `POST /mb/v1/product` - Create a new product
- `POST /mb/v1/products` - Get all products
- `GET /mb/v1/product/{id}` - Get a specific product
- `PUT /mb/v1/product/{id}` - Update a product
- `DELETE /mb/v1/product/{id}` - Delete a product
-x `GET /mb/v1/product/{id}/history` - Get a specific product history (limit, offset)
-x `GET /mb/v1/product/{id}/check` - Get a check params (startDate, endDate) ({isAvailable: true, schedule: [{contract_id: 1, customer_name: 'Ong A', start_date: 'dd/MM/yyyy HH:mm:ss', endDate: 'dd/MM/yyyy HH:mm:ss'}]})

## User APIs
- `POST /mb/v1/user` - Create a new user
- `GET /mb/v1/user/{id}` - Get a specific user
- `PUT /mb/v1/user/{id}` - Update a user
- `DELETE /mb/v1/user/{id}` - Delete a user
-x `GET /mb/v1/user/role/{role_name}` - Get users by role
-x `GET /mb/v1/user/role` - Get users by role (role (array string)) ([{id: 1, display_name: 'Nguyen Van A'}])

## Setting APIs
- `POST /mb/v1/setting` - Create a new setting
- `GET /mb/v1/setting` - Get all settings
- `GET /mb/v1/setting/{id}` - Get a specific setting
- `PUT /mb/v1/setting/{id}` - Update a setting
- `DELETE /mb/v1/setting/{id}` - Delete a setting

## Appointment APIs
- `POST /mb/v1/appointment` - Create a new appointment
- `GET /mb/v1/appointment` - Get all appointments
- `GET /mb/v1/appointment/{id}` - Get a specific appointment
- `PUT /mb/v1/appointment/{id}` - Update an appointment
- `DELETE /mb/v1/appointment/{id}` - Delete an appointment
-x `PUT /mb/v1/appointment/{id}/assign` - Assign/unassign an appointment {type: bool}
-x `PUT /mb/v1/appointment/{id}/completed` - Assign/unassign an appointment {type: bool}

## Task APIs
-x `POST /mb/v1/task` - Create a new task
-x `GET /mb/v1/task` - Get all task
-x `DELETE /mb/v1/task/{id}` - Delete a specific task
-x `GET /mb/v1/task/{id}` - Get a specific task ({title: 'title', description: 'description', 'status', assigned_to: {id: 1, name: 'display name}, due_date: date_time, comments: [{name: 'Nguyen Van A', createdDate: created_date, content: 'comment content'}]})
-x `PUT /mb/v1/task/{id}` - Update a task
-x `POST /mb/v1/task/{id}/comment` - Create a new task comment (id_task, id_user, comment)
-x `PUT /mb/v1/task/{id}/status` - Update a status task (status)

## Contract APIs
-x `GET /mb/v1/contract` - Get list contract (search, type, month, year, limit, offset) ([{id:int,customer:{id, name},type:enum('dress_rental','wedding_photo','pre_wedding_photo'),start_date,end_date,total_amount}])
-x `POST /mb/v1/contract` - Create a new contract ({main: {customer_id, type, start_date, end_date, total_amout}, note:{note}, payment:{amount, payment_date, payment_method}, product:{id, rental_start, rental_end}, photographer: {id, start_date, end_date})
-x `PUT /mb/v1/contract/{id}` - Edit a contract ({main: {customer_id, type, start_date, end_date, total_amout}, note:{note}, payment:{amount, payment_date, payment_method}, product:{id, rental_start, rental_end}, photographer: {id, start_date, end_date})
-x `GET /mb/v1/contract/{id}

## Finance APIs
-x `GET /mb/v1/finance` - Get list transaction (type, month, year, limit, offset)
-x `POST /mb/v1/finance` - Create a new transaction 
-x `PUT /mb/v1/finance/{id}` - Edit a transaction 
-x `DELETE /mb/v1/finance/{id}`

## Common Response Formats
- Success responses include: `success`, `data`, and `message` fields
- Error responses include: `success`, `error.message`, `error.code`, and optional `error.data.validation_errors` 

hãy tạo file useContractListQuery.js cho API GET /mb/v1/contract với query params search, type, month, year, limit, offset (limit, offset cho pagination), result có dạng [{id:int,customer:{id, name},type:enum('dress_rental','wedding_photo','pre_wedding_photo'),start_date,end_date,total_amount}], sau đó áp dụng cho list file @index.jsx (thêm phần pagination cho list này), sau đó comment lại code integration và mock dữ liệu giả để hiển thị
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

## Product APIs
- `POST /mb/v1/product` - Create a new product
- `POST /mb/v1/products` - Get all products
- `GET /mb/v1/product/{id}` - Get a specific product
- `PUT /mb/v1/product/{id}` - Update a product
- `DELETE /mb/v1/product/{id}` - Delete a product

## User APIs
- `POST /mb/v1/user` - Create a new user
- `GET /mb/v1/user/{id}` - Get a specific user
- `PUT /mb/v1/user/{id}` - Update a user
- `DELETE /mb/v1/user/{id}` - Delete a user
- `GET /mb/v1/user/role/{role_name}` - Get users by role

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
- `POST /mb/v1/appointment/{id}/assign` - Assign/unassign an appointment

## Common Response Formats
- Success responses include: `success`, `data`, and `message` fields
- Error responses include: `success`, `error.message`, `error.code`, and optional `error.data.validation_errors` 
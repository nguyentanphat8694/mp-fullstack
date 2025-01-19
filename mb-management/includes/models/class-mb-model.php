<?php

abstract class MB_Model {
    protected $db;
    protected $logger;
    protected $sanitizer;
    protected $validator;
    protected $table_name;
    protected $primary_key = 'id';
    protected $fillable = [];
    protected $required_fields = [];
    protected $date_fields = [];
    protected $datetime_fields = [];
    protected $decimal_fields = [];
    protected $enum_fields = [];
    protected $enum_values = [];

    public function __construct() {
        $this->db = new MB_Database();
        $this->logger = new MB_Logger();
        $this->sanitizer = new MB_Sanitizer();
        $this->validator = new MB_Validator();
    }

    /**
     * Kiểm tra quyền truy cập
     */
    protected function check_permission($action, $data = null) {
        $current_user = wp_get_current_user();
        if (!$current_user->exists()) {
            return new WP_Error('unauthorized', 'Bạn cần đăng nhập để thực hiện thao tác này.');
        }

        // Lấy tên capability từ tên bảng
        $cap_name = str_replace('mb_', '', $this->table_name); // Bỏ prefix mb_

        // Kiểm tra quyền manager (full access)
        if (current_user_can("mb_manage_{$cap_name}")) {
            return true;
        }

        // Kiểm tra quyền cụ thể nếu không có quyền manager
        switch ($action) {
            case 'view':
                if (!current_user_can("mb_view_{$cap_name}") && 
                    !current_user_can("mb_view_assigned_{$cap_name}")) {
                    return new WP_Error('forbidden', 'Bạn không có quyền xem dữ liệu này.');
                }
                break;

            case 'create':
                if (!current_user_can("mb_create_{$cap_name}")) {
                    return new WP_Error('forbidden', 'Bạn không có quyền tạo dữ liệu này.');
                }
                break;

            case 'update':
                if (!current_user_can("mb_update_{$cap_name}") && 
                    !current_user_can("mb_update_assigned_{$cap_name}")) {
                    return new WP_Error('forbidden', 'Bạn không có quyền cập nhật dữ liệu này.');
                }
                break;

            case 'delete':
                if (!current_user_can("mb_delete_{$cap_name}")) {
                    return new WP_Error('forbidden', 'Bạn không có quyền xóa dữ liệu này.');
                }
                break;

            case 'approve':
                if (!current_user_can("mb_approve_{$cap_name}")) {
                    return new WP_Error('forbidden', 'Bạn không có quyền duyệt dữ liệu này.');
                }
                break;
        }

        return true;
    }

    /**
     * Validate dữ liệu đầu vào
     */
    protected function validate($data, $action = 'create') {
        // Kiểm tra required fields khi tạo mới
        if ($action === 'create') {
            $validation = $this->validator->validate_required($data, $this->required_fields);
            if (is_wp_error($validation)) {
                return $validation;
            }
        }

        // Validate các trường date
        foreach ($this->date_fields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                if (!$this->validator->validate_date($data[$field])) {
                    return new WP_Error('invalid_date', "Trường {$field} không đúng định dạng ngày (Y-m-d).");
                }
            }
        }

        // Validate các trường datetime
        foreach ($this->datetime_fields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                if (!$this->validator->validate_datetime($data[$field])) {
                    return new WP_Error('invalid_datetime', "Trường {$field} không đúng định dạng ngày giờ (Y-m-d H:i:s).");
                }
            }
        }

        // Validate các trường decimal
        foreach ($this->decimal_fields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                if (!$this->validator->validate_decimal($data[$field])) {
                    return new WP_Error('invalid_decimal', "Trường {$field} phải là số thập phân.");
                }
            }
        }

        // Validate các trường enum
        foreach ($this->enum_fields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                if (!$this->validator->validate_enum($data[$field], $this->enum_values[$field])) {
                    return new WP_Error('invalid_enum', "Giá trị của trường {$field} không hợp lệ.");
                }
            }
        }

        return true;
    }

    /**
     * Lấy tất cả records
     */
    public function get_all($args = array()) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        try {
            global $wpdb;
            $defaults = array(
                'orderby' => 'id',
                'order' => 'DESC',
                'limit' => 20,
                'offset' => 0,
                'where' => array(),
                'search' => ''
            );

            $args = array_merge($defaults, $args);
            $where_conditions = array();
            $where_values = array();

            // Xử lý điều kiện where
            if (!empty($args['where'])) {
                foreach ($args['where'] as $field => $value) {
                    if (isset($value)) {
                        $where_conditions[] = "`$field` = %s";
                        $where_values[] = $value;
                    }
                }
            }

            // Xử lý tìm kiếm
            if (!empty($args['search'])) {
                $search_fields = isset($args['search_fields']) ? $args['search_fields'] : array('name');
                $search_conditions = array();
                foreach ($search_fields as $field) {
                    $search_conditions[] = "`$field` LIKE %s";
                    $where_values[] = '%' . $wpdb->esc_like($args['search']) . '%';
                }
                if (!empty($search_conditions)) {
                    $where_conditions[] = '(' . implode(' OR ', $search_conditions) . ')';
                }
            }

            $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';
            
            $query = $wpdb->prepare(
                "SELECT * FROM {$this->table_name} 
                $where_clause
                ORDER BY {$args['orderby']} {$args['order']}
                LIMIT %d OFFSET %d",
                array_merge($where_values, array($args['limit'], $args['offset']))
            );

            return $wpdb->get_results($query);
        } catch (Exception $e) {
            $this->logger->error("Failed to get {$this->table_name}: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể lấy dữ liệu.');
        }
    }

    /**
     * Lấy một record theo ID
     */
    public function get($id) {
        $permission = $this->check_permission('view');
        if (is_wp_error($permission)) {
            return $permission;
        }

        try {
            global $wpdb;
            $query = $wpdb->prepare(
                "SELECT * FROM {$this->table_name} WHERE {$this->primary_key} = %d",
                $id
            );
            
            $result = $wpdb->get_row($query);
            return $result ? $result : new WP_Error('not_found', 'Không tìm thấy dữ liệu.');
        } catch (Exception $e) {
            $this->logger->error("Failed to get {$this->table_name}: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể lấy dữ liệu.');
        }
    }

    /**
     * Tạo mới một record
     */
    public function create($data) {
        $permission = $this->check_permission('create');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Validate dữ liệu
        $validation = $this->validate($data);
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Chỉ lấy các trường được phép
        $clean_data = array();
        foreach ($this->fillable as $field) {
            $clean_data[$field] = isset($data[$field]) ? $this->sanitizer->sanitize_string($data[$field]) : '';
        }

        try {
            $this->db->begin_transaction();

            global $wpdb;
            $result = $wpdb->insert(
                $this->table_name,
                $clean_data
            );

            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }

            $this->db->commit();
            return $wpdb->insert_id;
        } catch (Exception $e) {
            $this->db->rollback();
            $this->logger->error("Failed to create {$this->table_name}: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể tạo dữ liệu mới.');
        }
    }

    /**
     * Cập nhật một record
     */
    public function update($id, $data) {
        $permission = $this->check_permission('update');
        if (is_wp_error($permission)) {
            return $permission;
        }

        // Validate dữ liệu
        $validation = $this->validate($data, 'update');
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Chỉ lấy các trường được phép
        $clean_data = array();
        foreach ($this->fillable as $field) {
            if (isset($data[$field])) {
                $clean_data[$field] = $this->sanitizer->sanitize_string($data[$field]);
            }
        }

        try {
            $this->db->begin_transaction();

            global $wpdb;
            $result = $wpdb->update(
                $this->table_name,
                $clean_data,
                array($this->primary_key => $id)
            );

            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            $this->logger->error("Failed to update {$this->table_name}: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể cập nhật dữ liệu.');
        }
    }

    /**
     * Xóa một record
     */
    public function delete($id) {
        $permission = $this->check_permission('delete');
        if (is_wp_error($permission)) {
            return $permission;
        }

        try {
            $this->db->begin_transaction();

            global $wpdb;
            $result = $wpdb->delete(
                $this->table_name,
                array($this->primary_key => $id)
            );

            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            $this->logger->error("Failed to delete {$this->table_name}: " . $e->getMessage());
            return new WP_Error('db_error', 'Không thể xóa dữ liệu.');
        }
    }
} 
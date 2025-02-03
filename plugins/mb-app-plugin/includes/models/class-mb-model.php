<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
abstract class MB_Model {
    protected $db;
    protected $sanitizer;
    protected $table_name;
    protected $primary_key = 'id';
    protected $fillable = [];
    protected $required_fields = [];
    protected $string_fields = [];
    protected $datetime_fields = [];
    protected $enum_fields = [];
    protected $enum_values = [];

    public function __construct() {
        $this->db = new MB_Database();
        $this->sanitizer = new MB_Sanitizer();
    }

    /**
     * Lấy tất cả records
     */
    public function get_all($args = array()) {
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
            return new WP_Error('db_error', 'Không thể lấy dữ liệu.');
        }
    }

    /**
     * Lấy một record theo ID
     */
    public function get($id) {
        try {
            global $wpdb;
            $query = $wpdb->prepare(
                "SELECT * FROM {$this->table_name} WHERE {$this->primary_key} = %d",
                $id
            );

            $result = $wpdb->get_row($query);
            return $result ? $result : new WP_Error('not_found', 'Không tìm thấy dữ liệu.');
        } catch (Exception $e) {
            return new WP_Error('db_error', 'Không thể lấy dữ liệu.');
        }
    }

    /**
     * Tạo mới một record
     */
    public function create($data) {
        // Chỉ lấy các trường được phép
//        $clean_data = array();
//        foreach ($this->fillable as $field) {
//            $clean_data[$field] = isset($data[$field]) ? $this->sanitizer->sanitize_string($data[$field]) : '';
//        }

        try {
            $this->db->begin_transaction();

            global $wpdb;
            $result = $wpdb->insert(
                $this->table_name,
//                $clean_data
                $data
            );

            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }

            $this->db->commit();
            return $wpdb->insert_id;
        } catch (Exception $e) {
            $this->db->rollback();
            return new WP_Error('db_error', 'Không thể tạo dữ liệu mới.');
        }
    }

    /**
     * Cập nhật một record
     */
    public function update($id, $data) {
        // Chỉ lấy các trường được phép
//        $clean_data = array();
//        foreach ($this->fillable as $field) {
//            if (isset($data[$field])) {
//                $clean_data[$field] = $this->sanitizer->sanitize_string($data[$field]);
//            }
//        }

        try {
            $this->db->begin_transaction();

            global $wpdb;
            $result = $wpdb->update(
                $this->table_name,
//                $clean_data,
                $data,
                array($this->primary_key => $id)
            );

            if ($result === false) {
                throw new Exception($wpdb->last_error);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            return new WP_Error('db_error', 'Không thể cập nhật dữ liệu.');
        }
    }

    /**
     * Xóa một record
     */
    public function delete($id) {
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
            return new WP_Error('db_error', 'Không thể xóa dữ liệu.');
        }
    }
}
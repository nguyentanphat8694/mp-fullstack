<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Task_Controller {
    private $task_model;
    private $task_comment_model;

    public function __construct() {
        $this->task_model = new MB_Task();
        $this->task_comment_model = new MB_Task_Comment();
    }

    public function create_task($data) {
        try {
            // Prepare task data
            $task_data = array(
                'title' => sanitize_text_field($data['title']),
                'description' => isset($data['description']) ? sanitize_textarea_field($data['description']) : null,
                'assigned_to' => isset($data['assigned_to']) ? absint($data['assigned_to']) : null,
                'status' => 'pending',
                'due_date' => sanitize_text_field($data['due_date']),
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            );

            return $this->task_model->create($task_data);
        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_task($id) {
        try {
            global $wpdb;
            
            // Get task info with assigned user
            $query = $wpdb->prepare(
                "SELECT 
                    t.id,
                    t.title,
                    t.description,
                    t.status,
                    t.due_date,
                    u.display_name as user_name
                FROM mb_tasks t
                LEFT JOIN {$wpdb->users} u ON t.assigned_to = u.ID
                WHERE t.id = %d",
                $id
            );

            $task = $wpdb->get_row($query);
            
            if (!$task) {
                return new WP_Error('not_found', 'Task not found');
            }

            // Get comments for this task
            $comments_query = $wpdb->prepare(
                "SELECT 
                    tc.created_at,
                    tc.comment,
                    u.display_name as user_name
                FROM mb_task_comments tc
                LEFT JOIN {$wpdb->users} u ON tc.created_by = u.ID
                WHERE tc.task_id = %d
                ORDER BY tc.created_at DESC",
                $id
            );

            $comments = $wpdb->get_results($comments_query);

            // Format comments
            $formatted_comments = array_map(function($comment) {
                return array(
                    'user_name' => $comment->user_name,
                    'created_at' => $comment->created_at,
                    'comment' => $comment->comment
                );
            }, $comments);

            // Return combined result
            return array(
                'id' => (int)$task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'user_name' => $task->user_name,
                'due_date' => $task->due_date,
                'comments' => $formatted_comments
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_tasks($args = array()) {
        try {
            global $wpdb;

            $query_args = array(
                'orderby' => 'created_at',
                'order' => 'DESC',
                'limit' => 50,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0,
                'where' => array(),
                'search' => isset($args['search']) ? sanitize_text_field($args['search']) : '',
                'search_fields' => array('title', 'description')
            );

            // Filter by assigned_to
            if (isset($args['assigned_to']) && $args['assigned_to'] !== null) {
                $query_args['where']['assigned_to'] = absint($args['assigned_to']);
            }

            // Filter by status
            if (isset($args['status']) && $args['status'] !== null) {
                $query_args['where']['status'] = sanitize_text_field($args['status']);
            }

            // Filter by created_at date
            $created_date = isset($args['created_at']) ? sanitize_text_field($args['created_at']) : current_time('Y-m-d');
            $query_args['where_raw'] = "DATE(t.created_at) = DATE('" . $created_date . "')";

            $where_conditions = array();
            $where_values = array();

            // Build where conditions from query args
            if (!empty($query_args['where'])) {
                foreach ($query_args['where'] as $field => $value) {
                    $where_conditions[] = "t.$field = %s";
                    $where_values[] = $value;
                }
            }

            // Add raw where condition if exists
            if (!empty($query_args['where_raw'])) {
                $where_conditions[] = $query_args['where_raw'];
            }

            // Add search condition
            if (!empty($query_args['search'])) {
                $search_fields = array();
                $search_term = '%' . $wpdb->esc_like($query_args['search']) . '%';
                
                foreach ($query_args['search_fields'] as $field) {
                    $search_fields[] = "t.$field LIKE %s";
                    $where_values[] = $search_term;
                }
                
                if (!empty($search_fields)) {
                    $where_conditions[] = '(' . implode(' OR ', $search_fields) . ')';
                }
            }

            $where_clause = !empty($where_conditions) 
                ? "WHERE " . implode(" AND ", $where_conditions)
                : "";

            // Get total records
            $count_query = "SELECT COUNT(*) FROM mb_tasks t {$where_clause}";
            $total_items = $wpdb->get_var($wpdb->prepare($count_query, $where_values));

            $query = $wpdb->prepare(
                "SELECT 
                    t.id,
                    t.title,
                    t.description,
                    t.created_at,
                    t.due_date,
                    t.status,
                    u.display_name as user_name
                FROM mb_tasks t
                LEFT JOIN {$wpdb->users} u ON t.assigned_to = u.ID
                {$where_clause}
                ORDER BY t.{$query_args['orderby']} {$query_args['order']}
                LIMIT %d OFFSET %d",
                array_merge($where_values, array($query_args['limit'], $query_args['offset']))
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array(
                'data' => array_map(function($row) {
                    return array(
                        'id' => (int)$row->id,
                        'title' => $row->title,
                        'description' => $row->description,
                        'created_at' => $row->created_at,
                        'due_date' => $row->due_date,
                        'status' => $row->status,
                        'user_name' => $row->user_name
                    );
                }, $results),
                'total_data' => (int)$total_items
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_task($id, $data) {
        try {
            // Prepare update data
            $update_data = array();
            $allowed_fields = array('title', 'description', 'assigned_to', 'status', 'due_date');
            
            foreach ($allowed_fields as $field) {
                if (isset($data[$field])) {
                    switch ($field) {
                        case 'description':
                            $update_data[$field] = sanitize_textarea_field($data[$field]);
                            break;
                        case 'assigned_to':
                            $update_data[$field] = absint($data[$field]);
                            break;
                        default:
                            $update_data[$field] = sanitize_text_field($data[$field]);
                    }
                }
            }

            if (empty($update_data)) {
                return new WP_Error('update_error', 'No valid fields to update');
            }

            $update_data['updated_at'] = current_time('mysql');

            $result = $this->task_model->update($id, $update_data);
            if (is_wp_error($result)) {
                return $result;
            }

            return $this->get_task($id);
        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_task($id) {
        try {
            $result = $this->task_model->delete($id);
            if (is_wp_error($result)) {
                return $result;
            }
            return true;
        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }

    public function create_task_comment($task_id, $comment) {
        try {
            // Check if task exists
            $task = $this->get_task($task_id);
            if (is_wp_error($task)) {
                return $task;
            }

            // Prepare comment data
            $comment_data = array(
                'task_id' => $task_id,
                'comment' => sanitize_textarea_field($comment),
                'created_by' => get_current_user_id(),
                'created_at' => current_time('mysql')
            );

            // Create comment
            $comment_id = $this->task_comment_model->create($comment_data);
            if (is_wp_error($comment_id)) {
                throw new Exception($comment_id->get_error_message());
            }

            // Get comment with user info
            global $wpdb;
            $query = $wpdb->prepare(
                "SELECT 
                    tc.created_at,
                    tc.comment,
                    u.display_name as user_name
                FROM mb_task_comments tc
                LEFT JOIN {$wpdb->users} u ON tc.created_by = u.ID
                WHERE tc.id = %d",
                $comment_id
            );

            $result = $wpdb->get_row($query);

            return array(
                'user_name' => $result->user_name,
                'created_at' => $result->created_at,
                'comment' => $result->comment
            );

        } catch (Exception $e) {
            return new WP_Error('comment_error', $e->getMessage());
        }
    }

    public function update_task_status($id, $status) {
        try {
            // Check if task exists
            $task = $this->get_task($id);
            if (is_wp_error($task)) {
                return $task;
            }

            // Update task status
            $update_data = array(
                'status' => $status,
                'updated_at' => current_time('mysql')
            );

            $result = $this->task_model->update($id, $update_data);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            return $result;

        } catch (Exception $e) {
            return new WP_Error('status_error', $e->getMessage());
        }
    }
} 
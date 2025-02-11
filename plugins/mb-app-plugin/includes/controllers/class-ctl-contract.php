<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Contract_Controller {
    private $contract_model;
    private $contract_product_model;
    private $contract_photographer_model;
    private $contract_note_model;
    private $contract_payment_model;
    private $transaction_model;

    public function __construct() {
        $this->contract_model = new MB_Contract();
        $this->contract_product_model = new MB_Contract_Product();
        $this->contract_photographer_model = new MB_Contract_Photographer();
        $this->contract_note_model = new MB_Contract_Note();
        $this->contract_payment_model = new MB_Contract_Payment();
        $this->transaction_model = new MB_Transaction();
    }

    // Helper function to handle transaction for payment
    private function handle_payment_transaction($payment_id, $amount, $payment_date, $description) {
        $transaction_data = array(
            'type' => 'income',
            'amount' => $amount,
            'transaction_date' => $payment_date,
            'description' => $description,
            'contract_payment_id' => $payment_id,
            'created_by' => get_current_user_id(),
            'created_at' => current_time('mysql')
        );

        return $this->transaction_model->create($transaction_data);
    }

    public function create_contract($data) {
        try {
            $current_user_id = get_current_user_id();
            // 1. Create main contract
            $main_data = array(
                'customer_id' => absint($data['main']['customer_id']),
                'type' => sanitize_text_field($data['main']['type']),
                'total_amount' => floatval($data['main']['total_amount']),
                'paid_amount' => 0, // Will be updated if payment is provided
                'start_date' => sanitize_text_field($data['main']['start_date']),
                'end_date' => sanitize_text_field($data['main']['end_date']),
                'created_by' => $current_user_id,
                'created_at' => current_time('mysql')
            );
            if (!empty($data['payment'])) {
                $main_data['paid_amount'] = floatval($data['payment']['amount']);
            }

            $contract_id = $this->contract_model->create($main_data);
            if (is_wp_error($contract_id)) {
                throw new Exception($contract_id->get_error_message());
            }

            // 2. Create note if provided
            if (!empty($data['note'])) {
                $note_data = array(
                    'contract_id' => $contract_id,
                    'note' => sanitize_textarea_field($data['note']['note']),
                    'status' => 'approved',
                    'created_by' => $current_user_id,
                    'created_at' => current_time('mysql'),
                    'approved_by' => $current_user_id,
                );

                $note_id = $this->contract_note_model->create($note_data);
                if (is_wp_error($note_id)) {
                    throw new Exception($note_id->get_error_message());
                }
            }

            // 3. Create payment if provided
            if (!empty($data['payment'])) {
                $payment_data = array(
                    'contract_id' => $contract_id,
                    'amount' => floatval($data['payment']['amount']),
                    'payment_date' => sanitize_text_field($data['payment']['payment_date']),
                    'payment_method' => sanitize_text_field($data['payment']['payment_method']),
                    'created_by' => $current_user_id,
                    'created_at' => current_time('mysql')
                );

                $payment_id = $this->contract_payment_model->create($payment_data);
                if (is_wp_error($payment_id)) {
                    throw new Exception($payment_id->get_error_message());
                }

                // Create corresponding transaction
                $transaction_result = $this->handle_payment_transaction(
                    $payment_id,
                    $payment_data['amount'],
                    $payment_data['payment_date'],
                    sprintf('Thanh toán cho hợp đồng #%d', $contract_id)
                );

                if (is_wp_error($transaction_result)) {
                    throw new Exception($transaction_result->get_error_message());
                }
            }

            // 4. Create product if provided
            if (!empty($data['product'])) {
                $product_data = array(
                    'contract_id' => $contract_id,
                    'product_id' => absint($data['product']['id']),
                    'rental_start' => sanitize_text_field($data['product']['rental_start']),
                    'rental_end' => sanitize_text_field($data['product']['rental_end']),
                    'created_by' => $current_user_id,
                    'created_at' => current_time('mysql')
                );

                $product_id = $this->contract_product_model->create($product_data);
                if (is_wp_error($product_id)) {
                    throw new Exception($product_id->get_error_message());
                }
            }

            // 5. Create photographer if provided
            if (!empty($data['photographer'])) {
                $photographer_data = array(
                    'contract_id' => $contract_id,
                    'photographer_id' => absint($data['photographer']['id']),
                    'start_date' => sanitize_text_field($data['photographer']['start_date']),
                    'end_date' => sanitize_text_field($data['photographer']['end_date']),
                    'created_by' => $current_user_id,
                    'created_at' => current_time('mysql')
                );

                $photographer_id = $this->contract_photographer_model->create($photographer_data);
                if (is_wp_error($photographer_id)) {
                    throw new Exception($photographer_id->get_error_message());
                }
            }

            return $contract_id;

        } catch (Exception $e) {
            return new WP_Error('create_error', $e->getMessage());
        }
    }

    public function get_contract($id) {
        try {
            global $wpdb;
            
            // Get main contract info
            $query = $wpdb->prepare(
                "SELECT 
                    c.*,
                    cu.name as customer_name,
                    u.display_name as created_by_name
                FROM mb_contracts c
                JOIN mb_customers cu ON c.customer_id = cu.id
                JOIN {$wpdb->users} u ON c.created_by = u.ID
                WHERE c.id = %d",
                $id
            );

            $contract = $wpdb->get_row($query);
            
            if (!$contract) {
                return new WP_Error('not_found', 'Contract not found');
            }

            // Get contract notes
            $notes_query = $wpdb->prepare(
                "SELECT 
                    cn.id,
                    cn.note,
                    cn.status,
                    u.display_name as created_by_name
                FROM mb_contract_notes cn
                JOIN {$wpdb->users} u ON cn.created_by = u.ID
                WHERE cn.contract_id = %d
                ORDER BY cn.created_at DESC",
                $id
            );

            $notes = $wpdb->get_results($notes_query);

            // Get contract payments
            $payments_query = $wpdb->prepare(
                "SELECT 
                    cp.id,
                    cp.amount,
                    cp.payment_date,
                    cp.payment_method
                FROM mb_contract_payments cp
                WHERE cp.contract_id = %d
                ORDER BY cp.payment_date DESC",
                $id
            );

            $payments = $wpdb->get_results($payments_query);

            // Get contract products
            $products_query = $wpdb->prepare(
                "SELECT 
                    cp.id,
                    cp.rental_start,
                    cp.rental_end,
                    p.id as product_id,
                    p.code as product_code,
                    p.name as product_name
                FROM mb_contract_products cp
                JOIN mb_products p ON cp.product_id = p.id
                WHERE cp.contract_id = %d
                ORDER BY cp.rental_start ASC",
                $id
            );

            $products = $wpdb->get_results($products_query);

            // Get contract photographers
            $photographers_query = $wpdb->prepare(
                "SELECT 
                    cp.start_date,
                    cp.end_date,
                    u.display_name as photographer_name
                FROM mb_contract_photographers cp
                JOIN {$wpdb->users} u ON cp.photographer_id = u.ID
                WHERE cp.contract_id = %d
                ORDER BY cp.start_date ASC",
                $id
            );

            $photographers = $wpdb->get_results($photographers_query);

            // Format response
            return array(
                'main' => array(
                    'id' => (int)$contract->id,
                    'customer_name' => $contract->customer_name,
                    'type' => $contract->type,
                    'start_date' => $contract->start_date,
                    'end_date' => $contract->end_date,
                    'total_amount' => (float)$contract->total_amount,
                    'paid_amount' => (float)$contract->paid_amount
                ),
                'notes' => array_map(function($note) {
                    return array(
                        'id' => (int)$note->id,
                        'note' => $note->note,
                        'user_created_by_name' => $note->created_by_name,
                        'status' => $note->status
                    );
                }, $notes),
                'payments' => array_map(function($payment) {
                    return array(
                        'id' => (int)$payment->id,
                        'amount' => (float)$payment->amount,
                        'payment_date' => $payment->payment_date,
                        'payment_method' => $payment->payment_method
                    );
                }, $payments),
                'products' => array_map(function($product) {
                    return array(
                        'id' => (int)$product->id,
                        'product_id' => (int)$product->product_id,
                        'product_code' => $product->product_code,
                        'product_name' => $product->product_name,
                        'rental_start' => $product->rental_start,
                        'rental_end' => $product->rental_end
                    );
                }, $products),
                'photographers' => array_map(function($photographer) {
                    return array(
                        'photographer_name' => $photographer->photographer_name,
                        'start_date' => $photographer->start_date,
                        'end_date' => $photographer->end_date
                    );
                }, $photographers)
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function get_contracts($args = array()) {
        try {
            global $wpdb;

            $query_args = array(
                'where' => array(),
                'where_raw' => array(),
                'limit' => isset($args['limit']) ? absint($args['limit']) : 50,
                'offset' => isset($args['offset']) ? absint($args['offset']) : 0
            );

            // Search by contract id or customer name
            if (!empty($args['search'])) {
                $search_term = '%' . $wpdb->esc_like($args['search']) . '%';
                $query_args['where_raw'][] = $wpdb->prepare(
                    "(c.id = %s OR cu.name LIKE %s)",
                    $args['search'],
                    $search_term
                );
            }

            // Filter by type
            if (!empty($args['type'])) {
                $query_args['where']['c.type'] = sanitize_text_field($args['type']);
            }

            // Filter by month and year
            if (!empty($args['month']) && !empty($args['year'])) {
                $month = absint($args['month']);
                $year = absint($args['year']);
                $query_args['where_raw'][] = $wpdb->prepare(
                    "MONTH(c.start_date) = %d AND YEAR(c.start_date) = %d",
                    $month,
                    $year
                );
            }

            // Build where clause
            $where_conditions = array();
            $where_values = array();

            // Add where conditions
            foreach ($query_args['where'] as $field => $value) {
                $where_conditions[] = "$field = %s";
                $where_values[] = $value;
            }

            // Add raw where conditions
            if (!empty($query_args['where_raw'])) {
                $where_conditions = array_merge($where_conditions, $query_args['where_raw']);
            }

            // Combine where clause
            $where_clause = !empty($where_conditions) 
                ? "WHERE " . implode(" AND ", $where_conditions)
                : "";

            // Get total records
            $count_query = "SELECT COUNT(*) 
                FROM mb_contracts c
                JOIN mb_customers cu ON c.customer_id = cu.id
                {$where_clause}";
            $total_items = $wpdb->get_var($wpdb->prepare($count_query, $where_values));

            // Build final query
            $query = $wpdb->prepare(
                "SELECT 
                    c.id,
                    c.type,
                    c.start_date,
                    c.end_date,
                    c.total_amount,
                    cu.name as customer_name
                FROM mb_contracts c
                JOIN mb_customers cu ON c.customer_id = cu.id
                {$where_clause}
                ORDER BY c.created_at DESC
                LIMIT %d OFFSET %d",
                array_merge(
                    $where_values,
                    array($query_args['limit'], $query_args['offset'])
                )
            );

            $results = $wpdb->get_results($query);

            // Format response
            return array(
                'data' => array_map(function($row) {
                    return array(
                        'id' => (int)$row->id,
                        'customer_name' => $row->customer_name,
                        'type' => $row->type,
                        'start_date' => $row->start_date,
                        'end_date' => $row->end_date,
                        'total_amount' => (float)$row->total_amount
                    );
                }, $results),
                'total_data' => (int)$total_items
            );

        } catch (Exception $e) {
            return new WP_Error('get_error', $e->getMessage());
        }
    }

    public function update_contract($id, $data) {
        try {
            global $wpdb;

            // Check if contract exists
            $contract = $this->get_contract($id);
            if (is_wp_error($contract)) {
                return $contract;
            }

            $current_user_id = get_current_user_id();

            // 1. Update main contract if provided
            if (!empty($data['main'])) {
                $update_data = array();
                $allowed_fields = array('type', 'total_amount', 'start_date', 'end_date');
                
                foreach ($allowed_fields as $field) {
                    if (isset($data['main'][$field])) {
                        switch ($field) {
                            case 'total_amount':
                                $update_data[$field] = floatval($data['main'][$field]);
                                break;
                            default:
                                $update_data[$field] = sanitize_text_field($data['main'][$field]);
                        }
                    }
                }

                if (!empty($update_data)) {
                    $result = $this->contract_model->update($id, $update_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                }
            }

            // 2. Handle note
            if (!empty($data['note'])) {
                // Check user role for note status
                $current_user = wp_get_current_user();
                $user_roles = $current_user->roles;
                $note_status = 'pending';
                
                // Set status to approved if user is admin or accountant
                if (array_intersect(['administrator', 'accountant'], $user_roles)) {
                    $note_status = 'approved';
                }

                if (!empty($data['note']['id'])) {
                    // Update existing note
                    $note_data = array(
                        'note' => sanitize_textarea_field($data['note']['note'])
                    );
                    
                    // Only update status if user has permission
                    if ($note_status === 'approved') {
                        $note_data['status'] = $note_status;
                        $note_data['approved_by'] = $current_user_id;
                    } else {
                        $note_data['approved_by'] = null;
                    }

                    $result = $this->contract_note_model->update($data['note']['id'], $note_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                } else {
                    // Create new note
                    $note_data = array(
                        'contract_id' => $id,
                        'note' => sanitize_textarea_field($data['note']['note']),
                        'status' => $note_status,
                        'created_by' => $current_user_id,
                        'created_at' => current_time('mysql')
                    );

                    // Set approved_by if status is approved
                    if ($note_status === 'approved') {
                        $note_data['approved_by'] = $current_user_id;
                    }

                    $result = $this->contract_note_model->create($note_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                }
            }

            // 3. Handle payment
            if (!empty($data['payment'])) {
                if (!empty($data['payment']['id'])) {
                    // Get old payment amount first
                    $old_payment = $wpdb->get_row($wpdb->prepare(
                        "SELECT amount FROM mb_contract_payments WHERE id = %d",
                        $data['payment']['id']
                    ));

                    if (!$old_payment) {
                        throw new Exception('Payment not found');
                    }

                    // Update existing payment
                    $payment_data = array(
                        'amount' => floatval($data['payment']['amount']),
                        'payment_date' => sanitize_text_field($data['payment']['payment_date']),
                        'payment_method' => sanitize_text_field($data['payment']['payment_method'])
                    );

                    $result = $this->contract_payment_model->update($data['payment']['id'], $payment_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }

                    // Update corresponding transaction
                    $transaction = $wpdb->get_row($wpdb->prepare(
                        "SELECT id FROM mb_transactions WHERE contract_payment_id = %d",
                        $data['payment']['id']
                    ));

                    if ($transaction) {
                        $transaction_data = array(
                            'amount' => $payment_data['amount'],
                            'transaction_date' => $payment_data['payment_date']
                        );

                        $result = $this->transaction_model->update($transaction->id, $transaction_data);
                        if (is_wp_error($result)) {
                            throw new Exception($result->get_error_message());
                        }
                    }

                    // Update contract paid_amount
                    $new_paid_amount = floatval($contract['paid_amount']) - floatval($old_payment->amount) + floatval($payment_data['amount']);
                    $result = $this->contract_model->update($id, array('paid_amount' => $new_paid_amount));
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }

                } else {
                    // Create new payment
                    $payment_data = array(
                        'contract_id' => $id,
                        'amount' => floatval($data['payment']['amount']),
                        'payment_date' => sanitize_text_field($data['payment']['payment_date']),
                        'payment_method' => sanitize_text_field($data['payment']['payment_method']),
                        'created_by' => $current_user_id,
                        'created_at' => current_time('mysql')
                    );

                    $payment_id = $this->contract_payment_model->create($payment_data);
                    if (is_wp_error($payment_id)) {
                        throw new Exception($payment_id->get_error_message());
                    }

                    // Create corresponding transaction
                    $transaction_result = $this->handle_payment_transaction(
                        $payment_id,
                        $payment_data['amount'],
                        $payment_data['payment_date'],
                        sprintf('Thanh toán cho hợp đồng #%d', $id)
                    );

                    if (is_wp_error($transaction_result)) {
                        throw new Exception($transaction_result->get_error_message());
                    }

                    // Update contract paid_amount
                    $new_paid_amount = floatval($contract['paid_amount']) + floatval($data['payment']['amount']);
                    $result = $this->contract_model->update($id, array('paid_amount' => $new_paid_amount));
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                }
            }

            // 4. Handle product
            if (!empty($data['product'])) {
                if (!empty($data['product']['id'])) {
                    // Update existing product
                    $product_data = array(
                        'rental_start' => sanitize_text_field($data['product']['rental_start']),
                        'rental_end' => sanitize_text_field($data['product']['rental_end'])
                    );
                    $result = $this->contract_product_model->update($data['product']['id'], $product_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                } else {
                    // Create new product
                    $product_data = array(
                        'contract_id' => $id,
                        'product_id' => absint($data['product']['id']),
                        'rental_start' => sanitize_text_field($data['product']['rental_start']),
                        'rental_end' => sanitize_text_field($data['product']['rental_end']),
                        'created_by' => $current_user_id,
                        'created_at' => current_time('mysql')
                    );
                    $result = $this->contract_product_model->create($product_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                }
            }

            // 5. Handle photographer
            if (!empty($data['photographer'])) {
                if (!empty($data['photographer']['id'])) {
                    // Update existing photographer
                    $photographer_data = array(
                        'start_date' => sanitize_text_field($data['photographer']['start_date']),
                        'end_date' => sanitize_text_field($data['photographer']['end_date'])
                    );
                    $result = $this->contract_photographer_model->update($data['photographer']['id'], $photographer_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                } else {
                    // Create new photographer
                    $photographer_data = array(
                        'contract_id' => $id,
                        'photographer_id' => absint($data['photographer']['id']),
                        'start_date' => sanitize_text_field($data['photographer']['start_date']),
                        'end_date' => sanitize_text_field($data['photographer']['end_date']),
                        'created_by' => $current_user_id,
                        'created_at' => current_time('mysql')
                    );
                    $result = $this->contract_photographer_model->create($photographer_data);
                    if (is_wp_error($result)) {
                        throw new Exception($result->get_error_message());
                    }
                }
            }

            return $id;

        } catch (Exception $e) {
            return new WP_Error('update_error', $e->getMessage());
        }
    }

    public function delete_contract($id) {
        try {
            global $wpdb;
            // Delete related records first
            $wpdb->delete('mb_contract_products', array('contract_id' => $id));
            $wpdb->delete('mb_contract_photographers', array('contract_id' => $id));
            $wpdb->delete('mb_contract_notes', array('contract_id' => $id));
            $wpdb->delete('mb_contract_payments', array('contract_id' => $id));

            // Delete contract
            $result = $this->contract_model->delete($id);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            return true;

        } catch (Exception $e) {
            return new WP_Error('delete_error', $e->getMessage());
        }
    }

    public function approve_contract_note($contract_id, $note_id, $is_approve) {
        try {
            // Check if contract exists
            $contract = $this->get_contract($contract_id);
            if (is_wp_error($contract)) {
                return $contract;
            }

            // Check if note exists and belongs to this contract
            global $wpdb;
            $note = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM mb_contract_notes WHERE id = %d AND contract_id = %d",
                $note_id,
                $contract_id
            ));

            if (!$note) {
                return new WP_Error(
                    'not_found',
                    'Note not found or does not belong to this contract'
                );
            }

            // Update note status
            $update_data = array(
                'status' => $is_approve ? 'approved' : 'rejected',
                'approved_by' => get_current_user_id()
            );

            $result = $this->contract_note_model->update($note_id, $update_data);
            if (is_wp_error($result)) {
                throw new Exception($result->get_error_message());
            }

            return true;

        } catch (Exception $e) {
            return new WP_Error('approve_error', $e->getMessage());
        }
    }
} 
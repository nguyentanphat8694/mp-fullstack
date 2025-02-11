<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class MB_Contract_API extends MB_API {
    private $controller;

    public function __construct() {
        parent::__construct();
        $this->controller = new MB_Contract_Controller();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/contract', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_contract'),
                'permission_callback' => array($this, 'create_contract_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_contracts'),
                'permission_callback' => array($this, 'get_contracts_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/contract/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_contract'),
                'permission_callback' => array($this, 'get_contract_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_contract'),
                'permission_callback' => array($this, 'update_contract_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_contract'),
                'permission_callback' => array($this, 'delete_contract_permissions_check'),
            )
        ));

        register_rest_route($this->namespace, '/contract/(?P<id>\d+)/note/approve', array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'approve_contract_note'),
                'permission_callback' => array($this, 'approve_contract_note_permissions_check'),
            )
        ));
    }

    public function create_contract($request) {
        $params = $request->get_params();
        
        // Validate main data (required)
        if (!isset($params['main'])) {
            return $this->error_response(
                'Missing main contract data',
                $this->http_bad_request,
                'missing_main_data'
            );
        }

        $main_data = $params['main'];
        $required_fields = array('customer_id', 'type', 'total_amount', 'start_date', 'end_date');
        foreach ($required_fields as $field) {
            if (!isset($main_data[$field])) {
                return $this->error_response(
                    sprintf('Missing required parameter in main data: %s', $field),
                    $this->http_bad_request,
                    'missing_params'
                );
            }
        }

        // Validate contract type
        $allowed_types = array('dress_rental', 'wedding_photo', 'pre_wedding_photo');
        if (!in_array($main_data['type'], $allowed_types)) {
            return $this->error_response(
                'Invalid contract type. Allowed values: ' . implode(', ', $allowed_types),
                $this->http_bad_request,
                'invalid_type'
            );
        }

        $result = $this->controller->create_contract($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_created, 'Contract created successfully');
    }

    public function get_contracts($request) {
        $params = $request->get_params();
        $result = $this->controller->get_contracts($params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Contracts retrieved successfully');
    }

    public function get_contract($request) {
        $id = $request['id'];
        $result = $this->controller->get_contract($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_not_found,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Contract retrieved successfully');
    }

    public function update_contract($request) {
        $id = $request['id'];
        $params = $request->get_params();

        // Validate main data if provided
        if (isset($params['main'])) {
            $main_data = $params['main'];
            if (isset($main_data['type'])) {
                $allowed_types = array('dress_rental', 'wedding_photo', 'pre_wedding_photo');
                if (!in_array($main_data['type'], $allowed_types)) {
                    return $this->error_response(
                        'Invalid contract type. Allowed values: ' . implode(', ', $allowed_types),
                        $this->http_bad_request,
                        'invalid_type'
                    );
                }
            }
        }
        
        $result = $this->controller->update_contract($id, $params);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response($result, $this->http_ok, 'Contract updated successfully');
    }

    public function delete_contract($request) {
        $id = $request['id'];
        $result = $this->controller->delete_contract($id);

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(null, $this->http_ok, 'Contract deleted successfully');
    }

    public function approve_contract_note($request) {
        $contract_id = $request['id'];
        $params = $request->get_params();
        
        // Validate required parameters
        if (!isset($params['contract_note_id'])) {
            return $this->error_response(
                'Missing contract_note_id parameter',
                $this->http_bad_request,
                'missing_params'
            );
        }

        if (!isset($params['is_approve'])) {
            return $this->error_response(
                'Missing isApprove parameter',
                $this->http_bad_request,
                'missing_params'
            );
        }

        // Check if user has permission to approve notes
        $current_user = wp_get_current_user();
        $user_roles = $current_user->roles;
        
        if (!array_intersect(['administrator', 'accountant'], $user_roles)) {
            return $this->error_response(
                'You do not have permission to approve notes',
                $this->http_forbidden,
                'permission_denied'
            );
        }

        $result = $this->controller->approve_contract_note(
            $contract_id,
            $params['contract_note_id'],
            $params['is_approve']
        );

        if (is_wp_error($result)) {
            return $this->error_response(
                $result->get_error_message(),
                $this->http_bad_request,
                $result->get_error_code()
            );
        }

        return $this->success_response(
            null,
            $this->http_ok,
            'Note status updated successfully'
        );
    }

    // Permission checks
    public function create_contract_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_contracts_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function get_contract_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function update_contract_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function delete_contract_permissions_check($request) {
        return true; // Implement proper permission check
    }

    public function approve_contract_note_permissions_check($request) {
        return true; // Basic permission check, detailed check in controller
    }
} 
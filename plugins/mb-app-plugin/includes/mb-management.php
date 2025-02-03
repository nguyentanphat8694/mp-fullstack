<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Management {

    public function __construct() {
        $this->load_dependencies();
    }

    private function load_dependencies() {
        // Load utils
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/utils/mb-database.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/utils/mb-sanitizer.php';
        // Load models
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-model.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-appointment.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-appointment-history.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-attendance.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract-note.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract-payment.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract-photographer.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract-product.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract-product-inspection.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-customer.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-customer-history.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-notification.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-product.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-product-maintain.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-reward.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-setting.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-task.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-task-comment.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-transaction.php';
        // Load controllers
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-ctl-user.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-ctl-customer.php';
        // Load api
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/class-mb-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/class-api-user.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/class-api-customer.php';
    }

    public function run() {
        $this->define_api_hooks();
    }

    private function define_api_hooks() {
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_api_routes'));
    }

    public function register_api_routes() {
        // Initialize and register all API endpoints
        $api_classes = array(
            'MB_Customer_API'
        );

        foreach ($api_classes as $class) {
            $api = new $class();
            $api->register_routes();
        }
    }
}
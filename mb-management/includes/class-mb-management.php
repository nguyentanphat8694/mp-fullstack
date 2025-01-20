<?php
class MB_Management {
    protected $plugin_name;
    protected $version;

    public function __construct() {
        $this->version = MB_MANAGEMENT_VERSION;
        $this->plugin_name = 'mb-management';
        $this->load_dependencies();
    }

    private function load_dependencies() {
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/class-mb-loader.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/class-mb-activator.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/class-mb-deactivator.php';

        // Load utils
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/utils/class-mb-database.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/utils/class-mb-validator.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/utils/class-mb-sanitizer.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/utils/class-mb-logger.php';

        // Load models
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-model.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-attendance.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-notification.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-product-inspection-history.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-reward.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-task-comment.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-transaction.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-contract-payment.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/models/class-mb-task.php';

        // Load controllers
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-user.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-finance.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-contract.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-task.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-notification.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-inspection.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-product.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-reward.php';

        // Load API base class
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/class-mb-api.php';
        // Load Contract APIs
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/contract/class-mb-contract-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/contract/class-mb-contract-item-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/contract/class-mb-contract-note-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/contract/class-mb-contract-payment-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/contract/class-mb-contract-report-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/contract/class-mb-photographer-api.php';
        // Load Finance APIs
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/finance/class-mb-finance-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/finance/class-mb-purchase-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/finance/class-mb-report-api.php';
        // Load Product APIs
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/product/class-mb-category-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/product/class-mb-inspection-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/product/class-mb-maintenance-api.php';
        // Load Task APIs
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/task/class-mb-task-api.php';
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/task/class-mb-task-comment-api.php';
        // Load Notification API
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/notification/class-mb-notification-api.php';
    }

    private function define_admin_hooks() {
        // Add admin hooks if needed
    }

    private function define_public_hooks() {
        // Add public hooks if needed
    }

    private function define_api_hooks() {
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_api_routes'));
    }

    public function register_api_routes() {
        // Initialize and register all API endpoints
        $api_classes = array(
            'MB_Contract_API',
            'MB_Contract_Item_API',
            'MB_Contract_Note_API',
            'MB_Contract_Payment_API',
            'MB_Contract_Report_API',
            'MB_Photographer_API',
            'MB_Finance_API',
            'MB_Purchase_API',
            'MB_Report_API',
            'MB_Category_API',
            'MB_Inspection_API',
            'MB_Maintenance_API',
            'MB_Task_API',
            'MB_Task_Comment_API',
            'MB_Notification_API'
        );

        foreach ($api_classes as $class) {
            $api = new $class();
            $api->register_routes();
        }
    }


    public function run() {
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->define_api_hooks();
    }
} 
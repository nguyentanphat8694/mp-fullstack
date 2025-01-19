<?php
class MB_Management {
    protected $loader;
    protected $plugin_name;
    protected $version;

    public function __construct() {
        $this->version = MB_MANAGEMENT_VERSION;
        $this->plugin_name = 'mb-management';

        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->define_api_hooks();
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
        // ... load other model files

        // Load controllers
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/controllers/class-mb-user.php';
        // ... load other controller files

        // Load API classes
        require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/api/class-mb-api.php';
        // ... load other API files

        $this->loader = new MB_Loader();
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
            'MB_User_API',
            'MB_Customer_API',
            // ... other API classes
        );

        foreach ($api_classes as $class) {
            $api = new $class();
            $api->register_routes();
        }
    }

    public function run() {
        $this->loader->run();
    }
} 
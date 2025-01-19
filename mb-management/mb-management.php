<?php
/**
 * Plugin Name: MB Management
 * Plugin URI: https://example.com/plugins/mb-management/
 * Description: Hệ thống quản lý cho thuê áo cưới và chụp ảnh cưới
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com/
 * License: GPL v2 or later
 * Text Domain: mb-management
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MB_MANAGEMENT_VERSION', '1.0.0');
define('MB_MANAGEMENT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MB_MANAGEMENT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Require the main plugin class
require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/class-mb-management.php';

// Register activation and deactivation hooks
register_activation_hook(__FILE__, array('MB_Management_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('MB_Management_Deactivator', 'deactivate'));

// Initialize the plugin
function run_mb_management() {
    $plugin = new MB_Management();
    $plugin->run();
}
run_mb_management(); 
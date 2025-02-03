<?php
/**
 * Plugin Name: MB Management App
 * Plugin URI: https://example.com/plugins/mb-management/
 * Description: Hệ thống quản lý cho thuê áo cưới và chụp ảnh cưới
 * Version: 1.0.0
 * Author: TahpNat
 * Author URI: https://example.com/
 * License: GPL v2 or later
 * Text Domain: mb-management
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
const MB_MANAGEMENT_VERSION = '1.0.0';
define('MB_MANAGEMENT_PLUGIN_DIR', plugin_dir_path(__FILE__));
// define('MB_MANAGEMENT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Require the main plugin class
require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/mb-management.php';
require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/mb-auth.php';
require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/mb-activator.php';
require_once MB_MANAGEMENT_PLUGIN_DIR . 'includes/mb-deactivator.php';

// Register activation and deactivation hooks
register_activation_hook(__FILE__, array('MB_Management_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('MB_Management_Deactivator', 'deactivate'));

// Initialize the plugin
function run_mb_management(){
    $plugin = new MB_Management();
    $plugin->run();
    $auth = new MB_App_Auth();
    $auth->init();
}

run_mb_management(); 
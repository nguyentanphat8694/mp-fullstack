<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Management_Deactivator {
    public static function deactivate() {
        // Clear any scheduled hooks
        //wp_clear_scheduled_hook('mb_daily_notification_check');

        // Don't remove tables or roles on deactivation
        // Only remove them on uninstall
    }
}
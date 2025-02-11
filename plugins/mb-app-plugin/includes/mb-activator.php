<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
class MB_Management_Activator {
    public static function activate() {
        self::create_tables();
        self::create_roles();
        flush_rewrite_rules();
    }

    private static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        // mb_customers
        $sql = "CREATE TABLE IF NOT EXISTS mb_customers (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            phone varchar(20) DEFAULT NULL,
            source enum('facebook','tiktok','youtube','walk_in') NOT NULL,
            assigned_to bigint(20) unsigned DEFAULT NULL,
            status enum('new','contacted','appointment','contracted','completed') NOT NULL DEFAULT 'new',
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY assigned_to (assigned_to),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_customer_history
        $sql = "CREATE TABLE IF NOT EXISTS mb_customer_history (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            customer_id bigint(20) NOT NULL,
            action varchar(250) NOT NULL,
            note text DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY customer_id (customer_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_appointments
        $sql = "CREATE TABLE IF NOT EXISTS mb_appointments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            customer_id bigint(20) NOT NULL,
            appointment_date datetime NOT NULL,
            status enum('scheduled','receiving','completed','cancelled') NOT NULL DEFAULT 'scheduled',
            assigned_to bigint(20) unsigned DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY customer_id (customer_id),
            KEY assigned_to (assigned_to),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_appointment_history
        $sql = "CREATE TABLE IF NOT EXISTS mb_appointment_history (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            appointment_id bigint(20) NOT NULL,
            appointment_date datetime NOT NULL,
            action varchar(250) NOT NULL,
            note text DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY appointment_id (appointment_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_products
        $sql = "CREATE TABLE IF NOT EXISTS mb_products (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            code varchar(20) NOT NULL UNIQUE,
            name varchar(250) DEFAULT NULL,
            category enum('wedding_dress','vest','accessories','ao_dai') NOT NULL,
            description text DEFAULT NULL,
            images text DEFAULT NULL,
            created_at datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            PRIMARY KEY (id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_product_maintain
        $sql = "CREATE TABLE IF NOT EXISTS mb_product_maintain (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            product_id bigint(20) NOT NULL,
            status enum('pending','processing','done') NOT NULL,
            created_at datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            maintain_by bigint(20) unsigned NULL,
            maintain_start_at datetime DEFAULT NULL,
            maintain_end_at datetime DEFAULT NULL,
            PRIMARY KEY (id),
            KEY product_id (product_id),
            KEY created_by (created_by),
            KEY maintain_by (maintain_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_contract_product_inspections
        $sql = "CREATE TABLE IF NOT EXISTS mb_contract_product_inspections (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            product_id bigint(20) NOT NULL,
            status enum('pending','checked','approved') NOT NULL DEFAULT 'pending',
            issues text NOT NULL,
            created_note text DEFAULT NULL,
            checked_note text DEFAULT NULL,
            approved_note text DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            checked_by bigint(20) unsigned DEFAULT NULL,
            checked_at datetime DEFAULT NULL,
            approved_by bigint(20) unsigned DEFAULT NULL,
            approved_at datetime DEFAULT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY product_id (product_id),
            KEY created_by (created_by),
            KEY checked_by (checked_by),
            KEY approved_by (approved_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_contracts
        $sql = "CREATE TABLE IF NOT EXISTS mb_contracts (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            customer_id bigint(20) NOT NULL,
            type enum('dress_rental','wedding_photo','pre_wedding_photo') NOT NULL DEFAULT 'dress_rental',
            total_amount decimal(10,2) NOT NULL,
            paid_amount decimal(10,2) NOT NULL DEFAULT 0,
            start_date datetime NOT NULL,
            end_date datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY customer_id (customer_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_contract_products
        $sql = "CREATE TABLE IF NOT EXISTS mb_contract_products (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            product_id bigint(20) NOT NULL,
            rental_start datetime NOT NULL,
            rental_end datetime NOT NULL,
            created_at datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY product_id (product_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_contract_photographers
        $sql = "CREATE TABLE IF NOT EXISTS mb_contract_photographers (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            photographer_id bigint(20) unsigned NOT NULL,
            start_date datetime NOT NULL,
            end_date datetime NOT NULL,
            created_at datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY photographer_id (photographer_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_contract_notes
        $sql = "CREATE TABLE IF NOT EXISTS mb_contract_notes (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            note text NOT NULL,
            status enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
            approved_by bigint(20) unsigned DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY approved_by (approved_by),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_contract_payments
        $sql = "CREATE TABLE IF NOT EXISTS mb_contract_payments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            amount decimal(10,2) NOT NULL,
            payment_date datetime NOT NULL,
            payment_method varchar(50) NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_tasks
        $sql = "CREATE TABLE IF NOT EXISTS mb_tasks (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description text DEFAULT NULL,
            assigned_to bigint(20) unsigned DEFAULT NULL,
            status enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
            due_date datetime DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY assigned_to (assigned_to),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_task_comments
        $sql = "CREATE TABLE IF NOT EXISTS mb_task_comments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            task_id bigint(20) NOT NULL,
            comment text NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY task_id (task_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_notifications
        $sql = "CREATE TABLE IF NOT EXISTS mb_notifications (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            type varchar(50) NOT NULL,
            title varchar(255) NOT NULL,
            content text NOT NULL,
            read_at datetime DEFAULT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY user_id (user_id)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_transactions
        $sql = "CREATE TABLE IF NOT EXISTS mb_transactions (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            type enum('income','expense') NOT NULL,
            amount decimal(10,2) NOT NULL,
            description text NOT NULL,
            contract_payment_id bigint(20) DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY contract_payment_id (contract_payment_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_attendance
        $sql = "CREATE TABLE IF NOT EXISTS mb_attendance (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            check_in datetime NOT NULL,
            check_out datetime DEFAULT NULL,
            ip_address varchar(45) NOT NULL,
            wifi_name varchar(255) NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY user_id (user_id)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_rewards
        $sql = "CREATE TABLE IF NOT EXISTS mb_rewards (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            type enum('reward','penalty') NOT NULL,
            amount decimal(10,2) NOT NULL,
            title varchar(255) NOT NULL,
            reason text DEFAULT NULL,
            status enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
            approved_by bigint(20) unsigned DEFAULT NULL,
            approved_at datetime DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY approved_by (approved_by),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // mb_settings
        $sql = "CREATE TABLE IF NOT EXISTS mb_settings (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            setting_name varchar(50) NOT NULL,
            setting_value varchar(255) NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";
        dbDelta($sql);
    }

    private static function create_roles() {
        // Add custom roles
        add_role('manager', 'Quản lý', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('accountant', 'Kế toán', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('telesale', 'Telesale', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('facebook', 'Facebook', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('sale', 'Sale', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('photo_wedding', 'Photo Wedding', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('photo_pre_wedding', 'Photo Pre-Wedding', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('tailor', 'Thợ may', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        // Add capabilities for each role
        $roles = array('administrator', 'manager', 'accountant', 'telesale', 'facebook', 'sale', 'photo_wedding', 'photo_pre_wedding', 'tailor');

        foreach ($roles as $role) {
            $role_obj = get_role($role);
            if ($role_obj) {
                // Common capabilities
                $role_obj->add_cap('mb_view_dashboard');

                // Role-specific capabilities
                switch ($role) {
                    case 'administrator':
                    case 'manager':
                        // Full access
                        $role_obj->add_cap('mb_manage_users');
                        $role_obj->add_cap('mb_manage_customers');
                        $role_obj->add_cap('mb_manage_products');
                        $role_obj->add_cap('mb_manage_contracts');
                        $role_obj->add_cap('mb_manage_tasks');
                        $role_obj->add_cap('mb_manage_finance');
                        $role_obj->add_cap('mb_assign_customers');
                        $role_obj->add_cap('mb_approve_rewards');
                        $role_obj->add_cap('mb_approve_contracts');
                        $role_obj->add_cap('mb_approve_inspections');
                        break;

                    case 'accountant':
                        $role_obj->add_cap('mb_view_customers');
                        $role_obj->add_cap('mb_view_contracts');
                        $role_obj->add_cap('mb_manage_finance');
                        $role_obj->add_cap('mb_approve_contract_notes');
                        $role_obj->add_cap('mb_view_reports');
                        break;

                    case 'telesale':
                    case 'facebook':
                        $role_obj->add_cap('mb_view_assigned_customers');
                        $role_obj->add_cap('mb_create_appointments');
                        $role_obj->add_cap('mb_update_customer_history');
                        break;

                    case 'sale':
                        $role_obj->add_cap('mb_view_customers');
                        $role_obj->add_cap('mb_create_customers');
                        $role_obj->add_cap('mb_view_appointments');
                        $role_obj->add_cap('mb_update_appointments');
                        $role_obj->add_cap('mb_create_contracts');
                        $role_obj->add_cap('mb_view_products');
                        break;

                    case 'photo_wedding':
                    case 'photo_pre_wedding':
                        $role_obj->add_cap('mb_view_assigned_contracts');
                        $role_obj->add_cap('mb_view_schedule');
                        $role_obj->add_cap('mb_update_contract_status');
                        break;

                    case 'tailor':
                        $role_obj->add_cap('mb_view_products');
                        $role_obj->add_cap('mb_create_inspections');
                        $role_obj->add_cap('mb_update_product_status');
                        break;
                }

                // Common task capabilities
                if (in_array($role, ['administrator', 'manager', 'accountant', 'sale', 'photo_wedding', 'photo_pre_wedding', 'tailor'])) {
                    $role_obj->add_cap('mb_view_assigned_tasks');
                    $role_obj->add_cap('mb_update_task_status');
                    $role_obj->add_cap('mb_comment_on_tasks');
                }
            }
        }
    }
}
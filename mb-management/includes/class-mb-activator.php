<?php
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
        // Attendance table
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
        // Rewards table
        $sql = "CREATE TABLE IF NOT EXISTS mb_rewards (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            type enum('reward','penalty') NOT NULL,
            amount decimal(10,2) NOT NULL,
            reason text NOT NULL,
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
        // Customers table
        $sql = "CREATE TABLE IF NOT EXISTS mb_customers (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            phone varchar(20) NOT NULL,
            source enum('facebook','tiktok','youtube','walk_in') NOT NULL,
            assigned_to bigint(20) unsigned DEFAULT NULL,
            status enum('new','contacted','appointment','contracted','completed') NOT NULL DEFAULT 'new',
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY assigned_to (assigned_to),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Customer history table
        $sql = "CREATE TABLE IF NOT EXISTS mb_customer_history (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            customer_id bigint(20) NOT NULL,
            action varchar(50) NOT NULL,
            note text NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY customer_id (customer_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Appointments table
        $sql = "CREATE TABLE IF NOT EXISTS mb_appointments (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            customer_id bigint(20) NOT NULL,
            appointment_date datetime NOT NULL,
            status enum('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
            assigned_to bigint(20) unsigned DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY customer_id (customer_id),
            KEY assigned_to (assigned_to),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Products table
        $sql = "CREATE TABLE IF NOT EXISTS mb_products (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            code varchar(50) NOT NULL UNIQUE,
            name varchar(255) NOT NULL,
            category enum('wedding_dress','vest','accessories','ao_dai') NOT NULL,
            status enum('available','rented','maintenance') NOT NULL DEFAULT 'available',
            description text,
            images text,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";
        dbDelta($sql);
        // Product history table
        $sql = "CREATE TABLE IF NOT EXISTS mb_product_history (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            product_id bigint(20) NOT NULL,
            action varchar(50) NOT NULL,
            note text NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY product_id (product_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Product inspections table
        $sql = "CREATE TABLE IF NOT EXISTS mb_product_inspections (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            product_id bigint(20) NOT NULL,
            status enum('pending','checked','approved') NOT NULL DEFAULT 'pending',
            condition_report text NOT NULL,
            issues text,
            recommendations text,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            checked_by bigint(20) unsigned DEFAULT NULL,
            checked_at datetime DEFAULT NULL,
            approved_by bigint(20) unsigned DEFAULT NULL,
            approved_at datetime DEFAULT NULL,
            notes text,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY product_id (product_id),
            KEY created_by (created_by),
            KEY checked_by (checked_by),
            KEY approved_by (approved_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Product inspection history table
        $sql = "CREATE TABLE IF NOT EXISTS mb_product_inspection_history (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            inspection_id bigint(20) NOT NULL,
            action varchar(50) NOT NULL,
            status_from varchar(50) NOT NULL,
            status_to varchar(50) NOT NULL,
            note text,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY inspection_id (inspection_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Contracts table
        $sql = "CREATE TABLE IF NOT EXISTS mb_contracts (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            customer_id bigint(20) NOT NULL,
            type enum('dress_rental','wedding_photo','pre_wedding_photo') NOT NULL,
            total_amount decimal(10,2) NOT NULL,
            paid_amount decimal(10,2) NOT NULL DEFAULT 0,
            status enum('draft','active','completed','cancelled') NOT NULL DEFAULT 'draft',
            start_date date NOT NULL,
            end_date date NOT NULL,
            photographer_id bigint(20) unsigned DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY customer_id (customer_id),
            KEY photographer_id (photographer_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Contract items table
        $sql = "CREATE TABLE IF NOT EXISTS mb_contract_items (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            contract_id bigint(20) NOT NULL,
            product_id bigint(20) NOT NULL,
            rental_start date NOT NULL,
            rental_end date NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY product_id (product_id)
        ) $charset_collate;";
        dbDelta($sql);
        // Contract notes table
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
        // Contract payments table
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
        // Tasks table
        $sql = "CREATE TABLE IF NOT EXISTS mb_tasks (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description text NOT NULL,
            assigned_to bigint(20) unsigned DEFAULT NULL,
            status enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
            due_date datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY assigned_to (assigned_to),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
        // Task comments table
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
        // Notifications table
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
        // Transactions table
        $sql = "CREATE TABLE IF NOT EXISTS mb_transactions (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            type enum('income','expense') NOT NULL,
            amount decimal(10,2) NOT NULL,
            description text NOT NULL,
            contract_id bigint(20) DEFAULT NULL,
            created_by bigint(20) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY contract_id (contract_id),
            KEY created_by (created_by)
        ) $charset_collate;";
        dbDelta($sql);
    }

    private static function create_roles() {
        // Add custom roles
        add_role('manager', 'Manager', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false
        ));

        add_role('accountant', 'Accountant', array(
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

        add_role('tailor', 'Tailor', array(
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
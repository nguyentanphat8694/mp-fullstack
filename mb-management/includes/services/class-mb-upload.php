<?php
class MB_Upload_Service {
    private $allowed_types = ['image/jpeg', 'image/png'];
    private $max_size = 5242880; // 5MB
    private $upload_dir = 'mb-uploads';
    private $logger;

    public function __construct() {
        $this->logger = new MB_Logger();
    }

    public function upload_file($file, $type = 'product') {
        try {
            // Validate file
            $validation = $this->validate_file($file);
            if (is_wp_error($validation)) {
                return $validation;
            }

            // Create upload directory if not exists
            $upload_path = $this->get_upload_path($type);
            if (!file_exists($upload_path)) {
                wp_mkdir_p($upload_path);
            }

            // Generate unique filename
            $filename = $this->generate_unique_filename($file['name'], $upload_path);
            
            // Move uploaded file
            $file_path = $upload_path . '/' . $filename;
            if (!move_uploaded_file($file['tmp_name'], $file_path)) {
                throw new Exception('Failed to move uploaded file.');
            }

            return [
                'url' => $this->get_upload_url($type) . '/' . $filename,
                'path' => $file_path,
                'filename' => $filename
            ];
        } catch (Exception $e) {
            $this->logger->error('Upload failed: ' . $e->getMessage());
            return new WP_Error('upload_failed', $e->getMessage());
        }
    }

    private function validate_file($file) {
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return new WP_Error('upload_error', $this->get_upload_error_message($file['error']));
        }

        // Check file type
        if (!in_array($file['type'], $this->allowed_types)) {
            return new WP_Error('invalid_type', 'File type not allowed.');
        }

        // Check file size
        if ($file['size'] > $this->max_size) {
            return new WP_Error('file_too_large', 'File size exceeds limit.');
        }

        return true;
    }

    private function get_upload_path($type) {
        $upload_dir = wp_upload_dir();
        return $upload_dir['basedir'] . '/' . $this->upload_dir . '/' . $type;
    }

    private function get_upload_url($type) {
        $upload_dir = wp_upload_dir();
        return $upload_dir['baseurl'] . '/' . $this->upload_dir . '/' . $type;
    }

    private function generate_unique_filename($filename, $path) {
        $info = pathinfo($filename);
        $ext = empty($info['extension']) ? '' : '.' . $info['extension'];
        $name = basename($filename, $ext);

        $number = 1;
        while (file_exists($path . '/' . $filename)) {
            $filename = $name . '-' . $number . $ext;
            $number++;
        }

        return $filename;
    }

    private function get_upload_error_message($code) {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
                return 'File exceeds upload_max_filesize directive.';
            case UPLOAD_ERR_FORM_SIZE:
                return 'File exceeds MAX_FILE_SIZE directive.';
            case UPLOAD_ERR_PARTIAL:
                return 'File was only partially uploaded.';
            case UPLOAD_ERR_NO_FILE:
                return 'No file was uploaded.';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Missing temporary folder.';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Failed to write file to disk.';
            case UPLOAD_ERR_EXTENSION:
                return 'File upload stopped by extension.';
            default:
                return 'Unknown upload error.';
        }
    }
} 
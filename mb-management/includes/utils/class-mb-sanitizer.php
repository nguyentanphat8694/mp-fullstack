<?php
class MB_Sanitizer {
    public function sanitize_string($string) {
        return sanitize_text_field($string);
    }

    public function sanitize_html($html) {
        return wp_kses_post($html);
    }

    public function sanitize_phone($phone) {
        return preg_replace('/[^0-9]/', '', $phone);
    }

    public function sanitize_decimal($number) {
        return filter_var($number, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }

    public function sanitize_date($date) {
        $clean_date = sanitize_text_field($date);
        return date('Y-m-d', strtotime($clean_date));
    }

    public function sanitize_datetime($datetime) {
        $clean_datetime = sanitize_text_field($datetime);
        return date('Y-m-d H:i:s', strtotime($clean_datetime));
    }

    public function sanitize_array($array, $allowed_keys = null) {
        $clean_array = array();
        
        foreach ($array as $key => $value) {
            if ($allowed_keys !== null && !in_array($key, $allowed_keys)) {
                continue;
            }
            
            if (is_array($value)) {
                $clean_array[$key] = $this->sanitize_array($value);
            } else {
                $clean_array[$key] = $this->sanitize_string($value);
            }
        }
        
        return $clean_array;
    }
} 
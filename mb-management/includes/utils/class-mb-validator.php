<?php
class MB_Validator {
    public function validate_phone($phone) {
        return preg_match('/^[0-9]{10,11}$/', $phone);
    }

    public function validate_required($data, $fields) {
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return new WP_Error('missing_field', "Field {$field} is required.");
            }
        }
        return true;
    }

    public function validate_date($date, $format = 'Y-m-d') {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    public function validate_datetime($datetime) {
        return $this->validate_date($datetime, 'Y-m-d H:i:s');
    }

    public function validate_decimal($number, $min = 0) {
        return is_numeric($number) && $number >= $min;
    }

    public function validate_enum($value, $allowed_values) {
        return in_array($value, $allowed_values);
    }

    public function validate_contract_type($type) {
        return $this->validate_enum($type, ['dress_rental', 'wedding_photo', 'pre_wedding_photo']);
    }

    public function validate_product_category($category) {
        return $this->validate_enum($category, ['wedding_dress', 'vest', 'accessories', 'ao_dai']);
    }
} 
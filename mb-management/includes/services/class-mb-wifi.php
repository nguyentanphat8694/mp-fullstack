<?php
class MB_Wifi_Service {
    private $company_wifi_names = ['Company_Wifi_1', 'Company_Wifi_2']; // Cấu hình trong admin

    public function validate_wifi($wifi_name, $ip_address) {
        // Kiểm tra wifi name có phải của công ty
        if (!in_array($wifi_name, $this->company_wifi_names)) {
            return new WP_Error('invalid_wifi', 'Bạn phải kết nối với Wifi công ty để chấm công.');
        }

        // Kiểm tra IP có thuộc range của công ty
        if (!$this->is_company_ip($ip_address)) {
            return new WP_Error('invalid_ip', 'IP không hợp lệ.');
        }

        return true;
    }

    private function is_company_ip($ip_address) {
        // Kiểm tra IP có thuộc range của công ty
        $company_ip_ranges = [
            ['192.168.1.0', '192.168.1.255'],
            // Thêm các range IP khác của công ty
        ];

        foreach ($company_ip_ranges as $range) {
            if ($this->ip_in_range($ip_address, $range[0], $range[1])) {
                return true;
            }
        }
        return false;
    }

    private function ip_in_range($ip, $start, $end) {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return false;
        }
        $ip = ip2long($ip);
        $start = ip2long($start);
        $end = ip2long($end);
        return ($ip >= $start && $ip <= $end);
    }
} 
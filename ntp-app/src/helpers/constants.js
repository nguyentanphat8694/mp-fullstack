export const QUERY_KEY = {
  CUSTOMER_LIST: 'customer_list',
  CUSTOMER_DETAIL: 'customer_detail',
  CUSTOMER_HISTORY: 'customer_history',
  USER_BY_ROLE: 'user_by_role',
};

export const CUSTOMER_SOURCE_OPTIONS = [
  {value: 'all', label: 'Tất cả nguồn'},
  {value: 'facebook', label: 'Facebook'},
  {value: 'tiktok', label: 'Tiktok'},
  {value: 'youtube', label: 'Youtube'},
  {value: 'walk_in', label: 'Vãng lai'}
];

export const CUSTOMER_STATUS_OPTIONS = [
  {value: 'all', label: 'Tất cả trạng thái'},
  {value: 'new', label: 'Mới'},
  {value: 'contacted', label: 'Đã liên hệ'},
  {value: 'appointment', label: 'Đã hẹn lịch'},
  {value: 'contracted', label: 'Đã ký HĐ'},
  {value: 'completed', label: 'Hoàn thành'}
];

export const STAFF_ROLE_OPTIONS = [
  {value: 'all', label: 'Tất cả vai trò'},
  {value: 'admin', label: 'Admin'},
  {value: 'manager', label: 'Quản lý'},
  {value: 'accountant', label: 'Kế toán'},
  {value: 'telesale', label: 'Telesale'},
  {value: 'facebook', label: 'Facebook'},
  {value: 'sale', label: 'Sale'},
  {value: 'photo-wedding', label: 'Photo Wedding'},
  {value: 'photo-pre-wedding', label: 'Photo Pre-wedding'},
  {value: 'tailor', label: 'Thợ may'},
];

export const REWARD_TYPE_OPTIONS = [
  {value: 'reward', label: 'Thưởng'},
  {value: 'penalty', label: 'Phạt'},
];
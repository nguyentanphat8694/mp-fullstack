export const QUERY_KEY = {
  CUSTOMER_LIST: 'customer_list',
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
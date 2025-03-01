export const QUERY_KEY = {
  CUSTOMER_LIST: 'customer_list',
  CUSTOMER_DETAIL: 'customer_detail',
  CUSTOMER_HISTORY: 'customer_history',
  USER_BY_ROLE: 'user_by_role',
  USER_LIST: 'user_list',
  PRODUCT_LIST: 'product_list',
  PRODUCT_DETAIL: 'product_detail',
  PRODUCT_HISTORY: 'product_history',
  PRODUCT_CHECK: 'product_check',
  TASK_DETAIL: 'task_detail',
  TASK_LIST: 'task_list',
  APPOINTMENT_LIST: 'appointment_list',
  CUSTOMER_OPTIONS: 'customer_options',
  CONTRACT_LIST: 'contract_list',
  CONTRACT_DETAIL: 'contract_detail',
  FINANCE_LIST: 'finance_list',
};

export const INPUT_TYPE = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  DATE: 'DATE',
  TIME: 'TIME',
  IMAGE_UPLOAD: 'IMAGE_UPLOAD',
};

export const ALIGN = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
}

export const STATUS_COLORS = {
  scheduled: "default",
  receiving: "warning",
  completed: "success",
  cancelled: "destructive"
}

export const STATUS_LABELS = {
  scheduled: "Chờ tiếp nhận",
  receiving: "Đang tiếp nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy"
}

export const TYPE_LABELS = {
  dress_rental: "Thuê váy cưới",
  wedding_photo: "Chụp ảnh cưới",
  pre_wedding_photo: "Chụp ảnh pre-wedding"
}

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
  {value: 'photo_wedding', label: 'Photo Wedding'},
  {value: 'photo_pre_wedding', label: 'Photo Pre-wedding'},
  {value: 'tailor', label: 'Thợ may'},
];

export const REWARD_TYPE_OPTIONS = [
  {value: 'reward', label: 'Thưởng'},
  {value: 'penalty', label: 'Phạt'},
];

export const TASK_STATUS_OPTIONS = [
  {value: 'all', label: 'Tất cả'},
  {value: 'pending', label: 'Chờ xử lý'},
  {value: 'in_progress', label: 'Đang thực hiện'},
  {value: 'completed', label: 'Hoàn thành'},
];

export const CONTRACT_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả loại" },
  { value: "dress_rental", label: "Thuê váy cưới" },
  { value: "wedding_photo", label: "Chụp ảnh cưới" },
  { value: "pre_wedding_photo", label: "Chụp ảnh pre-wedding" }
];

export const PRODUCT_CATEGORY_OPTIONS = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "wedding_dress", label: "Váy cưới" },
  { value: "vest", label: "Vest" },
  { value: "accessories", label: "Phụ kiện" },
  { value: "ao_dai", label: "Áo dài" }
];

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "scheduled", label: "Chờ tiếp nhận" },
  { value: "receiving", label: "Đang tiếp nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" }
];

export const ICON_NAME = {
  CALENDAR: 'Calendar',
  CHECK_CIRCLE: 'Check_Circle',
  EDIT: 'Edit',
  EYE: 'Eye',
  INFO: 'Info',
  LOGOUT: 'Logout',
  MENU: 'Menu',
  MORE_VERTICAL: 'More_Vertical',
  SETTINGS: 'Settings',
  SHOPPING_BAG: 'Shopping_Bag',
  TAG: 'Tag',
  TRASH: 'Trash2',
  USER: 'User',
  USER_PLUS: 'User_Plus',
  USERS: 'Users',
  X: 'X',
  X_CIRCLE: 'X_Circle',
};
# Wedding Management System UI Design

## Layout Components

### MainLayout
- Responsive sidebar (desktop) / bottom navigation (mobile)
- TopBar với user menu và notifications
- Main content area

### Components chung

#### UI Components cơ bản (từ @shadcn/ui)
- **Button** - Các loại button (primary, secondary, ghost, destructive)
- **Input** - Text input fields
- **Textarea** - Multiline text input
- **Select** - Dropdown select
- **Checkbox** - Checkbox input  
- **RadioGroup** - Radio button group
- **Switch** - Toggle switch
- **Slider** - Range slider
- **Avatar** - User avatars
- **Badge** - Status indicators
- **Label** - Form labels
- **Separator** - Visual dividers
- **ScrollArea** - Scrollable containers
- **Popover** - Popup menus
- **Tooltip** - Hover tooltips
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders

#### Custom Components
- **LoadingSpinner** - Hiển thị khi loading data
- **ErrorBoundary** - Xử lý lỗi

## Pages & Features

### 1. Authentication (/auth)
- Login form với JWT
- Forgot password
- Reset password

### 2. Dashboard (/)
Components:
- Thống kê tổng quan (dạng cards)
- Biểu đồ doanh thu (@nivo/line)
- Lịch hẹn trong ngày
- Tasks cần làm
- Notifications gần đây

### 3. Customer Management (/customers)
Pages:
- Danh sách khách hàng
- Chi tiết khách hàng
- Thêm/Sửa khách hàng
- Lịch hẹn

Components:
- CustomerTable - Bảng khách hàng với filter theo nguồn, trạng thái
- CustomerForm - Form thêm/sửa khách
- CustomerDetail - Thông tin chi tiết
- CustomerHistory - Timeline lịch sử chăm sóc
- AppointmentCalendar - Lịch hẹn
- AppointmentForm - Form đặt lịch hẹn

### 4. Contract Management (/contracts) 
Pages:
- Danh sách hợp đồng
- Chi tiết hợp đồng
- Tạo/Sửa hợp đồng
- Thanh toán hợp đồng

Components:
- ContractTable - Bảng hợp đồng với filter theo loại, trạng thái
- ContractForm - Form tạo/sửa hợp đồng
- ContractDetail - Chi tiết hợp đồng
- ContractNotes - Ghi chú hợp đồng
- PaymentForm - Form thanh toán
- PaymentHistory - Lịch sử thanh toán
- ProductSelection - Chọn sản phẩm cho thuê
- PhotographerSchedule - Lịch thợ chụp ảnh

### 5. Product Management (/products)
Pages:
- Danh sách sản phẩm
- Chi tiết sản phẩm  
- Thêm/Sửa sản phẩm
- Kiểm tra sản phẩm

Components:
- ProductTable - Bảng sản phẩm với filter theo danh mục
- ProductForm - Form thêm/sửa sản phẩm
- ProductDetail - Chi tiết sản phẩm
- ProductHistory - Lịch sử cho thuê/bảo trì
- InspectionForm - Form kiểm tra sản phẩm
- MaintenanceRequest - Form yêu cầu bảo trì

### 6. Task Management (/tasks)
Pages:
- Danh sách công việc
- Chi tiết công việc
- Tạo công việc

Components:
- TaskTable - Bảng công việc với filter
- TaskForm - Form tạo/sửa công việc
- TaskDetail - Chi tiết công việc
- TaskComments - Comments của task
- TaskTimeline - Timeline công việc

### 7. Employee Management (/employees)
Pages:
- Danh sách nhân viên
- Chi tiết nhân viên
- Chấm công
- Thưởng phạt

Components:
- EmployeeTable - Bảng nhân viên
- AttendanceForm - Form chấm công
- AttendanceCalendar - Lịch chấm công
- RewardForm - Form thưởng phạt
- MonthlySummary - Tổng hợp tháng

### 8. Financial Management (/finances)
Pages:
- Tổng quan tài chính
- Thu/Chi
- Yêu cầu mua sắm
- Báo cáo

Components:
- FinancialSummary - Tổng quan thu chi
- TransactionTable - Bảng giao dịch
- TransactionForm - Form thu/chi
- PurchaseRequestTable - Bảng yêu cầu mua sắm
- PurchaseRequestForm - Form yêu cầu
- Reports - Báo cáo tài chính

### 9. Settings (/settings)
Pages:
- Thông tin cá nhân
- Đổi mật khẩu
- Cài đặt thông báo

Components:
- ProfileForm - Form thông tin cá nhân
- PasswordForm - Form đổi mật khẩu
- NotificationSettings - Cài đặt thông báo

## Mobile Optimization

### Responsive Design
- Sử dụng Flexbox và Grid
- Mobile-first approach
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

### Mobile-specific Components
- BottomNavigation thay cho Sidebar
- Sheet thay cho Dialog
- Swipe actions cho các thao tác nhanh
- Floating Action Button cho thêm mới
- Pull-to-refresh cho refresh data

### Performance
- Code splitting theo routes
- Lazy loading components
- Image optimization
- Memoization cho heavy components
- Virtual scroll cho danh sách dài

## Theme
- Light/Dark mode support
- Primary color: indigo-600
- Secondary colors: slate-200 -> slate-800
- Accent colors: emerald-500, rose-500
- Rounded corners: rounded-lg
- Shadows: shadow-sm -> shadow-xl
- Typography: font-sans, các kích thước theo tailwind default 
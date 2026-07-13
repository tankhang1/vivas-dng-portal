export const mockStaff = [
  { id: '1', name: 'Nguyễn Văn A', username: 'nva', department: 'Văn phòng UBND', role: 'Super Admin', status: 'active' },
  { id: '2', name: 'Trần Thị B', username: 'ttb', department: 'Tư pháp', role: 'Admin', status: 'active' },
  { id: '3', name: 'Lê Văn C', username: 'lvc', department: 'Địa chính', role: 'Cán bộ xử lý', status: 'active' },
  { id: '4', name: 'Phạm Thị D', username: 'ptd', department: 'Công an', role: 'Cán bộ xử lý', status: 'inactive' },
  { id: '5', name: 'Vũ Văn F', username: 'vvf', department: 'Quân sự', role: 'Cán bộ xử lý', status: 'active' },
  { id: '6', name: 'Hoàng Thị E', username: 'hte', department: 'Văn phòng UBND', role: 'Biên tập viên', status: 'active' },
  { id: '7', name: 'Đặng Văn G', username: 'dvg', department: 'Tư pháp', role: 'Cán bộ xử lý', status: 'active' },
  { id: '8', name: 'Bùi Thị H', username: 'bth', department: 'Địa chính', role: 'Lãnh đạo', status: 'inactive' },
];

export const mockDepartments = [
  { id: '1', name: 'Văn phòng UBND', manager: 'Nguyễn Văn A', staffCount: 5 },
  { id: '2', name: 'Tư pháp', manager: 'Trần Thị B', staffCount: 3 },
  { id: '3', name: 'Địa chính', manager: 'Lê Văn C', staffCount: 4 },
  { id: '4', name: 'Công an', manager: 'Phạm Văn E', staffCount: 10 },
  { id: '5', name: 'Quân sự', manager: 'Vũ Văn F', staffCount: 5 },
  { id: '6', name: 'Văn hóa - Xã hội', manager: 'Hoàng Thị E', staffCount: 3 },
  { id: '7', name: 'Tài chính - Kế toán', manager: 'Đặng Văn G', staffCount: 2 },
];

export const mockRoles = [
  { id: '1', name: 'Super Admin', desc: 'Toàn quyền hệ thống', users: 1, permissions: ['Xem tổng quan', 'Quản lý hồ sơ', 'Quản lý phản ánh', 'Quản lý tin tức', 'Quản lý cán bộ', 'Quản lý thiết lập'] },
  { id: '2', name: 'Admin', desc: 'Quản trị viên', users: 2, permissions: ['Xem tổng quan', 'Quản lý hồ sơ', 'Quản lý phản ánh', 'Quản lý tin tức', 'Quản lý cán bộ', 'Quản lý thiết lập'] },
  { id: '3', name: 'Cán bộ xử lý', desc: 'Xử lý hồ sơ, phản ánh', users: 15, permissions: ['Quản lý hồ sơ', 'Quản lý phản ánh'] },
  { id: '4', name: 'Biên tập viên', desc: 'Đăng tin tức', users: 3, permissions: ['Quản lý tin tức'] },
  { id: '5', name: 'Lãnh đạo', desc: 'Xem báo cáo, phê duyệt', users: 4, permissions: ['Xem tổng quan', 'Quản lý thiết lập'] },
  { id: '6', name: 'Kế toán viên', desc: 'Quản lý thu chi ngân sách', users: 2, permissions: ['Xem tổng quan'] },
  { id: '7', name: 'Nhân viên văn thư', desc: 'Quản lý công văn, lưu trữ hồ sơ', users: 3, permissions: ['Quản lý hồ sơ'] },
];

export const allPermissions = [
  'Xem tổng quan',
  'Quản lý hồ sơ',
  'Quản lý phản ánh',
  'Quản lý tin tức',
  'Quản lý cán bộ',
  'Quản lý thiết lập',
];

export const mockNews = [
  { id: '1', title: 'Thông báo về việc làm CCCD gắn chip', category: 'thong-bao', status: 'published', date: '2023-10-01', source: 'Cổng TTĐT Xã Tây Hồ' },
  { id: '2', title: 'Khởi công xây dựng nhà văn hóa khu phố 3', category: 'su-kien', status: 'draft', date: '2023-10-05', source: 'Văn phòng UBND Xã' },
  { id: '3', title: 'Cảnh báo dịch sốt xuất huyết trên địa bàn', category: 'khan-cap', status: 'published', date: '2023-10-10', source: 'Trung tâm Y tế Xã Tây Hồ' },
  { id: '4', title: 'Lịch tiêm chủng mở rộng tháng 11', category: 'thong-bao', status: 'published', date: '2023-10-12', source: 'Trạm Y tế Xã Tây Hồ' },
  { id: '5', title: 'Ra quân tổng vệ sinh môi trường toàn xã', category: 'su-kien', status: 'published', date: '2023-10-15', source: 'Đoàn Thanh niên Xã' },
  { id: '6', title: 'Thông báo tạm ngừng cấp nước để sửa chữa', category: 'thong-bao', status: 'draft', date: '2023-10-18', source: 'Công ty Cấp nước' },
  { id: '7', title: 'Hội nghị tổng kết công tác năm', category: 'su-kien', status: 'draft', date: '2023-10-20', source: 'Văn phòng UBND Xã' },
  { id: '8', title: 'Cảnh báo mưa lũ, sạt lở đất', category: 'khan-cap', status: 'published', date: '2023-10-22', source: 'Ban Chỉ huy PCTT Xã' },
  { id: '9', title: 'Cảnh báo ngập úng cục bộ tại khu phố 4', category: 'khan-cap', status: 'draft', date: '2023-10-25', source: 'Ban Chỉ huy PCTT Xã' },
];

export const mockCitizens = [
  { id: '1', name: 'Lê Hoàng', phone: '0901234567', address: 'Khu phố 1, Xã Tây Hồ', interactions: 5 },
  { id: '2', name: 'Nguyễn Thị Hoa', phone: '0912345678', address: 'Khu phố 2, Xã Tây Hồ', interactions: 2 },
  { id: '3', name: 'Trần Văn Khánh', phone: '0923456789', address: 'Khu phố 1, Xã Tây Hồ', interactions: 1 },
  { id: '4', name: 'Phạm Thị Lan', phone: '0934567890', address: 'Khu phố 3, Xã Tây Hồ', interactions: 4 },
  { id: '5', name: 'Đỗ Văn Minh', phone: '0945678901', address: 'Khu phố 2, Xã Tây Hồ', interactions: 0 },
  { id: '6', name: 'Vũ Thị Nga', phone: '0956789012', address: 'Khu phố 4, Xã Tây Hồ', interactions: 3 },
  { id: '7', name: 'Bùi Văn Sơn', phone: '0967890123', address: 'Khu phố 3, Xã Tây Hồ', interactions: 6 },
  { id: '8', name: 'Ngô Thị Tuyết', phone: '0978901234', address: 'Khu phố 4, Xã Tây Hồ', interactions: 2 },
];

export const mockRoutingRules = [
  { id: '1', field: 'Môi trường', department: 'Địa chính', staff: 'Lê Văn C' },
  { id: '2', field: 'Trật tự', department: 'Công an', staff: 'Phạm Thị D' },
  { id: '3', field: 'Hành chính', department: 'Văn phòng UBND', staff: 'Nguyễn Văn A' },
  { id: '4', field: 'An ninh', department: 'Công an', staff: 'Phạm Thị D' },
  { id: '5', field: 'Tài chính', department: 'Tài chính - Kế toán', staff: 'Đặng Văn G' },
  { id: '6', field: 'Văn hóa', department: 'Văn hóa - Xã hội', staff: 'Hoàng Thị E' },
];

export const mockRoutedItems = [
  { id: '1', date: '2023-10-24 09:12', sender: 'Lê Hoàng', field: 'Môi trường', routedDepartment: 'Địa chính', routedStaff: 'Lê Văn C' },
  { id: '2', date: '2023-10-23 14:30', sender: 'Nguyễn A', field: 'Trật tự', routedDepartment: 'Công an', routedStaff: 'Phạm Thị D' },
  { id: '3', date: '2023-10-20 08:05', sender: 'Trần B', field: 'Hành chính', routedDepartment: 'Văn phòng UBND', routedStaff: 'Nguyễn Văn A' },
  { id: '4', date: '2023-10-19 16:40', sender: 'Phạm Thị Lan', field: 'An ninh', routedDepartment: 'Công an', routedStaff: 'Phạm Thị D' },
  { id: '5', date: '2023-10-18 10:22', sender: 'Đỗ Văn Minh', field: 'Tài chính', routedDepartment: 'Tài chính - Kế toán', routedStaff: 'Đặng Văn G' },
  { id: '6', date: '2023-10-17 13:05', sender: 'Vũ Thị Nga', field: 'Văn hóa', routedDepartment: 'Văn hóa - Xã hội', routedStaff: 'Hoàng Thị E' },
  { id: '7', date: '2023-10-16 09:50', sender: 'Bùi Văn Sơn', field: 'Môi trường', routedDepartment: 'Địa chính', routedStaff: 'Lê Văn C' },
  { id: '8', date: '2023-10-15 11:15', sender: 'Ngô Thị Tuyết', field: 'Trật tự', routedDepartment: 'Công an', routedStaff: 'Phạm Thị D' },
];

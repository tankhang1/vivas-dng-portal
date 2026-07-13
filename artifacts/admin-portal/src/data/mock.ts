export const mockStaff = [
  { id: '1', name: 'Nguyễn Văn A', username: 'nva', department: 'Văn phòng UBND', role: 'Super Admin', status: 'active' },
  { id: '2', name: 'Trần Thị B', username: 'ttb', department: 'Tư pháp', role: 'Admin', status: 'active' },
  { id: '3', name: 'Lê Văn C', username: 'lvc', department: 'Địa chính', role: 'Cán bộ xử lý', status: 'active' },
  { id: '4', name: 'Phạm Thị D', username: 'ptd', department: 'Công an', role: 'Cán bộ xử lý', status: 'inactive' },
];

export const mockDepartments = [
  { id: '1', name: 'Văn phòng UBND', manager: 'Nguyễn Văn A', staffCount: 5 },
  { id: '2', name: 'Tư pháp', manager: 'Trần Thị B', staffCount: 3 },
  { id: '3', name: 'Địa chính', manager: 'Lê Văn C', staffCount: 4 },
  { id: '4', name: 'Công an', manager: 'Phạm Văn E', staffCount: 10 },
  { id: '5', name: 'Quân sự', manager: 'Vũ Văn F', staffCount: 5 },
];

export const mockRoles = [
  { id: '1', name: 'Super Admin', desc: 'Toàn quyền hệ thống', users: 1 },
  { id: '2', name: 'Admin', desc: 'Quản trị viên', users: 2 },
  { id: '3', name: 'Cán bộ xử lý', desc: 'Xử lý hồ sơ, phản ánh', users: 15 },
  { id: '4', name: 'Biên tập viên', desc: 'Đăng tin tức', users: 3 },
  { id: '5', name: 'Lãnh đạo', desc: 'Xem báo cáo, phê duyệt', users: 4 },
];

export const mockNews = [
  { id: '1', title: 'Thông báo về việc làm CCCD gắn chip', category: 'thong-bao', status: 'published', date: '2023-10-01' },
  { id: '2', title: 'Khởi công xây dựng nhà văn hóa khu phố 3', category: 'su-kien', status: 'draft', date: '2023-10-05' },
  { id: '3', title: 'Cảnh báo dịch sốt xuất huyết trên địa bàn', category: 'khan-cap', status: 'published', date: '2023-10-10' },
];

export const mockCitizens = [
  { id: '1', name: 'Lê Hoàng', phone: '0901234567', address: 'Khu phố 1, Phường X', interactions: 5 },
  { id: '2', name: 'Nguyễn Thị Hoa', phone: '0912345678', address: 'Khu phố 2, Phường X', interactions: 2 },
];

export const mockRoutingRules = [
  { id: '1', field: 'Môi trường', department: 'Địa chính', staff: 'Lê Văn C' },
  { id: '2', field: 'Trật tự', department: 'Công an', staff: 'Phạm Thị D' },
  { id: '3', field: 'Hành chính', department: 'Văn phòng UBND', staff: 'Nguyễn Văn A' },
  { id: '4', field: 'An ninh', department: 'Công an', staff: 'Phạm Thị D' },
];

export const mockRoutedItems = [
  { id: '1', date: '2023-10-24 09:12', sender: 'Lê Hoàng', field: 'Môi trường', routedDepartment: 'Địa chính', routedStaff: 'Lê Văn C' },
  { id: '2', date: '2023-10-23 14:30', sender: 'Nguyễn A', field: 'Trật tự', routedDepartment: 'Công an', routedStaff: 'Phạm Thị D' },
  { id: '3', date: '2023-10-20 08:05', sender: 'Trần B', field: 'Hành chính', routedDepartment: 'Văn phòng UBND', routedStaff: 'Nguyễn Văn A' },
];

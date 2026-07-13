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

export const mockProcedures = [
  { id: '1', name: 'Đăng ký khai sinh', category: 'Hộ tịch', time: '1 ngày', fee: 'Miễn phí', active: true },
  { id: '2', name: 'Xác nhận tình trạng hôn nhân', category: 'Hộ tịch', time: '3 ngày', fee: '15,000 VND', active: true },
  { id: '3', name: 'Cấp sổ đỏ lần đầu', category: 'Địa chính', time: '30 ngày', fee: 'Theo quy định', active: false },
];

export const mockAppointments = [
  { id: '1', citizenName: 'Lê Hoàng', procedure: 'Đăng ký khai sinh', date: '2023-10-25', time: '08:30', status: 'mới', department: 'Tư pháp' },
  { id: '2', citizenName: 'Nguyễn Thị Hoa', procedure: 'Xác nhận tình trạng hôn nhân', date: '2023-10-25', time: '09:00', status: 'đã xác nhận', department: 'Tư pháp' },
  { id: '3', citizenName: 'Trần Văn K', procedure: 'Chuyển nhượng đất', date: '2023-10-25', time: '10:00', status: 'hoàn tất', department: 'Địa chính' },
];

export const mockQueue = [
  { number: 'A001', service: 'Hộ tịch', status: 'hoàn tất', waitTime: '5p' },
  { number: 'A002', service: 'Hộ tịch', status: 'đang phục vụ', waitTime: '10p' },
  { number: 'B001', service: 'Địa chính', status: 'đang chờ', waitTime: '15p' },
];

export const mockFeedback = [
  { id: '1', citizen: 'Lê Hoàng', title: 'Rác thải sinh hoạt ùn ứ', category: 'Môi trường', status: 'mới', date: '2023-10-24' },
  { id: '2', citizen: 'Nguyễn A', title: 'Hàng xóm hát karaoke ồn ào', category: 'Trật tự', status: 'đang xử lý', date: '2023-10-23' },
  { id: '3', citizen: 'Trần B', title: 'Đường ống nước vỡ', category: 'Hành chính', status: 'hoàn tất', date: '2023-10-20' },
];

export const mockCitizens = [
  { id: '1', name: 'Lê Hoàng', phone: '0901234567', address: 'Khu phố 1, Phường X', interactions: 5 },
  { id: '2', name: 'Nguyễn Thị Hoa', phone: '0912345678', address: 'Khu phố 2, Phường X', interactions: 2 },
];

export const mockEmergencyContacts = [
  { id: '1', name: 'Công an Phường', phone: '028 1234 5678', category: 'Khẩn cấp', active: true },
  { id: '2', name: 'Trạm Y tế', phone: '028 8765 4321', category: 'Y tế', active: true },
  { id: '3', name: 'UBND Phường (Hotline)', phone: '028 1111 2222', category: 'Hành chính', active: true },
];

export const mockNotifications = [
  { id: '1', title: 'Hồ sơ khai sinh đã hoàn tất', type: 'appointment', status: 'success', sentAt: '2023-10-24 10:00' },
  { id: '2', title: 'Cảnh báo ngập lụt khu vực X', type: 'news', status: 'success', sentAt: '2023-10-24 08:00' },
];

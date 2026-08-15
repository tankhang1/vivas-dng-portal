import feedbackGarbage1 from '../../../attached_assets/1783961533732_143563953939806758_7334235742624065552_23678616a_1783961699771.jpg';
import feedbackGarbage2 from '../../../attached_assets/1783961533762_143563953939806758_7334235742624065552_65c255582_1783961699762.jpg';
import feedbackStreetlight from '../../../attached_assets/1783961533782_143563953939806758_7334235742624065552_5bc882ab3_1783961699770.jpg';
import feedbackConstruction1 from '../../../attached_assets/1783961533799_143563953939806758_7334235742624065552_f646eff7a_1783961699769.jpg';
import feedbackConstruction2 from '../../../attached_assets/1783961533815_143563953939806758_7334235742624065552_10b485e9e_1783961699770.jpg';
import feedbackDrain from '../../../attached_assets/1783961533827_143563953939806758_7334235742624065552_383d836c0_1783961699770.jpg';
import feedbackSecurity from '../../../attached_assets/1783961533839_143563953939806758_7334235742624065552_32ae612c3_1783961699770.jpg';

const newsAttachment = (
  id: string,
  name: string,
  url: string,
): { id: string; name: string; url: string } => ({ id, name, url });

export const mockStaff = [
  { id: '1', name: 'Nguyễn Văn A', username: 'nva', department: 'Văn phòng UBND', role: 'Super Admin', phone: '0901234567', status: 'active' },
  { id: '2', name: 'Trần Thị B', username: 'ttb', department: 'Tư pháp', role: 'Admin', phone: '0902345678', status: 'active' },
  { id: '3', name: 'Lê Văn C', username: 'lvc', department: 'Địa chính', role: 'Cán bộ xử lý', phone: '0903456789', status: 'active' },
  { id: '4', name: 'Phạm Thị D', username: 'ptd', department: 'Công an', role: 'Cán bộ xử lý', phone: '0904567890', status: 'inactive' },
  { id: '5', name: 'Vũ Văn F', username: 'vvf', department: 'Quân sự', role: 'Cán bộ xử lý', phone: '0905678901', status: 'active' },
  { id: '6', name: 'Hoàng Thị E', username: 'hte', department: 'Văn phòng UBND', role: 'Biên tập viên', phone: '0906789012', status: 'active' },
  { id: '7', name: 'Đặng Văn G', username: 'dvg', department: 'Tư pháp', role: 'Cán bộ xử lý', phone: '0907890123', status: 'active' },
  { id: '8', name: 'Bùi Thị H', username: 'bth', department: 'Địa chính', role: 'Lãnh đạo', phone: '0908901234', status: 'inactive' },
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
  { id: '1', name: 'Super Admin', desc: 'Toàn quyền hệ thống', users: 1, permissions: ['Tổng quan', 'Vai trò', 'Phòng ban', 'Cán bộ', 'Tin tức', 'Công dân', 'Phản ánh', 'Đặt lịch hẹn', 'Điều phối'] },
  { id: '2', name: 'Admin', desc: 'Quản trị viên hệ thống', users: 2, permissions: ['Tổng quan', 'Phòng ban', 'Cán bộ', 'Tin tức', 'Công dân', 'Phản ánh', 'Đặt lịch hẹn', 'Điều phối'] },
  { id: '3', name: 'Cán bộ xử lý', desc: 'Xử lý phản ánh, lịch hẹn và điều phối', users: 15, permissions: ['Tổng quan', 'Công dân', 'Phản ánh', 'Đặt lịch hẹn', 'Điều phối'] },
  { id: '4', name: 'Biên tập viên', desc: 'Đăng và quản lý tin tức', users: 3, permissions: ['Tổng quan', 'Tin tức'] },
  { id: '5', name: 'Lãnh đạo', desc: 'Theo dõi tổng quan và phê duyệt nghiệp vụ', users: 4, permissions: ['Tổng quan', 'Công dân', 'Phản ánh', 'Đặt lịch hẹn', 'Điều phối'] },
  { id: '6', name: 'Kế toán viên', desc: 'Chỉ xem tổng quan vận hành', users: 2, permissions: ['Tổng quan'] },
  { id: '7', name: 'Nhân viên văn thư', desc: 'Quản lý công dân và hồ sơ tiếp nhận', users: 3, permissions: ['Tổng quan', 'Công dân'] },
];

export const permissionGroups = [
  {
    label: 'Quản trị hệ thống',
    description: 'Các quyền liên quan đến cấu hình, tổ chức và vận hành lõi.',
    permissions: ['Tổng quan', 'Vai trò', 'Phòng ban', 'Cán bộ'],
  },
  {
    label: 'Nội dung & hồ sơ',
    description: 'Các quyền quản lý nội dung và dữ liệu công dân.',
    permissions: ['Tin tức', 'Công dân'],
  },
  {
    label: 'Nghiệp vụ tiếp nhận',
    description: 'Các quyền xử lý phản ánh, lịch hẹn và điều phối nội bộ.',
    permissions: ['Phản ánh', 'Đặt lịch hẹn', 'Điều phối'],
  },
] as const;

export const allPermissions = permissionGroups.flatMap((group) => group.permissions);

export const mockNews = [
  {
    id: '1',
    title: 'Thông báo về việc làm CCCD gắn chip',
    category: 'thong-bao',
    status: 'published',
    date: '2023-10-01',
    source: 'Cổng TTĐT Xã Tây Hồ',
    audience: 'all-citizens',
    linkType: 'external',
    linkUrl: 'https://dichvucong.gov.vn',
    thumbnail: [{ id: 'n1-thumb', name: 'cccd-thumb.jpg', url: feedbackStreetlight }],
    media: [
      newsAttachment('n1-1', 'Quy trình làm CCCD.pdf', 'https://example.com/quy-trinh-cccd.pdf'),
    ],
    shortDescription:
      'Người dân trên địa bàn có thể đăng ký lịch làm CCCD gắn chip theo khung giờ tiếp nhận của bộ phận một cửa.',
    contentHtml: `
      <h2>Thông báo tiếp nhận hồ sơ</h2>
      <p>UBND Xã Tây Hồ thông báo triển khai tiếp nhận hồ sơ làm CCCD gắn chip cho công dân đủ điều kiện.</p>
      <ul>
        <li>Thời gian: từ thứ 2 đến thứ 6 hằng tuần</li>
        <li>Địa điểm: Bộ phận một cửa UBND Xã Tây Hồ</li>
        <li>Hồ sơ: CMND/CCCD cũ, sổ hộ khẩu hoặc giấy tờ xác nhận cư trú</li>
      </ul>
      <p>Người dân vui lòng đến đúng lịch hẹn để được hỗ trợ nhanh chóng.</p>
    `,
  },
  {
    id: '2',
    title: 'Khởi công xây dựng nhà văn hóa khu phố 3',
    category: 'su-kien',
    status: 'draft',
    date: '2023-10-05',
    source: 'Văn phòng UBND Xã',
    audience: 'residents',
    linkType: 'document',
    linkUrl: 'https://example.com/ke-hoach-khoi-cong.pdf',
    thumbnail: [{ id: 'n2-thumb', name: 'nha-van-hoa.jpg', url: feedbackConstruction1 }],
    media: [
      newsAttachment('n2-1', 'Biên bản khởi công.docx', 'https://example.com/bien-ban-khoi-cong.docx'),
      newsAttachment('n2-2', 'Sơ đồ mặt bằng.pdf', 'https://example.com/so-do-mat-bang.pdf'),
    ],
    shortDescription:
      'Dự án nhà văn hóa khu phố 3 được khởi công nhằm mở rộng không gian sinh hoạt cộng đồng và tổ chức các hoạt động văn hóa địa phương.',
    contentHtml: `
      <h2>Lễ khởi công dự án</h2>
      <p>Buổi lễ có sự tham dự của đại diện các ban ngành, đoàn thể và nhân dân khu phố 3.</p>
      <p>Công trình dự kiến hoàn thành trong quý IV, góp phần nâng cao chất lượng sinh hoạt cộng đồng.</p>
    `,
  },
  {
    id: '3',
    title: 'Cảnh báo dịch sốt xuất huyết trên địa bàn',
    category: 'khan-cap',
    status: 'published',
    date: '2023-10-10',
    source: 'Trung tâm Y tế Xã Tây Hồ',
    audience: 'all-citizens',
    linkType: 'external',
    linkUrl: 'https://moh.gov.vn',
    thumbnail: [{ id: 'n3-thumb', name: 'sot-xuat-huyet.jpg', url: feedbackConstruction2 }],
    media: [
      newsAttachment('n3-1', 'Khuyến cáo phòng bệnh.pdf', 'https://example.com/khuyen-cao-phong-benh.pdf'),
    ],
    shortDescription:
      'Ngành y tế khuyến nghị người dân chủ động dọn dẹp nơi ở, diệt lăng quăng và theo dõi triệu chứng để phòng chống sốt xuất huyết.',
    contentHtml: `
      <h2>Khuyến cáo khẩn</h2>
      <p>Trong thời gian gần đây ghi nhận nguy cơ gia tăng ca mắc sốt xuất huyết tại một số khu vực.</p>
      <ol>
        <li>Loại bỏ nước đọng quanh nhà</li>
        <li>Ngủ màn kể cả ban ngày</li>
        <li>Đến cơ sở y tế khi có dấu hiệu sốt cao, đau đầu, đau mỏi người</li>
      </ol>
    `,
  },
  {
    id: '4',
    title: 'Lịch tiêm chủng mở rộng tháng 11',
    category: 'thong-bao',
    status: 'published',
    date: '2023-10-12',
    source: 'Trạm Y tế Xã Tây Hồ',
    audience: 'residents',
    linkType: 'none',
    linkUrl: '',
    thumbnail: [{ id: 'n4-thumb', name: 'lich-tiem-chung.jpg', url: feedbackDrain }],
    media: [],
    shortDescription:
      'Trạm Y tế thông báo lịch tiêm chủng mở rộng trong tháng 11 dành cho trẻ em và các nhóm đối tượng ưu tiên.',
    contentHtml: `
      <h2>Thời gian tiêm chủng</h2>
      <p>Lịch tiêm diễn ra tại Trạm Y tế Xã Tây Hồ từ 8:00 đến 16:30 các ngày làm việc.</p>
      <p>Phụ huynh vui lòng mang theo sổ tiêm chủng và giấy khai sinh của trẻ.</p>
    `,
  },
  {
    id: '5',
    title: 'Ra quân tổng vệ sinh môi trường toàn xã',
    category: 'su-kien',
    status: 'published',
    date: '2023-10-15',
    source: 'Đoàn Thanh niên Xã',
    audience: 'residents',
    linkType: 'attachment',
    linkUrl: 'https://example.com/ke-hoach-ve-sinh-moi-truong.pdf',
    thumbnail: [{ id: 'n5-thumb', name: 've-sinh-moi-truong.jpg', url: feedbackGarbage1 }],
    media: [
      newsAttachment('n5-1', 'Kế hoạch ra quân.pdf', 'https://example.com/ke-hoach-ra-quan.pdf'),
      newsAttachment('n5-2', 'Danh sách khu vực phân công.xlsx', 'https://example.com/danh-sach-phan-cong.xlsx'),
    ],
    shortDescription:
      'Hoạt động tổng vệ sinh được tổ chức đồng loạt tại các khu phố nhằm nâng cao ý thức cộng đồng và cải thiện cảnh quan môi trường.',
    contentHtml: `
      <h2>Kêu gọi người dân tham gia</h2>
      <p>Hoạt động ra quân sẽ bắt đầu từ 6:30 sáng tại nhà văn hóa các khu phố.</p>
      <p>Đề nghị các hộ dân cùng phối hợp dọn vệ sinh trước cửa nhà và khu vực công cộng lân cận.</p>
    `,
  },
  {
    id: '6',
    title: 'Thông báo tạm ngừng cấp nước để sửa chữa',
    category: 'thong-bao',
    status: 'draft',
    date: '2023-10-18',
    source: 'Công ty Cấp nước',
    audience: 'all-citizens',
    linkType: 'external',
    linkUrl: 'https://example.com/thong-bao-cap-nuoc',
    thumbnail: [{ id: 'n6-thumb', name: 'cap-nuoc.jpg', url: feedbackGarbage2 }],
    media: [
      newsAttachment('n6-1', 'Thông báo cắt nước.pdf', 'https://example.com/thong-bao-cat-nuoc.pdf'),
    ],
    shortDescription:
      'Một số khu vực sẽ tạm ngừng cấp nước trong thời gian sửa chữa đường ống chính, người dân cần chủ động tích trữ nước sinh hoạt.',
    contentHtml: `
      <h2>Lịch sửa chữa đường ống</h2>
      <p>Thời gian tạm ngừng cấp nước dự kiến từ 22:00 ngày 18/10 đến 04:00 ngày 19/10.</p>
      <p>Đơn vị cấp nước xin lỗi vì sự bất tiện này và sẽ cấp nước trở lại ngay sau khi hoàn thành sửa chữa.</p>
    `,
  },
  {
    id: '7',
    title: 'Hội nghị tổng kết công tác năm',
    category: 'su-kien',
    status: 'draft',
    date: '2023-10-20',
    source: 'Văn phòng UBND Xã',
    audience: 'staff',
    linkType: 'document',
    linkUrl: 'https://example.com/chuong-trinh-tong-ket.pdf',
    thumbnail: [{ id: 'n7-thumb', name: 'tong-ket-cong-tac.jpg', url: feedbackSecurity }],
    media: [
      newsAttachment('n7-1', 'Chương trình hội nghị.pdf', 'https://example.com/chuong-trinh-hoi-nghi.pdf'),
      newsAttachment('n7-2', 'Mẫu đăng ký tham dự.docx', 'https://example.com/mau-dang-ky.docx'),
    ],
    shortDescription:
      'Hội nghị tổng kết là dịp nhìn lại kết quả thực hiện nhiệm vụ năm qua và định hướng chỉ tiêu cho năm tiếp theo.',
    contentHtml: `
      <h2>Nội dung hội nghị</h2>
      <p>Hội nghị dự kiến có phần báo cáo tổng kết, thảo luận chuyên đề và biểu dương tập thể xuất sắc.</p>
      <p>Thành phần tham dự gồm cán bộ, công chức và đại diện các đoàn thể liên quan.</p>
    `,
  },
  {
    id: '8',
    title: 'Cảnh báo mưa lũ, sạt lở đất',
    category: 'khan-cap',
    status: 'published',
    date: '2023-10-22',
    source: 'Ban Chỉ huy PCTT Xã',
    audience: 'all-citizens',
    linkType: 'external',
    linkUrl: 'https://example.com/canh-bao-mua-lu',
    thumbnail: [{ id: 'n8-thumb', name: 'mua-lu.jpg', url: feedbackDrain }],
    media: [
      newsAttachment('n8-1', 'Bản tin thời tiết.pdf', 'https://example.com/ban-tin-thoi-tiet.pdf'),
    ],
    shortDescription:
      'Người dân sinh sống tại khu vực trũng thấp cần chú ý theo dõi diễn biến thời tiết, hạn chế di chuyển qua vùng ngập nước.',
    contentHtml: `
      <h2>Biện pháp phòng tránh</h2>
      <ul>
        <li>Không đi qua khu vực nước chảy xiết</li>
        <li>Gia cố mái tôn, biển hiệu và vật dụng dễ bay</li>
        <li>Chuẩn bị đèn pin, pin sạc và nhu yếu phẩm cần thiết</li>
      </ul>
    `,
  },
  {
    id: '9',
    title: 'Cảnh báo ngập úng cục bộ tại khu phố 4',
    category: 'khan-cap',
    status: 'draft',
    date: '2023-10-25',
    source: 'Ban Chỉ huy PCTT Xã',
    audience: 'residents',
    linkType: 'none',
    linkUrl: '',
    thumbnail: [{ id: 'n9-thumb', name: 'ngap-ung.jpg', url: feedbackConstruction1 }],
    media: [
      newsAttachment('n9-1', 'Sơ đồ điểm ngập.pdf', 'https://example.com/so-do-diem-ngap.pdf'),
    ],
    shortDescription:
      'Một số tuyến đường tại khu phố 4 ghi nhận ngập úng cục bộ sau mưa lớn, cần hạn chế phương tiện đi qua trong giờ cao điểm.',
    contentHtml: `
      <h2>Khu vực ảnh hưởng</h2>
      <p>Khu phố 4 và các nhánh đường thấp trũng có nguy cơ ngập cục bộ khi mưa lớn kéo dài.</p>
      <p>Lực lượng chức năng đang tổ chức kiểm tra hệ thống thoát nước và khơi thông cống rãnh.</p>
    `,
  },
];

export const mockCitizens = [
  {
    id: '1',
    name: 'Bùi Hải Hà',
    cccd: '024301005678',
    phone: '0934826491',
    gender: 'Nữ',
    birthday: '1990-05-12',
    email: 'buihaiha@gmail.com',
    occupation: 'Giáo viên',
    education: 'Đại học',
    ethnicity: 'Kinh',
    religion: 'Không',
    household: 'Hộ ông Nguyễn Văn A',
    relationship: 'Vợ/chồng',
    status: 'published',
    address: 'Khu phố 1, Xã Tây Hồ',
    notes: 'Tham gia tích cực hoạt động khu phố.',
    interactions: 5,
  },
  {
    id: '2',
    name: 'Giàng A Phố',
    cccd: '024301005679',
    phone: '0982134590',
    gender: 'Nam',
    birthday: '1985-11-03',
    email: 'giangapho@gmail.com',
    occupation: 'Nông dân',
    education: 'Trung học phổ thông',
    ethnicity: 'Mông',
    religion: 'Không',
    household: 'Hộ bà Trần Thị B',
    relationship: 'Chủ hộ',
    status: 'published',
    address: 'Khu phố 2, Xã Tây Hồ',
    notes: 'Đang chờ hỗ trợ thủ tục đất đai.',
    interactions: 2,
  },
  {
    id: '3',
    name: 'Lê Quốc Anh',
    cccd: '024301005680',
    phone: '0877869080',
    gender: 'Nam',
    birthday: '1998-02-20',
    email: 'lequocanh@gmail.com',
    occupation: 'Kỹ sư xây dựng',
    education: 'Đại học',
    ethnicity: 'Kinh',
    religion: 'Phật giáo',
    household: 'Hộ ông Nguyễn Văn A',
    relationship: 'Con',
    status: 'published',
    address: 'Khu phố 1, Xã Tây Hồ',
    notes: '-',
    interactions: 1,
  },
  {
    id: '4',
    name: 'Mạnh Tuấn Nguyễn',
    cccd: '024301005681',
    phone: '0988777145',
    gender: 'Nam',
    birthday: '1979-07-08',
    email: 'manhtuan.nguyen@gmail.com',
    occupation: 'Kinh doanh tự do',
    education: 'Cao đẳng',
    ethnicity: 'Kinh',
    religion: 'Công giáo',
    household: 'Hộ bà Trần Thị B',
    relationship: 'Khác',
    status: 'published',
    address: 'Khu phố 3, Xã Tây Hồ',
    notes: 'Chủ hộ kinh doanh tạp hóa.',
    interactions: 4,
  },
  {
    id: '5',
    name: 'Nguyễn Thị Lộc',
    cccd: '024301005682',
    phone: '0123456778',
    gender: 'Nữ',
    birthday: '2001-09-15',
    email: 'nguyenthiloc@gmail.com',
    occupation: 'Sinh viên',
    education: 'Đại học (đang học)',
    ethnicity: 'Kinh',
    religion: 'Không',
    household: 'Hộ ông Nguyễn Văn A',
    relationship: 'Con',
    status: 'published',
    address: 'Khu phố 2, Xã Tây Hồ',
    notes: '-',
    interactions: 0,
  },
  {
    id: '6',
    name: 'Đỗ Duy Toàn',
    cccd: '024301005683',
    phone: '0908070605',
    gender: 'Nam',
    birthday: '1966-01-30',
    email: 'doduytoan@gmail.com',
    occupation: 'Đã nghỉ hưu',
    education: 'Trung cấp',
    ethnicity: 'Kinh',
    religion: 'Phật giáo',
    household: 'Hộ bà Trần Thị B',
    relationship: 'Chủ hộ',
    status: 'published',
    address: 'Khu phố 4, Xã Tây Hồ',
    notes: 'Cựu chiến binh, sinh hoạt tại hội cựu chiến binh xã.',
    interactions: 3,
  },
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
  {
    id: '1', date: '2023-10-24 09:12', sender: 'Lê Hoàng', phone: '0912340001', field: 'Môi trường',
    title: 'Rác thải tồn đọng tại khu vực chợ', address: 'Gần chợ Tây Hồ, Khu phố 1',
    content: 'Rác thải sinh hoạt tồn đọng nhiều ngày chưa được thu gom, gây mùi hôi khó chịu cho các hộ dân xung quanh.',
    routedDepartment: 'Địa chính', routedStaff: 'Lê Văn C',
  },
  {
    id: '2', date: '2023-10-23 14:30', sender: 'Nguyễn A', phone: '0912340002', field: 'Trật tự',
    title: 'Lấn chiếm vỉa hè buôn bán', address: 'Đường số 5, Khu phố 2',
    content: 'Một số hộ kinh doanh lấn chiếm vỉa hè để bày bán hàng hóa, gây cản trở người đi bộ.',
    routedDepartment: 'Công an', routedStaff: 'Phạm Thị D',
  },
  {
    id: '3', date: '2023-10-20 08:05', sender: 'Trần B', phone: '0912340003', field: 'Hành chính',
    title: 'Yêu cầu hướng dẫn thủ tục đăng ký tạm trú', address: 'Khu phố 3',
    content: 'Đề nghị cán bộ hướng dẫn hồ sơ và quy trình đăng ký tạm trú cho người thuê nhà.',
    routedDepartment: 'Văn phòng UBND', routedStaff: 'Nguyễn Văn A',
  },
  {
    id: '4', date: '2023-10-19 16:40', sender: 'Phạm Thị Lan', phone: '0912340004', field: 'An ninh',
    title: 'Nhóm thanh niên tụ tập gây mất an ninh', address: 'Công viên trung tâm',
    content: 'Phản ánh tình trạng tụ tập, gây ồn ào vào ban đêm tại khu vực công viên trung tâm.',
    routedDepartment: 'Công an', routedStaff: 'Phạm Thị D',
  },
  {
    id: '5', date: '2023-10-18 10:22', sender: 'Đỗ Văn Minh', phone: '0912340005', field: 'Tài chính',
    title: 'Yêu cầu hỗ trợ cấp lại giấy chứng nhận', address: 'Khu phố 2',
    content: 'Đề nghị hướng dẫn thủ tục cấp lại giấy chứng nhận quyền sử dụng đất bị mất.',
    routedDepartment: 'Tài chính - Kế toán', routedStaff: 'Đặng Văn G',
  },
  {
    id: '6', date: '2023-10-17 13:05', sender: 'Vũ Thị Nga', phone: '0912340006', field: 'Văn hóa',
    title: 'Đề nghị hỗ trợ tổ chức hoạt động văn hóa khu phố', address: 'Nhà văn hóa Khu phố 4',
    content: 'Đề nghị UBND hỗ trợ kinh phí và địa điểm tổ chức hoạt động văn hóa cộng đồng cuối năm.',
    routedDepartment: 'Văn hóa - Xã hội', routedStaff: 'Hoàng Thị E',
  },
  {
    id: '7', date: '2023-10-16 09:50', sender: 'Bùi Văn Sơn', phone: '0912340007', field: 'Môi trường',
    title: 'Cống thoát nước bị nghẽn', address: 'Khu phố 1',
    content: 'Cống thoát nước bị nghẽn khiến nước tràn ra đường mỗi khi mưa lớn, đề nghị kiểm tra xử lý.',
    routedDepartment: 'Địa chính', routedStaff: 'Lê Văn C',
  },
  {
    id: '8', date: '2023-10-15 11:15', sender: 'Ngô Thị Tuyết', phone: '0912340008', field: 'Trật tự',
    title: 'Xây dựng lấn chiếm lòng đường', address: 'Đường số 5, Khu phố 1',
    content: 'Một hộ dân tập kết vật liệu xây dựng lấn chiếm lòng đường gây cản trở giao thông.',
    routedDepartment: 'Công an', routedStaff: 'Phạm Thị D',
  },
];

export const feedbackCategories = [
  { value: 'hanh-chinh', label: 'Hành chính' },
  { value: 'trat-tu', label: 'Trật tự đô thị' },
  { value: 'moi-truong', label: 'Môi trường' },
  { value: 'an-ninh', label: 'An ninh' },
  { value: 'can-bo-tiep-dan', label: 'Cán bộ tiếp dân' },
  { value: 'khac', label: 'Khác' },
];

export const mockFeedback = [
  {
    id: '1', title: 'Rác tồn đọng tại ngõ 12', content: 'Rác thải sinh hoạt bị đổ tràn ra lối đi, tồn đọng nhiều ngày chưa được thu gom, gây mùi hôi khó chịu.',
    category: 'moi-truong', name: 'Đoàn Tấn Khang', phone: '0975862265', address: 'Ngõ 12, Khu phố 1', location: 'Ngõ 12, Khu phố 1',
    privacy: 'public', status: 'pending', date: '2023-10-24', images: [
      feedbackGarbage1,
      feedbackGarbage2,
    ], assignedStaff: '',
  },
  {
    id: '2', title: 'Đèn đường hư hỏng trước cổng chợ', content: 'Đèn đường trước cổng chợ Tây Hồ đã tắt hơn một tuần, khu vực tối vào ban đêm gây mất an toàn giao thông.',
    category: 'trat-tu', name: 'Nguyễn Thị Hoa', phone: '0912345678', address: 'Cổng chợ, Khu phố 2', location: 'Cổng chợ, Khu phố 2',
    privacy: 'public', status: 'processing', date: '2023-10-22', images: [
      feedbackStreetlight,
    ], assignedStaff: 'Phạm Thị D',
    reply: {
      content: 'Đơn vị điện lực đã tiếp nhận, dự kiến khắc phục đèn đường trước cổng chợ trong tuần này.',
      fileName: 'bien-ban-tiep-nhan-den-duong.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      date: '2023-10-23T09:30:00',
    },
  },
  {
    id: '3', title: 'Cán bộ tiếp dân thái độ chưa đúng mực', content: 'Phản ánh về cách ứng xử khi làm thủ tục đăng ký tạm trú tại bộ phận một cửa.',
    category: 'can-bo-tiep-dan', name: 'Ẩn danh', phone: '', address: '', location: 'Bộ phận một cửa',
    privacy: 'anonymous', status: 'resolved', date: '2023-10-18', images: [] as string[], assignedStaff: 'Nguyễn Văn A',
    reply: {
      content: 'UBND xã đã nhắc nhở và chấn chỉnh thái độ tiếp dân của cán bộ liên quan. Đã xin lỗi công dân.',
      fileName: 'bien-ban-chan-chinh-tiep-dan.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      date: '2023-10-19T15:00:00',
    },
  },
  {
    id: '4', title: 'Xây dựng lấn chiếm lòng đường', content: 'Một hộ dân tập kết vật liệu xây dựng lấn chiếm lòng đường gây cản trở giao thông.',
    category: 'trat-tu', name: 'Trần Văn Khánh', phone: '0923456789', address: 'Đường số 5, Khu phố 1', location: 'Đường số 5, Khu phố 1',
    privacy: 'public', status: 'pending', date: '2023-10-25', images: [
      feedbackConstruction1,
      feedbackConstruction2,
      feedbackConstruction1,
    ], assignedStaff: '',
  },
  {
    id: '5', title: 'Yêu cầu hỗ trợ cấp lại giấy chứng nhận', content: 'Đề nghị hướng dẫn thủ tục cấp lại giấy chứng nhận quyền sử dụng đất bị mất.',
    category: 'hanh-chinh', name: 'Phạm Thị Lan', phone: '0934567890', address: 'Khu phố 3', location: '',
    privacy: 'public', status: 'processing', date: '2023-10-20', images: [] as string[], assignedStaff: 'Lê Văn C',
    reply: {
      content: 'Đã hướng dẫn công dân chuẩn bị hồ sơ và nộp tại bộ phận một cửa để cấp lại giấy chứng nhận.',
      fileName: 'huong-dan-cap-lai-giay-chung-nhan.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      date: '2023-10-21T10:00:00',
    },
  },
  {
    id: '6', title: 'Nước thải chảy tràn ra đường', content: 'Cống thoát nước bị nghẽn khiến nước thải tràn ra mặt đường, ảnh hưởng sinh hoạt của người dân.',
    category: 'moi-truong', name: 'Đỗ Văn Minh', phone: '0945678901', address: 'Khu phố 2', location: 'Khu phố 2',
    privacy: 'public', status: 'resolved', date: '2023-10-15', images: [
      feedbackDrain,
    ], assignedStaff: 'Lê Văn C',
    reply: {
      content: 'Đơn vị thi công đã thông cống và nạo vét đoạn cống trước nhà, tình trạng nước tràn đã được xử lý.',
      fileName: 'bien-ban-xu-ly-cong-thoat-nuoc.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      date: '2023-10-16T08:00:00',
    },
  },
  {
    id: '7', title: 'Nhóm thanh niên tụ tập gây mất an ninh', content: 'Phản ánh tình trạng tụ tập, gây ồn ào vào ban đêm tại khu vực công viên.',
    category: 'an-ninh', name: 'Ẩn danh', phone: '', address: '', location: 'Công viên trung tâm',
    privacy: 'anonymous', status: 'pending', date: '2023-10-26', images: [
      feedbackSecurity,
    ], assignedStaff: '',
  },
];

// Dummy dữ liệu "phản ánh đã gửi" (comment) gắn theo số điện thoại công dân,
// dùng làm fallback hiển thị khi API bình luận chưa có dữ liệu ở môi trường dev.
export const mockCitizenComments = [
  {
    id: 101,
    category_item: 1,
    citizen_item: 1,
    staff_approve_item: 1,
    staff_item: 1,
    c_uuid: 'cmt-101',
    name: 'Bùi Hải Hà',
    zalo_user_id: '',
    phone: '0934826491',
    address: 'Khu phố 1, Xã Tây Hồ',
    title: 'Đèn chiếu sáng ngõ 3 bị hỏng',
    content:
      'Đèn đường tại ngõ 3, khu phố 1 đã tắt gần một tuần, khu vực tối gây bất tiện cho việc đi lại buổi tối.',
    url: '',
    status: 1,
    time_create_number: 1698130800000,
    time_create: '2023-10-24T09:00:00',
    time_active: '2023-10-25T10:00:00',
    time_deactive: null,
    annonymous: 0,
    time_day: 1,
    rating: 0,
    reply: {
      staffName: 'Lê Văn C',
      content:
        'UBND xã đã tiếp nhận và chuyển đơn vị điện lực khắc phục. Đèn chiếu sáng ngõ 3 đã được sửa xong ngày 25/10.',
      date: '2023-10-25T10:00:00',
      fileName: 'bien-ban-xu-ly-den-ngo-3.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  {
    id: 102,
    category_item: 3,
    citizen_item: 1,
    staff_approve_item: 0,
    staff_item: 0,
    c_uuid: 'cmt-102',
    name: 'Bùi Hải Hà',
    zalo_user_id: '',
    phone: '0934826491',
    address: 'Khu phố 1, Xã Tây Hồ',
    title: 'Rác thải tồn đọng chưa thu gom',
    content:
      'Rác sinh hoạt tại đầu ngõ chưa được thu gom trong 3 ngày, gây mùi khó chịu cho các hộ xung quanh.',
    url: '',
    status: 0,
    time_create_number: 1699167600000,
    time_create: '2023-11-05T08:30:00',
    time_active: null,
    time_deactive: null,
    annonymous: 0,
    time_day: 1,
    rating: 0,
  },
  {
    id: 103,
    category_item: 2,
    citizen_item: 2,
    staff_approve_item: 1,
    staff_item: 3,
    c_uuid: 'cmt-103',
    name: 'Giàng A Phố',
    zalo_user_id: '',
    phone: '0982134590',
    address: 'Khu phố 2, Xã Tây Hồ',
    title: 'Đề nghị hỗ trợ thủ tục đất đai',
    content:
      'Đề nghị cán bộ địa chính hướng dẫn thủ tục xác nhận ranh giới đất cho hộ gia đình.',
    url: '',
    status: 1,
    time_create_number: 1697698800000,
    time_create: '2023-10-19T14:00:00',
    time_active: '2023-10-20T09:15:00',
    time_deactive: null,
    annonymous: 0,
    time_day: 1,
    rating: 5,
    reply: {
      staffName: 'Nguyễn Văn A',
      content:
        'Bộ phận địa chính đã hướng dẫn hộ gia đình bổ sung hồ sơ. Đính kèm hướng dẫn quy trình xác nhận ranh giới đất.',
      date: '2023-10-20T09:15:00',
      fileName: 'huong-dan-thu-tuc-dat-dai.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  {
    id: 104,
    category_item: 4,
    citizen_item: 4,
    staff_approve_item: 0,
    staff_item: 0,
    c_uuid: 'cmt-104',
    name: 'Mạnh Tuấn Nguyễn',
    zalo_user_id: '',
    phone: '0988777145',
    address: 'Khu phố 3, Xã Tây Hồ',
    title: 'Phản ánh tụ tập gây ồn ào ban đêm',
    content:
      'Khu vực gần chợ Tây Hồ thường xuyên có nhóm thanh niên tụ tập gây ồn ào sau 22h.',
    url: '',
    status: 0,
    time_create_number: 1700031600000,
    time_create: '2023-11-15T21:45:00',
    time_active: null,
    time_deactive: null,
    annonymous: 0,
    time_day: 1,
    rating: 0,
  },
  {
    id: 105,
    category_item: 3,
    citizen_item: 6,
    staff_approve_item: 1,
    staff_item: 3,
    c_uuid: 'cmt-105',
    name: 'Đỗ Duy Toàn',
    zalo_user_id: '',
    phone: '0908070605',
    address: 'Khu phố 4, Xã Tây Hồ',
    title: 'Cống thoát nước bị nghẽn',
    content:
      'Cống thoát nước trước nhà bị nghẽn, nước tràn ra đường mỗi khi mưa lớn, đề nghị kiểm tra xử lý.',
    url: '',
    status: 1,
    time_create_number: 1697352000000,
    time_create: '2023-10-15T16:00:00',
    time_active: '2023-10-16T08:00:00',
    time_deactive: null,
    annonymous: 0,
    time_day: 1,
    rating: 4,
    reply: {
      staffName: 'Lê Văn C',
      content:
        'Đơn vị thi công đã thông cống và nạo vét đoạn cống trước nhà. Đề nghị công dân phản ánh lại nếu còn tái diễn.',
      date: '2023-10-16T08:00:00',
      fileName: 'bien-ban-xu-ly-cong-thoat-nuoc.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
];

export const appointmentServices = [
  'Đăng ký khai sinh',
  'Đăng ký tạm trú',
  'Chứng thực bản sao từ bản chính',
  'Đăng ký hộ kinh doanh',
  'Xác nhận tình trạng hôn nhân',
];

export const mockAppointments = [
  { id: '1', service: 'Đăng ký khai sinh', citizenName: 'Đoàn Tấn Khang', phone: '0912345678', date: '2023-10-13', time: '08:00:24', content: 'Đăng ký khai sinh cho con mới sinh.', status: 'confirmed', assignedStaff: 'Trần Thị B' },
  { id: '2', service: 'Đăng ký tạm trú', citizenName: 'Nguyễn Thị Hoa', phone: '0912345678', date: '2023-10-13', time: '09:30:07', content: 'Đăng ký tạm trú cho người thuê nhà.', status: 'pending', assignedStaff: '' },
  { id: '3', service: 'Chứng thực bản sao từ bản chính', citizenName: 'Trần Văn Khánh', phone: '0923456789', date: '2023-10-14', time: '10:00:52', content: 'Chứng thực 3 bản sao bằng đại học.', status: 'completed', assignedStaff: 'Trần Thị B' },
  { id: '4', service: 'Đăng ký hộ kinh doanh', citizenName: 'Phạm Thị Lan', phone: '0934567890', date: '2023-10-15', time: '14:00:18', content: 'Đăng ký hộ kinh doanh tạp hóa nhỏ.', status: 'pending', assignedStaff: '' },
  { id: '5', service: 'Xác nhận tình trạng hôn nhân', citizenName: 'Đỗ Văn Minh', phone: '0945678901', date: '2023-10-16', time: '15:30:41', content: 'Xác nhận tình trạng hôn nhân để làm hồ sơ.', status: 'confirmed', assignedStaff: 'Trần Thị B' },
  { id: '6', service: 'Đăng ký khai sinh', citizenName: 'Vũ Thị Nga', phone: '0956789012', date: '2023-10-17', time: '08:30:33', content: 'Bổ sung hồ sơ khai sinh.', status: 'cancelled', assignedStaff: '' },
  { id: '7', service: 'Đăng ký tạm trú', citizenName: 'Bùi Văn Sơn', phone: '0967890123', date: '2023-10-18', time: '10:30:59', content: 'Đăng ký tạm trú cho cả gia đình.', status: 'completed', assignedStaff: 'Trần Thị B' },
  { id: '8', service: 'Chứng thực bản sao từ bản chính', citizenName: 'Ngô Thị Tuyết', phone: '0978901234', date: '2023-10-19', time: '16:00:05', content: 'Chứng thực hộ khẩu.', status: 'pending', assignedStaff: '' },
];

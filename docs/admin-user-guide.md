# Hướng dẫn sử dụng Admin Portal

## 1. Thông tin chung

**Tên hệ thống:** Admin Portal  
**Mục đích:** Cung cấp giao diện quản trị phục vụ cán bộ, công chức và bộ phận vận hành trong việc quản lý nội dung, nhân sự, phòng ban, điều phối, phản ánh, hồ sơ công dân và các số liệu tổng quan của hệ thống.

### 1.1. Phạm vi tài liệu

Tài liệu này mô tả các phân hệ hiện đang có trong ứng dụng:
- Dashboard tổng quan
- Quản lý cán bộ
- Quản lý phòng ban
- Quản lý lĩnh vực chuyên trách
- Quản lý danh mục
- Quản lý điều phối chuyên trách
- Quản lý tin tức và thông báo
- Quản lý phản ánh kiến nghị
- Quản lý hồ sơ công dân
- Quản lý lượt bốc số
- Cấu hình thông tin chung

### 1.2. Nguyên tắc biên soạn

Nội dung tài liệu được biên soạn theo nguyên tắc:
- Bám sát đúng chức năng hiện có trong mã nguồn.
- Trình bày theo phong cách hành chính, phù hợp sử dụng trong môi trường cơ quan nhà nước.
- Mô tả theo hướng thao tác nghiệp vụ, tránh diễn đạt cảm tính hoặc quảng bá.
- Phân biệt rõ các tính năng chính thức và các màn hình mô phỏng.

### 1.3. Lưu ý triển khai

- Một số màn hình đang sử dụng dữ liệu mô phỏng hoặc luồng minh họa, ví dụ: đăng nhập và bốc số.
- Một số phân hệ chỉ cho phép xem và chỉnh sửa, không hỗ trợ tạo mới, ví dụ hồ sơ công dân.
- Trong môi trường triển khai thực tế, cần kết nối với dịch vụ xác thực, phân quyền và API nghiệp vụ tương ứng.

---

## 2. Tổng quan kiến trúc sử dụng

### 2.1. Luồng truy cập

Sau khi truy cập ứng dụng:
- Đường dẫn gốc `/` tự động chuyển tới `/dashboard`.
- Trang đăng nhập tại `/login`.
- Các phân hệ được truy cập thông qua menu điều hướng của bố cục hệ thống.

### 2.2. Danh sách đường dẫn chính

| Đường dẫn | Chức năng |
|---|---|
| `/dashboard` | Trang tổng quan |
| `/staff` | Quản lý cán bộ |
| `/departments` | Quản lý phòng ban |
| `/divisions` | Quản lý lĩnh vực chuyên trách |
| `/news` | Quản lý tin tức và thông báo |
| `/categories` | Quản lý danh mục |
| `/routing` | Quản lý điều phối chuyên trách |
| `/feedback` | Quản lý phản ánh kiến nghị |
| `/citizens` | Danh bạ công dân |
| `/appointments` | Quản lý lượt bốc số |
| `/settings/general` | Cấu hình thông tin chung |

### 2.3. Quy ước giao diện dùng chung

Hệ thống sử dụng các thành phần giao diện nhất quán:
- Ô tìm kiếm để tra cứu theo từ khóa.
- Bộ lọc dạng `Select` hoặc `Tabs`.
- Phân trang để duyệt dữ liệu theo trang.
- Hộp thoại xác nhận cho các thao tác có tính chất cập nhật hoặc xóa.
- Trạng thái tải dữ liệu hiển thị bằng chỉ báo chờ.

---

## 3. Trang tổng quan

**Đường dẫn:** `/dashboard`

### 3.1. Mục đích

Trang tổng quan phục vụ theo dõi nhanh:
- Số liệu tổng hợp của hệ thống.
- Tin tức mới nhất.
- Tin nổi bật.
- Phản ánh mới gần đây.

### 3.2. Nội dung hiển thị

Trang tổng quan hiện gồm các khối chính:
- Thông tin số liệu tổng quan.
- Danh sách tin tức gần đây.
- Danh sách tin nổi bật.
- Danh sách phản ánh mới nhất.

### 3.3. Cách sử dụng

1. Truy cập `/dashboard`.
2. Theo dõi các chỉ số tổng quan.
3. Kiểm tra các khối nội dung phía dưới để nắm tình hình hoạt động.

---

## 4. Quản lý cán bộ

**Đường dẫn:** `/staff`

### 4.1. Mục đích

Phân hệ này phục vụ quản lý:
- Thông tin cán bộ, công chức.
- Trạng thái hoạt động tài khoản.
- Thông tin phân công theo phòng ban, lĩnh vực và chức vụ.

### 4.2. Chức năng trên danh sách

Bảng danh sách cán bộ bao gồm các cột:
- Họ tên
- Email
- Điện thoại
- Phòng ban
- Chức vụ
- Trạng thái
- Thao tác

Người sử dụng có thể:
- Tìm kiếm theo tên.
- Lọc theo phòng ban.
- Chuyển trang danh sách.
- Xem chi tiết.
- Chỉnh sửa.
- Khóa hoặc mở khóa tài khoản.

### 4.3. Tìm kiếm và lọc

#### Tìm kiếm theo tên

1. Nhập từ khóa vào ô tìm kiếm.
2. Hệ thống tự cập nhật danh sách tương ứng.

#### Lọc theo phòng ban

1. Chọn phòng ban từ danh sách thả xuống.
2. Bảng dữ liệu chỉ hiển thị cán bộ thuộc phòng ban đã chọn.
3. Chọn `Tất cả phòng ban` để bỏ điều kiện lọc.

### 4.4. Xem chi tiết cán bộ

Tại từng dòng dữ liệu, bấm nút xem chi tiết để mở màn hình thông tin cán bộ. Nội dung hiển thị gồm:
- Ảnh đại diện
- Họ và tên
- Tên đăng nhập hiển thị
- Email
- Số điện thoại
- Phòng ban
- Lĩnh vực
- Chức vụ
- Trạng thái
- Danh sách điều phối phụ trách

### 4.5. Khóa hoặc mở khóa tài khoản

1. Chọn biểu tượng khóa hoặc mở khóa tại dòng dữ liệu.
2. Hệ thống hiển thị hộp thoại xác nhận.
3. Người sử dụng xác nhận để thực hiện cập nhật trạng thái.

### 4.6. Thêm cán bộ mới

**Đường dẫn:** `/staff/new`

Các thông tin cần khai báo:
- Họ và tên
- Email
- Số điện thoại
- Phòng ban
- Lĩnh vực
- Chức vụ
- Trạng thái
- Ảnh đại diện
- Mật khẩu

#### Quy tắc nhập liệu

- Họ và tên: bắt buộc.
- Email: không bắt buộc, nhưng nếu nhập phải đúng định dạng.
- Số điện thoại: bắt buộc, phải là số hợp lệ theo quy ước Việt Nam.
- Phòng ban: bắt buộc chọn.
- Lĩnh vực: có thể để trống.
- Chức vụ: bắt buộc.
- Trạng thái: lựa chọn giữa `Hoạt động` và `Tạm khóa`.
- Ảnh đại diện: có thể nhập bằng URL hoặc tải tệp lên.
- Mật khẩu: bắt buộc khi tạo mới.

#### Trình tự thực hiện

1. Truy cập `/staff/new`.
2. Nhập đầy đủ thông tin cần thiết.
3. Kiểm tra ảnh đại diện và các trường bắt buộc.
4. Chọn `Lưu` để hoàn tất.

### 4.7. Chỉnh sửa cán bộ

**Đường dẫn:** `/staff/:id/edit`

Khi truy cập màn hình chỉnh sửa:
- Dữ liệu hiện tại được tải sẵn vào biểu mẫu.
- Có thể cập nhật thông tin cá nhân, phòng ban, lĩnh vực, chức vụ, trạng thái và ảnh đại diện.
- Trường mật khẩu không bắt buộc trong chế độ chỉnh sửa.

---

## 5. Quản lý phòng ban

**Đường dẫn:** `/departments`

### 5.1. Mục đích

Phân hệ này phục vụ:
- Quản lý cấu trúc phòng ban theo dạng cây.
- Theo dõi quan hệ cha - con giữa các phòng ban.
- Xem danh sách cán bộ theo từng phòng ban.

### 5.2. Bố cục màn hình

Màn hình được chia thành 2 khu vực:
- Cột bên trái: cây phòng ban.
- Cột bên phải: thông tin phòng ban và danh sách nhân sự.

### 5.3. Tìm kiếm cây phòng ban

Người sử dụng có thể tìm theo:
- Tên phòng ban
- Mã phòng ban
- Trưởng bộ phận

Khi có kết quả phù hợp:
- Hệ thống vẫn giữ lại nhánh cha để bảo đảm khả năng quan sát cấu trúc tổ chức.

### 5.4. Thông tin phòng ban

Khi chọn một phòng ban, hệ thống hiển thị:
- Tên phòng ban
- Mã phòng ban
- Phòng ban cha
- Trưởng bộ phận
- Trạng thái
- Số nhân sự
- Số phòng ban con
- Mô tả

Các thao tác hỗ trợ:
- Thêm phòng ban con
- Chỉnh sửa
- Xóa

### 5.5. Thêm hoặc chỉnh sửa phòng ban

Biểu mẫu phòng ban bao gồm:
- Mã phòng ban
- Tên phòng ban
- Phòng ban cha
- Trưởng bộ phận
- Mô tả

#### Quy tắc nghiệp vụ

- Có thể để trống phòng ban cha nếu đây là phòng ban cấp cao nhất.
- Khi chỉnh sửa, hệ thống không cho phép chọn chính phòng ban hiện tại làm phòng ban cha.

### 5.6. Xóa phòng ban

1. Chọn phòng ban cần xóa.
2. Bấm `Xóa`.
3. Xác nhận thao tác.
4. Nếu phòng ban có phòng ban con, toàn bộ nhánh liên quan sẽ bị loại khỏi cây hiển thị tương ứng.

### 5.7. Danh sách nhân sự của phòng ban

Bảng nhân sự hiển thị:
- Họ tên
- Chức vụ
- Điện thoại
- Trạng thái
- Thao tác xem chi tiết

---

## 6. Quản lý lĩnh vực chuyên trách

**Đường dẫn:** `/divisions`

### 6.1. Mục đích

Phân hệ này dùng để quản lý danh sách lĩnh vực chuyên trách phục vụ việc phân công cán bộ xử lý nghiệp vụ.

### 6.2. Chức năng

Người sử dụng có thể:
- Tìm kiếm theo tên.
- Thêm mới.
- Chỉnh sửa.
- Xóa.

### 6.3. Thông tin của lĩnh vực

Mỗi lĩnh vực gồm:
- Tên lĩnh vực
- Ghi chú

### 6.4. Trình tự thao tác

#### Thêm mới
1. Chọn `Thêm lĩnh vực`.
2. Nhập tên và ghi chú.
3. Chọn `Lưu`.

#### Chỉnh sửa
1. Chọn biểu tượng chỉnh sửa.
2. Cập nhật nội dung cần thay đổi.
3. Chọn `Lưu`.

#### Xóa
1. Chọn biểu tượng xóa.
2. Xác nhận thao tác.
3. Lĩnh vực bị loại khỏi danh sách.

---

## 7. Quản lý danh mục

**Đường dẫn:** `/categories`

### 7.1. Mục đích

Phân hệ danh mục phục vụ đồng thời cho:
- Tin tức
- Phản ánh kiến nghị

### 7.2. Phân loại danh mục

Màn hình sử dụng tab để chuyển giữa hai nhóm:
- `Phản ánh`
- `Tin tức`

Khi chuyển tab:
- Danh sách, phân trang và thao tác sẽ tương ứng với nhóm danh mục đang chọn.

### 7.3. Danh mục tin tức

Các trường hiển thị:
- Tên danh mục
- Đường dẫn
- Thao tác

Cho phép:
- Chỉnh sửa
- Xóa

### 7.4. Danh mục phản ánh

Các trường hiển thị tương tự:
- Tên danh mục
- Đường dẫn
- Thao tác

Lưu ý:
- Giao diện hiện tại chưa có lựa chọn danh mục cha trong biểu mẫu tạo mới.
- Danh mục phản ánh mới được tạo ở cấp cao nhất.

### 7.5. Biểu mẫu danh mục

Thông tin cần khai báo:
- Tên danh mục
- Đường dẫn
- Thứ tự hiển thị

### 7.6. Trình tự thao tác

#### Thêm danh mục
1. Chọn `Thêm danh mục`.
2. Khai báo thông tin bắt buộc.
3. Chọn `Lưu danh mục`.

#### Chỉnh sửa danh mục
1. Chọn biểu tượng chỉnh sửa.
2. Cập nhật thông tin.
3. Chọn `Lưu danh mục`.

#### Xóa danh mục
1. Chọn biểu tượng xóa.
2. Xác nhận thao tác.
3. Danh mục bị xóa khỏi hệ thống.

---

## 8. Quản lý điều phối chuyên trách

**Đường dẫn:** `/routing`

### 8.1. Mục đích

Phân hệ này phục vụ:
- Gán cán bộ cho từng điều phối.
- Phân biệt quyền xem và quyền phản hồi.
- Theo dõi cán bộ phụ trách theo từng nhóm phản ánh.

### 8.2. Khái niệm nghiệp vụ

- `Điều phối` là nhóm danh mục phản ánh được gán cho cán bộ phụ trách.
- Mỗi điều phối có thể có nhiều cán bộ.
- Mỗi cán bộ trong điều phối có thể thuộc một trong hai nhóm quyền:
  - Quyền xem
  - Quyền phản hồi

### 8.3. Danh sách điều phối

Khu vực bên phải hiển thị:
- Danh sách điều phối chuyên trách
- Ô tìm kiếm điều phối
- Số lượng cán bộ đã gán

### 8.4. Xem chi tiết điều phối

Khi chọn một điều phối, hệ thống hiển thị:
- Tên điều phối
- Mô tả
- Số lượng cán bộ phụ trách
- Danh sách cán bộ được gán theo từng nhóm quyền

### 8.5. Phân nhóm cán bộ trong điều phối

Danh sách cán bộ được chia thành 2 nhóm:
- Được quyền phê duyệt
- Quyền xem

Mỗi dòng dữ liệu thể hiện:
- Họ tên cán bộ
- Số điện thoại
- Chức vụ
- Trạng thái quyền

### 8.6. Thêm cán bộ vào điều phối

1. Chọn một điều phối.
2. Chọn `Thêm cán bộ`.
3. Chọn cán bộ cần phân công.
4. Chọn trạng thái quyền:
   - Bật nếu cho phép phê duyệt.
   - Tắt nếu chỉ cho phép xem.
5. Chọn `Thêm cán bộ`.

### 8.7. Chỉnh sửa hoặc xóa cán bộ khỏi điều phối

Người sử dụng có thể:
- Chỉnh sửa cán bộ đang được gán.
- Xóa cán bộ khỏi điều phối.

Khi xóa:
- Hệ thống yêu cầu xác nhận trước khi thực hiện.

### 8.8. Tạo hoặc chỉnh sửa điều phối

Trong khu vực quản lý điều phối:
- Có thể thêm điều phối mới.
- Có thể chỉnh sửa hoặc xóa điều phối hiện có.

---

## 9. Quản lý tin tức và thông báo

**Đường dẫn:** `/news`

### 9.1. Mục đích

Phân hệ này phục vụ quản lý:
- Bài viết
- Thông báo
- Nội dung hiển thị trên cổng thông tin điện tử

### 9.2. Danh sách bài viết

Bảng dữ liệu bao gồm:
- Ảnh
- Tiêu đề
- Danh mục
- Nguồn tin
- Ngày đăng
- Trạng thái
- Thao tác

### 9.3. Tìm kiếm và lọc

Trên thanh công cụ có:
- Ô tìm kiếm theo tiêu đề bài viết
- Bộ lọc theo danh mục

Khi thay đổi điều kiện lọc:
- Danh sách được tải lại.
- Trang hiện tại được đưa về trang 1.

### 9.4. Trạng thái bài viết

Hệ thống sử dụng hai trạng thái chính:
- `draft`
- `published`

Quy ước:
- `draft`: bài viết đang lưu nháp hoặc chưa xuất bản.
- `published`: bài viết đã được hiển thị.

### 9.5. Tạo bài viết mới

**Đường dẫn:** `/news/new`

Biểu mẫu gồm:
- Ảnh bìa
- Tiêu đề
- Danh mục
- Mô tả ngắn
- URL liên kết
- Nội dung HTML

#### Quy tắc đối với ảnh bìa

Người sử dụng có thể:
- Nhập trực tiếp đường dẫn ảnh.
- Tải ảnh lên bằng chức năng tải tệp.

Ảnh bìa là trường bắt buộc.

#### Quy tắc đối với nội dung

- Nội dung bài viết được soạn bằng trình soạn thảo tích hợp.
- Dữ liệu được lưu theo định dạng HTML.

### 9.6. Chỉnh sửa bài viết

**Đường dẫn:** `/news/:id/edit`

Khi mở màn hình chỉnh sửa:
- Dữ liệu hiện có được nạp sẵn.
- Có thể điều chỉnh:
  - Ảnh bìa
  - Tiêu đề
  - Danh mục
  - Mô tả ngắn
  - URL liên kết
  - Nội dung

### 9.7. Xem chi tiết bài viết

Tại danh sách, chọn biểu tượng xem chi tiết để mở hộp thoại thông tin. Nội dung hiển thị gồm:
- Ảnh bìa kích thước lớn
- Danh mục
- Trạng thái
- Tiêu đề
- Nguồn tin
- Ngày đăng
- Đối tượng hiển thị
- Mô tả ngắn
- Nội dung HTML
- Liên kết đính kèm
- Tệp media đi kèm

### 9.8. Kích hoạt hoặc vô hiệu hóa bài viết

Tại danh sách hoặc trong hộp thoại chi tiết:
- Nếu bài viết đang ở trạng thái hiển thị, có thể chọn vô hiệu hóa.
- Nếu bài viết đang ở trạng thái chưa hiển thị, có thể chọn kích hoạt.

Thao tác luôn có bước xác nhận trước khi cập nhật.

---

## 10. Quản lý phản ánh kiến nghị

**Đường dẫn:** `/feedback`

### 10.1. Mục đích

Phân hệ này phục vụ:
- Xem phản ánh theo đúng điều phối.
- Đọc chi tiết phản ánh.
- Gửi phản hồi cho công dân.
- Duyệt phản ánh theo thẩm quyền.

### 10.2. Bố cục màn hình

Màn hình được chia thành 2 phần:
- Khung bên trái: danh sách phản ánh.
- Khung bên phải: danh sách điều phối theo quyền của cán bộ.

### 10.3. Chế độ điều phối

Khung điều phối hỗ trợ hai tab:
- `Quyền xem`
- `Quyền phản hồi`

Khi chuyển tab:
- Danh sách điều phối thay đổi tương ứng.
- Danh sách phản ánh bên trái được lọc theo điều phối đang chọn.

### 10.4. Danh sách phản ánh

Bảng hiển thị:
- Tiêu đề
- Người gửi
- Danh mục
- Ngày gửi
- Trạng thái
- Thao tác

### 10.5. Trạng thái phản ánh

Hệ thống thể hiện các trạng thái nghiệp vụ:
- `Chưa duyệt`
- `Đã duyệt`

Đối với người gửi:
- Nếu công dân gửi ẩn danh thì hiển thị `Ẩn danh`.
- Nếu không ẩn danh thì hiển thị họ tên người gửi.

### 10.6. Xem chi tiết phản ánh

1. Chọn một dòng dữ liệu hoặc biểu tượng xem chi tiết.
2. Hộp thoại chi tiết mở ra.
3. Thông tin hiển thị gồm:
   - Tiêu đề
   - Danh mục
   - Trạng thái ẩn danh hoặc công khai
   - Trạng thái phản ánh
   - Thời gian gửi
   - Người gửi
   - Số điện thoại
   - Địa chỉ
   - Nội dung phản ánh
   - Tệp đính kèm
   - Thông tin phản hồi của cán bộ

### 10.7. Gửi hoặc cập nhật phản hồi

Nếu cán bộ có quyền phản hồi:

1. Mở chi tiết phản ánh.
2. Nhập nội dung phản hồi.
3. Đính kèm tệp PDF nếu cần.
4. Chọn lưu phản hồi.

#### Quy định về tệp đính kèm

- Chỉ hỗ trợ tệp PDF trong luồng phản hồi.
- Tệp được tải lên trước khi gửi nội dung.
- Nếu tải tệp không thành công, hệ thống sẽ thông báo để người sử dụng thực hiện lại.

### 10.8. Duyệt phản ánh

1. Mở chi tiết phản ánh.
2. Chọn `Duyệt phản ánh`.
3. Xác nhận thao tác.
4. Trạng thái phản ánh được cập nhật theo kết quả xử lý.

---

## 11. Danh bạ công dân

**Đường dẫn:** `/citizens`

### 11.1. Mục đích

Phân hệ này phục vụ:
- Tra cứu hồ sơ công dân đã đồng bộ.
- Xem chi tiết thông tin công dân.
- Chỉnh sửa các trường hồ sơ cho phép cập nhật.

### 11.2. Danh sách công dân

Bảng dữ liệu gồm:
- Họ và tên
- Căn cước
- Điện thoại
- Thôn/Ấp
- Trạng thái
- Thao tác

### 11.3. Tìm kiếm

Người sử dụng có thể tìm công dân theo:
- Họ tên
- Số điện thoại

### 11.4. Trạng thái công dân

Hệ thống sử dụng hai trạng thái:
- `Đang hoạt động`
- `Tạm ẩn`

### 11.5. Xem chi tiết công dân

Màn hình chi tiết công dân hiển thị:
- Ảnh đại diện
- Họ tên
- Số điện thoại
- Email
- Căn cước
- Địa chỉ
- Thôn/xóm
- Phường/xã
- Tỉnh/thành
- Tình trạng theo dõi Zalo OA
- Ngày tạo
- Danh sách phản ánh liên quan

### 11.6. Chỉnh sửa hồ sơ công dân

**Đường dẫn:** `/citizens/:id/edit`

Các trường có thể cập nhật:
- Ảnh đại diện
- Họ và tên
- Số CCCD/CMND
- Giới tính
- Trình độ học vấn
- Nghề nghiệp
- Dân tộc
- Tôn giáo
- Ghi chú
- Email
- Địa chỉ
- Thôn/xóm

#### Lưu ý nghiệp vụ

- Số điện thoại không cho phép chỉnh sửa trong màn hình này.
- Chức năng tạo mới hồ sơ công dân hiện không triển khai trong hệ thống quản trị.

---

## 12. Quản lý lượt bốc số

**Đường dẫn:** `/appointments`

### 12.1. Mục đích

Phân hệ này phục vụ quản lý lượt bốc số làm việc do công dân đăng ký thông qua ứng dụng.

### 12.2. Phạm vi hiện tại

Phân hệ này hiện đang là màn hình mô phỏng nghiệp vụ, phục vụ trình diễn giao diện và luồng thao tác cơ bản.

### 12.3. Chức năng chính

Người sử dụng có thể:
- Tìm kiếm theo tên hoặc số điện thoại.
- Lọc theo lĩnh vực.
- Lọc theo trạng thái.
- Xem chi tiết.
- Cập nhật trạng thái.
- Gán cán bộ tiếp nhận.
- Xóa lịch hẹn.

### 12.4. Trạng thái lượt bốc số

Hệ thống sử dụng các trạng thái:
- `Chờ xác nhận`
- `Đã xác nhận`
- `Hoàn thành`
- `Đã hủy`

### 12.5. Xem và chỉnh sửa chi tiết

Trong hộp thoại chi tiết, người sử dụng có thể cập nhật:
- Trạng thái
- Cán bộ tiếp nhận

Sau đó chọn `Lưu thay đổi` để ghi nhận cập nhật.

### 12.6. Xóa lịch hẹn

1. Chọn biểu tượng xóa.
2. Xác nhận thao tác.
3. Lịch hẹn bị loại khỏi danh sách mô phỏng.

---

## 13. Cấu hình thông tin chung

**Đường dẫn:** `/settings/general`

### 13.1. Mục đích

Phân hệ này phục vụ cập nhật các chỉ số tổng quan hiển thị trên trang dashboard.

### 13.2. Các trường dữ liệu

Biểu mẫu gồm 4 trường:
- Tổng diện tích
- Chỉ số hài lòng
- Dịch vụ công
- Tổng công dân

### 13.3. Quy tắc nhập liệu

- Tất cả trường đều là dữ liệu số.
- Không chấp nhận giá trị âm.
- Nếu nhập sai kiểu dữ liệu, hệ thống sẽ hiển thị lỗi kiểm tra dữ liệu.

### 13.4. Trình tự cập nhật

1. Truy cập `/settings/general`.
2. Chờ dữ liệu hiện tại được tải.
3. Cập nhật các chỉ số cần thay đổi.
4. Chọn `Lưu thông tin`.

---

## 14. Trạng thái nghiệp vụ dùng chung

### 14.1. Cán bộ

- Hoạt động
- Tạm khóa

### 14.2. Công dân

- Đang hoạt động
- Tạm ẩn

### 14.3. Tin tức

- Draft
- Published

### 14.4. Phản ánh

- Chưa duyệt
- Đã duyệt

### 14.5. Bốc số

- Chờ xác nhận
- Đã xác nhận
- Hoàn thành
- Đã hủy

---

## 15. Quy trình vận hành khuyến nghị

### 15.1. Khi cần phân công xử lý phản ánh

1. Kiểm tra danh mục phản ánh tại `/categories`.
2. Gán cán bộ vào điều phối tại `/routing`.
3. Tiếp nhận và xử lý phản ánh tại `/feedback`.
4. Gửi phản hồi và duyệt phản ánh khi đã hoàn thành nghiệp vụ.

### 15.2. Khi cần đăng tải tin tức

1. Truy cập `/news`.
2. Chọn tạo mới.
3. Nhập đầy đủ ảnh bìa, danh mục, tiêu đề, mô tả và nội dung.
4. Lưu nháp hoặc xuất bản theo yêu cầu nghiệp vụ.

### 15.3. Khi cần cập nhật cán bộ

1. Truy cập `/staff`.
2. Tra cứu cán bộ cần cập nhật.
3. Chỉnh sửa thông tin nhân sự, trạng thái hoặc phân công.
4. Kiểm tra lại ở màn hình chi tiết nếu cần đối soát.

### 15.4. Khi cần điều chỉnh cơ cấu phòng ban

1. Truy cập `/departments`.
2. Kiểm tra cấu trúc cây phòng ban.
3. Thêm mới, sửa hoặc xóa theo phê duyệt nghiệp vụ.
4. Đối chiếu số lượng nhân sự và nhánh con sau khi cập nhật.

---

## 16. Giới hạn hiện tại

- Một số phân hệ đang sử dụng dữ liệu mô phỏng, do đó kết quả thao tác chỉ phản ánh trong phạm vi giao diện hiện tại.
- Chưa phải toàn bộ nghiệp vụ được triển khai đầy đủ như hệ thống vận hành chính thức.
- Tài liệu này phản ánh đúng tình trạng của mã nguồn tại thời điểm biên soạn.


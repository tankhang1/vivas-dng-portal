# Tài liệu hướng dẫn sử dụng Admin Portal

## 1. Thông tin tài liệu

| Nội dung | Chi tiết |
|---|---|
| Tên hệ thống | Admin Portal |
| Loại tài liệu | Hướng dẫn sử dụng hệ thống |
| Phạm vi áp dụng | Các chức năng quản trị hiện có trong ứng dụng |
| Đối tượng sử dụng | Cán bộ quản trị, cán bộ vận hành, cán bộ xử lý nghiệp vụ |

### 1.1. Mục đích

Tài liệu này được biên soạn nhằm hướng dẫn người sử dụng khai thác các phân hệ chức năng của Admin Portal một cách thống nhất, bảo đảm thuận tiện trong quá trình vận hành, quản lý và xử lý nghiệp vụ.

### 1.2. Phạm vi

Tài liệu mô tả các chức năng đang được triển khai trong hệ thống, bao gồm:
- Dashboard tổng quan.
- Quản lý cán bộ.
- Quản lý phòng ban.
- Quản lý lĩnh vực chuyên trách.
- Quản lý danh mục.
- Quản lý điều phối chuyên trách.
- Quản lý tin tức và thông báo.
- Quản lý phản ánh kiến nghị.
- Quản lý hồ sơ công dân.
- Quản lý lượt bốc số.
- Cấu hình thông tin chung.

### 1.3. Nguyên tắc biên soạn

- Nội dung được trình bày theo ngôn ngữ hành chính, rõ ràng, chính xác và phù hợp môi trường cơ quan nhà nước.
- Mô tả bám sát chức năng thực tế đang tồn tại trong hệ thống.
- Các thao tác được diễn giải theo trình tự nghiệp vụ, bảo đảm người sử dụng có thể thực hiện trực tiếp trên giao diện.
- Những màn hình đang ở trạng thái mô phỏng hoặc minh họa được ghi chú riêng để tránh nhầm lẫn với nghiệp vụ chính thức.

### 1.4. Lưu ý

- Một số phân hệ đang sử dụng dữ liệu mô phỏng hoặc dữ liệu mẫu.
- Một số chức năng chỉ cho phép xem và chỉnh sửa, chưa hỗ trợ tạo mới hoặc xóa dữ liệu.
- Khi triển khai thực tế, hệ thống cần kết nối với API nghiệp vụ, dịch vụ xác thực và cơ chế phân quyền tương ứng.

---

## 2. Tổng quan hệ thống

Admin Portal là giao diện quản trị phục vụ quản lý các hoạt động điều hành, bao gồm nội dung công khai, nhân sự, cơ cấu tổ chức, điều phối xử lý phản ánh, hồ sơ công dân, lượt bốc số và các chỉ số tổng quan của đơn vị.

### 2.1. Cấu trúc điều hướng

Sau khi truy cập hệ thống:
- Trang gốc `/` tự động chuyển tới `/dashboard`.
- Trang đăng nhập tại `/login`.
- Các phân hệ được truy cập thông qua menu điều hướng của bố cục hệ thống.

### 2.2. Các đường dẫn chính

| Đường dẫn | Chức năng |
|---|---|
| `/dashboard` | Trang tổng quan |
| `/staff` | Quản lý cán bộ |
| `/departments` | Quản lý phòng ban |
| `/divisions` | Quản lý lĩnh vực chuyên trách |
| `/categories` | Quản lý danh mục |
| `/routing` | Quản lý điều phối chuyên trách |
| `/news` | Quản lý tin tức và thông báo |
| `/feedback` | Quản lý phản ánh kiến nghị |
| `/citizens` | Danh bạ công dân |
| `/appointments` | Quản lý lượt bốc số |
| `/settings/general` | Cấu hình thông tin chung |

### 2.3. Quy ước giao diện chung

Trong toàn bộ hệ thống, các thành phần giao diện được sử dụng nhất quán:
- Ô tìm kiếm dùng để tra cứu dữ liệu theo từ khóa.
- Bộ lọc dạng `Select` hoặc `Tabs` dùng để phân loại dữ liệu.
- Phân trang dùng để xem dữ liệu theo từng trang.
- Hộp thoại xác nhận dùng cho các thao tác có tính chất thay đổi trạng thái hoặc xóa dữ liệu.
- Trạng thái tải dữ liệu được thể hiện bằng chỉ báo chờ.

---

## 3. Dashboard tổng quan

**Đường dẫn:** `/dashboard`

### 3.1. Mục đích

Trang dashboard cung cấp thông tin tổng hợp phục vụ theo dõi nhanh tình hình hoạt động của hệ thống.

### 3.2. Nội dung hiển thị

Trang tổng quan hiện bao gồm:
- Các chỉ số thống kê tổng hợp.
- Danh sách tin tức gần đây.
- Danh sách tin nổi bật.
- Danh sách phản ánh mới nhất.

### 3.3. Cách sử dụng

1. Truy cập trang `/dashboard`.
2. Quan sát các chỉ số tổng quan.
3. Theo dõi các khối thông tin phía dưới để nắm tình hình hoạt động, nội dung truyền thông và phản ánh mới.

### 3.4. Giá trị sử dụng

Trang dashboard hỗ trợ lãnh đạo và cán bộ vận hành:
- Nắm bắt nhanh số liệu tổng quan.
- Kiểm tra nội dung mới phát sinh.
- Theo dõi tình trạng tiếp nhận phản ánh.

---

## 4. Quản lý cán bộ

**Đường dẫn:** `/staff`

### 4.1. Mục đích

Phân hệ này phục vụ quản lý thông tin và trạng thái tài khoản của cán bộ, công chức trong hệ thống.

### 4.2. Danh sách cán bộ

Bảng danh sách hiển thị các thông tin:
- Họ tên
- Email
- Điện thoại
- Phòng ban
- Chức vụ
- Trạng thái
- Thao tác

Người sử dụng có thể:
- Tìm kiếm theo tên cán bộ.
- Lọc theo phòng ban.
- Xem chi tiết hồ sơ cán bộ.
- Chỉnh sửa thông tin.
- Khóa hoặc mở khóa tài khoản.

### 4.3. Tìm kiếm và lọc

#### Tìm kiếm theo tên

1. Nhập từ khóa vào ô tìm kiếm.
2. Hệ thống tự động truy vấn và cập nhật danh sách tương ứng.

#### Lọc theo phòng ban

1. Chọn phòng ban cần xem từ danh sách thả xuống.
2. Danh sách chỉ hiển thị cán bộ thuộc phòng ban đã chọn.
3. Chọn `Tất cả phòng ban` để bỏ điều kiện lọc.

### 4.4. Xem chi tiết cán bộ

Màn hình chi tiết cán bộ hiển thị:
- Ảnh đại diện.
- Họ tên.
- Tên hiển thị hệ thống.
- Email.
- Số điện thoại.
- Phòng ban.
- Lĩnh vực.
- Chức vụ.
- Trạng thái hoạt động.
- Danh sách điều phối phụ trách.

### 4.5. Khóa hoặc mở khóa tài khoản

1. Chọn biểu tượng khóa hoặc mở khóa tại dòng dữ liệu.
2. Hệ thống hiển thị hộp thoại xác nhận.
3. Xác nhận thao tác để cập nhật trạng thái tài khoản.

### 4.6. Thêm cán bộ mới

**Đường dẫn:** `/staff/new`

Các thông tin cần khai báo gồm:
- Họ và tên.
- Email.
- Số điện thoại.
- Phòng ban.
- Lĩnh vực.
- Chức vụ.
- Trạng thái.
- Ảnh đại diện.
- Mật khẩu.

#### Quy định nhập liệu

- Họ và tên: bắt buộc.
- Email: không bắt buộc, nhưng nếu có thì phải đúng định dạng.
- Số điện thoại: bắt buộc và phải hợp lệ theo định dạng Việt Nam.
- Phòng ban: bắt buộc lựa chọn.
- Lĩnh vực: có thể để trống.
- Chức vụ: bắt buộc.
- Trạng thái: lựa chọn giữa `Hoạt động` và `Tạm khóa`.
- Ảnh đại diện: có thể nhập bằng URL hoặc tải tệp lên.
- Mật khẩu: bắt buộc khi tạo mới.

#### Trình tự thực hiện

1. Truy cập `/staff/new`.
2. Điền đầy đủ thông tin.
3. Kiểm tra các trường bắt buộc và ảnh đại diện.
4. Chọn `Lưu` để hoàn tất.

### 4.7. Chỉnh sửa cán bộ

**Đường dẫn:** `/staff/:id/edit`

Khi truy cập màn hình chỉnh sửa:
- Dữ liệu hiện có được nạp sẵn vào biểu mẫu.
- Có thể cập nhật thông tin nhân sự, phòng ban, lĩnh vực, chức vụ, trạng thái và ảnh đại diện.
- Trường mật khẩu không bắt buộc trong chế độ chỉnh sửa.

---

## 5. Quản lý phòng ban

**Đường dẫn:** `/departments`

### 5.1. Mục đích

Phân hệ này phục vụ quản lý cơ cấu tổ chức theo dạng cây phòng ban, đồng thời hỗ trợ xem danh sách cán bộ theo từng nhánh tổ chức.

### 5.2. Bố cục màn hình

Màn hình được chia thành hai khu vực:
- Khu vực bên trái: cây phòng ban.
- Khu vực bên phải: thông tin phòng ban và danh sách nhân sự.

### 5.3. Tìm kiếm cây phòng ban

Người sử dụng có thể tìm theo:
- Tên phòng ban.
- Mã phòng ban.
- Trưởng bộ phận.

Khi có kết quả phù hợp, hệ thống vẫn giữ cấu trúc nhánh cha để thuận tiện quan sát toàn bộ cây tổ chức.

### 5.4. Thông tin phòng ban

Khi chọn một phòng ban, hệ thống hiển thị:
- Tên phòng ban.
- Mã phòng ban.
- Phòng ban cha.
- Trưởng bộ phận.
- Trạng thái.
- Số nhân sự.
- Số phòng ban con.
- Mô tả.

Các thao tác khả dụng:
- Thêm phòng ban con.
- Chỉnh sửa.
- Xóa.

### 5.5. Thêm hoặc chỉnh sửa phòng ban

Biểu mẫu phòng ban bao gồm:
- Mã phòng ban.
- Tên phòng ban.
- Phòng ban cha.
- Trưởng bộ phận.
- Mô tả.

#### Quy tắc nghiệp vụ

- Phòng ban cha có thể để trống nếu đây là phòng ban cấp cao nhất.
- Khi chỉnh sửa, không được chọn chính phòng ban hiện tại làm phòng ban cha.

### 5.6. Xóa phòng ban

1. Chọn phòng ban cần xóa.
2. Chọn `Xóa`.
3. Xác nhận thao tác.
4. Nếu phòng ban có phòng ban con, hệ thống sẽ loại bỏ toàn bộ nhánh tương ứng khỏi cấu trúc hiển thị.

### 5.7. Danh sách nhân sự theo phòng ban

Bảng nhân sự hiển thị:
- Họ tên.
- Chức vụ.
- Điện thoại.
- Trạng thái.
- Thao tác xem chi tiết.

---

## 6. Quản lý lĩnh vực chuyên trách

**Đường dẫn:** `/divisions`

### 6.1. Mục đích

Phân hệ này dùng để quản lý các lĩnh vực chuyên trách phục vụ phân công cán bộ xử lý theo từng mảng nghiệp vụ.

### 6.2. Chức năng

Người sử dụng có thể:
- Tìm kiếm theo tên.
- Thêm mới.
- Chỉnh sửa.
- Xóa.

### 6.3. Dữ liệu quản lý

Mỗi lĩnh vực chuyên trách gồm:
- Tên lĩnh vực.
- Ghi chú.

### 6.4. Trình tự thao tác

#### Thêm mới
1. Chọn `Thêm lĩnh vực`.
2. Nhập tên và ghi chú.
3. Chọn `Lưu`.

#### Chỉnh sửa
1. Chọn biểu tượng chỉnh sửa.
2. Cập nhật thông tin.
3. Chọn `Lưu`.

#### Xóa
1. Chọn biểu tượng xóa.
2. Xác nhận thao tác.
3. Lĩnh vực được loại khỏi danh sách.

---

## 7. Quản lý danh mục

**Đường dẫn:** `/categories`

### 7.1. Mục đích

Phân hệ danh mục phục vụ quản lý các nhóm nội dung dùng cho:
- Tin tức.
- Phản ánh kiến nghị.

### 7.2. Phân loại danh mục

Hệ thống sử dụng tab để chuyển giữa hai nhóm:
- `Phản ánh`
- `Tin tức`

Khi chuyển tab:
- Danh sách dữ liệu thay đổi tương ứng.
- Phân trang và thao tác áp dụng cho nhóm danh mục đang chọn.

### 7.3. Danh mục tin tức

Các trường thể hiện:
- Tên danh mục.
- Đường dẫn.
- Thao tác.

Các chức năng:
- Chỉnh sửa.
- Xóa.

### 7.4. Danh mục phản ánh

Các trường thể hiện tương tự:
- Tên danh mục.
- Đường dẫn.
- Thao tác.

Lưu ý:
- Giao diện hiện tại chưa hỗ trợ chọn danh mục cha trong biểu mẫu tạo mới.
- Danh mục phản ánh mới được tạo tại cấp cao nhất.

### 7.5. Biểu mẫu danh mục

Các thông tin cần khai báo:
- Tên danh mục.
- Đường dẫn.
- Thứ tự hiển thị.

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

Phân hệ này phục vụ gán cán bộ vào từng điều phối, xác định cán bộ có quyền xử lý hoặc quyền phản hồi, đồng thời hỗ trợ theo dõi tình trạng phân công.

### 8.2. Khái niệm nghiệp vụ

- `Điều phối` là nhóm danh mục phản ánh được gán cho cán bộ phụ trách.
- Mỗi điều phối có thể có nhiều cán bộ.
- Mỗi cán bộ trong điều phối có thể thuộc một trong hai nhóm:
  - Quyền xử lý.
  - Quyền phản hồi.

### 8.3. Danh sách điều phối

Khu vực bên phải hiển thị:
- Danh mục phản ánh kiến nghị.
- Ô tìm kiếm điều phối.
- Số lượng cán bộ đã gán.

### 8.4. Xem chi tiết điều phối

Khi chọn một điều phối, hệ thống hiển thị:
- Tên điều phối.
- Mô tả.
- Số lượng cán bộ phụ trách.
- Danh sách cán bộ theo từng nhóm quyền.

### 8.5. Phân nhóm cán bộ

Danh sách cán bộ được chia thành 2 nhóm:
- Được quyền phê duyệt.
- Quyền xử lý.

Mỗi dòng dữ liệu thể hiện:
- Họ tên cán bộ.
- Số điện thoại.
- Chức vụ.
- Trạng thái quyền.

### 8.6. Thêm cán bộ vào điều phối

1. Chọn một điều phối.
2. Chọn `Thêm cán bộ`.
3. Chọn cán bộ cần phân công.
4. Chọn trạng thái quyền.
5. Chọn `Thêm cán bộ` để hoàn tất.

### 8.7. Chỉnh sửa hoặc xóa cán bộ khỏi điều phối

Người sử dụng có thể:
- Chỉnh sửa cán bộ đang được gán.
- Xóa cán bộ khỏi điều phối.

Khi thực hiện xóa, hệ thống luôn yêu cầu xác nhận trước.

### 8.8. Tạo hoặc chỉnh sửa điều phối

Phân hệ cũng hỗ trợ:
- Thêm điều phối mới.
- Chỉnh sửa điều phối hiện có.
- Xóa điều phối không còn sử dụng.

---

## 9. Quản lý tin tức và thông báo

**Đường dẫn:** `/news`

### 9.1. Mục đích

Phân hệ này phục vụ quản lý bài viết, thông báo và nội dung công khai hiển thị trên cổng thông tin điện tử.

### 9.2. Danh sách bài viết

Bảng dữ liệu hiển thị:
- Ảnh.
- Tiêu đề.
- Danh mục.
- Nguồn tin.
- Ngày đăng.
- Trạng thái.
- Thao tác.

### 9.3. Tìm kiếm và lọc

Người sử dụng có thể:
- Tìm kiếm theo tiêu đề bài viết.
- Lọc theo danh mục.

Khi thay đổi điều kiện lọc:
- Danh sách dữ liệu được cập nhật tương ứng.
- Trang hiện tại được đưa về trang đầu.

### 9.4. Trạng thái bài viết

Hệ thống sử dụng hai trạng thái:
- `draft`
- `published`

Quy ước:
- `draft`: bài viết đang lưu nháp hoặc chưa xuất bản.
- `published`: bài viết đã được hiển thị.

### 9.5. Tạo bài viết mới

**Đường dẫn:** `/news/new`

Biểu mẫu bài viết gồm:
- Ảnh bìa.
- Tiêu đề.
- Danh mục.
- Mô tả ngắn.
- URL liên kết.
- Nội dung HTML.

#### Quy định đối với ảnh bìa

Người sử dụng có thể:
- Nhập trực tiếp URL ảnh.
- Tải ảnh lên bằng chức năng tải tệp.

Ảnh bìa là trường bắt buộc.

#### Quy định đối với nội dung

- Nội dung bài viết được soạn bằng trình soạn thảo tích hợp.
- Dữ liệu được lưu dưới dạng HTML.

### 9.6. Chỉnh sửa bài viết

**Đường dẫn:** `/news/:id/edit`

Khi mở màn hình chỉnh sửa:
- Dữ liệu hiện tại được nạp sẵn.
- Có thể cập nhật ảnh bìa, tiêu đề, danh mục, mô tả ngắn, URL liên kết và nội dung.

### 9.7. Xem chi tiết bài viết

Tại danh sách bài viết, người sử dụng có thể mở hộp thoại chi tiết để xem:
- Ảnh bìa.
- Danh mục.
- Trạng thái.
- Tiêu đề.
- Nguồn tin.
- Ngày đăng.
- Đối tượng hiển thị.
- Mô tả ngắn.
- Nội dung HTML.
- Liên kết đính kèm.
- Tệp media đi kèm.

### 9.8. Kích hoạt hoặc vô hiệu hóa bài viết

Tại danh sách hoặc trong hộp thoại chi tiết:
- Nếu bài viết đang hiển thị, có thể thực hiện vô hiệu hóa.
- Nếu bài viết chưa hiển thị, có thể thực hiện kích hoạt.

Mọi thao tác đều có bước xác nhận trước khi cập nhật.

---

## 10. Quản lý phản ánh kiến nghị

**Đường dẫn:** `/feedback`

### 10.1. Mục đích

Phân hệ này phục vụ theo dõi, xử lý và phản hồi các phản ánh kiến nghị của công dân theo từng điều phối được phân công.

### 10.2. Bố cục màn hình

Màn hình gồm hai khu vực chính:
- Khung bên trái: danh sách phản ánh.
- Khung bên phải: danh sách điều phối theo quyền của cán bộ.

### 10.3. Chế độ điều phối

Khung điều phối hỗ trợ hai tab:
- `Quyền xử lý`
- `Quyền phản hồi`

Khi chuyển tab:
- Danh sách điều phối thay đổi theo quyền.
- Danh sách phản ánh bên trái được lọc theo điều phối đang chọn.

### 10.4. Danh sách phản ánh

Bảng phản ánh hiển thị:
- Tiêu đề.
- Người gửi.
- Danh mục.
- Ngày gửi.
- Trạng thái.
- Thao tác.

### 10.5. Trạng thái phản ánh

Hệ thống sử dụng các trạng thái:
- `Chưa duyệt`
- `Đã duyệt`

Đối với người gửi:
- Nếu gửi ẩn danh, hệ thống hiển thị `Ẩn danh`.
- Nếu không ẩn danh, hệ thống hiển thị họ tên người gửi.

### 10.6. Xem chi tiết phản ánh

1. Chọn một dòng dữ liệu hoặc biểu tượng xem chi tiết.
2. Hộp thoại chi tiết mở ra.
3. Nội dung thể hiện gồm:
   - Tiêu đề.
   - Danh mục.
   - Trạng thái ẩn danh hoặc công khai.
   - Trạng thái phản ánh.
   - Thời gian gửi.
   - Người gửi.
   - Số điện thoại.
   - Địa chỉ.
   - Nội dung phản ánh.
   - Tệp đính kèm.
   - Thông tin phản hồi của cán bộ.

### 10.7. Gửi hoặc cập nhật phản hồi

Nếu cán bộ có quyền phản hồi:

1. Mở chi tiết phản ánh.
2. Nhập nội dung phản hồi.
3. Đính kèm tệp PDF nếu cần.
4. Chọn lưu phản hồi.

#### Quy định về tệp đính kèm

- Chỉ hỗ trợ tệp PDF trong luồng phản hồi.
- Tệp được tải lên trước khi gửi nội dung.
- Nếu tải tệp không thành công, hệ thống hiển thị thông báo để thực hiện lại.

### 10.8. Duyệt phản ánh

1. Mở chi tiết phản ánh.
2. Chọn `Duyệt phản ánh`.
3. Xác nhận thao tác.
4. Trạng thái phản ánh được cập nhật theo kết quả xử lý.

---

## 11. Danh bạ công dân

**Đường dẫn:** `/citizens`

### 11.1. Mục đích

Phân hệ này phục vụ tra cứu và cập nhật hồ sơ công dân đã được đồng bộ vào hệ thống.

### 11.2. Danh sách công dân

Bảng dữ liệu gồm:
- Họ và tên.
- Căn cước.
- Điện thoại.
- Thôn/Ấp.
- Trạng thái.
- Thao tác.

### 11.3. Tìm kiếm

Người sử dụng có thể tìm công dân theo:
- Họ tên.
- Số điện thoại.

### 11.4. Trạng thái công dân

Hệ thống sử dụng hai trạng thái:
- `Đang hoạt động`
- `Tạm ẩn`

### 11.5. Xem chi tiết công dân

Màn hình chi tiết công dân hiển thị:
- Ảnh đại diện.
- Họ tên.
- Số điện thoại.
- Email.
- Căn cước.
- Địa chỉ.
- Thôn/xóm.
- Phường/xã.
- Tỉnh/thành.
- Tình trạng theo dõi Zalo OA.
- Ngày tạo.
- Danh sách phản ánh liên quan.

### 11.6. Chỉnh sửa hồ sơ công dân

**Đường dẫn:** `/citizens/:id/edit`

Các trường có thể cập nhật:
- Ảnh đại diện.
- Họ và tên.
- Số CCCD/CMND.
- Giới tính.
- Trình độ học vấn.
- Nghề nghiệp.
- Dân tộc.
- Tôn giáo.
- Ghi chú.
- Email.
- Địa chỉ.
- Thôn/xóm.

#### Lưu ý nghiệp vụ

- Số điện thoại không được chỉnh sửa trong màn hình này.
- Chức năng tạo mới hồ sơ công dân hiện không triển khai trong hệ thống quản trị.

---

## 12. Quản lý lượt bốc số

**Đường dẫn:** `/appointments`

### 12.1. Mục đích

Phân hệ này phục vụ quản lý lượt bốc số làm việc do công dân đăng ký qua ứng dụng.

### 12.2. Phạm vi hiện tại

Phân hệ này đang ở trạng thái mô phỏng nghiệp vụ, phục vụ trình diễn giao diện và thao tác quản lý cơ bản.

### 12.3. Chức năng

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
- Trạng thái.
- Cán bộ tiếp nhận.

Sau đó chọn `Lưu thay đổi` để ghi nhận cập nhật.

### 12.6. Xóa lịch hẹn

1. Chọn biểu tượng xóa.
2. Xác nhận thao tác.
3. Lịch hẹn bị loại khỏi danh sách mô phỏng.

---

## 13. Cấu hình thông tin chung

**Đường dẫn:** `/settings/general`

### 13.1. Mục đích

Phân hệ này phục vụ cập nhật các chỉ số tổng quan hiển thị trên dashboard.

### 13.2. Các trường dữ liệu

Biểu mẫu gồm bốn trường:
- Tổng diện tích.
- Chỉ số hài lòng.
- Dịch vụ công.
- Tổng công dân.

### 13.3. Quy tắc nhập liệu

- Tất cả các trường là kiểu số.
- Không chấp nhận giá trị âm.
- Nếu nhập sai kiểu dữ liệu, hệ thống sẽ hiển thị thông báo lỗi kiểm tra dữ liệu.

### 13.4. Trình tự cập nhật

1. Truy cập `/settings/general`.
2. Chờ dữ liệu hiện tại được tải.
3. Cập nhật các chỉ số cần điều chỉnh.
4. Chọn `Lưu thông tin`.

---

## 14. Quản lý hotline

**Đường dẫn:** `/settings/hotline`

### 14.1. Mục đích

Phân hệ này phục vụ quản lý danh sách số hotline hiển thị trên mini app, giúp người dân dễ dàng tra cứu đầu mối liên hệ của cơ quan.

### 14.2. Dữ liệu quản lý

Mỗi dòng hotline bao gồm:
- Họ tên.
- Chức vụ.
- Đơn vị.
- Số điện thoại.
- Email.

### 14.3. Quy tắc nhập liệu

- Họ tên là bắt buộc.
- Số điện thoại là bắt buộc.
- Chức vụ là bắt buộc.
- Đơn vị là bắt buộc.
- Email không bắt buộc, nhưng nếu có thì phải đúng định dạng.

### 14.4. Trình tự thực hiện

#### Thêm hotline
1. Truy cập `/settings/hotline`.
2. Chọn `Thêm hotline`.
3. Nhập đầy đủ thông tin cần thiết.
4. Chọn `Lưu hotline` để hoàn tất.

#### Xóa hotline
1. Tại dòng dữ liệu cần xóa, chọn biểu tượng thùng rác.
2. Kiểm tra hộp thoại xác nhận.
3. Chọn `Đồng ý` để xóa số hotline khỏi danh sách.

### 14.5. Lưu ý vận hành

- Danh sách hotline được hiển thị trực tiếp trên mini app sau khi cập nhật thành công.
- Nên bảo đảm mỗi đầu mối liên hệ được khai báo thống nhất về họ tên, chức vụ và đơn vị để người dân dễ tra cứu.

---

## 15. Trạng thái nghiệp vụ dùng chung

### 15.1. Trạng thái cán bộ

- Hoạt động.
- Tạm khóa.

### 15.2. Trạng thái công dân

- Đang hoạt động.
- Tạm ẩn.

### 15.3. Trạng thái tin tức

- Draft.
- Published.

### 15.4. Trạng thái phản ánh

- Chưa duyệt.
- Đã duyệt.

### 15.5. Trạng thái bốc số

- Chờ xác nhận.
- Đã xác nhận.
- Hoàn thành.
- Đã hủy.

---

## 16. Quy trình vận hành khuyến nghị

### 16.1. Khi cần phân công xử lý phản ánh

1. Kiểm tra danh mục phản ánh tại `/categories`.
2. Gán cán bộ vào điều phối tại `/routing`.
3. Tiếp nhận và xử lý phản ánh tại `/feedback`.
4. Gửi phản hồi và duyệt phản ánh khi hoàn tất nghiệp vụ.

### 16.2. Khi cần đăng tải tin tức

1. Truy cập `/news`.
2. Chọn tạo mới.
3. Nhập đầy đủ ảnh bìa, danh mục, tiêu đề, mô tả và nội dung.
4. Lưu nháp hoặc xuất bản theo yêu cầu nghiệp vụ.

### 16.3. Khi cần cập nhật cán bộ

1. Truy cập `/staff`.
2. Tra cứu cán bộ cần cập nhật.
3. Chỉnh sửa thông tin nhân sự, trạng thái hoặc phân công.
4. Kiểm tra lại ở màn hình chi tiết nếu cần đối soát.

### 16.4. Khi cần điều chỉnh cơ cấu phòng ban

1. Truy cập `/departments`.
2. Kiểm tra cấu trúc cây phòng ban.
3. Thêm mới, sửa hoặc xóa theo phê duyệt nghiệp vụ.
4. Đối chiếu số lượng nhân sự và nhánh con sau khi cập nhật.

---

## 16. Kết luận

Admin Portal là hệ thống phục vụ quản trị tập trung các nghiệp vụ cốt lõi của đơn vị. Việc sử dụng đúng quy trình và đúng phân hệ sẽ góp phần nâng cao hiệu quả vận hành, bảo đảm tính thống nhất trong quản lý, điều phối và xử lý thông tin.

Tài liệu này phản ánh các chức năng hiện có trong hệ thống tại thời điểm biên soạn. Khi hệ thống được mở rộng hoặc thay đổi, tài liệu cần được cập nhật tương ứng để bảo đảm tính chính xác và đồng bộ.

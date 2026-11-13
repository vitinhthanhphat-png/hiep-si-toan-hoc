# Nhật ký công việc (Changelog)

## [2026-11-13] - Tái Thiết Kế Giao Diện WP Admin 4 Tab Khoa Học & Tích Hợp GitHub Release Auto-Updater (`includes/class-mk-github-updater.php`)
- **Tái cấu trúc giao diện Trang Quản Trị WordPress (`includes/class-mk-admin.php`, `assets/css/admin-style.css`) thành 4 Tab chuyên biệt chuẩn SaaS / Techshare VN:**
  - Loại bỏ hoàn toàn Hero Banner cồng kềnh gây vỡ bố cục và tách toàn bộ chức năng thành **4 Tab độc lập** (chuyển tab tức thời không tải lại trang, đồng bộ `history.replaceState` với tham số `?tab=settings|leaderboard|updater|author`):
    1. **Tab 1 — `⚙️ Cài Đặt Trò Chơi` (`settings`):** Bố cục 2 cột cân đối (`62% / 38%`) gồm biểu mẫu Cấu hình Luật chơi & SGK Toán 3 Kết nối tri thức (Chế độ bộ sách mặc định `tap1|tap2|all`, số câu/ải, thời gian/câu, số Tim, bật/tắt ảnh SGK, nút toàn màn hình, chọn 4 mạch kiến thức) và cột phải Hướng dẫn Nhúng Nhanh (Shortcode 1-click copy, Gutenberg Block, Custom Element `<math-knight-game>`).
    2. **Tab 2 — `🏆 Bảng Vàng & Thống Kê` (`leaderboard`):** Hiển thị 4 thẻ KPI thống kê tổng quan (`Tổng lượt hoàn thành`, `Điểm kỷ lục`, `Điểm trung bình`, `Tỷ lệ chính xác TB`), thanh công cụ Xuất báo cáo CSV chuẩn UTF-8 BOM / Đặt lại bảng điểm và Bảng xếp hạng Top 50 Hiệp Sĩ gọn gàng.
    3. **Tab 3 — `🔄 Cập Nhật (GitHub)` (`updater`):** Hiển thị trạng thái phiên bản hiện tại so với bản Release mới nhất trên GitHub (`https://github.com/vitinhthanhphat-png/hiep-si-toan-hoc`), nút **`🔍 Kiểm tra bản cập nhật mới ngay`** (xóa cache transient và truy vấn trực tiếp GitHub Releases API), nút cập nhật 1-click hoặc tải gói `hiep-si-toan-hoc-plugin.zip` chính thức kèm ghi chú phát hành (Release Notes).
    4. **Tab 4 — `ℹ️ Thông tin Tác Giả` (`author`):** Card nhận diện thương hiệu **Techshare VN — Trần Vĩ Thành** (`techsharevn.com`, `0949 897 293`, `thanh.web1001@gmail.com`) kèm hộp tra cứu nhanh Shortcode nền tối.
- **Xây dựng bộ Tự động Cập nhật từ GitHub Releases (`includes/class-mk-github-updater.php`):**
  - Kết nối trực tiếp tới kho lưu trữ công khai **`https://github.com/vitinhthanhphat-png/hiep-si-toan-hoc`** qua GitHub REST API (`/repos/vitinhthanhphat-png/hiep-si-toan-hoc/releases/latest`, lưu cache Transient 6 giờ để tối ưu hiệu năng).
  - **Chỉ cập nhật từ gói Release ZIP chính thức (`hiep-si-toan-hoc-plugin.zip`):** Hàm `extract_release_zip_url()` chỉ chấp nhận asset `.zip` được đính kèm trong mục **Releases -> Assets** (ưu tiên `hiep-si-toan-hoc-plugin.zip`), **tuyệt đối không** tải mã nguồn nhánh `main` (`zipball_url`) nhằm loại trừ các file PDF/script nặng và tránh lỗi sai tên thư mục plugin.
  - Tích hợp sâu vào hệ thống cập nhật chuẩn của WordPress qua 3 filters: `pre_set_site_transient_update_plugins` (báo có bản mới ngay tại trang *Dashboard -> Updates* và *Plugins*), `plugins_api` (hiển thị popup chi tiết phiên bản & Changelog), và `upgrader_source_selection` (đảm bảo thư mục giải nén luôn mang tên chuẩn `hiep-si-toan-hoc`).
- **Tự động hóa Phát hành Release ZIP (`.github/workflows/release.yml` & `scripts/publish_release.py`):**
  - Tạo GitHub Actions Workflow `.github/workflows/release.yml` tự động chạy kiểm thử `node scripts/verify_all.js`, đóng gói `hiep-si-toan-hoc-plugin.zip` và đính kèm vào GitHub Release mỗi khi push tag `v*` (ví dụ `v1.0`, `v1.1`).
  - Tạo script CLI `scripts/publish_release.py` giúp nhà phát triển đóng gói `index.html` + `hiep-si-toan-hoc-plugin.zip` và phát hành lên GitHub Releases chỉ bằng 1 lệnh duy nhất (`python scripts/publish_release.py v1.0`).

## [2026-11-13] - Brainstorm Tái Thiết Kế Bố Cục WP Admin Khoa Học & Cơ Chế Auto-Update Từ GitHub Release ZIP
- **Phân tích lỗi bố cục WP Admin (`media_1794541526642_e60564fa.jpg`) và ghi nhận vào `docs/brainstorm-and-specs.md`:**
  - Xác định nguyên nhân giao diện Admin bị rối/vỡ: nhồi nhét Hero Banner lớn + 4 thẻ KPI + 2 cột Cài đặt/Shortcode + Bảng xếp hạng 10 cột vào chung 1 tab duy nhất.
  - Đề xuất 3 phương án kiến trúc giao diện Admin (ưu tiên **Phương án A: Tách thành 4 Tab chuyên biệt chuẩn Techshare VN** — `⚙️ Cài Đặt Trò Chơi`, `🏆 Bảng Vàng & Thống Kê`, `🔄 Cập Nhật GitHub`, `ℹ️ Thông tin Tác Giả`, loại bỏ Hero Banner dư thừa).
  - Thiết kế cơ chế **GitHub Release Auto-Updater (`includes/class-mk-github-updater.php`)**: kết nối GitHub API `/releases/latest`, chỉ nhận gói `.zip` chính thức trong mục Release Assets (`hiep-si-toan-hoc-plugin.zip`), tích hợp thẳng vào trình cập nhật chuẩn của WordPress (`pre_set_site_transient_update_plugins`, `plugins_api`, `upgrader_source_selection`).

## [2026-11-13] - Bổ Sung Tab "Thông tin Tác Giả" (Techshare VN) vào Trang Settings Plugin & Cập Nhật Metadata Tác Giả trong `style.css`
- **Thêm Tab `ℹ️ Thông tin Tác Giả` trong Trang Quản Trị WordPress (`includes/class-mk-admin.php`, `assets/css/admin-style.css`):**
  - Bổ sung thanh chuyển tab trên đầu trang Cài đặt Plugin gồm 2 tab: **`🛡️ Hiệp Sĩ Toán Học`** (Cài đặt & Bảng điểm) và **`ℹ️ Thông tin Tác Giả`** (hỗ trợ chuyển tab mượt không tải lại trang và hỗ trợ URL trực tiếp `admin.php?page=hiep-si-toan-hoc&tab=author`).
  - Thiết kế Card Thông tin Tác giả chuẩn bộ nhận diện **Techshare VN** (vòng tròn avatar xanh lá `TS`, nền xanh mint nhẹ, bảng thông tin chi tiết):
    - **Đơn vị:** Techshare VN — *Giải pháp Web & Plugin WordPress chuyên nghiệp*
    - **🌐 Website:** `techsharevn.com`
    - **👤 Tác giả:** **Trần Vĩ Thành**
    - **📞 Điện thoại:** `0949 897 293`
    - **✉️ Email:** `thanh.web1001@gmail.com`
    - **📦 Plugin:** `Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê v1.0`
    - **📅 Build:** `2026 — GPL-2.0-or-later`
  - Bổ sung khung **Shortcode** nền tối bên dưới hiển thị các thẻ shortcode `[hiep_si_toan_hoc]`, `[hiep_si_toan_hoc book="tap1"]`, `[hiep_si_toan_hoc book="tap2"]`, `[hiep_si_toan_hoc book="all"]`.
- **Cập nhật Thông tin Tác Giả trong `style.css`, `assets/css/admin-style.css` & `hiep-si-toan-hoc.php`:**
  - Tạo file `style.css` ở thư mục gốc của Plugin và cập nhật header của `assets/css/admin-style.css`, `hiep-si-toan-hoc.php` với đầy đủ thông tin tác giả **Trần Vĩ Thành (Techshare VN)**, website `https://techsharevn.com`, SĐT `0949 897 293`, email `thanh.web1001@gmail.com`, `Version: 1.0`, `License: GPL-2.0-or-later`.
  - Bổ sung liên kết nhanh **`Thông tin Tác Giả`** ngay tại danh sách Plugins của WordPress (`plugin_action_links_`).

## [2026-11-13] - Kiểm Toán Bảo Mật Toàn Diện (OWASP Top 10:2025) & Chốt Phiên Bản Khởi Đầu v1.0
- **Chốt phiên bản khởi đầu `v1.0` đồng bộ toàn hệ thống:**
  - Thiết lập phiên bản **`1.0`** thống nhất trên toàn bộ Plugin WordPress (`Version: 1.0`, `MK_PLUGIN_VERSION = '1.0'`, `MK_DB_VERSION = '1.0'`), Web Component Frontend (`MK_VERSION = '1.0'`), bản Single-file `index.html` và toàn bộ hệ thống tài liệu `docs/`.
- **Kiểm toán & gia cố 5 lớp bảo mật theo chuẩn `vulnerability-scanner` (OWASP Top 10:2025):**
  1. **Chống CSV Formula Injection (CWE-1236 / OWASP A05):** Bổ sung `MK_Admin::sanitize_csv_cell()` tự động tiền tố dấu nháy đơn (`'`) khóa các ký tự công thức nguy hiểm (`=`, `+`, `-`, `@`, `\t`, `\r`) khi giáo viên xuất báo cáo điểm ra file Excel/CSV, đồng thời loại bỏ ký tự công thức ở đầu tên người chơi ngay từ tầng REST API.
  2. **Giới hạn tần suất gửi điểm REST API (Rate Limiting / Anti-Flood - OWASP API4):** Sử dụng WordPress Transients (`mk_rl_<md5_ip>`) giới hạn tối đa **10 lần gửi điểm/phút trên mỗi IP**, trả về mã lỗi chuẩn HTTP `429 Too Many Requests` nếu phát hiện spam hoặc flood bảng xếp hạng.
  3. **Kiểm tra tính hợp lý điểm số (Score Plausibility Validation):** Kẹp biên chặt chẽ điểm số (`0..36000`), độ chính xác (`0..100`), chuỗi đúng liên tiếp (`0..200`), số ải vượt qua (`0..5`) và lọc danh sách huy hiệu theo whitelist hợp lệ.
  4. **Gia cố chống DOM XSS & LocalStorage Poisoning trên Shadow DOM:** Nâng cấp `escapeHtml()` (mã hóa đầy đủ `&`, `<`, `>`, `"`, `'`, `` ` ``), làm sạch dữ liệu đọc từ `localStorage` (`sanitizePlayerName`, ép kiểu số học `Number` cho điểm/độ chính xác trên bảng xếp hạng) và kiểm tra giao thức `apiUrl` chỉ chấp nhận `http://`, `https://` hoặc đường dẫn nội bộ `/`.
  5. **Bổ sung HTTP Security Headers khi tải báo cáo CSV:** Gửi kèm `X-Content-Type-Options: nosniff` và `X-Frame-Options: DENY` trong luồng xuất file CSV quản trị.

## [2026-11-12] - Mở Rộng Kích Thước Hộp Thoại Sổ Tay Bí Kíp (`1280px` / `96%`) & Thêm Popup Lightbox Phóng To Ảnh SGK Toàn Màn Hình (`mk-img-lightbox-backdrop`)
- **Mở rộng tối đa Hộp thoại Dialog Sổ Tay Bí Kíp (`assets/js/math-knight-bundle.js`, `index.html`):**
  - Nâng kích thước `.mk-hb-modal-dialog` từ `max-width: 880px` lên `width: 97%; max-width: 1280px; height: 96%; max-height: 96%`, tận dụng tối đa diện tích khung hình 16:9 để hiển thị rõ nét cả hình minh họa SGK và quy tắc của Rô-bốt.
  - Mở rộng cột ảnh bên trái (`minmax(340px, 52%)`), tăng chiều cao ảnh `.mk-hb-modal-img` lên `max-height: clamp(240px, 56vh, 480px)` và tăng cỡ chữ tiêu đề (`1.62rem`), khung quy tắc Rô-bốt (`1.14rem`), khung ghi nhớ nhanh (`1.14rem`).
- **Bổ sung Popup Lightbox Phóng To Ảnh SGK Toàn Màn Hình (`mk-img-lightbox-backdrop`):**
  - Khung ảnh `.mk-hb-modal-img-box` (`#mk-modal-img-trigger`) có hiệu ứng trỏ chuột kính lúp (`cursor: zoom-in`), huy hiệu hướng dẫn **`🔍 Bấm vào ảnh để mở Popup phóng to rõ nét`**.
  - Khi bấm vào ảnh SGK trong Dialog, hệ thống mở lớp **Popup Lightbox Toàn Màn Hình (`.mk-img-lightbox-backdrop`, `z-index: 9999`)** tách biệt hoàn toàn:
    - Hiển thị ảnh SGK sắc nét kích thước lớn (`max-width: 95vw; max-height: 82vh`).
    - Hỗ trợ nút **`🔍 Phóng cực đại (175%)` / `🔎 Thu vừa màn hình (100%)`** (hoặc bấm trực tiếp vào ảnh để bật/tắt chế độ siêu phóng đại `1450px` có thanh cuộn xem từng chữ nhỏ trong bảng La Mã, mặt đồng hồ, tia số...).
    - Đóng nhanh Popup ảnh bằng nút **`✕ Đóng ảnh (Esc)`**, phím `Esc`, hoặc bấm ra ngoài nền tối để quay về hộp thoại Bí kíp.

## [2026-11-12] - Sửa lỗi Rớt Dòng Nhãn Sổ Tay Bí Kíp & Bổ Sung Cơ Chế Click Mở Hộp Thoại Dialog Xem Tập Trung (`mk-hb-modal-dialog`)
- **Sửa lỗi rớt dòng trên thẻ Sổ Tay Bí Kíp (`assets/js/math-knight-bundle.js`, `index.html`):**
  - Thêm `white-space: nowrap; flex-shrink: 0;` cho cả `.mk-cite-tag` và `.mk-topic-tag` nằm trong `.mk-hb-card-top { flex-wrap: nowrap; }`.
  - Tinh gọn nhãn `badge` trong `HANDBOOK_ITEMS` (ví dụ: `"Bài 50 • Trang 21"` thay vì lặp lại chữ `"Tập 2"` vốn đã có ở huy hiệu `"📗 Tập 2"` bên phải), triệt tiêu 100% hiện tượng chữ số `"1"` hoặc `"2"` bị rớt xuống dòng thứ hai.
- **Cơ chế Click mở Hộp thoại Dialog Phóng to Xem Tập Trung (`buildHandbookModalHtml` & `bindHandbookModalEvents`):**
  - Khi bấm vào **bất kỳ thẻ nào trong 15 chủ đề Sổ Tay Bí Kíp** (hoặc bấm nút **`🔍 Xem Hình & Bí Kíp SGK`** ngay trong màn hình chiến đấu `PLAYING`), hệ thống mở hộp thoại **Dialog 2.5D Paper-Cut (`.mk-hb-modal-dialog`)** nổi bật giữa màn hình với:
    - Cột trái: Hình ảnh cắt gốc từ SGK Toán 3 Kết nối tri thức được phóng to sắc nét (`max-height: 310px`) kèm chú thích.
    - Cột phải: Tiêu đề lớn, khung **🤖 Quy tắc đóng khung của Rô-bốt** và khung **📐 Ghi nhớ nhanh**.
    - Tích hợp nút **`🔊 Nghe Rô-bốt Đọc Bí Kíp`** đọc toàn bộ quy tắc & công thức bằng giọng tiếng Việt, nút chuyển nhanh **`⬅️ Bí kíp trước` / `Bí kíp tiếp theo ➡️`** (hỗ trợ phím mũi tên `⬅️` / `➡️`) và nút **`✕ Đóng (Esc)`** (hoặc click ra ngoài nền mờ).

## [2026-11-12] - Phân chia Lộ trình 3 Chế độ Bộ sách: 5 Ải Tập 1 (`tap1`), 5 Ải Tập 2 (`tap2`) & 5 Ải Tổng hợp (`all`)
- **Frontend Core Engine & Giao diện Chọn Tập Sách (`assets/js/math-knight-bundle.js`, `index.html`):**
  - Thiết kế cấu trúc `STAGES_BY_BOOK` gồm **3 chế độ × 5 Ải = 15 cấu hình ải** riêng biệt:
    - **`tap1` (📘 Tập 1 - Học kì 1, Bài 1 → Bài 44):** Ải 1 Rừng Đom Đóm Khởi Đầu (Số đến 1 000, Bảng nhân/chia 2, 5), Ải 2 Suối Nguồn Bảng Nhân Chia (Bảng nhân/chia 3, 4, 6, 7, 8, 9 & Một phần mấy `1/2..1/9`), Ải 3 Thung Lũng Hình Học Phẳng (Trung điểm, Hình tròn, Góc vuông Ê-ke, Khối lập phương/hộp chữ nhật, `mm/g/ml/°C`), Ải 4 Đồi Gió Phép Tính & Biểu Thức (Nhân/chia số có 2–3 chữ số, Chia có dư, Gấp/giảm một số lần, Giải toán 2 bước tính, Biểu thức số), Ải 5 Đền Thờ Pha Lê Học Kì 1 (Boss Phượng Hoàng Lửa Học Kì 1 - Ôn tập Tập 1).
    - **`tap2` (📗 Tập 2 - Học kì 2, Bài 45 → Bài 81):** Ải 1 Thảo Nguyên Nghìn Số & La Mã (Số đến 10 000, Làm tròn số, Số La Mã `I–XX`), Ải 2 Thành Cổ Chu Vi & Diện Tích (Chu vi & Diện tích hình chữ nhật, hình vuông `cm²`), Ải 3 Đỉnh Tuyết Hàng Chục Nghìn (Cộng, trừ, nhân, chia trong phạm vi 10 000 & 100 000), Ải 4 Thác Thời Gian & Xác Suất (Xem đồng hồ đến từng phút, Tháng-năm, Tiền Việt Nam, Bảng thống kê & Xác suất), Ải 5 Lâu Đài Ánh Sáng Học Kì 2 (Boss Kỳ Lân Tinh Tú Học Kì 2 - Ôn tập Tập 2).
    - **`all` (👑 Tổng hợp Tập 1 & Tập 2 - Cả năm):** 5 Ải kết hợp toàn diện kiến thức cả hai tập sách Toán 3 Kết nối tri thức.
  - Bổ sung bộ sinh đề chuyên biệt `MathEngine.genTap1StageQuestion(stageId, index)` và `MathEngine.genTap2StageQuestion(stageId, index)` đảm bảo 100% câu hỏi ở chế độ `tap1` chỉ thuộc Bài 1–44 Tập 1 và 100% câu hỏi ở chế độ `tap2` chỉ thuộc Bài 45–81 Tập 2.
  - Quản lý tiến độ mở khóa 5 ải, số sao (`stageStars`) và đá pha lê (`crystals`) **độc lập cho từng chế độ sách** trong `saveData.bookProgress` (`tap1`, `tap2`, `all`) qua `GameManager.setBookMode(mode)`.
  - Tích hợp thanh chọn 3 chế độ sách (`📘 Tập 1 (Học kì 1)`, `📗 Tập 2 (Học kì 2)`, `👑 Tổng hợp (Tập 1 + 2)`) ngay trên **Màn hình Chính (`START`)**, **Màn hình Bản đồ 5 Ải (`MAP`)** và bộ lọc theo Tập sách trên **Màn hình Sổ tay Bí kíp SGK (`HANDBOOK`)**.
- **Backend WordPress Plugin & Gutenberg Block (`hiep-si-toan-hoc.php`, `includes/class-mk-activator.php`, `includes/class-mk-admin.php`, `includes/class-mk-shortcode-block.php`, `includes/class-mk-rest-api.php`, `assets/js/block-editor.js`):**
  - Bổ sung cài đặt `default_book_mode` (`'all'`, `'tap1'`, `'tap2'`, mặc định `'all'`) trong `mk_get_settings()`, `MK_Activator::init_default_settings()` và trang quản trị Giáo viên (`includes/class-mk-admin.php`).
  - Hỗ trợ thuộc tính `book="tap1|tap2|all"` trong Shortcode `[hiep_si_toan_hoc book="tap1"]` (`includes/class-mk-shortcode-block.php`) và Gutenberg Block `math-knight/game-block` (`assets/js/block-editor.js`), truyền `book` và `book-mode` xuống Web Component `<math-knight-game>`.
  - Cập nhật khu vực Hướng dẫn Nhúng Game trong WP Admin với 3 mẫu Shortcode riêng cho **Tập 1 (Học kì 1)**, **Tập 2 (Học kì 2)** và **Tổng hợp Cả năm**.
- **Tài liệu & Kiểm thử Tự động (`scripts/verify_all.js`, `docs/`):**
  - Mở rộng `scripts/verify_all.js` lên **62 hạng mục kiểm thử**: kiểm tra `STAGES_BY_BOOK` (15 cấu hình ải), sinh thử **750 câu hỏi** (`tap1`, `tap2`, `all` × 5 ải × 50 câu/ải), xác minh 250/250 câu `tap1` trích dẫn đúng `Tập 1`, 250/250 câu `tap2` trích dẫn đúng `Tập 2`, và kiểm tra `GameManager.setBookMode()` lưu tiến độ độc lập.
  - Chạy `python scripts/build_single_html.py`, `python scripts/build_wp_zip.py` và `node scripts/verify_all.js` đạt **62/62 PASS (100% - Zero Errors)**.

## [2026-11-12] - Sửa lỗi Đọc Đề Tiếng Việt (`🔊 Đọc đề`) Không Bị Đọc Nhầm Giọng Tiếng Anh trên Windows
- **Nguyên nhân:** Trên máy Windows chưa cài gói giọng đọc tiếng Việt bản địa (`Microsoft An`), `window.speechSynthesis.getVoices()` chỉ có `Microsoft David Desktop (en-US)` và `Microsoft Zira Desktop (en-US)`. Khi gọi `window.speechSynthesis.speak(utter)` chỉ với `utter.lang = 'vi-VN'`, Chrome tự động fallback về giọng tiếng Anh `Microsoft David` và đọc ký hiệu toán học (`56 : 7 = ?`) bằng tiếng Anh.
- **Khắc phục triệt để (`assets/js/math-knight-bundle.js`, `index.html`):**
  - Bổ sung bộ chuẩn hóa lời đọc toán học tiếng Việt `normalizeVietnameseMathSpeech(rawText)`:
    - Tự động chuyển các ký hiệu toán học Lớp 3 sang tiếng Việt tự nhiên: `56 : 7 = ?` -> `"56 chia 7 bằng bao nhiêu?"`, `×` -> `"nhân"`, `+` -> `"cộng"`, `-` -> `"trừ"`, `( )` -> `"mở ngoặc / đóng ngoặc"`, `= ...` -> `"bằng bao nhiêu"`, gộp các số hàng nghìn viết cách khoảng trắng chuẩn SGK (`14 500` -> `14500` để đọc đúng `"mười bốn nghìn năm trăm"`), và đọc đầy đủ đơn vị đo (`cm²` -> `"xăng-ti-mét vuông"`, `mm, cm, dm, m, km, kg, g, ml, l`).
  - Bổ sung `findVietnameseVoice()` kiểm tra chính xác giọng `vi-VN` trong `speechSynthesis.getVoices()`. Nếu máy Windows chỉ có giọng tiếng Anh (`Microsoft David`/`Zira`), hệ thống tuyệt đối không gọi giọng tiếng Anh mà tự động phát luồng âm thanh **Tiếng Việt chuẩn (`tl=vi`)** qua `playCloudVietnameseTts(spokenText)` (hỗ trợ tự động chia đoạn câu dài và ngắt âm ngay khi chuyển câu/màn hình bằng `stopSpeech()`).

## [2026-11-12] - Sửa lỗi Tràn Ngang CSS Grid trên Màn Hình Bản Đồ 5 Ải & Bộ Sưu Tập 8 Huy Hiệu (`minmax(0, 1fr)` + `min-width: 0`)
- **Nguyên nhân:** Trong CSS Grid, `grid-template-columns: repeat(4, 1fr)` có `min-width` mặc định của grid item là `auto`. Khi thẻ huy hiệu chứa dòng mô tả dùng `white-space: nowrap`, độ rộng tối thiểu của mỗi cột bị đẩy giãn theo chiều dài văn bản làm cột thứ 4 (`Kiến Trúc Sư Pha Lê`, `Huyền Thoại Rừng Pha Lê`) tràn ra ngoài mép phải của `.mk-map-panel`.
- **Khắc phục triệt để (`assets/js/math-knight-bundle.js`, `index.html`):**
  - Chuyển toàn bộ các lưới CSS Grid (`.mk-badge-grid`, `.mk-map-grid`, `.mk-options-grid`, `.mk-avatar-grid`, `.mk-hero-banner`, `.mk-parchment-body.has-visual`) sang dùng `minmax(0, 1fr)` kết hợp `min-width: 0; overflow: hidden; box-sizing: border-box;` trên từng phần tử con (`.mk-badge-card`, `.mk-stage-node`, `.mk-opt-btn`, `.mk-avatar-card`).
  - Cho phép mô tả huy hiệu (`.mk-badge-desc`) tự động xuống tối đa 2 dòng gọn gàng (`-webkit-line-clamp: 2; white-space: normal;`) và cập nhật nội dung 8 huy hiệu khớp 100% tên 5 ải mới.
  - Bổ sung bài kiểm thử thứ 58 vào `scripts/verify_all.js` kiểm tra quy tắc chống tràn CSS Grid (`repeat(4, minmax(0, 1fr))` & `repeat(5, minmax(0, 1fr))`), đạt **58/58 PASS (100%)**.

## [2026-11-12] - Tái thiết kế Giao diện 2.5D Paper-Cut Storybook (`design-taste-frontend`), Full-Viewport 100vw×100dvh, Triệt Tiêu 100% Khoảng Trống & Thanh Cuộn
- **Thiết kế theo chuẩn `/design-taste-frontend` ("Modern flat vector illustration with subtle 2.5D paper-cut depth, lineless geometric art style, bright sunshine and pastel color palette, soft layered drop shadows, crisp clean edges, minimalist children's storybook aesthetic, cheerful and uncluttered composition"):**
  - **Design Read & 3 Dials:** `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 3`.
  - **100% Full-Viewport Edge-to-Edge (`100vw × 100dvh`) — Triệt tiêu hoàn toàn viền trống 4 phía (`scripts/build_single_html.py`, `assets/js/math-knight-bundle.js`, `index.html`):**
    - `html, body` và `:host([standalone="true"])` tràn kín `100vw × 100dvh` (`margin: 0; padding: 0; overflow: hidden;`), loại bỏ hoàn toàn nền tối `#0F172A`, khoảng trống dư thừa 4 xung quanh và dòng footer ngoài khung.
    - Khung `.mk-shell` mở rộng `width: 100%; height: 100%;` trong chế độ standalone/fullscreen và giữ `height: clamp(540px, 88dvh, 760px)` gọn gàng khi nhúng trong bài viết WordPress.
  - **Zero Scrollbars — Triệt tiêu 100% thanh cuộn dọc/ngang:**
    - Áp dụng `overflow: hidden` trên `.mk-shell`, `.mk-main`, `.mk-hero-banner`, `.mk-map-panel`, `.mk-handbook-panel` cùng quy tắc `scrollbar-width: none; -ms-overflow-style: none;` và `*::-webkit-scrollbar { display: none; width: 0; height: 0; }` toàn cục trong Shadow DOM.
    - Tối ưu bố cục màn hình `START`: Chuyển 2 thẻ chọn nhân vật (`.mk-avatar-card`) sang bố cục ngang gọn gàng và cố định hàng 3 nút CTA (`.mk-btn-row { flex-wrap: nowrap; }`) nằm trên **1 hàng ngang duy nhất** (tuân thủ `CTA Button Wrap Ban`), giúp tiết kiệm ~90px chiều cao và hiển thị trọn vẹn trong 1 khung nhìn không bao giờ xuất hiện thanh cuộn.
  - **Bảng màu Nắng Sớm & Pastel Tươi Sáng (Bright Sunshine & Pastel Palette) + Đổ bóng 2.5D Paper-Cut:**
    - Thay thế toàn bộ thanh Topbar đen/nâu sẫm (`#1E293B`, `#4A2E1B`) bằng thẻ giấy nổi trắng kem nắng sớm (`#FFFDF9`, `#FFFFFF`, `#F0F9FF`, `#FEF9C3`) với lớp cắt giấy 2.5D (`box-shadow: 0 6px 0 #BAE6FD`, `0 8px 0 #FDE68A`, `0 5px 0 #059669`).
    - Bảng câu hỏi Storybook Paper-Cut (`.mk-parchment-board`) dùng nền kem sáng `#FFFDF7 -> #FFFBEB`, viền vàng nắng `#FDE68A` và đế cắt giấy `#FCD34D`.
  - **Minh họa Vector Phẳng Không Viền Đen (`stroke="none"`) & Lớp Cắt Giấy 2.5D (`VisualBuilder`):**
    - Thiết kế lại toàn bộ SVG Hiệp Sĩ Nam, Pháp Sư Mai (`renderHeroSVG`), 5 Boss (`renderBossSVG`), 5 Viên Đá Pha Lê (`renderCrystalSVG`) và 5 Bối cảnh Sân khấu (`renderSceneBackdropSVG`) theo phong cách **lineless geometric vector (`stroke="none"`)** kết hợp bộ lọc SVG `<feDropShadow>` (`mkPaperKnight`, `mkPaperMage`, `mkBossPaper1..5`, `mkPaperLayer`, `mkCloudShadow`).
    - Cả 5 ải (kể cả Ải 3 Hang Động Pha Lê Tím Pastel & Ải 5 Đỉnh Núi Pha Lê Nắng Vàng Sapphire) đều mang tông màu pastel rực rỡ, tươi vui như sách truyện thiếu nhi hiện đại.
  - **Quy tắc Văn bản (`design-taste-frontend`):** Loại bỏ 100% ký tự gạch ngang dài em-dash (`—`) trong toàn bộ giao diện và lời giải.
- **Đóng gói & Kiểm thử Tự động (`scripts/verify_all.js`):**
  - Mở rộng bộ kiểm thử tự động từ 53 lên **57 hạng mục kiểm thử** (bổ sung kiểm tra Full-viewport `100vw × 100dvh`, Zero Scrollbars `scrollbar-width: none`, bộ lọc SVG 2.5D Paper-Cut `mkPaperLayer`/`mkBossPaper`, không còn mã màu tối `#4A2E1B` và 0 ký tự em-dash).
  - Chạy `python scripts/build_single_html.py`, `python scripts/build_wp_zip.py` và `node scripts/verify_all.js` đạt **57/57 PASS (100%)**.

## [2026-11-12] - Tái thiết kế Giao diện Chuẩn 16:9 Không Cuộn Dọc, Sân Khấu 2D Casual, Bảng Giấy Da & Lộ Trình 5 Ải (8+1 Câu Boss)
- **Bố cục màn hình 16:9 gọn trong 1 khung nhìn (`assets/js/math-knight-bundle.js`, `scripts/build_single_html.py`, `index.html`):**
  - Thiết kế khung `.mk-shell` chuẩn tỷ lệ `16:9` (`max-width: 1120px; aspect-ratio: 16 / 9; min-height: 580px; max-height: 92vh;`), chia làm 3 tầng cố định vừa khít trong 1 màn hình laptop/iPad mà không bao giờ bị tràn cuộn dọc khi đang chiến đấu:
    1. **Thanh HUD trên cùng (`.mk-hud-top`, cao ~54px):** Bên trái có nút `🗺️ Bản đồ` + Tên Ải hiện tại; Ở giữa là **Thanh tiến độ `8 + 1 = 9 đốt`** (8 đốt Pha Lê `💎` sáng ngọc bích khi vượt qua, câu hiện tại nhấp nháy vàng, đốt thứ 9 là biểu tượng Boss `👑`/`🐉`); Bên phải gồm 3 Tim HP (`❤️❤️❤️`), Bộ đếm Combo (`🔥 Combo x2` khi `streak >= 3`), Điểm số, nút Loa (`🔊`/`🔇`) và nút Toàn màn hình (`⛶`).
    2. **Sân khấu Chiến đấu 2D Casual - Nửa trên (`.mk-battle-stage`, ~42% chiều cao):** Vẽ SVG phong cảnh nhiều lớp riêng cho từng ải (`VisualBuilder.renderSceneBackdropSVG(stageId)`: bầu trời, núi xa, rừng cây, cầu vồng, hang động pha lê, thác nước tri thức, đỉnh núi pha lê) kèm mặt đất phẳng phía dưới để Hiệp sĩ đứng bên trái và Quái vật đứng bên phải (hỗ trợ cả `window.MK_STAGE_BACKGROUNDS` nếu có).
    3. **Bảng Câu hỏi Giấy Da Cổ Điển & 4 Nút Đáp Án - Nửa dưới (`.mk-parchment-board`, ~54% chiều cao):** Chuẩn thông số `background: #FFF8E7; border: 4px solid #4A2E1B; border-radius: 20px; box-shadow: 0 6px 0 #4A2E1B, inset 0 2px 0 rgba(255,255,255,0.8);`. Tự động chia **2 cột ngang** (`.mk-parchment-body.has-visual`: Cột trái chứa hình vẽ SVG trực quan, Cột phải chứa nội dung câu hỏi + 4 nút đáp án 3D `choices[4]`) giúp tiết kiệm 100% chiều cao. Loại bỏ bàn phím Numpad 10 nút rườm rà trong màn hình chiến đấu (hỗ trợ chọn 1 chạm hoặc phím `1–4` / `A–D` + `Enter`).
- **Tương tác Chiến đấu & Thanh Máu Quái Vật Trực Quan:**
  - Trên đầu Quái vật chỉ hiển thị **1 thanh máu đỏ chia theo số đốt câu hỏi còn lại** (`9/9 ❤️` giảm xuống `8/9 ❤️` khi bị chém trúng), **loại bỏ hoàn toàn** dòng chữ `"Năng lượng Boss: 100%"`.
  - Khi trả lời **ĐÚNG**: Hiệp sĩ lao tới tung nhát chém kiếm pha lê (`mkHeroLunge` + `mkSlashArc`), Quái vật chớp đỏ rung lắc (`mkMonsterHit`), mất 1 đốt máu (`💥 -1 Đốt Máu!`), nút đáp án đúng đổi sang màu xanh ngọc (`#10B981`, viền `#047857`). Khi `streak >= 3`, kích hoạt hào quang **`🔥 CUỒNG NỘ PHA LÊ x2`**.
  - Khi trả lời **SAI**: Quái vật lao sang phản công (`mkMonsterAttack`), Hiệp sĩ chớp đỏ và mất 1 Tim (`💔 -1 Tim!`), nút chọn sai đổi sang màu đỏ san hô (`#F43F5E`, viền `#BE123C`).
- **Lộ trình 5 Ải & 5 Boss mới (8 câu thường + 1 câu Boss cuối ải = 9 câu/ải):**
  - **Ải 1: Khu Rừng Khởi Đầu** — Boss: **Slime Xanh Bạc Hà** (`#34D399`) — Bảng nhân/chia 2–9 (có dư), tìm thành phần chưa biết, cộng trừ phạm vi 10 000.
  - **Ải 2: Thung Lũng Cầu Vồng** — Boss: **Goblin Bàn Tính** (`#F59E0B`) — Nhân/chia số có 3–4 chữ số với số có 1 chữ số, chữ số La Mã `I`–`XX`, xem đồng hồ kim SVG chính xác đến từng phút.
  - **Ải 3: Hang Động Pha Lê** — Boss: **Người Đá Golem Tím** (`#8B5CF6`) — Giá trị biểu thức số (nhân chia trước, cộng trừ sau, có dấu ngoặc), quy đổi đơn vị đo (`mm, cm, dm, m, km, g, kg, ml, l`), cộng trừ phạm vi 100 000.
  - **Ải 4: Thác Nước Tri Thức** — Boss: **Pháp Sư Cú Cổ Đại** (`#0EA5E9`) — Chu vi & diện tích hình vuông/hình chữ nhật, góc vuông, trung điểm, hình tròn, giải toán có lời văn 2 bước tính, thống kê & xác suất.
  - **Ải 5: Đỉnh Núi Pha Lê** — Boss: **Rồng Pha Lê Sapphire** (`#2563EB`) — Tổng hợp toàn bộ kiến thức nâng cao của cả 4 mạch kiến thức.
  - Câu thứ 9 có nhãn **`👑 CÂU HỎI QUYẾT ĐỊNH CỦA BOSS (X2 ĐIỂM)`** và thưởng gấp đôi điểm khi hạ gục Boss.
- **Chuẩn hóa `MathEngine` & `localStorage` (`stageStars`):**
  - Chuẩn hóa object câu hỏi trả về đầy đủ `{ category, topicName, sgkCite, sgkAssetKey, questionText, question, svgVisual, choices, options, correctIndex, correctAnswer, answer, explanation, isBossQuestion }`.
  - Lưu trữ `stageStars` (1–3 sao dựa trên số Tim còn lại khi qua ải: 3 Tim = 3 sao ⭐⭐⭐, 2 Tim = 2 sao ⭐⭐, 1 Tim = 1 sao ⭐) trong `localStorage` (`math_knight_save_v1`).
- **Đóng gói & Kiểm thử:** Chạy `python scripts/build_single_html.py`, `python scripts/build_wp_zip.py` và `node scripts/verify_all.js` đạt **53/53 PASS (100%)**.

## [2026-11-12] - Nâng cấp Frontend Bundle (`assets/js/math-knight-bundle.js`) & Bản `index.html` theo chuẩn `/game-development`
- **Chế độ Toàn màn hình (`web-games`):**
  - Nút `⛶ Toàn màn hình` / `🗗 Thu nhỏ` trên thanh Topbar ở mọi màn hình + nút nhanh `⛶ Chơi Toàn Màn Hình` ngay tại màn hình `START` + phím tắt `F` (khi không focus ô nhập tên).
  - Tự động co giãn kích thước `fxCanvas` (`resizeFxCanvas()`) theo kích thước thực của `.mk-shell` khi bật/tắt Fullscreen hoặc thay đổi kích thước cửa sổ.
  - Tự động tạm dừng bộ đếm ngược khi người chơi chuyển tab trình duyệt (`document.addEventListener('visibilitychange', ...)`) và tiếp tục khi quay lại tab.
- **Thanh máu Boss trực quan & Không trừ % khi mất máu (`game-design`):**
  - Trừ ngay lập tức `100 HP` của Boss khi trả lời đúng (câu cuối đưa về `0 HP` ngay lập tức), hiển thị rõ `❤️ Máu Boss: 700 / 800 HP (Còn 7 đòn)` kèm huy hiệu động `💥 -100 HP!`, loại bỏ số `%` lẻ gây rối trên thanh máu Boss.
  - Khi trả lời sai (mất 1 Tim ❤️): Hiển thị huy hiệu `💔 -1 Tim! (Không trừ %)` và hiệu ứng rung Hiệp Sĩ (`mk-hero-hit`), tuyệt đối **không trừ điểm (`score`)** và **không trừ % thưởng/độ hoàn thành** (`getAccuracyPercent()`).
  - Thêm nút **`🔊 Đọc đề`** (Web Speech API tiếng Việt `vi-VN`) ngay trên thẻ câu hỏi để học sinh lớp 3 bấm nghe đọc câu hỏi toán có lời văn.
- **Hiệu ứng Chiến đấu & Adaptive Audio (`game-art`, `game-audio`):**
  - Bổ sung animation thở/nhấp nhô (`mkFloatIdle`) cho nhân vật & Boss, cùng hiệu ứng phóng tuyệt chiêu `⚔️ Kiếm Ánh Sáng ➔` / `🔮 Cầu Pha Lê ➔` (`mk-attack-beam`) khi tấn công Boss.
  - Nâng cấp `SoundFX.playCorrect(streak)` với Adaptive Pitch Scaling (tăng nhẹ tần số âm thanh theo chuỗi trả lời đúng liên tiếp).
- **Đồng bộ & Kiểm thử:** Chạy `node --check assets/js/math-knight-bundle.js` (0 lỗi) và `python scripts/build_single_html.py` để cập nhật ngay file `index.html` (~617.8 KB).

## [2026-11-12] - Nâng cấp Chế độ Toàn màn hình (Fullscreen), Cơ chế Độ chính xác (%) không trừ oan khi mất máu & Đóng gói `.zip`
- **Backend WordPress Plugin (`hiep-si-toan-hoc.php`, `includes/class-mk-activator.php`, `includes/class-mk-admin.php`, `includes/class-mk-shortcode-block.php`, `assets/js/block-editor.js`):**
  - Bổ sung tùy chọn `fullscreen_button` (mặc định `true`) vào `mk_get_settings()`, `MK_Activator::init_default_settings()` và form cài đặt trong `includes/class-mk-admin.php`.
  - Hỗ trợ thuộc tính `fullscreen="true|false"` trong Shortcode `[hiep_si_toan_hoc]` và Gutenberg Block `math-knight/game-block` (`assets/js/block-editor.js`), truyền `fullscreen-button` xuống `<math-knight-game>`.
  - Bổ sung hướng dẫn phím tắt `F` / nút `⛶ Toàn màn hình` và giải thích cơ chế mất Tim (kể cả khi hết giờ) không làm giảm oan % Độ chính xác của học sinh ngay trên trang quản trị giáo viên.
- **Đóng gói WordPress Plugin (`scripts/build_wp_zip.py`):**
  - Xây dựng và chạy script `scripts/build_wp_zip.py` đóng gói tự động file `hiep-si-toan-hoc-plugin.zip` chuẩn cấu trúc thư mục `hiep-si-toan-hoc/` (loại bỏ `docs/pdf/` giúp gói cài đặt nhẹ ~1.16 MB sẵn sàng tải lên WordPress).

## [2026-11-12] - Kiểm thử Tự động Toàn diện (`scripts/verify_all.js`) & Nghiệm thu Dự án (Phase 5)
- **Xây dựng & thực thi bộ kiểm thử tự động `scripts/verify_all.js` (Đạt 53/53 hạng mục - 100% PASS):**
  - **Kiểm tra cú pháp & bảo mật PHP (`php -l`):** Xác minh 100% không lỗi cú pháp trên toàn bộ 6 file PHP (`hiep-si-toan-hoc.php`, `uninstall.php`, `includes/class-mk-activator.php`, `includes/class-mk-rest-api.php`, `includes/class-mk-admin.php`, `includes/class-mk-shortcode-block.php`), đầy đủ chốt chặn `ABSPATH`/`WP_UNINSTALL_PLUGIN`, `$wpdb->prepare`, `check_admin_referer`, `sanitize_text_field`, `esc_html`.
  - **Kiểm tra cú pháp JavaScript (`node --check`):** Xác minh 100% hợp lệ trên `assets/js/sgk-assets.js`, `assets/js/math-knight-bundle.js`, `assets/js/block-editor.js`.
  - **Kiểm thử Runtime `MathEngine`, `VisualBuilder` & `GameManager` (500 câu hỏi qua 5 ải, 100 câu/ải):**
    - Chuẩn hóa đồng bộ thuộc tính `question`/`questionText` và `answer`/`correctAnswer` (bao gồm đơn vị đo khi chuyển sang chế độ trắc nghiệm 4 lựa chọn A/B/C/D), đảm bảo `GameManager.evaluateAnswer()` chấm đúng 100% ở cả 2 chế độ **Numpad** và **MCQ** (500/500 câu).
    - Xác minh 100% câu hỏi (500/500) có đủ 4 phương án không trùng lặp, chứa đáp án đúng, có lời giải thích kèm trích dẫn `[SGK Kết nối tri thức - Bài ..., trang ...]` và không chứa `NaN`/`undefined`.
    - Xác minh `VisualBuilder.renderQuestionVisual(q, true)` render thành công 100% (500/500) các hình vẽ SVG động (`clock`, `roman_clock`, `midpoint`, `circle`, `angle`, `rect_grid`, `mm_ruler`, `stats_table`, `prob_box`, `expression_path`) cùng ngăn kéo đối chiếu 16 hình ảnh gốc SGK Kết nối tri thức.
  - **Kiểm tra bản Single-file `index.html` (~605.5 KB):** Xác minh chứa đầy đủ 5 Core Modules (`SoundFX`, `VisualBuilder`, `MathEngine`, `GameManager`, `UIController`), đăng ký Custom Element `<math-knight-game>`, nhúng đủ 16 ảnh base64 từ `window.MK_SGK_ASSETS` và không phụ thuộc bất kỳ file `.mp3`/`.wav` hay CDN bên ngoài.
- **Cập nhật tài liệu nghiệm thu:** Đánh dấu hoàn thành `[x]` toàn bộ 6 Tasks trong `hiep-si-toan-hoc-plan.md`, cập nhật `docs/README.md` và `docs/changelog.md`.

## [2026-11-12] - Xây dựng WordPress Plugin Backend, Gutenberg Block & Trang Quản trị Giáo viên (Phase 4)
- **Xây dựng bộ nhân WordPress Plugin (`hiep-si-toan-hoc.php`, `uninstall.php`, `includes/*.php`):**
  - `includes/class-mk-activator.php`: Tạo bảng CSDL `{prefix}math_knight_scores` bằng `dbDelta()`, khởi tạo cấu hình mặc định và nạp sẵn 5 kỷ lục mẫu của nhóm bạn **Rô-bốt, Việt, Nam, Mai, Mi**.
  - `includes/class-mk-rest-api.php`: Cung cấp 3 REST API endpoints (`GET /math-knight/v1/leaderboard`, `POST /math-knight/v1/scores`, `GET /math-knight/v1/config`) có kiểm tra chống gian lận điểm số và làm sạch dữ liệu đầu vào.
  - `includes/class-mk-admin.php` & `assets/css/admin-style.css`: Giao diện trang quản trị giáo viên (**Hiệp Sĩ Toán 3**) cho phép tùy chỉnh số câu/ải, thời gian/câu, số Tim, bật/tắt hình gốc SGK, lọc phân môn, xem thống kê, xuất file **CSV chuẩn UTF-8 BOM** mở trực tiếp trên Excel và đặt lại bảng xếp hạng.
  - `includes/class-mk-shortcode-block.php` & `assets/js/block-editor.js`: Đăng ký Shortcode `[hiep_si_toan_hoc]`, Gutenberg Block `math-knight/game-block` với InspectorControls trực quan và tự động phát hiện thẻ `<math-knight-game>` trong bài viết.

## [2026-11-12] - Xây dựng Core Frontend Bundle (`assets/js/math-knight-bundle.js`) & Bản Single-file Độc lập (`index.html`) (Phase 2 & 3)
- **Xây dựng `assets/js/math-knight-bundle.js` (ES6 Vanilla JS, không phụ thuộc thư viện ngoài):**
  - **`SoundFX` (Web Audio API 100%):** Tổng hợp âm thanh trực tiếp bằng `AudioContext`, `OscillatorNode`, `GainNode` (`playClick`, `playSlash`, `playCorrect`, `playWrong`, `playFuryActivate`, `playItemUse`, `playStageClear`, `playVictory`, `playGameOver`) kèm nút Bật/Tắt tiếng.
  - **`VisualBuilder` (Đồ họa SVG động 100% + Ảnh cắt gốc SGK Kết nối tri thức):**
    - Vẽ SVG động cho 2 nhân vật chọn (**Hiệp Sĩ Nam** & **Pháp Sư Mai**), bạn đồng hành **Rô-bốt Thông Thái** (`robot_mascot`), **5 Boss Quái vật** và **5 Viên Đá Pha Lê**.
    - Tự động vẽ hình minh họa SVG động theo số liệu câu hỏi (`clock`, `roman_clock`, `midpoint`, `circle`, `angle`, `rect_grid`, `mm_ruler`, `stats_table`, `prob_box`, `expression_path`) kết hợp ngăn kéo **"📖 Đối chiếu hình gốc SGK Kết nối tri thức"** từ `window.MK_SGK_ASSETS`.
  - **`MathEngine` (Bộ sinh đề động 100% chuẩn SGK Toán 3 Kết nối tri thức Tập 1 & Tập 2):**
    - Phân bổ chuẩn 5 ải: Ải 1 (Thung Lũng Số Học), Ải 2 (Đầm Lầy Hình Học & Đo Lường), Ải 3 (Mê Cung Lời Văn với Việt, Nam, Mai, Mi, Rô-bốt), Ải 4 (Đỉnh Núi Thống Kê & Xác Suất), Ải 5 (Lâu Đài Hắc Ám - Boss Tổng Hợp).
    - Hỗ trợ cả bàn phím số cảm ứng (`numpad` + phím cứng `0-9, Enter, Backspace`) và trắc nghiệm 4 lựa chọn (`mcq`), kèm lời giải thích từng bước của Rô-bốt và trích dẫn `[SGK Kết nối tri thức - Bài ..., trang ...]`.
  - **`GameManager` & `<math-knight-game>` (Shadow DOM Isolation):**
    - Quản lý máu (Tim), chuỗi **Cuồng Nộ x2 điểm** (`streak >= 3`), đồng hồ đếm ngược 30s (bật/tắt linh hoạt), 3 vật phẩm trợ giúp (🛡️ Khiên Ánh Sáng, ⏳ Đồng Hồ Cát +15s, 💡 Gợi Ý Rô-bốt), 8 Huy hiệu thành tựu, Sổ Tay Bí Kíp 15 chủ đề SGK, lưu `localStorage` (`math_knight_save_v1`) và đồng bộ Bảng Vàng qua WordPress REST API (`math-knight/v1/scores`).
- **Đóng gói Bản Single-file `index.html` (`scripts/build_single_html.py`):**
  - Tạo script `scripts/build_single_html.py` tích hợp toàn bộ HTML5 + CSS3 + `assets/js/sgk-assets.js` + `assets/js/math-knight-bundle.js` thành 1 file `index.html` độc lập duy nhất (~604.8 KB), mở trực tiếp trên mọi trình duyệt không cần Internet hay Server.
- **Kiểm thử cú pháp & thực thi:** Chạy `node --check assets/js/math-knight-bundle.js` và kiểm tra khởi tạo Custom Element `<math-knight-game>` thành công 100%.

## [2026-11-12] - Chuyển đổi 2 File PDF SGK Toán 3 "Kết Nối Tri Thức" sang Markdown & Cắt Hình Ảnh Gốc (Phase 1.5)
- **Định hướng học liệu 100% Kết nối tri thức:** Cập nhật toàn bộ tài liệu và kế hoạch dự án chỉ tập trung vào bộ sách **Toán 3 - Kết nối tri thức với cuộc sống** (Tập 1 & Tập 2) theo yêu cầu của User, lồng ghép hệ thống nhân vật quen thuộc của bộ sách (**Rô-bốt, Việt, Nam, Mai, Mi**).
- **Xây dựng & chạy script trích xuất (`scripts/extract_sgk_kntt.py`):**
  - Sử dụng `PyMuPDF (fitz)` và `Pillow (PIL)` cắt chính xác **16 hình ảnh minh họa đặc sắc** từ `docs/pdf/03-sgk-toan-3-tap-mot.pdf` và `docs/pdf/03-sgk-toan-3-tap-hai.pdf` lưu vào `assets/images/sgk/`:
    - `cover_tap1.jpg`, `robot_mascot.png`, `midpoint_b16.jpg`, `circle_b17.jpg`, `angle_eke_b18.jpg`, `mult_fold_b24.jpg`, `two_step_b28.jpg`, `mm_ruler_b30.jpg`, `expression_b38.jpg`, `roman_clock_b47.jpg`, `perimeter_b50.jpg`, `area_grid_b52.jpg`, `clock_read_b66.jpg`, `vn_money_b68.jpg`, `stats_basketball_b73.jpg`, `prob_balls_coins_b74.jpg`.
  - Sinh tự động `assets/images/sgk/manifest.json` và bundle `assets/js/sgk-assets.js` (`window.MK_SGK_ASSETS`) kèm chuỗi `dataUri` nén nhẹ để hiển thị trực tiếp hình ảnh gốc SGK trong cả bản Single-file `index.html` lẫn WordPress Plugin.
  - Dọn dẹp sạch sẽ các thư mục ảnh preview tạm thời (`docs/pdf/toc_preview`, `docs/pdf/sample_pages`).
- **Chuyển đổi 2 file PDF sang tài liệu Markdown tra cứu (`docs/sgk-toan-3-tap-1.md`, `docs/sgk-toan-3-tap-2.md`):**
  - `docs/sgk-toan-3-tap-1.md`: Đầy đủ Chủ đề 1 → Chủ đề 7 (Bài 1 → Bài 44, trang 6 → 121) và Bảng thuật ngữ Tập 1 (trang 122–123), nhúng trực tiếp các hình minh họa đã cắt.
  - `docs/sgk-toan-3-tap-2.md`: Đầy đủ Chủ đề 8 → Chủ đề 16 (Bài 45 → Bài 81, trang 4 → 126) và Bảng thuật ngữ Tập 2 (trang 127), nhúng trực tiếp các hình minh họa đã cắt.
- **Cập nhật tài liệu hệ thống:** Cập nhật `docs/math-curriculum-g3.md`, `docs/README.md`, `GEMINI.md` và `hiep-si-toan-hoc-plan.md` để đồng bộ hóa kho tài liệu và hình ảnh SGK Kết nối tri thức.

## [2026-11-12] - Lập Kế hoạch Tổng thể & Thiết kế Kiến trúc Chi tiết (Phase 1)
- **Tạo kế hoạch tổng thể:** Khởi tạo [`hiep-si-toan-hoc-plan.md`](../hiep-si-toan-hoc-plan.md) tại thư mục gốc dự án với cấu trúc file tree, thiết kế 5 module core (`SoundFX`, `VisualBuilder`, `MathEngine`, `GameManager`, `UIController` + `<math-knight-game>`), thiết kế CSDL WordPress & lộ trình 6 tasks kiểm thử rõ ràng.
- **Tài liệu Kiến trúc (`docs/architecture.md`):** Thiết kế chi tiết kiến trúc Dual-Target (Single-file `index.html` + WordPress Plugin), sơ đồ Mermaid, Custom Web Component `<math-knight-game>` sử dụng Shadow DOM, bảng MySQL `{prefix}math_knight_scores` và các endpoints WP REST API (`math-knight/v1`).
- **Tài liệu Ma trận Toán Lớp 3 (`docs/math-curriculum-g3.md`):** Đặc tả đầy đủ ngân hàng câu hỏi động cho 4 phân môn GDPT 2018 (Số & Phép tính, Hình học & Đo lường, Giải toán có lời văn, Thống kê & Xác suất) và Ải 5 Boss Tổng hợp, kèm quy tắc sinh phương án nhiễu và hình minh họa SVG tự động.
- **Cập nhật Đặc tả & README (`docs/brainstorm-and-specs.md`, `docs/README.md`):** Ghi nhận toàn bộ quyết định kiến trúc (ADR-01, ADR-02, ADR-03) đã chốt với User.

## [2026-11-12] - Khởi tạo Rules & Giai đoạn Brainstorming (Phase 0)
- **Thiết lập Rules:** Tạo `GEMINI.md` và `.agents/rules/docs-update.md` quy định bắt buộc cập nhật thư mục `docs/` cho bất kỳ công việc nào thực hiện trong dự án.
- **Khởi tạo `docs/`:** Tạo `docs/README.md`, `docs/changelog.md`, và `docs/brainstorm-and-specs.md`.
- **Brainstorming:** Phân tích yêu cầu gốc của game "Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê" (Toán lớp 3 GDPT 2018), đề xuất các phương án kiến trúc WordPress Plugin + Custom Element và đặt câu hỏi làm rõ với User.

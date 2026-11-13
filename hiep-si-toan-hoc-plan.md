# Kế hoạch Triển khai Dự án: Hiệp Sĩ Toán Học - Giải Cứu Rừng Pha Lê (Phiên bản v1.0)

## Mục tiêu (Goal)
Xây dựng hoàn chỉnh Web Game Giáo dục môn Toán Lớp 3 — **Phiên bản khởi đầu `v1.0`** (**tập trung 100% vào bộ sách giáo khoa "Kết nối tri thức với cuộc sống" Tập 1 & Tập 2** - Chương trình GDPT 2018 Việt Nam) gồm **bản Single-file `index.html` độc lập (`v1.0`)** VÀ **WordPress Plugin hoàn chỉnh (`hiep-si-toan-hoc.php`, `v1.0`)** tích hợp Custom Web Component `<math-knight-game>` (Shadow DOM), Shortcode `[hiep_si_toan_hoc]`, Gutenberg Block (`math-knight/game-block`), đồ họa SVG/Canvas kết hợp **16 hình ảnh minh họa cắt gốc từ PDF SGK Kết nối tri thức (`assets/images/sgk/` & `assets/js/sgk-assets.js`)**, âm thanh tổng hợp (Web Audio API), cùng hệ thống lưu trữ kép (`localStorage` + WordPress REST API & Database `wp_math_knight_scores`).

---

## Cấu trúc Thư mục Dự án (File Tree)

```text
d:\AI_APP\plugin_wordpress\game_toan_lop_3\
├── GEMINI.md                              # Quy tắc bắt buộc của Workspace
├── hiep-si-toan-hoc-plan.md               # Kế hoạch triển khai tổng thể (File này)
├── index.html                             # Bản Single-file độc lập (chạy trực tiếp không cần server)
├── hiep-si-toan-hoc.php                   # Main WordPress Plugin Bootstrap File
├── uninstall.php                          # Dọn dẹp DB/Options khi gỡ cài đặt plugin (tùy chọn)
├── scripts/
│   └── extract_sgk_kntt.py                # Script cắt hình ảnh & trích xuất metadata từ 2 file PDF SGK
├── includes/
│   ├── class-mk-activator.php             # Tạo bảng CSDL `wp_math_knight_scores` & default options
│   ├── class-mk-rest-api.php              # WP REST API (`math-knight/v1/scores`, `math-knight/v1/config`)
│   ├── class-mk-admin.php                 # Trang cài đặt Admin & Quản lý Bảng xếp hạng + Xuất CSV
│   └── class-mk-shortcode-block.php       # Đăng ký Shortcode `[hiep_si_toan_hoc]` & Gutenberg Block
├── assets/
│   ├── images/
│   │   └── sgk/                           # 16 hình minh họa cắt từ PDF SGK Kết nối tri thức + manifest.json
│   ├── js/
│   │   ├── sgk-assets.js                  # Bundle metadata + dataUri ảnh SGK (`window.MK_SGK_ASSETS`)
│   │   ├── math-knight-bundle.js          # Core Game Engine + Custom Element `<math-knight-game>`
│   │   └── block-editor.js                # Script đăng ký Gutenberg Block trong trình soạn thảo WP
│   └── css/
│       └── admin-style.css                # Giao diện trang quản trị WordPress Admin
└── docs/
    ├── README.md                          # Tổng quan dự án & Mục lục tài liệu
    ├── changelog.md                       # Nhật ký mọi thay đổi theo thời gian thực
    ├── brainstorm-and-specs.md            # Kết quả Brainstorming, ADR & Đặc tả chi tiết
    ├── architecture.md                    # Kiến trúc hệ thống, Custom Element, CSDL & API
    ├── math-curriculum-g3.md              # Ma trận ngân hàng câu hỏi Toán Lớp 3 (Bộ Kết nối tri thức)
    ├── sgk-toan-3-tap-1.md                # Tài liệu Markdown hóa SGK Toán 3 Tập 1 (Chủ đề 1-7, Bài 1-44)
    ├── sgk-toan-3-tap-2.md                # Tài liệu Markdown hóa SGK Toán 3 Tập 2 (Chủ đề 8-16, Bài 45-81)
    └── pdf/
        ├── 03-sgk-toan-3-tap-mot.pdf      # File PDF gốc SGK Toán 3 Tập 1 (Kết nối tri thức)
        └── 03-sgk-toan-3-tap-hai.pdf      # File PDF gốc SGK Toán 3 Tập 2 (Kết nối tri thức)
```

---

## Thiết kế Kiến trúc Module Core (`MathKnightEngine`)

Toàn bộ mã nguồn Game Engine được thiết kế theo kiến trúc hướng đối tượng / module hóa rõ ràng, dùng chung giữa `index.html` và `assets/js/math-knight-bundle.js`:

1. **`SoundFX` (Web Audio API Synthesizer):**
   - Không dùng file `.mp3`/`.wav` ngoài; tạo âm thanh 100% bằng `AudioContext`, `OscillatorNode`, `GainNode`.
   - Hiệu ứng âm thanh: `playClick()`, `playCorrect()`, `playWrong()`, `playSlash()`, `playFuryActivate()`, `playItemUse()`, `playStageClear()`, `playVictory()`, `playGameOver()`.
   - Hỗ trợ nút Bật/Tắt âm thanh (`isMuted`) lưu trạng thái vào `localStorage`.

2. **`VisualBuilder` (100% Procedural SVG & Canvas Renderer):**
   - **Nhân vật & Quái vật SVG động:**
     - `renderHero(characterType, state)`: Bé Trai *Hiệp Sĩ Kiếm Ánh Sáng* (`knight`) và Bé Gái *Pháp Sư Pha Lê* (`mage`) với trạng thái đứng nghỉ, tấn công, trúng đòn, chiến thắng.
     - `renderBoss(stageId, hpPercent)`: 5 Boss tương ứng 5 ải (Slime Số Học, Golem Đá Hình Học, Phù Thủy Sương Mù, Rồng Gió Thống Kê, Chúa Tể Bóng Tối) + hiệu ứng biến đổi thành **Viên Đá Pha Lê Tỏa Sáng** khi bị đánh bại.
   - **Trực quan hóa Toán học (`renderMathVisual(visualData)`):**
     - `clock`: Đồng hồ mặt tròn SVG với 12 vạch số, vạch phút, kim giờ ngắn và kim phút dài quay đúng góc theo `(hour, minute)`.
     - `rectangle` / `square`: Hình chữ nhật / hình vuông có nhãn kích thước các cạnh (cm, dm, m) và tô màu diện tích/chu vi.
     - `circle`: Hình tròn có tâm `O`, bán kính `OM`, đường kính `AB` kèm độ dài.
     - `angle`: Minh họa góc vuông / góc không vuông tại đỉnh kèm thước Ê-ke đặt kiểm tra góc.
     - `midpoint`: Đoạn thẳng `AB` có điểm `M` ở giữa kèm số đo hai đoạn.
     - `table`: Bảng số liệu thống kê có biểu tượng trực quan dành cho câu hỏi Thống kê & Xác suất.
   - **Particle Canvas (`ParticleSystem`):** Hiệu ứng chém kiếm/phép thuật, mưa sao vàng, và pháo hoa chúc mừng chiến thắng.

3. **`MathEngine` (Bộ Sinh Đề Động Toán Lớp 3 - GDPT 2018 theo 3 Chế độ Tập 1, Tập 2 & Tổng hợp):**
   - Hỗ trợ **3 Chế độ Bộ sách (`bookMode`: `'tap1'` | `'tap2'` | `'all'`)**, mỗi chế độ gồm **5 Ải** riêng biệt:
     - **📗 Chế độ Tập 1 (`tap1` - Học kì 1, Bài 1 → Bài 44):**
       - Ải 1: Ôn tập số đến 1.000, Bảng nhân chia 2–9 & Một phần mấy.
       - Ải 2: Điểm ở giữa, Trung điểm, Hình tròn, Góc vuông Ê-ke, Hình phẳng & Hình khối.
       - Ải 3: Nhân chia số có 2 chữ số, Chia có dư, Gấp/giảm một số lần & Bài toán 2 bước tính.
       - Ải 4: Đơn vị đo (`mm, g, ml, °C`) & Nhân chia số có 3 chữ số phạm vi 1.000.
       - Ải 5 (Boss Tập 1): Biểu thức số (có ngoặc & không ngoặc), So sánh số lớn gấp mấy lần số bé & Tổng hợp Học kì 1.
     - **📘 Chế độ Tập 2 (`tap2` - Học kì 2, Bài 45 → Bài 81):**
       - Ải 1: Các số đến 10.000, Làm tròn số, Chữ số La Mã (`I` – `XX`) & Cộng trừ phạm vi 10.000.
       - Ải 2: Chu vi hình tam giác, tứ giác, chữ nhật, vuông & Diện tích hình chữ nhật, hình vuông ($\text{cm}^2$).
       - Ải 3: Các số đến 100.000, Cộng/trừ/nhân/chia phạm vi 100.000 & Toán lời văn 2 bước tính (rút về đơn vị).
       - Ải 4: Xem đồng hồ đến từng phút, Tháng - năm, Tiền Việt Nam, Bảng số liệu thống kê & Xác suất sự kiện.
       - Ải 5 (Boss Tập 2): Tổng hợp toàn diện kiến thức Học kì 2.
     - **🌟 Chế độ Tổng hợp (`all` - Cả năm, Bài 1 → Bài 81):**
       - 5 Ải kết hợp toàn bộ kiến thức Tập 1 + Tập 2 (Ải 1 Số học, Ải 2 Hình học & Đo lường, Ải 3 Lời văn, Ải 4 Thống kê & Xác suất, Ải 5 Đại Boss Cuối năm).
   - Sinh tự động 4 đáp án hợp lý (3 đáp án nhiễu có chủ đích dựa trên lỗi sai thường gặp của học sinh lớp 3) hoặc chế độ điền số (`numpad`), kèm **Lời giải thích từng bước (`explanation`)** hiển thị mỗi khi bé trả lời.

4. **`GameManager` (Quản lý Trạng thái, Vật phẩm, Huy hiệu & Đồng bộ):**
   - Quản lý State: Tên hiệp sĩ, Nhân vật (`knight`/`mage`), Chế độ chơi (`story` 5 ải / `practice` tự chọn phân môn), Điểm số, Tim (HP), Chuỗi đúng (`streak`), Chế độ Cuồng Nộ (`isFury` khi `streak >= 3` nhân đôi điểm), Đếm ngược mỗi câu.
   - Hệ thống 3 Vật phẩm trợ giúp mỗi ải:
     - 🛡️ **Khiên Ánh Sáng:** Bảo vệ khỏi mất Tim trong 1 lần trả lời sai.
     - ⏳ **Đồng Hồ Cát:** Cộng thêm +15 giây suy nghĩ cho câu hiện tại.
     - 💡 **Gợi Ý Thông Thái (50/50):** Loại bỏ 2 đáp án sai (hoặc gợi ý chữ số đầu tiên với câu điền số).
   - Hệ thống **Huy hiệu Thành tựu (8 Badges)** & **Sổ Tay Bí Kíp Toán Lớp 3**.
   - Lưu trữ kép:
     - `localStorage` (`math_knight_save_v1`): Lưu tức thời hồ sơ, tiến độ mở khóa 5 ải, kỷ lục điểm, huy hiệu.
     - Đồng bộ Server (`fetch` tới WP REST API `math-knight/v1/scores` khi chạy trong WordPress).

5. **`UIController` & Custom Element `<math-knight-game>`:**
   - Định nghĩa Web Component `customElements.define('math-knight-game', MathKnightElement)` sử dụng `attachShadow({ mode: 'open' })` để cô lập 100% CSS khỏi mọi giao diện WordPress.
   - Quản lý chuyển đổi mượt mà giữa các màn hình: Màn hình chính (Nhập tên, chọn nhân vật, chọn chế độ), Bản đồ Rừng Pha Lê 5 ải, Sàn đấu Quái vật (Battle Arena), Sổ tay Bí kíp, Bảng xếp hạng & Huy hiệu, Modal Giải thích đáp án, và Màn hình Tổng kết / Chiến thắng.

---

## Thiết kế CSDL WordPress & REST API

- **Bảng dữ liệu:** `{prefix}math_knight_scores`
  - `id` (`BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`)
  - `player_name` (`VARCHAR(100) NOT NULL`)
  - `avatar` (`VARCHAR(20) DEFAULT 'knight'`)
  - `score` (`INT NOT NULL DEFAULT 0`)
  - `stages_cleared` (`TINYINT NOT NULL DEFAULT 0`)
  - `max_streak` (`INT NOT NULL DEFAULT 0`)
  - `accuracy` (`TINYINT NOT NULL DEFAULT 0`)
  - `badges` (`TEXT`) - JSON danh sách huy hiệu đạt được
  - `game_mode` (`VARCHAR(20) DEFAULT 'story'`)
  - `created_at` (`DATETIME DEFAULT CURRENT_TIMESTAMP`)
- **REST API Endpoints (`namespace: math-knight/v1`):**
  - `GET /wp-json/math-knight/v1/leaderboard`: Lấy Top 20 Hiệp Sĩ điểm cao nhất.
  - `POST /wp-json/math-knight/v1/scores`: Lưu kết quả trận đấu của học sinh (có sanitize, validate chống gian lận cơ bản).
  - `GET /wp-json/math-knight/v1/config`: Trả về cấu hình từ WP Admin (số câu/ải, thời gian/câu, số tim, bật/tắt đếm ngược, phân môn kích hoạt).

---

## Danh sách Công việc (Actionable Tasks) & Tiêu chí Kiểm thử

- [x] **Task 1: Hoàn thiện tài liệu kiến trúc & đặc tả Toán Lớp 3 trong `docs/`**
  - **Hành động:** Viết chi tiết `docs/architecture.md`, `docs/math-curriculum-g3.md`, cập nhật `docs/brainstorm-and-specs.md`, `docs/README.md`, `docs/changelog.md`.
  - **Verify:** Kiểm tra đầy đủ 5 file trong `docs/` đúng quy chuẩn `GEMINI.md`.

- [x] **Task 2: Xây dựng Core Game Engine & Custom Element (`assets/js/math-knight-bundle.js`)**
  - **Hành động:** Lập trình đầy đủ `SoundFX`, `VisualBuilder`, `MathEngine` (đủ 4 phân môn + Ải 5 Boss + giải thích chi tiết), `GameManager`, `UIController`, và đăng ký Custom Element `<math-knight-game>` với Shadow DOM.
  - **Verify:** Kiểm tra cú pháp JS (`node --check assets/js/math-knight-bundle.js`) không có lỗi cú pháp, đầy đủ tất cả dạng toán và SVG.

- [x] **Task 3: Xây dựng bản Single-file độc lập (`index.html`)**
  - **Hành động:** Đóng gói toàn bộ HTML5, CSS3, SVG, Web Audio API và `<math-knight-game>` vào một file `index.html` duy nhất có thể mở trực tiếp trên trình duyệt mà không cần internet hay server.
  - **Verify:** Mở `index.html` trên trình duyệt/kiểm tra DOM, đảm bảo vào được game, chọn nhân vật, mở bản đồ 5 ải, trả lời trắc nghiệm & numpad, vẽ đúng đồng hồ/hình học SVG, và lưu `localStorage`.

- [x] **Task 4: Xây dựng WordPress Plugin Backend (`hiep-si-toan-hoc.php` & `includes/*.php`)**
  - **Hành động:** Tạo file khởi chạy plugin `hiep-si-toan-hoc.php`, `includes/class-mk-activator.php` (tạo bảng DB), `includes/class-mk-rest-api.php` (REST API), `includes/class-mk-admin.php` (Trang cài đặt Admin + Bảng điểm + Xuất CSV), `includes/class-mk-shortcode-block.php` (Shortcode `[hiep_si_toan_hoc]` + Gutenberg Block).
  - **Verify:** Kiểm tra cú pháp PHP chuẩn WordPress Coding Standards, không có lỗi cú pháp trên tất cả các file `.php`.

- [x] **Task 5: Xây dựng Gutenberg Block Editor Script & Admin CSS (`assets/js/block-editor.js`, `assets/css/admin-style.css`)**
  - **Hành động:** Tạo script kéo thả block "Hiệp Sĩ Toán Học - Game Toán Lớp 3" trong Gutenberg Editor (tùy chỉnh chiều cao, chế độ mặc định, bật/tắt timer ngay trên block) và CSS trang quản trị.
  - **Verify:** Kiểm tra `node --check assets/js/block-editor.js` và tính đồng bộ tham số truyền vào `<math-knight-game>`.

- [x] **Task 6: Kiểm thử toàn diện & Cập nhật tài liệu nghiệm thu (`docs/changelog.md`, `docs/README.md`)**
  - **Hành động:** Chạy script kiểm thử tự động bộ sinh đề `MathEngine` (`scripts/verify_all.js`, test 500 câu hỏi ngẫu nhiên qua tất cả dạng toán đảm bảo 100% có đáp án đúng duy nhất, không có `NaN`/`undefined`, hình vẽ SVG hợp lệ) và cập nhật kết quả vào `docs/`.
  - **Verify:** Script test pass 100% (53/53 hạng mục kiểm thử, 500/500 câu hỏi hợp lệ) và `docs/changelog.md` ghi nhận hoàn tất.

---

## Tiêu chí Hoàn thành (Done When)
- [x] File `index.html` chạy độc lập 100% trên mọi trình duyệt hiện đại (Desktop, Tablet, Mobile) không phụ thuộc bất kỳ thư viện hay hình ảnh/âm thanh bên ngoài.
- [x] Plugin WordPress cài đặt và kích hoạt mượt mà, cung cấp cả Shortcode `[hiep_si_toan_hoc]`, Custom HTML Element `<math-knight-game>`, Gutenberg Block và trang quản trị Admin.
- [x] Ngân hàng câu hỏi Toán Lớp 3 bao phủ đầy đủ 4 mạch kiến thức GDPT 2018 với hình minh họa SVG tự động (đồng hồ, hình tròn, hình chữ nhật/vuông, góc vuông, trung điểm, bảng thống kê) và lời giải thích dễ hiểu.
- [x] Thư mục `docs/` được cập nhật đầy đủ 100% theo đúng quy tắc trong `GEMINI.md`.

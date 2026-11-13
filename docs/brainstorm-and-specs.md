# Brainstorm & Đặc tả Yêu cầu: Hiệp Sĩ Toán Học (Lớp 3 - GDPT 2018)

## 1. Tóm tắt Yêu cầu Gốc
- **Tên game:** Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê
- **Đối tượng:** Học sinh Lớp 3 (8 - 9 tuổi) tại Việt Nam.
- **Nội dung kiến thức (GDPT 2018):**
  1. **Số & Phép tính:** Bảng nhân/chia 2-9, phép chia có dư, cộng/trừ phạm vi 10.000 & 100.000, nhân/chia số có 3-4 chữ số với 1 chữ số, tính giá trị biểu thức có/không ngoặc, nhận biết chữ số La Mã (`I` - `XX`).
  2. **Hình học & Đo lường:** Góc vuông/không vuông (kèm Ê-ke), điểm ở giữa & trung điểm đoạn thẳng, tâm/bán kính/đường kính hình tròn, chu vi & diện tích hình vuông/chữ nhật, đổi đơn vị (`mm/cm/dm/m`, `g/kg`, `ml/l`), xem đồng hồ chính xác đến từng phút.
  3. **Giải toán có lời văn:** Gấp một số lên nhiều lần / giảm đi nhiều lần, bài toán giải bằng 2 bước tính (rút về đơn vị, hơn kém, tổng hai phần).
  4. **Thống kê & Xác suất:** Đọc và phân tích bảng số liệu, nhận biết khả năng xảy ra của một sự kiện (*Chắc chắn*, *Có thể*, *Không thể*).
- **Cơ chế Gameplay:**
  - Vượt 5 ải quái vật khôi phục 5 viên đá pha lê toán học.
  - Mỗi ải 5-15 câu hỏi (kết hợp trắc nghiệm 4 đáp án A, B, C, D và bàn phím số Numpad điền đáp án).
  - Đồng hồ 30s/câu (bật/tắt linh hoạt).
  - 3 Tim (HP), trả lời sai mất 1 tim + hiện bảng giải thích từng bước.
  - Chuỗi trả lời đúng liên tiếp (`Streak >= 3`) $\rightarrow$ Kích hoạt chế độ **"Cuồng Nộ" (`x2` điểm)** với hiệu ứng rực lửa.
  - Lưu tiến trình, High Score, Huy hiệu.
- **Yêu cầu kỹ thuật đặc biệt:**
  - Tự tạo 100% element đồ họa (SVG/CSS/Canvas cho nhân vật, quái vật, pha lê, đồng hồ, hình học trực quan) và âm thanh tổng hợp bằng **Web Audio API** không phụ thuộc bất kỳ file ảnh hay âm thanh bên ngoài.
  - Đóng gói thành **Plugin cài đặt trên WordPress** VÀ có sẵn bản **Single-file `index.html`** chạy độc lập.

---

## 2. Quyết định Thiết kế Kiến trúc (ADR - Architecture Decision Records) đã chốt với User

### ADR-01: Phương thức nhúng WordPress & Custom Element
- **Quyết định:** Triển khai đầy đủ cả 3 cơ chế:
  1. **Custom Web Component `<math-knight-game>`** sử dụng **Shadow DOM (`mode: 'open'`)** để cô lập 100% CSS, đảm bảo hiển thị hoàn hảo trên mọi giao diện WordPress mà không bị xung đột CSS.
  2. **Shortcode `[hiep_si_toan_hoc]`** có hỗ trợ truyền thuộc tính (`mode`, `questions`, `timer`, `time`, `lives`).
  3. **Gutenberg Block (`math-knight/game-block`)** để giáo viên/quản trị viên kéo thả trực tiếp trong trình soạn thảo WordPress.
  4. **File `index.html` độc lập (Single-file):** Chạy trực tiếp trên trình duyệt không cần cài đặt server.

### ADR-02: Đồ họa SVG/Canvas & Mở rộng Tính năng Sư phạm
- **Quyết định:**
  - Cho phép học sinh chọn 1 trong 2 nhân vật SVG tự vẽ: **Bé Trai — Hiệp Sĩ Kiếm Ánh Sáng (`knight`)** hoặc **Bé Gái — Pháp Sư Pha Lê (`mage`)**.
  - Thiết kế **Bản đồ hành trình Rừng Pha Lê 5 ải (World Map)** với 5 Boss Quái vật và 5 Viên Đá Pha Lê:
    - **Ải 1 (Thung Lũng Số Học):** Số & Phép tính
    - **Ải 2 (Đầm Lầy Hình Học):** Hình học & Đo lường
    - **Ải 3 (Mê Cung Lời Văn):** Giải toán có lời văn
    - **Ải 4 (Đỉnh Núi Thống Kê):** Thống kê & Xác suất
    - **Ải 5 (Lâu Đài Hắc Ám - Boss Tổng Hợp):** Tổng hợp 4 phân môn với độ khó tăng dần.
  - Bổ sung **3 Vật phẩm trợ giúp (Power-ups)** mỗi ải:
    - 🛡️ **Khiên Ánh Sáng:** Bảo vệ không mất Tim 1 lần trả lời sai.
    - ⏳ **Đồng Hồ Cát:** Cộng thêm +15 giây suy nghĩ.
    - 💡 **Gợi Ý Thông Thái (50/50):** Loại bỏ 2 phương án sai hoặc gợi ý chữ số đầu tiên.
  - Bổ sung **Sổ Tay Bí Kíp Toán Lớp 3** ngay trong game (tóm tắt bảng công thức chu vi, diện tích, đổi đơn vị, chữ số La Mã, quy tắc tính biểu thức) và **Chế độ Luyện Tập Tự Do** theo từng chuyên đề.

### ADR-03: Quản trị WordPress & Lưu trữ Kép (`localStorage` + MySQL REST API)
- **Quyết định:**
  - **Client-side (`localStorage`):** Lưu tức thời tên học sinh, nhân vật, tiến trình mở khóa ải, điểm cao cá nhân và 8 huy hiệu thành tựu.
  - **Server-side (WordPress MySQL + REST API):** Tạo bảng `{prefix}math_knight_scores` và REST API `math-knight/v1` để lưu Bảng Xếp Hạng Top Hiệp Sĩ toàn trường, kèm trang cài đặt **WP Admin (`Cài đặt -> Hiệp Sĩ Toán Học`)** cho phép giáo viên tùy chỉnh thông số và xuất bảng điểm CSV.

### ADR-04: Nâng cấp Trải nghiệm Toàn màn hình, Thanh Máu Trực Quan & Tâm lý Sư phạm Lớp 3 (`/game-development`)
- **Quyết định:**
  - **Chế độ Toàn màn hình (`Fullscreen Mode`):** Có mặt trên thanh Topbar, màn hình bắt đầu (`START`) và phím tắt `F`, tự động mở rộng Canvas pháo hoa theo kích thước màn hình.
  - **Thanh máu Boss & Cơ chế Không phạt % khi mất máu:**
    - Khi bé trả lời sai và mất 1 Tim ❤️: Chỉ giảm 1 Tim (`💔 -1 Tim!`), **không trừ điểm** và **không trừ % thưởng/độ hoàn thành** để khích lệ tâm lý học sinh tiểu học.
  - **Hỗ trợ đọc đề tiếng Việt (`🔊 Đọc đề`) & Adaptive Audio:** Tích hợp giọng đọc `vi-VN` (`window.speechSynthesis`), tự động tạm dừng đếm giờ khi ẩn tab (`visibilitychange`), và tăng cao độ âm thanh khen thưởng theo chuỗi `streak`.

### ADR-05: Tái thiết kế Giao diện Chuẩn 16:9 Không Cuộn Dọc, Bảng Giấy Da Cổ Điển & Lộ trình 5 Ải (8+1 Câu Boss)
- **Quyết định:**
  - **Bố cục 16:9 gọn trong 1 khung nhìn (`.mk-shell`):** Thiết kế tỷ lệ `16:9` (`max-width: 1120px; aspect-ratio: 16 / 9; min-height: 580px; max-height: 92vh;`) chia làm 3 tầng cố định vừa khít trong 1 màn hình laptop/iPad mà không bao giờ phải cuộn trang khi đang chiến đấu:
    1. **Thanh HUD trên cùng (`.mk-hud-top`, ~54px):** Nút `🗺️ Bản đồ`, Tên Ải hiện tại, Thanh tiến độ `8 đốt Pha Lê + 1 đốt Boss cuối ải (9 đốt)`, 3 Tim HP (`❤️❤️❤️`), Bộ đếm Combo (`🔥 Combo x2` khi `streak >= 3`), Điểm số, nút Loa (`🔊`/`🔇`) và Toàn màn hình (`⛶`).
    2. **Sân khấu Chiến đấu 2D Casual (`.mk-battle-stage`, ~42% chiều cao):** Phông nền cảnh vật 2D nhiều lớp SVG riêng cho từng ải với mặt đất phẳng ở dưới; Hiệp sĩ đứng bên trái, Quái vật đứng bên phải kèm **1 thanh máu đỏ chia 9 đốt câu hỏi còn lại** (`9/9 ❤️` giảm xuống `8/9 ❤️` khi trúng đòn — xóa bỏ hoàn toàn dòng chữ `"Năng lượng Boss: 100%"`). Khi trả lời đúng, Hiệp sĩ lao tới chém kiếm pha lê (`mkHeroLunge` + `mkSlashArc`), Quái vật chớp đỏ rung lắc (`mkMonsterHit`). Khi trả lời sai, Quái vật lao sang phản công (`mkMonsterAttack`).
    3. **Bảng Câu hỏi Giấy Da Cổ Điển (`.mk-parchment-board`, ~54% chiều cao):** `background: #FFF8E7; border: 4px solid #4A2E1B; border-radius: 20px; box-shadow: 0 6px 0 #4A2E1B, inset 0 2px 0 rgba(255,255,255,0.8);`. Nếu câu hỏi có `svgVisual`, tự động chia bố cục **2 cột ngang** (Cột trái: SVG trực quan; Cột phải: Nội dung câu hỏi + 4 nút đáp án 3D `choices[4]`), loại bỏ bàn phím Numpad 10 nút rườm rà trong màn hình chiến đấu.
  - **Lộ trình 5 Ải & 5 Boss chuẩn (8 câu thường + 1 câu Boss = 9 câu/ải):**
    - **Ải 1: Khu Rừng Khởi Đầu** — Boss: **Slime Xanh Bạc Hà** (`#34D399`)
    - **Ải 2: Thung Lũng Cầu Vồng** — Boss: **Goblin Bàn Tính** (`#F59E0B`)
    - **Ải 3: Hang Động Pha Lê** — Boss: **Người Đá Golem Tím** (`#8B5CF6`)
    - **Ải 4: Thác Nước Tri Thức** — Boss: **Pháp Sư Cú Cổ Đại** (`#0EA5E9`)
    - **Ải 5: Đỉnh Núi Pha Lê** — Boss: **Rồng Pha Lê Sapphire** (`#2563EB`)
    - Câu thứ 9 có nhãn **`👑 CÂU HỎI QUYẾT ĐỊNH CỦA BOSS (X2 ĐIỂM)`** và thưởng gấp đôi điểm!
  - **Chuẩn hóa `MathEngine` & `localStorage` (`stageStars`):**
    - Object câu hỏi trả về `{ category, topicName, sgkCite, sgkAssetKey, questionText, question, svgVisual, choices, options, correctIndex, correctAnswer, answer, explanation, isBossQuestion }`.
    - Lưu `stageStars` (1–3 sao theo số Tim còn lại khi qua ải: 3 Tim = 3 sao ⭐⭐⭐, 2 Tim = 2 sao ⭐⭐, 1 Tim = 1 sao ⭐).

---

## 5. Brainstorm (2026-11-13): Tái cấu trúc Giao diện WP Admin (Chuẩn Techshare VN) & Tự động Cập nhật từ GitHub Release ZIP

### 5.1. Vấn đề hiện tại trên WP Admin (`media_1794541526642_e60564fa.jpg`)
1. **Nhồi nhét quá nhiều khối trong 1 Tab (`Hiệp Sĩ Toán Học`):** Đặt cả Hero Banner tím/xanh khổng lồ + 4 thẻ thống kê + 2 cột (Form cấu hình + 6 hộp Shortcode) + Bảng xếp hạng 10 cột trong cùng một khung `.mk-tab-panel` làm giao diện bị rối, cột nhãn `th` bị bó hẹp gãy dòng và thiếu tính khoa học so với chuẩn plugin **Techshare VN** (`media_1794540878630_d392676b.jpg`).
2. **Nhu cầu quản lý phiên bản & cập nhật tự động qua GitHub Release:** Tạo Public GitHub Repository (tài khoản `vitinhthanhphat-png` đã đăng nhập sẵn trên `gh` CLI) và tích hợp bộ **GitHub Release Updater (`MK_GitHub_Updater`)** ngay trong WordPress để kiểm tra và cập nhật tự động **chỉ từ file `.zip` đính kèm trong GitHub Releases** (`hiep-si-toan-hoc-plugin.zip`).

### 5.2. Các Phương Án Thiết Kế Giao Diện WP Admin & GitHub Updater

- **Phương án A (Khuyên dùng — Chuẩn Hệ sinh thái Techshare VN 4 Tabs Tách Biệt, Gọn Sạch):**
  - Loại bỏ khối Hero Banner tím cồng kềnh bên trong tab, dùng hệ thống **4 Tab Ngang Chuẩn Techshare VN**:
    1. **`⚙️ Cài Đặt Trò Chơi`**: Bố cục 1 cột phẳng, rộng rãi (chia nhóm rõ ràng bằng lưới 2 cột cân đối cho các ô chọn thông số + 4 ô tích chọn phân môn ngang hàng), nút Lưu nổi bật.
    2. **`🏆 Bảng Vàng & Thống Kê`**: Dành trọn chiều ngang cho 4 thẻ KPI thống kê + Bảng xếp hạng học sinh + Nút Xuất Excel/CSV & Đặt lại bảng điểm.
    3. **`🔄 Cập Nhật (GitHub Release)`**: Hiển thị trạng thái phiên bản hiện tại (`v1.0`) so với bản Release mới nhất trên GitHub, nút **"Kiểm tra bản cập nhật ngay"**, hướng dẫn/lệnh phát hành Release mới.
    4. **`ℹ️ Thông tin Tác Giả`**: Card xanh mint **Techshare VN** (`TS`, `Trần Vĩ Thành`, `techsharevn.com`, `0949 897 293`, `thanh.web1001@gmail.com`) + Khung **Shortcode** nền tối kèm nút Copy 1-click.
- **Phương án B (3 Tabs Gộp Cài đặt & Cập nhật):**
  - Gồm 3 Tab: `⚙️ Cài Đặt & Cập Nhật`, `🏆 Bảng Vàng Học Sinh`, `ℹ️ Thông tin Tác Giả`.
- **Phương án C (Giữ 2 Tabs nhưng xếp chồng 1 cột dọc):**
  - Giữ 2 Tab nhưng bỏ chia 2 cột trái/phải. Nhược điểm: Tab 1 vẫn quá dài khi bảng xếp hạng có 50 học sinh.


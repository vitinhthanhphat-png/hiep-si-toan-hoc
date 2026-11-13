# Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê — Phiên bản v1.0 (WordPress Plugin & Single-File Web Game)

Dự án Web Game Giáo dục (EdTech) môn **Toán Lớp 3** (Phiên bản khởi đầu **`v1.0`**) bám sát **100% bộ sách giáo khoa "Kết nối tri thức với cuộc sống"** (Tập 1 & Tập 2 - NXB Giáo dục Việt Nam, Chương trình GDPT 2018), hỗ trợ **3 chế độ hành trình (`tap1`: 5 Ải Tập 1 - Học kì 1, `tap2`: 5 Ải Tập 2 - Học kì 2, và `all`: 5 Ải Tổng hợp Cả năm)**, bao gồm cả **bản Single-file `index.html` độc lập** và **WordPress Plugin hoàn chỉnh (`hiep-si-toan-hoc.php`, `v1.0`)** tích hợp Custom Web Component `<math-knight-game>` (Shadow DOM), Shortcode `[hiep_si_toan_hoc book="tap1|tap2|all"]`, Gutenberg Block, đồ họa SVG/Canvas kết hợp **bộ 16 hình ảnh minh họa cắt gốc từ SGK PDF (`assets/images/sgk/`)** và âm thanh tổng hợp bằng Web Audio API.

## Danh mục tài liệu (`docs/`)
- [Nhật ký thay đổi (Changelog)](./changelog.md)
- [Brainstorm, Quyết định Thiết kế (ADR) & Đặc tả yêu cầu](./brainstorm-and-specs.md)
- [Kiến trúc Hệ thống, Custom Element & CSDL WordPress](./architecture.md)
- [Đặc tả Ma trận Câu hỏi Toán Lớp 3 (Bộ Kết Nối Tri Thức)](./math-curriculum-g3.md)
- [SGK Toán 3 Tập 1 - Kết Nối Tri Thức Với Cuộc Sống (Markdown hóa từ PDF)](./sgk-toan-3-tap-1.md)
- [SGK Toán 3 Tập 2 - Kết Nối Tri Thức Với Cuộc Sống (Markdown hóa từ PDF)](./sgk-toan-3-tap-2.md)
- [Kế hoạch Triển khai Dự án Tổng thể](../hiep-si-toan-hoc-plan.md)

## Tài nguyên & Công cụ Kiểm thử
- **PDF gốc:** `docs/pdf/03-sgk-toan-3-tap-mot.pdf` (126 trang) & `docs/pdf/03-sgk-toan-3-tap-hai.pdf` (130 trang).
- **Script trích xuất học liệu:** [`scripts/extract_sgk_kntt.py`](../scripts/extract_sgk_kntt.py).
- **Script đóng gói Single-file HTML:** [`scripts/build_single_html.py`](../scripts/build_single_html.py).
- **Script đóng gói WordPress Plugin (.zip):** [`scripts/build_wp_zip.py`](../scripts/build_wp_zip.py) tạo file [`hiep-si-toan-hoc-plugin.zip`](../hiep-si-toan-hoc-plugin.zip) (~1.91 MB, loại bỏ thư mục nặng `docs/pdf/`, sẵn sàng upload trực tiếp vào WordPress Admin hoặc đính kèm lên GitHub Releases).
- **Script phát hành tự động lên GitHub Releases:** [`scripts/publish_release.py`](../scripts/publish_release.py) kết hợp cùng GitHub Actions [`.github/workflows/release.yml`](../.github/workflows/release.yml) giúp tự động đóng gói và phát hành `hiep-si-toan-hoc-plugin.zip` lên kho lưu trữ công khai **`https://github.com/vitinhthanhphat-png/hiep-si-toan-hoc`** để các website WordPress tự động nhận bản cập nhật mới qua `includes/class-mk-github-updater.php`.
- **Script kiểm thử tự động toàn diện:** [`scripts/verify_all.js`](../scripts/verify_all.js) (Đạt **62/62 PASS** — kiểm tra `php -l`, `node --check`, bảo mật SQLi/XSS/CSRF, kiểm tra `STAGES_BY_BOOK` 15 ải, sinh thử **750 câu hỏi** qua 3 chế độ sách `tap1`/`tap2`/`all` × 5 ải, kiểm tra SVG động & bản Single-file `index.html`).
- **Hình ảnh cắt gốc từ SGK:** [`assets/images/sgk/`](../assets/images/sgk/) (16 hình minh họa + `manifest.json`) và [`assets/js/sgk-assets.js`](../assets/js/sgk-assets.js) (`window.MK_SGK_ASSETS` chứa `dataUri` nhúng trực tiếp cho cả Single-file `index.html` và WordPress Plugin).

## Trạng thái hiện tại
- **Phiên bản chính thức:** **`v1.0`** (`MK_PLUGIN_VERSION = '1.0'`, `MK_DB_VERSION = '1.0'`, `MK_VERSION = '1.0'`).
- **Giai đoạn:** **HOÀN THÀNH, KIỂM TOÁN BẢO MẬT (OWASP Top 10:2025) & NGHIỆM THU 100%** cho cả **WordPress Plugin (`hiep-si-toan-hoc.php` v1.0)**, **Core Frontend Engine (`assets/js/math-knight-bundle.js` v1.0)** và **Bản Single-file độc lập (`index.html` v1.0)**.
- **Giao diện 16:9 Không Cuộn Dọc & Sân Khấu 2D Casual:**
  - Khung `.mk-shell` tỷ lệ `16:9` chia 3 tầng cố định vừa khít trong 1 khung nhìn: Thanh HUD trên cùng (`.mk-hud-top` với thanh tiến độ `8 đốt Pha Lê + 1 đốt Boss = 9 đốt`), Sân khấu Chiến đấu 2D Casual (`.mk-battle-stage` với thanh máu đỏ chia 9 đốt câu hỏi còn lại), và Bảng Câu Hỏi Giấy Da Cổ Điển (`.mk-parchment-board` `#FFF8E7` viền `#4A2E1B` bố cục 2 cột ngang khi có hình SVG + 4 nút đáp án 3D `choices[4]`).
  - Lộ trình 5 Ải & 5 Boss (**Slime Xanh Bạc Hà**, **Goblin Bàn Tính**, **Người Đá Golem Tím**, **Pháp Sư Cú Cổ Đại**, **Rồng Pha Lê Sapphire**), lưu tiến trình `stageStars` (1–3 sao theo số Tim còn lại). Toàn bộ nội dung, thuật ngữ, nhân vật (**Rô-bốt, Việt, Nam, Mai, Mi**) và 16 hình ảnh minh họa bám sát 100% bộ SGK Toán 3 **Kết nối tri thức với cuộc sống** (Tập 1 & Tập 2 - GDPT 2018).

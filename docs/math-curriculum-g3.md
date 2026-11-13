# Đặc tả Ma trận Câu hỏi Toán Lớp 3 (Bộ Sách Kết Nối Tri Thức Với Cuộc Sống - GDPT 2018)

> **Định hướng học liệu bắt buộc:** Toàn bộ câu hỏi, thuật ngữ, tên nhân vật (**Rô-bốt, Việt, Nam, Mai, Mi**), công thức đóng khung và hình ảnh minh họa trong dự án **chỉ tập trung 100% vào bộ SGK Toán 3 "Kết nối tri thức với cuộc sống"** (Tập 1 & Tập 2 - NXB Giáo dục Việt Nam).
> - Xem chi tiết Tập 1 (Chủ đề 1 → 7, Bài 1 → 44): [`docs/sgk-toan-3-tap-1.md`](./sgk-toan-3-tap-1.md)
> - Xem chi tiết Tập 2 (Chủ đề 8 → 16, Bài 45 → 81): [`docs/sgk-toan-3-tap-2.md`](./sgk-toan-3-tap-2.md)
> - Bộ 16 hình ảnh cắt gốc từ SGK PDF: [`assets/images/sgk/manifest.json`](../assets/images/sgk/manifest.json) & [`assets/js/sgk-assets.js`](../assets/js/sgk-assets.js)

Tài liệu này định nghĩa chi tiết toàn bộ ngân hàng dạng toán, thuật toán sinh đề động (`MathEngine`), cách tạo phương án nhiễu thông minh (Distractors), hình vẽ trực quan SVG + hình cắt SGK đi kèm (`visualData`, `sgkAssetId`), và mẫu lời giải thích từng bước (`explanation`) dành cho học sinh Lớp 3 (8 - 9 tuổi).

---

## 1. Cấu trúc Đối tượng Câu hỏi Chuẩn (`QuestionObject`)

Mỗi câu hỏi do `MathEngine` sinh ra tuân thủ cấu trúc chuẩn (hỗ trợ đồng thời chuẩn mới lẫn tương thích ngược):

```javascript
{
  category: "num",                 // 'num' | 'geo' | 'word' | 'stat'
  topicName: "Phép chia hết, phép chia có dư",
  sgkCite: "SGK Toán 3 Tập 1 - Bài 25, trang 72",
  sgkAssetKey: null,               // Khóa hình cắt SGK (nếu có)
  questionText: "Thực hiện phép chia có dư: 47 : 5 được thương và số dư là bao nhiêu?",
  question: "Thực hiện phép chia có dư: 47 : 5 được thương và số dư là bao nhiêu?",
  svgVisual: "",                   // Chuỗi HTML/SVG minh họa trực quan (đồng hồ, hình học, thước đo, bảng số liệu...)
  choices: [                       // Mảng 4 đáp án [A, B, C, D]
    "9 (dư 2)",
    "8 (dư 7)",
    "9 (dư 3)",
    "8 (dư 2)"
  ],
  options: [                       // Alias = choices
    "9 (dư 2)",
    "8 (dư 7)",
    "9 (dư 3)",
    "8 (dư 2)"
  ],
  correctIndex: 0,                 // Chỉ số đáp án đúng (0..3)
  correctAnswer: "9 (dư 2)",       // Giá trị đáp án đúng = choices[correctIndex]
  answer: "9 (dư 2)",              // Alias = correctAnswer
  explanation: "Vì 5 × 9 = 45 và 47 - 45 = 2 (bé hơn 5), nên 47 : 5 = 9 (dư 2). [SGK Kết nối tri thức - Bài 25, trang 72 Tập 1]",
  isBossQuestion: false            // true đối với câu thứ 9 (Câu hỏi quyết định của Boss cuối ải - x2 điểm)
}
```

### Kiến trúc 3 Chế độ Bộ sách × 5 Ải (`tap1`, `tap2`, `all`)

Để bám sát lộ trình giảng dạy thực tế trên lớp theo từng Học kì của bộ sách **Toán 3 - Kết nối tri thức với cuộc sống**, hệ thống chia chiến dịch thành **3 Chế độ Bộ sách (Book Modes)**, mỗi chế độ gồm **5 Ải chuẩn SGK**:

#### 📗 Chế độ 1 (`book="tap1"`): 5 Ải SGK Toán 3 Tập 1 (Học kì 1 — Chủ đề 1 → 7, Bài 1 → Bài 44)
1. **Ải 1 (Tập 1): Thung Lũng Bảng Nhân Chia** *(Chủ đề 1 & 2: Bài 1 → 14)*
   - Nội dung: Ôn tập các số đến 1.000, tìm thành phần chưa biết trong phép cộng/trừ/nhân/chia, bảng nhân và bảng chia 2, 3, 4, 5, 6, 7, 8, 9, nhận biết *"Một phần mấy"* ($\frac{1}{2}, \frac{1}{3}, \dots, \frac{1}{9}$).
2. **Ải 2 (Tập 1): Đầm Lầy Hình Học Học Kì 1** *(Chủ đề 3: Bài 15 → 20)*
   - Nội dung: Điểm ở giữa, trung điểm của đoạn thẳng (`midpoint_b16`), hình tròn: tâm, bán kính, đường kính (`circle_b17`), góc vuông & góc không vuông với thước Ê-ke (`angle_eke_b18`), hình tam giác, hình tứ giác, hình chữ nhật, hình vuông, khối lập phương và khối hộp chữ nhật.
3. **Ải 3 (Tập 1): Mê Cung Nhân Chia Phạm Vi 100 & Toán 2 Bước** *(Chủ đề 4: Bài 21 → 29)*
   - Nội dung: Nhân số có hai chữ số với số có một chữ số, gấp một số lên một số lần (`mult_fold_b24`), phép chia hết & phép chia có dư (`Bài 25`), chia số có hai chữ số cho số có một chữ số, giảm một số đi một số lần, bài toán giải bằng hai bước tính (`two_step_b28`).
4. **Ải 4 (Tập 1): Đỉnh Núi Đo Lường & Phép Tính Phạm Vi 1.000** *(Chủ đề 5 & 6: Bài 30 → 37)*
   - Nội dung: Đơn vị đo độ dài Mi-li-mét (`mm_ruler_b30`), khối lượng Gam (`g`), dung tích Mi-li-lít (`ml`), nhiệt độ (`°C`), nhân/chia số có ba chữ số với/cho số có một chữ số.
5. **Ải 5 (Tập 1 - Boss Cuối HK1): Lâu Đài Biểu Thức & Tổng Hợp Tập 1** *(Chủ đề 6 & 7: Bài 38 → 44)*
   - Nội dung: Biểu thức số và quy tắc tính giá trị biểu thức có dấu ngoặc / không có dấu ngoặc (`expression_b38`), so sánh số lớn gấp mấy lần số bé, tổng hợp toàn bộ kiến thức Học kì 1.

#### 📘 Chế độ 2 (`book="tap2"`): 5 Ải SGK Toán 3 Tập 2 (Học kì 2 — Chủ đề 8 → 16, Bài 45 → Bài 81)
1. **Ải 1 (Tập 2): Thung Lũng Số Đến 10.000 & Chữ Số La Mã** *(Chủ đề 8 & 9: Bài 45 → 49)*
   - Nội dung: Các số có bốn chữ số, số 10.000, so sánh số, làm tròn số đến hàng chục/hàng trăm, nhận biết chữ số La Mã từ `I` đến `XX` (`roman_clock_b47`), cộng/trừ các số trong phạm vi 10.000.
2. **Ải 2 (Tập 2): Đầm Lầy Chu Vi & Diện Tích Hình Phẳng** *(Chủ đề 10: Bài 50 → 55)*
   - Nội dung: Chu vi hình tam giác, hình tứ giác, hình chữ nhật, hình vuông (`perimeter_b50`), đơn vị đo diện tích Xăng-ti-mét vuông ($\text{cm}^2$), tính diện tích hình chữ nhật và diện tích hình vuông (`area_grid_b52`).
3. **Ải 3 (Tập 2): Mê Cung Số Đến 100.000 & Toán Lời Văn** *(Chủ đề 11, 12, 14: Bài 56 → 64, 70 → 72)*
   - Nội dung: Nhân/chia số có bốn chữ số với/cho số có một chữ số, các số có năm chữ số, số 100.000, làm tròn số đến hàng nghìn/hàng chục nghìn, cộng/trừ/nhân/chia trong phạm vi 100.000, bài toán giải bằng hai bước tính (bao gồm dạng rút về đơn vị).
4. **Ải 4 (Tập 2): Đỉnh Núi Thời Gian, Tiền Việt Nam & Thống Kê Xác Suất** *(Chủ đề 13 & 15: Bài 65 → 69, 73 → 75)*
   - Nội dung: Xem đồng hồ chính xác đến từng phút (`clock_read_b66`), tháng - năm, Tiền Việt Nam (`vn_money_b68`), thu thập - phân loại - đọc bảng số liệu thống kê (`stats_basketball_b73`), khả năng xảy ra của một sự kiện: *Chắc chắn / Có thể / Không thể* (`prob_balls_coins_b74`).
5. **Ải 5 (Tập 2 - Boss Cuối HK2): Lâu Đài Ánh Sáng Tổng Hợp Tập 2** *(Chủ đề 16: Bài 76 → 81)*
   - Nội dung: Tổng hợp toàn diện các mạch kiến thức Học kì 2 (Số học đến 100.000, Chu vi & Diện tích, Thời gian & Tiền Việt Nam, Thống kê & Xác suất).

#### 🌟 Chế độ 3 (`book="all"`): 5 Ải Tổng Hợp Cả Năm (Kết Hợp Tập 1 + Tập 2 — Bài 1 → Bài 81)
- **Ải 1 (Tổng hợp): Thung Lũng Số Học** — Boss: **Slime Hỗn Loạn Số Học** — Toàn bộ dạng toán Số & Phép tính của cả Tập 1 và Tập 2 (Bảng nhân chia 2–9, chia có dư, biểu thức số, số La Mã, cộng/trừ/nhân/chia phạm vi 1.000, 10.000 và 100.000).
- **Ải 2 (Tổng hợp): Đầm Lầy Hình Học & Đo Lường** — Boss: **Khổng Lồ Đá Góc Cạnh** — Toàn bộ Hình học & Đo lường của cả Tập 1 và Tập 2 (Trung điểm, hình tròn, góc vuông Ê-ke, đổi đơn vị `mm/cm/dm/m, g/kg, ml/l`, xem đồng hồ từng phút, Tiền Việt Nam, Chu vi & Diện tích hình vuông/chữ nhật).
- **Ải 3 (Tổng hợp): Mê Cung Lời Văn** — Boss: **Phù Thủy Sương Mù Bí Ẩn** — Bài toán gấp/giảm một số lần, so sánh số lớn gấp mấy lần số bé, bài toán giải bằng 2 bước tính gắn với các nhân vật Rô-bốt, Việt, Nam, Mai, Mi.
- **Ải 4 (Tổng hợp): Đỉnh Núi Thống Kê & Xác Suất** — Boss: **Rồng Gió Bão Tố Thống Kê** — Bảng số liệu thống kê và nhận biết khả năng xảy ra của sự kiện (*Chắc chắn / Có thể / Không thể*).
- **Ải 5 (Tổng hợp - Đại Boss Cuối Năm): Lâu Đài Hắc Ám** — Boss: **Chúa Tể Bóng Tối Hỗn Mang** — Tổng hợp ngẫu nhiên toàn bộ kiến thức nâng cao của cả Tập 1 & Tập 2.

---

## 2. Chi tiết 4 Phân môn & 5 Ải trong Game

### Ải 1: Thung Lũng Số Học — Phân môn Số & Phép tính (`category: 'num'`)

| Mã dạng toán (`subType`) | Nội dung kiến thức (GDPT 2018) | Công thức sinh số ngẫu nhiên | Hình thức (`inputType`) | Quy tắc sinh đáp án nhiễu & Giải thích |
| :--- | :--- | :--- | :--- | :--- |
| `mul_table` | Bảng nhân, bảng chia từ 2 đến 9 | Chọn $a \in [2, 9], b \in [2, 9]$. Sinh câu hỏi $a \times b = ?$ hoặc $(a \times b) : a = ?$, hoặc tìm thành phần chưa biết $x \times a = c$. | `mcq` & `numpad` | Nhiễu: $a \times (b \pm 1)$, $(a \pm 1) \times b$, $a + b$. Giải thích nhắc lại phép nhân/chia tương ứng trong bảng. |
| `div_remainder` | Phép chia hết và phép chia có dư | Chọn số chia $d \in [3, 9]$, thương $q \in [3, 9]$, số dư $r \in [1, d-1]$. Số bị chia $N = d \times q + r$. Hỏi kết quả $N : d$ hoặc hỏi riêng **số dư** của phép chia. | `mcq` & `numpad` | Nhiễu: $(q-1)$ dư $(r+d)$, $q$ dư $(r \pm 1)$, hoặc nhầm thương với số dư. Giải thích rõ: Số dư luôn nhỏ hơn số chia ($r < d$). |
| `add_sub_100k` | Cộng, trừ các số trong phạm vi 10.000 và 100.000 (có nhớ không quá 2 lượt) | Chọn $A, B \in [1200, 85000]$. Đảm bảo $A > B$ khi trừ. Tạo các số có nhớ ở hàng chục/trăm hoặc hàng nghìn. | `mcq` & `numpad` | Nhiễu: Quên nhớ ($\pm 10, \pm 100, \pm 1000$) hoặc cộng/trừ nhầm hàng đơn vị. Giải thích đặt tính rồi tính từ phải sang trái. |
| `mul_div_multi` | Nhân, chia số có 3 - 4 chữ số với số có 1 chữ số | - Nhân: $A \in [105, 2400], k \in [2, 8] \rightarrow A \times k$.<br>- Chia: Chọn thương $Q \in [112, 1250], k \in [2, 8] \rightarrow (Q \times k) : k$. | `mcq` & `numpad` | Nhiễu: Sai chữ số hàng trăm hoặc hàng chục ($\pm k \times 10$, $\pm k \times 100$). Giải thích tách từng lượt nhân/chia. |
| `expression_order` | Tính giá trị biểu thức (có ngoặc và không có ngoặc) | 3 mẫu:<br>1. $a + b \times c$ hoặc $a - b : c$<br>2. $(a + b) \times c$ hoặc $(a - b) : c$<br>3. $a \times b + c$ | `mcq` & `numpad` | Nhiễu kinh điển: Tính từ trái sang phải quên quy tắc "nhân chia trước, cộng trừ sau" hoặc quên tính trong ngoặc trước. Giải thích nêu rõ Bước 1 và Bước 2. |
| `roman_numerals` | Nhận biết chữ số La Mã từ `I` đến `XX` (1 đến 20) | Chuyển đổi 2 chiều giữa số tự nhiên $n \in [1, 20]$ và số La Mã (`I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII, XIV, XV, XIX, XX`), hoặc phép cộng/trừ hai số La Mã đơn giản. | `mcq` | Nhiễu: Nhầm `IV` (4) với `VI` (6), `IX` (9) với `XI` (11), `XIV` (14) với `XVI` (16). Giải thích quy tắc ghép chữ số La Mã (`I=1, V=5, X=10`). |

---

### Ải 2: Đầm Lầy Hình Học — Phân môn Hình học & Đo lường (`category: 'geo'`)

Mọi câu hỏi ở Ải 2 đều đi kèm **Hình vẽ SVG trực quan (`visualData`)** do `VisualBuilder` tự động dựng:

| Mã dạng toán (`subType`) | Nội dung kiến thức (GDPT 2018) | Hình minh họa SVG (`visual.type`) | Công thức sinh đề & Giải thích |
| :--- | :--- | :--- | :--- |
| `angle_check` | Nhận biết góc vuông, góc không vuông bằng Ê-ke | `angle`: Vẽ hai tia chung gốc $O$ tạo góc $90^\circ$ (góc vuông), $<90^\circ$ (góc nhọn - không vuông), hoặc $>90^\circ$ (góc tù - không vuông) kèm hình chiếc thước Ê-ke áp vào đỉnh. | Hỏi góc trên hình là góc vuông hay góc không vuông, hoặc đếm số góc vuông trong hình. Giải thích cách đặt đỉnh góc vuông của Ê-ke trùng với đỉnh góc. |
| `midpoint_segment` | Điểm ở giữa, Trung điểm của đoạn thẳng | `midpoint`: Vẽ đoạn thẳng $AB$ với điểm $M$ nằm chính giữa (hoặc lệch) kèm nhãn độ dài $AM, MB$ hoặc $AB$. | Cho $AM = a\text{ cm}$, $M$ là trung điểm của $AB$, tính $AB = 2a\text{ cm}$; hoặc cho $AB = 2a\text{ cm}$, tìm $AM = a\text{ cm}$. |
| `circle_radius_diameter` | Hình tròn: Tâm, bán kính, đường kính | `circle`: Vẽ hình tròn tâm $O$, đường kính $AB$ đi qua tâm $O$, và bán kính $OM$ kèm số đo. | Áp dụng tính chất: Trong một hình tròn, **đường kính gấp 2 lần bán kính** ($d = 2 \times r \Leftrightarrow r = d : 2$). Hỗ trợ cả `mcq` và `numpad`. |
| `rect_square_peri_area` | Tính Chu vi và Diện tích hình chữ nhật, hình vuông | `rectangle` hoặc `square`: Vẽ hình có tô màu nhẹ, ghi rõ số đo chiều dài $a$, chiều rộng $b$ (hoặc cạnh $a$) bằng $\text{cm}$ hoặc $\text{dm}$. | - Chu vi HCN: $(a + b) \times 2$<br>- Diện tích HCN: $a \times b$<br>- Chu vi HV: $a \times 4$<br>- Diện tích HV: $a \times a$<br>Nhiễu: Nhầm công thức chu vi sang diện tích hoặc quên nhân 2 ở chu vi HCN. |
| `unit_conversion` | Đổi đơn vị đo độ dài (`mm, cm, dm, m`), khối lượng (`g, kg`), dung tích (`ml, l`), thời gian | `unit_card`: Thẻ cân/bình đong/thước đo trực quan bằng SVG. | Các cặp đổi chuẩn Lớp 3: $1\text{ m} = 10\text{ dm} = 100\text{ cm} = 1000\text{ mm}$; $1\text{ cm} = 10\text{ mm}$; $1\text{ kg} = 1000\text{ g}$; $1\text{ l} = 1000\text{ ml}$; $1\text{ giờ} = 60\text{ phút}$ (cùng dạng ghép như $2\text{ m } 5\text{ cm} = 205\text{ cm}$). |
| `clock_reading` | Xem đồng hồ chính xác đến từng phút (cách đọc giờ hơn và giờ kém) | `clock`: Vẽ mặt đồng hồ tròn có đầy đủ 12 số, 60 vạch chia phút, kim giờ ngắn (màu đỏ/vàng) và kim phút dài (màu xanh) quay đúng góc toán học. | Sinh ngẫu nhiên $(h \in [1, 12], m \in \{5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55\text{ hoặc phút lẻ}\})$. Hỏi đồng hồ chỉ mấy giờ mấy phút (hoặc mấy giờ kém mấy phút) hay sau $k$ phút nữa là mấy giờ. |

---

### Ải 3: Mê Cung Lời Văn — Phân môn Giải toán có lời văn (`category: 'word'`)

Ngữ cảnh bài toán được lồng ghép sinh động vào thế giới **Hiệp Sĩ Toán Học & Rừng Pha Lê** hoặc đời sống học đường Việt Nam:

1. **Gấp một số lên nhiều lần (`scale_up`):**
   - *Mẫu đề:* "Tổ Một trồng được $a$ cây thông pha lê. Tổ Hai trồng được số cây **gấp $k$ lần** số cây của Tổ Một. Hỏi Tổ Hai trồng được bao nhiêu cây?"
   - *Phép tính:* $a \times k$.
2. **Giảm một số đi nhiều lần (`scale_down`):**
   - *Mẫu đề:* "Một bình năng lượng chứa $a\text{ ml}$ nước phép thuật. Sau khi sử dụng, lượng nước trong bình **giảm đi $k$ lần**. Hỏi trong bình còn lại bao nhiêu mi-li-lít nước?"
   - *Phép tính:* $a : k$.
3. **Bài toán giải bằng 2 bước tính — Dạng Gấp/Giảm kết hợp tính Tổng (`two_step_sum`):**
   - *Mẫu đề:* "Hiệp Sĩ Nhí thu thập được $a$ viên ngọc xanh. Số viên ngọc đỏ gấp $k$ lần số viên ngọc xanh. Hỏi Hiệp Sĩ Nhí thu thập được **tất cả** bao nhiêu viên ngọc cả hai loại?"
   - *Lời giải 2 bước:*
     - Bước 1: Số viên ngọc đỏ là: $b = a \times k$ (viên).
     - Bước 2: Tổng số viên ngọc cả hai loại là: $a + b$ (viên).
4. **Bài toán giải bằng 2 bước tính — Dạng Hơn/Kém kết hợp tính Tổng (`two_step_diff_sum`):**
   - *Mẫu đề:* "Bao thứ nhất cân nặng $a\text{ kg}$ gạo. Bao thứ hai nhẹ hơn (hoặc nặng hơn) bao thứ nhất $d\text{ kg}$ gạo. Hỏi cả hai bao cân nặng bao nhiêu ki-lô-gam gạo?"
   - *Lời giải 2 bước:*
     - Bước 1: Bao thứ hai cân nặng là: $b = a \pm d\text{ (kg)}$.
     - Bước 2: Cả hai bao cân nặng là: $a + b\text{ (kg)}$.
5. **Bài toán giải bằng 2 bước tính — Dạng Rút về đơn vị (`unit_reduction`):**
   - *Mẫu đề:* "Có $total$ viên thuốc phép thuật chia đều vào $n_1$ lọ như nhau. Hỏi $n_2$ lọ như thế đựng được bao nhiêu viên thuốc?"
   - *Lời giải 2 bước:*
     - Bước 1 (Rút về đơn vị): Số viên thuốc trong 1 lọ là: $u = total : n_1$ (viên).
     - Bước 2: Số viên thuốc trong $n_2$ lọ là: $u \times n_2$ (viên).
   - *(Đáp án nhiễu sẽ gài đúng kết quả của Bước 1 để kiểm tra xem học sinh có dừng lại giữa chừng hay không!)*

---

### Ải 4: Đỉnh Núi Thống Kê — Phân môn Thống kê & Xác suất (`category: 'stat'`)

1. **Đọc và phân tích Bảng số liệu thống kê (`stat_table`):**
   - **Hình minh họa (`visual.type = 'table'`):** Hiển thị bảng số liệu trực quan gồm 3 - 4 cột (ví dụ: Số sao thu hoạch của 4 Tổ / Số sách quyên góp của 4 lớp 3A, 3B, 3C, 3D / Số cây trồng trong 4 ngày).
   - **Các biến thể câu hỏi ngẫu nhiên trên bảng:**
     - Hỏi giá trị **nhiều nhất** / **ít nhất** thuộc về đối tượng nào hoặc bằng bao nhiêu?
     - Hỏi đối tượng A nhiều hơn / ít hơn đối tượng B bao nhiêu đơn vị? ($v_A - v_B$)
     - Hỏi tổng số lượng của 2 hoặc cả 3 đối tượng trong bảng là bao nhiêu? ($v_A + v_B + \dots$)
2. **Nhận biết khả năng xảy ra của một sự kiện (`probability_event`):**
   - Dựa trên chuẩn GDPT 2018 Lớp 3 với 3 mức khả năng: **"Chắc chắn"**, **"Có thể"**, **"Không thể"**.
   - **Hình minh họa (`visual.type = 'prob_box'`):** Vẽ chiếc hộp pha lê trong suốt chứa các viên bi/ngôi sao có màu sắc cụ thể (ví dụ: trong hộp có $4$ bi Đỏ và $2$ bi Xanh, hoặc hộp chỉ toàn $5$ bi Vàng).
   - **Câu hỏi:**
     - Nếu hộp chỉ có bi Vàng, lấy ngẫu nhiên 1 viên bi:
       - Sự kiện *"Lấy được viên bi màu Vàng"* $\rightarrow$ **Chắc chắn**.
       - Sự kiện *"Lấy được viên bi màu Đỏ"* $\rightarrow$ **Không thể**.
     - Nếu hộp có cả bi Đỏ và bi Xanh, lấy ngẫu nhiên 1 viên bi:
       - Sự kiện *"Lấy được viên bi màu Đỏ"* $\rightarrow$ **Có thể**.
       - Sự kiện *"Lấy được viên bi màu Tím"* $\rightarrow$ **Không thể**.

---

### Ải 5: Lâu Đài Hắc Ám — Boss Tổng Hợp (`stage: 5`)

- Kết hợp ngẫu nhiên có trọng số tất cả 4 phân môn (`num`: 35%, `geo`: 25%, `word`: 25%, `stat`: 15%) với tham số số học lớn hơn và tăng tỷ lệ câu hỏi điền số trực tiếp bằng **Bàn phím số (`numpad`)** lên 40% để thử thách thực sự khả năng tính toán của Hiệp Sĩ Nhí trước khi giành chiến thắng chung cuộc.

---

## 3. Bảng Ánh Xạ Hình Ảnh Cắt Gốc Từ SGK Kết Nối Tri Thức (`assets/images/sgk/`)

Mỗi dạng toán và mục trong **Sổ Tay Bí Kíp Toán 3** được liên kết trực tiếp tới hình ảnh cắt từ 2 file PDF SGK Kết nối tri thức (`window.MK_SGK_ASSETS`):

| Mã Asset (`sgkAssetId`) | File ảnh (`assets/images/sgk/`) | Nguồn SGK Kết nối tri thức | Ứng dụng trong Game & Sổ tay Bí kíp |
| :--- | :--- | :--- | :--- |
| `cover_tap1` | `cover_tap1.jpg` | Bìa Tập 1 (Trang 1) | Banner giới thiệu Sổ tay Bí kíp Kết nối tri thức |
| `robot_mascot` | `robot_mascot.png` | Tập 1 - Bài 30 (Trang 85) | Avatar nhân vật **Rô-bốt Thông Thái** khi gợi ý & giải thích đáp án |
| `midpoint_b16` | `midpoint_b16.jpg` | Tập 1 - Bài 16 (Trang 49) | Minh họa Điểm ở giữa & Trung điểm đoạn thẳng (`midpoint_segment`) |
| `circle_b17` | `circle_b17.jpg` | Tập 1 - Bài 17 (Trang 52) | Minh họa Hình tròn tâm O, bán kính OM, đường kính AB (`circle_radius_diameter`) |
| `angle_eke_b18` | `angle_eke_b18.jpg` | Tập 1 - Bài 18 (Trang 54) | Minh họa Góc vuông, góc không vuông & thước Ê-ke (`angle_check`) |
| `mult_fold_b24` | `mult_fold_b24.jpg` | Tập 1 - Bài 24 (Trang 70) | Minh họa bài toán Gấp một số lên một số lần (`scale_up`) |
| `two_step_b28` | `two_step_b28.jpg` | Tập 1 - Bài 28 (Trang 81) | Minh họa phương pháp giải Bài toán bằng hai bước tính (`two_step_diff_sum`) |
| `mm_ruler_b30` | `mm_ruler_b30.jpg` | Tập 1 - Bài 30 (Trang 85) | Minh họa đơn vị đo độ dài Mi-li-mét (`unit_conversion`) |
| `expression_b38` | `expression_b38.jpg` | Tập 1 - Bài 38 (Trang 104) | Minh họa Biểu thức số & tính giá trị biểu thức (`expression_order`) |
| `roman_clock_b47` | `roman_clock_b47.jpg` | Tập 2 - Bài 47 (Trang 12) | Minh họa Chữ số La Mã `I` – `XX` & đồng hồ La Mã (`roman_numerals`) |
| `perimeter_b50` | `perimeter_b50.jpg` | Tập 2 - Bài 50 (Trang 21) | Minh họa Chu vi hình tam giác, tứ giác, chữ nhật, vuông (`rect_square_peri_area`) |
| `area_grid_b52` | `area_grid_b52.jpg` | Tập 2 - Bài 52 (Trang 30) | Minh họa Diện tích hình chữ nhật trên lưới ô vuông $1\text{ cm}^2$ (`rect_square_peri_area`) |
| `clock_read_b66` | `clock_read_b66.jpg` | Tập 2 - Bài 66 (Trang 77) | Minh họa Xem đồng hồ chính xác đến từng phút (`clock_reading`) |
| `vn_money_b68` | `vn_money_b68.jpg` | Tập 2 - Bài 68 (Trang 85) | Minh họa Tiền Việt Nam từ `1 000 đ` đến `500 000 đ` (`vn_money`) |
| `stats_basketball_b73` | `stats_basketball_b73.jpg` | Tập 2 - Bài 73 (Trang 103) | Minh họa Thu thập, phân loại, ghi chép số liệu & Bảng số liệu (`stat_table`) |
| `prob_balls_coins_b74` | `prob_balls_coins_b74.jpg` | Tập 2 - Bài 74 (Trang 108) | Minh họa Khả năng xảy ra của một sự kiện (`probability_event`) |

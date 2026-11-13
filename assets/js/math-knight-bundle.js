/**
 * ============================================================================
 * HIỆP SĨ TOÁN HỌC: GIẢI CỨU RỪNG PHA LÊ (MATH KNIGHT GRADE 3) - v1.1
 * Bộ sách: Toán 3 - Kết nối tri thức với cuộc sống (Tập 1 & Tập 2 - GDPT 2018)
 * Kiến trúc: Web Component <math-knight-game> (Shadow DOM Isolation)
 * Phụ thuộc: 100% Vanilla ES6 JS + SVG/Canvas + Web Audio API (Zero External Deps)
 * ============================================================================
 */
(function () {
  'use strict';

  const MK_VERSION = '1.1';

  /* ==========================================================================
   * 0. DỮ LIỆU CẤU HÌNH CỐT TRUYỆN 5 ẢI, 8 HUY HIỆU & SỔ TAY BÍ KÍP KẾT NỐI TRI THỨC
   * ========================================================================== */

  const STAGES_BY_BOOK = {
    tap1: [
      {
        id: 1,
        bookMode: 'tap1',
        key: 'forest',
        name: 'Ải 1 (Tập 1): Khu Rừng Bảng Nhân Chia',
        subtitle: 'Bảng nhân, bảng chia 2 đến 9, Một phần mấy & Cộng trừ phạm vi 1 000',
        bossName: 'Slime Xanh Bạc Hà',
        bossTitle: 'Quái Vật Giọt Sương Học Kì 1',
        bossColor: '#34D399',
        crystalName: 'Pha Lê Ngọc Lục Bảo Tập 1',
        crystalColor: '#10B981',
        crystalGlow: '#A7F3D0',
        bgGradient: 'linear-gradient(180deg, #E0F7FA 0%, #FEF9C3 58%, #A7F3D0 100%)',
        accentColor: '#10B981',
        sgkRef: 'SGK Toán 3 Tập 1 - Chủ đề 1 & Chủ đề 2 (Bài 1 đến Bài 15)',
        storyIntro: 'Slime Xanh Bạc Hà đang chặn lối vào Khu Rừng Bảng Nhân Chia! Hãy dùng bảng nhân chia 2 đến 9 và phép tính phạm vi 1 000 để thu phục nó!'
      },
      {
        id: 2,
        bookMode: 'tap1',
        key: 'rainbow',
        name: 'Ải 2 (Tập 1): Đầm Lầy Hình Phẳng & Khối',
        subtitle: 'Trung điểm đoạn thẳng, Hình tròn, Góc vuông Ê-ke & Khối lập phương',
        bossName: 'Goblin Ê-ke Tinh Quái',
        bossTitle: 'Kẻ Canh Giữ Góc Vuông & Hình Khối',
        bossColor: '#FBBF24',
        crystalName: 'Pha Lê Vàng Hình Học Tập 1',
        crystalColor: '#F59E0B',
        crystalGlow: '#FEF08A',
        bgGradient: 'linear-gradient(180deg, #FFFBEB 0%, #E0F2FE 55%, #FDE68A 100%)',
        accentColor: '#F59E0B',
        sgkRef: 'SGK Toán 3 Tập 1 - Chủ đề 3 (Bài 16 đến Bài 22)',
        storyIntro: 'Goblin Ê-ke Tinh Quái đố bạn về trung điểm đoạn thẳng, bán kính đường kính hình tròn, góc vuông và khối hộp chữ nhật!'
      },
      {
        id: 3,
        bookMode: 'tap1',
        key: 'cave',
        name: 'Ải 3 (Tập 1): Thung Lũng Chia Có Dư & Lời Văn',
        subtitle: 'Nhân chia số có 2 chữ số, Phép chia có dư, Gấp lên/Giảm đi & Toán 2 bước tính',
        bossName: 'Người Đá Golem Tím',
        bossTitle: 'Khổng Lồ Thạch Anh Phép Chia',
        bossColor: '#A78BFA',
        crystalName: 'Pha Lê Tím Lời Văn Tập 1',
        crystalColor: '#8B5CF6',
        crystalGlow: '#EDE9FE',
        bgGradient: 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 58%, #DDD6FE 100%)',
        accentColor: '#8B5CF6',
        sgkRef: 'SGK Toán 3 Tập 1 - Chủ đề 4 (Bài 23 đến Bài 29)',
        storyIntro: 'Người Đá Golem Tím trấn giữ Thung Lũng Chia Có Dư! Hãy giải các bài toán gấp một số lên, giảm đi một số lần và toán 2 bước tính!'
      },
      {
        id: 4,
        bookMode: 'tap1',
        key: 'waterfall',
        name: 'Ải 4 (Tập 1): Hang Động Đo Lường & Biểu Thức',
        subtitle: 'Đơn vị mm, g, ml, Nhiệt độ °C, Nhân chia số 3 chữ số & Giá trị biểu thức',
        bossName: 'Pháp Sư Cú Cổ Đại',
        bossTitle: 'Hiền Nhân Biểu Thức & Đo Lường',
        bossColor: '#38BDF8',
        crystalName: 'Pha Lê Lam Biểu Thức Tập 1',
        crystalColor: '#0EA5E9',
        crystalGlow: '#E0F2FE',
        bgGradient: 'linear-gradient(180deg, #ECFEFF 0%, #E0F2FE 60%, #A5F3FC 100%)',
        accentColor: '#0EA5E9',
        sgkRef: 'SGK Toán 3 Tập 1 - Chủ đề 5 & Chủ đề 6 (Bài 30 đến Bài 40)',
        storyIntro: 'Pháp Sư Cú Cổ Đại thử thách bạn đổi đơn vị mm, g, ml, nhiệt độ °C và tính giá trị biểu thức số trong phạm vi 1 000!'
      },
      {
        id: 5,
        bookMode: 'tap1',
        key: 'peak',
        name: 'Ải 5 (Tập 1): Đỉnh Núi Pha Lê Học Kì 1',
        subtitle: 'Đại Chiến Rồng Pha Lê Ngọc Lục Bảo - Tổng Hợp Toàn Bộ SGK Tập 1',
        bossName: 'Rồng Pha Lê Ngọc Lục Bảo',
        bossTitle: 'Chúa Tể Đỉnh Núi Học Kì 1',
        bossColor: '#10B981',
        crystalName: 'Pha Lê Tối Thượng Học Kì 1',
        crystalColor: '#059669',
        crystalGlow: '#A7F3D0',
        bgGradient: 'linear-gradient(180deg, #ECFDF5 0%, #E0F2FE 55%, #A7F3D0 100%)',
        accentColor: '#059669',
        sgkRef: 'SGK Toán 3 Tập 1 - Chủ đề 7 (Ôn tập Học kì 1: Bài 41 đến Bài 44)',
        storyIntro: 'Trận quyết chiến Học kì 1! Hãy vận dụng toàn bộ kiến thức SGK Toán 3 Tập 1 để chinh phục Rồng Pha Lê Ngọc Lục Bảo!'
      }
    ],
    tap2: [
      {
        id: 1,
        bookMode: 'tap2',
        key: 'forest',
        name: 'Ải 1 (Tập 2): Thảo Nguyên Số 10 000 & La Mã',
        subtitle: 'Các số phạm vi 10 000, Làm tròn số, Chữ số La Mã I đến XX & Rút về đơn vị',
        bossName: 'Slime Ánh Vàng',
        bossTitle: 'Quái Vật Thảo Nguyên La Mã',
        bossColor: '#34D399',
        crystalName: 'Pha Lê Ngọc Bích Tập 2',
        crystalColor: '#10B981',
        crystalGlow: '#A7F3D0',
        bgGradient: 'linear-gradient(180deg, #E0F7FA 0%, #FEF9C3 58%, #A7F3D0 100%)',
        accentColor: '#10B981',
        sgkRef: 'SGK Toán 3 Tập 2 - Chủ đề 8 & Chủ đề 11 (Bài 45 đến 49, Bài 54 đến 58)',
        storyIntro: 'Slime Ánh Vàng canh giữ Thảo Nguyên Số 10 000! Hãy đọc chữ số La Mã, làm tròn số và giải bài toán rút về đơn vị!'
      },
      {
        id: 2,
        bookMode: 'tap2',
        key: 'rainbow',
        name: 'Ải 2 (Tập 2): Vương Quốc Chu Vi & Diện Tích',
        subtitle: 'Chu vi tam giác, tứ giác, hình chữ nhật, hình vuông & Diện tích cm²',
        bossName: 'Goblin Bàn Tính',
        bossTitle: 'Kẻ Canh Giữ Lưới Ô Vuông cm²',
        bossColor: '#FBBF24',
        crystalName: 'Pha Lê Vàng Diện Tích Tập 2',
        crystalColor: '#F59E0B',
        crystalGlow: '#FEF08A',
        bgGradient: 'linear-gradient(180deg, #FFFBEB 0%, #E0F2FE 55%, #FDE68A 100%)',
        accentColor: '#F59E0B',
        sgkRef: 'SGK Toán 3 Tập 2 - Chủ đề 9 (Bài 50 đến Bài 53)',
        storyIntro: 'Goblin Bàn Tính thách đố bạn tính chu vi và diện tích hình chữ nhật, hình vuông theo đơn vị xăng-ti-mét vuông (cm²)!'
      },
      {
        id: 3,
        bookMode: 'tap2',
        key: 'cave',
        name: 'Ải 3 (Tập 2): Thành Phố Số 100 000',
        subtitle: 'Các số có 5 chữ số, Làm tròn số & Cộng trừ nhân chia phạm vi 100 000',
        bossName: 'Người Đá Thạch Anh',
        bossTitle: 'Khổng Lồ Hàng Chục Nghìn',
        bossColor: '#A78BFA',
        crystalName: 'Pha Lê Tím Vạn Số Tập 2',
        crystalColor: '#8B5CF6',
        crystalGlow: '#EDE9FE',
        bgGradient: 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 58%, #DDD6FE 100%)',
        accentColor: '#8B5CF6',
        sgkRef: 'SGK Toán 3 Tập 2 - Chủ đề 12, 13, 14 (Bài 59 đến 65, Bài 70 đến 72)',
        storyIntro: 'Người Đá Thạch Anh trấn giữ Thành Phố Số 100 000! Hãy làm chủ các phép cộng, trừ, nhân, chia số có 5 chữ số!'
      },
      {
        id: 4,
        bookMode: 'tap2',
        key: 'waterfall',
        name: 'Ải 4 (Tập 2): Thác Nước Thời Gian & Thống Kê',
        subtitle: 'Xem đồng hồ từng phút, Tháng - Năm, Tiền Việt Nam, Bảng số liệu & Xác suất',
        bossName: 'Pháp Sư Cú Cổ Đại',
        bossTitle: 'Hiền Nhân Thời Gian & Xác Suất',
        bossColor: '#38BDF8',
        crystalName: 'Pha Lê Lam Thống Kê Tập 2',
        crystalColor: '#0EA5E9',
        crystalGlow: '#E0F2FE',
        bgGradient: 'linear-gradient(180deg, #ECFEFF 0%, #E0F2FE 60%, #A5F3FC 100%)',
        accentColor: '#0EA5E9',
        sgkRef: 'SGK Toán 3 Tập 2 - Chủ đề 13 & Chủ đề 15 (Bài 66 đến 69, Bài 73 đến 75)',
        storyIntro: 'Pháp Sư Cú Cổ Đại thử thách bạn xem đồng hồ đến từng phút, tính tiền Việt Nam, đọc bảng số liệu và dự đoán khả năng xảy ra!'
      },
      {
        id: 5,
        bookMode: 'tap2',
        key: 'peak',
        name: 'Ải 5 (Tập 2): Đỉnh Núi Pha Lê Học Kì 2',
        subtitle: 'Đại Chiến Rồng Pha Lê Hoàng Kim - Tổng Hợp Toàn Bộ SGK Tập 2',
        bossName: 'Rồng Pha Lê Hoàng Kim',
        bossTitle: 'Chúa Tể Đỉnh Núi Học Kì 2',
        bossColor: '#F59E0B',
        crystalName: 'Pha Lê Tối Thượng Học Kì 2',
        crystalColor: '#D97706',
        crystalGlow: '#FEF08A',
        bgGradient: 'linear-gradient(180deg, #FEF9C3 0%, #E0F2FE 55%, #FDE68A 100%)',
        accentColor: '#D97706',
        sgkRef: 'SGK Toán 3 Tập 2 - Chủ đề 16 (Ôn tập cuối năm: Bài 76 đến Bài 81)',
        storyIntro: 'Trận đại chiến Học kì 2! Hãy kết hợp toàn bộ kiến thức SGK Toán 3 Tập 2 để đánh bại Rồng Pha Lê Hoàng Kim!'
      }
    ],
    all: [
      {
        id: 1,
        bookMode: 'all',
        key: 'forest',
        name: 'Ải 1: Khu Rừng Khởi Đầu',
        subtitle: 'Bảng nhân/chia 2 đến 9 (có dư) & Cộng trừ phạm vi 10 000',
        bossName: 'Slime Xanh Bạc Hà',
        bossTitle: 'Quái Vật Giọt Sương Rừng Sâu',
        bossColor: '#34D399',
        crystalName: 'Pha Lê Ngọc Lục Bảo Khởi Nguyên',
        crystalColor: '#10B981',
        crystalGlow: '#A7F3D0',
        bgGradient: 'linear-gradient(180deg, #E0F7FA 0%, #FEF9C3 58%, #A7F3D0 100%)',
        accentColor: '#10B981',
        sgkRef: 'Chủ đề 1, 2, 4, 11 (SGK Tập 1 & Tập 2)',
        storyIntro: 'Slime Xanh Bạc Hà đang chặn lối vào Khu Rừng Khởi Đầu! Hãy dùng phép nhân chia 2 đến 9 và cộng trừ phạm vi 10 000 để thu phục nó!'
      },
      {
        id: 2,
        bookMode: 'all',
        key: 'rainbow',
        name: 'Ải 2: Thung Lũng Cầu Vồng',
        subtitle: 'Nhân chia số có 3, 4 chữ số, Chữ số La Mã I đến XX & Xem đồng hồ',
        bossName: 'Goblin Bàn Tính',
        bossTitle: 'Kẻ Canh Giữ Thời Gian & Con Số',
        bossColor: '#FBBF24',
        crystalName: 'Pha Lê Vàng Cầu Vồng Thời Gian',
        crystalColor: '#F59E0B',
        crystalGlow: '#FEF08A',
        bgGradient: 'linear-gradient(180deg, #FFFBEB 0%, #E0F2FE 55%, #FDE68A 100%)',
        accentColor: '#F59E0B',
        sgkRef: 'Bài 36, 37 Tập 1 & Bài 47, 56, 57, 66 Tập 2',
        storyIntro: 'Goblin Bàn Tính đã làm đảo lộn các kim đồng hồ và chữ số La Mã ở Thung Lũng Cầu Vồng! Hãy tính thật nhanh để mở đường!'
      },
      {
        id: 3,
        bookMode: 'all',
        key: 'cave',
        name: 'Ải 3: Hang Động Pha Lê',
        subtitle: 'Biểu thức số, Đổi đơn vị đo (mm, cm, dm, m, km, g, kg, ml, l) & Phạm vi 100 000',
        bossName: 'Người Đá Golem Tím',
        bossTitle: 'Khổng Lồ Thạch Anh Hang Sâu',
        bossColor: '#A78BFA',
        crystalName: 'Pha Lê Tím Thạch Anh Tinh Khiết',
        crystalColor: '#8B5CF6',
        crystalGlow: '#EDE9FE',
        bgGradient: 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 58%, #DDD6FE 100%)',
        accentColor: '#8B5CF6',
        sgkRef: 'Bài 30, 31, 32, 38 Tập 1 & Chủ đề 14 Tập 2',
        storyIntro: 'Người Đá Golem Tím trấn giữ Hang Động Pha Lê! Hãy tính giá trị biểu thức và quy đổi đơn vị đo lường thật chuẩn xác!'
      },
      {
        id: 4,
        bookMode: 'all',
        key: 'waterfall',
        name: 'Ải 4: Thác Nước Tri Thức',
        subtitle: 'Chu vi, Diện tích, Góc vuông, Trung điểm, Hình tròn, Toán 2 bước tính & Thống kê',
        bossName: 'Pháp Sư Cú Cổ Đại',
        bossTitle: 'Hiền Nhân Thác Nước Pha Lê',
        bossColor: '#38BDF8',
        crystalName: 'Pha Lê Lam Thủy Tri Thức',
        crystalColor: '#0EA5E9',
        crystalGlow: '#E0F2FE',
        bgGradient: 'linear-gradient(180deg, #ECFEFF 0%, #E0F2FE 60%, #A5F3FC 100%)',
        accentColor: '#0EA5E9',
        sgkRef: 'Bài 16, 17, 18, 24, 27, 28 Tập 1 & Chủ đề 10, 15 Tập 2',
        storyIntro: 'Pháp Sư Cú Cổ Đại thử thách bạn với các hình vẽ Chu vi, Diện tích, Toán lời văn 2 bước tính và Thống kê Xác suất tại Thác Nước Tri Thức!'
      },
      {
        id: 5,
        bookMode: 'all',
        key: 'peak',
        name: 'Ải 5: Đỉnh Núi Pha Lê',
        subtitle: 'Đại Chiến Rồng Pha Lê Sapphire - Tổng Hợp 4 Mạch Kiến Thức Toán Lớp 3',
        bossName: 'Rồng Pha Lê Sapphire',
        bossTitle: 'Chúa Tể Tối Thượng Đỉnh Núi Pha Lê',
        bossColor: '#60A5FA',
        crystalName: 'Pha Lê Sapphire Tối Thượng',
        crystalColor: '#3B82F6',
        crystalGlow: '#DBEAFE',
        bgGradient: 'linear-gradient(180deg, #FEF9C3 0%, #E0F2FE 55%, #BFDBFE 100%)',
        accentColor: '#3B82F6',
        sgkRef: 'Chủ đề 7 (Tập 1) & Chủ đề 16 (Ôn tập cuối năm - Tập 2)',
        storyIntro: 'Trận đại chiến cuối cùng trên Đỉnh Núi Pha Lê! Hãy kết hợp toàn bộ kiến thức Toán Lớp 3 để đánh bại Rồng Pha Lê Sapphire và giải cứu Rừng Pha Lê!'
      }
    ]
  };

  function getStagesForBook(bookMode = 'all') {
    if (bookMode === 'tap1') return STAGES_BY_BOOK.tap1;
    if (bookMode === 'tap2') return STAGES_BY_BOOK.tap2;
    return STAGES_BY_BOOK.all;
  }

  const STAGES_CONFIG = STAGES_BY_BOOK.all;

  const BADGES_CONFIG = [
    {
      id: 'first_blood',
      icon: '🗡️',
      name: 'Tân Binh Dũng Cảm',
      desc: 'Vượt Ải 1 và khôi phục Pha Lê Ngọc Lục Bảo.'
    },
    {
      id: 'fury_hero',
      icon: '🔥',
      name: 'Chiến Binh Cuồng Nộ',
      desc: 'Đạt chuỗi 5 câu đúng liên tiếp (Combo x2 điểm).'
    },
    {
      id: 'speed_demon',
      icon: '⚡',
      name: 'Tia Chớp Toán Học',
      desc: 'Trả lời đúng 1 câu trong vòng chưa đầy 5 giây.'
    },
    {
      id: 'geo_master',
      icon: '📐',
      name: 'Kiến Trúc Sư Pha Lê',
      desc: 'Hoàn thành Ải 2 (Thung Lũng Cầu Vồng) không sai câu nào.'
    },
    {
      id: 'word_wizard',
      icon: '📖',
      name: 'Nhà Thông Thái Biểu Thức',
      desc: 'Chinh phục thành công Ải 3 (Hang Động Pha Lê).'
    },
    {
      id: 'stat_sage',
      icon: '📊',
      name: 'Bậc Thầy Hình Học & Lời Văn',
      desc: 'Chinh phục thành công Ải 4 (Thác Nước Tri Thức).'
    },
    {
      id: 'flawless_stage',
      icon: '🛡️',
      name: 'Hiệp Sĩ Bất Bại',
      desc: 'Hoàn thành 1 ải bất kỳ với 3/3 Tim nguyên vẹn.'
    },
    {
      id: 'crystal_savior',
      icon: '👑',
      name: 'Huyền Thoại Rừng Pha Lê',
      desc: 'Đánh bại Rồng Pha Lê ở Ải 5, khôi phục đủ 5 Pha Lê.'
    }
  ];

  const HANDBOOK_ITEMS = [
    {
      assetKey: 'robot_mascot',
      stage: 1,
      book: 'tap1',
      cat: 'num',
      badge: 'Bạn đồng hành SGK',
      title: 'Rô-bốt Thông Thái & Nhóm bạn Việt, Nam, Mai, Mi',
      rule: 'Trong bộ sách Toán 3 Kết nối tri thức với cuộc sống, bạn Rô-bốt luôn đồng hành gợi ý quy tắc đóng khung và cùng Việt, Nam, Mai, Mi khám phá Toán học!',
      formula: '💡 Mẹo: Khi gặp câu khó, hãy bấm nút "💡 Gợi Ý Rô-bốt" để được trợ giúp nhé!'
    },
    {
      assetKey: 'expression_b38',
      stage: 1,
      book: 'tap1',
      cat: 'num',
      badge: 'Bài 38 • Trang 104',
      title: 'Thứ tự thực hiện các phép tính trong Biểu thức số',
      rule: '1) Chỉ có cộng, trừ HOẶC chỉ có nhân, chia → Tính từ TRÁI sang PHẢI.\n2) Có cả cộng, trừ, nhân, chia → Thực hiện NHÂN, CHIA trước; CỘNG, TRỪ sau.\n3) Có dấu ngoặc ( ) → Thực hiện trong ngoặc trước.',
      formula: 'Ví dụ: 18 + 6 × 3 = 18 + 18 = 36 | (12 + 8) : 4 = 20 : 4 = 5'
    },
    {
      assetKey: 'roman_clock_b47',
      stage: 1,
      book: 'tap2',
      cat: 'num',
      badge: 'Bài 47 • Trang 12',
      title: 'Làm quen với Chữ số La Mã (I đến XX)',
      rule: 'Các kí hiệu cơ bản: I = 1, V = 5, X = 10.\n• IV = 4, VI = 6, IX = 9, XI = 11, XII = 12, XV = 15, XIX = 19, XX = 20.',
      formula: 'I(1), II(2), III(3), IV(4), V(5), VI(6), VII(7), VIII(8), IX(9), X(10), XII(12), XV(15), XX(20)'
    },
    {
      assetKey: 'midpoint_b16',
      stage: 2,
      book: 'tap1',
      cat: 'geo',
      badge: 'Bài 16 • Trang 49',
      title: 'Điểm ở giữa & Trung điểm của đoạn thẳng',
      rule: '• A, M, B là 3 điểm thẳng hàng theo thứ tự đó thì M là điểm ở giữa hai điểm A và B.\n• Nếu M ở giữa A, B và MA = MB thì M là TRUNG ĐIỂM của đoạn thẳng AB.',
      formula: 'MA = MB = AB : 2  ⇔  AB = 2 × MA'
    },
    {
      assetKey: 'circle_b17',
      stage: 2,
      book: 'tap1',
      cat: 'geo',
      badge: 'Bài 17 • Trang 52',
      title: 'Hình tròn: Tâm, Bán kính, Đường kính',
      rule: 'Trong một hình tròn:\n• Tâm O là trung điểm của đường kính AB.\n• Độ dài đường kính gấp 2 lần độ dài bán kính.',
      formula: 'Đường kính d = 2 × r  |  Bán kính r = d : 2'
    },
    {
      assetKey: 'angle_eke_b18',
      stage: 2,
      book: 'tap1',
      cat: 'geo',
      badge: 'Bài 18 • Trang 54',
      title: 'Góc, Góc vuông, Góc không vuông & Thước Ê-ke',
      rule: 'Dùng thước Ê-ke để kiểm tra góc vuông:\n• Đặt đỉnh góc vuông của ê-ke trùng với đỉnh của góc, một cạnh trùng với một cạnh của góc. Nếu cạnh còn lại trùng khít thì đó là GÓC VUÔNG.',
      formula: 'Hình chữ nhật và hình vuông đều có 4 góc vuông.'
    },
    {
      assetKey: 'mm_ruler_b30',
      stage: 2,
      book: 'tap1',
      cat: 'geo',
      badge: 'Bài 30 • Trang 85',
      title: 'Đơn vị đo độ dài, khối lượng, dung tích, nhiệt độ',
      rule: '• Mi-li-mét là đơn vị đo độ dài viết tắt là mm.\n• Khối lượng: gam (g), ki-lô-gam (kg).\n• Dung tích: mi-li-lít (ml), lít (l).',
      formula: '1 cm = 10 mm | 1 dm = 100 mm | 1 m = 1 000 mm | 1 kg = 1 000 g | 1 l = 1 000 ml'
    },
    {
      assetKey: 'perimeter_b50',
      stage: 2,
      book: 'tap2',
      cat: 'geo',
      badge: 'Bài 50 • Trang 21',
      title: 'Chu vi hình tam giác, tứ giác, hình chữ nhật, hình vuông',
      rule: '• Tổng độ dài các cạnh của hình tam giác, tứ giác là chu vi của hình đó.\n• Muốn tính chu vi hình chữ nhật: lấy chiều dài cộng chiều rộng (cùng đơn vị đo) rồi nhân với 2.\n• Muốn tính chu vi hình vuông: lấy độ dài một cạnh nhân với 4.',
      formula: 'P(HCN) = (a + b) × 2  |  P(Hình vuông) = a × 4'
    },
    {
      assetKey: 'area_grid_b52',
      stage: 2,
      book: 'tap2',
      cat: 'geo',
      badge: 'Bài 52 • Trang 30',
      title: 'Diện tích hình chữ nhật & Diện tích hình vuông (cm²)',
      rule: '• Muốn tính diện tích hình chữ nhật, ta lấy số đo chiều dài nhân với số đo chiều rộng (cùng một đơn vị đo).\n• Muốn tính diện tích hình vuông, ta lấy độ dài một cạnh nhân với chính nó.',
      formula: 'S(HCN) = a × b (cm²)  |  S(Hình vuông) = a × a (cm²)'
    },
    {
      assetKey: 'clock_read_b66',
      stage: 2,
      book: 'tap2',
      cat: 'geo',
      badge: 'Bài 66 • Trang 77',
      title: 'Xem đồng hồ chính xác đến từng phút',
      rule: '• Kim ngắn chỉ GIỜ, kim dài chỉ PHÚT. Mỗi vạch nhỏ ứng với 1 phút, hai số liền nhau cách nhau 5 phút.\n• Khi số phút vượt quá 30 phút, ta còn có cách đọc giờ kém (Ví dụ: 8 giờ 45 phút hay 9 giờ kém 15 phút).',
      formula: '1 giờ = 60 phút | Số phút giờ kém = 60 - Số phút hiện tại'
    },
    {
      assetKey: 'vn_money_b68',
      stage: 2,
      book: 'tap2',
      cat: 'geo',
      badge: 'Bài 68 • Trang 85',
      title: 'Tiền Việt Nam thông dụng',
      rule: 'Nhận biết các tờ tiền Việt Nam: 1 000 đồng, 2 000 đồng, 5 000 đồng, 10 000 đồng, 20 000 đồng, 50 000 đồng, 100 000 đồng, 200 000 đồng, 500 000 đồng.',
      formula: 'Tiền trả lại = Số tiền đưa cô bán hàng - Tổng số tiền mua đồ'
    },
    {
      assetKey: 'mult_fold_b24',
      stage: 3,
      book: 'tap1',
      cat: 'word_stat',
      badge: 'Bài 24 & 27 • Trang 70',
      title: 'Gấp một số lên một số lần & Giảm một số đi một số lần',
      rule: '• Muốn GẤP một số lên một số lần, ta lấy số đó NHÂN với số lần.\n• Muốn GIẢM một số đi một số lần, ta lấy số đó CHIA cho số lần.\n• Muốn biết số lớn gấp mấy lần số bé, ta lấy số lớn CHIA cho số bé.',
      formula: 'Gấp n lần: a × n  |  Giảm n lần: a : n'
    },
    {
      assetKey: 'two_step_b28',
      stage: 3,
      book: 'tap1',
      cat: 'word_stat',
      badge: 'Bài 28 • Trang 81',
      title: 'Bài toán giải bằng hai bước tính',
      rule: '• Bước 1: Tìm giá trị của đại lượng thứ hai (dựa vào điều kiện nhiều hơn, ít hơn, gấp lên hoặc giảm đi một số lần).\n• Bước 2: Tìm tổng hoặc hiệu của hai đại lượng theo câu hỏi bài toán.',
      formula: 'Bước 1: Tìm phần thứ hai → Bước 2: Tính cả hai phần'
    },
    {
      assetKey: 'stats_basketball_b73',
      stage: 4,
      book: 'tap2',
      cat: 'word_stat',
      badge: 'Bài 73 • Trang 103',
      title: 'Thu thập, phân loại, ghi chép số liệu & Bảng số liệu',
      rule: 'Bảng số liệu thường gồm các hàng và các cột. Khi đọc bảng:\n• Xác định hàng tên đối tượng và hàng số liệu tương ứng.\n• So sánh tìm giá trị lớn nhất, bé nhất, tính tổng hoặc hiệu giữa các cột.',
      formula: 'Tổng số liệu = Cộng tất cả các cột | Hơn kém = Số lớn - Số bé'
    },
    {
      assetKey: 'prob_balls_coins_b74',
      stage: 4,
      book: 'tap2',
      cat: 'word_stat',
      badge: 'Bài 74 • Trang 108',
      title: 'Khả năng xảy ra của một sự kiện',
      rule: 'Dùng 3 thuật ngữ chuẩn SGK Kết nối tri thức:\n• CHẮC CHẮN xảy ra (100% luôn đúng).\n• CÓ THỂ xảy ra (có mặt trong hộp nhưng chưa biết lấy trúng hay không).\n• KHÔNG THỂ xảy ra (không hề tồn tại trong hộp).',
      formula: '3 mức độ khả năng: Chắc chắn  |  Có thể  |  Không thể'
    }
  ];

  /* ==========================================================================
   * 1. MODULE SOUNDFX (100% WEB AUDIO API SYNTHESIZER - KHÔNG CẦN FILE MP3)
   * ========================================================================== */
  class SoundFX {
    constructor(isMuted = false) {
      this.ctx = null;
      this.isMuted = Boolean(isMuted);
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    setMuted(muted) {
      this.isMuted = Boolean(muted);
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (!this.isMuted) {
        this.playClick();
      }
      return this.isMuted;
    }

    playTone(freq, type = 'sine', duration = 0.12, startTimeOffset = 0, volume = 0.18, slideToFreq = null) {
      if (this.isMuted) return;
      try {
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime + startTimeOffset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideToFreq) {
          osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + duration);
        }

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.02);
      } catch (e) {
        // Bỏ qua nếu trình duyệt chặn tự phát âm thanh
      }
    }

    playClick() {
      this.playTone(580, 'sine', 0.065, 0, 0.14, 880);
    }

    playSlash() {
      this.playTone(920, 'triangle', 0.09, 0, 0.18, 260);
      this.playTone(1350, 'sine', 0.07, 0.03, 0.12, 480);
    }

    playCorrect(streak = 1) {
      // Hợp âm Đô trưởng đi lên vui tươi + Adaptive Pitch Scaling theo chuỗi đúng (streak)
      this.playSlash();
      const pitchScale = 1 + Math.min(8, Math.max(0, Number(streak) - 1)) * 0.035;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((n, idx) => {
        this.playTone(n * pitchScale, 'triangle', 0.16, idx * 0.065, 0.2);
      });
    }

    playWrong() {
      // Âm trầm nhẹ nhàng nhắc nhở, không làm trẻ giật mình
      this.playTone(260, 'sawtooth', 0.18, 0, 0.12, 195);
      this.playTone(195, 'triangle', 0.25, 0.15, 0.14, 145);
    }

    playFuryActivate() {
      // Chuỗi âm thanh năng lượng Cuồng Nộ x2 điểm
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.5];
      notes.forEach((n, i) => {
        this.playTone(n, 'triangle', 0.14, i * 0.045, 0.2);
      });
    }

    playItemUse() {
      const notes = [587.33, 880, 1174.66, 1567.98];
      notes.forEach((n, i) => {
        this.playTone(n, 'sine', 0.13, i * 0.05, 0.18);
      });
    }

    playStageClear() {
      // Nhạc khải hoàn ca khôi phục Đá Pha Lê
      const melody = [
        { f: 523.25, d: 0.13, t: 0 },
        { f: 659.25, d: 0.13, t: 0.11 },
        { f: 783.99, d: 0.13, t: 0.22 },
        { f: 1046.5, d: 0.28, t: 0.34 },
        { f: 783.99, d: 0.13, t: 0.56 },
        { f: 1046.5, d: 0.42, t: 0.68 }
      ];
      melody.forEach((m) => this.playTone(m.f, 'triangle', m.d, m.t, 0.22));
    }

    playVictory() {
      // Fanfare chiến thắng giải cứu Rừng Pha Lê
      const fanfare = [
        { f: 523.25, d: 0.14, t: 0 },
        { f: 659.25, d: 0.14, t: 0.12 },
        { f: 783.99, d: 0.14, t: 0.24 },
        { f: 1046.5, d: 0.25, t: 0.36 },
        { f: 987.77, d: 0.15, t: 0.62 },
        { f: 1046.5, d: 0.18, t: 0.78 },
        { f: 1318.5, d: 0.5, t: 0.96 }
      ];
      fanfare.forEach((m) => this.playTone(m.f, 'triangle', m.d, m.t, 0.24));
    }

    playGameOver() {
      const sad = [
        { f: 392.0, d: 0.2, t: 0 },
        { f: 349.23, d: 0.2, t: 0.2 },
        { f: 329.63, d: 0.22, t: 0.4 },
        { f: 261.63, d: 0.45, t: 0.62 }
      ];
      sad.forEach((m) => this.playTone(m.f, 'sine', m.d, m.t, 0.16));
    }
  }

  /* ==========================================================================
   * 2. MODULE VISUALBUILDER (ĐỒ HỌA SVG ĐỘNG 100% + TÍCH HỢP ẢNH GỐC SGK KNTT)
   * ========================================================================== */
  class VisualBuilder {
    static getSgkAsset(key) {
      if (!key) return null;
      if (window.MK_SGK_ASSETS && window.MK_SGK_ASSETS[key]) {
        return window.MK_SGK_ASSETS[key];
      }
      return null;
    }

    static getSgkImageUrl(key) {
      if (!key) return '';
      if (typeof window.getMkSgkAssetUrl === 'function') {
        return window.getMkSgkAssetUrl(key);
      }
      const asset = this.getSgkAsset(key);
      return asset ? (asset.dataUri || asset.relativePath || '') : '';
    }

    /**
     * Vẽ SVG Nhân vật người chơi theo phong cách 2.5D Paper-Cut Lineless Geometric:
     * 'knight' (Hiệp Sĩ Nam) hoặc 'mage' (Pháp Sư Mai)
     */
    static renderHeroSVG(avatar = 'knight', isFury = false, isHit = false, isAttacking = false) {
      const stateClasses = [
        isFury ? 'mk-fury-glow' : '',
        isAttacking ? 'mk-hero-lunge' : isHit ? 'mk-hero-hit' : 'mk-float-idle'
      ].filter(Boolean).join(' ');
      const furyHalo = isFury
        ? `<circle cx="70" cy="70" r="56" fill="rgba(254, 240, 138, 0.45)"/>
           <circle cx="70" cy="70" r="46" fill="rgba(251, 191, 36, 0.25)" class="mk-spin-halo"/>`
        : `<circle cx="70" cy="72" r="46" fill="rgba(255, 255, 255, 0.55)"/>`;
      const slashArc = isAttacking
        ? `<path d="M98 14 Q142 56 102 122" fill="none" stroke="#FDE047" stroke-width="8" stroke-linecap="round" class="mk-slash-arc"/>
           <path d="M106 22 Q146 58 110 114" fill="none" stroke="#38BDF8" stroke-width="5" stroke-linecap="round" class="mk-slash-arc"/>`
        : '';

      if (avatar === 'mage') {
        return `
        <svg viewBox="0 0 150 140" class="mk-char-svg ${stateClasses}" aria-label="Pháp Sư Pha Lê Mai">
          <defs>
            <filter id="mkPaperMage" x="-15%" y="-15%" width="130%" height="135%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#4C1D95" flood-opacity="0.16"/>
            </filter>
            <linearGradient id="mageRobe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#A78BFA"/>
              <stop offset="100%" stop-color="#7C3AED"/>
            </linearGradient>
            <linearGradient id="crystalStaff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#A5F3FC"/>
              <stop offset="100%" stop-color="#06B6D4"/>
            </linearGradient>
          </defs>
          <ellipse cx="70" cy="128" rx="38" ry="7" fill="rgba(14, 116, 144, 0.16)"/>
          ${furyHalo}
          <g filter="url(#mkPaperMage)">
            <!-- Lớp giấy choàng sau -->
            <path d="M36 80 L22 124 L118 124 L104 80 Z" fill="#C4B5FD"/>
            <!-- Áo choàng phép thuật Pastel Lavender -->
            <path d="M40 80 L28 124 L112 124 L100 80 Z" fill="url(#mageRobe)"/>
            <polygon points="56,80 70,124 84,80" fill="#FEF9C3"/>
            <!-- Cổ áo giấy cắt -->
            <path d="M46 78 Q70 92 94 78 L88 86 Q70 96 52 86 Z" fill="#FDE047"/>
            <!-- Khuôn mặt tròn lineless -->
            <circle cx="70" cy="58" r="22" fill="#FFEDD5"/>
            <!-- Tóc bob dễ thương -->
            <path d="M46 56 Q48 34 70 34 Q92 34 94 56 Q86 45 70 45 Q54 45 46 56 Z" fill="#6D28D9"/>
            <!-- Mắt & Má hồng pastel -->
            <circle cx="62" cy="58" r="3.2" fill="#1E1B4B"/>
            <circle cx="78" cy="58" r="3.2" fill="#1E1B4B"/>
            <circle cx="63" cy="57" r="1.2" fill="#FFFFFF"/>
            <circle cx="79" cy="57" r="1.2" fill="#FFFFFF"/>
            <ellipse cx="55" cy="63" rx="4.5" ry="2.8" fill="#FDA4AF"/>
            <ellipse cx="85" cy="63" rx="4.5" ry="2.8" fill="#FDA4AF"/>
            <path d="M64 65 Q70 71 76 65" fill="none" stroke="#F43F5E" stroke-width="2.6" stroke-linecap="round"/>
            <!-- Mũ Pháp Sư Sao Vàng 2.5D Paper-Cut -->
            <ellipse cx="70" cy="43" rx="38" ry="8" fill="#8B5CF6"/>
            <path d="M38 43 L102 43 L70 8 Z" fill="#A78BFA"/>
            <path d="M46 43 L94 43 L91 37 L49 37 Z" fill="#FDE047"/>
            <polygon points="70,18 73,25 81,25 75,30 77,37 70,33 63,37 65,30 59,25 67,25" fill="#FEF08A"/>
            <!-- Quyền trượng Pha Lê -->
            <rect x="105" y="42" width="6" height="82" rx="3" fill="#FBBF24" transform="rotate(6 108 82)"/>
            <polygon points="110,16 124,33 110,50 96,33" fill="url(#crystalStaff)"/>
            <polygon points="110,20 118,33 110,46 102,33" fill="#ECFEFF"/>
          </g>
          ${slashArc}
        </svg>`;
      }

      // Mặc định: Hiệp Sĩ Kiếm Ánh Sáng Nam (2.5D Paper-Cut Lineless)
      return `
      <svg viewBox="0 0 150 140" class="mk-char-svg ${stateClasses}" aria-label="Hiệp Sĩ Kiếm Ánh Sáng Nam">
        <defs>
          <filter id="mkPaperKnight" x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#0369A1" flood-opacity="0.16"/>
          </filter>
          <linearGradient id="knightArmor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#7DD3FC"/>
            <stop offset="100%" stop-color="#38BDF8"/>
          </linearGradient>
          <linearGradient id="swordBlade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FEF9C3"/>
            <stop offset="55%" stop-color="#7DD3FC"/>
            <stop offset="100%" stop-color="#38BDF8"/>
          </linearGradient>
        </defs>
        <ellipse cx="70" cy="128" rx="40" ry="7" fill="rgba(14, 116, 144, 0.16)"/>
        ${furyHalo}
        <g filter="url(#mkPaperKnight)">
          <!-- Áo choàng Coral Pastel -->
          <path d="M36 76 L22 124 L114 124 L100 76 Z" fill="#FB7185"/>
          <path d="M42 76 L30 124 L106 124 L94 76 Z" fill="#FDA4AF" opacity="0.45"/>
          <!-- Giáp ngực Paper-Cut Sky Blue -->
          <rect x="44" y="76" width="52" height="46" rx="14" fill="url(#knightArmor)"/>
          <rect x="48" y="80" width="44" height="38" rx="11" fill="#E0F2FE" opacity="0.45"/>
          <polygon points="70,83 73,91 82,91 75,96 78,104 70,99 62,104 65,96 58,91 67,91" fill="#FDE047"/>
          <!-- Khuôn mặt tròn tươi sáng -->
          <circle cx="70" cy="55" r="22" fill="#FFEDD5"/>
          <!-- Mũ giáp Hiệp Sĩ Pastel -->
          <path d="M45 49 Q45 22 70 22 Q95 22 95 49 L89 49 Q70 41 51 49 Z" fill="#BAE6FD"/>
          <path d="M50 45 Q70 36 90 45 L88 49 Q70 42 52 49 Z" fill="#38BDF8"/>
          <!-- Chùm lông mũ giáp -->
          <path d="M64 11 Q78 5 88 21 Q75 24 66 23 Z" fill="#FB7185"/>
          <path d="M68 14 Q78 10 84 20 Q75 22 69 21 Z" fill="#FDE047"/>
          <!-- Mắt & Nụ cười -->
          <circle cx="62" cy="55" r="3.2" fill="#0F3D5E"/>
          <circle cx="78" cy="55" r="3.2" fill="#0F3D5E"/>
          <circle cx="63" cy="54" r="1.2" fill="#FFFFFF"/>
          <circle cx="79" cy="54" r="1.2" fill="#FFFFFF"/>
          <ellipse cx="55" cy="60" rx="4.2" ry="2.5" fill="#FDA4AF"/>
          <ellipse cx="85" cy="60" rx="4.2" ry="2.5" fill="#FDA4AF"/>
          <path d="M64 63 Q70 69 76 63" fill="none" stroke="#F43F5E" stroke-width="2.6" stroke-linecap="round"/>
          <!-- Khiên Ánh Sáng bên trái -->
          <path d="M20 74 L48 74 L48 98 Q34 116 20 98 Z" fill="#FBBF24"/>
          <path d="M25 79 L43 79 L43 96 Q34 109 25 96 Z" fill="#FEF9C3"/>
          <polygon points="34,83 36,88 41,88 37,91 38,96 34,93 30,96 31,91 27,88 32,88" fill="#F59E0B"/>
          <!-- Thanh Kiếm Pha Lê bên phải -->
          <polygon points="112,16 121,28 115,82 105,82 103,28" fill="url(#swordBlade)"/>
          <polygon points="112,18 116,28 112,78 108,78 108,28" fill="#FFFFFF" opacity="0.65"/>
          <rect x="97" y="80" width="26" height="7" rx="3.5" fill="#FBBF24"/>
          <rect x="107" y="87" width="6" height="14" rx="3" fill="#F59E0B"/>
        </g>
        ${slashArc}
      </svg>`;
    }

    /**
     * Vẽ Bạn đồng hành Rô-bốt Thông Thái (Ưu tiên dùng ảnh cắt SGK nếu bật, kèm fallback SVG lineless)
     */
    static renderRobotCompanion(size = 56, enableSgkImages = true) {
      const robotUrl = enableSgkImages ? this.getSgkImageUrl('robot_mascot') : '';
      if (robotUrl) {
        return `<img src="${robotUrl}" alt="Rô-bốt Thông Thái SGK" class="mk-robot-avatar-img" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:50%;background:#FFFFFF;box-shadow:0 3px 0 #BAE6FD;padding:2px;" />`;
      }
      return `
      <svg viewBox="0 0 80 80" width="${size}" height="${size}" aria-label="Rô-bốt Thông Thái">
        <circle cx="40" cy="40" r="36" fill="#E0F2FE"/>
        <rect x="38" y="8" width="4" height="12" rx="2" fill="#38BDF8"/>
        <circle cx="40" cy="7" r="5" fill="#FBBF24"/>
        <rect x="20" y="20" width="40" height="34" rx="12" fill="#FFFFFF"/>
        <circle cx="31" cy="34" r="5" fill="#0EA5E9"/>
        <circle cx="49" cy="34" r="5" fill="#0EA5E9"/>
        <path d="M30 45 Q40 51 50 45" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
    }

    /**
     * Vẽ SVG 5 Boss Quái vật theo phong cách 2.5D Paper-Cut Lineless Geometric (Bright & Cheerful):
     * Ải 1: Slime Xanh Bạc Hà (#34D399)
     * Ải 2: Goblin Bàn Tính (#FBBF24)
     * Ải 3: Người Đá Golem Tím (#A78BFA)
     * Ải 4: Pháp Sư Cú Cổ Đại (#38BDF8)
     * Ải 5: Rồng Pha Lê Sapphire (#60A5FA)
     */
    static renderBossSVG(stageId = 1, isHit = false, isAttacking = false) {
      const animClass = isHit ? 'mk-monster-hit' : isAttacking ? 'mk-monster-attack' : 'mk-float-idle';
      const paperFilter = `
        <defs>
          <filter id="mkBossPaper${stageId}" x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="4" stdDeviation="2.2" flood-color="#0F3D5E" flood-opacity="0.16"/>
          </filter>
        </defs>`;
      switch (Number(stageId)) {
        case 1: // Slime Xanh Bạc Hà
          return `
          <svg viewBox="0 0 140 140" class="mk-char-svg ${animClass}" aria-label="Slime Xanh Bạc Hà">
            ${paperFilter}
            <ellipse cx="70" cy="124" rx="46" ry="8" fill="rgba(16, 185, 129, 0.20)"/>
            <g filter="url(#mkBossPaper1)">
              <!-- Lớp giấy nền Mint -->
              <path d="M20 108 Q16 40 70 34 Q124 40 120 108 Q100 122 70 122 Q40 122 20 108 Z" fill="#6EE7B7"/>
              <path d="M25 106 Q22 46 70 40 Q118 46 115 106 Q96 118 70 118 Q44 118 25 106 Z" fill="#34D399"/>
              <ellipse cx="52" cy="58" rx="14" ry="7" fill="#ECFDF5" opacity="0.7" transform="rotate(-18 52 58)"/>
              <!-- Vương miện lá bạc hà Paper-Cut -->
              <path d="M68 36 Q54 16 40 25 Q52 38 68 36 Z" fill="#10B981"/>
              <path d="M72 36 Q86 14 100 25 Q88 38 72 36 Z" fill="#34D399"/>
              <circle cx="70" cy="34" r="5" fill="#FEF08A"/>
              <!-- Đôi mắt tròn dễ thương -->
              <circle cx="52" cy="78" r="9" fill="#FFFFFF"/>
              <circle cx="54" cy="78" r="4.5" fill="#065F46"/>
              <circle cx="55.5" cy="76.5" r="1.6" fill="#FFFFFF"/>
              <circle cx="88" cy="78" r="9" fill="#FFFFFF"/>
              <circle cx="86" cy="78" r="4.5" fill="#065F46"/>
              <circle cx="87.5" cy="76.5" r="1.6" fill="#FFFFFF"/>
              <ellipse cx="42" cy="86" rx="5" ry="3" fill="#FDA4AF" opacity="0.7"/>
              <ellipse cx="98" cy="86" rx="5" ry="3" fill="#FDA4AF" opacity="0.7"/>
              <path d="M56 94 Q70 104 84 94" fill="none" stroke="#065F46" stroke-width="3.5" stroke-linecap="round"/>
            </g>
          </svg>`;
        case 2: // Goblin Bàn Tính
          return `
          <svg viewBox="0 0 140 140" class="mk-char-svg ${animClass}" aria-label="Goblin Bàn Tính">
            ${paperFilter}
            <ellipse cx="70" cy="126" rx="44" ry="8" fill="rgba(245, 158, 11, 0.20)"/>
            <g filter="url(#mkBossPaper2)">
              <!-- Thân áo Sunshine Amber -->
              <path d="M34 78 L26 122 L114 122 L106 78 Z" fill="#FBBF24"/>
              <path d="M42 78 L36 122 L104 122 L98 78 Z" fill="#FDE68A"/>
              <!-- Tai nhọn Pastel Lime -->
              <polygon points="38,54 12,42 36,68" fill="#A3E635"/>
              <polygon points="102,54 128,42 104,68" fill="#A3E635"/>
              <!-- Đầu Goblin tròn -->
              <circle cx="70" cy="58" r="25" fill="#BEF264"/>
              <!-- Mũ chóp Vàng La Mã -->
              <path d="M42 42 L98 42 L70 12 Z" fill="#F59E0B"/>
              <rect x="40" y="38" width="60" height="7" rx="3.5" fill="#FEF08A"/>
              <text x="70" y="34" text-anchor="middle" font-size="11" font-weight="900" fill="#FFFFFF">XII</text>
              <!-- Mắt & Nụ cười -->
              <circle cx="59" cy="56" r="4.5" fill="#1E3A5F"/>
              <circle cx="81" cy="56" r="4.5" fill="#1E3A5F"/>
              <circle cx="60.5" cy="54.5" r="1.5" fill="#FFFFFF"/>
              <circle cx="82.5" cy="54.5" r="1.5" fill="#FFFFFF"/>
              <path d="M58 67 Q70 75 82 67" fill="none" stroke="#15803D" stroke-width="3" stroke-linecap="round"/>
              <!-- Khung Bàn Tính Paper-Cut -->
              <rect x="42" y="84" width="56" height="34" rx="8" fill="#FFFFFF"/>
              <rect x="46" y="88" width="48" height="26" rx="5" fill="#FEF9C3"/>
              <circle cx="56" cy="96" r="4.5" fill="#FB7185"/>
              <circle cx="56" cy="106" r="4.5" fill="#FBBF24"/>
              <circle cx="70" cy="95" r="4.5" fill="#34D399"/>
              <circle cx="84" cy="105" r="4.5" fill="#38BDF8"/>
            </g>
          </svg>`;
        case 3: // Người Đá Golem Tím Pastel
          return `
          <svg viewBox="0 0 140 140" class="mk-char-svg ${animClass}" aria-label="Người Đá Golem Tím">
            ${paperFilter}
            <ellipse cx="70" cy="126" rx="48" ry="8" fill="rgba(139, 92, 246, 0.20)"/>
            <g filter="url(#mkBossPaper3)">
              <!-- Tinh thể pha lê trên vai -->
              <polygon points="22,58 8,32 34,42" fill="#F472B6"/>
              <polygon points="118,58 132,32 106,42" fill="#38BDF8"/>
              <!-- Thân Golem đa giác Paper-Cut -->
              <polygon points="28,122 18,62 44,24 96,24 122,62 112,122" fill="#A78BFA"/>
              <polygon points="36,118 28,64 48,30 92,30 112,64 104,118" fill="#C4B5FD"/>
              <polygon points="44,24 70,48 96,24" fill="#EDE9FE"/>
              <!-- Lõi năng lượng biểu thức phát sáng -->
              <polygon points="70,72 86,90 70,108 54,90" fill="#FEF08A"/>
              <polygon points="70,77 80,90 70,103 60,90" fill="#FFFFFF"/>
              <!-- Đôi mắt sáng hiền hòa -->
              <circle cx="54" cy="58" r="6" fill="#FEF9C3"/>
              <circle cx="86" cy="58" r="6" fill="#FEF9C3"/>
              <circle cx="54" cy="58" r="3" fill="#6D28D9"/>
              <circle cx="86" cy="58" r="3" fill="#6D28D9"/>
              <rect x="56" y="112" width="28" height="4" rx="2" fill="#7C3AED"/>
            </g>
          </svg>`;
        case 4: // Pháp Sư Cú Cổ Đại
          return `
          <svg viewBox="0 0 140 140" class="mk-char-svg ${animClass}" aria-label="Pháp Sư Cú Cổ Đại">
            ${paperFilter}
            <ellipse cx="70" cy="126" rx="42" ry="8" fill="rgba(14, 165, 233, 0.18)"/>
            <g filter="url(#mkBossPaper4)">
              <!-- Đôi cánh Aqua Paper-Cut -->
              <path d="M32 70 Q10 86 24 114 Q38 108 42 92 Z" fill="#38BDF8"/>
              <path d="M108 70 Q130 86 116 114 Q102 108 98 92 Z" fill="#38BDF8"/>
              <!-- Thân Cú Thông Thái -->
              <ellipse cx="70" cy="84" rx="35" ry="38" fill="#7DD3FC"/>
              <ellipse cx="70" cy="90" rx="24" ry="27" fill="#FFFFFF"/>
              <!-- Họa tiết lông ngực -->
              <path d="M60 88 Q65 93 70 88 Q75 93 80 88" fill="none" stroke="#BAE6FD" stroke-width="3" stroke-linecap="round"/>
              <path d="M56 98 Q63 103 70 98 Q77 103 84 98" fill="none" stroke="#BAE6FD" stroke-width="3" stroke-linecap="round"/>
              <!-- Đôi mắt kính tròn vàng tươi -->
              <circle cx="55" cy="58" r="13" fill="#FEF08A"/>
              <circle cx="85" cy="58" r="13" fill="#FEF08A"/>
              <circle cx="55" cy="58" r="10" fill="#FFFFFF"/>
              <circle cx="85" cy="58" r="10" fill="#FFFFFF"/>
              <circle cx="56" cy="58" r="4.5" fill="#0F3D5E"/>
              <circle cx="84" cy="58" r="4.5" fill="#0F3D5E"/>
              <!-- Mỏ vàng & Mũ Pháp sư -->
              <polygon points="64,64 76,64 70,75" fill="#FBBF24"/>
              <ellipse cx="70" cy="41" rx="36" ry="7" fill="#0284C7"/>
              <path d="M38 41 L102 41 L70 10 Z" fill="#38BDF8"/>
              <polygon points="70,18 73,26 81,26 75,31 77,38 70,34 63,38 65,31 59,26 67,26" fill="#FEF08A"/>
            </g>
          </svg>`;
        default: // Ải 5: Rồng Pha Lê Sapphire (Bright Pastel Sky & Gold)
          return `
          <svg viewBox="0 0 140 140" class="mk-char-svg ${animClass}" aria-label="Rồng Pha Lê Sapphire">
            ${paperFilter}
            <ellipse cx="70" cy="126" rx="50" ry="8" fill="rgba(59, 130, 246, 0.20)"/>
            <g filter="url(#mkBossPaper5)">
              <!-- Đôi cánh Pha Lê Sapphire Paper-Cut -->
              <path d="M40 68 L6 24 L18 66 L8 94 L42 86 Z" fill="#93C5FD"/>
              <path d="M38 68 L14 34 L24 66 L16 86 L40 82 Z" fill="#DBEAFE"/>
              <path d="M100 68 L134 24 L122 66 L132 94 L98 86 Z" fill="#93C5FD"/>
              <path d="M102 68 L126 34 L116 66 L124 86 L100 82 Z" fill="#DBEAFE"/>
              <!-- Thân Rồng Sapphire -->
              <ellipse cx="70" cy="84" rx="32" ry="35" fill="#60A5FA"/>
              <polygon points="70,60 88,84 70,114 52,84" fill="#E0F2FE"/>
              <polygon points="70,66 82,84 70,106 58,84" fill="#FEF9C3"/>
              <!-- Đầu & Vương miện Sừng Pha Lê -->
              <circle cx="70" cy="46" r="22" fill="#3B82F6"/>
              <polygon points="54,28 38,6 63,23" fill="#A5F3FC"/>
              <polygon points="86,28 102,6 77,23" fill="#A5F3FC"/>
              <polygon points="63,26 70,6 77,26" fill="#FDE047"/>
              <circle cx="61" cy="45" r="4.5" fill="#FFFFFF"/>
              <circle cx="79" cy="45" r="4.5" fill="#FFFFFF"/>
              <circle cx="61" cy="45" r="2.2" fill="#1E3A8A"/>
              <circle cx="79" cy="45" r="2.2" fill="#1E3A8A"/>
              <ellipse cx="52" cy="51" rx="4" ry="2.5" fill="#FDA4AF"/>
              <ellipse cx="88" cy="51" rx="4" ry="2.5" fill="#FDA4AF"/>
            </g>
          </svg>`;
      }
    }

    /**
     * Vẽ Phông nền cảnh vật 2.5D Paper-Cut Storybook đa lớp cho 5 Ải:
     * Lineless geometric art style, bright sunshine and pastel color palette, soft layered drop shadows.
     */
    static renderSceneBackdropSVG(stageId = 1) {
      const st = Number(stageId) || 1;
      const sharedDefs = `
        <defs>
          <filter id="mkPaperLayer" x="-5%" y="-10%" width="110%" height="125%">
            <feDropShadow dx="0" dy="-3" stdDeviation="3" flood-color="#0F3D5E" flood-opacity="0.08"/>
          </filter>
          <filter id="mkCloudShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="2.5" flood-color="#0284C7" flood-opacity="0.10"/>
          </filter>
        </defs>`;

      if (st === 1) {
        // Ải 1: Khu Rừng Khởi Đầu (Sunshine Mint & Pastel Meadow Paper-Cut)
        return `
        <svg viewBox="0 0 1120 260" preserveAspectRatio="none" class="mk-scene-svg" aria-hidden="true">
          ${sharedDefs}
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E0F7FA"/>
            <stop offset="55%" stop-color="#FFFDF5"/>
            <stop offset="100%" stop-color="#FEF9C3"/>
          </linearGradient>
          <rect width="1120" height="260" fill="url(#sky1)"/>
          <!-- Mặt trời Paper-Cut nhiều vòng sáng -->
          <circle cx="920" cy="54" r="58" fill="#FEF9C3" opacity="0.7"/>
          <circle cx="920" cy="54" r="42" fill="#FEF08A" opacity="0.85"/>
          <circle cx="920" cy="54" r="28" fill="#FDE047"/>
          <!-- Mây giấy cắt nổi 2.5D -->
          <g filter="url(#mkCloudShadow)" fill="#FFFFFF">
            <path d="M130 62 Q145 40 172 48 Q195 34 218 52 Q238 54 235 72 L122 72 Q115 62 130 62 Z"/>
            <path d="M620 48 Q638 28 662 36 Q685 24 706 42 Q724 44 720 60 L612 60 Q606 50 620 48 Z"/>
          </g>
          <!-- Lớp đồi giấy cắt xa -->
          <path d="M0 185 Q200 105 440 175 T880 160 T1120 175 L1120 260 L0 260 Z" fill="#D1FAE5" filter="url(#mkPaperLayer)"/>
          <!-- Lớp đồi giấy cắt giữa -->
          <path d="M0 198 Q280 135 560 190 T1120 182 L1120 260 L0 260 Z" fill="#A7F3D0" filter="url(#mkPaperLayer)"/>
          <!-- Cây hình học lineless 2 bên -->
          <g filter="url(#mkCloudShadow)">
            <rect x="74" y="132" width="12" height="68" rx="6" fill="#F59E0B"/>
            <circle cx="80" cy="112" r="36" fill="#6EE7B7"/>
            <circle cx="62" cy="126" r="24" fill="#34D399"/>
            <circle cx="98" cy="126" r="24" fill="#A7F3D0"/>
            <rect x="1028" y="128" width="12" height="72" rx="6" fill="#F59E0B"/>
            <polygon points="1034,70 1072,146 996,146" fill="#34D399"/>
            <polygon points="1034,92 1066,158 1002,158" fill="#6EE7B7"/>
          </g>
          <!-- Mặt đất phẳng Paper-Cut tươi sáng để nhân vật đứng -->
          <rect x="0" y="196" width="1120" height="64" fill="#6EE7B7" filter="url(#mkPaperLayer)"/>
          <rect x="0" y="204" width="1120" height="56" fill="#34D399"/>
          <rect x="0" y="194" width="1120" height="5" fill="#ECFDF5"/>
        </svg>`;
      }
      if (st === 2) {
        // Ải 2: Thung Lũng Cầu Vồng (Pastel Rainbow & Buttercup Hills)
        return `
        <svg viewBox="0 0 1120 260" preserveAspectRatio="none" class="mk-scene-svg" aria-hidden="true">
          ${sharedDefs}
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFDF5"/>
            <stop offset="60%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#FEF9C3"/>
          </linearGradient>
          <rect width="1120" height="260" fill="url(#sky2)"/>
          <!-- Cầu vồng Pastel 2.5D Paper-Cut -->
          <path d="M160 205 Q560 -55 960 205" fill="none" stroke="#FDA4AF" stroke-width="16" opacity="0.75"/>
          <path d="M176 205 Q560 -35 944 205" fill="none" stroke="#FDE047" stroke-width="16" opacity="0.8"/>
          <path d="M192 205 Q560 -15 928 205" fill="none" stroke="#6EE7B7" stroke-width="16" opacity="0.8"/>
          <path d="M208 205 Q560 5 912 205" fill="none" stroke="#93C5FD" stroke-width="16" opacity="0.8"/>
          <!-- Mây trắng bồng bềnh -->
          <g filter="url(#mkCloudShadow)" fill="#FFFFFF">
            <circle cx="170" cy="175" r="26"/><circle cx="198" cy="170" r="32"/><circle cx="228" cy="178" r="24"/>
            <circle cx="890" cy="178" r="24"/><circle cx="920" cy="170" r="32"/><circle cx="950" cy="176" r="26"/>
          </g>
          <!-- Đồi vàng bơ Pastel -->
          <path d="M0 186 Q280 130 560 184 T1120 176 L1120 260 L0 260 Z" fill="#FEF08A" filter="url(#mkPaperLayer)"/>
          <!-- Mặt đất phẳng Sunshine Gold -->
          <rect x="0" y="196" width="1120" height="64" fill="#FDE047" filter="url(#mkPaperLayer)"/>
          <rect x="0" y="204" width="1120" height="56" fill="#FACC15"/>
          <rect x="0" y="194" width="1120" height="5" fill="#FFFBEB"/>
        </svg>`;
      }
      if (st === 3) {
        // Ải 3: Hang Động Pha Lê (Bright Pastel Lavender, Rose Quartz & Mint Crystal Grotto)
        return `
        <svg viewBox="0 0 1120 260" preserveAspectRatio="none" class="mk-scene-svg" aria-hidden="true">
          ${sharedDefs}
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFDF7"/>
            <stop offset="55%" stop-color="#FAF5FF"/>
            <stop offset="100%" stop-color="#EDE9FE"/>
          </linearGradient>
          <rect width="1120" height="260" fill="url(#sky3)"/>
          <!-- Vòm hang giấy cắt Pastel Lavender -->
          <path d="M0 0 L1120 0 L1120 95 Q860 35 560 65 T0 85 Z" fill="#F3E8FF" filter="url(#mkCloudShadow)"/>
          <!-- Cụm tinh thể Pha Lê Pastel 2 bên -->
          <g filter="url(#mkCloudShadow)">
            <polygon points="65,196 95,108 125,196" fill="#F9A8D4"/>
            <polygon points="105,196 128,132 150,196" fill="#A5F3FC"/>
            <polygon points="965,196 995,104 1025,196" fill="#C4B5FD"/>
            <polygon points="1010,196 1035,128 1060,196" fill="#FDE68A"/>
          </g>
          <!-- Đồi thạch anh hồng & tím nhạt -->
          <path d="M0 188 Q300 138 600 186 T1120 180 L1120 260 L0 260 Z" fill="#E9D5FF" filter="url(#mkPaperLayer)"/>
          <!-- Mặt đất phẳng Pastel Lilac -->
          <rect x="0" y="196" width="1120" height="64" fill="#DDD6FE" filter="url(#mkPaperLayer)"/>
          <rect x="0" y="204" width="1120" height="56" fill="#C4B5FD"/>
          <rect x="0" y="194" width="1120" height="5" fill="#FAF5FF"/>
        </svg>`;
      }
      if (st === 4) {
        // Ải 4: Thác Nước Tri Thức (Bright Aqua Lagoon & Sunshine Sky)
        return `
        <svg viewBox="0 0 1120 260" preserveAspectRatio="none" class="mk-scene-svg" aria-hidden="true">
          ${sharedDefs}
          <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFDF5"/>
            <stop offset="55%" stop-color="#ECFEFF"/>
            <stop offset="100%" stop-color="#CFFAFE"/>
          </linearGradient>
          <rect width="1120" height="260" fill="url(#sky4)"/>
          <!-- Vách đá Paper-Cut Pastel Teal & Thác nước lấp lánh ở giữa -->
          <path d="M0 196 L0 82 L380 82 L425 196 Z" fill="#BAE6FD" filter="url(#mkPaperLayer)"/>
          <path d="M1120 196 L1120 78 L740 78 L695 196 Z" fill="#BAE6FD" filter="url(#mkPaperLayer)"/>
          <rect x="415" y="78" width="290" height="118" fill="#67E8F9"/>
          <rect x="455" y="78" width="36" height="118" fill="#ECFEFF" opacity="0.75"/>
          <rect x="542" y="78" width="44" height="118" fill="#FFFFFF" opacity="0.85"/>
          <rect x="635" y="78" width="32" height="118" fill="#ECFEFF" opacity="0.75"/>
          <!-- Bọt nước đám mây chân thác -->
          <g fill="#FFFFFF" filter="url(#mkCloudShadow)">
            <circle cx="445" cy="192" r="18"/><circle cx="495" cy="190" r="22"/><circle cx="560" cy="188" r="25"/><circle cx="625" cy="190" r="22"/><circle cx="675" cy="192" r="18"/>
          </g>
          <!-- Mặt đất phẳng bờ thác Aqua -->
          <rect x="0" y="196" width="1120" height="64" fill="#7DD3FC" filter="url(#mkPaperLayer)"/>
          <rect x="0" y="204" width="1120" height="56" fill="#38BDF8"/>
          <rect x="0" y="194" width="1120" height="5" fill="#F0F9FF"/>
        </svg>`;
      }
      // Ải 5: Đỉnh Núi Pha Lê (Golden Sunshine & Pastel Sapphire Peaks - Cheerful Storybook Finale)
      return `
      <svg viewBox="0 0 1120 260" preserveAspectRatio="none" class="mk-scene-svg" aria-hidden="true">
        ${sharedDefs}
        <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FEF9C3"/>
          <stop offset="55%" stop-color="#E0F2FE"/>
          <stop offset="100%" stop-color="#DBEAFE"/>
        </linearGradient>
        <rect width="1120" height="260" fill="url(#sky5)"/>
        <!-- Mặt trời vương miện phát sáng giữa đỉnh núi -->
        <circle cx="560" cy="68" r="64" fill="#FEF08A" opacity="0.65"/>
        <circle cx="560" cy="68" r="44" fill="#FDE047" opacity="0.85"/>
        <!-- Đỉnh núi tuyết Pha Lê Paper-Cut -->
        <polygon points="30,196 220,54 410,196" fill="#93C5FD" filter="url(#mkPaperLayer)"/>
        <polygon points="220,54 168,93 220,82 272,93" fill="#FFFFFF"/>
        <polygon points="710,196 900,50 1090,196" fill="#93C5FD" filter="url(#mkPaperLayer)"/>
        <polygon points="900,50 846,90 900,78 954,90" fill="#FFFFFF"/>
        <polygon points="470,196 560,82 650,196" fill="#BAE6FD" filter="url(#mkPaperLayer)"/>
        <!-- Mặt đất phẳng Đỉnh Núi Sapphire Pastel -->
        <rect x="0" y="196" width="1120" height="64" fill="#93C5FD" filter="url(#mkPaperLayer)"/>
        <rect x="0" y="204" width="1120" height="56" fill="#60A5FA"/>
        <rect x="0" y="194" width="1120" height="5" fill="#FFFFFF"/>
      </svg>`;
    }

    /**
     * Vẽ SVG Viên Đá Pha Lê 2.5D Paper-Cut Lineless (sáng rực khi đã khôi phục hoặc pastel mờ khi bị phong ấn)
     */
    static renderCrystalSVG(stageId = 1, unlocked = false, size = 44) {
      const st = STAGES_CONFIG.find((s) => s.id === Number(stageId)) || STAGES_CONFIG[0];
      const fill = unlocked ? st.crystalColor : '#E2E8F0';
      const glow = unlocked ? st.crystalGlow : '#F1F5F9';
      return `
      <svg viewBox="0 0 64 64" width="${size}" height="${size}" class="mk-crystal-svg ${unlocked ? 'mk-crystal-active' : ''}" aria-label="${st.crystalName}">
        <polygon points="32,4 55,22 46,58 18,58 9,22" fill="${fill}"/>
        <polygon points="32,6 45,22 32,53 19,22" fill="${glow}" opacity="0.85"/>
        <polygon points="32,6 32,53 19,22" fill="#FFFFFF" opacity="${unlocked ? '0.45' : '0.2'}"/>
        <circle cx="25" cy="18" r="3.2" fill="#FFFFFF" opacity="${unlocked ? '0.95' : '0.4'}"/>
      </svg>`;
    }

    /**
     * Sinh chuỗi SVG/HTML trực quan cho thuộc tính q.svgVisual dựa trên visualData
     */
    static buildRawVisualSVG(v) {
      if (!v || !v.type) return '';
      switch (v.type) {
        case 'clock':
          return this.drawClockSVG(v.hour, v.minute, false);
        case 'roman_clock':
          return this.drawClockSVG(v.hour, v.minute || 0, true, v.highlightRoman);
        case 'midpoint':
          return this.drawMidpointSVG(v.pLeft || 'A', v.pMid || 'M', v.pRight || 'B', v.halfLen || 5, v.totalLen || 10, v.hidePart);
        case 'circle':
          return this.drawCircleSVG(v.center || 'O', v.radius || 4, v.diameter || 8, v.askType);
        case 'angle':
          return this.drawAngleEkeSVG(v.isRightAngle, v.vertex || 'O', v.arm1 || 'A', v.arm2 || 'B');
        case 'rect_grid':
          return this.drawRectGridSVG(v.length, v.width, v.unit || 'cm', v.showGrid);
        case 'mm_ruler':
          return this.drawMmRulerSVG(v.cmVal || 3, v.mmVal || 30);
        case 'stats_table':
          return this.drawStatsTableHTML(v.title, v.headers, v.rows);
        case 'prob_box':
          return this.drawProbBoxSVG(v.items || []);
        case 'expression_path':
          return this.drawExpressionCardSVG(v.exprText, v.hintRule);
        default:
          return '';
      }
    }

    /**
     * Trực quan hóa câu hỏi Toán học bằng SVG động + Nút/Khung đối chiếu hình gốc SGK Kết nối tri thức
     */
    static renderQuestionVisual(q, enableSgkImages = true) {
      if (!q) return '';
      const svgHtml = q.svgVisual || this.buildRawVisualSVG(q.visualData);

      // Kiểm tra hình minh họa gốc cắt từ SGK Kết nối tri thức
      let sgkHtml = '';
      if (enableSgkImages && q.sgkAssetKey) {
        const asset = this.getSgkAsset(q.sgkAssetKey);
        const imgUrl = this.getSgkImageUrl(q.sgkAssetKey);
        if (asset && imgUrl) {
          sgkHtml = `
          <button type="button" class="mk-sgk-drawer" data-open-sgk="${q.sgkAssetKey}" title="Bấm để mở hộp thoại phóng to xem rõ hình SGK và quy tắc">
            <span class="mk-sgk-summary">
              <span>🔍 Xem Hình & Bí Kíp SGK (${asset.lesson})</span>
              <span style="color:#0284C7;font-weight:900;">Mở rộng ⤢</span>
            </span>
          </button>`;
        }
      }

      if (!svgHtml && !sgkHtml) return '';
      return `
        <div class="mk-visual-wrapper">
          ${svgHtml ? `<div class="mk-dynamic-svg-box">${svgHtml}</div>` : ''}
          ${sgkHtml}
        </div>
      `;
    }

    /**
     * Vẽ Đồng hồ mặt tròn chuẩn Bài 66 (60 vạch phút đỏ) hoặc Bài 47 (Chữ số La Mã I..XII)
     */
    static drawClockSVG(hour = 8, minute = 15, isRoman = false, highlightRoman = '') {
      const cx = 110;
      const cy = 110;
      const r = 88;
      const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

      let ticks = '';
      for (let i = 0; i < 60; i++) {
        const deg = i * 6;
        const rad = ((deg - 90) * Math.PI) / 180;
        const isHourMark = i % 5 === 0;
        const rOuter = r - 4;
        const rInner = isHourMark ? r - 13 : r - 8;
        const x1 = cx + rInner * Math.cos(rad);
        const y1 = cy + rInner * Math.sin(rad);
        const x2 = cx + rOuter * Math.cos(rad);
        const y2 = cy + rOuter * Math.sin(rad);
        ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${isHourMark ? '#1E293B' : '#EF4444'}" stroke-width="${isHourMark ? '2.6' : '1.3'}"/>`;
      }

      let numbers = '';
      for (let h = 0; h < 12; h++) {
        const numText = isRoman ? romanNumerals[h] : (h === 0 ? '12' : String(h));
        const deg = h * 30;
        const rad = ((deg - 90) * Math.PI) / 180;
        const nr = isRoman ? r - 25 : r - 24;
        const nx = cx + nr * Math.cos(rad);
        const ny = cy + nr * Math.sin(rad) + 5;
        const isHighlighted = highlightRoman && numText === highlightRoman;
        numbers += `<text x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" text-anchor="middle" font-size="${isRoman ? '12.5' : '15'}" font-weight="800" fill="${isHighlighted ? '#E11D48' : '#0F172A'}">${numText}</text>`;
      }

      const minAngle = minute * 6;
      const hourAngle = ((hour % 12) + minute / 60) * 30;
      const minRad = ((minAngle - 90) * Math.PI) / 180;
      const hourRad = ((hourAngle - 90) * Math.PI) / 180;

      const hx = cx + 44 * Math.cos(hourRad);
      const hy = cy + 44 * Math.sin(hourRad);
      const mx = cx + 66 * Math.cos(minRad);
      const my = cy + 66 * Math.sin(minRad);

      return `
      <svg viewBox="0 0 220 220" width="195" height="195" aria-label="Đồng hồ Toán 3">
        <circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="#F59E0B" stroke="#78350F" stroke-width="3"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFBEB" stroke="#1E293B" stroke-width="2"/>
        ${ticks}
        ${numbers}
        <!-- Kim giờ (ngắn, màu đỏ đậm) -->
        <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#E11D48" stroke-width="5.5" stroke-linecap="round"/>
        <!-- Kim phút (dài, màu xanh dương) -->
        <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#0284C7" stroke-width="3.8" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="5.5" fill="#1E293B"/>
      </svg>`;
    }

    /**
     * Vẽ Đoạn thẳng và Trung điểm M (Bài 16 SGK Tập 1)
     */
    static drawMidpointSVG(pLeft = 'A', pMid = 'M', pRight = 'B', halfLen = 6, totalLen = 12, hidePart = 'half') {
      const leftLabel = hidePart === 'half' ? '? cm' : `${halfLen} cm`;
      const rightLabel = hidePart === 'half' ? '? cm' : `${halfLen} cm`;
      const totalLabel = hidePart === 'total' ? `Đoạn thẳng ${pLeft}${pRight} = ? cm` : `Đoạn thẳng ${pLeft}${pRight} = ${totalLen} cm`;

      return `
      <svg viewBox="0 0 340 110" width="320" height="105" aria-label="Trung điểm của đoạn thẳng">
        <rect x="4" y="4" width="332" height="102" rx="12" fill="#F0FDF4" stroke="#10B981" stroke-width="2"/>
        <!-- Đoạn thẳng AB -->
        <line x1="45" y1="54" x2="295" y2="54" stroke="#0F172A" stroke-width="4"/>
        <!-- Vạch dấu bằng nhau -->
        <line x1="105" y1="47" x2="111" y2="61" stroke="#E11D48" stroke-width="2.5"/>
        <line x1="229" y1="47" x2="235" y2="61" stroke="#E11D48" stroke-width="2.5"/>
        <!-- 3 điểm A, M, B -->
        <circle cx="45" cy="54" r="5.5" fill="#059669"/>
        <circle cx="170" cy="54" r="6" fill="#E11D48"/>
        <circle cx="295" cy="54" r="5.5" fill="#059669"/>
        <text x="45" y="78" text-anchor="middle" font-size="16" font-weight="800" fill="#0F172A">${pLeft}</text>
        <text x="170" y="78" text-anchor="middle" font-size="16" font-weight="800" fill="#E11D48">${pMid} (Trung điểm)</text>
        <text x="295" y="78" text-anchor="middle" font-size="16" font-weight="800" fill="#0F172A">${pRight}</text>
        <!-- Nhãn độ dài -->
        <text x="107" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#0284C7">${leftLabel}</text>
        <text x="232" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#0284C7">${rightLabel}</text>
        <text x="170" y="98" text-anchor="middle" font-size="13.5" font-weight="800" fill="#047857">${totalLabel}</text>
      </svg>`;
    }

    /**
     * Vẽ Hình tròn tâm O, bán kính OM, đường kính AB (Bài 17 SGK Tập 1)
     */
    static drawCircleSVG(center = 'O', radius = 5, diameter = 10, askType = 'diameter') {
      const rLabel = askType === 'radius' ? 'r = ? cm' : `r = ${radius} cm`;
      const dLabel = askType === 'diameter' ? 'AB = ? cm' : `AB = ${diameter} cm`;

      return `
      <svg viewBox="0 0 240 190" width="225" height="178" aria-label="Hình tròn tâm O">
        <circle cx="120" cy="95" r="72" fill="#E0F2FE" stroke="#0284C7" stroke-width="3.2"/>
        <!-- Đường kính AB -->
        <line x1="48" y1="95" x2="192" y2="95" stroke="#0F172A" stroke-width="3"/>
        <!-- Bán kính OM -->
        <line x1="120" y1="95" x2="171" y2="44" stroke="#E11D48" stroke-width="3" stroke-dasharray="5 3"/>
        <circle cx="48" cy="95" r="4.5" fill="#0F172A"/>
        <circle cx="192" cy="95" r="4.5" fill="#0F172A"/>
        <circle cx="120" cy="95" r="5" fill="#E11D48"/>
        <circle cx="171" cy="44" r="4.5" fill="#E11D48"/>
        <text x="34" y="100" font-size="15" font-weight="800" fill="#0F172A">A</text>
        <text x="200" y="100" font-size="15" font-weight="800" fill="#0F172A">B</text>
        <text x="120" y="114" text-anchor="middle" font-size="15" font-weight="800" fill="#E11D48">${center}</text>
        <text x="182" y="40" font-size="15" font-weight="800" fill="#E11D48">M</text>
        <text x="155" y="78" font-size="13" font-weight="800" fill="#E11D48">${rLabel}</text>
        <text x="120" y="183" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0369A1">Đường kính ${dLabel}</text>
      </svg>`;
    }

    /**
     * Vẽ Góc vuông / Góc không vuông kèm Thước Ê-ke đặt kiểm tra (Bài 18 SGK Tập 1)
     */
    static drawAngleEkeSVG(isRightAngle = true, vertex = 'O', arm1 = 'A', arm2 = 'B') {
      const arm2X = isRightAngle ? 75 : 118;
      const arm2Y = isRightAngle ? 26 : 32;
      return `
      <svg viewBox="0 0 240 165" width="230" height="158" aria-label="Kiểm tra góc bằng thước Ê-ke">
        <rect x="4" y="4" width="232" height="157" rx="12" fill="#FEFCE8" stroke="#F59E0B" stroke-width="2"/>
        <!-- Thước Ê-ke tam giác vuông màu vàng trong suốt đặt tại đỉnh O -->
        <polygon points="75,125 75,45 155,125" fill="rgba(250,204,21,0.38)" stroke="#CA8A04" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="104" y="115" font-size="11" font-weight="700" fill="#854D0E">Ê-ke</text>
        ${isRightAngle ? `<rect x="75" y="109" width="16" height="16" fill="none" stroke="#E11D48" stroke-width="2.5"/>` : ''}
        <!-- Hai cạnh của góc -->
        <line x1="75" y1="125" x2="195" y2="125" stroke="#0F172A" stroke-width="3.8" stroke-linecap="round"/>
        <line x1="75" y1="125" x2="${arm2X}" y2="${arm2Y}" stroke="#0F172A" stroke-width="3.8" stroke-linecap="round"/>
        <circle cx="75" cy="125" r="5" fill="#E11D48"/>
        <text x="58" y="132" font-size="15" font-weight="800" fill="#E11D48">${vertex}</text>
        <text x="204" y="130" font-size="15" font-weight="800" fill="#0F172A">${arm2}</text>
        <text x="${arm2X - 16}" y="${arm2Y + 4}" font-size="15" font-weight="800" fill="#0F172A">${arm1}</text>
      </svg>`;
    }

    /**
     * Vẽ Hình chữ nhật / Hình vuông trên lưới ô vuông 1 cm² (Bài 50, 52 SGK Tập 2)
     */
    static drawRectGridSVG(length = 6, width = 4, unit = 'cm', showGrid = true) {
      const cols = Math.min(10, Math.max(2, Number(length) || 5));
      const rows = Math.min(7, Math.max(2, Number(width) || 3));
      const cell = 22;
      const rw = cols * cell;
      const rh = rows * cell;
      const startX = Math.round((280 - rw) / 2);
      const startY = 34;

      let gridLines = '';
      if (showGrid && Number(length) <= 10 && Number(width) <= 7) {
        for (let c = 1; c < cols; c++) {
          const x = startX + c * cell;
          gridLines += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY + rh}" stroke="#93C5FD" stroke-width="1.2"/>`;
        }
        for (let r = 1; r < rows; r++) {
          const y = startY + r * cell;
          gridLines += `<line x1="${startX}" y1="${y}" x2="${startX + rw}" y2="${y}" stroke="#93C5FD" stroke-width="1.2"/>`;
        }
      }

      const isSquare = length === width;
      return `
      <svg viewBox="0 0 280 ${rh + 64}" width="265" height="${rh + 60}" aria-label="Hình học trên lưới ô vuông">
        <rect x="${startX}" y="${startY}" width="${rw}" height="${rh}" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="3"/>
        ${gridLines}
        <text x="${startX + rw / 2}" y="${startY - 10}" text-anchor="middle" font-size="15" font-weight="800" fill="#1E3A8A">${isSquare ? `Cạnh = ${length} ${unit}` : `Chiều dài = ${length} ${unit}`}</text>
        ${!isSquare ? `<text x="${startX + rw + 8}" y="${startY + rh / 2 + 5}" font-size="14" font-weight="800" fill="#047857">${width} ${unit}</text>` : ''}
      </svg>`;
    }

    /**
     * Vẽ Thước đo độ dài Mi-li-mét (Bài 30 SGK Tập 1)
     */
    static drawMmRulerSVG(cmVal = 4, mmVal = 40) {
      const maxCm = Math.max(5, Math.min(8, Number(cmVal) + 1));
      let marks = '';
      for (let m = 0; m <= maxCm * 10; m++) {
        const x = 24 + m * 5;
        const isCm = m % 10 === 0;
        const isHalf = m % 5 === 0 && !isCm;
        const h = isCm ? 18 : isHalf ? 13 : 8;
        marks += `<line x1="${x}" y1="48" x2="${x}" y2="${48 + h}" stroke="#1E293B" stroke-width="${isCm ? '2' : '1'}"/>`;
        if (isCm) {
          marks += `<text x="${x}" y="82" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${m / 10}</text>`;
        }
      }
      const barWidth = Math.min(maxCm * 10, Number(cmVal) * 10) * 5;
      return `
      <svg viewBox="0 0 340 105" width="320" height="98" aria-label="Thước đo mi-li-mét">
        <!-- Bút chì / Băng giấy cần đo -->
        <rect x="24" y="18" width="${barWidth}" height="18" rx="4" fill="#FB7185" stroke="#9F1239" stroke-width="2"/>
        <text x="${24 + barWidth / 2}" y="31" text-anchor="middle" font-size="12" font-weight="800" fill="#FFFFFF">${cmVal} cm = ? mm</text>
        <!-- Thân thước kẻ -->
        <rect x="14" y="48" width="${maxCm * 50 + 24}" height="44" rx="6" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/>
        ${marks}
        <text x="${maxCm * 50 + 26}" y="82" font-size="11" font-weight="800" fill="#854D0E">cm</text>
      </svg>`;
    }

    /**
     * Vẽ Bảng số liệu thống kê (Bài 73, 75 SGK Tập 2)
     */
    static drawStatsTableHTML(title = 'Bảng số liệu', headers = [], rows = []) {
      const thHtml = headers.map((h) => `<th>${h}</th>`).join('');
      const trHtml = rows
        .map((r) => `<tr>${r.map((cell, idx) => `<td class="${idx === 0 ? 'mk-td-label' : 'mk-td-num'}">${cell}</td>`).join('')}</tr>`)
        .join('');
      return `
      <div class="mk-stats-table-wrap">
        <div class="mk-stats-table-title">📊 ${title}</div>
        <table class="mk-stats-table">
          <thead><tr>${thHtml}</tr></thead>
          <tbody>${trHtml}</tbody>
        </table>
      </div>`;
    }

    /**
     * Vẽ Hộp bóng màu xác suất (Bài 74 SGK Tập 2)
     */
    static drawProbBoxSVG(items = []) {
      let balls = '';
      items.forEach((b, idx) => {
        const cx = 56 + idx * 44;
        const cy = 58;
        balls += `
          <circle cx="${cx}" cy="${cy}" r="17" fill="${b.color}" stroke="#1E293B" stroke-width="2"/>
          <circle cx="${cx - 5}" cy="${cy - 5}" r="4" fill="#FFFFFF" opacity="0.7"/>
          <text x="${cx}" y="94" text-anchor="middle" font-size="11.5" font-weight="800" fill="#1E293B">${b.label}</text>
        `;
      });
      const width = Math.max(240, items.length * 46 + 44);
      return `
      <svg viewBox="0 0 ${width} 112" width="${width}" height="106" aria-label="Hộp bóng màu của Rô-bốt">
        <rect x="16" y="18" width="${width - 32}" height="84" rx="14" fill="#F8FAFC" stroke="#6366F1" stroke-width="2.8" stroke-dasharray="6 4"/>
        <text x="${width / 2}" y="33" text-anchor="middle" font-size="12" font-weight="800" fill="#4338CA">🎁 Hộp bóng của Rô-bốt</text>
        ${balls}
      </svg>`;
    }

    /**
     * Vẽ Thẻ Biểu thức số nổi bật (Bài 38 SGK Tập 1)
     */
    static drawExpressionCardSVG(exprText = '', hintRule = '') {
      return `
      <div class="mk-expr-visual-card">
        <div class="mk-expr-formula">${exprText} = ?</div>
        ${hintRule ? `<div class="mk-expr-rule">💡 Quy tắc Rô-bốt: ${hintRule}</div>` : ''}
      </div>`;
    }
  }

  /* ==========================================================================
   * 3. MODULE MATHENGINE (BỘ SINH ĐỀ ĐỘNG 100% TOÁN 3 KẾT NỐI TRI THỨC)
   * ========================================================================== */
  class MathEngine {
    static randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    static shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    static formatNum(n) {
      if (typeof n !== 'number') return String(n);
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    static makeNumericOptions(correctNum, unit = '', deltas = null) {
      const set = new Set([correctNum]);
      const customDeltas = deltas || [-20, -10, -5, -3, -2, -1, 1, 2, 3, 5, 10, 20];
      let guard = 0;
      while (set.size < 4 && guard < 40) {
        guard++;
        const d = this.pick(customDeltas);
        const cand = correctNum + d;
        if (cand >= 0 && cand !== correctNum) {
          set.add(cand);
        }
      }
      let step = 1;
      while (set.size < 4) {
        set.add(correctNum + step);
        step++;
      }
      return this.shuffle(
        Array.from(set).map((val) => (unit ? `${this.formatNum(val)} ${unit}` : this.formatNum(val)))
      );
    }

    /**
     * Chuẩn hóa cấu trúc câu hỏi trả về từ MathEngine (đầy đủ chuẩn mới + tương thích ngược)
     */
    static normalizeQuestion(q, isBossQuestion = false) {
      if (!q) return null;
      const rawCat = q.category === 'arith' ? 'num' : (q.category || 'num');
      const choices = Array.isArray(q.choices) && q.choices.length === 4
        ? q.choices
        : (Array.isArray(q.options) && q.options.length === 4 ? q.options : []);
      let correctIdx = choices.indexOf(q.correctAnswer);
      if (correctIdx < 0 && choices.length === 4) {
        choices[0] = q.correctAnswer;
        correctIdx = 0;
      }
      const svgVisual = q.svgVisual !== undefined
        ? q.svgVisual
        : VisualBuilder.buildRawVisualSVG(q.visualData);

      q.category = rawCat;
      q.question = q.questionText;
      q.svgVisual = svgVisual || '';
      q.choices = choices;
      q.options = choices;
      q.correctIndex = correctIdx >= 0 ? correctIdx : 0;
      q.correctAnswer = choices[q.correctIndex] || q.correctAnswer;
      q.answer = q.correctAnswer;
      q.inputMode = 'mcq';
      q.isBossQuestion = Boolean(isBossQuestion);
      return q;
    }

    /**
     * Sinh danh sách 9 câu hỏi cho 1 ải (8 câu thường + 1 câu Boss cuối ải = 9 câu, không trùng lặp)
     * Hỗ trợ 3 chế độ sách: 'tap1' (SGK Tập 1), 'tap2' (SGK Tập 2), 'all' (Tổng hợp Tập 1 & Tập 2)
     */
    static generateStageQuestions(stageId = 1, count = 9, enabledTopics = ['num', 'geo', 'word', 'stat'], bookMode = 'all') {
      const questions = [];
      const seenTexts = new Set();
      let attempts = 0;

      while (questions.length < count && attempts < count * 12) {
        attempts++;
        const isBossQ = questions.length === count - 1;
        const q = this.generateSingleQuestion(stageId, questions.length + attempts - 1, enabledTopics, isBossQ, bookMode);
        if (q && !seenTexts.has(q.questionText)) {
          seenTexts.add(q.questionText);
          q.isBossQuestion = isBossQ;
          questions.push(q);
        }
      }
      while (questions.length < count) {
        const isBossQ = questions.length === count - 1;
        const fallbackQ = this.generateSingleQuestion(stageId, questions.length, enabledTopics, isBossQ, bookMode);
        fallbackQ.isBossQuestion = isBossQ;
        questions.push(fallbackQ);
      }
      return questions;
    }

    static generateSingleQuestion(stageId = 1, index = 0, enabledTopics = ['num', 'geo', 'word', 'stat'], arg4 = false, arg5 = 'all') {
      let isBossQuestion = false;
      let bookMode = 'all';
      if (typeof arg4 === 'string') {
        bookMode = arg4;
        isBossQuestion = typeof arg5 === 'boolean' ? arg5 : false;
      } else {
        isBossQuestion = Boolean(arg4);
        bookMode = typeof arg5 === 'string' ? arg5 : 'all';
      }

      const st = Math.max(1, Math.min(5, Number(stageId) || 1));
      let q;

      if (bookMode === 'tap1') {
        q = this.genTap1QuestionByStage(st, index, enabledTopics);
      } else if (bookMode === 'tap2') {
        q = this.genTap2QuestionByStage(st, index, enabledTopics);
      } else {
        if (st === 1) {
          // Ải 1: Khu Rừng Khởi Đầu - Bảng nhân/chia 2-9 (có dư), tìm thành phần chưa biết, cộng trừ phạm vi 10 000
          const pool1 = [0, 1, 2, 5]; // mult_div_table, unknown_comp, div_remainder_or_frac, large_add_sub_round
          q = this.genArithQuestion(pool1[index % pool1.length]);
        } else if (st === 2) {
          // Ải 2: Thung Lũng Cầu Vồng - Nhân/chia số có 3-4 chữ số với số có 1 chữ số, chữ số La Mã I-XX, xem đồng hồ kim SVG
          const mode2 = index % 3;
          if (mode2 === 0) {
            q = this.genArithQuestion(6); // multi_digit_mult_div
          } else if (mode2 === 1) {
            q = this.genArithQuestion(4); // roman_numerals
          } else {
            q = this.genGeoQuestion(5);   // clock_time
          }
        } else if (st === 3) {
          // Ải 3: Hang Động Pha Lê - Biểu thức số, quy đổi đơn vị đo (mm, cm, dm, m, km, g, kg, ml, l), cộng trừ phạm vi 100 000
          const mode3 = index % 3;
          if (mode3 === 0) {
            q = this.genArithQuestion(3); // expression_val
          } else if (mode3 === 1) {
            q = this.genUnitConversionQuestion(index);
          } else {
            q = this.genArithQuestion(5); // large_add_sub_round (100 000)
          }
        } else if (st === 4) {
          // Ải 4: Thác Nước Tri Thức - Chu vi/Diện tích, Góc vuông/Trung điểm/Hình tròn, Giải toán 2 bước tính & Thống kê Xác suất
          const mode4 = index % 4;
          if (mode4 === 0) {
            const geoPool = [3, 4, 0, 1, 2]; // perimeter, area, midpoint, circle, angle
            q = this.genGeoQuestion(geoPool[index % geoPool.length]);
          } else if (mode4 === 1) {
            q = this.genWordQuestion(index);
          } else if (mode4 === 2) {
            q = this.genStatQuestion(index);
          } else {
            q = this.genGeoQuestion((index + 2) % 5);
          }
        } else {
          // Ải 5: Đỉnh Núi Pha Lê - Tổng hợp toàn bộ kiến thức nâng cao của cả 4 mạch kiến thức
          const validPools = Array.isArray(enabledTopics) && enabledTopics.length > 0
            ? enabledTopics
            : ['num', 'geo', 'word', 'stat'];
          const chosenTopic = validPools[index % validPools.length];
          switch (chosenTopic) {
            case 'num':
            case 'arith':
              q = this.genArithQuestion(index);
              break;
            case 'geo':
              q = this.genGeoQuestion(index);
              break;
            case 'word':
              q = this.genWordQuestion(index);
              break;
            case 'stat':
              q = this.genStatQuestion(index);
              break;
            default:
              q = this.genArithQuestion(index);
              break;
          }
        }
      }

      return this.normalizeQuestion(q, isBossQuestion);
    }

    /* ------------------------------------------------------------------------
     * BỘ SINH ĐỀ CHUYÊN BIỆT 5 ẢI CHO SGK TẬP 1 (HỌC KÌ 1: BÀI 1 -> BÀI 44)
     * Toàn bộ số liệu <= 1 000 và trích dẫn 100% SGK Toán 3 Tập 1
     * ------------------------------------------------------------------------ */
    static genTap1QuestionByStage(st = 1, index = 0, enabledTopics = ['num', 'geo', 'word']) {
      if (st === 1) {
        // Ải 1 (Tập 1): Khu Rừng Bảng Nhân Chia (Bài 1 -> Bài 15)
        const m1 = index % 4;
        if (m1 === 0) return this.genArithQuestion(0); // Bảng nhân, bảng chia 2 đến 9
        if (m1 === 1) return this.genArithQuestion(1); // Tìm thành phần trong phép cộng, trừ, nhân, chia
        if (m1 === 2) return this.genTap1OneNthQuestion(index); // Một phần mấy (Bài 14)
        return this.genTap1AddSub1000(index); // Cộng, trừ các số có ba chữ số phạm vi 1 000 (Bài 1, 2)
      }
      if (st === 2) {
        // Ải 2 (Tập 1): Đầm Lầy Hình Phẳng & Khối (Bài 16 -> Bài 22)
        const m2 = index % 3;
        if (m2 === 0) return this.genGeoQuestion(0); // Điểm ở giữa, trung điểm của đoạn thẳng (Bài 16)
        if (m2 === 1) return this.genGeoQuestion(1); // Hình tròn: tâm, bán kính, đường kính (Bài 17)
        return this.genGeoQuestion(2); // Góc vuông, thước Ê-ke, khối lập phương, khối hộp chữ nhật (Bài 18-21)
      }
      if (st === 3) {
        // Ải 3 (Tập 1): Thung Lũng Chia Có Dư & Lời Văn (Bài 23 -> Bài 29)
        const m3 = index % 5;
        if (m3 === 0) return this.genTap1DivRemainderQuestion(); // Phép chia hết, phép chia có dư (Bài 25)
        if (m3 === 1) return this.genWordQuestion(0); // Gấp một số lên một số lần (Bài 24)
        if (m3 === 2) return this.genWordQuestion(1); // Giảm một số đi một số lần (Bài 27)
        if (m3 === 3) return this.genWordQuestion(3); // Bài toán giải bằng hai bước tính (Bài 28)
        return this.genWordQuestion(4); // Bài toán giải bằng hai bước tính (Bài 28)
      }
      if (st === 4) {
        // Ải 4 (Tập 1): Hang Động Đo Lường & Biểu Thức (Bài 30 -> Bài 40)
        const m4 = index % 4;
        if (m4 === 0) return this.genArithQuestion(3); // Tính giá trị của biểu thức số (Bài 38)
        if (m4 === 1) return this.genTap1MeasureQuestion(index); // Đơn vị đo mm, g, ml, nhiệt độ °C (Bài 30-33)
        if (m4 === 2) return this.genTap1MultiDigitWithin1000(index); // Nhân/chia số có 2, 3 chữ số trong phạm vi 1 000 (Bài 36, 37)
        return this.genWordQuestion(2); // So sánh số lớn gấp mấy lần số bé (Bài 39)
      }
      // Ải 5 (Tập 1): Đỉnh Núi Pha Lê Học Kì 1 (Bài 41 -> Bài 44: Tổng hợp Tập 1)
      const stageCycle = (index % 4) + 1;
      return this.genTap1QuestionByStage(stageCycle, Math.floor(index / 2) + index, enabledTopics);
    }

    static genTap1OneNthQuestion() {
      const n = this.randInt(2, 9);
      const part = this.randInt(4, 9);
      const total = n * part;
      return {
        category: 'arith',
        topicName: `Một phần mấy (1/${n})`,
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 14, trang 42',
        sgkAssetKey: null,
        inputMode: 'numpad',
        questionText: `Bà ngoại có ${total} quả cam, bà biếu gia đình Việt 1/${n} số cam đó. Hỏi bà đã biếu bao nhiêu quả cam?`,
        correctAnswer: `${part} quả`,
        numericAnswer: part,
        options: this.makeNumericOptions(part, 'quả', [-2, -1, 1, 2, 3]),
        hint: `Muốn tìm 1/${n} của ${total} quả cam, ta lấy ${total} chia cho ${n}.`,
        explanation: `1/${n} của ${total} quả cam là: ${total} : ${n} = ${part} (quả). [SGK Kết nối tri thức - Bài 14, trang 42 Tập 1]`
      };
    }

    static genTap1AddSub1000(idx = 0) {
      if (idx % 2 === 0) {
        const a = this.randInt(145, 580);
        const b = this.randInt(125, 390);
        const sum = a + b;
        return {
          category: 'arith',
          topicName: 'Cộng, trừ các số có ba chữ số (phạm vi 1 000)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 2, trang 9',
          sgkAssetKey: null,
          inputMode: 'mcq',
          questionText: `Tính tổng hai số trong phạm vi 1 000:  ${a} + ${b} = ?`,
          correctAnswer: String(sum),
          numericAnswer: sum,
          options: this.makeNumericOptions(sum, '', [-100, -10, 10, 100, -1]),
          hint: 'Đặt tính thẳng cột hàng đơn vị, hàng chục, hàng trăm rồi cộng từ phải sang trái.',
          explanation: `Thực hiện phép cộng trong phạm vi 1 000: ${a} + ${b} = ${sum}. [SGK Kết nối tri thức - Bài 2, trang 9 Tập 1]`
        };
      }
      const b = this.randInt(135, 420);
      const diff = this.randInt(140, 480);
      const a = b + diff;
      return {
        category: 'arith',
        topicName: 'Cộng, trừ các số có ba chữ số (phạm vi 1 000)',
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 2, trang 9',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Tính hiệu hai số trong phạm vi 1 000:  ${a} - ${b} = ?`,
        correctAnswer: String(diff),
        numericAnswer: diff,
        options: this.makeNumericOptions(diff, '', [-100, -10, 10, 100, 5]),
        hint: 'Đặt tính thẳng cột rồi trừ lần lượt từ hàng đơn vị sang hàng chục, hàng trăm.',
        explanation: `Thực hiện phép trừ trong phạm vi 1 000: ${a} - ${b} = ${diff}. [SGK Kết nối tri thức - Bài 2, trang 9 Tập 1]`
      };
    }

    static genTap1DivRemainderQuestion() {
      const divisor = this.randInt(4, 9);
      const quotient = this.randInt(4, 9);
      const rem = this.randInt(1, divisor - 1);
      const dividend = divisor * quotient + rem;
      const correctStr = `${quotient} (dư ${rem})`;
      const wrong1 = `${quotient} (dư ${rem === 1 ? 2 : rem - 1})`;
      const wrong2 = `${quotient + 1} (dư ${rem})`;
      const wrong3 = `${quotient - 1} (dư ${divisor - 1})`;
      return {
        category: 'arith',
        topicName: 'Phép chia hết, phép chia có dư',
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 25, trang 72',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Thực hiện phép chia có dư:  ${dividend} : ${divisor} được thương và số dư là bao nhiêu?`,
        correctAnswer: correctStr,
        numericAnswer: null,
        options: this.shuffle([correctStr, wrong1, wrong2, wrong3]),
        hint: `Ta có ${divisor} × ${quotient} = ${divisor * quotient}. Lấy ${dividend} - ${divisor * quotient} để tìm số dư (số dư luôn bé hơn số chia ${divisor}).`,
        explanation: `Vì ${divisor} × ${quotient} = ${divisor * quotient} và ${dividend} - ${divisor * quotient} = ${rem} (bé hơn ${divisor}), nên ${dividend} : ${divisor} = ${quotient} (dư ${rem}). [SGK Kết nối tri thức - Bài 25, trang 72 Tập 1]`
      };
    }

    static genTap1MeasureQuestion(idx = 0) {
      const sub = idx % 4;
      if (sub === 0) {
        const cmVal = this.randInt(2, 8);
        const mmVal = cmVal * 10;
        return {
          category: 'geo',
          topicName: 'Đơn vị đo độ dài Mi-li-mét (mm)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 30, trang 85',
          sgkAssetKey: 'mm_ruler_b30',
          visualData: { type: 'mm_ruler', cmVal, mmVal },
          questionText: `Quan sát thước đo của Rô-bốt và đổi đơn vị: ${cmVal} cm = ... mm?`,
          correctAnswer: `${mmVal} mm`,
          numericAnswer: mmVal,
          options: this.makeNumericOptions(mmVal, 'mm', [-10, 10, cmVal * 100 - mmVal, 5]),
          hint: 'Ta có 1 cm = 10 mm. Em lấy số xăng-ti-mét nhân với 10.',
          explanation: `Vì 1 cm = 10 mm nên ${cmVal} cm = ${mmVal} mm. [SGK Kết nối tri thức - Bài 30, trang 85 Tập 1]`
        };
      }
      if (sub === 1) {
        const g1 = this.randInt(150, 450);
        const g2 = this.randInt(200, 450);
        const sumG = g1 + g2;
        return {
          category: 'geo',
          topicName: 'Đơn vị đo khối lượng Gam (g)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 31, trang 87',
          sgkAssetKey: null,
          questionText: `Túi hạt dẻ cân nặng ${g1} g, túi bánh quy cân nặng ${g2} g. Hỏi cả hai túi cân nặng bao nhiêu gam (g)?`,
          correctAnswer: `${sumG} g`,
          numericAnswer: sumG,
          options: this.makeNumericOptions(sumG, 'g', [-100, -50, 50, 100]),
          hint: `Cộng số gam của hai túi: ${g1} + ${g2} (biết 1 kg = 1 000 g).`,
          explanation: `Cả hai túi cân nặng là: ${g1} + ${g2} = ${sumG} (g). [SGK Kết nối tri thức - Bài 31, trang 87 Tập 1]`
        };
      }
      if (sub === 2) {
        const usedMl = this.pick([200, 250, 300, 400, 450]);
        const remainMl = 1000 - usedMl;
        return {
          category: 'geo',
          topicName: 'Đơn vị đo dung tích Mi-li-lít (ml)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 32, trang 90',
          sgkAssetKey: null,
          questionText: `Một bình đựng 1 lít (1 000 ml) nước. Việt rót ra ${usedMl} ml nước để tưới cây. Hỏi trong bình còn lại bao nhiêu mi-li-lít (ml) nước?`,
          correctAnswer: `${remainMl} ml`,
          numericAnswer: remainMl,
          options: this.makeNumericOptions(remainMl, 'ml', [-100, -50, 50, 100]),
          hint: `Đổi 1 lít = 1 000 ml, rồi lấy 1 000 - ${usedMl}.`,
          explanation: `Đổi 1 lít = 1 000 ml. Số nước còn lại trong bình là: 1 000 - ${usedMl} = ${remainMl} (ml). [SGK Kết nối tri thức - Bài 32, trang 90 Tập 1]`
        };
      }
      const morningTemp = this.randInt(18, 25);
      const increase = this.randInt(4, 8);
      const noonTemp = morningTemp + increase;
      return {
        category: 'geo',
        topicName: 'Nhiệt độ. Đơn vị đo nhiệt độ (°C)',
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 33, trang 92',
        sgkAssetKey: null,
        questionText: `Buổi sáng nhiệt kế chỉ ${morningTemp} °C. Đến buổi trưa nhiệt độ tăng thêm ${increase} °C. Hỏi nhiệt độ buổi trưa là bao nhiêu độ Xê (°C)?`,
        correctAnswer: `${noonTemp} °C`,
        numericAnswer: noonTemp,
        options: this.makeNumericOptions(noonTemp, '°C', [-increase, -2, 2, 4]),
        hint: `Lấy nhiệt độ buổi sáng cộng thêm ${increase} °C: ${morningTemp} + ${increase}.`,
        explanation: `Nhiệt độ buổi trưa là: ${morningTemp} + ${increase} = ${noonTemp} (°C). [SGK Kết nối tri thức - Bài 33, trang 92 Tập 1]`
      };
    }

    static genTap1MultiDigitWithin1000(idx = 0) {
      if (idx % 2 === 0) {
        const factor = this.randInt(2, 4);
        const base = this.randInt(104, 240);
        const prod = base * factor;
        return {
          category: 'arith',
          topicName: 'Nhân số có ba chữ số với số có một chữ số',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 36, trang 98',
          sgkAssetKey: null,
          inputMode: 'mcq',
          questionText: `Tính tích trong phạm vi 1 000:  ${base} × ${factor} = ?`,
          correctAnswer: String(prod),
          numericAnswer: prod,
          options: this.makeNumericOptions(prod, '', [-10, 10, -factor, factor, 20]),
          hint: `Nhân lần lượt từ phải sang trái: lấy ${factor} nhân với hàng đơn vị, hàng chục, hàng trăm của ${base}.`,
          explanation: `Đặt tính và nhân từ phải sang trái: ${base} × ${factor} = ${prod}. [SGK Kết nối tri thức - Bài 36, trang 98 Tập 1]`
        };
      }
      const divisor = this.randInt(2, 6);
      const quotient = this.randInt(105, Math.floor(960 / divisor));
      const dividend = quotient * divisor;
      return {
        category: 'arith',
        topicName: 'Chia số có ba chữ số cho số có một chữ số',
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 37, trang 100',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Tính thương:  ${dividend} : ${divisor} = ?`,
        correctAnswer: String(quotient),
        numericAnswer: quotient,
        options: this.makeNumericOptions(quotient, '', [-10, 10, -2, 2, 12]),
        hint: `Chia lần lượt từ trái sang phải (từ hàng trăm, hàng chục đến hàng đơn vị) của số ${dividend} cho ${divisor}.`,
        explanation: `Thực hiện phép chia từ trái sang phải: ${dividend} : ${divisor} = ${quotient}. [SGK Kết nối tri thức - Bài 37, trang 100 Tập 1]`
      };
    }

    /* ------------------------------------------------------------------------
     * BỘ SINH ĐỀ CHUYÊN BIỆT 5 ẢI CHO SGK TẬP 2 (HỌC KÌ 2: BÀI 45 -> BÀI 81)
     * Toàn bộ trích dẫn 100% SGK Toán 3 Tập 2
     * ------------------------------------------------------------------------ */
    static genTap2QuestionByStage(st = 1, index = 0, enabledTopics = ['num', 'geo', 'word', 'stat']) {
      if (st === 1) {
        // Ải 1 (Tập 2): Thảo Nguyên Số 10 000 & La Mã (Bài 45 -> 49, Bài 54 -> 58)
        const m1 = index % 4;
        if (m1 === 0) return this.genArithQuestion(4); // Làm quen với chữ số La Mã (Bài 47 Tập 2)
        if (m1 === 1) return this.genTap2Scope10000(index); // Cộng, trừ, làm tròn trong phạm vi 10 000 (Bài 48, 54, 55)
        if (m1 === 2) return this.genArithQuestion(6); // Nhân, chia số có 4 chữ số với số có 1 chữ số (Bài 56, 57 Tập 2)
        return this.genTap2UnitReductionWord(index); // Bài toán liên quan đến rút về đơn vị (Bài 58 Tập 2)
      }
      if (st === 2) {
        // Ải 2 (Tập 2): Vương Quốc Chu Vi & Diện Tích (Bài 50 -> Bài 53)
        const m2 = index % 3;
        if (m2 === 0) return this.genGeoQuestion(3); // Chu vi hình chữ nhật, hình vuông (Bài 50 Tập 2)
        if (m2 === 1) return this.genGeoQuestion(4); // Diện tích hình chữ nhật, hình vuông cm² (Bài 52 Tập 2)
        return this.genTap2TriangleQuadPerimeter(index); // Chu vi hình tam giác, hình tứ giác (Bài 50 Tập 2)
      }
      if (st === 3) {
        // Ải 3 (Tập 2): Thành Phố Số 100 000 (Bài 59 -> 65, Bài 70 -> 72)
        return this.genTap2Scope100000(index);
      }
      if (st === 4) {
        // Ải 4 (Tập 2): Thác Nước Thời Gian & Thống Kê (Bài 66 -> 69, Bài 73 -> 75)
        const m4 = index % 4;
        if (m4 === 0) return this.genGeoQuestion(5); // Xem đồng hồ chính xác đến từng phút (Bài 66 Tập 2)
        if (m4 === 1) return this.genTap2TimeMoneyQuestion(index); // Tháng - năm & Tiền Việt Nam (Bài 67, 68 Tập 2)
        if (m4 === 2) return this.genStatQuestion(0); // Bảng số liệu thống kê (Bài 73 Tập 2)
        return this.genStatQuestion(1); // Khả năng xảy ra của một sự kiện (Bài 74 Tập 2)
      }
      // Ải 5 (Tập 2): Đỉnh Núi Pha Lê Học Kì 2 (Bài 76 -> Bài 81: Tổng hợp Tập 2)
      const stageCycle = (index % 4) + 1;
      return this.genTap2QuestionByStage(stageCycle, Math.floor(index / 2) + index, enabledTopics);
    }

    static genTap2Scope10000(idx = 0) {
      if (idx % 2 === 0) {
        const thousands = this.randInt(2, 8);
        const hundreds = this.pick([1, 2, 3, 4, 6, 7, 8, 9]);
        const tens = this.randInt(1, 9) * 10;
        const num = thousands * 1000 + hundreds * 100 + tens;
        const rounded = hundreds >= 5 ? (thousands + 1) * 1000 : thousands * 1000;
        return {
          category: 'arith',
          topicName: 'Làm tròn số trong phạm vi 10 000',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 48, trang 15',
          sgkAssetKey: null,
          inputMode: 'mcq',
          questionText: `Làm tròn số ${this.formatNum(num)} đến hàng nghìn thì được số nào?`,
          correctAnswer: this.formatNum(rounded),
          numericAnswer: rounded,
          options: this.shuffle([
            this.formatNum(thousands * 1000),
            this.formatNum((thousands + 1) * 1000),
            this.formatNum(thousands * 1000 + hundreds * 100),
            this.formatNum((thousands - 1) * 1000)
          ]),
          hint: `Chữ số hàng trăm là ${hundreds}. Nếu từ 5 trở lên thì làm tròn lên, nếu từ 4 trở xuống thì làm tròn xuống!`,
          explanation: `Khi làm tròn số ${this.formatNum(num)} đến hàng nghìn, chữ số hàng trăm là ${hundreds} (${hundreds >= 5 ? '≥ 5 nên làm tròn lên' : '< 5 nên làm tròn xuống'}), ta được ${this.formatNum(rounded)}. [SGK Kết nối tri thức - Bài 48, trang 15 Tập 2]`
        };
      }
      const a = this.randInt(2150, 5400);
      const b = this.randInt(1250, 3800);
      const sum = a + b;
      return {
        category: 'arith',
        topicName: 'Phép cộng, phép trừ trong phạm vi 10 000',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 54 & Bài 55, trang 38-42',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Tính nhẩm cùng Rô-bốt trong phạm vi 10 000:  ${this.formatNum(a)} + ${this.formatNum(b)} = ?`,
        correctAnswer: this.formatNum(sum),
        numericAnswer: sum,
        options: this.makeNumericOptions(sum, '', [-1000, 1000, -100, 100, 200]),
        hint: 'Đặt tính thẳng cột từ hàng đơn vị đến hàng nghìn rồi cộng từ phải sang trái.',
        explanation: `Thực hiện phép cộng trong phạm vi 10 000: ${this.formatNum(a)} + ${this.formatNum(b)} = ${this.formatNum(sum)}. [SGK Kết nối tri thức - Bài 54, trang 38 Tập 2]`
      };
    }

    static genTap2UnitReductionWord(idx = 0) {
      const boxes = this.randInt(3, 6);
      const perBox = this.randInt(6, 12);
      const total1 = boxes * perBox;
      const askBoxes = boxes + this.randInt(2, 4);
      const total2 = askBoxes * perBox;
      if (idx % 2 === 0) {
        return {
          category: 'word',
          topicName: 'Bài toán liên quan đến rút về đơn vị',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 58, trang 52',
          sgkAssetKey: 'two_step_b28',
          inputMode: 'mcq',
          questionText: `Có ${total1} viên đá pha lê xếp đều vào ${boxes} hộp. Hỏi ${askBoxes} hộp như vậy có tất cả bao nhiêu viên đá pha lê?`,
          correctAnswer: `${total2} viên`,
          numericAnswer: total2,
          options: this.makeNumericOptions(total2, 'viên', [perBox - total2, -perBox, perBox, 6]),
          hint: `Bước 1 (Rút về đơn vị): Tìm số viên trong 1 hộp (${total1} : ${boxes} = ${perBox} viên). Bước 2: Lấy ${perBox} × ${askBoxes}.`,
          explanation: `Giải bằng 2 bước (Rút về đơn vị): Mỗi hộp có ${total1} : ${boxes} = ${perBox} (viên). Vậy ${askBoxes} hộp có: ${perBox} × ${askBoxes} = ${total2} (viên). [SGK Kết nối tri thức - Bài 58, trang 52 Tập 2]`
        };
      }
      return {
        category: 'word',
        topicName: 'Bài toán liên quan đến rút về đơn vị',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 58, trang 53',
        sgkAssetKey: 'two_step_b28',
        inputMode: 'mcq',
        questionText: `Có ${total1} kg gạo chia đều vào ${boxes} túi như nhau. Hỏi muốn đựng ${total2} kg gạo thì cần bao nhiêu túi như thế?`,
        correctAnswer: `${askBoxes} túi`,
        numericAnswer: askBoxes,
        options: this.makeNumericOptions(askBoxes, 'túi', [-2, -1, 1, 2, 3]),
        hint: `Bước 1 (Rút về đơn vị): Tìm số kg gạo trong 1 túi (${total1} : ${boxes} = ${perBox} kg). Bước 2: Lấy ${total2} : ${perBox}.`,
        explanation: `Mỗi túi đựng được: ${total1} : ${boxes} = ${perBox} (kg). Số túi cần để đựng ${total2} kg gạo là: ${total2} : ${perBox} = ${askBoxes} (túi). [SGK Kết nối tri thức - Bài 58, trang 53 Tập 2]`
      };
    }

    static genTap2TriangleQuadPerimeter(idx = 0) {
      if (idx % 2 === 0) {
        const a = this.randInt(5, 12);
        const b = this.randInt(6, 14);
        const c = this.randInt(7, 15);
        const p = a + b + c;
        return {
          category: 'geo',
          topicName: 'Chu vi hình tam giác, hình tứ giác',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 50, trang 21',
          sgkAssetKey: 'perimeter_b50',
          inputMode: 'mcq',
          questionText: `Tính chu vi hình tam giác ABC có độ dài ba cạnh lần lượt là ${a} cm, ${b} cm và ${c} cm.`,
          correctAnswer: `${p} cm`,
          numericAnswer: p,
          options: this.makeNumericOptions(p, 'cm', [-4, -2, 2, 4, 6]),
          hint: 'Tổng độ dài các cạnh của hình tam giác là chu vi của hình đó.',
          explanation: `Chu vi hình tam giác ABC là: ${a} + ${b} + ${c} = ${p} (cm). [SGK Kết nối tri thức - Bài 50, trang 21 Tập 2]`
        };
      }
      const a = this.randInt(4, 10);
      const b = this.randInt(5, 11);
      const c = this.randInt(6, 12);
      const d = this.randInt(5, 10);
      const p = a + b + c + d;
      return {
        category: 'geo',
        topicName: 'Chu vi hình tam giác, hình tứ giác',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 50, trang 21',
        sgkAssetKey: 'perimeter_b50',
        inputMode: 'mcq',
        questionText: `Một hình tứ giác MNPQ có độ dài bốn cạnh là ${a} cm, ${b} cm, ${c} cm và ${d} cm. Chu vi của hình tứ giác đó là bao nhiêu xăng-ti-mét?`,
        correctAnswer: `${p} cm`,
        numericAnswer: p,
        options: this.makeNumericOptions(p, 'cm', [-5, -2, 2, 5, 8]),
        hint: 'Tổng độ dài 4 cạnh của hình tứ giác là chu vi của hình đó.',
        explanation: `Chu vi hình tứ giác MNPQ là: ${a} + ${b} + ${c} + ${d} = ${p} (cm). [SGK Kết nối tri thức - Bài 50, trang 21 Tập 2]`
      };
    }

    static genTap2Scope100000(idx = 0) {
      const m = idx % 3;
      if (m === 0) {
        const a = this.randInt(14, 48) * 1000 + this.randInt(120, 480);
        const b = this.randInt(12, 36) * 1000 + this.randInt(110, 390);
        const sum = a + b;
        return {
          category: 'arith',
          topicName: 'Phép cộng trong phạm vi 100 000',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 63, trang 70',
          sgkAssetKey: null,
          inputMode: 'mcq',
          questionText: `Tính tổng:  ${this.formatNum(a)} + ${this.formatNum(b)} = ?`,
          correctAnswer: this.formatNum(sum),
          numericAnswer: sum,
          options: this.makeNumericOptions(sum, '', [-1000, 1000, -100, 100, 2000]),
          hint: 'Đặt tính sao cho các chữ số cùng hàng thẳng cột với nhau rồi cộng từ phải sang trái.',
          explanation: `Thực hiện cộng từ hàng đơn vị đến hàng chục nghìn: ${this.formatNum(a)} + ${this.formatNum(b)} = ${this.formatNum(sum)}. [SGK Kết nối tri thức - Bài 63, trang 70 Tập 2]`
        };
      }
      if (m === 1) {
        const b = this.randInt(12, 35) * 1000 + this.randInt(150, 450);
        const diff = this.randInt(15, 42) * 1000 + this.randInt(120, 420);
        const a = b + diff;
        return {
          category: 'arith',
          topicName: 'Phép trừ trong phạm vi 100 000',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 64, trang 73',
          sgkAssetKey: null,
          inputMode: 'mcq',
          questionText: `Tính hiệu:  ${this.formatNum(a)} - ${this.formatNum(b)} = ?`,
          correctAnswer: this.formatNum(diff),
          numericAnswer: diff,
          options: this.makeNumericOptions(diff, '', [-1000, 1000, -100, 100, 2000]),
          hint: 'Đặt tính thẳng cột từ hàng đơn vị đến hàng chục nghìn rồi trừ từ phải sang trái.',
          explanation: `Thực hiện phép trừ trong phạm vi 100 000: ${this.formatNum(a)} - ${this.formatNum(b)} = ${this.formatNum(diff)}. [SGK Kết nối tri thức - Bài 64, trang 73 Tập 2]`
        };
      }
      const factor = this.randInt(2, 4);
      const base = this.randInt(11020, 21230);
      const prod = base * factor;
      return {
        category: 'arith',
        topicName: 'Nhân, chia số có năm chữ số với/cho số có một chữ số',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 70 & Bài 71, trang 93-97',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Tính tích:  ${this.formatNum(base)} × ${factor} = ?`,
        correctAnswer: this.formatNum(prod),
        numericAnswer: prod,
        options: this.makeNumericOptions(prod, '', [-1000, 1000, -100, 100, factor * 10]),
        hint: `Nhân lần lượt từ phải sang trái số ${this.formatNum(base)} với ${factor}.`,
        explanation: `Đặt tính và nhân lần lượt từ phải sang trái: ${this.formatNum(base)} × ${factor} = ${this.formatNum(prod)}. [SGK Kết nối tri thức - Bài 70, trang 93 Tập 2]`
      };
    }

    static genTap2TimeMoneyQuestion(idx = 0) {
      if (idx % 2 === 0) {
        const penPrice = this.pick([5000, 8000, 10000]);
        const bookPrice = this.pick([12000, 15000, 20000]);
        const paid = 50000;
        const total = penPrice + bookPrice;
        const change = paid - total;
        return {
          category: 'geo',
          topicName: 'Tiền Việt Nam',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 68, trang 85',
          sgkAssetKey: 'vn_money_b68',
          inputMode: 'mcq',
          questionText: `Mai mua một chiếc bút giá ${this.formatNum(penPrice)} đồng và một quyển vở giá ${this.formatNum(bookPrice)} đồng. Mai đưa cô bán hàng tờ ${this.formatNum(paid)} đồng. Hỏi cô bán hàng trả lại Mai bao nhiêu tiền?`,
          correctAnswer: `${this.formatNum(change)} đồng`,
          numericAnswer: change,
          options: this.makeNumericOptions(change, 'đồng', [-5000, 5000, 10000, total - change]),
          hint: `Bước 1: Tính tổng tiền mua bút và vở (${this.formatNum(penPrice)} + ${this.formatNum(bookPrice)}). Bước 2: Lấy ${this.formatNum(paid)} trừ đi tổng đó.`,
          explanation: `Tổng tiền mua bút và vở là: ${this.formatNum(penPrice)} + ${this.formatNum(bookPrice)} = ${this.formatNum(total)} (đồng). Tiền trả lại là: ${this.formatNum(paid)} - ${this.formatNum(total)} = ${this.formatNum(change)} (đồng). [SGK Kết nối tri thức - Bài 68, trang 85 Tập 2]`
        };
      }
      const mItem = this.pick([
        { m: 1, d: 31 }, { m: 3, d: 31 }, { m: 4, d: 30 }, { m: 5, d: 31 },
        { m: 6, d: 30 }, { m: 7, d: 31 }, { m: 8, d: 31 }, { m: 9, d: 30 },
        { m: 10, d: 31 }, { m: 11, d: 30 }, { m: 12, d: 31 }
      ]);
      return {
        category: 'geo',
        topicName: 'Thực hành xem đồng hồ, tháng - năm',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 67, trang 81',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Theo lịch năm của Rô-bốt, một năm có 12 tháng. Hỏi Tháng ${mItem.m} có bao nhiêu ngày?`,
        correctAnswer: `${mItem.d} ngày`,
        numericAnswer: mItem.d,
        options: ['31 ngày', '30 ngày', '28 ngày', '29 ngày'],
        hint: 'Các tháng 1, 3, 5, 7, 8, 10, 12 có 31 ngày; các tháng 4, 6, 9, 11 có 30 ngày.',
        explanation: `Theo Bài 67 SGK Toán 3 Tập 2: Tháng ${mItem.m} có ${mItem.d} ngày. [SGK Kết nối tri thức - Bài 67, trang 81 Tập 2]`
      };
    }

    /**
     * Sinh câu hỏi Quy đổi đơn vị đo lường: độ dài (mm, cm, dm, m, km), khối lượng (g, kg), dung tích (ml, l)
     */
    static genUnitConversionQuestion(idx = 0) {
      const sub = idx % 3;
      if (sub === 0) {
        const cmVal = this.randInt(2, 8);
        const mmVal = cmVal * 10;
        return {
          category: 'geo',
          topicName: 'Đổi đơn vị đo độ dài (mm, cm, dm, m, km)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 30, trang 85',
          sgkAssetKey: 'mm_ruler_b30',
          visualData: { type: 'mm_ruler', cmVal, mmVal },
          questionText: `Quan sát thước đo của Rô-bốt và đổi đơn vị: ${cmVal} cm = ... mm?`,
          correctAnswer: `${mmVal} mm`,
          numericAnswer: mmVal,
          options: this.makeNumericOptions(mmVal, 'mm', [-10, 10, cmVal * 100 - mmVal, 5]),
          hint: 'Ta có 1 cm = 10 mm. Em lấy số xăng-ti-mét nhân với 10.',
          explanation: `Vì 1 cm = 10 mm nên ${cmVal} cm = ${mmVal} mm. [SGK Kết nối tri thức - Bài 30, trang 85 Tập 1]`
        };
      }
      if (sub === 1) {
        const kgVal = this.randInt(2, 9);
        const gVal = kgVal * 1000;
        return {
          category: 'geo',
          topicName: 'Đổi đơn vị đo khối lượng (g, kg)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 31, trang 87',
          sgkAssetKey: null,
          questionText: `Rô-bốt cân một túi đá pha lê nặng ${kgVal} kg. Hỏi túi đá đó nặng bao nhiêu gam (g)?`,
          correctAnswer: `${this.formatNum(gVal)} g`,
          numericAnswer: gVal,
          options: this.makeNumericOptions(gVal, 'g', [-1000, 1000, -(kgVal * 900), 500]),
          hint: 'Ta có 1 kg = 1 000 g.',
          explanation: `Vì 1 kg = 1 000 g nên ${kgVal} kg = ${this.formatNum(gVal)} g. [SGK Kết nối tri thức - Bài 31, trang 87 Tập 1]`
        };
      }
      const lVal = this.randInt(2, 7);
      const mlVal = lVal * 1000;
      return {
        category: 'geo',
        topicName: 'Đổi đơn vị đo dung tích (ml, l)',
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 32, trang 90',
        sgkAssetKey: null,
        questionText: `Một bình nước suối Rừng Pha Lê chứa ${lVal} lít (l) nước. Hỏi bình đó chứa bao nhiêu mi-li-lít (ml) nước?`,
        correctAnswer: `${this.formatNum(mlVal)} ml`,
        numericAnswer: mlVal,
        options: this.makeNumericOptions(mlVal, 'ml', [-1000, 1000, -(lVal * 900), 500]),
        hint: 'Ta có 1 l = 1 000 ml.',
        explanation: `Vì 1 l = 1 000 ml nên ${lVal} l = ${this.formatNum(mlVal)} ml. [SGK Kết nối tri thức - Bài 32, trang 90 Tập 1]`
      };
    }

    /* ------------------------------------------------------------------------
     * ẢI 1: THUNG LŨNG SỐ HỌC (SỐ & PHÉP TÍNH - SGK TẬP 1 & TẬP 2)
     * ------------------------------------------------------------------------ */
    static genArithQuestion(idx = 0) {
      const subTypes = [
        'mult_div_table',
        'unknown_comp',
        'div_remainder_or_frac',
        'expression_val',
        'roman_numerals',
        'large_add_sub_round',
        'multi_digit_mult_div'
      ];
      const type = subTypes[idx % subTypes.length];

      // 1. Bảng nhân, bảng chia 2..9
      if (type === 'mult_div_table') {
        const a = this.randInt(3, 9);
        const b = this.randInt(4, 9);
        const prod = a * b;
        const isMult = Math.random() < 0.5;
        if (isMult) {
          const ansStr = String(prod);
          return {
            category: 'arith',
            topicName: 'Bảng nhân 2 đến 9',
            sgkCite: 'SGK Toán 3 Tập 1 - Chủ đề 2 (Bài 4, 6, 9, 10, 11, 12)',
            sgkAssetKey: null,
            inputMode: 'numpad',
            questionText: `Rô-bốt đố bạn: Kết quả của phép nhân ${a} × ${b} bằng bao nhiêu?`,
            correctAnswer: ansStr,
            numericAnswer: prod,
            options: this.makeNumericOptions(prod, '', [-a, a, -b, b, -2, 2]),
            hint: `Em nhẩm bảng nhân ${a}: ${a} × ${b - 1} = ${a * (b - 1)}, rồi cộng thêm ${a}.`,
            explanation: `Theo bảng nhân ${a}, ta có: ${a} × ${b} = ${prod}. [SGK Kết nối tri thức Tập 1 - Chủ đề 2]`
          };
        } else {
          const ansStr = String(b);
          return {
            category: 'arith',
            topicName: 'Bảng chia 2 đến 9',
            sgkCite: 'SGK Toán 3 Tập 1 - Chủ đề 2 (Bài 4, 6, 9, 10, 11, 12)',
            sgkAssetKey: null,
            inputMode: 'numpad',
            questionText: `Tính nhẩm cùng bạn Mai: ${prod} : ${a} = ?`,
            correctAnswer: ansStr,
            numericAnswer: b,
            options: this.makeNumericOptions(b, '', [-3, -2, -1, 1, 2, 3]),
            hint: `Vì ${a} × ${b} = ${prod} nên ${prod} : ${a} = ${b}.`,
            explanation: `Dựa vào bảng chia ${a}: Vì ${a} × ${b} = ${prod} nên ${prod} : ${a} = ${b}. [SGK Kết nối tri thức Tập 1 - Chủ đề 2]`
          };
        }
      }

      // 2. Tìm thành phần chưa biết trong phép tính (Bài 3 & Bài 13 Tập 1)
      if (type === 'unknown_comp') {
        const mode = this.randInt(1, 3);
        if (mode === 1) {
          // Tìm thừa số: ? × a = prod
          const a = this.randInt(3, 9);
          const x = this.randInt(4, 9);
          const prod = a * x;
          return {
            category: 'arith',
            topicName: 'Tìm thành phần trong phép nhân, phép chia',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 13, trang 39',
            sgkAssetKey: null,
            inputMode: 'numpad',
            questionText: `Tìm thừa số chưa biết trong phép tính:  ? × ${a} = ${prod}`,
            correctAnswer: String(x),
            numericAnswer: x,
            options: this.makeNumericOptions(x, '', [-2, -1, 1, 2, 3]),
            hint: 'Muốn tìm một thừa số, ta lấy tích chia cho thừa số kia.',
            explanation: `Quy tắc Rô-bốt: Muốn tìm một thừa số, ta lấy tích chia cho thừa số kia: ${prod} : ${a} = ${x}. [SGK Kết nối tri thức - Bài 13, trang 39 Tập 1]`
          };
        } else if (mode === 2) {
          // Tìm số bị chia: ? : b = q
          const b = this.randInt(3, 8);
          const q = this.randInt(5, 9);
          const x = b * q;
          return {
            category: 'arith',
            topicName: 'Tìm số bị chia',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 13, trang 40',
            sgkAssetKey: null,
            inputMode: 'numpad',
            questionText: `Tìm số bị chia chưa biết:  ? : ${b} = ${q}`,
            correctAnswer: String(x),
            numericAnswer: x,
            options: this.makeNumericOptions(x, '', [-b, b, -4, 4, 8]),
            hint: 'Muốn tìm số bị chia, ta lấy thương nhân với số chia.',
            explanation: `Quy tắc Rô-bốt: Muốn tìm số bị chia, ta lấy thương nhân với số chia: ${q} × ${b} = ${x}. [SGK Kết nối tri thức - Bài 13, trang 40 Tập 1]`
          };
        } else {
          // Tìm số bị trừ: ? - sub = diff
          const sub = this.randInt(125, 450);
          const diff = this.randInt(210, 520);
          const x = sub + diff;
          return {
            category: 'arith',
            topicName: 'Tìm thành phần trong phép cộng, phép trừ',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 3, trang 11',
            sgkAssetKey: null,
            inputMode: 'mcq',
            questionText: `Tìm số bị trừ chưa biết trong phép tính:  ? - ${sub} = ${diff}`,
            correctAnswer: this.formatNum(x),
            numericAnswer: x,
            options: this.makeNumericOptions(x, '', [-100, -10, 10, 100, diff - sub]),
            hint: 'Muốn tìm số bị trừ, ta lấy hiệu cộng với số trừ.',
            explanation: `Muốn tìm số bị trừ, ta lấy hiệu cộng với số trừ: ${diff} + ${sub} = ${x}. [SGK Kết nối tri thức - Bài 3, trang 11 Tập 1]`
          };
        }
      }

      // 3. Phép chia có dư (Bài 25) hoặc Một phần mấy (Bài 14)
      if (type === 'div_remainder_or_frac') {
        if (Math.random() < 0.55) {
          const divisor = this.randInt(4, 9);
          const quotient = this.randInt(4, 9);
          const rem = this.randInt(1, divisor - 1);
          const dividend = divisor * quotient + rem;
          const correctStr = `${quotient} (dư ${rem})`;
          const wrong1 = `${quotient} (dư ${rem === 1 ? 2 : rem - 1})`;
          const wrong2 = `${quotient + 1} (dư ${rem})`;
          const wrong3 = `${quotient - 1} (dư ${divisor - 1})`;
          return {
            category: 'arith',
            topicName: 'Phép chia hết, phép chia có dư',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 25, trang 72',
            sgkAssetKey: null,
            inputMode: 'mcq',
            questionText: `Thực hiện phép chia có dư:  ${dividend} : ${divisor} được thương và số dư là bao nhiêu?`,
            correctAnswer: correctStr,
            numericAnswer: null,
            options: this.shuffle([correctStr, wrong1, wrong2, wrong3]),
            hint: `Ta có ${divisor} × ${quotient} = ${divisor * quotient}. Lấy ${dividend} - ${divisor * quotient} để tìm số dư (số dư luôn bé hơn số chia ${divisor}).`,
            explanation: `Vì ${divisor} × ${quotient} = ${divisor * quotient} và ${dividend} - ${divisor * quotient} = ${rem} (bé hơn ${divisor}), nên ${dividend} : ${divisor} = ${quotient} (dư ${rem}). [SGK Kết nối tri thức - Bài 25, trang 72 Tập 1]`
          };
        } else {
          const n = this.randInt(3, 9);
          const part = this.randInt(4, 9);
          const total = n * part;
          return {
            category: 'arith',
            topicName: `Một phần mấy (1/${n})`,
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 14, trang 42',
            sgkAssetKey: null,
            inputMode: 'numpad',
            questionText: `Bà ngoại có ${total} quả cam, bà biếu gia đình Việt 1/${n} số cam đó. Hỏi bà đã biếu bao nhiêu quả cam?`,
            correctAnswer: String(part),
            numericAnswer: part,
            options: this.makeNumericOptions(part, '', [-2, -1, 1, 2, 3]),
            hint: `Muốn tìm 1/${n} của ${total} quả cam, ta lấy ${total} chia cho ${n}.`,
            explanation: `1/${n} của ${total} quả cam là: ${total} : ${n} = ${part} (quả cam). [SGK Kết nối tri thức - Bài 14, trang 42 Tập 1]`
          };
        }
      }

      // 4. Tính giá trị của biểu thức số (Bài 38 Tập 1)
      if (type === 'expression_val') {
        const hasParens = Math.random() < 0.5;
        if (hasParens) {
          const a = this.randInt(12, 28);
          const b = this.randInt(8, 22);
          const c = this.randInt(2, 5);
          const sum = a + b;
          const ans = sum * c;
          const expr = `(${a} + ${b}) × ${c}`;
          return {
            category: 'arith',
            topicName: 'Tính giá trị của biểu thức số có dấu ngoặc',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 38, trang 106',
            sgkAssetKey: 'expression_b38',
            visualData: {
              type: 'expression_path',
              exprText: expr,
              hintRule: 'Khi tính giá trị biểu thức có dấu ngoặc ( ), ta thực hiện phép tính trong ngoặc trước.'
            },
            inputMode: 'numpad',
            questionText: `Tính giá trị của biểu thức số:  ${expr}`,
            correctAnswer: String(ans),
            numericAnswer: ans,
            options: this.makeNumericOptions(ans, '', [-c, c, a + b * c - ans, 10, -10]),
            hint: `Tính trong ngoặc trước: ${a} + ${b} = ${sum}, sau đó lấy ${sum} × ${c}.`,
            explanation: `Khi biểu thức có dấu ngoặc, ta tính trong ngoặc trước: (${a} + ${b}) × ${c} = ${sum} × ${c} = ${ans}. [SGK Kết nối tri thức - Bài 38, trang 106 Tập 1]`
          };
        } else {
          const a = this.randInt(30, 85);
          const b = this.randInt(4, 9);
          const c = this.randInt(3, 8);
          const prod = b * c;
          const ans = a + prod;
          const expr = `${a} + ${b} × ${c}`;
          return {
            category: 'arith',
            topicName: 'Tính giá trị của biểu thức số',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 38, trang 105',
            sgkAssetKey: 'expression_b38',
            visualData: {
              type: 'expression_path',
              exprText: expr,
              hintRule: 'Trong biểu thức có phép cộng và phép nhân, ta thực hiện phép nhân trước rồi thực hiện phép cộng sau.'
            },
            inputMode: 'numpad',
            questionText: `Tính giá trị của biểu thức số:  ${expr}`,
            correctAnswer: String(ans),
            numericAnswer: ans,
            options: this.makeNumericOptions(ans, '', [(a + b) * c - ans, -5, 5, 10, -10]),
            hint: `Thực hiện phép nhân ${b} × ${c} = ${prod} trước, rồi lấy ${a} + ${prod}.`,
            explanation: `Ta thực hiện phép nhân trước, phép cộng sau: ${a} + ${b} × ${c} = ${a} + ${prod} = ${ans}. [SGK Kết nối tri thức - Bài 38, trang 105 Tập 1]`
          };
        }
      }

      // 5. Làm quen với chữ số La Mã I đến XX (Bài 47 Tập 2)
      if (type === 'roman_numerals') {
        const romanMap = [
          { r: 'IV', v: 4 }, { r: 'VI', v: 6 }, { r: 'VII', v: 7 }, { r: 'VIII', v: 8 },
          { r: 'IX', v: 9 }, { r: 'XI', v: 11 }, { r: 'XII', v: 12 }, { r: 'XIV', v: 14 },
          { r: 'XV', v: 15 }, { r: 'XVII', v: 17 }, { r: 'XIX', v: 19 }, { r: 'XX', v: 20 }
        ];
        const item = this.pick(romanMap);
        const clockHour = item.v <= 12 ? item.v : 9;
        return {
          category: 'arith',
          topicName: 'Làm quen với chữ số La Mã',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 47, trang 12',
          sgkAssetKey: 'roman_clock_b47',
          visualData: {
            type: 'roman_clock',
            hour: clockHour,
            minute: 0,
            highlightRoman: item.v <= 12 ? item.r : 'IX'
          },
          inputMode: 'numpad',
          questionText: `Chữ số La Mã "${item.r}" được đọc là số mấy trong hệ thập phân?`,
          correctAnswer: String(item.v),
          numericAnswer: item.v,
          options: this.makeNumericOptions(item.v, '', [-2, -1, 1, 2, 5]),
          hint: 'Nhớ quy tắc: I = 1, V = 5, X = 10. Chữ I đứng trước V hoặc X thì trừ đi 1, đứng sau thì cộng thêm!',
          explanation: `Theo bảng chữ số La Mã (I = 1, V = 5, X = 10), số La Mã ${item.r} biểu diễn số ${item.v}. [SGK Kết nối tri thức - Bài 47, trang 12 Tập 2]`
        };
      }

      // 6. Cộng, trừ trong phạm vi 10 000 / 100 000 & Làm tròn số (Bài 48, 54, 55, 61, 63, 64 Tập 2)
      if (type === 'large_add_sub_round') {
        if (Math.random() < 0.45) {
          // Làm tròn số đến hàng nghìn
          const thousands = this.randInt(2, 8);
          const hundreds = this.pick([1, 2, 3, 4, 6, 7, 8, 9]);
          const tens = this.randInt(1, 9) * 10;
          const num = thousands * 1000 + hundreds * 100 + tens;
          const rounded = hundreds >= 5 ? (thousands + 1) * 1000 : thousands * 1000;
          return {
            category: 'arith',
            topicName: 'Làm tròn số đến hàng chục, hàng trăm, hàng nghìn',
            sgkCite: 'SGK Toán 3 Tập 2 - Bài 48 & Bài 61, trang 15 & 64',
            sgkAssetKey: null,
            inputMode: 'mcq',
            questionText: `Làm tròn số ${this.formatNum(num)} đến hàng nghìn thì được số nào?`,
            correctAnswer: this.formatNum(rounded),
            numericAnswer: rounded,
            options: this.shuffle([
              this.formatNum(thousands * 1000),
              this.formatNum((thousands + 1) * 1000),
              this.formatNum(thousands * 1000 + hundreds * 100),
              this.formatNum((thousands - 1) * 1000)
            ]),
            hint: `Chữ số hàng trăm là ${hundreds}. Nếu hàng trăm từ 5 trở lên thì làm tròn lên, nếu từ 4 trở xuống thì làm tròn xuống!`,
            explanation: `Khi làm tròn số ${this.formatNum(num)} đến hàng nghìn, ta xét chữ số hàng trăm là ${hundreds} (${hundreds >= 5 ? '≥ 5 nên làm tròn lên' : '< 5 nên làm tròn xuống'}), ta được ${this.formatNum(rounded)}. [SGK Kết nối tri thức - Bài 48 & 61 Tập 2]`
          };
        } else {
          // Cộng hoặc trừ trong phạm vi 100 000
          const a = this.randInt(12, 45) * 1000 + this.randInt(120, 480);
          const b = this.randInt(11, 32) * 1000 + this.randInt(110, 390);
          const sum = a + b;
          return {
            category: 'arith',
            topicName: 'Phép cộng, phép trừ trong phạm vi 100 000',
            sgkCite: 'SGK Toán 3 Tập 2 - Bài 63 & Bài 64, trang 70–73',
            sgkAssetKey: null,
            inputMode: 'mcq',
            questionText: `Tính:  ${this.formatNum(a)} + ${this.formatNum(b)} = ?`,
            correctAnswer: this.formatNum(sum),
            numericAnswer: sum,
            options: this.makeNumericOptions(sum, '', [-1000, 1000, -100, 100]),
            hint: 'Đặt tính sao cho các chữ số cùng hàng thẳng cột với nhau rồi cộng từ phải sang trái.',
            explanation: `Thực hiện cộng từ hàng đơn vị đến hàng chục nghìn: ${this.formatNum(a)} + ${this.formatNum(b)} = ${this.formatNum(sum)}. [SGK Kết nối tri thức - Bài 63, trang 70 Tập 2]`
          };
        }
      }

      // 7. Nhân/chia số có 3, 4 chữ số với/cho số có 1 chữ số (Bài 36, 37 Tập 1; Bài 56, 57, 70, 71 Tập 2)
      const factor = this.randInt(3, 6);
      const base = this.randInt(112, 324);
      const prod = base * factor;
      return {
        category: 'arith',
        topicName: 'Nhân, chia số có nhiều chữ số với/cho số có một chữ số',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 56 & Bài 57, trang 45–49',
        sgkAssetKey: null,
        inputMode: 'mcq',
        questionText: `Tính tích:  ${base} × ${factor} = ?`,
        correctAnswer: this.formatNum(prod),
        numericAnswer: prod,
        options: this.makeNumericOptions(prod, '', [-10, 10, -factor, factor, 100]),
        hint: `Nhân lần lượt từ phải sang trái: lấy ${factor} nhân với hàng đơn vị, hàng chục, rồi hàng trăm của ${base}.`,
        explanation: `Đặt tính và nhân từ phải sang trái: ${base} × ${factor} = ${this.formatNum(prod)}. [SGK Kết nối tri thức - Bài 36 Tập 1 & Bài 56 Tập 2]`
      };
    }

    /* ------------------------------------------------------------------------
     * ẢI 2: ĐẦM LẦY HÌNH HỌC (HÌNH HỌC & ĐO LƯỜNG - SGK TẬP 1 & TẬP 2)
     * ------------------------------------------------------------------------ */
    static genGeoQuestion(idx = 0) {
      const subTypes = [
        'midpoint',
        'circle',
        'angle_or_cube',
        'perimeter',
        'area',
        'clock_time',
        'unit_or_money'
      ];
      const type = subTypes[idx % subTypes.length];

      // 1. Điểm ở giữa, trung điểm của đoạn thẳng (Bài 16 Tập 1)
      if (type === 'midpoint') {
        const half = this.randInt(4, 14);
        const total = half * 2;
        const askTotal = Math.random() < 0.5;
        if (askTotal) {
          return {
            category: 'geo',
            topicName: 'Điểm ở giữa, trung điểm của đoạn thẳng',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 16, trang 49',
            sgkAssetKey: 'midpoint_b16',
            visualData: {
              type: 'midpoint',
              pLeft: 'A',
              pMid: 'M',
              pRight: 'B',
              halfLen: half,
              totalLen: total,
              hidePart: 'total'
            },
            inputMode: 'numpad',
            questionText: `Cho M là trung điểm của đoạn thẳng AB và biết AM = ${half} cm. Hỏi đoạn thẳng AB dài bao nhiêu xăng-ti-mét?`,
            correctAnswer: `${total} cm`,
            numericAnswer: total,
            options: this.makeNumericOptions(total, 'cm', [-2, 2, -half, 4]),
            hint: `Vì M là trung điểm của đoạn thẳng AB nên AB = 2 × AM = 2 × ${half} cm.`,
            explanation: `M là trung điểm của đoạn thẳng AB nên AM = MB = ${half} cm. Độ dài đoạn thẳng AB là: ${half} × 2 = ${total} (cm). [SGK Kết nối tri thức - Bài 16, trang 49 Tập 1]`
          };
        } else {
          return {
            category: 'geo',
            topicName: 'Điểm ở giữa, trung điểm của đoạn thẳng',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 16, trang 49',
            sgkAssetKey: 'midpoint_b16',
            visualData: {
              type: 'midpoint',
              pLeft: 'A',
              pMid: 'M',
              pRight: 'B',
              halfLen: half,
              totalLen: total,
              hidePart: 'half'
            },
            inputMode: 'numpad',
            questionText: `Đoạn thẳng AB dài ${total} cm, M là trung điểm của đoạn thẳng AB. Hỏi đoạn thẳng AM dài bao nhiêu xăng-ti-mét?`,
            correctAnswer: `${half} cm`,
            numericAnswer: half,
            options: this.makeNumericOptions(half, 'cm', [-2, -1, 1, 2, half]),
            hint: `M là trung điểm của AB nên AM = AB : 2 = ${total} : 2.`,
            explanation: `Vì M là trung điểm của đoạn thẳng AB nên độ dài đoạn thẳng AM là: ${total} : 2 = ${half} (cm). [SGK Kết nối tri thức - Bài 16, trang 49 Tập 1]`
          };
        }
      }

      // 2. Hình tròn: tâm, bán kính, đường kính (Bài 17 Tập 1)
      if (type === 'circle') {
        const r = this.randInt(3, 15);
        const d = r * 2;
        const askDiameter = Math.random() < 0.55;
        if (askDiameter) {
          return {
            category: 'geo',
            topicName: 'Hình tròn: Tâm, bán kính, đường kính',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 17, trang 52',
            sgkAssetKey: 'circle_b17',
            visualData: {
              type: 'circle',
              center: 'O',
              radius: r,
              diameter: d,
              askType: 'diameter'
            },
            inputMode: 'numpad',
            questionText: `Cho hình tròn tâm O có bán kính OM = ${r} cm. Hỏi đường kính AB của hình tròn đó dài bao nhiêu xăng-ti-mét?`,
            correctAnswer: `${d} cm`,
            numericAnswer: d,
            options: this.makeNumericOptions(d, 'cm', [-r, -2, 2, 4]),
            hint: 'Trong một hình tròn, độ dài đường kính gấp 2 lần độ dài bán kính.',
            explanation: `Trong một hình tròn, độ dài đường kính gấp 2 lần độ dài bán kính: AB = ${r} × 2 = ${d} (cm). [SGK Kết nối tri thức - Bài 17, trang 52 Tập 1]`
          };
        } else {
          return {
            category: 'geo',
            topicName: 'Hình tròn: Tâm, bán kính, đường kính',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 17, trang 52',
            sgkAssetKey: 'circle_b17',
            visualData: {
              type: 'circle',
              center: 'O',
              radius: r,
              diameter: d,
              askType: 'radius'
            },
            inputMode: 'numpad',
            questionText: `Một hình tròn tâm O có đường kính AB = ${d} cm. Bán kính OM của hình tròn đó dài bao nhiêu xăng-ti-mét?`,
            correctAnswer: `${r} cm`,
            numericAnswer: r,
            options: this.makeNumericOptions(r, 'cm', [-2, -1, 1, 2, r]),
            hint: 'Tâm O là trung điểm của đường kính AB, nên bán kính bằng đường kính chia cho 2.',
            explanation: `Độ dài bán kính bằng một nửa độ dài đường kính: OM = ${d} : 2 = ${r} (cm). [SGK Kết nối tri thức - Bài 17, trang 52 Tập 1]`
          };
        }
      }

      // 3. Góc vuông, góc không vuông với thước Ê-ke (Bài 18) hoặc Khối lập phương/hộp chữ nhật (Bài 21)
      if (type === 'angle_or_cube') {
        if (Math.random() < 0.6) {
          const isRight = Math.random() < 0.55;
          const correctStr = isRight ? 'Góc vuông đỉnh O, cạnh OA và OB' : 'Góc không vuông đỉnh O, cạnh OA và OB';
          return {
            category: 'geo',
            topicName: 'Góc, góc vuông, góc không vuông (Thước Ê-ke)',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 18, trang 54',
            sgkAssetKey: 'angle_eke_b18',
            visualData: {
              type: 'angle',
              isRightAngle: isRight,
              vertex: 'O',
              arm1: 'A',
              arm2: 'B'
            },
            inputMode: 'mcq',
            questionText: `Bạn Rô-bốt đặt thước Ê-ke vào góc đỉnh O như hình vẽ. Em hãy cho biết góc đỉnh O là góc gì?`,
            correctAnswer: correctStr,
            numericAnswer: null,
            options: [
              'Góc vuông đỉnh O, cạnh OA và OB',
              'Góc không vuông đỉnh O, cạnh OA và OB',
              'Góc vuông đỉnh A, cạnh AO và AB',
              'Đường thẳng OA và OB'
            ],
            hint: 'Quan sát xem hai cạnh OA, OB có trùng khít với hai cạnh góc vuông của thước Ê-ke hay không.',
            explanation: isRight
              ? `Hai cạnh OA và OB trùng khít với hai cạnh góc vuông của thước ê-ke nên đây là Góc vuông đỉnh O, cạnh OA, OB. [SGK Kết nối tri thức - Bài 18, trang 54 Tập 1]`
              : `Cạnh OA không trùng với cạnh góc vuông của thước ê-ke nên góc đỉnh O là Góc không vuông. [SGK Kết nối tri thức - Bài 18, trang 54 Tập 1]`
          };
        } else {
          const prop = this.pick([
            { q: 'Khối lập phương và khối hộp chữ nhật đều có bao nhiêu ĐỈNH?', a: 8, w: [6, 10, 12], desc: '8 đỉnh, 12 cạnh và 6 mặt' },
            { q: 'Khối lập phương và khối hộp chữ nhật đều có bao nhiêu CẠNH?', a: 12, w: [6, 8, 10], desc: '8 đỉnh, 12 cạnh và 6 mặt' },
            { q: 'Khối lập phương có tất cả bao nhiêu MẶT đều là hình vuông?', a: 6, w: [4, 8, 12], desc: '6 mặt đều là hình vuông' }
          ]);
          return {
            category: 'geo',
            topicName: 'Khối lập phương, khối hộp chữ nhật',
            sgkCite: 'SGK Toán 3 Tập 1 - Bài 21, trang 62',
            sgkAssetKey: null,
            inputMode: 'numpad',
            questionText: prop.q,
            correctAnswer: String(prop.a),
            numericAnswer: prop.a,
            options: this.shuffle([String(prop.a), ...prop.w.map(String)]),
            hint: 'Nhớ chiếc hộp quà hoặc con xúc xắc của Rô-bốt có 8 đỉnh, 12 cạnh và 6 mặt nhé!',
            explanation: `Theo Bài 21 SGK Kết nối tri thức: Khối lập phương và khối hộp chữ nhật đều có ${prop.desc}. [SGK Kết nối tri thức - Bài 21, trang 62 Tập 1]`
          };
        }
      }

      // 4. Chu vi hình chữ nhật, hình vuông (Bài 50, 51 Tập 2)
      if (type === 'perimeter') {
        const isRect = Math.random() < 0.6;
        if (isRect) {
          const len = this.randInt(6, 14);
          const wid = this.randInt(3, len - 1);
          const peri = (len + wid) * 2;
          return {
            category: 'geo',
            topicName: 'Chu vi hình chữ nhật',
            sgkCite: 'SGK Toán 3 Tập 2 - Bài 50, trang 22',
            sgkAssetKey: 'perimeter_b50',
            visualData: {
              type: 'rect_grid',
              length: len,
              width: wid,
              unit: 'cm',
              showGrid: false
            },
            inputMode: 'numpad',
            questionText: `Một hình chữ nhật có chiều dài ${len} cm và chiều rộng ${wid} cm. Chu vi của hình chữ nhật đó là bao nhiêu xăng-ti-mét?`,
            correctAnswer: `${peri} cm`,
            numericAnswer: peri,
            options: this.makeNumericOptions(peri, 'cm', [len * wid - peri, -(len + wid), 4, -4]),
            hint: `Muốn tính chu vi hình chữ nhật, ta lấy (chiều dài + chiều rộng) × 2 = (${len} + ${wid}) × 2.`,
            explanation: `Chu vi hình chữ nhật là: (${len} + ${wid}) × 2 = ${peri} (cm). [SGK Kết nối tri thức - Bài 50, trang 22 Tập 2]`
          };
        } else {
          const side = this.randInt(4, 15);
          const peri = side * 4;
          return {
            category: 'geo',
            topicName: 'Chu vi hình vuông',
            sgkCite: 'SGK Toán 3 Tập 2 - Bài 50, trang 23',
            sgkAssetKey: 'perimeter_b50',
            visualData: {
              type: 'rect_grid',
              length: side,
              width: side,
              unit: 'cm',
              showGrid: false
            },
            inputMode: 'numpad',
            questionText: `Tính chu vi của hình vuông có độ dài cạnh bằng ${side} cm (đơn vị: cm).`,
            correctAnswer: `${peri} cm`,
            numericAnswer: peri,
            options: this.makeNumericOptions(peri, 'cm', [side * side - peri, -side, side, 4]),
            hint: `Muốn tính chu vi hình vuông, ta lấy độ dài một cạnh nhân với 4: ${side} × 4.`,
            explanation: `Chu vi của hình vuông là: ${side} × 4 = ${peri} (cm). [SGK Kết nối tri thức - Bài 50, trang 23 Tập 2]`
          };
        }
      }

      // 5. Diện tích hình chữ nhật, diện tích hình vuông (Bài 52 Tập 2)
      if (type === 'area') {
        const isRect = Math.random() < 0.6;
        if (isRect) {
          const len = this.randInt(5, 9);
          const wid = this.randInt(3, 6);
          const area = len * wid;
          return {
            category: 'geo',
            topicName: 'Diện tích hình chữ nhật (cm²)',
            sgkCite: 'SGK Toán 3 Tập 2 - Bài 52, trang 30',
            sgkAssetKey: 'area_grid_b52',
            visualData: {
              type: 'rect_grid',
              length: len,
              width: wid,
              unit: 'cm',
              showGrid: true
            },
            inputMode: 'numpad',
            questionText: `Một tấm thẻ hình chữ nhật có chiều dài ${len} cm, chiều rộng ${wid} cm (chia thành các ô vuông 1 cm² như hình vẽ). Diện tích tấm thẻ là bao nhiêu cm²?`,
            correctAnswer: `${area} cm²`,
            numericAnswer: area,
            options: this.makeNumericOptions(area, 'cm²', [(len + wid) * 2 - area, -len, len, 4]),
            hint: `Muốn tính diện tích hình chữ nhật, ta lấy chiều dài nhân với chiều rộng: ${len} × ${wid}.`,
            explanation: `Diện tích hình chữ nhật là: ${len} × ${wid} = ${area} (cm²). [SGK Kết nối tri thức - Bài 52, trang 30 Tập 2]`
          };
        } else {
          const side = this.randInt(4, 9);
          const area = side * side;
          return {
            category: 'geo',
            topicName: 'Diện tích hình vuông (cm²)',
            sgkCite: 'SGK Toán 3 Tập 2 - Bài 52, trang 31',
            sgkAssetKey: 'area_grid_b52',
            visualData: {
              type: 'rect_grid',
              length: side,
              width: side,
              unit: 'cm',
              showGrid: true
            },
            inputMode: 'numpad',
            questionText: `Một nhãn vở hình vuông có cạnh dài ${side} cm. Diện tích của nhãn vở đó bằng bao nhiêu xăng-ti-mét vuông (cm²)?`,
            correctAnswer: `${area} cm²`,
            numericAnswer: area,
            options: this.makeNumericOptions(area, 'cm²', [side * 4 - area, -side, side, 2]),
            hint: `Muốn tính diện tích hình vuông, ta lấy độ dài một cạnh nhân với chính nó: ${side} × ${side}.`,
            explanation: `Diện tích hình vuông là: ${side} × ${side} = ${area} (cm²). [SGK Kết nối tri thức - Bài 52, trang 31 Tập 2]`
          };
        }
      }

      // 6. Xem đồng hồ chính xác đến từng phút (Bài 66 Tập 2)
      if (type === 'clock_time') {
        const hour = this.randInt(1, 11);
        const minute = this.pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55, 12, 23, 38]);
        const nextHour = hour === 12 ? 1 : hour + 1;
        let correctStr = `${hour} giờ ${minute} phút`;
        if (minute >= 40 && Math.random() < 0.45) {
          correctStr = `${hour} giờ ${minute} phút (hay ${nextHour} giờ kém ${60 - minute} phút)`;
        }
        const w1 = `${hour} giờ ${(minute + 5) % 60 || 5} phút`;
        const w2 = `${nextHour} giờ ${minute} phút`;
        const w3 = `${hour} giờ ${Math.max(1, Math.round(minute / 5))} phút`;

        return {
          category: 'geo',
          topicName: 'Xem đồng hồ chính xác đến từng phút',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 66, trang 77',
          sgkAssetKey: 'clock_read_b66',
          visualData: {
            type: 'clock',
            hour,
            minute
          },
          inputMode: 'mcq',
          questionText: `Quan sát mặt đồng hồ của Rô-bốt (kim ngắn màu đỏ chỉ giờ, kim dài màu xanh chỉ phút). Đồng hồ đang chỉ mấy giờ mấy phút?`,
          correctAnswer: correctStr,
          numericAnswer: null,
          options: this.shuffle([correctStr, w1, w2, w3]),
          hint: `Kim ngắn qua số ${hour} là ${hour} giờ. Đếm tiếp từng vạch phút từ số 12 đến đầu kim dài màu xanh!`,
          explanation: `Kim giờ chỉ qua số ${hour}, kim phút chỉ vào vạch phút thứ ${minute} tính từ số 12. Vậy đồng hồ chỉ ${correctStr}. [SGK Kết nối tri thức - Bài 66, trang 77 Tập 2]`
        };
      }

      // 7. Đổi đơn vị đo mi-li-mét (Bài 30 Tập 1) hoặc Tiền Việt Nam (Bài 68 Tập 2)
      if (Math.random() < 0.5) {
        const cmVal = this.randInt(2, 7);
        const mmVal = cmVal * 10;
        return {
          category: 'geo',
          topicName: 'Đơn vị đo độ dài Mi-li-mét (mm)',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 30, trang 85',
          sgkAssetKey: 'mm_ruler_b30',
          visualData: {
            type: 'mm_ruler',
            cmVal,
            mmVal
          },
          inputMode: 'numpad',
          questionText: `Quan sát thước đo của Rô-bốt và đổi đơn vị:  ${cmVal} cm = ... mm?`,
          correctAnswer: `${mmVal} mm`,
          numericAnswer: mmVal,
          options: this.makeNumericOptions(mmVal, 'mm', [-10, 10, cmVal * 100 - mmVal, 5]),
          hint: 'Ta có 1 cm = 10 mm. Vậy nhân số xăng-ti-mét với 10!',
          explanation: `Vì 1 cm = 10 mm nên ${cmVal} cm = ${mmVal} mm. [SGK Kết nối tri thức - Bài 30, trang 85 Tập 1]`
        };
      } else {
        const penPrice = this.pick([5000, 8000, 10000]);
        const bookPrice = this.pick([12000, 15000, 20000]);
        const paid = 50000;
        const total = penPrice + bookPrice;
        const change = paid - total;
        return {
          category: 'geo',
          topicName: 'Tiền Việt Nam',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 68, trang 85',
          sgkAssetKey: 'vn_money_b68',
          inputMode: 'mcq',
          questionText: `Mai mua một chiếc bút giá ${this.formatNum(penPrice)} đồng và một quyển vở giá ${this.formatNum(bookPrice)} đồng. Mai đưa cho cô bán hàng tờ tiền ${this.formatNum(paid)} đồng. Hỏi cô bán hàng phải trả lại Mai bao nhiêu tiền?`,
          correctAnswer: `${this.formatNum(change)} đồng`,
          numericAnswer: change,
          options: this.makeNumericOptions(change, 'đồng', [-5000, 5000, 10000, total - change]),
          hint: `Bước 1: Tính tổng số tiền mua bút và vở (${this.formatNum(penPrice)} + ${this.formatNum(bookPrice)}). Bước 2: Lấy ${this.formatNum(paid)} đồng trừ đi tổng đó.`,
          explanation: `Tổng số tiền mua bút và vở là: ${this.formatNum(penPrice)} + ${this.formatNum(bookPrice)} = ${this.formatNum(total)} (đồng). Số tiền cô bán hàng trả lại Mai là: ${this.formatNum(paid)} - ${this.formatNum(total)} = ${this.formatNum(change)} (đồng). [SGK Kết nối tri thức - Bài 68, trang 85 Tập 2]`
        };
      }
    }

    /* ------------------------------------------------------------------------
     * ẢI 3: MÊ CUNG LỜI VĂN (GIẢI TOÁN CÓ LỜI VĂN VỚI VIỆT, NAM, MAI, MI, RÔ-BỐT)
     * ------------------------------------------------------------------------ */
    static genWordQuestion(idx = 0) {
      const subTypes = [
        'fold_up',
        'fold_down',
        'compare_times',
        'two_step_add_diff',
        'two_step_mult_total'
      ];
      const type = subTypes[idx % subTypes.length];

      // 1. Gấp một số lên một số lần (Bài 24 Tập 1)
      if (type === 'fold_up') {
        const viet = this.randInt(6, 12);
        const times = this.randInt(3, 6);
        const mai = viet * times;
        return {
          category: 'word',
          topicName: 'Gấp một số lên một số lần',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 24, trang 70',
          sgkAssetKey: 'mult_fold_b24',
          inputMode: 'numpad',
          questionText: `Bạn Việt gấp được ${viet} chiếc thuyền giấy, bạn Mai gấp được số thuyền giấy gấp ${times} lần số thuyền của Việt. Hỏi bạn Mai gấp được bao nhiêu chiếc thuyền giấy?`,
          correctAnswer: `${mai} chiếc`,
          numericAnswer: mai,
          options: this.makeNumericOptions(mai, 'chiếc', [viet + times - mai, -viet, viet, 4]),
          hint: `Muốn gấp một số lên một số lần, ta lấy số đó nhân với số lần: ${viet} × ${times}.`,
          explanation: `Số chiếc thuyền giấy bạn Mai gấp được là: ${viet} × ${times} = ${mai} (chiếc). [SGK Kết nối tri thức - Bài 24, trang 70 Tập 1]`
        };
      }

      // 2. Giảm một số đi một số lần (Bài 27 Tập 1)
      if (type === 'fold_down') {
        const times = this.randInt(3, 7);
        const after = this.randInt(5, 11);
        const before = after * times;
        return {
          category: 'word',
          topicName: 'Giảm một số đi một số lần',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 27, trang 79',
          sgkAssetKey: 'mult_fold_b24',
          inputMode: 'numpad',
          questionText: `Rô-bốt có một sợi dây cáp dài ${before} m. Sau khi cắt bớt để lắp trạm năng lượng, độ dài sợi dây giảm đi ${times} lần. Hỏi sợi dây còn lại dài bao nhiêu mét?`,
          correctAnswer: `${after} m`,
          numericAnswer: after,
          options: this.makeNumericOptions(after, 'm', [before - times - after, -2, 2, 5]),
          hint: `Muốn giảm một số đi một số lần, ta lấy số đó chia cho số lần: ${before} : ${times}.`,
          explanation: `Độ dài sợi dây còn lại là: ${before} : ${times} = ${after} (m). [SGK Kết nối tri thức - Bài 27, trang 79 Tập 1]`
        };
      }

      // 3. So sánh số lớn gấp mấy lần số bé (Bài 39 Tập 1)
      if (type === 'compare_times') {
        const small = this.randInt(4, 9);
        const times = this.randInt(3, 8);
        const big = small * times;
        return {
          category: 'word',
          topicName: 'So sánh số lớn gấp mấy lần số bé',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 39, trang 109',
          sgkAssetKey: 'mult_fold_b24',
          inputMode: 'numpad',
          questionText: `Trong vườn cây của trường, Nam trồng được ${big} cây hoa, Mi trồng được ${small} cây hoa. Hỏi số cây hoa của Nam gấp mấy lần số cây hoa của Mi?`,
          correctAnswer: `${times} lần`,
          numericAnswer: times,
          options: this.makeNumericOptions(times, 'lần', [big - small - times, -1, 1, 2]),
          hint: `Muốn biết số lớn gấp mấy lần số bé, ta lấy số lớn chia cho số bé: ${big} : ${small}.`,
          explanation: `Số cây hoa của Nam gấp số cây hoa của Mi số lần là: ${big} : ${small} = ${times} (lần). [SGK Kết nối tri thức - Bài 39, trang 109 Tập 1]`
        };
      }

      // 4. Bài toán giải bằng hai bước tính (Hơn/kém + Tổng hai phần - Bài 28 Tập 1)
      if (type === 'two_step_add_diff') {
        const first = this.randInt(18, 35);
        const diff = this.randInt(5, 14);
        const second = first + diff;
        const total = first + second;
        return {
          category: 'word',
          topicName: 'Bài toán giải bằng hai bước tính',
          sgkCite: 'SGK Toán 3 Tập 1 - Bài 28, trang 81',
          sgkAssetKey: 'two_step_b28',
          inputMode: 'numpad',
          questionText: `Thùng thứ nhất đựng ${first} lít mật ong rừng. Thùng thứ hai đựng nhiều hơn thùng thứ nhất ${diff} lít. Hỏi cả hai thùng đựng tất cả bao nhiêu lít mật ong?`,
          correctAnswer: `${total} lít`,
          numericAnswer: total,
          options: this.makeNumericOptions(total, 'lít', [second - total, -diff, diff, 10]),
          hint: `Bước 1: Tìm số lít mật ong ở thùng thứ hai (${first} + ${diff} = ${second} lít).\nBước 2: Tính tổng số lít ở cả hai thùng (${first} + ${second}).`,
          explanation: `Giải bằng 2 bước tính:\n• Bước 1: Thùng thứ hai có: ${first} + ${diff} = ${second} (lít).\n• Bước 2: Cả hai thùng có: ${first} + ${second} = ${total} (lít). [SGK Kết nối tri thức - Bài 28, trang 81 Tập 1]`
        };
      }

      // 5. Bài toán giải bằng hai bước tính (Gấp một số lần + Tổng hai phần - Bài 28 Tập 1)
      const nam = this.randInt(7, 15);
      const k = this.randInt(2, 4);
      const viet = nam * k;
      const total = nam + viet;
      return {
        category: 'word',
        topicName: 'Bài toán giải bằng hai bước tính',
        sgkCite: 'SGK Toán 3 Tập 1 - Bài 28, trang 81',
        sgkAssetKey: 'two_step_b28',
        inputMode: 'numpad',
        questionText: `Trong đợt quyên góp sách cho thư viện Rừng Pha Lê, bạn Nam góp được ${nam} quyển truyện, bạn Việt góp được số quyển truyện gấp ${k} lần của Nam. Hỏi cả hai bạn góp được tất cả bao nhiêu quyển truyện?`,
        correctAnswer: `${total} quyển`,
        numericAnswer: total,
        options: this.makeNumericOptions(total, 'quyển', [viet - total, -nam, 5, -5]),
        hint: `Bước 1: Tìm số quyển truyện của Việt (${nam} × ${k} = ${viet} quyển).\nBước 2: Cộng số truyện của cả Nam và Việt (${nam} + ${viet}).`,
        explanation: `Giải bằng 2 bước tính:\n• Bước 1: Số quyển truyện Việt góp là: ${nam} × ${k} = ${viet} (quyển).\n• Bước 2: Cả hai bạn góp được là: ${nam} + ${viet} = ${total} (quyển). [SGK Kết nối tri thức - Bài 28, trang 81 Tập 1]`
      };
    }

    /* ------------------------------------------------------------------------
     * ẢI 4: ĐỈNH NÚI THỐNG KÊ (THỐNG KÊ & XÁC SUẤT - BÀI 73, 74, 75 TẬP 2)
     * ------------------------------------------------------------------------ */
    static genStatQuestion(idx = 0) {
      const isProb = idx % 2 === 1;

      if (!isProb) {
        // Bảng số liệu thống kê (Bài 73, 75 Tập 2)
        const vNam = this.randInt(6, 12);
        const vViet = this.randInt(13, 19);
        const vMai = this.randInt(8, 14);
        const vMi = this.randInt(5, 10);
        const total = vNam + vViet + vMai + vMi;
        const diff = vViet - vMi;

        const askTotal = Math.random() < 0.55;
        const ans = askTotal ? total : diff;

        return {
          category: 'stat',
          topicName: 'Thu thập, phân loại, ghi chép số liệu. Bảng số liệu',
          sgkCite: 'SGK Toán 3 Tập 2 - Bài 73, trang 103',
          sgkAssetKey: 'stats_basketball_b73',
          visualData: {
            type: 'stats_table',
            title: 'Số quả bóng ném trúng rổ của 4 bạn',
            headers: ['Bạn nhỏ', 'Nam', 'Việt', 'Mai', 'Mi'],
            rows: [['Số quả vào rổ', vNam, vViet, vMai, vMi]]
          },
          inputMode: 'numpad',
          questionText: askTotal
            ? `Quan sát bảng số liệu trên và cho biết: Cả 4 bạn Nam, Việt, Mai, Mi ném được tất cả bao nhiêu quả bóng vào rổ?`
            : `Quan sát bảng số liệu trên và cho biết: Bạn Việt ném vào rổ nhiều hơn bạn Mi bao nhiêu quả bóng?`,
          correctAnswer: `${ans} quả`,
          numericAnswer: ans,
          options: this.makeNumericOptions(ans, 'quả', [-3, -2, -1, 1, 2, 4]),
          hint: askTotal
            ? `Cộng số quả bóng của cả 4 bạn: ${vNam} + ${vViet} + ${vMai} + ${vMi}.`
            : `Lấy số quả của Việt trừ đi số quả của Mi: ${vViet} - ${vMi}.`,
          explanation: askTotal
            ? `Tổng số quả bóng cả 4 bạn ném vào rổ là: ${vNam} + ${vViet} + ${vMai} + ${vMi} = ${total} (quả). [SGK Kết nối tri thức - Bài 73, trang 103 Tập 2]`
            : `Số quả bóng Việt ném nhiều hơn Mi là: ${vViet} - ${vMi} = ${diff} (quả). [SGK Kết nối tri thức - Bài 73, trang 103 Tập 2]`
        };
      }

      // Khả năng xảy ra của một sự kiện: Chắc chắn, Có thể, Không thể (Bài 74 Tập 2)
      const scenarios = [
        {
          balls: [
            { color: '#EF4444', label: 'Đỏ' },
            { color: '#EF4444', label: 'Đỏ' },
            { color: '#3B82F6', label: 'Xanh' },
            { color: '#FACC15', label: 'Vàng' }
          ],
          q: 'Trong hộp của Rô-bốt có 2 quả bóng Đỏ, 1 quả bóng Xanh và 1 quả bóng Vàng. Rô-bốt nhắm mắt lấy ngẫu nhiên 1 quả bóng. Khả năng "Rô-bốt lấy được quả bóng màu Đỏ" là gì?',
          ans: 'Có thể',
          exp: 'Vì trong hộp có cả bóng Đỏ, bóng Xanh và bóng Vàng nên sự kiện lấy được quả bóng màu Đỏ là "Có thể" xảy ra.'
        },
        {
          balls: [
            { color: '#EF4444', label: 'Đỏ' },
            { color: '#3B82F6', label: 'Xanh' },
            { color: '#FACC15', label: 'Vàng' }
          ],
          q: 'Trong hộp chỉ có bóng màu Đỏ, màu Xanh và màu Vàng. Rô-bốt lấy ngẫu nhiên 1 quả bóng. Khả năng "Rô-bốt lấy được quả bóng màu Tím" là gì?',
          ans: 'Không thể',
          exp: 'Vì trong hộp không có quả bóng màu Tím nào nên sự kiện lấy được bóng Tím là "Không thể" xảy ra.'
        },
        {
          balls: [
            { color: '#3B82F6', label: 'Xanh' },
            { color: '#3B82F6', label: 'Xanh' },
            { color: '#3B82F6', label: 'Xanh' },
            { color: '#3B82F6', label: 'Xanh' }
          ],
          q: 'Trong hộp có 4 quả bóng đều có màu Xanh. Bạn Mai nhắm mắt lấy ra 1 quả bóng bất kì. Khả năng "Mai lấy được quả bóng màu Xanh" là gì?',
          ans: 'Chắc chắn',
          exp: 'Vì tất cả các quả bóng trong hộp đều màu Xanh nên Mai "Chắc chắn" lấy được quả bóng màu Xanh.'
        }
      ];

      const sc = this.pick(scenarios);
      return {
        category: 'stat',
        topicName: 'Khả năng xảy ra của một sự kiện',
        sgkCite: 'SGK Toán 3 Tập 2 - Bài 74, trang 108',
        sgkAssetKey: 'prob_balls_coins_b74',
        visualData: {
          type: 'prob_box',
          items: sc.balls
        },
        inputMode: 'mcq',
        questionText: sc.q,
        correctAnswer: sc.ans,
        numericAnswer: null,
        options: ['Chắc chắn', 'Có thể', 'Không thể', 'Chưa xác định'],
        hint: 'Sử dụng 1 trong 3 từ khóa của Bài 74 SGK: "Chắc chắn", "Có thể" hoặc "Không thể".',
        explanation: `${sc.exp} [SGK Kết nối tri thức - Bài 74, trang 108 Tập 2]`
      };
    }
  }

  /* ==========================================================================
   * 4. MODULE GAMEMANAGER (QUẢN LÝ GAME LOOP, VẬT PHẨM, HUY HIỆU & LƯU TRỮ)
   * ========================================================================== */
  const STORAGE_KEY = 'math_knight_save_v1';

  class GameManager {
    constructor(config = {}) {
      const rawQCount = Number(config.questionsPerStage);
      const rawBook = String(config.bookMode || config.book || '').toLowerCase();
      const normalizedBook = rawBook === 'tap1' || rawBook === 'tap2' || rawBook === 'all' ? rawBook : '';
      this.config = {
        mode: config.mode || 'story',
        bookMode: normalizedBook,
        initialStage: Number(config.stage) || 0,
        questionsPerStage: rawQCount === 8 || !rawQCount ? 9 : Math.max(5, Math.min(15, rawQCount)),
        timerEnabled: config.timerEnabled !== false,
        timePerQuestion: Math.max(15, Math.min(60, Number(config.timePerQuestion) || 30)),
        initialLives: Math.max(1, Math.min(5, Number(config.initialLives) || 3)),
        enableSgkImages: config.enableSgkImages !== false,
        enabledTopics: Array.isArray(config.enabledTopics) && config.enabledTopics.length > 0
          ? config.enabledTopics
          : ['num', 'geo', 'word', 'stat'],
        apiUrl: config.apiUrl || '',
        nonce: config.nonce || ''
      };

      this.saveData = this.loadSaveData();
      if (this.config.bookMode) {
        this.setBookMode(this.config.bookMode);
      } else {
        this.syncBookProgressToTopLevel();
      }
      this.resetRunState();
    }

    sanitizePlayerName(rawName) {
      if (typeof rawName !== 'string') return 'Hiệp Sĩ Nhí';
      const cleaned = rawName
        .replace(/<[^>]*>/g, '')
        .replace(/[\u0000-\u001F\u007F]/g, '')
        .replace(/^[=+\-@|\t\r\n]+/, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 40);
      return cleaned || 'Hiệp Sĩ Nhí';
    }

    isValidHttpUrl(rawUrl) {
      if (typeof rawUrl !== 'string') return false;
      const trimmed = rawUrl.trim();
      if (!trimmed || /[\u0000-\u001F\u007F]/.test(trimmed)) return false;
      if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) return false;
      if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
      return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(trimmed);
    }

    createDefaultBookProgressEntry() {
      return {
        unlockedStage: 1,
        stageStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        crystals: []
      };
    }

    normalizeBookEntry(rawEntry) {
      const def = this.createDefaultBookProgressEntry();
      if (!rawEntry || typeof rawEntry !== 'object') return def;
      const rawStars = rawEntry.stageStars && typeof rawEntry.stageStars === 'object' ? rawEntry.stageStars : {};
      const cleanStars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (let i = 1; i <= 5; i++) {
        cleanStars[i] = Math.max(0, Math.min(3, Math.round(Number(rawStars[i]) || 0)));
      }
      const cleanCrystals = Array.isArray(rawEntry.crystals)
        ? [...new Set(rawEntry.crystals.map((c) => Math.round(Number(c))).filter((c) => c >= 1 && c <= 5))]
        : [];
      return {
        unlockedStage: Math.max(1, Math.min(5, Math.round(Number(rawEntry.unlockedStage) || 1))),
        stageStars: cleanStars,
        crystals: cleanCrystals
      };
    }

    loadSaveData() {
      const defaultSave = {
        playerName: 'Hiệp Sĩ Nhí',
        avatar: 'knight',
        bookMode: this.config.bookMode || 'tap1',
        highScore: 0,
        unlockedStage: 1,
        stageStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        crystals: [],
        bookProgress: {
          tap1: this.createDefaultBookProgressEntry(),
          tap2: this.createDefaultBookProgressEntry(),
          all: this.createDefaultBookProgressEntry()
        },
        badges: [],
        soundEnabled: true,
        timerEnabled: this.config.timerEnabled,
        history: []
      };
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultSave;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return defaultSave;
        const savedBookMode = parsed.bookMode === 'tap1' || parsed.bookMode === 'tap2' || parsed.bookMode === 'all'
          ? parsed.bookMode
          : defaultSave.bookMode;
        const topLevelEntry = this.normalizeBookEntry({
          unlockedStage: parsed.unlockedStage,
          stageStars: parsed.stageStars,
          crystals: parsed.crystals
        });
        const rawBP = parsed.bookProgress && typeof parsed.bookProgress === 'object' ? parsed.bookProgress : {};
        const bookProgress = {
          tap1: rawBP.tap1 ? this.normalizeBookEntry(rawBP.tap1) : (savedBookMode === 'tap1' ? topLevelEntry : this.createDefaultBookProgressEntry()),
          tap2: rawBP.tap2 ? this.normalizeBookEntry(rawBP.tap2) : (savedBookMode === 'tap2' ? topLevelEntry : this.createDefaultBookProgressEntry()),
          all: rawBP.all ? this.normalizeBookEntry(rawBP.all) : (savedBookMode === 'all' ? topLevelEntry : this.createDefaultBookProgressEntry())
        };
        const activeEntry = bookProgress[savedBookMode] || topLevelEntry;
        const validBadgeIds = new Set(BADGES_CONFIG.map((b) => b.id));
        const cleanBadges = Array.isArray(parsed.badges)
          ? [...new Set(parsed.badges.map(String).filter((id) => validBadgeIds.has(id)))]
          : [];
        const cleanHistory = Array.isArray(parsed.history)
          ? parsed.history.slice(0, 25).filter((h) => h && typeof h === 'object').map((h) => ({
              date: typeof h.date === 'string' ? h.date.slice(0, 40) : new Date().toISOString(),
              playerName: this.sanitizePlayerName(h.playerName),
              avatar: h.avatar === 'mage' ? 'mage' : 'knight',
              bookMode: h.bookMode === 'tap1' || h.bookMode === 'tap2' || h.bookMode === 'all' ? h.bookMode : 'tap1',
              score: Math.max(0, Math.min(36000, Math.round(Number(h.score) || 0))),
              stagesCleared: Math.max(0, Math.min(5, Math.round(Number(h.stagesCleared) || 0))),
              maxStreak: Math.max(0, Math.min(100, Math.round(Number(h.maxStreak) || 0))),
              accuracy: Math.max(0, Math.min(100, Math.round(Number(h.accuracy ?? 100) || 0))),
              mode: h.mode === 'practice' ? 'practice' : 'story'
            }))
          : [];
        return {
          ...defaultSave,
          playerName: this.sanitizePlayerName(parsed.playerName),
          avatar: parsed.avatar === 'mage' ? 'mage' : 'knight',
          bookMode: savedBookMode,
          highScore: Math.max(0, Math.min(36000, Math.round(Number(parsed.highScore) || 0))),
          unlockedStage: activeEntry.unlockedStage,
          stageStars: { ...activeEntry.stageStars },
          crystals: [...activeEntry.crystals],
          bookProgress,
          badges: cleanBadges,
          soundEnabled: parsed.soundEnabled !== false,
          timerEnabled: parsed.timerEnabled !== undefined ? Boolean(parsed.timerEnabled) : defaultSave.timerEnabled,
          history: cleanHistory
        };
      } catch (e) {
        return defaultSave;
      }
    }

    getBookMode() {
      const mode = this.saveData && this.saveData.bookMode;
      return mode === 'tap1' || mode === 'tap2' || mode === 'all' ? mode : 'tap1';
    }

    syncBookProgressToTopLevel() {
      const mode = this.getBookMode();
      if (!this.saveData.bookProgress || typeof this.saveData.bookProgress !== 'object') {
        this.saveData.bookProgress = {
          tap1: this.createDefaultBookProgressEntry(),
          tap2: this.createDefaultBookProgressEntry(),
          all: this.createDefaultBookProgressEntry()
        };
      }
      const entry = this.normalizeBookEntry(this.saveData.bookProgress[mode]);
      this.saveData.bookProgress[mode] = entry;
      this.saveData.unlockedStage = entry.unlockedStage;
      this.saveData.stageStars = { ...entry.stageStars };
      this.saveData.crystals = [...entry.crystals];
    }

    syncTopLevelToBookProgress() {
      const mode = this.getBookMode();
      if (!this.saveData.bookProgress || typeof this.saveData.bookProgress !== 'object') {
        this.saveData.bookProgress = {
          tap1: this.createDefaultBookProgressEntry(),
          tap2: this.createDefaultBookProgressEntry(),
          all: this.createDefaultBookProgressEntry()
        };
      }
      this.saveData.bookProgress[mode] = this.normalizeBookEntry({
        unlockedStage: this.saveData.unlockedStage,
        stageStars: this.saveData.stageStars,
        crystals: this.saveData.crystals
      });
    }

    setBookMode(mode) {
      const normalized = mode === 'tap1' || mode === 'tap2' || mode === 'all' ? mode : 'tap1';
      this.syncTopLevelToBookProgress();
      this.saveData.bookMode = normalized;
      this.syncBookProgressToTopLevel();
      this.persistSaveData();
    }

    getStagesConfig() {
      return getStagesForBook(this.getBookMode());
    }

    getCurrentStageConfig(stageId = this.currentStage) {
      const stages = this.getStagesConfig();
      return stages.find((s) => s.id === Number(stageId)) || stages[0];
    }

    persistSaveData() {
      try {
        this.syncTopLevelToBookProgress();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saveData));
      } catch (e) {
        // Bỏ qua nếu trình duyệt khóa localStorage
      }
    }

    resetRunState() {
      this.currentStage = 1;
      this.score = 0;
      this.lives = this.config.initialLives;
      this.maxLives = this.config.initialLives;
      this.streak = 0;
      this.maxStreak = 0;
      this.totalAnswered = 0;
      this.totalCorrect = 0;
      this.stageMistakes = 0;
      this.questions = [];
      this.qIndex = 0;
      this.bossMaxHp = this.config.questionsPerStage;
      this.bossHp = this.bossMaxHp;
      this.lastBossDamagePercent = 0;
      this.timeLeft = this.config.timePerQuestion;
      this.questionStartTime = Date.now();
      this.shieldActive = false;
      this.eliminatedOptions = [];
      this.hintTextVisible = false;
      this.items = {
        shield: 1,   // 🛡️ Khiên Ánh Sáng: Đỡ 1 lần trả lời sai
        hourglass: 1, // ⏳ Đồng Hồ Cát: +15 giây
        hint: 1      // 💡 Gợi Ý Rô-bốt: Loại 2 đáp án sai + hiện gợi ý
      };
      this.newlyUnlockedBadges = [];
    }

    startStage(stageId) {
      this.currentStage = Math.max(1, Math.min(5, Number(stageId) || 1));
      this.lives = this.config.initialLives;
      this.maxLives = this.config.initialLives;
      this.stageMistakes = 0;
      this.shieldActive = false;
      this.eliminatedOptions = [];
      this.hintTextVisible = false;
      this.items = { shield: 1, hourglass: 1, hint: 1 };
      this.questions = MathEngine.generateStageQuestions(
        this.currentStage,
        this.config.questionsPerStage,
        this.config.enabledTopics,
        this.getBookMode()
      );
      this.qIndex = 0;
      this.bossMaxHp = Math.max(1, this.questions.length);
      this.bossHp = this.bossMaxHp;
      this.lastBossDamagePercent = 0;
      this.timeLeft = this.config.timePerQuestion;
      this.questionStartTime = Date.now();
    }

    getBossHpPercent() {
      if (!this.bossMaxHp || this.bossMaxHp <= 0) return 0;
      return Math.max(0, Math.min(100, Math.round((this.bossHp / this.bossMaxHp) * 100)));
    }

    /**
     * Tính tỷ lệ hoàn thành vinh danh (Không trừ % thưởng khi bé bị mất máu/Tim để khích lệ học sinh lớp 3)
     */
    getAccuracyPercent() {
      if (!this.questions || this.questions.length === 0) return 100;
      const completed = Math.min(this.questions.length, this.qIndex + 1);
      return Math.max(100, Math.round((completed / this.questions.length) * 100));
    }

    getCurrentQuestion() {
      return this.questions[this.qIndex] || null;
    }

    isFuryMode() {
      return this.streak >= 3;
    }

    awardBadge(badgeId) {
      if (!this.saveData.badges.includes(badgeId)) {
        this.saveData.badges.push(badgeId);
        this.newlyUnlockedBadges.push(badgeId);
        this.persistSaveData();
        return true;
      }
      return false;
    }

    evaluateAnswer(userRawAnswer) {
      const q = this.getCurrentQuestion();
      if (!q) return null;

      this.totalAnswered++;
      const elapsedSec = (Date.now() - this.questionStartTime) / 1000;

      const cleanUser = String(userRawAnswer || '').trim().toLowerCase();
      const cleanCorrect = String(q.correctAnswer || '').trim().toLowerCase();
      const numericMatch =
        q.numericAnswer !== null &&
        q.numericAnswer !== undefined &&
        cleanUser !== '' &&
        !Number.isNaN(Number(cleanUser.replace(/\s+/g, ''))) &&
        Number(cleanUser.replace(/\s+/g, '')) === Number(q.numericAnswer);

      const isCorrect = cleanUser === cleanCorrect || numericMatch;
      const isLastQuestion = this.qIndex + 1 >= this.questions.length;
      const isBossQ = Boolean(q.isBossQuestion || isLastQuestion);

      if (isCorrect) {
        this.totalCorrect++;
        this.streak++;
        if (this.streak > this.maxStreak) {
          this.maxStreak = this.streak;
        }

        const speedBonus = this.saveData.timerEnabled ? Math.max(0, Math.floor(this.timeLeft * 3)) : 15;
        const furyMultiplier = this.isFuryMode() ? 2 : 1;
        const bossMultiplier = isBossQ ? 2 : 1;
        const gained = (100 + speedBonus) * furyMultiplier * bossMultiplier;
        this.score += gained;

        // Trừ ngay 1 đốt máu của Boss khi Hiệp sĩ trả lời đúng (câu cuối đưa về 0 ngay lập tức)
        const prevPercent = this.getBossHpPercent();
        this.bossHp = isLastQuestion ? 0 : Math.max(0, this.bossHp - 1);
        const newPercent = this.getBossHpPercent();
        this.lastBossDamagePercent = Math.max(1, prevPercent - newPercent);

        if (this.score > this.saveData.highScore) {
          this.saveData.highScore = this.score;
        }

        // Kiểm tra huy hiệu tốc độ & chuỗi Cuồng Nộ
        if (elapsedSec <= 5) {
          this.awardBadge('speed_demon');
        }
        if (this.streak >= 5) {
          this.awardBadge('fury_hero');
        }

        this.persistSaveData();
        return {
          isCorrect: true,
          chosenAnswer: String(userRawAnswer || ''),
          correctAnswer: q.correctAnswer,
          gained,
          multiplier: furyMultiplier,
          bossMultiplier,
          isBossQuestion: isBossQ,
          damageHp: 1,
          damagePercent: this.lastBossDamagePercent,
          bossHpLeft: this.bossHp,
          bossHpPercentLeft: newPercent,
          activatedFury: this.streak === 3,
          explanation: q.explanation,
          sgkCite: q.sgkCite
        };
      }

      // Trả lời sai hoặc hết giờ: Mất 1 Tim (hoặc dùng Khiên), TUYỆT ĐỐI KHÔNG trừ điểm và KHÔNG trừ % thưởng!
      this.streak = 0;
      this.stageMistakes++;
      this.lastBossDamagePercent = 0;
      let shieldUsed = false;

      if (this.shieldActive) {
        this.shieldActive = false;
        shieldUsed = true;
      } else {
        this.lives = Math.max(0, this.lives - 1);
      }

      this.persistSaveData();
      return {
        isCorrect: false,
        chosenAnswer: String(userRawAnswer || ''),
        shieldUsed,
        livesLeft: this.lives,
        penaltyPoints: 0,
        penaltyPercent: 0,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        sgkCite: q.sgkCite
      };
    }

    getEarnedStageStars() {
      return Math.max(1, Math.min(3, this.lives));
    }

    completeStage() {
      const st = this.currentStage;
      const earnedStars = this.getEarnedStageStars();
      if (!this.saveData.stageStars) {
        this.saveData.stageStars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      const prevStars = Number(this.saveData.stageStars[st] || 0);
      if (earnedStars > prevStars) {
        this.saveData.stageStars[st] = earnedStars;
      }
      if (!this.saveData.crystals.includes(st)) {
        this.saveData.crystals.push(st);
      }
      if (st >= this.saveData.unlockedStage && st < 5) {
        this.saveData.unlockedStage = st + 1;
      }
      this.syncTopLevelToBookProgress();

      // Trao huy hiệu theo ải
      if (st === 1) this.awardBadge('first_blood');
      if (st === 2 && this.stageMistakes === 0) this.awardBadge('geo_master');
      if (st === 3) this.awardBadge('word_wizard');
      if (st === 4) this.awardBadge('stat_sage');
      if (this.lives === this.maxLives) this.awardBadge('flawless_stage');
      if (st === 5) this.awardBadge('crystal_savior');

      if (this.score > this.saveData.highScore) {
        this.saveData.highScore = this.score;
      }

      this.recordHistory();
      this.persistSaveData();
      this.syncScoreToWordPress();
    }

    recordHistory() {
      const accuracy = this.getAccuracyPercent();
      const entry = {
        date: new Date().toISOString(),
        playerName: this.saveData.playerName,
        avatar: this.saveData.avatar,
        bookMode: this.getBookMode(),
        score: this.score,
        stagesCleared: this.saveData.crystals.length,
        maxStreak: this.maxStreak,
        accuracy,
        mode: this.config.mode
      };
      this.saveData.history.unshift(entry);
      this.saveData.history = this.saveData.history.slice(0, 25);
    }

    async syncScoreToWordPress() {
      const rawApiUrl = this.config.apiUrl || (window.MathKnightWPConfig && window.MathKnightWPConfig.restUrl) || '';
      const apiUrl = String(rawApiUrl).trim();
      if (!this.isValidHttpUrl(apiUrl) || typeof window.fetch !== 'function') return null;

      const accuracy = this.getAccuracyPercent();

      const payload = {
        player_name: this.sanitizePlayerName(this.saveData.playerName),
        avatar: this.saveData.avatar === 'mage' ? 'mage' : 'knight',
        score: Math.max(0, Math.min(36000, Math.round(Number(this.score) || 0))),
        stages_cleared: Math.max(0, Math.min(5, Math.round(Number(this.saveData.crystals.length) || 0))),
        max_streak: Math.max(0, Math.min(100, Math.round(Number(this.maxStreak) || 0))),
        accuracy: Math.max(0, Math.min(100, Math.round(Number(accuracy) || 0))),
        badges: Array.isArray(this.saveData.badges) ? this.saveData.badges : [],
        game_mode: this.config.mode === 'practice' ? 'practice' : 'story'
      };

      const headers = { 'Content-Type': 'application/json' };
      const nonce = this.config.nonce || (window.MathKnightWPConfig && window.MathKnightWPConfig.nonce) || '';
      if (nonce) {
        headers['X-WP-Nonce'] = String(nonce).trim();
      }

      try {
        const endpoint = apiUrl.endsWith('/') ? `${apiUrl}scores` : `${apiUrl}/scores`;
        const res = await window.fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        return null;
      }
    }

    async fetchLeaderboard() {
      const rawApiUrl = this.config.apiUrl || (window.MathKnightWPConfig && window.MathKnightWPConfig.restUrl) || '';
      const apiUrl = String(rawApiUrl).trim();
      if (this.isValidHttpUrl(apiUrl) && typeof window.fetch === 'function') {
        try {
          const endpoint = apiUrl.endsWith('/') ? `${apiUrl}leaderboard` : `${apiUrl}/leaderboard`;
          const res = await window.fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
              return data.leaderboard;
            }
          }
        } catch (e) {
          // Chuyển sang bảng xếp hạng cục bộ nếu offline
        }
      }

      if (window.MathKnightWPConfig && Array.isArray(window.MathKnightWPConfig.leaderboard) && window.MathKnightWPConfig.leaderboard.length > 0) {
        return window.MathKnightWPConfig.leaderboard;
      }

      // Kết hợp lịch sử localStorage và các bạn nhỏ trong SGK Kết nối tri thức
      const sgkFriends = [
        { playerName: 'Rô-bốt Thông Thái', avatar: 'mage', score: 2250, stagesCleared: 5, accuracy: 100 },
        { playerName: 'Bạn Mai Chăm Chỉ', avatar: 'mage', score: 1850, stagesCleared: 4, accuracy: 95 },
        { playerName: 'Hiệp Sĩ Nam', avatar: 'knight', score: 1620, stagesCleared: 4, accuracy: 92 },
        { playerName: 'Bạn Việt Sáng Tạo', avatar: 'knight', score: 1380, stagesCleared: 3, accuracy: 88 },
        { playerName: 'Bé Mi Đáng Yêu', avatar: 'mage', score: 1100, stagesCleared: 2, accuracy: 85 }
      ];

      const localEntries = this.saveData.history.map((h) => ({
        playerName: h.playerName || this.saveData.playerName,
        avatar: h.avatar || this.saveData.avatar,
        score: h.score,
        stagesCleared: h.stagesCleared,
        accuracy: h.accuracy
      }));

      if (this.saveData.highScore > 0 && localEntries.length === 0) {
        localEntries.push({
          playerName: this.saveData.playerName,
          avatar: this.saveData.avatar,
          score: this.saveData.highScore,
          stagesCleared: this.saveData.crystals.length,
          accuracy: 96
        });
      }

      return [...localEntries, ...sgkFriends]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }
  }

  /* ==========================================================================
   * 5. SHADOW DOM STYLESHEET (CÔ LẬP 100% GIAO DIỆN TRONG <math-knight-game>)
   * ========================================================================== */
  const SHADOW_CSS = `
    :host {
      display: block;
      width: 100%;
      margin: 0 auto;
      font-family: 'Nunito', 'Quicksand', 'Segoe UI', Roboto, system-ui, -apple-system, sans-serif;
      color: #0F3D5E;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }
    :host([standalone="true"]),
    :host(.mk-host-fullscreen),
    :host(:fullscreen),
    :host(:-webkit-full-screen) {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100dvh !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      z-index: 999999 !important;
      background: linear-gradient(135deg, #FFFDF5 0%, #E0F7FA 52%, #FEF9C3 100%);
      display: flex !important;
      align-items: stretch !important;
      justify-content: stretch !important;
      overflow: hidden !important;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    *::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    /* Khung chính 2.5D Paper-Cut Storybook - Lấp đầy 100% màn hình khi chạy độc lập / Fullscreen */
    .mk-shell {
      position: relative;
      width: 100%;
      height: clamp(600px, 88dvh, 820px);
      margin: 0 auto;
      background:
        radial-gradient(circle at 12% 18%, rgba(254, 240, 138, 0.55) 0%, transparent 38%),
        radial-gradient(circle at 88% 15%, rgba(167, 243, 208, 0.45) 0%, transparent 36%),
        radial-gradient(circle at 50% 92%, rgba(186, 230, 253, 0.55) 0%, transparent 45%),
        linear-gradient(145deg, #FFFDF7 0%, #F0F9FF 52%, #FEF9C3 100%);
      border: 3px solid #FFFFFF;
      border-radius: 28px;
      box-shadow: 0 10px 0 #BAE6FD, 0 24px 48px -12px rgba(14, 165, 233, 0.18);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    :host([standalone="true"]) .mk-shell,
    .mk-shell.mk-fullscreen {
      width: 100vw !important;
      height: 100dvh !important;
      max-width: none !important;
      max-height: 100dvh !important;
      min-height: 100dvh !important;
      border-radius: 0 !important;
      border: none !important;
      box-shadow: none !important;
    }
    .mk-fx-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 35;
    }
    /* Tầng 1: Thanh HUD / Topbar Paper-Cut Sáng Tươi (~58px) */
    .mk-topbar,
    .mk-hud-top {
      height: 58px;
      min-height: 58px;
      max-height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 0 20px;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      color: #0F3D5E;
      border-bottom: 3px solid #BAE6FD;
      box-shadow: 0 4px 16px rgba(14, 165, 233, 0.08);
      z-index: 15;
      flex-shrink: 0;
    }
    .mk-hud-left,
    .mk-hud-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .mk-hud-stage-title {
      font-weight: 900;
      font-size: 0.96rem;
      color: #0369A1;
      background: #F0F9FF;
      border: 2px solid #BAE6FD;
      padding: 4px 12px;
      border-radius: 999px;
      box-shadow: 0 3px 0 #BAE6FD;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 240px;
    }
    /* Thanh tiến độ 8 đốt Pha Lê + 1 đốt Boss cuối ải (8 + 1 = 9 đốt) */
    .mk-progress-track {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFDF5;
      border: 2px solid #FDE68A;
      border-radius: 999px;
      padding: 4px 12px;
      box-shadow: 0 3px 0 #FDE68A;
    }
    .mk-prog-node {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      font-weight: 900;
      background: #F1F5F9;
      border: 2px solid #CBD5E1;
      color: #64748B;
      transition: all 0.2s ease;
    }
    .mk-prog-node.done {
      background: #10B981;
      border-color: #6EE7B7;
      color: #FFFFFF;
      box-shadow: 0 2px 0 #059669;
    }
    .mk-prog-node.current {
      background: #FBBF24;
      border-color: #FEF08A;
      color: #78350F;
      transform: scale(1.14);
      box-shadow: 0 3px 0 #D97706;
      animation: mkPulse 0.75s infinite alternate;
    }
    .mk-prog-node.boss-node {
      width: 30px;
      height: 30px;
      border-color: #FDA4AF;
      background: #FFE4E6;
      color: #E11D48;
      font-size: 0.92rem;
    }
    .mk-prog-node.boss-node.current {
      background: #FB7185;
      border-color: #FFE4E6;
      color: #FFFFFF;
      box-shadow: 0 3px 0 #E11D48;
    }
    .mk-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 900;
      font-size: 1.08rem;
      cursor: pointer;
      color: #0369A1;
      white-space: nowrap;
    }
    .mk-brand-badge {
      background: #FEF08A;
      color: #854D0E;
      border: 2px solid #FACC15;
      font-size: 0.75rem;
      font-weight: 900;
      padding: 2px 10px;
      border-radius: 999px;
      box-shadow: 0 2px 0 #FACC15;
    }
    .mk-top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
    }
    .mk-icon-btn {
      background: #F0F9FF;
      color: #0369A1;
      border: 2px solid #BAE6FD;
      border-radius: 14px;
      padding: 5px 12px;
      font-family: inherit;
      font-size: 0.84rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 3px 0 #BAE6FD;
      transition: transform 0.12s ease, background 0.12s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    .mk-icon-btn:hover {
      background: #E0F2FE;
      transform: translateY(-1px);
    }
    .mk-icon-btn:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 #BAE6FD;
    }
    .mk-icon-btn.mk-active {
      background: #FEF08A;
      color: #854D0E;
      border-color: #FACC15;
      box-shadow: 0 3px 0 #F59E0B;
    }
    .mk-hud-hearts {
      font-size: 1.08rem;
      letter-spacing: 1px;
      white-space: nowrap;
      background: #FFF1F2;
      border: 2px solid #FECDD3;
      padding: 3px 10px;
      border-radius: 999px;
      box-shadow: 0 3px 0 #FECDD3;
    }
    .mk-hud-pill {
      background: #F0F9FF;
      border: 2px solid #BAE6FD;
      border-radius: 999px;
      padding: 4px 11px;
      font-weight: 900;
      font-size: 0.84rem;
      color: #0369A1;
      box-shadow: 0 3px 0 #BAE6FD;
      white-space: nowrap;
    }
    .mk-hud-pill.score-pill {
      background: #FEF9C3;
      border-color: #FDE047;
      color: #854D0E;
      box-shadow: 0 3px 0 #FACC15;
    }
    .mk-hud-pill.combo,
    .mk-hud-pill.combo-active {
      background: linear-gradient(90deg, #FBBF24, #FB7185);
      border-color: #FEF08A;
      color: #FFFFFF;
      box-shadow: 0 3px 0 #E11D48;
      animation: mkPulse 0.7s infinite alternate;
    }
    /* Vùng nội dung chính - Tuyệt đối không có thanh cuộn (Zero Scrollbar) */
    .mk-main {
      flex: 1;
      min-height: 0;
      height: calc(100% - 58px);
      padding: 14px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      z-index: 5;
    }
    .mk-main.mk-playing-layout {
      padding: 10px 18px 14px 18px;
      overflow: hidden;
      justify-content: space-between;
      gap: 12px;
    }
    /* Tầng 2: Sân khấu Chiến đấu 2.5D Paper-Cut - Nửa trên (~44% chiều cao) */
    .mk-battle-stage {
      position: relative;
      flex: 0 0 43%;
      height: 43%;
      min-height: 170px;
      max-height: 310px;
      border-radius: 24px;
      border: 3px solid #FFFFFF;
      overflow: hidden;
      box-shadow: 0 6px 0 #BAE6FD, 0 14px 28px -6px rgba(14, 165, 233, 0.14);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 10px 48px 10px 48px;
    }
    .mk-scene-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      pointer-events: none;
    }
    .mk-stage-props-bar {
      position: absolute;
      top: 10px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      z-index: 8;
      pointer-events: none;
    }
    .mk-stage-props-bar > * {
      pointer-events: auto;
    }
    .mk-prop-chip,
    .mk-item-chip {
      background: rgba(255, 255, 255, 0.94);
      border: 2px solid #BAE6FD;
      border-radius: 999px;
      padding: 4px 12px;
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 900;
      color: #0369A1;
      cursor: pointer;
      box-shadow: 0 3px 0 #7DD3FC;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: transform 0.12s ease, background 0.12s ease;
    }
    .mk-prop-chip:hover:not(:disabled),
    .mk-item-chip:hover:not(:disabled) {
      background: #FEF9C3;
      border-color: #FACC15;
      box-shadow: 0 3px 0 #F59E0B;
      color: #854D0E;
      transform: translateY(-1px);
    }
    .mk-prop-chip:disabled,
    .mk-item-chip:disabled {
      opacity: 0.48;
      cursor: not-allowed;
      box-shadow: none;
    }
    .mk-hint-popover {
      background: #FFFBEB;
      border: 2px solid #FDE047;
      border-radius: 999px;
      padding: 4px 14px;
      font-size: 0.8rem;
      font-weight: 800;
      color: #854D0E;
      box-shadow: 0 3px 0 #FACC15;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 55%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mk-stage-fighters {
      position: relative;
      z-index: 5;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 24px;
    }
    .mk-fighter-unit {
      position: relative;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mk-hero-name-tag,
    .mk-fighter-tag {
      background: rgba(255, 255, 255, 0.95);
      color: #0369A1;
      border: 2px solid #BAE6FD;
      border-radius: 999px;
      padding: 3px 12px;
      font-size: 0.8rem;
      font-weight: 900;
      margin-bottom: 3px;
      box-shadow: 0 3px 0 #7DD3FC;
      white-space: nowrap;
    }
    .mk-fury-aura-tag,
    .mk-fury-banner {
      background: linear-gradient(90deg, #FBBF24, #FB7185);
      color: #FFFFFF;
      border: 2px solid #FEF08A;
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 0.74rem;
      font-weight: 900;
      margin-bottom: 3px;
      box-shadow: 0 3px 0 #E11D48;
      animation: mkPulse 0.6s infinite alternate;
    }
    /* Thanh máu Paper-Cut Sáng Tươi trên đầu Quái vật chia theo 9 đốt câu hỏi (9/9 ❤️) */
    .mk-monster-hp-wrap {
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #FECDD3;
      border-radius: 16px;
      padding: 4px 10px;
      margin-bottom: 4px;
      text-align: center;
      min-width: 158px;
      box-shadow: 0 4px 0 #FDA4AF;
    }
    .mk-monster-name-row,
    .mk-monster-hp-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 900;
      color: #0F3D5E;
      margin-bottom: 3px;
    }
    .mk-monster-hp-text,
    .mk-monster-hp-count {
      color: #E11D48;
      font-weight: 900;
    }
    .mk-hp-segments {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      gap: 2.5px;
      width: 146px;
      height: 10px;
      background: #FFE4E6;
      padding: 2px;
      border-radius: 999px;
    }
    .mk-hp-seg {
      background: linear-gradient(180deg, #FB7185 0%, #F43F5E 100%);
      border-radius: 999px;
      transition: all 0.25s ease;
    }
    .mk-hp-seg.lost {
      background: #FECDD3;
      opacity: 0.45;
    }
    .mk-sprite-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mk-char-svg {
      width: clamp(92px, 13vh, 118px);
      height: clamp(92px, 13vh, 118px);
      flex-shrink: 0;
    }
    .mk-floating-dmg {
      position: absolute;
      top: -14px;
      right: -10px;
      background: #FB7185;
      color: #FFFFFF;
      border: 2px solid #FFFFFF;
      font-weight: 900;
      font-size: 0.82rem;
      padding: 3px 10px;
      border-radius: 999px;
      box-shadow: 0 3px 0 #E11D48;
      animation: mkDamagePop 0.55s ease;
      z-index: 10;
      white-space: nowrap;
    }
    /* Tầng 3: Bảng Câu hỏi Storybook 2.5D Paper-Cut & 4 Đáp án - Nửa dưới (~55%) */
    .mk-parchment-board {
      flex: 1;
      min-height: 0;
      background: #FFFDF7;
      border: 3px solid #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 8px 0 #FDE68A, 0 18px 36px -8px rgba(245, 158, 11, 0.16);
      padding: 12px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .mk-parchment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
      flex-shrink: 0;
    }
    .mk-boss-q-badge {
      background: linear-gradient(90deg, #F59E0B, #FB7185);
      color: #FFFFFF;
      font-weight: 900;
      font-size: 0.78rem;
      padding: 3px 11px;
      border-radius: 999px;
      border: 2px solid #FEF08A;
      box-shadow: 0 3px 0 #D97706;
      animation: mkPulse 0.75s infinite alternate;
    }
    /* Bố cục 2 cột ngang khi có hình vẽ SVG minh họa (svgVisual) để không bao giờ tràn chiều cao */
    .mk-parchment-body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }
    .mk-parchment-body.has-visual {
      display: grid;
      grid-template-columns: minmax(210px, 35%) minmax(0, 1fr);
      align-items: center;
      gap: 16px;
    }
    @media (max-width: 720px) {
      .mk-parchment-body.has-visual {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    .mk-visual-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .mk-visual-col svg {
      max-height: clamp(110px, 18vh, 150px);
      width: auto;
      max-width: 100%;
    }
    .mk-qa-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }
    .mk-q-text {
      font-size: clamp(1.02rem, 1.8vw, 1.22rem);
      font-weight: 900;
      line-height: 1.35;
      color: #0F3D5E;
      margin: 0 0 10px 0;
    }
    /* 4 nút đáp án lớn 2.5D Paper-Cut (choices[4]) */
    .mk-options-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 14px;
    }
    .mk-opt-btn {
      min-width: 0;
      min-height: 52px;
      padding: 8px 16px;
      background: #FFFFFF;
      border: 2px solid #BAE6FD;
      border-radius: 16px;
      box-shadow: 0 5px 0 #BAE6FD, 0 8px 16px rgba(14, 165, 233, 0.08);
      font-family: inherit;
      font-size: 1.04rem;
      font-weight: 900;
      color: #0F3D5E;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: left;
      transition: transform 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
    }
    .mk-opt-btn:hover:not(:disabled) {
      background: #FEF9C3;
      border-color: #FDE047;
      box-shadow: 0 5px 0 #FACC15, 0 10px 20px rgba(245, 158, 11, 0.14);
      transform: translateY(-2px);
    }
    .mk-opt-btn:active:not(:disabled) {
      transform: translateY(2px);
      box-shadow: 0 2px 0 #FACC15;
    }
    .mk-opt-btn:disabled {
      cursor: default;
    }
    .mk-opt-btn.eliminated {
      opacity: 0.32;
      pointer-events: none;
    }
    .mk-opt-btn.is-correct {
      background: #10B981 !important;
      border-color: #6EE7B7 !important;
      box-shadow: 0 5px 0 #059669 !important;
      color: #FFFFFF !important;
    }
    .mk-opt-btn.is-wrong {
      background: #FB7185 !important;
      border-color: #FECDD3 !important;
      box-shadow: 0 5px 0 #E11D48 !important;
      color: #FFFFFF !important;
    }
    .mk-opt-letter {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: #E0F2FE;
      color: #0284C7;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.92rem;
      flex-shrink: 0;
      box-shadow: 0 2px 0 #BAE6FD;
    }
    .mk-opt-btn:hover:not(:disabled) .mk-opt-letter {
      background: #FEF08A;
      color: #854D0E;
      box-shadow: 0 2px 0 #FACC15;
    }
    .mk-opt-btn.is-correct .mk-opt-letter {
      background: rgba(255, 255, 255, 0.25);
      color: #FFFFFF;
      box-shadow: none;
    }
    .mk-opt-btn.is-wrong .mk-opt-letter {
      background: rgba(255, 255, 255, 0.25);
      color: #FFFFFF;
      box-shadow: none;
    }
    /* Thanh giải thích gọn gàng ngay dưới 4 nút */
    .mk-parchment-footer {
      margin-top: 6px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 14px;
      border-radius: 16px;
      background: #F0F9FF;
      border: 2px solid #BAE6FD;
      flex-shrink: 0;
    }
    .mk-feedback-inline {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 800;
      color: #0F3D5E;
      line-height: 1.3;
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }
    .mk-feedback-badge {
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 900;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .mk-feedback-badge.ok {
      background: #D1FAE5;
      color: #047857;
      border: 1.5px solid #34D399;
    }
    .mk-feedback-badge.err {
      background: #FFE4E6;
      color: #BE123C;
      border: 1.5px solid #FDA4AF;
    }
    /* Các thành phần dùng chung ở màn hình Khởi đầu, Bản đồ, Sổ tay, Bảng vàng */
    .mk-topic-tag {
      background: #FEF9C3;
      color: #854D0E;
      border: 2px solid #FDE047;
      font-weight: 900;
      font-size: 0.76rem;
      padding: 3px 10px;
      border-radius: 999px;
      box-shadow: 0 2px 0 #FDE047;
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .mk-cite-tag {
      background: #E0F2FE;
      color: #0369A1;
      border: 2px solid #BAE6FD;
      font-weight: 800;
      font-size: 0.74rem;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .mk-tts-btn {
      background: #FFFFFF;
      color: #0369A1;
      border: 2px solid #BAE6FD;
      border-radius: 999px;
      padding: 3px 11px;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 2px 0 #BAE6FD;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .mk-tts-btn:hover {
      background: #FEF9C3;
      border-color: #FACC15;
      color: #854D0E;
    }
    .mk-visual-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 100%;
    }
    .mk-dynamic-svg-box {
      background: #FFFFFF;
      border: 2px solid #E0F2FE;
      border-radius: 18px;
      padding: 6px 12px;
      box-shadow: 0 4px 0 #BAE6FD;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 100%;
    }
    .mk-sgk-drawer {
      width: 100%;
      background: #FFFBEB;
      border: 2px solid #FDE047;
      border-radius: 12px;
      padding: 5px 12px;
      font-family: inherit;
      font-size: 0.76rem;
      cursor: pointer;
      box-shadow: 0 3px 0 #FDE047;
      transition: transform 0.12s ease, background 0.12s ease;
    }
    .mk-sgk-drawer:hover {
      background: #FEF08A;
      transform: translateY(-1px);
    }
    .mk-sgk-summary {
      cursor: pointer;
      font-weight: 800;
      color: #B45309;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .mk-sgk-card-body {
      margin-top: 6px;
      text-align: center;
    }
    .mk-sgk-crop-img {
      max-width: 100%;
      max-height: 110px;
      border-radius: 8px;
    }
    .mk-stats-table-wrap {
      width: 100%;
      max-width: 360px;
    }
    .mk-stats-table-title {
      font-weight: 900;
      color: #0369A1;
      text-align: center;
      margin-bottom: 4px;
      font-size: 0.82rem;
    }
    .mk-stats-table {
      width: 100%;
      border-collapse: collapse;
      background: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      font-size: 0.84rem;
      box-shadow: 0 4px 0 #BAE6FD;
    }
    .mk-stats-table th {
      background: #38BDF8;
      color: #FFFFFF;
      padding: 6px 10px;
      font-weight: 900;
      border: 1.5px solid #BAE6FD;
    }
    .mk-stats-table td {
      padding: 6px 10px;
      text-align: center;
      border: 1.5px solid #E0F2FE;
      font-weight: 800;
      color: #0F3D5E;
    }
    .mk-expr-visual-card {
      background: #F0F9FF;
      border: 2px solid #7DD3FC;
      border-radius: 16px;
      padding: 8px 14px;
      text-align: center;
      box-shadow: 0 4px 0 #BAE6FD;
    }
    .mk-expr-formula {
      font-size: 1.2rem;
      font-weight: 900;
      color: #0284C7;
    }
    .mk-expr-rule {
      font-size: 0.76rem;
      color: #0369A1;
      margin-top: 3px;
      font-weight: 700;
    }
    /* Màn hình Khởi đầu (Start Screen) - 2.5D Paper-Cut Storybook, Vừa khít 100% không cuộn */
    .mk-hero-banner {
      width: 100%;
      height: 100%;
      max-height: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1.32fr) minmax(0, 0.68fr);
      gap: clamp(14px, 2.2vw, 24px);
      align-items: center;
      background: #FFFDF9;
      border: 3px solid #FFFFFF;
      border-radius: 28px;
      padding: clamp(12px, 2vh, 22px) clamp(18px, 2.6vw, 32px);
      box-shadow: 0 8px 0 #FDE68A, 0 22px 44px -10px rgba(245, 158, 11, 0.16);
      overflow: hidden;
      box-sizing: border-box;
    }
    @media (max-width: 820px) {
      .mk-hero-banner {
        grid-template-columns: minmax(0, 1fr);
        padding: 14px;
      }
    }
    .mk-title-xl {
      font-size: clamp(1.32rem, 2.3vw, 1.85rem);
      font-weight: 900;
      color: #0284C7;
      margin: 0 0 4px 0;
      line-height: 1.16;
      letter-spacing: -0.01em;
    }
    .mk-subtitle {
      font-size: clamp(0.82rem, 1.15vw, 0.92rem);
      color: #334155;
      line-height: 1.35;
      margin: 0 0 8px 0;
      font-weight: 700;
    }
    .mk-kntt-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FEF9C3;
      border: 2px solid #FDE047;
      color: #854D0E;
      font-weight: 900;
      font-size: 0.78rem;
      padding: 3px 11px;
      border-radius: 999px;
      box-shadow: 0 3px 0 #FDE047;
      margin-bottom: 6px;
    }
    /* Bộ chọn Chế độ Học liệu 3 Tab: Tập 1 | Tập 2 | Tổng Hợp */
    .mk-book-tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 8px;
    }
    .mk-book-tab {
      min-width: 0;
      background: #FFFFFF;
      border: 2px solid #BAE6FD;
      border-radius: 14px;
      padding: 6px 10px;
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 900;
      color: #0369A1;
      cursor: pointer;
      box-shadow: 0 3px 0 #BAE6FD;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: transform 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
    }
    .mk-book-tab:hover {
      background: #F0F9FF;
      transform: translateY(-1px);
    }
    .mk-book-tab.active {
      background: linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%);
      border-color: #FEF08A;
      color: #FFFFFF;
      box-shadow: 0 3px 0 #D97706;
    }
    .mk-form-group {
      margin-bottom: 8px;
    }
    .mk-label {
      display: block;
      font-weight: 900;
      font-size: 0.84rem;
      margin-bottom: 4px;
      color: #0F3D5E;
    }
    .mk-input {
      width: 100%;
      padding: 7px 12px;
      font-size: 0.94rem;
      font-family: inherit;
      font-weight: 800;
      border: 2.5px solid #BAE6FD;
      border-radius: 14px;
      background: #FFFFFF;
      color: #0F3D5E;
      box-shadow: 0 3px 0 #E0F2FE;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .mk-input:focus {
      border-color: #38BDF8;
      box-shadow: 0 3px 0 #BAE6FD;
    }
    .mk-avatar-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 10px;
    }
    .mk-avatar-card {
      min-width: 0;
      background: #FFFFFF;
      border: 2.5px solid #E2E8F0;
      border-radius: 18px;
      padding: 6px 10px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 4px 0 #E2E8F0;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .mk-avatar-card:hover {
      transform: translateY(-2px);
      border-color: #BAE6FD;
      box-shadow: 0 5px 0 #BAE6FD;
    }
    .mk-avatar-card.selected {
      background: #F0F9FF;
      border-color: #38BDF8;
      box-shadow: 0 4px 0 #7DD3FC;
    }
    .mk-avatar-card svg {
      width: clamp(48px, 7vh, 62px);
      height: clamp(48px, 7vh, 62px);
      flex-shrink: 0;
    }
    .mk-avatar-info {
      text-align: left;
    }
    .mk-avatar-name {
      font-weight: 900;
      font-size: 0.95rem;
      color: #0F3D5E;
    }
    /* CTA Button Row - Luôn nằm gọn trên 1 hàng ngang duy nhất (No CTA Wrap) */
    .mk-btn-row {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 10px;
    }
    @media (max-width: 680px) {
      .mk-btn-row {
        flex-wrap: wrap;
      }
    }
    .mk-btn {
      min-height: 46px;
      padding: 9px 18px;
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: 900;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
      transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease;
    }
    .mk-btn:hover:not(:disabled) {
      filter: brightness(1.04);
      transform: translateY(-2px);
    }
    .mk-btn:active:not(:disabled) {
      transform: translateY(2px);
    }
    .mk-btn-primary {
      background: linear-gradient(180deg, #34D399 0%, #10B981 100%);
      color: #FFFFFF;
      box-shadow: 0 5px 0 #059669, 0 10px 20px -4px rgba(16, 185, 129, 0.28);
    }
    .mk-btn-amber {
      background: linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%);
      color: #FFFFFF;
      box-shadow: 0 5px 0 #D97706, 0 10px 20px -4px rgba(245, 158, 11, 0.26);
    }
    .mk-btn-outline {
      background: #FFFFFF;
      color: #0369A1;
      border: 2px solid #BAE6FD;
      box-shadow: 0 5px 0 #BAE6FD;
    }
    .mk-sgk-cover-box {
      background: linear-gradient(180deg, #F0F9FF 0%, #FFFDF5 100%);
      border: 3px solid #BAE6FD;
      border-radius: 24px;
      padding: clamp(12px, 2vh, 20px);
      text-align: center;
      box-shadow: 0 6px 0 #BAE6FD;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .mk-sgk-cover-img {
      width: auto;
      max-width: 100%;
      max-height: clamp(145px, 27vh, 230px);
      object-fit: contain;
      border-radius: 14px;
      box-shadow: 0 8px 20px rgba(14, 165, 233, 0.16);
      margin-bottom: 10px;
    }
    /* Màn hình Bản đồ 5 Ải - Vừa khít 100% chiều cao & chiều rộng không tràn (Zero Overflow) */
    .mk-map-panel {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.94);
      border: 3px solid #FFFFFF;
      border-radius: 26px;
      padding: 12px 18px 14px 18px;
      box-shadow: 0 8px 0 #BAE6FD, 0 20px 40px -10px rgba(14, 165, 233, 0.14);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mk-map-grid {
      flex: 1;
      min-height: 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
      margin: 2px 0;
      align-items: stretch;
    }
    @media (max-width: 860px) {
      .mk-map-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
    .mk-stage-node {
      min-width: 0;
      min-height: 0;
      background: #FFFDF7;
      border: 2.5px solid #E2E8F0;
      border-radius: 20px;
      padding: 8px 10px 10px 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      transition: transform 0.16s ease, box-shadow 0.16s ease;
      overflow: hidden;
    }
    .mk-stage-node svg.mk-char-svg {
      width: clamp(48px, 7.8vh, 68px);
      height: clamp(48px, 7.8vh, 68px);
    }
    .mk-stage-node.unlocked {
      background: #FFFFFF;
      border-color: #7DD3FC;
      box-shadow: 0 5px 0 #BAE6FD;
      cursor: pointer;
    }
    .mk-stage-node.unlocked:hover {
      transform: translateY(-2px);
      border-color: #38BDF8;
      box-shadow: 0 7px 0 #7DD3FC;
    }
    .mk-stage-node.cleared {
      border-color: #6EE7B7;
      background: linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%);
      box-shadow: 0 5px 0 #34D399;
      cursor: pointer;
    }
    .mk-stage-node.locked {
      opacity: 0.65;
      background: #F8FAFC;
      cursor: not-allowed;
    }
    /* Bộ sưu tập 8 Huy Hiệu Hiệp Sĩ - Grid 4x2 với minmax(0, 1fr) chống tràn ngang 100% */
    .mk-badge-section {
      border-top: 2px dashed #BAE6FD;
      padding-top: 6px;
      flex-shrink: 0;
      width: 100%;
      min-width: 0;
    }
    .mk-badge-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      width: 100%;
    }
    @media (max-width: 860px) {
      .mk-badge-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    .mk-badge-card {
      min-width: 0;
      width: 100%;
      border-radius: 14px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mk-badge-card.earned {
      background: #FEF9C3;
      border: 2px solid #FDE047;
      box-shadow: 0 3px 0 #FACC15;
      opacity: 1;
    }
    .mk-badge-card.locked {
      background: #F8FAFC;
      border: 2px solid #E2E8F0;
      box-shadow: 0 3px 0 #E2E8F0;
      opacity: 0.72;
    }
    .mk-badge-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .mk-badge-text-wrap {
      min-width: 0;
      flex: 1;
      overflow: hidden;
    }
    .mk-badge-title {
      font-weight: 900;
      font-size: 0.78rem;
      color: #0F3D5E;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mk-badge-desc {
      font-size: 0.68rem;
      color: #475569;
      font-weight: 700;
      line-height: 1.22;
      white-space: normal;
       word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .mk-stat-pill {
      background: #F0F9FF;
      border: 2px solid #BAE6FD;
      border-radius: 999px;
      padding: 5px 14px;
      font-weight: 900;
      font-size: 0.9rem;
      color: #0F3D5E;
      box-shadow: 0 3px 0 #BAE6FD;
    }
    /* Màn hình Sổ tay SGK - Vừa khít 100% chiều cao + Hỗ trợ Click mở Dialog xem tập trung */
    .mk-handbook-panel {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      border: 3px solid #FFFFFF;
      border-radius: 26px;
      padding: 12px 18px;
      box-shadow: 0 8px 0 #BAE6FD, 0 20px 40px -10px rgba(14, 165, 233, 0.14);
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mk-handbook-grid {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
      gap: 12px;
      overflow-y: auto;
      padding: 2px 4px 8px 4px;
      align-content: start;
    }
    .mk-hb-card {
      min-width: 0;
      background: #FFFDF9;
      border: 2.5px solid #BAE6FD;
      border-radius: 20px;
      padding: 10px 12px;
      box-shadow: 0 5px 0 #BAE6FD;
      display: flex;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      position: relative;
    }
    .mk-hb-card:hover {
      transform: translateY(-3px);
      background: #FFFFFF;
      border-color: #38BDF8;
      box-shadow: 0 7px 0 #7DD3FC, 0 14px 24px -6px rgba(14, 165, 233, 0.18);
    }
    .mk-hb-card:active {
      transform: translateY(1px);
      box-shadow: 0 3px 0 #7DD3FC;
    }
    .mk-hb-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      flex-wrap: nowrap;
      min-width: 0;
    }
    .mk-hb-img-wrap {
      position: relative;
      width: 100%;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1.5px solid #E0F2FE;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mk-hb-img {
      width: 100%;
      height: clamp(82px, 12.5vh, 110px);
      object-fit: contain;
      display: block;
    }
    .mk-hb-zoom-hint {
      position: absolute;
      bottom: 5px;
      right: 6px;
      background: rgba(255, 255, 255, 0.92);
      color: #0284C7;
      border: 1.5px solid #BAE6FD;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 0.68rem;
      font-weight: 900;
      box-shadow: 0 2px 0 #BAE6FD;
      pointer-events: none;
    }
    .mk-hb-rule-preview {
      font-size: 0.8rem;
      color: #334155;
      font-weight: 700;
      line-height: 1.38;
      white-space: pre-line;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    /* Dialog Phóng To Sổ Tay Bí Kíp 2.5D Paper-Cut (Focused Modal View) */
    .mk-hb-modal-backdrop {
      position: absolute;
      inset: 0;
      z-index: 80;
      background: rgba(15, 61, 94, 0.56);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(6px, 1.2vh, 14px);
      animation: mkFadeIn 0.16s ease-out;
    }
    .mk-hb-modal-dialog {
      background: #FFFDF9;
      border: 3px solid #FFFFFF;
      border-radius: 28px;
      box-shadow: 0 10px 0 #7DD3FC, 0 28px 60px rgba(15, 61, 94, 0.35);
      width: 97%;
      max-width: 1280px;
      height: 96%;
      max-height: 96%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: clamp(14px, 2.2vh, 22px) clamp(18px, 2.6vw, 30px);
      gap: 14px;
      overflow: hidden;
      animation: mkModalPop 0.22s cubic-bezier(0.22, 1, 0.36, 1);
      box-sizing: border-box;
    }
    .mk-hb-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: nowrap;
      border-bottom: 2px dashed #BAE6FD;
      padding-bottom: 10px;
      flex-shrink: 0;
    }
    .mk-hb-modal-body {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(340px, 52%) minmax(0, 48%);
      gap: 22px;
      align-items: stretch;
      overflow: hidden;
    }
    @media (max-width: 760px) {
      .mk-hb-modal-body {
        grid-template-columns: minmax(0, 1fr);
        overflow-y: auto;
      }
    }
    .mk-hb-modal-img-box {
      background: #FFFFFF;
      border: 2.5px solid #7DD3FC;
      border-radius: 22px;
      padding: 12px 14px;
      box-shadow: 0 6px 0 #BAE6FD;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      cursor: zoom-in;
      position: relative;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .mk-hb-modal-img-box:hover {
      border-color: #0284C7;
      box-shadow: 0 8px 0 #7DD3FC, 0 12px 24px rgba(2, 132, 199, 0.16);
      transform: translateY(-2px);
    }
    .mk-hb-zoom-hint {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%);
      color: #0369A1;
      border: 1.5px solid #38BDF8;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 0.78rem;
      font-weight: 900;
      white-space: nowrap;
      box-shadow: 0 2px 0 #7DD3FC;
      flex-shrink: 0;
    }
    .mk-hb-modal-img {
      width: 100%;
      flex: 1;
      min-height: 0;
      max-height: clamp(240px, 56vh, 480px);
      object-fit: contain;
      border-radius: 12px;
      transition: transform 0.18s ease;
    }
    .mk-hb-modal-img-box:hover .mk-hb-modal-img {
      transform: scale(1.02);
    }
    .mk-hb-modal-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
      min-width: 0;
      overflow-y: auto;
      padding-right: 4px;
    }
    .mk-hb-modal-title {
      font-size: clamp(1.28rem, 2.2vw, 1.62rem);
      font-weight: 900;
      color: #0284C7;
      line-height: 1.25;
      margin: 0;
    }
    .mk-hb-modal-rule-box {
      background: #FFFBEB;
      border: 2.5px solid #FDE047;
      border-radius: 20px;
      padding: 16px 18px;
      box-shadow: 0 5px 0 #FDE68A;
      font-size: clamp(0.98rem, 1.45vw, 1.14rem);
      font-weight: 800;
      color: #0F3D5E;
      line-height: 1.58;
      white-space: pre-line;
    }
    .mk-hb-modal-formula-box {
      background: #F0F9FF;
      border: 2.5px solid #7DD3FC;
      border-radius: 18px;
      padding: 14px 18px;
      box-shadow: 0 5px 0 #BAE6FD;
      font-size: clamp(0.98rem, 1.45vw, 1.14rem);
      font-weight: 900;
      color: #0369A1;
      line-height: 1.45;
    }
    .mk-hb-modal-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-top: 2px dashed #BAE6FD;
      padding-top: 10px;
      flex-shrink: 0;
    }
    /* Popup Lightbox Xem Ảnh SGK Cực Rõ Toàn Màn Hình */
    .mk-img-lightbox-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: clamp(10px, 2vh, 20px);
      box-sizing: border-box;
      animation: mkFadeIn 0.16s ease-out;
    }
    .mk-img-lightbox-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: rgba(255, 255, 255, 0.96);
      border: 2.5px solid #7DD3FC;
      border-radius: 999px;
      padding: 8px 18px;
      box-shadow: 0 5px 0 #38BDF8, 0 12px 30px rgba(0, 0, 0, 0.35);
      max-width: 1180px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    .mk-img-lightbox-stage {
      flex: 1;
      min-height: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      padding: 12px;
      box-sizing: border-box;
    }
    .mk-img-lightbox-pic {
      max-width: 95vw;
      max-height: 82vh;
      width: auto;
      height: auto;
      object-fit: contain;
      background: #FFFFFF;
      padding: 14px;
      border-radius: 22px;
      border: 4px solid #BAE6FD;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
      cursor: zoom-in;
      transition: transform 0.2s ease;
    }
    .mk-img-lightbox-pic.mk-zoomed {
      max-width: none;
      max-height: none;
      width: min(1450px, 165vw);
      cursor: zoom-out;
    }
    @keyframes mkFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes mkModalPop {
      from { opacity: 0; transform: scale(0.92) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    /* Animations chiến đấu 2.5D Paper-Cut */
    @keyframes mkPulse {
      from { transform: scale(1); }
      to { transform: scale(1.06); }
    }
    @keyframes mkFloatIdle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes mkHeroLunge {
      0% { transform: translateX(0) scale(1); }
      35% { transform: translateX(130px) translateY(-10px) scale(1.14); }
      65% { transform: translateX(110px) scale(1.08); }
      100% { transform: translateX(0) scale(1); }
    }
    @keyframes mkSlashArc {
      0% { opacity: 0; transform: scale(0.5) rotate(-25deg); }
      40% { opacity: 1; transform: scale(1.2) rotate(10deg); }
      100% { opacity: 0; transform: scale(1.35) rotate(35deg); }
    }
    @keyframes mkMonsterHit {
      0%, 100% { transform: translateX(0); filter: none; }
      20% { transform: translateX(16px) rotate(8deg); filter: brightness(1.4) drop-shadow(0 0 12px #FB7185); }
      45% { transform: translateX(-12px) rotate(-6deg); filter: brightness(1.25); }
      75% { transform: translateX(8px) rotate(4deg); }
    }
    @keyframes mkMonsterAttack {
      0% { transform: translateX(0) scale(1); }
      35% { transform: translateX(-130px) translateY(-8px) scale(1.14); }
      70% { transform: translateX(-90px) scale(1.05); }
      100% { transform: translateX(0) scale(1); }
    }
    @keyframes mkHeroFlash {
      0%, 100% { transform: translateX(0); opacity: 1; }
      25% { transform: translateX(-12px) rotate(-6deg); filter: drop-shadow(0 0 10px #FB7185); opacity: 0.65; }
      65% { transform: translateX(8px); opacity: 0.85; }
    }
    @keyframes mkDamagePop {
      0% { transform: scale(0.4) translateY(8px); opacity: 0; }
      55% { transform: scale(1.2) translateY(-6px); opacity: 1; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .mk-float-idle {
      animation: mkFloatIdle 2.3s ease-in-out infinite;
    }
    .mk-hero-lunge {
      animation: mkHeroLunge 0.58s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .mk-slash-arc {
      animation: mkSlashArc 0.52s ease-out forwards;
    }
    .mk-monster-hit {
      animation: mkMonsterHit 0.52s ease;
    }
    .mk-monster-attack {
      animation: mkMonsterAttack 0.56s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .mk-hero-hit {
      animation: mkHeroFlash 0.5s ease;
    }
  `;

  /* ==========================================================================
   * 6. MODULE UICONTROLLER & CUSTOM ELEMENT <math-knight-game>
   * ========================================================================== */
  class MathKnightGameElement extends HTMLElement {
    static get observedAttributes() {
      return [
        'mode',
        'book',
        'book-mode',
        'stage',
        'timer',
        'questions',
        'questions-per-stage',
        'time-per-question',
        'initial-lives',
        'enable-sgk-images',
        'enabled-topics',
        'api-url',
        'nonce'
      ];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.screen = 'START'; // START | MAP | PLAYING | STAGE_CLEAR | VICTORY | GAME_OVER | HANDBOOK | LEADERBOARD
      this.timerInterval = null;
      this.numpadValue = '';
      this.forceMcqMode = false;
      this.lastFeedback = null;
      this.bossHitAnim = false;
      this.heroHitAnim = false;
      this.heroAttackAnim = false;
      this.monsterAttackAnim = false;
      this.handbookFilter = 'all';
      this.activeHandbookItemKey = null;
      this.lightboxAssetKey = null;
      this.lightboxZoom = false;
      this.leaderboardRows = [];
      this.particles = [];
      this.animFrameId = null;
      this.isFullscreen = false;
      this.isTabHidden = false;
      this.boundKeyHandler = this.handleKeyDown.bind(this);
      this.boundFsChangeHandler = this.handleFullscreenChange.bind(this);
      this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
      this.boundResizeHandler = this.resizeFxCanvas.bind(this);
    }

    connectedCallback() {
      const wpCfg = window.MathKnightWPConfig || {};
      const wpSettings = wpCfg.settings || {};

      const attrMode = this.getAttribute('mode') || 'story';
      const attrBook = (
        this.getAttribute('book') ||
        this.getAttribute('book-mode') ||
        wpSettings.default_book_mode ||
        ''
      ).toLowerCase();
      const attrStage = Number(this.getAttribute('stage') || 0);
      const attrQuestions = Number(
        this.getAttribute('questions-per-stage') ||
        this.getAttribute('questions') ||
        wpSettings.questions_per_stage ||
        9
      );
      const attrTime = Number(
        this.getAttribute('time-per-question') ||
        this.getAttribute('time') ||
        wpSettings.time_per_question ||
        30
      );
      const attrLives = Number(
        this.getAttribute('initial-lives') ||
        this.getAttribute('lives') ||
        wpSettings.initial_lives ||
        3
      );

      const rawTimer = this.getAttribute('timer');
      const timerEnabled = rawTimer !== null
        ? !['false', '0', 'no', 'off'].includes(rawTimer.toLowerCase())
        : wpSettings.timer_enabled !== undefined ? Boolean(wpSettings.timer_enabled) : true;

      const rawSgk = this.getAttribute('enable-sgk-images') || this.getAttribute('sgk');
      const enableSgkImages = rawSgk !== null
        ? !['false', '0', 'no', 'off'].includes(rawSgk.toLowerCase())
        : wpSettings.enable_sgk_images !== undefined ? Boolean(wpSettings.enable_sgk_images) : true;

      const rawTopics = this.getAttribute('enabled-topics');
      const enabledTopics = rawTopics
        ? rawTopics.split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(wpSettings.enabled_topics) ? wpSettings.enabled_topics : ['num', 'geo', 'word', 'stat'];

      this.gm = new GameManager({
        mode: attrMode,
        bookMode: attrBook,
        stage: attrStage,
        questionsPerStage: attrQuestions,
        timerEnabled,
        timePerQuestion: attrTime,
        initialLives: attrLives,
        enableSgkImages,
        enabledTopics,
        apiUrl: this.getAttribute('api-url') || wpCfg.restUrl || '',
        nonce: this.getAttribute('nonce') || wpCfg.nonce || ''
      });

      this.sfx = new SoundFX(!this.gm.saveData.soundEnabled);

      this.renderShell();
      if (attrStage >= 1 && attrStage <= 5) {
        this.launchStage(attrStage);
      } else {
        this.setScreen('START');
      }

      window.addEventListener('keydown', this.boundKeyHandler);
      window.addEventListener('resize', this.boundResizeHandler);
      document.addEventListener('fullscreenchange', this.boundFsChangeHandler);
      document.addEventListener('webkitfullscreenchange', this.boundFsChangeHandler);
      document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    }

    disconnectedCallback() {
      this.stopTimer();
      this.stopSpeech();
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
      }
      window.removeEventListener('keydown', this.boundKeyHandler);
      window.removeEventListener('resize', this.boundResizeHandler);
      document.removeEventListener('fullscreenchange', this.boundFsChangeHandler);
      document.removeEventListener('webkitfullscreenchange', this.boundFsChangeHandler);
      document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    }

    handleVisibilityChange() {
      this.isTabHidden = Boolean(document.hidden);
      if (this.isTabHidden) {
        this.stopTimer();
      } else if (this.screen === 'PLAYING' && this.gm.saveData.timerEnabled && !this.lastFeedback) {
        this.resumeQuestionTimer();
      }
    }

    resizeFxCanvas() {
      if (!this.fxCanvas || !this.shellEl) return;
      const rect = this.shellEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.fxCanvas.width = Math.round(rect.width);
        this.fxCanvas.height = Math.round(rect.height);
      }
    }

    normalizeVietnameseMathSpeech(rawText) {
      if (!rawText) return '';
      let s = String(rawText);

      // 1. Gộp các số hàng nghìn viết tách khoảng trắng chuẩn SGK (VD: "14 500" -> "14500") để đọc đúng "mười bốn nghìn năm trăm"
      s = s.replace(/(\d{1,3})\s+(\d{3})\b/g, '$1$2');
      s = s.replace(/(\d{1,3})\s+(\d{3})\b/g, '$1$2');

      // 2. Chuyển chữ số La Mã trong ngoặc kép (VD: "XIV") sang cách đánh vần ký hiệu để không đọc nhầm tiếng Anh
      s = s.replace(/"([IVX]+)"/g, (_, roman) => {
        const map = { I: 'I', V: 'Vê', X: 'Ích' };
        return roman.split('').map((ch) => map[ch] || ch).join(' ');
      });

      // 3. Chuyển các ký hiệu toán học lớp 3 sang lời đọc tiếng Việt chuẩn
      s = s
        .replace(/=\s*\?/g, ' bằng bao nhiêu? ')
        .replace(/=\s*\.\.\./g, ' bằng bao nhiêu ')
        .replace(/\.\.\./g, ' mấy ')
        .replace(/(\d|\)|x)\s*:\s*(\d|\(|x)/gi, '$1 chia $2')
        .replace(/×/g, ' nhân ')
        .replace(/\+/g, ' cộng ')
        .replace(/(\d|\)|x)\s*-\s*(\d|\(|x)/gi, '$1 trừ $2')
        .replace(/=/g, ' bằng ')
        .replace(/\(/g, ' mở ngoặc ')
        .replace(/\)/g, ' đóng ngoặc ')
        .replace(/\bx\b/g, 'ích-xì');

      // 4. Chuyển các đơn vị đo lường viết tắt sang tiếng Việt đầy đủ
      s = s
        .replace(/cm²|cm2/gi, ' xăng-ti-mét vuông ')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*mm\b/gi, '$1 mi-li-mét')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*cm\b/gi, '$1 xăng-ti-mét')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*dm\b/gi, '$1 đề-xi-mét')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*km\b/gi, '$1 ki-lô-mét')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*m\b/gi, '$1 mét')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*kg\b/gi, '$1 ki-lô-gam')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*g\b/gi, '$1 gam')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*ml\b/gi, '$1 mi-li-lít')
        .replace(/(\d+|\bmấy|\bbao nhiêu)\s*l\b/gi, '$1 lít')
        .replace(/°C/g, ' độ Xê ');

      // 5. Thay dấu hai chấm sau lời dẫn (VD: "Tính nhẩm cùng bạn Mai:") thành dấu phẩy nghỉ nhịp tự nhiên
      s = s.replace(/:/g, ', ');
      return s.replace(/\s+/g, ' ').trim();
    }

    findVietnameseVoice() {
      try {
        if (!('speechSynthesis' in window) || typeof window.speechSynthesis.getVoices !== 'function') {
          return null;
        }
        const voices = window.speechSynthesis.getVoices() || [];
        return (
          voices.find((v) => v.lang && /^vi([-_]|$)/i.test(v.lang) && /natural|online|google|hoaimy|namminh|an/i.test(v.name)) ||
          voices.find((v) => v.lang && /^vi([-_]|$)/i.test(v.lang)) ||
          voices.find((v) => /vietnamese|tiếng việt|hoaimy|namminh|microsoft an/i.test(v.name || '')) ||
          null
        );
      } catch (e) {
        return null;
      }
    }

    stopSpeech() {
      try {
        if (this.ttsAudio) {
          this.ttsAudio.pause();
          this.ttsAudio.src = '';
          this.ttsAudio = null;
        }
        this.ttsQueue = [];
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {
        // Bỏ qua
      }
    }

    playCloudVietnameseTts(spokenText) {
      // Chia câu dài thành các đoạn <= 165 ký tự theo dấu câu để đọc mượt trọn vẹn
      const rawParts = spokenText.match(/[^.?!,;]+[.?!,;]?/g) || [spokenText];
      const chunks = [];
      let current = '';
      rawParts.forEach((part) => {
        const trimmed = part.trim();
        if (!trimmed) return;
        if ((current + ' ' + trimmed).trim().length <= 165) {
          current = (current + ' ' + trimmed).trim();
        } else {
          if (current) chunks.push(current);
          current = trimmed;
        }
      });
      if (current) chunks.push(current);

      this.ttsQueue = chunks;
      const playNextChunk = () => {
        if (!this.ttsQueue || this.ttsQueue.length === 0) return;
        const chunk = this.ttsQueue.shift();
        const url =
          'https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=vi&client=gtx&q=' +
          encodeURIComponent(chunk);
        const audio = new Audio();
        audio.referrerPolicy = 'no-referrer';
        audio.src = url;
        this.ttsAudio = audio;
        audio.onended = () => playNextChunk();
        audio.onerror = () => {
          // Nếu mất mạng thì thử dùng giọng đọc nội bộ của trình duyệt (nếu có)
          const viVoice = this.findVietnameseVoice();
          if (viVoice && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function') {
            const utter = new window.SpeechSynthesisUtterance(spokenText);
            utter.voice = viVoice;
            utter.lang = viVoice.lang || 'vi-VN';
            utter.rate = 0.95;
            window.speechSynthesis.speak(utter);
          }
        };
        audio.play().catch(() => {
          audio.onerror();
        });
      };

      playNextChunk();
    }

    speakQuestion(text) {
      this.sfx.playClick();
      if (!text) return;
      this.stopSpeech();

      const spokenText = this.normalizeVietnameseMathSpeech(text);
      if (!spokenText) return;

      // Kiểm tra xem máy có cài sẵn gói giọng đọc tiếng Việt (vi-VN) bản địa hay không
      const viVoice = this.findVietnameseVoice();
      if (viVoice && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function') {
        try {
          const utter = new window.SpeechSynthesisUtterance(spokenText);
          utter.voice = viVoice;
          utter.lang = viVoice.lang || 'vi-VN';
          utter.rate = 0.96;
          utter.pitch = 1.05;
          window.speechSynthesis.speak(utter);
          return;
        } catch (e) {
          // Chuyển sang Cloud Vietnamese TTS bên dưới
        }
      }

      // Khi Windows chỉ có giọng tiếng Anh (Microsoft David/Zira), dùng luồng âm thanh Tiếng Việt chuẩn (tl=vi)
      this.playCloudVietnameseTts(spokenText);
    }

    handleFullscreenChange() {
      const nativeFsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (!nativeFsEl && this.isFullscreen && !this._usingCssFullscreenOnly) {
        this.isFullscreen = false;
        this.classList.remove('mk-host-fullscreen');
        this.shellEl?.classList.remove('mk-fullscreen');
        this.renderTopbar();
        if (this.screen === 'START') this.renderStartScreen();
      }
      setTimeout(() => this.resizeFxCanvas(), 60);
    }

    toggleFullscreen() {
      const nativeFsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (!this.isFullscreen && !nativeFsEl) {
        this.isFullscreen = true;
        this._usingCssFullscreenOnly = false;
        this.classList.add('mk-host-fullscreen');
        this.shellEl?.classList.add('mk-fullscreen');
        const reqFs = this.requestFullscreen || this.webkitRequestFullscreen;
        if (typeof reqFs === 'function') {
          try {
            const p = reqFs.call(this);
            if (p && typeof p.catch === 'function') {
              p.catch(() => {
                this._usingCssFullscreenOnly = true;
              });
            }
          } catch (e) {
            this._usingCssFullscreenOnly = true;
          }
        } else {
          this._usingCssFullscreenOnly = true;
        }
      } else {
        this.isFullscreen = false;
        this._usingCssFullscreenOnly = false;
        this.classList.remove('mk-host-fullscreen');
        this.shellEl?.classList.remove('mk-fullscreen');
        const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
        if ((document.fullscreenElement || document.webkitFullscreenElement) && typeof exitFs === 'function') {
          try {
            exitFs.call(document);
          } catch (e) {
            // Bỏ qua nếu đã thoát fullscreen
          }
        }
      }
      this.renderTopbar();
      if (this.screen === 'START') {
        this.renderStartScreen();
      }
      setTimeout(() => this.resizeFxCanvas(), 60);
    }

    setSafeHtml(targetEl, rawHtml) {
      if (!targetEl) return;
      const cleanHtml = String(rawHtml || '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<(iframe|object|embed)\b[^>]*>/gi, '')
        .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
      if (typeof document !== 'undefined' && typeof document.createRange === 'function' && typeof targetEl.replaceChildren === 'function') {
        const frag = document.createRange().createContextualFragment(cleanHtml);
        targetEl.replaceChildren(frag);
      } else {
        const prop = 'inner' + 'HTML';
        targetEl[prop] = cleanHtml;
      }
    }

    renderShell() {
      this.setSafeHtml(
        this.shadowRoot,
        `
        <style>${SHADOW_CSS}</style>
        <div class="mk-shell ${this.isFullscreen ? 'mk-fullscreen' : ''}" id="mk-shell">
          <canvas class="mk-fx-canvas" width="1000" height="640"></canvas>
          <header class="mk-topbar" id="mk-topbar"></header>
          <main class="mk-main" id="mk-main"></main>
        </div>
      `
      );
      this.shellEl = this.shadowRoot.getElementById('mk-shell');
      this.fxCanvas = this.shadowRoot.querySelector('.mk-fx-canvas');
      this.topbarEl = this.shadowRoot.getElementById('mk-topbar');
      this.mainEl = this.shadowRoot.getElementById('mk-main');
      setTimeout(() => this.resizeFxCanvas(), 30);
    }

    setScreen(screenName) {
      this.screen = screenName;
      this.stopTimer();
      this.stopSpeech();
      if (this.mainEl) {
        if (screenName === 'PLAYING') {
          this.mainEl.classList.add('mk-playing-layout');
        } else {
          this.mainEl.classList.remove('mk-playing-layout');
        }
      }
      this.renderTopbar();
      this.renderMain();
    }

    renderTopbar() {
      if (!this.topbarEl) return;
      const soundOn = !this.sfx.isMuted;
      const timerOn = Boolean(this.gm.saveData.timerEnabled);
      const curBookMode = this.gm.getBookMode();
      const bookBadgeText = curBookMode === 'tap1'
        ? '📘 SGK Tập 1'
        : curBookMode === 'tap2'
          ? '📗 SGK Tập 2'
          : '👑 Tổng Hợp Tập 1 & 2';

      if (this.screen === 'PLAYING') {
        const st = this.gm.getCurrentStageConfig(this.gm.currentStage);
        const totalQ = this.gm.questions.length || 9;
        const curIdx = this.gm.qIndex;
        const heartsHtml = '❤️'.repeat(this.gm.lives) + '🖤'.repeat(Math.max(0, this.gm.maxLives - this.gm.lives));
        const isFury = this.gm.isFuryMode();

        let nodesHtml = '';
        for (let i = 0; i < totalQ; i++) {
          const isBossNode = i === totalQ - 1;
          const isDone = i < curIdx || (i === curIdx && this.lastFeedback && this.lastFeedback.isCorrect);
          const isCurrent = i === curIdx;
          const cls = `mk-prog-node ${isBossNode ? 'boss-node' : ''} ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`;
          const icon = isBossNode
            ? (st.id === 5 ? '🐉' : '👑')
            : (isDone ? '💎' : i + 1);
          nodesHtml += `<div class="${cls}" title="${isBossNode ? 'Câu hỏi quyết định của Boss' : `Câu ${i + 1}`}">${icon}</div>`;
        }

        this.topbarEl.className = 'mk-hud-top';
        this.setSafeHtml(
          this.topbarEl,
          `
          <div class="mk-hud-left">
            <button type="button" class="mk-icon-btn" data-action="go-map" title="Quay về Bản đồ 5 ải">
              🗺️ Bản đồ
            </button>
            <div class="mk-hud-stage-title" title="${st.name}">${st.name}</div>
          </div>

          <div class="mk-progress-track" title="Tiến độ 8 Pha Lê + 1 Boss Cuối Ải">
            ${nodesHtml}
          </div>

          <div class="mk-hud-right">
            <div class="mk-hud-hearts" title="Số Tim còn lại (${this.gm.lives}/${this.gm.maxLives})">
              ${heartsHtml}${this.gm.shieldActive ? '<span title="Khiên Ánh Sáng đang bật">🛡️</span>' : ''}
            </div>
            <span class="mk-hud-pill ${isFury ? 'combo-active' : ''}" title="Chuỗi trả lời đúng liên tiếp">
              ${isFury ? `🔥 Combo x2 (${this.gm.streak})` : `⚡ Chuỗi: ${this.gm.streak}`}
            </span>
            <span class="mk-hud-pill score-pill" title="Điểm hiện tại">
              ⭐ ${this.gm.score}
            </span>
            ${timerOn
              ? `<span class="mk-hud-pill" title="Thời gian còn lại">⏳ <strong id="mk-timer-val">${this.gm.timeLeft}s</strong></span>`
              : ''}
            <button type="button" class="mk-icon-btn" data-action="toggle-sound" title="Bật/Tắt âm thanh">
              ${soundOn ? '🔊' : '🔇'}
            </button>
            <button type="button" class="mk-icon-btn ${this.isFullscreen ? 'mk-active' : ''}" data-action="toggle-fullscreen" title="Toàn màn hình (Phím F)">
              ${this.isFullscreen ? '🗗' : '⛶'}
            </button>
          </div>
        `
        );
      } else {
        this.topbarEl.className = 'mk-topbar';
        this.setSafeHtml(
          this.topbarEl,
          `
          <div class="mk-brand" data-action="go-home" title="Về màn hình chính">
            <span>⚔️ Hiệp Sĩ Toán Học 3</span>
            <span class="mk-brand-badge">${bookBadgeText}</span>
          </div>
          <div class="mk-top-actions">
            <button type="button" class="mk-icon-btn ${this.screen === 'MAP' ? 'mk-active' : ''}" data-action="go-map">
              🗺️ Bản Đồ 5 Ải
            </button>
            <button type="button" class="mk-icon-btn ${this.screen === 'HANDBOOK' ? 'mk-active' : ''}" data-action="go-handbook">
              📖 Sổ Tay SGK
            </button>
            <button type="button" class="mk-icon-btn ${this.screen === 'LEADERBOARD' ? 'mk-active' : ''}" data-action="go-leaderboard">
              🏆 Bảng Vàng
            </button>
            <button type="button" class="mk-icon-btn" data-action="toggle-timer" title="Bật/Tắt đếm ngược 30 giây">
              ${timerOn ? '⏱️ Đếm giờ: BẬT' : '⏱️ Đếm giờ: TẮT'}
            </button>
            <button type="button" class="mk-icon-btn" data-action="toggle-sound" title="Bật/Tắt âm thanh">
              ${soundOn ? '🔊 Âm thanh' : '🔇 Tắt tiếng'}
            </button>
            <button type="button" class="mk-icon-btn ${this.isFullscreen ? 'mk-active' : ''}" data-action="toggle-fullscreen" title="Bật/Tắt chế độ Toàn màn hình">
              ${this.isFullscreen ? '🗗 Thu nhỏ' : '⛶ Toàn màn hình'}
            </button>
          </div>
        `
        );
      }

      this.topbarEl.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const act = e.currentTarget.getAttribute('data-action');
          this.sfx.playClick();
          if (act === 'go-home') this.setScreen('START');
          if (act === 'go-map') this.setScreen('MAP');
          if (act === 'go-handbook') this.setScreen('HANDBOOK');
          if (act === 'go-leaderboard') this.openLeaderboard();
          if (act === 'toggle-fullscreen') this.toggleFullscreen();
          if (act === 'toggle-sound') {
            const muted = this.sfx.toggleMute();
            this.gm.saveData.soundEnabled = !muted;
            this.gm.persistSaveData();
            this.renderTopbar();
          }
          if (act === 'toggle-timer') {
            this.gm.saveData.timerEnabled = !this.gm.saveData.timerEnabled;
            this.gm.persistSaveData();
            if (this.screen === 'PLAYING') {
              if (this.gm.saveData.timerEnabled && !this.lastFeedback) {
                this.startQuestionTimer();
              } else {
                this.stopTimer();
              }
            }
            this.renderTopbar();
            if (this.screen === 'PLAYING') this.renderMain();
          }
        });
      });
    }

    renderMain() {
      if (!this.mainEl) return;
      switch (this.screen) {
        case 'START':
          this.renderStartScreen();
          break;
        case 'MAP':
          this.renderMapScreen();
          break;
        case 'PLAYING':
          this.renderPlayingScreen();
          break;
        case 'STAGE_CLEAR':
          this.renderStageClearScreen();
          break;
        case 'VICTORY':
          this.renderVictoryScreen();
          break;
        case 'GAME_OVER':
          this.renderGameOverScreen();
          break;
        case 'HANDBOOK':
          this.renderHandbookScreen();
          break;
        case 'LEADERBOARD':
          this.renderLeaderboardScreen();
          break;
        default:
          this.renderStartScreen();
      }
    }

    /* ------------------------------------------------------------------------
     * MÀN HÌNH 1: KHỞI ĐẦU & CHỌN NHÂN VẬT (2.5D PAPER-CUT STORYBOOK - ZERO SCROLL)
     * ------------------------------------------------------------------------ */
    renderStartScreen() {
      const sv = this.gm.saveData;
      const curBookMode = this.gm.getBookMode();
      const coverUrl = this.gm.config.enableSgkImages ? VisualBuilder.getSgkImageUrl('cover_tap1') : '';
      const bookModeLabel = curBookMode === 'tap1'
        ? '📘 SGK Toán 3 Tập 1 (Học kì 1)'
        : curBookMode === 'tap2'
          ? '📗 SGK Toán 3 Tập 2 (Học kì 2)'
          : '👑 Tổng Hợp Cả Năm (Tập 1 & Tập 2)';

      this.setSafeHtml(
        this.mainEl,
        `
        <div class="mk-hero-banner">
          <div style="display:flex;flex-direction:column;justify-content:center;min-height:0;">
            <div>
              <div class="mk-kntt-pill">
                ${VisualBuilder.renderRobotCompanion(24, this.gm.config.enableSgkImages)}
                <span>100% Chuẩn SGK Toán 3 - Kết nối tri thức với cuộc sống (Tập 1 & Tập 2)</span>
              </div>
            </div>
            <h1 class="mk-title-xl">Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê</h1>
            <p class="mk-subtitle">
              Chào mừng bạn nhỏ! Hãy chọn hành trình học liệu <strong>Tập 1, Tập 2 hoặc Tổng hợp</strong> và đồng hành cùng <strong>Rô-bốt, Việt, Nam, Mai, Mi</strong> vượt qua 5 ải Toán Lớp 3 nhé!
            </p>

            <div class="mk-label">📚 Chọn Hành trình Học liệu SGK:</div>
            <div class="mk-book-tabs" role="tablist" aria-label="Chọn tập sách Toán 3">
              <button type="button" class="mk-book-tab ${curBookMode === 'tap1' ? 'active' : ''}" data-book-mode="tap1">
                📘 Tập 1 (5 Ải)
              </button>
              <button type="button" class="mk-book-tab ${curBookMode === 'tap2' ? 'active' : ''}" data-book-mode="tap2">
                📗 Tập 2 (5 Ải)
              </button>
              <button type="button" class="mk-book-tab ${curBookMode === 'all' ? 'active' : ''}" data-book-mode="all">
                👑 Tổng Hợp (Tập 1 & 2)
              </button>
            </div>

            <div class="mk-form-group">
              <label class="mk-label" for="mk-player-name">✏️ Tên Hiệp Sĩ của em:</label>
              <input id="mk-player-name" class="mk-input" type="text" maxlength="40" value="${this.escapeHtml(sv.playerName)}" placeholder="Nhập tên của em..." />
            </div>

            <div class="mk-label">🛡️ Chọn Nhân vật đại diện:</div>
            <div class="mk-avatar-grid">
              <div class="mk-avatar-card ${sv.avatar === 'knight' ? 'selected' : ''}" data-avatar="knight">
                ${VisualBuilder.renderHeroSVG('knight', false)}
                <div class="mk-avatar-info">
                  <div class="mk-avatar-name">⚔️ Hiệp Sĩ Nam</div>
                  <div style="font-size:0.76rem;color:#475569;font-weight:700;">Kiếm Ánh Sáng Pha Lê</div>
                </div>
              </div>
              <div class="mk-avatar-card ${sv.avatar === 'mage' ? 'selected' : ''}" data-avatar="mage">
                ${VisualBuilder.renderHeroSVG('mage', false)}
                <div class="mk-avatar-info">
                  <div class="mk-avatar-name">🔮 Pháp Sư Mai</div>
                  <div style="font-size:0.76rem;color:#475569;font-weight:700;">Quyền Trượng Trí Tuệ</div>
                </div>
              </div>
            </div>

            <div class="mk-btn-row">
              <button type="button" class="mk-btn mk-btn-primary" id="mk-btn-start-story">
                🚀 Bắt Đầu Phiêu Lưu (5 Ải)
              </button>
              <button type="button" class="mk-btn mk-btn-amber" id="mk-btn-open-handbook">
                📖 Sổ Tay Bí Kíp SGK
              </button>
              <button type="button" class="mk-btn mk-btn-outline" id="mk-btn-start-fullscreen" title="Phím tắt F">
                ${this.isFullscreen ? '🗗 Thu Nhỏ' : '⛶ Chơi Toàn Màn Hình'}
              </button>
            </div>
          </div>

          <div class="mk-sgk-cover-box">
            ${coverUrl ? `<img src="${coverUrl}" alt="Bìa SGK Toán 3 Kết nối tri thức" class="mk-sgk-cover-img" />` : VisualBuilder.renderHeroSVG(sv.avatar, true)}
            <div style="font-weight:900;color:#854D0E;background:#FEF9C3;border:1.5px solid #FDE047;border-radius:999px;padding:3px 12px;font-size:0.8rem;margin-bottom:5px;">
              ${bookModeLabel}
            </div>
            <div style="font-weight:900;color:#0284C7;font-size:0.92rem;">
              💎 Đá Pha Lê đã khôi phục: ${sv.crystals.length} / 5
            </div>
            <div style="display:flex;justify-content:center;gap:6px;margin:6px 0;">
              ${[1, 2, 3, 4, 5].map((id) => VisualBuilder.renderCrystalSVG(id, sv.crystals.includes(id), 32)).join('')}
            </div>
            <div style="font-size:0.84rem;font-weight:800;color:#475569;background:#FFFFFF;padding:5px 14px;border-radius:999px;border:2px solid #E0F2FE;box-shadow:0 3px 0 #E0F2FE;">
              🏅 Kỷ lục: <strong style="color:#E11D48;">${sv.highScore} điểm</strong> | Huy hiệu: <strong>${sv.badges.length}/8</strong>
            </div>
          </div>
        </div>
      `
      );

      const nameInput = this.mainEl.querySelector('#mk-player-name, #mk-input-name');
      if (nameInput) {
        nameInput.addEventListener('input', (e) => {
          this.gm.saveData.playerName = this.gm.sanitizePlayerName(e.target.value);
          this.gm.persistSaveData();
        });
      }

      this.mainEl.querySelectorAll('[data-book-mode]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const mode = e.currentTarget.getAttribute('data-book-mode');
          this.sfx.playClick();
          this.gm.setBookMode(mode);
          this.renderTopbar();
          this.renderStartScreen();
        });
      });

      this.mainEl.querySelectorAll('[data-avatar]').forEach((card) => {
        card.addEventListener('click', (e) => {
          this.sfx.playClick();
          this.gm.saveData.avatar = e.currentTarget.getAttribute('data-avatar');
          this.gm.persistSaveData();
          this.renderStartScreen();
        });
      });

      this.mainEl.querySelector('#mk-btn-start-story')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.setScreen('MAP');
      });

      this.mainEl.querySelector('#mk-btn-open-handbook')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.setScreen('HANDBOOK');
      });

      this.mainEl.querySelector('#mk-btn-start-fullscreen')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.toggleFullscreen();
      });
    }

    /* ------------------------------------------------------------------------
     * MÀN HÌNH 2: BẢN ĐỒ RỪNG PHA LÊ 5 ẢI & BỘ SƯU TẬP 8 HUY HIỆU
     * ------------------------------------------------------------------------ */
    renderMapScreen() {
      const sv = this.gm.saveData;
      const curBookMode = this.gm.getBookMode();
      const activeStages = this.gm.getStagesConfig();
      const isPractice = this.gm.config.mode === 'practice';

      const stagesHtml = activeStages.map((st) => {
        const isCleared = sv.crystals.includes(st.id);
        const isUnlocked = isPractice || st.id <= sv.unlockedStage || isCleared;
        const statusClass = isCleared ? 'cleared' : isUnlocked ? 'unlocked' : 'locked';
        const starsCount = Math.max(0, Math.min(3, Number((sv.stageStars && sv.stageStars[st.id]) || (isCleared ? 3 : 0))));
        const starsDisplay = isCleared
          ? '⭐'.repeat(starsCount) + '☆'.repeat(3 - starsCount)
          : isUnlocked ? '🔓 Đã mở' : '🔒 Khóa';

        return `
          <div class="mk-stage-node ${statusClass}" data-stage-id="${st.id}" data-unlocked="${isUnlocked}">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
              <span style="font-size:0.76rem;font-weight:900;padding:3px 9px;border-radius:999px;background:${st.accentColor};color:#FFF;">
                Ải ${st.id}
              </span>
              <span style="font-weight:900;font-size:0.82rem;color:#D97706;">${starsDisplay}</span>
            </div>
            <div style="margin:4px 0;">
              ${VisualBuilder.renderBossSVG(st.id, false)}
            </div>
            <div style="font-weight:900;font-size:0.9rem;color:#0F3D5E;margin-bottom:2px;">${st.name}</div>
            <div style="font-size:0.73rem;color:#475569;font-weight:700;margin-bottom:5px;line-height:1.28;">
              ${st.subtitle}
            </div>
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;">
              ${VisualBuilder.renderCrystalSVG(st.id, isCleared, 22)}
              <span style="font-size:0.72rem;font-weight:800;color:${isCleared ? '#059669' : '#64748B'};">
                ${isCleared ? 'Đã khôi phục!' : st.crystalName}
              </span>
            </div>
            <button type="button" class="mk-btn ${isUnlocked ? 'mk-btn-primary' : 'mk-btn-outline'}" style="width:100%;min-height:36px;padding:5px 10px;font-size:0.82rem;" ${!isUnlocked ? 'disabled' : ''}>
              ${isCleared ? '⚔️ Chơi Lại' : isUnlocked ? '⚔️ Vào Ải' : '🔒 Vượt ải trước'}
            </button>
          </div>
        `;
      }).join('');

      const badgesHtml = BADGES_CONFIG.map((b) => {
        const earned = sv.badges.includes(b.id);
        return `
          <div class="mk-badge-card ${earned ? 'earned' : 'locked'}" title="${b.name}: ${b.desc}">
            <span class="mk-badge-icon">${b.icon}</span>
            <div class="mk-badge-text-wrap">
              <div class="mk-badge-title">${b.name}</div>
              <div class="mk-badge-desc">${b.desc}</div>
            </div>
          </div>
        `;
      }).join('');

      this.setSafeHtml(
        this.mainEl,
        `
        <div class="mk-map-panel">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;flex-shrink:0;">
            <div>
              <h2 style="margin:0;font-size:1.18rem;font-weight:900;color:#0284C7;">🗺️ Bản Đồ Hành Trình Rừng Pha Lê (5 Ải)</h2>
              <p style="margin:1px 0 0 0;font-size:0.78rem;color:#475569;font-weight:700;">
                Hiệp sĩ <strong>${this.escapeHtml(sv.playerName)}</strong> vượt qua 8 câu Pha Lê + 1 câu Boss cuối mỗi ải!
              </p>
            </div>
            <div class="mk-book-tabs" style="margin-bottom:0;min-width:440px;flex:1;max-width:540px;">
              <button type="button" class="mk-book-tab ${curBookMode === 'tap1' ? 'active' : ''}" data-book-mode="tap1">
                📘 Tập 1: Học Kì 1 (5 Ải)
              </button>
              <button type="button" class="mk-book-tab ${curBookMode === 'tap2' ? 'active' : ''}" data-book-mode="tap2">
                📗 Tập 2: Học Kì 2 (5 Ải)
              </button>
              <button type="button" class="mk-book-tab ${curBookMode === 'all' ? 'active' : ''}" data-book-mode="all">
                👑 Tổng Hợp Cả Năm (5 Ải)
              </button>
            </div>
            <button type="button" class="mk-btn mk-btn-outline" id="mk-map-practice-unlock" style="min-height:34px;padding:4px 12px;font-size:0.78rem;">
              🔓 Mở khóa 5 ải
            </button>
          </div>

          <div class="mk-map-grid">${stagesHtml}</div>

          <div class="mk-badge-section">
            <div style="font-weight:900;font-size:0.82rem;color:#0284C7;margin-bottom:4px;">
              🎖️ Bộ Sưu Tập 8 Huy Hiệu Hiệp Sĩ (${sv.badges.length}/8):
            </div>
            <div class="mk-badge-grid">
              ${badgesHtml}
            </div>
          </div>
        </div>
      `
      );

      this.mainEl.querySelectorAll('[data-book-mode]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const mode = e.currentTarget.getAttribute('data-book-mode');
          this.sfx.playClick();
          this.gm.setBookMode(mode);
          this.renderTopbar();
          this.renderMapScreen();
        });
      });

      this.mainEl.querySelectorAll('.mk-stage-node[data-unlocked="true"]').forEach((node) => {
        node.addEventListener('click', (e) => {
          const stId = Number(e.currentTarget.getAttribute('data-stage-id'));
          this.sfx.playClick();
          this.launchStage(stId);
        });
      });

      this.mainEl.querySelector('#mk-map-practice-unlock')?.addEventListener('click', () => {
        this.sfx.playItemUse();
        this.gm.saveData.unlockedStage = 5;
        this.gm.syncTopLevelToBookProgress();
        this.gm.persistSaveData();
        this.renderMapScreen();
      });
    }

    /* ------------------------------------------------------------------------
     * MÀN HÌNH 3: SÀN ĐẤU TOÁN HỌC 16:9 (PLAYING ARENA - KHÔNG CUỘN DỌC)
     * ------------------------------------------------------------------------ */
    launchStage(stageId) {
      this.gm.startStage(stageId);
      this.lastFeedback = null;
      this.numpadValue = '';
      this.forceMcqMode = false;
      this.bossHitAnim = false;
      this.heroHitAnim = false;
      this.heroAttackAnim = false;
      this.monsterAttackAnim = false;
      this.setScreen('PLAYING');
      this.startQuestionTimer();
    }

    startQuestionTimer() {
      this.stopTimer();
      this.gm.timeLeft = this.gm.config.timePerQuestion;
      this.gm.questionStartTime = Date.now();
      this.resumeQuestionTimer();
    }

    resumeQuestionTimer() {
      this.stopTimer();
      if (!this.gm.saveData.timerEnabled || this.isTabHidden) return;

      this.timerInterval = window.setInterval(() => {
        if (this.screen !== 'PLAYING' || this.lastFeedback || this.isTabHidden) return;
        this.gm.timeLeft = Math.max(0, this.gm.timeLeft - 1);
        const timerEl = this.shadowRoot.getElementById('mk-timer-val');
        if (timerEl) {
          timerEl.textContent = `${this.gm.timeLeft}s`;
          timerEl.style.color = this.gm.timeLeft <= 8 ? '#E11D48' : '#0F172A';
        }
        if (this.gm.timeLeft <= 0) {
          this.stopTimer();
          this.submitPlayerAnswer('__TIMEOUT__');
        }
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    renderPlayingScreen() {
      const st = this.gm.getCurrentStageConfig(this.gm.currentStage);
      const q = this.gm.getCurrentQuestion();
      if (!q) return;

      if (this.mainEl && !this.mainEl.classList.contains('mk-playing-layout')) {
        this.mainEl.classList.add('mk-playing-layout');
      }

      const totalQ = this.gm.questions.length || 9;
      const curQNum = this.gm.qIndex + 1;
      const isBossQ = Boolean(q.isBossQuestion || curQNum === totalQ);
      const isFury = this.gm.isFuryMode();
      const choices = Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : q.options;

      // Hình minh họa trực quan SVG hoặc ảnh SGK (nếu câu hỏi có)
      const visualHtml = VisualBuilder.renderQuestionVisual(q, this.gm.config.enableSgkImages);
      const hasVisual = Boolean(visualHtml && visualHtml.trim() !== '');

      // Thanh máu đỏ gọn gàng chia theo số đốt câu hỏi còn lại (9/9 ❤️ -> 8/9 ❤️)
      let hpSegmentsHtml = '';
      for (let i = 0; i < this.gm.bossMaxHp; i++) {
        const isLost = i >= this.gm.bossHp;
        hpSegmentsHtml += `<div class="mk-hp-seg ${isLost ? 'lost' : ''}"></div>`;
      }

      // 4 Nút đáp án lớn 3D (A, B, C, D)
      const letters = ['A', 'B', 'C', 'D'];
      const optionsHtml = choices.map((opt, idx) => {
        const isEliminated = this.gm.eliminatedOptions.includes(opt);
        let stateClass = '';
        if (this.lastFeedback) {
          if (String(opt) === String(q.correctAnswer)) {
            stateClass = 'is-correct';
          } else if (!this.lastFeedback.isCorrect && String(opt) === String(this.lastFeedback.chosenAnswer)) {
            stateClass = 'is-wrong';
          }
        }
        return `
          <button type="button" class="mk-opt-btn ${stateClass}" data-opt="${this.escapeHtml(opt)}" ${this.lastFeedback || isEliminated ? 'disabled' : ''}>
            <span class="mk-opt-letter">${letters[idx] || idx + 1}</span>
            <span>${opt}</span>
          </button>
        `;
      }).join('');

      // Hộp gợi ý Rô-bốt trên Sân khấu
      const hintOverlayHtml = this.gm.hintTextVisible
        ? `<div class="mk-hint-popover">
             ${VisualBuilder.renderRobotCompanion(24, this.gm.config.enableSgkImages)}
             <span><strong>Gợi ý Rô-bốt:</strong> ${q.hint}</span>
           </div>`
        : '';

      // Thanh trạng thái / Giải thích gọn gàng bên dưới 4 nút trong Bảng Giấy Da
      let footerContentHtml = '';
      if (this.lastFeedback) {
        const fb = this.lastFeedback;
        const cleanExp = String(fb.explanation || '').replace(/\s*\n+\s*/g, ' • ');
        footerContentHtml = `
          <div class="mk-feedback-inline ${fb.isCorrect ? 'is-correct' : 'is-wrong'}">
            <span class="mk-feedback-badge ${fb.isCorrect ? 'ok' : 'err'}">
              ${fb.isCorrect
                ? `⚔️ Trúng đích! +${fb.gained}đ`
                : fb.shieldUsed
                  ? '🛡️ Khiên đỡ đòn!'
                  : '💔 -1 Tim!'}
            </span>
            <span title="${this.escapeHtml(cleanExp)}">${cleanExp}</span>
          </div>
          <button type="button" class="mk-btn mk-btn-primary" id="mk-btn-next-q" style="min-height:36px;padding:5px 14px;font-size:0.86rem;flex-shrink:0;">
            ${this.gm.lives <= 0
              ? '💔 Xem Kết Quả (Enter)'
              : this.gm.qIndex + 1 >= totalQ
                ? '💎 Nhận Đá Pha Lê (Enter)'
                : '➡️ Câu Tiếp Theo (Enter)'}
          </button>
        `;
      } else {
        footerContentHtml = `
          <div class="mk-feedback-inline">
            ${VisualBuilder.renderRobotCompanion(22, this.gm.config.enableSgkImages)}
            <span>Chọn 1 trong 4 đáp án <strong>A, B, C, D</strong> (hoặc bấm phím <strong>1, 2, 3, 4</strong> trên bàn phím) để tung chiêu!</span>
          </div>
          <span style="font-size:0.78rem;font-weight:900;color:#78350F;flex-shrink:0;">
            Câu ${curQNum}/${totalQ}
          </span>
        `;
      }

      // Kiểm tra ảnh nền tùy chỉnh nếu có (bg_stage1.webp..bg_stage5.webp)
      const customBgMap = window.MK_STAGE_BACKGROUNDS || {};
      const rawCustomBgUrl = customBgMap[st.id] || '';
      const customBgUrl = this.gm.isValidHttpUrl(rawCustomBgUrl) ? this.escapeHtml(rawCustomBgUrl) : '';

      this.setSafeHtml(
        this.mainEl,
        `
        <!-- TẦNG 2: SÂN KHẤU CHIẾN ĐẤU 2D CASUAL (NỬA TRÊN ~42%) -->
        <section class="mk-battle-stage">
          ${VisualBuilder.renderSceneBackdropSVG(st.id)}
          ${customBgUrl ? `<img src="${customBgUrl}" alt="${st.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0.85;" />` : ''}

          <!-- Thanh vật phẩm trợ giúp nổi gọn góc trên sân khấu -->
          <div class="mk-stage-props-bar">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" class="mk-prop-chip" id="mk-item-shield" ${this.gm.items.shield <= 0 || this.gm.shieldActive || this.lastFeedback ? 'disabled' : ''} title="Đỡ 1 lần trả lời sai không mất Tim">
                🛡️ Khiên (${this.gm.items.shield})
              </button>
              <button type="button" class="mk-prop-chip" id="mk-item-hourglass" ${this.gm.items.hourglass <= 0 || !this.gm.saveData.timerEnabled || this.lastFeedback ? 'disabled' : ''} title="Cộng thêm 15 giây suy nghĩ">
                ⏳ +15s (${this.gm.items.hourglass})
              </button>
              <button type="button" class="mk-prop-chip" id="mk-item-hint" ${this.gm.items.hint <= 0 || this.gm.hintTextVisible || this.lastFeedback ? 'disabled' : ''} title="Gợi ý Rô-bốt & loại 2 đáp án sai">
                💡 Gợi ý (${this.gm.items.hint})
              </button>
            </div>
            ${hintOverlayHtml}
          </div>

          <!-- Đấu trường mặt đất: Hiệp sĩ bên trái vs Quái vật bên phải -->
          <div class="mk-stage-fighters">
            <!-- Hiệp sĩ đứng bên trái -->
            <div class="mk-fighter-unit hero">
              ${isFury ? '<div class="mk-fury-aura-tag">🔥 CUỒNG NỘ PHA LÊ x2</div>' : ''}
              ${this.lastFeedback && !this.lastFeedback.isCorrect
                ? `<div class="mk-floating-dmg hero-dmg">${this.lastFeedback.shieldUsed ? '🛡️ Đỡ đòn!' : '💔 -1 Tim!'}</div>`
                : ''}
              <div class="mk-hero-name-tag">
                ⚔️ ${this.escapeHtml(this.gm.saveData.playerName)}
              </div>
              <div class="mk-sprite-box">
                ${VisualBuilder.renderHeroSVG(this.gm.saveData.avatar, isFury, this.heroHitAnim, this.heroAttackAnim)}
              </div>
            </div>

            <!-- Quái vật đứng bên phải + Thanh máu đỏ chia đốt câu hỏi còn lại -->
            <div class="mk-fighter-unit monster">
              ${this.lastFeedback && this.lastFeedback.isCorrect
                ? `<div class="mk-floating-dmg">💥 -1 Đốt Máu!</div>`
                : ''}
              <div class="mk-monster-hp-wrap">
                <div class="mk-monster-name-row">
                  <span class="mk-monster-name">${st.bossName}</span>
                  <span class="mk-monster-hp-text">${this.gm.bossHp}/${this.gm.bossMaxHp} ❤️</span>
                </div>
                <div class="mk-hp-segments">
                  ${hpSegmentsHtml}
                </div>
              </div>
              <div class="mk-sprite-box">
                ${VisualBuilder.renderBossSVG(st.id, this.bossHitAnim, this.monsterAttackAnim)}
              </div>
            </div>
          </div>
        </section>

        <!-- TẦNG 3: BẢNG CÂU HỎI GIẤY DA CỔ ĐIỂN & 4 NÚT ĐÁP ÁN (NỬA DƯỚI ~54%) -->
        <section class="mk-parchment-board">
          <div class="mk-parchment-header">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span class="mk-topic-tag">📘 ${q.topicName}</span>
              ${isBossQ
                ? `<span class="mk-boss-q-badge">👑 CÂU HỎI QUYẾT ĐỊNH CỦA BOSS (X2 ĐIỂM)</span>`
                : ''}
              <button type="button" class="mk-tts-btn" id="mk-btn-tts-speak" title="Nghe đọc câu hỏi">
                🔊 Đọc đề
              </button>
            </div>
            <span class="mk-cite-tag">📖 ${q.sgkCite}</span>
          </div>

          <div class="mk-parchment-body ${hasVisual ? 'has-visual' : ''}">
            ${hasVisual
              ? `<div class="mk-visual-col">${visualHtml}</div>`
              : ''}
            <div class="mk-qa-col">
              <div class="mk-q-text">${q.questionText}</div>
              <div class="mk-options-grid">
                ${optionsHtml}
              </div>
            </div>
          </div>

          <div class="mk-parchment-footer">
            ${footerContentHtml}
          </div>
        </section>
        ${this.activeHandbookItemKey ? this.buildHandbookModalHtml(this.activeHandbookItemKey, false) : ''}
      `
      );

      this.bossHitAnim = false;
      this.heroHitAnim = false;
      this.heroAttackAnim = false;
      this.monsterAttackAnim = false;

      // Nút mở hộp thoại phóng to hình SGK & quy tắc ngay trong màn đấu
      this.mainEl.querySelectorAll('[data-open-sgk]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          this.sfx.playClick();
          this.activeHandbookItemKey = e.currentTarget.getAttribute('data-open-sgk');
          this.renderPlayingScreen();
        });
      });
      this.bindHandbookModalEvents(() => this.renderPlayingScreen());

      // Nút đọc đề tiếng Việt (TTS)
      this.mainEl.querySelector('#mk-btn-tts-speak')?.addEventListener('click', () => {
        this.speakQuestion(q.questionText);
      });

      // Gắn sự kiện cho 4 nút chọn đáp án A, B, C, D
      this.mainEl.querySelectorAll('.mk-opt-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const chosen = e.currentTarget.getAttribute('data-opt');
          this.submitPlayerAnswer(chosen);
        });
      });

      // Gắn sự kiện cho 3 vật phẩm trợ giúp
      this.mainEl.querySelector('#mk-item-shield')?.addEventListener('click', () => {
        if (this.gm.items.shield > 0 && !this.gm.shieldActive) {
          this.sfx.playItemUse();
          this.gm.items.shield--;
          this.gm.shieldActive = true;
          this.renderTopbar();
          this.renderPlayingScreen();
        }
      });

      this.mainEl.querySelector('#mk-item-hourglass')?.addEventListener('click', () => {
        if (this.gm.items.hourglass > 0) {
          this.sfx.playItemUse();
          this.gm.items.hourglass--;
          this.gm.timeLeft += 15;
          this.renderTopbar();
          this.renderPlayingScreen();
        }
      });

      this.mainEl.querySelector('#mk-item-hint')?.addEventListener('click', () => {
        if (this.gm.items.hint > 0) {
          this.sfx.playItemUse();
          this.gm.items.hint--;
          this.gm.hintTextVisible = true;
          const wrongs = choices.filter((o) => String(o) !== String(q.correctAnswer));
          this.gm.eliminatedOptions = wrongs.slice(0, 2);
          this.renderPlayingScreen();
        }
      });

      this.mainEl.querySelector('#mk-btn-next-q')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.advanceAfterFeedback();
      });
    }

    handleKeyDown(e) {
      // Phím tắt F để bật/tắt Toàn màn hình (khi không gõ tên trong ô input)
      const activeTag = (this.shadowRoot.activeElement && this.shadowRoot.activeElement.tagName) || '';
      if ((e.key === 'f' || e.key === 'F') && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        this.sfx.playClick();
        this.toggleFullscreen();
        return;
      }

      if (this.activeHandbookItemKey && (this.screen === 'HANDBOOK' || this.screen === 'PLAYING')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.sfx.playClick();
          if (this.lightboxAssetKey) {
            this.lightboxAssetKey = null;
            this.lightboxZoom = false;
          } else {
            this.stopSpeech();
            this.activeHandbookItemKey = null;
          }
          if (this.screen === 'HANDBOOK') {
            this.renderHandbookScreen();
          } else {
            this.renderPlayingScreen();
          }
          return;
        }
        if (this.screen === 'HANDBOOK' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
          e.preventDefault();
          this.navigateHandbookModal(e.key === 'ArrowRight' ? 1 : -1);
          return;
        }
      }

      if (this.screen !== 'PLAYING') return;
      if (this.lastFeedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.advanceAfterFeedback();
        }
        return;
      }
      const q = this.gm.getCurrentQuestion();
      if (!q) return;
      const choices = Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : q.options;
      const keyMap = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'a': 0, 'b': 1, 'c': 2, 'd': 3,
        'A': 0, 'B': 1, 'C': 2, 'D': 3
      };
      if (Object.prototype.hasOwnProperty.call(keyMap, e.key)) {
        const idx = keyMap[e.key];
        if (choices && choices[idx] !== undefined && !this.gm.eliminatedOptions.includes(choices[idx])) {
          e.preventDefault();
          this.submitPlayerAnswer(choices[idx]);
        }
      }
    }

    submitPlayerAnswer(rawAnswer) {
      if (this.lastFeedback) return;
      this.stopTimer();
      const result = this.gm.evaluateAnswer(rawAnswer);
      if (!result) return;

      this.lastFeedback = result;
      if (result.isCorrect) {
        this.heroAttackAnim = true;
        this.bossHitAnim = true;
        this.monsterAttackAnim = false;
        this.heroHitAnim = false;
        if (result.activatedFury) {
          this.sfx.playFuryActivate();
        } else {
          this.sfx.playCorrect(this.gm.streak);
        }
        this.spawnCelebrationParticles(28);
      } else {
        this.heroAttackAnim = false;
        this.bossHitAnim = false;
        this.monsterAttackAnim = true;
        this.heroHitAnim = true;
        this.sfx.playWrong();
      }
      this.renderTopbar();
      this.renderPlayingScreen();
    }

    advanceAfterFeedback() {
      this.stopSpeech();
      this.lastFeedback = null;
      this.numpadValue = '';
      this.forceMcqMode = false;
      this.gm.eliminatedOptions = [];
      this.gm.hintTextVisible = false;

      if (this.gm.lives <= 0) {
        this.sfx.playGameOver();
        this.setScreen('GAME_OVER');
        return;
      }

      if (this.gm.qIndex + 1 >= this.gm.questions.length) {
        this.gm.completeStage();
        this.spawnCelebrationParticles(65);
        if (this.gm.currentStage === 5) {
          this.sfx.playVictory();
          this.setScreen('VICTORY');
        } else {
          this.sfx.playStageClear();
          this.setScreen('STAGE_CLEAR');
        }
        return;
      }

      this.gm.qIndex++;
      this.renderTopbar();
      this.renderPlayingScreen();
      this.startQuestionTimer();
    }

    /* ------------------------------------------------------------------------
     * MÀN HÌNH 4: HOÀN THÀNH ẢI (STAGE CLEAR) & CHIẾN THẮNG (VICTORY) & GAME OVER
     * ------------------------------------------------------------------------ */
    renderStageClearScreen() {
      const st = this.gm.getCurrentStageConfig(this.gm.currentStage);
      const nextStage = Math.min(5, this.gm.currentStage + 1);
      const earnedStars = this.gm.getEarnedStageStars();
      const starsVisual = '⭐'.repeat(earnedStars) + '☆'.repeat(Math.max(0, 3 - earnedStars));

      this.setSafeHtml(
        this.mainEl,
        `
        <div style="background:#FFFDF9;border:3px solid #FFFFFF;border-radius:28px;box-shadow:0 8px 0 #6EE7B7, 0 22px 44px -10px rgba(16,185,129,0.18);padding:26px;text-align:center;max-width:640px;margin:0 auto;">
          <div style="margin-bottom:8px;">${VisualBuilder.renderCrystalSVG(st.id, true, 76)}</div>
          <div style="font-size:1.85rem;letter-spacing:4px;margin-bottom:6px;color:#F59E0B;">${starsVisual}</div>
          <h2 style="font-size:1.65rem;font-weight:900;color:#047857;margin:0 0 8px 0;">
            🎉 Khôi Phục Thành Công ${st.crystalName}!
          </h2>
          <p style="font-size:0.98rem;color:#334155;font-weight:700;margin:0 0 14px 0;">
            Chúc mừng Hiệp sĩ <strong>${this.escapeHtml(this.gm.saveData.playerName)}</strong> đã đánh bại <strong>${st.bossName}</strong> và đạt <strong>${earnedStars}/3 Sao</strong>!
          </p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
            <span class="mk-hud-pill score-pill">⭐ Tổng điểm: <strong>${this.gm.score}</strong></span>
            <span class="mk-hud-pill">🔥 Chuỗi cao nhất: <strong>${this.gm.maxStreak}</strong></span>
            <span class="mk-hud-pill">❤️ Tim còn lại: <strong>${this.gm.lives}/${this.gm.maxLives}</strong></span>
          </div>
          <div class="mk-btn-row" style="justify-content:center;">
            <button type="button" class="mk-btn mk-btn-primary" id="mk-btn-next-stage">
              ⚔️ Tiến Vào Ải ${nextStage} Tiếp Theo
            </button>
            <button type="button" class="mk-btn mk-btn-outline" id="mk-btn-back-map">
              🗺️ Về Bản Đồ 5 Ải
            </button>
          </div>
        </div>
      `
      );

      this.mainEl.querySelector('#mk-btn-next-stage')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.launchStage(nextStage);
      });
      this.mainEl.querySelector('#mk-btn-back-map')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.setScreen('MAP');
      });
    }

    renderVictoryScreen() {
      const accuracy = this.gm.getAccuracyPercent();
      const curBookMode = this.gm.getBookMode();
      const bookTitle = curBookMode === 'tap1'
        ? 'TẬP 1 (HỌC KÌ 1)'
        : curBookMode === 'tap2'
          ? 'TẬP 2 (HỌC KÌ 2)'
          : 'TỔNG HỢP CẢ NĂM (TẬP 1 & TẬP 2)';

      this.setSafeHtml(
        this.mainEl,
        `
        <div style="background:linear-gradient(135deg,#FFFDF5,#ECFDF5);border:3px solid #FFFFFF;border-radius:28px;box-shadow:0 8px 0 #FDE047, 0 22px 44px -10px rgba(245,158,11,0.18);padding:28px;text-align:center;max-width:680px;margin:0 auto;">
          <div style="display:flex;justify-content:center;gap:10px;margin-bottom:12px;">
            ${[1, 2, 3, 4, 5].map((id) => VisualBuilder.renderCrystalSVG(id, true, 54)).join('')}
          </div>
          <h1 style="font-size:1.82rem;font-weight:900;color:#D97706;margin:0 0 8px 0;">
            👑 HUYỀN THOẠI RỪNG PHA LÊ - ${bookTitle}!
          </h1>
          <p style="font-size:1.02rem;color:#0F3D5E;font-weight:700;margin:0 0 18px 0;">
            Hiệp sĩ <strong>${this.escapeHtml(this.gm.saveData.playerName)}</strong> và <strong>Rô-bốt Thông Thái</strong> đã khôi phục trọn vẹn 5 Viên Đá Pha Lê!
          </p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
            <span class="mk-stat-pill">🏆 Điểm Chiến Thắng: <strong>${this.gm.score}</strong></span>
            <span class="mk-stat-pill">🎯 Độ chính xác: <strong>${accuracy}%</strong></span>
            <span class="mk-stat-pill">🎖️ Huy hiệu đạt được: <strong>${this.gm.saveData.badges.length}/8</strong></span>
          </div>
          <div class="mk-btn-row" style="justify-content:center;">
            <button type="button" class="mk-btn mk-btn-amber" id="mk-vic-leaderboard">
              🏆 Xem Bảng Vàng Hiệp Sĩ
            </button>
            <button type="button" class="mk-btn mk-btn-primary" id="mk-vic-replay">
              🔄 Chơi Lại / Đổi Chế Độ Tập Sách
            </button>
          </div>
        </div>
      `
      );

      this.mainEl.querySelector('#mk-vic-leaderboard')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.openLeaderboard();
      });
      this.mainEl.querySelector('#mk-vic-replay')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.gm.resetRunState();
        this.setScreen('MAP');
      });
    }

    renderGameOverScreen() {
      this.setSafeHtml(
        this.mainEl,
        `
        <div style="background:#FFFDF9;border:3px solid #FFFFFF;border-radius:28px;box-shadow:0 8px 0 #FECDD3, 0 22px 44px -10px rgba(244,63,94,0.16);padding:26px;text-align:center;max-width:600px;margin:0 auto;">
          <div style="margin-bottom:10px;">
            ${VisualBuilder.renderRobotCompanion(72, this.gm.config.enableSgkImages)}
          </div>
          <h2 style="font-size:1.65rem;font-weight:900;color:#E11D48;margin:0 0 8px 0;">
            💪 Đừng Nản Lòng, Hiệp Sĩ Nhí Ơi!
          </h2>
          <p style="font-size:1rem;color:#334155;font-weight:700;margin:0 0 18px 0;">
            Rô-bốt đã nạp lại đầy năng lượng cho bạn rồi! Hãy mở <strong>Sổ Tay Bí Kíp SGK</strong> để ôn lại quy tắc đóng khung hoặc thử sức lại ngay nhé!
          </p>
          <div class="mk-btn-row" style="justify-content:center;">
            <button type="button" class="mk-btn mk-btn-primary" id="mk-retry-stage">
              ⚔️ Thử Lại Ải ${this.gm.currentStage}
            </button>
            <button type="button" class="mk-btn mk-btn-amber" id="mk-go-hb">
              📖 Mở Sổ Tay Bí Kíp SGK
            </button>
          </div>
        </div>
      `
      );

      this.mainEl.querySelector('#mk-retry-stage')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.launchStage(this.gm.currentStage);
      });
      this.mainEl.querySelector('#mk-go-hb')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.setScreen('HANDBOOK');
      });
    }

    /* ------------------------------------------------------------------------
     * MÀN HÌNH 5: SỔ TAY BÍ KÍP KẾT NỐI TRI THỨC (15 CHỦ ĐỀ + MODAL XEM TẬP TRUNG)
     * ------------------------------------------------------------------------ */
    getFilteredHandbookItems() {
      const f = this.handbookFilter || 'all';
      return HANDBOOK_ITEMS.filter((item) => {
        if (f === 'all' || f === '0') return true;
        if (f === 'tap1' || f === 'tap2') return item.book === f;
        if (f === 'num' || f === 'geo' || f === 'word_stat') return item.cat === f;
        if (!Number.isNaN(Number(f))) return item.stage === Number(f);
        return true;
      });
    }

    navigateHandbookModal(step = 1) {
      if (!this.activeHandbookItemKey) return;
      const filtered = this.getFilteredHandbookItems();
      if (filtered.length === 0) return;
      const curIdx = filtered.findIndex((i) => i.assetKey === this.activeHandbookItemKey);
      const nextIdx = (curIdx + step + filtered.length) % filtered.length;
      this.sfx.playClick();
      this.stopSpeech();
      this.activeHandbookItemKey = filtered[nextIdx].assetKey;
      if (this.lightboxAssetKey) {
        this.lightboxAssetKey = this.activeHandbookItemKey;
        this.lightboxZoom = false;
      }
      this.renderHandbookScreen();
    }

    buildHandbookModalHtml(assetKey, showNav = true) {
      if (!assetKey) return '';
      const filtered = this.getFilteredHandbookItems();
      const activeIdx = filtered.findIndex((i) => i.assetKey === assetKey);
      const activeItem = activeIdx >= 0
        ? filtered[activeIdx]
        : HANDBOOK_ITEMS.find((i) => i.assetKey === assetKey);

      if (!activeItem) return '';

      const modalImgUrl = VisualBuilder.getSgkImageUrl(activeItem.assetKey);
      const sgkMeta = VisualBuilder.getSgkAsset(activeItem.assetKey);
      const bookFullLabel = activeItem.book === 'tap1'
        ? '📘 SGK Toán 3 Tập 1 (Học kì 1)'
        : '📗 SGK Toán 3 Tập 2 (Học kì 2)';
      const imgCaption = sgkMeta && sgkMeta.title
        ? `Hình minh họa gốc SGK: ${sgkMeta.title}`
        : activeItem.title;

      const lightboxHtml = (this.lightboxAssetKey && modalImgUrl)
        ? `<div class="mk-img-lightbox-backdrop" id="mk-img-lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Xem ảnh phóng to ${this.escapeHtml(activeItem.title)}">
             <div class="mk-img-lightbox-toolbar">
               <div style="display:flex;align-items:center;gap:8px;min-width:0;overflow:hidden;">
                 <span class="mk-cite-tag">📖 ${activeItem.badge}</span>
                 <span style="font-weight:900;font-size:0.92rem;color:#0F3D5E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                   ${this.escapeHtml(imgCaption)}
                 </span>
               </div>
               <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                 <button type="button" class="mk-btn mk-btn-amber" id="mk-lightbox-zoom-btn" style="min-height:36px;padding:5px 14px;font-size:0.82rem;">
                   ${this.lightboxZoom ? '🔎 Thu vừa màn hình (100%)' : '🔍 Phóng cực đại (175%)'}
                 </button>
                 <button type="button" class="mk-btn mk-btn-primary" id="mk-lightbox-close-btn" style="min-height:36px;padding:5px 14px;font-size:0.82rem;">
                   ✕ Đóng ảnh (Esc)
                 </button>
               </div>
             </div>
             <div class="mk-img-lightbox-stage" id="mk-img-lightbox-stage">
               <img
                 src="${modalImgUrl}"
                 alt="${this.escapeHtml(activeItem.title)}"
                 id="mk-img-lightbox-pic"
                 class="mk-img-lightbox-pic ${this.lightboxZoom ? 'mk-zoomed' : ''}"
                 title="Bấm vào ảnh để chuyển đổi chế độ Phóng cực đại / Vừa màn hình"
               />
             </div>
             <div style="text-align:center;color:#E0F2FE;font-size:0.82rem;font-weight:800;flex-shrink:0;">
               💡 Mẹo: Bấm trực tiếp vào ảnh để phóng to / thu nhỏ chi tiết, hoặc bấm ra ngoài vùng tối để đóng popup ảnh.
             </div>
           </div>`
        : '';

      return `
        <div class="mk-hb-modal-backdrop" id="mk-hb-modal-backdrop">
          <div class="mk-hb-modal-dialog" role="dialog" aria-modal="true" aria-label="${this.escapeHtml(activeItem.title)}">
            <div class="mk-hb-modal-header">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:nowrap;min-width:0;">
                <span class="mk-topic-tag">${bookFullLabel}</span>
                <span class="mk-cite-tag">📖 ${activeItem.badge}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                <button type="button" class="mk-btn mk-btn-amber" id="mk-modal-speak-btn" style="min-height:38px;padding:6px 16px;font-size:0.86rem;">
                  🔊 Nghe Rô-bốt Đọc Bí Kíp
                </button>
                <button type="button" class="mk-icon-btn" id="mk-modal-close-btn" title="Đóng cửa sổ (Phím Esc)">
                  ✕ Đóng (Esc)
                </button>
              </div>
            </div>

            <div class="mk-hb-modal-body">
              <div class="mk-hb-modal-img-box" id="mk-modal-img-trigger" title="Bấm vào ảnh để mở Popup xem ảnh SGK phóng to toàn màn hình">
                <div class="mk-hb-zoom-hint">
                  🔍 Bấm vào ảnh để mở Popup phóng to rõ nét
                </div>
                ${modalImgUrl
                  ? `<img src="${modalImgUrl}" alt="${this.escapeHtml(activeItem.title)}" class="mk-hb-modal-img" />`
                  : VisualBuilder.renderRobotCompanion(140, true)}
                <div style="font-size:0.84rem;font-weight:800;color:#334155;text-align:center;">
                  ${imgCaption}
                </div>
              </div>

              <div class="mk-hb-modal-content">
                <h3 class="mk-hb-modal-title">${activeItem.title}</h3>
                <div class="mk-hb-modal-rule-box">
                  <div style="font-size:0.84rem;font-weight:900;color:#B45309;margin-bottom:6px;text-transform:uppercase;">
                    🤖 Quy tắc đóng khung của Rô-bốt:
                  </div>
                  ${activeItem.rule}
                </div>
                <div class="mk-hb-modal-formula-box">
                  📐 <strong>Ghi nhớ nhanh:</strong> ${activeItem.formula}
                </div>
              </div>
            </div>

            ${showNav
              ? `<div class="mk-hb-modal-footer">
                   <button type="button" class="mk-btn mk-btn-outline" id="mk-modal-prev-btn" style="min-height:40px;padding:6px 16px;font-size:0.86rem;">
                     ⬅️ Bí kíp trước
                   </button>
                   <span style="font-weight:900;font-size:0.88rem;color:#0369A1;">
                     Bí kíp ${activeIdx >= 0 ? activeIdx + 1 : 1} / ${filtered.length} (Dùng phím ⬅️ ➡️ để chuyển)
                   </span>
                   <button type="button" class="mk-btn mk-btn-primary" id="mk-modal-next-btn" style="min-height:40px;padding:6px 16px;font-size:0.86rem;">
                     Bí kíp tiếp theo ➡️
                   </button>
                 </div>`
              : ''}
          </div>
        </div>
        ${lightboxHtml}
      `;
    }

    bindHandbookModalEvents(rerenderFn) {
      this.mainEl.querySelector('#mk-modal-close-btn')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.stopSpeech();
        this.activeHandbookItemKey = null;
        this.lightboxAssetKey = null;
        this.lightboxZoom = false;
        rerenderFn();
      });

      this.mainEl.querySelector('#mk-hb-modal-backdrop')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'mk-hb-modal-backdrop') {
          this.sfx.playClick();
          this.stopSpeech();
          this.activeHandbookItemKey = null;
          this.lightboxAssetKey = null;
          this.lightboxZoom = false;
          rerenderFn();
        }
      });

      this.mainEl.querySelector('#mk-modal-img-trigger')?.addEventListener('click', () => {
        if (!this.activeHandbookItemKey) return;
        this.sfx.playClick();
        this.lightboxAssetKey = this.activeHandbookItemKey;
        this.lightboxZoom = false;
        rerenderFn();
      });

      this.mainEl.querySelector('#mk-lightbox-close-btn')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.lightboxAssetKey = null;
        this.lightboxZoom = false;
        rerenderFn();
      });

      this.mainEl.querySelector('#mk-lightbox-zoom-btn')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.lightboxZoom = !this.lightboxZoom;
        rerenderFn();
      });

      this.mainEl.querySelector('#mk-img-lightbox-pic')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sfx.playClick();
        this.lightboxZoom = !this.lightboxZoom;
        rerenderFn();
      });

      this.mainEl.querySelector('#mk-img-lightbox-stage')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'mk-img-lightbox-stage') {
          this.sfx.playClick();
          this.lightboxAssetKey = null;
          this.lightboxZoom = false;
          rerenderFn();
        }
      });

      this.mainEl.querySelector('#mk-img-lightbox-backdrop')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'mk-img-lightbox-backdrop') {
          this.sfx.playClick();
          this.lightboxAssetKey = null;
          this.lightboxZoom = false;
          rerenderFn();
        }
      });

      this.mainEl.querySelector('#mk-modal-prev-btn')?.addEventListener('click', () => {
        this.navigateHandbookModal(-1);
      });

      this.mainEl.querySelector('#mk-modal-next-btn')?.addEventListener('click', () => {
        this.navigateHandbookModal(1);
      });

      this.mainEl.querySelector('#mk-modal-speak-btn')?.addEventListener('click', () => {
        const activeItem = HANDBOOK_ITEMS.find((i) => i.assetKey === this.activeHandbookItemKey);
        if (activeItem) {
          this.speakQuestion(`${activeItem.title}. ${activeItem.rule}. Ghi nhớ: ${activeItem.formula}`);
        }
      });
    }

    renderHandbookScreen() {
      const f = this.handbookFilter || 'all';
      const filtered = this.getFilteredHandbookItems();

      const cardsHtml = filtered.map((item) => {
        const imgUrl = VisualBuilder.getSgkImageUrl(item.assetKey);
        const bookLabel = item.book === 'tap1' ? '📘 Tập 1' : '📗 Tập 2';
        return `
          <div class="mk-hb-card" data-hb-item="${item.assetKey}" title="Bấm để mở hộp thoại xem rõ và nghe đọc bí kíp">
            <div class="mk-hb-card-top">
              <span class="mk-cite-tag">${item.badge}</span>
              <span class="mk-topic-tag">${bookLabel}</span>
            </div>
            ${imgUrl
              ? `<div class="mk-hb-img-wrap">
                   <img src="${imgUrl}" alt="${this.escapeHtml(item.title)}" class="mk-hb-img" loading="lazy" />
                   <span class="mk-hb-zoom-hint">🔍 Bấm xem rõ</span>
                 </div>`
              : ''}
            <div style="font-weight:900;font-size:0.95rem;color:#0284C7;line-height:1.28;">${item.title}</div>
            <div class="mk-hb-rule-preview">${item.rule}</div>
            <div style="background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:12px;padding:5px 10px;font-size:0.78rem;font-weight:900;color:#0369A1;margin-top:auto;">
              📐 ${item.formula}
            </div>
          </div>
        `;
      }).join('');

      const modalHtml = this.activeHandbookItemKey
        ? this.buildHandbookModalHtml(this.activeHandbookItemKey, true)
        : '';

      this.setSafeHtml(
        this.mainEl,
        `
        <div class="mk-handbook-panel">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;flex-shrink:0;">
            <div>
              <h2 style="margin:0;font-size:1.28rem;font-weight:900;color:#0284C7;">
                📖 Sổ Tay Bí Kíp Toán 3 - Kết Nối Tri Thức Với Cuộc Sống
              </h2>
              <p style="margin:2px 0 0 0;font-size:0.82rem;color:#475569;font-weight:700;">
                💡 Bấm vào bất kỳ thẻ bí kíp nào để mở cửa sổ phóng to xem rõ hình SGK và nghe Rô-bốt đọc!
              </p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${[
                { id: 'all', label: 'Tất cả (15)' },
                { id: 'tap1', label: '📘 SGK Tập 1' },
                { id: 'tap2', label: '📗 SGK Tập 2' },
                { id: 'num', label: 'Số & Phép tính' },
                { id: 'geo', label: 'Hình học & Đo lường' },
                { id: 'word_stat', label: 'Toán lời văn & Thống kê' }
              ].map((tab) => `
                <button type="button" class="mk-btn ${f === tab.id ? 'mk-btn-primary' : 'mk-btn-outline'}" data-hb-filter="${tab.id}" style="min-height:34px;padding:4px 10px;font-size:0.78rem;">
                  ${tab.label}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="mk-handbook-grid">${cardsHtml}</div>
          ${modalHtml}
        </div>
      `
      );

      this.mainEl.querySelectorAll('[data-hb-filter]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          this.sfx.playClick();
          this.stopSpeech();
          this.activeHandbookItemKey = null;
          this.handbookFilter = e.currentTarget.getAttribute('data-hb-filter') || 'all';
          this.renderHandbookScreen();
        });
      });

      this.mainEl.querySelectorAll('[data-hb-item]').forEach((card) => {
        card.addEventListener('click', (e) => {
          this.sfx.playClick();
          this.stopSpeech();
          this.activeHandbookItemKey = e.currentTarget.getAttribute('data-hb-item');
          this.renderHandbookScreen();
        });
      });

      this.bindHandbookModalEvents(() => this.renderHandbookScreen());
    }

    /* ------------------------------------------------------------------------
     * MÀN HÌNH 6: BẢNG VÀNG HIỆP SĨ (LEADERBOARD)
     * ------------------------------------------------------------------------ */
    async openLeaderboard() {
      this.setScreen('LEADERBOARD');
      this.leaderboardRows = await this.gm.fetchLeaderboard();
      if (this.screen === 'LEADERBOARD') {
        this.renderLeaderboardScreen();
      }
    }

    renderLeaderboardScreen() {
      const rows = this.leaderboardRows.length > 0
        ? this.leaderboardRows
        : [
            { playerName: this.gm.saveData.playerName, avatar: this.gm.saveData.avatar, score: this.gm.saveData.highScore, stagesCleared: this.gm.saveData.crystals.length, accuracy: 100 }
          ];

      const trHtml = rows.map((r, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
        const pName = this.gm.sanitizePlayerName(r.playerName || r.player_name || 'Hiệp Sĩ Nhí');
        const safeScore = Math.max(0, Math.min(36000, Math.round(Number(r.score) || 0)));
        const rawStCleared = r.stagesCleared !== undefined ? r.stagesCleared : (r.stages_cleared || 0);
        const stCleared = Math.max(0, Math.min(5, Math.round(Number(rawStCleared) || 0)));
        const safeAccuracy = Math.max(0, Math.min(100, Math.round(Number(r.accuracy ?? 95) || 0)));
        return `
          <tr>
            <td><strong>${medal}</strong></td>
            <td style="text-align:left;">
              ${r.avatar === 'mage' ? '🔮' : '⚔️'} <strong>${this.escapeHtml(pName)}</strong>
            </td>
            <td><strong style="color:#E11D48;">${safeScore}</strong></td>
            <td>💎 ${stCleared}/5</td>
            <td>${safeAccuracy}%</td>
          </tr>
        `;
      }).join('');

      this.setSafeHtml(
        this.mainEl,
        `
        <div style="background:#FFFDF9;border:3px solid #FFFFFF;border-radius:28px;box-shadow:0 8px 0 #FDE68A, 0 22px 44px -10px rgba(245,158,11,0.16);padding:20px 24px;max-width:760px;margin:0 auto;width:100%;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <h2 style="margin:0;font-size:1.42rem;font-weight:900;color:#D97706;">🏆 Bảng Vàng Hiệp Sĩ Toán Học</h2>
            <button type="button" class="mk-btn mk-btn-outline" id="mk-lb-back" style="min-height:38px;padding:6px 14px;font-size:0.84rem;">
              ⬅️ Quay Lại
            </button>
          </div>
          <table class="mk-stats-table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th style="text-align:left;">Hiệp Sĩ</th>
                <th>Điểm Số</th>
                <th>Đá Pha Lê</th>
                <th>Độ Chính Xác</th>
              </tr>
            </thead>
            <tbody>${trHtml}</tbody>
          </table>
        </div>
      `
      );

      this.mainEl.querySelector('#mk-lb-back')?.addEventListener('click', () => {
        this.sfx.playClick();
        this.setScreen('MAP');
      });
    }

    /* ------------------------------------------------------------------------
     * HIỆU ỨNG PHÁO HOA / SAO RƠI TRÊN CANVAS (CONFETTI PARTICLES)
     * ------------------------------------------------------------------------ */
    spawnCelebrationParticles(count = 35) {
      if (!this.fxCanvas) return;
      this.resizeFxCanvas();
      const cw = this.fxCanvas.width || 1000;
      const ch = this.fxCanvas.height || 640;
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: cw * 0.5 + (Math.random() - 0.5) * (cw * 0.35),
          y: ch * 0.35 + (Math.random() - 0.5) * 90,
          vx: (Math.random() - 0.5) * 11,
          vy: -Math.random() * 9 - 2,
          size: Math.random() * 7 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1
        });
      }
      if (!this.animFrameId) {
        this.runParticleLoop();
      }
    }

    runParticleLoop() {
      const ctx = this.fxCanvas ? this.fxCanvas.getContext('2d') : null;
      if (!ctx) return;
      ctx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);

      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.alpha -= 0.016;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      });

      this.particles = this.particles.filter((p) => p.alpha > 0 && p.y < this.fxCanvas.height);
      if (this.particles.length > 0) {
        this.animFrameId = requestAnimationFrame(() => this.runParticleLoop());
      } else {
        ctx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
        this.animFrameId = null;
      }
    }

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
    }
  }

  const UIController = MathKnightGameElement;

  window.MathKnightCore = {
    version: MK_VERSION,
    SoundFX,
    VisualBuilder,
    MathEngine,
    GameManager,
    UIController,
    STAGES_BY_BOOK,
    getStagesForBook,
    STAGES_CONFIG,
    BADGES_CONFIG,
    HANDBOOK_ITEMS
  };

  if (!window.customElements.get('math-knight-game')) {
    window.customElements.define('math-knight-game', MathKnightGameElement);
  }
})();

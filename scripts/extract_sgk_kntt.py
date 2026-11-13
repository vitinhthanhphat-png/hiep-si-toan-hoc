#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script trích xuất hình ảnh minh họa gốc và metadata từ bộ SGK Toán 3
"Kết nối tri thức với cuộc sống" (Tập 1 & Tập 2 - NXB Giáo dục Việt Nam).

Đầu ra:
- assets/images/sgk/*.jpg, *.png (16 hình minh họa đặc sắc chuẩn SGK)
- assets/images/sgk/manifest.json (Metadata tra cứu bài học, trang SGK, đường dẫn)
- assets/js/sgk-assets.js (Bundle dataUri nén nhẹ dùng cho cả Single-file index.html và WordPress Plugin)
"""

import base64
import io
import json
import os
import shutil
import fitz  # PyMuPDF
from PIL import Image

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PDF_TAP1 = os.path.join(ROOT_DIR, "docs", "pdf", "03-sgk-toan-3-tap-mot.pdf")
PDF_TAP2 = os.path.join(ROOT_DIR, "docs", "pdf", "03-sgk-toan-3-tap-hai.pdf")
OUT_IMG_DIR = os.path.join(ROOT_DIR, "assets", "images", "sgk")
OUT_JS_DIR = os.path.join(ROOT_DIR, "assets", "js")

# Danh sách 16 hình ảnh minh họa đặc trưng cắt từ SGK Toán 3 - Kết nối tri thức với cuộc sống
# Công thức trang của cả 2 cuốn PDF: pdf_index_0based = sgk_page (riêng bìa Tập 1 là index 0)
CROPS_CONFIG = [
    {
        "id": "cover_tap1",
        "filename": "cover_tap1.jpg",
        "volume": 1,
        "pdf_index": 0,
        "sgk_page": 1,
        "lesson": "Bìa SGK Toán 3 Tập 1",
        "topic": "Chủ đề mở đầu: Khám phá đại dương Toán học cùng Rô-bốt",
        "category": "intro",
        "subType": "cover",
        "title": "Bìa sách Toán 3 Tập 1 - Kết nối tri thức với cuộc sống",
        "caption": "Các bạn nhỏ và Rô-bốt lặn biển khám phá thế giới Toán học Lớp 3.",
        "bbox": (0.0, 0.365, 1.0, 0.96),
        "max_width": 720,
        "thumb_width": 360,
    },
    {
        "id": "robot_mascot",
        "filename": "robot_mascot.png",
        "volume": 1,
        "pdf_index": 85,
        "sgk_page": 85,
        "lesson": "Bài 30: Mi-li-mét",
        "topic": "Nhân vật đồng hành: Rô-bốt thông thái",
        "category": "mascot",
        "subType": "mascot",
        "title": "Bạn Rô-bốt thông thái (SGK Toán 3 Kết nối tri thức)",
        "caption": "Rô-bốt luôn đồng hành gợi ý kiến thức mới cho Việt, Nam, Mai và Mi.",
        "bbox": (0.64, 0.39, 0.91, 0.625),
        "max_width": 420,
        "thumb_width": 260,
    },
    {
        "id": "midpoint_b16",
        "filename": "midpoint_b16.jpg",
        "volume": 1,
        "pdf_index": 49,
        "sgk_page": 49,
        "lesson": "Bài 16: Điểm ở giữa, trung điểm của đoạn thẳng",
        "topic": "Chủ đề 3: Làm quen với hình phẳng, hình khối",
        "category": "geo",
        "subType": "midpoint_segment",
        "title": "Điểm ở giữa và Trung điểm của đoạn thẳng (Trang 49 Tập 1)",
        "caption": "Việt giúp Nam cắt đoạn dây tại trung điểm cùng sơ đồ điểm ở giữa B và trung điểm H.",
        "bbox": (0.09, 0.34, 0.92, 0.915),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "circle_b17",
        "filename": "circle_b17.jpg",
        "volume": 1,
        "pdf_index": 52,
        "sgk_page": 52,
        "lesson": "Bài 17: Hình tròn. Tâm, bán kính, đường kính của hình tròn",
        "topic": "Chủ đề 3: Làm quen với hình phẳng, hình khối",
        "category": "geo",
        "subType": "circle_radius_diameter",
        "title": "Hình tròn tâm O, bán kính OM, đường kính AB (Trang 52 Tập 1)",
        "caption": "Tâm O là trung điểm của đường kính AB. Đường kính dài gấp 2 lần bán kính.",
        "bbox": (0.09, 0.25, 0.91, 0.635),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "angle_eke_b18",
        "filename": "angle_eke_b18.jpg",
        "volume": 1,
        "pdf_index": 54,
        "sgk_page": 54,
        "lesson": "Bài 18: Góc, góc vuông, góc không vuông",
        "topic": "Chủ đề 3: Làm quen với hình phẳng, hình khối",
        "category": "geo",
        "subType": "angle_check",
        "title": "Góc vuông, góc không vuông và cách đặt thước Ê-ke (Trang 54 Tập 1)",
        "caption": "Dùng thước ê-ke để kiểm tra góc vuông đỉnh O và các góc không vuông đỉnh P, đỉnh E.",
        "bbox": (0.10, 0.47, 0.92, 0.935),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "mult_fold_b24",
        "filename": "mult_fold_b24.jpg",
        "volume": 1,
        "pdf_index": 70,
        "sgk_page": 70,
        "lesson": "Bài 24: Gấp một số lên một số lần",
        "topic": "Chủ đề 4: Phép nhân, phép chia trong phạm vi 100",
        "category": "word",
        "subType": "scale_up",
        "title": "Bài toán Gấp một số lên một số lần (Trang 70 Tập 1)",
        "caption": "Muốn gấp một số lên một số lần, ta lấy số đó nhân với số lần (6 × 4 = 24 quả táo).",
        "bbox": (0.09, 0.18, 0.91, 0.415),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "two_step_b28",
        "filename": "two_step_b28.jpg",
        "volume": 1,
        "pdf_index": 81,
        "sgk_page": 81,
        "lesson": "Bài 28: Bài toán giải bằng hai bước tính",
        "topic": "Chủ đề 4: Phép nhân, phép chia trong phạm vi 100",
        "category": "word",
        "subType": "two_step_diff_sum",
        "title": "Phương pháp giải Bài toán bằng hai bước tính (Trang 81 Tập 1)",
        "caption": "Sơ đồ tóm tắt đoạn thẳng và 2 bước tính tìm số sách ở ngăn dưới rồi tìm tổng cả hai ngăn.",
        "bbox": (0.09, 0.64, 0.91, 0.915),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "mm_ruler_b30",
        "filename": "mm_ruler_b30.jpg",
        "volume": 1,
        "pdf_index": 85,
        "sgk_page": 85,
        "lesson": "Bài 30: Mi-li-mét",
        "topic": "Chủ đề 5: Một số đơn vị đo độ dài, khối lượng, dung tích, nhiệt độ",
        "category": "geo",
        "subType": "unit_conversion",
        "title": "Đơn vị đo độ dài Mi-li-mét (mm) trên thước kẻ (Trang 85 Tập 1)",
        "caption": "1 cm = 10 mm; 1 m = 1 000 mm. Que kem Rô-bốt cầm dày 1 mm.",
        "bbox": (0.09, 0.30, 0.91, 0.63),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "expression_b38",
        "filename": "expression_b38.jpg",
        "volume": 1,
        "pdf_index": 104,
        "sgk_page": 104,
        "lesson": "Bài 38: Biểu thức số. Tính giá trị của biểu thức số",
        "topic": "Chủ đề 6: Phép nhân, phép chia trong phạm vi 1 000",
        "category": "num",
        "subType": "expression_order",
        "title": "Làm quen với Biểu thức số qua độ dài đường gấp khúc (Trang 104 Tập 1)",
        "caption": "Đường gấp khúc ABCD dẫn tới biểu thức 5 + 5 + 8 hoặc 5 × 2 + 8.",
        "bbox": (0.09, 0.22, 0.93, 0.77),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "roman_clock_b47",
        "filename": "roman_clock_b47.jpg",
        "volume": 2,
        "pdf_index": 12,
        "sgk_page": 12,
        "lesson": "Bài 47: Làm quen với chữ số La Mã",
        "topic": "Chủ đề 8: Các số đến 10 000",
        "category": "num",
        "subType": "roman_numerals",
        "title": "Đồng hồ chữ số La Mã và bảng số La Mã từ I đến XX (Trang 12 Tập 2)",
        "caption": "Ba chữ số La Mã cơ bản I (1), V (5), X (10) ghép thành các số từ 1 đến 20.",
        "bbox": (0.09, 0.15, 0.91, 0.685),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "perimeter_b50",
        "filename": "perimeter_b50.jpg",
        "volume": 2,
        "pdf_index": 21,
        "sgk_page": 21,
        "lesson": "Bài 50: Chu vi hình tam giác, hình tứ giác, hình chữ nhật, hình vuông",
        "topic": "Chủ đề 9: Chu vi, diện tích một số hình phẳng",
        "category": "geo",
        "subType": "rect_square_peri_area",
        "title": "Chu vi hình tam giác ABC và hình tứ giác MNPQ (Trang 21 Tập 2)",
        "caption": "Tổng độ dài các cạnh của hình tam giác, hình tứ giác là chu vi của hình đó.",
        "bbox": (0.09, 0.32, 0.92, 0.92),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "area_grid_b52",
        "filename": "area_grid_b52.jpg",
        "volume": 2,
        "pdf_index": 30,
        "sgk_page": 30,
        "lesson": "Bài 52: Diện tích hình chữ nhật, diện tích hình vuông",
        "topic": "Chủ đề 9: Chu vi, diện tích một số hình phẳng",
        "category": "geo",
        "subType": "rect_square_peri_area",
        "title": "Diện tích hình chữ nhật trên lưới ô vuông 1 cm² (Trang 30 Tập 2)",
        "caption": "Hình chữ nhật ABCD có 4 × 3 = 12 ô vuông (12 cm²). Quy tắc: Lấy chiều dài nhân với chiều rộng.",
        "bbox": (0.09, 0.23, 0.91, 0.70),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "clock_read_b66",
        "filename": "clock_read_b66.jpg",
        "volume": 2,
        "pdf_index": 77,
        "sgk_page": 77,
        "lesson": "Bài 66: Xem đồng hồ. Tháng - năm",
        "topic": "Chủ đề 13: Xem đồng hồ. Tháng - năm. Tiền Việt Nam",
        "category": "geo",
        "subType": "clock_reading",
        "title": "Xem đồng hồ chính xác đến từng phút cùng Rô-bốt (Trang 77 Tập 2)",
        "caption": "Một giờ có 60 phút. Minh họa đồng hồ chỉ 3 giờ 5 phút và 5 giờ 43 phút.",
        "bbox": (0.09, 0.26, 0.92, 0.545),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "vn_money_b68",
        "filename": "vn_money_b68.jpg",
        "volume": 2,
        "pdf_index": 85,
        "sgk_page": 85,
        "lesson": "Bài 68: Tiền Việt Nam",
        "topic": "Chủ đề 13: Xem đồng hồ. Tháng - năm. Tiền Việt Nam",
        "category": "word",
        "subType": "vn_money",
        "title": "Các tờ tiền Việt Nam từ 1 000 đồng đến 500 000 đồng (Trang 85 Tập 2)",
        "caption": "Nhận diện mệnh giá các tờ tiền giấy và tiền polymer Việt Nam thông dụng.",
        "bbox": (0.14, 0.21, 0.84, 0.925),
        "max_width": 700,
        "thumb_width": 360,
    },
    {
        "id": "stats_basketball_b73",
        "filename": "stats_basketball_b73.jpg",
        "volume": 2,
        "pdf_index": 103,
        "sgk_page": 103,
        "lesson": "Bài 73: Thu thập, phân loại, ghi chép số liệu. Bảng số liệu",
        "topic": "Chủ đề 15: Làm quen với yếu tố thống kê, xác suất",
        "category": "stat",
        "subType": "stat_table",
        "title": "Thu thập, phân loại và ghi chép số liệu ném bóng rổ (Trang 103 Tập 2)",
        "caption": "Rô-bốt ghi chép kết quả ném bóng vào rổ của Nam (7 lần), Việt (10 lần) và Mai (5 lần).",
        "bbox": (0.05, 0.25, 0.96, 0.89),
        "max_width": 760,
        "thumb_width": 400,
    },
    {
        "id": "prob_balls_coins_b74",
        "filename": "prob_balls_coins_b74.jpg",
        "volume": 2,
        "pdf_index": 108,
        "sgk_page": 108,
        "lesson": "Bài 74: Khả năng xảy ra của một sự kiện",
        "topic": "Chủ đề 15: Làm quen với yếu tố thống kê, xác suất",
        "category": "stat",
        "subType": "probability_event",
        "title": "Khả năng xảy ra của một sự kiện: Lấy bóng và tung đồng xu (Trang 108 Tập 2)",
        "caption": "Trò chơi Rô-bốt lấy bóng xanh/đỏ từ hộp kín và tung đồng xu hai mặt (cỏ 4 lá / ngôi sao).",
        "bbox": (0.09, 0.21, 0.91, 0.91),
        "max_width": 760,
        "thumb_width": 400,
    },
]


def crop_and_save():
    os.makedirs(OUT_IMG_DIR, exist_ok=True)
    os.makedirs(OUT_JS_DIR, exist_ok=True)

    doc1 = fitz.open(PDF_TAP1)
    doc2 = fitz.open(PDF_TAP2)

    manifest = {
        "bookSeries": "Kết nối tri thức với cuộc sống",
        "subject": "Toán Lớp 3 (Chương trình GDPT 2018)",
        "publisher": "Nhà xuất bản Giáo dục Việt Nam",
        "totalAssets": len(CROPS_CONFIG),
        "assets": {},
    }
    js_assets = {}

    for item in CROPS_CONFIG:
        doc = doc1 if item["volume"] == 1 else doc2
        page = doc[item["pdf_index"]]
        rect = page.rect

        x0, y0, x1, y1 = item["bbox"]
        clip_rect = fitz.Rect(
            rect.width * x0,
            rect.height * y0,
            rect.width * x1,
            rect.height * y1,
        )

        # Render với độ phân giải cao (zoom = 2.2x ~ 160 DPI)
        mat = fitz.Matrix(2.2, 2.2)
        pix = page.get_pixmap(matrix=mat, clip=clip_rect, alpha=False)

        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        # Resize hình chính lưu vào assets/images/sgk/
        max_w = item["max_width"]
        if img.width > max_w:
            ratio = max_w / float(img.width)
            new_h = int(img.height * ratio)
            img_main = img.resize((max_w, new_h), Image.Resampling.LANCZOS)
        else:
            img_main = img

        out_path = os.path.join(OUT_IMG_DIR, item["filename"])
        if item["filename"].endswith(".png"):
            img_main.save(out_path, format="PNG", optimize=True)
        else:
            img_main.save(out_path, format="JPEG", quality=85, optimize=True)

        # Tạo bản thumbnail nén nhẹ dạng Data URI (JPEG quality 72) để nhúng vào JS/Single-file
        thumb_w = item["thumb_width"]
        t_ratio = thumb_w / float(img.width)
        thumb_h = int(img.height * t_ratio)
        img_thumb = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)

        buf = io.BytesIO()
        img_thumb.save(buf, format="JPEG", quality=72, optimize=True)
        b64_str = base64.b64encode(buf.getvalue()).decode("ascii")
        data_uri = f"data:image/jpeg;base64,{b64_str}"

        file_size_kb = round(os.path.getsize(out_path) / 1024.0, 1)
        rel_path = f"assets/images/sgk/{item['filename']}"

        asset_meta = {
            "id": item["id"],
            "filename": item["filename"],
            "relativePath": rel_path,
            "volume": item["volume"],
            "sgkPage": item["sgk_page"],
            "lesson": item["lesson"],
            "topic": item["topic"],
            "category": item["category"],
            "subType": item["subType"],
            "title": item["title"],
            "caption": item["caption"],
            "width": img_main.width,
            "height": img_main.height,
            "fileSizeKB": file_size_kb,
        }
        manifest["assets"][item["id"]] = asset_meta

        js_assets[item["id"]] = {
            **asset_meta,
            "dataUri": data_uri,
        }
        print(
            f"[OK] {item['filename']} ({img_main.width}x{img_main.height}, {file_size_kb} KB) <- Tập {item['volume']} tr.{item['sgk_page']}"
        )

    doc1.close()
    doc2.close()

    # Lưu manifest.json
    manifest_path = os.path.join(OUT_IMG_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"[OK] Saved {manifest_path}")

    # Lưu assets/js/sgk-assets.js
    js_path = os.path.join(OUT_JS_DIR, "sgk-assets.js")
    js_content = (
        "/**\n"
        " * Bộ hình ảnh minh họa gốc cắt từ SGK Toán 3 - Kết nối tri thức với cuộc sống\n"
        " * Tự động sinh bởi scripts/extract_sgk_kntt.py\n"
        " */\n"
        "window.MK_SGK_ASSETS = "
        + json.dumps(js_assets, ensure_ascii=False, indent=2)
        + ";\n"
    )
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"[OK] Saved {js_path} ({round(os.path.getsize(js_path)/1024.0, 1)} KB)")

    # Dọn dẹp thư mục tạm toc_preview và sample_pages
    for temp_dir in ["toc_preview", "sample_pages"]:
        p = os.path.join(ROOT_DIR, "docs", "pdf", temp_dir)
        if os.path.exists(p):
            shutil.rmtree(p)
            print(f"[CLEANUP] Removed temporary folder: {p}")


if __name__ == "__main__":
    crop_and_save()

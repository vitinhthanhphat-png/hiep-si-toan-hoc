#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script đóng gói toàn bộ trò chơi "Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê" (v1.0)
(SGK Toán 3 - Kết nối tri thức với cuộc sống) thành 1 file index.html độc lập duy nhất.
Thiết kế: Full-viewport 100vw x 100dvh, 2.5D Paper-Cut Storybook, Bright Sunshine & Pastel, Zero Scrollbars.
"""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SGK_ASSETS_JS = ROOT_DIR / "assets" / "js" / "sgk-assets.js"
BUNDLE_JS = ROOT_DIR / "assets" / "js" / "math-knight-bundle.js"
OUTPUT_HTML = ROOT_DIR / "index.html"


def build_single_html() -> None:
    sgk_js_code = SGK_ASSETS_JS.read_text(encoding="utf-8")
    bundle_js_code = BUNDLE_JS.read_text(encoding="utf-8")

    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê | Toán Lớp 3 - Kết Nối Tri Thức</title>
  <meta name="description" content="Trò chơi học tập Toán Lớp 3 bám sát 100% bộ sách Kết nối tri thức với cuộc sống (Tập 1 & Tập 2 - GDPT 2018) cùng Rô-bốt, Việt, Nam, Mai, Mi." />
  <style>
    *, *::before, *::after {{
      box-sizing: border-box;
    }}
    html, body {{
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100dvh;
      overflow: hidden;
      background: linear-gradient(135deg, #FFFDF5 0%, #E0F7FA 52%, #FEF9C3 100%);
      font-family: 'Nunito', 'Quicksand', 'Segoe UI', Roboto, system-ui, -apple-system, sans-serif;
      color: #0F3D5E;
      -webkit-font-smoothing: antialiased;
    }}
    math-knight-game {{
      display: block;
      width: 100vw;
      height: 100dvh;
      overflow: hidden;
    }}
  </style>
</head>
<body>
  <!-- Custom Web Component <math-knight-game> (Full-Viewport 2.5D Paper-Cut Storybook) -->
  <math-knight-game
    standalone="true"
    mode="story"
    stage="0"
    timer="true"
    questions-per-stage="9"
    time-per-question="30"
    initial-lives="3"
    enable-sgk-images="true"
  ></math-knight-game>

  <!-- 1. Bộ dữ liệu hình ảnh cắt gốc từ SGK Toán 3 Kết nối tri thức (Base64 Embedded) -->
  <script>
{sgk_js_code}
  </script>

  <!-- 2. Core Engine 5 Modules: SoundFX, VisualBuilder, MathEngine, GameManager, UIController -->
  <script>
{bundle_js_code}
  </script>
</body>
</html>
"""
    OUTPUT_HTML.write_text(html_content, encoding="utf-8")
    size_kb = OUTPUT_HTML.stat().st_size / 1024
    print(f"[OK] Built standalone index.html ({size_kb:.1f} KB) at: {OUTPUT_HTML}")


if __name__ == "__main__":
    build_single_html()

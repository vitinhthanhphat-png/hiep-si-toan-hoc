#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script đóng gói WordPress Plugin chuẩn: hiep-si-toan-hoc-plugin.zip
Chỉ bao gồm các file cần thiết để upload trực tiếp vào WordPress Admin (Plugins -> Add New -> Upload):
  - hiep-si-toan-hoc.php
  - uninstall.php
  - includes/*
  - assets/*
  - index.html
  - docs/*.md (tự động loại bỏ thư mục nặng docs/pdf/)
"""

import os
import zipfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
PLUGIN_SLUG = "hiep-si-toan-hoc"
OUTPUT_ZIP = ROOT_DIR / "hiep-si-toan-hoc-plugin.zip"


def collect_plugin_files():
    """Thu thập danh sách (duong_dan_thuc, duong_dan_trong_zip) cho gói WordPress Plugin."""
    entries = []

    # 1. Các file đơn ở thư mục gốc
    root_files = [
        "hiep-si-toan-hoc.php",
        "style.css",
        "uninstall.php",
        "index.html",
    ]
    for fname in root_files:
        fpath = ROOT_DIR / fname
        if fpath.is_file():
            entries.append((fpath, f"{PLUGIN_SLUG}/{fname}"))

    # 2. Thư mục includes/ và assets/
    for folder in ["includes", "assets"]:
        folder_path = ROOT_DIR / folder
        if folder_path.is_dir():
            for dirpath, _, filenames in os.walk(folder_path):
                for fn in sorted(filenames):
                    full_path = Path(dirpath) / fn
                    rel_path = full_path.relative_to(ROOT_DIR).as_posix()
                    entries.append((full_path, f"{PLUGIN_SLUG}/{rel_path}"))

    # 3. Các file tài liệu Markdown trong docs/*.md (Loại bỏ hoàn toàn docs/pdf/)
    docs_dir = ROOT_DIR / "docs"
    if docs_dir.is_dir():
        for md_file in sorted(docs_dir.glob("*.md")):
            if md_file.is_file():
                rel_path = md_file.relative_to(ROOT_DIR).as_posix()
                entries.append((md_file, f"{PLUGIN_SLUG}/{rel_path}"))

    return entries


def build_zip():
    entries = collect_plugin_files()
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()

    with zipfile.ZipFile(OUTPUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for src_path, arc_name in entries:
            zf.write(src_path, arcname=arc_name)

    size_bytes = OUTPUT_ZIP.stat().st_size
    size_mb = size_bytes / (1024 * 1024)
    print(f"[OK] Da dong goi WordPress Plugin: {OUTPUT_ZIP}")
    print(f"     Tong so file: {len(entries)} files")
    print(f"     Dung luong  : {size_bytes:,} bytes (~{size_mb:.2f} MB)")


if __name__ == "__main__":
    build_zip()

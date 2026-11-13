#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tự động đóng gói và phát hành bản Release (.zip) lên GitHub Releases
dành cho WordPress Plugin "Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê".

Cách dùng:
    python scripts/publish_release.py v1.0 "Phát hành Hiệp Sĩ Toán Học v1.0"
"""

import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
ZIP_FILE = ROOT_DIR / "hiep-si-toan-hoc-plugin.zip"
BUILD_HTML_SCRIPT = ROOT_DIR / "scripts" / "build_single_html.py"
BUILD_ZIP_SCRIPT = ROOT_DIR / "scripts" / "build_wp_zip.py"
DEFAULT_REPO = "vitinhthanhphat-png/hiep-si-toan-hoc"


def run_step(cmd: list[str], desc: str, check: bool = True) -> subprocess.CompletedProcess:
    print(f"==> {desc}: {' '.join(cmd)}")
    return subprocess.run(cmd, cwd=str(ROOT_DIR), check=check, text=True)


def publish_release(tag: str, title: str, notes: str) -> None:
    if not tag.startswith("v"):
        tag = f"v{tag}"

    # 1. Đóng gói lại bản Single-file index.html và file hiep-si-toan-hoc-plugin.zip mới nhất
    run_step([sys.executable, str(BUILD_HTML_SCRIPT)], "Đóng gói index.html độc lập")
    run_step([sys.executable, str(BUILD_ZIP_SCRIPT)], "Đóng gói hiep-si-toan-hoc-plugin.zip")

    if not ZIP_FILE.exists():
        print(f"[ERROR] Không tìm thấy file {ZIP_FILE} sau khi đóng gói!", file=sys.stderr)
        sys.exit(1)

    size_mb = ZIP_FILE.stat().st_size / (1024 * 1024)
    print(f"[OK] Sẵn sàng phát hành {ZIP_FILE.name} ({size_mb:.2f} MB) cho tag {tag}")

    # 2. Kiểm tra xem Release tag đã tồn tại trên GitHub chưa
    view_res = subprocess.run(
        ["gh", "release", "view", tag, "--repo", DEFAULT_REPO],
        cwd=str(ROOT_DIR),
        capture_output=True,
        text=True,
    )

    if view_res.returncode == 0:
        print(f"==> Release {tag} đã tồn tại, đang cập nhật đè (clobber) file {ZIP_FILE.name}...")
        run_step(
            [
                "gh",
                "release",
                "upload",
                tag,
                str(ZIP_FILE),
                "--clobber",
                "--repo",
                DEFAULT_REPO,
            ],
            f"Upload đè asset {ZIP_FILE.name} lên Release {tag}",
        )
    else:
        print(f"==> Đang tạo GitHub Release mới {tag} kèm gói {ZIP_FILE.name}...")
        run_step(
            [
                "gh",
                "release",
                "create",
                tag,
                str(ZIP_FILE),
                "--title",
                title,
                "--notes",
                notes,
                "--repo",
                DEFAULT_REPO,
            ],
            f"Tạo Release {tag} trên GitHub ({DEFAULT_REPO})",
        )

    print(
        f"\n[SUCCESS] Đã phát hành {tag} kèm gói {ZIP_FILE.name} lên:\n"
        f"          https://github.com/{DEFAULT_REPO}/releases/tag/{tag}"
    )


def main() -> None:
    tag = sys.argv[1] if len(sys.argv) >= 2 else "v1.0"
    title = (
        sys.argv[2]
        if len(sys.argv) >= 3
        else f"Hiệp Sĩ Toán Học {tag} — WordPress Plugin (Release ZIP)"
    )
    notes = (
        sys.argv[3]
        if len(sys.argv) >= 4
        else (
            f"Bản phát hành chính thức **{title}**.\n\n"
            "- Tải file đính kèm `hiep-si-toan-hoc-plugin.zip` để cài đặt hoặc cập nhật tự động ngay trong WordPress Admin."
        )
    )
    publish_release(tag, title, notes)


if __name__ == "__main__":
    main()

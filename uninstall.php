<?php
/**
 * Thực thi khi người dùng gỡ cài đặt (Uninstall) Plugin Hiệp Sĩ Toán Học khỏi WordPress.
 *
 * Bảo toàn bảng điểm của học sinh ({prefix}math_knight_scores) để tránh mất dữ liệu
 * ngoài ý muốn khi giáo viên cài đặt lại phiên bản mới, chỉ dọn dẹp các tùy chọn cấu hình tạm.
 *
 * @package HiepSiToanHoc
 */

// Nếu không phải do WordPress gọi khi gỡ cài đặt thì thoát ngay lập tức.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Xóa các tùy chọn cấu hình trong bảng wp_options.
delete_option( 'math_knight_settings' );
delete_option( 'math_knight_db_version' );

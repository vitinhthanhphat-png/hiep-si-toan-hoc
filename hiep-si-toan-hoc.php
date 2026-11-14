<?php
/**
 * Plugin Name:       Hiệp Sĩ Toán Học Lớp 3
 * Plugin URI:        https://techsharevn.com
 * Description:       Web Game nhập vai giáo dục môn Toán Lớp 3 bám sát bộ sách Kết nối tri thức với cuộc sống (GDPT 2018). Tích hợp Custom Web Component <math-knight-game> (Shadow DOM), Shortcode [hiep_si_toan_hoc], Gutenberg Block, Bảng xếp hạng REST API và Trang quản trị Giáo viên.
 * Version:           1.4
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Trần Vĩ Thành (Techshare VN)
 * Author URI:        https://techsharevn.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hiep-si-toan-hoc
 * Domain Path:       /languages
 *
 * @package HiepSiToanHoc
 */

// Ngăn chặn truy cập trực tiếp vào file.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Định nghĩa các hằng số cốt lõi của Plugin.
 */
define( 'MK_PLUGIN_VERSION', '1.4' );
define( 'MK_DB_VERSION', '1.0' );
define( 'MK_GITHUB_REPO', 'vitinhthanhphat-png/hiep-si-toan-hoc' );
define( 'MK_PLUGIN_FILE', __FILE__ );
define( 'MK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'MK_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Hàm tiện ích lấy cấu hình chuẩn của game (kết hợp giá trị mặc định).
 *
 * @return array Danh sách cài đặt đã chuẩn hóa.
 */
function mk_get_settings() {
	$defaults = array(
		'default_book_mode'   => 'all',
		'questions_per_stage' => 8,
		'timer_enabled'       => true,
		'time_per_question'   => 30,
		'initial_lives'       => 3,
		'enable_sgk_images'   => true,
		'fullscreen_button'   => true,
		'enabled_topics'      => array( 'num', 'geo', 'word', 'stat' ),
		'allow_guest_scores'  => true,
	);

	$saved = get_option( 'math_knight_settings', array() );
	if ( ! is_array( $saved ) ) {
		$saved = array();
	}

	$settings = wp_parse_args( $saved, $defaults );

	// Đảm bảo kiểu dữ liệu chặt chẽ cho phía Frontend JS.
	$valid_book_modes                = array( 'all', 'tap1', 'tap2' );
	$settings['default_book_mode']   = in_array( $settings['default_book_mode'], $valid_book_modes, true ) ? $settings['default_book_mode'] : 'all';
	$settings['questions_per_stage'] = max( 5, min( 15, absint( $settings['questions_per_stage'] ) ) );
	$settings['timer_enabled']       = (bool) $settings['timer_enabled'];
	$settings['time_per_question']   = max( 15, min( 60, absint( $settings['time_per_question'] ) ) );
	$settings['initial_lives']       = max( 1, min( 5, absint( $settings['initial_lives'] ) ) );
	$settings['enable_sgk_images']   = (bool) $settings['enable_sgk_images'];
	$settings['fullscreen_button']   = (bool) $settings['fullscreen_button'];
	$settings['allow_guest_scores']  = (bool) $settings['allow_guest_scores'];

	if ( empty( $settings['enabled_topics'] ) || ! is_array( $settings['enabled_topics'] ) ) {
		$settings['enabled_topics'] = array( 'num', 'geo', 'word', 'stat' );
	} else {
		$valid_topics               = array( 'num', 'geo', 'word', 'stat' );
		$filtered_topics            = array_values( array_intersect( $settings['enabled_topics'], $valid_topics ) );
		$settings['enabled_topics'] = ! empty( $filtered_topics ) ? $filtered_topics : $valid_topics;
	}

	return $settings;
}

/**
 * Lấy thông tin người dùng WordPress hiện tại (nếu đã đăng nhập) kèm kỷ lục điểm cao nhất
 * và dữ liệu tiến độ đồng bộ trên đám mây (`user_meta`: `math_knight_save_data`).
 *
 * @return array Thông tin người dùng chuẩn hóa cho Frontend JS.
 */
function mk_get_current_user_payload() {
	if ( ! is_user_logged_in() ) {
		return array(
			'isLoggedIn'    => false,
			'userId'        => 0,
			'userLogin'     => '',
			'displayName'   => '',
			'highScore'     => 0,
			'savedProgress' => null,
		);
	}

	$user = wp_get_current_user();
	if ( ! ( $user instanceof WP_User ) || empty( $user->ID ) ) {
		return array(
			'isLoggedIn'    => false,
			'userId'        => 0,
			'userLogin'     => '',
			'displayName'   => '',
			'highScore'     => 0,
			'savedProgress' => null,
		);
	}

	global $wpdb;
	$user_id    = (int) $user->ID;
	$table_name = $wpdb->prefix . 'math_knight_scores';
	$best_score = 0;

	// Kiểm tra bảng tồn tại trước khi truy vấn điểm cao nhất của user_id.
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$table_exists = $wpdb->get_var(
		$wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name )
	);
	if ( $table_exists === $table_name ) {
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$best_score = (int) $wpdb->get_var(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT COALESCE(MAX(score), 0) FROM {$table_name} WHERE user_id = %d",
				$user_id
			)
		);
	}

	$raw_display  = ! empty( $user->display_name ) ? $user->display_name : $user->user_login;
	$display_name = sanitize_text_field( wp_strip_all_tags( (string) $raw_display ) );
	$display_name = trim( ltrim( $display_name, "=+-@\t\r " ) );
	if ( empty( $display_name ) ) {
		$display_name = sanitize_user( $user->user_login );
	}
	if ( function_exists( 'mb_substr' ) ) {
		$display_name = mb_substr( $display_name, 0, 60, 'UTF-8' );
	} else {
		$display_name = substr( $display_name, 0, 60 );
	}

	$saved_progress = get_user_meta( $user_id, 'math_knight_save_data', true );
	if ( ! is_array( $saved_progress ) ) {
		$saved_progress = null;
	}

	return array(
		'isLoggedIn'    => true,
		'userId'        => $user_id,
		'userToken'     => wp_hash( 'mk_uid_' . $user_id ),
		'userLogin'     => sanitize_user( $user->user_login ),
		'displayName'   => $display_name,
		'highScore'     => $best_score,
		'savedProgress' => $saved_progress,
	);
}

/**
 * Nạp các class thành phần trong thư mục includes/.
 */
require_once MK_PLUGIN_DIR . 'includes/class-mk-activator.php';
require_once MK_PLUGIN_DIR . 'includes/class-mk-rest-api.php';
require_once MK_PLUGIN_DIR . 'includes/class-mk-admin.php';
require_once MK_PLUGIN_DIR . 'includes/class-mk-shortcode-block.php';
require_once MK_PLUGIN_DIR . 'includes/class-mk-github-updater.php';

/**
 * Đăng ký hook chạy khi kích hoạt Plugin:
 * Tạo bảng {prefix}math_knight_scores, cấu hình mặc định và dữ liệu mẫu.
 */
register_activation_hook( __FILE__, array( 'MK_Activator', 'activate' ) );

/**
 * Lớp khởi chạy chính của Plugin Hiệp Sĩ Toán Học.
 */
final class Math_Knight_Plugin {

	/**
	 * Thể hiện duy nhất (Singleton instance).
	 *
	 * @var Math_Knight_Plugin|null
	 */
	private static $instance = null;

	/**
	 * Lấy thể hiện duy nhất của lớp.
	 *
	 * @return Math_Knight_Plugin
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Khởi tạo các hooks và thành phần của Plugin.
	 */
	private function __construct() {
		// Kiểm tra đảm bảo DB đã được khởi tạo nếu cập nhật phiên bản.
		add_action( 'plugins_loaded', array( $this, 'check_db_version' ) );

		// Đăng ký tài nguyên Frontend/Editor scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_frontend_assets' ), 5 );

		// Khởi tạo các module con.
		MK_REST_API::init();
		MK_Admin::init();
		MK_Shortcode_Block::init();
		MK_GitHub_Updater::init();

		// Thêm liên kết "Cài đặt & Bảng điểm" nhanh tại trang Quản lý Plugins.
		add_filter( 'plugin_action_links_' . MK_PLUGIN_BASENAME, array( $this, 'add_plugin_action_links' ) );
	}

	/**
	 * Đảm bảo bảng dữ liệu và cấu hình luôn tồn tại khi nâng cấp plugin.
	 */
	public function check_db_version() {
		$installed_ver = get_option( 'math_knight_db_version', '' );
		if ( MK_DB_VERSION !== $installed_ver ) {
			MK_Activator::activate();
		}
	}

	/**
	 * Đăng ký (register) và truyền biến môi trường cho bộ script Game.
	 * Script chỉ thực sự được tải (enqueue) ở trang có chứa Shortcode, Block
	 * hoặc thẻ <math-knight-game> để tối ưu tốc độ tải trang cho toàn website.
	 */
	public function register_frontend_assets() {
		$dependencies = array();

		// Nếu có file dữ liệu minh họa SGK (assets/js/sgk-assets.js), đăng ký làm dependency trước.
		$sgk_assets_path = MK_PLUGIN_DIR . 'assets/js/sgk-assets.js';
		if ( file_exists( $sgk_assets_path ) ) {
			wp_register_script(
				'math-knight-sgk-assets',
				MK_PLUGIN_URL . 'assets/js/sgk-assets.js',
				array(),
				MK_PLUGIN_VERSION,
				true
			);
			$dependencies[] = 'math-knight-sgk-assets';
		}

		// Đăng ký bundle chính của trò chơi.
		wp_register_script(
			'math-knight-bundle',
			MK_PLUGIN_URL . 'assets/js/math-knight-bundle.js',
			$dependencies,
			MK_PLUGIN_VERSION,
			true
		);

		// Truyền biến toàn cục window.MathKnightWPConfig sang JavaScript.
		$localized_config = array(
			'restUrl'      => esc_url_raw( rest_url( 'math-knight/v1/' ) ),
			'nonce'        => wp_create_nonce( 'wp_rest' ),
			'pluginUrl'    => esc_url_raw( MK_PLUGIN_URL ),
			'sgkImagesUrl' => esc_url_raw( MK_PLUGIN_URL . 'assets/images/sgk/' ),
			'settings'     => mk_get_settings(),
			'currentUser'  => mk_get_current_user_payload(),
		);

		wp_localize_script(
			'math-knight-bundle',
			'MathKnightWPConfig',
			$localized_config
		);

		// Tự động enqueue nếu nội dung bài viết hiện tại có chứa thẻ <math-knight-game> trực tiếp.
		if ( is_singular() ) {
			global $post;
			if ( $post instanceof WP_Post && (
				has_shortcode( $post->post_content, 'hiep_si_toan_hoc' ) ||
				has_block( 'math-knight/game-block', $post ) ||
				false !== strpos( $post->post_content, '<math-knight-game' )
			) ) {
				self::enqueue_game_scripts();
			}
		}
	}

	/**
	 * Hàm gọi tải (enqueue) toàn bộ script của game khi Shortcode hoặc Block được render.
	 */
	public static function enqueue_game_scripts() {
		if ( wp_script_is( 'math-knight-sgk-assets', 'registered' ) ) {
			wp_enqueue_script( 'math-knight-sgk-assets' );
		}
		wp_enqueue_script( 'math-knight-bundle' );
	}

	/**
	 * Thêm liên kết nhanh vào dòng Plugin trong trang Plugins của WP Admin.
	 *
	 * @param array $links Mảng các thẻ a liên kết mặc định.
	 * @return array
	 */
	public function add_plugin_action_links( $links ) {
		$settings_link = sprintf(
			'<a href="%s" style="font-weight:600;color:#2271b1;">%s</a>',
			esc_url( admin_url( 'admin.php?page=hiep-si-toan-hoc&tab=settings' ) ),
			esc_html__( 'Cài đặt & Bảng điểm', 'hiep-si-toan-hoc' )
		);
		$author_link = sprintf(
			'<a href="%s" style="font-weight:600;color:#007a33;">%s</a>',
			esc_url( admin_url( 'admin.php?page=hiep-si-toan-hoc&tab=author' ) ),
			esc_html__( 'Thông tin Tác Giả', 'hiep-si-toan-hoc' )
		);
		array_unshift( $links, $settings_link, $author_link );
		return $links;
	}
}

// Khởi chạy Plugin.
Math_Knight_Plugin::get_instance();

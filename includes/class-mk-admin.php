<?php
/**
 * Trang Quản trị WordPress Admin cho Plugin Hiệp Sĩ Toán Học.
 *
 * Bố cục khoa học gồm 4 Tab chuyên biệt (Design System Techshare VN):
 *  - Tab 1 (settings)    : ⚙️ Cài Đặt Trò Chơi & Mã Nhúng Nhanh (Layout 2 cột phẳng, gọn gàng).
 *  - Tab 2 (leaderboard) : 🏆 Bảng Vàng & Thống Kê (4 thẻ KPI, Bảng điểm Top 50, Xuất CSV UTF-8 BOM, Đặt lại điểm).
 *  - Tab 3 (updater)     : 🔄 Cập Nhật GitHub (Kiểm tra & cập nhật trực tiếp từ gói Release .zip trên GitHub).
 *  - Tab 4 (author)      : ℹ️ Thông tin Tác Giả (Techshare VN - Trần Vĩ Thành & hộp Shortcode).
 *
 * @package HiepSiToanHoc
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MK_Admin
 */
class MK_Admin {

	/**
	 * Slug của trang quản trị.
	 *
	 * @var string
	 */
	const PAGE_SLUG = 'hiep-si-toan-hoc';

	/**
	 * Đăng ký các hooks trong khu vực WP Admin.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_admin_menus' ) );
		add_action( 'admin_init', array( __CLASS__, 'handle_admin_actions' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );
	}

	/**
	 * Đăng ký Menu Quản trị:
	 * 1. Menu cấp cao nhất "Hiệp Sĩ Toán 3" (icon dashicons-awards) giúp giáo viên dễ tìm.
	 * 2. Menu trong "Cài đặt -> Hiệp Sĩ Toán Học" đúng chuẩn WordPress Settings.
	 */
	public static function register_admin_menus() {
		add_menu_page(
			__( 'Hiệp Sĩ Toán Học Lớp 3', 'hiep-si-toan-hoc' ),
			__( 'Hiệp Sĩ Toán Học Lớp 3', 'hiep-si-toan-hoc' ),
			'manage_options',
			self::PAGE_SLUG,
			array( __CLASS__, 'render_admin_page' ),
			'dashicons-awards',
			58
		);

		add_options_page(
			__( 'Hiệp Sĩ Toán Học Lớp 3', 'hiep-si-toan-hoc' ),
			__( 'Hiệp Sĩ Toán Học Lớp 3', 'hiep-si-toan-hoc' ),
			'manage_options',
			self::PAGE_SLUG,
			array( __CLASS__, 'render_admin_page' )
		);
	}

	/**
	 * Tải file CSS trang quản trị khi đang ở đúng trang cài đặt của Plugin.
	 *
	 * @param string $hook_suffix Tên hook của trang Admin hiện tại.
	 */
	public static function enqueue_admin_assets( $hook_suffix ) {
		if ( false === strpos( $hook_suffix, self::PAGE_SLUG ) ) {
			return;
		}

		$css_path = MK_PLUGIN_DIR . 'assets/css/admin-style.css';
		$css_ver  = file_exists( $css_path ) ? MK_PLUGIN_VERSION . '.' . filemtime( $css_path ) : MK_PLUGIN_VERSION;

		wp_enqueue_style(
			'math-knight-admin-v2',
			MK_PLUGIN_URL . 'assets/css/admin-style.css',
			array(),
			$css_ver
		);
	}

	/**
	 * Xử lý các hành động POST/GET từ giáo viên (Lưu cài đặt, Xuất CSV, Xóa/Đặt lại bảng điểm, Kiểm tra cập nhật GitHub).
	 * Tất cả đều kiểm tra quyền `current_user_can('manage_options')` và Nonce `check_admin_referer`.
	 */
	public static function handle_admin_actions() {
		if ( ! is_admin() || ! isset( $_REQUEST['mk_action'] ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Bạn không có quyền thực hiện thao tác này.', 'hiep-si-toan-hoc' ), 403 );
		}

		$action = sanitize_key( wp_unslash( $_REQUEST['mk_action'] ) );

		// 1. Lưu cấu hình Game.
		if ( 'save_settings' === $action && isset( $_POST['mk_settings_nonce'] ) ) {
			check_admin_referer( 'mk_save_settings_action', 'mk_settings_nonce' );

			$raw_book_mode     = isset( $_POST['default_book_mode'] ) ? sanitize_key( wp_unslash( $_POST['default_book_mode'] ) ) : 'all';
			$default_book_mode = in_array( $raw_book_mode, array( 'all', 'tap1', 'tap2' ), true ) ? $raw_book_mode : 'all';

			$questions_per_stage = isset( $_POST['questions_per_stage'] ) ? absint( $_POST['questions_per_stage'] ) : 8;
			$questions_per_stage = max( 5, min( 15, $questions_per_stage ) );

			$timer_enabled = ! empty( $_POST['timer_enabled'] );

			$time_per_question = isset( $_POST['time_per_question'] ) ? absint( $_POST['time_per_question'] ) : 30;
			$time_per_question = max( 15, min( 60, $time_per_question ) );

			$initial_lives = isset( $_POST['initial_lives'] ) ? absint( $_POST['initial_lives'] ) : 3;
			$initial_lives = max( 1, min( 5, $initial_lives ) );

			$enable_sgk_images  = ! empty( $_POST['enable_sgk_images'] );
			$fullscreen_button  = ! empty( $_POST['fullscreen_button'] );
			$allow_guest_scores = ! empty( $_POST['allow_guest_scores'] );

			$valid_topics   = array( 'num', 'geo', 'word', 'stat' );
			$enabled_topics = array();
			if ( ! empty( $_POST['enabled_topics'] ) && is_array( $_POST['enabled_topics'] ) ) {
				$raw_topics = array_map( 'sanitize_key', wp_unslash( $_POST['enabled_topics'] ) );
				foreach ( $raw_topics as $topic ) {
					if ( in_array( $topic, $valid_topics, true ) ) {
						$enabled_topics[] = $topic;
					}
				}
			}
			// Đảm bảo ít nhất 1 phân môn được bật (nếu bỏ chọn hết thì bật mặc định cả 4).
			if ( empty( $enabled_topics ) ) {
				$enabled_topics = $valid_topics;
			}

			$new_settings = array(
				'default_book_mode'   => $default_book_mode,
				'questions_per_stage' => $questions_per_stage,
				'timer_enabled'       => $timer_enabled,
				'time_per_question'   => $time_per_question,
				'initial_lives'       => $initial_lives,
				'enable_sgk_images'   => $enable_sgk_images,
				'fullscreen_button'   => $fullscreen_button,
				'enabled_topics'      => $enabled_topics,
				'allow_guest_scores'  => $allow_guest_scores,
			);

			update_option( 'math_knight_settings', $new_settings );

			wp_safe_redirect(
				add_query_arg(
					array(
						'page'       => self::PAGE_SLUG,
						'tab'        => 'settings',
						'mk_updated' => 'settings_saved',
					),
					admin_url( 'admin.php' )
				)
			);
			exit;
		}

		// 2. Xuất bảng xếp hạng ra file CSV chuẩn UTF-8 (có BOM để mở bằng Microsoft Excel tiếng Việt không lỗi font).
		if ( 'export_csv' === $action ) {
			check_admin_referer( 'mk_export_csv_action', 'mk_nonce' );
			self::export_scores_csv();
			exit;
		}

		// 3. Xóa toàn bộ bảng điểm hoặc Đặt lại dữ liệu mẫu SGK.
		if ( 'reset_scores' === $action && isset( $_POST['mk_reset_nonce'] ) ) {
			check_admin_referer( 'mk_reset_scores_action', 'mk_reset_nonce' );

			global $wpdb;
			$table_name = MK_Activator::get_table_name();

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$wpdb->query( "TRUNCATE TABLE {$table_name}" );

			$reseed = ! empty( $_POST['reseed_sample'] );
			if ( $reseed ) {
				MK_Activator::maybe_seed_sample_scores( true );
			}

			wp_safe_redirect(
				add_query_arg(
					array(
						'page'       => self::PAGE_SLUG,
						'tab'        => 'leaderboard',
						'mk_updated' => $reseed ? 'scores_reseeded' : 'scores_cleared',
					),
					admin_url( 'admin.php' )
				)
			);
			exit;
		}

		// 4. Xóa 1 dòng điểm cụ thể.
		if ( 'delete_single_score' === $action && ! empty( $_GET['score_id'] ) ) {
			check_admin_referer( 'mk_delete_single_score', 'mk_nonce' );

			global $wpdb;
			$table_name = MK_Activator::get_table_name();
			$score_id   = absint( $_GET['score_id'] );

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->delete(
				$table_name,
				array( 'id' => $score_id ),
				array( '%d' )
			);

			wp_safe_redirect(
				add_query_arg(
					array(
						'page'       => self::PAGE_SLUG,
						'tab'        => 'leaderboard',
						'mk_updated' => 'single_deleted',
					),
					admin_url( 'admin.php' )
				)
			);
			exit;
		}

		// 5. Kiểm tra bản cập nhật Release .zip mới từ GitHub.
		if ( 'check_github_update' === $action && isset( $_POST['mk_update_nonce'] ) ) {
			check_admin_referer( 'mk_check_update_action', 'mk_update_nonce' );

			delete_transient( MK_GitHub_Updater::CACHE_KEY );
			delete_site_transient( 'update_plugins' );
			MK_GitHub_Updater::get_latest_release( true );
			if ( function_exists( 'wp_clean_plugins_cache' ) ) {
				wp_clean_plugins_cache( true );
			}

			wp_safe_redirect(
				add_query_arg(
					array(
						'page'       => self::PAGE_SLUG,
						'tab'        => 'updater',
						'mk_updated' => 'update_checked',
					),
					admin_url( 'admin.php' )
				)
			);
			exit;
		}
	}

	/**
	 * Làm sạch từng ô dữ liệu trước khi xuất CSV để chống tấn công CSV Formula Injection (CWE-1236 / OWASP A05).
	 * Nếu chuỗi bắt đầu bằng '=', '+', '-', '@', Tab hoặc CR (kể cả sau khoảng trắng đầu dòng),
	 * tự động thêm dấu nháy đơn (') ở đầu để Microsoft Excel / LibreOffice Calc không thực thi công thức.
	 *
	 * @param mixed $value Giá trị ô cần xuất.
	 * @return string
	 */
	private static function sanitize_csv_cell( $value ) {
		$str     = (string) $value;
		$trimmed = ltrim( $str, " \t\r\n" );
		if ( '' !== $trimmed && in_array( $trimmed[0], array( '=', '+', '-', '@', "\t", "\r" ), true ) ) {
			return "'" . $str;
		}
		return $str;
	}

	/**
	 * Xuất toàn bộ dữ liệu bảng điểm ra file CSV có BOM UTF-8.
	 */
	private static function export_scores_csv() {
		global $wpdb;

		$table_name = MK_Activator::get_table_name();
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$rows = $wpdb->get_results(
			"SELECT id, player_name, avatar, score, stages_cleared, max_streak, accuracy, badges, game_mode, created_at FROM {$table_name} ORDER BY score DESC, created_at DESC",
			ARRAY_A
		);

		$filename = 'bang-xep-hang-hiep-si-toan-lop-3-' . gmdate( 'Y-m-d-His' ) . '.csv';

		nocache_headers();
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: DENY' );
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );

		$output = fopen( 'php://output', 'w' );
		if ( false === $output ) {
			return;
		}

		// Ghi UTF-8 BOM để Excel hiển thị tiếng Việt có dấu chính xác 100%.
		fwrite( $output, "\xEF\xBB\xBF" );

		// Dòng tiêu đề cột.
		fputcsv(
			$output,
			array(
				'Hạng',
				'ID',
				'Tên Học Sinh (Hiệp Sĩ)',
				'Nhân Vật',
				'Điểm Số',
				'Số Ải Vượt Qua (/5)',
				'Chuỗi Đúng Cao Nhất',
				'Độ Chính Xác (%)',
				'Huy Hiệu Đạt Được',
				'Chế Độ Chơi',
				'Ngày Giờ Hoàn Thành',
			)
		);

		if ( is_array( $rows ) ) {
			foreach ( $rows as $idx => $row ) {
				$avatar_label = ( 'mage' === $row['avatar'] ) ? 'Pháp Sư Pha Lê' : 'Hiệp Sĩ Kiếm Ánh Sáng';
				$raw_gmode    = $row['game_mode'] ?? 'story';
				if ( 'practice' === $raw_gmode ) {
					$mode_label = 'Luyện tập tự do';
				} elseif ( in_array( $raw_gmode, array( 'tap1', 'story_tap1' ), true ) ) {
					$mode_label = '5 Ải Tập 1 (HK1)';
				} elseif ( in_array( $raw_gmode, array( 'tap2', 'story_tap2' ), true ) ) {
					$mode_label = '5 Ải Tập 2 (HK2)';
				} elseif ( in_array( $raw_gmode, array( 'all', 'story_all' ), true ) ) {
					$mode_label = 'Tổng hợp Tập 1 & 2';
				} else {
					$mode_label = 'Cốt truyện 5 ải';
				}
				$badges_list = '';
				if ( ! empty( $row['badges'] ) ) {
					$decoded = json_decode( $row['badges'], true );
					if ( is_array( $decoded ) ) {
						$badges_list = implode( ', ', $decoded );
					}
				}

				fputcsv(
					$output,
					array(
						$idx + 1,
						(int) $row['id'],
						self::sanitize_csv_cell( $row['player_name'] ),
						self::sanitize_csv_cell( $avatar_label ),
						(int) $row['score'],
						(int) $row['stages_cleared'],
						(int) $row['max_streak'],
						(int) $row['accuracy'] . '%',
						self::sanitize_csv_cell( $badges_list ),
						self::sanitize_csv_cell( $mode_label ),
						self::sanitize_csv_cell( $row['created_at'] ),
					)
				);
			}
		}

		fclose( $output );
	}

	/**
	 * Hiển thị giao diện Trang Quản trị 4 Tab khoa học của Plugin.
	 */
	public static function render_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		global $wpdb;
		$settings      = mk_get_settings();
		$table_name    = MK_Activator::get_table_name();
		$update_status = MK_GitHub_Updater::get_release_status( false );

		// Thống kê tổng quan.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$stats = $wpdb->get_row(
			"SELECT COUNT(*) AS total_plays, COALESCE(MAX(score), 0) AS highest_score, COALESCE(ROUND(AVG(accuracy), 1), 0) AS avg_accuracy, SUM(CASE WHEN stages_cleared >= 5 THEN 1 ELSE 0 END) AS full_clears FROM {$table_name}",
			ARRAY_A
		);

		$scores = MK_REST_API::query_top_scores( 50 );

		$badge_labels = array(
			'first_blood'    => '🗡️ Tân Binh Dũng Cảm',
			'fury_hero'      => '🔥 Chiến Binh Cuồng Nộ',
			'speed_demon'    => '⚡ Tia Chớp Toán Học',
			'geo_master'     => '📐 Kiến Trúc Sư Pha Lê',
			'word_wizard'    => '📖 Nhà Thông Thái Lời Văn',
			'stat_sage'      => '📊 Bậc Thầy Thống Kê',
			'flawless_stage' => '🛡️ Hiệp Sĩ Bất Bại',
			'crystal_savior' => '👑 Huyền Thoại Rừng Pha Lê',
		);

		$topic_definitions = array(
			'num'  => array(
				'title' => 'Mạch 1: Số & Phép tính (Thung Lũng Số Học)',
				'desc'  => 'Bảng nhân chia 2–9, chia có dư, biểu thức số, số La Mã, các phép tính phạm vi 1.000, 10.000 và 100.000.',
			),
			'geo'  => array(
				'title' => 'Mạch 2: Hình học & Đo lường (Đầm Lầy Hình Học)',
				'desc'  => 'Trung điểm, hình tròn, góc vuông Ê-ke, chu vi & diện tích hình phẳng, xem đồng hồ từng phút, Tiền Việt Nam.',
			),
			'word' => array(
				'title' => 'Mạch 3: Giải toán có lời văn (Mê Cung Lời Văn)',
				'desc'  => 'Gấp lên/giảm đi một số lần, bài toán giải bằng hai bước tính gắn với Rô-bốt, Việt, Nam, Mai, Mi.',
			),
			'stat' => array(
				'title' => 'Mạch 4: Thống kê & Xác suất (Đỉnh Núi Thống Kê)',
				'desc'  => 'Bảng số liệu thống kê và nhận biết khả năng xảy ra sự kiện (Chắc chắn / Có thể / Không thể).',
			),
		);

		$export_url = wp_nonce_url(
			add_query_arg(
				array(
					'page'      => self::PAGE_SLUG,
					'mk_action' => 'export_csv',
				),
				admin_url( 'admin.php' )
			),
			'mk_export_csv_action',
			'mk_nonce'
		);

		$active_tab = isset( $_GET['tab'] ) ? sanitize_key( wp_unslash( $_GET['tab'] ) ) : 'settings';
		if ( ! in_array( $active_tab, array( 'settings', 'leaderboard', 'updater', 'author' ), true ) ) {
			$active_tab = 'settings';
		}
		$inline_css_path = MK_PLUGIN_DIR . 'assets/css/admin-style.css';
		?>
		<?php if ( file_exists( $inline_css_path ) ) : ?>
			<style id="mk-admin- critical-css">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static plugin admin stylesheet owned by plugin.
				echo file_get_contents( $inline_css_path );
				?>
			</style>
		<?php endif; ?>
		<div class="wrap mk-admin-wrap">
			<!-- Header Gọn Phẳng & Thanh Điều Hướng 4 Tab Khoa Học -->
			<div class="mk-admin-topbar">
				<div class="mk-admin-brand">
					<span class="mk-admin-brand__logo" aria-hidden="true">🛡️</span>
					<div>
						<h1 class="mk-admin-brand__title">
							Hiệp Sĩ Toán Học Lớp 3
							<span class="mk-admin-version-pill">v<?php echo esc_html( MK_PLUGIN_VERSION ); ?></span>
						</h1>
						<p class="mk-admin-brand__sub">Giải Cứu Rừng Pha Lê • Bộ sách Kết nối tri thức với cuộc sống (GDPT 2018) • 5 Ải Tập 1, 5 Ải Tập 2 &amp; Tổng hợp</p>
					</div>
				</div>
			</div>

			<nav class="mk-top-tabs" aria-label="Menu quản trị Hiệp Sĩ Toán Học">
				<a
					href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=settings' ) ); ?>"
					class="mk-top-tab <?php echo 'settings' === $active_tab ? 'is-active' : ''; ?>"
					data-mk-tab="settings"
				>
					<span class="mk-top-tab__icon">⚙️</span>
					<span>Cài Đặt Trò Chơi</span>
				</a>
				<a
					href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=leaderboard' ) ); ?>"
					class="mk-top-tab <?php echo 'leaderboard' === $active_tab ? 'is-active' : ''; ?>"
					data-mk-tab="leaderboard"
				>
					<span class="mk-top-tab__icon">🏆</span>
					<span>Bảng Vàng &amp; Thống Kê</span>
					<span class="mk-top-tab__count"><?php echo esc_html( number_format_i18n( (int) ( $stats['total_plays'] ?? 0 ) ) ); ?></span>
				</a>
				<a
					href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=updater' ) ); ?>"
					class="mk-top-tab <?php echo 'updater' === $active_tab ? 'is-active' : ''; ?>"
					data-mk-tab="updater"
				>
					<span class="mk-top-tab__icon">🔄</span>
					<span>Cập Nhật GitHub</span>
					<?php if ( ! empty( $update_status['has_update'] ) ) : ?>
						<span class="mk-top-tab__badge-new">Mới</span>
					<?php endif; ?>
				</a>
				<a
					href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=author' ) ); ?>"
					class="mk-top-tab <?php echo 'author' === $active_tab ? 'is-active' : ''; ?>"
					data-mk-tab="author"
				>
					<i class="mk-top-tab__info-badge">i</i>
					<span>Thông tin Tác Giả</span>
				</a>
			</nav>

			<?php if ( ! empty( $_GET['mk_updated'] ) ) : ?>
				<?php $notice_type = sanitize_key( wp_unslash( $_GET['mk_updated'] ) ); ?>
				<div class="notice notice-success is-dismissible mk-admin-notice">
					<p>
						<?php
						if ( 'settings_saved' === $notice_type ) {
							esc_html_e( '✅ Đã lưu cấu hình trò chơi Hiệp Sĩ Toán Học thành công!', 'hiep-si-toan-hoc' );
						} elseif ( 'scores_cleared' === $notice_type ) {
							esc_html_e( '🧹 Đã xóa trống toàn bộ Bảng xếp hạng thành công.', 'hiep-si-toan-hoc' );
						} elseif ( 'scores_reseeded' === $notice_type ) {
							esc_html_e( '✨ Đã đặt lại Bảng xếp hạng về 5 nhân vật mẫu SGK Kết nối tri thức.', 'hiep-si-toan-hoc' );
						} elseif ( 'single_deleted' === $notice_type ) {
							esc_html_e( '🗑️ Đã xóa bản ghi điểm đã chọn.', 'hiep-si-toan-hoc' );
						} elseif ( 'update_checked' === $notice_type ) {
							esc_html_e( '🔄 Đã kiểm tra thông tin bản phát hành (Release ZIP) mới nhất từ GitHub thành công.', 'hiep-si-toan-hoc' );
						}
						?>
					</p>
				</div>
			<?php endif; ?>

			<!-- ================================================================
			     TAB 1: CÀI ĐẶT TRÒ CHƠI & MÃ NHÚNG NHANH (LAYOUT 2 CỘT KHOA HỌC)
			     ================================================================ -->
			<div id="mk-panel-settings" class="mk-tab-panel <?php echo 'settings' === $active_tab ? 'is-active' : ''; ?>">
				<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=settings' ) ); ?>">
					<input type="hidden" name="mk_action" value="save_settings" />
					<?php wp_nonce_field( 'mk_save_settings_action', 'mk_settings_nonce' ); ?>

					<div class="mk-settings-grid-2col">
						<!-- CỘT TRÁI: THIẾT LẬP LỘ TRÌNH & THÔNG SỐ GAME -->
						<div class="mk-card">
							<div class="mk-card__header">
								<h2>⚙️ Thiết lập Lộ trình &amp; Thông số Trò chơi</h2>
								<p>Tùy chỉnh bộ sách mặc định, độ khó và các tiện ích hỗ trợ học sinh lớp 3.</p>
							</div>
							<div class="mk-card__body">
								<!-- Chọn Bộ sách / Học kì mặc định -->
								<div class="mk-field-group">
									<label for="default_book_mode" class="mk-field-label">
										📚 Bộ sách / Học kì mặc định (3 Chế độ × 5 Ải)
									</label>
									<select id="default_book_mode" name="default_book_mode" class="mk-select-full">
										<option value="all" <?php selected( $settings['default_book_mode'], 'all' ); ?>>
											🌟 Tổng hợp cả Tập 1 &amp; Tập 2 (5 Ải Cả năm: Bài 1 → Bài 81)
										</option>
										<option value="tap1" <?php selected( $settings['default_book_mode'], 'tap1' ); ?>>
											📗 5 Ải SGK Toán 3 Tập 1 (Học kì 1: Bài 1 → Bài 44)
										</option>
										<option value="tap2" <?php selected( $settings['default_book_mode'], 'tap2' ); ?>>
											📘 5 Ải SGK Toán 3 Tập 2 (Học kì 2: Bài 45 → Bài 81)
										</option>
									</select>
									<span class="mk-field-hint">
										Học sinh có thể chuyển đổi linh hoạt giữa Tập 1, Tập 2 và Tổng hợp ngay trên màn hình chính, hoặc giáo viên ghim cố định từng học kì qua tham số <code>book="tap1|tap2|all"</code>.
									</span>
								</div>

								<!-- Hàng 3 ô số: Số câu / Thời gian / Số Tim -->
								<div class="mk-number-row-3col">
									<div class="mk-number-box">
										<label for="questions_per_stage">📝 Số câu mỗi ải</label>
										<div class="mk-number-input-wrap">
											<input
												type="number"
												id="questions_per_stage"
												name="questions_per_stage"
												value="<?php echo esc_attr( $settings['questions_per_stage'] ); ?>"
												min="5"
												max="15"
												step="1"
											/>
											<span>câu (5–15)</span>
										</div>
										<small>Mặc định: 8 câu + 1 Boss</small>
									</div>

									<div class="mk-number-box">
										<label for="time_per_question">⏱️ Thời gian / câu</label>
										<div class="mk-number-input-wrap">
											<input
												type="number"
												id="time_per_question"
												name="time_per_question"
												value="<?php echo esc_attr( $settings['time_per_question'] ); ?>"
												min="15"
												max="60"
												step="5"
											/>
											<span>giây (15–60)</span>
										</div>
										<small>Mặc định: 30 giây/câu</small>
									</div>

									<div class="mk-number-box">
										<label for="initial_lives">❤️ Số Tim mỗi ải</label>
										<div class="mk-number-input-wrap">
											<input
												type="number"
												id="initial_lives"
												name="initial_lives"
												value="<?php echo esc_attr( $settings['initial_lives'] ); ?>"
												min="1"
												max="5"
												step="1"
											/>
											<span>Tim (1–5)</span>
										</div>
										<small>Mất Tim không trừ oan %</small>
									</div>
								</div>

								<!-- Danh sách 4 công tắc tùy chọn -->
								<div class="mk-switch-list">
									<label class="mk-switch-row">
										<input
											type="checkbox"
											name="timer_enabled"
											value="1"
											<?php checked( $settings['timer_enabled'], true ); ?>
										/>
										<div class="mk-switch-row__text">
											<strong>⏱️ Bật đồng hồ đếm ngược mỗi câu hỏi</strong>
											<span>Khuyến khích phản xạ tính nhẩm nhanh và cộng điểm thưởng tốc độ.</span>
										</div>
									</label>

									<label class="mk-switch-row">
										<input
											type="checkbox"
											name="fullscreen_button"
											value="1"
											<?php checked( ! empty( $settings['fullscreen_button'] ), true ); ?>
										/>
										<div class="mk-switch-row__text">
											<strong>⛶ Hiển thị nút Toàn màn hình &amp; Phím tắt <code>F</code></strong>
											<span>Rất tiện khi giáo viên trình chiếu lên Tivi thông minh / Máy chiếu trên lớp (bấm <code>ESC</code> để thu nhỏ).</span>
										</div>
									</label>

									<label class="mk-switch-row">
										<input
											type="checkbox"
											name="enable_sgk_images"
											value="1"
											<?php checked( $settings['enable_sgk_images'], true ); ?>
										/>
										<div class="mk-switch-row__text">
											<strong>🖼️ Hiển thị hình minh họa gốc SGK Kết nối tri thức</strong>
											<span>Đính kèm tranh cắt gốc từ SGK Toán 3 (Rô-bốt, Việt, Nam, Mai, Mi) và trích dẫn trang sách.</span>
										</div>
									</label>

									<label class="mk-switch-row">
										<input
											type="checkbox"
											name="allow_guest_scores"
											value="1"
											<?php checked( $settings['allow_guest_scores'], true ); ?>
										/>
										<div class="mk-switch-row__text">
											<strong>🏆 Cho phép học sinh lưu điểm không cần tài khoản WordPress</strong>
											<span>Học sinh nhập tên trực tiếp trong game để ghi danh lên Bảng Vàng toàn trường (có chống spam).</span>
										</div>
									</label>
								</div>
							</div>

							<div class="mk-card__footer">
								<button type="submit" class="button button-primary button-hero">
									💾 Lưu Cấu Hình Trò Chơi
								</button>
							</div>
						</div>

						<!-- CỘT PHẢI: 4 MẠCH KIẾN THỨC & MÃ NHÚNG SHORTCODE NHANH -->
						<div class="mk-col-stack">
							<div class="mk-card">
								<div class="mk-card__header">
									<h2>🧩 4 Mạch Kiến Thức Toán Lớp 3 Kích Hoạt</h2>
									<p>Chọn các phân môn xuất hiện trong chế độ Luyện tập và Tổng hợp.</p>
								</div>
								<div class="mk-card__body">
									<fieldset class="mk-topics-fieldset">
										<?php foreach ( $topic_definitions as $topic_key => $topic_meta ) : ?>
											<label class="mk-topic-item">
												<input
													type="checkbox"
													name="enabled_topics[]"
													value="<?php echo esc_attr( $topic_key ); ?>"
													<?php checked( in_array( $topic_key, $settings['enabled_topics'], true ) ); ?>
												/>
												<div>
													<strong><?php echo esc_html( $topic_meta['title'] ); ?></strong>
													<span><?php echo esc_html( $topic_meta['desc'] ); ?></span>
												</div>
											</label>
										<?php endforeach; ?>
									</fieldset>
								</div>
							</div>

							<div class="mk-card">
								<div class="mk-card__header">
									<h2>🚀 Mã Nhúng Nhanh (Shortcode &amp; Gutenberg Block)</h2>
									<p>Sao chép mã nhúng dán vào bất kỳ Trang (Page) hoặc Bài giảng nào.</p>
								</div>
								<div class="mk-embed-guide">
									<div class="mk-embed-item">
										<span class="mk-embed-item__title">1. Nhúng 5 Ải Tập 1 (Học kì 1: Bài 1 → Bài 44)</span>
										<div class="mk-code-box">
											<code>[hiep_si_toan_hoc book="tap1"]</code>
											<button type="button" class="button button-small" onclick="navigator.clipboard.writeText('[hiep_si_toan_hoc book=&quot;tap1&quot;]');this.innerText='Đã chép!';">Sao chép</button>
										</div>
									</div>

									<div class="mk-embed-item">
										<span class="mk-embed-item__title">2. Nhúng 5 Ải Tập 2 (Học kì 2: Bài 45 → Bài 81)</span>
										<div class="mk-code-box">
											<code>[hiep_si_toan_hoc book="tap2"]</code>
											<button type="button" class="button button-small" onclick="navigator.clipboard.writeText('[hiep_si_toan_hoc book=&quot;tap2&quot;]');this.innerText='Đã chép!';">Sao chép</button>
										</div>
									</div>

									<div class="mk-embed-item">
										<span class="mk-embed-item__title">3. Nhúng Chế độ Tổng hợp Cả năm (Tập 1 + Tập 2)</span>
										<div class="mk-code-box">
											<code>[hiep_si_toan_hoc book="all"]</code>
											<button type="button" class="button button-small" onclick="navigator.clipboard.writeText('[hiep_si_toan_hoc book=&quot;all&quot;]');this.innerText='Đã chép!';">Sao chép</button>
										</div>
									</div>

									<div class="mk-embed-item">
										<span class="mk-embed-item__title">4. Luyện tập riêng 1 Ải / Thẻ HTML Web Component</span>
										<div class="mk-code-box">
											<code>[hiep_si_toan_hoc book="tap2" mode="practice" stage="2" questions="10"]</code>
											<button type="button" class="button button-small" onclick="navigator.clipboard.writeText('[hiep_si_toan_hoc book=&quot;tap2&quot; mode=&quot;practice&quot; stage=&quot;2&quot; questions=&quot;10&quot;]');this.innerText='Đã chép!';">Sao chép</button>
										</div>
										<small>Hoặc chọn khối <strong>"Hiệp Sĩ Toán Học (Game Toán Lớp 3)"</strong> trong Gutenberg Block Editor.</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div><!-- /#mk-panel-settings -->

			<!-- ================================================================
			     TAB 2: BẢNG VÀNG & THỐNG KÊ HỌC SINH
			     ================================================================ -->
			<div id="mk-panel-leaderboard" class="mk-tab-panel <?php echo 'leaderboard' === $active_tab ? 'is-active' : ''; ?>">
				<!-- 4 Thẻ KPI Thống Kê Nhanh -->
				<div class="mk-stats-grid">
					<div class="mk-stat-card">
						<div class="mk-stat-card__icon">🎮</div>
						<div class="mk-stat-card__info">
							<span class="mk-stat-card__label">Tổng Lượt Ghi Danh</span>
							<strong class="mk-stat-card__value"><?php echo esc_html( number_format_i18n( (int) ( $stats['total_plays'] ?? 0 ) ) ); ?></strong>
						</div>
					</div>
					<div class="mk-stat-card">
						<div class="mk-stat-card__icon">🏆</div>
						<div class="mk-stat-card__info">
							<span class="mk-stat-card__label">Điểm Kỷ Lục Cao Nhất</span>
							<strong class="mk-stat-card__value"><?php echo esc_html( number_format_i18n( (int) ( $stats['highest_score'] ?? 0 ) ) ); ?></strong>
						</div>
					</div>
					<div class="mk-stat-card">
						<div class="mk-stat-card__icon">🎯</div>
						<div class="mk-stat-card__info">
							<span class="mk-stat-card__label">Độ Chính Xác Trung Bình</span>
							<strong class="mk-stat-card__value"><?php echo esc_html( ( $stats['avg_accuracy'] ?? 0 ) . '%' ); ?></strong>
						</div>
					</div>
					<div class="mk-stat-card">
						<div class="mk-stat-card__icon">💎</div>
						<div class="mk-stat-card__info">
							<span class="mk-stat-card__label">Hiệp Sĩ Phá Đảo Đủ 5 Ải</span>
							<strong class="mk-stat-card__value"><?php echo esc_html( number_format_i18n( (int) ( $stats['full_clears'] ?? 0 ) ) ); ?></strong>
						</div>
					</div>
				</div>

				<!-- Bảng Xếp Hạng Top 50 & Xuất Báo Cáo CSV -->
				<div class="mk-card mk-leaderboard-card">
					<div class="mk-card__header mk-card__header--flex">
						<div>
							<h2>🏆 Bảng Xếp Hạng Hiệp Sĩ Nhí Toàn Trường</h2>
							<p>Danh sách Top 50 lượt chơi có điểm số cao nhất được đồng bộ qua WordPress REST API.</p>
						</div>
						<div class="mk-leaderboard-actions">
							<a href="<?php echo esc_url( $export_url ); ?>" class="button button-primary">
								📥 Xuất Báo Cáo Excel (CSV)
							</a>
						</div>
					</div>

					<div class="mk-table-responsive">
						<table class="wp-list-table widefat striped mk-scores-table">
							<thead>
								<tr>
									<th class="mk-col-rank">Hạng</th>
									<th class="mk-col-player">Tên Học Sinh (Hiệp Sĩ)</th>
									<th class="mk-col-avatar">Nhân Vật</th>
									<th class="mk-col-score">Điểm Số</th>
									<th class="mk-col-stage">Ải Vượt Qua</th>
									<th class="mk-col-streak">Chuỗi Đúng</th>
									<th class="mk-col-acc">Độ Chính Xác</th>
									<th class="mk-col-badges">Huy Hiệu Đạt Được</th>
									<th class="mk-col-time">Thời Gian</th>
									<th class="mk-col-action">Thao Tác</th>
								</tr>
							</thead>
							<tbody>
								<?php if ( empty( $scores ) ) : ?>
									<tr>
										<td colspan="10" class="mk-empty-row">
											Chưa có dữ liệu điểm số nào. Hãy bấm nút <strong>"Khôi phục 5 nhân vật mẫu SGK"</strong> bên dưới hoặc mời học sinh bắt đầu chơi!
										</td>
									</tr>
								<?php else : ?>
									<?php foreach ( $scores as $item ) : ?>
										<?php
										$delete_url = wp_nonce_url(
											add_query_arg(
												array(
													'page'      => self::PAGE_SLUG,
													'tab'       => 'leaderboard',
													'mk_action' => 'delete_single_score',
													'score_id'  => $item['id'],
												),
												admin_url( 'admin.php' )
											),
											'mk_delete_single_score',
											'mk_nonce'
										);
										?>
										<tr>
											<td>
												<?php if ( 1 === $item['rank'] ) : ?>
													<span class="mk-rank-badge mk-rank-1">🥇 #1</span>
												<?php elseif ( 2 === $item['rank'] ) : ?>
													<span class="mk-rank-badge mk-rank-2">🥈 #2</span>
												<?php elseif ( 3 === $item['rank'] ) : ?>
													<span class="mk-rank-badge mk-rank-3">🥉 #3</span>
												<?php else : ?>
													<span class="mk-rank-badge">#<?php echo esc_html( $item['rank'] ); ?></span>
												<?php endif; ?>
											</td>
											<td>
												<?php
												$raw_item_mode = $item['game_mode'] ?? 'story';
												if ( 'practice' === $raw_item_mode ) {
													$item_mode_pill = 'Luyện tập';
												} elseif ( in_array( $raw_item_mode, array( 'tap1', 'story_tap1' ), true ) ) {
													$item_mode_pill = '📗 Tập 1';
												} elseif ( in_array( $raw_item_mode, array( 'tap2', 'story_tap2' ), true ) ) {
													$item_mode_pill = '📘 Tập 2';
												} elseif ( in_array( $raw_item_mode, array( 'all', 'story_all' ), true ) ) {
													$item_mode_pill = '🌟 Tổng hợp';
												} else {
													$item_mode_pill = 'Cốt truyện';
												}
												?>
												<strong class="mk-player-name"><?php echo esc_html( $item['player_name'] ); ?></strong>
												<span class="mk-mode-pill"><?php echo esc_html( $item_mode_pill ); ?></span>
												<?php if ( ! empty( $item['user_id'] ) && (int) $item['user_id'] > 0 ) : ?>
													<span class="mk-mode-pill" style="background:#dcfce7;color:#166534;border-color:#86efac;">👤 User #<?php echo esc_html( (int) $item['user_id'] ); ?></span>
												<?php endif; ?>
											</td>
											<td>
												<?php if ( 'mage' === $item['avatar'] ) : ?>
													<span class="mk-avatar-tag mk-avatar-mage">🔮 Pháp Sư Pha Lê</span>
												<?php else : ?>
													<span class="mk-avatar-tag mk-avatar-knight">⚔️ Hiệp Sĩ Kiếm</span>
												<?php endif; ?>
											</td>
											<td>
												<strong class="mk-score-num"><?php echo esc_html( number_format_i18n( $item['score'] ) ); ?></strong>
											</td>
											<td>
												<span class="mk-stage-progress"><?php echo esc_html( $item['stages_cleared'] ); ?> / 5 ải</span>
											</td>
											<td>
												<span>🔥 <?php echo esc_html( $item['max_streak'] ); ?> câu</span>
											</td>
											<td>
												<span class="mk-accuracy-pill"><?php echo esc_html( $item['accuracy'] ); ?>%</span>
											</td>
											<td>
												<?php if ( ! empty( $item['badges'] ) && is_array( $item['badges'] ) ) : ?>
													<div class="mk-badges-wrap">
														<?php foreach ( $item['badges'] as $badge_code ) : ?>
															<span class="mk-badge-chip" title="<?php echo esc_attr( $badge_labels[ $badge_code ] ?? $badge_code ); ?>">
																<?php echo esc_html( $badge_labels[ $badge_code ] ?? $badge_code ); ?>
															</span>
														<?php endforeach; ?>
													</div>
												<?php else : ?>
													<span class="description">—</span>
												<?php endif; ?>
											</td>
											<td>
												<?php echo esc_html( $item['date_formatted'] ); ?>
											</td>
											<td>
												<a
													href="<?php echo esc_url( $delete_url ); ?>"
													class="button button-small mk-btn-danger-link"
													onclick="return confirm('Bạn có chắc chắn muốn xóa kết quả của học sinh này?');"
												>Xóa</a>
											</td>
										</tr>
									<?php endforeach; ?>
								<?php endif; ?>
							</tbody>
						</table>
					</div>

					<!-- Khu vực Đặt lại / Xóa bảng điểm -->
					<div class="mk-card__footer mk-reset-zone">
						<form
							method="post"
							action="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=leaderboard' ) ); ?>"
							onsubmit="return confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ điểm số hiện tại trên Bảng xếp hạng. Bạn có chắc chắn muốn thực hiện?');"
							class="mk-reset-form"
						>
							<input type="hidden" name="mk_action" value="reset_scores" />
							<?php wp_nonce_field( 'mk_reset_scores_action', 'mk_reset_nonce' ); ?>

							<label class="mk-toggle-label">
								<input type="checkbox" name="reseed_sample" value="1" checked="checked" />
								<span>Đồng thời khôi phục 5 nhân vật mẫu SGK (<em>Rô-bốt Thông Thái, Pháp Sư Mai, Hiệp Sĩ Nam, Dũng Sĩ Việt, Bé Mi Tinh Anh</em>)</span>
							</label>

							<button type="submit" class="button mk-btn-danger">
								🗑️ Xóa / Đặt Lại Bảng Điểm
							</button>
						</form>
					</div>
				</div>
			</div><!-- /#mk-panel-leaderboard -->

			<!-- ================================================================
			     TAB 3: CẬP NHẬT TỰ ĐỘNG TỪ GITHUB RELEASES (CHỈ BẢN RELEASE .ZIP)
			     ================================================================ -->
			<div id="mk-panel-updater" class="mk-tab-panel <?php echo 'updater' === $active_tab ? 'is-active' : ''; ?>">
				<div class="mk-updater-wrap">
					<div class="mk-card mk-updater-card">
						<div class="mk-card__header mk-card__header--flex">
							<div>
								<h2>🔄 Cập Nhật Trực Tiếp Từ GitHub Releases</h2>
								<p>Tự động kiểm tra và nâng cấp Plugin trong WordPress Admin chỉ từ gói phát hành chính thức (<code><?php echo esc_html( MK_GitHub_Updater::ASSET_ZIP_NAME ); ?></code>).</p>
							</div>
							<span class="mk-updater-safe-badge">🔒 Chỉ nhận Release .ZIP</span>
						</div>

						<div class="mk-card__body">
							<div class="mk-updater-status-grid">
								<div class="mk-updater-version-box">
									<span class="mk-updater-version-box__label">Phiên bản đang cài đặt</span>
									<strong class="mk-updater-version-box__value">v<?php echo esc_html( $update_status['current_version'] ); ?></strong>
									<small>Đang hoạt động trên trang WordPress này</small>
								</div>

								<div class="mk-updater-version-box <?php echo ! empty( $update_status['has_update'] ) ? 'is-has-update' : 'is-up-to-date'; ?>">
									<span class="mk-updater-version-box__label">Bản Release mới nhất trên GitHub</span>
									<strong class="mk-updater-version-box__value">v<?php echo esc_html( $update_status['latest_version'] ); ?></strong>
									<small>
										<?php if ( ! empty( $update_status['has_update'] ) ) : ?>
											🚀 Đã có bản phát hành mới sẵn sàng cập nhật!
										<?php elseif ( 'no_release_yet' === $update_status['error'] ) : ?>
											ℹ️ Kho GitHub chưa tạo tag Release đầu tiên
										<?php elseif ( 'missing_zip_asset' === $update_status['error'] ) : ?>
											⚠️ Bản Release chưa đính kèm file .zip trong Assets
										<?php else : ?>
											✅ Bạn đang sử dụng phiên bản mới nhất
										<?php endif; ?>
									</small>
								</div>
							</div>

							<table class="mk-ts-info-table mk-updater-meta-table" role="presentation">
								<tbody>
									<tr>
										<td class="mk-ts-label">📦 GitHub Repo</td>
										<td class="mk-ts-val">
											<a href="<?php echo esc_url( MK_GitHub_Updater::get_repo_url() ); ?>" target="_blank" rel="noopener noreferrer" class="mk-ts-link">
												<?php echo esc_html( MK_GitHub_Updater::GITHUB_OWNER . '/' . MK_GitHub_Updater::GITHUB_REPO ); ?>
											</a>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">🗜️ File Release Chuẩn</td>
										<td class="mk-ts-val">
											<code><?php echo esc_html( ! empty( $update_status['asset_name'] ) ? $update_status['asset_name'] : MK_GitHub_Updater::ASSET_ZIP_NAME ); ?></code>
											<?php if ( ! empty( $update_status['asset_size'] ) ) : ?>
												<span>(<?php echo esc_html( size_format( $update_status['asset_size'], 2 ) ); ?>)</span>
											<?php endif; ?>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">🕒 Kiểm tra lần cuối</td>
										<td class="mk-ts-val">
											<?php echo esc_html( $update_status['checked_at'] ); ?>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div class="mk-card__footer mk-updater-actions">
							<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=' . self::PAGE_SLUG . '&tab=updater' ) ); ?>" style="display:inline-block;margin:0;">
								<input type="hidden" name="mk_action" value="check_github_update" />
								<?php wp_nonce_field( 'mk_check_update_action', 'mk_update_nonce' ); ?>
								<button type="submit" class="button button-primary">
									🔄 Kiểm Tra Bản Cập Nhật Mới Từ GitHub
								</button>
							</form>

							<?php if ( ! empty( $update_status['has_update'] ) ) : ?>
								<a href="<?php echo esc_url( admin_url( 'update-core.php' ) ); ?>" class="button button-secondary">
									⚡ Đi tới Trang Cập Nhật WordPress
								</a>
							<?php endif; ?>

							<?php if ( ! empty( $update_status['download_url'] ) ) : ?>
								<a href="<?php echo esc_url( $update_status['download_url'] ); ?>" class="button" target="_blank" rel="noopener noreferrer">
									📥 Tải Gói Release (.ZIP)
								</a>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div><!-- /#mk-panel-updater -->

			<!-- ================================================================
			     TAB 4: THÔNG TIN TÁC GIẢ (TECHSHARE VN)
			     ================================================================ -->
			<div id="mk-panel-author" class="mk-tab-panel <?php echo 'author' === $active_tab ? 'is-active' : ''; ?>">
				<div class="mk-ts-author-wrap">
					<!-- Card Thông tin Tác giả Techshare VN -->
					<div class="mk-ts-author-card">
						<div class="mk-ts-avatar" aria-hidden="true">TS</div>
						<div class="mk-ts-author-body">
							<h2 class="mk-ts-author-title">Techshare VN</h2>
							<p class="mk-ts-author-subtitle">Giải pháp Web &amp; Plugin WordPress chuyên nghiệp</p>

							<table class="mk-ts-info-table" role="presentation">
								<tbody>
									<tr>
										<td class="mk-ts-label">🌐 Website</td>
										<td class="mk-ts-val">
											<a href="https://techsharevn.com" target="_blank" rel="noopener noreferrer" class="mk-ts-link">techsharevn.com</a>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">👤 Tác giả</td>
										<td class="mk-ts-val">
											<strong>Trần Vĩ Thành</strong>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">📞 Điện thoại</td>
										<td class="mk-ts-val">
											<a href="tel:0949897293" class="mk-ts-link">0949 897 293</a>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">✉️ Email</td>
										<td class="mk-ts-val">
											<a href="mailto:thanh.web1001@gmail.com" class="mk-ts-link">thanh.web1001@gmail.com</a>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">📦 Plugin</td>
										<td class="mk-ts-val">
											Hiệp Sĩ Toán Học Lớp 3 v<?php echo esc_html( MK_PLUGIN_VERSION ); ?>
										</td>
									</tr>
									<tr>
										<td class="mk-ts-label">📅 Build</td>
										<td class="mk-ts-val">
											2026 — GPL-2.0-or-later
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div><!-- /#mk-panel-author -->

			<script>
			(function() {
				var tabs = document.querySelectorAll('.mk-top-tab[data-mk-tab]');
				var panels = {
					settings: document.getElementById('mk-panel-settings'),
					leaderboard: document.getElementById('mk-panel-leaderboard'),
					updater: document.getElementById('mk-panel-updater'),
					author: document.getElementById('mk-panel-author')
				};
				if (!tabs.length) return;
				tabs.forEach(function(tab) {
					tab.addEventListener('click', function(e) {
						var targetKey = tab.getAttribute('data-mk-tab');
						if (!panels[targetKey]) return;
						e.preventDefault();
						tabs.forEach(function(t) { t.classList.toggle('is-active', t === tab); });
						Object.keys(panels).forEach(function(k) {
							if (panels[k]) {
								panels[k].classList.toggle('is-active', k === targetKey);
							}
						});
						if (window.history && window.history.replaceState) {
							window.history.replaceState(null, '', tab.getAttribute('href'));
						}
					});
				});
			})();
			</script>
		</div>
		<?php
	}
}

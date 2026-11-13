<?php
/**
 * Khởi tạo Cơ sở dữ liệu, Cấu hình mặc định và Dữ liệu mẫu khi kích hoạt Plugin.
 *
 * @package HiepSiToanHoc
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MK_Activator
 */
class MK_Activator {

	/**
	 * Thực thi khi Plugin được kích hoạt hoặc nâng cấp cấu trúc bảng.
	 */
	public static function activate() {
		self::create_scores_table();
		self::init_default_settings();
		self::maybe_seed_sample_scores();

		update_option( 'math_knight_db_version', MK_DB_VERSION );
	}

	/**
	 * Lấy tên bảng lưu điểm đầy đủ kèm tiền tố WordPress ($wpdb->prefix).
	 *
	 * @return string
	 */
	public static function get_table_name() {
		global $wpdb;
		return $wpdb->prefix . 'math_knight_scores';
	}

	/**
	 * Tạo bảng {prefix}math_knight_scores bằng hàm chuẩn dbDelta() của WordPress.
	 */
	public static function create_scores_table() {
		global $wpdb;

		$table_name      = self::get_table_name();
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$table_name} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			user_id bigint(20) unsigned DEFAULT 0,
			player_name varchar(100) NOT NULL,
			avatar varchar(20) NOT NULL DEFAULT 'knight',
			score int(11) NOT NULL DEFAULT 0,
			stages_cleared tinyint(4) NOT NULL DEFAULT 0,
			max_streak int(11) NOT NULL DEFAULT 0,
			accuracy tinyint(4) NOT NULL DEFAULT 0,
			badges text DEFAULT NULL,
			game_mode varchar(20) NOT NULL DEFAULT 'story',
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			KEY score_idx (score),
			KEY created_at_idx (created_at)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Khởi tạo cấu hình mặc định trong wp_options nếu chưa tồn tại.
	 */
	public static function init_default_settings() {
		$default_settings = array(
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

		$existing = get_option( 'math_knight_settings', false );
		if ( false === $existing || ! is_array( $existing ) ) {
			update_option( 'math_knight_settings', $default_settings );
		} else {
			$merged = wp_parse_args( $existing, $default_settings );
			update_option( 'math_knight_settings', $merged );
		}
	}

	/**
	 * Chèn 5 bản ghi mẫu của nhóm bạn SGK Toán 3 "Kết nối tri thức với cuộc sống"
	 * nếu bảng xếp hạng đang trống để giáo viên và học sinh thấy dữ liệu sinh động ngay khi cài đặt.
	 *
	 * @param bool $force Nếu true, chèn dữ liệu mẫu ngay cả khi không qua kiểm tra lần đầu.
	 */
	public static function maybe_seed_sample_scores( $force = false ) {
		global $wpdb;

		$table_name = self::get_table_name();

		// Kiểm tra xem bảng đã tồn tại chưa.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$table_exists = $wpdb->get_var(
			$wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name )
		);

		if ( $table_exists !== $table_name ) {
			return;
		}

		// Kiểm tra số lượng bản ghi hiện có.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table_name}" );

		if ( $count > 0 && ! $force ) {
			return;
		}

		$now          = current_time( 'mysql' );
		$sample_users = array(
			array(
				'user_id'        => 0,
				'player_name'    => 'Rô-bốt Thông Thái',
				'avatar'         => 'knight',
				'score'          => 6850,
				'stages_cleared' => 5,
				'max_streak'     => 18,
				'accuracy'       => 100,
				'badges'         => wp_json_encode( array( 'first_blood', 'fury_hero', 'speed_demon', 'geo_master', 'word_wizard', 'stat_sage', 'flawless_stage', 'crystal_savior' ) ),
				'game_mode'      => 'story',
				'created_at'     => $now,
			),
			array(
				'user_id'        => 0,
				'player_name'    => 'Pháp Sư Mai',
				'avatar'         => 'mage',
				'score'          => 5420,
				'stages_cleared' => 5,
				'max_streak'     => 14,
				'accuracy'       => 95,
				'badges'         => wp_json_encode( array( 'first_blood', 'fury_hero', 'geo_master', 'word_wizard', 'crystal_savior' ) ),
				'game_mode'      => 'story',
				'created_at'     => $now,
			),
			array(
				'user_id'        => 0,
				'player_name'    => 'Hiệp Sĩ Nam',
				'avatar'         => 'knight',
				'score'          => 4680,
				'stages_cleared' => 4,
				'max_streak'     => 11,
				'accuracy'       => 90,
				'badges'         => wp_json_encode( array( 'first_blood', 'fury_hero', 'speed_demon', 'stat_sage' ) ),
				'game_mode'      => 'story',
				'created_at'     => $now,
			),
			array(
				'user_id'        => 0,
				'player_name'    => 'Dũng Sĩ Việt',
				'avatar'         => 'knight',
				'score'          => 3950,
				'stages_cleared' => 3,
				'max_streak'     => 8,
				'accuracy'       => 88,
				'badges'         => wp_json_encode( array( 'first_blood', 'fury_hero', 'word_wizard' ) ),
				'game_mode'      => 'story',
				'created_at'     => $now,
			),
			array(
				'user_id'        => 0,
				'player_name'    => 'Bé Mi Tinh Anh',
				'avatar'         => 'mage',
				'score'          => 3120,
				'stages_cleared' => 3,
				'max_streak'     => 6,
				'accuracy'       => 85,
				'badges'         => wp_json_encode( array( 'first_blood', 'flawless_stage' ) ),
				'game_mode'      => 'story',
				'created_at'     => $now,
			),
		);

		foreach ( $sample_users as $row ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
			$wpdb->insert(
				$table_name,
				$row,
				array( '%d', '%s', '%s', '%d', '%d', '%d', '%d', '%s', '%s', '%s' )
			);
		}
	}
}

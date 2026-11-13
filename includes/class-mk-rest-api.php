<?php
/**
 * Đăng ký và xử lý các REST API Endpoints cho Plugin Hiệp Sĩ Toán Học.
 *
 * Namespace: math-knight/v1
 * Endpoints:
 *  - GET  /wp-json/math-knight/v1/leaderboard : Lấy Top 20 Hiệp Sĩ điểm cao nhất.
 *  - POST /wp-json/math-knight/v1/scores      : Ghi nhận điểm số mới của học sinh.
 *  - GET  /wp-json/math-knight/v1/config      : Lấy cấu hình game và Top bảng xếp hạng.
 *
 * @package HiepSiToanHoc
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MK_REST_API
 */
class MK_REST_API {

	/**
	 * Namespace của REST API.
	 *
	 * @var string
	 */
	const API_NAMESPACE = 'math-knight/v1';

	/**
	 * Khởi tạo hook đăng ký REST routes.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	/**
	 * Đăng ký các tuyến (routes) REST API.
	 */
	public static function register_routes() {
		// 1. GET /wp-json/math-knight/v1/leaderboard
		register_rest_route(
			self::API_NAMESPACE,
			'/leaderboard',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_leaderboard' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'limit' => array(
						'default'           => 20,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		// 2. POST /wp-json/math-knight/v1/scores & GET /wp-json/math-knight/v1/scores (alias cho leaderboard)
		register_rest_route(
			self::API_NAMESPACE,
			'/scores',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'get_leaderboard' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'submit_score' ),
					'permission_callback' => array( __CLASS__, 'check_submit_permission' ),
				),
			)
		);

		// 3. GET /wp-json/math-knight/v1/config
		register_rest_route(
			self::API_NAMESPACE,
			'/config',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_config' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Kiểm tra quyền gửi điểm lên bảng xếp hạng.
	 * Hỗ trợ cả học sinh không cần tài khoản WordPress (nếu cài đặt allow_guest_scores được bật).
	 *
	 * @param WP_REST_Request $request Đối tượng request hiện tại.
	 * @return bool|WP_Error
	 */
	public static function check_submit_permission( $request ) {
		$settings = mk_get_settings();

		if ( empty( $settings['allow_guest_scores'] ) && ! is_user_logged_in() ) {
			return new WP_Error(
				'rest_forbidden_guest',
				__( 'Giáo viên đã cấu hình chỉ cho phép học sinh đã đăng nhập lưu điểm lên bảng xếp hạng.', 'hiep-si-toan-hoc' ),
				array( 'status' => 403 )
			);
		}

		// Nếu có gửi kèm header X-WP-Nonce, WordPress tự xác thực; nếu nonce hết hạn trên trang cache tĩnh,
		// vẫn cho phép ghi nhận điểm hợp lệ cho học sinh tiểu học với bộ lọc chống spam nghiêm ngặt.
		return true;
	}

	/**
	 * Truy vấn danh sách điểm cao nhất từ cơ sở dữ liệu.
	 *
	 * @param int $limit Số lượng bản ghi tối đa cần lấy (1 - 50).
	 * @return array Danh sách các bản ghi đã chuẩn hóa.
	 */
	public static function query_top_scores( $limit = 20 ) {
		global $wpdb;

		$limit      = max( 1, min( 50, absint( $limit ) ) );
		$table_name = MK_Activator::get_table_name();

		// Đảm bảo bảng tồn tại.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$rows = $wpdb->get_results(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT id, user_id, player_name, avatar, score, stages_cleared, max_streak, accuracy, badges, game_mode, created_at FROM {$table_name} ORDER BY score DESC, stages_cleared DESC, accuracy DESC, id ASC LIMIT %d",
				$limit
			),
			ARRAY_A
		);

		if ( ! is_array( $rows ) ) {
			return array();
		}

		$formatted = array();
		foreach ( $rows as $index => $row ) {
			$decoded_badges = array();
			if ( ! empty( $row['badges'] ) ) {
				$maybe_array = json_decode( $row['badges'], true );
				if ( is_array( $maybe_array ) ) {
					$decoded_badges = array_values( array_map( 'sanitize_key', $maybe_array ) );
				}
			}

			$formatted[] = array(
				'rank'           => $index + 1,
				'id'             => (int) $row['id'],
				'user_id'        => (int) $row['user_id'],
				'player_name'    => sanitize_text_field( $row['player_name'] ),
				'playerName'     => sanitize_text_field( $row['player_name'] ),
				'avatar'         => in_array( $row['avatar'], array( 'knight', 'mage' ), true ) ? $row['avatar'] : 'knight',
				'score'          => (int) $row['score'],
				'stages_cleared' => (int) $row['stages_cleared'],
				'stagesCleared'  => (int) $row['stages_cleared'],
				'max_streak'     => (int) $row['max_streak'],
				'maxStreak'      => (int) $row['max_streak'],
				'accuracy'       => (int) $row['accuracy'],
				'badges'         => $decoded_badges,
				'game_mode'      => sanitize_key( $row['game_mode'] ),
				'gameMode'       => sanitize_key( $row['game_mode'] ),
				'created_at'     => $row['created_at'],
				'createdAt'      => $row['created_at'],
				'date_formatted' => mysql2date( 'd/m/Y H:i', $row['created_at'] ),
			);
		}

		return $formatted;
	}

	/**
	 * Callback cho GET /wp-json/math-knight/v1/leaderboard
	 *
	 * @param WP_REST_Request $request Đối tượng REST Request.
	 * @return WP_REST_Response
	 */
	public static function get_leaderboard( $request ) {
		$limit       = $request->get_param( 'limit' ) ? absint( $request->get_param( 'limit' ) ) : 20;
		$leaderboard = self::query_top_scores( $limit );

		return new WP_REST_Response(
			array(
				'success'     => true,
				'count'       => count( $leaderboard ),
				'leaderboard' => $leaderboard,
			),
			200
		);
	}

	/**
	 * Callback cho GET /wp-json/math-knight/v1/config
	 *
	 * @param WP_REST_Request $request Đối tượng REST Request.
	 * @return WP_REST_Response
	 */
	public static function get_config( $request ) {
		$settings    = mk_get_settings();
		$leaderboard = self::query_top_scores( 20 );

		return new WP_REST_Response(
			array(
				'success'      => true,
				'version'      => MK_PLUGIN_VERSION,
				'pluginUrl'    => esc_url_raw( MK_PLUGIN_URL ),
				'sgkImagesUrl' => esc_url_raw( MK_PLUGIN_URL . 'assets/images/sgk/' ),
				'settings'     => $settings,
				'leaderboard'  => $leaderboard,
			),
			200
		);
	}

	/**
	 * Callback cho POST /wp-json/math-knight/v1/scores
	 * Nhận kết quả trận đấu, kiểm tra hợp lệ, lưu DB và trả về thứ hạng mới.
	 *
	 * @param WP_REST_Request $request Đối tượng REST Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function submit_score( $request ) {
		global $wpdb;

		// 0. Chống Spam / DoS (OWASP API4): Giới hạn tốc độ gửi điểm theo IP (tối đa 10 lần / 60 giây).
		$raw_ip    = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$client_ip = filter_var( $raw_ip, FILTER_VALIDATE_IP ) ? $raw_ip : '0.0.0.0';
		$rl_key    = 'mk_rl_' . md5( $client_ip );
		$rl_count  = (int) get_transient( $rl_key );
		if ( $rl_count >= 10 ) {
			return new WP_Error(
				'rest_rate_limited',
				__( 'Bạn gửi điểm quá nhanh. Vui lòng đợi 1 phút rồi thử lại.', 'hiep-si-toan-hoc' ),
				array( 'status' => 429 )
			);
		}
		set_transient( $rl_key, $rl_count + 1, 60 );

		$params = $request->get_json_params();
		if ( empty( $params ) || ! is_array( $params ) ) {
			$params = $request->get_body_params();
		}
		if ( ! is_array( $params ) ) {
			$params = array();
		}

		// 1. Lấy và làm sạch tên người chơi (hỗ trợ cả player_name và playerName, lọc ký tự đầu công thức CSV).
		$raw_name = '';
		if ( ! empty( $params['player_name'] ) ) {
			$raw_name = $params['player_name'];
		} elseif ( ! empty( $params['playerName'] ) ) {
			$raw_name = $params['playerName'];
		}
		$player_name = sanitize_text_field( wp_strip_all_tags( (string) $raw_name ) );
		$player_name = trim( ltrim( $player_name, "=+-@\t\r " ) );
		if ( empty( $player_name ) ) {
			$player_name = __( 'Hiệp Sĩ Nhí', 'hiep-si-toan-hoc' );
		}
		// Giới hạn độ dài tên tối đa 60 ký tự.
		if ( function_exists( 'mb_substr' ) ) {
			$player_name = mb_substr( $player_name, 0, 60, 'UTF-8' );
		} else {
			$player_name = substr( $player_name, 0, 60 );
		}

		// 2. Nhân vật đại diện ('knight' hoặc 'mage').
		$raw_avatar = isset( $params['avatar'] ) ? sanitize_key( $params['avatar'] ) : 'knight';
		$avatar     = in_array( $raw_avatar, array( 'knight', 'mage' ), true ) ? $raw_avatar : 'knight';

		// 3. Kiểm tra & kẹp biên (clamp/validate) điểm số hợp lý: 0 .. 36000.
		$score = isset( $params['score'] ) ? intval( $params['score'] ) : 0;
		if ( $score < 0 || $score > 36000 ) {
			return new WP_Error(
				'invalid_score',
				__( 'Điểm số không hợp lệ (chỉ chấp nhận từ 0 đến 36.000 điểm).', 'hiep-si-toan-hoc' ),
				array( 'status' => 400 )
			);
		}

		// 4. Số ải vượt qua: 0 .. 5.
		$raw_stages = isset( $params['stages_cleared'] )
			? $params['stages_cleared']
			: ( isset( $params['stagesCleared'] ) ? $params['stagesCleared'] : 0 );
		$stages_cleared = max( 0, min( 5, intval( $raw_stages ) ) );

		// 5. Chuỗi trả lời đúng liên tiếp cao nhất (max_streak): 0 .. 200.
		$raw_streak = isset( $params['max_streak'] )
			? $params['max_streak']
			: ( isset( $params['maxStreak'] ) ? $params['maxStreak'] : 0 );
		$max_streak = max( 0, min( 200, intval( $raw_streak ) ) );

		// 6. Độ chính xác (accuracy %): 0 .. 100.
		$raw_accuracy = isset( $params['accuracy'] ) ? intval( $params['accuracy'] ) : 0;
		$accuracy     = max( 0, min( 100, $raw_accuracy ) );

		// 7. Danh sách Huy hiệu (badges).
		$allowed_badges = array(
			'first_blood',
			'fury_hero',
			'speed_demon',
			'geo_master',
			'word_wizard',
			'stat_sage',
			'flawless_stage',
			'crystal_savior',
		);
		$clean_badges   = array();
		if ( ! empty( $params['badges'] ) ) {
			$input_badges = $params['badges'];
			if ( is_string( $input_badges ) ) {
				$decoded = json_decode( $input_badges, true );
				if ( is_array( $decoded ) ) {
					$input_badges = $decoded;
				} else {
					$input_badges = explode( ',', $input_badges );
				}
			}
			if ( is_array( $input_badges ) ) {
				foreach ( $input_badges as $badge_key ) {
					$clean_key = sanitize_key( $badge_key );
					if ( in_array( $clean_key, $allowed_badges, true ) && ! in_array( $clean_key, $clean_badges, true ) ) {
						$clean_badges[] = $clean_key;
					}
				}
			}
		}

		// 8. Chế độ chơi ('story', 'practice', 'tap1', 'tap2', 'all').
		$raw_mode      = isset( $params['game_mode'] )
			? $params['game_mode']
			: ( isset( $params['gameMode'] ) ? $params['gameMode'] : 'story' );
		$allowed_modes = array( 'story', 'practice', 'tap1', 'tap2', 'all', 'story_tap1', 'story_tap2', 'story_all' );
		$game_mode     = in_array( sanitize_key( $raw_mode ), $allowed_modes, true )
			? sanitize_key( $raw_mode )
			: 'story';

		$table_name = MK_Activator::get_table_name();
		$user_id    = get_current_user_id();
		$now        = current_time( 'mysql' );

		// Lưu bản ghi vào cơ sở dữ liệu bằng Prepared Format.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		$inserted = $wpdb->insert(
			$table_name,
			array(
				'user_id'        => $user_id,
				'player_name'    => $player_name,
				'avatar'         => $avatar,
				'score'          => $score,
				'stages_cleared' => $stages_cleared,
				'max_streak'     => $max_streak,
				'accuracy'       => $accuracy,
				'badges'         => wp_json_encode( $clean_badges ),
				'game_mode'      => $game_mode,
				'created_at'     => $now,
			),
			array( '%d', '%s', '%s', '%d', '%d', '%d', '%d', '%s', '%s', '%s' )
		);

		if ( false === $inserted ) {
			return new WP_Error(
				'db_insert_error',
				__( 'Không thể lưu điểm vào cơ sở dữ liệu. Vui lòng thử lại.', 'hiep-si-toan-hoc' ),
				array( 'status' => 500 )
			);
		}

		$insert_id = (int) $wpdb->insert_id;

		// Tính toán thứ hạng (rank) hiện tại của học sinh vừa nộp điểm.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$higher_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT COUNT(*) FROM {$table_name} WHERE score > %d",
				$score
			)
		);
		$rank = $higher_count + 1;

		$leaderboard = self::query_top_scores( 20 );

		return new WP_REST_Response(
			array(
				'success'     => true,
				'message'     => __( 'Đã ghi danh lên Bảng vàng Hiệp Sĩ thành công!', 'hiep-si-toan-hoc' ),
				'record_id'   => $insert_id,
				'rank'        => $rank,
				'leaderboard' => $leaderboard,
			),
			201
		);
	}
}

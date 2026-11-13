<?php
/**
 * Đăng ký Shortcode [hiep_si_toan_hoc] và Gutenberg Block (math-knight/game-block).
 *
 * Hỗ trợ nhúng Custom Web Component <math-knight-game> (Shadow DOM) vào bất kỳ
 * bài viết, trang học liệu hoặc trình tạo trang (Elementor, Gutenberg, Classic Editor, Flatsome...).
 *
 * @package HiepSiToanHoc
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MK_Shortcode_Block
 */
class MK_Shortcode_Block {

	/**
	 * Khởi tạo Shortcode và Gutenberg Block.
	 */
	public static function init() {
		add_shortcode( 'hiep_si_toan_hoc', array( __CLASS__, 'render_shortcode' ) );
		add_shortcode( 'math_knight', array( __CLASS__, 'render_shortcode' ) );
		add_action( 'init', array( __CLASS__, 'register_gutenberg_block' ) );
	}

	/**
	 * Đăng ký Gutenberg Block `math-knight/game-block`.
	 */
	public static function register_gutenberg_block() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		wp_register_script(
			'math-knight-block-editor',
			MK_PLUGIN_URL . 'assets/js/block-editor.js',
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
			MK_PLUGIN_VERSION,
			true
		);

		register_block_type(
			'math-knight/game-block',
			array(
				'api_version'     => 2,
				'editor_script'   => 'math-knight-block-editor',
				'render_callback' => array( __CLASS__, 'render_block' ),
				'attributes'      => array(
					'mode'       => array(
						'type'    => 'string',
						'default' => 'story',
					),
					'book'       => array(
						'type'    => 'string',
						'default' => 'default',
					),
					'stage'      => array(
						'type'    => 'string',
						'default' => '0',
					),
					'timer'      => array(
						'type'    => 'string',
						'default' => 'default',
					),
					'questions'  => array(
						'type'    => 'number',
						'default' => 0,
					),
					'lives'      => array(
						'type'    => 'number',
						'default' => 0,
					),
					'sgk'        => array(
						'type'    => 'string',
						'default' => 'default',
					),
					'fullscreen' => array(
						'type'    => 'string',
						'default' => 'default',
					),
				),
			)
		);
	}

	/**
	 * Callback render cho Gutenberg Block `math-knight/game-block`.
	 *
	 * @param array $attributes Các thuộc tính người dùng cấu hình trong Block Editor.
	 * @return string Mã HTML nhúng game.
	 */
	public static function render_block( $attributes ) {
		$shortcode_atts = array(
			'mode'       => isset( $attributes['mode'] ) ? $attributes['mode'] : 'story',
			'book'       => ( isset( $attributes['book'] ) && 'default' !== $attributes['book'] ) ? $attributes['book'] : '',
			'stage'      => isset( $attributes['stage'] ) ? $attributes['stage'] : '0',
			'timer'      => ( isset( $attributes['timer'] ) && 'default' !== $attributes['timer'] ) ? $attributes['timer'] : '',
			'questions'  => ! empty( $attributes['questions'] ) ? $attributes['questions'] : '',
			'lives'      => ! empty( $attributes['lives'] ) ? $attributes['lives'] : '',
			'sgk'        => ( isset( $attributes['sgk'] ) && 'default' !== $attributes['sgk'] ) ? $attributes['sgk'] : '',
			'fullscreen' => ( isset( $attributes['fullscreen'] ) && 'default' !== $attributes['fullscreen'] ) ? $attributes['fullscreen'] : '',
		);

		return self::render_shortcode( $shortcode_atts );
	}

	/**
	 * Xử lý Shortcode [hiep_si_toan_hoc book="tap1|tap2|all" mode="story" stage="1" timer="true" questions="8" fullscreen="true"].
	 *
	 * @param array|string $atts Các thuộc tính truyền vào shortcode.
	 * @return string Mã HTML chứa thẻ <math-knight-game>.
	 */
	public static function render_shortcode( $atts = array() ) {
		// Đảm bảo bộ script của game được nạp vào trang hiện tại.
		Math_Knight_Plugin::enqueue_game_scripts();

		$settings = mk_get_settings();

		$default_atts = array(
			'mode'       => 'story',
			'book'       => ! empty( $settings['default_book_mode'] ) ? $settings['default_book_mode'] : 'all',
			'stage'      => '0',
			'timer'      => $settings['timer_enabled'] ? 'true' : 'false',
			'questions'  => $settings['questions_per_stage'],
			'time'       => $settings['time_per_question'],
			'lives'      => $settings['initial_lives'],
			'sgk'        => $settings['enable_sgk_images'] ? 'true' : 'false',
			'fullscreen' => ! empty( $settings['fullscreen_button'] ) ? 'true' : 'false',
		);

		$raw_atts = is_array( $atts ) ? array_filter(
			$atts,
			function ( $val ) {
				return '' !== $val && null !== $val;
			}
		) : array();

		$parsed = shortcode_atts( $default_atts, $raw_atts, 'hiep_si_toan_hoc' );

		// Làm sạch và chuẩn hóa giá trị thuộc tính.
		$mode = in_array( $parsed['mode'], array( 'story', 'practice' ), true ) ? $parsed['mode'] : 'story';

		$book_str = strtolower( trim( (string) $parsed['book'] ) );
		$book     = in_array( $book_str, array( 'tap1', 'tap2', 'all' ), true ) ? $book_str : 'all';

		$stage = absint( $parsed['stage'] );
		if ( $stage > 5 ) {
			$stage = 0;
		}

		$timer_str = strtolower( (string) $parsed['timer'] );
		$timer     = in_array( $timer_str, array( 'false', '0', 'no', 'off' ), true ) ? 'false' : 'true';

		$questions = max( 5, min( 15, absint( $parsed['questions'] ) ) );
		$time_sec  = max( 15, min( 60, absint( $parsed['time'] ) ) );
		$lives     = max( 1, min( 5, absint( $parsed['lives'] ) ) );

		$sgk_str = strtolower( (string) $parsed['sgk'] );
		$sgk     = in_array( $sgk_str, array( 'false', '0', 'no', 'off' ), true ) ? 'false' : 'true';

		$fullscreen_str = strtolower( (string) $parsed['fullscreen'] );
		$fullscreen     = in_array( $fullscreen_str, array( 'false', '0', 'no', 'off' ), true ) ? 'false' : 'true';

		$rest_url       = esc_url( rest_url( 'math-knight/v1/' ) );
		$nonce          = wp_create_nonce( 'wp_rest' );
		$plugin_url     = esc_url( MK_PLUGIN_URL );
		$sgk_images_url = esc_url( MK_PLUGIN_URL . 'assets/images/sgk/' );
		$topics_csv     = implode( ',', array_map( 'sanitize_key', $settings['enabled_topics'] ) );

		$html = sprintf(
			'<div class="mk-game-embed-wrapper" style="width:100%%;max-width:1080px;margin:24px auto;">' .
			'<math-knight-game ' .
				'mode="%1$s" ' .
				'stage="%2$d" ' .
				'timer="%3$s" ' .
				'questions="%4$d" ' .
				'questions-per-stage="%4$d" ' .
				'time-per-question="%5$d" ' .
				'initial-lives="%6$d" ' .
				'enable-sgk-images="%7$s" ' .
				'enabled-topics="%8$s" ' .
				'api-url="%9$s" ' .
				'nonce="%10$s" ' .
				'plugin-url="%11$s" ' .
				'sgk-images-url="%12$s" ' .
				'fullscreen-button="%13$s" ' .
				'book="%14$s" ' .
				'book-mode="%14$s"' .
			'></math-knight-game>' .
			'</div>',
			esc_attr( $mode ),
			(int) $stage,
			esc_attr( $timer ),
			(int) $questions,
			(int) $time_sec,
			(int) $lives,
			esc_attr( $sgk ),
			esc_attr( $topics_csv ),
			esc_attr( $rest_url ),
			esc_attr( $nonce ),
			esc_attr( $plugin_url ),
			esc_attr( $sgk_images_url ),
			esc_attr( $fullscreen ),
			esc_attr( $book )
		);

		return $html;
	}
}

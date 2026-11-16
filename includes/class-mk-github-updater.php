<?php
/**
 * Bộ cập nhật tự động Plugin từ GitHub Releases chính thức (chỉ cập nhật từ file Release .zip).
 *
 * Kết nối trực tiếp tới Public Repository:
 * https://github.com/vitinhthanhphat-png/hiep-si-toan-hoc
 *
 * Quy tắc an toàn bắt buộc:
 *  - CHỈ nhận bản cập nhật khi trên GitHub Releases có đính kèm gói `.zip` đã đóng gói chuẩn
 *    (ưu tiên `hiep-si-toan-hoc-plugin.zip` trong `assets[].browser_download_url`).
 *  - TUYỆT ĐỐI KHÔNG sử dụng `zipball_url` (mã nguồn thô chưa đóng gói hoặc chứa thư mục nặng `docs/pdf/`).
 *
 * @package HiepSiToanHoc
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class MK_GitHub_Updater
 */
class MK_GitHub_Updater {

	/**
	 * Chủ sở hữu (Owner/Organization) trên GitHub.
	 *
	 * @var string
	 */
	const GITHUB_OWNER = 'vitinhthanhphat-png';

	/**
	 * Tên Repository trên GitHub.
	 *
	 * @var string
	 */
	const GITHUB_REPO = 'hiep-si-toan-hoc';

	/**
	 * Tên file .zip chuẩn được đính kèm trong GitHub Release Assets.
	 *
	 * @var string
	 */
	const ASSET_ZIP_NAME = 'hiep-si-toan-hoc-plugin.zip';

	/**
	 * Khóa lưu trữ cache thông tin Release trong WordPress Transients (6 giờ).
	 *
	 * @var string
	 */
	const CACHE_KEY = 'mk_github_latest_release_v1';

	/**
	 * Khởi tạo các hooks tích hợp với hệ thống Update của WordPress Core.
	 */
	public static function init() {
		add_filter( 'pre_set_site_transient_update_plugins', array( __CLASS__, 'check_for_update' ) );
		add_filter( 'plugins_api', array( __CLASS__, 'plugin_popup_info' ), 20, 3 );
		add_filter( 'upgrader_source_selection', array( __CLASS__, 'fix_source_folder_name' ), 10, 4 );
		add_action( 'upgrader_process_complete', array( __CLASS__, 'purge_cache_after_update' ), 10, 2 );
	}

	/**
	 * Lấy URL trang GitHub Repository chính thức.
	 *
	 * @return string
	 */
	public static function get_repo_url() {
		return 'https://github.com/' . self::GITHUB_OWNER . '/' . self::GITHUB_REPO;
	}

	/**
	 * Chuẩn hóa chuỗi phiên bản (loại bỏ tiền tố 'v' hoặc 'V' ở đầu, ví dụ 'v1.2' -> '1.2').
	 *
	 * @param string $raw_version Chuỗi tag_name từ GitHub.
	 * @return string
	 */
	public static function normalize_version( $raw_version ) {
		$clean = trim( (string) $raw_version );
		$clean = ltrim( $clean, 'vV' );
		return preg_replace( '/[^0-9a-zA-Z.\-_]/', '', $clean );
	}

	/**
	 * Truy vấn thông tin bản Release mới nhất từ GitHub REST API.
	 * Chỉ chấp nhận file `.zip` nằm trong danh sách `assets` của Release.
	 *
	 * @param bool $force_refresh Bỏ qua cache để kiểm tra trực tiếp từ GitHub.
	 * @return array Dữ liệu release đã chuẩn hóa.
	 */
	public static function get_latest_release( $force_refresh = false ) {
		if ( ! $force_refresh ) {
			$cached = get_transient( self::CACHE_KEY );
			if ( is_array( $cached ) && ! empty( $cached['checked_at'] ) ) {
				return $cached;
			}
		}

		$api_url = sprintf(
			'https://api.github.com/repos/%s/%s/releases/latest',
			rawurlencode( self::GITHUB_OWNER ),
			rawurlencode( self::GITHUB_REPO )
		);

		$response = wp_remote_get(
			$api_url,
			array(
				'timeout' => 12,
				'headers' => array(
					'Accept'     => 'application/vnd.github+json',
					'User-Agent' => 'WordPress/HiepSiToanHoc-' . MK_PLUGIN_VERSION,
				),
			)
		);

		$now_str = current_time( 'd/m/Y H:i:s' );

		if ( is_wp_error( $response ) ) {
			$result = array(
				'error'          => $response->get_error_message(),
				'latest_version' => MK_PLUGIN_VERSION,
				'release_name'   => '',
				'published_at'   => '',
				'release_notes'  => '',
				'download_url'   => '',
				'html_url'       => self::get_repo_url() . '/releases',
				'asset_name'     => '',
				'asset_size'     => 0,
				'checked_at'     => $now_str,
			);
			set_transient( self::CACHE_KEY, $result, 15 * MINUTE_IN_SECONDS );
			return $result;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 404 === $code ) {
			$result = array(
				'error'          => 'no_release_yet',
				'latest_version' => MK_PLUGIN_VERSION,
				'release_name'   => 'Chưa có bản Release nào được phát hành trên GitHub',
				'published_at'   => '',
				'release_notes'  => '',
				'download_url'   => '',
				'html_url'       => self::get_repo_url() . '/releases',
				'asset_name'     => '',
				'asset_size'     => 0,
				'checked_at'     => $now_str,
			);
			set_transient( self::CACHE_KEY, $result, HOUR_IN_SECONDS );
			return $result;
		}

		if ( 200 !== $code || ! is_array( $body ) ) {
			$result = array(
				'error'          => sprintf( 'GitHub API trả về mã HTTP %d.', $code ),
				'latest_version' => MK_PLUGIN_VERSION,
				'release_name'   => '',
				'published_at'   => '',
				'release_notes'  => '',
				'download_url'   => '',
				'html_url'       => self::get_repo_url() . '/releases',
				'asset_name'     => '',
				'asset_size'     => 0,
				'checked_at'     => $now_str,
			);
			set_transient( self::CACHE_KEY, $result, 30 * MINUTE_IN_SECONDS );
			return $result;
		}

		// Bỏ qua nếu là bản nháp (draft) hoặc pre-release chưa chính thức.
		if ( ! empty( $body['draft'] ) || ! empty( $body['prerelease'] ) ) {
			$result = array(
				'error'          => 'no_stable_release',
				'latest_version' => MK_PLUGIN_VERSION,
				'release_name'   => 'Chưa có bản Release chính thức (Stable)',
				'published_at'   => '',
				'release_notes'  => '',
				'download_url'   => '',
				'html_url'       => self::get_repo_url() . '/releases',
				'asset_name'     => '',
				'asset_size'     => 0,
				'checked_at'     => $now_str,
			);
			set_transient( self::CACHE_KEY, $result, HOUR_IN_SECONDS );
			return $result;
		}

		// QUY TẮC BẮT BUỘC: Chỉ lấy file .zip đính kèm trong assets[], tuyệt đối KHÔNG lấy zipball_url!
		$download_url = '';
		$asset_name   = '';
		$asset_size   = 0;

		if ( ! empty( $body['assets'] ) && is_array( $body['assets'] ) ) {
			// Ưu tiên 1: Tìm đúng file hiep-si-toan-hoc-plugin.zip.
			foreach ( $body['assets'] as $asset ) {
				if (
					! empty( $asset['name'] ) &&
					! empty( $asset['browser_download_url'] ) &&
					self::ASSET_ZIP_NAME === $asset['name']
				) {
					$download_url = esc_url_raw( $asset['browser_download_url'] );
					$asset_name   = sanitize_file_name( $asset['name'] );
					$asset_size   = isset( $asset['size'] ) ? absint( $asset['size'] ) : 0;
					break;
				}
			}

			// Ưu tiên 2: Nếu tên file .zip khác nhưng vẫn là asset .zip chính thức trong Release.
			if ( empty( $download_url ) ) {
				foreach ( $body['assets'] as $asset ) {
					$candidate_name = isset( $asset['name'] ) ? (string) $asset['name'] : '';
					if (
						! empty( $asset['browser_download_url'] ) &&
						'.zip' === strtolower( substr( $candidate_name, -4 ) )
					) {
						$download_url = esc_url_raw( $asset['browser_download_url'] );
						$asset_name   = sanitize_file_name( $candidate_name );
						$asset_size   = isset( $asset['size'] ) ? absint( $asset['size'] ) : 0;
						break;
					}
				}
			}
		}

		$tag_name       = isset( $body['tag_name'] ) ? (string) $body['tag_name'] : MK_PLUGIN_VERSION;
		$latest_version = self::normalize_version( $tag_name );
		if ( empty( $latest_version ) ) {
			$latest_version = MK_PLUGIN_VERSION;
		}

		$published_at = '';
		if ( ! empty( $body['published_at'] ) ) {
			$ts = strtotime( $body['published_at'] );
			if ( $ts ) {
				$published_at = wp_date( 'd/m/Y H:i', $ts );
			}
		}

		$result = array(
			'error'          => empty( $download_url ) ? 'missing_zip_asset' : '',
			'latest_version' => $latest_version,
			'tag_name'       => sanitize_text_field( $tag_name ),
			'release_name'   => ! empty( $body['name'] ) ? sanitize_text_field( $body['name'] ) : $tag_name,
			'published_at'   => $published_at,
			'release_notes'  => ! empty( $body['body'] ) ? wp_kses_post( $body['body'] ) : '',
			'download_url'   => $download_url,
			'html_url'       => ! empty( $body['html_url'] ) ? esc_url_raw( $body['html_url'] ) : ( self::get_repo_url() . '/releases' ),
			'asset_name'     => $asset_name,
			'asset_size'     => $asset_size,
			'checked_at'     => $now_str,
		);

		set_transient( self::CACHE_KEY, $result, 6 * HOUR_IN_SECONDS );
		return $result;
	}

	/**
	 * Trả về trạng thái tổng hợp phục vụ hiển thị trong Tab "Cập Nhật (GitHub)" của WP Admin.
	 *
	 * @param bool $force_refresh Có ép buộc gọi lại GitHub API hay không.
	 * @return array
	 */
	public static function get_release_status( $force_refresh = false ) {
		$release    = self::get_latest_release( $force_refresh );
		$latest_ver = ! empty( $release['latest_version'] ) ? $release['latest_version'] : MK_PLUGIN_VERSION;
		$has_zip    = ! empty( $release['download_url'] );
		$has_update = $has_zip && version_compare( $latest_ver, MK_PLUGIN_VERSION, '>' );

		return array(
			'current_version' => MK_PLUGIN_VERSION,
			'latest_version'  => $latest_ver,
			'has_update'      => $has_update,
			'has_zip_asset'   => $has_zip,
			'release_name'    => $release['release_name'] ?? '',
			'published_at'    => $release['published_at'] ?? '',
			'release_notes'   => $release['release_notes'] ?? '',
			'download_url'    => $release['download_url'] ?? '',
			'html_url'        => $release['html_url'] ?? ( self::get_repo_url() . '/releases' ),
			'asset_name'      => $release['asset_name'] ?? '',
			'asset_size'      => $release['asset_size'] ?? 0,
			'checked_at'      => $release['checked_at'] ?? current_time( 'd/m/Y H:i:s' ),
			'error'           => $release['error'] ?? '',
		);
	}

	/**
	 * Trả về mảng đường dẫn Icon chuẩn WordPress (SVG, 2x 256x256, 1x 128x128).
	 *
	 * @return array
	 */
	public static function get_plugin_icons() {
		return array(
			'svg'     => MK_PLUGIN_URL . 'assets/images/logo.svg',
			'2x'      => MK_PLUGIN_URL . 'assets/images/icon-256x256.png',
			'1x'      => MK_PLUGIN_URL . 'assets/images/icon-128x128.png',
			'default' => MK_PLUGIN_URL . 'assets/images/icon-256x256.png',
		);
	}

	/**
	 * Trả về mảng đường dẫn Banner / Cover (1200x630px) cho hộp thoại Chi tiết Plugin của WordPress.
	 *
	 * @return array
	 */
	public static function get_plugin_banners() {
		return array(
			'high' => MK_PLUGIN_URL . 'assets/images/cover-1200x630.png',
			'low'  => MK_PLUGIN_URL . 'assets/images/cover-1200x630.png',
		);
	}

	/**
	 * Hook vào `pre_set_site_transient_update_plugins` để báo cho WordPress biết khi có bản Release .zip mới,
	 * đồng thời cung cấp Icon & Banner (1200x630) cho trang Plugins / Updates.
	 *
	 * @param object $transient Đối tượng update_plugins transient của WordPress.
	 * @return object
	 */
	public static function check_for_update( $transient ) {
		if ( ! is_object( $transient ) ) {
			return $transient;
		}

		$status = self::get_release_status( false );
		$icons   = self::get_plugin_icons();
		$banners = self::get_plugin_banners();

		$plugin_data = (object) array(
			'id'            => self::get_repo_url(),
			'slug'          => 'hiep-si-toan-hoc',
			'plugin'        => MK_PLUGIN_BASENAME,
			'new_version'   => $status['latest_version'],
			'url'           => self::get_repo_url(),
			'package'       => $status['download_url'],
			'icons'         => $icons,
			'banners'       => $banners,
			'banners_rtl'   => array(),
			'tested'        => '6.7',
			'requires_php'  => '7.4',
			'compatibility' => new stdClass(),
		);

		if ( $status['has_update'] && ! empty( $status['download_url'] ) ) {
			$transient->response[ MK_PLUGIN_BASENAME ] = $plugin_data;
		} else {
			if ( ! isset( $transient->no_update ) || ! is_array( $transient->no_update ) ) {
				$transient->no_update = array();
			}
			$transient->no_update[ MK_PLUGIN_BASENAME ] = $plugin_data;
		}

		return $transient;
	}

	/**
	 * Hiển thị hộp thoại "Chi tiết phiên bản" (View version details) trong trang Plugins của WordPress.
	 *
	 * @param false|object|array $result Kết quả mặc định.
	 * @param string             $action Hành động plugins_api.
	 * @param object             $args   Tham số truyền vào.
	 * @return false|object|array
	 */
	public static function plugin_popup_info( $result, $action, $args ) {
		if ( 'plugin_information' !== $action || empty( $args->slug ) || 'hiep-si-toan-hoc' !== $args->slug ) {
			return $result;
		}

		$status = self::get_release_status( false );

		$info                = new stdClass();
		$info->name          = 'Hiệp Sĩ Toán Học Lớp 3';
		$info->slug          = 'hiep-si-toan-hoc';
		$info->version       = $status['latest_version'];
		$info->author        = '<a href="https://techsharevn.com" target="_blank" rel="noopener">Trần Vĩ Thành (Techshare VN)</a>';
		$info->homepage      = self::get_repo_url();
		$info->requires      = '5.8';
		$info->tested        = '6.7';
		$info->requires_php  = '7.4';
		$info->last_updated  = $status['published_at'];
		$info->download_link = $status['download_url'];
		$info->icons         = self::get_plugin_icons();
		$info->banners       = self::get_plugin_banners();

		$changelog_html = ! empty( $status['release_notes'] )
			? nl2br( esc_html( $status['release_notes'] ) )
			: '<p>Cập nhật từ gói phát hành chính thức (Release ZIP) trên GitHub Repository <code>vitinhthanhphat-png/hiep-si-toan-hoc</code>.</p>';

		$info->sections = array(
			'description' => '<p>Web Game nhập vai giáo dục môn <strong>Toán Lớp 3</strong> bám sát 100% bộ sách <strong>Kết nối tri thức với cuộc sống (GDPT 2018)</strong> gồm 3 chế độ: 5 Ải Tập 1, 5 Ải Tập 2 và 5 Ải Tổng hợp Cả năm.</p>',
			'changelog'   => $changelog_html,
		);

		return $info;
	}

	/**
	 * Đảm bảo tên thư mục giải nén sau khi tải gói .zip từ GitHub luôn khớp với thư mục hiện tại của Plugin.
	 *
	 * @param string      $source        Đường dẫn thư mục vừa giải nén.
	 * @param string      $remote_source Thư mục tạm chứa file giải nén.
	 * @param WP_Upgrader $upgrader      Đối tượng WP_Upgrader.
	 * @param array       $hook_extra    Thông tin bổ sung của tiến trình cập nhật.
	 * @return string|WP_Error
	 */
	public static function fix_source_folder_name( $source, $remote_source, $upgrader, $hook_extra ) {
		if ( empty( $hook_extra['plugin'] ) || MK_PLUGIN_BASENAME !== $hook_extra['plugin'] ) {
			return $source;
		}

		global $wp_filesystem;
		if ( ! $wp_filesystem ) {
			return $source;
		}

		$plugin_folder = dirname( MK_PLUGIN_BASENAME );
		if ( '.' === $plugin_folder || empty( $plugin_folder ) ) {
			$plugin_folder = 'hiep-si-toan-hoc';
		}

		$corrected_source = trailingslashit( $remote_source ) . trailingslashit( $plugin_folder );

		if ( trailingslashit( $source ) !== $corrected_source ) {
			if ( $wp_filesystem->move( $source, $corrected_source, true ) ) {
				return $corrected_source;
			}
		}

		return $source;
	}

	/**
	 * Xóa cache kiểm tra cập nhật sau khi WordPress hoàn tất nâng cấp Plugin.
	 *
	 * @param WP_Upgrader $upgrader   Đối tượng WP_Upgrader.
	 * @param array       $hook_extra Thông tin tiến trình.
	 */
	public static function purge_cache_after_update( $upgrader, $hook_extra ) {
		if (
			isset( $hook_extra['action'], $hook_extra['type'] ) &&
			'update' === $hook_extra['action'] &&
			'plugin' === $hook_extra['type']
		) {
			delete_transient( self::CACHE_KEY );
		}
	}
}

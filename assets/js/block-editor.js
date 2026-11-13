/**
 * Gutenberg Block Editor Script: Hiệp Sĩ Toán Học - Giải Cứu Rừng Pha Lê (Toán Lớp 3 - Kết Nối Tri Thức) - v1.0
 *
 * Đăng ký khối (Block) `math-knight/game-block` giúp giáo viên kéo thả trực quan
 * vào bài viết/trang và tùy chỉnh thông số ngay trên thanh bên (InspectorControls).
 */
( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.blocks || ! wp.element ) {
		return;
	}

	var registerBlockType = wp.blocks.registerBlockType;
	var el                = wp.element.createElement;
	var Fragment          = wp.element.Fragment;
	var InspectorControls = ( wp.blockEditor && wp.blockEditor.InspectorControls ) || ( wp.editor && wp.editor.InspectorControls );
	var useBlockProps     = ( wp.blockEditor && wp.blockEditor.useBlockProps ) ? wp.blockEditor.useBlockProps : function () { return {}; };
	var PanelBody         = wp.components.PanelBody;
	var SelectControl     = wp.components.SelectControl;
	var RangeControl      = wp.components.RangeControl;

	var STAGE_LABELS = {
		'0': 'Màn hình chính / Bản đồ toàn bộ 5 ải',
		'1': 'Ải 1 (Khởi đầu hành trình)',
		'2': 'Ải 2 (Thử thách thứ hai)',
		'3': 'Ải 3 (Mê cung trung tâm)',
		'4': 'Ải 4 (Đỉnh núi thử thách)',
		'5': 'Ải 5 (Lâu đài Boss Cuối)'
	};

	var BOOK_LABELS = {
		'default': 'Theo Cài đặt chung (Tổng hợp Tập 1 & 2)',
		'tap1': '📗 5 Ải SGK Toán 3 Tập 1 (Học kì 1: Bài 1 → 44)',
		'tap2': '📘 5 Ải SGK Toán 3 Tập 2 (Học kì 2: Bài 45 → 81)',
		'all': '🌟 Tổng hợp cả Tập 1 & Tập 2 (Cả năm: Bài 1 → 81)'
	};

	registerBlockType( 'math-knight/game-block', {
		apiVersion: 2,
		title: 'Hiệp Sĩ Toán Học (Game Toán Lớp 3)',
		description: 'Nhúng trò chơi nhập vai Toán Lớp 3 - Giải Cứu Rừng Pha Lê (SGK Kết nối tri thức Tập 1, Tập 2 & Tổng hợp).',
		category: 'widgets',
		icon: 'awards',
		keywords: [
			'toán lớp 3',
			'hiệp sĩ toán học',
			'math knight',
			'game giáo dục',
			'kết nối tri thức'
		],
		attributes: {
			mode: {
				type: 'string',
				default: 'story'
			},
			book: {
				type: 'string',
				default: 'default'
			},
			stage: {
				type: 'string',
				default: '0'
			},
			timer: {
				type: 'string',
				default: 'default'
			},
			questions: {
				type: 'number',
				default: 0
			},
			lives: {
				type: 'number',
				default: 0
			},
			sgk: {
				type: 'string',
				default: 'default'
			},
			fullscreen: {
				type: 'string',
				default: 'default'
			}
		},

		edit: function ( props ) {
			var attributes    = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps    = useBlockProps( {
				className: 'mk-gutenberg-block-preview'
			} );

			var modeLabel = attributes.mode === 'practice'
				? '🎯 Chế độ Luyện tập tự do'
				: '🗺️ Chế độ Cốt truyện (5 Ải Rừng Pha Lê)';

			var bookLabel = BOOK_LABELS[ attributes.book ] || BOOK_LABELS[ 'default' ];

			var stageLabel = STAGE_LABELS[ attributes.stage ] || STAGE_LABELS[ '0' ];

			var timerLabel = attributes.timer === 'default'
				? 'Theo cấu hình chung'
				: ( attributes.timer === 'true' ? 'Bật đếm ngược' : 'Tắt đếm ngược' );

			var questionsLabel = attributes.questions > 0
				? attributes.questions + ' câu / ải'
				: 'Mặc định (8 câu)';

			var livesLabel = attributes.lives > 0
				? attributes.lives + ' ❤️ Tim'
				: 'Mặc định (3 ❤️ Tim)';

			var fullscreenLabel = attributes.fullscreen === 'default'
				? 'Bật (Nút ⛶ Toàn màn hình / Phím F)'
				: ( attributes.fullscreen === 'true' ? 'Luôn hiện nút ⛶ Toàn màn hình (Phím F)' : 'Ẩn nút Toàn màn hình' );

			return el(
				Fragment,
				null,
				InspectorControls && el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{
							title: '⚙️ Tùy chỉnh Khối Game Toán Lớp 3',
							initialOpen: true
						},
						el( SelectControl, {
							label: 'Chọn Tập SGK / Học kì (Book Mode)',
							value: attributes.book,
							options: [
								{ label: 'Theo Cài đặt chung của Giáo viên', value: 'default' },
								{ label: '📗 5 Ải SGK Toán 3 Tập 1 (Học kì 1: Bài 1 → 44)', value: 'tap1' },
								{ label: '📘 5 Ải SGK Toán 3 Tập 2 (Học kì 2: Bài 45 → 81)', value: 'tap2' },
								{ label: '🌟 Chế độ Tổng hợp Tập 1 & Tập 2 (Cả năm)', value: 'all' }
							],
							onChange: function ( val ) {
								setAttributes( { book: val } );
							}
						} ),
						el( SelectControl, {
							label: 'Chế độ chơi mặc định',
							value: attributes.mode,
							options: [
								{ label: '🗺️ Cốt truyện 5 Ải (Story Mode)', value: 'story' },
								{ label: '🎯 Luyện tập tự chọn (Practice Mode)', value: 'practice' }
							],
							onChange: function ( val ) {
								setAttributes( { mode: val } );
							}
						} ),
						el( SelectControl, {
							label: 'Ải khởi đầu nhanh',
							value: attributes.stage,
							options: [
								{ label: 'Màn hình chính (Học sinh tự chọn)', value: '0' },
								{ label: 'Ải 1 (Màn khởi đầu)', value: '1' },
								{ label: 'Ải 2 (Thử thách thứ 2)', value: '2' },
								{ label: 'Ải 3 (Mê cung thứ 3)', value: '3' },
								{ label: 'Ải 4 (Đỉnh núi thứ 4)', value: '4' },
								{ label: 'Ải 5 (Boss Cuối của Tập)', value: '5' }
							],
							onChange: function ( val ) {
								setAttributes( { stage: val } );
							}
						} ),
						el( SelectControl, {
							label: 'Đồng hồ đếm ngược',
							value: attributes.timer,
							options: [
								{ label: 'Theo Cài đặt chung của Giáo viên', value: 'default' },
								{ label: 'Bật đếm ngược (Tăng kịch tính)', value: 'true' },
								{ label: 'Tắt đếm ngược (Thong thả suy nghĩ)', value: 'false' }
							],
							onChange: function ( val ) {
								setAttributes( { timer: val } );
							}
						} ),
						el( RangeControl, {
							label: 'Số câu hỏi mỗi ải (0 = Mặc định)',
							value: attributes.questions,
							min: 0,
							max: 15,
							step: 1,
							onChange: function ( val ) {
								var num = parseInt( val, 10 ) || 0;
								if ( num > 0 && num < 5 ) {
									num = 5;
								}
								setAttributes( { questions: num } );
							}
						} ),
						el( RangeControl, {
							label: 'Số Tim (HP) ban đầu (0 = Mặc định)',
							value: attributes.lives,
							min: 0,
							max: 5,
							step: 1,
							onChange: function ( val ) {
								setAttributes( { lives: parseInt( val, 10 ) || 0 } );
							}
						} ),
						el( SelectControl, {
							label: 'Hình minh họa SGK Kết nối tri thức',
							value: attributes.sgk,
							options: [
								{ label: 'Theo Cài đặt chung', value: 'default' },
								{ label: 'Hiển thị ảnh cắt từ SGK Toán 3', value: 'true' },
								{ label: 'Chỉ dùng đồ họa SVG tự động', value: 'false' }
							],
							onChange: function ( val ) {
								setAttributes( { sgk: val } );
							}
						} ),
						el( SelectControl, {
							label: 'Chế độ Toàn màn hình (Nút ⛶ / Phím F)',
							value: attributes.fullscreen,
							options: [
								{ label: 'Theo Cài đặt chung (Mặc định: Bật)', value: 'default' },
								{ label: 'Luôn hiển thị nút ⛶ Toàn màn hình & Phím F', value: 'true' },
								{ label: 'Ẩn nút Toàn màn hình', value: 'false' }
							],
							onChange: function ( val ) {
								setAttributes( { fullscreen: val } );
							}
						} )
					)
				),
				el(
					'div',
					blockProps,
					el(
						'div',
						{
							style: {
								background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #0f766e 100%)',
								color: '#ffffff',
								padding: '24px 28px',
								borderRadius: '16px',
								border: '2px solid #facc15',
								boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
								fontFamily: 'system-ui, -apple-system, sans-serif'
							}
						},
						el(
							'div',
							{
								style: {
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									flexWrap: 'wrap',
									gap: '12px',
									marginBottom: '12px'
								}
							},
							el(
								'span',
								{
									style: {
										background: 'rgba(250, 204, 21, 0.2)',
										border: '1px solid #facc15',
										color: '#fef08a',
										fontSize: '12px',
										fontWeight: '700',
										padding: '4px 10px',
										borderRadius: '999px'
									}
								},
								'🛡️ WEB GAME TOÁN LỚP 3 • KẾT NỐI TRI THỨC'
							),
							el(
								'span',
								{
									style: {
										fontSize: '12px',
										color: '#cbd5e1'
									}
								},
								'Shadow DOM Web Component (<math-knight-game>)'
							)
						),
						el(
							'h3',
							{
								style: {
									margin: '0 0 8px 0',
									fontSize: '22px',
									fontWeight: '800',
									color: '#ffffff'
								}
							},
							'⚔️ Hiệp Sĩ Toán Học: Giải Cứu Rừng Pha Lê'
						),
						el(
							'p',
							{
								style: {
									margin: '0 0 16px 0',
									fontSize: '14px',
									color: '#e2e8f0',
									lineHeight: '1.5'
								}
							},
							'Khối trò chơi sẽ tự động hiển thị đầy đủ đồ họa, âm thanh và Bảng xếp hạng khi xem ngoài trang chủ (Frontend). Giáo viên có thể tùy chỉnh thông số ở cột bên phải.'
						),
						el(
							'div',
							{
								style: {
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
									gap: '10px',
									background: 'rgba(15, 23, 42, 0.45)',
									padding: '14px',
									borderRadius: '12px',
									fontSize: '13px'
								}
							},
							el( 'div', null, el( 'strong', { style: { color: '#fef08a' } }, 'Bộ sách / Học kì: ' ), bookLabel ),
							el( 'div', null, el( 'strong', { style: { color: '#fef08a' } }, 'Chế độ: ' ), modeLabel ),
							el( 'div', null, el( 'strong', { style: { color: '#fef08a' } }, 'Ải bắt đầu: ' ), stageLabel ),
							el( 'div', null, el( 'strong', { style: { color: '#fef08a' } }, 'Đếm ngược: ' ), timerLabel ),
							el( 'div', null, el( 'strong', { style: { color: '#fef08a' } }, 'Số câu / Tim: ' ), questionsLabel + ' • ' + livesLabel ),
							el( 'div', null, el( 'strong', { style: { color: '#fef08a' } }, 'Toàn màn hình: ' ), fullscreenLabel )
						)
					)
				)
			);
		},

		save: function () {
			// Sử dụng Server-side Dynamic Rendering (render_callback trong PHP)
			// để luôn gắn đúng REST API Nonce và cấu hình mới nhất của Giáo viên.
			return null;
		}
	} );
} )( window.wp );

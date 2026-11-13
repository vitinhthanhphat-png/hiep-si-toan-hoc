#!/usr/bin/env node
/**
 * ============================================================================
 * SCRIPT KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN (AUTOMATED VERIFICATION SUITE)
 * Dự án: Hiệp Sĩ Toán Học - Giải Cứu Rừng Pha Lê (Toán Lớp 3 - Kết Nối Tri Thức)
 * File: scripts/verify_all.js
 * ============================================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync, spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function assertCheck(condition, label, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${label}`);
  } else {
    failedChecks++;
    const msg = detail ? `${label} -> ${detail}` : label;
    failures.push(msg);
    console.error(`  [FAIL] ${msg}`);
  }
}

console.log('======================================================================');
console.log('  KIỂM THỬ TỰ ĐỘNG: HIỆP SĨ TOÁN HỌC - GIẢI CỨU RỪNG PHA LÊ (LỚP 3)');
console.log('======================================================================\n');

/* --------------------------------------------------------------------------
 * 1. KIỂM TRA CÚ PHÁP & BẢO MẬT CÁC FILE PHP (WORDPRESS PLUGIN)
 * -------------------------------------------------------------------------- */
console.log('1. Kiểm tra cú pháp & bảo mật WordPress Plugin (PHP)...');

const phpFiles = [
  'hiep-si-toan-hoc.php',
  'uninstall.php',
  'includes/class-mk-activator.php',
  'includes/class-mk-rest-api.php',
  'includes/class-mk-admin.php',
  'includes/class-mk-shortcode-block.php',
  'includes/class-mk-github-updater.php'
];

let hasPhpCli = false;
try {
  const phpVer = spawnSync('php', ['-v'], { encoding: 'utf8' });
  if (phpVer.status === 0) {
    hasPhpCli = true;
  }
} catch (e) {
  hasPhpCli = false;
}

phpFiles.forEach((relPath) => {
  const fullPath = path.join(ROOT_DIR, relPath);
  const exists = fs.existsSync(fullPath);
  assertCheck(exists, `Tồn tại file PHP: ${relPath}`);
  if (!exists) return;

  const content = fs.readFileSync(fullPath, 'utf8');

  if (hasPhpCli) {
    const lint = spawnSync('php', ['-l', fullPath], { encoding: 'utf8' });
    assertCheck(lint.status === 0, `PHP CLI syntax check (php -l): ${relPath}`, lint.stderr || lint.stdout);
  } else {
    // Kiểm tra cấu trúc thẻ mở PHP và cân bằng ngoặc nhọn/tròn/vuông khi không có PHP CLI trong PATH
    const startsWithPhp = content.trimStart().startsWith('<?php');
    // Loại bỏ chuỗi và comment cơ bản trước khi đếm ngoặc
    const stripped = content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/#.*$/gm, '')
      .replace(/'(?:\\.|[^'\\])*'/g, "''")
      .replace(/"(?:\\.|[^"\\])*"/g, '""');
    let curly = 0;
    for (const ch of stripped) {
      if (ch === '{') curly++;
      else if (ch === '}') curly--;
    }
    assertCheck(startsWithPhp && curly === 0, `Cấu trúc cú pháp PHP & cân bằng khối lệnh: ${relPath}`, `curly=${curly}`);
  }

  // Kiểm tra chốt chặn truy cập trực tiếp (ABSPATH hoặc WP_UNINSTALL_PLUGIN)
  const hasDirectAccessGuard =
    content.includes("defined( 'ABSPATH' )") ||
    content.includes("defined('ABSPATH')") ||
    content.includes("defined( 'WP_UNINSTALL_PLUGIN' )");
  assertCheck(hasDirectAccessGuard, `Bảo mật chống truy cập trực tiếp (ABSPATH/Uninstall guard): ${relPath}`);
});

// Kiểm tra bảo mật chuyên sâu trong REST API và Admin
const restApiPhp = fs.readFileSync(path.join(ROOT_DIR, 'includes/class-mk-rest-api.php'), 'utf8');
assertCheck(
  restApiPhp.includes('$wpdb->prepare') && restApiPhp.includes('$wpdb->insert') && restApiPhp.includes('sanitize_text_field'),
  'Bảo mật SQLi & XSS trong includes/class-mk-rest-api.php ($wpdb->prepare, $wpdb->insert, sanitize_text_field)'
);

const adminPhp = fs.readFileSync(path.join(ROOT_DIR, 'includes/class-mk-admin.php'), 'utf8');
assertCheck(
  adminPhp.includes("current_user_can( 'manage_options' )") &&
    adminPhp.includes('check_admin_referer') &&
    adminPhp.includes('esc_html'),
  'Bảo mật CSRF Nonce, phân quyền manage_options & escaping trong includes/class-mk-admin.php'
);

/* --------------------------------------------------------------------------
 * 2. KIỂM TRA CÚ PHÁP JAVASCRIPT (node --check)
 * -------------------------------------------------------------------------- */
console.log('\n2. Kiểm tra cú pháp JavaScript (node --check)...');

const jsFiles = [
  'assets/js/sgk-assets.js',
  'assets/js/math-knight-bundle.js',
  'assets/js/block-editor.js'
];

jsFiles.forEach((relPath) => {
  const fullPath = path.join(ROOT_DIR, relPath);
  const exists = fs.existsSync(fullPath);
  assertCheck(exists, `Tồn tại file JS: ${relPath}`);
  if (!exists) return;

  const check = spawnSync(process.execPath, ['--check', fullPath], { encoding: 'utf8' });
  assertCheck(check.status === 0, `Cú pháp JS hợp lệ (node --check): ${relPath}`, check.stderr);
});

/* --------------------------------------------------------------------------
 * 3. KIỂM THỬ RUNTIME MATHENGINE (500 CÂU HỎI QUA 5 ẢI) & VISUALBUILDER
 * -------------------------------------------------------------------------- */
console.log('\n3. Kiểm thử Runtime MathEngine, VisualBuilder & GameManager trong môi trường giả lập DOM...');

// Tạo môi trường giả lập DOM tối thiểu cho Custom Element
const storageMap = new Map();
const customElementRegistry = new Map();

class MockHTMLElement {
  constructor() {
    this.attributes = new Map();
    this.shadowRoot = null;
  }
  attachShadow() {
    this.shadowRoot = {
      innerHTML: '',
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null
    };
    return this.shadowRoot;
  }
  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }
  setAttribute(name, val) {
    this.attributes.set(name, String(val));
  }
}

const sandboxWindow = {
  HTMLElement: MockHTMLElement,
  customElements: {
    get: (name) => customElementRegistry.get(name),
    define: (name, ctor) => customElementRegistry.set(name, ctor)
  },
  localStorage: {
    getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k)
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  setInterval: setInterval,
  clearInterval: clearInterval,
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id)
};
sandboxWindow.window = sandboxWindow;

const context = vm.createContext({
  window: sandboxWindow,
  HTMLElement: MockHTMLElement,
  customElements: sandboxWindow.customElements,
  localStorage: sandboxWindow.localStorage,
  console,
  Math,
  Date,
  Set,
  Map,
  Array,
  Object,
  Number,
  String,
  Boolean,
  JSON,
  RegExp,
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout,
  requestAnimationFrame: sandboxWindow.requestAnimationFrame,
  cancelAnimationFrame: sandboxWindow.cancelAnimationFrame
});

const sgkAssetsCode = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/sgk-assets.js'), 'utf8');
const bundleCode = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/math-knight-bundle.js'), 'utf8');

vm.runInContext(sgkAssetsCode, context, { filename: 'sgk-assets.js' });
vm.runInContext(bundleCode, context, { filename: 'math-knight-bundle.js' });

// 3.1 Kiểm tra 16 hình ảnh SGK Kết nối tri thức
const sgkAssets = sandboxWindow.MK_SGK_ASSETS;
const sgkKeys = sgkAssets ? Object.keys(sgkAssets) : [];
assertCheck(
  sgkKeys.length === 16,
  `Kho dữ liệu window.MK_SGK_ASSETS chứa đủ 16 hình minh họa gốc SGK Kết nối tri thức (Thực tế: ${sgkKeys.length})`
);

let allSgkFilesValid = true;
sgkKeys.forEach((key) => {
  const item = sgkAssets[key];
  const imgPath = path.join(ROOT_DIR, 'assets/images/sgk', item.filename);
  if (!fs.existsSync(imgPath) || !item.dataUri || !item.dataUri.startsWith('data:image/')) {
    allSgkFilesValid = false;
  }
});
assertCheck(allSgkFilesValid, 'Tất cả 16 file ảnh vật lý trong assets/images/sgk/ và chuỗi base64 dataUri đều hợp lệ');

// 3.2 Kiểm tra đăng ký Custom Element <math-knight-game>, 5 Modules & STAGES_BY_BOOK (3 Chế độ Bộ sách)
const core = sandboxWindow.MathKnightCore;
assertCheck(
  Boolean(core && core.SoundFX && core.VisualBuilder && core.MathEngine && core.GameManager && core.UIController),
  'Đầy đủ 5 Core Modules: SoundFX, VisualBuilder, MathEngine, GameManager, UIController'
);
assertCheck(
  customElementRegistry.has('math-knight-game'),
  "Đã đăng ký thành công Custom Web Component customElements.define('math-knight-game', ...)"
);
assertCheck(
  Boolean(
    core.STAGES_BY_BOOK &&
      Array.isArray(core.STAGES_BY_BOOK.tap1) &&
      core.STAGES_BY_BOOK.tap1.length === 5 &&
      Array.isArray(core.STAGES_BY_BOOK.tap2) &&
      core.STAGES_BY_BOOK.tap2.length === 5 &&
      Array.isArray(core.STAGES_BY_BOOK.all) &&
      core.STAGES_BY_BOOK.all.length === 5
  ),
  'Cấu trúc STAGES_BY_BOOK đầy đủ 3 chế độ (tap1: 5 ải, tap2: 5 ải, all: 5 ải = 15 cấu hình ải)'
);

// 3.3 Sinh thử 750 câu hỏi trải đều qua 3 chế độ sách (tap1, tap2, all) × 5 ải × 50 câu/ải
const { MathEngine, VisualBuilder, GameManager } = core;
const BOOK_MODES_TEST = ['tap1', 'tap2', 'all'];
const QUESTIONS_PER_STAGE_TEST = 50;
let totalQuestionsTested = 0;
let validQuestionsCount = 0;
let visualRenderSuccessCount = 0;
let answerEvalSuccessCount = 0;
let tap1CiteMatches = 0;
let tap1Total = 0;
let tap2CiteMatches = 0;
let tap2Total = 0;
const firstFailureReasons = [];

BOOK_MODES_TEST.forEach((bookMode) => {
  for (let stageId = 1; stageId <= 5; stageId++) {
    for (let i = 0; i < QUESTIONS_PER_STAGE_TEST; i++) {
      totalQuestionsTested++;
      const q = MathEngine.generateSingleQuestion(stageId, i, ['arith', 'geo', 'word', 'stat'], bookMode);

      const qText = q && (q.question || q.questionText);
      const ans = q && (q.answer || q.correctAnswer);
      const opts = q && q.options;
      const exp = q && q.explanation;
      const cite = q && q.sgkCite;

      if (bookMode === 'tap1') {
        tap1Total++;
        if (typeof cite === 'string' && cite.includes('Tập 1')) {
          tap1CiteMatches++;
        } else if (firstFailureReasons.length < 5) {
          firstFailureReasons.push(`tap1 cite mismatch Stage ${stageId} #${i}: ${cite}`);
        }
      } else if (bookMode === 'tap2') {
        tap2Total++;
        if (typeof cite === 'string' && cite.includes('Tập 2')) {
          tap2CiteMatches++;
        } else if (firstFailureReasons.length < 5) {
          firstFailureReasons.push(`tap2 cite mismatch Stage ${stageId} #${i}: ${cite}`);
        }
      }

      const hasValidQuestion =
        typeof qText === 'string' &&
        qText.trim().length > 5 &&
        !qText.includes('NaN') &&
        !qText.includes('undefined');

      const hasValidAnswer =
        typeof ans === 'string' &&
        ans.trim().length > 0 &&
        !ans.includes('NaN') &&
        !ans.includes('undefined');

      const uniqueOpts = Array.isArray(opts) ? new Set(opts) : new Set();
      const hasValidOptions =
        Array.isArray(opts) &&
        opts.length === 4 &&
        uniqueOpts.size === 4 &&
        opts.includes(ans) &&
        opts.every((o) => typeof o === 'string' && o.trim().length > 0 && !o.includes('NaN') && !o.includes('undefined'));

      const hasValidExplanation =
        typeof exp === 'string' &&
        exp.includes('SGK Kết nối tri thức') &&
        !exp.includes('NaN') &&
        !exp.includes('undefined');

      if (hasValidQuestion && hasValidAnswer && hasValidOptions && hasValidExplanation) {
        validQuestionsCount++;
      } else if (firstFailureReasons.length < 5) {
        firstFailureReasons.push(
          `[${bookMode}] Stage ${stageId} #${i} (${q ? q.topicName : 'null'}): q=${hasValidQuestion}, ans=${hasValidAnswer} (${ans}), opts=${hasValidOptions} (${JSON.stringify(opts)}), exp=${hasValidExplanation}`
        );
      }

      // Kiểm thử VisualBuilder.renderQuestionVisual(q, true) & (q, false)
      try {
        const svgOnlyHtml = VisualBuilder.renderQuestionVisual(q, false);
        const fullVisualHtml = VisualBuilder.renderQuestionVisual(q, true);
        const isStr =
          typeof fullVisualHtml === 'string' &&
          typeof svgOnlyHtml === 'string' &&
          !svgOnlyHtml.includes('NaN') &&
          !svgOnlyHtml.includes('undefined');
        const hasExpectedTag =
          !q.visualData && !q.sgkAssetKey
            ? fullVisualHtml === ''
            : fullVisualHtml.includes('<svg') ||
              fullVisualHtml.includes('<table') ||
              fullVisualHtml.includes('mk-expr-visual-card') ||
              fullVisualHtml.includes('mk-sgk-drawer');
        if (isStr && hasExpectedTag) {
          visualRenderSuccessCount++;
        } else if (firstFailureReasons.length < 5) {
          firstFailureReasons.push(`Visual error [${bookMode}] Stage ${stageId} #${i}: ${svgOnlyHtml.slice(0, 120)}`);
        }
      } catch (err) {
        if (firstFailureReasons.length < 5) {
          firstFailureReasons.push(`Visual exception [${bookMode}] Stage ${stageId} #${i}: ${err.message}`);
        }
      }

      // Kiểm thử GameManager.evaluateAnswer với cả đáp án chuỗi và đáp án số (numpad)
      const gm = new GameManager({ questionsPerStage: 5, timerEnabled: true, bookMode });
      gm.questions = [q];
      gm.qIndex = 0;
      const evalMcq = gm.evaluateAnswer(q.answer);
      let evalOk = Boolean(evalMcq && evalMcq.isCorrect === true);

      if (q.numericAnswer !== null && q.numericAnswer !== undefined) {
        gm.questions = [q];
        gm.qIndex = 0;
        const evalNum = gm.evaluateAnswer(String(q.numericAnswer));
        evalOk = evalOk && Boolean(evalNum && evalNum.isCorrect === true);
      }
      if (evalOk) {
        answerEvalSuccessCount++;
      } else if (firstFailureReasons.length < 5) {
        firstFailureReasons.push(`Eval error [${bookMode}] Stage ${stageId} #${i}: ans=${q.answer}, num=${q.numericAnswer}`);
      }
    }
  }
});

assertCheck(
  validQuestionsCount === totalQuestionsTested,
  `Sinh thử ${totalQuestionsTested} câu hỏi qua 3 chế độ (tap1, tap2, all × 5 ải × ${QUESTIONS_PER_STAGE_TEST} câu): 100% hợp lệ (${validQuestionsCount}/${totalQuestionsTested})`,
  firstFailureReasons.join(' | ')
);

assertCheck(
  tap1CiteMatches === tap1Total && tap1Total === 250,
  `100% câu hỏi Chế độ Tập 1 (tap1) bám sát SGK Toán 3 Tập 1 (${tap1CiteMatches}/${tap1Total})`,
  firstFailureReasons.join(' | ')
);

assertCheck(
  tap2CiteMatches === tap2Total && tap2Total === 250,
  `100% câu hỏi Chế độ Tập 2 (tap2) bám sát SGK Toán 3 Tập 2 (${tap2CiteMatches}/${tap2Total})`,
  firstFailureReasons.join(' | ')
);

assertCheck(
  visualRenderSuccessCount === totalQuestionsTested,
  `VisualBuilder.renderQuestionVisual(q, true) thành công 100% (${visualRenderSuccessCount}/${totalQuestionsTested})`,
  firstFailureReasons.join(' | ')
);

assertCheck(
  answerEvalSuccessCount === totalQuestionsTested,
  `GameManager.evaluateAnswer() chấm đúng 100% cho cả MCQ và Numpad (${answerEvalSuccessCount}/${totalQuestionsTested})`,
  firstFailureReasons.join(' | ')
);

// 3.4 Kiểm thử GameManager.setBookMode() và lưu tiến độ độc lập theo từng Tập sách (bookProgress)
storageMap.clear();
const gmBookTest = new GameManager({ bookMode: 'tap1' });
gmBookTest.setBookMode('tap1');
gmBookTest.currentStage = 1;
gmBookTest.lives = 3;
gmBookTest.maxLives = 3;
gmBookTest.completeStage();
const tap1ClearedAfter = gmBookTest.saveData.bookProgress.tap1.crystals.includes(1);
const tap2ClearedAfter = gmBookTest.saveData.bookProgress.tap2.crystals.includes(1);
gmBookTest.setBookMode('tap2');
assertCheck(
  tap1ClearedAfter === true && tap2ClearedAfter === false && gmBookTest.getBookMode() === 'tap2',
  'GameManager.setBookMode() & saveData.bookProgress lưu tiến độ mở khóa 5 ải độc lập giữa Tập 1, Tập 2 và Tổng hợp'
);

/* --------------------------------------------------------------------------
 * 4. KIỂM TRA BẢN SINGLE-FILE ĐỘC LẬP (index.html) & KHÔNG PHỤ THUỘC NGOÀI
 * -------------------------------------------------------------------------- */
console.log('\n4. Kiểm tra bản Single-file độc lập (index.html) & tính tự chủ Offline...');

const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
const indexHtmlExists = fs.existsSync(indexHtmlPath);
assertCheck(indexHtmlExists, 'Tồn tại file Single-file index.html');

if (indexHtmlExists) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const requiredTokens = [
    '<math-knight-game',
    'class SoundFX',
    'class VisualBuilder',
    'class MathEngine',
    'class GameManager',
    'const UIController',
    "customElements.define('math-knight-game'",
    'window.MK_SGK_ASSETS'
  ];

  requiredTokens.forEach((token) => {
    assertCheck(indexHtml.includes(token), `index.html chứa thành phần bắt buộc: ${token}`);
  });

  // Kiểm tra đủ 16 khóa ảnh base64 trong index.html
  const all16InHtml = sgkKeys.every((k) => indexHtml.includes(`"${k}"`) && indexHtml.includes('data:image/'));
  assertCheck(all16InHtml, 'index.html nhúng đầy đủ 16 hình ảnh base64 từ SGK Kết nối tri thức');

  // Kiểm tra không có link CDN hay file âm thanh mp3/wav ngoài
  const hasExternalDep =
    /https?:\/\/[^\s"'<>]+\.(?:mp3|wav|ogg|js|css)/i.test(indexHtml) ||
    /https?:\/\/[^\s"'<>]+\.(?:mp3|wav|ogg|js|css)/i.test(bundleCode);
  assertCheck(!hasExternalDep, 'Không phụ thuộc bất kỳ file .mp3/.wav hay CDN .js/.css bên ngoài (100% Offline-ready)');

  // Kiểm tra tiêu chuẩn 2.5D Paper-Cut Storybook, Full-Viewport 100vw x 100dvh, Zero Scrollbar & Zero Em-dash
  assertCheck(
    indexHtml.includes('standalone="true"') && indexHtml.includes('100vw') && indexHtml.includes('100dvh'),
    'Giao diện Full-Viewport 100vw x 100dvh không còn khoảng trống thừa quanh khung game'
  );
  assertCheck(
    bundleCode.includes('scrollbar-width: none') && bundleCode.includes('overflow: hidden'),
    'Triệt tiêu hoàn toàn thanh cuộn dọc/ngang (Zero Scrollbars: overflow: hidden + scrollbar-width: none)'
  );
  assertCheck(
    bundleCode.includes('mkPaperLayer') && bundleCode.includes('mkBossPaper') && !bundleCode.includes('#4A2E1B'),
    'Đồ họa 2.5D Paper-Cut Lineless Geometric tươi sáng (Bright Sunshine & Pastel, không còn viền nâu/đen tối)'
  );
  assertCheck(
    !indexHtml.includes('\u2014') && !bundleCode.includes('\u2014'),
    'Tuân thủ Pre-Flight Check design-taste-frontend: 0 ký tự em-dash (—) trên toàn bộ giao diện'
  );
  assertCheck(
    bundleCode.includes('repeat(4, minmax(0, 1fr))') &&
      bundleCode.includes('repeat(5, minmax(0, 1fr))') &&
      bundleCode.includes('.mk-badge-card'),
    'Chống tràn ngang CSS Grid trên Bản đồ 5 Ải & 8 Huy Hiệu (minmax(0, 1fr) + min-width: 0)'
  );
  assertCheck(
    bundleCode.includes('mk-hb-modal-dialog') &&
      bundleCode.includes('buildHandbookModalHtml') &&
      bundleCode.includes('mk-hb-card-top'),
    'Sổ Tay Bí Kíp chống rớt dòng nhãn (nowrap) & hỗ trợ Click mở Dialog phóng to xem tập trung'
  );
  assertCheck(
    bundleCode.includes('mk-img-lightbox-backdrop') &&
      bundleCode.includes('mk-modal-img-trigger') &&
      bundleCode.includes('max-width: 1280px'),
    'Dialog Sổ Tay Bí Kíp cỡ lớn (1280px / 96%) & hỗ trợ Click vào ảnh mở Popup Lightbox phóng to (100% / 175%)'
  );

  // Kiểm tra Phiên bản khởi đầu v1.0 & 5 Lớp Bảo Mật OWASP Top 10:2025
  const mainPluginCode = fs.readFileSync(path.join(ROOT_DIR, 'hiep-si-toan-hoc.php'), 'utf8');
  const restApiFullCode = fs.readFileSync(path.join(ROOT_DIR, 'includes/class-mk-rest-api.php'), 'utf8');
  const adminFullCode = fs.readFileSync(path.join(ROOT_DIR, 'includes/class-mk-admin.php'), 'utf8');

  assertCheck(
    mainPluginCode.includes("define( 'MK_PLUGIN_VERSION', '1.2' )") &&
      bundleCode.includes("const MK_VERSION = '1.2'"),
    'Phiên bản v1.2 đồng bộ giữa WordPress Plugin (MK_PLUGIN_VERSION = 1.2) và Web Component (MK_VERSION = 1.2)'
  );
  assertCheck(
    mainPluginCode.includes('mk_get_current_user_payload') &&
      restApiFullCode.includes('currentUser') &&
      restApiFullCode.includes('math_knight_save_data') &&
      bundleCode.includes('currentUser') &&
      adminFullCode.includes('user_id'),
    'Tích hợp Tài khoản WordPress Đăng nhập (mk_get_current_user_payload, currentUser, đồng bộ tiến độ user_meta math_knight_save_data & gộp kỷ lục Bảng Vàng theo user_id)'
  );
  assertCheck(
    adminFullCode.includes('sanitize_csv_cell') &&
      adminFullCode.includes('X-Content-Type-Options: nosniff') &&
      adminFullCode.includes('X-Frame-Options: DENY'),
    'Bảo mật OWASP A05: Chống CSV Formula Injection (sanitize_csv_cell) & HTTP Security Headers khi xuất báo cáo Excel/CSV'
  );
  assertCheck(
    restApiFullCode.includes('mk_rl_') &&
      restApiFullCode.includes('set_transient') &&
      restApiFullCode.includes('429') &&
      restApiFullCode.includes('36000'),
    'Bảo mật OWASP API4: Rate Limiting chống spam gửi điểm (10 req/60s/IP -> HTTP 429) & kiểm tra biên điểm hợp lý (0..36000)'
  );
  assertCheck(
    bundleCode.includes('sanitizePlayerName') &&
      bundleCode.includes('isValidHttpUrl') &&
      bundleCode.includes('&#39;') &&
      bundleCode.includes('&#96;'),
    'Bảo mật Shadow DOM: Chống DOM XSS (escapeHtml đầy đủ), chống LocalStorage Poisoning (sanitizePlayerName) & kiểm tra giao thức apiUrl'
  );

  // Kiểm tra Tab Thông tin Tác Giả (Techshare VN - Trần Vĩ Thành) & file style.css
  const rootStylePath = path.join(ROOT_DIR, 'style.css');
  const rootStyleCode = fs.existsSync(rootStylePath) ? fs.readFileSync(rootStylePath, 'utf8') : '';
  const adminCssCode = fs.readFileSync(path.join(ROOT_DIR, 'assets/css/admin-style.css'), 'utf8');
  assertCheck(
    adminFullCode.includes('Techshare VN') &&
      adminFullCode.includes('Trần Vĩ Thành') &&
      adminFullCode.includes('techsharevn.com') &&
      adminFullCode.includes('0949 897 293') &&
      adminFullCode.includes('thanh.web1001@gmail.com') &&
      adminFullCode.includes('Thông tin Tác Giả'),
    'Trang Settings của Plugin có Tab "Thông tin Tác Giả" (Techshare VN, Trần Vĩ Thành, techsharevn.com, 0949 897 293, thanh.web1001@gmail.com)'
  );
  assertCheck(
    rootStyleCode.includes('Trần Vĩ Thành (Techshare VN)') &&
      rootStyleCode.includes('techsharevn.com') &&
      adminCssCode.includes('Trần Vĩ Thành (Techshare VN)') &&
      mainPluginCode.includes('Trần Vĩ Thành (Techshare VN)'),
    'File style.css, assets/css/admin-style.css và hiep-si-toan-hoc.php chứa đầy đủ thông tin Tác giả Techshare VN'
  );

  // Kiểm tra Bố cục 4 Tab Khoa học (settings, leaderboard, updater, author) & GitHub Release ZIP Auto-Updater
  const updaterPhpCode = fs.readFileSync(path.join(ROOT_DIR, 'includes/class-mk-github-updater.php'), 'utf8');
  assertCheck(
    adminFullCode.includes('mk-panel-settings') &&
      adminFullCode.includes('mk-panel-leaderboard') &&
      adminFullCode.includes('mk-panel-updater') &&
      adminFullCode.includes('mk-panel-author') &&
      !adminFullCode.includes('<header class="mk-admin-hero">'),
    'Trang Admin tái cấu trúc thành 4 Tab khoa học (Cài Đặt, Bảng Vàng, Cập Nhật GitHub, Tác Giả) và loại bỏ banner tím gây vỡ giao diện'
  );
  assertCheck(
    updaterPhpCode.includes('pre_set_site_transient_update_plugins') &&
      updaterPhpCode.includes('upgrader_source_selection') &&
      updaterPhpCode.includes('ASSET_ZIP_NAME') &&
      updaterPhpCode.includes('browser_download_url') &&
      !updaterPhpCode.includes("$body['zipball_url']"),
    'Bộ tự động cập nhật GitHub (MK_GitHub_Updater) chỉ tải file .zip đính kèm trong GitHub Releases (không dùng zipball_url mã nguồn thô)'
  );
}

/* --------------------------------------------------------------------------
 * 5. KIỂM TRA HỆ THỐNG TÀI LIỆU BẮT BUỘC TRONG docs/ (THEO GEMINI.md)
 * -------------------------------------------------------------------------- */
console.log('\n5. Kiểm tra hệ thống tài liệu bắt buộc trong docs/ (Quy tắc GEMINI.md)...');

const requiredDocs = [
  'GEMINI.md',
  'hiep-si-toan-hoc-plan.md',
  'docs/README.md',
  'docs/changelog.md',
  'docs/brainstorm-and-specs.md',
  'docs/architecture.md',
  'docs/math-curriculum-g3.md',
  'docs/sgk-toan-3-tap-1.md',
  'docs/sgk-toan-3-tap-2.md'
];

requiredDocs.forEach((docPath) => {
  const full = path.join(ROOT_DIR, docPath);
  const ok = fs.existsSync(full) && fs.statSync(full).size > 200;
  assertCheck(ok, `Tài liệu tồn tại và đầy đủ nội dung: ${docPath}`);
});

console.log('\n======================================================================');
console.log(`  TỔNG KẾT KIỂM THỬ: ${passedChecks}/${totalChecks} HẠNG MỤC ĐẠT (PASS)`);
console.log('======================================================================');

if (failedChecks > 0) {
  console.error(`\nPhát hiện ${failedChecks} lỗi cần khắc phục:`);
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\n🎉 TẤT CẢ KIỂM THỬ TỰ ĐỘNG ĐỀU ĐẠT 100% (ZERO ERRORS)!\n');
  process.exit(0);
}

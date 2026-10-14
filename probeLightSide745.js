#!/usr/bin/env node
/* 微光小鎮 實驗線 — T745 四視角英式建築的受光方向（不開 Chrome、不跑遊戲）
 *
 * 擋什麼：GPT-008～014 的四視角英式建築（k139、k274–293），亮面／暗面材質綁在「世界座標」的牆上
 *   （S.box(…, brick(false), brick(true), …)），視角 1、3 轉過去之後暗面落到畫面左邊、亮面落到右邊，
 *   跟遊戲其他建築「左上受光」相反。T739 的 use021 工具包用 dark(nx,ny) 先把法向量照視角轉回畫面再判斷，沒有這個問題。
 *
 * 量法：在 Node vm 用純像素假畫布直接跑美術原始碼（作法同 probeUse021Fp740.js），每棟每個視角，用兩把同材質的尺
 *   （排除石材、玻璃、招牌等顏色干擾）：
 *   - 紅磚：暗紅磚落在畫面左半的比例。左上受光 ⇒ 暗面在右 ⇒ 該比例 < 0.5；
 *   - 石材：只有亮面才用的亮石（stone、stoneHi）落在右半的比例。左上受光 ⇒ 亮面在左 ⇒ 該比例 < 0.5。
 *   該材質不足 200 像素的不計。比例 > 0.5 就算那一棟那個視角「光向反了」。
 *
 * 門檻（--check）：每把尺、每個視角，「光向反了」的棟數 ≤ 視角 0、2 兩者較多的那個 + 1，而且平均比例 ≤ 0.5。
 * 釘值（probeLightSide745.pins.json，修前的舊圖）：
 *   full_<k>_v<n>：四個視角的整張像素（透明像素歸零後的 RGBA）SHA256；shape_<k>_v<n>：視角 1、3 的不透明遮罩 SHA256。
 *   --check：視角 0、2 的 full 必須不變；視角 1、3 的 shape 必須不變（修光向只准改視角 1、3 的顏色）。
 *   --valve：設 globalThis.__noLightFix745=true 再跑（逃生閥），四個視角的 full 都必須等於舊圖。
 * 嵌入：9 份原始碼都要原樣出現在 index.html（遊戲跑的是嵌入的副本）。
 *
 * 用法：node probeLightSide745.js              只報告，exit 0
 *       node probeLightSide745.js --check      光向、釘值、嵌入三項都過才 exit 0（修好之前光向是紅的）
 *       node probeLightSide745.js --valve      逃生閥開時四個視角都等於舊圖、嵌入一致才 exit 0
 *       node probeLightSide745.js --write-pins 重寫釘值（只有業主或卡上明寫「核准改視角 0、2 或形狀」時才准用；修光向的卡不准用）
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = __dirname;
const CHECK = process.argv.includes('--check');
const WRITE_PINS = process.argv.includes('--write-pins');
const VALVE = process.argv.includes('--valve');
const PIN_PATH = path.join(ROOT, 'probeLightSide745.pins.json');
const crypto = require('crypto');
const FILES = [   // 依賴順序：primitives014 給 GPT-014 三份用
  'british-complex-primitives014.js',
  'british-station-art008.js', 'british-streetlife-art009.js', 'british-museum-art010.js',
  'british-riverside-art012.js', 'british-theatre-art013.js',
  'british-complexes-art014.js', 'british-college-manor-art014.js', 'british-baths-fire-art014.js',
];
const hexes = a => new Set(a.map(h => parseInt(h, 16)));
const BRICK_DARK = hexes(['794a41', '895142', '6e423a', '995e49']), BRICK_LIGHT = hexes(['a45c4c', 'b36a52', '915144', 'c18061']);
const STONE_LIGHT = hexes(['d4c7ac', 'e3d5ba']);

function canvas() {
  const c = { width: 0, height: 0, data: null };
  c.getContext = () => ({
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
    putImageData: p => { c.data = new Uint8ClampedArray(p.data); },
    getImageData: () => ({ data: c.data }),
  });
  return c;
}
// 遊戲跑的是嵌在 index.html 裡的副本：每份原始碼都要原樣出現在 index.html，否則只改檔不改遊戲（或反過來）會騙過這支探針
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const embedBad = FILES.filter(f => !HTML.includes(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const ctx = vm.createContext({ document: { createElement: () => canvas() }, Math, console });
if (VALVE) ctx.__noLightFix745 = true;   // 逃生閥：模組讀 root.__noLightFix745（瀏覽器是 window，這裡是 globalThis）
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });

function measure(cv) {   // 回傳 { brick: 暗紅磚在左半比例 or null, stone: 亮石在右半比例 or null }
  const w = cv.width, h = cv.height, d = cv.data; if (!d) return null;
  let minX = w, maxX = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 40) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  const mid = (minX + maxX) >> 1; let bdL = 0, bdR = 0, bl = 0, slL = 0, slR = 0;
  for (let y = 0; y < h; y++) for (let x = minX; x <= maxX; x++) {
    const i = (y * w + x) * 4; if (d[i + 3] <= 40) continue;
    const v = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
    if (BRICK_DARK.has(v)) (x <= mid ? bdL++ : bdR++); else if (BRICK_LIGHT.has(v)) bl++;
    else if (STONE_LIGHT.has(v)) (x <= mid ? slL++ : slR++);
  }
  return { brick: (bdL + bdR + bl >= 200 && bdL + bdR > 0) ? bdL / (bdL + bdR) : null, stone: (slL + slR >= 200) ? slR / (slL + slR) : null };
}

const per = {};   // k -> [views]
for (const name of Object.keys(ctx)) {
  const M = ctx[name];
  if (!M || typeof M !== 'object' || typeof M.buildAll !== 'function') continue;
  let all; try { all = M.buildAll(); } catch (e) { console.log('X ' + name + '.buildAll 例外：' + e.message); process.exit(1); }
  const b = all && all.buildings; if (!b) continue;
  for (const [k, views] of Object.entries(b)) if (Array.isArray(views) && views.length >= 4) per[k] = views;
}
const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');
function fullOf(cv) { const a = new Uint8Array(cv.data); for (let i = 0; i < a.length; i += 4) if (a[i + 3] === 0) a[i] = a[i + 1] = a[i + 2] = 0; return sha(a); }
function shapeOf(cv) { const m = new Uint8Array(cv.data.length / 4); for (let i = 0, j = 3; i < m.length; i++, j += 4) m[i] = cv.data[j] > 0 ? 1 : 0; return crypto.createHash('sha256').update(Buffer.from([cv.width & 255, cv.width >> 8, cv.height & 255, cv.height >> 8])).update(m).digest('hex'); }
const pins = {};
for (const [k, views] of Object.entries(per)) views.slice(0, 4).forEach((a, v) => {
  if (!a || !a.img || !a.img.data) return;
  pins['full_' + k + '_v' + v] = fullOf(a.img);
  if (v === 1 || v === 3) pins['shape_' + k + '_v' + v] = shapeOf(a.img);
});
if (WRITE_PINS) {
  if (VALVE) { console.log('X --write-pins 不能跟 --valve 並用'); process.exit(1); }
  fs.writeFileSync(PIN_PATH, JSON.stringify(pins, null, 1) + '\n'); console.log('已寫入釘值 ' + Object.keys(pins).length + ' 筆：' + PIN_PATH); process.exit(0);
}
let saved = null; try { saved = JSON.parse(fs.readFileSync(PIN_PATH, 'utf8')); } catch (e) {}
const want = saved ? Object.keys(saved).filter(key => VALVE ? key.startsWith('full_') : (key.startsWith('shape_') || /_v[02]$/.test(key))) : [];
const pinBad = [];
if (!saved) pinBad.push('讀不到 ' + path.basename(PIN_PATH));
else for (const key of want) if (pins[key] !== saved[key]) pinBad.push(key + (pins[key] ? ' 變了' : ' 不見了'));

// 光向：每把尺、每個視角
const MAT = { brick: '紅磚（暗磚在左＝反）', stone: '石材（亮石在右＝反）' };
const tally = {};
for (const m of Object.keys(MAT)) {
  tally[m] = [0, 1, 2, 3].map(v => { const rows = [];
    for (const [k, views] of Object.entries(per)) { const a = views[v]; const r = a && a.img && measure(a.img); if (r && r[m] !== null) rows.push({ k, x: r[m] }); }
    const n = rows.length, mean = n ? rows.reduce((s, r) => s + r.x, 0) / n : 0, flipped = rows.filter(r => r.x > 0.5).map(r => r.k);
    return { n, mean, flipped }; });
}
console.log('');
console.log('=== T745 四視角英式建築受光方向（左上受光）' + (VALVE ? '：逃生閥開' : '') + ' ===');
console.log('  建築 ' + Object.keys(per).length + ' 棟（' + Object.keys(per).sort((a, b) => a - b).join(', ') + '）');
let bad = 0;
for (const m of Object.keys(MAT)) {
  const t = tally[m], limit = Math.max(t[0].flipped.length, t[2].flipped.length) + 1;
  console.log('  ' + MAT[m] + '：視角 1、3 的門檻 ≤ ' + limit + ' 棟');
  t.forEach((r, v) => {
    const ok = (v === 0 || v === 2) || (r.flipped.length <= limit && r.mean <= 0.5);
    if (!ok) bad++;
    console.log('    視角 ' + v + '：計入 ' + r.n + ' 棟，平均 ' + (r.mean * 100).toFixed(0) + '%，光向反了 ' + r.flipped.length + ' 棟' + (ok ? '' : '  ✗') + (r.flipped.length ? '（' + r.flipped.map(k => 'k' + k).join(' ') + '）' : ''));
  });
}
console.log('  釘值（' + (VALVE ? '逃生閥開：四個視角整張像素等於舊圖' : '視角 0、2 整張像素；視角 1、3 形狀') + '）：' + (pinBad.length ? pinBad.length + ' 筆不符：' + pinBad.slice(0, 8).join('、') + (pinBad.length > 8 ? ' …' : '') : want.length + ' 筆全對'));
console.log('  嵌入 index.html：' + (embedBad.length ? embedBad.length + ' 份跟檔案不同：' + embedBad.join('、') : FILES.length + ' 份都原樣嵌在裡面'));
if (VALVE) {
  if (pinBad.length || embedBad.length) { console.log('X --valve：' + [pinBad.length ? '逃生閥開時跟舊圖不同 ' + pinBad.length + ' 筆' : '', embedBad.length ? '嵌入不符 ' + embedBad.length + ' 份' : ''].filter(Boolean).join('；')); process.exit(1); }
  console.log('OK --valve：逃生閥開時四個視角都等於舊圖'); process.exit(0);
}
if (CHECK && (bad || pinBad.length || embedBad.length)) { console.log('X --check：' + [bad ? bad + ' 處光向反了' : '', pinBad.length ? '釘值不符 ' + pinBad.length + ' 筆' : '', embedBad.length ? '嵌入不符 ' + embedBad.length + ' 份' : ''].filter(Boolean).join('；')); process.exit(1); }
console.log(CHECK ? 'OK --check：光向、釘值、嵌入都過' : '（只報告；加 --check 或 --valve 才判紅綠）');

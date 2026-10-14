#!/usr/bin/env node
/* 微光小鎮 實驗線 — T745 四視角英式建築的受光方向（不開 Chrome、不跑遊戲）
 *
 * 擋什麼：GPT-008～014 的四視角英式建築（k139、k274–293），亮面／暗面材質綁在「世界座標」的牆上
 *   （S.box(…, brick(false), brick(true), …)），視角 1、3 轉過去之後暗面落到畫面左邊、亮面落到右邊，
 *   跟遊戲其他建築「左上受光」相反。T739 的 use021 工具包用 dark(nx,ny) 先把法向量照視角轉回畫面再判斷，沒有這個問題。
 *
 * 量法：在 Node vm 用純像素假畫布直接跑美術原始碼（作法同 probeUse021Fp740.js），每棟每個視角，
 *   只看「亮紅磚」與「暗紅磚」兩組調色盤的像素（同一種材質，排除石材、玻璃等顏色干擾），
 *   算暗紅磚落在畫面左半的比例 darkLeft。左上受光 ⇒ 暗面在右 ⇒ darkLeft < 0.5。紅磚少於 200 像素的不計。
 *
 * 釘值（probeLightSide745.pins.json）：修光向只准改視角 1、3 的「顏色」——
 *   視角 0、2：整張像素（透明像素歸零後的 RGBA）SHA256 必須不變；
 *   視角 1、3：不透明遮罩（形狀）SHA256 必須不變。
 * 嵌入：9 份原始碼都要原樣出現在 index.html（遊戲跑的是嵌入的副本）。
 *
 * 用法：node probeLightSide745.js              只報告（每個視角的平均 darkLeft、暗面在左的棟數、釘值對不對），exit 0
 *       node probeLightSide745.js --check      ① 每個視角「暗面在左的棟數 ≤ 計入棟數的一半」② 釘值全對；任一不符 exit 1
 *                                              （修好之前 ① 是紅的；修光向的卡要把它轉綠，並把 --check 掛進 smoke.js）
 *       node probeLightSide745.js --write-pins 重寫釘值（只有業主或卡上明寫「核准改視角 0、2 或形狀」時才准用）
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = __dirname;
const CHECK = process.argv.includes('--check');
const WRITE_PINS = process.argv.includes('--write-pins');
const PIN_PATH = path.join(ROOT, 'probeLightSide745.pins.json');
const crypto = require('crypto');
const FILES = [   // 依賴順序：primitives014 給 GPT-014 三份用
  'british-complex-primitives014.js',
  'british-station-art008.js', 'british-streetlife-art009.js', 'british-museum-art010.js',
  'british-riverside-art012.js', 'british-theatre-art013.js',
  'british-complexes-art014.js', 'british-college-manor-art014.js', 'british-baths-fire-art014.js',
];
const LIGHT = new Set(['a45c4c', 'b36a52', '915144', 'c18061'].map(h => parseInt(h, 16)));
const DARK = new Set(['794a41', '895142', '6e423a', '995e49'].map(h => parseInt(h, 16)));

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
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });

function side(cv) {
  const w = cv.width, h = cv.height, d = cv.data; if (!d) return null;
  let minX = w, maxX = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 40) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  const mid = (minX + maxX) >> 1; let dL = 0, dR = 0, lL = 0, lR = 0;
  for (let y = 0; y < h; y++) for (let x = minX; x <= maxX; x++) {
    const i = (y * w + x) * 4; if (d[i + 3] <= 40) continue;
    const v = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
    if (DARK.has(v)) (x <= mid ? dL++ : dR++); else if (LIGHT.has(v)) (x <= mid ? lL++ : lR++);
  }
  return { dL, dR, lL, lR };
}

const per = {};   // k -> [views]
for (const name of Object.keys(ctx)) {
  const M = ctx[name];
  if (!M || typeof M !== 'object' || typeof M.buildAll !== 'function') continue;
  let all; try { all = M.buildAll(); } catch (e) { console.log('X ' + name + '.buildAll 例外：' + e.message); process.exit(1); }
  const b = all && all.buildings; if (!b) continue;
  for (const [k, views] of Object.entries(b)) if (Array.isArray(views) && views.length >= 4) per[k] = views;
}
function pinOf(cv, v) {   // 視角 0、2：整張像素；視角 1、3：只看形狀
  const d = cv.data; if (!d) return null;
  if (v === 0 || v === 2) { const a = new Uint8Array(d); for (let i = 0; i < a.length; i += 4) if (a[i + 3] === 0) a[i] = a[i + 1] = a[i + 2] = 0; return crypto.createHash('sha256').update(a).digest('hex'); }
  const m = new Uint8Array(d.length / 4); for (let i = 0, j = 3; i < m.length; i++, j += 4) m[i] = d[j] > 0 ? 1 : 0;
  return crypto.createHash('sha256').update(Buffer.from([cv.width & 255, cv.width >> 8, cv.height & 255, cv.height >> 8])).update(m).digest('hex');
}
const pins = {};
for (const [k, views] of Object.entries(per)) views.slice(0, 4).forEach((a, v) => { const h = a && a.img && pinOf(a.img, v); if (h) pins[k + '_v' + v] = h; });
if (WRITE_PINS) { fs.writeFileSync(PIN_PATH, JSON.stringify(pins, null, 1) + '\n'); console.log('已寫入釘值 ' + Object.keys(pins).length + ' 筆：' + PIN_PATH); process.exit(0); }
let saved = null; try { saved = JSON.parse(fs.readFileSync(PIN_PATH, 'utf8')); } catch (e) {}
const pinBad = [];
if (!saved) pinBad.push('讀不到 ' + path.basename(PIN_PATH));
else { for (const [key, h] of Object.entries(saved)) if (pins[key] !== h) pinBad.push(key + (pins[key] ? ' 變了' : ' 不見了')); for (const key of Object.keys(pins)) if (!(key in saved)) pinBad.push(key + ' 多出來'); }
const rows = { 0: [], 1: [], 2: [], 3: [] };
for (const [k, views] of Object.entries(per)) views.slice(0, 4).forEach((a, v) => {
  const s = a && a.img && side(a.img); if (!s) return;
  const n = s.dL + s.dR + s.lL + s.lR; if (n < 200 || s.dL + s.dR === 0) return;
  rows[v].push({ k, darkLeft: s.dL / (s.dL + s.dR) });
});
console.log('');
console.log('=== T745 四視角英式建築受光方向（紅磚材質，左上受光 ⇒ 暗面在右）===');
console.log('  建築 ' + Object.keys(per).length + ' 棟（' + Object.keys(per).sort((a, b) => a - b).join(', ') + '）');
let bad = 0;
for (let v = 0; v < 4; v++) {
  const r = rows[v], n = r.length, flipped = r.filter(x => x.darkLeft > 0.5);
  const mean = n ? r.reduce((s, x) => s + x.darkLeft, 0) / n : 0;
  const ok = flipped.length * 2 <= n;
  if (!ok) bad++;
  console.log('  視角 ' + v + '：計入 ' + n + ' 棟，暗紅磚在左半平均 ' + (mean * 100).toFixed(0) + '%，暗面在左 ' + flipped.length + ' 棟' + (ok ? '' : '  ✗ 光向反了') + (flipped.length ? '（' + flipped.map(x => 'k' + x.k).join(' ') + '）' : ''));
}
console.log('  釘值（視角 0、2 整張像素；視角 1、3 形狀）：' + (pinBad.length ? pinBad.length + ' 筆不符：' + pinBad.slice(0, 8).join('、') + (pinBad.length > 8 ? ' …' : '') : (saved ? Object.keys(saved).length : 0) + ' 筆全對'));
console.log('  嵌入 index.html：' + (embedBad.length ? embedBad.length + ' 份跟檔案不同：' + embedBad.join('、') : FILES.length + ' 份都原樣嵌在裡面'));
if (CHECK && (bad || pinBad.length || embedBad.length)) { console.log('X --check：' + [bad ? bad + ' 個視角光向反了' : '', pinBad.length ? '釘值不符 ' + pinBad.length + ' 筆' : '', embedBad.length ? '嵌入不符 ' + embedBad.length + ' 份' : ''].filter(Boolean).join('；')); process.exit(1); }
console.log(CHECK ? 'OK --check：四個視角都是左上受光，視角 0、2 與形狀都沒動，嵌入與檔案一致' : '（只報告；加 --check 才判紅綠）');

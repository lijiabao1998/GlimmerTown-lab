#!/usr/bin/env node
/* 微光小鎮 實驗線 — T740 use021 指紋的獨立期望值（不開 Chrome、不跑遊戲）
 *
 * 擋什麼：fp.json 裡 use021 偽家族（T739 的 36 款英式三規模新美術，四向共 144 葉）的日夜 CRC，
 *   必須等於「核准來源碼」直接算出來的值。拿被測的遊戲當標準答案是循環判斷（《迭代不改壞標準》5.2），
 *   所以這裡完全不經過遊戲與瀏覽器：
 *   1. 七份來源檔的 SHA256 必須等於 GPT 在 docs/branch/GPT-022-source-manifest.json 釘的值（T739 驗收時釘，與 fp.json 無關）；
 *   2. index.html 嵌入的六份 data-use021-source 必須與檔案逐位元相同（遊戲跑的就是這些碼）；
 *   3. 在 Node vm 用純像素假畫布直接跑五份美術原始碼（作法同 GPT 的 probeUseScalesKitRebuild021.test.js），
 *      算 36 款 × 四向的日夜 CRC32，逐葉比對 fp.json 的 use021：日、夜、寬、高、不透明像素數。
 *      Chrome 的 getImageData 對全透明像素一律回 0,0,0,0，所以這裡先把透明像素的 RGB 歸零再算 CRC。
 *
 * 用法：node probeUse021Fp740.js [--fp=fp.json] [--out=報告.json]
 *   綠＝exit 0；任何一項不符＝exit 1，印出前幾個不符的葉子。
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');

const ROOT = __dirname;
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const FP_PATH = path.resolve(ROOT, arg('fp', 'fp.json'));
const OUT = arg('out', '');
const MANIFEST = 'docs/branch/GPT-022-source-manifest.json';
const PRIMITIVES = 'british-complex-primitives014.js';
const KIT = 'british-use-scales-kit021.js';
const MODULES = [   // [檔名, 全域名]；順序同 GPT 的 kit 重建測試
  ['british-use-scales-art021.js', 'BritishUseScales021'],
  ['british-use-scales-hospitality021.js', 'BritishUseScalesHospitality021'],
  ['british-use-scales-workplaces021.js', 'BritishUseScalesWorkplaces021'],
  ['british-use-scales-agriculture021.js', 'BritishUseScalesAgriculture021'],
  ['british-use-scales-infrastructure021.js', 'BritishUseScalesInfrastructure021'],
];

const fails = [], notes = [];
const fail = s => fails.push(s);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const TB = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c; } return t; })();
const crc32 = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = TB[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return ((c ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0'); };
const read = f => fs.readFileSync(path.join(ROOT, f));

// ---- 1. 來源釘值 ----
const pins = JSON.parse(read(MANIFEST)).sources || {};
const files = [PRIMITIVES, KIT, ...MODULES.map(m => m[0])];
for (const f of files) {
  const want = pins[f], got = sha(read(f));
  if (!want) fail('來源釘值：manifest 沒有 ' + f);
  else if (want !== got) fail('來源釘值：' + f + ' 是 ' + got.slice(0, 16) + '…，manifest 釘 ' + want.slice(0, 16) + '…');
}
const pinOk = !fails.length;

// ---- 2. index.html 嵌入的來源與檔案逐位元相同 ----
const html = read('index.html').toString('utf8');
const embedded = new Map();
for (const m of html.matchAll(/<script data-use021-source="([^"]+)">/g)) {
  const end = html.indexOf('</script>', m.index + m[0].length);
  embedded.set(m[1], html.slice(m.index + m[0].length, end));
}
for (const f of [KIT, ...MODULES.map(m => m[0])]) {
  const body = embedded.get(f), src = read(f).toString('utf8');
  if (body === undefined) { fail('嵌入：index.html 沒有 data-use021-source="' + f + '"'); continue; }
  if (body !== '\n' + src + '\n' && body !== '\n' + src && body !== src) fail('嵌入：index.html 裡的 ' + f + ' 與檔案不同');
}
if (embedded.size !== 6) fail('嵌入：data-use021-source 應有 6 份，實際 ' + embedded.size);

// ---- 3. 純像素重建 ----
function canvas() {
  const c = { width: 0, height: 0, data: null };
  c.getContext = () => ({
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
    putImageData: p => { c.data = new Uint8ClampedArray(p.data); },
    getImageData: () => ({ data: c.data }),
  });
  return c;
}
const ctx = vm.createContext({ document: { createElement: tag => { if (tag !== 'canvas') throw new Error('只支援 canvas：' + tag); return canvas(); } } });
for (const f of [PRIMITIVES, KIT, ...MODULES.map(m => m[0])]) vm.runInContext(read(f).toString('utf8'), ctx, { filename: f });

function sig(cv, w, h) {
  if (!cv || !cv.data || cv.data.length !== w * h * 4) return null;
  const a = new Uint8Array(cv.data);   // 複本：只在這裡把透明像素歸零
  let op = 0;
  for (let i = 0; i < a.length; i += 4) { if (a[i + 3] === 0) a[i] = a[i + 1] = a[i + 2] = 0; if (a[i + 3] > 40) op++; }
  return { crc: crc32(a), op };
}
const expect = {};
for (const [file, key] of MODULES) {
  const M = ctx[key];
  if (!M || !Array.isArray(M.specs)) { fail('重建：' + file + ' 沒有 ' + key + '.specs'); continue; }
  for (const q of M.specs) for (let view = 0; view < 4; view++) {
    const p = 'use021.' + q.id + '.r' + view;
    let a;
    try { a = M.build(q.id, view, {}); } catch (e) { fail('重建：' + p + ' 例外 ' + e.message); continue; }
    const w = a.img && a.img.width, h = a.img && a.img.height;
    const d = sig(a.img, w, h), n = sig(a.night, w, h);
    if (!d || !n) { fail('重建：' + p + ' 沒有完整的日圖或夜圖'); continue; }
    expect[p] = { d: d.crc, op: d.op, w, h, n: n.crc };
  }
}
const nExpect = Object.keys(expect).length;
if (nExpect !== 144) fail('重建：應有 144 葉（36 款 × 四向），實際 ' + nExpect);

// ---- 4. 逐葉比對 fp.json ----
let fpj = null;
try { fpj = JSON.parse(fs.readFileSync(FP_PATH, 'utf8')); } catch (e) { fail('讀不到 ' + FP_PATH + '：' + e.message); }
let matched = 0;
if (fpj) {
  const subs = fpj.subs || {};
  const have = Object.keys(subs).filter(k => k.startsWith('use021.'));
  if (!have.length) fail('fp.json 沒有 use021 葉（還沒用 node fp.js --expect=use021 寫入基線？）');
  const fam = (fpj.families || {}).use021;
  if (have.length && (!fam || fam.leaves !== have.length)) fail('fp.json 的 use021 家族葉數（' + (fam && fam.leaves) + '）與葉子數（' + have.length + '）不符');
  for (const k of have) if (!expect[k]) fail('fp.json 多出重建裡沒有的葉：' + k);
  for (const [k, e] of Object.entries(expect)) {
    const g = subs[k];
    if (!g) { if (have.length) fail('fp.json 缺葉：' + k); continue; }
    const bad = ['d', 'n', 'w', 'h', 'op'].filter(f => g[f] !== e[f]);
    if (bad.length) fail('不符 ' + k + '：' + bad.map(f => f + ' 基線 ' + g[f] + ' ≠ 重建 ' + e[f]).join('，'));
    else matched++;
  }
}

notes.push('來源釘值 ' + (pinOk ? '7/7 相符' : '有不符'), '嵌入 ' + embedded.size + ' 份', '重建 ' + nExpect + ' 葉', 'fp.json 逐葉相同 ' + matched + '/' + nExpect);
if (OUT) fs.writeFileSync(path.resolve(OUT), JSON.stringify({ ok: !fails.length, notes, fails, expect }, null, 1) + '\n');
console.log('');
console.log('=== T740 use021 獨立期望值 ===');
for (const s of notes) console.log('  ' + s);
if (fails.length) {
  console.log('X 紅燈 ' + fails.length + ' 項：');
  for (const s of fails.slice(0, 12)) console.log('   - ' + s);
  if (fails.length > 12) console.log('   …另 ' + (fails.length - 12) + ' 項');
  process.exit(1);
}
console.log('OK 288 個 CRC（144 日＋144 夜）與 fp.json 的 use021 逐葉相同');

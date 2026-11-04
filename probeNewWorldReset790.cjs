'use strict';
/* T790 V2–V5：開新城時重設觀測台與財政節奏（真 Chrome；不改被測的新頁）。
 *
 * 新頁＝候選 index.html，原樣送出。舊頁＝候選頁經 T790 逆轉換回修正前的那一行，其餘逐字相同。
 *   V2 新頁、種子 S：開新城之前用五種方式空轉（立即、閒置 8 秒、1 倍速 5 秒、3 倍速 12 秒、原生 AI 先經營一座城 60 天），
 *      探測不補任何重設；每種方式新城第 1 天、第 6 天的存檔都逐字相同。
 *   V3 同一支檢查在舊頁上：五種方式不全相同（證明檢查抓得到這個問題）。
 *   V4 玩家路徑：原生 AI 經營 44 天後，按真的「新地圖」按鈕（確認框代答「是」），同一個同步呼叫裡讀 GV.fiscal515()、GV.observatory514()：
 *      新頁五個「上次處理日」都是 −999、ready false，觀測台 lastSampleDay −999、samples 與 bookmarks 都空；舊頁照實記殘留。
 *   V5 新頁「開新城、AI 60 天」對照舊頁「開新城、補 observatoryReset514();fiscalReset515();、AI 60 天」，兩個種子每 5 天比一次：
 *      存檔逐字相同；GV.stats()、t462、t468 在兩邊讀回同一份存檔之後逐字相同。
 *      舊頁的補重設要呼叫模組裡的原生函式（GV 上的同名介面會多跑一次 step），所以只在舊頁 052 區後面掛一個觀察口 window.__reset790。
 *
 * 用法：PROBE_PORT=8231 node probeNewWorldReset790.cjs   （PROBE_ONLY=V2,V3,V4,V5 只跑其中幾段）
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const ROOT = __dirname;
const PORT = +(process.env.PROBE_PORT || 8199);
const ONLY = (process.env.PROBE_ONLY || 'V2,V3,V4,V5').split(',');
const SEED = 20261104;
const SEEDS = [20261104, 87];
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

const NEW = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
require(path.join(ROOT, 'single-research052-source.cjs')).projectCandidate052(NEW);
const { normalizeNewWorldReset790 } = require(path.join(ROOT, 'newworld-reset790-projection.cjs'));
const OLD = normalizeNewWorldReset790(NEW);
assert.notEqual(OLD, NEW, 'candidate carries the T790 segment');
const ANCHOR = '/* GPT-052 SINGLE LEDGER END */\n';
assert.equal(OLD.split(ANCHOR).length, 2, '052 end anchor once');
const OLD_HOOKED = OLD.replace(ANCHOR, ANCHOR + 'window.__reset790=()=>{observatoryReset514();fiscalReset515();return true;};\n');

function root(page) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'glimmertown-t790-'));
  for (const f of fs.readdirSync(ROOT)) {
    if (['.git', '.github', 'index.html', 'harness.js', 'shots'].includes(f) || f.startsWith('.smoke-profile-')) continue;
    fs.symlinkSync(path.join(ROOT, f), path.join(dir, f), fs.statSync(path.join(ROOT, f)).isDirectory() ? 'dir' : 'file');
  }
  fs.copyFileSync(path.join(ROOT, 'harness.js'), path.join(dir, 'harness.js'));
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  return dir;
}
async function session(page, expr) {
  const dir = root(page);
  try {
    const { withGame } = require(path.join(dir, 'harness.js'));
    const r = await withGame({ port: PORT, timeout: 900, fresh: true, log: () => {} }, async ({ cdp }) => ({ result: await cdp.evalJs(expr), errors: cdp.errors.slice(0, 5) }));
    if (!r || !r.ok || !r.result || !r.result.result) throw new Error('session failed: ' + JSON.stringify(r && r.fails));
    return Object.assign({}, r.result.result, { errors: r.result.errors });
  } finally { try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch (e) { /* 暫存目錄留著不影響結果 */ } }
}
const SLOT = 'glimmerville.v1.s3';

/* V2／V3：一種空轉方式 → 新城第 1、6 天存檔 */
const MODES = [['immediate', 0, null, false], ['idle8s', 8000, null, false], ['run1x5s', 5000, 1, false], ['run3x12s', 12000, 3, false], ['ai60', 0, null, true]];
const modeExpr = (ms, speed, ai60) => `(async () => {
  if (${ai60}) { GV.setSpeed(0); GV.newWorldSeeded(${SEED + 7}); GV.setSpeed(0); GV.ai(true); for (let d = 0; d < 60; d += 5) GV.step(5); GV.setSpeed(0); GV.ai(false); }
  if (${speed === null ? 'null' : speed} !== null) GV.setSpeed(${speed === null ? 0 : speed});
  if (${ms}) await new Promise((r) => setTimeout(r, ${ms}));
  GV.setSpeed(0);
  if (GV.newWorldSeeded(${SEED}) !== true) throw new Error('newWorldSeeded');
  GV.setSpeed(0); GV.save(); const d1 = localStorage.getItem('${SLOT}');
  GV.step(5); GV.setSpeed(0); GV.save(); const d6 = localStorage.getItem('${SLOT}');
  const f = GV.fiscal515(), o = GV.observatory514();
  return { d1, d6, fiscalDay1: null, fiscalLast: [f.lastAggregateDay, f.lastBacklogDay, f.lastSettlementDay, f.lastAssetScanDay, f.lastCompletionScanDay], obsLastSample: o.lastSampleDay, obsSamples: (o.samples || []).length };
})()`;
async function modes(page) {
  const out = [];
  for (const [name, ms, speed, ai60] of MODES) {
    const r = await session(page, modeExpr(ms, speed, ai60));
    out.push({ name, d1: r.d1, d6: r.d6, d1sha: hash(r.d1), d6sha: hash(r.d6), fiscalLastAtDay6: r.fiscalLast, obsLastSampleAtDay6: r.obsLastSample, obsSamplesAtDay6: r.obsSamples, errors: r.errors });
  }
  return out;
}
const keyDiff = (A, B) => { const a = JSON.parse(A), b = JSON.parse(B); return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])); };

/* V4：AI 44 天 → 真的「新地圖」按鈕 */
const V4 = `(() => {
  GV.setSpeed(0); GV.newWorldSeeded(${SEED}); GV.setSpeed(0); GV.ai(true);
  for (let d = 0; d < 44; d += 4) GV.step(4);
  GV.setSpeed(0); GV.ai(false);
  const before = { day: GV.stats().day, fiscal: GV.fiscal515(), obs: GV.observatory514() };
  const c0 = window.confirm; let asked = 0; window.confirm = () => { asked++; return true; };
  try { document.getElementById('bNew').click(); } finally { window.confirm = c0; }
  const f = GV.fiscal515(), o = GV.observatory514();
  const pick = (x) => ({ ready: x.ready, lastAggregateDay: x.lastAggregateDay, lastBacklogDay: x.lastBacklogDay, lastSettlementDay: x.lastSettlementDay, lastAssetScanDay: x.lastAssetScanDay, lastCompletionScanDay: x.lastCompletionScanDay, history: (x.history || []).length, settlements: (x.settlements || []).length });
  const pickO = (x) => ({ ready: x.ready, lastSampleDay: x.lastSampleDay, samples: (x.samples || []).length, bookmarks: (x.bookmarks || []).length });
  return { asked, dayBefore: before.day, dayAfter: GV.stats().day, fiscalBefore: pick(before.fiscal), obsBefore: pickO(before.obs), fiscalAfter: pick(f), obsAfter: pickO(o) };
})()`;

/* V5：新頁不補、舊頁補；AI 60 天每 5 天取樣 */
const v5Expr = (seed, reset) => `(() => {
  GV.setSpeed(0);
  if (GV.newWorldSeeded(${seed}) !== true) throw new Error('newWorldSeeded');
  ${reset ? "if (window.__reset790() !== true) throw new Error('reset hook');" : "if (typeof window.__reset790 !== 'undefined') throw new Error('new page must not carry the hook');"}
  GV.setSpeed(0); GV.ai(true);
  const rows = [];
  const take = () => {
    GV.setSpeed(0); GV.save(); const save = localStorage.getItem('${SLOT}');
    if (GV.load() !== true) throw new Error('load');
    GV.setSpeed(0);
    const row = { day: GV.stats().day, save, stats: JSON.stringify(GV.stats()), t462: JSON.stringify(GV.t462()), t468: JSON.stringify(GV.t468()) };
    GV.ai(true);
    return row;
  };
  rows.push(take());
  for (let d = 0; d < 60; d += 5) { GV.step(5); rows.push(take()); }
  return { rows };
})()`;

(async () => {
  const report = { ok: false, fails: [], port: PORT, newIndexSha256: hash(NEW), oldIndexSha256: hash(OLD) };
  const fail = (m) => report.fails.push(m);
  if (ONLY.includes('V2')) {
    const m = await modes(NEW);
    const base = m[0];
    report.V2 = m.map((x) => ({ name: x.name, d1sha: x.d1sha.slice(0, 16), d6sha: x.d6sha.slice(0, 16), d1Bytes: x.d1.length, fiscalLastAtDay6: x.fiscalLastAtDay6, obsLastSampleAtDay6: x.obsLastSampleAtDay6, obsSamplesAtDay6: x.obsSamplesAtDay6,
      d1Diff: x.d1 === base.d1 ? [] : keyDiff(base.d1, x.d1), d6Diff: x.d6 === base.d6 ? [] : keyDiff(base.d6, x.d6) }));
    for (const x of m) { if (x.d1 !== base.d1 || x.d6 !== base.d6) fail('V2 新頁 ' + x.name + ' 的新城存檔與 immediate 不同'); if ((x.errors || []).length) fail('V2 console 錯誤 ' + x.name); }
  }
  if (ONLY.includes('V3')) {
    const m = await modes(OLD);
    const base = m[0];
    report.V3 = m.map((x) => ({ name: x.name, d1sha: x.d1sha.slice(0, 16), d6sha: x.d6sha.slice(0, 16), fiscalLastAtDay6: x.fiscalLastAtDay6, obsLastSampleAtDay6: x.obsLastSampleAtDay6,
      d1Diff: x.d1 === base.d1 ? [] : keyDiff(base.d1, x.d1), d6Diff: x.d6 === base.d6 ? [] : keyDiff(base.d6, x.d6) }));
    if (m.every((x) => x.d1 === base.d1 && x.d6 === base.d6)) fail('V3 舊頁五種方式全都相同：檢查抓不到這個問題');
  }
  if (ONLY.includes('V4')) {
    const n = await session(NEW, V4), o = await session(OLD, V4);
    report.V4 = { new: n, old: o };
    const f = n.fiscalAfter, ob = n.obsAfter;
    if (n.asked !== 1) fail('V4 新頁沒有走到確認框');
    if (!(f.ready === false && [f.lastAggregateDay, f.lastBacklogDay, f.lastSettlementDay, f.lastAssetScanDay, f.lastCompletionScanDay].every((v) => v === -999) && f.history === 0 && f.settlements === 0))
      fail('V4 新頁按「新地圖」之後財政節奏沒有回到初始值：' + JSON.stringify(f));
    if (!(ob.lastSampleDay === -999 && ob.samples === 0 && ob.bookmarks === 0)) fail('V4 新頁按「新地圖」之後觀測台還有舊城的樣本：' + JSON.stringify(ob));
    if (!(n.fiscalBefore.lastAggregateDay > 0)) fail('V4 前提：舊城經營 44 天之後財政節奏應該已經跑過：' + JSON.stringify(n.fiscalBefore));
  }
  if (ONLY.includes('V5')) {
    report.V5 = {};
    for (const seed of SEEDS) {
      const n = await session(NEW, v5Expr(seed, false)), o = await session(OLD_HOOKED, v5Expr(seed, true));
      const rows = n.rows.map((r, i) => { const q = o.rows[i]; const diff = ['save', 'stats', 't462', 't468'].filter((k) => !q || r[k] !== q[k]); return { day: r.day, same: diff.length === 0, diff, saveSha: hash(r.save).slice(0, 16) }; });
      report.V5[seed] = { checkpoints: rows.length, allSame: rows.every((r) => r.same), lastDay: n.rows[n.rows.length - 1].day, rows: rows.filter((r) => !r.same).concat(rows.slice(-1)) };
      for (const r of rows) if (!r.same) fail('V5 種子 ' + seed + ' 第 ' + r.day + ' 天不同：' + r.diff.join(','));
    }
  }
  report.ok = report.fails.length === 0;
  console.log('NEWWORLD790 ' + JSON.stringify(report, null, 1));
  console.log('NEWWORLD790 RESULT ' + (report.ok ? 'PASS' : 'FAIL') + (report.fails[0] ? '  首紅：' + report.fails[0].slice(0, 160) : ''));
  process.exitCode = report.ok ? 0 : 1;
})().catch((e) => { console.error('NEWWORLD790 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

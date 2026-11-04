'use strict';
/* T786 I3：#71（原 GPT-053）C1–C5 的真 Chrome 同種子等價對照（本機重驗；不改 index.html）。
 *
 * 新頁＝候選 index.html；舊頁＝候選頁經整條逆轉鏈（normalizePlacement053）換回的頁。
 * 舊頁先過投影器的原生基準雜湊（projectCandidate052），不從 git 取分支上的提交。
 * 兩頁都做同一個觀察改動：mulberry32 產生的函式多掛一個讀狀態的 state786()，並在 052 區後面（遊戲同一個範圍）
 * 插 window.__simRng786 讀模擬亂數 R 的狀態。只多讀取口，不改任何數值。
 * 每個 session 在一次同步呼叫裡做完全部推進與存檔（中間不讓出事件迴圈，免得繪製幀、計時器的時序混進來），
 * 原字串帶回 Node 再比。
 * 開新城之後先清 obs514／fiscal515：原生 newWorld 不重設這兩塊，頁面載入到探測開始之間實時跑過的天數會留進新城
 * （例：第 1 天存檔帶 lastBacklogDay=5），讓第 1 天存檔隨載入快慢變。遊戲自己的 T005–T007 夾具開新城後也是這樣補清
 * （「Same-seed disposable fixtures must not inherit prior fiscal/observatory state」）；兩頁做同一件事，不碰 #71 的程式。
 *   I3b：兩個種子（20261104、87）× 原生 AI 市長開著 × 60 天。
 *        每 5 天比一次：模擬亂數 R 的狀態、整份存檔、整份 GV.stats()（含 cars／buses）、GV.t462()、GV.t468()。
 *        結束時做 save→load→save→load，三份存檔在兩頁之間逐字相同。
 *        讀檔本身會正規化幾個欄位，所以同一頁三份不必相同，只記錄。
 *   I3c：用 main dfedbb7 的 v14.72 頁（main 上的提交）跑出一份存檔（種子 20261104、AI 20 天），
 *        分別在舊頁與新頁讀進來、立刻存一次，再各推進 10 天存一次，兩邊逐字相同（含 R 的狀態）。
 *
 * 用法：PROBE_PORT=8231 node probeAiSpeedParity786.cjs   （埠預設 8199；PARITY_DAYS 改天數；PARITY_MUTATE=c3|c4|c5 跑負對照）
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const cp = require('node:child_process');

const ROOT = __dirname;
const PORT = +(process.env.PROBE_PORT || 8199);
const DAYS = +(process.env.PARITY_DAYS || 60);
const SEEDS = [20261104, 87];
const V1472_MAIN = 'dfedbb7b43c4e511325dfebdf7fbc0f7c7cbdca5';
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

const S = require(path.join(ROOT, 'single-research052-source.cjs'));
const { normalizePlacement053 } = require(path.join(ROOT, 'placement-reuse053-projection.cjs'));
const NEW = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
S.projectCandidate052(NEW); // 原生基準雜湊先過，才把逆轉結果當舊頁
const OLD = normalizePlacement053(NEW);
assert.notEqual(OLD, NEW, 'candidate carries the #71 segments');
assert.equal(normalizePlacement053(OLD), OLD, 'old page is a fixed point of the inverse');
// 負對照（預設關）：PARITY_MUTATE=c3|c4|c5 只在新頁套 GPT 對照測試裡同一個語義突變，用來證明這支探測抓得到行為差異。
//   c3 拿掉人口篩選、c4 最近節點少掃一圈（dx<=edge→dx<edge）、c5 拿掉容量篩選（>.02→>=0）。
const MUTANTS = {
  c3: ['blocks=mobilityBlocks491().filter(q=>(q.pop||0)>0);authority=authorityBlocks053(blocks);', 'blocks=mobilityBlocks491();authority=authorityBlocks053(blocks);'],
  c4: ['dx<=edge', 'dx<edge'],
  c5: ['>.02&&q.w>0', '>=0&&q.w>0']
};
const MUTATE = process.env.PARITY_MUTATE || '';
let NEW_PAGE = NEW;
if (MUTATE) { const m = MUTANTS[MUTATE]; assert.ok(m, 'unknown PARITY_MUTATE'); assert.equal(NEW.split(m[0]).length, 2, 'mutant anchor once'); NEW_PAGE = NEW.replace(m[0], m[1]); }
const V1472 = cp.execFileSync('git', ['show', V1472_MAIN + ':index.html'], { cwd: ROOT, maxBuffer: 1 << 26, encoding: 'utf8' });

const RNG_OLD = 'function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}';
const RNG_NEW = 'function mulberry32(a){const gen=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};' +
  'gen.state786=()=>a;return gen;}';
const ANCHOR = '/* GPT-052 SINGLE LEDGER END */\n';
const OBSERVER = "window.__simRng786=()=>(typeof R==='function'&&typeof R.state786==='function')?R.state786():null;" +
  'window.__fresh786=()=>{observatoryReset514();fiscalReset515();return true;};\n';
function instrument(page) {
  assert.equal(page.split(RNG_OLD).length, 2, 'mulberry32 definition found exactly once');
  assert.equal(page.split(ANCHOR).length, 2, '052 end anchor found exactly once');
  return page.replace(RNG_OLD, RNG_NEW).replace(ANCHOR, ANCHOR + OBSERVER);
}

function root(page) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'glimmertown-parity786-'));
  for (const f of fs.readdirSync(ROOT)) {
    if (['.git', '.github', 'index.html', 'harness.js', 'shots'].includes(f) || f.startsWith('.smoke-profile-')) continue;
    fs.symlinkSync(path.join(ROOT, f), path.join(dir, f), fs.statSync(path.join(ROOT, f)).isDirectory() ? 'dir' : 'file');
  }
  fs.copyFileSync(path.join(ROOT, 'harness.js'), path.join(dir, 'harness.js'));
  fs.writeFileSync(path.join(dir, 'index.html'), instrument(page));
  return dir;
}

const PAGE_HELPERS = `
  const slot = 'glimmerville.v1.s3';
  const sim = () => window.__simRng786();
  const checkpoint = () => {
    GV.setSpeed(0); GV.save();
    const st = GV.stats();
    return { day: st.day, pop: st.pop, money: st.money, rng: sim(), save: localStorage.getItem(slot) || '',
      stats: JSON.stringify(st), t462: JSON.stringify(GV.t462()), t468: JSON.stringify(GV.t468()), info: { cars: st.cars, buses: st.buses } };
  };
`;

async function session(page, body, arg) {
  const dir = root(page);
  try {
    const { withGame } = require(path.join(dir, 'harness.js'));
    const r = await withGame({ port: PORT, timeout: 900, fresh: true, log: () => {} }, async ({ cdp }) => {
      const result = await cdp.evalJs('((P) => {' + PAGE_HELPERS + body + '})(' + JSON.stringify(arg) + ')');
      return { result, errors: cdp.errors.slice(0, 5) };
    });
    if (!r || !r.ok || !r.result) throw new Error('session failed: ' + JSON.stringify(r && r.fails));
    return r.result;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch (e) { /* 暫存目錄留著不影響結果 */ }
  }
}

const RUN = `
  GV.setSpeed(0);
  if (GV.newWorldSeeded(P.seed) !== true) throw new Error('newWorldSeeded');
  if (window.__fresh786() !== true) throw new Error('fresh reset');
  GV.setSpeed(0);
  GV.ai(true);
  if (sim() === null) throw new Error('simulation RNG observer missing');
  const checkpoints = [checkpoint()];
  for (let d = 0; d < P.days; d += 5) { GV.step(5); checkpoints.push(checkpoint()); }
  GV.save(); const a = localStorage.getItem(slot);
  GV.load(); GV.setSpeed(0); GV.save(); const b = localStorage.getItem(slot);
  GV.load(); GV.setSpeed(0); GV.save(); const c = localStorage.getItem(slot);
  return { checkpoints, roundtrip: { a, b, c } };
`;
const MAKE_SAVE = `
  GV.setSpeed(0);
  if (GV.newWorldSeeded(P.seed) !== true) throw new Error('newWorldSeeded');
  if (window.__fresh786() !== true) throw new Error('fresh reset');
  GV.setSpeed(0); GV.ai(true); GV.step(10); GV.step(10); GV.setSpeed(0); GV.ai(false); GV.save();
  return { save: localStorage.getItem(slot), version: GV.ver(), day: GV.stats().day, pop: GV.stats().pop };
`;
const LOAD_SAVE = `
  localStorage.setItem(slot, P.save);
  if (GV.load() !== true) throw new Error('load failed');
  GV.setSpeed(0); GV.save();
  const first = localStorage.getItem(slot), r0 = sim();
  GV.ai(true); GV.step(10); GV.setSpeed(0); GV.save();
  return { first, later: localStorage.getItem(slot), r0, r1: sim(), day: GV.stats().day, pop: GV.stats().pop };
`;

(async () => {
  const out = { ok: false, fails: [], port: PORT, days: DAYS, mutate: MUTATE || null, newIndexSha256: hash(NEW), oldIndexSha256: hash(OLD), v1472IndexSha256: hash(V1472), seeds: {}, oldSave: null };
  const fail = (m) => out.fails.push(m);
  for (const seed of SEEDS) {
    const t0 = Date.now();
    const a = await session(OLD, RUN, { seed, days: DAYS });
    const b = await session(NEW_PAGE, RUN, { seed, days: DAYS });
    const rows = [];
    const judged = (o) => o && JSON.stringify([o.day, o.pop, o.money, o.rng, o.save, o.stats, o.t462, o.t468]);
    for (let i = 0; i < Math.max(a.result.checkpoints.length, b.result.checkpoints.length); i++) {
      const x = a.result.checkpoints[i], y = b.result.checkpoints[i];
      const same = !!x && !!y && judged(x) === judged(y);
      const diff = same ? [] : ['day', 'pop', 'money', 'rng', 'save', 'stats', 't462', 't468'].filter((k) => JSON.stringify(x && x[k]) !== JSON.stringify(y && y[k]));
      rows.push({ i, day: x && x.day, pop: x && x.pop, money: x && x.money, rng: x && x.rng, same, diff, vehiclesSame: JSON.stringify(x && x.info) === JSON.stringify(y && y.info),
        sha: x ? { save: hash(x.save), t462: hash(x.t462), t468: hash(x.t468) } : null, bytes: x ? { save: x.save.length, t462: x.t462.length, t468: x.t468.length } : null });
      if (!same) fail('seed ' + seed + ' checkpoint ' + i + ' (day ' + (x && x.day) + ') differs in ' + diff.join(','));
    }
    const ra = a.result.roundtrip, rb = b.result.roundtrip;
    const rtSame = ra.a === rb.a && ra.b === rb.b && ra.c === rb.c;
    if (!rtSame) fail('seed ' + seed + ' save roundtrip differs between old and new');
    if ((a.errors || []).length || (b.errors || []).length) fail('seed ' + seed + ' console errors ' + JSON.stringify([a.errors, b.errors]));
    const last = a.result.checkpoints[a.result.checkpoints.length - 1];
    if (!(last.day >= DAYS && last.pop > 0)) fail('seed ' + seed + ' city did not grow: ' + JSON.stringify({ day: last.day, pop: last.pop }));
    out.seeds[seed] = { checkpoints: rows.length, allSame: rows.every((r) => r.same), lastDay: last.day, lastPop: last.pop, lastMoney: last.money, lastRng: last.rng,
      saveBytes: last.save.length, roundtrip: { sameAcrossPages: rtSame, sha: [hash(ra.a), hash(ra.b), hash(ra.c)], withinPageIdempotent: ra.a === ra.b && ra.b === ra.c },
      vehiclesSameEverywhere: rows.every((r) => r.vehiclesSame), seconds: Math.round((Date.now() - t0) / 1000), rows };
  }
  const t1 = Date.now();
  const made = await session(V1472, MAKE_SAVE, { seed: SEEDS[0] });
  if (made.result.version !== '14.72') fail('old save was not made by v14.72: ' + made.result.version);
  const la = await session(OLD, LOAD_SAVE, { save: made.result.save });
  const lb = await session(NEW_PAGE, LOAD_SAVE, { save: made.result.save });
  const sameLoad = la.result.first === lb.result.first && la.result.later === lb.result.later && la.result.r0 === lb.result.r0 && la.result.r1 === lb.result.r1;
  if (!sameLoad) fail('v14.72 save load→save differs between old and new: ' + JSON.stringify({ old: [hash(la.result.first), hash(la.result.later), la.result.r0, la.result.r1], new: [hash(lb.result.first), hash(lb.result.later), lb.result.r0, lb.result.r1] }));
  out.oldSave = { madeBy: made.result.version, madeDay: made.result.day, madePop: made.result.pop, saveBytes: made.result.save.length, saveSha256: hash(made.result.save),
    afterLoad: hash(la.result.first), after10Days: hash(la.result.later), rng: [la.result.r0, la.result.r1], day: la.result.day, pop: la.result.pop,
    sameOnBothPages: sameLoad, seconds: Math.round((Date.now() - t1) / 1000) };
  out.ok = out.fails.length === 0;
  console.log('PARITY786 ' + JSON.stringify(out, null, 1));
  console.log('PARITY786 RESULT ' + (out.ok ? 'PASS' : 'FAIL'));
  process.exitCode = out.ok ? 0 : 1;
})().catch((e) => { console.error('PARITY786 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

'use strict';
/* T791 U2–U5：讀檔時清掉舊存檔裡的財政節奏與觀測台殘留（真 Chrome；不改被測的新頁）。
 *
 * 三種頁面都從候選頁機械導出：
 *   P2＝候選 index.html 原樣送出；
 *   P1＝P2 經 T791 逆轉（＝main 32f8e15 換上新版本字）；
 *   P0＝P1 再經 T790 逆轉（T790 之前），只用來真的做出殘留存檔。
 *   U2 在 P0 上做殘留存檔：AI 經營一座城之後開新城再跑幾天、按真的「新地圖」、開始畫面閒置之後開新城；每份偏差都要大於 14。
 *      另做一份新城裡有已完工、已入帳開發案的（原生 QA 介面 developmentCreateQA512／developmentForceCompleteQA512）。
 *      在 P2 讀回（還沒推進天數）：沒有上次處理日晚於當天；財政紀錄（history／settlements／capitalLedger／maintenanceBacklog）與 P1 讀回的逐字相同；
 *      processedProjects 與存檔相同；觀測台沒有舊城樣本（bookmarks 空、samples 只剩讀檔當下補取的當天那一個）。推進 30 天：財政彙總至少 4 次、資產盤點至少 2 次。
 *      （業主 2026-11-05 第三題：財政只歸零節奏、紀錄留著；觀測台整塊歸零。）
 *   U3 同一批在 P1 讀回：至少一個上次處理日晚於當天超過 14 天，財政歷史還在。
 *   U4 P2、P1 各讀同一份、GV.step 推進 30 天（不開 AI、不操作）：money 逐日相同；第 0、10、20、30 天的存檔除了 obs514、fiscal515 其他欄位逐字相同。
 *      加嚴：P2 讀回後立刻存檔、再讀回，存檔裡仍有 fiscal515、已入帳清單相同，再推進 30 天 money 與 P1 走同一條路的逐日相同
 *      （存檔再讀回在 P1 上本身就可能改變錢的走向，原生既有；跟 P1 直接讀回的比較只記錄）。
 *      「obs514、fiscal515 以外逐字相同」照算照印；業主 2026-11-05 第四題接受它照字面沒過，列進 acceptedDeviations、不算 FAIL。
 *   U5 正常存檔：P2 上 AI 60 天（兩個種子）；財政五個上次處理日改成當天＋0／7／14／15、觀測台 lastSampleDay 另外同樣四種：
 *      0、7、14 兩頁讀檔再存檔逐字相同；15：財政那一份只有五個上次處理日變成 −999（其他欄位含 processedProjects 與觀測台逐字相同），
 *      觀測台那一份只有觀測台整塊歸零。
 *      兩份正常存檔與 v14.72 舊存檔（用 T786 的做法在 main dfedbb7 做的），兩頁讀檔再存檔逐字相同。
 *   GPT-026（probeFiscalLoad026.cjs）另外原樣跑，不在這支裡。
 *
 * 用法：PROBE_PORT=8231 node probeLoadStale791.cjs   （PROBE_ONLY=U2,U5 只跑其中幾段；U2 那段同時給出 U3、U4）
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const ROOT = __dirname;
const PORT = +(process.env.PROBE_PORT || 8199);
const ONLY = (process.env.PROBE_ONLY || 'U2,U5').split(',');
const LEAK_ONLY = process.env.PROBE_LEAKS ? process.env.PROBE_LEAKS.split(',') : null;
// 診斷用：PROBE_MATHSEED 讓每個頁面在載入前用同一個種子化的 Math.random（「新地圖」按鈕開新城的種子才可重現）；模擬本身用的是原生 R，不受影響。
const MATHSEED = process.env.PROBE_MATHSEED ? (+process.env.PROBE_MATHSEED | 0) : null;
const PRE = MATHSEED === null ? '' : '(()=>{let a=' + MATHSEED + ';Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();';
const SLOT = 'glimmerville.v1.s3';
const SEED_OLD = 20261105, SEED_NEW = 20261104, SEEDS = [20261104, 87];
const V1472_MAIN = 'dfedbb7b43c4e511325dfebdf7fbc0f7c7cbdca5';
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

const P2 = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
require(path.join(ROOT, 'single-research052-source.cjs')).projectCandidate052(P2);
const { normalizeLoadStale791 } = require(path.join(ROOT, 'loadstale791-projection.cjs'));
const { normalizeNewWorldReset790 } = require(path.join(ROOT, 'newworld-reset790-projection.cjs'));
const P1 = normalizeLoadStale791(P2);
assert.notEqual(P1, P2, 'candidate carries the T791 segment');
const P0 = normalizeNewWorldReset790(P1);
assert.notEqual(P0, P1, 'P1 carries the T790 segment');
const ANCHOR = '/* GPT-052 SINGLE LEDGER END */\n';
const V1472 = cp.execFileSync('git', ['show', V1472_MAIN + ':index.html'], { cwd: ROOT, maxBuffer: 1 << 26, encoding: 'utf8' });
assert.equal(V1472.split(ANCHOR).length, 2, 'v14.72 052 end anchor once');
const V1472_HOOKED = V1472.replace(ANCHOR, ANCHOR + 'window.__fresh791=()=>{observatoryReset514();fiscalReset515();return true;};\n');

function root(page) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'glimmertown-t791-'));
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
    const r = await withGame({ port: PORT, timeout: 900, fresh: true, log: () => {}, ...(PRE ? { preScript: PRE } : {}) }, async ({ cdp }) => ({ result: await cdp.evalJs(expr), errors: cdp.errors.slice(0, 5) }));
    if (!r || !r.ok || !r.result || !r.result.result) throw new Error('session failed: ' + JSON.stringify(r && r.fails));
    return Object.assign({}, r.result.result, { errors: r.result.errors });
  } finally { try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch (e) { /* 暫存目錄留著不影響結果 */ } }
}
function deepDiff(a, b, p = '', out = []) {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) { for (const k of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) deepDiff(a[k], b[k], p ? p + '.' + k : k, out); }
  else if (out.length < 60) out.push({ path: p, P2: JSON.stringify(a)?.slice(0, 160), P1: JSON.stringify(b)?.slice(0, 160) });
  return out;
}
const keyDiff = (A, B) => { const a = JSON.parse(A), b = JSON.parse(B); return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])).sort(); };
const LAST = ['lastAggregateDay', 'lastBacklogDay', 'lastSettlementDay', 'lastAssetScanDay', 'lastCompletionScanDay'];
function gaps(save) {
  const j = JSON.parse(save), f = j.fiscal515 || {}, o = j.obs514 || {};
  return { day: j.day, fiscalLast: LAST.map((k) => f[k]), fiscalGap: Math.max(...LAST.map((k) => +f[k])) - j.day, obsLast: o.lastSampleDay, obsGap: +o.lastSampleDay - j.day,
    processed: (f.processedProjects || []).length, history: (f.history || []).length, settlements: (f.settlements || []).length, samples: (o.samples || []).length };
}

/* U2：在 P0 上真的做出殘留存檔 */
const LEAKS = [
  { name: 'ai60-new-step5', ai: 60, how: 'seeded', steps: 5 },
  { name: 'ai60-new-step30', ai: 60, how: 'seeded', steps: 30 },
  { name: 'ai120-new-step1', ai: 120, how: 'seeded', steps: 1 },
  { name: 'ai44-bNew', ai: 44, how: 'button', steps: 0 },
  { name: 'idle30s-new-step1', idleMs: 30000, how: 'seeded', steps: 1 },
  { name: 'ai60-new-ai20-devdone', ai: 60, how: 'seeded', newAi: 20, devDone: true, steps: 2 },
  { name: 'ai60-bNew-ai30', ai: 60, how: 'button', newAi: 30, steps: 0 },
];
const leakExpr = (L) => `(async () => {
  ${L.ai ? `GV.setSpeed(0); if (GV.newWorldSeeded(${SEED_OLD}) !== true) throw new Error('old city'); GV.setSpeed(0); GV.ai(true); for (let d = 0; d < ${L.ai}; d += 4) GV.step(4); GV.setSpeed(0); GV.ai(false);` : ''}
  ${L.idleMs ? `await new Promise((r) => setTimeout(r, ${L.idleMs}));` : ''}
  GV.setSpeed(0);
  let asked = 0;
  if (${JSON.stringify(L.how)} === 'button') { window.confirm = () => { asked++; return true; }; document.getElementById('bNew').click(); GV.setSpeed(0);
    ${L.newAi ? `GV.ai(true); for (let d = 0; d < ${L.newAi}; d += 4) GV.step(4); GV.setSpeed(0); GV.ai(false); GV.save();` : ''} }
  let dev = null;
  if (${JSON.stringify(L.how)} !== 'button') {
    if (GV.newWorldSeeded(${SEED_NEW}) !== true) throw new Error('new city'); GV.setSpeed(0);
    ${L.newAi ? `GV.ai(true); for (let d = 0; d < ${L.newAi}; d += 4) GV.step(4); GV.setSpeed(0); GV.ai(false);` : ''}
    ${L.devDone ? `for (const k of ['cadastreModernization', 'landValueCapture']) { const r = GV.fiscalProgramRawQA515(k, true, true); if (!r || r.ok !== true) throw new Error('program ' + k + ' ' + JSON.stringify(r)); } const p = GV.developmentCreateQA512(); if (!p) throw new Error('no development site'); const c = GV.developmentForceCompleteQA512(p.id); if (!c) throw new Error('force complete'); dev = { id: p.id, stage: c.project.stage };` : ''}
    ${L.steps ? `GV.step(${L.steps}); GV.setSpeed(0);` : ''} GV.save();
    if (dev) { const f = GV.fiscal515(); dev.processed = f.processedProjects.includes(dev.id); dev.captureRows = f.settlements.filter((q) => q.id === dev.id).map((q) => q.captured); }
  }
  return { save: localStorage.getItem(${JSON.stringify(SLOT)}), asked, version: GV.ver(), dev };
})()`;
const checkExpr = (save) => `(() => {
  GV.setSpeed(0); localStorage.setItem(${JSON.stringify(SLOT)}, ${JSON.stringify(save)}); if (GV.load() !== true) throw new Error('load'); GV.setSpeed(0);
  const pick = () => { const f = GV.fiscal515(), o = GV.observatory514(), s = GV.stats();
    return { day: s.day, money: s.money, last: [f.lastAggregateDay, f.lastBacklogDay, f.lastSettlementDay, f.lastAssetScanDay, f.lastCompletionScanDay],
      hist: f.history.length, settle: f.settlements.length, ledger: f.capitalLedger.length, processed: JSON.stringify(f.processedProjects), assetScans: f.performance.assetScans,
      records: JSON.stringify([f.history, f.settlements, f.capitalLedger, f.maintenanceBacklog]), histDays: f.history.map((q) => +q.d),
      obsLast: o.lastSampleDay, obsSamples: (o.samples || []).length, obsBook: (o.bookmarks || []).length, obsSampleDays: (o.samples || []).map((q) => +q.d) }; };
  const at0 = pick(); GV.save(); const saves = { 0: localStorage.getItem(${JSON.stringify(SLOT)}) }; const money = [at0.money];
  for (let i = 1; i <= 30; i++) { GV.step(1); GV.setSpeed(0); money.push(GV.stats().money); if (i % 10 === 0) { GV.save(); saves[i] = localStorage.getItem(${JSON.stringify(SLOT)}); } }
  return { at0, at30: pick(), money, saves };
})()`;

const reloadExpr = (save) => `(() => {
  GV.setSpeed(0); localStorage.setItem(${JSON.stringify(SLOT)}, ${JSON.stringify(save)}); if (GV.load() !== true) throw new Error('load'); GV.setSpeed(0); GV.save();
  const first = localStorage.getItem(${JSON.stringify(SLOT)}), fj = JSON.parse(first).fiscal515;
  if (GV.load() !== true) throw new Error('reload'); GV.setSpeed(0); const money = [GV.stats().money];
  for (let i = 1; i <= 30; i++) { GV.step(1); GV.setSpeed(0); money.push(GV.stats().money); }
  return { hasFiscal: !!fj, processed: fj ? JSON.stringify(fj.processedProjects) : null, money };
})()`;

/* U5：正常存檔與邊界變體 */
const normalExpr = (seed, days) => `(() => {
  GV.setSpeed(0); if (GV.newWorldSeeded(${seed}) !== true) throw new Error('seed'); GV.setSpeed(0); GV.ai(true); for (let d = 0; d < ${days}; d += 4) GV.step(4); GV.setSpeed(0); GV.ai(false); GV.save();
  return { save: localStorage.getItem(${JSON.stringify(SLOT)}), version: GV.ver() };
})()`;
const v1472Expr = `(() => {
  GV.setSpeed(0); if (GV.newWorldSeeded(${SEEDS[0]}) !== true) throw new Error('seed'); if (window.__fresh791() !== true) throw new Error('fresh');
  GV.setSpeed(0); GV.ai(true); GV.step(10); GV.step(10); GV.setSpeed(0); GV.ai(false); GV.save();
  return { save: localStorage.getItem(${JSON.stringify(SLOT)}), version: GV.ver() };
})()`;
const roundtripExpr = (inputs) => `(() => {
  const out = [];
  for (const input of ${JSON.stringify(inputs)}) { GV.setSpeed(0); localStorage.setItem(${JSON.stringify(SLOT)}, input); if (GV.load() !== true) throw new Error('load'); GV.setSpeed(0); GV.save(); out.push(localStorage.getItem(${JSON.stringify(SLOT)})); }
  return { out };
})()`;
function variant(save, block, k) {
  const j = JSON.parse(save);
  if (block === 'fiscal') { for (const key of LAST) j.fiscal515[key] = j.day + k; j.fiscal515.processedProjects = [...(j.fiscal515.processedProjects || []), 'QA791-a', 'QA791-b']; } else j.obs514.lastSampleDay = j.day + k;
  return JSON.stringify(j);
}

(async () => {
  const report = { ok: false, fails: [], acceptedDeviations: [], port: PORT, mathSeed: MATHSEED, pages: { P2: hash(P2), P1: hash(P1), P0: hash(P0), v1472: hash(V1472) }, U2: [], U5: null };
  const fail = (m) => { report.fails.push(m); console.log('FAIL ' + m); };
  const t0 = Date.now();
  if (ONLY.includes('U2')) {
    let anyProcessed = false;
    for (const L of LEAKS.filter((x) => !LEAK_ONLY || LEAK_ONLY.includes(x.name))) {
      const made = await session(P0, leakExpr(L));
      const g = gaps(made.save);
      const row = { name: L.name, made: { version: made.version, asked: made.asked, bytes: made.save.length, sha: hash(made.save).slice(0, 16), ...g } };
      if (!(g.fiscalGap > 14 && g.obsGap > 14)) fail(L.name + ' leak gap not above 14: ' + JSON.stringify({ fiscalGap: g.fiscalGap, obsGap: g.obsGap }));
      if (L.how === 'button' && made.asked !== 1) fail(L.name + ' confirm asked ' + made.asked);
      if (g.processed > 0) anyProcessed = true;
      const expectedProcessed = JSON.stringify((JSON.parse(made.save).fiscal515.processedProjects || []).map(String).slice(-120));
      const n = await session(P2, checkExpr(made.save)), o = await session(P1, checkExpr(made.save));
      for (const [tag, s] of [['P2', n], ['P1', o]]) if ((s.errors || []).length) fail(L.name + ' ' + tag + ' console errors ' + JSON.stringify(s.errors));
      const a = n.at0, b = o.at0;
      // U2（P2）
      const u2 = { noFutureLast: Math.max(...a.last) <= a.day, recordsSame: a.records === b.records, processedKept: a.processed === expectedProcessed,
        obsNoOld: a.obsBook === 0 && a.obsSampleDays.length <= 1 && a.obsSampleDays.every((d) => d === a.day) && a.obsLast <= a.day,
        aggregations30: n.at30.histDays.filter((d) => d > a.day).length, assetScans30: n.at30.assetScans - a.assetScans };
      if (!u2.noFutureLast) fail(L.name + ' U2 future last day after load ' + JSON.stringify(a.last) + ' day ' + a.day);
      if (!u2.recordsSame) fail(L.name + ' U2 fiscal records differ from P1 ' + JSON.stringify([a.hist, a.settle, a.ledger, b.hist, b.settle, b.ledger]));
      if (!u2.processedKept) fail(L.name + ' U2 processedProjects changed');
      if (!u2.obsNoOld) fail(L.name + ' U2 observatory keeps old samples ' + JSON.stringify([a.obsSampleDays, a.obsBook, a.obsLast, a.day]));
      if (!(u2.aggregations30 >= 4)) fail(L.name + ' U2 aggregations in 30 days ' + u2.aggregations30);
      if (!(u2.assetScans30 >= 2)) fail(L.name + ' U2 asset scans in 30 days ' + u2.assetScans30);
      // U3（P1）
      const u3 = { lateAbove14: Math.max(...b.last) - b.day > 14, historyKept: b.hist >= 1, last: b.last, day: b.day, hist: b.hist, obsLast: b.obsLast, aggregations30: o.at30.hist - b.hist };
      if (!u3.lateAbove14) fail(L.name + ' U3 old page not late by more than 14 ' + JSON.stringify(b.last) + ' day ' + b.day);
      if (!u3.historyKept) fail(L.name + ' U3 old page history gone');
      // U4（P2 vs P1）
      const moneySame = JSON.stringify(n.money) === JSON.stringify(o.money);
      const diffs = Object.fromEntries([0, 10, 20, 30].map((d) => [d, keyDiff(n.saves[d], o.saves[d])]));
      const onlyBlocks = Object.values(diffs).every((ks) => ks.every((k) => k === 'obs514' || k === 'fiscal515'));
      if (!moneySame) fail(L.name + ' U4 money differs ' + JSON.stringify({ P2: n.money, P1: o.money }));
      const outside = [];
      if (!onlyBlocks) {
        // 業主 2026-11-05 第四題：U4「obs514、fiscal515 以外逐字相同」照字面沒過，接受、照實記錄。照算、照印，列進 acceptedDeviations，不再算成 FAIL。
        console.log('T791 DEVIATION ' + L.name + ' U4 save differs outside obs514/fiscal515 ' + JSON.stringify(diffs));
        for (const d of [0, 10, 20, 30]) { const a2 = JSON.parse(n.saves[d]), b2 = JSON.parse(o.saves[d]); for (const k of diffs[d].filter((k) => k !== 'obs514' && k !== 'fiscal515')) { const dd = deepDiff(a2[k], b2[k]); outside.push({ day: d, key: k, diff: dd }); console.log('T791 DIAG ' + L.name + ' day+' + d + ' ' + k + ' ' + JSON.stringify(dd)); } }
        report.acceptedDeviations.push({ scenario: L.name, item: 'U4 other save fields identical', decision: 'DECISIONS 2026-11-05 第四題', diffs, outside });
      }
      const re = await session(P2, reloadExpr(made.save)), reOld = await session(P1, reloadExpr(made.save));
      // 對照組：同一條「讀回、立刻存檔、再讀回」在 P1 上也走一次；存檔再讀回本身會不會改動沒有存進檔的執行期狀態，兩頁一樣。
      const reloadVsDirectP1 = JSON.stringify(re.money) === JSON.stringify(o.money), reloadVsReloadP1 = JSON.stringify(re.money) === JSON.stringify(reOld.money);
      // 錢的對照用同一條路（P1 也讀回、立刻存檔、再讀回）；跟 P1 直接讀回的比較只記錄（存檔再讀回在 P1 上本身就可能改變錢的走向，原生既有）。
      const reloadOk = re.hasFiscal && re.processed === JSON.stringify(JSON.parse(made.save).fiscal515.processedProjects) && reloadVsReloadP1;
      if (!reloadOk) fail(L.name + ' U4 save-right-after-load path ' + JSON.stringify({ hasFiscal: re.hasFiscal, processedSame: re.processed === JSON.stringify(JSON.parse(made.save).fiscal515.processedProjects), moneySame: reloadVsDirectP1, sameAsP1Reload: reloadVsReloadP1, p1ReloadSameAsP1Direct: JSON.stringify(reOld.money) === JSON.stringify(o.money) }));
      if (L.devDone && !(made.dev && made.dev.processed && made.dev.captureRows.length >= 1 && made.dev.captureRows.every((v) => v > 0))) fail(L.name + ' development project was not captured before the save ' + JSON.stringify(made.dev));
      row.U2 = { ...u2, at0: { day: a.day, last: a.last, hist: a.hist, settle: a.settle, ledger: a.ledger, obsSampleDays: a.obsSampleDays, obsLast: a.obsLast }, processedCount: JSON.parse(a.processed).length, dev: made.dev || null };
      row.U4reload = { hasFiscal: re.hasFiscal, processedSame: re.processed === JSON.stringify(JSON.parse(made.save).fiscal515.processedProjects), moneySame: reloadVsDirectP1, sameAsP1Reload: reloadVsReloadP1,
        p1ReloadSameAsP1Direct: JSON.stringify(reOld.money) === JSON.stringify(o.money), firstMoneyDiffDay: re.money.findIndex((v, i) => v !== reOld.money[i]) };
      row.U3 = u3;
      row.U4 = { moneySame, money0: n.money[0], money30: n.money[30], moneyDays: n.money.length, diffs, onlyBlocks, outside };
      report.U2.push(row);
      console.log('T791 ' + L.name + ' ' + JSON.stringify({ gap: [g.fiscalGap, g.obsGap], processed: g.processed, u2: [u2.noFutureLast, u2.recordsSame, u2.processedKept, u2.obsNoOld, u2.aggregations30, u2.assetScans30], u3: [u3.lateAbove14, u3.hist], u4: [moneySame, onlyBlocks, reloadOk], dev: made.dev || null }));
    }
    if (!anyProcessed) fail('U2 no leaked save has processedProjects; keep-check not exercised');
    const moving = report.U2.filter((r) => r.U4.money30 !== r.U4.money0).map((r) => r.name);
    report.U4moneyMoving = moving;
    if (moving.length < 2) fail('U4 money moved in fewer than two leak scenarios: ' + JSON.stringify(moving));
  }
  if (ONLY.includes('U5')) {
    const bases = {};
    for (const seed of SEEDS) { const r = await session(P2, normalExpr(seed, 60)); bases[seed] = r.save; }
    const v = await session(V1472_HOOKED, v1472Expr);
    if (v.version !== '14.72') fail('v14.72 save made by ' + v.version);
    const base = bases[SEEDS[0]], bg = gaps(base);
    if (!(bg.fiscalGap <= 0 && bg.obsGap <= 0)) fail('U5 base save is not normal ' + JSON.stringify(bg));
    const cases = [];
    for (const block of ['fiscal', 'obs']) for (const k of [0, 7, 14, 15]) cases.push({ name: block + '+' + k, block, k, input: variant(base, block, k) });
    for (const seed of SEEDS) cases.push({ name: 'normal-' + seed, input: bases[seed] });
    cases.push({ name: 'v14.72', input: v.save });
    const inputs = cases.map((c) => c.input);
    const n = await session(P2, roundtripExpr(inputs)), o = await session(P1, roundtripExpr(inputs));
    const rows = cases.map((c, i) => {
      const diff = keyDiff(n.out[i], o.out[i]);
      let ok, extra = {};
      if (c.k === 15) {
        const want = c.block === 'fiscal' ? ['fiscal515'] : ['obs514'];
        ok = JSON.stringify(diff) === JSON.stringify(want);
        if (c.block === 'fiscal') {
          const fn = JSON.parse(n.out[i]).fiscal515, fo = JSON.parse(o.out[i]).fiscal515, inner = [...new Set([...Object.keys(fn), ...Object.keys(fo)])].filter((k) => JSON.stringify(fn[k]) !== JSON.stringify(fo[k])).sort();
          const kept = JSON.stringify(fn.processedProjects) === JSON.stringify(JSON.parse(c.input).fiscal515.processedProjects);
          const cadenceOnly = inner.every((k) => LAST.includes(k)) && LAST.every((k) => fn[k] === -999);
          extra = { processedKept: kept, processedCount: (fn.processedProjects || []).length, innerDiff: inner, p2Last: LAST.map((k) => fn[k]), p1Last: LAST.map((k) => fo[k]) };
          ok = ok && kept && cadenceOnly;
        }
      } else ok = n.out[i] === o.out[i];
      if (!ok) fail('U5 ' + c.name + ' ' + JSON.stringify({ diff, ...extra }));
      return { name: c.name, ok, diff, sameBytes: n.out[i] === o.out[i], ...extra };
    });
    report.U5 = { base: { seed: SEEDS[0], ...bg }, v1472: { version: v.version, ...gaps(v.save) }, rows };
    console.log('T791 U5 ' + JSON.stringify(rows.map((r) => [r.name, r.ok, r.diff.join('+') || '='])));
  }
  report.seconds = Math.round((Date.now() - t0) / 1000);
  report.ok = report.fails.length === 0;
  console.log('LOADSTALE791 ' + JSON.stringify(report, null, 1));
  console.log('LOADSTALE791 RESULT ' + (report.ok ? 'PASS' : 'FAIL'));
  process.exit(report.ok ? 0 : 1);
})().catch((e) => { console.log('LOADSTALE791 RESULT FAIL ' + (e && e.stack || e)); process.exit(1); });

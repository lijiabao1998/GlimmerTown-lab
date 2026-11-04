'use strict';
/* DSK-021 / LAB-08：原生通勤 OD 來源研究（唯讀）。
 *
 * 只讀已結算資料：GV.t468() / GV.t491() / GV.commuteLoad() / GV.commuteAt()。
 * 不呼叫 recomputeCommute、不寫存檔、探測本身不造人口／工作；fresh 沙盒城市。
 * T779：先用固定種子開新城、只打開原生 AI 市長、GV.step 推進 60 天（城市由原生 AI 與模擬長出），
 *       再在讀取階段做唯讀證明，並斷言 totalTrips > 0（原卡凍結驗收第 1 條）。
 *
 * 用法：node probeCommuteOd08.cjs
 */
const { withGame } = require('./harness.js');
const fs = require('node:fs');

const SELF = fs.readFileSync(__filename, 'utf8');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const storageAll = () => { try { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; } catch (e) { return { error: String(e) }; } };
  try {
    if (!window.GV) throw new Error('GV 不存在');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);

    // T779 B1：第一階段，讓城市自然長出來。固定種子新城，只打開遊戲原生的 AI 市長，用 GV.step 推進。
    // 城市與人口全由原生 AI 與原生模擬產生；探測不寫任何地格、居民、工作或資料欄位。
    // （原本在頁面裡空轉 4 秒等 rAF：空轉佔住主執行緒，畫面迴圈不會跑，城市其實沒有前進。）
    const GROW_DAYS = 60;
    GV.newWorldSeeded(20261104);
    out.facts.grow = { seed: 20261104, ai: GV.ai(true) };
    let dayAfter = null;
    for (let d = 0; d < GROW_DAYS; d += 30) dayAfter = GV.step(30);
    const st = GV.stats();
    out.facts.grow.days = GROW_DAYS;
    out.facts.grow.day = dayAfter;
    out.facts.grow.pop = st.pop;
    out.facts.grow.jobs = st.jobs;

    // T779 B3：第二階段，唯讀讀取。讀取前後 localStorage 逐鍵逐值相同。
    const before = storageAll();

    // 形狀
    const t468 = GV.t468();
    out.facts.t468Keys = Object.keys(t468 || {});
    out.facts.assignmentKeys = t468 && t468.assignment ? Object.keys(t468.assignment) : null;
    out.facts.modeShare = t468 && t468.assignment ? t468.assignment.modeShare : null;

    const t491 = GV.t491();
    out.facts.t491Keys = Object.keys(t491 || {});
    out.facts.invariants = t491 ? t491.invariants : null;

    const load = GV.commuteLoad();
    out.facts.commuteLoad = { clusters: load && load.clusters ? load.clusters.length : null, unreachable: load ? load.unreachable : null };

    let N = 0;
    for (let n = 64; n <= 256; n += 32) { if (!GV.tile(n - 1, 0)) break; N = n; }
    out.facts.mapN = N;
    let sample = null;
    for (let i = 0; i < N * N && !sample; i++) {
      const x = i % N, y = (i / N) | 0;
      const v = GV.commuteAt(x, y);
      if (v && v > 0) sample = { x, y, load: v };
    }
    out.facts.commuteSample = sample;

    // 唯讀證明 1：連讀兩次完全一致
    const a1 = JSON.stringify(GV.t468()), a2 = JSON.stringify(GV.t468());
    const b1 = JSON.stringify(GV.t491()), b2 = JSON.stringify(GV.t491());
    out.facts.stable = { t468: a1 === a2, t491: b1 === b2 };

    // 唯讀證明 2：讀前後 storage 逐鍵逐值相同
    const after = storageAll();
    out.facts.storage = { keys: Object.keys(before).length, unchanged: same(before, after) };

    const t468b = GV.t468();
    out.facts.afterRun = {
      day: t468b.assignment ? t468b.assignment.day : null,
      totalTrips: t468b.assignment ? t468b.assignment.totalTrips : null,
      modes: t468b.assignment ? t468b.assignment.modeShare : null,
      auditOk: !!(t468b.audit && t468b.audit.ok)
    };

    if (!out.facts.stable.t468 || !out.facts.stable.t491) fail('連續讀取不一致（不是唯讀或含隨機）');
    if (!out.facts.storage.unchanged) fail('讀取改動了 localStorage');

    // 明確認定：原生有沒有 OD 配對矩陣（有的話長什麼形狀）
    const asg = t468b.assignment || {};
    const od = asg.od;
    out.facts.odShape = {
      present: od !== undefined && od !== null,
      type: Array.isArray(od) ? 'array' : typeof od,
      keys: od && !Array.isArray(od) && typeof od === 'object' ? Object.keys(od).slice(0, 12) : null,
      length: Array.isArray(od) ? od.length : null,
      sample: Array.isArray(od) ? od.slice(0, 2) : (od && typeof od === 'object' ? Object.entries(od).slice(0, 2) : null)
    };
    out.facts.topODShape = {
      type: Array.isArray(asg.topOD) ? 'array' : typeof asg.topOD,
      length: Array.isArray(asg.topOD) ? asg.topOD.length : null,
      sample: Array.isArray(asg.topOD) ? asg.topOD.slice(0, 2) : null
    };
    out.facts.hasExplicitOdMatrix = !!out.facts.odShape.present;
    out.facts.odFieldsInAssignment = Object.keys(asg).filter((k) => /od|origin|destination|pair|commute/i.test(k));
    if (!out.facts.hasExplicitOdMatrix) fail('沒有找到 OD 欄位（連 od／topOD 都沒有）');

    // T779 B2：凍結驗收第 1 條原文——城市自然跑過之後，總運量必須大於 0；OD 列不是空的，並記下實際欄位。
    out.facts.odRowKeys = Array.isArray(od) && od.length ? Object.keys(od[0]) : [];
    if (!(out.facts.afterRun.totalTrips > 0)) fail('凍結驗收 1：城市自然跑 ' + GROW_DAYS + ' 天後 totalTrips 必須 > 0，實際 ' + out.facts.afterRun.totalTrips);
    if (!(Array.isArray(od) && od.length > 0)) fail('凍結驗收 1：OD 列是空的');
    out.facts.tripsNote = '城市由原生 AI 市長在固定種子沙盒自然長出（探測不寫地格／居民／工作）；不呼叫重算。';

    out.ok = out.fails.length === 0;
    return out;
  } catch (e) {
    out.error = String((e && e.stack) || e);
    return out;
  }
})()`;

(async () => {
  if (/(recomputeCommute|recomputeCommute491)\s*\(/.test(SELF)) {
    console.error('PROBE_OD08 FORBIDDEN recompute call in probe source');
    process.exitCode = 1;
    return;
  }
  const r = await withGame({ port: 8199, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => cdp.evalJs(PAGE));
  const res = r && r.result;
  console.log('PROBE_OD08 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_OD08 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_OD08 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

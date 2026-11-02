'use strict';
/* DSK-021 / LAB-08：原生通勤 OD 來源研究（唯讀）。
 *
 * 只讀已結算資料：GV.t468() / GV.t491() / GV.commuteLoad() / GV.commuteAt()。
 * 不呼叫 recomputeCommute、不寫存檔、不動人口／工作；fresh 沙盒城市。
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
  const storageLen = () => { try { return localStorage.length; } catch (e) { return -1; } };
  try {
    if (!window.GV) throw new Error('GV 不存在');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);

    const before = storageLen();

    // 形狀
    const t468 = GV.t468();
    out.facts.t468Keys = Object.keys(t468 || {});
    out.facts.assignmentKeys = t468 && t468.assignment ? Object.keys(t468.assignment) : null;
    out.facts.modeShare = t468 && t468.assignment ? t468.assignment.modeShare : null;

    const t491 = GV.t491();
    out.facts.t491Keys = Object.keys(t491 || {});
    out.facts.invariants = t491 ? t491.invariants : null;

    const load = GV.commuteLoad();
    out.facts.commuteLoad = load;

    // 找一格有通勤負載的住宅（最多掃 5000 格）
    let sample = null;
    for (let i = 0; i < 72 * 72 && !sample; i++) {
      const x = i % 72, y = (i / 72) | 0;
      const v = GV.commuteAt(x, y);
      if (v && v > 0) sample = { x, y, load: v };
    }
    out.facts.commuteSample = sample;

    // 唯讀證明 1：連讀兩次完全一致
    const a1 = JSON.stringify(GV.t468()), a2 = JSON.stringify(GV.t468());
    const b1 = JSON.stringify(GV.t491()), b2 = JSON.stringify(GV.t491());
    out.facts.stable = { t468: a1 === a2, t491: b1 === b2 };

    // 唯讀證明 2：讀前後 storage 不變
    const after = storageLen();
    out.facts.storage = { before, after, unchanged: before === after };

    // 讓城市自然跑幾個模擬日（正常遊戲，不是手動重算），再讀一次總運量
    if (typeof GV.setSpeed === 'function') {
      GV.setSpeed(8);
      const t0 = Date.now();
      while (Date.now() - t0 < 4000) { /* 讓 rAF 跑 */ }
      GV.setSpeed(0);
    }
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

    // 新城市沒有住戶／工作，運量本來就是 0；本卡依邊界不造人口，只照實記錄。
    out.facts.tripsNote = 'fresh 城市沒有住戶／工作，totalTrips 預期為 0；本卡不造人口（[等業主] 邊界），要看非零 OD 需業主的存檔。';

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

'use strict';
/* DSK-022 / LAB-09：有界客運研究的實測 probe（唯讀）。
 *
 * 1) 在真 Chrome 沙盒讀原生 t468 的 OD（新城市預期 0，照實記）。
 * 2) 用同一份核心跑合成 fixture，證明守恒與排序正確。
 * 3) 唯讀證明：localStorage 不變、t468 連讀兩次一致。
 * 4) T780：固定種子新城、只開原生 AI 市長、GV.step 推進 60 天（城市由原生 AI 與模擬長出，探測不寫地格／居民／工作），
 *    在唯讀階段對真 OD 跑同一份核心：逐列守恆（原生每欄四捨五入到 0.1，rowTolerance 0.3）、bike 與原生 unserved 都算進去。
 *
 * 用法：node probePassengerDemand09.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { withGame } = require('./harness.js');

const CORE = fs.readFileSync(path.join(__dirname, 'passenger-demand056.js'), 'utf8');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  const storageLen = () => { try { return localStorage.length; } catch (e) { return -1; } };
  try {
    ${CORE}
    const P = globalThis.passengerDemand056;
    if (!P) throw new Error('核心沒有載入');

    const before = storageLen();
    const t468a = GV.t468();
    const t468b = GV.t468();
    const after = storageLen();

    const od = (t468a.assignment && Array.isArray(t468a.assignment.od)) ? t468a.assignment.od : null;
    out.facts.nativeOd = {
      present: od !== null,
      length: od ? od.length : null,
      sameTwice: JSON.stringify(t468a) === JSON.stringify(t468b),
      storage: { before, after, unchanged: before === after }
    };
    if (!od) fail('t468().assignment.od 不是陣列');
    if (!out.facts.nativeOd.sameTwice) fail('t468 連讀兩次不一致');
    if (before !== after) fail('讀取改動了 localStorage');

    if (od) {
      const s = P.summarizeDemand(od, { maxRows: 5000 });
      out.facts.nativeSummary = { ok: s.ok, reason: s.reason, rowCount: s.rowCount, totals: s.ok ? s.totals : null, conserved: s.ok ? s.conserved : null };
      if (!s.ok) fail('原生 OD 摘要失敗：' + s.reason);
      if (s.ok && !s.conserved) fail('原生 OD 不守恒');
    }

    // 合成 fixture：3 街區、4 列
    const fixture = [
      { origin: 'B12', destination: 'C03', purpose: 'work', trips: 100, walk: 10, transit: 60, car: 20 },
      { origin: 'B12', destination: 'D07', purpose: 'shopping', trips: 40, walk: 5, transit: 25, car: 10 },
      { origin: 'B03', destination: 'C03', purpose: 'work', trips: 60, walk: 0, transit: 30, car: 30 },
      { origin: 'B03', destination: 'E01', purpose: 'work', trips: 20, walk: 0, transit: 0, car: 0 }
    ];
    const syn = P.boundedStudy(fixture, { maxRows: 100, top: 2 });
    out.facts.synthetic = {
      ok: syn.ok, conserved: syn.conserved, totals: syn.totals,
      top: syn.topUnserved.map((r) => ({ o: r.origin, d: r.destination, unserved: r.unserved }))
    };
    if (!syn.ok || !syn.conserved) fail('合成 fixture 不守恒');
    if (syn.totals.trips !== 220) fail('合成 fixture 總量不是 220（' + syn.totals.trips + '）');
    if (syn.totals.unserved !== 30) fail('合成 fixture 未服務不是 30（' + syn.totals.unserved + '）');
    if (syn.topUnserved[0].origin !== 'B03' || syn.topUnserved[0].destination !== 'E01') fail('排序第一名不是 B03→E01');

    // T780 B3：原生 AI 市長養的城市，對真 OD 跑核心。
    const storageAll = () => { try { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; } catch (e) { return { error: String(e) }; } };
    GV.setSpeed(0);
    GV.newWorldSeeded(20261104);
    GV.ai(true);
    GV.step(30); const growDay = GV.step(30);
    const s0 = storageAll();
    const c1 = GV.t468(), c2 = GV.t468();
    const s1 = storageAll();
    const cod = (c1.assignment && Array.isArray(c1.assignment.od)) ? c1.assignment.od : [];
    const ROW_TOL = 0.3; // trips 與五個分項共 6 個數，各自四捨五入到 0.1（每個最多偏 0.05）
    const cs = P.summarizeDemand(cod, { maxRows: 5000, rowTolerance: ROW_TOL });
    const sumTrips = cs.ok ? cs.totals.trips : null, total = c1.assignment ? c1.assignment.totalTrips : null;
    out.facts.nativeCity = {
      day: growDay, pop: GV.stats().pop, rows: cod.length, ok: cs.ok, reason: cs.reason || null, conserved: cs.ok ? cs.conserved : null,
      totals: cs.ok ? cs.totals : null, nativeUnservedRows: cs.ok ? cs.rows.filter((r) => r.unservedSource === 'native').length : null,
      sumTrips, assignmentTotalTrips: total, sumMinusTotal: (sumTrips !== null && total !== null) ? sumTrips - total : null,
      sameTwice: JSON.stringify(c1) === JSON.stringify(c2), storageUnchanged: JSON.stringify(s0) === JSON.stringify(s1),
      top3: cs.ok ? P.rankUnserved(cs.rows, 3).map((r) => ({ o: r.origin, d: r.destination, unserved: r.unserved })) : null
    };
    if (!(cod.length > 0)) fail('原生城市的 OD 是空的');
    if (!cs.ok) fail('原生城市 OD 摘要失敗：' + cs.reason + ' ' + JSON.stringify(cs.detail));
    if (cs.ok && !cs.conserved) fail('原生城市 OD 不守恆');
    if (!out.facts.nativeCity.sameTwice) fail('原生城市 t468 連讀兩次不一致');
    if (!out.facts.nativeCity.storageUnchanged) fail('原生城市讀取改動了 localStorage');
    // Σ每列 trips 與 assignment.totalTrips：每列與總數都各自四捨五入到 0.1（每個最多偏 0.05），上限 0.05×(列數＋1)。
    const sumTol = 0.05 * (cod.length + 1);
    out.facts.nativeCity.sumTolerance = sumTol;
    if (sumTrips === null || total === null || Math.abs(sumTrips - total) > sumTol) fail('Σtrips 與 totalTrips 相差超過四捨五入上限：' + JSON.stringify({ sumTrips, total, sumTol }));

    out.ok = out.fails.length === 0;
    return out;
  } catch (e) {
    out.error = String((e && e.stack) || e);
    return out;
  }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => cdp.evalJs(PAGE));
  const res = r && r.result;
  console.log('PROBE_DEMAND09 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_DEMAND09 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_DEMAND09 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

'use strict';
/* DSK-022 / LAB-09：有界客運研究的實測 probe（唯讀）。
 *
 * 1) 在真 Chrome 沙盒讀原生 t468 的 OD（新城市預期 0，照實記）。
 * 2) 用同一份核心跑合成 fixture，證明守恒與排序正確。
 * 3) 唯讀證明：localStorage 不變、t468 連讀兩次一致。
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

'use strict';
/* DSK-026 / LAB-11：同城 A–F 驗收。
 *
 * 在同一個 Chrome session、同一座 fresh 沙盒城市裡跑：
 *   A 公路配送（053） B 鐵路貨運（054） C 閉塞區間（055）
 *   D 公鐵聯運（057） E 客運需求（056） F 影子到訪（057 模型）
 * 最後驗證隔離：money／population／localStorage 在「建好測試場景之後」到「全部跑完之後」不變。
 *
 * 用法：node probeAcceptance11.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { withGame } = require('./harness.js');

const CORE056 = fs.readFileSync(path.join(__dirname, 'passenger-demand056.js'), 'utf8');
const CORE057 = fs.readFileSync(path.join(__dirname, 'shadow-visits057.js'), 'utf8');

const PAGE = `(() => {
  const out = { ok: false, fails: [], scenarios: {}, facts: {} };
  const fail = (m) => out.fails.push(m);
  const runScenario = (name, fn) => {
    try { const r = fn(); out.scenarios[name] = r; if (!r.ok) fail(name + ': ' + (r.reason || 'failed')); }
    catch (e) { out.scenarios[name] = { ok: false, reason: String((e && e.message) || e) }; fail(name + ': ' + ((e && e.message) || e)); }
  };
  try {
    if (!window.GV) throw new Error('GV 不存在');
    ${CORE056}
    ${CORE057}
    const DEMAND = globalThis.passengerDemand056;
    const VISITS = globalThis.shadowVisits057;
    if (!DEMAND || !VISITS) throw new Error('核心沒有載入');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);
    GV.addMoney(2000000);

    const tileAt = (x, y) => GV.tile(x, y);
    let N = 0;
    for (let x = 0; x <= 256; x++) { if (!tileAt(x, 0)) break; N = x + 1; }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;
    const idx = (x, y) => y * N + x;
    const land = (x, y) => { const t = tileAt(x, y); return !!(t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.bld && !t.water); };

    // ---- 建測試場景：公路 5 格、鐵路 8 格 ----
    let road = null, rail = null;
    for (let y = 6; y < N - 6 && !road; y++) {
      for (let x = 4; x < N - 12; x++) {
        let ok = true;
        for (let i = 0; i < 5; i++) if (!land(x + i, y)) { ok = false; break; }
        if (ok) { road = { x, y }; break; }
      }
    }
    for (let x = 4; x < N - 6 && !rail; x++) {
      for (let y = 6; y < N - 12; y++) {
        let ok = true;
        for (let i = 0; i < 8; i++) if (!land(x, y + i)) { ok = false; break; }
        if (ok) { rail = { x, y }; break; }
      }
    }
    if (!road || !rail) throw new Error('找不到可鋪路段');
    for (let i = 0; i < 5; i++) GV.place('road', road.x + i, road.y);
    for (let i = 0; i < 8; i++) GV.place('rail', rail.x, rail.y + i);
    out.facts.layout = { road, rail };

    const moneyAfterSetup = GV.money;
    const popAfterSetup = GV.population;
    const storageAfterSetup = (() => { try { return localStorage.length; } catch (e) { return -1; } })();

    // ---- A 公路配送 ----
    runScenario('A_road', () => {
      const p = GV.roadDelivery053.plan(idx(road.x, road.y), idx(road.x + 4, road.y));
      if (!p.ok) return { ok: false, reason: 'plan:' + p.reason };
      const s = GV.roadDelivery053.start(idx(road.x, road.y), idx(road.x + 4, road.y), { batchId: 'qa-11-A', qty: 5 }, 12);
      if (!s.ok) return { ok: false, reason: 'start:' + s.reason };
      for (let i = 0; i < p.steps + 1; i++) GV.roadDelivery053.step();
      const snap = GV.roadDelivery053.snapshot();
      return { ok: snap.status === 'DELIVERED' && snap.qty === 5, steps: p.steps, status: snap.status, qty: snap.qty };
    });

    // ---- B 鐵路貨運 ----
    runScenario('B_rail', () => {
      const p = GV.railFreight054.plan(idx(rail.x, rail.y), idx(rail.x, rail.y + 7));
      if (!p.ok) return { ok: false, reason: 'plan:' + p.reason };
      const s = GV.railFreight054.start(idx(rail.x, rail.y), idx(rail.x, rail.y + 7), { batchId: 'qa-11-B', qty: 9 }, 12);
      if (!s.ok) return { ok: false, reason: 'start:' + s.reason };
      for (let i = 0; i < p.steps + 1; i++) GV.railFreight054.step();
      const u = GV.railFreight054.unload();
      return { ok: u.ok && u.snapshot.status === 'UNLOADED' && u.snapshot.qty === 9, steps: p.steps, status: u.snapshot.status, qty: u.snapshot.qty };
    });

    // ---- C 閉塞區間 ----
    runScenario('C_block', () => {
      const a = GV.railBlock055.spawn('t1', idx(rail.x, rail.y + 1), idx(rail.x, rail.y + 6), { batchId: 'qa-11-C1', qty: 4 });
      const b = GV.railBlock055.spawn('t2', idx(rail.x, rail.y + 6), idx(rail.x, rail.y + 1), { batchId: 'qa-11-C2', qty: 3 });
      if (!a.ok || !b.ok) return { ok: false, reason: 'spawn' };
      const r1 = GV.railBlock055.request('t1');
      const r2 = GV.railBlock055.request('t2');
      const blocked = GV.railBlock055.advance('t2');
      GV.railBlock055.advance('t1'); GV.railBlock055.advance('t1');
      const brk = GV.railBlock055.breakTile(idx(rail.x, rail.y + 4));
      const hit = GV.railBlock055.advance('t1');
      GV.railBlock055.repairTile(idx(rail.x, rail.y + 4));
      const ok = r1.status === 'GRANTED' && r2.status === 'WAITING' && blocked.reason === 'no-authority' && hit.reason === 'track-broken';
      // 收尾：全部取消，避免影響後面
      GV.railBlock055.end();
      return { ok, granted: r1.status, waiting: r2.status, waitingBlocked: blocked.reason, broken: hit.reason };
    });

    // ---- D 公鐵聯運 ----
    runScenario('D_intermodal', () => {
      const s = GV.intermodal057.start({
        roadFrom: idx(road.x, road.y), roadTo: idx(road.x + 4, road.y),
        railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + 7),
        cargo: { batchId: 'qa-11-D', qty: 6 }, capacity: 12
      });
      if (!s.ok) return { ok: false, reason: s.reason };
      for (let i = 0; i < s.roadSteps; i++) GV.intermodal057.advance();
      const tr = GV.intermodal057.transfer();
      for (let i = 0; i < s.railSteps; i++) GV.intermodal057.advance();
      const snap = GV.intermodal057.snapshot();
      return { ok: tr.ok && snap.status === 'DELIVERED' && snap.qty === 6, roadSteps: s.roadSteps, railSteps: s.railSteps, status: snap.status, qty: snap.qty };
    });

    // ---- E 客運需求 ----
    runScenario('E_demand', () => {
      const t = GV.t468();
      const od = (t.assignment && Array.isArray(t.assignment.od)) ? t.assignment.od : [];
      const native = DEMAND.summarizeDemand(od, { maxRows: 1000 });
      const syn = DEMAND.summarizeDemand([
        { origin: 'A', destination: 'B', purpose: 'work', trips: 100, walk: 10, transit: 60, car: 20 },
        { origin: 'C', destination: 'D', purpose: 'work', trips: 50, walk: 0, transit: 20, car: 30 }
      ]);
      return { ok: native.ok && native.conserved && syn.ok && syn.totals.unserved === 10 && syn.totals.trips === 150, nativeRows: native.rowCount, synUnserved: syn.totals.unserved };
    });

    // ---- F 影子到訪 ----
    runScenario('F_visits', () => {
      const stations = [], shops = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const t = tileAt(x, y);
        if (!t || !t.bld || t.bld.ref) continue;
        if ([17, 21, 55, 139].indexOf(t.bld.k) >= 0) stations.push({ id: 'k' + t.bld.k + '@' + x + ',' + y, x, y, demand: 10 });
        else if (t.bld.k === 2) shops.push({ id: 'shop@' + x + ',' + y, x, y, attract: 1 });
      }
      const synStations = [{ id: 'S1', x: 20, y: 20, demand: 100 }, { id: 'S2', x: 30, y: 24, demand: 60 }];
      const synShops = [{ id: 'A', x: 21, y: 20, attract: 1.5 }, { id: 'B', x: 25, y: 22, attract: 1 }, { id: 'E', x: 60, y: 60 }];
      const syn = VISITS.computeShadowVisits({ radius: 10, stations: synStations, shops: synShops });
      return { ok: syn.ok && syn.totals.isolated >= 1 && VISITS.rankShops(syn.rows, 1)[0].id === 'A', scannedStations: stations.length, scannedShops: shops.length, synVisits: syn.totals.visits, synIsolated: syn.totals.isolated };
    });

    // ---- 隔離總檢查 ----
    out.facts.isolation = {
      moneyAfterSetup, moneyAfterAll: GV.money,
      popAfterSetup, popAfterAll: GV.population,
      storageAfterSetup, storageAfterAll: (() => { try { return localStorage.length; } catch (e) { return -1; } })()
    };
    if (out.facts.isolation.moneyAfterAll !== moneyAfterSetup) fail('money 被影子任務改動了');
    if (out.facts.isolation.popAfterAll !== popAfterSetup) fail('population 被影子任務改動了');
    if (out.facts.isolation.storageAfterAll !== storageAfterSetup) fail('localStorage 被影子任務改動了');

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
  console.log('PROBE_ACCEPT11 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_ACCEPT11 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_ACCEPT11 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

'use strict';
/* DSK-036 / V67 §5.4：在**真居民城市**上跑 LAB-11 的 A–F 六情境（不再用測試場景）。
 * 只讀原生狀態；不改存檔、不寫正式經濟。
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const D056 = fs.readFileSync('passenger-demand056.js', 'utf8');
const V057 = fs.readFileSync('shadow-visits057.js', 'utf8');

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return GV.stats();
})()`;

const RUN = `(() => {
  ${D056}
  ${V057}
  const DM = globalThis.passengerDemand056, VS = globalThis.shadowVisits057;
  const out = { ok: false, scenarios: {}, fails: [] };
  const check = (id, cond, info) => { out.scenarios[id] = Object.assign({ pass: !!cond }, info || {}); if (!cond) out.fails.push(id); };
  try {
    GV.setSpeed(0);
    const n = GV.N();
    const idx = (x, y) => y * n + x;
    const land = (x, y) => { const t = GV.tile(x, y); return !!(t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.bld && !t.water); };
    let road = null, rail = null, rail2 = null;
    for (let y = 6; y < n - 6 && !road; y++) for (let x = 4; x < n - 10; x++) { let ok = true; for (let i = 0; i < 4; i++) if (!land(x + i, y)) { ok = false; break; } if (ok) { road = { x, y }; break; } }
    for (let x = 4; x < n - 6 && !rail; x++) for (let y = 6; y < n - 12; y++) { let ok = true; for (let i = 0; i < 8; i++) if (!land(x, y + i)) { ok = false; break; } if (ok) { rail = { x, y }; break; } }
    if (!road || !rail) throw new Error('no track');
    for (let i = 0; i < 4; i++) GV.place('road', road.x + i, road.y);
    for (let i = 0; i < 8; i++) GV.place('rail', rail.x, rail.y + i);

    // A. road delivery on the real city
    const a = GV.roadDelivery053.start(idx(road.x, road.y), idx(road.x + 3, road.y), { batchId: 'city-A', qty: 5 }, 12);
    if (a.ok) for (let i = 0; i < a.steps; i++) GV.roadDelivery053.step();
    const asnap = GV.roadDelivery053.snapshot();
    check('A_road', a.ok && asnap.status === 'DELIVERED' && asnap.qty === 5, { status: asnap.status, qty: asnap.qty, steps: a.steps });

    // B. rail freight
    const b = GV.railFreight054.start(idx(rail.x, rail.y), idx(rail.x, rail.y + 7), { batchId: 'city-B', qty: 4 }, 12);
    if (b.ok) for (let i = 0; i < b.steps; i++) GV.railFreight054.step();
    const bsnap = GV.railFreight054.snapshot();
    check('B_rail', b.ok && bsnap.status === 'ARRIVED' && bsnap.qty === 4, { status: bsnap.status, qty: bsnap.qty, steps: b.steps });

    // C. block authority: nobody moves without the grant
    const held = GV.railBlock055.request('train-C1');
    const second = GV.railBlock055.request('train-C2');
    const broke = GV.railBlock055.breakTile(idx(rail.x, rail.y + 2));
    const snapC = GV.railBlock055.snapshot();
    check('C_block', held.ok && second.ok === true && snapC.holder === 'train-C1' && snapC.broken.length === 1 && snapC.waiting.indexOf('train-C2') >= 0,
      { holder: snapC.holder, waiting: snapC.waiting, broken: snapC.broken.length, queuedSecond: snapC.waiting.indexOf('train-C2') >= 0 });
    GV.railBlock055.repairTile(idx(rail.x, rail.y + 2));
    GV.railBlock055.release('train-C1');
    GV.railBlock055.release('train-C2');

    // D. intermodal with authority + settlement
    const L = GV.singleResearch052;
    L.demo();
    const ls = L.snapshot();
    const bt = ls.ledger.batches[0];
    GV.railBlock055.request('train-D');
    const holderD = GV.railBlock055.snapshot().holder;
    check('D_grant', holderD === 'train-D', { holder: holderD });
    const d = GV.intermodal057.start({
      roadFrom: idx(road.x, road.y), roadTo: idx(road.x + 3, road.y),
      railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + 4),
      cargo: { batchId: bt.batchId, qty: bt.qty }, capacity: 12,
      authority: 'train-D', ledger: { sessionId: ls.ledger.sessionId, batchId: bt.batchId }
    });
    if (d.ok) {
      for (let i = 0; i < d.roadSteps; i++) GV.intermodal057.advance();
      GV.intermodal057.transfer();
      for (let i = 0; i < d.railSteps; i++) GV.intermodal057.advance();
    }
    const dsnap = GV.intermodal057.snapshot();
    check('D_intermodal', d.ok && dsnap.status === 'DELIVERED' && dsnap.settlement && dsnap.settlement.ok === true,
      { status: dsnap.status, qty: dsnap.qty, settlement: dsnap.settlement });

    // E. passenger demand on the real native OD
    const t = GV.t468();
    const od = (t.assignment && t.assignment.od) || [];
    const dem = DM.summarizeDemand(od, { maxRows: 2000 });
    check('E_demand', dem.ok === true && dem.conserved === true && od.length > 0,
      { rows: od.length, trips: dem.ok ? +dem.totals.trips.toFixed(1) : null, unserved: dem.ok ? +dem.totals.unserved.toFixed(1) : null, conserved: dem.conserved });

    // F. shadow visits on real shops with road distance (place native high-street commerce first)
    const placedShops = [];
    for (const tool of ['coOpStores', 'stoneBakehouse', 'coveredMarket']) {
      outer: for (let y = 8; y < n - 8; y++) for (let x = 8; x < n - 8; x++) {
        if (GV.place(tool, x, y)) { placedShops.push({ tool, x, y }); break outer; }
      }
    }
    const shops = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const tl = GV.tile(x, y); if (tl && tl.bld && !tl.bld.ref && [238, 239, 240].indexOf(tl.bld.k) >= 0) shops.push({ id: 's@' + x + ',' + y, x, y, attract: 1 }); }
    const block = 8;
    const byBlock = new Map();
    for (const r of od) { const trips = Number(r.trips) || 0; if (!(trips > 0)) continue; const p = String(r.origin || '').split(','); const bx = +p[0], by = +p[1]; if (!Number.isFinite(bx) || !Number.isFinite(by)) continue; const k = bx + ',' + by; byBlock.set(k, (byBlock.get(k) || 0) + trips); }
    const stations = [...byBlock.entries()].map(([k, trips]) => { const q = k.split(',').map(Number); return { id: 'b:' + k, x: q[0] * block + block / 2, y: q[1] * block + block / 2, demand: +trips.toFixed(2) }; });
    const roadAt = (x, y) => { const tl = GV.tile(x, y); return !!(tl && tl.road); };
    const near = (x, y) => { for (let r = 0; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < n && ny < n && roadAt(nx, ny)) return [nx, ny]; } return null; };
    const cache = new Map();
    const roadDist = (ax, ay, bx, by) => {
      const A = near(Math.round(ax), Math.round(ay)), B = near(Math.round(bx), Math.round(by));
      if (!A || !B) return Infinity;
      const key = A + '>' + B; if (cache.has(key)) return cache.get(key);
      const seen = new Uint8Array(n * n), q = [[A[0], A[1], 0]]; seen[A[1] * n + A[0]] = 1; let ans = Infinity;
      while (q.length) { const c = q.shift(); if (c[0] === B[0] && c[1] === B[1]) { ans = c[2]; break; } if (c[2] > 48) continue;
        for (const dd of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = c[0] + dd[0], ny = c[1] + dd[1]; if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue; const kk = ny * n + nx; if (seen[kk] || !roadAt(nx, ny)) continue; seen[kk] = 1; q.push([nx, ny, c[2] + 1]); } }
      cache.set(key, ans); return ans;
    };
    const visits = (shops.length && stations.length) ? VS.computeShadowVisits({ radius: 24, stations, shops, walkDistance: roadDist }) : null;
    check('F_visits', !!(visits && visits.ok), { shops: shops.length, blocks: stations.length, totalVisits: visits && visits.ok ? visits.totals.visits : null, isolated: visits && visits.ok ? visits.totals.isolated : null });

    out.stats = GV.stats();
    out.ok = out.fails.length === 0;
    return out;
  } catch (e) { out.error = String((e && e.message) || e); return out; }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 600, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    await cdp.evalJs(BUILD);
    await new Promise((res) => setTimeout(res, 10000));
    return await cdp.evalJs(RUN);
  });
  console.log(JSON.stringify({ ok: r.ok, result: r.result, fails: r.fails }, null, 1));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

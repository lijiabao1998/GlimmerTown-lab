'use strict';
/* DSK-031 / V67 §5.3: shadow visits on a REAL populated city, using native OD blocks as
 * demand sources and native high-street commerce buildings as attractors.
 */
const fs = require('node:fs');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const CORE057 = fs.readFileSync('shadow-visits057.js', 'utf8');
const COMMERCE = [238, 239, 240];

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return GV.stats();
})()`;

const RUN = `(() => {
  ${CORE057}
  const V = globalThis.shadowVisits057;
  const out = { ok: false, facts: {} };
  try {
    const n = GV.N();
    GV.setSpeed(0);
    out.facts.city = GV.stats();

    // demand: aggregate native OD origins (block "x,y") with their trips
    const t = GV.t468();
    const od = (t.assignment && t.assignment.od) || [];
    const block = 8; // native mobility block size for N<=144
    const byBlock = new Map();
    for (const r of od) {
      const trips = Number(r.trips) || 0;
      if (!(trips > 0)) continue;
      const parts = String(r.origin || '').split(',');
      const bx = Number(parts[0]), by = Number(parts[1]);
      if (!Number.isFinite(bx) || !Number.isFinite(by)) continue;
      const key = bx + ',' + by;
      byBlock.set(key, (byBlock.get(key) || 0) + trips);
    }
    const stations = [...byBlock.entries()].map(([k, trips]) => {
      const [bx, by] = k.split(',').map(Number);
      return { id: 'block:' + k, x: bx * block + block / 2, y: by * block + block / 2, demand: +trips.toFixed(2) };
    });
    out.facts.demandBlocks = { count: stations.length, totalTrips: +stations.reduce((a, s) => a + s.demand, 0).toFixed(2), sample: stations.slice(0, 3) };

    // place a few native high-street commerce buildings so the city really has shops
    const placed = [];
    const tools = ['coOpStores', 'stoneBakehouse', 'coveredMarket'];
    outer: for (const tool of tools) {
      for (let y = 8; y < n - 8; y++) for (let x = 8; x < n - 8; x++) {
        if (GV.canPlaceTool(tool, x, y)) continue;
        if (GV.place(tool, x, y)) { placed.push({ tool, x, y }); continue outer; }
      }
    }
    out.facts.placedShops = placed;

    const shops = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const tl = GV.tile(x, y);
      if (!tl || !tl.bld || tl.bld.ref) continue;
      if (${JSON.stringify(COMMERCE)}.indexOf(tl.bld.k) >= 0) shops.push({ id: 'shop' + tl.bld.k + '@' + x + ',' + y, x, y, attract: 1 });
    }
    out.facts.shops = shops.length;
    if (!stations.length || !shops.length) {
      out.facts.visits = { ok: false, reason: 'missing demand or shops', stations: stations.length, shops: shops.length };
      out.ok = true;
      return out;
    }
    // Real walk distance: BFS over native road tiles between each endpoint's nearest road.
    const roadAt = (x, y) => { const t = GV.tile(x, y); return !!(t && t.road); };
    const nearestRoad = (x, y) => {
      for (let r = 0; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < n && ny < n && roadAt(nx, ny)) return [nx, ny];
      }
      return null;
    };
    const distCache = new Map();
    const roadDist = (ax, ay, bx, by) => {
      const A = nearestRoad(Math.round(ax), Math.round(ay)), B = nearestRoad(Math.round(bx), Math.round(by));
      if (!A || !B) return Infinity;
      const key = A[0] + ',' + A[1] + '>' + B[0] + ',' + B[1];
      if (distCache.has(key)) return distCache.get(key);
      const seen = new Uint8Array(n * n), q = [[A[0], A[1], 0]];
      seen[A[1] * n + A[0]] = 1;
      let ans = Infinity;
      while (q.length) {
        const cur = q.shift(); const x = cur[0], y = cur[1], d = cur[2];
        if (x === B[0] && y === B[1]) { ans = d; break; }
        if (d > 48) continue;
        const nb = [[1,0],[-1,0],[0,1],[0,-1]];
        for (let i = 0; i < 4; i++) {
          const nx = x + nb[i][0], ny = y + nb[i][1];
          if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
          const kk = ny * n + nx;
          if (seen[kk] || !roadAt(nx, ny)) continue;
          seen[kk] = 1; q.push([nx, ny, d + 1]);
        }
      }
      distCache.set(key, ans); return ans;
    };
    const v = V.computeShadowVisits({ radius: 24, stations, shops, walkDistance: roadDist });
    out.facts.visits = {
      ok: v.ok, reason: v.reason, radius: v.radius,
      shops: v.ok ? v.shopCount : null,
      totalVisits: v.ok ? v.totals.visits : null,
      isolated: v.ok ? v.totals.isolated : null,
      top: v.ok ? V.rankShops(v.rows, 3).map((r) => ({ id: r.id, visits: r.visits })) : null,
      demandSource: 'native t468 OD origins (block-level trips)'
    };
    out.ok = true;
    return out;
  } catch (e) { out.error = String((e && e.stack) || e); return out; }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 600, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    await cdp.evalJs(BUILD);
    await new Promise((res) => setTimeout(res, 12000));
    return await cdp.evalJs(RUN);
  });
  console.log(JSON.stringify({ ok: r.ok, result: r.result, fails: r.fails }, null, 1));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

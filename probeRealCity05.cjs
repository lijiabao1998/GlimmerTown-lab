'use strict';
/* DSK-031 / V67 §5: run the passenger-demand and shadow-visits models on a REAL populated
 * city (native fixture, pop ~327) instead of synthetic fixtures. Reads only.
 */
const fs = require('node:fs');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const CORE056 = fs.readFileSync('passenger-demand056.js', 'utf8');
const CORE057 = fs.readFileSync('shadow-visits057.js', 'utf8');

const BUILD = `(() => {
  const fx = (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  const cn = (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return { connected: cn.placed ? cn.placed.length : 0, stats: GV.stats() };
})()`;

const REAL = `(() => {
  const out = { ok: false, facts: {} };
  try {
    ${CORE056}
    ${CORE057}
    const DEMAND = globalThis.passengerDemand056, VISITS = globalThis.shadowVisits057;
    const n = GV.N();
    const s = GV.stats();
    out.facts.city = { pop: s.pop, jobs: s.jobs, buildings: s.buildings, roads: s.roads, day: s.day };

    // native OD
    const t = GV.t468();
    const od = (t.assignment && Array.isArray(t.assignment.od)) ? t.assignment.od : [];
    out.facts.od = { rows: od.length, totalTrips: t.assignment && t.assignment.totalTrips, modes: t.assignment && t.assignment.modeShare };
    const d = DEMAND.summarizeDemand(od, { maxRows: 2000 });
    out.facts.demand = { ok: d.ok, reason: d.reason, rows: d.rowCount, totals: d.ok ? d.totals : null, conserved: d.ok ? d.conserved : null };
    const bad = [];
    for (const r of od) {
      const served = (r.walk || 0) + (r.transit || 0) + (r.car || 0) + (r.bike || 0);
      const over = served - (r.trips || 0);
      if (over > 1e-3) bad.push({ origin: r.origin, destination: r.destination, trips: r.trips, walk: r.walk, transit: r.transit, car: r.car, bike: r.bike, unserved: r.unserved, over: +over.toFixed(3) });
    }
    out.facts.demandOverflowRows = { count: bad.length, sample: bad.slice(0, 5) };

    // native commute field
    const cl = GV.commuteLoad();
    let samples = 0, sum = 0, max = 0;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = GV.commuteAt(x, y); if (v > 0) { samples++; sum += v; if (v > max) max = v; } }
    out.facts.commuteField = { clusters: cl.clusters, unreachable: cl.unreachable, nonZeroTiles: samples, meanLoad: samples ? +(sum / samples).toFixed(3) : 0, maxLoad: +max.toFixed(3) };

    // real geometry: native rail stations + commercial buildings
    const stations = [], shops = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const tl = GV.tile(x, y);
      if (!tl || !tl.bld || tl.bld.ref) continue;
      if ([17, 21, 55, 139].indexOf(tl.bld.k) >= 0) stations.push({ id: 'k' + tl.bld.k + '@' + x + ',' + y, x, y, demand: 1 });
      else if (tl.bld.k === 2) shops.push({ id: 'shop@' + x + ',' + y, x, y, attract: 1 });
    }
    out.facts.geometry = { stations: stations.length, shops: shops.length };
    if (stations.length && shops.length) {
      const v = VISITS.computeShadowVisits({ radius: 12, stations, shops, demandScale: 1 });
      out.facts.visits = { ok: v.ok, reason: v.reason, shops: v.shopCount, totalVisits: v.ok ? v.totals.visits : null, isolated: v.ok ? v.totals.isolated : null, demandSource: 'unit-demand per native station (placeholder until real ridership is attributable)' };
    } else {
      out.facts.visits = { ok: false, reason: 'no native stations/shops in this fixture', stations: stations.length, shops: shops.length };
    }
    out.ok = true;
    return out;
  } catch (e) { out.error = String((e && e.stack) || e); return out; }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 600, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    const build = await cdp.evalJs(BUILD);
    // let the city run so commuters/OD can settle
    await new Promise((res) => setTimeout(res, 12000));
    const live = await cdp.evalJs('(()=>{GV.setSpeed(0);return GV.stats()})()');
    const real = await cdp.evalJs(REAL);
    return { build, live, real };
  });
  console.log(JSON.stringify({ ok: r.ok, result: r.result, fails: r.fails }, null, 2));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

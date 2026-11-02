'use strict';
/* DSK-054 equivalence + perf probe.
 * Deterministic: build the native populated fixture, then advance EXACTLY the same
 * number of simulation ticks through GV.step(), and hash the resulting city state.
 * Same tick count + same seed => identical hash iff AI decisions and placements are identical.
 *
 * Usage: node dsk054-equiv.cjs <label> [steps] [chunk]
 */
const fs = require('node:fs');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const label = process.argv[2] || 'run';
const steps = Number(process.argv[3] || 200);
const chunk = Number(process.argv[4] || 5);

const BUILD = `(() => {
  const fx = (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  const cn = (${connectFixture053.toString()})();
  GV.setSpeed(0);
  return { connected: cn.placed ? cn.placed.length : 0, stats: GV.stats() };
})()`;

const HASH = `(() => {
  const n = GV.N();
  let h = 2166136261 >>> 0;
  const mix = (v) => { h = ((h ^ (v >>> 0)) * 16777619) >>> 0; };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const t = GV.tile(x, y) || {};
      const k = t.bld && !t.bld.ref ? t.bld.k : (t.bld ? -1 : 0);
      mix(k + 1);
      mix(t.road ? 1 : 2);
      mix(t.rail ? 3 : 4);
      mix(t.t | 0);
    }
  }
  const s = GV.stats();
  return { hash: h >>> 0, stats: s, roots: (GV.roots ? GV.roots() : null) };
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 900, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    const build = await cdp.evalJs(BUILD);
    let day = 0;
    for (let done = 0; done < steps; done += chunk) {
      day = await cdp.evalJs('(()=>{GV.step(' + chunk + ');return GV.stats().day})()');
    }
    const state = await cdp.evalJs(HASH);
    const out = { label, steps, build, day, state, errors: cdp.errors.slice(0, 5) };
    fs.writeFileSync('C:/RUST/equiv-' + label + '.json', JSON.stringify(out, null, 2));
    return out;
  });
  console.log(JSON.stringify({ label, ok: r.ok, hash: r.result && r.result.state && r.result.state.hash, day: r.result && r.result.day, stats: r.result && r.result.state && r.result.state.stats, fails: r.fails }, null, 2));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

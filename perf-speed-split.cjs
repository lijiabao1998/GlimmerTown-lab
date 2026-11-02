'use strict';
/* Local GPT-053 diagnostic: is the frame dominated by simulation/JS or by rendering?
 * Same native populated fixture; compare RAF intervals at speed 5 vs speed 0 (paused sim).
 *
 * Usage: node perf-speed-split.cjs [scene] [secondsPerPhase]
 */
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const scene = process.argv[2] || 'small';
const secs = Number(process.argv[3] || 8);

const BUILD = `(() => {
  const fx = (${setup053.toString()})(${JSON.stringify({ scene, seed: 87, ai: true })});
  const cn = (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return { fixture: fx, connected: cn.placed ? cn.placed.length : 0, stats: GV.stats() };
})()`;

const MEASURE = `(phase) => {
  window.__sp = { on: true, frames: [], last: performance.now(), phase };
  const S = window.__sp;
  const tick = (t) => {
    if (!S.on) return;
    S.frames.push(t - S.last); S.last = t;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return true;
}`;

const STOP = `() => {
  const S = window.__sp; S.on = false;
  const q = (a, x) => { const s = [...a].sort((m, n) => m - n); return s[Math.min(s.length - 1, Math.max(0, Math.ceil(x * s.length) - 1))] || 0; };
  const f = S.frames.filter((v) => v > 0), sum = f.reduce((a, b) => a + b, 0);
  return { phase: S.phase, frames: f.length, mean: +(sum / Math.max(1, f.length)).toFixed(1), p50: +q(f, .5).toFixed(1), p95: +q(f, .95).toFixed(1), fps: +(f.length / (sum / 1000)).toFixed(2), stats: GV.stats() };
}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 900, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await sleep(2500);
    const build = await cdp.evalJs(BUILD);
    await sleep(6000);
    const out = {};
    for (const phase of [{ name: 'speed5', speed: 5 }, { name: 'speed0', speed: 0 }, { name: 'speed5b', speed: 5 }]) {
      await cdp.evalJs(`(()=>{GV.setSpeed(${phase.speed});return true})()`);
      await sleep(800);
      await cdp.evalJs('(' + MEASURE + ')(\'' + phase.name + '\')');
      await sleep(secs * 1000);
      out[phase.name] = await cdp.evalJs('(' + STOP + ')()');
    }
    return { build, phases: out, errors: cdp.errors.slice(0, 5) };
  });
  console.log(JSON.stringify({ scene, secs, ok: r.ok, result: r.result, fails: r.fails }, null, 2));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

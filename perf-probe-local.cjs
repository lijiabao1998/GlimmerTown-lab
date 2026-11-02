'use strict';
/* Local GPT-053 instrumentation: measure how much of each frame is JS (RAF callback)
 * vs the rest (render/composite/raster outside JS), on a native populated city.
 *
 * Usage: node perf-probe-local.cjs [scene] [seconds] [ai:on|off]
 */
const path = require('node:path');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const scene = process.argv[2] || 'small';
const seconds = Number(process.argv[3] || 15);
const ai = (process.argv[4] || 'on') !== 'off';

const PAGE_BUILD = `(() => {
  const out = {};
  try {
    const fx = (${setup053.toString()})(${JSON.stringify({ scene, seed: 87, ai })});
    const cn = (${connectFixture053.toString()})();
    out.fixture = fx; out.connections = { placed: cn.placed ? cn.placed.length : 0, failed: cn.failed };
    out.stats = GV.stats();
    return out;
  } catch (e) { return { error: String((e && e.stack) || e) }; }
})()`;

const PAGE_MEASURE = `(() => {
  const out = { frames: [], cb: [] };
  const raf = window.requestAnimationFrame.bind(window);
  window.__perf053 = { out, on: true };
  function wrapped(cb) {
    return raf(function (t) {
      const a = performance.now();
      try { cb(t); } finally { const b = performance.now(); if (window.__perf053.on) out.cb.push(b - a); }
    });
  }
  // Replace RAF for the game loop's next frames; restore at the end.
  const orig = window.requestAnimationFrame;
  window.requestAnimationFrame = wrapped;
  window.__perf053.restore = () => { window.requestAnimationFrame = orig; };
  window.__perf053.lastTs = performance.now();
  const tick = (t) => {
    if (!window.__perf053.on) return;
    out.frames.push(t - window.__perf053.lastTs);
    window.__perf053.lastTs = t;
    raf(tick);
  };
  raf(tick);
  return { started: true, speed: GV.stats().speed };
})()`;

const PAGE_STOP = `(() => {
  window.__perf053.on = false;
  if (window.__perf053.restore) window.__perf053.restore();
  const out = window.__perf053.out;
  const q = (a, x) => { const s = [...a].sort((m, n) => m - n); return s[Math.min(s.length - 1, Math.max(0, Math.ceil(x * s.length) - 1))] || 0; };
  const f = out.frames.filter((v) => v > 0), c = out.cb.filter((v) => v >= 0);
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  return {
    frames: f.length, frameP50: +q(f, .5).toFixed(1), frameP95: +q(f, .95).toFixed(1),
    cbCount: c.length, cbP50: +q(c, .5).toFixed(1), cbP95: +q(c, .95).toFixed(1),
    cbMean: +(sum(c) / Math.max(1, c.length)).toFixed(1),
    frameMean: +(sum(f) / Math.max(1, f.length)).toFixed(1),
    jsShareP50: +(q(c, .5) / Math.max(1, q(f, .5))).toFixed(3),
    jsShareMean: +((sum(c) / Math.max(1, c.length)) / Math.max(1, (sum(f) / Math.max(1, f.length)))).toFixed(3),
    stats: GV.stats()
  };
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 900, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    const build = await cdp.evalJs(PAGE_BUILD);
    if (build.error) return { build };
    // let the city mature a little under AI
    await cdp.evalJs('(()=>{GV.setSpeed(5);return true})()');
    await new Promise((res) => setTimeout(res, 6000));
    const before = await cdp.evalJs('(()=>{GV.setSpeed(0);return GV.stats()})()');
    await cdp.evalJs('(()=>{GV.setSpeed(5);return true})()');
    await cdp.evalJs(PAGE_MEASURE);
    await new Promise((res) => setTimeout(res, seconds * 1000));
    const stop = await cdp.evalJs(PAGE_STOP);
    return { build, before, stop, errors: cdp.errors.slice(0, 5) };
  });
  console.log(JSON.stringify({ scene, seconds, ai, ok: r.ok, result: r.result, fails: r.fails }, null, 2));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

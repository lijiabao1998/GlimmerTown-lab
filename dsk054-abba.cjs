'use strict';
/* DSK-054 ABBA: interleaved baseline/candidate measurement on an identical mature city.
 * Order baseline -> candidate -> candidate -> baseline, same runner, same starting state.
 *
 * Usage: node dsk054-abba.cjs [seconds] [outfile]
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const seconds = Number(process.argv[2] || 60);
const outFile = process.argv[3] || 'C:/RUST/abba-054.json';
const INDEX = 'index.html';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

const BUILD = `(() => {
  const fx = (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  const cn = (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return { connected: cn.placed ? cn.placed.length : 0, stats: GV.stats(), roots: GV.roots ? GV.roots() : null };
})()`;

const MEASURE = `() => { window.__ab = { on: true, f: [], last: performance.now() };
  const S = window.__ab; const tick = (t) => { if (!S.on) return; S.f.push(t - S.last); S.last = t; requestAnimationFrame(tick); }; requestAnimationFrame(tick); return true; }`;

const STOP = `() => { const S = window.__ab; S.on = false;
  const q = (a, x) => { const s = [...a].sort((m, n) => m - n); return s[Math.min(s.length - 1, Math.max(0, Math.ceil(x * s.length) - 1))] || 0; };
  const f = S.f.filter((v) => v > 0), sum = f.reduce((a, b) => a + b, 0);
  return { frames: f.length, mean: +(sum / Math.max(1, f.length)).toFixed(2), p50: +q(f, .5).toFixed(2), p95: +q(f, .95).toFixed(2), p99: +q(f, .99).toFixed(2), stats: GV.stats() }; }`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const candidate = fs.readFileSync(INDEX);
  const baseline = cp.execFileSync('git', ['show', 'origin/main:index.html'], { maxBuffer: 64 * 1024 * 1024 });
  const rows = [];
  try {
    for (const [i, label] of ['baseline', 'candidate', 'candidate', 'baseline'].entries()) {
      fs.writeFileSync(INDEX, label === 'baseline' ? baseline : candidate);
      const r = await withGame({ port: 8199, fresh: true, timeout: 900, log: () => {} }, async ({ cdp }) => {
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
        await sleep(2500);
        const build = await cdp.evalJs(BUILD);
        const startState = JSON.stringify({ stats: build.stats, roots: build.roots });
        await sleep(3000);
        await cdp.evalJs('(' + MEASURE + ')()');
        await sleep(seconds * 1000);
        const m = await cdp.evalJs('(' + STOP + ')()');
        return { build, startState, m, errors: cdp.errors.slice(0, 3) };
      });
      rows.push({ arm: i, label, startState: r.result.startState, ...r.result.m, buildDay: r.result.build.stats.day, buildPop: r.result.build.stats.pop });
      console.log('ARM', i, label, JSON.stringify({ mean: rows[i].mean, p95: rows[i].p95, frames: rows[i].frames }));
    }
  } finally {
    fs.writeFileSync(INDEX, candidate);
  }
  const by = (l) => rows.filter((r) => r.label === l);
  const avg = (a, k) => +(a.reduce((s, r) => s + r[k], 0) / a.length).toFixed(2);
  const base = by('baseline'), cand = by('candidate');
  const summary = {
    seconds, order: rows.map((r) => r.label),
    sameStartState: new Set(rows.map((r) => r.startState)).size === 1,
    baseline: { mean: avg(base, 'mean'), p95: avg(base, 'p95'), p99: avg(base, 'p99'), frames: base.reduce((s, r) => s + r.frames, 0) },
    candidate: { mean: avg(cand, 'mean'), p95: avg(cand, 'p95'), p99: avg(cand, 'p99'), frames: cand.reduce((s, r) => s + r.frames, 0) },
    rows
  };
  summary.meanReduction = +((1 - summary.candidate.mean / summary.baseline.mean) * 100).toFixed(1);
  summary.p95Reduction = +((1 - summary.candidate.p95 / summary.baseline.p95) * 100).toFixed(1);
  summary.p99Reduction = +((1 - summary.candidate.p99 / summary.baseline.p99) * 100).toFixed(1);
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log('ABBA', JSON.stringify({ sameStartState: summary.sameStartState, baseline: summary.baseline, candidate: summary.candidate, meanReduction: summary.meanReduction, p95Reduction: summary.p95Reduction, p99Reduction: summary.p99Reduction }));
  process.exitCode = summary.sameStartState ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

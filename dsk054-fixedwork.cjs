'use strict';
/* DSK-028 fixed-work regression: identical city, identical number of simulation ticks,
 * synchronous timing of GV.step(). Main vs integration candidate, interleaved.
 *
 * Usage: node dsk054-fixedwork.cjs [ticks] [rounds]
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const ticks = Number(process.argv[2] || 300);
const rounds = Number(process.argv[3] || 3);
const INDEX = 'index.html';

const BUILD = `(() => {
  const fx = (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  const cn = (${connectFixture053.toString()})();
  GV.setSpeed(0);
  return { stats: GV.stats(), roots: GV.roots ? GV.roots() : null };
})()`;

// Time exactly N ticks synchronously, in chunks so the page stays responsive to CDP.
const TIME = `(n) => { const t0 = performance.now(); GV.step(n); return +(performance.now() - t0).toFixed(2); }`;

(async () => {
  const candidate = fs.readFileSync(INDEX);
  const baseline = cp.execFileSync('git', ['show', 'origin/main:index.html'], { maxBuffer: 64 * 1024 * 1024 });
  const rows = [];
  try {
    for (let r = 0; r < rounds; r++) {
      for (const label of ['baseline', 'candidate']) {
        fs.writeFileSync(INDEX, label === 'baseline' ? baseline : candidate);
        const out = await withGame({ port: 8199, fresh: true, timeout: 900, log: () => {} }, async ({ cdp }) => {
          await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
          await new Promise((res) => setTimeout(res, 2000));
          const build = await cdp.evalJs(BUILD);
          const start = JSON.stringify({ stats: build.stats, roots: build.roots });
          const ms = await cdp.evalJs('(' + TIME + ')(' + ticks + ')');
          const after = await cdp.evalJs('(()=>GV.stats())()');
          return { start, ms, day: after.day, pop: after.pop, buildings: after.buildings };
        });
        rows.push({ round: r, label, ...out.result });
        console.log('RUN', r, label, out.result.ms + 'ms', 'day=' + out.result.day, 'bld=' + out.result.buildings);
      }
    }
  } finally {
    fs.writeFileSync(INDEX, candidate);
  }
  const by = (l) => rows.filter((x) => x.label === l).map((x) => x.ms).sort((a, b) => a - b);
  const med = (a) => a[Math.floor(a.length / 2)];
  const b = by('baseline'), c = by('candidate');
  const summary = { ticks, rounds, order: rows.map((x) => x.label), sameStart: new Set(rows.map((x) => x.start)).size === 1,
    baselineMs: b, candidateMs: c, baselineMedian: med(b), candidateMedian: med(c),
    deltaPct: +(((med(c) - med(b)) / med(b)) * 100).toFixed(2) };
  fs.writeFileSync('C:/RUST/fixedwork-integ.json', JSON.stringify(summary, null, 2));
  console.log('FIXEDWORK', JSON.stringify(summary));
  process.exitCode = summary.sameStart ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

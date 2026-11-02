'use strict';
/* DSK-054 fixed-work on a MATURE city: warm up with untimed steps, then time exactly N
 * simulation steps. Same start state, interleaved baseline/candidate, medians.
 *
 * Usage: node dsk054-fixedwork-warm.cjs [warmTicks] [timedTicks] [rounds]
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const warm = Number(process.argv[2] || 900);
const ticks = Number(process.argv[3] || 300);
const rounds = Number(process.argv[4] || 3);
const INDEX = 'index.html';

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(0);
  return GV.stats();
})()`;

const WARM = `(n) => { GV.step(n); return GV.stats(); }`;
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
          await new Promise((res) => setTimeout(res, 2000));
          const b = await cdp.evalJs(BUILD);
          const start = JSON.stringify(b);
          const warmed = await cdp.evalJs('(' + WARM + ')(' + warm + ')');
          const ms = await cdp.evalJs('(' + TIME + ')(' + ticks + ')');
          return { start, ms, day: warmed.day, bld: warmed.buildings };
        });
        rows.push({ round: r, label, ...out.result });
        console.log('RUN', r, label, out.result.ms + 'ms', 'day=' + out.result.day, 'bld=' + out.result.bld);
      }
    }
  } finally {
    fs.writeFileSync(INDEX, candidate);
  }
  const by = (l) => rows.filter((x) => x.label === l).map((x) => x.ms).sort((a, b) => a - b);
  const med = (a) => a[Math.floor(a.length / 2)];
  const b = by('baseline'), c = by('candidate');
  const summary = { warm, ticks, rounds, sameStart: new Set(rows.map((x) => x.start)).size === 1,
    baselineMs: b, candidateMs: c, baselineMedian: med(b), candidateMedian: med(c),
    deltaPct: +(((med(c) - med(b)) / med(b)) * 100).toFixed(2) };
  fs.writeFileSync('C:/RUST/fixedwork-mature.json', JSON.stringify(summary, null, 2));
  console.log('FIXEDWORK_MATURE ' + JSON.stringify(summary));
  process.exitCode = 0;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

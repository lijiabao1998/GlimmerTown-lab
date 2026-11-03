'use strict';
/* DSK-038：量測協定（先量測，才談優化）
 * 固定工作量、交錯 A/B、7 輪、中位數與 MAD；只有當 |效果| > 2×MAD 才判定為「有訊號」。
 *
 * Usage: node dsk054-protocol.cjs [warmTicks] [timedTicks] [rounds]
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const warm = Number(process.argv[2] || 1200);
const ticks = Number(process.argv[3] || 300);
const rounds = Number(process.argv[4] || 7);
const INDEX = 'index.html';

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(0);
  return GV.stats();
})()`;
const WARM = `(n) => { GV.step(n); return GV.stats(); }`;
const TIME = `(n) => { const t0 = performance.now(); GV.step(n); return +(performance.now() - t0).toFixed(1); }`;

const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mad = (a) => { const m = median(a); return median(a.map((x) => Math.abs(x - m))); };

(async () => {
  const candidate = fs.readFileSync(INDEX);
  const baseline = cp.execFileSync('git', ['show', 'origin/main:index.html'], { maxBuffer: 64 * 1024 * 1024 });
  const base = [], cand = [];
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
          return { start, ms, day: warmed.day };
        });
        (label === 'baseline' ? base : cand).push(out.result.ms);
        console.log('R' + r, label, out.result.ms + 'ms', 'day=' + out.result.day);
      }
    }
  } finally {
    fs.writeFileSync(INDEX, candidate);
  }
  const mb = median(base), mc = median(cand);
  const noiseAbs = Math.max(mad(base), mad(cand)) * 1.4826;
  const effect = mc - mb;
  const summary = {
    warm, ticks, rounds,
    baseline: { values: base, median: mb, mad: mad(base) },
    candidate: { values: cand, median: mc, mad: mad(cand) },
    effectMs: +effect.toFixed(1), effectPct: +((effect / mb) * 100).toFixed(2),
    noiseMs: +noiseAbs.toFixed(1), noisePct: +((noiseAbs / mb) * 100).toFixed(2),
    verdict: Math.abs(effect) > 2 * noiseAbs ? (effect < 0 ? 'candidate-faster' : 'candidate-slower') : 'no-signal'
  };
  fs.writeFileSync('C:/RUST/protocol-054.json', JSON.stringify(summary, null, 2));
  console.log('PROTOCOL ' + JSON.stringify(summary));
  process.exitCode = 0;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

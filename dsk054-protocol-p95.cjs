'use strict';
/* DSK-039：把「配對＋符號檢定」套到 p95 幀時間上（不是只看中位數）。
 * 每輪：baseline 立刻接 candidate，同一起始狀態、同一台機器、同樣 20 秒。
 * Usage: node dsk054-protocol-p95.cjs [seconds] [rounds]
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const seconds = Number(process.argv[2] || 20);
const rounds = Number(process.argv[3] || 10);
const INDEX = 'index.html';

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return GV.stats();
})()`;
const START = `() => { window.__ab = { on: true, f: [], last: performance.now() };
  const S = window.__ab; const tick = (t) => { if (!S.on) return; S.f.push(t - S.last); S.last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return true; }`;
const STOP = `() => { const S = window.__ab; S.on = false;
  const q = (a, x) => { const s = [...a].sort((m, n) => m - n); return s[Math.min(s.length - 1, Math.max(0, Math.ceil(x * s.length) - 1))] || 0; };
  const f = S.f.filter((v) => v > 0), sum = f.reduce((a, b) => a + b, 0);
  return { frames: f.length, mean: +(sum / Math.max(1, f.length)).toFixed(2), p95: +q(f, .95).toFixed(2), p50: +q(f, .5).toFixed(2) }; }`;

const median = (a) => { const t = [...a].sort((x, y) => x - y); const m = Math.floor(t.length / 2); return t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2; };
const mad = (a) => { const m = median(a); return median(a.map((x) => Math.abs(x - m))); };

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
          await new Promise((res) => setTimeout(res, 2500));
          const b = await cdp.evalJs(BUILD);
          const start = JSON.stringify(b);
          await cdp.evalJs('(' + START + ')()');
          await new Promise((res) => setTimeout(res, seconds * 1000));
          const m = await cdp.evalJs('(' + STOP + ')()');
          return { start, m };
        });
        rows.push({ round: r, label, start: out.result.start, ...out.result.m });
        console.log('R' + r, label, JSON.stringify(out.result.m));
      }
    }
  } finally {
    fs.writeFileSync(INDEX, candidate);
  }
  const of = (l) => rows.filter((x) => x.label === l);
  const b = of('baseline'), c = of('candidate');
  const diffsP95 = c.map((x, i) => +(x.p95 - b[i].p95).toFixed(1));
  const neg = diffsP95.filter((d) => d < 0).length;
  const n = diffsP95.length;
  const choose = (nn, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (nn - k + i)) / i; return r; };
  const tail = (k) => { let p = 0; for (let i = 0; i <= k; i++) p += choose(n, i); return p / Math.pow(2, n); };
  const p = Math.min(1, 2 * tail(Math.min(neg, n - neg)));
  const summary = {
    seconds, rounds: n,
    baseline: { p95: b.map((x) => x.p95), medianP95: median(b.map((x) => x.p95)), madP95: mad(b.map((x) => x.p95)) },
    candidate: { p95: c.map((x) => x.p95), medianP95: median(c.map((x) => x.p95)), madP95: mad(c.map((x) => x.p95)) },
    diffsP95, medianDiff: median(diffsP95), faster: neg, slower: n - neg, signTestP: +p.toExponential(2),
    medianPctDiff: +((median(diffsP95) / median(b.map((x) => x.p95))) * 100).toFixed(2),
    unpairedNoisePct: +((1.4826 * Math.max(mad(b.map((x) => x.p95)), mad(c.map((x) => x.p95))) / median(b.map((x) => x.p95))) * 100).toFixed(2)
  };
  fs.writeFileSync('C:/RUST/protocol-p95.json', JSON.stringify(summary, null, 2));
  console.log('P95 ' + JSON.stringify(summary));
  process.exitCode = 0;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

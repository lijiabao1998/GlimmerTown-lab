'use strict';
const fs = require('node:fs');
const s = JSON.parse(fs.readFileSync('C:/RUST/protocol-054.json', 'utf8'));
const b = s.baseline.values, c = s.candidate.values;
const diffs = c.map((v, i) => +(v - b[i]).toFixed(1));
const neg = diffs.filter((d) => d < 0).length;
const n = diffs.length;
// exact two-sided sign test
const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
const tail = (k) => { let p = 0; for (let i = 0; i <= k; i++) p += choose(n, i); return p / Math.pow(2, n); };
const k = Math.min(neg, n - neg);
const p = Math.min(1, 2 * tail(k));
const median = (a) => { const t = [...a].sort((x, y) => x - y); const m = Math.floor(t.length / 2); return t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2; };
const mad = (a) => { const m = median(a); return median(a.map((x) => Math.abs(x - m))); };
console.log(JSON.stringify({
  rounds: n, diffs,
  medianDiff: median(diffs), madDiff: mad(diffs),
  faster: neg, slower: n - neg,
  signTestP: +p.toExponential(2),
  medianPctDiff: +((median(diffs) / median(b)) * 100).toFixed(2),
  note: 'paired by round; sign test ignores magnitude, robust to the R1 outlier'
}, null, 1));

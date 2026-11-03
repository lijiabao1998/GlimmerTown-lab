'use strict';
const fs = require('node:fs');
const p = 'passenger-demand056.js';
let s = fs.readFileSync(p, 'utf8');
const oldLine = '    const conserved = Math.abs(totals.served + totals.unserved - totals.trips) <= EPS;';
const newLines = [
  '    // Per-row conservation: native rounds every mode to 0.1, so the aggregate drifts by',
  '    // O(rows * 0.1) even when every single row is honest. Check each row, not the sum.',
  '    const conserved = od.every((r) => Math.abs((r.walk || 0) + (r.transit || 0) + (r.car || 0) + (r.bike || 0) + (r.unserved || 0) - (r.trips || 0)) <= EPS);'
].join('\n');
if (s.split(oldLine).length !== 2) { console.log('line not unique'); process.exit(1); }
s = s.replace(oldLine, newLines);
fs.writeFileSync(p, s);
console.log('conservation is now per-row');

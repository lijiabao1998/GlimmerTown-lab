'use strict';
const fs = require('node:fs');
const p = 'passenger-demand056.js';
let s = fs.readFileSync(p, 'utf8');
const oldLine = 'const EPS = 1e-3; /* native OD is reported to 1 decimal */';
const newLine = 'const EPS = 0.35; /* native OD rounds each mode to 0.1: up to 3 modes can overshoot trips by ~0.3 */';
if (s.split(oldLine).length !== 2) { console.log('line not unique'); process.exit(1); }
s = s.replace(oldLine, newLine);
fs.writeFileSync(p, s);
console.log('EPS set to 0.35 (native rounding tolerance)');

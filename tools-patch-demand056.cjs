'use strict';
const fs = require('node:fs');
const p = 'passenger-demand056.js';
let s = fs.readFileSync(p, 'utf8');

const oldBlock = [
  '      const served = row.walk + row.transit + row.car;',
  "      if (served - row.trips > EPS) return fail(REASONS.OVERFLOW, 'served>trips');",
  '      const unserved = Math.max(0, row.trips - served);'
].join('\n');

const newBlock = [
  '      const bike = (typeof row.bike === \'number\' && Number.isFinite(row.bike) && row.bike >= 0) ? row.bike : 0;',
  '      const served = row.walk + row.transit + row.car + bike;',
  '      const declaredUnserved = (typeof row.unserved === \'number\' && Number.isFinite(row.unserved) && row.unserved >= 0) ? row.unserved : null;',
  "      if (served - row.trips > EPS) return fail(REASONS.OVERFLOW, 'served>trips');",
  '      const unserved = declaredUnserved !== null ? declaredUnserved : Math.max(0, row.trips - served);'
].join('\n');

if (s.split(oldBlock).length !== 2) {
  console.log('BLOCK-NOT-UNIQUE count=' + (s.split(oldBlock).length - 1));
  const i = s.indexOf('const served = row.walk');
  console.log(JSON.stringify(s.slice(Math.max(0, i - 120), i + 320)));
  process.exit(1);
}
s = s.replace(oldBlock, newBlock);
fs.writeFileSync(p, s);
console.log('patched demand core');

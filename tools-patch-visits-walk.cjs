'use strict';
const fs = require('node:fs');
const p = 'shadow-visits057.js';
let s = fs.readFileSync(p, 'utf8');

// 1) accept an optional walkDistance(ax,ay,bx,by) so callers can supply real road distance
const anchor = '    const maxStations = Number.isSafeInteger(opts.maxStations) && opts.maxStations > 0 ? opts.maxStations : 500;';
if (s.split(anchor).length !== 2) { console.log('anchor1 missing'); process.exit(1); }
s = s.replace(anchor, anchor + '\n    const walkDistance = typeof opts.walkDistance === \'function\' ? opts.walkDistance : null;');

// 2) use it instead of Manhattan when provided
const oldD = '        const d = Math.abs(st.x - shop.x) + Math.abs(st.y - shop.y);';
if (s.split(oldD).length !== 2) { console.log('anchor2 missing'); process.exit(1); }
s = s.replace(oldD, '        const d = walkDistance ? Number(walkDistance(st.x, st.y, shop.x, shop.y)) : Math.abs(st.x - shop.x) + Math.abs(st.y - shop.y);');

// 3) guard against non-finite distances (no road path => Infinity)
const oldIf = '        if (d > radius) continue;';
if (s.split(oldIf).length !== 2) { console.log('anchor3 missing'); process.exit(1); }
s = s.replace(oldIf, '        if (!Number.isFinite(d) || d < 0 || d > radius) continue;');

fs.writeFileSync(p, s);
console.log('shadow-visits core accepts walkDistance');

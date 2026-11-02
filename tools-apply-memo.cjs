'use strict';
/* Add a generation-scoped memo around canPlace (one AI step = one generation).
 * Every mutation path that matters (doPlace) bumps the generation, and aiStep bumps it
 * on entry, so a cached answer can never outlive the map it was computed from.
 */
const fs = require('node:fs');
const crypto = require('node:crypto');

const p = 'index.html';
let s = fs.readFileSync(p, 'utf8');
const sha = (x) => crypto.createHash('sha256').update(x).digest('hex');

const patches = [];

// 1) wrap canPlace: rename the original, insert a memoising front door
const from1 = 'function canPlace(toolId,x,y){';
if (s.split(from1).length !== 2) throw new Error('canPlace anchor');
const to1 = 'let __cp054Gen=0,__cp054Cache=new Map();\n' +
  'function canPlace054Bump(){__cp054Gen++;__cp054Cache.clear();}\n' +
  'function canPlace(toolId,x,y){const __k=toolId+\'\\u0000\'+x+\'\\u0000\'+y;const __e=__cp054Cache.get(__k);if(__e&&__e.g===__cp054Gen)return __e.v;const __v=canPlace054Core(toolId,x,y);__cp054Cache.set(__k,{g:__cp054Gen,v:__v});return __v;}\n' +
  'function canPlace054Core(toolId,x,y){';
patches.push({ from: from1, to: to1 });
s = s.replace(from1, to1);

// 2) aiStep starts a new generation
const from2 = 'function aiStep(){';
if (s.split(from2).length !== 2) throw new Error('aiStep anchor');
const to2 = 'function aiStep(){canPlace054Bump();';
patches.push({ from: from2, to: to2 });
s = s.replace(from2, to2);

// 3) any real placement invalidates the memo
const from3 = 'function doPlace(toolId,x,y,silent){';
if (s.split(from3).length !== 2) throw new Error('doPlace anchor');
const to3 = 'function doPlace(toolId,x,y,silent){canPlace054Bump();';
patches.push({ from: from3, to: to3 });
s = s.replace(from3, to3);

fs.writeFileSync(p, s);

// merge with the existing findSite patch
const old = JSON.parse(fs.readFileSync('perf-patch054.json', 'utf8'));
const all = [old, ...patches.map((x) => ({ from: x.from, to: x.to, fromSha256: sha(x.from), toSha256: sha(x.to) }))];
fs.writeFileSync('perf-patch054.json', JSON.stringify({
  schema: 'dsk-054-reverse-patch-v2',
  reason: 'AI mayor: exact blocked-footprint prune + generation-scoped canPlace memo',
  patches: all
}, null, 2) + '\n');
console.log('applied ' + (patches.length + 1) + ' patches');

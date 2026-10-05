#!/usr/bin/env node
'use strict';
// The product, browser, simulation, canvas and pixel probes execute ONLY in CI.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { execFileSync } = require('node:child_process'), { isDeepStrictEqual: eq } = require('node:util');
if (process.env.GITHUB_ACTIONS !== 'true') throw Error('GitHub Actions runtime only; no local game execution');
const { withGame, waitFor } = require('./harness');
const { seedApprovedBritishLegacy007 } = require('./publiclife-legacy-fixture007');
const { verifyStatic012, BASE } = require('./riverside-static-contract012');
const { verifyFingerprint012 } = require('./riverside-fingerprint-qa012');
const ROOT = __dirname, MODE = process.env.RL012_MODE || 'preflight';
if (!/^(preflight|fingerprint|gameplay|camera[0-3]|construction[0-3]|weather|coldload)$/.test(MODE)) throw Error('Unknown riverside evidence mode');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
if (head !== process.env.GITHUB_SHA || !/^[0-9a-f]{40}$/.test(head)) throw Error('Exact workflow-head checkout required');
const source = fs.readFileSync(path.join(ROOT, 'index.html'));
const OUT = path.join(ROOT, 'riverside-evidence', MODE);
for (const dir of ['', 'images', 'guards', 'assets']) fs.mkdirSync(path.join(OUT, dir), { recursive: true });
const report = {
 checkedSHA: head, workflowSHA: process.env.GITHUB_SHA, run: process.env.GITHUB_RUN_ID,
 base: BASE, sourceSHA256: hash(source), mode: MODE, checks: [], failures: [], artifacts: [], progress: [],
 limits: [
  'Product/browser/pixel execution occurs only in isolated GitHub Actions, disposable slot3 and port8199.',
  'Old baseline age/money/rank seeding is confined to unchanged pinned approved fixtures. All new buildings, homes, utilities, water excavation and path themes use actual paid tools.',
  'New construction matures through actual ordinary days. No population, staffing, employment, age, supply or finance assignments are used as product evidence.',
  'Riverside buildings are private retail under existing enterprise, shopping and commercial settlement authorities. Decorative paths add no shipping, lodging, jobs or service bonus.',
  'Cold-load proof uses two complete Page.reload and native Continue cycles, exact current save bytes and three following ordinary days without repair/recompute helpers.',
  'CI software-rendering timing is not real-device/mobile FPS certification. Existing nested-atlas diagnostics and PWA ancillary missing-file warnings remain disclosed.'
 ]
};
const save = () => fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(report, null, 2));
function check(name, ok, detail) {
 report.checks.push({ name, ok: !!ok, detail });
 if (!ok) report.failures.push(name);
 save();
 if (!ok) throw Error(name);
}
function progress(phase, detail = {}) {
 const row = { at: new Date().toISOString(), phase, ...detail };
 report.progress.push(row); console.log('[Riverside012] ' + JSON.stringify(row)); save();
}
function png(file, url, meta = {}) {
 if (!url?.startsWith('data:image/png;base64,')) throw Error('Native PNG required: ' + file);
 if (report.artifacts.some(a => a.path === file)) throw Error('Duplicate artifact path: ' + file);
 const bytes = Buffer.from(url.split(',')[1], 'base64');
 if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || bytes.toString('ascii', 12, 16) !== 'IHDR') throw Error('Invalid native PNG');
 const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
 if (!(width > 0 && height > 0)) throw Error('Empty native PNG');
 fs.writeFileSync(path.join(OUT, file), bytes);
 report.artifacts.push({ ...meta, path: file, bytes: bytes.length, width, height, sha256: hash(bytes), checkedSHA: head, sourceSHA256: report.sourceSHA256 });
 save();
}
// Reuse only the immutable prior fixture definitions, never their top-level runners.
const fixturePins = {
 'streetlife-integration-qa009.js': '6585359c7af48ee68d09f20720d778b12ddf3da687190cc755bd7d34447e1b05',
 'publiclife-legacy-fixture007.js': 'f91a1c2b7e79eb635937910535191b842b4f6782cec51e2569a73b04323c6e11'
};
for (const [file, pin] of Object.entries(fixturePins)) if (hash(fs.readFileSync(path.join(ROOT, file))) !== pin) throw Error('Pinned old fixture changed: ' + file);
function range(text, start, end) {
 const a = text.indexOf(start), b = text.indexOf(end, a);
 if (a < 0 || b <= a) throw Error('Missing pinned function: ' + start);
 return text.slice(a, b);
}
const legacyStreet = range(fs.readFileSync(path.join(ROOT, 'streetlife-integration-qa009.js'), 'utf8'), 'function setupStreet009(', 'function snapshot009(');
const legacyMuseum = range(fs.readFileSync(path.join(ROOT, 'museum-integration-qa010.js'), 'utf8'), 'function setupMuseum010(', 'function assets010(');
if (hash(legacyStreet) !== '11cebcd7a47343bbe1f0f29d6fe78da92b863973fd157c21ede31626fc2b777f' || hash(legacyMuseum) !== '37c0be326c5763933e2835accedb9e2fad4403a1167b986bd40bea5dbfca0eb6') throw Error('Approved fixture function bodies changed');

// Browser-only functions below are serialized into the isolated Actions browser.
function bindObservation012(recipe) {
 const Q = window.__riversideQA012 = { ...recipe, days: [] };
 Q.storage = () => Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)]));
 Q.world = () => {
  const tiles = [];
  for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) tiles.push(GV.tile(x, y));
  return JSON.stringify({ tiles, stats: GV.stats() });
 };
 Q.canonical = Q.roots.flatMap(r => [0, 1, 2, 3].map(v => [r.k + '_1_' + v, GV.art574.SPR().bld[r.k + '_1_' + v]]));
 Q.canonicalPaths = Object.entries(GV.art574.SPR().riverside012);
 return true;
}
function setupRiverside012(seedFn) {
 if (localStorage.getItem('glimmerville.v1.slot') !== '3') throw Error('Disposable slot3 only');
 const legacy = setupMuseum010(seedFn), P = window.__streetQA009, M = window.__museumQA010;
 const recipe = { N: P.N, retained: P.retained, homes: P.homes, oldMuseums: M.oldMuseums,
  stations: [[50, 20], [50, 42]], priorStreet: P.roots, priorMuseum: M.roots,
  roots: [], paths: [], pathPlacements: [], waterCells: [], shoreline: [] };
 bindObservation012(recipe);
 const Q = window.__riversideQA012;
 Object.assign(Q, { pay: P.pay, prepare: P.prepare, place: P.place, corridor: P.corridor, paid: P.paid, terrain: P.terrain, legacy });
 // The old district ends at y47. A genuine road/pipe behind the new frontage
 // connects to it. T502 walkways do not masquerade as road frontage.
 for (let y = 48; y <= 55; y++) Q.corridor(56, y);
 for (let x = 57; x <= 69; x++) Q.corridor(x, 49);
 Q.place('plant', 55, 51); Q.place('water', 55, 53);
 Q.place('plant', 65, 48); Q.place('water', 67, 48);
 const specs = GV.riversideSpecs012();
 for (const [k, x, y] of [[278, 58, 50], [279, 64, 50], [280, 67, 50]]) {
  const s = specs.buildings.find(q => q.k === k), r = { ...s, x, y };
  if (!s) throw Error('Missing bounded market identity ' + k);
  Q.place(r.id, x, y, r.sz);
  const b = GV.tile(x, y).bld;
  if (b?.k !== k || b.age !== 0 || (b.sz || 1) !== r.sz) throw Error('New market root must be paid native age0');
  Q.roots.push(r);
 }
 // Water is real terrain, paid for through tdig. Keep all old roots/roads intact.
 // A broad continuous canal is visible in every wide market-quarter capture.
 for (let y = 56; y <= 60; y++) for (let x = 57; x <= 70; x++) {
  let tile = GV.tile(x, y);
  if (tile.bld || tile.road || tile.rail || tile.tram || tile.am502) throw Error('Canal intersects retained native identity');
  const before = tile, start = Q.paid.length;
  if (tile.t !== 0) { Q.prepare(x, y); Q.pay('tdig', x, y); }
  tile = GV.tile(x, y);
  if (tile.t !== 0 || tile.bld || tile.road) throw Error('Native canal excavation failed');
  Q.waterCells.push({ x, y, beforeTerrain: before.t, terrain: tile.t, payments: Q.paid.slice(start) });
 }
 const path = (theme, x, y, primary = false) => {
  const spec = specs.paths.find(p => p.theme === theme), p = { ...spec, x, y };
  if (!spec) throw Error('Missing riverside path theme ' + theme);
  Q.place(spec.id, x, y);
  const t = GV.riversideAt012(x, y);
  if (t?.theme !== theme || t.am502 !== 1 || t.baseWalkCost !== .72) throw Error('Native paid T502 path identity');
  Q.pathPlacements.push(p); if (primary) Q.paths.push(p);
 };
 for (let x = 57; x <= 69; x++) path('promenade', x, 54, x === 62);
 for (let x = 57; x <= 69; x++) path(x % 3 === 0 ? 'rail' : 'quay', x, 55, x === 58 || x === 60);
 for (const x of [58, 63, 64, 65, 66, 67, 68, 69]) path('promenade', x, 53);
 for (const p of Q.pathPlacements.filter(p => p.y === 55)) {
  const water = GV.tile(p.x, p.y + 1), tile = GV.tile(p.x, p.y);
  if (water.t !== 0 || tile.t === 0) throw Error('Quay must be on true land/water boundary');
  Q.shoreline.push({ x: p.x, y: p.y, theme: p.theme, land: tile.t, water: water.t });
 }
 // No new age/supply/staff assignments. The next native ticks do all dispatch,
 // construction and employment work. Old fixture helpers ran only before this.
 Q.canonical = Q.roots.flatMap(r => [0, 1, 2, 3].map(v => [r.k + '_1_' + v, GV.art574.SPR().bld[r.k + '_1_' + v]]));
 return { N: Q.N, roots: Q.roots, paths: Q.paths, pathPlacements: Q.pathPlacements,
  waterCells: Q.waterCells, shoreline: Q.shoreline, paid: Q.paid, terrain: Q.terrain,
  homes: Q.homes, retained: Q.retained, priorStreet: Q.priorStreet, priorMuseum: Q.priorMuseum,
  stations: Q.stations, oldMuseums: Q.oldMuseums, initial: snapshot012(),
  difficulty: GV.diff(), developer: GV.dev516B(), placementDay: GV.stats().day,
  recipe: { N: Q.N, roots: Q.roots, paths: Q.paths, pathPlacements: Q.pathPlacements,
   waterCells: Q.waterCells, shoreline: Q.shoreline, retained: Q.retained, homes: Q.homes,
   priorStreet: Q.priorStreet, priorMuseum: Q.priorMuseum, oldMuseums: Q.oldMuseums, stations: Q.stations } };
}
function identity012() {
 const Q = window.__riversideQA012, buildings = [], paths = [], terrain = [];
 for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
  const t = GV.tile(x, y), b = t.bld;
  if (b) buildings.push({ i: y * Q.N + x, k: b.k, ref: b.ref || null, lv: b.lv, v: b.v, age: b.age, sz: b.sz || 1 });
  if (t.am502) paths.push({ i: y * Q.N + x, am502: t.am502, amx502: t.amx502 || null });
 }
 for (const p of Q.waterCells) terrain.push({ x: p.x, y: p.y, t: GV.tile(p.x, p.y).t });
 return { buildings, paths, terrain };
}
function snapshot012() {
 const Q = window.__riversideQA012;
 return { ...GV.riversideEvidence012(), roots: Q.roots.map(r => GV.riversideAt012(r.x, r.y)), stats: GV.stats(), slot: localStorage.getItem('glimmerville.v1.slot'),
  retained: Q.retained.map(r => ({ ...r, bld: GV.tile(r.x, r.y).bld,
   cells: Array.from({ length: r.sz * r.sz }, (_, n) => GV.tile(r.x + n % r.sz, r.y + Math.floor(n / r.sz)).bld) })),
  priorStreet: GV.streetLifeEvidence009(), priorMuseum: GV.museumEvidence010(),
  stations: Q.stations.map(p => GV.stationDistrictAt008(...p)),
  difficulty: GV.diff(), developer: GV.dev516B(),
  coldFixDisabled: !!window.__noColdLoadPower011,
  districtCache: window.__t450Power ? JSON.parse(JSON.stringify(window.__t450Power)) : null,
  shoreline: Q.shoreline.map(p => ({ ...p, land: GV.tile(p.x, p.y).t, water: GV.tile(p.x, p.y + 1).t })),
  identity: identity012() };
}
function step012(n = 1) {
 const Q = window.__riversideQA012;
 for (let i = 0; i < n; i++) {
  const from = GV.stats().day;
  GV.step(1); GV.setSpeed(0); GV.ai(false);
  if (GV.stats().day !== from + 1) throw Error('One actual ordinary day required');
  const now = snapshot012();
  Q.days.push({ from, day: now.day, roots: now.roots, retailUnits: now.retailUnits, taxLedger: now.taxLedger, population: now.stats.pop });
 }
 return snapshot012();
}

function assetAudit012(){const A=GV.art574.SPR(),out=[];for(const [key,s]of[...[278,279,280].flatMap(k=>[0,1,2,3].map(v=>['bld.'+k+'_1_'+v,A.bld[k+'_1_'+v]])),...Object.entries(A.riverside012).map(([k,s])=>['riverside012.'+k,s])]){const d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let opaque=0,partial=0,lit=0,outside=0;for(let i=3;i<d.length;i+=4){if(d[i]===255)opaque++;else if(d[i])partial++;if(n[i]){lit++;if(d[i]!==255)outside++;}}out.push({key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,opaque,partial,lit,outside,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')});}return out;}

function artPurity012() {
 const Q = window.__riversideQA012, before = Q.world(), storage = JSON.stringify(Q.storage());
 const refs = [...Q.canonical.map(([k, sprite]) => ['bld.' + k, sprite]), ...Q.canonicalPaths.map(([k, sprite]) => ['riverside012.' + k, sprite])];
 const ink = refs.map(([key, sprite]) => ({ key, day: sprite.img.toDataURL(), night: sprite.night.toDataURL() }));
 const old = Math.random; let calls = 0;
 Math.random = () => { calls++; throw Error('New art must never call random'); };
 const start = performance.now();
 try {
  const flatten = a => [...Object.entries(a.buildings).flatMap(([k, views]) => views.map((sprite, v) => [k + '_' + v, sprite])), ...Object.entries(a.modules)];
  const a = flatten(window.BritishRiversideArchitecture012.buildAll()), b = flatten(window.BritishRiversideArchitecture012.buildAll());
  return { calls, ms: performance.now() - start, count: a.length,
   same: a.length === 24 && a.every(([key, sprite], n) => key === b[n][0] && sprite.img.toDataURL() === b[n][1].img.toDataURL() && sprite.night.toDataURL() === b[n][1].night.toDataURL()),
   worldExact: before === Q.world(), storageExact: storage === JSON.stringify(Q.storage()),
   canonical: Q.canonical.every(([key, sprite]) => GV.art574.SPR().bld[key] === sprite) && Q.canonicalPaths.every(([key, sprite]) => GV.art574.SPR().riverside012[key] === sprite),
   canonicalPixelsExact: refs.every(([key, sprite], n) => key === ink[n].key && sprite.img.toDataURL() === ink[n].day && sprite.night.toDataURL() === ink[n].night) };
 } finally { Math.random = old; }
}

function nativeScene012(rot,night,focus=[61,52],zoom=2){GV.setRot(rot);GV.setZoom(zoom);GV.lookAt(...focus);GV.setVisT(GV.art574.cycle574()*(night?.9:.5));GV.weather(0);window.__ovCapMax606=12000;window.__ovCap606=[];GV.forceDraw();const caps=window.__ovCap606;window.__ovCap606=null;const canvas=document.getElementById('game'),camera=GV.camera436(),Q=window.__riversideQA012,geometry=Q.roots.map(r=>{const b=GV.tile(r.x,r.y).bld,key=r.k+'_1_'+((b.v+rot)&3),s=GV.art574.SPR().bld[key],hit=caps.find(q=>q.o?.x===r.x&&q.o?.y===r.y&&q.bd?.k===r.k);let corner=null,depth=-Infinity;for(let dy=0;dy<r.sz;dy++)for(let dx=0;dx<r.sz;dx++){const p=GV.w2v(r.x+dx,r.y+dy);if(p[0]+p[1]>=depth){depth=p[0]+p[1];corner=p;}}const ex=Math.round(canvas.width/2-camera.x*zoom)+(corner[0]-corner[1])*32*zoom-s.ax*zoom,ey=Math.round(canvas.height/2-camera.y*zoom)+(corner[0]+corner[1])*16*zoom+(32-s.ay)*zoom;return{k:r.k,key,age:b.age,canonical:!!hit&&hit.s===s,anchorError:hit?[hit.bx-ex,hit.by-ey]:null,within:!!hit&&hit.bx>=0&&hit.by>=0&&hit.bx+s.w*zoom<=canvas.width&&hit.by+s.h*zoom<=canvas.height,box:hit?{x:hit.bx,y:hit.by,w:s.w*zoom,h:s.h*zoom}:null};});return{png:canvas.toDataURL('image/png'),rot:GV.rot(),night,time:GV.daylightDbg(),day:GV.stats().day,roots:Q.roots.map(r=>GV.riversideAt012(r.x,r.y)),geometry};}

function nativeLight012(k=278){const Q=window.__riversideQA012,r=Q.roots.find(q=>q.k===k),b=GV.tile(r.x,r.y).bld,s=GV.art574.SPR().bld[k+'_1_'+((b.v+GV.rot())&3)],c=document.getElementById('game'),g=c.getContext('2d'),night=s.night,had=Object.hasOwn(window,'__nightOccNoErase629'),flag=window.__nightOccNoErase629,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;const shot=(on,erase)=>{s.night=on?night:empty;window.__nightOccNoErase629=!erase;GV.forceDraw();return g.getImageData(0,0,c.width,c.height).data;};try{const a=shot(true,true),b=shot(false,true),u=shot(true,false),v=shot(false,false);let candidates=0,blocked=0,visible=0;for(let i=0;i<a.length;i+=4){let n=0,f=0;for(let j=0;j<3;j++){n+=Math.abs(a[i+j]-b[i+j]);f+=Math.abs(u[i+j]-v[i+j]);}if(f>9){candidates++;if(n<=3)blocked++;if(n>9)visible++;}}return{k,candidates,blocked,visible,method:'Four native same-turn draws, own physical emission on/off and existing depth erasure on/off; no supply/staff/geometry override.'};}finally{s.night=night;if(had)window.__nightOccNoErase629=flag;else delete window.__nightOccNoErase629;GV.forceDraw();}}

function retailWitness012() {
 const e = GV.riversideEvidence012(), ledger = e.taxLedger, rows = ledger?.rows || [];
 const identities = new Set(e.roots.map(r => r.root));
 const expectedUnits = e.roots.reduce((s, r) => s + (r.operational ? r.employed / 14 : 0), 0);
 const ledgerTotal = rows.reduce((s, r) => s + r.tax, 0);
 const formulaExact = e.roots.length === 3 && e.roots.every(r =>
  Math.abs(r.retailUnits - (r.operational ? r.employed / 14 : 0)) < 1e-9 &&
  Math.abs(r.activity.shopping - (r.operational ? r.employed * 2.15 : 0)) < 1e-9 &&
  r.activity.work === r.activity.enterpriseJobs && r.activity.publicJobs === 0 &&
  r.activity.education === 0 && r.activity.services === 0 && r.activity.leisure === 0 && r.activity.parking === 0);
 const ledgerExact = !!ledger?.current && ledger.day === e.day &&
  Math.abs(ledger.total - ledgerTotal) < 1e-9 && new Set(rows.map(r => r.root)).size === rows.length &&
  rows.every(row => identities.has(row.root) && e.roots.some(r => r.root === row.root && r.k === row.k && r.tax?.tax === row.tax));
 return { day: e.day, pop: GV.stats().pop, roots: e.roots, retailUnits: e.retailUnits,
  expectedUnits, taxLedger: ledger, formulaExact, ledgerExact,
  exact: formulaExact && ledgerExact && Math.abs(e.retailUnits - expectedUnits) < 1e-9,
  positive: formulaExact && ledgerExact && ledger.total > 0 && e.roots.every(r => r.operational && r.employed > 0 && r.activity.shopping > 0 && r.tax?.tax > 0),
  zero: formulaExact && ledgerExact && ledger.total === 0 && e.retailUnits === 0 && e.roots.every(r => r.employed === 0 && r.activity.shopping === 0 && (!r.tax || r.tax.tax === 0)),
  authority: 'Shopping and equivalent retail units are existing native workforce formulas; fiscal rows observe the exact v2 already posted to native commercial income, without creating or recomputing income.' };
}
function physicalLoss012(kind) {
 const Q = window.__riversideQA012, before = snapshot012(), beforeRetail = retailWitness012(), removed = [];
 if (kind === 'road') {
  for (const i of new Set(before.roots.flatMap(r => r.road))) {
   const x = i % Q.N, y = Math.floor(i / Q.N), t = GV.tile(x, y);
   if (t.road) { removed.push({ id: 'road', x, y, road: t.road, rc: t.rc }); Q.pay('doze', x, y); }
  }
 } else {
  const k = kind === 'power' ? 5 : 10, id = kind === 'power' ? 'plant' : 'water';
  for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
   const b = GV.tile(x, y).bld;
   if (b && !b.ref && b.k === k) { removed.push({ id, x, y, k }); Q.pay('doze', x, y); }
  }
 }
 if (!removed.length || removed.length > 120) throw Error('Loss test has no bounded actual infrastructure');
 const lost = step012(1), lostRetail = retailWitness012();
 nativeScene012(0, true, [61, 51], 1.8);
 const lostLight = kind === 'power' ? Q.roots.map(r => nativeLight012(r.k)) : null;
 const start = Q.paid.length;
 for (const r of removed) Q.pay(r.id, r.x, r.y);
 const recoveryDays = [];
 for (let n = 0; n < 15; n++) {
  const now = step012(1), retail = retailWitness012();
  recoveryDays.push({ day: now.day, roots: now.roots, retail });
  if (retail.positive) break;
 }
 nativeScene012(0, true, [61, 51], 1.8);
 return { kind, before, beforeRetail, removed, lost, lostRetail, lostLight,
  repair: Q.paid.slice(start), recoveryDays, recovered: snapshot012(), recoveredRetail: retailWitness012(),
  recoveredLight: kind === 'power' ? Q.roots.map(r => nativeLight012(r.k)) : null };
}
function zeroStaff012() {
 const Q = window.__riversideQA012, baseline = retailWitness012(), savedIdentity = identity012();
 GV.save();
 const housing = [], payments = [];
 for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
  const b = GV.tile(x, y).bld;
  if (b && !b.ref && ([1, 33, 105, 127, 219].includes(b.k) || b.k >= 246 && b.k <= 261)) housing.push({ x, y, k: b.k });
 }
 for (const r of housing) payments.push(Q.pay('doze', r.x, r.y));
 const afterRemoval = step012(1), zero = retailWitness012();
 if (!GV.load()) throw Error('Restore actual native saved housing failed');
 const loadedIdentity = identity012(), recoveryDays = [];
 for (let n = 0; n < 8; n++) {
  const now = step012(1), retail = retailWitness012();
  recoveryDays.push({ day: now.day, retail });
  if (retail.positive) break;
 }
 return { baseline, housing, payments, afterRemoval, zero, savedIdentity, loadedIdentity,
  restoredIdentity: JSON.stringify(savedIdentity) === JSON.stringify(loadedIdentity), recoveryDays, restored: retailWitness012(),
  method: 'All actual homes removed with paid ordinary demolition. Ordinary daily staffing establishes zero residents and zero retail; native save/load restores the genuine prior homes. No labor, finance, age or supply assignments.' };
}
function nativeSaveLoad012() {
 const Q = window.__riversideQA012, before = snapshot012(), storage = Q.storage(), identity = identity012();
 const eligible = Q.roots.map(r => GV.placePreview459(r.id, 64, 63));
 if (!eligible.every(p => p?.ok)) throw Error('Save/load escape control requires real valid plot');
 GV.save();
 const raw = localStorage.getItem('glimmerville.v1.s3');
 window.__noRiverside012 = true;
 let loaded, immediate, disabled;
 try {
  loaded = GV.load(); if (!loaded) throw Error('Native load failed');
  immediate = snapshot012();
  disabled = Q.roots.every(r => GV.placePreview459(r.id, 64, 63)?.ok === false) && Q.paths.every(r => GV.placePreview459(r.id, 68, 64)?.ok === false);
 } finally { delete window.__noRiverside012; }
 const references = JSON.stringify(identity) === JSON.stringify(identity012()), from = GV.stats().day;
 const following = step012(1), retail = retailWitness012(), after = Q.storage();
 const allowed = k => k === 'glimmerville.v1.slot' || /^glimmerville\.v1\.s3(?:_|$)/.test(k) || k.includes('.viewRot');
 return { before, eligible, loaded, immediate, disabled, references, from, following, retail, bytes: raw?.length || 0,
  otherSlotsUnchanged: [...new Set([...Object.keys(storage), ...Object.keys(after)])].filter(k => !allowed(k)).every(k => storage[k] === after[k]) };
}
function nativeTransactions012() {
 const Q = window.__riversideQA012, rows = [], pathRows = [];
 for (const r of Q.roots) {
  const cells = () => Array.from({ length: r.sz * r.sz }, (_, n) => GV.tile(r.x + n % r.sz, r.y + Math.floor(n / r.sz)));
  const original = JSON.stringify(cells()), money = GV.devMoney516B(), inspect = GV.inspectAt(r.x, r.y);
  const quote = GV.placePreview459('doze', r.x + r.sz - 1, r.y + r.sz - 1);
  const ok = GV.placeUndo('doze', r.x + r.sz - 1, r.y + r.sz - 1), charged = money - GV.devMoney516B();
  const gone = cells().every(t => !t.bld), undo = GV.undo();
  const restored = JSON.stringify(cells()) === original && GV.devMoney516B() === money;
  const redo = GV.redo(), regone = cells().every(t => !t.bld), redoPaid = money - GV.devMoney516B() === charged;
  const undoAgain = GV.undo();
  rows.push({ k: r.k, inspect, ok, quote, charged, gone, undo, restored, redo, regone, redoPaid, undoAgain,
   final: JSON.stringify(cells()) === original && GV.devMoney516B() === money });
 }
 for (const p of Q.paths) {
  const before = GV.tile(p.x, p.y), money = GV.devMoney516B(), base = GV.riversideAt012(p.x, p.y);
  const doze = GV.placeUndo('doze', p.x, p.y), removed = !GV.riversideAt012(p.x, p.y), charged = money - GV.devMoney516B();
  const plainCost = GV.placePreview459('footpath502', p.x, p.y).cost;
  const undo = GV.undo(), exact = JSON.stringify(GV.tile(p.x, p.y)) === JSON.stringify(before) && GV.devMoney516B() === money;
  const redo = GV.redo(), regone = !GV.riversideAt012(p.x, p.y), redoPaid = money - GV.devMoney516B() === charged;
  const undoAgain = GV.undo(), final = JSON.stringify(GV.tile(p.x, p.y)) === JSON.stringify(before) && GV.devMoney516B() === money;
  pathRows.push({ theme: p.theme, doze, removed, charged, undo, exact, redo, regone, redoPaid, undoAgain, final, base, plainCost });
 }
 const world = Q.world(), storage = JSON.stringify(Q.storage()), identities = JSON.stringify(identity012());
 for (let n = 0; n < 8; n++) GV.forceDraw();
 return { rows, pathRows, renderWorldExact: world === Q.world(), renderStorageExact: storage === JSON.stringify(Q.storage()),
  identitiesExact: identities === JSON.stringify(identity012()),
  canonical: Q.canonical.every(([k, s]) => GV.art574.SPR().bld[k] === s) && Q.canonicalPaths.every(([k, s]) => GV.art574.SPR().riverside012[k] === s) };
}
function nativePathEdits012() {
 const Q = window.__riversideQA012, rows = [], storage = Q.storage();
 const original = Q.pathPlacements.map(p => ({ p, t: GV.tile(p.x, p.y) }));
 for (let n = 0; n < Q.paths.length; n++) {
  const p = Q.paths[n], next = Q.paths[(n + 1) % Q.paths.length];
  const before = GV.riversideAt012(p.x, p.y), remove = Q.pay('doze', p.x, p.y), removed = !GV.riversideAt012(p.x, p.y);
  const plainQuote = GV.placePreview459('footpath502', p.x, p.y), purchase = Q.pay(next.id, p.x, p.y);
  const edited = GV.riversideAt012(p.x, p.y), tile = GV.tile(p.x, p.y);
  GV.save(); const loaded = GV.load();
  if (!loaded) throw Error('Native edited-theme save/load failed');
  const afterLoad = GV.riversideAt012(p.x, p.y), metadataExact = JSON.stringify(tile.amx502) === JSON.stringify(GV.tile(p.x, p.y).amx502);
  const day = GV.stats().day, following = step012(1), afterDay = GV.riversideAt012(p.x, p.y);
  const removeEdited = Q.pay('doze', p.x, p.y), restore = Q.pay(p.id, p.x, p.y), restored = GV.riversideAt012(p.x, p.y);
  rows.push({ from: p.theme, to: next.theme, before, remove, removed, plainQuote, purchase, edited, loaded,
   afterLoad, metadataExact, fromDay: day, toDay: following.day, afterDay, removeEdited, restore, restored });
 }
 const after = Q.storage(), allowed = k => k === 'glimmerville.v1.slot' || /^glimmerville\.v1\.s3(?:_|$)/.test(k) || k.includes('.viewRot');
 return { rows,
  originalThemesRestored: original.every(({ p, t }) => { const now = GV.tile(p.x, p.y); return now.am502 === t.am502 && JSON.stringify(now.amx502) === JSON.stringify(t.amx502); }),
  otherSlotsUnchanged: [...new Set([...Object.keys(storage), ...Object.keys(after)])].filter(k => !allowed(k)).every(k => storage[k] === after[k]) };
}
function rejectedPlacements012() {
 const Q = window.__riversideQA012, rows = [], x = 64, y = 63;
 Q.prepare(x, y, 3);
 const test = (label, r, xx = x, yy = y) => {
  const before = Q.world(), money = GV.devMoney516B(), preview = GV.placePreview459(r.id, xx, yy), placed = GV.place(r.id, xx, yy);
  rows.push({ label, id: r.id, preview, placed, unchanged: before === Q.world() && money === GV.devMoney516B() });
 };
 for (const r of Q.roots) { test('whole-footprint collision', r, 58, 50); test('map-edge rejection', r, Q.N, 0); }
 for (const [tool, label] of [['tree', 'tree'], ['road', 'road'], ['tdig', 'water'], ['riverQuay012', 'path']]) {
  const before = Q.world(); Q.pay(tool, x, y, true);
  for (const r of Q.roots) test(label, r);
  if (!GV.undo() || before !== Q.world()) throw Error('Obstacle undo not exact: ' + tool);
 }
 Q.pay('traise', x, y, true);
 for (const r of Q.roots.filter(q => q.sz > 1)) test('uneven footprint', r);
 if (!GV.undo()) throw Error('Terrain obstruction undo failed');
 for (const p of Q.paths) test('land-only themed path', p, 60, 57);
 window.__noRiverside012 = true;
 try { for (const r of Q.roots) test('bounded new-building escape', r); for (const p of Q.paths) test('bounded new-path escape', p); }
 finally { delete window.__noRiverside012; }
 return rows;
}
function nativeOcclusion012() {
 const Q = window.__riversideQA012, root = Q.roots.find(r => r.k === 278), out = { trials: [] };
 // Real paid foregrounds start at age0 and mature through nine ordinary ticks.
 // Every on/off comparison is at the same final day/time and camera via undo.
 for (const [x, y] of [[61, 51], [61, 50], [61, 52]]) {
  const cells = Array.from({ length: 4 }, (_, n) => ({ x: x + n % 2, y: y + Math.floor(n / 2), t: GV.tile(x + n % 2, y + Math.floor(n / 2)) }));
  if (cells.some(c => c.t.bld || c.t.road || c.t.rail || c.t.tram || c.t.am502 || c.t.parkMeter)) { out.trials.push({ x, y, skipped: 'Existing native identity preserved' }); continue; }
  Q.prepare(x, y, 2);
  const payment = Q.pay('britishTerrace', x, y, true), initial = GV.tile(x, y).bld, from = GV.stats().day, days = [];
  if (initial?.k !== 219 || initial.age !== 0 || initial.sz !== 2) throw Error('Foreground must be paid native age0');
  for (let n = 0; n < 9; n++) { step012(1); days.push({ day: GV.stats().day, age: GV.tile(x, y).bld?.age }); }
  const foreground = GV.tile(x, y).bld, withScene = nativeScene012(0, true, [root.x, root.y], 2), withLight = nativeLight012(root.k), before = GV.riversideAt012(root.x, root.y);
  if (!GV.undo()) throw Error('Actual foreground undo failed');
  const control = nativeScene012(0, true, [root.x, root.y], 2), withoutLight = nativeLight012(root.k), after = GV.riversideAt012(root.x, root.y);
  const identity = r => JSON.stringify({ root: r.root, k: r.k, v: r.v, sz: r.sz, age: r.age, refs: r.refCells });
  const row = { x, y, payment, initial, from, to: GV.stats().day, days, foreground, before, after, withLight, withoutLight,
   sameTurn: withScene.day === control.day && JSON.stringify(withScene.time) === JSON.stringify(control.time),
   sameIdentity: identity(before) === identity(after), removed: cells.every(c => !GV.tile(c.x, c.y).bld) };
  row.partial = row.sameTurn && row.sameIdentity && row.removed && foreground.age >= 9 && before.operational && after.operational && withLight.candidates > 0 && withLight.blocked > withoutLight.blocked && withLight.visible > 0;
  out.trials.push(row);
  if (row.partial) { out.selected = row; out.capture = withScene; out.control = control; break; }
 }
 return out;
}
function waterComposition012() {
 const Q = window.__riversideQA012, c = document.getElementById('game'), camera = GV.camera436(), zoom = camera.z;
 const cells = Q.waterCells.map(p => {
  const v = GV.w2v(p.x, p.y), sx = Math.round(c.width / 2 - camera.x * zoom) + (v[0] - v[1]) * 32 * zoom + 32 * zoom;
  const sy = Math.round(c.height / 2 - camera.y * zoom) + (v[0] + v[1]) * 16 * zoom + 16 * zoom;
  return { x: p.x, y: p.y, t: GV.tile(p.x, p.y).t, sx, sy, within: sx >= 0 && sy >= 0 && sx < c.width && sy < c.height };
 });
 return { cells, water: cells.filter(p => p.t === 0).length, visibleWater: cells.filter(p => p.t === 0 && p.within).length,
  shoreline: Q.shoreline.map(p => ({ ...p, land: GV.tile(p.x, p.y).t, water: GV.tile(p.x, p.y + 1).t })),
  themes: Q.pathPlacements.map(p => ({ ...p, at: GV.riversideAt012(p.x, p.y) })) };
}

function cardinalPathProbes012() {
 const Q = window.__riversideQA012, rows = [], preparation = [], probes = [
  { side: 'south', x: 70, y: 55, dx: 0, dy: 1, turn: 1 },
  { side: 'west', x: 71, y: 58, dx: -1, dy: 0, turn: 2 },
  { side: 'north', x: 64, y: 61, dx: 0, dy: -1, turn: 3 },
  { side: 'east', x: 56, y: 58, dx: 1, dy: 0, turn: 0 }
 ];
 const canal = Q.waterCells.map(p => ({ x: p.x, y: p.y, t: GV.tile(p.x, p.y).t }));
 for (const p of probes) {
  if (GV.tile(p.x + p.dx, p.y + p.dy).t !== 0) throw Error('Cardinal probe requires genuine adjoining canal water');
  const start = Q.paid.length;
  Q.prepare(p.x, p.y);
  // Make only immediate non-water-facing bank neighbors unambiguous using
  // paid land reclamation where needed. Never erase the 70-cell canal.
  for (const [dx, dy] of [[0, 1], [-1, 0], [0, -1], [1, 0]]) {
   const x = p.x + dx, y = p.y + dy;
   if (dx === p.dx && dy === p.dy || x < 0 || y < 0 || x >= Q.N || y >= Q.N) continue;
   const t = GV.tile(x, y);
   if (t.t === 0) {
    if (Q.waterCells.some(q => q.x === x && q.y === y)) throw Error('Orientation control must never erase canal');
    Q.pay('tland', x, y);
   }
  }
  preparation.push({ ...p, payments: Q.paid.slice(start) });
  for (const theme of ['quay', 'rail']) {
   const spec = GV.riversideSpecs012().paths.find(q => q.theme === theme), quote = GV.placePreview459('footpath502', p.x, p.y);
   const purchase = Q.pay(spec.id, p.x, p.y), placed = GV.riversideAt012(p.x, p.y), tile = GV.tile(p.x, p.y);
   GV.save(); const loaded = GV.load();
   if (!loaded) throw Error('Cardinal path native load failed');
   const afterLoad = GV.riversideAt012(p.x, p.y), fromDay = GV.stats().day;
   step012(1); const afterDay = GV.riversideAt012(p.x, p.y), toDay = GV.stats().day;
   const remove = Q.pay('doze', p.x, p.y), removed = !GV.riversideAt012(p.x, p.y);
   rows.push({ ...p, theme, purchase, plainCost: quote.cost, placed, loaded, afterLoad, afterDay, fromDay, toDay, remove, removed,
    metadataExact: JSON.stringify(tile.amx502) === JSON.stringify(afterLoad.amx502) && JSON.stringify(tile.amx502) === JSON.stringify(afterDay.amx502),
    actualWater: GV.tile(p.x + p.dx, p.y + p.dy).t });
  }
 }
 return { preparation, rows, canalPreserved: canal.every(p => p.t === 0 && GV.tile(p.x, p.y).t === 0),
  orientationContract: 'Canonical EAST=0, SOUTH=1, WEST=2, NORTH=3. Nearest cardinal water within four cells, tie order S,W,N,E. Persisted placement-time turn012 is visual only.' };
}

(async () => {
 const watchdog = setTimeout(() => { report.error = 'Riverside evidence watchdog expired'; save(); process.exit(124); }, 28 * 60000);
 watchdog.unref();
 try {
  report.static = verifyStatic012();
  delete report.static.protectedManifest;
  check('strict authorized candidate/release contract and all protected prior bytes', report.static.ok && report.static.protectedExact, report.static);
  report.version = report.static.version; report.anchor = report.static.anchor; report.release = report.static.release;
  const session = await withGame({ port: 8199, timeout: 1650, fresh: true,
   preScript: "localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');", log: console.log }, async ({ cdp }) => {
   const ev = async (expression, label = 'native observation') => {
    progress('start', { label });
    const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    progress('done', { label }); return result.result.value;
   };
   const functions = [bindObservation012, setupRiverside012, identity012, snapshot012, step012, assetAudit012, artPurity012,
    nativeScene012, nativeLight012, retailWitness012, physicalLoss012, zeroStaff012, nativeSaveLoad012,
    nativeTransactions012, nativePathEdits012, cardinalPathProbes012, rejectedPlacements012, nativeOcclusion012, waterComposition012];
   const register = () => ev('window.__riversideFns012=(()=>{' + legacyStreet + '\n' + legacyMuseum + '\n' + functions.map(f => f.toString()).join('\n') + ';return{' + functions.map(f => f.name).join(',') + '};})()', 'register CI observation functions');
   const call = (name, ...args) => ev('window.__riversideFns012.' + name + '(' + args.map(q => JSON.stringify(q)).join(',') + ')', name);
   const readyRetail = r => r.roots.length === 3 && r.roots.every(q => q.operational && q.employed > 0 && q.positions > 0 && q.activity.shopping > 0);
   const allPriorReady = r => r.priorStreet.roots.length === 3 && r.priorStreet.roots.every(q => q.operational && q.employed > 0) && r.priorMuseum.roots.length === 1 && r.priorMuseum.roots[0].operational && r.priorMuseum.roots[0].employed > 0;
   const fiscalZero = r => r.exact && r.zero && r.taxLedger.current && r.taxLedger.total === 0;
   await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1080, deviceScaleFactor: 1, mobile: false });
   await register();
   report.boot = await ev('({ready:!!window.__bootDone453,version:GV.ver(),label:document.getElementById("startVersion456")?.textContent?.trim(),slot:localStorage.getItem("glimmerville.v1.slot"),batches:window.__t574,art:window.__riversideArt012})', 'native boot');
   check('verified exact native version/anchor display and disposable slot3 boot', report.boot.ready && report.boot.version === report.version && report.boot.label === 'v' + report.version + ' · ' + report.anchor && report.boot.slot === '3' && !report.boot.batches.err.length, report.boot);
   report.selftest = await ev('GV.riversideSelftest012()', 'bounded market and path catalog selftest');
   check('bounded private retail catalog and canonical authored art selftest', report.selftest.ok, report.selftest);
   const fp = await ev('GV.fp536()', 'complete native leaf inventory'), blocks = await ev('GV.blockFp536()', 'all native block records');
   report.fingerprint = verifyFingerprint012(fp, blocks);
   check('strict24 additions and every old leaf family and block remains exact', report.fingerprint.ok, report.fingerprint);
   fs.writeFileSync(path.join(OUT, 'guards/fingerprint-native.json'), JSON.stringify({ checkedSHA: head, sourceSHA256: report.sourceSHA256,
    version: report.version, anchor: report.anchor, release: report.release, fp, blocks, proof: report.fingerprint }, null, 2));
   if (MODE === 'preflight' || MODE === 'fingerprint') {
    report.assets = await call('assetAudit012');
    for (const a of report.assets) {
     png('assets/' + a.key + '.png', a.png, { kind: 'native installed canonical day sprite', key: a.key });
     png('assets/' + a.key + '-night.png', a.night, { kind: 'native installed physical-emission mask', key: a.key });
     delete a.png; delete a.night;
    }
    check('all24 canonical sprites opaque and all night emission physically contained', report.assets.length === 24 && report.assets.every(a => a.opaque > 0 && a.partial === 0 && a.outside === 0) && report.assets.filter(a => a.key.startsWith('bld.')).every(a => a.lit > 0), report.assets);
   }
   if (MODE === 'fingerprint') return true;
   report.locks = await ev('(()=>{GV.newWorld();GV.setSpeed(0);GV.ai(false);GV.setDiff(1);return{rank:GV.rank(),rows:[...GV.riversideSpecs012().buildings,...GV.riversideSpecs012().paths].map(r=>({id:r.id,preview:GV.placePreview459(r.id,10,10)}))};})()', 'real rank1 catalog locking');
   check('all six new tools reject a real rank1 world', report.locks.rank.lv === 1 && report.locks.rows.length === 6 && report.locks.rows.every(r => r.preview?.ok === false), report.locks);
   report.fixture = await ev('window.__riversideFns012.setupRiverside012((' + seedApprovedBritishLegacy007.toString() + '))', 'paid native riverside quarter with true water');
   const fixture = report.fixture;
   check('ordinary paid age0 market, three independent themes, real canal and retained town', fixture.difficulty === 1 && !fixture.developer.sandbox && !fixture.developer.god && fixture.roots.length === 3 && fixture.initial.roots.length === 3 && fixture.initial.roots.every(r => r.age === 0 && !r.built && !r.operational) && fixture.paid.every(p => p.exact && p.charged > 0) && fixture.paths.length === 3 && new Set(fixture.paths.map(p => p.theme)).size === 3 && fixture.waterCells.length === 70 && fixture.waterCells.every(p => p.terrain === 0 && p.payments.every(q => q.exact && q.charged > 0)) && fixture.shoreline.length === 13 && fixture.shoreline.every(p => p.land !== 0 && p.water === 0) && fixture.retained.length === 47, fixture);
   report.purity = await call('artPurity012');
   check('24 authored assets rebuild deterministically without RNG world storage or canonical mutation', report.purity.calls === 0 && report.purity.count === 24 && report.purity.same && report.purity.worldExact && report.purity.storageExact && report.purity.canonical && report.purity.canonicalPixelsExact, report.purity);
   report.rejections = await call('rejectedPlacements012');
   check('native collision tree road water uneven path edge and escape rejections are non-mutating', report.rejections.length === 28 && report.rejections.every(r => (r.label === 'map-edge rejection' ? r.preview === null : r.preview?.ok === false) && !r.placed && r.unchanged), report.rejections);
   const constructionRotation = MODE.startsWith('construction') ? +MODE.slice(-1) : null;
   const constructionShot = async (days) => {
    for (const night of [false, true]) {
     const scene = await call('nativeScene012', constructionRotation, night, [62, 52], 1.6);
     png('images/construction-day' + days + '-' + (night ? 'night' : 'day') + '.png', scene.png, {
      kind: 'actual native ordinary construction', ordinaryDays: days, day: scene.day, rotation: scene.rot, night,
      ages: scene.roots.map(r => ({ k: r.k, age: r.age })), placementDay: fixture.placementDay });
    }
   };
   if (constructionRotation !== null) await constructionShot(0);
   for (let days = 1; days <= 9; days++) {
    report.current = await call('step012', 1);
    if (constructionRotation !== null && [1, 3, 6, 8, 9].includes(days)) await constructionShot(days);
   }
   report.nineDays = await ev('({days:window.__riversideQA012.days,now:window.__riversideFns012.snapshot012()})', 'nine genuine ordinary construction days');
   check('actual age0→9 sequence suppresses work shopping and tax before real completion', report.nineDays.days.length === 9 && report.nineDays.days.every((d, n) => d.from === fixture.placementDay + n && d.day === fixture.placementDay + n + 1 && d.roots.every(r => r.age === n + 1)) && report.nineDays.days.slice(0, 8).every(d => d.roots.length === 3 && d.roots.every(r => !r.built && !r.operational && r.positions === 0 && r.employed === 0 && r.activity.work === 0 && r.activity.shopping === 0 && (!r.tax || r.tax.tax === 0)) && d.taxLedger.current && d.taxLedger.total === 0) && report.nineDays.now.roots.every(r => r.age === 9 && r.built), report.nineDays);
   if (constructionRotation !== null) {
    const shots = report.artifacts.filter(p => p.path.startsWith('images/construction-day')), milestones = [0, 1, 3, 6, 8, 9];
    report.construction = { rotation: constructionRotation, milestones, shots };
    check('twelve actual day/night construction PNGs ages0/1/3/6/8/9 in selected camera', shots.length === 12 && milestones.every(d => [false, true].every(night => shots.filter(q => q.ordinaryDays === d && q.night === night && q.rotation === constructionRotation && q.ages.length === 3 && q.ages.every(r => [278, 279, 280].includes(r.k) && r.age === d)).length === 1)), report.construction);
   }
   for (let n = 9; n < 24; n++) {
    const retail = await call('retailWitness012');
    if (readyRetail(report.current) && retail.positive && allPriorReady(report.current)) break;
    report.current = await call('step012', 1);
   }
   report.operational = await call('snapshot012'); report.retail = await call('retailWitness012');
   const op = report.operational;
   check('all three private shops use actual road power water demand enterprise positions and labor', readyRetail(op) && op.roots.every(r => r.powerState === 1 && r.powerAllocation?.root === r.root && r.powerAllocation.pool >= 0 && r.waterState.code >= 2 && r.waterDelivered > 0 && r.road.length > 0 && r.enterprise?.activePositions > 0 && r.enterprise.employed > 0 && r.enterprise.potentialJobs === ({ 278: 18, 279: 3, 280: 4 })[r.k] && r.employed <= r.positions && r.positions <= r.enterprise.potentialJobs), op);
   check('real positive shopping and fiscal commercial receipts have exactly one existing authority', report.retail.exact && report.retail.positive, report.retail);
   check('all47 old British roots complete footprints both stations and museum retain identity', op.retained.length === 47 && op.retained.every(r => r.bld?.k === r.k && (r.bld.sz || 1) === r.sz && r.cells.every((b, n) => n === 0 ? b.k === r.k : b?.ref?.[0] === r.x && b.ref[1] === r.y)) && op.stations.length === 2 && op.stations.every(r => r.k === 139 && r.v === 3 && r.age >= 9 && r.ownedRail.every(v => v === 1)) && allPriorReady(op), { retained: op.retained, stations: op.stations, street: op.priorStreet, museum: op.priorMuseum });
   if (MODE === 'preflight' || MODE.startsWith('camera')) {
    const rotation = MODE.startsWith('camera') ? +MODE.slice(-1) : 0;
    for (const r of fixture.roots) for (const night of [false, true]) {
     const scene = await call('nativeScene012', rotation, night, [r.x, r.y], 2), g = scene.geometry.find(q => q.k === r.k);
     png('images/' + r.k + '-r' + rotation + '-' + (night ? 'night' : 'day') + '.png', scene.png, { kind: 'actual native complete market facade', rotation, night, root: r, day: scene.day, geometry: scene.geometry });
     check('native canonical full facade ' + r.k + ' camera' + rotation + ' ' + (night ? 'night' : 'day'), scene.rot === rotation && g.canonical && g.within && g.anchorError.every(v => Math.abs(v) < 1e-5) && (night ? scene.time.b < .45 : scene.time.b > .95), g);
    }
    for (const night of [false, true]) {
     const scene = await call('nativeScene012', rotation, night, [62, 53], 1.5), water = await call('waterComposition012');
     png('images/riverside-quarter-r' + rotation + '-' + (night ? 'night' : 'day') + '.png', scene.png, { kind: 'actual native coherent market quarter and water frontage', rotation, night, day: scene.day, geometry: scene.geometry, water });
     check('wide market quarter has all three complete shops and actual visible water camera' + rotation + ' ' + night, scene.geometry.every(g => g.canonical && g.within) && water.water === 70 && water.visibleWater >= 50 && water.shoreline.every(p => p.land !== 0 && p.water === 0) && water.themes.length === 34 && water.themes.every(p => p.at?.theme === p.theme), { geometry: scene.geometry, water });
     const town = await call('nativeScene012', rotation, night, [48, 38], .85);
     png('images/mixed-town-r' + rotation + '-' + (night ? 'night' : 'day') + '.png', town.png, { kind: 'actual native retained British mixed town and new riverside quarter', rotation, night, day: town.day });
    }
   }
   report.saveLoad = await call('nativeSaveLoad012');
   const sl = report.saveLoad;
   check('native save/load preserves every root/ref/theme/shoreline with bounded placement escape and next day', sl.loaded && sl.disabled && sl.references && sl.otherSlotsUnchanged && sl.bytes > 1000 && sl.following.day === sl.from + 1 && readyRetail(sl.following) && sl.retail.positive, sl);
   if (MODE === 'preflight' || MODE === 'gameplay') {
    report.losses = [];
    for (const kind of ['power', 'water', 'road']) {
     const loss = await call('physicalLoss012', kind); report.losses.push(loss);
     check('paid physical ' + kind + ' removal yields zero jobs shopping tax; real paid repair restores', loss.beforeRetail.positive && loss.removed.length > 0 && loss.lost.roots.length === 3 && loss.lost.roots.every(r => !r.operational && r.positions === 0 && r.employed === 0 && r.activity.work === 0 && r.activity.shopping === 0) && fiscalZero(loss.lostRetail) && loss.repair.length === loss.removed.length && loss.repair.every(r => r.exact && r.charged > 0) && loss.recoveredRetail.positive && readyRetail(loss.recovered) && (kind !== 'power' || loss.lostLight.every(r => r.candidates === 0) && loss.recoveredLight.some(r => r.visible > 0)), loss);
    }
   }
   if (MODE === 'gameplay') {
    report.pathEdits = await call('nativePathEdits012');
    const edit = report.pathEdits;
    check('three independent paid theme replacements retain native price and actual load/following-day metadata', edit.rows.length === 3 && edit.originalThemesRestored && edit.otherSlotsUnchanged && edit.rows.every(r => r.from !== r.to && r.remove.exact && r.remove.charged > 0 && r.removed && r.purchase.exact && r.purchase.charged > 0 && r.purchase.cost === r.plainQuote.cost && r.edited.theme === r.to && r.loaded && r.metadataExact && r.afterLoad.theme === r.to && r.toDay === r.fromDay + 1 && r.afterDay.theme === r.to && r.afterDay.am502 === 1 && r.afterDay.baseWalkCost === .72 && r.removeEdited.exact && r.restore.exact && r.restored.theme === r.from), edit);
    report.cardinalPaths = await call('cardinalPathProbes012');
    const cardinal = report.cardinalPaths;
    check('paid quay and rail face each genuine cardinal water bank and persist across save/load/day', cardinal.canalPreserved && cardinal.rows.length === 8 && cardinal.preparation.every(q => q.payments.every(p => p.exact && p.charged > 0)) && cardinal.rows.every(q => q.purchase.exact && q.purchase.charged > 0 && q.purchase.cost === q.plainCost && q.placed.theme === q.theme && q.placed.amx502.turn012 === q.turn && q.loaded && q.metadataExact && q.afterLoad.amx502.turn012 === q.turn && q.afterDay.amx502.turn012 === q.turn && q.afterDay.am502 === 1 && q.afterDay.baseWalkCost === .72 && q.toDay === q.fromDay + 1 && q.actualWater === 0 && q.remove.exact && q.remove.charged > 0 && q.removed), cardinal);
    report.zeroStaff = await call('zeroStaff012');
    const staff = report.zeroStaff;
    check('zero actual residents leave supplied retail with zero shopping and actual commercial tax', staff.baseline.positive && staff.housing.length > 0 && staff.payments.length === staff.housing.length && staff.payments.every(p => p.exact && p.charged > 0) && staff.zero.pop === 0 && staff.zero.roots.every(r => r.operational && r.employed === 0 && r.activity.shopping === 0) && fiscalZero(staff.zero) && staff.restoredIdentity && staff.restored.positive, staff);
   }
   if (MODE === 'camera0') {
    const q = await call('nativeOcclusion012'); report.occlusion = { trials: q.trials, selected: q.selected };
    if (q.capture) {
     png('images/partial-occlusion-night.png', q.capture.png, { kind: 'real mature paid foreground blocking market physical emission', rotation: 0, ordinaryDays: 9, foreground: q.selected.foreground, day: q.capture.day });
     png('images/partial-occlusion-control-night.png', q.control.png, { kind: 'same-turn native undo control without foreground', rotation: 0, day: q.control.day });
    }
    check('real age9 foreground blocks some physical windows while others stay visible', !!q.selected && q.selected.partial && q.selected.payment.exact && q.selected.payment.charged > 0 && q.selected.initial.age === 0 && q.selected.days.length === 9 && q.selected.days.every((d, n) => d.day === q.selected.from + n + 1 && d.age === n + 1) && q.selected.to === q.selected.from + 9, report.occlusion);
   }
   if (MODE === 'weather') {
    report.weather = [];
    for (const weather of [0, 1, 2]) for (const rotation of [0, 1, 2, 3]) {
     await call('nativeScene012', rotation, false, [62, 53], 1.5);
     const q = await ev('(()=>{const actualWeather=GV.weather(' + weather + ');GV.forceDraw();return{actualWeather,rot:GV.rot(),png:document.getElementById("game").toDataURL("image/png"),evidence:GV.riversideEvidence012(),composition:window.__riversideFns012.waterComposition012()};})()', 'actual weather market render');
     png('images/weather' + weather + '-r' + rotation + '.png', q.png, { kind: 'actual native weather and riverside quarter', weather, rotation, day: q.evidence.day });
     report.weather.push({ weather, rotation, actualWeather: q.actualWeather, rot: q.rot, roots: q.evidence.roots, composition: q.composition });
    }
    check('twelve real weather/orientation scenes preserve market identities and true shoreline', report.weather.length === 12 && report.weather.every(q => q.weather === q.actualWeather && q.rotation === q.rot && q.roots.length === 3 && q.composition.water === 70 && q.composition.visibleWater >= 50), report.weather);
   }
   report.transactions = await call('nativeTransactions012');
   const tx = report.transactions;
   check('paid reference-cell whole-footprint doze/undo/redo and all three independent themes', tx.rows.length === 3 && tx.rows.every(r => r.ok && r.quote.ok && r.charged === r.quote.cost && r.charged > 0 && r.gone && r.undo && r.restored && r.redo && r.regone && r.redoPaid && r.undoAgain && r.final && r.inspect.includes('英式')) && tx.pathRows.length === 3 && tx.pathRows.every(p => p.doze && p.removed && p.charged > 0 && p.undo && p.exact && p.redo && p.regone && p.redoPaid && p.undoAgain && p.final && p.base.am502 === 1 && p.base.baseWalkCost === .72 && p.base.cost === p.plainCost), tx);
   check('paused native rendering preserves world storage identity and every canonical reference', tx.renderWorldExact && tx.renderStorageExact && tx.identitiesExact && tx.canonical, tx);
   report.performance = await ev('(()=>{for(let n=0;n<3;n++)GV.forceDraw();const frames=[];for(let n=0;n<12;n++){const t=performance.now();GV.forceDraw();frames.push(performance.now()-t);}return{frames,mean:frames.reduce((a,b)=>a+b,0)/frames.length,art:window.__riversideArt012};})()', 'bounded native draw timing');
   check('art installs once; deterministic rebuild and real native render costs measured and bounded', report.performance.art.builds === 1 && report.performance.art.total === 24 && report.performance.art.ms < 10000 && report.purity.ms < 20000 && report.performance.mean < 1000, report.performance);
   if (MODE === 'coldload') {
    report.reloads = [];
    const sentinelKeys = ['glimmerville.v1.s1', 'glimmerville.v1.s1_bak', 'glimmerville.v1.s2', 'glimmerville.v1.s2_bak'];
    for (let iteration = 1; iteration <= 2; iteration++) {
     // Save the current live state immediately before navigation. Never swap a
     // stale fixture save under visibilitychange/autosave, and never patch it.
     const saved = await ev("(()=>{GV.setSpeed(0);GV.ai(false);GV.save();return{raw:localStorage.getItem('glimmerville.v1.s3'),snapshot:window.__riversideFns012.snapshot012()};})()", 'cold reload' + iteration + ' current native save');
     check('reload' + iteration + ': paused current native save is valid and already operational', typeof saved.raw === 'string' && saved.raw.length > 1000 && saved.snapshot.slot === '3' && readyRetail(saved.snapshot) && allPriorReady(saved.snapshot), { bytes: saved.raw?.length, inputDay: saved.snapshot.day });
     // Disposable fresh profile only. Valid native copies witness untouched
     // other-slot saves and backups; no user profile is attached to this browser.
     if (iteration === 1) await ev('(()=>{for(const k of ' + JSON.stringify(sentinelKeys) + ')localStorage.setItem(k,' + JSON.stringify(saved.raw) + ');return true;})()', 'create isolated other-slot sentinels');
     const sentinels = await ev('Object.fromEntries(' + JSON.stringify(sentinelKeys) + '.map(k=>[k,localStorage.getItem(k)]))', 'record slot sentinel bytes');
     const row = { iteration, inputSHA256: hash(saved.raw), inputBytes: Buffer.byteLength(saved.raw), inputDay: saved.snapshot.day,
      input: saved.snapshot, followingDays: [], sentinelSHA256: Object.fromEntries(Object.entries(sentinels).map(([k, raw]) => [k, hash(raw || '')])) };
     report.reloads.push(row); save();
     await cdp.send('Page.reload', { ignoreCache: true });
     check('reload' + iteration + ': whole page actually boots into native start menu', await waitFor(cdp, "!!window.__bootDone453&&!!window.GV&&getComputedStyle(document.getElementById('start')).display!=='none'", 180000));
     const bytes = await ev("localStorage.getItem('glimmerville.v1.s3')", 'save bytes before Continue');
     row.beforeContinueSHA256 = hash(bytes || '');
     check('reload' + iteration + ': exact full native save bytes survive navigation', bytes === saved.raw, { before: row.inputSHA256, after: row.beforeContinueSHA256 });
     const nativeSource = await ev('(async()=>{const t=await fetch("index.html",{cache:"no-store"}).then(r=>r.text());const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,"0")).join("");})()', 'exact served source hash after cold boot');
     check('reload' + iteration + ': newly loaded page source matches checked head bytes', nativeSource === report.sourceSHA256, { sourceSHA256: nativeSource });
     await register();
     await call('bindObservation012', fixture.recipe);
     row.immediate = await ev("(()=>{const b=document.getElementById('bContinue');if(!b||getComputedStyle(b).display==='none')throw Error('Native Continue is missing');b.click();GV.setSpeed(0);GV.ai(false);return window.__riversideFns012.snapshot012();})()", 'native Continue click');
     check('reload' + iteration + ': Continue preserves every root/reference/age/view/theme/water cell and day', eq(row.immediate.identity, saved.snapshot.identity) && row.immediate.day === row.inputDay && row.immediate.stats.money === Math.round(saved.snapshot.stats.money) && row.immediate.slot === '3' && row.immediate.difficulty === 1 && !row.immediate.developer.sandbox && !row.immediate.developer.god && !row.immediate.coldFixDisabled && row.immediate.taxLedger.current === false, row.immediate);
     for (let frame = 1; frame <= 2; frame++) {
      const snap = await ev('new Promise(resolve=>requestAnimationFrame(()=>resolve(window.__riversideFns012.snapshot012())))', 'post-Continue frame' + frame);
      row['frame' + frame] = snap;
      check('reload' + iteration + ': frame' + frame + ' remains paused with unchanged native identity', snap.day === row.inputDay && eq(snap.identity, saved.snapshot.identity));
     }
     for (let day = 1; day <= 3; day++) {
      // There are no ensure/rebuild/repair calls here. The ordinary native tick
      // itself is responsible for T724 cold-load dispatch and the fiscal result.
      const snap = await call('step012', 1), retail = await call('retailWitness012');
      row.followingDays.push({ ordinaryDay: day, snapshot: snap, retail }); save();
      check('reload' + iteration + ': unaided ordinary day' + day + ' retains population physical service staff shopping and actual tax', snap.day === row.inputDay + day && snap.stats.pop > 0 && snap.stats.poweredBld > 0 && (snap.districtCache?.districts || 0) > 0 && readyRetail(snap) && allPriorReady(snap) && retail.exact && retail.positive && snap.roots.every(r => r.powerState === 1 && r.waterDelivered > 0 && r.waterState.code >= 2) && snap.shoreline.every(p => p.land !== 0 && p.water === 0), { day: snap.day, population: snap.stats.pop, poweredBld: snap.stats.poweredBld, districtCache: snap.districtCache, roots: snap.roots, retail });
      if (day === 1 || day === 3) {
       const scene = await call('nativeScene012', 0, false, [62, 53], 1.5);
       png('images/reload' + iteration + '-day' + day + '.png', scene.png, { kind: 'actual cold Continue following ordinary day; no repair', iteration, ordinaryDay: day, day: scene.day, inputSHA256: row.inputSHA256, rotation: 0 });
      }
     }
     const afterSentinels = await ev('Object.fromEntries(' + JSON.stringify(sentinelKeys) + '.map(k=>[k,localStorage.getItem(k)]))', 'verify other-slot sentinels');
     row.otherSlotsUnchanged = eq(afterSentinels, sentinels);
     check('reload' + iteration + ': other save slots and backups remain byte-identical', row.otherSlotsUnchanged);
     row.ok = row.followingDays.length === 3 && row.otherSlotsUnchanged; save();
    }
    check('two real cold page reload/Continue cycles each pass three unaided ordinary days', report.reloads.length === 2 && report.reloads.every(r => r.ok), report.reloads.map(r => ({ iteration: r.iteration, inputSHA256: r.inputSHA256, inputDay: r.inputDay, days: r.followingDays.map(d => d.snapshot.day), otherSlotsUnchanged: r.otherSlotsUnchanged })));
   }
   report.consoleErrors = cdp.errors; report.knownPWALogs = cdp.benign;
   check('console and uncaught exceptions absent', cdp.errors.length === 0, cdp.errors);
   return true;
  });
  report.session = { ok: session.ok, fails: session.fails, seconds: session.seconds };
  check('selected native browser evidence session completed', session.ok, report.session);
  check('exact checked product source remains unchanged', fs.readFileSync(path.join(ROOT, 'index.html')).equals(source));
  check('every delivered PNG has verified bytes dimensions head and source provenance', report.artifacts.every(a => {
   const b = fs.readFileSync(path.join(OUT, a.path));
   return a.checkedSHA === head && a.sourceSHA256 === report.sourceSHA256 && a.bytes === b.length && a.sha256 === hash(b) && a.width === b.readUInt32BE(16) && a.height === b.readUInt32BE(20);
  }), report.artifacts.map(a => ({ path: a.path, width: a.width, height: a.height, sha256: a.sha256 })));
  report.ok = report.failures.length === 0;
 } catch (error) {
  report.error = String(error.stack || error); report.ok = false; console.error(report.error); process.exitCode = 1;
 } finally {
  clearTimeout(watchdog); report.finishedAt = new Date().toISOString(); save();
  console.log(JSON.stringify({ mode: MODE, checkedSHA: head, ok: report.ok, checks: report.checks.length, failures: report.failures, error: report.error }));
 }
})();

#!/usr/bin/env node
'use strict';
/* GPT-003: remote-CI-only art experiment. Product HTML is read byte-for-byte.
 * Provisional UKP IDs never enter the catalog or save. Three already registered
 * footprint-compatible building IDs carry temporary sprite references, restored
 * in finally. Fixtures live only in a fresh Chromium profile, slot 3, port 8199.
 * Do not execute this game harness locally as GPT; AGENTS.md section 5 applies.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { withGame } = require('./harness');
const SOURCE_SHA = '9be7bc069a9f3dcb5bd71787dc4ab8e672b4f7d1';
const SOURCE_DIGEST = '5c60ef1809599419b9e456a136da2b6e9e499b6069d4b5d10f8e7b222932585a';
const OUT = path.join(__dirname, 'british-prototypes-evidence');
const ART = path.join(__dirname, 'british-prototypes-art.js');
const TARGETS = [
  { id: 'UKP01', k: 41, carrier: 'grandlib', sz: 2, x: 8, y: 14, w: 136, h: 150, ax: 68, ay: 148 },
  { id: 'UKP02', k: 42, carrier: 'civicHall', sz: 2, x: 14, y: 14, w: 136, h: 150, ax: 68, ay: 148 },
  { id: 'UKP03', k: 44, carrier: 'convention', sz: 3, x: 8, y: 20, w: 208, h: 220, ax: 104, ay: 218 },
];
const BENCHMARKS = [
  { k: 197, nm: 'Existing corner pub', sz: 2, x: 14, y: 20 },
  { k: 194, nm: 'Existing galleried inn', sz: 2, x: 14, y: 26 },
  { k: 198, nm: 'Existing bookshop', sz: 1, x: 17, y: 22 },
];
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
for (const d of ['', 'full', 'crops', 'browser', 'assets', 'guards', 'logs']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const html = fs.readFileSync(path.join(__dirname, 'index.html'));
const art = fs.readFileSync(ART, 'utf8');
const report = {
  sourceSHA: SOURCE_SHA, sourceSHA256: sha(html), sourceBytes: html.length,
  rendererSHA256: sha(art), harnessSHA256: sha(fs.readFileSync(__filename)),
  workflowSHA: process.env.GITHUB_SHA || null,
  workflowRun: process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  createdAt: new Date().toISOString(), fixture: {
    seed: 5162026, slot: 3, port: 8199, rotation: 0, day: 1, weather: 0,
    zooms: [2, 1.2], maturity: 30, lightingPowerRate: 1,
    description: 'Paused GV.metroArtSeedWorld516 QA town with small controlled patches. Existing nearby town blocks and three unmodified benchmark building types remain. Temporary art carriers do not represent new buildable/economic/save integration.',
    targets: TARGETS, benchmarks: BENCHMARKS,
    rendererMetadata: '__t479 prevents old fallback flag coordinates; __t547 marks self-contained aligned art and suppresses legacy facade/synthetic-window overlays. Standard game draw, ground shadows, depth and T629 night composition remain active.',
  }, checks: [], failures: [], samples: [], town: [], artifacts: [], limitations: [
    'Simulation R is private inside the unchanged product IIFE, with no exposed state/call-counter hook. Its stream is not directly measured. External renderer generation is checked for Math.random calls and accessible world/save/sprite mutations.',
    'This is an isolated visual fixture, not a natural construction, economy, save/load, catalog, AI-placement, or production integration test.',
    'Timing numbers are one GitHub runner observation, not a cross-device performance guarantee. Pixel guards establish technical boundaries, not art quality.',
  ],
};
function save() { fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(report, null, 2)); }
function check(name, ok, detail) {
  report.checks.push({ name, ok: !!ok, ...(detail === undefined ? {} : { detail }) });
  if (!ok) report.failures.push(name);
}
function png(rel, url, provenance) {
  const buf = Buffer.from(url.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync(path.join(OUT, rel), buf);
  report.artifacts.push({ path: rel, bytes: buf.length, sha256: sha(buf), ...provenance });
}

// Browser functions below are serialized and evaluated only by the remote job.
function prepareFixture(targets, benchmarks) {
  const start = performance.now();
  const seeded = GV.metroArtSeedWorld516(5162026);
  GV.setSpeed(0); GV.ai(false); GV.setDay(1); GV.weather(0); GV.setRot(0);
  GV.nightPowerTest698(1);
  const allTiles = () => {
    const a = [];
    for (let y = 0; y < seeded.N; y++) for (let x = 0; x < seeded.N; x++) a.push(GV.tile(x, y));
    return a;
  };
  const before = allTiles();
  const patches = [];
  for (const q of [...targets, ...benchmarks]) {
    // One tile of foreground breathing space, with intact blocks beyond it.
    const p = { x: q.x - 1, y: q.y - 1, w: q.sz + 2, h: q.sz + 2 };
    patches.push(p); GV.art574.clear574(p.x, p.y, p.w, p.h);
  }
  const planted = GV.art574.plant574([...targets, ...benchmarks].map(q => ({ ...q, lv: 1, v: 0 })));
  // Keep existing roads at y=13/19/25 and x=12, without erasing placed roots.
  const roads = [];
  for (const y of [13, 19, 25]) for (let x = 6; x <= 19; x++) roads.push([x, y]);
  for (let y = 12; y <= 29; y++) roads.push([12, y]);
  GV.art574.road577(roads); GV.testRebake592();
  const after = allTiles();
  let intactRoots = 0, changedTiles = 0;
  for (let i = 0; i < before.length; i++) {
    if (JSON.stringify(before[i]) !== JSON.stringify(after[i])) changedTiles++;
    else if (before[i].bld && !before[i].bld.ref) intactRoots++;
  }
  const storage = () => Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)]));
  const world = () => JSON.stringify({ tiles: allTiles(), stats: GV.stats() });
  const q = window.__britishQA = {
    targets, benchmarks, storage, world, originals: new Map(), replacements: new Map(), captures: [],
    baselineStorage: JSON.stringify(storage()), baselineWorld: world(),
    baselineFingerprint: GV.fp536(),
    baselineKeys: Object.keys(GV.art574.SPR().bld).sort(),
    // Copy only values; no persistent catalog or runtime core object is changed.
    valves: ['__noGroundShade572', '__nightOccNoErase629', '__ovCap606', '__ovCapMax606'].map(k => [k, Object.prototype.hasOwnProperty.call(window, k), window[k]]),
  };
  return {
    seeded: { ok: seeded.ok, N: seeded.N, roots: seeded.roots, rciRoots: seeded.rciRoots },
    preparationMs: performance.now() - start, planted, patches, roadTilesReasserted: roads.length,
    unchangedExistingRoots: intactRoots, changedFixtureTiles: changedTiles,
    untargetedCarrierRoots: after.map((t, i) => ({ t, x: i % seeded.N, y: Math.floor(i / seeded.N) })).filter(p => p.t.bld && !p.t.bld.ref && targets.some(t => t.k === p.t.bld.k) && !targets.some(t => t.k === p.t.bld.k && t.x === p.x && t.y === p.y)).map(p => ({ k: p.t.bld.k, x: p.x, y: p.y })),
    targetTiles: targets.map(t => ({ ...t, root: GV.tile(t.x, t.y).bld,
      refs: Array.from({ length: t.sz * t.sz }, (_, i) => GV.tile(t.x + i % t.sz, t.y + Math.floor(i / t.sz)).bld) })),
    baselineFingerprint: q.baselineFingerprint,
    baselineStorageKeys: Object.keys(storage()),
  };
}

function buildAndInstall() {
  const q = window.__britishQA, api = window.BritishPrototypes;
  if (!api || typeof api.buildAll !== 'function') throw Error('Missing BritishPrototypes.buildAll');
  const oldRandom = Math.random; let randomCalls = 0;
  Math.random = function () { randomCalls++; return oldRandom.apply(this, arguments); };
  let sprites, buildMs, rebuildMs, deterministicRebuild = false, escapeValveNoop = false;
  try {
    const t = performance.now(); sprites = api.buildAll(); buildMs = performance.now() - t;
    const t2 = performance.now(), second = api.buildAll(); rebuildMs = performance.now() - t2;
    const samePixels = (a, b) => {
      if (!a || !b || a.width !== b.width || a.height !== b.height) return false;
      const ad = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
      const bd = b.getContext('2d').getImageData(0, 0, b.width, b.height).data;
      return ad.length === bd.length && ad.every((v, i) => v === bd[i]);
    };
    deterministicRebuild = Array.isArray(sprites) && Array.isArray(second) && sprites.length === second.length && sprites.every(a => {
      const b = second.find(b => b.id === a.id);
      return b && ['sz', 'w', 'h', 'ax', 'ay'].every(k => a[k] === b[k]) && a.img !== b.img && a.night !== b.night && samePixels(a.img, b.img) && samePixels(a.night, b.night);
    });
    const own = Object.prototype.hasOwnProperty.call(window, '__noBritishPrototypes003'), old = window.__noBritishPrototypes003;
    try {
      window.__noBritishPrototypes003 = true;
      const skipped = api.buildAll();
      escapeValveNoop = Array.isArray(skipped) && skipped.length === 0 && sprites.every(s => api.build(s.id) === null);
    } finally { if (own) window.__noBritishPrototypes003 = old; else delete window.__noBritishPrototypes003; }
  }
  finally { Math.random = oldRandom; }
  if (!Array.isArray(sprites) || sprites.length !== 3) throw Error('Expected three prototype results');
  q.sprites = sprites;
  const afterGeneration = GV.fp536();
  const pure = {
    worldUnchanged: q.world() === q.baselineWorld,
    storageUnchanged: JSON.stringify(q.storage()) === q.baselineStorage,
    spriteFingerprintUnchanged: JSON.stringify(afterGeneration) === JSON.stringify(q.baselineFingerprint),
    mathRandomCalls: randomCalls, simulationRngDirectlyAccessible: false,
  };
  const B = GV.art574.SPR().bld, metrics = [];
  for (const target of q.targets) {
    const s = sprites.find(p => p.id === target.id);
    if (!s || !(s.img instanceof HTMLCanvasElement) || !(s.night instanceof HTMLCanvasElement)) throw Error('Missing sprite canvases: ' + target.id);
    const d = s.img.getContext('2d').getImageData(0, 0, s.w, s.h).data;
    const n = s.night.getContext('2d').getImageData(0, 0, s.w, s.h).data;
    let solid = 0, edge = 0, nightPixels = 0, unsupportedNightAny = 0, unsupportedNight40 = 0;
    let outsideLotAny = 0, outsideLotSolid = 0;
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
      const i = (y * s.w + x) * 4;
      if (d[i + 3] > 120) { solid++; if (x <= 1 || y <= 1 || x >= s.w - 2 || y >= s.h - 2) edge++; }
      if (n[i + 3] > 0) { nightPixels++; if (d[i + 3] === 0) unsupportedNightAny++; }
      if (n[i + 3] > 40 && d[i + 3] === 0) unsupportedNight40++;
      // Pixel-center test against the footprint's vertical projected prism.
      // A 1px raster boundary is explicitly allowed, never a tile-sized apron.
      const outside = Math.abs(x + .5 - s.ax) > 32 * s.sz + 1 || y + .5 > s.ay - Math.abs(x + .5 - s.ax) / 2 + 1;
      if (outside && d[i + 3] > 0) outsideLotAny++;
      if (outside && d[i + 3] > 120) outsideLotSolid++;
    }
    const keys = Object.keys(B).filter(k => k.startsWith(target.k + '_'));
    if (!keys.length) throw Error('No existing carrier keys: ' + target.k);
    const replacement = { ...s, smoke: [], __t479: 1,
      __t547: { k: target.k, lv: 1, v: 0, bw: target.sz, bh: target.sz }, __britishPrototype: s.id };
    q.replacements.set(target.id, replacement);
    for (const key of keys) { q.originals.set(key, B[key]); B[key] = replacement; }
    metrics.push({ id: s.id, nm: s.nm, sz: s.sz, w: s.w, h: s.h, ax: s.ax, ay: s.ay,
      canvasDimensions: [s.img.width, s.img.height, s.night.width, s.night.height],
      solid, edge, nightPixels, unsupportedNightAny, unsupportedNight40, outsideLotAny, outsideLotSolid,
      footprintRule: 'pixel centers; vertical lot prism; 1px rasterization tolerance', carrierKeys: keys,
      day: s.img.toDataURL(), night: s.night.toDataURL() });
  }
  return { version: api.version || null, specs: api.specs, buildMs, rebuildMs, deterministicRebuild, escapeValveNoop, pure, metrics,
    sameCatalogKeys: JSON.stringify(Object.keys(B).sort()) === JSON.stringify(q.baselineKeys) };
}

function captureView(arg) {
  const Q = window.__britishQA, target = arg.id && Q.targets.find(t => t.id === arg.id);
  const proto = target && Q.replacements.get(target.id);
  const z = arg.z, mode = arg.mode, ph = mode === 'day' ? .5 : .9;
  if (target) {
    const d = Math.round((proto.ay - 32 * target.sz - proto.h / 2) / 32);
    GV.lookAt(target.x - d, target.y - d);
  } else GV.lookAt(12, 17);
  GV.setZoom(z); GV.setVisT(GV.art574.cycle574() * ph);
  window.__ovCapMax606 = 12000; window.__ovCap606 = [];
  GV.forceDraw();
  const caps = window.__ovCap606.slice(); window.__ovCap606 = null;
  const c = document.getElementById('game'), g = c.getContext('2d');
  const frame = g.getImageData(0, 0, c.width, c.height);
  const full = c.toDataURL();
  const hits = Q.targets.map(t => {
    const a = caps.find(a => a.o.x === t.x && a.o.y === t.y && a.bd.k === t.k);
    return a ? { id: t.id, k: t.k, x: t.x, y: t.y, bx: a.bx, by: a.by, z: a.z,
      width: a.s.w * a.z, height: a.s.h * a.z, depth: a.o.dep,
      prototypeIdentity: a.s === Q.replacements.get(t.id),
      withinCanvas: a.bx >= 0 && a.by >= 0 && a.bx + a.s.w * a.z <= c.width && a.by + a.s.h * a.z <= c.height } : { id: t.id, missing: true };
  });
  const hit = target && hits.find(h => h.id === target.id);
  if (target && (hit.missing || !hit.prototypeIdentity)) throw Error('Prototype did not enter actual draw: ' + target.id);
  const rect = hit ? {
    x: Math.max(0, Math.floor(hit.bx - 140)), y: Math.max(0, Math.floor(hit.by - 55)),
    w: 0, h: 0,
  } : { x: 0, y: 0, w: c.width, h: c.height };
  if (hit) { rect.w = Math.min(c.width - rect.x, Math.ceil(hit.width + 280)); rect.h = Math.min(c.height - rect.y, Math.ceil(hit.height + 190)); }
  const crop = document.createElement('canvas'); crop.width = rect.w; crop.height = rect.h;
  crop.getContext('2d').drawImage(c, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
  const snapshot = () => g.getImageData(0, 0, c.width, c.height).data;
  const diff = (a, b, r = rect) => {
    let changed = 0, total = 0;
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
      const i = (y * c.width + x) * 4;
      const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      if (d > 3) changed++; total += d;
    }
    return { changedPixels: changed, absoluteRGBDelta: total };
  };
  const lighting = mode === 'night' ? { composition: { ...window.__t629 } } : null;
  let shadow = null;
  if (target && mode === 'night') {
    const originalNight = proto.night, empty = document.createElement('canvas'); empty.width = proto.w; empty.height = proto.h;
    const eraseOwn = Object.prototype.hasOwnProperty.call(window, '__nightOccNoErase629'), eraseValue = window.__nightOccNoErase629;
    try {
      proto.night = empty; GV.forceDraw(); const normalOff = snapshot();
      lighting.targetLampDelta = diff(frame.data, normalOff);
      window.__nightOccNoErase629 = true; GV.forceDraw(); const noEraseOff = snapshot();
      proto.night = originalNight; GV.forceDraw(); const noEraseOn = snapshot();
      let visible = 0, blocked = 0, candidate = 0;
      for (let y = rect.y; y < rect.y + rect.h; y++) for (let x = rect.x; x < rect.x + rect.w; x++) {
        const i = (y * c.width + x) * 4;
        let normal = 0, unmasked = 0;
        for (let ch = 0; ch < 3; ch++) { normal += Math.abs(frame.data[i + ch] - normalOff[i + ch]); unmasked += Math.abs(noEraseOn[i + ch] - noEraseOff[i + ch]); }
        if (unmasked > 9) { candidate++; if (normal <= 3) blocked++; if (normal > 9) visible++; }
      }
      lighting.targetOcclusion = { candidateLightPixels: candidate, visibleLightPixels: visible, fullyBlockedLightPixels: blocked,
        method: 'Four renders: prototype night on/off × standard depth erasure on/off; same scene and phase' };
      if (arg.occlusion) lighting.noEraseImage = c.toDataURL();
    } finally { proto.night = originalNight; if (eraseOwn) window.__nightOccNoErase629 = eraseValue; else delete window.__nightOccNoErase629; GV.forceDraw(); }
  }
  if (target && mode === 'day') {
    const own = Object.prototype.hasOwnProperty.call(window, '__noGroundShade572'), old = window.__noGroundShade572;
    try { window.__noGroundShade572 = true; GV.forceDraw(); shadow = { ...diff(frame.data, snapshot()), scope: 'T572 contact shadows in the target-and-neighbor crop; not a prototype-exclusive performance claim' }; }
    finally { if (own) window.__noGroundShade572 = old; else delete window.__noGroundShade572; GV.forceDraw(); }
  }
  const visibleExisting = caps.filter(a => !Q.targets.some(t => a.bd.k === t.k && a.o.x === t.x && a.o.y === t.y)
    && a.bx + a.s.w * a.z > rect.x && a.bx < rect.x + rect.w && a.by + a.s.h * a.z > rect.y && a.by < rect.y + rect.h)
    .map(a => ({ k: a.bd.k, x: a.o.x, y: a.o.y, depth: a.o.dep, sprite: a.s.__britishPrototype || null }));
  const uniqueExisting = [...new Map(visibleExisting.map(o => [o.x + ',' + o.y, o])).values()];
  const existingBenchmarks = Q.benchmarks.map(b => ({ ...b, captured: caps.some(a => a.bd.k === b.k && a.o.x === b.x && a.o.y === b.y && !a.s.__britishPrototype) }));
  Q.captures.push({ id: arg.id || 'town', z, mode, canvas: crop });
  return { full, crop: crop.toDataURL(), canvas: { w: c.width, h: c.height }, rect, mode, z, hits,
    daylight: GV.daylightDbg(), existingNeighborRoots: uniqueExisting, benchmarkDraw: existingBenchmarks,
    targetLighting: lighting, sceneContactShadows: shadow, drawCount: caps.length, phase: ph };
}

function restoreEverything() {
  const q = window.__britishQA;
  if (!q) return { noFixture: true };
  const B = GV.art574.SPR().bld;
  for (const [key, original] of q.originals) B[key] = original;
  const identicalReferences = [...q.originals].every(([key, original]) => B[key] === original);
  for (const [key, own, value] of q.valves) { if (own) window[key] = value; else delete window[key]; }
  GV.nightPowerTest698(null);
  return {
    restoredSpriteReferences: identicalReferences, restoredKeyCount: q.originals.size,
    sameCatalogKeys: JSON.stringify(Object.keys(B).sort()) === JSON.stringify(q.baselineKeys),
    fingerprint: GV.fp536(),
    storageUnchanged: JSON.stringify(q.storage()) === q.baselineStorage,
    storageKeys: Object.keys(q.storage()),
    provisionalIdsInStorage: /UKP0[123]/.test(JSON.stringify(q.storage())),
  };
}

(async () => {
  check('exact unchanged main product source', report.sourceSHA256 === SOURCE_DIGEST && html.length === 9627011);
  if (report.failures.length) throw Error('Unexpected product source; stop rather than silently changing the pinned base');
  const wallStart = Date.now();
  const session = await withGame({ port: 8199, timeout: 400, fresh: true,
    preScript: "localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');", log: console.log }, async ({ cdp }) => {
    const ev = async expression => {
      const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    const call = (fn, ...args) => ev('(' + fn.toString() + ')(' + args.map(x => JSON.stringify(x)).join(',') + ')');
    try {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
      report.browser = await cdp.send('Browser.getVersion');
      report.boot = await ev('({ready:!!window.__bootDone453,sequence:window.__bootSeq453,batches:window.__t574,slot:localStorage.getItem("glimmerville.v1.slot"),title:document.title,version:GV.ver(),pageElapsedMs:performance.now()})');
      report.boot.wallToReadyMs = Date.now() - wallStart;
      check('boot ready and isolated slot 3', report.boot.ready && report.boot.slot === '3', report.boot);
      check('base bake batches had no errors', !(report.boot.batches?.err || []).length, report.boot.batches?.err);
      report.fixtureResult = await call(prepareFixture, TARGETS, BENCHMARKS);
      const baselineFP = report.fixtureResult.baselineFingerprint; delete report.fixtureResult.baselineFingerprint;
      report.baselineFingerprintSHA256 = sha(JSON.stringify(baselineFP));
      check('intact existing town context retained', report.fixtureResult.unchangedExistingRoots > 100, report.fixtureResult);
      check('temporary carrier types occur only at intended prototype roots', report.fixtureResult.untargetedCarrierRoots.length === 0, report.fixtureResult.untargetedCarrierRoots);
      for (const t of report.fixtureResult.targetTiles) {
        check(t.id + ' existing carrier footprint roots and refs', t.root?.k === t.k && t.root.sz === t.sz && t.refs.every((b, i) => i === 0 ? b.k === t.k && !b.ref : b.k === t.k && b.ref?.[0] === t.x && b.ref?.[1] === t.y), t);
      }
      // Injection occurs only after full boot. Product source itself is not patched.
      report.rendererEvaluation = await ev(`(()=>{const q=window.__britishQA,old=Math.random;let calls=0;Math.random=function(){calls++;return old.apply(this,arguments);};const t=performance.now();try{(0,eval)(${JSON.stringify(art)});}finally{Math.random=old;}return {ms:performance.now()-t,mathRandomCalls:calls,worldUnchanged:q.world()===q.baselineWorld,storageUnchanged:JSON.stringify(q.storage())===q.baselineStorage};})()`);
      check('renderer evaluation is pure', report.rendererEvaluation.mathRandomCalls === 0 && report.rendererEvaluation.worldUnchanged && report.rendererEvaluation.storageUnchanged, report.rendererEvaluation);
      report.build = await call(buildAndInstall);
      check('prototype generation preserves world saves and existing sprites', report.build.pure.worldUnchanged && report.build.pure.storageUnchanged && report.build.pure.spriteFingerprintUnchanged && report.build.pure.mathRandomCalls === 0, report.build.pure);
      check('no new catalog sprite keys', report.build.sameCatalogKeys);
      check('fresh deterministic rebuild is byte-identical for all day and night pixels', report.build.deterministicRebuild);
      check('prototype escape valve makes all builds no-ops', report.build.escapeValveNoop);
      for (const m of report.build.metrics) {
        const t = TARGETS.find(t => t.id === m.id);
        png('assets/' + m.id + '-day.png', m.day, { kind: 'direct sprite', id: m.id, mode: 'day' });
        png('assets/' + m.id + '-night-layer.png', m.night, { kind: 'direct night layer', id: m.id, mode: 'night' });
        delete m.day; delete m.night;
        check(m.id + ' exact dimensions anchor and footprint', ['w', 'h', 'ax', 'ay', 'sz'].every(k => m[k] === t[k]) && m.canvasDimensions.join(',') === [t.w, t.h, t.w, t.h].join(','), m);
        check(m.id + ' solid image border zero', m.solid > 0 && m.edge === 0, { edge: m.edge });
        check(m.id + ' every night-alpha pixel supported by day alpha', m.nightPixels > 0 && m.unsupportedNightAny === 0 && m.unsupportedNight40 === 0, m);
        check(m.id + ' no day alpha outside projected lot prism', m.outsideLotAny === 0 && m.outsideLotSolid === 0, m);
      }
      const outputShot = async (arg, stem, destination) => {
        const r = await call(captureView, arg);
        png('full/' + stem + '.png', r.full, { kind: 'actual game canvas', ...arg });
        png('crops/' + stem + '.png', r.crop, { kind: 'unaltered game canvas crop', ...arg, rect: r.rect });
        delete r.full; delete r.crop;
        if (r.targetLighting?.noEraseImage) { png('guards/' + stem + '-no-erasure.png', r.targetLighting.noEraseImage, { kind: 'actual scene diagnostic, depth erasure disabled', ...arg }); delete r.targetLighting.noEraseImage; }
        const screen = await cdp.send('Page.captureScreenshot', { format: 'png' });
        png('browser/' + stem + '.png', 'data:image/png;base64,' + screen.data, { kind: 'Chromium viewport screenshot', ...arg });
        check(stem + ' correct daylight phase', arg.mode === 'day' ? r.daylight.b > .95 : r.daylight.b < .45, r.daylight);
        if (arg.id) {
          const h = r.hits.find(h => h.id === arg.id);
          check(stem + ' exact prototype sprite reached actual draw within frame', h.prototypeIdentity && h.withinCanvas, h);
          check(stem + ' existing neighboring buildings in crop', r.existingNeighborRoots.length >= 2, r.existingNeighborRoots);
          if (arg.mode === 'night') check(stem + ' prototype own lamps affect actual scene', r.targetLighting.targetLampDelta.changedPixels > 0, r.targetLighting);
          else check(stem + ' contact shadows active in actual context', r.sceneContactShadows.changedPixels > 0, r.sceneContactShadows);
        } else {
          check(stem + ' all three prototypes in actual town draw', r.hits.every(h => h.prototypeIdentity && h.withinCanvas), r.hits);
          check(stem + ' unchanged benchmark buildings in town draw', r.benchmarkDraw.filter(b => b.captured).length >= 2, r.benchmarkDraw);
        }
        destination.push({ stem, ...r }); save(); return r;
      };
      for (const t of TARGETS) for (const z of [2, 1.2]) for (const mode of ['day', 'night']) {
        await outputShot({ id: t.id, z, mode }, t.id + '-z' + String(z).replace('.', 'p') + '-' + mode, report.samples);
      }
      for (const mode of ['day', 'night']) await outputShot({ z: 1.2, mode }, 'town-z1p2-' + mode, report.town);
      // Deliberately overlapping elevations, disjoint ground lots: the existing
      // pub in front of the civic prototype is an actual game occluder.
      report.occluder = await ev('(()=>{GV.art574.clear574(10,23,2,2);const p=GV.art574.plant574([{k:197,x:10,y:23,sz:2,v:0,lv:1}]);GV.testRebake592();return p;})()');
      const occ = [];
      const o = await outputShot({ id: 'UKP03', z: 2, mode: 'night', occlusion: true }, 'UKP03-occlusion-night', occ);
      report.occlusion = occ[0];
      check('civic target lights really hidden by foreground geometry', o.targetLighting.targetOcclusion.fullyBlockedLightPixels > 0 && o.targetLighting.targetOcclusion.visibleLightPixels > 0, o.targetLighting.targetOcclusion);
      report.originalNightCompositorGuard = await ev('GV.nightOccSelftest629()');
      check('existing night compositor selftest', report.originalNightCompositorGuard.ok, report.originalNightCompositorGuard);
      report.consoleErrors = cdp.errors; report.benignPwaErrors = cdp.benign;
      check('console and uncaught errors zero', cdp.errors.length === 0, cdp.errors);
      check('all requested zoom and phase samples captured', report.samples.length === 12 && report.town.length === 2);
      return true;
    } finally {
      try {
        report.restore = await call(restoreEverything);
        if (report.restore.fingerprint) {
          report.restore.fingerprintSHA256 = sha(JSON.stringify(report.restore.fingerprint)); delete report.restore.fingerprint;
          check('all existing sprite fingerprints identical after restore', report.restore.fingerprintSHA256 === report.baselineFingerprintSHA256, report.restore.fingerprintSHA256);
          check('every substituted reference and key restored', report.restore.restoredSpriteReferences && report.restore.sameCatalogKeys, report.restore);
          check('persistent storage unchanged and provisional IDs absent', report.restore.storageUnchanged && !report.restore.provisionalIdsInStorage, report.restore);
        }
      } catch (e) { check('restore completed', false, String(e.stack || e)); }
      save();
    }
  });
  report.session = { ok: session.ok, fails: session.fails, seconds: session.seconds, chromeMs: session.chromeMs };
  check('remote browser session completed', session.ok && session.result, report.session);
  check('source file still unchanged on disk', sha(fs.readFileSync(path.join(__dirname, 'index.html'))) === SOURCE_DIGEST);
  report.ok = report.failures.length === 0; save();
  console.log(JSON.stringify({ ok: report.ok, checks: report.checks.length, failures: report.failures, buildMs: report.build?.buildMs, samples: report.samples.length, townViews: report.town.length, session: report.session }, null, 2));
  process.exit(report.ok ? 0 : 1);
})().catch(e => { report.failures.push(String(e.stack || e)); report.ok = false; save(); console.error(e); process.exit(1); });

'use strict';
/* T782 B6／B8：用 node:vm 跑「執行期那份」road-delivery053-runtime.js（內嵌進 index.html 的就是這份），與純核心
 * road-delivery053.js 逐案比對：相同的不合法輸入理由、相同的 BFS 路徑、相同的狀態機。
 *  - 原生依賴（idx、inMap、DIRV、LOGISTICS_META485、sanRoadSeeds445）直接從 index.html 原文取出來在 vm 裡跑，不手寫替身；
 *  - 期望值由測試自己的世界描述算（前接用測試獨立寫的規則，並先核對它與原生 sanRoadSeeds445 逐格相同）；
 *  - load／newWorld 是記錄呼叫的替身，window／document 是最小替身；Math.random、Date、performance、
 *    localStorage／sessionStorage／indexedDB 都換成會記帳的陷阱，整輪結束必須一次都沒碰到。
 * 負控制（T782 B8）：MUTANTS 每一條改壞執行期原文一處，重跑整輪，第一個紅燈必須落在目標項。
 * 用法：node road-delivery053-runtime.test.js
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const ROOT = __dirname;
const RUNTIME_SRC = fs.readFileSync(path.join(ROOT, 'road-delivery053-runtime.js'), 'utf8');
const RAIL_RUNTIME_SRC = fs.readFileSync(path.join(ROOT, 'rail-freight054-runtime.js'), 'utf8');
const CORE_SRC = fs.readFileSync(path.join(ROOT, 'road-delivery053.js'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const core = require('./road-delivery053.js');
const BEGIN = '/* LAB-03 ROAD CORE 053 BEGIN */', END = '/* LAB-03 ROAD CORE 053 END */';
const UNSAVED = '未保存：重新整理或讀檔就會消失';

const J = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const caught = (fn) => { try { fn(); } catch (e) { return e; } return null; };
const lcg = (seed) => () => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed / 4294967296; };
const DIR4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];

/* ---------- 原生原文（從 index.html 取，每段必須剛好出現一次） ---------- */
function nativeOnce(re, label) {
  const m = HTML.match(new RegExp(re.source, 'gm'));
  assert.ok(m && m.length === 1, 'native ' + label + ' must appear exactly once in index.html');
  return m[0];
}
const NATIVE_META_SRC = nativeOnce(/^const LOGISTICS_META485=\{\n[\s\S]*?\n\};$/, 'LOGISTICS_META485');
const NATIVE_SRC = [
  nativeOnce(/^const idx=\(x,y\)=>y\*N\+x;$/, 'idx'),
  nativeOnce(/^const inMap=\(x,y\)=>x>=0&&y>=0&&x<N&&y<N;$/, 'inMap'),
  nativeOnce(/^const DIRV=\[\[0,-1\],\[1,0\],\[0,1\],\[-1,0\]\];$/, 'DIRV'),
  NATIVE_META_SRC,
  nativeOnce(/^function sanRoadSeeds445\(rootIdx\)\{\n[\s\S]*?\n\}$/, 'sanRoadSeeds445')
].join('\n');
const META = J(vm.runInNewContext(NATIVE_META_SRC + '\nLOGISTICS_META485;'));
assert.deepEqual(Object.keys(META), ['165', '166', '167', '168', '169', '170', '171', '172', '173', '174'], 'native logistics kinds are 165–174');

/* ---------- 最小 DOM 替身 ---------- */
class Node {
  constructor(tag) { this.tagName = String(tag).toUpperCase(); this.children = []; this.style = {}; this.attrs = {}; this.handlers = new Map(); this.textContent = ''; this.id = ''; this.parentNode = null; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  appendChild(n) { if (n.parentNode) n.parentNode.removeChild(n); n.parentNode = this; this.children.push(n); return n; }
  removeChild(n) { const i = this.children.indexOf(n); if (i < 0) throw new Error('not a child'); this.children.splice(i, 1); n.parentNode = null; return n; }
  addEventListener(type, fn) { if (!this.handlers.has(type)) this.handlers.set(type, []); this.handlers.get(type).push(fn); }
}
const findId = (node, id) => (node.id === id ? node : node.children.reduce((r, c) => r || findId(c, id), null));
const textOf = (node) => node.textContent + node.children.map(textOf).join('');
const click = (node) => { assert.ok(node, 'button exists'); (node.handlers.get('click') || []).forEach((f) => f({ type: 'click' })); };
const rectOf = (css) => {
  const px = (k) => { const m = new RegExp('(?:^|;)' + k + ':(\\d+)px').exec(css); assert.ok(m, 'panel css has ' + k); return +m[1]; };
  return { left: px('left'), top: px('top'), width: px('width'), height: px('height') };
};
const overlap = (a, b) => a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;

/* ---------- 世界 ---------- */
// spec：{ roads:[[x,y]], buildings:[{x,y,k,sz}] }；建築根格 {k,sz,...}、其餘佔地格 {k,ref:[x,y]}，與原生 placeLogisticsMulti485 同形。
function buildTiles(N, spec) {
  const tiles = [];
  for (let i = 0; i < N * N; i++) tiles.push({ t: 2 });
  for (const [x, y] of spec.roads || []) tiles[y * N + x].road = 1;
  for (const b of spec.buildings || []) for (let fy = 0; fy < b.sz; fy++) for (let fx = 0; fx < b.sz; fx++) {
    tiles[(b.y + fy) * N + b.x + fx].bld = fx === 0 && fy === 0 ? { k: b.k, lv: 1, v: 0, age: 0, pw: true, h: 1, sz: b.sz } : { k: b.k, ref: [b.x, b.y] };
  }
  return tiles;
}
// 測試自己的期望值：前接＝佔地逐列、每格上右下左、去重（原生規則的獨立寫法），物流＝k 在原生表裡。
function seedsOf(N, isRoad, rx, ry, size) {
  const out = [];
  for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) for (const [dx, dy] of DIR4) {
    const nx = rx + fx + dx, ny = ry + fy + dy;
    if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
    const j = ny * N + nx;
    if (isRoad(j) && !out.includes(j)) out.push(j);
  }
  return out;
}
function oracle(N, spec) {
  const road = new Uint8Array(N * N);
  for (const [x, y] of spec.roads || []) road[y * N + x] = 1;
  const roots = new Map((spec.buildings || []).map((b) => [b.y * N + b.x, b]));
  const isRoad = (j) => road[j] === 1;
  return {
    road,
    isLogisticsRoot: (i) => { const b = roots.get(i); return !!(b && Object.prototype.hasOwnProperty.call(META, b.k)); },
    frontage: (i) => { const b = roots.get(i); return b ? seedsOf(N, isRoad, b.x, b.y, b.sz) : []; }
  };
}
function expectBetween(N, orc, o, d, batch) {
  const v = J(core.validateBatch(batch));
  if (!v.ok) return v;
  return J(core.planBetween({ roads: orc.road, w: N, h: N, origin: o, destination: d, isLogisticsRoot: orc.isLogisticsRoot,
    frontage: orc.frontage, maxSteps: batch.maxSteps }));
}

// 手算的城市（16×16）：A＝配送中心 k167（3×3）、B＝冷藏 k168（2×2），兩棟都貼 y=4 的路；C＝穀倉 k169 沒有前接；
// D＝鋼材場 k172 只貼另一段不連通的路；H＝商業 k2（1×1，不是物流）也貼 y=4 的路。
const HAND_N = 16;
const HAND = {
  roads: [[1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [12, 8], [13, 8]],
  buildings: [{ x: 1, y: 1, k: 167, sz: 3 }, { x: 8, y: 2, k: 168, sz: 2 }, { x: 5, y: 8, k: 169, sz: 2 }, { x: 12, y: 6, k: 172, sz: 2 }, { x: 5, y: 3, k: 2, sz: 1 }]
};
const at = (x, y) => y * HAND_N + x;
const A = at(1, 1), B = at(8, 2), C = at(5, 8), D = at(12, 6), H = at(5, 3);
const HAND_PATH = [67, 68, 69, 70, 71, 72];   // 手算：A 的前接 [65,66,67] → B 的前接 [72,73]，沿 y=4 走 5 步

/* ---------- vm 環境 ---------- */
const THROWN = new Error('native exact throw');
const TRAP_SRC = [
  "Math.random = function () { __trap('Math.random'); return 0.5; };",
  "(function () { const RealDate = Date; const Trapped = function () { __trap('Date'); return new RealDate(0); };",
  "  Trapped.now = function () { __trap('Date.now'); return 0; }; globalThis.Date = Trapped; })();",
  "globalThis.performance = { now: function () { __trap('performance.now'); return 0; } };"
].join('\n');
let SUITE_TRAPS = [];
function makeEnv(source, opts = {}) {
  const listeners = [];
  const nativeCalls = [];
  const body = new Node('body');
  const window = {
    GV: {},
    addEventListener(type, fn) { listeners.push([type, fn]); },
    removeEventListener(type, fn) { const i = listeners.findIndex(([t, f]) => t === type && f === fn); if (i >= 0) listeners.splice(i, 1); }
  };
  if (opts.valve) window.__noRoadDelivery053 = true;
  const ctx = { window, document: { body, createElement: (tag) => new Node(tag) }, tiles: [], N: 1, GAME_VER: 'test-ver', GAME_ANCHOR: 'test-anchor',
    __trap: (what) => SUITE_TRAPS.push(what) };
  const storage = { getItem() { SUITE_TRAPS.push('storage.getItem'); return null; }, setItem() { SUITE_TRAPS.push('storage.setItem'); }, removeItem() { SUITE_TRAPS.push('storage.removeItem'); } };
  for (const host of [ctx, window]) for (const name of ['localStorage', 'sessionStorage', 'indexedDB']) {
    Object.defineProperty(host, name, { configurable: true, get() { SUITE_TRAPS.push(name); return storage; } });
  }
  const snap = () => (window.GV.roadDelivery053 ? J(window.GV.roadDelivery053.snapshot()) : null);
  const stubLoad = function (...args) { nativeCalls.push({ fn: 'load', self: this, args, snapshot: snap() }); if (args[0] === 'throw') throw THROWN; return 'native-load:' + args[0]; };
  const stubWorld = function (...args) { nativeCalls.push({ fn: 'newWorld', self: this, args, snapshot: snap() }); if (args[0] === 'throw') throw THROWN; return 'native-world:' + args[0]; };
  ctx.load = stubLoad;
  ctx.newWorld = stubWorld;
  vm.createContext(ctx);
  vm.runInContext(TRAP_SRC, ctx);
  vm.runInContext(NATIVE_SRC, ctx);
  vm.runInContext(source, ctx, { timeout: 5000 });
  if (opts.withRail) vm.runInContext(RAIL_RUNTIME_SRC, ctx, { timeout: 5000 });   // index.html 的順序：053 之後才是 054
  return {
    ctx, window, body, listeners, nativeCalls, stubLoad, stubWorld, api: window.GV.roadDelivery053,
    setWorld(N, spec) { ctx.N = N; ctx.tiles = buildTiles(N, spec); },
    native: (expr) => J(vm.runInContext(expr, ctx)),
    pagehide: () => listeners.filter(([t]) => t === 'pagehide').forEach(([, f]) => f({ type: 'pagehide' }))
  };
}
const handEnv = (source, opts) => { const env = makeEnv(source, opts); env.setWorld(HAND_N, HAND); return env; };
const batchOf = (id, qty, extra) => Object.assign({ batchId: id, qty, commodityId: 'food' }, extra || {});
const CORE_FIELDS = ['sessionId', 'batchId', 'commodityId', 'qty', 'status', 'cursor', 'pathLength', 'steps', 'delivered', 'deliveredAt', 'cancelledReason'];
const coreFields = (s) => Object.fromEntries(CORE_FIELDS.map((k) => [k, s[k]]));

/* ---------- 檢查項 ---------- */
const CHECKS = [
  ['R053-01', '執行期內嵌的核心段落與 road-delivery053.js 逐字相同', (source) => {
    const section = (s, label) => {
      assert.equal(s.split(BEGIN).length, 2, 'R053-01 one BEGIN in ' + label);
      assert.equal(s.split(END).length, 2, 'R053-01 one END in ' + label);
      return s.slice(s.indexOf(BEGIN), s.indexOf(END) + END.length);
    };
    assert.equal(section(source, 'runtime'), section(CORE_SRC, 'core'), 'R053-01 runtime embeds the core section verbatim');
  }],
  ['R053-02', '閥門沒開：裝上完整 API，load／newWorld 換成 053 的包裝，掛一個 pagehide，不建 DOM', (source) => {
    const env = makeEnv(source);
    assert.deepEqual(Object.keys(env.api).sort(), ['cancel', 'disable', 'end', 'open', 'plan', 'provenance', 'refresh', 'snapshot', 'start', 'startBetween', 'step'], 'R053-02 api names');
    assert.ok(Object.isFrozen(env.api) && Object.isFrozen(env.api.provenance), 'R053-02 api frozen');
    assert.deepEqual(J(env.api.provenance), { installed: true, module: 'road-delivery053', lab: 'LAB-03', card: 'T782', isolation: 'shadow-only', persisted: false }, 'R053-02 provenance');
    assert.ok(env.ctx.load !== env.stubLoad && env.ctx.load.name === 'load053', 'R053-02 load wrapped');
    assert.ok(env.ctx.newWorld !== env.stubWorld && env.ctx.newWorld.name === 'newWorld053', 'R053-02 newWorld wrapped');
    assert.deepEqual(env.listeners.map(([t, f]) => t + ':' + f.name), ['pagehide:pagehide053'], 'R053-02 one pagehide listener');
    assert.deepEqual(Object.keys(env.window.GV), ['roadDelivery053'], 'R053-02 only GV.roadDelivery053');
    assert.equal(env.body.children.length, 0, 'R053-02 no DOM at install');
  }],
  ['R053-03', 'plan() 與 core.planDelivery 逐案相同（隨機城市、不合法端點與 maxSteps、沒有城市）', (source) => {
    const env = makeEnv(source), rnd = lcg(53), reasons = new Set();
    let ok = 0;
    for (let world = 0; world < 60; world++) {
      const N = 4 + Math.floor(rnd() * 10), roads = [];
      for (let i = 0; i < N * N; i++) if (rnd() < 0.5) roads.push([i % N, Math.floor(i / N)]);
      env.setWorld(N, { roads });
      const grid = oracle(N, { roads }).road;
      const odd = [-1, N * N, 2.5, '3', null, undefined, NaN];
      for (let k = 0; k < 25; k++) {
        const o = k === 23 ? odd[world % odd.length] : Math.floor(rnd() * N * N), d = k === 24 ? odd[(world + 3) % odd.length] : Math.floor(rnd() * N * N);
        const ms = [undefined, undefined, undefined, Math.floor(rnd() * 8), null, -1, 2.5, '3', Infinity][k % 9];
        const got = J(env.api.plan(o, d, ms)), want = J(core.planDelivery({ roads: grid, w: N, h: N, origin: o, destination: d, maxSteps: ms }));
        assert.deepEqual(got, want, 'R053-03 plan ' + JSON.stringify({ world, o, d, ms: String(ms) }));
        if (got.ok) ok++;
        reasons.add(want.reason + (want.detail ? ':' + want.detail : ''));
      }
    }
    assert.ok(ok > 40, 'R053-03 coverage ok=' + ok);
    for (const r of ['null', 'origin-not-road', 'destination-not-road', 'unreachable', 'too-far', 'bad-input:maxSteps', 'bad-input:range', 'bad-input:endpoints']) {
      assert.ok(reasons.has(r), 'R053-03 coverage reason ' + r + ' in ' + [...reasons].join(','));
    }
    env.ctx.tiles = null;
    assert.deepEqual(J(env.api.plan(0, 1)), J(core.planDelivery({ roads: null, w: env.ctx.N, h: env.ctx.N, origin: 0, destination: 1 })), 'R053-03 no city');
  }],
  ['R053-04', 'startBetween() 與核心（validateBatch＋planBetween）逐案相同（隨機城市、物流與非物流建築）', (source) => {
    const env = makeEnv(source), rnd = lcg(782), kinds = Object.keys(META).map(Number);
    let ok = 0, reasons = new Set();
    for (let world = 0; world < 70; world++) {
      const N = 9 + Math.floor(rnd() * 9), owner = new Int32Array(N * N).fill(-1), buildings = [];
      for (let k = 0; k < 6; k++) {
        const logistics = rnd() < 0.75, kk = logistics ? kinds[Math.floor(rnd() * kinds.length)] : [1, 2, 3][k % 3];
        const sz = logistics ? META[kk].size : 1 + (k % 2), x = Math.floor(rnd() * (N - sz + 1)), y = Math.floor(rnd() * (N - sz + 1));
        let free = true;
        for (let fy = 0; fy < sz; fy++) for (let fx = 0; fx < sz; fx++) if (owner[(y + fy) * N + x + fx] >= 0) free = false;
        if (!free) continue;
        for (let fy = 0; fy < sz; fy++) for (let fx = 0; fx < sz; fx++) owner[(y + fy) * N + x + fx] = buildings.length;
        buildings.push({ x, y, k: kk, sz });
      }
      const roads = [], density = 0.08 + rnd() * 0.5;
      for (let i = 0; i < N * N; i++) if (owner[i] < 0 && rnd() < density) roads.push([i % N, Math.floor(i / N)]);
      const spec = { roads, buildings }, orc = oracle(N, spec);
      env.setWorld(N, spec);
      const ends = buildings.map((b) => b.y * N + b.x).concat(roads.length ? [roads[0][1] * N + roads[0][0]] : []);
      for (const b of buildings) assert.deepEqual(env.native('sanRoadSeeds445(' + (b.y * N + b.x) + ')'), orc.frontage(b.y * N + b.x), 'R053-04 oracle equals native sanRoadSeeds445');
      for (const o of ends) for (const d of ends) {
        if (o === d) continue;
        const batch = batchOf('w' + world + '-' + o + '-' + d, 1 + ((o + d) % 9), (o + d) % 5 === 0 ? { maxSteps: (o + d) % 7 } : null);
        if ((o + d) % 3 === 1) delete batch.commodityId;
        if ((o + d) % 3 === 2) batch.commodityId = null;
        const want = expectBetween(N, orc, o, d, batch), got = J(env.api.startBetween(o, d, batch));
        reasons.add(want.reason);
        if (want.ok) {
          assert.ok(/^lab053-\d+$/.test(got.sessionId), 'R053-04 session id ' + got.sessionId);
          delete got.sessionId;
          const s = J(env.api.snapshot());
          assert.deepEqual([s.status, s.qty, s.batchId, s.mode, s.originRoot, s.destinationRoot, s.path], [want.path.length === 1 ? 'DELIVERED' : 'PENDING', batch.qty, batch.batchId, 'between', o, d, want.path], 'R053-04 task ' + world);
          ok++;
        }
        assert.deepEqual(got, want, 'R053-04 startBetween ' + JSON.stringify({ world, o, d }));
        env.api.end();
      }
    }
    assert.ok(ok > 80, 'R053-04 coverage ok=' + ok);
    for (const r of ['not-logistics', 'no-frontage', 'unreachable', 'too-far', null]) assert.ok(reasons.has(r), 'R053-04 coverage reason ' + r);
  }],
  ['R053-05', '手算城市：路徑頭尾貼兩棟的前接；not-logistics／no-frontage／unreachable／too-far／bad-input 各自分開', (source) => {
    const env = handEnv(source), api = env.api, b = batchOf('hand', 5);
    const r = (o, d, extra) => { const x = J(api.startBetween(o, d, Object.assign({}, b, extra || {}))); api.end(); return x; };
    const fail = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
    assert.deepEqual(r(A, C), fail('no-frontage', { side: 'destination' }), 'R053-05 no-frontage dest');
    assert.deepEqual(r(C, A), fail('no-frontage', { side: 'origin' }), 'R053-05 no-frontage origin');
    assert.deepEqual(r(A, D), fail('unreachable'), 'R053-05 unreachable');
    assert.deepEqual(r(A, H), fail('not-logistics', { side: 'destination' }), 'R053-05 non-logistics building');
    assert.deepEqual(r(H, A), fail('not-logistics', { side: 'origin' }), 'R053-05 non-logistics origin');
    assert.deepEqual(r(at(2, 2), B), fail('not-logistics', { side: 'origin' }), 'R053-05 footprint ref tile');
    assert.deepEqual(r(at(6, 4), B), fail('not-logistics', { side: 'origin' }), 'R053-05 road tile');
    assert.deepEqual(r(at(0, 15), B), fail('not-logistics', { side: 'origin' }), 'R053-05 empty land');
    assert.deepEqual(r('17', B), fail('bad-input', { detail: 'endpoints' }), 'R053-05 endpoints');
    assert.deepEqual(r(A, 256), fail('bad-input', { detail: 'range' }), 'R053-05 range');
    assert.deepEqual(r(A, B, { maxSteps: 4 }), fail('too-far', { steps: 5, limit: 4 }), 'R053-05 too-far');
    assert.deepEqual(J(api.snapshot()), { ok: false, reason: 'no-task', active: false, disabled: false }, 'R053-05 failures create no task');
    const okr = J(api.startBetween(A, B, b));
    assert.deepEqual(okr, { ok: true, path: HAND_PATH, steps: 5, reason: null, originRoot: A, destinationRoot: B,
      originFrontage: [65, 66, 67], destinationFrontage: [72, 73], sessionId: 'lab053-1' }, 'R053-05 hand path');
    const s = J(api.snapshot());
    assert.deepEqual([s.status, s.qty, s.cursor, s.pathLength, s.path], ['PENDING', 5, 0, 6, HAND_PATH], 'R053-05 task created');
  }],
  ['R053-06', '不合法批次：start／startBetween 的理由與 core.validateBatch 完全相同（bad-input），不建任務、不改值', (source) => {
    const env = handEnv(source), api = env.api;
    const bads = [{ batchId: 'b', qty: 0 }, { batchId: 'b', qty: -3 }, { batchId: 'b', qty: 2.5 }, { batchId: 'b', qty: '5' }, { batchId: 'b', qty: null },
      { batchId: 'b' }, { batchId: 'b', qty: NaN }, { batchId: 'b', qty: Infinity }, { batchId: 'b', qty: 2 ** 53 }, { batchId: 'b', qty: true },
      { batchId: '', qty: 1 }, { batchId: 7, qty: 1 }, { qty: 1 }, { batchId: 'b', qty: 1, commodityId: 5 }, { batchId: 'b', qty: 1, commodityId: '' },
      null, undefined, 'b', 5, [], true];
    for (const bad of bads) {
      const want = J(core.validateBatch(bad)), label = JSON.stringify(bad === undefined ? 'undefined' : bad);
      assert.equal(want.reason, 'bad-input', 'R053-06 core rejects ' + label);
      assert.deepEqual(J(api.start(65, 72, bad)), want, 'R053-06 start ' + label);
      assert.deepEqual(J(api.startBetween(A, B, bad)), want, 'R053-06 startBetween ' + label);
      assert.deepEqual(J(api.snapshot()), { ok: false, reason: 'no-task', active: false, disabled: false }, 'R053-06 no task after ' + label);
    }
    for (const maxSteps of [null, -1, 2.5, '3']) {
      const batch = batchOf('m', 1, { maxSteps });
      const want = J(core.planDelivery({ roads: oracle(HAND_N, HAND).road, w: HAND_N, h: HAND_N, origin: 65, destination: 72, maxSteps }));
      assert.deepEqual([want.reason, want.detail], ['bad-input', 'maxSteps'], 'R053-06 core maxSteps ' + String(maxSteps));
      assert.deepEqual(J(api.start(65, 72, batch)), want, 'R053-06 start maxSteps ' + String(maxSteps));
      assert.deepEqual(J(api.startBetween(A, B, batch)), expectBetween(HAND_N, oracle(HAND_N, HAND), A, B, batch), 'R053-06 startBetween maxSteps ' + String(maxSteps));
    }
    assert.deepEqual(J(api.snapshot()), { ok: false, reason: 'no-task', active: false, disabled: false }, 'R053-06 still no task');
  }],
  ['R053-07', '任務進行中再開始 → busy，不換掉舊任務；送達或取消之後才可以再開', (source) => {
    const env = handEnv(source), api = env.api;
    assert.equal(api.startBetween(A, B, batchOf('first', 4)).ok, true, 'R053-07 first start');
    const s0 = J(api.snapshot());
    const busy = { ok: false, path: [], steps: -1, reason: 'busy', sessionId: s0.sessionId, batchId: 'first', status: 'PENDING' };
    assert.deepEqual(J(api.startBetween(A, B, batchOf('second', 9))), busy, 'R053-07 busy startBetween PENDING');
    assert.deepEqual(J(api.start(65, 72, batchOf('second', 9))), busy, 'R053-07 busy start PENDING');
    assert.deepEqual(J(api.snapshot()), s0, 'R053-07 running task untouched');
    api.step();
    const s1 = J(api.snapshot());
    assert.equal(s1.status, 'MOVING', 'R053-07 moving');
    assert.deepEqual(J(api.startBetween(A, B, batchOf('third', 2))), Object.assign({}, busy, { status: 'MOVING' }), 'R053-07 busy MOVING');
    assert.deepEqual(J(api.snapshot()), s1, 'R053-07 moving task untouched');
    for (let i = 0; i < 20 && api.snapshot().status !== 'DELIVERED'; i++) api.step();
    assert.equal(api.snapshot().status, 'DELIVERED', 'R053-07 delivered');
    const again = J(api.startBetween(A, B, batchOf('after-delivered', 3)));
    assert.ok(again.ok && again.sessionId !== s0.sessionId, 'R053-07 new task after delivered');
    api.cancel('qa');
    const third = J(api.start(65, 72, batchOf('after-cancel', 1)));
    assert.ok(third.ok && J(api.snapshot()).batchId === 'after-cancel', 'R053-07 new task after cancel');
  }],
  ['R053-08', '狀態機與核心逐步相同：PENDING→MOVING→DELIVERED、數量全程不變、終態冪等、中途取消', (source) => {
    const env = handEnv(source), api = env.api, orc = oracle(HAND_N, HAND);
    const r = J(api.startBetween(A, B, batchOf('sm', 7)));
    const ref = core.createDeliveryTask053(r.sessionId, J(core.planBetween({ roads: orc.road, w: HAND_N, h: HAND_N, origin: A, destination: B,
      isLogisticsRoot: orc.isLogisticsRoot, frontage: orc.frontage })), batchOf('sm', 7));
    assert.deepEqual(coreFields(J(api.snapshot())), J(ref.snapshot()), 'R053-08 initial');
    const seen = [];
    for (let i = 0; i < 8; i++) {
      const a = J(api.step()), b = J(ref.step());
      assert.equal(a.ok, true, 'R053-08 step ok');
      assert.deepEqual(coreFields(a.snapshot), b, 'R053-08 step ' + i);
      assert.equal(a.snapshot.qty, 7, 'R053-08 qty conserved');
      seen.push(a.snapshot.status);
    }
    assert.deepEqual(seen, ['MOVING', 'MOVING', 'MOVING', 'MOVING', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED'], 'R053-08 status sequence');
    assert.deepEqual(J(api.snapshot()).deliveredAt, { cursor: 5, step: 5 }, 'R053-08 delivered at');
    api.end();
    const t = J(api.start(65, 72, batchOf('tiles', 2)));
    const ref2 = core.createDeliveryTask053(t.sessionId, J(core.planDelivery({ roads: orc.road, w: HAND_N, h: HAND_N, origin: 65, destination: 72 })), batchOf('tiles', 2));
    api.step(); ref2.step(); api.step(); ref2.step();
    assert.deepEqual(coreFields(J(api.cancel('qa-cancel'))), J(ref2.cancel('qa-cancel')), 'R053-08 cancel');
    assert.deepEqual(coreFields(J(api.step().snapshot)), J(ref2.step()), 'R053-08 cancelled stays');
    api.end();
    const plain = J(api.startBetween(A, B, { batchId: 'no-commodity', qty: 2 }));
    assert.deepEqual([plain.ok, J(api.snapshot()).commodityId], [true, null], 'R053-08 batch without commodityId');
    api.end();
    const one = J(api.start(65, 65, batchOf('one', 1)));
    assert.deepEqual([one.ok, one.steps, J(api.snapshot()).status, J(api.snapshot()).active], [true, 0, 'DELIVERED', false], 'R053-08 single cell');
  }],
  ['R053-09', 'snapshot() 回傳深拷貝：改回傳值（provenance、path、deliveredAt、欄位）不影響任務', (source) => {
    const env = handEnv(source), api = env.api;
    const started = api.startBetween(A, B, batchOf('copy', 7));
    started.path[0] = -1;
    const s1 = api.snapshot();
    s1.provenance.version = 'forged';
    s1.path[0] = -2;
    s1.status = 'DELIVERED';
    s1.qty = 999;
    const s2 = api.snapshot();
    assert.deepEqual([s2.provenance.version, s2.path[0], s2.status, s2.qty], ['test-ver', 67, 'PENDING', 7], 'R053-09 snapshot is a copy');
    assert.ok(s1.provenance !== s2.provenance && s1.path !== s2.path, 'R053-09 fresh objects');
    for (let i = 0; i < 5; i++) api.step();
    const s3 = api.snapshot();
    s3.deliveredAt.cursor = -5;
    assert.deepEqual(J(api.snapshot().deliveredAt), { cursor: 5, step: 5 }, 'R053-09 deliveredAt copy');
  }],
  ['R053-10', '讀檔：先取消任務、移除面板，再呼叫原生 load（this、參數、回傳、例外都不變）', (source) => {
    const env = handEnv(source), api = env.api;
    api.startBetween(A, B, batchOf('load', 3));
    api.open();
    assert.ok(findId(env.body, 'lab053Panel'), 'R053-10 panel open');
    const self = { marker: 1 };
    assert.equal(env.ctx.load.call(self, 'slot-3'), 'native-load:slot-3', 'R053-10 native return');
    const call = env.nativeCalls[0];
    assert.ok(call && call.fn === 'load' && call.self === self && call.args.length === 1 && call.args[0] === 'slot-3', 'R053-10 native this/args');
    assert.deepEqual([call.snapshot.status, call.snapshot.cancelledReason], ['CANCELLED', 'load'], 'R053-10 cancelled before native load');
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).cancelledReason], ['CANCELLED', 'load'], 'R053-10 task cancelled');
    assert.equal(findId(env.body, 'lab053Panel'), null, 'R053-10 panel removed');
    api.startBetween(A, B, batchOf('load2', 1));
    assert.equal(caught(() => env.ctx.load('throw')), THROWN, 'R053-10 native exception propagates');
    assert.equal(J(api.snapshot()).cancelledReason, 'load', 'R053-10 cancelled even when native throws');
  }],
  ['R053-11', '開新城：先取消任務、移除面板，再呼叫原生 newWorld', (source) => {
    const env = handEnv(source), api = env.api;
    api.startBetween(A, B, batchOf('world', 3));
    api.step();
    api.open();
    assert.equal(env.ctx.newWorld(20261104), 'native-world:20261104', 'R053-11 native return');
    const call = env.nativeCalls[0];
    assert.ok(call && call.fn === 'newWorld' && call.args[0] === 20261104, 'R053-11 native args');
    assert.deepEqual([call.snapshot.status, call.snapshot.cancelledReason], ['CANCELLED', 'new-world'], 'R053-11 cancelled before native newWorld');
    assert.equal(findId(env.body, 'lab053Panel'), null, 'R053-11 panel removed');
  }],
  ['R053-12', 'pagehide：取消任務並移除面板', (source) => {
    const env = handEnv(source), api = env.api;
    api.startBetween(A, B, batchOf('hide', 3));
    api.open();
    env.pagehide();
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).cancelledReason], ['CANCELLED', 'pagehide'], 'R053-12 cancelled');
    assert.equal(findId(env.body, 'lab053Panel'), null, 'R053-12 panel removed');
  }],
  ['R053-13', '面板：只在 open() 時建立、顯示「未保存」提示、按鈕可推進／取消／關閉、不重複建立', (source) => {
    const env = handEnv(source), api = env.api;
    assert.equal(findId(env.body, 'lab053Panel'), null, 'R053-13 no panel before open');
    api.open();
    api.open();
    const panel = findId(env.body, 'lab053Panel');
    assert.ok(panel && env.body.children.filter((n) => n.id === 'lab053Panel').length === 1, 'R053-13 one panel');
    assert.equal(findId(panel, 'lab053Unsaved').textContent, UNSAVED, 'R053-13 unsaved text');
    assert.ok(textOf(panel).includes(UNSAVED), 'R053-13 unsaved visible');
    assert.ok(/(?:^|;)position:fixed(?:;|$)/.test(panel.style.cssText), 'R053-13 fixed');
    assert.equal(findId(panel, 'lab053Body').textContent, '目前沒有配送任務。', 'R053-13 empty body');
    api.startBetween(A, B, batchOf('panel', 6));
    assert.ok(findId(panel, 'lab053Body').textContent.includes('PENDING'), 'R053-13 body shows task');
    click(findId(panel, 'lab053Step'));
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).cursor], ['MOVING', 1], 'R053-13 step button');
    click(findId(panel, 'lab053Cancel'));
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).cancelledReason], ['CANCELLED', 'panel-cancel'], 'R053-13 cancel button');
    click(findId(panel, 'lab053Close'));
    assert.equal(findId(env.body, 'lab053Panel'), null, 'R053-13 close removes panel');
    assert.equal(J(api.snapshot()).reason, 'no-task', 'R053-13 close ends research');
  }],
  ['R053-14', '面板固定位置：LAB-03 在左上 (12,84) 260×200，與 LAB-05 面板不重疊', (source) => {
    const env = handEnv(source, { withRail: true });
    env.api.open();
    env.window.GV.railFreight054.open();
    const p3 = findId(env.body, 'lab053Panel'), p5 = findId(env.body, 'lab054Panel');
    assert.ok(p3 && p5, 'R053-14 both panels open');
    const r3 = rectOf(p3.style.cssText), r5 = rectOf(p5.style.cssText);
    assert.deepEqual(r3, { left: 12, top: 84, width: 260, height: 200 }, 'R053-14 LAB-03 slot');
    assert.ok(!overlap(r3, r5), 'R053-14 no overlap with LAB-05 ' + JSON.stringify([r3, r5]));
  }],
  ['R053-15', '安裝當下閥門已開：不改寫 load／newWorld、不掛 pagehide、不建 DOM，API 一律回 disabled', (source) => {
    const env = makeEnv(source, { valve: true });
    env.setWorld(HAND_N, HAND);
    assert.equal(env.ctx.load, env.stubLoad, 'R053-15 load stays native');
    assert.equal(env.ctx.newWorld, env.stubWorld, 'R053-15 newWorld stays native');
    assert.equal(env.listeners.length, 0, 'R053-15 no pagehide listener');
    const api = env.api, no = { ok: false, reason: 'disabled', installed: false };
    assert.ok(api && Object.isFrozen(api), 'R053-15 inert api present');
    for (const [name, args] of [['plan', [65, 72]], ['start', [65, 72, batchOf('v', 1)]], ['startBetween', [A, B, batchOf('v', 1)]], ['step', []],
      ['cancel', ['x']], ['open', []], ['refresh', []], ['end', []], ['disable', []]]) {
      assert.deepEqual(J(api[name](...args)), no, 'R053-15 ' + name + ' disabled');
    }
    assert.deepEqual(J(api.snapshot()), { ok: false, reason: 'disabled', active: false, disabled: true, installed: false }, 'R053-15 snapshot disabled');
    assert.equal(api.provenance.installed, false, 'R053-15 provenance');
    assert.equal(env.body.children.length, 0, 'R053-15 no DOM');
    assert.equal(env.ctx.load('s'), 'native-load:s', 'R053-15 native load still works');
  }],
  ['R053-16', '安裝後才關閥門：規劃、開始、推進、開面板都回 disabled；取消、結束、快照照常', (source) => {
    const env = handEnv(source), api = env.api;
    assert.equal(api.startBetween(A, B, batchOf('valve', 2)).ok, true, 'R053-16 started');
    env.window.__noRoadDelivery053 = true;
    for (const [name, args] of [['plan', [65, 72]], ['start', [65, 72, batchOf('v', 1)]], ['startBetween', [A, B, batchOf('v', 1)]], ['open', []]]) {
      assert.equal(J(api[name](...args)).reason, 'disabled', 'R053-16 ' + name + ' disabled');
    }
    const st = J(api.step());
    assert.deepEqual([st.ok, st.reason, st.snapshot.cursor, st.snapshot.disabled], [false, 'disabled', 0, true], 'R053-16 step blocked');
    assert.equal(env.body.children.length, 0, 'R053-16 open made no DOM');
    assert.equal(J(api.cancel('after-valve')).status, 'CANCELLED', 'R053-16 cancel works');
    assert.deepEqual(J(api.end()), { ok: true, ended: true }, 'R053-16 end works');
    delete env.window.__noRoadDelivery053;
    assert.deepEqual(J(api.disable()), { ok: true, ended: true }, 'R053-16 disable');
    assert.equal(env.window.__noRoadDelivery053, true, 'R053-16 disable sets valve');
    assert.equal(J(api.startBetween(A, B, batchOf('v', 1))).reason, 'disabled', 'R053-16 disabled after disable()');
  }],
  ['R053-17', '整輪沒有碰亂數、時鐘、儲存（Math.random、Date、performance、localStorage／sessionStorage／indexedDB）', () => {
    assert.deepEqual(SUITE_TRAPS, [], 'R053-17 no randomness/clock/storage access');
  }]
];

function runSuite(source, log) {
  SUITE_TRAPS = [];
  for (const [id, name, fn] of CHECKS) {
    try { fn(source); } catch (e) { return { id, message: String(e && e.message).split('\n')[0] }; }
    if (log) console.log('  ok  ' + id + ' ' + name);
  }
  return null;
}

const red = runSuite(RUNTIME_SRC, true);
assert.equal(red, null, 'road-delivery053-runtime: ' + JSON.stringify(red));

// 負控制（T782 B8）：每一條只改執行期原文一處，第一個紅燈必須落在目標項。
const MUTANTS = [
  ['R053-01', 'const isInt = (v) => Number.isInteger(v);', 'const isInt = (v) => Number.isInteger(v) ;'],
  ['R053-02', "window.addEventListener('pagehide', function pagehide053()", "window.addEventListener('pagehid', function pagehide053()"],
  ['R053-03', 'return core.planDelivery({ roads: grid(), w: N, h: N, origin, destination, maxSteps });',
    'return core.planDelivery({ roads: grid(), w: N, h: N, origin, destination, maxSteps: maxSteps === null ? undefined : maxSteps });'],
  ['R053-04', 'const frontage = (i) => sanRoadSeeds445(i);', 'const frontage = (i) => sanRoadSeeds445(i).reverse();'],
  ['R053-05', 'return !!(b && !b.ref && Object.prototype.hasOwnProperty.call(LOGISTICS_META485, b.k));',
    'return !!(b && Object.prototype.hasOwnProperty.call(LOGISTICS_META485, b.k));'],
  ['R053-06', 'function start(origin, destination, batch) {\n    if (off()) return no(DISABLED);\n    if (isActive()) return busy();\n    const checked = core.validateBatch(batch);',
    "function start(origin, destination, batch) {\n    if (off()) return no(DISABLED);\n    if (isActive()) return busy();\n    const checked = core.validateBatch(Object.assign({ batchId: 'lab053' }, batch, { qty: Number.isSafeInteger(batch && batch.qty) && batch.qty > 0 ? batch.qty : 1 }));"],
  ['R053-07', 'function startBetween(originRoot, destinationRoot, batch) {\n    if (off()) return no(DISABLED);\n    if (isActive()) return busy();\n',
    'function startBetween(originRoot, destinationRoot, batch) {\n    if (off()) return no(DISABLED);\n'],
  ['R053-08', 'task.run.step();\n    refresh();', 'task.run.step();\n    task.run.step();\n    refresh();'],
  ['R053-09', 'return copy(Object.assign({ ok: true, active:', 'return (Object.assign({ ok: true, active:'],
  ['R053-10', "load = function load053() { try { lifecycle('load'); }", 'load = function load053() { try { void 0; }'],
  ['R053-11', "newWorld = function newWorld053() { try { lifecycle('new-world'); }", 'newWorld = function newWorld053() { try { void 0; }'],
  ['R053-12', "function pagehide053() { try { lifecycle('pagehide'); }", 'function pagehide053() { try { void 0; }'],
  ['R053-13', "const UNSAVED = '未保存：重新整理或讀檔就會消失';", "const UNSAVED = '未保存';"],
  ['R053-14', 'left:12px;top:84px;width:260px;height:200px', 'left:12px;top:200px;width:260px;height:200px'],
  ['R053-15', 'if (window.__noRoadDelivery053) {', "if (window.__noRoadDelivery053 === 'never') {"],
  ['R053-15', 'const no = () => ({ ok: false, reason: DISABLED, installed: false });', "const no = () => ({ ok: false, reason: 'off', installed: false });"],
  ['R053-16', 'function plan(origin, destination, maxSteps) {\n    if (off()) return no(DISABLED);\n', 'function plan(origin, destination, maxSteps) {\n'],
  ['R053-17', "const sessionId = 'lab053-' + (++seq);", "const sessionId = 'lab053-' + (++seq) + (Math.random() < 2 ? '' : 'x');"]
];
for (const [target, find, repl] of MUTANTS) {
  assert.equal(RUNTIME_SRC.split(find).length, 2, 'mutant anchor must be unique: ' + target + ' ' + find);
  const got = runSuite(RUNTIME_SRC.split(find).join(repl), false);
  assert.ok(got && got.id === target, 'mutant for ' + target + ' must first fail at ' + target + ', got ' + JSON.stringify(got));
  console.log('  red ' + target + ' ← ' + got.message);
}
console.log('  ok  負控制 ' + MUTANTS.length + ' 條，首紅都落在目標項');
console.log('\nROAD_DELIVERY_053_RUNTIME ' + JSON.stringify({ checks: CHECKS.length, mutants: MUTANTS.length, ok: true }));

'use strict';
/* T783 B6／B8：用 node:vm 跑「執行期那份」rail-freight054-runtime.js（內嵌進 index.html 的就是這份），與純核心
 * rail-freight054.js 逐案比對：相同的不合法輸入理由（容量、數量）、相同的 BFS 路線、相同的狀態機。
 *  - 原生依賴（idx、inMap、DIRV、LOGISTICS_META485、sanRoadSeeds445）直接從 index.html 原文取出來在 vm 裡跑；
 *    LAB-05 的貼軌格與原生 sanRoadSeeds445 同一規則，測試把軌道格同時標成道路，核對兩者逐格相同；
 *  - 期望值由測試自己的世界描述算；load／newWorld 是記錄呼叫的替身，window／document 是最小替身；
 *    Math.random、Date、performance、localStorage／sessionStorage／indexedDB 都換成記帳陷阱，整輪必須一次都沒碰到。
 * 負控制（T783 B8）：MUTANTS 每一條改壞執行期原文一處，重跑整輪，第一個紅燈必須落在目標項。
 * 用法：node rail-freight054-runtime.test.js
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const ROOT = __dirname;
const RUNTIME_SRC = fs.readFileSync(path.join(ROOT, 'rail-freight054-runtime.js'), 'utf8');
const ROAD_RUNTIME_SRC = fs.readFileSync(path.join(ROOT, 'road-delivery053-runtime.js'), 'utf8');
const CORE_SRC = fs.readFileSync(path.join(ROOT, 'rail-freight054.js'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const core = require('./rail-freight054.js');
const BEGIN = '/* LAB-05 RAIL CORE 054 BEGIN */', END = '/* LAB-05 RAIL CORE 054 END */';
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
assert.equal(META['166'].tool, 'intermodalHub', 'native k166 is the intermodal hub');
assert.equal(META['166'].size, 4, 'native k166 footprint is 4×4');

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
// spec：{ rails:[[x,y]], roads:[[x,y]], buildings:[{x,y,k,sz}] }；根格 {k,sz,...}、其餘佔地格 {k,ref:[x,y]}（原生同形）。
function buildTiles(N, spec) {
  const tiles = [];
  for (let i = 0; i < N * N; i++) tiles.push({ t: 2 });
  for (const [x, y] of spec.rails || []) tiles[y * N + x].rail = 1;
  for (const [x, y] of spec.roads || []) tiles[y * N + x].road = 1;
  for (const b of spec.buildings || []) for (let fy = 0; fy < b.sz; fy++) for (let fx = 0; fx < b.sz; fx++) {
    tiles[(b.y + fy) * N + b.x + fx].bld = fx === 0 && fy === 0 ? { k: b.k, lv: 1, v: 0, age: 0, pw: true, h: 1, sz: b.sz } : { k: b.k, ref: [b.x, b.y] };
  }
  return tiles;
}
function seedsOf(N, isKind, rx, ry, size) {
  const out = [];
  for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) for (const [dx, dy] of DIR4) {
    const nx = rx + fx + dx, ny = ry + fy + dy;
    if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
    const j = ny * N + nx;
    if (isKind(j) && !out.includes(j)) out.push(j);
  }
  return out;
}
function oracle(N, spec) {
  const rail = new Uint8Array(N * N);
  for (const [x, y] of spec.rails || []) rail[y * N + x] = 1;
  const roots = new Map((spec.buildings || []).map((b) => [b.y * N + b.x, b]));
  const isRail = (j) => rail[j] === 1;
  return {
    rail,
    isHubRoot: (i) => { const b = roots.get(i); return !!(b && b.k === 166); },
    railFrontage: (i) => { const b = roots.get(i); return b ? seedsOf(N, isRail, b.x, b.y, b.sz) : []; }
  };
}
function expectBetween(N, orc, o, d, cargo, capacity) {
  const v = J(core.validateCargo(cargo, capacity));
  if (!v.ok) return v;
  const p = J(core.planBetween({ rail: orc.rail, w: N, h: N, origin: o, destination: d, isHubRoot: orc.isHubRoot,
    railFrontage: orc.railFrontage, maxSteps: cargo.maxSteps }));
  return p.ok ? Object.assign(p, { capacity: v.capacity }) : p;
}

// 手算的貨運場（20×20）：主線 x=5（y 0–15）；A＝k166 在 (1,1)、B＝k166 在 (6,9)，都貼主線；
// C＝k166 在 (7,2) 不貼軌；D＝k166 在 (11,8) 只貼另一條 x=15 的軌（不連通）；E＝k165 貨櫃物流貼主線（不是車站）。
const HAND_N = 20;
const col = (x, y0, y1) => { const out = []; for (let y = y0; y <= y1; y++) out.push([x, y]); return out; };
const HAND = {
  rails: col(5, 0, 15).concat(col(15, 6, 14)),
  buildings: [{ x: 1, y: 1, k: 166, sz: 4 }, { x: 6, y: 9, k: 166, sz: 4 }, { x: 7, y: 2, k: 166, sz: 4 }, { x: 11, y: 8, k: 166, sz: 4 }, { x: 1, y: 6, k: 165, sz: 4 }]
};
const at = (x, y) => y * HAND_N + x;
const A = at(1, 1), B = at(6, 9), C = at(7, 2), D = at(11, 8), E = at(1, 6);
const HAND_PATH = [85, 105, 125, 145, 165, 185];   // 手算：A 的貼軌格 [25,45,65,85] → B 的貼軌格 [185,205,225,245]，沿 x=5 走 5 步

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
  if (opts.valve) window.__noRailFreight054 = true;
  const ctx = { window, document: { body, createElement: (tag) => new Node(tag) }, tiles: [], N: 1, GAME_VER: 'test-ver', GAME_ANCHOR: 'test-anchor',
    __trap: (what) => SUITE_TRAPS.push(what) };
  const storage = { getItem() { SUITE_TRAPS.push('storage.getItem'); return null; }, setItem() { SUITE_TRAPS.push('storage.setItem'); }, removeItem() { SUITE_TRAPS.push('storage.removeItem'); } };
  for (const host of [ctx, window]) for (const name of ['localStorage', 'sessionStorage', 'indexedDB']) {
    Object.defineProperty(host, name, { configurable: true, get() { SUITE_TRAPS.push(name); return storage; } });
  }
  const snap = () => (window.GV.railFreight054 ? J(window.GV.railFreight054.snapshot()) : null);
  const stubLoad = function (...args) { nativeCalls.push({ fn: 'load', self: this, args, snapshot: snap() }); if (args[0] === 'throw') throw THROWN; return 'native-load:' + args[0]; };
  const stubWorld = function (...args) { nativeCalls.push({ fn: 'newWorld', self: this, args, snapshot: snap() }); if (args[0] === 'throw') throw THROWN; return 'native-world:' + args[0]; };
  ctx.load = stubLoad;
  ctx.newWorld = stubWorld;
  vm.createContext(ctx);
  vm.runInContext(TRAP_SRC, ctx);
  vm.runInContext(NATIVE_SRC, ctx);
  if (opts.withRoad) vm.runInContext(ROAD_RUNTIME_SRC, ctx, { timeout: 5000 });   // index.html 的順序：053 在 054 之前
  vm.runInContext(source, ctx, { timeout: 5000 });
  return {
    ctx, window, body, listeners, nativeCalls, stubLoad, stubWorld, api: window.GV.railFreight054,
    setWorld(N, spec) { ctx.N = N; ctx.tiles = buildTiles(N, spec); },
    native: (expr) => J(vm.runInContext(expr, ctx)),
    pagehide: () => listeners.filter(([t]) => t === 'pagehide').forEach(([, f]) => f({ type: 'pagehide' }))
  };
}
const handEnv = (source, opts) => { const env = makeEnv(source, opts); env.setWorld(HAND_N, HAND); return env; };
const cargoOf = (id, qty, extra) => Object.assign({ batchId: id, qty, commodityId: 'steel' }, extra || {});
const CORE_FIELDS = ['sessionId', 'batchId', 'commodityId', 'qty', 'capacity', 'status', 'cursor', 'pathLength', 'steps', 'arrived', 'unloaded', 'unloadedAt', 'abortReason'];
const coreFields = (s) => Object.fromEntries(CORE_FIELDS.map((k) => [k, s[k]]));
const NO_RUN = { ok: false, reason: 'no-run', active: false, disabled: false };

/* ---------- 檢查項 ---------- */
const CHECKS = [
  ['R054-01', '執行期內嵌的核心段落與 rail-freight054.js 逐字相同', (source) => {
    const section = (s, label) => {
      assert.equal(s.split(BEGIN).length, 2, 'R054-01 one BEGIN in ' + label);
      assert.equal(s.split(END).length, 2, 'R054-01 one END in ' + label);
      return s.slice(s.indexOf(BEGIN), s.indexOf(END) + END.length);
    };
    assert.equal(section(source, 'runtime'), section(CORE_SRC, 'core'), 'R054-01 runtime embeds the core section verbatim');
  }],
  ['R054-02', '閥門沒開：裝上完整 API，load／newWorld 換成 054 的包裝，掛一個 pagehide，不建 DOM', (source) => {
    const env = makeEnv(source);
    assert.deepEqual(Object.keys(env.api).sort(), ['abort', 'disable', 'end', 'open', 'plan', 'provenance', 'refresh', 'runBetween', 'snapshot', 'start', 'step', 'unload'], 'R054-02 api names');
    assert.ok(Object.isFrozen(env.api) && Object.isFrozen(env.api.provenance), 'R054-02 api frozen');
    assert.deepEqual(J(env.api.provenance), { installed: true, module: 'rail-freight054', lab: 'LAB-05', card: 'T783', isolation: 'shadow-only', persisted: false, defaultCapacity: 12 }, 'R054-02 provenance');
    assert.ok(env.ctx.load !== env.stubLoad && env.ctx.load.name === 'load054', 'R054-02 load wrapped');
    assert.ok(env.ctx.newWorld !== env.stubWorld && env.ctx.newWorld.name === 'newWorld054', 'R054-02 newWorld wrapped');
    assert.deepEqual(env.listeners.map(([t, f]) => t + ':' + f.name), ['pagehide:pagehide054'], 'R054-02 one pagehide listener');
    assert.deepEqual(Object.keys(env.window.GV), ['railFreight054'], 'R054-02 only GV.railFreight054');
    assert.equal(env.body.children.length, 0, 'R054-02 no DOM at install');
  }],
  ['R054-03', 'plan() 與 core.planRailRoute 逐案相同（隨機軌網、不合法端點與 maxSteps、沒有城市）', (source) => {
    const env = makeEnv(source), rnd = lcg(54), reasons = new Set();
    let ok = 0;
    for (let world = 0; world < 60; world++) {
      const N = 4 + Math.floor(rnd() * 10), rails = [];
      for (let i = 0; i < N * N; i++) if (rnd() < 0.5) rails.push([i % N, Math.floor(i / N)]);
      env.setWorld(N, { rails });
      const grid = oracle(N, { rails }).rail;
      const odd = [-1, N * N, 2.5, '3', null, undefined, NaN];
      for (let k = 0; k < 25; k++) {
        const o = k === 23 ? odd[world % odd.length] : Math.floor(rnd() * N * N), d = k === 24 ? odd[(world + 3) % odd.length] : Math.floor(rnd() * N * N);
        const ms = [undefined, undefined, undefined, Math.floor(rnd() * 8), null, -1, 2.5, '3', Infinity][k % 9];
        const got = J(env.api.plan(o, d, ms)), want = J(core.planRailRoute({ rail: grid, w: N, h: N, from: o, to: d, maxSteps: ms }));
        assert.deepEqual(got, want, 'R054-03 plan ' + JSON.stringify({ world, o, d, ms: String(ms) }));
        if (got.ok) ok++;
        reasons.add(String(want.reason) + (want.detail ? ':' + want.detail : ''));
      }
    }
    assert.ok(ok > 40, 'R054-03 coverage ok=' + ok);
    for (const r of ['null', 'from-not-rail', 'to-not-rail', 'unreachable', 'too-far', 'bad-input:maxSteps', 'bad-input:range', 'bad-input:endpoints']) {
      assert.ok(reasons.has(r), 'R054-03 coverage reason ' + r);
    }
    env.ctx.tiles = null;
    assert.deepEqual(J(env.api.plan(0, 1)), J(core.planRailRoute({ rail: null, w: env.ctx.N, h: env.ctx.N, from: 0, to: 1 })), 'R054-03 no city');
  }],
  ['R054-04', 'runBetween() 與核心（validateCargo＋planBetween）逐案相同（隨機軌網、k166 與其他建築）', (source) => {
    const env = makeEnv(source), rnd = lcg(783), others = [165, 167, 168, 1, 2];
    let ok = 0;
    const reasons = new Set();
    for (let world = 0; world < 70; world++) {
      const N = 12 + Math.floor(rnd() * 9), owner = new Int32Array(N * N).fill(-1), buildings = [];
      for (let k = 0; k < 6; k++) {
        const hub = rnd() < 0.65, kk = hub ? 166 : others[k % others.length];
        const sz = hub ? 4 : (META[kk] ? META[kk].size : 1), x = Math.floor(rnd() * (N - sz + 1)), y = Math.floor(rnd() * (N - sz + 1));
        let free = true;
        for (let fy = 0; fy < sz; fy++) for (let fx = 0; fx < sz; fx++) if (owner[(y + fy) * N + x + fx] >= 0) free = false;
        if (!free) continue;
        for (let fy = 0; fy < sz; fy++) for (let fx = 0; fx < sz; fx++) owner[(y + fy) * N + x + fx] = buildings.length;
        buildings.push({ x, y, k: kk, sz });
      }
      const rails = [], density = 0.06 + rnd() * 0.5;
      for (let i = 0; i < N * N; i++) if (owner[i] < 0 && rnd() < density) rails.push([i % N, Math.floor(i / N)]);
      // 軌道格同時標成道路：原生 sanRoadSeeds445 讀到的道路前接，必須與測試的貼軌期望值逐格相同（同一規則）。
      const spec = { rails, roads: rails, buildings }, orc = oracle(N, spec);
      env.setWorld(N, spec);
      for (const b of buildings) assert.deepEqual(env.native('sanRoadSeeds445(' + (b.y * N + b.x) + ')'), orc.railFrontage(b.y * N + b.x), 'R054-04 oracle follows the native frontage rule');
      const ends = buildings.map((b) => b.y * N + b.x).concat(rails.length ? [rails[0][1] * N + rails[0][0]] : []);
      for (const o of ends) for (const d of ends) {
        if (o === d) continue;
        const cargo = cargoOf('w' + world + '-' + o + '-' + d, 1 + ((o + d) % 14), (o + d) % 5 === 0 ? { maxSteps: (o + d) % 4 } : null);
        if ((o + d) % 3 === 1) delete cargo.commodityId;
        const capacity = [undefined, 12, 9, 14][(o + d) % 4];
        const want = expectBetween(N, orc, o, d, cargo, capacity), got = J(env.api.runBetween(o, d, cargo, capacity));
        reasons.add(want.reason);
        if (want.ok) {
          assert.ok(/^lab054-\d+$/.test(got.sessionId), 'R054-04 session id ' + got.sessionId);
          delete got.sessionId;
          const s = J(env.api.snapshot());
          assert.deepEqual([s.status, s.qty, s.capacity, s.batchId, s.mode, s.originRoot, s.destinationRoot, s.path],
            ['READY', cargo.qty, want.capacity, cargo.batchId, 'between', o, d, want.path], 'R054-04 run ' + world);
          ok++;
        }
        assert.deepEqual(got, want, 'R054-04 runBetween ' + JSON.stringify({ world, o, d }));
        env.api.end();
      }
    }
    assert.ok(ok > 60, 'R054-04 coverage ok=' + ok);
    for (const r of ['not-hub', 'hub-not-on-rail', 'unreachable', 'too-far', 'over-capacity', null]) assert.ok(reasons.has(r), 'R054-04 coverage reason ' + r);
  }],
  ['R054-05', '手算貨運場：路線頭尾貼兩站；not-hub／hub-not-on-rail／unreachable／too-far／bad-input 各自分開', (source) => {
    const env = handEnv(source), api = env.api, c = cargoOf('hand', 12);
    const r = (o, d, extra, cap) => { const x = J(api.runBetween(o, d, Object.assign({}, c, extra || {}), cap)); api.end(); return x; };
    const fail = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
    assert.deepEqual(r(A, C), fail('hub-not-on-rail', { side: 'destination' }), 'R054-05 hub-not-on-rail dest');
    assert.deepEqual(r(C, A), fail('hub-not-on-rail', { side: 'origin' }), 'R054-05 hub-not-on-rail origin');
    assert.deepEqual(r(A, D), fail('unreachable'), 'R054-05 unreachable (other rail component)');
    assert.deepEqual(r(A, E), fail('not-hub', { side: 'destination' }), 'R054-05 logistics but not k166');
    assert.deepEqual(r(E, A), fail('not-hub', { side: 'origin' }), 'R054-05 not-hub origin');
    assert.deepEqual(r(at(2, 2), B), fail('not-hub', { side: 'origin' }), 'R054-05 footprint ref tile');
    assert.deepEqual(r(at(5, 0), B), fail('not-hub', { side: 'origin' }), 'R054-05 rail tile');
    assert.deepEqual(r(at(19, 19), B), fail('not-hub', { side: 'origin' }), 'R054-05 empty land');
    assert.deepEqual(r('21', B), fail('bad-input', { detail: 'endpoints' }), 'R054-05 endpoints');
    assert.deepEqual(r(A, 400), fail('bad-input', { detail: 'range' }), 'R054-05 range');
    assert.deepEqual(r(A, B, { maxSteps: 4 }), fail('too-far', { steps: 5, limit: 4 }), 'R054-05 too-far');
    assert.deepEqual(J(api.snapshot()), NO_RUN, 'R054-05 failures create no run');
    const okr = J(api.runBetween(A, B, c));
    assert.deepEqual(okr, { ok: true, path: HAND_PATH, steps: 5, reason: null, originRoot: A, destinationRoot: B,
      originFrontage: [25, 45, 65, 85], destinationFrontage: [185, 205, 225, 245], sessionId: 'lab054-1', capacity: 12 }, 'R054-05 hand route');
    const s = J(api.snapshot());
    assert.deepEqual([s.status, s.qty, s.capacity, s.cursor, s.pathLength, s.path], ['READY', 12, 12, 0, 6, HAND_PATH], 'R054-05 run created');
  }],
  ['R054-06', '不合法容量與數量：start／runBetween 的理由與 core.validateCargo 完全相同（bad-input），超載 over-capacity，不建任務', (source) => {
    const env = handEnv(source), api = env.api;
    const cases = [];
    for (const cap of [0, -1, 'x', null, 2.5, NaN, Infinity, '12', true]) cases.push([cargoOf('c', 1), cap]);
    for (const qty of [0, -3, 2.5, '5', null, undefined, NaN, Infinity, 2 ** 53, true]) cases.push([{ batchId: 'q', qty }, 12]);
    for (const bad of [{ batchId: '', qty: 1 }, { qty: 1 }, { batchId: 'b', qty: 1, commodityId: 7 }, null, undefined, 'b', []]) cases.push([bad, 12]);
    cases.push([cargoOf('over', 13), undefined], [cargoOf('over', 5), 4], [cargoOf('over', 15), 14]);
    for (const [cargo, cap] of cases) {
      const want = J(core.validateCargo(cargo, cap)), label = JSON.stringify([cargo === undefined ? 'undefined' : cargo, String(cap)]);
      assert.ok(want.reason === 'bad-input' || want.reason === 'over-capacity', 'R054-06 core rejects ' + label);
      assert.deepEqual(J(api.start(85, 185, cargo, cap)), want, 'R054-06 start ' + label);
      assert.deepEqual(J(api.runBetween(A, B, cargo, cap)), want, 'R054-06 runBetween ' + label);
      assert.deepEqual(J(api.snapshot()), NO_RUN, 'R054-06 no run after ' + label);
    }
    for (const maxSteps of [null, -1, 2.5, '3']) {
      const cargo = cargoOf('m', 1, { maxSteps });
      const want = J(core.planRailRoute({ rail: oracle(HAND_N, HAND).rail, w: HAND_N, h: HAND_N, from: 85, to: 185, maxSteps }));
      assert.deepEqual([want.reason, want.detail], ['bad-input', 'maxSteps'], 'R054-06 core maxSteps ' + String(maxSteps));
      assert.deepEqual(J(api.start(85, 185, cargo)), want, 'R054-06 start maxSteps ' + String(maxSteps));
      assert.deepEqual(J(api.runBetween(A, B, cargo)), expectBetween(HAND_N, oracle(HAND_N, HAND), A, B, cargo), 'R054-06 runBetween maxSteps ' + String(maxSteps));
    }
    assert.deepEqual(J(api.snapshot()), NO_RUN, 'R054-06 still no run');
    const full = J(api.runBetween(A, B, cargoOf('full', 12), 12));
    assert.deepEqual([full.ok, full.capacity, J(api.snapshot()).qty], [true, 12, 12], 'R054-06 qty == capacity allowed');
  }],
  ['R054-07', '列車在 READY／RUNNING／ARRIVED 時再開 → busy，不換掉舊任務；卸貨或中止之後才可以再開', (source) => {
    const env = handEnv(source), api = env.api;
    assert.equal(api.runBetween(A, B, cargoOf('first', 6)).ok, true, 'R054-07 first run');
    const s0 = J(api.snapshot());
    const busy = (status) => ({ ok: false, path: [], steps: -1, reason: 'busy', sessionId: s0.sessionId, batchId: 'first', status });
    assert.deepEqual(J(api.runBetween(A, B, cargoOf('second', 3))), busy('READY'), 'R054-07 busy READY');
    assert.deepEqual(J(api.start(85, 185, cargoOf('second', 3))), busy('READY'), 'R054-07 busy start READY');
    assert.deepEqual(J(api.snapshot()), s0, 'R054-07 ready run untouched');
    api.step();
    assert.deepEqual(J(api.runBetween(A, B, cargoOf('third', 3))), busy('RUNNING'), 'R054-07 busy RUNNING');
    for (let i = 0; i < 20 && api.snapshot().status !== 'ARRIVED'; i++) api.step();
    assert.equal(api.snapshot().status, 'ARRIVED', 'R054-07 arrived');
    assert.deepEqual(J(api.runBetween(A, B, cargoOf('fourth', 3))), busy('ARRIVED'), 'R054-07 busy ARRIVED (not unloaded yet)');
    assert.equal(J(api.unload()).snapshot.status, 'UNLOADED', 'R054-07 unloaded');
    const again = J(api.runBetween(B, A, cargoOf('after-unload', 2)));
    assert.ok(again.ok && again.sessionId !== s0.sessionId, 'R054-07 new run after unload');
    api.abort('qa');
    const third = J(api.start(85, 185, cargoOf('after-abort', 1)));
    assert.ok(third.ok && J(api.snapshot()).batchId === 'after-abort', 'R054-07 new run after abort');
  }],
  ['R054-08', '狀態機與核心逐步相同：READY→RUNNING→ARRIVED→UNLOADED、未到站不能卸貨（任務不變）、數量不變、中止', (source) => {
    const env = handEnv(source), api = env.api, orc = oracle(HAND_N, HAND);
    const r = J(api.runBetween(A, B, cargoOf('sm', 9), 10));
    const ref = core.createFreightRun054(r.sessionId, J(core.planBetween({ rail: orc.rail, w: HAND_N, h: HAND_N, origin: A, destination: B,
      isHubRoot: orc.isHubRoot, railFrontage: orc.railFrontage })), cargoOf('sm', 9), 10);
    assert.deepEqual(coreFields(J(api.snapshot())), J(ref.snapshot()), 'R054-08 initial');
    const early = J(api.unload());
    assert.deepEqual([early.ok, early.reason, early.snapshot.status], [false, 'not-arrived', 'READY'], 'R054-08 unload before arrival refused');
    assert.deepEqual(coreFields(early.snapshot), J(ref.snapshot()), 'R054-08 refused unload leaves run unchanged');
    const seen = [];
    for (let i = 0; i < 7; i++) {
      const a = J(api.step()), b = J(ref.step());
      assert.equal(a.ok, true, 'R054-08 step ok');
      assert.deepEqual(coreFields(a.snapshot), b, 'R054-08 step ' + i);
      assert.equal(a.snapshot.qty, 9, 'R054-08 qty conserved');
      seen.push(a.snapshot.status);
    }
    assert.deepEqual(seen, ['RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'ARRIVED', 'ARRIVED', 'ARRIVED'], 'R054-08 status sequence');
    const u = J(api.unload());
    assert.deepEqual(coreFields(u.snapshot), J(ref.unload()), 'R054-08 unload');
    assert.deepEqual([u.ok, u.snapshot.status, u.snapshot.qty, u.snapshot.unloadedAt], [true, 'UNLOADED', 9, { cursor: 5, step: 5 }], 'R054-08 unloaded');
    assert.deepEqual(J(api.unload()).reason, 'not-arrived', 'R054-08 second unload refused');
    assert.deepEqual(coreFields(J(api.step().snapshot)), J(ref.step()), 'R054-08 terminal idempotent');
    api.end();
    const t = J(api.start(85, 185, cargoOf('tiles', 2)));
    const ref2 = core.createFreightRun054(t.sessionId, J(core.planRailRoute({ rail: orc.rail, w: HAND_N, h: HAND_N, from: 85, to: 185 })), cargoOf('tiles', 2));
    api.step(); ref2.step();
    assert.deepEqual(coreFields(J(api.abort('qa-abort'))), J(ref2.abort('qa-abort')), 'R054-08 abort');
    assert.deepEqual(J(api.unload()).reason, 'not-arrived', 'R054-08 aborted cannot unload');
    api.end();
    const plain = J(api.runBetween(A, B, { batchId: 'no-commodity', qty: 2 }));
    assert.deepEqual([plain.ok, J(api.snapshot()).commodityId], [true, null], 'R054-08 cargo without commodityId');
  }],
  ['R054-09', 'snapshot() 回傳深拷貝：改回傳值（provenance、path、unloadedAt、欄位）不影響列車', (source) => {
    const env = handEnv(source), api = env.api;
    const started = api.runBetween(A, B, cargoOf('copy', 7));
    started.path[0] = -1;
    const s1 = api.snapshot();
    s1.provenance.version = 'forged';
    s1.path[0] = -2;
    s1.status = 'UNLOADED';
    s1.qty = 999;
    const s2 = api.snapshot();
    assert.deepEqual([s2.provenance.version, s2.path[0], s2.status, s2.qty], ['test-ver', 85, 'READY', 7], 'R054-09 snapshot is a copy');
    assert.ok(s1.provenance !== s2.provenance && s1.path !== s2.path, 'R054-09 fresh objects');
    for (let i = 0; i < 5; i++) api.step();
    api.unload().snapshot.unloadedAt.cursor = -5;
    assert.deepEqual(J(api.snapshot().unloadedAt), { cursor: 5, step: 5 }, 'R054-09 unloadedAt copy');
  }],
  ['R054-10', '讀檔：先中止列車、移除面板，再呼叫原生 load（this、參數、回傳、例外都不變）', (source) => {
    const env = handEnv(source), api = env.api;
    api.runBetween(A, B, cargoOf('load', 3));
    api.open();
    assert.ok(findId(env.body, 'lab054Panel'), 'R054-10 panel open');
    const self = { marker: 1 };
    assert.equal(env.ctx.load.call(self, 'slot-3'), 'native-load:slot-3', 'R054-10 native return');
    const call = env.nativeCalls[0];
    assert.ok(call && call.fn === 'load' && call.self === self && call.args.length === 1 && call.args[0] === 'slot-3', 'R054-10 native this/args');
    assert.deepEqual([call.snapshot.status, call.snapshot.abortReason], ['ABORTED', 'load'], 'R054-10 aborted before native load');
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).abortReason], ['ABORTED', 'load'], 'R054-10 run aborted');
    assert.equal(findId(env.body, 'lab054Panel'), null, 'R054-10 panel removed');
    api.runBetween(A, B, cargoOf('load2', 1));
    assert.equal(caught(() => env.ctx.load('throw')), THROWN, 'R054-10 native exception propagates');
    assert.equal(J(api.snapshot()).abortReason, 'load', 'R054-10 aborted even when native throws');
  }],
  ['R054-11', '開新城：先中止列車、移除面板，再呼叫原生 newWorld', (source) => {
    const env = handEnv(source), api = env.api;
    api.runBetween(A, B, cargoOf('world', 3));
    api.step();
    api.open();
    assert.equal(env.ctx.newWorld(20261104), 'native-world:20261104', 'R054-11 native return');
    const call = env.nativeCalls[0];
    assert.ok(call && call.fn === 'newWorld' && call.args[0] === 20261104, 'R054-11 native args');
    assert.deepEqual([call.snapshot.status, call.snapshot.abortReason], ['ABORTED', 'new-world'], 'R054-11 aborted before native newWorld');
    assert.equal(findId(env.body, 'lab054Panel'), null, 'R054-11 panel removed');
  }],
  ['R054-12', 'pagehide：中止列車並移除面板', (source) => {
    const env = handEnv(source), api = env.api;
    api.runBetween(A, B, cargoOf('hide', 3));
    api.open();
    env.pagehide();
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).abortReason], ['ABORTED', 'pagehide'], 'R054-12 aborted');
    assert.equal(findId(env.body, 'lab054Panel'), null, 'R054-12 panel removed');
  }],
  ['R054-13', '面板：只在 open() 時建立、顯示「未保存」提示、按鈕可推進／卸貨／關閉、不重複建立', (source) => {
    const env = handEnv(source), api = env.api;
    assert.equal(findId(env.body, 'lab054Panel'), null, 'R054-13 no panel before open');
    api.open();
    api.open();
    const panel = findId(env.body, 'lab054Panel');
    assert.ok(panel && env.body.children.filter((n) => n.id === 'lab054Panel').length === 1, 'R054-13 one panel');
    assert.equal(findId(panel, 'lab054Unsaved').textContent, UNSAVED, 'R054-13 unsaved text');
    assert.ok(textOf(panel).includes(UNSAVED), 'R054-13 unsaved visible');
    assert.ok(/(?:^|;)position:fixed(?:;|$)/.test(panel.style.cssText), 'R054-13 fixed');
    assert.equal(findId(panel, 'lab054Body').textContent, '目前沒有貨運列車任務。', 'R054-13 empty body');
    api.runBetween(A, B, cargoOf('panel', 6));
    assert.ok(findId(panel, 'lab054Body').textContent.includes('READY'), 'R054-13 body shows run');
    for (let i = 0; i < 5; i++) click(findId(panel, 'lab054Step'));
    assert.deepEqual([J(api.snapshot()).status, J(api.snapshot()).cursor], ['ARRIVED', 5], 'R054-13 step button');
    click(findId(panel, 'lab054Unload'));
    assert.equal(J(api.snapshot()).status, 'UNLOADED', 'R054-13 unload button');
    click(findId(panel, 'lab054Close'));
    assert.equal(findId(env.body, 'lab054Panel'), null, 'R054-13 close removes panel');
    assert.equal(J(api.snapshot()).reason, 'no-run', 'R054-13 close ends research');
  }],
  ['R054-14', '面板固定位置：LAB-05 在左側 (12,296) 260×200，與 LAB-03 面板不重疊', (source) => {
    const env = handEnv(source, { withRoad: true });
    env.window.GV.roadDelivery053.open();
    env.api.open();
    const p3 = findId(env.body, 'lab053Panel'), p5 = findId(env.body, 'lab054Panel');
    assert.ok(p3 && p5, 'R054-14 both panels open');
    const r3 = rectOf(p3.style.cssText), r5 = rectOf(p5.style.cssText);
    assert.deepEqual(r5, { left: 12, top: 296, width: 260, height: 200 }, 'R054-14 LAB-05 slot');
    assert.ok(!overlap(r3, r5), 'R054-14 no overlap with LAB-03 ' + JSON.stringify([r3, r5]));
  }],
  ['R054-15', '安裝當下閥門已開：不改寫 load／newWorld、不掛 pagehide、不建 DOM，API 一律回 disabled', (source) => {
    const env = makeEnv(source, { valve: true });
    env.setWorld(HAND_N, HAND);
    assert.equal(env.ctx.load, env.stubLoad, 'R054-15 load stays native');
    assert.equal(env.ctx.newWorld, env.stubWorld, 'R054-15 newWorld stays native');
    assert.equal(env.listeners.length, 0, 'R054-15 no pagehide listener');
    const api = env.api, no = { ok: false, reason: 'disabled', installed: false };
    assert.ok(api && Object.isFrozen(api), 'R054-15 inert api present');
    for (const [name, args] of [['plan', [85, 185]], ['start', [85, 185, cargoOf('v', 1)]], ['runBetween', [A, B, cargoOf('v', 1)]], ['step', []],
      ['unload', []], ['abort', ['x']], ['open', []], ['refresh', []], ['end', []], ['disable', []]]) {
      assert.deepEqual(J(api[name](...args)), no, 'R054-15 ' + name + ' disabled');
    }
    assert.deepEqual(J(api.snapshot()), { ok: false, reason: 'disabled', active: false, disabled: true, installed: false }, 'R054-15 snapshot disabled');
    assert.equal(api.provenance.installed, false, 'R054-15 provenance');
    assert.equal(env.body.children.length, 0, 'R054-15 no DOM');
    assert.equal(env.ctx.load('s'), 'native-load:s', 'R054-15 native load still works');
  }],
  ['R054-16', '安裝後才關閥門：規劃、開始、推進、卸貨、開面板都回 disabled；中止、結束、快照照常', (source) => {
    const env = handEnv(source), api = env.api;
    assert.equal(api.runBetween(A, B, cargoOf('valve', 2)).ok, true, 'R054-16 started');
    env.window.__noRailFreight054 = true;
    for (const [name, args] of [['plan', [85, 185]], ['start', [85, 185, cargoOf('v', 1)]], ['runBetween', [A, B, cargoOf('v', 1)]], ['open', []]]) {
      assert.equal(J(api[name](...args)).reason, 'disabled', 'R054-16 ' + name + ' disabled');
    }
    const st = J(api.step());
    assert.deepEqual([st.ok, st.reason, st.snapshot.cursor, st.snapshot.disabled], [false, 'disabled', 0, true], 'R054-16 step blocked');
    assert.equal(J(api.unload()).reason, 'disabled', 'R054-16 unload blocked');
    assert.equal(env.body.children.length, 0, 'R054-16 open made no DOM');
    assert.equal(J(api.abort('after-valve')).status, 'ABORTED', 'R054-16 abort works');
    assert.deepEqual(J(api.end()), { ok: true, ended: true }, 'R054-16 end works');
    delete env.window.__noRailFreight054;
    assert.deepEqual(J(api.disable()), { ok: true, ended: true }, 'R054-16 disable');
    assert.equal(env.window.__noRailFreight054, true, 'R054-16 disable sets valve');
    assert.equal(J(api.runBetween(A, B, cargoOf('v', 1))).reason, 'disabled', 'R054-16 disabled after disable()');
  }],
  ['R054-17', '整輪沒有碰亂數、時鐘、儲存（Math.random、Date、performance、localStorage／sessionStorage／indexedDB）', () => {
    assert.deepEqual(SUITE_TRAPS, [], 'R054-17 no randomness/clock/storage access');
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
assert.equal(red, null, 'rail-freight054-runtime: ' + JSON.stringify(red));

// 負控制（T783 B8）：每一條只改執行期原文一處，第一個紅燈必須落在目標項。
const MUTANTS = [
  ['R054-01', 'const isInt = (v) => Number.isInteger(v);', 'const isInt = (v) => Number.isInteger(v) ;'],
  ['R054-02', "window.addEventListener('pagehide', function pagehide054()", "window.addEventListener('pagehid', function pagehide054()"],
  ['R054-03', 'return core.planRailRoute({ rail: grid(), w: N, h: N, from, to, maxSteps });',
    'return core.planRailRoute({ rail: grid(), w: N, h: N, from, to, maxSteps: maxSteps === null ? undefined : maxSteps });'],
  ['R054-04', 'isKind: (j) => !!(tiles[j] && tiles[j].rail) });', 'isKind: (j) => !!(tiles[j] && tiles[j].rail) }).reverse();'],
  ['R054-05', 'return !!(b && !b.ref && b.k === HUB_K);', 'return !!(b && b.k === HUB_K);'],
  ['R054-06', 'function start(from, to, cargo, capacity) {\n    if (off()) return no(DISABLED);\n    if (isActive()) return busy();\n    const checked = core.validateCargo(cargo, capacity);',
    'function start(from, to, cargo, capacity) {\n    if (off()) return no(DISABLED);\n    if (isActive()) return busy();\n    const checked = core.validateCargo(cargo, Number.isSafeInteger(capacity) && capacity > 0 ? capacity : undefined);'],
  ['R054-07', 'function runBetween(originHubRoot, destinationHubRoot, batch, capacity) {\n    if (off()) return no(DISABLED);\n    if (isActive()) return busy();\n',
    'function runBetween(originHubRoot, destinationHubRoot, batch, capacity) {\n    if (off()) return no(DISABLED);\n'],
  ['R054-08', 'run.train.step();\n    refresh();', 'run.train.step();\n    run.train.step();\n    refresh();'],
  ['R054-08', 'try { run.train.unload(); } catch (e) { return', "try { run.train.unload(); } catch (e) { run.train.abort('unload-failed'); return"],
  ['R054-09', 'return copy(Object.assign({ ok: true, active:', 'return (Object.assign({ ok: true, active:'],
  ['R054-10', "load = function load054() { try { lifecycle('load'); }", 'load = function load054() { try { void 0; }'],
  ['R054-11', "newWorld = function newWorld054() { try { lifecycle('new-world'); }", 'newWorld = function newWorld054() { try { void 0; }'],
  ['R054-12', "function pagehide054() { try { lifecycle('pagehide'); }", 'function pagehide054() { try { void 0; }'],
  ['R054-13', "const UNSAVED = '未保存：重新整理或讀檔就會消失';", "const UNSAVED = '未保存';"],
  ['R054-14', 'left:12px;top:296px;width:260px;height:200px', 'left:12px;top:150px;width:260px;height:200px'],
  ['R054-15', 'if (window.__noRailFreight054) {', "if (window.__noRailFreight054 === 'never') {"],
  ['R054-15', 'const no = () => ({ ok: false, reason: DISABLED, installed: false });', "const no = () => ({ ok: false, reason: 'off', installed: false });"],
  ['R054-16', 'function plan(from, to, maxSteps) {\n    if (off()) return no(DISABLED);\n', 'function plan(from, to, maxSteps) {\n'],
  ['R054-17', "const sessionId = 'lab054-' + (++seq);", "const sessionId = 'lab054-' + (++seq) + (Math.random() < 2 ? '' : 'x');"]
];
for (const [target, find, repl] of MUTANTS) {
  assert.equal(RUNTIME_SRC.split(find).length, 2, 'mutant anchor must be unique: ' + target + ' ' + find);
  const got = runSuite(RUNTIME_SRC.split(find).join(repl), false);
  assert.ok(got && got.id === target, 'mutant for ' + target + ' must first fail at ' + target + ', got ' + JSON.stringify(got));
  console.log('  red ' + target + ' ← ' + got.message);
}
console.log('  ok  負控制 ' + MUTANTS.length + ' 條，首紅都落在目標項');
console.log('\nRAIL_FREIGHT_054_RUNTIME ' + JSON.stringify({ checks: CHECKS.length, mutants: MUTANTS.length, ok: true }));

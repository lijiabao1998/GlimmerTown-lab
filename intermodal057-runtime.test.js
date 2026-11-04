'use strict';
/* T785 / LAB-07：用 Node vm 跑「執行期那份」intermodal057-runtime.js（就是內嵌進 index.html 的那份）。
 * I00–I21：以假的 052／053／054／055 介面（假 052 包的是 052 帳本身那個純 reducer，監管鏈與守恆規則是真的）
 *          驗 A1–A6 的每個理由；不用 Chrome、不用網路。
 * I22：同一個 vm 裡依 index.html 的順序裝真的 052／053／054／055 執行期與本卡，在假城市跑完整一趟（核對假介面沒有走樣）。
 * 每一條 check 擋一種壞法（寫在標題裡）；故意改壞執行期那份時，第一個紅燈要落在對應那一條。
 * 用法：node intermodal057-runtime.test.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const ROOT = __dirname;
const SRC = fs.readFileSync(path.join(ROOT, 'intermodal057-runtime.js'), 'utf8');
const UNSAVED = '未保存：重新整理或讀檔就會消失';
const L052 = fs.readFileSync(path.join(ROOT, 'single-research052.js'), 'utf8');
const FB = L052.indexOf('/* GPT-050 PURE FACTORY BEGIN */'), FE = L052.indexOf('/* GPT-050 PURE FACTORY END */');
assert.ok(FB > 0 && FE > FB, '052 pure factory markers');
// eslint-disable-next-line no-new-func
const createWarehouseCargo050 = new Function(L052.slice(FB, FE) + '\nreturn createWarehouseCargo050;')();
const plain = (v) => JSON.parse(JSON.stringify(v));

/* ---------- 假 DOM ---------- */
function makeDocument() {
  class El {
    constructor(tag) { this.tagName = String(tag).toUpperCase(); this.children = []; this.parentNode = null; this.style = { cssText: '' }; this.id = ''; this._text = ''; this.handlers = {}; this.attrs = {}; }
    set textContent(v) { this._text = String(v); this.children = []; }
    get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('\n') : this._text; }
    appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; this.children.push(c); return c; }
    removeChild(c) { const i = this.children.indexOf(c); if (i < 0) throw new Error('not a child'); this.children.splice(i, 1); c.parentNode = null; return c; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    addEventListener(type, fn) { (this.handlers[type] = this.handlers[type] || []).push(fn); }
    removeEventListener() {}
    remove() { if (this.parentNode) this.parentNode.removeChild(this); }
    click() { for (const fn of this.handlers.click || []) fn({ type: 'click', stopPropagation() {} }); }
  }
  const body = new El('body');
  const find = (node, id) => { if (node.id === id) return node; for (const c of node.children) { const f = find(c, id); if (f) return f; } return null; };
  return { body, createElement: (tag) => new El(tag), getElementById: (id) => find(body, id) };
}

/* ---------- 假 052：外殼是假的，帳本身用 052 的純 reducer（custody、守恆、事件 id 都是真的規則） ---------- */
const MANIFEST = {
  manifestId: 'lab057-test-20-food', provenance: 'qa-fixture', commodityId: 'food', total: 20, source: 'research-source',
  custodians: [{ id: 'research-source', location: 'research-source-shelf' }, { id: 'research-hub', location: 'research-hub-shelf' },
    { id: 'research-receiver', location: 'research-receiver-shelf' }]
};
function makeLedger() {
  let engine = null, sid = null, seq = 0;
  const api = {
    calls: [],
    start(limits) {
      sid = 'lab052:test:' + (++seq);
      const b = createWarehouseCargo050(sid, MANIFEST, limits);
      if (!b.ok) throw new Error('ledger start ' + b.code);
      engine = b.engine;
      return sid;
    },
    snapshot() { return engine ? { ok: true, active: true, ledger: engine.snapshot() } : { ok: true, active: false, ledger: null }; },
    command(c) { api.calls.push(plain(c)); return engine ? engine.command(c) : { ok: false, code: 'session-unavailable' }; },
    end() { engine = null; },
    batch(id) { return engine.snapshot().batches.find((b) => b.batchId === id) || null; },
    op(batchId, type, extra) {
      const s = engine.snapshot(), b = s.batches.find((x) => x.batchId === batchId);
      return engine.command({ eventId: 'qa-' + type + '-' + s.revision, sessionId: s.sessionId, batchId, type, expectedRevision: s.revision,
        payload: type === 'CREATE' ? extra : Object.assign({ owner: b.owner, location: b.location }, extra || {}) });
    }
  };
  return api;
}

/* ---------- 假 053／054／055（只模仿 LAB-07 用得到的回傳形狀；各自的規則已有自己的測試） ---------- */
function makeRoad(env) {
  let task = null, seq = 0;
  const api = { calls: [], off: false, refuse: null, badFrontage: false, provenance: { installed: true } };
  const view = () => (task ? plain(Object.assign({ ok: true, active: task.status !== 'DELIVERED' && task.status !== 'CANCELLED', disabled: api.off, pathLength: task.path.length }, task)) :
    { ok: false, reason: 'no-task', active: false, disabled: api.off });
  api.startBetween = (o, d, batch) => {
    api.calls.push(['startBetween', o, d, plain(batch)]);
    if (api.off) return { ok: false, path: [], steps: -1, reason: 'disabled' };
    if (task && task.status !== 'DELIVERED' && task.status !== 'CANCELLED') return { ok: false, path: [], steps: -1, reason: 'busy' };
    if (api.refuse) return { ok: false, path: [], steps: -1, reason: api.refuse };
    const p = env.roadPath.slice();
    task = { sessionId: 'lab053-' + (++seq), batchId: batch.batchId, qty: batch.qty, commodityId: batch.commodityId, path: p, cursor: 0,
      status: p.length === 1 ? 'DELIVERED' : 'PENDING', cancelledReason: null };
    return { ok: true, path: p.slice(), steps: p.length - 1, reason: null, originRoot: o, destinationRoot: d,
      originFrontage: [p[0]], destinationFrontage: api.badFrontage ? [] : [p[p.length - 1]], sessionId: task.sessionId };
  };
  api.snapshot = view;
  api.step = () => {
    api.calls.push(['step']);
    if (api.off) return { ok: false, reason: 'disabled', snapshot: view() };
    if (!task) return { ok: false, reason: 'no-task', snapshot: view() };
    if (task.status === 'PENDING' || task.status === 'MOVING') {
      task.status = 'MOVING'; task.cursor += 1;
      if (task.cursor >= task.path.length - 1) { task.cursor = task.path.length - 1; task.status = 'DELIVERED'; }
    }
    return { ok: true, snapshot: view() };
  };
  api.cancel = (reason) => { api.calls.push(['cancel', reason]); if (task && task.status !== 'DELIVERED' && task.status !== 'CANCELLED') { task.status = 'CANCELLED'; task.cancelledReason = reason; } return view(); };
  api.end = () => { task = null; };
  return api;
}
function makeRail(env) {
  let run = null, seq = 0;
  const api = { calls: [], off: false, refuse: null, badFrontage: false, provenance: { installed: true, defaultCapacity: 12 } };
  const live = () => run && run.status !== 'UNLOADED' && run.status !== 'ABORTED';
  const view = () => (run ? plain(Object.assign({ ok: true, active: !!live(), disabled: api.off, pathLength: run.path.length }, run)) :
    { ok: false, reason: 'no-run', active: false, disabled: api.off });
  api.runBetween = (o, d, batch, capacity) => {
    api.calls.push(['runBetween', o, d, plain(batch), capacity]);
    if (api.off) return { ok: false, path: [], steps: -1, reason: 'disabled' };
    if (live()) return { ok: false, path: [], steps: -1, reason: 'busy' };
    const cap = capacity === undefined ? 12 : capacity;
    if (batch.qty > cap) return { ok: false, path: [], steps: -1, reason: 'over-capacity', qty: batch.qty, capacity: cap };
    if (api.refuse) return { ok: false, path: [], steps: -1, reason: api.refuse };
    const p = env.railPath.slice();
    run = { sessionId: 'lab054-' + (++seq), batchId: batch.batchId, qty: batch.qty, commodityId: batch.commodityId, capacity: cap, path: p, cursor: 0, status: 'READY', abortReason: null };
    return { ok: true, path: p.slice(), steps: p.length - 1, reason: null, originRoot: o, destinationRoot: d,
      originFrontage: api.badFrontage ? [] : [p[0]], destinationFrontage: [p[p.length - 1]], sessionId: run.sessionId, capacity: cap };
  };
  api.snapshot = view;
  api.step = () => {
    api.calls.push(['step']);
    if (api.off) return { ok: false, reason: 'disabled', snapshot: view() };
    if (!run) return { ok: false, reason: 'no-run', snapshot: view() };
    if (run.status === 'READY' || run.status === 'RUNNING') {
      run.status = 'RUNNING'; run.cursor += 1;
      if (run.cursor >= run.path.length - 1) { run.cursor = run.path.length - 1; run.status = 'ARRIVED'; }
    }
    return { ok: true, snapshot: view() };
  };
  api.unload = () => { api.calls.push(['unload']); if (!run || run.status !== 'ARRIVED') return { ok: false, reason: 'not-arrived', snapshot: view() }; run.status = 'UNLOADED'; return { ok: true, snapshot: view() }; };
  api.abort = (reason) => { api.calls.push(['abort', reason]); if (live()) { run.status = 'ABORTED'; run.abortReason = reason; } return view(); };
  api.end = () => { run = null; };
  return api;
}
function makeBlock(env) {
  const trains = new Map(), waiting = [];
  let holder = null;
  const api = { calls: [], off: false, refuse: null, routeOverride: null, provenance: { installed: true } };
  const act = (t) => t.status === 'READY' || t.status === 'RUNNING';
  const count = () => [...trains.values()].filter(act).length;
  const tv = (t) => ({ id: t.id, status: t.status, cursor: t.cursor, pathLength: t.path.length, run054: t.run054, abortReason: t.abortReason || null });
  const done = (t, st, why) => { t.status = st; if (why) t.abortReason = why; const w = waiting.indexOf(t.id); if (w >= 0) waiting.splice(w, 1); if (holder === t.id) holder = waiting.length ? waiting.shift() : null; };
  const add = (id, p, run054) => { const t = { id, path: p.slice(), cursor: 0, status: 'READY', run054 }; trains.set(id, t); return t; };
  api.spawnFor054 = (id) => {
    api.calls.push(['spawnFor054', id]);
    if (api.off) return { ok: false, reason: 'disabled' };
    if (api.refuse) return { ok: false, reason: api.refuse };
    if (trains.has(id)) return { ok: false, reason: 'duplicate' };
    const s = env.rail.snapshot();
    if (!s.ok || !s.active || s.status !== 'READY') return { ok: false, reason: 'no-run054' };
    if (count() >= 2) return { ok: false, reason: 'too-many', maxTrains: 2 };
    for (const i of s.path) if (!env.hasRail(i)) return { ok: false, reason: 'track-broken', tile: i, x: i % env.n, y: (i / env.n) | 0 };
    add(id, s.path, s.sessionId);
    return { ok: true, id, status: 'READY', path: (api.routeOverride || s.path).slice(), steps: s.path.length - 1, run054: s.sessionId };
  };
  api.other = (id, p) => { add(id, p, null); }; // 測試用：另一列（不是聯運的）
  api.request = (id) => {
    api.calls.push(['request', id]);
    if (api.off) return { ok: false, reason: 'disabled' };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: 'unknown-train' };
    if (!act(t)) return { ok: false, reason: 'already-finished' };
    if (holder === id || waiting.includes(id)) return { ok: false, reason: 'duplicate' };
    if (holder === null) { holder = id; return { ok: true, status: 'GRANTED', id }; }
    waiting.push(id);
    return { ok: true, status: 'WAITING', id, position: waiting.length };
  };
  api.advance = (id) => {
    api.calls.push(['advance', id]);
    if (api.off) return { ok: false, reason: 'disabled' };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: 'unknown-train' };
    if (t.status === 'ARRIVED') return { ok: true, moved: false, arrived: true, granted: null, snapshot: tv(t) };
    if (t.status === 'ABORTED') return { ok: false, reason: 'already-finished' };
    if (holder !== id) return { ok: false, reason: 'no-authority', holder };
    if (t.cursor >= t.path.length - 1) { done(t, 'ARRIVED'); return { ok: true, moved: false, arrived: true, granted: holder, snapshot: tv(t) }; }
    const next = t.path[t.cursor + 1];
    if (!env.hasRail(next)) return { ok: false, reason: 'track-broken', tile: next, x: next % env.n, y: (next / env.n) | 0 };
    t.cursor += 1; t.status = 'RUNNING';
    let arrived = false;
    if (t.cursor >= t.path.length - 1) { arrived = true; done(t, 'ARRIVED'); }
    return { ok: true, moved: true, arrived, granted: arrived ? holder : null, snapshot: tv(t) };
  };
  api.abort = (id, why) => { api.calls.push(['abort', id, why]); if (api.off) return { ok: false, reason: 'disabled' }; const t = trains.get(id); if (!t) return { ok: false, reason: 'unknown-train' }; if (!act(t)) return { ok: false, reason: 'already-finished' }; done(t, 'ABORTED', why); return { ok: true }; };
  api.snapshot = () => plain({ ok: true, installed: true, disabled: api.off, holder, waiting: waiting.slice(), active: count(), trains: [...trains.values()].map(tv) });
  api.end = () => { trains.clear(); waiting.length = 0; holder = null; };
  return api;
}

/* ---------- 環境：12×12 假城市 ----------
 *   (1,0) 起點物流建築 k168（根格）；道路 y=1，x=1..6；轉運 k166 根格在 (7,0)（佔 (7..10,0..3)，前接道路 (6,1)，貼軌 (7,4)）；
 *   鐵軌 y=4，x=7..11；目的 k166 根格在 (11,5)。另一棟 k166 在 (1,6)（A2 用）；k168 根格在 (4,6)。 */
const N = 12;
function makeEnv(opts) {
  const o = opts || {};
  const listeners = [];
  const calls = { load: [], newWorld: [] };
  const id = (x, y) => y * N + x;
  const freshTiles = () => {
    const t = Array.from({ length: N * N }, () => ({ t: 2 }));
    for (let x = 1; x <= 6; x++) t[id(x, 1)].road = 1;
    for (let x = 7; x <= 11; x++) t[id(x, 4)].rail = 1;
    t[id(1, 0)].bld = { k: 168, sz: 1 };
    t[id(7, 0)].bld = { k: 166, sz: 1 };
    t[id(8, 0)].bld = { k: 166, ref: [7, 0] };
    t[id(11, 5)].bld = { k: 166, sz: 1 };
    t[id(1, 6)].bld = { k: 166, sz: 1 };
    t[id(4, 6)].bld = { k: 168, sz: 1 };
    return t;
  };
  const ctx = { console };
  ctx.N = N;
  ctx.tiles = freshTiles();
  const nativeLoad = function (...args) { calls.load.push({ self: this, args }); ctx.tiles = freshTiles(); return 'native-load'; };
  const nativeNewWorld = function (...args) { calls.newWorld.push({ self: this, args }); ctx.tiles = freshTiles(); return 'native-world'; };
  ctx.load = nativeLoad;
  ctx.newWorld = nativeNewWorld;
  const document = o.dom === false ? null : makeDocument();
  if (document) ctx.document = document;
  ctx.window = { GV: {}, addEventListener: (type, fn) => listeners.push({ type, fn }) };
  if (o.valve) ctx.window.__noIntermodal057 = true;
  const env = {
    ctx, n: N, id, listeners, calls, nativeLoad, nativeNewWorld, document,
    roadPath: [1, 2, 3, 4, 5, 6].map((x) => id(x, 1)),
    railPath: [7, 8, 9, 10, 11].map((x) => id(x, 4)),
    hasRail: (i) => !!(ctx.tiles[i] && ctx.tiles[i].rail),
    get api() { return ctx.window.GV.intermodal057; },
    panel() { return document ? document.getElementById('lab057Panel') : null; },
    cut(x, y, kind) { delete ctx.tiles[id(x, y)][kind]; },
    lay(x, y, kind) { ctx.tiles[id(x, y)][kind] = 1; }
  };
  env.ledger = makeLedger();
  env.road = makeRoad(env);
  env.rail = makeRail(env);
  env.block = makeBlock(env);
  if (o.deps !== false) {
    ctx.window.GV.singleResearch052 = env.ledger;
    ctx.window.GV.roadDelivery053 = env.road;
    ctx.window.GV.railFreight054 = env.rail;
    ctx.window.GV.railBlock055 = env.block;
  }
  if (o.ledger !== false) {
    env.ledger.start(o.limits);
    assert.equal(env.ledger.op('batch-A', 'CREATE', { commodityId: 'food', qty: 7, source: 'research-source', destination: 'research-receiver' }).ok, true);
    assert.equal(env.ledger.op('batch-B', 'CREATE', { commodityId: 'food', qty: 8, source: 'research-source', destination: 'research-hub' }).ok, true);
  }
  vm.createContext(ctx);
  vm.runInContext('Math.random = function () { throw new Error("Math.random used"); };' +
    'Date = new Proxy(Date, { construct() { throw new Error("Date used"); }, apply() { throw new Error("Date used"); }, get(t, k) { if (k === "now") return function () { throw new Error("Date.now used"); }; return t[k]; } });', ctx);
  vm.runInContext(SRC, ctx, { filename: 'intermodal057-runtime.js' });
  return env;
}
const TRIP = (env, over) => Object.assign({
  batchId: 'batch-A', originCustodian: 'research-source', destinationCustodian: 'research-receiver',
  roadFrom: env.id(1, 0), roadTo: env.id(7, 0), railFrom: env.id(7, 0), railTo: env.id(11, 5)
}, over || {});
const run = (env, n) => { const out = []; for (let k = 0; k < n; k++) out.push(env.api.advance()); return out; };
const toEnd = (env) => { let r = null; for (let k = 0; k < 64; k++) { r = env.api.advance(); if (!r.ok || r.delivered) break; } return r; };
const callNames = (fake) => fake.calls.map((c) => c[0]);

let checks = 0;
function check(label, fn) {
  try { fn(); } catch (e) {
    console.log('  FAIL ' + label);
    console.log('INTERMODAL057_RUNTIME FIRST_RED ' + JSON.stringify({ label, message: String(e && e.message).split('\n')[0] }));
    process.exit(1);
  }
  checks++;
  console.log('  ok  ' + label);
}

check('I00 決定性：沒有亂數、沒有現實時間；同一串操作跑兩次逐位相同', () => {
  const script = (env) => {
    const log = [env.api.start(TRIP(env))];
    log.push(...run(env, 3));
    env.cut(5, 1, 'road');
    log.push(...run(env, 2));
    env.lay(5, 1, 'road');
    log.push(...run(env, 12), env.api.snapshot());
    log.push(env.api.start(TRIP(env, { batchId: 'batch-B', destinationCustodian: 'research-hub' })), env.api.cancel('x'), env.api.snapshot());
    return JSON.stringify(log);
  };
  const a = script(makeEnv()), b = script(makeEnv());
  assert.equal(a, b);
  assert.ok(a.length > 2000);
});

check('I01 安裝：介面齊全、凍結；provenance 寫明帳、兩段、路權、轉運 k166；沒有行程時快照乾淨', () => {
  const { api } = makeEnv();
  for (const k of ['start', 'advance', 'cancel', 'snapshot', 'open', 'refresh', 'end', 'disable']) assert.equal(typeof api[k], 'function', k);
  assert.equal(Object.isFrozen(api), true);
  assert.equal(Object.isFrozen(api.provenance), true);
  assert.deepEqual(plain(api.provenance), {
    installed: true, module: 'intermodal057', lab: 'LAB-07', card: 'T785', isolation: 'shadow-only', persisted: false,
    ledger: 'GV.singleResearch052', legs: ['road:GV.roadDelivery053.startBetween', 'rail:GV.railFreight054.runBetween'],
    authority: 'GV.railBlock055.spawnFor054', interchangeK: 166, panel: 'left-slot-3'
  });
  assert.deepEqual(plain(api.snapshot()), { ok: false, reason: 'no-trip', active: false, disabled: false, lastEnded: null });
});

check('I02 A1 帳：沒有會話、沒有批次、狀態不是 SOURCE_READY、持有人不是起點、目的地對不上、超載 → 各自的理由，兩段都沒動', () => {
  const none = makeEnv({ ledger: false });
  assert.deepEqual(plain(none.api.start(TRIP(none))), { ok: false, reason: 'ledger-unavailable', code: 'session-unavailable' });
  const env = makeEnv();
  const { api } = env;
  assert.deepEqual(plain(api.start(TRIP(env, { batchId: 'batch-Z' }))), { ok: false, reason: 'batch-unavailable', batchId: 'batch-Z' });
  assert.deepEqual(plain(api.start(TRIP(env, { originCustodian: 'research-hub' }))),
    { ok: false, reason: 'not-at-source', owner: 'research-source', source: 'research-source', originCustodian: 'research-hub' });
  assert.deepEqual(plain(api.start(TRIP(env, { destinationCustodian: 'research-hub' }))),
    { ok: false, reason: 'destination-mismatch', destination: 'research-receiver', destinationCustodian: 'research-hub' });
  assert.deepEqual(plain(api.start(TRIP(env, { capacity: 6 }))), { ok: false, reason: 'over-capacity', qty: 7, capacity: 6 });
  assert.equal(env.ledger.op('batch-B', 'HANDOFF', { to: 'research-hub' }).ok, true);
  assert.deepEqual(plain(api.start(TRIP(env, { batchId: 'batch-B', destinationCustodian: 'research-hub' }))), { ok: false, reason: 'batch-not-ready', state: 'HELD' });
  assert.equal(env.ledger.op('batch-A', 'FREEZE', { reason: 'qa' }).ok, true);
  assert.deepEqual(plain(api.start(TRIP(env))), { ok: false, reason: 'batch-not-ready', state: 'FROZEN' });
  assert.deepEqual([env.road.calls.length, env.rail.calls.length, env.block.calls.length], [0, 0, 0]);
  assert.equal(api.snapshot().reason, 'no-trip');
  // 持有人＝起點但 owner≠source 的帳（真 052 不會出現；假帳造一個，確認兩個條件都查）
  const odd = makeEnv();
  const snap = odd.ledger.snapshot;
  odd.ledger.snapshot = () => { const s = snap(); s.ledger.batches[0].source = 'research-hub'; return s; };
  assert.equal(odd.api.start(TRIP(odd)).reason, 'not-at-source');
});

check('I03 A1 呼叫端不能另給數量與商品；欄位多、少、壞都是 bad-input；兩段拿到的是帳上的批次、數量、商品', () => {
  const env = makeEnv();
  const { api } = env;
  for (const k of ['qty', 'commodityId', 'cargo', 'batch']) assert.deepEqual(plain(api.start(TRIP(env, { [k]: 7 }))), { ok: false, reason: 'bad-input', detail: 'ledger-owned', field: k }, k);
  assert.deepEqual(plain(api.start(TRIP(env, { speed: 2 }))), { ok: false, reason: 'bad-input', detail: 'unknown-field', field: 'speed' });
  for (const k of ['batchId', 'originCustodian', 'destinationCustodian', 'roadFrom', 'roadTo', 'railFrom', 'railTo']) {
    const o = TRIP(env); delete o[k];
    assert.deepEqual(plain(api.start(o)), { ok: false, reason: 'bad-input', detail: 'missing', field: k }, 'missing ' + k);
  }
  for (const [k, v] of [['batchId', ''], ['batchId', 'bad id'], ['originCustodian', 3], ['roadFrom', -1], ['roadTo', N * N], ['railTo', 1.5], ['capacity', 0], ['capacity', '12']]) {
    assert.equal(api.start(TRIP(env, { [k]: v })).reason, 'bad-input', k + '=' + v);
  }
  for (const bad of [null, 7, 'trip', [TRIP(env)]]) assert.deepEqual(plain(api.start(bad)), { ok: false, reason: 'bad-input', detail: 'opts' });
  assert.deepEqual([env.road.calls.length, env.rail.calls.length], [0, 0]);
  const r = api.start(TRIP(env, { capacity: 9 }));
  assert.equal(r.ok, true);
  assert.deepEqual(plain(env.road.calls[0]), ['startBetween', env.id(1, 0), env.id(7, 0), { batchId: 'batch-A', qty: 7, commodityId: 'food' }]);
  assert.deepEqual(plain(env.rail.calls[0]), ['runBetween', env.id(7, 0), env.id(11, 5), { batchId: 'batch-A', qty: 7, commodityId: 'food' }, 9]);
  assert.deepEqual([r.qty, r.commodityId, r.capacity, r.roadSteps, r.railSteps], [7, 'food', 9, 5, 4]);
});

check('I04 A2 轉運：不是同一棟 → no-interchange（different-buildings）；不是 k166 根格 → not-k166；兩段接不上轉運點 → leg-endpoints 並收掉兩段', () => {
  const env = makeEnv();
  const { api, id } = env;
  assert.deepEqual(plain(api.start(TRIP(env, { railFrom: id(1, 6) }))), { ok: false, reason: 'no-interchange', detail: 'different-buildings', roadTo: id(7, 0), railFrom: id(1, 6) });
  assert.deepEqual(plain(api.start(TRIP(env, { roadTo: id(4, 6), railFrom: id(4, 6) }))), { ok: false, reason: 'no-interchange', detail: 'not-k166', hub: id(4, 6) });
  assert.deepEqual(plain(api.start(TRIP(env, { roadTo: id(8, 0), railFrom: id(8, 0) }))), { ok: false, reason: 'no-interchange', detail: 'not-k166', hub: id(8, 0) }, 'ref tile is not a root');
  assert.deepEqual([env.road.calls.length, env.rail.calls.length], [0, 0]);
  env.road.badFrontage = true;
  assert.deepEqual(plain(api.start(TRIP(env))), { ok: false, reason: 'no-interchange', detail: 'leg-endpoints' });
  assert.equal(env.road.snapshot().status, 'CANCELLED');
  assert.equal(env.road.snapshot().cancelledReason, 'lab057:interchange-mismatch');
  assert.equal(env.rail.snapshot().status, 'ABORTED');
  env.road.badFrontage = false; env.rail.badFrontage = true;
  assert.equal(api.start(TRIP(env)).detail, 'leg-endpoints', 'rail start must touch the same hub');
  assert.equal(api.snapshot().reason, 'no-trip');
});

check('I05 A2 兩段排不出來就整趟不開始：道路段的理由照傳；鐵路段被拒 → 道路段那一筆取消', () => {
  const env = makeEnv();
  const { api } = env;
  env.road.refuse = 'unreachable';
  assert.deepEqual(plain(api.start(TRIP(env))).reason, 'unreachable');
  assert.equal(api.start(TRIP(env)).leg, 'road');
  assert.equal(env.rail.calls.length, 0, 'rail is not asked when the road leg fails');
  env.road.refuse = null; env.rail.refuse = 'hub-not-on-rail';
  const r = api.start(TRIP(env));
  assert.deepEqual([r.ok, r.reason, r.leg], [false, 'hub-not-on-rail', 'rail']);
  assert.equal(env.road.snapshot().status, 'CANCELLED');
  assert.equal(env.road.snapshot().cancelledReason, 'lab057:rail-leg-refused');
  assert.equal(api.snapshot().reason, 'no-trip');
  assert.equal(env.ledger.batch('batch-A').state, 'SOURCE_READY', 'ledger untouched');
});

check('I06 全程：道路逐格 → 轉運點登記並拿到路權 → 鐵路逐格（054 同步）→ 到站卸貨、HANDOFF；帳上同一批次 SOURCE_READY→HELD，數量不變、守恆', () => {
  const env = makeEnv();
  const { api, id } = env;
  const before = env.ledger.snapshot().ledger;
  const s = api.start(TRIP(env));
  assert.deepEqual([s.ok, s.status, s.tripId], [true, 'ROAD', 'lab057-1']);
  for (let k = 1; k <= 5; k++) {
    const r = api.advance();
    assert.deepEqual([r.ok, r.moved, r.leg], [true, true, 'road'], 'road step ' + k);
    assert.equal(env.road.snapshot().cursor, k);
    assert.equal(r.snapshot.road.cursor, k);
  }
  assert.equal(api.snapshot().status, 'INTERCHANGE');
  assert.equal(env.road.snapshot().status, 'DELIVERED');
  assert.equal(env.block.calls.length, 0, 'no authority asked before the interchange');
  const x = api.advance();
  assert.deepEqual([x.ok, x.leg, x.authority, x.snapshot.status], [true, 'interchange', 'GRANTED', 'RAIL']);
  assert.deepEqual(callNames(env.block), ['spawnFor054', 'request']);
  assert.equal(env.block.snapshot().holder, 'lab057-1');
  for (let k = 1; k <= 3; k++) {
    const r = api.advance();
    assert.deepEqual([r.ok, r.moved, r.leg, r.delivered], [true, true, 'rail', undefined], 'rail step ' + k);
    assert.equal(env.rail.snapshot().cursor, k);
    assert.equal(env.block.snapshot().trains[0].cursor, k);
  }
  const last = api.advance();
  assert.deepEqual([last.ok, last.delivered, last.snapshot.status], [true, true, 'DELIVERED']);
  assert.equal(env.rail.snapshot().status, 'UNLOADED');
  assert.equal(env.block.snapshot().holder, null, 'authority released on arrival');
  assert.equal(env.block.snapshot().trains[0].status, 'ARRIVED');
  const b = env.ledger.batch('batch-A');
  assert.deepEqual([b.state, b.owner, b.location, b.qty, b.commodityId], ['HELD', 'research-receiver', 'research-receiver-shelf', 7, 'food']);
  assert.deepEqual(plain(last.handoff), { written: true, ok: true, eventId: 'lab057-1-handoff', sessionId: before.sessionId, batchId: 'batch-A', type: 'HANDOFF',
    revision: before.revision + 1, state: 'HELD', owner: 'research-receiver', location: 'research-receiver-shelf', qty: 7 });
  const h = env.ledger.calls.find((c) => c.type === 'HANDOFF');
  assert.deepEqual(plain(h.payload), { owner: 'research-source', location: 'research-source-shelf', to: 'research-receiver' }, 'custody chain from the ledger');
  const after = env.ledger.snapshot().ledger;
  assert.equal(after.conservation.ok, true);
  assert.equal(after.conservation.accounted, 20);
  assert.equal(after.unissued, before.unissued, 'nothing minted');
  assert.equal(after.batches.length, before.batches.length, 'no second batch');
  assert.equal(env.ledger.calls.filter((c) => c.type !== 'HANDOFF').length, 0, 'only one ledger write');
  assert.equal(api.snapshot().rail.at, id(11, 4));
  assert.equal(api.advance().reason, 'already-finished');
});

check('I06b 兩段都只有一格（前接貼著轉運點、轉運點的軌貼著目的地）：開始就在轉運點；055 不動也算到站，054 同步到站後才 HANDOFF', () => {
  const env = makeEnv();
  env.roadPath = [env.id(6, 1)];
  env.railPath = [env.id(7, 4)];
  const s = env.api.start(TRIP(env));
  assert.deepEqual([s.ok, s.status, s.roadSteps, s.railSteps], [true, 'INTERCHANGE', 0, 0]);
  assert.equal(env.road.calls.filter((c) => c[0] === 'step').length, 0);
  assert.equal(env.api.advance().authority, 'GRANTED');
  const last = env.api.advance();
  assert.deepEqual([last.ok, last.moved, last.delivered], [true, false, true]);
  assert.deepEqual([env.rail.snapshot().status, env.rail.snapshot().cursor], ['UNLOADED', 0]);
  assert.equal(env.ledger.batch('batch-A').state, 'HELD');
});

check('I07 A3 拿不到路權就在轉運點等：WAITING 期間 054／055 都不動；前一列到站交棒後才上鐵路，到站釋放', () => {
  const env = makeEnv();
  const { api } = env;
  env.block.other('other', env.railPath.slice().reverse());
  assert.equal(env.block.request('other').status, 'GRANTED');
  api.start(TRIP(env));
  run(env, 5);
  const x = api.advance();
  assert.deepEqual([x.ok, x.authority, x.position, x.snapshot.status], [true, 'WAITING', 1, 'WAITING_AUTHORITY']);
  for (let k = 0; k < 3; k++) {
    const w = api.advance();
    assert.deepEqual([w.ok, w.reason, w.holder, w.position], [false, 'waiting-authority', 'other', 1]);
  }
  assert.equal(env.rail.snapshot().cursor, 0);
  assert.equal(env.block.snapshot().trains.find((t) => t.id === 'lab057-1').cursor, 0);
  assert.equal(env.block.calls.filter((c) => c[0] === 'advance').length, 0, 'never pushes without authority');
  for (let k = 0; k < 4; k++) env.block.advance('other');
  assert.equal(env.block.snapshot().holder, 'lab057-1', 'FIFO handover');
  const g = api.advance();
  assert.deepEqual([g.ok, g.authority, g.snapshot.status], [true, 'GRANTED', 'RAIL']);
  assert.equal(toEnd(env).delivered, true);
  assert.equal(env.block.snapshot().holder, null);
});

check('I08 A3 名額滿（兩列在冊）也在轉運點等：too-many 不算失敗；名額一空就登記', () => {
  const env = makeEnv();
  const { api } = env;
  env.block.other('o1', env.railPath); env.block.other('o2', env.railPath);
  env.block.request('o1'); env.block.request('o2');
  api.start(TRIP(env));
  run(env, 5);
  for (let k = 0; k < 2; k++) {
    const w = api.advance();
    assert.deepEqual([w.ok, w.reason, w.detail, w.snapshot.status], [false, 'waiting-authority', 'too-many', 'INTERCHANGE']);
  }
  env.block.abort('o2', 'qa');
  const x = api.advance();
  assert.deepEqual([x.ok, x.authority], [true, 'WAITING']);
});

check('I09 A5 道路段每一步重讀真路：前方一格被拆 → road-broken 停在原地（053 不動）；鋪回 → 繼續', () => {
  const env = makeEnv();
  const { api, id } = env;
  api.start(TRIP(env));
  run(env, 2);
  env.cut(4, 1, 'road');
  for (let k = 0; k < 3; k++) {
    const r = api.advance();
    assert.deepEqual([r.ok, r.reason, r.leg, r.tile, r.x, r.y], [false, 'road-broken', 'road', id(4, 1), 4, 1]);
  }
  assert.equal(env.road.snapshot().cursor, 2);
  assert.equal(env.road.calls.filter((c) => c[0] === 'step').length, 2, 'no step while broken');
  assert.deepEqual(plain(api.snapshot().blocked), { reason: 'road-broken', leg: 'road', tile: id(4, 1), x: 4, y: 1 });
  env.lay(4, 1, 'road');
  const r = api.advance();
  assert.deepEqual([r.ok, r.moved, r.snapshot.road.cursor, r.snapshot.blocked], [true, true, 3, null]);
});

check('I10 A5 鐵路段每一步重讀真軌：轉運點登記前缺軌 → track-broken（第一格）；路上前方被拆 → 停住、054 不動；鋪回 → 繼續到站', () => {
  const env = makeEnv();
  const { api, id } = env;
  api.start(TRIP(env));
  run(env, 5);
  env.cut(9, 4, 'rail');
  const a = api.advance();
  assert.deepEqual([a.ok, a.reason, a.leg, a.tile, a.snapshot.status], [false, 'track-broken', 'rail', id(9, 4), 'INTERCHANGE']);
  env.lay(9, 4, 'rail');
  assert.equal(api.advance().authority, 'GRANTED');
  api.advance();
  env.cut(9, 4, 'rail');
  for (let k = 0; k < 3; k++) {
    const r = api.advance();
    assert.deepEqual([r.ok, r.reason, r.tile, r.x, r.y], [false, 'track-broken', id(9, 4), 9, 4]);
  }
  assert.equal(env.rail.snapshot().cursor, 1);
  assert.equal(env.rail.calls.filter((c) => c[0] === 'step').length, 1, '054 not stepped while broken');
  env.lay(9, 4, 'rail');
  assert.equal(toEnd(env).delivered, true);
});

check('I11 A5 轉運點的 k166 被拆 → no-interchange（hub-gone）停在轉運點；蓋回 → 繼續', () => {
  const env = makeEnv();
  const { api, id, ctx } = env;
  api.start(TRIP(env));
  run(env, 5);
  const hub = ctx.tiles[id(7, 0)].bld;
  delete ctx.tiles[id(7, 0)].bld;
  const r = api.advance();
  assert.deepEqual([r.ok, r.reason, r.detail, r.hub, r.snapshot.status], [false, 'no-interchange', 'hub-gone', id(7, 0), 'INTERCHANGE']);
  assert.equal(env.block.calls.length, 0);
  ctx.tiles[id(7, 0)].bld = hub;
  assert.equal(api.advance().authority, 'GRANTED');
});

check('I12 A5 進行中再開 → busy（不碰兩段）；交付後可以開下一趟，上一趟留在 lastEnded', () => {
  const env = makeEnv();
  const { api } = env;
  api.start(TRIP(env));
  api.advance();
  const b = api.start(TRIP(env, { batchId: 'batch-B', destinationCustodian: 'research-hub' }));
  assert.deepEqual(plain(b), { ok: false, reason: 'busy', tripId: 'lab057-1', status: 'ROAD' });
  assert.equal(env.road.calls.filter((c) => c[0] === 'startBetween').length, 1);
  toEnd(env);
  const n = api.start(TRIP(env, { batchId: 'batch-B', destinationCustodian: 'research-hub' }));
  assert.deepEqual([n.ok, n.tripId], [true, 'lab057-2']);
  const s = api.snapshot();
  assert.deepEqual([s.lastEnded.endedBy, s.lastEnded.tripId, s.lastEnded.status], ['replaced', 'lab057-1', 'DELIVERED']);
});

check('I13 A4 取消：收掉三段（055 釋放路權）並對帳下 FREEZE 寫原因；數量不變、守恆', () => {
  const env = makeEnv();
  const { api } = env;
  api.start(TRIP(env));
  run(env, 7);
  assert.equal(api.snapshot().status, 'RAIL');
  const c = api.cancel('qa-stop');
  assert.deepEqual([c.status, c.cancelledReason, c.active], ['CANCELLED', 'qa-stop', false]);
  assert.deepEqual(plain(c.ledger.freeze), { written: true, ok: true, eventId: 'lab057-1-freeze', sessionId: env.ledger.snapshot().ledger.sessionId, batchId: 'batch-A',
    type: 'FREEZE', revision: 3, state: 'FROZEN', owner: 'research-source', location: 'research-source-shelf', qty: 7 });
  const f = env.ledger.calls.find((x) => x.type === 'FREEZE');
  assert.deepEqual(plain(f.payload), { owner: 'research-source', location: 'research-source-shelf', reason: 'lab057:cancel:qa-stop' });
  const b = env.ledger.batch('batch-A');
  assert.deepEqual([b.state, b.frozenReason, b.qty], ['FROZEN', 'lab057:cancel:qa-stop', 7]);
  assert.equal(env.ledger.snapshot().ledger.conservation.ok, true);
  assert.equal(env.rail.snapshot().status, 'ABORTED');
  assert.equal(env.rail.snapshot().abortReason, 'lab057:cancel:qa-stop');
  assert.deepEqual([env.block.snapshot().trains[0].status, env.block.snapshot().holder], ['ABORTED', null]);
  assert.equal(api.advance().reason, 'already-finished');
  assert.equal(api.cancel('again').ledger.freeze.eventId, 'lab057-1-freeze', 'second cancel is a no-op');
  assert.equal(env.ledger.calls.filter((x) => x.type === 'FREEZE').length, 1);
  // 道路段取消：053 那一筆也收掉
  const e2 = makeEnv();
  e2.api.start(TRIP(e2));
  e2.api.advance();
  e2.api.cancel('early');
  assert.deepEqual([e2.road.snapshot().status, e2.road.snapshot().cancelledReason], ['CANCELLED', 'lab057:cancel:early']);
  assert.equal(e2.ledger.batch('batch-A').state, 'FROZEN');
});

check('I14 A5 讀檔、開新城、pagehide：取消並 FREEZE、清掉行程與面板；原生 load／newWorld 照常呼叫一次（this、參數照傳）', () => {
  for (const kind of ['load', 'newWorld', 'pagehide']) {
    const env = makeEnv();
    const { api } = env;
    api.start(TRIP(env));
    run(env, 3);
    api.open();
    const ledgerSession = env.ledger.snapshot().ledger.sessionId;
    if (kind === 'pagehide') {
      const ph = env.listeners.filter((l) => l.type === 'pagehide');
      assert.equal(ph.length, 1);
      ph[0].fn({ type: 'pagehide' });
    } else {
      const self = { tag: 'this' };
      assert.equal(env.ctx[kind].call(self, 5, 'x'), kind === 'load' ? 'native-load' : 'native-world');
      assert.equal(env.calls[kind].length, 1);
      assert.equal(env.calls[kind][0].self, self);
      assert.deepEqual(env.calls[kind][0].args, [5, 'x']);
    }
    const s = api.snapshot();
    assert.deepEqual([s.ok, s.reason, s.active], [false, 'no-trip', false], kind);
    const why = kind === 'newWorld' ? 'new-world' : kind;
    assert.deepEqual([s.lastEnded.endedBy, s.lastEnded.status, s.lastEnded.cancelledReason], [why, 'CANCELLED', why], kind);
    assert.deepEqual([s.lastEnded.ledger.freeze.ok, s.lastEnded.ledger.freeze.state, s.lastEnded.ledger.freeze.sessionId], [true, 'FROZEN', ledgerSession], kind);
    assert.equal(env.ledger.batch('batch-A').frozenReason, 'lab057:cancel:' + why);
    assert.equal(env.panel(), null, kind + ' removes the panel');
    assert.equal(env.road.snapshot().status, 'CANCELLED', kind);
  }
});

check('I15 A4 監管鏈被別人動過（帳上被交接／凍結／會話換了）→ custody-lost 中止，不再寫帳，收掉各段', () => {
  const cases = [
    ['handoff', (env) => env.ledger.op('batch-A', 'HANDOFF', { to: 'research-receiver' }), 'batch-changed'],
    ['freeze', (env) => env.ledger.op('batch-A', 'FREEZE', { reason: 'other' }), 'batch-changed'],
    ['ended', (env) => env.ledger.end(), 'session-unavailable'],
    ['restarted', (env) => { env.ledger.end(); env.ledger.start(); env.ledger.op('batch-A', 'CREATE', { commodityId: 'food', qty: 7, source: 'research-source', destination: 'research-receiver' }); }, 'session-changed']
  ];
  for (const [name, mess, code] of cases) {
    const env = makeEnv();
    env.api.start(TRIP(env));
    run(env, 2);
    const writes = env.ledger.calls.length;
    mess(env);
    const r = env.api.advance();
    assert.deepEqual([r.ok, r.reason, r.detail, r.snapshot.status], [false, 'custody-lost', code, 'FAILED'], name);
    assert.deepEqual(plain(r.freeze), { ok: false, code: 'not-attempted', written: false }, name);
    assert.equal(env.ledger.calls.length, writes, name + ': LAB-07 wrote nothing to the ledger');
    assert.equal(env.road.snapshot().status, 'CANCELLED', name);
    assert.equal(env.rail.snapshot().status, 'ABORTED', name);
  }
});

check('I16 A5 各段被別人推、被收、被清 → leg-lost 中止並 FREEZE（寫明哪一段）', () => {
  const cases = [
    ['road-desync', (env) => env.road.step(), 2],
    ['road-cancelled', (env) => env.road.cancel('other'), 2],
    ['road', (env) => env.road.end(), 2],
    ['rail-desync', (env) => env.rail.step(), 2],
    ['rail-aborted', (env) => env.rail.abort('other'), 2],
    ['rail', (env) => env.rail.end(), 2],
    ['block', (env) => env.block.end(), 7],
    ['block', (env) => { env.block.end(); env.block.other('lab057-1', env.railPath); }, 6],
    ['block-aborted', (env) => env.block.abort('lab057-1', 'other'), 7],
    ['block-desync', (env) => env.block.advance('lab057-1'), 7]
  ];
  for (const [name, mess, at] of cases) {
    const env = makeEnv();
    env.api.start(TRIP(env));
    run(env, at);
    mess(env);
    const r = env.api.advance();
    assert.deepEqual([r.ok, r.reason, r.detail, r.snapshot.status], [false, 'leg-lost', name, 'FAILED'], name);
    assert.deepEqual([r.freeze.ok, r.freeze.state], [true, 'FROZEN'], name);
    assert.equal(env.ledger.batch('batch-A').frozenReason, 'lab057:leg-lost:' + name, name);
  }
  // 055 回不在預期內的拒絕、路線跟 054 不同 → 也是 leg-lost
  const odd = makeEnv();
  odd.api.start(TRIP(odd));
  run(odd, 5);
  odd.block.refuse = 'no-run054';
  assert.equal(odd.api.advance().detail, 'block-register:no-run054');
  const mm = makeEnv();
  mm.api.start(TRIP(mm));
  run(mm, 5);
  mm.block.routeOverride = mm.railPath.slice(0, 3);
  assert.equal(mm.api.advance().detail, 'block-route-mismatch');
});

check('I17 依賴：開始時少一段 → dependency-unavailable（列出缺哪段）；某段閥門開著 → disabled 並列出；路上閥門開著 → 停住不算失敗', () => {
  for (const name of ['ledger', 'road', 'rail', 'block']) {
    const env = makeEnv();
    const key = { ledger: 'singleResearch052', road: 'roadDelivery053', rail: 'railFreight054', block: 'railBlock055' }[name];
    delete env.ctx.window.GV[key];
    assert.deepEqual(plain(env.api.start(TRIP(env))), { ok: false, reason: 'dependency-unavailable', missing: [name] }, name);
  }
  const env = makeEnv();
  env.rail.off = true;
  assert.deepEqual(plain(env.api.start(TRIP(env))), { ok: false, reason: 'dependency-unavailable', detail: 'disabled', legs: ['rail'] });
  env.rail.off = false;
  env.api.start(TRIP(env));
  env.api.advance();
  env.block.off = true;
  const r = env.api.advance();
  assert.deepEqual(plain([r.ok, r.reason, r.detail, r.legs, r.snapshot.status]), [false, 'dependency-unavailable', 'disabled', ['block'], 'ROAD']);
  assert.equal(env.road.snapshot().cursor, 1);
  env.block.off = false;
  assert.equal(env.api.advance().ok, true);
  const stub = makeEnv();
  stub.ctx.window.GV.roadDelivery053 = Object.assign({}, stub.road, { provenance: { installed: false } });
  assert.deepEqual(plain(stub.api.start(TRIP(stub))).legs, ['road'], 'install-time stub counts as disabled');
});

check('I18 A4 到站時帳寫不進去（事件數滿）→ ledger-write-failed 中止，照實記下 052 的回覆；批次留在原地沒有消失', () => {
  const env = makeEnv({ limits: { maxEvents: 2 } });
  const { api } = env;
  api.start(TRIP(env));
  const r = toEnd(env);
  assert.deepEqual([r.ok, r.reason, r.code, r.snapshot.status], [false, 'ledger-write-failed', 'event-limit', 'FAILED']);
  assert.deepEqual(plain(r.snapshot.ledger.handoff), { written: false, ok: false, code: 'event-limit' });
  const b = env.ledger.batch('batch-A');
  assert.deepEqual([b.state, b.owner, b.qty], ['SOURCE_READY', 'research-source', 7]);
  assert.equal(env.ledger.snapshot().ledger.conservation.ok, true);
});

check('I19 A6 閥門：安裝當下開著 → 不改寫 load／newWorld、不掛 pagehide、不建面板，介面一律 disabled；裝好後才開 → 開始／推進／開面板 disabled，取消照樣 FREEZE', () => {
  const stub = makeEnv({ valve: true });
  assert.equal(stub.ctx.load, stub.nativeLoad);
  assert.equal(stub.ctx.newWorld, stub.nativeNewWorld);
  assert.equal(stub.listeners.length, 0);
  assert.equal(Object.isFrozen(stub.api), true);
  assert.equal(stub.api.provenance.installed, false);
  delete stub.ctx.window.__noIntermodal057;
  for (const k of ['start', 'advance', 'cancel', 'open', 'refresh', 'end', 'disable']) assert.equal(stub.api[k](TRIP(stub)).reason, 'disabled', k);
  assert.deepEqual(plain(stub.api.snapshot()), { ok: false, reason: 'disabled', active: false, disabled: true, installed: false });
  assert.equal(stub.panel(), null);
  assert.deepEqual([stub.road.calls.length, stub.rail.calls.length, stub.ledger.calls.length], [0, 0, 0]);
  const env = makeEnv();
  const { api } = env;
  api.start(TRIP(env));
  api.advance();
  env.ctx.window.__noIntermodal057 = true;
  for (const k of ['start', 'advance', 'open']) assert.equal(api[k](TRIP(env)).reason, 'disabled', k);
  assert.equal(env.road.snapshot().cursor, 1);
  assert.equal(env.panel(), null);
  assert.equal(api.snapshot().disabled, true);
  const c = api.cancel('valve');
  assert.deepEqual([c.status, c.ledger.freeze.state], ['CANCELLED', 'FROZEN']);
  assert.equal(api.disable().ended, true);
  assert.equal(env.ctx.window.__noIntermodal057, true);
});

check('I20 A6 面板：只有 open() 才建；左欄第 4 格固定位置、未保存提示；內容跟著行程；「前進」「取消」「×」各自有效；開兩次只有一個', () => {
  const env = makeEnv();
  const { api, document } = env;
  assert.equal(env.panel(), null);
  api.start(TRIP(env));
  assert.equal(env.panel(), null, 'start does not open a panel');
  api.open();
  const p = env.panel();
  assert.ok(p);
  const css = p.style.cssText.replace(/\s+/g, '');
  for (const want of ['position:fixed', 'left:12px', 'top:calc(84px+3*((100vh-120px)/4+8px))', 'width:min(260px,calc(100vw-24px))', 'height:calc((100vh-120px)/4)', 'box-sizing:border-box', 'overflow:auto']) assert.ok(css.includes(want), 'css ' + want);
  assert.ok(!/(^|;)(right|bottom):/.test(css), 'left column only');
  assert.equal(document.getElementById('lab057Unsaved').textContent, UNSAVED);
  const text = () => document.getElementById('lab057Body').textContent;
  assert.equal(text(), '批次 batch-A（7/12 件 food）\n狀態 公路段　公路 0/5　鐵路 0/4');
  document.getElementById('lab057Advance').click();
  assert.equal(env.road.snapshot().cursor, 1);
  assert.ok(text().includes('公路 1/5'), text());
  env.cut(3, 1, 'road');
  document.getElementById('lab057Advance').click();
  assert.ok(text().includes('停住：road-broken (3,1)'), text());
  api.open();
  assert.equal(document.body.children.filter((c) => c.id === 'lab057Panel').length, 1);
  document.getElementById('lab057Cancel').click();
  assert.ok(text().includes('已取消：panel-cancel　帳 FROZEN'), text());
  document.getElementById('lab057Close').click();
  assert.equal(env.panel(), null);
  assert.equal(api.snapshot().lastEnded.endedBy, 'end');
  const env2 = makeEnv();
  env2.api.start(TRIP(env2));
  env2.api.open();
  env2.document.getElementById('lab057Close').click();
  assert.equal(env2.ledger.batch('batch-A').state, 'FROZEN', '× on a live trip cancels and freezes');
  env2.api.open();
  assert.equal(env2.document.getElementById('lab057Body').textContent, '目前沒有聯運任務。');
  env2.ctx.window.__noIntermodal057 = true;
  env2.api.refresh();
  assert.equal(env2.document.getElementById('lab057Body').textContent, '（逃生閥 __noIntermodal057 已關閉）');
  const quiet = makeEnv({ dom: false });
  assert.equal(quiet.api.open().reason, 'no-trip', 'no document → no panel, still a snapshot');
});

check('I21 快照與回傳值都是拷貝：改它們不影響行程', () => {
  const env = makeEnv();
  const { api } = env;
  const r = api.start(TRIP(env));
  r.qty = 99;
  const s = api.snapshot();
  s.road.path.length = 0; s.qty = 1; s.ledger.owner = 'evil'; s.status = 'DELIVERED';
  const t = api.snapshot();
  assert.deepEqual([t.qty, t.road.pathLength, t.road.path.length, t.ledger.owner, t.status], [7, 6, 6, 'research-source', 'ROAD']);
  const a = api.advance();
  a.snapshot.road.cursor = 9;
  assert.equal(api.snapshot().road.cursor, 1);
});

/* ---------- I22：真的 052／053／054／055 執行期，依 index.html 的順序裝進同一個 vm ---------- */
check('I22 整合：真 052 帳＋真 053／054／055＋本卡，在假城市跑完整一趟（含途中拆軌、鋪回）；另一棟 k166 當轉運點 → no-interchange', () => {
  const n = 24, id = (x, y) => y * n + x;
  const tiles = Array.from({ length: n * n }, () => ({ t: 2 }));
  // 起點 k168（2×2）根格 (2,2)；道路 y=4，x=2..9；轉運 k166（4×4）根格 (10,1)，佔 (10..13,1..4)：前接道路 (9,4)，貼軌 (14,3)；
  // 鐵軌 y=3，x=14..22；目的 k166 根格 (20,4)（貼軌 (20..22,3)，最近的是 (20,3)）；另一棟貼軌的 k166 根格 (2,12)（A2 用）
  const put = (x, y, k, sz) => { for (let dy = 0; dy < sz; dy++) for (let dx = 0; dx < sz; dx++) tiles[id(x + dx, y + dy)].bld = dx || dy ? { k, ref: [x, y] } : { k, sz }; };
  put(2, 2, 168, 2); put(10, 1, 166, 4); put(20, 4, 166, 4); put(2, 12, 166, 4);
  for (let x = 2; x <= 9; x++) tiles[id(x, 4)].road = 1;
  for (let x = 14; x <= 22; x++) tiles[id(x, 3)].rail = 1;
  for (let y = 12; y <= 15; y++) tiles[id(6, y)].rail = 1;
  const ctx = { console, N: n, tiles, GAME_VER: 'test', GAME_ANCHOR: 'T785', day: 1, seed: 7, economy482: null,
    LOGISTICS_META485: { 165: {}, 166: {}, 167: {}, 168: {}, 169: {}, 170: {}, 171: {}, 172: {}, 173: {}, 174: {} } };
  ctx.sanRoadSeeds445 = function (rootIdx) {
    const out = []; if (rootIdx < 0 || rootIdx >= n * n) return out; const b = ctx.tiles[rootIdx] && ctx.tiles[rootIdx].bld; if (!b || b.ref) return out;
    const rx = rootIdx % n, ry = (rootIdx / n) | 0, sz = Math.max(1, b.sz || 1);
    for (let fy = 0; fy < sz; fy++) for (let fx = 0; fx < sz; fx++) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = rx + fx + dx, ny = ry + fy + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue; const j = ny * n + nx; if (!ctx.tiles[j].road || out.includes(j)) continue; out.push(j);
    }
    return out;
  };
  const loads = [];
  ctx.load = function () { loads.push('load'); return 'native-load'; };
  ctx.newWorld = function () { return 'native-world'; };
  ctx.document = makeDocument();
  const listeners = [];
  ctx.window = { GV: {}, addEventListener: (t, fn) => listeners.push({ t, fn }), removeEventListener() {},
    crypto: { getRandomValues: (a) => { for (let i = 0; i < a.length; i++) a[i] = i + 1; return a; } } };
  vm.createContext(ctx);
  vm.runInContext('Math.random = function () { throw new Error("Math.random used"); };', ctx);
  for (const f of ['single-research052.js', 'road-delivery053-runtime.js', 'rail-freight054-runtime.js', 'rail-block055-runtime.js', 'intermodal057-runtime.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  const GV = ctx.window.GV, L = GV.singleResearch052, api = GV.intermodal057;
  const started = L.start(MANIFEST);
  assert.equal(started.ok, true, 'real 052 start ' + JSON.stringify(started));
  const s0 = L.snapshot().ledger;
  assert.equal(L.command({ eventId: 'qa-create-A', sessionId: s0.sessionId, batchId: 'batch-A', type: 'CREATE', expectedRevision: 0,
    payload: { commodityId: 'food', qty: 9, source: 'research-source', destination: 'research-receiver' } }).ok, true);
  const trip = { batchId: 'batch-A', originCustodian: 'research-source', destinationCustodian: 'research-receiver',
    roadFrom: id(2, 2), roadTo: id(10, 1), railFrom: id(10, 1), railTo: id(20, 4) };
  assert.deepEqual(plain(api.start(Object.assign({}, trip, { railFrom: id(2, 12) }))).reason, 'no-interchange');
  const st = api.start(trip);
  assert.equal(st.ok, true, JSON.stringify(st));
  assert.equal(GV.roadDelivery053.snapshot().batchId, 'batch-A');
  assert.equal(GV.railFreight054.snapshot().status, 'READY');
  let r = null, broke = false, sawBroken = false;
  for (let k = 0; k < 60; k++) {
    if (!broke && api.snapshot().status === 'RAIL' && api.snapshot().rail.cursor === 2) { delete ctx.tiles[id(17, 3)].rail; broke = true; }
    r = api.advance();
    if (!r.ok && r.reason === 'track-broken') { sawBroken = true; assert.equal(r.tile, id(17, 3)); ctx.tiles[id(17, 3)].rail = 1; continue; }
    assert.equal(r.ok, true, 'step ' + k + ' ' + JSON.stringify(r).slice(0, 300));
    if (r.delivered) break;
  }
  assert.equal(sawBroken, true);
  assert.equal(r.delivered, true);
  const b = L.snapshot().ledger.batches.find((x) => x.batchId === 'batch-A');
  assert.deepEqual([b.state, b.owner, b.qty], ['HELD', 'research-receiver', 9]);
  assert.equal(L.snapshot().ledger.conservation.ok, true);
  assert.equal(GV.railFreight054.snapshot().status, 'UNLOADED');
  assert.equal(GV.railBlock055.snapshot().holder, null);
  assert.equal(GV.railBlock055.snapshot().trains[0].run054, GV.railFreight054.snapshot().sessionId);
  // 讀檔：外層先收 LAB-07（這一趟已交付，不再寫帳），052 再結束會話
  ctx.load();
  assert.deepEqual(loads, ['load']);
  assert.equal(api.snapshot().lastEnded.status, 'DELIVERED');
  assert.equal(L.snapshot().active, false);
});

console.log('\nINTERMODAL057_RUNTIME ' + JSON.stringify({ checks, ok: true }));

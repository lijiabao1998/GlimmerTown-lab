'use strict';
/* T784 / LAB-06：用 Node vm 跑「執行期那份」rail-block055-runtime.js（就是內嵌進 index.html 的那份），
 * 以假的 tiles／N／window.GV／load／newWorld／document 驗 B1–B5。不用 Chrome、不用網路。
 * 規劃器用這裡自己的 4 鄰 BFS 假介面，只依賴 GV.railFreight054.plan(from, to) 的回傳形狀，不載入 054 本身。
 * 每一條 check 擋一種壞法（寫在標題裡）；故意改壞執行期那份時，第一個紅燈要落在對應那一條。
 * 用法：node rail-block055-runtime.test.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const SRC = fs.readFileSync(path.join(__dirname, 'rail-block055-runtime.js'), 'utf8');
const UNSAVED = '未保存：重新整理或讀檔就會消失';

/* ---------- 假 DOM：只做面板用到的那幾個方法 ---------- */
function makeDocument() {
  class El {
    constructor(tag) { this.tagName = String(tag).toUpperCase(); this.children = []; this.parentNode = null; this.style = { cssText: '' }; this.id = ''; this._text = ''; this.handlers = {}; }
    set textContent(v) { this._text = String(v); this.children = []; }
    get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('\n') : this._text; }
    appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; this.children.push(c); return c; }
    removeChild(c) { const i = this.children.indexOf(c); if (i < 0) throw new Error('not a child'); this.children.splice(i, 1); c.parentNode = null; return c; }
    addEventListener(type, fn) { (this.handlers[type] = this.handlers[type] || []).push(fn); }
    click() { for (const fn of this.handlers.click || []) fn({ type: 'click' }); }
  }
  const body = new El('body');
  const find = (node, id) => { if (node.id === id) return node; for (const c of node.children) { const f = find(c, id); if (f) return f; } return null; };
  return { body, createElement: (tag) => new El(tag), getElementById: (id) => find(body, id) };
}

/* ---------- 假規劃器：跟 054 一樣在 tiles[i].rail 上做 4 鄰 BFS（上、右、下、左） ---------- */
function bfsPlan(ctx, from, to) {
  const n = ctx.N, tiles = ctx.tiles, total = n * n;
  const rail = (i) => !!(tiles[i] && tiles[i].rail);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= total || to >= total) return { ok: false, path: [], steps: -1, reason: 'bad-input' };
  if (!rail(from)) return { ok: false, path: [], steps: -1, reason: 'from-not-rail' };
  if (!rail(to)) return { ok: false, path: [], steps: -1, reason: 'to-not-rail' };
  const prev = new Array(total).fill(-1), seen = new Array(total).fill(false), q = [from];
  seen[from] = true;
  while (q.length) {
    const cur = q.shift();
    if (cur === to) break;
    const x = cur % n, y = (cur / n) | 0;
    for (const nb of [y > 0 ? cur - n : -1, x < n - 1 ? cur + 1 : -1, y < n - 1 ? cur + n : -1, x > 0 ? cur - 1 : -1]) {
      if (nb < 0 || seen[nb] || !rail(nb)) continue;
      seen[nb] = true; prev[nb] = cur; q.push(nb);
    }
  }
  if (!seen[to]) return { ok: false, path: [], steps: -1, reason: 'unreachable' };
  const p = [];
  for (let a = to; a !== -1; a = prev[a]) p.push(a);
  p.reverse();
  return { ok: true, path: p, steps: p.length - 1, reason: null };
}

/* ---------- 環境：一座 n×n 的假城市，y=ROW 那一列整排鋪真軌 ---------- */
const ROW = 2;
function makeEnv(opts) {
  const o = opts || {};
  const n = o.n || 10;
  const listeners = [];
  const calls = { load: [], newWorld: [], plan: [] };
  const ctx = { console };
  const freshTiles = () => Array.from({ length: n * n }, () => ({ t: 2 }));
  ctx.N = n;
  ctx.tiles = freshTiles();
  const nativeLoad = function (...args) { calls.load.push({ self: this, args }); ctx.tiles = freshTiles(); return 'native-load'; };
  const nativeNewWorld = function (...args) { calls.newWorld.push({ self: this, args }); ctx.tiles = freshTiles(); return 'native-world'; };
  ctx.load = nativeLoad;
  ctx.newWorld = nativeNewWorld;
  const document = o.dom === false ? null : makeDocument();
  if (document) ctx.document = document;
  ctx.window = { GV: {}, addEventListener: (type, fn) => listeners.push({ type, fn }) };
  if (o.valve) ctx.window.__noRailBlock055 = true;
  if (o.planner !== false) ctx.window.GV.railFreight054 = {
    plan: (from, to) => { calls.plan.push([from, to]); return o.planFn ? o.planFn(ctx, from, to) : bfsPlan(ctx, from, to); },
    // T785：spawnFor054 讀 054 目前那一列任務的快照；預設沒有任務。
    snapshot: () => (o.run054Fn ? o.run054Fn(ctx) : { ok: false, reason: 'no-run', active: false, disabled: false })
  };
  vm.createContext(ctx);
  // 決定性：執行期碰到亂數或現實時間就直接炸
  vm.runInContext('Math.random = function () { throw new Error("Math.random used"); };' +
    'Date = new Proxy(Date, { construct() { throw new Error("Date used"); }, apply() { throw new Error("Date used"); }, get(t, k) { if (k === "now") return function () { throw new Error("Date.now used"); }; return t[k]; } });', ctx);
  vm.runInContext(SRC, ctx, { filename: 'rail-block055-runtime.js' });
  const id = (x, y) => y * n + x;
  const env = {
    ctx, n, listeners, calls, nativeLoad, nativeNewWorld, document, id,
    get api() { return ctx.window.GV.railBlock055; },
    lay(x, y) { ctx.tiles[id(x, y)].rail = 1; },
    cut(x, y) { delete ctx.tiles[id(x, y)].rail; },
    layRow(y, x0, x1) { for (let x = x0; x <= x1; x++) env.lay(x, y); },
    panel() { return document ? document.getElementById('lab055Panel') : null; }
  };
  if (o.row !== false) env.layRow(ROW, 0, n - 1);
  return env;
}
const plain = (v) => JSON.parse(JSON.stringify(v));
const train = (api, tid) => api.snapshot().trains.find((t) => t.id === tid);
const MUTATIONS = ['spawn', 'spawnFor054', 'request', 'release', 'advance', 'abort', 'breakTile', 'repairTile', 'open'];

let checks = 0;
function check(label, fn) {
  try { fn(); } catch (e) {
    console.log('  FAIL ' + label);
    console.log('RAIL_BLOCK055_RUNTIME FIRST_RED ' + JSON.stringify({ label, message: String(e && e.message).split('\n')[0] }));
    process.exit(1);
  }
  checks++;
  console.log('  ok  ' + label);
}

/* 兩列同一區間：t1 往東（0→9）、t2 往西（9→0）。 */
function twoTrains(env) {
  const { api, id } = env;
  const a = api.spawn('t1', id(0, ROW), id(env.n - 1, ROW), { batchId: 'b1', qty: 8 }, 12);
  const b = api.spawn('t2', id(env.n - 1, ROW), id(0, ROW), { batchId: 'b2', qty: 6 }, 12);
  assert.equal(a.ok, true, 'spawn t1');
  assert.equal(b.ok, true, 'spawn t2');
  return { a, b };
}
const runToEnd = (api, tid) => { let r = null; for (let k = 0; k < 64; k++) { r = api.advance(tid); if (!r.ok || r.arrived) break; } return r; };

/* 放最前面：執行期任何地方用到亂數或現實時間，第一個紅燈就落在這一條（vm 裡的 Math.random／Date 會直接丟例外）。 */
check('V00 決定性：沒有亂數、沒有現實時間；同一串操作跑兩次逐位相同', () => {
  const script = (env) => {
    const { api, id } = env;
    const log = [];
    log.push(twoTrains(env));
    log.push(api.request('t1'), api.request('t2'), api.advance('t1'), api.advance('t2'));
    env.cut(3, ROW);
    log.push(api.advance('t1'), api.advance('t1'));
    env.lay(3, ROW);
    for (let k = 0; k < 12; k++) log.push(api.advance('t1'));
    log.push(api.spawn('t3', id(2, ROW), id(7, ROW)), api.request('t3'), api.abort('t3', 'x'));
    for (let k = 0; k < 12; k++) log.push(api.advance('t2'));
    log.push(api.spawn('t4', id(7, ROW), id(2, ROW)), api.request('t4'), api.snapshot());
    return JSON.stringify(log);
  };
  const a = script(makeEnv()), b = script(makeEnv());
  assert.equal(a, b);
  assert.ok(a.length > 500);
});

check('V01 安裝：介面齊全、凍結；provenance 寫明斷軌讀 tiles[i].rail、規劃借 054', () => {
  const { api } = makeEnv();
  for (const k of ['spawn', 'spawnFor054', 'request', 'release', 'advance', 'abort', 'breakTile', 'repairTile', 'snapshot', 'open', 'refresh', 'end', 'disable']) assert.equal(typeof api[k], 'function', k);
  assert.equal(Object.isFrozen(api), true);
  assert.equal(Object.isFrozen(api.provenance), true);
  assert.equal(api.provenance.installed, true);
  assert.equal(api.provenance.brokenSource, 'tiles[i].rail');
  assert.equal(api.provenance.planner, 'GV.railFreight054.plan');
  assert.equal(api.provenance.maxTrains, 2);
  assert.deepEqual(plain(api.snapshot()), { ok: true, installed: true, disabled: false, maxTrains: 2, active: 0, holder: null, waiting: [], broken: [], trains: [] });
});

check('V02 登記：spawn 的路線就是 054 規劃器在真軌上規劃的那一條', () => {
  const env = makeEnv();
  const { api, id } = env;
  const r = api.spawn('t1', id(1, ROW), id(5, ROW), { batchId: 'lab05-batch', qty: 4, commodityId: 'food' }, 6);
  assert.deepEqual(plain(env.calls.plan), [[id(1, ROW), id(5, ROW)]]);
  assert.deepEqual(plain(r), { ok: true, id: 't1', status: 'READY', path: [id(1, ROW), id(2, ROW), id(3, ROW), id(4, ROW), id(5, ROW)], steps: 4 });
  assert.deepEqual(plain(train(api, 't1')), {
    id: 't1', status: 'READY', authority: null, cursor: 0, pathLength: 5, steps: 0,
    from: id(1, ROW), to: id(5, ROW), at: id(1, ROW), next: id(2, ROW), blockedTile: null,
    qty: 4, capacity: 6, batchId: 'lab05-batch', commodityId: 'food', abortReason: null, run054: null
  });
  const d = api.spawn('t2', id(5, ROW), id(1, ROW));
  assert.equal(d.ok, true);
  const t2 = train(api, 't2');
  assert.deepEqual([t2.qty, t2.capacity, t2.batchId, t2.commodityId], [1, 12, 't2', null]);
});

check('V03 登記失敗：沒有 054 規劃器、規劃失敗、規劃器丟例外、路線不是相鄰真軌 → 不登記', () => {
  const none = makeEnv({ planner: false });
  assert.equal(none.api.spawn('t1', none.id(0, ROW), none.id(3, ROW)).reason, 'rail-freight-unavailable');
  assert.equal(none.api.snapshot().trains.length, 0);
  const env = makeEnv();
  env.cut(4, ROW);
  const un = env.api.spawn('t1', env.id(0, ROW), env.id(8, ROW));
  assert.equal(un.ok, false);
  assert.equal(un.reason, 'unreachable');
  assert.equal(env.api.spawn('t1', env.id(0, 0), env.id(3, ROW)).reason, 'from-not-rail');
  const thrower = makeEnv({ planFn: () => { throw new Error('boom'); } });
  assert.equal(thrower.api.spawn('t1', 0, 1).reason, 'rail-freight-unavailable');
  // 端點都對、只有路線本身壞：跳格、踩到沒軌的格、跨行繞回
  const gap = makeEnv({ planFn: (ctx) => ({ ok: true, path: [ctx.N * ROW, ctx.N * ROW + 2], steps: 1 }) });
  assert.equal(gap.api.spawn('t1', gap.id(0, ROW), gap.id(2, ROW)).reason, 'bad-route', 'gap');
  const offRail = makeEnv({ planFn: (ctx) => ({ ok: true, path: [ctx.N * ROW, ctx.N * ROW - ctx.N], steps: 1 }) });
  assert.equal(offRail.api.spawn('t1', offRail.id(0, ROW), offRail.id(0, ROW - 1)).reason, 'bad-route', 'off rail');
  const wrap = makeEnv({ planFn: (ctx) => ({ ok: true, path: [ctx.N * ROW - 1, ctx.N * ROW], steps: 1 }) });
  wrap.lay(wrap.n - 1, ROW - 1);
  assert.equal(wrap.api.spawn('t1', wrap.id(wrap.n - 1, ROW - 1), wrap.id(0, ROW)).reason, 'bad-route', 'row wrap');
  const elsewhere = makeEnv({ planFn: (ctx) => ({ ok: true, path: [ctx.N * ROW + 1, ctx.N * ROW + 2], steps: 1 }) });
  assert.equal(elsewhere.api.spawn('t1', elsewhere.id(1, ROW), elsewhere.id(3, ROW)).reason, 'bad-route', 'route must end where asked');
  assert.equal(elsewhere.api.spawn('t1', elsewhere.id(0, ROW), elsewhere.id(2, ROW)).reason, 'bad-route', 'route must start where asked');
  for (const e of [none, env, thrower, gap, offRail, wrap, elsewhere]) assert.equal(e.api.snapshot().trains.length, 0);
});

check('V04 登記輸入：壞 id／壞數量／壞容量／壞批次號 → bad-input；超載 → over-capacity；重複 id → duplicate', () => {
  const env = makeEnv();
  const { api, id } = env;
  const A = id(0, ROW), B = id(5, ROW);
  for (const bad of ['', null, 7, undefined]) assert.equal(api.spawn(bad, A, B).reason, 'bad-input');
  for (const q of [0, -1, 2.5, '5', null]) assert.equal(api.spawn('t1', A, B, { qty: q }).reason, 'bad-input', 'qty ' + q);
  for (const c of [0, -3, 'x', 1.5, null]) assert.equal(api.spawn('t1', A, B, { qty: 1 }, c).reason, 'bad-input', 'cap ' + c);
  assert.equal(api.spawn('t1', A, B, { batchId: '' }).reason, 'bad-input');
  assert.equal(api.spawn('t1', A, B, 'cargo').reason, 'bad-input');
  const over = api.spawn('t1', A, B, { qty: 13 }, 12);
  assert.deepEqual([over.reason, over.qty, over.capacity], ['over-capacity', 13, 12]);
  assert.equal(api.snapshot().trains.length, 0);
  assert.equal(api.spawn('t1', A, B).ok, true);
  assert.equal(api.spawn('t1', B, A).reason, 'duplicate');
  assert.equal(api.snapshot().trains.length, 1);
});

check('V05 B3 沒登記的列車不能要路權（unknown-train），也擋不住真車', () => {
  const env = makeEnv();
  const { api } = env;
  const g = api.request('ghost');
  assert.equal(g.ok, false);
  assert.equal(g.reason, 'unknown-train');
  assert.equal(api.snapshot().holder, null);
  assert.deepEqual(plain(api.snapshot().waiting), []);
  assert.equal(api.request('').reason, 'bad-input');
  for (const fn of ['release', 'advance', 'abort']) assert.equal(api[fn]('ghost').reason, 'unknown-train', fn);
  twoTrains(env);
  assert.equal(api.request('t1').status, 'GRANTED');
  assert.equal(api.snapshot().holder, 't1');
});

check('V06 B3 一列走、一列等：第二列 WAITING，等待者推進回 no-authority 且不動', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  assert.deepEqual(plain(api.request('t1')), { ok: true, status: 'GRANTED', id: 't1' });
  assert.deepEqual(plain(api.request('t2')), { ok: true, status: 'WAITING', id: 't2', position: 1 });
  assert.equal(api.request('t1').reason, 'duplicate');
  assert.equal(api.request('t2').reason, 'duplicate');
  const w = api.advance('t2');
  assert.equal(w.ok, false);
  assert.equal(w.reason, 'no-authority');
  assert.equal(w.holder, 't1');
  assert.equal(train(api, 't2').cursor, 0);
  assert.equal(train(api, 't2').authority, 'waiting');
  assert.equal(train(api, 't1').authority, 'holder');
  assert.equal(api.advance('t1').ok, true);
  assert.equal(train(api, 't1').cursor, 1);
});

check('V07 B3 持有者在路上 release → still-running（READY 也算）；等待者 release → not-holder；路權不動', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  const r0 = api.release('t1');
  assert.equal(r0.ok, false);
  assert.equal(r0.reason, 'still-running');
  api.advance('t1'); api.advance('t1');
  const r1 = api.release('t1');
  assert.equal(r1.reason, 'still-running');
  assert.deepEqual([r1.cursor, r1.pathLength], [2, env.n]);
  assert.equal(api.release('t2').reason, 'not-holder');
  const s = api.snapshot();
  assert.equal(s.holder, 't1');
  assert.deepEqual(plain(s.waiting), ['t2']);
});

check('V08 B3 到站自動讓出：等待者 FIFO 取得路權；到站後 release 只是確認，不碰新持有者', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  const last = runToEnd(api, 't1');
  assert.equal(last.ok, true);
  assert.equal(last.arrived, true);
  assert.equal(last.granted, 't2');
  assert.equal(train(api, 't1').status, 'ARRIVED');
  assert.equal(train(api, 't1').cursor, env.n - 1);
  const s = api.snapshot();
  assert.equal(s.holder, 't2');
  assert.deepEqual(plain(s.waiting), []);
  assert.equal(s.active, 1);
  const rel = api.release('t1');
  assert.deepEqual([rel.ok, rel.released, rel.alreadyReleased, rel.holder], [true, false, true, 't2']);
  assert.equal(api.snapshot().holder, 't2');
  const again = api.advance('t1');
  assert.deepEqual([again.ok, again.moved, again.arrived], [true, false, true]);
  const end2 = runToEnd(api, 't2');
  assert.equal(end2.arrived, true);
  assert.equal(end2.granted, null);
  assert.equal(api.snapshot().holder, null);
});

check('V09 B3 中止：持有者中止交棒給等待者；等待者中止就出隊；中止後名額釋放', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  const ab = api.abort('t1', 'test-stop');
  assert.deepEqual([ab.ok, ab.status, ab.granted], [true, 'ABORTED', 't2']);
  assert.equal(train(api, 't1').abortReason, 'test-stop');
  assert.equal(api.snapshot().holder, 't2');
  assert.equal(api.abort('t1').reason, 'already-finished');
  assert.equal(api.spawn('t3', id(0, ROW), id(4, ROW)).ok, true);
  assert.equal(api.request('t3').status, 'WAITING');
  const aw = api.abort('t3');
  assert.deepEqual([aw.ok, aw.granted], [true, null]);
  assert.equal(train(api, 't3').abortReason, 'aborted');
  assert.deepEqual(plain(api.snapshot().waiting), []);
  assert.equal(runToEnd(api, 't2').granted, null);
  assert.equal(api.snapshot().holder, null);
  assert.equal(api.snapshot().active, 0);
});

check('V10 B3 名額只算在冊列車：同時兩列 → 第三列 too-many；跑完一列 → 第三列能開也能拿到路權', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  const t3 = api.spawn('t3', id(0, ROW), id(3, ROW));
  assert.equal(t3.ok, false);
  assert.equal(t3.reason, 'too-many');
  assert.equal(t3.maxTrains, 2);
  api.request('t1'); api.request('t2');
  runToEnd(api, 't1');
  assert.equal(api.spawn('t3', id(0, ROW), id(3, ROW)).ok, true);
  assert.equal(api.spawn('t4', id(0, ROW), id(3, ROW)).reason, 'too-many');
  runToEnd(api, 't2');
  assert.equal(api.request('t3').status, 'GRANTED');
  assert.equal(api.spawn('t4', id(3, ROW), id(0, ROW)).ok, true);
  assert.equal(api.request('t4').status, 'WAITING');
  assert.equal(api.snapshot().active, 2);
  assert.equal(api.snapshot().trains.length, 4);
});

check('V11 B3 已到站／已中止的列車不能再要路權、不能再中止；已中止的不能推進', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  runToEnd(api, 't1');
  api.abort('t2');
  assert.equal(api.request('t1').reason, 'already-finished');
  assert.equal(api.request('t2').reason, 'already-finished');
  assert.equal(api.abort('t1').reason, 'already-finished');
  const adv = api.advance('t2');
  assert.equal(adv.ok, false);
  assert.equal(adv.reason, 'already-finished');
  assert.equal(api.snapshot().holder, null);
});

check('V12 B1 前方一格真軌不見了 → track-broken，回報那一格，列車留在原地', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1'); api.advance('t1');
  env.cut(3, ROW);
  const r = api.advance('t1');
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'track-broken');
  assert.deepEqual([r.tile, r.x, r.y], [id(3, ROW), 3, ROW]);
  const t = train(api, 't1');
  assert.deepEqual([t.cursor, t.steps, t.status, t.at, t.blockedTile], [2, 2, 'RUNNING', id(2, ROW), id(3, ROW)]);
  assert.equal(api.snapshot().holder, 't1');
});

check('V13 B1 斷軌期間反覆推進不漂移、不計步、不讓出路權', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  env.cut(2, ROW);
  for (let k = 0; k < 5; k++) assert.equal(api.advance('t1').reason, 'track-broken');
  const t = train(api, 't1');
  assert.deepEqual([t.cursor, t.steps], [1, 1]);
  assert.equal(api.snapshot().holder, 't1');
  assert.deepEqual(plain(api.snapshot().waiting), ['t2']);
  assert.equal(api.advance('t2').reason, 'no-authority');
});

check('V14 B1 那格重新有軌就繼續，走到站並交棒', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  env.cut(2, ROW);
  assert.equal(api.advance('t1').reason, 'track-broken');
  env.lay(2, ROW);
  const r = api.advance('t1');
  assert.deepEqual([r.ok, r.moved, r.arrived], [true, true, false]);
  assert.equal(r.snapshot.cursor, 2);
  assert.equal(r.snapshot.blockedTile, null);
  assert.equal(r.snapshot.at, id(2, ROW));
  const last = runToEnd(api, 't1');
  assert.equal(last.arrived, true);
  assert.equal(last.granted, 't2');
});

check('V15 B1 只看前方那一格：已走過的格或路線外的軌拆掉不擋', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1'); api.advance('t1');
  env.cut(0, ROW);
  env.cut(1, ROW);
  env.lay(5, ROW + 1); env.cut(5, ROW + 1);
  const r = api.advance('t1');
  assert.equal(r.ok, true);
  assert.equal(r.snapshot.cursor, 3);
});

check('V16 B1 每次都重讀地格：整個 tiles 陣列被換掉也看新的', () => {
  const env = makeEnv();
  const { api, ctx } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  ctx.tiles = ctx.tiles.map((t) => Object.assign({}, t));
  delete ctx.tiles[env.id(2, ROW)].rail;
  assert.equal(api.advance('t1').reason, 'track-broken');
  ctx.tiles = ctx.tiles.map((t) => Object.assign({}, t));
  ctx.tiles[env.id(2, ROW)].rail = 1;
  assert.equal(api.advance('t1').ok, true);
});

check('V17 B1 執行期 breakTile／repairTile 不改判定（real-tiles-only），判定只看地格', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  const b = api.breakTile(id(1, ROW));
  assert.deepEqual([b.ok, b.reason, b.tile], [false, 'real-tiles-only', id(1, ROW)]);
  assert.equal(api.advance('t1').ok, true);
  assert.deepEqual(plain(api.snapshot().broken), []);
  env.cut(2, ROW);
  const rep = api.repairTile(id(2, ROW));
  assert.equal(rep.reason, 'real-tiles-only');
  assert.equal(api.advance('t1').reason, 'track-broken');
});

check('V18 B1 snapshot.broken 從真地格推出：在冊列車前方沒軌的格，排序、去重；修好就消失', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  env.cut(6, ROW); env.cut(3, ROW);
  assert.deepEqual(plain(api.snapshot().broken), [id(3, ROW), id(6, ROW)]);
  env.lay(3, ROW); env.lay(6, ROW);
  assert.deepEqual(plain(api.snapshot().broken), []);
  runToEnd(api, 't1');
  api.abort('t2');
  env.cut(4, ROW);
  assert.deepEqual(plain(api.snapshot().broken), [], 'finished trains do not report broken tiles');
});

function busyState(env) {
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  env.cut(2, ROW);
  api.advance('t1');
  api.open();
  const s = api.snapshot();
  assert.equal(s.trains.length, 2);
  assert.equal(s.holder, 't1');
  assert.deepEqual(plain(s.waiting), ['t2']);
  assert.equal(s.broken.length, 1);
  assert.ok(env.panel(), 'panel open before reset');
}
const emptySnap = { ok: true, installed: true, disabled: false, maxTrains: 2, active: 0, holder: null, waiting: [], broken: [], trains: [] };

check('V19 B2 讀檔清空列車、等待隊列、斷軌狀態並移除面板；原生 load 照常呼叫一次', () => {
  const env = makeEnv();
  busyState(env);
  const self = { tag: 'this' };
  const ret = env.ctx.load.call(self, 3, 'x');
  assert.equal(ret, 'native-load');
  assert.equal(env.calls.load.length, 1);
  assert.equal(env.calls.load[0].self, self);
  assert.deepEqual(env.calls.load[0].args, [3, 'x']);
  assert.deepEqual(plain(env.api.snapshot()), emptySnap);
  assert.equal(env.panel(), null);
  env.layRow(ROW, 0, env.n - 1);
  assert.equal(env.api.spawn('t1', env.id(0, ROW), env.id(4, ROW)).ok, true, 'ids reusable after load');
});

check('V20 B2 開新城清空列車、等待隊列、斷軌狀態並移除面板；原生 newWorld 照常呼叫', () => {
  const env = makeEnv();
  busyState(env);
  assert.equal(env.ctx.newWorld(20261104), 'native-world');
  assert.deepEqual(env.calls.newWorld[0].args, [20261104]);
  assert.deepEqual(plain(env.api.snapshot()), emptySnap);
  assert.equal(env.panel(), null);
});

check('V21 B2 end() 與 pagehide 都清空；end 也移除面板', () => {
  const env = makeEnv();
  busyState(env);
  assert.deepEqual(plain(env.api.end()), { ok: true, ended: true });
  assert.deepEqual(plain(env.api.snapshot()), emptySnap);
  assert.equal(env.panel(), null);
  const ph = env.listeners.filter((l) => l.type === 'pagehide');
  assert.equal(ph.length, 1);
  env.layRow(ROW, 0, env.n - 1);
  busyState(env);
  ph[0].fn({ type: 'pagehide' });
  assert.deepEqual(plain(env.api.snapshot()), emptySnap);
  assert.equal(env.panel(), null);
});

check('V22 B4 閥門開著：所有變更動作回 disabled，狀態不動，面板不建', () => {
  const env = makeEnv();
  const { api, id } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  const before = plain(api.snapshot());
  env.ctx.window.__noRailBlock055 = true;
  const args = { spawn: ['t9', id(0, ROW), id(3, ROW)], spawnFor054: ['t9'], request: ['t2'], release: ['t1'], advance: ['t1'], abort: ['t1'], breakTile: [id(2, ROW)], repairTile: [id(2, ROW)], open: [] };
  for (const k of MUTATIONS) {
    const r = api[k](...args[k]);
    assert.equal(r.ok, false, k);
    assert.equal(r.reason, 'disabled', k);
  }
  assert.equal(env.panel(), null);
  const after = plain(api.snapshot());
  assert.equal(after.disabled, true);
  delete after.disabled; delete before.disabled;
  assert.deepEqual(after, before);
  delete env.ctx.window.__noRailBlock055;
  assert.equal(api.advance('t1').ok, true);
  assert.equal(api.disable().ended, true);
  assert.equal(env.ctx.window.__noRailBlock055, true);
  assert.equal(api.request('t1').reason, 'disabled');
});

check('V23 B4 安裝當下閥門已開：不改寫 load／newWorld、不掛 pagehide、不建面板；介面一律 disabled（之後關閥也一樣）', () => {
  const env = makeEnv({ valve: true });
  const { ctx, api, id } = env;
  assert.equal(ctx.load, env.nativeLoad);
  assert.equal(ctx.newWorld, env.nativeNewWorld);
  assert.equal(env.listeners.length, 0);
  assert.equal(api.provenance.installed, false);
  assert.equal(Object.isFrozen(api), true);
  delete ctx.window.__noRailBlock055;
  const args = { spawn: ['t1', id(0, ROW), id(3, ROW)], spawnFor054: ['t1'], request: ['t1'], release: ['t1'], advance: ['t1'], abort: ['t1'], breakTile: [1], repairTile: [1], open: [] };
  for (const k of MUTATIONS.concat(['end', 'disable', 'refresh'])) {
    const r = api[k](...(args[k] || []));
    assert.equal(r.reason, 'disabled', k);
  }
  assert.equal(env.calls.plan.length, 0);
  assert.equal(env.panel(), null);
  const s = plain(api.snapshot());
  assert.deepEqual(s, { ok: false, reason: 'disabled', disabled: true, installed: false, maxTrains: 2, active: 0, holder: null, waiting: [], broken: [], trains: [] });
});

check('V24 B5 面板：右上角固定位置、未保存提示、內容讀快照（含斷軌格座標）', () => {
  const env = makeEnv();
  const { api } = env;
  assert.equal(env.panel(), null, 'no panel before open()');
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.advance('t1');
  env.cut(2, ROW);
  api.advance('t1');
  const s = api.open();
  assert.equal(s.ok, true);
  const p = env.panel();
  assert.ok(p, 'panel created');
  assert.equal(env.document.body.children.filter((c) => c.id === 'lab055Panel').length, 1);
  const css = p.style.cssText.replace(/\s+/g, '');
  for (const want of ['position:fixed', 'top:84px', 'right:12px', 'width:270px', 'max-height:calc(50vh-90px)', 'overflow:auto']) assert.ok(css.includes(want), 'css ' + want);
  assert.ok(!/(^|;)bottom:/.test(css), 'not anchored to the bottom (LAB-03 is bottom-right)');
  assert.ok(!/(^|;)left:/.test(css), 'not anchored to the left');
  const notice = env.document.getElementById('lab055Unsaved');
  assert.ok(notice && notice.textContent === UNSAVED, 'unsaved notice text');
  const body = env.document.getElementById('lab055Body').textContent;
  assert.ok(body.includes('持有路權：t1'), body);
  assert.ok(body.includes('等待中：t2'), body);
  assert.ok(body.includes('t1：RUNNING　1/' + (env.n - 1) + '　前方斷軌 (2,' + ROW + ')'), body);
  assert.ok(body.includes('斷軌格（讀真地格）：(2,' + ROW + ')'), body);
  assert.ok(body.includes('名額：2/2'), body);
  api.open();
  assert.equal(env.document.body.children.length, 1, 'open twice keeps one panel');
  env.lay(2, ROW);
  api.advance('t1');
  assert.ok(env.document.getElementById('lab055Body').textContent.includes('斷軌格（讀真地格）：（無）'));
  env.ctx.window.__noRailBlock055 = true;
  api.refresh();
  assert.equal(env.document.getElementById('lab055Body').textContent, '（逃生閥 __noRailBlock055 已關閉）');
  delete env.ctx.window.__noRailBlock055;
  const quiet = makeEnv({ dom: false });
  assert.equal(quiet.api.open().ok, true, 'no document → no panel, still a snapshot');
});

check('V25 B5 面板按鈕：「推進」推持有者、「×」關閉並清空', () => {
  const env = makeEnv();
  const { api } = env;
  twoTrains(env);
  api.request('t1'); api.request('t2');
  api.open();
  env.document.getElementById('lab055Advance').click();
  assert.equal(train(api, 't1').cursor, 1);
  assert.equal(train(api, 't2').cursor, 0);
  assert.ok(env.document.getElementById('lab055Body').textContent.includes('t1：RUNNING　1/' + (env.n - 1)));
  env.ctx.window.__noRailBlock055 = true;
  env.document.getElementById('lab055Advance').click();
  assert.equal(train(api, 't1').cursor, 1, 'valve on: the button does not move the train');
  assert.equal(env.document.getElementById('lab055Body').textContent, '（逃生閥 __noRailBlock055 已關閉）');
  delete env.ctx.window.__noRailBlock055;
  env.document.getElementById('lab055Close').click();
  assert.equal(env.panel(), null);
  assert.deepEqual(plain(api.snapshot()), emptySnap);
});

check('V26 snapshot 與回傳值都是拷貝：改它們不影響內部狀態', () => {
  const env = makeEnv();
  const { api } = env;
  const r = api.spawn('t1', env.id(0, ROW), env.id(4, ROW));
  r.path.length = 0;
  api.request('t1');
  const s = api.snapshot();
  s.waiting.push('evil');
  s.trains[0].cursor = 99;
  s.trains[0].status = 'ARRIVED';
  const t = train(api, 't1');
  assert.deepEqual([t.cursor, t.status, t.pathLength], [0, 'READY', 5]);
  assert.deepEqual(plain(api.snapshot().waiting), []);
  assert.equal(api.advance('t1').snapshot.cursor, 1);
});

/* ---------- T785（LAB-07）：spawnFor054 替 054 目前那一列任務登記 ---------- */
const run054 = (env, over) => Object.assign({
  ok: true, active: true, disabled: false, sessionId: 'lab054-7', batchId: 'trip-batch', commodityId: 'food', qty: 7, capacity: 12,
  status: 'READY', cursor: 0, pathLength: 5, steps: 0, mode: 'between',
  path: [env.id(1, ROW), env.id(2, ROW), env.id(3, ROW), env.id(4, ROW), env.id(5, ROW)]
}, over || {});
function envWithRun(over) {
  let snap = null;
  const env = makeEnv({ run054Fn: () => JSON.parse(JSON.stringify(snap)) });
  env.setRun = (o) => { snap = o === null ? { ok: false, reason: 'no-run', active: false, disabled: false } : run054(env, o); };
  env.setRun(over || {});
  return env;
}

check('V27 T785 spawnFor054：路線、批次、數量、商品、容量都取 054 那一列；不呼叫規劃器；之後照常要路權、推進', () => {
  const env = envWithRun();
  const { api, id } = env;
  const r = api.spawnFor054('trip-1');
  assert.deepEqual(plain(r), { ok: true, id: 'trip-1', status: 'READY', path: [id(1, ROW), id(2, ROW), id(3, ROW), id(4, ROW), id(5, ROW)], steps: 4, run054: 'lab054-7' });
  assert.equal(env.calls.plan.length, 0, 'the 054 route is used as is, not re-planned');
  assert.deepEqual(plain(train(api, 'trip-1')), {
    id: 'trip-1', status: 'READY', authority: null, cursor: 0, pathLength: 5, steps: 0,
    from: id(1, ROW), to: id(5, ROW), at: id(1, ROW), next: id(2, ROW), blockedTile: null,
    qty: 7, capacity: 12, batchId: 'trip-batch', commodityId: 'food', abortReason: null, run054: 'lab054-7'
  });
  r.path.length = 0;
  assert.equal(train(api, 'trip-1').pathLength, 5, 'returned path is a copy');
  assert.equal(api.request('trip-1').status, 'GRANTED');
  env.cut(3, ROW);
  api.advance('trip-1');
  assert.equal(api.advance('trip-1').reason, 'track-broken');
  env.lay(3, ROW);
  const last = runToEnd(api, 'trip-1');
  assert.deepEqual([last.ok, last.arrived, last.snapshot.cursor, last.snapshot.at], [true, true, 4, id(5, ROW)]);
  assert.equal(api.snapshot().holder, null);
});

check('V28 T785 spawnFor054 拒絕：沒有 054、讀不到、沒有在冊 READY 任務、同一列登記兩次、壞貨物、超載、名額滿、路線形狀壞、路線缺軌', () => {
  const none = makeEnv({ planner: false });
  assert.equal(none.api.spawnFor054('a').reason, 'rail-freight-unavailable');
  const thrower = makeEnv({ run054Fn: () => { throw new Error('boom'); } });
  assert.equal(thrower.api.spawnFor054('a').reason, 'rail-freight-unavailable');
  const env = envWithRun();
  const { api, id } = env;
  assert.equal(api.spawnFor054('').reason, 'bad-input');
  env.setRun(null);
  assert.deepEqual(plain(api.spawnFor054('a')), { ok: false, reason: 'no-run054', status: null });
  for (const st of ['RUNNING', 'ARRIVED', 'UNLOADED', 'ABORTED']) {
    env.setRun({ status: st, active: st === 'RUNNING' || st === 'ARRIVED' });
    assert.deepEqual(plain(api.spawnFor054('a')), { ok: false, reason: 'no-run054', status: st }, st);
  }
  env.setRun({ active: false });
  assert.equal(api.spawnFor054('a').reason, 'no-run054', 'inactive');
  env.setRun({ sessionId: '' });
  assert.equal(api.spawnFor054('a').reason, 'no-run054', 'no session id');
  for (const [k, v] of [['qty', 0], ['qty', 2.5], ['capacity', 0], ['capacity', null], ['batchId', '']]) {
    env.setRun({ [k]: v });
    assert.deepEqual(plain(api.spawnFor054('a')), { ok: false, reason: 'bad-input', field: 'run054' }, k + '=' + v);
  }
  env.setRun({ qty: 13, capacity: 12 });
  assert.deepEqual(plain(api.spawnFor054('a')), { ok: false, reason: 'over-capacity', qty: 13, capacity: 12 });
  env.setRun({ path: [id(1, ROW), id(3, ROW)] });
  assert.equal(api.spawnFor054('a').reason, 'bad-route', 'gap');
  env.setRun({ path: [id(env.n - 1, ROW - 1), id(0, ROW)] });
  assert.equal(api.spawnFor054('a').reason, 'bad-route', 'row wrap');
  env.setRun({ path: [] });
  assert.equal(api.spawnFor054('a').reason, 'bad-route', 'empty');
  env.setRun({});
  env.cut(4, ROW); env.cut(2, ROW);
  assert.deepEqual(plain(api.spawnFor054('a')), { ok: false, reason: 'track-broken', tile: id(2, ROW), x: 2, y: ROW }, 'first missing tile');
  assert.equal(api.snapshot().trains.length, 0, 'nothing registered so far');
  env.lay(4, ROW); env.lay(2, ROW);
  assert.equal(api.spawnFor054('a').ok, true);
  assert.equal(api.spawnFor054('a').reason, 'duplicate', 'same id');
  assert.deepEqual(plain(api.spawnFor054('b')), { ok: false, reason: 'duplicate', run054: 'lab054-7' }, 'same 054 run twice');
  env.setRun({ sessionId: 'lab054-8' });
  assert.equal(api.spawn('t2', id(0, ROW), id(4, ROW)).ok, true);
  assert.deepEqual(plain(api.spawnFor054('c')), { ok: false, reason: 'too-many', maxTrains: 2 });
  assert.equal(api.snapshot().trains.length, 2);
});

check('V29 T785 spawnFor054 與閥門、生命週期：閥門開著 disabled；讀檔後清空、同一列可重新登記', () => {
  const env = envWithRun();
  const { api, ctx } = env;
  ctx.window.__noRailBlock055 = true;
  assert.equal(api.spawnFor054('a').reason, 'disabled');
  delete ctx.window.__noRailBlock055;
  assert.equal(api.spawnFor054('a').ok, true);
  ctx.load();
  assert.equal(api.snapshot().trains.length, 0);
  env.layRow(ROW, 0, env.n - 1);
  assert.equal(api.spawnFor054('a').ok, true, 'cleared by load, so the same run can register again');
  const stub = makeEnv({ valve: true });
  assert.equal(stub.api.spawnFor054('a').reason, 'disabled');
});

console.log('\nRAIL_BLOCK055_RUNTIME ' + JSON.stringify({ checks, ok: true }));

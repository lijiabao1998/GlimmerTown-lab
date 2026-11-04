'use strict';
/* DSK-018 / LAB-03 階段 A：真道路配送純核心的行為測試（不用 Chrome、不用網路）。
 * 只驗「路徑合法性」與「任務狀態機」——不驗美術、不驗模擬數值。
 *
 * 用法：node road-delivery053.test.js
 */
const assert = require('node:assert/strict');
const { REASONS, planDelivery, validatePath, createDeliveryTask053 } = require('./road-delivery053.js');

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };

const grid = (w, h, roadFn) => {
  const a = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (roadFn(x, y)) a[y * w + x] = 1;
  return a;
};
const idx = (w, x, y) => y * w + x;

/* 1. 直線 */
ok('直線：5×1 全道路，0→4 走 4 步', () => {
  const w = 5, h = 1, roads = grid(w, h, () => true);
  const p = planDelivery({ roads, w, h, origin: 0, destination: 4 });
  assert.equal(p.ok, true);
  assert.deepEqual(p.path, [0, 1, 2, 3, 4]);
  assert.equal(p.steps, 4);
  assert.deepEqual(validatePath(p.path, roads, w, h), { ok: true, reason: null });
});

/* 2. 轉彎：L 形道路，走最短路徑 */
ok('轉彎：L 形道路，每一步相鄰且都在路上', () => {
  const w = 5, h = 5;
  const roads = grid(w, h, (x, y) => y === 0 || x === 4);
  const p = planDelivery({ roads, w, h, origin: idx(w, 0, 0), destination: idx(w, 4, 4) });
  assert.equal(p.ok, true);
  assert.equal(p.path[0], idx(w, 0, 0));
  assert.equal(p.path[p.path.length - 1], idx(w, 4, 4));
  assert.equal(p.steps, 8);
  assert.deepEqual(validatePath(p.path, roads, w, h), { ok: true, reason: null });
});

/* 3. 繞障礙：中間一整列是空的，必須繞 */
ok('繞障礙：第 0 列中間有缺口，必須繞到第 2 列再回來', () => {
  const w = 7, h = 5;
  // 第 0 列 x=3 是缺口；第 2 列全通；左右兩條直路
  const roads = grid(w, h, (x, y) => (y === 0 && x !== 3) || y === 2 || x === 0 || x === 6);
  const p = planDelivery({ roads, w, h, origin: idx(w, 0, 0), destination: idx(w, 6, 0) });
  assert.equal(p.ok, true);
  assert.deepEqual(validatePath(p.path, roads, w, h), { ok: true, reason: null });
  for (let i = 1; i < p.path.length; i++) {
    const a = p.path[i - 1], b = p.path[i];
    const ax = a % w, ay = (a / w) | 0, bx = b % w, by = (b / w) | 0;
    assert.equal(Math.abs(ax - bx) + Math.abs(ay - by), 1, 'adjacency');
  }
  // 缺口擋住直線，路徑一定要離開第 0 列
  assert.ok(p.path.some((i) => Math.floor(i / w) !== 0), 'path leaves row 0');
  // 每一步都在真正的道路上
  for (const i of p.path) assert.equal(roads[i], 1, 'on road');
});

/* 4. 不可達 */
ok('不可達：目的地被非道路格完全隔開', () => {
  const w = 5, h = 5;
  const roads = grid(w, h, (x, y) => y === 0 || (x === 4 && y === 4));
  const p = planDelivery({ roads, w, h, origin: idx(w, 0, 0), destination: idx(w, 4, 4) });
  assert.equal(p.ok, false);
  assert.equal(p.reason, REASONS.UNREACHABLE);
  assert.deepEqual(p.path, []);
});

/* 5. 太遠 */
ok('太遠：maxSteps 不足時回 too-far，不偷偷給路徑', () => {
  const w = 5, h = 1, roads = grid(w, h, () => true);
  const p = planDelivery({ roads, w, h, origin: 0, destination: 4, maxSteps: 2 });
  assert.equal(p.ok, false);
  assert.equal(p.reason, REASONS.TOO_FAR);
  assert.equal(p.steps, 4);
});

/* 6. 端點不在路上 */
ok('端點不在路上：origin-not-road／destination-not-road 分別回報', () => {
  const w = 3, h = 3;
  const roads = grid(w, h, (x, y) => x === 1 && y === 1);
  assert.equal(planDelivery({ roads, w, h, origin: 0, destination: 4 }).reason, REASONS.ORIGIN_NOT_ROAD);
  assert.equal(planDelivery({ roads, w, h, origin: 4, destination: 0 }).reason, REASONS.DESTINATION_NOT_ROAD);
});

/* 7. 決定性 */
ok('決定性：多條等長路徑時，同一輸入跑兩次 path 逐元素相同', () => {
  const w = 8, h = 8;
  // 棋盤式街道：每個點都有多條等長走法，正是 tie-break 會暴露的地方
  const roads = grid(w, h, (x, y) => x % 2 === 0 || y % 2 === 0);
  const a = planDelivery({ roads, w, h, origin: 0, destination: idx(w, 6, 6) });
  const b = planDelivery({ roads, w, h, origin: 0, destination: idx(w, 6, 6) });
  assert.equal(a.ok, true, 'grid must be connected: ' + a.reason);
  assert.deepEqual(a.path, b.path);
  assert.deepEqual(validatePath(a.path, roads, w, h), { ok: true, reason: null });
});

/* 8. 狀態機：PENDING → MOVING → DELIVERED */
ok('狀態機：逐步前進，最後一步才 DELIVERED，qty 全程不變', () => {
  const w = 4, h = 1, roads = grid(w, h, () => true);
  const plan = planDelivery({ roads, w, h, origin: 0, destination: 3 });
  const task = createDeliveryTask053('qa-053', plan, { batchId: 'batch-A', commodityId: 'food', qty: 7 });
  assert.equal(task.snapshot().status, 'PENDING');
  let s = task.step();
  assert.equal(s.status, 'MOVING');
  assert.equal(s.qty, 7);
  s = task.step();
  assert.equal(s.status, 'MOVING');
  s = task.step();
  assert.equal(s.status, 'DELIVERED');
  assert.equal(s.cursor, 3);
  assert.equal(s.steps, 3);
  assert.equal(s.qty, 7);
  assert.deepEqual(s.deliveredAt, { cursor: 3, step: 3 });
});

/* 9. 終態冪等 */
ok('冪等：DELIVERED 之後再 step 不改狀態、不重複交付', () => {
  const w = 2, h = 1, roads = grid(w, h, () => true);
  const plan = planDelivery({ roads, w, h, origin: 0, destination: 1 });
  const task = createDeliveryTask053('qa-053', plan, { batchId: 'b', qty: 1 });
  task.step();
  const done = task.snapshot();
  assert.equal(done.status, 'DELIVERED');
  const again = task.step();
  assert.deepEqual(again, done);
  const afterCancel = task.cancel('late');
  assert.deepEqual(afterCancel, done);
});

/* 10. 中途取消 */
ok('取消：MOVING 途中取消 → CANCELLED，之後 step 不再前進', () => {
  const w = 5, h = 1, roads = grid(w, h, () => true);
  const plan = planDelivery({ roads, w, h, origin: 0, destination: 4 });
  const task = createDeliveryTask053('qa-053', plan, { batchId: 'b2', qty: 3 });
  task.step();
  const c = task.cancel('pagehide');
  assert.equal(c.status, 'CANCELLED');
  assert.equal(c.cancelledReason, 'pagehide');
  assert.equal(c.qty, 3);
  assert.equal(task.step().status, 'CANCELLED');
});

/* 11. 守衛：validatePath 要抓出對角線與非道路 */
ok('守衛：validatePath 抓對角線、非道路、空路徑', () => {
  const w = 4, h = 4;
  const roads = grid(w, h, () => true);
  assert.equal(validatePath([0, 5], roads, w, h).reason, 'not-adjacent');
  assert.equal(validatePath([], roads, w, h).reason, 'empty-path');
  const onlyCorner = grid(w, h, (x, y) => x === 0 && y === 0);
  assert.equal(validatePath([0, 1], onlyCorner, w, h).reason, 'not-road');
});

/* 12. 端點相同 */
ok('端點相同：回單格路徑、0 步', () => {
  const w = 3, h = 3, roads = grid(w, h, () => true);
  const p = planDelivery({ roads, w, h, origin: 4, destination: 4 });
  assert.deepEqual(p, { ok: true, path: [4], steps: 0, reason: null });
});

/* ===== T782 補齊（只新增；上面 12 項原樣保留）=====
 * C053-01…12：planBetween（兩棟物流建築的前接之間做多源 BFS）、理由各自分開、maxSteps／批次的不合法輸入一律
 * bad-input（不靜默改值）、快照不共用物件。期望值是手算的路徑與測試自己寫的 BFS 距離，不拿被測函式當答案。
 * 負控制（T782 B8）：MUTANTS 每一條改壞核心原文一處，重跑全部 C053 項，第一個紅燈必須落在目標項。 */
const fs = require('node:fs');
const nodePath = require('node:path');
const vm = require('node:vm');
const CORE_SRC = fs.readFileSync(nodePath.join(__dirname, 'road-delivery053.js'), 'utf8');
const J = (v) => JSON.parse(JSON.stringify(v));
const DIR4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
// 與原生 sanRoadSeeds445 同一規則（佔地逐列、每格上右下左、去重），在測試裡獨立寫一份當期望值。
function seedsOf(w, h, isRoad, rx, ry, size) {
  const out = [];
  for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) for (const [dx, dy] of DIR4) {
    const nx = rx + fx + dx, ny = ry + fy + dy;
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
    const j = ny * w + nx;
    if (isRoad(j) && !out.includes(j)) out.push(j);
  }
  return out;
}
// 獨立的 BFS 距離（陣列佇列，不共用被測程式碼）；不可達回 -1。
function bfsDist(w, h, isRoad, a, b) {
  if (a === b) return 0;
  const dist = new Map([[a, 0]]), q = [a];
  while (q.length) {
    const c = q.shift(), cx = c % w, cy = Math.floor(c / w);
    for (const [dx, dy] of DIR4) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (dist.has(n) || !isRoad(n)) continue;
      dist.set(n, dist.get(c) + 1);
      if (n === b) return dist.get(n);
      q.push(n);
    }
  }
  return -1;
}
// 測試用的小世界：roads（Uint8Array）＋建築表；isLogisticsRoot／frontage 是測試自己的定義。
function town(w, h, roadCells, buildings) {
  const roads = new Uint8Array(w * h);
  for (const [x, y] of roadCells) roads[y * w + x] = 1;
  const roots = new Map(buildings.map((b) => [b.y * w + b.x, b]));
  const isRoad = (j) => roads[j] === 1;
  return {
    roads, w, h,
    isLogisticsRoot: (i) => !!(roots.get(i) && roots.get(i).logistics),
    frontage: (i) => { const b = roots.get(i); return b ? seedsOf(w, h, isRoad, b.x, b.y, b.size) : []; },
    at: (x, y) => y * w + x
  };
}
const row3 = (x0, x1) => { const out = []; for (let x = x0; x <= x1; x++) out.push([x, 3]); return out; };
const between = (api, t, o, d, extra) => J(api.planBetween(Object.assign({ roads: t.roads, w: t.w, h: t.h, origin: o, destination: d,
  isLogisticsRoot: t.isLogisticsRoot, frontage: t.frontage }, extra || {})));
const caught = (fn) => { try { fn(); } catch (e) { return e; } return null; };
const lcg = (seed) => () => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed / 4294967296; };

const NEW_CHECKS = [
  ['C053-01', 'planBetween：兩棟物流建築之間，路徑頭尾分別貼兩棟的前接（手算路徑）', (api) => {
    const t = town(10, 6, row3(0, 9), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 6, y: 1, size: 2, logistics: true }]);
    const p = between(api, t, t.at(1, 1), t.at(6, 1));
    assert.deepEqual(p, { ok: true, path: [32, 33, 34, 35, 36], steps: 4, reason: null, originRoot: 11, destinationRoot: 16,
      originFrontage: [31, 32], destinationFrontage: [36, 37] }, 'C053-01 hand path');
  }],
  ['C053-02', '多源 tie-break：等長時依起點前接的順序，換順序就換起點（決定性）', (api) => {
    const roads = new Uint8Array(21); for (let x = 0; x < 7; x++) roads[7 + x] = 1;
    const fr = new Map([[0, [7, 13]], [1, [13, 7]], [20, [10]]]);
    const opts = (o) => ({ roads, w: 7, h: 3, origin: o, destination: 20, isLogisticsRoot: () => true, frontage: (i) => fr.get(i) });
    assert.deepEqual(J(api.planBetween(opts(0))).path, [7, 8, 9, 10], 'C053-02 first source wins');
    assert.deepEqual(J(api.planBetween(opts(1))).path, [13, 12, 11, 10], 'C053-02 order decides');
    assert.deepEqual(J(api.planBetween(opts(0))), J(api.planBetween(opts(0))), 'C053-02 same input same path');
  }],
  ['C053-03', 'not-logistics：非物流建築、道路格、空地當端點各自回報哪一端', (api) => {
    const t = town(10, 6, row3(0, 9), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 6, y: 1, size: 2, logistics: false }]);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(6, 1)), { ok: false, path: [], steps: -1, reason: 'not-logistics', side: 'destination' }, 'C053-03 dest');
    assert.deepEqual(between(api, t, t.at(6, 1), t.at(1, 1)), { ok: false, path: [], steps: -1, reason: 'not-logistics', side: 'origin' }, 'C053-03 origin');
    assert.equal(between(api, t, t.at(3, 3), t.at(1, 1)).reason, 'not-logistics', 'C053-03 road tile');
    assert.equal(between(api, t, t.at(0, 5), t.at(1, 1)).reason, 'not-logistics', 'C053-03 empty land');
  }],
  ['C053-04', 'no-frontage：物流建築沒有前接道路，回報哪一端', (api) => {
    const t = town(10, 6, row3(0, 9), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 8, y: 5, size: 1, logistics: true }]);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(8, 5)), { ok: false, path: [], steps: -1, reason: 'no-frontage', side: 'destination' }, 'C053-04 dest');
    assert.deepEqual(between(api, t, t.at(8, 5), t.at(1, 1)), { ok: false, path: [], steps: -1, reason: 'no-frontage', side: 'origin' }, 'C053-04 origin');
  }],
  ['C053-05', 'unreachable：兩棟各有前接，但兩段道路不連通', (api) => {
    const t = town(10, 6, row3(0, 4).concat(row3(6, 9)), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 6, y: 1, size: 2, logistics: true }]);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(6, 1)), { ok: false, path: [], steps: -1, reason: 'unreachable' }, 'C053-05 gap');
  }],
  ['C053-06', 'too-far：maxSteps 不足回 too-far（附步數與上限），剛好夠就成功', (api) => {
    const t = town(10, 6, row3(0, 9), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 6, y: 1, size: 2, logistics: true }]);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(6, 1), { maxSteps: 3 }), { ok: false, path: [], steps: 4, reason: 'too-far', limit: 3 }, 'C053-06 limit 3');
    assert.equal(between(api, t, t.at(1, 1), t.at(6, 1), { maxSteps: 4 }).ok, true, 'C053-06 limit 4');
  }],
  ['C053-07', 'planBetween 的 bad-input：地格、世界介面、端點、範圍、前接清單', (api) => {
    const t = town(10, 6, row3(0, 9), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 6, y: 1, size: 2, logistics: true }]);
    const o = t.at(1, 1), d = t.at(6, 1);
    const detail = (extra) => { const r = between(api, t, o, d, extra); assert.equal(r.reason, 'bad-input', 'C053-07 reason ' + JSON.stringify(extra)); return r.detail; };
    assert.equal(detail({ roads: null }), 'grid', 'C053-07 grid null');
    assert.equal(detail({ roads: new Uint8Array(59) }), 'grid', 'C053-07 grid length');
    assert.equal(detail({ isLogisticsRoot: null }), 'world', 'C053-07 world');
    assert.equal(detail({ frontage: 'x' }), 'world', 'C053-07 world frontage');
    assert.equal(detail({ origin: '11' }), 'endpoints', 'C053-07 endpoints string');
    assert.equal(detail({ destination: 2.5 }), 'endpoints', 'C053-07 endpoints fraction');
    assert.equal(detail({ origin: -1 }), 'range', 'C053-07 range low');
    assert.equal(detail({ destination: 60 }), 'range', 'C053-07 range high');
    for (const bad of [null, [999], [0], ['31'], 'x']) {
      assert.equal(detail({ frontage: (i) => (i === o ? bad : [36]) }), 'frontage', 'C053-07 frontage ' + JSON.stringify(bad));
    }
  }],
  ['C053-08', 'maxSteps：只有省略＝不設上限；null、負數、小數、字串、Infinity、NaN 一律 bad-input', (api) => {
    const t = town(10, 6, row3(0, 9), [{ x: 1, y: 1, size: 2, logistics: true }, { x: 6, y: 1, size: 2, logistics: true }]);
    for (const bad of [null, -1, 2.5, '3', Infinity, NaN, true, {}]) {
      const a = J(api.planDelivery({ roads: t.roads, w: 10, h: 6, origin: 31, destination: 31, maxSteps: bad }));
      assert.deepEqual([a.reason, a.detail], ['bad-input', 'maxSteps'], 'C053-08 planDelivery ' + String(bad));
      const b = between(api, t, t.at(1, 1), t.at(6, 1), { maxSteps: bad });
      assert.deepEqual([b.reason, b.detail], ['bad-input', 'maxSteps'], 'C053-08 planBetween ' + String(bad));
    }
    assert.deepEqual(J(api.planDelivery({ roads: t.roads, w: 10, h: 6, origin: 31, destination: 31, maxSteps: 0 })), { ok: true, path: [31], steps: 0, reason: null }, 'C053-08 zero same');
    assert.equal(J(api.planDelivery({ roads: t.roads, w: 10, h: 6, origin: 31, destination: 33, maxSteps: 0 })).reason, 'too-far', 'C053-08 zero');
  }],
  ['C053-09', 'validateBatch：0、-3、2.5、\'5\'、null 等數量一律 bad-input，不改成 1；回傳新物件', (api) => {
    const input = { batchId: 'b1', qty: 5, commodityId: 'food', extra: 1 };
    const v = api.validateBatch(input);
    assert.deepEqual(J(v), { ok: true, reason: null, batch: { batchId: 'b1', qty: 5, commodityId: 'food' } }, 'C053-09 valid');
    input.qty = 99;
    assert.equal(v.batch.qty, 5, 'C053-09 copy');
    assert.equal(J(api.validateBatch({ batchId: 'b', qty: 1 })).batch.commodityId, null, 'C053-09 commodity omitted');
    assert.equal(J(api.validateBatch({ batchId: 'b', qty: 1, commodityId: null })).batch.commodityId, null, 'C053-09 commodity null = unspecified');
    for (const ok of [{ batchId: 'b', qty: 1 }, { batchId: 'b', qty: 2, commodityId: null }, { batchId: 'b', qty: 3, commodityId: 'food' }]) {
      const once = J(api.validateBatch(ok));
      assert.deepEqual(J(api.validateBatch(once.batch)), once, 'C053-09 idempotent ' + JSON.stringify(ok));
    }
    const detail = (b) => { const r = J(api.validateBatch(b)); assert.deepEqual([r.ok, r.reason, r.path, r.steps], [false, 'bad-input', [], -1], 'C053-09 shape ' + JSON.stringify(b)); return r.detail; };
    for (const qty of [0, -3, 2.5, '5', null, undefined, NaN, Infinity, 2 ** 53, true, {}]) assert.equal(detail({ batchId: 'b', qty }), 'qty', 'C053-09 qty ' + String(qty));
    for (const batchId of ['', 5, null, undefined, {}]) assert.equal(detail({ batchId, qty: 1 }), 'batchId', 'C053-09 batchId ' + String(batchId));
    for (const commodityId of [5, '', {}, false]) assert.equal(detail({ batchId: 'b', qty: 1, commodityId }), 'commodityId', 'C053-09 commodity ' + String(commodityId));
    for (const b of [null, undefined, 5, 'x', [], true]) assert.equal(detail(b), 'batch', 'C053-09 batch ' + String(b));
  }],
  ['C053-10', 'createDeliveryTask053：不合法輸入丟 code＝bad-input（detail 指出哪一欄），不偷偷建任務', (api) => {
    const plan = J(api.planDelivery({ roads: new Uint8Array([1, 1, 1]), w: 3, h: 1, origin: 0, destination: 2 }));
    for (const [args, d] of [[['s', plan, { batchId: 'b', qty: 0 }], 'qty'], [['s', plan, { batchId: 'b', qty: '5' }], 'qty'],
      [['s', plan, { batchId: 'b', qty: 2.5 }], 'qty'], [['s', plan, { batchId: 'b', qty: null }], 'qty'],
      [['s', plan, { batchId: '', qty: 1 }], 'batchId'], [['', plan, { batchId: 'b', qty: 1 }], 'sessionId'],
      [['s', { ok: false, path: [] }, { batchId: 'b', qty: 1 }], 'plan']]) {
      const e = caught(() => api.createDeliveryTask053(...args));
      assert.deepEqual([e && e.code, e && e.detail], ['bad-input', d], 'C053-10 ' + d + ' ' + JSON.stringify(args[2]));
    }
    const normalized = api.validateBatch({ batchId: 'b', qty: 2 }).batch;
    assert.equal(J(api.createDeliveryTask053('s', plan, normalized).snapshot()).commodityId, null, 'C053-10 normalized batch accepted');
  }],
  ['C053-11', '快照不共用物件：改回傳的 deliveredAt、改呼叫端的批次物件，都不影響任務', (api) => {
    const plan = J(api.planDelivery({ roads: new Uint8Array([1, 1]), w: 2, h: 1, origin: 0, destination: 1 }));
    const batch = { batchId: 'b', qty: 3, commodityId: 'food' };
    const task = api.createDeliveryTask053('s', plan, batch);
    batch.qty = 99; batch.batchId = 'forged'; batch.commodityId = 'gold';
    const s1 = task.step();
    s1.deliveredAt.cursor = 42;
    const s2 = task.snapshot();
    assert.deepEqual(J(s2.deliveredAt), { cursor: 1, step: 1 }, 'C053-11 deliveredAt copy');
    assert.deepEqual([s2.qty, s2.batchId, s2.commodityId], [3, 'b', 'food'], 'C053-11 batch copy');
  }],
  ['C053-12', '隨機城市：planBetween 的步數等於獨立 BFS 的最短距離，頭尾貼前接、每步相鄰在路上', (api) => {
    const rnd = lcg(20261104);
    let found = 0, unreachable = 0;
    for (let world = 0; world < 160; world++) {
      const w = 6 + Math.floor(rnd() * 9), h = 6 + Math.floor(rnd() * 9);
      const owner = new Int32Array(w * h).fill(-1), bs = [];
      for (let k = 0; k < 4; k++) {
        const size = 1 + Math.floor(rnd() * 3), x = Math.floor(rnd() * (w - size + 1)), y = Math.floor(rnd() * (h - size + 1));
        let free = true;
        for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) if (owner[(y + fy) * w + x + fx] >= 0) free = false;
        if (!free) continue;
        for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) owner[(y + fy) * w + x + fx] = bs.length;
        bs.push({ x, y, size, logistics: true });
      }
      const cells = [];
      for (let i = 0; i < w * h; i++) if (owner[i] < 0 && rnd() < 0.55) cells.push([i % w, Math.floor(i / w)]);
      const t = town(w, h, cells, bs), isRoad = (j) => t.roads[j] === 1;
      for (const a of bs) for (const b of bs) {
        if (a === b) continue;
        const res = between(api, t, t.at(a.x, a.y), t.at(b.x, b.y));
        const src = seedsOf(w, h, isRoad, a.x, a.y, a.size), dst = seedsOf(w, h, isRoad, b.x, b.y, b.size);
        if (!src.length || !dst.length) { assert.equal(res.reason, 'no-frontage', 'C053-12 no-frontage'); continue; }
        let best = -1;
        for (const s of src) for (const d of dst) { const q = bfsDist(w, h, isRoad, s, d); if (q >= 0 && (best < 0 || q < best)) best = q; }
        if (best < 0) { assert.equal(res.reason, 'unreachable', 'C053-12 unreachable w' + world); unreachable++; continue; }
        assert.equal(res.ok, true, 'C053-12 ok w' + world);
        assert.equal(res.steps, best, 'C053-12 shortest w' + world);
        assert.equal(res.path.length, best + 1, 'C053-12 length w' + world);
        assert.ok(src.includes(res.path[0]) && dst.includes(res.path[res.path.length - 1]), 'C053-12 ends on frontage w' + world);
        for (let i = 0; i < res.path.length; i++) {
          assert.ok(isRoad(res.path[i]), 'C053-12 on road w' + world);
          if (i) { const p = res.path[i - 1], c = res.path[i]; assert.equal(Math.abs(p % w - c % w) + Math.abs(Math.floor(p / w) - Math.floor(c / w)), 1, 'C053-12 adjacent w' + world); }
        }
        assert.deepEqual(between(api, t, t.at(a.x, a.y), t.at(b.x, b.y)), res, 'C053-12 deterministic w' + world);
        found++;
      }
    }
    assert.ok(found > 100 && unreachable > 20, 'C053-12 coverage found=' + found + ' unreachable=' + unreachable);
  }]
];

function loadCore(src) {
  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 10000 });
  return sandbox.module.exports;
}
function runNewChecks(api, log) {
  for (const [id, name, fn] of NEW_CHECKS) {
    try { fn(api); } catch (e) { return { id, message: String(e && e.message).split('\n')[0] }; }
    if (log) { checks++; console.log('  ok  ' + id + ' ' + name); }
  }
  return null;
}
const realRed = runNewChecks(require('./road-delivery053.js'), true);
assert.equal(realRed, null, 'T782 new core checks: ' + JSON.stringify(realRed));
assert.equal(runNewChecks(loadCore(CORE_SRC), false), null, 'T782 vm-loaded core passes the same checks');

// 負控制：每一條只改核心原文一處；第一個紅燈必須落在目標項（T782 B8）。
const MUTANTS = [
  ['C053-01', 'originFrontage: sources, destinationFrontage: targets', 'originFrontage: targets, destinationFrontage: sources'],
  ['C053-02', 'for (const s of sources) {', 'for (const s of sources.slice().reverse()) {'],
  ['C053-03', "    if (!isLogisticsRoot(destination)) return fail(REASONS.NOT_LOGISTICS, { side: 'destination' });\n", ''],
  ['C053-04', "    if (!targets.length) return fail(REASONS.NO_FRONTAGE, { side: 'destination' });\n", ''],
  ['C053-05', 'const path = search(isRoad, w, h, sources, targets);\n    if (!path) return fail(REASONS.UNREACHABLE);',
    'const path = search(isRoad, w, h, sources, targets);\n    if (!path) return fail(REASONS.NO_FRONTAGE);'],
  ['C053-06', 'if (steps > limit) return fail(REASONS.TOO_FAR, { steps, limit });\n    return {\n      ok: true, path, steps, reason: null,\n      originRoot',
    'if (steps > limit + 1) return fail(REASONS.TOO_FAR, { steps, limit });\n    return {\n      ok: true, path, steps, reason: null,\n      originRoot'],
  ['C053-07', "    if (typeof isLogisticsRoot !== 'function' || typeof frontage !== 'function') return fail(REASONS.BAD_INPUT, { detail: 'world' });\n", ''],
  ['C053-07', 'for (const c of list) if (!isInt(c) || c < 0 || c >= total || !isRoad(c)) return null;', 'for (const c of list) if (!isInt(c) || c < 0 || c >= total) return null;'],
  ['C053-08', 'const stepLimit = (v) => (v === undefined ? Infinity', 'const stepLimit = (v) => (v === undefined || v === null ? Infinity'],
  ['C053-09', 'if (!Number.isSafeInteger(batch.qty) || batch.qty <= 0)', 'if (!Number.isFinite(batch.qty) || batch.qty <= 0)'],
  ['C053-09', 'const unspecified = batch.commodityId === undefined || batch.commodityId === null;', 'const unspecified = batch.commodityId === undefined;'],
  ['C053-10', 'if (!checked.ok) throw badInput(checked.detail);', 'if (!checked.ok) throw new Error(checked.detail);'],
  ['C053-11', 'deliveredAt: deliveredAt ? { cursor: deliveredAt.cursor, step: deliveredAt.step } : null,', 'deliveredAt,'],
  ['C053-12', "cx > 0 ? cur - 1 : -1\n      ];\n      for (let k = 0; k < 4; k++) {",
    "cx > 0 ? cur - 1 : -1,\n        cy > 0 && cx < w - 1 ? cur - w + 1 : -1\n      ];\n      for (let k = 0; k < 5; k++) {"]
];
for (const [target, find, repl] of MUTANTS) {
  assert.equal(CORE_SRC.split(find).length, 2, 'mutant anchor must be unique: ' + target);
  const red = runNewChecks(loadCore(CORE_SRC.split(find).join(repl)), false);
  assert.ok(red && red.id === target, 'mutant for ' + target + ' must first fail at ' + target + ', got ' + JSON.stringify(red));
  console.log('  red ' + target + ' ← ' + red.message);
}
console.log('  ok  負控制 ' + MUTANTS.length + ' 條，首紅都落在目標項');

console.log('\nROAD_DELIVERY_053 ' + JSON.stringify({ checks, ok: true }));

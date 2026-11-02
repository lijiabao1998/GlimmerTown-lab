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

console.log('\nROAD_DELIVERY_053 ' + JSON.stringify({ checks, ok: true }));

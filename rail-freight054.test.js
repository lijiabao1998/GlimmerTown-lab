'use strict';
/* DSK-019 / LAB-05 階段 A：貨運鐵路純核心的行為測試（不用 Chrome、不用網路）。
 * 用法：node rail-freight054.test.js
 */
const assert = require('node:assert/strict');
const { REASONS, DEFAULT_CAPACITY, planRailRoute, validateRoute, createFreightRun054 } = require('./rail-freight054.js');

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };
const grid = (w, h, railFn) => {
  const a = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (railFn(x, y)) a[y * w + x] = 1;
  return a;
};
const idx = (w, x, y) => y * w + x;

ok('直線鐵軌：6×1，0→5 走 5 步', () => {
  const w = 6, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 5 });
  assert.equal(p.ok, true);
  assert.deepEqual(p.path, [0, 1, 2, 3, 4, 5]);
  assert.equal(p.steps, 5);
  assert.deepEqual(validateRoute(p.path, rail, w, h), { ok: true, reason: null });
});

ok('轉彎鐵軌：L 形，每步相鄰且都在軌上', () => {
  const w = 5, h = 5;
  const rail = grid(w, h, (x, y) => y === 0 || x === 4);
  const p = planRailRoute({ rail, w, h, from: idx(w, 0, 0), to: idx(w, 4, 4) });
  assert.equal(p.ok, true);
  assert.equal(p.steps, 8);
  assert.deepEqual(validateRoute(p.path, rail, w, h), { ok: true, reason: null });
});

ok('繞障礙鐵軌：第 0 列缺口，必須繞第 2 列', () => {
  const w = 7, h = 5;
  const rail = grid(w, h, (x, y) => (y === 0 && x !== 3) || y === 2 || x === 0 || x === 6);
  const p = planRailRoute({ rail, w, h, from: idx(w, 0, 0), to: idx(w, 6, 0) });
  assert.equal(p.ok, true);
  assert.ok(p.path.some((i) => Math.floor(i / w) !== 0), 'path leaves row 0');
  for (const i of p.path) assert.equal(rail[i], 1, 'on rail');
  assert.deepEqual(validateRoute(p.path, rail, w, h), { ok: true, reason: null });
});

ok('不可達：終點被非鐵軌隔開', () => {
  const w = 5, h = 5;
  const rail = grid(w, h, (x, y) => y === 0 || (x === 4 && y === 4));
  const p = planRailRoute({ rail, w, h, from: idx(w, 0, 0), to: idx(w, 4, 4) });
  assert.equal(p.ok, false);
  assert.equal(p.reason, REASONS.UNREACHABLE);
});

ok('太遠：maxSteps 不足回 too-far', () => {
  const w = 6, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 5, maxSteps: 3 });
  assert.equal(p.ok, false);
  assert.equal(p.reason, REASONS.TOO_FAR);
  assert.equal(p.steps, 5);
});

ok('端點不在鐵軌上：from-not-rail／to-not-rail', () => {
  const w = 3, h = 3;
  const rail = grid(w, h, (x, y) => x === 1 && y === 1);
  assert.equal(planRailRoute({ rail, w, h, from: 0, to: 4 }).reason, REASONS.FROM_NOT_RAIL);
  assert.equal(planRailRoute({ rail, w, h, from: 4, to: 0 }).reason, REASONS.TO_NOT_RAIL);
});

ok('決定性：棋盤式多條等長路線，兩次規劃逐元素相同', () => {
  const w = 8, h = 8;
  const rail = grid(w, h, (x, y) => x % 2 === 0 || y % 2 === 0);
  const a = planRailRoute({ rail, w, h, from: 0, to: idx(w, 6, 6) });
  const b = planRailRoute({ rail, w, h, from: 0, to: idx(w, 6, 6) });
  assert.equal(a.ok, true, a.reason);
  assert.deepEqual(a.path, b.path);
  assert.deepEqual(validateRoute(a.path, rail, w, h), { ok: true, reason: null });
});

ok('容量：qty==capacity 可用，qty>capacity 回 over-capacity', () => {
  const w = 3, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 2 });
  const run = createFreightRun054('qa-054', p, { batchId: 'b', qty: 12 }, 12);
  assert.equal(run.snapshot().capacity, 12);
  assert.equal(run.snapshot().qty, 12);
  let threw = null;
  try { createFreightRun054('qa-054', p, { batchId: 'b2', qty: 13 }, 12); } catch (e) { threw = e; }
  assert.equal(threw && threw.code, REASONS.OVER_CAPACITY);
  assert.equal(DEFAULT_CAPACITY, 12);
});

ok('狀態機：READY→RUNNING→ARRIVED→UNLOADED，qty 全程不變', () => {
  const w = 4, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 3 });
  const run = createFreightRun054('qa-054', p, { batchId: 'b', commodityId: 'food', qty: 7 }, 12);
  assert.equal(run.snapshot().status, 'READY');
  let s = run.step();
  assert.equal(s.status, 'RUNNING');
  s = run.step();
  assert.equal(s.status, 'RUNNING');
  s = run.step();
  assert.equal(s.status, 'ARRIVED');
  assert.equal(s.cursor, 3);
  assert.equal(s.qty, 7);
  const u = run.unload();
  assert.equal(u.status, 'UNLOADED');
  assert.equal(u.qty, 7);
  assert.deepEqual(u.unloadedAt, { cursor: 3, step: 3 });
});

ok('未到站不能卸貨', () => {
  const w = 3, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 2 });
  const run = createFreightRun054('qa-054', p, { batchId: 'b', qty: 1 });
  let threw = null;
  try { run.unload(); } catch (e) { threw = e; }
  assert.equal(threw && threw.code, REASONS.NOT_ARRIVED);
});

ok('中途 abort：ABORTED，之後 step／unload 都不再前進', () => {
  const w = 5, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 4 });
  const run = createFreightRun054('qa-054', p, { batchId: 'b', qty: 3 });
  run.step();
  const a = run.abort('load');
  assert.equal(a.status, 'ABORTED');
  assert.equal(a.abortReason, 'load');
  assert.equal(run.step().status, 'ABORTED');
  let threw = null;
  try { run.unload(); } catch (e) { threw = e; }
  assert.equal(threw && threw.code, REASONS.NOT_ARRIVED);
});

ok('終態冪等：UNLOADED 之後 step／abort 不變', () => {
  const w = 2, h = 1, rail = grid(w, h, () => true);
  const p = planRailRoute({ rail, w, h, from: 0, to: 1 });
  const run = createFreightRun054('qa-054', p, { batchId: 'b', qty: 2 });
  run.step();
  const done = run.unload();
  assert.equal(done.status, 'UNLOADED');
  assert.deepEqual(run.step(), done);
  assert.deepEqual(run.abort('late'), done);
});

ok('守衛：validateRoute 抓對角線、非鐵軌、空路線', () => {
  const w = 4, h = 4;
  const rail = grid(w, h, () => true);
  assert.equal(validateRoute([0, 5], rail, w, h).reason, 'not-adjacent');
  assert.equal(validateRoute([], rail, w, h).reason, 'empty-path');
  const onlyCorner = grid(w, h, (x, y) => x === 0 && y === 0);
  assert.equal(validateRoute([0, 1], onlyCorner, w, h).reason, 'not-rail');
});

console.log('\nRAIL_FREIGHT_054 ' + JSON.stringify({ checks, ok: true }));

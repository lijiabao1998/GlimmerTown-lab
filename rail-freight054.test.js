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

/* ===== T783 補齊（只新增；上面 13 項原樣保留）=====
 * C054-01…13：planBetween（兩棟 k166 的貼軌格之間沿真軌做多源 BFS）、not-hub／hub-not-on-rail／unreachable 各自分開、
 * footprintSeeds（佔地四鄰）、容量與數量的不合法輸入一律 bad-input、超載 over-capacity、快照不共用物件。
 * 期望值是手算的路線與測試自己寫的 BFS 距離，不拿被測函式當答案。
 * 負控制（T783 B8）：MUTANTS 每一條改壞核心原文一處，重跑全部 C054 項，第一個紅燈必須落在目標項。 */
const fs = require('node:fs');
const nodePath = require('node:path');
const vm = require('node:vm');
const CORE_SRC = fs.readFileSync(nodePath.join(__dirname, 'rail-freight054.js'), 'utf8');
const J = (v) => JSON.parse(JSON.stringify(v));
const DIR4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
// 佔地四鄰的期望值：與原生 sanRoadSeeds445 同一規則（佔地逐列、每格上右下左、去重），測試裡獨立寫一份。
function seedsOf(w, h, isKind, rx, ry, size) {
  const out = [];
  for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) for (const [dx, dy] of DIR4) {
    const nx = rx + fx + dx, ny = ry + fy + dy;
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
    const j = ny * w + nx;
    if (isKind(j) && !out.includes(j)) out.push(j);
  }
  return out;
}
function bfsDist(w, h, isRail, a, b) {
  if (a === b) return 0;
  const dist = new Map([[a, 0]]), q = [a];
  while (q.length) {
    const c = q.shift(), cx = c % w, cy = Math.floor(c / w);
    for (const [dx, dy] of DIR4) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (dist.has(n) || !isRail(n)) continue;
      dist.set(n, dist.get(c) + 1);
      if (n === b) return dist.get(n);
      q.push(n);
    }
  }
  return -1;
}
function yard(w, h, railCells, buildings) {
  const rail = new Uint8Array(w * h);
  for (const [x, y] of railCells) rail[y * w + x] = 1;
  const roots = new Map(buildings.map((b) => [b.y * w + b.x, b]));
  const isRail = (j) => rail[j] === 1;
  return {
    rail, w, h,
    isHubRoot: (i) => !!(roots.get(i) && roots.get(i).hub),
    railFrontage: (i) => { const b = roots.get(i); return b ? seedsOf(w, h, isRail, b.x, b.y, b.size) : []; },
    at: (x, y) => y * w + x
  };
}
const col4 = (y0, y1) => { const out = []; for (let y = y0; y <= y1; y++) out.push([4, y]); return out; };
const hubsAB = [{ x: 1, y: 1, size: 3, hub: true }, { x: 5, y: 5, size: 2, hub: true }];
const between = (api, t, o, d, extra) => J(api.planBetween(Object.assign({ rail: t.rail, w: t.w, h: t.h, origin: o, destination: d,
  isHubRoot: t.isHubRoot, railFrontage: t.railFrontage }, extra || {})));
const caught = (fn) => { try { fn(); } catch (e) { return e; } return null; };
const lcg = (seed) => () => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed / 4294967296; };

const NEW_CHECKS = [
  ['C054-01', 'planBetween：兩棟貼軌 k166 之間，路線第一格貼起點、最後一格貼終點（手算路線）', (api) => {
    const t = yard(10, 8, col4(0, 7), hubsAB);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(5, 5)), { ok: true, path: [34, 44, 54], steps: 2, reason: null,
      originRoot: 11, destinationRoot: 55, originFrontage: [14, 24, 34], destinationFrontage: [54, 64] }, 'C054-01 hand route');
  }],
  ['C054-02', '多源 tie-break：等長時依起點貼軌格的順序（決定性）', (api) => {
    const rail = new Uint8Array(21); for (let x = 0; x < 7; x++) rail[7 + x] = 1;
    const fr = new Map([[0, [7, 13]], [1, [13, 7]], [20, [10]]]);
    const opts = (o) => ({ rail, w: 7, h: 3, origin: o, destination: 20, isHubRoot: () => true, railFrontage: (i) => fr.get(i) });
    assert.deepEqual(J(api.planBetween(opts(0))).path, [7, 8, 9, 10], 'C054-02 first source wins');
    assert.deepEqual(J(api.planBetween(opts(1))).path, [13, 12, 11, 10], 'C054-02 order decides');
  }],
  ['C054-03', 'not-hub：不是 k166 根格（其他建築、軌道格、空地）各自回報哪一端', (api) => {
    const t = yard(10, 8, col4(0, 7), [hubsAB[0], { x: 5, y: 5, size: 2, hub: false }]);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(5, 5)), { ok: false, path: [], steps: -1, reason: 'not-hub', side: 'destination' }, 'C054-03 dest');
    assert.deepEqual(between(api, t, t.at(5, 5), t.at(1, 1)), { ok: false, path: [], steps: -1, reason: 'not-hub', side: 'origin' }, 'C054-03 origin');
    assert.equal(between(api, t, t.at(4, 2), t.at(1, 1)).reason, 'not-hub', 'C054-03 rail tile');
    assert.equal(between(api, t, t.at(9, 7), t.at(1, 1)).reason, 'not-hub', 'C054-03 empty');
  }],
  ['C054-04', 'hub-not-on-rail：k166 佔地四鄰沒有真軌，回報哪一端', (api) => {
    const t = yard(10, 8, col4(0, 7), [hubsAB[0], { x: 7, y: 5, size: 2, hub: true }]);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(7, 5)), { ok: false, path: [], steps: -1, reason: 'hub-not-on-rail', side: 'destination' }, 'C054-04 dest');
    assert.deepEqual(between(api, t, t.at(7, 5), t.at(1, 1)), { ok: false, path: [], steps: -1, reason: 'hub-not-on-rail', side: 'origin' }, 'C054-04 origin');
  }],
  ['C054-05', 'unreachable：兩站都貼軌，但不在同一個鐵軌連通分量上', (api) => {
    const t = yard(10, 8, col4(0, 3).concat(col4(5, 7)), hubsAB);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(5, 5)), { ok: false, path: [], steps: -1, reason: 'unreachable' }, 'C054-05 gap');
  }],
  ['C054-06', 'too-far：maxSteps 不足回 too-far（附步數與上限），剛好夠就成功', (api) => {
    const t = yard(10, 8, col4(0, 7), hubsAB);
    assert.deepEqual(between(api, t, t.at(1, 1), t.at(5, 5), { maxSteps: 1 }), { ok: false, path: [], steps: 2, reason: 'too-far', limit: 1 }, 'C054-06 limit 1');
    assert.equal(between(api, t, t.at(1, 1), t.at(5, 5), { maxSteps: 2 }).ok, true, 'C054-06 limit 2');
  }],
  ['C054-07', 'planBetween 的 bad-input：地格、世界介面、端點、範圍、貼軌清單', (api) => {
    const t = yard(10, 8, col4(0, 7), hubsAB);
    const o = t.at(1, 1), d = t.at(5, 5);
    const detail = (extra, label) => { const r = between(api, t, o, d, extra); assert.equal(r.reason, 'bad-input', 'C054-07 reason ' + label); return r.detail; };
    assert.equal(detail({ rail: null }, 'grid'), 'grid', 'C054-07 grid null');
    assert.equal(detail({ rail: new Uint8Array(79) }, 'len'), 'grid', 'C054-07 grid length');
    assert.equal(detail({ isHubRoot: null }, 'world'), 'world', 'C054-07 world');
    assert.equal(detail({ railFrontage: 1 }, 'world2'), 'world', 'C054-07 world frontage');
    assert.equal(detail({ origin: '11' }, 'str'), 'endpoints', 'C054-07 endpoints string');
    assert.equal(detail({ destination: 5.5 }, 'frac'), 'endpoints', 'C054-07 endpoints fraction');
    assert.equal(detail({ origin: -1 }, 'low'), 'range', 'C054-07 range low');
    assert.equal(detail({ destination: 80 }, 'high'), 'range', 'C054-07 range high');
    for (const bad of [null, [999], [0], ['14'], 'x']) {
      assert.equal(detail({ railFrontage: (i) => (i === o ? bad : [54]) }, 'frontage ' + JSON.stringify(bad)), 'frontage', 'C054-07 frontage ' + JSON.stringify(bad));
    }
  }],
  ['C054-08', 'maxSteps：只有省略＝不設上限；null、負數、小數、字串、Infinity、NaN 一律 bad-input', (api) => {
    const t = yard(10, 8, col4(0, 7), hubsAB);
    for (const bad of [null, -1, 2.5, '3', Infinity, NaN, true, {}]) {
      const a = J(api.planRailRoute({ rail: t.rail, w: 10, h: 8, from: 4, to: 4, maxSteps: bad }));
      assert.deepEqual([a.reason, a.detail], ['bad-input', 'maxSteps'], 'C054-08 planRailRoute ' + String(bad));
      const b = between(api, t, t.at(1, 1), t.at(5, 5), { maxSteps: bad });
      assert.deepEqual([b.reason, b.detail], ['bad-input', 'maxSteps'], 'C054-08 planBetween ' + String(bad));
    }
    assert.deepEqual(J(api.planRailRoute({ rail: t.rail, w: 10, h: 8, from: 4, to: 4, maxSteps: 0 })), { ok: true, path: [4], steps: 0, reason: null }, 'C054-08 zero same');
  }],
  ['C054-09', 'footprintSeeds：佔地四鄰的真軌格（手算順序、地圖邊界裁切、隨機城市與獨立寫法相同、參數錯回 null）', (api) => {
    const t = yard(10, 8, col4(0, 7), hubsAB), isRail = (j) => t.rail[j] === 1;
    assert.deepEqual(J(api.footprintSeeds({ w: 10, h: 8, root: 11, size: 3, isKind: isRail })), [14, 24, 34], 'C054-09 hand order A');
    assert.deepEqual(J(api.footprintSeeds({ w: 10, h: 8, root: 55, size: 2, isKind: isRail })), [54, 64], 'C054-09 hand order B');
    assert.deepEqual(J(api.footprintSeeds({ w: 10, h: 8, root: 0, size: 2, isKind: (j) => ![0, 1, 10, 11].includes(j) })), [2, 20, 12, 21], 'C054-09 edge clip');
    for (const bad of [{ w: 10, h: 8, root: 80, size: 2, isKind: isRail }, { w: 10, h: 8, root: 1, size: 0, isKind: isRail },
      { w: 10, h: 8, root: 1, size: 2 }, { w: 0, h: 8, root: 1, size: 2, isKind: isRail }, { w: 10, h: 8, root: '1', size: 2, isKind: isRail }]) {
      assert.equal(api.footprintSeeds(bad), null, 'C054-09 invalid ' + JSON.stringify(bad));
    }
    const rnd = lcg(166);
    for (let k = 0; k < 300; k++) {
      const w = 3 + Math.floor(rnd() * 10), h = 3 + Math.floor(rnd() * 10), size = 1 + Math.floor(rnd() * 4);
      const cells = new Uint8Array(w * h).map(() => (rnd() < 0.5 ? 1 : 0)), root = Math.floor(rnd() * w * h);
      const kind = (j) => cells[j] === 1;
      assert.deepEqual(J(api.footprintSeeds({ w, h, root, size, isKind: kind })), seedsOf(w, h, kind, root % w, Math.floor(root / w), size), 'C054-09 random ' + k);
    }
  }],
  ['C054-10', 'validateCargo：容量 0、-1、\'x\'、null 等一律 bad-input，不改成 12；省略才用預設 12；超載 over-capacity 不截斷', (api) => {
    const input = { batchId: 'b1', qty: 12, commodityId: 'food', extra: true };
    const v = api.validateCargo(input, 12);
    assert.deepEqual(J(v), { ok: true, reason: null, capacity: 12, cargo: { batchId: 'b1', qty: 12, commodityId: 'food' } }, 'C054-10 valid');
    input.qty = 1;
    assert.equal(v.cargo.qty, 12, 'C054-10 copy');
    assert.equal(J(api.validateCargo({ batchId: 'b', qty: 3 })).capacity, 12, 'C054-10 default capacity');
    assert.deepEqual(J(api.validateCargo({ batchId: 'b', qty: 13 })), { ok: false, path: [], steps: -1, reason: 'over-capacity', qty: 13, capacity: 12 }, 'C054-10 over default');
    assert.deepEqual(J(api.validateCargo({ batchId: 'b', qty: 5 }, 4)), { ok: false, path: [], steps: -1, reason: 'over-capacity', qty: 5, capacity: 4 }, 'C054-10 over given');
    const detail = (c, cap) => { const r = J(api.validateCargo(c, cap)); assert.deepEqual([r.ok, r.reason], [false, 'bad-input'], 'C054-10 reason ' + JSON.stringify([c, cap])); return r.detail; };
    for (const cap of [0, -1, 'x', null, 2.5, NaN, Infinity, true, '12']) assert.equal(detail({ batchId: 'b', qty: 1 }, cap), 'capacity', 'C054-10 capacity ' + String(cap));
    for (const qty of [0, -3, 2.5, '5', null, undefined, NaN, Infinity, true]) assert.equal(detail({ batchId: 'b', qty }), 'qty', 'C054-10 qty ' + String(qty));
    for (const batchId of ['', 7, null]) assert.equal(detail({ batchId, qty: 1 }), 'batchId', 'C054-10 batchId ' + String(batchId));
    for (const commodityId of [3, '', null]) assert.equal(detail({ batchId: 'b', qty: 1, commodityId }), 'commodityId', 'C054-10 commodity ' + String(commodityId));
    for (const c of [null, undefined, 'x', [], 4]) assert.equal(detail(c), 'cargo', 'C054-10 cargo ' + String(c));
  }],
  ['C054-11', 'createFreightRun054：不合法容量／數量丟 code＝bad-input，超載丟 over-capacity，不建任務', (api) => {
    const route = J(api.planRailRoute({ rail: new Uint8Array([1, 1, 1]), w: 3, h: 1, from: 0, to: 2 }));
    for (const [args, code, d] of [[[{ batchId: 'b', qty: 1 }, 0], 'bad-input', 'capacity'], [[{ batchId: 'b', qty: 1 }, 'x'], 'bad-input', 'capacity'],
      [[{ batchId: 'b', qty: 1 }, -1], 'bad-input', 'capacity'], [[{ batchId: 'b', qty: 0 }, 12], 'bad-input', 'qty'],
      [[{ batchId: 'b', qty: 13 }, undefined], 'over-capacity', undefined]]) {
      const e = caught(() => api.createFreightRun054('s', route, ...args));
      assert.deepEqual([e && e.code, e && e.detail], [code, d], 'C054-11 ' + code + ' ' + JSON.stringify(args));
    }
  }],
  ['C054-12', '快照不共用物件：改回傳的 unloadedAt、改呼叫端的貨物物件，都不影響任務', (api) => {
    const route = J(api.planRailRoute({ rail: new Uint8Array([1, 1]), w: 2, h: 1, from: 0, to: 1 }));
    const cargo = { batchId: 'b', qty: 4, commodityId: 'food' };
    const run = api.createFreightRun054('s', route, cargo, 6);
    cargo.qty = 99; cargo.batchId = 'forged';
    run.step();
    const u = run.unload();
    u.unloadedAt.cursor = 42;
    const s = run.snapshot();
    assert.deepEqual(J(s.unloadedAt), { cursor: 1, step: 1 }, 'C054-12 unloadedAt copy');
    assert.deepEqual([s.qty, s.batchId, s.capacity], [4, 'b', 6], 'C054-12 cargo copy');
  }],
  ['C054-13', '隨機軌網：planBetween 的步數等於獨立 BFS 的最短距離，頭尾貼站、每步相鄰在軌上', (api) => {
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
        bs.push({ x, y, size, hub: true });
      }
      const cells = [];
      for (let i = 0; i < w * h; i++) if (owner[i] < 0 && rnd() < 0.55) cells.push([i % w, Math.floor(i / w)]);
      const t = yard(w, h, cells, bs), isRail = (j) => t.rail[j] === 1;
      for (const a of bs) for (const b of bs) {
        if (a === b) continue;
        const res = between(api, t, t.at(a.x, a.y), t.at(b.x, b.y));
        const src = seedsOf(w, h, isRail, a.x, a.y, a.size), dst = seedsOf(w, h, isRail, b.x, b.y, b.size);
        if (!src.length || !dst.length) { assert.equal(res.reason, 'hub-not-on-rail', 'C054-13 not on rail'); continue; }
        let best = -1;
        for (const s of src) for (const d of dst) { const q = bfsDist(w, h, isRail, s, d); if (q >= 0 && (best < 0 || q < best)) best = q; }
        if (best < 0) { assert.equal(res.reason, 'unreachable', 'C054-13 unreachable w' + world); unreachable++; continue; }
        assert.equal(res.ok, true, 'C054-13 ok w' + world);
        assert.equal(res.steps, best, 'C054-13 shortest w' + world);
        assert.ok(src.includes(res.path[0]) && dst.includes(res.path[res.path.length - 1]), 'C054-13 ends at hubs w' + world);
        for (let i = 0; i < res.path.length; i++) {
          assert.ok(isRail(res.path[i]), 'C054-13 on rail w' + world);
          if (i) { const p = res.path[i - 1], c = res.path[i]; assert.equal(Math.abs(p % w - c % w) + Math.abs(Math.floor(p / w) - Math.floor(c / w)), 1, 'C054-13 adjacent w' + world); }
        }
        found++;
      }
    }
    assert.ok(found > 100 && unreachable > 20, 'C054-13 coverage found=' + found + ' unreachable=' + unreachable);
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
const realRed = runNewChecks(require('./rail-freight054.js'), true);
assert.equal(realRed, null, 'T783 new core checks: ' + JSON.stringify(realRed));
assert.equal(runNewChecks(loadCore(CORE_SRC), false), null, 'T783 vm-loaded core passes the same checks');

// 負控制：每一條只改核心原文一處；第一個紅燈必須落在目標項（T783 B8）。
const MUTANTS = [
  ['C054-01', 'originFrontage: sources, destinationFrontage: targets', 'originFrontage: targets, destinationFrontage: sources'],
  ['C054-02', 'for (const s of sources) {', 'for (const s of sources.slice().reverse()) {'],
  ['C054-03', "    if (!isHubRoot(destination)) return fail(REASONS.NOT_HUB, { side: 'destination' });\n", ''],
  ['C054-04', "    if (!targets.length) return fail(REASONS.HUB_NOT_ON_RAIL, { side: 'destination' });\n", ''],
  ['C054-05', 'const path = search(isRail, w, h, sources, targets);\n    if (!path) return fail(REASONS.UNREACHABLE);',
    'const path = search(isRail, w, h, sources, targets);\n    if (!path) return fail(REASONS.HUB_NOT_ON_RAIL);'],
  ['C054-06', 'if (steps > limit) return fail(REASONS.TOO_FAR, { steps, limit });\n    return {\n      ok: true, path, steps, reason: null,\n      originRoot',
    'if (steps > limit + 1) return fail(REASONS.TOO_FAR, { steps, limit });\n    return {\n      ok: true, path, steps, reason: null,\n      originRoot'],
  ['C054-07', "    if (typeof isHubRoot !== 'function' || typeof railFrontage !== 'function') return fail(REASONS.BAD_INPUT, { detail: 'world' });\n", ''],
  ['C054-07', 'for (const c of list) if (!isInt(c) || c < 0 || c >= total || !isRail(c)) return null;', 'for (const c of list) if (!isInt(c) || c < 0 || c >= total) return null;'],
  ['C054-08', 'const stepLimit = (v) => (v === undefined ? Infinity', 'const stepLimit = (v) => (v === undefined || v === null ? Infinity'],
  ['C054-09', 'if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;\n      const j = ny * w + nx;\n      if (!isKind(j) || out.includes(j)) continue;',
    'if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;\n      const j = ny * w + nx;\n      if (!isKind(j)) continue;'],
  ['C054-10', 'if (!Number.isSafeInteger(cap) || cap <= 0) return fail(REASONS.BAD_INPUT, { detail: \'capacity\' });',
    'if (!Number.isSafeInteger(cap) || cap <= 0) return validateCargo(cargo, DEFAULT_CAPACITY);'],
  ['C054-11', 'if (!checked.ok) throw checked.reason === REASONS.OVER_CAPACITY ? coded(REASONS.OVER_CAPACITY) : badInput(checked.detail);',
    'if (!checked.ok) throw checked.reason === REASONS.OVER_CAPACITY ? coded(REASONS.OVER_CAPACITY) : coded(checked.detail);'],
  ['C054-12', 'unloadedAt: unloadedAt ? { cursor: unloadedAt.cursor, step: unloadedAt.step } : null,', 'unloadedAt,'],
  ['C054-13', "const nb = [cy > 0 ? cur - w : -1, cx < w - 1 ? cur + 1 : -1, cy < h - 1 ? cur + w : -1, cx > 0 ? cur - 1 : -1];\n      for (let k = 0; k < 4; k++) {",
    "const nb = [cy > 0 ? cur - w : -1, cx < w - 1 ? cur + 1 : -1, cy < h - 1 ? cur + w : -1, cx > 0 ? cur - 1 : -1, cy > 0 && cx < w - 1 ? cur - w + 1 : -1];\n      for (let k = 0; k < 5; k++) {"]
];
for (const [target, find, repl] of MUTANTS) {
  assert.equal(CORE_SRC.split(find).length, 2, 'mutant anchor must be unique: ' + target);
  const red = runNewChecks(loadCore(CORE_SRC.split(find).join(repl)), false);
  assert.ok(red && red.id === target, 'mutant for ' + target + ' must first fail at ' + target + ', got ' + JSON.stringify(red));
  console.log('  red ' + target + ' ← ' + red.message);
}
console.log('  ok  負控制 ' + MUTANTS.length + ' 條，首紅都落在目標項');

console.log('\nRAIL_FREIGHT_054 ' + JSON.stringify({ checks, ok: true }));

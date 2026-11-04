'use strict';
/* DSK-022 / LAB-09：有界客運研究核心的行為測試（不用 Chrome）。
 * 用法：node passenger-demand056.test.js
 */
const assert = require('node:assert/strict');
const { REASONS, summarizeDemand, rankUnserved, boundedStudy } = require('./passenger-demand056.js');

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };
const row = (o, d, p, trips, walk, transit, car) => ({ origin: o, destination: d, purpose: p, trips, walk, transit, car });

ok('守恒：walk+transit+car+unserved === trips', () => {
  const s = summarizeDemand([
    row('A', 'B', 'work', 100, 10, 60, 20),
    row('C', 'D', 'work', 50, 0, 20, 30)
  ]);
  assert.equal(s.ok, true);
  assert.equal(s.conserved, true);
  assert.equal(s.totals.trips, 150);
  assert.equal(s.totals.unserved, 10);
  assert.equal(s.totals.served, 140);
});

ok('逐列 unserved 正確', () => {
  const s = summarizeDemand([row('A', 'B', 'work', 100, 10, 60, 20)]);
  assert.equal(s.rows[0].unserved, 10);
  assert.equal(s.rows[0].served, 90);
});

ok('已服務超過總量 → overflow（不是默默截斷）', () => {
  const s = summarizeDemand([row('A', 'B', 'work', 10, 5, 5, 5)]);
  assert.equal(s.ok, false);
  assert.equal(s.reason, REASONS.OVERFLOW);
});

ok('負數 → negative；非數字 → bad-input；非物件 → not-object', () => {
  assert.equal(summarizeDemand([row('A', 'B', 'work', 10, -1, 0, 0)]).reason, REASONS.NEGATIVE);
  assert.equal(summarizeDemand([row('A', 'B', 'work', NaN, 0, 0, 0)]).reason, REASONS.BAD_INPUT);
  assert.equal(summarizeDemand([null]).reason, REASONS.NOT_OBJECT);
  assert.equal(summarizeDemand('nope').reason, REASONS.BAD_INPUT);
});

ok('排序：未服務多者先；同分以 origin、destination 升冪（決定性）', () => {
  const s = summarizeDemand([
    row('B', 'X', 'work', 10, 0, 0, 0),
    row('A', 'Y', 'work', 10, 0, 0, 0),
    row('C', 'Z', 'work', 50, 0, 0, 0)
  ]);
  const top = rankUnserved(s.rows, 3);
  assert.deepEqual(top.map((r) => r.origin), ['C', 'A', 'B']);
  const again = rankUnserved(s.rows, 3);
  assert.deepEqual(again.map((r) => r.origin), ['C', 'A', 'B']);
});

ok('截斷：maxRows 超過上限標 truncated，不偷偷吃掉全部', () => {
  const many = [];
  for (let i = 0; i < 10; i++) many.push(row('O' + i, 'D' + i, 'work', 1, 0, 1, 0));
  const s = boundedStudy(many, { maxRows: 4, top: 2 });
  assert.equal(s.ok, true);
  assert.equal(s.truncated, true);
  assert.equal(s.rowCount, 4);
  assert.equal(s.topUnserved.length, 2);
});

ok('空 OD：0 也照實回，不報錯', () => {
  const s = summarizeDemand([]);
  assert.equal(s.ok, true);
  assert.equal(s.totals.trips, 0);
  assert.equal(s.totals.unserved, 0);
  assert.equal(s.conserved, true);
  assert.equal(s.truncated, false);
});

ok('byPurpose 聚合', () => {
  const s = summarizeDemand([
    row('A', 'B', 'work', 10, 0, 10, 0),
    row('A', 'B', 'shopping', 5, 5, 0, 0)
  ]);
  assert.deepEqual(s.totals.byPurpose, { work: 10, shopping: 5 });
});

// T780：原生 OD 每列另有 bike 與原生 unserved（GV.t468().assignment.od 實測欄位）。
ok('T780 bike 算已服務，不算未服務', () => {
  const s = summarizeDemand([Object.assign(row('A', 'B', 'work', 100, 10, 50, 20), { bike: 20 })]);
  assert.equal(s.ok, true);
  assert.equal(s.rows[0].served, 100);
  assert.equal(s.rows[0].unserved, 0);
  assert.equal(s.totals.bike, 20);
  assert.equal(s.conserved, true);
});

ok('T780 有原生 unserved 時照用原生值', () => {
  const s = summarizeDemand([Object.assign(row('A', 'B', 'work', 100, 10, 50, 20), { bike: 5, unserved: 15 })]);
  assert.equal(s.ok, true);
  assert.equal(s.rows[0].unserved, 15);
  assert.equal(s.rows[0].unservedSource, 'native');
  assert.equal(s.totals.unserved, 15);
});

ok('T780 五項加總不等於 trips → nonconserved（不猜）', () => {
  const s = summarizeDemand([Object.assign(row('A', 'B', 'work', 100, 10, 50, 20), { bike: 5, unserved: 5 })]);
  assert.equal(s.ok, false);
  assert.equal(s.reason, REASONS.NONCONSERVED);
});

ok('T780 bike／unserved 給了壞值 → bad-input／negative（不靜默當 0）', () => {
  assert.equal(summarizeDemand([Object.assign(row('A', 'B', 'work', 10, 0, 0, 0), { bike: 'x' })]).reason, REASONS.BAD_INPUT);
  assert.equal(summarizeDemand([Object.assign(row('A', 'B', 'work', 10, 0, 0, 0), { unserved: NaN })]).reason, REASONS.BAD_INPUT);
  assert.equal(summarizeDemand([Object.assign(row('A', 'B', 'work', 10, 0, 0, 0), { bike: -1 })]).reason, REASONS.NEGATIVE);
});

ok('T780 容差只在明示 rowTolerance 時放寬（預設仍是 1e-6）', () => {
  // 原生每欄四捨五入到 0.1：8.9 = 8.8 + 0.1 + 0（ok），但 9.0 ≠ 8.8 + 0.1 + 0.2（差 0.1）。
  const r = Object.assign(row('A', 'B', 'work', 9.0, 8.8, 0, 0.1), { bike: 0, unserved: 0.2 });
  assert.equal(summarizeDemand([r]).reason, REASONS.NONCONSERVED);
  const s = summarizeDemand([r], { rowTolerance: 0.3 });
  assert.equal(s.ok, true);
  assert.equal(s.rowTolerance, 0.3);
  // 守恆只在容差內成立時，原生值（0.2）和推算值（9.0 − 8.9 = 0.1）不同：必須用原生的。
  assert.equal(s.rows[0].unserved, 0.2);
  assert.equal(s.rows[0].unservedSource, 'native');
  assert.equal(summarizeDemand([row('A', 'B', 'work', 9, 9.05, 0, 0)]).reason, REASONS.OVERFLOW);
});

console.log('\nPASSENGER_DEMAND_056 ' + JSON.stringify({ checks, ok: true }));

'use strict';
/* DSK-020 / LAB-06 階段 A：閉塞區間純核心的行為測試（不用 Chrome、不用網路）。
 * 用法：node rail-block055.test.js
 */
const assert = require('node:assert/strict');
const { REASONS, DEFAULT_MAX_TRAINS, createBlockAuthority055 } = require('./rail-block055.js');

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };

ok('第一列 GRANTED、第二列 WAITING、第三列 too-many', () => {
  const a = createBlockAuthority055({ maxTrains: 2 });
  const r1 = a.request('t1');
  assert.equal(r1.ok, true);
  assert.equal(r1.status, 'GRANTED');
  const r2 = a.request('t2');
  assert.equal(r2.ok, true);
  assert.equal(r2.status, 'WAITING');
  const r3 = a.request('t3');
  assert.equal(r3.ok, false);
  assert.equal(r3.reason, REASONS.TOO_MANY);
  assert.equal(DEFAULT_MAX_TRAINS, 2);
});

ok('重複 request 回 duplicate（holder 與等待中都算）', () => {
  const a = createBlockAuthority055({ maxTrains: 2 });
  a.request('t1'); a.request('t2');
  assert.equal(a.request('t1').reason, REASONS.DUPLICATE);
  assert.equal(a.request('t2').reason, REASONS.DUPLICATE);
});

ok('release 後等待者依 FIFO 取得路權', () => {
  const a = createBlockAuthority055({ maxTrains: 3 });
  a.request('t1'); a.request('t2'); a.request('t3');
  const r = a.release('t1');
  assert.equal(r.ok, true);
  assert.equal(r.granted, 't2');
  assert.deepEqual(a.snapshot().waiting, ['t3']);
  const r2 = a.release('t2');
  assert.equal(r2.granted, 't3');
  assert.equal(a.snapshot().holder, 't3');
});

ok('非 holder release 被拒（not-holder）', () => {
  const a = createBlockAuthority055({ maxTrains: 2 });
  a.request('t1'); a.request('t2');
  assert.equal(a.release('t2').reason, REASONS.NOT_HOLDER);
  assert.equal(a.snapshot().holder, 't1');
});

ok('canAdvance：有路權才准，斷軌格拒絕', () => {
  const a = createBlockAuthority055({ maxTrains: 2 });
  a.request('t1'); a.request('t2');
  assert.deepEqual(a.canAdvance('t1', 5), { ok: true, reason: null });
  assert.equal(a.canAdvance('t2', 5).reason, REASONS.NO_AUTHORITY);
  a.breakTile(5);
  const blocked = a.canAdvance('t1', 5);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, REASONS.TRACK_BROKEN);
  assert.equal(blocked.tile, 5);
  a.repairTile(5);
  assert.deepEqual(a.canAdvance('t1', 5), { ok: true, reason: null });
});

ok('斷軌對其他格沒有影響', () => {
  const a = createBlockAuthority055();
  a.request('t1');
  a.breakTile(5);
  assert.equal(a.canAdvance('t1', 6).ok, true);
  assert.equal(a.isBroken(5), true);
  assert.equal(a.isBroken(6), false);
});

ok('snapshot 形狀穩定：broken 排序、waiting 依 FIFO', () => {
  const a = createBlockAuthority055({ maxTrains: 3 });
  a.request('t1'); a.request('t2'); a.request('t3');
  a.breakTile(9); a.breakTile(3); a.breakTile(7);
  const s = a.snapshot();
  assert.equal(s.holder, 't1');
  assert.deepEqual(s.waiting, ['t2', 't3']);
  assert.deepEqual(s.broken, [3, 7, 9]);
  assert.equal(s.trains, 3);
  assert.equal(s.maxTrains, 3);
});

ok('全部釋放後 holder 為 null，可再接受新列', () => {
  const a = createBlockAuthority055({ maxTrains: 2 });
  a.request('t1');
  a.release('t1');
  assert.equal(a.snapshot().holder, null);
  const r = a.request('t9');
  assert.equal(r.status, 'GRANTED');
});

ok('壞輸入：空 id／負 tile', () => {
  const a = createBlockAuthority055();
  assert.equal(a.request('').reason, REASONS.BAD_INPUT);
  assert.equal(a.breakTile(-1).reason, REASONS.BAD_INPUT);
  assert.equal(a.canAdvance('t1', 0).reason, REASONS.NO_AUTHORITY);
});

console.log('\nRAIL_BLOCK_055 ' + JSON.stringify({ checks, ok: true }));

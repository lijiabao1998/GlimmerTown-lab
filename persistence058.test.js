'use strict';
/* DSK-035 / LAB-12：持久化信封核心的自檢（純 Node，不需要瀏覽器）。 */
const assert = require('node:assert/strict');
const P = require('./persistence058.js');

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };

const sample = () => ({
  ledger: { revision: 3, unissued: 5, batches: [{ batchId: 'batch-A', qty: 7, state: 'HELD', owner: 'research-receiver' }] },
  warehouse: { capacity: 10, used: 0, storedBatchIds: [] },
  block: { holder: 'train-057', broken: [1521] },
  trips: [{ id: 't1', status: 'DELIVERED', qty: 7 }]
});

ok('pack→unpack 往返完全一致（含鍵序不同也一樣）', () => {
  const a = sample();
  const b = { trips: a.trips, block: a.block, warehouse: a.warehouse, ledger: a.ledger };
  const pa = P.pack(a), pb = P.pack(b);
  assert.equal(pa.ok, true);
  assert.equal(pa.envelope.checksum, pb.envelope.checksum, '鍵序不影響校驗');
  const r = P.unpack(pa.envelope);
  assert.equal(r.ok, true);
  assert.deepEqual(r.state, a);
});

ok('未知 schema 直接拒絕', () => {
  const e = P.pack(sample()).envelope;
  e.schema = 'glimmertown-lab.shadow.v999';
  const r = P.unpack(e);
  assert.equal(r.ok, false);
  assert.equal(r.code, P.RS.UNKNOWN_SCHEMA);
});

ok('版本超前拒絕，不猜', () => {
  const e = P.pack(sample()).envelope;
  e.version = 2;
  const r = P.unpack(e);
  assert.equal(r.ok, false);
  assert.equal(r.code, P.RS.VERSION_AHEAD);
});

ok('payload 被改一個數字 → 校驗失敗', () => {
  const e = P.pack(sample()).envelope;
  e.payload.ledger.batches[0].qty = 8;
  const r = P.unpack(e);
  assert.equal(r.ok, false);
  assert.equal(r.code, P.RS.CHECKSUM);
});

ok('缺必填區塊 → 指名是哪一塊', () => {
  const e = P.pack(sample()).envelope;
  delete e.payload.block;
  e.checksum = P.fnv(P.canon(e.payload));
  const r = P.unpack(e, { required: ['ledger', 'block'] });
  assert.equal(r.ok, false);
  assert.equal(r.code, P.RS.MISSING_BLOCK);
  assert.equal(r.block, 'block');
});

ok('還原失敗時原狀態完全不動（原子回滾）', () => {
  const current = sample();
  const before = JSON.stringify(current);
  const e = P.pack(sample()).envelope;
  e.payload.trips[0].qty = 70;
  const r = P.restore(current, e, { required: ['ledger'] });
  assert.equal(r.ok, false);
  assert.equal(r.code, P.RS.CHECKSUM);
  assert.equal(JSON.stringify(current), before, '原物件沒被改');
  assert.equal(r.state, current, '回傳的仍是原物件');
});

ok('還原成功時拿到深拷貝，改它不污染來源', () => {
  const e = P.pack(sample()).envelope;
  const r = P.restore(null, e, { required: ['ledger', 'warehouse'] });
  assert.equal(r.ok, true);
  r.state.ledger.batches[0].qty = 999;
  assert.equal(e.payload.ledger.batches[0].qty, 7, '信封本體沒被改');
});

ok('守恆欄位在往返後仍一致（qty / unissued / capacity）', () => {
  const a = sample();
  const r = P.unpack(P.pack(a).envelope);
  assert.equal(r.state.ledger.batches[0].qty, a.ledger.batches[0].qty);
  assert.equal(r.state.ledger.unissued, a.ledger.unissued);
  assert.equal(r.state.warehouse.capacity, a.warehouse.capacity);
  assert.equal(r.state.ledger.batches.reduce((s, b) => s + b.qty, 0), 7);
});

ok('非物件輸入一律 bad-input', () => {
  for (const bad of [null, undefined, 42, 'x', []]) {
    assert.equal(P.pack(bad).ok, false);
    assert.equal(P.pack(bad).code, P.RS.BAD_INPUT);
  }
});

ok('capture：只保留白名單欄位，正式經濟欄位不會被寫進信封', () => {
  const c = P.captureShadow058({
    ledger: { revision: 3, unissued: 5, manifest: { total: 12 }, money: 9999, population: 327,
      batches: [{ batchId: 'batch-A', qty: 7, state: 'HELD', owner: 'research-receiver', destination: 'research-receiver', secret: 'nope' }] },
    block: { holder: 'train-057', broken: [1521], internal: 'x' },
    trips: [{ id: 't1', status: 'DELIVERED', batchId: 'batch-A', qty: 7, revenue: 500 }]
  });
  assert.equal(c.ok, true);
  const text = JSON.stringify(c.payload);
  for (const banned of ['money', 'population', 'secret', 'internal', 'revenue']) {
    assert.equal(text.indexOf(banned), -1, banned + ' 不該進信封');
  }
  assert.deepEqual(Object.keys(c.payload).sort(), ['block', 'ledger', 'trips', 'warehouse']);
});

ok('capture→pack→unpack 往返後守恆仍成立', () => {
  const c = P.captureShadow058({
    ledger: { revision: 3, unissued: 5, manifest: { total: 12 }, batches: [{ batchId: 'batch-A', qty: 7, state: 'HELD', owner: 'research-receiver', destination: 'research-receiver' }] },
    block: { holder: 'train-057', broken: [1521] },
    trips: [{ id: 't1', status: 'DELIVERED', batchId: 'batch-A', qty: 7 }]
  });
  assert.equal(c.conservation.ok, true);
  const r = P.unpack(P.pack(c.payload).envelope, { required: ['ledger', 'warehouse', 'block', 'trips'] });
  assert.equal(r.ok, true);
  assert.deepEqual(r.state, c.payload);
  const sum = r.state.ledger.batches.reduce((s, b) => s + b.qty, 0);
  assert.equal(sum + r.state.ledger.unissued, r.state.ledger.manifestTotal);
});

ok('capture：沒有 manifest 總量時守恆回 null（不假裝算過）', () => {
  const c = P.captureShadow058({ ledger: { revision: 1, unissued: 2, batches: [{ batchId: 'b', qty: 3 }] } });
  assert.equal(c.conservation.ok, null);
  assert.equal(c.conservation.sumBatches, 3);
});

console.log('PERSISTENCE_058 ' + JSON.stringify({ checks, ok: true }));

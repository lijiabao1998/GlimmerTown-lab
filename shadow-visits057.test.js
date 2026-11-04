'use strict';
/* DSK-023 / LAB-10：影子到訪模型的行為測試（不用 Chrome）。
 * 用法：node shadow-visits057.test.js
 */
const assert = require('node:assert/strict');
const { REASONS, computeShadowVisits, rankShops } = require('./shadow-visits057.js');

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };

ok('直線衰減：距離 0 全額、距離 = radius 權重 0', () => {
  const r = computeShadowVisits({
    radius: 10,
    stations: [{ id: 's1', x: 0, y: 0, demand: 100 }],
    shops: [{ id: 'a', x: 0, y: 0, attract: 1 }, { id: 'b', x: 10, y: 0, attract: 1 }]
  });
  assert.equal(r.ok, true);
  assert.equal(r.rows[0].visits, 100);
  assert.equal(r.rows[1].visits, 0);
  assert.equal(r.rows[1].connected, 1);
});

ok('半徑外不連：isolated 標記', () => {
  const r = computeShadowVisits({
    radius: 5,
    stations: [{ id: 's1', x: 0, y: 0, demand: 50 }],
    shops: [{ id: 'far', x: 20, y: 20, attract: 1 }]
  });
  assert.equal(r.rows[0].connected, 0);
  assert.equal(r.rows[0].isolated, true);
  assert.equal(r.totals.isolated, 1);
  assert.equal(r.rows[0].visits, 0);
});

ok('多站疊加＋吸引度加權', () => {
  const r = computeShadowVisits({
    radius: 4,
    stations: [{ id: 's1', x: 0, y: 0, demand: 10 }, { id: 's2', x: 2, y: 0, demand: 10 }],
    shops: [{ id: 'a', x: 0, y: 0, attract: 2 }]
  });
  // s1: 10*2*1 = 20；s2: 10*2*(1-2/4)=10 → 30
  assert.equal(r.rows[0].raw, 30);
  assert.equal(r.rows[0].visits, 30);
  assert.equal(r.rows[0].sources.length, 2);
});

ok('排序：到訪多者先，同分以 id 升冪（決定性）', () => {
  const r = computeShadowVisits({
    radius: 4,
    stations: [{ id: 's1', x: 0, y: 0, demand: 10 }],
    shops: [{ id: 'b', x: 0, y: 0 }, { id: 'a', x: 0, y: 0 }, { id: 'c', x: 0, y: 0 }]
  });
  const top = rankShops(r.rows, 3).map((x) => x.id);
  assert.deepEqual(top, ['a', 'b', 'c']);
});

ok('沒有車站 → no-stations（不是回一堆 0 假裝成功）', () => {
  const r = computeShadowVisits({ stations: [], shops: [{ id: 'a', x: 0, y: 0 }] });
  assert.equal(r.ok, false);
  assert.equal(r.reason, REASONS.NO_STATIONS);
});

ok('壞資料：非陣列、非物件、負座標、負 demand', () => {
  assert.equal(computeShadowVisits({ stations: 'x', shops: [] }).reason, REASONS.BAD_INPUT);
  assert.equal(computeShadowVisits({ stations: [null], shops: [] }).reason, REASONS.BAD_INPUT);
  assert.equal(computeShadowVisits({ stations: [{ x: -1, y: 0, demand: 1 }], shops: [] }).reason, REASONS.NEGATIVE);
  assert.equal(computeShadowVisits({ stations: [{ x: 0, y: 0, demand: -5 }], shops: [] }).reason, REASONS.NEGATIVE);
});

ok('上限：超過 maxShops 標 truncated', () => {
  const shops = [];
  for (let i = 0; i < 10; i++) shops.push({ id: 'sh' + i, x: 0, y: 0 });
  const r = computeShadowVisits({ radius: 4, stations: [{ id: 's', x: 0, y: 0, demand: 1 }], shops, maxShops: 3 });
  assert.equal(r.ok, true);
  assert.equal(r.truncated, true);
  assert.equal(r.shopCount, 3);
});

ok('demandScale 縮放', () => {
  const r = computeShadowVisits({ radius: 4, demandScale: 2, stations: [{ id: 's', x: 0, y: 0, demand: 10 }], shops: [{ id: 'a', x: 0, y: 0 }] });
  assert.equal(r.rows[0].visits, 20);
});

// T781：真步行距離（walkDistance，參數順序同 GV.path502）與半徑邊界。
const one = (walkDistance, radius) => computeShadowVisits({ radius, walkDistance, stations: [{ id: 's', x: 0, y: 0, demand: 100 }], shops: [{ id: 'a', x: 3, y: 0, attract: 1 }] });

ok('T781 步行距離覆蓋曼哈頓：繞路變遠就不連', () => {
  assert.equal(one(undefined, 5).rows[0].connected, 1);                // 曼哈頓 3 ≤ 5
  const r = one(() => 9, 5);                                            // 實際要走 9
  assert.equal(r.ok, true);
  assert.equal(r.distanceSource, 'walkDistance');
  assert.equal(r.rows[0].connected, 0);
  assert.equal(r.rows[0].isolated, true);
  assert.equal(one(() => 2, 5).rows[0].visits, 60);                     // 100 × (1 − 2/5)
});

ok('T781 到不了（Infinity）算 isolated', () => {
  const r = one(() => Infinity, 18);
  assert.equal(r.rows[0].isolated, true);
  assert.equal(r.totals.visits, 0);
});

ok('T781 null／undefined／NaN 不會被當成距離 0；負數回 negative', () => {
  for (const v of [null, undefined, NaN, '3']) {
    const r = one(() => v, 18);
    assert.equal(r.ok, true);
    assert.equal(r.rows[0].isolated, true, String(v));
    assert.equal(r.rows[0].visits, 0, String(v));
  }
  assert.equal(one(() => -1, 18).reason, REASONS.NEGATIVE);
});

ok('T781 半徑邊界：d = radius 連（權重 0）、d = radius + 0.01 不連', () => {
  const at = one(() => 5, 5);
  assert.equal(at.rows[0].connected, 1);
  assert.equal(at.rows[0].visits, 0);
  const over = one(() => 5.01, 5);
  assert.equal(over.rows[0].connected, 0);
  assert.equal(over.rows[0].isolated, true);
  const inside = one(() => 4.99, 5);
  assert.equal(inside.rows[0].connected, 1);
});

console.log('\nSHADOW_VISITS_057 ' + JSON.stringify({ checks, ok: true }));

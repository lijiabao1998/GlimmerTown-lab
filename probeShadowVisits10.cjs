'use strict';
/* DSK-023 / LAB-10 階段 A 的實測 probe（唯讀）。
 *
 * 掃真實地圖上的車站（k 17/21/55/139）與商業建築（k 2），把真座標餵給影子到訪模型。
 * fresh 城市通常兩個都是 0；那就用合成座標示範模型，並在 facts 裡照實分開標記。
 *
 * 用法：node probeShadowVisits10.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { withGame } = require('./harness.js');

const CORE = fs.readFileSync(path.join(__dirname, 'shadow-visits057.js'), 'utf8');
const STATION_KS = [17, 21, 55, 139];

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  const storageLen = () => { try { return localStorage.length; } catch (e) { return -1; } };
  try {
    ${CORE}
    const M = globalThis.shadowVisits057;
    if (!M) throw new Error('核心沒有載入');

    const before = storageLen();
    let N = 0;
    for (let x = 0; x <= 256; x++) { if (!GV.tile(x, 0)) break; N = x + 1; }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;

    const stationKs = ${JSON.stringify(STATION_KS)};
    const stations = [], shops = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const t = GV.tile(x, y);
        if (!t || !t.bld || t.bld.ref) continue;
        const k = t.bld.k;
        if (stationKs.indexOf(k) >= 0) stations.push({ id: 'k' + k + '@' + x + ',' + y, x, y, demand: 0 });
        else if (k === 2) shops.push({ id: 'shop@' + x + ',' + y, x, y, attract: 1 });
      }
    }
    out.facts.scan = { stations: stations.length, shops: shops.length };

    // 真座標：需求為 0（新城市沒有住戶），模型只會得到 0；照實記。
    if (stations.length && shops.length) {
      const real = M.computeShadowVisits({ radius: 12, stations, shops });
      out.facts.realGeometry = { ok: real.ok, reason: real.reason, shopCount: real.shopCount, totals: real.ok ? real.totals : null, demandSource: 'native-geometry/synthetic-zero-demand' };
      if (!real.ok) fail('真座標跑模型失敗：' + real.reason);
    }

    // 合成示範：3 站 6 店，驗證模型在頁面內也一致
    const synStations = [
      { id: 'S1', x: 20, y: 20, demand: 100 },
      { id: 'S2', x: 30, y: 24, demand: 60 },
      { id: 'S3', x: 44, y: 20, demand: 40 }
    ];
    const synShops = [
      { id: 'A', x: 21, y: 20, attract: 1.5 },
      { id: 'B', x: 25, y: 22, attract: 1 },
      { id: 'C', x: 31, y: 25, attract: 1 },
      { id: 'D', x: 40, y: 20, attract: 2 },
      { id: 'E', x: 60, y: 60, attract: 1 },
      { id: 'F', x: 20, y: 40, attract: 0.5 }
    ];
    const syn = M.computeShadowVisits({ radius: 10, stations: synStations, shops: synShops });
    out.facts.synthetic = {
      ok: syn.ok, radius: syn.radius, totals: syn.totals,
      top: M.rankShops(syn.rows, 3).map((r) => ({ id: r.id, visits: r.visits, isolated: r.isolated }))
    };
    if (!syn.ok) fail('合成模型失敗：' + syn.reason);
    if (syn.totals.isolated < 2) fail('應該至少 2 家店在步行半徑外（E 與 F）');
    if (M.rankShops(syn.rows, 1)[0].id !== 'A') fail('合成模型第一名不是 A');

    const after = storageLen();
    out.facts.readOnly = { storageBefore: before, storageAfter: after, unchanged: before === after };
    if (before !== after) fail('probe 改動了 localStorage');

    out.ok = out.fails.length === 0;
    return out;
  } catch (e) {
    out.error = String((e && e.stack) || e);
    return out;
  }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => cdp.evalJs(PAGE));
  const res = r && r.result;
  console.log('PROBE_VISITS10 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_VISITS10 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_VISITS10 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

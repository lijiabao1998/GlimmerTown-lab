'use strict';
/* DSK-023 / LAB-10 階段 A 的實測 probe（唯讀）。
 *
 * T781：在固定種子沙盒裡用遊戲原生的開發者沙盒（T516B，只解鎖工具、不改模擬）擺一個真場景：
 *   一段主路、一小段軌、一座 k17 火車站、三家接主路的高街商店，另一家只接在一段和主路不連通的小路上。
 * 讀取階段掃地圖找車站（k 17/21/55/139）與高街商店（HIGHSTREET005 裡 role 為 commerce 的 k，從 index.html 機械讀出），
 * 距離用原生 T502 步行網（GV.path502(...,'walk')），半徑取原生車站步行集水區門檻 18（amStationCatchment502 的 wd<=18）。
 * 需求是合成的（每站 100），照實標 demandSource:'synthetic'。合成 3 站 6 店的示範保留。
 *
 * 用法：node probeShadowVisits10.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { withGame } = require('./harness.js');

const CORE = fs.readFileSync(path.join(__dirname, 'shadow-visits057.js'), 'utf8');
const STATION_KS = [17, 21, 55, 139];
// 高街商店：HIGHSTREET005 裡 role:'commerce' 的建築（k、工具 id、邊長），從正式 index.html 機械讀出，不寫死。
const INDEX = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const HS_BLOCK = INDEX.slice(INDEX.indexOf('const HIGHSTREET005=Object.freeze({'), INDEX.indexOf('const HIGHSTREET_TOOL005='));
const COMMERCE = [...HS_BLOCK.matchAll(/(\d+):Object\.freeze\(\{k:\1,id:'(\w+)'[^\n]*?sz:(\d+)[^\n]*?role:'(\w+)'/g)]
  .filter((m) => m[4] === 'commerce').map((m) => ({ k: +m[1], id: m[2], sz: +m[3] }));
if (COMMERCE.length < 3) throw new Error('HIGHSTREET005 commerce 少於 3 種：' + JSON.stringify(COMMERCE));
const WALK_RADIUS = 18;

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    ${CORE}
    const M = globalThis.shadowVisits057;
    if (!M) throw new Error('核心沒有載入');

    // 第一階段：擺真場景（只動可拋棄的沙盒）。
    const COMMERCE = ${JSON.stringify(COMMERCE)};
    GV.setSpeed(0);
    GV.newWorldSeeded(20261104);
    GV.addMoney(5000000);
    const conf = window.confirm;
    window.confirm = () => true;
    let sandbox = false;
    try { sandbox = GV.enterSandbox516B(); } finally { window.confirm = conf; }
    const god = GV.setGod516B(true), unlock = GV.setOverride516B('unlockAll', true);
    out.facts.devSandbox = { sandbox, god, unlock };
    if (!sandbox || !god || !unlock) fail('原生開發者沙盒沒有開成：' + JSON.stringify(out.facts.devSandbox));

    let N = 0;
    for (let n = 64; n <= 256; n += 32) { if (!GV.tile(n - 1, 0)) break; N = n; }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;
    const plain = (x, y) => { const t = GV.tile(x, y); return !!t && (t.t === 1 || t.t === 2) && !t.bld && !t.road && !t.rail; };
    const S = new Int32Array((N + 1) * (N + 1));
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) S[(y + 1) * (N + 1) + x + 1] = (plain(x, y) ? 1 : 0) + S[y * (N + 1) + x + 1] + S[(y + 1) * (N + 1) + x] - S[y * (N + 1) + x];
    const rect = (x, y, w, h) => S[(y + h) * (N + 1) + x + w] - S[y * (N + 1) + x + w] - S[(y + h) * (N + 1) + x] + S[y * (N + 1) + x];
    let ox = -1, oy = -1;
    outer: for (let y = 1; y + 14 < N; y++) for (let x = 1; x + 22 < N; x++) if (rect(x - 1, y - 1, 23, 15) === 23 * 15) { ox = x; oy = y; break outer; }
    if (ox < 0) throw new Error('找不到 23×15 的空地');
    out.facts.origin = [ox, oy];
    const placed = [];
    const put = (id, x, y) => { const err = GV.canPlaceTool(id, x, y) || null, okP = !err && GV.place(id, x, y); placed.push({ id, x, y, ok: !!okP, err }); return !!okP; };
    for (let x = ox; x <= ox + 20; x++) put('road', x, oy + 4);
    for (let x = ox; x <= ox + 3; x++) put('rail', x, oy + 6);
    put('station', ox + 1, oy + 5);
    // 三家接主路的高街商店：放在主路北側，下緣貼著主路（3×3 的往上挪一格）。
    const mainShops = COMMERCE.slice().sort((a, b) => a.sz - b.sz).slice(0, 3).map((c, i) => ({ c, x: ox + 5 + 4 * i, y: oy + 4 - c.sz }));
    for (const m of mainShops) put(m.c.id, m.x, m.y);
    for (let x = ox; x <= ox + 4; x++) put('road', x, oy + 12);           // 不連通的小路
    const isoTool = COMMERCE.slice().sort((a, b) => a.sz - b.sz)[0];
    put(isoTool.id, ox + 1, oy + 10);
    out.facts.placed = placed.filter((q) => q.id !== 'road' && q.id !== 'rail').concat([{ roads: placed.filter((q) => q.id === 'road' && q.ok).length, rails: placed.filter((q) => q.id === 'rail' && q.ok).length }]);
    const badPlace = placed.filter((q) => !q.ok);
    if (badPlace.length) fail('場景沒有擺成：' + JSON.stringify(badPlace.slice(0, 3)));

    // 第二階段：唯讀。掃描、量原生步行距離、跑模型；前後比對 localStorage 與場景地格。
    const storageAll = () => { try { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; } catch (e) { return { error: String(e) }; } };
    const sceneTiles = () => { const a = []; for (let y = oy - 1; y < oy + 14; y++) for (let x = ox - 1; x < ox + 22; x++) a.push(JSON.stringify(GV.tile(x, y))); return a.join('|'); };
    const before = storageAll(), tilesBefore = sceneTiles();
    const stationKs = ${JSON.stringify(STATION_KS)};
    const commerceKs = COMMERCE.map((c) => c.k);
    const stations = [], shops = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const t = GV.tile(x, y);
        if (!t || !t.bld || t.bld.ref) continue;
        const k = t.bld.k;
        if (stationKs.indexOf(k) >= 0) stations.push({ id: 'k' + k + '@' + x + ',' + y, x, y, demand: 100 });
        else if (commerceKs.indexOf(k) >= 0) shops.push({ id: 'k' + k + '@' + x + ',' + y, k, x, y, attract: 1 });
      }
    }
    out.facts.scan = { stations: stations.length, shops: shops.length, commerceKs };
    if (stations.length < 1) fail('掃不到車站');
    if (shops.length < 4) fail('掃不到 4 家高街商店（' + shops.length + '）');
    const memo = new Map();
    const walk = (x1, y1, x2, y2) => { const key = x1 + ',' + y1 + '>' + x2 + ',' + y2; if (!memo.has(key)) memo.set(key, GV.path502(x1, y1, x2, y2, 'walk')); return memo.get(key); };
    const real = M.computeShadowVisits({ radius: ${WALK_RADIUS}, stations, shops, walkDistance: walk });
    const manhattan = M.computeShadowVisits({ radius: ${WALK_RADIUS}, stations, shops });
    const st0 = stations[0];
    const isoShop = shops.find((h) => h.x === ox + 1 && h.y === oy + 10) || null;
    out.facts.realGeometry = {
      ok: real.ok, reason: real.reason || null, distanceSource: real.distanceSource, radius: real.radius, demandSource: 'synthetic',
      totals: real.ok ? real.totals : null,
      rows: real.ok ? real.rows.map((r) => ({ id: r.id, walk: st0 ? walk(st0.x, st0.y, r.x, r.y) : null, manhattan: st0 ? Math.abs(st0.x - r.x) + Math.abs(st0.y - r.y) : null, visits: r.visits, connected: r.connected, isolated: r.isolated })) : null,
      manhattanTotals: manhattan.ok ? manhattan.totals : null
    };
    if (!real.ok) fail('真場景跑模型失敗：' + real.reason);
    if (real.ok) {
      for (const m of mainShops) {
        const row = real.rows.find((r) => r.x === m.x && r.y === m.y);
        if (!row || row.isolated || !(row.visits > 0)) fail('接主路的商店應該連得上：' + JSON.stringify({ m: m.c.id, row }));
      }
      const isoRow = isoShop && real.rows.find((r) => r.id === isoShop.id);
      const isoManhattan = isoShop && manhattan.ok ? manhattan.rows.find((r) => r.id === isoShop.id) : null;
      out.facts.isolatedShop = { id: isoShop ? isoShop.id : null, walk: isoShop && st0 ? String(walk(st0.x, st0.y, isoShop.x, isoShop.y)) : null, manhattan: isoShop && st0 ? Math.abs(st0.x - isoShop.x) + Math.abs(st0.y - isoShop.y) : null, walkIsolated: isoRow ? isoRow.isolated : null, manhattanConnected: isoManhattan ? !isoManhattan.isolated : null };
      if (!isoRow || !isoRow.isolated) fail('不連通小路上的商店，原生步行應該到不了：' + JSON.stringify(out.facts.isolatedShop));
      if (!isoManhattan || isoManhattan.isolated || !(out.facts.isolatedShop.manhattan <= ${WALK_RADIUS})) fail('對照組：曼哈頓近似應該會把它算成連得上：' + JSON.stringify(out.facts.isolatedShop));
    }
    const after = storageAll(), tilesAfter = sceneTiles();
    out.facts.readOnly = { storageKeys: Object.keys(before).length, storageUnchanged: JSON.stringify(before) === JSON.stringify(after), sceneTilesUnchanged: tilesBefore === tilesAfter };
    if (!out.facts.readOnly.storageUnchanged) fail('讀取階段改動了 localStorage');
    if (!out.facts.readOnly.sceneTilesUnchanged) fail('讀取階段改動了場景地格');

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

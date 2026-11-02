'use strict';
/* DSK-017 / LAB-04：k166（鐵公路聯運中心）與原生鐵路拓撲的唯讀診斷。
 *
 * 只讀：不寫 index.html、不改產品程式、不動存檔。用可拋棄的 fresh profile 開新城市擺測試場景，
 * 全程只透過頁面公開的除錯介面 `window.GV` 操作（GV.place / GV.canPlaceTool / GV.tile / GV.mobilityAt462）。
 *
 * 診斷（卡上 D1～D3）：
 *   D1 放置／營運判定用「半徑 6 內 ≥2 格真軌」（countNear），站別前接卻用四鄰貼軌
 *      → 可以合法蓋出「離軌 3 格、沒有任何貼軌」的聯運中心
 *   D2 k166 不在 T462/T463 站別集合（rail=[17,55,139]、tram=[21]）→ 不算站
 *   D3 k166 身上的軌道是美術，footprint 的 tiles[].rail 不會被寫入
 *
 * 用法：node probeRailTopology04.cjs
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    if (typeof GV === 'undefined') throw new Error('GV 不存在：遊戲未載入');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);
    GV.addMoney(1000000);

    const tileAt = (x, y) => GV.tile(x, y);
    // 地圖邊界：用 GV.tile 回 null 判斷
    let N = 0;
    for (let n = 64; n <= 256; n += 32) { if (!tileAt(n, 0)) break; N = n; }
    out.facts.mapN = N;
    if (!N) throw new Error('無法判定地圖大小');

    const isLand = (t) => t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.tram && !t.bld && !t.water;

    const size = 4;
    let plot = null;
    for (let y = 8; y < N - size - 10 && !plot; y++) {
      for (let x = 8; x < N - size - 10; x++) {
        let clean = true;
        for (let dy = -2; dy < size + 2 && clean; dy++) {
          for (let dx = -2; dx < size + 2; dx++) { if (!isLand(tileAt(x + dx, y + dy))) { clean = false; break; } }
        }
        if (!clean) continue;
        // 半徑 8 內不能有任何既有軌道，保證 rail 是我們放的
        for (let dy = -8; dy <= 8 && clean; dy++) {
          for (let dx = -8; dx <= 8; dx++) { const t = tileAt(x + dx, y + dy); if (!t || t.rail || t.tram) { clean = false; break; } }
        }
        if (clean) { plot = { x, y }; break; }
      }
    }
    if (!plot) throw new Error('找不到乾淨的 4×4 測試地塊');
    const { x, y } = plot;
    out.facts.plot = { x, y };

    // 兩格真軌：Chebyshev 距離 6（放置規則數得到），但離 4×4 footprint 邊緣 3 格（不是貼軌）
    const rx = x + 6, ry = y;
    const okA = GV.place('rail', rx, ry);
    const okB = GV.place('rail', rx, ry + 1);
    const railA = tileAt(rx, ry), railB = tileAt(rx, ry + 1);
    out.facts.rails = { placed: [!!okA, !!okB], flags: [!!(railA && railA.rail), !!(railB && railB.rail)], at: [[rx, ry], [rx, ry + 1]] };
    if (!(railA && railA.rail) || !(railB && railB.rail)) fail('前置失敗：兩格真軌沒有成功落下');

    // 距離量測：footprint = x..x+3 / y..y+3；軌在 x+6 → 邊緣到軌 3 格
    out.facts.edgeGap = rx - (x + size - 1); // 3
    out.facts.chebyshevFromRoot = Math.max(Math.abs(rx - x), Math.abs(ry - y)); // 6

    // D1：placement 驗證在「沒有貼軌」時給不給過
    const placeErr = GV.canPlaceTool('intermodalHub', x, y) || null;
    out.facts.canPlace = { err: placeErr, allowed: !placeErr };

    // D1：這個位置在 T462 眼中是不是軌道站（mobilityAt462 對空地只回 kind:'tile'）
    out.facts.atPlotBefore = GV.mobilityAt462(x, y);
    out.facts.atRail = GV.mobilityAt462(rx, ry);

    // 蓋上去（doPlace 會走 canPlaceMulti + placeLogisticsMulti485）
    const built = GV.place('intermodalHub', x, y);
    const root = tileAt(x, y);
    out.facts.building = root && root.bld ? { k: root.bld.k, ref: root.bld.ref || null } : null;
    if (!built || !root || !root.bld || root.bld.k !== 166) fail('場景失敗：k166 沒有成功放下');

    // D3：footprint 內不應該出現 rail 旗標
    const footRails = [];
    for (let dy = 0; dy < size; dy++) for (let dx = 0; dx < size; dx++) {
      const t = tileAt(x + dx, y + dy);
      if (t && t.rail) footRails.push([x + dx, y + dy]);
    }
    out.facts.footprintRailTiles = footRails;
    if (footRails.length) fail('D3：k166 footprint 出現 rail 旗標 ' + JSON.stringify(footRails));

    // D2：建築在 T462 的視角裡只有 road access，沒有 rail 站身分
    const atBuilding = GV.mobilityAt462(x, y);
    out.facts.atBuilding = atBuilding;
    if (!atBuilding || atBuilding.kind !== 'building') fail('D2：mobilityAt462 沒有把 k166 當建築回報');
    if (atBuilding && 'rail' in atBuilding) fail('D2：mobilityAt462 竟然給了 rail 欄位');

    // 站別集合是靜態事實（rail=[17,55,139]、tram=[21]）；probe 只驗 runtime 可觀察面
    out.facts.stationKsDocumented = { rail: [17, 55, 139], tram: [21], intermodalHub: 166 };

    out.facts.verdict = {
      D1_radius6_allows_no_adjacency: out.facts.canPlace.allowed === true && out.facts.edgeGap === 3 && footRails.length === 0,
      D1_no_rail_frontage_field: !!(atBuilding && atBuilding.kind === 'building' && !('rail' in atBuilding)),
      D2_not_a_station: !!(atBuilding && atBuilding.kind === 'building' && !('rail' in atBuilding)),
      D3_art_rail_not_topology: footRails.length === 0
    };
    out.ok = out.fails.length === 0;
    return out;
  } catch (e) {
    out.error = String((e && e.stack) || e);
    return out;
  }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => {
    return await cdp.evalJs(PAGE);
  });
  const res = r && r.result;
  console.log('PROBE_RAIL04 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) {
    console.error('PROBE_RAIL04 SESSION_FAILED ' + JSON.stringify(r && r.fails));
    process.exitCode = 1;
    return;
  }
  console.log('PROBE_RAIL04 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => {
  console.error('PROBE_RAIL04 ERROR ' + ((e && e.stack) || e));
  process.exitCode = 1;
});

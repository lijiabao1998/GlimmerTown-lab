'use strict';
/* DSK-025 / LAB-07：公鐵聯運全程交付的實測 probe。
 * 真 Chrome、fresh 沙盒：鋪一段公路與一段鐵路，跑完「公路 → 換裝 → 鐵路 → 交付」。
 *
 * 用法：node probeIntermodal057.cjs
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    if (!window.GV || !GV.intermodal057) throw new Error('GV.intermodal057 不存在');
    if (!GV.roadDelivery053 || !GV.railFreight054) throw new Error('缺 053／054 planner');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);
    GV.addMoney(1000000);

    const tileAt = (x, y) => GV.tile(x, y);
    let N = 0;
    for (let x = 0; x <= 256; x++) { if (!tileAt(x, 0)) break; N = x + 1; }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;

    const land = (x, y) => { const t = tileAt(x, y); return !!(t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.bld && !t.water); };

    // 找一條 5 格公路與一條 6 格鐵路（都在陸地）
    let road = null, rail = null;
    for (let y = 6; y < N - 6 && !road; y++) {
      for (let x = 4; x < N - 12; x++) {
        let ok = true;
        for (let i = 0; i < 5; i++) if (!land(x + i, y)) { ok = false; break; }
        if (ok) { road = { x, y, len: 5 }; break; }
      }
    }
    for (let x = 4; x < N - 6 && !rail; x++) {
      for (let y = 6; y < N - 10; y++) {
        let ok = true;
        for (let i = 0; i < 6; i++) if (!land(x, y + i)) { ok = false; break; }
        if (ok) { rail = { x, y, len: 6 }; break; }
      }
    }
    if (!road || !rail) throw new Error('找不到可鋪的路段');
    out.facts.layout = { road, rail };

    for (let i = 0; i < road.len; i++) GV.place('road', road.x + i, road.y);
    for (let i = 0; i < rail.len; i++) GV.place('rail', rail.x, rail.y + i);
    const roadOk = [...Array(road.len)].every((_, i) => (tileAt(road.x + i, road.y) || {}).road);
    const railOk = [...Array(rail.len)].every((_, i) => (tileAt(rail.x, rail.y + i) || {}).rail);
    out.facts.laid = { roadOk, railOk };
    if (!roadOk || !railOk) fail('路段沒有全部鋪成功');

    const idx = (x, y) => y * N + x;
    const t0 = GV.intermodal057.start({
      roadFrom: idx(road.x, road.y), roadTo: idx(road.x + road.len - 1, road.y),
      railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + rail.len - 1),
      cargo: { batchId: 'qa-057', commodityId: 'food', qty: 10 }, capacity: 12
    });
    out.facts.start = { ok: t0.ok, reason: t0.reason, roadSteps: t0.roadSteps, railSteps: t0.railSteps, status: t0.status };
    if (!t0.ok) throw new Error('start 失敗：' + t0.reason);
    if (t0.roadSteps !== 4) fail('公路步數不是 4（' + t0.roadSteps + '）');
    if (t0.railSteps !== 5) fail('鐵路步數不是 5（' + t0.railSteps + '）');

    const early = GV.intermodal057.transfer();
    out.facts.earlyTransfer = { ok: early.ok, reason: early.reason };
    if (early.ok || early.reason !== 'road-not-done') fail('公路沒走完竟然可以換裝');

    for (let i = 0; i < 4; i++) GV.intermodal057.advance();
    const atTransfer = GV.intermodal057.snapshot();
    out.facts.atTransfer = { status: atTransfer.status, roadCursor: atTransfer.roadCursor, qty: atTransfer.qty };
    if (atTransfer.status !== 'TRANSFER') fail('走完公路不是 TRANSFER（' + atTransfer.status + '）');
    if (atTransfer.qty !== 10) fail('公路段 qty 不守恆');

    const tr = GV.intermodal057.transfer();
    out.facts.transfer = { ok: tr.ok, status: tr.ok ? tr.snapshot.status : tr.reason };
    if (!tr.ok || tr.snapshot.status !== 'RAIL') fail('換裝沒有進到 RAIL');

    for (let i = 0; i < 5; i++) GV.intermodal057.advance();
    const done = GV.intermodal057.snapshot();
    out.facts.done = { status: done.status, qty: done.qty, capacity: done.capacity, batchId: done.batchId };
    if (done.status !== 'DELIVERED') fail('鐵路走完不是 DELIVERED（' + done.status + '）');
    if (done.qty !== 10) fail('全程 qty 不守恆（' + done.qty + '）');
    if (done.batchId !== 'qa-057') fail('批次身分不是同一個（' + done.batchId + '）');

    // 面板
    GV.intermodal057.open();
    const panelOpen = !!document.getElementById('lab057Panel');
    GV.intermodal057.end();
    const panelClosed = !document.getElementById('lab057Panel');
    out.facts.panel = { open: panelOpen, closed: panelClosed };
    if (!panelOpen || !panelClosed) fail('面板開關不正常');

    // 逃生閥
    window.__noIntermodal057 = true;
    const blocked = GV.intermodal057.start({
      roadFrom: idx(road.x, road.y), roadTo: idx(road.x + 1, road.y),
      railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + 1), cargo: { qty: 1 }
    });
    out.facts.disabled = { ok: blocked.ok, reason: blocked.reason };
    if (blocked.ok || blocked.reason !== 'disabled') fail('逃生閥沒有擋住 start');
    delete window.__noIntermodal057;

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
  console.log('PROBE_INTERMODAL057 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_INTERMODAL057 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_INTERMODAL057 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

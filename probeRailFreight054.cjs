'use strict';
/* DSK-019 / LAB-05 階段 B：兩站實載貨運鐵路的實測 probe。
 *
 * 只讀產品：不改 index.html、不改存檔；fresh 沙盒城市鋪一條真鐵軌、兩棟貼軌 k166，
 * 驗證 plan() → start() → step() → ARRIVED → unload() 全程在影子任務裡。
 *
 * 用法：node probeRailFreight054.cjs
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    if (!window.GV || !GV.railFreight054) throw new Error('GV.railFreight054 不存在：執行期接線沒有裝上');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);
    GV.addMoney(1000000);

    const tileAt = (x, y) => GV.tile(x, y);
    let N = 0;
    for (let x = 0; x <= 256; x++) { if (!tileAt(x, 0)) break; N = x + 1; }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;

    // 一條真鐵軌（x=10，y=8..24）
    const X = 10, Y0 = 8, Y1 = 24;
    const rails = [];
    for (let y = Y0; y <= Y1; y++) { const ok = GV.place('rail', X, y); rails.push([X, y, !!ok, !!(tileAt(X, y) || {}).rail]); }
    out.facts.rails = rails;
    if (!rails.every((r) => r[3])) fail('鐵軌沒有全部鋪成功');

    // 兩棟貼軌的 k166（4×4）：一棟在軌西側（x=6..9）、一棟在軌東側（x=11..14），都貼 x=10 的軌。
    // 地塊先掃描可用位置；這個 fresh 城市是隨機地形，兩側不一定都有 4×4 陸地，
    // 沒辦法的時候退回「兩個軌道月台」並在 facts 裡照實記，不假裝有站。
    let westY = null, eastY = null;
    for (let y = Y0; y <= Y1 - 3 && westY === null; y++) { if (!GV.canPlaceTool('intermodalHub', 6, y)) westY = y; }
    for (let y = Y0; y <= Y1 - 3 && eastY === null; y++) { if (!GV.canPlaceTool('intermodalHub', 11, y)) eastY = y; }
    out.facts.plots = { west: westY, east: eastY };
    let stationA = null, stationB = null;
    if (westY !== null) { GV.place('intermodalHub', 6, westY); const t = tileAt(6, westY); stationA = { ok: !!(t && t.bld && t.bld.k === 166), k: t && t.bld ? t.bld.k : null, at: [6, westY] }; }
    if (eastY !== null) { GV.place('intermodalHub', 11, eastY); const t = tileAt(11, eastY); stationB = { ok: !!(t && t.bld && t.bld.k === 166), k: t && t.bld ? t.bld.k : null, at: [11, eastY] }; }
    out.facts.stations = { a: stationA, b: stationB, bothPlaced: !!(stationA && stationA.ok && stationB && stationB.ok) };

    // 兩站各自的貼軌月台（都在 x=10 這條軌上）；沒站時退回軌道兩端
    const fromY = westY !== null ? westY + 1 : Y0 + 1;
    const toY = eastY !== null ? eastY + 1 : Y1 - 1;
    const from = fromY * N + X, to = toY * N + X;
    out.facts.platforms = { from: [X, fromY], to: [X, toY] };

    const plan = GV.railFreight054.plan(from, to);
    out.facts.plan = { ok: plan.ok, steps: plan.steps, reason: plan.reason, head: plan.path && plan.path[0], tail: plan.path && plan.path[plan.path.length - 1] };
    if (!plan.ok) throw new Error('plan 失敗：' + plan.reason);
    const expectedSteps = Math.abs(toY - fromY);
    if (plan.steps !== expectedSteps) fail('plan 步數不是 ' + expectedSteps + '（實際 ' + plan.steps + '）');

    for (let i = 1; i < plan.path.length; i++) {
      const a = plan.path[i - 1], b = plan.path[i];
      const ax = a % N, ay = (a / N) | 0, bx = b % N, by = (b / N) | 0;
      if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) fail('route 第 ' + i + ' 步不相鄰');
      if (!(tileAt(bx, by) || {}).rail) fail('route 第 ' + i + ' 步不在鐵軌上');
    }

    const started = GV.railFreight054.start(from, to, { batchId: 'qa-054', commodityId: 'food', qty: 12 }, 12);
    out.facts.started = { ok: started.ok, reason: started.reason, steps: started.steps };
    if (!started.ok) throw new Error('start 失敗：' + started.reason);
    const s0 = GV.railFreight054.snapshot();
    out.facts.initial = { status: s0.status, qty: s0.qty, capacity: s0.capacity, cursor: s0.cursor, pathLength: s0.pathLength };
    if (s0.status !== 'READY') fail('初始狀態不是 READY');

    let s = s0;
    for (let i = 0; i < plan.steps + 2; i++) s = GV.railFreight054.step().snapshot;
    out.facts.arrived = { status: s.status, cursor: s.cursor, qty: s.qty };
    if (s.status !== 'ARRIVED') fail('走完之後不是 ARRIVED（' + s.status + '）');

    const un = GV.railFreight054.unload();
    out.facts.unloaded = un.ok ? { status: un.snapshot.status, qty: un.snapshot.qty } : { ok: false, reason: un.reason };
    if (!un.ok || un.snapshot.status !== 'UNLOADED') fail('卸貨失敗（' + (un.reason || un.snapshot.status) + '）');
    if (un.snapshot.qty !== 12) fail('qty 不守恆：' + un.snapshot.qty);

    // 超載要被擋
    const over = GV.railFreight054.start(from, to, { batchId: 'qa-054-over', qty: 13 }, 12);
    out.facts.overCapacity = { ok: over.ok, reason: over.reason };
    if (over.ok || over.reason !== 'over-capacity') fail('超載沒有被擋');

    // 面板
    GV.railFreight054.open();
    const panelOpen = !!document.getElementById('lab054Panel');
    GV.railFreight054.end();
    const panelClosed = !document.getElementById('lab054Panel');
    out.facts.panel = { open: panelOpen, closed: panelClosed };
    if (!panelOpen) fail('open() 沒有建立面板');
    if (!panelClosed) fail('end() 沒有移除面板');

    // 逃生閥
    window.__noRailFreight054 = true;
    const blocked = GV.railFreight054.start(from, to, { batchId: 'qa-054b', qty: 1 });
    out.facts.disabled = { ok: blocked.ok, reason: blocked.reason };
    if (blocked.ok || blocked.reason !== 'disabled') fail('逃生閥沒有擋住 start');
    delete window.__noRailFreight054;

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
  console.log('PROBE_RAIL054 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_RAIL054 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_RAIL054 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

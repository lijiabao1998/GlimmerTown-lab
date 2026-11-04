'use strict';
/* DSK-018 / LAB-03 階段 B：真道路配送執行期接線的實測 probe。
 *
 * 只讀產品：不改 index.html、不改存檔；用 fresh 沙盒城市鋪一條真道路，驗證
 *   plan() → start() → step() → DELIVERED 全程在影子任務裡，且逃生閥有效。
 *
 * 用法：node probeRoadDelivery053.cjs
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    if (!window.GV || !GV.roadDelivery053) throw new Error('GV.roadDelivery053 不存在：執行期接線沒有裝上');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);
    GV.addMoney(1000000);

    const tileAt = (x, y) => GV.tile(x, y);
    let N = 0;
    if (GV.tiles && GV.tiles.length) N = Math.round(Math.sqrt(GV.tiles.length));
    if (!N) { for (let x = 0; x <= 256; x++) { if (!tileAt(x, 0)) break; N = x + 1; } }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;

    // 鋪一條 11 格的真道路（x=10，y=10..20）
    const X = 10, Y0 = 10, Y1 = 20;
    const laid = [];
    for (let y = Y0; y <= Y1; y++) { const ok = GV.place('road', X, y); laid.push([X, y, !!ok, !!(tileAt(X, y) || {}).road]); }
    out.facts.roadLaid = laid;
    if (!laid.every((r) => r[3])) fail('道路沒有全部鋪成功');

    const origin = Y0 * N + X, destination = Y1 * N + X;
    const plan = GV.roadDelivery053.plan(origin, destination);
    out.facts.plan = { ok: plan.ok, steps: plan.steps, reason: plan.reason, head: plan.path && plan.path[0], tail: plan.path && plan.path[plan.path.length - 1] };
    if (!plan.ok) throw new Error('plan 失敗：' + plan.reason);
    if (plan.steps !== (Y1 - Y0)) fail('plan 步數不是 10（實際 ' + plan.steps + '）');

    // 每一步都要相鄰且在道路上
    for (let i = 1; i < plan.path.length; i++) {
      const a = plan.path[i - 1], b = plan.path[i];
      const ax = a % N, ay = (a / N) | 0, bx = b % N, by = (b / N) | 0;
      if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) fail('path 第 ' + i + ' 步不相鄰');
      if (!(tileAt(bx, by) || {}).road) fail('path 第 ' + i + ' 步不在道路上');
    }

    const started = GV.roadDelivery053.start(origin, destination, { batchId: 'qa-053', commodityId: 'food', qty: 5 });
    out.facts.started = started;
    if (!started.ok) throw new Error('start 失敗：' + started.reason);
    const s0 = GV.roadDelivery053.snapshot();
    out.facts.initial = { status: s0.status, qty: s0.qty, cursor: s0.cursor, pathLength: s0.pathLength };
    if (s0.status !== 'PENDING') fail('初始狀態不是 PENDING');

    let s = s0;
    for (let i = 0; i < plan.steps + 3; i++) s = GV.roadDelivery053.step().snapshot;
    out.facts.final = { status: s.status, cursor: s.cursor, steps: s.steps, qty: s.qty, delivered: s.delivered };
    if (s.status !== 'DELIVERED') fail('走完之後不是 DELIVERED（' + s.status + '）');
    if (s.cursor !== plan.steps) fail('終點 cursor 不是 ' + plan.steps);
    if (s.qty !== 5) fail('qty 不守恆：' + s.qty);

    const afterStep = GV.roadDelivery053.step().snapshot;
    if (afterStep.status !== 'DELIVERED' || afterStep.steps !== s.steps) fail('DELIVERED 之後再 step 竟然改變狀態');

    // 面板：開 → 有 DOM；關 → 移除
    GV.roadDelivery053.open();
    const panelOpen = !!document.getElementById('lab053Panel');
    GV.roadDelivery053.end();
    const panelClosed = !document.getElementById('lab053Panel');
    out.facts.panel = { open: panelOpen, closed: panelClosed };
    if (!panelOpen) fail('open() 沒有建立面板');
    if (!panelClosed) fail('end() 沒有移除面板');

    // 逃生閥
    window.__noRoadDelivery053 = true;
    const blocked = GV.roadDelivery053.start(origin, destination, { batchId: 'qa-053b', qty: 1 });
    out.facts.disabled = { ok: blocked.ok, reason: blocked.reason };
    if (blocked.ok || blocked.reason !== 'disabled') fail('逃生閥沒有擋住 start');
    delete window.__noRoadDelivery053;

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
  console.log('PROBE_ROAD053 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_ROAD053 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_ROAD053 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

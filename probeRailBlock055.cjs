'use strict';
/* DSK-020 / LAB-06 階段 B：閉塞區間（占軌／等待／斷軌恢復）的實測 probe。
 * 只讀產品：fresh 沙盒城市鋪一條真鐵軌，兩列貨運任務在同一區間上競爭。
 *
 * 用法：node probeRailBlock055.cjs
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    if (!window.GV || !GV.railBlock055) throw new Error('GV.railBlock055 不存在：執行期接線沒有裝上');
    if (!GV.railFreight054) throw new Error('GV.railFreight054 不存在：LAB-05 的 planner 不在');
    if (typeof GV.setSpeed === 'function') GV.setSpeed(0);
    GV.addMoney(1000000);

    const tileAt = (x, y) => GV.tile(x, y);
    let N = 0;
    for (let x = 0; x <= 256; x++) { if (!tileAt(x, 0)) break; N = x + 1; }
    if (!N) throw new Error('無法判定地圖大小');
    out.facts.mapN = N;

    const X = 10, Y0 = 8, Y1 = 24;
    const rails = [];
    for (let y = Y0; y <= Y1; y++) { const ok = GV.place('rail', X, y); rails.push([X, y, !!ok, !!(tileAt(X, y) || {}).rail]); }
    out.facts.railsOk = rails.every((r) => r[3]);

    const idx = (y) => y * N + X;
    // t1 南下（12→20）、t2 北上（20→12）：同一條單線區間
    const s1 = GV.railBlock055.spawn('t1', idx(12), idx(20), { batchId: 'qa-055-a', qty: 8 }, 12);
    const s2 = GV.railBlock055.spawn('t2', idx(20), idx(12), { batchId: 'qa-055-b', qty: 6 }, 12);
    out.facts.spawn = { t1: s1.ok, t2: s2.ok, steps1: s1.steps, steps2: s2.steps };
    if (!s1.ok || !s2.ok) throw new Error('spawn 失敗：' + (s1.reason || s2.reason));

    const r1 = GV.railBlock055.request('t1');
    const r2 = GV.railBlock055.request('t2');
    out.facts.authority = { t1: r1.status || r1.reason, t2: r2.status || r2.reason };
    if (r1.status !== 'GRANTED') fail('t1 沒有拿到路權');
    if (r2.status !== 'WAITING') fail('t2 沒有進入等待');

    // 等待者不能動
    const blockedT2 = GV.railBlock055.advance('t2');
    out.facts.waitingBlocked = blockedT2.reason;
    if (blockedT2.ok || blockedT2.reason !== 'no-authority') fail('等待中的列車竟然能推進');

    // t1 先走兩步
    let a1 = GV.railBlock055.advance('t1');
    a1 = GV.railBlock055.advance('t1');
    out.facts.t1 = { ok: a1.ok, cursor: a1.snapshot.cursor, status: a1.snapshot.status };
    if (!a1.ok || a1.snapshot.cursor !== 2) fail('t1 沒有前進兩格');

    // 斷軌：t1 下一格斷掉 → 不准前進；修好 → 可以
    const nextTile = idx(12) + 0; // 佔位，下面用實際路徑算
    const t1raw = GV.railBlock055.snapshot().trains.find((t) => t.id === 't1');
    out.facts.t1raw = t1raw;
    const brokeTile = (12 + t1raw.cursor + 1) * N + X;
    GV.railBlock055.breakTile(brokeTile);
    const blocked = GV.railBlock055.advance('t1');
    out.facts.broken = { tile: brokeTile, reason: blocked.reason, ok: blocked.ok };
    if (blocked.ok || blocked.reason !== 'track-broken') fail('斷軌沒有擋住前進');
    GV.railBlock055.repairTile(brokeTile);
    const resumed = GV.railBlock055.advance('t1');
    out.facts.repaired = { ok: resumed.ok, cursor: resumed.snapshot.cursor };
    if (!resumed.ok) fail('修好之後 t1 仍然不能前進');

    // t1 走到終點 → 自動釋放 → t2 拿到路權
    let guard = 0;
    while (GV.railBlock055.snapshot().trains.find((t) => t.id === 't1').status !== 'ARRIVED' && guard++ < 30) GV.railBlock055.advance('t1');
    const afterArrive = GV.railBlock055.snapshot();
    out.facts.handover = { holder: afterArrive.holder, t1: afterArrive.trains.find((t) => t.id === 't1').status };
    if (afterArrive.holder !== 't2') fail('t1 到站後路權沒有交給 t2');

    // t2 走完
    guard = 0;
    while (GV.railBlock055.snapshot().trains.find((t) => t.id === 't2').status !== 'ARRIVED' && guard++ < 30) GV.railBlock055.advance('t2');
    const done = GV.railBlock055.snapshot();
    out.facts.final = { holder: done.holder, t1: done.trains.find((t) => t.id === 't1').status, t2: done.trains.find((t) => t.id === 't2').status };
    if (done.trains.find((t) => t.id === 't2').status !== 'ARRIVED') fail('t2 沒有走到終點');

    // 第三列：超過上限
    const third = GV.railBlock055.spawn('t3', idx(12), idx(20), { batchId: 'qa-055-c', qty: 1 });
    out.facts.third = { ok: third.ok, reason: third.reason };
    if (third.ok || third.reason !== 'too-many') fail('第三列沒有被擋');

    // 面板
    GV.railBlock055.open();
    const panelOpen = !!document.getElementById('lab055Panel');
    GV.railBlock055.end();
    const panelClosed = !document.getElementById('lab055Panel');
    out.facts.panel = { open: panelOpen, closed: panelClosed };
    if (!panelOpen || !panelClosed) fail('面板開關不正常');

    // 逃生閥
    window.__noRailBlock055 = true;
    const blockedByValve = GV.railBlock055.request('t9');
    out.facts.disabled = { ok: blockedByValve.ok, reason: blockedByValve.reason };
    if (blockedByValve.ok || blockedByValve.reason !== 'disabled') fail('逃生閥沒有擋住 request');
    delete window.__noRailBlock055;

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
  console.log('PROBE_BLOCK055 ' + JSON.stringify(res, null, 2));
  if (!r.ok || !res) { console.error('SESSION_FAILED ' + JSON.stringify(r && r.fails)); process.exitCode = 1; return; }
  console.log('PROBE_BLOCK055 RESULT ' + (res.ok ? 'PASS' : 'FAIL'));
  process.exitCode = res.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_BLOCK055 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

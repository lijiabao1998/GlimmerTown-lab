'use strict';
/* T783 B7：LAB-05 兩站實載貨運鐵路的 Chrome 探測（只讀產品：不改 index.html、只用沙盒存檔槽）。
 *
 * 場景：固定種子 GV.newWorldSeeded(20261104)、停速、原生開發者沙盒（enterSandbox516B → setGod516B → unlockAll）。
 * 用前綴和在陸地上找一塊 17×16 的空地，先鋪兩條真軌，再放：
 *   主線 x=ox+5（16 格）、支線 x=ox+15（8 格，不與主線連通）；
 *   A＝聯運中心 k166 在 (ox+1,oy+1)、B＝k166 在 (ox+6,oy+9)：都貼主線；
 *   C＝k166 在 (ox+7,oy+2)：不貼軌（但半徑 6 內有軌，原生放置規則允許）；D＝k166 在 (ox+11,oy+8)：只貼支線；
 *   E＝貨櫃物流 k165 貼主線：物流建築但不是車站。
 * 任何一棟放不成、任何一格軌鋪不成，探測就紅（P054-03）。
 *
 * 第一段（閥門沒開）：P054-01…15，逐項斷言 T783 B7；第一個失敗就停，報告首紅的編號。
 * 第二段（preScript 在頁面腳本之前把 __noRailFreight054 設成 true）：P054-21…24，斷言整段沒有安裝——
 *   load／newWorld 的呼叫鏈裡沒有 054 的包裝（053 的包裝照樣在，證明量得到呼叫鏈）、沒有 054 的 pagehide 監聽、
 *   API 一律回 disabled、open() 不建 DOM。呼叫鏈與監聽的量法同 probeRoadDelivery053.cjs。
 *
 * 用法：PROBE_PORT=8211 node probeRailFreight054.cjs（埠預設 8199）
 */
const { withGame } = require('./harness.js');

const PORT = Number(process.env.PROBE_PORT || 8199);
const SEED = 20261104;

const SPY = `(() => {
  const seen = [];
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (this === window && type === 'pagehide') seen.push((fn && fn.name) || '(anonymous)');
    return add.call(this, type, fn, opts);
  };
  Object.defineProperty(window, '__pagehideSpy', { value: seen });
})();`;
const VALVE = 'window.__noRailFreight054 = true;';

const HELPERS = `
  const SEED = ${SEED};
  const out = { checks: [] };
  let current = null;
  const need = (cond, msg) => { if (!cond) throw new Error(msg); };
  const step = (id, fn) => { current = id; const facts = fn(); out.checks.push({ id, facts: facts === undefined ? null : facts }); };
  const chain = (fn) => {
    const names = new Set(), real = Function.prototype.apply;
    Function.prototype.apply = function (self, args) { names.add(this && this.name); return Reflect.apply(this, self, args == null ? [] : args); };
    let ret;
    try { ret = fn(); } finally { Function.prototype.apply = real; }
    return { ret, names: [...names].filter(Boolean) };
  };
`;

const LIVE = `(() => {
  ${HELPERS}
  try {
    const api = window.GV && GV.railFreight054;
    let N = 0, ox = -1, oy = -1;
    const ix = (x, y) => y * N + x;
    const at = (i) => [i % N, (i / N) | 0];

    step('P054-01', () => {
      need(api && api.provenance && api.provenance.installed === true, 'GV.railFreight054 not installed');
      need(GV.newWorldSeeded(SEED) === true, 'newWorldSeeded');
      GV.setSpeed(0);
      GV.addMoney(5000000);
      const c0 = window.confirm;
      window.confirm = () => true;
      let sandbox;
      try { sandbox = GV.enterSandbox516B(); } finally { window.confirm = c0; }
      need(sandbox === true, 'enterSandbox516B');
      need(GV.setGod516B(true) === true, 'setGod516B');
      need(GV.setOverride516B('unlockAll', true) === true, 'setOverride516B unlockAll');
      for (let x = 0; x <= 400; x++) { if (!GV.tile(x, 0)) break; N = x + 1; }
      need(N > 0, 'map size');
      return { seed: SEED, N, sandbox: true, provenance: api.provenance };
    });

    const W = 17, H = 16;
    step('P054-02', () => {
      const free = new Uint8Array(N * N);
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const t = GV.tile(x, y);
        free[ix(x, y)] = (t.t === 1 || t.t === 2) && !t.bld && !t.road && !t.rail && !t.tram ? 1 : 0;
      }
      const S = new Int32Array((N + 1) * (N + 1));
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) S[(y + 1) * (N + 1) + x + 1] = free[ix(x, y)] + S[y * (N + 1) + x + 1] + S[(y + 1) * (N + 1) + x] - S[y * (N + 1) + x];
      const sum = (x, y) => S[(y + H) * (N + 1) + x + W] - S[y * (N + 1) + x + W] - S[(y + H) * (N + 1) + x] + S[y * (N + 1) + x];
      for (let y = 1; y + H < N && ox < 0; y++) for (let x = 1; x + W < N; x++) if (sum(x, y) === W * H) { ox = x; oy = y; break; }
      need(ox >= 0, 'no free ' + W + 'x' + H + ' land');
      return { origin: [ox, oy], size: [W, H] };
    });

    const L = {};
    step('P054-03', () => {
      const rails = [];
      for (let y = oy; y <= oy + 15; y++) rails.push([ox + 5, y]);
      for (let y = oy + 6; y <= oy + 13; y++) rails.push([ox + 15, y]);
      for (const [x, y] of rails) { GV.place('rail', x, y); need(GV.tile(x, y).rail, 'rail not laid at ' + x + ',' + y); }
      const place = (name, tool, x, y, k, sz) => {
        const err = GV.canPlaceTool(tool, x, y);
        need(err === null, name + ' (' + tool + ') cannot be placed at ' + x + ',' + y + ': ' + err);
        GV.place(tool, x, y);
        const t = GV.tile(x, y);
        need(t && t.bld && t.bld.k === k && !t.bld.ref && (t.bld.sz || 1) === sz, name + ' (' + tool + ') was not placed as a k' + k + ' root');
        L[name] = { x, y, k, sz, root: ix(x, y) };
        return name + '=' + tool + '@' + x + ',' + y;
      };
      const placed = [place('A', 'intermodalHub', ox + 1, oy + 1, 166, 4), place('B', 'intermodalHub', ox + 6, oy + 9, 166, 4),
        place('C', 'intermodalHub', ox + 7, oy + 2, 166, 4), place('D', 'intermodalHub', ox + 11, oy + 8, 166, 4),
        place('E', 'containerLogistics', ox + 1, oy + 6, 165, 4)];
      return { placed, rails: rails.length, bothStationsPlaced: true };
    });

    // 探測自己從地格算貼軌格（佔地四鄰的真軌，順序同原生 sanRoadSeeds445 的走訪），不呼叫被測程式。
    const fr = {};
    const railFrontageOf = (b) => {
      const list = [];
      for (let fy = 0; fy < b.sz; fy++) for (let fx = 0; fx < b.sz; fx++) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const x = b.x + fx + dx, y = b.y + fy + dy, t = GV.tile(x, y);
        if (t && t.rail && !list.includes(ix(x, y))) list.push(ix(x, y));
      }
      return list;
    };
    const comp = (i) => { const m = GV.mobilityAt462(...at(i)); return m && m.kind === 'rail' ? m.component : -1; };
    step('P054-04', () => {
      for (const k of ['A', 'B', 'C', 'D', 'E']) fr[k] = railFrontageOf(L[k]);
      need(fr.A.length === 4 && fr.B.length === 4 && fr.C.length === 0 && fr.D.length === 4 && fr.E.length === 4, 'rail frontage from tiles ' + JSON.stringify(fr));
      const cA = comp(fr.A[0]), cB = comp(fr.B[0]), cD = comp(fr.D[0]);
      need(cA >= 0 && cA === cB, 'A and B are not on one native rail component ' + JSON.stringify([cA, cB]));
      need(cD >= 0 && cD !== cA, 'D should be on another native rail component ' + JSON.stringify([cA, cD]));
      return { railFrontage: fr, nativeRailComponent: { A: cA, B: cB, D: cD } };
    });

    const expectedPath = [];
    for (let y = oy + 4; y <= oy + 9; y++) expectedPath.push(ix(ox + 5, y));
    step('P054-05', () => {
      const r = api.runBetween(L.A.root, L.B.root, { batchId: 'qa-054', commodityId: 'steel', qty: 12 });
      need(r.ok === true, 'runBetween failed: ' + r.reason);
      const p = r.path;
      need(fr.A.includes(p[0]), 'route does not start next to A');
      need(fr.B.includes(p[p.length - 1]), 'route does not end next to B');
      for (let i = 0; i < p.length; i++) {
        const [x, y] = at(p[i]);
        need(GV.tile(x, y).rail, 'route cell ' + i + ' is not a rail');
        if (i) { const [qx, qy] = at(p[i - 1]); need(Math.abs(qx - x) + Math.abs(qy - y) === 1, 'route step ' + i + ' is not 4-adjacent'); }
      }
      need(r.steps === 5 && JSON.stringify(p) === JSON.stringify(expectedPath), 'route ' + JSON.stringify(p) + ' is not the expected ' + JSON.stringify(expectedPath));
      need(JSON.stringify(r.originFrontage) === JSON.stringify(fr.A) && JSON.stringify(r.destinationFrontage) === JSON.stringify(fr.B), 'reported rail frontage differs from the tiles');
      need(comp(p[0]) === comp(p[p.length - 1]) && comp(p[0]) >= 0, 'route ends are not on one native rail component');
      need(r.capacity === 12, 'default capacity ' + r.capacity);
      return { steps: r.steps, head: at(p[0]), tail: at(p[p.length - 1]), path: p.map(at), railComponent: comp(p[0]), capacity: r.capacity, sessionId: r.sessionId };
    });

    step('P054-06', () => {
      const s0 = api.snapshot();
      need(s0.status === 'READY' && s0.qty === 12 && s0.capacity === 12 && s0.cursor === 0 && s0.pathLength === 6 && s0.mode === 'between', 'initial ' + JSON.stringify(s0));
      const busy = api.runBetween(L.B.root, L.A.root, { batchId: 'qa-054-second', qty: 1 });
      need(busy.ok === false && busy.reason === 'busy' && busy.sessionId === s0.sessionId, 'second run was not busy: ' + JSON.stringify(busy));
      const early = api.unload();
      need(early.ok === false && early.reason === 'not-arrived' && early.snapshot.status === 'READY', 'unload before arrival: ' + JSON.stringify([early.ok, early.reason]));
      const seen = [];
      for (let i = 1; i <= 5; i++) {
        const r = api.step(), s = r.snapshot;
        need(r.ok && s.cursor === i && s.steps === i && s.qty === 12, 'step ' + i + ': ' + JSON.stringify({ status: s.status, cursor: s.cursor, qty: s.qty }));
        seen.push(s.status);
      }
      need(JSON.stringify(seen) === JSON.stringify(['RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'ARRIVED']), 'statuses ' + seen.join(','));
      need(api.runBetween(L.A.root, L.B.root, { batchId: 'qa-054-third', qty: 1 }).reason === 'busy', 'not busy while ARRIVED');
      const u = api.unload();
      need(u.ok && u.snapshot.status === 'UNLOADED' && u.snapshot.qty === 12 && JSON.stringify(u.snapshot.unloadedAt) === JSON.stringify({ cursor: 5, step: 5 }), 'unload ' + JSON.stringify(u.snapshot));
      const again = api.step().snapshot;
      need(again.status === 'UNLOADED' && again.steps === 5 && again.qty === 12, 'terminal step changed the run');
      return { initial: { status: s0.status, qty: s0.qty, capacity: s0.capacity }, statuses: seen.concat(['UNLOADED']), final: { qty: u.snapshot.qty, unloadedAt: u.snapshot.unloadedAt } };
    });

    step('P054-07', () => {
      const c = { batchId: 'qa-reason', qty: 1 };
      const r = (o, d) => { const x = api.runBetween(o, d, c); if (x.ok) api.end(); return { reason: x.reason, side: x.side }; };
      const toC = r(L.A.root, L.C.root), fromC = r(L.C.root, L.A.root), toD = r(L.A.root, L.D.root);
      const notHub = r(L.E.root, L.B.root), railTile = r(ix(ox + 5, oy + 6), L.B.root), ref = r(ix(ox + 2, oy + 2), L.B.root);
      need(toC.reason === 'hub-not-on-rail' && toC.side === 'destination', 'A→C ' + JSON.stringify(toC));
      need(fromC.reason === 'hub-not-on-rail' && fromC.side === 'origin', 'C→A ' + JSON.stringify(fromC));
      need(toD.reason === 'unreachable', 'A→D ' + JSON.stringify(toD));
      need(notHub.reason === 'not-hub' && railTile.reason === 'not-hub' && ref.reason === 'not-hub', 'not-hub ' + JSON.stringify([notHub, railTile, ref]));
      return { toC, fromC, toD, containerLogistics: notHub, railTile, footprintRef: ref };
    });

    step('P054-08', () => {
      const before = JSON.stringify(api.snapshot());
      const over = api.runBetween(L.A.root, L.B.root, { batchId: 'qa-over', qty: 13 });
      need(over.ok === false && over.reason === 'over-capacity' && over.qty === 13 && over.capacity === 12, 'over-capacity ' + JSON.stringify(over));
      const caps = [0, -1, 'x'].map((cap) => api.runBetween(L.A.root, L.B.root, { batchId: 'qa-cap', qty: 1 }, cap));
      need(caps.every((g) => g.ok === false && g.reason === 'bad-input' && g.detail === 'capacity'), 'bad capacity not rejected: ' + JSON.stringify(caps.map((g) => [g.ok, g.reason])));
      const qtys = [0, 2.5, '5', null].map((qty) => api.runBetween(L.A.root, L.B.root, { batchId: 'qa-qty', qty }));
      need(qtys.every((g) => g.ok === false && g.reason === 'bad-input' && g.detail === 'qty'), 'bad qty not rejected: ' + JSON.stringify(qtys.map((g) => [g.ok, g.reason])));
      need(JSON.stringify(api.snapshot()) === before, 'rejected input changed the run');
      return { over: [over.reason, over.qty, over.capacity], capacity: caps.map((g) => g.reason + ':' + g.detail), qty: qtys.map((g) => g.reason + ':' + g.detail) };
    });

    step('P054-09', () => {
      const s1 = api.snapshot();
      s1.provenance.version = 'forged';
      s1.path.push(-1);
      s1.unloadedAt.cursor = -9;
      s1.qty = 999;
      const s2 = api.snapshot();
      need(s2.provenance.version !== 'forged' && s2.path.length === 6 && s2.unloadedAt.cursor === 5 && s2.qty === 12, 'snapshot shares state with the run');
      return { version: s2.provenance.version, pathLength: s2.path.length };
    });

    step('P054-10', () => {
      api.open();
      const p = document.getElementById('lab054Panel');
      need(p, 'panel not created');
      need(p.textContent.includes('未保存：重新整理或讀檔就會消失'), 'unsaved notice missing');
      need(getComputedStyle(p).position === 'fixed', 'panel not position:fixed');
      return { text: p.textContent.slice(0, 60) };
    });

    step('P054-11', () => {
      need(GV.roadDelivery053 && typeof GV.roadDelivery053.open === 'function', 'LAB-03 api missing');
      GV.roadDelivery053.open();
      const p3 = document.getElementById('lab053Panel'), p5 = document.getElementById('lab054Panel');
      need(p3 && p5, 'both panels must be open');
      const R = (el) => { const r = el.getBoundingClientRect(); return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) }; };
      const a = R(p3), b = R(p5);
      need(b.left === 12 && b.top === 296 && b.width === 260 && b.height === 200, 'LAB-05 slot ' + JSON.stringify(b));
      const overlap = a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
      need(!overlap, 'LAB-05 and LAB-03 panels overlap ' + JSON.stringify([a, b]));
      need(a.top + a.height <= innerHeight && b.top + b.height <= innerHeight && a.left + a.width <= innerWidth && b.left + b.width <= innerWidth, 'panel outside the viewport');
      GV.roadDelivery053.end();
      return { lab053: a, lab054: b, viewport: [innerWidth, innerHeight] };
    });

    step('P054-12', () => {
      need(api.runBetween(L.A.root, L.B.root, { batchId: 'qa-hide', qty: 2 }).ok, 'run for pagehide');
      api.open();
      api.step();
      window.dispatchEvent(new Event('pagehide'));
      const s = api.snapshot();
      need(s.status === 'ABORTED' && s.abortReason === 'pagehide', 'pagehide did not abort: ' + s.status + '/' + s.abortReason);
      need(!document.getElementById('lab054Panel'), 'pagehide left the panel');
      return { status: s.status, reason: s.abortReason, cursor: s.cursor, qty: s.qty };
    });

    step('P054-13', () => {
      need(GV.save() === true, 'save');
      need(api.runBetween(L.A.root, L.B.root, { batchId: 'qa-load', qty: 3 }).ok, 'run for load');
      api.open();
      api.step();
      const c = chain(() => GV.load());
      need(c.ret === true, 'native load failed');
      const s = api.snapshot();
      need(s.status === 'ABORTED' && s.abortReason === 'load', 'load did not abort: ' + s.status + '/' + s.abortReason);
      need(!document.getElementById('lab054Panel'), 'load left the panel');
      const t = GV.tile(L.A.x, L.A.y);
      need(t && t.bld && t.bld.k === 166, 'hub A missing after load');
      need(c.names.includes('load054'), 'load054 wrapper not in the load chain: ' + c.names.join(','));
      return { status: s.status, reason: s.abortReason, cursor: s.cursor, chain: c.names.filter((n) => /^load0/.test(n)) };
    });

    step('P054-14', () => {
      need(api.runBetween(L.A.root, L.B.root, { batchId: 'qa-world', qty: 4 }).ok, 'run for newWorld');
      api.open();
      const c = chain(() => GV.newWorldSeeded(SEED));
      need(c.ret === true, 'newWorldSeeded');
      const s = api.snapshot();
      need(s.status === 'ABORTED' && s.abortReason === 'new-world', 'newWorld did not abort: ' + s.status + '/' + s.abortReason);
      need(!document.getElementById('lab054Panel'), 'newWorld left the panel');
      need(c.names.includes('newWorld054'), 'newWorld054 wrapper not in the newWorld chain: ' + c.names.join(','));
      return { status: s.status, reason: s.abortReason, chain: c.names.filter((n) => /^newWorld0/.test(n)) };
    });

    step('P054-15', () => {
      const spy = window.__pagehideSpy || [];
      need(spy.includes('pagehide054'), 'pagehide054 listener not registered: ' + spy.join(','));
      return { pagehideListeners: spy };
    });

    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.firstFail = { id: current, message: String((e && e.message) || e) };
  }
  return out;
})()`;

const VALVED = `(() => {
  ${HELPERS}
  try {
    const api = window.GV && GV.railFreight054;
    step('P054-21', () => {
      need(window.__noRailFreight054 === true, 'valve was not on');
      need(GV.save() === true, 'save');
      const c = chain(() => GV.load());
      need(c.ret === true, 'native load failed');
      need(!c.names.includes('load054'), 'load054 wrapper is in the load chain although the valve was on at install: ' + c.names.join(','));
      need(c.names.includes('load053'), 'the spy did not see the load chain (load053 missing): ' + c.names.join(','));
      return { chain: c.names.filter((n) => /^load0/.test(n)) };
    });
    step('P054-22', () => {
      const c = chain(() => GV.newWorldSeeded(SEED));
      need(c.ret === true, 'newWorldSeeded');
      need(!c.names.includes('newWorld054'), 'newWorld054 wrapper is in the newWorld chain although the valve was on at install: ' + c.names.join(','));
      need(c.names.includes('newWorld053'), 'the spy did not see the newWorld chain (newWorld053 missing): ' + c.names.join(','));
      return { chain: c.names.filter((n) => /^newWorld0/.test(n)) };
    });
    step('P054-23', () => {
      const spy = window.__pagehideSpy || [];
      need(!spy.includes('pagehide054'), 'pagehide054 listener registered although the valve was on at install');
      need(spy.includes('pagehide053'), 'the spy did not see listeners (pagehide053 missing): ' + spy.join(','));
      return { pagehideListeners: spy };
    });
    step('P054-24', () => {
      need(api && api.provenance && api.provenance.installed === false, 'GV.railFreight054 is not the inert api');
      const results = {};
      for (const [name, args] of [['plan', [0, 1]], ['start', [0, 1, { batchId: 'v', qty: 1 }]], ['runBetween', [0, 1, { batchId: 'v', qty: 1 }]],
        ['step', []], ['unload', []], ['abort', ['x']], ['open', []], ['refresh', []], ['end', []], ['disable', []]]) {
        const r = api[name](...args);
        results[name] = r.reason;
        need(r.ok === false && r.reason === 'disabled' && r.installed === false, name + ' did not answer disabled: ' + JSON.stringify(r));
      }
      const s = api.snapshot();
      need(s.ok === false && s.reason === 'disabled' && s.disabled === true && s.installed === false, 'snapshot ' + JSON.stringify(s));
      need(!document.getElementById('lab054Panel'), 'open() created a panel');
      return { results, snapshot: s };
    });
    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.firstFail = { id: current, message: String((e && e.message) || e) };
  }
  return out;
})()`;

async function session(name, preScript, page) {
  const r = await withGame({ port: PORT, fresh: true, timeout: 300, preScript, log: () => {} }, async ({ cdp }) => cdp.evalJs(page));
  const res = r && r.result;
  console.log('PROBE_RAIL054 ' + name + ' ' + JSON.stringify(res, null, 1));
  if (!r || !r.ok || !res) return { ok: false, firstFail: { id: 'session-' + name, message: JSON.stringify(r && r.fails) } };
  return res;
}

(async () => {
  const live = await session('live', SPY, LIVE);
  let verdict = live.ok ? null : live.firstFail;
  if (!verdict) {
    const valved = await session('valve-at-install', SPY + VALVE, VALVED);
    if (!valved.ok) verdict = valved.firstFail;
  }
  if (verdict) console.log('PROBE_RAIL054 FIRST_FAIL ' + verdict.id + ' ' + verdict.message);
  console.log('PROBE_RAIL054 RESULT ' + (verdict ? 'FAIL' : 'PASS'));
  process.exitCode = verdict ? 1 : 0;
})().catch((e) => { console.error('PROBE_RAIL054 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

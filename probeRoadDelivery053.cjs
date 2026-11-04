'use strict';
/* T782 B7：LAB-03 真道路配送的 Chrome 探測（只讀產品：不改 index.html、只用沙盒存檔槽）。
 *
 * 場景：固定種子 GV.newWorldSeeded(20261104)、停速、原生開發者沙盒（enterSandbox516B → setGod516B → unlockAll）。
 * 用前綴和在陸地上找一塊 17×11 的空地，放：
 *   A＝配送中心 k167（3×3）、B＝冷藏庫 k168（2×2）：都貼 y=oy+4 那條真道路；
 *   C＝穀倉 k169（2×2）：沒有前接；D＝鋼材場 k172（2×2）：只貼另一段不連通的路；H＝公園 k4：非物流建築。
 * 任何一棟放不成、任何一格路鋪不成，探測就紅（P053-03）。
 *
 * 第一段（閥門沒開）：P053-01…15，逐項斷言 T782 B7；第一個失敗就停，報告首紅的編號。
 * 第二段（preScript 在頁面腳本之前把 __noRoadDelivery053 設成 true）：P053-21…24，斷言整段沒有安裝——
 *   load／newWorld 的呼叫鏈裡沒有 053 的包裝（054 的包裝照樣在，證明量得到呼叫鏈）、沒有 053 的 pagehide 監聽、
 *   API 一律回 disabled、open() 不建 DOM。
 * 呼叫鏈的量法：呼叫期間暫時替換 Function.prototype.apply，記下每個被 apply 的函式名稱
 *   （053／054 的包裝都是具名函式，並用 apply 轉給下一層）；pagehide 監聽由 preScript 包住 addEventListener 記名。
 *
 * 用法：PROBE_PORT=8211 node probeRoadDelivery053.cjs（埠預設 8199）
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
const VALVE = 'window.__noRoadDelivery053 = true;';

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
    const api = window.GV && GV.roadDelivery053;
    let N = 0, ox = -1, oy = -1;
    const ix = (x, y) => y * N + x;
    const at = (i) => [i % N, (i / N) | 0];

    step('P053-01', () => {
      need(api && api.provenance && api.provenance.installed === true, 'GV.roadDelivery053 not installed');
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

    const W = 17, H = 11;
    step('P053-02', () => {
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
    step('P053-03', () => {
      const place = (name, tool, x, y, k, sz) => {
        const err = GV.canPlaceTool(tool, x, y);
        need(err === null, name + ' (' + tool + ') cannot be placed at ' + x + ',' + y + ': ' + err);
        GV.place(tool, x, y);
        const t = GV.tile(x, y);
        need(t && t.bld && t.bld.k === k && !t.bld.ref && (t.bld.sz || 1) === sz, name + ' (' + tool + ') was not placed as a k' + k + ' root');
        L[name] = { x, y, k, sz, root: ix(x, y) };
        return name + '=' + tool + '@' + x + ',' + y;
      };
      const placed = [place('A', 'distributionCenter', ox + 1, oy + 1, 167, 3), place('B', 'coldStorage', ox + 10, oy + 2, 168, 2),
        place('C', 'grainSilo', ox + 6, oy + 7, 169, 2), place('D', 'steelYard', ox + 13, oy + 6, 172, 2), place('H', 'park', ox + 6, oy + 3, 4, 1)];
      const roads = [];
      for (let x = ox + 1; x <= ox + 11; x++) roads.push([x, oy + 4]);
      roads.push([ox + 13, oy + 8], [ox + 14, oy + 8]);
      for (const [x, y] of roads) { GV.place('road', x, y); need(GV.tile(x, y).road, 'road not laid at ' + x + ',' + y); }
      return { placed, roads: roads.length };
    });

    // 探測自己從地格算前接（佔地四鄰的道路格，順序同原生 sanRoadSeeds445），不呼叫被測程式。
    const fr = {};
    const frontageOf = (b) => {
      const list = [];
      for (let fy = 0; fy < b.sz; fy++) for (let fx = 0; fx < b.sz; fx++) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const x = b.x + fx + dx, y = b.y + fy + dy, t = GV.tile(x, y);
        if (t && t.road && !list.includes(ix(x, y))) list.push(ix(x, y));
      }
      return list;
    };
    step('P053-04', () => {
      for (const k of ['A', 'B', 'C', 'D', 'H']) fr[k] = frontageOf(L[k]);
      const native = {};
      for (const k of ['A', 'B', 'C']) native[k] = GV.mobilityAt462(L[k].x, L[k].y).frontage;
      need(fr.A.length === 3 && fr.B.length === 2 && fr.C.length === 0 && fr.D.length === 2 && fr.H.length === 1, 'frontage from tiles ' + JSON.stringify(fr));
      need(native.A === 3 && native.B === 2 && native.C === 0, 'native mobility frontage counts ' + JSON.stringify(native));
      return { frontage: fr, nativeFrontageCount: native };
    });

    const expectedPath = [];
    for (let x = ox + 3; x <= ox + 10; x++) expectedPath.push(ix(x, oy + 4));
    step('P053-05', () => {
      const r = api.startBetween(L.A.root, L.B.root, { batchId: 'qa-053', commodityId: 'food', qty: 5 });
      need(r.ok === true, 'startBetween failed: ' + r.reason);
      const p = r.path;
      need(fr.A.includes(p[0]), 'path does not start on A frontage');
      need(fr.B.includes(p[p.length - 1]), 'path does not end on B frontage');
      for (let i = 0; i < p.length; i++) {
        const [x, y] = at(p[i]);
        need(GV.tile(x, y).road, 'path cell ' + i + ' is not a road');
        if (i) { const [qx, qy] = at(p[i - 1]); need(Math.abs(qx - x) + Math.abs(qy - y) === 1, 'path step ' + i + ' is not 4-adjacent'); }
      }
      need(r.steps === 7 && JSON.stringify(p) === JSON.stringify(expectedPath), 'path ' + JSON.stringify(p) + ' is not the expected ' + JSON.stringify(expectedPath));
      need(JSON.stringify(r.originFrontage) === JSON.stringify(fr.A) && JSON.stringify(r.destinationFrontage) === JSON.stringify(fr.B), 'reported frontage differs from the tiles');
      const c0 = GV.mobilityAt462(...at(p[0])), c1 = GV.mobilityAt462(...at(p[p.length - 1]));
      need(c0.kind === 'road' && c1.kind === 'road' && c0.component >= 0 && c0.component === c1.component, 'ends are not on one native road component');
      return { steps: r.steps, head: at(p[0]), tail: at(p[p.length - 1]), path: p.map(at), roadComponent: c0.component, sessionId: r.sessionId };
    });

    step('P053-06', () => {
      const s0 = api.snapshot();
      need(s0.status === 'PENDING' && s0.qty === 5 && s0.cursor === 0 && s0.pathLength === 8 && s0.mode === 'between', 'initial ' + JSON.stringify(s0));
      const busy = api.startBetween(L.B.root, L.A.root, { batchId: 'qa-053-second', qty: 9 });
      need(busy.ok === false && busy.reason === 'busy' && busy.sessionId === s0.sessionId, 'second start was not busy: ' + JSON.stringify(busy));
      need(api.snapshot().batchId === 'qa-053', 'the running task was replaced');
      const seen = [];
      for (let i = 1; i <= 7; i++) {
        const r = api.step(), s = r.snapshot;
        need(r.ok && s.cursor === i && s.steps === i && s.qty === 5, 'step ' + i + ': ' + JSON.stringify({ status: s.status, cursor: s.cursor, qty: s.qty }));
        seen.push(s.status);
        if (i === 3) need(api.startBetween(L.A.root, L.B.root, { batchId: 'qa-053-third', qty: 1 }).reason === 'busy', 'not busy while MOVING');
      }
      need(JSON.stringify(seen) === JSON.stringify(['MOVING', 'MOVING', 'MOVING', 'MOVING', 'MOVING', 'MOVING', 'DELIVERED']), 'statuses ' + seen.join(','));
      const s7 = api.snapshot();
      need(s7.delivered === true && JSON.stringify(s7.deliveredAt) === JSON.stringify({ cursor: 7, step: 7 }), 'deliveredAt ' + JSON.stringify(s7.deliveredAt));
      const again = api.step().snapshot;
      need(again.status === 'DELIVERED' && again.steps === 7 && again.qty === 5, 'terminal step changed the task');
      return { initial: { status: s0.status, qty: s0.qty }, statuses: seen, final: { status: s7.status, cursor: s7.cursor, qty: s7.qty, deliveredAt: s7.deliveredAt } };
    });

    step('P053-07', () => {
      const b = { batchId: 'qa-reason', qty: 1 };
      const r = (o, d) => { const x = api.startBetween(o, d, b); if (x.ok) api.end(); return { reason: x.reason, side: x.side }; };
      const toC = r(L.A.root, L.C.root), fromC = r(L.C.root, L.A.root), toD = r(L.A.root, L.D.root);
      const road = r(ix(ox + 5, oy + 4), L.B.root), ref = r(ix(ox + 2, oy + 2), L.B.root), park = r(L.H.root, L.B.root);
      need(toC.reason === 'no-frontage' && toC.side === 'destination', 'A→C ' + JSON.stringify(toC));
      need(fromC.reason === 'no-frontage' && fromC.side === 'origin', 'C→A ' + JSON.stringify(fromC));
      need(toD.reason === 'unreachable', 'A→D ' + JSON.stringify(toD));
      need(road.reason === 'not-logistics' && ref.reason === 'not-logistics' && park.reason === 'not-logistics', 'not-logistics ' + JSON.stringify([road, ref, park]));
      return { toC, fromC, toD, roadTile: road, footprintRef: ref, park };
    });

    step('P053-08', () => {
      const before = JSON.stringify(api.snapshot());
      const got = [0, -3, 2.5, '5', null].map((qty) => api.startBetween(L.A.root, L.B.root, { batchId: 'qa-bad', qty }));
      need(got.every((g) => g.ok === false && g.reason === 'bad-input' && g.detail === 'qty'), 'bad qty not rejected: ' + JSON.stringify(got.map((g) => [g.ok, g.reason])));
      need(JSON.stringify(api.snapshot()) === before, 'bad input changed the task');
      return { qty: [0, -3, 2.5, '5', null], reasons: got.map((g) => g.reason + ':' + g.detail) };
    });

    step('P053-09', () => {
      const s1 = api.snapshot();
      s1.provenance.version = 'forged';
      s1.path.push(-1);
      s1.deliveredAt.cursor = -9;
      s1.qty = 999;
      const s2 = api.snapshot();
      need(s2.provenance.version !== 'forged' && s2.path.length === 8 && s2.deliveredAt.cursor === 7 && s2.qty === 5, 'snapshot shares state with the task');
      return { version: s2.provenance.version, pathLength: s2.path.length };
    });

    step('P053-10', () => {
      api.open();
      const p = document.getElementById('lab053Panel');
      need(p, 'panel not created');
      need(p.textContent.includes('未保存：重新整理或讀檔就會消失'), 'unsaved notice missing');
      need(getComputedStyle(p).position === 'fixed', 'panel not position:fixed');
      return { text: p.textContent.slice(0, 60) };
    });

    step('P053-11', () => {
      need(GV.railFreight054 && typeof GV.railFreight054.open === 'function', 'LAB-05 api missing');
      GV.railFreight054.open();
      const p3 = document.getElementById('lab053Panel'), p5 = document.getElementById('lab054Panel');
      need(p3 && p5, 'both panels must be open');
      const R = (el) => { const r = el.getBoundingClientRect(); return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) }; };
      const a = R(p3), b = R(p5);
      const slot = (k) => { const h = (innerHeight - 120) / 4; return { left: 12, top: Math.round(84 + k * (h + 8)), width: Math.round(Math.min(260, innerWidth - 24)), height: Math.round(h) }; };
      const s0 = slot(0), near = (r, s) => ['left', 'top', 'width', 'height'].every((k) => Math.abs(r[k] - s[k]) <= 1);
      need(near(a, s0), 'LAB-03 slot (T785 left column slot 0) ' + JSON.stringify([a, s0]));
      const overlap = a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
      need(!overlap, 'LAB-03 and LAB-05 panels overlap ' + JSON.stringify([a, b]));
      need(a.top + a.height <= innerHeight && b.top + b.height <= innerHeight && a.left + a.width <= innerWidth && b.left + b.width <= innerWidth, 'panel outside the viewport');
      GV.railFreight054.end();
      return { lab053: a, lab054: b, viewport: [innerWidth, innerHeight] };
    });

    step('P053-12', () => {
      need(api.startBetween(L.A.root, L.B.root, { batchId: 'qa-hide', qty: 2 }).ok, 'start for pagehide');
      api.open();
      api.step();
      window.dispatchEvent(new Event('pagehide'));
      const s = api.snapshot();
      need(s.status === 'CANCELLED' && s.cancelledReason === 'pagehide', 'pagehide did not cancel: ' + s.status + '/' + s.cancelledReason);
      need(!document.getElementById('lab053Panel'), 'pagehide left the panel');
      return { status: s.status, reason: s.cancelledReason, cursor: s.cursor, qty: s.qty };
    });

    step('P053-13', () => {
      need(GV.save() === true, 'save');
      need(api.startBetween(L.A.root, L.B.root, { batchId: 'qa-load', qty: 3 }).ok, 'start for load');
      api.open();
      api.step();
      const c = chain(() => GV.load());
      need(c.ret === true, 'native load failed');
      const s = api.snapshot();
      need(s.status === 'CANCELLED' && s.cancelledReason === 'load', 'load did not cancel: ' + s.status + '/' + s.cancelledReason);
      need(!document.getElementById('lab053Panel'), 'load left the panel');
      const t = GV.tile(L.A.x, L.A.y);
      need(t && t.bld && t.bld.k === 167, 'building A missing after load');
      need(c.names.includes('load053'), 'load053 wrapper not in the load chain: ' + c.names.join(','));
      return { status: s.status, reason: s.cancelledReason, cursor: s.cursor, chain: c.names.filter((n) => /^load0/.test(n)) };
    });

    step('P053-14', () => {
      need(api.startBetween(L.A.root, L.B.root, { batchId: 'qa-world', qty: 4 }).ok, 'start for newWorld');
      api.open();
      const c = chain(() => GV.newWorldSeeded(SEED));
      need(c.ret === true, 'newWorldSeeded');
      const s = api.snapshot();
      need(s.status === 'CANCELLED' && s.cancelledReason === 'new-world', 'newWorld did not cancel: ' + s.status + '/' + s.cancelledReason);
      need(!document.getElementById('lab053Panel'), 'newWorld left the panel');
      need(c.names.includes('newWorld053'), 'newWorld053 wrapper not in the newWorld chain: ' + c.names.join(','));
      return { status: s.status, reason: s.cancelledReason, chain: c.names.filter((n) => /^newWorld0/.test(n)) };
    });

    step('P053-15', () => {
      const spy = window.__pagehideSpy || [];
      need(spy.includes('pagehide053'), 'pagehide053 listener not registered: ' + spy.join(','));
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
    const api = window.GV && GV.roadDelivery053;
    step('P053-21', () => {
      need(window.__noRoadDelivery053 === true, 'valve was not on');
      need(GV.save() === true, 'save');
      const c = chain(() => GV.load());
      need(c.ret === true, 'native load failed');
      need(!c.names.includes('load053'), 'load053 wrapper is in the load chain although the valve was on at install: ' + c.names.join(','));
      need(c.names.includes('load054'), 'the spy did not see the load chain (load054 missing): ' + c.names.join(','));
      return { chain: c.names.filter((n) => /^load0/.test(n)) };
    });
    step('P053-22', () => {
      const c = chain(() => GV.newWorldSeeded(SEED));
      need(c.ret === true, 'newWorldSeeded');
      need(!c.names.includes('newWorld053'), 'newWorld053 wrapper is in the newWorld chain although the valve was on at install: ' + c.names.join(','));
      need(c.names.includes('newWorld054'), 'the spy did not see the newWorld chain (newWorld054 missing): ' + c.names.join(','));
      return { chain: c.names.filter((n) => /^newWorld0/.test(n)) };
    });
    step('P053-23', () => {
      const spy = window.__pagehideSpy || [];
      need(!spy.includes('pagehide053'), 'pagehide053 listener registered although the valve was on at install');
      need(spy.includes('pagehide054'), 'the spy did not see listeners (pagehide054 missing): ' + spy.join(','));
      return { pagehideListeners: spy };
    });
    step('P053-24', () => {
      need(api && api.provenance && api.provenance.installed === false, 'GV.roadDelivery053 is not the inert api');
      const results = {};
      for (const [name, args] of [['plan', [0, 1]], ['start', [0, 1, { batchId: 'v', qty: 1 }]], ['startBetween', [0, 1, { batchId: 'v', qty: 1 }]],
        ['step', []], ['cancel', ['x']], ['open', []], ['refresh', []], ['end', []], ['disable', []]]) {
        const r = api[name](...args);
        results[name] = r.reason;
        need(r.ok === false && r.reason === 'disabled' && r.installed === false, name + ' did not answer disabled: ' + JSON.stringify(r));
      }
      const s = api.snapshot();
      need(s.ok === false && s.reason === 'disabled' && s.disabled === true && s.installed === false, 'snapshot ' + JSON.stringify(s));
      need(!document.getElementById('lab053Panel'), 'open() created a panel');
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
  console.log('PROBE_ROAD053 ' + name + ' ' + JSON.stringify(res, null, 1));
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
  if (verdict) console.log('PROBE_ROAD053 FIRST_FAIL ' + verdict.id + ' ' + verdict.message);
  console.log('PROBE_ROAD053 RESULT ' + (verdict ? 'FAIL' : 'PASS'));
  process.exitCode = verdict ? 1 : 0;
})().catch((e) => { console.error('PROBE_ROAD053 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

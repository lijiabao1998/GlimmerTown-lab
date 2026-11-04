'use strict';
/* T785 A8：LAB-07 公鐵聯運全程交付的真 Chrome 探測（只讀產品：不改 index.html、只用沙盒存檔槽）。
 *
 * A 段（閥門沒開）：固定種子 GV.newWorldSeeded(20261104)、停速、原生開發者沙盒（enterSandbox516B → setGod516B → unlockAll）。
 *   用前綴和在陸地上找一塊 25×11 的空地，先用原生工具鋪真路、真軌，再放真建築：
 *     O＝冷藏庫 k168（2×2）在 (ox+2,oy+2)，前接 y=oy+4 那條路；
 *     H1＝聯運中心 k166（4×4）在 (ox+9,oy+1)：左邊貼那條路的盡頭 (ox+8,oy+4)、下面貼 y=oy+5 的鐵軌（轉運點）；
 *     H2＝k166 在 (ox+20,oy+6)：上面貼鐵軌（目的地）；H3＝k166 在 (ox+14,oy+1)：也貼同一條軌，但路不到（A2 用）。
 *   052 研究帳用原生 demo()（food 20；batch-A 7、batch-B 8；來源 research-source → research-receiver）。
 *   P057-01…14：轉運點不是同一棟 → no-interchange；全程 O→道路→H1→路權→鐵路→H2；途中用原生拆除工具拆掉前方一格軌 →
 *   停住、054／055 都不動，用原生鐵軌工具鋪回 → 繼續；到站 052 帳上 batch-A 從 SOURCE_READY 變 HELD、數量不變、守恆；
 *   四個 LAB 面板同時開，桌機與兩種手機視窗下都在各自那一格、互不重疊；讀檔取消 batch-B 那一趟並 FREEZE。
 * B 段（preScript 在頁面腳本之前把 __noIntermodal057 設成 true）：P057-21…23，整段沒有安裝——
 *   API 一律 disabled、open() 不建 DOM；pagehide 監聽與 load／newWorld 包裝鏈裡沒有 057 這一層（A 段量得到，當對照）。
 *
 * 每條斷言有編號；第一個失敗就停在那一段，報告首紅。
 * 用法：PROBE_PORT=8231 node probeIntermodal057.cjs   （埠預設 8199；PROBE_SESSION=A 或 B 只跑一段）
 */
const fs = require('fs');
const path = require('path');
const H = require('./harness.js');

const PORT = +(process.env.PROBE_PORT || 8199);
const SESSION = process.env.PROBE_SESSION || 'AB';
const SEED = 20261104;
const UNSAVED = '未保存：重新整理或讀檔就會消失';

const SPY = `(() => {
  const seen = [];
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (this === window && type === 'pagehide') seen.push((fn && fn.name) || '(anonymous)');
    return add.call(this, type, fn, opts);
  };
  Object.defineProperty(window, '__pagehideSpy', { value: seen });
})();`;

/* 各 LAB 區塊在送出的 index.html 裡的行號範圍（CDP 行號從 0 起算）。 */
const HTML = fs.readFileSync(path.join(H.ROOT, 'index.html'), 'utf8');
function blockLines(name) {
  const b = '/* ' + name + ' BEGIN */', e = '/* ' + name + ' END */';
  const lineOf = (m) => { const i = HTML.indexOf(m); if (i < 0 || HTML.indexOf(m, i + 1) >= 0) throw new Error('區塊標記不唯一：' + m); return HTML.slice(0, i).split('\n').length - 1; };
  return [lineOf(b), lineOf(e)];
}
const BLOCKS = {
  '053': blockLines('DSK-018 ROAD DELIVERY 053'), '054': blockLines('DSK-019 RAIL FREIGHT 054'),
  '055': blockLines('DSK-020 RAIL BLOCK 055'), '057': blockLines('DSK-025 INTERMODAL 057')
};
const blockOf = (line) => { for (const k of Object.keys(BLOCKS)) if (line > BLOCKS[k][0] && line < BLOCKS[k][1]) return k; return null; };

/* ---------- 頁面裡跑的程式（只用 GV 公開介面） ---------- */
function pageScene(P) {
  const out = { checks: [], fails: [] };
  const need = (cond, msg, detail) => { if (!cond) throw new Error(msg + (detail === undefined ? '' : '：' + JSON.stringify(detail))); };
  const step = (id, fn) => { try { const f = fn(); out.checks.push({ id, facts: f === undefined ? null : f }); return true; } catch (e) { out.fails.push(id + ' ' + String((e && e.message) || e)); return false; } };
  const api = window.GV && GV.intermodal057;
  let N = 0, ox = -1, oy = -1;
  const ix = (x, y) => y * N + x;
  const at = (i) => [i % N, (i / N) | 0];
  const L = {};
  const W = 25, Hh = 11;
  const go = (id, fn) => out.fails.length === 0 && step(id, fn);

  go('P057-01', () => {
    need(api && api.provenance && api.provenance.installed === true, 'GV.intermodal057 沒有安裝');
    need(GV.newWorldSeeded(P.seed) === true, 'newWorldSeeded');
    GV.setSpeed(0);
    GV.addMoney(5000000);
    const c0 = window.confirm;
    window.confirm = () => true;
    let sandbox;
    try { sandbox = GV.enterSandbox516B(); } finally { window.confirm = c0; }
    need(sandbox === true && GV.setGod516B(true) === true && GV.setOverride516B('unlockAll', true) === true, '原生開發者沙盒沒有就緒');
    GV.setSpeed(0);
    for (let x = 0; x <= 512; x++) { if (!GV.tile(x, 0)) break; N = x + 1; }
    need(N > 30, 'map size ' + N);
    return { seed: P.seed, N, provenance: api.provenance };
  });

  go('P057-02', () => {
    const free = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const t = GV.tile(x, y);
      free[ix(x, y)] = (t.t === 1 || t.t === 2) && !t.bld && !t.road && !t.rail && !t.tram && !t.dock && !t.ruin && !t.crater ? 1 : 0;
    }
    const S = new Int32Array((N + 1) * (N + 1));
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) S[(y + 1) * (N + 1) + x + 1] = free[ix(x, y)] + S[y * (N + 1) + x + 1] + S[(y + 1) * (N + 1) + x] - S[y * (N + 1) + x];
    const sum = (x, y) => S[(y + Hh) * (N + 1) + x + W] - S[y * (N + 1) + x + W] - S[(y + Hh) * (N + 1) + x] + S[y * (N + 1) + x];
    for (let y = 1; y + Hh < N && ox < 0; y++) for (let x = 1; x + W < N; x++) if (sum(x, y) === W * Hh) { ox = x; oy = y; break; }
    need(ox >= 0, 'no free ' + W + 'x' + Hh + ' land');
    return { origin: [ox, oy], size: [W, Hh] };
  });

  go('P057-03', () => {
    const roads = [], rails = [];
    for (let x = ox + 1; x <= ox + 8; x++) roads.push([x, oy + 4]);
    for (let x = ox + 9; x <= ox + 23; x++) rails.push([x, oy + 5]);
    for (const [x, y] of roads) { GV.place('road', x, y); need(GV.tile(x, y).road, 'road not laid at ' + x + ',' + y); }
    for (const [x, y] of rails) { GV.place('rail', x, y); need(GV.tile(x, y).rail, 'rail not laid at ' + x + ',' + y); }
    const place = (name, tool, x, y, k, sz) => {
      const err = GV.canPlaceTool(tool, x, y);
      need(err === null, name + ' (' + tool + ') cannot be placed at ' + x + ',' + y + ': ' + err);
      GV.place(tool, x, y);
      const t = GV.tile(x, y);
      need(t && t.bld && t.bld.k === k && !t.bld.ref && (t.bld.sz || 1) === sz, name + ' was not placed as a k' + k + ' root');
      L[name] = { x, y, k, sz, root: ix(x, y) };
      return name + '=' + tool + '@' + x + ',' + y;
    };
    const placed = [place('O', 'coldStorage', ox + 2, oy + 2, 168, 2), place('H1', 'intermodalHub', ox + 9, oy + 1, 166, 4),
      place('H2', 'intermodalHub', ox + 20, oy + 6, 166, 4), place('H3', 'intermodalHub', ox + 14, oy + 1, 166, 4)];
    window.__probe057 = { N, ox, oy, L };
    return { placed, roads: roads.length, rails: rails.length };
  });

  // 探測自己從地格算前接（佔地四鄰的真路／真軌，走訪順序同原生 sanRoadSeeds445），不呼叫被測程式。
  const fr = {};
  const frontage = (b, kind) => {
    const list = [];
    for (let fy = 0; fy < b.sz; fy++) for (let fx = 0; fx < b.sz; fx++) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const x = b.x + fx + dx, y = b.y + fy + dy, t = GV.tile(x, y);
      if (t && t[kind] && !list.includes(ix(x, y))) list.push(ix(x, y));
    }
    return list;
  };
  go('P057-04', () => {
    fr.Oroad = frontage(L.O, 'road'); fr.H1road = frontage(L.H1, 'road'); fr.H1rail = frontage(L.H1, 'rail');
    fr.H2rail = frontage(L.H2, 'rail'); fr.H3rail = frontage(L.H3, 'rail');
    need(fr.Oroad.length === 2 && fr.H1road.length === 1 && fr.H1road[0] === ix(ox + 8, oy + 4) && fr.H1rail.length === 4 && fr.H2rail.length === 4 && fr.H3rail.length === 4, 'frontage from tiles', fr);
    const comp = (i, kind) => { const m = GV.mobilityAt462(...at(i)); return m && m.kind === kind ? m.component : -1; };
    const cr = [comp(fr.Oroad[0], 'road'), comp(fr.H1road[0], 'road')], cl = [comp(fr.H1rail[0], 'rail'), comp(fr.H2rail[0], 'rail'), comp(fr.H3rail[0], 'rail')];
    need(cr[0] >= 0 && cr[0] === cr[1], 'O and H1 are not on one native road component', cr);
    need(cl[0] >= 0 && cl[0] === cl[1] && cl[0] === cl[2], 'H1, H2, H3 are not on one native rail component', cl);
    return { frontage: fr, nativeRoadComponent: cr, nativeRailComponent: cl };
  });

  const Lg = GV.singleResearch052;
  const batch = (id) => { const s = Lg.snapshot(); return s.ledger && s.ledger.batches.find((b) => b.batchId === id); };
  const trip = (over) => Object.assign({ batchId: 'batch-A', originCustodian: 'research-source', destinationCustodian: 'research-receiver',
    roadFrom: L.O.root, roadTo: L.H1.root, railFrom: L.H1.root, railTo: L.H2.root }, over || {});
  go('P057-05', () => {
    const d = Lg.demo();
    need(d && d.ok === true, '052 demo() failed', d);
    const a = batch('batch-A'), b = batch('batch-B');
    need(a && a.state === 'SOURCE_READY' && a.owner === 'research-source' && a.qty === 7 && b && b.qty === 8, 'demo batches', { a, b });
    return { sessionId: d.sessionId, batchA: { state: a.state, owner: a.owner, qty: a.qty }, conservation: Lg.snapshot().ledger.conservation };
  });

  go('P057-06', () => {
    const diff = api.start(trip({ railFrom: L.H3.root }));
    need(diff.ok === false && diff.reason === 'no-interchange' && diff.detail === 'different-buildings', 'H1 road + H3 rail must be refused', diff);
    const notHub = api.start(trip({ roadTo: L.O.root, railFrom: L.O.root }));
    need(notHub.ok === false && notHub.reason === 'no-interchange' && notHub.detail === 'not-k166', 'k168 as interchange must be refused', notHub);
    const owned = api.start(trip({ qty: 99 }));
    need(owned.ok === false && owned.reason === 'bad-input' && owned.detail === 'ledger-owned', 'caller-supplied qty must be refused', owned);
    const r = GV.roadDelivery053.snapshot(), l = GV.railFreight054.snapshot();
    need(r.reason === 'no-task' && l.reason === 'no-run', 'a refused trip created a leg', { road: r.reason, rail: l.reason });
    need(batch('batch-A').state === 'SOURCE_READY', 'ledger touched by a refused trip');
    return { differentBuildings: diff, notK166: notHub.detail, ledgerOwned: owned.field };
  });

  let legs = null;
  go('P057-07', () => {
    const s = api.start(trip());
    need(s.ok === true && s.status === 'ROAD' && s.qty === 7 && s.commodityId === 'food', 'start failed', s);
    const rs = GV.roadDelivery053.snapshot(), ls = GV.railFreight054.snapshot();
    need(rs.batchId === 'batch-A' && rs.qty === 7 && rs.commodityId === 'food' && rs.status === 'PENDING' && rs.mode === 'between', 'road leg', rs);
    need(ls.batchId === 'batch-A' && ls.qty === 7 && ls.status === 'READY' && ls.mode === 'between', 'rail leg', ls);
    need(fr.Oroad.includes(rs.path[0]) && rs.path[rs.path.length - 1] === fr.H1road[0] && rs.path.every((i) => GV.tile(...at(i)).road), 'road path O→H1 on real road', rs.path);
    need(fr.H1rail.includes(ls.path[0]) && fr.H2rail.includes(ls.path[ls.path.length - 1]) && ls.path.every((i) => GV.tile(...at(i)).rail), 'rail path H1→H2 on real rail', ls.path);
    need(batch('batch-A').state === 'SOURCE_READY', 'ledger moved before arrival');
    legs = { road: rs.path, rail: ls.path };
    return { start: s, roadPath: rs.path.map(at), railPath: ls.path.map(at) };
  });

  go('P057-08', () => {
    const log = [];
    for (let k = 1; k < legs.road.length; k++) {
      const r = api.advance();
      need(r.ok === true && r.moved === true && r.leg === 'road' && GV.roadDelivery053.snapshot().cursor === k, 'road step ' + k, r);
      log.push(r.snapshot.road.cursor);
    }
    const s = api.snapshot();
    need(s.status === 'INTERCHANGE' && GV.roadDelivery053.snapshot().status === 'DELIVERED' && s.road.at === fr.H1road[0], 'not at the interchange', s.status);
    need(GV.railBlock055.snapshot().trains.length === 0, 'authority asked before the interchange');
    return { roadCursors: log, at: at(s.road.at) };
  });

  go('P057-09', () => {
    const r = api.advance();
    need(r.ok === true && r.authority === 'GRANTED' && r.snapshot.status === 'RAIL', 'interchange did not get authority', r);
    const b = GV.railBlock055.snapshot(), t = b.trains.find((x) => x.id === r.snapshot.train.id), ls = GV.railFreight054.snapshot();
    need(b.holder === t.id && t.run054 === ls.sessionId && t.from === legs.rail[0] && t.to === legs.rail[legs.rail.length - 1] && t.pathLength === legs.rail.length && t.qty === 7 && t.batchId === 'batch-A',
      '055 train is not bound to the 054 run', { t, run: ls.sessionId });
    return { holder: b.holder, train: t };
  });

  go('P057-10', () => {
    api.advance(); api.advance();
    need(GV.railFreight054.snapshot().cursor === 2, 'rail cursor 2');
    const cut = legs.rail[3], [cx, cy] = at(cut);
    const why = GV.canPlaceTool('doze', cx, cy);
    need(why === null && GV.place('doze', cx, cy) !== false && !GV.tile(cx, cy).rail, 'native doze did not remove the rail', { why });
    const tries = [];
    for (let k = 0; k < 3; k++) {
      const r = api.advance();
      tries.push(r.reason);
      need(r.ok === false && r.reason === 'track-broken' && r.tile === cut, 'broken rail did not stop the train', r);
    }
    const t = GV.railBlock055.snapshot().trains[0];
    need(GV.railFreight054.snapshot().cursor === 2 && t.cursor === 2 && api.snapshot().rail.cursor === 2, 'something moved while the rail was broken');
    const re = GV.canPlaceTool('rail', cx, cy);
    need(re === null && GV.place('rail', cx, cy) !== false && GV.tile(cx, cy).rail, 'native rail did not re-lay', { re });
    const r = api.advance();
    need(r.ok === true && r.moved === true && GV.railFreight054.snapshot().cursor === 3, 'did not continue after re-laying', r);
    return { cut: at(cut), tries, resumedAt: 3 };
  });

  go('P057-11', () => {
    const before = Lg.snapshot().ledger;
    let r = null;
    for (let k = 0; k < 40; k++) { r = api.advance(); if (!r.ok || r.delivered) break; }
    need(r && r.ok === true && r.delivered === true, 'trip did not deliver', r);
    const a = batch('batch-A'), led = Lg.snapshot().ledger;
    need(a.state === 'HELD' && a.owner === 'research-receiver' && a.location === 'research-receiver-shelf' && a.qty === 7 && a.commodityId === 'food', 'batch-A not HELD at the receiver', a);
    need(led.conservation.ok === true && led.conservation.accounted === 20 && led.unissued === before.unissued && led.batches.length === before.batches.length, 'conservation', led.conservation);
    need(r.handoff.ok === true && r.handoff.type === 'HANDOFF' && r.handoff.revision === before.revision + 1, 'handoff result', r.handoff);
    need(GV.railFreight054.snapshot().status === 'UNLOADED' && GV.railBlock055.snapshot().holder === null && GV.railBlock055.snapshot().trains[0].status === 'ARRIVED', 'legs not finished');
    const s = api.snapshot();
    need(s.status === 'DELIVERED' && s.rail.at === legs.rail[legs.rail.length - 1], 'snapshot after delivery', s.status);
    return { handoff: r.handoff, batchA: { state: a.state, owner: a.owner, qty: a.qty }, conservation: led.conservation };
  });
  return out;
}

/* 面板幾何：四個 LAB 面板都打開，量矩形。 */
function pagePanels(P) {
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  const ids = [['lab053Panel', 'roadDelivery053', 0], ['lab054Panel', 'railFreight054', 1], ['lab055Panel', 'railBlock055', 2], ['lab057Panel', 'intermodal057', 3]];
  for (const [, k] of ids) GV[k].open();
  const vw = innerWidth, vh = innerHeight, h = (vh - 120) / 4;
  const out = { vw, vh, rects: {}, slots: {}, overlaps: [], outside: [], misplaced: [] };
  for (const [id, , k] of ids) {
    const r = rect(document.getElementById(id));
    out.rects[id] = r;
    out.slots[id] = { l: 12, t: 84 + k * (h + 8), w: Math.min(260, vw - 24), h };
    const s = out.slots[id];
    if (!r || Math.abs(r.l - s.l) > 1 || Math.abs(r.t - s.t) > 1 || Math.abs(r.w - s.w) > 1 || Math.abs(r.h - s.h) > 1) out.misplaced.push(id);
    if (!r || r.l < 0 || r.t < 0 || r.r > vw + 0.5 || r.b > vh + 0.5) out.outside.push(id);
  }
  const ov = (a, b) => !!(a && b && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b);
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (ov(out.rects[ids[i][0]], out.rects[ids[j][0]])) out.overlaps.push(ids[i][0] + '×' + ids[j][0]);
  const notice = document.getElementById('lab057Unsaved'), nr = rect(notice), me = out.rects.lab057Panel;
  out.notice = notice ? notice.textContent : null;
  out.noticeInside = !!(me && nr && nr.w > 0 && nr.h > 0 && nr.l >= me.l && nr.r <= me.r && nr.t >= me.t && nr.b <= me.b);
  out.ok = out.misplaced.length === 0 && out.overlaps.length === 0 && out.outside.length === 0 && out.notice === P.unsaved && out.noticeInside;
  return out;
}

function pageLoad(P) {
  const out = { fails: [], facts: {} };
  try {
    const api = GV.intermodal057, Lg = GV.singleResearch052, L = window.__probe057.L;
    for (const k of ['roadDelivery053', 'railFreight054', 'railBlock055']) GV[k].end();
    const s = api.start({ batchId: 'batch-B', originCustodian: 'research-source', destinationCustodian: 'research-receiver',
      roadFrom: L.O.root, roadTo: L.H1.root, railFrom: L.H1.root, railTo: L.H2.root });
    const steps = [api.advance(), api.advance()].map((r) => r.ok && r.leg);
    api.open();
    const sessionId = Lg.snapshot().ledger.sessionId, hadPanel = !!document.getElementById('lab057Panel');
    const loaded = GV.load();
    const snap = api.snapshot(), led = Lg.snapshot();
    const f = snap.lastEnded && snap.lastEnded.ledger && snap.lastEnded.ledger.freeze;
    out.facts = { start: s.ok, steps, hadPanel, loaded, snapshot: { ok: snap.ok, reason: snap.reason }, lastEnded: snap.lastEnded && { endedBy: snap.lastEnded.endedBy, status: snap.lastEnded.status, batchId: snap.lastEnded.batchId, qty: snap.lastEnded.qty }, freeze: f, ledgerAfter: { active: led.active, ended: led.ended } };
    const ok = s.ok === true && steps.join() === 'road,road' && hadPanel && loaded === true && snap.ok === false && snap.reason === 'no-trip' &&
      snap.lastEnded.endedBy === 'load' && snap.lastEnded.status === 'CANCELLED' && snap.lastEnded.batchId === 'batch-B' && snap.lastEnded.qty === 8 &&
      f && f.ok === true && f.type === 'FREEZE' && f.state === 'FROZEN' && f.batchId === 'batch-B' && f.qty === 8 && f.sessionId === sessionId &&
      !document.getElementById('lab057Panel') && led.active === false && led.ended && led.ended.reason === 'load-entry-research-cancelled';
    if (!ok) out.fails.push('P057-13 讀檔沒有取消並 FREEZE 那一趟（或沒清掉面板、052 會話沒結束）：' + JSON.stringify(out.facts));
  } catch (e) { out.fails.push('P057-13 EXC ' + String((e && e.stack) || e).split('\n')[0]); }
  return out;
}

function pageValveAtInstall() {
  const out = { fails: [], facts: {} };
  try {
    GV.newWorldSeeded(20261104);
    GV.setSpeed(0);
    const api = GV.intermodal057;
    out.facts.provenance = api && api.provenance;
    if (!(api && api.provenance.installed === false && window.__noIntermodal057 === true && Object.isFrozen(api))) out.fails.push('P057-21 安裝當下閥門已開，057 仍然裝上了：' + JSON.stringify(out.facts.provenance));
    const names = ['start', 'advance', 'cancel', 'open', 'refresh', 'end', 'disable'];
    const call = () => Object.fromEntries(names.map((k) => { const r = api[k]({ batchId: 'batch-A' }); return [k, r && r.reason]; }));
    const on = call();
    delete window.__noIntermodal057;
    const offNow = call();
    const snap = api.snapshot();
    out.facts.calls = { valveOn: on, valveRemoved: offNow, snapshot: snap, panel: !!document.getElementById('lab057Panel') };
    if (!(Object.values(on).every((x) => x === 'disabled') && Object.values(offNow).every((x) => x === 'disabled') && snap.disabled === true && snap.installed === false && !document.getElementById('lab057Panel'))) {
      out.fails.push('P057-22 沒安裝的介面有動作沒回 disabled，或建了面板：' + JSON.stringify(out.facts.calls));
    }
    out.facts.pagehideSpy = window.__pagehideSpy.slice();
  } catch (e) { out.fails.push('P057-21 EXC ' + String((e && e.stack) || e).split('\n')[0]); }
  return out;
}

/* ---------- CDP：load／newWorld 的包裝鏈與 pagehide 監聽（同 probeRailBlock055.cjs 的量法） ---------- */
async function props(cdp, objectId) { return cdp.send('Runtime.getProperties', { objectId, ownProperties: true, generatePreview: false }); }
async function fnMeta(cdp, objectId) {
  const ip = (await props(cdp, objectId)).internalProperties || [];
  const loc = ip.find((q) => q.name === '[[FunctionLocation]]'), sc = ip.find((q) => q.name === '[[Scopes]]');
  return { line: loc && loc.value && loc.value.value ? loc.value.value.lineNumber : null, scopes: sc && sc.value ? sc.value.objectId : null };
}
async function outerBindings(cdp) {
  const ev = await cdp.send('Runtime.evaluate', { expression: 'GV.load', objectGroup: 'probe057' });
  const m = await fnMeta(cdp, ev.result.objectId);
  for (const e of (await props(cdp, m.scopes)).result || []) {
    if (!e.value || e.value.subtype !== 'internal#scope') continue;
    const found = {};
    for (const v of (await props(cdp, e.value.objectId)).result || []) if ((v.name === 'load' || v.name === 'newWorld') && v.value && v.value.type === 'function') found[v.name] = v.value.objectId;
    if (found.load && found.newWorld) return found;
  }
  return null;
}
async function wrapperChain(cdp, startId, pattern) {
  const layers = [];
  let id = startId;
  for (let depth = 0; id && depth < 16; depth++) {
    const m = await fnMeta(cdp, id);
    layers.push({ line: m.line, block: blockOf(m.line) });
    id = null;
    if (!m.scopes) break;
    for (const e of (await props(cdp, m.scopes)).result || []) {
      const d = (e.value && e.value.description) || '';
      if (!e.value || e.value.subtype !== 'internal#scope' || !(d === 'Block' || /^(Block|Closure) \(.+\)$/.test(d))) continue;
      const vars = (await props(cdp, e.value.objectId)).result || [];
      if (vars.length > 1500) continue;
      const v = vars.find((q) => pattern.test(q.name) && q.value && q.value.type === 'function');
      if (v) { id = v.value.objectId; break; }
    }
  }
  return layers;
}
async function hooks(cdp) {
  const outer = await outerBindings(cdp);
  if (!outer) return { error: 'outer load/newWorld bindings not found' };
  const load = await wrapperChain(cdp, outer.load, /load/i);
  const newWorld = await wrapperChain(cdp, outer.newWorld, /world/i);
  const w = await cdp.send('Runtime.evaluate', { expression: 'window', objectGroup: 'probe057' });
  const ls = await cdp.send('DOMDebugger.getEventListeners', { objectId: w.result.objectId });
  const pagehide = (ls.listeners || []).filter((l) => l.type === 'pagehide').map((l) => blockOf(l.lineNumber));
  await cdp.send('Runtime.releaseObjectGroup', { objectGroup: 'probe057' });
  const labs = (layers) => layers.map((l) => l.block).filter(Boolean);
  return { load: labs(load), newWorld: labs(newWorld), pagehide: pagehide.filter(Boolean) };
}

const run = (cdp, fn, arg) => cdp.evalJs('(' + fn.toString() + ')(' + JSON.stringify(arg === undefined ? null : arg) + ')');

async function sessionA() {
  const P = { seed: SEED, unsaved: UNSAVED };
  return H.withGame({ port: PORT, fresh: true, timeout: 400, log: () => {}, preScript: SPY }, async ({ cdp }) => {
    const fails = [], facts = {};
    const scene = await run(cdp, pageScene, P);
    facts.scene = scene.checks;
    fails.push(...scene.fails);
    if (fails.length) return { fails, facts };
    facts.panels = {};
    const views = [['desktop', null], ['phone390x780', { width: 390, height: 780 }], ['phone360x640', { width: 360, height: 640 }]];
    for (const [name, size] of views) {
      if (size) await cdp.send('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: 1, mobile: true });
      await H.sleep(400);
      const g = await run(cdp, pagePanels, P);
      facts.panels[name] = g;
      if (!g.ok) fails.push('P057-12 四個 LAB 面板不在各自那一格、互相重疊、超出視窗，或沒有未保存提示（' + name + '）：' + JSON.stringify({ vw: g.vw, vh: g.vh, misplaced: g.misplaced, overlaps: g.overlaps, outside: g.outside, notice: g.notice, rects: g.rects }));
    }
    await cdp.send('Emulation.clearDeviceMetricsOverride');
    await H.sleep(400);
    const hk = await hooks(cdp);
    facts.hooks = hk;
    const spy = await cdp.evalJs('window.__pagehideSpy.slice()');
    facts.pagehideSpy = spy;
    if (!(hk.load && hk.load[0] === '057' && hk.newWorld[0] === '057' && hk.pagehide.filter((b) => b === '057').length === 1 && spy.filter((n) => n === 'pagehide057').length === 1)) {
      fails.push('P057-14 量不到 057 在最外層的 load／newWorld 包裝或 pagehide 監聽（對照組失效）：' + JSON.stringify({ hk, spy }));
    }
    if (!fails.length) {
      const ld = await run(cdp, pageLoad, P);
      facts.load = ld.facts;
      fails.push(...ld.fails);
    }
    return { fails, facts };
  });
}

async function sessionB(hooksA) {
  return H.withGame({ port: PORT, fresh: true, timeout: 300, log: () => {}, preScript: SPY + '\nwindow.__noIntermodal057 = true;' }, async ({ cdp }) => {
    const part = await run(cdp, pageValveAtInstall);
    const fails = part.fails.slice(), facts = part.facts;
    const hk = await hooks(cdp);
    facts.hooks = hk;
    const without = (xs) => xs.filter((b) => b !== '057');
    const spyHas = (facts.pagehideSpy || []).includes('pagehide057');
    if (!(hk.load && !hk.load.includes('057') && !hk.newWorld.includes('057') && !hk.pagehide.includes('057') && !spyHas)) fails.push('P057-23 安裝當下閥門已開，057 仍包了 load／newWorld 或掛了 pagehide：' + JSON.stringify({ hk, spy: facts.pagehideSpy }));
    if (hooksA && hk.load && !(JSON.stringify(hk.load) === JSON.stringify(without(hooksA.load)) && JSON.stringify(hk.newWorld) === JSON.stringify(without(hooksA.newWorld)) &&
      JSON.stringify(hk.pagehide) === JSON.stringify(without(hooksA.pagehide)))) fails.push('P057-23 除了 057 那一層，包裝鏈與 pagehide 監聽和 A 段不同：' + JSON.stringify({ a: hooksA, b: hk }));
    return { fails, facts };
  });
}

(async () => {
  const out = { ok: false, fails: [], sessions: {}, blocks: BLOCKS, port: PORT };
  let hooksA = null;
  if (SESSION.includes('A')) {
    const a = await sessionA();
    out.sessions.A = { seconds: a.seconds, harnessFails: a.fails, facts: a.result && a.result.facts };
    if (!a.ok || !a.result) out.fails.push('A-- 工作階段失敗：' + JSON.stringify(a.fails));
    else { out.fails.push(...a.result.fails); hooksA = a.result.facts.hooks || null; }
  }
  if (SESSION.includes('B')) {
    const b = await sessionB(hooksA);
    out.sessions.B = { seconds: b.seconds, harnessFails: b.fails, facts: b.result && b.result.facts };
    if (!b.ok || !b.result) out.fails.push('B-- 工作階段失敗：' + JSON.stringify(b.fails));
    else out.fails.push(...b.result.fails);
  }
  out.ok = out.fails.length === 0;
  console.log('PROBE_INTERMODAL057 ' + JSON.stringify(out, null, 1));
  if (out.fails.length) console.log('PROBE_INTERMODAL057 FIRST_RED ' + out.fails[0].split('：')[0]);
  console.log('PROBE_INTERMODAL057 RESULT ' + (out.ok ? 'PASS' : 'FAIL'));
  process.exitCode = out.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_INTERMODAL057 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

'use strict';
/* T784 / LAB-06：閉塞區間（占軌、等待、斷軌恢復）的真 Chrome 探測。
 *
 * A 段（閥門沒開）：固定種子 GV.newWorldSeeded(20261104)＋原生開發者沙盒。
 *   - 用列前綴和找一條 14 格、四鄰沒有鐵軌的空陸地，用原生鐵軌工具鋪真軌；
 *   - 兩列在同一區間：一列走、一列等；沒登記的列車要不到路權；路上 release 回 still-running；
 *   - 第一列走到一半，用原生拆除工具（doze）拆掉它前方一格真軌 → track-broken、留在原地；
 *     用原生鐵軌工具鋪回 → 繼續到站；第二列照 FIFO 拿到路權跑完；之後第三列能開；
 *   - 面板有「未保存」提示，桌機與兩種手機視窗下都在右上角、不和其他 LAB 面板重疊；
 *   - 閥門開著時所有變更動作回 disabled；讀檔、開新城、end() 都清空；
 *   - CDP 量 load／newWorld 的包裝鏈與 pagehide 監聽：裡面有 055 這一層（B 段的對照組）。
 * B 段（preScript 在安裝前開閥門）：介面一律 disabled（關閥之後也是）；
 *   load／newWorld 包裝鏈與 pagehide 監聽裡沒有 055，其餘各層與 A 段相同。
 *
 * 每條斷言有編號（A01…、B01…）；fails 依發生順序排，第一個就是首紅。
 * 用法：PROBE_PORT=8212 node probeRailBlock055.cjs   （埠預設 8199；PROBE_SESSION=A 或 B 只跑一段）
 */
const fs = require('fs');
const path = require('path');
const H = require('./harness.js');

const PORT = +(process.env.PROBE_PORT || 8199);
const SESSION = process.env.PROBE_SESSION || 'AB';
const SEED = 20261104;
const LINE_LEN = 14;
const UNSAVED = '未保存：重新整理或讀檔就會消失';

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
function pageSetup(P) {
  const fails = [], facts = {};
  const need = (id, cond, msg, detail) => { if (!cond) fails.push(id + ' ' + msg + (detail === undefined ? '' : '：' + JSON.stringify(detail))); return !!cond; };
  try {
    GV.newWorldSeeded(P.seed);
    GV.setSpeed(0);
    GV.addMoney(5000000);
    const c0 = window.confirm;
    window.confirm = () => true;
    let sandbox;
    try { sandbox = GV.enterSandbox516B(); } finally { window.confirm = c0; }
    const god = GV.setGod516B(true), unlock = GV.setOverride516B('unlockAll', true);
    GV.setSpeed(0);
    let N = 0;
    for (let x = 0; x <= 512; x++) { if (!GV.tile(x, 0)) break; N = x + 1; }
    facts.setup = { seed: P.seed, N, sandbox, god, unlock };
    need('A00', sandbox === true && god === true && unlock === true && N > 20, '固定種子城市與原生開發者沙盒沒有就緒', facts.setup);
    window.__probe055 = { N };
  } catch (e) { fails.push('EXC setup ' + String((e && e.stack) || e).split('\n')[0]); }
  return { fails, facts };
}

function pageScenario(P) {
  const fails = [], facts = {};
  const need = (id, cond, msg, detail) => { if (!cond) fails.push(id + ' ' + msg + (detail === undefined ? '' : '：' + JSON.stringify(detail))); return !!cond; };
  const B = GV.railBlock055;
  const N = window.__probe055.N;
  const ix = (x, y) => y * N + x;
  const xy = (i) => [i % N, (i / N) | 0];
  const tr = (tid) => B.snapshot().trains.find((t) => t.id === tid) || null;
  const hasRail = (i) => { const p = xy(i), t = GV.tile(p[0], p[1]); return !!(t && t.rail); };
  /* 列前綴和：找第一段 L 格空陸地（t 1／2、沒有建築／道路／鐵軌／電車軌／碼頭／焦土／坑），四鄰也沒有鐵軌。 */
  function findStrip(L) {
    const T = [];
    for (let y = 0; y < N; y++) { const row = []; for (let x = 0; x < N; x++) row.push(GV.tile(x, y)); T.push(row); }
    const railAt = (x, y) => x >= 0 && y >= 0 && x < N && y < N && !!T[y][x].rail;
    const free = (x, y) => {
      const t = T[y][x];
      if (!(t.t === 1 || t.t === 2) || t.bld || t.road || t.rail || t.tram || t.dock || t.ruin || t.crater) return 0;
      return railAt(x, y - 1) || railAt(x, y + 1) || railAt(x - 1, y) || railAt(x + 1, y) ? 0 : 1;
    };
    for (let y = 1; y < N - 1; y++) {
      const S = [0];
      for (let x = 0; x < N; x++) S.push(S[x] + free(x, y));
      for (let x0 = 1; x0 + L <= N - 1; x0++) if (S[x0 + L] - S[x0] === L) return { x0, y, L };
    }
    return null;
  }
  function layLine(tag) {
    const s = findStrip(P.lineLen);
    if (!need(tag, !!s, '找不到可鋪的空陸地')) return null;
    const bad = [];
    for (let k = 0; k < s.L; k++) {
      const x = s.x0 + k, why = GV.canPlaceTool('rail', x, s.y);
      const okPlace = why === null ? GV.place('rail', x, s.y) : false;
      if (why !== null || !okPlace || !hasRail(ix(x, s.y))) bad.push([x, s.y, why, okPlace]);
    }
    need(tag, bad.length === 0, '原生鐵軌工具沒有把整條鋪成', bad);
    return s;
  }
  const doze = (i) => { const p = xy(i); const why = GV.canPlaceTool('doze', p[0], p[1]); const ok = why === null && GV.place('doze', p[0], p[1]); return { why, ok, rail: hasRail(i) }; };
  const relay = (i) => { const p = xy(i); const why = GV.canPlaceTool('rail', p[0], p[1]); const ok = why === null && GV.place('rail', p[0], p[1]); return { why, ok, rail: hasRail(i) }; };
  const drive = (tid, max) => { let r = null; for (let k = 0; k < max; k++) { r = B.advance(tid); if (!r.ok || r.arrived) break; } return r; };
  try {
    need('A01', B && B.provenance && B.provenance.installed === true && B.provenance.brokenSource === 'tiles[i].rail', 'GV.railBlock055 沒有裝上（或不是讀真地格的版本）', B && B.provenance);
    const s = layLine('A01');
    if (!s) return { fails, facts };
    const A = ix(s.x0, s.y), Z = ix(s.x0 + s.L - 1, s.y);
    facts.line = { x0: s.x0, y: s.y, len: s.L, from: xy(A), to: xy(Z) };

    // 兩列登記：路線由 LAB-05 的 plan() 在真軌上規劃
    const s1 = B.spawn('t1', A, Z, { batchId: 'qa-055-a', qty: 8, commodityId: 'food' }, 12);
    const s2 = B.spawn('t2', Z, A, { batchId: 'qa-055-b', qty: 6 }, 12);
    facts.spawn = { t1: [s1.ok, s1.steps, s1.reason || null], t2: [s2.ok, s2.steps, s2.reason || null] };
    need('A02', s1.ok && s2.ok && s1.steps === s.L - 1 && s2.steps === s.L - 1 && s1.path[0] === A && s1.path[s.L - 1] === Z && s2.path[0] === Z &&
      s1.path.every(hasRail), '兩列沒有沿真軌登記成功', facts.spawn);

    const ghost = B.request('ghost');
    need('A03', ghost.ok === false && ghost.reason === 'unknown-train' && B.snapshot().holder === null, '沒登記的列車要到了路權', ghost);

    const r1 = B.request('t1'), r2 = B.request('t2');
    facts.authority = { t1: r1.status || r1.reason, t2: r2.status || r2.reason };
    need('A04', r1.status === 'GRANTED' && r2.status === 'WAITING', '不是一列走、一列等', facts.authority);
    const w = B.advance('t2');
    need('A05', w.ok === false && w.reason === 'no-authority' && tr('t2').cursor === 0, '等待中的列車竟然能推進', w);
    const third = B.spawn('t3', A, Z);
    need('A06', third.ok === false && third.reason === 'too-many', '同時兩列在冊時第三列沒有被擋', third);

    for (let k = 0; k < 3; k++) B.advance('t1');
    facts.t1AfterThree = tr('t1');
    need('A07', tr('t1').cursor === 3 && tr('t1').status === 'RUNNING', '第一列沒有沿真軌前進三格', facts.t1AfterThree);
    const relHolder = B.release('t1'), relWaiter = B.release('t2');
    facts.release = { holder: relHolder.reason || relHolder.ok, waiter: relWaiter.reason || relWaiter.ok };
    need('A08', relHolder.reason === 'still-running' && relWaiter.reason === 'not-holder' && B.snapshot().holder === 't1' &&
      JSON.stringify(B.snapshot().waiting) === '["t2"]', '路上 release 放掉了路權', facts.release);

    const flagTile = tr('t1').next;
    const flag = B.breakTile(flagTile), moved = B.advance('t1');
    facts.manualFlag = { flag: flag.reason, moved: moved.ok, cursor: tr('t1').cursor };
    need('A09', flag.reason === 'real-tiles-only' && moved.ok === true && tr('t1').cursor === 4, '手動 breakTile 影響了判定', facts.manualFlag);

    // 真斷軌：原生拆除工具拆掉第一列前方一格
    const cut = tr('t1').next;
    const dz = doze(cut);
    facts.cut = { tile: cut, at: xy(cut), doze: dz };
    need('A10', dz.why === null && dz.ok === true && dz.rail === false, '原生拆除工具沒有拆掉那格真軌', facts.cut);
    const blocked = B.advance('t1');
    facts.blocked = { ok: blocked.ok, reason: blocked.reason, tile: blocked.tile, x: blocked.x, y: blocked.y, cursor: tr('t1').cursor, blockedTile: tr('t1').blockedTile, broken: B.snapshot().broken };
    need('A11', blocked.ok === false && blocked.reason === 'track-broken' && blocked.tile === cut && blocked.x === xy(cut)[0] && blocked.y === xy(cut)[1] &&
      tr('t1').cursor === 4 && tr('t1').blockedTile === cut && JSON.stringify(B.snapshot().broken) === JSON.stringify([cut]), '前方真軌被拆，列車沒有停住回 track-broken', facts.blocked);
    const again = [B.advance('t1').reason, B.advance('t1').reason, B.advance('t1').reason];
    const still = tr('t1');
    facts.stays = { again, cursor: still.cursor, steps: still.steps, holder: B.snapshot().holder, waiter: B.advance('t2').reason };
    need('A12', again.every((x) => x === 'track-broken') && still.cursor === 4 && still.steps === 4 && facts.stays.holder === 't1' && facts.stays.waiter === 'no-authority',
      '斷軌期間列車漂移或讓出了路權', facts.stays);

    const rl = relay(cut);
    facts.relay = rl;
    need('A13', rl.why === null && rl.ok === true && rl.rail === true, '原生鐵軌工具沒有把那格鋪回', rl);
    const resumed = B.advance('t1');
    facts.resumed = { ok: resumed.ok, moved: resumed.moved, cursor: tr('t1').cursor, blockedTile: tr('t1').blockedTile, broken: B.snapshot().broken };
    need('A14', resumed.ok === true && resumed.moved === true && tr('t1').cursor === 5 && tr('t1').blockedTile === null && B.snapshot().broken.length === 0,
      '那格鋪回之後第一列沒有繼續', facts.resumed);

    const last1 = drive('t1', s.L + 2);
    const afterArrive = B.snapshot();
    facts.handover = { arrived: last1 && last1.arrived, granted: last1 && last1.granted, holder: afterArrive.holder, waiting: afterArrive.waiting, t1: tr('t1').status, cursor: tr('t1').cursor };
    need('A15', last1 && last1.arrived === true && last1.granted === 't2' && afterArrive.holder === 't2' && afterArrive.waiting.length === 0 &&
      tr('t1').status === 'ARRIVED' && tr('t1').cursor === s.L - 1, '第一列到站後路權沒有照 FIFO 交給第二列', facts.handover);
    const relDone = B.release('t1'), reqDone = B.request('t1');
    facts.afterArrival = { release: [relDone.ok, relDone.alreadyReleased], request: reqDone.reason, holder: B.snapshot().holder };
    need('A16', relDone.ok === true && relDone.alreadyReleased === true && reqDone.reason === 'already-finished' && B.snapshot().holder === 't2',
      '到站後的 release／request 動到了新持有者', facts.afterArrival);

    const last2 = drive('t2', s.L + 2);
    facts.final = { arrived: last2 && last2.arrived, holder: B.snapshot().holder, t2: tr('t2').status, active: B.snapshot().active };
    need('A17', last2 && last2.arrived === true && B.snapshot().holder === null && tr('t2').status === 'ARRIVED' && B.snapshot().active === 0, '第二列沒有跑完', facts.final);

    const s3 = B.spawn('t3', A, Z, { batchId: 'qa-055-c', qty: 1 }), q3 = B.request('t3');
    facts.third = { spawn: s3.ok || s3.reason, request: q3.status || q3.reason };
    need('A18', s3.ok === true && q3.status === 'GRANTED', '兩列跑完之後第三列開不了（名額沒釋放）', facts.third);
    const s4 = B.spawn('t4', Z, A, { batchId: 'qa-055-d', qty: 1 }), q4 = B.request('t4'), s5 = B.spawn('t5', A, Z);
    facts.cap = { t4: [s4.ok, q4.status], t5: s5.reason, active: B.snapshot().active };
    need('A19', s4.ok === true && q4.status === 'WAITING' && s5.reason === 'too-many' && B.snapshot().active === 2, '名額上限不是「同時兩列」', facts.cap);

    // 讓狀態不空：t3 走一格、拆掉它前方一格（後面要驗讀檔清空）
    B.advance('t3');
    const cut3 = tr('t3').next, dz3 = doze(cut3), bl3 = B.advance('t3');
    const busy = B.snapshot();
    facts.busy = { holder: busy.holder, waiting: busy.waiting, trains: busy.trains.length, broken: busy.broken, doze: dz3, blocked: bl3.reason };
    need('A20', busy.holder === 't3' && busy.waiting.length === 1 && busy.trains.length === 4 && busy.broken.length === 1 && bl3.reason === 'track-broken',
      '讀檔前的狀態沒有準備好', facts.busy);
    window.__probe055.cut3 = cut3;
  } catch (e) { fails.push('EXC scenario ' + String((e && e.stack) || e).split('\n')[0]); }
  return { fails, facts };
}

/* 面板幾何：把四個 LAB 面板都打開，量矩形。 */
function pagePanel(P) {
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  const others = [['lab053Panel', 'roadDelivery053'], ['lab054Panel', 'railFreight054'], ['lab057Panel', 'intermodal057']];
  for (const [, k] of others) { try { if (GV[k] && typeof GV[k].open === 'function') GV[k].open(); } catch (e) {} }
  GV.railBlock055.open();
  const p = document.getElementById('lab055Panel');
  const notice = document.getElementById('lab055Unsaved');
  const cs = p ? getComputedStyle(p) : null;
  const out = {
    vw: innerWidth, vh: innerHeight, count: document.querySelectorAll('#lab055Panel').length,
    mine: rect(p), position: cs && cs.position, notice: notice ? notice.textContent : null, noticeRect: rect(notice),
    visible: !!(cs && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0), others: {}
  };
  for (const [id] of others) out.others[id] = rect(document.getElementById(id));
  const ov = (a, b) => !!(a && b && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b);
  out.overlaps = Object.keys(out.others).filter((id) => ov(out.mine, out.others[id]));
  out.noticeInside = !!(out.mine && out.noticeRect && out.noticeRect.w > 0 && out.noticeRect.h > 0 &&
    out.noticeRect.l >= out.mine.l && out.noticeRect.r <= out.mine.r && out.noticeRect.t >= out.mine.t && out.noticeRect.b <= out.mine.b);
  out.ok = !!(out.mine && out.count === 1 && out.position === 'fixed' && out.visible && Math.abs(out.vw - out.mine.r - 12) <= 1 && Math.abs(out.mine.t - 84) <= 1 &&
    out.mine.b <= out.vh / 2 + 0.5 && out.mine.l >= 0 && out.overlaps.length === 0);
  out.unsavedOk = out.notice === P.unsaved && out.noticeInside;
  for (const [, k] of others) { try { if (GV[k] && typeof GV[k].end === 'function') GV[k].end(); } catch (e) {} }
  return out;
}

function pageLifecycle(P) {
  const fails = [], facts = {};
  const need = (id, cond, msg, detail) => { if (!cond) fails.push(id + ' ' + msg + (detail === undefined ? '' : '：' + JSON.stringify(detail))); return !!cond; };
  const B = GV.railBlock055;
  const N = window.__probe055.N;
  const ix = (x, y) => y * N + x;
  const empty = (s) => s.ok === true && s.holder === null && s.waiting.length === 0 && s.trains.length === 0 && s.broken.length === 0 && s.active === 0;
  const lay = () => {
    for (let y = 1; y < N - 1; y++) for (let x0 = 1; x0 + P.lineLen <= N - 1; x0++) {
      let ok = true;
      for (let k = 0; k < P.lineLen && ok; k++) { const t = GV.tile(x0 + k, y); ok = !!t && (t.t === 1 || t.t === 2) && !t.bld && !t.road && !t.rail && !t.tram && !t.dock && !t.ruin && !t.crater; }
      if (!ok) continue;
      for (let k = 0; k < P.lineLen; k++) if (GV.canPlaceTool('rail', x0 + k, y) === null) GV.place('rail', x0 + k, y);
      return { A: ix(x0, y), Z: ix(x0 + P.lineLen - 1, y), y, x0 };
    }
    return null;
  };
  const busy = (tag) => {
    const l = lay();
    if (!need(tag, !!l, '重新鋪軌失敗')) return false;
    const a = B.spawn('u1', l.A, l.Z), b = B.spawn('u2', l.Z, l.A);
    B.request('u1'); B.request('u2'); B.advance('u1');
    const nx = B.snapshot().trains[0].next;
    GV.place('doze', nx % N, (nx / N) | 0);
    const s = B.snapshot();
    return need(tag, a.ok && b.ok && s.holder === 'u1' && s.waiting.length === 1 && s.trains.length === 2 && s.broken.length === 1, '清空前的狀態沒有準備好', s);
  };
  try {
    // 閥門（安裝之後才開）：所有變更動作回 disabled，狀態不動
    const before = JSON.stringify(B.snapshot());
    window.__noRailBlock055 = true;
    const res = {
      spawn: B.spawn('v1', 0, 1), request: B.request('t4'), release: B.release('t3'), advance: B.advance('t3'), abort: B.abort('t3'),
      breakTile: B.breakTile(window.__probe055.cut3), repairTile: B.repairTile(window.__probe055.cut3), open: B.open()
    };
    const valveSnap = B.snapshot();
    delete window.__noRailBlock055;
    const after = JSON.stringify(B.snapshot());
    facts.valve = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.reason]));
    need('A23', Object.values(res).every((v) => v.ok === false && v.reason === 'disabled') && valveSnap.disabled === true && before === after,
      '閥門開著時有變更動作沒回 disabled，或狀態被改了', facts.valve);

    // 讀檔清空（B7）；開面板，確認讀檔也把它移掉
    B.open();
    const hadPanel = !!document.getElementById('lab055Panel');
    const loaded = GV.load();
    const sl = B.snapshot();
    facts.load = { loaded, hadPanel, panelAfter: !!document.getElementById('lab055Panel'), snapshot: sl };
    need('A24', loaded === true && hadPanel && empty(sl) && !document.getElementById('lab055Panel'), '讀檔沒有清空列車／等待隊列／斷軌狀態／面板', facts.load);

    // 開新城清空
    if (busy('A25')) {
      const nw = GV.newWorldSeeded(P.seed);
      const sn = B.snapshot();
      facts.newWorld = { nw, snapshot: sn };
      need('A25', nw === true && empty(sn), '開新城沒有清空', facts.newWorld);
    }
    // end() 清空
    if (busy('A26')) {
      const en = B.end();
      const se = B.snapshot();
      facts.end = { end: en, snapshot: se };
      need('A26', en.ok === true && empty(se), 'end() 沒有清空', facts.end);
    }
  } catch (e) { fails.push('EXC lifecycle ' + String((e && e.stack) || e).split('\n')[0]); }
  return { fails, facts };
}

function pageValveAtInstall() {
  const fails = [], facts = {};
  const need = (id, cond, msg, detail) => { if (!cond) fails.push(id + ' ' + msg + (detail === undefined ? '' : '：' + JSON.stringify(detail))); return !!cond; };
  try {
    GV.newWorldSeeded(20261104);
    GV.setSpeed(0);
    const B = GV.railBlock055;
    facts.provenance = B && B.provenance;
    need('B01', !!B && B.provenance.installed === false && window.__noRailBlock055 === true, '安裝當下閥門已開，055 仍然裝上了', facts.provenance);
    const names = ['spawn', 'request', 'release', 'advance', 'abort', 'breakTile', 'repairTile', 'open', 'refresh', 'end', 'disable'];
    const call = () => Object.fromEntries(names.map((k) => { const r = B[k]('t1', 0, 1); return [k, r && r.reason]; }));
    const on = call();
    delete window.__noRailBlock055;
    const offNow = call();
    const snap = B.snapshot();
    facts.calls = { valveOn: on, valveRemoved: offNow, snapshot: snap, panel: !!document.getElementById('lab055Panel') };
    need('B02', Object.values(on).every((x) => x === 'disabled') && Object.values(offNow).every((x) => x === 'disabled') && snap.disabled === true &&
      snap.installed === false && snap.trains.length === 0 && !document.getElementById('lab055Panel'), '沒安裝的介面有動作沒回 disabled', facts.calls);
  } catch (e) { fails.push('EXC valve-at-install ' + String((e && e.stack) || e).split('\n')[0]); }
  return { fails, facts };
}

/* ---------- CDP：load／newWorld 的包裝鏈與 pagehide 監聽 ---------- */
async function props(cdp, objectId) { return cdp.send('Runtime.getProperties', { objectId, ownProperties: true, generatePreview: false }); }
async function fnMeta(cdp, objectId) {
  const ip = (await props(cdp, objectId)).internalProperties || [];
  const loc = ip.find((q) => q.name === '[[FunctionLocation]]'), sc = ip.find((q) => q.name === '[[Scopes]]');
  return { line: loc && loc.value && loc.value.value ? loc.value.value.lineNumber : null, scopes: sc && sc.value ? sc.value.objectId : null };
}
/* 最外層的 load／newWorld 綁定在遊戲主 IIFE 的閉包裡；GV.load 是在那裡定義的箭頭函式。 */
async function outerBindings(cdp) {
  const ev = await cdp.send('Runtime.evaluate', { expression: 'GV.load', objectGroup: 'probe055' });
  const m = await fnMeta(cdp, ev.result.objectId);
  for (const e of (await props(cdp, m.scopes)).result || []) {
    if (!e.value || e.value.subtype !== 'internal#scope') continue;
    const found = {};
    for (const v of (await props(cdp, e.value.objectId)).result || []) if ((v.name === 'load' || v.name === 'newWorld') && v.value && v.value.type === 'function') found[v.name] = v.value.objectId;
    if (found.load && found.newWorld) return found;
  }
  return null;
}
/* 從最外層往內走：每一層包裝的 Block／具名閉包裡，名字含 load（或 world）的函式就是它包住的下一層。
 * 走到遊戲主 IIFE 那幾層（匿名閉包）就停；只需要 LAB 區塊那一段。 */
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
      // 只看包裝自己的 Block／具名閉包（V8 描述成「Block (installXxx)」「Closure (installXxx)」）；略過遊戲主 IIFE 的匿名閉包與 Global
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
  const w = await cdp.send('Runtime.evaluate', { expression: 'window', objectGroup: 'probe055' });
  const ls = await cdp.send('DOMDebugger.getEventListeners', { objectId: w.result.objectId });
  const pagehide = (ls.listeners || []).filter((l) => l.type === 'pagehide').map((l) => blockOf(l.lineNumber));
  await cdp.send('Runtime.releaseObjectGroup', { objectGroup: 'probe055' });
  const labs = (layers) => layers.map((l) => l.block).filter(Boolean);
  return { load: labs(load), newWorld: labs(newWorld), pagehide: pagehide.filter(Boolean), loadDepth: load.length, newWorldDepth: newWorld.length };
}

const run = (cdp, fn, arg) => cdp.evalJs('(' + fn.toString() + ')(' + JSON.stringify(arg === undefined ? null : arg) + ')');

async function sessionA() {
  const P = { seed: SEED, lineLen: LINE_LEN, unsaved: UNSAVED };
  const r = await H.withGame({ port: PORT, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const fails = [], facts = {};
    const take = (part) => { fails.push(...part.fails); Object.assign(facts, part.facts); };
    take(await run(cdp, pageSetup, P));
    if (fails.length) return { fails, facts };
    take(await run(cdp, pageScenario, P));
    // 面板：桌機視窗、兩種手機視窗
    facts.panel = {};
    const views = [['desktop', null], ['phone390x780', { width: 390, height: 780 }], ['phone360x640', { width: 360, height: 640 }]];
    for (const [name, size] of views) {
      if (size) await cdp.send('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: 1, mobile: true });
      await H.sleep(400);
      const g = await run(cdp, pagePanel, P);
      facts.panel[name] = g;
      if (!g.unsavedOk) fails.push('A21 面板沒有顯示「未保存」提示（' + name + '）：' + JSON.stringify({ notice: g.notice, inside: g.noticeInside }));
      if (!g.ok) fails.push('A22 面板不在右上角上半部，或和其他 LAB 面板重疊（' + name + '）：' + JSON.stringify({ vw: g.vw, vh: g.vh, mine: g.mine, overlaps: g.overlaps, position: g.position }));
    }
    await cdp.send('Emulation.clearDeviceMetricsOverride');
    await H.sleep(400);
    take(await run(cdp, pageLifecycle, P));
    // 對照組：055 有裝上時，load／newWorld 包裝鏈與 pagehide 監聽裡都有 055 這一層
    const hk = await hooks(cdp);
    facts.hooks = hk;
    if (!(hk.load && hk.load.includes('055') && hk.newWorld.includes('055') && hk.pagehide.filter((b) => b === '055').length === 1)) fails.push('A27 量不到 055 的 load／newWorld 包裝或 pagehide 監聽（對照組失效）：' + JSON.stringify(hk));
    return { fails, facts };
  });
  return r;
}

async function sessionB(hooksA) {
  const r = await H.withGame({ port: PORT, fresh: true, timeout: 300, log: () => {}, preScript: 'window.__noRailBlock055 = true;' }, async ({ cdp }) => {
    const part = await run(cdp, pageValveAtInstall);
    const fails = part.fails.slice(), facts = part.facts;
    const hk = await hooks(cdp);
    facts.hooks = hk;
    const without = (xs) => xs.filter((b) => b !== '055');
    if (!(hk.load && !hk.load.includes('055') && !hk.newWorld.includes('055') && !hk.pagehide.includes('055'))) fails.push('B03 安裝當下閥門已開，055 仍包了 load／newWorld 或掛了 pagehide：' + JSON.stringify(hk));
    if (hooksA && hk.load && !(JSON.stringify(hk.load) === JSON.stringify(without(hooksA.load)) && JSON.stringify(hk.newWorld) === JSON.stringify(without(hooksA.newWorld)) &&
      JSON.stringify(hk.pagehide) === JSON.stringify(without(hooksA.pagehide)))) fails.push('B04 除了 055 那一層，包裝鏈與 pagehide 監聽和 A 段不同：' + JSON.stringify({ a: hooksA, b: hk }));
    return { fails, facts };
  });
  return r;
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
  console.log('PROBE_BLOCK055 ' + JSON.stringify(out, null, 2));
  if (out.fails.length) console.log('PROBE_BLOCK055 FIRST_RED ' + out.fails[0].split('：')[0]);
  console.log('PROBE_BLOCK055 RESULT ' + (out.ok ? 'PASS' : 'FAIL'));
  process.exitCode = out.ok ? 0 : 1;
})().catch((e) => { console.error('PROBE_BLOCK055 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

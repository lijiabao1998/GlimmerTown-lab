'use strict';
/* T787 / LAB-11：貨客運商業街同城 A–F 驗收（真 Chrome；只讀產品：不改 index.html，只用沙盒存檔槽）。
 *
 * 研究 session（R）：
 *   C0 印出被服務的 index.html SHA-256（頁面自己 fetch 再算）與 git HEAD；設了 EXPECT_INDEX_SHA256 就必須相等。
 *   S01 原生 GV.setMapSize(108)、固定種子 20261104 開新城 → 原生 GV.observatoryReset514()、GV.fiscalReset515()（T786：newWorld 不重設這兩塊）
 *       → 原生 AI 市長 60 天（每次 GV.step(5)）→ 第 61 天、有人口、原生 OD 有列。
 *   S02 原生開發者沙盒（enterSandbox516B → setGod516B → unlockAll）；進沙盒不改天數與人口。
 *   S03 貨運場景（同 T785：冷藏庫 k168 O、聯運中心 k166 H1／H2／H3、真路、真軌）；S04 F 場景（同 T781 的擺法，空地收成 18×13：k17 火車站、
 *       三家接主路的高街商店、一家接在不連通小路上的商店、站旁一小段軌）；相機對準貨運場景（對照 session 做同樣的事）。
 *   G01 兩段軌在原生連通分量上分開；貨運那段軌的四鄰沒有原生客運車站（k17／21／55／139）；F 的車站貼在自己那段軌上。
 *   A01–A02 053 startBetween(O→H1) 走真路到 DELIVERED、數量不變。
 *   B01–B02 054 runBetween(H1→H2) 到 ARRIVED、unload 後 UNLOADED、數量不變。
 *   C01–C05 055 兩列同一區間：一列走一列等；原生拆除工具拆前方一格 → track-broken 停住；原生鐵軌工具鋪回 → 繼續；FIFO 交棒。
 *   D01–D03 052 demo 帳上的 batch-A 走 O→道路→H1 轉運→路權→鐵路→H2；途中拆、鋪各一次；到站 SOURCE_READY→HELD、守恆。
 *   E01–E04 同城原生 OD 原樣交給 056（T780 版）：前提、rowTolerance 0.3 的守恆、逐列殘差上界、不給容差時的 nonconserved 對照。
 *   F01–F02 同城真車站與真高街，原生 T502 步行（GV.path502）半徑 18：接主路的連得上、不連通小路上的那家隔離。
 *   H1 每一次研究呼叫前後：money、人口、每一格地格、GV.stats()、整份 localStorage 逐字不變；H2 研究呼叫期間 Math.random 0 次。
 *      原生工具動作（拆、鋪）各自量出差異並記錄；整個情境前後的差異只能出在那幾格，鋪回之後回到拆之前（回不去的欄位照實記）。
 *   I01 原圖：D 到站那一刻（相機不動）；H3 取樣之後再拍場景俯視、四面板（桌機、390×780）、F 的車站與高街。
 * 對照 session（K）：同一套開局、同樣的場景與相機、同樣的拆軌與鋪回（格子由 R 傳過來），不做任何研究呼叫。
 *   H0 兩邊第 61 天（蓋場景之前）的存檔逐字相同。
 *   H3 兩邊各再推進 5 天：沙盒存檔鍵的內容立刻比（並核對正常存檔沒被改寫）；GV.stats()、t462、t468 在兩邊都讀回同一份存檔之後比
 *      （畫面車輛與它們造成的道路負載逐幀生成、不進存檔；推進後立刻取的那三份照實記差異）。
 *
 * 每條斷言有編號；第一個失敗就停，報告首紅。PROBE_BREAK=<編號> 注入對應的最小破壞（J：證明首紅落在那一條）。
 * 用法：PROBE_PORT=8231 [EXPECT_INDEX_SHA256=…] [PROBE_SHOTS=docs/assets/T787] node probeAcceptance787.cjs
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const H = require('./harness.js');

const PORT = +(process.env.PROBE_PORT || 8199);
const SEED = 20261104;
const DAYS = 60;
const MAP_SIZE = 108;
const BREAK = process.env.PROBE_BREAK || '';
const SHOTS = process.env.PROBE_SHOTS || '';
const EXPECT = process.env.EXPECT_INDEX_SHA256 || '';
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
const INDEX = fs.readFileSync(path.join(H.ROOT, 'index.html'), 'utf8');
const CORE056 = fs.readFileSync(path.join(H.ROOT, 'passenger-demand056.js'), 'utf8');
const CORE057 = fs.readFileSync(path.join(H.ROOT, 'shadow-visits057.js'), 'utf8');
const STATION_KS = [17, 21, 55, 139];
const WALK_RADIUS = 18;
const HS_BLOCK = INDEX.slice(INDEX.indexOf('const HIGHSTREET005=Object.freeze({'), INDEX.indexOf('const HIGHSTREET_TOOL005='));
const COMMERCE = [...HS_BLOCK.matchAll(/(\d+):Object\.freeze\(\{k:\1,id:'(\w+)'[^\n]*?sz:(\d+)[^\n]*?role:'(\w+)'/g)]
  .filter((m) => m[4] === 'commerce').map((m) => ({ k: +m[1], id: m[2], sz: +m[3] }));
if (COMMERCE.length < 3) throw new Error('HIGHSTREET005 commerce 少於 3 種');
let gitHead = null;
try { gitHead = cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: H.ROOT, encoding: 'utf8' }).trim(); } catch (e) { gitHead = null; }

/* ---------- 頁面裡共用的工具（每個 evaluate 前面都帶著） ---------- */
const PAGE_LIB = String.raw`
const P = window.__p787 || (window.__p787 = {});
const BREAK = ${JSON.stringify(BREAK)};
const need = (cond, msg, detail) => { if (!cond) throw new Error(msg + (detail === undefined ? '' : '：' + JSON.stringify(detail).slice(0, 900))); };
const nOf = () => { let N = 0; for (let x = 0; x <= 512; x++) { if (!GV.tile(x, 0)) break; N = x + 1; } return N; };
const storageAll = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; };
const snap = () => {
  const N = P.N || nOf(), tiles = new Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) tiles[y * N + x] = JSON.stringify(GV.tile(x, y));
  const st = GV.stats();
  return { money: st.money, pop: st.pop, stats: JSON.stringify(st), tiles, storage: JSON.stringify(storageAll()) };
};
const diff = (a, b) => {
  const tiles = [];
  for (let i = 0; i < a.tiles.length; i++) if (a.tiles[i] !== b.tiles[i]) tiles.push(i);
  return { money: b.money - a.money, pop: b.pop - a.pop, stats: a.stats !== b.stats, storage: a.storage !== b.storage, tiles };
};
const clean = (d) => d.money === 0 && d.pop === 0 && !d.stats && !d.storage && d.tiles.length === 0;
/* 研究呼叫一律經過 research()：前後快照必須逐字相同；期間 Math.random 0 次。 */
P.calls = P.calls || 0; P.dirty = P.dirty || [];
const research = (tag, fn) => {
  const a = snap(), mr = Math.random;
  let n = 0, out;
  Math.random = function () { n++; return mr.apply(this, arguments); };
  try { out = fn(); } finally { Math.random = mr; }
  const d = diff(a, snap());
  P.calls++;
  if (!clean(d) || n !== 0) P.dirty.push({ tag, random: n, money: d.money, pop: d.pop, stats: d.stats, storage: d.storage, tiles: d.tiles.slice(0, 8) });
  return out;
};
/* 原生工具動作：量出差異（哪幾格、哪些欄位、錢）並記下來。 */
P.native = P.native || [];
const nativeTool = (tag, tool, x, y) => {
  const a = snap();
  const why = GV.canPlaceTool(tool, x, y);
  const ok = why === null ? GV.place(tool, x, y) !== false : false;
  const b = snap(), d = diff(a, b);
  const fields = d.tiles.map((i) => { const p = JSON.parse(a.tiles[i]), q = JSON.parse(b.tiles[i]); return { i, keys: [...new Set([...Object.keys(p), ...Object.keys(q)])].filter((k) => JSON.stringify(p[k]) !== JSON.stringify(q[k])) }; });
  P.native.push({ tag, tool, x, y, why, ok, money: d.money, pop: d.pop, stats: d.stats, storage: d.storage, tiles: fields });
  return { why, ok };
};
`;

/* ---------- S01–S04、G01：開局、沙盒、兩個場景、相機（R 與 K 共用；K 不做研究呼叫） ---------- */
function pageSetup(A) {
  const out = { checks: [], fails: [] };
  const go = (id, fn) => { if (out.fails.length) return; try { const f = fn(); out.checks.push({ id, facts: f === undefined ? null : f }); } catch (e) { out.fails.push(id + ' ' + String((e && e.message) || e)); } };
  go('S01', () => {
    need(window.GV && typeof GV.newWorldSeeded === 'function', 'GV 沒有就緒');
    GV.setSpeed(0);
    // 地圖用原生可選的 108×108：72×72 的城長 60 天之後，水域與城區把空地切碎，兩個場景放不下（T787 施工記錄）。
    need(GV.setMapSize(A.mapSize) === A.mapSize, 'setMapSize ' + A.mapSize);
    need(GV.newWorldSeeded(A.seed) === true, 'newWorldSeeded');
    GV.observatoryReset514(); GV.fiscalReset515();
    GV.setSpeed(0); GV.ai(true);
    const days = BREAK === 'S01' ? 0 : A.days;
    for (let d = 0; d < days; d += 5) GV.step(5);
    GV.setSpeed(0); GV.ai(false);
    const st = GV.stats(), od = (GV.t468().assignment || {}).od || [];
    P.N = nOf();
    GV.save();
    const save = localStorage.getItem('glimmerville.v1.s3') || '';
    need(P.N === A.mapSize && st.day === A.days + 1 && st.pop > 0 && od.length > 0, '地圖 ' + A.mapSize + '、第 ' + (A.days + 1) + ' 天、有人口、原生 OD 有列', { N: P.N, day: st.day, pop: st.pop, od: od.length });
    return { day: st.day, pop: st.pop, money: st.money, odRows: od.length, N: P.N, save61: save };
  });
  go('S02', () => {
    const before = GV.stats();
    GV.addMoney(5000000);
    const c0 = window.confirm; window.confirm = () => true;
    let sandbox; try { sandbox = BREAK === 'S02' ? false : GV.enterSandbox516B(); } finally { window.confirm = c0; }
    need(sandbox === true && GV.setGod516B(true) === true && GV.setOverride516B('unlockAll', true) === true, '原生開發者沙盒沒有就緒');
    GV.setSpeed(0);
    const after = GV.stats();
    // 進沙盒＝原生存一份副本再讀進來；讀檔會重算人口（原生正規化），所以人口只記錄，天數必須不變。
    need(after.day === before.day, '進沙盒改了天數', { before: before.day, after: after.day });
    return { day: after.day, popBefore: before.pop, popAfter: after.pop };
  });
  const N = () => P.N, ix = (x, y) => y * P.N + x, at = (i) => [i % P.N, (i / P.N) | 0];
  /* 前綴和找一塊 w×h 的空陸地（外圍再留一格，不貼既有的路、軌、建築）。 */
  const findRect = (w, h, avoid) => {
    const n = N(), free = new Uint8Array(n * n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const t = GV.tile(x, y); free[ix(x, y)] = (t.t === 1 || t.t === 2) && !t.bld && !t.road && !t.rail && !t.tram && !t.dock && !t.ruin && !t.crater ? 1 : 0; }
    const S = new Int32Array((n + 1) * (n + 1));
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) S[(y + 1) * (n + 1) + x + 1] = free[ix(x, y)] + S[y * (n + 1) + x + 1] + S[(y + 1) * (n + 1) + x] - S[y * (n + 1) + x];
    const sum = (x, y, W, Hh) => S[(y + Hh) * (n + 1) + x + W] - S[y * (n + 1) + x + W] - S[(y + Hh) * (n + 1) + x] + S[y * (n + 1) + x];
    for (let y = 2; y + h + 1 < n; y++) for (let x = 2; x + w + 1 < n; x++) {
      if (avoid && x - 1 < avoid.x + avoid.w + 1 && avoid.x - 1 < x + w + 1 && y - 1 < avoid.y + avoid.h + 1 && avoid.y - 1 < y + h + 1) continue;
      if (sum(x - 1, y - 1, w + 2, h + 2) === (w + 2) * (h + 2)) return { x, y, w, h };
    }
    return null;
  };
  const L = (P.L = P.L || {});
  const place = (name, tool, x, y, k, sz) => {
    const err = GV.canPlaceTool(tool, x, y);
    need(err === null, name + '（' + tool + '）放不下 ' + x + ',' + y + '：' + err);
    GV.place(tool, x, y);
    const t = GV.tile(x, y);
    need(t && t.bld && t.bld.k === k && !t.bld.ref && (t.bld.sz || 1) === sz, name + ' 不是 k' + k + ' 的根格');
    L[name] = { x, y, k, sz, root: ix(x, y) };
  };
  const lay = (tool, cells) => { for (const [x, y] of cells) { GV.place(tool, x, y); need(GV.tile(x, y)[tool === 'road' ? 'road' : 'rail'], tool + ' 沒有鋪在 ' + x + ',' + y); } };
  go('S03', () => {
    const r = findRect(25, 11, null);
    need(r, '找不到 25×11 的空地');
    const ox = r.x, oy = r.y;
    P.freight = r;
    const roads = [], rails = [];
    for (let x = ox + 1; x <= ox + 8; x++) roads.push([x, oy + 4]);
    for (let x = ox + 9; x <= ox + 23; x++) rails.push([x, oy + 5]);
    lay('road', roads); lay('rail', rails);
    place('O', BREAK === 'S03' ? 'intermodalHub' : 'coldStorage', ox + 2, oy + 2, 168, 2); place('H1', 'intermodalHub', ox + 9, oy + 1, 166, 4);
    place('H2', 'intermodalHub', ox + 20, oy + 6, 166, 4); place('H3', 'intermodalHub', ox + 14, oy + 1, 166, 4);
    P.freightRail = rails.map(([x, y]) => ix(x, y));
    return { origin: [ox, oy], roads: roads.length, rails: rails.length, O: [L.O.x, L.O.y], H1: [L.H1.x, L.H1.y], H2: [L.H2.x, L.H2.y], H3: [L.H3.x, L.H3.y] };
  });
  go('S04', () => {
    const r = findRect(18, 13, P.freight);
    need(r, '找不到 18×13 的空地（不貼貨運場景）');
    const ox = r.x, oy = r.y;
    P.fscene = r;
    const roads = [], small = [], rails = [];
    for (let x = ox; x <= ox + 17; x++) roads.push([x, oy + 4]);
    for (let x = ox; x <= ox + 3; x++) rails.push([x, oy + 6]);
    for (let x = ox; x <= ox + 4; x++) small.push([x, oy + 12]);
    lay('road', roads); lay('rail', rails); lay('road', small);
    const put = (id, x, y) => { const err = GV.canPlaceTool(id, x, y); need(err === null, id + ' 放不下 ' + x + ',' + y + '：' + err); GV.place(id, x, y); const t = GV.tile(x, y); need(t && t.bld && !t.bld.ref, id + ' 沒有放成根格'); return { id, x, y, k: t.bld.k }; };
    const station = put(BREAK === 'S04' ? A.commerce[0].id : 'station', ox + 1, oy + 5);
    need(A.stationKs.includes(station.k), '車站的 k 不在 ' + JSON.stringify(A.stationKs), station);
    const commerce = A.commerce.slice().sort((p, q) => p.sz - q.sz);
    const shops = commerce.slice(0, 3).map((c, i) => put(c.id, ox + 5 + 4 * i, oy + 4 - c.sz));
    const iso = put(commerce[0].id, ox + 1, oy + 10);
    P.fRail = rails.map(([x, y]) => ix(x, y));
    P.F = { station, shops, iso };
    return { origin: [ox, oy], station, shops, iso };
  });
  go('G01', () => {
    const comp = (i) => { const m = GV.mobilityAt462(...at(i)); return m && m.kind === 'rail' ? m.component : -1; };
    const cf = [...new Set(P.freightRail.map(comp))], cs = [...new Set(P.fRail.map(comp))];
    const stationNear = (cells) => { const hit = []; for (const i of cells) { const [x, y] = at(i); for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const t = GV.tile(x + dx, y + dy); if (t && t.bld) { const b = t.bld.ref ? GV.tile(t.bld.ref[0], t.bld.ref[1]).bld : t.bld; if (b && A.stationKs.includes(b.k)) hit.push([x + dx, y + dy, b.k]); } } } return hit; };
    const freightStations = stationNear(P.freightRail), fStations = stationNear(P.fRail);
    const sameComp = cf[0] === (BREAK === 'G01' ? cf[0] : cs[0]);  // G01 破壞：拿貨運那段軌自己跟自己比
    need(cf.length === 1 && cf[0] >= 0 && cs.length === 1 && cs[0] >= 0 && !sameComp, '兩段軌不是兩個分開的原生連通分量', { cf, cs });
    need(freightStations.length === 0, '貨運那段軌旁邊有客運車站', freightStations);
    need(fStations.length > 0, 'F 的車站沒有貼在自己那段軌上', fStations);
    return { freightComponent: cf[0], fComponent: cs[0], fStations };
  });
  go('S05', () => {
    // 相機對準貨運場景中央（純渲染鏡頭；cam 會進存檔，所以 K 做一模一樣的事）
    GV.setZoom(1);
    const c = GV.lookAt(P.freight.x + 12, P.freight.y + 5);
    return { camera: c };
  });
  out.N = P.N;
  out.L = P.L;
  out.freight = P.freight; out.fscene = P.fscene;
  return out;
}

/* ---------- A–F：研究呼叫（只在 R） ---------- */
function pageScenarios(A) {
  const out = { checks: [], fails: [] };
  const go = (id, fn) => { if (out.fails.length) return; try { const f = fn(); out.checks.push({ id, facts: f === undefined ? null : f }); } catch (e) { out.fails.push(id + ' ' + String((e && e.message) || e)); } };
  const L = P.L, ix = (x, y) => y * P.N + x, at = (i) => [i % P.N, (i / P.N) | 0];
  const frontage = (b, kind) => { const list = []; for (let fy = 0; fy < b.sz; fy++) for (let fx = 0; fx < b.sz; fx++) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const x = b.x + fx + dx, y = b.y + fy + dy, t = GV.tile(x, y); if (t && t[kind] && !list.includes(ix(x, y))) list.push(ix(x, y)); } return list; };
  const isClean = () => P.dirty.length === 0;
  /* 情境層：開頭與結尾整份比。差異只准出在原生工具碰過的格子，而且那些格子結尾要回到開頭的樣子。 */
  const restored = (s0, tag) => {
    const s1 = snap(), d = diff(s0, s1);
    need(d.money === 0 && d.pop === 0 && !d.stats && !d.storage && d.tiles.length === 0, tag + ' 情境前後不是逐字相同（拆、鋪之後沒有回到原樣，或有別的改動）',
      { money: d.money, pop: d.pop, stats: d.stats, storage: d.storage, tiles: d.tiles.slice(0, 6).map((i) => ({ i, before: s0.tiles[i], after: s1.tiles[i] })) });
    return { scenarioIdentical: true };
  };

  go('A01', () => {
    const api = GV.roadDelivery053; P.sA = snap();
    const qty = 5, origin = BREAK === 'A01' ? L.H2.root : L.O.root;  // A01 破壞：H2 沒有路前接
    const r = research('A.startBetween', () => api.startBetween(origin, L.H1.root, { batchId: 't787-A', commodityId: 'food', qty: 5 }));
    need(r && r.ok === true, 'startBetween(O→H1) 失敗', r);
    const s0 = research('A.snapshot', () => api.snapshot());
    const roadOk = s0.path.every((i) => GV.tile(...at(i)).road), fo = frontage(L.O, 'road'), fh = frontage(L.H1, 'road');
    need(roadOk && fo.includes(s0.path[0]) && fh.includes(s0.path[s0.path.length - 1]), '路線不是 O 前接→H1 前接的真路', { path: s0.path.map(at) });
    let s = s0; const seen = [];
    for (let k = 0; k < 40 && s.status !== 'DELIVERED'; k++) { s = research('A.step', () => api.step()).snapshot; seen.push(s.status); }
    need(s.status === 'DELIVERED' && s.qty === qty, '沒有走到 DELIVERED 或數量變了', { status: s.status, qty: s.qty });
    research('A.end', () => api.end());
    if (BREAK === 'A02') research('A.break', () => GV.addMoney(1));
    return { steps: seen.length, statuses: [...new Set(seen)], path: s0.path.map(at), qty: s.qty };
  });
  go('A02', () => { need(isClean(), 'A 的研究呼叫改了正式狀態或用了 Math.random', P.dirty); return Object.assign({ researchCalls: P.calls }, restored(P.sA, 'A')); });

  go('B01', () => {
    const api = GV.railFreight054; P.sB = snap();
    const dest = BREAK === 'B01' ? L.O.root : L.H2.root;  // B01 破壞：O 是冷藏庫，不是 k166
    const r = research('B.runBetween', () => api.runBetween(L.H1.root, dest, { batchId: 't787-B', commodityId: 'steel', qty: 9 }));
    need(r && r.ok === true, 'runBetween(H1→H2) 失敗', r);
    const s0 = research('B.snapshot', () => api.snapshot());
    need(s0.path.every((i) => GV.tile(...at(i)).rail) && frontage(L.H1, 'rail').includes(s0.path[0]) && frontage(L.H2, 'rail').includes(s0.path[s0.path.length - 1]), '路線不是 H1 貼軌→H2 貼軌的真軌', { path: s0.path.map(at) });
    let s = s0; const seen = [];
    for (let k = 0; k < 40 && s.status !== 'ARRIVED'; k++) { s = research('B.step', () => api.step()).snapshot; seen.push(s.status); }
    need(s.status === 'ARRIVED', '沒有到站', s.status);
    const u = research('B.unload', () => api.unload());
    const want = 9;
    need(u.ok === true && u.snapshot.status === 'UNLOADED' && u.snapshot.qty === want, 'unload 後不是 UNLOADED 或數量變了', { ok: u.ok, status: u.snapshot && u.snapshot.status, qty: u.snapshot && u.snapshot.qty });
    research('B.end', () => api.end());
    if (BREAK === 'B02') research('B.break', () => Math.random());
    return { steps: seen.length, path: s0.path.map(at), qty: u.snapshot.qty };
  });
  go('B02', () => { need(isClean(), 'B 的研究呼叫改了正式狀態或用了 Math.random', P.dirty); return Object.assign({ researchCalls: P.calls }, restored(P.sB, 'B')); });

  let C = null;
  go('C01', () => {
    const B = GV.railBlock055, rail = P.freightRail, A0 = rail[0], Z = rail[rail.length - 1]; P.sC = snap();
    const s1 = research('C.spawn1', () => B.spawn('t1', A0, Z, { batchId: 't787-C1', qty: 8, commodityId: 'food' }, 12));
    const s2 = research('C.spawn2', () => B.spawn('t2', Z, A0, { batchId: 't787-C2', qty: 6 }, 12));
    need(s1.ok && s2.ok && s1.path.every((i) => GV.tile(...at(i)).rail), '兩列沒有沿真軌登記成功', { s1: s1.ok, s2: s2.ok });
    let r1, r2;
    if (BREAK === 'C01') { r2 = research('C.request2', () => B.request('t2')); r1 = research('C.request1', () => B.request('t1')); }  // C01 破壞：t2 先要路權
    else { r1 = research('C.request1', () => B.request('t1')); r2 = research('C.request2', () => B.request('t2')); }
    const w = research('C.advanceWaiting', () => B.advance('t2'));
    need(r1.status === 'GRANTED' && r2.status === 'WAITING' && w.ok === false && w.reason === 'no-authority', '不是一列走、一列等', { r1: r1.status, r2: r2.status, w: w.reason });
    for (let k = 0; k < 4; k++) research('C.advance1', () => B.advance('t1'));
    const t1 = research('C.snapshot', () => B.snapshot()).trains.find((t) => t.id === 't1');
    need(t1.cursor === 4 && t1.status === 'RUNNING', '第一列沒有前進四格', t1);
    C = { B, A0, Z, cut: t1.next };
    return { line: [at(A0), at(Z)], t1Cursor: t1.cursor, cut: at(C.cut) };
  });
  go('C02', () => {
    const [cx, cy] = at(C.cut);
    const dz = nativeTool('C.doze', 'doze', cx, cy);
    need(dz.why === null && dz.ok && !GV.tile(cx, cy).rail, '原生拆除工具沒有拆掉那格真軌', dz);
    if (BREAK === 'C02') { GV.place('rail', cx, cy); }
    const tries = [0, 1, 2].map(() => research('C.advanceBroken', () => C.B.advance('t1')));
    need(tries.every((r) => r.ok === false && r.reason === 'track-broken' && r.tile === C.cut), '前方真軌被拆，列車沒有停住回 track-broken', tries.map((r) => r.reason));
    const t1 = research('C.snapshot', () => C.B.snapshot()).trains.find((t) => t.id === 't1');
    need(t1.cursor === 4, '斷軌期間列車漂移', t1.cursor);
    return { cut: [cx, cy], reasons: tries.map((r) => r.reason) };
  });
  go('C03', () => {
    const [cx, cy] = at(C.cut);
    const rl = BREAK === 'C03' ? { why: 'break', ok: false } : nativeTool('C.relay', 'rail', cx, cy);
    need(rl.why === null && rl.ok && GV.tile(cx, cy).rail, '原生鐵軌工具沒有把那格鋪回', rl);
    const r = research('C.advanceResumed', () => C.B.advance('t1'));
    need(r.ok === true && r.moved === true, '鋪回之後第一列沒有繼續', r);
    return { resumed: r.moved };
  });
  go('C04', () => {
    if (BREAK === 'C04') research('C.break', () => C.B.abort('t2', 'probe-break'));  // C04 破壞：等待的那列先取消
    let r = null;
    for (let k = 0; k < 40; k++) { r = research('C.drive1', () => C.B.advance('t1')); if (!r.ok || r.arrived) break; }
    const s = research('C.snapshot', () => C.B.snapshot());
    need(r && r.arrived === true && r.granted === 't2' && s.holder === 't2', '第一列到站後路權沒有照 FIFO 交給第二列', { arrived: r && r.arrived, granted: r && r.granted, holder: s.holder });
    let r2 = null;
    for (let k = 0; k < 40; k++) { r2 = research('C.drive2', () => C.B.advance('t2')); if (!r2.ok || r2.arrived) break; }
    const s2 = research('C.snapshot', () => C.B.snapshot());
    need(r2 && r2.arrived === true && s2.holder === null, '第二列沒有跑完', { arrived: r2 && r2.arrived, holder: s2.holder });
    research('C.end', () => C.B.end());
    if (BREAK === 'C05') nativeTool('C.extra', 'road', at(C.cut)[0], at(C.cut)[1] + 1);  // C05 破壞：軌道下方多鋪一格路，沒有復原
    return { handoff: r.granted, t2Arrived: r2.arrived };
  });
  go('C05', () => {
    need(isClean(), 'C 的研究呼叫改了正式狀態或用了 Math.random', P.dirty);
    const doze = P.native.find((e) => e.tag === 'C.doze'), relay = P.native.find((e) => e.tag === 'C.relay');
    need(doze && relay && doze.tiles.some((f) => f.i === C.cut) && relay.tiles.some((f) => f.i === C.cut), '原生工具動作沒有量到那一格', { doze: doze && doze.tiles, relay: relay && relay.tiles });
    return Object.assign({ doze: { money: doze.money, tiles: doze.tiles }, relay: { money: relay.money, tiles: relay.tiles } }, restored(P.sC, 'C'));
  });

  let D = null;
  go('D01', () => {
    const Lg = GV.singleResearch052; P.sD = snap();
    const d = BREAK === 'D01' ? { ok: true, sessionId: null } : research('D.demo', () => Lg.demo());  // D01 破壞：沒有開帳
    need(d && d.ok === true, '052 demo() 失敗', d);
    const led0 = research('D.ledger', () => Lg.snapshot()).ledger, b = led0 && led0.batches.find((x) => x.batchId === 'batch-A');
    need(b && b.state === 'SOURCE_READY' && b.owner === 'research-source' && b.qty === 7, 'demo 的 batch-A 不對', b);
    D = { Lg };
    return { sessionId: d.sessionId, batchA: { state: b.state, owner: b.owner, qty: b.qty } };
  });
  go('D02', () => {
    const api = GV.intermodal057;
    const trip = { batchId: 'batch-A', originCustodian: 'research-source', destinationCustodian: 'research-receiver', roadFrom: L.O.root, roadTo: BREAK === 'D02' ? L.H2.root : L.H1.root, railFrom: L.H1.root, railTo: L.H2.root };  // D02 破壞：H2 沒有路
    const s = research('D.start', () => api.start(trip));
    need(s && s.ok === true && s.status === 'ROAD' && s.qty === 7, 'start 失敗', s);
    let r = null, k = 0;
    for (; k < 60; k++) { r = research('D.advance', () => api.advance()); if (!r.ok || r.snapshot.status !== 'ROAD') break; }
    need(r && r.ok && (r.snapshot.status === 'INTERCHANGE' || r.snapshot.status === 'RAIL'), '沒有走到轉運點', r && r.snapshot && r.snapshot.status);
    if (r.snapshot.status === 'INTERCHANGE') r = research('D.advance', () => api.advance());
    need(r.ok && r.authority === 'GRANTED' && r.snapshot.status === 'RAIL', '轉運點沒有拿到路權', r);
    research('D.advance', () => api.advance()); research('D.advance', () => api.advance());
    const ls = research('D.rail054', () => GV.railFreight054.snapshot());
    const cut = ls.path[ls.cursor + 1], [cx, cy] = at(cut);
    const dz = nativeTool('D.doze', 'doze', cx, cy);
    need(dz.why === null && dz.ok, '原生拆除工具沒有拆掉轉運後的那格軌', dz);
    const br = research('D.advanceBroken', () => api.advance());
    need(br.ok === false && br.reason === 'track-broken' && br.tile === cut, '斷軌沒有擋住聯運列車', br);
    const rl = nativeTool('D.relay', 'rail', cx, cy);
    need(rl.why === null && rl.ok, '原生鐵軌工具沒有鋪回', rl);
    for (let n = 0; n < 60; n++) { r = research('D.advance', () => api.advance()); if (!r.ok || r.delivered) break; }
    need(r && r.ok === true && r.delivered === true, '沒有到站交付', r);
    D.cut = cut;
    D.handoff = r.handoff;
    return { roadSteps: k, cut: [cx, cy], handoff: r.handoff && { ok: r.handoff.ok, type: r.handoff.type, revision: r.handoff.revision } };
  });
  go('D03', () => {
    if (BREAK === 'D03') {  // D03 破壞：到站後用 052 自己的指令把 batch-A 凍結（HELD → FROZEN）
      const fz = research('D.break', () => { const l = D.Lg.snapshot().ledger, x = l.batches.find((q) => q.batchId === 'batch-A');
        return D.Lg.command({ eventId: 'probe787-break-freeze', sessionId: l.sessionId, batchId: 'batch-A', type: 'FREEZE', expectedRevision: l.revision, payload: { owner: x.owner, location: x.location, reason: 'probe787-break' } }); });
      need(fz && fz.ok === true, 'PROBE_BREAK=D03 的凍結指令沒有寫進帳', fz);
    }
    const led = research('D.ledgerAfter', () => D.Lg.snapshot()).ledger, a = led.batches.find((x) => x.batchId === 'batch-A');
    need(a && a.state === 'HELD' && a.owner === 'research-receiver' && a.qty === 7 && led.conservation.ok === true && led.conservation.accounted === 20, '到站後 batch-A 不是 HELD／數量或守恆不對', { a, conservation: led.conservation });
    need(isClean(), 'D 的研究呼叫改了正式狀態或用了 Math.random', P.dirty);
    const s = research('D.snapshot', () => GV.intermodal057.snapshot());
    need(s.status === 'DELIVERED', '聯運快照不是 DELIVERED', s.status);
    return Object.assign({ batchA: { state: a.state, owner: a.owner, qty: a.qty }, conservation: led.conservation }, restored(P.sD, 'D'));
  });

  go('E01', () => {
    P.sE = snap();
    eval(A.core056);
    const M = globalThis.passengerDemand056;
    need(M && typeof M.summarizeDemand === 'function', '056 核心沒有載入');
    const t = research('E.t468', () => GV.t468()), a = t.assignment || {};
    const od = BREAK === 'E01' ? [] : (Array.isArray(a.od) ? a.od : []);
    const sumTrips = od.reduce((s, r) => s + (+r.trips), 0);
    const tenth = od.every((r) => ['trips', 'walk', 'transit', 'car', 'bike', 'unserved'].every((k) => r[k] === undefined || Math.abs((+r[k]) * 10 - Math.round((+r[k]) * 10)) < 1e-6));
    need(od.length > 0 && sumTrips > 0 && tenth && Math.abs(sumTrips - a.totalTrips) <= 0.05 * (od.length + 1), 'E0 前提不成立', { rows: od.length, sumTrips, totalTrips: a.totalTrips, tenth });
    P.E = { M, od, sumTrips, totalTrips: a.totalTrips };
    return { rows: od.length, sumTrips: +sumTrips.toFixed(4), totalTrips: a.totalTrips, diff: +(sumTrips - a.totalTrips).toFixed(4), bound: 0.05 * (od.length + 1), oneDecimal: tenth };
  });
  go('E02', () => {
    const tol = BREAK === 'E02' ? 0.05 : 0.3;
    const s = research('E.summarize', () => P.E.M.summarizeDemand(P.E.od, { maxRows: 5000, rowTolerance: tol }));
    need(s.ok === true && s.conserved === true && s.truncated === false && s.rows.every((r) => r.unservedSource === 'native'), 'rowTolerance 0.3 下 056 沒有接受原生 OD', { ok: s.ok, reason: s.reason, detail: s.detail });
    P.E.s = s;
    return { rows: s.rowCount, totals: s.totals, conserved: s.conserved };
  });
  go('E03', () => {
    const res = P.E.od.map((r) => Math.abs((+r.walk) + (+r.transit) + (+r.car) + (+(r.bike || 0)) + (+(r.unserved || 0)) - (+r.trips)));
    const max = res.reduce((m, v) => Math.max(m, v), 0), over = res.filter((v) => v > 1e-6).length;
    need(max <= (BREAK === 'E03' ? 0.01 : 0.3) + 1e-9, '逐列殘差超過 0.3', { max });
    P.E.max = max;
    return { maxResidual: +max.toFixed(6), rowsWithResidual: over };
  });
  go('E04', () => {
    if (!(P.E.max > 1e-6)) return { control: '不適用（最大殘差 ≤ 1e-6）' };
    const s = research('E.strict', () => P.E.M.summarizeDemand(P.E.od, BREAK === 'E04' ? { maxRows: 5000, rowTolerance: 0.3 } : { maxRows: 5000 }));
    need(s.ok === false && s.reason === 'nonconserved', '不給 rowTolerance 時沒有回 nonconserved', { ok: s.ok, reason: s.reason });
    need(isClean(), 'E 的研究呼叫改了正式狀態或用了 Math.random', P.dirty);
    return Object.assign({ strict: { ok: s.ok, reason: s.reason, detail: s.detail } }, restored(P.sE, 'E'));
  });

  go('F01', () => {
    P.sF = snap();
    eval(A.core057);
    const M = globalThis.shadowVisits057;
    need(M && typeof M.computeShadowVisits === 'function', '057 到訪核心沒有載入');
    const stations = [], shops = [], ks = A.commerce.map((c) => c.k), sks = BREAK === 'F01' ? [999] : A.stationKs;  // F01 破壞：車站的 k 認錯
    for (let y = 0; y < P.N; y++) for (let x = 0; x < P.N; x++) {
      const t = GV.tile(x, y);
      if (!t || !t.bld || t.bld.ref) continue;
      if (sks.includes(t.bld.k)) stations.push({ id: 'k' + t.bld.k + '@' + x + ',' + y, x, y, demand: 100 });
      else if (ks.includes(t.bld.k)) shops.push({ id: 'k' + t.bld.k + '@' + x + ',' + y, k: t.bld.k, x, y, attract: 1 });
    }
    need(stations.length >= 1 && shops.length >= 4, '同城掃不到車站或 4 家高街商店', { stations: stations.length, shops: shops.length });
    P.Fv = { M, stations, shops };
    return { stations: stations.map((s) => s.id), shops: shops.map((s) => s.id) };
  });
  go('F02', () => {
    const memo = new Map();
    const walk = (x1, y1, x2, y2) => { const key = x1 + ',' + y1 + '>' + x2 + ',' + y2; if (!memo.has(key)) memo.set(key, GV.path502(x1, y1, x2, y2, 'walk')); return memo.get(key); };
    const radius = BREAK === 'F02' ? 1 : A.radius;
    const real = research('F.visits', () => P.Fv.M.computeShadowVisits({ radius, stations: P.Fv.stations, shops: P.Fv.shops, walkDistance: walk }));
    need(real.ok === true, '真場景跑模型失敗', real.reason);
    const main = P.F.shops.map((s) => real.rows.find((r) => r.x === s.x && r.y === s.y));
    const iso = real.rows.find((r) => r.x === P.F.iso.x && r.y === P.F.iso.y);
    need(main.every((r) => r && !r.isolated && r.visits > 0), '接主路的商店應該連得上', main);
    need(iso && iso.isolated === true, '不連通小路上的商店應該隔離', iso);
    need(isClean(), 'F 的研究呼叫改了正式狀態或用了 Math.random', P.dirty);
    restored(P.sF, 'F');
    return { radius: real.radius, distanceSource: real.distanceSource, connected: main.map((r) => ({ id: r.id, visits: r.visits })), isolated: { id: iso.id, connected: iso.connected }, totals: real.totals };
  });
  out.researchCalls = P.calls;
  out.dirty = P.dirty;
  out.native = P.native.map((e) => ({ tag: e.tag, tool: e.tool, x: e.x, y: e.y, ok: e.ok, money: e.money, pop: e.pop, stats: e.stats, storage: e.storage, tiles: e.tiles }));
  out.cuts = { C: C && C.cut, D: D && D.cut };
  return out;
}

/* ---------- K：同樣的原生動作（拆、鋪），不做研究呼叫 ---------- */
function pageControlNative(A) {
  const at = (i) => [i % P.N, (i / P.N) | 0];
  const res = [];
  for (const [tag, i] of [['C', A.cuts.C], ['D', A.cuts.D]]) {
    const [x, y] = at(i);
    res.push(nativeTool(tag + '.doze', 'doze', x, y));
    if (!(A.skipLastRelay && tag === 'D')) res.push(nativeTool(tag + '.relay', 'rail', x, y));
  }
  return { native: P.native.map((e) => ({ tag: e.tag, ok: e.ok, money: e.money, tiles: e.tiles })) };
}

/* ---------- H3：再推進 5 天、取樣（R 與 K） ---------- */
function pageAdvance(A) {
  GV.setSpeed(0);
  GV.step(A.more);
  GV.setSpeed(0);
  // 沙盒裡存檔寫的是 SAVEKEY.sN.sandbox516b（原生「Sidecar fork: normal SAVEKEY.sN is never overwritten」），不是正常的 s3。
  // 量出這次存檔真的寫了哪個鍵：只准是沙盒鍵（加它的 _bak 備份），正常存檔一字不變；比的就是沙盒鍵的內容。
  const normal = 'glimmerville.v1.s3', fork = normal + '.sandbox516b';
  const before = storageAll();
  GV.save();
  const after = storageAll();
  const changed = Object.keys(after).filter((k) => after[k] !== before[k]).sort();
  need(changed.length >= 1 && changed.every((k) => k === fork || k === fork + '_bak') && changed.includes(fork), '這次存檔寫的不是沙盒鍵', changed);
  need(after[normal] === before[normal], '沙盒裡的存檔改寫了正常存檔');
  const save = after[fork] || '';
  const out = { save, saveKey: fork, changedKeys: changed, day: GV.stats().day,
    atStep: { stats: JSON.stringify(GV.stats()), t462: JSON.stringify(GV.t462()), t468: JSON.stringify(GV.t468()) } };
  // 畫面車輛（cars／buses）逐幀生成、不進存檔；它們跑在路上改的 roadLoad／roadPass 也是執行期狀態（原生註解：
  // newWorld()/load() 尾端一併歸零）。兩個 session 跑過的幀數不同，推進後立刻取的 stats／t462／t468 就可能不同。
  // 所以存檔在推進後立刻比；stats、t462、t468 在兩邊都把剛存的同一份檔讀回來之後再比；立刻取的那份只記錄差異。
  need(GV.load() === true, '讀回剛存的檔失敗');
  GV.setSpeed(0);
  out.stats = JSON.stringify(GV.stats()); out.t462 = JSON.stringify(GV.t462()); out.t468 = JSON.stringify(GV.t468());
  return out;
}

/* ---------- 頁面能力檢查（C0）：頁面自己抓 index.html 算雜湊 ---------- */
const PAGE_HASH = `(async () => { const r = await fetch(location.pathname.endsWith('/') ? location.pathname + 'index.html' : location.pathname, { cache: 'no-store' }); const b = await r.arrayBuffer(); const d = await crypto.subtle.digest('SHA-256', b); return { bytes: b.byteLength, sha256: [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, '0')).join(''), url: location.href }; })()`;

const run = (cdp, fn, arg) => cdp.evalJs('(() => {' + PAGE_LIB + 'return (' + fn.toString() + ')(' + JSON.stringify(arg === undefined ? null : arg) + ');})()');

async function shot(cdp, name, receipts) {
  if (!SHOTS) return;
  const png = await cdp.send('Page.captureScreenshot', { format: 'png' });
  const bytes = Buffer.from(png.data, 'base64');
  const dir = path.join(H.ROOT, SHOTS);
  fs.mkdirSync(dir, { recursive: true });
  const file = name + '.png';
  fs.writeFileSync(path.join(dir, file), bytes);
  receipts.push({ file: path.join(SHOTS, file), sha256: hash(bytes), bytes: bytes.length });
}

(async () => {
  const report = { ok: false, fails: [], break: BREAK || null, port: PORT, seed: SEED, days: DAYS, mapSize: MAP_SIZE, gitHead, indexSha256: hash(INDEX), indexBytes: Buffer.byteLength(INDEX) };
  const firstFail = (list) => { for (const f of list) { report.fails.push(f); return true; } return false; };
  const A = { seed: SEED, days: DAYS, mapSize: MAP_SIZE, stationKs: STATION_KS, commerce: COMMERCE, radius: WALK_RADIUS, core056: CORE056, core057: CORE057, more: 5 };
  const receipts = [];
  let R = null;
  const rs = await H.withGame({ port: PORT, timeout: 900, fresh: true, log: () => {} }, async ({ cdp }) => {
    const served = await cdp.evalJs(PAGE_HASH);
    report.C0 = { served, file: { sha256: report.indexSha256, bytes: report.indexBytes }, gitHead, expect: EXPECT || null };
    const expect = BREAK === 'C0' ? '0'.repeat(64) : EXPECT;
    if (served.sha256 !== report.indexSha256 || (expect && served.sha256 !== expect)) { report.fails.push('C0 被服務的 index.html 不是預期的候選：' + JSON.stringify({ served: served.sha256, file: report.indexSha256, expect: expect || null })); return null; }
    const setup = await run(cdp, pageSetup, A);
    report.R = { setup: setup.checks.map((c) => ({ id: c.id, facts: c.id === 'S01' ? Object.assign({}, c.facts, { save61: hash(c.facts.save61), save61Bytes: c.facts.save61.length }) : c.facts })) };
    if (firstFail(setup.fails)) return null;
    const save61 = setup.checks.find((c) => c.id === 'S01').facts.save61;
    const sc = await run(cdp, pageScenarios, A);
    report.R.scenarios = sc.checks;
    report.R.researchCalls = sc.researchCalls; report.R.native = sc.native; report.R.dirty = sc.dirty;
    if (firstFail(sc.fails)) return null;
    // I01-a：D 到站那一刻（相機不動、只打開 057 面板拍，再關掉）
    if (SHOTS) {
      await cdp.evalJs('GV.intermodal057.open();GV.forceDraw();true');
      await shot(cdp, 'D-arrival-desktop', receipts);
      await cdp.evalJs('(()=>{const p=document.getElementById("lab057Panel");if(p)p.remove();return true;})()');
    }
    const adv = await run(cdp, pageAdvance, A);
    // I01-b：H3 取樣之後才動相機與視窗
    if (SHOTS) {
      const cx = Math.round((setup.freight.x + 12 + setup.fscene.x + 10) / 2), cy = Math.round((setup.freight.y + 5 + setup.fscene.y + 6) / 2);
      await cdp.evalJs(`(()=>{GV.setZoom(0.5);GV.lookAt(${cx},${cy});GV.forceDraw();return true;})()`);
      await shot(cdp, 'scene-overview-desktop', receipts);
      await cdp.evalJs('["roadDelivery053","railFreight054","railBlock055","intermodal057"].forEach(k=>GV[k].open());GV.forceDraw();true');
      await shot(cdp, 'panels-desktop', receipts);
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 1, mobile: true });
      await cdp.evalJs('GV.forceDraw();true');
      await shot(cdp, 'panels-390x780', receipts);
      await cdp.send('Emulation.clearDeviceMetricsOverride', {});
      await cdp.evalJs('(()=>{for(const id of ["lab053Panel","lab054Panel","lab055Panel","lab057Panel"]){const p=document.getElementById(id);if(p)p.remove();}return true;})()');
      await cdp.evalJs(`(()=>{GV.setZoom(1);GV.lookAt(${setup.fscene.x + 10},${setup.fscene.y + 6});GV.forceDraw();return true;})()`);
      if (BREAK !== 'I01') await shot(cdp, 'F-station-highstreet-desktop', receipts);  // I01 破壞：少拍一張
    }
    return { save61, adv, cuts: sc.cuts, errors: cdp.errors.slice(0, 5) };
  });
  R = rs && rs.result;
  if (!rs || !rs.ok) report.fails.push('R session failed ' + JSON.stringify(rs && rs.fails).slice(0, 400));
  if (!report.fails.length && R) {
    if (R.errors && R.errors.length) report.fails.push('R console 錯誤 ' + JSON.stringify(R.errors));
    const ks = await H.withGame({ port: PORT, timeout: 900, fresh: true, log: () => {} }, async ({ cdp }) => {
      const setup = await run(cdp, pageSetup, BREAK === 'H0' ? Object.assign({}, A, { seed: A.seed + 1 }) : A);  // H0 破壞：對照換種子
      if (setup.fails.length) return { fails: setup.fails };
      const save61 = setup.checks.find((c) => c.id === 'S01').facts.save61;
      const nat = await run(cdp, pageControlNative, { cuts: R.cuts, skipLastRelay: BREAK === 'H3' });  // H3 破壞：對照少鋪回一格
      const adv = await run(cdp, pageAdvance, A);
      return { save61, nat, adv, errors: cdp.errors.slice(0, 5) };
    });
    const K = ks && ks.result;
    if (!ks || !ks.ok || !K || K.fails) report.fails.push('K session failed ' + JSON.stringify((K && K.fails) || (ks && ks.fails)).slice(0, 400));
    else {
      report.K = { native: K.nat.native, save61: hash(K.save61), day: K.adv.day };
      if (R.save61 !== K.save61) report.fails.push('H0 兩個 session 第 61 天的存檔不同：開局不決定');
      if (!report.fails.length) {
        const same = ['save', 'stats', 't462', 't468'].filter((k) => R.adv[k] !== K.adv[k]);
        const keyDiff = (x, y) => { const a = JSON.parse(x), b = JSON.parse(y); return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])).map((k) => ({ k, R: JSON.stringify(a[k]).slice(0, 120), K: JSON.stringify(b[k]).slice(0, 120) })); };
        const atStepPart = (k) => { if (R.adv.atStep[k] === K.adv.atStep[k]) return null; let i = 0; const x = R.adv.atStep[k], y = K.adv.atStep[k]; while (i < x.length && x[i] === y[i]) i++;
          return { part: k, keys: keyDiff(x, y).map((q) => q.k), at: i, R: x.slice(Math.max(0, i - 200), i + 120), K: y.slice(Math.max(0, i - 200), i + 120) }; };
        const atStep = ['stats', 't462', 't468'].map(atStepPart).filter(Boolean);
        const firstDiff = (x, y) => { let i = 0; while (i < x.length && x[i] === y[i]) i++; return { at: i, lengths: [x.length, y.length], R: x.slice(Math.max(0, i - 160), i + 160), K: y.slice(Math.max(0, i - 160), i + 160) }; };
        report.H3 = { day: R.adv.day, saveKey: R.adv.saveKey, changedKeys: R.adv.changedKeys, saveSha256: hash(R.adv.save), saveBytes: R.adv.save.length, differs: same, atStepDiffers: atStep,
          detail: same.map((k) => ({ part: k, keys: k === 'save' ? null : keyDiff(R.adv[k], K.adv[k]).map((q) => q.k), first: firstDiff(R.adv[k], K.adv[k]) })) };
        if (same.length) report.fails.push('H3 推進 5 天之後兩邊不同：' + same.join(','));
      }
    }
  }
  report.I01 = receipts;
  if (SHOTS && !report.fails.length && receipts.length !== 5) report.fails.push('I01 原圖不是 5 張：' + receipts.length);
  report.ok = report.fails.length === 0;
  console.log('ACCEPT787 ' + JSON.stringify(report, null, 1));
  console.log('ACCEPT787 RESULT ' + (report.ok ? 'PASS' : 'FAIL') + (report.fails[0] ? '  首紅：' + report.fails[0].slice(0, 160) : ''));
  process.exitCode = report.ok ? 0 : 1;
})().catch((e) => { console.error('ACCEPT787 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });

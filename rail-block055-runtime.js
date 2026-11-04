/* DSK-020 / LAB-06（T784 補齊）：單線閉塞區間的路權、等待與斷軌恢復（執行期接線）。
 * 會被原封不動內嵌進 index.html（DSK-020 RAIL BLOCK 055 區塊）。
 *
 * 登記：spawn() 用 LAB-05 的 `GV.railFreight054.plan(from, to)` 規劃路線（唯讀）；
 * spawnFor054() 替 LAB-05 目前那一列任務登記（路線、批次、數量、容量都取那一列，T785 LAB-07 用）；
 * 只有這樣登記過的列車能要路權。這裡不建立、不推進 LAB-05 自己那一列的任務，兩列車與路權由這裡管。
 *
 * 斷軌一律讀真地格（原卡定義）：列車每次要前進，先讀前方那一格的 `tiles[i].rail`；
 * 沒軌 → track-broken，列車留在原地；那格重新有軌（原生鐵軌工具鋪回）就能繼續。沒有手動斷軌旗標。
 *
 * 路權：單一閉塞區間，最多兩列同時在冊（READY／RUNNING）；第一列走、第二列 FIFO 等。
 * 到站或中止的列車自動讓出名額與路權；路上 release 回 still-running。
 *
 * 邊界：只讀鐵軌格；不寫金錢／商品／人口／客流／存檔；沒有亂數、沒有現實時間。
 * 讀檔、開新城、pagehide、end() 清掉所有列車、等待隊列與斷軌狀態，並移除面板。
 * 逃生閥：window.__noRailBlock055。開著時所有變更動作回 disabled；安裝當下就開著 → 整段不安裝
 *（不改寫 load／newWorld、不掛 pagehide），只留一律回 disabled 的介面。
 */
(function installRailBlock055() {
  'use strict';
  const RS = Object.freeze({
    BAD_INPUT: 'bad-input', BAD_ROUTE: 'bad-route', TOO_MANY: 'too-many', DUPLICATE: 'duplicate',
    UNKNOWN_TRAIN: 'unknown-train', FINISHED: 'already-finished', NOT_HOLDER: 'not-holder',
    STILL_RUNNING: 'still-running', NO_AUTHORITY: 'no-authority', TRACK_BROKEN: 'track-broken',
    OVER_CAPACITY: 'over-capacity', NO_PLANNER: 'rail-freight-unavailable', REAL_TILES_ONLY: 'real-tiles-only',
    NO_RUN054: 'no-run054', DISABLED: 'disabled'
  });
  const MAX_TRAINS = 2;
  const DEFAULT_CAPACITY = 12;
  const UNSAVED = '未保存：重新整理或讀檔就會消失';
  const PROVENANCE = {
    module: 'rail-block055', lab: 'LAB-06', card: 'T784', isolation: 'shadow-only', maxTrains: MAX_TRAINS,
    brokenSource: 'tiles[i].rail', planner: 'GV.railFreight054.plan', panel: 'left-slot-2'
  };
  const disabled = () => ({ ok: false, reason: RS.DISABLED, disabled: true });

  if (window.__noRailBlock055) {
    const emptySnapshot = () => ({
      ok: false, reason: RS.DISABLED, disabled: true, installed: false, maxTrains: MAX_TRAINS, active: 0,
      holder: null, waiting: [], broken: [], trains: []
    });
    window.GV.railBlock055 = Object.freeze({
      reasons: RS, spawn: disabled, spawnFor054: disabled, request: disabled, release: disabled, advance: disabled, abort: disabled,
      breakTile: disabled, repairTile: disabled, snapshot: emptySnapshot, open: disabled, refresh: disabled,
      end: disabled, disable: disabled,
      provenance: Object.freeze(Object.assign({}, PROVENANCE, { installed: false }))
    });
    return;
  }

  const off = () => !!window.__noRailBlock055;
  const isActive = (t) => t.status === 'READY' || t.status === 'RUNNING';
  const validId = (v) => typeof v === 'string' && v.length > 0;
  let holder = null;
  const waiting = [];
  const trains = new Map();
  let panel = null, panelBody = null;

  const inGrid = (i) => Number.isInteger(i) && i >= 0 && i < N * N;
  const hasRail = (i) => inGrid(i) && !!(tiles && tiles[i] && tiles[i].rail);
  const at = (i) => ({ x: i % N, y: (i / N) | 0 });
  const activeCount = () => { let n = 0; for (const t of trains.values()) if (isActive(t)) n++; return n; };
  const planner = () => {
    const g = window.GV, p = g && g.railFreight054;
    return p && typeof p.plan === 'function' ? p : null;
  };

  function routeOk(path) {
    if (!Array.isArray(path) || path.length === 0) return false;
    for (let k = 0; k < path.length; k++) {
      if (!hasRail(path[k])) return false;
      if (k > 0) {
        const a = at(path[k - 1]), b = at(path[k]);
        if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) return false;
      }
    }
    return true;
  }
  /* 只看形狀（在圖內、逐格相鄰），不看有沒有軌；spawnFor054 用它把「路線壞了」和「軌被拆了」分開。 */
  function routeShapeOk(path) {
    if (!Array.isArray(path) || path.length === 0) return false;
    for (let k = 0; k < path.length; k++) {
      if (!inGrid(path[k])) return false;
      if (k > 0) {
        const a = at(path[k - 1]), b = at(path[k]);
        if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) return false;
      }
    }
    return true;
  }

  function trainView(t) {
    const next = isActive(t) && t.cursor < t.path.length - 1 ? t.path[t.cursor + 1] : null;
    return {
      id: t.id, status: t.status,
      authority: holder === t.id ? 'holder' : (waiting.includes(t.id) ? 'waiting' : null),
      cursor: t.cursor, pathLength: t.path.length, steps: t.steps,
      from: t.path[0], to: t.path[t.path.length - 1], at: t.path[t.cursor], next,
      blockedTile: t.blockedTile, qty: t.qty, capacity: t.capacity, batchId: t.batchId,
      commodityId: t.commodityId, abortReason: t.abortReason, run054: t.run054
    };
  }

  /* 斷軌狀態不另存：每次都從在冊列車前方的路線格讀真地格。 */
  function brokenTiles() {
    const seen = new Set();
    for (const t of trains.values()) {
      if (!isActive(t)) continue;
      for (let k = t.cursor + 1; k < t.path.length; k++) if (!hasRail(t.path[k])) seen.add(t.path[k]);
    }
    return [...seen].sort((a, b) => a - b);
  }

  function snapshot() {
    return {
      ok: true, installed: true, disabled: off(), maxTrains: MAX_TRAINS, active: activeCount(),
      holder, waiting: waiting.slice(), broken: brokenTiles(), trains: [...trains.values()].map(trainView)
    };
  }

  /* 到站或中止：讓出名額；若持有路權，交給等待隊列最前面的一列（FIFO）。 */
  function finish(t, status, why) {
    t.status = status;
    if (status === 'ABORTED') t.abortReason = why;
    const w = waiting.indexOf(t.id);
    if (w >= 0) waiting.splice(w, 1);
    let granted = null;
    if (holder === t.id) { holder = waiting.length ? waiting.shift() : null; granted = holder; }
    refresh();
    return granted;
  }

  function spawn(id, from, to, cargo, capacity) {
    if (off()) return disabled();
    if (!validId(id)) return { ok: false, reason: RS.BAD_INPUT, field: 'id' };
    if (trains.has(id)) return { ok: false, reason: RS.DUPLICATE, id };
    const c = cargo === undefined || cargo === null ? {} : cargo;
    if (typeof c !== 'object') return { ok: false, reason: RS.BAD_INPUT, field: 'cargo' };
    const qty = c.qty === undefined ? 1 : c.qty;
    if (!Number.isSafeInteger(qty) || qty <= 0) return { ok: false, reason: RS.BAD_INPUT, field: 'qty' };
    const cap = capacity === undefined ? DEFAULT_CAPACITY : capacity;
    if (!Number.isSafeInteger(cap) || cap <= 0) return { ok: false, reason: RS.BAD_INPUT, field: 'capacity' };
    if (c.batchId !== undefined && !validId(c.batchId)) return { ok: false, reason: RS.BAD_INPUT, field: 'batchId' };
    if (qty > cap) return { ok: false, reason: RS.OVER_CAPACITY, qty, capacity: cap };
    if (activeCount() >= MAX_TRAINS) return { ok: false, reason: RS.TOO_MANY, maxTrains: MAX_TRAINS };
    const p = planner();
    if (!p) return { ok: false, reason: RS.NO_PLANNER };
    let r;
    try { r = p.plan(from, to); } catch (e) { return { ok: false, reason: RS.NO_PLANNER }; }
    if (!r || r.ok !== true) return { ok: false, reason: (r && validId(r.reason)) ? r.reason : RS.BAD_ROUTE, planner: true, from, to };
    if (!routeOk(r.path) || r.path[0] !== from || r.path[r.path.length - 1] !== to) return { ok: false, reason: RS.BAD_ROUTE, from, to };
    const t = {
      id, path: r.path.slice(), cursor: 0, steps: 0, status: 'READY', qty, capacity: cap,
      batchId: c.batchId === undefined ? id : c.batchId,
      commodityId: validId(c.commodityId) ? c.commodityId : null,
      blockedTile: null, abortReason: null, run054: null
    };
    trains.set(id, t);
    refresh();
    return { ok: true, id, status: 'READY', path: t.path.slice(), steps: t.path.length - 1 };
  }

  /* T785（LAB-07）：替 LAB-05 目前那一列任務登記一列車，路線就是那一列的路線（不另外規劃，兩邊逐格相同）。
   * 批次、數量、商品、容量都取那一列任務，呼叫端不能另給。那一列必須在冊而且還沒開（READY）；
   * 同一列任務只能登記一次。路線上現在缺軌 → track-broken（回報第一格），不登記。 */
  function spawnFor054(id) {
    if (off()) return disabled();
    if (!validId(id)) return { ok: false, reason: RS.BAD_INPUT, field: 'id' };
    if (trains.has(id)) return { ok: false, reason: RS.DUPLICATE, id };
    const g = window.GV, f = g && g.railFreight054;
    if (!f || typeof f.snapshot !== 'function') return { ok: false, reason: RS.NO_PLANNER };
    let s;
    try { s = f.snapshot(); } catch (e) { return { ok: false, reason: RS.NO_PLANNER }; }
    if (!s || s.ok !== true || s.active !== true || s.status !== 'READY' || !validId(s.sessionId)) {
      return { ok: false, reason: RS.NO_RUN054, status: s && typeof s.status === 'string' ? s.status : null };
    }
    for (const t of trains.values()) if (t.run054 === s.sessionId) return { ok: false, reason: RS.DUPLICATE, run054: s.sessionId };
    if (!validId(s.batchId) || !Number.isSafeInteger(s.qty) || s.qty <= 0 || !Number.isSafeInteger(s.capacity) || s.capacity <= 0) {
      return { ok: false, reason: RS.BAD_INPUT, field: 'run054' };
    }
    if (s.qty > s.capacity) return { ok: false, reason: RS.OVER_CAPACITY, qty: s.qty, capacity: s.capacity };
    if (activeCount() >= MAX_TRAINS) return { ok: false, reason: RS.TOO_MANY, maxTrains: MAX_TRAINS };
    if (!routeShapeOk(s.path)) return { ok: false, reason: RS.BAD_ROUTE, run054: s.sessionId };
    for (const i of s.path) if (!hasRail(i)) { const p = at(i); return { ok: false, reason: RS.TRACK_BROKEN, tile: i, x: p.x, y: p.y }; }
    const t = {
      id, path: s.path.slice(), cursor: 0, steps: 0, status: 'READY', qty: s.qty, capacity: s.capacity,
      batchId: s.batchId, commodityId: validId(s.commodityId) ? s.commodityId : null,
      blockedTile: null, abortReason: null, run054: s.sessionId
    };
    trains.set(id, t);
    refresh();
    return { ok: true, id, status: 'READY', path: t.path.slice(), steps: t.path.length - 1, run054: s.sessionId };
  }

  function request(id) {
    if (off()) return disabled();
    if (!validId(id)) return { ok: false, reason: RS.BAD_INPUT };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: RS.UNKNOWN_TRAIN, id };
    if (!isActive(t)) return { ok: false, reason: RS.FINISHED, id, status: t.status };
    if (holder === id || waiting.includes(id)) return { ok: false, reason: RS.DUPLICATE, id };
    if (holder === null) { holder = id; refresh(); return { ok: true, status: 'GRANTED', id }; }
    waiting.push(id);
    refresh();
    return { ok: true, status: 'WAITING', id, position: waiting.length };
  }

  /* 到站或中止時已自動讓出；這裡只確認，不會在路上放掉路權。 */
  function release(id) {
    if (off()) return disabled();
    if (!validId(id)) return { ok: false, reason: RS.BAD_INPUT };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: RS.UNKNOWN_TRAIN, id };
    if (!isActive(t)) return { ok: true, id, released: false, alreadyReleased: true, status: t.status, holder };
    if (holder === id) return { ok: false, reason: RS.STILL_RUNNING, id, status: t.status, cursor: t.cursor, pathLength: t.path.length };
    return { ok: false, reason: RS.NOT_HOLDER, id, holder };
  }

  function advance(id) {
    if (off()) return disabled();
    if (!validId(id)) return { ok: false, reason: RS.BAD_INPUT };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: RS.UNKNOWN_TRAIN, id };
    if (t.status === 'ARRIVED') return { ok: true, moved: false, arrived: true, granted: null, snapshot: trainView(t) };
    if (t.status === 'ABORTED') return { ok: false, reason: RS.FINISHED, snapshot: trainView(t) };
    if (holder !== id) return { ok: false, reason: RS.NO_AUTHORITY, holder, snapshot: trainView(t) };
    if (t.cursor >= t.path.length - 1) {
      const granted = finish(t, 'ARRIVED', null);
      return { ok: true, moved: false, arrived: true, granted, snapshot: trainView(t) };
    }
    const next = t.path[t.cursor + 1];
    if (!hasRail(next)) {
      t.blockedTile = next;
      refresh();
      const p = at(next);
      return { ok: false, reason: RS.TRACK_BROKEN, tile: next, x: p.x, y: p.y, snapshot: trainView(t) };
    }
    t.blockedTile = null;
    t.cursor += 1;
    t.steps += 1;
    t.status = 'RUNNING';
    let granted = null, arrived = false;
    if (t.cursor >= t.path.length - 1) { arrived = true; granted = finish(t, 'ARRIVED', null); } else refresh();
    return { ok: true, moved: true, arrived, granted, snapshot: trainView(t) };
  }

  function abort(id, why) {
    if (off()) return disabled();
    if (!validId(id)) return { ok: false, reason: RS.BAD_INPUT };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: RS.UNKNOWN_TRAIN, id };
    if (!isActive(t)) return { ok: false, reason: RS.FINISHED, id, status: t.status };
    const granted = finish(t, 'ABORTED', validId(why) ? why : 'aborted');
    return { ok: true, id, status: 'ABORTED', granted, snapshot: trainView(t) };
  }

  /* 舊名保留：執行期不收手動斷軌旗標，斷軌與修復都看真地格。 */
  function breakTile(i) { if (off()) return disabled(); return { ok: false, reason: RS.REAL_TILES_ONLY, tile: i }; }
  function repairTile(i) { if (off()) return disabled(); return { ok: false, reason: RS.REAL_TILES_ONLY, tile: i }; }

  function clearAll() {
    holder = null;
    waiting.length = 0;
    trains.clear();
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    panelBody = null;
  }

  /* end／disable 是收尾，閥門開著也照做（面板的 × 與 disable() 都靠它）。 */
  function end() { clearAll(); return { ok: true, ended: true }; }
  function disable() { window.__noRailBlock055 = true; return end(); }

  const tileText = (i) => { const p = at(i); return '(' + p.x + ',' + p.y + ')'; };

  function refresh() {
    if (!panelBody) return;
    if (off()) { panelBody.textContent = '（逃生閥 __noRailBlock055 已關閉）'; return; }
    const s = snapshot();
    const lines = ['持有路權：' + (s.holder || '（無）'), '等待中：' + (s.waiting.length ? s.waiting.join('、') : '（無）')];
    for (const t of s.trains) {
      lines.push(t.id + '：' + t.status + '　' + t.cursor + '/' + (t.pathLength - 1) +
        (t.blockedTile !== null ? '　前方斷軌 ' + tileText(t.blockedTile) : ''));
    }
    lines.push('斷軌格（讀真地格）：' + (s.broken.length ? s.broken.map(tileText).join('、') : '（無）'));
    lines.push('名額：' + s.active + '/' + s.maxTrains);
    panelBody.textContent = lines.join('\n');
  }

  function element(tag, css, text) {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  /* 面板：左欄四格的第 3 格（LAB-03＝0、LAB-05＝1、LAB-06＝2、LAB-07＝3；T785 統一），格高與位置只由視窗高決定，四格互不重疊。 */
  function ensurePanel() {
    if (panel || typeof document === 'undefined' || !document.body) return panel;
    const p = element('div', 'position:fixed;left:12px;top:calc(84px + 2 * ((100vh - 120px) / 4 + 8px));z-index:9999;box-sizing:border-box;' +
      'width:min(260px, calc(100vw - 24px));height:calc((100vh - 120px) / 4);overflow:auto;padding:10px 12px;' +
      'background:rgba(14,20,34,.94);border:1px solid rgba(150,120,220,.6);border-radius:10px;' +
      'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)');
    p.id = 'lab055Panel';
    const notice = element('div', 'margin-top:2px;color:#ffd28a;font-size:11px', UNSAVED);
    notice.id = 'lab055Unsaved';
    const body = element('div', 'margin:6px 0 8px;white-space:pre-wrap');
    body.id = 'lab055Body';
    const row = element('div', 'display:flex;gap:6px');
    const step = element('button', 'flex:1;padding:4px 6px;border-radius:6px;border:1px solid #5a4a8f;background:#211b30;color:#dcd0ff;cursor:pointer', '推進');
    step.id = 'lab055Advance';
    const close = element('button', 'padding:4px 8px;border-radius:6px;border:1px solid #5a4a8f;background:#151d2e;color:#9fb4d8;cursor:pointer', '×');
    close.id = 'lab055Close';
    step.addEventListener('click', () => { if (holder) advance(holder); refresh(); });
    close.addEventListener('click', () => end());
    row.appendChild(step);
    row.appendChild(close);
    p.appendChild(element('div', 'font-weight:700;color:#b9a6ff;letter-spacing:.5px', 'LAB-06 閉塞區間'));
    p.appendChild(notice);
    p.appendChild(body);
    p.appendChild(row);
    document.body.appendChild(p);
    panel = p;
    panelBody = body;
    return panel;
  }

  function open() { if (off()) return disabled(); ensurePanel(); refresh(); return snapshot(); }

  if (typeof load === 'function') {
    const nativeLoad055 = load;
    load = function () { try { clearAll(); } catch (e) {} return nativeLoad055.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld055 = newWorld;
    newWorld = function () { try { clearAll(); } catch (e) {} return nativeWorld055.apply(this, arguments); };
  }
  window.addEventListener('pagehide', function () { try { clearAll(); } catch (e) {} });

  window.GV.railBlock055 = Object.freeze({
    reasons: RS, spawn, spawnFor054, request, release, advance, abort, breakTile, repairTile, snapshot, open, refresh, end, disable,
    provenance: Object.freeze(Object.assign({}, PROVENANCE, { installed: true }))
  });
})();

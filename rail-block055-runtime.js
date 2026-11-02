/* DSK-020 / LAB-06 階段 B：單線閉塞區間的路權、等待與斷軌恢復（執行期接線）。
 * 會被原封不動內嵌進 index.html。
 *
 * 依賴 LAB-05 的 `GV.railFreight054.plan()`（只借它的路線規劃，不共用它的單列狀態），
 * 自己在這裡管兩列車與閉塞權。
 *
 * 邊界：只讀鐵軌格、只在影子任務裡推進；不寫金錢／商品／人口／客流／存檔。
 * 逃生閥：window.__noRailBlock055。
 */
(function installRailBlock055() {
  'use strict';
  const RS = Object.freeze({
    BAD_INPUT: 'bad-input', TOO_MANY: 'too-many', DUPLICATE: 'duplicate', NOT_HOLDER: 'not-holder',
    NO_AUTHORITY: 'no-authority', TRACK_BROKEN: 'track-broken', UNKNOWN: 'unknown-run',
    NO_PLANNER: 'rail-freight-unavailable', DISABLED: 'disabled', NOT_READY: 'not-ready'
  });
  const MAX_TRAINS = 2;
  const off = () => !!window.__noRailBlock055;
  let holder = null;
  const waiting = [];
  const trains = new Map();
  const broken = new Set();
  let panel = null;

  function ensurePlanner() { return window.GV && window.GV.railFreight054 && typeof window.GV.railFreight054.plan === 'function' ? window.GV.railFreight054 : null; }

  function request(id) {
    if (off()) return { ok: false, reason: RS.DISABLED };
    if (typeof id !== 'string' || !id) return { ok: false, reason: RS.BAD_INPUT };
    if (id === holder || waiting.includes(id)) return { ok: false, reason: RS.DUPLICATE };
    if (holder === null) { holder = id; return { ok: true, status: 'GRANTED', id }; }
    if ((holder === null ? 0 : 1) + waiting.length >= MAX_TRAINS) return { ok: false, reason: RS.TOO_MANY, maxTrains: MAX_TRAINS };
    waiting.push(id);
    return { ok: true, status: 'WAITING', id };
  }

  function release(id) {
    if (off()) return { ok: false, reason: RS.DISABLED };
    if (id !== holder) return { ok: false, reason: RS.NOT_HOLDER };
    holder = waiting.length ? waiting.shift() : null;
    return { ok: true, granted: holder };
  }

  function spawn(id, from, to, cargo, capacity) {
    if (off()) return { ok: false, reason: RS.DISABLED };
    const planner = ensurePlanner();
    if (!planner) return { ok: false, reason: RS.NO_PLANNER };
    if (typeof id !== 'string' || !id) return { ok: false, reason: RS.BAD_INPUT };
    if (trains.has(id)) return { ok: false, reason: RS.DUPLICATE };
    if (trains.size >= MAX_TRAINS) return { ok: false, reason: RS.TOO_MANY };
    const p = planner.plan(from, to);
    if (!p.ok) return p;
    const qty = cargo && Number.isSafeInteger(cargo.qty) && cargo.qty > 0 ? cargo.qty : 1;
    const cap = Number.isSafeInteger(capacity) && capacity > 0 ? capacity : 12;
    if (qty > cap) return { ok: false, reason: 'over-capacity', qty, capacity: cap };
    trains.set(id, {
      id, path: p.path, cursor: 0, steps: 0, qty, capacity: cap,
      batchId: cargo && typeof cargo.batchId === 'string' ? cargo.batchId : id,
      status: 'READY'
    });
    refresh();
    return { ok: true, path: p.path.slice(), steps: p.steps };
  }

  function advance(id) {
    if (off()) return { ok: false, reason: RS.DISABLED };
    const t = trains.get(id);
    if (!t) return { ok: false, reason: RS.UNKNOWN };
    if (t.status === 'ARRIVED') return { ok: true, snapshot: snapshotTrain(t) };
    if (id !== holder) return { ok: false, reason: RS.NO_AUTHORITY, snapshot: snapshotTrain(t) };
    if (t.cursor >= t.path.length - 1) { t.status = 'ARRIVED'; release(id); refresh(); return { ok: true, snapshot: snapshotTrain(t) }; }
    const nextTile = t.path[t.cursor + 1];
    if (broken.has(nextTile)) return { ok: false, reason: RS.TRACK_BROKEN, tile: nextTile, snapshot: snapshotTrain(t) };
    t.cursor += 1; t.steps += 1; t.status = 'RUNNING';
    if (t.cursor >= t.path.length - 1) { t.status = 'ARRIVED'; release(id); }
    refresh();
    return { ok: true, snapshot: snapshotTrain(t) };
  }

  function breakTile(i) { broken.add(i); refresh(); return { ok: true, broken: [...broken].sort((a, b) => a - b) }; }
  function repairTile(i) { broken.delete(i); refresh(); return { ok: true, broken: [...broken].sort((a, b) => a - b) }; }

  function snapshotTrain(t) {
    return { id: t.id, status: t.status, cursor: t.cursor, pathLength: t.path.length, steps: t.steps, qty: t.qty, capacity: t.capacity, batchId: t.batchId };
  }
  function snapshot() {
    return {
      ok: true, disabled: off(), maxTrains: MAX_TRAINS, holder,
      waiting: waiting.slice(), broken: [...broken].sort((a, b) => a - b),
      trains: [...trains.values()].map(snapshotTrain)
    };
  }

  function abortAll(reason) {
    holder = null; waiting.length = 0; trains.clear();
    refresh();
    return { ok: true, reason };
  }

  function end() {
    abortAll('ended');
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    return { ok: true, ended: true };
  }

  function disable() { window.__noRailBlock055 = true; return end(); }

  function ensurePanel() {
    if (panel || typeof document === 'undefined') return panel;
    panel = document.createElement('div');
    panel.id = 'lab055Panel';
    panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;width:270px;padding:10px 12px;' +
      'background:rgba(14,20,34,.94);border:1px solid rgba(150,120,220,.6);border-radius:10px;' +
      'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
    panel.innerHTML = '<div style="font-weight:700;color:#b9a6ff;letter-spacing:.5px">LAB-06 閉塞區間</div>' +
      '<div id="lab055Body" style="margin:6px 0 8px;white-space:pre-wrap"></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button id="lab055Advance" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #5a4a8f;background:#211b30;color:#dcd0ff;cursor:pointer">推進</button>' +
      '<button id="lab055Break" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #7a4a4a;background:#2a1d20;color:#ffd6d6;cursor:pointer">斷軌</button>' +
      '<button id="lab055Close" style="padding:4px 8px;border-radius:6px;border:1px solid #5a4a8f;background:#151d2e;color:#9fb4d8;cursor:pointer">×</button>' +
      '</div>';
    document.body.appendChild(panel);
    panel.querySelector('#lab055Advance').addEventListener('click', () => { if (holder) advance(holder); });
    panel.querySelector('#lab055Break').addEventListener('click', () => {
      const t = holder && trains.get(holder);
      if (t && t.cursor + 1 < t.path.length) breakTile(t.path[t.cursor + 1]);
    });
    panel.querySelector('#lab055Close').addEventListener('click', () => end());
    return panel;
  }

  function refresh() {
    if (!panel) return;
    const body = panel.querySelector('#lab055Body');
    if (!body) return;
    if (off()) { body.textContent = '（逃生閥 __noRailBlock055 已關閉）'; return; }
    const s = snapshot();
    const lines = ['持有路權：' + (s.holder || '（無）')];
    if (s.waiting.length) lines.push('等待中：' + s.waiting.join('、'));
    for (const t of s.trains) lines.push(t.id + '：' + t.status + '　' + t.cursor + '/' + (t.pathLength - 1));
    if (s.broken.length) lines.push('斷軌格：' + s.broken.join(','));
    body.textContent = lines.join('\n');
  }

  function open() { ensurePanel(); refresh(); return snapshot(); }

  if (typeof load === 'function') {
    const nativeLoad055 = load;
    load = function () { try { abortAll('load'); } catch (e) {} return nativeLoad055.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld055 = newWorld;
    newWorld = function () { try { abortAll('new-world'); } catch (e) {} return nativeWorld055.apply(this, arguments); };
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', function () { try { abortAll('pagehide'); } catch (e) {} });

  const api = Object.freeze({
    request, release, spawn, advance, breakTile, repairTile, snapshot, open, refresh, end, disable,
    provenance: { module: 'rail-block055', lab: 'LAB-06', isolation: 'shadow-only', maxTrains: MAX_TRAINS }
  });
  window.GV.railBlock055 = api;
})();

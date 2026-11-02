/* DSK-025 / LAB-07：公鐵聯運全程交付（執行期接線）。會被原封不動內嵌進 index.html。
 *
 * 依賴：GV.roadDelivery053.plan()（公路）與 GV.railFreight054.plan()（鐵路）——只借規劃，狀態自己管。
 * 邊界：同一批次、數量守恆；不寫金錢／商品／人口／客流／存檔。
 * 逃生閥：window.__noIntermodal057。
 */
(function installIntermodal057() {
  'use strict';
  const RS = Object.freeze({
    DISABLED: 'disabled', NO_PLANNER: 'planner-unavailable', BAD_INPUT: 'bad-input',
    NO_TRIP: 'no-trip', ROAD_NOT_DONE: 'road-not-done', WRONG_STATE: 'wrong-state',
    OVER_CAPACITY: 'over-capacity', DONE: 'already-delivered'
  });
  const off = () => !!window.__noIntermodal057;
  let trip = null;
  let panel = null;
  let settleSeq = 0;

  const roadPlanner = () => (window.GV && window.GV.roadDelivery053 && typeof window.GV.roadDelivery053.plan === 'function') ? window.GV.roadDelivery053 : null;
  const railPlanner = () => (window.GV && window.GV.railFreight054 && typeof window.GV.railFreight054.plan === 'function') ? window.GV.railFreight054 : null;

  function snapshot() {
    if (!trip) return { ok: false, reason: RS.NO_TRIP, active: false, disabled: off() };
    return {
      ok: true, active: trip.status !== 'DELIVERED' && trip.status !== 'CANCELLED', disabled: off(),
      status: trip.status, batchId: trip.batchId, commodityId: trip.commodityId, qty: trip.qty, capacity: trip.capacity,
      roadCursor: trip.roadCursor, roadLength: trip.roadPath.length,
      railCursor: trip.railCursor, railLength: trip.railPath.length,
      authorityId: trip.authorityId, settlement: trip.settlement,
      cancelledReason: trip.cancelledReason
    };
  }

  function start(opts) {
    if (off()) return { ok: false, reason: RS.DISABLED };
    const rd = roadPlanner();
    const rl = railPlanner();
    if (!rd || !rl) return { ok: false, reason: RS.NO_PLANNER };
    opts = opts || {};
    const cargo = opts.cargo || {};
    const qty = Number.isSafeInteger(cargo.qty) && cargo.qty > 0 ? cargo.qty : 1;
    const cap = Number.isSafeInteger(opts.capacity) && opts.capacity > 0 ? opts.capacity : 12;
    if (qty > cap) return { ok: false, reason: RS.OVER_CAPACITY, qty, capacity: cap };

    const road = rd.plan(opts.roadFrom, opts.roadTo);
    if (!road.ok) return { ok: false, reason: 'road:' + road.reason, leg: 'road' };
    const rail = rl.plan(opts.railFrom, opts.railTo);
    if (!rail.ok) return { ok: false, reason: 'rail:' + rail.reason, leg: 'rail' };

    trip = {
      status: 'ROAD', batchId: typeof cargo.batchId === 'string' && cargo.batchId ? cargo.batchId : 'lab057-' + (opts.roadFrom + '-' + opts.railTo),
      commodityId: typeof cargo.commodityId === 'string' ? cargo.commodityId : 'food',
      qty, capacity: cap,
      roadPath: road.path, roadCursor: 0,
      railPath: rail.path, railCursor: 0,
      authorityId: typeof opts.authority === 'string' && opts.authority ? opts.authority : (opts.authority && typeof opts.authority.id === 'string' ? opts.authority.id : null),
      ledger: opts.ledger && typeof opts.ledger.batchId === 'string' ? { sessionId: opts.ledger.sessionId || null, batchId: opts.ledger.batchId } : null,
      settlement: null,
      cancelledReason: null
    };
    refresh();
    return { ok: true, roadSteps: road.steps, railSteps: rail.steps, status: trip.status };
  }

  function advance() {
    if (off()) return { ok: false, reason: RS.DISABLED };
    if (!trip) return { ok: false, reason: RS.NO_TRIP };
    if (trip.status === 'DELIVERED') return { ok: false, reason: RS.DONE, snapshot: snapshot() };
    if (trip.status !== 'ROAD' && trip.status !== 'RAIL') return { ok: false, reason: RS.WRONG_STATE, snapshot: snapshot() };
    if (trip.status === 'ROAD') {
      if (trip.roadCursor >= trip.roadPath.length - 1) { trip.status = 'TRANSFER'; refresh(); return { ok: true, snapshot: snapshot() }; }
      trip.roadCursor += 1;
      if (trip.roadCursor >= trip.roadPath.length - 1) trip.status = 'TRANSFER';
      refresh();
      return { ok: true, snapshot: snapshot() };
    }
    // Rail leg: when an authority id is declared, only the 055 holder may move, and a
    // broken next tile must stop the train. 055 exposes state through snapshot()
    // (it has no canAdvance helper) — holder + broken list are the authoritative facts.
    if (trip.authorityId && window.GV && window.GV.railBlock055 && typeof window.GV.railBlock055.snapshot === 'function') {
      const blk = window.GV.railBlock055.snapshot();
      const nextRail = trip.railPath[Math.min(trip.railCursor + 1, trip.railPath.length - 1)];
      if (blk && blk.holder !== trip.authorityId) {
        return { ok: false, reason: 'authority:no-authority', snapshot: snapshot() };
      }
      if (blk && Array.isArray(blk.broken) && blk.broken.indexOf(nextRail) >= 0) {
        return { ok: false, reason: 'authority:track-broken', snapshot: snapshot() };
      }
    }
    if (trip.railCursor >= trip.railPath.length - 1) { trip.status = 'DELIVERED'; settleOnDeliver(); refresh(); return { ok: true, snapshot: snapshot() }; }
    trip.railCursor += 1;
    if (trip.railCursor >= trip.railPath.length - 1) { trip.status = 'DELIVERED'; settleOnDeliver(); }
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  /* Once the batch physically arrives, hand it to its declared destination in the
   * shadow ledger. Owner/location must equal current custody and `to` the batch's
   * destination — the ledger rejects anything else atomically. */
  function settleOnDeliver() {
    if (!trip.ledger) return;
    const L = window.GV && window.GV.singleResearch052;
    if (!L || typeof L.command !== 'function') { trip.settlement = { ok: false, reason: 'ledger-unavailable' }; return; }
    try {
      const snap = L.snapshot();
      const batches = (snap && snap.ledger && snap.ledger.batches) || [];
      const b = batches.find((x) => x && x.batchId === trip.ledger.batchId);
      if (!b) { trip.settlement = { ok: false, reason: 'batch-not-found' }; return; }
      const r = L.command({
        eventId: 'intermodal057-settle-' + (++settleSeq), sessionId: snap.ledger.sessionId, batchId: b.batchId,
        type: 'HANDOFF', expectedRevision: snap.ledger.revision,
        payload: { owner: b.owner, location: b.location, to: b.destination }
      });
      trip.settlement = r && r.ok ? { ok: true, revision: r.revision === undefined ? null : r.revision } : { ok: false, reason: (r && r.code) || 'rejected' };
    } catch (e) {
      trip.settlement = { ok: false, reason: 'exception' };
    }
  }

  function transfer() {
    if (off()) return { ok: false, reason: RS.DISABLED };
    if (!trip) return { ok: false, reason: RS.NO_TRIP };
    if (trip.status !== 'TRANSFER') return { ok: false, reason: trip.status === 'ROAD' ? RS.ROAD_NOT_DONE : RS.WRONG_STATE };
    trip.status = 'RAIL';
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function cancel(reason) {
    if (!trip) return snapshot();
    if (trip.status !== 'DELIVERED') {
      trip.status = 'CANCELLED';
      trip.cancelledReason = typeof reason === 'string' && reason ? reason : 'cancelled';
    }
    refresh();
    return snapshot();
  }

  function end() {
    trip = null;
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    return { ok: true, ended: true };
  }
  function disable() { window.__noIntermodal057 = true; return end(); }

  function ensurePanel() {
    if (panel || typeof document === 'undefined') return panel;
    panel = document.createElement('div');
    panel.id = 'lab057Panel';
    panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;width:260px;padding:10px 12px;' +
      'background:rgba(14,20,34,.94);border:1px solid rgba(90,190,160,.6);border-radius:10px;' +
      'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
    panel.innerHTML = '<div style="font-weight:700;color:#7fe0c0;letter-spacing:.5px">LAB-07 公鐵聯運</div>' +
      '<div id="lab057Body" style="margin:6px 0 8px;white-space:pre-wrap"></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button id="lab057Advance" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #3f7f6a;background:#16251f;color:#cfffe8;cursor:pointer">前進</button>' +
      '<button id="lab057Transfer" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #5a4a8f;background:#211b30;color:#dcd0ff;cursor:pointer">換裝</button>' +
      '<button id="lab057Close" style="padding:4px 8px;border-radius:6px;border:1px solid #3f7f6a;background:#151d2e;color:#9fb4d8;cursor:pointer">×</button>' +
      '</div>';
    document.body.appendChild(panel);
    panel.querySelector('#lab057Advance').addEventListener('click', () => advance());
    panel.querySelector('#lab057Transfer').addEventListener('click', () => transfer());
    panel.querySelector('#lab057Close').addEventListener('click', () => end());
    return panel;
  }

  function refresh() {
    if (!panel) return;
    const body = panel.querySelector('#lab057Body');
    if (!body) return;
    if (off()) { body.textContent = '（逃生閥 __noIntermodal057 已關閉）'; return; }
    if (!trip) { body.textContent = '目前沒有聯運任務。'; return; }
    const s = snapshot();
    body.textContent = '批次 ' + s.batchId + '（' + s.qty + '/' + s.capacity + ' 件 ' + s.commodityId + '）\n' +
      '狀態 ' + s.status + '\n公路 ' + s.roadCursor + '/' + (s.roadLength - 1) + '　鐵路 ' + s.railCursor + '/' + (s.railLength - 1) +
      (s.status === 'DELIVERED' ? '\n已交付（影子帳，未寫入正式經濟）' : (s.status === 'CANCELLED' ? '\n已取消：' + s.cancelledReason : ''));
  }

  function open() { ensurePanel(); refresh(); return snapshot(); }

  if (typeof load === 'function') {
    const nativeLoad057 = load;
    load = function () { try { cancel('load'); } catch (e) {} return nativeLoad057.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld057 = newWorld;
    newWorld = function () { try { cancel('new-world'); } catch (e) {} return nativeWorld057.apply(this, arguments); };
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', function () { try { cancel('pagehide'); } catch (e) {} });

  const api = Object.freeze({
    start, advance, transfer, cancel, snapshot, open, refresh, end, disable,
    provenance: { module: 'intermodal057', lab: 'LAB-07', isolation: 'shadow-only', legs: ['road', 'rail'] }
  });
  window.GV.intermodal057 = api;
})();

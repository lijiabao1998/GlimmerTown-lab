/* DSK-025 / LAB-07（T785 重新出卡）：公鐵聯運全程交付（執行期接線）。會被原封不動內嵌進 index.html（DSK-025 INTERMODAL 057 區塊）。
 *
 * 一趟＝052 研究帳上的一個批次，走完：
 *   起點物流建築 →（LAB-03 startBetween，真道路）→ 轉運 k166 →（LAB-06 路權）→（LAB-05 runBetween，真鐵軌）→ 目的 k166。
 * 帳（A1／A4）：批次、數量、商品都取 052 帳上的值，呼叫端不能另給；到站對 052 帳下 HANDOFF 給目的地保管人；
 *   中途失敗或取消下 FREEZE（寫原因）；全程不新增、不消失。這是影子研究帳，不是正式經濟。
 * 轉運（A2）：道路段的終點建築與鐵路段的起點建築必須是同一棟 k166，否則 no-interchange，不准瞬移。
 * 路權（A3）：鐵路段開跑前用 LAB-06 spawnFor054 登記（路線就是 054 那一列）並要路權；拿不到就在轉運點等；到站或中止就釋放。
 * 狀態（A5）：進行中再開回 busy；每一步重讀該段的真路／真軌，被拆就停在原地回理由；讀檔、開新城、pagehide、end 取消並 FREEZE。
 * 邊界：只讀道路、鐵軌與建築；不寫金錢／商品／人口／客流／存檔；沒有亂數、沒有現實時間。
 * 逃生閥：window.__noIntermodal057。
 *   - 安裝當下就開著：整段不安裝（不改寫 load／newWorld、不掛 pagehide、不建面板），API 一律回 disabled。
 *   - 安裝之後才打開：開始、推進、開面板回 disabled；取消（照樣 FREEZE）、結束、快照照常。
 * 對外：window.GV.intermodal057.{start,advance,cancel,snapshot,open,refresh,end,disable,reasons,provenance}
 */
(function installIntermodal057() {
  'use strict';
  const RS = Object.freeze({
    DISABLED: 'disabled', BAD_INPUT: 'bad-input', BUSY: 'busy', NO_TRIP: 'no-trip', FINISHED: 'already-finished',
    DEPENDENCY: 'dependency-unavailable',
    LEDGER_UNAVAILABLE: 'ledger-unavailable', BATCH_UNAVAILABLE: 'batch-unavailable', BATCH_NOT_READY: 'batch-not-ready',
    NOT_AT_SOURCE: 'not-at-source', DESTINATION_MISMATCH: 'destination-mismatch', OVER_CAPACITY: 'over-capacity',
    NO_INTERCHANGE: 'no-interchange', WAITING_AUTHORITY: 'waiting-authority',
    ROAD_BROKEN: 'road-broken', TRACK_BROKEN: 'track-broken',
    CUSTODY_LOST: 'custody-lost', LEG_LOST: 'leg-lost', LEDGER_WRITE_FAILED: 'ledger-write-failed'
  });
  const INFO = {
    module: 'intermodal057', lab: 'LAB-07', card: 'T785', isolation: 'shadow-only', persisted: false,
    ledger: 'GV.singleResearch052', legs: ['road:GV.roadDelivery053.startBetween', 'rail:GV.railFreight054.runBetween'],
    authority: 'GV.railBlock055.spawnFor054', interchangeK: 166, panel: 'left-slot-3'
  };
  const disabled = () => ({ ok: false, reason: RS.DISABLED, disabled: true });

  if (window.__noIntermodal057) {
    const inert = { start: disabled, advance: disabled, cancel: disabled, open: disabled, refresh: disabled, end: disabled, disable: disabled };
    inert.snapshot = () => ({ ok: false, reason: RS.DISABLED, active: false, disabled: true, installed: false });
    inert.reasons = RS;
    inert.provenance = Object.freeze(Object.assign({ installed: false }, INFO));
    window.GV.intermodal057 = Object.freeze(inert);
    return;
  }

  const HUB_K = 166;
  const UNSAVED = '未保存：重新整理或讀檔就會消失';
  const KEYS = ['batchId', 'originCustodian', 'destinationCustodian', 'roadFrom', 'roadTo', 'railFrom', 'railTo', 'capacity'];
  const REQUIRED = KEYS.filter((k) => k !== 'capacity');
  const LEDGER_OWNED = ['qty', 'commodityId', 'cargo', 'batch'];
  const ACTIVE = ['ROAD', 'INTERCHANGE', 'WAITING_AUTHORITY', 'RAIL'];
  // 面板：左欄四格的第 4 格（LAB-03＝0、LAB-05＝1、LAB-06＝2、LAB-07＝3），格高與位置只由視窗高決定，四格互不重疊。
  const PANEL_CSS = 'position:fixed;left:12px;top:calc(84px + 3 * ((100vh - 120px) / 4 + 8px));' +
    'width:min(260px, calc(100vw - 24px));height:calc((100vh - 120px) / 4);box-sizing:border-box;overflow:auto;z-index:9999;' +
    'padding:10px 12px;background:rgba(14,20,34,.94);border:1px solid rgba(90,190,160,.6);border-radius:10px;' +
    'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
  const off = () => !!window.__noIntermodal057;
  const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const no = (reason, extra) => Object.assign({ ok: false, reason }, extra || {});
  const isId = (v) => typeof v === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,63}$/.test(v);
  const inGrid = (i) => Number.isInteger(i) && Number.isInteger(N) && i >= 0 && i < N * N;
  const xy = (i) => ({ x: i % N, y: (i / N) | 0 });
  const hasRoad = (i) => inGrid(i) && !!(tiles && tiles[i] && tiles[i].road);
  function isHubRoot(i) {
    const b = inGrid(i) && tiles && tiles[i] && tiles[i].bld;
    return !!(b && !b.ref && b.k === HUB_K);
  }

  let trip = null;      // 進行中或剛結束的一趟
  let lastEnded = null; // 讀檔／開新城／pagehide／end 收掉的上一趟（只留結果，看得到 FREEZE 有沒有成功）
  let panel = null;     // { root, body }
  let seq = 0;

  /* 依賴：052 研究帳、053 道路、054 鐵路、055 路權。少一個就不開始，也不推進。 */
  function deps() {
    const g = window.GV || {};
    const need = {
      ledger: [g.singleResearch052, ['snapshot', 'command']],
      road: [g.roadDelivery053, ['startBetween', 'snapshot', 'step', 'cancel']],
      rail: [g.railFreight054, ['runBetween', 'snapshot', 'step', 'unload', 'abort']],
      block: [g.railBlock055, ['spawnFor054', 'request', 'advance', 'abort', 'snapshot']]
    };
    const out = { ok: true, missing: [] };
    for (const [name, [api, fns]] of Object.entries(need)) {
      if (!api || fns.some((f) => typeof api[f] !== 'function')) { out.missing.push(name); out[name] = null; } else out[name] = api;
    }
    out.ok = out.missing.length === 0;
    return out;
  }
  function disabledLegs(d) {
    const out = [];
    for (const name of ['road', 'rail', 'block']) {
      const api = d[name];
      let s = null;
      try { s = api.snapshot(); } catch (e) { s = null; }
      if ((api.provenance && api.provenance.installed === false) || !s || s.disabled === true) out.push(name);
    }
    return out;
  }

  function ledgerBatch(d, batchId) {
    if (!d.ledger) return { ok: false, code: 'ledger-missing' };
    let s = null;
    try { s = d.ledger.snapshot(); } catch (e) { s = null; }
    if (!s || s.ok !== true || s.active !== true || !s.ledger) return { ok: false, code: (s && s.code) || 'session-unavailable' };
    const b = (s.ledger.batches || []).find((x) => x && x.batchId === batchId) || null;
    return { ok: true, ledger: s.ledger, batch: b };
  }

  /* 每一步重核帳：同一個 052 會話、同一個批次、狀態與監管鏈沒被別人動過。 */
  function custody(d) {
    const r = ledgerBatch(d, trip.batchId);
    if (!r.ok) return { ok: false, code: r.code };
    if (r.ledger.sessionId !== trip.ledger.sessionId) return { ok: false, code: 'session-changed' };
    const b = r.batch;
    if (!b) return { ok: false, code: 'batch-missing' };
    if (b.state !== 'SOURCE_READY' || b.owner !== trip.ledger.owner || b.location !== trip.ledger.location ||
      b.eventSeq !== trip.ledger.eventSeq || b.qty !== trip.qty || b.commodityId !== trip.commodityId) {
      return { ok: false, code: 'batch-changed', state: b.state, owner: b.owner };
    }
    return { ok: true, revision: r.ledger.revision, conservation: r.ledger.conservation };
  }

  /* 帳上寫一筆（HANDOFF／FREEZE）：監管鏈照帳上的持有人與位置；會話或批次變了就不寫。 */
  function ledgerWrite(d, type, extra) {
    const c = custody(d);
    if (!c.ok) return { ok: false, code: c.code, written: false };
    const payload = Object.assign({ owner: trip.ledger.owner, location: trip.ledger.location }, extra);
    let r;
    try {
      r = d.ledger.command({
        eventId: 'lab057-' + trip.seq + '-' + type.toLowerCase(), sessionId: trip.ledger.sessionId, batchId: trip.batchId,
        type, expectedRevision: c.revision, payload
      });
    } catch (e) { r = { ok: false, code: 'ledger-threw' }; }
    return Object.assign({ written: !!(r && r.ok) }, copy(r) || { ok: false, code: 'ledger-no-result' });
  }

  function legSnap(api) { try { return api.snapshot(); } catch (e) { return null; } }

  /* 收掉三段：還在冊的才收；收的理由一律帶 lab057: 前綴。 */
  function abortLegs(d, why) {
    const tag = 'lab057:' + why;
    if (trip.status === 'ROAD' && d.road) {
      const r = legSnap(d.road);
      if (r && r.sessionId === trip.road.sessionId && r.active) try { d.road.cancel(tag); } catch (e) {}
    }
    const s = d.rail ? legSnap(d.rail) : null;
    if (s && s.sessionId === trip.rail.sessionId && s.active) try { d.rail.abort(tag); } catch (e) {}
    if (trip.train.registered && d.block) {
      const b = legSnap(d.block), t = b && b.trains && b.trains.find((x) => x.id === trip.train.id);
      if (t && (t.status === 'READY' || t.status === 'RUNNING')) try { d.block.abort(trip.train.id, tag); } catch (e) {}
    }
  }

  function finish(status, extra) {
    trip.status = status;
    Object.assign(trip, extra || {});
    refresh();
  }

  /* 中途失敗：收掉各段，能寫帳就 FREEZE（寫原因），寫不了就照實記下。 */
  function fail(d, reason, detail, freeze) {
    abortLegs(d, reason);
    const f = freeze === false ? { ok: false, code: 'not-attempted', written: false } :
      ledgerWrite(d, 'FREEZE', { reason: ('lab057:' + reason + (detail ? ':' + detail : '')).slice(0, 160) });
    trip.ledger.freeze = f;
    finish('FAILED', { failure: { reason, detail: detail || null } });
    return no(reason, { detail: detail || null, freeze: copy(f), snapshot: snapshot() });
  }

  function checkInput(opts) {
    if (!opts || typeof opts !== 'object' || Array.isArray(opts)) return no(RS.BAD_INPUT, { detail: 'opts' });
    for (const k of Object.keys(opts)) {
      if (LEDGER_OWNED.includes(k)) return no(RS.BAD_INPUT, { detail: 'ledger-owned', field: k });
      if (!KEYS.includes(k)) return no(RS.BAD_INPUT, { detail: 'unknown-field', field: k });
    }
    for (const k of REQUIRED) if (!(k in opts)) return no(RS.BAD_INPUT, { detail: 'missing', field: k });
    for (const k of ['batchId', 'originCustodian', 'destinationCustodian']) if (!isId(opts[k])) return no(RS.BAD_INPUT, { detail: 'id', field: k });
    for (const k of ['roadFrom', 'roadTo', 'railFrom', 'railTo']) if (!inGrid(opts[k])) return no(RS.BAD_INPUT, { detail: 'tile', field: k });
    if (opts.capacity !== undefined && (!Number.isSafeInteger(opts.capacity) || opts.capacity <= 0)) return no(RS.BAD_INPUT, { detail: 'capacity', field: 'capacity' });
    return null;
  }

  function start(opts) {
    if (off()) return disabled();
    if (trip && ACTIVE.includes(trip.status)) return no(RS.BUSY, { tripId: trip.id, status: trip.status });
    const bad = checkInput(opts);
    if (bad) return bad;
    const d = deps();
    if (!d.ok) return no(RS.DEPENDENCY, { missing: d.missing });
    const legsOff = disabledLegs(d);
    if (legsOff.length) return no(RS.DEPENDENCY, { detail: 'disabled', legs: legsOff });

    // A1：同一批次，全部取帳上的值。
    const lb = ledgerBatch(d, opts.batchId);
    if (!lb.ok) return no(RS.LEDGER_UNAVAILABLE, { code: lb.code });
    const b = lb.batch;
    if (!b) return no(RS.BATCH_UNAVAILABLE, { batchId: opts.batchId });
    if (b.state !== 'SOURCE_READY') return no(RS.BATCH_NOT_READY, { state: b.state });
    if (b.owner !== opts.originCustodian || b.owner !== b.source) return no(RS.NOT_AT_SOURCE, { owner: b.owner, source: b.source, originCustodian: opts.originCustodian });
    if (b.destination !== opts.destinationCustodian) return no(RS.DESTINATION_MISMATCH, { destination: b.destination, destinationCustodian: opts.destinationCustodian });
    const qty = b.qty, commodityId = b.commodityId;
    const prov = d.rail.provenance || {};
    const capacity = opts.capacity !== undefined ? opts.capacity : (Number.isSafeInteger(prov.defaultCapacity) ? prov.defaultCapacity : 12);
    if (qty > capacity) return no(RS.OVER_CAPACITY, { qty, capacity });

    // A2：轉運點是同一棟 k166。
    if (opts.roadTo !== opts.railFrom) return no(RS.NO_INTERCHANGE, { detail: 'different-buildings', roadTo: opts.roadTo, railFrom: opts.railFrom });
    if (!isHubRoot(opts.roadTo)) return no(RS.NO_INTERCHANGE, { detail: 'not-k166', hub: opts.roadTo });

    // 兩段都先排好才出發（不半途）：道路段建任務；鐵路段建任務並保留（READY，到轉運點才登記路權）。
    const cargo = { batchId: b.batchId, qty, commodityId };
    let road;
    try { road = d.road.startBetween(opts.roadFrom, opts.roadTo, cargo); } catch (e) { road = { ok: false, reason: 'road-threw' }; }
    if (!road || !road.ok) return no(road && road.reason ? road.reason : 'road-refused', { leg: 'road', detail: road ? copy(road) : null });
    let rail;
    try { rail = d.rail.runBetween(opts.railFrom, opts.railTo, cargo, capacity); } catch (e) { rail = { ok: false, reason: 'rail-threw' }; }
    if (!rail || !rail.ok) {
      try { d.road.cancel('lab057:rail-leg-refused'); } catch (e) {}
      return no(rail && rail.reason ? rail.reason : 'rail-refused', { leg: 'rail', detail: rail ? copy(rail) : null });
    }
    // 道路段終點貼轉運點的前接、鐵路段起點貼轉運點的軌（兩個規劃器各自保證；這裡再核一次，不對就整趟不開始）。
    const rp = road.path || [], lp = rail.path || [];
    const joined = road.destinationRoot === opts.roadTo && Array.isArray(road.destinationFrontage) && road.destinationFrontage.includes(rp[rp.length - 1]) &&
      rail.originRoot === opts.railFrom && Array.isArray(rail.originFrontage) && rail.originFrontage.includes(lp[0]);
    if (!joined) {
      try { d.road.cancel('lab057:interchange-mismatch'); } catch (e) {}
      try { d.rail.abort('lab057:interchange-mismatch'); } catch (e) {}
      return no(RS.NO_INTERCHANGE, { detail: 'leg-endpoints' });
    }

    const id = 'lab057-' + (++seq);
    if (trip) lastEnded = Object.assign({ endedBy: 'replaced' }, view(trip));
    trip = {
      id, seq, status: 'ROAD', batchId: b.batchId, qty, commodityId, capacity,
      custodians: { origin: opts.originCustodian, destination: opts.destinationCustodian },
      roadFrom: opts.roadFrom, hub: opts.roadTo, railTo: opts.railTo,
      road: { sessionId: road.sessionId, path: rp.slice(), cursor: 0 },
      rail: { sessionId: rail.sessionId, path: lp.slice(), cursor: 0 },
      train: { id, registered: false },
      ledger: {
        sessionId: lb.ledger.sessionId, owner: b.owner, location: b.location, eventSeq: b.eventSeq,
        revisionAtStart: lb.ledger.revision, handoff: null, freeze: null
      },
      blocked: null, cancelledReason: null, failure: null
    };
    const rs = legSnap(d.road);
    if (rs && rs.sessionId === trip.road.sessionId && rs.status === 'DELIVERED') trip.status = 'INTERCHANGE';
    refresh();
    return {
      ok: true, tripId: id, status: trip.status, batchId: trip.batchId, qty, commodityId, capacity,
      roadSteps: rp.length - 1, railSteps: lp.length - 1, road: { sessionId: road.sessionId }, rail: { sessionId: rail.sessionId },
      ledger: { sessionId: trip.ledger.sessionId, revision: trip.ledger.revisionAtStart }
    };
  }

  const stay = (reason, extra) => { trip.blocked = Object.assign({ reason }, extra || {}); refresh(); return no(reason, Object.assign({}, extra || {}, { snapshot: snapshot() })); };
  const moved = (extra) => { trip.blocked = null; refresh(); return Object.assign({ ok: true }, extra || {}, { snapshot: snapshot() }); };

  /* 各段的紀錄必須還是這一趟的那一筆，而且沒被別人推過（例如 053／054 自己面板的「前進一格」）。 */
  function legsIntact(d) {
    if (trip.status === 'ROAD') {
      const r = legSnap(d.road);
      if (!r || r.sessionId !== trip.road.sessionId) return 'road';
      if (r.status === 'CANCELLED') return 'road-cancelled';
      if (r.cursor !== trip.road.cursor) return 'road-desync';
    }
    const s = legSnap(d.rail);
    if (!s || s.sessionId !== trip.rail.sessionId) return 'rail';
    if (s.status === 'ABORTED') return 'rail-aborted';
    if (s.cursor !== trip.rail.cursor) return 'rail-desync';
    if (trip.train.registered) {
      const b = legSnap(d.block), t = b && b.trains && b.trains.find((x) => x.id === trip.train.id);
      if (!t || t.run054 !== trip.rail.sessionId) return 'block';
      if (t.status === 'ABORTED') return 'block-aborted';
      if (t.cursor !== trip.rail.cursor) return 'block-desync';
    }
    return null;
  }

  function advance() {
    if (off()) return disabled();
    if (!trip) return no(RS.NO_TRIP);
    if (!ACTIVE.includes(trip.status)) return no(RS.FINISHED, { status: trip.status, snapshot: snapshot() });
    const d = deps();
    if (!d.ok) return stay(RS.DEPENDENCY, { missing: d.missing });
    const legsOff = disabledLegs(d);
    if (legsOff.length) return stay(RS.DEPENDENCY, { detail: 'disabled', legs: legsOff });
    const c = custody(d);
    if (!c.ok) return fail(d, RS.CUSTODY_LOST, c.code, false);
    const broken = legsIntact(d);
    if (broken) return fail(d, RS.LEG_LOST, broken);

    if (trip.status === 'ROAD') {
      const path = trip.road.path, next = path[trip.road.cursor + 1];
      if (!hasRoad(next)) { const p = xy(next); return stay(RS.ROAD_BROKEN, { leg: 'road', tile: next, x: p.x, y: p.y }); }
      const r = d.road.step();
      if (!r || !r.ok || !r.snapshot) return stay(RS.DEPENDENCY, { leg: 'road', detail: r && r.reason });
      trip.road.cursor = r.snapshot.cursor;
      if (r.snapshot.status === 'DELIVERED') trip.status = 'INTERCHANGE';
      return moved({ moved: true, leg: 'road' });
    }

    if (trip.status === 'INTERCHANGE') {
      if (!isHubRoot(trip.hub)) return stay(RS.NO_INTERCHANGE, { detail: 'hub-gone', hub: trip.hub });
      const sp = d.block.spawnFor054(trip.train.id);
      if (!sp || !sp.ok) {
        const why = sp && sp.reason;
        if (why === 'too-many') return stay(RS.WAITING_AUTHORITY, { detail: 'too-many' });
        if (why === 'track-broken') return stay(RS.TRACK_BROKEN, { leg: 'rail', tile: sp.tile, x: sp.x, y: sp.y });
        return fail(d, RS.LEG_LOST, 'block-register:' + (why || 'unknown'));
      }
      if (!Array.isArray(sp.path) || sp.path.join(',') !== trip.rail.path.join(',') || sp.run054 !== trip.rail.sessionId) {
        return fail(d, RS.LEG_LOST, 'block-route-mismatch');
      }
      trip.train.registered = true;
      const rq = d.block.request(trip.train.id);
      if (rq && rq.ok && rq.status === 'GRANTED') { trip.status = 'RAIL'; return moved({ moved: false, leg: 'interchange', authority: 'GRANTED' }); }
      if (rq && rq.ok && rq.status === 'WAITING') { trip.status = 'WAITING_AUTHORITY'; return moved({ moved: false, leg: 'interchange', authority: 'WAITING', position: rq.position }); }
      return fail(d, RS.LEG_LOST, 'block-request:' + ((rq && rq.reason) || 'unknown'));
    }

    if (trip.status === 'WAITING_AUTHORITY') {
      const b = legSnap(d.block);
      if (b && b.holder === trip.train.id) { trip.status = 'RAIL'; return moved({ moved: false, leg: 'interchange', authority: 'GRANTED' }); }
      return stay(RS.WAITING_AUTHORITY, { holder: b ? b.holder : null, position: b && b.waiting ? b.waiting.indexOf(trip.train.id) + 1 : null });
    }

    // RAIL：055 管路權與每一步的真軌判定；054 那一列跟著同步前進（兩邊同一條路線，逐格相同）。
    const a = d.block.advance(trip.train.id);
    if (!a || !a.ok) {
      const why = a && a.reason;
      if (why === 'track-broken') return stay(RS.TRACK_BROKEN, { leg: 'rail', tile: a.tile, x: a.x, y: a.y });
      return fail(d, RS.LEG_LOST, 'block-advance:' + (why || 'unknown'));
    }
    let s = null;
    if (a.moved || (a.arrived && legSnap(d.rail).status !== 'ARRIVED')) {
      s = d.rail.step();
      if (!s || !s.ok || !s.snapshot) return fail(d, RS.LEG_LOST, 'rail-step:' + ((s && s.reason) || 'unknown'));
      trip.rail.cursor = s.snapshot.cursor;
    }
    if (!a.arrived) return moved({ moved: true, leg: 'rail' });
    const rs = legSnap(d.rail);
    if (!rs || rs.status !== 'ARRIVED' || rs.cursor !== a.snapshot.cursor) return fail(d, RS.LEG_LOST, 'rail-desync');
    const u = d.rail.unload();
    if (!u || !u.ok) return fail(d, RS.LEG_LOST, 'rail-unload:' + ((u && u.reason) || 'unknown'));
    // A4：到站對 052 帳下 HANDOFF，監管鏈照帳上的持有人與位置，交給批次本來的目的地。
    const h = ledgerWrite(d, 'HANDOFF', { to: trip.custodians.destination });
    trip.ledger.handoff = h;
    if (!h.ok) { finish('FAILED', { failure: { reason: RS.LEDGER_WRITE_FAILED, detail: h.code || null } }); return no(RS.LEDGER_WRITE_FAILED, { code: h.code, snapshot: snapshot() }); }
    trip.blocked = null;
    finish('DELIVERED');
    return { ok: true, moved: !!a.moved, leg: 'rail', delivered: true, handoff: copy(h), snapshot: snapshot() };
  }

  /* 取消（A5）：收掉各段並 FREEZE（寫原因）。閥門開著也照做。 */
  function cancel(reason) {
    if (!trip || !ACTIVE.includes(trip.status)) return snapshot();
    const why = typeof reason === 'string' && reason ? reason : 'cancelled';
    const d = deps();
    abortLegs(d, 'cancel:' + why);
    trip.ledger.freeze = ledgerWrite(d, 'FREEZE', { reason: ('lab057:cancel:' + why).slice(0, 160) });
    finish('CANCELLED', { cancelledReason: why });
    return snapshot();
  }

  function view(t) {
    if (!t) return null;
    const at = (leg) => leg.path[Math.min(leg.cursor, leg.path.length - 1)];
    return {
      tripId: t.id, status: t.status, active: ACTIVE.includes(t.status), batchId: t.batchId, commodityId: t.commodityId,
      qty: t.qty, capacity: t.capacity, custodians: t.custodians, roadFrom: t.roadFrom, hub: t.hub, railTo: t.railTo,
      road: { sessionId: t.road.sessionId, cursor: t.road.cursor, pathLength: t.road.path.length, at: at(t.road), path: t.road.path },
      rail: { sessionId: t.rail.sessionId, cursor: t.rail.cursor, pathLength: t.rail.path.length, at: at(t.rail), path: t.rail.path },
      train: t.train, ledger: t.ledger, blocked: t.blocked, cancelledReason: t.cancelledReason, failure: t.failure
    };
  }

  function snapshot() {
    if (!trip) return copy({ ok: false, reason: RS.NO_TRIP, active: false, disabled: off(), lastEnded });
    return copy(Object.assign({ ok: true, disabled: off(), lastEnded }, view(trip)));
  }

  function removePanel() {
    const p = panel;
    panel = null;
    if (p && p.root.parentNode) p.root.parentNode.removeChild(p.root);
  }

  /* 收掉這一趟（還在路上就先取消並 FREEZE），只留結果在 lastEnded。 */
  function close(why) {
    if (trip) {
      if (ACTIVE.includes(trip.status)) cancel(why);
      lastEnded = Object.assign({ endedBy: why }, view(trip));
    }
    trip = null;
    removePanel();
  }
  function end() { close('end'); return { ok: true, ended: true, lastEnded: copy(lastEnded) }; }
  function disable() { window.__noIntermodal057 = true; return end(); }

  function ensurePanel() {
    if (panel || typeof document === 'undefined' || !document.body) return panel;
    const el = (tag, id, text, css) => {
      const n = document.createElement(tag);
      if (id) n.id = id;
      if (text) n.textContent = text;
      if (css) n.style.cssText = css;
      return n;
    };
    const root = el('div', 'lab057Panel', null, PANEL_CSS);
    if (root.setAttribute) { root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'LAB-07 公鐵聯運'); }
    const title = el('div', null, 'LAB-07 公鐵聯運', 'font-weight:700;color:#7fe0c0;letter-spacing:.5px');
    const unsaved = el('div', 'lab057Unsaved', UNSAVED, 'color:#ffd38a');
    const body = el('div', 'lab057Body', null, 'margin:6px 0 8px;white-space:pre-wrap');
    const row = el('div', null, null, 'display:flex;gap:6px');
    const button = (id, label, css, fn) => {
      const b = el('button', id, label, 'padding:4px 6px;border-radius:6px;cursor:pointer;' + css);
      b.type = 'button';
      b.addEventListener('click', fn);
      row.appendChild(b);
    };
    button('lab057Advance', '前進', 'flex:1;border:1px solid #3f7f6a;background:#16251f;color:#cfffe8', () => { advance(); refresh(); });
    button('lab057Cancel', '取消', 'flex:1;border:1px solid #6b4a4a;background:#2a1d20;color:#ffd6d6', () => cancel('panel-cancel'));
    button('lab057Close', '×', 'border:1px solid #3f7f6a;background:#151d2e;color:#9fb4d8', () => end());
    root.appendChild(title);
    root.appendChild(unsaved);
    root.appendChild(body);
    root.appendChild(row);
    document.body.appendChild(root);
    panel = { root, body };
    return panel;
  }

  const STATUS_TEXT = { ROAD: '公路段', INTERCHANGE: '在轉運點', WAITING_AUTHORITY: '在轉運點等路權', RAIL: '鐵路段', DELIVERED: '已交付', CANCELLED: '已取消', FAILED: '中止' };
  function refresh() {
    if (!panel) return { ok: false, reason: 'panel-not-open' };
    if (off()) panel.body.textContent = '（逃生閥 __noIntermodal057 已關閉）';
    else if (!trip) panel.body.textContent = '目前沒有聯運任務。';
    else {
      const s = view(trip);
      const lines = [
        '批次 ' + s.batchId + '（' + s.qty + '/' + s.capacity + ' 件 ' + s.commodityId + '）',
        '狀態 ' + (STATUS_TEXT[s.status] || s.status) + '　公路 ' + s.road.cursor + '/' + (s.road.pathLength - 1) + '　鐵路 ' + s.rail.cursor + '/' + (s.rail.pathLength - 1)
      ];
      if (s.blocked) lines.push('停住：' + s.blocked.reason + (s.blocked.tile !== undefined ? ' (' + s.blocked.x + ',' + s.blocked.y + ')' : ''));
      if (s.status === 'DELIVERED') lines.push('已交給 ' + s.custodians.destination + '（影子研究帳，未寫入正式經濟）');
      if (s.status === 'CANCELLED') lines.push('已取消：' + s.cancelledReason + '　帳 ' + (s.ledger.freeze && s.ledger.freeze.ok ? 'FROZEN' : '未寫入'));
      if (s.status === 'FAILED') lines.push('中止：' + s.failure.reason + (s.failure.detail ? '（' + s.failure.detail + '）' : '') + '　帳 ' + (s.ledger.freeze && s.ledger.freeze.ok ? 'FROZEN' : '未寫入'));
      panel.body.textContent = lines.join('\n');
    }
    return { ok: true, open: true };
  }

  function open() {
    if (off()) return disabled();
    ensurePanel();
    refresh();
    return snapshot();
  }

  /* 生命週期（A5）：讀檔、開新城、離開頁面都取消並 FREEZE，再清掉這一趟與面板，不讓它跨城市活著。 */
  if (typeof load === 'function') {
    const nativeLoad057 = load;
    load = function load057() { try { close('load'); } catch (e) {} return nativeLoad057.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld057 = newWorld;
    newWorld = function newWorld057() { try { close('new-world'); } catch (e) {} return nativeWorld057.apply(this, arguments); };
  }
  window.addEventListener('pagehide', function pagehide057() { try { close('pagehide'); } catch (e) {} });

  window.GV.intermodal057 = Object.freeze({
    start, advance, cancel, snapshot, open, refresh, end, disable, reasons: RS,
    provenance: Object.freeze(Object.assign({ installed: true }, INFO))
  });
})();

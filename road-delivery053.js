/* DSK-018 / LAB-03 階段 A：真道路配送的純核心。
 * 只做兩件事：(1) 在真道路格上規劃最短路徑；(2) 一批貨的有界任務狀態機。
 * 不碰 DOM、不碰 localStorage、不寫任何模擬數值——這是隔離研發，正式經濟與存檔格式都不動。
 *
 * 同時支援 Node（module.exports）與瀏覽器（globalThis.roadDelivery053）。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.roadDelivery053 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const REASONS = Object.freeze({
    BAD_INPUT: 'bad-input',
    ORIGIN_NOT_ROAD: 'origin-not-road',
    DESTINATION_NOT_ROAD: 'destination-not-road',
    UNREACHABLE: 'unreachable',
    TOO_FAR: 'too-far'
  });

  const isInt = (v) => Number.isInteger(v);
  const fail = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});

  function normalizeGrid(roads, w, h) {
    if (!isInt(w) || !isInt(h) || w <= 0 || h <= 0) return null;
    if (!roads) return null;
    if (typeof roads.length === 'number' && roads.length === w * h) {
      return (i) => roads[i] === 1 || roads[i] === true;
    }
    if (typeof roads.isRoad === 'function') {
      return (i) => !!roads.isRoad(i % w, Math.floor(i / w));
    }
    return null;
  }

  /* 4 鄰 BFS；鄰居順序固定（上、右、下、左）＋固定 tie-break，保證決定性。 */
  function planDelivery(opts) {
    opts = opts || {};
    const { roads, w, h, origin, destination } = opts;
    const maxSteps = opts.maxSteps === undefined ? Infinity : opts.maxSteps;
    const isRoad = normalizeGrid(roads, w, h);
    if (!isRoad) return fail(REASONS.BAD_INPUT, { detail: 'grid' });
    if (!isInt(origin) || !isInt(destination)) return fail(REASONS.BAD_INPUT, { detail: 'endpoints' });
    if (origin < 0 || origin >= w * h || destination < 0 || destination >= w * h) {
      return fail(REASONS.BAD_INPUT, { detail: 'range' });
    }
    if (!isRoad(origin)) return fail(REASONS.ORIGIN_NOT_ROAD);
    if (!isRoad(destination)) return fail(REASONS.DESTINATION_NOT_ROAD);

    if (origin === destination) return { ok: true, path: [origin], steps: 0, reason: null };

    const total = w * h;
    const prev = new Int32Array(total).fill(-1);
    const seen = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0, tail = 0;
    queue[tail++] = origin;
    seen[origin] = 1;
    let found = false;

    while (head < tail) {
      const cur = queue[head++];
      if (cur === destination) { found = true; break; }
      const cx = cur % w, cy = (cur / w) | 0;
      // 上、右、下、左
      const neighbours = [
        cy > 0 ? cur - w : -1,
        cx < w - 1 ? cur + 1 : -1,
        cy < h - 1 ? cur + w : -1,
        cx > 0 ? cur - 1 : -1
      ];
      for (let k = 0; k < 4; k++) {
        const n = neighbours[k];
        if (n < 0 || seen[n]) continue;
        if (!isRoad(n)) continue;
        seen[n] = 1;
        prev[n] = cur;
        queue[tail++] = n;
      }
    }

    if (!found) return fail(REASONS.UNREACHABLE);

    const path = [];
    for (let at = destination; at !== -1; at = prev[at]) path.push(at);
    path.reverse();
    const steps = path.length - 1;
    if (steps > maxSteps) return fail(REASONS.TOO_FAR, { steps, limit: maxSteps });
    return { ok: true, path, steps, reason: null };
  }

  /* 驗證一條路徑是「真的在道路上、真的每一步相鄰」。守衛用，不是 planner 的替代品。 */
  function validatePath(path, roads, w, h) {
    const isRoad = normalizeGrid(roads, w, h);
    if (!isRoad) return { ok: false, reason: REASONS.BAD_INPUT };
    if (!Array.isArray(path) || path.length === 0) return { ok: false, reason: 'empty-path' };
    for (const p of path) {
      if (!isInt(p) || p < 0 || p >= w * h) return { ok: false, reason: 'out-of-range' };
      if (!isRoad(p)) return { ok: false, reason: 'not-road' };
    }
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i];
      const ax = a % w, ay = (a / w) | 0, bx = b % w, by = (b / w) | 0;
      if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) return { ok: false, reason: 'not-adjacent' };
    }
    return { ok: true, reason: null };
  }

  const TERMINAL = new Set(['DELIVERED', 'CANCELLED']);

  /* 一批貨、一條路徑、一個任務。狀態機：PENDING → MOVING → DELIVERED（或任何時候 CANCELLED）。 */
  function createDeliveryTask053(sessionId, plan, batch) {
    if (typeof sessionId !== 'string' || !sessionId) throw new Error('sessionId');
    if (!plan || plan.ok !== true || !Array.isArray(plan.path) || plan.path.length === 0) throw new Error('plan');
    if (!batch || typeof batch.batchId !== 'string' || !batch.batchId) throw new Error('batch.batchId');
    if (!Number.isSafeInteger(batch.qty) || batch.qty <= 0) throw new Error('batch.qty');

    const path = plan.path.slice();
    const qty = batch.qty;
    let status = path.length === 1 ? 'DELIVERED' : 'PENDING';
    let cursor = path.length === 1 ? 0 : 0;
    let cancelledReason = null;
    let steps = 0;
    let deliveredAt = status === 'DELIVERED' ? { cursor: 0, step: 0 } : null;

    function snapshot() {
      return {
        sessionId,
        batchId: batch.batchId,
        commodityId: typeof batch.commodityId === 'string' ? batch.commodityId : null,
        qty,
        status,
        cursor,
        pathLength: path.length,
        steps,
        delivered: status === 'DELIVERED',
        deliveredAt,
        cancelledReason
      };
    }

    function step() {
      if (TERMINAL.has(status)) return snapshot();
      if (status === 'PENDING') status = 'MOVING';
      cursor += 1;
      steps += 1;
      if (cursor >= path.length - 1) {
        cursor = path.length - 1;
        status = 'DELIVERED';
        deliveredAt = { cursor, step: steps };
      }
      return snapshot();
    }

    function cancel(reason) {
      if (TERMINAL.has(status)) return snapshot();
      status = 'CANCELLED';
      cancelledReason = typeof reason === 'string' && reason ? reason : 'cancelled';
      return snapshot();
    }

    return Object.freeze({ snapshot, step, cancel, path: Object.freeze(path.slice()) });
  }

  return Object.freeze({ REASONS, planDelivery, validatePath, createDeliveryTask053 });
});

/* DSK-019 / LAB-05 階段 A：兩站實載貨運鐵路的純核心。
 * 只做兩件事：(1) 在真鐵軌格上規劃路線；(2) 一列、有限容量的貨運任務狀態機。
 * 不碰 DOM、不碰 localStorage、不改任何模擬數值——隔離研發，正式經濟與存檔都不動。
 *
 * Node（module.exports）與瀏覽器（globalThis.railFreight054）雙用。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.railFreight054 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const REASONS = Object.freeze({
    BAD_INPUT: 'bad-input',
    FROM_NOT_RAIL: 'from-not-rail',
    TO_NOT_RAIL: 'to-not-rail',
    UNREACHABLE: 'unreachable',
    TOO_FAR: 'too-far',
    OVER_CAPACITY: 'over-capacity',
    NOT_ARRIVED: 'not-arrived'
  });

  const DEFAULT_CAPACITY = 12;
  const isInt = (v) => Number.isInteger(v);
  const fail = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
  const coded = (code) => Object.assign(new Error(code), { code });

  function normalizeRail(rail, w, h) {
    if (!isInt(w) || !isInt(h) || w <= 0 || h <= 0) return null;
    if (!rail) return null;
    if (typeof rail.length === 'number' && rail.length === w * h) {
      return (i) => rail[i] === 1 || rail[i] === true;
    }
    if (typeof rail.isRail === 'function') {
      return (i) => !!rail.isRail(i % w, Math.floor(i / w));
    }
    return null;
  }

  /* 4 鄰 BFS；鄰居順序固定（上、右、下、左）＋固定 tie-break，保證決定性。 */
  function planRailRoute(opts) {
    opts = opts || {};
    const { rail, w, h, from, to } = opts;
    const maxSteps = opts.maxSteps === undefined ? Infinity : opts.maxSteps;
    const isRail = normalizeRail(rail, w, h);
    if (!isRail) return fail(REASONS.BAD_INPUT, { detail: 'grid' });
    if (!isInt(from) || !isInt(to)) return fail(REASONS.BAD_INPUT, { detail: 'endpoints' });
    if (from < 0 || from >= w * h || to < 0 || to >= w * h) return fail(REASONS.BAD_INPUT, { detail: 'range' });
    if (!isRail(from)) return fail(REASONS.FROM_NOT_RAIL);
    if (!isRail(to)) return fail(REASONS.TO_NOT_RAIL);
    if (from === to) return { ok: true, path: [from], steps: 0, reason: null };

    const total = w * h;
    const prev = new Int32Array(total).fill(-1);
    const seen = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0, tail = 0, found = false;
    queue[tail++] = from; seen[from] = 1;
    while (head < tail) {
      const cur = queue[head++];
      if (cur === to) { found = true; break; }
      const cx = cur % w, cy = (cur / w) | 0;
      const nb = [cy > 0 ? cur - w : -1, cx < w - 1 ? cur + 1 : -1, cy < h - 1 ? cur + w : -1, cx > 0 ? cur - 1 : -1];
      for (let k = 0; k < 4; k++) {
        const n = nb[k];
        if (n < 0 || seen[n] || !isRail(n)) continue;
        seen[n] = 1; prev[n] = cur; queue[tail++] = n;
      }
    }
    if (!found) return fail(REASONS.UNREACHABLE);
    const path = [];
    for (let at = to; at !== -1; at = prev[at]) path.push(at);
    path.reverse();
    const steps = path.length - 1;
    if (steps > maxSteps) return fail(REASONS.TOO_FAR, { steps, limit: maxSteps });
    return { ok: true, path, steps, reason: null };
  }

  function validateRoute(path, rail, w, h) {
    const isRail = normalizeRail(rail, w, h);
    if (!isRail) return { ok: false, reason: REASONS.BAD_INPUT };
    if (!Array.isArray(path) || path.length === 0) return { ok: false, reason: 'empty-path' };
    for (const p of path) {
      if (!isInt(p) || p < 0 || p >= w * h) return { ok: false, reason: 'out-of-range' };
      if (!isRail(p)) return { ok: false, reason: 'not-rail' };
    }
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i];
      const ax = a % w, ay = (a / w) | 0, bx = b % w, by = (b / w) | 0;
      if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) return { ok: false, reason: 'not-adjacent' };
    }
    return { ok: true, reason: null };
  }

  const TERMINAL = new Set(['UNLOADED', 'ABORTED']);

  /* 一列、一批貨、一條路線。READY → RUNNING → ARRIVED → UNLOADED（或任何時候 ABORTED）。 */
  function createFreightRun054(sessionId, route, cargo, capacity) {
    if (typeof sessionId !== 'string' || !sessionId) throw coded('sessionId');
    if (!route || route.ok !== true || !Array.isArray(route.path) || route.path.length === 0) throw coded('route');
    if (!cargo || typeof cargo.batchId !== 'string' || !cargo.batchId) throw coded('batchId');
    if (!Number.isSafeInteger(cargo.qty) || cargo.qty <= 0) throw coded('qty');
    const cap = capacity === undefined ? DEFAULT_CAPACITY : capacity;
    if (!Number.isSafeInteger(cap) || cap <= 0) throw coded('capacity');
    if (cargo.qty > cap) throw coded(REASONS.OVER_CAPACITY);

    const path = route.path.slice();
    const qty = cargo.qty;
    let status = 'READY';
    let cursor = 0;
    let steps = 0;
    let abortReason = null;
    let unloadedAt = null;

    function snapshot() {
      return {
        sessionId,
        batchId: cargo.batchId,
        commodityId: typeof cargo.commodityId === 'string' ? cargo.commodityId : null,
        qty, capacity: cap, status, cursor,
        pathLength: path.length, steps,
        arrived: status === 'ARRIVED' || status === 'UNLOADED',
        unloaded: status === 'UNLOADED',
        unloadedAt, abortReason
      };
    }

    function step() {
      if (TERMINAL.has(status) || status === 'ARRIVED') return snapshot();
      if (status === 'READY') status = 'RUNNING';
      cursor += 1;
      steps += 1;
      if (cursor >= path.length - 1) { cursor = path.length - 1; status = 'ARRIVED'; }
      return snapshot();
    }

    function unload() {
      if (status !== 'ARRIVED') throw coded(REASONS.NOT_ARRIVED);
      status = 'UNLOADED';
      unloadedAt = { cursor, step: steps };
      return snapshot();
    }

    function abort(reason) {
      if (TERMINAL.has(status)) return snapshot();
      status = 'ABORTED';
      abortReason = typeof reason === 'string' && reason ? reason : 'aborted';
      return snapshot();
    }

    return Object.freeze({ snapshot, step, unload, abort, path: Object.freeze(path.slice()) });
  }

  return Object.freeze({ REASONS, DEFAULT_CAPACITY, planRailRoute, validateRoute, createFreightRun054 });
});

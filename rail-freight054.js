/* DSK-019 / LAB-05：兩站實載貨運鐵路的純核心（階段 A；T783 補齊）。
 * 只做三件事：
 *   (1) 在真鐵軌格上規劃路線：單點對單點（planRailRoute），或兩棟 k166 的貼軌格之間做多源 BFS（planBetween）；
 *   (2) 驗證貨物與容量：不合法一律 bad-input、超過容量 over-capacity（validateCargo），不靜默改值、不截斷；
 *   (3) 一列、有限容量的貨運任務狀態機（createFreightRun054）。
 * 不碰 DOM、不碰 localStorage、不用亂數與現實時間、不改任何模擬數值——隔離研發，正式經濟與存檔都不動。
 *
 * 「LAB-05 RAIL CORE 054」BEGIN／END 之間的程式碼，原封不動地內嵌在 rail-freight054-runtime.js 裡：
 * 執行期與核心用同一份規則，不另寫一份。rail-freight054-runtime.test.js 逐字比對兩份，再逐案比對行為。
 *
 * Node（module.exports）與瀏覽器（globalThis.railFreight054）雙用。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.railFreight054 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
/* LAB-05 RAIL CORE 054 BEGIN */
  'use strict';

  const REASONS = Object.freeze({
    BAD_INPUT: 'bad-input',
    FROM_NOT_RAIL: 'from-not-rail',
    TO_NOT_RAIL: 'to-not-rail',
    UNREACHABLE: 'unreachable',
    TOO_FAR: 'too-far',
    OVER_CAPACITY: 'over-capacity',
    NOT_ARRIVED: 'not-arrived',
    NOT_HUB: 'not-hub',
    HUB_NOT_ON_RAIL: 'hub-not-on-rail'
  });

  const DEFAULT_CAPACITY = 12;
  const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const isInt = (v) => Number.isInteger(v);
  const fail = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
  const coded = (code) => Object.assign(new Error(code), { code });
  const badInput = (detail) => Object.assign(new Error('bad-input:' + detail), { code: REASONS.BAD_INPUT, detail });
  // maxSteps：省略（undefined）＝不設上限；給了就必須是 >=0 的安全整數，其他值一律 bad-input，不靜默改值。
  const stepLimit = (v) => (v === undefined ? Infinity : (Number.isSafeInteger(v) && v >= 0 ? v : null));

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

  /* 多源 4 鄰 BFS：起點集合依給定順序入隊；鄰居順序固定（上、右、下、左）；出隊時碰到終點集合就停。
   * 同一輸入永遠同一條路線（決定性）；找不到回 null。path[0] 屬於起點集合、最後一格屬於終點集合。 */
  function search(isRail, w, h, sources, targets) {
    const total = w * h;
    const prev = new Int32Array(total).fill(-1);
    const seen = new Uint8Array(total);
    const goal = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0, tail = 0;
    for (const t of targets) goal[t] = 1;
    for (const s of sources) {
      if (seen[s]) continue;
      seen[s] = 1;
      queue[tail++] = s;
    }
    while (head < tail) {
      const cur = queue[head++];
      if (goal[cur]) {
        const path = [];
        for (let at = cur; at !== -1; at = prev[at]) path.push(at);
        return path.reverse();
      }
      const cx = cur % w, cy = (cur / w) | 0;
      const nb = [cy > 0 ? cur - w : -1, cx < w - 1 ? cur + 1 : -1, cy < h - 1 ? cur + w : -1, cx > 0 ? cur - 1 : -1];
      for (let k = 0; k < 4; k++) {
        const n = nb[k];
        if (n < 0 || seen[n] || !isRail(n)) continue;
        seen[n] = 1; prev[n] = cur; queue[tail++] = n;
      }
    }
    return null;
  }

  /* 單點對單點：4 鄰 BFS；鄰居順序固定（上、右、下、左）＋固定 tie-break，保證決定性。 */
  function planRailRoute(opts) {
    opts = opts || {};
    const { rail, w, h, from, to } = opts;
    const isRail = normalizeRail(rail, w, h);
    if (!isRail) return fail(REASONS.BAD_INPUT, { detail: 'grid' });
    if (!isInt(from) || !isInt(to)) return fail(REASONS.BAD_INPUT, { detail: 'endpoints' });
    if (from < 0 || from >= w * h || to < 0 || to >= w * h) return fail(REASONS.BAD_INPUT, { detail: 'range' });
    const limit = stepLimit(opts.maxSteps);
    if (limit === null) return fail(REASONS.BAD_INPUT, { detail: 'maxSteps' });
    if (!isRail(from)) return fail(REASONS.FROM_NOT_RAIL);
    if (!isRail(to)) return fail(REASONS.TO_NOT_RAIL);
    if (from === to) return { ok: true, path: [from], steps: 0, reason: null };

    const path = search(isRail, w, h, [from], [to]);
    if (!path) return fail(REASONS.UNREACHABLE);
    const steps = path.length - 1;
    if (steps > limit) return fail(REASONS.TOO_FAR, { steps, limit });
    return { ok: true, path, steps, reason: null };
  }

  /* 佔地四鄰的某類格（T783 B1「佔地四鄰至少有一格真軌」）：size×size 佔地每一格的上、右、下、左鄰格，
   * 在圖內且 isKind 為真就收（去重）。走訪順序與原生 sanRoadSeeds445 相同，只是把「道路」換成呼叫端給的判定。
   * 參數不合法回 null（呼叫端錯誤，不當成「沒有軌」）。 */
  function footprintSeeds(opts) {
    opts = opts || {};
    const { w, h, root, size, isKind } = opts;
    if (!isInt(w) || !isInt(h) || w <= 0 || h <= 0) return null;
    if (!isInt(root) || root < 0 || root >= w * h || !isInt(size) || size <= 0 || typeof isKind !== 'function') return null;
    const rx = root % w, ry = (root / w) | 0, out = [];
    for (let fy = 0; fy < size; fy++) for (let fx = 0; fx < size; fx++) for (const [dx, dy] of DIRS) {
      const nx = rx + fx + dx, ny = ry + fy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = ny * w + nx;
      if (!isKind(j) || out.includes(j)) continue;
      out.push(j);
    }
    return out;
  }

  // 貼軌格清單必須是陣列，且每一格都在圖內、真的是鐵軌；不是就是呼叫端錯誤（bad-input），不偷偷過濾。
  function cellList(list, total, isRail) {
    if (!Array.isArray(list)) return null;
    for (const c of list) if (!isInt(c) || c < 0 || c >= total || !isRail(c)) return null;
    return list.slice();
  }

  /* 兩棟聯運中心（k166）之間（T783 B1）。
   *  - 兩端都必須是 k166 的根格（isHubRoot），否則 not-hub（side 指出哪一端）；
   *  - 兩端各取佔地四鄰的真軌格（railFrontage），空的就 hub-not-on-rail；
   *  - 起點貼軌集合 → 終點貼軌集合沿真軌做多源 BFS；不在同一個鐵軌連通分量上就找不到 → unreachable；
   *  - 超過 maxSteps 就 too-far。回傳的 path 第一格貼起點、最後一格貼終點。 */
  function planBetween(opts) {
    opts = opts || {};
    const { rail, w, h, origin, destination, isHubRoot, railFrontage } = opts;
    const isRail = normalizeRail(rail, w, h);
    if (!isRail) return fail(REASONS.BAD_INPUT, { detail: 'grid' });
    if (typeof isHubRoot !== 'function' || typeof railFrontage !== 'function') return fail(REASONS.BAD_INPUT, { detail: 'world' });
    if (!isInt(origin) || !isInt(destination)) return fail(REASONS.BAD_INPUT, { detail: 'endpoints' });
    const total = w * h;
    if (origin < 0 || origin >= total || destination < 0 || destination >= total) return fail(REASONS.BAD_INPUT, { detail: 'range' });
    const limit = stepLimit(opts.maxSteps);
    if (limit === null) return fail(REASONS.BAD_INPUT, { detail: 'maxSteps' });
    if (!isHubRoot(origin)) return fail(REASONS.NOT_HUB, { side: 'origin' });
    if (!isHubRoot(destination)) return fail(REASONS.NOT_HUB, { side: 'destination' });
    const sources = cellList(railFrontage(origin), total, isRail);
    const targets = cellList(railFrontage(destination), total, isRail);
    if (!sources || !targets) return fail(REASONS.BAD_INPUT, { detail: 'frontage' });
    if (!sources.length) return fail(REASONS.HUB_NOT_ON_RAIL, { side: 'origin' });
    if (!targets.length) return fail(REASONS.HUB_NOT_ON_RAIL, { side: 'destination' });
    const path = search(isRail, w, h, sources, targets);
    if (!path) return fail(REASONS.UNREACHABLE);
    const steps = path.length - 1;
    if (steps > limit) return fail(REASONS.TOO_FAR, { steps, limit });
    return {
      ok: true, path, steps, reason: null,
      originRoot: origin, destinationRoot: destination, originFrontage: sources, destinationFrontage: targets
    };
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

  /* 貨物與容量（T783 B2）：不合法一律 bad-input（detail 指出哪一欄），超過容量 over-capacity，不靜默改值、不截斷。
   *  - batchId：非空字串；qty：正的安全整數；commodityId：可省略（undefined 或 null 都記成 null），給了就必須是非空字串；
   *  - capacity：省略（undefined）＝預設 12，給了就必須是正的安全整數（0、-1、'x'、null 都拒絕）。
   * 其他欄位這裡不讀（maxSteps 由規劃函式自己檢查）。回傳的 cargo 是新物件；正規化後的 cargo＋capacity 再驗一次
   * 結果不變（冪等），所以執行期可以把它直接交給 createFreightRun054。 */
  function validateCargo(cargo, capacity) {
    if (!cargo || typeof cargo !== 'object' || Array.isArray(cargo)) return fail(REASONS.BAD_INPUT, { detail: 'cargo' });
    if (typeof cargo.batchId !== 'string' || !cargo.batchId) return fail(REASONS.BAD_INPUT, { detail: 'batchId' });
    if (!Number.isSafeInteger(cargo.qty) || cargo.qty <= 0) return fail(REASONS.BAD_INPUT, { detail: 'qty' });
    const unspecified = cargo.commodityId === undefined || cargo.commodityId === null;
    if (!unspecified && (typeof cargo.commodityId !== 'string' || !cargo.commodityId)) {
      return fail(REASONS.BAD_INPUT, { detail: 'commodityId' });
    }
    const cap = capacity === undefined ? DEFAULT_CAPACITY : capacity;
    if (!Number.isSafeInteger(cap) || cap <= 0) return fail(REASONS.BAD_INPUT, { detail: 'capacity' });
    if (cargo.qty > cap) return fail(REASONS.OVER_CAPACITY, { qty: cargo.qty, capacity: cap });
    return {
      ok: true, reason: null, capacity: cap,
      cargo: { batchId: cargo.batchId, qty: cargo.qty, commodityId: unspecified ? null : cargo.commodityId }
    };
  }

  const TERMINAL = new Set(['UNLOADED', 'ABORTED']);

  /* 一列、一批貨、一條路線。READY → RUNNING → ARRIVED → UNLOADED（或任何時候 ABORTED）。
   * 不合法的輸入丟出 code＝'bad-input' 的錯誤；超過容量丟出 code＝'over-capacity'。 */
  function createFreightRun054(sessionId, route, cargo, capacity) {
    if (typeof sessionId !== 'string' || !sessionId) throw badInput('sessionId');
    if (!route || route.ok !== true || !Array.isArray(route.path) || route.path.length === 0) throw badInput('route');
    const checked = validateCargo(cargo, capacity);
    if (!checked.ok) throw checked.reason === REASONS.OVER_CAPACITY ? coded(REASONS.OVER_CAPACITY) : badInput(checked.detail);
    const load = checked.cargo;
    const cap = checked.capacity;

    const path = route.path.slice();
    const qty = load.qty;
    let status = 'READY';
    let cursor = 0;
    let steps = 0;
    let abortReason = null;
    let unloadedAt = null;

    function snapshot() {
      return {
        sessionId,
        batchId: load.batchId,
        commodityId: load.commodityId,
        qty, capacity: cap, status, cursor,
        pathLength: path.length, steps,
        arrived: status === 'ARRIVED' || status === 'UNLOADED',
        unloaded: status === 'UNLOADED',
        unloadedAt: unloadedAt ? { cursor: unloadedAt.cursor, step: unloadedAt.step } : null,
        abortReason
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

  return Object.freeze({
    REASONS, DEFAULT_CAPACITY, planRailRoute, planBetween, footprintSeeds, validateRoute, validateCargo, createFreightRun054
  });
/* LAB-05 RAIL CORE 054 END */
});

/* DSK-018 / LAB-03：真道路配送的純核心（階段 A；T782 補齊）。
 * 只做三件事：
 *   (1) 在真道路格上規劃最短路徑：單點對單點（planDelivery），或兩棟物流建築的前接之間做多源 BFS（planBetween）；
 *   (2) 驗證批次輸入：不合法一律 bad-input（validateBatch），不靜默改值；
 *   (3) 一批貨的有界任務狀態機（createDeliveryTask053）。
 * 不碰 DOM、不碰 localStorage、不用亂數與現實時間、不寫任何模擬數值——這是隔離研發，正式經濟與存檔格式都不動。
 *
 * 「LAB-03 ROAD CORE 053」BEGIN／END 之間的程式碼，原封不動地內嵌在 road-delivery053-runtime.js 裡：
 * 執行期與核心用同一份規則，不另寫一份。road-delivery053-runtime.test.js 逐字比對兩份，再逐案比對行為。
 *
 * 同時支援 Node（module.exports）與瀏覽器（globalThis.roadDelivery053）。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.roadDelivery053 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
/* LAB-03 ROAD CORE 053 BEGIN */
  'use strict';

  const REASONS = Object.freeze({
    BAD_INPUT: 'bad-input',
    ORIGIN_NOT_ROAD: 'origin-not-road',
    DESTINATION_NOT_ROAD: 'destination-not-road',
    UNREACHABLE: 'unreachable',
    TOO_FAR: 'too-far',
    NOT_LOGISTICS: 'not-logistics',
    NO_FRONTAGE: 'no-frontage'
  });

  const isInt = (v) => Number.isInteger(v);
  const fail = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
  const badInput = (detail) => Object.assign(new Error('bad-input:' + detail), { code: REASONS.BAD_INPUT, detail });
  // maxSteps：省略（undefined）＝不設上限；給了就必須是 >=0 的安全整數，其他值一律 bad-input，不靜默改值。
  const stepLimit = (v) => (v === undefined ? Infinity : (Number.isSafeInteger(v) && v >= 0 ? v : null));

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

  /* 多源 4 鄰 BFS：起點集合依給定順序入隊；鄰居順序固定（上、右、下、左）；出隊時碰到終點集合就停。
   * 同一輸入永遠同一條路徑（決定性）；找不到回 null。path[0] 一定屬於起點集合、最後一格一定屬於終點集合。 */
  function search(isRoad, w, h, sources, targets) {
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
    return null;
  }

  /* 單點對單點：4 鄰 BFS；鄰居順序固定（上、右、下、左）＋固定 tie-break，保證決定性。 */
  function planDelivery(opts) {
    opts = opts || {};
    const { roads, w, h, origin, destination } = opts;
    const isRoad = normalizeGrid(roads, w, h);
    if (!isRoad) return fail(REASONS.BAD_INPUT, { detail: 'grid' });
    if (!isInt(origin) || !isInt(destination)) return fail(REASONS.BAD_INPUT, { detail: 'endpoints' });
    if (origin < 0 || origin >= w * h || destination < 0 || destination >= w * h) {
      return fail(REASONS.BAD_INPUT, { detail: 'range' });
    }
    const limit = stepLimit(opts.maxSteps);
    if (limit === null) return fail(REASONS.BAD_INPUT, { detail: 'maxSteps' });
    if (!isRoad(origin)) return fail(REASONS.ORIGIN_NOT_ROAD);
    if (!isRoad(destination)) return fail(REASONS.DESTINATION_NOT_ROAD);

    if (origin === destination) return { ok: true, path: [origin], steps: 0, reason: null };

    const path = search(isRoad, w, h, [origin], [destination]);
    if (!path) return fail(REASONS.UNREACHABLE);
    const steps = path.length - 1;
    if (steps > limit) return fail(REASONS.TOO_FAR, { steps, limit });
    return { ok: true, path, steps, reason: null };
  }

  // 前接格清單必須是陣列，且每一格都在圖內、真的是道路；不是就是呼叫端錯誤（bad-input），不偷偷過濾。
  function cellList(list, total, isRoad) {
    if (!Array.isArray(list)) return null;
    for (const c of list) if (!isInt(c) || c < 0 || c >= total || !isRoad(c)) return null;
    return list.slice();
  }

  /* 兩棟物流建築之間（T782 B1）。
   *  - 兩端都必須是物流建築的根格（isLogisticsRoot），否則 not-logistics（side 指出哪一端）；
   *  - 兩端各用 frontage(root) 取前接道路格（執行期是原生 sanRoadSeeds445），空的就 no-frontage；
   *  - 起點前接集合 → 終點前接集合做多源 BFS，找不到 unreachable；超過 maxSteps 就 too-far。
   * 回傳的 path 第一格屬於起點前接、最後一格屬於終點前接。 */
  function planBetween(opts) {
    opts = opts || {};
    const { roads, w, h, origin, destination, isLogisticsRoot, frontage } = opts;
    const isRoad = normalizeGrid(roads, w, h);
    if (!isRoad) return fail(REASONS.BAD_INPUT, { detail: 'grid' });
    if (typeof isLogisticsRoot !== 'function' || typeof frontage !== 'function') return fail(REASONS.BAD_INPUT, { detail: 'world' });
    if (!isInt(origin) || !isInt(destination)) return fail(REASONS.BAD_INPUT, { detail: 'endpoints' });
    const total = w * h;
    if (origin < 0 || origin >= total || destination < 0 || destination >= total) return fail(REASONS.BAD_INPUT, { detail: 'range' });
    const limit = stepLimit(opts.maxSteps);
    if (limit === null) return fail(REASONS.BAD_INPUT, { detail: 'maxSteps' });
    if (!isLogisticsRoot(origin)) return fail(REASONS.NOT_LOGISTICS, { side: 'origin' });
    if (!isLogisticsRoot(destination)) return fail(REASONS.NOT_LOGISTICS, { side: 'destination' });
    const sources = cellList(frontage(origin), total, isRoad);
    const targets = cellList(frontage(destination), total, isRoad);
    if (!sources || !targets) return fail(REASONS.BAD_INPUT, { detail: 'frontage' });
    if (!sources.length) return fail(REASONS.NO_FRONTAGE, { side: 'origin' });
    if (!targets.length) return fail(REASONS.NO_FRONTAGE, { side: 'destination' });
    const path = search(isRoad, w, h, sources, targets);
    if (!path) return fail(REASONS.UNREACHABLE);
    const steps = path.length - 1;
    if (steps > limit) return fail(REASONS.TOO_FAR, { steps, limit });
    return {
      ok: true, path, steps, reason: null,
      originRoot: origin, destinationRoot: destination, originFrontage: sources, destinationFrontage: targets
    };
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

  /* 批次輸入（T782 B2）：不合法一律 bad-input（detail 指出哪一欄），不靜默改值。
   *  - batchId：非空字串；qty：正的安全整數（0、-3、2.5、'5'、null 都拒絕）；
   *  - commodityId：可省略（記成 null），給了就必須是非空字串。
   * 其他欄位這裡不讀（maxSteps 由規劃函式自己檢查）。回傳的 batch 是新物件，之後改呼叫端的物件不影響任務。 */
  function validateBatch(batch) {
    if (!batch || typeof batch !== 'object' || Array.isArray(batch)) return fail(REASONS.BAD_INPUT, { detail: 'batch' });
    if (typeof batch.batchId !== 'string' || !batch.batchId) return fail(REASONS.BAD_INPUT, { detail: 'batchId' });
    if (!Number.isSafeInteger(batch.qty) || batch.qty <= 0) return fail(REASONS.BAD_INPUT, { detail: 'qty' });
    if (batch.commodityId !== undefined && (typeof batch.commodityId !== 'string' || !batch.commodityId)) {
      return fail(REASONS.BAD_INPUT, { detail: 'commodityId' });
    }
    return {
      ok: true, reason: null,
      batch: { batchId: batch.batchId, qty: batch.qty, commodityId: batch.commodityId === undefined ? null : batch.commodityId }
    };
  }

  const TERMINAL = new Set(['DELIVERED', 'CANCELLED']);

  /* 一批貨、一條路徑、一個任務。狀態機：PENDING → MOVING → DELIVERED（或任何時候 CANCELLED）。
   * 不合法的輸入丟出 code＝'bad-input' 的錯誤（detail 指出哪一欄）。 */
  function createDeliveryTask053(sessionId, plan, batch) {
    if (typeof sessionId !== 'string' || !sessionId) throw badInput('sessionId');
    if (!plan || plan.ok !== true || !Array.isArray(plan.path) || plan.path.length === 0) throw badInput('plan');
    const checked = validateBatch(batch);
    if (!checked.ok) throw badInput(checked.detail);
    const cargo = checked.batch;

    const path = plan.path.slice();
    const qty = cargo.qty;
    let status = path.length === 1 ? 'DELIVERED' : 'PENDING';
    let cursor = 0;
    let cancelledReason = null;
    let steps = 0;
    let deliveredAt = status === 'DELIVERED' ? { cursor: 0, step: 0 } : null;

    function snapshot() {
      return {
        sessionId,
        batchId: cargo.batchId,
        commodityId: cargo.commodityId,
        qty,
        status,
        cursor,
        pathLength: path.length,
        steps,
        delivered: status === 'DELIVERED',
        deliveredAt: deliveredAt ? { cursor: deliveredAt.cursor, step: deliveredAt.step } : null,
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

  return Object.freeze({ REASONS, planDelivery, planBetween, validatePath, validateBatch, createDeliveryTask053 });
/* LAB-03 ROAD CORE 053 END */
});

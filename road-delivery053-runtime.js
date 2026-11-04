/* DSK-018 / LAB-03：真道路配送的執行期接線（階段 B；T782 補齊）。會被原封不動內嵌進 index.html。
 * 邊界：只讀道路格與建築，只在影子任務裡推進一批貨；不寫金錢／商品／人口／客流／存檔，不用亂數與現實時間。
 * 規則：「LAB-03 ROAD CORE 053」BEGIN／END 之間是 road-delivery053.js 純核心的原文（逐字相同，測試會比對），
 *       執行期只補「從真城市取地格、建築與前接」與面板、生命週期，不另寫一份規則。
 * 逃生閥：window.__noRoadDelivery053。
 *   - 安裝當下就開著：整段不安裝（不改寫 load／newWorld、不掛 pagehide、不建面板），API 一律回 disabled。
 *   - 安裝之後才打開：規劃、開始、推進、開面板都回 disabled；取消、結束、快照照常。
 * 對外：window.GV.roadDelivery053.{plan,start,startBetween,step,cancel,snapshot,open,refresh,end,disable,provenance}
 */
(function installRoadDelivery053() {
  'use strict';
  const INFO = { module: 'road-delivery053', lab: 'LAB-03', card: 'T782', isolation: 'shadow-only', persisted: false };
  const DISABLED = 'disabled';

  if (window.__noRoadDelivery053) {
    // T782 B3：閥門在安裝當下已開 → 什麼都不裝，只留一個一律回 disabled 的 API。
    const no = () => ({ ok: false, reason: DISABLED, installed: false });
    const inert = { plan: no, start: no, startBetween: no, step: no, cancel: no, open: no, refresh: no, end: no, disable: no };
    inert.snapshot = () => ({ ok: false, reason: DISABLED, active: false, disabled: true, installed: false });
    inert.provenance = Object.freeze(Object.assign({ installed: false }, INFO));
    window.GV.roadDelivery053 = Object.freeze(inert);
    return;
  }

  const core = (function () {
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
   *  - commodityId：可省略（undefined 或 null 都記成 null，與快照的寫法一致），給了就必須是非空字串。
   * 正規化後的 batch 再驗一次結果不變（冪等），所以執行期可以把它直接交給 createDeliveryTask053。
   * 其他欄位這裡不讀（maxSteps 由規劃函式自己檢查）。回傳的 batch 是新物件，之後改呼叫端的物件不影響任務。 */
  function validateBatch(batch) {
    if (!batch || typeof batch !== 'object' || Array.isArray(batch)) return fail(REASONS.BAD_INPUT, { detail: 'batch' });
    if (typeof batch.batchId !== 'string' || !batch.batchId) return fail(REASONS.BAD_INPUT, { detail: 'batchId' });
    if (!Number.isSafeInteger(batch.qty) || batch.qty <= 0) return fail(REASONS.BAD_INPUT, { detail: 'qty' });
    const unspecified = batch.commodityId === undefined || batch.commodityId === null;
    if (!unspecified && (typeof batch.commodityId !== 'string' || !batch.commodityId)) {
      return fail(REASONS.BAD_INPUT, { detail: 'commodityId' });
    }
    return {
      ok: true, reason: null,
      batch: { batchId: batch.batchId, qty: batch.qty, commodityId: unspecified ? null : batch.commodityId }
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
  })();

  const NO_TASK = 'no-task', BUSY = 'busy';
  const UNSAVED = '未保存：重新整理或讀檔就會消失';
  // 面板固定位置（T782 B5）：左上、HUD 下方；LAB-05 面板在它正下方（top:296px），兩者固定高度、互不重疊。
  const PANEL_CSS = 'position:fixed;left:12px;top:84px;width:260px;height:200px;max-width:calc(100vw - 24px);' +
    'box-sizing:border-box;overflow:auto;z-index:9999;padding:10px 12px;' +
    'background:rgba(14,20,34,.94);border:1px solid rgba(96,142,220,.55);border-radius:10px;' +
    'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
  const off = () => !!window.__noRoadDelivery053;
  const copy = (v) => JSON.parse(JSON.stringify(v));
  const no = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
  let task = null;   // { run: 核心任務, mode, originRoot, destinationRoot, provenance }
  let panel = null;  // { root, body }
  let seq = 0;

  // 真城市的道路視圖：每次規劃都現讀 tiles（不快取；讀檔、開新城之後自然是新地格）。
  function grid() {
    if (!Array.isArray(tiles) || !Number.isInteger(N) || N <= 0 || tiles.length !== N * N) return null;
    return { isRoad: (x, y) => { const t = tiles[y * N + x]; return !!(t && t.road); } };
  }
  // 物流建築的根格：k 在原生 LOGISTICS_META485 裡（目前 165–174），而且不是佔地的參照格（ref）。
  function isLogisticsRoot(i) {
    const b = tiles[i] && tiles[i].bld;
    return !!(b && !b.ref && Object.prototype.hasOwnProperty.call(LOGISTICS_META485, b.k));
  }
  // 前接道路格：一律用原生 sanRoadSeeds445（與 logisticsOperational485 同一個判定）。
  const frontage = (i) => sanRoadSeeds445(i);

  function isActive() {
    if (!task) return false;
    const s = task.run.snapshot().status;
    return s !== 'DELIVERED' && s !== 'CANCELLED';
  }
  function busy() {
    const s = task.run.snapshot();
    return no(BUSY, { sessionId: s.sessionId, batchId: s.batchId, status: s.status });
  }
  function begin(p, batch, mode, originRoot, destinationRoot) {
    const sessionId = 'lab053-' + (++seq);
    task = {
      run: core.createDeliveryTask053(sessionId, p, batch), mode, originRoot, destinationRoot,
      provenance: Object.assign({ version: typeof GAME_VER === 'string' ? GAME_VER : null,
        anchor: typeof GAME_ANCHOR === 'string' ? GAME_ANCHOR : null }, INFO)
    };
    refresh();
    return Object.assign(copy(p), { sessionId });
  }

  /* 單點對單點（道路格 → 道路格）。LAB-07 借它規劃，不建任務。 */
  function plan(origin, destination, maxSteps) {
    if (off()) return no(DISABLED);
    return core.planDelivery({ roads: grid(), w: N, h: N, origin, destination, maxSteps });
  }

  /* 道路格 → 道路格的一批貨。順序：disabled → busy → bad-input（批次）→ 規劃的理由。 */
  function start(origin, destination, batch) {
    if (off()) return no(DISABLED);
    if (isActive()) return busy();
    const checked = core.validateBatch(batch);
    if (!checked.ok) return checked;
    const p = core.planDelivery({ roads: grid(), w: N, h: N, origin, destination, maxSteps: batch.maxSteps });
    if (!p.ok) return p;
    return begin(p, checked.batch, 'tiles', null, null);
  }

  /* 兩棟物流建築之間的一批貨（T782 B1）：理由 not-logistics／no-frontage／unreachable 各自分開。 */
  function startBetween(originRoot, destinationRoot, batch) {
    if (off()) return no(DISABLED);
    if (isActive()) return busy();
    const checked = core.validateBatch(batch);
    if (!checked.ok) return checked;
    const p = core.planBetween({ roads: grid(), w: N, h: N, origin: originRoot, destination: destinationRoot,
      isLogisticsRoot, frontage, maxSteps: batch.maxSteps });
    if (!p.ok) return p;
    return begin(p, checked.batch, 'between', originRoot, destinationRoot);
  }

  function snapshot() {
    if (!task) return { ok: false, reason: NO_TASK, active: false, disabled: off() };
    const s = task.run.snapshot();
    // 深拷貝（T782 B4）：呼叫端改回傳值，不會改到任務本身。
    return copy(Object.assign({ ok: true, active: s.status !== 'DELIVERED' && s.status !== 'CANCELLED', disabled: off() }, s, {
      path: task.run.path, mode: task.mode, originRoot: task.originRoot, destinationRoot: task.destinationRoot,
      provenance: task.provenance
    }));
  }

  function step() {
    if (off()) return { ok: false, reason: DISABLED, snapshot: snapshot() };
    if (!task) return { ok: false, reason: NO_TASK, snapshot: snapshot() };
    task.run.step();
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function cancel(reason) {
    if (!task) return snapshot();
    task.run.cancel(reason);
    refresh();
    return snapshot();
  }

  function removePanel() {
    const p = panel;
    panel = null;
    if (p && p.root.parentNode) p.root.parentNode.removeChild(p.root);
  }

  function end() {
    task = null;
    removePanel();
    return { ok: true, ended: true };
  }

  function disable() {
    window.__noRoadDelivery053 = true;
    return end();
  }

  /* 面板：預設不存在；只有明確 open() 才會建立 DOM，end()、讀檔、開新城、pagehide 都會移除。 */
  function ensurePanel() {
    if (panel || typeof document === 'undefined' || !document.body) return panel;
    const el = (tag, id, text, css) => {
      const n = document.createElement(tag);
      if (id) n.id = id;
      if (text) n.textContent = text;
      if (css) n.style.cssText = css;
      return n;
    };
    const root = el('div', 'lab053Panel', null, PANEL_CSS);
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'LAB-03 影子配送');
    const title = el('div', null, 'LAB-03 影子配送', 'font-weight:700;color:#8fc2ff;letter-spacing:.5px');
    const unsaved = el('div', 'lab053Unsaved', UNSAVED, 'color:#ffd38a');
    const body = el('div', 'lab053Body', null, 'margin:6px 0 8px;white-space:pre-wrap');
    const row = el('div', null, null, 'display:flex;gap:6px');
    const button = (id, label, css, fn) => {
      const b = el('button', id, label, 'padding:4px 6px;border-radius:6px;cursor:pointer;' + css);
      b.type = 'button';
      b.addEventListener('click', fn);
      row.appendChild(b);
    };
    button('lab053Step', '前進一格', 'flex:1;border:1px solid #46608f;background:#1b2740;color:#cfe0ff', () => step());
    button('lab053Cancel', '取消', 'flex:1;border:1px solid #6b4a4a;background:#2a1d20;color:#ffd6d6', () => cancel('panel-cancel'));
    button('lab053Close', '×', 'border:1px solid #46608f;background:#151d2e;color:#9fb4d8', () => end());
    root.appendChild(title);
    root.appendChild(unsaved);
    root.appendChild(body);
    root.appendChild(row);
    document.body.appendChild(root);
    panel = { root, body };
    return panel;
  }

  function refresh() {
    if (!panel) return { ok: false, reason: 'panel-not-open' };
    if (off()) panel.body.textContent = '（逃生閥 __noRoadDelivery053 已關閉）';
    else if (!task) panel.body.textContent = '目前沒有配送任務。';
    else {
      const s = snapshot();
      panel.body.textContent = '批次 ' + s.batchId + '（' + s.qty + ' 件 ' + (s.commodityId || '未指定') + '）\n' +
        '狀態 ' + s.status + '　進度 ' + s.cursor + '/' + (s.pathLength - 1) + '\n' +
        (s.status === 'DELIVERED' ? '已送達（影子帳，未寫入正式經濟）' : (s.status === 'CANCELLED' ? '已取消：' + s.cancelledReason : '沿真道路前進中'));
    }
    return { ok: true, open: true };
  }

  function open() {
    if (off()) return no(DISABLED);
    ensurePanel();
    refresh();
    return snapshot();
  }

  /* 生命週期（T782 B4）：讀檔、開新城、離開頁面都取消任務並移除面板，不讓它跨城市活著。 */
  function lifecycle(reason) {
    if (task) task.run.cancel(reason);
    removePanel();
  }
  if (typeof load === 'function') {
    const nativeLoad053 = load;
    load = function load053() { try { lifecycle('load'); } catch (e) {} return nativeLoad053.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld053 = newWorld;
    newWorld = function newWorld053() { try { lifecycle('new-world'); } catch (e) {} return nativeWorld053.apply(this, arguments); };
  }
  window.addEventListener('pagehide', function pagehide053() { try { lifecycle('pagehide'); } catch (e) {} });

  window.GV.roadDelivery053 = Object.freeze({
    plan, start, startBetween, step, cancel, snapshot, open, refresh, end, disable,
    provenance: Object.freeze(Object.assign({ installed: true }, INFO))
  });
})();

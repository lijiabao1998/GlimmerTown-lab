/* DSK-019 / LAB-05：兩站實載貨運鐵路的執行期接線（階段 B；T783 補齊）。會被原封不動內嵌進 index.html。
 * 邊界：只讀鐵軌格與建築，只在影子任務裡推進一列車；不寫金錢／商品／人口／客流／存檔，不用亂數與現實時間。
 * 規則：「LAB-05 RAIL CORE 054」BEGIN／END 之間是 rail-freight054.js 純核心的原文（逐字相同，測試會比對），
 *       執行期只補「從真城市取軌道、建築與貼軌格」與面板、生命週期，不另寫一份規則。
 * 車站＝貼著真軌的 k166（原卡定義）；不註冊站別、不改 T462／T463 的客運統計。
 * 逃生閥：window.__noRailFreight054。
 *   - 安裝當下就開著：整段不安裝（不改寫 load／newWorld、不掛 pagehide、不建面板），API 一律回 disabled。
 *   - 安裝之後才打開：規劃、開始、推進、卸貨、開面板都回 disabled；中止、結束、快照照常。
 * 對外：window.GV.railFreight054.{plan,start,runBetween,step,unload,abort,snapshot,open,refresh,end,disable,provenance}
 */
(function installRailFreight054() {
  'use strict';
  const INFO = { module: 'rail-freight054', lab: 'LAB-05', card: 'T783', isolation: 'shadow-only', persisted: false, defaultCapacity: 12 };
  const DISABLED = 'disabled';

  if (window.__noRailFreight054) {
    // T783 B3：閥門在安裝當下已開 → 什麼都不裝，只留一個一律回 disabled 的 API。
    const no = () => ({ ok: false, reason: DISABLED, installed: false });
    const inert = { plan: no, start: no, runBetween: no, step: no, unload: no, abort: no, open: no, refresh: no, end: no, disable: no };
    inert.snapshot = () => ({ ok: false, reason: DISABLED, active: false, disabled: true, installed: false });
    inert.provenance = Object.freeze(Object.assign({ installed: false }, INFO));
    window.GV.railFreight054 = Object.freeze(inert);
    return;
  }

  const core = (function () {
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
  })();

  const NO_RUN = 'no-run', BUSY = 'busy', HUB_K = 166;
  const UNSAVED = '未保存：重新整理或讀檔就會消失';
  // 面板固定位置（T783 B5；T785 統一四格）：左欄第 2 格，在 LAB-03 正下方；格高 (100vh-120px)/4、間隔 8px，四格互不重疊。
  const PANEL_CSS = 'position:fixed;left:12px;top:calc(84px + 1 * ((100vh - 120px) / 4 + 8px));width:min(260px, calc(100vw - 24px));height:calc((100vh - 120px) / 4);' +
    'box-sizing:border-box;overflow:auto;z-index:9999;padding:10px 12px;' +
    'background:rgba(14,20,34,.94);border:1px solid rgba(96,142,220,.55);border-radius:10px;' +
    'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
  const off = () => !!window.__noRailFreight054;
  const copy = (v) => JSON.parse(JSON.stringify(v));
  const no = (reason, extra) => Object.assign({ ok: false, path: [], steps: -1, reason }, extra || {});
  let run = null;    // { train: 核心任務, mode, originRoot, destinationRoot, provenance }
  let panel = null;  // { root, body }
  let seq = 0;

  // 真城市的鐵軌視圖：每次規劃都現讀 tiles（不快取；讀檔、開新城之後自然是新地格）。
  function grid() {
    if (!Array.isArray(tiles) || !Number.isInteger(N) || N <= 0 || tiles.length !== N * N) return null;
    return { isRail: (x, y) => { const t = tiles[y * N + x]; return !!(t && t.rail); } };
  }
  // 車站＝k166（鐵公路聯運中心）的根格，不是佔地的參照格（ref）。
  function isHubRoot(i) {
    const b = tiles[i] && tiles[i].bld;
    return !!(b && !b.ref && b.k === HUB_K);
  }
  // 貼軌格：k166 佔地四鄰的真軌格（佔地大小取原生寫進建築的 sz，與 sanRoadSeeds445 同一規則）。
  function railFrontage(i) {
    const b = tiles[i] && tiles[i].bld;
    if (!b) return [];
    return core.footprintSeeds({ w: N, h: N, root: i, size: Math.max(1, b.sz || 1), isKind: (j) => !!(tiles[j] && tiles[j].rail) });
  }

  function isActive() {
    if (!run) return false;
    const s = run.train.snapshot().status;
    return s !== 'UNLOADED' && s !== 'ABORTED';
  }
  function busy() {
    const s = run.train.snapshot();
    return no(BUSY, { sessionId: s.sessionId, batchId: s.batchId, status: s.status });
  }
  function begin(p, checked, mode, originRoot, destinationRoot) {
    const sessionId = 'lab054-' + (++seq);
    run = {
      train: core.createFreightRun054(sessionId, p, checked.cargo, checked.capacity), mode, originRoot, destinationRoot,
      provenance: Object.assign({ version: typeof GAME_VER === 'string' ? GAME_VER : null,
        anchor: typeof GAME_ANCHOR === 'string' ? GAME_ANCHOR : null }, INFO)
    };
    refresh();
    return Object.assign(copy(p), { sessionId, capacity: checked.capacity });
  }

  /* 單點對單點（軌道格 → 軌道格）。LAB-06／LAB-07 借它規劃，不建任務。 */
  function plan(from, to, maxSteps) {
    if (off()) return no(DISABLED);
    return core.planRailRoute({ rail: grid(), w: N, h: N, from, to, maxSteps });
  }

  /* 軌道格 → 軌道格的一列車。順序：disabled → busy → bad-input／over-capacity（貨物與容量）→ 規劃的理由。 */
  function start(from, to, cargo, capacity) {
    if (off()) return no(DISABLED);
    if (isActive()) return busy();
    const checked = core.validateCargo(cargo, capacity);
    if (!checked.ok) return checked;
    const p = core.planRailRoute({ rail: grid(), w: N, h: N, from, to, maxSteps: cargo.maxSteps });
    if (!p.ok) return p;
    return begin(p, checked, 'tiles', null, null);
  }

  /* 兩棟貼軌 k166 之間的一列車（T783 B1）：理由 not-hub／hub-not-on-rail／unreachable 各自分開。 */
  function runBetween(originHubRoot, destinationHubRoot, batch, capacity) {
    if (off()) return no(DISABLED);
    if (isActive()) return busy();
    const checked = core.validateCargo(batch, capacity);
    if (!checked.ok) return checked;
    const p = core.planBetween({ rail: grid(), w: N, h: N, origin: originHubRoot, destination: destinationHubRoot,
      isHubRoot, railFrontage, maxSteps: batch.maxSteps });
    if (!p.ok) return p;
    return begin(p, checked, 'between', originHubRoot, destinationHubRoot);
  }

  function snapshot() {
    if (!run) return { ok: false, reason: NO_RUN, active: false, disabled: off() };
    const s = run.train.snapshot();
    // 深拷貝（T783 B4）：呼叫端改回傳值，不會改到任務本身。
    return copy(Object.assign({ ok: true, active: s.status !== 'UNLOADED' && s.status !== 'ABORTED', disabled: off() }, s, {
      path: run.train.path, mode: run.mode, originRoot: run.originRoot, destinationRoot: run.destinationRoot,
      provenance: run.provenance
    }));
  }

  function step() {
    if (off()) return { ok: false, reason: DISABLED, snapshot: snapshot() };
    if (!run) return { ok: false, reason: NO_RUN, snapshot: snapshot() };
    run.train.step();
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function unload() {
    if (off()) return { ok: false, reason: DISABLED, snapshot: snapshot() };
    if (!run) return { ok: false, reason: NO_RUN, snapshot: snapshot() };
    try { run.train.unload(); } catch (e) { return { ok: false, reason: (e && e.code) || core.REASONS.NOT_ARRIVED, snapshot: snapshot() }; }
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function abort(reason) {
    if (!run) return snapshot();
    run.train.abort(reason);
    refresh();
    return snapshot();
  }

  function removePanel() {
    const p = panel;
    panel = null;
    if (p && p.root.parentNode) p.root.parentNode.removeChild(p.root);
  }

  function end() {
    run = null;
    removePanel();
    return { ok: true, ended: true };
  }

  function disable() { window.__noRailFreight054 = true; return end(); }

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
    const root = el('div', 'lab054Panel', null, PANEL_CSS);
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'LAB-05 影子貨運列車');
    const title = el('div', null, 'LAB-05 影子貨運列車', 'font-weight:700;color:#8fc2ff;letter-spacing:.5px');
    const unsaved = el('div', 'lab054Unsaved', UNSAVED, 'color:#ffd38a');
    const body = el('div', 'lab054Body', null, 'margin:6px 0 8px;white-space:pre-wrap');
    const row = el('div', null, null, 'display:flex;gap:6px');
    const button = (id, label, css, fn) => {
      const b = el('button', id, label, 'padding:4px 6px;border-radius:6px;cursor:pointer;' + css);
      b.type = 'button';
      b.addEventListener('click', fn);
      row.appendChild(b);
    };
    button('lab054Step', '前進一格', 'flex:1;border:1px solid #46608f;background:#1b2740;color:#cfe0ff', () => step());
    button('lab054Unload', '卸貨', 'flex:1;border:1px solid #4a6b4a;background:#1d2a1d;color:#d6ffd6', () => unload());
    button('lab054Close', '×', 'border:1px solid #46608f;background:#151d2e;color:#9fb4d8', () => end());
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
    if (off()) panel.body.textContent = '（逃生閥 __noRailFreight054 已關閉）';
    else if (!run) panel.body.textContent = '目前沒有貨運列車任務。';
    else {
      const s = snapshot();
      panel.body.textContent = '批次 ' + s.batchId + '（' + s.qty + '/' + s.capacity + ' 件 ' + (s.commodityId || '未指定') + '）\n' +
        '狀態 ' + s.status + '　進度 ' + s.cursor + '/' + (s.pathLength - 1) + '\n' +
        (s.status === 'UNLOADED' ? '已卸貨（影子帳，未寫入正式經濟）' : (s.status === 'ABORTED' ? '已中止：' + s.abortReason : '沿真鐵軌前進中'));
    }
    return { ok: true, open: true };
  }

  function open() {
    if (off()) return no(DISABLED);
    ensurePanel();
    refresh();
    return snapshot();
  }

  /* 生命週期（T783 B4）：讀檔、開新城、離開頁面都中止列車並移除面板，不讓它跨城市活著。 */
  function lifecycle(reason) {
    if (run) run.train.abort(reason);
    removePanel();
  }
  if (typeof load === 'function') {
    const nativeLoad054 = load;
    load = function load054() { try { lifecycle('load'); } catch (e) {} return nativeLoad054.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld054 = newWorld;
    newWorld = function newWorld054() { try { lifecycle('new-world'); } catch (e) {} return nativeWorld054.apply(this, arguments); };
  }
  window.addEventListener('pagehide', function pagehide054() { try { lifecycle('pagehide'); } catch (e) {} });

  window.GV.railFreight054 = Object.freeze({
    plan, start, runBetween, step, unload, abort, snapshot, open, refresh, end, disable,
    provenance: Object.freeze(Object.assign({ installed: true }, INFO))
  });
})();

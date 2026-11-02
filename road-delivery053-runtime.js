/* DSK-018 / LAB-03 階段 B：真道路配送的執行期接線（會被原封不動內嵌進 index.html）。
 * 邊界：只讀道路格、只在影子任務裡推進批次；不寫金錢／商品／人口／客流／存檔。
 * 逃生閥：window.__noRoadDelivery053（任何時候關掉，任務立刻不能再開始／推進）。
 */
(function installRoadDelivery053() {
  'use strict';
  const RS = Object.freeze({
    BAD_INPUT: 'bad-input',
    ORIGIN_NOT_ROAD: 'origin-not-road',
    DESTINATION_NOT_ROAD: 'destination-not-road',
    UNREACHABLE: 'unreachable',
    TOO_FAR: 'too-far',
    DISABLED: 'disabled',
    NO_TASK: 'no-task'
  });
  const off = () => !!window.__noRoadDelivery053;
  let task = null;
  let panel = null;

  function isRoadIdx(i) { return !!(tiles[i] && tiles[i].road); }

  /* 4 鄰 BFS；鄰居順序固定（上、右、下、左），保證同一座城市同一對端點永遠同一條路。 */
  function plan(origin, destination, maxSteps) {
    const limit = (maxSteps === undefined || maxSteps === null) ? Infinity : maxSteps;
    if (!Number.isInteger(origin) || !Number.isInteger(destination)) return { ok: false, path: [], steps: -1, reason: RS.BAD_INPUT };
    if (origin < 0 || origin >= N * N || destination < 0 || destination >= N * N) return { ok: false, path: [], steps: -1, reason: RS.BAD_INPUT };
    if (!isRoadIdx(origin)) return { ok: false, path: [], steps: -1, reason: RS.ORIGIN_NOT_ROAD };
    if (!isRoadIdx(destination)) return { ok: false, path: [], steps: -1, reason: RS.DESTINATION_NOT_ROAD };
    if (origin === destination) return { ok: true, path: [origin], steps: 0, reason: null };
    const total = N * N;
    const prev = new Int32Array(total).fill(-1);
    const seen = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0, tail = 0, found = false;
    queue[tail++] = origin; seen[origin] = 1;
    while (head < tail) {
      const cur = queue[head++];
      if (cur === destination) { found = true; break; }
      const cx = cur % N, cy = (cur / N) | 0;
      const nb = [cy > 0 ? cur - N : -1, cx < N - 1 ? cur + 1 : -1, cy < N - 1 ? cur + N : -1, cx > 0 ? cur - 1 : -1];
      for (let k = 0; k < 4; k++) {
        const n = nb[k];
        if (n < 0 || seen[n] || !isRoadIdx(n)) continue;
        seen[n] = 1; prev[n] = cur; queue[tail++] = n;
      }
    }
    if (!found) return { ok: false, path: [], steps: -1, reason: RS.UNREACHABLE };
    const path = [];
    for (let at = destination; at !== -1; at = prev[at]) path.push(at);
    path.reverse();
    const steps = path.length - 1;
    if (steps > limit) return { ok: false, path: [], steps, reason: RS.TOO_FAR };
    return { ok: true, path, steps, reason: null };
  }

  function snapshot() {
    if (!task) return { ok: false, reason: RS.NO_TASK, active: false, disabled: off() };
    return {
      ok: true, active: task.status !== 'DELIVERED' && task.status !== 'CANCELLED', disabled: off(),
      status: task.status, batchId: task.batchId, commodityId: task.commodityId, qty: task.qty,
      cursor: task.cursor, pathLength: task.path.length, steps: task.steps,
      delivered: task.status === 'DELIVERED', cancelledReason: task.cancelledReason,
      provenance: task.provenance
    };
  }

  function start(origin, destination, batch) {
    if (off()) return { ok: false, reason: RS.DISABLED, path: [] };
    batch = batch || {};
    const qty = Number.isSafeInteger(batch.qty) && batch.qty > 0 ? batch.qty : 1;
    const p = plan(origin, destination, batch.maxSteps);
    if (!p.ok) { refresh(); return p; }
    task = {
      status: p.path.length === 1 ? 'DELIVERED' : 'PENDING',
      path: p.path, cursor: 0, steps: 0, qty,
      batchId: typeof batch.batchId === 'string' && batch.batchId ? batch.batchId : ('lab053-' + (origin + '-' + destination)),
      commodityId: typeof batch.commodityId === 'string' ? batch.commodityId : 'food',
      cancelledReason: null,
      deliveredAt: p.path.length === 1 ? { cursor: 0, step: 0 } : null,
      provenance: { version: typeof GAME_VER === 'string' ? GAME_VER : null, anchor: typeof GAME_ANCHOR === 'string' ? GAME_ANCHOR : null, module: 'road-delivery053' }
    };
    refresh();
    return { ok: true, path: p.path.slice(), steps: p.steps, reason: null };
  }

  function step() {
    if (off()) return { ok: false, reason: RS.DISABLED, snapshot: snapshot() };
    if (!task) return { ok: false, reason: RS.NO_TASK, snapshot: snapshot() };
    if (task.status === 'DELIVERED' || task.status === 'CANCELLED') return { ok: true, snapshot: snapshot() };
    if (task.status === 'PENDING') task.status = 'MOVING';
    task.cursor += 1;
    task.steps += 1;
    if (task.cursor >= task.path.length - 1) {
      task.cursor = task.path.length - 1;
      task.status = 'DELIVERED';
      task.deliveredAt = { cursor: task.cursor, step: task.steps };
    }
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function cancel(reason) {
    if (!task) return snapshot();
    if (task.status !== 'DELIVERED' && task.status !== 'CANCELLED') {
      task.status = 'CANCELLED';
      task.cancelledReason = typeof reason === 'string' && reason ? reason : 'cancelled';
    }
    refresh();
    return snapshot();
  }

  function end() {
    task = null;
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    return { ok: true, ended: true };
  }

  function disable() {
    window.__noRoadDelivery053 = true;
    return end();
  }

  /* 面板：預設不存在；只有明確 open() 才會建立 DOM，關閉即移除。 */
  function ensurePanel() {
    if (panel || typeof document === 'undefined') return panel;
    panel = document.createElement('div');
    panel.id = 'lab053Panel';
    panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;width:250px;padding:10px 12px;' +
      'background:rgba(14,20,34,.94);border:1px solid rgba(96,142,220,.55);border-radius:10px;' +
      'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
    panel.innerHTML = '<div style="font-weight:700;color:#8fc2ff;letter-spacing:.5px">LAB-03 影子配送</div>' +
      '<div id="lab053Body" style="margin:6px 0 8px;white-space:pre-wrap"></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button id="lab053Step" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #46608f;background:#1b2740;color:#cfe0ff;cursor:pointer">前進一格</button>' +
      '<button id="lab053Cancel" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #6b4a4a;background:#2a1d20;color:#ffd6d6;cursor:pointer">取消</button>' +
      '<button id="lab053Close" style="padding:4px 8px;border-radius:6px;border:1px solid #46608f;background:#151d2e;color:#9fb4d8;cursor:pointer">×</button>' +
      '</div>';
    document.body.appendChild(panel);
    panel.querySelector('#lab053Step').addEventListener('click', () => step());
    panel.querySelector('#lab053Cancel').addEventListener('click', () => cancel('panel-cancel'));
    panel.querySelector('#lab053Close').addEventListener('click', () => end());
    return panel;
  }

  function refresh() {
    if (!panel) return;
    const body = panel.querySelector('#lab053Body');
    if (!body) return;
    if (off()) { body.textContent = '（逃生閥 __noRoadDelivery053 已關閉）'; return; }
    if (!task) { body.textContent = '目前沒有配送任務。'; return; }
    const s = snapshot();
    body.textContent = '批次 ' + s.batchId + '（' + s.qty + ' 件 ' + s.commodityId + '）\n' +
      '狀態 ' + s.status + '　進度 ' + s.cursor + '/' + (s.pathLength - 1) + '\n' +
      (s.status === 'DELIVERED' ? '已送達（影子帳，未寫入正式經濟）' : (s.status === 'CANCELLED' ? '已取消：' + s.cancelledReason : '沿真道路前進中'));
  }

  function open() { ensurePanel(); refresh(); return snapshot(); }

  /* 生命週期：載入存檔／開新城市／離開頁面都會取消任務，不讓它跨城市活著。 */
  if (typeof load === 'function') {
    const nativeLoad053 = load;
    load = function () { try { cancel('load'); } catch (e) {} return nativeLoad053.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld053 = newWorld;
    newWorld = function () { try { cancel('new-world'); } catch (e) {} return nativeWorld053.apply(this, arguments); };
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', function () { try { cancel('pagehide'); } catch (e) {} });

  const api = Object.freeze({
    plan, start, step, cancel, snapshot, open, refresh, end, disable,
    provenance: { module: 'road-delivery053', lab: 'LAB-03', isolation: 'shadow-only' }
  });
  window.GV.roadDelivery053 = api;
})();

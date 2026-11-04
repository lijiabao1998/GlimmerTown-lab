/* DSK-019 / LAB-05 階段 B：兩站實載貨運鐵路的執行期接線（會被原封不動內嵌進 index.html）。
 * 邊界：只讀鐵軌格、只在影子任務裡推進列車；不寫金錢／商品／人口／客流／存檔。
 * 逃生閥：window.__noRailFreight054。
 */
(function installRailFreight054() {
  'use strict';
  const RS = Object.freeze({
    BAD_INPUT: 'bad-input', FROM_NOT_RAIL: 'from-not-rail', TO_NOT_RAIL: 'to-not-rail',
    UNREACHABLE: 'unreachable', TOO_FAR: 'too-far', OVER_CAPACITY: 'over-capacity',
    NOT_ARRIVED: 'not-arrived', DISABLED: 'disabled', NO_RUN: 'no-run'
  });
  const DEFAULT_CAPACITY = 12;
  const off = () => !!window.__noRailFreight054;
  let run = null;
  let panel = null;

  const isRailIdx = (i) => !!(tiles[i] && tiles[i].rail);

  function plan(from, to, maxSteps) {
    const limit = (maxSteps === undefined || maxSteps === null) ? Infinity : maxSteps;
    if (!Number.isInteger(from) || !Number.isInteger(to)) return { ok: false, path: [], steps: -1, reason: RS.BAD_INPUT };
    if (from < 0 || from >= N * N || to < 0 || to >= N * N) return { ok: false, path: [], steps: -1, reason: RS.BAD_INPUT };
    if (!isRailIdx(from)) return { ok: false, path: [], steps: -1, reason: RS.FROM_NOT_RAIL };
    if (!isRailIdx(to)) return { ok: false, path: [], steps: -1, reason: RS.TO_NOT_RAIL };
    if (from === to) return { ok: true, path: [from], steps: 0, reason: null };
    const total = N * N;
    const prev = new Int32Array(total).fill(-1);
    const seen = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0, tail = 0, found = false;
    queue[tail++] = from; seen[from] = 1;
    while (head < tail) {
      const cur = queue[head++];
      if (cur === to) { found = true; break; }
      const cx = cur % N, cy = (cur / N) | 0;
      const nb = [cy > 0 ? cur - N : -1, cx < N - 1 ? cur + 1 : -1, cy < N - 1 ? cur + N : -1, cx > 0 ? cur - 1 : -1];
      for (let k = 0; k < 4; k++) {
        const n = nb[k];
        if (n < 0 || seen[n] || !isRailIdx(n)) continue;
        seen[n] = 1; prev[n] = cur; queue[tail++] = n;
      }
    }
    if (!found) return { ok: false, path: [], steps: -1, reason: RS.UNREACHABLE };
    const path = [];
    for (let at = to; at !== -1; at = prev[at]) path.push(at);
    path.reverse();
    const steps = path.length - 1;
    if (steps > limit) return { ok: false, path: [], steps, reason: RS.TOO_FAR };
    return { ok: true, path, steps, reason: null };
  }

  function snapshot() {
    if (!run) return { ok: false, reason: RS.NO_RUN, active: false, disabled: off() };
    return {
      ok: true, active: run.status !== 'UNLOADED' && run.status !== 'ABORTED', disabled: off(),
      status: run.status, batchId: run.batchId, commodityId: run.commodityId, qty: run.qty,
      capacity: run.capacity, cursor: run.cursor, pathLength: run.path.length, steps: run.steps,
      arrived: run.status === 'ARRIVED' || run.status === 'UNLOADED',
      unloaded: run.status === 'UNLOADED', abortReason: run.abortReason, provenance: run.provenance
    };
  }

  function start(from, to, cargo, capacity) {
    if (off()) return { ok: false, reason: RS.DISABLED, path: [] };
    cargo = cargo || {};
    const cap = Number.isSafeInteger(capacity) && capacity > 0 ? capacity : DEFAULT_CAPACITY;
    const qty = Number.isSafeInteger(cargo.qty) && cargo.qty > 0 ? cargo.qty : 1;
    if (qty > cap) return { ok: false, reason: RS.OVER_CAPACITY, qty, capacity: cap, path: [] };
    const p = plan(from, to, cargo.maxSteps);
    if (!p.ok) { refresh(); return p; }
    run = {
      status: 'READY', path: p.path, cursor: 0, steps: 0, qty, capacity: cap,
      batchId: typeof cargo.batchId === 'string' && cargo.batchId ? cargo.batchId : ('lab054-' + from + '-' + to),
      commodityId: typeof cargo.commodityId === 'string' ? cargo.commodityId : 'food',
      abortReason: null,
      provenance: { version: typeof GAME_VER === 'string' ? GAME_VER : null, anchor: typeof GAME_ANCHOR === 'string' ? GAME_ANCHOR : null, module: 'rail-freight054' }
    };
    refresh();
    return { ok: true, path: p.path.slice(), steps: p.steps, reason: null };
  }

  function step() {
    if (off()) return { ok: false, reason: RS.DISABLED, snapshot: snapshot() };
    if (!run) return { ok: false, reason: RS.NO_RUN, snapshot: snapshot() };
    if (run.status === 'ARRIVED' || run.status === 'UNLOADED' || run.status === 'ABORTED') return { ok: true, snapshot: snapshot() };
    if (run.status === 'READY') run.status = 'RUNNING';
    run.cursor += 1;
    run.steps += 1;
    if (run.cursor >= run.path.length - 1) { run.cursor = run.path.length - 1; run.status = 'ARRIVED'; }
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function unload() {
    if (off()) return { ok: false, reason: RS.DISABLED, snapshot: snapshot() };
    if (!run) return { ok: false, reason: RS.NO_RUN, snapshot: snapshot() };
    if (run.status !== 'ARRIVED') return { ok: false, reason: RS.NOT_ARRIVED, snapshot: snapshot() };
    run.status = 'UNLOADED';
    refresh();
    return { ok: true, snapshot: snapshot() };
  }

  function abort(reason) {
    if (!run) return snapshot();
    if (run.status !== 'UNLOADED' && run.status !== 'ABORTED') {
      run.status = 'ABORTED';
      run.abortReason = typeof reason === 'string' && reason ? reason : 'aborted';
    }
    refresh();
    return snapshot();
  }

  function end() {
    run = null;
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    return { ok: true, ended: true };
  }

  function disable() { window.__noRailFreight054 = true; return end(); }

  function ensurePanel() {
    if (panel || typeof document === 'undefined') return panel;
    panel = document.createElement('div');
    panel.id = 'lab054Panel';
    panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;width:250px;padding:10px 12px;' +
      'background:rgba(14,20,34,.94);border:1px solid rgba(96,142,220,.55);border-radius:10px;' +
      'color:#c9d6ee;font:12px/1.5 system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)';
    panel.innerHTML = '<div style="font-weight:700;color:#8fc2ff;letter-spacing:.5px">LAB-05 影子貨運列車</div>' +
      '<div id="lab054Body" style="margin:6px 0 8px;white-space:pre-wrap"></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button id="lab054Step" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #46608f;background:#1b2740;color:#cfe0ff;cursor:pointer">前進一站</button>' +
      '<button id="lab054Unload" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #4a6b4a;background:#1d2a1d;color:#d6ffd6;cursor:pointer">卸貨</button>' +
      '<button id="lab054Close" style="padding:4px 8px;border-radius:6px;border:1px solid #46608f;background:#151d2e;color:#9fb4d8;cursor:pointer">×</button>' +
      '</div>';
    document.body.appendChild(panel);
    panel.querySelector('#lab054Step').addEventListener('click', () => step());
    panel.querySelector('#lab054Unload').addEventListener('click', () => unload());
    panel.querySelector('#lab054Close').addEventListener('click', () => end());
    return panel;
  }

  function refresh() {
    if (!panel) return;
    const body = panel.querySelector('#lab054Body');
    if (!body) return;
    if (off()) { body.textContent = '（逃生閥 __noRailFreight054 已關閉）'; return; }
    if (!run) { body.textContent = '目前沒有貨運列車任務。'; return; }
    const s = snapshot();
    body.textContent = '批次 ' + s.batchId + '（' + s.qty + '/' + s.capacity + ' 件 ' + s.commodityId + '）\n' +
      '狀態 ' + s.status + '　進度 ' + s.cursor + '/' + (s.pathLength - 1) + '\n' +
      (s.status === 'UNLOADED' ? '已卸貨（影子帳，未寫入正式經濟）' : (s.status === 'ABORTED' ? '已中止：' + s.abortReason : '沿真鐵軌前進中'));
  }

  function open() { ensurePanel(); refresh(); return snapshot(); }

  if (typeof load === 'function') {
    const nativeLoad054 = load;
    load = function () { try { abort('load'); } catch (e) {} return nativeLoad054.apply(this, arguments); };
  }
  if (typeof newWorld === 'function') {
    const nativeWorld054 = newWorld;
    newWorld = function () { try { abort('new-world'); } catch (e) {} return nativeWorld054.apply(this, arguments); };
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', function () { try { abort('pagehide'); } catch (e) {} });

  const api = Object.freeze({
    plan, start, step, unload, abort, snapshot, open, refresh, end, disable,
    provenance: { module: 'rail-freight054', lab: 'LAB-05', isolation: 'shadow-only', defaultCapacity: DEFAULT_CAPACITY }
  });
  window.GV.railFreight054 = api;
})();

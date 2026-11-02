/* DSK-023 / LAB-10 階段 A：車站與商業街的影子到訪模型（純核心）。
 * 只算「幾何 + 步行距離 + 需求權重」下的人流估計；不碰收入／稅／價格／旅館收入。
 *
 * Node（module.exports）與瀏覽器（globalThis.shadowVisits057）雙用。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.shadowVisits057 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const REASONS = Object.freeze({ BAD_INPUT: 'bad-input', NEGATIVE: 'negative', NO_STATIONS: 'no-stations' });
  const EPS = 1e-9;
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  const fail = (reason, detail) => ({ ok: false, reason, detail: detail || null });

  function validateList(list, label, max) {
    if (!Array.isArray(list)) return { ok: false, reason: REASONS.BAD_INPUT, detail: label + '-not-array' };
    for (const item of list) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return { ok: false, reason: REASONS.BAD_INPUT, detail: label + '-not-object' };
      for (const k of ['x', 'y']) {
        if (!isNum(item[k])) return { ok: false, reason: REASONS.BAD_INPUT, detail: label + '.' + k };
      }
      if (item.x < 0 || item.y < 0) return { ok: false, reason: REASONS.NEGATIVE, detail: label + '.coordinate' };
    }
    return { ok: true };
  }

  function computeShadowVisits(opts) {
    opts = opts || {};
    const radius = isNum(opts.radius) && opts.radius > 0 ? opts.radius : 8;
    const demandScale = isNum(opts.demandScale) && opts.demandScale > 0 ? opts.demandScale : 1;
    const maxShops = Number.isSafeInteger(opts.maxShops) && opts.maxShops > 0 ? opts.maxShops : 2000;
    const maxStations = Number.isSafeInteger(opts.maxStations) && opts.maxStations > 0 ? opts.maxStations : 500;
    const walkDistance = typeof opts.walkDistance === 'function' ? opts.walkDistance : null;

    const sv = validateList(opts.stations, 'stations', maxStations);
    if (!sv.ok) return fail(sv.reason, sv.detail);
    const shv = validateList(opts.shops, 'shops', maxShops);
    if (!shv.ok) return fail(shv.reason, shv.detail);
    if (!opts.stations.length) return fail(REASONS.NO_STATIONS);

    for (const s of opts.stations) {
      if (!isNum(s.demand) || s.demand < 0) return fail(s.demand < 0 ? REASONS.NEGATIVE : REASONS.BAD_INPUT, 'station.demand');
    }
    for (const s of opts.shops) {
      const attract = s.attract === undefined ? 1 : s.attract;
      if (!isNum(attract) || attract < 0) return fail(attract < 0 ? REASONS.NEGATIVE : REASONS.BAD_INPUT, 'shop.attract');
    }

    const truncated = opts.shops.length > maxShops || opts.stations.length > maxStations;
    const shops = opts.shops.slice(0, maxShops);
    const stations = opts.stations.slice(0, maxStations);

    const rows = shops.map((shop) => {
      const attract = shop.attract === undefined ? 1 : shop.attract;
      let visits = 0;
      let connected = 0;
      const sources = [];
      for (const st of stations) {
        const d = walkDistance ? Number(walkDistance(st.x, st.y, shop.x, shop.y)) : Math.abs(st.x - shop.x) + Math.abs(st.y - shop.y);
        if (!Number.isFinite(d) || d < 0 || d > radius) continue;
        connected += 1;
        const w = 1 - d / radius;
        if (w <= EPS) continue;
        const v = st.demand * attract * w;
        visits += v;
        sources.push({ station: st.id === undefined ? null : st.id, distance: d, weight: +w.toFixed(6) });
      }
      return {
        id: shop.id === undefined ? null : shop.id,
        x: shop.x, y: shop.y,
        visits: Math.round(visits * demandScale),
        raw: +(visits * demandScale).toFixed(6),
        connected, isolated: connected === 0,
        sources
      };
    });

    const totals = rows.reduce((a, r) => {
      a.visits += r.visits;
      a.raw += r.raw;
      if (r.isolated) a.isolated += 1;
      a.connected += r.connected;
      return a;
    }, { visits: 0, raw: 0, isolated: 0, connected: 0 });

    return { ok: true, rows, totals, radius, demandScale, truncated, shopCount: rows.length, stationCount: stations.length };
  }

  function rankShops(rows, n) {
    if (!Array.isArray(rows)) return [];
    const limit = Number.isSafeInteger(n) && n > 0 ? n : 10;
    const cmp = (a, b) => {
      if (b.visits !== a.visits) return b.visits - a.visits;
      const ai = String(a.id), bi = String(b.id);
      if (ai !== bi) return ai < bi ? -1 : 1;
      return 0;
    };
    return rows.slice().sort(cmp).slice(0, limit);
  }

  return Object.freeze({ REASONS, computeShadowVisits, rankShops });
});

/* DSK-022 / LAB-09 階段 A：有界客運研究的純核心。
 * 吃原生已經算好的 OD 列（唯讀），算「已服務／未服務」，不改任何產品狀態。
 *
 * OD 列的形狀（LAB-08 已確認，來自 transit468／mobility491）：
 *   { origin, destination, purpose, trips, walk, transit, car }
 *
 * Node（module.exports）與瀏覽器（globalThis.passengerDemand056）雙用。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.passengerDemand056 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const EPS = 0.35; /* native OD rounds each mode to 0.1: up to 3 modes can overshoot trips by ~0.3 */
  const REASONS = Object.freeze({ BAD_INPUT: 'bad-input', NEGATIVE: 'negative', OVERFLOW: 'overflow', NOT_OBJECT: 'not-object' });

  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  const fail = (reason, detail) => ({ ok: false, reason, detail: detail || null });

  function rowUnserved(row) {
    return row.trips - (row.walk + row.transit + row.car);
  }

  function summarizeDemand(od, opts) {
    opts = opts || {};
    if (!Array.isArray(od)) return fail(REASONS.BAD_INPUT, 'od-not-array');
    const maxRows = Number.isSafeInteger(opts.maxRows) && opts.maxRows > 0 ? opts.maxRows : Infinity;
    const rows = [];
    let truncated = false;
    for (const row of od) {
      if (rows.length >= maxRows) { truncated = true; break; }
      if (!row || typeof row !== 'object' || Array.isArray(row)) return fail(REASONS.NOT_OBJECT);
      for (const k of ['trips', 'walk', 'transit', 'car']) {
        if (!isNum(row[k])) return fail(REASONS.BAD_INPUT, 'field:' + k);
        if (row[k] < 0) return fail(REASONS.NEGATIVE, 'field:' + k);
      }
      const bike = (typeof row.bike === 'number' && Number.isFinite(row.bike) && row.bike >= 0) ? row.bike : 0;
      const served = row.walk + row.transit + row.car + bike;
      const declaredUnserved = (typeof row.unserved === 'number' && Number.isFinite(row.unserved) && row.unserved >= 0) ? row.unserved : null;
      if (served - row.trips > EPS) return fail(REASONS.OVERFLOW, 'served>trips');
      const unserved = declaredUnserved !== null ? declaredUnserved : Math.max(0, row.trips - served);
      rows.push({
        origin: row.origin === undefined ? null : row.origin,
        destination: row.destination === undefined ? null : row.destination,
        purpose: typeof row.purpose === 'string' ? row.purpose : null,
        trips: row.trips, walk: row.walk, transit: row.transit, car: row.car,
        served, unserved
      });
    }
    const totals = rows.reduce((a, r) => {
      a.trips += r.trips; a.walk += r.walk; a.transit += r.transit; a.car += r.car;
      a.served += r.served; a.unserved += r.unserved;
      if (r.purpose) a.byPurpose[r.purpose] = (a.byPurpose[r.purpose] || 0) + r.trips;
      return a;
    }, { trips: 0, walk: 0, transit: 0, car: 0, served: 0, unserved: 0, byPurpose: {} });
    const conserved = Math.abs(totals.served + totals.unserved - totals.trips) <= EPS;
    return {
      ok: true, rows, totals, conserved, truncated,
      rowCount: rows.length, maxRows: maxRows === Infinity ? null : maxRows
    };
  }

  function rankUnserved(rows, n) {
    if (!Array.isArray(rows)) return [];
    const limit = Number.isSafeInteger(n) && n > 0 ? n : 10;
    const cmp = (a, b) => {
      if (b.unserved !== a.unserved) return b.unserved - a.unserved;
      const ao = String(a.origin), bo = String(b.origin);
      if (ao !== bo) return ao < bo ? -1 : 1;
      const ad = String(a.destination), bd = String(b.destination);
      if (ad !== bd) return ad < bd ? -1 : 1;
      return 0;
    };
    return rows.slice().sort(cmp).slice(0, limit);
  }

  function boundedStudy(od, opts) {
    const s = summarizeDemand(od, opts);
    if (!s.ok) return s;
    return Object.assign({}, s, { topUnserved: rankUnserved(s.rows, (opts && opts.top) || 10) });
  }

  return Object.freeze({ REASONS, summarizeDemand, rankUnserved, boundedStudy, rowUnserved });
});

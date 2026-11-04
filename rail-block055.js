/* DSK-020 / LAB-06 階段 A：單線閉塞區間的路權、等待與斷軌恢復（純核心）。
 * 只做三件事：(1) 同一時間只有一列有路權；(2) 其餘 FIFO 等待；(3) 斷軌格不准前進。
 * 不碰 DOM、不碰 localStorage、不改任何模擬數值。
 *
 * Node（module.exports）與瀏覽器（globalThis.railBlock055）雙用。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.railBlock055 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const REASONS = Object.freeze({
    TOO_MANY: 'too-many',
    DUPLICATE: 'duplicate',
    NOT_HOLDER: 'not-holder',
    NO_AUTHORITY: 'no-authority',
    TRACK_BROKEN: 'track-broken',
    UNKNOWN: 'unknown-run',
    BAD_INPUT: 'bad-input'
  });

  const DEFAULT_MAX_TRAINS = 2;

  function createBlockAuthority055(opts) {
    opts = opts || {};
    const maxTrains = Number.isSafeInteger(opts.maxTrains) && opts.maxTrains > 0 ? opts.maxTrains : DEFAULT_MAX_TRAINS;
    let holder = null;
    const waiting = [];
    const broken = new Set();

    const known = () => (holder === null ? 0 : 1) + waiting.length;

    function request(id) {
      if (typeof id !== 'string' || !id) return { ok: false, reason: REASONS.BAD_INPUT };
      if (id === holder || waiting.includes(id)) return { ok: false, reason: REASONS.DUPLICATE };
      if (holder === null) { holder = id; return { ok: true, status: 'GRANTED', id }; }
      if (known() >= maxTrains) return { ok: false, reason: REASONS.TOO_MANY, maxTrains };
      waiting.push(id);
      return { ok: true, status: 'WAITING', id };
    }

    function release(id) {
      if (typeof id !== 'string' || !id) return { ok: false, reason: REASONS.BAD_INPUT };
      if (id !== holder) return { ok: false, reason: REASONS.NOT_HOLDER };
      holder = waiting.length ? waiting.shift() : null;
      return { ok: true, granted: holder, grantedFromWait: holder !== null };
    }

    function breakTile(i) {
      if (!Number.isInteger(i) || i < 0) return { ok: false, reason: REASONS.BAD_INPUT };
      broken.add(i);
      return { ok: true, broken: i };
    }

    function repairTile(i) {
      if (!Number.isInteger(i) || i < 0) return { ok: false, reason: REASONS.BAD_INPUT };
      broken.delete(i);
      return { ok: true, repaired: i };
    }

    const isBroken = (i) => broken.has(i);

    function canAdvance(id, tile) {
      if (typeof id !== 'string' || !id) return { ok: false, reason: REASONS.BAD_INPUT };
      if (id !== holder) return { ok: false, reason: REASONS.NO_AUTHORITY };
      if (broken.has(tile)) return { ok: false, reason: REASONS.TRACK_BROKEN, tile };
      return { ok: true, reason: null };
    }

    function snapshot() {
      return {
        maxTrains,
        holder,
        waiting: waiting.slice(),
        waitingCount: waiting.length,
        trains: known(),
        broken: [...broken].sort((a, b) => a - b)
      };
    }

    return Object.freeze({
      maxTrains, request, release, breakTile, repairTile, isBroken, canAdvance, snapshot
    });
  }

  return Object.freeze({ REASONS, DEFAULT_MAX_TRAINS, createBlockAuthority055 });
});

/* DSK-035 / LAB-12 原型：影子貨物狀態的持久化信封（純核心，不接遊戲存檔）。
 *
 * 邊界：只處理「影子層」狀態（批次、倉庫、閉塞、運送任務），不碰正式存檔格式、
 * 不寫 localStorage、不改 index.html。要接進正式存檔需業主批准。
 *
 * 設計要點：
 *  - 信封自帶 schema 名與版本；未知 schema、超版本一律拒絕，不做「盡力而為」的猜測。
 *  - 內容用穩定序列化（鍵排序）算 FNV-1a 校驗；任何一位元變動都會被擋。
 *  - unpack 回傳深拷貝，呼叫端改壞了也不會污染呼叫者手上的原物件。
 *  - 還原流程是原子的：先驗信封、再驗必填區塊，全部通過才替換；失敗時原狀態完全不動。
 */
(function installPersistence058(root) {
  'use strict';
  const SCHEMA = 'glimmertown-lab.shadow.v1';
  const VERSION = 1;
  const RS = Object.freeze({
    OK: 'ok', BAD_INPUT: 'bad-input', UNKNOWN_SCHEMA: 'unknown-schema',
    VERSION_AHEAD: 'version-ahead', CHECKSUM: 'checksum-mismatch',
    MISSING_BLOCK: 'missing-block', ROLLBACK: 'rolled-back'
  });

  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    const keys = Object.keys(v).sort();
    return '{' + keys.map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  function fnv(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

  function pack(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return { ok: false, code: RS.BAD_INPUT };
    const body = canon(state);
    return { ok: true, envelope: { schema: SCHEMA, version: VERSION, checksum: fnv(body), payload: JSON.parse(body) } };
  }

  function unpack(envelope, opts) {
    opts = opts || {};
    const required = Array.isArray(opts.required) ? opts.required : [];
    if (!envelope || typeof envelope !== 'object') return { ok: false, code: RS.BAD_INPUT };
    if (envelope.schema !== SCHEMA) return { ok: false, code: RS.UNKNOWN_SCHEMA };
    const version = Number(envelope.version);
    if (!Number.isSafeInteger(version) || version < 1) return { ok: false, code: RS.BAD_INPUT };
    if (version > VERSION) return { ok: false, code: RS.VERSION_AHEAD };
    if (fnv(canon(envelope.payload)) !== envelope.checksum) return { ok: false, code: RS.CHECKSUM };
    const payload = envelope.payload;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { ok: false, code: RS.BAD_INPUT };
    for (const k of required) {
      if (!Object.prototype.hasOwnProperty.call(payload, k)) return { ok: false, code: RS.MISSING_BLOCK, block: k };
    }
    return { ok: true, state: clone(payload) };
  }

  /* 原子還原：只有 unpack 成功才取代 current；失敗回傳原本的 current，呼叫端可放心沿用。 */
  function restore(current, envelope, opts) {
    const r = unpack(envelope, opts);
    if (!r.ok) return { ok: false, code: r.code, block: r.block || null, state: current };
    return { ok: true, code: RS.OK, state: r.state };
  }

  const api = { SCHEMA, VERSION, RS, canon, fnv, pack, unpack, restore, provenance: 'lab058-shadow-persistence-prototype' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.persistence058 = api;
  if (root.GV) root.GV.persistence058 = api;
})(typeof window !== 'undefined' ? window : globalThis);

'use strict';
/* DSK-029 step 1: discover the exact contracts needed to close the shadow-logistics loop.
 * Read-only: starts the ledger session, creates one batch, snapshots; then reports which
 * delivery APIs exist and what shape they expose. No product change.
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  try {
    const L = GV.singleResearch052;
    out.facts.ledgerApi = L ? Object.keys(L) : null;
    out.facts.deliveryApis = {
      road: !!GV.roadDelivery053, rail: !!GV.railFreight054,
      block: !!GV.railBlock055, intermodal: !!GV.intermodal057
    };
    if (!L) throw new Error('no ledger api');
    const snap0 = L.snapshot();
    out.facts.snapshotKeys = snap0 ? Object.keys(snap0) : null;
    out.facts.snapshot0 = snap0;
    // Try the demo/start path (the panel's own entry) to get a live session.
    let started = null;
    try { started = L.demo ? L.demo() : null; } catch (e) { started = { error: String(e && e.message) }; }
    out.facts.demo = started;
    const snap1 = L.snapshot();
    out.facts.snapshot1 = snap1;
    out.ok = true;
    return out;
  } catch (e) {
    out.error = String((e && e.stack) || e);
    return out;
  }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => cdp.evalJs(PAGE));
  console.log(JSON.stringify({ ok: r.ok, result: r.result, fails: r.fails }, null, 2));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

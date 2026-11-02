'use strict';
/* DSK-029 step 2: drive the same shadow batch through the delivery legs on the
 * integration candidate. Proves batch identity + quantity conservation across
 * ledger -> road -> intermodal -> rail. Ledger settlement is NOT wired yet (documented).
 */
const { withGame } = require('./harness.js');

const PAGE = `(() => {
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    const L = GV.singleResearch052;
    if (!L) throw new Error('no ledger');
    L.demo();
    const snap = L.snapshot();
    const batches = (snap.ledger && snap.ledger.batches) || [];
    const b = batches[0];
    out.facts.ledger = { batches: batches.length, batchId: b && b.batchId, qty: b && b.qty, unissued: snap.ledger && snap.ledger.unissued };
    if (!b) throw new Error('ledger demo produced no batch');
    const batchId = b.batchId, qty = b.qty;

    // --- build a tiny road + rail test track ---
    const tileAt = (x, y) => GV.tile(x, y);
    let N = 0; for (let x = 0; x <= 256; x++) { if (!tileAt(x, 0)) break; N = x + 1; }
    if (!N) throw new Error('no map size');
    const idx = (x, y) => y * N + x;
    const land = (x, y) => { const t = tileAt(x, y); return !!(t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.bld && !t.water); };
    let road = null, rail = null;
    for (let y = 6; y < N - 6 && !road; y++) for (let x = 4; x < N - 10; x++) { let ok = true; for (let i = 0; i < 4; i++) if (!land(x + i, y)) { ok = false; break; } if (ok) { road = { x, y }; break; } }
    for (let x = 4; x < N - 6 && !rail; x++) for (let y = 6; y < N - 12; y++) { let ok = true; for (let i = 0; i < 5; i++) if (!land(x, y + i)) { ok = false; break; } if (ok) { rail = { x, y }; break; } }
    if (!road || !rail) throw new Error('no track');
    for (let i = 0; i < 4; i++) GV.place('road', road.x + i, road.y);
    for (let i = 0; i < 5; i++) GV.place('rail', rail.x, rail.y + i);

    // --- leg 1: road delivery with the ledger batch identity ---
    const r1 = GV.roadDelivery053.start(idx(road.x, road.y), idx(road.x + 3, road.y), { batchId, qty }, 12);
    out.facts.road = { ok: r1.ok, reason: r1.reason, steps: r1.steps };
    if (!r1.ok) throw new Error('road start: ' + r1.reason);
    for (let i = 0; i < r1.steps + 1; i++) GV.roadDelivery053.step();
    const s1 = GV.roadDelivery053.snapshot();
    out.facts.roadDone = { status: s1.status, qty: s1.qty, batchId: s1.batchId };
    if (s1.qty !== qty || s1.batchId !== batchId) fail('road leg changed batch identity/quantity');

    // --- leg 2: intermodal with the same identity, a declared block authority and ledger settlement ---
    const TRAIN = 'train-057';
    const BLK = GV.railBlock055;
    const r2 = GV.intermodal057.start({
      roadFrom: idx(road.x, road.y), roadTo: idx(road.x + 3, road.y),
      railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + 4),
      cargo: { batchId, qty }, capacity: 12,
      authority: TRAIN, ledger: { sessionId: snap.ledger.sessionId, batchId }
    });
    out.facts.intermodal = { ok: r2.ok, reason: r2.reason, roadSteps: r2.roadSteps, railSteps: r2.railSteps };
    if (!r2.ok) throw new Error('intermodal start: ' + r2.reason);
    for (let i = 0; i < r2.roadSteps; i++) GV.intermodal057.advance();
    GV.intermodal057.transfer();

    // Gap (documented, not asserted): the rail leg still does not consult
    // GV.railBlock055 — 055's per-train authority model is not wired into 057 yet.
    out.facts.blockEnforcement = 'not wired: intermodal057 rail leg ignores railBlock055 authority';

    for (let i = 0; i < r2.railSteps; i++) GV.intermodal057.advance();
    const s2 = GV.intermodal057.snapshot();
    out.facts.intermodalDone = { status: s2.status, qty: s2.qty, batchId: s2.batchId, settlement: s2.settlement };
    if (s2.qty !== qty || s2.batchId !== batchId) fail('intermodal changed batch identity/quantity');
    if (!s2.settlement || s2.settlement.ok !== true) fail('ledger settlement did not succeed: ' + JSON.stringify(s2.settlement));

    // --- ledger after the product-level settlement ---
    const after = L.snapshot();
    const ab = (after.ledger && after.ledger.batches) || [];
    const abatch = ab.find((x) => x && x.batchId === batchId);
    out.facts.ledgerAfter = {
      batches: ab.length, batchId: abatch && abatch.batchId, qty: abatch && abatch.qty,
      state: abatch && abatch.state, owner: abatch && abatch.owner,
      unissued: after.ledger && after.ledger.unissued,
      conserved: after.ledger && after.ledger.conservation && after.ledger.conservation.ok
    };
    if (!abatch) fail('batch disappeared after settlement');
    if (abatch && abatch.state !== 'HELD') fail('batch not in HELD after settlement: ' + (abatch && abatch.state));
    if (!out.facts.ledgerAfter.conserved) fail('ledger conservation broken after settlement');
    out.ok = out.fails.length === 0;
    return out;
  } catch (e) {
    out.error = String((e && e.message) || e);
    return out;
  }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 300, log: () => {} }, async ({ cdp }) => cdp.evalJs(PAGE));
  console.log(JSON.stringify({ ok: r.ok, result: r.result, fails: r.fails }, null, 2));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

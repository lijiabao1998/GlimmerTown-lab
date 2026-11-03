'use strict';
/* DSK-035 / V67 §4：把持久化原型接到真遊戲狀態上做一次完整回放。
 *
 * 流程：建城 → 影子帳 demo → 公路 → 聯運（含結算與 055 路權）→ 抓三份原生 snapshot
 *      → captureShadow058 → pack → unpack → restore → 守恆與逐欄位比對。
 * 只讀原生狀態；不改存檔、不寫 localStorage。
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const CORE = cp.execFileSync('git', ['show', 'dsk/lab-persistence-058:persistence058.js'], { maxBuffer: 8 * 1024 * 1024 }).toString();

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(0);
  return GV.stats();
})()`;

const RUN = `(() => {
  ${CORE}
  const P = window.persistence058;
  const out = { ok: false, fails: [], facts: {} };
  const fail = (m) => out.fails.push(m);
  try {
    const n = GV.N();
    const idx = (x, y) => y * n + x;
    const land = (x, y) => { const t = GV.tile(x, y); return !!(t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.bld && !t.water); };
    let road = null, rail = null;
    for (let y = 6; y < n - 6 && !road; y++) for (let x = 4; x < n - 10; x++) { let ok = true; for (let i = 0; i < 4; i++) if (!land(x + i, y)) { ok = false; break; } if (ok) { road = { x, y }; break; } }
    for (let x = 4; x < n - 6 && !rail; x++) for (let y = 6; y < n - 12; y++) { let ok = true; for (let i = 0; i < 5; i++) if (!land(x, y + i)) { ok = false; break; } if (ok) { rail = { x, y }; break; } }
    if (!road || !rail) throw new Error('no track');
    for (let i = 0; i < 4; i++) GV.place('road', road.x + i, road.y);
    for (let i = 0; i < 5; i++) GV.place('rail', rail.x, rail.y + i);

    const L = GV.singleResearch052;
    L.demo();
    const snap0 = L.snapshot();
    const b = snap0.ledger.batches[0];
    out.facts.batch = { batchId: b.batchId, qty: b.qty, unissued: snap0.ledger.unissued };

    // road leg with the ledger identity
    GV.roadDelivery053.start(idx(road.x, road.y), idx(road.x + 3, road.y), { batchId: b.batchId, qty: b.qty }, 12);
    for (let i = 0; i < 3; i++) GV.roadDelivery053.step();

    // intermodal leg: authority + settlement
    const TRAIN = 'train-058';
    GV.railBlock055.request(TRAIN);
    const r2 = GV.intermodal057.start({
      roadFrom: idx(road.x, road.y), roadTo: idx(road.x + 3, road.y),
      railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + 4),
      cargo: { batchId: b.batchId, qty: b.qty }, capacity: 12,
      authority: TRAIN, ledger: { sessionId: snap0.ledger.sessionId, batchId: b.batchId }
    });
    if (!r2.ok) throw new Error('intermodal: ' + r2.reason);
    for (let i = 0; i < r2.roadSteps; i++) GV.intermodal057.advance();
    GV.intermodal057.transfer();
    for (let i = 0; i < r2.railSteps; i++) GV.intermodal057.advance();
    const trip = GV.intermodal057.snapshot();
    out.facts.trip = { status: trip.status, qty: trip.qty, settlement: trip.settlement };

    // --- persistence round trip on the real snapshots ---
    const ledgerSnap = L.snapshot();
    const blockSnap = GV.railBlock055.snapshot();
    const cap = P.captureShadow058({ ledger: ledgerSnap, block: blockSnap, trips: [{ id: 'trip-1', status: trip.status, batchId: trip.batchId, qty: trip.qty }] });
    out.facts.capture = { ok: cap.ok, conservation: cap.conservation, batches: cap.payload.ledger.batches.length };

    const packed = P.pack(cap.payload);
    out.facts.pack = { ok: packed.ok, checksum: packed.envelope.checksum, schema: packed.envelope.schema, version: packed.envelope.version };

    const unpacked = P.unpack(packed.envelope, { required: ['ledger', 'warehouse', 'block', 'trips'] });
    out.facts.unpack = { ok: unpacked.ok, code: unpacked.code };
    if (!unpacked.ok) fail('unpack failed: ' + unpacked.code);
    else if (P.canon(unpacked.state) !== P.canon(cap.payload)) fail('round trip changed payload');

    // tamper must be rejected
    const tampered = JSON.parse(JSON.stringify(packed.envelope));
    tampered.payload.ledger.batches[0].qty = 999;
    const bad = P.restore(cap.payload, tampered, { required: ['ledger'] });
    out.facts.tamper = { ok: bad.ok, code: bad.code, stateUnchanged: P.canon(bad.state) === P.canon(cap.payload) };
    if (bad.ok || bad.code !== P.RS.CHECKSUM || !out.facts.tamper.stateUnchanged) fail('tampered envelope was not rejected atomically');

    // --- restore: take the envelope back out and prove it is unchanged and consistent ---
    const restored = P.restore(null, packed.envelope, { required: ['ledger', 'warehouse', 'block', 'trips'] });
    const repacked = restored.ok ? P.pack(restored.state) : null;
    const restoredSum = restored.ok ? restored.state.ledger.batches.reduce((s, x) => s + (x.qty || 0), 0) : null;
    const restoredConserved = restored.ok
      ? restoredSum + (restored.state.ledger.unissued || 0) === restored.state.ledger.manifestTotal
      : false;
    out.facts.restore = {
      ok: !!restored.ok, code: restored.code || null,
      checksumStable: !!(repacked && repacked.envelope.checksum === packed.envelope.checksum),
      sumBatches: restoredSum, conserved: restoredConserved,
      identicalToCapture: !!(restored.ok && P.canon(restored.state) === P.canon(cap.payload))
    };
    if (!restored.ok) fail('restore failed: ' + restored.code);
    else {
      if (!out.facts.restore.checksumStable) fail('restore→repack changed the checksum');
      if (!out.facts.restore.conserved) fail('restored state is not conserved');
      if (!out.facts.restore.identicalToCapture) fail('restored state differs from captured payload');
    }

    // ledger is untouched by the persistence layer
    const after = L.snapshot();
    out.facts.ledgerAfter = { batches: after.ledger.batches.length, conserved: after.ledger.conservation && after.ledger.conservation.ok, qty: after.ledger.batches[0].qty };
    if (after.ledger.batches[0].qty !== b.qty) fail('ledger changed during persistence round trip');

    out.ok = out.fails.length === 0;
    return out;
  } catch (e) { out.error = String((e && e.message) || e); return out; }
})()`;

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 600, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    await cdp.evalJs(BUILD);
    return await cdp.evalJs(RUN);
  });
  console.log(JSON.stringify({ ok: r.ok, result: r.result, fails: r.fails }, null, 1));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

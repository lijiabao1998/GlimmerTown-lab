'use strict';
/* DSK-037 / V67 §8：真瀏覽器原圖（不是示意圖）。
 * 三張：成熟城市、公鐵聯運面板（已結算）、影子帳面板。
 * 只讀畫面；不改存檔、不寫正式經濟。
 */
const fs = require('node:fs');
const path = require('node:path');
const { withGame } = require('./harness.js');
const { setup053 } = require('./benchmark053.cjs');
const { connectFixture053 } = require('./populated-fixture053.cjs');

const OUT = 'C:/RUST/evidence';
fs.mkdirSync(OUT, { recursive: true });

const BUILD = `(() => {
  (${setup053.toString()})(${JSON.stringify({ scene: 'small', seed: 87, ai: true })});
  (${connectFixture053.toString()})();
  GV.setSpeed(5);
  return GV.stats();
})()`;

const RUNTRIP = `(() => {
  const n = GV.N();
  const idx = (x, y) => y * n + x;
  const land = (x, y) => { const t = GV.tile(x, y); return !!(t && (t.t === 1 || t.t === 2) && !t.road && !t.rail && !t.bld && !t.water); };
  let road = null, rail = null;
  for (let y = 6; y < n - 6 && !road; y++) for (let x = 4; x < n - 10; x++) { let ok = true; for (let i = 0; i < 4; i++) if (!land(x + i, y)) { ok = false; break; } if (ok) { road = { x, y }; break; } }
  for (let x = 4; x < n - 6 && !rail; x++) for (let y = 6; y < n - 12; y++) { let ok = true; for (let i = 0; i < 6; i++) if (!land(x, y + i)) { ok = false; break; } if (ok) { rail = { x, y }; break; } }
  if (!road || !rail) return { ok: false, reason: 'no-track' };
  for (let i = 0; i < 4; i++) GV.place('road', road.x + i, road.y);
  for (let i = 0; i < 6; i++) GV.place('rail', rail.x, rail.y + i);
  const L = GV.singleResearch052; L.demo();
  const ls = L.snapshot(); const b = ls.ledger.batches[0];
  GV.railBlock055.request('train-shot');
  const r = GV.intermodal057.start({
    roadFrom: idx(road.x, road.y), roadTo: idx(road.x + 3, road.y),
    railFrom: idx(rail.x, rail.y), railTo: idx(rail.x, rail.y + 4),
    cargo: { batchId: b.batchId, qty: b.qty }, capacity: 12,
    authority: 'train-shot', ledger: { sessionId: ls.ledger.sessionId, batchId: b.batchId }
  });
  if (r.ok) {
    for (let i = 0; i < r.roadSteps; i++) GV.intermodal057.advance();
    GV.intermodal057.transfer();
    for (let i = 0; i < r.railSteps; i++) GV.intermodal057.advance();
  }
  GV.intermodal057.open();
  return { ok: r.ok, trip: GV.intermodal057.snapshot() };
})()`;

const shot = async (cdp, file) => {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(OUT, file), Buffer.from(r.data, 'base64'));
  return file;
};

(async () => {
  const r = await withGame({ port: 8199, fresh: true, timeout: 900, log: () => {} }, async ({ cdp }) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise((res) => setTimeout(res, 2500));
    const stats = await cdp.evalJs(BUILD);
    await new Promise((res) => setTimeout(res, 10000));
    await cdp.evalJs('(()=>{GV.setSpeed(0);return 1})()');
    const files = [];
    files.push(await shot(cdp, '01-populated-city.png'));
    const trip = await cdp.evalJs(RUNTRIP);
    await new Promise((res) => setTimeout(res, 1200));
    files.push(await shot(cdp, '02-intermodal-delivered.png'));
    await cdp.evalJs('(()=>{GV.singleResearch052.open();return 1})()');
    await new Promise((res) => setTimeout(res, 1200));
    files.push(await shot(cdp, '03-shadow-ledger.png'));
    const s = await cdp.evalJs('(()=>GV.stats())()');
    return { stats, trip, files, statsAfter: s };
  });
  console.log(JSON.stringify({ ok: r.ok, files: r.result.files, trip: r.result.trip, stats: r.result.statsAfter }, null, 1));
  process.exitCode = r.ok ? 0 : 1;
})().catch((e) => { console.error(String((e && e.stack) || e)); process.exitCode = 1; });

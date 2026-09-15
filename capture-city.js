#!/usr/bin/env node
/* Showcase city screenshot helper. Slot=3. Port 8199. */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const OUT = arg('out', 'shots/city.png');
const SEED = +arg('seed', 5162026);
(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  const session = await withGame({ port: 8199, timeout: 300, log }, async ({ cdp }) => {
    const r = await cdp.evalJs(`window.GV.metroArtSeedWorld516(${SEED})`);
    await cdp.evalJs(`(() => { const st=document.getElementById('start'); if(st) st.style.display='none'; const ov=document.getElementById('startOverlay456'); if(ov){ ov.classList.remove('show'); ov.style.display='none'; } if (typeof draw==='function') draw(); return 1; })()`);
    await sleep(900);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const dest = path.join(ROOT, OUT);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
    const audit = await cdp.evalJs(`window.GV.t516 ? window.GV.t516() : null`);
    const b543 = await cdp.evalJs(`window.GV.build543 ? window.GV.build543() : null`);
    const ver = await cdp.evalJs(`(window.GV && (window.GV.build553||window.GV.build552||window.GV.build548)) ? (window.GV.build553||window.GV.build552||window.GV.build548)() : {ver:'?',anchor:'?'}`);
    return { r, audit, b543, ver, bytes: fs.statSync(dest).size };
  });
  if (!session.result) { console.log('X', session.fails.join(' / ')); process.exit(1); }
  console.log(JSON.stringify({ ver: session.result.ver, bytes: session.result.bytes, auditOk: session.result.audit && session.result.audit.ok, issues: (session.result.audit && session.result.audit.issues) || [], heights: session.result.audit && session.result.audit.heights, build: session.result.b543, roots: session.result.r && session.result.r.roots }, null, 2));
  console.log('OK wrote', OUT, session.seconds.toFixed(1) + 's');
})();

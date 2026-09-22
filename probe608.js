// T608 煙羽探針：開閥／關閥各拍一張工業區 1.5 倍近景（等幾秒讓煙粒累積）
'use strict';
const fs = require('fs'), path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const AT = arg('at', '46,30').split(',').map(Number), Z = +arg('zoom', 1.5), OUT = arg('out', 'shots/T608_smoke'), VAL = arg('valves', ''), WAIT = +arg('wait', 5000), SEA = arg('season', '');
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}${VAL ? VAL.split(',').map(v => `window.${v}=true;`).join('') : ''}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');
    await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${AT[0]},${AT[1]});GV.art574.zoom574(${Z});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`);
    for (let t = 0; t < WAIT; t += 300) { await sleep(300); await ev(`(typeof GV.forceDraw==='function')&&GV.forceDraw();1`); }
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(ROOT, OUT + '.png'), Buffer.from(shot.data, 'base64'));
    return { ok: 1 };
  });
  console.log(JSON.stringify(r.result || r.fails)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

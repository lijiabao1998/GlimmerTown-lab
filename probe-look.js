// 看城工具：種子城 + 指定縮放／時刻／鏡頭位置，一次拍多張。
// node probe-look.js --zoom=0.75 --ph=0.62 --at=36,36;20,40;50,30 --out=shots575/look
//   ph：一天中的相位 0..1（0.5 正午、0.25 日出、0.75 日落、0 深夜）
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const ZOOM = +arg('zoom', 0.75), PH = +arg('ph', 0.5), SEED = +arg('seed', 5162026);
const AT = arg('at', '36,36').split(';').map(s => s.split(',').map(Number));
const OUT = arg('out', 'shots575/look');
const EVAL = arg('eval', '');

(async () => {
  const session = await withGame({ port: 8198, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    await ev(`window.GV.metroArtSeedWorld516(${SEED})`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');
    const extra = EVAL ? await ev(EVAL) : null;
    const shots = [];
    for (let i = 0; i < AT.length; i++) {
      const [x, y] = AT[i];
      await ev(`GV.setVisT(${CY * PH});GV.lookAt(${x},${y});GV.art574.zoom574(${ZOOM});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`);
      await sleep(1100);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const dest = path.join(ROOT, `${OUT}_${i}.png`);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
      shots.push(path.relative(ROOT, dest));
    }
    return { shots, extra };
  });
  console.log(JSON.stringify({ ok: session.ok, fails: session.fails, seconds: session.seconds, ...(session.result || {}) }, null, 1));
  process.exit(session.ok ? 0 : 1);
})().catch(e => { console.error('LOOK FAIL', e.message); process.exit(1); });

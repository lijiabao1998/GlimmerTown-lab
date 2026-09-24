// T630 探針：T446D 合成窗格。種子城住宅近景（z=2）與近景（z=1.5）午夜，閥門 __noOwnNight630 開關各拍一張：
//   T446D 推的方塊數（window.__t446WindowCount）、修前修後差異像素，並存樣張。
// 用法：node probe630.js [--shots=shots630/T630]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['home_night', 12, 12, 2], ['near_night', 36, 36, 1.5]];
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(600);
    const out = {};
    for (const [name, x, y, zz] of VIEWS) {
      out[name] = await ev(`(()=>{const cv=document.getElementById('game'),c=cv.getContext('2d');
        const shot=off=>{window.__noOwnNight630=off;GV.lookAt(${x},${y});GV.art574.zoom574(${zz});GV.setVisT(GV.art574.cycle574()*.02);GV.forceDraw();window.__t446WindowCount=0;GV.forceDraw();
          return {n:window.__t446WindowCount,d:c.getImageData(0,0,cv.width,cv.height).data.slice(),u:cv.toDataURL('image/png')};};
        const O=shot(true),N=shot(false);window.__noOwnNight630=false;
        let diff=0;for(let i=0;i<O.d.length;i+=4)if(Math.abs(O.d[i]-N.d[i])+Math.abs(O.d[i+1]-N.d[i+1])+Math.abs(O.d[i+2]-N.d[i+2])>8)diff++;
        return {nOld:O.n,nNew:N.n,diff,uO:O.u,uN:N.u};})()`);
    }
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  let pass = true;
  for (const [name] of VIEWS) {
    const q = r.result[name];
    if (SHOTS) for (const [tag, u] of [['old', q.uO], ['new', q.uN]]) { const dest = path.resolve(ROOT, `${SHOTS}_${name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); }
    const ok = q.nNew < q.nOld && q.diff > 0;
    pass = pass && ok;
    console.log(`${name}：T446D 方塊 ${q.nOld} → ${q.nNew}｜修前修後差異 ${q.diff} 像素 ${ok ? '✓' : '✗'}`);
  }
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

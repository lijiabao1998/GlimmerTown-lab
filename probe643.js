// T643 像素守衛：種子城住宅近景（看 (12,12)、z=2）與中景（(24,20)、z=1），午夜（ph .02）：
//   這一幀來自超街區分條的窗燈筆數（__t643Push）> 0；亮窗像素（暖黃、亮度高）新版比關閥門（__noSbNight643）多；
//   關閥門時分條窗燈筆數 0；正午新舊逐像素相同。另存午夜近景、中景。
//   正午比對時關掉紅綠燈（__noSignal）：紅綠燈相位跟著 draw() 次數走（trafClock），新舊兩版畫的次數不同，右下角一盞燈 5×7 像素會不同（關閥門自己跟自己比也會，跟 T643 無關）。
// 用法：node probe643.js [--shots=shots643/T643]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = {};
    for (const [tag, look, z] of [['home', [12, 12], 2], ['mid', [24, 20], 1]]) {
      out[tag] = await ev(`(()=>{const sv=window.__noSbNight643,o={};
        const cv=document.getElementById('game'),g=cv.getContext('2d');
        const lit=d=>{let n=0;for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2];if(r>200&&gg>160&&b<190&&r>b+40)n++;}return n;};
        try{GV.lookAt(${look[0]},${look[1]});GV.art574.zoom574(${z});const C=GV.art574.cycle574();
          for(const [k,off] of [['new',false],['old',true]]){window.__noSbNight643=off;
            window.__t643Push=0;GV.setVisT(C*.02);GV.forceDraw();o[k+'Push']=window.__t643Push|0;o[k+'Lit']=lit(g.getImageData(0,0,cv.width,cv.height).data);
            const sg=window.__noSignal;window.__noSignal=true;GV.setVisT(C*.5);GV.forceDraw();o[k+'Noon']=g.getImageData(0,0,cv.width,cv.height).data;window.__noSignal=sg;}
          let diff=0;for(let i=0;i<o.newNoon.length;i++)if(o.newNoon[i]!==o.oldNoon[i])diff++;o.noonDiff=diff;delete o.newNoon;delete o.oldNoon;
        }finally{window.__noSbNight643=sv;}
        return o;})()`);
      if (SHOTS) out[tag].url = await ev(`(()=>{const sv=window.__noSbNight643;try{window.__noSbNight643=false;GV.lookAt(${look[0]},${look[1]});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.02);GV.forceDraw();return document.getElementById('game').toDataURL('image/png');}finally{window.__noSbNight643=sv;}})()`);
    }
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const checks = [];
  for (const tag of ['home', 'mid']) {
    const v = q[tag];
    if (v.url) { const dest = path.join(ROOT, `${SHOTS}_${tag}_night.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v.url.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
    console.log(`${tag}：分條窗燈 新 ${v.newPush}／關閥門 ${v.oldPush} 筆｜亮窗像素 新 ${v.newLit}／關閥門 ${v.oldLit}｜正午差 ${v.noonDiff} 位元組`);
    checks.push([`${tag} 午夜分條窗燈 ${v.newPush} 筆 > 0，關閥門 0`, v.newPush > 0 && v.oldPush === 0]);
    checks.push([`${tag} 亮窗像素 新 ${v.newLit} > 關閥門 ${v.oldLit}`, v.newLit > v.oldLit]);
    checks.push([`${tag} 正午新舊逐像素相同`, v.noonDiff === 0]);
  }
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T643 像素守衛成立' : 'X T643 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

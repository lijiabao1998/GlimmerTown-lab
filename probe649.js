// T649 像素守衛：種子城住宅近景 (12,12) z=2，關紅綠燈比（相位跟 draw 次數走，見 probe643）：
//   午夜：亮像素（亮度 > 150）的平均 B/R 比，新版比關閥門（__noWarmWin649）低 0.1 以上（偏暖）；
//   正午：新舊逐像素相同。另存午夜新舊各一張。
// 用法：node probe649.js [--shots=shots649/T649]   退出碼 0＝守衛成立
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
    const out = await ev(`(()=>{const sv=window.__noWarmWin649,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const br=d=>{let n=0,r=0,b=0;for(let i=0;i<d.length;i+=4)if(.299*d[i]+.587*d[i+1]+.114*d[i+2]>150){n++;r+=d[i];b+=d[i+2];}return {n,ratio:n?+(b/r).toFixed(3):0};};
      try{window.__noSignal=true;GV.lookAt(12,12);GV.art574.zoom574(2);const C=GV.art574.cycle574();
        for(const [k,off] of [['new',false],['old',true]]){window.__noWarmWin649=off;
          GV.setVisT(C*.02);GV.forceDraw();o[k]=br(g.getImageData(0,0,cv.width,cv.height).data);${SHOTS ? "o['url_'+k]=cv.toDataURL('image/png');" : ''}
          GV.setVisT(C*.5);GV.forceDraw();o[k+'Noon']=g.getImageData(0,0,cv.width,cv.height).data;}
        let diff=0;for(let i=0;i<o.newNoon.length;i++)if(o.newNoon[i]!==o.oldNoon[i])diff++;o.noonDiff=diff;delete o.newNoon;delete o.oldNoon;
      }finally{window.__noWarmWin649=sv;window.__noSignal=sg;}
      return o;})()`);
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['new', 'old']) if (q['url_' + k]) { const dest = path.join(ROOT, `${SHOTS}_night_${k}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url_' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`午夜亮像素：新 ${q.new.n} 個、B/R ${q.new.ratio}｜關閥門 ${q.old.n} 個、B/R ${q.old.ratio}｜正午差 ${q.noonDiff} 位元組`);
  const checks = [
    [`亮像素 B/R 新 ${q.new.ratio} 比關閥門 ${q.old.ratio} 低 0.1 以上`, q.old.ratio - q.new.ratio > 0.1],
    ['正午新舊逐像素相同', q.noonDiff === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T649 像素守衛成立' : 'X T649 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

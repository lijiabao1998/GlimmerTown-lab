// T648 像素守衛：種子城港區 (36,36)，關紅綠燈比（相位跟 draw 次數走，見 probe643）：
//   0.8 倍午夜：亮像素（亮度 > 150）新版比關閥門（__noLod648，門檻回到 1）多；
//   0.6 倍午夜：新舊逐像素相同（仍在省略模式）。
//   另量 0.8 倍白天、午夜 forceDraw 中位數（新舊並列，只記不判），存 0.8 倍午夜新舊各一張。
// 用法：node probe648.js [--shots=shots648/T648]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = await ev(`(()=>{const sv=window.__noLod648,sg=window.__noSignal,o={t:{}};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const bright=d=>{let n=0;for(let i=0;i<d.length;i+=4)if(.299*d[i]+.587*d[i+1]+.114*d[i+2]>150)n++;return n;};
      const med=()=>{const ts=[];for(let i=0;i<5;i++){const t=performance.now();GV.forceDraw();ts.push(performance.now()-t);}ts.sort((a,b)=>a-b);return +ts[2].toFixed(0);};
      try{window.__noSignal=true;GV.lookAt(36,36);const C=GV.art574.cycle574();
        for(const [k,off] of [['new',false],['old',true]]){window.__noLod648=off;
          GV.art574.zoom574(.8);GV.setVisT(C*.02);GV.forceDraw();o[k+'Bright']=bright(g.getImageData(0,0,cv.width,cv.height).data);o.t[k+'Night']=med();
          GV.setVisT(C*.5);GV.forceDraw();o.t[k+'Day']=med();
          GV.art574.zoom574(.6);GV.setVisT(C*.02);GV.forceDraw();o[k+'P60']=g.getImageData(0,0,cv.width,cv.height).data;}
        let diff=0;for(let i=0;i<o.newP60.length;i++)if(o.newP60[i]!==o.oldP60[i])diff++;o.diff60=diff;delete o.newP60;delete o.oldP60;
      }finally{window.__noLod648=sv;window.__noSignal=sg;}
      return o;})()`);
    if (SHOTS) for (const [k, off] of [['new', false], ['old', true]]) out['url_' + k] = await ev(`(()=>{const sv=window.__noLod648;try{window.__noLod648=${off};GV.lookAt(36,36);GV.art574.zoom574(.8);GV.setVisT(GV.art574.cycle574()*.02);GV.forceDraw();return document.getElementById('game').toDataURL('image/png');}finally{window.__noLod648=sv;}})()`);
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['new', 'old']) if (q['url_' + k]) { const dest = path.join(ROOT, `${SHOTS}_z080_night_${k}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url_' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`0.8 倍午夜亮像素 新 ${q.newBright}／關閥門 ${q.oldBright}｜0.6 倍午夜差 ${q.diff60} 位元組`);
  console.log(`forceDraw 中位數（ms，只記不判）：0.8 倍白天 新 ${q.t.newDay}／舊 ${q.t.oldDay}；午夜 新 ${q.t.newNight}／舊 ${q.t.oldNight}`);
  const checks = [
    [`0.8 倍午夜亮像素 新 ${q.newBright} > 關閥門 ${q.oldBright}`, q.newBright > q.oldBright],
    ['0.6 倍午夜新舊逐像素相同（仍省略）', q.diff60 === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T648 像素守衛成立' : 'X T648 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

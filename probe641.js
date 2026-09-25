// T641 像素守衛：種子城住宅近景（看 (12,12)、z=2），午夜掃一個泡泡週期（22 格、每 0.5 秒），數每一刻畫出的泡泡（__t521bb）：
//   新版最多泡泡數 > 0；關閥門（__noZzz641）時每一刻都是 0。另存冒最多那一刻的畫面。
// 泡泡計數 __t521bb 只在真的畫泡泡時更新，所以每次繪製前先歸零（第一版沒歸零，關閥門時讀到上一張的值）。
// 用法：node probe641.js [--shots=shots641/T641]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noZzz641,out={new:[],old:[]};let best={n:-1,vt:0};
      try{GV.lookAt(12,12);GV.art574.zoom574(2);const v0=GV.art574.cycle574()*0.9;
        for(let k=0;k<22;k++){const vt=v0+k*0.5;
          window.__noZzz641=false;window.__t521bb=0;GV.setVisT(vt);GV.forceDraw();const n=window.__t521bb|0;out.new.push(n);if(n>best.n)best={n,vt};
          window.__noZzz641=true;window.__t521bb=0;GV.setVisT(vt);GV.forceDraw();out.old.push(window.__t521bb|0);}
        out.nightB=+GV.daylightDbg().b.toFixed(2);
        if(${!!SHOTS}){window.__noZzz641=false;GV.setVisT(best.vt);GV.forceDraw();out.url=document.getElementById('game').toDataURL('image/png');}
      }finally{window.__noZzz641=sv;}
      out.best=best;return out;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  if (q.url) { const dest = path.join(ROOT, `${SHOTS}_night.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.url.split(',')[1], 'base64')); delete q.url; console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`午夜（b=${q.nightB}）一個週期 22 刻：新版泡泡數 ${q.new.join(',')}｜關閥門 ${q.old.join(',')}`);
  const checks = [
    [`新版最多同時 ${q.best.n} 個泡泡（> 0）`, q.best.n > 0],
    ['關閥門時每一刻都是 0（舊行為）', q.old.every(n => n === 0)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T641 像素守衛成立' : 'X T641 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

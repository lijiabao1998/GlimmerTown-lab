// T646 像素守衛：種子城水邊草地崖沿近景（轉向 1、看 (58,25)、z=2，決策單同一鏡頭），正午：
//   新舊（__noCliff646）畫面有差異；崖沿褐色像素（R 90–170、R > G+15、G > B+15）新版不到關閥門的一半。
//   地面快取鍵帶閥門，切閥門會重烘。關紅綠燈比（相位跟 draw 次數走，見 probe643）。另存新舊各一張。
// 用法：node probe646.js [--shots=shots646/T646]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noCliff646,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const brown=d=>{let n=0;for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2];if(r>=90&&r<=170&&r>gg+15&&gg>b+15)n++;}return n;};
      try{window.__noSignal=true;GV.setRot(1);GV.lookAt(58,25);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);
        window.__noCliff646=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;o.oldBrown=brown(A);${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
        window.__noCliff646=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;o.newBrown=brown(B);${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
        let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;o.diff=n;
      }finally{window.__noCliff646=sv;window.__noSignal=sg;GV.setRot(0);}
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['New', 'Old']) if (q['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`正午崖沿近景：差異像素 ${q.diff}｜崖沿褐色像素 新 ${q.newBrown}／關閥門 ${q.oldBrown}`);
  const checks = [
    [`新舊有差異（${q.diff} > 0）`, q.diff > 0],
    [`褐色像素 新 ${q.newBrown} < 關閥門 ${q.oldBrown} 的一半`, q.newBrown < q.oldBrown / 2],
    [`關閥門時褐色像素夠多可比（${q.oldBrown} > 200）`, q.oldBrown > 200],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T646 像素守衛成立' : 'X T646 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

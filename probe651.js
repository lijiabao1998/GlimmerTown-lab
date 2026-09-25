// T651 像素守衛：種子城 (12,40) z=1、正午（決策單同一鏡頭），關紅綠燈比（見 probe643）：
//   新舊（__noGrassGrid651）有差異；草地亮邊色（#83c467 ±1）像素新版比關閥門少八成以上。另存新舊各一張。
//   （第一版用 ±4，把草皮裡的斑點色 #86c468 也算進去了——斑點不在邊上、兩版都有，新版剩 0.213；改 ±1 只數邊線本身。）
// 用法：node probe651.js [--shots=shots651/T651]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noGrassGrid651,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const edge=d=>{let n=0;for(let i=0;i<d.length;i+=4)if(Math.abs(d[i]-0x83)<=1&&Math.abs(d[i+1]-0xc4)<=1&&Math.abs(d[i+2]-0x67)<=1)n++;return n;};
      try{window.__noSignal=true;GV.lookAt(12,40);GV.art574.zoom574(1);GV.setVisT(GV.art574.cycle574()*.5);
        window.__noGrassGrid651=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;o.oldEdge=edge(A);${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
        window.__noGrassGrid651=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;o.newEdge=edge(B);${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
        let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;o.diff=n;
      }finally{window.__noGrassGrid651=sv;window.__noSignal=sg;}
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['New', 'Old']) if (q['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`正午 (12,40) z=1：差異像素 ${q.diff}｜亮邊色像素 新 ${q.newEdge}／關閥門 ${q.oldEdge}`);
  const checks = [
    [`新舊有差異（${q.diff} > 0）`, q.diff > 0],
    [`亮邊色像素 新 ${q.newEdge} < 關閥門 ${q.oldEdge} 的兩成`, q.newEdge < q.oldEdge * 0.2],
    [`關閥門時亮邊色像素夠多可比（${q.oldEdge} > 500）`, q.oldEdge > 500],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T651 像素守衛成立' : 'X T651 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

// T647 像素守衛：種子城住宅近景（(12,12)、z=2、正午），先把附近超街區設成升起期（testAge635，age 5；決策單 D8 同一設定）：
//   新舊（__noBlockConstr647）畫面有差異；吊車黃（#c9973a 附近 ±14）像素新版比關閥門多三成以上（吊車照整塊地變高、變長）。
//   關紅綠燈比（相位跟 draw 次數走，見 probe643）。另存新舊各一張。
// 用法：node probe647.js [--shots=shots647/T647]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noBlockConstr647,sg=window.__noSignal,o={blocks:0};
      const O=GV.block559.origin;for(let y=6;y<20;y++)for(let x=6;x<20;x++){const t=GV.tile(x,y);if(!t||!t.bld||t.bld.ref||t.bld.k<1||t.bld.k>3)continue;const b=O(x,y);if(b&&b.w*b.h>=2){GV.testAge635(x,y,b.w,b.h,5);o.blocks++;}}
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const crane=d=>{let n=0;for(let i=0;i<d.length;i+=4)if(Math.abs(d[i]-201)<=14&&Math.abs(d[i+1]-151)<=14&&Math.abs(d[i+2]-58)<=14)n++;return n;};
      try{window.__noSignal=true;GV.lookAt(12,12);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);
        window.__noBlockConstr647=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;o.oldCrane=crane(A);${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
        window.__noBlockConstr647=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;o.newCrane=crane(B);${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
        let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;o.diff=n;
      }finally{window.__noBlockConstr647=sv;window.__noSignal=sg;}
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['New', 'Old']) if (q['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`testAge635 呼叫 ${q.blocks} 次（超街區逐格）｜差異像素 ${q.diff}｜吊車黃像素 新 ${q.newCrane}／關閥門 ${q.oldCrane}`);
  const checks = [
    [`有超街區設成施工中（呼叫 ${q.blocks} 次 > 0）`, q.blocks > 0],
    [`新舊有差異（${q.diff} > 0）`, q.diff > 0],
    [`吊車黃像素 新 ${q.newCrane} > 關閥門 ${q.oldCrane} × 1.3`, q.newCrane > q.oldCrane * 1.3],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T647 像素守衛成立' : 'X T647 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

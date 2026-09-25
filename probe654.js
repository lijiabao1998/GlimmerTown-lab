// T654 守衛：種子城。
//   像素：(32,58) z=1.5 正午（決策單同一鏡頭），新舊（__noNewTrees654）有差異；關紅綠燈比（見 probe643）。
//   樹種：這一幀畫到新樹種（索引 ≥ 13）的棵數，新版 > 0、關閥門 0（畫樹時記在 window.__t654New）。另存新舊各一張。
// 用法：node probe654.js [--shots=shots654/T654]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noNewTrees654,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      try{window.__noSignal=true;GV.lookAt(32,58);GV.art574.zoom574(1.5);GV.setVisT(GV.art574.cycle574()*.5);
        window.__noNewTrees654=true;window.__t654New=0;GV.forceDraw();o.oldNew=window.__t654New|0;const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
        window.__noNewTrees654=false;window.__t654New=0;GV.forceDraw();o.newNew=window.__t654New|0;const Bd=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
        let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==Bd[i]||A[i+1]!==Bd[i+1]||A[i+2]!==Bd[i+2])n++;o.diff=n;
      }finally{window.__noNewTrees654=sv;window.__noSignal=sg;}
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['New', 'Old']) if (q['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`(32,58) z=1.5 正午：畫到新樹種 新 ${q.newNew} 棵／關閥門 ${q.oldNew} 棵｜差異像素 ${q.diff}`);
  const checks = [
    [`新舊畫面有差異（${q.diff} > 0）`, q.diff > 0],
    [`新版這一幀畫到新樹種（${q.newNew} > 0）`, q.newNew > 0],
    [`關閥門這一幀沒畫到新樹種（${q.oldNew} = 0）`, q.oldNew === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T654 守衛成立' : 'X T654 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

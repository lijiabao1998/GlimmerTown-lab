// T652 守衛：種子城。
//   像素：(32,58) z=1 正午（決策單同一鏡頭），新舊（__noGrove652）有差異；關紅綠燈比（見 probe643）。
//   分群：全圖每棵樹「畫出來的樹種」，以 5×5 區塊為單位（區塊內至少 4 棵）算最多那一種的佔比，平均值新版比關閥門高 0.3 以上。
//   （卡面原寫從畫面顏色算分群；畫面上樹會互相遮、又跟季節色疊，直接用畫樹時查的樹種更準，見卡片第 6 節。）另存新舊各一張。
// 用法：node probe652.js [--shots=shots652/T652]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noGrove652,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const cluster=()=>{const B=new Map();let trees=0;for(let y=0;y<256;y++){if(!GV.tile(0,y))break;for(let x=0;x<256;x++){const t=GV.tile(x,y);if(!t)break;if(!t.tree)continue;trees++;const k=Math.floor(x/5)+','+Math.floor(y/5);if(!B.has(k))B.set(k,new Map());const m=B.get(k),v=GV.groveTree652(t.tree,x,y);m.set(v,(m.get(v)||0)+1);}}
        let sum=0,nb=0;for(const m of B.values()){let tot=0,mx=0;for(const c of m.values()){tot+=c;if(c>mx)mx=c;}if(tot>=4){sum+=mx/tot;nb++;}}return {trees,blocks:nb,share:+(sum/Math.max(1,nb)).toFixed(3)};};
      try{window.__noSignal=true;GV.lookAt(32,58);GV.art574.zoom574(1);GV.setVisT(GV.art574.cycle574()*.5);
        window.__noGrove652=true;o.old=cluster();GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
        window.__noGrove652=false;o.new=cluster();GV.forceDraw();const Bd=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
        let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==Bd[i]||A[i+1]!==Bd[i+1]||A[i+2]!==Bd[i+2])n++;o.diff=n;
      }finally{window.__noGrove652=sv;window.__noSignal=sg;}
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['New', 'Old']) if (q['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`全圖 ${q.new.trees} 棵樹、${q.new.blocks} 個區塊：最多樹種佔比 新 ${q.new.share}／關閥門 ${q.old.share}｜(32,58) 差異像素 ${q.diff}`);
  const checks = [
    [`新舊畫面有差異（${q.diff} > 0）`, q.diff > 0],
    [`區塊最多樹種佔比 新 ${q.new.share} 比關閥門 ${q.old.share} 高 0.3 以上`, q.new.share - q.old.share > 0.3],
    [`有夠多區塊可比（${q.new.blocks} > 20）`, q.new.blocks > 20],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T652 守衛成立' : 'X T652 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

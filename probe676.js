// T676 守衛：平地林的主樹種不再抽到觀賞樹（櫻花 8、紫葉李 10、鳳凰木 20）。同一次遊戲開關閥門 __noOrnDom676：
//   種子城平地樹的樹種統計（8＋10＋20 新版少、銀杏 5 新舊相同）；(63,13) z=1、z=2 正午新舊不同。--shots 時存新舊各兩張。
// 用法：node probe676.js [--shots=shots676/T676]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['mid', 63, 13, 1], ['near', 63, 13, 2]];
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(700);
    const tally = off => ev(`(()=>{const sv=window.__noOrnDom676;window.__noOrnDom676=${off};const c={all:0};try{for(let y=0;y<250;y++){if(!GV.tile(0,y))break;for(let x=0;x<250;x++){const u=GV.tile(x,y);if(!u||!u.tree||GV.terrainClass655(x,y)!==0)continue;c.all++;const v=GV.terrainTree655(u.tree,x,y);c[v]=(c[v]||0)+1;}}}finally{window.__noOrnDom676=sv;}return c;})()`);
    const cNew = await tally(false), cOld = await tally(true);
    const views = [];
    for (const [vn, x, y, z] of VIEWS) {
      const q = await ev(`(()=>{const sv=window.__noOrnDom676,sg=window.__noSignal,cv=document.getElementById('game'),g=cv.getContext('2d'),o={};
        try{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);
          window.__noOrnDom676=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.uOld=cv.toDataURL('image/png');" : ''}
          window.__noOrnDom676=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.uNew=cv.toDataURL('image/png');" : ''}
          let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;o.diff=n;
        }finally{window.__noOrnDom676=sv;window.__noSignal=sg;}return o;})()`);
      q.name = vn; views.push(q);
    }
    return { cNew, cOld, views };
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const { cNew, cOld, views } = r.result;
  for (const v of views) for (const [k, tag] of [['uNew', 'new'], ['uOld', 'old']]) if (v[k]) { const dest = path.join(ROOT, `${SHOTS}_${v.name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v[k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  const orn = c => (c[8] || 0) + (c[10] || 0) + (c[20] || 0);
  console.log(`平地樹 ${cNew.all} 棵：櫻花＋紫葉李＋鳳凰木 新 ${orn(cNew)}／舊 ${orn(cOld)}；銀杏 新 ${cNew[5] || 0}／舊 ${cOld[5] || 0}`);
  for (const v of views) console.log(`${v.name}：差異像素 ${v.diff}`);
  const checks = [
    ['觀賞樹（8、10、20）新版比舊版少', orn(cNew) < orn(cOld)],
    ['銀杏新舊相同（原本不是觀賞樹的區塊不變）', (cNew[5] || 0) === (cOld[5] || 0)],
    ['平地樹總數新舊相同', cNew.all === cOld.all],
    ['兩個鏡頭新舊不同', views.every(v => v.diff > 0)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T676 守衛成立' : 'X T676 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

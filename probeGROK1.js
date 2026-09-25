// GROK-001 守衛：平地同一鏡頭，甲／乙／丙三檔。
// 甲＝5×5、75%（現況）；乙＝5×5、90%；丙＝10×10、90%。
// 用法：node probeGROK1.js [--shots=shotsGROK1/flat]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

(async () => {
  const r = await withGame({ port: 8294, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(600);
    const spot = await ev(`(()=>{let best=null;for(let y=8;y<240;y++){if(!GV.tile(0,y))break;for(let x=8;x<240;x++){const t=GV.tile(x,y);if(!t||!t.tree||GV.terrainClass655(x,y)!==0)continue;let n=0;for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const u=GV.tile(x+dx,y+dy);if(u&&u.tree&&GV.terrainClass655(x+dx,y+dy)===0)n++;}if(!best||n>best.n)best={x,y,n};}}return best;})()`);
    const modes = ['a', 'b', 'c'];
    const shots = {};
    const stats = {};
    for (const m of modes) {
      const one = await ev(`(()=>{const sg=window.__noSignal,sm=window.__groveMixGROK1,q={};const cv=document.getElementById('game'),g=cv.getContext('2d');
        try{window.__noSignal=true;window.__groveMixGROK1=${JSON.stringify(m)};GV.lookAt(${spot.x},${spot.y});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);GV.forceDraw();
          const kinds={};let trees=0;for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const x=${spot.x}+dx,y=${spot.y}+dy,t=GV.tile(x,y);if(!t||!t.tree||GV.terrainClass655(x,y)!==0)continue;trees++;const v=GV.terrainTree655(t.tree,x,y);kinds[v]=(kinds[v]||0)+1;}
          q.trees=trees;q.kinds=Object.keys(kinds).length;q.top=Math.max(0,...Object.values(kinds));
          ${SHOTS ? "q.url=cv.toDataURL('image/png');" : ''}
        }finally{window.__groveMixGROK1=sm;window.__noSignal=sg;}return q;})()`);
      stats[m] = { trees: one.trees, kinds: one.kinds, top: one.top };
      if (one.url && SHOTS) shots[m] = one.url;
    }
    const diff = await ev(`(()=>{const sg=window.__noSignal,sm=window.__groveMixGROK1,q={};const cv=document.getElementById('game'),g=cv.getContext('2d');
      const snap=m=>{window.__groveMixGROK1=m;GV.forceDraw();return g.getImageData(0,0,cv.width,cv.height).data;};
      const n=(A,B)=>{let c=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])c++;return c;};
      try{window.__noSignal=true;GV.lookAt(${spot.x},${spot.y});GV.art574.zoom574(2);
        const A=snap('a'),B=snap('b'),C=snap('c');q.ab=n(A,B);q.ac=n(A,C);q.bc=n(B,C);
      }finally{window.__groveMixGROK1=sm;window.__noSignal=sg;}return q;})()`);
    return { spot, stats, diff, shots };
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  if (SHOTS) {
    fs.mkdirSync(path.join(ROOT, path.dirname(SHOTS)), { recursive: true });
    for (const m of ['a', 'b', 'c']) if (q.shots[m]) {
      const dest = path.join(ROOT, `${SHOTS}_${m}.png`);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(q.shots[m].split(',')[1], 'base64'));
      console.log('樣張 ' + path.relative(ROOT, dest));
    }
  }
  console.log('平地鏡頭 (' + q.spot.x + ',' + q.spot.y + ') 周圍平地樹 ' + q.spot.n);
  for (const m of ['a', 'b', 'c']) { const s = q.stats[m]; console.log(m + ' 13×13 平地樹 ' + s.trees + ' 棵、樹種 ' + s.kinds + '、最多 ' + s.top); }
  console.log('差異像素 甲乙 ' + q.diff.ab + '、甲丙 ' + q.diff.ac + '、乙丙 ' + q.diff.bc);
  const checks = [
    ['乙比甲少樹種或持平', q.stats.b.kinds <= q.stats.a.kinds],
    ['丙比甲少樹種', q.stats.c.kinds < q.stats.a.kinds],
    ['三檔畫面兩兩有差異', q.diff.ab > 0 && q.diff.ac > 0 && q.diff.bc > 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK GROK-001 守衛成立' : 'X GROK-001 守衛不成立');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

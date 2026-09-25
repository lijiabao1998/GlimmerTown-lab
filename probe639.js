// T639 探針：D0 補成建築。種子城：
//   ① 每一格住商工建築被幾個「會畫出來的」街區蓋到（0＝沒人畫、≥2＝重疊），補格開／關各算一次（算法照 probe633.js；補格時不吸收）；
//   ② 住宅近景、中景 forceDraw 平均毫秒（新舊交替量 5 輪）；③ 修前修後樣張。
// 用法：node probe639.js [--shots=shots639/T639]   退出碼 0＝沒人畫 0 格且重疊 0 格
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['home', 12, 12, 2], ['mid', 24, 20, 1]];

const COVER = fill => String.raw`(()=>{
  window.__noFill639=${!fill};
  const N=72,O=GV.block559.origin;
  const B=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=GV.tile(x,y);B.push(t&&t.bld?t.bld:null);}
  const bl=(x,y)=>(x<0||y<0||x>=N||y>=N)?null:B[y*N+x];
  const villa=(k,lv,v)=>{const a=GV.arche568(k,lv,v);return !!(a&&a.n==='villa');};
  const merge=(b,k)=>{if(!b||b.ref||b.k!==k)return false;if(k===1&&(b.lv||1)===1&&villa(k,b.lv||1,b.v||0))return false;return true;};
  const same=(x,y,k)=>x>=0&&y>=0&&x<N&&y<N&&merge(bl(x,y),k);
  const absorbed=(x,y)=>{if(${fill})return false;const b=bl(x,y);if(!b||b.ref||b.k<1||b.k>3)return false;const self=O(x,y);if(!self||self.w*self.h>=4)return false;
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=N||ny>=N)continue;const nb=bl(nx,ny);if(!nb||nb.ref||nb.k!==b.k)continue;
      let ox=nx,oy=ny;while(ox>0&&same(ox-1,oy,b.k))ox--;while(oy>0&&same(ox,oy-1,b.k))oy--;const ob=O(ox,oy);if(ob&&ob.w*ob.h>=4)return true;}
    return false;};
  const cnt=new Int32Array(N*N);let rci=0,blocks=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const b=bl(x,y);if(!b||b.ref||b.k<1||b.k>3)continue;rci++;
    const o=O(x,y);if(!o)continue;
    if(o.w>1||o.h>1){blocks++;for(let dy=0;dy<o.h;dy++)for(let dx=0;dx<o.w;dx++)cnt[(y+dy)*N+x+dx]++;}
    else if(!absorbed(x,y))cnt[y*N+x]++;}
  let c0=0,c1=0,c2=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const b=bl(x,y);if(!b||b.ref||b.k<1||b.k>3)continue;const c=cnt[y*N+x];if(c===0)c0++;else if(c===1)c1++;else c2++;}
  window.__noFill639=false;
  return {rci,c0,c1,c2,blocks};})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = { cNew: await ev(COVER(true)), cOld: await ev(COVER(false)), perf: {}, shots: [] };
    for (const [tag, x, y, z] of VIEWS) {
      const t = await ev(`(()=>{GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);const T={n:[],o:[]};
        for(let k=0;k<6;k++)for(const off of [false,true]){window.__noFill639=off;const t0=performance.now();GV.forceDraw();const dt=performance.now()-t0;if(k>0)(off?T.o:T.n).push(dt);}
        window.__noFill639=false;const avg=a=>+(a.reduce((p,q)=>p+q,0)/a.length).toFixed(1);return {newMs:avg(T.n),oldMs:avg(T.o)};})()`);
      out.perf[tag] = t;
      if (SHOTS) for (const [st, off] of [['old', true], ['new', false]]) {
        const u = await ev(`(()=>{window.__noFill639=${off};GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);GV.forceDraw();const u=document.getElementById('game').toDataURL('image/png');window.__noFill639=false;return u;})()`);
        const dest = path.join(ROOT, `${SHOTS}_${tag}_${st}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); out.shots.push(path.relative(ROOT, dest));
      }
    }
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  console.log(`① 住商工 ${q.cNew.rci} 格｜沒人畫 ${q.cOld.c0} → ${q.cNew.c0}｜重疊 ${q.cOld.c2} → ${q.cNew.c2}｜剛好一個 ${q.cOld.c1} → ${q.cNew.c1}｜多格街區 ${q.cOld.blocks} → ${q.cNew.blocks}`);
  for (const [k, v] of Object.entries(q.perf)) console.log(`② ${k}：forceDraw 舊 ${v.oldMs} ms → 新 ${v.newMs} ms（×${(v.newMs / v.oldMs).toFixed(2)}）`);
  if (q.shots.length) console.log('③ 樣張 ' + q.shots.join(' '));
  const ok = q.cNew.c0 === 0 && q.cNew.c2 === 0 && q.cOld.c0 > 0;
  console.log(ok ? 'OK T639 覆蓋守衛成立' : 'X T639 覆蓋守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

// T633 探針：超街區切分重疊。種子城：
//   ① 每一格住商工建築被幾個「會畫出來的」街區矩形蓋到（0＝沒人畫、≥2＝兩張精靈疊在同一格），閥門 __noPart633 開關各算一次；
//   ② 形狀改變的街區清單；③ 住宅近景 forceDraw 耗時（交替量）與每幀切分次數；④ rot 0／rot 3 修前修後差異像素與樣張。
// 用法：node probe633.js [--shots=shots633/T633]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['home_r0', 0, 12, 12, 2], ['home_r3', 3, 12, 12, 2]];
// 複製遊戲 objs 迴圈的判斷：起點（GV.block559.origin＝rciBlockOrigin547）多格就推整塊；1×1 且被 rciAbsorbed555 吸收就不畫
const COVER = String.raw`(()=>{
  const N=72,O=GV.block559.origin;
  const B=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=GV.tile(x,y);B.push(t&&t.bld?t.bld:null);}
  const bl=(x,y)=>(x<0||y<0||x>=N||y>=N)?null:B[y*N+x];
  const villa=(k,lv,v)=>{const a=GV.arche568(k,lv,v);return !!(a&&a.n==='villa');};
  const merge=(b,k)=>{if(!b||b.ref||b.k!==k)return false;if(k===1&&(b.lv||1)===1&&villa(k,b.lv||1,b.v||0))return false;return true;};
  const same=(x,y,k)=>x>=0&&y>=0&&x<N&&y<N&&merge(bl(x,y),k);
  const absorbed=(x,y)=>{const b=bl(x,y);if(!b||b.ref||b.k<1||b.k>3)return false;const self=O(x,y);if(!self||self.w*self.h>=4)return false;
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=N||ny>=N)continue;const nb=bl(nx,ny);if(!nb||nb.ref||nb.k!==b.k)continue;
      let ox=nx,oy=ny;while(ox>0&&same(ox-1,oy,b.k))ox--;while(oy>0&&same(ox,oy-1,b.k))oy--;const ob=O(ox,oy);if(ob&&ob.w*ob.h>=4)return true;}
    return false;};
  const cnt=new Int32Array(N*N),blocks={};let rci=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const b=bl(x,y);if(!b||b.ref||b.k<1||b.k>3)continue;rci++;
    const o=O(x,y);if(!o)continue;
    if(o.w>1||o.h>1){blocks[x+','+y]=o.w+'x'+o.h;for(let dy=0;dy<o.h;dy++)for(let dx=0;dx<o.w;dx++)cnt[(y+dy)*N+x+dx]++;}
    else if(!absorbed(x,y))cnt[y*N+x]++;}
  let c0=0,c1=0,c2=0;const byK={};
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const b=bl(x,y);if(!b||b.ref||b.k<1||b.k>3)continue;const c=cnt[y*N+x];if(c===0)c0++;else if(c===1)c1++;else{c2++;const kk='k'+b.k+' lv'+(b.lv||1);byK[kk]=(byK[kk]||0)+1;}}
  return {rci,c0,c1,c2,byK,nBlocks:Object.keys(blocks).length,blocks};})()`;
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(600);
    const out = {};
    out.cNew = await ev(`(()=>{window.__noPart633=false;return ${COVER};})()`);
    out.cOld = await ev(`(()=>{window.__noPart633=true;const r=${COVER};window.__noPart633=false;return r;})()`);
    // ③ 耗時：住宅近景，新舊交替各 5 輪 × 6 幀
    out.perf = await ev(`(()=>{GV.setRot(0);GV.lookAt(12,12);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);GV.forceDraw();GV.forceDraw();
      const T={old:[],neu:[]};let builds=0;
      for(let k=0;k<5;k++)for(const m of ['old','neu']){window.__noPart633=(m==='old');GV.forceDraw();const b0=window.__t633Builds|0;const t0=performance.now();for(let i=0;i<6;i++)GV.forceDraw();T[m].push((performance.now()-t0)/6);if(m==='neu')builds+=((window.__t633Builds|0)-b0);}
      window.__noPart633=false;const med=a=>a.slice().sort((p,q)=>p-q)[a.length>>1];
      return {old:+med(T.old).toFixed(2),neu:+med(T.neu).toFixed(2),oldAll:T.old.map(v=>+v.toFixed(2)),neuAll:T.neu.map(v=>+v.toFixed(2)),buildsPerDraw:+(builds/30).toFixed(2)};})()`);
    // ④ 樣張與差異
    for (const [name, rot, x, y, zz] of VIEWS) {
      out[name] = await ev(`(()=>{const cv=document.getElementById('game'),c=cv.getContext('2d');
        const shot=off=>{window.__noPart633=off;GV.setRot(${rot});GV.lookAt(${x},${y});GV.art574.zoom574(${zz});GV.setVisT(GV.art574.cycle574()*.5);GV.forceDraw();
          return {d:c.getImageData(0,0,cv.width,cv.height).data.slice(),u:cv.toDataURL('image/png')};};
        const O=shot(true),N2=shot(false),N3=shot(false);window.__noPart633=false;GV.setRot(0);
        let diff=0,noise=0;for(let i=0;i<O.d.length;i+=4){if(Math.abs(O.d[i]-N2.d[i])+Math.abs(O.d[i+1]-N2.d[i+1])+Math.abs(O.d[i+2]-N2.d[i+2])>8)diff++;if(Math.abs(N3.d[i]-N2.d[i])+Math.abs(N3.d[i+1]-N2.d[i+1])+Math.abs(N3.d[i+2]-N2.d[i+2])>8)noise++;}
        return {diff,noise,uO:O.u,uN:N2.u};})()`);
    }
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const q = r.result;
  const changed = [];
  for (const k of new Set([...Object.keys(q.cOld.blocks), ...Object.keys(q.cNew.blocks)])) if (q.cOld.blocks[k] !== q.cNew.blocks[k]) changed.push(`${k}：${q.cOld.blocks[k] || '1x1'}→${q.cNew.blocks[k] || '1x1'}`);
  console.log(`① 住商工 ${q.cNew.rci} 格｜重疊格（≥2 個街區）${q.cOld.c2} → ${q.cNew.c2}｜沒人畫 ${q.cOld.c0} → ${q.cNew.c0}｜剛好一個 ${q.cOld.c1} → ${q.cNew.c1}`);
  console.log(`   修正前重疊格依類別：${JSON.stringify(q.cOld.byK)}`);
  console.log(`② 多格街區 ${q.cOld.nBlocks} → ${q.cNew.nBlocks} 塊；形狀改變 ${changed.length} 塊：${changed.join('、')}`);
  console.log(`③ 住宅近景 forceDraw 中位數：修正前 ${q.perf.old}ms、修正後 ${q.perf.neu}ms（各 5 輪：${q.perf.oldAll.join('/')}｜${q.perf.neuAll.join('/')}）；每次 draw 切分 ${q.perf.buildsPerDraw} 次`);
  let pass = q.cNew.c2 === 0 && q.cOld.c2 > 0 && q.perf.buildsPerDraw <= 1.01;
  for (const [name] of VIEWS) {
    const v = q[name];
    if (SHOTS) for (const [tag, u] of [['old', v.uO], ['new', v.uN]]) { const dest = path.resolve(ROOT, `${SHOTS}_${name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); }
    console.log(`④ ${name}：修前修後差異 ${v.diff} 像素（修正後連拍兩次的雜訊 ${v.noise}）`);
    pass = pass && v.diff > v.noise;
  }
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

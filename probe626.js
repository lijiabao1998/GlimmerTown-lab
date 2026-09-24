// T626 實拍＋守衛：種子城工業區近景（看 (37,17)、z=2、正午），閥門開／關各拍一張，量「剛冒出的煙」離煙囪頂多遠。
//   探針不開局（running=false），主迴圈 frame() 直接返回、updSmoke 不會跑；改用 GV.advanceN 逐幀推進
//   （speed=0，模擬不前進，只推動畫層）。這是 T608／T613「城裡的煙粒沒拍到過」的原因。
//   量尺：先推進 6 秒讓煙冒滿，再一幀一幀推到剛好冒出一批新煙（smokeCount 變多），這批煙只活了 0.05 秒、
//   離源頭不到 1 個 view 單位。攔主畫布上煙粒的 fillRect（alpha>.47＝這一批，含畫面外），量它到全圖最近煙囪頂的距離；
//   煙囪頂＝GV.smokeViewSrc626 的 view 座標投到畫面（ox＋vx·z），閥門開關都用它當真值。
//   通過：修正後每一顆 ≤3px、而且 y 位移為負（已往畫面上方飄）；修正前 rot 0 的中位數≈32·z（64px），rot 1–3 更遠。
// 用法：node probe626.js [--shots=shots626/T626] [--rots=0,1,2,3] [--json=out.json]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', ''), ROTS = arg('rots', '0,1,2,3').split(',').map(Number), JSON_OUT = arg('json', '');
const COLS = ['#5b5551', '#c7ccd1', '#dfe5ea', '#d8d2c6'];   // T608 路徑的煙色（工業三色＋冬季民居／店屋）
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';GV.setSpeed(0);return 1;})()`);
    await sleep(800);
    const out = {};
    for (const rot of ROTS) for (const [tag, off] of [['new', false], ['old', true]]) {
      const q = await ev(`(()=>{window.__noSmokeView626=${off};GV.setRot(${rot});GV.lookAt(37,17);GV.art574.zoom574(2);
        GV.advanceN(.05,120);let n0=GV.smokeCount(),f=0;for(;f<20;f++){GV.advanceN(.05,1);const n1=GV.smokeCount();if(n1>n0)break;n0=n1;}
        GV.setVisT(GV.art574.cycle574()*.5);
        const cv=document.getElementById('game'),c=cv.getContext('2d'),cols=new Set(${JSON.stringify(COLS)}),puffs=[],of=c.fillRect;
        c.fillRect=function(x,y,w,h){const fs=String(this.fillStyle).toLowerCase();if(cols.has(fs)&&this.globalAlpha>0&&this.globalAlpha<.51)puffs.push([x,y,w,+this.globalAlpha.toFixed(3),fs]);return of.apply(this,arguments);};
        try{GV.forceDraw();}finally{delete c.fillRect;}
        const cam=GV.camera436(),z=cam.z,W=cv.width,H=cv.height,ox=Math.round(W/2-cam.x*z),oy=Math.round(H/2-cam.y*z),chimAll=[];
        const sv=window.__noSmokeView626;window.__noSmokeView626=false;
        try{for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y);if(!t||!t.bld)continue;const src=GV.smokeViewSrc626(x,y,t.bld);if(!src)continue;
          for(const p of src)chimAll.push([+(ox+p.vx*z).toFixed(1),+(oy+p.vy*z).toFixed(1),x,y]);}}
        finally{window.__noSmokeView626=sv;}
        const chim=chimAll.filter(h=>h[0]>-40&&h[0]<W+40&&h[1]>-40&&h[1]<H+40);
        // 量尺用全圖：畫面外的煙粒照樣有繪製呼叫，剛冒出的那一批（alpha>.47）全部算，對全圖煙囪頂找最近的
        const yp=puffs.filter(p=>p[3]>.47).map(p=>{let best=1e9,bh=null;for(const h of chimAll){const d=Math.hypot(p[0]-h[0],p[1]-h[1]);if(d<best){best=d;bh=h;}}return [+best.toFixed(1),bh?+(p[1]-bh[1]).toFixed(1):null];});
        const young=yp.map(q=>q[0]),youngDy=yp.map(q=>q[1]); // youngDy：剛冒出的煙相對最近煙囪頂的 y 位移（負＝畫面往上）
        return {frames:f+1,n:GV.smokeCount(),puffs:puffs.length,inView:puffs.filter(p=>p[0]>=0&&p[0]<W&&p[1]>=0&&p[1]<H).length,chim:chim.length,chimAll:chimAll.length,young,youngDy,
          puffList:puffs.filter(p=>p[0]>=0&&p[0]<W&&p[1]>=0&&p[1]<H),chimList:chim,u:document.getElementById('game').toDataURL('image/png')};})()`);
      if (SHOTS) { const dest = path.resolve(ROOT, `${SHOTS}_rot${rot}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.u.split(',')[1], 'base64')); }
      delete q.u;
      const ys = q.young.slice().sort((a, b) => a - b);
      q.youngN = ys.length; q.youngMed = ys.length ? ys[ys.length >> 1] : null; q.youngMax = ys.length ? ys[ys.length - 1] : null; q.youngMin = ys.length ? ys[0] : null;
      out[`rot${rot}_${tag}`] = q;
    }
    await ev(`(()=>{window.__noSmokeView626=false;GV.setRot(0);return 1;})()`);
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const res = r.result;
  if (JSON_OUT) fs.writeFileSync(path.resolve(ROOT, JSON_OUT), JSON.stringify(res));
  let pass = true;
  for (const rot of ROTS) {
    const nw = res[`rot${rot}_new`], od = res[`rot${rot}_old`];
    const okNew = nw.youngN > 0 && nw.youngMax <= 3 && nw.youngDy.every(d => d < 0);   // 貼著煙囪頂，而且已經往畫面上方飄
    const okOld = od.youngN > 0 && (rot === 0 ? Math.abs(od.youngMed - 64) <= 4 : od.youngMed > 20);
    pass = pass && okNew && okOld;
    console.log(`rot${rot}  修正後：畫面煙粒 ${nw.inView}、剛冒出 ${nw.youngN} 顆，離煙囪頂 最大 ${nw.youngMax}px、y 位移 ${[...new Set(nw.youngDy)].join('／')}px ${okNew ? '✓' : '✗'}` +
      `｜修正前：剛冒出 ${od.youngN} 顆，中位數 ${od.youngMed}px（最小 ${od.youngMin}）${okOld ? '✓ 守衛有效' : '✗'}｜煙囪頂 畫面 ${nw.chim}／全圖 ${nw.chimAll}`);
  }
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

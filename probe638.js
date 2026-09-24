// T638 探針：地標塔（k105／k106）夜裡的 T446D 合成窗格。種子城 (24,16)、z=1.5 午夜，閥門 __noVariantNight638 開關各畫一次：
//   T446D 方塊數（__t446WindowCount）、落在地標塔上的方塊有幾個不在塔自己的亮窗 2px 內；存修前修後樣張。
// 用法：node probe638.js [--shots=shots638/T638]
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
    await sleep(500);
    const out = {};
    for (const valve of [true, false]) out[valve ? 'old' : 'new'] = await ev(`(()=>{window.__noVariantNight638=${valve};GV.lookAt(24,16);GV.art574.zoom574(1.5);GV.setVisT(GV.art574.cycle574()*.02);
      const P=CanvasRenderingContext2D.prototype,o=P.fillRect,sq=[];
      P.fillRect=function(x,y,w,h){const f=String(this.fillStyle);if(/^rgba\\(255, ?(224|218|210), ?(156|142|130)/.test(f)&&w<12&&h<12)sq.push([x+w/2,y+h/2]);return o.call(this,x,y,w,h);};
      window.__ovCapMax606=6000;window.__ovCapAll608=true;window.__ovCap606=[];window.__t446WindowCount=0;
      try{GV.forceDraw();}finally{P.fillRect=o;}
      const cap=window.__ovCap606;window.__ovCap606=null;const n446=window.__t446WindowCount|0;window.__noVariantNight638=false;
      let mine=0,off=0;for(const it of cap){if(!(it.bd.k===105||it.bd.k===106))continue;const s=it.s,nc=s.night;if(!nc)continue;const f=nc.width/s.w,W=nc.width,H=nc.height,d=nc.getContext('2d').getImageData(0,0,W,H).data;
        for(const [x,y] of sq){const lx=(x-it.bx)/it.z,ly=(y-it.by)/it.z;if(lx<0||ly<0||lx>s.w||ly>s.h)continue;mine++;const cx=Math.round(lx*f),cy=Math.round(ly*f);let hit=false;
          for(let dy=-2;dy<=2&&!hit;dy++)for(let dx=-2;dx<=2;dx++){const X=cx+dx,Y=cy+dy;if(X>=0&&Y>=0&&X<W&&Y<H&&d[(Y*W+X)*4+3]>40){hit=true;break;}}if(!hit)off++;}}
      return {n446,mine,off,u:document.getElementById('game').toDataURL('image/png')};})()`);
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const { old: O, new: N } = r.result;
  if (SHOTS) for (const [tag, q] of [['old', O], ['new', N]]) { const dest = path.resolve(ROOT, `${SHOTS}_tower_night_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.u.split(',')[1], 'base64')); }
  console.log(`T446D 方塊：修正前 ${O.n446}（落在地標塔上 ${O.mine}，其中 ${O.off} 個不在塔自己的亮窗 2px 內）→ 修正後 ${N.n446}（落在地標塔上 ${N.mine}）`);
  const pass = O.mine > 0 && O.off > 0 && N.mine === 0;
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

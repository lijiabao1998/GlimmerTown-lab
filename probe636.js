// T636 探針：摩天樓屋頂警示燈。種子城摩天樓（看得到塔頂的鏡頭 (16,4)、z=1），閥門 __noAnchor636 開關各畫一次：
//   攔截 SPR.warnBlink 的實際繪製位置，換回該棟精靈的畫布座標，查半徑 3px 內有沒有不透明像素（貼在塔上／浮空）；存修前修後樣張。
// 用法：node probe636.js [--shots=shots636/T636]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['tower_day', 16, 4, 1, .5], ['tower_night', 16, 4, 1, .02]];
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(500);
    const out = {};
    for (const [name, x, y, z, ph] of VIEWS) for (const valve of [true, false]) {
      out[name + (valve ? '_old' : '_new')] = await ev(`(()=>{window.__noAnchor636=${valve};GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*${ph});
        const SPR=GV.art574.SPR(),WB=new Set((SPR.warnBlink||[]).map(f=>f.img)),cv=document.getElementById('game'),g=cv.getContext('2d');
        const hits=[],o=g.drawImage;g.drawImage=function(img,...a){if(WB.has(img)&&a.length===4){const f=SPR.warnBlink.find(q=>q.img===img);hits.push({x:a[0]+f.ax*a[2]/f.w,y:a[1]+f.ay*a[3]/f.h});}return o.call(this,img,...a);};
        window.__ovCapMax606=6000;window.__ovCapAll608=true;window.__ovCap606=[];
        try{GV.forceDraw();}finally{g.drawImage=o;}
        const cap=window.__ovCap606;window.__ovCap606=null;
        const AP=GV.anchorPts636;let on=0,off=0,unmatched=0;const pts=[];
        const cand=cap.filter(it=>it.bd.k===33||it.bd.k===34).map(it=>{const p=AP.warnPt636(it.bd,it.s);return {it,x:it.bx+p[0]*it.z,y:it.by+p[1]*it.z,p};}); // 同一個閥門狀態算每棟的預期燈位
        window.__noAnchor636=false;
        for(const h of hits){const c=cand.find(q=>Math.abs(q.x-h.x)<1.5&&Math.abs(q.y-h.y)<1.5);if(!c){unmatched++;continue;}
          const ok=AP.opaqueNear636(c.it.s,c.p[0],c.p[1],3);ok?on++:off++;pts.push([Math.round(h.x),Math.round(h.y),ok]);}
        return {n:hits.length,on,off,unmatched,pts:pts.slice(0,8),u:cv.toDataURL('image/png')};})()`);
    }
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  let pass = true;
  for (const [name] of VIEWS) {
    const O = r.result[name + '_old'], N = r.result[name + '_new'];
    if (SHOTS) for (const [tag, q] of [['old', O], ['new', N]]) { const dest = path.resolve(ROOT, `${SHOTS}_${name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.u.split(',')[1], 'base64')); }
    console.log(`${name}：警示燈 修正前 ${O.n} 盞（貼在塔上 ${O.on}、浮空 ${O.off}、配不到 ${O.unmatched}）→ 修正後 ${N.n} 盞（貼在塔上 ${N.on}、浮空 ${N.off}、配不到 ${N.unmatched}）｜修正後位置 ${JSON.stringify(N.pts)}`);
    pass = pass && N.n > 0 && N.off === 0 && N.unmatched === 0 && O.unmatched === 0 && O.off > 0;
  }
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

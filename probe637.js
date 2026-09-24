// T637 探針：農戶 k22 的農夫。種子城（夏天；展示區外另蓋幾座完工農戶）把鏡頭對準每一座農戶，閥門 __noFarmer637 開關各畫一次：
//   攔截農夫藍衣（#4a6e9c）的實際繪製位置，換回農戶精靈的畫布座標，查是否落在精靈的不透明像素上；存修前修後樣張。
// 用法：node probe637.js [--shots=shots637/T637]
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
    // 種子城只有一座農戶，而且不一定輪到農夫（出現與否看格子雜湊，約四成）：夏天、在展示區外的自然地形多蓋幾座、設成完工
    const planted = await ev(`(()=>{GV.setSeason(1);let n=0;for(let y=4;y<44;y+=3)for(let x=51;x<68;x+=3){if(GV.place('farm',x,y)){GV.testAge635(x,y,2,2,30);n++;}}return n;})()`);
    const farms = await ev(`(()=>{const L=[];for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y);if(t&&t.bld&&!t.bld.ref&&t.bld.k===22)L.push([x,y,t.bld.v|0]);}return L;})()`);
    const out = { farms: farms.length, planted, rows: [] };
    for (const [x, y] of farms) for (const valve of [true, false]) {
      const q = await ev(`(()=>{window.__noFarmer637=${valve};GV.lookAt(${x + 1},${y + 1});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);
        const cv=document.getElementById('game'),g=cv.getContext('2d'),o=g.fillRect,hits=[];
        g.fillRect=function(a,b,c,d){if(String(this.fillStyle).toLowerCase()==='#4a6e9c')hits.push([a,b]);return o.call(this,a,b,c,d);};
        window.__ovCapMax606=6000;window.__ovCapAll608=true;window.__ovCap606=[];
        try{GV.forceDraw();}finally{g.fillRect=o;}
        const cap=window.__ovCap606;window.__ovCap606=null;window.__noFarmer637=false;
        const it=cap.find(q=>q.o.x===${x}&&q.o.y===${y}&&q.bd.k===22);
        let res=null;if(it&&hits.length){const s=it.s,img=s.img,k=img.width/s.w,gg=img.getContext('2d');
          res=hits.map(h=>({lx:(h[0]-it.bx)/it.z+1,ly:(h[1]-it.by)/it.z+3})).filter(q=>q.lx>15&&q.lx<120&&q.ly>105&&q.ly<150) // 只算這一座的農夫：新舊站位範圍聯集；相鄰農戶隔 3 格，換到這張精靈上至少差 (96,48)
            .map(q=>{const px=Math.round(q.lx*k),py=Math.round(q.ly*k);const a=(px<0||py<0||px>=img.width||py>=img.height)?0:gg.getImageData(px,py,1,1).data[3];return {lx:+q.lx.toFixed(1),ly:+q.ly.toFixed(1),a};});
          if(!res.length)res=null;}
        return {n:hits.length,res,u:res?cv.toDataURL('image/png'):null};})()`);
      out.rows.push({ x, y, valve, ...q });
    }
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const { farms, planted, rows } = r.result;
  let withFarmer = 0, offOld = 0, offNew = 0, saved = false;
  for (let i = 0; i < rows.length; i += 2) {
    const O = rows[i], N = rows[i + 1];
    if (!O.res || !N.res) continue;
    withFarmer++;
    const oOff = O.res.some(q => q.a < 60), nOff = N.res.some(q => q.a < 60);
    if (oOff) offOld++; if (nOff) offNew++;
    console.log(`農戶 (${O.x},${O.y})：修正前農夫在精靈座標 ${JSON.stringify(O.res.map(q => [q.lx, q.ly, q.a]))} ${oOff ? '（在田外）' : ''} → 修正後 ${JSON.stringify(N.res.map(q => [q.lx, q.ly, q.a]))} ${nOff ? '（在田外）' : ''}`);
    if (SHOTS && !saved && oOff) { for (const [tag, q] of [['old', O], ['new', N]]) { const dest = path.resolve(ROOT, `${SHOTS}_farm_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.u.split(',')[1], 'base64')); } saved = true; }
  }
  console.log(`種子城農戶 ${farms} 座（原有 ${farms - planted}、探針另蓋 ${planted}），其中 ${withFarmer} 座有農夫：修正前在田外 ${offOld} 座 → 修正後 ${offNew} 座`);
  const pass = withFarmer > 0 && offNew === 0;
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

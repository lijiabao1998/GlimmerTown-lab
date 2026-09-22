// 「這個螢幕點是哪棟建築畫的」探針：畫一幀、抓每棟建築的精靈與螢幕位置，對每個點找最上層蓋到它的不透明精靈
//  node probe-what.js --at=36,36 --zoom=1.5 --pts=300,200;420,260 [--shot=shots/x]
'use strict';
const fs = require('fs'), path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const AT = arg('at', '36,36').split(',').map(Number), Z = +arg('zoom', 1.5), SHOT = arg('shot', '');
const PTS = arg('pts', '600,300').split(';').map(p => p.split(',').map(Number));
const EXPR = String.raw`(()=>{
  const PTS=__PTS__;const SPR=GV.art574.SPR(),map=new Map(),seen=new Set();
  const walk=(o,p,d)=>{if(!o||d>4||seen.has(o)||typeof o!=='object')return;seen.add(o);if(o.img instanceof HTMLCanvasElement&&typeof o.ax==='number'){if(!map.has(o))map.set(o,p);}for(const k of Object.keys(o)){if(k==='img'||k==='night')continue;try{walk(o[k],p+'.'+k,d+1);}catch(e){}}};
  walk(SPR,'SPR',0);
  const cap=window.__ovCapKeep608||[];const out=[];
  for(const [px,py] of PTS){let best=null;
    for(let i=0;i<cap.length;i++){const it=cap[i],s=it.s;if(!s||!s.img)continue;const u=Math.floor((px-it.bx)/it.z),v=Math.floor((py-it.by)/it.z);
      if(u<0||v<0||u>=s.w||v>=s.h)continue;const c=document.createElement('canvas');c.width=1;c.height=1;const g=c.getContext('2d');
      const k=(s.img.width/s.w)||1;g.drawImage(s.img,Math.floor(u*k),Math.floor(v*k),1,1,0,0,1,1);if(g.getImageData(0,0,1,1).data[3]<30)continue;best={i,it,u,v};}
    if(!best){out.push({pt:[px,py],hit:null});continue;}
    const {it,u,v}=best,bd=it.bd,s=it.s;
    out.push({pt:[px,py],tile:[it.o.x,it.o.y],bld:JSON.stringify(bd,(k,v)=>(v===0||v===false||v===null||v==='')?undefined:v).slice(0,140),
      spr:map.get(s)||(s.__t547?('街區精靈 '+JSON.stringify({...s.__t547,wall:undefined})):('未知 '+s.w+'x'+s.h)),w:s.w,h:s.h,sc:s.sc,u,v,block:it.o.block547?it.o.block547.w+'x'+it.o.block547.h:null});}
  return out;})()`;
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');
    await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${AT[0]},${AT[1]});GV.art574.zoom574(${Z});1`);
    await sleep(600);
    await ev(`window.__ovCapMax606=4000;window.__ovCapAll608=true;window.__ovCap606=[];(typeof GV.forceDraw==='function')&&GV.forceDraw();1`);
    await sleep(500);
    await ev(`window.__ovCapKeep608=window.__ovCap606;window.__ovCap606=null;1`);
    if (SHOT) { const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(ROOT, SHOT + '.png'), Buffer.from(shot.data, 'base64')); }
    return await ev(EXPR.replace('__PTS__', JSON.stringify(PTS)));
  });
  console.log(JSON.stringify(r.result || r.fails, null, 1)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

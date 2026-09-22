// T607 探針 b：在主畫布上找白框深心小晶片，換回地格，列出那格的內容
'use strict';
const { withGame, sleep } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const AT = arg('at', '46,30').split(',').map(Number), Z = +arg('zoom', 1.5);
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');
    await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${AT[0]},${AT[1]});GV.art574.zoom574(${Z});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`);
    await sleep(1000);
    return await ev(`(()=>{
      const cvs=[...document.querySelectorAll('canvas')].map(c=>({c,w:c.width,h:c.height,cw:c.clientWidth,ch:c.clientHeight,id:c.id,cls:c.className})).filter(x=>x.cw>0);
      const main=cvs.sort((a,b)=>b.w*b.h-a.w*a.h)[0];const c=main.c,W=c.width,H=c.height,DPR=W/c.clientWidth;
      const d=c.getContext('2d').getImageData(0,0,W,H).data;const px=(x,y)=>{const i=(y*W+x)*4;return [d[i],d[i+1],d[i+2]];};
      const near=(p,q,t)=>Math.abs(p[0]-q[0])<=t&&Math.abs(p[1]-q[1])<=t&&Math.abs(p[2]-q[2])<=t;
      const WH=[0xf4,0xf2,0xec],DK=[0x3a,0x40,0x48];const hits=[];
      for(let y=4;y<H-4;y+=1)for(let x=4;x<W-4;x+=1){if(!near(px(x,y),DK,6))continue;
        // 深心四周 3~6px 處要有白框
        let wh=0;for(const [dx,dy] of [[-4,0],[4,0],[0,-4],[0,4],[-5,0],[5,0],[0,-5],[0,5]])if(near(px(x+dx,y+dy),WH,10))wh++;
        if(wh>=4&&!hits.some(h=>Math.abs(h[0]-x)<12&&Math.abs(h[1]-y)<12))hits.push([x,y]);}
      const cam=GV.camera436();
      const toT=(X,Y)=>{const wx=(X-(W/2-cam.x*cam.z))/cam.z,wy=(Y-(H/2-cam.y*cam.z))/cam.z;return [Math.floor((wx/32+wy/16)/2),Math.floor((wy/16-wx/32)/2)];};
      const out=hits.slice(0,14).map(([X,Y])=>{const res={};for(const dy of [6,14,22]){const [tx,ty]=toT(X,Y+dy);let t=null;try{t=GV.tile(tx,ty)}catch(e){}res['下'+dy]=[tx,ty,t?JSON.stringify(t,(k,v)=>(v===0||v===false||v===null||v===''||v===undefined)?undefined:v).slice(0,150):null];}return {X,Y,...res};});
      return {canvases:cvs.map(x=>x.id+'.'+x.cls+' '+x.w+'x'+x.h),DPR,cam:{x:cam.x,y:cam.y,z:cam.z},n:hits.length,out};})()`);
  });
  console.log(JSON.stringify(r.result, null, 1)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

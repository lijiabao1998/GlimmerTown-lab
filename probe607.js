// T607 探針：攔一幀的 drawImage，把來源畫布對回 SPR 路徑，找出草地上白框深心小晶片是哪一族
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
    await sleep(900);
    return await ev(`(()=>{
      const SPR=GV.art574.SPR(),map=new Map(),seen=new Set();
      const walk=(o,p,d)=>{if(!o||d>5||seen.has(o))return;if(typeof o!=='object')return;seen.add(o);
        if(o instanceof HTMLCanvasElement||(typeof OffscreenCanvas!=='undefined'&&o instanceof OffscreenCanvas)||o instanceof HTMLImageElement){if(!map.has(o))map.set(o,p);return;}
        for(const k of Object.keys(o)){try{walk(o[k],p+'.'+k,d+1);}catch(e){}}};
      walk(SPR,'SPR',0);
      const P=CanvasRenderingContext2D.prototype,oD=P.drawImage,cnt={};
      P.drawImage=function(...a){try{const src=a[0];const n=a.length;const dw=n>=9?a[7]:n>=5?a[3]:src.width,dh=n>=9?a[8]:n>=5?a[4]:src.height;
        if(this.canvas&&this.canvas.width>600&&dw<=40&&dh<=40){let p=map.get(src);if(!p){ // 小圖：取中心與邊角顏色當指紋
            let sig='?';try{const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const g=c.getContext('2d');g.drawImage(src,0,0);const d1=g.getImageData(src.width>>1,src.height>>1,1,1).data,d2=g.getImageData(1,1,1,1).data;sig=[...d1.slice(0,3)].map(v=>v.toString(16).padStart(2,'0')).join('')+'/'+[...d2.slice(0,3)].map(v=>v.toString(16).padStart(2,'0')).join('');}catch(e){}
            p='(非 SPR '+src.width+'x'+src.height+' 中心/角 '+sig+')';}
          const k=p+' → '+Math.round(dw)+'x'+Math.round(dh);cnt[k]=(cnt[k]||0)+1;}}catch(e){}return oD.apply(this,a)};
      (typeof GV.forceDraw==='function')&&GV.forceDraw();
      return new Promise(res=>setTimeout(()=>{(typeof GV.forceDraw==='function')&&GV.forceDraw();P.drawImage=oD;res({sprCanvases:map.size,top:Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,30)});},600));})()`);
  });
  console.log(JSON.stringify(r.result, null, 1)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

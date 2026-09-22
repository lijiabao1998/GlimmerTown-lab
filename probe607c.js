// T607 探針 c：攔所有繪製呼叫，只留「覆蓋到指定螢幕點」的，帶來源 SPR 路徑與原始碼行號
//  node probe607c.js --at=46,30 --zoom=1.5 --pts=810,38;763,62
'use strict';
const { withGame, sleep } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const AT = arg('at', '46,30').split(',').map(Number), Z = +arg('zoom', 1.5);
const PTS = arg('pts', '810,38;763,62;953,15').split(';').map(p => p.split(',').map(Number));
const EXPR = String.raw`(()=>{
  const PTS=__PTS__;const SPR=GV.art574.SPR(),map=new Map(),seen=new Set();
  const walk=(o,p,d)=>{if(!o||d>5||seen.has(o)||typeof o!=='object')return;seen.add(o);if(o instanceof HTMLCanvasElement){if(!map.has(o))map.set(o,p);return;}for(const k of Object.keys(o)){try{walk(o[k],p+'.'+k,d+1);}catch(e){}}};
  walk(SPR,'SPR',0);
  const game=document.getElementById('game')||[...document.querySelectorAll('canvas')].sort((a,b)=>b.width*b.height-a.width*a.height)[0];
  const P=CanvasRenderingContext2D.prototype,orig={},log={};
  const hit=(g,x,y,w,h)=>{const m=g.getTransform();const x0=m.a*x+m.e,y0=m.d*y+m.f,x1=m.a*(x+w)+m.e,y1=m.d*(y+h)+m.f;return PTS.findIndex(([px,py])=>px>=Math.min(x0,x1)&&px<=Math.max(x0,x1)&&py>=Math.min(y0,y1)&&py<=Math.max(y0,y1));};
  const where=()=>(new Error().stack||'').split('\n').slice(2,5).map(s=>{const m=/at (\S+) .*index\.html:(\d+):\d+/.exec(s);if(m)return m[1]+'@'+m[2];const m2=/index\.html:(\d+):\d+/.exec(s);return m2?'@'+m2[1]:s.trim().slice(0,30);}).join(' <- ');
  const rec=k=>{log[k]=(log[k]||0)+1;};
  orig.drawImage=P.drawImage;P.drawImage=function(...a){try{if(this.canvas===game){const n=a.length;let x,y,w,h;if(n>=9){x=a[5];y=a[6];w=a[7];h=a[8];}else if(n>=5){x=a[1];y=a[2];w=a[3];h=a[4];}else{x=a[1];y=a[2];w=a[0].width;h=a[0].height;}
    const i=hit(this,x,y,w,h);if(i>=0&&w*h<30000)rec('點'+i+' drawImage '+(map.get(a[0])||('非SPR '+a[0].width+'x'+a[0].height))+' '+Math.round(w)+'x'+Math.round(h)+' '+where());}}catch(e){}return orig.drawImage.apply(this,a)};
  orig.fillRect=P.fillRect;P.fillRect=function(x,y,w,h){try{if(this.canvas===game&&w*h<2000){const i=hit(this,x,y,w,h);if(i>=0)rec('點'+i+' fillRect '+String(this.fillStyle)+' '+Math.round(w)+'x'+Math.round(h)+' '+where());}}catch(e){}return orig.fillRect.call(this,x,y,w,h)};
  orig.strokeRect=P.strokeRect;P.strokeRect=function(x,y,w,h){try{if(this.canvas===game){const i=hit(this,x,y,w,h);if(i>=0)rec('點'+i+' strokeRect '+String(this.strokeStyle)+' '+Math.round(w)+'x'+Math.round(h)+' '+where());}}catch(e){}return orig.strokeRect.call(this,x,y,w,h)};
  orig.fillText=P.fillText;P.fillText=function(t,x,y,...r){try{if(this.canvas===game){const i=hit(this,x-12,y-14,24,18);if(i>=0)rec('點'+i+' fillText '+JSON.stringify(String(t).slice(0,6))+' '+this.font+' '+where());}}catch(e){}return orig.fillText.call(this,t,x,y,...r)};
  (typeof GV.forceDraw==='function')&&GV.forceDraw();
  return new Promise(res=>setTimeout(()=>{(typeof GV.forceDraw==='function')&&GV.forceDraw();Object.assign(P,orig);
    res(Object.entries(log).sort((a,b)=>b[1]-a[1]).slice(0,40));},500));})()`;
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');
    await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${AT[0]},${AT[1]});GV.art574.zoom574(${Z});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`);
    await sleep(800);
    return await ev(EXPR.replace('__PTS__', JSON.stringify(PTS)));
  });
  console.log(JSON.stringify(r.result || r.fails, null, 1)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

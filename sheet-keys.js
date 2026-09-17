// 指定 sprite 鍵名出日夜接觸表：node sheet-keys.js --keys=146_1_0,146_1_1 --scale=4 --out=shots575/bess.png
'use strict';
const fs=require('fs'),path=require('path');const {withGame,ROOT}=require('./harness.js');
const arg=(n,d)=>{const h=process.argv.find(a=>a.startsWith('--'+n+'='));return h?h.split('=').slice(1).join('='):d;};
const KEYS=arg('keys','').split(',').filter(Boolean),S=+arg('scale',4),OUT=arg('out','shots575/keys.png'),COLS=+arg('cols',99);
(async()=>{const r=await withGame({port:8199,timeout:300,enterCity:false,log:()=>{}},async({cdp})=>{
  const ev=async e=>{const q=await cdp.send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true});if(q.exceptionDetails)throw new Error(q.exceptionDetails.text);return q.result.value;};
  for(let i=0;i<120;i++){if(await ev('!!window.__bootDone453'))break;await new Promise(x=>setTimeout(x,1000));}
  const out=await ev(`(()=>{const SPR=GV.art574.SPR(),K=${JSON.stringify(KEYS)},S=${S};const sp=K.map(k=>SPR.bld[k]).filter(Boolean);
    const C=Math.min(${COLS},sp.length),R=Math.ceil(sp.length/C);const cw=Math.max(...sp.map(s=>s.w))*S+10,ch=Math.max(...sp.map(s=>s.h))*S+22;const c=document.createElement('canvas');c.width=cw*C;c.height=ch*2*R;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    sp.forEach((s,i)=>{const X=(i%C)*cw,Y=Math.floor(i/C)*ch*2;g.fillStyle='#5f8f4a';g.fillRect(X,Y,cw-2,ch-2);g.drawImage(s.img,X+5,Y+ch-5-s.h*S,s.w*S,s.h*S);g.fillStyle='#fff';g.font='bold 14px sans-serif';g.fillText(K[i],X+4,Y+15);
      g.fillStyle='#141a2c';g.fillRect(X,Y+ch,cw-2,ch-2);g.save();g.filter='brightness(0.36) saturate(0.7)';g.drawImage(s.img,X+5,Y+2*ch-5-s.h*S,s.w*S,s.h*S);g.restore();if(s.night)g.drawImage(s.night,X+5,Y+2*ch-5-s.h*S,s.w*S,s.h*S);});
    return {png:c.toDataURL('image/png').split(',')[1],n:sp.length,info:window.__t575Bess||null};})()`);
  fs.mkdirSync(path.dirname(path.join(ROOT,OUT)),{recursive:true});fs.writeFileSync(path.join(ROOT,OUT),Buffer.from(out.png,'base64'));return {n:out.n,info:out.info};});
  console.log(JSON.stringify({ok:r.ok,fails:r.fails,res:r.result}));process.exit(r.ok?0:1);})().catch(e=>{console.error('SHEET FAIL',e.message);process.exit(1);});

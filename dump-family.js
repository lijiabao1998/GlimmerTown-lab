// 把任一 SPR 家族（陣列或物件）排成接觸表：node dump-family.js --fam=deco --scale=3 --out=shots575/deco.png
'use strict';
const fs=require('fs'),path=require('path');const {withGame,ROOT}=require('./harness.js');
const arg=(n,d)=>{const h=process.argv.find(a=>a.startsWith('--'+n+'='));return h?h.split('=').slice(1).join('='):d;};
const FAM=arg('fam','deco'),S=+arg('scale',3),OUT=arg('out','shots575/fam.png');
(async()=>{const r=await withGame({port:8199,timeout:300,enterCity:false,log:()=>{}},async({cdp})=>{
  const ev=async e=>{const q=await cdp.send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true});if(q.exceptionDetails)throw new Error(q.exceptionDetails.text);return q.result.value;};
  for(let i=0;i<120;i++){if(await ev('!!window.__bootDone453'))break;await new Promise(x=>setTimeout(x,1000));}
  return await ev(`(()=>{const SP=GV.art574.SPR();const L=[];const add=(k,o)=>{const im=o&&o.img?o.img:(o&&o.getContext?o:null);if(im)L.push([k,im]);};
    for(const fam of ${JSON.stringify(FAM)}.split(',')){const F=SP[fam];if(!F)continue;if(F.img)add(fam,F);else if(Array.isArray(F))F.forEach((o,i)=>add(fam+'['+i+']',o));else for(const k in F)add(fam+'.'+k,F[k]);}
    const S=${S},cw=Math.max(...L.map(q=>q[1].width))*S+8,ch=Math.max(...L.map(q=>q[1].height))*S+20,C=8,R=Math.ceil(L.length/C);
    const c=document.createElement('canvas');c.width=cw*C;c.height=ch*R;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#5f8f4a';g.fillRect(0,0,c.width,c.height);
    L.forEach(([k,im],i)=>{const X=(i%C)*cw,Y=Math.floor(i/C)*ch;g.strokeStyle='#355';g.strokeRect(X,Y,cw,ch);g.drawImage(im,X+4,Y+16,im.width*S,im.height*S);g.fillStyle='#fff';g.font='bold 13px sans-serif';g.fillText(k+' '+im.width+'x'+im.height,X+3,Y+13);});
    return {png:c.toDataURL('image/png').split(',')[1],n:L.length};})()`);});
  fs.writeFileSync(path.join(ROOT,OUT),Buffer.from(r.result.png,'base64'));console.log('n=',r.result.n,'wrote',OUT);process.exit(0);})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});

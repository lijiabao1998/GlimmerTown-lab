'use strict';
// Actual release sprites, before optional destructive / gameplay fixtures.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame,ROOT}=require('./harness.js'),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),out=path.join(ROOT,'shots','heritage024');
(async()=>{
  const s=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp})=>{
    const r=await cdp.evalJs(`(()=>{
      GV.setSpeed(0);const before=JSON.stringify(GV.stats()),a=GV.heritage024,checks=a.selftest(),data=GV.sheet536('bld','^bld\\.24_1_1[0-5][0-9]$');
      if(!checks.ok)throw Error(checks.checks.find(q=>q.endsWith('✗')));if(!data.ok||data.leaves.length!==60)throw Error('Gallery requires 60 actual sprites');
      const sheet=document.createElement('canvas');sheet.width=1100;sheet.height=810;const g=sheet.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,1100,810);
      a.rows().forEach((q,i)=>{const x=i%5*220,y=Math.floor(i/5)*270,s=GV.art574.SPR().bld['24_1_'+q.v];g.drawImage(s.img,x+30,y+9);g.fillStyle='#e4d6b6';g.font='13px sans-serif';g.fillText(String(i+1).padStart(2,'0')+' '+q.en,x+10,y+226,205);g.fillStyle='#a6b6a6';g.font='11px sans-serif';g.fillText(q.shape,x+10,y+247,205);});
      if(before!==JSON.stringify(GV.stats()))throw Error('Gallery changed simulation stats');return{data:data.leaves,checks,contact:sheet.toDataURL('image/png'),version:GV.ver(),slot:localStorage.getItem('glimmerville.v1.slot')};
    })()`);if(cdp.errors.length)throw Error(cdp.errors.join('; '));return r;
  });
  assert(s.ok&&s.result,'heritage024 actual sprite gallery: '+s.fails.join('; '));const r=s.result;assert.equal(r.slot,'3');fs.mkdirSync(out,{recursive:true});const images=[];
  for(const a of r.data)for(const layer of['day','night']){const bytes=Buffer.from(a[layer].split(',')[1],'base64'),name=a.p.replace('bld.','')+'-'+layer+'.png';fs.writeFileSync(path.join(out,name),bytes);images.push({name,w:a.w,h:a.h,sha256:hash(bytes)});}
  fs.writeFileSync(path.join(out,'contact-day.png'),Buffer.from(r.contact.split(',')[1],'base64'));fs.writeFileSync(path.join(out,'gallery-manifest.json'),JSON.stringify({head:process.env.GITHUB_SHA,indexSHA256:hash(fs.readFileSync(path.join(ROOT,'index.html'))),version:r.version,checks:r.checks,images,slot:3},null,2)+'\n');
  console.log('heritage024 real Chrome gallery: 120 original PNGs, 15 structural silhouettes, stats unchanged.');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

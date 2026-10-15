/* Original native Chrome images; CI only, slot 3 owned by unchanged harness. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame,ROOT}=require('./harness.js');
const out=path.join(ROOT,'shots','light023'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
  const r=await withGame({port:8199,timeout:300,log:console.log},async({cdp})=>cdp.evalJs(`(()=>{
    GV.setSpeed(0);const state=JSON.stringify(GV.stats());
    const after=GV.sheet536('bld','^bld\\.(27[4-9]|28[0-9]|29[0-3])_1_[0-3]$');
    if(!after.ok||after.leaves.length!==80)throw Error('Exactly 80 native sprite views');
    const had=Object.hasOwn(window,'__noLightFix745'),old=window.__noLightFix745,before=[];
    try{
      window.__noLightFix745=true;
      for(const name of ['BritishStreetLifeArchitecture009','BritishMuseumArchitecture010','BritishRiversideArchitecture012','BritishTheatreArchitecture013','BritishComplexesArchitecture014']){
        const a=window[name].buildAll();
        for(const [k,views]of Object.entries(a.buildings))for(let v=0;v<4;v++){
          const s=views[v];before.push({p:'bld.'+k+'_1_'+v,w:s.w,h:s.h,day:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')});
        }
      }
    }finally{if(had)window.__noLightFix745=old;else delete window.__noLightFix745;}
    if(state!==JSON.stringify(GV.stats()))throw Error('Sample read changed simulation stats');
    return{after:after.leaves,before,unchangedStats:true,slot:localStorage.getItem('glimmerville.v1.slot')};
  })()`));
  assert(r.ok&&r.result,'native Chrome run: '+r.fails.join('; '));
  const data=r.result;assert.equal(data.slot,'3');assert.equal(data.before.length,80);
  const previous=new Map(data.before.map(x=>[x.p,x]));
  for(const s of data.after){const b=previous.get(s.p);assert(b,s.p+' original');assert.equal(s.night,b.night,s.p+' physical emission unchanged');if(/_[02]$/.test(s.p))assert.equal(s.day,b.day,s.p+' original view unchanged');assert.equal(s.w,b.w);assert.equal(s.h,b.h);}
  fs.mkdirSync(out,{recursive:true});const rows=[];
  for(const phase of ['before','after'])for(const s of data[phase])for(const layer of ['day','night']){
    const bytes=Buffer.from(s[layer].split(',')[1],'base64'),file=phase+'-'+s.p.replace('bld.','')+'-'+layer+'.png';
    fs.writeFileSync(path.join(out,file),bytes);rows.push({file,sha256:hash(bytes),w:s.w,h:s.h});
  }
  const meta={head:process.env.GITHUB_SHA,indexSHA256:hash(fs.readFileSync(path.join(ROOT,'index.html'))),images:rows,slot:3,checks:{images:320,nightUnchanged:80,originalViewsUnchanged:40,simulationStatsUnchanged:true},chrome:r.chromeMs};
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(meta,null,2)+'\n');
  console.log('GPT-023 native Chrome: 320 before/after PNGs, 80 night images exact, 40 original views exact, stats unchanged.');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave047 game guards run on GitHub Actions only');
// Real native game canvas, only on GitHub Actions. No shared guard is modified.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js'),BASE='182150fae37c7d95aee352ec6f901316668ad91b',OUT=path.join(ROOT,'shots','wave047','scenes');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),index=path.join(ROOT,'index.html'),head=fs.readFileSync(index),base=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024});
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const stateCheck=(actual,expected,label)=>{const a=JSON.stringify(canon(actual)),b=JSON.stringify(canon(expected));assert(a===b,label+' expected '+hash(Buffer.from(b))+' got '+hash(Buffer.from(a)));};
function stateDiff(a,b,p='',out=[]){if(JSON.stringify(canon(a))===JSON.stringify(canon(b)))return out;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))stateDiff(a[k],b[k],p? p+'.'+k:k,out);}else if(out.length<30){const small=v=>typeof v==='string'&&v.length>100?{length:v.length,sha256:hash(Buffer.from(v))}:v;out.push({path:p,before:small(a),after:small(b)});}return out;}
const opt={port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>0.125',log:console.log};
function transfer(name,bytes){const b64=bytes.toString('base64');console.log('WAVE047_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:bytes.length,sha256:hash(bytes)}));for(let i=0;i<b64.length;i+=4096)console.log('WAVE047_FILE_DATA '+b64.slice(i,i+4096));console.log('WAVE047_FILE_END '+name);}
function write(name,url){const bytes=Buffer.from(url.split(',')[1],'base64');fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,name),bytes);return{file:name,bytes:bytes.length,sha256:hash(bytes)};}
function legacyFixture047(reference){
  GV.setSpeed(0);GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);
  if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const p={x:7,y:4},key='glimmerville.v1.s3.sandbox516b';let initial;
  if(reference){localStorage.setItem(key,reference);if(!GV.load())throw Error('scene047 first real legacy migration load');GV.save();}
  else{
    if(!GV.place('landmark',p.x,p.y))throw Error('scene047 legacy native fixture');GV.testAge635(p.x,p.y,2,2,30);GV.save();initial=JSON.parse(localStorage.getItem(key));
    // Produce an actual previously loaded/saved old file on BASE. The fresh QA
    // constructor's first native load normalizes existing fields on BASE too;
    // retain that preparation difference instead of deleting fields from checks.
    for(let i=0;i<2;i++){if(!GV.load())throw Error('scene047 baseline save preparation');GV.save();}
  }
  const raw=localStorage.getItem(key);if(!raw)throw Error('scene047 slot3 sandbox save absent');
  const states=[JSON.parse(raw)];for(let pass=0;pass<2;pass++){if(!GV.load())throw Error('scene047 old native load');GV.save();states.push(JSON.parse(localStorage.getItem(key)));}
  return{key,raw,states,p,initial,input:reference?JSON.parse(reference):null};
}
function oldFrames047(valve){
  if(valve)window.__noBritishWave047=true;
  // Existing T695 cross-boot clock fixture. Water has its own half-second timer,
  // independent of visT; pin its actual native frame without disabling water.
  window.__waterF695=0;
  const frames=[];GV.setSpeed(0);GV.selectTool434('pan');document.getElementById('game').dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  for(const mode of['day','night'])for(let rot=0;rot<4;rot++){
    GV.britishWeather004(1,0,0);GV.setRot(rot);GV.art574.zoom574(1.5);GV.lookAt(7.5,4.5);GV.setVisT(GV.art574.cycle574()*(mode==='day'?.5:.02));GV.forceDraw();GV.setVisT(GV.art574.cycle574()*(mode==='day'?.5:.02));GV.forceDraw();
    const c=document.getElementById('game');frames.push({name:'legacy-'+mode+'-r'+rot+'.png',w:c.width,h:c.height,data:c.toDataURL('image/png')});
  }
  return frames;
}
function installScene047(rows){
  delete window.__noBritishWave047;GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  for(const q of rows){if(!GV.britishWave047.select(q.id)||!GV.place('landmark',q.x,q.y))throw Error('scene047 native catalog placement '+q.id);GV.testAge635(q.x,q.y,2,2,30);}
  GV.britishWave047.close();GV.selectTool434('pan');
  return rows.map(q=>({id:q.id,variant:GV.britishWave047.read(q.x,q.y).v}));
}
function scene047(spec,rows){
  GV.setSpeed(0);GV.selectTool434('pan');document.getElementById('game').dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  for(const q of rows)GV.testAge635(q.x,q.y,2,2,spec.age??30);
  GV.britishWeather004(spec.season??1,spec.weather??0,spec.snow??0);GV.setRot(spec.rot??0);GV.art574.zoom574(spec.z??1);GV.lookAt(...(spec.at??[21,4.5]));
  if(spec.hover){GV.selectTool434('tree');GV.lookAt(...spec.hover);const c=document.getElementById('game'),r=c.getBoundingClientRect();c.dispatchEvent(new PointerEvent('pointermove',{clientX:r.left+r.width/2,clientY:r.top+r.height/2,pointerId:99,pointerType:'mouse'}));}
  const t=GV.art574.cycle574()*(spec.night?.02:.5);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();
  const c=document.getElementById('game');return{data:c.toDataURL('image/png'),w:c.width,h:c.height,season:GV.season().idx,brightness:GV.daylightDbg().b,age:spec.age??30,rot:spec.rot??0,z:spec.z??1,hover:GV.t459().hover,camera:GV.camera436()};
}
function edge047(id){
  GV.newWorldSeeded(87);GV.setSpeed(0);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  // Prepare the corner with native demolition/fill, then native paid placement.
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){GV.place('doze',x,y);GV.place('tland',x,y);}
  if(!GV.britishWave047.select(id)||!GV.place('landmark',0,0))throw Error('scene047 actual native edge placement '+id);GV.testAge635(0,0,2,2,30);
  return{smoke:GV.britishWave047.sprite(0,0).smoke.length};
}
(async()=>{
  const report={head:process.env.GITHUB_SHA,base:BASE,frames:[],failures:[],unrun:[],notes:['Visual fixtures use fixed Math.random, visT and the existing T695 native water-frame clock input; no render layer is disabled. Ordinary native gameplay validation uses the separate native probe.','Edge scene uses native demolition/fill followed by actual paid native placement.','Strict failures remain RED at exit; independent scene evidence is retained before failing. No save field is excluded or normalized by the probe.'],notApplicable:{waterReflection:'Existing reflectSprite rejects all size>=2 native buildings; unchanged for these 2x2 appearances.',smoke:'All ten native sprites intentionally have smoke:[]; heritage display chimneys are inactive.',neonSigns:'Existing animated neon applies to k=2 commercial buildings, not unchanged k=24 landmark appearances.'}};
  const strict=fn=>{try{fn();return true;}catch(e){report.failures.push(e.message);console.error('scene047 STRICT RED: '+e.message);return false;}};
  let old;
  try{
    fs.writeFileSync(index,base);
    const r=await withGame(opt,async({cdp})=>{
      const fixture=await cdp.evalJs('('+legacyFixture047.toString()+')()'),frames=await cdp.evalJs('('+oldFrames047.toString()+')(false)');
      if(cdp.errors.length)throw Error(cdp.errors.join('; '));return{fixture,frames};
    });assert(r.ok&&r.result,'scene047 baseline: '+r.fails.join('; '));old=r.result;
  }finally{fs.writeFileSync(index,head);}
  fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'legacy-base.json'),old.fixture.raw);
  report.oldSavePreparation={source:BASE,nativeLoadSaveRounds:2,differences:stateDiff(old.fixture.initial,old.fixture.states[0])};
  assert.equal(report.oldSavePreparation.differences.length,0,'scene047 BASE preparation already stable, no fiscal normalization');
  console.log('scene047 BASE native preparation differences '+JSON.stringify(report.oldSavePreparation.differences));
  const r=await withGame(opt,async({cdp})=>{
    const fixture=await cdp.evalJs('('+legacyFixture047.toString()+')('+JSON.stringify(old.fixture.raw)+')');
    assert.equal(fixture.states[0].gameVer,'14.65','scene047 exact frozen candidate writer');
    const migration=stateDiff(fixture.input,fixture.states[0]);
    assert.deepEqual(migration,[],'scene047 candidate legacy load changes no field');report.oldSaveMigration=migration;
    const matchesBase=strict(()=>stateCheck(fixture.states,old.fixture.states,'scene047 complete old-save behavior matches baseline, every field without exclusions'));
    let allFieldsEqual=true;const differences=[];
    for(let pass=1;pass<fixture.states.length;pass++){if(!strict(()=>stateCheck(fixture.states[pass],fixture.states[0],'scene047 old save roundtrip all fields '+pass)))allFieldsEqual=false;differences.push({pass,differences:stateDiff(fixture.states[0],fixture.states[pass])});}
    report.oldSave={slot:3,sandbox:true,passes:2,matchesBase,allFieldsEqual,differences,baseSHA256:hash(Buffer.from(old.fixture.raw))};
    console.log('scene047 old-save complete-field evidence '+JSON.stringify(report.oldSave));
    report.negative=[];
    let first;
    if(allFieldsEqual){
      const altered=await cdp.evalJs('(()=>{const key='+JSON.stringify(fixture.key)+',d=JSON.parse(localStorage.getItem(key));d.money-=1;localStorage.setItem(key,JSON.stringify(d));if(!GV.load())throw Error("negative old-save load");GV.save();return JSON.parse(localStorage.getItem(key));})()');
      try{stateCheck(altered,fixture.states[0],'scene047 old save roundtrip all fields');}catch(e){first=e.message;}assert(first?.startsWith('scene047 old save roundtrip all fields'),'scene047 old-save negative missed target');report.negative.push({name:'real slot3 load/save loses one dollar',first});
      const restored=await cdp.evalJs('(()=>{localStorage.setItem('+JSON.stringify(fixture.key)+','+JSON.stringify(fixture.raw)+');if(!GV.load())throw Error("restore old-save load");GV.save();return JSON.parse(GV.rawSave());})()');strict(()=>stateCheck(restored,fixture.states[0],'scene047 old-save restored GREEN'));
    }else report.unrun.push('Old-save negative/restoration not claimed because its positive complete-state guard is RED.');
    const frames=await cdp.evalJs('('+oldFrames047.toString()+')(true)');
    assert.equal(frames.length,old.frames.length);report.valve=[];
    let framesEqual=true;
    for(let i=0;i<frames.length;i++){const a=Buffer.from(old.frames[i].data.split(',')[1],'base64'),b=Buffer.from(frames[i].data.split(',')[1],'base64');write('base-'+frames[i].name,old.frames[i].data);write('valve-'+frames[i].name,frames[i].data);if(!b.equals(a)&&framesEqual){transfer('scenes/base-'+frames[i].name,a);transfer('scenes/valve-'+frames[i].name,b);}const equal=strict(()=>assert(b.equals(a),'scene047 base/valve whole native frame '+frames[i].name+' '+hash(a)+' vs '+hash(b)));if(!equal)framesEqual=false;report.valve.push({name:frames[i].name,w:frames[i].w,h:frames[i].h,sha256:hash(b),equal});}
    if(framesEqual){
      const damaged=await cdp.evalJs('(()=>{const c=document.getElementById("game"),g=c.getContext("2d"),d=g.getImageData(0,0,1,1);d.data[0]^=255;g.putImageData(d,0,0);return c.toDataURL("image/png");})()');
      const bad=Buffer.from(damaged.split(',')[1],'base64'),good=Buffer.from(old.frames.at(-1).data.split(',')[1],'base64');first=null;try{assert(bad.equals(good),'scene047 base/valve whole native frame');}catch(e){first=e.message;}assert(first?.startsWith('scene047 base/valve whole native frame'),'scene047 full-frame negative missed target');report.negative.push({name:'real native canvas one-pixel corruption',first});
      const clear=await cdp.evalJs('('+oldFrames047.toString()+')(true)');strict(()=>assert(Buffer.from(clear.at(-1).data.split(',')[1],'base64').equals(good),'scene047 full-frame restored GREEN'));
    }else report.unrun.push('Full-frame negative/restoration: the positive whole-frame criterion is RED; not claimed passed.');
    // Coordinates come from the preview job at this same immutable head;
    // re-place every form through the native API at this head before rendering.
    const rows=JSON.parse(fs.readFileSync(path.join(ROOT,'shots','wave047','preview','manifest-preview047.json'))).placed;
    await cdp.evalJs('('+installScene047.toString()+')('+JSON.stringify(rows)+')');
    const specs=[];for(const [label,season,snow]of[['spring',0,0],['summer',1,0],['autumn',2,0],['winter-bare',3,0],['winter-snow',3,12]])for(const night of[false,true])for(let rot=0;rot<4;rot++)specs.push({name:label+'-'+(night?'night':'day')+'-r'+rot,season,snow,night,rot});
    for(const q of rows)specs.push({name:'near-'+q.id,z:2,at:[q.x+.5,q.y+.5]});
    specs.push({name:'far-day',z:.45},{name:'far-night',z:.45,night:true},{name:'construction-early',age:1},{name:'construction-middle',age:4},{name:'construction-late',age:7},{name:'hover-hopdrying',z:2,at:[13.5,4.5],hover:[13,3]},{name:'rain-night',weather:2,snow:12,night:true});
    for(const spec of specs){const f=await cdp.evalJs('('+scene047.toString()+')('+JSON.stringify(spec)+','+JSON.stringify(rows)+')');const meta={...spec,...f};delete meta.data;Object.assign(meta,write(spec.name+'.png',f.data));report.frames.push(meta);if(['summer-day-r0','winter-snow-day-r0','near-hopdrying'].includes(spec.name))transfer('scenes/'+spec.name+'.png',fs.readFileSync(path.join(OUT,spec.name+'.png')));}
    report.edge=[];for(const q of rows){const applicability=await cdp.evalJs('('+edge047.toString()+')('+JSON.stringify(q.id)+')');assert(applicability.smoke===0);for(let rot=0;rot<4;rot++){const spec={name:'edge-'+q.id+'-r'+rot,at:[.5,.5],rot,z:1.5},f=await cdp.evalJs('('+scene047.toString()+')('+JSON.stringify(spec)+',[])');const meta={...spec,...f,...applicability};delete meta.data;Object.assign(meta,write(spec.name+'.png',f.data));report.edge.push(meta);}}
    if(cdp.errors.length)throw Error('scene047 console '+cdp.errors.join('; '));return true;
  });
  assert(r.ok&&r.result,'scene047 native head: '+r.fails.join('; '));
  strict(()=>assert.equal(report.frames.length,57,'scene047 all frozen57 native scenes'));
  strict(()=>assert.equal(report.edge.length,40,'scene047 all frozen40 actual edge cases'));
  strict(()=>assert.equal(report.valve.length,8,'scene047 eight strict BASE-valve pairs'));
  strict(()=>assert.equal(report.negative.length,2,'scene047 real save-dollar and canvas-pixel first-RED controls'));
  const bytes=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'manifest-scenes.json'),bytes);transfer('scenes/manifest-scenes.json',bytes);
  console.log('scene047 retained '+report.frames.length+' native scene frames and '+report.edge.length+' actual edge placements/views; strict failures '+report.failures.length+'.');
  assert.equal(report.failures.length,0,'scene047 strict criteria remain RED: '+report.failures.join('; '));
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

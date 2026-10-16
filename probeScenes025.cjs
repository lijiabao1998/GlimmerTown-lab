'use strict';
// Real native game canvas, only on GitHub Actions. No shared guard is modified.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js'),BASE='98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e',OUT=path.join(ROOT,'shots','wave025','scenes');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),index=path.join(ROOT,'index.html'),head=fs.readFileSync(index),base=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024});
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const opt={port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>0.125',log:console.log};
function transfer(name,bytes){const b64=bytes.toString('base64');console.log('WAVE025_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:bytes.length,sha256:hash(bytes)}));for(let i=0;i<b64.length;i+=4096)console.log('WAVE025_FILE_DATA '+b64.slice(i,i+4096));console.log('WAVE025_FILE_END '+name);}
function write(name,url){const bytes=Buffer.from(url.split(',')[1],'base64');fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,name),bytes);return{file:name,bytes:bytes.length,sha256:hash(bytes)};}
function legacyFixture025(){
  GV.setSpeed(0);GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);
  if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const p={x:7,y:4};if(!GV.place('landmark',p.x,p.y))throw Error('scene025 legacy native fixture');GV.testAge635(p.x,p.y,2,2,30);
  GV.save();const key='glimmerville.v1.s3.sandbox516b',raw=localStorage.getItem(key);if(!raw)throw Error('scene025 slot3 sandbox save absent');
  const states=[JSON.parse(raw)];for(let pass=0;pass<2;pass++){if(!GV.load())throw Error('scene025 old native load');GV.save();states.push(JSON.parse(localStorage.getItem(key)));}
  return{key,raw,states,p};
}
function oldFrames025(valve){
  if(valve)window.__noBritishWave025=true;
  const frames=[];GV.setSpeed(0);tool='pan';hover.x=-1;hover.y=-1;
  for(const mode of['day','night'])for(let rot=0;rot<4;rot++){
    GV.britishWeather004(1,0,0);GV.setRot(rot);GV.art574.zoom574(1.5);GV.lookAt(7.5,4.5);GV.setVisT(GV.art574.cycle574()*(mode==='day'?.5:.02));groundDirty=true;GV.forceDraw();GV.setVisT(GV.art574.cycle574()*(mode==='day'?.5:.02));GV.forceDraw();
    const c=document.getElementById('game');frames.push({name:'legacy-'+mode+'-r'+rot+'.png',w:c.width,h:c.height,data:c.toDataURL('image/png')});
  }
  return frames;
}
function installScene025(rows){
  delete window.__noBritishWave025;GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  for(const q of rows){if(!GV.britishWave025.select(q.id)||!GV.place('landmark',q.x,q.y))throw Error('scene025 native catalog placement '+q.id);GV.testAge635(q.x,q.y,2,2,30);}
  GV.britishWave025.close();tool='pan';hover.x=-1;hover.y=-1;
  return rows.map(q=>({id:q.id,variant:tiles[idx(q.x,q.y)].bld.v}));
}
function scene025(spec,rows){
  GV.setSpeed(0);tool='pan';hover.x=-1;hover.y=-1;
  for(const q of rows)GV.testAge635(q.x,q.y,2,2,spec.age??30);
  GV.britishWeather004(spec.season??1,spec.weather??0,spec.snow??0);GV.setRot(spec.rot??0);GV.art574.zoom574(spec.z??1);GV.lookAt(...(spec.at??[21,4.5]));
  if(spec.hover){hover.x=spec.hover[0];hover.y=spec.hover[1];}
  const t=GV.art574.cycle574()*(spec.night?.02:.5);GV.setVisT(t);groundDirty=true;GV.forceDraw();GV.setVisT(t);GV.forceDraw();
  const c=document.getElementById('game');return{data:c.toDataURL('image/png'),w:c.width,h:c.height,season:GV.season().idx,brightness:GV.daylightDbg().b,age:spec.age??30,rot:spec.rot??0,z:spec.z??1};
}
function edge025(id){
  GV.newWorldSeeded(87);GV.setSpeed(0);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  // Isolated rendering fixture: prepare a 2x2 flat pad exactly at the map corner,
  // then use actual native placement. This is not evidence of natural terrain.
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){const t=tiles[idx(x,y)];Object.assign(t,{t:2,tree:0,zone:0,road:0,rail:0,tram:0,bld:null,ruin:0,crater:0,el:0});}
  if(!GV.britishWave025.select(id)||!GV.place('landmark',0,0))throw Error('scene025 actual native edge placement '+id);GV.testAge635(0,0,2,2,30);
  return{reflect:reflectSprite(tiles[idx(0,0)].bld,0,0)===null,smoke:GV.britishWave025.sprite(0,0).smoke.length};
}
(async()=>{
  const report={head:process.env.GITHUB_SHA,base:BASE,frames:[],notes:['Visual fixtures use fixed Math.random and visT; ordinary native gameplay validation uses the separate native probe.','Edge scene uses an isolated flat pad and actual native placement.'],notApplicable:{waterReflection:'Existing reflectSprite rejects all size>=2 native buildings; unchanged for these 2x2 appearances.',smoke:'All ten native sprites intentionally have smoke:[]; heritage display chimneys are inactive.',neonSigns:'Existing animated neon applies to k=2 commercial buildings, not unchanged k=24 landmark appearances.'}};
  let old;
  try{
    fs.writeFileSync(index,base);
    const r=await withGame(opt,async({cdp})=>{
      const fixture=await cdp.evalJs('('+legacyFixture025.toString()+')()'),frames=await cdp.evalJs('('+oldFrames025.toString()+')(false)');
      if(cdp.errors.length)throw Error(cdp.errors.join('; '));return{fixture,frames};
    });assert(r.ok&&r.result,'scene025 baseline: '+r.fails.join('; '));old=r.result;
  }finally{fs.writeFileSync(index,head);}
  const r=await withGame(opt,async({cdp})=>{
    const fixture=await cdp.evalJs('('+legacyFixture025.toString()+')()');
    assert.deepEqual(canon(fixture.states),canon(old.fixture.states),'scene025 complete old-save behavior matches baseline, every field');
    for(let pass=1;pass<fixture.states.length;pass++)assert.deepEqual(canon(fixture.states[pass]),canon(fixture.states[0]),'scene025 old save roundtrip all fields '+pass);
    report.oldSave={slot:3,sandbox:true,passes:2,allFieldsEqual:true,baseSHA256:hash(Buffer.from(old.fixture.raw))};
    const frames=await cdp.evalJs('('+oldFrames025.toString()+')(true)');
    assert.equal(frames.length,old.frames.length);report.valve=[];
    for(let i=0;i<frames.length;i++){const a=Buffer.from(old.frames[i].data.split(',')[1],'base64'),b=Buffer.from(frames[i].data.split(',')[1],'base64');write('base-'+frames[i].name,old.frames[i].data);write('valve-'+frames[i].name,frames[i].data);assert.deepEqual(b,a,'scene025 base/valve whole native frame '+frames[i].name);report.valve.push({name:frames[i].name,w:frames[i].w,h:frames[i].h,sha256:hash(b),equal:true});}
    const rows=JSON.parse(fs.readFileSync(path.join(ROOT,'shots','wave025','manifest.json'))).placed;
    await cdp.evalJs('('+installScene025.toString()+')('+JSON.stringify(rows)+')');
    const specs=[];for(const [label,season,snow]of[['spring',0,0],['summer',1,0],['autumn',2,0],['winter-bare',3,0],['winter-snow',3,12]])for(const night of[false,true])for(let rot=0;rot<4;rot++)specs.push({name:label+'-'+(night?'night':'day')+'-r'+rot,season,snow,night,rot});
    for(const q of rows)specs.push({name:'near-'+q.id,z:2,at:[q.x+.5,q.y+.5]});
    specs.push({name:'far-day',z:.45},{name:'far-night',z:.45,night:true},{name:'construction-early',age:1},{name:'construction-middle',age:4},{name:'construction-late',age:7},{name:'hover-tattershall',z:2,at:[13.5,4.5],hover:[13,4]},{name:'rain-night',weather:2,snow:12,night:true});
    for(const spec of specs){const f=await cdp.evalJs('('+scene025.toString()+')('+JSON.stringify(spec)+','+JSON.stringify(rows)+')');const meta={...spec,...f};delete meta.data;Object.assign(meta,write(spec.name+'.png',f.data));report.frames.push(meta);if(['summer-day-r0','winter-snow-day-r0','near-tattershall'].includes(spec.name))transfer('scenes/'+spec.name+'.png',fs.readFileSync(path.join(OUT,spec.name+'.png')));}
    report.edge=[];for(const q of rows){const applicability=await cdp.evalJs('('+edge025.toString()+')('+JSON.stringify(q.id)+')');assert(applicability.reflect&&applicability.smoke===0);for(let rot=0;rot<4;rot++){const spec={name:'edge-'+q.id+'-r'+rot,at:[.5,.5],rot,z:1.5},f=await cdp.evalJs('('+scene025.toString()+')('+JSON.stringify(spec)+',[])');const meta={...spec,...f,...applicability};delete meta.data;Object.assign(meta,write(spec.name+'.png',f.data));report.edge.push(meta);}}
    if(cdp.errors.length)throw Error('scene025 console '+cdp.errors.join('; '));return true;
  });
  assert(r.ok&&r.result,'scene025 native head: '+r.fails.join('; '));
  const bytes=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'manifest-scenes.json'),bytes);transfer('scenes/manifest-scenes.json',bytes);
  console.log('scene025 GREEN: every old-save field survives two roundtrips; eight base/valve full frames exact; '+report.frames.length+' native scene frames plus '+report.edge.length+' actual edge placements/views.');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

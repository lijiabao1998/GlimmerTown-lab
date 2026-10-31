'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame}=require('./harness.js'),{setup053}=require('./benchmark053.cjs');
const file=__dirname+'/index.html',original=fs.readFileSync(file,'utf8'),base=cp.execFileSync('git',['show','a20713a509270f8ce6e37859c1fafe330372b952:index.html'],{maxBuffer:32e6,encoding:'utf8'}),out=__dirname+'/shots/regression053';fs.mkdirSync(out,{recursive:true});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function instrument(s){const old='function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}';assert(s.includes(old));s=s.replace(old,old.replace('return function(){','const gen=function(){').replace(/}}$/,'};gen.state053=()=>a;return gen;}'));const marker='window.GV={';assert(s.includes(marker));return s.replace(marker,"window.__state053=()=>({rng:R.state053(),money,pop,jobs,day,cityHappy,fin,history:mayorHistory470,actions:mayorActionCount470,tiles,socialStocks:social505.stocks,capabilityStocks:capability506.stocks,socialCity:social505.city,capabilityCity:capability506.city});\n"+marker);}
async function run(label,s){fs.writeFileSync(file,instrument(s));let records=[];const r=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp})=>{
 await cdp.evalJs('('+setup053.toString()+')('+JSON.stringify({scene:'small',seed:87,ai:true})+')');
 for(let i=0;i<=12;i++){if(i)await cdp.evalJs('GV.step(1)');records.push(await cdp.evalJs('(()=>{GV.setSpeed(0);GV.save();return {state:window.__state053(),save:JSON.parse(localStorage.getItem("glimmerville.v1.s3"))};})()'));}
 const roundtrip=await cdp.evalJs('(()=>{GV.save();const a=JSON.parse(localStorage.getItem("glimmerville.v1.s3"));GV.load();GV.setSpeed(0);GV.save();const b=JSON.parse(localStorage.getItem("glimmerville.v1.s3"));GV.load();GV.setSpeed(0);GV.save();const c=JSON.parse(localStorage.getItem("glimmerville.v1.s3"));return {a,b,c};})()');
 fs.writeFileSync(out+'/'+label+'-roundtrip.json',JSON.stringify(roundtrip));if(cdp.errors.length)throw Error(cdp.errors.join(';'));return roundtrip;
 });fs.writeFileSync(out+'/'+label+'-checkpoints.json',JSON.stringify(records));assert(r.ok,r.fails.join(';'));return{records,roundtrip:r.result};}
async function populatedParity053(){
 const {connectFixture053}=require('./populated-fixture053.cjs');
 const c1=cp.execFileSync('git',['show','89c10c41be14b81e6e00fa39fdd8cbbb284d978b:index.html'],{maxBuffer:32e6,encoding:'utf8'});
 const all=[];
 for(const [label,source] of [['populated-c1',c1],['populated-c2',original]]){
  fs.writeFileSync(file,instrument(source));
  const r=await withGame({port:8199,fresh:true,timeout:600,log:console.log},async({cdp})=>{
   const records=await cdp.evalJs('('+function(setup,connect){
    setup({scene:'medium',seed:87,ai:true});connect();GV.step(20);GV.setSpeed(0);
    const checkpoints=[];for(let i=0;i<=5;i++){if(i)GV.step(1);GV.setSpeed(0);GV.save();checkpoints.push({state:window.__state053(),save:JSON.parse(localStorage.getItem('glimmerville.v1.s3'))});}
    if(!(checkpoints[0].state.pop>0))throw Error('C2 requires native populated parity');return checkpoints;
   }.toString()+')('+setup053.toString()+','+connectFixture053.toString()+')');
   assert.equal(cdp.errors.length,0);return records;
  });fs.writeFileSync(out+'/'+label+'-checkpoints.json',JSON.stringify({ok:r.ok,fails:r.fails,records:r.result??null}));assert.ok(r.ok,r.fails.join(';'));all.push(r.result);
 }
 assert.deepEqual(all[1],all[0],'C2 populated native state/RNG/finance/events/tiles/save mismatch');
 fs.writeFileSync(out+'/populated-c2-parity.json',JSON.stringify({ok:true,checkpoints:6,startPopulation:all[0][0].state.pop,baseline:'89c10c41be14b81e6e00fa39fdd8cbbb284d978b',candidateHash:hash(original),note:'All six native checkpoints in one JS task, no visual-frame interleaving. All original regression assertions remain.'},null,2));
}

// C3 is additive: retain the historical 13 checkpoints, roundtrip, and C1/C2 six checkpoints above.
function instrumentC3053(source){
 const marker='window.GV={';
 const observer=`
 let mobilityScanCount053=0;
 const mobilityScanObserved053=mobilityBlocks491;
 mobilityBlocks491=function(...args){mobilityScanCount053++;return mobilityScanObserved053.apply(this,args);};
 window.__c3Observe053=()=>({
  scans:mobilityScanCount053,dirty:amDirty502,version:amVersion502,
  walk:Array.from(WALK_COST502),bike:Array.from(BIKE_COST502),cells:amCells502.slice(),
  stationCache:Array.from(amStationCache502,([k,v])=>[k,Array.from(v)]),
  blockCache:Array.from(amBlockCache502,([k,v])=>[k,Array.from(v)])
 });
 // Test drivers invoke native entry points only, never fabricate population, stock or cache contents.
 window.__c3Native053=(kind,dirty)=>{
  if(dirty)activeMobilityMarkDirty502();
  const before=window.__c3Observe053();
  let authority=null;
  if(kind==='capability')capabilityStep506(true);
  else authority=authoritySnapshot506(kind==='authority-true');
  const after=window.__c3Observe053();
  GV.setSpeed(0);GV.save();
  return JSON.parse(JSON.stringify({kind,dirty,before,after,authority,state:window.__state053(),save:JSON.parse(localStorage.getItem('glimmerville.v1.s3'))}));
 };
 `;
 return instrument(source).replace(marker,observer+marker);
}
async function c3NativeParity053(){
 const {connectFixture053}=require('./populated-fixture053.cjs');
 const baseline='07955fad574e31ccf34c3e6904247c8998b8cde2';
 const c2=cp.execFileSync('git',['show',baseline+':index.html'],{maxBuffer:32e6,encoding:'utf8'}),arms=[];
 for(const [label,source,escape] of [['c3-baseline-c2',c2,false],['c3-candidate',original,false],['c3-escape',original,true]]){
  fs.writeFileSync(file,instrumentC3053(source));
  const r=await withGame({port:8199,fresh:true,timeout:600,log:console.log},async({cdp})=>{
   const result=await cdp.evalJs('('+function(setup,connect,escape){
    window.__noMobilityBlockReuse053=escape;
    setup({scene:'medium',seed:87,ai:true});connect();GV.step(20);GV.setSpeed(0);
    const checkpoints=[];
    for(let i=0;i<=5;i++){
     if(i)GV.step(1);GV.setSpeed(0);GV.save();
     checkpoints.push(JSON.parse(JSON.stringify({state:window.__state053(),save:JSON.parse(localStorage.getItem('glimmerville.v1.s3'))})));
    }
    if(!(checkpoints[0].state.pop>0))throw Error('C3 requires native populated parity');
    const diagnostics=[];
    for(const [kind,dirty] of [['authority-false',false],['authority-true',false],['authority-false',true],['capability',true],['capability',false]])diagnostics.push(window.__c3Native053(kind,dirty));
    return {checkpoints,diagnostics};
   }.toString()+')('+setup053.toString()+','+connectFixture053.toString()+','+JSON.stringify(escape)+')');
   assert.equal(cdp.errors.length,0);return result;
  });
  fs.writeFileSync(out+'/'+label+'.json',JSON.stringify({ok:r.ok,fails:r.fails,result:r.result??null}));
  assert.ok(r.ok,r.fails.join(';'));arms.push(r.result);
 }
 const comparable=x=>{const copy=JSON.parse(JSON.stringify(x));for(const row of copy.diagnostics){delete row.before.scans;delete row.after.scans;}return copy;};
 for(let i=1;i<arms.length;i++)assert.deepEqual(comparable(arms[i]),comparable(arms[0]),'C3 '+(i===1?'reuse':'escape')+' exact native populated/authority/AM state mismatch');
 const counts=[];
 for(let j=0;j<arms[0].diagnostics.length;j++){
  const rows=arms.map(a=>a.diagnostics[j]),n=rows.map(r=>r.after.scans-r.before.scans),cap=rows[0].kind==='capability';
  assert.equal(n[2],n[0],'C3 escape must retain all baseline scans');
  assert.equal(n[1],n[0]-(cap?1:0),'C3 must remove exactly one scan only in forced capability');
  if(rows[0].dirty)for(const row of rows){assert.equal(row.before.dirty,true);assert.equal(row.after.dirty,false,'native dirty AM must rebuild');}
  if(rows[0].kind==='authority-false')assert.equal(n[0],1,'standalone authority(false) must retain its scan');
  counts.push({kind:rows[0].kind,dirty:rows[0].dirty,baseline:n[0],candidate:n[1],escape:n[2]});
 }
 fs.writeFileSync(out+'/c3-native-parity.json',JSON.stringify({ok:true,baseline,candidateHash:hash(original),checkpoints:6,startPopulation:arms[0].checkpoints[0].state.pop,counts,note:'Atomic native task per arm; exact state/save/AM arrays and cache contents; existing native dirty invalidator only; timing excluded.'},null,2));
}

(async()=>{if(!process.env.GITHUB_ACTIONS)throw Error('Native regression is GitHub Actions only');try{cp.execFileSync(process.execPath,['--test','placement-reuse053-projection.test.cjs'],{cwd:__dirname,stdio:'inherit'});const a=await run('baseline',base),b=await run('candidate',original);assert.deepEqual(b.records,a.records,'native state/RNG/finance/events/tiles/save mismatch');assert.deepEqual(b.roundtrip,a.roundtrip,'native roundtrip differs from baseline');await populatedParity053();await c3NativeParity053();const normalization=Object.keys(a.roundtrip.a).filter(k=>JSON.stringify(a.roundtrip.a[k])!==JSON.stringify(a.roundtrip.b[k]));fs.writeFileSync(out+'/receipt.json',JSON.stringify({ok:true,checkpoints:13,baseSha256:hash(base),candidateSha256:hash(original),instrumentation:'RNG getter only; original RNG arithmetic unchanged; read-only closure snapshot; excluded from performance timing',baselineRoundtripChangedFields:normalization,fullRoundtripUnchanged:normalization.length===0},null,2));}finally{fs.writeFileSync(file,original);}})().catch(e=>{fs.writeFileSync(out+'/first-failure.json',JSON.stringify({error:e.stack},null,2));console.error(e);process.exitCode=1;});

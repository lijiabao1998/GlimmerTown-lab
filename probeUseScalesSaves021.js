#!/usr/bin/env node
'use strict';
// Full native save equivalence, using both the immutable main page and the
// rebuilt page. The read-only oracle compares every supplied native field.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {guardOutput022,baselineHTML022}=require('./use-scales-guard-paths022');
const {makeHarness}=require('./use-scales-test-harness021');
const OUT=guardOutput022(),ATTEMPT=process.env.USE021_SAVE_ATTEMPT||'01';
const REUSE=process.argv.includes('--reuse-cold');
const O=require(path.join(OUT,'paired-save-oracle021.js'));
const oracle=fs.readFileSync(path.join(OUT,'paired-save-oracle021.js'),'utf8');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const inputs={old:fs.readFileSync(path.join(OUT,'legal-background021.json'),'utf8'),new:fs.readFileSync(path.join(OUT,'native-city-mature36-021.json'),'utf8')};
const baseline=baselineHTML022();
const report={kind:'Cold and read-save-read pairs against immutable main54ec, whole native saves and all15 stats',oracleSHA256:sha(oracle),mainSHA256:sha(baseline),inputs:Object.fromEntries(Object.entries(inputs).map(([k,v])=>[k,sha(v)])),checks:[],sessions:[],pairs:[],ok:false};
const checkpointFile=path.join(OUT,'save-checkpoints-attempt-'+ATTEMPT+'.json');const checkpoints={};
if(REUSE){const old=fs.readFileSync(path.join(OUT,'save-checkpoints-attempt-01.json'));Object.assign(checkpoints,JSON.parse(old));report.reusedCold={file:'save-checkpoints-attempt-01.json',sha256:sha(old),reason:'Twelve successful native cold load/save checkpoints retained; only nonempty native vehicle preparation failed. Production index unchanged.'};const previous=JSON.parse(fs.readFileSync(path.join(OUT,'save-acceptance-attempt-01.json')));report.sessions.push(...previous.sessions.filter(q=>q.arm==='main54ec'));}
function flush(){fs.writeFileSync(path.join(OUT,'save-acceptance-attempt-'+ATTEMPT+'.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(checkpointFile,JSON.stringify(checkpoints,null,2)+'\n');}
function add(name,ok,data){report.checks.push({name,ok:!!ok,data});if(!ok)throw Error(name);}
function installSaveProof(){
 const N=N021,G=GV,P=PairedSaveOracle021;N.running(false);G.setSpeed(0);G.ai(false);
 const capture=kind=>{G.save();const raw=localStorage.getItem('glimmerville.v1.s3'),stats=G.stats();return{raw,stats,phase:{kind,day:stats.day,bootDone:!!window.__bootDone453,migrationComplete:true,running:N.running()},vehicles:{police:G.policeCars(),fire:G.ladderTrucks()},control:N.controls(),state:N.state()};};
 const protectedSnapshot=()=>Object.fromEntries(P.PROTECTED_KEYS.map(k=>[k,localStorage.getItem(k)]));
 window.S021={capture,protectedSnapshot};return{protected:protectedSnapshot(),selector:localStorage.getItem('glimmerville.v1.slot'),state:N.state(),control:N.controls()};
}
async function runArm(name,html){
 const H=makeHarness(html);const seedProtected=O.PROTECTED_KEYS.map((k,i)=>'localStorage.setItem('+JSON.stringify(k)+','+JSON.stringify(JSON.stringify({...JSON.parse(inputs.old),nm:'Protected synthetic slot '+i}))+');').join('');
 const pre='window.__useScaleQA021=true;localStorage.setItem("glimmerville.v1.slot","3");localStorage.setItem("glimmerville.v1.s3",'+JSON.stringify(inputs.old)+');'+seedProtected+
 'window.__protectedWriteAttempts021=[];const set021=Storage.prototype.setItem,rm021=Storage.prototype.removeItem;const pk021='+JSON.stringify(O.PROTECTED_KEYS)+';Storage.prototype.setItem=function(k,v){if(pk021.includes(k))window.__protectedWriteAttempts021.push({method:"set",key:k});return set021.call(this,k,v)};Storage.prototype.removeItem=function(k){if(pk021.includes(k))window.__protectedWriteAttempts021.push({method:"remove",key:k});return rm021.call(this,k)};';
 try{
 const sess=await H.withGame({fresh:false,timeout:300,preScript:pre,log:console.log},async({cdp})=>{
 await cdp.evalJs(oracle);const initial=await cdp.evalJs('('+installSaveProof.toString()+')()');checkpoints[name]={...checkpoints[name],source:H.proof,initial,cycles:checkpoints[name]?.cycles||{}};
 for(const[k,input]of Object.entries(inputs)){
  if(REUSE)continue;
  let current=input;const chain=[];
  for(let cycle=0;cycle<3;cycle++){
   const result=await cdp.evalJs(`(()=>{N021.running(false);GV.setSpeed(0);localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(current)});const loaded=GV.load();N021.running(false);GV.setSpeed(0);return{loaded,checkpoint:S021.capture(${JSON.stringify(k+'-read-save-'+cycle)})};})()`);
   add(name+' '+k+' native load '+cycle,result.loaded===true);chain.push(result.checkpoint);current=result.checkpoint.raw;
  }checkpoints[name].cycles[k]=chain;flush();console.log(JSON.stringify({phase:'save chain',arm:name,kind:k,cycles:chain.length}));
 }
 // Pair actual native advancement in the original renderer and the enabled
 // candidate, from the same full save and identical explicit frame inputs.
 // No escape valve or simulation override is used for these future steps.
 checkpoints[name].simulation=await cdp.evalJs(`(()=>{N021.running(false);GV.setSpeed(0);localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(inputs.new)});const loaded=GV.load();N021.running(false);GV.setSpeed(0);GV.ai(false);GV.setRot(0);GV.lookAt(24,23);GV.setZoom(.55);GV.setVisT(55);N021.visualClock(0);const before=N021.state(),matchedInputPhase=N021.simulationClock(0),initialCheckpoint=S021.capture('same-seed-native-initial');const originalRandom=Math.random,randomInputSeed=210022;let randomState=randomInputSeed,randomCalls=0;Math.random=()=>{randomCalls++;let t=randomState+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};try{GV.setSpeed(1);GV.advanceN(.05,360);GV.setSpeed(0);const prepared=N021.state(),rows=[];for(let i=0;i<6;i++){GV.setSpeed(1);GV.advanceN(.05,18);GV.setSpeed(0);N021.frame(.016);rows.push(S021.capture('same-seed-native-step-'+i));}return{loaded,before,matchedInputPhase,initialCheckpoint,prepared,rows,randomInput:{seed:randomInputSeed,calls:randomCalls,kind:"Uniform seeded Math.random input; native R RNG untouched; all models, actors and hazards enabled"},control:N021.controls(),disasters:GV.disasters()};}finally{Math.random=originalRandom;}})()`);
 add(name+' same-seed native input and ordinary controls',checkpoints[name].simulation.loaded&&!checkpoints[name].simulation.control.god&&!checkpoints[name].simulation.control.sandbox&&!Object.values(checkpoints[name].simulation.control.overrides).some(v=>v===true),checkpoints[name].simulation.control);flush();
 if(name==='rebuilt'){
  report.vehiclePair=await cdp.evalJs(`(()=>{N021.running(false);GV.setSpeed(0);localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(inputs.new)});GV.load();N021.running(false);const before=N021.state();GV.setSpeed(1);GV.advanceN(.05,360);GV.setSpeed(0);const prepared=N021.state(),first=S021.capture('same-live-native-world');window.__noUseScalesRelease021=false;N021.frame(.016);const on=S021.capture('same-live-native-world');window.__noUseScalesRelease021=true;N021.frame(.016);const off=S021.capture('same-live-native-world');window.__noUseScalesRelease021=false;return{preparation:{before,prepared,ordinaryNativeAdvance:true},first,on,off,compare:PairedSaveOracle021.compareCheckpointPair(on,off)};})()`);checkpoints.vehiclePair=report.vehiclePair;add('same native world all15 stats including nonempty cars exactly equal',report.vehiclePair.compare.ok,report.vehiclePair.compare);flush();
  report.malformed=[];
  for(const c of O.malformedMetadataCases(inputs.new)){
   const q=await cdp.evalJs(`(()=>{localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(c.raw)});const loaded=GV.load();N021.running(false);GV.setSpeed(0);return{loaded,accepted:GV.useScales021.profileSave()||[],checkpoint:S021.capture('malformed-'+${JSON.stringify(c.name)})};})()`);
   const baseRaw=JSON.parse(c.raw);delete baseRaw.art021;const reference=await cdp.evalJs(`(()=>{localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(JSON.stringify(baseRaw))});const loaded=GV.load();N021.running(false);GV.setSpeed(0);return{loaded,checkpoint:S021.capture('malformed-'+${JSON.stringify(c.name)})};})()`);
   const compare=O.compareCheckpointPair(q.checkpoint,reference.checkpoint,{requireNonemptyVehicles:false,requireArtMetadata:false});add('malformed native metadata '+c.name,q.loaded&&reference.loaded&&q.accepted.length===0&&compare.ok,compare);report.malformed.push({name:c.name,checkpoint:q,reference,compare});flush();
  }
 }
 const end=await cdp.evalJs('({protected:S021.protectedSnapshot(),selector:localStorage.getItem("glimmerville.v1.slot"),attempts:window.__protectedWriteAttempts021,state:N021.state()})');
 const storage=O.compareProtectedStorage(initial.protected,end.protected,{disposableProfile:true,selectorBefore:initial.selector,selectorAfter:end.selector,protectedWriteAttempts:end.attempts});add(name+' nonempty slots1/2 and backups byte-preserved with zero write attempts',storage.ok,storage);checkpoints[name].storage=storage;
 return{errors:cdp.errors,benign:cdp.benign};
 });report.sessions.push({arm:name,source:H.proof,ok:sess.ok,fails:sess.fails,seconds:sess.seconds,result:sess.result});add(name+' native browser clean',sess.ok&&!sess.result?.errors.length,sess.fails);flush();
 }finally{await H.cleanup();}
}
(async()=>{try{
 add('immutable main pinned',report.mainSHA256==='7e4f63e8921d9dd2d56133c3bf07998316ee27b154ca45411a9b61134b336067');
 if(!REUSE){await runArm('main54ec',baseline);await runArm('main-calibration',baseline);}await runArm('rebuilt');
 for(const kind of['old','new'])for(let i=0;i<3;i++){
  const on=checkpoints.rebuilt.cycles[kind][i],off=checkpoints.main54ec.cycles[kind][i];const cmp=O.compareCheckpointPair(on,off,{requireNonemptyVehicles:false,requireArtMetadata:false});report.pairs.push({kind,cycle:i,compare:cmp});add('whole native main/rebuilt '+kind+' cycle'+i,cmp.ok,cmp);
 }
 const initialPair=O.compareCheckpointPair(checkpoints.rebuilt.simulation.initialCheckpoint,checkpoints.main54ec.simulation.initialCheckpoint,{requireArtMetadata:false,requireNonemptyVehicles:false});
 report.initialSameSeedPair=initialPair;add('same-seed fully recounted initial native checkpoint',initialPair.ok,initialPair);
 report.immutableMainCalibration=[];
 for(let i=0;i<6;i++){
  const left=checkpoints['main-calibration'].simulation.rows[i],right=checkpoints.main54ec.simulation.rows[i],cmp=O.compareCheckpointPair(left,right,{requireArtMetadata:false});
  report.immutableMainCalibration.push({step:i,left,right,compare:cmp});add('immutable-main/main independent protocol calibration step'+i,cmp.ok,cmp);
 }
 report.sameSeedNativePairs=[];
 for(let i=0;i<6;i++){
  const on=checkpoints.rebuilt.simulation.rows[i],off=checkpoints.main54ec.simulation.rows[i],cmp=O.compareCheckpointPair(on,off,{requireArtMetadata:false});
  report.sameSeedNativePairs.push({step:i,on,off,compare:cmp});add('same-seed native advancement all fields/all15 stats/nonempty cars step'+i,cmp.ok,cmp);
 }
 const actual=checkpoints.rebuilt.cycles.new[0],changed=JSON.parse(JSON.stringify(actual));const d=JSON.parse(changed.raw);d.bl[0][3]=(d.bl[0][3]||0)+1;changed.raw=JSON.stringify(d);const bad=O.compareCheckpointPair(actual,changed,{requireNonemptyVehicles:false});add('intentional BL variant fault first-red at native BL',!bad.ok&&bad.firstFailure?.category==='BL',bad.firstFailure);report.intentionalFault=bad;
 report.ok=report.checks.every(q=>q.ok);
}catch(e){report.error=e.stack;report.ok=false;}finally{flush();console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,error:report.error}));if(!report.ok)process.exitCode=1;}})();

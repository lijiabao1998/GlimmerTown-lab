'use strict';
// Additive equal-simulation-work diagnostic. Not a frame/jank replacement or acceptance test.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const BASELINE053='facbc9b4d2d4b39be35680141212c68d9e59f0c6';
const PLAN053=Object.freeze({scene:'medium',seed:87,warmupDays:120,measuredDays:60});
const hash053=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
function compareFixedWork053(reference,result){assert.deepEqual(result.before,reference.before,'fixed-work exact initial state/save');assert.deepEqual(result.after,reference.after,'fixed-work exact final state/save');assert.equal(result.actualDays,PLAN053.measuredDays,'fixed-work complete native days');assert.ok(Number.isFinite(result.elapsedMs)&&result.elapsedMs>0,'fixed-work real positive elapsed time');}
function driver053(setup,connect,plan){
 setup({scene:plan.scene,seed:plan.seed,ai:true});connect();
 function stepDays053(days){for(let left=days;left>0;left-=Math.min(60,left))GV.step(Math.min(60,left));}
 const warmupStartDay=window.__state053().day;stepDays053(plan.warmupDays);GV.setSpeed(0);
 if(window.__state053().day-warmupStartDay!==plan.warmupDays)throw Error('fixed-work wrong actual warmup day count');
 const snapshot=()=>{GV.setSpeed(0);GV.save();return JSON.parse(JSON.stringify({state:window.__state053(),save:JSON.parse(localStorage.getItem('glimmerville.v1.s3'))}));};
 const before=snapshot();if(!(before.state.pop>0))throw Error('fixed-work requires native population');
 // No yielding between setup, start snapshot, complete work and final snapshot.
 // Profiler sample attribution selects this exact function subtree; setup/save are outside it.
 function fixedWorkMeasured053(days){const start=performance.now();stepDays053(days);return performance.now()-start;}
 const elapsedMs=fixedWorkMeasured053(plan.measuredDays),after=snapshot(),actualDays=after.state.day-before.state.day;
 if(actualDays!==plan.measuredDays)throw Error('fixed-work wrong actual native day count');
 return {before,after,actualDays,elapsedMs,plan};
}
function summarizeFixedProfile053(profile){
 assert.ok(Array.isArray(profile.samples)&&Array.isArray(profile.timeDeltas));assert.equal(profile.samples.length,profile.timeDeltas.length,'profile sample/delta length');
 const nodes=new Map(profile.nodes.map(n=>[n.id,n])),parents=new Map();for(const n of profile.nodes)for(const child of n.children||[])parents.set(child,n.id);
 const beneath=id=>{const seen=new Set();while(nodes.has(id)&&!seen.has(id)){seen.add(id);if(nodes.get(id).callFrame.functionName==='fixedWorkMeasured053')return true;id=parents.get(id);}return false;};
 let selectedSamples=0,selectedDeltaUs=0,invalidDeltas=0,unattributedGcSamples=0;const self={};
 for(let i=0;i<profile.samples.length;i++){const dt=profile.timeDeltas[i];if(!Number.isFinite(dt)||dt<0)invalidDeltas++;if(!beneath(profile.samples[i])){if(/garbage collector/i.test(nodes.get(profile.samples[i])?.callFrame.functionName||''))unattributedGcSamples++;continue;}selectedSamples++;if(Number.isFinite(dt)&&dt>=0)selectedDeltaUs+=dt;const name=nodes.get(profile.samples[i])?.callFrame.functionName||'(anonymous)';self[name]=(self[name]||0)+1;}
 assert.ok(selectedSamples>0,'profile must observe fixedWorkMeasured053 subtree');
 return {totalSamples:profile.samples.length,selectedSamples,excludedSamples:profile.samples.length-selectedSamples,unattributedGcSamples,invalidDeltas,selectedSampleDeltaMs:invalidDeltas?null:selectedDeltaUs/1000,topSelfSamples:Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,30),note:'Sampled deltas beneath named work function, not OS CPU time; profile contains setup outside selected subtree; profiler-on elapsed is separate from unprofiled ABBA.'};
}
async function runFixedWork053({candidate,instrument}){
 if(!process.env.GITHUB_ACTIONS)throw Error('Native fixed-work diagnostic is GitHub Actions only');
 const {withGame,findChrome}=require('./harness.js'),{setup053}=require('./benchmark053.cjs'),{connectFixture053}=require('./populated-fixture053.cjs'),os=require('node:os');
 const file=path.join(__dirname,'index.html'),out=path.join(__dirname,'shots/regression053/fixed-work053');fs.mkdirSync(out,{recursive:true});
 const base=cp.execFileSync('git',['show',BASELINE053+':index.html'],{cwd:__dirname,maxBuffer:32e6,encoding:'utf8'}),rows=[];let reference;
 const write=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2));
 write('identity.json',{head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),baseline:BASELINE053,baselineProductHash:hash053(base),candidateProductHash:hash053(candidate),plan:PLAN053,order:['baseline','candidate','candidate','baseline'],profileOrder:['baseline','candidate'],node:process.version,cpu:os.cpus()[0]?.model,browser:findChrome(),run:process.env.GITHUB_RUN_ID,note:'Independent synchronous fixed native simulation work; no frame rendering/pacing acceptance; all previous wall-window ABBA and guards unchanged.'});
 try{
  for(const [index,label,profiled]of [[0,'baseline',false],[1,'candidate',false],[2,'candidate',false],[3,'baseline',false],[4,'baseline',true],[5,'candidate',true]]){
   const prefix=index+'-'+label+(profiled?'-profiled':'');fs.writeFileSync(file,instrument(label==='baseline'?base:candidate));
   const r=await withGame({port:8199,fresh:true,timeout:600,log:console.log},async({cdp})=>{
    if(profiled){await cdp.send('Profiler.enable');await cdp.send('Profiler.start');}
    const result=await cdp.evalJs('('+driver053.toString()+')('+setup053.toString()+','+connectFixture053.toString()+','+JSON.stringify(PLAN053)+')');
    write(prefix+'-result.json',result);
    if(profiled){const {profile}=await cdp.send('Profiler.stop');write(prefix+'-cpu-profile.json',profile);write(prefix+'-profile-summary.json',summarizeFixedProfile053(profile));await cdp.send('Profiler.disable');}
    assert.equal(cdp.errors.length,0);return result;
   });write(prefix+'-receipt.json',{ok:r.ok,fails:r.fails});assert.ok(r.ok,r.fails.join(';'));
   if(!reference)reference=r.result;compareFixedWork053(reference,r.result);
   rows.push({index,label,profiled,elapsedMs:r.result.elapsedMs,actualDays:r.result.actualDays,beforeHash:hash053(r.result.before),afterHash:hash053(r.result.after),startDay:r.result.before.state.day,endDay:r.result.after.state.day,startPopulation:r.result.before.state.pop,endPopulation:r.result.after.state.pop});
   write('progress.json',{rows});
  }
  const avg=label=>{const a=rows.filter(r=>r.label===label&&!r.profiled);return a.reduce((s,r)=>s+r.elapsedMs,0)/a.length;};
  const result={ok:true,plan:PLAN053,rows,unprofiledMeanElapsedReduction:1-avg('candidate')/avg('baseline'),note:'Only two unprofiled windows per arm at exact equal state/work. Not a frame/jank acceptance substitute; profiler-on runs excluded from elapsed comparison.'};write('summary.json',result);return result;
 }catch(e){write('first-failure.json',{error:e.stack,rows});throw e;}finally{fs.writeFileSync(file,candidate);}
}
module.exports={runFixedWork053,compareFixedWork053,summarizeFixedProfile053,driver053,PLAN053};

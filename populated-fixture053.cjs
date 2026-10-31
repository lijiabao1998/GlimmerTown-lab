'use strict';
// Native fixture feasibility probe. Never sets population, bld objects or simulation fields.
const fs=require('node:fs'),path=require('node:path');const {withGame}=require('./harness.js'),{setup053}=require('./benchmark053.cjs');
function connectFixture053(){
 const G=GV,n=G.N(),placed=[],failed={};G.setSpeed(0);G.ai(false);
 function put(tool,x,y){const e=G.canPlaceTool(tool,x,y);if(e){failed[e]=(failed[e]||0)+1;return false;}const ok=G.place(tool,x,y);if(ok)placed.push({tool,x,y});return ok;}
 // Preserve normal native placement rules; connect each existing residential street.
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(G.tile(x,y)?.road){put('lvline',x,y);put('wpipe',x,y);}
 for(let row=5;row<n-5;row+=4){let power=false,water=false;for(let x=4;x<n-4&&(!power||!water);x++){const y=row-1,t=G.tile(x,row);if(!t?.road)continue;if(!power){power=put('geo',x,y);if(power)continue;}if(!water)water=put('water',x,y);}}
 G.ai(true);G.setSpeed(0);return{placed,failed};
}
async function probe(){if(!process.env.GITHUB_ACTIONS)throw Error('Native fixture probe is GitHub Actions only');const out=path.resolve('shots/populated053');fs.mkdirSync(out,{recursive:true});const r=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp})=>{const fixture=await cdp.evalJs('('+setup053.toString()+')('+JSON.stringify({scene:'small',seed:87,ai:true})+')');const connections=await cdp.evalJs('('+connectFixture053.toString()+')()'),history=[];for(let i=0;i<6;i++){history.push(await cdp.evalJs('(()=>{GV.step(20);GV.setSpeed(0);return GV.stats();})()'));if(history.at(-1).pop>0)break;}fs.writeFileSync(out+'/fixture.json',JSON.stringify({fixture,connections,history},null,2));const png=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(out+'/fixture.png',Buffer.from(png.data,'base64'));if(history.at(-1).pop<=0)throw Error('Native fixture failed population gate; not mature-city evidence');return{population:history.at(-1).pop,day:history.at(-1).day};});fs.writeFileSync(out+'/receipt.json',JSON.stringify(r,(k,v)=>k==='cdp'?undefined:v,2));if(!r.ok)throw Error(r.fails.join(';'));console.log('POPULATED FIXTURE',JSON.stringify(r.result));}
if(require.main===module)(process.argv.includes('--paired')?paired():probe()).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={connectFixture053};

async function paired(){
 const cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
 const {snapshot053,begin053,end053}=require('./benchmark053.cjs'),{summarizeRun}=require('./performance-metrics053.cjs'),{sleep,findChrome}=require('./harness.js');
 if(!process.env.GITHUB_ACTIONS)throw Error('Native paired populated test is GitHub Actions only');
 const scene=process.argv.find(x=>x.startsWith('--scene='))?.slice(8)||'small';assert.ok(['small','medium','large'].includes(scene));
 const out=path.resolve('shots/populated-paired053/'+scene),file=path.join(__dirname,'index.html'),candidate=fs.readFileSync(file),base=cp.execFileSync('git',['show','a20713a509270f8ce6e37859c1fafe330372b952:index.html'],{maxBuffer:32e6});fs.mkdirSync(out,{recursive:true});
 const write=(name,x)=>fs.writeFileSync(path.join(out,name),JSON.stringify(x,null,2)),rows=[];let expectedStart;
 write('identity.json',{head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),base:'a20713a509270f8ce6e37859c1fafe330372b952',scene,seed:87,seconds:90,speed:5,ai:true,runId:process.env.GITHUB_RUN_ID,node:process.version,cpu:os.cpus()[0]?.model,cpuCount:os.cpus().length,memory:os.totalmem(),browser:findChrome(),note:'Native Chromium Ubuntu; not physical mobile; 2 independent windows per arm; controlled newly populated fixture, not mature city.'});
 try{for(const [i,label]of ['baseline','candidate','candidate','baseline'].entries()){
  fs.writeFileSync(file,label==='baseline'?base:candidate);const prefix=i+'-'+label;
  const r=await withGame({port:8199,fresh:true,timeout:600,log:console.log},async({cdp})=>{
   await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
   write(prefix+'-browser.json',await cdp.send('Browser.getVersion'));
   // Warm the browser before creating the population. Paused rendering still spawns
   // random cars: never yield between native maturation, exact-start gate and timing.
   await sleep(3000);
   const memoryBefore=await cdp.send('Runtime.getHeapUsage');
   const start=await cdp.evalJs('('+atomicStart053.toString()+')('+[
    setup053.toString(),connectFixture053.toString(),snapshot053.toString(),`function(c){const start=(${begin053.toString()})(c),b=window.__benchmarkCapture053;b.frameTimestamps=[];function observe(t){if(!b.active)return;b.frameTimestamps.push({raf:t,observed:performance.now()});requestAnimationFrame(observe);}requestAnimationFrame(observe);return start;}`,
    JSON.stringify({scene,seed:87,ai:true,speed:5}),JSON.stringify(expectedStart??null)
   ].join(',')+')');
   const {fixture,connections,before}=start;write(prefix+'-before.json',{fixture,connections,before});
   assert.ok(before.stats.pop>0,'must have native population before timing');assert.equal(before.diff,1);assert.ok(!before.developer?.sandbox&&!before.developer?.god);
   const stableStart=JSON.stringify({stats:before.stats,exactMoney:before.exactMoney,roots:before.roots,connections});
   if(expectedStart===undefined)expectedStart=stableStart;else assert.equal(stableStart,expectedStart,'all ABBA arms require identical native starting state');
   await sleep(90000);
   const raw=await cdp.evalJs('(()=>{const r=('+end053.toString()+')();r.frameTimestamps=window.__benchmarkCapture053.frameTimestamps;return r;})()'),memoryAfter=await cdp.send('Runtime.getHeapUsage'),after=await cdp.evalJs('('+snapshot053.toString()+')()');
   write(prefix+'-frames.json',raw);write(prefix+'-after.json',after);write(prefix+'-memory.json',{before:memoryBefore,after:memoryAfter,note:'Live V8 heap only, not forced GC/process/GPU memory'});write(prefix+'-console.json',{errors:cdp.errors,benign:cdp.benign});
   const png=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,prefix+'.png'),Buffer.from(png.data,'base64'));
   const days=after.stats.day-before.stats.day,metrics=summarizeRun({frameMs:raw.frameMs,elapsedMs:raw.elapsedMs,days,placements:null,longTasks:raw.longTasks});
   assert.ok(raw.frameMs.length>=30&&days>0,'unchanged >=30 native frames and positive simulated days gate');assert.equal(cdp.errors.length,0,'native console errors');
   // Separate continued-world CPU diagnostic; never mix profiler overhead into ABBA metrics.
   if(i===1){
    const profileBefore=await cdp.evalJs('('+snapshot053.toString()+')()');
    await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
    await cdp.evalJs('GV.setSpeed(5)');await sleep(15000);await cdp.evalJs('GV.setSpeed(0)');
    const profile=await cdp.send('Profiler.stop');
    write(prefix+'-cpu-profile.json',profile);
    write(prefix+'-profile-window.json',{before:profileBefore,after:await cdp.evalJs('('+snapshot053.toString()+')()'),requestedSeconds:15,note:'Separate continued populated-world diagnostic after main timing. Sample counts only if timeDeltas invalid; not matched CPU-ms proof.'});
    await cdp.send('Profiler.disable');
   }
   return{label,indexSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),metrics,startStateSha256:crypto.createHash('sha256').update(stableStart).digest('hex'),populationBefore:before.stats.pop,populationAfter:after.stats.pop,rootsBefore:before.roots.length,rootsAfter:after.roots.length,daysPerSecond:days*1000/raw.elapsedMs,elapsedMs:raw.elapsedMs};
  });write(prefix+'-receipt.json',{ok:r.ok,fails:r.fails,seconds:r.seconds,result:r.result});assert.ok(r.ok,r.fails.join(';'));rows.push(r.result);
 }
 const a=rows.filter(x=>x.label==='baseline'),b=rows.filter(x=>x.label==='candidate'),mean=(r,f)=>r.reduce((s,x)=>s+f(x),0)/r.length;
 const result={scene,rows,meanP95Reduction:1-mean(b,x=>x.metrics.frames.p95Ms)/mean(a,x=>x.metrics.frames.p95Ms),meanBlockingReduction:1-mean(b,x=>x.metrics.longTasks.totalBlockingMs)/mean(a,x=>x.metrics.longTasks.totalBlockingMs),acceptancePassed:false,note:'Populated native ABBA only; full speed/AI matrix, mature city and Town comparison pending. No acceptance from a single pair of windows.'};write('summary.json',result);console.log('POPULATED ABBA',JSON.stringify(result));
 }catch(e){write('first-failure.json',{error:e.stack,rows});throw e;}finally{fs.writeFileSync(file,candidate);}
}

// The exact same native construction and 20-day evolution; no synthetic state/reset,
 // RNG replacement, frame suppression, or omission of the cars field from equality.
function atomicStart053(setup,connect,snapshot,begin,config,expected){
 const fixture=setup(config),connections=connect();GV.step(20);GV.setSpeed(0);
 const before=snapshot();
 const stable=JSON.stringify({stats:before.stats,exactMoney:before.exactMoney,roots:before.roots,connections});
 if(!(before.stats.pop>0)||before.diff!==1||before.developer?.sandbox||before.developer?.god)throw Error('native population/difficulty gate');
 if(expected!==null&&stable!==expected)throw Error('all ABBA arms require identical native starting state');
 begin(config);return{fixture,connections,before};
}

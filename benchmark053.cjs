'use strict';
// GPT-053 phase-1 native baseline. Only GitHub Actions; never launches local Chrome.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),os=require('node:os');
const {withGame,sleep,cdpConnect,findChrome}=require('./harness.js');
const {summarizeRun}=require('./performance-metrics053.cjs');
const arg=(n,d)=>process.argv.find(a=>a.startsWith('--'+n+'='))?.slice(n.length+3)??d;
const cfg={scene:arg('scene','small'),speed:+arg('speed','5'),ai:arg('ai','on')==='on',seconds:+arg('seconds','30'),seed:+arg('seed','87'),profileSeconds:+arg('profile-seconds','10')};
if(!['small','medium','large','dense'].includes(cfg.scene)||![1,2,3,5].includes(cfg.speed)||cfg.seconds<5)throw Error('invalid benchmark053 arguments');
const out=path.resolve(arg('out',`shots/benchmark053/${cfg.scene}-s${cfg.speed}-ai${cfg.ai?'on':'off'}`));
const write=(name,data)=>fs.writeFileSync(path.join(out,name),JSON.stringify(data,null,2)+'\n');
function snapshot053(){
 const G=GV,n=G.N(),roots=[];for(let y=0;y<n;y++)for(let x=0;x<n;x++){const b=G.tile(x,y)?.bld;if(b&&!b.ref)roots.push({x,y,k:b.k,lv:b.lv,age:b.age});}
 G.save();const saves={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('glimmerville.v1.s3')&&!k.endsWith('_bak'))saves[k]=localStorage.getItem(k);}
 return {stats:G.stats(),exactMoney:G.devMoney516B?.()??null,n,roots,ai:G.aiInfo(),diff:G.devDiff516B?.(),developer:G.dev516B?.(),generalBuildingTelemetry:G.metroUsage516A?.()??null,saves,version:G.ver(),viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},visibility:document.visibilityState};
}
function setup053(c){
 const G=GV;G.setSpeed(0);G.ai(false);G.setMapSize(c.scene==='large'?108:72);G.setDiff(1);G.newWorldSeeded(c.seed);G.setSpeed(0);
 // Explicit controlled fixture: high starting cash and rank-4 unlock, through a slot-3 save/load.
 // No sandbox, god mode, simulation flags, RNG calls or synthetic building objects.
 G.save();const key='glimmerville.v1.s3',raw=localStorage.getItem(key);if(!raw)throw Error('benchmark053 normal slot-3 save missing');
 const initial=JSON.parse(raw);initial.money=10000000;initial.rk=3;initial.df=1;localStorage.setItem(key,JSON.stringify(initial));if(!G.load())throw Error('benchmark053 controlled fixture load failed');G.setSpeed(0);G.ai(false);
 const target={small:16,medium:96,large:256,dense:96}[c.scene],n=G.N(),placed=[],failed={};
 function p(tool,x,y){const reason=G.canPlaceTool(tool,x,y);if(reason){failed[reason]=(failed[reason]||0)+1;return false;}if(G.place(tool,x,y)){placed.push({tool,x,y});return true;}return false;}
 // Fixed scanning order, native placements only. Roads + underground water precede each residential row.
 let homes=0;for(let y=5;y<n-5&&homes<target;y+=4){for(let x=4;x<n-4;x++){const t=G.tile(x,y);if(t&&t.t!==0){p('road',x,y);p('wpipe',x,y);}}
  for(let x=4;x<n-5&&homes<target;x+=3){if(p('workersNarrowRow',x,y+1))homes++;}}
 for(const tool of ['geo','water','sewage','farm','dump','school','police','fire']){let done=false;for(let y=3;y<n-3&&!done;y++)for(let x=3;x<n-3&&!done;x++)if(G.canPlaceTool(tool,x,y)===null)done=p(tool,x,y);}
 if(homes!==target)throw Error('benchmark053 fixture roots shortage '+JSON.stringify({target,homes,failed}));
 G.selectTool434('pan');G.setZoom(1);G.setRot(0);G.lookAt(18,12);G.setVisT(55);G.ai(c.ai);G.setSpeed(0);
 return{targetHomes:target,placedHomes:homes,nativePlacements:placed,failedPlacements:failed,startingCash:10000000,startingRank:4,normalDifficulty:1,requestedSeed:c.seed,actualWorldSeed:initial.seed,controlled:true,mature:false,description:'Native newly-placed mixed residential fixture; not a naturally evolved mature city. No baseline performance claim for mature city.'};
}
function begin053(c){
 const b=window.__benchmarkCapture053={frameMs:[],longTasks:[],start:performance.now(),end:null,last:null,active:true,densePlacements:[],longTaskSupported:PerformanceObserver.supportedEntryTypes.includes('longtask')};
 if(b.longTaskSupported){b.observer=new PerformanceObserver(list=>{for(const e of list.getEntries())b.longTasks.push({startTime:e.startTime,duration:e.duration,name:e.name});});b.observer.observe({type:'longtask',buffered:false});}
 function frame(t){if(!b.active)return;if(b.last!==null)b.frameMs.push(t-b.last);b.last=t;b.raf=requestAnimationFrame(frame);}b.raf=requestAnimationFrame(frame);
 if(c.scene==='dense'){let row=4,col=4;b.interval=setInterval(()=>{let done=false;for(let count=0;count<40&&!done;count++){const x=col,y=row;col+=3;if(col>=GV.N()-4){col=4;row+=3;}if(row>=GV.N()-4){clearInterval(b.interval);return;}if(GV.canPlaceTool('park',x,y)===null){const t=performance.now(),ok=GV.place('park',x,y);b.densePlacements.push({x,y,ok,at:t,duration:performance.now()-t});done=ok;}}},100);}
 GV.setSpeed(c.speed);return b.start;
}
function end053(){const b=window.__benchmarkCapture053;b.end=performance.now();b.active=false;cancelAnimationFrame(b.raf);clearInterval(b.interval);if(b.observer){for(const e of b.observer.takeRecords())b.longTasks.push({startTime:e.startTime,duration:e.duration,name:e.name});b.observer.disconnect();}GV.setSpeed(0);return{frameMs:b.frameMs,longTasks:b.longTaskSupported?b.longTasks.filter(e=>e.startTime>=b.start&&e.startTime<b.end):null,start:b.start,end:b.end,elapsedMs:b.end-b.start,densePlacements:b.densePlacements};}
async function main(){
 fs.mkdirSync(out,{recursive:true});if(!process.env.GITHUB_ACTIONS)throw Error('benchmark053 native browser execution is GitHub Actions only');
 const index=fs.readFileSync(path.join(__dirname,'index.html'));const identity={config:cfg,commit:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),indexSha256:crypto.createHash('sha256').update(index).digest('hex'),environment:{platform:process.platform,node:process.version,runner:process.env.RUNNER_OS,runnerArch:process.env.RUNNER_ARCH,cpuModel:os.cpus()[0]?.model??null,cpuCount:os.cpus().length,totalMemoryBytes:os.totalmem(),browserExecutable:findChrome(),runId:process.env.GITHUB_RUN_ID},hardware:'GitHub Actions headless Chromium; not real mobile hardware',runtimeSource:'unmodified index.html; no test-injected closure accessors'};write('identity.json',identity);
 const r=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp,chromeMs})=>{
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
  write('browser.json',await cdp.send('Browser.getVersion'));
  const fixture=await cdp.evalJs('('+setup053.toString()+')('+JSON.stringify(cfg)+')');write('fixture.json',fixture);await sleep(3000);
  const before=await cdp.evalJs('('+snapshot053.toString()+')()');write('before.json',before);
  if(before.diff!==1||before.developer?.sandbox||before.developer?.god)throw Error('benchmark053 requires normal difficulty/no developer sandbox');
  const memoryBefore=await cdp.send('Runtime.getHeapUsage');
  await cdp.evalJs('('+begin053.toString()+')('+JSON.stringify(cfg)+')');await sleep(cfg.seconds*1000);
  const raw=await cdp.evalJs('('+end053.toString()+')()');write('frames.json',raw);
  const memoryAfter=await cdp.send('Runtime.getHeapUsage'),after=await cdp.evalJs('('+snapshot053.toString()+')()');write('after.json',after);write('memory.json',{before:memoryBefore,after:memoryAfter,note:'V8 live/total heap; no forced GC; not total process/GPU memory'});
  const screenshot=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'after.png'),Buffer.from(screenshot.data,'base64'));
  const days=after.stats.day-before.stats.day;
  const measured=summarizeRun({frameMs:raw.frameMs,elapsedMs:raw.elapsedMs,days,placements:null,longTasks:raw.longTasks});
  const summary={...identity,measured,fixture:{targetHomes:fixture.targetHomes,placedHomes:fixture.placedHomes},sampleCount:measured.frames.frames,elapsedMs:raw.elapsedMs,fps:measured.frames.fps,wallWindowFps:raw.frameMs.length*1000/raw.elapsedMs,frameMs:{p50:measured.frames.p50Ms,p95:measured.frames.p95Ms,p99:measured.frames.p99Ms},longTasks:measured.longTasks,days,daysPerSecond:days*1000/raw.elapsedMs,idealDaysPerSecond:cfg.speed/.9,rootsBefore:before.roots.length,rootsAfter:after.roots.length,populationBefore:before.stats.pop,populationAfter:after.stats.pop,denseSuccessfulPlacements:raw.densePlacements.filter(x=>x.ok).length,longTaskWindow:'tasks whose startTime falls within [start,end); full task duration retained',totalAiPlacements:null,rngState:null,generalBuildingPlacementsOnly:Number.isFinite(after.generalBuildingTelemetry?.successfulBuilds)&&Number.isFinite(before.generalBuildingTelemetry?.successfulBuilds)?after.generalBuildingTelemetry.successfulBuilds-before.generalBuildingTelemetry.successfulBuilds:null,limitations:['No precision RNG state or complete AI placement ledger in native GV; values are null, not zero.','Fixture buildings newly constructed; not mature city proof.','Existing game catches up at most 8 days and discards backlog; observed throughput reported unchanged.','No A/B candidate or performance acceptance claim yet.','Boundary snapshot calls GV.save outside timed capture; this is a slot-3 save side effect, not a pure getter.']};write('summary.json',summary);console.log('NATIVE BASELINE '+JSON.stringify(summary));
  if(raw.frameMs.length<30||days<=0)throw Error('benchmark053 insufficient native frames or no simulation days');
  // Separate diagnostic window: profiling overhead is never mixed into baseline frame statistics.
  if(cfg.profileSeconds>0){
   const devPort=8199+1000+(process.pid%400)+(chromeMs.attempt===2?1:0),targets=await fetch('http://127.0.0.1:'+devPort+'/json/list').then(r=>r.json()),target=targets.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);let traceHandle;let finishTrace;const done=new Promise(resolve=>finishTrace=resolve);
   const trace=await cdpConnect(target.webSocketDebuggerUrl,m=>{if(m.method==='Tracing.tracingComplete'){traceHandle=m.params.stream;finishTrace();}});
   try{await trace.send('Tracing.start',{categories:'devtools.timeline,v8,disabled-by-default-v8.gc',transferMode:'ReturnAsStream'});const profileBefore=await cdp.evalJs('({at:performance.now(),stats:GV.stats(),exactMoney:GV.devMoney516B?.()??null})');await cdp.send('Profiler.enable');await cdp.send('Profiler.start');await cdp.evalJs('GV.setSpeed('+cfg.speed+')');await sleep(cfg.profileSeconds*1000);await cdp.evalJs('GV.setSpeed(0)');write('cpu-profile.json',await cdp.send('Profiler.stop'));const profileAfter=await cdp.evalJs('({at:performance.now(),stats:GV.stats(),exactMoney:GV.devMoney516B?.()??null})');write('profile-window.json',{before:profileBefore,after:profileAfter,requestedSeconds:cfg.profileSeconds,note:'Separate diagnostic window continuing from the end of the baseline; includes profiler/trace overhead, excluded from baseline FPS statistics.'});await trace.send('Tracing.end');await Promise.race([done,sleep(30000).then(()=>{throw Error('trace completion timeout');})]);if(!traceHandle)throw Error('trace missing stream');const file=fs.openSync(path.join(out,'trace.json'),'w');try{let eof=false;while(!eof){const chunk=await trace.send('IO.read',{handle:traceHandle,size:1024*1024});fs.writeSync(file,chunk.base64Encoded?Buffer.from(chunk.data,'base64'):Buffer.from(chunk.data));eof=chunk.eof;}}finally{fs.closeSync(file);await trace.send('IO.close',{handle:traceHandle});}}finally{trace.close();}
  }
  write('console.json',{errors:cdp.errors,benign:cdp.benign});if(cdp.errors.length)throw Error('native console errors '+cdp.errors.join('; '));return summary;
 });
 if(!r.ok)throw Error(r.fails.join('; '));write('receipt.json',{ok:true,seconds:r.seconds,baselineRecorded:true,acceptancePassed:false});
}
if(require.main===module)main().catch(e=>{fs.mkdirSync(out,{recursive:true});write('failure.json',{error:e.stack,config:cfg,acceptancePassed:false});console.error(e.stack);process.exitCode=1;});
module.exports={setup053,snapshot053,begin053,end053};

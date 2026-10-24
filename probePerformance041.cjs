'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave041 performance runs on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {withGame,ROOT}=require('./harness.js'),OUT=path.join(ROOT,'shots','wave041','performance'),BASE='edae7eee48b3d9863086075bbcd0c4f932c1ab27',file=path.join(ROOT,'perf-base041.html');
async function measure041(baseSHA){
  const frame=document.createElement('iframe');frame.style.cssText='position:fixed;left:-20000px;top:0;width:'+innerWidth+'px;height:'+innerHeight+'px;border:0';frame.src='/perf-base041.html';document.body.appendChild(frame);
  const wait=async test=>{const end=Date.now()+120000;while(Date.now()<end){if(test())return;await new Promise(r=>setTimeout(r,100));}throw Error('perf041 BASE iframe native boot timeout');};
  await wait(()=>frame.contentWindow?.__bootDone453&&frame.contentWindow.GV);const old=frame.contentWindow;old.localStorage.setItem('glimmerville.v1.slot','3');old.GV.newWorldSeeded(87);old.GV.setSpeed(0);await wait(()=>old.__t519Roof>0&&old.__bootDone453);await new Promise(r=>setTimeout(r,3000));
  function setup(w,special){
    const G=w.GV;G.newWorldSeeded(87);G.setSpeed(0);if(!G.dev516B().sandbox)G.enterSandbox516B();G.setGod516B(true);G.setOverride516B('unlockAll',true);G.capabilitySetMoney506(1000000);G.setDiff(1);
    const rows=special?G.britishWave041.rows():Array.from({length:10},()=>null),placed=[];
    for(let j=0;j<10;j++){
      let p;for(let y=4;y<66&&!p;y+=3)for(let x=4;x<66;x+=3)if(G.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(G.tile(x+dx,y+dy)?.tree)clear=false;if(clear){p={x,y};break;}}
      if(!p)throw Error('perf041 actual native lot');if(special&&!G.britishWave041.select(rows[j].id))throw Error('perf041 native appearance selection');if(!G.place('landmark',p.x,p.y))throw Error('perf041 actual native placement');G.testAge635(p.x,p.y,2,2,30);placed.push(p);
    }
    G.selectTool434('pan');G.britishWeather004(1,0,0);G.setRot(0);G.art574.zoom574(1.5);G.lookAt(21,4.5);w.__waterF695=0;G.setVisT(G.art574.cycle574()*.5);G.forceDraw();return placed;
  }
  const baselineLots=setup(old,false),newLots=setup(window,true);if(JSON.stringify(baselineLots)!==JSON.stringify(newLots))throw Error('perf041 same native scene layout');
  const API=window.BritishWaveArchitecture041,cache=GV.art574.SPR().bld,refs=API.rows.flatMap(q=>[0,1,2,3].map(v=>cache['24_1_'+(q.v+v)]));let builds=0;
  window.BritishWaveArchitecture041={...API,buildAll(){builds++;return API.buildAll();}};
  const sample={base:[],head:[]};
  try{
    for(let i=0;i<12;i++){old.GV.forceDraw();GV.forceDraw();}
    for(let i=0;i<40;i++)for(const which of(i%2?['head','base']:['base','head'])){
      const G=which==='base'?old.GV:GV,t=performance.now();for(let j=0;j<4;j++)G.forceDraw();sample[which].push((performance.now()-t)/4);
    }
    for(let j=0;j<refs.length;j++){const q=API.rows[Math.floor(j/4)],v=j%4;if(cache['24_1_'+(q.v+v)]!==refs[j])throw Error('perf041 native cached identity changed');}
    if(builds!==0)throw Error('perf041 normal redraw rebaked new geometry');
    // A valid live source fault calls the actual builder on a redraw. The same
    // cache guard must catch it, followed by exact API restoration and redraw.
    const draw=GV.forceDraw;let first;
    try{GV.forceDraw=()=>{window.BritishWaveArchitecture041.buildAll();return draw();};GV.forceDraw();try{if(builds!==0)throw Error('perf041 normal redraw rebaked new geometry');}catch(e){first=e.message;}}
    finally{GV.forceDraw=draw;builds=0;}
    if(first!=='perf041 normal redraw rebaked new geometry')throw Error('perf041 negative missed cache guard');GV.forceDraw();if(builds)throw Error('perf041 cache restore failed');
    const summary=a=>{const v=[...a].sort((x,y)=>x-y);return{n:v.length,median:v[Math.floor(v.length*.5)],p90:v[Math.floor(v.length*.9)],min:v[0],max:v.at(-1)};};
    const stats={base:summary(sample.base),head:summary(sample.head)};
    // A repeated millisecond-scale difference matters; isolated maxima do not.
    const check=stats=>{if(stats.head.median>stats.base.median*1.5+2||stats.head.p90>stats.base.p90*1.5+3)throw Error('perf041 repeatable native redraw regression '+JSON.stringify(stats));};check(stats);
    let timingRed;const slow=[],timingInjectedDelayMs=Math.ceil(2*Math.max(stats.base.median,stats.base.p90)+20);
    try{GV.forceDraw=()=>{const until=performance.now()+timingInjectedDelayMs;while(performance.now()<until){}return draw();};for(let i=0;i<30;i++){const t=performance.now();GV.forceDraw();slow.push(performance.now()-t);}try{check({base:stats.base,head:summary(slow)});}catch(e){timingRed=e.message;}}
    finally{GV.forceDraw=draw;}
    if(!timingRed?.startsWith('perf041 repeatable native redraw regression '))throw Error('perf041 timing negative missed target '+JSON.stringify({stats,sample,timingInjectedDelayMs,slow}));
    const restored={base:[],head:[]};for(let i=0;i<40;i++)for(const which of(i%2?['head','base']:['base','head'])){const G=which==='base'?old.GV:GV,t=performance.now();for(let j=0;j<4;j++)G.forceDraw();restored[which].push((performance.now()-t)/4);}
    const restoredStats={base:summary(restored.base),head:summary(restored.head)};check(restoredStats);if(builds)throw Error('perf041 final restored native draw rebaked geometry');
    return{stats,sample,restoredStats,newGeometryBuildsDuringWarmDraw:builds,cacheLeaves:refs.length,firstRed:first,timingFirstRed:timingRed,timingNegativeSamples:slow.length,timingInjectedDelayMs,timingNegativeSampleMs:slow,restoredGreen:true,interleaved:true,nativeBaselineSource:baseSHA,viewport:{head:[innerWidth,innerHeight],base:[old.innerWidth,old.innerHeight]},hardware:'GitHub Actions Ubuntu desktop Chromium; not real mobile hardware'};
  }finally{window.BritishWaveArchitecture041=API;frame.remove();}
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});const original=cp.execFileSync('git',['show',BASE+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
  fs.writeFileSync(file,original.replace('<head>','<head><script>window.confirm=()=>true;Math.random=()=>.125;<\/script>'));
  try{const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{const q=await cdp.evalJs('('+measure041.toString()+')('+JSON.stringify(BASE)+')');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return q;});assert(r.ok&&r.result,'perf041 native sessions '+r.fails.join('; '));fs.writeFileSync(path.join(OUT,'manifest-performance.json'),JSON.stringify({head:process.env.GITHUB_SHA,...r.result},null,2)+'\n');console.log('perf041 GREEN '+JSON.stringify(r.result));}
  finally{fs.rmSync(file,{force:true});}
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'failure.json'),JSON.stringify({head:process.env.GITHUB_SHA,action:'interleaved native performance proof',error:e.stack},null,2)+'\n');console.error(e.stack);process.exitCode=1;});

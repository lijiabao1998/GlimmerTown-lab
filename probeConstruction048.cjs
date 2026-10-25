'use strict';
// ADDITIVE diagnostic only. Existing scene guards, their two-draw captures, and
// every product render budget remain untouched. Run actual game only in CI.
if (!process.env.GITHUB_ACTIONS) throw Error('wave048 construction game guard runs on GitHub Actions only');
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const {withGame, ROOT} = require('./harness.js');
const BASE = '4346a96543b01ffd47ac3696480661b5de8638ae';
const OUT = path.join(ROOT, 'shots', 'wave048', 'construction');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const index = fs.readFileSync(path.join(ROOT, 'index.html'));
const oldScene = fs.readFileSync(path.join(ROOT, 'probeScenes048.cjs'));
// Exact independent identities from the first scope card. These native-paid
// positions retain the established fixed native-paid layout; wave20 must prove them anew.
const IDS = ['foxglovecharter','silverweedalpine','maddartutors','restharrowsalt','betonymarionette','burnetterrace','figwortcolour','damewortcruck','pimpernelcross','fumitorygin'];
const ROWS = IDS.map((id, i) => ({id, x:7+3*i, y:4, v:920+4*i}));
const CONTRACT = Object.freeze({age:7, seed:87, rot:0, zoom:1, at:[21,4.5], naturalObservations:12, flushedObservations:66});
const report = {
  schema:'GPT-048.additive-construction-readiness.v1', head:process.env.GITHUB_SHA, base:BASE,
  indexSHA256:hash(index), originalSceneProbeSHA256:hash(oldScene), contract:CONTRACT,
  routes:[], files:[], failures:[], gameExecuted:false,
  scope:[
    'Additive render-readiness diagnosis. The original 57 scenes, 40 edge cases, and original two-draw evidence remain authoritative and unmodified.',
    'The natural route observes normal asynchronous native rendering in a paused, native-paid test city. It does not flush, reset, replace, or accelerate the production queue.',
    'The independent explicit-flush route calls the existing GV.constr13.flush exactly once. Its captures are labelled cache-flush fixture, not normal-player startup evidence.',
    'Age 7 is a declared scene fixture through the existing testAge635 export, not a claim that ten buildings progressed seven days naturally.',
    'No adaptive wait, pixel-based frame selection, layer disable, render-budget change, mocked scene, masked comparison, or production modification.'
  ],
  fixedIntervalDerivation:{
    natural:'12 native rAF observations: the queue fallback begins after three frames with pending work, then drainPQ(3) builds at least one queued profile per call. Ten cold queued profiles plus two initial waiting frames. The fixed endpoint must have zero pending, shell misses, and Layer A misses; it is never replaced by a later successful frame.',
    flushed:'66 native rAF observations after one explicit native flush: six possible static cache tags (g,m,b,f,s,h) times ten sites, plus five two-images-per-frame shell warmup frames, plus one completion frame. This is a frozen diagnostic interval, not a player latency SLA. Every observation is retained and the endpoint must have zero pending, shell misses, and Layer A misses.'
  },
  notClaimed:['Original cold two-draw captures already contain ten fully rendered buildings','A product renderer or startup-performance fix','Mobile hardware or Safari validation','Full wave acceptance from this additive guard alone']
};
function transfer(name, bytes) {
  const s = bytes.toString('base64');
  console.log('WAVE048_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:bytes.length,sha256:hash(bytes)}));
  for(let i=0;i<s.length;i+=4096) console.log('WAVE048_FILE_DATA '+s.slice(i,i+4096));
  console.log('WAVE048_FILE_END '+name);
}
function persist() {
  fs.mkdirSync(OUT,{recursive:true});
  const b=Buffer.from(JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(OUT,'manifest-construction.json'),b);
  transfer('construction/manifest-construction.json',b);
}
function sourcePins() {
  const base=cp.execFileSync('git',['show',BASE+':index.html'],{cwd:ROOT,maxBuffer:20*1024*1024}).toString();
  const portion=s=>{const start=s.indexOf('const X13G=(()=>{'),end=s.indexOf('\nfunction greenhouseSelftest702()',start);assert(start>=0&&end>start,'construction048 unique source region');return s.slice(start,end);};
  const actual=portion(index.toString()), independent=portion(base);
  assert.equal(actual,independent,'construction048 entire native construction renderer byte-identical to independent BASE');
  assert.equal(hash(Buffer.from(actual)),'07484bc08a1748154b76900ea28af248f2dddd3195726b25de42050cf2c43bcc','construction048 independently frozen renderer bytes');
  const pins={
    profileQueue:"if(budget&&!window.__x13SyncProf){if(!PQ.has(s))PQ.set(s,bd);schedPQ();return 'pending';}",
    idleBudget:'drainPQ(8)', idleTimeout:'requestIdleCallback(f,{timeout:150})',
    frameBudget:'if(PQ.size){if(++pqWait>=3)drainPQ(3);}else pqWait=0;',
    imageBudget:'if(imgN>=2){stats.miss++;return null;}',
    staticBudget:'if(bakeN>=6||bakeMs>6){stats.laMiss++;fn(D);return null;}',
    nativeFlush:'function flush(){drainPQ(1e9);return PQ.size;}',
    pendingPlaceholder:"if(M==='pending'){pending(A);return true;}"
  };
  for(const [name,value] of Object.entries(pins)) assert(actual.includes(value),'construction048 original budget/source pin '+name);
  report.sourcePins={rendererSHA256:hash(Buffer.from(actual)),rendererBytes:Buffer.byteLength(actual),exactIndependentBase:true,pins};
}

// This function executes in actual Chromium against the unchanged native game.
async function route048(kind, rows, contract) {
  const started=performance.now(), G=GV.constr13, api=GV.britishWave048;
  const output={kind,label:kind==='natural'?'normal native asynchronous queue in declared age fixture':'explicit existing native cache-flush fixture',observations:[],frames:[],negative:[],failures:[],flushCalls:0};
  const originalDebug=window.__x13Dbg, originalWater=window.__waterF695;
  const require048=(ok,message)=>{if(!ok)throw Error(message);};
  const retain=fn=>{try{fn();return true;}catch(e){output.failures.push(e.message);return false;}};
  const noFlags=['__noBritishWave048','__noConstr700','__noConstr701','__x13SyncProf','__x13NoQ','__x13NoCache','__x13NoLite','__x13NoAuto','__x13Skip','__x13Still','__noAnim','__x13NoMan','__x13NoNL','__x13NoFrame','__x13NoDeck','__x13NoMask','__x13NoSilFront','__x13NoBodyCache','__x13NoLiteBake','__x13NoCull','__x13Ab'];
  const snapshot=label=>{
    const stats={...G.stats()}, debug=window.__x13Dbg||{};
    const sites=rows.map(q=>{
      const b=api.read(q.x,q.y), C=debug['C:'+q.x+','+q.y], d=debug[q.x+','+q.y];
      let rendering=null;
      if(C){
        const needsShell=C.M.sil?C.silS>C.silK+.5:C.H.some(h=>h.sh>h.kh+.5)||(C.M.aux&&!C.strip);
        const needsTimber=!C.M.sil&&C.H.some(h=>h.m.pitchR&&h.sp>=1&&h.tk<1);
        rendering={p:C.p,profileSource:C.M.src,profileReady:!!d&&d.M===C.M,
          nativeSprite:C.A.s===api.sprite(q.x,q.y),age:C.A.bd.age,kind:C.A.bd.k,variant:C.A.bd.v,
          shellReady:!needsShell||G._shell.has(C.A.s.img),timberReady:!needsTimber||G._timb.has(C.A.s.img),
          positiveBodyHeight:C.M.sil?C.silS>0:C.H.some(h=>h.sh>0),
          bodyHeights:C.M.sil?{shell:C.silS,skin:C.silK}:C.H.map(h=>({shell:h.sh,skin:h.kh,progress:h.sp})),
          sprite:{w:C.A.s.w,h:C.A.s.h,ax:C.A.s.ax,ay:C.A.s.ay},pen:debug['pen:'+q.x+','+q.y]||null};
      }
      return {...q,age:b?.age,k:b?.k,actualVariant:b?.v,footprintAges:GV.testAge635(q.x,q.y,2,2,null),rendering};
    });
    return {label,elapsedMs:performance.now()-started,pending:G.pending(),stats,sites,camera:GV.camera436(),season:GV.season().idx,brightness:GV.daylightDbg().b};
  };
  const photo=(name,state)=>{const c=document.getElementById('game');output.frames.push({name,w:c.width,h:c.height,state,data:c.toDataURL('image/png')});};
  const ageCheck=s=>{
    require048(s.sites.length===10,'construction048 ten native ages');
    for(const q of s.sites)require048(q.age===7&&q.footprintAges.every(a=>a===7),'construction048 age-7 native roots and references '+q.id);
  };
  const ready=(s,staticReady=false)=>{
    require048(s.pending===0&&s.stats.pend===0,'construction048 readiness pending '+s.pending+'/'+s.stats.pend);
    ageCheck(s);
    require048(s.stats.sites===10,'construction048 all ten real render sites '+s.stats.sites);
    for(const q of s.sites){
      const r=q.rendering;
      require048(q.k===24&&q.actualVariant===q.v,'construction048 native identity '+q.id);
      require048(r&&r.profileReady&&r.nativeSprite,'construction048 current native render profile '+q.id);
      require048(r.age===7&&r.kind===24&&r.variant===q.v&&r.p>=6.5&&r.p<8&&r.positiveBodyHeight,'construction048 real late-stage body '+q.id);
      if(staticReady)require048(r.shellReady&&r.timberReady,'construction048 native image-cache readiness '+q.id);
    }
    if(staticReady)require048(s.stats.miss===0&&s.stats.laMiss===0,'construction048 final cache misses '+s.stats.miss+'/'+s.stats.laMiss);
  };
  const drawPinned=night=>{window.__waterF695=0;GV.setVisT(GV.art574.cycle574()*(night?.02:.5));window.__x13Dbg={};GV.forceDraw();};
  const equalPixels=(a,b)=>{
    require048(a.length===b.length,'construction048 whole-canvas pixel dimensions');
    for(let i=0;i<a.length;i++)if(a[i]!==b[i])throw Error('construction048 whole-canvas repeat pixels at byte '+i);
  };
  const pixels=()=>{const c=document.getElementById('game');return c.getContext('2d').getImageData(0,0,c.width,c.height).data;};
  const capturePair=night=>{
    const mode=night?'night':'day';
    drawPinned(night);const s1=snapshot(mode+'-repeat-a'),a=pixels();photo(mode+'-repeat-a.png',s1);retain(()=>ready(s1,kind==='explicit-flush'));
    drawPinned(night);const s2=snapshot(mode+'-repeat-b'),b=pixels();photo(mode+'-repeat-b.png',s2);retain(()=>ready(s2,kind==='explicit-flush'));
    const equal=retain(()=>equalPixels(a,b));output.repeatPairs.push({mode,equal,firstFrame:s1.stats.frame,secondFrame:s2.stats.frame,clockInputs:{visT:GV.art574.cycle574()*(night?.02:.5),waterFrame:0},fullCanvasBytes:a.length});
    if(!equal)return;
    // A real canvas corruption, not a fabricated expected hash or mocked API.
    const c=document.getElementById('game'),g=c.getContext('2d'),one=g.getImageData(0,0,1,1);one.data[0]^=255;g.putImageData(one,0,0);
    let first='';try{equalPixels(b,pixels());}catch(e){first=e.message;}
    retain(()=>require048(first.startsWith('construction048 whole-canvas repeat pixels'),'construction048 one-pixel negative first RED'));
    drawPinned(night);const restored=pixels();const restoredEqual=retain(()=>equalPixels(b,restored));
    photo(mode+'-pixel-negative-restored.png',snapshot(mode+'-negative-restored'));
    output.negative.push({name:mode+' real native canvas one-pixel corruption',first,restoredEqual});
  };
  try {
    for(const flag of noFlags)require048(!window[flag],'construction048 disabled or overridden production layer '+flag);
    require048(window.__x13Frac==null&&window.__x13RankForce==null&&window.__x13Sched==null,'construction048 unmodified progress/schedule/rank');
    output.unmodifiedFlags=Object.fromEntries(noFlags.map(f=>[f,!!window[f]]));
    require048(JSON.stringify(api.rows().map(q=>[q.id,q.v]))===JSON.stringify(rows.map(q=>[q.id,q.v])),'construction048 independently fixed ten catalog identities');
    GV.setSpeed(0);GV.setDiff(3);GV.newWorldSeeded(contract.seed);GV.setSpeed(0);
    if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
    output.placed=[];
    for(const q of rows){
      require048(api.select(q.id),'construction048 native select '+q.id);
      const cost=GV.placePreview459('landmark',q.x,q.y)?.cost,before=GV.devMoney516B();
      require048(GV.place('landmark',q.x,q.y),'construction048 native paid placement '+q.id);
      const spent=before-GV.devMoney516B();require048(cost===2000&&spent===cost,'construction048 unchanged native price '+q.id);
      GV.testAge635(q.x,q.y,2,2,contract.age);output.placed.push({...q,cost,spent});
    }
    api.close();GV.selectTool434('pan');document.getElementById('game').dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
    GV.britishWeather004(1,0,0);GV.setRot(contract.rot);GV.art574.zoom574(contract.zoom);GV.lookAt(...contract.at);
    require048(G.pending()===0,'construction048 initially empty construction queue');
    output.beforeCold=snapshot('before-first-draw');
    drawPinned(false);const cold1=snapshot('cold-first-draw');photo('cold-first-draw.png',cold1);
    drawPinned(false);const cold2=snapshot('cold-second-draw');photo('cold-second-draw.png',cold2);
    output.cold={first:cold1,second:cold2};ageCheck(cold2);
    // Both calls occur synchronously before any idle callback: readiness must
    // reject the real pending queue if a caller withholds waiting/flush.
    let first='';try{ready(cold2);}catch(e){first=e.message;}
    retain(()=>require048(cold1.pending===10&&cold2.pending===10&&first.startsWith('construction048 readiness pending'),'construction048 withheld-readiness negative must reject actual ten pending profiles'));
    output.negative.push({name:'withhold cache readiness and capture the real two-draw cold queue',first,pending:cold2.pending});
    if(kind==='explicit-flush'){
      output.flush={before:snapshot('before-explicit-native-flush')};
      output.flush.returnedPending=G.flush();output.flushCalls++;
      output.flush.after=snapshot('after-explicit-native-flush-before-render');
      photo('after-explicit-flush-before-render.png',output.flush.after);
      retain(()=>require048(output.flush.returnedPending===0&&output.flush.after.pending===0,'construction048 native flush drains queued profiles'));
    }
    // No calls to forceDraw/flush/reset/profile occur during these observations.
    // Native main-loop frames and original idle callbacks do all queue work.
    const count=kind==='natural'?contract.naturalObservations:contract.flushedObservations;
    const initialFrame=G.stats().frame, observationStarted=performance.now();window.__x13Dbg={};
    for(let i=1;i<=count;i++){
      await new Promise(resolve=>requestAnimationFrame(resolve));
      const s=snapshot('native-rAF-'+i);output.observations.push(s);
      if(i===count){photo('fixed-native-endpoint.png',s);output.endpoint=s;}else window.__x13Dbg={};
    }
    output.nativeObservationCount=count;output.nativeFrameDelta=G.stats().frame-initialFrame;
    output.nativeObservationElapsedMs=performance.now()-observationStarted;
    retain(()=>require048(output.nativeFrameDelta>=count,'construction048 native main-loop frame progress'));
    retain(()=>ready(output.endpoint,true));
    output.repeatPairs=[];capturePair(false);capturePair(true);
    output.final=snapshot('final');
    retain(()=>require048(!window.__x13Err&&!window.__x13BesErr,'construction048 native construction runtime exception'));
    output.runtimeErrors={generic:window.__x13Err||null,bespoke:window.__x13BesErr||null};
    output.elapsedMs=performance.now()-started;
    return output;
  } catch(e) {
    output.failures.push(e.stack||e.message);output.elapsedMs=performance.now()-started;return output;
  } finally {
    window.__x13Dbg=originalDebug;window.__waterF695=originalWater;
  }
}

(async()=>{
  sourcePins();fs.mkdirSync(OUT,{recursive:true});
  for(const kind of ['natural','explicit-flush']){
    const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>0.125',log:console.log},async({cdp})=>{
      const q=await cdp.evalJs('('+route048.toString()+')('+JSON.stringify(kind)+','+JSON.stringify(ROWS)+','+JSON.stringify(CONTRACT)+')');
      if(cdp.errors.length)q.failures.push('construction048 browser errors: '+cdp.errors.join('; '));
      return q;
    });
    report.gameExecuted=true;
    if(!r.ok||!r.result){report.failures.push(kind+' boot/runtime '+r.fails.join('; '));continue;}
    const q=r.result;
    for(const frame of q.frames){
      const bytes=Buffer.from(frame.data.split(',')[1],'base64'),name=kind+'-'+frame.name;
      fs.writeFileSync(path.join(OUT,name),bytes);delete frame.data;
      Object.assign(frame,{file:name,bytes:bytes.length,sha256:hash(bytes)});report.files.push({file:name,bytes:bytes.length,sha256:hash(bytes)});
      if(frame.name==='cold-second-draw.png'||frame.name==='fixed-native-endpoint.png'||frame.name==='day-repeat-b.png'||frame.name==='night-repeat-b.png')transfer('construction/'+name,bytes);
    }
    report.routes.push(q);report.failures.push(...q.failures.map(s=>kind+': '+s));
    console.log('WAVE048_CONSTRUCTION_ROUTE '+JSON.stringify({kind,pendingCold:q.cold?.second.pending,pendingEndpoint:q.endpoint?.pending,observations:q.nativeObservationCount,nativeFrameDelta:q.nativeFrameDelta,elapsedMs:q.elapsedMs,flushCalls:q.flushCalls,repeatPairs:q.repeatPairs?.map(p=>({mode:p.mode,equal:p.equal})),failures:q.failures}));
  }
  assert(fs.readFileSync(path.join(ROOT,'index.html')).equals(index),'construction048 production source untouched');
  assert(fs.readFileSync(path.join(ROOT,'probeScenes048.cjs')).equals(oldScene),'construction048 original two-draw scene evidence contract untouched');
  assert.equal(report.routes.length,2,'construction048 both independent native routes retained');
  assert.equal(report.failures.length,0,'construction048 strict additive failures: '+report.failures.join('; '));
  report.ok=true;
})().catch(e=>{report.ok=false;report.failures.push(e.stack||e.message);console.error(e.stack);process.exitCode=1;}).finally(persist);

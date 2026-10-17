'use strict';
// Native game execution belongs in GitHub Actions. Existing guards stay intact.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js');
const {resolveChangeBase026,resolveRepairScope026}=require('./fiscalChangeBase026.cjs');
const BASE='98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e',OUT=path.join(ROOT,'shots','fiscal026'),index=path.join(ROOT,'index.html');
const head=fs.readFileSync(index,'utf8'),base=cp.execFileSync('git',['show',BASE+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
const changeBase=resolveChangeBase026(),comparisonSource=cp.execFileSync('git',['show',changeBase.sha+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
const repairScope=resolveRepairScope026({baseSha:changeBase.sha}),historicalFrameScope=repairScope.historical;
// The T751 patch keeps its original source boundaries. Later committed work
// may change those sources, but temporary/uncommitted edits are still rejected.
const sourceIdentityRevision=historicalFrameScope?changeBase.sha:'HEAD';
const sourceIdentitySha=cp.execFileSync('git',['rev-parse',sourceIdentityRevision+'^{commit}'],{encoding:'utf8'}).trim();
const sourceIdentityLabel=historicalFrameScope?'the change base':'committed HEAD';
const sourceIdentitySource=historicalFrameScope?comparisonSource:cp.execFileSync('git',['show',sourceIdentitySha+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
const raw=fs.readFileSync(path.join(ROOT,'fixtures','fiscal-load026','legacy.json'),'utf8'),fixture=JSON.parse(raw);
const APPROVED_RELEASE=Object.freeze({gameVer:'14.44',anchor:'T751'});
function declaredRelease026(source){
  const one=(pattern,label)=>{const matches=[...source.matchAll(pattern)];assert.equal(matches.length,1,'unique declared '+label);return matches[0][1];};
  return Object.freeze({gameVer:one(/^const GAME_VER='(\d+\.\d{2})';/gm,'GAME_VER'),anchor:one(/^const GAME_ANCHOR='(T\d+)';/gm,'GAME_ANCHOR')});
}
const RELEASE=declaredRelease026(head);
const approvedReleaseRaw=fs.readFileSync(path.join(ROOT,'fixtures','fiscal-load026','legacy-v14_44.expected.json'),'utf8'),approvedReleaseFixture=JSON.parse(approvedReleaseRaw);
// The pinned migration specimen remains independent evidence for 14.44.
// Later releases change only its declared writer metadata, never tested output.
const releaseFixture=RELEASE.gameVer===APPROVED_RELEASE.gameVer?approvedReleaseFixture:{...approvedReleaseFixture,gameVer:RELEASE.gameVer};
const releaseRaw=RELEASE.gameVer===APPROVED_RELEASE.gameVer?approvedReleaseRaw:JSON.stringify(releaseFixture);
// Expected writer metadata is declared independently of the tested output.
// Preserve every input key/value; only this approved release field may differ.
function releaseExpected026(input){assert(['14.43',RELEASE.gameVer].includes(input.gameVer),'declared input save version');return input.gameVer===RELEASE.gameVer?input:{...input,gameVer:RELEASE.gameVer};}
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const serialized=v=>JSON.stringify(canon(v));
function stateDiff(a,b,p='',out=[]){if(serialized(a)===serialized(b))return out;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))stateDiff(a[k],b[k],p?p+'.'+k:k,out);}else if(out.length<40)out.push({path:p,before:a,after:b});return out;}
function stateCheck(actual,expected,label='all serialized fields'){
  if(serialized(actual)!==serialized(expected))console.log('FISCAL026_DIFF '+JSON.stringify({label,differences:stateDiff(expected,actual)}));
  assert.equal(serialized(actual),serialized(expected),label);
}
const report={head:process.env.GITHUB_SHA,base:BASE,changeBase,release:RELEASE,frameScope:{sameHeadValve:true,sameVersionLoad:true,historicalBaseEquality:historicalFrameScope,historicalReason:historicalFrameScope?'the change base does not contain the scoped fiscal repair; retain independent-base pixel equality':'the change base already contains the fiscal repair; current art is checked before/after load and against its own fiscal valve'},fixture:{bytes:Buffer.byteLength(raw),sha256:hash(raw)},approvedReleaseExpected:{bytes:Buffer.byteLength(approvedReleaseRaw),sha256:hash(approvedReleaseRaw)},releaseExpected:{bytes:Buffer.byteLength(releaseRaw),sha256:hash(releaseRaw)},checks:[],failures:[],negative:[],migrations:[],frames:[]};
const check=(name,fn)=>{try{const detail=fn();report.checks.push({name,ok:true,...detail});console.log('GREEN '+name);return true;}catch(e){const failure={name,message:e.message.slice(0,1000)};report.failures.push(failure);console.error('RED '+JSON.stringify(failure));return false;}};
const expectRed=(name,actual,expected)=>{let first;try{stateCheck(actual,expected,'all serialized fields');}catch(e){first=e.message.split('\n')[0];}assert.equal(first,'all serialized fields',name+' must first fail the full-state guard');report.negative.push({name,first,differences:stateDiff(expected,actual)});};
const opt={port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>0.125',log:console.log};
async function session(name,source,fn,preScript=''){
  fs.writeFileSync(index,source);
  try{const r=await withGame({...opt,preScript:opt.preScript+';'+preScript},async({cdp})=>{const v=await fn(cdp);assert.equal(cdp.errors.length,0,'uncaught browser errors: '+cdp.errors.join('; '));return v;});assert(r.ok&&r.result,name+': '+r.fails.join('; '));return r.result;}
  finally{fs.writeFileSync(index,head);}
}
async function evaluate(cdp,fn,...args){return cdp.evalJs('('+fn.toString()+')('+args.map(a=>JSON.stringify(a)).join(',')+')');}
function roundtrip026(text,sandbox=false,passes=2){
  GV.setSpeed(0);
  if(sandbox&&!GV.dev516B().sandbox)GV.enterSandbox516B();
  if(!sandbox&&GV.dev516B().sandbox)GV.exitSandbox516B();
  const key='glimmerville.v1.s3'+(sandbox?'.sandbox516b':''),other='glimmerville.v1.s3'+(sandbox?'':'.sandbox516b');
  const inactive=localStorage.getItem(other),states=[JSON.parse(text)],status=[];
  localStorage.setItem(key,text);
  for(let i=0;i<passes;i++){
    if(!GV.load())throw Error('native load returned false');
    GV.setSpeed(0);GV.save();states.push(JSON.parse(GV.rawSave()));
    const f=GV.fiscal515();status.push({scope:GV.fiscalLoad026?.status(),ready:f.ready,city:f.city,infrastructure:f.infrastructure,assets:f.assets});
  }
  return{states,status,key,inactiveUnchanged:localStorage.getItem(other)===inactive};
}
function frames026(zoom=1.5,season=1){
  window.__waterF695=0;GV.setSpeed(0);GV.selectTool434('pan');document.getElementById('game').dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  const out=[];
  for(const mode of ['day','night'])for(let rot=0;rot<4;rot++){
    GV.britishWeather004(season,0,0);GV.setRot(rot);GV.art574.zoom574(zoom);GV.lookAt(7.5,4.5);
    const t=GV.art574.cycle574()*(mode==='day'?.5:.02);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();
    const canvas=document.getElementById('game');out.push({name:mode+'-r'+rot,w:canvas.width,h:canvas.height,data:canvas.toDataURL('image/png')});
  }
  return out;
}
function frameCheck026(actual,expected,label){
  assert.equal(actual.name,expected.name,label+' view');assert.equal(actual.w,expected.w,label+' width');assert.equal(actual.h,expected.h,label+' height');
  assert.equal(actual.data,expected.data,label);
}
function frameEvidence026(frame,file){
  const bytes=Buffer.from(frame.data.split(',')[1],'base64');if(file)fs.writeFileSync(path.join(OUT,file),bytes);
  return{name:frame.name,w:frame.w,h:frame.h,sha256:hash(bytes),bytes:bytes.length,...(file?{file}:{})};
}
function loadFrameEvidence026(result,prefix,saveAll=false){
  return{scene:result.scene,expected:result.expected,passes:result.passes.map(p=>({pass:p.pass,state:p.state,frames:p.frames.map((f,i)=>frameEvidence026(f,saveAll||i===0?prefix+'-p'+p.pass+'-'+f.name+'.png':null))})),before:result.before.map((f,i)=>frameEvidence026(f,saveAll||i===0?prefix+'-before-'+f.name+'.png':null))};
}
async function nativeLoadFrames026(cdp,passes=2){
  await cdp.evalJs('window.__armFiscalFrameFault026=false;window.__badLoadedView026=false;');
  await evaluate(cdp,roundtrip026,releaseRaw,true);
  // The legacy summer renderer fixture changes day to101 and uses an export
  // zoom1.5 that native load snaps to its discrete1.4 step. Keep that contract,
  // but construct this saved-state fixture at its original day and valid zoom.
  const scene={zoom:1.4,season:0,day:fixture.day},before=await evaluate(cdp,frames026,scene.zoom,scene.season);
  const text=await cdp.evalJs('(()=>{GV.save();return GV.rawSave();})()'),expected=JSON.parse(text),out=[];
  assert.equal(expected.day,scene.day,'render fixture does not advance the saved day');assert.equal(expected.cam.z,scene.zoom,'render input uses a native load-compatible zoom');
  await cdp.evalJs('window.__armFiscalFrameFault026=true;');
  for(let pass=1;pass<=passes;pass++){
    const round=await evaluate(cdp,roundtrip026,text,true,1),frames=await evaluate(cdp,frames026,scene.zoom,scene.season);
    out.push({pass,state:round.states[1],status:round.status[0],frames});
  }
  return{scene,expected,before,passes:out};
}
function assertLoadFrameState026(result,expectedPasses=2){
  assert.equal(result.expected.gameVer,RELEASE.gameVer,'same-version render input writer');assert.equal(result.before.length,8,'eight complete day/night views');
  assert.equal(result.passes.length,expectedPasses,'exact native load-frame round count');
  for(const p of result.passes){stateCheck(p.state,result.expected,'same-version render load all saved fields');assert.equal(p.frames.length,8,'eight complete loaded views');assert.deepEqual(p.status.scope,{depth:0,active:false});}
}
function badLoadFrameSource026(source){
  const loadAnchor='const ok=__load515(slot);',drawAnchor='Object.assign(window.GV,{art574:';
  assert.equal(source.split(loadAnchor).length,2,'unique native load-frame fault anchor');assert.equal(source.split(drawAnchor).length,2,'unique native renderer fault anchor');
  const wrongView='const __fiscalDrawFault026=vdraw574;vdraw574=function(o,b){return window.__badLoadedView026&&b&&b.k===24&&!b.ref&&b.v===2?0:__fiscalDrawFault026(o,b);};\n';
  return source.replace(loadAnchor,loadAnchor+'if(ok&&window.__armFiscalFrameFault026)window.__badLoadedView026=true;').replace(drawAnchor,wrongView+drawAnchor);
}
function normalLoadCheck026(loaded,normal){stateCheck(loaded,normal,'same-HEAD normal load/no-load equality');}
function badNormalSource026(source){
  const loadAnchor='const ok=__load515(slot);',dailyAnchor='extra=recurring+capture;',exportAnchor='Object.assign(window.GV,{art574:';
  for(const anchor of [loadAnchor,dailyAnchor,exportAnchor])assert.equal(source.split(anchor).length,2,'unique normal-load fault anchor');
  const reset='const __normalWorldFault026=window.GV.newWorldSeeded;window.GV.newWorldSeeded=function(...args){window.__normalLoadFault026=false;window.__normalArm026=true;return __normalWorldFault026.apply(this,args);};\n';
  return source.replace(loadAnchor,loadAnchor+'if(ok&&window.__normalArm026)window.__normalLoadFault026=true;').replace(dailyAnchor,'extra=recurring+capture+(window.__normalLoadFault026?1:0);').replace(exportAnchor,reset+exportAnchor);
}
function normal026(seed,loadBeforeNextDay=false){
  if(GV.dev516B().sandbox)GV.exitSandbox516B();GV.setDiff(1);GV.newWorldSeeded(seed);GV.setSpeed(0);GV.setDiff(1);
  // newWorldSeeded does not reset T515. Explicitly initialize this isolated
  // no-load fixture so prior native cases cannot contribute history/cursors.
  // Seed financial inputs before reset's existing forced refresh records its
  // first row; fin.net otherwise retains the previous fixture's daily cost.
  GV.fiscalSeedQA515();GV.fiscalReset515();GV.fiscalSeedQA515();GV.weather(0);
  const activated=['cadastreModernization','landValueCapture'].map(k=>({k,result:GV.fiscalProgramRawQA515(k,true,true)}));
  const snap=()=>({stats:GV.stats(),fiscal:GV.fiscalSaveState515(),city:GV.fiscal515().city,infrastructure:GV.fiscal515().infrastructure,assets:GV.fiscal515().assets});
  const before=snap(),completion=GV.fiscalInjectCompletionQA515(24,.7),duplicate=GV.fiscalDailySettlementQA515();
  const points=[{n:0,snapshot:snap()}];
  if(loadBeforeNextDay){GV.save();if(!GV.load())throw Error('load before next real tick');GV.setSpeed(0);}
  // The old schema does not serialize wxT. Give both continuations the same
  // existing native weather input; every state comparison below stays intact.
  GV.weather(0);
  for(const n of [1,6,7]){GV.step(n);points.push({n,snapshot:snap(),duplicate:GV.fiscalDailySettlementQA515()});}
  const beforeForce=GV.fiscalSaveState515(),force=GV.fiscalStep515(true),afterForce=GV.fiscalSaveState515();
  return{seed,activated,before,completion,duplicate,points,force:{historyBefore:beforeForce?.history.length,historyAfter:afterForce?.history.length,day:force.day,scope:GV.fiscalLoad026?.status()}};
}
function cadence026(text){
  GV.setSpeed(0);if(GV.dev516B().sandbox)GV.exitSandbox516B();const j=JSON.parse(text);j.fiscal515.lastAggregateDay=j.day;j.fiscal515.lastAssetScanDay=j.day;j.fiscal515.lastBacklogDay=j.day;j.fiscal515.lastSettlementDay=j.day;j.fiscal515.lastCompletionScanDay=j.day;
  localStorage.setItem('glimmerville.v1.s3',JSON.stringify(j));if(!GV.load())throw Error('cadence load');GV.setSpeed(0);
  const points=[];for(const offset of [0,6,7,13,14]){GV.setDay(j.day+offset);GV.fiscalStep515(false);const f=GV.fiscal515();points.push({offset,history:f.history.length,aggregate:f.lastAggregateDay,asset:f.lastAssetScanDay,backlog:f.lastBacklogDay});}
  return{day:j.day,initialHistory:j.fiscal515.history.length,points};
}
const clone=v=>JSON.parse(JSON.stringify(v));
function staticChecks(){
  assert.equal(hash(raw),'168d851165e275f3960483eadde80d2eb865f9502f3bd6ae728841519de6be12');
  assert.equal(fixture.gameVer,'14.43');assert.deepEqual(APPROVED_RELEASE,{gameVer:'14.44',anchor:'T751'});
  assert.deepEqual(approvedReleaseFixture,{...fixture,gameVer:'14.44'},'complete approved release fixture changes exactly one declared field');
  assert.deepEqual(stateDiff(fixture,approvedReleaseFixture),[{path:'gameVer',before:'14.43',after:'14.44'}]);
  assert.equal(hash(approvedReleaseRaw),'a309a1c546ef6989b73065f9aaec79e2e3e97b6e89ab3117aa5b78da473d2276');
  if(RELEASE.anchor===APPROVED_RELEASE.anchor)assert.equal(RELEASE.gameVer,APPROVED_RELEASE.gameVer,'T751 approved writer version');
  assert.deepEqual(releaseFixture,{...fixture,gameVer:RELEASE.gameVer},'complete expected save changes only declared writer metadata');
  assert(head.includes('id="startVersion456">v'+RELEASE.gameVer+' · '+RELEASE.anchor+'</span>'),'exact declared build metadata');
  for(const key of ['function fiscalSave515(', 'function fiscalLoad515(', 'function fiscalDailySettlement515(', 'function fiscalCompletionSettlement515(', 'const FISCAL_CADENCE515=']){
    const line=s=>s.split('\n').find(x=>x.startsWith(key));assert(line(head),key+' exists');assert.equal(line(head),line(sourceIdentitySource),key+' byte-identical relative to '+sourceIdentityLabel);
  }
  for(const file of ['fp.js','harness.js','gallery.js'])assert.equal(cp.execFileSync('git',['diff',sourceIdentitySha,'--',file],{encoding:'utf8'}),'',file+' unchanged relative to '+sourceIdentityLabel);
  // Legitimate art changes submit new baselines. Validate them against the
  // actual renderer with the unchanged guard, rather than freezing old bytes.
  const fpBase=path.join(OUT,'change-base-fp.json'),styleBase=path.join(OUT,'change-base-style.json');
  for(const [file,target] of [['fp.json',fpBase],['style.json',styleBase]])fs.writeFileSync(target,cp.execFileSync('git',['show',changeBase.sha+':'+file]));
  const fp=cp.spawnSync(process.execPath,[path.join(ROOT,'fp.js'),'--check','--report-base='+fpBase,'--report-base-style='+styleBase,'--dump='+path.join(OUT,'fp-rebake')],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024,env:{...process.env,GITHUB_STEP_SUMMARY:''}});
  fs.writeFileSync(path.join(OUT,'current-fp.txt'),(fp.stdout||'')+(fp.stderr||''));
  assert.equal(fp.status,0,'current renderer fingerprints match the committed baselines; see current-fp.txt');
  const sourceScope={mode:historicalFrameScope?'T751 change-base identity':'committed HEAD integrity',revision:sourceIdentitySha,patchIdentityPreserved:historicalFrameScope};
  report.sourceScope=sourceScope;return{changeBase,sourceScope,fingerprintCheck:fp.status};
}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 try{
  check('scoped serialization, settlement, cadence and guard source integrity',staticChecks);
  const old=await session('independent BASE',base,async cdp=>({load:await evaluate(cdp,roundtrip026,raw,true),frames:await evaluate(cdp,frames026),normal:await evaluate(cdp,normal026,31)}));
  check('BASE old defect is caught by the exact full-state guard',()=>{expectRed('unfixed BASE native load',old.load.states[1],fixture);assert(stateDiff(fixture,old.load.states[1]).some(x=>x.path.startsWith('fiscal515.history')));});
  const reference=changeBase.sha===BASE?old:await session('independent change-base reference',comparisonSource,async cdp=>{await evaluate(cdp,roundtrip026,raw,true);return{frames:await evaluate(cdp,frames026),normal:await evaluate(cdp,normal026,31)};});
  const positives=await session('HEAD native cases',head,async cdp=>{
    const result={cases:[],legacy:[],negative:[]};
    for(const sandbox of [false,true]){
      result.cases.push({name:'archived-original-'+(sandbox?'sandbox':'normal'),expected:fixture,actual:await evaluate(cdp,roundtrip026,raw,sandbox)});
      result.cases.push({name:'same-release-'+(sandbox?'sandbox':'normal'),expected:releaseFixture,actual:await evaluate(cdp,roundtrip026,releaseRaw,sandbox)});
      for(const shape of ['empty','full','zero','expired','future']){
        const j=clone(fixture),f=j.fiscal515;f.maintenanceBacklog=123.456;f.revenue={recurringAdmin:13.25,valueCapture:17.5,oneOffToday:7,recurringToday:11,totalCaptured:39};f.processedProjects=['QA026-old'];f.settlements=[{d:1,id:'DAY1',recurring:11,captured:7,total:18}];f.capitalLedger=[{d:1,id:'QA026-old',amount:23}];
        if(shape==='empty')f.history=[];
        if(shape==='full')f.history=Array.from({length:180},(_,i)=>({d:i,m:'preserved '+i,c:i%2?'good':'warn'}));
        if(['zero','expired','future'].includes(shape))for(const key of ['lastAggregateDay','lastBacklogDay','lastSettlementDay','lastAssetScanDay','lastCompletionScanDay'])f[key]=shape==='zero'?0:shape==='expired'?-999:4;
        result.cases.push({name:shape+'-'+(sandbox?'sandbox':'normal'),expected:j,actual:await evaluate(cdp,roundtrip026,JSON.stringify(j),sandbox)});
      }
    }
    for(const shape of ['missing','null']){const j=clone(fixture);if(shape==='missing')delete j.fiscal515;else j.fiscal515=null;result.legacy.push({name:shape,input:j,actual:await evaluate(cdp,roundtrip026,JSON.stringify(j),false,3)});}
    for(const change of ['money','appendHistory','removeHistory','cursor']){
      const j=clone(fixture);if(change==='money')j.money-=1;else if(change==='appendHistory')j.fiscal515.history.push({d:j.day,m:'negative extra row',c:'bad'});else if(change==='removeHistory')j.fiscal515.history.pop();else j.fiscal515.lastAssetScanDay-=1;
      result.negative.push({name:change,altered:await evaluate(cdp,roundtrip026,JSON.stringify(j),true),restored:await evaluate(cdp,roundtrip026,raw,true)});
    }
    await evaluate(cdp,roundtrip026,raw,true);result.frames=await evaluate(cdp,frames026);result.loadFrames=await nativeLoadFrames026(cdp);
    result.normal=await evaluate(cdp,normal026,31);result.loaded=await evaluate(cdp,normal026,31,true);result.cadence=await evaluate(cdp,cadence026,raw);
    result.metadata=await cdp.evalJs('({version:GV.ver(),start:document.getElementById("startVersion456").textContent.trim()})');
    return result;
  });
  for(const q of positives.cases)check('two native load/save rounds '+q.name,()=>{
    assert.equal(q.actual.inactiveUnchanged,true,'inactive slot changed');
    const expected=releaseExpected026(q.expected);
    for(let i=1;i<q.actual.states.length;i++)stateCheck(q.actual.states[i],expected);
    stateCheck(q.actual.states[2],q.actual.states[1],'same-version second save every field');
    for(const f of q.actual.status){assert.deepEqual(f.scope,{depth:0,active:false});assert.equal(f.ready,true);assert(Number.isFinite(f.city.structuralBalance));assert(Object.keys(f.infrastructure).length>=8);assert(Number.isFinite(f.assets.count));}
    return{passes:2,inputVersion:q.expected.gameVer,writerVersion:RELEASE.gameVer,stateSha256:hash(serialized(expected)),history:q.expected.fiscal515.history.length};
  });
  check('exact writer and build version metadata',()=>{assert.deepEqual(positives.metadata,{version:RELEASE.gameVer,start:'v'+RELEASE.gameVer+' · '+RELEASE.anchor});return positives.metadata;});
  for(const q of positives.legacy)check('legacy '+q.name+' migration then stable complete fields',()=>{
    // The unchanged native serializer intentionally omits an empty optional
    // fiscal field (index: `if(f515)data.fiscal515=f515`). Null and absence are
    // both legacy inputs; subsequent full-state comparisons stay unchanged.
    const migrated=q.actual.states[1],f=migrated.fiscal515;assert.equal(migrated.money,q.input.money);assert(f==null||f.history.length===0,'fabricated history');assert(f==null||f.settlements.length===0,'fabricated settlements');
    const expected={...releaseExpected026(q.input)};if(expected.fiscal515===null)delete expected.fiscal515;stateCheck(migrated,expected,'legacy full-field declared migration');
    stateCheck(q.actual.states[2],migrated);stateCheck(q.actual.states[3],migrated);const migration={name:q.name,differences:stateDiff(q.input,migrated)};report.migrations.push(migration);console.log('FISCAL026_MIGRATION '+JSON.stringify(migration));
  });
  for(const q of positives.negative)check('live saved-state negative and restore '+q.name,()=>{expectRed(q.name,q.altered.states[2],releaseFixture);const target=q.name==='money'?'money':q.name==='cursor'?'fiscal515.lastAssetScanDay':'fiscal515.history';assert(report.negative.at(-1).differences[0].path.startsWith(target),'first RED is the damaged data field');stateCheck(q.restored.states[2],releaseFixture);});
  check('scoped same-seed world and complete normal fiscal behavior',()=>{
    if(historicalFrameScope){const a=clone(positives.normal),b=clone(reference.normal);delete a.force.scope;delete b.force.scope;stateCheck(a,b,'normal simulation equality');}
    else normalLoadCheck026(positives.loaded,positives.normal);
    const normalScope={mode:historicalFrameScope?'T751 independent-base equality':'same-HEAD complete load/no-load equality',baseNormalSha256:hash(serialized(reference.normal)),headNormalSha256:hash(serialized(positives.normal)),baseDay1Money:reference.normal.points[1].snapshot.stats.money,headDay1Money:positives.normal.points[1].snapshot.stats.money};
    report.repairScope=repairScope;report.normalScope=normalScope;return{seed:31,horizons:[1,7,14],changeBase,normalScope};
  });
  check('nonzero recurring and completion, same-day deduplication, force remains live',()=>{
    const q=positives.normal;assert(q.activated.every(x=>x.result.ok),'QA policy activation');assert(q.completion.moneyAfter>q.completion.moneyBefore);assert(q.completion.captured>0,'completion must pay a nonzero amount');assert(q.completion.settlements.some(x=>x.recurring>0),'recurring must be nonzero');assert.equal(q.duplicate.value,0);for(const p of q.points.slice(1))assert.equal(p.duplicate.value,0);assert.equal(q.force.historyAfter,q.force.historyBefore+1);assert.deepEqual(q.force.scope,{depth:0,active:false});
    return{completion:q.completion,dailyPoints:q.points.map(p=>({day:p.snapshot.stats.day,money:p.snapshot.stats.money,cursor:p.snapshot.fiscal.lastSettlementDay,duplicate:p.duplicate?.value})),force:q.force};
  });
  check('load does not lose or duplicate the next normal daily settlement',()=>{stateCheck(positives.loaded.points,positives.normal.points,'next-day loaded/no-load equality');normalLoadCheck026(positives.loaded,positives.normal);assert(positives.loaded.points[1].snapshot.fiscal.lastSettlementDay>positives.loaded.points[0].snapshot.fiscal.lastSettlementDay);});
  check('7-day aggregation and 14-day asset cadence after native load',()=>{
    const q=positives.cadence;for(const p of q.points){assert.equal(p.aggregate,q.day+(p.offset>=14?14:p.offset>=7?7:0));assert.equal(p.asset,q.day+(p.offset>=14?14:0));assert.equal(p.history,q.initialHistory+(p.offset>=14?2:p.offset>=7?1:0));}return q;
  });
  const valve=await session('HEAD escape valve',head,async cdp=>({load:await evaluate(cdp,roundtrip026,raw,true),frames:await evaluate(cdp,frames026)}),'window.__noFiscalLoad026=true');
  check('escape valve restores independent BASE full serialized behavior',()=>{const expected=old.load.states.map((s,i)=>i===0?s:releaseExpected026(s));stateCheck(valve.load.states,expected);expectRed('HEAD valve restores loaded journal writes',valve.load.states[1],releaseFixture);assert(report.negative.at(-1).differences[0].path.startsWith('fiscal515.history'));});
  assert.equal(reference.frames.length,8);assert.equal(positives.frames.length,8);assert.equal(valve.frames.length,8);
  for(let i=0;i<reference.frames.length;i++)check('complete native frame '+reference.frames[i].name,()=>{
    const referenceFrame=reference.frames[i],headFrame=positives.frames[i],valveFrame=valve.frames[i];
    const evidence=frameEvidence026(referenceFrame,'change-base-'+referenceFrame.name+'.png');
    frameCheck026(valveFrame,headFrame,'same-HEAD fiscal valve full frame');
    if(historicalFrameScope){frameCheck026(headFrame,referenceFrame,'full frame head');frameCheck026(valveFrame,referenceFrame,'full frame valve');}
    for(const [kind,frame] of [['head',headFrame],['valve',valveFrame]])report.frames.push({...frameEvidence026(frame,kind+'-'+frame.name+'.png'),changeBase:changeBase.sha,changeBaseFrame:evidence,equalChangeBase:frame.data===referenceFrame.data});
  });
  check('same-version native load preserves all saved fields before rendering',()=>assertLoadFrameState026(positives.loadFrames));
  for(let i=0;i<positives.loadFrames.before.length;i++)check('same-version native full frame '+positives.loadFrames.before[i].name,()=>{
    for(const p of positives.loadFrames.passes)frameCheck026(p.frames[i],positives.loadFrames.before[i],'same-version full frame '+p.frames[i].name+' pass '+p.pass);
  });
  report.sameVersionFrames=loadFrameEvidence026(positives.loadFrames,'same-version',true);
  const badFrames=await session('source corrupts native appearance only after load',badLoadFrameSource026(head),cdp=>nativeLoadFrames026(cdp,1));
  check('native load picture fault first RED at complete same-version frame',()=>{
    assertLoadFrameState026(badFrames,1);let first;
    try{for(const p of badFrames.passes)for(let i=0;i<badFrames.before.length;i++)frameCheck026(p.frames[i],badFrames.before[i],'same-version full frame '+p.frames[i].name+' pass '+p.pass);}catch(e){first=e.message.split('\n')[0];}
    assert.equal(first,'same-version full frame day-r0 pass 1','native load appearance corruption must hit the real frame guard');
    report.negative.push({name:'source changes the native landmark appearance only after load',first,savedFieldsUnchanged:true});
  });
  report.badLoadFrames=loadFrameEvidence026(badFrames,'bad-load');
  const badNormal=await session('source changes daily simulation only after native load',badNormalSource026(head),async cdp=>({normal:await evaluate(cdp,normal026,31),loaded:await evaluate(cdp,normal026,31,true)}));
  check('post-load simulation fault first RED at complete normal guard',()=>{
    let first;try{normalLoadCheck026(badNormal.loaded,badNormal.normal);}catch(e){first=e.message.split('\n')[0];}
    assert.equal(first,'same-HEAD normal load/no-load equality');const differences=stateDiff(badNormal.normal,badNormal.loaded);assert(differences.some(d=>d.path.startsWith('points.')),'fault changes the next real simulated results');
    report.negative.push({name:'source adds one dollar per daily settlement after native load',first,differences});
  });report.badNormalSimulation=badNormal;
  const anchor='const ok=__load515(slot);',cleanup='finally{fiscalLoadDepth026=previous026;}';
  assert.equal(head.split(anchor).length,2,'fault injection anchor unique');assert.equal(head.split(cleanup).length,2,'cleanup anchor unique');
  const hook='if(window.__fault026==="throw"){window.__fault026="";throw new Error("fiscal026 controlled throw");}if(window.__fault026==="false"){window.__fault026="";return false;}if(window.__fault026==="nested"){window.__fault026="";window.__nested026=load(slot);window.__nestedDepth026=fiscalLoadDepth026;}';
  const fault=await session('controlled load exits',head.replace(anchor,hook+anchor),async cdp=>{
    const out=[];for(const kind of ['throw','false','nested']){
      const v=await evaluate(cdp,function(text,kind){GV.setSpeed(0);localStorage.setItem('glimmerville.v1.s3',text);window.__fault026=kind;let value,error;try{value=GV.load();}catch(e){error=e.message;}const status=GV.fiscalLoad026.status(),nestedDepth=window.__nestedDepth026;return{kind,value,error,status,nestedDepth,nested:window.__nested026};},raw,kind);
      v.recovery=await evaluate(cdp,roundtrip026,raw,false);v.normal=await evaluate(cdp,normal026,31);out.push(v);
    }return{out};
  });
  for(const q of fault.out)check('finally cleanup '+q.kind,()=>{assert.deepEqual(q.status,{depth:0,active:false});if(q.kind==='throw')assert.equal(q.error,'fiscal026 controlled throw');if(q.kind==='false')assert.equal(q.value,false);if(q.kind==='nested'){assert.equal(q.nested,true);assert.equal(q.nestedDepth,1);}stateCheck(q.recovery.states[2],releaseFixture);stateCheck(q.normal,positives.normal,'normal behavior after cleanup');});
  const leaked=await session('source leak negative',head.replace(cleanup,'finally{/* deliberately omitted in CI negative source */}'),async cdp=>({load:await evaluate(cdp,roundtrip026,raw,false),status:await cdp.evalJs('GV.fiscalLoad026.status()'),selftest:await cdp.evalJs('GV.fiscalLoad026.selftest()')}));
  check('leaked load scope first RED at cleanup guard',()=>{let first;try{assert.equal(leaked.status.depth,0,'scope cleanup');}catch(e){first=e.message.split('\n')[0];}assert.equal(first,'scope cleanup');assert.equal(leaked.selftest.ok,false);report.negative.push({name:'source omits finally restoration',first,depth:leaked.status.depth});});
  const writerAnchor='gameVer:GAME_VER,seed';assert.equal(head.split(writerAnchor).length,2,'writer metadata fault anchor unique');
  const wrongWriter=await session('source writes stale version metadata',head.replace(writerAnchor,"gameVer:'14.43',seed"),async cdp=>({load:await evaluate(cdp,roundtrip026,raw,false)}));
  check('stale writer version first RED at gameVer',()=>{expectRed('writer emits stale gameVer',wrongWriter.load.states[2],releaseFixture);assert.deepEqual(report.negative.at(-1).differences,[{path:'gameVer',before:RELEASE.gameVer,after:'14.43'}]);});
  const restored=await session('restored HEAD cleanup',head,async cdp=>({load:await evaluate(cdp,roundtrip026,raw,false),normal:await evaluate(cdp,normal026,31),loaded:await evaluate(cdp,normal026,31,true),loadFrames:await nativeLoadFrames026(cdp,1)}));
  check('source restoration GREEN',()=>{stateCheck(restored.load.states[2],releaseFixture);stateCheck(restored.normal,positives.normal);normalLoadCheck026(restored.loaded,restored.normal);assertLoadFrameState026(restored.loadFrames,1);for(const p of restored.loadFrames.passes)for(let i=0;i<restored.loadFrames.before.length;i++)frameCheck026(p.frames[i],restored.loadFrames.before[i],'restored same-version full frame');});
  report.restoredLoadFrames=loadFrameEvidence026(restored.loadFrames,'restored-load');
 }catch(e){report.failures.push({name:'probe infrastructure or unexpected exception',message:e.stack});console.error(e.stack);}
 finally{fs.writeFileSync(index,head);report.ok=report.failures.length===0;fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,negative:report.negative.length,failures:report.failures}));}
 process.exitCode=report.ok?0:1;
})().catch(e=>{console.error(e);process.exitCode=1;});

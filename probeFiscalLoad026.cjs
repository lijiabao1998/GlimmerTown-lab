'use strict';
// Native game execution belongs in GitHub Actions. Existing guards stay intact.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js');
const BASE='98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e',OUT=path.join(ROOT,'shots','fiscal026'),index=path.join(ROOT,'index.html');
const head=fs.readFileSync(index,'utf8'),base=cp.execFileSync('git',['show',BASE+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
const raw=fs.readFileSync(path.join(ROOT,'fixtures','fiscal-load026','legacy.json'),'utf8'),fixture=JSON.parse(raw);
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const serialized=v=>JSON.stringify(canon(v));
function stateDiff(a,b,p='',out=[]){if(serialized(a)===serialized(b))return out;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))stateDiff(a[k],b[k],p?p+'.'+k:k,out);}else if(out.length<40)out.push({path:p,before:a,after:b});return out;}
function stateCheck(actual,expected,label='all serialized fields'){
  if(serialized(actual)!==serialized(expected))console.log('FISCAL026_DIFF '+JSON.stringify({label,differences:stateDiff(expected,actual)}));
  assert.equal(serialized(actual),serialized(expected),label);
}
const report={head:process.env.GITHUB_SHA,base:BASE,fixture:{bytes:Buffer.byteLength(raw),sha256:hash(raw)},checks:[],failures:[],negative:[],migrations:[],frames:[]};
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
function frames026(){
  window.__waterF695=0;GV.setSpeed(0);GV.selectTool434('pan');document.getElementById('game').dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  const out=[];
  for(const mode of ['day','night'])for(let rot=0;rot<4;rot++){
    GV.britishWeather004(1,0,0);GV.setRot(rot);GV.art574.zoom574(1.5);GV.lookAt(7.5,4.5);
    const t=GV.art574.cycle574()*(mode==='day'?.5:.02);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();
    out.push({name:mode+'-r'+rot,data:document.getElementById('game').toDataURL('image/png')});
  }
  return out;
}
function normal026(seed,loadBeforeNextDay=false){
  if(GV.dev516B().sandbox)GV.exitSandbox516B();GV.setDiff(1);GV.newWorldSeeded(seed);GV.setSpeed(0);GV.setDiff(1);GV.fiscalSeedQA515();
  const activated=['cadastreModernization','landValueCapture'].map(k=>({k,result:GV.fiscalProgramRawQA515(k,true,true)}));
  const snap=()=>({stats:GV.stats(),fiscal:GV.fiscalSaveState515(),city:GV.fiscal515().city,infrastructure:GV.fiscal515().infrastructure,assets:GV.fiscal515().assets});
  const before=snap(),completion=GV.fiscalInjectCompletionQA515(24,.7),duplicate=GV.fiscalDailySettlementQA515();
  const points=[{n:0,snapshot:snap()}];
  if(loadBeforeNextDay){GV.save();if(!GV.load())throw Error('load before next real tick');GV.setSpeed(0);}
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
  for(const key of ['function fiscalSave515(', 'function fiscalLoad515(', 'function fiscalDailySettlement515(', 'function fiscalCompletionSettlement515(', 'const FISCAL_CADENCE515=']){
    const line=s=>s.split('\n').find(x=>x.startsWith(key));assert(line(head),key+' exists');assert.equal(line(head),line(base),key+' byte-identical');
  }
  for(const file of ['fp.json','style.json','fp.js','harness.js','gallery.js'])assert.equal(cp.execFileSync('git',['diff',BASE,'--',file],{encoding:'utf8'}),'',file+' unchanged');
}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 try{
  check('unchanged serialization, settlement functions, cadence and guards',staticChecks);
  const old=await session('independent BASE',base,async cdp=>({load:await evaluate(cdp,roundtrip026,raw,true),frames:await evaluate(cdp,frames026),normal:await evaluate(cdp,normal026,31)}));
  check('BASE old defect is caught by the exact full-state guard',()=>{expectRed('unfixed BASE native load',old.load.states[1],fixture);assert(stateDiff(fixture,old.load.states[1]).some(x=>x.path.startsWith('fiscal515.history')));});
  const positives=await session('HEAD native cases',head,async cdp=>{
    const result={cases:[],legacy:[],negative:[]};
    for(const sandbox of [false,true]){
      result.cases.push({name:'archived-original-'+(sandbox?'sandbox':'normal'),expected:fixture,actual:await evaluate(cdp,roundtrip026,raw,sandbox)});
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
    await evaluate(cdp,roundtrip026,raw,true);result.frames=await evaluate(cdp,frames026);
    result.normal=await evaluate(cdp,normal026,31);result.loaded=await evaluate(cdp,normal026,31,true);result.cadence=await evaluate(cdp,cadence026,raw);
    return result;
  });
  for(const q of positives.cases)check('two native load/save rounds '+q.name,()=>{
    assert.equal(q.actual.inactiveUnchanged,true,'inactive slot changed');
    for(let i=1;i<q.actual.states.length;i++)stateCheck(q.actual.states[i],q.expected);
    for(const f of q.actual.status){assert.deepEqual(f.scope,{depth:0,active:false});assert.equal(f.ready,true);assert(Number.isFinite(f.city.structuralBalance));assert(Object.keys(f.infrastructure).length>=8);assert(Number.isFinite(f.assets.count));}
    return{passes:2,stateSha256:hash(serialized(q.expected)),history:q.expected.fiscal515.history.length};
  });
  for(const q of positives.legacy)check('legacy '+q.name+' migration then stable complete fields',()=>{
    // The unchanged native serializer intentionally omits an empty optional
    // fiscal field (index: `if(f515)data.fiscal515=f515`). Null and absence are
    // both legacy inputs; subsequent full-state comparisons stay unchanged.
    const migrated=q.actual.states[1],f=migrated.fiscal515;assert.equal(migrated.money,q.input.money);assert(f==null||f.history.length===0,'fabricated history');assert(f==null||f.settlements.length===0,'fabricated settlements');
    stateCheck(q.actual.states[2],migrated);stateCheck(q.actual.states[3],migrated);report.migrations.push({name:q.name,differences:stateDiff(q.input,migrated)});
  });
  for(const q of positives.negative)check('live saved-state negative and restore '+q.name,()=>{expectRed(q.name,q.altered.states[2],fixture);stateCheck(q.restored.states[2],fixture);});
  check('same-seed normal no-load BASE/HEAD world and all fiscal fields',()=>{const a=clone(positives.normal),b=clone(old.normal);delete a.force.scope;delete b.force.scope;stateCheck(a,b,'normal simulation equality');return{seed:31,horizons:[1,7,14]};});
  check('nonzero recurring and completion, same-day deduplication, force remains live',()=>{
    const q=positives.normal;assert(q.activated.every(x=>x.result.ok),'QA policy activation');assert(q.completion.moneyAfter>q.completion.moneyBefore);assert(q.completion.captured>0,'completion must pay a nonzero amount');assert(q.completion.settlements.some(x=>x.recurring>0),'recurring must be nonzero');assert.equal(q.duplicate.value,0);for(const p of q.points.slice(1))assert.equal(p.duplicate.value,0);assert.equal(q.force.historyAfter,q.force.historyBefore+1);assert.deepEqual(q.force.scope,{depth:0,active:false});
  });
  check('load does not lose or duplicate the next normal daily settlement',()=>{stateCheck(positives.loaded.points,positives.normal.points,'next-day loaded/no-load equality');assert(positives.loaded.points[1].snapshot.fiscal.lastSettlementDay>positives.loaded.points[0].snapshot.fiscal.lastSettlementDay);});
  check('7-day aggregation and 14-day asset cadence after native load',()=>{
    const q=positives.cadence;for(const p of q.points){assert.equal(p.aggregate,q.day+(p.offset>=14?14:p.offset>=7?7:0));assert.equal(p.asset,q.day+(p.offset>=14?14:0));assert.equal(p.history,q.initialHistory+(p.offset>=14?2:p.offset>=7?1:0));}return q;
  });
  const valve=await session('HEAD escape valve',head,async cdp=>({load:await evaluate(cdp,roundtrip026,raw,true),frames:await evaluate(cdp,frames026)}),'window.__noFiscalLoad026=true');
  check('escape valve restores independent BASE full serialized behavior',()=>stateCheck(valve.load.states,old.load.states));
  for(let i=0;i<old.frames.length;i++)check('complete native frame '+old.frames[i].name,()=>{
    for(const [kind,list] of [['head',positives.frames],['valve',valve.frames]]){assert.equal(list[i].data,old.frames[i].data,'full frame '+kind);const bytes=Buffer.from(list[i].data.split(',')[1],'base64'),file=kind+'-'+list[i].name+'.png';fs.writeFileSync(path.join(OUT,file),bytes);report.frames.push({file,sha256:hash(bytes),bytes:bytes.length});}
  });
  const anchor='const ok=__load515(slot);',cleanup='finally{fiscalLoadDepth026=previous026;}';
  assert.equal(head.split(anchor).length,2,'fault injection anchor unique');assert.equal(head.split(cleanup).length,2,'cleanup anchor unique');
  const hook='if(window.__fault026==="throw"){window.__fault026="";throw new Error("fiscal026 controlled throw");}if(window.__fault026==="false"){window.__fault026="";return false;}if(window.__fault026==="nested"){window.__fault026="";window.__nested026=load(slot);window.__nestedDepth026=fiscalLoadDepth026;}';
  const fault=await session('controlled load exits',head.replace(anchor,hook+anchor),async cdp=>{
    const out=[];for(const kind of ['throw','false','nested']){
      const v=await evaluate(cdp,function(text,kind){GV.setSpeed(0);localStorage.setItem('glimmerville.v1.s3',text);window.__fault026=kind;let value,error;try{value=GV.load();}catch(e){error=e.message;}const status=GV.fiscalLoad026.status(),nestedDepth=window.__nestedDepth026;return{kind,value,error,status,nestedDepth,nested:window.__nested026};},raw,kind);
      v.recovery=await evaluate(cdp,roundtrip026,raw,false);v.normal=await evaluate(cdp,normal026,31);out.push(v);
    }return{out};
  });
  for(const q of fault.out)check('finally cleanup '+q.kind,()=>{assert.deepEqual(q.status,{depth:0,active:false});if(q.kind==='throw')assert.equal(q.error,'fiscal026 controlled throw');if(q.kind==='false')assert.equal(q.value,false);if(q.kind==='nested'){assert.equal(q.nested,true);assert.equal(q.nestedDepth,1);}stateCheck(q.recovery.states[2],fixture);stateCheck(q.normal,positives.normal,'normal behavior after cleanup');});
  const leaked=await session('source leak negative',head.replace(cleanup,'finally{/* deliberately omitted in CI negative source */}'),async cdp=>({load:await evaluate(cdp,roundtrip026,raw,false),status:await cdp.evalJs('GV.fiscalLoad026.status()'),selftest:await cdp.evalJs('GV.fiscalLoad026.selftest()')}));
  check('leaked load scope first RED at cleanup guard',()=>{let first;try{assert.equal(leaked.status.depth,0,'scope cleanup');}catch(e){first=e.message.split('\n')[0];}assert.equal(first,'scope cleanup');assert.equal(leaked.selftest.ok,false);report.negative.push({name:'source omits finally restoration',first,depth:leaked.status.depth});});
  const restored=await session('restored HEAD cleanup',head,async cdp=>({load:await evaluate(cdp,roundtrip026,raw,false),normal:await evaluate(cdp,normal026,31)}));
  check('source restoration GREEN',()=>{stateCheck(restored.load.states[2],fixture);stateCheck(restored.normal,positives.normal);});
 }catch(e){report.failures.push({name:'probe infrastructure or unexpected exception',message:e.stack});console.error(e.stack);}
 finally{fs.writeFileSync(index,head);report.ok=report.failures.length===0;fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,negative:report.negative.length,failures:report.failures}));}
 process.exitCode=report.ok?0:1;
})().catch(e=>{console.error(e);process.exitCode=1;});

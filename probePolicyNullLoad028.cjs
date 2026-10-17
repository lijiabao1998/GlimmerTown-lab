'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('GPT-028 native game checks run in GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js');
const BASE='58130eae1f5451a5f56142b5fab7b003b910155e',file=path.join(ROOT,'index.html'),OUT=path.join(ROOT,'shots','policy028');
const head=fs.readFileSync(file,'utf8'),base=cp.execFileSync('git',['show',BASE+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
const originalRaw=fs.readFileSync(path.join(ROOT,'fixtures','policy-null028','original-main-native.json'),'utf8');
const oldCall='policyLoad504(d.p504,d.p504===undefined);',newCall='policyLoad504(d.p504,legacyPolicyLoad028(d));',fixed=head.includes(newCall);
const defaults={taxR:1,taxC:1,taxI:1,curfew:false,recycle:false,tourPromo:false,ecoReg:false,freeTransit:false,schoolLunch:false,smokeDetect:false,indSubsidy:false,nightMarket:false,parkNight:false,insurance:false,integratedTransit:false,housingSubsidy:false,inclusionaryHousing:false,stationHousing:false,waterConserve:false,reclaimPriority:false,industrialPretreat:false,spongeCity:false,infrastructureStimulus:false,consumptionSupport:false,industrialRelief:false,completeStreets:false,parkingManagement:false,criticalReserve492:false,emergencyStockpile492:false};
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const text=v=>JSON.stringify(canon(v)),hash=v=>crypto.createHash('sha256').update(typeof v==='string'?v:text(v)).digest('hex');
function differences(a,b,p='',out=[]){if(text(a)===text(b))return out;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))differences(a[k],b[k],p?p+'.'+k:k,out);}else out.push({path:p,before:a,after:b});return out;}
function equal(actual,expected,label='complete native saved fields'){const d=differences(expected,actual);assert.equal(d.length,0,label+' '+JSON.stringify(d.slice(0,12)));}
const report={head:process.env.GITHUB_SHA,base:BASE,source:{base:hash(base),head:hash(head),fixed},fieldExclusions:[],checks:[],negative:[],failures:[],artifacts:[]};
const check=(name,fn)=>{try{const detail=fn();report.checks.push({name,ok:true,detail});console.log('POLICY028 GREEN '+name);}catch(e){report.failures.push({name,error:e.message.slice(0,2400)});console.error('POLICY028 RED '+name+' '+e.message.slice(0,2400));}};
function archive(name,value){const bytes=JSON.stringify(value,null,2)+'\n';fs.writeFileSync(path.join(OUT,name),bytes);report.artifacts.push({name,bytes:Buffer.byteLength(bytes),sha256:hash(bytes)});}
function firstRed(name,actual,expected,target){let first;try{equal(actual,expected);}catch(e){first=e.message;}assert(first,'negative must fail the complete saved-state guard');const d=differences(expected,actual);assert(d[0].path===target||d[0].path.startsWith(target+'.'),name+' first RED at '+target);report.negative.push({name,first:first.slice(0,1500),differences:d});return d;}
async function evaluate(cdp,fn,...args){return cdp.evalJs('('+fn.toString()+')('+args.map(a=>JSON.stringify(a)).join(',')+')');}
async function session(name,source,fn,preScript=''){
  fs.writeFileSync(file,source);
  try{const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125;'+preScript,log:console.log},async({cdp})=>{const v=await fn(cdp);assert.equal(cdp.errors.length,0,'uncaught browser errors '+cdp.errors.join('; '));return v;});assert(r.ok&&r.result,name+' native browser: '+r.fails.join('; '));return r.result;}
  finally{fs.writeFileSync(file,head);}
}
function makeFixture(seed=87){
  GV.setDiff(3);GV.newWorldSeeded(seed);GV.setSpeed(0);GV.save();const freshWorldInput=JSON.parse(GV.rawSave());if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const lots=[];
  for(let j=0;j<10;j++){
    let p;for(let y=4;y<66&&!p;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear){p={x,y};break;}}
    if(!p)throw Error('policy028 legal native lot');GV.selectTool434('landmark');const before=GV.devMoney516B(),quote=GV.placePreview459('landmark',p.x,p.y).cost;
    if(!GV.placeUndo('landmark',p.x,p.y))throw Error('policy028 paid placement');const spent=before-GV.devMoney516B();if(spent!==quote||spent<=0)throw Error('policy028 actual native price');
    if(!GV.undo()||!GV.redo()||!GV.placeUndo('doze',p.x+1,p.y+1)||!GV.undo())throw Error('policy028 undo/redo/ref demolition');lots.push({...p,quote,spent});
  }
  const last=lots.at(-1);if(!GV.undo()||!GV.redo()||!GV.placeUndo('doze',last.x+1,last.y+1)||!GV.undo())throw Error('policy028 final native ref transaction');
  GV.selectTool434('pan');GV.step(1);GV.weather(0);GV.setRot(0);GV.art574.zoom574(1.4);GV.lookAt(20,5);GV.save();
  return{seed,lots,freshWorldInput,input:JSON.parse(GV.rawSave())};
}
function roundtrip(input,sandbox=false,passes=2){
  GV.setSpeed(0);if(sandbox&&!GV.dev516B().sandbox)GV.enterSandbox516B();if(!sandbox&&GV.dev516B().sandbox)GV.exitSandbox516B();
  const key='glimmerville.v1.s3'+(sandbox?'.sandbox516b':''),other='glimmerville.v1.s3'+(sandbox?'':'.sandbox516b'),inactive=localStorage.getItem(other),states=[input];
  if(window.__policyTrace028)window.__policyTrace028=[];
  localStorage.setItem(key,JSON.stringify(input));
  for(let i=0;i<passes;i++){if(!GV.load())throw Error('policy028 native load returned false');GV.setSpeed(0);GV.save();states.push(JSON.parse(GV.rawSave()));}
  return{key,states,inactiveUnchanged:localStorage.getItem(other)===inactive,trace:window.__policyTrace028||null};
}
function frames(){
  window.__waterF695=0;GV.setSpeed(0);GV.selectTool434('pan');GV.weather(0);document.getElementById('game').dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  const out=[];for(const mode of['day','night'])for(let rot=0;rot<4;rot++){GV.setRot(rot);GV.art574.zoom574(1.4);GV.lookAt(20,5);const t=GV.art574.cycle574()*(mode==='day'?.5:.02);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();const c=document.getElementById('game');out.push({name:mode+'-r'+rot,w:c.width,h:c.height,data:c.toDataURL('image/png')});}GV.setRot(0);return out;
}
function frameFiles(rows,prefix){return rows.map(f=>{const b=Buffer.from(f.data.split(',')[1],'base64'),name=prefix+'-'+f.name+'.png';fs.writeFileSync(path.join(OUT,name),b);return{name,w:f.w,h:f.h,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};});}
function framePixels028(frame){
  const b=Buffer.from(frame.data.split(',')[1],'base64');assert.equal(b.subarray(1,4).toString(),'PNG');const w=b.readUInt32BE(16),h=b.readUInt32BE(20);assert.equal(b[24],8);assert.equal(b[25],6);assert.equal(b[28],0);const chunks=[];
  for(let p=8;p<b.length;){const n=b.readUInt32BE(p),kind=b.toString('ascii',p+4,p+8);if(kind==='IDAT')chunks.push(b.subarray(p+8,p+8+n));p+=12+n;}
  const raw=require('node:zlib').inflateSync(Buffer.concat(chunks)),stride=w*4,out=Buffer.alloc(stride*h);assert.equal(raw.length,(stride+1)*h);
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  let at=0;for(let y=0;y<h;y++){const f=raw[at++];assert(f>=0&&f<=4);for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=4?out[i-4]:0,u=y?out[i-stride]:0,c=y&&x>=4?out[i-stride-4]:0;out[i]=(raw[at++]+(f===0?0:f===1?a:f===2?u:f===3?Math.floor((a+u)/2):paeth(a,u,c)))&255;}}
  return{w,h,out};
}
function frameDiff028(a,b){const x=framePixels028(a),y=framePixels028(b);assert.equal(x.w,y.w);assert.equal(x.h,y.h);let pixels=0,minX=x.w,minY=x.h,maxX=-1,maxY=-1,maxChannel=0;const samples=[];for(let i=0;i<x.out.length;i+=4){let changed=false;for(let c=0;c<4;c++){const d=Math.abs(x.out[i+c]-y.out[i+c]);if(d)changed=true;maxChannel=Math.max(maxChannel,d);}if(changed){const px=(i/4)%x.w,py=Math.floor(i/4/x.w);pixels++;minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);if(samples.length<8)samples.push({x:px,y:py,before:[...x.out.subarray(i,i+4)],after:[...y.out.subarray(i,i+4)]});}}return{view:a.name,pixels,maxChannel,bbox:pixels?[minX,minY,maxX,maxY]:null,samples};}
async function verifyFrames028(input){
  const a=await frameSession(base,input,'BASE exact full frames'),b=await frameSession(head,input,'HEAD exact full frames');
  archive('frame-base-native-states.json',{expected:a.expected,rounds:a.rounds.map(q=>q.load)});archive('frame-head-native-states.json',{expected:b.expected,rounds:b.rounds.map(q=>q.load)});
  report.frames={base:frameFiles(a.before,'base'),head:frameFiles(b.before,'head'),rounds:b.rounds.map((q,i)=>frameFiles(q.views,'head-load-'+(i+1)))};
  report.frameDifferences={baseHead:a.before.map((f,i)=>frameDiff028(f,b.before[i])),headLoad:b.rounds.map(q=>q.views.map((f,i)=>frameDiff028(b.before[i],f))),savedModelBaseHead:differences(a.expected,b.expected),savedModelHeadLoads:b.rounds.map(q=>differences(b.expected,q.load.states[1]))};archive('frame-differences.json',report.frameDifferences);console.log('POLICY028_FRAME_DIFF '+JSON.stringify(report.frameDifferences));
  check('eight complete BASE-HEAD frames',()=>{assert.equal(a.before.length,8);equal(b.before,a.before,'whole native frame equality against BASE');});
  check('same-version loaded frame input preserves all native saved fields',()=>{for(const q of b.rounds)equal(q.load.states[1],b.expected);});
  check('eight complete native loaded frames in two rounds',()=>{for(const q of b.rounds)equal(q.views,b.before,'whole native frame equality after native load');});
}
async function frameSession(source,input,label){
  // One synchronous browser task gives every comparison the same visual
  // inputs; separate CDP awaits had allowed live animation frames in between.
  return session(label,source,cdp=>cdp.evalJs('(function(input){const roundtrip=('+roundtrip.toString()+'),frames=('+frames.toString()+');roundtrip(input,true,1);frames();const before=frames();GV.save();const expected=JSON.parse(GV.rawSave()),rounds=[];for(let i=0;i<2;i++){const load=roundtrip(expected,true,1),views=frames();rounds.push({load,views});}return{expected,before,rounds};})('+JSON.stringify(input)+')'));
}
function proceed(specimen,loadBeforeNextDay){
  if(GV.dev516B().sandbox)GV.exitSandbox516B();GV.setDiff(1);localStorage.setItem('glimmerville.v1.s3',JSON.stringify(specimen));if(!GV.load())throw Error('policy028 prepare common archived native input');GV.setSpeed(0);GV.save();const input=JSON.parse(GV.rawSave());
  if(loadBeforeNextDay&&!GV.load())throw Error('policy028 normal next-day load');GV.setSpeed(0);GV.weather(0);
  const points=[];for(const n of[1,6,7]){GV.step(n);GV.save();points.push({n,state:JSON.parse(GV.rawSave())});}return{input,points};
}
function staticScope(){
  assert.equal(base.split(oldCall).length,2,'one original native load call');
  assert.equal(hash(originalRaw),'bd34e6f3b22b70c4a935d7244f6e9884c55a7a5a3b89c5627e2176a8350975d5','exact unmodified main native input from original failing guard');
  let stripped=head.replace(/\/\* GPT-028 POLICY CLASSIFICATION BEGIN \*\/[\s\S]*?\/\* GPT-028 POLICY CLASSIFICATION END \*\/\n/,'').replace(/\/\* GPT-028 POLICY EXPORT BEGIN \*\/[\s\S]*?\/\* GPT-028 POLICY EXPORT END \*\/\n/,'').replace(newCall,oldCall);
  assert.equal(stripped,base,'all other product source bytes unchanged');
  for(const p of['fp.json','style.json','fp.js','harness.js','gallery.js','probeFiscalLoad026.cjs','.github/workflows/smoke.yml','AGENTS.md','AUTORUN.md','docs/DECISIONS.md'])assert.equal(cp.execFileSync('git',['diff',BASE,'--',p],{encoding:'utf8'}),'',p+' unchanged');
  const smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8').replace(/^      \['policyNullLoad028'.*\n/m,'');assert.equal(smoke,cp.execFileSync('git',['show',BASE+':smoke.js'],{encoding:'utf8'}),'all old smoke assertions unchanged');
  return{sourceOnlyClassification:fixed,fpFamilies:[],existingGuardsUnchanged:true};
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});check('source boundaries and unchanged existing acceptance',staticScope);
  if(process.argv.includes('--frames-only')){await verifyFrames028(JSON.parse(originalRaw));return;}
  const generated=await session('independent unmodified BASE fixture',base,cdp=>evaluate(cdp,makeFixture));archive('original-base-input.json',generated);
  assert.equal(generated.freshWorldInput.pol,null,'unmodified newWorld/native save explicitly writes null');
  // This is the exact original failing BASE save, independently captured
  // before its assertions, with no input edits or serialized-field exclusions.
  const input=JSON.parse(originalRaw);assert.equal(input.pol,null);
  archive('explicit-null-specimen.json',{origin:'run39038063179 job117411791145 unmodified BASE ar.tenTransactions.initialized',input,inputByteEdits:[]});
  assert(!Object.hasOwn(input,'p504'),'real native writer omits empty optional p504');assert.equal(generated.lots.length,10);
  const active={...input,pol:{...defaults,taxR:1.2,recycle:true}},missing={...input};delete missing.pol;
  const baseCases=await session('unmodified BASE native loads',base,async cdp=>{const rows=[];for(const sandbox of[false,true])for(const [name,j]of[['null',input],['missing',missing],['active',active]])rows.push({name,sandbox,result:await evaluate(cdp,roundtrip,j,sandbox,3)});return rows;});archive('base-complete-native-rounds.json',baseCases);
  for(const q of baseCases.filter(q=>q.name==='null'))check('unmodified BASE first RED '+q.sandbox,()=>{for(const s of q.result.states.slice(1)){const d=firstRed('unmodified BASE '+q.sandbox,s,input,'pol');assert.deepEqual(d,[{path:'pol',before:null,after:defaults}]);}return{onlyChangedField:'pol',passes:3};});
  const registry=structuredClone(baseCases.find(q=>q.name==='active'&&!q.sandbox).result.states[2]);
  const registryBase=await session('BASE existing registry',base,async cdp=>{const rows=[];for(const sandbox of[false,true])rows.push({name:'registry',sandbox,result:await evaluate(cdp,roundtrip,registry,sandbox)});return rows;});archive('base-existing-registry.json',registryBase);
  const allBase=[...baseCases,...registryBase];
  const next=await session('HEAD complete native cases',head,async cdp=>{const rows=[];for(const sandbox of[false,true])for(const[name,j]of[['null',input],['missing',missing],['active',active],['registry',registry]])rows.push({name,sandbox,result:await evaluate(cdp,roundtrip,j,sandbox,3)});return rows;});archive('head-complete-native-rounds.json',next);
  for(const q of next){
    const reference=allBase.find(b=>b.name===q.name&&b.sandbox===q.sandbox);
    check('complete native '+q.name+' '+(q.sandbox?'sandbox':'normal'),()=>{
      assert(q.result.inactiveUnchanged,'inactive slot unchanged');
      if(q.name==='null')for(const s of q.result.states.slice(1))equal(s,input);
      else{for(let i=1;i<q.result.states.length;i++)equal(q.result.states[i],reference.result.states[Math.min(i,reference.result.states.length-1)],'unchanged original legacy/registry result');
        if(q.name==='registry')for(const s of q.result.states.slice(1))equal(s,registry,'existing registry every field preserved');
        if(q.name==='active'){const programs=q.result.states[1].p504.programs;assert.deepEqual(programs.map(p=>p.key).sort(),['recycle','taxR']);for(const p of programs){assert.equal(p.status,'grandfathered');assert.equal(p.progress,1);assert.equal(p.source,'legacy');assert.equal(p.baseline,null);}assert.equal(q.result.states[1].pol.taxR,1.2);assert.equal(q.result.states[1].pol.recycle,true);}
      }
      return{passes:3,inputSHA256:hash(q.result.states[0]),outputSHA256:hash(q.result.states.at(-1)),differences:differences(q.result.states[0],q.result.states[1])};
    });
  }
  const traceAnchor='else if(legacy){mayorEnsurePolicy470A();';assert.equal(base.split(traceAnchor).length,2,'unique actual legacy initializer');
  const traced=base.replace(traceAnchor,'else if(legacy){window.__policyTrace028.push({before:pol,rawMissing:raw===undefined});mayorEnsurePolicy470A();window.__policyTrace028.push({after:JSON.parse(JSON.stringify(pol))});');
  const trace=await session('actual BASE legacy branch trace',traced,cdp=>evaluate(cdp,roundtrip,input,true,1),'window.__policyTrace028=[];');archive('base-actual-initializer-trace.json',trace);
  check('actual native legacy initializer causes the only pol difference',()=>{equal(trace.states[1],baseCases.find(q=>q.name==='null'&&q.sandbox).result.states[1]);assert.deepEqual(trace.trace,[{before:null,rawMissing:true},{after:defaults}]);return trace.trace;});
  if(fixed){
    const fault=head.replace(newCall,oldCall);assert.notEqual(fault,head);
    const broken=await session('live source restores original wrong classification',fault,cdp=>evaluate(cdp,roundtrip,input,true));archive('live-source-fault.json',broken);
    check('live native classification source fault first RED',()=>{firstRed('source restores original classification',broken.states[1],input,'pol');});
    const valve=await session('diagnostic escape restores old classification',head,cdp=>evaluate(cdp,roundtrip,input,true),'window.__noPolicyNullLoad028=true;');archive('diagnostic-escape-valve.json',valve);
    check('escape valve independently reproduces original bug',()=>{firstRed('escape restores original classification',valve.states[1],input,'pol');});
  }
  const restored=await session('restored HEAD native and real damage controls',head,async cdp=>{
    const stable=await evaluate(cdp,roundtrip,input,true),cash=await cdp.evalJs('GV.devMoney516B()');
    const damaged=await cdp.evalJs('(()=>{GV.capabilitySetMoney506('+JSON.stringify(input.money-1)+');GV.save();return JSON.parse(GV.rawSave());})()');
    await cdp.evalJs('GV.capabilitySetMoney506('+JSON.stringify(cash)+');');const recovery=await evaluate(cdp,roundtrip,input,true);
    const policy=structuredClone(registry);policy.pol.taxR=1.3;const policyDamage=await evaluate(cdp,roundtrip,policy,true);return{stable,damaged,recovery,policyDamage};
  });archive('restored-native-and-real-damage-controls.json',restored);
  check('restored production source complete native equality',()=>{for(const s of restored.stable.states.slice(1))equal(s,input);for(const s of restored.recovery.states.slice(1))equal(s,input);});
  check('real native money corruption first RED, restore GREEN',()=>{firstRed('native money API removes one dollar then saves',restored.damaged,input,'money');equal(restored.recovery.states[2],input);});
  check('real persisted policy corruption first RED',()=>{firstRed('native input changes taxR to 1.3 then loads/saves',restored.policyDamage.states[2],registry,'pol.taxR');});
  await verifyFrames028(input);
  const normal=[];
  for(const [label,source,load]of[['base-no-load',base,false],['head-no-load',head,false],['head-with-load',head,true]]){
    const data=await session(label,source,async cdp=>{const fixture=await evaluate(cdp,makeFixture);const continuation=await evaluate(cdp,proceed,input,load);return{fixture,continuation};});normal.push({label,data});archive(label+'-complete-model.json',data);
  }
  check('same-seed full model changes exactly the intended nullable policy state',()=>{
    const expected=structuredClone(normal[0].data),paths=['fixture.input.pol','continuation.input.pol',...Array.from({length:3},(_,i)=>'continuation.points.'+i+'.state.pol')];
    // Undo uses native load too. Its BASE output has the old defaults; the
    // independently specified corrected output must retain the saved null.
    // Check the exact before value, then compare every output field to this
    // declared correction. No field is masked or omitted.
    for(const p of paths){const keys=p.split('.'),last=keys.pop();let target=expected;for(const k of keys)target=target[k];assert.deepEqual(target[last],defaults,'original BASE wrong policy defaults at '+p);target[last]=null;}
    equal(normal[1].data,expected);return{seed:87,lots:10,horizons:[1,7,14],intentionalDifferences:differences(normal[0].data,expected),fieldExclusions:[]};
  });
  check('same-HEAD load/no-load all fields and next normal days equal',()=>{equal(normal[2].data,normal[1].data);return{horizons:[1,7,14],fieldExclusions:[]};});
})().catch(e=>{report.failures.push({name:'native probe infrastructure or unexpected assertion',error:e.stack});console.error(e.stack);}).finally(()=>{
  fs.writeFileSync(file,head);fs.mkdirSync(OUT,{recursive:true});archive('report.json',report);console.log('POLICY028 RESULT '+JSON.stringify({head:report.head,fixed,checks:report.checks.length,negative:report.negative.length,failures:report.failures}));
  for(const p of['original-base-input.json','base-actual-initializer-trace.json','report.json'])if(fs.existsSync(path.join(OUT,p))){const bytes=fs.readFileSync(path.join(OUT,p)),encoded=bytes.toString('base64');console.log('POLICY028_EVIDENCE_BEGIN '+JSON.stringify({name:p,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));for(let i=0;i<encoded.length;i+=4096)console.log('POLICY028_EVIDENCE_DATA '+encoded.slice(i,i+4096));console.log('POLICY028_EVIDENCE_END '+p);}
  if(report.failures.length)process.exitCode=1;
});

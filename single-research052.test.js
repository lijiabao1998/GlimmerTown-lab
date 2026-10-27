#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),assert=require('assert/strict'),cp=require('child_process');
const ROOT=__dirname;
const {hash,baseline,blockHash,block:source,projectCandidate052}=require('./single-research052-source.cjs');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const native=projectCandidate052(html);
const upstream=fs.readFileSync(path.join(ROOT,'docs/branch/GPT-050-qa/lab01-ff4a-runtime.js'),'utf8');
const core=fs.readFileSync(path.join(ROOT,'shadow-warehouse050.js'),'utf8');
const between=(s,a,b)=>{assert.equal(s.split(a).length,2);assert.equal(s.split(b).length,2);return s.split(a)[1].split(b)[0];};
const pure=between(source,'/* GPT-050 PURE FACTORY BEGIN */','/* GPT-050 PURE FACTORY END */');
assert.equal(pure,between(core,'/* GPT-050 PURE FACTORY BEGIN */','/* GPT-050 PURE FACTORY END */'),'S01 exact050 pure factory provenance');
assert.equal(hash(core),'0f028fb31c1a7d84ec1076758e46809110a031e5f96a9a167b16cc3863e1ec5e','S01 standalone050 unchanged');
const provenance=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/branch/GPT-052-qa/provenance.json'),'utf8'));
assert.equal(provenance.baselineIndexSha256,baseline);assert.equal(provenance.block052Sha256,blockHash);
console.log('SINGLE052 SOURCE '+JSON.stringify({head:process.env.GITHUB_SHA||null,candidateIndexSha256:hash(html),blockHash,baseline,provenance,
  historical049Test:hash(fs.readFileSync(path.join(ROOT,'docs/branch/GPT-049-qa/original-ff4a.test.js'))),
  historical050Test:hash(fs.readFileSync(path.join(ROOT,'docs/branch/GPT-050-qa/original-6d544c2.test.js')))}));
for(const [name,changed,target] of [
  ['missing',native,'unique052 begin'],['duplicate',html+source,'unique052 begin'],
  ['modified',html.replace('single-transient-research-ledger','forged-research-ledger'),'unchanged052 block'],
  ['moved',native+source,'exact052 insertion boundary'],
  ['boundary',html.replace('/* GPT-049 LAB01 END */\n'+source,'/* GPT-049 LAB01 END */\r\n'+source),'exact052 insertion boundary'],
  ['outside',html+'\n<!-- mutation -->','byte-exact T776 native input']
]){
  let red;try{projectCandidate052(changed);}catch(e){red=e;}
  assert.ok(red?.code==='ERR_ASSERTION'&&red.message.includes(target),'S01 first source failure '+name+' '+red?.message);
  console.log('SINGLE052 EXPECTED_RED '+JSON.stringify({name,guard:'S01',firstFailure:red.message.split('\n')[0],mutantHash:hash(changed)}));
  projectCandidate052(html);console.log('SINGLE052 RESTORED S01 '+name);
}
function runtime(code=source){
  const listeners=new Map();let rng=0,persistence=0,crypto=0,nativeCalls=[];
  class Node{
    constructor(tag){this.tagName=tag;this.children=[];this.style={};this.dataset={};this.handlers=new Map();this.textContent='';}
    setAttribute(k,v){this[k]=v;}
    appendChild(n){n.parent=this;this.children.push(n);return n;}
    append(...ns){ns.forEach(n=>this.appendChild(n));}
    replaceChildren(...ns){this.children=[];this.append(...ns);}
    remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
    addEventListener(k,f){if(!this.handlers.has(k))this.handlers.set(k,new Set());this.handlers.get(k).add(f);}
    removeEventListener(k,f){this.handlers.get(k)?.delete(f);}
  }
  const body=new Node('body'),find=(id,node=body)=>node.id===id?node:node.children.map(n=>find(id,n)).find(Boolean);
  const thrown=new Error('native exact throw'),window={GV:{},crypto:{getRandomValues(a){crypto++;a.fill(37);return a;}},
    addEventListener(k,f){if(!listeners.has(k))listeners.set(k,new Set());listeners.get(k).add(f);},removeEventListener(k,f){listeners.get(k)?.delete(f);}};
  const context={window,document:{body,createElement:t=>new Node(t)},tiles:[{t:2}],economy482:{ready:true,day:1,commodities:{food:{id:'food',production:9}}},
    day:1,seed:491,N:1,GAME_VER:'14.69',Uint8Array,console,R(){rng++;throw new Error('native RNG');}};
  context.Math=Object.create(Math);context.Math.random=()=>{rng++;throw new Error('Math.random');};
  for(const name of ['localStorage','sessionStorage','indexedDB'])for(const host of [context,window])Object.defineProperty(host,name,{get(){persistence++;throw new Error('persistence read');}});
  context.load=function(...args){nativeCalls.push({self:this,args,active:window.GV.singleResearch052?.snapshot().active});context.tiles=[{t:3}];if(args[0]==='throw')throw thrown;return args[0]==='partial'?false:'native-load';};
  context.newWorld=function(...args){nativeCalls.push({self:this,args,active:window.GV.singleResearch052?.snapshot().active});context.tiles=[{t:4}];if(args[0]==='throw')throw thrown;return 'native-world';};
  vm.createContext(context);vm.runInContext(upstream,context,{timeout:3000});const retired=window.GV.shadowCargo049;
  vm.runInContext(code,context,{timeout:3000});
  return {a:window.GV.singleResearch052,context,body,listeners,find,retired,thrown,nativeCalls,
    counts:()=>({rng,persistence,crypto}),hide:()=>[...(listeners.get('pagehide')||[])].forEach(f=>f()),
    click:id=>{const n=find(id);assert.ok(n,'click exists '+id);[...(n.handlers.get('click')||[])].forEach(f=>f());}};
}
const manifest=()=>({manifestId:'compat-20',provenance:'qa-fixture',commodityId:'food',total:20,source:'src',custodians:[{id:'src',location:'s'},{id:'dst',location:'d'}]});
function send(a,type,payload,extra={}){const s=a.snapshot().ledger;return a.command({eventId:'e'+s.revision,sessionId:s.sessionId,batchId:'A',type,expectedRevision:s.revision,payload,...extra});}
const guards={
  S02_OFF(code){const r=runtime(code);assert.equal(r.a.snapshot().active,false,'S02_OFF inactive');assert.equal(r.body.children.length,0,'S02_OFF no DOM');assert.equal(r.listeners.size,0,'S02_OFF no listeners');assert.deepEqual(r.counts(),{rng:0,persistence:0,crypto:0},'S02_OFF no native calls');},
  S03_single(code){const r=runtime(code),a=r.a;assert.equal(a.demo().ok,true);const before=JSON.stringify(a.snapshot());assert.equal(r.context.window.GV.shadowCargo049,a,'S03_single 049 alias');assert.equal(r.context.window.GV.shadowWarehouse050,a,'S03_single 050 alias');assert.equal(r.retired.snapshot().active,false,'S03_single original049 remains inactive');assert.equal(a.start(manifest()).code,'session-already-active','S03_single reject second start');assert.equal(a.demo().code,'session-already-active','S03_single no demo replacement');a.open();const s=JSON.stringify(a.snapshot().ledger);a.open();assert.equal(JSON.stringify(a.snapshot().ledger),s,'S03_single double-open preserves session');assert.equal(r.body.children.length,1,'S03_single one panel');assert.equal(r.listeners.get('pagehide').size,1,'S03_single one listener');assert.equal(a.snapshot().ledger.batches.length,2);assert.ok(before);},
  S04_capacity(code){const r=runtime(code),a=r.a;a.demo();a.open();const values=[a.snapshot().ledger.warehouse.used];for(const id of ['InA','InB','OutA','Retry']){r.click('singleResearch052'+id);const s=a.snapshot().ledger;values.push(s.warehouse.used);assert.equal(s.batches.reduce((n,b)=>n+b.qty,0)+s.unissued,20,'S04_capacity independent conservation');assert.equal(s.unissued,5,'S04_capacity remainder');assert.equal(s.batches.length,2,'S04_capacity no split or duplicate');}assert.deepEqual(values,[0,7,7,0,8],'S04_capacity exact sequence');assert.equal(a.snapshot().ledger.batches.find(b=>b.batchId==='batch-B').qty,8);},
  S05_compat(code){const r=runtime(code),a=r.context.window.GV.shadowCargo049;assert.equal(a.start(manifest()).ok,true);assert.equal(a.snapshot().ledger.warehouse,undefined,'S05_compat no capacity default');const c={eventId:'compat-create',sessionId:a.snapshot().ledger.sessionId,batchId:'A',type:'CREATE',expectedRevision:0,payload:{commodityId:'food',qty:7,source:'src',destination:'dst'}};const first=a.command(c),before=JSON.stringify(a.snapshot().ledger);assert.equal(first.ok,true);assert.deepEqual(a.command(c),first,'S05_compat exact replay');assert.equal(JSON.stringify(a.snapshot().ledger),before);for(const change of [{sessionId:'old'}, {expectedRevision:1},{batchId:'B'},{payload:{...c.payload,qty:8}}])assert.equal(a.command({...c,...change}).code,'event-conflict','S05_compat semantic event conflict');assert.equal(send(a,'HANDOFF',{owner:'src',location:'s',to:'dst'}).ok,true);assert.equal(send(a,'COMPLETE',{owner:'dst',location:'d'}).ok,true);assert.equal(a.snapshot().ledger.conservation.terminal,7);},
  S06_token(code){const r=runtime(code),a=r.a;const s=a.demo(),c={eventId:'old',sessionId:s.sessionId,batchId:'C',type:'CREATE',expectedRevision:2,payload:{commodityId:'food',qty:1,source:'research-source',destination:'research-receiver'}};a.end();a.demo();assert.notEqual(a.snapshot().ledger.sessionId,s.sessionId,'S06_token nonce sequence');const before=JSON.stringify(a.snapshot().ledger);assert.equal(a.command(c).code,'stale-session','S06_token stale rejects');assert.equal(JSON.stringify(a.snapshot().ledger),before);},
  S07_load(code){const r=runtime(code),a=r.a;for(const arg of ['ok','partial','throw']){a.demo();a.open();const target={tag:arg},n=r.nativeCalls.length;if(arg==='throw')assert.throws(()=>r.context.load.call(target,arg,7),e=>e===r.thrown,'S07_load exact throw');else assert.equal(r.context.load.call(target,arg,7),arg==='partial'?false:'native-load','S07_load exact return');const c=r.nativeCalls[n];assert.equal(c.active,false,'S07_load invalidates before native');assert.equal(c.self,target,'S07_load this');assert.deepEqual(c.args,[arg,7],'S07_load args');assert.equal(a.snapshot().active,false,'S07_load inactive');assert.equal(r.body.children.length,0,'S07_load panel removed');}},
  S08_world(code){const r=runtime(code),a=r.a;for(const arg of ['ok','throw']){a.demo();const target={};if(arg==='throw')assert.throws(()=>r.context.newWorld.call(target,arg,9),e=>e===r.thrown);else assert.equal(r.context.newWorld.call(target,arg,9),'native-world');assert.equal(a.snapshot().active,false,'S08_world invalidated');assert.equal(r.nativeCalls.at(-1).self,target,'S08_world this');assert.deepEqual(r.nativeCalls.at(-1).args,[arg,9]);assert.equal(r.nativeCalls.at(-1).active,false,'S08_world before native');}},
  S09_cleanup(code){const injected=code.replace('function removePanel(){',"function removePanel(){if(window.__cleanupFault052)throw new Error('injected cleanup fault');");const r=runtime(injected),a=r.a;a.demo();a.open();r.find('shadowCargo049Panel').remove=()=>{throw new Error('DOM failure');};r.context.window.removeEventListener=()=>{throw new Error('listener failure');};r.context.window.__cleanupFault052=true;assert.doesNotThrow(()=>assert.equal(r.context.load('partial'),false,'S09_cleanup native return after cleanup failure'),'S09_cleanup cleanup cannot poison delegate');assert.equal(a.snapshot().active,false,'S09_cleanup invalidated token first');assert.equal(a.command({}).code,'session-unavailable','S09_cleanup no old ledger');r.context.window.__cleanupFault052=false;a.demo();r.context.window.__cleanupFault052=true;assert.throws(()=>r.context.newWorld('throw'),e=>e===r.thrown,'S09_cleanup native throw preserved');},
  S10_pagehide(code){const r=runtime(code),a=r.a;a.demo();a.open();r.hide();assert.equal(a.snapshot().active,false,'S10_pagehide invalidates');assert.equal(r.body.children.length,0,'S10_pagehide panel removed');assert.equal(r.listeners.get('pagehide').size,0,'S10_pagehide listener removed');},
  S11_disable(code){const r=runtime(code),a=r.a;a.demo();a.open();a.disable();assert.equal(a.snapshot().active,false,'S11_disable ends');assert.equal(a.start(manifest()).code,'disabled','S11_disable start blocked');r.context.window.__noShadowCargo049=false;assert.equal(a.start(manifest()).ok,true,'S11_disable original049 flag restores');},
  S12_valve(code){const r=runtime(code),a=r.a;for(const flag of ['__noSingleResearch052','__noShadowCargo049','__noShadowWarehouse050']){a.demo();a.open();r.context.window[flag]=true;r.click('singleResearch052Retry');assert.equal(a.snapshot().active,false,'S12_valve empty-queue action invalidates '+flag);assert.equal(r.body.children.length,0);r.context.window[flag]=false;}},
  S13_identity(code){const r=runtime(code),a=r.a;a.demo();r.context.tiles=[{newWorld:true}];assert.equal(a.snapshot().active,false,'S13_identity tile identity invalidates');},
  S14_observation(code){const r=runtime(code),a=r.a;const o=a.nativeObservation();assert.equal(o.eligibleForMint,false,'S14_observation never mint');assert.equal(a.start({...manifest(),provenance:'production-receipt'}).code,'unsupported-production-receipt');o.food.production=888;assert.equal(r.context.economy482.commodities.food.production,9);r.context.day=2;assert.equal(a.nativeObservation().food,null,'S14_observation stale unavailable');},
  S15_copy(code){const r=runtime(code),a=r.a,m=manifest();a.start(m);m.total=999;const c={eventId:'copy',sessionId:a.snapshot().ledger.sessionId,batchId:'A',type:'CREATE',expectedRevision:0,payload:{commodityId:'food',qty:7,source:'src',destination:'dst'}};const result=a.command(c);assert.equal(result.ok,true);const before=JSON.stringify(a.snapshot().ledger);assert.equal(Object.isFrozen(result),false,'S15_copy returned mutable copy');c.payload.qty=999;result.ok=false;const s=a.snapshot();s.ledger.batches[0].owner='forged';assert.equal(JSON.stringify(a.snapshot().ledger),before,'S15_copy no shared references');let touched=0;Object.defineProperty(c.payload,'qty',{enumerable:true,get(){touched++;return 1;}});assert.equal(a.command(c).code,'invalid-data');assert.equal(touched,0,'S15_copy accessor not invoked');},
  S16_isolation(code){const r=runtime(code),a=r.a;assert.doesNotThrow(()=>{a.selftest();a.demo();a.open();r.click('singleResearch052InA');r.click('singleResearch052InB');a.nativeObservation();a.end();},'S16_isolation protected cycle');assert.equal(r.counts().rng,0,'S16_isolation RNG');assert.equal(r.counts().persistence,0,'S16_isolation storage');assert.equal(r.context.economy482.commodities.food.production,9);},
  S17_render(code){const r=runtime(code),a=r.a;a.demo();a.open();Object.defineProperty(r.find('singleResearch052Capacity'),'textContent',{set(){throw new Error('render failed');}});assert.doesNotThrow(()=>r.click('singleResearch052InA'),'S17_render committed action not poisoned');assert.equal(a.snapshot().ledger.warehouse.used,7,'S17_render authoritative custody retained');assert.equal(r.body.children.length,0,'S17_render broken panel removed');},
  S18_input(code){const r=runtime(code),a=r.a;a.demo();a.open();const p=r.find('shadowCargo049Panel');for(const type of ['pointerdown','pointermove','pointerup','pointercancel','touchstart','touchmove','touchend','wheel','click','keydown']){let stopped=0;const e={stopPropagation(){stopped++;},preventDefault(){},key:'x'};for(const f of p.handlers.get(type)||[])f(e);assert.equal(stopped,1,'S18_input blocks map '+type);}r.click('shadowCargo049End');assert.equal(r.body.children.length,0);},
  S19_UI(code){const r=runtime(code),a=r.a;a.demo();a.open();r.click('singleResearch052InA');assert.equal(r.find('singleResearch052Bar').value,7,'S19_UI real used value');assert.ok(r.find('singleResearch052Capacity').textContent.includes('7／10'),'S19_UI capacity text');r.click('singleResearch052InB');assert.ok(r.find('singleResearch052Status').textContent.includes('空間不足'),'S19_UI waiting text');assert.equal(a.snapshot().ledger.batches.find(b=>b.batchId==='batch-B').owner,'research-source','S19_UI waiting custody');r.click('shadowCargo049End');assert.equal(a.snapshot().active,false,'S19_UI End');},
  S20_bounds(code){const r=runtime(code),a=r.a;assert.equal(a.start(manifest(),undefined,{maxBatches:1,maxEvents:1,maxCustodians:2}).ok,true);assert.equal(send(a,'CREATE',{commodityId:'food',qty:7,source:'src',destination:'dst'}).ok,true);const before=JSON.stringify(a.snapshot().ledger);assert.equal(send(a,'CREATE',{commodityId:'food',qty:1,source:'src',destination:'dst'},{batchId:'B'}).code,'event-limit','S20_bounds event bound refuses');assert.equal(JSON.stringify(a.snapshot().ledger),before);},
};

guards.S21_FIFO=code=>{
 const r=runtime(code),a=r.a;a.demo();a.open();r.click('singleResearch052InA');r.click('singleResearch052InB');
 let st=a.snapshot().ledger;const waiting=st.batches.find(b=>b.batchId==='batch-B');
 assert.equal(waiting.owner,'research-source','S21_FIFO waiting owner');assert.equal(waiting.location,'research-source-shelf','S21_FIFO waiting location');assert.equal(waiting.qty,8,'S21_FIFO waiting qty');
 const c={eventId:'create-C',sessionId:st.sessionId,batchId:'C',type:'CREATE',expectedRevision:st.revision,payload:{commodityId:'food',qty:1,source:'research-source',destination:'research-receiver'}};
 assert.equal(a.command(c).ok,true);const entry=()=>{const q=a.snapshot().ledger;return {eventId:'request-C',sessionId:q.sessionId,batchId:'C',type:'WH_IN',expectedRevision:q.revision,payload:{owner:'research-source',location:'research-source-shelf'}};};
 const ec=entry();assert.equal(a.command(ec).outcome,'WAITING','S21_FIFO small arrival cannot leap head');
 st=a.snapshot().ledger;assert.deepEqual(Array.from(st.warehouse.waitingInbound,q=>q.batchId),['batch-B','C'],'S21_FIFO order');
 const before=JSON.stringify(st);assert.equal(a.command({...ec,eventId:'duplicate-C',expectedRevision:st.revision}).code,'duplicate-waiting','S21_FIFO duplicate queue');assert.equal(JSON.stringify(a.snapshot().ledger),before);
 r.click('singleResearch052OutA');st=a.snapshot().ledger;
 assert.equal(a.command({eventId:'leap',sessionId:st.sessionId,batchId:'C',type:'WH_RETRY',expectedRevision:st.revision,payload:{owner:'research-source',location:'research-source-shelf',requestId:'request-C'}}).code,'fifo-head-required','S21_FIFO retry cannot leap');
 r.click('singleResearch052Retry');st=a.snapshot().ledger;assert.equal(st.warehouse.used,8,'S21_FIFO head revalidated');assert.equal(st.batches.find(b=>b.batchId==='batch-B').qty,8,'S21_FIFO no split');
 const q=st.warehouse.waitingInbound[0];assert.equal(a.command({eventId:'bad-revision',sessionId:st.sessionId,batchId:'C',type:'WH_RETRY',expectedRevision:0,payload:{owner:q.owner,location:q.location,requestId:q.requestId}}).code,'stale-revision','S21_FIFO event revision');
};
guards.S22_malformed=code=>{
 const r=runtime(code),a=r.a;for(const change of [{total:NaN},{total:Infinity},{total:0},{total:1.5},{commodityId:'coal'},{provenance:'production-receipt'},{custodians:[]}])assert.equal(a.start({...manifest(),...change}).ok,false,'S22_malformed start refuses');
 assert.equal(a.start(manifest()).ok,true);const before=JSON.stringify(a.snapshot().ledger);
 for(const v of [null,[],{},'command',{eventId:'x',sessionId:'x',batchId:'x',type:'CREATE',expectedRevision:0,payload:null}]){assert.equal(a.command(v).ok,false,'S22_malformed command refuses');assert.equal(JSON.stringify(a.snapshot().ledger),before,'S22_malformed atomic rejection');}
};
for(const [id,fn] of Object.entries(guards)){fn(source);console.log('SINGLE052 GREEN '+id);}
function negative(name,id,from,to){
  assert.equal(source.split(from).length,2,'S00 exact mutation target '+name);const broken=source.replace(from,to);new vm.Script(broken);
  let red;try{guards[id](broken);}catch(e){red=e;}
  assert.ok(red?.code==='ERR_ASSERTION'&&red.message.includes(id),'S00 semantic first assertion '+name+' '+red?.stack);
  console.log('SINGLE052 EXPECTED_RED '+JSON.stringify({name,guard:id,firstFailure:red.message.split('\n')[0],mutantHash:hash(broken),restoredHash:hash(source)}));
  guards[id](source);console.log('SINGLE052 RESTORED '+id+' '+name);
}
for(const args of [
 ['OFF-listener','S02_OFF','window.GV.shadowCargo049=api;',"window.addEventListener('research',()=>{});window.GV.shadowCargo049=api;"],
 ['cleanup-delegate','S09_cleanup',"try{end('load-entry-research-cancelled');}catch(_){}","end('load-entry-research-cancelled');"],
 ['valves','S12_valve',"if(window.__noSingleResearch052===true||window.__noShadowCargo049===true||window.__noShadowWarehouse050===true)",'if(false)'],
 ['render-atomic','S17_render','if(panel)try{refresh();}catch(_){removePanel();}','if(panel)refresh();'],
 ['malformed-quantity','S22_malformed','const positive = value => Number.isSafeInteger(value) && value>0;','const positive = value => true;'],
 ['aliases','S03_single','window.GV.shadowWarehouse050=api;','window.GV.shadowWarehouse050={};'],
 ['capacity','S04_capacity',"const mayEnter=old.qty<=room && (c.type==='WH_RETRY' || whNext.waiting.length===0);",'const mayEnter=true;'],
 ['replay','S05_compat',"if(previous)return previous.signature===signature?copyData(previous.result):fail('event-conflict');","if(previous)return fail('broken-replay');"],
 ['token','S06_token',"if(c.sessionId!==sessionId)return fail('stale-session');",''],
 ['load','S07_load',"try{end('load-entry-research-cancelled');}catch(_){}",''],
 ['world','S08_world',"try{end('new-world-entry-research-cancelled');}catch(_){}",''],
 ['pagehide','S10_pagehide',"const hide=()=>end('pagehide-research-cancelled');",'const hide=()=>{};'],
 ['disable-compatibility','S11_disable','disable(){window.__noShadowCargo049=true;','disable(){window.__noSingleResearch052=true;'],
 ['world-identity','S13_identity',"if(engine&&world!==tiles)",'if(false)'],
 ['observation','S14_observation','eligibleForMint:false,productionReceiptSupported:false,food:','eligibleForMint:true,productionReceiptSupported:false,food:'],
 ['output-copy','S15_copy','return copyData(result);','return result;'],
 ['native-RNG','S16_isolation','const before=engine.snapshot().revision,result=engine.command(input);','R();const before=engine.snapshot().revision,result=engine.command(input);'],
 ['input','S18_input',"'pointerdown','pointerup','pointermove','pointercancel'","'pointerdown','pointerup','pointercancel'"],
 ['bar','S19_UI','view.bar.value=w.used','view.bar.value=0'],
 ['close','S19_UI',"()=>end('panel-ended-research-cancelled')",'()=>refresh()'],
 ['fifo-admission','S21_FIFO',"const mayEnter=old.qty<=room && (c.type==='WH_RETRY' || whNext.waiting.length===0);",'const mayEnter=old.qty<=room;'],
 ['bounds','S20_bounds',"if(ledger.events.size>=limits.maxEvents)return fail('event-limit');",'']
])negative(...args);
console.log('SINGLE052 PURE_RESULT '+JSON.stringify({guards:Object.keys(guards).length,semanticNegatives:22,sourceNegatives:6,head:process.env.GITHUB_SHA||null,scope:'full shipping052 source in VM; native Chrome is separate'}));

const roots=[];
const capStart=upstream.indexOf('    const nativeState=()=>JSON.stringify({');
const capEnd=upstream.indexOf('    const beforeNative=',capStart);
assert.ok(capStart>0&&capEnd>capStart,'S21 pinned native capture provenance');
const capture=upstream.slice(capStart,capEnd).replace('const nativeState=','window.__nativeCapture052=');
const observer=capture+String.raw`
window.__protected052=fn=>{
 const before=__nativeCapture052(),frame=document.getElementById('game').toDataURL(),originalR=R,originalRandom=Math.random;
 const originalSet=Storage.prototype.setItem,originalRemove=Storage.prototype.removeItem,originalClear=Storage.prototype.clear;
 let rng=0,storage=0,result;
 try{
  R=()=>{rng++;throw new Error('unexpected native RNG');};Math.random=()=>{rng++;throw new Error('unexpected random');};
  Storage.prototype.setItem=function(){storage++;throw new Error('unexpected storage write');};
  Storage.prototype.removeItem=function(){storage++;throw new Error('unexpected storage removal');};
  Storage.prototype.clear=function(){storage++;throw new Error('unexpected storage clear');};result=fn();
 }finally{R=originalR;Math.random=originalRandom;Storage.prototype.setItem=originalSet;Storage.prototype.removeItem=originalRemove;Storage.prototype.clear=originalClear;}
 return {result,nativeEqual:before===__nativeCapture052(),canvasEqual:frame===document.getElementById('game').toDataURL(),rng,storage};
};
window.__installVariant052=text=>{
 GV.singleResearch052?.end();window.__noShadowCargo049=false;window.__noSingleResearch052=false;window.__noShadowWarehouse050=false;
 load=qaLoadBase052;newWorld=qaWorldBase052;eval(text);return true;
};
`;
function qaRoot052(baselineOnly=false){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'glimmertown-lab052-current-'));roots.push(dir);
 for(const f of fs.readdirSync(ROOT)){
  if(['.git','.github','index.html','harness.js'].includes(f)||f.startsWith('.smoke-profile-'))continue;
  fs.symlinkSync(path.join(ROOT,f),path.join(dir,f),fs.statSync(path.join(ROOT,f)).isDirectory()?'dir':'file');
 }
 fs.copyFileSync(path.join(ROOT,'harness.js'),path.join(dir,'harness.js'));
 assert.equal(html.split(source).length,2,'S21 single current052 block');
 const insertion='const qaLoadBase052=load,qaWorldBase052=newWorld;\n'+(baselineOnly?'':source)+'\n'+observer+'\n';
 const composed=html.replace(source,insertion);
 fs.writeFileSync(path.join(dir,'index.html'),composed);
 console.log('SINGLE052 CHROME_INPUT '+JSON.stringify({head:process.env.GITHUB_SHA||null,shippingHash:hash(html),observedHash:hash(composed),role:baselineOnly?'byte-exact T776 baseline plus observer; install full052 synchronously for OFF A/B':'full candidate plus observation and mutant reinstalls; never historical projection',harnessHash:hash(fs.readFileSync(path.join(dir,'harness.js')))}));
 return dir;
}

async function baselineOffBrowser(){
 const dir=qaRoot052(true),{withGame}=require(path.join(dir,'harness.js'));
 const result=await withGame({port:8199,timeout:300,fresh:true,log:s=>console.log('SINGLE052 OFF_AB '+s)},async({cdp})=>{
  await cdp.evalJs('GV.setSpeed(0);GV.newWorldSeeded(491);GV.setSpeed(0);GV.setVisT(55);GV.forceDraw();true');
  const observedSeed=await cdp.evalJs('GV.shadowCargo049.nativeObservation().seed');
  const probe=async code=>cdp.evalJs(`__protected052(()=>{
   const beforeDOM=document.body.innerHTML,oldAdd=window.addEventListener,oldRemove=window.removeEventListener;let added=0,removed=0;
   window.addEventListener=function(...args){added++;return oldAdd.apply(this,args);};window.removeEventListener=function(...args){removed++;return oldRemove.apply(this,args);};
   const seed=${JSON.stringify(observedSeed)};try{__installVariant052(${JSON.stringify(code)});window.__noSingleResearch052=true;
    const s=GV.singleResearch052.snapshot();return {active:s.active,ledger:s.ledger,noDOM:document.body.innerHTML===beforeDOM,added,removed,seed};
   }finally{window.addEventListener=oldAdd;window.removeEventListener=oldRemove;}
  })`);
  const validate=proof=>{
  assert.equal(proof.nativeEqual,true,'S23_OFF_AB T776 and newly installed full052 native state equal');
  assert.equal(proof.canvasEqual,true,'S23_OFF_AB T776 and full052 entire canvas bytes equal');
  assert.equal(proof.rng,0,'S23_OFF_AB no RNG');assert.equal(proof.storage,0,'S23_OFF_AB no storage');
  assert.equal(proof.result.active,false);assert.equal(proof.result.ledger,null);assert.equal(proof.result.noDOM,true,'S23_OFF_AB no DOM');
  assert.equal(proof.result.added,0,'S23_OFF_AB no event registration');assert.equal(proof.result.removed,0,'S23_OFF_AB no event removal');
  };
  const from='window.GV.shadowCargo049=api;';assert.equal(source.split(from).length,2,'S23_OFF_AB exact mutation');
  const broken=source.replace(from,"const faultNode=document.createElement('aside');faultNode.id='off052Mutant';document.body.appendChild(faultNode);"+from);new vm.Script(broken);
  const bad=await probe(broken);let red;try{validate(bad);}catch(e){red=e;}
  assert.ok(red?.code==='ERR_ASSERTION'&&red.message.includes('S23_OFF_AB no DOM'),'S23_OFF_AB semantic first failure '+red?.message);
  console.log('SINGLE052 EXPECTED_RED '+JSON.stringify({guard:'S23_OFF_AB',firstFailure:red.message.split('\n')[0],mutantHash:hash(broken),restoredHash:hash(source)}));
  await cdp.evalJs("document.getElementById('off052Mutant').remove();true");
  const proof=await probe(source);validate(proof);console.log('SINGLE052 RESTORED S23_OFF_AB');
  console.log('SINGLE052 OFF_AB_RESULT '+JSON.stringify({baselineHash:baseline,candidateHash:hash(html),mode:'same seeded live native page, synchronous exact052 installation, OFF; avoids clocks between pages',proof}));
  assert.equal(cdp.errors.length,0,'S23_OFF_AB clean console');return {ok:true};
 });
 assert.equal(result.ok,true,'S23_OFF_AB browser '+JSON.stringify(result.fails));
}
async function browser() {
  const dir=qaRoot052();
  const {withGame,sleep,waitFor}=require(path.join(dir,'harness.js'));
  const result=await withGame({port:8199,timeout:300,fresh:true,log:s=>console.log('SINGLE052 CHROME '+s)},async({cdp})=>{
    await cdp.evalJs('GV.setSpeed(0); true');
    const run=code=>cdp.evalJs(code);
    const proof=await run(`__protected052(()=>{
      const a=GV.singleResearch052,checks=[],add=(name,ok)=>{checks.push({name,ok:!!ok});if(!ok)throw new Error(name);};
      add('W09 default off no state or DOM',!a.snapshot().active&&!document.getElementById('shadowCargo049Panel'));
      add('S03 aliases share one authority',GV.shadowCargo049===a&&GV.shadowWarehouse050===a);
      add('W02 real factory selftest',a.selftest().ok);
      add('W09 explicit demo',a.demo().ok);add('W10 real open',a.open().ok);add('W10 repeated open singleton',a.open().ok&&document.querySelectorAll('#shadowCargo049Panel').length===1);
      const values=[],observe=()=>{const s=a.snapshot().ledger,w=s.warehouse;const used=s.batches.filter(b=>b.owner===w.id).reduce((n,b)=>n+b.qty,0);add('W07 independent conservation',s.unissued+s.batches.reduce((n,b)=>n+b.qty,0)===20);add('W02 independent capacity',w.used===used&&used>=0&&used<=10);values.push(used);};
      observe();for(const id of ['InA','InB','OutA','Retry']){document.getElementById('singleResearch052'+id).click();observe();}
      add('W02 required sequence',JSON.stringify(values)==='[0,7,7,0,8]');
      add('W03 A and B still unique',a.snapshot().ledger.batches.length===2);
      a.end();window.__noShadowCargo049=true;add('W09 OFF rejects demo',!a.demo().ok);window.__noShadowCargo049=false;
      return {checks,capacity:values,warning:a.warning};
    })`);
    assert.equal(proof.nativeEqual,true,'W09 enabled and off native/economy/traffic/labor/dirty state changed');
    assert.equal(proof.canvasEqual,true,'W09 synchronous full native canvas changed');
    assert.equal(proof.rng,0,'W09 RNG calls');assert.equal(proof.storage,0,'W09 storage writes');
    console.log('SINGLE052 NATIVE_ISOLATION '+JSON.stringify(proof));
    async function uiMutant(id,from,to,probe) {
      assert.equal(source.split(from).length,2,'unique UI mutation '+id);
      const broken=source.replace(from,to);
      await run('__installVariant052('+JSON.stringify(broken)+')');
      let failed=null;try { await probe(); }catch(e){failed=e;}
      assert.ok(failed,'W10 mutant escaped '+id);
      assert.equal(failed.code,'ERR_ASSERTION','W10 mutant must first fail its independent assertion: '+id+' '+failed.message);
      assert.ok(failed.message.includes(id),'W10 wrong first guard '+id+' '+failed.message);
      console.log('SINGLE052 EXPECTED_RED '+JSON.stringify({guard:id,sourceHash:hash(broken),firstFailure:failed.message.split('\n')[0],restoredHash:hash(source)}));
      await run('__installVariant052('+JSON.stringify(source)+')');
      await probe();await run('GV.singleResearch052.end(); true');
      console.log('SINGLE052 RESTORED '+id);
    }
    const setup=async()=>run(`(()=>{const a=GV.singleResearch052;a.end();if(!a.demo().ok||!a.open().ok)throw new Error('UI setup');return true;})()`);
    await uiMutant('W10-bar','view.bar.value=w.used','view.bar.value=0',async()=>{
      await setup();await run("document.getElementById('singleResearch052InA').click(); true");
      assert.equal(await run("document.getElementById('singleResearch052Bar').value"),7,'W10-bar actual occupied7');
    });
    await uiMutant('W10-capacity-text',"'QA 研究容量：'+w.used","'QA 研究容量：'+0",async()=>{
      await setup();await run("document.getElementById('singleResearch052InA').click(); true");
      assert.ok((await run("document.getElementById('singleResearch052Capacity').textContent")).includes('7／10'),'W10-capacity-text');
    });
    await uiMutant('W10-wait-text',"'空間不足，等待出庫'","'可接貨'",async()=>{
      await setup();await run("document.getElementById('singleResearch052InA').click(); document.getElementById('singleResearch052InB').click(); true");
      assert.ok((await run("document.getElementById('singleResearch052Status').textContent")).includes('空間不足'),'W10-wait-text');
    });
    await uiMutant('W10-button',"=>operation('WH_IN','batch-A')","=>operation('WH_IN','batch-B')",async()=>{
      await setup();await run("document.getElementById('singleResearch052InA').click(); true");
      const s=await run('GV.singleResearch052.snapshot().ledger');
      assert.equal(s.batches.find(b=>b.batchId==='batch-A').owner,s.warehouse.id,'W10-button A actual custody');
    });
    await uiMutant('W10-close',"()=>end('panel-ended-research-cancelled')","()=>refresh()",async()=>{
      await setup();await run("document.getElementById('shadowCargo049End').click(); true");
      assert.equal(await run("!!document.getElementById('shadowCargo049Panel')"),false,'W10-close panel removed');
    });
    await uiMutant('W10-details',"details.append(summary,json);","details.open=true;details.append(summary,json);",async()=>{
      await setup();assert.equal(await run("document.getElementById('singleResearch052Details').open"),false,'W10-details collapsed initially');
    });

    await uiMutant('W10-full-state',"w.free===0?'倉庫已滿，等待出庫':'可接收研究貨物'","'可接收研究貨物'",async()=>{
      await run(`(()=>{const a=GV.singleResearch052;a.end();const m={manifestId:'full-ui',provenance:'qa-fixture',commodityId:'food',total:20,source:'src',custodians:[{id:'src',location:'s'},{id:'wh',location:'w'},{id:'dst',location:'d'}]};const r=a.start(m,{id:'wh',commodityId:'food',capacity:10,maxWaiting:8});if(!r.ok)throw new Error('full setup');a.command({eventId:'full-create',sessionId:r.sessionId,batchId:'batch-A',type:'CREATE',expectedRevision:0,payload:{commodityId:'food',qty:10,source:'src',destination:'dst'}});a.open();document.getElementById('singleResearch052InA').click();return true;})()`);
      assert.ok((await run("document.getElementById('singleResearch052Status').textContent")).includes('倉庫已滿'),'W10-full-state full warehouse not advertised available');
      assert.ok((await run("document.getElementById('singleResearch052InA').textContent")).includes('10'),'W10-full-state quantity derived, not fixed7');
    });

    async function click(id,selector=false) {
      const p=await run(`(()=>{const e=document.${selector?'querySelector':'getElementById'}(${JSON.stringify(id)}),r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})()`);
      assert.equal(p.hit,true,'W10 actual click target visible '+id);
      await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});
      await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1});
      await sleep(40);
    }
    const screenshots=[];
    async function shot(name,state) {
      const png=await cdp.send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(png.data,'base64');
      const file='smoke-single052-'+process.pid+'-'+name+'.png';fs.writeFileSync(path.join(ROOT,'shots',file),bytes);
      const receipt={file,sha256:hash(bytes),bytes:bytes.length,state,role:'full-current052-candidate-with-observer-only',head:process.env.GITHUB_SHA||null};
      screenshots.push(receipt);console.log('SINGLE052 SCREENSHOT '+JSON.stringify(receipt));
    }
    const stages=[['initial',0,0],['A-in',7,0,'InA'],['B-wait',7,1,'InB'],['A-out',0,1,'OutA'],['B-resumed',8,0,'Retry'],['ended',null,0,'End']];
    for(const [layout,width,height,mobile] of [['desktop',1280,900,false],['mobile',390,844,true]])for(const [light,t] of [['day',55],['night',90]]) {
      await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
      await run(`GV.setVisT(${t});GV.forceDraw();GV.singleResearch052.end();GV.singleResearch052.demo();GV.singleResearch052.open();true`);await sleep(80);
      let ids=null;
      for(const [name,used,waiting,button] of stages) {
        if(button)await click(button==='End'?'shadowCargo049End':'singleResearch052'+button);
        const s=await run('GV.singleResearch052.snapshot()');
        if(used===null) {
          assert.equal(s.active,false,'W08 ended');assert.equal(s.ledger,null,'W08 no retained ledger');
          assert.equal(s.ended.cancelled,20,'W08 cancelled not delivered');assert.equal(await run("!!document.getElementById('shadowCargo049Panel')"),false,'W10 closed DOM');
        }else{
          const w=s.ledger.warehouse,bs=s.ledger.batches;
          assert.equal(w.used,used,'W02 rendered sequence');assert.equal(w.free,10-used);assert.equal(w.waitingInbound.length,waiting);
          assert.equal(bs.filter(b=>b.owner===w.id).reduce((n,b)=>n+b.qty,0),used,'W02 actual custody-derived used');
          assert.equal(s.ledger.unissued,5);assert.equal(bs.reduce((n,b)=>n+b.qty,0)+s.ledger.unissued,20,'W07 independent qty sum');
          const identity=bs.map(b=>[b.batchId,b.qty,b.source,b.destination]);if(ids)assert.deepEqual(identity,ids,'W03 immutable batch identity');else ids=identity;
          if(name==='B-wait')assert.equal(bs.find(b=>b.batchId==='batch-B').owner,'research-source','W03 waiting keeps source');
          if(name==='A-out')assert.equal(bs.find(b=>b.batchId==='batch-A').owner,'research-receiver','W03 out retains cargo at legal receiver');
          const ui=await run(`(()=>{const p=document.getElementById('shadowCargo049Panel'),r=p.getBoundingClientRect(),b=document.getElementById('shadowCargo049End').getBoundingClientRect();return{within:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,button:b.height>=44&&b.bottom<=innerHeight,warning:p.textContent.includes('未保存，重載即遺失'),bar:document.getElementById('singleResearch052Bar').value,details:document.getElementById('singleResearch052Details').open,text:document.getElementById('singleResearch052Capacity').textContent};})()`);
          assert.equal(ui.within,true,'W10 viewport containment');assert.equal(ui.button,true,'W10 end reachable');assert.equal(ui.warning,true);assert.equal(ui.bar,used);assert.ok(ui.text.includes(used+'／10'));assert.equal(ui.details,false,'W10 JSON not dominating mobile');
        }
        await shot(layout+'-'+light+'-'+name,{active:s.active,used,waiting,unissued:s.ledger?.unissued??null});
        if(name==='B-wait') {
          await run(`document.getElementById('singleResearch052Details').open=true;document.getElementById('singleResearch052Scroll').scrollTop=10000;true`);
          const cam=await run('GV.camera436()');
          const rect=await run(`(()=>{const e=document.getElementById('singleResearch052JSON'),p=document.getElementById('singleResearch052Scroll'),r=e.getBoundingClientRect(),q=p.getBoundingClientRect();e.scrollTop=0;const top=Math.max(r.top,q.top,0),bottom=Math.min(r.bottom,q.bottom,innerHeight),x=r.left+30,y=(top+bottom)/2;return{x,y,visible:bottom>top,hit:e.contains(document.elementFromPoint(x,y)),before:e.scrollTop};})()`);
          assert.equal(rect.visible,true,'W10 JSON visible wheel target');assert.equal(rect.hit,true,'W10 wheel target hits JSON');assert.equal(rect.before,0,'W10 JSON starts at zero');
          await cdp.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:rect.x,y:rect.y,deltaX:0,deltaY:420});await sleep(80);
          const scroll=await run(`(()=>{const j=document.getElementById('singleResearch052JSON');return{jsonOverflow:j.scrollHeight>j.clientHeight,after:j.scrollTop,cam:GV.camera436()};})()`);
          assert.equal(scroll.jsonOverflow,true,'W10 expandable diagnostic JSON');assert.ok(scroll.after>rect.before,'W10 actual wheel increases JSON scroll');assert.equal(scroll.cam.z,cam.z,'W10 panel wheel does not zoom city');
          console.log('SINGLE052 REAL_SCROLL '+JSON.stringify({layout,light,before:rect.before,after:scroll.after,hit:rect.hit,cameraUnchanged:scroll.cam.z===cam.z}));
          await run("document.getElementById('singleResearch052Details').open=false;document.getElementById('singleResearch052Scroll').scrollTop=0;true");
        }
      }
    }
    console.log('SINGLE052 SEQUENCE '+JSON.stringify({expectedUsed:[0,7,7,0,8],initial:20,unissued:5,A:7,B:8,split:false,physicalTransport:false}));
    const legacyRaw=fs.readFileSync(path.join(ROOT,'fixtures/fiscal-load026/legacy.json'),'utf8');
    await run('window.__legacy050='+JSON.stringify(legacyRaw)+';true');
    const lifecycle=await run(`(()=>{
      const a=GV.singleResearch052,checks=[],add=(n,v)=>{checks.push({name:n,ok:!!v});if(!v)throw new Error(n);};
      const start=n=>{add(n+' active before stimulus',a.demo().ok&&a.snapshot().active);a.open();};
      GV.setSpeed(0);GV.newWorldSeeded(491);GV.setSpeed(0);const before=__nativeCapture052();
      start('enabled same-seed');a.end();add('W09 same-seed native identical',before===__nativeCapture052());
      const N=GV.shadowCargo049.nativeObservation().N;let spot=null;
      for(let y=5;y<N-5&&!spot;y++)for(let x=5;x<N-5&&!spot;x++){const t=GV.tile(x,y);if(t.t===2&&!t.bld&&!t.road&&!t.rail&&!t.tram&&!t.ruin)spot={x,y};}
      add('native land fixture',!!spot);start('build');
      add('W09 build',GV.placeUndo('road',spot.x,spot.y)&&GV.tile(spot.x,spot.y).road===1);
      GV.undo();add('W09 Undo',!GV.tile(spot.x,spot.y).road);GV.redo();add('W09 Redo',GV.tile(spot.x,spot.y).road===1);
      add('W09 demolition',GV.placeUndo('doze',spot.x,spot.y)&&!GV.tile(spot.x,spot.y).road);
      add('W09 pure warehouse does not claim native binding',a.snapshot().ledger.batches.length===2);a.end();GV.save();
      const keys=Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s3(?:\\.sandbox516b)?$/.test(k)),saved=keys.map(k=>[k,localStorage.getItem(k)]);
      const restore=()=>{for(const[k,v]of saved)localStorage.setItem(k,v);};add('slot3 fixture only',keys.length>0);
      const read=()=>JSON.parse(__nativeCapture052()),controlBefore=read();
      add('control load',GV.load());GV.setSpeed(0);const expected=read(),controlVersionDelta=expected.amVersion502-controlBefore.amVersion502;
      restore();start('normal load');const enabledBefore=read();add('enabled load',GV.load());GV.setSpeed(0);const actual=read(),enabledVersionDelta=actual.amVersion502-enabledBefore.amVersion502;
      add('W09 native load version delta equality',controlVersionDelta>0&&enabledVersionDelta===controlVersionDelta);
      // Native activeMobilityLoad502 always increments this one counter. Compare its exact delta;
      // every other copied field remains in the strict equality, and synchronous W09 stays byte-exact.
      delete expected.amVersion502;delete actual.amVersion502;
      const loadDifferences=Object.keys(expected).filter(k=>JSON.stringify(expected[k])!==JSON.stringify(actual[k]));
      add('W09 native load control equality '+JSON.stringify(loadDifferences),loadDifferences.length===0);add('W08 load cancellation',!a.snapshot().active&&!document.getElementById('shadowCargo049Panel'));
      const corrupt=()=>{for(const[k,v]of saved){const raw=JSON.parse(v);raw.rd=null;localStorage.setItem(k,JSON.stringify(raw));}};
      const attempt=()=>{try{return{returned:GV.load()};}catch(e){return{thrown:String(e.message||e)};}};
      corrupt();const failedControl=attempt();restore();add('recover failed control',GV.load());GV.setSpeed(0);
      start('partial load');corrupt();const failedEnabled=attempt(),cleared=!a.snapshot().active;restore();add('recover partial',GV.load());GV.setSpeed(0);
      add('W08 partial load clears before failure',cleared);add('W09 partial native outcome equal',JSON.stringify(failedControl)===JSON.stringify(failedEnabled)&&failedEnabled.returned!==true);
      const normal=keys.find(k=>k==='glimmerville.v1.s3');add('archived test slot3',!!normal);
      localStorage.setItem(normal,__legacy050);add('legacy control',GV.load());GV.setSpeed(0);GV.save();const expectedLegacy=localStorage.getItem(normal);
      localStorage.setItem(normal,__legacy050);start('legacy');add('legacy enabled',GV.load());GV.setSpeed(0);add('W08 legacy clears',!a.snapshot().active);
      start('save');const token=a.snapshot().ledger.sessionId;GV.save();add('W09 archived roundtrip equal',localStorage.getItem(normal)===expectedLegacy);
      add('W09 no research token persistence',keys.every(k=>!localStorage.getItem(k).includes(token)&&!localStorage.getItem(k).includes('singleResearch052')));
      GV.newWorldSeeded(492);GV.setSpeed(0);add('W08 newWorld clears',!a.snapshot().active);
      start('explicit disable');a.disable();add('W08 disable clears',!a.snapshot().active);window.__noShadowCargo049=false;
      start('empty queue kill');window.__noShadowCargo049=true;document.getElementById('singleResearch052Retry').click();window.__noShadowCargo049=false;add('W08 empty-head action checks valve',!a.snapshot().active&&!document.getElementById('shadowCargo049Panel'));
      start('pagehide');dispatchEvent(new Event('pagehide'));add('W08 pagehide clears',!a.snapshot().active);
      start('end argument safety');const cyclic={};cyclic.self=cyclic;a.end(cyclic);add('W08 public end ignores caller object',!a.snapshot().active);add('W08 end cannot poison native delegate',GV.load());GV.setSpeed(0);
      return{checks,loadVersionDeltas:{control:controlVersionDelta,enabled:enabledVersionDelta},legacyVersion:JSON.parse(__legacy050).gameVer,failedControl,failedEnabled};
    })()`);
    console.log('SINGLE052 LIFECYCLE '+JSON.stringify(lifecycle));
    await run('GV.singleResearch052.end();true');await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
    const cam0=await run('GV.camera436()');
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:640,y:450,deltaX:0,deltaY:-120});await sleep(400);
    const cam1=await run('GV.camera436()');assert.notEqual(cam1.z,cam0.z,'W10 native wheel after close');
    const tools=await run(`(()=>{const e=document.getElementById('tools');return{exists:!!e,buttons:e?.querySelectorAll('button').length||0,display:e?getComputedStyle(e).display:null};})()`);
    assert.equal(tools.exists,true,'W10 native toolbar exists');assert.notEqual(tools.display,'none','W10 toolbar still displayed');
    // The native category strip is scrollable; establish a visible target, never bypass the hit-test.
    await run("document.querySelector('.catalog458Btn').scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});true");
    await click('.catalog458Btn',true);
    assert.equal(await run("document.getElementById('buildCatalog458').classList.contains('show')"),true,'W10 native catalog button opens after research close');
    await click('catalogClose458');
    assert.equal(await run("document.getElementById('buildCatalog458').classList.contains('show')"),false,'W10 native catalog button closes');
    console.log('SINGLE052 NATIVE_INPUT '+JSON.stringify({cam0,cam1,tools,nativeCatalogOpenedAndClosed:true}));
    const beforeReload=await run(`(()=>{const a=GV.singleResearch052,demo=a.demo(),opened=a.open(),s=a.snapshot();return{demo:demo.ok,opened:opened.ok,active:s.active,session:s.ledger?.sessionId,panel:!!document.getElementById('shadowCargo049Panel')};})()`);
    assert.equal(beforeReload.demo,true,'W08 reload actual demo');assert.equal(beforeReload.opened,true);assert.equal(beforeReload.active,true);assert.equal(beforeReload.panel,true);assert.ok(beforeReload.session,'W08 reload actual live session token');
    await cdp.send('Page.reload',{ignoreCache:true});
    assert.equal(await waitFor(cdp,'!!window.__bootDone453 && !!window.GV?.singleResearch052',120000),true);
    const reloaded=await run(`({state:GV.singleResearch052.snapshot(),panel:!!document.getElementById('shadowCargo049Panel')})`);
    assert.equal(reloaded.state.active,false,'W08 reload no autorestore');assert.equal(reloaded.state.ledger,null);assert.equal(reloaded.panel,false);
    console.log('SINGLE052 RELOAD '+JSON.stringify({beforeReload,...reloaded}));
    console.log('SINGLE052 BROWSER_ERRORS '+JSON.stringify({errors:cdp.errors,knownHarnessBenign:cdp.benign}));
    assert.equal(cdp.errors.length,0,'W10 native Chrome errors');
    return{ok:true,screenshots:screenshots.length,head:process.env.GITHUB_SHA||null,claims:'full052 candidate Chrome desktop/mobile viewport; no hardware phone/Safari; Draft only'};
  });
  console.log('SINGLE052 BROWSER_RESULT '+JSON.stringify({ok:result.ok,fails:result.fails,result:result.result,seconds:result.seconds}));
  assert.equal(result.ok,true,JSON.stringify(result.fails));
}

if(!process.argv.includes('--pure'))(async()=>{await baselineOffBrowser();await browser();})().catch(e=>{console.error('SINGLE052 FAIL',e.stack||e);process.exitCode=1;}).finally(()=>{
 for(const dir of roots)try{fs.rmSync(dir,{recursive:true,force:true});}catch(_){}
});

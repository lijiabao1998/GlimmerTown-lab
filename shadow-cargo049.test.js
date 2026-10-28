#!/usr/bin/env node
/* GPT-049: additive contracts and real native Chrome evidence. CI only per AGENTS.
 * Pure tests extract the shipping factory, never a second model. The browser uses
 * disposable slot 3. No workflow/old guard/timeout/fingerprint is weakened.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const crypto = require('crypto');
const ROOT = __dirname;
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
function between(text, a, b) {
  assert.equal(text.split(a).length, 2, 'one begin marker');
  assert.equal(text.split(b).length, 2, 'one end marker');
  return text.split(a)[1].split(b)[0];
}
const block = between(html, '/* GPT-049 LAB01 BEGIN */', '/* GPT-049 LAB01 END */');
const pure = between(block, '/* GPT-049 PURE FACTORY BEGIN */', '/* GPT-049 PURE FACTORY END */');
const plain = value => JSON.parse(JSON.stringify(value));
function factory(source = pure) {
  return vm.runInNewContext(source + '\ncreateShadowCargo049;', { console }, {timeout:3000});
}
const make = factory();
const manifest = () => ({manifestId:'qa-manifest-049',provenance:'qa-fixture',commodityId:'food',total:20,source:'research-source',custodians:[{id:'research-source',location:'research-shelf-A'},{id:'research-destination',location:'research-shelf-B'}]});
const makeEngine = (overrides = {}, limits, f = make) => {
  const result = f('qa-session-049', {...manifest(), ...overrides}, limits);
  assert.equal(result.ok, true, JSON.stringify(result));
  return result.engine;
};
function event(engine, type, payload, extra = {}) {
  const s = engine.snapshot();
  return {eventId:'event-' + s.revision,sessionId:s.sessionId,batchId:'batch-A',type,expectedRevision:s.revision,payload,...extra};
}
const createPayload = qty => ({commodityId:'food',qty,source:'research-source',destination:'research-destination'});
const own = () => ({owner:'research-source',location:'research-shelf-A'});
const dst = () => ({owner:'research-destination',location:'research-shelf-B'});
const batch = s => Array.isArray(s.batches) ? s.batches.find(x => x.batchId === 'batch-A') : s.batches['batch-A'];
let assertions = 0;
function check(name, fn) { fn(); assertions++; console.log('SHADOW049 PASS ' + name); }
function invariant(s) {
  const rows = Array.isArray(s.batches) ? s.batches : Object.values(s.batches);
  assert.equal(s.unissued + rows.reduce((n,b) => n + b.qty,0), s.manifest.total, 'independent quantity conservation');
  assert.equal(s.conservation.ok, true);
  assert.equal(s.conservation.accounted, s.conservation.total);
  for (const b of rows) {
    assert.ok(Number.isSafeInteger(b.qty) && b.qty > 0);
    assert.equal(typeof b.owner, 'string'); assert.equal(typeof b.location, 'string');
  }
}
function rejectUnchanged(engine, command) {
  const before = JSON.stringify(engine.snapshot());
  const result = engine.command(command);
  assert.equal(result.ok, false, JSON.stringify(result));
  assert.equal(JSON.stringify(engine.snapshot()), before, 'rejection changed ledger');
  invariant(engine.snapshot());
  return result;
}
check('L01 sealed manifest and creation', () => {
  const e = makeEngine(); invariant(e.snapshot());
  const r = e.command(event(e, 'CREATE', createPayload(7)));
  assert.equal(r.ok, true); const s = e.snapshot();
  assert.equal(s.unissued, 13); assert.equal(s.revision, 1);
  assert.equal(batch(s).qty, 7); assert.equal(batch(s).owner, 'research-source');
  invariant(s);
});
check('L01 provenance, commodity and finite limits', () => {
  for (const override of [{provenance:'production-receipt'},{commodityId:'coal'},{total:0},{total:-1},{total:1.5},{total:Infinity},{total:NaN},{total:Number.MAX_SAFE_INTEGER+1},{source:'unknown'},{custodians:[]}]) {
    assert.equal(make('qa-session', {...manifest(),...override}).ok, false, JSON.stringify(override));
  }
  for (const qty of [0,-1,1.25,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,21]) {
    const e=makeEngine(); rejectUnchanged(e,event(e,'CREATE',createPayload(qty)));
  }
  for (const change of [{commodityId:'coal'},{source:'unknown'},{destination:'unknown'},{destination:undefined}]) {
    const e=makeEngine(); rejectUnchanged(e,event(e,'CREATE',{...createPayload(3),...change}));
  }
  const e=makeEngine(); assert.equal(e.command(event(e,'CREATE',createPayload(20))).ok,true);
  rejectUnchanged(e,event(e,'CREATE',createPayload(1),{batchId:'batch-B'}));
});
check('L02 whole-command idempotency and conflicts', () => {
  const e=makeEngine(), c=event(e,'CREATE',createPayload(7)), r=e.command(c), before=JSON.stringify(e.snapshot());
  assert.deepEqual(plain(e.command(plain(c))),plain(r)); assert.equal(JSON.stringify(e.snapshot()),before);
  for (const change of [{type:'FREEZE'},{batchId:'other'},{sessionId:'old-session'},{expectedRevision:1},{payload:createPayload(8)}]) rejectUnchanged(e,{...c,...change});
  rejectUnchanged(e,event(e,'CREATE',createPayload(1)));
  rejectUnchanged(e,event(e,'HANDOFF',{...own(),to:'research-destination'},{expectedRevision:0}));
  rejectUnchanged(e,event(e,'HANDOFF',{...own(),to:'research-destination'},{sessionId:'old-session'}));
});
check('L02 ownership/location and atomic handoff', () => {
  const e=makeEngine(); assert.equal(e.command(event(e,'CREATE',createPayload(7))).ok,true);
  for(const p of [{owner:'other',location:'research-shelf-A',to:'research-destination'},{owner:'research-source',location:'wrong',to:'research-destination'},{...own(),to:'unknown'}]) rejectUnchanged(e,event(e,'HANDOFF',p));
  const c=event(e,'HANDOFF',{...own(),to:'research-destination'}),r=e.command(c);
  assert.equal(r.ok,true); const s=e.snapshot(); invariant(s);
  assert.equal(batch(s).owner,'research-destination'); assert.equal(batch(s).location,'research-shelf-B');
  assert.equal(batch(s).qty,7); assert.equal(batch(s).state,'HELD');
  assert.deepEqual(plain(e.command(c)),plain(r)); invariant(e.snapshot());
});
check('L03 freeze retains quantity and terminal cannot resurrect', () => {
  const e=makeEngine(); e.command(event(e,'CREATE',createPayload(7)));
  assert.equal(e.command(event(e,'FREEZE',{...own(),reason:'research hold'})).ok,true);
  const s=e.snapshot(); assert.equal(batch(s).state,'FROZEN'); assert.equal(batch(s).qty,7); invariant(s);
  rejectUnchanged(e,event(e,'HANDOFF',{...own(),to:'research-destination'}));
  rejectUnchanged(e,event(e,'COMPLETE',own()));
  const d=makeEngine();d.command(event(d,'CREATE',createPayload(7)));
  rejectUnchanged(d,event(d,'COMPLETE',own()));
  d.command(event(d,'HANDOFF',{...own(),to:'research-destination'}));
  assert.equal(d.command(event(d,'COMPLETE',dst())).ok,true);
  assert.equal(batch(d.snapshot()).state,'COMPLETED'); invariant(d.snapshot());
  rejectUnchanged(d,event(d,'HANDOFF',{...dst(),to:'research-source'}));
  rejectUnchanged(d,event(d,'FREEZE',{...dst(),reason:'after terminal'}));
  rejectUnchanged(d,event(d,'COMPLETE',dst()));
});
check('L04 caller data and returned copies cannot mutate ledger', () => {
  const m=manifest(), e=make('qa-session-049',m).engine; m.total=999; m.custodians[0].location='forged';
  const c=event(e,'CREATE',createPayload(7)),r=e.command(c), before=JSON.stringify(e.snapshot());
  c.payload.qty=999; r.ok=false;
  const snap=e.snapshot();snap.unissued=999;batch(snap).owner='forged';snap.manifest.total=999;
  assert.equal(JSON.stringify(e.snapshot()),before); invariant(e.snapshot());
});
check('L01 memory admission refuses without evicting cargo', () => {
  const e=makeEngine({}, {maxBatches:1,maxEvents:3,maxCustodians:2});
  assert.equal(e.command(event(e,'CREATE',createPayload(7))).ok,true);
  rejectUnchanged(e,event(e,'CREATE',createPayload(1),{batchId:'batch-B'}));
  assert.equal(e.command(event(e,'HANDOFF',{...own(),to:'research-destination'})).ok,true);
  assert.equal(e.command(event(e,'COMPLETE',dst())).ok,true); invariant(e.snapshot());
});

// Runtime integration, source mutants and Chrome evidence are below. No local
// execution receipt is claimed: this file is wired only additively into CI.

// T777 owner-approved release projection; the historical SHA and exact ff4a test remain pinned.
const {stripPinned052,projectCandidate052}=require('./single-research052-source.cjs');
projectCandidate052(html); // Actual baseline once; R06 mutants retain their original first-failure order.
const release049 = JSON.parse(fs.readFileSync(path.join(ROOT,'docs/branch/GPT-049-qa/release-source.json'),'utf8'));
const archive049 = fs.readFileSync(path.join(ROOT,'docs/branch/GPT-049-qa/original-ff4a.test.js'),'utf8');
const sha049 = text => crypto.createHash('sha256').update(text).digest('hex');
const expectedRelease049={
  schema:'lab049-release-source-v1',
  release:{version:'14.70',anchor:'T777',round:224,pr:70},
  approvedMain:'dde12ada3d72110d6a0bef3132eef86b871472ea',
  ownerApproval:'DECISIONS-2026-10-28-PR70-merge',
  historical:{head:'ff4a767a10502378b8e1bb387d2a5ed3b608ecbb',version:'14.67',anchor:'T774',
    nativeSha256:'debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624',
    blockSha256:'2f9302156212602f9ec9615da14c8aeb0b16f8987d3628181ac030c77dcb93fb',
    testSha256:'276355b2f979fc52c9ebf581531dacd9079718aea39596c6ca74d6f9d5e7ee2b'}
};
assert.deepEqual(release049,expectedRelease049,'R06 approved release descriptor');
const releaseStrings049=[
  ["const GAME_VER='"+release049.release.version+"';","const GAME_VER='14.67';",'R06 GAME_VER'],
  ["const GAME_ANCHOR='"+release049.release.anchor+"';","const GAME_ANCHOR='T774';",'R06 GAME_ANCHOR'],
  ['<span id="startVersion456">v'+release049.release.version+' · '+release049.release.anchor+'</span>',
   '<span id="startVersion456">v14.67 · T774</span>','R06 startVersion456']
];
function verifyReleaseSource049(candidate,archive=archive049,descriptor=release049) {
  assert.deepEqual(descriptor,expectedRelease049,'R06 approved release descriptor');
  assert.equal(sha049(archive),release049.historical.testSha256,'R06 exact archived ff4a test');
  let canonical=stripPinned052(candidate);
  for(const [current,historical,guard] of releaseStrings049) {
    assert.equal(canonical.split(current).length,2,guard+' exact unique approved metadata');
    canonical=canonical.replace(current,historical);
  }
  const begin='/* GPT-049 LAB01 BEGIN */',end='/* GPT-049 LAB01 END */';
  assert.equal(canonical.split(begin).length,2,'R06 unique research begin');
  assert.equal(canonical.split(end).length,2,'R06 unique research end');
  const whole=begin+canonical.split(begin)[1].split(end)[0]+end;
  assert.equal(sha049(whole),release049.historical.blockSha256,'R06 unchanged research block');
  assert.equal(canonical.split(whole+'\n').length,2,'R06 exact insertion boundary');
  canonical=canonical.replace(whole+'\n','');
  assert.equal(sha049(canonical),release049.historical.nativeSha256,'R06 unchanged canonical native bytes');
  return {release:release049.release,candidateSha256:sha049(candidate),canonicalSha256:sha049(canonical),blockSha256:sha049(whole)};
}
check('L06 original index bytes unchanged outside declared insertion', () => {
  console.log('SHADOW049 RELEASE_SOURCE '+JSON.stringify(verifyReleaseSource049(html)));
});
function sourceMutant049(name,candidate,archive=archive049,descriptor=release049) {
  check(name,()=>{
    let failure;
    try {verifyReleaseSource049(candidate,archive,descriptor);}catch(e){failure=e;}
    assert.ok(failure,name+' mutant escaped');
    assert.equal(failure.code,'ERR_ASSERTION',name+' must fail its assertion, not another exception');
    assert.ok(failure.message.includes(name),name+' wrong first guard: '+failure.message);
    console.log('SHADOW049 RELEASE_EXPECTED_RED '+JSON.stringify({guard:name,sourceHash:sha049(candidate),archiveHash:sha049(archive),descriptorHash:sha049(JSON.stringify(descriptor)),firstFailure:failure.message.split('\n')[0]}));
    verifyReleaseSource049(html);
    console.log('SHADOW049 RELEASE_RESTORED '+name);
  });
}
for(const [current,,guard] of releaseStrings049)sourceMutant049(guard,html.replace(current,current+'/* undeclared duplicate */'+current));
sourceMutant049('R06 unique research begin',html+'\n/* GPT-049 LAB01 BEGIN */');
sourceMutant049('R06 unchanged research block',html.replace('/* GPT-049 LAB01 BEGIN */','/* GPT-049 LAB01 BEGIN */\n/* unauthorized research mutation */'));
sourceMutant049('R06 unchanged canonical native bytes',html+'\n<!-- unauthorized native mutation -->');
sourceMutant049('R06 exact archived ff4a test',html,archive049+'\n// unauthorized archive mutation\n');
for(const change of [d=>d.release.version='14.99',d=>d.release.anchor='T999',d=>d.release.round=999,d=>d.release.pr=999,
  d=>d.approvedMain='unapproved-main',d=>d.ownerApproval='unapproved-message',d=>d.schema='unapproved-schema',
  d=>d.historical.nativeSha256='unapproved-baseline']) {
  const corrupt=JSON.parse(JSON.stringify(release049));change(corrupt);
  sourceMutant049('R06 approved release descriptor',html,archive049,corrupt);
}

check('L01 admitted maximum remains readable without data loss', () => {
  const e=makeEngine({total:32});
  for(let i=0;i<32;i++) {
    const extra={batchId:'batch-'+i};
    assert.equal(e.command(event(e,'CREATE',createPayload(1),extra)).ok,true);
    assert.equal(e.command(event(e,'HANDOFF',{...own(),to:'research-destination'},extra)).ok,true);
    assert.equal(e.command(event(e,'COMPLETE',dst(),extra)).ok,true);
    invariant(e.snapshot());
  }
  const s=e.snapshot();assert.equal(s.events.length,96);assert.equal(s.batches.length,32);assert.equal(s.conservation.terminal,32);
});
check('L04 accessors and non-data payloads reject before side effects', () => {
  let touched=0;const m=manifest();Object.defineProperty(m,'total',{enumerable:true,get(){touched++;return 20;}});
  assert.equal(make('qa-session',m).ok,false);assert.equal(touched,0);
  const e=makeEngine(),c=event(e,'CREATE',createPayload(7));Object.defineProperty(c.payload,'qty',{enumerable:true,get(){touched++;return 7;}});
  rejectUnchanged(e,c);assert.equal(touched,0);
});
function runtime() {
  const listeners=new Map(),nodes=new Map();let rngCalls=0,cryptoCalls=0,persistenceCalls=0,ensureCalls=0;
  class Node {
    constructor(tag){this.tagName=tag;this.style={};this.children=[];this.handlers=new Map();this.textContent='';}
    setAttribute(k,v){this[k]=v;}
    addEventListener(k,fn){if(!this.handlers.has(k))this.handlers.set(k,new Set());this.handlers.get(k).add(fn);}
    removeEventListener(k,fn){this.handlers.get(k)?.delete(fn);}
    appendChild(n){n.parent=this;this.children.push(n);if(n.id)nodes.set(n.id,n);return n;}
    append(...ns){for(const n of ns)this.appendChild(n);}
    remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);if(this.id)nodes.delete(this.id);}
  }
  const body=new Node('body');
  const window={GV:{},crypto:{getRandomValues(a){cryptoCalls++;for(let i=0;i<a.length;i++)a[i]=i+1;return a;}},
    addEventListener(k,fn){if(!listeners.has(k))listeners.set(k,new Set());listeners.get(k).add(fn);},
    removeEventListener(k,fn){listeners.get(k)?.delete(fn);}};
  const context={window,document:{body,createElement:t=>new Node(t),getElementById:id=>nodes.get(id)||null},
    tiles:[{t:2}],economy482:{ready:true,day:1,commodities:{food:{id:'food',production:9,stock:0}}},
    day:1,seed:491,N:1,GAME_VER:'14.67',Uint8Array,console,
    R(){rngCalls++;throw new Error('native RNG consumed');},
    load(){return true;},newWorld(){return true;}};
  for(const name of ['localStorage','sessionStorage','indexedDB'])for(const host of [context,window])Object.defineProperty(host,name,{get(){persistenceCalls++;throw new Error('unexpected persistence access '+name);}});
  for(const name of ['railOpsSnapshot463','transitOpsSnapshot501','stationEvidence008','activeMobilitySnapshot502','ensureMobilityArrays491','rebuildRailOps463','save','tick','advance'])context[name]=()=>{ensureCalls++;throw new Error('forbidden native call '+name);};
  context.Math=Object.create(Math);context.Math.random=()=>{rngCalls++;throw new Error('Math.random consumed');};
  const calls=[];const thrown=new Error('native throw identity');
  context.load=function(...args){calls.push({which:'load',self:this,args,active:window.GV.shadowCargo049.snapshot().active});context.tiles=[{t:3}];if(args[0]==='throw')throw thrown;return args[0]==='partial'?false:'native-result';};
  context.newWorld=function(...args){calls.push({which:'newWorld',self:this,args,active:window.GV.shadowCargo049.snapshot().active});context.tiles=[{t:4}];if(args[0]==='throw')throw thrown;return 'new-result';};
  vm.createContext(context);vm.runInContext(block,context,{timeout:3000});
  return {context,api:window.GV.shadowCargo049,calls,thrown,body,listeners,
    rng:()=>rngCalls,crypto:()=>cryptoCalls,persistence:()=>persistenceCalls,ensure:()=>ensureCalls,pagehide:()=>{for(const fn of [...(listeners.get('pagehide')||[])])fn();}};
}
check('L05/L07 runtime defaults, nonce, exact native delegates and exceptions', () => {
  const r=runtime(),a=r.api;assert.equal(a.snapshot().active,false);assert.equal(r.body.children.length,0);assert.equal(r.crypto(),0);
  assert.equal(r.listeners.get('pagehide')?.size||0,0);
  for(const arg of ['ok','partial','throw']) {
    assert.equal(a.start(manifest()).ok,true);const target={nativeThis:true},n=r.calls.length;
    if(arg==='throw')assert.throws(()=>r.context.load.call(target,arg,7),e=>e===r.thrown);
    else assert.equal(r.context.load.call(target,arg,7),arg==='partial'?false:'native-result');
    assert.equal(r.calls.length,n+1);assert.equal(r.calls[n].self,target);assert.deepEqual(r.calls[n].args,[arg,7]);assert.equal(r.calls[n].active,false);
    assert.equal(a.snapshot().active,false);assert.equal(r.listeners.get('pagehide').size,0);
  }
  for(const arg of [491,'throw']) {
    a.start(manifest());const n=r.calls.length,target={worldThis:true};
    if(arg==='throw')assert.throws(()=>r.context.newWorld.call(target,arg,9),e=>e===r.thrown);
    else assert.equal(r.context.newWorld.call(target,arg,9),'new-result');
    assert.equal(r.calls.length,n+1);assert.equal(r.calls[n].active,false);assert.equal(r.calls[n].self,target);assert.deepEqual(r.calls[n].args,[arg,9]);
  }
  assert.equal(a.snapshot().active,false);assert.equal(r.rng(),0);assert.equal(r.crypto(),1);assert.equal(r.persistence(),0);assert.equal(r.ensure(),0);
});
check('L05/L08 pagehide, identity replacement and kill cleanup', () => {
  const r=runtime(),a=r.api;let s=a.start(manifest());assert.equal(s.ok,true);const old=s.sessionId;
  assert.equal(a.open().ok,true);assert.equal(a.open().ok,true);assert.equal(r.body.children.length,1);
  r.pagehide();assert.equal(a.snapshot().active,false);assert.equal(r.body.children.length,0);assert.equal(r.listeners.get('pagehide').size,0);
  assert.equal(a.start(manifest()).ok,true);assert.notEqual(a.snapshot().ledger.sessionId,old);
  r.context.tiles=[{different:true}];assert.equal(a.snapshot().active,false);assert.equal(a.snapshot().ledger,null);
  a.start(manifest());a.open();r.context.window.__noShadowCargo049=true;
  assert.equal(a.snapshot().active,false);assert.equal(r.body.children.length,0);assert.equal(a.start(manifest()).ok,false);
  assert.equal(r.rng(),0);assert.equal(r.persistence(),0);assert.equal(r.ensure(),0);
});
check('L01/L06 native observation never mints, stale is unavailable', () => {
  const r=runtime(),a=r.api;let o=a.nativeObservation();assert.equal(o.ready,true);assert.equal(o.eligibleForMint,false);
  o.food.production=999;assert.equal(r.context.economy482.commodities.food.production,9);
  r.context.day=2;o=a.nativeObservation();assert.equal(o.stale,true);assert.equal(o.food,null);
  r.context.economy482.ready=false;assert.equal(a.nativeObservation().ready,false);
  assert.equal(a.start({...manifest(),provenance:'production-receipt'}).ok,false);assert.equal(a.snapshot().active,false);
});
function mutant(name, from, to, guard) {
  assert.equal(pure.split(from).length,2,'unique mutation target '+name);
  const broken=factory(pure.replace(from,to));
  let failure=null;try{guard(broken);}catch(e){failure=e;}
  assert.ok(failure,'negative control was not detected: '+name);
  console.log('SHADOW049 EXPECTED_RED '+name+' '+failure.message.split('\n')[0]);
}
check('L09 each new guard catches its actual-source mutant', () => {
  mutant('idempotency','if(previous)return previous.signature===signature?copyData(previous.result):fail(\'event-conflict\');','if(previous)return fail(\'broken-replay\');',f=>{
    const e=makeEngine({},undefined,f),c=event(e,'CREATE',createPayload(7)),r=e.command(c);
    assert.deepEqual(plain(e.command(c)),plain(r),'idempotency guard');
  });
  mutant('owner','if(p.owner!==old.owner || p.location!==old.location)return fail(\'custody-conflict\');','if(false)return fail(\'custody-conflict\');',f=>{
    const e=makeEngine({},undefined,f);e.command(event(e,'CREATE',createPayload(7)));
    rejectUnchanged(e,event(e,'HANDOFF',{owner:'forged',location:'forged',to:'research-destination'}));
  });
  mutant('conservation','unissued:ledger.unissued-(c.type===\'CREATE\'?batch.qty:0)','unissued:ledger.unissued',f=>{
    const e=makeEngine({},undefined,f),r=e.command(event(e,'CREATE',createPayload(7)));
    assert.equal(r.ok,true,'conservation transition guard');invariant(e.snapshot());
  });
});

(async()=>{
  const {withGame,sleep,waitFor}=require('./harness.js');
  const result=await withGame({port:8199,timeout:300,fresh:true,log:s=>console.log('SHADOW049 CHROME '+s)},async({cdp})=>{
    const qaManifest=manifest();
    const legacyRaw=fs.readFileSync(path.join(ROOT,'fixtures/fiscal-load026/legacy.json'),'utf8');
    console.log('SHADOW049 LEGACY_FIXTURE '+JSON.stringify({path:'fixtures/fiscal-load026/legacy.json',version:JSON.parse(legacyRaw).gameVer,sha256:crypto.createHash('sha256').update(legacyRaw).digest('hex')}));
    await cdp.evalJs(`window.__shadowManifest049=${JSON.stringify(qaManifest)}; window.__shadowLegacy049=${JSON.stringify(legacyRaw)}; GV.setSpeed(0); true`);
    const baseline=await cdp.evalJs(`(()=>{
      const a=GV.shadowCargo049,checks=[],add=(name,ok)=>{checks.push({name,ok:!!ok});if(!ok)throw new Error(name);};
      const storage=()=>JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
      window.__shadowCapture049=()=>{const n=a.nativeObservation().N;return JSON.stringify({stats:GV.stats(),txn:GV.txn460(),mobility:GV.mobility491(),tiles:Array.from({length:n},(_,y)=>Array.from({length:n},(_,x)=>GV.tile(x,y)))});};
      add('default inactive, no DOM',!a.snapshot().active&&!document.getElementById('shadowCargo049Panel'));
      const beforeStorage=storage(),before=__shadowCapture049(),canvas=document.getElementById('game'),frameBefore=canvas.toDataURL();
      const st=a.selftest();add('enabled native state selftest',st.ok);
      add('selftest no storage write',storage()===beforeStorage);
      add('selftest native public state unchanged',__shadowCapture049()===before);
      const s=a.start(__shadowManifest049);add('explicit research start',s.ok);
      const c={eventId:'browser-create',sessionId:s.sessionId,batchId:'batch-A',type:'CREATE',expectedRevision:0,payload:{commodityId:'food',qty:7,source:'research-source',destination:'research-destination'}};
      add('browser CREATE',a.command(c).ok);add('browser open',a.open().ok);add('browser repeated open singleton',a.open().ok&&document.querySelectorAll('#shadowCargo049Panel').length===1);
      add('enabled API/panel no storage write',storage()===beforeStorage);add('enabled API/panel public native state unchanged',__shadowCapture049()===before);
      add('same-turn full native canvas bytes unchanged by enabled API/panel',canvas.toDataURL()===frameBefore);
      window.__shadowOldCommand049=c;
      return {checks,selftest:st,snapshot:a.snapshot(),observation:a.nativeObservation()};
    })()`);
    console.log('SHADOW049 NATIVE '+JSON.stringify(baseline));
    fs.mkdirSync(path.join(ROOT,'shots'),{recursive:true});
    const shot=async(name)=>{
      const png=await cdp.send('Page.captureScreenshot',{format:'png'});
      const bytes=Buffer.from(png.data,'base64'),file='smoke-shadow049-'+process.pid+'-'+name+'.png';
      fs.writeFileSync(path.join(ROOT,'shots',file),bytes);
      console.log('SHADOW049 SCREENSHOT '+JSON.stringify({file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length}));
    };
    for(const [name,width,height,mobile] of [['desktop',1280,900,false],['mobile',390,844,true]]) {
      await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
      for(const [light,vis] of [['day',55],['night',90]]) {
        await cdp.evalJs(`GV.setVisT(${vis}); GV.forceDraw(); GV.shadowCargo049.refresh(); true`);await sleep(100);
        const bounds=await cdp.evalJs(`(()=>{const p=document.getElementById('shadowCargo049Panel'),r=p.getBoundingClientRect(),b=document.getElementById('shadowCargo049End').getBoundingClientRect();return {within:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,endVisible:b.height>=44&&b.bottom<=innerHeight,warning:p.textContent.includes('未保存，重載即遺失'),viewport:[innerWidth,innerHeight]};})()`);
        assert.equal(bounds.within,true);assert.equal(bounds.endVisible,true);assert.equal(bounds.warning,true);
        await shot(name+'-'+light+'-open');
      }
    }
    const closed=await cdp.evalJs(`(()=>{
      const canvas=document.getElementById('game'),before=canvas.toDataURL();
      const p=document.querySelector('#shadowCargo049Panel pre');p.scrollTop=p.scrollHeight;
      const canScroll=p.scrollHeight>p.clientHeight&&p.scrollTop>0;
      document.getElementById('shadowCargo049Refresh').click();
      document.getElementById('shadowCargo049End').click();
      const a=GV.shadowCargo049,s=a.snapshot();
      return {canScroll,noPanel:!document.getElementById('shadowCargo049Panel'),sameTurnCanvasBytes:canvas.toDataURL()===before,s,oldRejected:!a.command(__shadowOldCommand049).ok};
    })()`);
    assert.equal(closed.canScroll,true);assert.equal(closed.noPanel,true);assert.equal(closed.sameTurnCanvasBytes,true);assert.equal(closed.s.active,false);assert.equal(closed.s.ended.cancelled,20);assert.equal(closed.oldRejected,true);
    console.log('SHADOW049 CLOSE '+JSON.stringify(closed));await shot('mobile-night-closed');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
    const native=await cdp.evalJs(`(()=>{
      const a=GV.shadowCargo049,checks=[],add=(name,ok)=>{checks.push({name,ok:!!ok});if(!ok)throw new Error(name);};
      const startResearch=name=>{const r=a.start(__shadowManifest049);add(name+' starts an active session',r.ok&&a.snapshot().active);return r;};
      GV.setSpeed(0);GV.newWorldSeeded(491);GV.setSpeed(0);
      const seeded=__shadowCapture049();startResearch('same-seed');a.open();a.refresh();a.end();
      add('same-seed native state unchanged by enabled research',seeded===__shadowCapture049());
      let place=null;const n=a.nativeObservation().N;
      for(let y=5;y<n-5&&!place;y++)for(let x=5;x<n-5&&!place;x++){const t=GV.tile(x,y);if(t.t===2&&!t.bld&&!t.road&&!t.rail&&!t.tram&&!t.ruin)place={x,y};}
      add('native free land fixture exists',!!place);
      startResearch('construction');
      add('native road placement',GV.placeUndo('road',place.x,place.y)&&GV.tile(place.x,place.y).road===1);
      GV.undo();add('native Undo',!GV.tile(place.x,place.y).road);
      GV.redo();add('native Redo',GV.tile(place.x,place.y).road===1);
      add('native demolition',GV.placeUndo('doze',place.x,place.y)&&!GV.tile(place.x,place.y).road);
      add('construction does not impersonate cargo',a.snapshot().ledger.batches.length===0);
      a.end();GV.save();
      const keys=Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s3(?:\\.sandbox516b)?$/.test(k));add('only disposable slot fixture selected',keys.length>0);
      const saved=keys.map(k=>[k,localStorage.getItem(k)]),restore=()=>{for(const[k,v]of saved)localStorage.setItem(k,v);};
      add('baseline unchanged-schema native load',GV.load());GV.setSpeed(0);const expected=__shadowCapture049();
      restore();startResearch('native load');
      add('native load result preserved',GV.load());GV.setSpeed(0);
      add('native load equivalent to no-session control',__shadowCapture049()===expected);
      add('load ends research',!a.snapshot().active&&!document.getElementById('shadowCargo049Panel'));
      // A valid terrain length but null road data fails after native load has
      // assigned seed/R/tiles. Compare the same corrupt slot without/with a
      // research session, then immediately restore inside this JS turn.
      const corrupt=()=>{for(const[k,v]of saved){const raw=JSON.parse(v);raw.rd=null;localStorage.setItem(k,JSON.stringify(raw));}};
      const attempt=()=>{try{return {returned:GV.load()};}catch(e){return {thrown:String(e.message||e)};}};
      corrupt();const failedControl=attempt();restore();add('recover control corrupt load',GV.load());GV.setSpeed(0);
      startResearch('partial load');corrupt();const failedEnabled=attempt(),endedAfterPartial=!a.snapshot().active;
      restore();add('recover enabled corrupt load',GV.load());GV.setSpeed(0);
      add('partial-load native outcome unchanged',JSON.stringify(failedControl)===JSON.stringify(failedEnabled)&&failedEnabled.returned!==true);
      add('partial-load invalidates research before failure',endedAfterPartial);
      const legacyKey=keys.find(k=>k==='glimmerville.v1.s3');add('legacy test uses normal slot3',!!legacyKey);
      localStorage.setItem(legacyKey,__shadowLegacy049);add('archived v14.43 control load',GV.load());GV.setSpeed(0);GV.save();
      const legacyExpected=localStorage.getItem(legacyKey);
      localStorage.setItem(legacyKey,__shadowLegacy049);startResearch('archived load');
      add('archived v14.43 enabled load',GV.load());GV.setSpeed(0);add('legacy load cancels research',!a.snapshot().active);
      startResearch('archived save');GV.save();add('archived save roundtrip equal to no-session native control',localStorage.getItem(legacyKey)===legacyExpected);a.end();
      const fresh=startResearch('current save and new world');GV.save();
      add('native save does not persist session token',keys.every(k=>!localStorage.getItem(k).includes(fresh.sessionId)&&!localStorage.getItem(k).includes('shadowCargo049')));
      GV.newWorldSeeded(492);GV.setSpeed(0);add('new world ends research',!a.snapshot().active);
      startResearch('disable');a.disable();add('explicit disable ends immediately',!a.snapshot().active);window.__noShadowCargo049=false;
      startResearch('kill switch');window.__noShadowCargo049=true;add('kill checked at read boundary',!a.snapshot().active);window.__noShadowCargo049=false;
      startResearch('pagehide');dispatchEvent(new Event('pagehide'));add('pagehide ends research',!a.snapshot().active);
      startResearch('reload');window.__shadowBeforeReload049=a.snapshot().ledger.sessionId;
      return {checks,place,slotKeys:keys,failedControl,failedEnabled,reloadOldSession:__shadowBeforeReload049};
    })()`);
    console.log('SHADOW049 NATIVE_LIFECYCLE '+JSON.stringify(native));
    // A native wheel event after panel removal must reach the game's own canvas.
    const cam0=await cdp.evalJs('GV.camera436()');
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:640,y:450,deltaX:0,deltaY:-120});await sleep(400);
    const cam1=await cdp.evalJs('GV.camera436()');assert.notEqual(cam1.z,cam0.z,'native zoom blocked after panel close');
    console.log('SHADOW049 NATIVE_INPUT '+JSON.stringify({wheelBefore:cam0,wheelAfter:cam1}));await shot('desktop-native-after-close');
    await cdp.send('Page.reload',{ignoreCache:true});
    assert.equal(await waitFor(cdp,'!!window.__bootDone453 && !!window.GV?.shadowCargo049',120000),true);
    const reload=await cdp.evalJs(`({state:GV.shadowCargo049.snapshot(),panel:!!document.getElementById('shadowCargo049Panel')})`);
    assert.equal(reload.state.active,false);assert.equal(reload.state.ledger,null);assert.equal(reload.panel,false);
    console.log('SHADOW049 RELOAD '+JSON.stringify({oldSession:native.reloadOldSession,...reload,claim:'no restore or automatic re-ingestion; old token unusable'}));
    console.log('SHADOW049 BROWSER_ERRORS '+JSON.stringify({errors:cdp.errors,knownHarnessBenign:cdp.benign}));
    assert.equal(cdp.errors.length,0,'native Chrome console/uncaught errors: '+JSON.stringify(cdp.errors));
    return {ok:true,assertions,head:process.env.GITHUB_SHA||null,claims:'native Chrome emulated desktop/mobile; not hardware Safari; research custody only'};
  });
  console.log('SHADOW049 RESULT '+JSON.stringify({ok:result.ok,fails:result.fails,result:result.result,seconds:result.seconds}));
  assert.equal(result.ok,true,JSON.stringify(result.fails));
})().catch(e=>{console.error('SHADOW049 FAIL',e.stack||e);process.exitCode=1;});


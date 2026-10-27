/* GPT-049 LAB01 BEGIN */
/* Research custody only: no physical delivery, native inventory or persistence. */
/* GPT-049 PURE FACTORY BEGIN */
function createShadowCargo049(sessionId, inputManifest, inputLimits) {
  'use strict';
  const fail = code => ({ok:false,code});
  const idOK = value => typeof value==='string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,63}$/.test(value);
  const positive = value => Number.isSafeInteger(value) && value>0;
  const exact = (value, keys) => !!value && !Array.isArray(value) &&
    Object.keys(value).sort().join('|')===keys.slice().sort().join('|');
  // Copy JSON data without invoking getters/toJSON or retaining caller references.
  // Cross-realm plain records are accepted; accessors, symbols and sparse arrays are not.
  function copyData(value,maxNodes=4096) {
    let nodes=0;
    const visit=(v,depth)=>{
      if(++nodes>maxNodes || depth>10)throw new Error('data-bound');
      if(v===null || typeof v==='boolean')return v;
      if(typeof v==='string') { if(v.length>1024)throw new Error('string-bound');return v; }
      if(typeof v==='number') { if(!Number.isFinite(v))throw new Error('finite-data');return v; }
      if(typeof v!=='object')throw new Error('plain-data');
      if(Object.getOwnPropertySymbols(v).length)throw new Error('symbol-data');
      const descriptors=Object.getOwnPropertyDescriptors(v);
      if(Array.isArray(v)) {
        if(v.length>512 || Object.keys(descriptors).length!==v.length+1)throw new Error('array-bound');
        const out=[];
        for(let i=0;i<v.length;i++) {
          const d=descriptors[String(i)];
          if(!d || !Object.hasOwn(d,'value') || !d.enumerable)throw new Error('array-data');
          out.push(visit(d.value,depth+1));
        }
        return out;
      }
      const proto=Object.getPrototypeOf(v);
      if(proto!==null && Object.getPrototypeOf(proto)!==null)throw new Error('record-data');
      const out=Object.create(null),keys=Object.keys(descriptors).sort();
      if(keys.length>32)throw new Error('record-bound');
      for(const key of keys) {
        const d=descriptors[key];
        if(!Object.hasOwn(d,'value') || !d.enumerable || key==='__proto__' || key==='prototype' || key==='constructor')throw new Error('record-data');
        out[key]=visit(d.value,depth+1);
      }
      return out;
    };
    return visit(value,0);
  }
  function freezeData(value) {
    if(value && typeof value==='object') {
      for(const v of Object.values(value))freezeData(v);
      Object.freeze(value);
    }
    return value;
  }
  let manifest,limitInput;
  try { manifest=copyData(inputManifest);limitInput=inputLimits===undefined?{}:copyData(inputLimits); }
  catch(_) { return fail('invalid-data'); }
  if(!idOK(sessionId))return fail('invalid-session-id');
  if(manifest?.provenance==='production-receipt')return fail('unsupported-production-receipt');
  if(!exact(manifest,['manifestId','provenance','commodityId','total','source','custodians']))return fail('invalid-manifest');
  if(!idOK(manifest.manifestId) || !['research-manifest','qa-fixture'].includes(manifest.provenance))return fail('invalid-provenance');
  if(manifest.commodityId!=='food')return fail('unsupported-commodity');
  if(!positive(manifest.total))return fail('invalid-quantity');
  const defaults={maxBatches:32,maxEvents:128,maxCustodians:8},limits={...defaults};
  if(!limitInput || typeof limitInput!=='object' || Array.isArray(limitInput))return fail('invalid-limits');
  for(const key of Object.keys(limitInput)) {
    const n=limitInput[key];
    if(!Object.hasOwn(defaults,key) || !positive(n) || n>defaults[key] || (key==='maxCustodians' && n<2))return fail('invalid-limits');
    limits[key]=n;
  }
  if(!Array.isArray(manifest.custodians) || manifest.custodians.length<2 || manifest.custodians.length>limits.maxCustodians)return fail('invalid-custodians');
  const custodians=new Map(),locations=new Set();
  for(const c of manifest.custodians) {
    if(!exact(c,['id','location']) || !idOK(c.id) || !idOK(c.location) || custodians.has(c.id) || locations.has(c.location))return fail('invalid-custodians');
    custodians.set(c.id,c);locations.add(c.location);
  }
  if(!idOK(manifest.source) || !custodians.has(manifest.source))return fail('source-unavailable');
  freezeData(manifest);Object.freeze(limits);
  let ledger={revision:0,unissued:manifest.total,batches:new Map(),events:new Map()};
  function conservation(state) {
    let live=0,terminal=0,valid=Number.isSafeInteger(state.unissued)&&state.unissued>=0;
    valid=valid && state.revision===state.events.size && state.events.size<=limits.maxEvents && state.batches.size<=limits.maxBatches;
    for(const [key,b] of state.batches) {
      const custodian=custodians.get(b.owner),done=b.state==='COMPLETED';
      valid=valid && key===b.batchId && positive(b.qty) && b.commodityId==='food' &&
        b.source===manifest.source && custodians.has(b.destination) && b.destination!==b.source &&
        !!custodian && custodian.location===b.location && [b.source,b.destination].includes(b.owner) &&
        ['SOURCE_READY','HELD','FROZEN','COMPLETED'].includes(b.state) &&
        (b.state!=='SOURCE_READY' || b.owner===b.source) &&
        (b.state!=='HELD' || b.owner===b.destination) &&
        (!done || b.owner===b.destination) &&
        b.terminalStatus===(done?'research-completed':null) &&
        idOK(b.creationEvent) && state.events.get(b.creationEvent)?.command.type==='CREATE' &&
        state.events.get(b.creationEvent)?.command.batchId===key &&
        Number.isSafeInteger(b.eventSeq) && b.eventSeq>0 && b.eventSeq<=state.revision;
      if(done)terminal+=b.qty;else live+=b.qty;
    }
    const accounted=state.unissued+live+terminal;
    valid=valid && Number.isSafeInteger(live) && Number.isSafeInteger(terminal) && Number.isSafeInteger(accounted) && accounted===manifest.total;
    return {ok:!!valid,total:manifest.total,unissued:state.unissued,live,terminal,accounted};
  }
  function snapshot() {
    return copyData({sessionId,revision:ledger.revision,manifest,unissued:ledger.unissued,
      batches:[...ledger.batches.values()],
      events:[...ledger.events.values()].map(e=>({eventId:e.command.eventId,command:e.command,result:e.result})),
      conservation:conservation(ledger),limits},32768);
  }
  function command(input) {
    let c;
    try { c=copyData(input); }catch(_) { return fail('invalid-data'); }
    if(!exact(c,['eventId','sessionId','batchId','type','expectedRevision','payload']) || !idOK(c.eventId) || !idOK(c.batchId))return fail('invalid-command');
    const signature=JSON.stringify(c),previous=ledger.events.get(c.eventId);
    if(previous)return previous.signature===signature?copyData(previous.result):fail('event-conflict');
    if(c.sessionId!==sessionId)return fail('stale-session');
    if(!Number.isSafeInteger(c.expectedRevision) || c.expectedRevision<0)return fail('invalid-revision');
    if(c.expectedRevision!==ledger.revision)return fail('stale-revision');
    if(ledger.events.size>=limits.maxEvents)return fail('event-limit');
    const p=c.payload,old=ledger.batches.get(c.batchId);
    let batch;
    if(c.type==='CREATE') {
      if(!exact(p,['commodityId','qty','source','destination']))return fail('invalid-payload');
      if(old)return fail('duplicate-batch');
      if(ledger.batches.size>=limits.maxBatches)return fail('batch-limit');
      if(p.commodityId!=='food')return fail('unsupported-commodity');
      if(!positive(p.qty))return fail('invalid-quantity');
      if(p.source!==manifest.source || !custodians.has(p.source))return fail('source-unavailable');
      if(!custodians.has(p.destination) || p.destination===p.source)return fail('destination-unavailable');
      if(p.qty>ledger.unissued)return fail('source-exhausted');
      batch={batchId:c.batchId,commodityId:'food',qty:p.qty,source:p.source,destination:p.destination,
        creationEvent:c.eventId,owner:p.source,location:custodians.get(p.source).location,
        state:'SOURCE_READY',eventSeq:ledger.revision+1,terminalStatus:null,provenance:manifest.provenance,frozenReason:null};
    } else {
      const fields=c.type==='HANDOFF'?['owner','location','to']:c.type==='FREEZE'?['owner','location','reason']:c.type==='COMPLETE'?['owner','location']:null;
      if(!fields)return fail('unsupported-command');
      if(!exact(p,fields))return fail('invalid-payload');
      if(!old)return fail('batch-unavailable');
      if(old.terminalStatus)return fail('terminal-batch');
      if(p.owner!==old.owner || p.location!==old.location)return fail('custody-conflict');
      if(old.state==='FROZEN')return fail('frozen-batch');
      batch=copyData(old);
      if(c.type==='HANDOFF') {
        if(old.state!=='SOURCE_READY')return fail('invalid-transition');
        if(!custodians.has(p.to) || p.to!==old.destination || p.to===old.owner)return fail('destination-unavailable');
        batch.owner=p.to;batch.location=custodians.get(p.to).location;batch.state='HELD';
      } else if(c.type==='FREEZE') {
        if(typeof p.reason!=='string' || !p.reason.trim() || p.reason.length>160)return fail('invalid-reason');
        batch.state='FROZEN';batch.frozenReason=p.reason;
      } else {
        if(old.state!=='HELD' || old.owner!==old.destination)return fail('invalid-transition');
        batch.state='COMPLETED';batch.terminalStatus='research-completed';
      }
      batch.eventSeq=ledger.revision+1;
    }
    const next={revision:ledger.revision+1,unissued:ledger.unissued-(c.type==='CREATE'?batch.qty:0),
      batches:new Map(ledger.batches),events:new Map(ledger.events)};
    const result={ok:true,eventId:c.eventId,sessionId,batchId:c.batchId,type:c.type,revision:next.revision,
      state:batch.state,owner:batch.owner,location:batch.location,qty:batch.qty};
    next.batches.set(c.batchId,freezeData(batch));
    next.events.set(c.eventId,freezeData({signature,command:c,result}));
    if(!conservation(next).ok)return fail('conservation-violation');
    ledger=next;
    return copyData(result);
  }
  return {ok:true,engine:Object.freeze({command,snapshot})};
}
/* GPT-049 PURE FACTORY END */
(function installShadowCargo049(){
  'use strict';
  const baselineSha049='020e3c096974be64680142297423de9a51d4bb8b';
  const nativeIndexBlob049='f049d7e5724e7567cc73e1af0d8fcda0a4a3b64b';
  const warning049='研究貨單；不影響正式經濟；未保存，重載即遺失。';
  let engine049=null,world049=null,lastEnd049=null,documentNonce049=null,sessionSeq049=0;
  let panel049=null,panelText049=null,panelHandlers049=[],pagehide049=null;
  const clone049=value=>JSON.parse(JSON.stringify(value));
  function removePanel049() {
    for(const [node,type,handler] of panelHandlers049)try{node.removeEventListener(type,handler);}catch(_){}
    panelHandlers049=[];
    if(panel049)try{panel049.remove();}catch(_){}
    panel049=null;panelText049=null;
  }
  function end049(reason) {
    const ending=engine049;
    engine049=null;world049=null;
    if(pagehide049)try{window.removeEventListener('pagehide',pagehide049);}catch(_){}
    pagehide049=null;removePanel049();
    if(ending) {
      // Only totals and a reason survive. No manifest, batch or event can resume.
      try {
        const c=ending.snapshot().conservation;
        lastEnd049={reason,total:c.total,unissued:c.unissued,live:c.live,completed:c.terminal,
          cancelled:c.unissued+c.live,persisted:false,retainedLedger:false};
      } catch(_) {
        lastEnd049={reason,total:null,cancelled:null,persisted:false,retainedLedger:false};
      }
    }
    return {ok:true,active:false,ended:lastEnd049?clone049(lastEnd049):null};
  }
  function guard049() {
    if(window.__noShadowCargo049===true){end049('feature-disabled-research-cancelled');return 'disabled';}
    if(engine049 && world049!==tiles){end049('world-replaced-research-cancelled');return 'stale-world';}
    return null;
  }
  function observation049() {
    const e=economy482,food=e?.commodities?.food,nativeReady=e?.ready===true,stale=nativeReady&&e.day!==day;
    const ready=!!(tiles && nativeReady && !stale && food && food.id==='food');
    return {baselineSha:baselineSha049,nativeIndexBlob:nativeIndexBlob049,provenanceRole:'verified-native-baseline-not-candidate-head',
      day,seed,N,version:GAME_VER,observedDay:Number.isFinite(e?.day)?e.day:null,ready,stale,
      status:ready?'available':stale?'stale':'unavailable',granularity:'city-rounded-daily-flow',
      eligibleForMint:false,productionReceiptSupported:false,food:ready?clone049(food):null};
  }
  function snapshot049() {
    const blocked=guard049();
    return {ok:!blocked,...(blocked?{code:blocked}:{}),active:!!engine049,persisted:false,
      ledger:engine049?engine049.snapshot():null,ended:lastEnd049?clone049(lastEnd049):null};
  }
  function start049(manifest) {
    const blocked=guard049();if(blocked)return {ok:false,code:blocked};
    if(engine049)return {ok:false,code:'session-already-active'};
    if(!Array.isArray(tiles) || !tiles.length)return {ok:false,code:'world-unavailable'};
    if(sessionSeq049>=Number.MAX_SAFE_INTEGER)return {ok:false,code:'session-limit'};
    // Validate before requesting independent WebCrypto bytes. No native RNG is used.
    const checked=createShadowCargo049('validation-only',manifest);
    if(!checked.ok)return checked;
    if(!documentNonce049) {
      try {
        if(!window.crypto || typeof window.crypto.getRandomValues!=='function')return {ok:false,code:'secure-document-identity-unavailable'};
        const bytes=new Uint8Array(12);window.crypto.getRandomValues(bytes);
        documentNonce049=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
      } catch(_) { return {ok:false,code:'secure-document-identity-unavailable'}; }
    }
    const sessionId='lab049:'+documentNonce049+':'+(sessionSeq049+1);
    const built=createShadowCargo049(sessionId,checked.engine.snapshot().manifest);
    if(!built.ok)return built;
    const hide=()=>end049('pagehide-research-cancelled');
    try { window.addEventListener('pagehide',hide); }
    catch(_) { return {ok:false,code:'lifecycle-listener-unavailable'}; }
    sessionSeq049++;engine049=built.engine;world049=tiles;pagehide049=hide;lastEnd049=null;
    return {ok:true,sessionId,ledger:engine049.snapshot(),warning:warning049};
  }
  function command049(input) {
    const blocked=guard049();if(blocked)return {ok:false,code:blocked};
    if(!engine049)return {ok:false,code:'session-unavailable'};
    return engine049.command(input);
  }
  function nativeObservation049() {
    const blocked=guard049();if(blocked)return {ok:false,code:blocked,ready:false,eligibleForMint:false};
    return {ok:true,...observation049()};
  }
  function refresh049() {
    const blocked=guard049();if(blocked)return {ok:false,code:blocked};
    if(!engine049)return {ok:false,code:'session-unavailable'};
    if(!panel049)return {ok:false,code:'panel-not-open'};
    const data={warning:warning049,kind:'research-custody-not-transport',ledger:engine049.snapshot(),nativeObservation:observation049()};
    panelText049.textContent=JSON.stringify(data,null,2);
    return {ok:true,active:true,revision:data.ledger.revision};
  }
  function open049() {
    const blocked=guard049();if(blocked)return {ok:false,code:blocked};
    if(!engine049)return {ok:false,code:'session-unavailable'};
    if(panel049)return refresh049();
    try {
    const p=document.createElement('section');p.id='shadowCargo049Panel';p.setAttribute('role','dialog');
    p.setAttribute('aria-labelledby','shadowCargo049Title');p.setAttribute('aria-modal','false');
    Object.assign(p.style,{position:'fixed',right:'12px',bottom:'12px',width:'min(420px, calc(100vw - 24px))',
      maxHeight:'min(70vh, 620px)',boxSizing:'border-box',display:'flex',flexDirection:'column',gap:'8px',
      padding:'12px',border:'2px solid #b4d0c4',borderRadius:'8px',background:'#15251f',color:'#f1f6f3',
      font:'14px/1.45 system-ui, sans-serif',zIndex:'10000'});
    const h=document.createElement('h2');h.id='shadowCargo049Title';h.textContent='LAB-01 影子貨物研究';h.style.margin='0';h.style.fontSize='18px';
    const note=document.createElement('p');note.textContent=warning049;note.style.margin='0';
    const pre=document.createElement('pre');pre.style.margin='0';pre.style.overflow='auto';pre.style.whiteSpace='pre-wrap';pre.style.overflowWrap='anywhere';pre.style.font='12px/1.4 monospace';pre.style.minHeight='0';
    const buttons=document.createElement('div');buttons.style.display='flex';buttons.style.flexWrap='wrap';buttons.style.gap='8px';
    const refresh=document.createElement('button');refresh.id='shadowCargo049Refresh';refresh.type='button';refresh.textContent='重新讀取（唯讀）';
    const finish=document.createElement('button');finish.id='shadowCargo049End';finish.type='button';finish.textContent='結束研究（未保存）';
    for(const b of [refresh,finish]){b.style.minHeight='44px';b.style.cursor='pointer';buttons.appendChild(b);}
    p.append(h,note,pre,buttons);panel049=p;panelText049=pre;
    const on=(node,type,fn)=>{node.addEventListener(type,fn);panelHandlers049.push([node,type,fn]);};
    on(refresh,'click',()=>refresh049());on(finish,'click',()=>end049('panel-ended-research-cancelled'));
    for(const type of ['pointerdown','pointerup','click','dblclick','wheel'])on(p,type,e=>e.stopPropagation());
    on(p,'keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();end049('panel-ended-research-cancelled');}});
    document.body.appendChild(p);return refresh049();
    }
    catch(_) { removePanel049();return {ok:false,code:'panel-unavailable'}; }
  }
  function selftest049() {
    const blocked=guard049();if(blocked)return {ok:false,checks:['feature disabled or stale world'],code:blocked};
    if(engine049)return {ok:false,checks:['selftest requires no active research session; existing session was not modified']};
    const checks=[],add=(name,ok)=>checks.push([name,!!ok]);
    const manifest={manifestId:'selftest-manifest',provenance:'qa-fixture',commodityId:'food',total:7,source:'source',
      custodians:[{id:'source',location:'research:source'},{id:'receiver',location:'research:receiver'}]};
    const made=createShadowCargo049('selftest-session',manifest);
    add('finite research manifest accepted',made.ok);
    if(!made.ok)return {ok:false,checks:checks.map(c=>c[0]+': '+c[1])};
    const e=made.engine,cmd=(eventId,type,payload,expectedRevision=e.snapshot().revision,batchId='batch')=>
      ({eventId,sessionId:'selftest-session',batchId,type,expectedRevision,payload});
    const create=cmd('create','CREATE',{commodityId:'food',qty:7,source:'source',destination:'receiver'});
    const first=e.command(create),before=JSON.stringify(e.snapshot());
    add('CREATE consumes finite source and conserves',first.ok && e.snapshot().unissued===0 && e.snapshot().conservation.ok);
    add('identical event is exact replay',JSON.stringify(first)===JSON.stringify(e.command(create)) && JSON.stringify(e.snapshot())===before);
    for(const changed of [{sessionId:'other-session'},{type:'COMPLETE'},{batchId:'other'},{expectedRevision:1},{payload:{...create.payload,qty:6}}]) {
      const r=e.command({...create,...changed});add('full semantic event conflict '+Object.keys(changed)[0],r.code==='event-conflict' && JSON.stringify(e.snapshot())===before);
    }
    const bad=e.command(cmd('wrong-owner','HANDOFF',{owner:'receiver',location:'research:receiver',to:'receiver'}));
    add('wrong custody rejects atomically',bad.code==='custody-conflict' && JSON.stringify(e.snapshot())===before);
    const hand=e.command(cmd('handoff','HANDOFF',{owner:'source',location:'research:source',to:'receiver'}));
    add('handoff has exactly one recipient owner and location',hand.ok && e.snapshot().batches.length===1 && e.snapshot().batches[0].owner==='receiver' && e.snapshot().conservation.ok);
    const done=e.command(cmd('complete','COMPLETE',{owner:'receiver',location:'research:receiver'}));
    const terminal=JSON.stringify(e.snapshot());
    add('research completion conserves terminal quantity',done.ok && e.snapshot().conservation.terminal===7 && e.snapshot().conservation.live===0);
    add('terminal cannot revive',!e.command(cmd('again','HANDOFF',{owner:'receiver',location:'research:receiver',to:'source'})).ok && JSON.stringify(e.snapshot())===terminal);
    manifest.total=99;const view=e.snapshot();view.manifest.total=999;view.batches[0].owner='tampered';create.payload.qty=1;
    add('input and output copies cannot mutate ledger',JSON.stringify(e.snapshot())===terminal);
    add('production receipt is not supported',createShadowCargo049('test',{...manifest,provenance:'production-receipt'}).code==='unsupported-production-receipt');
    const f=createShadowCargo049('freeze-session',{...manifest,total:7}).engine;
    f.command({...create,payload:{commodityId:'food',qty:3,source:'source',destination:'receiver'},sessionId:'freeze-session'});
    const frozen=f.command({eventId:'freeze',sessionId:'freeze-session',batchId:'batch',type:'FREEZE',expectedRevision:1,payload:{owner:'source',location:'research:source',reason:'research interruption'}});
    add('freeze retains quantity and location',frozen.ok && f.snapshot().conservation.live===3 && f.snapshot().unissued===4 && f.snapshot().batches[0].location==='research:source');
    const readA=JSON.stringify(observation049()),readB=JSON.stringify(observation049());
    add('observation never authorizes mint',readA===readB && observation049().eligibleForMint===false);
    // This direct-copy audit deliberately calls no native getter, dispatch, save,
    // ensure or RNG. It runs synchronously, so no simulation step intervenes.
    const nativeState=()=>JSON.stringify({
      tiles,economy482,economy481,logistics485,fin,money,pop,jobs,day,seed,N,goods,fuel,steel,supplies,
      citizens,cars,trains,tramCars,metroCars477,buses,rbuses,roadLoad,roadPass,
      mobility491,transit468,railOps463,transitOps501,transitOpsLast501,amAccessLast502,
      enterprise489,enterpriseRoot489,enterpriseGrace489,spatialLaborRoot491,publicLaborRoot495,publicStaffRoot495,civic495,
      power471,waterCycle472,MOB_ROAD_COMP462,MOB_RAIL_COMP462,MOB_TRAM_COMP462,ACCESS468,PARKING_PRESSURE491,
      dirty:{mobilityDirty462,railOpsDirty463,mobility491Dirty,amDirty502,powerDirty450,powerHVDirty471,waterDirty449,
        waterCycleDirty472,sewerDirty451,sanDirty445,drainDirty454,emergencyDirty455,landDirty,groundDirty,
        resilienceDirty492,incidentDirty493,junctionDirty503,nightTierDirty413},
      busRiders463,railOpsCost463,busOpsCost468,transitRidership,parkingRevenue491,amVersion502,
      undoStack,redoStack,txnHistory460,undoGroup
    },(_key,value)=>value instanceof Map?[...value.entries()]:value instanceof Set?[...value.values()]:
      ArrayBuffer.isView(value)?Array.from(value):value);
    const beforeNative=nativeState(),rngReference=R;
    let cycleOK=false,cycleError=null;
    try {
      const started=start049({manifestId:'runtime-selftest',provenance:'qa-fixture',commodityId:'food',total:2,source:'source',
        custodians:[{id:'source',location:'research:source'},{id:'receiver',location:'research:receiver'}]});
      if(!started.ok)throw new Error('start:'+started.code);
      const command=(eventId,type,payload,expectedRevision)=>({eventId,sessionId:started.sessionId,batchId:'runtime-batch',type,payload,expectedRevision});
      const created=command049(command('runtime-create','CREATE',{commodityId:'food',qty:2,source:'source',destination:'receiver'},0));
      const handed=command049(command('runtime-handoff','HANDOFF',{owner:'source',location:'research:source',to:'receiver'},1));
      const opened=open049(),refreshed=refresh049(),observed=nativeObservation049();
      cycleOK=created.ok&&handed.ok&&opened.ok&&refreshed.ok&&observed.ok&&snapshot049().ledger.conservation.ok;
    } catch(error) { cycleError=String(error?.message||error); }
    finally { end049('selftest-ended-research-cancelled'); }
    add('enabled runtime start CREATE HANDOFF open refresh end',cycleOK);
    add('enabled runtime protected native state byte-identical',nativeState()===beforeNative);
    add('native RNG function unchanged (no cursor claim)',R===rngReference);
    add('end removes panel and session listener and retains cancellation totals only',!engine049&&!world049&&!panel049&&!pagehide049&&panelHandlers049.length===0&&lastEnd049?.cancelled===2);
    return {ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗')),
      runtimeError:cycleError,
      scope:'pure reducer plus synchronous enabled-runtime native-state comparison; storage/RNG-call traps, native lifecycle equivalence, save-roundtrip and screenshots require separate CI evidence'};
  }
  const originalLoad049=load,originalWorld049=newWorld;
  load=function(...args){end049('native-load-attempt-research-cancelled');return originalLoad049.apply(this,args);};
  newWorld=function(...args){end049('native-new-world-research-cancelled');return originalWorld049.apply(this,args);};
  window.GV.shadowCargo049=Object.freeze({start:start049,command:command049,snapshot:snapshot049,
    nativeObservation:nativeObservation049,open:open049,refresh:refresh049,
    end:()=>end049('explicit-end-research-cancelled'),
    disable:()=>{window.__noShadowCargo049=true;return end049('feature-disabled-research-cancelled');},
    selftest:selftest049});
})();
/* GPT-049 LAB01 END */
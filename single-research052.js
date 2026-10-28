/* GPT-052 SINGLE LEDGER BEGIN */
(function installSingleResearch052(){
'use strict';
/* GPT-050 PURE FACTORY BEGIN */

function createWarehouseCargo050(sessionId, inputManifest, inputLimits, inputWarehouse) {
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
  // LAB050: explicit opt-in third custodian, not a native warehouse or another balance.
  let warehouse=null;
  if(inputWarehouse!==undefined) {
    try { warehouse=copyData(inputWarehouse); }catch(_) { return fail('invalid-warehouse-data'); }
    if(!exact(warehouse,['id','commodityId','capacity','maxWaiting']) || !idOK(warehouse.id) ||
      warehouse.id===manifest.source || !custodians.has(warehouse.id) || ![...custodians.keys()].some(id=>id!==manifest.source && id!==warehouse.id) || warehouse.commodityId!=='food' ||
      !positive(warehouse.capacity) || !positive(warehouse.maxWaiting) || warehouse.maxWaiting>8)return fail('invalid-warehouse');
    freezeData(warehouse);
  }
  const storedQuantity=state=>warehouse?[...state.batches.values()].filter(b=>b.owner===warehouse.id).reduce((n,b)=>n+b.qty,0):0;
  let ledger={revision:0,unissued:manifest.total,batches:new Map(),events:new Map(),
    ...(warehouse?{warehouse:{operational:true,reason:null,waiting:[],cancelled:[]}}:{})};
  function warehouseView(state) {
    if(!warehouse)return null;
    const used=storedQuantity(state);
    return {...warehouse,location:custodians.get(warehouse.id).location,used,free:warehouse.capacity-used,
      operational:state.warehouse.operational,reason:state.warehouse.reason,
      waitingInbound:state.warehouse.waiting.map((q,i)=>({...q,reason:i?'fifo-head-blocked':state.batches.get(q.batchId).qty>warehouse.capacity-used?'capacity-insufficient':'capacity-available-retry-required'})),storedBatchIds:[...state.batches.values()].filter(b=>b.owner===warehouse.id).map(b=>b.batchId),
      pendingOutbound:[],cancelledRequests:state.warehouse.cancelled,provenance:'research-capacity-not-native-inventory'};
  }
  function conservation(state) {
    let live=0,terminal=0,valid=Number.isSafeInteger(state.unissued)&&state.unissued>=0;
    valid=valid && state.revision===state.events.size && state.events.size<=limits.maxEvents && state.batches.size<=limits.maxBatches;
    for(const [key,b] of state.batches) {
      const custodian=custodians.get(b.owner),done=b.state==='COMPLETED';
      valid=valid && key===b.batchId && positive(b.qty) && b.commodityId==='food' &&
        b.source===manifest.source && custodians.has(b.destination) && b.destination!==b.source &&
        !!custodian && custodian.location===b.location &&
        ([b.source,b.destination].includes(b.owner) || !!(warehouse && b.owner===warehouse.id && ['WAREHOUSED','FROZEN'].includes(b.state))) &&
        (['SOURCE_READY','HELD','FROZEN','COMPLETED'].includes(b.state) || !!(warehouse && b.state==='WAREHOUSED' && b.owner===warehouse.id)) &&
        (b.state!=='SOURCE_READY' || b.owner===b.source) &&
        (b.state!=='HELD' || b.owner===b.destination) &&
        (!done || b.owner===b.destination) &&
        b.terminalStatus===(done?'research-completed':null) &&
        idOK(b.creationEvent) && state.events.get(b.creationEvent)?.command.type==='CREATE' &&
        state.events.get(b.creationEvent)?.command.batchId===key &&
        Number.isSafeInteger(b.eventSeq) && b.eventSeq>0 && b.eventSeq<=state.revision;
      if(done)terminal+=b.qty;else live+=b.qty;
    }
    if(warehouse) {
      const used=storedQuantity(state),w=state.warehouse,ids=new Set();
      valid=valid && Number.isSafeInteger(used) && used>=0 && used<=warehouse.capacity &&
        !!w && typeof w.operational==='boolean' && w.waiting.length<=warehouse.maxWaiting && w.cancelled.length<=limits.maxBatches;
      for(const q of w.waiting) {
        const b=state.batches.get(q.batchId);
        valid=valid && !ids.has(q.batchId) && !!b && b.state==='SOURCE_READY' &&
          b.owner===q.owner && b.location===q.location && b.eventSeq===q.batchEventSeq &&
          b.qty<=warehouse.capacity && state.events.get(q.requestId)?.command.type==='WH_IN' &&
          !w.cancelled.some(c=>c.batchId===q.batchId);
        ids.add(q.batchId);
      }
      valid=valid && (w.operational || w.waiting.length===0) &&
        [...state.batches.values()].every(b=>b.source!==warehouse.id && b.destination!==warehouse.id);
    }
    const accounted=state.unissued+live+terminal;
    valid=valid && Number.isSafeInteger(live) && Number.isSafeInteger(terminal) && Number.isSafeInteger(accounted) && accounted===manifest.total;
    return {ok:!!valid,total:manifest.total,unissued:state.unissued,live,terminal,accounted};
  }
  function snapshot() {
    return copyData({sessionId,revision:ledger.revision,manifest,unissued:ledger.unissued,
      batches:[...ledger.batches.values()],
      events:[...ledger.events.values()].map(e=>({eventId:e.command.eventId,command:e.command,result:e.result})),
      conservation:conservation(ledger),limits,...(warehouse?{warehouse:warehouseView(ledger)}:{})},32768);
  }
  function command(input) {
    let c;
    try { c=copyData(input); }catch(_) { return fail('invalid-data'); }
    if(!exact(c,['eventId','sessionId','batchId','type','expectedRevision','payload']) || !idOK(c.eventId) || !(idOK(c.batchId) || (warehouse && c.type==='WH_INVALIDATE' && c.batchId===null)))return fail('invalid-command');
    const signature=JSON.stringify(c),previous=ledger.events.get(c.eventId);
    if(previous)return previous.signature===signature?copyData(previous.result):fail('event-conflict');
    if(c.sessionId!==sessionId)return fail('stale-session');
    if(!Number.isSafeInteger(c.expectedRevision) || c.expectedRevision<0)return fail('invalid-revision');
    if(c.expectedRevision!==ledger.revision)return fail('stale-revision');
    if(ledger.events.size>=limits.maxEvents)return fail('event-limit');
    const p=c.payload,old=ledger.batches.get(c.batchId);
    let batch,whNext=warehouse?copyData(ledger.warehouse):null,extraBatches=[],outcome=null,requestId=null;
    const isWarehouseEvent=!!(warehouse && typeof c.type==='string' && c.type.startsWith('WH_'));
    const cancelWaiting=(batchId,reason)=>{
      const row=whNext.waiting.find(q=>q.batchId===batchId);
      if(row){whNext.waiting=whNext.waiting.filter(q=>q!==row);whNext.cancelled.push({...row,reason,cancelEventId:c.eventId});}
    };
    if(isWarehouseEvent) {
      if(c.type==='WH_INVALIDATE') {
        if(c.batchId!==null || !exact(p,['reason']) || typeof p.reason!=='string' || !p.reason.trim() || p.reason.length>160)return fail('invalid-payload');
        if(!whNext.operational)return fail('warehouse-unavailable');
        whNext.operational=false;whNext.reason=p.reason;
        for(const q of [...whNext.waiting])cancelWaiting(q.batchId,'warehouse-invalidated');
        for(const b of ledger.batches.values())if(b.owner===warehouse.id)extraBatches.push({...copyData(b),state:'FROZEN',frozenReason:p.reason,eventSeq:ledger.revision+1});
        outcome='INVALIDATED';
      } else {
        const fields=c.type==='WH_IN'?['owner','location']:c.type==='WH_RETRY'||c.type==='WH_CANCEL'?['owner','location','requestId']:c.type==='WH_OUT'?['owner','location','to']:null;
        if(!fields)return fail('unsupported-command');
        if(!exact(p,fields))return fail('invalid-payload');
        if(!whNext.operational)return fail('warehouse-unavailable');
        if(!old)return fail('batch-unavailable');
        if(old.terminalStatus)return fail('terminal-batch');
        if(old.owner!==p.owner || old.location!==p.location)return fail('custody-conflict');
        if(old.state==='FROZEN')return fail('frozen-batch');
        if(c.type==='WH_OUT') {
          if(old.state!=='WAREHOUSED' || old.owner!==warehouse.id)return fail('invalid-transition');
          if(p.to!==old.destination || !custodians.has(p.to) || p.to===warehouse.id)return fail('destination-unavailable');
          batch={...copyData(old),owner:p.to,location:custodians.get(p.to).location,state:'HELD',eventSeq:ledger.revision+1};
          outcome='OUTBOUND';
        } else {
          if(old.state!=='SOURCE_READY' || old.owner!==old.source)return fail('invalid-transition');
          if(whNext.cancelled.some(q=>q.batchId===c.batchId))return fail('request-cancelled');
          const queued=whNext.waiting.find(q=>q.batchId===c.batchId);
          if(c.type==='WH_CANCEL') {
            if(!queued || p.requestId!==queued.requestId)return fail('request-unavailable');
            requestId=queued.requestId;cancelWaiting(c.batchId,'explicit-cancel');outcome='CANCELLED';
          } else {
            if(old.qty>warehouse.capacity)return fail('batch-exceeds-capacity');
            if(c.type==='WH_IN' && queued)return fail('duplicate-waiting');
            if(c.type==='WH_RETRY') {
              if(!queued || p.requestId!==queued.requestId)return fail('request-unavailable');
              if(whNext.waiting[0]!==queued)return fail('fifo-head-required');
              if(queued.owner!==old.owner || queued.location!==old.location || queued.batchEventSeq!==old.eventSeq)return fail('stale-request');
              requestId=queued.requestId;
            }
            const room=warehouse.capacity-storedQuantity(ledger);
            const mayEnter=old.qty<=room && (c.type==='WH_RETRY' || whNext.waiting.length===0);
            if(mayEnter) {
              if(queued)whNext.waiting.shift();
              batch={...copyData(old),owner:warehouse.id,location:custodians.get(warehouse.id).location,state:'WAREHOUSED',eventSeq:ledger.revision+1};
              outcome='STORED';
            } else {
              if(c.type==='WH_IN') {
                if(whNext.waiting.length>=warehouse.maxWaiting)return fail('waiting-limit');
                requestId=c.eventId;
                whNext.waiting.push({requestId,batchId:c.batchId,owner:old.owner,location:old.location,batchEventSeq:old.eventSeq,
                  reason:whNext.waiting.length?'fifo-head-blocked':'capacity-insufficient'});
              }
              outcome='WAITING';
            }
          }
        }
      }
    } else if(c.type==='CREATE') {
      if(!exact(p,['commodityId','qty','source','destination']))return fail('invalid-payload');
      if(old)return fail('duplicate-batch');
      if(ledger.batches.size>=limits.maxBatches)return fail('batch-limit');
      if(p.commodityId!=='food')return fail('unsupported-commodity');
      if(!positive(p.qty))return fail('invalid-quantity');
      if(p.source!==manifest.source || !custodians.has(p.source))return fail('source-unavailable');
      if(!custodians.has(p.destination) || p.destination===p.source)return fail('destination-unavailable');
      if(p.qty>ledger.unissued)return fail('source-exhausted');
      if(warehouse && (p.source===warehouse.id || p.destination===warehouse.id))return fail('warehouse-admission-required');
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
        if(warehouse && (p.to===warehouse.id || old.owner===warehouse.id))return fail('warehouse-admission-required');
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
      if(warehouse)cancelWaiting(c.batchId,'cargo-state-changed');
    }
    const next={revision:ledger.revision+1,unissued:ledger.unissued-(c.type==='CREATE'?batch.qty:0),
      batches:new Map(ledger.batches),events:new Map(ledger.events),...(warehouse?{warehouse:whNext}:{})};
    const visible=batch||old;
    const result=isWarehouseEvent?
      {ok:true,eventId:c.eventId,sessionId,batchId:c.batchId,type:c.type,revision:next.revision,
        outcome,requestId,warehouseId:warehouse.id,...(visible?{state:visible.state,owner:visible.owner,location:visible.location,qty:visible.qty}:{})}:
      {ok:true,eventId:c.eventId,sessionId,batchId:c.batchId,type:c.type,revision:next.revision,
        state:batch.state,owner:batch.owner,location:batch.location,qty:batch.qty};
    if(batch)next.batches.set(c.batchId,freezeData(batch));
    for(const b of extraBatches)next.batches.set(b.batchId,freezeData(b));
    next.events.set(c.eventId,freezeData({signature,command:c,result}));
    if(!conservation(next).ok)return fail('conservation-violation');
    ledger=next;
    return copyData(result);
  }
  return {ok:true,engine:Object.freeze({command,snapshot})};
}
/* GPT-050 PURE FACTORY END */
// The exact 050 pure reducer above is the only authoritative store used here.
// Historical 049 remains byte-preserved before this block for provenance. Its
// inactive runtime API is replaced synchronously before any caller can start it.
const warning='研究貨單；不影響正式經濟；未保存，重載即遺失。';
const provenance=Object.freeze({nativeMain:'dde12ada3d72110d6a0bef3132eef86b871472ea',
  core:'GPT-050 exact pure factory',role:'single-transient-research-ledger',physicalTransport:false,nativeInventory:false});
let engine=null,world=null,nonce=null,sessionSeq=0,uiSeq=0,lastEnd=null,lastAction=null;
let panel=null,view=null,pagehide=null,handlers=[];
const copy=value=>JSON.parse(JSON.stringify(value));
const fail=code=>({ok:false,code});
function removePanel(){
  const old=panel,registered=handlers;panel=null;view=null;handlers=[];
  for(const [node,type,handler] of registered)try{node.removeEventListener(type,handler);}catch(_){}
  if(old)try{old.remove();}catch(_){}
}
function end(reason='explicit-end-research-cancelled'){
  // Invalidate custody/token first, even if DOM or listener cleanup fails.
  const ending=engine,hide=pagehide;engine=null;world=null;pagehide=null;lastAction=null;
  if(hide)try{window.removeEventListener('pagehide',hide);}catch(_){}
  removePanel();
  if(ending)try{
    const s=ending.snapshot(),c=s.conservation;
    lastEnd={reason,total:c.total,unissued:c.unissued,live:c.live,completed:c.terminal,
      cancelled:c.unissued+c.live,waitingCancelled:s.warehouse?.waitingInbound.length||0,persisted:false,retainedLedger:false};
  }catch(_){lastEnd={reason,total:null,cancelled:null,persisted:false,retainedLedger:false};}
  return {ok:true,active:false,ended:lastEnd?copy(lastEnd):null};
}
function guard(){
  if(window.__noSingleResearch052===true||window.__noShadowCargo049===true||window.__noShadowWarehouse050===true){end('feature-disabled-research-cancelled');return 'disabled';}
  if(engine&&world!==tiles){end('world-replaced-research-cancelled');return 'stale-world';}
  return null;
}
function snapshot(){
  const blocked=guard();
  return {ok:!blocked,...(blocked?{code:blocked}:{}),active:!!engine,persisted:false,
    provenance:copy(provenance),ledger:engine?engine.snapshot():null,ended:lastEnd?copy(lastEnd):null};
}
function start(manifest,warehouse,limits){
  const blocked=guard();if(blocked)return fail(blocked);
  if(engine)return fail('session-already-active');
  if(!Array.isArray(tiles)||!tiles.length)return fail('world-unavailable');
  if(sessionSeq>=Number.MAX_SAFE_INTEGER)return fail('session-limit');
  if(!nonce)try{
    const bytes=new Uint8Array(12);window.crypto.getRandomValues(bytes);
    nonce=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
  }catch(_){return fail('secure-document-identity-unavailable');}
  const sessionId='lab052:'+nonce+':'+(sessionSeq+1);
  const built=createWarehouseCargo050(sessionId,manifest,limits,warehouse);
  if(!built.ok)return built;
  const hide=()=>end('pagehide-research-cancelled');
  try{window.addEventListener('pagehide',hide);}catch(_){return fail('lifecycle-listener-unavailable');}
  sessionSeq++;engine=built.engine;world=tiles;pagehide=hide;lastEnd=null;lastAction=null;uiSeq=0;
  return {ok:true,sessionId,ledger:engine.snapshot(),warning};
}
function command(input){
  const blocked=guard();if(blocked)return fail(blocked);
  if(!engine)return fail('session-unavailable');
  const before=engine.snapshot().revision,result=engine.command(input);
  lastAction={...copy(result),replayed:!!(result.ok&&before===engine.snapshot().revision)};
  if(panel)try{refresh();}catch(_){removePanel();}
  return result;
}
function nativeObservation(){
  const blocked=guard();if(blocked)return {ok:false,code:blocked,ready:false,eligibleForMint:false};
  const e=economy482,food=e?.commodities?.food,nativeReady=e?.ready===true,stale=nativeReady&&e.day!==day;
  const ready=!!(tiles&&nativeReady&&!stale&&food&&food.id==='food');
  return {ok:true,baselineSha:'020e3c096974be64680142297423de9a51d4bb8b',nativeIndexBlob:'f049d7e5724e7567cc73e1af0d8fcda0a4a3b64b',
    provenanceRole:'verified-native-baseline-not-candidate-head',day,seed,N,version:GAME_VER,observedDay:Number.isFinite(e?.day)?e.day:null,
    ready,stale,status:ready?'available':stale?'stale':'unavailable',granularity:'city-rounded-daily-flow',
    eligibleForMint:false,productionReceiptSupported:false,food:ready?copy(food):null};
}
function demo(){
  const m={manifestId:'explicit-QA-20-food',provenance:'qa-fixture',commodityId:'food',total:20,source:'research-source',
    custodians:[{id:'research-source',location:'research-source-shelf'},{id:'research-warehouse-A',location:'research-warehouse-shelf'},
      {id:'research-receiver',location:'research-receiver-shelf'}]};
  const started=start(m,{id:'research-warehouse-A',commodityId:'food',capacity:10,maxWaiting:8});
  if(!started.ok)return started;
  for(const [id,qty] of [['batch-A',7],['batch-B',8]]){
    const s=engine.snapshot();
    const result=command({eventId:'QA-create-'+id,sessionId:s.sessionId,batchId:id,type:'CREATE',expectedRevision:s.revision,
      payload:{commodityId:'food',qty,source:'research-source',destination:'research-receiver'}});
    if(!result.ok){end('QA-setup-failed-research-cancelled');return result;}
  }
  return {ok:true,sessionId:started.sessionId,ledger:engine.snapshot(),warning};
}
function operation(type,batchId){
  const blocked=guard();if(blocked)return fail(blocked);
  if(!engine)return fail('session-unavailable');
  const s=engine.snapshot(),b=s.batches.find(b=>b.batchId===batchId);
  if(!b)return fail('batch-unavailable');
  const payload={owner:b.owner,location:b.location};
  if(type==='WH_OUT')payload.to=b.destination;
  if(type==='WH_RETRY'||type==='WH_CANCEL')payload.requestId=s.warehouse?.waitingInbound.find(q=>q.batchId===batchId)?.requestId||'missing-request';
  return command({eventId:'ui-'+(++uiSeq),sessionId:s.sessionId,batchId,type,expectedRevision:s.revision,payload});
}
function queueOperation(type){
  const blocked=guard();if(blocked)return fail(blocked);
  const row=engine?.snapshot().warehouse?.waitingInbound[0];
  return row?operation(type,row.batchId):fail('request-unavailable');
}
function refresh(){
  const blocked=guard();if(blocked)return fail(blocked);
  if(!engine)return fail('session-unavailable');
  if(!view)return fail('panel-not-open');
  const s=engine.snapshot(),w=s.warehouse;
  view.json.textContent=JSON.stringify({warning,provenance,ledger:s,nativeObservation:nativeObservation(),lastAction},null,2);
  if(w){
    view.capacity.textContent='QA 研究容量：'+w.used+'／'+w.capacity+' · 可用：'+w.free;
    view.bar.max=w.capacity;view.bar.value=w.used;view.bar.setAttribute('aria-valuetext',w.used+' / '+w.capacity);
    view.status.textContent=!w.operational?'研究倉庫失效：'+w.reason:w.waitingInbound.length?
      (s.batches.find(b=>b.batchId===w.waitingInbound[0].batchId).qty>w.free?'空間不足，等待出庫':'容量已釋放，可重試隊首'):
      w.free===0?'倉庫已滿，等待出庫':'可接收研究貨物';
    view.conservation.textContent='守恆：'+(s.conservation.ok?'正常':'失敗')+' · '+s.manifest.total+' = 未發行 '+s.unissued+' + 活躍 '+s.conservation.live+' + 終態 '+s.conservation.terminal;
    view.rows.replaceChildren();
    for(const b of s.batches){
      const row=document.createElement('div'),queued=w.waitingInbound.find(q=>q.batchId===b.batchId);row.dataset.batchId=b.batchId;
      row.textContent=b.batchId+' · '+b.qty+' food'+(queued?' · 等待 #'+(w.waitingInbound.indexOf(queued)+1):'')+'\n'+b.owner+' / '+b.location;
      Object.assign(row.style,{whiteSpace:'pre-wrap',overflowWrap:'anywhere',padding:'6px 0',borderBottom:'1px solid #52665d'});view.rows.appendChild(row);
    }
    view.queue.textContent='待入庫：'+(w.waitingInbound.length?w.waitingInbound.map(q=>q.batchId).join(' → '):'無')+' · FIFO · 無實體運輸';
    view.action.textContent=lastAction?(lastAction.ok?(lastAction.replayed?'歷史事件重放：':'最近操作：')+(lastAction.outcome||lastAction.type):'拒絕：'+lastAction.code):'明示 QA：food20／A7／B8／未發5；不是正式倉容或平衡。';
    for(const [id,label,batchId] of [['InA','A 入庫','batch-A'],['InB','B 申請入庫','batch-B'],['OutA','A 出庫','batch-A']]){
      const b=s.batches.find(b=>b.batchId===batchId);view.buttons[id].textContent=label+(b?'（'+b.qty+'）':'（無此批次）');view.buttons[id].disabled=!b;
    }
  }
  return {ok:true,active:true,revision:s.revision};
}
function open(){
  const blocked=guard();if(blocked)return fail(blocked);
  if(!engine)return fail('session-unavailable');
  if(panel)return refresh();
  try{
    const capacityMode=!!engine.snapshot().warehouse;
    const el=(tag,id,text)=>{const n=document.createElement(tag);if(id)n.id=id;if(text)n.textContent=text;return n;};
    const p=el('section','shadowCargo049Panel');p.setAttribute('role','dialog');p.setAttribute('aria-modal','false');p.setAttribute('aria-labelledby','shadowCargo049Title');
    Object.assign(p.style,{position:'fixed',right:'12px',bottom:'12px',width:'min(460px, calc(100vw - 24px))',
      maxHeight:capacityMode?'min(84vh, 760px)':'min(70vh, 620px)',boxSizing:'border-box',display:'flex',flexDirection:'column',gap:'8px',
      padding:'12px',border:'2px solid #b4d0c4',borderRadius:'8px',background:'#15251f',color:'#f1f6f3',font:'14px/1.4 system-ui, sans-serif',zIndex:'10000',overscrollBehavior:'contain',touchAction:'pan-y'});
    const h=el('h2','shadowCargo049Title',capacityMode?'單一研究帳 · QA 容量閉環':'單一研究帳 · 049 相容模式');Object.assign(h.style,{margin:'0',fontSize:'17px'});
    const note=el('p',null,warning);Object.assign(note.style,{margin:'0',fontSize:'13px'});
    const scroll=el('div','singleResearch052Scroll');Object.assign(scroll.style,{overflow:'auto',minHeight:'0',display:'flex',flexDirection:'column',gap:'8px',overscrollBehavior:'contain'});
    const json=el('pre','singleResearch052JSON');Object.assign(json.style,{margin:'0',overflow:'auto',whiteSpace:'pre-wrap',overflowWrap:'anywhere',font:'12px/1.4 monospace',minHeight:'0',overscrollBehavior:'contain'});
    const buttons=el('div','singleResearch052Buttons');Object.assign(buttons.style,{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',flexShrink:'0'});
    panel=p;view={json,buttons:{}};
    const on=(node,type,fn)=>{node.addEventListener(type,fn);handlers.push([node,type,fn]);};
    const addButton=(id,label,fn)=>{const b=el('button',id,label);b.type='button';Object.assign(b.style,{minHeight:'44px',cursor:'pointer',font:'inherit',padding:'6px'});on(b,'click',fn);buttons.appendChild(b);return b;};
    if(capacityMode){
      const capacity=el('strong','singleResearch052Capacity'),bar=el('progress','singleResearch052Bar'),status=el('strong','singleResearch052Status'),
        conservation=el('div','singleResearch052Conservation'),rows=el('div','singleResearch052Batches'),queue=el('div','singleResearch052Queue'),action=el('div','singleResearch052Action');
      Object.assign(bar.style,{width:'100%',height:'24px',accentColor:'#80c9a6'});
      const details=el('details','singleResearch052Details'),summary=el('summary',null,'展開原始事件帳 JSON（診斷）');json.style.maxHeight='180px';
      details.append(summary,json);scroll.append(capacity,bar,status,conservation,rows,queue,action,details);
      Object.assign(view,{capacity,bar,status,conservation,rows,queue,action});
      for(const [id,label,fn] of [['InA','A 入庫',()=>operation('WH_IN','batch-A')],['InB','B 申請入庫',()=>operation('WH_IN','batch-B')],
        ['OutA','A 出庫',()=>operation('WH_OUT','batch-A')],['Retry','重試 FIFO 隊首',()=>queueOperation('WH_RETRY')],['Cancel','取消隊首等待',()=>queueOperation('WH_CANCEL')]])
        view.buttons[id]=addButton('singleResearch052'+id,label,fn);
    }else{
      scroll.style.flex='1';json.style.maxHeight='none';scroll.appendChild(json);
    }
    addButton('shadowCargo049Refresh','重新讀取（唯讀）',()=>refresh());
    addButton('shadowCargo049End','結束研究（未保存）',()=>end('panel-ended-research-cancelled'));
    p.append(h,note,scroll,buttons);
    for(const type of ['pointerdown','pointerup','pointermove','pointercancel','mousedown','mouseup','mousemove','touchstart','touchmove','touchend','touchcancel','click','dblclick','wheel','keyup'])on(p,type,e=>e.stopPropagation());
    on(p,'keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();end('panel-ended-research-cancelled');}});
    document.body.appendChild(p);return refresh();
  }catch(_){removePanel();return fail('panel-unavailable');}
}
function selftest(){
  const blocked=guard();if(blocked)return fail(blocked);
  if(engine)return fail('active-session-not-modified');
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]);
  try{
    const r=demo();add('explicit QA start',r.ok);
    if(r.ok){
      const values=[engine.snapshot().warehouse.used];
      for(const [type,id] of [['WH_IN','batch-A'],['WH_IN','batch-B'],['WH_OUT','batch-A'],['WH_RETRY','batch-B']]){add(type,operation(type,id).ok);values.push(engine.snapshot().warehouse.used);}
      const s=engine.snapshot();add('capacity sequence',JSON.stringify(values)==='[0,7,7,0,8]');
      add('conservation20 remainder5',s.conservation.ok&&s.conservation.accounted===20&&s.unissued===5&&s.batches.length===2);
      add('one shared API',window.GV.shadowCargo049===window.GV.singleResearch052&&window.GV.shadowWarehouse050===window.GV.singleResearch052);
    }
  }finally{end('selftest-ended-research-cancelled');}
  return {ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))};
}
// Native delegates preserve this/arguments/return/exception even under cleanup faults.
const nativeLoad052=load,nativeWorld052=newWorld;
load=function(...args){try{end('load-entry-research-cancelled');}catch(_){}return nativeLoad052.apply(this,args);};
newWorld=function(...args){try{end('new-world-entry-research-cancelled');}catch(_){}return nativeWorld052.apply(this,args);};
const api=Object.freeze({start,command,snapshot,nativeObservation,demo,open,refresh,selftest,
  end:()=>end('explicit-end-research-cancelled'),
  disable(){window.__noShadowCargo049=true;return end('explicit-disable-research-cancelled');},warning,provenance});
window.GV.shadowCargo049=api;window.GV.shadowWarehouse050=api;window.GV.singleResearch052=api;
})();
/* GPT-052 SINGLE LEDGER END */

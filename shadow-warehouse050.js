/* GPT-050 LAB02 BEGIN */
/* Independent research candidate, NOT imported by native index.html.
 * Explicit additive derivative of LAB01 ff4a767a10502378b8e1bb387d2a5ed3b608ecbb.
 * Exact upstream reference lives under docs/branch/GPT-050-qa. No live-session migration.
 * Compatibility mode preserves 049 contracts; configured mode has one private ledger.
 */
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

/* GPT-050 RUNTIME BEGIN */
(function installShadowWarehouse050(){
  'use strict';
  const warning='研究貨單；不影響正式經濟；未保存，重載即遺失。';
  const provenance={upstream:'ff4a767a10502378b8e1bb387d2a5ed3b608ecbb',nativeMain:'020e3c096974be64680142297423de9a51d4bb8b',
    role:'isolated-native-QA-composition-not-main-integration',model:'explicit-LAB01-derived-warehouse-extension',physicalTransport:false,nativeInventory:false};
  let engine=null,world=null,lastEnd=null,nonce=null,sessionSeq=0,uiSeq=0,pagehide=null,panel=null,view=null,handlers=[],lastAction=null;
  const copy=value=>JSON.parse(JSON.stringify(value));
  function removePanel() {
    for(const [node,type,handler] of handlers)try{node.removeEventListener(type,handler);}catch(_){}
    handlers=[];if(panel)try{panel.remove();}catch(_){}panel=null;view=null;
  }
  function end(reason='explicit-research-cancelled') {
    const ending=engine;engine=null;world=null;
    if(pagehide)try{window.removeEventListener('pagehide',pagehide);}catch(_){}
    pagehide=null;removePanel();lastAction=null;
    if(ending) {
      try {
        const s=ending.snapshot(),c=s.conservation;
        lastEnd={reason,total:c.total,unissued:c.unissued,active:c.live,completed:c.terminal,
          cancelled:c.unissued+c.live,waitingCancelled:s.warehouse.waitingInbound.length,persisted:false,retainedLedger:false};
      }catch(_){lastEnd={reason,total:null,cancelled:null,persisted:false,retainedLedger:false};}
    }
    return {ok:true,active:false,ended:lastEnd?copy(lastEnd):null};
  }
  function guard() {
    if(window.__noShadowWarehouse050===true){end('feature-disabled-research-cancelled');return 'disabled';}
    if(engine && world!==tiles){end('world-replaced-research-cancelled');return 'stale-world';}
    return null;
  }
  function snapshot() {
    const blocked=guard();
    return {ok:!blocked,...(blocked?{code:blocked}:{}),active:!!engine,persisted:false,provenance:copy(provenance),
      ledger:engine?engine.snapshot():null,ended:lastEnd?copy(lastEnd):null};
  }
  function start(manifest,warehouse) {
    const blocked=guard();if(blocked)return {ok:false,code:blocked};
    if(engine)return {ok:false,code:'session-already-active'};
    if(!Array.isArray(tiles)||!tiles.length)return {ok:false,code:'world-unavailable'};
    if(warehouse===undefined)return {ok:false,code:'warehouse-required'};
    if(sessionSeq>=Number.MAX_SAFE_INTEGER)return {ok:false,code:'session-limit'};
    const checked=createWarehouseCargo050('validation-only',manifest,undefined,warehouse);
    if(!checked.ok)return checked;
    if(!nonce) {
      try {
        const bytes=new Uint8Array(12);window.crypto.getRandomValues(bytes);
        nonce=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
      }catch(_){return {ok:false,code:'secure-document-identity-unavailable'};}
    }
    const sessionId='lab050:'+nonce+':'+(sessionSeq+1),s=checked.engine.snapshot();
    const built=createWarehouseCargo050(sessionId,s.manifest,undefined,{id:s.warehouse.id,commodityId:s.warehouse.commodityId,capacity:s.warehouse.capacity,maxWaiting:s.warehouse.maxWaiting});
    if(!built.ok)return built;
    const hide=()=>end('pagehide-research-cancelled');
    try{window.addEventListener('pagehide',hide);}catch(_){return {ok:false,code:'lifecycle-listener-unavailable'};}
    sessionSeq++;engine=built.engine;world=tiles;pagehide=hide;lastEnd=null;uiSeq=0;lastAction=null;
    return {ok:true,sessionId,ledger:engine.snapshot(),warning};
  }
  function command(input) {
    const blocked=guard();if(blocked)return {ok:false,code:blocked};
    if(!engine)return {ok:false,code:'session-unavailable'};
    const beforeRevision=engine.snapshot().revision;const r=engine.command(input);lastAction={...copy(r),replayed:!!(r.ok && beforeRevision===engine.snapshot().revision)};if(panel)try{refresh();}catch(_){removePanel();}return r;
  }
  function demo() {
    const manifest={manifestId:'warehouse-demo-20-food',provenance:'research-manifest',commodityId:'food',total:20,source:'research-source',
      custodians:[{id:'research-source',location:'research-source-shelf'},{id:'research-warehouse-A',location:'research-warehouse-shelf'},{id:'research-receiver',location:'research-receiver-shelf'}]};
    const r=start(manifest,{id:'research-warehouse-A',commodityId:'food',capacity:10,maxWaiting:8});
    if(!r.ok)return r;
    for(const [id,qty] of [['batch-A',7],['batch-B',8]]) {
      const s=engine.snapshot(),c={eventId:'demo-create-'+id,sessionId:s.sessionId,batchId:id,type:'CREATE',expectedRevision:s.revision,
        payload:{commodityId:'food',qty,source:'research-source',destination:'research-receiver'}};
      const made=command(c);if(!made.ok){end('demo-setup-failed-research-cancelled');return made;}
    }
    return {ok:true,sessionId:r.sessionId,ledger:engine.snapshot(),warning};
  }
  function operation(type,batchId) {
    const blocked=guard();if(blocked)return {ok:false,code:blocked};
    if(!engine)return {ok:false,code:'session-unavailable'};
    const s=engine.snapshot(),b=s.batches.find(q=>q.batchId===batchId);
    if(!b)return {ok:false,code:'batch-unavailable'};
    const payload={owner:b.owner,location:b.location};
    if(type==='WH_OUT')payload.to=b.destination;
    if(type==='WH_RETRY'||type==='WH_CANCEL')payload.requestId=s.warehouse.waitingInbound.find(q=>q.batchId===batchId)?.requestId||'missing-request';
    return command({eventId:'ui-'+(++uiSeq),sessionId:s.sessionId,batchId,type,expectedRevision:s.revision,payload});
  }
  function refresh() {
    const blocked=guard();if(blocked)return {ok:false,code:blocked};
    if(!engine)return {ok:false,code:'session-unavailable'};
    if(!view)return {ok:false,code:'panel-not-open'};
    const s=engine.snapshot(),w=s.warehouse;
    view.title.textContent='LAB-02 研究倉庫 · '+w.id;
    for(const [key,label,batchId] of [['InA','A 入庫','batch-A'],['InB','B 申請入庫','batch-B'],['OutA','A 出庫','batch-A']]){const b=s.batches.find(b=>b.batchId===batchId);view.buttons[key].textContent=label+(b?'（'+b.qty+'）':'（本session無此批次）');view.buttons[key].disabled=!b;}
    view.capacity.textContent='容量：'+w.used+'／'+w.capacity+' · 可用：'+w.free;
    view.bar.max=w.capacity;view.bar.value=w.used;view.bar.setAttribute('aria-valuetext',w.used+' / '+w.capacity);
    view.status.textContent=!w.operational?'倉庫失效：'+w.reason:w.waitingInbound.length?
      (s.batches.find(b=>b.batchId===w.waitingInbound[0].batchId).qty>w.free?'空間不足，等待出庫':'容量已釋放，可重試隊首'):w.free===0?'倉庫已滿，等待出庫':'可接收研究貨物';
    view.conservation.textContent='守恆：'+(s.conservation.ok?'正常':'失敗')+' · '+s.manifest.total+' = 未發行 '+s.unissued+' + 活躍 '+s.conservation.live+' + 終態 '+s.conservation.terminal;
    view.rows.replaceChildren();
    for(const b of s.batches) {
      const row=document.createElement('div');row.dataset.batchId=b.batchId;
      const queued=w.waitingInbound.find(q=>q.batchId===b.batchId);
      row.textContent=b.batchId+' · '+b.qty+' food · '+(b.owner===w.id?'已入庫':b.owner===b.source?'仍在來源':'已出庫至接收者')+
        (queued?' · 等待 #'+(w.waitingInbound.indexOf(queued)+1):'')+'\n'+b.owner+' / '+b.location;
      row.style.whiteSpace='pre-wrap';row.style.overflowWrap='anywhere';row.style.padding='7px 0';row.style.borderBottom='1px solid #52665d';
      view.rows.appendChild(row);
    }
    view.queue.textContent='待入庫：'+(w.waitingInbound.length?w.waitingInbound.map(q=>{const b=s.batches.find(b=>b.batchId===q.batchId);return b.batchId+'（'+b.qty+'）';}).join(' → '):'無')+
      ' · FIFO · 出庫預約：0（原子交接）';
    view.action.textContent=lastAction?(lastAction.ok?(lastAction.replayed?'歷史事件重放（未新增作業）：':'最近操作：')+(lastAction.outcome||lastAction.type):'操作拒絕：'+lastAction.code):'研究容量；沒有實體運輸或原生庫存。';
    view.json.textContent=JSON.stringify({warning,provenance,ledger:s,lastAction},null,2);
    return {ok:true,revision:s.revision,used:w.used,waiting:w.waitingInbound.length};
  }
  function open() {
    const blocked=guard();if(blocked)return {ok:false,code:blocked};
    if(!engine)return {ok:false,code:'session-unavailable'};
    if(panel)return refresh();
    try {
      const p=document.createElement('section');p.id='shadowWarehouse050Panel';p.setAttribute('role','dialog');p.setAttribute('aria-modal','false');p.setAttribute('aria-labelledby','shadowWarehouse050Title');
      Object.assign(p.style,{position:'fixed',right:'12px',bottom:'12px',width:'min(460px, calc(100vw - 24px))',maxHeight:'min(84vh, 760px)',
        boxSizing:'border-box',display:'flex',flexDirection:'column',gap:'8px',padding:'12px',border:'2px solid #b4d0c4',borderRadius:'8px',
        background:'#15251f',color:'#f1f6f3',font:'14px/1.4 system-ui, sans-serif',zIndex:'10000'});
      const el=(tag,id,text)=>{const n=document.createElement(tag);if(id)n.id=id;if(text)n.textContent=text;return n;};
      const h=el('h2','shadowWarehouse050Title','LAB-02 研究倉庫 A');Object.assign(h.style,{margin:'0',fontSize:'17px',overflowWrap:'anywhere'});
      const note=el('p','shadowWarehouse050Warning',warning);Object.assign(note.style,{margin:'0',fontSize:'13px'});
      const scroll=el('div','shadowWarehouse050Scroll');Object.assign(scroll.style,{overflow:'auto',minHeight:'0',display:'flex',flexDirection:'column',gap:'8px'});
      const capacity=el('strong','shadowWarehouse050Capacity'),bar=el('progress','shadowWarehouse050Bar');Object.assign(bar.style,{width:'100%',height:'24px',accentColor:'#80c9a6'});
      const status=el('strong','shadowWarehouse050Status'),conservation=el('div','shadowWarehouse050Conservation'),rows=el('div','shadowWarehouse050Batches'),
        queue=el('div','shadowWarehouse050Queue'),action=el('div','shadowWarehouse050Action');
      const details=el('details','shadowWarehouse050Details'),summary=el('summary',null,'展開原始事件帳 JSON（診斷）'),json=el('pre','shadowWarehouse050JSON');
      Object.assign(json.style,{margin:'6px 0 0',maxHeight:'180px',overflow:'auto',whiteSpace:'pre-wrap',overflowWrap:'anywhere',font:'11px/1.35 monospace'});
      details.append(summary,json);scroll.append(capacity,bar,status,conservation,rows,queue,action,details);
      const buttons=el('div','shadowWarehouse050Buttons');Object.assign(buttons.style,{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',flexShrink:'0'});
      const buttonMap={};
      const on=(n,t,f)=>{n.addEventListener(t,f);handlers.push([n,t,f]);};
      for(const [id,label,fn] of [
        ['InA','A 入庫（7）',()=>operation('WH_IN','batch-A')],
        ['InB','B 申請入庫（8）',()=>operation('WH_IN','batch-B')],
        ['OutA','A 出庫',()=>operation('WH_OUT','batch-A')],
        ['Retry','重試 FIFO 隊首',()=>{if(guard())return;const q=engine?.snapshot().warehouse.waitingInbound[0];if(q)operation('WH_RETRY',q.batchId);}],
        ['Cancel','取消隊首等待',()=>{if(guard())return;const q=engine?.snapshot().warehouse.waitingInbound[0];if(q)operation('WH_CANCEL',q.batchId);}],
        ['End','結束研究（未保存）',()=>end('panel-ended-research-cancelled')]
      ]) {
        const b=el('button','shadowWarehouse050'+id,label);b.type='button';Object.assign(b.style,{minHeight:'44px',cursor:'pointer',font:'inherit',padding:'6px'});on(b,'click',fn);buttons.appendChild(b);buttonMap[id]=b;
      }
      p.append(h,note,scroll,buttons);panel=p;view={title:h,buttons:buttonMap,capacity,bar,status,conservation,rows,queue,action,json};
      for(const type of ['pointerdown','pointerup','click','dblclick','wheel'])on(p,type,e=>e.stopPropagation());
      on(p,'keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();end('panel-ended-research-cancelled');}});
      document.body.appendChild(p);return refresh();
    }catch(_){removePanel();return {ok:false,code:'panel-unavailable'};}
  }
  function selftest() {
    if(guard())return {ok:false,code:'disabled-or-stale'};
    if(engine)return {ok:false,code:'active-session-not-modified'};
    const m={manifestId:'selftest-050',provenance:'qa-fixture',commodityId:'food',total:20,source:'src',
      custodians:[{id:'src',location:'s'},{id:'wh',location:'w'},{id:'dst',location:'d'}]};
    const made=createWarehouseCargo050('selftest-050',m,undefined,{id:'wh',commodityId:'food',capacity:10,maxWaiting:8});
    if(!made.ok)return made;
    const e=made.engine,send=(id,type,payload)=>{const s=e.snapshot();return e.command({eventId:'s'+s.revision,sessionId:s.sessionId,batchId:id,type,expectedRevision:s.revision,payload});};
    send('A','CREATE',{commodityId:'food',qty:7,source:'src',destination:'dst'});send('B','CREATE',{commodityId:'food',qty:8,source:'src',destination:'dst'});
    send('A','WH_IN',{owner:'src',location:'s'});send('B','WH_IN',{owner:'src',location:'s'});
    const wait=e.snapshot();send('A','WH_OUT',{owner:'wh',location:'w',to:'dst'});const released=e.snapshot();
    send('B','WH_RETRY',{owner:'src',location:'s',requestId:wait.warehouse.waitingInbound[0].requestId});
    const s=e.snapshot();
    return {ok:wait.warehouse.used===7&&released.warehouse.used===0&&s.warehouse.used===8&&s.unissued===5&&s.conservation.ok,
      expected:[7,7,0,8],actual:[wait.warehouse.used,wait.warehouse.used,released.warehouse.used,s.warehouse.used]};
  }
  const nativeLoad050=load,nativeNewWorld050=newWorld;
  load=function(...args){end('load-entry-research-cancelled');return nativeLoad050.apply(this,args);};
  newWorld=function(...args){end('new-world-entry-research-cancelled');return nativeNewWorld050.apply(this,args);};
  window.GV=window.GV||{};
  window.GV.shadowWarehouse050=Object.freeze({start,command,snapshot,demo,open,refresh,end:()=>end('explicit-research-cancelled'),selftest,
    disable(){window.__noShadowWarehouse050=true;return end('explicit-disable-research-cancelled');},warning,provenance:Object.freeze(provenance)});
})();
/* GPT-050 RUNTIME END */
/* GPT-050 LAB02 END */


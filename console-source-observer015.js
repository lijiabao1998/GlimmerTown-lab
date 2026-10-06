'use strict';
// Additive, pure-data CDP observer. This file never launches or evaluates a game,
// intercepts a request, rewrites a log, or changes the existing console gate.
const DEFAULT_OFFICIAL='https://lijiabao1998.github.io/GlimmerTown-lab/';
const NETWORK_EVENTS=new Set(['Network.requestWillBeSent','Network.responseReceived',
 'Network.responseReceivedExtraInfo','Network.loadingFinished','Network.loadingFailed',
 'Network.requestServedFromCache']);
const CONTEXT_EVENTS=new Set(['Page.frameNavigated','Runtime.executionContextCreated',
 'Runtime.executionContextDestroyed','Runtime.executionContextsCleared',
 'ServiceWorker.workerErrorReported','ServiceWorker.workerRegistrationUpdated',
 'ServiceWorker.workerVersionUpdated']);
const clone=value=>JSON.parse(JSON.stringify(value));
const pick=(value,keys)=>Object.fromEntries(keys.filter(k=>value?.[k]!==undefined).map(k=>[k,clone(value[k])]));
const key=(row,id)=>JSON.stringify([row.sessionId,id]);
const consoleText=p=>(p.args||[]).map(a=>a.value??a.description??'').join(' ');
function projectedParams(method,p){
 if(method==='Network.requestWillBeSent')return {
  ...pick(p,['requestId','loaderId','documentURL','timestamp','wallTime','initiator','type','frameId','hasUserGesture','redirectHasExtraInfo']),
  request:pick(p.request,['url','method','initialPriority','referrerPolicy','mixedContentType']),
  ...(p.redirectResponse?{redirectResponse:projectedResponse(p.redirectResponse)}:{})};
 if(method==='Network.responseReceived')return {...pick(p,['requestId','loaderId','timestamp','type','frameId','hasExtraInfo']),response:projectedResponse(p.response)};
 // No cookie/authentication/request body capture is needed for attribution.
 if(method==='Network.responseReceivedExtraInfo')return pick(p,['requestId','statusCode','resourceIPAddressSpace']);
 return clone(p);
}
function projectedResponse(r){return pick(r,['url','status','statusText','mimeType','protocol',
 'securityState','fromDiskCache','fromServiceWorker','fromPrefetchCache','encodedDataLength','timing']);}
function createConsoleSourceObserver015({officialURL=DEFAULT_OFFICIAL,now=()=>Date.now()}={}){
 const events=[],captureFailures=[],capabilities=[];let phase='before-navigation';
 return {
  mark(label){if(typeof label!=='string'||!label)throw Error('nonempty observation phase required');phase=label;},
  observe(message){
   try{
    const method=message?.method,p=message?.params||{};
    const diagnostic=method==='Log.entryAdded'&&['error','warning'].includes(p.entry?.level)||
     method==='Runtime.consoleAPICalled'&&['error','warning'].includes(p.type)||method==='Runtime.exceptionThrown';
    if(!NETWORK_EVENTS.has(method)&&!CONTEXT_EVENTS.has(method)&&!diagnostic)return false;
    events.push({sequence:events.length+1,sessionId:message.sessionId||'page',phase,
     observedAtEpochMs:now(),method,params:projectedParams(method,p)});return true;
   }catch(error){captureFailures.push({phase,method:message?.method||null,error:String(error)});return false;}
  },
  capability(method,ok,error=null){capabilities.push({method,ok:!!ok,error:error===null?null:String(error)});},
  snapshot(){const raw={schema:'glimmer-console-source-observation/015',officialURL,
   timestampUnits:{observedAtEpochMs:'host epoch milliseconds',networkTimestamp:'CDP monotonic seconds',networkWallTime:'CDP epoch seconds',logAndConsoleTimestamp:'CDP epoch milliseconds'},
   capabilities:clone(capabilities),captureFailures:clone(captureFailures),events:clone(events)};
   return {...raw,analysis:analyzeConsoleSources015(raw)};}
 };
}
// Call only inside an existing isolated GitHub Actions browser run, before the
// first navigation. Network, Log, Runtime and Page enable remain the caller's
// unchanged duties. Failure to enable is recorded and must be disclosed.
async function enableConsoleSourceDomains015(cdp,observer){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('CI only: no local browser execution');
 for(const [method,params] of [['ServiceWorker.enable',{}],['Network.setAttachDebugStack',{enabled:true}]]){
  try{await cdp.send(method,params);observer.capability(method,true);}
  catch(error){observer.capability(method,false,error);}
 }
}
function analyzeConsoleSources015(raw){
 const events=raw.events||[],byRequest=new Map(),browserErrors=[],swErrors=[],registrationWarnings=[],warnings=[];
 for(const row of events){
  const p=row.params||{};
  if(row.method.startsWith('Network.')&&p.requestId!==undefined){const k=key(row,p.requestId);if(!byRequest.has(k))byRequest.set(k,[]);byRequest.get(k).push(row);}
  if(row.method==='Log.entryAdded'&&p.entry?.level==='error')browserErrors.push(row);
  if(row.method==='ServiceWorker.workerErrorReported')swErrors.push({sequence:row.sequence,sessionId:row.sessionId,phase:row.phase,...clone(p.errorMessage||{})});
  if(row.method==='Runtime.consoleAPICalled'&&p.type==='warning'){
   const text=consoleText(p),match=/Failed to register a ServiceWorker for scope \('([^']+)'\) with script \('([^']+)'\): (.+)/.exec(text);
   if(match)registrationWarnings.push({sequence:row.sequence,sessionId:row.sessionId,phase:row.phase,
    timestamp:p.timestamp,scopeURL:match[1],scriptURL:match[2],message:match[3],stackTrace:clone(p.stackTrace||{}),evidence:'explicit URL in native registration rejection; not Network.responseReceived proof'});
  }
  if(row.method==='Log.entryAdded'&&p.entry?.level==='warning')warnings.push({row,entry:p.entry});
  if(row.method==='Runtime.consoleAPICalled'&&p.type==='warning')warnings.push({row,entry:{...p,text:consoleText(p)}});
 }
 const requests=[...byRequest.entries()].map(([requestKey,rows])=>({requestKey,sessionId:rows[0].sessionId,requestId:rows[0].params.requestId,
  eventSequences:rows.map(r=>r.sequence),requests:rows.filter(r=>r.method==='Network.requestWillBeSent').map(r=>({sequence:r.sequence,phase:r.phase,...clone(r.params)})),
  responses:rows.filter(r=>r.method==='Network.responseReceived').map(r=>({sequence:r.sequence,phase:r.phase,...clone(r.params)})),
  extraResponses:rows.filter(r=>r.method==='Network.responseReceivedExtraInfo').map(r=>({sequence:r.sequence,...clone(r.params)})),
  failures:rows.filter(r=>r.method==='Network.loadingFailed').map(r=>({sequence:r.sequence,...clone(r.params)}))}));
 const attribution=browserErrors.map(row=>{
  const e=row.params.entry,related=e.networkRequestId!==undefined?byRequest.get(key(row,e.networkRequestId))||[]:[];
  const responses=related.filter(r=>r.method==='Network.responseReceived');
  const requestURLs=related.filter(r=>r.method==='Network.requestWillBeSent').map(r=>r.params.request?.url).filter(Boolean);
  // Request IDs can be reused across redirect hops. Never infer the final URL
  // from a bare ID with several URLs, or by matching IDs across CDP sessions.
  const urls=[...new Set([...requestURLs,...responses.map(r=>r.params.response?.url).filter(Boolean)])];
  const resourceURL=e.url||((urls.length===1)?urls[0]:null);
  const exactResponses=resourceURL?responses.filter(r=>r.params.response?.url===resourceURL):[];
  const exactRequests=resourceURL?related.filter(r=>r.method==='Network.requestWillBeSent'&&r.params.request?.url===resourceURL):[];
  const reason=e.url?'explicit Log.entryAdded URL':resourceURL?'unique URL on same-session networkRequestId':e.networkRequestId!==undefined&&urls.length>1?'ambiguous redirect/request ID; unclassified':'no resource URL or unique same-session request ID; unclassified';
  const candidates=registrationWarnings.filter(w=>w.sessionId===row.sessionId&&w.phase===row.phase&&
   Number.isFinite(e.timestamp)&&Number.isFinite(w.timestamp)&&Math.abs(w.timestamp-e.timestamp)<=1000)
   .map(w=>({sequence:w.sequence,scriptURL:w.scriptURL,deltaMs:w.timestamp-e.timestamp,evidence:'temporal candidate only; does not establish causality'}));
  return {sequence:row.sequence,sessionId:row.sessionId,phase:row.phase,text:e.text,resourceURL,reason,
   networkRequestId:e.networkRequestId??null,networkResponseSequences:exactResponses.map(r=>r.sequence),
   networkStatuses:exactResponses.map(r=>r.params.response.status),requestSequences:exactRequests.map(r=>r.sequence),
   initiators:exactRequests.map(r=>({sequence:r.sequence,initiator:clone(r.params.initiator||{})})),
   nearbyRegistrationWarnings:candidates};
 });
 const groups=new Map();
 for(const {row,entry} of warnings){const frames=entry.stackTrace?.callFrames||[],top=frames[0]||{},text=entry.text||'';
  const category=text.startsWith('Canvas2D:')?'canvas-readback':text.includes('AudioContext was not allowed to start')?'audio-autoplay':text.startsWith('Service Worker 註冊失敗：')?'service-worker-registration':'other';
  const groupKey=JSON.stringify([category,top.url||entry.url||null,top.functionName||'',top.lineNumber??entry.lineNumber??null]);
  if(!groups.has(groupKey))groups.set(groupKey,{category,sourceURL:top.url||entry.url||null,functionName:top.functionName||'',
   lineNumberZeroBased:top.lineNumber??entry.lineNumber??null,count:0,eventSequences:[],firstStackTrace:clone(entry.stackTrace||{})});
  const g=groups.get(groupKey);g.count++;g.eventSequences.push(row.sequence);
 }
 return {requests,browserErrorAttribution:attribution,serviceWorkerErrors:swErrors,registrationWarnings,
  warningSources:[...groups.values()].sort((a,b)=>b.count-a.count),
  counts:{browserErrors:browserErrors.length,attributedByExplicitURLOrRequestId:attribution.filter(r=>r.resourceURL).length,
   unattributedBrowserErrors:attribution.filter(r=>!r.resourceURL).length,serviceWorkerErrors:swErrors.length,
   explicitRegistrationWarnings:registrationWarnings.length,warnings:warnings.length},
  policy:'Diagnostics only. Existing raw errors, warnings, classifier and strict gate remain unchanged. Time proximity and registration warnings never promote a URL-less error. Raw event references are retained.'};
}
module.exports={createConsoleSourceObserver015,enableConsoleSourceDomains015,analyzeConsoleSources015};

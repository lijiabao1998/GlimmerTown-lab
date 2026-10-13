#!/usr/bin/env node
'use strict';
// Only the fixed remaining acceptance list; all screenshots come from the
// original native renderer, in a disposable slot-3 Chromium profile.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {guardOutput022,baselineHTML022}=require('./use-scales-guard-paths022');
const {makeHarness}=require('./use-scales-test-harness021');
const OUT=guardOutput022(),A=process.env.USE021_REMAIN_ATTEMPT||'01';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=fs.readFileSync(path.join(OUT,'native-city-mature36-021.json'),'utf8');
const oracle=fs.readFileSync(path.join(OUT,'independent-pose-oracle021.js'),'utf8');
const R={kind:'Fixed remaining native acceptance',inputSHA256:sha(raw),oracleSHA256:sha(oracle),checks:[],items:[],photos:[],ok:false};
const REUSE=process.argv.includes('--reuse-complete');
if(REUSE){const file=path.join(OUT,'remaining-acceptance-attempt-01.json'),bytes=fs.readFileSync(file),old=JSON.parse(bytes);if(old.source.candidateSHA256!==sha(fs.readFileSync(path.join(__dirname,'index.html'))))throw Error('Production source changed; cannot reuse');const omit=new Set([...old.night.flatMap(q=>q.checks),...old.actors.checks].map(c=>JSON.stringify(c)));R.checks=old.checks.filter(c=>!omit.has(JSON.stringify(c))&&!c.name.startsWith('remaining browser')&&!c.name.startsWith('actual source'));if(!R.checks.every(c=>c.ok))throw Error('Cannot reuse failed completed checks');R.items=old.items.filter(q=>q.status==='completed');for(const key of['snow','snowPreparation','faults','edge','hover','badEdge','locked','firstAsset'])R[key]=old[key];R.reused={file:path.basename(file),sha256:sha(bytes),source:old.source,checks:R.checks.length,reason:'Only incorrect observation of the original T629 offscreen compositor and incorrect tractor expected Y are repaired. Successful snow/FW/reflection, boundary/lock/hover, formal faults and 30 first-use samples are retained without rerunning.'};}
function flush(){fs.writeFileSync(path.join(OUT,'remaining-acceptance-attempt-'+A+'.json'),JSON.stringify(R,null,2)+'\n');}
function add(name,ok,data){R.checks.push({name,ok:!!ok,data});}
async function photo(cdp,name){if(A!=='01')name=name.replace('.png','-attempt'+A+'.png');const q=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}),b=Buffer.from(q.data,'base64');fs.writeFileSync(path.join(OUT,name),b);R.photos.push({name,bytes:b.length,sha256:sha(b),kind:'Actual Chromium game full viewport'});}
async function click(cdp,p){for(const type of['mouseMoved','mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:p[0],y:p[1],button:type==='mouseMoved'?'none':'left',clickCount:1});}
async function item(name,fn){try{const q=await fn();R.items.push({name,status:q?.status||'completed',data:q});}catch(e){R.items.push({name,status:'failed',error:e.stack});}flush();console.log(JSON.stringify({item:name,result:R.items.at(-1).status}));}
function initRemaining(){
 const G=GV,U=G.useScales021,N=N021,O=IndependentPoseOracle021;
 N.running(false);G.setSpeed(0);U.close();G.selectTool434('pan');N.hide();G.setRot(0);G.setVisT(G.art574.cycle574()*.5);N.hudRefresh();N.frame(.016);
 const places=[];
 for(let y=0;y<N.state().n;y++)for(let x=0;x<N.state().n;x++){
  const b=N.tile(x,y).bld;if(!b||b.ref||!b.art021)continue;
  const P=N.part(),i=y*N.state().n+x,ri=b.k<=3?P.cl[i]:-1,q=ri>=0?P.map.get(ri):null;
  if(b.k<=3&&q&&ri!==i)continue;
  const bw=b.k<=3?(q?.w||1):(b.sz||1),bh=b.k<=3?(q?.h||1):(b.sz||1),s=U.read(x,y);
  if(s?.__art021&&!places.some(p=>p.id===s.__art021.id))places.push({id:s.__art021.id,x,y,bw,bh});
 }
 window.F021={G,U,N,O,places};return{places,state:N.state(),control:N.controls()};
}
function observeNear(id,mode){
 const{G,U,N,O,places}=F021,p=places.find(q=>q.id===id),b=N.tile(p.x,p.y).bld;
 G.setRot(0);G.lookAt(p.x+p.bw/2,p.y+p.bh/2);G.setZoom(1.1);G.setVisT(G.art574.cycle574()*(mode==='night'?0:.5));N.hudRefresh();N.hide();U.read(p.x,p.y);
 N.trace(true);N.frame(.016);const trace=N.traceRows();N.trace(false);const m=N.metrics(),s=U.read(p.x,p.y),frame={W:m.W,H:m.H,camX:m.cam.x,camY:m.cam.y,zoom:m.cam.z};
 const expected=O.pose({...p,rot:0,N:N.state().n,nativeLevel:b.lv,nativeVariant:b.v,frame});
 const checks=[],add=(name,ok,data)=>checks.push({name,ok:!!ok,data}),body=trace.filter(t=>t.id===id&&t.root?.[0]===p.x&&t.root?.[1]===p.y&&t.kind==='day'&&t.main&&t.args.length===4);
 checks.push(O.nativeDrawGuard(expected,body));add('native partition dimensions/'+id,s.__t547.bw===expected.nativeDims[0]&&s.__t547.bh===expected.nativeDims[1],{native:p,observed:s.__t547});
 const kind=mode==='night'?'night':'snow',hits=trace.filter(t=>t.id===id&&t.kind===kind&&(mode==='night'||(t.root?.[0]===p.x&&t.root?.[1]===p.y))&&t.meta?.bw===p.bw&&t.meta?.bh===p.bh&&t.meta?.v===b.v&&(mode==='night'?t.nightLayer:t.main)&&t.args.length===4);
 const needed=mode==='snow'||!!b.pw;
 if(needed)add('actual '+kind+' layer/'+id,hits.length>0&&hits.every(t=>t.alpha>0&&O.same(t.args,expected.draw)&&O.same(t.matrix,expected.nativeTransform)),hits);
 else add('unpowered native night gate/'+id,hits.length===0,{powered:!!b.pw,hits});
 if(mode==='night')add('native night layer composited to game/'+id,trace.some(t=>t.kind==='native-night-composite'&&t.main&&t.args.length===2&&O.same(t.args,[0,0])&&O.same(t.canvasSize,[frame.W,frame.H])));
 const img=mode==='night'?s.night:N.snow(s),d=img.getContext('2d').getImageData(0,0,s.w,s.h).data,base=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
 let count=0,leak=0;for(let i=3;i<d.length;i+=4)if(d[i]){count++;if(base[i]<40)leak++;}
 add('material mask/'+kind+'/'+id,count>0&&leak===0,{count,leak});
 if(b.k>=1&&b.k<=3&&p.bw*p.bh>1)add('exact approved reflection 1x1/'+id,N.reflect(b,p.x,p.y)===N.nativeGet(b.k,b.lv||1,1,1,b.v||0));
 const got=N.fwAlpha(s),ex=O.fwAlphaExpected(base,s.w,s.h,s.w,s.h);add('exact native FW alpha/'+id,got.W===ex.W&&got.H===ex.H&&got.kx===ex.kx&&got.ky===ex.ky&&O.same([...got.A],[...ex.A]));
 const oc=N.fwOccl({x:p.x,y:p.y,block547:{w:p.bw,h:p.bh}},b,s),fw=[];
 if(oc?.me?.tl)add('FW own native tile columns/'+id,oc.me.tl.length===p.bw*p.bh&&oc.me.tl.every((t,i)=>O.same([t.l,t.sy,t.dep],Object.values(O.fwColumns(expected)[i]))),oc.me.tl);
 for(const q of oc?.blk||[]){if(!Array.isArray(q.src))continue;const [x,y,w,h]=q.src,op=places.find(t=>t.x===x&&t.y===y&&t.bw===w&&t.bh===h);if(!op)continue;const ob=N.tile(x,y).bld,ep=O.pose({...op,rot:0,N:N.state().n,nativeLevel:ob.lv,nativeVariant:ob.v,frame}),off=O.fwOffset(expected,ep);const ok=O.same([q.dx,q.dy,q.dep],[off.dx,off.dy,off.dep])&&(!q.tl||q.tl.every((t,i)=>O.same([t.l,t.sy,t.dep],Object.values(off.tl[i]))));add('FW candidate occluder offsets/'+id+'/'+op.id,ok,{expected:off,observed:{dx:q.dx,dy:q.dy,dep:q.dep,tl:q.tl}});fw.push(op.id);}
 // Actual renderer rectangles, compared to the independent authored coordinates.
 let actor={status:'N/A',reason:'This native kind has no farmer/tractor overlay.'};
 if(mode==='night')actor={status:'N/A',reason:'Farm actors checked in a daytime frame; original conditions and material lighting are preserved.'};
 if(mode==='snow'&&b.k===22)actor={status:'N/A',reason:'Original farmer gate excludes winter (sea===3).'};
 if(mode==='snow'&&b.k===53)actor={status:'N/A',reason:'Original tractor gate excludes winter (sea===3).'};
 return{id,mode,checks,trace,expected,state:N.state(),powered:!!b.pw,nightRate:N.nightRate(),nightDepth:window.__nd550,fwPairs:fw,actor};
}
function observeActors(){
 const{G,U,N,O,places}=F021,checks=[],frames=[],add=(name,ok,data)=>checks.push({name,ok:!!ok,data});
 for(const id of['UKF021-S','UKF021-L']){
  const p=places.find(q=>q.id===id),b=N.tile(p.x,p.y).bld;G.setRot(0);G.lookAt(p.x+p.bw/2,p.y+p.bh/2);G.setZoom(1.1);G.setDay(88);G.setVisT(G.art574.cycle574()*.5);N.hudRefresh();N.hide();
  // For the large farm choose a native mature/harvest calendar stage, not a
  // forced building state. This does not run tick or replace crop variants.
  if(b.k===53){const h=O.nativeStreetHash(p.x,p.y,777);for(let d=81;d<97;d++)if(Math.floor(((d+Math.floor(h*16))%16)/4)>=2){G.setDay(d);break;}N.hudRefresh();}
  U.read(p.x,p.y);N.trace(true);N.frame(.016);const trace=N.traceRows();N.trace(false);const m=N.metrics(),frame={W:m.W,H:m.H,camX:m.cam.x,camY:m.cam.y,zoom:m.cam.z},expected=O.pose({...p,rot:0,N:N.state().n,nativeLevel:b.lv,nativeVariant:b.v,frame}),visT=N.state().visT;
  let disposition;
  if(b.k===22){if(O.nativeStreetHash(p.x,p.y,4040)>=.4)disposition={status:'N/A',reason:'Native deterministic 40% farmer selector excludes this paid farm at its real coordinate.'};else{const h1=O.nativeStreetHash(p.x,p.y,4041),h2=O.nativeStreetHash(p.x,p.y,4042),ex=O.farmerExpected(expected,h1,h2,visT);add('actual native farmer helper',trace.some(t=>t.kind==='farmer-helper'&&t.id===id&&O.same(t.result,ex.local)),{trace,expected:ex});add('actual native farmer body rectangle',trace.some(t=>t.kind==='actor-rect'&&t.color==='#4a6e9c'&&O.same(t.args,ex.body)&&O.same(t.matrix,expected.nativeTransform)),ex);disposition={status:'completed'};}}
  else{const ph=O.nativeStreetHash(p.x,p.y,4033),prog=(visT/16+ph)%1,row=Math.floor(O.nativeStreetHash(p.x,p.y,Math.floor(visT/16+ph)+4034)*3)-1,ex=O.tractorExpected(expected,prog,row),point=[...ex.redBody];add('actual native tractor body rectangle',trace.some(t=>t.kind==='actor-rect'&&t.color==='#b03a30'&&O.same(t.args,point)&&O.same(t.matrix,expected.nativeTransform)),{expected:point,trace});disposition={status:'completed'};}
  frames.push({id,state:N.state(),trace,disposition});
 }
 const p=places.find(p=>O.form(p.id).k<=3&&O.nativeStreetHash(p.x,p.y,60701)<=.52);if(!p)return{checks,frames,bubble:{status:'N/A',reason:'All actual candidate origins excluded by native 52% selector.'}};
 const b=N.tile(p.x,p.y).bld;G.lookAt(p.x+p.bw/2,p.y+p.bh/2);G.setZoom(1.1);const hh=O.nativeStreetHash(p.x,p.y,52101),C=G.art574.cycle574();let t;
 for(let n=0;n<60;n++){const z=((.04-hh+1)%1+n)*11,phase=(z%C)/C;if(phase>.35&&phase<.65){t=z;break;}}G.setVisT(t);N.trace(true);N.frame(.016);const trace=N.traceRows();N.trace(false);const m=N.metrics(),s=U.read(p.x,p.y),e=O.pose({...p,rot:0,N:N.state().n,nativeLevel:b.lv,nativeVariant:b.v,frame:{W:m.W,H:m.H,camX:m.cam.x,camY:m.cam.y,zoom:m.cam.z}}),d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,ex=O.bubbleExpected(e,d,{origin:true,visT:N.state().visT,nd:window.__nd550}),got=trace.find(q=>q.kind==='bubble-helper'&&q.x===p.x&&q.y===p.y);
 add('actual native bubble helper uses independent roof',!!ex&&!!got&&got.result.icon===ex.icon&&O.same([got.result.tipX,got.result.tipY,got.result.topY,got.result.alpha,got.result.rise],[ex.tipX,ex.tipY,ex.topY,ex.alpha,ex.rise]),{expected:ex,observed:got});
 const scale=Math.max(1,Math.round(e.frame.zoom)),draw=ex&&[Math.round(ex.tipX-4.5*scale),Math.round(ex.tipY-11*scale-ex.rise*scale),11*scale,11*scale];add('actual native bubble icon draw',!!ex&&trace.some(q=>q.kind==='bubble'&&q.icon===ex.icon&&q.main&&O.same(q.args,draw)),{expected:draw,trace});
 return{checks,frames,bubble:{p,expected:ex,trace,status:'completed'}};
}
function formalFaults(){
 const{G,U,N,places}=F021,p=places.find(p=>p.id==='UKU021-L'),i=p.y*N.state().n+p.x,original=U.profileSave(),checks=[],faults=[];
 const guard=kind=>{N.frame(.016);const actual=kind==='dispatch'?U.read(p.x,p.y)?.__art021?.id:(U.profileSave()||[]).find(e=>e[0]===i&&e[1]==='b')?.[2],list=[{name:kind+'/'+p.id,ok:actual===p.id,expected:p.id,actual:actual||null}];return{ok:list.every(c=>c.ok),checks:list,firstFailure:list.find(c=>!c.ok)||null};};
 for(const kind of['dispatch','metadata']){const before=guard(kind);U.profileLoad(kind==='dispatch'?original.map(e=>e[0]===i&&e[1]==='b'?[i,'b','UKM021-M']:e.slice()):original.filter(e=>!(e[0]===i&&e[1]==='b')));const bad=guard(kind);U.profileLoad(original);const restored=guard(kind);checks.push({name:kind+' same formal guard green-red-green',ok:before.ok&&!bad.ok&&bad.firstFailure.name===kind+'/'+p.id&&restored.ok});faults.push({kind,before,bad,restored});}
 return{checks,faults,scope:'Optional metadata only, restored immediately; guard firstFailure is computed from actual observations.'};
}
(async()=>{const H=makeHarness();R.source=H.proof;try{
 const s=await H.withGame({fresh:false,timeout:300,preScript:'window.__useScaleQA021=true;localStorage.setItem("glimmerville.v1.slot","3");localStorage.setItem("glimmerville.v1.s3",'+JSON.stringify(raw)+');',log:console.log},async({cdp})=>{
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});await cdp.evalJs(oracle);await cdp.evalJs(`N021.running(false);GV.setSpeed(0);localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(raw)});GV.load();N021.running(false);GV.setSpeed(0);`);R.initial=await cdp.evalJs('('+initRemaining.toString()+')()');add('actual source has all36 independent native footprints',R.initial.places.length===36,R.initial.places);flush();
  await item('all36 near night emission',async()=>{R.night=[];for(const p of R.initial.places){const q=await cdp.evalJs('('+observeNear.toString()+')('+JSON.stringify(p.id)+',"night")');R.night.push(q);R.checks.push(...q.checks);if(p.id.endsWith('-M'))await photo(cdp,'remaining-night-'+p.id+'.png');flush();}return{status:R.night.every(q=>q.checks.every(c=>c.ok))?'completed':'failed',powered:R.night.filter(q=>q.powered).length,unpowered:R.night.filter(q=>!q.powered).map(q=>q.id)};});
  await item('actual farmer tractor and bubble overlays',async()=>{R.actors=await cdp.evalJs('('+observeActors.toString()+')()');R.checks.push(...R.actors.checks);await photo(cdp,'remaining-native-bubble.png');return{status:R.actors.checks.every(c=>c.ok)?'completed':'failed',actors:R.actors.frames.map(f=>({id:f.id,...f.disposition}))};});
  await item('portrait and EW actual native body draws',async()=>{
   await cdp.evalJs(`localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(raw)});GV.load();N021.running(false);GV.setSpeed(0);`);
   const src=fs.readFileSync(path.join(__dirname,'probeUseScalesInteraction021.js'),'utf8'),fn=src.slice(src.indexOf('function nativeExtraLots(){'),src.indexOf('\nfunction negativeCases(){'));R.alternateWorkflow={sha256:sha(fn),from:'probeUseScalesInteraction021.js',reason:'Prior alternate reader proof has no retained whole save. Complete these missing actual body draws through genuine paid tools and native growth; do not reconstruct the old bld states.'};
   R.extra=await cdp.evalJs('('+fn+')()');R.checks.push(...R.extra.checks);R.alternateDraws=[];
   for(const rot of[0,1,2,3])for(const [id,p,bw,bh]of[['UKC021-M',R.extra.portrait,1,2],['UKP021-L',R.extra.station,5,5]]){
    const q=await cdp.evalJs(`(()=>{const p=${JSON.stringify(p)},id=${JSON.stringify(id)},rot=${rot},bw=${bw},bh=${bh},N=N021,G=GV,U=G.useScales021,O=IndependentPoseOracle021,b=N.tile(p.x,p.y).bld;G.setRot(rot);G.lookAt(p.x+bw/2,p.y+bh/2);G.setZoom(1.1);G.setVisT(G.art574.cycle574()*.5);N.hide();N.hudRefresh();U.read(p.x,p.y);N.trace(true);N.frame(.016);const trace=N.traceRows();N.trace(false);const m=N.metrics(),expected=O.pose({id,...p,bw,bh,rot,N:N.state().n,nativeLevel:b.lv,nativeVariant:b.v,frame:{W:m.W,H:m.H,camX:m.cam.x,camY:m.cam.y,zoom:m.cam.z}}),hits=trace.filter(t=>t.id===id&&t.root?.[0]===p.x&&t.root?.[1]===p.y&&t.kind==='day'&&t.main&&t.args.length===4&&t.meta.bw===bw&&t.meta.bh===bh&&t.meta.v===b.v);return{expected,trace,guard:O.nativeDrawGuard(expected,hits),state:N.state()};})()`);R.alternateDraws.push(q);R.checks.push(q.guard);if(rot===0)await photo(cdp,'remaining-alternate-'+id+'.png');
   }
   const saved=await cdp.evalJs('GV.save();localStorage.getItem("glimmerville.v1.s3")'),file='remaining-alternate-native-save-attempt-'+A+'.json';fs.writeFileSync(path.join(OUT,file),saved);R.alternateWorkflow.retainedSave={file,bytes:Buffer.byteLength(saved),sha256:sha(saved)};
   return{status:R.extra.checks.every(c=>c.ok)&&R.alternateDraws.every(q=>q.guard.ok)?'completed':'failed',truePaidPlacements:true,nativeGrowth:true,bodyDraws:R.alternateDraws.length};
  });
  if(REUSE)return{errors:cdp.errors,benign:cdp.benign};
  await item('all36 near roof snow',async()=>{R.snowPreparation=await cdp.evalJs('(()=>{const before=N021.state();GV.setDay(301);GV.weather(1);GV.setSpeed(1);GV.advanceN(.05,54);GV.setSpeed(0);N021.running(false);N021.hudRefresh();return{before,after:N021.state(),control:N021.controls(),method:"Native weather QA outlet plus three real native days; no rainDays/building state mutation"};})()');add('true native accumulated winter precipitation',R.snowPreparation.after.rainDays>0&&R.snowPreparation.after.day>=303,R.snowPreparation);R.snow=[];for(const p of R.initial.places){const q=await cdp.evalJs('('+observeNear.toString()+')('+JSON.stringify(p.id)+',"snow")');R.snow.push(q);R.checks.push(...q.checks);if(p.id.endsWith('-M'))await photo(cdp,'remaining-snow-'+p.id+'.png');flush();}return{status:R.snow.every(q=>q.checks.every(c=>c.ok))?'completed':'failed'};});
  await item('formal dispatch and metadata faults',async()=>{R.faults=await cdp.evalJs('('+formalFaults.toString()+')()');R.checks.push(...R.faults.checks);return{status:R.faults.checks.every(c=>c.ok)?'completed':'failed'};});
  // Genuine boundary and hover mouse input. This keeps native footprint rules.
  await item('boundary and hover',async()=>{
   await cdp.evalJs(`localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(raw)});GV.load();N021.running(false);GV.setSpeed(0);`);await cdp.evalJs('('+initRemaining.toString()+')()');
   const p=await cdp.evalJs(`(()=>{const N=N021,U=GV.useScales021,n=N.state().n;let p;for(let y=1;y<n-1&&!p;y++)for(const x of[0,n-1])if(!N.tile(x,y).bld&&!N.tile(x,y).road&&GV.canPlaceTool('stationNewsstand009',x,y)===null){p={x,y};break;}if(!p)throw Error('No legal unmodified native edge site');U.select('UKU021-S');GV.lookAt(p.x,p.y);GV.setZoom(1.1);N.frame(.016);window.edge021={p,money:N.state().money,tile:JSON.stringify(N.tile(p.x,p.y))};return{p,screen:N.point(p.x,p.y),quote:GV.placePreview459('stationNewsstand009',p.x,p.y)};})()`);
   await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.screen[0],y:p.screen[1],button:'none'});R.hover=await cdp.evalJs('N021.frame(.016);({hover:N021.hover(),native:GV.t459()})');add('trusted hover at actual edge tile',R.hover.hover.x===p.p.x&&R.hover.hover.y===p.p.y,R.hover);await photo(cdp,'remaining-boundary-hover.png');
   await click(cdp,p.screen);R.edge=await cdp.evalJs('({bld:N021.tile(edge021.p.x,edge021.p.y).bld,charged:edge021.money-N021.state().money})');add('true paid edge placement stays within map',R.edge.bld?.k===276&&R.edge.bld?.art021==='UKU021-S'&&R.edge.charged===p.quote.cost,R.edge);await cdp.evalJs('GV.undo();');
   const e=await cdp.evalJs(`(()=>{GV.useScales021.select('UKU021-L');const row=GV.useScales021.rows().find(q=>q.id==='UKU021-L'),n=N021.state().n,p={x:n-2,y:edge021.p.y};GV.lookAt(p.x,p.y);N021.frame(.016);window.badEdge021={p,tool:row.tool,money:N021.state().money,art:JSON.stringify(GV.useScales021.profileSave()),undo:GV.txn460().undo};return{screen:N021.point(p.x,p.y),quote:GV.placePreview459(row.tool,p.x,p.y)};})()`);await click(cdp,e.screen);R.badEdge=await cdp.evalJs('({state:N021.state(),unchanged:N021.state().money===badEdge021.money&&JSON.stringify(GV.useScales021.profileSave())===badEdge021.art&&GV.txn460().undo===badEdge021.undo})');add('native oversized boundary rejection no money metadata undo change',!e.quote.ok&&R.badEdge.unchanged,{quote:e.quote,...R.badEdge});return{status:R.checks.filter(q=>/edge|hover|boundary/.test(q.name)).every(q=>q.ok)?'completed':'failed'};
  });
  await item('native rank locked catalogue',async()=>{
   const low=JSON.parse(raw);low.rk=0;low.cp=0;await cdp.evalJs(`localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(JSON.stringify(low))});GV.load();N021.running(false);GV.setSpeed(0);GV.selectTool434('pan');GV.useScales021.open();`);
   const p=await cdp.evalJs(`(()=>{const b=document.querySelector('[data-use021="UKU021-S"]');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();window.locked021={money:N021.state().money,art:JSON.stringify(GV.useScales021.profileSave())};return{screen:[r.x+r.width/2,r.y+r.height/2],rank:GV.rank(),info:N021.toolInfo('stationNewsstand009')};})()`);await click(cdp,p.screen);R.locked=await cdp.evalJs('({selection:GV.useScales021.selection(),native:GV.t459(),open:document.querySelector("#useScalesDialog021").open,unchanged:N021.state().money===locked021.money&&JSON.stringify(GV.useScales021.profileSave())===locked021.art})');add('trusted native low-rank shop selection rejected without charge',!p.info.unlocked&&R.locked.selection===null&&R.locked.native.tool==='pan'&&R.locked.open&&R.locked.unchanged,{setup:'Explicit synthetic low-rank saved fixture, no unlock rule override',...p,...R.locked});await photo(cdp,'remaining-native-locked.png');return{status:R.checks.at(-1).ok?'completed':'failed'};
  });
  await item('single asset first use 30 interleaved samples',async()=>{
   await cdp.evalJs(`GV.useScales021.close();localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(raw)});GV.load();N021.running(false);GV.setSpeed(0);`);await cdp.evalJs('('+initRemaining.toString()+')()');
   R.firstAsset=await cdp.evalJs(`(()=>{const p=F021.places.find(q=>q.id==='UKP021-L'),b=N021.tile(p.x,p.y).bld,samples=[];GV.lookAt(p.x+2,p.y+2);GV.setZoom(1.1);GV.setVisT(GV.art574.cycle574()*.5);N021.hide();for(let i=0;i<30;i++)for(const off of(i%2?[true,false]:[false,true])){window.__noUseScalesRelease021=off;N021.frame(.016);const removed=N021.clearOne(p.id,p.bw,p.bh,0,b.lv,b.v),t=performance.now();N021.frame(.016);samples.push({i,off,ms:performance.now()-t,removed});}window.__noUseScalesRelease021=false;const summary={};for(const off of[true,false]){const a=samples.filter(q=>q.off===off).map(q=>q.ms).sort((a,b)=>a-b);summary[off?'original':'rebuilt']={n:a.length,median:(a[14]+a[15])/2,p90:a[26]};}return{samples,summary,asset:p.id,scope:'One 5x5 station asset, other families prewarmed; whole native frame measured. Original fixed station is prebaked. No tick or save-state changes.'};})()`);add('single target first-use 30 samples in each arm',R.firstAsset.samples.length===60&&R.firstAsset.samples.filter(q=>!q.off).every(q=>q.removed.art===1),R.firstAsset.summary);return{status:R.checks.at(-1).ok?'completed':'failed',summary:R.firstAsset.summary};
  });
  return{errors:cdp.errors,benign:cdp.benign};
 });R.session={ok:s.ok,fails:s.fails,seconds:s.seconds,result:s.result};add('remaining browser has no errors',s.ok&&!s.result?.errors?.length,s.fails);
 R.ok=R.checks.every(c=>c.ok)&&R.items.every(i=>i.status!=='failed');
}catch(e){R.error=e.stack;}finally{await H.cleanup();flush();console.log(JSON.stringify({ok:R.ok,checks:R.checks.length,items:R.items.map(i=>({name:i.name,status:i.status})),error:R.error}));if(!R.ok)process.exitCode=1;}})();

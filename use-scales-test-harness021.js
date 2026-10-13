'use strict';
// Test-only copy of the real native page/harness. One closure export insertion;
// the candidate index, renderer, simulation and original harness stay unchanged.
const fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),crypto=require('crypto');
const SOURCE=__dirname,sha=d=>crypto.createHash('sha256').update(d).digest('hex');
const EXPORT=`
/* GPT-021 TEST-ONLY INSPECTOR START */
if(window.__useScaleQA021===true){
 let trace021=false,traceRows021=[],imageMap021=new Map(),lastSize021=-1,drawRoot021=null;
 if(typeof use021Resolve==='function'){
  const nativeResolve021=use021Resolve;
  use021Resolve=function(x,y){const result=nativeResolve021.apply(this,arguments);if(trace021&&result?.__art021)drawRoot021=[x,y];return result;};
 }
 const drawImage021=CanvasRenderingContext2D.prototype.drawImage;
 function refreshImages021(){if(typeof USE021_CACHE==='undefined'||USE021_CACHE.size===lastSize021)return;
  lastSize021=USE021_CACHE.size;
  for(const s of USE021_CACHE.values()){imageMap021.set(s.img,{s,kind:'day'});if(s.night){imageMap021.set(s.night,{s,kind:'night'});imageMap021.set(winImg649(s.night),{s,kind:'night'});}}}
 function observeDraw021(receiver,args){
  if(trace021){refreshImages021();const a=imageMap021.get(args[0]);if(a||(args[0]&&args[0]===NL629)){const m=receiver.getTransform();traceRows021.push({root:drawRoot021?.slice()||null,id:a?.s?.__art021?.id,view:a?.s?.__art021?.view,meta:a?.s?{...a.s.__art021}:null,icon:a?.icon,kind:a?.kind||'native-night-composite',args:args.slice(1),main:receiver.canvas===cvs,nightLayer:receiver.canvas===NL629,canvasSize:[receiver.canvas.width,receiver.canvas.height],alpha:receiver.globalAlpha,matrix:[m.a,m.b,m.c,m.d,m.e,m.f]});}}
 }
 // Observe the unchanged native snow/window/bubble/actor calls. All wrappers
 // return their original value and draw through the original methods.
 const snowCap021=snowCap;
 snowCap=function(s){const c=snowCap021(s);if(trace021&&s?.__art021)imageMap021.set(c,{s,kind:'snow'});return c;};
 const winImg021=winImg649;
 winImg649=function(c){const w=winImg021(c);if(trace021){const a=imageMap021.get(c);if(a)imageMap021.set(w,a);}return w;};
 const bubble021=bubbleFor607;
 bubbleFor607=function(x,y,b,nd,z){const r=bubble021(x,y,b,nd,z);if(trace021&&r){traceRows021.push({kind:'bubble-helper',x,y,id:b?.art021,nd,z,result:{...r}});const c=bubbleIcons607()[r.icon+(nd>0?1:0)];imageMap021.set(c,{kind:'bubble',icon:r.icon});}return r;};
 const farmer021=farmerPt637;
 farmerPt637=function(s,...a){const r=farmer021(s,...a);if(trace021&&s?.__art021)traceRows021.push({kind:'farmer-helper',id:s.__art021.id,args:a.slice(0,2),result:r.slice()});return r;};
 const fillRect021=ctx.fillRect;
 ctx.fillRect=function(...a){if(trace021&&['#b03a30','#4a6e9c'].includes(ctx.fillStyle)){const m=ctx.getTransform();traceRows021.push({kind:'actor-rect',color:ctx.fillStyle,args:a,main:true,matrix:[m.a,m.b,m.c,m.d,m.e,m.f],alpha:ctx.globalAlpha});}return fillRect021.apply(this,a);};
 CanvasRenderingContext2D.prototype.drawImage=function(...args){
  observeDraw021(this,args);
  return drawImage021.apply(this,args);
 };
 // Native compositor wrappers can retain an earlier bound drawImage. Observe
 // their public call and then delegate to that exact unchanged native wrapper.
 const mainDraw021=ctx.drawImage;
 ctx.drawImage=function(...args){observeDraw021(this,args);return mainDraw021.apply(this,args);};
 window.N021={
  tile:(x,y)=>tiles[idx(x,y)],state:()=>({running,visT,day,speed,simAcc,daylen:DAYLEN,disastersOn,seed,money,diff,rankIdx,n:N,editor:editMode,weather,rainDays}),
  dispatch:()=>({fire:ladderTrucks.map(c=>({...c,path:c.path?c.path.slice():null})),police:policeCars.map(c=>({...c,path:c.path?c.path.slice():null})),amb:ambulances.map(c=>({...c,path:c.path?c.path.slice():null}))}),
  reflect:reflectSprite,fwLand:fw699LandSpr,fwOccl:fw699Occluders,top:spriteTop607,farmer:farmerPt637,
  nativeBase:(x,y,b,w,h)=>use021NativeBase(x,y,b,w,h),originalSprite:(k,lv,v)=>SPR.bld[k+'_'+lv+'_'+v],
  top636:topPt636,fwAlpha:fw699Alpha,farmPoint:(s,p,row)=>use021FarmPoint(s,p,row),
  hudRefresh:updHud,hover:()=>({...hover}),nightRate:nightGlobalPowerRate487,
  snow:snowCap,toolInfo:id=>{const m=toolMeta434(id);return{...m,unlocked:toolUnlocked458(m)};},
  clearOne:(id,bw,bh,rot,lv,v)=>{let art=0;for(const[k,s]of USE021_CACHE){const m=s.__art021;if(m.id===id&&m.bw===bw&&m.bh===bh&&m.rot===rot&&m.lv===lv&&m.v===v){USE021_CACHE.delete(k);art++;}}const row=USE021_ROWS.find(q=>q.id===id),d=blockDims622(bw,bh,rot),key=row.k+'_'+lv+'_'+d[0]+'x'+d[1]+'_'+v;return{art,native:BLOCK_SPR547.delete(key),key};},
  clearNativeBlockCache:()=>BLOCK_SPR547.clear(),
  phase:()=>visT,w2v,v2w,part:()=>part639(),nativeGet:getBlockSprite547,smoke:smokeViewSrc626,bubble:bubbleFor607,
  // T289's traffic clock is a visual input not stored in saves. Give paired
  // whole-frame comparisons the same clock; no layer or simulation is disabled.
  visualClock:value=>{if(value!==undefined)trafClock=+value;return{visT,trafClock};},
  running:v=>{if(v!==undefined)running=!!v;return running;},
  frame:(dt=.016)=>draw(dt),
  trace:on=>{trace021=!!on;traceRows021=[];imageMap021.clear();lastSize021=-1;drawRoot021=null;return trace021;},traceRows:()=>traceRows021.slice(),
  clearArtCache:()=>{if(typeof USE021_CACHE!=='undefined')USE021_CACHE.clear();imageMap021.clear();lastSize021=-1;},
  metrics:()=>({W,H,DPR,cam:{...cam},rot:viewRotEff()}),
  point:(x,y)=>{const p=w2v(x+.5,y+.5);return[(W/2+(p[0]-p[1])*32*cam.z-cam.x*cam.z)/DPR,(H/2+(p[0]+p[1])*16*cam.z-cam.y*cam.z)/DPR];},
  hide:()=>{hideInfo();hover.x=-1;hover.y=-1;selTile=null;},
  price:(id,x,y)=>placeCost(id,x,y),upCost,
  controls:()=>({sandbox:devState516B.sandbox,god:devGod516B(),overrides:{...devState516B.overrides}})
 };
}
/* GPT-021 TEST-ONLY INSPECTOR END */
`;
function makeHarness(html=fs.readFileSync(path.join(SOURCE,'index.html'),'utf8')){
 const anchor='Object.assign(window.GV,{art574:';
 if(html.split(anchor).length!==2)throw Error('Exactly one native art QA export anchor required');
 const inspected=html.replace(anchor,EXPORT+anchor);
 if(inspected.replace(EXPORT,'')!==html)throw Error('Inspector must reverse byte-exactly');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'use021-native-'));
 fs.writeFileSync(path.join(root,'index.html'),inspected);
 for(const file of['manifest.json','manifest.webmanifest','icon.svg','sw.js'])if(fs.existsSync(path.join(SOURCE,file)))fs.copyFileSync(path.join(SOURCE,file),path.join(root,file));
 const harness=fs.readFileSync(path.join(SOURCE,'harness.js'),'utf8'),holder={exports:{}};
 new vm.Script('(function(require,module,exports,__dirname,__filename){'+harness+'\n})',{filename:'use021-native-harness.generated.js'}).runInThisContext()(require,holder,holder.exports,root,path.join(SOURCE,'harness.js'));
 const proof={kind:'Actual native page plus test-only closure export; no replacement renderer',candidateSHA256:sha(html),inspectedSHA256:sha(inspected),inspectorSHA256:sha(EXPORT),originalHarnessSHA256:sha(harness),singleReversibleInsertion:true,temporaryRoot:root};
 // withGame requests Chrome shutdown but its profile writers can briefly still
 // be exiting. Retry only disposal of this harness's own mkdtemp directory;
 // never mask a game/guard failure or touch any other checkout/profile.
 return {...holder.exports,proof,cleanup:async()=>{
  // Yield so withGame's scheduled profile disposal and Chrome exit can finish.
  await new Promise(resolve=>setTimeout(resolve,1600));
  await fs.promises.rm(root,{recursive:true,force:true,maxRetries:10,retryDelay:100});
 }};
}
module.exports={makeHarness};

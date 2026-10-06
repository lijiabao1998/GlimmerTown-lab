'use strict';
// Functions are serialized into disposable Actions Chrome only. Node imports
// this module for source inspection without executing any game/renderer code.
// Observe all fourteen declared old streetscape/garden coordinates directly. The native
// aggregate amCells list is lazily rebuilt and can still be empty immediately
// after paused paid placement; this getter must never repair or advance it.
function quaysidePriorPaths017(){
 const families=[{family:'streetscape015',rows:window.__streetscapeQA015?.paths,count:8,get:GV.streetscapeAt015,themeKey:'british015',turnKey:'turn015'},{family:'gardenLife016',rows:window.__gardenLifeQA016?.paths,count:6,get:GV.gardenLifeAt016,themeKey:'british016',turnKey:'turn016'}],out=[];
 for(const f of families){
  if(!Array.isArray(f.rows)||f.rows.length!==f.count||new Set(f.rows.map(p=>p.x+','+p.y)).size!==f.count||new Set(f.rows.map(p=>p.theme)).size!==f.count)throw Error('Every distinct declared prior coordinate and theme required: '+f.family);
  for(const p of f.rows){const at=f.get(p.x,p.y);if(!at||at.root!==p.y*72+p.x||at.x!==p.x||at.y!==p.y||at.theme!==p.theme||at.am502!==1||at.baseWalkCost!==.72||at.cost!==p.cost||at.amx502?.[f.themeKey]!==p.theme||at.amx502?.[f.turnKey]!==p.turn)throw Error('Direct native prior identity changed: '+f.family+' '+p.x+','+p.y);out.push({...at,family:f.family});}
 }
 if(new Set(out.map(p=>p.x+','+p.y)).size!==14)throw Error('All fourteen prior paid coordinates must remain distinct');return out;
}
function setupQuayside017(){
 const F=window.__complexFns014,Q=window.__complexQA014,specs=GV.quaysideSpecs017().paths,old=F.identity014();
 const positions=[[27,68],[28,68],[29,68],[39,68],[40,68],[41,68]],payments=[],paths=[];
 for(let n=0;n<specs.length;n++){
  const q=specs[n],[x,y]=positions[n],before=GV.tile(x,y);
  if(before.am502){if(before.am502!==1||before.amx502)throw Error('Only explicitly declared plain path fixture cells may be replaced');Q.pay('doze',x,y);}
  else Q.prepare(x,y,1);
  const quote=GV.placePreview459(q.id,x,y),plain=GV.placePreview459('footpath502',x,y),money=GV.devMoney516B();
  if(!quote.ok||quote.cost!==plain.cost||quote.cost!==q.cost)throw Error('Exact native walking cost and valid site required: '+q.id+' '+JSON.stringify(quote));
  const ok=GV.placeUndo(q.id,x,y),after=GV.quaysideAt017(x,y),charged=money-GV.devMoney516B();
  if(!ok||charged!==quote.cost||!after||after.theme!==q.theme||after.am502!==1)throw Error('Genuine paid theme transaction required');
  paths.push({...q,x,y,turn:after.amx502.turn017});payments.push({id:q.id,x,y,before,quote,plain,charged,after,exact:charged===quote.cost});
 }
 const scene={paths,payments,placementDay:GV.stats().day,priorDetails:quaysidePriorPaths017()};window.__quaysideQA017=scene;
 scene.canonical=Object.entries(GV.art574.SPR().quayside017);scene.oldIdentities=old;
 return{paths,payments,oldBuildingIdentityExact:JSON.stringify(old.buildings)===JSON.stringify(F.identity014().buildings),priorThemesExact:old.paths.filter(p=>p.amx502).every(p=>JSON.stringify(F.identity014().paths.find(z=>z.i===p.i))===JSON.stringify(p)),priorDetailsCount:quaysidePriorPaths017().length,placementDay:scene.placementDay};
}
function bindQuayside017(recipe){window.__quaysideQA017={...recipe,canonical:Object.entries(GV.art574.SPR().quayside017)};return true;}
function quaysideState017(){const Q=window.__quaysideQA017;return{day:GV.stats().day,stats:GV.stats(),identity:window.__complexFns014.identity014(),paths:Q.paths.map(p=>GV.quaysideAt017(p.x,p.y)),old:window.__complexFns014.snapshot014(),priorDetails:quaysidePriorPaths017(),slot:localStorage.getItem('glimmerville.v1.slot'),otherSlots:Object.fromEntries(Object.keys(localStorage).filter(k=>/^glimmerville\.v1\.s[12](?:$|[._])/.test(k)).sort().map(k=>[k,localStorage.getItem(k)]))};}
function assetAudit017(){return Object.entries(GV.art574.SPR().quayside017).map(([key,s])=>{
 const day=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,night=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;
 let opaque=0,partial=0,lit=0,outside=0,edge=0,minX=s.w,maxX=-1,minY=s.h,maxY=-1;
 for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=4*(y*s.w+x);if(day[i+3]){if(day[i+3]===255)opaque++;else partial++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);if(x===0||y===0||x===s.w-1||y===s.h-1)edge++;}if(night[i+3]){lit++;if(day[i+3]!==255)outside++;}}
 return{key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,theme:s.theme,opaque,partial,lit,outside,edge,bounds:{minX,maxX,minY,maxY},clearWalkStrip:s.clearWalkStrip,minimumClearPath:s.minimumClearPath,physicalLampCount:s.physicalLampCount,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')};
});}
function quaysidePurity017(){
 const Q=window.__complexQA014,R=window.__quaysideQA017,world=Q.world(),storage=JSON.stringify(Q.storage()),canonical=Object.entries(GV.art574.SPR().quayside017),before=canonical.map(([k,s])=>[k,s.img.toDataURL(),s.night.toDataURL()]),nativeBefore=JSON.stringify(GV.fp536()),old=Math.random,start=performance.now();let calls=0;
 Math.random=()=>{calls++;throw Error('Art consumed simulation RNG');};
 try{const a=window.BritishQuaysideArchitecture017.buildAll().modules,b=window.BritishQuaysideArchitecture017.buildAll().modules;return{calls,ms:performance.now()-start,count:Object.keys(a).length,deterministic:Object.keys(a).every(k=>a[k].img.toDataURL()===b[k].img.toDataURL()&&a[k].night.toDataURL()===b[k].night.toDataURL()),worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),oldAndNewFingerprintExact:nativeBefore===JSON.stringify(GV.fp536()),canonical:canonical.every(([k,s],n)=>GV.art574.SPR().quayside017[k]===s&&s.img.toDataURL()===before[n][1]&&s.night.toDataURL()===before[n][2])};}finally{Math.random=old;}
}
function quaysideTransactions017(){
 const Q=window.__quaysideQA017,rows=[];
 for(const p of Q.paths){const before=JSON.stringify(GV.tile(p.x,p.y)),money=GV.devMoney516B(),quote=GV.placePreview459('doze',p.x,p.y),removed=GV.placeUndo('doze',p.x,p.y),gone=!GV.quaysideAt017(p.x,p.y),charged=money-GV.devMoney516B(),undo=GV.undo(),restored=before===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money,redo=GV.redo(),regone=!GV.quaysideAt017(p.x,p.y),redoPaid=money-GV.devMoney516B()===charged,undoAgain=GV.undo(),final=before===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money;rows.push({theme:p.theme,quote,removed,gone,charged,undo,restored,redo,regone,redoPaid,undoAgain,final});}
 const F=window.__complexQA014,world=F.world(),storage=JSON.stringify(F.storage());for(let n=0;n<8;n++)GV.forceDraw();
 return{rows,drawWorldExact:world===F.world(),drawStorageExact:storage===JSON.stringify(F.storage()),canonical:Q.canonical.every(([k,s])=>GV.art574.SPR().quayside017[k]===s)};
}
function quaysideEdits017(){
 const Q=window.__quaysideQA017,F=window.__complexQA014,rows=[];
 for(let n=0;n<Q.paths.length;n++){
  const p=Q.paths[n],next=Q.paths[(n+1)%Q.paths.length],before=GV.quaysideAt017(p.x,p.y),remove=F.pay('doze',p.x,p.y),purchase=F.pay(next.id,p.x,p.y),edited=GV.quaysideAt017(p.x,p.y);
  GV.save();const stored=localStorage.getItem('glimmerville.v1.s3'),loaded=GV.load(),restored=GV.quaysideAt017(p.x,p.y),day=GV.stats().day;
  window.__complexFns014.step014(1);const afterDay=GV.quaysideAt017(p.x,p.y);
  const removeEdited=F.pay('doze',p.x,p.y),original=F.pay(p.id,p.x,p.y),final=GV.quaysideAt017(p.x,p.y);
  rows.push({from:p.theme,to:next.theme,before,remove,purchase,edited,storedBytes:stored.length,loaded,restored,afterDay,day,nextDay:GV.stats().day,removeEdited,original,final,exact:edited.theme===next.theme&&loaded&&JSON.stringify(edited.amx502)===JSON.stringify(restored.amx502)&&JSON.stringify(restored.amx502)===JSON.stringify(afterDay.amx502)&&final.theme===p.theme&&final.amx502.turn017===p.turn});
 }
 GV.save();const before=quaysideState017(),had=Object.hasOwn(window,'__noQuayside017'),flag=window.__noQuayside017;window.__noQuayside017=true;let loaded,after;
 try{loaded=GV.load();after=quaysideState017();}finally{if(had)window.__noQuayside017=flag;else delete window.__noQuayside017;}
 const disabledLoad=loaded&&JSON.stringify(before.identity)===JSON.stringify(after.identity),immediateLighting=after.paths.map(p=>p?.lighting),fromDay=GV.stats().day;window.__complexFns014.step014(1);const following=quaysideState017();
 return{rows,disabledLoad,immediateLighting,fromDay,followingDay:following.day,followingLighting:following.paths.map(p=>p?.lighting),otherSlotsExact:JSON.stringify(before.otherSlots)===JSON.stringify(following.otherSlots)};
}
function quaysideConflictTools017(){return ['road','footpath502','bikePath502','mooringBitts017','pumpCourt016','heritageLantern015','sundialCourt015','britishTerrace','tdig','tland','traise'];}
function quaysideConstraints017(){
 const Q=window.__quaysideQA017,rows=[];
 for(const p of Q.paths){const before=JSON.stringify(GV.tile(p.x,p.y)),money=GV.devMoney516B();for(const id of quaysideConflictTools017()){const quote=GV.placePreview459(id,p.x,p.y);if(!quote)throw Error('Declared conflict tool lacks native preview: '+id);const ok=GV.placeUndo(id,p.x,p.y);rows.push({theme:p.theme,id,reason:quote.reason,blocked:!ok,tileExact:before===JSON.stringify(GV.tile(p.x,p.y)),moneyExact:money===GV.devMoney516B()});}}
 const site={x:33,y:68},before=GV.tile(site.x,site.y),money=GV.devMoney516B(),quote=GV.placePreview459('doze',site.x,site.y);if(before.am502!==1||before.amx502||before.bld||before.road)throw Error('Only one known plain fixture path may open for escape control');const removed=GV.placeUndo('doze',site.x,site.y),charged=money-GV.devMoney516B();if(!removed||charged!==quote.cost)throw Error('Real paid escape-control site removal required');
 const specs=GV.quaysideSpecs017().paths,positive=specs.every(q=>GV.placePreview459(q.id,site.x,site.y).ok),had=Object.hasOwn(window,'__noQuayside017'),flag=window.__noQuayside017;let disabled=false;
 try{window.__noQuayside017=true;disabled=specs.every(q=>!GV.placePreview459(q.id,site.x,site.y).ok);}finally{if(had)window.__noQuayside017=flag;else delete window.__noQuayside017;}
 const undo=GV.undo(),exact=JSON.stringify(GV.tile(site.x,site.y))===JSON.stringify(before)&&GV.devMoney516B()===money;
 return{rows,disabled,escape:{site,removed,quote,charged,positive,disabled,undo,exact}};
}
function quaysideScene017(rotation,night,group='both',zoom=1.75){
 const Q=window.__quaysideQA017,focus=group==='baths'?[28.5,66.6]:group==='fire'?[40.5,66.6]:[34.5,66.5];
 GV.setRot(rotation);GV.setZoom(zoom);GV.lookAt(...focus);GV.setVisT(GV.art574.cycle574()*(night?.9:.5));GV.weather(0);GV.forceDraw();
 const c=document.getElementById('game'),cam=GV.camera436(),paths=Q.paths.map(p=>{const current=GV.quaysideAt017(p.x,p.y);if(!current)return{...p,temporarilyAbsent:true};const s=GV.art574.SPR().quayside017[p.theme+'_'+((p.turn+rotation)&3)],v=GV.w2v(p.x,p.y),x=Math.round(c.width/2-cam.x*zoom)+(v[0]-v[1])*32*zoom+(32-s.ax)*zoom,y=Math.round(c.height/2-cam.y*zoom)+(v[0]+v[1])*16*zoom+(32-s.ay)*zoom;return{...p,view:(p.turn+rotation)&3,canonical:s===Q.canonical.find(([k])=>k===p.theme+'_'+((p.turn+rotation)&3))?.[1],box:{x,y,w:s.w*zoom,h:s.h*zoom},within:x>=0&&y>=0&&x+s.w*zoom<=c.width&&y+s.h*zoom<=c.height,lighting:GV.quaysideAt017(p.x,p.y).lighting};});
 return{png:c.toDataURL('image/png'),rotation:GV.rot(),night,time:GV.daylightDbg(),day:GV.stats().day,group,paths,width:c.width,height:c.height};
}
// Source-native controlled same-turn day rendering: remove ONLY the chosen
// canonical image temporarily, then restore its exact object. No compositor,
// mask, depth erasure, model, world, save or supply flag is changed.
function quaysideContribution017(theme){
 const Q=window.__quaysideQA017,p=Q.paths.find(p=>p.theme===theme),key=theme+'_'+((p.turn+GV.rot())&3),s=GV.art574.SPR().quayside017[key],c=document.getElementById('game'),g=c.getContext('2d'),original=s.img,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
 const C=window.__complexQA014,world=C.world(),storage=JSON.stringify(C.storage()),cam=GV.camera436(),zoom=cam.z,v=GV.w2v(p.x,p.y),x=Math.round(c.width/2-cam.x*zoom)+(v[0]-v[1])*32*zoom+(32-s.ax)*zoom,y=Math.round(c.height/2-cam.y*zoom)+(v[0]+v[1])*16*zoom+(32-s.ay)*zoom;
 const bounds={x0:Math.max(0,Math.floor(x)),x1:Math.min(c.width,Math.ceil(x+s.w*zoom)),y0:Math.max(0,Math.floor(y)),y1:Math.min(c.height,Math.ceil(y+s.h*zoom))};
 try{GV.forceDraw();const on=g.getImageData(0,0,c.width,c.height).data;s.img=empty;GV.forceDraw();const off=g.getImageData(0,0,c.width,c.height).data,indices=[];for(let yy=bounds.y0;yy<bounds.y1;yy++)for(let xx=bounds.x0;xx<bounds.x1;xx++){const k=yy*c.width+xx,i=4*k;let delta=0;for(let j=0;j<3;j++)delta+=Math.abs(on[i+j]-off[i+j]);if(delta>12)indices.push(k);}return{theme,rotation:GV.rot(),indices,count:indices.length,bounds,worldExact:world===C.world(),storageExact:storage===JSON.stringify(C.storage()),rendererUnmodified:true};}
 finally{s.img=original;GV.forceDraw();if(s.img!==original)throw Error('Exact canonical image restoration required');}
}
function quaysideOcclusion017(){
 const G=window.__quaysideQA017,C=window.__complexQA014,F=window.__complexFns014,before=quaysideState017(),storage=C.storage();GV.save();const raw=localStorage.getItem('glimmerville.v1.s3');if(!raw)throw Error('Complete original native save required');
 const out={foregrounds:[],trials:[],shots:[],selected:null,allFramesRetained:true,method:'Real paid k191 neighboring foreground; native paid removal of only this round own foreground-plot details; nine ordinary construction days; actual day sprite contribution with exact image restoration; paid doze, ordinary day, native undo and ordinary day. No mask/depth/world overrides.'};
 try{
  for(const plan of[{x:27,y:68,target:'lifebuoyStand',group:'baths'},{x:39,y:68,target:'netDryingRack',group:'fire'}]){
   const cells=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const x=plan.x+dx,y=plan.y+dy,t=GV.tile(x,y),owned=GV.quaysideAt017(x,y);if(t.bld||t.road||t.rail||t.tram||(t.amx502&&!owned))throw Error('Bounded paid foreground may replace only current quay details or plain land/path, never old themes or roads');const id=owned?GV.quaysideSpecs017().paths.find(p=>p.theme===owned.theme).id:t.am502===1?'footpath502':null;cells.push({x,y,tile:t,id});}
   for(const p of cells)if(GV.tile(p.x,p.y).am502)C.pay('doze',p.x,p.y);C.prepare(plan.x,plan.y,2);
   const payment=C.place('westminster',plan.x,plan.y,2),initial=GV.tile(plan.x,plan.y).bld,from=GV.stats().day,days=[];if(initial?.k!==191||initial.age!==0||initial.sz!==2)throw Error('Actual native paid age0 k191 required');
   for(let n=0;n<9;n++){F.step014(1);days.push({day:GV.stats().day,age:GV.tile(plan.x,plan.y).bld.age});}
   out.foregrounds.push({...plan,payment,initial,from,days,matured:GV.tile(plan.x,plan.y).bld});
   for(const rotation of[0,1,2,3]){
    quaysideScene017(rotation,false,plan.group,2);const withProbe=quaysideContribution017(plan.target),withPNG=document.getElementById('game').toDataURL('image/png'),quote=GV.placePreview459('doze',plan.x+1,plan.y+1),money=GV.devMoney516B(),day=GV.stats().day,removed=GV.placeUndo('doze',plan.x+1,plan.y+1),charged=money-GV.devMoney516B();if(!removed)throw Error('Actual paid reference-cell doze required');
    F.step014(1);quaysideScene017(rotation,false,plan.group,2);const control=quaysideContribution017(plan.target),controlPNG=document.getElementById('game').toDataURL('image/png'),undo=GV.undo();if(!undo)throw Error('Actual native foreground undo required');
    F.step014(1);quaysideScene017(rotation,false,plan.group,2);const restored=quaysideContribution017(plan.target),restoredPNG=document.getElementById('game').toDataURL('image/png'),b=GV.tile(plan.x,plan.y).bld,withSet=new Set(withProbe.indices),restoredSet=new Set(restored.indices);
    const blocked=control.indices.filter(i=>!withSet.has(i)).length,visible=control.indices.filter(i=>withSet.has(i)).length,blockedRestored=control.indices.filter(i=>!restoredSet.has(i)).length,visibleRestored=control.indices.filter(i=>restoredSet.has(i)).length;
    const q={theme:plan.target,rotation,foreground:{id:'westminster',k:191,x:plan.x,y:plan.y,sz:2},day,nextDay:GV.stats().day,quote,removed,charged,undo,identityRestored:b?.k===191&&b.age>=9&&cells.slice(1).every(p=>JSON.stringify(GV.tile(p.x,p.y).bld?.ref)===JSON.stringify([plan.x,plan.y])),candidates:control.count,blocked,visible,blockedRestored,visibleRestored,withProbe,control,restored};
    q.partial=q.candidates>50&&blocked>10&&visible>10&&blockedRestored>10&&visibleRestored>10&&[withProbe,control,restored].every(p=>p.worldExact&&p.storageExact&&p.rendererUnmodified);
    out.trials.push(q);for(const[phase,png]of[['with',withPNG],['control',controlPNG],['restored',restoredPNG]])out.shots.push({theme:plan.target,rotation,foreground:191,trial:out.trials.length,phase,png});
    if(q.partial&&q.identityRestored&&charged===quote.cost&&charged>0&&q.nextDay===day+2){out.selected=q;break;}
   }
   C.pay('doze',plan.x,plan.y);for(const p of cells)if(p.id)C.pay(p.id,p.x,p.y);if(out.selected)break;
  }
 }finally{const loaded=GV.load(),restored=quaysideState017(),saveBytesExact=localStorage.getItem('glimmerville.v1.s3')===raw;F.step014(1);const following=quaysideState017(),after=C.storage(),allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');out.restoration={loaded,identityExact:JSON.stringify(restored.identity)===JSON.stringify(before.identity),saveBytesExact,followingDay:following.day,fromDay:restored.day,allSixThemes:following.paths.length===6&&following.paths.every((p,i)=>p?.theme===G.paths[i].theme&&p.amx502.turn017===G.paths[i].turn),allPriorFourteenThemes:[restored,following].every(s=>s.priorDetails.length===14&&JSON.stringify(s.priorDetails.map(p=>({family:p.family,root:p.root,x:p.x,y:p.y,theme:p.theme,am502:p.am502,amx502:p.amx502,baseWalkCost:p.baseWalkCost,cost:p.cost})))===JSON.stringify(before.priorDetails.map(p=>({family:p.family,root:p.root,x:p.x,y:p.y,theme:p.theme,am502:p.am502,amx502:p.amx502,baseWalkCost:p.baseWalkCost,cost:p.cost})))),otherSlotsExact:[...new Set([...Object.keys(storage),...Object.keys(after)])].filter(k=>!allowed(k)).every(k=>storage[k]===after[k])};}
 return out;
}
const functions017=[quaysidePriorPaths017,setupQuayside017,bindQuayside017,quaysideState017,assetAudit017,quaysidePurity017,quaysideTransactions017,quaysideEdits017,quaysideConflictTools017,quaysideConstraints017,quaysideScene017,quaysideContribution017,quaysideOcclusion017];
module.exports={functions017};

'use strict';
// Functions are serialized into disposable Actions Chrome only. Node imports
// this module for source inspection without executing any game/renderer code.
// Observe the eight declared old theme coordinates directly. The native
// aggregate amCells list is lazily rebuilt and can still be empty immediately
// after paused paid placement; this getter must never repair or advance it.
function gardenLifePriorPaths016(){
 const rows=window.__streetscapeQA015?.paths;
 if(!Array.isArray(rows)||rows.length!==8||new Set(rows.map(p=>p.x+','+p.y)).size!==8||new Set(rows.map(p=>p.theme)).size!==8)throw Error('Eight distinct declared prior streetscape coordinates required');
 return rows.map(p=>{const at=GV.streetscapeAt015(p.x,p.y);if(!at||at.x!==p.x||at.y!==p.y||at.theme!==p.theme||at.am502!==1||at.amx502?.british015!==p.theme||at.amx502?.turn015!==p.turn)throw Error('Direct native prior streetscape identity changed at '+p.x+','+p.y);return at;});
}
function setupGardenLife016(){
 const F=window.__complexFns014,Q=window.__complexQA014,specs=GV.gardenLifeSpecs016().paths,old=F.identity014();
 const positions=[[30,68],[31,68],[32,68],[42,68],[43,68],[44,68]],payments=[],paths=[];
 for(let n=0;n<specs.length;n++){
  const q=specs[n],[x,y]=positions[n],before=GV.tile(x,y);
  if(before.am502){if(before.am502!==1||before.amx502)throw Error('Only explicitly declared plain path fixture cells may be replaced');Q.pay('doze',x,y);}
  else Q.prepare(x,y,1);
  const quote=GV.placePreview459(q.id,x,y),plain=GV.placePreview459('footpath502',x,y),money=GV.devMoney516B();
  if(!quote.ok||quote.cost!==plain.cost||quote.cost!==q.cost)throw Error('Exact native walking cost and valid site required: '+q.id+' '+JSON.stringify(quote));
  const ok=GV.placeUndo(q.id,x,y),after=GV.gardenLifeAt016(x,y),charged=money-GV.devMoney516B();
  if(!ok||charged!==quote.cost||!after||after.theme!==q.theme||after.am502!==1)throw Error('Genuine paid theme transaction required');
  paths.push({...q,x,y,turn:after.amx502.turn016});payments.push({id:q.id,x,y,before,quote,plain,charged,after,exact:charged===quote.cost});
 }
 const scene={paths,payments,placementDay:GV.stats().day,priorStreetscape:gardenLifePriorPaths016()};window.__gardenLifeQA016=scene;
 scene.canonical=Object.entries(GV.art574.SPR().gardenLife016);scene.oldIdentities=old;
 return{paths,payments,oldBuildingIdentityExact:JSON.stringify(old.buildings)===JSON.stringify(F.identity014().buildings),priorThemesExact:old.paths.filter(p=>p.amx502).every(p=>JSON.stringify(F.identity014().paths.find(z=>z.i===p.i))===JSON.stringify(p)),priorStreetscapeCount:gardenLifePriorPaths016().length,placementDay:scene.placementDay};
}
function bindGardenLife016(recipe){window.__gardenLifeQA016={...recipe,canonical:Object.entries(GV.art574.SPR().gardenLife016)};return true;}
function gardenLifeState016(){const Q=window.__gardenLifeQA016;return{day:GV.stats().day,stats:GV.stats(),identity:window.__complexFns014.identity014(),paths:Q.paths.map(p=>GV.gardenLifeAt016(p.x,p.y)),old:window.__complexFns014.snapshot014(),priorStreetscape:gardenLifePriorPaths016(),slot:localStorage.getItem('glimmerville.v1.slot'),otherSlots:Object.fromEntries(Object.keys(localStorage).filter(k=>/^glimmerville\.v1\.s[12](?:$|[._])/.test(k)).sort().map(k=>[k,localStorage.getItem(k)]))};}
function assetAudit016(){return Object.entries(GV.art574.SPR().gardenLife016).map(([key,s])=>{
 const day=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,night=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;
 let opaque=0,partial=0,lit=0,outside=0,edge=0,minX=s.w,maxX=-1,minY=s.h,maxY=-1;
 for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=4*(y*s.w+x);if(day[i+3]){if(day[i+3]===255)opaque++;else partial++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);if(x===0||y===0||x===s.w-1||y===s.h-1)edge++;}if(night[i+3]){lit++;if(day[i+3]!==255)outside++;}}
 return{key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,theme:s.theme,opaque,partial,lit,outside,edge,bounds:{minX,maxX,minY,maxY},clearWalkStrip:s.clearWalkStrip,minimumClearPath:s.minimumClearPath,physicalLampCount:s.physicalLampCount,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')};
});}
function gardenLifePurity016(){
 const Q=window.__complexQA014,R=window.__gardenLifeQA016,world=Q.world(),storage=JSON.stringify(Q.storage()),canonical=Object.entries(GV.art574.SPR().gardenLife016),before=canonical.map(([k,s])=>[k,s.img.toDataURL(),s.night.toDataURL()]),nativeBefore=JSON.stringify(GV.fp536()),old=Math.random,start=performance.now();let calls=0;
 Math.random=()=>{calls++;throw Error('Art consumed simulation RNG');};
 try{const a=window.BritishGardenLifeArchitecture016.buildAll().modules,b=window.BritishGardenLifeArchitecture016.buildAll().modules;return{calls,ms:performance.now()-start,count:Object.keys(a).length,deterministic:Object.keys(a).every(k=>a[k].img.toDataURL()===b[k].img.toDataURL()&&a[k].night.toDataURL()===b[k].night.toDataURL()),worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),oldAndNewFingerprintExact:nativeBefore===JSON.stringify(GV.fp536()),canonical:canonical.every(([k,s],n)=>GV.art574.SPR().gardenLife016[k]===s&&s.img.toDataURL()===before[n][1]&&s.night.toDataURL()===before[n][2])};}finally{Math.random=old;}
}
function gardenLifeTransactions016(){
 const Q=window.__gardenLifeQA016,rows=[];
 for(const p of Q.paths){const before=JSON.stringify(GV.tile(p.x,p.y)),money=GV.devMoney516B(),quote=GV.placePreview459('doze',p.x,p.y),removed=GV.placeUndo('doze',p.x,p.y),gone=!GV.gardenLifeAt016(p.x,p.y),charged=money-GV.devMoney516B(),undo=GV.undo(),restored=before===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money,redo=GV.redo(),regone=!GV.gardenLifeAt016(p.x,p.y),redoPaid=money-GV.devMoney516B()===charged,undoAgain=GV.undo(),final=before===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money;rows.push({theme:p.theme,quote,removed,gone,charged,undo,restored,redo,regone,redoPaid,undoAgain,final});}
 const F=window.__complexQA014,world=F.world(),storage=JSON.stringify(F.storage());for(let n=0;n<8;n++)GV.forceDraw();
 return{rows,drawWorldExact:world===F.world(),drawStorageExact:storage===JSON.stringify(F.storage()),canonical:Q.canonical.every(([k,s])=>GV.art574.SPR().gardenLife016[k]===s)};
}
function gardenLifeEdits016(){
 const Q=window.__gardenLifeQA016,F=window.__complexQA014,rows=[];
 for(let n=0;n<Q.paths.length;n++){
  const p=Q.paths[n],next=Q.paths[(n+1)%Q.paths.length],before=GV.gardenLifeAt016(p.x,p.y),remove=F.pay('doze',p.x,p.y),purchase=F.pay(next.id,p.x,p.y),edited=GV.gardenLifeAt016(p.x,p.y);
  GV.save();const stored=localStorage.getItem('glimmerville.v1.s3'),loaded=GV.load(),restored=GV.gardenLifeAt016(p.x,p.y),day=GV.stats().day;
  window.__complexFns014.step014(1);const afterDay=GV.gardenLifeAt016(p.x,p.y);
  const removeEdited=F.pay('doze',p.x,p.y),original=F.pay(p.id,p.x,p.y),final=GV.gardenLifeAt016(p.x,p.y);
  rows.push({from:p.theme,to:next.theme,before,remove,purchase,edited,storedBytes:stored.length,loaded,restored,afterDay,day,nextDay:GV.stats().day,removeEdited,original,final,exact:edited.theme===next.theme&&loaded&&JSON.stringify(edited.amx502)===JSON.stringify(restored.amx502)&&JSON.stringify(restored.amx502)===JSON.stringify(afterDay.amx502)&&final.theme===p.theme&&final.amx502.turn016===p.turn});
 }
 GV.save();const before=gardenLifeState016(),had=Object.hasOwn(window,'__noGardenLife016'),flag=window.__noGardenLife016;window.__noGardenLife016=true;let loaded,after;
 try{loaded=GV.load();after=gardenLifeState016();}finally{if(had)window.__noGardenLife016=flag;else delete window.__noGardenLife016;}
 const disabledLoad=loaded&&JSON.stringify(before.identity)===JSON.stringify(after.identity),immediateLighting=after.paths.map(p=>p?.lighting),fromDay=GV.stats().day;window.__complexFns014.step014(1);const following=gardenLifeState016();
 return{rows,disabledLoad,immediateLighting,fromDay,followingDay:following.day,followingLighting:following.paths.map(p=>p?.lighting),otherSlotsExact:JSON.stringify(before.otherSlots)===JSON.stringify(following.otherSlots)};
}
function gardenLifeConstraints016(){
 const Q=window.__gardenLifeQA016,rows=[];
 for(const p of Q.paths){const before=JSON.stringify(GV.tile(p.x,p.y)),money=GV.devMoney516B();for(const id of ['road','footpath502','footcycle502','pumpCourt016','heritageLantern015','sundialCourt015','britishTerrace','tdig','tland','traise']){const quote=GV.placePreview459(id,p.x,p.y);if(!quote)continue;const ok=GV.placeUndo(id,p.x,p.y);rows.push({theme:p.theme,id,reason:quote.reason,blocked:!ok,tileExact:before===JSON.stringify(GV.tile(p.x,p.y)),moneyExact:money===GV.devMoney516B()});}}
 const site={x:33,y:68},before=GV.tile(site.x,site.y),money=GV.devMoney516B(),quote=GV.placePreview459('doze',site.x,site.y);if(before.am502!==1||before.amx502||before.bld||before.road)throw Error('Only one known plain fixture path may open for escape control');const removed=GV.placeUndo('doze',site.x,site.y),charged=money-GV.devMoney516B();if(!removed||charged!==quote.cost)throw Error('Real paid escape-control site removal required');
 const specs=GV.gardenLifeSpecs016().paths,positive=specs.every(q=>GV.placePreview459(q.id,site.x,site.y).ok),had=Object.hasOwn(window,'__noGardenLife016'),flag=window.__noGardenLife016;let disabled=false;
 try{window.__noGardenLife016=true;disabled=specs.every(q=>!GV.placePreview459(q.id,site.x,site.y).ok);}finally{if(had)window.__noGardenLife016=flag;else delete window.__noGardenLife016;}
 const undo=GV.undo(),exact=JSON.stringify(GV.tile(site.x,site.y))===JSON.stringify(before)&&GV.devMoney516B()===money;
 return{rows,disabled,escape:{site,removed,quote,charged,positive,disabled,undo,exact}};
}
function gardenLifeScene016(rotation,night,group='both',zoom=1.75){
 const Q=window.__gardenLifeQA016,focus=group==='baths'?[31.5,66.6]:group==='fire'?[43.5,66.6]:[37.5,66.5];
 GV.setRot(rotation);GV.setZoom(zoom);GV.lookAt(...focus);GV.setVisT(GV.art574.cycle574()*(night?.9:.5));GV.weather(0);GV.forceDraw();
 const c=document.getElementById('game'),cam=GV.camera436(),paths=Q.paths.map(p=>{const current=GV.gardenLifeAt016(p.x,p.y);if(!current)return{...p,temporarilyAbsent:true};const s=GV.art574.SPR().gardenLife016[p.theme+'_'+((p.turn+rotation)&3)],v=GV.w2v(p.x,p.y),x=Math.round(c.width/2-cam.x*zoom)+(v[0]-v[1])*32*zoom+(32-s.ax)*zoom,y=Math.round(c.height/2-cam.y*zoom)+(v[0]+v[1])*16*zoom+(32-s.ay)*zoom;return{...p,view:(p.turn+rotation)&3,canonical:s===Q.canonical.find(([k])=>k===p.theme+'_'+((p.turn+rotation)&3))?.[1],box:{x,y,w:s.w*zoom,h:s.h*zoom},within:x>=0&&y>=0&&x+s.w*zoom<=c.width&&y+s.h*zoom<=c.height,lighting:GV.gardenLifeAt016(p.x,p.y).lighting};});
 return{png:c.toDataURL('image/png'),rotation:GV.rot(),night,time:GV.daylightDbg(),day:GV.stats().day,group,paths,width:c.width,height:c.height};
}
// Source-native controlled same-turn day rendering: remove ONLY the chosen
// canonical image temporarily, then restore its exact object. No compositor,
// mask, depth erasure, model, world, save or supply flag is changed.
function gardenLifeContribution016(theme){
 const Q=window.__gardenLifeQA016,p=Q.paths.find(p=>p.theme===theme),key=theme+'_'+((p.turn+GV.rot())&3),s=GV.art574.SPR().gardenLife016[key],c=document.getElementById('game'),g=c.getContext('2d'),original=s.img,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
 const C=window.__complexQA014,world=C.world(),storage=JSON.stringify(C.storage()),cam=GV.camera436(),zoom=cam.z,v=GV.w2v(p.x,p.y),x=Math.round(c.width/2-cam.x*zoom)+(v[0]-v[1])*32*zoom+(32-s.ax)*zoom,y=Math.round(c.height/2-cam.y*zoom)+(v[0]+v[1])*16*zoom+(32-s.ay)*zoom;
 const bounds={x0:Math.max(0,Math.floor(x)),x1:Math.min(c.width,Math.ceil(x+s.w*zoom)),y0:Math.max(0,Math.floor(y)),y1:Math.min(c.height,Math.ceil(y+s.h*zoom))};
 try{GV.forceDraw();const on=g.getImageData(0,0,c.width,c.height).data;s.img=empty;GV.forceDraw();const off=g.getImageData(0,0,c.width,c.height).data,indices=[];for(let yy=bounds.y0;yy<bounds.y1;yy++)for(let xx=bounds.x0;xx<bounds.x1;xx++){const k=yy*c.width+xx,i=4*k;let delta=0;for(let j=0;j<3;j++)delta+=Math.abs(on[i+j]-off[i+j]);if(delta>12)indices.push(k);}return{theme,rotation:GV.rot(),indices,count:indices.length,bounds,worldExact:world===C.world(),storageExact:storage===JSON.stringify(C.storage()),rendererUnmodified:true};}
 finally{s.img=original;GV.forceDraw();if(s.img!==original)throw Error('Exact canonical image restoration required');}
}
function gardenLifeOcclusion016(){
 const G=window.__gardenLifeQA016,C=window.__complexQA014,F=window.__complexFns014,before=gardenLifeState016(),storage=C.storage();GV.save();const raw=localStorage.getItem('glimmerville.v1.s3');if(!raw)throw Error('Complete original native save required');
 const out={foregrounds:[],trials:[],shots:[],selected:null,allFramesRetained:true,method:'Real paid k191 neighboring foreground; nine ordinary construction days; actual day sprite contribution with exact image restoration; paid doze, ordinary day, native undo and ordinary day. No mask/depth/world overrides.'};
 try{
  for(const plan of[{x:28,y:68,target:'pumpCourt',group:'baths'},{x:40,y:68,target:'croquetCorner',group:'fire'}]){
   const cells=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const x=plan.x+dx,y=plan.y+dy,t=GV.tile(x,y);if(t.bld||t.road||t.rail||t.tram||t.amx502)throw Error('Bounded new foreground plot must have no old building, road or decorated path');cells.push({x,y,tile:t});}
   C.prepare(plan.x,plan.y,2);for(const p of cells)if(GV.tile(p.x,p.y).am502)C.pay('doze',p.x,p.y);
   const payment=C.place('westminster',plan.x,plan.y,2),initial=GV.tile(plan.x,plan.y).bld,from=GV.stats().day,days=[];if(initial?.k!==191||initial.age!==0||initial.sz!==2)throw Error('Actual native paid age0 k191 required');
   for(let n=0;n<9;n++){F.step014(1);days.push({day:GV.stats().day,age:GV.tile(plan.x,plan.y).bld.age});}
   out.foregrounds.push({...plan,payment,initial,from,days,matured:GV.tile(plan.x,plan.y).bld});
   for(const rotation of[0,1,2,3]){
    gardenLifeScene016(rotation,false,plan.group,2);const withProbe=gardenLifeContribution016(plan.target),withPNG=document.getElementById('game').toDataURL('image/png'),quote=GV.placePreview459('doze',plan.x+1,plan.y+1),money=GV.devMoney516B(),day=GV.stats().day,removed=GV.placeUndo('doze',plan.x+1,plan.y+1),charged=money-GV.devMoney516B();if(!removed)throw Error('Actual paid reference-cell doze required');
    F.step014(1);gardenLifeScene016(rotation,false,plan.group,2);const control=gardenLifeContribution016(plan.target),controlPNG=document.getElementById('game').toDataURL('image/png'),undo=GV.undo();if(!undo)throw Error('Actual native foreground undo required');
    F.step014(1);gardenLifeScene016(rotation,false,plan.group,2);const restored=gardenLifeContribution016(plan.target),restoredPNG=document.getElementById('game').toDataURL('image/png'),b=GV.tile(plan.x,plan.y).bld,withSet=new Set(withProbe.indices),restoredSet=new Set(restored.indices);
    const blocked=control.indices.filter(i=>!withSet.has(i)).length,visible=control.indices.filter(i=>withSet.has(i)).length,blockedRestored=control.indices.filter(i=>!restoredSet.has(i)).length,visibleRestored=control.indices.filter(i=>restoredSet.has(i)).length;
    const q={theme:plan.target,rotation,foreground:{id:'westminster',k:191,x:plan.x,y:plan.y,sz:2},day,nextDay:GV.stats().day,quote,removed,charged,undo,identityRestored:b?.k===191&&b.age>=9&&cells.slice(1).every(p=>JSON.stringify(GV.tile(p.x,p.y).bld?.ref)===JSON.stringify([plan.x,plan.y])),candidates:control.count,blocked,visible,blockedRestored,visibleRestored,withProbe,control,restored};
    q.partial=q.candidates>50&&blocked>10&&visible>10&&blockedRestored>10&&visibleRestored>10&&[withProbe,control,restored].every(p=>p.worldExact&&p.storageExact&&p.rendererUnmodified);
    out.trials.push(q);for(const[phase,png]of[['with',withPNG],['control',controlPNG],['restored',restoredPNG]])out.shots.push({theme:plan.target,rotation,foreground:191,trial:out.trials.length,phase,png});
    if(q.partial&&q.identityRestored&&charged===quote.cost&&charged>0&&q.nextDay===day+2){out.selected=q;break;}
   }
   C.pay('doze',plan.x,plan.y);for(const p of cells)if(p.tile.am502===1)C.pay('footpath502',p.x,p.y);if(out.selected)break;
  }
 }finally{const loaded=GV.load(),restored=gardenLifeState016(),saveBytesExact=localStorage.getItem('glimmerville.v1.s3')===raw;F.step014(1);const following=gardenLifeState016(),after=C.storage(),allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');out.restoration={loaded,identityExact:JSON.stringify(restored.identity)===JSON.stringify(before.identity),saveBytesExact,followingDay:following.day,fromDay:restored.day,allSixThemes:following.paths.length===6&&following.paths.every((p,i)=>p?.theme===G.paths[i].theme&&p.amx502.turn016===G.paths[i].turn),allPriorEightThemes:restored.priorStreetscape.length===8&&JSON.stringify(restored.priorStreetscape.map(p=>p.amx502))===JSON.stringify(before.priorStreetscape.map(p=>p.amx502)),otherSlotsExact:[...new Set([...Object.keys(storage),...Object.keys(after)])].filter(k=>!allowed(k)).every(k=>storage[k]===after[k])};}
 return out;
}
const functions016=[gardenLifePriorPaths016,setupGardenLife016,bindGardenLife016,gardenLifeState016,assetAudit016,gardenLifePurity016,gardenLifeTransactions016,gardenLifeEdits016,gardenLifeConstraints016,gardenLifeScene016,gardenLifeContribution016,gardenLifeOcclusion016];
module.exports={functions016};

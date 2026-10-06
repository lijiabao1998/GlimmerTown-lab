'use strict';
// Functions are serialized into disposable Actions Chrome only. Node imports
// this module for source inspection without executing any game/renderer code.
function setupStreetscape015(){
 const F=window.__complexFns014,Q=window.__complexQA014,specs=GV.streetscapeSpecs015().paths,old=F.identity014();
 const positions=[[9,68],[11,69],[7,68],[8,68],[18,68],[19,68],[20,68],[21,68]],payments=[],paths=[];
 for(let n=0;n<specs.length;n++){
  const q=specs[n],[x,y]=positions[n],before=GV.tile(x,y);
  if(before.am502){if(before.am502!==1||before.amx502)throw Error('Only explicitly declared plain path fixture cells may be replaced');Q.pay('doze',x,y);}
  else Q.prepare(x,y,1);
  const quote=GV.placePreview459(q.id,x,y),plain=GV.placePreview459('footpath502',x,y),money=GV.devMoney516B();
  if(!quote.ok||quote.cost!==plain.cost||quote.cost!==q.cost)throw Error('Exact native walking cost and valid site required: '+q.id+' '+JSON.stringify(quote));
  const ok=GV.placeUndo(q.id,x,y),after=GV.streetscapeAt015(x,y),charged=money-GV.devMoney516B();
  if(!ok||charged!==quote.cost||!after||after.theme!==q.theme||after.am502!==1)throw Error('Genuine paid theme transaction required');
  paths.push({...q,x,y,turn:after.amx502.turn015});payments.push({id:q.id,x,y,before,quote,plain,charged,after,exact:charged===quote.cost});
 }
 const scene={paths,payments,placementDay:GV.stats().day};window.__streetscapeQA015=scene;
 scene.canonical=Object.entries(GV.art574.SPR().streetscape015);scene.oldIdentities=old;
 return{paths,payments,oldBuildingIdentityExact:JSON.stringify(old.buildings)===JSON.stringify(F.identity014().buildings),priorThemesExact:old.paths.filter(p=>p.amx502).every(p=>JSON.stringify(F.identity014().paths.find(z=>z.i===p.i))===JSON.stringify(p)),placementDay:scene.placementDay};
}
function bindStreetscape015(recipe){window.__streetscapeQA015={...recipe,canonical:Object.entries(GV.art574.SPR().streetscape015)};return true;}
function streetscapeState015(){const Q=window.__streetscapeQA015;return{day:GV.stats().day,stats:GV.stats(),identity:window.__complexFns014.identity014(),paths:Q.paths.map(p=>GV.streetscapeAt015(p.x,p.y)),old:window.__complexFns014.snapshot014(),slot:localStorage.getItem('glimmerville.v1.slot'),otherSlots:Object.fromEntries(Object.keys(localStorage).filter(k=>/^glimmerville\.v1\.s[12](?:$|[._])/.test(k)).sort().map(k=>[k,localStorage.getItem(k)]))};}
function assetAudit015(){return Object.entries(GV.art574.SPR().streetscape015).map(([key,s])=>{
 const day=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,night=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;
 let opaque=0,partial=0,lit=0,outside=0,edge=0,minX=s.w,maxX=-1,minY=s.h,maxY=-1;
 for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=4*(y*s.w+x);if(day[i+3]){if(day[i+3]===255)opaque++;else partial++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);if(x===0||y===0||x===s.w-1||y===s.h-1)edge++;}if(night[i+3]){lit++;if(day[i+3]!==255)outside++;}}
 return{key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,theme:s.theme,opaque,partial,lit,outside,edge,bounds:{minX,maxX,minY,maxY},clearWalkStrip:s.clearWalkStrip,minimumClearPath:s.minimumClearPath,physicalLampCount:s.physicalLampCount,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')};
});}
function streetscapePurity015(){
 const Q=window.__complexQA014,R=window.__streetscapeQA015,world=Q.world(),storage=JSON.stringify(Q.storage()),canonical=Object.entries(GV.art574.SPR().streetscape015),before=canonical.map(([k,s])=>[k,s.img.toDataURL(),s.night.toDataURL()]),old=Math.random,start=performance.now();let calls=0;
 Math.random=()=>{calls++;throw Error('Art consumed simulation RNG');};
 try{const a=window.BritishStreetscapeArchitecture015.buildAll().modules,b=window.BritishStreetscapeArchitecture015.buildAll().modules;return{calls,ms:performance.now()-start,count:Object.keys(a).length,deterministic:Object.keys(a).every(k=>a[k].img.toDataURL()===b[k].img.toDataURL()&&a[k].night.toDataURL()===b[k].night.toDataURL()),worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),canonical:canonical.every(([k,s],n)=>GV.art574.SPR().streetscape015[k]===s&&s.img.toDataURL()===before[n][1]&&s.night.toDataURL()===before[n][2])};}finally{Math.random=old;}
}
function streetscapeTransactions015(){
 const Q=window.__streetscapeQA015,rows=[];
 for(const p of Q.paths){const before=JSON.stringify(GV.tile(p.x,p.y)),money=GV.devMoney516B(),quote=GV.placePreview459('doze',p.x,p.y),removed=GV.placeUndo('doze',p.x,p.y),gone=!GV.streetscapeAt015(p.x,p.y),charged=money-GV.devMoney516B(),undo=GV.undo(),restored=before===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money,redo=GV.redo(),regone=!GV.streetscapeAt015(p.x,p.y),redoPaid=money-GV.devMoney516B()===charged,undoAgain=GV.undo(),final=before===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money;rows.push({theme:p.theme,quote,removed,gone,charged,undo,restored,redo,regone,redoPaid,undoAgain,final});}
 const F=window.__complexQA014,world=F.world(),storage=JSON.stringify(F.storage());for(let n=0;n<8;n++)GV.forceDraw();
 return{rows,drawWorldExact:world===F.world(),drawStorageExact:storage===JSON.stringify(F.storage()),canonical:Q.canonical.every(([k,s])=>GV.art574.SPR().streetscape015[k]===s)};
}
function streetscapeEdits015(){
 const Q=window.__streetscapeQA015,F=window.__complexQA014,rows=[];
 for(let n=0;n<Q.paths.length;n++){
  const p=Q.paths[n],next=Q.paths[(n+1)%Q.paths.length],before=GV.streetscapeAt015(p.x,p.y),remove=F.pay('doze',p.x,p.y),purchase=F.pay(next.id,p.x,p.y),edited=GV.streetscapeAt015(p.x,p.y);
  GV.save();const stored=localStorage.getItem('glimmerville.v1.s3'),loaded=GV.load(),restored=GV.streetscapeAt015(p.x,p.y),day=GV.stats().day;
  window.__complexFns014.step014(1);const afterDay=GV.streetscapeAt015(p.x,p.y);
  const removeEdited=F.pay('doze',p.x,p.y),original=F.pay(p.id,p.x,p.y),final=GV.streetscapeAt015(p.x,p.y);
  rows.push({from:p.theme,to:next.theme,before,remove,purchase,edited,storedBytes:stored.length,loaded,restored,afterDay,day,nextDay:GV.stats().day,removeEdited,original,final,exact:edited.theme===next.theme&&loaded&&JSON.stringify(edited.amx502)===JSON.stringify(restored.amx502)&&JSON.stringify(restored.amx502)===JSON.stringify(afterDay.amx502)&&final.theme===p.theme&&final.amx502.turn015===p.turn});
 }
 GV.save();const before=streetscapeState015(),had=Object.hasOwn(window,'__noStreetscape015'),flag=window.__noStreetscape015;window.__noStreetscape015=true;let loaded,after;
 try{loaded=GV.load();after=streetscapeState015();}finally{if(had)window.__noStreetscape015=flag;else delete window.__noStreetscape015;}
 return{rows,disabledLoad:loaded&&JSON.stringify(before.identity)===JSON.stringify(after.identity),otherSlotsExact:JSON.stringify(before.otherSlots)===JSON.stringify(after.otherSlots)};
}
function streetscapeConstraints015(){
 const Q=window.__streetscapeQA015,rows=[];
 for(const p of Q.paths){const before=JSON.stringify(GV.tile(p.x,p.y)),money=GV.devMoney516B();for(const id of ['road','footpath502','footcycle502','heritageLantern015','britishTerrace','tdig','tland','traise']){const quote=GV.placePreview459(id,p.x,p.y);if(!quote)continue;const ok=GV.placeUndo(id,p.x,p.y);rows.push({theme:p.theme,id,reason:quote.reason,blocked:!ok,tileExact:before===JSON.stringify(GV.tile(p.x,p.y)),moneyExact:money===GV.devMoney516B()});}}
 const p=Q.paths[0],flag=window.__noStreetscape015;window.__noStreetscape015=true;const disabled=GV.streetscapeSpecs015().paths.every(q=>!GV.placePreview459(q.id,3,3).ok);window.__noStreetscape015=flag;
 return{rows,disabled};
}
function streetscapeScene015(rotation,night,group='both',zoom=1.75){
 const Q=window.__streetscapeQA015,focus=group==='college'?[9.5,66.6]:group==='manor'?[21,66.6]:[15,66.5];
 GV.setRot(rotation);GV.setZoom(zoom);GV.lookAt(...focus);GV.setVisT(GV.art574.cycle574()*(night?.9:.5));GV.weather(0);GV.forceDraw();
 const c=document.getElementById('game'),cam=GV.camera436(),paths=Q.paths.map(p=>{const s=GV.art574.SPR().streetscape015[p.theme+'_'+((p.turn+rotation)&3)],v=GV.w2v(p.x,p.y),x=Math.round(c.width/2-cam.x*zoom)+(v[0]-v[1])*32*zoom+(32-s.ax)*zoom,y=Math.round(c.height/2-cam.y*zoom)+(v[0]+v[1])*16*zoom+(32-s.ay)*zoom;return{...p,view:(p.turn+rotation)&3,canonical:s===Q.canonical.find(([k])=>k===p.theme+'_'+((p.turn+rotation)&3))?.[1],box:{x,y,w:s.w*zoom,h:s.h*zoom},within:x>=0&&y>=0&&x+s.w*zoom<=c.width&&y+s.h*zoom<=c.height,lighting:GV.streetscapeAt015(p.x,p.y).lighting};});
 return{png:c.toDataURL('image/png'),rotation:GV.rot(),night,time:GV.daylightDbg(),day:GV.stats().day,group,paths,width:c.width,height:c.height};
}
function streetscapeLight015(theme){
 const Q=window.__streetscapeQA015,p=Q.paths.find(p=>p.theme===theme),s=GV.art574.SPR().streetscape015[theme+'_'+((p.turn+GV.rot())&3)],c=document.getElementById('game'),g=c.getContext('2d'),original=s.night,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
 const had=Object.hasOwn(window,'__nightOccNoErase629'),flag=window.__nightOccNoErase629,world=window.__complexQA014.world(),storage=JSON.stringify(window.__complexQA014.storage());
 const shot=(emit,erase)=>{s.night=emit?original:empty;window.__nightOccNoErase629=!erase;GV.forceDraw();return g.getImageData(0,0,c.width,c.height).data;};
 try{const on=shot(true,true),off=shot(false,true),unmasked=shot(true,false),none=shot(false,false);let candidates=0,blocked=0,visible=0;for(let i=0;i<on.length;i+=4){let a=0,b=0;for(let k=0;k<3;k++){a+=Math.abs(on[i+k]-off[i+k]);b+=Math.abs(unmasked[i+k]-none[i+k]);}if(b>9){candidates++;if(a<=3)blocked++;if(a>9)visible++;}}return{theme,rotation:GV.rot(),candidates,blocked,visible,light:GV.streetscapeAt015(p.x,p.y).lighting,worldExact:world===window.__complexQA014.world(),storageExact:storage===JSON.stringify(window.__complexQA014.storage()),physicalMaskOnly:true};}finally{s.night=original;if(had)window.__nightOccNoErase629=flag;else delete window.__nightOccNoErase629;GV.forceDraw();}
}
function streetscapeOcclusion015(){
 const Q=window.__streetscapeQA015,C=window.__complexQA014,F=window.__complexFns014,probes=[],trials=[],shots=[];
 for(const rotation of[0,1,2,3]){streetscapeScene015(rotation,true,'college',2);for(const theme of ['heritageLantern','basketLamp'])probes.push(streetscapeLight015(theme));}
 const candidates=probes.filter(q=>q.candidates>0&&q.blocked>0&&q.visible>0&&q.worldExact&&q.storageExact);let selected=null;
 for(const candidate of candidates){
  const p=Q.paths.find(p=>p.theme===candidate.theme);
  for(const root of C.roots.filter(r=>r.group==='college')){
   streetscapeScene015(candidate.rotation,true,'college',2);const before=streetscapeLight015(p.theme),original=GV.tile(root.x,root.y).bld,quote=GV.placePreview459('doze',root.x,root.y),money=GV.devMoney516B(),day=GV.stats().day;
   const withPNG=document.getElementById('game').toDataURL('image/png'),removed=GV.placeUndo('doze',root.x,root.y),charged=money-GV.devMoney516B();
   if(!removed)throw Error('Native foreground doze failed');F.step014(1);streetscapeScene015(candidate.rotation,true,'college',2);const control=streetscapeLight015(p.theme),controlPNG=document.getElementById('game').toDataURL('image/png'),undo=GV.undo();
   if(!undo)throw Error('Native foreground undo failed');F.step014(1);streetscapeScene015(candidate.rotation,true,'college',2);const restored=streetscapeLight015(p.theme),current=GV.tile(root.x,root.y).bld,restoredPNG=document.getElementById('game').toDataURL('image/png');
   const identityRestored=current?.k===original.k&&current.sz===original.sz&&current.v===original.v&&current.lv===original.lv&&current.age>=9&&Array.from({length:root.sz*root.sz},(_,i)=>i===0||JSON.stringify(GV.tile(root.x+i%root.sz,root.y+Math.floor(i/root.sz)).bld?.ref)===JSON.stringify([root.x,root.y])).every(Boolean);
   const q={theme:p.theme,rotation:candidate.rotation,foreground:{id:root.id,k:root.k,x:root.x,y:root.y,sz:root.sz},day,nextDay:GV.stats().day,original,current,quote,removed,charged,undo,identityRestored,before,control,restored,partial:before.blocked>0&&before.visible>0&&control.candidates>0&&control.blocked<before.blocked&&control.visible>before.visible&&restored.blocked>0&&restored.visible>0&&before.light.service>.03&&control.light.service>.03&&restored.light.service>.03};
   trials.push(q);for(const [phase,png]of[['with',withPNG],['control',controlPNG],['restored',restoredPNG]])shots.push({theme:p.theme,rotation:candidate.rotation,foreground:root.k,trial:trials.length,phase,png});
   if(q.partial&&identityRestored&&charged===quote.cost&&charged>0&&q.nextDay===day+2){selected=q;break;}
  }
  if(selected)break;
 }
 return{probes,trials,shots,selected,allFramesRetained:true,method:'Genuine paid mature neighboring building doze, one ordinary day, native undo and one ordinary day; lamp road supply stays real; no terrain, age, utility or saved-state assignments.'};
}
const functions015=[setupStreetscape015,bindStreetscape015,streetscapeState015,assetAudit015,streetscapePurity015,streetscapeTransactions015,streetscapeEdits015,streetscapeConstraints015,streetscapeScene015,streetscapeLight015,streetscapeOcclusion015];
module.exports={functions015};

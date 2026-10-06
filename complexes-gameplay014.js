#!/usr/bin/env node
'use strict';
// Pure source registration in Node; native browser/simulation execution is Actions-only.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
function identity014() {
 const Q = window.__complexQA014, buildings = [], paths = [], terrain = [];
 for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
  const t = GV.tile(x, y), b = t.bld;
  if (b) buildings.push({ i: y * Q.N + x, k: b.k, ref: b.ref || null, lv: b.lv, v: b.v, age: b.age, sz: b.sz || 1 });
  if (t.am502) paths.push({ i: y * Q.N + x, am502: t.am502, amx502: t.amx502 || null });
 }
 for (const p of Q.waterCells) terrain.push({ x: p.x, y: p.y, t: GV.tile(p.x, p.y).t });
 return { buildings, paths, terrain };
}

function assetAudit014(){const A=GV.art574.SPR(),out=[];for(const [key,s]of[...Array.from({length:12},(_,n)=>282+n).flatMap(k=>[0,1,2,3].map(v=>['bld.'+k+'_1_'+v,A.bld[k+'_1_'+v]])),...Object.entries(A.complexes014).map(([k,s])=>['complexes014.'+k,s])]){const d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let opaque=0,partial=0,lit=0,outside=0;for(let i=3;i<d.length;i+=4){if(d[i]===255)opaque++;else if(d[i])partial++;if(n[i]){lit++;if(d[i]!==255)outside++;}}out.push({key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,opaque,partial,lit,outside,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')});}return out;}

function artPurity014() {
 const Q = window.__complexQA014, before = Q.world(), storage = JSON.stringify(Q.storage());
 const refs = [...Q.canonical.map(([k, sprite]) => ['bld.' + k, sprite]), ...Q.canonicalPaths.map(([k, sprite]) => ['complexes014.' + k, sprite])];
 const ink = refs.map(([key, sprite]) => ({ key, day: sprite.img.toDataURL(), night: sprite.night.toDataURL() }));
 const old = Math.random; let calls = 0;
 Math.random = () => { calls++; throw Error('New art must never call random'); };
 const start = performance.now();
 try {
  const flatten = a => [...Object.entries(a.buildings).flatMap(([k, views]) => views.map((sprite, v) => [k + '_' + v, sprite])), ...Object.entries(a.modules)];
  const a = flatten(window.BritishComplexesArchitecture014.buildAll()), b = flatten(window.BritishComplexesArchitecture014.buildAll());
  return { calls, ms: performance.now() - start, count: a.length,
   same: a.length === 112 && a.every(([key, sprite], n) => key === b[n][0] && sprite.img.toDataURL() === b[n][1].img.toDataURL() && sprite.night.toDataURL() === b[n][1].night.toDataURL()),
   worldExact: before === Q.world(), storageExact: storage === JSON.stringify(Q.storage()),
   canonical: Q.canonical.every(([key, sprite]) => GV.art574.SPR().bld[key] === sprite) && Q.canonicalPaths.every(([key, sprite]) => GV.art574.SPR().complexes014[key] === sprite),
   canonicalPixelsExact: refs.every(([key, sprite], n) => key === ink[n].key && sprite.img.toDataURL() === ink[n].day && sprite.night.toDataURL() === ink[n].night) };
 } finally { Math.random = old; }
}

function nativeLight014(k=282){const Q=window.__complexQA014,r=Q.roots.find(q=>q.k===k),b=GV.tile(r.x,r.y).bld,s=GV.art574.SPR().bld[k+'_1_'+((b.v+GV.rot())&3)],c=document.getElementById('game'),g=c.getContext('2d'),night=s.night,had=Object.hasOwn(window,'__nightOccNoErase629'),flag=window.__nightOccNoErase629,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;const shot=(on,erase)=>{s.night=on?night:empty;window.__nightOccNoErase629=!erase;GV.forceDraw();return g.getImageData(0,0,c.width,c.height).data;};try{const a=shot(true,true),b=shot(false,true),u=shot(true,false),v=shot(false,false);let candidates=0,blocked=0,visible=0;for(let i=0;i<a.length;i+=4){let n=0,f=0;for(let j=0;j<3;j++){n+=Math.abs(a[i+j]-b[i+j]);f+=Math.abs(u[i+j]-v[i+j]);}if(f>9){candidates++;if(n<=3)blocked++;if(n>9)visible++;}}return{k,candidates,blocked,visible,method:'Four native same-turn draws, own physical emission on/off and existing depth erasure on/off; no supply/staff/geometry override.'};}finally{s.night=night;if(had)window.__nightOccNoErase629=flag;else delete window.__nightOccNoErase629;GV.forceDraw();}}

function nativeTransactions014() {
 const Q = window.__complexQA014, rows = [], pathRows = [];
 for (const r of Q.roots.filter(r=>r.group===Q.group)) {
  const cells = () => Array.from({ length: r.sz * r.sz }, (_, n) => GV.tile(r.x + n % r.sz, r.y + Math.floor(n / r.sz)));
  const original = JSON.stringify(cells()), money = GV.devMoney516B(), inspect = GV.inspectAt(r.x, r.y), peers=Q.roots.filter(q=>q.k!==r.k).map(q=>({q,b:GV.tile(q.x,q.y).bld}));
  const quote = GV.placePreview459('doze', r.x + r.sz - 1, r.y + r.sz - 1);
  const ok = GV.placeUndo('doze', r.x + r.sz - 1, r.y + r.sz - 1), charged = money - GV.devMoney516B();
  const gone = cells().every(t => !t.bld), peerExact=peers.every(({q,b})=>JSON.stringify(GV.tile(q.x,q.y).bld)===JSON.stringify(b)), undo = GV.undo();
  const restored = JSON.stringify(cells()) === original && GV.devMoney516B() === money;
  const redo = GV.redo(), regone = cells().every(t => !t.bld), redoPaid = money - GV.devMoney516B() === charged;
  const undoAgain = GV.undo();
  rows.push({ k: r.k, inspect, ok, quote, charged, gone, peerExact, undo, restored, redo, regone, redoPaid, undoAgain,
   final: JSON.stringify(cells()) === original && GV.devMoney516B() === money });
 }
 for (const p of Q.paths.filter(p=>p.group===Q.group)) {
  const before = GV.tile(p.x, p.y), money = GV.devMoney516B(), base = GV.complexAt014(p.x, p.y);
  const doze = GV.placeUndo('doze', p.x, p.y), removed = !GV.complexAt014(p.x, p.y), charged = money - GV.devMoney516B();
  const plainCost = GV.placePreview459('footpath502', p.x, p.y).cost;
  const undo = GV.undo(), exact = JSON.stringify(GV.tile(p.x, p.y)) === JSON.stringify(before) && GV.devMoney516B() === money;
  const redo = GV.redo(), regone = !GV.complexAt014(p.x, p.y), redoPaid = money - GV.devMoney516B() === charged;
  const undoAgain = GV.undo(), final = JSON.stringify(GV.tile(p.x, p.y)) === JSON.stringify(before) && GV.devMoney516B() === money;
  pathRows.push({ theme: p.theme, doze, removed, charged, undo, exact, redo, regone, redoPaid, undoAgain, final, base, plainCost });
 }
 const world = Q.world(), storage = JSON.stringify(Q.storage()), identities = JSON.stringify(identity014());
 for (let n = 0; n < 8; n++) GV.forceDraw();
 return { rows, pathRows, renderWorldExact: world === Q.world(), renderStorageExact: storage === JSON.stringify(Q.storage()),
  identitiesExact: identities === JSON.stringify(identity014()),
  canonical: Q.canonical.every(([k, s]) => GV.art574.SPR().bld[k] === s) && Q.canonicalPaths.every(([k, s]) => GV.art574.SPR().complexes014[k] === s) };
}

function nativePathEdits014() {
 const Q = window.__complexQA014, rows = [], storage = Q.storage(),selected=Q.paths.filter(p=>p.group===Q.group);
 const original = Q.pathPlacements.map(p => ({ p, t: GV.tile(p.x, p.y) }));
 for (let n = 0; n < selected.length; n++) {
  const p = selected[n], next = selected[(n + 1) % selected.length];
  const before = GV.complexAt014(p.x, p.y), remove = Q.pay('doze', p.x, p.y), removed = !GV.complexAt014(p.x, p.y);
  const plainQuote = GV.placePreview459('footpath502', p.x, p.y), purchase = Q.pay(next.id, p.x, p.y);
  const edited = GV.complexAt014(p.x, p.y), tile = GV.tile(p.x, p.y);
  GV.save(); const loaded = GV.load();
  if (!loaded) throw Error('Native edited-theme save/load failed');
  const afterLoad = GV.complexAt014(p.x, p.y), metadataExact = JSON.stringify(tile.amx502) === JSON.stringify(GV.tile(p.x, p.y).amx502);
  const day = GV.stats().day, following = step014(1), afterDay = GV.complexAt014(p.x, p.y);
  const removeEdited = Q.pay('doze', p.x, p.y), restore = Q.pay(p.id, p.x, p.y), restored = GV.complexAt014(p.x, p.y);
  rows.push({ from: p.theme, to: next.theme, before, remove, removed, plainQuote, purchase, edited, loaded,
   afterLoad, metadataExact, fromDay: day, toDay: following.day, afterDay, removeEdited, restore, restored });
 }
 const after = Q.storage(), allowed = k => k === 'glimmerville.v1.slot' || /^glimmerville\.v1\.s3(?:_|$)/.test(k) || k.includes('.viewRot');
 return { rows,
  originalThemesRestored: original.every(({ p, t }) => { const now = GV.tile(p.x, p.y); return now.am502 === t.am502 && JSON.stringify(now.amx502) === JSON.stringify(t.amx502); }),
  otherSlotsUnchanged: [...new Set([...Object.keys(storage), ...Object.keys(after)])].filter(k => !allowed(k)).every(k => storage[k] === after[k]) };
}

function amenityComposition014(){
 const Q=window.__complexQA014,c=document.getElementById('game'),camera=GV.camera436(),z=camera.z;
 const rows=Q.pathPlacements.filter(p=>p.group===Q.group).map(p=>{const v=GV.w2v(p.x,p.y),s=GV.art574.SPR().complexes014[p.theme+'_'+((GV.tile(p.x,p.y).amx502.turn014+GV.rot())&3)],sx=Math.round(c.width/2-camera.x*z)+(v[0]-v[1])*32*z+32*z,sy=Math.round(c.height/2-camera.y*z)+(v[0]+v[1])*16*z+32*z;return{...p,at:GV.complexAt014(p.x,p.y),key:p.theme+'_'+((GV.tile(p.x,p.y).amx502.turn014+GV.rot())&3),spriteView:s.view,box:{x:sx-s.ax*z,y:sy-s.ay*z,w:s.w*z,h:s.h*z},within:sx-s.ax*z>=0&&sy-s.ay*z>=0&&sx+(s.w-s.ax)*z<=c.width&&sy+(s.h-s.ay)*z<=c.height};});
 return{rotation:GV.rot(),rows,allFourIndependent:rows.length===4&&new Set(rows.map(r=>r.theme)).size===4,allWithin:rows.every(r=>r.within),allNative:rows.every(r=>r.at?.theme===r.theme&&r.at.am502===1&&r.at.baseWalkCost===.72&&r.spriteView===((r.at.amx502.turn014+GV.rot())&3))};
}

function amenityRenderWitness014(){
 const Q=window.__complexQA014,world=Q.world(),storage=JSON.stringify(Q.storage()),spriteRefs=Q.canonicalPaths.slice(),before=GV.complexEvidence014(),rows=[];
 const canvas=document.getElementById('game'),g=canvas.getContext('2d'),pixels=()=>g.getImageData(0,0,canvas.width,canvas.height).data;
 for(const p of Q.paths.filter(p=>p.group===Q.group)){nativeScene014(0,false,Q.group,2,[p.x,p.y]);const on=pixels(),tile=GV.tile(p.x,p.y),money=GV.devMoney516B(),quote=GV.placePreview459('doze',p.x,p.y),removed=GV.placeUndo('doze',p.x,p.y),paid=money-GV.devMoney516B();GV.forceDraw();const off=pixels();let changed=0;for(let n=0;n<on.length;n+=4)if(on[n]!==off[n]||on[n+1]!==off[n+1]||on[n+2]!==off[n+2])changed++;const undo=GV.undo(),restored=JSON.stringify(tile)===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money;rows.push({theme:p.theme,removed,paid,quote,changed,undo,restored});}
 return{rows,before,after:GV.complexEvidence014(),worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),canonicalExact:spriteRefs.every(([k,s])=>GV.art574.SPR().complexes014[k]===s)};
}

function nativeAmenityLight014(){
 const Q=window.__complexQA014,c=document.getElementById('game'),g=c.getContext('2d'),rows=[];
 for(const p of Q.paths.filter(p=>p.group===Q.group)){
  const at=GV.complexAt014(p.x,p.y),s=GV.art574.SPR().complexes014[p.theme+'_'+((at.amx502.turn014+GV.rot())&3)],night=s.night,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
  try{GV.forceDraw();const on=g.getImageData(0,0,c.width,c.height).data;s.night=empty;GV.forceDraw();const off=g.getImageData(0,0,c.width,c.height).data;let changed=0,delta=0;for(let i=0;i<on.length;i+=4){let d=0;for(let j=0;j<3;j++)d+=Math.abs(on[i+j]-off[i+j]);if(d>3){changed++;delta+=d;}}rows.push({theme:p.theme,x:p.x,y:p.y,turn:at.amx502.turn014,rotation:GV.rot(),lighting:at.lighting,changed,delta,sourceIsActualAdjacentRoad:!!at.lighting.source&&Math.abs(at.lighting.source.x-p.x)+Math.abs(at.lighting.source.y-p.y)===1&&!!GV.tile(at.lighting.source.x,at.lighting.source.y).road});}
  finally{s.night=night;GV.forceDraw();}
 }
 return{rows,day:GV.stats().day,time:GV.daylightDbg(),method:'Two same-turn native draws per actual ticket/lamp, toggle only its canonical physical mask, read unchanged adjacent-road T487 authority.'};
}

function protectedAmenityTransactions014(){
 const Q=window.__complexQA014,rows=[];
 for(const p of Q.paths.filter(p=>p.group===Q.group))for(const id of[p.id,'road','zr','zc','office','park','tree','britishTerrace',...Q.roots.map(r=>r.id)]){
  const before=Q.world(),money=GV.devMoney516B(),preview=GV.placePreview459(id,p.x,p.y),placed=GV.place(id,p.x,p.y);
  rows.push({theme:p.theme,id,preview,placed,worldExact:before===Q.world(),moneyExact:money===GV.devMoney516B(),retained:GV.complexAt014(p.x,p.y)});
 }
 const overlaps=[];for(const p of Q.paths.filter(p=>p.group===Q.group)){const x=p.x-1,y=p.y-1,before=Q.world(),money=GV.devMoney516B(),preview=GV.placePreview459('museum',x,y),placed=GV.place('museum',x,y);overlaps.push({theme:p.theme,x,y,preview,placed,worldExact:before===Q.world(),moneyExact:money===GV.devMoney516B()});}
 const underground=[];for(const p of Q.paths.filter(p=>p.group===Q.group)){const before=GV.tile(p.x,p.y),money=GV.devMoney516B(),purchase=Q.pay('wpipe',p.x,p.y,true),installed=GV.tile(p.x,p.y),undo=GV.undo();underground.push({theme:p.theme,purchase,nativePipe:!!installed.wp,themeExact:installed.am502===before.am502&&JSON.stringify(installed.amx502)===JSON.stringify(before.amx502),undo,restored:JSON.stringify(GV.tile(p.x,p.y))===JSON.stringify(before)&&GV.devMoney516B()===money});}
 const before=Q.paths.map(p=>({p,t:GV.tile(p.x,p.y)})),days=[];
 for(let n=0;n<3;n++){step014(1);days.push({day:GV.stats().day,paths:Q.paths.map(p=>({theme:p.theme,t:GV.tile(p.x,p.y),at:GV.complexAt014(p.x,p.y)}))});}
 return{rows,overlaps,underground,days,noGrowthThrough:before.every(({p,t})=>{const a=GV.tile(p.x,p.y);return !a.bld&&!a.zone&&!a.office&&a.am502===t.am502&&JSON.stringify(a.amx502)===JSON.stringify(t.amx502);})};
}
function legacyFixtures014(){
 const old=require('./theatre-gameplay013'),legacy=old.legacyFixtures013(),source=legacy.source+'\n'+old.functions013.map(f=>f.toString()).join('\n');
 new vm.Script(source);return{source,sha256:crypto.createHash('sha256').update(source).digest('hex'),parts:legacy.parts,exactHistoricalFunctionBodies:true};
}
function bindObservation014(recipe){
 const Q=window.__complexQA014={...recipe,days:[]};
 Q.storage=()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
 Q.world=()=>{const tiles=[];for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++)tiles.push(GV.tile(x,y));return JSON.stringify({tiles,stats:GV.stats()});};
 Q.canonical=Q.roots.flatMap(r=>[0,1,2,3].map(v=>[r.k+'_1_'+v,GV.art574.SPR().bld[r.k+'_1_'+v]]));
 Q.canonicalPaths=Object.entries(GV.art574.SPR().complexes014);return true;
}
function setupComplexes014(seedFn,group){
 if(localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable slot3 required');
 setupTheatre013(seedFn);const P=window.__theatreQA013;
 const recipe={N:P.N,group,retained:P.retained,homes:P.homes,oldMuseums:P.oldMuseums,stations:P.stations,priorStreet:P.priorStreet,priorMuseum:P.priorMuseum,priorRiverside:P.priorRiverside,priorTheatre:P.roots,waterCells:P.waterCells,shoreline:P.shoreline,roots:[],paths:[],pathPlacements:[],districts:[]};
 bindObservation014(recipe);const Q=window.__complexQA014;
 Object.assign(Q,{pay:P.pay,prepare:P.prepare,place:P.place,corridor:P.corridor,paid:P.paid,terrain:P.terrain});
 const existing=identity014();Q.beforeNewIdentities=existing;
 // Native roads/pipes attach the new southern precincts to the retained city.
 for(let y=59;y<=70;y++)Q.corridor(5,y);
 // Keep the inherited theatre plant at55,63; the southern link reaches56,70.
 for(const y of[63,70])for(let x=6;x<=(y===63?54:55);x++)Q.corridor(x,y);
 const specs=GV.complexSpecs014();
 for(const [n,g]of['college','manor','baths','fire'].entries()){
  const x=6+12*n,d={group:g,x,y:64,focus:[x+3,66]};Q.districts.push(d);
  for(const xx of[x+4,x+7])for(let y=64;y<=69;y++)Q.corridor(xx,y);
  Q.place('plant',x+8,64);Q.place('water',x+8,66);
  for(const [i,s]of specs.buildings.filter(r=>r.group===g).entries()){
   const r={...s,x:i===0?x:x+5,y:i===2?67:64};
   Q.place(r.id,r.x,r.y,r.sz);Q.roots.push(r);
   const b=GV.tile(r.x,r.y).bld;if(b?.k!==r.k||b.age!==0||b.sz!==r.sz)throw Error('Every independent paid root begins native age0');
  }
  for(const [i,s]of specs.paths.filter(p=>p.group===g).entries()){
   const p={...s,x:x+i,y:69};Q.place(p.id,p.x,p.y);Q.paths.push(p);Q.pathPlacements.push(p);
   const a=GV.complexAt014(p.x,p.y);if(a?.theme!==p.theme||a.am502!==1||a.baseWalkCost!==.72||a.amx502.british014!==p.theme)throw Error('Independent T502 theme metadata required');
  }
  for(let dx=0;dx<4;dx++)Q.place('footpath502',x+dx,68);
 }
 Q.canonical=Q.roots.flatMap(r=>[0,1,2,3].map(v=>[r.k+'_1_'+v,GV.art574.SPR().bld[r.k+'_1_'+v]]));
 const after=identity014();
 const oldIdentitiesExact=existing.buildings.every(old=>JSON.stringify(after.buildings.find(b=>b.i===old.i))===JSON.stringify(old))&&existing.paths.every(old=>JSON.stringify(after.paths.find(p=>p.i===old.i))===JSON.stringify(old));
 return{roots:Q.roots,paths:Q.paths,paid:Q.paid,terrain:Q.terrain,oldIdentitiesExact,initial:snapshot014(),placementDay:GV.stats().day,recipe:{...recipe,roots:Q.roots,paths:Q.paths,pathPlacements:Q.pathPlacements,districts:Q.districts}};
}
function snapshot014(){
 const Q=window.__complexQA014;
 return{...GV.complexEvidence014(),roots:Q.roots.map(r=>GV.complexAt014(r.x,r.y)),paths:Q.paths.map(p=>GV.complexAt014(p.x,p.y)),stats:GV.stats(),slot:localStorage.getItem('glimmerville.v1.slot'),retained:Q.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,cells:Array.from({length:r.sz*r.sz},(_,n)=>GV.tile(r.x+n%r.sz,r.y+Math.floor(n/r.sz)).bld)})),priorStreet:GV.streetLifeEvidence009(),priorMuseum:GV.museumEvidence010(),priorRiverside:GV.riversideEvidence012(),priorTheatre:GV.theatreEvidence013(),stations:Q.stations.map(p=>GV.stationDistrictAt008(...p)),oldMuseums:Q.oldMuseums.map(r=>({...r,bld:GV.tile(r.x,r.y).bld})),difficulty:GV.diff(),developer:GV.dev516B(),coldFixDisabled:!!window.__noColdLoadPower011,districtCache:window.__t450Power?JSON.parse(JSON.stringify(window.__t450Power)):null,shoreline:Q.shoreline.map(p=>({...p,land:GV.tile(p.x,p.y).t,water:GV.tile(p.x,p.y+1).t})),identity:identity014()};
}
function step014(n=1){
 const Q=window.__complexQA014;
 for(let i=0;i<n;i++){const from=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);if(GV.stats().day!==from+1)throw Error('One actual ordinary day required');const now=snapshot014();Q.days.push({from,day:now.day,roots:now.roots,population:now.stats.pop,daily:now.daily,fiscal:now.fiscal});}
 return snapshot014();
}
function nativeScene014(rot,night,group,zoom=1.45,focus=null){
 const Q=window.__complexQA014,d=Q.districts.find(d=>d.group===group);focus=focus||d.focus;
 GV.setRot(rot);GV.setZoom(zoom);GV.lookAt(...focus);GV.setVisT(GV.art574.cycle574()*(night?.9:.5));GV.weather(0);window.__ovCapMax606=18000;window.__ovCap606=[];GV.forceDraw();const caps=window.__ovCap606;window.__ovCap606=null;
 const canvas=document.getElementById('game'),camera=GV.camera436(),geometry=Q.roots.filter(r=>r.group===group).map(r=>{
  const b=GV.tile(r.x,r.y).bld;if(!b)return{k:r.k,missing:true};const key=r.k+'_1_'+((b.v+rot)&3),s=GV.art574.SPR().bld[key],hit=caps.find(q=>q.o?.x===r.x&&q.o?.y===r.y&&q.bd?.k===r.k);let corner=null,depth=-Infinity;
  for(let dy=0;dy<r.sz;dy++)for(let dx=0;dx<r.sz;dx++){const p=GV.w2v(r.x+dx,r.y+dy);if(p[0]+p[1]>=depth){depth=p[0]+p[1];corner=p;}}
  const ex=Math.round(canvas.width/2-camera.x*zoom)+(corner[0]-corner[1])*32*zoom-s.ax*zoom,ey=Math.round(canvas.height/2-camera.y*zoom)+(corner[0]+corner[1])*16*zoom+(32-s.ay)*zoom;
  return{k:r.k,key,age:b.age,canonical:!!hit&&hit.s===s,anchorError:hit?[hit.bx-ex,hit.by-ey]:null,within:!!hit&&hit.bx>=0&&hit.by>=0&&hit.bx+s.w*zoom<=canvas.width&&hit.by+s.h*zoom<=canvas.height,box:{x:ex,y:ey,w:s.w*zoom,h:s.h*zoom}};
 });
 return{png:canvas.toDataURL('image/png'),group,rot:GV.rot(),night,time:GV.daylightDbg(),day:GV.stats().day,roots:Q.roots.filter(r=>r.group===group).map(r=>GV.complexAt014(r.x,r.y)),geometry};
}
function scalingWitness014(){
 const specs=GV.complexSpecs014(),e=GV.complexEvidence014(),tourists=GV.museumEvidence010().tourists;
 const rows=window.__complexQA014.roots.map(p=>{
  const r=GV.complexAt014(p.x,p.y),s=specs.buildings.find(s=>s.k===r.k),housing=s.role==='housing',water=Math.max(0,Math.min(1,r.waterDelivered/r.waterDemand)),fill=r.staff?.staffFill||0;
  const factor=!housing&&r.operational&&r.employed>0?Math.max(0,Math.min(1.14,r.staff.capacityFactor,r.factors.serviceFactor*Math.max(0,Math.min(1,fill)))):0;
  const expectedLeisure=s.leisure*factor*(1+Math.min(.35,tourists/2200)),expectedEducation=s.seats*factor,expectedServices=s.services*factor;
  const near=(a,b)=>Math.abs(a-b)<1e-6;
  const exact=near(r.capacityFactor,factor)&&near(r.activity.leisure,expectedLeisure)&&near(r.activity.education,expectedEducation)&&near(r.activity.services,expectedServices)&&r.activity.enterpriseJobs===0&&r.activity.shopping===0&&r.activity.parking===0&&(!housing||r.positions===0&&r.employed===0&&r.housing.capacity===s.capacity&&r.housing.population===(r.housing.eligible?Math.round(s.capacity*r.housing.occupancy):0));
  const positive=exact&&r.operational&&(housing?r.housing.eligible&&r.housing.population>0:r.employed>0&&r.activity.publicJobs>0&&factor>0&&(!s.coverage||!!r.coverageStamp))&&(s.role!=='fire'||r.emergencyReady&&r.emergency.sourceRegistered&&r.emergency.fieldOnline);
  return{k:r.k,spec:s,root:r,water,fill,factor,expectedLeisure,expectedEducation,expectedServices,exact,positive,zero:exact&&(housing?r.housing.population===0:r.employed===0&&factor===0&&r.activity.leisure===0&&r.activity.education===0&&r.activity.services===0&&!r.coverageStamp)};
 });
 return{day:e.day,pop:GV.stats().pop,rows,exact:rows.every(r=>r.exact),positive:rows.every(r=>r.positive),zero:rows.every(r=>r.zero),daily:e.daily,expectedPublicJobs:rows.filter(r=>r.root.built).reduce((n,r)=>n+r.spec.jobs,0),expectedUpkeep:rows.reduce((n,r)=>n+r.root.upkeep,0),tourists};
}
function physicalLoss014(kind){
 const Q=window.__complexQA014,before=snapshot014(),beforeCapacity=scalingWitness014(),removed=[];
 if(kind==='road')for(const i of new Set(before.roots.flatMap(r=>r.road))){const x=i%Q.N,y=Math.floor(i/Q.N),t=GV.tile(x,y);if(t.road){removed.push({id:'road',x,y});Q.pay('doze',x,y);}}
 else {const k=kind==='power'?5:10,id=kind==='power'?'plant':'water';for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&b.k===k){removed.push({id,x,y,k});Q.pay('doze',x,y);}}}
 if(!removed.length||removed.length>120)throw Error('Bounded physical infrastructure loss required');
 const lost=step014(1),lostCapacity=scalingWitness014();nativeScene014(0,true,Q.group);
 const lostLight=kind==='power'?Q.roots.filter(r=>r.group===Q.group).map(r=>nativeLight014(r.k)):null,lostPathLight=kind==='power'?nativeAmenityLight014():null,start=Q.paid.length;
 for(const r of removed)Q.pay(r.id,r.x,r.y);
 const recoveryDays=[];for(let n=0;n<18;n++){const snap=step014(1),capacity=scalingWitness014();recoveryDays.push({day:snap.day,capacity});if(capacity.positive)break;}
 const repair=Q.paid.slice(start),recoveredIsolatedLight=kind==='power'?isolatedPathLighting014(true):null;nativeScene014(0,true,Q.group);return{recoveredIsolatedLight,kind,before,beforeCapacity,removed,lost,lostCapacity,lostLight,lostPathLight,repair,recoveryDays,recovered:snapshot014(),recoveredCapacity:scalingWitness014(),recoveredLight:kind==='power'?Q.roots.filter(r=>r.group===Q.group).map(r=>nativeLight014(r.k)):null,recoveredPathLight:kind==='power'?nativeAmenityLight014():null};
}
function nativeSaveLoad014(){
 const Q=window.__complexQA014,before=snapshot014(),storage=Q.storage(),identity=identity014();GV.save();const raw=localStorage.getItem('glimmerville.v1.s3');
 window.__noComplex014=true;let loaded,immediate,disabled;
 try{loaded=GV.load();if(!loaded)throw Error('Native load failed');immediate=snapshot014();disabled=[...Q.roots,...Q.paths].every(r=>GV.placePreview459(r.id,1,1)?.ok===false);}finally{delete window.__noComplex014;}
 const references=JSON.stringify(identity)===JSON.stringify(identity014()),from=GV.stats().day,following=step014(1),capacity=scalingWitness014(),after=Q.storage(),allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');
 return{before,loaded,immediate,disabled,references,from,following,capacity,bytes:raw?.length||0,otherSlotsUnchanged:[...new Set([...Object.keys(storage),...Object.keys(after)])].filter(k=>!allowed(k)).every(k=>storage[k]===after[k])};
}
function coverage014(){
 const Q=window.__complexQA014,rows=[];
 for(const r of Q.roots.filter(r=>r.group===Q.group&&r.coverage)){
  const field=()=>Array.from({length:Q.N*Q.N},(_,i)=>GV.cov(r.coverage,i%Q.N,Math.floor(i/Q.N))),before=field(),money=GV.devMoney516B(),a=GV.complexAt014(r.x,r.y),radius=a.coverageStamp?.radius;
  const removed=GV.placeUndo('doze',r.x+r.sz-1,r.y+r.sz-1),off=field();if(!GV.undo())throw Error('Coverage undo failed');const restored=field();
  const changed=before.map((v,i)=>v-off[i]),expected=changed.map((v,i)=>Math.abs(i%Q.N-r.x)<=radius&&Math.abs(Math.floor(i/Q.N)-r.y)<=radius?1:0);
  rows.push({k:r.k,field:r.coverage,radius,removed,exactOwnedField:JSON.stringify(changed)===JSON.stringify(expected),changedCells:changed.filter(v=>v!==0).length,undoExact:JSON.stringify(restored)===JSON.stringify(before)&&money===GV.devMoney516B(),before,off,restored});
 }
 return{rows};
}
function constraints014(){
 const Q=window.__complexQA014;GV.save();const baseline=scalingWitness014(),waterSources=[];
 for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&b.k===10)waterSources.push({x,y});}
 const waterRows=[],waterPayments=[];let partialWater=null;
 for(const p of waterSources){waterPayments.push(Q.pay('doze',p.x,p.y));step014(1);const q=scalingWitness014();waterRows.push(q);if(q.rows.some(r=>r.spec.group===Q.group&&r.spec.role!=='housing'&&r.root.operational&&r.water>.02&&r.water<.98&&r.root.employed>0)){partialWater=q;break;}}
 if(!GV.load())throw Error('Restore before workforce failed');step014(1);
 const housing=[];for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&([1,33,105,127,219,284,293].includes(b.k)||(b.k>=246&&b.k<=261)))housing.push({x,y,k:b.k});}
 const staffRows=[],staffPayments=[];let partialStaff=null;
 // Demolishing new residences is real loss evidence. Remove them last so all
 // public service witnesses can still read their own roots during early trials.
 housing.sort((a,b)=>Number([284,293].includes(a.k))-Number([284,293].includes(b.k)));
 const savedRoots=Q.roots;Q.roots=Q.roots.filter(r=>r.role!=='housing');
 for(let n=0;n<housing.length;n++){const p=housing[n];staffPayments.push(Q.pay('doze',p.x,p.y));if((n+1)%3===0||n===housing.length-1){step014(1);const q=scalingWitness014();staffRows.push(q);if(q.rows.some(r=>r.spec.group===Q.group&&r.root.operational&&r.fill>0&&r.fill<.98)&&!partialStaff)partialStaff=q;}}
 const zero=scalingWitness014();if(!GV.load())throw Error('Restore genuine fixture failed');Q.roots=savedRoots;step014(1);
 return{baseline,waterSources,waterPayments,waterRows,partialWater,housing,staffPayments,staffRows,partialStaff,zero,restored:scalingWitness014(),method:'Paid source/home demolition, ordinary daily water/staff dispatch, native save/load; no labor/service/supply/age/finance assignments.'};
}
function nativeOcclusion014(){
 const Q=window.__complexQA014,roots=Q.roots.filter(r=>r.group===Q.group),trials=[];
 // Independently placed supports are real mature foregrounds, never a drawn overlay.
 for(const rotation of[0,1,2,3])for(const target of roots)for(const foreground of roots.filter(r=>r.k!==target.k)){
  const withScene=nativeScene014(rotation,true,Q.group),withLight=nativeLight014(target.k),before=GV.complexAt014(target.x,target.y),money=GV.devMoney516B(),quote=GV.placePreview459('doze',foreground.x,foreground.y),removed=GV.placeUndo('doze',foreground.x,foreground.y);
  if(!removed)throw Error('Real support doze required');const control=nativeScene014(rotation,true,Q.group),withoutLight=nativeLight014(target.k);if(!GV.undo())throw Error('Restore support after occlusion required');
  const after=GV.complexAt014(target.x,target.y),restored=GV.complexAt014(foreground.x,foreground.y),row={rotation,target:target.k,foreground:foreground.k,quote,removed,restored:restored?.k===foreground.k&&GV.devMoney516B()===money,sameTurn:withScene.day===control.day&&JSON.stringify(withScene.time)===JSON.stringify(control.time),sameIdentity:before.root===after.root&&before.age===after.age&&before.k===after.k,withLight,withoutLight};
  row.partial=row.restored&&row.sameTurn&&row.sameIdentity&&restored.age>=9&&withLight.candidates>0&&withLight.visible>0&&withLight.blocked>withoutLight.blocked;trials.push(row);
  if(row.partial)return{trials,selected:row,capture:withScene,control};
 }
 return{trials,selected:null};
}
function rejectedPlacements014(){
 const Q=window.__complexQA014,rows=[],x=1,y=64;Q.prepare(x,y,4);
 const test=(label,r,xx=x,yy=y)=>{const before=Q.world(),money=GV.devMoney516B(),preview=GV.placePreview459(r.id,xx,yy),placed=GV.place(r.id,xx,yy);rows.push({label,id:r.id,preview,placed,unchanged:before===Q.world()&&money===GV.devMoney516B()});};
 for(const r of Q.roots){test('whole-footprint collision',r,r.x,r.y);test('map-edge rejection',r,Q.N,0);}
 for(const[tool,label]of[['tree','tree'],['road','road'],['tdig','water'],[Q.paths[0].id,'path']]){const before=Q.world();Q.pay(tool,x,y,true);for(const r of Q.roots)test(label,r);if(!GV.undo()||before!==Q.world())throw Error('Obstacle undo exact required');}
 for(const[tool,label]of[['tree','path-tree'],['zr','path-residential-zone'],['zc','path-commercial-zone'],['office','path-office-zone'],['lvline','path-overhead-line']]){const before=Q.world();Q.pay(tool,x,y,true);for(const p of Q.paths)test(label,p);if(!GV.undo()||before!==Q.world())throw Error('Path obstacle undo exact required');}
 Q.pay('traise',x,y,true);for(const r of Q.roots)test('uneven footprint',r);if(!GV.undo())throw Error('Terrain undo required');
 for(const p of Q.paths)test('land-only path',p,60,57);
 const enabled=[...Q.roots,...Q.paths].map(r=>GV.placePreview459(r.id,x,y));
 if(!enabled.every(p=>p?.ok))throw Error('Valid positive plot required before escape test');
 window.__noComplex014=true;try{for(const r of Q.roots)test('bounded new-building escape',r);for(const p of Q.paths)test('bounded new-path escape',p);}finally{delete window.__noComplex014;}
 return rows;
}
function cardinalPathProbes014(){
 const Q=window.__complexQA014,x=68,y=67,rows=[];Q.prepare(x,y);
 for(const[dx,dy,turn,side]of[[0,1,0,'south'],[1,0,3,'east'],[0,-1,2,'north'],[-1,0,1,'west']]){
  const rx=x+dx,ry=y+dy;Q.prepare(rx,ry);const road=Q.pay('road',rx,ry),spec=GV.complexSpecs014().paths.find(p=>p.group===Q.group),purchase=Q.pay(spec.id,x,y),placed=GV.complexAt014(x,y);
  GV.save();const loaded=GV.load(),afterLoad=GV.complexAt014(x,y),fromDay=GV.stats().day;step014(1);const afterDay=GV.complexAt014(x,y),remove=Q.pay('doze',x,y),removed=!GV.complexAt014(x,y),removeRoad=Q.pay('doze',rx,ry);
  rows.push({side,turn,road,purchase,placed,loaded,afterLoad,afterDay,fromDay,toDay:GV.stats().day,remove,removed,removeRoad,roadRemoved:!GV.tile(rx,ry).road,metadataExact:JSON.stringify(placed.amx502)===JSON.stringify(afterLoad.amx502)&&JSON.stringify(placed.amx502)===JSON.stringify(afterDay.amx502)});
 }
 return{rows};
}
function isolatedPathLighting014(powered){
 const Q=window.__complexQA014,originalPaths=Q.paths,rows=[],roads=[],pipes=[],payments=[],x=68,y=67;
 Q.prepare(x,y);
 for(let yy=64;yy<=68;yy++){const t=GV.tile(69,yy);if(!t.road){Q.prepare(69,yy);payments.push(Q.pay('road',69,yy));roads.push({x:69,y:yy});}if(!GV.tile(69,yy).wp){payments.push(Q.pay('wpipe',69,yy));pipes.push({x:69,y:yy});}}
 try{
  for(const spec of originalPaths.filter(p=>p.group===Q.group)){
   const purchase=Q.pay(spec.id,x,y),p={...spec,x,y};step014(1);
   for(const rotation of[0,1,2,3]){
    nativeScene014(rotation,true,Q.group,2,[x,y]);Q.paths=[p];const light=nativeAmenityLight014().rows[0];Q.paths=originalPaths;
    rows.push({theme:p.theme,rotation,purchase,light,powered});
   }
   payments.push(Q.pay('doze',x,y));
  }
 }finally{Q.paths=originalPaths;for(const r of roads)payments.push(Q.pay('doze',r.x,r.y));}
 step014(1);
 return{rows,payments,originalThemesRetained:originalPaths.every(p=>GV.complexAt014(p.x,p.y)?.theme===p.theme),method:'Each canonical theme is bought separately on a real isolated native road-powered plot. Four full native views test physical emission on/off; terrain and carrier edits are paid.'};
}
function fireDrill014(){
 const Q=window.__complexQA014,rows=[],identity=identity014();GV.save();
 for(const k of[291,292]){
  if(!GV.load())throw Error('Native drill baseline load failed');
  const source=Q.roots.find(r=>r.k===k),target={x:46,y:62};Q.prepare(target.x,target.y);
  // Existing T534 legacy incident-target fixture only. It does not create any
  // new014 building, paid workforce, capacity, utility, or revenue evidence.
  const fixture=GV.testInjectResident534(target.x,target.y);if(!fixture)throw Error('Existing native incident-target fixture failed');
  GV.step(1);GV.setSpeed(0);GV.ai(false);
  const removed=[];
  for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&[6,30,61,265,291,292].includes(b.k)&&b.k!==k)removed.push({k:b.k,payment:Q.pay('doze',x,y)});}
  const before=GV.complexAt014(source.x,source.y),route=GV.emergencyRoute455('fire',target.x,target.y),ignited=GV.ignite(target.x,target.y);GV.testAdvance588(0);
  const dispatched=GV.complexEvidence014().fireDispatch,caseIdx=target.y*Q.N+target.x;
  const money=GV.devMoney516B(),quote=GV.placePreview459('doze',source.x,source.y),doze=GV.placeUndo('doze',source.x,source.y),charged=money-GV.devMoney516B();GV.testAdvance588(0);
  const cancelled=GV.complexEvidence014().fireDispatch,lostRoute=GV.emergencyRoute455('fire',target.x,target.y),stillFire=!!GV.tile(target.x,target.y).bld?.fire,undo=GV.undo();
  if(!undo)throw Error('Fire source undo must restore real paid source');const moneyRestored=GV.devMoney516B()===money;
  let restored=GV.complexAt014(source.x,source.y);
  for(let n=0;n<3&&!restored.emergencyReady;n++){GV.step(1);GV.setSpeed(0);GV.ai(false);restored=GV.complexAt014(source.x,source.y);}
  const restoredRoute=GV.emergencyRoute455('fire',target.x,target.y);GV.testAdvance588(0);const redispatched=GV.complexEvidence014().fireDispatch,samplesBefore=GV.svcResponseSample().fire.length;
  GV.setSpeed(1);let frames=0;
  for(;frames<400&&GV.tile(target.x,target.y).bld?.fire;frames++)GV.testAdvance588(.05);
  GV.setSpeed(0);GV.ai(false);
  const arrived=!GV.tile(target.x,target.y).bld?.fire&&GV.complexEvidence014().fireDispatch.every(c=>c.caseIdx!==caseIdx)&&GV.svcResponseSample().fire.length>samplesBefore;
  rows.push({k,source,target,caseIdx,before,removed,route,routeRoads:route.path?.every(([x,y])=>!!GV.tile(x,y).road),ignited,dispatched,quote,doze,charged,cancelled,lostRoute,stillFire,undo,moneyRestored,restored,restoredRoute,redispatched,arrived,frames,fixture:'Existing T534 test-only legacy k1 incident target; no new014 or workforce assignments.'});
 }
 if(!GV.load())throw Error('Restore full genuine city after fire drill');
 const restoredIdentity=JSON.stringify(identity)===JSON.stringify(identity014());step014(1);
 return{rows,restoredIdentity,recovered:scalingWitness014(),method:'Native physical routes, actual dispatcher and vehicles, exact source demolition cancellation and paid undo recovery. Existing T534 target fixture explicitly isolated; never used during cold proof.'};
}
const functions014=[bindObservation014,setupComplexes014,identity014,snapshot014,step014,assetAudit014,artPurity014,nativeScene014,nativeLight014,scalingWitness014,physicalLoss014,nativeSaveLoad014,nativeTransactions014,nativePathEdits014,rejectedPlacements014,nativeOcclusion014,coverage014,constraints014,amenityComposition014,amenityRenderWitness014,nativeAmenityLight014,protectedAmenityTransactions014,cardinalPathProbes014,isolatedPathLighting014,fireDrill014];
function validConstruction014(days,placementDay){
 return days.length===10&&days.every((d,n)=>d.day===placementDay+n&&d.roots.length===12&&new Set(d.roots.map(r=>r.k)).size===12&&d.roots.every(r=>r.k>=282&&r.k<=293&&r.age===n&&(n===9?r.built:!r.built&&!r.operational&&r.positions===0&&r.employed===0&&r.activity.work===0&&r.activity.education===0&&r.activity.leisure===0&&r.activity.services===0&&!r.coverageStamp&&r.upkeep===0&&(!r.housing||r.housing.population===0))));
}
function validReady014(q){
 return q?.roots?.length===12&&new Set(q.roots.map(r=>r.k)).size===12&&q.roots.every(r=>r.k>=282&&r.k<=293&&r.age>=9&&r.built&&r.operational&&r.powerState===1&&r.waterState.code>=2&&r.waterDelivered>0&&r.road.length>0&&(r.role==='housing'?r.housing.eligible&&r.housing.population>0&&r.positions===0&&r.employed===0:r.employed>0&&r.positions>0&&r.activity.publicJobs>0)&&(r.role!=='fire'||r.emergencyReady&&r.emergency.sourceRegistered&&r.emergency.fieldOnline));
}
function validFiscal014(f,day,jobs,upkeep){
 const near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-6;
 return !!(f&&f.day===day&&f.difficulty===1&&f.complexPublicJobs===jobs&&near(f.complexUpkeep,upkeep)&&f.upkeep>=upkeep&&near(f.afterMoney-f.beforeMoney,f.income-f.upkeep)&&near(f.postedNet,f.income-f.upkeep)&&near(f.rawFin?.net,f.postedNet));
}
function staticObservationTest014(){
 const themes=['collegeGate','collegeCloister','collegeLibraryWalk','collegeGarden','manorGate','manorTerrace','manorParterre','manorPond','bathsPromenade','bathsFountain','bathsTowelGarden','bathsLaundryWalk','fireApron','fireHoseWalk','fireMemorialGarden','fireBrigadeWalk'];
 const paths=themes.map((theme,n)=>({theme,x:n,y:69})),roots=Array.from({length:12},(_,n)=>({k:282+n,x:n,y:64})),qa={N:72,roots,paths,retained:[],stations:[],oldMuseums:[],shoreline:[]},source=snapshot014.toString();
 const run=text=>{const reads=[],payload={paths:[{theme:'stale'}],roots:[],day:1},ctx={window:{__complexQA014:qa},localStorage:{getItem:()=>'3'},identity014:()=>({buildings:[],paths:[],terrain:[]}),GV:{complexEvidence014:()=>structuredClone(payload),complexAt014:(x,y)=>{reads.push([x,y]);return y===69?{theme:themes[x],am502:1,baseWalkCost:.72}:{k:282+x,age:0};},stats:()=>({day:1}),streetLifeEvidence009:()=>({roots:[]}),museumEvidence010:()=>({roots:[]}),riversideEvidence012:()=>({roots:[]}),theatreEvidence013:()=>({roots:[]}),diff:()=>1,dev516B:()=>({sandbox:false,god:false})}};const before=JSON.stringify({qa,payload}),result=new vm.Script('('+text+')()').runInNewContext(ctx);return{result,reads,unchanged:before===JSON.stringify({qa,payload})};};
 const result=run(source),direct='paths:Q.paths.map(p=>GV.complexAt014(p.x,p.y)),';
 if(result.result.paths.length!==16||result.result.roots.length!==12||result.reads.length!==28||!result.unchanged)throw Error('Every directly paid cell must be observed without repair');
 if(source.split(direct).length!==2||run(source.replace(direct,'')).result.paths.length===16)throw Error('Stale-index-only negative control not rejected');
 const days=Array.from({length:10},(_,n)=>({day:n+1,roots:roots.map(r=>({...r,age:n,built:n===9,operational:false,positions:0,employed:0,activity:{work:0,education:0,leisure:0,services:0},coverageStamp:null,upkeep:0,housing:[284,293].includes(r.k)?{population:0}:null}))}));
 if(!validConstruction014(days,1))throw Error('Synthetic complete12-root construction rejected');
 const rejected=[];for(const[name,mutate]of[['missing root',q=>q[4].roots.pop()],['duplicate ID',q=>q[3].roots[11].k=282],['skipped day',q=>q[3].day++],['fake mature age',q=>q[1].roots[0].age=9],['early housing',q=>q[2].roots[2].housing.population=1],['early education',q=>q[2].roots[0].activity.education=1],['early public jobs',q=>q[2].roots[0].positions=1],['early upkeep',q=>q[2].roots[0].upkeep=1],['early coverage',q=>q[2].roots[0].coverageStamp={radius:1}],['missing completion',q=>q[9].roots[0].built=false]]){const q=structuredClone(days);mutate(q);if(validConstruction014(q,1))throw Error('Construction negative accepted '+name);rejected.push(name);}
 const fiscal={day:10,difficulty:1,complexPublicJobs:145,complexUpkeep:88,beforeMoney:1000,afterMoney:1010,income:110,upkeep:100,postedNet:10,rawFin:{net:10}};if(!validFiscal014(fiscal,10,145,88))throw Error('Synthetic native fiscal positive rejected');const fiscalNegatives=[];for(const[name,mutate]of[['double jobs',q=>q.complexPublicJobs*=2],['missing own upkeep',q=>q.complexUpkeep=0],['unposted treasury',q=>q.afterMoney=q.beforeMoney],['wrong ledger',q=>q.rawFin.net++],['invented revenue',q=>q.income++],['wrong day',q=>q.day--],['sandbox accounting',q=>q.difficulty=3]]){const q=structuredClone(fiscal);mutate(q);if(validFiscal014(q,10,145,88))throw Error('Fiscal negative accepted '+name);fiscalNegatives.push(name);}
 const observation=[snapshot014,step014,scalingWitness014].map(f=>f.toString()).join('\n');if(/\b(?:ensure|rebuild|refresh|prepare|dispatch|testAge|innovationSetQA|setDay)[A-Za-z0-9_]*\s*\(/.test(observation))throw Error('Measured observers or ordinary days must never repair native state');
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticQADataOnly:true,directCellReads:28,staleIndexRejected:true,constructionNegativeControls:rejected,fiscalNegativeControls:fiscalNegatives,measuredObserversContainNoRepair:true};
}
module.exports={legacyFixtures014,functions014,validConstruction014,validReady014,validFiscal014,staticObservationTest014};
if(require.main===module){if(process.argv.length!==3||process.argv[2]!=='--static-test')throw Error('Use Actions runner; source-only --static-test supported');for(const f of functions014)new vm.Script('('+f.toString()+')');console.log(JSON.stringify(staticObservationTest014(),null,2));}

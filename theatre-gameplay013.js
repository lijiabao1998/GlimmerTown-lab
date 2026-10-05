#!/usr/bin/env node
'use strict';
// All functions below are serialized to the isolated CI browser. Importing this
// module only defines functions and reads immutable source; it never runs a game.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const fixed=require('./theatre-static-contract013');
function legacyFixtures013(){
 const get=(file,start,end)=>{const original=fs.readFileSync(path.join(__dirname,file),'utf8');if(original!==fixed.baseFile(file).toString())throw Error('Immutable fixture changed: '+file);const a=original.indexOf(start),b=original.indexOf(end,a);if(a<0||b<=a||original.split(start).length!==2)throw Error('Unique fixture boundaries required: '+file);return original.slice(a,b);};
 const parts=[get('streetlife-integration-qa009.js','function setupStreet009(','function snapshot009('),get('museum-integration-qa010.js','function setupMuseum010(','function assets010('),get('riverside-integration-qa012.js','function bindObservation012(','(async () => {')];
 const source=parts.join('\n');new vm.Script(source);return{source,sha256:fixed.hash(source),parts:parts.map(s=>({sha256:fixed.hash(s),bytes:Buffer.byteLength(s)})),exactHistoricalFunctionBodies:true};
}
function bindObservation013(recipe){
 const Q=window.__theatreQA013={...recipe,days:[]};
 Q.storage=()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
 Q.world=()=>{const tiles=[];for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++)tiles.push(GV.tile(x,y));return JSON.stringify({tiles,stats:GV.stats()});};
 Q.canonical=Q.roots.flatMap(r=>[0,1,2,3].map(v=>[r.k+'_1_'+v,GV.art574.SPR().bld[r.k+'_1_'+v]]));
 Q.canonicalPaths=Object.entries(GV.art574.SPR().theatre013);
 return true;
}
function setupTheatre013(seedFn){
 if(localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable slot3 required');
 // This is the exact old paid city: all47 British roots, stations, hotel/cafe,
 // museum and riverside retail. Its pre-existing fixture seed is not new evidence.
 const legacy=setupRiverside012(seedFn),P=window.__riversideQA012;
 const recipe={N:P.N,retained:P.retained,homes:P.homes,oldMuseums:P.oldMuseums,stations:P.stations,priorStreet:P.priorStreet,priorMuseum:P.priorMuseum,priorRiverside:P.roots,waterCells:P.waterCells,shoreline:P.shoreline,roots:[],paths:[],pathPlacements:[]};
 bindObservation013(recipe);const Q=window.__theatreQA013;
 Object.assign(Q,{pay:P.pay,prepare:P.prepare,place:P.place,corridor:P.corridor,paid:P.paid,terrain:P.terrain});
 // The theatre stands beyond the canal, reached by a genuine public road and
 // pipe. The native T502 forecourt does not substitute for vehicle frontage.
 for(let y=56;y<=70;y++)Q.corridor(56,y);
 for(let x=57;x<=64;x++)Q.corridor(x,70);
 for(let x=57;x<=69;x++)Q.corridor(x,63);
 for(const [id,x,y]of[['plant',55,63],['water',55,65],['plant',65,62],['water',67,62]])Q.place(id,x,y);
 const specs=GV.theatreSpecs013(),root={...specs.buildings[0],x:58,y:64};
 if(root.k!==281||root.sz!==3||root.id!=='edwardianTheatre013')throw Error('Permanent native theatre identity required');
 Q.place(root.id,root.x,root.y,root.sz);Q.roots.push(root);
 if(GV.tile(root.x,root.y).bld?.age!==0)throw Error('New paid theatre must start at native age0');
 for(const [theme,x,y]of[['ticket',57,69],['plaza',59,68],['rail',62,69],['bench',58,69],['planter',60,69],['lamp',61,69]]){
  const spec=specs.paths.find(p=>p.theme===theme);if(!spec)throw Error('Missing independent native amenity '+theme);const p={...spec,x,y};Q.place(p.id,x,y);Q.paths.push(p);Q.pathPlacements.push(p);
  const at=GV.theatreAt013(x,y);if(at?.theme!==theme||at.am502!==1||at.baseWalkCost!==.72||at.amx502.british013!==theme||at.amx502.turn013!==0)throw Error('Native paid amenity and persistent theme required');
 }
 for(const [x,y]of[[57,68],[57,67],[58,67],[59,67],[60,67],[58,68],[60,68],[61,68],[62,68]])Q.place('footpath502',x,y);
 Q.canonical=Q.roots.flatMap(r=>[0,1,2,3].map(v=>[r.k+'_1_'+v,GV.art574.SPR().bld[r.k+'_1_'+v]]));
 // No age, workers, power, water, capacity, treasury, or ticket values assigned.
 return{N:Q.N,roots:Q.roots,paths:Q.paths,pathPlacements:Q.pathPlacements,paid:Q.paid,terrain:Q.terrain,homes:Q.homes,retained:Q.retained,priorStreet:Q.priorStreet,priorMuseum:Q.priorMuseum,priorRiverside:Q.priorRiverside,stations:Q.stations,oldMuseums:Q.oldMuseums,initial:snapshot013(),difficulty:GV.diff(),developer:GV.dev516B(),placementDay:GV.stats().day,recipe:{...recipe,roots:Q.roots,paths:Q.paths,pathPlacements:Q.pathPlacements}};
}
function snapshot013(){
 const Q=window.__theatreQA013;
 return{...GV.theatreEvidence013(),roots:Q.roots.map(r=>GV.theatreAt013(r.x,r.y)),stats:GV.stats(),slot:localStorage.getItem('glimmerville.v1.slot'),retained:Q.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,cells:Array.from({length:r.sz*r.sz},(_,n)=>GV.tile(r.x+n%r.sz,r.y+Math.floor(n/r.sz)).bld)})),priorStreet:GV.streetLifeEvidence009(),priorMuseum:GV.museumEvidence010(),priorRiverside:GV.riversideEvidence012(),stations:Q.stations.map(p=>GV.stationDistrictAt008(...p)),oldMuseums:Q.oldMuseums.map(r=>({...r,bld:GV.tile(r.x,r.y).bld})),difficulty:GV.diff(),developer:GV.dev516B(),coldFixDisabled:!!window.__noColdLoadPower011,districtCache:window.__t450Power?JSON.parse(JSON.stringify(window.__t450Power)):null,shoreline:Q.shoreline.map(p=>({...p,land:GV.tile(p.x,p.y).t,water:GV.tile(p.x,p.y+1).t})),identity:identity013()};
}
function step013(n=1){
 const Q=window.__theatreQA013;
 for(let i=0;i<n;i++){const from=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);if(GV.stats().day!==from+1)throw Error('One real ordinary day required');const now=snapshot013();Q.days.push({from,day:now.day,roots:now.roots,population:now.stats.pop});}
 return snapshot013();
}
function scalingWitness013(){
 const e=GV.theatreEvidence013(),r=e.roots.find(q=>q.k===281),stats=GV.stats(),water=Math.max(0,Math.min(1,r.waterDelivered/r.waterDemand)),service=+(r.factors.availability*water).toFixed(4),fill=r.staff?.staffFill||0,expected=r.operational&&r.employed>0?Math.max(0,Math.min(1,r.staff.capacityFactor,service*fill)):0;
 const tourists=GV.museumEvidence010().tourists,expectedLeisure=200*expected*(1+Math.min(.35,tourists/2200));
 const exact=Math.abs(r.capacityFactor-expected)<1e-7&&Math.abs(r.activity.leisure-expectedLeisure)<1e-7&&r.activity.enterpriseJobs===0&&r.activity.education===0&&r.activity.shopping===0&&r.activity.services===0&&r.activity.parking===0;
 return{day:e.day,pop:stats.pop,root:r,water,fill,service,expected,expectedLeisure,tourists,exact,positive:exact&&r.operational&&r.employed>0&&r.activity.publicJobs>0&&r.activity.leisure>0&&!!r.coverageStamp,zero:exact&&r.employed===0&&r.capacityFactor===0&&r.activity.leisure===0&&!r.coverageStamp,authority:'Native T495 paid public workforce, T491 leisure and native theater coverage; city visitor multiplier is existing demand only, with no theatre ticket or tourist income.'};
}


function identity013() {
 const Q = window.__theatreQA013, buildings = [], paths = [], terrain = [];
 for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
  const t = GV.tile(x, y), b = t.bld;
  if (b) buildings.push({ i: y * Q.N + x, k: b.k, ref: b.ref || null, lv: b.lv, v: b.v, age: b.age, sz: b.sz || 1 });
  if (t.am502) paths.push({ i: y * Q.N + x, am502: t.am502, amx502: t.amx502 || null });
 }
 for (const p of Q.waterCells) terrain.push({ x: p.x, y: p.y, t: GV.tile(p.x, p.y).t });
 return { buildings, paths, terrain };
}

function assetAudit013(){const A=GV.art574.SPR(),out=[];for(const [key,s]of[...[281].flatMap(k=>[0,1,2,3].map(v=>['bld.'+k+'_1_'+v,A.bld[k+'_1_'+v]])),...Object.entries(A.theatre013).map(([k,s])=>['theatre013.'+k,s])]){const d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let opaque=0,partial=0,lit=0,outside=0;for(let i=3;i<d.length;i+=4){if(d[i]===255)opaque++;else if(d[i])partial++;if(n[i]){lit++;if(d[i]!==255)outside++;}}out.push({key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,opaque,partial,lit,outside,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')});}return out;}

function artPurity013() {
 const Q = window.__theatreQA013, before = Q.world(), storage = JSON.stringify(Q.storage());
 const refs = [...Q.canonical.map(([k, sprite]) => ['bld.' + k, sprite]), ...Q.canonicalPaths.map(([k, sprite]) => ['theatre013.' + k, sprite])];
 const ink = refs.map(([key, sprite]) => ({ key, day: sprite.img.toDataURL(), night: sprite.night.toDataURL() }));
 const old = Math.random; let calls = 0;
 Math.random = () => { calls++; throw Error('New art must never call random'); };
 const start = performance.now();
 try {
  const flatten = a => [...Object.entries(a.buildings).flatMap(([k, views]) => views.map((sprite, v) => [k + '_' + v, sprite])), ...Object.entries(a.modules)];
  const a = flatten(window.BritishTheatreArchitecture013.buildAll()), b = flatten(window.BritishTheatreArchitecture013.buildAll());
  return { calls, ms: performance.now() - start, count: a.length,
   same: a.length === 28 && a.every(([key, sprite], n) => key === b[n][0] && sprite.img.toDataURL() === b[n][1].img.toDataURL() && sprite.night.toDataURL() === b[n][1].night.toDataURL()),
   worldExact: before === Q.world(), storageExact: storage === JSON.stringify(Q.storage()),
   canonical: Q.canonical.every(([key, sprite]) => GV.art574.SPR().bld[key] === sprite) && Q.canonicalPaths.every(([key, sprite]) => GV.art574.SPR().theatre013[key] === sprite),
   canonicalPixelsExact: refs.every(([key, sprite], n) => key === ink[n].key && sprite.img.toDataURL() === ink[n].day && sprite.night.toDataURL() === ink[n].night) };
 } finally { Math.random = old; }
}

function nativeScene013(rot,night,focus=[60,66],zoom=2){GV.setRot(rot);GV.setZoom(zoom);GV.lookAt(...focus);GV.setVisT(GV.art574.cycle574()*(night?.9:.5));GV.weather(0);window.__ovCapMax606=12000;window.__ovCap606=[];GV.forceDraw();const caps=window.__ovCap606;window.__ovCap606=null;const canvas=document.getElementById('game'),camera=GV.camera436(),Q=window.__theatreQA013,geometry=Q.roots.map(r=>{const b=GV.tile(r.x,r.y).bld,key=r.k+'_1_'+((b.v+rot)&3),s=GV.art574.SPR().bld[key],hit=caps.find(q=>q.o?.x===r.x&&q.o?.y===r.y&&q.bd?.k===r.k);let corner=null,depth=-Infinity;for(let dy=0;dy<r.sz;dy++)for(let dx=0;dx<r.sz;dx++){const p=GV.w2v(r.x+dx,r.y+dy);if(p[0]+p[1]>=depth){depth=p[0]+p[1];corner=p;}}const ex=Math.round(canvas.width/2-camera.x*zoom)+(corner[0]-corner[1])*32*zoom-s.ax*zoom,ey=Math.round(canvas.height/2-camera.y*zoom)+(corner[0]+corner[1])*16*zoom+(32-s.ay)*zoom;return{k:r.k,key,age:b.age,canonical:!!hit&&hit.s===s,anchorError:hit?[hit.bx-ex,hit.by-ey]:null,within:!!hit&&hit.bx>=0&&hit.by>=0&&hit.bx+s.w*zoom<=canvas.width&&hit.by+s.h*zoom<=canvas.height,box:hit?{x:hit.bx,y:hit.by,w:s.w*zoom,h:s.h*zoom}:null};});return{png:canvas.toDataURL('image/png'),rot:GV.rot(),night,time:GV.daylightDbg(),day:GV.stats().day,roots:Q.roots.map(r=>GV.theatreAt013(r.x,r.y)),geometry};}

function nativeLight013(k=281){const Q=window.__theatreQA013,r=Q.roots.find(q=>q.k===k),b=GV.tile(r.x,r.y).bld,s=GV.art574.SPR().bld[k+'_1_'+((b.v+GV.rot())&3)],c=document.getElementById('game'),g=c.getContext('2d'),night=s.night,had=Object.hasOwn(window,'__nightOccNoErase629'),flag=window.__nightOccNoErase629,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;const shot=(on,erase)=>{s.night=on?night:empty;window.__nightOccNoErase629=!erase;GV.forceDraw();return g.getImageData(0,0,c.width,c.height).data;};try{const a=shot(true,true),b=shot(false,true),u=shot(true,false),v=shot(false,false);let candidates=0,blocked=0,visible=0;for(let i=0;i<a.length;i+=4){let n=0,f=0;for(let j=0;j<3;j++){n+=Math.abs(a[i+j]-b[i+j]);f+=Math.abs(u[i+j]-v[i+j]);}if(f>9){candidates++;if(n<=3)blocked++;if(n>9)visible++;}}return{k,candidates,blocked,visible,method:'Four native same-turn draws, own physical emission on/off and existing depth erasure on/off; no supply/staff/geometry override.'};}finally{s.night=night;if(had)window.__nightOccNoErase629=flag;else delete window.__nightOccNoErase629;GV.forceDraw();}}

function physicalLoss013(kind) {
 const Q = window.__theatreQA013, before = snapshot013(), beforeCapacity = scalingWitness013(), removed = [];
 if (kind === 'road') {
  for (const i of new Set(before.roots.flatMap(r => r.road))) {
   const x = i % Q.N, y = Math.floor(i / Q.N), t = GV.tile(x, y);
   if (t.road) { removed.push({ id: 'road', x, y, road: t.road, rc: t.rc }); Q.pay('doze', x, y); }
  }
 } else {
  const k = kind === 'power' ? 5 : 10, id = kind === 'power' ? 'plant' : 'water';
  for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
   const b = GV.tile(x, y).bld;
   if (b && !b.ref && b.k === k) { removed.push({ id, x, y, k }); Q.pay('doze', x, y); }
  }
 }
 if (!removed.length || removed.length > 120) throw Error('Loss test has no bounded actual infrastructure');
 const lost = step013(1), lostCapacity = scalingWitness013();
 nativeScene013(0, true, [60, 66], 1.8);
 const lostLight = kind === 'power' ? Q.roots.map(r => nativeLight013(r.k)) : null;
 const lostModuleLight=kind==='power'?nativeAmenityLight013():null;
 const start = Q.paid.length;
 for (const r of removed) Q.pay(r.id, r.x, r.y);
 const recoveryDays = [];
 for (let n = 0; n < 15; n++) {
  const now = step013(1), capacity = scalingWitness013();
  recoveryDays.push({ day: now.day, roots: now.roots, capacity });
  if (capacity.positive) break;
 }
 nativeScene013(0, true, [60, 66], 1.8);
 return { kind, before, beforeCapacity, removed, lost, lostCapacity, lostLight,
  repair: Q.paid.slice(start), recoveryDays, recovered: snapshot013(), recoveredCapacity: scalingWitness013(),
  recoveredLight: kind === 'power' ? Q.roots.map(r => nativeLight013(r.k)) : null, lostModuleLight, recoveredModuleLight:kind==='power'?nativeAmenityLight013():null };
}

function zeroStaff013() {
 const Q = window.__theatreQA013, baseline = scalingWitness013(), savedIdentity = identity013();
 GV.save();
 const housing = [], payments = [];
 for (let y = 0; y < Q.N; y++) for (let x = 0; x < Q.N; x++) {
  const b = GV.tile(x, y).bld;
  if (b && !b.ref && ([1, 33, 105, 127, 219].includes(b.k) || b.k >= 246 && b.k <= 261)) housing.push({ x, y, k: b.k });
 }
 for (const r of housing) payments.push(Q.pay('doze', r.x, r.y));
 const afterRemoval = step013(1), zero = scalingWitness013();
 if (!GV.load()) throw Error('Restore actual native saved housing failed');
 const loadedIdentity = identity013(), recoveryDays = [];
 for (let n = 0; n < 8; n++) {
  const now = step013(1), capacity = scalingWitness013();
  recoveryDays.push({ day: now.day, capacity });
  if (capacity.positive) break;
 }
 return { baseline, housing, payments, afterRemoval, zero, savedIdentity, loadedIdentity,
  restoredIdentity: JSON.stringify(savedIdentity) === JSON.stringify(loadedIdentity), recoveryDays, restored: scalingWitness013(),
  method: 'All actual homes removed with paid ordinary demolition. Ordinary daily staffing establishes zero residents and zero theatre capacity; native save/load restores the genuine prior homes. No labor, finance, age or supply assignments.' };
}

function nativeSaveLoad013() {
 const Q = window.__theatreQA013, before = snapshot013(), storage = Q.storage(), identity = identity013();
 const eligible = Q.roots.map(r => GV.placePreview459(r.id, 64, 64));
 if (!eligible.every(p => p?.ok)) throw Error('Save/load escape control requires real valid plot');
 GV.save();
 const raw = localStorage.getItem('glimmerville.v1.s3');
 window.__noTheatre013 = true;
 let loaded, immediate, disabled;
 try {
  loaded = GV.load(); if (!loaded) throw Error('Native load failed');
  immediate = snapshot013();
  disabled = Q.roots.every(r => GV.placePreview459(r.id, 64, 64)?.ok === false) && Q.paths.every(r => GV.placePreview459(r.id, 68, 64)?.ok === false);
 } finally { delete window.__noTheatre013; }
 const references = JSON.stringify(identity) === JSON.stringify(identity013()), from = GV.stats().day;
 const following = step013(1), capacity = scalingWitness013(), after = Q.storage();
 const allowed = k => k === 'glimmerville.v1.slot' || /^glimmerville\.v1\.s3(?:_|$)/.test(k) || k.includes('.viewRot');
 return { before, eligible, loaded, immediate, disabled, references, from, following, capacity, bytes: raw?.length || 0,
  otherSlotsUnchanged: [...new Set([...Object.keys(storage), ...Object.keys(after)])].filter(k => !allowed(k)).every(k => storage[k] === after[k]) };
}

function nativeTransactions013() {
 const Q = window.__theatreQA013, rows = [], pathRows = [];
 for (const r of Q.roots) {
  const cells = () => Array.from({ length: r.sz * r.sz }, (_, n) => GV.tile(r.x + n % r.sz, r.y + Math.floor(n / r.sz)));
  const original = JSON.stringify(cells()), money = GV.devMoney516B(), inspect = GV.inspectAt(r.x, r.y);
  const quote = GV.placePreview459('doze', r.x + r.sz - 1, r.y + r.sz - 1);
  const ok = GV.placeUndo('doze', r.x + r.sz - 1, r.y + r.sz - 1), charged = money - GV.devMoney516B();
  const gone = cells().every(t => !t.bld), undo = GV.undo();
  const restored = JSON.stringify(cells()) === original && GV.devMoney516B() === money;
  const redo = GV.redo(), regone = cells().every(t => !t.bld), redoPaid = money - GV.devMoney516B() === charged;
  const undoAgain = GV.undo();
  rows.push({ k: r.k, inspect, ok, quote, charged, gone, undo, restored, redo, regone, redoPaid, undoAgain,
   final: JSON.stringify(cells()) === original && GV.devMoney516B() === money });
 }
 for (const p of Q.paths) {
  const before = GV.tile(p.x, p.y), money = GV.devMoney516B(), base = GV.theatreAt013(p.x, p.y);
  const doze = GV.placeUndo('doze', p.x, p.y), removed = !GV.theatreAt013(p.x, p.y), charged = money - GV.devMoney516B();
  const plainCost = GV.placePreview459('footpath502', p.x, p.y).cost;
  const undo = GV.undo(), exact = JSON.stringify(GV.tile(p.x, p.y)) === JSON.stringify(before) && GV.devMoney516B() === money;
  const redo = GV.redo(), regone = !GV.theatreAt013(p.x, p.y), redoPaid = money - GV.devMoney516B() === charged;
  const undoAgain = GV.undo(), final = JSON.stringify(GV.tile(p.x, p.y)) === JSON.stringify(before) && GV.devMoney516B() === money;
  pathRows.push({ theme: p.theme, doze, removed, charged, undo, exact, redo, regone, redoPaid, undoAgain, final, base, plainCost });
 }
 const world = Q.world(), storage = JSON.stringify(Q.storage()), identities = JSON.stringify(identity013());
 for (let n = 0; n < 8; n++) GV.forceDraw();
 return { rows, pathRows, renderWorldExact: world === Q.world(), renderStorageExact: storage === JSON.stringify(Q.storage()),
  identitiesExact: identities === JSON.stringify(identity013()),
  canonical: Q.canonical.every(([k, s]) => GV.art574.SPR().bld[k] === s) && Q.canonicalPaths.every(([k, s]) => GV.art574.SPR().theatre013[k] === s) };
}

function nativePathEdits013() {
 const Q = window.__theatreQA013, rows = [], storage = Q.storage();
 const original = Q.pathPlacements.map(p => ({ p, t: GV.tile(p.x, p.y) }));
 for (let n = 0; n < Q.paths.length; n++) {
  const p = Q.paths[n], next = Q.paths[(n + 1) % Q.paths.length];
  const before = GV.theatreAt013(p.x, p.y), remove = Q.pay('doze', p.x, p.y), removed = !GV.theatreAt013(p.x, p.y);
  const plainQuote = GV.placePreview459('footpath502', p.x, p.y), purchase = Q.pay(next.id, p.x, p.y);
  const edited = GV.theatreAt013(p.x, p.y), tile = GV.tile(p.x, p.y);
  GV.save(); const loaded = GV.load();
  if (!loaded) throw Error('Native edited-theme save/load failed');
  const afterLoad = GV.theatreAt013(p.x, p.y), metadataExact = JSON.stringify(tile.amx502) === JSON.stringify(GV.tile(p.x, p.y).amx502);
  const day = GV.stats().day, following = step013(1), afterDay = GV.theatreAt013(p.x, p.y);
  const removeEdited = Q.pay('doze', p.x, p.y), restore = Q.pay(p.id, p.x, p.y), restored = GV.theatreAt013(p.x, p.y);
  rows.push({ from: p.theme, to: next.theme, before, remove, removed, plainQuote, purchase, edited, loaded,
   afterLoad, metadataExact, fromDay: day, toDay: following.day, afterDay, removeEdited, restore, restored });
 }
 const after = Q.storage(), allowed = k => k === 'glimmerville.v1.slot' || /^glimmerville\.v1\.s3(?:_|$)/.test(k) || k.includes('.viewRot');
 return { rows,
  originalThemesRestored: original.every(({ p, t }) => { const now = GV.tile(p.x, p.y); return now.am502 === t.am502 && JSON.stringify(now.amx502) === JSON.stringify(t.amx502); }),
  otherSlotsUnchanged: [...new Set([...Object.keys(storage), ...Object.keys(after)])].filter(k => !allowed(k)).every(k => storage[k] === after[k]) };
}

function nativeOcclusion013() {
 const Q = window.__theatreQA013, root = Q.roots.find(r => r.k === 281), out = { trials: [] };
 // Real paid foregrounds start at age0 and mature through nine ordinary ticks.
 // Every on/off comparison is at the same final day/time and camera via undo.
 for (const [x, y] of [[61, 65], [61, 64], [61, 66]]) {
  const cells = Array.from({ length: 4 }, (_, n) => ({ x: x + n % 2, y: y + Math.floor(n / 2), t: GV.tile(x + n % 2, y + Math.floor(n / 2)) }));
  if (cells.some(c => c.t.bld || c.t.road || c.t.rail || c.t.tram || c.t.am502 || c.t.parkMeter)) { out.trials.push({ x, y, skipped: 'Existing native identity preserved' }); continue; }
  Q.prepare(x, y, 2);
  const payment = Q.pay('britishTerrace', x, y, true), initial = GV.tile(x, y).bld, from = GV.stats().day, days = [];
  if (initial?.k !== 219 || initial.age !== 0 || initial.sz !== 2) throw Error('Foreground must be paid native age0');
  for (let n = 0; n < 9; n++) { step013(1); days.push({ day: GV.stats().day, age: GV.tile(x, y).bld?.age }); }
  const foreground = GV.tile(x, y).bld, withScene = nativeScene013(0, true, [root.x, root.y], 2), withLight = nativeLight013(root.k), before = GV.theatreAt013(root.x, root.y);
  if (!GV.undo()) throw Error('Actual foreground undo failed');
  const control = nativeScene013(0, true, [root.x, root.y], 2), withoutLight = nativeLight013(root.k), after = GV.theatreAt013(root.x, root.y);
  const identity = r => JSON.stringify({ root: r.root, k: r.k, v: r.v, sz: r.sz, age: r.age, refs: r.refCells });
  const row = { x, y, payment, initial, from, to: GV.stats().day, days, foreground, before, after, withLight, withoutLight,
   sameTurn: withScene.day === control.day && JSON.stringify(withScene.time) === JSON.stringify(control.time),
   sameIdentity: identity(before) === identity(after), removed: cells.every(c => !GV.tile(c.x, c.y).bld) };
  row.partial = row.sameTurn && row.sameIdentity && row.removed && foreground.age >= 9 && before.operational && after.operational && withLight.candidates > 0 && withLight.blocked > withoutLight.blocked && withLight.visible > 0;
  out.trials.push(row);
  if (row.partial) { out.selected = row; out.capture = withScene; out.control = control; break; }
 }
 return out;
}


function rejectedPlacements013(){
 const Q=window.__theatreQA013,rows=[],x=64,y=64;Q.prepare(x,y,3);Q.prepare(68,64);
 const test=(label,r,xx=x,yy=y)=>{const before=Q.world(),money=GV.devMoney516B(),preview=GV.placePreview459(r.id,xx,yy),placed=GV.place(r.id,xx,yy);rows.push({label,id:r.id,preview,placed,unchanged:before===Q.world()&&money===GV.devMoney516B()});};
 for(const r of Q.roots){test('whole-footprint collision',r,58,64);test('map-edge rejection',r,Q.N,0);}
 for(const [tool,label]of[['tree','tree'],['road','road'],['tdig','water'],['theatreBench013','path']]){const before=Q.world();Q.pay(tool,x,y,true);for(const r of Q.roots)test(label,r);if(!GV.undo()||before!==Q.world())throw Error('Obstacle undo not exact: '+tool);}
 for(const [tool,label]of[['tree','path-tree'],['zr','path-residential-zone'],['zc','path-commercial-zone'],['office','path-office-zone'],['lvline','path-overhead-line']]){const before=Q.world();Q.pay(tool,x,y,true);for(const p of Q.paths)test(label,p);if(!GV.undo()||before!==Q.world())throw Error('Path obstacle undo not exact: '+tool);}
 Q.pay('traise',x,y,true);for(const r of Q.roots)test('uneven footprint',r);if(!GV.undo())throw Error('Terrain obstacle undo');
 for(const p of Q.paths)test('land-only themed path',p,60,57);
 window.__noTheatre013=true;try{for(const r of Q.roots)test('bounded new-building escape',r);for(const p of Q.paths)test('bounded new-path escape',p);}finally{delete window.__noTheatre013;}
 return rows;
}
function coverage013(){
 const Q=window.__theatreQA013,r=Q.roots[0],field=()=>Array.from({length:Q.N*Q.N},(_,i)=>GV.cov('theater',i%Q.N,Math.floor(i/Q.N))),before=field(),money=GV.devMoney516B(),a=GV.theatreAt013(r.x,r.y);
 const removed=GV.placeUndo('doze',r.x+2,r.y+2),off=field();if(!GV.undo())throw Error('Coverage undo failed');const restored=field(),moneyRestored=GV.devMoney516B()===money;
 for(let i=0;i<3;i++)GV.rebuildCov();const rebuilt=field(),changed=before.map((v,i)=>v-off[i]),expected=changed.map((v,i)=>Math.abs(i%Q.N-r.x)<=7&&Math.abs(Math.floor(i/Q.N)-r.y)<=7?1:0);
 GV.save();const loaded=GV.load(),from=GV.stats().day;step013(1);const after=field(),b=GV.theatreAt013(r.x,r.y);
 return{removed,loaded,from,to:GV.stats().day,staffed:a.employed>0&&!!a.coverageStamp,loadedStaffed:b.employed>0&&!!b.coverageStamp,exactOwnedField:JSON.stringify(changed)===JSON.stringify(expected),changedCells:changed.filter(v=>v!==0).length,undoExact:JSON.stringify(restored)===JSON.stringify(before)&&moneyRestored,rebuildExact:JSON.stringify(rebuilt)===JSON.stringify(before),loadExact:JSON.stringify(after)===JSON.stringify(before),before,withoutTheatre:off,restored,after};
}


function constraints013(){const Q=window.__theatreQA013;GV.save();const baseline=scalingWitness013(),waterSources=[];for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&b.k===10)waterSources.push({x,y});}const waterRows=[],waterPayments=[];let partialWater=null;for(const p of waterSources){waterPayments.push(Q.pay('doze',p.x,p.y));step013(1);const q=scalingWitness013();waterRows.push(q);if(q.root.operational&&q.water>.02&&q.water<.98&&q.root.employed>0){partialWater=q;break;}}if(!GV.load())throw Error('Restore before workforce failed');step013(1);const housing=[];for(let y=0;y<Q.N;y++)for(let x=0;x<Q.N;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&([1,33,105,127,219].includes(b.k)||(b.k>=246&&b.k<=261)))housing.push({x,y,k:b.k});}const staffRows=[],staffPayments=[];let partialStaff=null;for(let n=0;n<housing.length;n++){const p=housing[n];staffPayments.push(Q.pay('doze',p.x,p.y));if((n+1)%3===0||n===housing.length-1){step013(1);const q=scalingWitness013();staffRows.push(q);if(q.root.operational&&q.fill>0&&q.fill<.98&&!partialStaff)partialStaff=q;}}const zero=scalingWitness013();if(!GV.load())throw Error('Restore genuine saved fixture failed');step013(1);return{baseline,waterSources,waterPayments,waterRows,partialWater,housing,staffPayments,staffRows,partialStaff,zero,restored:scalingWitness013(),method:'Only paid ordinary water-source and housing demolition, ordinary daily staffing/dispatch, and actual native saved-fixture restoration. No supply arrays, people, employment or capacities assigned.'};}


function amenityComposition013(){
 const Q=window.__theatreQA013,c=document.getElementById('game'),camera=GV.camera436(),z=camera.z;
 const rows=Q.pathPlacements.map(p=>{const v=GV.w2v(p.x,p.y),s=GV.art574.SPR().theatre013[p.theme+'_'+((GV.tile(p.x,p.y).amx502.turn013+GV.rot())&3)],sx=Math.round(c.width/2-camera.x*z)+(v[0]-v[1])*32*z+32*z,sy=Math.round(c.height/2-camera.y*z)+(v[0]+v[1])*16*z+32*z;return{...p,at:GV.theatreAt013(p.x,p.y),key:p.theme+'_'+((GV.tile(p.x,p.y).amx502.turn013+GV.rot())&3),spriteView:s.view,box:{x:sx-s.ax*z,y:sy-s.ay*z,w:s.w*z,h:s.h*z},within:sx-s.ax*z>=0&&sy-s.ay*z>=0&&sx+(s.w-s.ax)*z<=c.width&&sy+(s.h-s.ay)*z<=c.height};});
 return{rotation:GV.rot(),rows,allSixIndependent:rows.length===6&&new Set(rows.map(r=>r.theme)).size===6,allWithin:rows.every(r=>r.within),allNative:rows.every(r=>r.at?.theme===r.theme&&r.at.am502===1&&r.at.baseWalkCost===.72&&r.spriteView===((r.at.amx502.turn013+GV.rot())&3))};
}
function amenityRenderWitness013(){
 const Q=window.__theatreQA013,world=Q.world(),storage=JSON.stringify(Q.storage()),spriteRefs=Q.canonicalPaths.slice(),before=GV.theatreEvidence013(),rows=[];
 const canvas=document.getElementById('game'),g=canvas.getContext('2d'),pixels=()=>g.getImageData(0,0,canvas.width,canvas.height).data;
 for(const p of Q.paths){nativeScene013(0,false,[p.x,p.y],2);const on=pixels(),tile=GV.tile(p.x,p.y),money=GV.devMoney516B(),quote=GV.placePreview459('doze',p.x,p.y),removed=GV.placeUndo('doze',p.x,p.y),paid=money-GV.devMoney516B();GV.forceDraw();const off=pixels();let changed=0;for(let n=0;n<on.length;n+=4)if(on[n]!==off[n]||on[n+1]!==off[n+1]||on[n+2]!==off[n+2])changed++;const undo=GV.undo(),restored=JSON.stringify(tile)===JSON.stringify(GV.tile(p.x,p.y))&&GV.devMoney516B()===money;rows.push({theme:p.theme,removed,paid,quote,changed,undo,restored});}
 return{rows,before,after:GV.theatreEvidence013(),worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),canonicalExact:spriteRefs.every(([k,s])=>GV.art574.SPR().theatre013[k]===s)};
}

function nativeAmenityLight013(){
 const Q=window.__theatreQA013,c=document.getElementById('game'),g=c.getContext('2d'),rows=[];
 for(const p of Q.paths.filter(p=>['lamp','ticket'].includes(p.theme))){
  const at=GV.theatreAt013(p.x,p.y),s=GV.art574.SPR().theatre013[p.theme+'_'+((at.amx502.turn013+GV.rot())&3)],night=s.night,empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
  try{GV.forceDraw();const on=g.getImageData(0,0,c.width,c.height).data;s.night=empty;GV.forceDraw();const off=g.getImageData(0,0,c.width,c.height).data;let changed=0,delta=0;for(let i=0;i<on.length;i+=4){let d=0;for(let j=0;j<3;j++)d+=Math.abs(on[i+j]-off[i+j]);if(d>3){changed++;delta+=d;}}rows.push({theme:p.theme,x:p.x,y:p.y,turn:at.amx502.turn013,rotation:GV.rot(),lighting:at.lighting,changed,delta,sourceIsActualAdjacentRoad:!!at.lighting.source&&Math.abs(at.lighting.source.x-p.x)+Math.abs(at.lighting.source.y-p.y)===1&&!!GV.tile(at.lighting.source.x,at.lighting.source.y).road});}
  finally{s.night=night;GV.forceDraw();}
 }
 return{rows,day:GV.stats().day,time:GV.daylightDbg(),method:'Two same-turn native draws per actual ticket/lamp, toggle only its canonical physical mask, read unchanged adjacent-road T487 authority.'};
}
function protectedAmenityTransactions013(){
 const Q=window.__theatreQA013,rows=[];
 for(const p of Q.paths)for(const id of[p.id,'road','zr','zc','office','park','tree','britishTerrace']){
  const before=Q.world(),money=GV.devMoney516B(),preview=GV.placePreview459(id,p.x,p.y),placed=GV.place(id,p.x,p.y);
  rows.push({theme:p.theme,id,preview,placed,worldExact:before===Q.world(),moneyExact:money===GV.devMoney516B(),retained:GV.theatreAt013(p.x,p.y)});
 }
 const overlaps=[];for(const p of Q.paths){const x=p.x-1,y=p.y-1,before=Q.world(),money=GV.devMoney516B(),preview=GV.placePreview459('museum',x,y),placed=GV.place('museum',x,y);overlaps.push({theme:p.theme,x,y,preview,placed,worldExact:before===Q.world(),moneyExact:money===GV.devMoney516B()});}
 const underground=[];for(const p of Q.paths){const before=GV.tile(p.x,p.y),money=GV.devMoney516B(),purchase=Q.pay('wpipe',p.x,p.y,true),installed=GV.tile(p.x,p.y),undo=GV.undo();underground.push({theme:p.theme,purchase,nativePipe:!!installed.wp,themeExact:installed.am502===before.am502&&JSON.stringify(installed.amx502)===JSON.stringify(before.amx502),undo,restored:JSON.stringify(GV.tile(p.x,p.y))===JSON.stringify(before)&&GV.devMoney516B()===money});}
 const before=Q.paths.map(p=>({p,t:GV.tile(p.x,p.y)})),days=[];
 for(let n=0;n<3;n++){step013(1);days.push({day:GV.stats().day,paths:Q.paths.map(p=>({theme:p.theme,t:GV.tile(p.x,p.y),at:GV.theatreAt013(p.x,p.y)}))});}
 return{rows,overlaps,underground,days,noGrowthThrough:before.every(({p,t})=>{const a=GV.tile(p.x,p.y);return !a.bld&&!a.zone&&!a.office&&a.am502===t.am502&&JSON.stringify(a.amx502)===JSON.stringify(t.amx502);})};
}
function cardinalPathProbes013(){
 const Q=window.__theatreQA013,x=68,y=67,rows=[];Q.prepare(x,y);
 for(const [dx,dy,turn,side]of[[0,1,0,'south'],[1,0,3,'east'],[0,-1,2,'north'],[-1,0,1,'west']]){
  const rx=x+dx,ry=y+dy;Q.prepare(rx,ry);const original=GV.tile(rx,ry),road=Q.pay('road',rx,ry),spec=GV.theatreSpecs013().paths.find(p=>p.theme==='plaza'),purchase=Q.pay(spec.id,x,y),placed=GV.theatreAt013(x,y);
  GV.save();const loaded=GV.load(),afterLoad=GV.theatreAt013(x,y),fromDay=GV.stats().day;step013(1);const afterDay=GV.theatreAt013(x,y);
  const remove=Q.pay('doze',x,y),removed=!GV.theatreAt013(x,y),removeRoad=Q.pay('doze',rx,ry);
  rows.push({side,turn,road,purchase,placed,loaded,afterLoad,afterDay,fromDay,toDay:GV.stats().day,remove,removed,removeRoad,roadRemoved:!GV.tile(rx,ry).road,metadataExact:JSON.stringify(placed.amx502)===JSON.stringify(afterLoad.amx502)&&JSON.stringify(placed.amx502)===JSON.stringify(afterDay.amx502)});
 }
 return{rows,contract:'Canonical clear walk axis south0, east3, north2, west1. Nearest road within4; equal-distance ties S,E,N,W; saved visual-only orientation.'};
}

const functions013=[bindObservation013,setupTheatre013,identity013,snapshot013,step013,assetAudit013,artPurity013,nativeScene013,nativeLight013,scalingWitness013,physicalLoss013,zeroStaff013,nativeSaveLoad013,nativeTransactions013,nativePathEdits013,rejectedPlacements013,nativeOcclusion013,coverage013,constraints013,amenityComposition013,amenityRenderWitness013,nativeAmenityLight013,protectedAmenityTransactions013,cardinalPathProbes013];
module.exports={legacyFixtures013,functions013};
if(require.main===module){if(process.argv.length!==3||process.argv[2]!=='--static-test')throw Error('Use the Actions integration runner; this module only supports source-only --static-test');const fixtures=legacyFixtures013();for(const f of functions013)new vm.Script('('+f.toString()+')');console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,functions:functions013.map(f=>f.name),legacy:{sha256:fixtures.sha256,parts:fixtures.parts,exactHistoricalFunctionBodies:true}},null,2));}

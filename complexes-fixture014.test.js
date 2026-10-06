#!/usr/bin/env node
'use strict';
// SOURCE / COORDINATE DATA ONLY. No index.html import, game, browser, canvas,
// simulation, staffing, finance or native tool implementation is executed.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='10bc4115f119498b4cc5836695348982b85fa9d1',hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const sources={};for(const file of['publiclife-legacy-fixture007.js','streetlife-integration-qa009.js','museum-integration-qa010.js','riverside-integration-qa012.js','theatre-gameplay013.js']){
 const current=fs.readFileSync(path.join(ROOT,file),'utf8'),pinned=execFileSync('git',['show',BASE+':'+file],{cwd:ROOT,encoding:'utf8'});assert.equal(current,pinned,'Historical coordinate authority changed: '+file);sources[file]=current;
}
// Recover explicit literal metadata from the immutable old fixture; evaluate
// only bracketed data literals, never any historical setup function or engine.
function data(file,pattern){const m=sources[file].match(pattern);assert(m,'Required pinned literal '+file);assert(!/[{}();=>]/.test(m[1]),'Coordinate literal must contain only arrays and scalar data');return new vm.Script('('+m[1]+')').runInNewContext();}
const old=new Map(),roots=[],key=(x,y)=>x+','+y;
function mark(kind,x,y,sz=1,id=kind){for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++){const k=key(x+dx,y+dy),a=old.get(k)||[];a.push({kind,id,x,y,sz});old.set(k,a);}if(kind==='building')roots.push({id,x,y,sz});}
const road=(x,y)=>{mark('road',x,y);mark('pipe',x,y);},range=(a,b,f)=>{for(let i=a;i<=b;i++)f(i);},place=(id,x,y,sz=1)=>mark('building',x,y,sz,id),walk=(x,y)=>mark('path',x,y),rail=(x,y)=>mark('rail',x,y);
const roadRows=[10,22,34,46,58];for(const y of roadRows){range(5,46,x=>road(x,y));for(const x of[6,46])place('plant',x,y-1);for(const x of[8,44])place('water',x,y+1);}range(10,58,y=>road(5,y));
const seed=data('publiclife-legacy-fixture007.js',/const specs=(\[\[[\s\S]+?\]\]),roots=\[\];/);
for(const[n,[k,id,sz]]of seed.entries())place(id,10+6*(n%6),roadRows[Math.floor(n/6)]-sz,sz);
for(const y of[11,23,35,47])for(const x of[12,28])place('britishTerrace',x,y,2);
range(5,46,x=>road(x,4));range(5,9,y=>road(5,y));for(const[id,x,y]of[['plant',6,3],['water',8,5],['plant',44,3],['water',42,5]])place(id,x,y);
const publicLife=data('streetlife-integration-qa009.js',/const prior=(\[\[[\s\S]+?\]\]);/);
for(const[n,[k,id,sz]]of publicLife.entries())place(id,10+n%6*6,n<6?4-sz:59,sz);
range(19,49,y=>road(49,y));for(const y of[22,46])range(46,48,x=>road(x,y));
for(const[id,x,y]of[['plant',48,19],['water',48,23],['plant',48,45],['water',48,47]])place(id,x,y);
place('britishStationNS008',50,20,5);place('britishStationNS008',50,42,5);for(const x of[51,53])range(19,47,y=>{if(!(y>=20&&y<=24||y>=42&&y<=46))rail(x,y);});
range(49,69,x=>road(x,18));range(19,37,y=>road(56,y));for(const y of[19,25,29,33,37])range(57,69,x=>road(x,y));
for(const x of[58,66]){place('plant',x,17);place('water',x+2,17);}for(const y of[25,33]){place('plant',55,y);place('water',55,y+2);}
for(const[id,x,y,sz]of[['stationHotel009',58,20,3],['refreshmentCafe009',63,20,2],['stationNewsstand009',67,20,1]])place(id,x,y,sz);
for(const[x,y]of[[58,23],[61,23],[65,22]])walk(x,y);
for(const y of[26,30,34])for(const x of[58,62,66])place('socialHousing',x,y,2);
range(38,47,y=>road(56,y));range(56,69,x=>road(x,39));range(40,47,y=>road(57,y));range(58,69,x=>road(x,47));
for(const[id,x,y]of[['plant',55,39],['water',55,41],['plant',66,38],['water',68,38]])place(id,x,y);
place('museum010',58,40,4);place('museum',64,40,2);place('nhm',67,40,2);
for(const[x,y]of[[60,46],[59,45],[61,45],[60,44],[60,45],[58,44],[59,44],[61,44],[58,45],[58,46],[59,46],[61,46]])walk(x,y);
range(48,55,y=>road(56,y));range(57,69,x=>road(x,49));
for(const[id,x,y]of[['plant',55,51],['water',55,53],['plant',65,48],['water',67,48]])place(id,x,y);
for(const[id,x,y,sz]of[['riversideMarket012',58,50,3],['riversideShop012',62,50,2],['riversideCafe012',64,50,2]])place(id,x,y,sz);
for(const y of[54,55])range(57,69,x=>walk(x,y));for(const x of[58,59,60,63,64,65,66,67,68,69])walk(x,53);
range(56,60,y=>range(57,70,x=>mark('canal',x,y)));
range(56,70,y=>road(56,y));range(57,64,x=>road(x,70));range(57,69,x=>road(x,63));
const theatreUtilities=data('theatre-gameplay013.js',/for\(const \[id,x,y\]of(\[\['plant',55,63\][\s\S]+?\]\])\)Q.place/);for(const[id,x,y]of theatreUtilities)place(id,x,y);
place('edwardianTheatre013',58,64,3);
for(const[x,y]of[[57,69],[59,68],[62,69],[58,69],[60,69],[61,69],[57,68],[57,67],[58,67],[59,67],[60,67],[58,68],[60,68],[61,68],[62,68],[61,67],[62,67],[59,69]])walk(x,y);
const specs=JSON.parse(fs.readFileSync(path.join(ROOT,'complex-specs014.json'))),source=fs.readFileSync(path.join(ROOT,'complexes-gameplay014.js'),'utf8');
const start=source.indexOf(' for(let y=59;y<=70;y++)Q.corridor(5,y);'),end=source.indexOf('\n Q.canonical=',start);assert(start>0&&end>start);
const coordinateSource=source.slice(start,end);assert(!/\b(?:step|draw|load|save|ensure|rebuild|dispatch|eval)\s*\(/.test(coordinateSource));
function audit(text){
 const additions=new Map(),actions=[],dataCells=new Map(),Q={roots:[],paths:[],pathPlacements:[],districts:[]};
 const record=(kind,id,x,y,sz=1)=>{
  assert(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x+sz<=72&&y+sz<=72,'Bounded coordinate required');
  for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++){
   const k=key(x+dx,y+dy),previous=old.get(k)||[],added=additions.get(k)||[];
   const conflicts=a=>a.filter(r=>kind==='road'? !['road','pipe'].includes(r.kind):kind==='pipe'?!['road','pipe'].includes(r.kind):true);
   assert.equal(conflicts(previous).length,0,'New '+id+' intersects retained '+JSON.stringify(previous)+' at '+k);
   assert.equal(conflicts(added).length,0,'New '+id+' overlaps new '+JSON.stringify(added)+' at '+k);
   additions.set(k,[...added,{kind,id,x,y,sz}]);
  }
  actions.push({kind,id,x,y,sz});
 };
 Q.corridor=(x,y)=>{record('road','road',x,y);record('pipe','wpipe',x,y);};
 Q.place=(id,x,y,sz=1)=>{const b=specs.buildings.find(b=>b.id===id),p=specs.paths.find(p=>p.id===id);record(b||['plant','water'].includes(id)?'building':'path',id,x,y,sz);dataCells.set(key(x,y),b?{bld:{k:b.k,age:0,sz}}:p?{theme:p.theme,am502:1,baseWalkCost:.72,amx502:{british014:p.theme}}:{});};
 const GV={complexSpecs014:()=>structuredClone(specs),tile:(x,y)=>dataCells.get(key(x,y)),complexAt014:(x,y)=>dataCells.get(key(x,y))};
 new vm.Script('(function(Q,GV){'+text+'\n})(Q,GV)').runInNewContext({Q,GV});
 assert.equal(Q.roots.length,12);assert.equal(Q.paths.length,16);assert.equal(actions.filter(a=>a.kind==='building').length,20);assert.equal(actions.filter(a=>a.kind==='path').length,32);
 for(const p of Q.paths)assert(additions.get(key(p.x,p.y+1))?.some(a=>a.kind==='road'),'Real road-adjacent theme');
 // Verify each root has actual frontage and every new road/pipe is connected
 // to the retained road grid; no hypothetical path counts as a vehicle road.
 for(const r of Q.roots.filter(r=>r.sz===4)){
  const fore={x:r.x+1,y:r.y+4},cells=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
   const k=key(fore.x+dx,fore.y+dy),prior=old.get(k)||[],owned=additions.get(k)||[];
   assert.equal(prior.length,0,'Temporary foreground must never occupy old identity');assert.equal(owned.length,1,'One owned surface per foreground cell');assert.equal(owned[0].kind,'path');
   assert.equal(owned[0].id==='footpath502',dy===0,'Only two own plain and two own themed paths may be temporarily replaced');cells.push(k);
  }
  assert.equal(cells.length,4);
 }
 const roads=new Set([...old].filter(([,v])=>v.some(q=>q.kind==='road')).map(([k])=>k));for(const[k,v]of additions)if(v.some(q=>q.kind==='road'))roads.add(k);
 for(const r of Q.roots){let frontage=0;for(let dy=-1;dy<=r.sz;dy++)for(let dx=-1;dx<=r.sz;dx++)if((dx===-1||dx===r.sz)&&(dy>=0&&dy<r.sz)||(dy===-1||dy===r.sz)&&(dx>=0&&dx<r.sz))frontage+=roads.has(key(r.x+dx,r.y+dy))?1:0;assert(frontage>0,'Independent native root frontage '+r.k);}
 const reached=new Set(['5,58']),queue=[[5,58]];for(let n=0;n<queue.length;n++){const[x,y]=queue[n];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=key(x+dx,y+dy);if(roads.has(k)&&!reached.has(k)){reached.add(k);queue.push([x+dx,y+dy]);}}}
 for(const a of actions.filter(a=>a.kind==='road'||a.kind==='pipe'))assert(reached.has(key(a.x,a.y)),'New carrier disconnected '+key(a.x,a.y));
 assert(reached.has('56,70'),'Native southern link must still reach retained theatre');
 for(const p of[{x:46,y:62},{x:1,y:64,sz:4},{x:68,y:67}])for(let dy=0;dy<(p.sz||1);dy++)for(let dx=0;dx<(p.sz||1);dx++){assert(!(old.get(key(p.x+dx,p.y+dy))||[]).some(a=>!['pipe'].includes(a.kind)),'Existing identity on QA probe');assert(!(additions.get(key(p.x+dx,p.y+dy))||[]).some(a=>!['pipe'].includes(a.kind)),'New identity on QA probe');}
 return{actions:actions.length,newRoots:Q.roots.length,newThemes:Q.paths.length,newFootprintCells:actions.filter(a=>a.kind==='building').reduce((n,a)=>n+a.sz*a.sz,0),newRoadCells:actions.filter(a=>a.kind==='road').length,allNewCarriersConnected:true,allFourTemporaryForegroundsUseOnlyOwnPaths:true,oldPlant5563Retained:old.get('55,63').some(a=>a.id==='plant')&&!additions.has('55,63'),fireDrillTarget:[46,62]};
}
const result=audit(coordinateSource),negativeControls=[];
for(const[name,text]of[['R1 old plant collision',coordinateSource.replace('x<=(y===63?54:55)','x<=55')],['new supporting building overlaps main',coordinateSource.replace('x:i===0?x:x+5','x:i===0?x:x+2')],['path overlaps new main',coordinateSource.replace('x:x+i,y:69','x:x+i,y:67')],['road overlaps new main',coordinateSource.replace('[x+4,x+7]','[x+3,x+7]')]]){assert.notEqual(text,coordinateSource);assert.throws(()=>audit(text),undefined,name);negativeControls.push(name);}
assert(source.includes('target={x:46,y:62}'),'Confirmed short-distance native fire drill target must remain');
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,simulationExecuted:false,scope:'Coordinate extraction/recording only; no native gameplay success claimed',historicalSourceHashes:Object.fromEntries(Object.entries(sources).map(([k,v])=>[k,hash(v)])),historicalBuildings:roots.length,historicalOccupiedCells:old.size,...result,negativeControls},null,2));

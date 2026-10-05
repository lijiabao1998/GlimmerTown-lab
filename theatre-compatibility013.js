'use strict';
// Seventh complete paid-world comparison, added after all six unmodified older
// worlds. Function extraction never imports/executes a historical browser runner.
const fs=require('fs'),path=require('path'),vm=require('vm'),{isDeepStrictEqual:eq}=require('util');
const fixed=require('./theatre-static-contract013'),ROOT=__dirname;
const WORLD_SEEDS013=Object.freeze([5162026,5162027,7006719,800721,900721,900724,900725]);
const METADATA_PATHS013=Object.freeze([900721,900724,900725].flatMap(seed=>['version','anchor'].map(field=>'seed'+seed+'.checkpoints[*].enterprise.'+field)));
function fixtureSource013(){
 const parts=[];
 for(const[file,start,end]of[
  ['streetlife-integration-qa009.js','function setupStreet009(','function snapshot009('],
  ['museum-integration-qa010.js','function setupMuseum010(','function assets010('],
  ['riverside-integration-qa012.js','function bindObservation012(','function step012(']
 ]){
  const source=fs.readFileSync(path.join(ROOT,file),'utf8');
  if(source!==fixed.baseFile(file).toString()||source.split(start).length!==2||source.split(end).length!==2)throw Error('Exact deployed T725 paid fixture source required: '+file);
  const body=source.slice(source.indexOf(start),source.indexOf(end));new vm.Script(body);parts.push(body);
 }
 return parts.join('\n');
}
// Serialized only inside isolated Actions. Every native tile, exposed statistic,
// RNG state, paid receipt, load identity and COMPLETE raw save is compared. No
// simulation assignment, helper repair, metadata elision or normalization.
function runRiversideWorld013(setup,seedFn){
 const random=Math.random;let m=123456789;
 Math.random=()=>{m=(Math.imul(m,1664525)+1013904223)>>>0;return m/4294967296;};
 try{
  const q=setup(seedFn);GV.setSpeed(0);GV.ai(false);GV.weather(0);
  if(q.difficulty!==1||q.developer.sandbox||q.developer.god||q.retained.length!==47||JSON.stringify(q.roots.map(r=>r.k))!=='[278,279,280]'||q.paths.length!==3||q.pathPlacements.length!==36||q.waterCells.length!==70||q.shoreline.length!==13||q.homes.length!==9||q.priorStreet.length!==3||q.priorMuseum.length!==1||q.paid.some(p=>!p.exact||p.charged<=0))throw Error('Immutable paid T725 riverside fixture invalid');
  const snap=()=>{
   const tiles=[];for(let y=0;y<q.N;y++)for(let x=0;x<q.N;x++)tiles.push(GV.tile(x,y));
   if(tiles.some(t=>t.bld?.k===281||t.amx502?.british013))throw Error('Theatre identity leaked into old-only T725 riverside world');
   const roots=q.roots.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,evidence:GV.riversideAt012(r.x,r.y),cells:Array.from({length:r.sz*r.sz},(_,i)=>GV.tile(r.x+i%r.sz,r.y+Math.floor(i/r.sz)).bld)}));
   const paths=q.pathPlacements.map(p=>({...p,tile:GV.tile(p.x,p.y),evidence:GV.riversideAt012(p.x,p.y)})),retained=q.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld}));
   const water=q.waterCells.map(p=>({x:p.x,y:p.y,terrain:GV.tile(p.x,p.y).t})),shoreline=q.shoreline.map(p=>({...p,land:GV.tile(p.x,p.y).t,water:GV.tile(p.x,p.y+1).t}));
   if(roots.some(r=>r.bld?.k!==r.k||(r.bld.sz||1)!==r.sz)||paths.some(p=>p.evidence?.theme!==p.theme||p.evidence.am502!==1||p.evidence.baseWalkCost!==.72)||retained.some(r=>r.bld?.k!==r.k)||water.some(p=>p.terrain!==0)||shoreline.some(p=>p.land===0||p.water!==0))throw Error('Historical riverside building/path/true shoreline identity changed');
   const rngState=window.__qaSeedState007();if(rngState!==window.__qaSeedState007())throw Error('Riverside RNG observation consumed state');
   const native=GV.riversideEvidence012();
   return{stats:GV.stats(),tiles,rngState,difficulty:GV.diff(),developer:GV.dev516B(),roots,paths,retained,water,shoreline,identity:identity012(),priorStreet:q.priorStreet.map(r=>GV.streetLifeAt009(r.x,r.y)),priorMuseum:q.priorMuseum.map(r=>GV.museumAt010(r.x,r.y)),stations:q.stations.map(p=>GV.stationDistrictAt008(...p)),hotel:GV.hotel330(),enterprise:GV.t489(),retailUnits:native.retailUnits,taxLedger:native.taxLedger};
  };
  const checkpoints=[{offset:0,...snap()}];let offset=0;
  for(const days of[1,4,4,11]){GV.step(days);offset+=days;checkpoints.push({offset,...snap()});}
  const beforeLoad=checkpoints.at(-1),storage=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
  GV.save();const raw=localStorage.getItem('glimmerville.v1.s3');
  if(typeof raw!=='string'||raw.length<1000)throw Error('Complete native T725 riverside save missing');
  const saved=JSON.parse(raw);
  if(saved.v!==1||saved.n!==q.N||saved.gameVer!=='14.29'||saved.df!==1||saved.day!==beforeLoad.stats.day||!Array.isArray(saved.bl)||[278,279,280].some(k=>saved.bl.filter(b=>b[1]===k).length!==1)||saved.bl.some(b=>b[1]===281))throw Error('Exact T725 native save metadata/building identities changed');
  if(!GV.load())throw Error('Historical riverside native slot3 save/load failed');const loaded=snap();
  if(JSON.stringify(beforeLoad.identity)!==JSON.stringify(loaded.identity)||raw!==localStorage.getItem('glimmerville.v1.s3'))throw Error('Native riverside load changed exact root/reference/age/view/path/water identity or save bytes');
  checkpoints.push({offset:'native-load',...loaded,loaded:true});GV.step(1);checkpoints.push({offset:21,...snap(),followingLoadedDay:true});
  const after=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])),allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');
  if([...new Set([...Object.keys(storage),...Object.keys(after)])].some(k=>!allowed(k)&&storage[k]!==after[k]))throw Error('Riverside comparison modified another save slot');
  return{fixture:{seed:900721,N:q.N,paid:q.paid,terrain:q.terrain,roots:q.roots,paths:q.paths,pathPlacements:q.pathPlacements,waterCells:q.waterCells,shoreline:q.shoreline,homes:q.homes,retained:q.retained,priorStreet:q.priorStreet,priorMuseum:q.priorMuseum,stations:q.stations,oldMuseums:q.oldMuseums,placementDay:q.placementDay},checkpoints,nativeSave:raw,nativeSaveMetadataExact:true,nativeLoadIdentitiesExact:true,otherSlotsUnchanged:true};
 }finally{Math.random=random;}
}
function normalizeCompatibility013(runs,product){
 if(!product?.ok||!product.htmlExact||!product.protectedExact||!product.fpExact||!product.logExact||!product.coldLoadFixExact||product.release!==false||product.phase!=='candidate'||product.version!=='14.29'||product.anchor!=='T725')throw Error('Exact verified T725-labelled candidate required');
 if(!Array.isArray(runs)||runs.length!==2||runs[0].label!=='baseline'||runs[1].label!=='candidate')throw Error('Exactly ordered baseline/candidate raw observations required');
 const raw=JSON.stringify(runs),reference=runs[0].result,comparison=structuredClone(runs[1].result);
 for(const rows of[reference,comparison]){
  if(!Array.isArray(rows)||!eq(rows.map(q=>q.seed),WORLD_SEEDS013)||rows.some(q=>!Array.isArray(q.checkpoints)||q.checkpoints.length!==([900721,900724,900725].includes(q.seed)?7:6)))throw Error('Exactly seven complete historical comparison worlds required');
  for(const seed of[900721,900724,900725])for(const[index,q]of rows.find(q=>q.seed===seed).checkpoints.entries()){
   if(!q.enterprise||!Object.hasOwn(q.enterprise,'version')||!Object.hasOwn(q.enterprise,'anchor')||q.enterprise.version!=='14.29'||q.enterprise.anchor!=='T725')throw Error('Unexpected native enterprise metadata at seed'+seed+'.checkpoints['+index+']');
  }
  const river=rows.find(q=>q.seed===900725),save=JSON.parse(river.nativeSave||'null');
  if(!river.nativeSaveMetadataExact||!river.nativeLoadIdentitiesExact||!river.otherSlotsUnchanged||!save||save.v!==1||save.n!==river.fixture?.N||save.gameVer!=='14.29'||save.df!==1||save.day!==river.checkpoints[4].stats.day)throw Error('Native riverside full save and metadata evidence missing');
 }
 if(JSON.stringify(runs)!==raw)throw Error('Raw observations must remain unchanged');
 return{reference,comparison,metadataNormalization:{applied:false,paths:[],validatedPaths:[...METADATA_PATHS013,'seed900725.nativeSave.gameVer'],from:{version:'14.29',anchor:'T725'},to:{version:'14.29',anchor:'T725'},rawObservationsPreserved:true,sameLabelExact:true,normalizedFields:0,changes:[]}};
}
function staticNormalizationTest013(){
 const product={ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,release:false,phase:'candidate',version:'14.29',anchor:'T725'};
 const fixture=()=>['baseline','candidate'].map(label=>({label,result:WORLD_SEEDS013.map((seed,worldIndex)=>({seed,fixture:{N:72,paid:100},...(seed===900725?{nativeSave:JSON.stringify({v:1,n:72,gameVer:'14.29',df:1,day:4,allFields:{retained:true}}),nativeSaveMetadataExact:true,nativeLoadIdentitiesExact:true,otherSlotsUnchanged:true}:{}),checkpoints:Array.from({length:[6,6,6,6,7,7,7][worldIndex]},(_,index)=>({stats:{day:index,money:100-index},tilesSHA256:'complete-'+index,rngState:42+index,...(worldIndex>=4?{enterprise:{version:'14.29',anchor:'T725',money:100-index,other:{unchanged:true}}}:{})}))}))}));
 let cases=0;const assert=(ok,message)=>{cases++;if(!ok)throw Error('Compatibility data self-test: '+message);};
 const runs=fixture(),raw=JSON.stringify(runs),q=normalizeCompatibility013(runs,product);
 assert(eq(q.reference,q.comparison)&&JSON.stringify(runs)===raw&&q.metadataNormalization.normalizedFields===0,'same-label full equality without normalization');
 assert(eq(runs[0].result.map(w=>w.checkpoints.length),[6,6,6,6,7,7,7]),'explicit immutable historical checkpoint counts, never numeric seed ranges');
 assert(runs[0].result.slice(0,4).every(w=>w.checkpoints.every(p=>!Object.hasOwn(p,'enterprise'))),'old showcase/British/station worlds retain original observation fields');
 const rejects=(change,message)=>{const rows=fixture(),p={...product};change(rows,p);let rejected=false;try{normalizeCompatibility013(rows,p);}catch{rejected=true;}assert(rejected,message);};
 rejects((r,p)=>{p.release=true;},'unauthorized release rejected');rejects((r,p)=>{p.phase='release';},'release phase rejected');rejects((r,p)=>{p.version='14.30';},'future version rejected');rejects((r,p)=>{p.fpExact=false;},'unverified baseline rejected');rejects((r,p)=>{p.coldLoadFixExact=false;},'unverified cold fix rejected');
 for(const seed of[900721,900724,900725])for(const label of[0,1])for(const field of['version','anchor'])rejects(r=>{r[label].result.find(w=>w.seed===seed).checkpoints[6].enterprise[field]='bad';},'every old/new world metadata assertion retained');
 for(const i of[0,1,2,3])rejects(r=>{r[1].result[i].checkpoints.push(structuredClone(r[1].result[i].checkpoints[5]));},'original six-checkpoint world cannot silently expand to seven');
 rejects(r=>r[1].result.pop(),'seventh world required');rejects(r=>{r[1].result[6].seed=900724;},'duplicate world rejected');rejects(r=>r[1].result[5].checkpoints.pop(),'all old checkpoints retained');rejects(r=>{delete r[1].result[4].checkpoints[0].enterprise.anchor;},'missing old metadata rejected');
 rejects(r=>{r[1].result[6].nativeSave=JSON.stringify({v:1,n:72,gameVer:'14.28',df:1,day:4});},'native save metadata cannot normalize');
 for(const change of[
  r=>r[1].result[6].checkpoints[0].enterprise.money++,r=>{r[1].result[4].checkpoints[0].enterprise.other.unchanged=false;},
  r=>r[1].result[0].checkpoints[0].stats.money++,r=>r[1].result[1].checkpoints[0].rngState++,
  r=>{r[1].result[2].checkpoints[0].tilesSHA256+='changed';},r=>r[1].result[3].fixture.paid++,
  r=>{r[1].result[6].nativeSave=r[1].result[6].nativeSave.replace('true','false');},
  r=>{r[1].result[0].checkpoints[0].enterprise={version:'14.29',anchor:'T725'};}
 ]){const r=fixture();change(r);const before=JSON.stringify(r),out=normalizeCompatibility013(r,product);assert(!eq(out.reference,out.comparison)&&JSON.stringify(r)===before,'all non-label changes remain visible to full equality');}
 return{ok:true,sourceOnly:true,gameExecuted:false,cases,worlds:7,originalSixWorldsRetained:true,knownMetadataWorlds:[900721,900724,900725],declaredPaths:[...METADATA_PATHS013],normalizedFields:0,completeNativeSaveCompared:true,rawObservationsPreserved:true};
}
module.exports={fixtureSource013,runRiversideWorld013,normalizeCompatibility013,staticNormalizationTest013,METADATA_PATHS013,WORLD_SEEDS013};

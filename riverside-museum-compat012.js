'use strict';
// Additional full T724 museum compatibility world. This does not substitute for
// or change any of the historical showcase/British/station/street comparisons.
const fs=require('fs'),path=require('path'),vm=require('vm');
const fixed=require('./riverside-static-contract012'),ROOT=__dirname;
function fixtureSource012(){
 const slices=[];
 for(const[file,start,end]of[['streetlife-integration-qa009.js','function setupStreet009(','function snapshot009('],['museum-integration-qa010.js','function setupMuseum010(','function assets010(']]){
  const original=fs.readFileSync(path.join(ROOT,file),'utf8');if(original!==fixed.baseFile(file).toString())throw Error('Immutable paid fixture source changed: '+file);
  if(original.split(start).length!==2||original.split(end).length!==2)throw Error('Unique immutable museum comparison fixture boundaries required');
  const body=original.slice(original.indexOf(start),original.indexOf(end));new vm.Script(body);slices.push(body);
 }
 return slices.join('\n');
}
// Serialized only inside the isolated CI browser. Every tile, exposed statistic,
// economy value and RNG state is retained in the final equality comparison.
function runMuseumWorld012(setup,seedFn){
 const random=Math.random;let m=123456789;Math.random=()=>{m=(Math.imul(m,1664525)+1013904223)>>>0;return m/4294967296;};
 try{
  const q=setup(seedFn);GV.setSpeed(0);GV.ai(false);GV.weather(0);
  if(q.difficulty!==1||q.developer.sandbox||q.developer.god||q.retained.length!==47||q.roots.length!==1||q.roots[0].k!==277||q.paths.length!==3||q.oldMuseums.length!==2||q.paid.some(p=>!p.exact||p.charged<=0))throw Error('Immutable paid T724 museum compatibility fixture invalid');
  const snap=()=>{
   const tiles=[];for(let y=0;y<q.N;y++)for(let x=0;x<q.N;x++)tiles.push(GV.tile(x,y));
   if(tiles.some(t=>[278,279,280].includes(t.bld?.k)||t.amx502?.british012))throw Error('Riverside identity leaked into the historical museum world');
   const roots=q.roots.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,evidence:GV.museumAt010(r.x,r.y),cells:Array.from({length:r.sz*r.sz},(_,i)=>GV.tile(r.x+i%r.sz,r.y+Math.floor(i/r.sz)).bld)}));
   const paths=q.paths.map(p=>({...p,tile:GV.tile(p.x,p.y),evidence:GV.museumAt010(p.x,p.y)})),retained=q.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld})),oldMuseums=q.oldMuseums.map(r=>({...r,bld:GV.tile(r.x,r.y).bld}));
   if(roots.some(r=>r.bld?.k!==277||r.bld.sz!==4)||paths.some(p=>p.evidence?.theme!==p.theme||p.evidence.am502!==1||p.evidence.baseWalkCost!==.72)||retained.some(r=>r.bld?.k!==r.k)||oldMuseums.some(r=>r.bld?.k!==r.k))throw Error('Historical museum world identity changed');
   const rngState=window.__qaSeedState007();if(rngState!==window.__qaSeedState007())throw Error('Museum RNG observation consumed state');
   return{stats:GV.stats(),tiles,rngState,difficulty:GV.diff(),developer:GV.dev516B(),roots,paths,retained,oldMuseums,street:window.__streetQA009.roots.map(r=>GV.streetLifeAt009(r.x,r.y)),hotel:GV.hotel330(),enterprise:GV.t489()};
  };
  const checkpoints=[{offset:0,...snap()}];let offset=0;for(const days of[1,4,4,11]){GV.step(days);offset+=days;checkpoints.push({offset,...snap()});}
  const beforeLoad=checkpoints.at(-1),storage=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
  GV.save();if(!GV.load())throw Error('Historical museum native slot3 save/load failed');const loaded=snap();
  const identities=rows=>rows.map(r=>({k:r.k,x:r.x,y:r.y,cells:r.cells.map(b=>b?{k:b.k,ref:b.ref,age:b.age,sz:b.sz,v:b.v,lv:b.lv}:null)}));
  if(JSON.stringify(identities(beforeLoad.roots))!==JSON.stringify(identities(loaded.roots))||beforeLoad.paths.some((p,i)=>JSON.stringify(p.tile.amx502)!==JSON.stringify(loaded.paths[i].tile.amx502)||p.tile.am502!==loaded.paths[i].tile.am502))throw Error('Historical museum native load changed footprint/orientation/path metadata');
  checkpoints.push({offset:'native-load',...loaded,loaded:true});GV.step(1);checkpoints.push({offset:21,...snap(),followingLoadedDay:true});
  const after=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])),allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');
  if([...new Set([...Object.keys(storage),...Object.keys(after)])].some(k=>!allowed(k)&&storage[k]!==after[k]))throw Error('Museum comparison modified another save slot');
  return{fixture:{seed:900721,N:q.N,paid:q.paid,terrain:q.terrain,roots:q.roots,paths:q.paths,oldMuseums:q.oldMuseums,retained:q.retained,placementDay:q.placementDay},checkpoints,nativeLoadIdentitiesExact:true,otherSlotsUnchanged:true};
 }finally{Math.random=random;}
}
module.exports={fixtureSource012,runMuseumWorld012};

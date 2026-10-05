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
// Source/data-only normalization. Raw baseline and candidate observations are
// never mutated; exactly two exposed enterprise labels in each of the two
// historical seven-checkpoint worlds may change on the approved T725 release.
const WORLD_SEEDS012=Object.freeze([5162026,5162027,7006719,800721,900721,900724]);
const METADATA_PATHS012=Object.freeze([900721,900724].flatMap(seed=>['version','anchor'].map(field=>'seed'+seed+'.checkpoints[*].enterprise.'+field)));
function normalizeCompatibility012(runs,product){
 const candidate=product?.release===false&&product.phase==='candidate'&&product.version==='14.28'&&product.anchor==='T724',release=product?.release===true&&product.phase==='release'&&product.version==='14.29'&&product.anchor==='T725';
 if(!product?.ok||!product.htmlExact||!product.protectedExact||!product.fpExact||!product.logExact||!(candidate||release))throw Error('Exact source-verified T724 candidate or T725 release required for metadata normalization');
 if(!Array.isArray(runs)||runs.length!==2||runs[0].label!=='baseline'||runs[1].label!=='candidate')throw Error('Exactly ordered baseline/candidate raw observations required');
 const raw=JSON.stringify(runs),reference=runs[0].result,comparison=structuredClone(runs[1].result),changes=[];
 for(const [label,rows]of[['baseline',reference],['candidate',comparison]]){
  if(!Array.isArray(rows)||JSON.stringify(rows.map(q=>q.seed))!==JSON.stringify(WORLD_SEEDS012)||rows.some(q=>!Array.isArray(q.checkpoints)||q.checkpoints.length!==(q.seed===900721||q.seed===900724?7:6)))throw Error('Exactly six complete historical compatibility worlds required');
  const version=label==='candidate'?product.version:'14.28',anchor=label==='candidate'?product.anchor:'T724';
  for(const seed of[900721,900724]){
   const world=rows.find(q=>q.seed===seed);
   for(const [index,q]of world.checkpoints.entries()){
    if(!q.enterprise||!Object.hasOwn(q.enterprise,'version')||!Object.hasOwn(q.enterprise,'anchor')||q.enterprise.version!==version||q.enterprise.anchor!==anchor)throw Error('Unexpected native enterprise metadata at seed'+seed+'.checkpoints['+index+']');
    if(label==='candidate'&&release)for(const [field,value]of[['version','14.28'],['anchor','T724']]){changes.push({path:'seed'+seed+'.checkpoints['+index+'].enterprise.'+field,from:q.enterprise[field],to:value});q.enterprise[field]=value;}
   }
  }
 }
 if(JSON.stringify(runs)!==raw||changes.length!==(release?28:0))throw Error('Only28 declared label fields may normalize; raw observations must remain unchanged');
 return{reference,comparison,metadataNormalization:{applied:release,paths:release?[...METADATA_PATHS012]:[],from:{version:product.version,anchor:product.anchor},to:{version:'14.28',anchor:'T724'},rawObservationsPreserved:true,sameLabelExact:candidate,normalizedFields:changes.length,changes}};
}
function staticNormalizationTest012(){
 const product=release=>({ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,release,phase:release?'release':'candidate',version:release?'14.29':'14.28',anchor:release?'T725':'T724'});
 const fixture=release=>['baseline','candidate'].map(label=>({label,result:WORLD_SEEDS012.map(seed=>({seed,fixture:{paid:100},checkpoints:Array.from({length:seed===900721||seed===900724?7:6},(_,index)=>({stats:{day:index,money:100-index},tilesSHA256:'complete-tile-digest-'+index,rngState:42+index,...(seed===900721||seed===900724?{enterprise:{version:release&&label==='candidate'?'14.29':'14.28',anchor:release&&label==='candidate'?'T725':'T724',money:100-index,other:{unchanged:true}}}:{})}))}))}));
 let cases=0;const assert=(ok,message)=>{cases++;if(!ok)throw Error('Metadata normalization data self-test: '+message);};
 for(const release of[false,true]){const runs=fixture(release),raw=JSON.stringify(runs),q=normalizeCompatibility012(runs,product(release));assert(JSON.stringify(q.reference)===JSON.stringify(q.comparison),'valid exact label-only comparison');assert(JSON.stringify(runs)===raw&&q.metadataNormalization.normalizedFields===(release?28:0),'raw observations retained');}
 const rejects=(change,message)=>{const runs=fixture(true),proof=product(true);change(runs,proof);let rejected=false;try{normalizeCompatibility012(runs,proof);}catch{rejected=true;}assert(rejected,message);};
 rejects((runs,p)=>{p.version='14.30';},'future version rejected');
 rejects((runs,p)=>{p.phase='candidate';},'mixed release phase rejected');
 rejects((runs,p)=>{p.fpExact=false;},'unverified promotion rejected');
 rejects(runs=>{runs[0].result[4].checkpoints[0].enterprise.anchor='T723';},'baseline metadata mismatch rejected');
 rejects(runs=>{runs[1].result[5].checkpoints[6].enterprise.version='14.28';},'candidate museum metadata mismatch rejected');
 rejects(runs=>{delete runs[1].result[4].checkpoints[0].enterprise.anchor;},'missing known label path rejected');
 rejects(runs=>{runs[1].result.pop();},'missing sixth world rejected');
 rejects(runs=>{runs[1].result[5].seed=900721;},'duplicate metadata world rejected');
 rejects(runs=>{runs[1].result[4].checkpoints.pop();},'missing checkpoint rejected');
 for(const change of[
  runs=>{runs[1].result[5].checkpoints[0].enterprise.money++;},
  runs=>{runs[1].result[4].checkpoints[0].enterprise.other.unchanged=false;},
  runs=>{runs[1].result[0].checkpoints[0].stats.money++;},
  runs=>{runs[1].result[1].checkpoints[0].rngState++;},
  runs=>{runs[1].result[2].checkpoints[0].tilesSHA256+='changed';},
  runs=>{runs[1].result[3].fixture.paid++;},
  runs=>{runs[1].result[0].checkpoints[0].enterprise={version:'14.29',anchor:'T725'};}
 ]){const runs=fixture(true);change(runs);const raw=JSON.stringify(runs),q=normalizeCompatibility012(runs,product(true));assert(JSON.stringify(q.reference)!==JSON.stringify(q.comparison)&&JSON.stringify(runs)===raw,'non-label change remains visible to complete JSON equality');}
 return{ok:true,sourceOnly:true,gameExecuted:false,cases,worlds:6,knownMetadataWorlds:[900721,900724],declaredPaths:[...METADATA_PATHS012],releaseNormalizedFields:28,rawObservationsPreserved:true};
}
module.exports={fixtureSource012,runMuseumWorld012,normalizeCompatibility012,staticNormalizationTest012,METADATA_PATHS012};

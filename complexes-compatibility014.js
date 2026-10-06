'use strict';
// The eight historical worlds retain every old assertion. Only the new eighth
// world is added here. Current014 has the same T726 labels: ZERO normalization.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./complexes-static-contract014'),ROOT=__dirname;
const previous=require('./theatre-compatibility013');
const WORLD_SEEDS014=Object.freeze([...previous.WORLD_SEEDS013,900726]);
const CHECKPOINT_COUNTS014=Object.freeze([6,6,6,6,7,7,7,9]);
const METADATA_PATHS014=Object.freeze([900721,900724,900725,900726].flatMap(seed=>['version','anchor'].map(field=>'seed'+seed+'.checkpoints[*].enterprise.'+field)));
const SAVE_PATHS014=Object.freeze(['seed900725.nativeSave','seed900726.nativeSave','seed900726.continueSave'].flatMap(p=>[p+'.gameVer',p+'.region.ver']));
function fixtureSource014(){
 const source=fs.readFileSync(path.join(ROOT,'theatre-gameplay013.js'),'utf8');
 if(source!==fixed.baseFile('theatre-gameplay013.js').toString())throw Error('Immutable complete theatre paid fixtures required');
 const theatre=require('./theatre-gameplay013'),names=['bindObservation013','setupTheatre013','snapshot013','identity013'];
 const parts=names.map(name=>{const rows=theatre.functions013.filter(f=>f.name===name);if(rows.length!==1||source.split(rows[0].toString()).length!==2)throw Error('Unique exact theatre fixture body required: '+name);return rows[0].toString();});
 const text=theatre.legacyFixtures013().source+'\n'+parts.join('\n');new vm.Script(text);return text;
}
// Serialized only to disposable isolated Actions browsers. Observation never
// dispatches/rebuilds/ensures a network or rewrites any native save bytes.
function snapshotTheatreWorld014(q){
 const tiles=[];for(let y=0;y<q.N;y++)for(let x=0;x<q.N;x++)tiles.push(GV.tile(x,y));
 if(tiles.some(t=>(t.bld?.k>=282&&t.bld.k<=293)||t.amx502?.british014))throw Error('New complex identity leaked into old-only T726 theatre world');
 const roots=q.roots.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,evidence:GV.theatreAt013(r.x,r.y),cells:Array.from({length:r.sz*r.sz},(_,i)=>GV.tile(r.x+i%r.sz,r.y+Math.floor(i/r.sz)).bld)}));
 const paths=q.pathPlacements.map(p=>({...p,tile:GV.tile(p.x,p.y),evidence:GV.theatreAt013(p.x,p.y)})),retained=q.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld}));
 const water=q.waterCells.map(p=>({x:p.x,y:p.y,terrain:GV.tile(p.x,p.y).t})),shoreline=q.shoreline.map(p=>({...p,land:GV.tile(p.x,p.y).t,water:GV.tile(p.x,p.y+1).t}));
 if(roots.length!==1||roots[0].k!==281||roots[0].sz!==3||roots.some(r=>r.bld?.k!==r.k||(r.bld.sz||1)!==r.sz||r.cells.length!==9||r.cells.slice(1).some(b=>!b?.ref||b.ref[0]!==r.x||b.ref[1]!==r.y))||paths.length!==6||new Set(paths.map(p=>p.theme)).size!==6||paths.some(p=>p.evidence?.theme!==p.theme||p.evidence.am502!==1||p.evidence.baseWalkCost!==.72)||retained.length!==47||retained.some(r=>r.bld?.k!==r.k)||water.length!==70||water.some(p=>p.terrain!==0)||shoreline.length!==13||shoreline.some(p=>p.land===0||p.water!==0))throw Error('Full T726 roots/references/paths/old identities/water changed');
 const rngState=window.__qaSeedState007();if(rngState!==window.__qaSeedState007())throw Error('Theatre RNG observation consumed state');
 return{stats:GV.stats(),tiles,rngState,difficulty:GV.diff(),developer:GV.dev516B(),roots,paths,retained,water,shoreline,identity:identity013(),nativeCivic:GV.theatreEvidence013().civic,nativeMobility:GV.theatreEvidence013().mobility,priorStreet:q.priorStreet.map(r=>GV.streetLifeAt009(r.x,r.y)),priorMuseum:q.priorMuseum.map(r=>GV.museumAt010(r.x,r.y)),priorRiverside:q.priorRiverside.map(r=>GV.riversideAt012(r.x,r.y)),retailUnits:GV.riversideEvidence012().retailUnits,taxLedger:GV.riversideEvidence012().taxLedger,stations:q.stations.map(p=>GV.stationDistrictAt008(...p)),hotel:GV.hotel330(),enterprise:GV.t489()};
}
function runTheatreWorld014(setup,seedFn,version,anchor){
 if(version!=='14.30'||anchor!=='T726')throw Error('Exact source-verified T726 candidate labels required');
 const random=Math.random;let m=123456789;Math.random=()=>{m=(Math.imul(m,1664525)+1013904223)>>>0;return m/4294967296;};
 try{
  const placed=setup(seedFn),q=placed.recipe;GV.setSpeed(0);GV.ai(false);GV.weather(0);
  if(placed.difficulty!==1||placed.developer.sandbox||placed.developer.god||placed.paid.some(p=>!p.exact||p.charged<=0)||placed.roots.length!==1||placed.roots[0].k!==281||placed.initial.roots[0].age!==0||placed.paths.length!==6||placed.priorRiverside.length!==3)throw Error('Immutable complete paid T726 theatre fixture invalid');
  const checkpoints=[{offset:0,...snapshotTheatreWorld014(q)}];let offset=0;
  for(const days of[1,4,4,11]){GV.step(days);offset+=days;checkpoints.push({offset,...snapshotTheatreWorld014(q)});}
  const beforeLoad=checkpoints.at(-1),storage=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
  GV.save();const raw=localStorage.getItem('glimmerville.v1.s3'),saved=JSON.parse(raw||'null');
  if(typeof raw!=='string'||raw.length<1000||saved?.v!==1||saved.n!==q.N||saved.gameVer!==version||saved.df!==1||saved.day!==beforeLoad.stats.day||!Array.isArray(saved.bl)||saved.bl.filter(b=>b[1]===281).length!==1||saved.bl.some(b=>b[1]>=282&&b[1]<=293))throw Error('Full native T726 theatre save metadata/identities changed');
  if(!GV.load())throw Error('Historical theatre native slot3 save/load failed');const loaded=snapshotTheatreWorld014(q);
  if(JSON.stringify(beforeLoad.identity)!==JSON.stringify(loaded.identity)||raw!==localStorage.getItem('glimmerville.v1.s3'))throw Error('Native theatre load changed full identity or raw save bytes');
  checkpoints.push({offset:'native-load',...loaded,loaded:true});GV.step(1);checkpoints.push({offset:21,...snapshotTheatreWorld014(q),followingLoadedDay:true});
  // Save the current live paused state immediately before real navigation.
  GV.save();const continueSave=localStorage.getItem('glimmerville.v1.s3');
  const after=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])),allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');
  if([...new Set([...Object.keys(storage),...Object.keys(after)])].some(k=>!allowed(k)&&storage[k]!==after[k]))throw Error('Theatre comparison modified another save slot');
  return{fixture:{seed:900726,N:q.N,paid:placed.paid,terrain:placed.terrain,recipe:q,roots:placed.roots,paths:placed.paths,pathPlacements:placed.pathPlacements,homes:placed.homes,retained:placed.retained,priorStreet:placed.priorStreet,priorMuseum:placed.priorMuseum,priorRiverside:placed.priorRiverside,stations:placed.stations,oldMuseums:placed.oldMuseums,placementDay:placed.placementDay},checkpoints,nativeSave:raw,continueSave,cosmeticState:m,nativeSaveMetadataExact:true,nativeLoadIdentitiesExact:true,otherSlotsUnchanged:true,storageBeforeContinue:after};
 }finally{Math.random=random;}
}
function continueTheatreWorld014(q,input,cosmeticState){
 const random=Math.random;let m=cosmeticState;Math.random=()=>{m=(Math.imul(m,1664525)+1013904223)>>>0;return m/4294967296;};
 try{
  if(localStorage.getItem('glimmerville.v1.s3')!==input.raw)throw Error('Whole-page navigation changed raw theatre save bytes');
  bindObservation013(q);const button=document.getElementById('bContinue');if(!button||getComputedStyle(button).display==='none')throw Error('Native Continue is missing');button.click();GV.setSpeed(0);GV.ai(false);
  const immediate=snapshotTheatreWorld014(q);
  if(JSON.stringify(immediate.identity)!==JSON.stringify(input.identity)||immediate.stats.day!==input.day||immediate.stats.money!==Math.round(input.money)||GV.diff()!==1||GV.dev516B().sandbox||GV.dev516B().god||window.__noColdLoadPower011)throw Error('Native Continue changed theatre root/reference/path/age/view/day');
  const unchanged=localStorage.getItem('glimmerville.v1.s3')===input.raw;if(!unchanged)throw Error('Native Continue changed raw theatre save bytes');
  GV.step(1);const following=snapshotTheatreWorld014(q);if(following.stats.day!==input.day+1)throw Error('One unaided ordinary day after Continue required');
  const storage=Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
  return{checkpoints:[{offset:'native-continue',...immediate,continued:true},{offset:22,...following,followingContinuedDay:true}],nativeContinueIdentitiesExact:true,continueSaveBytesExact:unchanged,storage};
 }finally{Math.random=random;}
}
async function runCompleteTheatreWorld014(cdp,seedFn,version,anchor){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Whole historical game only in isolated Actions');
 const expectedSourceSHA256=fixed.hash(fs.readFileSync(path.join(ROOT,'index.html')));
 const source=fixtureSource014()+'\n'+snapshotTheatreWorld014.toString();
 const result=await cdp.evalJs('(()=>{'+source+';return ('+runTheatreWorld014.toString()+')(setupTheatre013,('+seedFn.toString()+'),'+JSON.stringify(version)+','+JSON.stringify(anchor)+');})()');
 if(result.checkpoints.length!==7)throw Error('Complete original native theatre checkpoints required');
 const input={raw:result.continueSave,identity:result.checkpoints[6].identity,day:result.checkpoints[6].stats.day,money:result.checkpoints[6].stats.money};
 await cdp.send('Page.reload',{ignoreCache:true});
 if(!await require('./harness').waitFor(cdp,"!!window.__bootDone453&&!!window.GV&&getComputedStyle(document.getElementById('start')).display!=='none'",180000))throw Error('Real cold page did not reach native start menu');
 const before=await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')");if(before!==result.continueSave)throw Error('Exact raw save bytes must survive actual Page.reload');
 const servedSourceSHA256=await cdp.evalJs('(async()=>{const t=await fetch("index.html",{cache:"no-store"}).then(r=>r.text());const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,"0")).join("");})()');
 if(servedSourceSHA256!==expectedSourceSHA256)throw Error('Cold Continue must use the exact currently observed source bytes');
 const resumed=await cdp.evalJs('(()=>{'+source+';return ('+continueTheatreWorld014.toString()+')('+JSON.stringify(result.fixture.recipe)+','+JSON.stringify(input)+','+JSON.stringify(result.cosmeticState)+');})()');
 const allowed=k=>k==='glimmerville.v1.slot'||/^glimmerville\.v1\.s3(?:_|$)/.test(k)||k.includes('.viewRot');
 if([...new Set([...Object.keys(result.storageBeforeContinue),...Object.keys(resumed.storage)])].some(k=>!allowed(k)&&result.storageBeforeContinue[k]!==resumed.storage[k]))throw Error('Cold Continue changed another native save slot');
 const {storageBeforeContinue,cosmeticState,...out}=result;out.checkpoints.push(...resumed.checkpoints);
 return{...out,nativeContinueIdentitiesExact:resumed.nativeContinueIdentitiesExact,continueSaveBytesExact:resumed.continueSaveBytesExact,actualPageReload:true,reloadedSourceExact:true,followingContinueDay:true,otherSlotsUnchanged:true};
}
function validateNativeSave014(raw,version,N,day,label){
 const save=JSON.parse(raw||'null');
 if(typeof raw!=='string'||!save||save.v!==1||save.n!==N||save.df!==1||save.day!==day||save.gameVer!==version)throw Error('Complete exact native save metadata required: '+label);
 const marker='"gameVer":'+JSON.stringify(version),regionMarker='"region":'+JSON.stringify(save.region),regionVersion='"ver":'+JSON.stringify(version);
 if((raw.match(/"gameVer"\s*:/g)||[]).length!==1||raw.split(marker).length!==2)throw Error('Exactly one native root.gameVer byte span required: '+label);
 if(!save.region||save.region.ver!==version||!eq(Object.keys(save.region).sort(),['airports','food','ports','powerCap','stations','tourists','ver'])||(raw.match(/"region"\s*:/g)||[]).length!==1||(raw.match(/"ver"\s*:/g)||[]).length!==1||raw.split(regionMarker).length!==2||regionMarker.split(regionVersion).length!==2)throw Error('Exactly the native root.region.ver byte span required: '+label);
 return true;
}
function normalizeCompatibility014(runs,product){
 if(!product?.ok||!product.htmlExact||!product.protectedExact||!product.fpExact||!product.logExact||!product.coldLoadFixExact||product.release!==false||product.phase!=='candidate'||product.version!=='14.30'||product.anchor!=='T726')throw Error('Exact verified T726 candidate required; future release needs a separately approved exact envelope');
 if(!Array.isArray(runs)||runs.length!==2||runs[0].label!=='baseline'||runs[1].label!=='candidate')throw Error('Exactly ordered baseline/candidate raw observations required');
 const raw=JSON.stringify(runs),reference=runs[0].result,comparison=structuredClone(runs[1].result);
 for(const rows of[reference,comparison]){
  if(!Array.isArray(rows)||!eq(rows.map(q=>q.seed),WORLD_SEEDS014)||rows.some((q,i)=>!Array.isArray(q.checkpoints)||q.checkpoints.length!==CHECKPOINT_COUNTS014[i]))throw Error('Exactly eight complete ordered historical worlds/checkpoints required');
  for(const seed of[900721,900724,900725,900726])for(const[index,q]of rows.find(q=>q.seed===seed).checkpoints.entries())if(!q.enterprise||!Object.hasOwn(q.enterprise,'version')||!Object.hasOwn(q.enterprise,'anchor')||q.enterprise.version!=='14.30'||q.enterprise.anchor!=='T726')throw Error('Unexpected native enterprise metadata at seed'+seed+'.checkpoints['+index+']');
  for(const seed of[900725,900726]){
   const world=rows.find(q=>q.seed===seed);if(!world.nativeSaveMetadataExact||!world.nativeLoadIdentitiesExact||!world.otherSlotsUnchanged)throw Error('Complete native save/load/other-slot evidence required');
   validateNativeSave014(world.nativeSave,'14.30',world.fixture?.N,world.checkpoints[4].stats.day,'seed'+seed+'.nativeSave');
   if(seed===900726){
    if(!world.nativeContinueIdentitiesExact||!world.continueSaveBytesExact||!world.actualPageReload||!world.reloadedSourceExact||!world.followingContinueDay||world.checkpoints[7].continued!==true||world.checkpoints[8].followingContinuedDay!==true||world.checkpoints[7].stats.day!==world.checkpoints[6].stats.day||world.checkpoints[8].stats.day!==world.checkpoints[7].stats.day+1)throw Error('Actual whole-page native Continue and unaided following day required');
    validateNativeSave014(world.continueSave,'14.30',world.fixture?.N,world.checkpoints[6].stats.day,'seed900726.continueSave');
   }
  }
 }
 if(JSON.stringify(runs)!==raw)throw Error('Raw compatibility observations must remain unchanged');
 return{reference,comparison,metadataNormalization:{applied:false,paths:[],validatedPaths:[...METADATA_PATHS014,...SAVE_PATHS014],from:{version:'14.30',anchor:'T726'},to:{version:'14.30',anchor:'T726'},rawObservationsPreserved:true,sameLabelExact:true,normalizedFields:0,changes:[]}};
}
function runtimeSourceAudit014(){
 const oldFiles=['theatre-compatibility013.js','theatre-gameplay013.js','theatre-regression-adapter013.js','theatre-historical-bridge013.js'];
 const sources=oldFiles.map(file=>{const actual=fs.readFileSync(path.join(ROOT,file)),old=fixed.baseFile(file);if(!actual.equals(old))throw Error('Historical runtime source changed: '+file);return{file,sha256:fixed.hash(actual),exact:true};});
 const old=previous.runtimeSourceAudit013();fixtureSource014();for(const f of[snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014])new vm.Script('('+f.toString()+')');
 return{sources,previousRuntimeProof:old,allSevenPriorWorldFunctionsExact:true,eighthFixtureSourceSHA256:fixed.hash(fixtureSource014()),nativeSaveLabelPaths:['root.gameVer','root.region.ver'],noSaveReserialization:true,noGetterRepair:true};
}
function normalizationFixture014(){
 const save=day=>JSON.stringify({v:1,n:72,gameVer:'14.30',region:{stations:0,ports:0,airports:0,powerCap:1650,food:0,tourists:79,ver:'14.30'},df:1,day,allFields:{retained:true}});
 return['baseline','candidate'].map(label=>({label,result:WORLD_SEEDS014.map((seed,i)=>({seed,fixture:{N:72,paid:100},...(i>=6?{nativeSave:save(4),nativeSaveMetadataExact:true,nativeLoadIdentitiesExact:true,otherSlotsUnchanged:true}:{}),...(i===7?{continueSave:save(6),nativeContinueIdentitiesExact:true,continueSaveBytesExact:true,actualPageReload:true,reloadedSourceExact:true,followingContinueDay:true}:{}),checkpoints:Array.from({length:CHECKPOINT_COUNTS014[i]},(_,n)=>({stats:{day:i===7&&n>=7?n-1:n,money:100-n},tilesSHA256:'complete-'+n,rngState:42+n,...(i>=4?{enterprise:{version:'14.30',anchor:'T726',money:100-n,other:{unchanged:true}}}:{}),...(i===7&&n===7?{continued:true}:{}),...(i===7&&n===8?{followingContinuedDay:true}:{})}))}))}));
}
function staticNormalizationTest014(){
 const runtimeSource=runtimeSourceAudit014(),oldControls=previous.staticNormalizationTest013();
 const product={ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,release:false,phase:'candidate',version:'14.30',anchor:'T726'},negatives=[];
 const input=normalizationFixture014(),raw=JSON.stringify(input),positive=normalizeCompatibility014(input,product);
 if(!eq(positive.reference,positive.comparison)||JSON.stringify(positive.reference)!==JSON.stringify(positive.comparison)||JSON.stringify(input)!==raw||positive.metadataNormalization.normalizedFields!==0||positive.metadataNormalization.paths.length!==0)throw Error('Exact complete same-label candidate data required');
 const reject=(name,mutate)=>{const runs=normalizationFixture014(),p={...product};mutate(runs,p);const before=JSON.stringify(runs);let error='';try{const q=normalizeCompatibility014(runs,p);if(!eq(q.reference,q.comparison)||JSON.stringify(q.reference)!==JSON.stringify(q.comparison))error='full comparison rejects mutation';}catch(e){error=e.message;}if(!error||JSON.stringify(runs)!==before)throw Error('Compatibility negative accepted or observations mutated: '+name);negatives.push({name,error});};
 for(const field of['ok','htmlExact','protectedExact','fpExact','logExact','coldLoadFixExact'])reject('unverified '+field,(_,p)=>p[field]=false);
 for(const[field,value]of[['release',true],['phase','release'],['version','14.31'],['anchor','T727']])reject('future/unapproved '+field,(_,p)=>p[field]=value);
 reject('reordered comparison',r=>r.reverse());reject('missing eighth world',r=>r[1].result.pop());reject('duplicate world',r=>r[1].result[7].seed=900725);reject('extra old checkpoint',r=>r[1].result[0].checkpoints.push({}));
 for(const seed of[900721,900724,900725,900726])for(const side of[0,1])for(const field of['version','anchor'])reject('wrong enterprise '+seed+'/'+side+'/'+field,r=>r[side].result.find(w=>w.seed===seed).checkpoints.at(-1).enterprise[field]='bad');
 for(const[seed,field]of[[900725,'nativeSave'],[900726,'nativeSave'],[900726,'continueSave']])for(const[name,mutate]of[
  ['duplicate gameVer',s=>s.replace('"v":1','"gameVer":"14.30","v":1')],['nested gameVer',s=>s.replace('"retained":true','"retained":true,"gameVer":"14.30"')],['duplicate region',s=>s.replace('"v":1','"region":{},"v":1')],['duplicate region ver',s=>s.replace('"stations":0','"ver":"14.30","stations":0')],['nested unrelated ver',s=>s.replace('"retained":true','"retained":true,"nested":{"ver":"14.30"}')],['wrong ver',s=>s.replace('"ver":"14.30"','"ver":"14.31"')],['nonlabel data',s=>s.replace('"tourists":79','"tourists":80')],['key order',s=>s.replace('"stations":0,"ports":0','"ports":0,"stations":0')],['whitespace',s=>s.replace('"df":1','"df": 1')],['unrelated string label',s=>s.replace('"retained":true','"retained":true,"unrelated":"14.31"')],['missing field',s=>s.replace(',"ver":"14.30"','')],['extra field',s=>s.replace('"retained":true','"retained":true,"extra":1')]
 ])reject(seed+'/'+field+'/'+name,r=>{const w=r[1].result.find(w=>w.seed===seed),old=w[field];w[field]=mutate(old);if(old===w[field])throw Error('Negative fixture did not mutate');});
 for(let i=0;i<8;i++)for(const field of['money','rngState','tilesSHA256'])reject('world'+i+' full '+field,r=>{const q=r[1].result[i].checkpoints[0];if(field==='money')q.stats.money++;else q[field]+='changed';});
 for(const flag of['nativeContinueIdentitiesExact','continueSaveBytesExact','actualPageReload','reloadedSourceExact','followingContinueDay','otherSlotsUnchanged'])reject('missing '+flag,r=>r[1].result[7][flag]=false);
 reject('no following continued day',r=>r[1].result[7].checkpoints[8].stats.day--);
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticDataOnly:true,worlds:8,originalSevenWorldsRetained:true,oldControls,runtimeSource,checkpointCounts:CHECKPOINT_COUNTS014,declaredPaths:[...METADATA_PATHS014,...SAVE_PATHS014],candidateNormalizedFields:0,futureReleaseRejected:true,completeNativeSaveCompared:true,actualContinueCompared:true,rawObservationsPreserved:true,cases:1+negatives.length,negatives};
}
module.exports={fixtureSource014,snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014,runCompleteTheatreWorld014,normalizeCompatibility014,validateNativeSave014,runtimeSourceAudit014,staticNormalizationTest014,normalizationFixture014,WORLD_SEEDS014,CHECKPOINT_COUNTS014,METADATA_PATHS014,SAVE_PATHS014};

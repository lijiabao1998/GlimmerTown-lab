'use strict';
// The eight historical worlds retain every old assertion. Only the new eighth
// world is added here. Candidate T726 labels require ZERO normalization; only
// the verified approved T727 envelope permits the declared release label spans.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./complexes-static-contract014'),ROOT=__dirname;
const previous=require('./theatre-compatibility013');
const WORLD_SEEDS014=Object.freeze([...previous.WORLD_SEEDS013,900726]);
const CHECKPOINT_COUNTS014=Object.freeze([6,6,6,6,7,7,7,9]);
const METADATA_PATHS014=Object.freeze([900721,900724,900725,900726].flatMap(seed=>['version','anchor'].map(field=>'seed'+seed+'.checkpoints[*].enterprise.'+field)));
const SAVE_PATHS014=Object.freeze(['seed900725.nativeSave','seed900726.nativeSave','seed900726.continueSave'].flatMap(p=>[p+'.gameVer',p+'.region.ver']));
const RIVERSIDE_GATE014=Object.freeze({
 before:"if(!((version==='14.29'&&anchor==='T725')||(version==='14.30'&&anchor==='T726')))throw Error('Exact verified candidate or approved release labels required');",
 after:"if(!((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727')))throw Error('Exact source-verified T726 baseline or approved T727 release labels required');",
 originalFunctionSHA256:'756b186cb80e09a0e5922d311c80813965e1c5f3f7d53694013f87e82dfaa519',
 originalFileSHA256:'3d493363666d8b7ca2caaeb41500395a9ec486e86635929b7eb52148d022659c'
});
function adaptRiversideRuntime014(original){
 const {before,after,originalFunctionSHA256}=RIVERSIDE_GATE014;
 if(typeof original!=='string'||fixed.hash(original)!==originalFunctionSHA256||original.split(before).length!==2)throw Error('Exact immutable seventh-world function and unique original label gate required');
 const source=original.replace(before,after);
 if(source.split(after).length!==2||source.replace(after,before)!==original)throw Error('Only one reversible seventh-world version/anchor gate replacement is allowed');
 new vm.Script('('+source+')');return source;
}
// Return source only. The original historical file and every observation,
// simulation, RNG, save/load and storage assertion remain byte-for-byte exact.
function riversideRuntimeSource014(){
 const file='theatre-compatibility013.js',actual=fs.readFileSync(path.join(ROOT,file)),baseline=fixed.baseFile(file),original=previous.runRiversideWorld013.toString();
 if(!actual.equals(baseline)||fixed.hash(actual)!==RIVERSIDE_GATE014.originalFileSHA256||actual.toString().split(original).length!==2)throw Error('Complete tracked pre014 riverside runtime source must remain immutable and contain its unique original function');
 return adaptRiversideRuntime014(original);
}
function riversideRuntimeAudit014(){
 const source=riversideRuntimeSource014(),original=source.replace(RIVERSIDE_GATE014.after,RIVERSIDE_GATE014.before);
 return{ok:true,sourceOnly:true,gameExecuted:false,base:fixed.BASE,file:'theatre-compatibility013.js',originalFileSHA256:RIVERSIDE_GATE014.originalFileSHA256,originalFunctionSHA256:fixed.hash(original),adaptedFunctionSHA256:fixed.hash(source),originalLabels:[{version:'14.29',anchor:'T725'},{version:'14.30',anchor:'T726'}],adaptedLabels:[{version:'14.30',anchor:'T726'},{version:'14.31',anchor:'T727'}],exactReplacedGuards:1,originalFileUnchanged:true,originalFunctionUnique:true,allNonLabelRuntimeBytesExact:true,reverseExact:true,syntaxParsed:true};
}
function staticRiversideRuntimeTest014(){
 const source=riversideRuntimeSource014(),original=previous.runRiversideWorld013.toString(),proof=riversideRuntimeAudit014(),gate=text=>text.split('\n')[1].trim(),checks=[];
 if(gate(original)!==RIVERSIDE_GATE014.before||gate(source)!==RIVERSIDE_GATE014.after)throw Error('Only the known leading label predicate may be evaluated by source/data tests');
 // Evaluate isolated label predicates only; never instantiate a game function.
 const predicates=[original,source].map(text=>new vm.Script('(function(version,anchor){'+gate(text)+';return true;})').runInNewContext());
 for(const[side,predicate]of predicates.entries())for(const version of['14.29','14.30','14.31','14.32',undefined,null,14.31])for(const anchor of['T725','T726','T727','T728',undefined,null]){
  const expected=side===0?(version==='14.29'&&anchor==='T725')||(version==='14.30'&&anchor==='T726'):(version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727');
  let accepted=false;try{accepted=predicate(version,anchor)===true;}catch{}
  if(accepted!==expected)throw Error('Seventh-world source label gate accepted or rejected the wrong exact pair');
  checks.push({source:side===0?'original':'adapted',version:String(version),anchor:String(anchor),accepted});
 }
 const rejected=[],reject=(name,text)=>{let failed=false;try{adaptRiversideRuntime014(text);}catch{failed=true;}if(!failed)throw Error('Seventh-world nonlabel mutation accepted: '+name);rejected.push(name);};
 for(const[name,from,to]of[
  ['simulation day stepping','GV.step(days)','GV.step(days+1)'],['native save execution','GV.save();','GV.save();GV.save();'],['RNG restoration','Math.random=random','Math.random=()=>0'],['native save version assertion','saved.gameVer!==version','false'],['other-slot assertion','storage[k]!==after[k]','false'],['full tile observation','tiles,rngState,difficulty','tiles:[],rngState,difficulty'],['native load checkpoint',"offset:'native-load'","offset:'changed-load'"]
 ]){
  if(original.split(from).length!==2||source.split(from).length!==2)throw Error('Source mutation fixture must target exactly one original statement: '+name);
  reject('original '+name,original.replace(from,to));
  reject('adapted nonlabel bytes cannot reverse: '+name,source.replace(from,to).replace(RIVERSIDE_GATE014.after,RIVERSIDE_GATE014.before));
 }
 reject('missing original gate',original.replace(RIVERSIDE_GATE014.before,''));
 reject('duplicate original gate',original.replace(RIVERSIDE_GATE014.before,RIVERSIDE_GATE014.before+'\n '+RIVERSIDE_GATE014.before));
 reject('undeclared original label',original.replace("version==='14.29'","version==='14.28'"));
 reject('trailing nonlabel bytes',original+'\n');
 return{...proof,syntheticDataOnly:true,isolatedLabelPredicateOnly:true,gameFunctionExecuted:false,cases:checks.length+rejected.length,labelCases:checks.length,negativeSourceCases:rejected.length,originalRejectsT727:true,adaptedAcceptsExactT726AndT727:true,mixedOldFutureLabelsRejected:true,checks,rejected};
}
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
 if(!((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727')))throw Error('Exact source-verified T726 candidate or approved T727 release labels required');
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
// T491 wall-clock durations are diagnostic measurements, not world state.
// Exactly six active checkpoints expose three timing fields each. Preserve the
// complete raw eighth world and a reversible18-path witness outside comparison.
const TIMING_CHECKPOINTS014=Object.freeze([1,2,3,4,6,8]);
const TIMING_FIELDS014=Object.freeze(['lastMs','avgMs','maxMs']);
const TIMING_OFFSETS014=Object.freeze([0,1,5,9,20,'native-load',21,'native-continue',22]);
const TIMING_RUNS014=Object.freeze([0,1,5,9,20,0,1,0,1]);
function timingProducer014(){
 const snippets=[
  "function perfNow490(){return typeof performance!=='undefined'&&performance&&typeof performance.now==='function'?performance.now():Date.now();}",
  'const perfStart491=perfNow490();',
  'const elapsed491=Math.max(0,perfNow490()-perfStart491);mobilityPerf491.runs++;mobilityPerf491.lastMs=+elapsed491.toFixed(3);mobilityPerf491.avgMs=+(mobilityPerf491.avgMs+(elapsed491-mobilityPerf491.avgMs)/Math.min(120,mobilityPerf491.runs)).toFixed(3);mobilityPerf491.maxMs=+Math.max(mobilityPerf491.maxMs,elapsed491).toFixed(3);',
  'odMeta:JSON.parse(JSON.stringify(mobilityODMeta491)),performance:{...mobilityPerf491},policies:{completeStreets:!!pol?.completeStreets,parkingManagement:!!pol?.parkingManagement},saveSchemaChanged:false}',
  'function mobilitySnapshot491(){return JSON.parse(JSON.stringify(mobility491));}'
 ];
 const old=fixed.baseFile('index.html').toString(),current=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
 for(const text of snippets)if(old.split(text).length!==2||current.split(text).length!==2)throw Error('Exact immutable native T491 clock producer required');
 return{base:fixed.BASE,sourceSHA256:fixed.hash(snippets.join('\n')),snippets:snippets.map(text=>({sha256:fixed.hash(text),bytes:Buffer.byteLength(text)})),clock:'Native performance.now(), with original Date.now() fallback',producerExact:true};
}
function validateTimingShape014(world,separated){
 if(world?.seed!==900726||!Array.isArray(world.checkpoints)||world.checkpoints.length!==9||!eq(world.checkpoints.map(q=>q.offset),TIMING_OFFSETS014))throw Error('Exactly nine declared theatre checkpoints required for clock evidence');
 for(const [index,q]of world.checkpoints.entries()){
  const perf=q.nativeMobility?.performance,active=TIMING_CHECKPOINTS014.includes(index),keys=separated&&active?['runs']:['runs',...TIMING_FIELDS014];
  if(!perf||Array.isArray(perf)||!eq(Object.keys(perf),keys)||perf.runs!==TIMING_RUNS014[index])throw Error('Exact native mobility counter and timing field inventory required at checkpoint'+index);
  for(const field of TIMING_FIELDS014)if(!(separated&&active)&&(typeof perf[field]!=='number'||!Number.isFinite(perf[field])||perf[field]<0||(!active&&perf[field]!==0)))throw Error('Finite nonnegative native timing, with unchanged zero-work clocks required');
 }
 return true;
}
function separateTheatreTiming014(rawWorld){
 validateTimingShape014(rawWorld,false);const before=JSON.stringify(rawWorld),world=structuredClone(rawWorld),paths=[];
 for(const index of TIMING_CHECKPOINTS014)for(const field of TIMING_FIELDS014){
  const path='seed900726.checkpoints['+index+'].nativeMobility.performance.'+field,value=world.checkpoints[index].nativeMobility.performance[field];paths.push({path,checkpoint:index,field,value});delete world.checkpoints[index].nativeMobility.performance[field];
 }
 validateTimingShape014(world,true);const restored=structuredClone(world);
 for(const {checkpoint,field,value}of paths)restored.checkpoints[checkpoint].nativeMobility.performance[field]=value;
 if(paths.length!==18||JSON.stringify(restored)!==before||JSON.stringify(rawWorld)!==before)throw Error('Only18 declared wall-clock paths may separate, with complete raw round-trip equality');
 return{world,evidence:{seed:900726,rawWorld:structuredClone(rawWorld),paths,rawWorldSHA256:fixed.hash(before),comparisonWorldSHA256:fixed.hash(JSON.stringify(world)),producer:timingProducer014(),separatedFields:18,exactActiveCheckpoints:[...TIMING_CHECKPOINTS014],allSimulationFieldsRetained:true,rawRoundTripExact:true,normalizationApplied:false,performanceThresholdsChanged:false}};
}
function validateTimingEvidence014(input){
 const before=JSON.stringify(input),records=input?.theatreTimingEvidence014;
 if(!Array.isArray(records)||records.length!==2||!eq(records.map(r=>r.label),['baseline','candidate']))throw Error('Exactly ordered baseline/candidate raw clock receipts required');
 if(!Array.isArray(input.runs)||input.runs.length!==2||!eq(input.runs.map(r=>r.label),['baseline','candidate']))throw Error('Exact raw timing comparison pairing required');
 for(const[index,record]of records.entries()){
  const {label,...evidence}=record,actual=separateTheatreTiming014(evidence.rawWorld),rows=input.runs[index].result;
  if(!eq(evidence,actual.evidence)||JSON.stringify(evidence)!==JSON.stringify(actual.evidence)||!Array.isArray(rows)||rows.filter(w=>w.seed===900726).length!==1||JSON.stringify(rows.find(w=>w.seed===900726))!==JSON.stringify(actual.world))throw Error('Raw clock values, exact18 paths, complete raw hash and deterministic world must match');
 }
 if(JSON.stringify(input)!==before)throw Error('Raw clock evidence must never mutate');
 return{ok:true,worlds:2,separatedPerWorld:18,activeCheckpoints:[...TIMING_CHECKPOINTS014],rawWorldsRetained:true,rawRoundTripExact:true,producer:timingProducer014(),allSimulationFieldsRetained:true,performanceThresholdsChanged:false};
}
function staticTimingTest014(){
 const product={ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,release:false,phase:'candidate',version:'14.30',anchor:'T726'};
 const raw=normalizationFixture014()[0].result[7];
 for(const index of TIMING_CHECKPOINTS014)Object.assign(raw.checkpoints[index].nativeMobility.performance,{lastMs:10+index,avgMs:9+index,maxMs:20+index});
 const source=JSON.stringify(raw),split=separateTheatreTiming014(raw),candidate=structuredClone(raw);for(const index of TIMING_CHECKPOINTS014)for(const field of TIMING_FIELDS014)candidate.checkpoints[index].nativeMobility.performance[field]+=3;
 const other=separateTheatreTiming014(candidate);if(JSON.stringify(split.world)!==JSON.stringify(other.world)||JSON.stringify(raw)!==source)throw Error('Only actual clock durations may differ');
 const receipt={runs:normalizationFixture014(),theatreTimingEvidence014:[{label:'baseline',...split.evidence},{label:'candidate',...other.evidence}]};receipt.runs[0].result[7]=split.world;receipt.runs[1].result[7]=other.world;validateTimingEvidence014(receipt);
 const rejected=[];const reject=(name,mutate)=>{const q=structuredClone(raw);mutate(q);let failed=false;try{const projected=separateTheatreTiming014(q);failed=JSON.stringify(projected.world)!==JSON.stringify(split.world);}catch{failed=true;}if(!failed)throw Error('Clock separation hid mutation: '+name);rejected.push(name);};
 for(const index of TIMING_CHECKPOINTS014)for(const field of TIMING_FIELDS014){reject('missing '+index+'/'+field,q=>delete q.checkpoints[index].nativeMobility.performance[field]);for(const value of[-1,NaN,Infinity,'12',null])reject('invalid '+index+'/'+field+'/'+String(value),q=>q.checkpoints[index].nativeMobility.performance[field]=value);}
 for(const index of[0,5,7])reject('undeclared inactive clock '+index,q=>q.checkpoints[index].nativeMobility.performance.lastMs=1);
 for(const index of[0,1,2,3,4,5,6,7,8])reject('simulation execution counter '+index,q=>q.checkpoints[index].nativeMobility.performance.runs++);
 for(const[name,mutate]of[
  ['missing checkpoint',q=>q.checkpoints.pop()],['duplicate checkpoint',q=>q.checkpoints[8]=structuredClone(q.checkpoints[6])],['extra timing field',q=>q.checkpoints[1].nativeMobility.performance.otherMs=1],['nested timing object',q=>q.checkpoints[1].nativeMobility.performance.nested={lastMs:12}],
  ['income changes',q=>q.checkpoints[1].stats.money++],['power changes',q=>q.checkpoints[1].stats.poweredBld++],['RNG changes',q=>q.checkpoints[1].rngState++],['complete tile changes',q=>q.checkpoints[1].tilesSHA256+='changed'],['mobility changes',q=>q.checkpoints[1].nativeMobility.totalTrips++],['unrelated clock-like field',q=>q.checkpoints[1].unrelated={lastMs:12}],['root save bytes',q=>q.nativeSave+=' '],['Continue save bytes',q=>q.continueSave+=' ']
 ])reject(name,mutate);
 for(const[name,mutate]of[['missing clock receipt',q=>q.theatreTimingEvidence014.pop()],['extra receipt',q=>q.theatreTimingEvidence014.push(q.theatreTimingEvidence014[0])],['wrong receipt label',q=>q.theatreTimingEvidence014[1].label='baseline'],['missing recorded path',q=>q.theatreTimingEvidence014[1].paths.pop()],['extra recorded path',q=>q.theatreTimingEvidence014[1].paths.push(q.theatreTimingEvidence014[1].paths[0])],['wrong recorded value',q=>q.theatreTimingEvidence014[1].paths[0].value++],['wrong source pin',q=>q.theatreTimingEvidence014[1].producer.sourceSHA256='0'.repeat(64)],['raw world tampering',q=>q.theatreTimingEvidence014[1].rawWorld.checkpoints[1].stats.money++]]){const q=structuredClone(receipt);mutate(q);let failed=false;try{validateTimingEvidence014(q);}catch{failed=true;}if(!failed)throw Error('Invalid clock receipt accepted: '+name);rejected.push(name);}
 const normalized=normalizeCompatibility014(receipt.runs,product);if(JSON.stringify(normalized.reference)!==JSON.stringify(normalized.comparison))throw Error('Clock-only deterministic world comparison should pass');
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticDataOnly:true,source:timingProducer014(),exactSeparatedPaths:18,activeCheckpoints:[...TIMING_CHECKPOINTS014],allSimulationFieldsRetained:true,rawWorldsRetained:true,performanceThresholdsChanged:false,negativeCases:rejected.length,rejected};
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
 const candidate=product?.release===false&&product.phase==='candidate'&&product.version==='14.30'&&product.anchor==='T726',release=product?.release===true&&product.phase==='release'&&product.version==='14.31'&&product.anchor==='T727';
 if(['ok','htmlExact','protectedExact','fpExact','logExact','coldLoadFixExact'].some(field=>product?.[field]!==true)||!(candidate||release))throw Error('Exact verified T726 candidate or image-approved T727 release required');
 if(!Array.isArray(runs)||runs.length!==2||runs[0].label!=='baseline'||runs[1].label!=='candidate')throw Error('Exactly ordered baseline/candidate raw observations required');
 const raw=JSON.stringify(runs),reference=runs[0].result,comparison=structuredClone(runs[1].result),changes=[];
 for(const[label,rows]of[['baseline',reference],['candidate',comparison]]){
  if(!Array.isArray(rows)||!eq(rows.map(q=>q.seed),WORLD_SEEDS014)||rows.some((q,i)=>!Array.isArray(q.checkpoints)||q.checkpoints.length!==CHECKPOINT_COUNTS014[i]))throw Error('Exactly eight complete ordered historical worlds/checkpoints required');
  const version=label==='candidate'?product.version:'14.30',anchor=label==='candidate'?product.anchor:'T726';
  for(const seed of[900721,900724,900725,900726])for(const[index,q]of rows.find(q=>q.seed===seed).checkpoints.entries()){
   if(!q.enterprise||!Object.hasOwn(q.enterprise,'version')||!Object.hasOwn(q.enterprise,'anchor')||q.enterprise.version!==version||q.enterprise.anchor!==anchor)throw Error('Unexpected native enterprise metadata at seed'+seed+'.checkpoints['+index+']');
   if(label==='candidate'&&release)for(const[field,value]of[['version','14.30'],['anchor','T726']]){changes.push({path:'seed'+seed+'.checkpoints['+index+'].enterprise.'+field,from:q.enterprise[field],to:value});q.enterprise[field]=value;}
  }
  for(const seed of[900725,900726]){
   const world=rows.find(q=>q.seed===seed);if(!world.nativeSaveMetadataExact||!world.nativeLoadIdentitiesExact||!world.otherSlotsUnchanged)throw Error('Complete native save/load/other-slot evidence required');
   validateNativeSave014(world.nativeSave,version,world.fixture?.N,world.checkpoints[4].stats.day,'seed'+seed+'.nativeSave');
   if(seed===900726){
    validateTimingShape014(world,true);
    if(!world.nativeContinueIdentitiesExact||!world.continueSaveBytesExact||!world.actualPageReload||!world.reloadedSourceExact||!world.followingContinueDay||world.checkpoints[7].continued!==true||world.checkpoints[8].followingContinuedDay!==true||world.checkpoints[7].stats.day!==world.checkpoints[6].stats.day||world.checkpoints[8].stats.day!==world.checkpoints[7].stats.day+1)throw Error('Actual whole-page native Continue and unaided following day required');
    validateNativeSave014(world.continueSave,version,world.fixture?.N,world.checkpoints[6].stats.day,'seed900726.continueSave');
   }
   if(label==='candidate'&&release)for(const field of seed===900726?['nativeSave','continueSave']:['nativeSave']){
    // Validation above proves unique root.gameVer and root.region.ver spans.
    // Change only those two string values, retaining every other native byte.
    const original=world[field],save=JSON.parse(original),marker='"gameVer":'+JSON.stringify(version),regionMarker='"region":'+JSON.stringify(save.region),regionVersion='"ver":'+JSON.stringify(version);
    const normalizedRegion=regionMarker.replace(regionVersion,'"ver":"14.30"');
    const normalized=original.replace(marker,'"gameVer":"14.30"').replace(regionMarker,normalizedRegion),expected={...save,gameVer:'14.30',region:{...save.region,ver:'14.30'}};
    if(!eq(JSON.parse(normalized),expected)||normalized.replace('"gameVer":"14.30"',marker).replace(normalizedRegion,regionMarker)!==original)throw Error('Only the exact native root.gameVer and root.region.ver byte spans may normalize');
    for(const suffix of['gameVer','region.ver'])changes.push({path:'seed'+seed+'.'+field+'.'+suffix,from:version,to:'14.30'});
    world[field]=normalized;
   }
  }
 }
 if(JSON.stringify(runs)!==raw||changes.length!==(release?66:0))throw Error('Only60 known enterprise labels and six exact raw save labels may normalize; raw observations stay unchanged');
 return{reference,comparison,metadataNormalization:{applied:release,paths:release?[...METADATA_PATHS014,...SAVE_PATHS014]:[],validatedPaths:[...METADATA_PATHS014,...SAVE_PATHS014],from:{version:product.version,anchor:product.anchor},to:{version:'14.30',anchor:'T726'},rawObservationsPreserved:true,sameLabelExact:candidate,normalizedFields:changes.length,changes}};
}
function runtimeSourceAudit014(){
 const oldFiles=['theatre-compatibility013.js','theatre-gameplay013.js','theatre-regression-adapter013.js','theatre-historical-bridge013.js'];
 const sources=oldFiles.map(file=>{const actual=fs.readFileSync(path.join(ROOT,file)),old=fixed.baseFile(file);if(!actual.equals(old))throw Error('Historical runtime source changed: '+file);return{file,sha256:fixed.hash(actual),exact:true};});
 const old=previous.runtimeSourceAudit013();fixtureSource014();for(const f of[snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014])new vm.Script('('+f.toString()+')');
 // Exact sections were read from this approved source before pinning. Literal
 // hashes survive a squash release without requiring its candidate git object.
 const approvedSHA='509e3b0ebbeefc2c92efb24fef4abbeaf6bdfc85',approvedSourceSHA256='ff862ee86a37cab8a8f63386144e784c2cccbb16f8b0cdfa797156a569200284';
 const approvedRuntimeSHA256='6a68d2afb37dc1da473daab15f61158541c676a2f860341c9799747fe0362998',approvedUnchangedSourceSHA256='b6ac3ce28c7df69d001159388df92eb6381811ae096ce6086229c5505ac4586c';
 const before="if(version!=='14.30'||anchor!=='T726')throw Error('Exact source-verified T726 candidate labels required');",after="if(!((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727')))throw Error('Exact source-verified T726 candidate or approved T727 release labels required');";
 const runtime=runTheatreWorld014.toString(),original=runtime.replace(after,before);
 if(runtime.split(after).length!==2||fixed.hash(original)!==approvedRuntimeSHA256)throw Error('Approved eighth-world runtime may change only the exact version/anchor gate');
 const unchanged=[snapshotTheatreWorld014,continueTheatreWorld014,runCompleteTheatreWorld014,timingProducer014,validateTimingShape014,separateTheatreTiming014,validateTimingEvidence014,staticTimingTest014,validateNativeSave014];
 if(fixed.hash(unchanged.map(f=>f.toString()).join('\n'))!==approvedUnchangedSourceSHA256)throw Error('Approved eighth-world observation, Continue, native save validation, and18-path raw timing receipts must remain exact');
 return{sources,previousRuntimeProof:old,riversideRuntime:riversideRuntimeAudit014(),immutableOriginalSevenWorldSourcesExact:true,allSevenPriorWorldNonLabelBytesExact:true,seventhWorldLabelGateAdapted:true,eighthFixtureSourceSHA256:fixed.hash(fixtureSource014()),approvedSHA,approvedSourceSHA256,approvedUnchangedSourceSHA256,originalRuntimeSHA256:fixed.hash(original),currentRuntimeSHA256:fixed.hash(runtime),allNonLabelRuntimeBytesExact:true,rawTimingReceiptSourceExact:true,nativeSaveLabelPaths:['root.gameVer','root.region.ver'],noSaveReserialization:true,noGetterRepair:true};
}
function normalizationFixture014(release=false){
 const save=(day,version)=>JSON.stringify({v:1,n:72,gameVer:version,region:{stations:0,ports:0,airports:0,powerCap:1650,food:0,tourists:79,ver:version},df:1,day,allFields:{retained:true}});
 return['baseline','candidate'].map(label=>{const version=release&&label==='candidate'?'14.31':'14.30',anchor=release&&label==='candidate'?'T727':'T726';return{label,result:WORLD_SEEDS014.map((seed,i)=>({seed,fixture:{N:72,paid:100},...(i>=6?{nativeSave:save(4,version),nativeSaveMetadataExact:true,nativeLoadIdentitiesExact:true,otherSlotsUnchanged:true}:{}),...(i===7?{continueSave:save(6,version),nativeContinueIdentitiesExact:true,continueSaveBytesExact:true,actualPageReload:true,reloadedSourceExact:true,followingContinueDay:true}:{}),checkpoints:Array.from({length:CHECKPOINT_COUNTS014[i]},(_,n)=>({stats:{day:i===7&&n>=7?n-1:n,money:100-n,poweredBld:5},tilesSHA256:'complete-'+n,rngState:42+n,...(i===7?{offset:TIMING_OFFSETS014[n],nativeMobility:{totalTrips:100,performance:TIMING_CHECKPOINTS014.includes(n)?{runs:TIMING_RUNS014[n]}:{runs:0,lastMs:0,avgMs:0,maxMs:0}}}:{}),...(i>=4?{enterprise:{version,anchor,money:100-n,other:{unchanged:true}}}:{}),...(i===7&&n===7?{continued:true}:{}),...(i===7&&n===8?{followingContinuedDay:true}:{})}))}))};});
}
function staticNormalizationTest014(){
 const runtimeSource=runtimeSourceAudit014(),oldControls=previous.staticNormalizationTest013(),wallClockControls=staticTimingTest014(),riversideRuntimeControls=staticRiversideRuntimeTest014();
 const product=release=>({ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,release,phase:release?'release':'candidate',version:release?'14.31':'14.30',anchor:release?'T727':'T726'}),negatives=[],positives=[];
 const saves=[[900725,'nativeSave'],[900726,'nativeSave'],[900726,'continueSave']];
 for(const release of[false,true]){
  const mode=release?'release':'candidate',input=normalizationFixture014(release),raw=JSON.stringify(input),positive=normalizeCompatibility014(input,product(release)),metadata=positive.metadataNormalization;
  const expectedPaths=[...METADATA_PATHS014,...SAVE_PATHS014],expectedChanges=[];
  for(const seed of[900721,900724,900725,900726])for(let index=0;index<(seed===900726?9:7);index++)for(const[field,from,to]of[['version','14.31','14.30'],['anchor','T727','T726']])expectedChanges.push({path:'seed'+seed+'.checkpoints['+index+'].enterprise.'+field,from,to});
  for(const path of SAVE_PATHS014)expectedChanges.push({path,from:'14.31',to:'14.30'});
  if(!eq(positive.reference,positive.comparison)||JSON.stringify(positive.reference)!==JSON.stringify(positive.comparison)||JSON.stringify(input)!==raw||metadata.normalizedFields!==(release?66:0)||metadata.applied!==release||metadata.sameLabelExact===release||!eq(metadata.paths,release?expectedPaths:[])||!eq(metadata.validatedPaths,expectedPaths)||!eq(metadata.changes,release?expectedChanges:[]))throw Error('Only the exact complete approved label normalization is allowed: '+mode);
  positives.push(mode+' exact full worlds and label receipt');
  const preserved=normalizationFixture014(release);
  for(const row of preserved)for(const[seed,field]of saves){const w=row.result.find(w=>w.seed===seed);w[field]=w[field].replace('"df":1','"df": 1').replace('"retained":true','"retained":true,"labels":["14.31","T727","14.30","T726"],"rawNumber":1e2,"rawUnicode":"\\u0061"');}
  const preservedRaw=JSON.stringify(preserved),retained=normalizeCompatibility014(preserved,product(release));
  if(JSON.stringify(preserved)!==preservedRaw||JSON.stringify(retained.reference)!==JSON.stringify(retained.comparison)||saves.some(([seed,field])=>!retained.comparison.find(w=>w.seed===seed)[field].includes('"rawNumber":1e2,"rawUnicode":"\\u0061"')))throw Error('All unrelated raw bytes and label-like strings must survive: '+mode);
  positives.push(mode+' raw whitespace, numeric spelling, escapes and unrelated labels retained');
  const reject=(name,mutate)=>{const runs=normalizationFixture014(release),p=product(release);mutate(runs,p);const before=JSON.stringify(runs);let error='';try{const q=normalizeCompatibility014(runs,p);if(!eq(q.reference,q.comparison)||JSON.stringify(q.reference)!==JSON.stringify(q.comparison))error='full comparison rejects mutation';}catch(e){error=e.message;}if(!error||JSON.stringify(runs)!==before)throw Error('Compatibility negative accepted or observations mutated: '+mode+'/'+name);negatives.push({name:mode+'/'+name,error});};
  for(const field of['ok','htmlExact','protectedExact','fpExact','logExact','coldLoadFixExact'])for(const value of[false,undefined,1,'true',null])reject('unverified '+field+'/'+String(value),(_,p)=>p[field]=value);
  for(const[field,value]of[['release',!release],['release','true'],['phase',release?'candidate':'release'],['version',release?'14.30':'14.31'],['anchor',release?'T726':'T727'],['version','14.32'],['anchor','T728']])reject('mixed or unapproved '+field+'/'+value,(_,p)=>p[field]=value);
  reject('missing proof fields',(_,p)=>{for(const field of Object.keys(p))delete p[field];});
  reject('reordered comparison',r=>r.reverse());reject('extra comparison',r=>r.push(structuredClone(r[1])));reject('wrong comparison label',r=>r[1].label='release');
  for(const side of[0,1]){
   reject('missing eighth world/'+side,r=>r[side].result.pop());reject('duplicate world/'+side,r=>r[side].result[7].seed=900725);reject('reordered worlds/'+side,r=>r[side].result.reverse());
   for(let i=0;i<8;i++){
    reject('extra checkpoint/'+side+'/'+i,r=>r[side].result[i].checkpoints.push({}));reject('missing checkpoint/'+side+'/'+i,r=>r[side].result[i].checkpoints.pop());
   }
   for(const seed of[900721,900724,900725,900726])for(let index=0;index<(seed===900726?9:7);index++)for(const field of['version','anchor'])reject('wrong enterprise '+seed+'/'+side+'/'+index+'/'+field,r=>r[side].result.find(w=>w.seed===seed).checkpoints[index].enterprise[field]='bad');
   const version=release&&side===1?'14.31':'14.30';
   for(const[seed,field]of saves)for(const[name,mutate]of[
    ['duplicate gameVer',s=>s.replace('"v":1','"gameVer":'+JSON.stringify(version)+',"v":1')],['nested gameVer',s=>s.replace('"retained":true','"retained":true,"gameVer":'+JSON.stringify(version))],['wrong gameVer',s=>s.replace('"gameVer":'+JSON.stringify(version),'"gameVer":"14.32"')],['missing gameVer',s=>s.replace(',"gameVer":'+JSON.stringify(version),'')],
    ['duplicate region',s=>s.replace('"v":1','"region":{},"v":1')],['duplicate region ver',s=>s.replace('"stations":0','"ver":'+JSON.stringify(version)+',"stations":0')],['nested unrelated ver',s=>s.replace('"retained":true','"retained":true,"nested":{"ver":'+JSON.stringify(version)+'}')],['wrong region ver',s=>s.replace('"ver":'+JSON.stringify(version),'"ver":"14.32"')],['missing region ver',s=>s.replace(',"ver":'+JSON.stringify(version),'')],['extra region key',s=>s.replace('"stations":0','"unexpected":true,"stations":0')],
    ['nonlabel data',s=>s.replace('"tourists":79','"tourists":80')],['key order',s=>s.replace('"stations":0,"ports":0','"ports":0,"stations":0')],['whitespace',s=>s.replace('"df":1','"df": 1')],['trailing whitespace',s=>s+' '],['numeric spelling',s=>s.replace('"tourists":79','"tourists":7.9e1')],['unrelated string label',s=>s.replace('"retained":true','"retained":true,"unrelated":"14.31"')],['extra field',s=>s.replace('"retained":true','"retained":true,"extra":1')],['existing nonlabel boolean',s=>s.replace('"retained":true','"retained":false')],['wrong day',s=>s.replace('"day":'+JSON.parse(s).day,'"day":99')],['wrong grid',s=>s.replace('"n":72','"n":71')],['wrong difficulty',s=>s.replace('"df":1','"df":0')],['wrong schema',s=>s.replace('"v":1','"v":2')]
   ])reject(seed+'/'+field+'/'+side+'/'+name,r=>{const w=r[side].result.find(w=>w.seed===seed),old=w[field];w[field]=mutate(old);if(old===w[field])throw Error('Negative fixture did not mutate');});
   for(const[seed,field]of saves)for(const path of['gameVer','region.ver'])reject('mixed known label '+seed+'/'+field+'/'+side+'/'+path,r=>{const w=r[side].result.find(w=>w.seed===seed),key=path==='gameVer'?'gameVer':'ver';w[field]=w[field].replace(JSON.stringify(key)+':'+JSON.stringify(version),JSON.stringify(key)+':'+JSON.stringify(version==='14.31'?'14.30':'14.31'));});
  }
  for(let i=0;i<8;i++){
   for(let index=0;index<CHECKPOINT_COUNTS014[i];index++)for(const field of['money','rngState','tilesSHA256'])reject('world'+i+' checkpoint'+index+' full '+field,r=>{const q=r[1].result[i].checkpoints[index];if(field==='money')q.stats.money++;else q[field]+='changed';});
   reject('world'+i+' paid fixture',r=>r[1].result[i].fixture.paid++);
   reject('world'+i+' undeclared label',r=>r[1].result[i].unapprovedVersion='14.31');
  }
  for(const seed of[900721,900724,900725,900726])for(const field of['money','other'])reject('nonlabel enterprise '+seed+'/'+field,r=>{const q=r[1].result.find(w=>w.seed===seed).checkpoints[0].enterprise;if(field==='money')q.money++;else q.other.unchanged=false;});
  for(const seed of[900725,900726])for(const flag of['nativeSaveMetadataExact','nativeLoadIdentitiesExact','otherSlotsUnchanged'])reject('missing '+seed+'/'+flag,r=>r[1].result.find(w=>w.seed===seed)[flag]=false);
  for(const flag of['nativeContinueIdentitiesExact','continueSaveBytesExact','actualPageReload','reloadedSourceExact','followingContinueDay'])reject('missing '+flag,r=>r[1].result[7][flag]=false);
  for(let index=0;index<9;index++)reject('simulation execution counter/'+index,r=>r[1].result[7].checkpoints[index].nativeMobility.performance.runs++);
  reject('no following continued day',r=>r[1].result[7].checkpoints[8].stats.day--);
  reject('undeclared timing field',r=>r[1].result[7].checkpoints[1].nativeMobility.performance.lastMs=12);
  reject('unrelated timing object',r=>r[1].result[7].checkpoints[1].other={lastMs:12});
 }
 // Real raw timing receipts retain their release labels before normalization.
 const releaseRuns=normalizationFixture014(true),receipt={runs:releaseRuns,theatreTimingEvidence014:[]};
 for(const[side,row]of releaseRuns.entries()){
  const raw=row.result[7];for(const index of TIMING_CHECKPOINTS014)for(const field of TIMING_FIELDS014)raw.checkpoints[index].nativeMobility.performance[field]=10+index+side;
  const split=separateTheatreTiming014(raw);receipt.theatreTimingEvidence014.push({label:row.label,...split.evidence});row.result[7]=split.world;
 }
 const receiptRaw=JSON.stringify(receipt),timing=validateTimingEvidence014(receipt),normalized=normalizeCompatibility014(receipt.runs,product(true));
 if(JSON.stringify(normalized.reference)!==JSON.stringify(normalized.comparison)||JSON.stringify(receipt)!==receiptRaw||timing.separatedPerWorld!==18||receipt.theatreTimingEvidence014[1].rawWorld.checkpoints[0].enterprise.version!=='14.31')throw Error('Approved release must preserve complete original18-path timing receipts and all raw labels');
 positives.push('release exact18-path raw timing receipts retained');
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticDataOnly:true,worlds:8,originalSevenWorldsRetained:true,oldControls,wallClockControls,riversideRuntimeControls,runtimeSource,checkpointCounts:CHECKPOINT_COUNTS014,declaredPaths:[...METADATA_PATHS014,...SAVE_PATHS014],candidateNormalizedFields:0,releaseNormalizedFields:66,releaseEnterpriseFields:60,releaseRawSaveFields:6,futureReleaseRejected:true,completeNativeSaveCompared:true,actualContinueCompared:true,rawObservationsPreserved:true,cases:positives.length+negatives.length,positiveCases:positives.length,negativeCases:negatives.length,positives,negatives};
}
module.exports={fixtureSource014,snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014,runCompleteTheatreWorld014,riversideRuntimeSource014,riversideRuntimeAudit014,staticRiversideRuntimeTest014,normalizeCompatibility014,validateNativeSave014,runtimeSourceAudit014,staticNormalizationTest014,normalizationFixture014,timingProducer014,separateTheatreTiming014,validateTimingEvidence014,validateTimingShape014,staticTimingTest014,TIMING_CHECKPOINTS014,TIMING_FIELDS014,WORLD_SEEDS014,CHECKPOINT_COUNTS014,METADATA_PATHS014,SAVE_PATHS014};

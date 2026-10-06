'use strict';
// Same-label candidate normalization is zero; approved T730 changes only66 exact comparison spans.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const old=require('./complexes-compatibility014'),previous=require('./gardenlife-compatibility016'),fixed=require('./quayside-static-contract017');
const exactTransform017=previous.exactTransform016;
function buildNormalizer017(){
 const original=previous.buildNormalizer016(),gate="const candidate=product?.release===false&&product.phase==='candidate'&&product.publicationApproved===false&&product.version==='14.32'&&product.anchor==='T728',release=product?.release===true&&product.phase==='release'&&product.publicationApproved===true&&product.version==='14.33'&&product.anchor==='T729';";
 const q=exactTransform017(original.fn.toString(),[[gate,"const candidate=product?.release===false&&product.phase==='candidate'&&product.publicationApproved===false&&product.version==='14.33'&&product.anchor==='T729',release=product?.release===true&&product.phase==='release'&&product.publicationApproved===true&&product.version==='14.34'&&product.anchor==='T730';"]]);
 const changes=[];for(const[from,to]of [["'14.32'","'14.33'"],["'T728'","'T729'"],['"14.32"','"14.33"']])changes.push([from,to,q.adapted.split(from).length-1]);
 const next=exactTransform017(q.adapted,changes),bindings={eq,structuredClone,WORLD_SEEDS014:old.WORLD_SEEDS014,CHECKPOINT_COUNTS014:old.CHECKPOINT_COUNTS014,METADATA_PATHS014:old.METADATA_PATHS014,SAVE_PATHS014:old.SAVE_PATHS014,validateNativeSave014:old.validateNativeSave014,validateTimingShape014:old.validateTimingShape014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+next.adapted+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{previous:original.proof,gate:q.proof,labels:next.proof,reverseExact:true,exactSourceTransform:true,rawSaveNormalizationPermitted:'only66 declared spans after exact release proof',candidateNormalizedFields:0,approvedReleaseNormalizedFields:66,originalSaveValidationFunctionsExact:true}};
}
function normalizeCompatibility017(runs,product){const q=buildNormalizer017(),result=q.fn(runs,product),m=result.metadataNormalization;if(m.normalizedFields!==(product.release?66:0)||m.applied!==product.release||m.changes.length!==(product.release?66:0)||m.paths.length!==(product.release?14:0)||m.sameLabelExact===product.release)throw Error('Only zero candidate or66 approved T730 comparison spans permitted');return{...result,quaysideSourceAdapter:q.proof};}
const OLD_PAIR="((version==='14.32'&&anchor==='T728')||(version==='14.33'&&anchor==='T729'))",NEW_PAIR="((version==='14.33'&&anchor==='T729')||(version==='14.34'&&anchor==='T730'))";
function riversideRuntimeSource017(){return exactTransform017(previous.riversideRuntimeSource016(),[[OLD_PAIR,NEW_PAIR]]).adapted;}
function buildTheatreRuntime017(){
 const before="((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727'))",q=exactTransform017(old.runTheatreWorld014.toString(),[[before,NEW_PAIR]]),runTheatreWorld014=new vm.Script('('+q.adapted+')').runInThisContext();
 const body=old.runCompleteTheatreWorld014.toString(),bindings={process,fs,path,ROOT:__dirname,require,fixed,fixtureSource014:old.fixtureSource014,snapshotTheatreWorld014:old.snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014:old.continueTheatreWorld014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+body+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{...q.proof,outerRuntimeSourceSHA256:fixed.hash(body),outerRuntimeExact:true,onlyLeadingLabelGateChanged:true}};
}
async function runCompleteTheatreWorld014(...args){return buildTheatreRuntime017().fn(...args);}
function normalizationFixture017(release=false){const runs=previous.normalizationFixture016(false);for(const row of runs)for(const w of row.result){const version=release&&row.label==='candidate'?'14.34':'14.33',anchor=release&&row.label==='candidate'?'T730':'T729';for(const q of w.checkpoints)if(q.enterprise){q.enterprise.version=version;q.enterprise.anchor=anchor;}for(const field of['nativeSave','continueSave'])if(w[field]){const d=JSON.parse(w[field]);d.gameVer=version;d.region.ver=version;w[field]=JSON.stringify(d);}}return runs;}
function originalRawSaveControls017(input,product){
 const file='gardenlife-compatibility016.test.js',source=fs.readFileSync(path.join(__dirname,file),'utf8');if(source!==fixed.baseFile(file).toString())throw Error('Original42 raw-save control file must be exact');
 const start=' const rejected=[];',end=' return{ok:true,sourceOnly:true';if(source.split(start).length!==2||source.split(end).length!==2)throw Error('Unique original42 boundaries required');
 const body=source.slice(source.indexOf(start),source.indexOf(end)),compat={normalizeCompatibility016:normalizeCompatibility017};
 const fn=new vm.Script('(function(input,product,compat,version,structuredClone,assert,eq){'+body+';return rejected;})').runInThisContext();
 const rejected=fn(input,product,compat,product.version,structuredClone,require('node:assert/strict'),eq);if(rejected.length!==42)throw Error('Every original42 native-save mutation required');return{rejected,original42SourceSHA256:fixed.hash(body),original42StatementsExact:true};
}
function staticRuntimeTest017(){
 const sources=[riversideRuntimeSource017(),exactTransform017(old.runTheatreWorld014.toString(),[["((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727'))",NEW_PAIR]]).adapted],rows=[];
 for(const s of sources){new vm.Script('('+s+')');const gate=s.split('\n')[1].trim();if(!gate.startsWith('if(!'+NEW_PAIR))throw Error('Only leading label predicate may execute');const f=new vm.Script('(function(version,anchor){'+gate+';return true;})').runInNewContext();for(const version of['14.30','14.31','14.32','14.33','14.34','14.35',null])for(const anchor of['T726','T727','T728','T729','T730','T731',null]){let ok=false;try{ok=f(version,anchor);}catch{}if(ok!==((version==='14.33'&&anchor==='T729')||(version==='14.34'&&anchor==='T730')))throw Error('Only exact T729/T730 labels allowed');rows.push({version,anchor,ok});}}
 return{ok:true,sourceOnly:true,gameExecuted:false,onlyIsolatedLabelPredicatesExecuted:true,cases:rows.length,theatre:buildTheatreRuntime017().proof};
}
function candidateNormalizationTest017(){
 // Retain every prior candidate assertion, changing only two fixture labels.
 const original=previous.candidateNormalizationTest016.toString(),q=exactTransform017(original,[["version:'14.32',anchor:'T728'","version:'14.33',anchor:'T729'"]]);
 const bindings={eq,structuredClone,old,previous:{staticNormalizationTest015:previous.staticNormalizationTest016},normalizationFixture016:normalizationFixture017,normalizeCompatibility016:normalizeCompatibility017,originalRawSaveControls016:originalRawSaveControls017,staticRuntimeTest016:staticRuntimeTest017};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+q.adapted+');})').runInThisContext()(...Object.values(bindings)),result=fn();
 const product={ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,release:false,publicationApproved:false,phase:'candidate',version:'14.33',anchor:'T729'},runs=normalizationFixture017(),rejected=[];
 for(const edit of[{version:'14.34'},{anchor:'T730'},{release:true},{publicationApproved:true},{phase:'release'},{release:true,publicationApproved:true,phase:'release',version:'14.34',anchor:'T730'},{release:true,publicationApproved:true,phase:'release'}]){let failed=false;try{normalizeCompatibility017(runs,{...product,...edit});}catch{failed=true;}if(!failed)throw Error('Future or old approval accepted for current candidate');rejected.push(edit);}
 return{...result,originalCandidateAssertions:q.proof,allHistoricalSyntheticControlsRetained:true,candidateNormalizedFields:0,additionalUnapprovedProductNegatives:rejected};
}
function releaseNormalizationTest017(){
 const original=previous.releaseNormalizationTest016.toString(),q=exactTransform017(original,[["mapping={'14.30':'14.32','14.31':'14.33','14.32':'14.34','T726':'T728','T727':'T729','T728':'T730'}","mapping={'14.30':'14.33','14.31':'14.34','14.32':'14.35','T726':'T729','T727':'T730','T728':'T731'}"],["version:'14.33',anchor:'T729'","version:'14.34',anchor:'T730'"]]);
 const bindings={eq,structuredClone,old,require,fixed,vm,exactTransform016:exactTransform017,normalizationFixture016:normalizationFixture017,normalizeCompatibility016:normalizeCompatibility017,originalRawSaveControls016:originalRawSaveControls017};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+q.adapted+');})').runInThisContext()(...Object.values(bindings)),result=fn();return{...result,original016ReleaseAssertions:q.proof,everyOriginalReleaseAssertionRetained:true};
}
function staticNormalizationTest017(){const candidate=candidateNormalizationTest017(),release=releaseNormalizationTest017();return{...candidate,releaseControls:release,candidateNormalizedFields:0,releaseNormalizedFields:66,releaseEnterpriseFields:60,releaseRawSaveFields:6,allOriginal42CandidateAndReleaseRetained:true};}
module.exports={...old,normalizeCompatibility017,buildNormalizer017,riversideRuntimeSource017,runCompleteTheatreWorld014,buildTheatreRuntime017,normalizationFixture017,originalRawSaveControls017,staticRuntimeTest017,staticNormalizationTest017,candidateNormalizationTest017,releaseNormalizationTest017,exactTransform017};
if(require.main===module){if(process.argv.length!==3||process.argv[2]!=='--static-test')throw Error('Only --static-test source/data controls available');console.log(JSON.stringify(staticNormalizationTest017(),null,2));}

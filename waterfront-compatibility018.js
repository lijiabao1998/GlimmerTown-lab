'use strict';
// T730 candidate changes zero bytes; approved T731 normalizes exactly66 metadata spans.
// Every historical assertion remains executable with source-exact transformation proofs.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const old=require('./complexes-compatibility014'),previous=require('./quayside-compatibility017'),fixed=require('./waterfront-static-contract018');
const exactTransform018=previous.exactTransform017;
function buildNormalizer018(){
 const original=previous.buildNormalizer017(),gate="const candidate=product?.release===false&&product.phase==='candidate'&&product.publicationApproved===false&&product.version==='14.33'&&product.anchor==='T729',release=product?.release===true&&product.phase==='release'&&product.publicationApproved===true&&product.version==='14.34'&&product.anchor==='T730';";
 const q=exactTransform018(original.fn.toString(),[[gate,"const candidate=product?.release===false&&product.phase==='candidate'&&product.publicationApproved===false&&product.version==='14.34'&&product.anchor==='T730',release=product?.release===true&&product.phase==='release'&&product.publicationApproved===true&&product.version==='14.35'&&product.anchor==='T731';"]]);
 const changes=[];for(const[from,to]of [["'14.33'","'14.34'"],["'T729'","'T730'"],['"14.33"','"14.34"']])changes.push([from,to,q.adapted.split(from).length-1]);
 const next=exactTransform018(q.adapted,changes),bindings={eq,structuredClone,WORLD_SEEDS014:old.WORLD_SEEDS014,CHECKPOINT_COUNTS014:old.CHECKPOINT_COUNTS014,METADATA_PATHS014:old.METADATA_PATHS014,SAVE_PATHS014:old.SAVE_PATHS014,validateNativeSave014:old.validateNativeSave014,validateTimingShape014:old.validateTimingShape014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+next.adapted+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{previous:original.proof,gate:q.proof,labels:next.proof,reverseExact:true,exactSourceTransform:true,candidateNormalizedFields:0,approvedReleaseNormalizedFields:66,originalSaveValidationFunctionsExact:true,rawSaveNormalizationPermitted:'only66 declared spans after exact release proof'}};
}
function normalizeCompatibility018(runs,product){const q=buildNormalizer018(),result=q.fn(runs,product),m=result.metadataNormalization;if(m.normalizedFields!==(product.release?66:0)||m.applied!==product.release||m.changes.length!==(product.release?66:0)||m.paths.length!==(product.release?14:0)||m.sameLabelExact===product.release)throw Error('Only zero candidate or66 approved T731 comparison spans permitted');return{...result,waterfrontSourceAdapter:q.proof};}
const OLD_PAIR="((version==='14.33'&&anchor==='T729')||(version==='14.34'&&anchor==='T730'))",NEW_PAIR="((version==='14.34'&&anchor==='T730')||(version==='14.35'&&anchor==='T731'))";
function riversideRuntimeSource018(){return exactTransform018(previous.riversideRuntimeSource017(),[[OLD_PAIR,NEW_PAIR]]).adapted;}
function buildTheatreRuntime018(){
 const before="((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727'))",q=exactTransform018(old.runTheatreWorld014.toString(),[[before,NEW_PAIR]]),runTheatreWorld014=new vm.Script('('+q.adapted+')').runInThisContext();
 const body=old.runCompleteTheatreWorld014.toString(),bindings={process,fs,path,ROOT:__dirname,require,fixed,fixtureSource014:old.fixtureSource014,snapshotTheatreWorld014:old.snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014:old.continueTheatreWorld014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+body+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{...q.proof,outerRuntimeSourceSHA256:fixed.hash(body),outerRuntimeExact:true,onlyLeadingLabelGateChanged:true}};
}
async function runCompleteTheatreWorld014(...args){return buildTheatreRuntime018().fn(...args);}
function normalizationFixture018(release=false){const runs=previous.normalizationFixture017(false);for(const row of runs)for(const w of row.result){const version=release&&row.label==='candidate'?'14.35':'14.34',anchor=release&&row.label==='candidate'?'T731':'T730';for(const q of w.checkpoints)if(q.enterprise){q.enterprise.version=version;q.enterprise.anchor=anchor;}for(const field of['nativeSave','continueSave'])if(w[field]){const d=JSON.parse(w[field]);d.gameVer=version;d.region.ver=version;w[field]=JSON.stringify(d);}}return runs;}
function originalRawSaveControls018(input,product){
 const file='quayside-compatibility017.test.js',source=fs.readFileSync(path.join(__dirname,file),'utf8');if(source!==fixed.baseFile(file).toString())throw Error('Original42 raw-save control file must be exact');
 const start=' const rejected=[];',end=' return{ok:true,sourceOnly:true';if(source.split(start).length!==2||source.split(end).length!==2)throw Error('Unique original42 boundaries required');
 const body=source.slice(source.indexOf(start),source.indexOf(end)),compat={normalizeCompatibility016:normalizeCompatibility018};
 const fn=new vm.Script('(function(input,product,compat,version,structuredClone,assert,eq){'+body+';return rejected;})').runInThisContext();
 const rejected=fn(input,product,compat,product.version,structuredClone,require('node:assert/strict'),eq);if(rejected.length!==42)throw Error('Every original42 native-save mutation required');return{rejected,original42SourceSHA256:fixed.hash(body),original42StatementsExact:true};
}
function staticRuntimeTest018(){
 const sources=[riversideRuntimeSource018(),exactTransform018(old.runTheatreWorld014.toString(),[["((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727'))",NEW_PAIR]]).adapted],rows=[];
 for(const s of sources){new vm.Script('('+s+')');const gate=s.split('\n')[1].trim();if(!gate.startsWith('if(!'+NEW_PAIR))throw Error('Only leading label predicate may execute');const f=new vm.Script('(function(version,anchor){'+gate+';return true;})').runInNewContext();for(const version of['14.30','14.31','14.32','14.33','14.34','14.35',null])for(const anchor of['T726','T727','T728','T729','T730','T731',null]){let ok=false;try{ok=f(version,anchor);}catch{}if(ok!==((version==='14.34'&&anchor==='T730')||(version==='14.35'&&anchor==='T731')))throw Error('Only exact T730/T731 labels allowed');rows.push({version,anchor,ok});}}
 return{ok:true,sourceOnly:true,gameExecuted:false,onlyIsolatedLabelPredicatesExecuted:true,cases:rows.length,theatre:buildTheatreRuntime018().proof};
}
function candidateNormalizationTest018(){
 // Every016 candidate assertion remains, including all raw42, all complete
 // worlds and reversible18-path timing receipts. The previous chain runs too.
 const original=require('./gardenlife-compatibility016').candidateNormalizationTest016.toString(),q=exactTransform018(original,[["version:'14.32',anchor:'T728'","version:'14.34',anchor:'T730'"]]);
 const bindings={eq,structuredClone,old,previous:{staticNormalizationTest015:previous.staticNormalizationTest017},normalizationFixture016:normalizationFixture018,normalizeCompatibility016:normalizeCompatibility018,originalRawSaveControls016:originalRawSaveControls018,staticRuntimeTest016:staticRuntimeTest018};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+q.adapted+');})').runInThisContext()(...Object.values(bindings)),result=fn();
 const product={ok:true,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,release:false,publicationApproved:false,phase:'candidate',version:'14.34',anchor:'T730'},runs=normalizationFixture018(),rejected=[];
 for(const edit of[{version:'14.33'},{anchor:'T729'},{version:'14.35',anchor:'T731'},{release:true},{publicationApproved:true},{phase:'release'},{release:true,publicationApproved:true,phase:'release'},{release:true,publicationApproved:true,phase:'release',version:'14.35',anchor:'T731'}]){let failed=false;try{normalizeCompatibility018(runs,{...product,...edit});}catch{failed=true;}if(!failed)throw Error('Historical or mismatched release proof accepted for current candidate observations');rejected.push(edit);}
 return{...result,originalCandidateAssertions:q.proof,allHistoricalSyntheticControlsRetained:true,candidateNormalizedFields:0,currentReleasePermitted:false,additionalUnapprovedProductNegatives:rejected};
}
function releaseNormalizationTest018(){
 // Preserve all original release assertions, changing only exact synthetic labels.
 const original=previous.releaseNormalizationTest017.toString(),q=exactTransform018(original,[["mapping={'14.30':'14.33','14.31':'14.34','14.32':'14.35','T726':'T729','T727':'T730','T728':'T731'}","mapping={'14.30':'14.34','14.31':'14.35','14.32':'14.36','T726':'T730','T727':'T731','T728':'T732'}"],["version:'14.34',anchor:'T730'","version:'14.35',anchor:'T731'"]]);
 const bindings={eq,structuredClone,old,require,fixed,vm,previous:require('./gardenlife-compatibility016'),exactTransform017:exactTransform018,normalizationFixture017:normalizationFixture018,normalizeCompatibility017:normalizeCompatibility018,originalRawSaveControls017:originalRawSaveControls018};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+q.adapted+');})').runInThisContext()(...Object.values(bindings)),result=fn();return{...result,original017ReleaseAssertions:q.proof,everyOriginalReleaseAssertionRetained:true};
}
function staticNormalizationTest018(){const candidate=candidateNormalizationTest018(),release=releaseNormalizationTest018();return{...candidate,releaseControls:release,candidateNormalizedFields:0,releaseNormalizedFields:66,releaseEnterpriseFields:60,releaseRawSaveFields:6,allOriginal42CandidateAndReleaseRetained:true,currentReleasePermitted:true};}
module.exports={...old,normalizeCompatibility018,buildNormalizer018,riversideRuntimeSource018,runCompleteTheatreWorld014,buildTheatreRuntime018,normalizationFixture018,originalRawSaveControls018,staticRuntimeTest018,staticNormalizationTest018,candidateNormalizationTest018,releaseNormalizationTest018,exactTransform018};
if(require.main===module){if(process.argv.length!==3||process.argv[2]!=='--static-test')throw Error('Only --static-test source/data controls available');console.log(JSON.stringify(staticNormalizationTest018(),null,2));}

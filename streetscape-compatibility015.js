'use strict';
// Original eight-world observations and native-save checks stay intact. Only
// source-verified T727/T728 metadata pairs and exact66 release-label spans advance.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util'),old=require('./complexes-compatibility014'),fixed=require('./streetscape-static-contract015');
function buildNormalizer015(){
 const source=old.normalizeCompatibility014.toString();let adapted=source;const edits=[];
 const rep=(a,b,n=1)=>{if(adapted.split(a).length-1!==n)throw Error('Unique normalization source anchor required: '+a);const positions=[];let i=-1;while((i=adapted.indexOf(a,i+1))!==-1)positions.push(i);for(const p of [...positions].reverse())adapted=adapted.slice(0,p)+b+adapted.slice(p+a.length);edits.push({from:a,to:b,count:n,positions});};
 rep("const candidate=product?.release===false&&product.phase==='candidate'&&product.version==='14.30'&&product.anchor==='T726',release=product?.release===true&&product.phase==='release'&&product.version==='14.31'&&product.anchor==='T727';","const candidate=product?.release===false&&product.phase==='candidate'&&product.version==='14.31'&&product.anchor==='T727',release=product?.release===true&&product.phase==='release'&&product.version==='14.32'&&product.anchor==='T728';");
 // Replace each remaining old comparison span; none belongs to a game operation.
 for(const[a,b]of[["'14.30'","'14.31'"],["'T726'","'T727'"],['"14.30"','"14.31"']]){const n=adapted.split(a).length-1;if(!n)throw Error('Missing original comparison label');rep(a,b,n);}
 let reverse=adapted;for(const q of [...edits].reverse())for(const p of q.positions.map((p,i)=>p+i*(q.to.length-q.from.length)).reverse()){if(reverse.slice(p,p+q.to.length)!==q.to)throw Error('Exact normalizer reversal span changed');reverse=reverse.slice(0,p)+q.from+reverse.slice(p+q.to.length);}if(reverse!==source)throw Error('Normalizer did not reverse to every original byte');
 let rebuilt=source;for(const q of edits){if(rebuilt.split(q.from).length-1!==q.count)throw Error('Normalizer count changed');rebuilt=rebuilt.split(q.from).join(q.to);}if(rebuilt!==adapted)throw Error('Undeclared normalizer edit');
 const bindings={eq,structuredClone,WORLD_SEEDS014:old.WORLD_SEEDS014,CHECKPOINT_COUNTS014:old.CHECKPOINT_COUNTS014,METADATA_PATHS014:old.METADATA_PATHS014,SAVE_PATHS014:old.SAVE_PATHS014,validateNativeSave014:old.validateNativeSave014,validateTimingShape014:old.validateTimingShape014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+adapted+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{originalSourceSHA256:fixed.hash(source),adaptedSourceSHA256:fixed.hash(adapted),edits,exactSourceTransform:true,reverseExact:true,rawSaveNormalizationPermitted:'only66 enumerated labels after exact release proof',originalSaveValidationFunctionsExact:true}};
}
function normalizeCompatibility015(runs,product){const q=buildNormalizer015(),result=q.fn(runs,product);if(result.metadataNormalization.normalizedFields!==(product.release?66:0)||result.metadataNormalization.applied!==product.release)throw Error('Only zero candidate or66 approved release labels permitted');return{...result,streetscapeSourceAdapter:q.proof};}
const OLD_PAIR="((version==='14.30'&&anchor==='T726')||(version==='14.31'&&anchor==='T727'))",NEW_PAIR="((version==='14.31'&&anchor==='T727')||(version==='14.32'&&anchor==='T728'))";
function advanceRuntimeGate015(source){if(source.split(OLD_PAIR).length!==2)throw Error('One exact historical runtime label gate required');const adapted=source.replace(OLD_PAIR,NEW_PAIR);if(adapted.split(NEW_PAIR).length!==2||adapted.replace(NEW_PAIR,OLD_PAIR)!==source)throw Error('Every nonlabel historical runtime byte must remain exact');new vm.Script('('+adapted+')');return adapted;}
function riversideRuntimeSource015(){return advanceRuntimeGate015(old.riversideRuntimeSource014());}
function buildTheatreRuntime015(){
 const source=old.runTheatreWorld014.toString(),adapted=advanceRuntimeGate015(source),runTheatreWorld014=new vm.Script('('+adapted+')').runInThisContext();
 const body=old.runCompleteTheatreWorld014.toString();
 const bindings={process,fs,path,ROOT:__dirname,require,fixed,fixtureSource014:old.fixtureSource014,snapshotTheatreWorld014:old.snapshotTheatreWorld014,runTheatreWorld014,continueTheatreWorld014:old.continueTheatreWorld014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+body+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{originalSourceSHA256:fixed.hash(source),adaptedSourceSHA256:fixed.hash(adapted),outerRuntimeSourceSHA256:fixed.hash(body),outerRuntimeExact:true,onlyLeadingLabelGateChanged:true,reverseExact:true}};
}
async function runCompleteTheatreWorld014(...args){return buildTheatreRuntime015().fn(...args);}
function staticRuntimeTest015(){
 const inputs=[old.riversideRuntimeSource014(),old.runTheatreWorld014.toString()],rows=[];
 for(const source of inputs){const adapted=advanceRuntimeGate015(source),gate=adapted.split('\n')[1].trim();if(!gate.startsWith('if(!'+NEW_PAIR))throw Error('Leading runtime label predicate must be the only evaluated statement');const fn=new vm.Script('(function(version,anchor){'+gate+';return true;})').runInNewContext();for(const version of['14.30','14.31','14.32','14.33',undefined,null])for(const anchor of['T726','T727','T728','T729',undefined]){let accepted=false;try{accepted=fn(version,anchor)===true;}catch{}const expected=(version==='14.31'&&anchor==='T727')||(version==='14.32'&&anchor==='T728');if(accepted!==expected)throw Error('Historical label predicate mismatch');rows.push({version:String(version),anchor:String(anchor),accepted});}}
 return{ok:true,sourceOnly:true,gameExecuted:false,onlyIsolatedLabelPredicatesExecuted:true,cases:rows.length,theatre:buildTheatreRuntime015().proof,rows};
}
function normalizationFixture015(release=false){
 const runs=old.normalizationFixture014(release);for(const row of runs){const version=release&&row.label==='candidate'?'14.32':'14.31',anchor=release&&row.label==='candidate'?'T728':'T727';for(const world of row.result){for(const q of world.checkpoints)if(q.enterprise){q.enterprise.version=version;q.enterprise.anchor=anchor;}for(const field of ['nativeSave','continueSave'])if(world[field]){const save=JSON.parse(world[field]);save.gameVer=version;save.region.ver=version;world[field]=JSON.stringify(save);}}}return runs;
}
function staticNormalizationTest015(){
 const original=old.staticNormalizationTest014.toString(),mapping={'14.30':'14.31','14.31':'14.32','14.32':'14.33','T726':'T727','T727':'T728','T728':'T729'},spans=[];
 const adapted=original.replace(/14\.3[012]|T72[678]/g,(from,offset)=>{spans.push({offset,from,to:mapping[from]});return mapping[from];});let reverse=adapted;for(const q of [...spans].reverse()){if(reverse.slice(q.offset,q.offset+q.to.length)!==q.to)throw Error('Synthetic test reversal mismatch');reverse=reverse.slice(0,q.offset)+q.from+reverse.slice(q.offset+q.to.length);}if(reverse!==original)throw Error('Every original normalization assertion must be retained');
 const bindings={eq,structuredClone,runtimeSourceAudit014:old.runtimeSourceAudit014,previous:require('./theatre-compatibility013'),staticTimingTest014:old.staticTimingTest014,staticRiversideRuntimeTest014:old.staticRiversideRuntimeTest014,normalizationFixture014:normalizationFixture015,normalizeCompatibility014:normalizeCompatibility015,METADATA_PATHS014:old.METADATA_PATHS014,SAVE_PATHS014:old.SAVE_PATHS014,CHECKPOINT_COUNTS014:old.CHECKPOINT_COUNTS014,TIMING_CHECKPOINTS014:old.TIMING_CHECKPOINTS014,TIMING_FIELDS014:old.TIMING_FIELDS014,separateTheatreTiming014:old.separateTheatreTiming014,validateTimingEvidence014:old.validateTimingEvidence014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+adapted+');})').runInThisContext()(...Object.values(bindings));const out=fn();return{...out,testSource:{originalSHA256:fixed.hash(original),adaptedSHA256:fixed.hash(adapted),syntheticLabelSpans:spans.length,reverseExact:true,everyAssertionRetained:true},currentRuntimeControls:staticRuntimeTest015()};
}
module.exports={...old,normalizeCompatibility015,buildNormalizer015,riversideRuntimeSource015,runCompleteTheatreWorld014,buildTheatreRuntime015,staticRuntimeTest015,normalizationFixture015,staticNormalizationTest015};

if(require.main===module){if(process.argv.length!==3||process.argv[2]!=='--static-test')throw Error('Only --static-test source/data controls available');console.log(JSON.stringify(staticNormalizationTest015(),null,2));}

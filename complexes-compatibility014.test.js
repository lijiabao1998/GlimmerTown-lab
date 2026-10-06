#!/usr/bin/env node
'use strict';
// Source/data recheck of original eight-world CI evidence. Never starts a game.
const fs=require('node:fs'),assert=require('node:assert/strict'),{isDeepStrictEqual:eq}=require('node:util'),{execFileSync}=require('node:child_process');
const fixed=require('./complexes-static-contract014'),compat=require('./complexes-compatibility014');
const APPROVED_COMPATIBILITY_SHA256='4e09d7a54c8e2044d3a772454b6507d547a4248bc644680690cab0e9fbad77ef';
function test014(input,bytes,{approvedNative=false}={}){
 const currentProduct=fixed.verifyStatic014(),raw=JSON.stringify(input);let product=currentProduct;
 if(approvedNative){
  const release=require('./complexes-release-contract014');
  assert.equal(input.checkedSHA,release.APPROVED_SHA,'Archived evidence must belong to the exact image-approved candidate');assert.equal(input.workflowSHA,release.APPROVED_SHA);
  assert.equal(input.currentSHA256,release.APPROVED);assert.equal(currentProduct.normalizedHTMLSHA256,release.APPROVED,'Current source must normalize exactly to the approved candidate');
  assert.equal(Buffer.isBuffer(bytes),true,'Original approved artifact bytes are required');assert.equal(fixed.hash(bytes),APPROVED_COMPATIBILITY_SHA256,'Complete approved R5 artifact bytes must remain exact');assert.equal(JSON.stringify(JSON.parse(bytes)),raw,'Input must be the unchanged approved artifact');
  product={...currentProduct,release:false,phase:'candidate',version:'14.30',anchor:'T726',sourceSHA256:release.APPROVED};
 }else assert.equal(input.checkedSHA,execFileSync('git',['rev-parse','HEAD'],{cwd:__dirname,encoding:'utf8'}).trim(),'Current evidence must belong to the exact current head');
 const version=product.version;
 assert.equal(input.ok,true);assert.equal(input.base,fixed.BASE);assert.equal(input.baselineSHA256,fixed.BASE_HTML_SHA256);assert.equal(input.currentSHA256,product.sourceSHA256);assert.equal(input.restored,true);
 assert.match(input.checkedSHA,/^[0-9a-f]{40}$/);assert.equal(input.workflowSHA,input.checkedSHA);
 const timingEvidence=compat.validateTimingEvidence014(input);
 const out=compat.normalizeCompatibility014(input.runs,product);
 assert.deepEqual(out.reference,out.comparison,'Every complete historical observation must remain equal');
 assert.equal(JSON.stringify(out.reference),JSON.stringify(out.comparison),'Complete JSON equality includes raw native save bytes and key ordering');
 assert.equal(JSON.stringify(input),raw,'Original raw evidence remains untouched');assert.equal(out.metadataNormalization.normalizedFields,product.release?66:0);assert.deepEqual(out.metadataNormalization.paths,product.release?[...compat.METADATA_PATHS014,...compat.SAVE_PATHS014]:[]);
 assert.equal(out.metadataNormalization.applied,product.release);assert.equal(out.metadataNormalization.sameLabelExact,!product.release);
 assert.deepEqual(out.metadataNormalization.validatedPaths,[...compat.METADATA_PATHS014,...compat.SAVE_PATHS014]);
 assert.equal(new Set(out.metadataNormalization.changes.map(q=>q.path)).size,product.release?66:0);
 const rejected=[];
 for(const[seed,field]of[[900725,'nativeSave'],[900726,'nativeSave'],[900726,'continueSave']])for(const[name,mutate]of[
  ['duplicate gameVer',s=>s.replace('"v":1','"gameVer":'+JSON.stringify(version)+',"v":1')],
  ['missing gameVer',s=>s.replace(',"gameVer":'+JSON.stringify(version),'')],
  ['wrong gameVer',s=>s.replace('"gameVer":'+JSON.stringify(version),'"gameVer":"14.32"')],
  ['nested unrelated ver',s=>s.replace('"region":{','"unrelated":{"ver":'+JSON.stringify(version)+'},"region":{')],
  ['nested gameVer',s=>s.replace('"region":{','"unrelated":{"gameVer":'+JSON.stringify(version)+'},"region":{')],
  ['duplicate root region',s=>s.replace('"v":1','"region":{},"v":1')],
  ['duplicate region version',s=>s.replace('"region":{','"region":{"ver":'+JSON.stringify(version)+',')],
  ['missing region version',s=>s.replace(',"ver":'+JSON.stringify(version),'')],
  ['wrong region version',s=>s.replace('"ver":'+JSON.stringify(version),'"ver":"14.32"')],
  ['region nonlabel value',s=>{const q=JSON.parse(s);return s.replace('"tourists":'+JSON.stringify(q.region.tourists),'"tourists":'+JSON.stringify(q.region.tourists+1));}],
  ['unchanged key order',s=>{const q=JSON.parse(s);return s.replace('"stations":'+JSON.stringify(q.region.stations)+',"ports":'+JSON.stringify(q.region.ports),'"ports":'+JSON.stringify(q.region.ports)+',"stations":'+JSON.stringify(q.region.stations));}],
  ['nonlabel whitespace',s=>s.replace('"df":1','"df": 1')],
  ['trailing whitespace',s=>s+' '],
  ['unrelated release label',s=>s.replace('"df":1','"unapprovedLabel":"14.31","df":1')]
 ]){
  const runs=structuredClone(input.runs),world=runs[1].result.find(w=>w.seed===seed),before=world[field];world[field]=mutate(before);assert.notEqual(world[field],before,'Negative fixture must mutate: '+seed+'/'+field+'/'+name);
  const rawMutation=JSON.stringify(runs);let failed=false;try{const q=compat.normalizeCompatibility014(runs,product);failed=!eq(q.reference,q.comparison)||JSON.stringify(q.reference)!==JSON.stringify(q.comparison);}catch{failed=true;}
  assert.equal(failed,true,name);assert.equal(JSON.stringify(runs),rawMutation,'Negative raw evidence remains untouched');rejected.push(seed+'/'+field+'/'+name);
 }
 return{ok:true,sourceOnly:true,gameExecuted:false,archivedSHA:input.checkedSHA,artifactJSONSHA256:fixed.hash(bytes||Buffer.from(raw)),sourceSHA256:product.sourceSHA256,currentSourceSHA256:currentProduct.sourceSHA256,currentPhase:currentProduct.phase,approvedNativeInputRecordsVerified:approvedNative,currentInputRecordsVerified:!approvedNative,currentReleaseRuntimeVerified:!approvedNative&&currentProduct.release,worlds:8,checkpointCounts:compat.CHECKPOINT_COUNTS014,completeObservationsEqual:true,completeNativeSaveBytesEqual:true,realContinueAndFollowingDayCompared:true,rawObservationsPreserved:true,metadataNormalization:out.metadataNormalization,timingEvidence,rejected,staticCases:compat.staticNormalizationTest014().cases};
}
function replayWallClock014(input,bytes){
 const raw=JSON.stringify(input),derived=structuredClone(input),product=fixed.verifyStatic014();
 assert.equal(input.currentSHA256,product.sourceSHA256);assert.equal(input.base,fixed.BASE);assert.equal(input.baselineSHA256,fixed.BASE_HTML_SHA256);
 assert.equal(input.runs.length,2);
 if(!product.release)assert.equal(JSON.stringify(input.runs[0].result.slice(0,7)),JSON.stringify(input.runs[1].result.slice(0,7)),'All seven same-label old worlds must already be byte-identical');
 derived.theatreTimingEvidence014=[];
 for(const run of derived.runs){const index=run.result.findIndex(w=>w.seed===900726),split=compat.separateTheatreTiming014(run.result[index]);assert.equal(index,7);derived.theatreTimingEvidence014.push({label:run.label,...split.evidence});run.result[index]=split.world;}
 const timingEvidence=compat.validateTimingEvidence014(derived),q=compat.normalizeCompatibility014(derived.runs,product);
 assert.equal(JSON.stringify(q.reference.slice(0,7)),JSON.stringify(q.comparison.slice(0,7)),'All seven old worlds remain exact with only verified release labels normalized');
 assert.equal(JSON.stringify(q.reference),JSON.stringify(q.comparison),'Only explicit clock values may explain original failure');
 const rejected=[];
 for(const[name,mutate]of[
  ['native mobility execution counter',w=>w.checkpoints[1].nativeMobility.performance.runs++],['money',w=>w.checkpoints[1].stats.money++],['powered buildings',w=>w.checkpoints[1].stats.poweredBld++],['RNG',w=>w.checkpoints[1].rngState++],['full tile hash',w=>w.checkpoints[1].tilesSHA256+='bad'],['native mobility labor',w=>w.checkpoints[1].nativeMobility.labor.assigned++],['theatre staff',w=>w.checkpoints[1].roots[0].evidence.employed++],['full native save bytes',w=>w.nativeSave+=' '],['full Continue save bytes',w=>w.continueSave+=' '],['extra native timing key',w=>w.checkpoints[1].nativeMobility.performance.otherMs=12],['unrelated nested timing field',w=>w.checkpoints[1].other={lastMs:12}]
 ]){
  const rows=structuredClone(input.runs);mutate(rows[1].result[7]);let fails=false;
  try{for(const row of rows)row.result[7]=compat.separateTheatreTiming014(row.result[7]).world;const comparison=compat.normalizeCompatibility014(rows,product);fails=JSON.stringify(comparison.reference)!==JSON.stringify(comparison.comparison);}catch{fails=true;}
  assert.equal(fails,true,name);rejected.push(name);
 }
 assert.equal(JSON.stringify(input),raw,'Original failed artifact must remain unchanged');
 const [a,b]=derived.theatreTimingEvidence014,changed=a.paths.filter((p,i)=>p.value!==b.paths[i].value).map(p=>p.path);
 return{ok:true,sourceOnly:true,gameExecuted:false,actualRuntimeStillRequired:true,originalResult:input.ok,originalError:input.error,originalArtifactSHA256:fixed.hash(bytes||Buffer.from(raw)),originalCheckedSHA:input.checkedSHA,currentSourceSHA256:product.sourceSHA256,originalSevenWorldsByteExact:!product.release,originalSevenWorldsEqualAfterDeclaredLabels:true,completeDeterministicEighthWorldEqual:true,completeRawSavesEqual:true,metadataNormalization:q.metadataNormalization,originalFailedArtifactPreserved:true,changedClockValues:changed.length,changedClockPaths:changed,timingEvidence,rejected};
}
module.exports={test014,replayWallClock014,APPROVED_COMPATIBILITY_SHA256};
if(require.main===module){if(process.argv[2]==='--replay-wall-clock'){if(process.argv.length!==4)throw Error('Use --replay-wall-clock <original-failed-compatibility.json>');const bytes=fs.readFileSync(process.argv[3]);console.log(JSON.stringify(replayWallClock014(JSON.parse(bytes),bytes),null,2));}else if(process.argv[2]==='--static-test'){if(process.argv.length!==3)throw Error('No extra static-test arguments');console.log(JSON.stringify(compat.staticNormalizationTest014(),null,2));}else{const approvedNative=process.argv[2]==='--approved-native';if(process.argv.length!==(approvedNative?4:3))throw Error('Use node complexes-compatibility014.test.js [--approved-native] <original-compatibility.json>');const bytes=fs.readFileSync(process.argv[approvedNative?3:2]);console.log(JSON.stringify(test014(JSON.parse(bytes),bytes,{approvedNative}),null,2));}}

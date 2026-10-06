#!/usr/bin/env node
'use strict';
// Retains every original42 raw-save mutation case. Same-label T729 candidate
// requires zero changes; future release metadata cannot be normalized.
const fs=require('node:fs'),assert=require('node:assert/strict'),{isDeepStrictEqual:eq}=require('node:util'),{execFileSync}=require('node:child_process');
const fixed=require('./quayside-static-contract017'),compat={...require('./quayside-compatibility017'),normalizeCompatibility016:require('./quayside-compatibility017').normalizeCompatibility017};
function test014(input,bytes){
 const currentProduct=fixed.verifyStatic017(),raw=JSON.stringify(input),product=currentProduct;
 assert.equal(input.checkedSHA,execFileSync('git',['rev-parse','HEAD'],{cwd:__dirname,encoding:'utf8'}).trim(),'Current evidence must belong to the exact current head');
 if(process.env.GITHUB_ACTIONS==='true')assert.equal(input.checkedSHA,process.env.GITHUB_SHA);
 const version=product.version;
 assert.equal(input.ok,true);assert.equal(input.base,fixed.BASE);assert.equal(input.baselineSHA256,fixed.BASE_HTML_SHA256);assert.equal(input.currentSHA256,product.sourceSHA256);assert.equal(input.restored,true);
 assert.match(input.checkedSHA,/^[0-9a-f]{40}$/);assert.equal(input.workflowSHA,input.checkedSHA);
 const timingEvidence=compat.validateTimingEvidence014(input);
 const out=compat.normalizeCompatibility017(input.runs,product);
 assert.deepEqual(out.reference,out.comparison,'Every complete historical observation must remain equal');
 assert.equal(JSON.stringify(out.reference),JSON.stringify(out.comparison),'Complete JSON equality includes raw native save bytes and key ordering');
 assert.equal(JSON.stringify(input),raw,'Original raw evidence remains untouched');assert.equal(out.metadataNormalization.normalizedFields,0);assert.deepEqual(out.metadataNormalization.paths,[]);
 assert.equal(product.release,false);assert.equal(product.publicationApproved,false);assert.equal(out.metadataNormalization.applied,false);assert.equal(out.metadataNormalization.sameLabelExact,true);
 assert.deepEqual(out.metadataNormalization.validatedPaths,[...compat.METADATA_PATHS014,...compat.SAVE_PATHS014]);
 assert.equal(new Set(out.metadataNormalization.changes.map(q=>q.path)).size,0);
 const rejected=[];
 for(const[seed,field]of[[900725,'nativeSave'],[900726,'nativeSave'],[900726,'continueSave']])for(const[name,mutate]of[
  ['duplicate gameVer',s=>s.replace('"v":1','"gameVer":'+JSON.stringify(version)+',"v":1')],
  ['missing gameVer',s=>s.replace(',"gameVer":'+JSON.stringify(version),'')],
  ['wrong gameVer',s=>s.replace('"gameVer":'+JSON.stringify(version),'"gameVer":"99.99"')],
  ['nested unrelated ver',s=>s.replace('"region":{','"unrelated":{"ver":'+JSON.stringify(version)+'},"region":{')],
  ['nested gameVer',s=>s.replace('"region":{','"unrelated":{"gameVer":'+JSON.stringify(version)+'},"region":{')],
  ['duplicate root region',s=>s.replace('"v":1','"region":{},"v":1')],
  ['duplicate region version',s=>s.replace('"region":{','"region":{"ver":'+JSON.stringify(version)+',')],
  ['missing region version',s=>s.replace(',"ver":'+JSON.stringify(version),'')],
  ['wrong region version',s=>s.replace('"ver":'+JSON.stringify(version),'"ver":"99.99"')],
  ['region nonlabel value',s=>{const q=JSON.parse(s);return s.replace('"tourists":'+JSON.stringify(q.region.tourists),'"tourists":'+JSON.stringify(q.region.tourists+1));}],
  ['unchanged key order',s=>{const q=JSON.parse(s);return s.replace('"stations":'+JSON.stringify(q.region.stations)+',"ports":'+JSON.stringify(q.region.ports),'"ports":'+JSON.stringify(q.region.ports)+',"stations":'+JSON.stringify(q.region.stations));}],
  ['nonlabel whitespace',s=>s.replace('"df":1','"df": 1')],
  ['trailing whitespace',s=>s+' '],
  ['unrelated release label',s=>s.replace('"df":1','"unapprovedLabel":"14.31","df":1')]
 ]){
  const runs=structuredClone(input.runs),world=runs[1].result.find(w=>w.seed===seed),before=world[field];world[field]=mutate(before);assert.notEqual(world[field],before,'Negative fixture must mutate: '+seed+'/'+field+'/'+name);
  const rawMutation=JSON.stringify(runs);let failed=false;try{const q=compat.normalizeCompatibility016(runs,product);failed=!eq(q.reference,q.comparison)||JSON.stringify(q.reference)!==JSON.stringify(q.comparison);}catch{failed=true;}
  assert.equal(failed,true,name);assert.equal(JSON.stringify(runs),rawMutation,'Negative raw evidence remains untouched');rejected.push(seed+'/'+field+'/'+name);
 }
 return{ok:true,sourceOnly:true,gameExecuted:false,archivedSHA:input.checkedSHA,artifactJSONSHA256:fixed.hash(bytes||Buffer.from(raw)),sourceSHA256:product.sourceSHA256,currentSourceSHA256:currentProduct.sourceSHA256,currentPhase:currentProduct.phase,approvedNativeInputRecordsVerified:false,currentInputRecordsVerified:true,currentReleaseRuntimeVerified:product.release,worlds:8,checkpointCounts:compat.CHECKPOINT_COUNTS014,completeObservationsEqual:true,completeNativeSaveBytesEqual:true,realContinueAndFollowingDayCompared:true,rawObservationsPreserved:true,metadataNormalization:out.metadataNormalization,timingEvidence,rejected,original42Cases:rejected.length};
}
module.exports={test017:test014};
if(require.main===module){if(process.argv.length!==3)throw Error('Use exact current compatibility.json');const b=fs.readFileSync(process.argv[2]);console.log(JSON.stringify(test014(JSON.parse(b),b),null,2));}

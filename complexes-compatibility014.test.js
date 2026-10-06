#!/usr/bin/env node
'use strict';
// Source/data recheck of original eight-world CI evidence. Never starts a game.
const fs=require('node:fs'),assert=require('node:assert/strict'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./complexes-static-contract014'),compat=require('./complexes-compatibility014');
function test014(input,bytes){
 const product=fixed.verifyStatic014(),raw=JSON.stringify(input);
 assert.equal(input.base,fixed.BASE);assert.equal(input.baselineSHA256,fixed.BASE_HTML_SHA256);assert.equal(input.currentSHA256,product.sourceSHA256);assert.equal(input.restored,true);
 assert.match(input.checkedSHA,/^[0-9a-f]{40}$/);assert.equal(input.workflowSHA,input.checkedSHA);
 const out=compat.normalizeCompatibility014(input.runs,product);
 assert.deepEqual(out.reference,out.comparison,'Every complete historical observation must remain equal');
 assert.equal(JSON.stringify(out.reference),JSON.stringify(out.comparison),'Complete JSON equality includes raw native save bytes and key ordering');
 assert.equal(JSON.stringify(input),raw,'Original raw evidence remains untouched');assert.equal(out.metadataNormalization.normalizedFields,0);assert.deepEqual(out.metadataNormalization.paths,[]);
 const rejected=[];
 for(const[seed,field]of[[900725,'nativeSave'],[900726,'nativeSave'],[900726,'continueSave']])for(const[name,mutate]of[
  ['duplicate gameVer',s=>s.replace('"v":1','"gameVer":"14.30","v":1')],
  ['nested unrelated ver',s=>s.replace('"region":{','"unrelated":{"ver":"14.30"},"region":{')],
  ['nested gameVer',s=>s.replace('"region":{','"unrelated":{"gameVer":"14.30"},"region":{')],
  ['duplicate root region',s=>s.replace('"v":1','"region":{},"v":1')],
  ['duplicate region version',s=>s.replace('"region":{','"region":{"ver":"14.30",')],
  ['missing region version',s=>s.replace(',"ver":"14.30"','')],
  ['wrong region version',s=>s.replace('"ver":"14.30"','"ver":"14.31"')],
  ['region nonlabel value',s=>{const q=JSON.parse(s);return s.replace('"tourists":'+JSON.stringify(q.region.tourists),'"tourists":'+JSON.stringify(q.region.tourists+1));}],
  ['unchanged key order',s=>{const q=JSON.parse(s);return s.replace('"stations":'+JSON.stringify(q.region.stations)+',"ports":'+JSON.stringify(q.region.ports),'"ports":'+JSON.stringify(q.region.ports)+',"stations":'+JSON.stringify(q.region.stations));}],
  ['nonlabel whitespace',s=>s.replace('"df":1','"df": 1')]
 ]){
  const runs=structuredClone(input.runs),world=runs[1].result.find(w=>w.seed===seed),before=world[field];world[field]=mutate(before);assert.notEqual(world[field],before,'Negative fixture must mutate: '+seed+'/'+field+'/'+name);
  const rawMutation=JSON.stringify(runs);let failed=false;try{const q=compat.normalizeCompatibility014(runs,product);failed=!eq(q.reference,q.comparison)||JSON.stringify(q.reference)!==JSON.stringify(q.comparison);}catch{failed=true;}
  assert.equal(failed,true,name);assert.equal(JSON.stringify(runs),rawMutation,'Negative raw evidence remains untouched');rejected.push(seed+'/'+field+'/'+name);
 }
 return{ok:true,sourceOnly:true,gameExecuted:false,archivedSHA:input.checkedSHA,artifactJSONSHA256:fixed.hash(bytes||Buffer.from(raw)),sourceSHA256:product.sourceSHA256,worlds:8,checkpointCounts:compat.CHECKPOINT_COUNTS014,completeObservationsEqual:true,completeNativeSaveBytesEqual:true,realContinueAndFollowingDayCompared:true,rawObservationsPreserved:true,metadataNormalization:out.metadataNormalization,rejected,staticCases:compat.staticNormalizationTest014().cases};
}
module.exports={test014};
if(require.main===module){if(process.argv[2]==='--static-test'){if(process.argv.length!==3)throw Error('No extra static-test arguments');console.log(JSON.stringify(compat.staticNormalizationTest014(),null,2));}else{if(process.argv.length!==3)throw Error('Use node complexes-compatibility014.test.js <original-compatibility.json>');const bytes=fs.readFileSync(process.argv[2]);console.log(JSON.stringify(test014(JSON.parse(bytes),bytes),null,2));}}

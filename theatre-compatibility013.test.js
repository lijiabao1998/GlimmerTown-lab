#!/usr/bin/env node
'use strict';
// Source/data only: recheck an original compatibility observation JSON without
// a browser, game, fake Actions environment or mutable native baseline.
const fs=require('node:fs'),assert=require('node:assert/strict'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./theatre-static-contract013'),compat=require('./theatre-compatibility013');
if(process.argv.length!==3)throw Error('Use node theatre-compatibility013.test.js <original-compatibility.json>');
const bytes=fs.readFileSync(process.argv[2]),input=JSON.parse(bytes),product=fixed.verifyStatic013();
assert.equal(input.base,fixed.BASE);assert.equal(input.baselineSHA256,fixed.BASE_HTML_SHA256);
assert.equal(input.currentSHA256,product.sourceSHA256);assert.equal(input.restored,true);
assert.match(input.checkedSHA,/^[0-9a-f]{40}$/);assert.equal(input.workflowSHA,input.checkedSHA);
const raw=JSON.stringify(input),out=compat.normalizeCompatibility013(input.runs,product);
assert.deepEqual(out.reference,out.comparison,'Every complete observation must remain equal');
assert.equal(JSON.stringify(out.reference),JSON.stringify(out.comparison),'Complete JSON equality includes native save bytes and key ordering');
assert.equal(JSON.stringify(input),raw,'Original observations must remain untouched');
assert.equal(out.metadataNormalization.normalizedFields,product.release?44:0);
const rejected=[];
for(const[name,mutate]of[
 ['unrelated nested ver',s=>s.replace('"food":0','"food":0,"unrelated":{"ver":"14.30"}')],
 ['duplicate region ver',s=>s.replace('"stations":0','"ver":"14.30","stations":0')],
 ['duplicate root region',s=>s.replace('"v":1','"region":{},"v":1')],
 ['missing region ver',s=>s.replace(',"ver":'+JSON.stringify(product.version),'')],
 ['wrong region ver',s=>s.replace('"ver":'+JSON.stringify(product.version),'"ver":"14.31"')],
 ['region nonlabel value',s=>s.replace('"tourists":79','"tourists":80')],
 ['unchanged-key order difference',s=>s.replace('"stations":0,"ports":0','"ports":0,"stations":0')],
 ['nonlabel whitespace byte',s=>s.replace('"df":1','"df": 1')]
]){
 const runs=structuredClone(input.runs),world=runs[1].result.find(w=>w.seed===900725),before=world.nativeSave;
 world.nativeSave=mutate(before);assert.notEqual(world.nativeSave,before,'Negative fixture must really mutate: '+name);
 const observation=JSON.stringify(runs);let fails=false;
 try{const q=compat.normalizeCompatibility013(runs,product);fails=!eq(q.reference,q.comparison)||JSON.stringify(q.reference)!==JSON.stringify(q.comparison);}catch{fails=true;}
 assert.equal(fails,true,name);assert.equal(JSON.stringify(runs),observation,'Negative raw observation remains untouched');rejected.push(name);
}
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,archivedSHA:input.checkedSHA,artifactJSONSHA256:fixed.hash(bytes),sourceSHA256:product.sourceSHA256,worlds:7,completeObservationsEqual:true,completeNativeSaveBytesEqual:true,rawObservationsPreserved:true,metadataNormalization:out.metadataNormalization,rejected,staticCases:compat.staticNormalizationTest013().cases},null,2));

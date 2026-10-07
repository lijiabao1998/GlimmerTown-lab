#!/usr/bin/env node
'use strict';
// Exact original017 artifact assertions, supplied only current018 dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{isDeepStrictEqual:eq}=require('node:util'),{execFileSync}=require('node:child_process');
const fixed=require('./waterfront-static-contract018'),current=require('./waterfront-compatibility018');
function buildTest018(){
 const file='quayside-compatibility017.test.js',source=fs.readFileSync(path.join(__dirname,file),'utf8');assert.equal(source,fixed.baseFile(file).toString());
 const start='function test014(input,bytes){',end='\nmodule.exports=';assert.equal(source.split(start).length,2);assert.equal(source.split(end).length,2);const body=source.slice(source.indexOf(start),source.indexOf(end));
 const compat={...current,normalizeCompatibility017:current.normalizeCompatibility018,normalizeCompatibility016:current.normalizeCompatibility018};
 const bindings={fs,assert,eq,execFileSync,__dirname,structuredClone,process,Buffer,fixed:{...fixed,verifyStatic017:fixed.verifyStatic018},compat};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){'+body+';return test014;})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{originalArtifactAssertionsExact:true,originalSourceSHA256:fixed.hash(body),sourceOnly:true,gameExecuted:false}};
}
function test018(input,bytes){const q=buildTest018();return{...q.fn(input,bytes),...q.proof,currentCandidateApproval:false};}
function staticTest018(){const q=buildTest018(),controls=current.staticNormalizationTest018();assert.equal(controls.normalizedFields,0);assert.equal(controls.raw42.rejected.length,42);assert.equal(controls.originalHistoricalControls.releaseControls.raw42.rejected.length,42);assert.equal(controls.allHistoricalSyntheticControlsRetained,true);assert.equal(controls.currentReleasePermitted,true);assert.equal(controls.runtimeControls.cases,98);assert.equal(controls.worlds,8);assert.equal(controls.timing.separatedPerWorld,18);assert.equal(controls.releaseControls.raw42.rejected.length,42);assert.equal(controls.releaseControls.releaseNormalizedFields,66);assert.equal(controls.releaseControls.releaseEnterpriseFields,60);assert.equal(controls.releaseControls.releaseRawSaveFields,6);assert.equal(controls.releaseControls.declaredPaths.length,14);assert.equal(controls.releaseControls.everyOriginalReleaseAssertionRetained,true);return{ok:true,...q.proof,controls};}
module.exports={test018,buildTest018,staticTest018};
if(require.main===module){if(process.argv.length!==3)throw Error('Use --static-test or exact current compatibility.json');console.log(JSON.stringify(process.argv[2]==='--static-test'?staticTest018():test018(JSON.parse(fs.readFileSync(process.argv[2])),fs.readFileSync(process.argv[2])),null,2));}

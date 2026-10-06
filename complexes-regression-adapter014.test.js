#!/usr/bin/env node
'use strict';
// Text transformations, immutable-source comparisons and syntax only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const fixed=require('./complexes-static-contract014'),adapter=require('./complexes-regression-adapter014');
function test014(){
 const result=adapter.staticTest014();assert.equal(result.ok,true);assert.equal(result.gameExecuted,false);assert.equal(result.results.length,8);
 const sourceAudits=[];
 for(const suite of Object.keys(adapter.FILES)){
  const q=adapter.buildAdapter014(suite);assert.equal(q.proof.reversibleExactSourceAudit,true);assert.equal(q.proof.runtimeFunctionsExact,true);assert.equal(q.proof.gameplayAssertionsExact,true);
  let source=q.adapted;for(const edit of [...q.audit].reverse()){assert.equal(source.split(edit.to).length-1,edit.count);source=source.split(edit.to).join(edit.from);}
  const prior=suite==='theatre'?q.original:require('./theatre-regression-adapter013').buildAdapter013(suite).adapted;assert.equal(source,prior);
  for(const range of q.proof.preservedRanges)assert.equal(range.exact,true);
  assert.equal(q.proof.historicalSources.length,265);assert.equal(q.proof.historicalSources.every(s=>s.deployedExact),true);
  if(suite==='theatre'){
   assert.equal(q.audit.length,1);assert.equal(q.adapted.split("report.performance.mean<1000").length,2);assert.equal(q.adapted.split("report.purity.ms<20000").length,2);
   assert.equal(q.adapted.split("report.fingerprintNegativeTests.rejected.length===16").length,2);
  }
  if(suite==='compatibility'){
   const expression="require('./complexes-compatibility014').riversideRuntimeSource014()";
   assert.equal(q.adapted.split(expression).length,2);assert.equal(q.adapted.includes('riversideCompat.runRiversideWorld013.toString()'),false);
   assert.equal(q.audit.filter(e=>e.from==='riversideCompat.runRiversideWorld013.toString()'&&e.to===expression&&e.count===1).length,1);
   const src=require('./complexes-compatibility014').riversideRuntimeSource014();new vm.Script('('+src+')');
   assert.deepEqual(q.proof.historicalRiversideLabelGuardOnly,require('./complexes-compatibility014').riversideRuntimeAudit014());
  }
  // The exact reversible audit must reject one omitted, duplicated, or mutated
  // replacement. This is data logic, never execution of the generated runner.
  const recover=adapted=>{let text=adapted;for(const edit of [...q.audit].reverse()){if(text.split(edit.to).length-1!==edit.count)throw Error('Nonunique reverse anchor');text=text.split(edit.to).join(edit.from);}if(text!==prior)throw Error('Unlisted source edit');};
  assert.throws(()=>recover(q.adapted+'\n'));assert.throws(()=>recover(q.adapted+q.audit[0].to));assert.throws(()=>recover(q.adapted.replace(q.audit[0].to,q.audit[0].from)));new vm.Script(q.adapted);
  sourceAudits.push({suite,transformations:q.audit.length,preservedRanges:q.proof.preservedRanges.length,negativeSourceChanges:3});
 }
 const pins=adapter.pinnedSourceControls014();assert.equal(pins.releaseControls.rejectedCount,45);
 const oldFixtures=require('./theatre-gameplay013').legacyFixtures013();assert.equal(oldFixtures.exactHistoricalFunctionBodies,true);
 const compat=require('./complexes-compatibility014'),newSource=compat.runTheatreWorld014.toString()+compat.continueTheatreWorld014.toString()+compat.snapshotTheatreWorld014.toString();
 assert.doesNotMatch(newSource,/localStorage\.removeItem|recompute|ensurePower|markPowerDirty|refresh.*Utilities|\.age\s*=|\.pw\s*=|\.wa\s*=/);
 assert.match(compat.runCompleteTheatreWorld014.toString(),/Page\.reload/);assert.match(compat.continueTheatreWorld014.toString(),/bContinue/);
 return{ok:true,sourceOnly:true,gameExecuted:false,historicalSources:265,suites:sourceAudits,pinnedSourceControls:pins.releaseControls.rejectedCount,compatibilityCases:result.metadataNormalization.cases,oldCompatibilityCases:result.metadataNormalization.oldControls.cases,oldRuntimeFunctionsExact:true,noPerformanceThresholdChange:true,eighthWorldRealContinue:true,noGetterRepair:true};
}
module.exports={test014};
if(require.main===module){if(process.argv.length!==2)throw Error('No runtime or browser arguments accepted');console.log(JSON.stringify(test014(),null,2));}

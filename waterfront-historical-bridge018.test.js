#!/usr/bin/env node
'use strict';
// Source-only/data-only. --archived-data accepts prior native JSON as archived
// mutation-control input; --approved-native-data checks pinned f212 data only.
// Neither mode claims exact-current-head or fresh runtime proof.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const fixed=require('./waterfront-static-contract018'),native=require('./waterfront-fingerprint018'),bridge=require('./waterfront-historical-bridge018'),{exactTransform018}=require('./waterfront-compatibility018');
function buildTest018(){
 const file='complexes-historical-bridge014.test.js',source=fs.readFileSync(path.join(__dirname,file),'utf8');assert.equal(source,fixed.baseFile(file).toString());
 const start='function test014(input,{synthetic=false,approvedNative=false}={}){',end='\nmodule.exports=';assert.equal(source.split(start).length,2);assert.equal(source.split(end).length,2);const body=source.slice(source.indexOf(start),source.indexOf(end));
 const q=exactTransform018(body,[
  [start,'function test014(input,{synthetic=false,approvedNative=false,archiveDataOnly=false}={}){'],
  ['if(!synthetic){','if(!synthetic&&!archiveDataOnly){'],
  ['assert.equal(Object.keys(fp.subs).length,3059);','assert.equal(Object.keys(fp.subs).length,3147);'],
  ['assert.equal(proof.oldLeaves,2947);assert.equal(proof.newLeaves,112);assert.equal(proof.leaves,3059);assert.equal(proof.currentFamilies,160);','assert.equal(proof.oldLeaves,3139);assert.equal(proof.newLeaves,8);assert.equal(proof.leaves,3147);assert.equal(proof.currentFamilies,164);'],
  ['[[theatre,2947,2919,28,112],[river,2919,2895,24,140],[museum,2895,2879,16,164]]','[[theatre,2947,2919,28,200],[river,2919,2895,24,228],[museum,2895,2879,16,252]]'],
  ['assert.equal(q.currentLeaves,3059);assert.equal(q.currentNativeFamilies,160);','assert.equal(q.currentLeaves,3147);assert.equal(q.currentNativeFamilies,164);'],
  ['assert.equal(current18.rejected.length,18);','assert.equal(current18.rejected.length,12);assert.equal(current18.original29.rejected.length,29);'],
  ['currentLeaves:3059,currentFamilies:160,completeOldRecordsCompared:2947','currentLeaves:3147,currentFamilies:164,completeOldRecordsCompared:3139'],
  ['projections:{theatre:{old:2919,added:28,removed:112},riverside:{old:2895,added:24,removed:140},museum:{old:2879,added:16,removed:164}}','projections:{theatre:{old:2919,added:28,removed:200},riverside:{old:2895,added:24,removed:228},museum:{old:2879,added:16,removed:252}}'],
  ["boundedLogRecovery:[...(product.release?['T727']:[]),'T726'","boundedLogRecovery:[...(product.release?['T731']:[]),'T730','T729','T728','T727','T726'"]
 ]);
 const aliases={...native,verifyFingerprint014:native.verifyFingerprint018,staticTest014:native.staticTest018,pinnedBaseline014:require('./complexes-fingerprint-qa014').pinnedBaseline014};
 const bindings={fs,assert,path,execFileSync,__dirname,structuredClone,process,require,fixed,native:aliases,bridge};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){'+q.adapted+';return test014;})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{...q.proof,originalFile:file,everyUnlistedOriginalAssertionExact:true,sourceOnly:true,gameExecuted:false}};
}
function test018(input,{archiveDataOnly=false,approvedNativeData=false}={}){
 const q=buildTest018(),product=bridge.currentProduct014();
 assert.equal(archiveDataOnly&&approvedNativeData,false,'Archived and approved-native modes are distinct');assert.equal(product.publicationApproved,product.release);assert.equal(product.phase,product.release?'release':'candidate');
 if(approvedNativeData){assert.notEqual(process.env.GITHUB_ACTIONS,'true','Approved native data controls cannot replace current-head Actions evidence');const contract=require('./waterfront-release-contract018');assert.equal(input.checkedSHA,contract.APPROVED_SHA);assert.equal(input.sourceSHA256,contract.APPROVED);assert.equal(input.version,'14.34');assert.equal(input.anchor,'T730');assert.equal(input.release,false);contract.verifyApprovedNative018(input.fp,input.blocks);}
 else{assert.equal(input.sourceSHA256,product.sourceSHA256,'Archived or current data must match the exact current product source');assert.equal(input.version,product.version);assert.equal(input.anchor,product.anchor);assert.equal(input.release,product.release);}assert.match(input.checkedSHA,/^[0-9a-f]{40}$/);
 const out=q.fn(input,{archiveDataOnly:archiveDataOnly||approvedNativeData}),raw=JSON.stringify(input),projected=native.project018(input.fp,input.blocks),lineage=bridge.museumLineage014(input.fp,input.blocks,product);
 assert.equal(Object.keys(projected.fp.subs).length,3139);assert.equal(projected.fp.stats.families,163);assert.equal(lineage.projectedOnlyDeclared252,true);assert.equal(lineage.projectedKeys.length,252);assert.equal(lineage.currentCandidateApproval,false);assert.equal(lineage.approvalScope,'historical projected records only');assert.equal(lineage.currentNativeProof.currentCandidateApproval,false);assert.equal(lineage.currentNativeProof.approvedNativeRecordsExact,product.release);assert.equal(lineage.currentNativeProof.release,product.release);assert.equal(lineage.currentNativeProof.publicationApproved,product.release);
 assert.equal(JSON.stringify(input),raw);assert.equal(bridge.sourceAdapterProof018.reverseExact,true);
 for(const [name,method]of[['native015Contract','verifyStatic015'],['native016Contract','verifyStatic016'],['native017Contract','verifyStatic017']]){assert.equal(bridge[name].BASE,fixed.BASE);assert.equal(bridge[name][method],bridge.currentProduct014);}
 return{...out,currentInputRecordsVerified:!archiveDataOnly&&!approvedNativeData,currentHeadEvidenceVerified:!archiveDataOnly&&!approvedNativeData,archivedDataControlsOnly:archiveDataOnly,approvedNativeDataControlsOnly:approvedNativeData,approvedNativeInputRecordsVerified:approvedNativeData,currentCandidateApproval:false,approvalScope:'historical projected records only',sourceAdapter:bridge.sourceAdapterProof018,originalBridgeTestAdapter:q.proof};
}
module.exports={test018,buildTest018};
if(require.main===module){const archived=process.argv[2]==='--archived-data',approvedNativeData=process.argv[2]==='--approved-native-data',flag=archived||approvedNativeData,file=process.argv[flag?3:2];if(!file||process.argv.length!==(flag?4:3))throw Error('Use [--archived-data|--approved-native-data] native-fingerprint.json');const bytes=fs.readFileSync(file);if(approvedNativeData)assert.equal(fixed.hash(bytes),require('./waterfront-release-contract018').readReleasePins018().nativeFingerprintSHA256,'Exact approved native artifact bytes required');console.log(JSON.stringify(test018(JSON.parse(bytes),{archiveDataOnly:archived,approvedNativeData}),null,2));}

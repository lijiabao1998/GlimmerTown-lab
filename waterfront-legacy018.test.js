#!/usr/bin/env node
'use strict';
// Original historical assertions on complete data; never executes a game or renderer.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const fixed=require('./waterfront-static-contract018'),native=require('./waterfront-fingerprint018'),bridge=require('./waterfront-historical-bridge018'),compat=require('./waterfront-compatibility018');
function projectApproved018(input,target){
 const q=native.project018(input.fp,input.blocks),release=require('./'+({quayside:'quayside-release-contract017',gardenlife:'gardenlife-release-contract016',streetscape:'streetscape-release-contract015'}[target]));
 const removed=target==='quayside'?[]:[...require('./quayside-static-contract017').expectedAdditions,...(target==='streetscape'?require('./gardenlife-static-contract016').expectedAdditions:[])],subs=Object.fromEntries(Object.entries(q.fp.subs).filter(([k])=>!removed.includes(k))),fp={ok:true,subs,...native.aggregate(subs)};
 release[{quayside:'verifyApprovedNative017',gardenlife:'verifyApprovedNative016',streetscape:'verifyApprovedNative015'}[target]](fp,input.blocks);return{...q,fp,keys:[...q.keys,...removed]};
}
function originalFunction018(file,name,bindings,args){
 const old=require('./'+file),source=old[name].toString(),bytes=fs.readFileSync(path.join(__dirname,file+'.js'),'utf8');assert.equal(bytes,fixed.baseFile(file+'.js').toString());assert.equal(bytes.split(source).length,2);
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+source+');})').runInThisContext()(...Object.values(bindings));return{...fn(...args),originalFunctionSHA256:fixed.hash(source),originalFunctionStatementsExact:true};
}
function originalHistoricalControls018(input){
 const standard={fs,vm,assert,path,require,__dirname,structuredClone,fixed};
 const old18=originalFunction018('gardenlife-legacy016.test','original18Controls016',{...standard,native:{verifyFingerprint016:native.verifyFingerprint018,aggregate:native.aggregate}},[input]);
 const old44=originalFunction018('gardenlife-legacy016.test','original44ReleaseControls016',{...standard,native:{project016:(fp,blocks)=>projectApproved018({fp,blocks},'streetscape')}},[input]);
 const old20=originalFunction018('quayside-legacy017.test','original20Controls017',{...standard,native:{verifyFingerprint017:native.verifyFingerprint018,aggregate:native.aggregate}},[input]);
 const old36=originalFunction018('quayside-legacy017.test','original36ReleaseControls017',{...standard,native:{project017:(fp,blocks)=>projectApproved018({fp,blocks},'gardenlife')}},[input]);
 assert.equal(old18.rejected.length,18);assert.equal(old44.nativeNegativeCases,44);assert.equal(old20.rejected.length,20);assert.equal(old36.nativeNegativeCases,36);return{old18,old44,old20,old36};
}
function priorReleaseNativeControls018(input){
 const projected=projectApproved018(input,'quayside'),contract=require('./quayside-release-contract017'),file='quayside-release-contract017.test.js',source=fs.readFileSync(path.join(__dirname,file),'utf8');assert.equal(source,fixed.baseFile(file).toString());
 const start=' const block=Object.keys(native.blocks.entries)[0];',end='\n}\nconsole.log';assert.equal(source.split(start).length,2);assert.equal(source.split(end).length,2);const body=source.slice(source.indexOf(start),source.indexOf(end));
 const fn=new vm.Script('(function(native,contract,oldLeaf,newLeaf,rejected,assert,structuredClone,require){let nativeCases=0;'+body+';return{nativeCases,rejected};})').runInThisContext();
 const result=fn({fp:projected.fp,blocks:input.blocks},contract,Object.keys(require('./quayside-fingerprint017').pinnedBaseline017().subs)[0],contract.expected[0],[],assert,structuredClone,require);assert.equal(result.nativeCases,36);return{...result,originalStatementsExact:true,originalSourceSHA256:fixed.hash(body),historicalApprovalOnly:true};
}
function originalProjectionNegatives018(input,product){
 const source=require('./quayside-legacy017.test').test017.toString(),file=fs.readFileSync(path.join(__dirname,'quayside-legacy017.test.js'),'utf8');assert.equal(file,fixed.baseFile('quayside-legacy017.test.js').toString());assert.equal(file.split(source).length,2);
 const start=' const rejected=[];',end=' const runs=compat.normalizationFixture017';assert.equal(source.split(start).length,2);assert.equal(source.split(end).length,2);const body=source.slice(source.indexOf(start),source.indexOf(end));
 const bindings={require,structuredClone,assert,bridge,product,fixed,native:{pinnedBaseline017:native.pinnedBaseline018,aggregate:native.aggregate},q:input};
 const rejected=new vm.Script('(function('+Object.keys(bindings).join(',')+'){'+body+';return rejected;})').runInThisContext()(...Object.values(bindings));assert.equal(rejected.length,62);return{rejected,originalStatementsExact:true,originalSourceSHA256:fixed.hash(body)};
}
function test018(input,{archived=false}={}){
 const before=JSON.stringify(input),product=fixed.verifyStatic018(),head=execFileSync('git',['rev-parse','HEAD'],{cwd:__dirname,encoding:'utf8'}).trim();
 assert.equal(input.sourceSHA256,product.sourceSHA256);assert.equal(input.version,'14.34');assert.equal(input.anchor,'T730');assert.equal(input.release,false);assert.equal(product.publicationApproved,false);
 if(archived){assert.notEqual(process.env.GITHUB_ACTIONS,'true');assert.equal(input.checkedSHA,'5d538a7283e67612a6212dab42760b9e21d5e1ea');}else{assert.equal(input.checkedSHA,head);if(process.env.GITHUB_ACTIONS==='true')assert.equal(head,process.env.GITHUB_SHA);}
 const current=native.staticTest018(input),projected=native.project018(input.fp,input.blocks);assert.equal(projected.keys.length,8);assert.deepEqual(projected.fp.subs,native.pinnedBaseline018().subs);
 const lineages=[bridge.theatreLineage014(input.fp,input.blocks),bridge.riversideLineage014(input.fp,input.blocks,product),bridge.museumLineage014(input.fp,input.blocks,product)];
 for(const[q,i]of lineages.map((q,i)=>[q,i])){assert.equal(q.ok,true);assert.equal(q.leaves,[2947,2919,2895][i]);assert.equal(q.projectedKeys.length,[200,228,252][i]);assert.equal(q.currentLeaves,3147);assert.equal(q.currentNativeFamilies,164);assert.equal(q.currentCandidateApproval,false);assert.equal(q.currentNativeProof.release,false);assert.equal(q.currentNativeProof.publicationApproved,false);assert.equal(q.completeBlockRecordsExact,true);}
 const original16=bridge.staticTest013(input),original10=bridge.nativeReleaseControls013(input);assert.equal(original16.rejected.length,16);assert.equal(original10.nativeNegativeCases,10);
 const historical=originalHistoricalControls018(input),old36=priorReleaseNativeControls018(input),projection=originalProjectionNegatives018(input,product);
 const normal=compat.normalizeCompatibility018(compat.normalizationFixture018(),product);assert.equal(normal.metadataNormalization.normalizedFields,0);assert.equal(normal.metadataNormalization.applied,false);assert.deepEqual(normal.reference,normal.comparison);
 const fullLog=fs.readFileSync(path.join(__dirname,'AUTORUN-LOG.md'),'utf8'),log=bridge.historicalLog014(fullLog);assert.equal(log,execFileSync('git',['show',require('./streetlife-static-contract009').BASE+':AUTORUN-LOG.md'],{cwd:__dirname,encoding:'utf8',maxBuffer:8*1024*1024}));assert.throws(()=>bridge.historicalLog014(fullLog+'\n'));
 assert.equal(JSON.stringify(input),before);return{ok:true,sourceOnly:true,gameExecuted:false,archived,currentNativeRunClaimed:!archived&&process.env.GITHUB_ACTIONS==='true',inputCheckedSHA:input.checkedSHA,current,lineages,original16,original10,historical,old36,projection,zeroNormalization:true,fullHistoricalLogRecovered:true};
}
module.exports={test018,originalHistoricalControls018,projectApproved018};
if(require.main===module){const archived=process.argv[2]==='--archived',file=process.argv[archived?3:2];if(!file)throw Error('Use [--archived] native-fingerprint.json');console.log(JSON.stringify(test018(JSON.parse(fs.readFileSync(file)),{archived}),null,2));}

#!/usr/bin/env node
'use strict';
// Pure source/data tests. --synthetic extends approved old JSON with labelled
// synthetic112 records only; it never claims new native pixel evidence.
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const fixed=require('./complexes-static-contract014'),native=require('./complexes-fingerprint-qa014'),bridge=require('./complexes-historical-bridge014');
function test014(input,{synthetic=false}={}){
 const untouched=JSON.stringify(input);let fp=structuredClone(input.fp),blocks=structuredClone(input.blocks);
 if(synthetic){
  require('./theatre-release-contract013').verifyApprovedNative013(fp,blocks);
  assert.equal(Object.keys(fp.subs).length,2947);
  for(const[n,key]of fixed.expectedAdditions.entries()){
   const isBuilding=key.startsWith('bld.'),k=isBuilding?+key.split('.')[1].split('_')[0]:0,main=fixed.MAINS.includes(k);
   fp.subs[key]={d:(n+1).toString(16).padStart(8,'0'),op:42,w:isBuilding?(main?304:160):72,h:isBuilding?(main?320:196):92,n:(n+1001).toString(16).padStart(8,'0')};
  }
  Object.assign(fp,native.aggregate(fp.subs));
 }
 assert.equal(Object.keys(fp.subs).length,3059);
 const product=synthetic?{ok:true,version:'14.30',anchor:'T726',release:false,phase:'candidate',syntheticDataOnly:true}:bridge.currentProduct014();
 const proof=native.verifyFingerprint014(fp,blocks),theatre=bridge.theatreLineage014(fp,blocks),river=bridge.riversideLineage014(fp,blocks,product),museum=bridge.museumLineage014(fp,blocks,product),projected=bridge.project014(fp,blocks);
 assert.equal(proof.oldLeaves,2947);assert.equal(proof.newLeaves,112);assert.equal(proof.leaves,3059);assert.equal(proof.currentFamilies,160);
 for(const[q,leaves,oldLeaves,newLeaves,removed]of[[theatre,2947,2919,28,112],[river,2919,2895,24,140],[museum,2895,2879,16,164]]){
  assert.equal(q.ok,true);assert.equal(q.leaves,leaves);assert.equal(q.oldLeaves,oldLeaves);assert.equal(q.newLeaves,newLeaves);assert.equal(q.projectedKeys.length,removed);assert.equal(q.currentLeaves,3059);assert.equal(q.currentNativeFamilies,160);assert.equal(q.complexesOldLeaves,2947);assert.equal(q.complexesNewLeaves,112);assert.equal(q.completeBlockRecordsExact,true);
 }
 assert.deepEqual(projected.fp.subs,native.pinnedBaseline014().subs);assert.equal(Object.keys(projected.fp.subs).length,2947);assert.equal(Object.keys(blocks.entries).length,1728);
 const original16=bridge.staticTest013({fp,blocks});assert.equal(original16.rejected.length,16);assert.equal(original16.originalNegativeControlStatementsExact,true);
 const originalNative10=bridge.nativeReleaseControls013({fp,blocks});assert.equal(originalNative10.nativeNegativeCases,10);assert.equal(originalNative10.originalNativeControlStatementsExact,true);
 const current18=native.staticTest014({fp,blocks});assert.equal(current18.rejected.length,18);
 const rejected=[];
 const reject=(name,mutate)=>{const f=structuredClone(fp),b=structuredClone(blocks);mutate(f,b);const raw=JSON.stringify({f,b});for(const method of['project014','theatreLineage014','riversideLineage014','museumLineage014']){assert.throws(()=>bridge[method](f,b,product),undefined,name+': '+method);assert.equal(JSON.stringify({f,b}),raw,'Negative input must remain unchanged');}rejected.push(name);};
 for(const[key,label]of[['bld.281_1_0','theatre'],['bld.278_1_0','riverside'],['bld.277_1_0','museum'],[Object.keys(native.pinnedBaseline014().subs)[0],'old']])for(const field of['d','n','op','w','h'])reject(label+' complete '+field+' mutation with rebuilt aggregate',f=>{f.subs[key][field]=typeof f.subs[key][field]==='number'?f.subs[key][field]+1:'ffffffff';Object.assign(f,native.aggregate(f.subs));});
 for(const key of['bld.281_1_0','bld.278_1_0','bld.277_1_0']){
  reject('undeclared field in '+key,f=>{f.subs[key].extra=true;Object.assign(f,native.aggregate(f.subs));});
  reject('missing full record '+key,f=>{delete f.subs[key];Object.assign(f,native.aggregate(f.subs));});
 }
 reject('unknown complex key cannot be projected out',f=>{f.subs['complexes014.unknown_0']={...f.subs[fixed.expectedAdditions[0]]};Object.assign(f,native.aggregate(f.subs));});
 reject('missing declared complex key',f=>{delete f.subs[fixed.expectedAdditions[0]];Object.assign(f,native.aggregate(f.subs));});
 reject('complete block extra field with unchanged family/count',(_,b)=>{b.entries[Object.keys(b.entries)[0]].extra=true;});
 reject('complete block missing record with unchanged family/count',(_,b)=>{delete b.entries[Object.keys(b.entries)[0]];});
 reject('complete block extra record with unchanged family/count',(_,b)=>{b.entries.undeclared={...Object.values(b.entries)[0]};});
 reject('complete aggregate mutation',f=>{f.families.complexes014.crc='bad';});
 reject('complete statistics mutation',f=>{f.stats.leaves--;});
 const log=fs.readFileSync(path.join(__dirname,'AUTORUN-LOG.md'),'utf8'),old=bridge.historicalLog014(log),target=require('./streetlife-static-contract009').BASE;
 assert.equal(old,execFileSync('git',['show',target+':AUTORUN-LOG.md'],{cwd:__dirname,encoding:'utf8',maxBuffer:8*1024*1024}));
 for(const[name,value]of[['non-entry log append',log+'\n'],['missing bounded T726 label',log.replace('<!-- T726 release entry BEGIN -->','<!-- altered BEGIN -->')],['duplicate bounded T726 label',log+'<!-- T726 release entry BEGIN -->\n<!-- T726 release entry END -->\n']]){assert.throws(()=>bridge.historicalLog014(value),undefined,name);rejected.push(name);}
 assert.equal(JSON.stringify(input),untouched,'Input native evidence must stay unchanged');
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticNewRecords:synthetic,candidatePixelsGenerated:false,notCandidatePixelEvidence:synthetic,inputEvidenceUnchanged:true,inputCheckedSHA:input.checkedSHA||null,inputSourceSHA256:input.sourceSHA256||null,currentInputRecordsVerified:!synthetic,currentLeaves:3059,currentFamilies:160,completeOldRecordsCompared:2947,completeOldBlocksCompared:1728,projections:{theatre:{old:2919,added:28,removed:112},riverside:{old:2895,added:24,removed:140},museum:{old:2879,added:16,removed:164}},original16,originalNative10,current18,currentLogExact:true,boundedLogRecovery:['T726','T725','T724','T723','T722'],additionalNegativeCases:rejected.length,rejected};
}
module.exports={test014};
if(require.main===module){const synthetic=process.argv[2]==='--synthetic',file=process.argv[synthetic?3:2];if(!file||process.argv.length!==(synthetic?4:3))throw Error('Use node complexes-historical-bridge014.test.js [--synthetic] <fingerprint.json>');console.log(JSON.stringify(test014(JSON.parse(fs.readFileSync(file)),{synthetic}),null,2));}

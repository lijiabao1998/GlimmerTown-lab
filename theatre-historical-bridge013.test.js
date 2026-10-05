#!/usr/bin/env node
'use strict';
// Accept the complete current2947 evidence directly, validating it BEFORE any
// test mutation. Archived approved2919 evidence is also supported with explicitly
// SYNTHETIC theatre records. This runner generates no game/pixel measurements.
const fs=require('fs'),assert=require('assert/strict');
const fixed=require('./theatre-static-contract013'),native=require('./theatre-fingerprint-qa013'),bridge=require('./theatre-historical-bridge013');
function test013(input){
 const inputLeaves=Object.keys(input.fp?.subs||{}).length;
 if(inputLeaves===2947)native.verifyFingerprint013(input.fp,input.blocks);
 else if(inputLeaves===2919)require('./riverside-release-contract012').verifyApprovedNative012(input.fp,input.blocks);
 else throw Error('Full current2947 or approved2919 input inventory required');
 const raw=JSON.stringify(input),fp=structuredClone(input.fp),blocks=structuredClone(input.blocks),syntheticTheatreRecords=inputLeaves===2919;
 if(syntheticTheatreRecords){
  for(const[key,i]of fixed.expectedAdditions.map((key,i)=>[key,i]))fp.subs[key]={d:(i+1).toString(16).padStart(8,'0'),n:(i+101).toString(16).padStart(8,'0'),w:key.startsWith('bld.')?232:72,h:key.startsWith('bld.')?260:92,op:100+i};
  Object.assign(fp,native.aggregate(fp.subs));
 }
 const product={version:'14.29',anchor:'T725',phase:'candidate',release:false},proof=native.verifyFingerprint013(fp,blocks);
 const museum=bridge.museumLineage013(fp,blocks,proof,product),river=bridge.riversideLineage013(fp,blocks,proof,product);
 assert.equal(museum.leaves,2895);assert.equal(museum.oldLeaves,2879);assert.equal(museum.newLeaves,16);assert.equal(museum.projectedKeys.length,52);assert.equal(museum.currentLeaves,2947);assert.equal(museum.projectedOnlyDeclared52,true);
 assert.equal(river.leaves,2919);assert.equal(river.oldLeaves,2895);assert.equal(river.newLeaves,24);assert.equal(river.projectedKeys.length,28);assert.equal(river.currentLeaves,2947);assert.equal(river.projectedOnlyDeclared28,true);
 assert.deepEqual(Object.keys(fp.subs).sort(),[...Object.keys(native.pinnedBaseline013().subs),...fixed.expectedAdditions].sort());
 const negatives=[];
 function rejects(name,mutate){const f=structuredClone(fp),b=structuredClone(blocks);mutate(f,b);let error;try{const p=native.verifyFingerprint013(f,b);bridge.museumLineage013(f,b,p,product);bridge.riversideLineage013(f,b,p,product);}catch(e){error=e.message;}assert.ok(error,name);negatives.push({name,error});}
 for(const[key,label]of[['bld.277_1_0','museum'],['bld.278_1_0','riverside'],['bld.1_1_0','old']]){
  const actual=Object.hasOwn(fp.subs,key)?key:Object.keys(input.fp.subs)[0];
  rejects(label+' full opacity changed despite rebuilt aggregates',f=>{f.subs[actual].op++;Object.assign(f,native.aggregate(f.subs));});
  rejects(label+' undeclared record field',f=>{f.subs[actual].extra=true;});
  rejects(label+' missing full record',f=>{delete f.subs[actual];Object.assign(f,native.aggregate(f.subs));});
 }
 rejects('unexpected theatre key cannot be projected out',f=>{f.subs['theatre013.undeclared_0']={...f.subs[fixed.expectedAdditions[0]]};Object.assign(f,native.aggregate(f.subs));});
 rejects('missing declared theatre key',f=>{delete f.subs[fixed.expectedAdditions[0]];Object.assign(f,native.aggregate(f.subs));});
 rejects('malformed full new night record',f=>{f.subs[fixed.expectedAdditions[0]].n=null;Object.assign(f,native.aggregate(f.subs));});
 rejects('full native block record differs with old family/count',(_,b)=>{const k=Object.keys(b.entries)[0];b.entries[k]={...b.entries[k],extra:true};});
 rejects('complete current family aggregate differs',f=>{f.families.theatre013={...f.families.theatre013,crc:'changed'};});
 rejects('complete current leaf count differs',f=>{f.stats.leaves--;});
 for(const[method,key]of[['museumLineage013','bld.277_1_0'],['riversideLineage013','bld.278_1_0']]){const f=structuredClone(fp);f.subs[key].op++;Object.assign(f,native.aggregate(f.subs));assert.throws(()=>bridge[method](f,blocks,proof,product));negatives.push({name:method+' independently rejects changed complete projected record with rebuilt aggregates',rejected:true});}
 const log=fs.readFileSync(require('path').join(__dirname,'AUTORUN-LOG.md'),'utf8'),old=bridge.historicalLog013(log),target=require('./streetlife-static-contract009').BASE;
 const targetLog=require('child_process').execFileSync('git',['show',target+':AUTORUN-LOG.md'],{cwd:__dirname,encoding:'utf8',maxBuffer:8*1024*1024});assert.equal(old,targetLog);
 for(const[mutation,name]of[[log+'\n','non-entry log change'],[log.replace('<!-- T725 release entry BEGIN -->','<!-- changed BEGIN -->'),'missing exact T725 release entry']]){assert.throws(()=>bridge.historicalLog013(mutation));negatives.push({name,rejected:true});}
 assert.equal(JSON.stringify(input),raw,'Complete input evidence must remain unchanged');
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticTheatreRecords,candidatePixelsGenerated:false,currentInputRecordsVerified:!syntheticTheatreRecords,inputLeaves,inputEvidenceUnchanged:true,inputCheckedSHA:input.checkedSHA||null,inputSourceSHA256:input.sourceSHA256||null,notCandidatePixelEvidence:true,museumProjection:{old:2879,additions:16,removed:52,current:2947},riversideProjection:{old:2895,additions:24,removed:28,current:2947},completeRecordsCompared:true,completeBlocksCompared:true,currentLogT725Exact:true,boundedLogRecovery:['T725','T724','T723','T722'],negativeCases:negatives.length,negatives};
}
module.exports={test013};
if(require.main===module){if(process.argv.length!==3)throw Error('Usage: node theatre-historical-bridge013.test.js <current-theatre-or-approved-riverside-fingerprint.json>');console.log(JSON.stringify(test013(JSON.parse(fs.readFileSync(process.argv[2]))),null,2));}

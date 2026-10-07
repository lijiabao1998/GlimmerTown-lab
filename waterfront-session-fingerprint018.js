'use strict';
// Source and data only in Node. The one observer below is serialized into the
// Actions browser. No game, legacy runtime script or painter is required here.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./waterfront-static-contract018'),{aggregate}=require('./streetlife-fingerprint-qa009');
const WORKER_SOURCE_SHA256='5fe5dd3cda55b9b1601cd940b1a22287c6c9abb1e9b38cb4a855bf9cc7335584';
const LEGACY_PROOF_SHA256='d925a051ca9987473f24bf3def88a93cb4ed0f0f827432bb626308b07b98e23d';
const WORKER_LEAF=Object.freeze({d:'f9717532',op:132,w:56,h:9,n:null});
const PROOF_REFERENCE='Unchanged approved main T700 workers() source evaluated with lexical WK and SPR, never registered into product SPR.';
const keys=(q,wanted)=>!!q&&typeof q==='object'&&!Array.isArray(q)&&eq(Object.keys(q).sort(),[...wanted].sort());
function extractWorkerSource018(html){
 const marker='let WK=null;',start='  function workers(){',end='\n  /* ---------- Layer A';
 if(html.split(start).length!==2)throw Error('One original workers() source required');
 const w=html.indexOf(marker),a=html.indexOf(start,w),b=html.indexOf(end,a);if(w<0||a<w||b<=a)throw Error('Original worker source boundaries missing');return html.slice(a,b).trim();
}
function extractLegacyProof018(source){const a='function legacyWorkerProof(source){',b='\nfunction saveLoadFixture(){';if(source.split(a).length!==2||source.split(b).length!==2)throw Error('Unique original legacyWorkerProof source boundaries required');const start=source.indexOf(a),end=source.indexOf(b,start);if(end<=start)throw Error('Invalid proof boundaries');return source.slice(start,end);}
function verifyWorkerSources018(currentHTML,baselineHTML,currentLegacy,baselineLegacy){
 const workerSource=extractWorkerSource018(currentHTML),baseWorker=extractWorkerSource018(baselineHTML),proofSource=extractLegacyProof018(currentLegacy),baseProof=extractLegacyProof018(baselineLegacy);
 if(currentLegacy!==baselineLegacy)throw Error('Complete original public-life QA must remain byte-exact');
 if(workerSource!==baseWorker||fixed.hash(workerSource)!==WORKER_SOURCE_SHA256||fixed.hash(baseWorker)!==WORKER_SOURCE_SHA256)throw Error('Current and T730 worker source must match exact approved SHA256');
 if(proofSource!==baseProof||fixed.hash(proofSource)!==LEGACY_PROOF_SHA256||fixed.hash(baseProof)!==LEGACY_PROOF_SHA256)throw Error('Original full-RGBA legacy proof must remain byte-exact');
 new vm.Script('('+workerSource+')');new vm.Script('('+proofSource+')');
 return{workerSource,proofSource,provenance:{base:fixed.BASE,workerSourceSHA256:WORKER_SOURCE_SHA256,baselineWorkerSourceSHA256:WORKER_SOURCE_SHA256,proofSourceSHA256:LEGACY_PROOF_SHA256,baselineProofSourceSHA256:LEGACY_PROOF_SHA256,workerSourceExact:true,legacyProofExact:true}};
}
function readWorkerSources018(){return verifyWorkerSources018(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),fixed.baseFile('index.html').toString(),fs.readFileSync(path.join(__dirname,'publiclife-integration-qa.js'),'utf8'),fixed.baseFile('publiclife-integration-qa.js').toString());}
// The legacy function is passed as its exact original source, with no copied or
// weakened assertions. Its two generated canvases stay outside product SPR.
function observeWorkerSession018(legacyWorkerProof,source){
 const Q=window.__complexQA014,atlas=GV.art574.SPR(),actual=atlas.worker12||null,canvas=actual?.img||null,world=Q.world(),storage=JSON.stringify(Q.storage()),fingerprint=JSON.stringify(GV.fp536()),random=Math.random;
 const legacy=legacyWorkerProof(source);
 return{legacy,purity:{worldExact:Q.world()===world,storageExact:JSON.stringify(Q.storage())===storage,fullAtlasExact:JSON.stringify(GV.fp536())===fingerprint,workerObjectExact:(atlas.worker12||null)===actual,workerCanvasExact:(atlas.worker12?.img||null)===canvas,mathRandomRestored:Math.random===random}};
}
function validateWorkerProof018(proof,present,provenance){
 const wanted={base:fixed.BASE,workerSourceSHA256:WORKER_SOURCE_SHA256,baselineWorkerSourceSHA256:WORKER_SOURCE_SHA256,proofSourceSHA256:LEGACY_PROOF_SHA256,baselineProofSourceSHA256:LEGACY_PROOF_SHA256,workerSourceExact:true,legacyProofExact:true};
 if(!eq(provenance,wanted))throw Error('Malformed or unpinned worker source provenance');
 if(!keys(proof,['legacy','purity'])||!keys(proof.purity,['worldExact','storageExact','fullAtlasExact','workerObjectExact','workerCanvasExact','mathRandomRestored'])||Object.values(proof.purity).some(q=>q!==true))throw Error('Worker proof must preserve world storage all atlas records canonical references and RNG function');
 const p=proof.legacy;
 if(!present){if(!eq(p,{present:false,exact:false,deterministic:false,mathRandomCalls:0}))throw Error('Absent worker requires exact read-only absence proof');return true;}
 if(!keys(p,['present','width','height','CW','CH','ax','ay','exact','deterministic','mathRandomCalls','reference'])||p.present!==true||p.width!==56||p.height!==9||p.CW!==7||p.CH!==9||p.ax!==3||p.ay!==8||p.exact!==true||p.deterministic!==true||p.mathRandomCalls!==0||p.reference!==PROOF_REFERENCE)throw Error('Installed worker must match all RGBA bytes of two independent approved-source canvases with zero RNG and exact metadata');
 return true;
}
function validateFingerprintShape018(fp){
 if(!keys(fp,['ok','families','subs','stats'])||fp.ok!==true||!fp.subs||Array.isArray(fp.subs)||!fp.families||Array.isArray(fp.families))throw Error('Full successful native fingerprint shape required');
 for(const[key,q]of Object.entries(fp.subs))if(!keys(q,['d','h','n','op','w']))throw Error('Complete exact leaf field set required: '+key);
 const independent=aggregate(fp.subs);if(!eq(independent.families,fp.families)||!eq(independent.stats,fp.stats))throw Error('Full native family/stat records differ from independent aggregation');return independent;
}
// This comparison never grants product/preflight approval by itself. The runner
// first verifies its independent exact-head preflight and native boot equality.
// Keeping it data-only also permits honest archived-artifact diagnostics without
// fabricating the new browser RGBA proof.
function compareSessionData018(before,after,beforeBlocks,afterBlocks){
 const a=validateFingerprintShape018(before),b=validateFingerprintShape018(after);
 if(a.stats.leaves!==3147||a.stats.families!==164||Object.hasOwn(before.subs,'worker12')||Object.hasOwn(before.families,'worker12'))throw Error('Exact verified 3147-leaf 164-family boot inventory required');
 if(!keys(beforeBlocks,['ok','count','fam','entries'])||beforeBlocks.ok!==true||beforeBlocks.count!==1728||!beforeBlocks.entries||Object.keys(beforeBlocks.entries).length!==1728||!eq(beforeBlocks,afterBlocks))throw Error('Every complete native block record and aggregate must remain deep-exact');
 for(const[key,value]of Object.entries(before.subs))if(!Object.hasOwn(after.subs,key)||!eq(after.subs[key],value))throw Error('Existing complete leaf changed or missing: '+key);
 for(const[key,value]of Object.entries(before.families))if(!Object.hasOwn(after.families,key)||!eq(after.families[key],value))throw Error('Existing complete family changed or missing: '+key);
 const added=Object.keys(after.subs).filter(k=>!Object.hasOwn(before.subs,k)),families=Object.keys(after.families).filter(k=>!Object.hasOwn(before.families,k)),present=Object.hasOwn(after.subs,'worker12');
 if(!eq(added,present?['worker12']:[])||!eq(families,present?['worker12']:[]))throw Error('Only the original lazy worker12 leaf/family may be added');
 if(present&&!eq(after.subs.worker12,WORKER_LEAF))throw Error('Lazy worker full metadata and CRC must match the exact approved native record');
 if(b.stats.leaves!==3147+Number(present)||b.stats.families!==164+Number(present))throw Error('Unexpected independently aggregated native session inventory');
 if(!present&&!eq(before,after))throw Error('Absent worker cannot hide any full fingerprint mutation');
 return{dataExact:true,pairedExistingLeaves:3147,existingFamilies:164,completeBlocks:1728,workerPresent:present,added,addedFamilies:families,beforeStats:a.stats,afterStats:b.stats,workerRecord:present?after.subs.worker12:null};
}
function verifySessionFingerprint018(before,after,beforeBlocks,afterBlocks,proof,provenance){
 const data=compareSessionData018(before,after,beforeBlocks,afterBlocks);validateWorkerProof018(proof,data.workerPresent,provenance);
 return{ok:true,...data,source:provenance,workerProof:proof,nativeRGBAProofVerified:data.workerPresent,absentWorkerProofVerified:!data.workerPresent,contract:'All 3147 boot leaves, 164 existing families and 1728 complete blocks stay deep-exact. The sole permitted lazy worker12 addition requires pinned unchanged T730 source, independent full aggregation, exact metadata/CRC, full canonical RGBA equality against two independent canvases, zero RNG and complete observer purity.'};
}
module.exports={WORKER_SOURCE_SHA256,LEGACY_PROOF_SHA256,WORKER_LEAF,PROOF_REFERENCE,extractWorkerSource018,extractLegacyProof018,verifyWorkerSources018,readWorkerSources018,observeWorkerSession018,validateWorkerProof018,compareSessionData018,verifySessionFingerprint018};

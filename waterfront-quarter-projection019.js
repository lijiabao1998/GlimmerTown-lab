'use strict';
// Node-side, explicit data projection. Never replaces GV, SPR, CDP or browser code.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const current=require('./waterfront-quarter-fingerprint019'),fixed=require('./waterfront-quarter-contract019'),prior=require('./waterfront-fingerprint018'),{aggregate}=prior;
let verifiedPreflight;
function readFull019(){return verifiedPreflight||(verifiedPreflight=current.readPreflight019());}
function projectObservation019(fp,{allowWorker=false,preflight=readFull019(),record=true}={}){
 const raw=JSON.stringify(fp),subs={...fp?.subs},worker=subs.worker12;if(worker!==undefined){if(!allowWorker||!eq(worker,require('./waterfront-session-fingerprint018').WORKER_LEAF))throw Error('Only pinned lazy worker allowed after boot');delete subs.worker12;}
 const full=worker===undefined?fp:{ok:true,subs,...aggregate(subs)};
 if(worker!==undefined){const all=aggregate(fp.subs);if(!eq(all.families,fp.families)||!eq(all.stats,fp.stats)||!eq(Object.keys(fp).sort(),['families','ok','stats','subs'])||fp.ok!==true)throw Error('Complete session aggregation required');}
 const proof=current.verifyFingerprint019(full,preflight.blocks);if(!eq(full,preflight.fp))throw Error('Every full3179 record must equal independent native preflight before projection');
 const projected=current.projectRecords019(full);if(worker!==undefined){projected.subs.worker12=worker;Object.assign(projected,aggregate(projected.subs));}
 if(JSON.stringify(fp)!==raw)throw Error('Projection mutated native input');
 if(record){const out=path.join(__dirname,'waterfront-quarter-evidence','retained');fs.mkdirSync(out,{recursive:true});fs.appendFileSync(path.join(out,'projection-audit.jsonl'),JSON.stringify({checkedSHA:preflight.checkedSHA,sourceSHA256:preflight.sourceSHA256,fullSHA256:fixed.hash(raw),preflightEvidenceSHA256:preflight.evidenceSHA256,fullLeaves:Object.keys(fp.subs).length,projectedLeaves:Object.keys(projected.subs).length,removed:[...fixed.expectedAdditions],onlyDeclared32Removed:true,independentFull3179Verified:true,workerRetained:worker!==undefined,inputUnchanged:true,currentPublicationApproved:false})+'\n');}
 return projected;
}
// Retain the old018 fingerprint assertions exactly. Only the obsolete current
// release-source authority is removed; its complete approved-data check stays.
function buildHistoricalFingerprint019(){
 const source=fs.readFileSync(path.join(__dirname,'waterfront-fingerprint018.js'),'utf8');if(source!==fixed.baseFile('waterfront-fingerprint018.js').toString())throw Error('Original018 fingerprint source changed');
 const from=source.slice(source.indexOf(" const release=fs.readFileSync"),source.indexOf('\n return{ok:true,base:fixed.BASE',source.indexOf(" const release=fs.readFileSync")));
 const to=" const release=false,releaseProof=null;require('./waterfront-release-contract018').verifyApprovedNative018(fp,blocks);";
 const edits=[[from,to],["version:release?'14.35':'14.34',anchor:release?'T731':'T730'","version:'14.35',anchor:'T731'"]];
 let adapted=source;for(const[a,b]of edits){if(!a||adapted.split(a).length!==2)throw Error('Unique018 fingerprint provenance span required');adapted=adapted.replace(a,b);}
 let restored=adapted;for(const[a,b]of[...edits].reverse())restored=restored.replace(b,a);if(restored!==source)throw Error('Fingerprint assertion source changed');
 const holder={exports:{}};new vm.Script('(function(require,module,exports,__dirname){'+adapted.replace(/^#![^\n]*\n/,'')+'\n})').runInThisContext()(require,holder,holder.exports,__dirname);
 return{exports:holder.exports,proof:{originalSHA256:fixed.hash(source),adaptedSHA256:fixed.hash(adapted),edits,reverseExact:true,oldNumericAssertionsExact:true,oldFullRecordAssertionsExact:true,currentSourceAuthority:'waterfront-quarter-contract019.verifyStatic019',oldReleaseSourceApprovalUsed:false,approved018DataOnly:true}};
}
const historical=buildHistoricalFingerprint019();
function readPreflight018(){const q=readFull019(),fp=projectObservation019(q.fp,{preflight:q}),baseline=prior.pinnedBaseline018(),proof=historical.exports.verifyFingerprint018(fp,q.blocks);return{...q,fp,proof,full019Proof:q.proof,baseline,qaBaseline:{...baseline,version:q.product.version,anchor:q.product.anchor,subs:fp.subs,families:fp.families,stats:fp.stats},projectionScope:'exact3147 historical observation after full3179 verification'};}
module.exports={...historical.exports,buildHistoricalFingerprint019,projectObservation019,readFull019,readPreflight018};

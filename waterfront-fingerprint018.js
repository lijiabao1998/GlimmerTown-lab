'use strict';
// Full current records validated before any historical projection.
const fs=require('node:fs'),path=require('node:path'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./waterfront-static-contract018'),{aggregate}=require('./streetlife-fingerprint-qa009'),approved=require('./quayside-release-contract017');
const {ROOT,THEMES,expectedAdditions,hash,baseFile,BASE_FP_SHA256}=fixed;
function emptyCRC018(){let c=0xffffffff;for(let i=0;i<160*196*4;i++){c^=0;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return((c^0xffffffff)>>>0).toString(16).padStart(8,'0');}
const EMPTY_NIGHT_CRC=emptyCRC018();
function pinnedBaseline018(){const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_SHA256)throw Error('Exact T730 fingerprint required');return JSON.parse(bytes);}
function verifyFingerprint018(fp,blocks){
 const baseline=pinnedBaseline018(),old=baseline.subs,subs={};
 if(baseline.version!=='14.34'||baseline.anchor!=='T730'||Object.keys(old).length!==3139||baseline.stats.families!==163||baseline.blocks.count!==1728)throw Error('Unexpected T730 baseline inventory');
 if(fp?.ok!==true||!eq(Object.keys(fp).sort(),['families','ok','stats','subs']))throw Error('Complete full native fingerprint required');
 const added=Object.keys(fp.subs||{}).filter(k=>!Object.hasOwn(old,k)).sort();
 if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==3147)throw Error('Exactly eight declared heritage leaves required');
 for(const[k,v]of Object.entries(old)){if(!eq(fp.subs[k],v))throw Error('Prior complete leaf changed: '+k);subs[k]=fp.subs[k];}
 for(const key of expectedAdditions){const q=fp.subs[key];if(!eq(Object.keys(q||{}).sort(),['d','h','n','op','w'])||q.w!==160||q.h!==196||!Number.isInteger(q.op)||q.op<3000||q.op>160*196||!/^([0-9a-f]{8})$/.test(q.d)||!/^([0-9a-f]{8})$/.test(q.n)||q.n===EMPTY_NIGHT_CRC)throw Error('Complete filled 2x2 building and physical native emission required: '+key);}
 const full=aggregate(fp.subs),prior=aggregate(subs);
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.leaves!==3147||full.stats.families!==164)throw Error('Current independent aggregation mismatch');
 if(!eq(prior.families,baseline.families)||!eq(prior.stats,baseline.stats))throw Error('All 163 prior families must remain exact');
 if(!eq({fam:blocks?.fam,count:blocks?.count},baseline.blocks))throw Error('Pinned block aggregate mismatch');
 approved.verifyApprovedNative017({ok:true,subs,...prior},blocks);
 for(const theme of THEMES)if(new Set([0,1,2,3].map(v=>fp.subs['waterfront018.'+theme+'_'+v].d)).size!==4)throw Error('Four distinct authored views required for '+theme);
 if(hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No baseline promotion before new owner-image approval');
 return{ok:true,base:fixed.BASE,oldLeaves:3139,newLeaves:8,leaves:3147,oldFamilies:163,currentFamilies:164,oldBlocks:1728,oldCompleteRecordsExact:true,oldFamilyCRCsExact:true,completeBlockRecordsExact:true,added,newArtAwaitingOwnerImageApproval:true,currentCandidateApproval:false};
}
function project018(fp,blocks){const proof=verifyFingerprint018(fp,blocks),baseline=pinnedBaseline018(),subs={};for(const[k,v]of Object.entries(fp.subs))if(Object.hasOwn(baseline.subs,k))subs[k]=v;return{fp:{ok:true,subs,...aggregate(subs)},blocks,proof,baseline,keys:[...expectedAdditions]};}
module.exports={pinnedBaseline018,verifyFingerprint018,project018,aggregate,EMPTY_NIGHT_CRC};

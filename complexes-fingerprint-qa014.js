#!/usr/bin/env node
'use strict';
// Every old complete record and all block entries remain immutable. New art
// declarations never exempt old leaves; release additionally pins every new record.
const fs=require('node:fs'),path=require('node:path'),{isDeepStrictEqual:eq}=require('node:util'),{execFileSync}=require('node:child_process');
const fixed=require('./complexes-static-contract014'),{ROOT,BASE,BASE_FP_SHA256,expectedAdditions,MAINS,BUILDINGS,THEMES,baseFile,hash}=fixed;
const {aggregate}=require('./streetlife-fingerprint-qa009');
function pinnedBaseline014(){const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_SHA256)throw Error('Pinned complete T726 fingerprint bytes changed');return JSON.parse(bytes);}
function verifyFingerprint014(fp,blocks){
 const baseline=pinnedBaseline014(),old=baseline.subs,projected={};
 if(baseline.version!=='14.30'||baseline.anchor!=='T726'||Object.keys(old).length!==2947||baseline.stats.families!==159||baseline.blocks.count!==1728)throw Error('Complete deployed T726 inventory required');
 if(!fp?.ok||!fp.subs||Array.isArray(fp.subs))throw Error('Complete native full fingerprint required');
 const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();
 if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==3059)throw Error('Exactly112 declared complex leaves required: '+JSON.stringify(added));
 for(const[k,v]of Object.entries(fp.subs))if(Object.hasOwn(old,k)){if(!eq(v,old[k]))throw Error('Approved complete old record changed: '+k);projected[k]=v;}
 if(!eq(projected,old))throw Error('An approved old complete record is missing');
 for(const key of expectedAdditions){const q=fp.subs[key],b=key.startsWith('bld.'),k=b?+key.split('.')[1].split('_')[0]:0,w=b?(MAINS.includes(k)?304:160):72,h=b?(MAINS.includes(k)?320:196):92;if(!q||!eq(Object.keys(q).sort(),['d','h','n','op','w'])||!Number.isInteger(q.op)||q.op<=0||q.op>w*h||typeof q.d!=='string'||typeof q.n!=='string'||q.w!==w||q.h!==h)throw Error('Complete opaque dimensioned day/night record required: '+key);}
 const before=aggregate(projected),full=aggregate(fp.subs);
 if(!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Old full family/stat projection changed');
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.families!==160||full.stats.leaves!==3059)throw Error('Independent complete current aggregation mismatch');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks))throw Error('All1728 old native block family records must match');
 const approved=require('./theatre-release-contract013').verifyApprovedNative013({ok:true,subs:projected,families:before.families,stats:before.stats},blocks);
 for(const prefix of[...BUILDINGS.map(k=>'bld.'+k+'_1_'),...THEMES.map(t=>'complexes014.'+t+'_')])if(new Set([0,1,2,3].map(v=>fp.subs[prefix+v].d)).size!==4)throw Error('Four actual distinct authored geometric views required: '+prefix);
 const tracked=fs.readFileSync(path.join(ROOT,'fp.json')),isCandidate=hash(tracked)===BASE_FP_SHA256;
 const release=isCandidate?null:require('./complexes-release-contract014').verifyRelease014();
 if(release)require('./complexes-release-contract014').verifyApprovedNative014(fp,blocks);
 if(release&&!eq({subs:fp.subs,families:fp.families,stats:fp.stats},{subs:release.releaseBaseline.subs,families:release.releaseBaseline.families,stats:release.releaseBaseline.stats}))throw Error('Current native records must exactly equal the promoted release baseline');
 return{ok:true,base:BASE,baselineSHA256:BASE_FP_SHA256,phase:release?'release':'candidate',version:release?.version||'14.30',anchor:release?.anchor||'T726',release:!!release,oldLeaves:2947,newLeaves:112,leaves:3059,oldFamilies:159,currentFamilies:160,oldBlocks:1728,added,trackedBaselineExact:true,oldApprovedNativeSHA:approved.nativeCheckedSHA,oldCompleteRecordsExact:true,oldFamilyCRCsExact:true,allCurrentFamilyCRCsExact:true,oldStatsExact:true,blocksExact:true,completeBlockRecordsExact:true,newArtAwaitingOwnerImageApproval:!release,approvedNativeRecordsExact:!!release,approvedSHA:release?.approvedSHA||null};
}
function readPreflight014(){
 const file=path.join(ROOT,'complexes-evidence/preflight/guards/fingerprint-native.json'),bytes=fs.readFileSync(file),q=JSON.parse(bytes),head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),product=fixed.verifyStatic014();
 if(process.env.GITHUB_ACTIONS!=='true'||head!==process.env.GITHUB_SHA||q.checkedSHA!==head||q.sourceSHA256!==product.sourceSHA256||q.version!==product.version||q.anchor!==product.anchor||q.release!==product.release)throw Error('Exact-head/current-source independent native preflight required');
 const proof=verifyFingerprint014(q.fp,q.blocks),baseline=pinnedBaseline014(),qaBaseline={...baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 return{proof,product,baseline,qaBaseline,fp:q.fp,blocks:q.blocks,evidenceSHA256:hash(bytes)};
}
function staticTest014(input){
 const current=structuredClone(input),positive=verifyFingerprint014(current.fp,current.blocks),rejected=[],firstOld=Object.keys(pinnedBaseline014().subs)[0],firstNew=expectedAdditions[0],firstBlock=Object.keys(current.blocks.entries)[0];
 const mutations=[['old opacity',q=>q.fp.subs[firstOld].op++],['old day CRC with rebuilt aggregate',q=>{q.fp.subs[firstOld].d=q.fp.subs[firstOld].d==='00000000'?'ffffffff':'00000000';Object.assign(q.fp,aggregate(q.fp.subs));}],['old missing leaf',q=>delete q.fp.subs[firstOld]],['old extra field',q=>q.fp.subs[firstOld].extra=true],['new missing leaf',q=>delete q.fp.subs[firstNew]],['undeclared new leaf',q=>q.fp.subs['complexes014.undeclared_0']={...q.fp.subs[firstNew]}],['malformed night',q=>q.fp.subs[firstNew].n=null],['wrong new dimensions',q=>q.fp.subs[firstNew].w++],['empty new asset',q=>q.fp.subs[firstNew].op=0],['new extra field',q=>q.fp.subs[firstNew].extra=true],['new day CRC without rebuilding aggregate',q=>q.fp.subs[firstNew].d+='bad'],['new duplicate view with rebuilt aggregate',q=>{q.fp.subs['bld.282_1_1'].d=q.fp.subs['bld.282_1_0'].d;Object.assign(q.fp,aggregate(q.fp.subs));}],['old family CRC',q=>q.fp.families.bld.crc+='bad'],['stats mismatch',q=>q.fp.stats.leaves++],['block family',q=>q.blocks.fam+='bad'],['block count',q=>q.blocks.count--],['single complete block changed',q=>q.blocks.entries[firstBlock]={...q.blocks.entries[firstBlock],d:'bad'}],['single complete block missing',q=>delete q.blocks.entries[firstBlock]]];
 for(const[name,mutate]of mutations){const q=structuredClone(current);mutate(q);let error='';try{verifyFingerprint014(q.fp,q.blocks);}catch(e){error=e.message;}if(!error)throw Error('Negative record mutation was accepted: '+name);rejected.push({name,error});}
 return{ok:true,sourceOnly:true,gameExecuted:false,positive,rejected};
}
module.exports={aggregate,pinnedBaseline014,verifyFingerprint014,readPreflight014,staticTest014};
if(require.main===module){if(process.argv.length!==4||process.argv[2]!=='--static-test')throw Error('Use --static-test <native-fingerprint-json>; source/data validation only');console.log(JSON.stringify(staticTest014(JSON.parse(fs.readFileSync(process.argv[3]))),null,2));}

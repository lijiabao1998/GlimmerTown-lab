#!/usr/bin/env node
'use strict';
// Pure complete-record checks. New art never exempts any prior leaf or block.
const fs=require('node:fs'),path=require('node:path'),{isDeepStrictEqual:eq}=require('node:util'),{execFileSync}=require('node:child_process');
const {ROOT,BASE,BASE_FP_SHA256,baseFile,hash,expectedAdditions,verifyStatic013}=require('./theatre-static-contract013');
const {aggregate}=require('./streetlife-fingerprint-qa009');
function pinnedBaseline013(){const b=baseFile('fp.json');if(hash(b)!==BASE_FP_SHA256)throw Error('Pinned T725 fingerprint bytes changed');return JSON.parse(b);}
function verifyFingerprint013(fp,blocks){
 const baseline=pinnedBaseline013(),old=baseline.subs,projected={};
 if(baseline.version!=='14.29'||baseline.anchor!=='T725'||Object.keys(old).length!==2919||baseline.stats.families!==158||baseline.blocks.count!==1728)throw Error('Complete deployed T725 inventory required');
 if(!fp?.ok||!fp.subs||Array.isArray(fp.subs))throw Error('Complete native full fingerprint required');
 const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==2947)throw Error('Exactly28 theatre leaves required: '+JSON.stringify(added));
 for(const [k,v]of Object.entries(fp.subs))if(Object.hasOwn(old,k)){if(!eq(v,old[k]))throw Error('Approved complete old record changed: '+k);projected[k]=v;}
 if(!eq(projected,old))throw Error('Approved old leaf missing');
 for(const k of expectedAdditions){const q=fp.subs[k],big=k.startsWith('bld.');if(!q||!eq(Object.keys(q).sort(),['d','h','n','op','w'])||q.op<=0||typeof q.n!=='string'||q.w!==(big?232:72)||q.h!==(big?260:92))throw Error('Complete nonempty geometry-sized day/night leaf required: '+k);}
 const before=aggregate(projected),full=aggregate(fp.subs);
 if(!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Old full family/stat projection changed');
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.families!==159||full.stats.leaves!==2947)throw Error('Independent complete current aggregation mismatch');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks))throw Error('All1728 approved native block records must remain exact');
 // T725 release pins also hash every complete entries record, not just family/count.
 require('./riverside-release-contract012').verifyApprovedNative012({ok:true,subs:projected,families:before.families,stats:before.stats},blocks);
 for(const prefix of['bld.281_1_',...['ticket','plaza','rail','bench','planter','lamp'].map(t=>'theatre013.'+t+'_')])if(new Set([0,1,2,3].map(v=>fp.subs[prefix+v].d)).size!==4)throw Error('Four genuinely distinct authored views required: '+prefix);
 const approved=require('./theatre-release-contract013'),pins=approved.verifyApprovedNative013(fp,blocks);
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8'),release=html.includes("const GAME_VER='14.30'")?approved.verifyRelease013():null;
 if(!release&&(hash(html)!==approved.APPROVED||hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256))throw Error('Exact image-approved candidate and immutable T725 fingerprint required');
 return{ok:true,base:BASE,baselineSHA256:BASE_FP_SHA256,phase:release?'release':'candidate',version:release?.version||'14.29',anchor:release?.anchor||'T725',release:!!release,oldLeaves:2919,newLeaves:28,leaves:2947,oldFamilies:158,currentFamilies:159,oldBlocks:1728,added,trackedBaselineExact:!release,promotedNativeRecordsExact:!!release,approvedNativeRecordsExact:true,approvedSHA:pins.nativeCheckedSHA,oldCompleteRecordsExact:true,oldFamilyCRCsExact:true,allCurrentFamilyCRCsExact:true,oldStatsExact:true,blocksExact:true,completeBlockRecordsExact:true};
}
function readPreflight013(){
 const file=path.join(ROOT,'theatre-evidence/preflight/guards/fingerprint-native.json'),bytes=fs.readFileSync(file),q=JSON.parse(bytes),head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),product=verifyStatic013();
 if(process.env.GITHUB_ACTIONS!=='true'||head!==process.env.GITHUB_SHA||q.checkedSHA!==head||q.sourceSHA256!==product.sourceSHA256||q.version!==product.version||q.anchor!==product.anchor||q.release!==product.release)throw Error('Exact-head/current-source independent native preflight required');
 const proof=verifyFingerprint013(q.fp,q.blocks),baseline=pinnedBaseline013(),qaBaseline={...baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 return{proof,product,baseline,qaBaseline,fp:q.fp,blocks:q.blocks,evidenceSHA256:hash(bytes)};
}
function staticTest013(input){
 const current=structuredClone(input),positive=verifyFingerprint013(current.fp,current.blocks),rejected=[];
 const firstOld=Object.keys(pinnedBaseline013().subs)[0],firstNew=expectedAdditions[0],firstBlock=Object.keys(current.blocks.entries)[0];
 const mutations=[
  ['old opaque count',q=>q.fp.subs[firstOld].op++],['old day CRC',q=>q.fp.subs[firstOld].d+='bad'],['old missing leaf',q=>delete q.fp.subs[firstOld]],
  ['new missing leaf',q=>delete q.fp.subs[firstNew]],['extra undeclared leaf',q=>q.fp.subs['theatre013.extra_0']={...q.fp.subs[firstNew]}],
  ['malformed new night',q=>q.fp.subs[firstNew].n=null],['new wrong dimensions',q=>q.fp.subs[firstNew].w++],
  ['approved new day CRC with rebuilt aggregates',q=>{q.fp.subs[firstNew].d='00000000';Object.assign(q.fp,aggregate(q.fp.subs));}],
  ['approved new opacity with rebuilt aggregates',q=>{q.fp.subs[firstNew].op++;Object.assign(q.fp,aggregate(q.fp.subs));}],
  ['approved new extra record field',q=>q.fp.subs[firstNew].extra=true],
  ['old family CRC',q=>q.fp.families.bld.crc+='bad'],['stats mismatch',q=>q.fp.stats.leaves++],
  ['block family mismatch',q=>q.blocks.fam+='bad'],['block count mismatch',q=>q.blocks.count--],
  ['single complete block entry changed',q=>q.blocks.entries[firstBlock]={...q.blocks.entries[firstBlock],d:'bad'}],
  ['single complete block entry missing',q=>delete q.blocks.entries[firstBlock]]];
 for(const [name,mutate]of mutations){const q=structuredClone(current);mutate(q);let error='';try{verifyFingerprint013(q.fp,q.blocks);}catch(e){error=e.message;}if(!error)throw Error('Rejected-record negative accepted: '+name);rejected.push({name,error});}
 return{ok:true,sourceOnly:true,gameExecuted:false,positive,rejected};
}
module.exports={aggregate,pinnedBaseline013,verifyFingerprint013,readPreflight013,staticTest013};
if(require.main===module){if(process.argv.length!==4||process.argv[2]!=='--static-test')throw Error('Use --static-test <native-fingerprint-json>; only source/data validation runs');console.log(JSON.stringify(staticTest013(JSON.parse(fs.readFileSync(process.argv[3]))),null,2));}

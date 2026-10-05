'use strict';
// Pure complete-record data checks, never baseline writes or native execution.
const fs=require('fs'),path=require('path'),{isDeepStrictEqual:eq}=require('util'),{execFileSync}=require('child_process');
const {BASE,BASE_FP_SHA256,baseFile,hash,expectedAdditions,verifyStatic012}=require('./riverside-static-contract012');
const {aggregate}=require('./streetlife-fingerprint-qa009'),ROOT=__dirname;
function pinnedBaseline012(){const b=baseFile('fp.json');if(hash(b)!==BASE_FP_SHA256)throw Error('Pinned T724 fingerprint bytes changed');return JSON.parse(b);}
function verifyFingerprint012(fp,blocks){
 const baseline=pinnedBaseline012(),old=baseline.subs,projected={};
 // T724 intentionally retained T723 pixel baseline because its fix had no art.
 if(baseline.version!=='14.27'||baseline.anchor!=='T723'||Object.keys(old).length!==2895||baseline.stats.families!==157||baseline.blocks.count!==1728)throw Error('Complete approved T724 pixel inventory missing');
 if(!fp?.ok||!fp.subs||Array.isArray(fp.subs))throw Error('Native full fingerprint required');
 const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==2919)throw Error('Exactly24 declared riverside leaves required: '+JSON.stringify(added));
 for(const [key,value]of Object.entries(fp.subs))if(Object.hasOwn(old,key)){if(!eq(value,old[key]))throw Error('Approved full leaf changed: '+key);projected[key]=value;}
 if(!eq(projected,old))throw Error('Approved full leaf missing');
 for(const key of expectedAdditions){const q=fp.subs[key];if(!q||!eq(Object.keys(q).sort(),['d','h','n','op','w'])||q.op<=0||typeof q.n!=='string')throw Error('New complete nonempty leaf required: '+key);}
 const before=aggregate(projected),full=aggregate(fp.subs);if(!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Approved full family/stat projection changed');
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.families!==158||full.stats.leaves!==2919)throw Error('Candidate aggregates disagree with independent full enumeration');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks))throw Error('All1728 approved block records must remain exact');
 for(const prefix of['bld.278_1_','bld.279_1_','bld.280_1_','riverside012.quay_','riverside012.rail_','riverside012.promenade_'])if(new Set([0,1,2,3].map(v=>fp.subs[prefix+v].d)).size!==4)throw Error('Each building/module requires four distinct authored views: '+prefix);
 // Approval pins every new leaf as well as the complete1728 native block table.
 // Immutable2895-old checks above remain unconditional after baseline promotion.
 const approved=require('./riverside-release-contract012');approved.verifyApprovedNative012(fp,blocks);
 const trackedBytes=fs.readFileSync(path.join(ROOT,'fp.json')),tracked=JSON.parse(trackedBytes),release=tracked.version==='14.29'&&tracked.anchor==='T725';
 if(release){
  approved.verifyRelease012();
  const promoted={...baseline,generatedAt:tracked.generatedAt,version:'14.29',anchor:'T725',subs:fp.subs,families:fp.families,stats:fp.stats};
  if(!approved.validReleaseDate012(tracked.generatedAt)||!eq(tracked,promoted))throw Error('T725 promotion is not the exact complete native2895+24 inventory');
 }else if(hash(trackedBytes)!==BASE_FP_SHA256)throw Error('Candidate tracked baseline must remain byte-identical');
 return{ok:true,base:BASE,baselineSHA256:BASE_FP_SHA256,phase:release?'release':'candidate',version:release?'14.29':'14.28',anchor:release?'T725':'T724',release,oldLeaves:2895,newLeaves:24,leaves:2919,oldFamilies:157,currentFamilies:158,oldBlocks:1728,added,trackedBaselineExact:true,promotedNativeRecordsExact:release,approvedNativeRecordsExact:true,oldCompleteRecordsExact:true,oldFamilyCRCsExact:true,allCurrentFamilyCRCsExact:true,oldStatsExact:true,blocksExact:true,completeBlockRecordsExact:true};
}
function readPreflight012(){
 const p=path.join(ROOT,'riverside-evidence/preflight/guards/fingerprint-native.json'),bytes=fs.readFileSync(p),q=JSON.parse(bytes),head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),product=verifyStatic012();
 if(process.env.GITHUB_ACTIONS!=='true'||head!==process.env.GITHUB_SHA||q.checkedSHA!==head||q.sourceSHA256!==product.sourceSHA256||q.version!==product.version||q.anchor!==product.anchor||q.release!==product.release)throw Error('Exact-head/current-source native preflight required');
 const proof=verifyFingerprint012(q.fp,q.blocks),baseline=product.release?JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'))):pinnedBaseline012(),qaBaseline={...baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 if(proof.phase!==product.phase||proof.version!==product.version||proof.anchor!==product.anchor||proof.release!==product.release)throw Error('Native preflight phase differs from the exact product envelope');
 return{proof,product,baseline,qaBaseline,fp:q.fp,blocks:q.blocks,evidenceSHA256:hash(bytes)};
}
module.exports={aggregate,pinnedBaseline012,verifyFingerprint012,readPreflight012};

'use strict';
// Pure-data comparison: no browser/game execution and no baseline writes.
// Preserve all2879 complete T722 records, including the24 approved streetlife
// additions, then independently reconstruct both old and candidate aggregates.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{isDeepStrictEqual:eq}=require('util');
const {execFileSync}=require('child_process');
const {BASE,expectedAdditions}=require('./museum-static-contract010');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const PINNED_FP_SHA256='a6419a6ba35a98dd30711ff9c8ebdd0ef467f71a64263968a466b4b36ec83465';
function pinnedBaseline010(){
  const bytes=execFileSync('git',['show',BASE+':fp.json'],{cwd:ROOT,maxBuffer:8*1024*1024});
  if(hash(bytes)!==PINNED_FP_SHA256)throw Error('Immutable complete T722 fingerprint byte pin changed');
  return JSON.parse(bytes);
}
function verifyFingerprint010(fp,blocks){
  const baseline=pinnedBaseline010(),old=baseline.subs,projected={};
  if(baseline.version!=='14.26'||baseline.anchor!=='T722'||Object.keys(old).length!==2879||baseline.stats.families!==156||baseline.stats.leaves!==2879||baseline.blocks.count!==1728)throw Error('Pinned complete T722 inventory missing');
  if(!fp?.ok||!fp.subs||typeof fp.subs!=='object'||Array.isArray(fp.subs))throw Error('Complete native candidate fingerprint required');
  const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();
  if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==2895)throw Error('Exactly16 declared museum additions required: '+JSON.stringify(added));
  for(const [key,value]of Object.entries(fp.subs))if(Object.hasOwn(old,key)){if(!eq(value,old[key]))throw Error('Old complete T722 leaf changed: '+key);projected[key]=value;}
  if(!eq(projected,old))throw Error('Old T722 leaf missing or full-record mismatch');
  for(const key of expectedAdditions){const q=fp.subs[key];if(!q||!eq(Object.keys(q).sort(),['d','h','n','op','w'])||q.op<=0||typeof q.n!=='string')throw Error('New museum leaf needs complete nonempty day and explicit night records: '+key);}
  const before=aggregate(projected),full=aggregate(fp.subs);
  if(!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Complete T722 family/aggregate projection mismatch');
  if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.families!==157||full.stats.leaves!==2895)throw Error('Candidate aggregate/count claims disagree with independent full-record aggregation');
  if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks))throw Error('All1728 historical block fingerprints must remain exact');
  for(const prefix of['bld.277_1_','museum010.gate_','museum010.garden_','museum010.bench_'])if(new Set([0,1,2,3].map(v=>fp.subs[prefix+v].d)).size!==4)throw Error('Museum building/module needs four distinct geometric views: '+prefix);
  const trackedBytes=fs.readFileSync(path.join(ROOT,'fp.json')),tracked=JSON.parse(trackedBytes),release=tracked.version==='14.27'&&tracked.anchor==='T723';
  // The immutable T722 projection above is unconditional. Promotion additionally
  // matches the exact approved evidence and every freshly enumerated native leaf.
  if(release){
    require('./museum-release-contract010').verifyRelease010();
    const promoted={...baseline,generatedAt:tracked.generatedAt,version:'14.27',anchor:'T723',subs:fp.subs,families:fp.families,stats:fp.stats};
    if(!Number.isFinite(Date.parse(tracked.generatedAt))||!eq(tracked,promoted))throw Error('T723 promotion is not the exact complete native2879+16 inventory');
  }else if(hash(trackedBytes)!==PINNED_FP_SHA256)throw Error('Candidate must retain every byte of the immutable T722 baseline');
  return{ok:true,base:BASE,baselineSHA256:PINNED_FP_SHA256,phase:release?'release':'candidate',version:tracked.version,anchor:tracked.anchor,trackedBaselineExact:true,promotedNativeRecordsExact:release,oldLeaves:2879,newLeaves:16,leaves:2895,oldFamilies:156,currentFamilies:157,oldBlocks:1728,added,oldCompleteRecordsExact:true,oldStreetLife24Exact:true,oldFamilyCRCsExact:true,allCurrentFamilyCRCsExact:true,oldStatsExact:true,blocksExact:true};
}
function readPreflight010(){
  const p=path.join(ROOT,'museum-evidence/preflight/guards/fingerprint-native.json'),bytes=fs.readFileSync(p),q=JSON.parse(bytes);
  const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),current=fs.readFileSync(path.join(ROOT,'index.html'));
  if(process.env.GITHUB_ACTIONS!=='true'||head!==process.env.GITHUB_SHA||q.checkedSHA!==head||q.sourceSHA256!==hash(current))throw Error('Preflight native proof is not this exact workflow head and product');
  const proof=verifyFingerprint010(q.fp,q.blocks),baseline=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json')));
  if(q.version!==proof.version||q.anchor!==proof.anchor||(Object.hasOwn(q,'release')&&q.release!==(proof.phase==='release')))throw Error('Preflight metadata differs from the independently verified candidate/release phase');
  // QA-only in-memory extension before release; exact native promotion afterward.
  const qaBaseline={...baseline,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
  return{proof,qaBaseline,evidenceSHA256:hash(bytes),fp:q.fp,blocks:q.blocks};
}
module.exports={aggregate,verifyFingerprint010,readPreflight010,pinnedBaseline010,PINNED_FP_SHA256};

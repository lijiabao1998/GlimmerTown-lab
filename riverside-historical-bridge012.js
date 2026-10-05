'use strict';
// QA-only exact-source facade. The current 2,919-leaf proof is always checked
// first. Only the 24 explicitly declared riverside keys are projected out of
// the museum's historical 2,879 + 16 lineage; cumulative suites keep every key.
const fs=require('fs'),path=require('path'),{isDeepStrictEqual:eq}=require('util');
const {execFileSync}=require('child_process');
const fixed=require('./riverside-static-contract012'),native=require('./riverside-fingerprint-qa012');
const historical=require('./museum-static-contract010'),{pinnedBaseline010,PINNED_FP_SHA256}=require('./museum-fingerprint-qa010');
const {aggregate}=require('./streetlife-fingerprint-qa009'),ROOT=__dirname;
const BASE=historical.BASE,expectedAdditions=historical.expectedAdditions;
function verifyStatic010(){
 const q=fixed.verifyStatic012();
 if(!q.ok||!q.protectedExact||!q.fpExact||!q.logExact||q.release!==false||q.phase!=='candidate'||q.version!=='14.28'||q.anchor!=='T724')throw Error('Exact T724 riverside candidate envelope required');
 return{...q,base:BASE,riversideBase:fixed.BASE,additionCount:16,riversideAdditionCount:24,expectedAdditions};
}
function lineage012(fp,blocks,proof,product){
 const baseline=pinnedBaseline010(),old=baseline.subs,keys=fixed.expectedAdditions;
 if(!proof?.ok||proof.oldLeaves!==2895||proof.newLeaves!==24||proof.leaves!==2919||!Array.isArray(keys)||keys.length!==24||new Set(keys).size!==24)throw Error('Complete current 2895+24 native proof required before historical projection');
 const removed=new Set(keys),projected={};
 for(const [k,v]of Object.entries(fp.subs)){if(!removed.has(k))projected[k]=v;}
 if(Object.keys(fp.subs).length!==2919||Object.keys(projected).length!==2895||keys.some(k=>!Object.hasOwn(fp.subs,k)))throw Error('Projection may remove only the exact24 declared riverside leaves');
 const added=Object.keys(projected).filter(k=>!Object.hasOwn(old,k)).sort(),oldProjection={};
 if(Object.keys(old).length!==2879||!eq(added,expectedAdditions))throw Error('Historical museum addition inventory changed');
 for(const [k,v]of Object.entries(projected))if(Object.hasOwn(old,k)){if(!eq(v,old[k]))throw Error('Complete historical museum baseline record changed: '+k);oldProjection[k]=v;}
 if(!eq(oldProjection,old))throw Error('Historical museum baseline leaf missing');
 for(const k of expectedAdditions){const q=projected[k];if(!q||!eq(Object.keys(q).sort(),['d','h','n','op','w'])||q.op<=0||typeof q.n!=='string')throw Error('Complete nonempty museum day/night record required: '+k);}
 const before=aggregate(oldProjection),museum=aggregate(projected),current=aggregate(fp.subs);
 if(!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats)||museum.stats.leaves!==2895||museum.stats.families!==157||current.stats.leaves!==2919||current.stats.families!==158||!eq(current.families,fp.families)||!eq(current.stats,fp.stats))throw Error('Historical or complete current aggregation mismatch');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks)||blocks.count!==1728)throw Error('All1728 historical blocks must remain exact');
 for(const prefix of['bld.277_1_','museum010.gate_','museum010.garden_','museum010.bench_'])if(new Set([0,1,2,3].map(v=>projected[prefix+v].d)).size!==4)throw Error('All four museum geometric views must remain distinct: '+prefix);
 // This additional check pins all16 museum records and their complete combined
 // aggregate to deployed T724, rather than merely accepting distinct additions.
 const deployed=JSON.parse(fixed.baseFile('fp.json'));
 if(!eq(projected,deployed.subs)||!eq(museum.families,deployed.families)||!eq(museum.stats,deployed.stats))throw Error('Projected museum inventory differs from immutable deployed T724');
 return{...proof,base:BASE,baselineSHA256:PINNED_FP_SHA256,riversideBase:fixed.BASE,riversideBaselineSHA256:proof.baselineSHA256,oldLeaves:2879,newLeaves:16,leaves:2895,oldFamilies:156,currentFamilies:157,added:expectedAdditions,oldStreetLife24Exact:true,museumLineageExact:true,projectedOnlyDeclared24:true,projectedKeys:keys,riversideOldLeaves:2895,riversideNewLeaves:24,currentLeaves:2919,currentNativeFamilies:158,currentNativeProof:proof,phase:product.phase,version:product.version,anchor:product.anchor};
}
function verifyFingerprint010(fp,blocks){const proof=native.verifyFingerprint012(fp,blocks),product=verifyStatic010();return lineage012(fp,blocks,proof,product);}
function readPreflight010(){
 const q=native.readPreflight012(),product=verifyStatic010(),proof=lineage012(q.fp,q.blocks,q.proof,product);
 // The in-memory baseline is COMPLETE current native data, never the museum
 // projection. Older cumulative guards must still compare all2,919 records.
 const qaBaseline={...q.baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 return{...q,product,proof,qaBaseline};
}
function priorLog012(full){
 const product=verifyStatic010(),actual=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8');
 if(!product.logExact||full!==actual||full!==fixed.baseFile('AUTORUN-LOG.md').toString())throw Error('Complete current log must be exact deployed T724');
 let log=full;
 for(const [anchor,base]of[['T724',require('./coldload-static-contract011').BASE],['T723',BASE],['T722',require('./streetlife-static-contract009').BASE]]){
  const re=new RegExp('<!-- '+anchor+' release entry BEGIN -->[\\s\\S]*?<!-- '+anchor+' release entry END -->\\n','g'),entries=log.match(re)||[];
  const old=execFileSync('git',['show',base+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
  if(entries.length!==1||log.replace(entries[0],'')!==old)throw Error('Exact historical '+anchor+' log envelope mismatch');log=old;
 }
 return log;
}
module.exports={BASE,expectedAdditions,verifyStatic010,verifyFingerprint010,readPreflight010,lineage012,priorLog012};

'use strict';
// Source/data-only facade. Validate all2,947 current records first; remove only
// the28 declared theatre keys for riverside, and exactly28+24 for museum.
// Cumulative nested guards always receive the COMPLETE native2,947 baseline.
const fs=require('fs'),path=require('path'),{isDeepStrictEqual:eq}=require('util'),{execFileSync}=require('child_process');
const fixed=require('./theatre-static-contract013'),native=require('./theatre-fingerprint-qa013');
const museum=require('./museum-static-contract010'),museumFP=require('./museum-fingerprint-qa010');
const river=require('./riverside-static-contract012'),riverFP=require('./riverside-fingerprint-qa012');
const {aggregate}=require('./streetlife-fingerprint-qa009'),ROOT=__dirname;
const BASE=museum.BASE,expectedAdditions=museum.expectedAdditions;
function currentProduct013(){
 const q=fixed.verifyStatic013(),candidate=q.release===false&&q.phase==='candidate'&&q.version==='14.29'&&q.anchor==='T725',release=q.release===true&&q.phase==='release'&&q.version==='14.30'&&q.anchor==='T726';
 if(!q.ok||!q.htmlExact||!q.protectedExact||!q.fpExact||!q.logExact||!q.coldLoadFixExact||!(candidate||release)||q.additionCount!==28)throw Error('Exact source-verified theatre candidate over deployed T725 required');
 return q;
}
function verifyStatic010(){return{...currentProduct013(),base:BASE,theatreBase:fixed.BASE,additionCount:16,riversideAdditionCount:24,theatreAdditionCount:28,expectedAdditions};}
function verifyStatic012(){return{...currentProduct013(),base:river.BASE,theatreBase:fixed.BASE,additionCount:24,theatreAdditionCount:28,expectedAdditions:river.expectedAdditions};}
function project013(fp,blocks,proof,keys,baseline,count,families,label){
 if(!proof?.ok||proof.oldLeaves!==2919||proof.newLeaves!==28||proof.leaves!==2947||!fp?.ok||!Array.isArray(keys)||new Set(keys).size!==keys.length||Object.keys(fp.subs||{}).length!==2947)throw Error('Complete current2919+28 proof required before '+label+' projection');
 const removed=new Set(keys),subs={};
 for(const[k,v]of Object.entries(fp.subs))if(!removed.has(k))subs[k]=v;
 if(keys.some(k=>!Object.hasOwn(fp.subs,k))||Object.keys(subs).length!==count||count+keys.length!==2947)throw Error('Projection may remove only the exact declared '+label+' keys');
 // Deep equality covers each whole record (day/night/dimensions/opacity), not
 // just a CRC, and rejects missing/extra record fields and inventory changes.
 if(!eq(subs,baseline.subs))throw Error('Complete projected '+label+' records differ from immutable deployment');
 const full=aggregate(fp.subs),old=aggregate(subs);
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.leaves!==2947||full.stats.families!==159||!eq(old.families,baseline.families)||!eq(old.stats,baseline.stats)||old.stats.leaves!==count||old.stats.families!==families)throw Error('Complete current/projected '+label+' aggregation changed');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks)||blocks.count!==1728)throw Error('All1728 historical '+label+' blocks must remain exact');
 return{...fp,subs,families:old.families,stats:old.stats};
}
function riversideLineage013(fp,blocks,proof,product){
 const baseline=native.pinnedBaseline013(),keys=fixed.expectedAdditions;
 if(keys.length!==28||baseline.version!=='14.29'||baseline.anchor!=='T725')throw Error('Pinned deployed T725 inventory required');
 const projected=project013(fp,blocks,proof,keys,baseline,2919,158,'riverside'),old=riverFP.pinnedBaseline012();
 const additions=Object.keys(projected.subs).filter(k=>!Object.hasOwn(old.subs,k)).sort(),oldProjection={};
 if(Object.keys(old.subs).length!==2895||!eq(additions,river.expectedAdditions))throw Error('Historical2895+24 riverside inventory changed');
 for(const[k,v]of Object.entries(projected.subs))if(Object.hasOwn(old.subs,k)){if(!eq(v,old.subs[k]))throw Error('Complete old riverside record changed: '+k);oldProjection[k]=v;}
 if(!eq(oldProjection,old.subs))throw Error('Complete old riverside record missing');
 const before=aggregate(oldProjection);
 if(!eq(before.families,old.families)||!eq(before.stats,old.stats))throw Error('Complete old riverside aggregate changed');
 for(const prefix of['bld.278_1_','bld.279_1_','bld.280_1_','riverside012.quay_','riverside012.rail_','riverside012.promenade_'])if(new Set([0,1,2,3].map(v=>projected.subs[prefix+v].d)).size!==4)throw Error('Four approved riverside views must remain distinct: '+prefix);
 require('./riverside-release-contract012').verifyApprovedNative012(projected,blocks);
 return{...proof,base:river.BASE,baselineSHA256:river.BASE_FP_SHA256,oldLeaves:2895,newLeaves:24,leaves:2919,oldFamilies:157,currentFamilies:158,added:river.expectedAdditions,riversideLineageExact:true,approvedNativeRecordsExact:true,projectedOnlyDeclared28:true,projectedKeys:keys,theatreBase:fixed.BASE,theatreOldLeaves:2919,theatreNewLeaves:28,currentLeaves:2947,currentNativeFamilies:159,currentNativeProof:proof,phase:product.phase,version:product.version,anchor:product.anchor,release:product.release};
}
function museumLineage013(fp,blocks,proof,product){
 const keys=[...fixed.expectedAdditions,...river.expectedAdditions].sort(),deployed=riverFP.pinnedBaseline012();
 if(keys.length!==52)throw Error('Exactly28 theatre plus24 riverside projection keys required');
 const projected=project013(fp,blocks,proof,keys,deployed,2895,157,'museum'),baseline=museumFP.pinnedBaseline010(),old=baseline.subs,oldProjection={};
 const additions=Object.keys(projected.subs).filter(k=>!Object.hasOwn(old,k)).sort();
 if(Object.keys(old).length!==2879||!eq(additions,expectedAdditions))throw Error('Historical2879+16 museum inventory changed');
 for(const[k,v]of Object.entries(projected.subs))if(Object.hasOwn(old,k)){if(!eq(v,old[k]))throw Error('Complete historical museum record changed: '+k);oldProjection[k]=v;}
 const before=aggregate(oldProjection);
 if(!eq(oldProjection,old)||!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Complete old museum inventory/aggregate changed');
 for(const prefix of['bld.277_1_','museum010.gate_','museum010.garden_','museum010.bench_'])if(new Set([0,1,2,3].map(v=>projected.subs[prefix+v].d)).size!==4)throw Error('Four approved museum views must remain distinct: '+prefix);
 // Also prove every approved riverside record and complete native block entry.
 const riverside=riversideLineage013(fp,blocks,proof,product);
 return{...proof,base:BASE,baselineSHA256:museumFP.PINNED_FP_SHA256,oldLeaves:2879,newLeaves:16,leaves:2895,oldFamilies:156,currentFamilies:157,added:expectedAdditions,oldStreetLife24Exact:true,museumLineageExact:true,riversideLineageExact:riverside.riversideLineageExact,projectedOnlyDeclared52:true,projectedKeys:keys,theatreBase:fixed.BASE,theatreOldLeaves:2919,theatreNewLeaves:28,riversideOldLeaves:2895,riversideNewLeaves:24,currentLeaves:2947,currentNativeFamilies:159,currentNativeProof:proof,phase:product.phase,version:product.version,anchor:product.anchor,release:product.release};
}
function verifyFingerprint010(fp,blocks){return museumLineage013(fp,blocks,native.verifyFingerprint013(fp,blocks),currentProduct013());}
function verifyFingerprint012(fp,blocks){return riversideLineage013(fp,blocks,native.verifyFingerprint013(fp,blocks),currentProduct013());}
function readPreflight010(){
 const q=native.readPreflight013(),product=currentProduct013(),proof=museumLineage013(q.fp,q.blocks,q.proof,product);
 const qaBaseline={...q.baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 if(Object.keys(qaBaseline.subs).length!==2947||qaBaseline.stats.leaves!==2947||qaBaseline.stats.families!==159)throw Error('Nested QA baseline must retain every current2947 record');
 return{...q,product,proof,qaBaseline};
}
function priorLog013(full){
 const product=currentProduct013();if(!product.logExact)throw Error('Exact full current source log required');return historicalLog013(full);
}
function historicalLog013(full){
 const actual=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8');
 // Candidate release:false does NOT mean a T724 log. Its full log is exactly
 // deployed T725; recover older logs only by stripping each bounded entry and
 // proving complete-byte equality against that historical git source.
 if(full!==actual)throw Error('Complete current source log required');
 let log=full;
 const baseline=fixed.baseFile('AUTORUN-LOG.md').toString();
 if(log!==baseline){const release=require('./theatre-release-contract013').verifyRelease013();if(!release.logExact||log.split(release.releaseLogEntry).length!==2||log.replace(release.releaseLogEntry,'')!==baseline)throw Error('Only the exact approved T726 bounded log may precede T725');log=baseline;}
 for(const[anchor,base]of[['T725',river.BASE],['T724',require('./coldload-static-contract011').BASE],['T723',BASE],['T722',require('./streetlife-static-contract009').BASE]]){
  const re=new RegExp('<!-- '+anchor+' release entry BEGIN -->[\\s\\S]*?<!-- '+anchor+' release entry END -->\\n','g'),entries=log.match(re)||[];
  const old=execFileSync('git',['show',base+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
  if(entries.length!==1||log.replace(entries[0],'')!==old)throw Error('Exact historical '+anchor+' bounded log envelope mismatch');log=old;
 }
 return log;
}
module.exports={BASE,RIVERSIDE_BASE:river.BASE,expectedAdditions,currentProduct013,verifyStatic010,verifyStatic012,verifyFingerprint010,verifyFingerprint012,readPreflight010,museumLineage013,riversideLineage013,project013,priorLog013,historicalLog013};

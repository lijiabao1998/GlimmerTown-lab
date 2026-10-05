'use strict';
// Data-only verification. This module never starts a browser or executes game code.
// Family CRC aggregation exactly mirrors the pinned T721 enumerator. Filtering
// the 24 declared additions therefore recovers the COMPLETE historical records,
// including family CRC/px/op/night and counts, rather than skipping bld checks.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{isDeepStrictEqual:eq}=require('util');
const {BASE,expectedAdditions}=require('./streetlife-static-contract009');
const ROOT=__dirname,hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c;});
function crc(bytes){let c=0xFFFFFFFF;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return((c^0xFFFFFFFF)>>>0).toString(16).padStart(8,'0');}
const emptyCRCs=new Map();
function aggregate(subs){
 const families={};let dayNonEmpty=0,nightNonEmpty=0;
 for(const [key,q]of Object.entries(subs)){
  if(!Number.isInteger(q.w)||!Number.isInteger(q.h)||q.w<=0||q.h<=0||!Number.isInteger(q.op)||q.op<0||q.op>q.w*q.h||!/^[0-9a-f]{8}$/.test(q.d)||!(q.n===null||/^[0-9a-f]{8}$/.test(q.n)))throw Error('Invalid complete leaf record '+key);
  const top=key.split(/[.#]/)[0],f=families[top]||(families[top]={leaves:0,crc:'',px:0,op:0,night:0});
  f.leaves++;f.px+=q.w*q.h;f.op+=q.op;if(q.n!==null)f.night++;
  f.crc=crc(Buffer.from(f.crc+key+':'+q.d+(q.n?':'+q.n:'')));
  if(q.op>0){dayNonEmpty++;if(q.n!==null){const size=q.w*q.h*4;if(!emptyCRCs.has(size))emptyCRCs.set(size,crc(Buffer.alloc(size)));if(q.n!==emptyCRCs.get(size))nightNonEmpty++;}}
 }
 return{families,stats:{families:Object.keys(families).length,leaves:Object.keys(subs).length,dayNonEmpty,nightNonEmpty}};
}
function verifyFingerprint009(fp,blocks){
 const baseline=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'))),old=baseline.subs,projected={};
 if(!fp?.ok||Object.keys(old).length!==2855||baseline.stats.families!==155||baseline.blocks.count!==1728)throw Error('Pinned complete T721 inventory missing');
 const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();
 if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==2879)throw Error('Exactly24 declared additions required: '+JSON.stringify(added));
 for(const [key,value]of Object.entries(fp.subs))if(Object.hasOwn(old,key)){if(!eq(value,old[key]))throw Error('Old complete leaf changed: '+key);projected[key]=value;}
 if(!eq(projected,old))throw Error('Old leaf missing or full-record mismatch');
 const before=aggregate(projected),full=aggregate(fp.subs);
 if(!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Complete T721 family/aggregate projection mismatch');
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats))throw Error('Candidate family/count claims disagree with independent full-record aggregation');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks))throw Error('All1728 old block fingerprints must remain exact');
 for(const k of[274,275,276])if(new Set([0,1,2,3].map(v=>fp.subs['bld.'+k+'_1_'+v].d)).size!==4)throw Error('New building must have four distinct geometric views: '+k);
 for(const t of['bench','planter','fingerpost'])if(new Set([0,1,2,3].map(v=>fp.subs['streetLife009.'+t+'_'+v].d)).size!==4)throw Error('Street detail must have four distinct views: '+t);
 return{ok:true,base:BASE,oldLeaves:2855,newLeaves:24,leaves:2879,oldFamilies:155,currentFamilies:156,oldBlocks:1728,added,oldCompleteRecordsExact:true,oldFamilyCRCsExact:true,allCurrentFamilyCRCsExact:true,oldStatsExact:true,blocksExact:true};
}
function readPreflight009(){
 const p=path.join(ROOT,'streetlife-evidence/preflight/guards/fingerprint-native.json'),bytes=fs.readFileSync(p),q=JSON.parse(bytes);
 const current=fs.readFileSync(path.join(ROOT,'index.html'));
 if(process.env.GITHUB_ACTIONS!=='true'||q.checkedSHA!==process.env.GITHUB_SHA||q.sourceSHA256!==hash(current))throw Error('Preflight native proof is not this exact workflow head and product');
 const proof=verifyFingerprint009(q.fp,q.blocks),baseline=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json')));
 // In-memory QA-only extension. The tracked release baseline stays byte exact.
 const qaBaseline={...baseline,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 return{proof,qaBaseline,evidenceSHA256:hash(bytes),fp:q.fp,blocks:q.blocks};
}
module.exports={aggregate,verifyFingerprint009,readPreflight009};

'use strict';
// Exact QA facade for immutable museum suites; never used by the product.
// Retains their factual T722->T723 museum lineage while adding a stronger
// T723->coldload requirement: every2895 leaf is identical and zero are added.
const fs=require('fs'),path=require('path'),{isDeepStrictEqual:eq}=require('util'),{execFileSync}=require('child_process');
const fixed=require('./coldload-static-contract011'),native=require('./coldload-fingerprint-qa011');
const historical=require('./museum-static-contract010'),ROOT=__dirname;
const BASE=historical.BASE,expectedAdditions=historical.expectedAdditions;
function verifyStatic010(){const q=fixed.verifyStatic011();return{...q,base:BASE,fixBase:fixed.BASE,additionCount:16,fixAdditionCount:0,expectedAdditions};}
function lineage011(fp,proof,product){
 const old=JSON.parse(execFileSync('git',['show',BASE+':fp.json'],{cwd:ROOT,maxBuffer:8*1024*1024}));
 if(Object.keys(old.subs).length!==2879||Object.entries(old.subs).some(([k,v])=>!eq(v,fp.subs[k]))||!eq(Object.keys(fp.subs).filter(k=>!Object.hasOwn(old.subs,k)).sort(),expectedAdditions))throw Error('Historical museum lineage changed');
 return{...proof,base:BASE,fixBase:fixed.BASE,oldLeaves:2879,newLeaves:16,fixOldLeaves:2895,fixNewLeaves:0,phase:product.phase,version:product.version,anchor:product.anchor,fixProofExact:product.fixProofExact,oldStreetLife24Exact:true};
}
function verifyFingerprint010(fp,blocks){const proof=native.verifyFingerprint011(fp,blocks),product=fixed.verifyStatic011();return lineage011(fp,proof,product);}
function readPreflight010(){const q=native.readPreflight011(),proof=lineage011(q.fp,q.proof,q.product);return{proof,qaBaseline:{...q.baseline,version:q.product.version,anchor:q.product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats},fp:q.fp,blocks:q.blocks,evidenceSHA256:q.evidenceSHA256};}
function priorLog011(full){
 let log=fixed.museumLog011(full);for(const [anchor,base]of[['T723',BASE],['T722',require('./streetlife-static-contract009').BASE]]){
  const re=new RegExp('<!-- '+anchor+' release entry BEGIN -->[\\s\\S]*?<!-- '+anchor+' release entry END -->\\n','g'),entries=log.match(re)||[];
  const old=execFileSync('git',['show',base+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
  if(entries.length!==1||log.replace(entries[0],'')!==old)throw Error('Exact historical '+anchor+' log envelope mismatch');log=old;
 }return log;
}
module.exports={BASE,expectedAdditions,verifyStatic010,verifyFingerprint010,readPreflight010,priorLog011};

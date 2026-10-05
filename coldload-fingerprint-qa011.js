'use strict';
// Pure complete-record comparison. No browser, sprites, game code or file writes.
const fs=require('fs'),path=require('path'),{isDeepStrictEqual:eq}=require('util'),{execFileSync}=require('child_process');
const {BASE,BASE_FP_SHA256,baseFile,hash,verifyStatic011}=require('./coldload-static-contract011');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname;
function pinnedBaseline011(){const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_SHA256)throw Error('Immutable complete T723 fingerprint byte pin changed');return JSON.parse(bytes);}
function verifyFingerprint011(fp,blocks){
 const baseline=pinnedBaseline011();if(baseline.version!=='14.27'||baseline.anchor!=='T723'||Object.keys(baseline.subs).length!==2895||baseline.stats.families!==157||baseline.blocks.count!==1728)throw Error('Complete T723 fingerprint inventory missing');
 if(!fp?.ok||!eq(fp.subs,baseline.subs))throw Error('Every one of the2895 complete approved leaves must remain exact; no additions/removals');
 const full=aggregate(fp.subs);if(!eq(full.families,baseline.families)||!eq(full.stats,baseline.stats)||!eq(fp.families,baseline.families)||!eq(fp.stats,baseline.stats))throw Error('Independent complete native family/count aggregation changed');
 if(!blocks?.ok||!eq({fam:blocks.fam,count:blocks.count},baseline.blocks))throw Error('All1728 existing blocks must remain exact');
 if(hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('Cold-load fix cannot rewrite any tracked fingerprint baseline byte');
 return{ok:true,base:BASE,baselineSHA256:BASE_FP_SHA256,baselineVersion:'14.27',baselineAnchor:'T723',oldLeaves:2895,newLeaves:0,leaves:2895,oldFamilies:157,currentFamilies:157,oldBlocks:1728,trackedBaselineExact:true,oldCompleteRecordsExact:true,allCurrentFamilyCRCsExact:true,oldStatsExact:true,blocksExact:true};
}
function readPreflight011(){
 const p=path.join(ROOT,'museum-evidence/preflight/guards/fingerprint-native.json'),bytes=fs.readFileSync(p),q=JSON.parse(bytes),head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
 const product=verifyStatic011();if(process.env.GITHUB_ACTIONS!=='true'||head!==process.env.GITHUB_SHA||q.checkedSHA!==head||q.sourceSHA256!==product.sourceSHA256||q.version!==product.version||q.anchor!==product.anchor||q.release!==product.release)throw Error('Native preflight does not match this exact workflow head, product and release envelope');
 const proof=verifyFingerprint011(q.fp,q.blocks),baseline=pinnedBaseline011();
 return{proof,product,baseline,fp:q.fp,blocks:q.blocks,evidenceSHA256:hash(bytes)};
}
module.exports={pinnedBaseline011,verifyFingerprint011,readPreflight011};

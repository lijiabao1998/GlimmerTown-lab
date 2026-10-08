'use strict';
// Source/data only. The adapted original observer is serialized into Actions;
// requiring this module never executes the game or any canvas painter.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./waterfront-quarter-contract019'),prior=require('./waterfront-session-fingerprint018'),projection=require('./waterfront-quarter-projection019');
function adaptWorkerObserver019(original=prior.observeWorkerSession018.toString()){
 const pinned=prior.observeWorkerSession018.toString(),from='const Q=window.__complexQA014,',to='const Q=window.__quarterQA019,';
 if(original!==pinned||original.split(from).length!==2||original.includes(to))throw Error('Exact original018 observer and one fixture-binding anchor required');
 const source=original.replace(from,to);if(source.split(to).length!==2||source.replace(to,from)!==original)throw Error('Worker observer adaptation must reverse byte-exactly');
 new vm.Script('('+source+')');
 return{source,proof:{originalSHA256:fixed.hash(original),adaptedSHA256:fixed.hash(source),edits:[{from,to,count:1}],reverseExact:true,onlyFixtureBindingChanged:true}};
}
function readWorkerSources019(){
 const file='waterfront-session-fingerprint018.js';if(!fs.readFileSync(path.join(__dirname,file)).equals(fixed.baseFile(file)))throw Error('Original018 session contract must remain byte-exact');
 return{...prior.readWorkerSources018(),observer:adaptWorkerObserver019()};
}
function recordDelta019(before,after,limit=24){
 if(!Number.isInteger(limit)||limit<1||limit>64)throw Error('Bounded diagnostic limit required');
 const a=before&&typeof before==='object'?before:{},b=after&&typeof after==='object'?after:{},rows={added:[],removed:[],changed:[]},counts={added:0,removed:0,changed:0};
 for(const key of [...new Set([...Object.keys(a),...Object.keys(b)])].sort()){
  const kind=!Object.hasOwn(a,key)?'added':!Object.hasOwn(b,key)?'removed':!eq(a[key],b[key])?'changed':null;if(!kind)continue;
  counts[kind]++;if(rows[kind].length<limit)rows[kind].push({key,...(Object.hasOwn(a,key)?{before:a[key]}:{}),...(Object.hasOwn(b,key)?{after:b[key]}:{})});
 }
 return{counts,...rows,truncated:Object.keys(counts).some(k=>counts[k]>rows[k].length),limit};
}
function sessionDelta019(before,after,beforeBlocks,afterBlocks){
 return{atlasExact:eq(before,after),blocksExact:eq(beforeBlocks,afterBlocks),beforeStats:before?.stats,afterStats:after?.stats,
  leaf:recordDelta019(before?.subs,after?.subs),family:recordDelta019(before?.families,after?.families),stats:recordDelta019(before?.stats,after?.stats),
  block:recordDelta019(beforeBlocks?.entries,afterBlocks?.entries),blockMetadata:recordDelta019(Object.fromEntries(Object.entries(beforeBlocks||{}).filter(([k])=>k!=='entries')),Object.fromEntries(Object.entries(afterBlocks||{}).filter(([k])=>k!=='entries'))),
  atlasKeysBefore:Object.keys(before||{}).sort(),atlasKeysAfter:Object.keys(after||{}).sort()};
}
function verifySessionFingerprint019(before,after,beforeBlocks,afterBlocks,proof,provenance,preflight){
 if(!preflight?.fp||!preflight?.blocks||!eq(beforeBlocks,preflight.blocks))throw Error('Real boot blocks must equal independent full019 preflight');
 // Each projection first validates every one of the full3179 native records,
 // including the32 new leaves, against the independent current-head preflight.
 // The worker is kept for the unchanged018 full-RGBA session guard below.
 const boot=projection.projectObservation019(before,{preflight,record:false}),final=projection.projectObservation019(after,{preflight,record:false,allowWorker:true});
 const legacy=prior.verifySessionFingerprint018(boot,final,beforeBlocks,afterBlocks,proof,provenance);
 return{ok:true,fullBootLeaves:3179,fullBootFamilies:165,fullExistingRecordsExact:true,independentFull3179BeforeProjection:true,onlyDeclared32Projected:true,completeBlocks:1728,
  finalLeaves:after.stats.leaves,finalFamilies:after.stats.families,legacy,
  contract:'All3179 boot leaves and165 boot families must remain deep-exact to independent019 preflight, with every1728 complete block unchanged. The sole original lazy worker12 addition must pass the unchanged018 pinned-source, complete RGBA, metadata, aggregate, zero-RNG and observer-purity guard.'};
}
module.exports={adaptWorkerObserver019,readWorkerSources019,recordDelta019,sessionDelta019,verifySessionFingerprint019};

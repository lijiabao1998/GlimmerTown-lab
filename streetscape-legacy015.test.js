#!/usr/bin/env node
'use strict';
// Source/JSON-only controls, including original immutable16 fingerprint and10
// release mutations. --synthetic labels every new record as invented test data.
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const fixed=require('./streetscape-static-contract015'),native=require('./streetscape-fingerprint015'),bridge=require('./streetscape-historical-bridge015'),compat=require('./streetscape-compatibility015');
function test015(input,{synthetic=false}={}){
 const untouched=JSON.stringify(input),q=structuredClone(input);
 if(synthetic){require('./complexes-release-contract014').verifyApprovedNative014(q.fp,q.blocks);for(const[n,key]of fixed.expectedAdditions.entries())q.fp.subs[key]={d:(n+1).toString(16).padStart(8,'0'),n:(n+501).toString(16).padStart(8,'0'),w:72,h:92,op:200};Object.assign(q.fp,native.aggregate(q.fp.subs));}
 const product=fixed.verifyStatic015();
 if(!synthetic){const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();assert.equal(q.checkedSHA,head);assert.equal(q.sourceSHA256,product.sourceSHA256);assert.equal(q.version,'14.31');assert.equal(q.anchor,'T727');assert.equal(q.release,false);if(process.env.GITHUB_ACTIONS==='true')assert.equal(head,process.env.GITHUB_SHA);}
 const proof=native.verifyFingerprint015(q.fp,q.blocks),projected=native.project015(q.fp,q.blocks),theatre=bridge.theatreLineage014(q.fp,q.blocks),river=bridge.riversideLineage014(q.fp,q.blocks,product),museum=bridge.museumLineage014(q.fp,q.blocks,product);
 assert.deepEqual(projected.fp.subs,native.pinnedBaseline015().subs);
 for(const[v,count,removed]of[[theatre,2947,144],[river,2919,172],[museum,2895,196]]){assert.equal(v.ok,true);assert.equal(v.leaves,count);assert.equal(v.projectedKeys.length,removed);assert.equal(v.currentLeaves,3091);assert.equal(v.currentNativeFamilies,161);assert.equal(v.completeBlockRecordsExact,true);}
 const original16=bridge.staticTest013(q),original10=bridge.nativeReleaseControls013(q),new18=native.staticTest015(q);
 assert.equal(original16.rejected.length,16);assert.equal(original16.originalNegativeControlStatementsExact,true);assert.equal(original10.nativeNegativeCases,10);assert.equal(original10.originalNativeControlStatementsExact,true);assert.equal(new18.rejected.length,18);
 const rejected=[];
 const reject=(name,mutate)=>{const z=structuredClone(q);mutate(z);const raw=JSON.stringify(z);for(const method of ['project014','theatreLineage014','riversideLineage014','museumLineage014'])assert.throws(()=>bridge[method](z.fp,z.blocks,product),undefined,name+'/'+method);assert.equal(JSON.stringify(z),raw);rejected.push(name);};
 for(const key of ['bld.282_1_0','bld.281_1_0','bld.278_1_0','bld.277_1_0',Object.keys(native.pinnedBaseline015().subs)[0]])for(const field of['d','n','op','w','h'])reject(key+'/'+field,z=>{z.fp.subs[key][field]=typeof z.fp.subs[key][field]==='number'?z.fp.subs[key][field]+1:'f0f0f0f0';Object.assign(z.fp,native.aggregate(z.fp.subs));});
 reject('unknown addition cannot be projected',z=>{z.fp.subs['streetscape015.unknown_0']={...z.fp.subs[fixed.expectedAdditions[0]]};Object.assign(z.fp,native.aggregate(z.fp.subs));});
 reject('complete block extra field',z=>z.blocks.entries[Object.keys(z.blocks.entries)[0]].extra=true);reject('complete block missing',z=>delete z.blocks.entries[Object.keys(z.blocks.entries)[0]]);
 const old=require('./complexes-compatibility014'),runs=old.normalizationFixture014(false);
 // These are visibly labelled synthetic normalization inputs, never native saves.
 for(const run of runs)for(const world of run.result){for(const s of world.checkpoints){if(s.enterprise){s.enterprise.version='14.31';s.enterprise.anchor='T727';}}for(const f of['nativeSave','continueSave'])if(world[f]){const d=JSON.parse(world[f]);d.gameVer='14.31';d.region.ver='14.31';world[f]=JSON.stringify(d);}}
 const normal=compat.normalizeCompatibility015(runs,product);assert.equal(normal.metadataNormalization.normalizedFields,0);assert.equal(normal.metadataNormalization.applied,false);assert.deepEqual(normal.reference,normal.comparison);
 for(const[name,mutate]of[['old label',z=>z[0].result.find(w=>w.seed===900721).checkpoints[0].enterprise.version='14.30'],['missing world',z=>z[1].result.pop()],['missing checkpoint',z=>z[1].result[0].checkpoints.pop()]]){const z=structuredClone(runs);mutate(z);assert.throws(()=>compat.normalizeCompatibility015(z,product));rejected.push('world/'+name);}
 const fullLog=fs.readFileSync(path.join(__dirname,'AUTORUN-LOG.md'),'utf8'),log=bridge.historicalLog014(fullLog);assert.equal(log,execFileSync('git',['show',require('./streetlife-static-contract009').BASE+':AUTORUN-LOG.md'],{encoding:'utf8',maxBuffer:8*1024*1024}));assert.throws(()=>bridge.historicalLog014(fullLog+'\n'));rejected.push('unbounded historical log edit');
 assert.equal(JSON.stringify(input),untouched);
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticNewRecords:synthetic,candidatePixelsGenerated:false,proof,original16,original10,new18,rejected,normalizer:normal.metadataNormalization,fullHistoricalLogRecovered:true};
}
module.exports={test015};
if(require.main===module){const synthetic=process.argv[2]==='--synthetic',file=process.argv[synthetic?3:2];if(!file)throw Error('Use [--synthetic] native-fingerprint.json');console.log(JSON.stringify(test015(JSON.parse(fs.readFileSync(file)),{synthetic}),null,2));}

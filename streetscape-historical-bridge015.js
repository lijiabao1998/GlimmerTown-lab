'use strict';
// GPT-015: independently prove all3091 native records first, then project only
//32 new +112 historical complex leaves. Every old data-control body is retained.
// Current source is a candidate, never passed off as an image-approved release.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./complexes-static-contract014'),native=require('./streetscape-fingerprint015');
const previous=require('./theatre-historical-bridge013'),theatre=require('./theatre-static-contract013');
const theatreFP=require('./theatre-fingerprint-qa013'),approved=require('./theatre-release-contract013');
const ROOT=__dirname,BASE=previous.BASE,RIVERSIDE_BASE=previous.RIVERSIDE_BASE,THEATRE_BASE=theatre.BASE,expectedAdditions=previous.expectedAdditions;
function currentProduct014(){
 const q=require('./streetscape-static-contract015').verifyStatic015();
 if(!q.ok||!q.htmlExact||!q.protectedExact||!q.fpExact||!q.logExact||!q.coldLoadFixExact||!((q.release===false&&q.phase==='candidate'&&q.version==='14.31'&&q.anchor==='T727')||(q.release===true&&q.phase==='release'&&q.version==='14.32'&&q.anchor==='T728'))||q.additionCount!==32)throw Error('Current independently verified GPT-015 candidate or approved T728 release required');
 return q;
}
function verifyStatic010(){return{...currentProduct014(),base:BASE,complexesBase:fixed.BASE,additionCount:16,theatreAdditionCount:28,riversideAdditionCount:24,complexesAdditionCount:112,expectedAdditions};}
function verifyStatic012(){return{...currentProduct014(),base:RIVERSIDE_BASE,complexesBase:fixed.BASE,additionCount:24,theatreAdditionCount:28,complexesAdditionCount:112,expectedAdditions:require('./riverside-static-contract012').expectedAdditions};}
function verifyStatic013(){return{...currentProduct014(),base:THEATRE_BASE,complexesBase:fixed.BASE,additionCount:28,complexesAdditionCount:112,expectedAdditions:theatre.expectedAdditions};}
function project014(fp,blocks){
 const current=native.project015(fp,blocks),baseline=require('./complexes-fingerprint-qa014').pinnedBaseline014(),keys=[...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions],remove=new Set(fixed.expectedAdditions),subs={};
 for(const[k,v]of Object.entries(current.fp.subs))if(!remove.has(k))subs[k]=v;
 if(keys.length!==144||new Set(keys).size!==144||!eq(subs,baseline.subs))throw Error('Only32 streetscape and112 known complex leaves may project to2947 theatre baseline');
 const ag=native.aggregate(subs),projected={ok:true,subs,...ag};
 if(!eq(ag.families,baseline.families)||!eq(ag.stats,baseline.stats))throw Error('Every159 historical family must remain exact');
 const pins=approved.verifyApprovedNative013(projected,blocks);
 return{fp:projected,blocks,proof:current.proof,baseline,keys,pins};
}
function theatreLineage014(fp,blocks){
 const q=project014(fp,blocks),baseline=theatreFP.pinnedBaseline013(),subs={};
 const additions=Object.keys(q.fp.subs).filter(k=>!Object.hasOwn(baseline.subs,k)).sort();
 if(!eq(additions,theatre.expectedAdditions)||additions.length!==28)throw Error('Exact2919+28 theatre lineage required');
 for(const[k,v]of Object.entries(q.fp.subs))if(Object.hasOwn(baseline.subs,k)){if(!eq(v,baseline.subs[k]))throw Error('Complete T725 record changed: '+k);subs[k]=v;}
 const before=native.aggregate(subs);if(!eq(subs,baseline.subs)||!eq(before.families,baseline.families)||!eq(before.stats,baseline.stats))throw Error('Full T725 theatre ancestry changed');
 return{...q.proof,base:THEATRE_BASE,baselineSHA256:theatre.BASE_FP_SHA256,oldLeaves:2919,newLeaves:28,leaves:2947,oldFamilies:158,currentFamilies:159,added:theatre.expectedAdditions,theatreLineageExact:true,approvedNativeRecordsExact:true,approvedSHA:q.pins.nativeCheckedSHA,projectedOnlyDeclared144:true,projectedKeys:q.keys,complexesBase:fixed.BASE,complexesOldLeaves:2947,complexesNewLeaves:112,currentLeaves:3091,currentNativeFamilies:161,currentNativeProof:q.proof};
}
function riversideLineage014(fp,blocks,product){
 const q=project014(fp,blocks),theatreProof=theatreLineage014(fp,blocks),prior=previous.riversideLineage013(q.fp,blocks,theatreProof,product);
 return{...prior,projectedOnlyDeclared172:true,projectedKeys:[...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions,...theatre.expectedAdditions].sort(),complexesBase:fixed.BASE,complexesOldLeaves:2947,complexesNewLeaves:112,currentLeaves:3091,currentNativeFamilies:161,currentNativeProof:q.proof,theatreLineageExact:true};
}
function museumLineage014(fp,blocks,product){
 const q=project014(fp,blocks),theatreProof=theatreLineage014(fp,blocks),prior=previous.museumLineage013(q.fp,blocks,theatreProof,product);
 return{...prior,projectedOnlyDeclared196:true,projectedKeys:[...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions,...theatre.expectedAdditions,...require('./riverside-static-contract012').expectedAdditions].sort(),complexesBase:fixed.BASE,complexesOldLeaves:2947,complexesNewLeaves:112,currentLeaves:3091,currentNativeFamilies:161,currentNativeProof:q.proof,theatreLineageExact:true};
}
function verifyFingerprint013(fp,blocks){currentProduct014();return theatreLineage014(fp,blocks);}
function verifyFingerprint012(fp,blocks){return riversideLineage014(fp,blocks,currentProduct014());}
function verifyFingerprint010(fp,blocks){return museumLineage014(fp,blocks,currentProduct014());}
function readPreflight010(){
 const q=native.readPreflight015(),product=currentProduct014(),proof=museumLineage014(q.fp,q.blocks,product),qaBaseline={...q.baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 if(Object.keys(qaBaseline.subs).length!==3091||qaBaseline.stats.leaves!==3091||qaBaseline.stats.families!==161)throw Error('Nested QA baseline must retain every current3091 complete record');
 return{...q,product,proof,qaBaseline};
}
function staticTest013(input){
 // Preserve and execute every statement of the original16 data controls. Its
 // verification dependency is the full014 proof plus pinned013 projection.
 const file='theatre-fingerprint-qa013.js',source=fs.readFileSync(path.join(ROOT,file),'utf8');
 if(source!==fixed.baseFile(file).toString())throw Error('Original theatre fingerprint controls changed');
 const start='function staticTest013(input){',end='\nmodule.exports=';
 if(source.split(start).length!==2||source.split(end).length!==2)throw Error('Unique original16 negative-control boundaries required');
 const body=source.slice(source.indexOf(start),source.indexOf(end));
 const context={structuredClone,pinnedBaseline013:theatreFP.pinnedBaseline013,expectedAdditions:theatre.expectedAdditions,aggregate:native.aggregate,verifyFingerprint013:theatreLineage014};
 new vm.Script(body+';globalThis.run=staticTest013;').runInNewContext(context);const out=context.run(input);
 if(out.rejected.length!==16)throw Error('All16 historical fingerprint mutation assertions required');
 return{...out,original16NegativeControlSourceSHA256:fixed.hash(body),originalNegativeControlStatementsExact:true,currentNativeLeaves:3091,projectedOnlyDeclared144:true};
}
function nativeReleaseControls013(input){
 const projected=project014(input.fp,input.blocks),file='theatre-release-contract013.test.js',source=fs.readFileSync(path.join(ROOT,file),'utf8');
 if(source!==fixed.baseFile(file).toString())throw Error('Original theatre native release controls changed');
 const start=' const block=Object.keys(native.blocks.entries)[0];',end='\n}\nconsole.log';
 if(source.split(start).length!==2||source.split(end).length!==2)throw Error('Unique original10 native-control boundaries required');
 const body=source.slice(source.indexOf(start),source.indexOf(end));
 const data={fp:projected.fp,blocks:input.blocks};approved.verifyApprovedNative013(data.fp,data.blocks);
 // The exact old ten statements run on the complete pinned2947 projection.
 // No old product/release validator sees or approves the current014 product.
 const run=new vm.Script('(function(native,contract,oldLeaf,newLeaf,rejected,assert,structuredClone){let nativeCases=0;'+body+';return{nativeCases,rejected};})',{filename:'original-theatre-native-controls013.js'}).runInThisContext();
 const out=run(data,approved,Object.keys(theatreFP.pinnedBaseline013().subs)[0],theatre.expectedAdditions[0],[],require('node:assert/strict'),structuredClone);
 if(out.nativeCases!==10||out.rejected.length!==10)throw Error('All10 original native release mutations must remain');
 return{ok:true,sourceOnly:true,gameExecuted:false,nativeNegativeCases:out.nativeCases,rejected:out.rejected,originalNativeControlSourceSHA256:fixed.hash(body),originalNativeControlStatementsExact:true,currentNativeLeaves:3091,completeProjectedLeaves:2947,projectedOnlyDeclared144:true,completeBlocksCompared:1728,notCurrentReleaseApproval:true};
}
function historicalLog014(full){
 const actual=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),baseline=fixed.baseFile('AUTORUN-LOG.md').toString();
 if(full!==actual)throw Error('Complete current historical log required');
 let log=full;const current=currentProduct014();if(current.release){const entry=current.releaseLogEntry;if(!entry||log.split(entry).length!==2)throw Error('One bounded T728 release log entry required');log=log.replace(entry,'');}
 if(log!==baseline){const known=require('./streetscape-static-contract015').baseFile('AUTORUN-LOG.md').toString(),entries=log.match(/<!-- T727 release entry BEGIN -->[\s\S]*?<!-- T727 release entry END -->\n/g)||[];if(log!==known||entries.length!==1||log.replace(entries[0],'')!==baseline)throw Error('Exact unchanged T727 log and its one-entry historical envelope required');log=baseline;}
 if(log!==baseline)throw Error('Complete immutable deployed T726 log required');
 for(const[anchor,base]of[['T726',theatre.BASE],['T725',require('./riverside-static-contract012').BASE],['T724',require('./coldload-static-contract011').BASE],['T723',BASE],['T722',require('./streetlife-static-contract009').BASE]]){
  const re=new RegExp('<!-- '+anchor+' release entry BEGIN -->[\\s\\S]*?<!-- '+anchor+' release entry END -->\\n','g'),entries=log.match(re)||[];
  const old=execFileSync('git',['show',base+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
  if(entries.length!==1||log.replace(entries[0],'')!==old)throw Error('Exact historical '+anchor+' bounded log envelope mismatch');log=old;
 }
 return log;
}
function priorLog014(full){currentProduct014();return historicalLog014(full);}
module.exports={BASE,RIVERSIDE_BASE,THEATRE_BASE,expectedAdditions,currentProduct014,verifyStatic010,verifyStatic012,verifyStatic013,verifyFingerprint010,verifyFingerprint012,verifyFingerprint013,readPreflight010,staticTest013,nativeReleaseControls013,project014,museumLineage014,riversideLineage014,theatreLineage014,priorLog014,historicalLog014};

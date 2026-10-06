'use strict';
// GPT-017: prove3139 current records before removing24 quayside leaves.
// Then remove24 garden,32 streetscape and112 complex leaves for old lineage.
// Current candidate art is never approved by a historical release contract.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./complexes-static-contract014'),native=require('./quayside-fingerprint017');
const previous=require('./theatre-historical-bridge013'),theatre=require('./theatre-static-contract013');
const theatreFP=require('./theatre-fingerprint-qa013'),approved=require('./theatre-release-contract013');
const ROOT=__dirname,BASE=previous.BASE,RIVERSIDE_BASE=previous.RIVERSIDE_BASE,THEATRE_BASE=theatre.BASE,expectedAdditions=previous.expectedAdditions;
function currentProduct014(){
 const q=require('./quayside-static-contract017').verifyStatic017();
 if(['ok','htmlExact','protectedExact','fpExact','logExact','coldLoadFixExact'].some(k=>q[k]!==true)||!(q.release===false&&q.phase==='candidate'&&q.publicationApproved===false&&q.version==='14.33'&&q.anchor==='T729')||q.additionCount!==24)throw Error('Current independently verified GPT-017 candidate required; no future release approved');
 return q;
}
// Only source contracts advance; the original32-asset selftests retain their old themes.
const native015Contract={...require('./streetscape-static-contract015'),BASE:require('./quayside-static-contract017').BASE,verifyStatic015:currentProduct014};
const native016Contract={...require('./gardenlife-static-contract016'),BASE:require('./quayside-static-contract017').BASE,verifyStatic016:currentProduct014};

function verifyStatic010(){return{...currentProduct014(),base:BASE,complexesBase:fixed.BASE,additionCount:16,theatreAdditionCount:28,riversideAdditionCount:24,complexesAdditionCount:112,expectedAdditions};}
function verifyStatic012(){return{...currentProduct014(),base:RIVERSIDE_BASE,complexesBase:fixed.BASE,additionCount:24,theatreAdditionCount:28,complexesAdditionCount:112,expectedAdditions:require('./riverside-static-contract012').expectedAdditions};}
function verifyStatic013(){return{...currentProduct014(),base:THEATRE_BASE,complexesBase:fixed.BASE,additionCount:28,complexesAdditionCount:112,expectedAdditions:theatre.expectedAdditions};}
function project014(fp,blocks){
 const current=native.project017(fp,blocks),baseline=require('./complexes-fingerprint-qa014').pinnedBaseline014(),keys=[...require('./quayside-static-contract017').expectedAdditions,...require('./gardenlife-static-contract016').expectedAdditions,...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions],remove=new Set([...require('./gardenlife-static-contract016').expectedAdditions,...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions]),subs={};
 for(const[k,v]of Object.entries(current.fp.subs))if(!remove.has(k))subs[k]=v;
 if(keys.length!==192||new Set(keys).size!==192||!eq(subs,baseline.subs))throw Error('Only24 quayside,24 garden-life,32 streetscape and112 known complex leaves may project to2947 theatre baseline');
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
 return{...q.proof,base:THEATRE_BASE,baselineSHA256:theatre.BASE_FP_SHA256,oldLeaves:2919,newLeaves:28,leaves:2947,oldFamilies:158,currentFamilies:159,added:theatre.expectedAdditions,theatreLineageExact:true,approvedNativeRecordsExact:true,approvalScope:'historical projected records only',currentCandidateApproval:false,approvedSHA:q.pins.nativeCheckedSHA,projectedOnlyDeclared192:true,projectedKeys:q.keys,complexesBase:fixed.BASE,complexesOldLeaves:2947,complexesNewLeaves:112,currentLeaves:3139,currentNativeFamilies:163,currentNativeProof:q.proof};
}
function riversideLineage014(fp,blocks,product){
 const q=project014(fp,blocks),theatreProof=theatreLineage014(fp,blocks),prior=previous.riversideLineage013(q.fp,blocks,theatreProof,product);
 return{...prior,approvalScope:'historical projected records only',currentCandidateApproval:false,projectedOnlyDeclared220:true,projectedKeys:[...require('./quayside-static-contract017').expectedAdditions,...require('./gardenlife-static-contract016').expectedAdditions,...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions,...theatre.expectedAdditions].sort(),complexesBase:fixed.BASE,complexesOldLeaves:2947,complexesNewLeaves:112,currentLeaves:3139,currentNativeFamilies:163,currentNativeProof:q.proof,theatreLineageExact:true};
}
function museumLineage014(fp,blocks,product){
 const q=project014(fp,blocks),theatreProof=theatreLineage014(fp,blocks),prior=previous.museumLineage013(q.fp,blocks,theatreProof,product);
 return{...prior,approvalScope:'historical projected records only',currentCandidateApproval:false,projectedOnlyDeclared244:true,projectedKeys:[...require('./quayside-static-contract017').expectedAdditions,...require('./gardenlife-static-contract016').expectedAdditions,...require('./streetscape-static-contract015').expectedAdditions,...fixed.expectedAdditions,...theatre.expectedAdditions,...require('./riverside-static-contract012').expectedAdditions].sort(),complexesBase:fixed.BASE,complexesOldLeaves:2947,complexesNewLeaves:112,currentLeaves:3139,currentNativeFamilies:163,currentNativeProof:q.proof,theatreLineageExact:true};
}
function verifyFingerprint013(fp,blocks){currentProduct014();return theatreLineage014(fp,blocks);}
function verifyFingerprint012(fp,blocks){return riversideLineage014(fp,blocks,currentProduct014());}
function verifyFingerprint010(fp,blocks){return museumLineage014(fp,blocks,currentProduct014());}
function readPreflight010(){
 const q=native.readPreflight017(),product=currentProduct014(),proof=museumLineage014(q.fp,q.blocks,product),qaBaseline={...q.baseline,version:product.version,anchor:product.anchor,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats};
 if(Object.keys(qaBaseline.subs).length!==3139||qaBaseline.stats.leaves!==3139||qaBaseline.stats.families!==163)throw Error('Nested QA baseline must retain every current3139 complete record');
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
 return{...out,original16NegativeControlSourceSHA256:fixed.hash(body),originalNegativeControlStatementsExact:true,currentNativeLeaves:3139,projectedOnlyDeclared192:true};
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
 return{ok:true,sourceOnly:true,gameExecuted:false,nativeNegativeCases:out.nativeCases,rejected:out.rejected,originalNativeControlSourceSHA256:fixed.hash(body),originalNativeControlStatementsExact:true,currentNativeLeaves:3139,completeProjectedLeaves:2947,projectedOnlyDeclared192:true,completeBlocksCompared:1728,notCurrentReleaseApproval:true};
}
function historicalLog014(full){
 const actual=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),baseline=fixed.baseFile('AUTORUN-LOG.md').toString();
 if(full!==actual)throw Error('Complete current historical log required');
 currentProduct014();const exact=require('./quayside-static-contract017').baseFile('AUTORUN-LOG.md').toString();
 let log=full;if(log!==exact)throw Error('Candidate must retain byte-exact approved T729 log');
 for(const [anchor,contract]of[['T729',require('./gardenlife-static-contract016')],['T728',require('./streetscape-static-contract015')],['T727',fixed]]){
  const old=contract.baseFile('AUTORUN-LOG.md').toString(),re=new RegExp('<!-- '+anchor+' release entry BEGIN -->[\\s\\S]*?<!-- '+anchor+' release entry END -->\\n','g'),entries=log.match(re)||[];
  if(entries.length!==1||log.replace(entries[0],'')!==old)throw Error('Exact historical '+anchor+' log envelope required');log=old;
 }
 if(log!==baseline)throw Error('Complete immutable deployed T726 log required');
 for(const[anchor,base]of[['T726',theatre.BASE],['T725',require('./riverside-static-contract012').BASE],['T724',require('./coldload-static-contract011').BASE],['T723',BASE],['T722',require('./streetlife-static-contract009').BASE]]){
  const re=new RegExp('<!-- '+anchor+' release entry BEGIN -->[\\s\\S]*?<!-- '+anchor+' release entry END -->\\n','g'),entries=log.match(re)||[];
  const old=execFileSync('git',['show',base+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
  if(entries.length!==1||log.replace(entries[0],'')!==old)throw Error('Exact historical '+anchor+' bounded log envelope mismatch');log=old;
 }
 return log;
}
function priorLog014(full){currentProduct014();return historicalLog014(full);}
module.exports={native015Contract,native016Contract,BASE,RIVERSIDE_BASE,THEATRE_BASE,expectedAdditions,currentProduct014,verifyStatic010,verifyStatic012,verifyStatic013,verifyFingerprint010,verifyFingerprint012,verifyFingerprint013,readPreflight010,staticTest013,nativeReleaseControls013,project014,museumLineage014,riversideLineage014,theatreLineage014,priorLog014,historicalLog014};

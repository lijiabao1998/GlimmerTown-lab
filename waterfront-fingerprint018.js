'use strict';
// Full current records validated before any historical projection.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process'),{isDeepStrictEqual:eq}=require('node:util');
const fixed=require('./waterfront-static-contract018'),{aggregate}=require('./streetlife-fingerprint-qa009'),approved=require('./quayside-release-contract017');
const {ROOT,THEMES,expectedAdditions,hash,baseFile,BASE_FP_SHA256}=fixed;
function emptyCRC018(){let c=0xffffffff;for(let i=0;i<160*196*4;i++){c^=0;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return((c^0xffffffff)>>>0).toString(16).padStart(8,'0');}
const EMPTY_NIGHT_CRC=emptyCRC018();
function pinnedBaseline018(){const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_SHA256)throw Error('Exact T730 fingerprint required');return JSON.parse(bytes);}
function verifyFingerprint018(fp,blocks){
 const baseline=pinnedBaseline018(),old=baseline.subs,subs={};
 if(baseline.version!=='14.34'||baseline.anchor!=='T730'||Object.keys(old).length!==3139||baseline.stats.families!==163||baseline.blocks.count!==1728)throw Error('Unexpected T730 baseline inventory');
 if(fp?.ok!==true||!eq(Object.keys(fp).sort(),['families','ok','stats','subs']))throw Error('Complete full native fingerprint required');
 const added=Object.keys(fp.subs||{}).filter(k=>!Object.hasOwn(old,k)).sort();
 if(!eq(added,expectedAdditions)||Object.keys(fp.subs).length!==3147)throw Error('Exactly eight declared heritage leaves required');
 for(const[k,v]of Object.entries(old)){if(!eq(fp.subs[k],v))throw Error('Prior complete leaf changed: '+k);subs[k]=fp.subs[k];}
 for(const key of expectedAdditions){const q=fp.subs[key];if(!eq(Object.keys(q||{}).sort(),['d','h','n','op','w'])||q.w!==160||q.h!==196||!Number.isInteger(q.op)||q.op<3000||q.op>160*196||!/^([0-9a-f]{8})$/.test(q.d)||!/^([0-9a-f]{8})$/.test(q.n)||q.n===EMPTY_NIGHT_CRC)throw Error('Complete filled 2x2 building and physical native emission required: '+key);}
 const full=aggregate(fp.subs),prior=aggregate(subs);
 if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats)||full.stats.leaves!==3147||full.stats.families!==164)throw Error('Current independent aggregation mismatch');
 if(!eq(prior.families,baseline.families)||!eq(prior.stats,baseline.stats))throw Error('All 163 prior families must remain exact');
 if(!eq({fam:blocks?.fam,count:blocks?.count},baseline.blocks))throw Error('Pinned block aggregate mismatch');
 approved.verifyApprovedNative017({ok:true,subs,...prior},blocks);
 for(const theme of THEMES)if(new Set([0,1,2,3].map(v=>fp.subs['waterfront018.'+theme+'_'+v].d)).size!==4)throw Error('Four distinct authored views required for '+theme);
 if(hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No baseline promotion before new owner-image approval');
 return{ok:true,base:fixed.BASE,version:'14.34',anchor:'T730',phase:'candidate',release:false,publicationApproved:false,approvedNativeRecordsExact:false,approvedCurrentNativeSHA:null,blocksExact:true,allCurrentFamilyCRCsExact:true,oldLeaves:3139,newLeaves:8,leaves:3147,oldFamilies:163,currentFamilies:164,oldBlocks:1728,oldCompleteRecordsExact:true,oldFamilyCRCsExact:true,completeBlockRecordsExact:true,added,newArtAwaitingOwnerImageApproval:true,currentCandidateApproval:false};
}
function project018(fp,blocks){const proof=verifyFingerprint018(fp,blocks),baseline=pinnedBaseline018(),subs={};for(const[k,v]of Object.entries(fp.subs))if(Object.hasOwn(baseline.subs,k))subs[k]=v;return{fp:{ok:true,subs,...aggregate(subs)},blocks,proof,baseline,keys:[...expectedAdditions]};}
function readPreflight018(){
 const file=path.join(ROOT,'waterfront-evidence/preflight/fingerprint-native.json'),bytes=fs.readFileSync(file),q=JSON.parse(bytes),head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),product=fixed.verifyStatic018();
 if(process.env.GITHUB_ACTIONS!=='true'||head!==process.env.GITHUB_SHA||q.checkedSHA!==head||q.sourceSHA256!==product.sourceSHA256||q.version!==product.version||q.anchor!==product.anchor||q.release!==false||product.release!==false||product.publicationApproved!==false||product.phase!=='candidate')throw Error('Independent current-head 3147 native candidate preflight required');
 const proof=verifyFingerprint018(q.fp,q.blocks),baseline=pinnedBaseline018();return{proof,product,fp:q.fp,blocks:q.blocks,baseline,qaBaseline:{...baseline,subs:q.fp.subs,families:q.fp.families,stats:q.fp.stats},evidenceSHA256:hash(bytes)};
}
function original29Controls018(input){
 const old=require('./quayside-fingerprint017'),source=old.staticTest017.toString(),file=fs.readFileSync(path.join(ROOT,'quayside-fingerprint017.js'),'utf8');if(file!==baseFile('quayside-fingerprint017.js').toString()||file.split(source).length!==2)throw Error('Original29 fingerprint controls must stay exact');
 const bindings={structuredClone,pinnedBaseline017:old.pinnedBaseline017,expectedAdditions:require('./quayside-static-contract017').expectedAdditions,aggregate,verifyFingerprint017:verifyFingerprint018};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+source+');})').runInThisContext()(...Object.values(bindings)),out=fn(input);if(out.rejected.length!==29)throw Error('All original29 negative controls required');return{...out,original29StatementsExact:true,original29SourceSHA256:hash(source)};
}
function staticTest018(input){
 const positive=verifyFingerprint018(input.fp,input.blocks),old=original29Controls018(input),rejected=[],key=expectedAdditions[0];
 const mutations=[['missing waterfront view',q=>delete q.fp.subs[key]],['undeclared waterfront view',q=>q.fp.subs['waterfront018.extra_0']={...q.fp.subs[key]}],['wrong native size',q=>q.fp.subs[key].w=72],['empty waterfront leaf',q=>q.fp.subs[key].op=0],['fractional waterfront opacity',q=>q.fp.subs[key].op+=.5],['excessive waterfront opacity',q=>q.fp.subs[key].op=160*196+1],['missing physical emission',q=>{q.fp.subs[key].n=EMPTY_NIGHT_CRC;Object.assign(q.fp,aggregate(q.fp.subs));}],['duplicate authored view',q=>{q.fp.subs['waterfront018.lifeboatHall_1'].d=q.fp.subs['waterfront018.lifeboatHall_0'].d;Object.assign(q.fp,aggregate(q.fp.subs));}],['new extra record field',q=>q.fp.subs[key].extra=true],['bad new day CRC',q=>q.fp.subs[key].d='zzzzzzzz'],['missing family',q=>delete q.fp.families.waterfront018],['extra family field',q=>q.fp.families.waterfront018.extra=true]];
 for(const[name,edit]of mutations){const q=structuredClone(input);edit(q);const before=JSON.stringify(q);let error='';try{verifyFingerprint018(q.fp,q.blocks);}catch(e){error=e.message;}if(!error||JSON.stringify(q)!==before)throw Error('Mutation accepted or input modified: '+name);rejected.push({name,error});}
 return{ok:true,sourceOnly:true,gameExecuted:false,positive,original29:old,rejected};
}
module.exports={pinnedBaseline018,verifyFingerprint018,project018,aggregate,EMPTY_NIGHT_CRC,readPreflight018,original29Controls018,staticTest018};
if(require.main===module){if(process.argv.length!==4||process.argv[2]!=='--static-test')throw Error('Use --static-test native-fingerprint.json');console.log(JSON.stringify(staticTest018(JSON.parse(fs.readFileSync(process.argv[3]))),null,2));}

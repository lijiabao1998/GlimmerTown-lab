#!/usr/bin/env node
'use strict';
// Source-reversible read-only QA adapters. Runtime fixtures and assertions are
// inherited unchanged. Only product contracts, declared additions and the exact
// T727 baseline/metadata envelope advance to this candidate. No game API mocks.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync,spawnSync}=require('node:child_process');
const fixed=require('./streetscape-static-contract015'),prior=require('./complexes-regression-adapter014'),ROOT=__dirname;
const SUITES=Object.freeze(['complexes',...Object.keys(prior.FILES)]);
function buildAdapter015(suite){
 if(!SUITES.includes(suite))throw Error('Unknown legacy suite');
 const previous=suite==='complexes'?{adapted:fs.readFileSync(path.join(ROOT,'complexes-integration-qa014.js'),'utf8'),proof:{originalExact:true},file:'complexes-integration-qa014.js'}:prior.buildAdapter014(suite);
 let adapted=previous.adapted;const edits=[];
 const rep=(a,b,n=1)=>{if(a===b||adapted.split(a).length-1!==n)throw Error('Exact015 QA anchor '+suite+' expected'+n+': '+a);adapted=adapted.split(a).join(b);edits.push({from:a,to:b,count:n});};
 const imports=adapted.split('./complexes-historical-bridge014').length-1;if(imports)rep('./complexes-historical-bridge014','./streetscape-historical-bridge015',imports);
 if(suite==='complexes'){
  rep("const {verifyStatic014,BASE}=require('./complexes-static-contract014'),{verifyFingerprint014,staticTest014}=require('./complexes-fingerprint-qa014');","const {verifyStatic015:verifyStatic014,BASE}=require('./streetscape-static-contract015'),{verifyFingerprint015:verifyFingerprint014,staticTest015:staticTest014}=require('./streetscape-fingerprint015');");
  rep('strict current014 source and all protected previous source including cold topology','strict current015 source and all protected T727 source including cold topology');
  rep('all2947 old complete leaves and1728 blocks unchanged plus exactly112 new','all3059 old complete leaves and1728 blocks unchanged plus exactly32 streetscape additions');
 }
 if(suite==='publiclife'||suite==='station'){
  rep("((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.30'&&staticProof.anchor==='T726')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.version==='14.31'&&staticProof.anchor==='T727'))","((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.31'&&staticProof.anchor==='T727')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.version==='14.32'&&staticProof.anchor==='T728'))");
  rep('nativeProof.proof.projectedOnlyDeclared164','nativeProof.proof.projectedOnlyDeclared196');rep('nativeProof.proof.currentLeaves===3059','nativeProof.proof.currentLeaves===3091');
  rep("...require('./complexes-static-contract014').expectedAdditions]","...require('./complexes-static-contract014').expectedAdditions,...require('./streetscape-static-contract015').expectedAdditions]",2);
  rep("all2795 prior leaves paired with exactly264 declared additions',Object.keys(fp.subs||{}).length===3059","all2795 prior leaves paired with exactly296 declared additions',Object.keys(fp.subs||{}).length===3091");
  rep('exactly264 cumulative declared canonical leaves','exactly296 cumulative declared canonical leaves');
  rep("exactly eight declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"theatre013\\\"]'","exactly nine declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\"]'");
  rep('all2807 old leaves exact and exactly252 declared cumulative additions','all2807 old leaves exact and exactly284 declared cumulative additions');
  rep('complete in-memory QA extension equals every3059 native leaf and family aggregate','complete in-memory QA extension equals every3091 native leaf and family aggregate');
 }
 if(suite==='coldload'){
  rep("const {verifyStatic014:verifyStatic011}=require('./complexes-static-contract014');","const {verifyStatic015:verifyStatic011}=require('./streetscape-static-contract015');");
  rep("const {verifyFingerprint014:verifyFingerprint011}=require('./complexes-fingerprint-qa014');","const {verifyFingerprint015:verifyFingerprint011}=require('./streetscape-fingerprint015');");
  rep("((report.static.release===false&&report.static.phase==='candidate'&&version==='14.30'&&anchor==='T726')||(report.static.release===true&&report.static.phase==='release'&&version==='14.31'&&anchor==='T727'))","((report.static.release===false&&report.static.phase==='candidate'&&version==='14.31'&&anchor==='T727')||(report.static.release===true&&report.static.phase==='release'&&version==='14.32'&&anchor==='T728'))");
  rep("all2947 approved leaves and1728 complete blocks exact plus precisely112 complex leaves in160 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===2947&&report.fingerprint.newLeaves===112&&fp.stats.leaves===3059&&fp.stats.families===160","all3059 approved leaves and1728 complete blocks exact plus precisely32 streetscape leaves in161 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3059&&report.fingerprint.newLeaves===32&&fp.stats.leaves===3091&&fp.stats.families===161");
 }
 if(suite==='compatibility'){
  rep("require('./complexes-compatibility014').riversideRuntimeSource014()","require('./streetscape-compatibility015').riversideRuntimeSource015()");
  rep("const theatreCompat=require('./complexes-compatibility014');","const theatreCompat=require('./streetscape-compatibility015');");
  const old=require('./complexes-static-contract014');rep("const ROOT=__dirname,BASE='"+old.BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");rep("const HASH='"+old.BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  rep("require('./complexes-compatibility014').normalizeCompatibility014(out.runs,staticProof)","require('./streetscape-compatibility015').normalizeCompatibility015(out.runs,staticProof)");
  const n=adapted.split("label==='candidate'?staticProof.version:'14.30'").length-1;rep("label==='candidate'?staticProof.version:'14.30'","label==='candidate'?staticProof.version:'14.31'",n);
  const m=adapted.split("label==='candidate'?staticProof.anchor:'T726'").length-1;rep("label==='candidate'?staticProof.anchor:'T726'","label==='candidate'?staticProof.anchor:'T727'",m);
 }
 let recovered=adapted;for(const q of [...edits].reverse()){if(recovered.split(q.to).length-1!==q.count)throw Error('Non-unique reverse015 gate');recovered=recovered.split(q.to).join(q.from);}if(recovered!==previous.adapted)throw Error('Unlisted runtime adapter edit');new vm.Script(adapted,{filename:'.streetscape-'+suite+'-runtime015.js'});
 return{adapted,previous,edits,proof:{suite,base:fixed.BASE,previousSourceSHA256:fixed.hash(previous.adapted),adaptedSourceSHA256:fixed.hash(adapted),sourceReversalExact:true,actualGameAPIUnmodified:true,previousProof:previous.proof}};
}
function staticTest015(){
 const rows=SUITES.map(suite=>{const q=buildAdapter015(suite);return{...q.proof,edits:q.edits.length,nested:suite==='complexes'?{}:prior.nestedStatic014(suite,{...q.previous,adapted:q.adapted})};});
 return{ok:true,sourceOnly:true,gameExecuted:false,rows,normalizer:require('./streetscape-compatibility015').buildNormalizer015().proof};
}
function run015(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Isolated GitHub Actions only');const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.SC015_SUITE||'complexes',mode=process.env.SC015_MODE||'preflight',group=process.env.SC015_GROUP||'college',q=buildAdapter015(suite),product=fixed.verifyStatic015();
 const out=path.join(ROOT,'streetscape-evidence','legacy',suite,mode+(suite==='complexes'?'-'+group:''));fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:product.sourceSHA256,phase:product.phase,release:product.release,edits:q.edits},null,2));
 const temp=path.join(ROOT,'.streetscape-'+suite+'-runtime015.js');try{fs.writeFileSync(temp,q.adapted,{flag:'wx'});const r=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,CX014_MODE:mode,CX014_GROUP:group,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,TH013_MODE:mode,...(suite==='coldload'?{COLD011_CASE:mode}:{})},stdio:'inherit',timeout:47*60*1000});if(r.error)throw r.error;if(r.status!==0)process.exitCode=r.status??1;}finally{fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter015,staticTest015,SUITES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest015(),null,2));else run015();}

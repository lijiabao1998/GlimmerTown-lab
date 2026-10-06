#!/usr/bin/env node
'use strict';
// Read-only, source-reversible adapters. No assertion or runtime fixture omitted.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync,spawnSync}=require('node:child_process');
const fixed=require('./gardenlife-static-contract016'),prior=require('./streetscape-legacy015'),ROOT=__dirname;
const SUITES=Object.freeze(['streetscape',...prior.SUITES]);
function buildAdapter016(suite){
 if(!SUITES.includes(suite))throw Error('Unknown legacy suite');
 const previous=suite==='streetscape'?{adapted:fs.readFileSync(path.join(ROOT,'streetscape-integration-qa015.js'),'utf8'),proof:{originalExact:true},file:'streetscape-integration-qa015.js'}:prior.buildAdapter015(suite);
 if(suite==='streetscape'&&previous.adapted!==fixed.baseFile(previous.file).toString())throw Error('Original native015 runtime source must remain exact');
 let adapted=previous.adapted;const edits=[];
 const rep=(a,b,n=1)=>{if(a===b||adapted.split(a).length-1!==n)throw Error('Exact016 QA anchor '+suite+' expected'+n+': '+a);adapted=adapted.split(a).join(b);edits.push({from:a,to:b,count:n});};
 const imports=adapted.split('./streetscape-historical-bridge015').length-1;if(imports)rep('./streetscape-historical-bridge015','./gardenlife-historical-bridge016',imports);
 if(suite==='streetscape'){
  rep("fixed=require('./streetscape-static-contract015'),native=require('./streetscape-fingerprint015')","fixed=require('./gardenlife-historical-bridge016').native015Contract,native=require('./gardenlife-fingerprint016')");
  rep('native.verifyFingerprint015(fp,blocks)','native.verifyFingerprint016(fp,blocks)');rep('native.staticTest015(proof)','native.staticTest016(proof)');
  rep('all3059 prior leaves160 families1728 blocks exact and only32 declared additions','all3091 prior leaves161 families1728 blocks exact and only24 garden-life additions');
 }
 if(suite==='complexes'){
  rep("const {verifyStatic015:verifyStatic014,BASE}=require('./streetscape-static-contract015'),{verifyFingerprint015:verifyFingerprint014,staticTest015:staticTest014}=require('./streetscape-fingerprint015');","const {verifyStatic016:verifyStatic014,BASE}=require('./gardenlife-static-contract016'),{verifyFingerprint016:verifyFingerprint014,staticTest016:staticTest014}=require('./gardenlife-fingerprint016');");
  rep('strict current015 source and all protected T727 source including cold topology','strict current016 source and all protected T728 source including cold topology');
  rep('all3059 old complete leaves and1728 blocks unchanged plus exactly32 streetscape additions','all3091 old complete leaves and1728 blocks unchanged plus exactly24 garden-life additions');
 }
 if(suite==='publiclife'||suite==='station'){
  rep("((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.31'&&staticProof.anchor==='T727')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.version==='14.32'&&staticProof.anchor==='T728'))","((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.32'&&staticProof.anchor==='T728')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.publicationApproved===true&&staticProof.version==='14.33'&&staticProof.anchor==='T729'))");
  rep('nativeProof.proof.projectedOnlyDeclared196','nativeProof.proof.projectedOnlyDeclared220');rep('nativeProof.proof.currentLeaves===3091','nativeProof.proof.currentLeaves===3115');
  rep("...require('./streetscape-static-contract015').expectedAdditions]","...require('./streetscape-static-contract015').expectedAdditions,...require('./gardenlife-static-contract016').expectedAdditions]",2);
  rep("all2795 prior leaves paired with exactly296 declared additions',Object.keys(fp.subs||{}).length===3091","all2795 prior leaves paired with exactly320 declared additions',Object.keys(fp.subs||{}).length===3115");
  rep('exactly296 cumulative declared canonical leaves','exactly320 cumulative declared canonical leaves');
  rep("exactly nine declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\"]'","exactly ten declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"gardenLife016\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\"]'");
  rep('all2807 old leaves exact and exactly284 declared cumulative additions','all2807 old leaves exact and exactly308 declared cumulative additions');
  rep('complete in-memory QA extension equals every3091 native leaf and family aggregate','complete in-memory QA extension equals every3115 native leaf and family aggregate');
 }
 if(suite==='coldload'){
  rep("const {verifyStatic015:verifyStatic011}=require('./streetscape-static-contract015');","const {verifyStatic016:verifyStatic011}=require('./gardenlife-static-contract016');");
  rep("const {verifyFingerprint015:verifyFingerprint011}=require('./streetscape-fingerprint015');","const {verifyFingerprint016:verifyFingerprint011}=require('./gardenlife-fingerprint016');");
  rep("((report.static.release===false&&report.static.phase==='candidate'&&version==='14.31'&&anchor==='T727')||(report.static.release===true&&report.static.phase==='release'&&version==='14.32'&&anchor==='T728'))","((report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.32'&&anchor==='T728')||(report.static.release===true&&report.static.phase==='release'&&report.static.publicationApproved===true&&version==='14.33'&&anchor==='T729'))");
  rep("all3059 approved leaves and1728 complete blocks exact plus precisely32 streetscape leaves in161 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3059&&report.fingerprint.newLeaves===32&&fp.stats.leaves===3091&&fp.stats.families===161","all3091 approved leaves and1728 complete blocks exact plus precisely24 garden-life leaves in162 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3091&&report.fingerprint.newLeaves===24&&fp.stats.leaves===3115&&fp.stats.families===162");
 }
 if(suite==='compatibility'){
  rep("require('./streetscape-compatibility015').riversideRuntimeSource015()","require('./gardenlife-compatibility016').riversideRuntimeSource016()");
  rep("const theatreCompat=require('./streetscape-compatibility015');","const theatreCompat=require('./gardenlife-compatibility016');");
  const old=require('./streetscape-static-contract015');rep("const ROOT=__dirname,BASE='"+old.BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");rep("const HASH='"+old.BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  rep("require('./streetscape-compatibility015').normalizeCompatibility015(out.runs,staticProof)","require('./gardenlife-compatibility016').normalizeCompatibility016(out.runs,staticProof)");
  const n=adapted.split("label==='candidate'?staticProof.version:'14.31'").length-1;rep("label==='candidate'?staticProof.version:'14.31'","label==='candidate'?staticProof.version:'14.32'",n);
  const m=adapted.split("label==='candidate'?staticProof.anchor:'T727'").length-1;rep("label==='candidate'?staticProof.anchor:'T727'","label==='candidate'?staticProof.anchor:'T728'",m);
 }
 let recovered=adapted;for(const q of [...edits].reverse()){if(recovered.split(q.to).length-1!==q.count)throw Error('Non-unique reverse016 gate');recovered=recovered.split(q.to).join(q.from);}if(recovered!==previous.adapted)throw Error('Unlisted runtime adapter edit');new vm.Script(adapted,{filename:'.gardenlife-'+suite+'-runtime016.js'});
 return{adapted,previous,edits,proof:{suite,base:fixed.BASE,previousSourceSHA256:fixed.hash(previous.adapted),adaptedSourceSHA256:fixed.hash(adapted),sourceReversalExact:true,actualGameAPIUnmodified:true,previousProof:previous.proof,currentCandidateOrReleaseProofRequired:true}};
}
function staticTest016(){const rows=SUITES.map(suite=>{const q=buildAdapter016(suite);return{...q.proof,edits:q.edits,nested:['streetscape','complexes'].includes(suite)?{}:require('./complexes-regression-adapter014').nestedStatic014(suite,{...q.previous.previous,adapted:q.adapted})};});return{ok:true,sourceOnly:true,gameExecuted:false,rows,normalizer:require('./gardenlife-compatibility016').buildNormalizer016().proof};}
function run016(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Isolated GitHub Actions only');const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.GL016_SUITE||'streetscape',mode=process.env.GL016_MODE||'preflight',group=process.env.GL016_GROUP||'college',product=fixed.verifyStatic016();
 // This mandatory current-head3115 proof always runs before an old runtime.
 const native=require('./gardenlife-fingerprint016').readPreflight016(),q=buildAdapter016(suite);
 const out=path.join(ROOT,'gardenlife-evidence','legacy',suite,mode+(suite==='complexes'?'-'+group:''));fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:product.sourceSHA256,version:product.version,anchor:product.anchor,phase:product.phase,release:product.release,publicationApproved:product.publicationApproved,strictNativeProof:native.proof,preflightEvidenceSHA256:native.evidenceSHA256,edits:q.edits},null,2));
 const temp=path.join(ROOT,'.gardenlife-'+suite+'-runtime016.js');let created=false;try{fs.writeFileSync(temp,q.adapted,{flag:'wx'});created=true;const r=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,SC015_MODE:mode,CX014_MODE:mode,CX014_GROUP:group,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,TH013_MODE:mode,...(suite==='coldload'?{COLD011_CASE:mode}:{})},stdio:'inherit',timeout:47*60*1000});if(r.error)throw r.error;if(r.status!==0)process.exitCode=r.status??1;}finally{if(created)fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter016,staticTest016,SUITES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest016(),null,2));else run016();}

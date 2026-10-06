#!/usr/bin/env node
'use strict';
// Count-checked reversible source adapters; every older assertion body remains.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync,spawnSync}=require('node:child_process');
const fixed=require('./quayside-static-contract017'),prior=require('./gardenlife-legacy016'),ROOT=__dirname;
const SUITES=Object.freeze(['gardenlife',...prior.SUITES]);
function buildAdapter017(suite){
 if(!SUITES.includes(suite))throw Error('Unknown legacy suite');
 const previous=suite==='gardenlife'?{adapted:fs.readFileSync(path.join(ROOT,'gardenlife-integration-qa016.js'),'utf8'),proof:{originalExact:true},file:'gardenlife-integration-qa016.js'}:prior.buildAdapter016(suite);
 if(suite==='gardenlife'&&previous.adapted!==fixed.baseFile(previous.file).toString())throw Error('Original native016 runtime source must remain exact');
 let adapted=previous.adapted;const edits=[];
 const rep=(a,b,n=1)=>{if(a===b||adapted.split(a).length-1!==n)throw Error('Exact017 QA anchor '+suite+' expected'+n+': '+a);adapted=adapted.split(a).join(b);edits.push({from:a,to:b,count:n});};
 const imports=adapted.split('./gardenlife-historical-bridge016').length-1;if(imports)rep('./gardenlife-historical-bridge016','./quayside-historical-bridge017',imports);
 if(suite==='gardenlife'){
  rep("fixed=require('./gardenlife-static-contract016'),native=require('./gardenlife-fingerprint016')","fixed=require('./quayside-historical-bridge017').native016Contract,native=require('./quayside-fingerprint017')");
  rep('native.verifyFingerprint016(fp,blocks)','native.verifyFingerprint017(fp,blocks)');rep('native.staticTest016(proof)','native.staticTest017(proof)');
  rep('all3091 prior leaves161 families1728 blocks exact and only24 declared additions','all3115 prior leaves162 families1728 blocks exact and only24 quayside additions');
 }
 if(suite==='streetscape'){
  rep("native=require('./gardenlife-fingerprint016')","native=require('./quayside-fingerprint017')");
  rep('native.verifyFingerprint016(fp,blocks)','native.verifyFingerprint017(fp,blocks)');rep('native.staticTest016(proof)','native.staticTest017(proof)');
  rep('all3091 prior leaves161 families1728 blocks exact and only24 garden-life additions','all3115 prior leaves162 families1728 blocks exact and only24 quayside additions');
 }
 if(suite==='complexes'){
  rep("const {verifyStatic016:verifyStatic014,BASE}=require('./gardenlife-static-contract016'),{verifyFingerprint016:verifyFingerprint014,staticTest016:staticTest014}=require('./gardenlife-fingerprint016');","const {verifyStatic017:verifyStatic014,BASE}=require('./quayside-static-contract017'),{verifyFingerprint017:verifyFingerprint014,staticTest017:staticTest014}=require('./quayside-fingerprint017');");
  rep('strict current016 source and all protected T728 source including cold topology','strict current017 source and all protected T729 source including cold topology');
  rep('all3091 old complete leaves and1728 blocks unchanged plus exactly24 garden-life additions','all3115 old complete leaves and1728 blocks unchanged plus exactly24 quayside additions');
 }
 if(suite==='publiclife'||suite==='station'){
  rep("((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.32'&&staticProof.anchor==='T728')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.publicationApproved===true&&staticProof.version==='14.33'&&staticProof.anchor==='T729'))","(staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.33'&&staticProof.anchor==='T729')");
  rep('nativeProof.proof.projectedOnlyDeclared220','nativeProof.proof.projectedOnlyDeclared244');rep('nativeProof.proof.currentLeaves===3115','nativeProof.proof.currentLeaves===3139');
  rep("...require('./gardenlife-static-contract016').expectedAdditions]","...require('./gardenlife-static-contract016').expectedAdditions,...require('./quayside-static-contract017').expectedAdditions]",2);
  rep("all2795 prior leaves paired with exactly320 declared additions',Object.keys(fp.subs||{}).length===3115","all2795 prior leaves paired with exactly344 declared additions',Object.keys(fp.subs||{}).length===3139");
  rep('exactly320 cumulative declared canonical leaves','exactly344 cumulative declared canonical leaves');
  rep("exactly ten declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"gardenLife016\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\"]'","exactly eleven declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"gardenLife016\\\",\\\"museum010\\\",\\\"quayside017\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\"]'");
  rep('all2807 old leaves exact and exactly308 declared cumulative additions','all2807 old leaves exact and exactly332 declared cumulative additions');
  rep('complete in-memory QA extension equals every3115 native leaf and family aggregate','complete in-memory QA extension equals every3139 native leaf and family aggregate');
 }
 if(suite==='coldload'){
  rep("const {verifyStatic016:verifyStatic011}=require('./gardenlife-static-contract016');","const {verifyStatic017:verifyStatic011}=require('./quayside-static-contract017');");
  rep("const {verifyFingerprint016:verifyFingerprint011}=require('./gardenlife-fingerprint016');","const {verifyFingerprint017:verifyFingerprint011}=require('./quayside-fingerprint017');");
  rep("((report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.32'&&anchor==='T728')||(report.static.release===true&&report.static.phase==='release'&&report.static.publicationApproved===true&&version==='14.33'&&anchor==='T729'))","(report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.33'&&anchor==='T729')");
  rep("all3091 approved leaves and1728 complete blocks exact plus precisely24 garden-life leaves in162 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3091&&report.fingerprint.newLeaves===24&&fp.stats.leaves===3115&&fp.stats.families===162","all3115 approved leaves and1728 complete blocks exact plus precisely24 quayside leaves in163 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3115&&report.fingerprint.newLeaves===24&&fp.stats.leaves===3139&&fp.stats.families===163");
 }
 if(suite==='compatibility'){
  rep("require('./gardenlife-compatibility016').riversideRuntimeSource016()","require('./quayside-compatibility017').riversideRuntimeSource017()");
  rep("const theatreCompat=require('./gardenlife-compatibility016');","const theatreCompat=require('./quayside-compatibility017');");
  const old=require('./gardenlife-static-contract016');rep("const ROOT=__dirname,BASE='"+old.BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");rep("const HASH='"+old.BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  rep("require('./gardenlife-compatibility016').normalizeCompatibility016(out.runs,staticProof)","require('./quayside-compatibility017').normalizeCompatibility017(out.runs,staticProof)");
  const n=adapted.split("label==='candidate'?staticProof.version:'14.32'").length-1;rep("label==='candidate'?staticProof.version:'14.32'","label==='candidate'?staticProof.version:'14.33'",n);
  const m=adapted.split("label==='candidate'?staticProof.anchor:'T728'").length-1;rep("label==='candidate'?staticProof.anchor:'T728'","label==='candidate'?staticProof.anchor:'T729'",m);
 }
 let recovered=adapted;for(const q of [...edits].reverse()){if(recovered.split(q.to).length-1!==q.count)throw Error('Non-unique reverse017 gate');recovered=recovered.split(q.to).join(q.from);}if(recovered!==previous.adapted)throw Error('Unlisted runtime adapter edit');new vm.Script(adapted,{filename:'.quayside-'+suite+'-runtime017.js'});
 return{adapted,previous,edits,proof:{suite,base:fixed.BASE,previousSourceSHA256:fixed.hash(previous.adapted),adaptedSourceSHA256:fixed.hash(adapted),sourceReversalExact:true,actualGameAPIUnmodified:true,previousProof:previous.proof,currentCandidateProofRequired:true,futureReleaseApproved:false}};
}
function staticTest017(){const previous=prior.staticTest016(),rows=SUITES.map(suite=>{const q=buildAdapter017(suite);return{...q.proof,edits:q.edits};});return{ok:true,sourceOnly:true,gameExecuted:false,previousSourceControls:previous,rows,normalizer:require('./quayside-compatibility017').buildNormalizer017().proof};}
function run017(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Isolated GitHub Actions only');const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.QS017_SUITE||'gardenlife',mode=process.env.QS017_MODE||'preflight',group=process.env.QS017_GROUP||'college',product=fixed.verifyStatic017();
 const native=require('./quayside-fingerprint017').readPreflight017(),q=buildAdapter017(suite);
 const out=path.join(ROOT,'quayside-evidence','legacy',suite,mode+(suite==='complexes'?'-'+group:''));fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:product.sourceSHA256,version:product.version,anchor:product.anchor,phase:product.phase,release:product.release,publicationApproved:product.publicationApproved,strictNativeProof:native.proof,preflightEvidenceSHA256:native.evidenceSHA256,edits:q.edits},null,2));
 const temp=path.join(ROOT,'.quayside-'+suite+'-runtime017.js');let created=false;try{fs.writeFileSync(temp,q.adapted,{flag:'wx'});created=true;const r=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,GL016_MODE:mode,SC015_MODE:mode,CX014_MODE:mode,CX014_GROUP:group,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,TH013_MODE:mode,...(suite==='coldload'?{COLD011_CASE:mode}:{})},stdio:'inherit',timeout:47*60*1000});if(r.error)throw r.error;if(r.status!==0)process.exitCode=r.status??1;}finally{if(created)fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter017,staticTest017,SUITES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest017(),null,2));else run017();}

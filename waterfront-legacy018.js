#!/usr/bin/env node
'use strict';
// Reversible source-only adapters. Every historical game API and assertion body remains.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync,spawnSync}=require('node:child_process');
const fixed=require('./waterfront-static-contract018'),prior=require('./quayside-legacy017'),ROOT=__dirname;
const SUITES=Object.freeze(['quayside',...prior.SUITES]);
function buildAdapter018(suite){
 if(!SUITES.includes(suite))throw Error('Unknown retained suite');
 const previous=suite==='quayside'?{adapted:fs.readFileSync(path.join(ROOT,'quayside-integration-qa017.js'),'utf8'),proof:{originalExact:true},file:'quayside-integration-qa017.js'}:prior.buildAdapter017(suite);
 if(suite==='quayside'&&previous.adapted!==fixed.baseFile(previous.file).toString())throw Error('Original017 native assertions must remain exact');
 let adapted=previous.adapted;const edits=[];
 const rep=(a,b,n=1)=>{if(a===b||adapted.split(a).length-1!==n)throw Error('Exact018 QA anchor '+suite+' expected '+n+': '+a);adapted=adapted.split(a).join(b);edits.push({from:a,to:b,count:n});};
 const imports=adapted.split('./quayside-historical-bridge017').length-1;if(imports)rep('./quayside-historical-bridge017','./waterfront-historical-bridge018',imports);
 if(suite==='quayside'){
  rep("fixed=require('./quayside-static-contract017'),native=require('./quayside-fingerprint017')","fixed=require('./waterfront-historical-bridge018').native017Contract,native=require('./waterfront-fingerprint018')");
  rep('native.verifyFingerprint017(fp,blocks)','native.verifyFingerprint018(fp,blocks)');rep('native.staticTest017(proof)','native.staticTest018(proof)');
  rep('all3115 prior leaves162 families1728 blocks exact and only24 declared additions','all3139 prior leaves163 families1728 blocks exact and only8 heritage additions');
 }
 if(suite==='gardenlife'||suite==='streetscape'){
  rep("native=require('./quayside-fingerprint017')","native=require('./waterfront-fingerprint018')");
  rep('native.verifyFingerprint017(fp,blocks)','native.verifyFingerprint018(fp,blocks)');rep('native.staticTest017(proof)','native.staticTest018(proof)');
  rep('all3115 prior leaves162 families1728 blocks exact and only24 quayside additions','all3139 prior leaves163 families1728 blocks exact and only8 heritage additions');
 }
 if(suite==='complexes'){
  rep("const {verifyStatic017:verifyStatic014,BASE}=require('./quayside-static-contract017'),{verifyFingerprint017:verifyFingerprint014,staticTest017:staticTest014}=require('./quayside-fingerprint017');","const {verifyStatic018:verifyStatic014,BASE}=require('./waterfront-static-contract018'),{verifyFingerprint018:verifyFingerprint014,staticTest018:staticTest014}=require('./waterfront-fingerprint018');");
  rep('strict current017 source and all protected T729 source including cold topology','strict current018 source and all protected T730 source including cold topology');
  rep('all3115 old complete leaves and1728 blocks unchanged plus exactly24 quayside additions','all3139 old complete leaves and1728 blocks unchanged plus exactly8 heritage additions');
 }
 if(suite==='publiclife'||suite==='station'){
  rep("((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.33'&&staticProof.anchor==='T729')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.publicationApproved===true&&staticProof.version==='14.34'&&staticProof.anchor==='T730'))","(staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.34'&&staticProof.anchor==='T730')");
  rep('nativeProof.proof.projectedOnlyDeclared244','nativeProof.proof.projectedOnlyDeclared252');rep('nativeProof.proof.currentLeaves===3139','nativeProof.proof.currentLeaves===3147');
  rep("...require('./quayside-static-contract017').expectedAdditions]","...require('./quayside-static-contract017').expectedAdditions,...require('./waterfront-static-contract018').expectedAdditions]",2);
  rep("all2795 prior leaves paired with exactly344 declared additions',Object.keys(fp.subs||{}).length===3139","all2795 prior leaves paired with exactly352 declared additions',Object.keys(fp.subs||{}).length===3147");
  rep('exactly344 cumulative declared canonical leaves','exactly352 cumulative declared canonical leaves');
  rep("exactly eleven declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"gardenLife016\\\",\\\"museum010\\\",\\\"quayside017\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\"]'","exactly twelve declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"gardenLife016\\\",\\\"museum010\\\",\\\"quayside017\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"streetscape015\\\",\\\"theatre013\\\",\\\"waterfront018\\\"]'");
  rep('all2807 old leaves exact and exactly332 declared cumulative additions','all2807 old leaves exact and exactly340 declared cumulative additions');
  rep('complete in-memory QA extension equals every3139 native leaf and family aggregate','complete in-memory QA extension equals every3147 native leaf and family aggregate');
 }
 if(suite==='coldload'){
  rep("const {verifyStatic017:verifyStatic011}=require('./quayside-static-contract017');","const {verifyStatic018:verifyStatic011}=require('./waterfront-static-contract018');");
  rep("const {verifyFingerprint017:verifyFingerprint011}=require('./quayside-fingerprint017');","const {verifyFingerprint018:verifyFingerprint011}=require('./waterfront-fingerprint018');");
  rep("((report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.33'&&anchor==='T729')||(report.static.release===true&&report.static.phase==='release'&&report.static.publicationApproved===true&&version==='14.34'&&anchor==='T730'))","(report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.34'&&anchor==='T730')");
  rep("all3115 approved leaves and1728 complete blocks exact plus precisely24 quayside leaves in163 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3115&&report.fingerprint.newLeaves===24&&fp.stats.leaves===3139&&fp.stats.families===163","all3139 approved leaves and1728 complete blocks exact plus precisely8 heritage leaves in164 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===3139&&report.fingerprint.newLeaves===8&&fp.stats.leaves===3147&&fp.stats.families===164");
 }
 if(suite==='compatibility'){
  rep("require('./quayside-compatibility017').riversideRuntimeSource017()","require('./waterfront-compatibility018').riversideRuntimeSource018()");
  rep("const theatreCompat=require('./quayside-compatibility017');","const theatreCompat=require('./waterfront-compatibility018');");
  const old=require('./quayside-static-contract017');rep("const ROOT=__dirname,BASE='"+old.BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");rep("const HASH='"+old.BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  rep("require('./quayside-compatibility017').normalizeCompatibility017(out.runs,staticProof)","require('./waterfront-compatibility018').normalizeCompatibility018(out.runs,staticProof)");
  const n=adapted.split("label==='candidate'?staticProof.version:'14.33'").length-1;rep("label==='candidate'?staticProof.version:'14.33'","label==='candidate'?staticProof.version:'14.34'",n);
  const m=adapted.split("label==='candidate'?staticProof.anchor:'T729'").length-1;rep("label==='candidate'?staticProof.anchor:'T729'","label==='candidate'?staticProof.anchor:'T730'",m);
 }
 let recovered=adapted;for(const q of [...edits].reverse()){if(recovered.split(q.to).length-1!==q.count)throw Error('Non-unique reverse018 gate: '+q.to);recovered=recovered.split(q.to).join(q.from);}if(recovered!==previous.adapted)throw Error('Unlisted runtime adapter edit');new vm.Script(adapted,{filename:'.waterfront-'+suite+'-runtime018.js'});
 return{adapted,previous,edits,proof:{suite,base:fixed.BASE,previousSourceSHA256:fixed.hash(previous.adapted),adaptedSourceSHA256:fixed.hash(adapted),sourceReversalExact:true,actualGameAPIUnmodified:true,previousProof:previous.proof,currentCandidateProofRequired:true,currentPublicationApproved:false}};
}
function staticTest018(){const previous=prior.staticTest017(),rows=SUITES.map(suite=>{const q=buildAdapter018(suite);return{...q.proof,edits:q.edits};});return{ok:true,sourceOnly:true,gameExecuted:false,previousSourceControls:previous,rows,normalizer:require('./waterfront-compatibility018').buildNormalizer018().proof};}
function run018(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Isolated GitHub Actions only');const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.WF018_SUITE||'quayside',mode=process.env.WF018_MODE||'preflight',group=process.env.WF018_GROUP||'college',product=fixed.verifyStatic018();
 const native=require('./waterfront-fingerprint018').readPreflight018(),q=buildAdapter018(suite);
 const out=path.join(ROOT,'waterfront-evidence','legacy',suite,mode+(suite==='complexes'?'-'+group:''));fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:product.sourceSHA256,version:product.version,anchor:product.anchor,phase:product.phase,release:product.release,publicationApproved:product.publicationApproved,strictNativeProof:native.proof,preflightEvidenceSHA256:native.evidenceSHA256,edits:q.edits},null,2));
 const temp=path.join(ROOT,'.waterfront-'+suite+'-runtime018.js');let created=false;try{fs.writeFileSync(temp,q.adapted,{flag:'wx'});created=true;const r=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,QS017_MODE:mode,GL016_MODE:mode,SC015_MODE:mode,CX014_MODE:mode,CX014_GROUP:group,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,TH013_MODE:mode,...(suite==='coldload'?{COLD011_CASE:mode}:{})},stdio:'inherit',timeout:47*60*1000});if(r.error)throw r.error;if(r.status!==0)process.exitCode=r.status??1;}finally{if(created)fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter018,staticTest018,SUITES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest018(),null,2));else run018();}

#!/usr/bin/env node
'use strict';
// Source-exact outer adapters. Full3179 native evidence is verified before any
// Node-side historical3147 projection; every old browser function stays exact.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync,spawnSync}=require('node:child_process');
const fixed=require('./waterfront-quarter-contract019'),prior=require('./waterfront-legacy018'),{exactTransform018:transform}=require('./waterfront-compatibility018');
const SUITES=Object.freeze(['waterfront',...prior.SUITES]);
const routes=Object.freeze({'./waterfront-static-contract018':'./waterfront-quarter-source-adapter019','./waterfront-fingerprint018':'./waterfront-quarter-projection019','./waterfront-historical-bridge018':'./waterfront-quarter-historical019','./waterfront-compatibility018':'./waterfront-quarter-compatibility019'});
function source019(file){const source=fs.readFileSync(path.join(__dirname,file),'utf8');if(source!==fixed.baseFile(file).toString())throw Error('Protected old source differs: '+file);return source;}
function observationChanges019(source){const changes=[],matches=source.match(/await (?:ev|cdp\.evalJs)\((['"])GV\.fp536\(\)\1(?:,\s*(['"])[^'"\n]*\2)?(?:,\s*\d+)?\)/g)||[];for(const a of [...new Set(matches)])changes.push([a,"require('./waterfront-quarter-projection019').projectObservation019("+a+",{allowWorker:true})",matches.filter(q=>q===a).length]);return changes;}
function adaptNested019(source,mode){
 if(!['publiclife','station','streetlife'].includes(mode))throw Error('Unknown nested019 suite');const edits=observationChanges019(source);
 if(mode==='publiclife')edits.push(['compareSessionFingerprint(bootFP,report.cleanup.fingerprint,report.finalWorker)',"compareSessionFingerprint(bootFP,require('./waterfront-quarter-projection019').projectObservation019(report.cleanup.fingerprint,{allowWorker:true}),report.finalWorker)"]);
 if(!edits.length)throw Error('Every nested suite must expose its unmodified native fingerprint');const q=transform(source,edits);new vm.Script(q.adapted);return q;
}
function buildAdapter019(suite){
 if(!SUITES.includes(suite))throw Error('Unknown019 retained suite');const previous=suite==='waterfront'?{adapted:source019('waterfront-integration-qa018.js'),proof:{originalSourceFile:'waterfront-integration-qa018.js',originalExact:true}}:prior.buildAdapter018(suite),edits=[];
 for(const[a,b]of Object.entries(routes)){const n=previous.adapted.split(a).length-1;if(n)edits.push([a,b,n]);}
 let q=transform(previous.adapted,edits),more=[];
 const oldStatic="((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.34'&&staticProof.anchor==='T730')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.publicationApproved===true&&staticProof.version==='14.35'&&staticProof.anchor==='T731'))";
 const newStatic="(staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.publicationApproved===false&&staticProof.version==='14.35'&&staticProof.anchor==='T731')";
 if(suite==='publiclife'||suite==='station'){
  more.push([oldStatic,newStatic]);
  more.push(["const temporary=path.join(ROOT,'.museum-prior-'+mode+'-runtime010.js');","adapted=require('./waterfront-quarter-legacy019').adaptNested019(adapted,mode).adapted;\nconst temporary=path.join(ROOT,'.museum-prior-'+mode+'-runtime010.js');"]);
 }else if(suite==='streetlife')more.push(['new vm.Script(adapted);const OUT=',"adapted=require('./waterfront-quarter-legacy019').adaptNested019(adapted,'streetlife').adapted;\nnew vm.Script(adapted);const OUT="]);
 else if(suite==='compatibility'){
  const old=require('./waterfront-static-contract018');more.push(["const ROOT=__dirname,BASE='"+old.BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';"],["const HASH='"+old.BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';"]);
  for(const[a,b]of[["label==='candidate'?staticProof.version:'14.34'","label==='candidate'?staticProof.version:'14.35'"],["label==='candidate'?staticProof.anchor:'T730'","label==='candidate'?staticProof.anchor:'T731'"]])more.push([a,b,q.adapted.split(a).length-1]);
 }else{
  more.push(...observationChanges019(q.adapted));
  if(suite==='coldload')more.push(["((report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.34'&&anchor==='T730')||(report.static.release===true&&report.static.phase==='release'&&report.static.publicationApproved===true&&version==='14.35'&&anchor==='T731'))","(report.static.release===false&&report.static.phase==='candidate'&&report.static.publicationApproved===false&&version==='14.35'&&anchor==='T731')"]);
 }
 const next=transform(q.adapted,more);new vm.Script(next.adapted,{filename:'.waterfront-quarter-'+suite+'-runtime019.js'});
 return{adapted:next.adapted,previous,proof:{suite,original018Proof:previous.proof,routes:q.proof,observationAndProvenance:next.proof,sourceReversalExact:true,oldNumericAssertionThresholdsExact:true,oldBrowserFunctionsExact:true,gameAPIUnmodified:true,currentSourceValidator:'waterfront-quarter-contract019.verifyStatic019',currentReleaseApproved:false,independentFull3179BeforeProjection:true,projectionRemovesOnlyDeclared32:true}};
}
function staticTest019(){const rows=SUITES.map(s=>buildAdapter019(s).proof);return{ok:true,sourceOnly:true,gameExecuted:false,suites:SUITES,rows,bridge:require('./waterfront-quarter-historical019').buildBridge019().proof,fingerprint:require('./waterfront-quarter-projection019').buildHistoricalFingerprint019().proof};}
function run019(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Authorized isolated GitHub Actions only; no local game execution');const head=execFileSync('git',['rev-parse','HEAD'],{cwd:__dirname,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.WF019_SUITE||'waterfront',mode=process.env.WF019_MODE||'gameplay',group=process.env.WF019_GROUP||'college',preflight=require('./waterfront-quarter-projection019').readFull019(),q=buildAdapter019(suite),out=path.join(__dirname,'waterfront-quarter-evidence','retained',suite,mode+'-'+group);fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:preflight.product.sourceSHA256,preflightEvidenceSHA256:preflight.evidenceSHA256,strictFull3179NativeProof:preflight.proof,currentPublicationApproved:false},null,2));
 const temp=path.join(__dirname,'.waterfront-quarter-'+suite+'-runtime019.js');let created=false;try{fs.writeFileSync(temp,q.adapted,{flag:'wx'});created=true;const result=spawnSync(process.execPath,[temp],{cwd:__dirname,env:{...process.env,WF018_MODE:mode,QS017_MODE:mode,GL016_MODE:mode,SC015_MODE:mode,CX014_MODE:mode,CX014_GROUP:group,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,TH013_MODE:mode,...(suite==='coldload'?{COLD011_CASE:mode}:{})},stdio:'inherit',timeout:52*60*1000});if(result.error)throw result.error;process.exitCode=result.status??1;}finally{if(created)fs.rmSync(temp,{force:true});}
}
module.exports={SUITES,source019,observationChanges019,adaptNested019,buildAdapter019,staticTest019};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest019(),null,2));else run019();}

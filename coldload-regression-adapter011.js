#!/usr/bin/env node
'use strict';
// Temporary exact-source QA adapters. Historical files are never modified.
// --static-test performs only text transformations and syntax compilation.
const fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync,spawnSync}=require('child_process');
const fixed=require('./coldload-static-contract011'),ROOT=__dirname;
const FILES={museum:'museum-integration-qa010.js',publiclife:'museum-prior-regression-qa010.js',station:'museum-prior-regression-qa010.js',streetlife:'museum-streetlife-regression010.js',compatibility:'museum-compatibility-qa010.js'};
function buildAdapter011(suite){
 const file=FILES[suite];if(!file)throw Error('Unknown cold-load historical suite');
 const original=fs.readFileSync(path.join(ROOT,file),'utf8'),pinned=fixed.baseFile(file).toString();if(original!==pinned)throw Error('Historical suite differs from immutable deployed T723: '+file);
 let adapted=original;const audit=[];
 const once=(from,to)=>{if(adapted.split(from).length!==2)throw Error('Historical gate anchor is not unique: '+from);adapted=adapted.replace(from,to);audit.push({from,to,count:1});};
 if(suite==='publiclife'||suite==='station'){
  once("!((staticProof.release===false&&staticProof.version==='14.26'&&staticProof.anchor==='T722')||(staticProof.release===true&&staticProof.version==='14.27'&&staticProof.anchor==='T723'))", "(!staticProof.fixProofExact||nativeProof.proof.fixOldLeaves!==2895||nativeProof.proof.fixNewLeaves!==0)");
  // The helper lives inside a quoted generated-source replacement. Decode only
  // that exact JSON pair so the original replacement anchor stays untouched.
  const lines=adapted.split('\n'),matches=lines.map((l,i)=>[l,i]).filter(([l])=>l.includes('const streetPriorLog009=full=>{'));
  if(matches.length!==1)throw Error('Historical bounded-log adapter missing');
  const [line,i]=matches[0],pair=JSON.parse(line.trim().replace(/,$/,''));
  const start=pair[1].indexOf('const streetPriorLog009=full=>{'),endText='return previous;};',end=pair[1].indexOf(endText,start);
  if(start<0||end<start||pair[1].split(endText).length!==2)throw Error('Historical log-helper boundaries changed');
  pair[1]=pair[1].slice(0,start)+"const streetPriorLog009=full=>require('./coldload-museum-bridge011').priorLog011(full);"+pair[1].slice(end+endText.length);
  once(line,' '+JSON.stringify(pair)+',');
 }
 if(suite==='compatibility'){
  once("const ROOT=__dirname,BASE='d9dfe87689fa841edb8775d0f95db77d9f2deb5b';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");
  once("const HASH='b00099c4837038812278ee5e3f86528416731e24904559e60befb575b315934f';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  once("const version=label==='candidate'?staticProof.version:'14.26',anchor=label==='candidate'?staticProof.anchor:'T722';", "const version=label==='candidate'?staticProof.version:'14.27',anchor=label==='candidate'?staticProof.anchor:'T723';");
  once("if(version!=='14.27'||anchor!=='T723')throw Error('Only approved T723 label normalization allowed');q.enterprise.version='14.26';q.enterprise.anchor='T722';", "if(version!=='14.28'||anchor!=='T724')throw Error('Only approved T724 label normalization allowed');q.enterprise.version='14.27';q.enterprise.anchor='T723';");
  once("to:{version:'14.26',anchor:'T722'},rawObservationsPreserved:true", "to:{version:'14.27',anchor:'T723'},rawObservationsPreserved:true");
 }
 // Known occurrences are recorded individually in the audit. These names occur
 // only in contract imports/quoted gate extensions, never simulation functions.
 for(const from of['./museum-static-contract010','./museum-fingerprint-qa010']){
  const to='./coldload-museum-bridge011',count=adapted.split(from).length-1;
  if(count<1&&!(suite==='compatibility'&&from.includes('fingerprint')))throw Error('Expected historical contract import missing: '+from);
  if(count){adapted=adapted.split(from).join(to);audit.push({from,to,count});}
 }
 if(suite==='museum'){
  const start='function nativeScene010(';if(original.split(start).length!==2||original.slice(original.indexOf(start))!==adapted.slice(adapted.indexOf(start)))throw Error('Original museum runtime functions or assertions changed');
 }
 if(suite==='compatibility'){
  const start='const originalRng=',end='(async()=>';if(original.split(start).length!==2||original.split(end).length!==2||original.slice(original.indexOf(start),original.indexOf(end))!==adapted.slice(adapted.indexOf(start),adapted.indexOf(end)))throw Error('Original warm-world simulation/checkpoints changed');
 }
 if(suite==='streetlife'){
  const start='const start=\'function setupStreet009(\'';if(original.split(start).length!==2||original.slice(original.indexOf(start))!==adapted.slice(adapted.indexOf(start)))throw Error('Original streetlife runtime-preservation assertions changed');
 }
 new vm.Script(adapted,{filename:'.coldload-'+suite+'-runtime011.js'});
 return{file,original,adapted,audit,proof:{suite,baseline:fixed.BASE,originalSHA256:fixed.hash(original),adaptedSHA256:fixed.hash(adapted),originalExact:true,runtimeFunctionsExact:true,gameplayAssertionsExact:true,gateOnly:true}};
}
function staticTest011(){
 const results=[];for(const suite of Object.keys(FILES)){
  const q=buildAdapter011(suite);results.push({...q.proof,transformations:q.audit.length});
  // Run only the nested adapter's string replacement logic, not its imports,
  // filesystem output, browser launcher, native functions or test assertions.
  if(suite==='publiclife'||suite==='station'){
   const mode=suite,original=fs.readFileSync(path.join(ROOT,mode==='publiclife'?'publiclife-integration-qa.js':'station-integration-qa008.js'),'utf8');
   const start=q.adapted.indexOf('const oldGate='),end=q.adapted.indexOf('const temporary=');if(start<0||end<start)throw Error('Nested historical adapter boundaries missing');
   const context={mode,original};new vm.Script(q.adapted.slice(start,end)+';globalThis.output=adapted;').runInNewContext(context);new vm.Script(context.output);
  }
  if(suite==='streetlife'){
   const original=fs.readFileSync(path.join(ROOT,'streetlife-integration-qa009.js'),'utf8'),start=q.adapted.indexOf('const edits='),end=q.adapted.indexOf('new vm.Script(adapted)');
   if(start<0||end<start)throw Error('Nested streetlife adapter boundaries missing');const context={original};new vm.Script(q.adapted.slice(start,end)+';globalThis.output=adapted;').runInNewContext(context);new vm.Script(context.output);
  }
 }return{ok:true,sourceOnly:true,gameExecuted:false,results};
}
function run011(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Runtime adapters run only in authorized isolated GitHub Actions');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.CL011_SUITE||'museum',mode=process.env.CL011_MODE||'preflight';if(suite==='museum'&&!/^(preflight|fingerprint|gameplay|camera[0-3]|construction[0-3]|weather)$/.test(mode))throw Error('Unknown native museum evidence mode');
 const product=fixed.verifyStatic011(),q=buildAdapter011(suite);let native;
 if(['publiclife','station','streetlife','compatibility'].includes(suite))native=require('./coldload-fingerprint-qa011').readPreflight011();
 const out=path.join(ROOT,'coldload-evidence',suite==='museum'?mode:suite,'guards');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'runtime-adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:product.sourceSHA256,patchManifestSHA256:product.patchManifestSHA256,version:product.version,anchor:product.anchor,phase:product.phase,changes:q.audit,strictNativeProjection:native?.proof,preflightEvidenceSHA256:native?.evidenceSHA256},null,2));
 const temp=path.join(ROOT,'.coldload-'+suite+'-runtime011.js');
 try{fs.writeFileSync(temp,q.adapted);const r=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,MU010_MODE:mode,MU010_PRIOR:suite},stdio:'inherit',timeout:45*60*1000});if(r.error)throw r.error;process.exitCode=r.status??1;}finally{fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter011,staticTest011};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest011(),null,2));else run011();}

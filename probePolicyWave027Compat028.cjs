'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('GPT-028 candidate integration runs on GitHub Actions only');
// Read-only candidate integration. No repository writes, pushes or deployments.
// The old art branch stays intact; this runner restores every temporary byte.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const ROOT=__dirname,ART='9aa8a42ef2b26fccf0974334bd5090ae225304ed',OLD_BASE='58130eae1f5451a5f56142b5fab7b003b910155e',REPAIR='2d1bb264ea5c35ef6c476231d6a5386d3d5a3bfd';
const mode=process.argv[2];assert(['native','normal-pairs'].includes(mode),'explicit original guard');
const probe=mode==='native'?'probeBritishWave027.cjs':'probeNativePairs027.cjs',OUT=path.join(ROOT,'shots','policy028-compat',mode);
const names=['index.html','british-wave02-art027.js','wave027-runtime.js','wave027.css','embed-wave027.cjs',probe],saved=new Map(names.map(p=>[p,fs.existsSync(path.join(ROOT,p))?fs.readFileSync(path.join(ROOT,p)):null]));
const git=(ref,p)=>cp.execFileSync('git',['show',ref+':'+p],{cwd:ROOT,maxBuffer:30*1024*1024}),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const report={head:process.env.GITHUB_SHA,art:ART,artBase:OLD_BASE,independentRepairCandidate:REPAIR,mode,actualMainMerged:false,fieldExclusions:[],runs:[],sourceIdentity:[]};
function once(s,a,b){assert.equal(s.split(a).length,2,'one exact integration anchor '+a.slice(0,80));return s.replace(a,b);}
function evidenceOnly(original){
  let s=original;
  if(mode==='normal-pairs'){
    const a='headTen=br.tenTransactions;',b=a+"fs.writeFileSync(path.join(OUT,'compat-all-base.json'),JSON.stringify(ar,null,2)+'\\n');fs.writeFileSync(path.join(OUT,'compat-all-head.json'),JSON.stringify(br,null,2)+'\\n');";
    s=once(s,a,b);assert.equal(s.replace(b,a),original,'all original pair assertions byte-identical');
  }else{
    const edits=[
      ['const originalSave=JSON.stringify(canonical(JSON.parse(GV.rawSave())));','const originalSave=JSON.stringify(canonical(JSON.parse(GV.rawSave())));window.__policyCompatInput028=JSON.parse(originalSave);'],
      ['const actual=JSON.stringify(canonical(JSON.parse(GV.rawSave())));','const actual=JSON.stringify(canonical(JSON.parse(GV.rawSave())));window.__policyCompatOutput028=JSON.parse(actual);'],
      ["const r=await cdp.evalJs('('+nativeChecks.toString()+')()');","let r;try{r=await cdp.evalJs('('+nativeChecks.toString()+')()');}finally{const evidence=await cdp.evalJs('({input:window.__policyCompatInput028,output:window.__policyCompatOutput028})');fs.writeFileSync(path.join(OUT,'compat-exact-native-save.json'),JSON.stringify(evidence,null,2)+'\\n');}"]
    ];
    for(const[a,b]of edits)s=once(s,a,b);let back=s;for(const[a,b]of edits)back=back.replace(b,a);assert.equal(back,original,'all original native assertions byte-identical');
  }
  return s;
}
function run(label,expectedRed=false){
  const r=cp.spawnSync(process.execPath,[probe],{cwd:ROOT,encoding:'utf8',maxBuffer:100*1024*1024,timeout:18*60*1000,env:{...process.env,GITHUB_STEP_SUMMARY:''}}),log=(r.stdout||'')+(r.stderr||'');
  fs.writeFileSync(path.join(OUT,label+'.log'),log);
  const artifact=path.join(ROOT,'shots','wave027');if(fs.existsSync(artifact))fs.cpSync(artifact,path.join(OUT,label+'-raw'),{recursive:true});
  if(mode==='normal-pairs'){
    const p=path.join(artifact,'normal-pairs','compat-all-base.json');if(fs.existsSync(p)){
      const originalBase=JSON.parse(fs.readFileSync(p,'utf8')),input=originalBase.tenTransactions.initialized,bytes=Buffer.from(JSON.stringify(input,null,2)+'\n'),name=label+'-base-ten-input.json';fs.writeFileSync(path.join(OUT,name),bytes);
      console.log('POLICY028_COMPAT_INPUT_BEGIN '+JSON.stringify({name,bytes:bytes.length,sha256:sha(bytes),base:label==='original-unrepaired-art'?OLD_BASE:REPAIR,pol:input.pol,govAggregate:input.gov513?.lastAggregateDay,day:input.day}));const encoded=bytes.toString('base64');for(let i=0;i<encoded.length;i+=4096)console.log('POLICY028_COMPAT_INPUT_DATA '+encoded.slice(i,i+4096));console.log('POLICY028_COMPAT_INPUT_END '+name);
    }
  }
  const first=log.split('\n').find(l=>mode==='native'?l.includes('complete-field save roundtrip 0')&&l.includes('"path":"pol"'):l.includes('complete native model differs at pol: null ->'));
  report.runs.push({label,exit:r.status,error:r.error?.message,firstRed:first?.slice(0,3000),logSHA256:sha(log)});
  if(expectedRed){assert.notEqual(r.status,0,'unmodified original art must reproduce its reported RED');assert(first,'unmodified original guard must first RED at exact pol difference');console.log('POLICY028_COMPAT first RED '+mode+' '+first.slice(0,2000));}
  else{assert.equal(r.status,0,'original complete '+mode+' guard must pass after candidate repair; see '+label+'.log');console.log('POLICY028_COMPAT restored GREEN '+mode);}
}
fs.mkdirSync(OUT,{recursive:true});
try{
  const original=git(ART,probe).toString(),recorded=evidenceOnly(original);
  for(const p of names){const b=git(ART,p);fs.writeFileSync(path.join(ROOT,p),b);report.sourceIdentity.push({path:p,artSHA256:sha(b)});}
  fs.writeFileSync(path.join(ROOT,probe),recorded);
  run('original-unrepaired-art',true);
  // Select the real, separately committed repair candidate as the independent
  // BASE. No assertion, tolerance or compared field is removed or changed.
  const repair=git(REPAIR,'index.html').toString(),old=git(OLD_BASE,'index.html').toString();
  const getBlock=kind=>{const start='/* GPT-028 POLICY '+kind+' BEGIN */',end='/* GPT-028 POLICY '+kind+' END */\n',a=repair.indexOf(start),b=repair.indexOf(end,a);assert(a>=0&&b>a);return repair.slice(a,b+end.length);};
  const helper=getBlock('CLASSIFICATION'),exported=getBlock('EXPORT'),before='policyLoad504(d.p504,d.p504===undefined);',after='policyLoad504(d.p504,legacyPolicyLoad028(d));';
  assert.equal(repair.replace(helper,'').replace(exported,'').replace(after,before),old,'repair changes only independently reviewed native classification');
  let candidate=git(ART,'index.html').toString();candidate=once(candidate,'function load(slot){',helper+'function load(slot){');candidate=once(candidate,before,after);
  const exportAnchor='Object.assign(window.GV,{fiscalLoad026:Object.freeze({status:()=>({depth:fiscalLoadDepth026,active:fiscalLoading026()}),selftest:fiscalLoad026Selftest})});\n';candidate=once(candidate,exportAnchor,exportAnchor+exported);
  const newProbe=once(recorded,"BASE='"+OLD_BASE+"'","BASE='"+REPAIR+"'");assert.equal(newProbe.replace("BASE='"+REPAIR+"'","BASE='"+OLD_BASE+"'"),recorded,'only independent BASE selection changes after evidence-only archiving');
  fs.writeFileSync(path.join(ROOT,'index.html'),candidate);fs.writeFileSync(path.join(ROOT,probe),newProbe);
  fs.rmSync(path.join(ROOT,'shots','wave027'),{recursive:true,force:true});
  report.candidateIndexSHA256=sha(candidate);report.originalGuardSHA256=sha(original);report.recordedGuardSHA256=sha(recorded);report.candidateGuardSHA256=sha(newProbe);
  run('repair-candidate-with-original-acceptance');
}catch(e){report.failure=e.stack;console.error(e.stack);process.exitCode=1;}
finally{
  for(const[p,b]of saved){if(b===null)fs.rmSync(path.join(ROOT,p),{force:true});else fs.writeFileSync(path.join(ROOT,p),b);}
  for(const[p,b]of saved)assert(b===null?!fs.existsSync(path.join(ROOT,p)):fs.readFileSync(path.join(ROOT,p)).equals(b),'restore exact temporary source '+p);
  report.temporarySourcesRestored=true;fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('POLICY028_COMPAT RESULT '+JSON.stringify(report));
}

#!/usr/bin/env node
'use strict';
// GPT-020 merge-readiness evidence. Browser execution is CI-only.
// Preserve the unchanged fp.js --check result; never bless fp.json/style.json.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync,spawnSync}=require('node:child_process');
const assert=require('node:assert/strict');
const ROOT=__dirname,OUT=path.join(ROOT,'touch-pixel-evidence020');
const BASE='44849ee7ddb2292daddf478b28978f9d0d7edf0d';
const BASE_BLOB='3dc0323bf1f26cc73b75cb2054f4d5f3b36d1789';
const CANDIDATE_BLOB='97917dc93167735ea75862182857135fff20cfa8';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const git=(...args)=>execFileSync('git',args,{cwd:ROOT,maxBuffer:32*1024*1024});
function compareComplete(base,candidate){
  assert.deepEqual(candidate.fp,base.fp,'Complete sprite records and aggregates must be unchanged');
  assert.deepEqual(candidate.style,base.style,'Every style record and family must be unchanged');
  assert.deepEqual(candidate.blocks,base.blocks,'Every deterministic block record must be unchanged');
  return {sprites:Object.keys(candidate.fp.subs).length,families:Object.keys(candidate.fp.families).length,blocks:Object.keys(candidate.blocks.entries).length,
    spriteSHA256:hash(canonical(candidate.fp)),styleSHA256:hash(canonical(candidate.style)),blockSHA256:hash(canonical(candidate.blocks))};
}
function comparisonUnitTests(){
  const a={fp:{ok:true,subs:{leaf:{d:'1234',n:'5678',w:1,h:1,op:1}},families:{test:{crc:'1'}},stats:{leaves:1}},style:{ok:true,families:{test:{value:1}},leaves:{leaf:{op:1}}},blocks:{ok:true,entries:{one:{d:'a',n:'b'}},count:1}};
  compareComplete(a,structuredClone(a));
  const edits=[q=>q.fp.subs.leaf.d='bad',q=>q.fp.subs.leaf.op++,q=>delete q.fp.subs.leaf,q=>q.fp.families.test.crc='bad',q=>q.fp.stats.leaves++,q=>q.style.leaves.leaf.op++,q=>q.style.families.test.value++,q=>q.blocks.entries.one.n='bad',q=>q.blocks.count++];
  for(const edit of edits){const b=structuredClone(a);edit(b);assert.throws(()=>compareComplete(a,b));}
  console.log('PASS complete-record comparison: positive + '+edits.length+' mutation negatives');
}
if(process.argv.includes('--static-test')){comparisonUnitTests();process.exit(0);}
if(process.env.GITHUB_ACTIONS!=='true')throw new Error('Native game/pixel probes run only in isolated GitHub Actions');
fs.mkdirSync(OUT,{recursive:true});
const index=path.join(ROOT,'index.html'),candidate=fs.readFileSync(index),baseline=git('show',BASE+':index.html');
assert.equal(blob(baseline),BASE_BLOB);assert.equal(blob(candidate),CANDIDATE_BLOB);
const head=git('rev-parse','HEAD').toString().trim();assert.equal(head,process.env.GITHUB_SHA,'Exact workflow checkout required');
const protectedFiles=['fp.js','fp.json','style.json','harness.js'];
const protectedBefore=Object.fromEntries(protectedFiles.map(file=>[file,hash(fs.readFileSync(path.join(ROOT,file)))]));
for(const file of protectedFiles)assert.equal(protectedBefore[file],hash(git('show',BASE+':'+file)),file+' must remain exact T732');
const report={checkedSHA:head,base:BASE,baseBlob:BASE_BLOB,candidateBlob:CANDIDATE_BLOB,protectedBefore,observations:{},checks:[],ok:false};
const save=()=>fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2)+'\n');
const check=(name,ok,detail)=>{report.checks.push({name,ok:!!ok,detail});save();console.log((ok?'PASS ':'FAIL ')+name+(detail?' '+JSON.stringify(detail):''));assert.ok(ok,name);};
function observe(label,bytes){
  fs.writeFileSync(index,bytes);
  const output=path.join(OUT,label+'.json');
  if(fs.existsSync(output))fs.unlinkSync(output); // stale evidence must never satisfy a failed capture
  const child=spawnSync(process.execPath,['--require',path.join(ROOT,'touch-pixels020.capture.cjs'),path.join(ROOT,'fp.js'),'--check'],{cwd:ROOT,encoding:'utf8',timeout:600000,maxBuffer:16*1024*1024,env:{...process.env,GPT020_FP_OUTPUT:output}});
  const log=(child.stdout||'')+(child.stderr||'');fs.writeFileSync(path.join(OUT,label+'-fp-check.log'),log);
  console.log('=== '+label+' unchanged fp.js --check (exit '+child.status+') ===\n'+log);
  if(child.error)throw child.error;
  const raw=JSON.parse(fs.readFileSync(output,'utf8'));
  report.observations[label]={exitCode:child.status,sourceBlob:blob(bytes),logSHA256:hash(log),snapshotSHA256:hash(fs.readFileSync(output))};save();
  check(label+' browser session complete',raw.session.ok&&raw.errors.length===0&&raw.result?.fp?.ok&&raw.result?.style?.ok&&raw.result?.blocks?.ok,{fails:raw.session.fails,errors:raw.errors});
  check(label+' strict command returned a documented result',child.status===0||child.status===1);
  return raw.result;
}
try{
  comparisonUnitTests();
  const before=observe('main',baseline),after=observe('candidate',candidate);
  report.parity=compareComplete(before,after);check('complete native sprite, block and style equality against pinned main',true,report.parity);
  fs.writeFileSync(index,candidate);
  // T732's verifier deliberately pins its historical smoke.js too. Execute that
  // verifier intact in a detached main worktree, against the candidate's captured
  // data; do not weaken its source pins or pretend the changed test runner is old.
  const frozen=path.join(ROOT,'.touch-pixel-baseline020');
  assert.ok(!fs.existsSync(frozen),'Fresh immutable verifier worktree required');
  git('worktree','add','--detach',frozen,BASE);
  const proof=execFileSync(process.execPath,['-e',
    "const fs=require('node:fs');const q=JSON.parse(fs.readFileSync(process.argv[1],'utf8')).result;const p=require('./waterfront-quarter-release-contract019').verifyApprovedNative019(q.fp,q.blocks);console.log(JSON.stringify({approvedSHA:p.nativeCheckedSHA,subsSHA256:p.nativeFullSubsSHA256,blocksSHA256:p.nativeBlocksSHA256}));",
    path.join(OUT,'candidate.json')],{cwd:frozen,encoding:'utf8',maxBuffer:4*1024*1024});
  report.approvedNative=JSON.parse(proof);
  execFileSync('git',['diff','--exit-code','HEAD'],{cwd:frozen});
  check('all current pixels match owner-approved T732 native pins',true,report.approvedNative);
  report.strictFingerprintGreen=report.observations.main.exitCode===0&&report.observations.candidate.exitCode===0;
  report.inheritedStrictFailure=report.observations.main.exitCode===1&&report.observations.candidate.exitCode===1;
  check('strict fingerprint status does not regress',report.observations.main.exitCode===report.observations.candidate.exitCode);
  report.ok=true;
}catch(error){report.error=error.stack||String(error);console.error(error);process.exitCode=1;}
finally{
  fs.writeFileSync(index,candidate);
  report.sourceRestored=blob(fs.readFileSync(index))===CANDIDATE_BLOB;
  report.protectedAfter=Object.fromEntries(protectedFiles.map(file=>[file,hash(fs.readFileSync(path.join(ROOT,file)))]));
  if(!report.sourceRestored||canonical(report.protectedAfter)!==canonical(protectedBefore)){report.ok=false;process.exitCode=1;report.restorationError='Product source or protected baselines changed';}
  save();
  if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'strict_green='+String(!!report.strictFingerprintGreen)+'\ninherited_failure='+String(!!report.inheritedStrictFailure)+'\n');
  console.log('GPT-020 PIXEL RESULT '+JSON.stringify({ok:report.ok,strictFingerprintGreen:report.strictFingerprintGreen,inheritedStrictFailure:report.inheritedStrictFailure,parity:report.parity,sourceRestored:report.sourceRestored}));
}

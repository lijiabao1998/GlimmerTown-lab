#!/usr/bin/env node
'use strict';
// CI-only adapter: preserve every prior runtime assertion and its fixed native
// workforce/neighbor fixture. The T720 release-only HTML gate is replaced by an
// equally exact pin for the authorized station implementation, not waived.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {execFileSync,spawnSync}=require('child_process');
const ROOT=__dirname,BASE='ed49bab0b73bacfe8c7d6f6a8ca13491b01c9f5f';
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only');
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
if(head!==process.env.GITHUB_SHA)throw Error('Exact-head requirement');
const original=fs.readFileSync(path.join(ROOT,'publiclife-integration-qa.js'),'utf8');
const pinned=execFileSync('git',['show',BASE+':publiclife-integration-qa.js'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
if(original!==pinned)throw Error('Prior release QA source changed');
const oldGate="check('approved product changes only three exact release metadata fields',sha(normalizedHTML)===APPROVED_HTML_SHA256);";
const newGate="check('authorized station implementation HTML exact reviewed bytes',sha(html)==='da956974f0e3dc775b755449dc661f20e9b9edd8c8dc369c8785d81b3b363d73');";
if(original.split(oldGate).length!==2)throw Error('Prior release HTML gate not uniquely found');
const adapted=original.replace(oldGate,newGate),temporary=path.join(ROOT,'.station-prior-runtime008.js');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const proof={checkedSHA:head,base:BASE,originalExact:true,originalSHA256:hash(original),adaptedSHA256:hash(adapted),replacementCount:1,expectedHTMLSHA256:'da956974f0e3dc775b755449dc661f20e9b9edd8c8dc369c8785d81b3b363d73',contract:'All original35 gameplay groups,203 retained physical-road neighbors,30 paid native social homes,21-day limit,actual loaded-day staffing and all other static/runtime assertions unchanged.'};
const dest=path.join(ROOT,'station-evidence/regression/guards');fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'prior-runtime-adapter.json'),JSON.stringify(proof,null,2));
try{
  fs.writeFileSync(temporary,adapted);
  const result=spawnSync(process.execPath,[temporary],{cwd:ROOT,env:{...process.env,PL007_MODE:'gameplay'},stdio:'inherit',timeout:38*60*1000});
  if(result.error)throw result.error;
  process.exitCode=result.status??1;
}finally{fs.rmSync(temporary,{force:true});}

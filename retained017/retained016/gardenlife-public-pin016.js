#!/usr/bin/env node
'use strict';
// Source-only receipt generation, after full exact-candidate CI and deployment.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const c=require('./gardenlife-public-contract016');
if(process.argv.length!==6||process.argv[2]!=='--deployed'||process.argv[4]!=='--candidate')throw Error('Usage: node gardenlife-public-pin016.js --deployed /absolute/exact-main-checkout --candidate FINAL_TESTED_CANDIDATE_SHA');
const root=path.resolve(process.argv[3]),candidate=process.argv[5],git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
if(!/^[0-9a-f]{40}$/.test(candidate))throw Error('Explicit final fully tested release candidate SHA required');
if(git('status','--porcelain','--untracked-files=no'))throw Error('Clean exact release checkout required');
const html=fs.readFileSync(path.join(root,'index.html'));if(!c.expectedReleaseHTML(root).equals(html))throw Error('Only three approved release labels may differ');
const p={releaseCandidateSHA:candidate,releaseCandidateTree:git('rev-parse',candidate+'^{tree}'),releaseSHA:git('rev-parse','HEAD'),releaseTree:git('rev-parse','HEAD^{tree}'),releaseSubject:git('log','-1','--format=%s'),release:'T729',version:'14.33',officialURL:c.OFFICIAL,approvedSHA:c.APPROVED,approvedSourceSHA256:c.pins016.approvedSourceSHA256,sourceSHA256:c.hash(html),fingerprintSHA256:c.hash(fs.readFileSync(path.join(root,'fp.json')))};
c.verifyPins013(p);const file=path.join(__dirname,'gardenlife-public-release016.json');
if(fs.existsSync(file)&&fs.readFileSync(file,'utf8')!==JSON.stringify(p,null,2)+'\n')throw Error('Existing different receipt is not replaced automatically');
fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');
console.log(JSON.stringify(c.verifyRelease013(root,p.releaseSHA,p.sourceSHA256),null,2));

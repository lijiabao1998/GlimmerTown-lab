#!/usr/bin/env node
'use strict';
// Source/data-only finalization after parent independently verifies final131 CI and Pages.
// Writes only this observer's contract and receipts; never modifies deployed source.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),vm=require('node:vm'),{createRequire}=require('node:module');
const c=require('./quayside-public-contract017');
if(process.argv.length!==8||process.argv[2]!=='--deployed'||process.argv[4]!=='--candidate'||process.argv[6]!=='--pages-proof')throw Error('Usage: node quayside-public-pin017.js --deployed /exact/final-main-checkout --candidate FULL_FINAL_TESTED_CANDIDATE_SHA --pages-proof /verified/successful/pages-proof.json');
const root=path.resolve(process.argv[3]),candidate=process.argv[5],proofBytes=fs.readFileSync(path.resolve(process.argv[7])),proof=JSON.parse(proofBytes);
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
if(!/^[0-9a-f]{40}$/.test(candidate))throw Error('Explicit complete final tested candidate SHA required');
if(git('status','--porcelain','--untracked-files=no'))throw Error('Clean exact main source checkout required');
const html=fs.readFileSync(path.join(root,'index.html')),fp=fs.readFileSync(path.join(root,'fp.json'));
if(!c.expectedReleaseHTML(root).equals(html)||c.hash(html)!==c.pins017.expectedReleaseSourceSHA256||c.hash(fp)!==c.pins017.expectedReleaseBaselineSHA256)throw Error('Exact approved product bytes and complete promoted baseline required');
for(const[file,pin]of Object.entries(c.pins017.dependencies))if(c.hash(fs.readFileSync(path.join(root,file)))!==pin)throw Error('Protected product dependency changed: '+file);
const final={candidateSHA:candidate,candidateTree:git('rev-parse',candidate+'^{tree}'),sha:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),subject:git('log','-1','--format=%s'),pagesRun:String(proof.id)};
if(final.candidateTree!==final.tree||!/^\d+$/.test(final.pagesRun)||proof.repository!=='lijiabao1998/GlimmerTown-lab'||proof.head_sha!==final.sha||proof.head_branch!=='main'||proof.name!=='pages'||proof.status!=='completed'||proof.conclusion!=='success'||proof.title!==final.subject||proof.html_url!=='https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/'+final.pagesRun)throw Error('Exact successful same-repository final-main Pages proof required');
const receipt={releaseCandidateSHA:final.candidateSHA,releaseCandidateTree:final.candidateTree,releaseSHA:final.sha,releaseTree:final.tree,releaseSubject:final.subject,pagesRun:final.pagesRun,release:'T730',version:'14.34',officialURL:c.OFFICIAL,approvedSHA:c.APPROVED,approvedSourceSHA256:c.pins017.approvedSourceSHA256,sourceSHA256:c.hash(html),fingerprintSHA256:c.hash(fp)};
const file=path.join(__dirname,'quayside-public-contract017.js'),original=fs.readFileSync(file,'utf8'),pattern=/const FINAL_RELEASE=Object\.freeze\([^\n]+\);/g;
if([...original.matchAll(pattern)].length!==1)throw Error('Unique exact final release declaration required');
const next=original.replace(pattern,'const FINAL_RELEASE=Object.freeze('+JSON.stringify(final)+');'),target=path.join(__dirname,'quayside-public-release017.json'),receiptText=JSON.stringify(receipt,null,2)+'\n';
if(!c.FINAL_RELEASE.sha.startsWith('REQUIRED')&&(original!==next||fs.readFileSync(target,'utf8')!==receiptText))throw Error('An existing finalized receipt cannot be rebound automatically');
const mock={exports:{}};new vm.Script('(function(require,module,exports,__dirname){'+next+'\n})').runInThisContext()(createRequire(file),mock,mock.exports,__dirname);mock.exports.verifyPins013(receipt);
fs.writeFileSync(file,next);fs.writeFileSync(target,receiptText);fs.writeFileSync(path.join(__dirname,'quayside-public-pages-confirmation017.json'),proofBytes);
delete require.cache[require.resolve('./quayside-public-contract017')];
console.log(JSON.stringify(require('./quayside-public-contract017').verifyRelease013(root,final.sha,receipt.sourceSHA256),null,2));

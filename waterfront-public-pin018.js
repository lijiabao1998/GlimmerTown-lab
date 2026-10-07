#!/usr/bin/env node
'use strict';
// Source/data finalization only after independent final148 CI and Pages proof.
// Writes only this observer's contract/receipt/proof, never the release checkout.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process'),{createRequire}=require('node:module');
const c=require('./waterfront-public-contract018');
if(process.argv.length!==8||process.argv[2]!=='--deployed'||process.argv[4]!=='--candidate'||process.argv[6]!=='--pages-proof')throw Error('Usage: node waterfront-public-pin018.js --deployed /exact/final-main-checkout --candidate FULL_FINAL_TESTED_CANDIDATE_SHA --pages-proof /verified/successful/pages-proof.json');
const root=path.resolve(process.argv[3]),candidate=process.argv[5],proofBytes=fs.readFileSync(path.resolve(process.argv[7])),proof=JSON.parse(proofBytes),git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
if(!/^[0-9a-f]{40}$/.test(candidate)||git('status','--porcelain','--untracked-files=no'))throw Error('Explicit tested candidate and clean exact main checkout required');
c.verifyProduct018(root);
const final={candidateSHA:candidate,candidateTree:git('rev-parse',candidate+'^{tree}'),sha:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),subject:git('log','-1','--format=%s'),pagesRun:String(proof.id),fingerprintSHA256:c.hash(fs.readFileSync(path.join(root,'fp.json')))};
if(final.candidateTree!==final.tree||!/^\d+$/.test(final.pagesRun)||proof.repository!=='lijiabao1998/GlimmerTown-lab'||proof.head_sha!==final.sha||proof.head_branch!=='main'||proof.name!=='pages'||proof.status!=='completed'||proof.conclusion!=='success'||proof.title!==final.subject||proof.html_url!=='https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/'+final.pagesRun)throw Error('Exact successful same-repository final-main Pages proof required');
const receipt={releaseCandidateSHA:final.candidateSHA,releaseCandidateTree:final.candidateTree,releaseSHA:final.sha,releaseTree:final.tree,releaseSubject:final.subject,pagesRun:final.pagesRun,release:'T731',version:'14.35',officialURL:c.OFFICIAL,approvedSHA:c.APPROVED,approvedSourceSHA256:c.pins018.approvedSourceSHA256,sourceSHA256:c.pins018.expectedReleaseSourceSHA256,fingerprintSHA256:final.fingerprintSHA256};
const file=path.join(__dirname,'waterfront-public-contract018.js'),original=fs.readFileSync(file,'utf8'),pattern=/const FINAL_RELEASE=Object\.freeze\([^\n]+\);/g;
if([...original.matchAll(pattern)].length!==1)throw Error('Unique immutable release declaration required');
const next=original.replace(pattern,'const FINAL_RELEASE=Object.freeze('+JSON.stringify(final)+');'),target=path.join(__dirname,'waterfront-public-release018.json'),receiptText=JSON.stringify(receipt,null,2)+'\n';
if(!c.FINAL_RELEASE.sha.startsWith('REQUIRED')&&(original!==next||fs.readFileSync(target,'utf8')!==receiptText))throw Error('An existing finalized receipt cannot be rebound automatically');
const mock={exports:{}};new vm.Script('(function(require,module,exports,__dirname){'+next+'\n})').runInThisContext()(createRequire(file),mock,mock.exports,__dirname);mock.exports.verifyPins013(receipt);
fs.writeFileSync(file,next);fs.writeFileSync(target,receiptText);fs.writeFileSync(path.join(__dirname,'waterfront-public-pages-confirmation018.json'),proofBytes);
delete require.cache[require.resolve('./waterfront-public-contract018')];console.log(JSON.stringify(require('./waterfront-public-contract018').verifyRelease013(root,final.sha,receipt.sourceSHA256),null,2));

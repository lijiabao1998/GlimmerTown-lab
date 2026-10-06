#!/usr/bin/env node
'use strict';
// Source-only final receipt generation. Run in the separate observer checkout
// only after the parent confirms successful exact-main Pages publication.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const c=require('./streetscape-public-contract015');
if(process.argv.length!==4||process.argv[2]!=='--deployed')throw Error('Usage: node streetscape-public-pin015.js --deployed /absolute/exact-main-checkout');
const root=path.resolve(process.argv[3]),git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
if(git('status','--porcelain','--untracked-files=no'))throw Error('Clean exact release checkout required');
const html=fs.readFileSync(path.join(root,'index.html'));if(!c.expectedReleaseHTML(root).equals(html))throw Error('Only three approved release labels may differ');
const p={releaseSHA:git('rev-parse','HEAD'),releaseTree:git('rev-parse','HEAD^{tree}'),releaseSubject:git('log','-1','--format=%s'),release:'T728',version:'14.32',officialURL:c.OFFICIAL,approvedSHA:c.APPROVED,approvedSourceSHA256:c.pins015.approvedSourceSHA256,sourceSHA256:c.hash(html),fingerprintSHA256:c.hash(fs.readFileSync(path.join(root,'fp.json')))};
c.verifyPins013(p);const file=path.join(__dirname,'streetscape-public-release015.json');
if(fs.existsSync(file)&&fs.readFileSync(file,'utf8')!==JSON.stringify(p,null,2)+'\n')throw Error('Existing different receipt is not replaced automatically');
fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');
console.log(JSON.stringify(c.verifyRelease013(root,p.releaseSHA,p.sourceSHA256),null,2));

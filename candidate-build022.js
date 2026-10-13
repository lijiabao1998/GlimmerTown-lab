#!/usr/bin/env node
'use strict';
// Read-only CI packaging: produces a standalone candidate in the runner.
// No Git writes, version changes, credentials, merge or deployment actions.
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),vm=require('vm');
const m=JSON.parse(fs.readFileSync('docs/branch/GPT-022-source-manifest.json','utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(sha('index.html')!==m.mainIndexSHA256)throw Error('Main program changed; rebase and review before rebuilding');
for(const [p,h] of Object.entries(m.sources))if(sha(p)!==h)throw Error('Approved source changed: '+p);
const original=fs.readFileSync('index.html');
try{
  cp.execFileSync(process.execPath,['build-use-scales-release021.js'],{stdio:'inherit'});
  if(sha('index.html')!==m.candidateIndexSHA256)throw Error('Full generated candidate differs from the approved artwork program');
  const html=fs.readFileSync('index.html','utf8');
  let scripts=0;
  for(const q of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(q[1],{filename:'candidate-inline-'+(++scripts)+'.js'});
  const before=original.toString('utf8');
  for(const re of [/<span id="startVersion456">[^<]+<\/span>/,/const GAME_VER='[^']+';/,/const GAME_ANCHOR='[^']+';/]){
    if(before.match(re)?.[0]!==html.match(re)?.[0])throw Error('Protected version label changed');
  }
  const receipt={card:m.card,baseMain:m.baseMain,sourceCandidate:m.sourceCandidate,
    indexSHA256:sha('index.html'),indexBytes:fs.statSync('index.html').size,inlineScripts:scripts,
    sourceFiles:Object.keys(m.sources).length,gitIndexRemainsMain:true,
    scope:'candidate generation in CI only; no Git commit/ref/push/merge/deploy',
    limitations:m.limitations,pixelGuards:m.pixelGuards};
  fs.writeFileSync('candidate-build022-receipt.json',JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify(receipt));
}catch(e){fs.writeFileSync('index.html',original);throw e;}

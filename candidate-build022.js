#!/usr/bin/env node
'use strict';
// Rebuild pinned sources in isolation and compare with the committed index.
// Packaging and syntax verification only; no game execution or Git mutation.
const fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto'),cp=require('child_process'),vm=require('vm');
const root=__dirname,m=JSON.parse(fs.readFileSync(path.join(root,'docs/branch/GPT-022-source-manifest.json'),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const current=fs.readFileSync(path.join(root,'index.html'));
for(const [p,h] of Object.entries({...m.sources,...m.integrationSources}))if(hash(fs.readFileSync(path.join(root,p)))!==h)throw Error('Pinned source changed: '+p);
const baseline=cp.execFileSync('git',['show',m.baseMain+':index.html'],{cwd:root,maxBuffer:16*1024*1024});
if(hash(baseline)!==m.mainIndexSHA256)throw Error('Immutable main baseline differs');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'use022-rebuild-'));
try{
  fs.writeFileSync(path.join(temp,'index.html'),baseline);
  for(const p of Object.keys(m.sources)){const out=path.join(temp,p);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(root,p),out);}
  cp.execFileSync(process.execPath,['build-use-scales-release021.js'],{cwd:temp,stdio:'inherit'});
  const rebuilt=fs.readFileSync(path.join(temp,'index.html'));
  if(hash(rebuilt)!==m.candidateIndexSHA256)throw Error('Approved candidate rebuild differs');
  const verify=process.argv.includes('--verify-materialized');
  if(verify){if(!current.equals(rebuilt))throw Error('Committed index differs from exact approved source rebuild');}
  else{if(hash(current)!==m.mainIndexSHA256)throw Error('Source-only generation requires pinned main input; use --verify-materialized for an integrated index');fs.writeFileSync(path.join(root,'index.html'),rebuilt);}
  let inlineScripts=0;
  for(const q of rebuilt.toString('utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(q[1],{filename:'candidate-inline-'+(++inlineScripts)+'.js'});
  const before=baseline.toString('utf8'),html=rebuilt.toString('utf8');
  for(const re of [/<span id="startVersion456">[^<]+<\/span>/,/const GAME_VER='[^']+';/,/const GAME_ANCHOR='[^']+';/]){
    if(before.match(re)?.[0]!==html.match(re)?.[0])throw Error('Protected version label changed');
  }
  const receipt={card:m.card,baseMain:m.baseMain,sourceCandidate:m.sourceCandidate,indexSHA256:hash(rebuilt),indexBytes:rebuilt.length,inlineScripts,sourceFiles:Object.keys(m.sources).length,mode:verify?'verify-committed-materialized':'source-only-generation',committedIndexVerified:verify,scope:'isolated pinned-source rebuild; no Git writes, merge or deployment',limitations:m.limitations,pixelGuards:'See cloud acceptance reports; packaging does not assert game guards passed'};
  fs.writeFileSync(path.join(root,'candidate-build022-receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
}finally{fs.rmSync(temp,{recursive:true,force:true});}

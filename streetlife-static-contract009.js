#!/usr/bin/env node
'use strict';
// GPT-009 static provenance only: never evaluates game/art code or starts Chrome.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),os=require('os'),vm=require('vm');
const {execFileSync}=require('child_process');
const ROOT=__dirname,BASE='559a419270e84d7d67b883581ddef8f24302a41b';
const BASE_HTML_SHA256='28eea2184153adb55437958a7055047a09abcd129346607852ecd1e86860afe4';
const expectedAdditions=[...[274,275,276].flatMap(k=>Array.from({length:4},(_,v)=>`bld.${k}_1_${v}`)),...['bench','planter','fingerpost'].flatMap(t=>Array.from({length:4},(_,v)=>`streetLife009.${t}_${v}`))].sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic009(){
  const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html'));
  if(hash(baseline)!==BASE_HTML_SHA256)throw Error('T721 product pin mismatch');
  const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean);
  const allowed=new Set(['index.html','smoke.js']);
  const protectedManifest={};
  for(const p of oldFiles){if(allowed.has(p))continue;const b=baseFile(p),c=fs.readFileSync(path.join(ROOT,p));if(!b.equals(c))throw Error('Protected T721 source changed: '+p);protectedManifest[p]=hash(c);}
  const smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),oldSmoke=baseFile('smoke.js').toString();
  const smokeLines=smoke.split('\n'),addedSmoke=smokeLines.filter(l=>l.includes('streetLifeSelftest009'));
  if(addedSmoke.length!==1||smokeLines.filter(l=>!l.includes('streetLifeSelftest009')).join('\n')!==oldSmoke)throw Error('Smoke must retain all prior checks and add exactly one read-only GPT-009 selftest row');
  const html=current.toString(),old=baseline.toString();
  for(const pattern of[/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(pattern))!==JSON.stringify(old.match(pattern)))throw Error('Release labels changed');
  const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
  for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][1],{filename:'index-inline-'+i+'.js'});
  const art=fs.readFileSync(path.join(ROOT,'british-streetlife-art009.js'),'utf8');
  new vm.Script(art,{filename:'british-streetlife-art009.js'});
  if(/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('New art depends on random, fonts or storage');
  if(html.split(art.trim()).length!==2)throw Error('New original art must be embedded exactly once');
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'streetlife009-static-'));
  let rebuilt;
  try{const input=path.join(tmp,'base.html'),output=path.join(tmp,'candidate.html');fs.writeFileSync(input,baseline);execFileSync('python3',[path.join(ROOT,'integrate-streetlife009.py'),'--input',input,'--output',output],{cwd:ROOT,maxBuffer:4*1024*1024});rebuilt=fs.readFileSync(output);if(!rebuilt.equals(current))throw Error('Candidate differs from deterministic count-checked T721 integration');}
  finally{fs.rmSync(tmp,{recursive:true,force:true});}
  const sourceSHA256=hash(current);
  return {ok:true,htmlExact:true,protectedExact:true,baselineSHA256:BASE_HTML_SHA256,sourceSHA256,additionCount:24,expectedAdditions,protectedManifest,integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-streetlife009.py'))),inlineScripts:scripts.length};
}
module.exports={BASE,expectedAdditions,verifyStatic009};
if(require.main===module)console.log(JSON.stringify(verifyStatic009(),null,2));

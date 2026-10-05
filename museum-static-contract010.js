#!/usr/bin/env node
'use strict';
// Data/source verification only. Never executes game/art code or starts Chrome.
// T722 and every existing test/baseline remain immutable during image review.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),os=require('os'),vm=require('vm');
const {execFileSync}=require('child_process');
const ROOT=__dirname,BASE='d9dfe87689fa841edb8775d0f95db77d9f2deb5b';
const BASE_HTML_SHA256='b00099c4837038812278ee5e3f86528416731e24904559e60befb575b315934f';
const expectedAdditions=[...Array.from({length:4},(_,v)=>`bld.277_1_${v}`),...['gate','garden','bench'].flatMap(t=>Array.from({length:4},(_,v)=>`museum010.${t}_${v}`))].sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic010(){
  const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html'));
  if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Immutable T722 product byte pin changed');
  const release=current.toString().includes("const GAME_VER='14.27'")?require('./museum-release-contract010').verifyRelease010():null;
  const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean);
  const allowed=new Set(['index.html','smoke.js',...(release?['fp.json','AUTORUN-LOG.md']:[])]),protectedManifest={};
  for(const p of oldFiles){if(allowed.has(p))continue;const b=baseFile(p),c=fs.readFileSync(path.join(ROOT,p));const boundedPublicObserver=release&&p==='.github/workflows/streetlife-public009.yml'&&release.publicWorkflowExact&&hash(c)===release.publicWorkflowSHA256;if(!b.equals(c)&&!boundedPublicObserver)throw Error('Protected T722 source changed: '+p);protectedManifest[p]=hash(c);}
  const smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),oldSmoke=baseFile('smoke.js').toString();
  const lines=smoke.split('\n'),added=lines.filter(l=>l.includes('museumSelftest010'));
  if(added.length!==1||lines.filter(l=>!l.includes('museumSelftest010')).join('\n')!==oldSmoke)throw Error('Smoke must retain all prior checks and add exactly one museumSelftest010 row');
  const html=current.toString(),old=baseline.toString();
  if(!release)for(const pattern of[/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(pattern))!==JSON.stringify(old.match(pattern)))throw Error('Unapproved release metadata changed');
  const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
  for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][1],{filename:'index-inline-'+i+'.js'});
  const art=fs.readFileSync(path.join(ROOT,'british-museum-art010.js'),'utf8'),gameplay=fs.readFileSync(path.join(ROOT,'museum-gameplay010.js'),'utf8');
  new vm.Script(art,{filename:'british-museum-art010.js'});
  new vm.Script(gameplay,{filename:'museum-gameplay010.js'});
  if(/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('New art depends on random, fonts or storage');
  if(!art.trim()||html.split(art.trim()).length!==2)throw Error('Original museum art must be embedded exactly once');
  if(!gameplay.trim())throw Error('Museum gameplay module is empty');
  // Gameplay may have early and late insertion points. The immutable-input,
  // byte-exact full rebuild below covers every injected segment without
  // incorrectly requiring a split module to appear as one contiguous block.
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'museum010-static-'));
  try{
    const input=path.join(tmp,'t722.html'),output=path.join(tmp,'candidate.html');fs.writeFileSync(input,baseline);
    execFileSync('python3',[path.join(ROOT,'integrate-museum010.py'),'--input',input,'--output',output],{cwd:ROOT,maxBuffer:4*1024*1024});
    if(!fs.readFileSync(input).equals(baseline))throw Error('Integrator modified its immutable T722 input');
    const comparison=release?Buffer.from(require('./museum-release-contract010').normalizeReleaseHTML010(html)):current;
    if(!fs.readFileSync(output).equals(comparison))throw Error('Product differs from deterministic count-checked T722 integration and approved release labels');
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
  return{ok:true,base:BASE,htmlExact:true,protectedExact:true,release:!!release,version:release?.version||'14.26',anchor:release?.anchor||'T722',fpExact:release?.fpExact??true,logExact:release?.logExact??true,releaseLogEntry:release?.releaseLogEntry||'',baselineSHA256:BASE_HTML_SHA256,sourceSHA256:hash(current),additionCount:16,expectedAdditions,protectedManifest,integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-museum010.py'))),artSHA256:hash(art),gameplaySHA256:hash(gameplay),inlineScripts:scripts.length};
}
module.exports={BASE,BASE_HTML_SHA256,expectedAdditions,verifyStatic010};
if(require.main===module){const q=verifyStatic010();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}

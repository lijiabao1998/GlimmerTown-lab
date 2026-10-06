#!/usr/bin/env node
'use strict';
// Source/data only. This module never executes game, art or browser runtime.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),os=require('node:os'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='c7f0ab6e6d2c37651fd13802049b8079c5f5d37b',BASE_HTML_SHA256='e00128d491f81d37cd68c4afe6661bf7ff500ac9d6d8d697657f5b3a8a1edff5',BASE_FP_SHA256='4d658d9c9679d3fa03f29397dd7b60ef1a6408bc3cbf5aca1269c6badf896683';
const THEMES=Object.freeze(['mooringBitts','quayCapstan','lifebuoyStand','anchorDisplay','withyPots','netDryingRack']);
const expectedAdditions=THEMES.flatMap(t=>[0,1,2,3].map(v=>'quayside017.'+t+'_'+v)).sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic017(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),sourceSHA256=hash(current);
 if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Exact immutable released T729 HTML required');
 const approved=require('./quayside-release-contract017'),release=html.includes("const GAME_VER='14.34'")?approved.verifyRelease017():null,comparison=release?Buffer.from(approved.normalizeReleaseHTML017(html)):current;
 if(hash(comparison)!==approved.APPROVED)throw Error('Exact owner-image-approved quayside product required');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 for(const file of oldFiles){if(['index.html','smoke.js'].includes(file))continue;const old=baseFile(file),now=fs.readFileSync(path.join(ROOT,file));const bounded=release&&((file==='fp.json'&&release.fpExact)||(file==='AUTORUN-LOG.md'&&release.logExact));if(!old.equals(now)&&!bounded)throw Error('Protected complete T729 source changed: '+file);protectedManifest[file]=hash(now);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),rows=smoke.split('\n');
 if(rows.filter(l=>l.includes('quaysideSelftest017')).length!==1||rows.filter(l=>!l.includes('quaysideSelftest017')).join('\n')!==oldSmoke)throw Error('Keep every original smoke row; add exactly one quayside selftest');
 if(!release&&hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No baseline promotion before this new round image approval');
 if(!release)for(const re of [/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(re))!==JSON.stringify(baseline.toString().match(re)))throw Error('Candidate must keep exact released T729 labels');
 const cold=JSON.parse(baseFile('coldload-patch011.json'));if(html.split(cold.to).length!==2)throw Error('Exact successful-load topology invalidation must survive');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];scripts.forEach((m,i)=>new vm.Script(m[1],{filename:'quayside-inline-'+i+'.js'}));
 const art=fs.readFileSync(path.join(ROOT,'british-quayside-details-art017.js'),'utf8'),game=fs.readFileSync(path.join(ROOT,'gameplay017.js'),'utf8');new vm.Script(art);new vm.Script(game);
 if(html.split(art).length!==2||/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('Exact original deterministic art embeds once without RNG, fonts or storage');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'quayside017-source-'));
 try{const src=path.join(tmp,'baseline.html'),out=path.join(tmp,'candidate.html');fs.writeFileSync(src,baseline);execFileSync('python3',[path.join(ROOT,'integrate-quayside017.py'),'--input',src,'--output',out],{cwd:ROOT,maxBuffer:8*1024*1024});if(!fs.readFileSync(out).equals(comparison)||!fs.readFileSync(src).equals(baseline))throw Error('Product must equal only deterministic count-checked additive edits');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 return{ok:true,base:BASE,version:release?.version||'14.33',anchor:release?.anchor||'T729',release:!!release,phase:release?'release':'candidate',publicationApproved:!!release,releaseLogEntry:release?.releaseLogEntry||'',normalizedHTMLSHA256:hash(comparison),boundedReleaseFiles:release?['fp.json','AUTORUN-LOG.md']:[],htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,sourceSHA256,baselineSHA256:BASE_HTML_SHA256,protectedManifest,inlineScripts:scripts.length,additionCount:24,expectedAdditions,artSHA256:hash(art),gameplaySHA256:hash(game),integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-quayside017.py')))};
}
module.exports={ROOT,BASE,BASE_HTML_SHA256,BASE_FP_SHA256,THEMES,expectedAdditions,hash,baseFile,verifyStatic017};
if(require.main===module){const q=verifyStatic017();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}

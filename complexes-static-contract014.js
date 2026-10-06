#!/usr/bin/env node
'use strict';
// Source/JSON/parse checks only. Never executes the game, art, or a browser.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='10bc4115f119498b4cc5836695348982b85fa9d1';
const BASE_HTML_SHA256='d08e96bc49a86f58a6671153c5b58da76022294e3efe1c10af5a6c3b9d9a565e';
const BASE_FP_SHA256='e6c272866c19a00f0986bf7abfc231454499e1d23eee0cb813f6099f11a7b3fb';
const THEMES=Object.freeze(['collegeGate','collegeCloister','collegeLibraryWalk','collegeGarden','manorGate','manorTerrace','manorParterre','manorPond','bathsPromenade','bathsFountain','bathsTowelGarden','bathsLaundryWalk','fireApron','fireHoseWalk','fireMemorialGarden','fireBrigadeWalk']);
const BUILDINGS=Object.freeze(Array.from({length:12},(_,i)=>282+i)),MAINS=Object.freeze([282,285,288,291]);
const ART_FILES=Object.freeze(['british-complex-primitives014.js','british-college-manor-art014.js','british-baths-fire-art014.js','british-complexes-art014.js']);
const expectedAdditions=[...BUILDINGS.flatMap(k=>[0,1,2,3].map(v=>`bld.${k}_1_${v}`)),...THEMES.flatMap(t=>[0,1,2,3].map(v=>`complexes014.${t}_${v}`))].sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic014(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),old=baseline.toString();
 if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Immutable deployed T726 HTML changed');
 const approved=require('./complexes-release-contract014'),release=html.includes("const GAME_VER='14.31'")?approved.verifyRelease014():null;
 const comparison=release?Buffer.from(approved.normalizeReleaseHTML014(html)):current;
 if(hash(comparison)!==approved.APPROVED)throw Error('Complexes product differs from the exact image-approved R5 candidate');
 const protectedManifest={},oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean);
 for(const p of oldFiles){if(['index.html','smoke.js'].includes(p))continue;const bytes=baseFile(p),actual=fs.readFileSync(path.join(ROOT,p));const bounded=release&&((p==='fp.json'&&release.fpExact)||(p==='AUTORUN-LOG.md'&&release.logExact));if(!bytes.equals(actual)&&!bounded)throw Error('Protected T726 source changed: '+p);protectedManifest[p]=hash(actual);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),lines=smoke.split('\n');
 if(lines.filter(l=>l.includes('complexSelftest014')).length!==1||lines.filter(l=>!l.includes('complexSelftest014')).join('\n')!==oldSmoke)throw Error('Keep all old smoke assertions and add exactly one complex selftest');
 if(!release)for(const re of[/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(re))!==JSON.stringify(old.match(re)))throw Error('No release label change before new image approval');
 if(!release&&(!html.includes("const GAME_VER='14.30'")||!html.includes("const GAME_ANCHOR='T726'")))throw Error('Candidate must retain T726/v14.30 labels');
 const cold=JSON.parse(baseFile('coldload-patch011.json'));
 if(old.split(cold.to).length!==2||html.split(cold.to).length!==2)throw Error('Exact T724 successful-load invalidation must survive');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
 for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][1],{filename:'complex-inline-'+i+'.js'});
 const artSHA256={};for(const p of ART_FILES){const s=fs.readFileSync(path.join(ROOT,p),'utf8');new vm.Script(s,{filename:p});if(!s.trim()||html.split(s.trim()).length!==2)throw Error('Original art must embed exactly once: '+p);if(/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(s))throw Error('Art cannot depend on RNG, font glyphs or storage: '+p);artSHA256[p]=hash(s);}
 const gameplay=fs.readFileSync(path.join(ROOT,'gameplay014.js'),'utf8');new vm.Script(gameplay,{filename:'gameplay014.js'});
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'complex014-static-'));
 try{const input=path.join(tmp,'baseline.html'),output=path.join(tmp,'candidate.html');fs.writeFileSync(input,baseline);execFileSync('python3',[path.join(ROOT,'integrate-complexes014.py'),'--input',input,'--output',output],{cwd:ROOT,maxBuffer:8*1024*1024});if(!fs.readFileSync(input).equals(baseline)||!fs.readFileSync(output).equals(comparison))throw Error('Product must exactly equal deterministic T726 additive integration');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 if(!release&&hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No fingerprint promotion before owner image approval');
 return{ok:true,base:BASE,version:release?.version||'14.30',anchor:release?.anchor||'T726',release:!!release,phase:release?'release':'candidate',htmlExact:true,protectedExact:true,fpExact:true,logExact:true,releaseLogEntry:release?.releaseLogEntry||'',coldLoadFixExact:true,sourceSHA256:hash(current),normalizedHTMLSHA256:hash(comparison),baselineSHA256:BASE_HTML_SHA256,additionCount:112,expectedAdditions,protectedManifest,boundedReleaseFiles:release?['AUTORUN-LOG.md','fp.json']:[],inlineScripts:scripts.length,integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-complexes014.py'))),artSHA256,gameplaySHA256:hash(gameplay)};
}
module.exports={ROOT,BASE,BASE_HTML_SHA256,BASE_FP_SHA256,THEMES,BUILDINGS,MAINS,ART_FILES,expectedAdditions,hash,baseFile,verifyStatic014};
if(require.main===module){const q=verifyStatic014();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}

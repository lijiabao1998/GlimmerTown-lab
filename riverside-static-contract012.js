#!/usr/bin/env node
'use strict';
// Source/data only. Native execution remains in isolated Actions.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),os=require('os'),vm=require('vm'),{execFileSync}=require('child_process');
const ROOT=__dirname,BASE='6583659d2e14db3b8ae92115d05432d64a0c989d';
const BASE_HTML_SHA256='05ed4e4bf11134b9ab15f921fc97512faa9d70744c59e90ea91000415c78e8cc';
const BASE_FP_SHA256='21026775f0461ade01c2428642d0ba9355fdb5d6c49c61b6170986b3252e4ee2';
const expectedAdditions=[...[278,279,280].flatMap(k=>Array.from({length:4},(_,v)=>`bld.${k}_1_${v}`)),...['quay','rail','promenade'].flatMap(t=>Array.from({length:4},(_,v)=>`riverside012.${t}_${v}`))].sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic012(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),old=baseline.toString();
 if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Immutable T724 HTML changed');
 const approved=require('./riverside-release-contract012'),release=html.includes("const GAME_VER='14.29'")?approved.verifyRelease012():null;
 const comparison=release?Buffer.from(approved.normalizeReleaseHTML012(html)):current;
 if(hash(comparison)!==approved.APPROVED)throw Error('Riverside product differs from the exact image-approved candidate');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 for(const p of oldFiles){if(['index.html','smoke.js'].includes(p))continue;const b=baseFile(p),c=fs.readFileSync(path.join(ROOT,p)),bounded=release&&((p==='fp.json'&&release.fpExact)||(p==='AUTORUN-LOG.md'&&release.logExact));if(!b.equals(c)&&!bounded)throw Error('Protected T724 source changed: '+p);protectedManifest[p]=hash(c);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),lines=smoke.split('\n'),added=lines.filter(l=>l.includes('riversideSelftest012'));
 if(added.length!==1||lines.filter(l=>!l.includes('riversideSelftest012')).join('\n')!==oldSmoke)throw Error('Keep all existing smoke assertions, add exactly one riverside selftest');
 if(!release)for(const pattern of[/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(pattern))!==JSON.stringify(old.match(pattern)))throw Error('Release labels changed before image approval');
 const fix=JSON.parse(baseFile('coldload-patch011.json'));
 if(html.split(fix.to).length!==2||old.split(fix.to).length!==2)throw Error('Exact T724 successful-load topology invalidation must survive unchanged');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][1],{filename:'riverside-inline-'+i+'.js'});
 const art=fs.readFileSync(path.join(ROOT,'british-riverside-art012.js'),'utf8'),gameplay=fs.readFileSync(path.join(ROOT,'gameplay012.js'),'utf8');
 new vm.Script(art);new vm.Script(gameplay);
 if(/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('Art cannot depend on random, fonts or storage');
 if(!art.trim()||html.split(art.trim()).length!==2)throw Error('Original art must be embedded exactly once');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'riverside012-static-'));
 try{const input=path.join(tmp,'baseline.html'),output=path.join(tmp,'candidate.html');fs.writeFileSync(input,baseline);execFileSync('python3',[path.join(ROOT,'integrate-riverside012.py'),'--input',input,'--output',output],{cwd:ROOT,maxBuffer:4*1024*1024});if(!fs.readFileSync(input).equals(baseline)||!fs.readFileSync(output).equals(comparison))throw Error('Product differs from count-checked immutable T724 integration and approved release labels');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 if(!release&&hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No baseline promotion before image approval');
 return{ok:true,base:BASE,version:release?.version||'14.28',anchor:release?.anchor||'T724',release:!!release,phase:release?'release':'candidate',htmlExact:true,protectedExact:true,fpExact:release?.fpExact??true,logExact:release?.logExact??true,releaseLogEntry:release?.releaseLogEntry||'',fixProofExact:true,coldLoadFixExact:true,sourceSHA256:hash(current),normalizedHTMLSHA256:hash(comparison),baselineSHA256:BASE_HTML_SHA256,additionCount:24,expectedAdditions,protectedManifest,boundedReleaseFiles:release?['AUTORUN-LOG.md','fp.json']:[],inlineScripts:scripts.length,integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-riverside012.py'))),artSHA256:hash(art),gameplaySHA256:hash(gameplay)};
}
module.exports={ROOT,BASE,BASE_HTML_SHA256,BASE_FP_SHA256,expectedAdditions,hash,baseFile,verifyStatic012};
if(require.main===module){const q=verifyStatic012();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}

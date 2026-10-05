#!/usr/bin/env node
'use strict';
// Source/data checks only. No game, art, browser or pixel code runs here.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='248ce802bf4f29333f242447f12b8106af2bdbf1';
const BASE_HTML_SHA256='282335f0bc731d56d83d1c129015740f54c4637b1f36e0721a77117e6f0e844c';
const BASE_FP_SHA256='752bd3575016232d1ddece51065f4d03a2f55e2a7af59a92a88eb8182e1994db';
const expectedAdditions=[...[0,1,2,3].map(v=>`bld.281_1_${v}`),...['ticket','plaza','rail','bench','planter','lamp'].flatMap(t=>[0,1,2,3].map(v=>`theatre013.${t}_${v}`))].sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic013(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),old=baseline.toString();
 if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Immutable deployed T725 HTML changed');
 const approved=require('./theatre-release-contract013'),release=html.includes("const GAME_VER='14.30'")?approved.verifyRelease013():null;
 const comparison=release?Buffer.from(approved.normalizeReleaseHTML013(html)):current;
 if(hash(comparison)!==approved.APPROVED)throw Error('Theatre product differs from the exact image-approved R4 candidate');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 for(const p of oldFiles){if(['index.html','smoke.js'].includes(p))continue;const b=baseFile(p),c=fs.readFileSync(path.join(ROOT,p)),bounded=release&&((p==='fp.json'&&release.fpExact)||(p==='AUTORUN-LOG.md'&&release.logExact));if(!b.equals(c)&&!bounded)throw Error('Protected T725 source changed: '+p);protectedManifest[p]=hash(c);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),lines=smoke.split('\n');
 if(lines.filter(l=>l.includes('theatreSelftest013')).length!==1||lines.filter(l=>!l.includes('theatreSelftest013')).join('\n')!==oldSmoke)throw Error('Keep all smoke assertions, add exactly one theatre selftest');
 if(!release)for(const pattern of[/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(pattern))!==JSON.stringify(old.match(pattern)))throw Error('Release labels must remain unchanged until new screenshot approval');
 if(!release&&(!html.includes("const GAME_VER='14.29'")||!html.includes("const GAME_ANCHOR='T725'")))throw Error('Expected unchanged T725 candidate labels');
 const fix=JSON.parse(baseFile('coldload-patch011.json'));
 if(html.split(fix.to).length!==2||old.split(fix.to).length!==2)throw Error('Exact T724 successful-load topology invalidation must survive unchanged');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][1],{filename:'theatre-inline-'+i+'.js'});
 const art=fs.readFileSync(path.join(ROOT,'british-theatre-art013.js'),'utf8'),gameplay=fs.readFileSync(path.join(ROOT,'gameplay013.js'),'utf8');
 new vm.Script(art);new vm.Script(gameplay);
 if(/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('Art must be independent of RNG, fonts and storage');
 if(!art.trim()||html.split(art.trim()).length!==2)throw Error('Original theatre art must be embedded exactly once');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'theatre013-static-'));
 try{const input=path.join(tmp,'baseline.html'),output=path.join(tmp,'candidate.html');fs.writeFileSync(input,baseline);execFileSync('python3',[path.join(ROOT,'integrate-theatre013.py'),'--input',input,'--output',output],{cwd:ROOT,maxBuffer:4*1024*1024});if(!fs.readFileSync(input).equals(baseline)||!fs.readFileSync(output).equals(comparison))throw Error('Product differs from deterministic count-checked T725 integration');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 if(!release&&hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No fingerprint promotion before screenshot approval');
 return{ok:true,base:BASE,version:release?.version||'14.29',anchor:release?.anchor||'T725',release:!!release,phase:release?'release':'candidate',htmlExact:true,protectedExact:true,fpExact:true,logExact:true,releaseLogEntry:release?.releaseLogEntry||'',fixProofExact:true,coldLoadFixExact:true,sourceSHA256:hash(current),normalizedHTMLSHA256:hash(comparison),baselineSHA256:BASE_HTML_SHA256,additionCount:28,expectedAdditions,protectedManifest,boundedReleaseFiles:release?['AUTORUN-LOG.md','fp.json']:[],inlineScripts:scripts.length,integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-theatre013.py'))),artSHA256:hash(art),gameplaySHA256:hash(gameplay)};
}
module.exports={ROOT,BASE,BASE_HTML_SHA256,BASE_FP_SHA256,expectedAdditions,hash,baseFile,verifyStatic013};
if(require.main===module){const q=verifyStatic013();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}

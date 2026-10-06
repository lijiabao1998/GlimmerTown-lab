#!/usr/bin/env node
'use strict';
// Pure source/data validation. Does not execute game, authored art or a browser.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),os=require('node:os'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='6d137b6be31a7f07867b8ebb181fb8ed3727b049',BASE_HTML_SHA256='3a2b5c8f4c1a9fa59a080d9ae7e9ea4dca36a35dc00cd17b9723141f6dedaa0f',BASE_FP_SHA256='89fad81273325654c7c54c82ee9721e03cbcf47f3fd6bfbb8377f0a41decdb2f';
const THEMES=Object.freeze(['heritageLantern','basketLamp','teaTradeSign','bookTradeSign','ironUrn','roseTrellis','sundialCourt','wicketCourt']);
const expectedAdditions=THEMES.flatMap(t=>[0,1,2,3].map(v=>'streetscape015.'+t+'_'+v)).sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
let memo=null;
function verifyStatic015(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),sourceSHA256=hash(current);
 if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Exact immutable T727 HTML required');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 for(const file of oldFiles){if(['index.html','smoke.js'].includes(file))continue;const old=baseFile(file),now=fs.readFileSync(path.join(ROOT,file));if(!old.equals(now))throw Error('Protected T727 file changed: '+file);protectedManifest[file]=hash(now);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),rows=smoke.split('\n');
 if(rows.filter(l=>l.includes('streetscapeSelftest015')).length!==1||rows.filter(l=>!l.includes('streetscapeSelftest015')).join('\n')!==oldSmoke)throw Error('Keep every existing smoke row and add exactly one streetscape row');
 if(hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No approved baseline promotion in this candidate');
 for(const re of [/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(re))!==JSON.stringify(baseline.toString().match(re)))throw Error('Version label is unchanged before release approval');
 const cold=JSON.parse(baseFile('coldload-patch011.json'));if(html.split(cold.to).length!==2)throw Error('Exact successful-load topology invalidation required');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];scripts.forEach((m,i)=>new vm.Script(m[1],{filename:'streetscape-inline-'+i+'.js'}));
 const art=fs.readFileSync(path.join(ROOT,'british-streetscape-art015.js'),'utf8'),game=fs.readFileSync(path.join(ROOT,'gameplay015.js'),'utf8');new vm.Script(art);new vm.Script(game);
 if(html.split(art).length!==2||/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('Original deterministic art embeds exactly once without RNG/fonts/storage');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'streetscape015-source-'));
 try{const src=path.join(tmp,'baseline.html'),out=path.join(tmp,'candidate.html');fs.writeFileSync(src,baseline);execFileSync('python3',[path.join(ROOT,'integrate-streetscape015.py'),'--input',src,'--output',out],{cwd:ROOT,maxBuffer:8*1024*1024});if(!fs.readFileSync(out).equals(current)||!fs.readFileSync(src).equals(baseline))throw Error('Candidate must equal only deterministic declared additive edits');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 return{ok:true,base:BASE,version:'14.31',anchor:'T727',release:false,phase:'candidate',publicationApproved:false,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,sourceSHA256,baselineSHA256:BASE_HTML_SHA256,protectedManifest,inlineScripts:scripts.length,additionCount:32,expectedAdditions,artSHA256:hash(art),gameplaySHA256:hash(game),integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-streetscape015.py')))};
}
module.exports={ROOT,BASE,BASE_HTML_SHA256,BASE_FP_SHA256,THEMES,expectedAdditions,hash,baseFile,verifyStatic015};
if(require.main===module){const q=verifyStatic015();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}

#!/usr/bin/env node
'use strict';
// Source/data only. This module never executes game, art or browser runtime.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),os=require('node:os'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='bcd77d5e959ed801d920766cbc9dc010cce19f58',BASE_HTML_SHA256='7d20033d3d50091849717d25820220951401b553123fe1fa588cdd63c2bb9609',BASE_FP_SHA256='811889c4b5a2ca97a87599310b6d6ba5a48cf6aa9ac7d7fd04792e2ca7fb8ea0';
const THEMES=Object.freeze(['pumpCourt','birdbathCourt','pottingBench','croquetCorner','chessCourt','orchardPress']);
const expectedAdditions=THEMES.flatMap(t=>[0,1,2,3].map(v=>'gardenLife016.'+t+'_'+v)).sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyStatic016(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),sourceSHA256=hash(current);
 if(hash(baseline)!==BASE_HTML_SHA256)throw Error('Exact immutable released T728 HTML required');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 for(const file of oldFiles){if(['index.html','smoke.js'].includes(file))continue;const old=baseFile(file),now=fs.readFileSync(path.join(ROOT,file));if(!old.equals(now))throw Error('Protected complete T728 source changed: '+file);protectedManifest[file]=hash(now);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),rows=smoke.split('\n');
 if(rows.filter(l=>l.includes('gardenLifeSelftest016')).length!==1||rows.filter(l=>!l.includes('gardenLifeSelftest016')).join('\n')!==oldSmoke)throw Error('Keep every original smoke row; add exactly one garden-life selftest');
 if(hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No baseline promotion before this new round image approval');
 for(const re of [/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(re))!==JSON.stringify(baseline.toString().match(re)))throw Error('Candidate must keep exact released T728 labels');
 const cold=JSON.parse(baseFile('coldload-patch011.json'));if(html.split(cold.to).length!==2)throw Error('Exact successful-load topology invalidation must survive');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];scripts.forEach((m,i)=>new vm.Script(m[1],{filename:'gardenlife-inline-'+i+'.js'}));
 const art=fs.readFileSync(path.join(ROOT,'british-garden-life-art016.js'),'utf8'),game=fs.readFileSync(path.join(ROOT,'gameplay016.js'),'utf8');new vm.Script(art);new vm.Script(game);
 if(html.split(art).length!==2||/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b/.test(art))throw Error('Exact original deterministic art embeds once without RNG, fonts or storage');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'gardenlife016-source-'));
 try{const src=path.join(tmp,'baseline.html'),out=path.join(tmp,'candidate.html');fs.writeFileSync(src,baseline);execFileSync('python3',[path.join(ROOT,'integrate-gardenlife016.py'),'--input',src,'--output',out],{cwd:ROOT,maxBuffer:8*1024*1024});if(!fs.readFileSync(out).equals(current)||!fs.readFileSync(src).equals(baseline))throw Error('Product must equal only deterministic count-checked additive edits');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 return{ok:true,base:BASE,version:'14.32',anchor:'T728',release:false,phase:'candidate',publicationApproved:false,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,sourceSHA256,baselineSHA256:BASE_HTML_SHA256,protectedManifest,inlineScripts:scripts.length,additionCount:24,expectedAdditions,artSHA256:hash(art),gameplaySHA256:hash(game),integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-gardenlife016.py')))};
}
module.exports={ROOT,BASE,BASE_HTML_SHA256,BASE_FP_SHA256,THEMES,expectedAdditions,hash,baseFile,verifyStatic016};
if(require.main===module){const q=verifyStatic016();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}

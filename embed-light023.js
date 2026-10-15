/* GPT-023: mechanical exact-source embedding; no simulation rewrite. */
'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),vm=require('node:vm');
const base='c62c67ebb2a4d15efb75c3bd77b58f7736596d0e';
const files=['british-complex-primitives014.js','british-streetlife-art009.js','british-museum-art010.js','british-riverside-art012.js','british-theatre-art013.js','british-college-manor-art014.js','british-baths-fire-art014.js'];
let html=fs.readFileSync('index.html','utf8');
for(const file of files){
  const original=cp.execFileSync('git',['show',base+':'+file],{encoding:'utf8',maxBuffer:2e6});
  const committed=cp.execFileSync('git',['show','HEAD:'+file],{encoding:'utf8',maxBuffer:2e6});
  const next=fs.readFileSync(file,'utf8');
  new vm.Script(next,{filename:file});
  if(html.includes(next))continue;
  const old=[...new Set([original,committed])].find(s=>html.split(s).length===2);
  if(!old)throw Error('Original or last committed source embed required: '+file);
  if(html.split(old).length!==2)throw Error('Unique original embed required: '+file);
  html=html.replace(old,next);
}
for(const [i,m]of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries())new vm.Script(m[1],{filename:'index inline '+i});
if(process.argv.includes('--check')){
  if(html!==fs.readFileSync('index.html','utf8'))throw Error('Stale exact-source embeds');
}else fs.writeFileSync('index.html',html,'utf8');
console.log('GPT-023 exact source embeds and syntax: '+files.length+' / OK');

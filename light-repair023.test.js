'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const ROOT=__dirname,base='c62c67ebb2a4d15efb75c3bd77b58f7736596d0e';
const files=['british-complex-primitives014.js','british-station-art008.js','british-streetlife-art009.js','british-museum-art010.js','british-riverside-art012.js','british-theatre-art013.js','british-complexes-art014.js','british-college-manor-art014.js','british-baths-fire-art014.js'];
function runCase(name,mode,mutate,want){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lab-light023-'));
  try{
    for(const file of [...files,'probeLightSide745.js','probeLightSide745.pins.json'])fs.copyFileSync(path.join(ROOT,file),path.join(dir,file));
    let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
    for(const file of files){const before=fs.readFileSync(path.join(dir,file),'utf8'),after=mutate(file,before);if(before===after)continue;assert.equal(html.split(before).length,2,'one authoritative embed '+file);html=html.replace(before,after);fs.writeFileSync(path.join(dir,file),after);}
    fs.writeFileSync(path.join(dir,'index.html'),html);
    const r=cp.spawnSync(process.execPath,[path.join(dir,'probeLightSide745.js'),mode],{encoding:'utf8',timeout:120000,maxBuffer:4e6});
    assert(!r.error, name+' process error');assert.equal(r.status,1,name+' must actually be RED');assert.equal(r.stderr,'',name+' must not fail at syntax/module loading');
    const red=r.stdout.split('\n').find(x=>x.startsWith('X '));assert(red&&want.test(red),name+' first RED is the original target: '+red);
    assert.match(r.stdout,/9 份都原樣嵌在裡面/,name+' source/body mismatches must not cause the RED');
    console.log(name+' | first RED: '+red);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
const changed=new Set(['british-complex-primitives014.js','british-streetlife-art009.js','british-museum-art010.js','british-riverside-art012.js','british-theatre-art013.js','british-college-manor-art014.js','british-baths-fire-art014.js']);
runCase('GPT-023 dead adapter / old twenty buildings','--check',(file,s)=>changed.has(file)?cp.execFileSync('git',['show',base+':'+file],{cwd:ROOT,encoding:'utf8',maxBuffer:2e6}):s,/^X --check：4 處光向反了$/);
runCase('GPT-023 missing valve','--valve',(file,s)=>{
  if(file!=='british-complex-primitives014.js')return s;
  assert.equal(s.split('root.__noLightFix745 || ').length,2,'one valve use');return s.replace('root.__noLightFix745 || ','');
},/^X --valve：逃生閥開時跟舊圖不同 [1-9]\d* 筆$/);
console.log('GPT-023 both original-target destructive controls: PASS');

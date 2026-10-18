'use strict';
// Pure source assembly and syntax checking. No game or browser is executed.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const file='index.html',source=fs.readFileSync(file,'utf8'),runtime=fs.readFileSync('bld-capacity032-runtime.js','utf8').trimEnd();
const old='if(ks.length>1200)return;',pd="if(ks.length>1200&&!(v===SPR.bld&&d===0&&p==='bld'&&ks.length<=2000))return;",path="if(ks.length>1200&&!(v===SPR.bld&&depth===0&&path==='bld'&&ks.length<=2000))return;";
let out=source;
if(out.includes(old)){
  assert.equal(out.split(old).length-1,4,'exactly four original scanner capacity checks');let i=0;
  out=out.replaceAll(old,()=>++i===3?path:pd);
}else{assert.equal(out.split(pd).length-1,3);assert.equal(out.split(path).length-1,1);}
const start='/* GPT-032 CAPACITY SELFTEST START */',end='/* GPT-032 CAPACITY SELFTEST END */',at=out.indexOf(start);
if(at>=0){const b=out.indexOf(end,at);assert(b>at);assert.equal(out.indexOf(start,at+1),-1);out=out.slice(0,at)+runtime+out.slice(b+end.length);}
else{const anchor='Object.assign(window.GV,{art574:';assert.equal(out.split(anchor).length,2);out=out.replace(anchor,()=>runtime+'\n'+anchor);}
let n=0;for(const m of out.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'capacity032-inline-'+(++n)});
if(process.argv.includes('--check'))assert.equal(source,out,'exact embedded capacity repair source');else fs.writeFileSync(file,out);
console.log('capacity032 four bounded root conditions and own selftest exact; '+n+' script blocks parse only');

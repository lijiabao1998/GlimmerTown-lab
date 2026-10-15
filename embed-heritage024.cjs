'use strict';
// Mechanical source embedding only. No game, browser or canvas execution locally.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const file='index.html',text=fs.readFileSync(file,'utf8'),marker='/* GPT-024 RUNTIME START',art='<!-- GPT-024 PURE ART START -->',css='<!-- GPT-024 CSS START -->';
const source=fs.readFileSync('british-heritage-art024.js','utf8').trimEnd(),runtime=fs.readFileSync('heritage024-runtime.js','utf8').trimEnd(),style=fs.readFileSync('heritage024.css','utf8').trimEnd();
let out=text;
function install(start,end,content,anchor){const a=out.indexOf(start);if(a>=0){assert.equal(out.indexOf(start,a+start.length),-1,'unique marker '+start);const b=out.indexOf(end,a);assert(b>a,'end marker '+end);out=out.slice(0,a)+content+out.slice(b+end.length);}else{assert.equal(out.split(anchor).length,2,'unique insertion '+anchor);out=out.replace(anchor,()=>content+'\n'+anchor);}}
install(art,'<!-- GPT-024 PURE ART END -->',art+'\n<script>\n'+source+'\n</script>\n<!-- GPT-024 PURE ART END -->','<!-- GPT-021 PURE ART START -->');
install(marker,'/* GPT-024 RUNTIME END */',runtime,'Object.assign(window.GV,{art574:');
install(css,'<!-- GPT-024 CSS END -->',css+'\n<style>\n'+style+'\n</style>\n<!-- GPT-024 CSS END -->',art);
const hook='installQuarterArt019(); // GPT-004: preserve selected day/night pixels after global silhouette post-process';
if(!out.includes('installQuarterArt019();installHeritage024(); // GPT-004:')){assert.equal(out.split(hook).length,2,'unique install tail');out=out.replace(hook,'installQuarterArt019();installHeritage024(); // GPT-004: preserve selected day/night pixels after global silhouette post-process');}
let n=0;for(const m of out.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){new vm.Script(m[1],{filename:'inline-'+(++n)});}assert(n>10,'all scripts parse');
if(process.argv.includes('--check'))assert.equal(out,text,'embedded sources must be exact');else fs.writeFileSync(file,out,'utf8');
console.log('heritage024 exact source / CSS / runtime embeddings and '+n+' syntax blocks: OK');

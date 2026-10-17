'use strict';
// Source and syntax only: this tool does not boot the game or a browser.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const file='index.html',text=fs.readFileSync(file,'utf8'),source=fs.readFileSync('british-wave03-art029.js','utf8').trimEnd(),runtime=fs.readFileSync('wave029-runtime.js','utf8').trimEnd(),style=fs.readFileSync('wave029.css','utf8').trimEnd();
let out=text;
function install(start,end,content,anchor){
  const a=out.indexOf(start);
  if(a>=0){assert.equal(out.indexOf(start,a+start.length),-1,'unique marker '+start);const b=out.indexOf(end,a);assert(b>a,'end marker '+end);out=out.slice(0,a)+content+out.slice(b+end.length);}
  else{assert.equal(out.split(anchor).length,2,'unique insertion '+anchor);out=out.replace(anchor,()=>content+'\n'+anchor);}
}
const art='<!-- GPT-029 PURE ART START -->',css='<!-- GPT-029 CSS START -->';
install(art,'<!-- GPT-029 PURE ART END -->',art+'\n<script>\n'+source+'\n</script>\n<!-- GPT-029 PURE ART END -->','<!-- GPT-027 PURE ART START -->');
install('/* GPT-029 RUNTIME START','/* GPT-029 RUNTIME END */',runtime,'Object.assign(window.GV,{art574:');
install(css,'<!-- GPT-029 CSS END -->',css+'\n<style>\n'+style+'\n</style>\n<!-- GPT-029 CSS END -->',art);
const old='installQuarterArt019();installHeritage024();installBritishWave025();installBritishWave027(); // GPT-004:',next='installQuarterArt019();installHeritage024();installBritishWave025();installBritishWave027();installBritishWave029(); // GPT-004:';
if(!out.includes(next)){assert.equal(out.split(old).length,2,'unique native installation tail');out=out.replace(old,next);}
let n=0;for(const m of out.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'inline-'+(++n)});
assert(n>10,'inline scripts found');
if(process.argv.includes('--check'))assert.equal(out,text,'wave029 embedded sources must be exact');else fs.writeFileSync(file,out,'utf8');
console.log('wave029 source/CSS/runtime exact; '+n+' inline blocks parse');

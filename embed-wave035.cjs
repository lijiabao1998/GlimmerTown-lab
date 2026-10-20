'use strict';
// Source and syntax only: this tool does not boot the game or a browser.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const file='index.html',text=fs.readFileSync(file,'utf8'),source=fs.readFileSync('british-wave07-art035.js','utf8').trimEnd(),runtime=fs.readFileSync('wave035-runtime.js','utf8').trimEnd(),style=fs.readFileSync('wave035.css','utf8').trimEnd();
let out=text;
function install(start,end,content,anchor){
  const a=out.indexOf(start);
  if(a>=0){assert.equal(out.indexOf(start,a+start.length),-1,'unique marker '+start);const b=out.indexOf(end,a);assert(b>a,'end marker '+end);out=out.slice(0,a)+content+out.slice(b+end.length);}
  else{assert.equal(out.split(anchor).length,2,'unique insertion '+anchor);out=out.replace(anchor,()=>content+'\n'+anchor);}
}
const art='<!-- GPT-035 PURE ART START -->',css='<!-- GPT-035 CSS START -->';
install(art,'<!-- GPT-035 PURE ART END -->',art+'\n<script>\n'+source+'\n</script>\n<!-- GPT-035 PURE ART END -->','<!-- GPT-033 PURE ART START -->');
install('/* GPT-035 RUNTIME START','/* GPT-035 RUNTIME END */',runtime,'Object.assign(window.GV,{art574:');
install(css,'<!-- GPT-035 CSS END -->',css+'\n<style>\n'+style+'\n</style>\n<!-- GPT-035 CSS END -->',art);
const old='installQuarterArt019();installHeritage024();installBritishWave025();installBritishWave027();installBritishWave029();installBritishWave030();installBritishWave031();installBritishWave033(); // GPT-004:',next='installQuarterArt019();installHeritage024();installBritishWave025();installBritishWave027();installBritishWave029();installBritishWave030();installBritishWave031();installBritishWave033();installBritishWave035(); // GPT-004:';
if(!out.includes(next)){assert.equal(out.split(old).length,2,'unique native installation tail');out=out.replace(old,next);}
let n=0;for(const m of out.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'inline-'+(++n)});
assert(n>10,'inline scripts found');
if(process.argv.includes('--check'))assert.equal(out,text,'wave035 embedded sources must be exact');else fs.writeFileSync(file,out,'utf8');
console.log('wave035 source/CSS/runtime exact; '+n+' inline blocks parse');

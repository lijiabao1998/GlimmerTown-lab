'use strict';
// Source composition only. Parsing does not execute the game or start Chrome.
const assert=require('node:assert/strict'),vm=require('node:vm');
const ART='<!-- GPT-041 PURE ART START -->',ART_END='<!-- GPT-041 PURE ART END -->',CSS='<!-- GPT-041 CSS START -->',CSS_END='<!-- GPT-041 CSS END -->';
const RUNTIME='/* GPT-041 RUNTIME START',RUNTIME_END='/* GPT-041 RUNTIME END */';
const OLD='installBritishWave039();installBritishWave040(); // GPT-004:',FULL='installBritishWave039();installBritishWave040();installBritishWave041(); // GPT-004:';
function unique(text,needle,label){assert.equal(text.split(needle).length,2,'wave041 unique '+(label||needle));}
function parse(text){let n=0;for(const m of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'inline-'+(++n)});assert(n>10,'wave041 complete inline script source');return n;}
function compose(text,sources){
  let out=text,runtime=sources.runtime.trimEnd();
  const put=(start,end,content,anchor)=>{const a=out.indexOf(start);if(a>=0){unique(out,start);const b=out.indexOf(end,a);assert(b>a,'wave041 block end');out=out.slice(0,a)+content+out.slice(b+end.length);}else{unique(out,anchor);out=out.replace(anchor,()=>content+'\n'+anchor);}};
  put(ART,ART_END,ART+'\n<script>\n'+sources.art.trimEnd()+'\n</script>\n'+ART_END,'<!-- GPT-040 PURE ART START -->');
  put(CSS,CSS_END,CSS+'\n<style>\n'+sources.css.trimEnd()+'\n</style>\n'+CSS_END,ART);
  put(RUNTIME,RUNTIME_END,runtime,'Object.assign(window.GV,{art574:');
  const tail=FULL;
  if(!out.includes(tail)){unique(out,OLD,'native installation tail');out=out.replace(OLD,tail);}else unique(out,tail,'native installation tail');
  parse(out);return out;
}
function strip(text){
  let out=text;
  for(const [start,end]of[[ART,ART_END],[CSS,CSS_END],[RUNTIME,RUNTIME_END]]){
    unique(out,start);unique(out,end);const a=out.indexOf(start),b=out.indexOf(end,a)+end.length;assert(b>a&&out[b]==='\n','wave041 exact block boundary');out=out.slice(0,a)+out.slice(b+1);
  }
  const tail=FULL;unique(out,tail,'declared installation tail');return out.replace(tail,OLD);
}
module.exports={compose,strip,parse};
